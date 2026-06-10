import uuid

from datetime import UTC, datetime

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Text, Integer, Float

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Document(Base):

    __tablename__ = "documents"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    filename = Column(
        String,
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    total_chunks = Column(
        Integer,
        default=0
    )
    vendor = Column(String)
    invoice_number = Column(String)
    gst_number = Column(String)
    amount = Column(Float)
    invoice_date = Column(String)
    uploaded_at = Column(
        DateTime,
        default=datetime.now(UTC)
    )