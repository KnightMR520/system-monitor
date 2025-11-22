import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.routes import router as metrics_router
from app.worker import log_metrics_loop

app = FastAPI(title="System Monitor API")
app.include_router(metrics_router, prefix="/api")

logger.add("logs/system.log", rotation="1 day")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Start background metric logging
    asyncio.create_task(log_metrics_loop())
    logger.info("Background logging started.")