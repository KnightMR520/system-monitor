from fastapi import FastAPI
from app.routes import router as metrics_router

app = FastAPI(title="System Monitor API")
app.include_router(metrics_router, prefix="/api")