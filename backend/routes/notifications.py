from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from backend.crud import get_notifications_by_user, mark_notifications_as_read, get_user_by_email
from backend.schemas import NotificationResponse, UserCreate
from backend.database import SessionLocal
from datetime import timezone

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# TODO implement middleware and use user auth instead of passing user_email
@router.get("/", response_model=list[NotificationResponse])
def fetch_user_notifications(db: Session = Depends(get_db),
    user_email: str = Query(..., description="Email of the user to fetch notifications for")
):
    """
    Fetch notifications for a specific user by email.
    """
    user = get_user_by_email(db, user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    notifications = get_notifications_by_user(db, user.id)

    for notification in notifications:
        notification.id
        if notification.created_at.tzinfo is None:
            notification.created_at = notification.created_at.replace(tzinfo=timezone.utc)

    return notifications

# TODO implement middleware and use user auth instead of passing user_email
@router.post("/read")
def read_user_notifications(request: UserCreate, db: Session = Depends(get_db)):
    """
    Marks all notifications as read for the given user email.
    """
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email {request.email} does not exist."
        )

    updated_notifications = mark_notifications_as_read(db, user.id)
    return {"message": "Notifications marked as read", "count": len(updated_notifications)}
