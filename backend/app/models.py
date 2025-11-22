from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Float, Integer

from app.db import Base


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    cpu_avg = Column(Float)
    cpu_per_core = Column(JSON)
    memory_percent = Column(Float)
    disk_read_bps = Column(Float)
    disk_write_bps = Column(Float)
    net_recv_bps = Column(Float)
    net_sent_bps = Column(Float)
    gpu = Column(JSON, nullable=True)
