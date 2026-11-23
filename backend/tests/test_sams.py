import uuid
import pytest

from fastapi.testclient import TestClient
from bson import ObjectId

from main import app
from database import db

client = TestClient(app)


@pytest.fixture
def students():
    suffix = uuid.uuid4().hex[:12]

    accounts = [
        {
            "name": "SAMS Test Student One",
            "email": f"sams-test-one-{suffix}@example.com",
            "password": "TestPassword123!"
        },
        {
            "name": "SAMS Test Student Two",
            "email": f"sams-test-two-{suffix}@example.com",
            "password": "TestPassword456!"
        }
    ]

    created_ids = []

    try:
        tokens = []

        for account in accounts:
            response = client.post(
                "/api/auth/register",
                json=account
            )
            assert response.status_code == 201, response.text

            created_ids.append(ObjectId(response.json()["id"]))

            login = client.post(
                "/api/auth/login",
                json={
                    "email": account["email"],
                    "password": account["password"]
                }
            )
            assert login.status_code == 200, login.text
            tokens.append(login.json()["access_token"])

        yield tokens

    finally:
        if created_ids:
            db["assignments"].delete_many({
                "user_id": {"$in": created_ids}
            })
            db["users"].delete_many({
                "_id": {"$in": created_ids}
            })


def headers(token):
    return {"Authorization": f"Bearer {token}"}


def sample_assignment():
    return {
        "title": "Software Engineering Test",
        "subject": "Software Engineering",
        "description": "Automated CRUD validation",
        "deadline": "2027-01-15",
        "priority": "High"
    }


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200


def test_registration_validation():
    response = client.post(
        "/api/auth/register",
        json={
            "name": "A",
            "email": "invalid-email",
            "password": "123"
        }
    )
    assert response.status_code == 422


def test_login_rejects_invalid_credentials():
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "WrongPassword123"
        }
    )
    assert response.status_code == 401


def test_assignments_require_authentication():
    response = client.get("/api/assignments")
    assert response.status_code in (401, 403)


def test_student_registration_and_profile(students):
    token = students[0]

    response = client.get(
        "/api/auth/me",
        headers=headers(token)
    )

    assert response.status_code == 200
    assert response.json()["name"] == "SAMS Test Student One"
    assert "password_hash" not in response.json()


def test_assignment_crud(students):
    token = students[0]
    auth = headers(token)

    created = client.post(
        "/api/assignments",
        json=sample_assignment(),
        headers=auth
    )

    assert created.status_code == 201, created.text

    assignment_id = created.json()["id"]

    listed = client.get("/api/assignments", headers=auth)

    assert listed.status_code == 200
    assert any(
        a["id"] == assignment_id
        for a in listed.json()
    )

    updated_data = sample_assignment()
    updated_data["title"] = "Updated Software Engineering"

    updated = client.put(
        f"/api/assignments/{assignment_id}",
        json=updated_data,
        headers=auth
    )

    assert updated.status_code == 200, updated.text
    assert updated.json()["title"] == "Updated Software Engineering"

    completed = client.patch(
        f"/api/assignments/{assignment_id}/complete",
        json={"completed": True},
        headers=auth
    )

    assert completed.status_code == 200, completed.text
    assert completed.json()["completed"] is True

    deleted = client.delete(
        f"/api/assignments/{assignment_id}",
        headers=auth
    )

    assert deleted.status_code == 200, deleted.text


def test_student_data_isolation(students):
    student_one, student_two = students

    created = client.post(
        "/api/assignments",
        json=sample_assignment(),
        headers=headers(student_one)
    )

    assert created.status_code == 201, created.text

    assignment_id = created.json()["id"]

    other_student_list = client.get(
        "/api/assignments",
        headers=headers(student_two)
    )

    assert other_student_list.status_code == 200
    assert all(
        a["id"] != assignment_id
        for a in other_student_list.json()
    )

    other_student_update = client.patch(
        f"/api/assignments/{assignment_id}/complete",
        json={"completed": True},
        headers=headers(student_two)
    )

    assert other_student_update.status_code == 404

    other_student_delete = client.delete(
        f"/api/assignments/{assignment_id}",
        headers=headers(student_two)
    )

    assert other_student_delete.status_code == 404

    owner_delete = client.delete(
        f"/api/assignments/{assignment_id}",
        headers=headers(student_one)
    )

    assert owner_delete.status_code == 200
