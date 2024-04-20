from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime

from database import Base


class User(Base):
    __tablename__: str = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    groupId = Column(Integer, ForeignKey("groups.id"))
    is_admin = Column(Boolean, default=False)


class Events(Base):
    __tablename__: str = "events"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    dateStart = Column(DateTime)
    dateEnd = Column(DateTime)
    roomId = Column(Integer, ForeignKey("rooms.id"))
    groupId = Column(Integer, ForeignKey("groups.id"))
    description = Column(String)
    statusId = Column(Integer, ForeignKey("status.id"), default=4)
    hostId = Column(Integer, ForeignKey("users.id"))


class Groups(Base):
    __tablename__: str = "groups"

    id = Column(Integer, primary_key=True)
    name = Column(String)

class Status(Base):
    __tablename__: str = "status"

    id = Column(Integer, primary_key=True)
    name = Column(String)

class Rooms(Base):
    __tablename__: str = "rooms"

    id = Column(Integer, primary_key=True)
    name = Column(String)
