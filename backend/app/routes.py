import asyncio
from datetime import datetime, timedelta

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import Metric
from app.monitor import SystemMonitor

router = APIRouter()
monitor = SystemMonitor(sample_interval=0.1)


# GET latest snapshot
@router.get("/metrics")
async def get_metrics():
    return monitor.sample()


# GET historical metrics
@router.get("/metrics/history")
async def get_metrics_history(hours: int = Query(1, ge=1, le=24)):
    db: Session = SessionLocal()
    since = datetime.utcnow() - timedelta(hours=hours)
    records = db.query(Metric).filter(Metric.timestamp >= since).order_by(Metric.timestamp.asc()).all()
    db.close()

    # Convert SQLAlchemy objects to dict
    return [
        {
            "timestamp": r.timestamp.isoformat(),
            "cpu_avg": r.cpu_avg,
            "cpu_per_core": r.cpu_per_core,
            "memory_percent": r.memory_percent,
            "disk_read_bps": r.disk_read_bps,
            "disk_write_bps": r.disk_write_bps,
            "net_recv_bps": r.net_recv_bps,
            "net_sent_bps": r.net_sent_bps,
            "gpu": r.gpu,
        }
        for r in records
    ]


# WebSocket real-time streaming
@router.websocket("/ws/metrics")
async def websocket_metrics(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = monitor.sample()
            await ws.send_json(data)
            await asyncio.sleep(1)  # send every 1 second
    except WebSocketDisconnect:
        pass
    except Exception:
        await ws.close()


# Health check
@router.get("/health")
async def health_check():
    return {"status": "ok"}
