from app.db.session import SessionLocal
from app.db.models import Document


def get_invoice_count():

    db = SessionLocal()

    count = db.query(Document).count()

    db.close()

    return count


def get_total_invoice_value():

    db = SessionLocal()

    docs = db.query(Document).all()

    total = sum(
        doc.amount or 0
        for doc in docs
    )

    db.close()

    return total


def get_vendor_summary():

    db = SessionLocal()

    docs = db.query(Document).all()

    result = {}

    for doc in docs:

        vendor = doc.vendor or "Unknown"

        result[vendor] = (
            result.get(vendor, 0)
            + (doc.amount or 0)
        )

    db.close()

    return result