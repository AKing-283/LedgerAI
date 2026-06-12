from fastapi import APIRouter
from fastapi import Depends

from app.schemas.chat import ChatRequest
from app.agents.document_agent import DocumentAgent

from app.auth.auth_dependency import get_current_user

router = APIRouter(tags=["Chat"])

document_agent = DocumentAgent()


@router.post("/chat")
def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user)
):

    organization_id = current_user["organization_id"]

    result = document_agent.run(
        organization_id,
        request.question
    )
    return result