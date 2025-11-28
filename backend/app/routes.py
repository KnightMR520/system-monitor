import asyncio
from datetime import datetime, timedelta
from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.alerts import evaluate_alerts
from app.db import SessionLocal
from app.models import Metric
from app.monitor import SystemMonitor
from app.settings import get_settings, update_settings

router = APIRouter()
# Make monitor read sample_interval from settings if needed; currently we create with default.
monitor = SystemMonitor(sample_interval=get_settings().get("sample_interval", 0.1))


# GET latest snapshot
@router.get("/metrics")
async def get_metrics():
    sample = monitor.sample()
    sample["alerts"] = evaluate_alerts(sample)
    return sample


# GET historical metrics
@router.get("/metrics/history")
async def get_metrics_history(hours: int = Query(1, ge=1, le=24)):
    """
    Returns historical metrics for the last `hours` hours (1..24).
    Query param: ?hours=24
    """
    db: Session = SessionLocal()
    since = datetime.utcnow() - timedelta(hours=hours)
    records: List[Metric] = (
        db.query(Metric)
        .filter(Metric.timestamp >= since)
        .order_by(Metric.timestamp.asc())
        .all()
    )
    db.close()

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
            data["alerts"] = evaluate_alerts(data)
            await ws.send_json(data)
            await asyncio.sleep(1)  # send every 1 second
    except WebSocketDisconnect:
        # client disconnected cleanly
        pass
    except Exception:
        try:
            await ws.close()
        except Exception:
            pass


# Settings endpoints
@router.get("/settings")
async def read_settings():
    return get_settings()

@router.post("/settings")
async def post_settings(payload: Dict[str, Any]):
    # Validate incoming payload minimally
    allowed_keys = {"sample_interval", "enable_gpu", "log_to_db"}
    filtered = {k: v for k, v in payload.items() if k in allowed_keys}
    if not filtered:
        raise HTTPException(status_code=400, detail="No valid settings provided.")
    updated = update_settings(filtered)
    # If sample_interval changed, you may want to update monitor.sample_interval:
    si = updated.get("sample_interval")
    if si is not None:
        try:
            monitor.sample_interval = float(si)
        except Exception:
            pass
    return updated


# Health check
@router.get("/health")
async def health_check():
    return {"status": "ok"}