import os

from uuid import uuid4

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from app.services.pdf_service import extract_text
from app.services.postgres_service import save_document
from app.services.chunking_service import create_chunks
from app.services.qdrant_service import store_chunks
from app.services.document_metadata_service import extract_metadata

from app.auth.auth_dependency import get_current_user

router = APIRouter()

UPLOAD_DIR = "/tmp"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    organization_id = current_user["organization_id"]

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

    document = save_document(
        organization_id=organization_id,
        filename=file.filename,
        content=text,
        metadata=metadata
    )

    chunks = create_chunks(text)

    store_chunks(
        organization_id=organization_id,
        document_id=document.id,
        chunks=chunks
    )

    return {
        "document_id": str(document.id),
        "filename": file.filename,
        "message": "Uploaded successfully"
    }