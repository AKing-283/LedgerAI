from app.db.session import SessionLocal
from app.db.models import Document
from sqlalchemy import or_
from app.db.models import User
from app.schemas.auth import LoginRequest
from fastapi import APIRouter
from app.auth.password_service import (
    verify_password
)

from app.auth.jwt_service import (
    create_token
)
from app.db.models import User
from app.db.models import Organization
from app.services.notification_service import create_notification
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_document(
    organization_id,
    filename,
    content,
    metadata
):

    db = SessionLocal()

    document = Document(
        organization_id=organization_id,
        filename=filename,
        content=content,
        vendor=metadata.get("vendor", ""),
        invoice_number=metadata.get("invoice_number", ""),
        gst_number=metadata.get("gst_number", ""),
        amount=float(metadata.get("amount", 0) or 0),
        invoice_date=metadata.get("date", "")
    )

    existing = db.query(Document).filter(
        Document.organization_id == organization_id,
        Document.invoice_number == metadata.get(
            "invoice_number",
            ""
        )
    ).first()

    if existing:
        create_notification(
            db=db,
            organization_id=organization_id,
            title="Duplicate Invoice",
            message=f"Invoice {metadata.get('invoice_number', '')} already exists",
            type="DUPLICATE_INVOICE"
        )
        db.close()
        return existing
    db.add(document)

    db.commit()

    db.refresh(document)

    return document

def search_documents_keyword(
    organization_id: str,
    question: str,
    limit: int = 5
):

    db = SessionLocal()

    results = db.query(Document).filter(
        Document.organization_id == organization_id,
        or_(
            Document.content.ilike(f"%{question}%"),
            Document.vendor.ilike(f"%{question}%"),
            Document.invoice_number.ilike(f"%{question}%"),
            Document.gst_number.ilike(f"%{question}%")
        )

    ).limit(limit).all()

    db.close()

    return results

def get_user_by_email(email):

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    db.close()

    return user


def create_organization(
    name: str
):

    db = SessionLocal()

    organization = Organization(
        name=name
    )

    db.add(organization)

    db.commit()

    db.refresh(organization)

    db.close()

    return organization

def create_user(
    email,
    password_hash,
    organization_id
):

    db = SessionLocal()

    user = User(
        email=email,
        password_hash=password_hash,
        organization_id=organization_id
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    db.close()

    return user