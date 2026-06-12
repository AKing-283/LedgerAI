from fastapi import APIRouter
from fastapi import HTTPException

from passlib.context import CryptContext

from app.schemas.auth import LoginRequest
from app.schemas.auth import RegisterRequest

from app.services.postgres_service import (
    get_user_by_email,
    create_user,
    create_organization
)
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

    token = create_token(user)

    return {
        "message": "Registration successful",
        "access_token": token,
        "user_id": str(user.id),
        "organization_id": str(
            organization.id
        ),
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

    token = create_token(
        user
    )

    return {
        "access_token": token,
        "user_id": str(user.id),
        "organization_id": str(
            user.organization_id
        )
    }