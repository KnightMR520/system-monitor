import React, { useEffect, useState } from 'react'
import { getMetrics, connectMetricsWebSocket } from '../api/client'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    // Fetch initial snapshot
    getMetrics().then(setMetrics).catch(console.error)

    // Open WebSocket
    const ws = connectMetricsWebSocket((data) => setMetrics(data))

    return () => ws.close()
  }, [])

  if (!metrics) {
    return <div style={{ padding: 20 }}>Loading metrics...</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>System Metrics</h1>
      <pre
        style={{
          fontSize: 14,
          background: '#222',
          color: '#0f0',
          padding: 10,
        }}
      >
        {JSON.stringify(metrics, null, 2)}
      </pre>
    </div>
  )
}
