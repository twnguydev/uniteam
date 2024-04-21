from typing import Any, Optional
from sqlalchemy.orm import Session

from utils import get_password_hash
import models, schemas


def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.User) -> models.User:
    user_dict: dict[str, Any] = user.model_dump()
    user_dict["password"] = get_password_hash(user.password)
    db_user = models.User(**user_dict)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_event(db: Session, event: schemas.Event, current_user: schemas.User) -> models.Events:
    event_dict: dict[str, Any] = event.model_dump()
    event_dict["hostName"] = current_user.lastName
    db_event = models.Events(**event_dict)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int) -> None:
    db_event: Optional[models.Events] = db.query(models.Events).filter(models.Events.id == event_id).first()
    if db_event is not None:
        db.delete(db_event)
        db.commit()

def update_event(db: Session, event_id: int, event: schemas.Event) -> Optional[models.Events]:
    db_event: Optional[models.Events] = db.query(models.Events).filter(models.Events.id == event_id).first()
    if db_event is not None:
        for key, value in event.model_dump().items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
        return db_event

def get_events(db: Session, skip: int = 0, limit: int = 100) -> list[models.Events]:
    return db.query(models.Events).offset(skip).limit(limit).all()

def get_event(db: Session, event_id: int) -> models.Events:
    return db.query(models.Events).filter(models.Events.id == event_id).first()

def get_groups(db: Session, skip: int = 0, limit: int = 100) -> list[models.Groups]:
    return db.query(models.Groups).offset(skip).limit(limit).all()

def get_status(db: Session, skip: int = 0, limit: int = 100) -> list[models.Status]:
    return db.query(models.Status).offset(skip).limit(limit).all()

def get_rooms(db: Session, skip: int = 0, limit: int = 100) -> list[models.Rooms]:
    return db.query(models.Rooms).offset(skip).limit(limit).all()