from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.crud import create_user, get_all_users
from backend.schemas import UserCreate, UserResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UserResponse)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    POST /users
    Creates a new user with the provided email.
    """
    return create_user(db, user)

@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """
    GET /users
    Returns a list of all users.
    """
    return get_all_users(db)
