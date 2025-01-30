# Notification System

This project is a fullstack system for managing tasks and notifications. It demonstrates how to submit tasks, track their statuses, and handle notifications in a RESTful API.

## Features
- Submit a new task (job).
- Track task statuses (`started running`, `completed`).
- Fetch notifications for tasks.
- Mark notifications as read.

---

## Prerequisites

Ensure you have the following installed on your system:

- **Python 3.9+**
- **pip** (Python package manager)

---

## Installation

Follow these steps to set up and run the project:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd notification_system
```

### 2. Create a Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install NPM Dependencies
```bash
cd frontend/
npm i
```

---

## Running the Application

### 1. Start the Server
To run the FastAPI application:
```bash
uvicorn backend.main:app --reload
```

This will start the server on `http://127.0.0.1:8000`.

### 2. Access API Documentation
Visit the interactive API documentation at:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 3. Start the frontend server
To run the FastAPI application:
```bash
cd frontend
npm run dev
```

### 4. Access the app
Go to [http://localhost:5173](http://localhost:5173)


---

## Database

The project uses **SQLite** for the database. The database file (`test.db`) is automatically created in the project root when you first run the application. **Alembic** is used to handle migrations