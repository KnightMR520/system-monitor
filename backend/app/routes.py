from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.monitor import SystemMonitor
import asyncio

router = APIRouter()
monitor = SystemMonitor(sample_interval=0.1)

@router.get("/metrics")
async def get_metrics():
    """Return a single snapshot (blocking call inside)."""
    return monitor.sample()


@router.websocket("/ws/metrics")
async def websocket_metrics(ws: WebSocket):
    """
    Sends metric updates to connected client every second.
    Note: WebSocket URL is: ws://localhost:8000/api/ws/metrics
    """
    await ws.accept()
    try:
        while True:
            data = monitor.sample()
            await ws.send_json(data)
            # throttle update rate (client may also throttle)
            await asyncio.sleep(0.9)
    except WebSocketDisconnect:
        pass
    except Exception:
        await ws.close()