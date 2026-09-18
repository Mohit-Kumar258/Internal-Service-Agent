from typing import Optional, List
from pydantic import BaseModel


class AgentResult(BaseModel):
    decision: str
    response: str
    sources: List[str]
    reason: str
    follow_up_question: Optional[str] = None
    ticket: Optional[dict] = None
    audit_id: Optional[str] = None