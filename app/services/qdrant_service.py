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

client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY
)


def create_collection():

    collections = client.get_collections()

    names = [
        collection.name
        for collection in collections.collections
    ]

    if "documents" not in names:

        client.create_collection(
            collection_name="documents",
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )

    try:

        client.create_payload_index(
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

    client.upsert(
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

    results = client.query_points(
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

    client.upsert(
        collection_name="documents",
        points=points
    )