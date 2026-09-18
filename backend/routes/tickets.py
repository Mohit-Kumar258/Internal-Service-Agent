from fastapi import APIRouter

from database.mongodb import tickets

router = APIRouter()


@router.get("/tickets")
def get_tickets():
    ticket_list = list(
        tickets.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1)
    )

    return {
        "tickets": ticket_list,
        "count": len(ticket_list)
    }