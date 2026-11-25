from routes.auth import router as auth_router
from routes.assignments import router as assignments_router
from database import check_database_connection
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

app = FastAPI(
    title="Smart Academic Management System",
    description="Backend API for SAMS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "application": "Smart Academic Management System",
        "message": "SAMS Backend is running successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "SAMS Backend",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/api/info")
def system_info():
    return {
        "project": "SAMS",
        "frontend": "React",
        "backend": "FastAPI",
        "database": "MongoDB",
        "development_method": "Agile"
    }



@app.get("/db-health")
def database_health():
    result = check_database_connection()

    if result["status"] != "connected":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=503,
            detail=result
        )

    return result


app.include_router(assignments_router)


app.include_router(auth_router)
