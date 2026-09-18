import os
import json

from dotenv import load_dotenv
from groq import Groq

from database.mongodb import knowledge_base
from .prompts import SYSTEM_PROMPT
from .schemas import AgentResult
from .actions import create_ticket, create_audit_log

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def retrieve_policies(user_message: str):
    stop_words = {
        "i", "me", "my", "the", "a", "an", "is", "it",
        "to", "for", "of", "and", "or", "on", "in",
        "at", "this", "that", "have", "has", "had",
        "after", "before", "with", "your", "you",
        "can", "please", "need", "get", "got",
        "been", "being", "was", "were", "am"
    }

    words = {
        word.strip(".,!?")
        for word in user_message.lower().split()
        if len(word.strip(".,!?")) >= 3
        and word.strip(".,!?") not in stop_words
    }

    policies = list(knowledge_base.find({}, {"_id": 0}))

    scored = []

    for policy in policies:
        title_words = set(
            policy.get("title", "").lower().split()
        )

        content_words = set(
            policy.get("content", "").lower().split()
        )

        title_matches = words & title_words
        content_matches = words & content_words

        score = (len(title_matches) * 5) + len(content_matches)

        if score >= 2:
            scored.append((score, policy))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [policy for score, policy in scored[:3]]


def ask_agent(
    user_message: str,
    employee_name: str | None = None,
    employee_email: str | None = None
):

    policies = retrieve_policies(user_message)

    if policies:
        context = "\n\n".join(
            [
                f"KB ID: {policy.get('id')}\n"
                f"Title: {policy.get('title')}\n"
                f"Content: {policy.get('content')}"
                for policy in policies
            ]
        )
    else:
        context = "No relevant knowledge-base policy was found."

    prompt = f"""
SUPPLIED KNOWLEDGE BASE:
{context}

EMPLOYEE REQUEST:
{user_message}

Analyze the employee request using ONLY the supplied knowledge base.

Return ONLY valid JSON in this exact structure:

{{
  "decision": "RESOLVE",
  "response": "response to employee",
  "reason": "brief reason",
  "follow_up_question": null,
  "source_ids": ["KB-01"]
}}

The decision must be exactly one of:

RESOLVE
ASK_FOLLOWUP
ESCALATE

Rules:

- Never invent contact details, email addresses, URLs, procedures,
  approval requirements, SLAs, or other information.

- Never claim an action was performed.

- If an action requires IT or another department to perform it,
  explain what the employee needs to do.

- If important information is missing, use ASK_FOLLOWUP.

- If the request is risky, unauthorized, or unclear, use ESCALATE.
- If the request involves suspected phishing, malware, or unauthorized
  access, always use ESCALATE, while still giving the employee the
  immediate action specified by KB-09.
- For privileged access requests where no supplied policy authorizes
  the access, do not invent an approval process. Explain that the
  prototype cannot grant the access and escalate the request for review.

- source_ids must contain ONLY the KB IDs that directly support
  your answer.

- Do not include unrelated policies in source_ids.

- source_ids must only contain IDs that appear in the supplied
  knowledge base context.

- If no supplied policy directly supports the answer, return:
  "source_ids": []

- Do not invent KB IDs.

- Do not invent employee information.

- Do not invent ticket IDs.

- Do not invent actions or claim that a ticket was created.
  Ticket creation is handled by the backend after your decision.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )

    raw_result = response.choices[0].message.content

    result = json.loads(raw_result)

    # ---------------------------------------------------------
    # Validate source IDs against the policies retrieved
    # from MongoDB. The AI cannot create arbitrary source IDs.
    # ---------------------------------------------------------

    source_text = result.get("source_ids", [])

    if not isinstance(source_text, list):
        source_text = []

    valid_ids = {
        policy.get("id")
        for policy in policies
        if policy.get("id")
    }

    sources = [
        source_id
        for source_id in source_text
        if source_id in valid_ids
    ]

    decision = result.get("decision", "ESCALATE")

    # Only allow the three expected decisions.
    if decision not in {
        "RESOLVE",
        "ASK_FOLLOWUP",
        "ESCALATE"
    }:
        decision = "ESCALATE"

    ticket = None
    audit_id = None

    # ---------------------------------------------------------
    # ESCALATION
    # ---------------------------------------------------------

    if decision == "ESCALATE":

        employee_request = {
            "employee_name": employee_name,
            "employee_email": employee_email,
            "request": user_message
        }

        ticket = create_ticket(
            employee_request,
            result.get("reason", ""),
            sources
        )

        audit_id = create_audit_log(
            user_message,
            decision,
            sources,
            ticket["id"]
        )

        # Remove MongoDB's internal ObjectId from API response.
        ticket.pop("_id", None)

    # ---------------------------------------------------------
    # RESOLVE / FOLLOW-UP
    # ---------------------------------------------------------

    else:

        audit_id = create_audit_log(
            user_message,
            decision,
            sources
        )

    # ---------------------------------------------------------
    # FINAL STRUCTURED RESPONSE
    # ---------------------------------------------------------

    return AgentResult(
        decision=decision,
        response=result.get("response", ""),
        sources=sources,
        reason=result.get("reason", ""),
        follow_up_question=result.get("follow_up_question"),
        ticket=ticket,
        audit_id=audit_id
    )