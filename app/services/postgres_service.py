from datetime import datetime

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
    metadata,
    db=None
):
    """Persist a Document.

    Prefer the caller's session (e.g. the FastAPI route's ``db`` from
    ``get_db``) so the returned ORM object stays bound for the request
    and ``document.id`` etc. never raise ``DetachedInstanceError``.
    When no session is supplied, an owned session is created and the
    object is expunged with loaded attributes before the session closes.
    """
    owns_session = db is None
    if owns_session:
        db = SessionLocal()
    try:
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

        invoice_no = metadata.get("invoice_number", "") or ""
        existing = None
        if invoice_no:
            existing = db.query(Document).filter(
                Document.organization_id == organization_id,
                Document.invoice_number == invoice_no
            ).first()

        if existing:
            create_notification(
                db=db,
                organization_id=organization_id,
                title="Duplicate Invoice",
                message=f"Invoice {invoice_no} already exists",
                type="DUPLICATE_INVOICE"
            )
            if owns_session:
                # Load attributes before detaching so callers can safely
                # read ids/fields after the owned session closes.
                db.refresh(existing)
                db.expunge(existing)
            return existing
        db.add(document)

        db.commit()

        db.refresh(document)

        if owns_session:
            db.expunge(document)

        return document
    finally:
        if owns_session:
            db.close()

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


def get_organization_by_id(org_id):

    db = SessionLocal()

    org = db.query(Organization).filter(
        Organization.id == org_id
    ).first()

    db.close()

    return org


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

def save_reset_token(user_id, token, expires_at):

    db = SessionLocal()

    db.query(User).filter(
        User.id == user_id
    ).update({
        "reset_token": token,
        "reset_token_expires_at": expires_at
    })

    db.commit()
    db.close()


def get_user_by_reset_token(token):

    db = SessionLocal()

    user = db.query(User).filter(
        User.reset_token == token,
        User.reset_token_expires_at > datetime.utcnow()
    ).first()

    db.close()

    return user


def update_password(user_id, new_hash):

    db = SessionLocal()

    db.query(User).filter(
        User.id == user_id
    ).update({
        "password_hash": new_hash,
        "reset_token": None,
        "reset_token_expires_at": None
    })

    db.commit()
    db.close()


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