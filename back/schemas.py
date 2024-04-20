from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: int
    is_admin: bool = False
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: str
    firstName: str | None
    lastName: str | None
    password: str
    groupId: int

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
    hostId: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

    class Config:
        orm_mode = True


class TokenData(BaseModel):
    email: str | None = None

    class Config:
        orm_mode = True