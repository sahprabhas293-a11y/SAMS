# SAMS Software Requirements Specification

## 1. Introduction

Smart Academic Management System (SAMS) is a web-based application designed to help students organise assignments, monitor deadlines and track academic progress.

The application uses React for the frontend, FastAPI for the backend and MongoDB for persistent data storage.

## 2. Project Objectives

1. Provide student registration and login.
2. Allow students to manage academic assignments.
3. Display upcoming assignment deadlines.
4. Calculate assignment completion progress.
5. Protect student information through authentication.
6. Maintain separate assignment records for each student.

## 3. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR01 | Students can register an account | High |
| FR02 | Students can log in using email and password | High |
| FR03 | Students can log out | High |
| FR04 | Students can create assignments | High |
| FR05 | Students can view their assignments | High |
| FR06 | Students can edit assignments | High |
| FR07 | Students can delete assignments | High |
| FR08 | Students can mark assignments complete or pending | High |
| FR09 | Students can view upcoming deadlines | High |
| FR10 | Students can view overdue deadlines | Medium |
| FR11 | Students can view academic progress | Medium |
| FR12 | Students can access only their own assignments | High |

## 4. Non-Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR01 | Security | Password hashing and JWT authentication |
| NFR02 | Usability | Clear and responsive student dashboard |
| NFR03 | Maintainability | Separate frontend, backend and database layers |
| NFR04 | Data integrity | Validate assignment and registration inputs |
| NFR05 | Reliability | Persistent storage in MongoDB |
| NFR06 | Testability | Automated backend testing using pytest |

## 5. System Users

Student: Registers, logs in, manages assignments, checks deadlines and monitors progress.

## 6. System Constraints

The current application is designed for local development.

The system requires Python, Node.js and MongoDB.

The prototype does not currently provide email verification, password recovery or production-grade session management.

## 7. Acceptance Criteria

The system is acceptable when students can register and log in, manage their own assignments, view accurate deadlines and progress, and cannot access another student's assignments.

## 8. Additional Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR13 | View assignment deadlines in a monthly calendar | High |
| FR14 | Navigate between calendar months | Medium |
| FR15 | Search assignments by title, subject and description | High |
| FR16 | Filter assignments by priority and status | High |
| FR17 | Sort assignments by deadline or title | Medium |
| FR18 | Display assignment status analytics | High |
| FR19 | Display subject-wise academic progress | Medium |
| FR20 | Display upcoming and overdue deadline reminders | High |
| FR21 | Display authenticated student profile information | Medium |
