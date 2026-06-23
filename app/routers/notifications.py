from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.services.postgres_service import get_db
from app.auth.auth_dependency import get_current_user
from app.services.notification_service import (
    get_notifications,
    get_unread_count,
    mark_read,
    mark_all_read,
    delete_notification
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("")
def fetch_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    notifications = get_notifications(db, current_user["organization_id"])
    return notifications


@router.get("/unread-count")
def fetch_unread_count(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    count = get_unread_count(db, current_user["organization_id"])
    return {"unread_count": count}


@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    notification = mark_read(
        db,
        current_user["organization_id"],
        notification_id
    )

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    return {"message": "Notification marked as read"}


@router.put("/read-all")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    mark_all_read(db, current_user["organization_id"])
    return {"message": "All notifications marked as read"}


@router.delete("/{notification_id}")
def remove_notification(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    delete_notification(
        db,
        current_user["organization_id"],
        notification_id
    )

    return {"message": "Notification deleted"}