from datetime import date
from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: int
    is_admin: bool
    email: str
    username: str
    password: str

    class Config:
        orm_mode = True

class Event(BaseModel):
    id: int
    name: str
    dateStart: Optional[date] = None
    dateEnd: Optional[date] = None
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
    username: str | None = None

    class Config:
        orm_mode = True