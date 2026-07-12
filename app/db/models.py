import uuid

from datetime import UTC, datetime

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Text, Integer, Float, Boolean

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Document(Base):

    __tablename__ = "documents"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False
    )

    filename = Column(String, nullable=False)

    content = Column(Text, nullable=False)

    total_chunks = Column(Integer, default=0)

    vendor = Column(String)

    invoice_number = Column(String)

    gst_number = Column(String, nullable=True)

    amount = Column(Float)

    invoice_date = Column(String)

    uploaded_at = Column(
        DateTime,
        default=datetime.now(UTC)
    )

class User(Base):

    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False
    )

    reset_token = Column(String, nullable=True)
    reset_token_expires_at = Column(DateTime, nullable=True)

class Organization(Base):

    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True),
                primary_key=True,
                default=uuid.uuid4)

    name = Column(String, nullable=False)


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False
    )

    title = Column(String, nullable=False)

    message = Column(Text, nullable=False)

    type = Column(String, nullable=False)

    is_read = Column(Boolean, nullable=False, default=False)

    created_at = Column(
        DateTime,
        default=datetime.now(UTC)
    )
