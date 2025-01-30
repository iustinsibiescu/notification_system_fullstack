from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.models import Task, TaskNotification, User
from backend.schemas import TaskCreate, UserCreate

def create_user(db: Session, user_data: UserCreate) -> User:
    """Creates a new user with the given email."""
    db_user = User(email=user_data.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> User | None:
    """Return a User object matching the given email, or None if not found."""
    return db.query(User).filter(User.email == email).first()

def get_all_users(db: Session):
    """Fetches all users from the database."""
    return db.query(User).all()

def create_task(db: Session, task: TaskCreate, user: User):
    """Creates a new task only if the provided user_email exists."""
    db_task = Task(
        title=task.title,
        status="running",
        user_id=user.id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    notification = TaskNotification(task_id=db_task.id, notification_type=1, user_id=user.id)
    db.add(notification)
    db.commit()

    return db_task

def update_task_status(db: Session, task_id: int, status: str):
    """Updates the status of a task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        task.status = status
        db.commit()
        db.refresh(task)
    return task

def get_tasks_by_user(db: Session, user_id: int):
    """Return all tasks belonging to a specific user."""
    return db.query(Task).filter(Task.user_id == user_id).all()

def create_task_notification(db: Session, task_id: int, user_id: int, notification_type: int):
    """Creates a new notification for a specific task."""
    notification = TaskNotification(task_id=task_id, user_id=user_id, notification_type=notification_type)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

def mark_notifications_as_read(db: Session, user_id: int):
    """Marks all unread notifications as read for the given user."""
    notifications = db.query(TaskNotification).filter(
        TaskNotification.user_id == user_id,
        TaskNotification.is_read == False
    ).all()

    if not notifications:
        return []

    for notification in notifications:
        notification.is_read = True

    db.commit()
    return notifications

def get_notifications_by_user(db: Session, user_id: int):
    """Return all notifications belonging to a specific user."""
    return db.query(TaskNotification).filter(TaskNotification.user_id == user_id).all()
