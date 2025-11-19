const API_BASE = 'http://localhost:8000/api' // <-- use localhost instead of 127.0.0.1

export async function getMetrics() {
  const res = await fetch(`${API_BASE}/metrics`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return await res.json()
}

export function connectMetricsWebSocket(onMessage) {
  // convert HTTP base to WS base
  const wsUrl = API_BASE.replace(/^http/, 'ws') + '/ws/metrics' // ws://localhost:8000/api/ws/metrics
  const socket = new WebSocket(wsUrl)

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }

  socket.onopen = () => console.log('WebSocket connected')
  socket.onclose = () => console.log('WebSocket disconnected')
  socket.onerror = (err) => console.error('WebSocket error:', err)

  return socket
}
