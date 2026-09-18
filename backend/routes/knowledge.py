from fastapi import APIRouter

from database.mongodb import knowledge_base

router = APIRouter()


@router.get("/knowledge")
def get_knowledge():
    policies = list(
        knowledge_base.find(
            {},
            {"_id": 0}
        )
    )

    return {
        "policies": policies,
        "count": len(policies)
    }