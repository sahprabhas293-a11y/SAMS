# SAMS System Architecture

## 1. Architectural Approach

SAMS uses a three-layer web application architecture.

Presentation Layer:
React and Vite provide the user interface.

Application Layer:
FastAPI handles HTTP requests, validation, authentication and assignment operations.

Data Layer:
MongoDB stores student accounts and assignments.

## 2. Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React |
| Build Tool | Vite |
| HTTP Client | Axios |
| Backend | FastAPI |
| Database | MongoDB |
| Password Hashing | Argon2 through pwdlib |
| Authentication | JWT |
| Backend Testing | pytest |
| Version Control | Git |

## 3. Data Model

### Users Collection

- _id: MongoDB ObjectId
- name: Student name
- email: Unique student email
- password_hash: Hashed password

### Assignments Collection

- _id: MongoDB ObjectId
- user_id: Owner's MongoDB ObjectId
- title: Assignment title
- subject: Academic subject
- description: Additional information
- deadline: Submission deadline
- priority: Low, Medium or High
- completed: Completion status
- created_at: Creation timestamp

## 4. Authentication Process

1. Student submits registration details.
2. Backend validates the information.
3. Password is hashed before storage.
4. Student logs in with email and password.
5. Backend verifies the credentials.
6. Backend issues a JWT access token.
7. Frontend includes the token in protected assignment requests.
8. Backend identifies the authenticated student.
9. Database queries restrict assignment access to that student.

## 5. Security Considerations

SAMS uses password hashing and token-based authentication.

Assignment queries use the authenticated user's identifier to enforce record ownership.

The prototype requires additional hardening before public deployment, including rate limiting, secure transport, session revocation and production configuration.
