from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db

from app.routers.upload import router as upload_router
from app.routers.chat import router as chat_router
from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.routers.debug import router as debug_router
from app.routers.notifications import router as notifications_router

from app.services.qdrant_service import create_collection

app = FastAPI(
    title="AI Accountant Copilot"
)

# ---------------------------
# CORS
# ---------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------------------
# Startup
# ---------------------------

@app.on_event("startup")
def startup():

    print("Starting application...")

    try:
        init_db()
        print("Database initialized")
    except Exception as e:
        print(f"Database startup error: {e}")

    try:
        create_collection()
        print("Qdrant collection ready")
    except Exception as e:
        print(f"Qdrant startup error: {e}")

# ---------------------------
# Routers
# ---------------------------

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(debug_router)
app.include_router(notifications_router)

# ---------------------------
# Health Check
# ---------------------------

@app.get("/")
def home():

    return {
        "status": "running",
        "service": "AI Accountant Copilot"
    }

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }