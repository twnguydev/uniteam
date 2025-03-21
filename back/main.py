from datetime import datetime, timedelta, timezone
from typing import Any, Generator, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal, engine
from utils import verify_password, generate_random_password
from mail import send_welcome_email, send_contact_admin_email

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins: list[str] = [
    "http://localhost:5030",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

models.Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_db() -> Generator[Session, Any, None]:
    """
    Returns a generator that yields a database session.

    Yields:
        Session: A SQLAlchemy database session.

    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def authenticate_user(email: str, password: str, db: Session) -> Optional[models.User]:
    """
    Authenticates a user by checking if the provided email and password match a user in the database.

    Args:
        email (str): The email of the user.
        password (str): The password of the user.
        db (Session): The database connection.

    Returns:
        Optional[models.User]: The authenticated user if the email and password match, otherwise None.
    """
    if user := crud.get_user_by_email(db, email):
        return user if verify_password(password, user.password) else None
    else:
        return None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create an access token using the provided data and expiration delta.

    Args:
        data (dict): The data to be encoded in the access token.
        expires_delta (Optional[timedelta], optional): The expiration delta for the access token.
            If not provided, a default expiration of 15 minutes will be used.

    Returns:
        str: The encoded access token.

    """
    to_encode: dict = data.copy()
    if expires_delta:
        expire: datetime = datetime.now(timezone.utc) + expires_delta
    else:
        expire: datetime = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.User:
    """
    Retrieves the current user based on the provided token.

    Args:
        token (str): The authentication token.
        db (Session): The database session.

    Returns:
        models.User: The current user.

    Raises:
        HTTPException: If the credentials cannot be validated.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload: dict[str, Any] = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError as e:
        raise credentials_exception from e
    user: Optional[models.User] = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
) -> schemas.Token:
    """
    Authenticates a user and generates an access token.

    Args:
        form_data (OAuth2PasswordRequestForm): The form data containing the username and password.
        db (Session): The database session.

    Returns:
        Token: The access token.

    Raises:
        HTTPException: If the user authentication fails.
    """
    user: Optional[models.User] = authenticate_user(
        form_data.username, form_data.password, db
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token: str = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")


@app.get("/me/", response_model=schemas.User)
async def read_users_me(
    current_user: schemas.User = Depends(get_current_user),
) -> schemas.User:
    """
    Retrieve the currently authenticated user.

    Parameters:
        current_user (schemas.User): The currently authenticated user.

    Returns:
        schemas.User: The currently authenticated user.

    """
    return current_user


@app.post("/contact/", response_model=dict[str, str])
async def contact_admin(
    contact: schemas.Contact
) -> dict[str, str]:
    """
    Send a contact message to the admin.

    Args:
        contact (schemas.Contact): The contact message data.

    Returns:
        dict[str, str]: A dictionary with a message indicating the success of the operation.

    """
    email_sent = send_contact_admin_email(contact.email, contact.name, contact.message, contact.subject)
    if not email_sent:
        raise HTTPException(status_code=500, detail="Error sending contact email")
    return {"message": "Contact message sent"}


@app.get("/groups/", response_model=list[schemas.Group])
async def read_groups(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.Groups]:
    """
    Retrieve a list of groups from the database.

    Args:
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to retrieve (default: 100).
        db (Session): Database session dependency.

    Returns:
        list[models.Groups]: List of group objects.

    """
    return crud.get_groups(db, skip=skip, limit=limit)


@app.post("/groups/", response_model=schemas.Group)
async def create_group(group: schemas.Group, db: Session = Depends(get_db)) -> models.Groups:
    """
    Create a new group in the database.

    Args:
        group (schemas.Group): The group data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.Groups: The created group.

    """
    if crud.get_group_by_name(db, group_name=group.name):
        raise HTTPException(status_code=400, detail="Group already registered")
    return crud.create_group(db=db, group=group)


@app.delete("/groups/{group_id}", response_model=dict[str, str])
async def delete_group(group_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    """
    Delete a group from the database.

    Args:
        group_id (int): The ID of the group to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict[str, str]: A dictionary with a message indicating the success of the deletion.

    """
    crud.delete_group(db, group_id=group_id)
    return {"message": "Group deleted"}


@app.get("/status/", response_model=list[schemas.Status])
async def read_status(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.Status]:
    """
    Retrieve a list of status records from the database.

    Args:
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to retrieve (default: 100).
        db (Session): Database session dependency.

    Returns:
        list[models.Status]: List of status records.

    """
    return crud.get_status(db, skip=skip, limit=limit)


@app.get("/rooms/", response_model=list[schemas.Room])
async def read_rooms(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.Rooms]:
    """
    Retrieve a list of rooms from the database.

    Args:
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to retrieve (default: 100).
        db (Session): Database session dependency.

    Returns:
        list[models.Rooms]: List of room objects.

    """
    return crud.get_rooms(db, skip=skip, limit=limit)


@app.post("/rooms/", response_model=schemas.Room)
async def create_room(room: schemas.Room, db: Session = Depends(get_db)) -> models.Rooms:
    """
    Create a new room in the database.

    Args:
        room (schemas.Room): The room data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.Rooms: The created room.

    """
    if crud.get_room_by_name(db, room_name=room.name):
        raise HTTPException(status_code=400, detail="Room already registered")
    return crud.create_room(db=db, room=room)


@app.delete("/rooms/{room_id}", response_model=dict[str, str])
async def delete_room(room_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    """
    Delete a room from the database.

    Args:
        room_id (int): The ID of the room to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict[str, str]: A dictionary with a message indicating the success of the deletion.

    """
    crud.delete_room(db, room_id=room_id)
    return {"message": "Room deleted"}


@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.User, db: Session = Depends(get_db)) -> models.User:
    """
    Create a new user in the database.
    Generate a random password and send a welcome email to the user.

    Args:
        user (schemas.User): The user data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.User: The created user.

    Raises:
        HTTPException: If the email is already registered.
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    password = generate_random_password()
    user.password = password
    created_user = crud.create_user(db=db, user=user)
    if created_user is None:
        raise HTTPException(status_code=400, detail="Error creating user")

    email_sent = send_welcome_email(user.email, user.firstName, password)
    if not email_sent:
        raise HTTPException(status_code=500, detail="Error sending welcome email")

    return created_user


@app.get("/users/", response_model=list[schemas.User])
async def read_users(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.User]:
    """
    Retrieve a list of users from the database.

    Args:
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to retrieve (default: 100).
        db (Session): Database session object.

    Returns:
        list[models.User]: List of user objects.

    """
    return crud.get_users(db, skip=skip, limit=limit)


@app.get("/users/{user_id}", response_model=schemas.User)
async def read_user(user_id: int, db: Session = Depends(get_db)) -> models.User:
    """
    Retrieve a user from the database by user ID.

    Args:
        user_id (int): The ID of the user to retrieve.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.User: The user object retrieved from the database.

    Raises:
        HTTPException: If the user is not found in the database.
    """
    db_user: Optional[models.User] = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.delete("/users/{user_id}", response_model=dict[str, str])
async def delete_user(user_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    """
    Delete a user from the database.

    Args:
        user_id (int): The ID of the user to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict[str, str]: A dictionary with a message indicating the success of the deletion.

    """
    crud.delete_user(db, user_id=user_id)
    return {"message": "User deleted"}


@app.post("/events/", response_model=schemas.Event)
async def create_event(
    event: schemas.Event,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
) -> models.Events:
    """
    Create a new event.

    Args:
        event (schemas.Event): The event data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        current_user (schemas.User, optional): The current user. Defaults to Depends(get_current_user).

    Returns:
        models.Events: The created event.

    """
    return crud.create_event(db=db, event=event, current_user=current_user)


@app.delete("/events/{event_id}")
async def delete_event(event_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    """
    Delete an event from the database.

    Args:
        event_id (int): The ID of the event to be deleted.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict[str, str]: A dictionary with a message indicating the success of the deletion.
    """
    crud.delete_event(db, event_id=event_id)
    return {"message": "Event deleted"}


@app.put("/events/{event_id}", response_model=schemas.Event)
async def update_event(
    event_id: int, event: schemas.Event, db: Session = Depends(get_db)
) -> models.Events:
    """
    Update an event in the database.

    Args:
        event_id (int): The ID of the event to update.
        event (schemas.Event): The updated event data.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.Events: The updated event.

    """
    return crud.update_event(db=db, event_id=event_id, event=event)


@app.get("/events/", response_model=list[schemas.Event])
async def read_events(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.Events]:
    """
    Retrieve a list of events from the database.

    Args:
        skip (int): Number of events to skip (default: 0).
        limit (int): Maximum number of events to retrieve (default: 100).
        db (Session): Database session object.

    Returns:
        list[models.Events]: List of events retrieved from the database.
    """
    return crud.get_events(db, skip=skip, limit=limit)


@app.get("/events/{event_id}", response_model=schemas.Event)
async def read_event(event_id: int, db: Session = Depends(get_db)) -> models.Events:
    """
    Retrieve an event by its ID from the database.

    Args:
        event_id (int): The ID of the event to retrieve.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.Events: The retrieved event.

    Raises:
        HTTPException: If the event is not found in the database.
    """
    event: models.Events = crud.get_event(db, event_id=event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@app.get("/notifications/", response_model=list[schemas.Notification])
async def read_notifications(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.Notifications]:
    """
    Retrieve a list of notifications from the database.

    Args:
        skip (int): Number of notifications to skip (default: 0).
        limit (int): Maximum number of notifications to retrieve (default: 100).
        db (Session): Database session object.

    Returns:
        list[models.Notifications]: List of notifications.

    """
    return crud.get_notifications(db, skip=skip, limit=limit)


@app.get("/notifications/user/{user_id}", response_model=list[schemas.Notification])
async def read_notifications(
    user_id: int, db: Session = Depends(get_db)
) -> list[models.Notifications]:
    """
    Retrieve a list of notifications for a specific user.

    Args:
        user_id (int): The ID of the user to retrieve notifications for.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        list[models.Notifications]: A list of notifications for the specified user.

    """
    return crud.get_notifications_by_user(db, user_id=user_id)


@app.post("/notifications/", response_model=schemas.Notification)
async def create_notification(
    notification: schemas.Notification, db: Session = Depends(get_db)
) -> models.Notifications:
    """
    Create a new notification in the database.

    Args:
        notification (schemas.Notification): The notification data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.Notifications: The created notification.

    """
    return crud.create_notification(db=db, notification=notification)


@app.delete("/notifications/user/{user_id}", response_model=dict[str, str])
async def delete_notifications(user_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    """
    Delete all notifications for a specific user.

    Args:
        user_id (int): The ID of the user to delete notifications for.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict[str, str]: A dictionary with a message indicating the success of the deletion.

    """
    crud.delete_notifications_by_user(db, user_id=user_id)
    return {"message": "Notifications deleted"}


@app.post("/participants/", response_model=schemas.Participant)
async def create_participant(
    participant: schemas.Participant, db: Session = Depends(get_db)
) -> models.Participants:
    """
    Create a new participant in the database.

    Args:
        participant (schemas.Participant): The participant data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.Participants: The created participant.

    """
    return crud.add_participant_to_event(db=db, participant=participant)


@app.get("/participants/", response_model=list[schemas.Participant])
async def read_participants(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.Participants]:
    """
    Retrieve a list of participants from the database.

    Args:
        skip (int): Number of participants to skip (default: 0).
        limit (int): Maximum number of participants to retrieve (default: 100).
        db (Session): Database session object.

    Returns:
        list[models.Participants]: List of participants.

    """
    return crud.get_participants(db, skip=skip, limit=limit)


@app.get("/participants/{event_id}", response_model=list[schemas.Participant])
async def read_participants(
    event_id: int, db: Session = Depends(get_db)
) -> list[models.Participants]:
    """
    Retrieve a list of participants for a specific event.

    Args:
        event_id (int): The ID of the event to retrieve participants for.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        list[models.Participants]: A list of participants for the specified event.

    """
    return crud.get_participants_by_event(db, event_id=event_id)


@app.get("/participants/{user_id}/events", response_model=list[schemas.Event])
async def get_events(
    user_id: int, db: Session = Depends(get_db)
) -> list[models.Participants]:
    """
    Retrieve a list of events for a specific user invited to.

    Args:
        user_id (int): The ID of the user to retrieve events for.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        list[models.Events]: A list of events for the specified user.

    """
    return crud.get_events_invited_to(db, user_id=user_id)