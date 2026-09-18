Veridian Internal Service Agent

An Agentic AI-powered internal IT support agent for Veridian Corp.
The system understands employee IT requests, retrieves relevant company
policies, decides whether to resolve, ask for more information, or
escalate, and maintains an auditable record of its decisions.

Live Prototype

Frontend: https://internal-service-agent.vercel.app/

Backend API: https://veridian-it-backend-nine.vercel.app/

API Documentation: https://veridian-it-backend-nine.vercel.app/docs

GitHub: https://github.com/Mohit-Kumar258/Internal-Service-Agent

1. Problem Statement

Traditional IT support often involves repetitive requests, unclear
employee messages, policy lookup, manual ticket creation, and
inconsistent escalation.

The goal of this project is to build an AI support agent that can:

Understand an employee's IT issue

Find the relevant supplied policy

Ask sensible follow-up questions when information is missing

Resolve simple policy-backed requests

Escalate risky, unclear, or unauthorized requests

Create a structured ticket when escalation is required

Show the source used for policy-based answers

Maintain an audit trail of agent decisions

2. Key Features

AI Support Agent

Natural-language IT request handling

Employee name and email capture

Policy retrieval from MongoDB

AI-assisted decision making

Three controlled decisions:

RESOLVE

ASK_FOLLOWUP

ESCALATE

Grounded Responses

The agent uses only the supplied Veridian data pack.

It does not invent: - Policies - Approvals - Permissions - SLAs -
Employee information - Ticket information - Actions that were not
actually performed

Escalation & Ticketing

Risky or unsupported requests can generate structured tickets
containing: - Employee information - Request - Status - Reason -
Policy/source references - Creation timestamp

Audit Trail

Every agent interaction records: - Employee request - Decision - Source
policy - Timestamp - Ticket reference when applicable

Dashboard

The dashboard provides live visibility into: - AI support status -
Open/active agent tickets - Knowledge-base count - Audit events -
Decision counts

Knowledge Base

The system displays the supplied IT policies used by the agent.

3. Architecture

                    ┌──────────────────────┐
                    │   Employee Request   │
                    │ Name / Email / Issue │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite UI    │
                    │     Tailwind CSS     │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   FastAPI Backend    │
                    │ Agent Orchestration  │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
       ┌──────────────────┐       ┌──────────────────┐
       │  MongoDB Atlas   │       │     Groq API     │
       │                  │       │                  │
       │ Knowledge Base   │       │ GPT-OSS-120B     │
       │ Requests         │       │                  │
       │ Tickets          │       └────────┬─────────┘
       │ Audit Logs       │                │
       └────────┬─────────┘                │
                └──────────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │   Decision Layer     │
                    │                      │
                    │ RESOLVE              │
                    │ ASK_FOLLOWUP         │
                    │ ESCALATE             │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Response + Audit     │
                    │ Ticket if required  │
                    └──────────────────────┘

4. Agent Workflow

The agent follows four main stages:

1. Understand

Analyze the employee's request and identify the issue or missing
information.

2. Retrieve

Search the supplied knowledge base for relevant policies.

3. Decide

Select one of:

RESOLVE --- the supplied policy directly answers the request and
no unavailable backend action is required.

ASK_FOLLOWUP --- important information is missing.

ESCALATE --- the request is risky, unclear, unauthorized, or
requires an action outside the prototype's capabilities.

4. Record

The system records the decision in the audit trail. Escalated requests
also create a structured ticket.

5. Knowledge Sources

The prototype uses only the supplied Veridian Corp data pack.

Knowledge Base

The supplied policies include:

KB-01: Password Reset

KB-02: VPN Access

KB-03: Laptop Replacement

KB-04: Software Installation Requests

KB-05: Printer Troubleshooting

KB-06: Email Mailbox Quota

KB-07: Guest Wi-Fi Access

KB-08: Expense Software Access

KB-09: Security Incident Reporting

KB-10: Work-From-Home Equipment

Asset Management Policy: Company-issued hardware refresh and
early replacement rules

Other Supplied Data

15 employee requests

Ticket history

Asset Management Policy

The data is stored in MongoDB Atlas collections:

knowledge_base
employee_requests
tickets
audit_logs

6. Example Agent Decisions

Guest Wi-Fi

Request:

Can I get Wi-Fi access for a guest visiting our office tomorrow?

Decision: RESOLVE

Source: KB-07

The policy states that any employee can generate guest Wi-Fi credentials
from the front-desk kiosk and that the credentials are valid for 24
hours. No IT ticket is required.

Phishing Email

Request:

I think I got a phishing email asking for my login.

Decision: ESCALATE

Source: KB-09

The security policy requires suspected phishing to be reported
immediately to the supplied security address and not forwarded to other
employees.

The agent also creates a structured escalation ticket.

Privileged Admin Access

Request:

Can someone give me admin access to the finance reporting server?

Decision: ESCALATE

The supplied material does not provide an authorization policy for
granting this privileged access. The agent therefore does not invent an
approval workflow or claim to grant the access.

Vague Request

Request:

hey can you help, its not working

Decision: ASK_FOLLOWUP

The request does not contain enough information to determine the
relevant IT issue or policy.

7. AI Tools Used

Groq API

The prototype uses the Groq API with:

openai/gpt-oss-120b

The model is used for: - Understanding employee requests - Selecting the
appropriate decision - Generating a clear response - Explaining the
decision using retrieved context

Retrieval

Because the supplied dataset is small and closed-world, the prototype
uses simple keyword-based retrieval from MongoDB instead of introducing
a vector database or external RAG system.

This keeps the prototype: - Fast - Transparent - Easy to demonstrate -
Grounded in the supplied dataset

8. Technology Stack

Frontend

React

Vite

Tailwind CSS

Axios

Lucide React

Backend

Python

FastAPI

Uvicorn

PyMongo

python-dotenv

Database

MongoDB Atlas

AI

Groq API

openai/gpt-oss-120b

Deployment

Vercel

9. Project Structure

Internal-Service-Agent/
│
├── backend/
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── prompts.py
│   │   ├── schemas.py
│   │   └── actions.py
│   │
│   ├── database/
│   │   └── mongodb.py
│   │
│   ├── data/
│   │   ├── knowledge_base.json
│   │   ├── employee_requests.json
│   │   └── tickets.json
│   │
│   ├── routes/
│   │   ├── chat.py
│   │   ├── tickets.py
│   │   ├── audit.py
│   │   ├── knowledge.py
│   │   └── dashboard.py
│   │
│   ├── main.py
│   ├── seed_database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── AISupport.jsx
│   │   │   ├── Tickets.jsx
│   │   │   ├── AuditTrail.jsx
│   │   │   └── KnowledgeBase.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore

10. API Endpoints

Chat

POST /api/chat

Processes an employee request through the AI agent.

Example request:

{
  "message": "Can I get Wi-Fi access for a guest visiting tomorrow?",
  "employee_name": "Vikram Chawla",
  "employee_email": "vikram.chawla@veridian-corp.example"
}

Tickets

GET /api/tickets

Returns ticket history and escalation tickets.

Audit

GET /api/audit

Returns recorded agent decisions.

Knowledge Base

GET /api/knowledge

Returns supplied policies.

Dashboard

GET /api/dashboard

Returns live dashboard statistics.

Database Health

GET /test-db

Checks MongoDB connectivity.

11. Local Setup

Backend

From the backend directory:

pip install -r requirements.txt

Create a .env file:

MONGODB_URL=your_mongodb_atlas_connection_string
DATABASE_NAME=veridian_it
GROQ_API_KEY=your_groq_api_key

Start FastAPI:

uvicorn main:app --reload

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

Frontend

From the frontend directory:

npm install
npm run dev

Frontend:

http://localhost:5173

12. Security & Guardrails

The prototype intentionally limits what the AI agent can claim or
perform.

The agent must not:

Invent company policies

Invent approval workflows

Invent SLAs

Invent employee information

Approve privileged access without supplied authorization

Claim that an IT action was performed when the backend did not
perform it

Expose confidential information

Security incidents

Requests involving: - Phishing - Malware - Unauthorized access

are escalated according to the supplied security policy.

13. Prototype Scope

This is a focused Agentic AI prototype rather than a complete enterprise
ITSM platform.

The current prototype can: - Analyze requests - Retrieve supplied policy
information - Make controlled decisions - Generate grounded responses -
Create escalation tickets - Maintain audit logs - Display operational
dashboards

The prototype does not directly: - Unlock accounts - Reset
passwords - Grant access - Install software - Approve requests - Perform
other privileged IT administration

Instead, it explains the applicable policy and escalates or guides the
employee when the required action is outside its capabilities.

14. Assumptions

The supplied Veridian data pack is the authoritative source for the
prototype.

No external company policies are used.

The knowledge base is intentionally small, so keyword retrieval is
sufficient for the prototype.

Historical tickets are treated as context/history.

Agent-generated escalations are marked separately for dashboard
statistics.

MongoDB Atlas stores persistent prototype data.

Vercel hosts the deployed frontend and backend.

15. Demo Scenarios

For a 15-minute demonstration:

Demo 1 --- Guest Wi-Fi

Show: - Employee request - RESOLVE - KB-07 - Audit event - No ticket

Demo 2 --- Phishing

Show: - Security-sensitive request - ESCALATE - KB-09 - Immediate
policy-based guidance - New ticket - Audit event

Demo 3 --- Admin Access

Show: - Privileged access request - Safe escalation - No invented
approval process - Structured ticket

Demo 4 --- Vague Request

Show: - Missing information - ASK_FOLLOWUP

Then open: - Dashboard - Audit Trail - Tickets - Knowledge Base

to demonstrate end-to-end traceability.

16. Why This Is Agentic

The system is more than a simple question-answering chatbot because it
performs a structured decision workflow:

Employee Request
      ↓
Understand Intent
      ↓
Retrieve Evidence
      ↓
Reason Over Evidence
      ↓
Choose Decision
      ↓
Respond
      ↓
Record Outcome
      ↓
Create Ticket if Escalated

The agent combines AI reasoning with deterministic backend actions and
safety constraints.

17. Future Improvements

Possible extensions include:

Semantic/vector retrieval for a larger knowledge base

Enterprise SSO authentication

Role-based permissions

Real ITSM/ticketing integration

Automated approval workflows

Email/Slack/Teams notifications

Real password-reset and access-management integrations

More detailed analytics

Human-in-the-loop escalation

Retrieval confidence scoring

Expanded audit and compliance controls

18. Assignment Deliverables

This project was developed as an Agentic AI Factory -- Internal
Service Agent (IT Support) prototype.

Deliverables include:

Working web prototype

FastAPI backend

MongoDB Atlas database

AI-powered agent workflow

Architecture/process flow

Grounded knowledge sources

Audit trail

Ticket management

10-slide presentation

GitHub repository

Live deployment

Author

Mohit Kumar

Branch: CSIT (Computer Science & IT)

Semester: 5

License

This project is created as an academic/prototype submission for the
Agentic AI Factory assignme