import json
from pathlib import Path

from database.mongodb import (
    knowledge_base,
    employee_requests,
    tickets,
    audit_logs,
)

BASE_DIR = Path(__file__).resolve().parent / "data"


def load_json(filename):
    with open(BASE_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_collection(collection, data, key):
    collection.delete_many({})
    if data:
        collection.insert_many(data)
    print(f"{collection.name}: inserted {len(data)} documents")


if __name__ == "__main__":
    seed_collection(
        knowledge_base,
        load_json("knowledge_base.json"),
        "id",
    )

    seed_collection(
        employee_requests,
        load_json("employee_requests.json"),
        "request_id",
    )

    seed_collection(
        tickets,
        load_json("tickets.json"),
        "ticket_id",
    )

    # Keep audit logs empty until the agent starts processing requests.
    print("Database seeding complete.")
