"""Safe Qdrant connectivity diagnostic (masks secrets).

Usage (Windows):
    myenv\\Scripts\\python scripts/check_qdrant.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

from urllib.parse import urlparse

from app.config.settings import settings
from app.services.qdrant_service import (
    check_qdrant_health,
    QdrantConfigError,
    QdrantUnavailableError,
)


def main() -> int:
    url = settings.QDRANT_URL or ""
    parsed = urlparse(url)
    print(f"scheme: {parsed.scheme}")
    print(f"host: {parsed.hostname}")
    print(f"port: {parsed.port}")
    print(f"url_length: {len(url)}")
    print(f"api_key_configured: {bool((settings.QDRANT_API_KEY or '').strip())}")
    print(f"api_key_length: {len(settings.QDRANT_API_KEY or '')}")
    try:
        info = check_qdrant_health()
        print(f"reachable: True")
        print(f"collection: {info.get('collection')}")
        print(f"collection_exists: {info.get('collection_exists')}")
        print(f"points_count: {info.get('points_count')}")
        print(f"status: {info.get('status')}")
        print(f"detail: {info.get('detail')}")
        return 0
    except QdrantConfigError as exc:
        print(f"reachable: False (config error: {exc})")
        return 2
    except QdrantUnavailableError as exc:
        print(f"reachable: False (unavailable: {type(exc).__name__})")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())