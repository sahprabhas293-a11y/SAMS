# Smart Academic Management System (SAMS)

## Project Overview

Smart Academic Management System (SAMS) is a web-based
application that helps students manage academic assignments,
monitor deadlines and track academic progress through a
centralised digital platform.

## Academic Information

University: Ravensbourne University London
Programme: BSc Computer Science
Module: CMS22202 Software Engineering
Project: Smart Academic Management System

## Features

- Student registration and authentication
- Secure password hashing
- JWT-based access control
- Personal academic dashboard
- Assignment creation, editing and deletion
- Assignment completion tracking
- Upcoming and overdue deadlines
- Interactive academic calendar
- Assignment search, filtering and sorting
- Academic analytics and visual charts
- In-app deadline notifications
- Student profile
- Student-specific data isolation
- Persistent MongoDB storage

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React and Vite |
| Styling | CSS |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | FastAPI |
| Programming Language | Python |
| Database | MongoDB |
| Authentication | JWT |
| Password Security | Argon2 |
| Testing | pytest |
| Version Control | Git |

## System Architecture

Student -> React Frontend -> FastAPI Backend -> MongoDB

The application separates presentation, business logic
and persistent data storage into three architectural layers.

## Installation Requirements

- Python
- Node.js and npm
- MongoDB Community Server
- Git

## Backend Setup

Open a terminal in the project directory.

    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

Create the backend .env file using the provided .env.example
template and configure the MongoDB connection and JWT secret.

Ensure MongoDB is running before starting the backend.

    python -m uvicorn main:app --reload

Backend URL:

http://localhost:8000

API Documentation:

http://localhost:8000/docs

## Frontend Setup

Open a separate terminal.

    cd frontend
    npm install
    npm run dev

Frontend URL:

http://localhost:5173

## Using the Application

1. Register a student account.
2. Log in using the registered email and password.
3. Create academic assignments.
4. Set deadlines and priorities.
5. Update assignment completion status.
6. Explore the calendar, analytics and notifications.
7. View student profile information.
8. Log out when finished.

## Automated Testing

Run the backend test suite:

    cd backend
    source .venv/bin/activate
    python -m pytest tests/test_sams.py -v

The initial test suite successfully passed all seven tests.

The tests cover:

- Backend health
- Registration validation
- Invalid login rejection
- Authentication requirements
- Student registration and profile
- Assignment CRUD operations
- Student data isolation

## Project Documentation

The docs directory contains:

- Software requirements specification
- System architecture
- Agile development documentation
- Testing and validation
- Architecture diagram
- Use case diagram
- Class diagram
- Login sequence diagram

## Security and Privacy

Passwords are hashed using Argon2 before database storage.
JWT authentication protects assignment endpoints.
Students can access only their own assignment records.

Sensitive environment variables are excluded from version
control.

## Current Limitations

- Designed primarily for local development.
- Notifications are displayed within the application.
- No background push notifications or email reminders.
- No password recovery or email verification.
- Additional production security and performance testing
  would be required before public deployment.

## Future Development

- Email reminders
- Password recovery
- Multi-factor authentication
- Additional automated frontend testing
- Cloud deployment

## Academic Purpose

This application was developed as an academic Software
Engineering project to demonstrate requirements analysis,
system design, implementation, testing and evaluation.
