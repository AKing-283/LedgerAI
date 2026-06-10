from fastapi import APIRouter

from app.schemas.chat import ChatRequest
from app.agents.document_agent import DocumentAgent

router = APIRouter(tags=["Chat"])

document_agent = DocumentAgent()


@router.post("/chat")
def chat(request: ChatRequest):

    print("QUESTION:", request.question)

    result = document_agent.run(
        request.question
    )

    return result