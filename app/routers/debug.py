from fastapi import APIRouter

from app.db.session import SessionLocal
from app.db.models import Document

router = APIRouter()


@router.get("/documents")
def documents():

    db = SessionLocal()

    rows = db.query(
        Document
    ).all()

    result = []

    for row in rows:

        result.append({
            "filename": row.filename,
            "vendor": row.vendor,
            "invoice_number": row.invoice_number,
            "amount": row.amount
        })

    db.close()

    return result