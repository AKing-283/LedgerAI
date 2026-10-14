from datetime import datetime
from datetime import timedelta

import jwt

from app.config.settings import settings

ALGORITHM = "HS256"

TOKEN_EXPIRE_HOURS = 24

_MIN_KEY_BYTES = 32


def _get_secret_key() -> str:
    key = (settings.JWT_SECRET_KEY or "").strip()
    if not key:
        raise ValueError(
            "JWT_SECRET_KEY is not configured. Set JWT_SECRET_KEY in the environment."
        )
    if len(key.encode("utf-8")) < _MIN_KEY_BYTES:
        raise ValueError(
            f"JWT_SECRET_KEY must be at least {_MIN_KEY_BYTES} bytes "
            f"(got {len(key.encode('utf-8'))}). Generate one with: "
            "python -c \"import secrets; print(secrets.token_urlsafe(48))\" "
            "and set it as JWT_SECRET_KEY. Existing tokens will be invalidated."
        )
    return key


def create_token(user, organization_name=""):

    payload = {
        "user_id": str(user.id),
        "organization_id": str(
            user.organization_id
        ),
        "email": user.email,
        "organization_name": organization_name,
        "exp": datetime.utcnow()
        + timedelta(
            hours=TOKEN_EXPIRE_HOURS
        )
    }

    token = jwt.encode(
        payload,
        _get_secret_key(),
        algorithm=ALGORITHM
    )

    return token


def decode_token(token):

    payload = jwt.decode(
        token,
        _get_secret_key(),
        algorithms=[ALGORITHM]
    )

    return payload