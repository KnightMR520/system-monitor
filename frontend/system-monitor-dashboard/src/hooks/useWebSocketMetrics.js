import { useEffect, useState } from "react";

export default function useWebSocketMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/metrics");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };

    ws.onerror = console.error;

    return () => ws.close();
  }, []);

  return metrics;
}
