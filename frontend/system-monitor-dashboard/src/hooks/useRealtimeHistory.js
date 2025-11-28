import { useEffect, useState } from "react";

export default function useRealtimeHistory(maxPoints = 60) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const VITE_API_URL =
      import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const ws = new WebSocket(`${VITE_API_URL}/ws/metrics`);

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
