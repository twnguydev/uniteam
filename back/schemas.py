from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class User(BaseModel):
    """
    Represents a user in the system.

    Attributes:
        id (int): The unique identifier for the user.
        is_admin (bool): Indicates whether the user is an admin or not. Defaults to False.
        firstName (Optional[str]): The first name of the user. Defaults to None.
        lastName (Optional[str]): The last name of the user. Defaults to None.
        email (str): The email address of the user.
        password (str): The password of the user.
        groupId (int): The group ID that the user belongs to.

    Config:
        orm_mode (bool): Indicates whether the class should be used in ORM mode or not.
    """

    id: int
    is_admin: bool = False
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: str
    password: str
    groupId: int

    class Config:
        orm_mode = True


class Group(BaseModel):
    """
    Represents a group with an ID and a name.

    Attributes:
        id (int): The ID of the group.
        name (str): The name of the group.

    Config:
        orm_mode (bool): Indicates whether the class should be used in ORM mode or not.
    """

    id: int
    name: str

    class Config:
        orm_mode = True


class Room(BaseModel):
    """
    Represents a room.

    Attributes:
        id (int): The ID of the room.
        name (str): The name of the room.

    Config:
        orm_mode (bool): Indicates whether the class should be used in ORM mode or not.
    """

    id: int
    name: str

    class Config:
        orm_mode = True


class Status(BaseModel):
    """
    Represents the status of an entity.

    Attributes:
        id (int): The unique identifier of the status.
        name (str): The name of the status.

    Config:
        orm_mode (bool): Indicates whether the class should be used in ORM mode or not.
    """

    id: int
    name: str

    class Config:
        orm_mode = True


class Contact(BaseModel):
    """
    Represents a contact message.

    Attributes:
        name (str): The name of the contact.
        email (str): The email address of the contact.
        message (str): The message of the contact.

    Config:
        orm_mode (bool): Indicates whether the class should be used in ORM mode or not.
    """

    name: str
    email: str
    subject: str = None
    message: str

    class Config:
        orm_mode = False


class Event(BaseModel):
    """
    Represents an event.

    Attributes:
        id (int): The unique identifier of the event.
        name (str): The name of the event.
        dateStart (Optional[datetime]): The start date and time of the event. Defaults to None.
        dateEnd (Optional[datetime]): The end date and time of the event. Defaults to None.
        roomId (int): The ID of the room where the event takes place.
        groupId (int): The ID of the group associated with the event.
        description (Optional[str]): The description of the event. Defaults to None.
        statusId (int): The ID representing the status of the event.
        hostName (Optional[str]): The name of the event host. Defaults to None.

    Config:
        orm_mode (bool): Indicates whether the class should be used in ORM mode or not.
    """

    id: int
    name: str
    dateStart: Optional[datetime] = None
    dateEnd: Optional[datetime] = None
    roomId: int
    groupId: int
    description: Optional[str] = None
    statusId: int
    hostName: Optional[str] = None

    class Config:
        orm_mode = True


class Token(BaseModel):
    """
    Represents a token object.

    Attributes:
        access_token (str): The access token.
        token_type (str): The type of the token.

    Config:
        orm_mode (bool): Whether to enable ORM mode or not.
    """

    access_token: str
    token_type: str

    class Config:
        orm_mode = True


class TokenData(BaseModel):
    """
    Represents the data stored in a token.

    Attributes:
        email (Optional[str]): The email address of the user.

    Config:
        orm_mode (bool): Whether to enable ORM mode or not.
    """

    email: Optional[str] = None

    class Config:
        orm_mode = True

class Notification(BaseModel):
    """
    Represents a notification.

    Attributes:
        id (int): The unique identifier of the notification.
        message (str): The message of the notification.
        userId (int): The ID of the user who will receive the notification.

    Config:
        orm_mode (bool): Whether to enable ORM mode or not.
    """

    id: int
    message: str
    userId: int

    class Config:
        orm_mode = True

class Participant(BaseModel):
    """
    Represents a participant in an event.

    Attributes:
        eventId (int): The ID of the event.
        userId (int): The ID of the user.

    Config:
        orm_mode (bool): Whether to enable ORM mode or not.
    """

    id: int
    eventId: int
    userId: int

    class Config:
        orm_mode = True