# SAMS Agile Development Process

## 1. Development Methodology

SAMS was developed incrementally, using an Agile-inspired approach.

Features were implemented in small stages, tested and integrated into the existing application.

## 2. Development Increments

### Increment 1: Project Setup

- Git repository initialisation
- React frontend setup
- FastAPI backend setup
- MongoDB database connection

### Increment 2: Assignment Management

- Assignment API
- Create, read, update and delete operations
- React assignment management interface

### Increment 3: Authentication

- Student registration
- Password hashing
- Student login
- JWT authentication
- Student-specific assignment ownership

### Increment 4: Dashboard

- Assignment statistics
- Recent assignments
- Upcoming deadlines
- Academic progress
- Sidebar navigation

### Increment 5: Testing

- Authentication tests
- Input validation tests
- CRUD tests
- Access protection tests
- Student data isolation tests

## 3. Version Control

Git was used to record project development.

Important commits include:

418973e - Initialize SAMS backend database and React dashboard

f9bde56 - Implement assignment CRUD API and React management interface

451e651 - Add automated authentication CRUD and student isolation tests

Additional commits should be recorded using the current Git history.

## 4. Development Reflection

Incremental development helped separate complex requirements into manageable features.

Backend endpoints were tested before being integrated with the React interface.

Authentication was introduced after the initial assignment management functionality.

Automated testing helped verify that assignment records were protected against access by other students.

## 5. Limitations

The development process is Agile-inspired. Formal Scrum ceremonies, sprint reviews and team responsibilities should only be documented if they were actually performed.

## 6. Development Increment 6: Frontend Enhancement

The final frontend development increment introduced:

- Interactive academic calendar
- Assignment search and filtering
- Academic analytics
- Deadline notifications
- Student profile
- Enhanced sidebar navigation

Existing backend endpoints and database structures were
retained to minimise unnecessary architectural changes.
