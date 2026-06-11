from app.services.embedding_service import (
    create_embedding
)

from app.services.qdrant_service import (
    search_documents
)

from app.services.postgres_service import (
    search_documents_keyword
)


def retrieve_context(
    question: str
):

    context_parts = []

    # ------------------
    # Keyword Search
    # ------------------

    keyword_results = search_documents_keyword(
        question
    )

    for doc in keyword_results:

        if doc.content:

            context_parts.append(
                doc.content[:3000]
            )

    # ------------------
    # Vector Search
    # ------------------

    query_embedding = create_embedding(
        question
    )

    vector_results = search_documents(
        query_embedding,
        limit=8
    )

    for result in vector_results:

        payload = result.payload or {}

        content = payload.get(
            "content",
            ""
        )

        if content:

            context_parts.append(
                content
            )

    # Remove duplicates

    unique_context = []

    seen = set()

    for item in context_parts:

        if item not in seen:

            unique_context.append(item)

            seen.add(item)

    return "\n\n".join(unique_context)