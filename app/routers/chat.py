from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from app.schemas.chat import ChatRequest
from app.agents.document_agent import DocumentAgent

from app.auth.auth_dependency import get_current_user
from app.services.qdrant_service import QdrantConfigError, QdrantUnavailableError
from app.services.groq_service import LLMConfigError, LLMUnavailableError

router = APIRouter(tags=["Chat"])

document_agent = DocumentAgent()


@router.post("/chat")
def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user)
):

    organization_id = current_user["organization_id"]

    try:
        result = document_agent.run(
            organization_id,
            request.question
        )
    except QdrantUnavailableError:
        # Retrieval failed: do not return a fabricated grounded answer.
        raise HTTPException(
            status_code=503,
            detail="Retrieval service temporarily unavailable. Please retry shortly.",
        )
    except QdrantConfigError:
        raise HTTPException(
            status_code=500,
            detail="Retrieval service misconfigured. Please contact support.",
        )
    except LLMUnavailableError:
        raise HTTPException(
            status_code=503,
            detail="Language model temporarily unavailable. Please retry shortly.",
        )
    except LLMConfigError:
        raise HTTPException(
            status_code=500,
            detail="Language model misconfigured (e.g. retired model). Please contact support.",
        )
    return result