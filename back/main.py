from datetime import datetime, timedelta, timezone
from typing import Any, Generator, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal, engine
from utils import verify_password

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

@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.User, db: Session = Depends(get_db)) -> models.User:
    """
    Create a new user in the database.

    Args:
        user (schemas.User): The user data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        models.User: The created user.

    Raises:
        HTTPException: If the email is already registered.
    """
    if crud.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="email already registered")
    return crud.create_user(db=db, user=user)


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
