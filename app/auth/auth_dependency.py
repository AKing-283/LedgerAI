from fastapi import Header
from fastapi import HTTPException

from app.auth.jwt_service import decode_token


def get_current_user(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    if not authorization.startswith(
        "Bearer "
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid token format"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:

        payload = decode_token(token)

        return payload

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )