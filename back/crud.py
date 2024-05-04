from typing import Any, Optional
from sqlalchemy.orm import Session

from utils import get_password_hash
import models, schemas


def get_user(db: Session, user_id: int) -> Optional[models.User]:
    """
    Retrieve a user from the database by user_id.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to retrieve.

    Returns:
        Optional[models.User]: The user object if found, None otherwise.
    """
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    """
    Retrieve a user from the database based on their email.

    Args:
        db (Session): The database session.
        email (str): The email of the user to retrieve.

    Returns:
        Optional[models.User]: The user object if found, None otherwise.
    """
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[models.User]:
    """
    Retrieve a list of users from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to retrieve. Defaults to 100.

    Returns:
        list[models.User]: A list of user objects.
    """
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.User) -> models.User:
    """
    Create a new user in the database.

    Args:
        db (Session): The database session.
        user (schemas.User): The user data to be created.

    Returns:
        models.User: The created user object.
    """
    user_dict: dict[str, Any] = user.model_dump()
    user_dict["password"] = get_password_hash(user.password)
    db_user = models.User(**user_dict)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_event(
    db: Session, event: schemas.Event, current_user: schemas.User
) -> models.Events:
    """
    Create a new event in the database.

    Args:
        db (Session): The database session.
        event (schemas.Event): The event data to be created.
        current_user (schemas.User): The current user creating the event.

    Returns:
        models.Events: The created event object.
    """
    event_dict: dict[str, Any] = event.model_dump()
    event_dict["hostName"] = current_user.lastName
    db_event = models.Events(**event_dict)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int) -> None:
    """
    Delete an event from the database.

    Args:
        db (Session): The database session.
        event_id (int): The ID of the event to be deleted.

    Returns:
        None
    """
    db_event: Optional[models.Events] = (
        db.query(models.Events).filter(models.Events.id == event_id).first()
    )
    if db_event is not None:
        db.delete(db_event)
        db.commit()


def update_event(
    db: Session, event_id: int, event: schemas.Event
) -> Optional[models.Events]:
    """
    Update an event in the database.

    Args:
        db (Session): The database session.
        event_id (int): The ID of the event to update.
        event (schemas.Event): The updated event data.

    Returns:
        Optional[models.Events]: The updated event if it exists, otherwise None.
    """
    db_event: Optional[models.Events] = (
        db.query(models.Events).filter(models.Events.id == event_id).first()
    )
    if db_event is not None:
        for key, value in event.model_dump().items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
        return db_event


def get_events(db: Session, skip: int = 0, limit: int = 100) -> list[models.Events]:
    """
    Retrieve a list of events from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of events to skip. Defaults to 0.
        limit (int, optional): Maximum number of events to retrieve. Defaults to 100.

    Returns:
        list[models.Events]: A list of events.
    """
    return db.query(models.Events).offset(skip).limit(limit).all()


def get_event(db: Session, event_id: int) -> models.Events:
    """
    Retrieve an event from the database by its ID.

    Args:
        db (Session): The database session.
        event_id (int): The ID of the event to retrieve.

    Returns:
        models.Events: The event object.

    """
    return db.query(models.Events).filter(models.Events.id == event_id).first()


def get_groups(db: Session, skip: int = 0, limit: int = 100) -> list[models.Groups]:
    """
    Retrieve a list of groups from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to retrieve. Defaults to 100.

    Returns:
        list[models.Groups]: A list of group objects.
    """
    return db.query(models.Groups).offset(skip).limit(limit).all()


def get_group_by_name(db: Session, group_name: str) -> models.Groups:
    """
    Retrieve a group from the database by its name.

    Args:
        db (Session): The database session.
        group_name (str): The name of the group to retrieve.

    Returns:
        models.Groups: The group object.
    """
    return db.query(models.Groups).filter(models.Groups.name == group_name).first()


def create_group(db: Session, group: schemas.Group) -> models.Groups:
    """
    Create a new group in the database.

    Args:
        db (Session): The database session.
        group (schemas.Group): The group data to be created.

    Returns:
        models.Groups: The created group object.
    """
    group_dict: dict[str, Any] = group.model_dump()
    db_group = models.Groups(**group_dict)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


def get_status(db: Session, skip: int = 0, limit: int = 100) -> list[models.Status]:
    """
    Retrieve a list of status records from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): The number of records to skip. Defaults to 0.
        limit (int, optional): The maximum number of records to retrieve. Defaults to 100.

    Returns:
        list[models.Status]: A list of status records.
    """
    return db.query(models.Status).offset(skip).limit(limit).all()


def get_rooms(db: Session, skip: int = 0, limit: int = 100) -> list[models.Rooms]:
    """
    Retrieve a list of rooms from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to retrieve. Defaults to 100.

    Returns:
        list[models.Rooms]: A list of room objects.
    """
    return db.query(models.Rooms).offset(skip).limit(limit).all()

def get_room_by_name(db: Session, room_name: str) -> models.Rooms:
    """
    Retrieve a room from the database by its name.

    Args:
        db (Session): The database session.
        room_name (str): The name of the room to retrieve.

    Returns:
        models.Rooms: The room object.
    """
    return db.query(models.Rooms).filter(models.Rooms.name == room_name).first()

def create_room(db: Session, room: schemas.Room) -> models.Rooms:
    """
    Create a new room in the database.

    Args:
        db (Session): The database session.
        room (schemas.Room): The room data to be created.

    Returns:
        models.Rooms: The created room object.
    """
    room_dict: dict[str, Any] = room.model_dump()
    db_room = models.Rooms(**room_dict)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def create_notification(db: Session, notification: schemas.Notification) -> models.Notifications:
    """
    Create a new notification in the database.

    Args:
        db (Session): The database session.
        notification (schemas.Notification): The notification data to be created.

    Returns:
        models.Notifications: The created notification object.
    """
    notification_dict: dict[str, Any] = notification.model_dump()
    db_notification = models.Notifications(**notification_dict)
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification
    
def get_notifications(db: Session, skip: int = 0, limit: int = 100) -> list[models.Notifications]:
    """
    Retrieve a list of notifications from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to retrieve. Defaults to 100.

    Returns:
        list[models.Notifications]: A list of notification objects.
    """
    return db.query(models.Notifications).offset(skip).limit(limit).all()

def get_notifications_by_user(db: Session, user_id: int) -> list[models.Notifications]:
    """
    Retrieve a list of notifications for a specific user.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to retrieve notifications for.

    Returns:
        list[models.Notifications]: A list of notification objects.
    """
    return db.query(models.Notifications).filter(models.Notifications.userId == user_id).order_by(models.Notifications.id.desc()).all()

def delete_notifications_by_user(db: Session, user_id: int) -> None:
    """
    Delete all notifications for a specific user.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to delete notifications for.

    Returns:
        None
    """
    db.query(models.Notifications).filter(models.Notifications.userId == user_id).delete()
    db.commit()