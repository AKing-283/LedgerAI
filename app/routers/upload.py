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
from app.services.document_metadata_service import (
    extract_metadata,
    extract_gst
)

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

    print("\n" + "=" * 80)
    print("UPLOAD STARTED")
    print("=" * 80)

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

    print("FILE SAVED:", file.filename)
    print("PATH:", file_path)

    # --------------------------------------------------
    # PDF EXTRACTION
    # --------------------------------------------------

    text = extract_text(file_path)

    print("\nPDF TEXT LENGTH:")
    print(len(text))

    print("\nFIRST 3000 CHARS OF PDF:")
    print(text[:3000])

    # --------------------------------------------------
    # GST DEBUG
    # --------------------------------------------------

    extracted_gst = extract_gst(text)

    print("\nGST FOUND BY REGEX:")
    print(extracted_gst)

    # --------------------------------------------------
    # METADATA EXTRACTION
    # --------------------------------------------------

    metadata = extract_metadata(text)

    print("\nLLM METADATA:")
    print(metadata)

    # --------------------------------------------------
    # SAVE DOCUMENT
    # --------------------------------------------------

    document = save_document(
        organization_id=organization_id,
        filename=file.filename,
        content=text,
        metadata=metadata
    )

    print("\nDOCUMENT SAVED")
    print("ID:", document.id)

    print("VENDOR:", document.vendor)
    print("INVOICE:", document.invoice_number)
    print("GST:", document.gst_number)
    print("AMOUNT:", document.amount)
    print("DATE:", document.invoice_date)

    # --------------------------------------------------
    # VECTOR STORE
    # --------------------------------------------------

    chunks = create_chunks(text)

    print("\nTOTAL CHUNKS:")
    print(len(chunks))

    store_chunks(
        organization_id=organization_id,
        document_id=document.id,
        chunks=chunks
    )

    print("\nUPLOAD COMPLETED")
    print("=" * 80)

    return {
        "document_id": str(document.id),
        "filename": file.filename,
        "message": "Uploaded successfully"
    }