import { useEffect, useState } from "react";

export default function GpuCard({ wsData }) {
  const [gpu, setGpu] = useState({
    gpu_util: 0,
    gpu_memory_used: 0,
    gpu_memory_total: 0,
  });

  useEffect(() => {
    if (wsData && wsData.gpu) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGpu(wsData.gpu);
    }
  }, [wsData]);

  const memoryPercent = (
    (gpu.gpu_memory_used / gpu.gpu_memory_total) *
    100
  ).toFixed(1);

  return (
    <div className="bg-neutral-800 p-4 rounded shadow text-white">
      <h2 className="text-lg font-bold mb-2">GPU</h2>
      <p>GPU Usage: {gpu.gpu_util}%</p>
      <p>
        Memory Used: {gpu.gpu_memory_used} MB / {gpu.gpu_memory_total} MB (
        {memoryPercent}%)
      </p>
    </div>
  );
}
