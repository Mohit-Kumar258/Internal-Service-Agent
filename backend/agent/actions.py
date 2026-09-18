from datetime import datetime, timezone

from database.mongodb import tickets, audit_logs


def get_next_ticket_id():
    existing_tickets = list(tickets.find({}, {"_id": 0, "id": 1}))

    numbers = []

    for ticket in existing_tickets:
        ticket_id = str(ticket.get("id", ""))

        if ticket_id.startswith("TK-"):
            try:
                numbers.append(int(ticket_id.split("-")[1]))
            except ValueError:
                pass

    next_number = max(numbers, default=1051) + 1

    return f"TK-{next_number}"


def create_ticket(employee_request, reason, sources):
    ticket_id = get_next_ticket_id()

    ticket = {
        "id": ticket_id,
        "employee_name": employee_request.get("employee_name"),
        "employee_email": employee_request.get("employee_email"),
        "request": employee_request.get("request"),
        "status": "Escalated",
        "reason": reason,
        "sources": sources,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    tickets.insert_one(ticket)

    return ticket


def create_audit_log(
    employee_message,
    decision,
    sources,
    ticket_id=None
):
    audit = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "employee_message": employee_message,
        "decision": decision,
        "sources": sources,
        "ticket_id": ticket_id
    }

    result = audit_logs.insert_one(audit)

    return str(result.inserted_id)