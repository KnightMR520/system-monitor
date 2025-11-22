import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from loguru import logger

from app.monitor import SystemMonitor

router = APIRouter()
monitor = SystemMonitor(sample_interval=0.1)


@router.get("/metrics")
async def get_metrics():
    """Return a single snapshot of system metrics."""
    logger.info("GET /metrics")
    return monitor.sample()


@router.get("/health")
async def health_check():
    logger.info("GET /health")
    return {"status": "ok"}


@router.websocket("/ws/metrics")
async def websocket_metrics(ws: WebSocket):
    """
    Sends system metrics to the client continuously via WebSocket.
    """
    logger.info("WebSocket: Connection attempt")

    await ws.accept()
    logger.info("WebSocket: Client connected")

    try:
        while True:
            data = monitor.sample()
            await ws.send_json(data)
            await asyncio.sleep(0.9)

    except WebSocketDisconnect:
        logger.warning("WebSocket: Client disconnected")

    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await ws.close()

    finally:
        logger.info("WebSocket: Connection closed")
