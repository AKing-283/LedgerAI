from fastapi import APIRouter
from fastapi import Depends

from app.auth.auth_dependency import (
    get_current_user
)

from app.db.session import SessionLocal
from app.db.models import Document
from app.services.notification_service import create_notification
from app.services.postgres_service import get_db
from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException

router = APIRouter(tags=["Documents"])


@router.get("/documents")
def get_documents(
    current_user=Depends(get_current_user)
):

    organization_id = current_user[
        "organization_id"
    ]

    db = SessionLocal()

    docs = db.query(Document).filter(
        Document.organization_id ==
        organization_id
    ).all()

    db.close()

    return [
        {
            "id": str(doc.id),
            "filename": doc.filename,
            "vendor": doc.vendor,
            "invoice_number": doc.invoice_number,
            "gst_number": doc.gst_number,
            "amount": doc.amount,
            "invoice_date": doc.invoice_date
        }
        for doc in docs
    ]


@router.delete("/documents/{document_id}")
def delete_document(
    document_id: UUID,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    organization_id = current_user["organization_id"]

    document = db.query(Document).filter(
        Document.id == document_id,
        Document.organization_id == organization_id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    filename = document.filename

    db.delete(document)
    db.commit()

    create_notification(
        db=db,
        organization_id=organization_id,
        title="Document Deleted",
        message=f"{filename} was removed",
        type="DOCUMENT_DELETED"
    )

    return {"message": "Document deleted successfully"}
