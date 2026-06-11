import os

from pydoc import doc
from uuid import uuid4

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

from app.services.pdf_service import extract_text

from app.services.embedding_service import create_embedding

from app.services.postgres_service import save_document

from app.services.qdrant_service import store_embedding
from app.services.chunking_service import create_chunks
from app.services.qdrant_service import store_chunks
from app.services.document_metadata_service import extract_metadata
router = APIRouter()


UPLOAD_DIR = "/tmp"
os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    file_id = str(uuid4())

    file_path = os.path.join(
        UPLOAD_DIR,
        f"{file_id}.pdf"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
        )

    text = extract_text(file_path)
    metadata = extract_metadata(text)
    print("\n===== METADATA =====")
    print(metadata)
    print("====================\n")
    document = save_document(
        filename=file.filename,
        content=text,
        metadata=metadata
    )
    
    chunks = create_chunks(text)
    document.total_chunks = len(chunks)

    store_chunks(
        document.id,
        chunks
    )

    return {
        "document_id": str(document.id),
        "filename": file.filename,
        "message": "Uploaded successfully"
    }