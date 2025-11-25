import { useEffect, useState } from "react";

export default function useRealtimeHistory(maxPoints = 60) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/metrics");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setHistory((prev) => {
        const next = [
          ...prev,
          {
            ...data,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          },
        ];

        if (next.length > maxPoints) next.shift(); // remove oldest point
        return next;
      });
    };

    return () => ws.close();
  }, [maxPoints]);

  return history;
}
