"""Qdrant vector-store service with safe client lifecycle and error handling."""
import logging
import time
from urllib.parse import urlparse

import httpx
from qdrant_client import QdrantClient
from qdrant_client.models import Distance
from qdrant_client.models import VectorParams
import uuid
from app.config.settings import settings
from qdrant_client.models import PointStruct
from qdrant_client.models import Filter
from qdrant_client.models import FieldCondition
from qdrant_client.models import MatchValue
from qdrant_client.models import PayloadSchemaType

logger = logging.getLogger(__name__)

COLLECTION_NAME = "documents"
VECTOR_SIZE = 384
VECTOR_DISTANCE = Distance.COSINE
REQUEST_TIMEOUT = 20  # seconds; supported by qdrant-client >= 1.x
MAX_RETRIES = 2  # total attempts = 1 + MAX_RETRIES for transient errors only


class QdrantConfigError(Exception):
    """Permanent configuration error (bad URL, missing key, bad collection)."""


class QdrantUnavailableError(Exception):
    """Transient connectivity error talking to Qdrant."""


_client: QdrantClient | None = None


def _validate_config() -> None:
    url = (settings.QDRANT_URL or "").strip()
    if not url:
        raise QdrantConfigError("QDRANT_URL is not configured.")
    parsed = urlparse(url)
    if parsed.scheme not in ("https", "http"):
        raise QdrantConfigError(f"QDRANT_URL has unsupported scheme: {parsed.scheme!r}.")
    if not parsed.hostname:
        raise QdrantConfigError("QDRANT_URL is missing a hostname.")
    # Hosted Qdrant Cloud endpoints must use HTTPS. Never silently downgrade.
    if parsed.hostname.endswith("qdrant.io") and parsed.scheme != "https":
        raise QdrantConfigError("Qdrant Cloud endpoint must use https://.")
    if not (settings.QDRANT_API_KEY or "").strip():
        raise QdrantConfigError("QDRANT_API_KEY is not configured.")


def get_client() -> QdrantClient:
    """Return one consistently configured client (lazy singleton)."""
    global _client
    if _client is None:
        _validate_config()
        _client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            timeout=REQUEST_TIMEOUT,
        )
    return _client


def reset_client() -> None:
    """Reset the cached client (used by tests and after config changes)."""
    global _client
    try:
        if _client is not None:
            _client.close()
    except Exception:
        pass
    _client = None


def _is_transient(exc: Exception) -> bool:
    # Only network-level transient errors are retried. Auth, validation,
    # missing collection, and malformed requests are permanent.
    # qdrant-client wraps httpx errors in ResponseHandlingException, so
    # treat that wrapper as transient when its cause is a network error
    # (or when the cause is unknown-but-connection-like).
    from qdrant_client.http.exceptions import ResponseHandlingException

    if isinstance(exc, ResponseHandlingException):
        cause = exc.__cause__ or exc.__context__
        if cause is None:
            return True
        return isinstance(
            cause,
            (
                httpx.ConnectError,
                httpx.ConnectTimeout,
                httpx.ReadTimeout,
                httpx.WriteTimeout,
                httpx.PoolTimeout,
                httpx.RemoteProtocolError,
                TimeoutError,
                ConnectionError,
                OSError,
            ),
        ) or _is_transient(cause) if not isinstance(cause, ResponseHandlingException) else True
    return isinstance(
        exc,
        (
            httpx.ConnectError,
            httpx.ConnectTimeout,
            httpx.ReadTimeout,
            httpx.WriteTimeout,
            httpx.PoolTimeout,
            httpx.RemoteProtocolError,
            TimeoutError,
            ConnectionError,
        ),
    )


def _call_with_retry(func, *args, **kwargs):
    last_exc: Exception | None = None
    for attempt in range(1 + MAX_RETRIES):
        try:
            return func(*args, **kwargs)
        except QdrantConfigError:
            raise
        except Exception as exc:  # noqa: BLE001 - classified below
            # Permanent Qdrant API errors must not be retried as transient.
            from qdrant_client.http.exceptions import UnexpectedResponse

            if isinstance(exc, UnexpectedResponse):
                status = getattr(exc, "status_code", None)
                # 401/403 = auth failure, 400/404/422 = permanent request error.
                if status in (400, 401, 403, 404, 422):
                    raise QdrantConfigError(f"Qdrant request rejected (HTTP {status}): {exc}") from exc
                # Other 5xx from Qdrant itself: treat as unavailable, no retry loop here
                # beyond transient policy; fall through to unavailable mapping.
                raise QdrantUnavailableError(f"Qdrant service error: {exc}") from exc
            if _is_transient(exc):
                last_exc = exc
                if attempt < MAX_RETRIES:
                    backoff = 0.5 * (2**attempt)
                    logger.warning(
                        "Qdrant transient error (attempt %d/%d): %s; retrying in %.1fs",
                        attempt + 1,
                        1 + MAX_RETRIES,
                        type(exc).__name__,
                        backoff,
                    )
                    time.sleep(backoff)
                    # Force a fresh client so a stale pooled HTTPS connection
                    # (e.g. closed idle by Qdrant Cloud LB -> WinError 10054)
                    # is not reused on retry.
                    reset_client()
                    # Rebind func to the fresh client when it is a bound method.
                    try:
                        bound_self = getattr(func, "__self__", None)
                        func_name = getattr(func, "__func__", None)
                        if bound_self is not None and func_name is not None:
                            func = getattr(get_client(), func.__name__)
                    except Exception:
                        pass
                    continue
                break
            # Unknown non-transient error: do not fabricate results.
            raise QdrantUnavailableError(f"Qdrant operation failed: {type(exc).__name__}") from exc
    parsed = urlparse(settings.QDRANT_URL or "")
    logger.error(
        "Qdrant unreachable at %s (transient %s after %d attempts)",
        parsed.hostname or "<unconfigured>",
        type(last_exc).__name__ if last_exc else "error",
        1 + MAX_RETRIES,
    )
    raise QdrantUnavailableError(
        "Vector database is temporarily unreachable. Please retry shortly."
    ) from last_exc


def check_qdrant_health() -> dict:
    """Safe connectivity diagnostic (never exposes API key or host secrets).

    Returns a dict with ``ok``, ``collection``, ``points_count`` (when known),
    and ``detail``. Raises QdrantConfigError for bad config and
    QdrantUnavailableError when the endpoint cannot be reached.
    """
    _validate_config()
    parsed = urlparse(settings.QDRANT_URL)
    client = get_client()
    try:
        collections = _call_with_retry(client.get_collections)
        names = [c.name for c in collections.collections]
        detail: dict = {
            "ok": True,
            "host": parsed.hostname,
            "scheme": parsed.scheme,
            "collection": COLLECTION_NAME,
            "collection_exists": COLLECTION_NAME in names,
            "detail": "reachable",
        }
        if COLLECTION_NAME in names:
            try:
                info = _call_with_retry(client.get_collection, COLLECTION_NAME)
                detail["points_count"] = getattr(info, "points_count", None)
                detail["status"] = str(getattr(info, "status", ""))
            except (QdrantConfigError, QdrantUnavailableError):
                raise
            except Exception as exc:  # noqa: BLE001
                detail["detail"] = f"reachable; collection info failed: {type(exc).__name__}"
        else:
            detail["detail"] = f"reachable; collection {COLLECTION_NAME!r} not found"
        return detail
    except (QdrantConfigError, QdrantUnavailableError):
        raise
    except Exception as exc:  # noqa: BLE001
        raise QdrantUnavailableError(f"Qdrant health check failed: {type(exc).__name__}") from exc


def create_collection():

    client = get_client()
    collections = _call_with_retry(client.get_collections)

    names = [
        collection.name
        for collection in collections.collections
    ]

    if "documents" not in names:

        _call_with_retry(
            client.create_collection,
            collection_name="documents",
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )

    try:

        _call_with_retry(
            client.create_payload_index,
            collection_name="documents",
            field_name="organization_id",
            field_schema=PayloadSchemaType.KEYWORD
        )

    except Exception:
        pass

def store_embedding(
    doc_id,
    embedding,
    content
):

    client = get_client()
    _call_with_retry(
        client.upsert,
        collection_name="documents",
        points=[
            PointStruct(
                id=str(doc_id),

                vector=embedding,

                payload={
                    "content": content
                }
            )
        ]
    )

def search_documents(
    organization_id,
    query_embedding,
    limit=5
):

    print("=" * 50)
    print("QDRANT SEARCH")
    print("ORG FILTER:", organization_id)
    print("=" * 50)

    if query_embedding is None or len(query_embedding) != VECTOR_SIZE:
        raise QdrantConfigError(
            f"Query vector dimension {len(query_embedding) if query_embedding is not None else None} "
            f"does not match collection dimension {VECTOR_SIZE}."
        )

    client = get_client()
    results = _call_with_retry(
        client.query_points,
        collection_name="documents",

        query=query_embedding,

        query_filter=Filter(
            must=[
                FieldCondition(
                    key="organization_id",
                    match=MatchValue(
                        value=str(
                            organization_id
                        )
                    )
                )
            ]
        ),

        limit=limit
    )

    print(
        "POINTS RETURNED:",
        len(results.points)
    )

    for point in results.points:

        print(
            "FOUND ORG:",
            point.payload.get(
                "organization_id"
            )
        )

    return results.points

def store_chunks(
    organization_id: str,
    document_id: str,
    chunks: list
):

    points = []

    for index, chunk in enumerate(chunks):

        from app.services.embedding_service import create_embedding

        embedding = create_embedding(chunk)

        points.append(

            PointStruct(
                id=str(uuid.uuid4()),

                vector=embedding,

                payload={
                    "organization_id": str(organization_id),
                    "document_id": str(document_id),
                    "chunk_index": index,
                    "content": chunk
                }
            )
        )

    client = get_client()
    _call_with_retry(
        client.upsert,
        collection_name="documents",
        points=points
    )