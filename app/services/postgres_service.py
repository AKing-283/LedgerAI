from app.db.session import SessionLocal
from app.db.models import Document
from sqlalchemy import or_


def save_document(
    filename,
    content,
    metadata
):

    db = SessionLocal()

    document = Document(
        filename=filename,
        content=content,
        vendor=metadata.get("vendor", ""),
        invoice_number=metadata.get("invoice_number", ""),
        gst_number=metadata.get("gst_number", ""),
        amount=float(metadata.get("amount", 0) or 0),
        invoice_date=metadata.get("date", "")
    )

    db.add(document)

    db.commit()

    db.refresh(document)

    return document

def search_documents_keyword(
    question: str,
    limit: int = 5
):

    db = SessionLocal()

    results = db.query(Document).filter(

        or_(
            Document.content.ilike(f"%{question}%"),
            Document.vendor.ilike(f"%{question}%"),
            Document.invoice_number.ilike(f"%{question}%"),
            Document.gst_number.ilike(f"%{question}%")
        )

    ).limit(limit).all()

    db.close()

    return results