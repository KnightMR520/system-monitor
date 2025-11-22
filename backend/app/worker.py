import asyncio

from app.db import SessionLocal
from app.models import Metric
from app.monitor import SystemMonitor

monitor = SystemMonitor(sample_interval=0.5)

async def log_metrics_loop():
    while True:
        data = monitor.sample()
        db = SessionLocal()
        metric = Metric(
            cpu_avg=data["cpu_avg_percent"],
            cpu_per_core=data["cpu_per_core"],
            memory_percent=data["memory_percent"],
            disk_read_bps=data["disk_read_rate_bps"],
            disk_write_bps=data["disk_write_rate_bps"],
            net_recv_bps=data["net_recv_rate_bps"],
            net_sent_bps=data["net_sent_rate_bps"],
            gpu=data["gpu"]
        )
        db.add(metric)
        db.commit()
        db.close()
        await asyncio.sleep(5)  # log every 5 seconds

# To run in the main app, you can do:
# import asyncio
# asyncio.create_task(log_metrics_loop())
