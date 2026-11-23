import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError

load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017/"
)

DATABASE_NAME = "sams_db"

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

db = client[DATABASE_NAME]


def check_database_connection():
    try:
        client.admin.command("ping")
        return {
            "status": "connected",
            "database": DATABASE_NAME
        }
    except PyMongoError as error:
        return {
            "status": "disconnected",
            "error": str(error)
        }
