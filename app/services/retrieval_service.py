from app.services.embedding_service import create_embedding
from app.services.qdrant_service import search_documents


def retrieve_context(
    organization_id,
    question
):

    print("RETRIEVE CONTEXT")
    print("ORG:", organization_id)

    query_embedding = create_embedding(
        question
    )

    results = search_documents(
        organization_id,
        query_embedding
    )

    print(
        "RESULTS FOUND:",
        len(results)
    )

    context = []

    for result in results:

        payload = result.payload or {}

        print(
            "PAYLOAD ORG:",
            payload.get(
                "organization_id"
            )
        )

        context.append(
            payload.get(
                "content",
                ""
            )
        )

    return "\n\n".join(context)