from fastapi import FastAPI

from app.routers.upload import router as upload_router
from app.routers.chat import router as chat_router
from app.routers import auth
from app.routers.auth import (
    router as auth_router
)
from app.db.init_db import init_db

from app.services.qdrant_service import create_collection
from app.routers.debug import router as debug_router
from app.routers.documents import router as documents_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="AI Accounting Copilot"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(documents_router)
app.include_router(
    auth_router
)
@app.on_event("startup")
def startup():

    init_db()

    create_collection()


app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(debug_router)

@app.get("/")
def home():

    return {
        "status": "running"
    }
