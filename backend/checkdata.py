from database.mongodb import tickets, audit_logs


print("\n========== TICKETS ==========")

for ticket in tickets.find({}, {"_id": 0}).sort("id", 1):
    print(
        ticket.get("id"),
        "|",
        ticket.get("employee_name"),
        "|",
        ticket.get("status"),
        "|",
        ticket.get("request")
    )


print("\n========== AUDIT LOGS ==========")

for log in audit_logs.find({}, {"_id": 0}).sort("timestamp", 1):
    print(
        log.get("timestamp"),
        "|",
        log.get("decision"),
        "|",
        "Ticket:",
        log.get("ticket_id"),
        "|",
        log.get("employee_message")
    )