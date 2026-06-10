from app.db.session import SessionLocal
from app.db.models import Document


def save_document(
    filename: str,
    content: str,
    metadata: dict
):

    db = SessionLocal()

    document = Document(
        filename=filename,
        content=content,
        vendor=metadata.get("vendor"),
        invoice_number=metadata.get("invoice_number"),
        gst_number=metadata.get("gst_number"),
        amount=metadata.get("amount"),
        invoice_date=metadata.get("date")
    )

    db.add(document)

    db.commit()

    db.refresh(document)

    db.close()

    return document