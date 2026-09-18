from agent.actions import create_ticket, create_audit_log


employee_request = {
    "employee_name": "Test Employee",
    "employee_email": "test@veridian-corp.example",
    "request": "Test escalation request"
}

ticket = create_ticket(
    employee_request,
    "Testing ticket creation",
    ["KB-01"]
)

audit_id = create_audit_log(
    employee_request["request"],
    "ESCALATE",
    ["KB-01"],
    ticket["id"]
)

print("Ticket created:")
print(ticket)

print("\nAudit log created:")
print(audit_id)