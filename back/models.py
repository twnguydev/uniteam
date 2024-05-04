from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime

from database import Base


class User(Base):
    """
    Represents a user in the system.

    Attributes:
        id (int): The unique identifier for the user.
        email (str): The email address of the user.
        password (str): The password of the user.
        firstName (str): The first name of the user.
        lastName (str): The last name of the user.
        groupId (int): The ID of the group the user belongs to.
        is_admin (bool): Indicates whether the user is an admin or not.
    """

    __tablename__: str = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    firstName = Column(String)
    lastName = Column(String)
    groupId = Column(Integer, ForeignKey("groups.id"))
    is_admin = Column(Boolean, default=False)


class Events(Base):
    """
    Represents an event.

    Attributes:
        id (int): The unique identifier of the event.
        name (str): The name of the event.
        dateStart (datetime): The start date and time of the event.
        dateEnd (datetime): The end date and time of the event.
        roomId (int): The ID of the room where the event takes place.
        groupId (int): The ID of the group associated with the event.
        description (str): The description of the event.
        statusId (int): The ID of the status of the event.
        hostName (str): The name of the event host.
    """

    __tablename__: str = "events"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    dateStart = Column(DateTime)
    dateEnd = Column(DateTime)
    roomId = Column(Integer, ForeignKey("rooms.id"))
    groupId = Column(Integer, ForeignKey("groups.id"))
    description = Column(String)
    statusId = Column(Integer, ForeignKey("status.id"), default=4)
    hostName = Column(String)


class Groups(Base):
    """
    Represents a group entity.

    Attributes:
        id (int): The unique identifier for the group.
        name (str): The name of the group.
    """

    __tablename__: str = "groups"

    id = Column(Integer, primary_key=True)
    name = Column(String)


class Status(Base):
    """
    Represents the status of an event.

    Attributes:
        id (int): The unique identifier of the status.
        name (str): The name of the status.
    """

    __tablename__: str = "status"

    id = Column(Integer, primary_key=True)
    name = Column(String)


class Rooms(Base):
    """
    Represents a room in the application.

    Attributes:
        id (int): The unique identifier of the room.
        name (str): The name of the room.
    """

    __tablename__: str = "rooms"

    id = Column(Integer, primary_key=True)
    name = Column(String)

class Notifications(Base):
    """
    Represents a notification in the application.

    Attributes:
        id (int): The unique identifier of the notification.
        userId (int): The ID of the user who the notification is for.
        message (str): The message of the notification.
    """

    __tablename__: str = "notifications"

    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey("users.id"))
    message = Column(String)