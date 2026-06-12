from datetime import datetime
from datetime import timedelta

import jwt

SECRET_KEY = "super-secret-key"

ALGORITHM = "HS256"

TOKEN_EXPIRE_HOURS = 24


def create_token(user):

    payload = {
        "user_id": str(user.id),
        "organization_id": str(
            user.organization_id
        ),
        "email": user.email,
        "exp": datetime.utcnow()
        + timedelta(
            hours=TOKEN_EXPIRE_HOURS
        )
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def decode_token(token):

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return payload