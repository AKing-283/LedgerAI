import uuid
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.models import Notification


def create_notification(
    db: Session,
    organization_id,
    title: str,
    message: str,
    type: str
):
    notification = Notification(
        id=uuid.uuid4(),
        organization_id=organization_id,
        title=title,
        message=message,
        type=type,
        is_read=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def get_notifications(db: Session, organization_id):
    return (
        db.query(Notification)
        .filter(Notification.organization_id == organization_id)
        .order_by(desc(Notification.created_at))
        .all()
    )


def get_unread_count(db: Session, organization_id):
    return (
        db.query(Notification)
        .filter(
            Notification.organization_id == organization_id,
            Notification.is_read == False
        )
        .count()
    )


def mark_read(db: Session, organization_id, notification_id):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.organization_id == organization_id
        )
        .first()
    )

    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)

    return notification


def mark_all_read(db: Session, organization_id):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.organization_id == organization_id,
            Notification.is_read == False
        )
        .all()
    )

    for n in notifications:
        n.is_read = True

    db.commit()

    return True


def delete_notification(db: Session, organization_id, notification_id):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.organization_id == organization_id
        )
        .first()
    )

    if notification:
        db.delete(notification)
        db.commit()

    return True