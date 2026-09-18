import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "veridian_it")

client = MongoClient(MONGODB_URL)

db = client[DATABASE_NAME]

knowledge_base = db["knowledge_base"]
employee_requests = db["employee_requests"]
tickets = db["tickets"]
audit_logs = db["audit_logs"]


def test_connection():
    try:
        client.admin.command("ping")

        return {
            "connected": True,
            "error": None
        }

    except Exception as e:
        return {
            "connected": False,
            "error": str(e)
        }