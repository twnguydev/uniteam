from datetime import datetime, timedelta, timezone
from typing import Any, Generator, List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal, engine
from utils import verify_password

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins: List[str] = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

models.Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db() -> Generator[Session, Any, None]:
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def authenticate_user(email: str, password: str, db) -> models.User | None:    
    if user := crud.get_user_by_email(db, email):
        return user if verify_password(password, user.password) else None
    else:
        return None
    
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode: dict = data.copy()
    if expires_delta:
        expire: datetime = datetime.now(timezone.utc) + expires_delta
    else:
        expire: datetime = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
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
    user: models.User | None = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
) -> schemas.Token:
    user: models.User | None = authenticate_user(form_data.username, form_data.password, db)
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
    return current_user


@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.User, db: Session = Depends(get_db)) -> models.User:
    if crud.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=List[schemas.User])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: schemas.User = Depends(get_current_user)) -> List[models.User]:
    return crud.get_users(db, skip=skip, limit=limit)


@app.get("/users/{user_id}", response_model=schemas.User)
async def read_user(user_id: int, db: Session = Depends(get_db), _: schemas.User = Depends(get_current_user)) -> models.User:
    db_user: models.User | None = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/events/", response_model=schemas.Event)
async def create_event(event: schemas.Event, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)) -> models.Events:
    return crud.create_event(db=db, event=event, current_user=current_user)

@app.delete("/events/{event_id}")
async def delete_event(event_id: int, db: Session = Depends(get_db), _: schemas.User = Depends(get_current_user)) -> dict[str, str]:
    crud.delete_event(db, event_id=event_id)
    return {"message": "Events deleted"}

@app.put("/events/{event_id}", response_model=schemas.Event)
async def update_event(event_id: int, event: schemas.Event, db: Session = Depends(get_db), _: schemas.User = Depends(get_current_user)) -> models.Events:
    return crud.update_event(db=db, event_id=event_id, event=event)

@app.get("/events/", response_model=List[schemas.Event])
async def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: schemas.User = Depends(get_current_user)) -> List[models.Events]:
    return crud.get_events(db, skip=skip, limit=limit)

@app.get("/events/{event_id}", response_model=schemas.Event)
async def read_event(event_id: int, db: Session = Depends(get_db), _: schemas.User = Depends(get_current_user)) -> models.Events:
    event: models.Events = crud.get_event(db, event_id=event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
