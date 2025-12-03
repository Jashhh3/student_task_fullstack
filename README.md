# Task Manager

A complete task manager application with a Node.js + React frontend and a Python + Flask backend, using MySQL as the database.

## Project Structure

```
task-manager/
  backend/      # Flask API
  frontend/     # React App
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL Server

## Setup Instructions

### 1. Database Setup

1.  Log in to your MySQL server.
2.  Create a database for the application:
    ```sql
    CREATE DATABASE task_manager_db;
    ```

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure environment variables:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      # Windows
      copy .env.example .env
      ```
    - Edit `.env` and update `SQLALCHEMY_DATABASE_URI` with your MySQL credentials:
      ```
      SQLALCHEMY_DATABASE_URI=mysql+pymysql://<username>:<password>@localhost/task_manager_db
      ```
5.  Initialize the database:
    ```bash
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
    ```
6.  Run the backend server:
    ```bash
    python run.py
    ```
    The server will start on `http://localhost:8000`.

### 3. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies (if not already installed):
    ```bash
    npm install
    ```
3.  Configure environment variables:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      # Windows
      copy .env.example .env
      ```
4.  Start the frontend application:
    ```bash
    npm start
    ```
    The application will open at `http://localhost:3000`.

## Usage

1.  Open the frontend application in your browser.
2.  Click "Sign Up" to create a new account.
3.  Log in with your credentials.
4.  Create, view, toggle, and delete tasks on the dashboard.
