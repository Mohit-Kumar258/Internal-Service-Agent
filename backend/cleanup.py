from database.mongodb import tickets, audit_logs


# Remove generated test tickets
test_ticket_ids = [
    "TK-1053",
    "TK-1054",
    "TK-1055",
    "TK-1056",
    "TK-1057",
]

ticket_result = tickets.delete_many({
    "id": {"$in": test_ticket_ids}
})


# Remove audit logs linked to generated tickets
audit_ticket_result = audit_logs.delete_many({
    "ticket_id": {"$in": test_ticket_ids}
})


# Remove repeated test interactions
test_messages = [
    "Can I get Wi-Fi access for a guest visiting our office tomorrow?",
    "hey can you help, its not working",
]

audit_message_result = audit_logs.delete_many({
    "employee_message": {"$in": test_messages}
})


# Remove the outdated phishing test from before the rule was fixed
old_phishing_result = audit_logs.delete_many({
    "employee_message": "I think I got a phishing email asking for my login. What should I do?",
    "decision": "RESOLVE"
})


print("Cleanup complete.")
print("Tickets deleted:", ticket_result.deleted_count)
print("Ticket-linked audit logs deleted:", audit_ticket_result.deleted_count)
print("Test interaction audit logs deleted:", audit_message_result.deleted_count)
print("Outdated phishing logs deleted:", old_phishing_result.deleted_count)