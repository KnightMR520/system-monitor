# System Monitor

Real-time system metrics dashboard: FastAPI backend, Postgres, React + Vite frontend.

## Features

- Live streaming via WebSocket
- Historical logging to Postgres
- Alerts (CPU/RAM thresholds)
- Docker Compose for local production

## Quickstart (local)

1. Copy example env files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/system-monitor-dashboard/.env.example frontend/system-monitor-dashboard/.env
   ```
