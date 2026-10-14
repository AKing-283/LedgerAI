"""Qdrant service tests (mocked, no real credentials needed)."""
import os

os.environ.setdefault("GROQ_API_KEY", "test-groq")
os.environ.setdefault("QDRANT_URL", "https://test-cluster.qdrant.io")
os.environ.setdefault("QDRANT_API_KEY", "test-key")
os.environ.setdefault("DATABASE_URL", "postgresql://u:p@localhost:5432/db")
os.environ.setdefault("JWT_SECRET_KEY", "x" * 48)

from unittest.mock import MagicMock, patch

import httpx
import pytest

import app.services.qdrant_service as qs


@pytest.fixture(autouse=True)
def _reset():
    qs.reset_client()
    yield
    qs.reset_client()


def _fake_points(n=2, org="org-1"):
    pts = []
    for i in range(n):
        p = MagicMock()
        p.payload = {
            "content": f"chunk {i}",
            "organization_id": org,
            "document_id": f"doc-{i}",
            "chunk_index": i,
        }
        pts.append(p)
    resp = MagicMock()
    resp.points = pts
    return resp


def test_successful_search_returns_points_and_keeps_org_filter():
    fake = _fake_points()
    mock_client = MagicMock()
    mock_client.query_points.return_value = fake
    with patch.object(qs, "get_client", return_value=mock_client):
        out = qs.search_documents("org-1", [0.01] * 384, limit=5)
    assert len(out) == 2
    assert out[0].payload["organization_id"] == "org-1"
    # Verify org filter was passed through
    _, kwargs = mock_client.query_points.call_args
    assert kwargs["collection_name"] == "documents"
    filt = kwargs["query_filter"]
    assert filt.must[0].key == "organization_id"
    assert filt.must[0].match.value == "org-1"


def test_transient_connect_error_retried_then_succeeds():
    fake = _fake_points(n=1)
    mock_client = MagicMock()
    req = MagicMock()
    mock_client.query_points.side_effect = [
        httpx.ConnectError("closed", request=req),
        fake,
    ]
    with patch.object(qs, "get_client", return_value=mock_client):
        with patch.object(qs.time, "sleep", return_value=None):
            out = qs.search_documents("org-1", [0.01] * 384)
    assert len(out) == 1
    assert mock_client.query_points.call_count == 2


def test_transient_failure_after_retries_raises_unavailable():
    mock_client = MagicMock()
    req = MagicMock()
    mock_client.query_points.side_effect = httpx.ConnectError("down", request=req)
    with patch.object(qs, "get_client", return_value=mock_client):
        with patch.object(qs.time, "sleep", return_value=None):
            with pytest.raises(qs.QdrantUnavailableError):
                qs.search_documents("org-1", [0.01] * 384)
    # 1 initial + 2 retries
    assert mock_client.query_points.call_count == 3


def test_auth_failure_not_retried_as_transient():
    from qdrant_client.http.exceptions import UnexpectedResponse

    mock_client = MagicMock()
    mock_client.query_points.side_effect = UnexpectedResponse(
        status_code=401, reason_phrase="Unauthorized", content=b"unauthorized", headers={}
    )
    with patch.object(qs, "get_client", return_value=mock_client):
        with pytest.raises(qs.QdrantConfigError):
            qs.search_documents("org-1", [0.01] * 384)
    assert mock_client.query_points.call_count == 1


def test_missing_collection_not_retried():
    from qdrant_client.http.exceptions import UnexpectedResponse

    mock_client = MagicMock()
    mock_client.query_points.side_effect = UnexpectedResponse(
        status_code=404, reason_phrase="Not Found", content=b"no collection", headers={}
    )
    with patch.object(qs, "get_client", return_value=mock_client):
        with pytest.raises(qs.QdrantConfigError):
            qs.search_documents("org-1", [0.01] * 384)
    assert mock_client.query_points.call_count == 1


def test_bad_dimension_raises_config_error_without_call():
    mock_client = MagicMock()
    with patch.object(qs, "get_client", return_value=mock_client):
        with pytest.raises(qs.QdrantConfigError):
            qs.search_documents("org-1", [0.1] * 128)
    mock_client.query_points.assert_not_called()


def test_invalid_url_raises_config_error():
    with patch.object(qs.settings, "QDRANT_URL", "not-a-url"):
        with pytest.raises(qs.QdrantConfigError):
            qs._validate_config()


def test_missing_api_key_raises_config_error():
    with patch.object(qs.settings, "QDRANT_API_KEY", ""):
        with pytest.raises(qs.QdrantConfigError):
            qs._validate_config()