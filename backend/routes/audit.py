from fastapi import APIRouter

from database.mongodb import audit_logs

router = APIRouter()


@router.get("/audit")
def get_audit_logs():
    logs = list(
        audit_logs.find(
            {},
            {"_id": 0}
        ).sort("timestamp", -1)
    )

    return {
        "logs": logs,
        "count": len(logs)
    }