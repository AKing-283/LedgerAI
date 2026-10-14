"""Chat/retrieval failure-handling tests (mocked)."""
import os

os.environ.setdefault("GROQ_API_KEY", "test-groq")
os.environ.setdefault("QDRANT_URL", "https://test-cluster.qdrant.io")
os.environ.setdefault("QDRANT_API_KEY", "test-key")
os.environ.setdefault("DATABASE_URL", "postgresql://u:p@localhost:5432/db")
os.environ.setdefault("JWT_SECRET_KEY", "x" * 48)

from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient


def _make_point(content="hello invoice", org="org-1", doc="doc-1"):
    p = MagicMock()
    p.payload = {
        "content": content,
        "organization_id": org,
        "document_id": doc,
        "chunk_index": 0,
    }
    return p


def test_retrieval_returns_structured_chunks_with_ids():
    from app.services import retrieval_service as rs

    fake_resp = MagicMock()
    fake_resp.points = [_make_point()]
    with patch.object(rs, "create_embedding", return_value=[0.01] * 384):
        with patch.object(rs, "search_documents", return_value=fake_resp.points):
            chunks = rs.retrieve_chunks("org-1", "what is invoice?")
    assert chunks[0]["document_id"] == "doc-1"
    assert chunks[0]["organization_id"] == "org-1"
    assert "hello" in chunks[0]["content"]


def test_retrieval_empty_returns_empty_string_not_failure():
    from app.services import retrieval_service as rs

    with patch.object(rs, "create_embedding", return_value=[0.01] * 384):
        with patch.object(rs, "search_documents", return_value=[]):
            ctx = rs.retrieve_context("org-1", "unknown?")
    assert ctx == ""


def test_agent_empty_context_is_not_grounded():
    from app.agents.document_agent import DocumentAgent

    with patch("app.agents.document_agent.retrieve_chunks", return_value=[]):
        with patch("app.services.groq_service.ask_llm", return_value="I could not find this information in the documents."):
            out = DocumentAgent().run("org-1", "gst?")
    assert out["grounded"] is False
    assert out["context_chunks"] == 0
    assert "could not find" in out["answer"].lower()


def test_agent_propagates_qdrant_failure_no_false_success():
    from app.agents.document_agent import DocumentAgent
    from app.services.qdrant_service import QdrantUnavailableError

    with patch(
        "app.agents.document_agent.retrieve_chunks",
        side_effect=QdrantUnavailableError("down"),
    ):
        try:
            DocumentAgent().run("org-1", "invoice?")
            assert False, "should have raised"
        except QdrantUnavailableError:
            pass  # correct: no fabricated grounded answer


def test_chat_returns_503_when_qdrant_unavailable():
    from app.main import app
    from app.services.qdrant_service import QdrantUnavailableError

    client = TestClient(app, raise_server_exceptions=False)
    with patch(
        "app.agents.document_agent.DocumentAgent.run",
        side_effect=QdrantUnavailableError("down"),
    ):
        resp = client.post(
            "/chat",
            json={"question": "invoice?"},
            headers={"Authorization": "Bearer fake"},
        )
    # Auth may 401 first if token invalid; patch auth to isolate chat mapping
    # If we got 401, retry with mocked auth dependency.
    if resp.status_code == 401:
        from app.routers.chat import router as chat_router  # noqa
        app.dependency_overrides = {}
        from app.auth.auth_dependency import get_current_user

        app.dependency_overrides[get_current_user] = lambda: {
            "organization_id": "org-1",
            "user_id": "u-1",
        }
        resp = client.post("/chat", json={"question": "invoice?"})
        app.dependency_overrides = {}
    assert resp.status_code == 503
    assert "temporarily unavailable" in resp.json()["detail"].lower()