# System Monitor

A real-time system monitoring application with a React frontend and a FastAPI backend.  
Tracks CPU, memory, disk, network, and optional GPU usage, exposing metrics via REST API and WebSockets.

## Features

- CPU usage (per-core & average)
- Memory usage
- Disk I/O (read/write rates)
- Network I/O
- GPU usage (via `nvidia-smi`, optional)
- REST API for snapshots (`GET /api/metrics`)
- WebSocket for continuous updates (`ws://localhost:8000/api/ws/metrics`)
- Health check endpoint (`GET /api/health`)
- React frontend dashboard
