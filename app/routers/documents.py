from fastapi import APIRouter
from app.db.session import SessionLocal
from app.db.models import Document

router = APIRouter(tags=["Documents"])


@router.get("/documents")
def get_documents():

    db = SessionLocal()

    docs = db.query(Document).all()

    return [
        {
            "id": str(doc.id),
            "filename": doc.filename,
            "vendor": doc.vendor,
            "invoice_number": doc.invoice_number,
            "amount": doc.amount,
            "invoice_date": doc.invoice_date
        }
        for doc in docs
    ]