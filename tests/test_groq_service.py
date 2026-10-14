"""Groq LLM service tests (mocked, no real credentials needed)."""
import os

os.environ.setdefault("GROQ_API_KEY", "test-groq")
os.environ.setdefault("GROQ_MODEL", "openai/gpt-oss-120b")
os.environ.setdefault("QDRANT_URL", "https://test-cluster.qdrant.io")
os.environ.setdefault("QDRANT_API_KEY", "test-key")
os.environ.setdefault("DATABASE_URL", "postgresql://u:p@localhost:5432/db")
os.environ.setdefault("JWT_SECRET_KEY", "x" * 48)

from unittest.mock import MagicMock, patch

import pytest


def test_default_model_is_supported():
    import app.services.groq_service as gs

    assert gs.DEFAULT_MODEL == "openai/gpt-oss-120b"
    assert "llama-3.3-70b-versatile" not in (gs.settings.GROQ_MODEL or "")


def test_ask_llm_success():
    import app.services.groq_service as gs

    gs.reset_llm()
    fake_resp = MagicMock()
    fake_resp.content = "Vendor: Acme"
    fake_llm = MagicMock()
    fake_llm.invoke.return_value = fake_resp
    with patch.object(gs, "get_llm", return_value=fake_llm):
        out = gs.ask_llm("invoice total?", "context")
    assert "Acme" in out


def test_ask_llm_model_not_found_maps_to_config_error():
    import app.services.groq_service as gs
    from app.services.groq_service import LLMConfigError

    gs.reset_llm()
    err = Exception("The model `llama-3.3-70b-versatile` does not exist (model_not_found)")
    err.status_code = 404
    fake_llm = MagicMock()
    fake_llm.invoke.side_effect = err
    with patch.object(gs, "get_llm", return_value=fake_llm):
        with pytest.raises(LLMConfigError):
            gs.ask_llm("q?", "c?")


def test_ask_llm_rate_limit_maps_to_unavailable():
    import app.services.groq_service as gs
    from app.services.groq_service import LLMUnavailableError

    gs.reset_llm()
    err = Exception("rate_limit_exceeded, try again")
    err.status_code = 429
    fake_llm = MagicMock()
    fake_llm.invoke.side_effect = err
    with patch.object(gs, "get_llm", return_value=fake_llm):
        with pytest.raises(LLMUnavailableError):
            gs.ask_llm("q?", "c?")


def test_chat_maps_llm_config_error_to_500():
    from fastapi.testclient import TestClient
    from app.main import app
    from app.auth.auth_dependency import get_current_user
    from app.services.groq_service import LLMConfigError

    app.dependency_overrides[get_current_user] = lambda: {
        "organization_id": "org-1",
        "user_id": "u-1",
    }
    try:
        client = TestClient(app, raise_server_exceptions=False)
        with patch(
            "app.agents.document_agent.DocumentAgent.run",
            side_effect=LLMConfigError("bad model"),
        ):
            resp = client.post("/chat", json={"question": "invoice?"})
    finally:
        app.dependency_overrides = {}
    assert resp.status_code == 500
    assert "misconfigured" in resp.json()["detail"].lower()