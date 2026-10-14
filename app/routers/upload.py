import os

from uuid import uuid4

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException

from app.services.pdf_service import extract_text
from app.services.postgres_service import save_document
from app.services.chunking_service import create_chunks
from app.services.qdrant_service import store_chunks
from app.services.qdrant_service import QdrantConfigError, QdrantUnavailableError
from app.services.document_metadata_service import (
    extract_metadata,
    extract_gst
)

from app.auth.auth_dependency import get_current_user
from app.services.notification_service import create_notification
from app.services.postgres_service import get_db
from sqlalchemy.orm import Session

router = APIRouter()

UPLOAD_DIR = "/tmp"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
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

    if extracted_gst:
        create_notification(
            db=db,
            organization_id=organization_id,
            title="GST Detected",
            message=f"GST {extracted_gst} extracted successfully",
            type="GST_EXTRACTED"
        )

    # --------------------------------------------------
    # METADATA EXTRACTION
    # --------------------------------------------------

    metadata = extract_metadata(text)

    print("\nLLM METADATA:")
    print(metadata)

    # --------------------------------------------------
    # SAVE DOCUMENT (uses the route's session so the returned
    # object stays bound and document.id is stable)
    # --------------------------------------------------

    document = save_document(
        organization_id=organization_id,
        filename=file.filename,
        content=text,
        metadata=metadata,
        db=db,
    )

    print("\nDOCUMENT SAVED")
    print("ID:", document.id)

    print("VENDOR:", document.vendor)
    print("INVOICE:", document.invoice_number)
    print("GST:", document.gst_number)
    print("AMOUNT:", document.amount)
    print("DATE:", document.invoice_date)

    document_id = str(document.id)

    # --------------------------------------------------
    # VECTOR STORE (required: do not claim full success if it fails)
    # --------------------------------------------------

    chunks = create_chunks(text)

    print("\nTOTAL CHUNKS:")
    print(len(chunks))

    try:
        store_chunks(
            organization_id=organization_id,
            document_id=document_id,
            chunks=chunks
        )
    except (QdrantUnavailableError, QdrantConfigError) as exc:
        # PostgreSQL persistence succeeded but vector storage failed.
        # Surface a clear partial-failure instead of "Uploaded successfully".
        raise HTTPException(
            status_code=500,
            detail=(
                "Document saved to database but vector indexing failed. "
                f"document_id={document_id}. Please retry indexing."
            ),
        ) from exc

    # --------------------------------------------------
    # NOTIFICATION: DOCUMENT UPLOADED
    # --------------------------------------------------

    create_notification(
        db=db,
        organization_id=organization_id,
        title="Document Uploaded",
        message=f"{file.filename} uploaded successfully",
        type="DOCUMENT_UPLOADED"
    )

    print("\nUPLOAD COMPLETED")
    print("=" * 80)

    return {
        "document_id": document_id,
        "filename": file.filename,
        "message": "Uploaded successfully"
    }