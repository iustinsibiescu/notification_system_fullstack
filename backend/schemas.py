from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

class TaskCreate(BaseModel):
    title: str | None = None
    user_email: EmailStr

class TaskResponse(BaseModel):
    id: int
    title: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class NotificationResponse(BaseModel):
    id: int
    task_id: int
    is_read: bool
    created_at: datetime
    notification_type: int

    class Config:
        orm_mode = True
