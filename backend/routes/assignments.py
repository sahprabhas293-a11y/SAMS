from security import get_current_user
from datetime import date, datetime, timezone
from typing import Literal

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field, ConfigDict
from pymongo import DESCENDING

from database import db

router = APIRouter(
    prefix="/api/assignments",
    tags=["Assignments"]
)

collection = db["assignments"]


class AssignmentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    subject: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=2000)
    deadline: date
    priority: Literal["Low", "Medium", "High"] = "Medium"

    model_config = ConfigDict(str_strip_whitespace=True)


class AssignmentUpdate(AssignmentCreate):
    pass


class CompletionUpdate(BaseModel):
    completed: bool


def serialize_assignment(item):
    return {
        "id": str(item["_id"]),
        "title": item["title"],
        "subject": item["subject"],
        "description": item.get("description", ""),
        "deadline": item["deadline"],
        "priority": item["priority"],
        "completed": item.get("completed", False),
        "created_at": item["created_at"].isoformat()
    }


def get_object_id(assignment_id):
    if not ObjectId.is_valid(assignment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid assignment ID"
        )
    return ObjectId(assignment_id)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_assignment(assignment: AssignmentCreate, user=Depends(get_current_user)):
    data = assignment.model_dump()
    data["deadline"] = assignment.deadline.isoformat()
    data["completed"] = False
    data["user_id"] = user["_id"]
    data["created_at"] = datetime.now(timezone.utc)

    result = collection.insert_one(data)
    saved = collection.find_one({"_id": result.inserted_id})

    return serialize_assignment(saved)


@router.get("")
def list_assignments(user=Depends(get_current_user)):
    items = collection.find({"user_id": user["_id"]}).sort("created_at", DESCENDING)
    return [serialize_assignment(item) for item in items]


@router.put("/{assignment_id}")
def update_assignment(
    assignment_id: str,
    assignment: AssignmentUpdate,
    user=Depends(get_current_user)
):
    object_id = get_object_id(assignment_id)

    data = assignment.model_dump()
    data["deadline"] = assignment.deadline.isoformat()

    result = collection.update_one(
        {"_id": object_id, "user_id": user["_id"]},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    updated = collection.find_one({"_id": object_id, "user_id": user["_id"]})
    return serialize_assignment(updated)


@router.patch("/{assignment_id}/complete")
def update_completion(
    assignment_id: str,
    payload: CompletionUpdate,
    user=Depends(get_current_user)
):
    object_id = get_object_id(assignment_id)

    result = collection.update_one(
        {"_id": object_id, "user_id": user["_id"]},
        {"$set": {"completed": payload.completed}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    updated = collection.find_one({"_id": object_id, "user_id": user["_id"]})
    return serialize_assignment(updated)


@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str, user=Depends(get_current_user)):
    object_id = get_object_id(assignment_id)

    result = collection.delete_one({"_id": object_id, "user_id": user["_id"]})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    return {"message": "Assignment deleted successfully"}
