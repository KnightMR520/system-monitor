import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.routes import router as metrics_router
from app.worker import log_metrics_loop, monitor  # make sure monitor is imported

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

# --- WebSocket endpoint ---
@app.websocket("/ws/metrics")
async def websocket_metrics(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = monitor.sample()
            try:
                await ws.send_json(data)
            except WebSocketDisconnect:
                logger.info("WebSocket client disconnected")
                break
            await asyncio.sleep(1)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await ws.close()