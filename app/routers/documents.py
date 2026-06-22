from fastapi import APIRouter
from fastapi import Depends

from app.auth.auth_dependency import (
    get_current_user
)

from app.db.session import SessionLocal
from app.db.models import Document

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