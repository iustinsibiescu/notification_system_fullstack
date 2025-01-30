import random
import asyncio
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.schemas import TaskCreate, TaskResponse
from backend.crud import create_task, update_task_status, create_task_notification, get_tasks_by_user, get_user_by_email
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
@router.get("/", response_model=list[TaskResponse])
def fetch_user_tasks(
    db: Session = Depends(get_db),
    user_email: str = Query(..., description="Email of the user to fetch tasks for")
    ):
    """Fetch tasks for a specific user by email."""
    user = get_user_by_email(db, user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email {user_email} does not exist."
        )
    
    tasks = get_tasks_by_user(db, user.id)

    for task in tasks:
        if task.created_at.tzinfo is None:
            task.created_at = task.created_at.replace(tzinfo=timezone.utc)
        if task.updated_at.tzinfo is None:
            task.updated_at = task.updated_at.replace(tzinfo=timezone.utc)

    return tasks

async def simulate_task_completion(user_id: int, task_id: int, db: Session):
    """Simulates task completion after a random delay and generates a notification."""
    delay = random.randint(1, 10)  # Random delay between 1 and 10 seconds
    await asyncio.sleep(delay)
    
    task = update_task_status(db=db, task_id=task_id, status="completed")
    
    if task:
        create_task_notification(db=db, task_id=task_id, user_id=user_id, notification_type=2)

# TODO implement middleware and use user auth instead of passing user_email
@router.post("/", response_model=TaskResponse)
def submit_task(task: TaskCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Endpoint to create a new task and simulate its completion."""
    user = get_user_by_email(db, task.user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email {task.user_email} does not exist."
        )
    
    new_task = create_task(db=db, task=task, user=user)
    background_tasks.add_task(simulate_task_completion, user_id=user.id, task_id=new_task.id, db=db)

    if new_task.created_at.tzinfo is None:
            new_task.created_at = new_task.created_at.replace(tzinfo=timezone.utc)
            
    return new_task
