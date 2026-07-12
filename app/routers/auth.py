from fastapi import APIRouter
from fastapi import HTTPException

from passlib.context import CryptContext

import secrets
from datetime import datetime, timedelta

from app.schemas.auth import LoginRequest
from app.schemas.auth import RegisterRequest
from app.schemas.auth import ForgotPasswordRequest
from app.schemas.auth import ResetPasswordRequest

from app.services.postgres_service import (
    get_user_by_email,
    get_organization_by_id,
    save_reset_token,
    get_user_by_reset_token,
    update_password,
    create_user,
    create_organization
)
from app.services.email_service import send_password_reset_email
from app.auth.password_service import (
    hash_password
)
from app.auth.password_service import (
    verify_password
)

from app.auth.jwt_service import (
    create_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


@router.post("/register")
def register(
    request: RegisterRequest
):

    existing_user = get_user_by_email(
        request.email
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    organization = create_organization(
        request.organization_name
    )

    password_hash = hash_password(
        request.password[:72]
    )

    user = create_user(
        email=request.email,
        password_hash=password_hash,
        organization_id=organization.id
    )

    token = create_token(user, organization_name=organization.name)

    return {
        "message": "Registration successful",
        "access_token": token,
        "user_id": str(user.id),
        "organization_id": str(organization.id),
        "organization_name": organization.name,
        "email": user.email
    }


@router.post("/login")
def login(
    request: LoginRequest
):

    user = get_user_by_email(
        request.email
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    valid_password = verify_password(
        request.password,
        user.password_hash
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    org = get_organization_by_id(
        user.organization_id
    )

    org_name = org.name if org else ""

    token = create_token(user, organization_name=org_name)

    return {
        "access_token": token,
        "user_id": str(user.id),
        "organization_id": str(
            user.organization_id
        ),
        "organization_name": org_name
    }


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest
):

    user = get_user_by_email(
        request.email
    )

    # Always return same message — security best practice
    message = "If the email exists, a password reset link has been sent."

    if not user:
        return {"message": message}

    # Generate secure token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)

    # Save to DB
    save_reset_token(
        user.id,
        token,
        expires_at
    )

    # Get org name for email context
    org = get_organization_by_id(
        user.organization_id
    )
    org_name = org.name if org else "LedgerAI"

    # Send email
    email_sent = send_password_reset_email(
        request.email,
        token,
        org_name
    )

    if not email_sent:
        raise HTTPException(
            status_code=500,
            detail="Failed to send password reset email. Please try again later or contact support."
        )

    return {"message": message}


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest
):

    user = get_user_by_reset_token(
        request.token
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token."
        )

    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters."
        )

    new_hash = hash_password(
        request.new_password[:72]
    )

    update_password(
        user.id,
        new_hash
    )

    return {
        "message": "Password updated successfully. You can now login with your new password."
    }
