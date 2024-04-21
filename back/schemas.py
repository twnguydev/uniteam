from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
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
    id: int
    name: str

    class Config:
        orm_mode = True

class Room(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class Status(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class Event(BaseModel):
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
    access_token: str
    token_type: str

    class Config:
        orm_mode = True


class TokenData(BaseModel):
    email: Optional[str] = None

    class Config:
        orm_mode = True