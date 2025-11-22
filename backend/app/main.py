from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.routes import router as metrics_router

# -------------------------
# Logging Setup
# -------------------------
logger.add("logs/system.log", rotation="1 day", backtrace=True, diagnose=True)

# -------------------------
# App Setup
# -------------------------
app = FastAPI(title="System Monitor API")

# API routes
app.include_router(metrics_router, prefix="/api")

# -------------------------
# CORS Configuration
# -------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
