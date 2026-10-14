from app.services.embedding_service import create_embedding
from app.services.qdrant_service import search_documents


def retrieve_chunks(
    organization_id,
    question,
    limit=5,
):
    """Return structured chunks with document/organization identifiers.

    Each item: {"content": str, "document_id": str|None,
    "organization_id": str|None, "chunk_index": int|None}.
    Raises QdrantUnavailableError/QdrantConfigError on retrieval failure
    (never returns fabricated results).
    """
    print("RETRIEVE CONTEXT")
    print("ORG:", organization_id)

    query_embedding = create_embedding(
        question
    )

    results = search_documents(
        organization_id,
        query_embedding,
        limit=limit,
    )

    print(
        "RESULTS FOUND:",
        len(results)
    )

    chunks = []

    for result in results:

        payload = result.payload or {}

        print(
            "PAYLOAD ORG:",
            payload.get(
                "organization_id"
            )
        )

        chunks.append(
            {
                "content": payload.get("content", ""),
                "document_id": payload.get("document_id"),
                "organization_id": payload.get("organization_id"),
                "chunk_index": payload.get("chunk_index"),
            }
        )

    return chunks


def retrieve_context(
    organization_id,
    question
):
    """Legacy string interface expected by DocumentAgent.

    Joins chunk contents; returns "" when no documents match.
    Lets QdrantUnavailableError/QdrantConfigError propagate so callers
    can distinguish connectivity failure from empty results.
    """

    chunks = retrieve_chunks(organization_id, question)

    context = [c["content"] for c in chunks if c["content"]]

    return "\n\n".join(context)