from fastapi import APIRouter
from pydantic import BaseModel

from agent.agent import ask_agent

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    employee_name: str | None = None
    employee_email: str | None = None


@router.post("/chat")
def chat(request: ChatRequest):

    result = ask_agent(
        user_message=request.message,
        employee_name=request.employee_name,
        employee_email=request.employee_email
    )

    return result.model_dump()