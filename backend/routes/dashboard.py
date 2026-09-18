from fastapi import APIRouter
from database.mongodb import tickets, audit_logs, knowledge_base

router = APIRouter()


@router.get("/dashboard")
def get_dashboard():

    all_tickets = list(
        tickets.find({}, {"_id": 0})
    )

    all_logs = list(
        audit_logs.find({}, {"_id": 0})
    )

    # A ticket is considered closed when its status explicitly
    # indicates a closed/resolved/rejected state.
    closed_statuses = {
        "Resolved (closed)",
        "Approved at 35GB (closed)",
        "Rejected — no business justification provided (closed)",
    }

    active_tickets = [
        ticket
        for ticket in all_tickets
        if ticket.get("status") not in closed_statuses
    ]

    decision_counts = {
        "RESOLVE": 0,
        "ASK_FOLLOWUP": 0,
        "ESCALATE": 0,
    }

    for log in all_logs:

        decision = log.get("decision")

        if decision in decision_counts:
            decision_counts[decision] += 1

    return {
        "tickets_total": len(all_tickets),
        "tickets_active": len(active_tickets),
        "knowledge_base": knowledge_base.count_documents({}),
        "audit_events": len(all_logs),
        "decision_counts": decision_counts,
    }