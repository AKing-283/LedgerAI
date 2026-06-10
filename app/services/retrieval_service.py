from app.services.embedding_service import create_embedding
from app.services.qdrant_service import search_documents


def retrieve_context(
    question: str
):

    query_embedding = create_embedding(
        question
    )

    results = search_documents(
        query_embedding
    )

    context = []

    for result in results:

        payload = result.payload or {}

        if payload:
            context.append(
                payload.get(
                    "content",
                    ""
                )
            )

    return "\n\n".join(context)