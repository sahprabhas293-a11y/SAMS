from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from pymongo.errors import DuplicateKeyError

from database import db
from security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

users = db["users"]


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    model_config = ConfigDict(str_strip_whitespace=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def public_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest):
    email = str(payload.email).lower()

    users.create_index("email", unique=True)

    if users.find_one({"email": email}):
        raise HTTPException(
            status_code=409,
            detail="Email is already registered"
        )

    try:
        result = users.insert_one({
            "name": payload.name,
            "email": email,
            "password_hash": hash_password(payload.password)
        })
    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="Email is already registered"
        )

    user = users.find_one({"_id": result.inserted_id})

    return public_user(user)


@router.post("/login")
def login(payload: LoginRequest):
    user = users.find_one({
        "email": str(payload.email).lower()
    })

    if not user or not verify_password(
        payload.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(user["_id"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": public_user(user)
    }


@router.get("/me")
def current_user(user=Depends(get_current_user)):
    return public_user(user)
