from qdrant_client import QdrantClient
from qdrant_client.models import Distance
from qdrant_client.models import VectorParams
import uuid
from app.config.settings import settings
from qdrant_client.models import PointStruct
from qdrant_client.models import Filter

client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY
)


def create_collection():

    collections = client.get_collections()

    names = [
        collection.name
        for collection
        in collections.collections
    ]

    if "documents" not in names:

        client.create_collection(
            collection_name="documents",
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )

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
    query_embedding,
    limit=10
):

    print("Searching Qdrant...")
    print(f"Embedding length: {len(query_embedding)}")

    results = client.query_points(
        collection_name="documents",
        query=query_embedding,
        limit=limit
    )

    print(results)

    return results.points

def store_chunks(
    document_id,
    chunks
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