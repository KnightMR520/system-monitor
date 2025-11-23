export default function CpuCard({ cpu, cpuAvg }) {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl shadow text-white">
      <h2 className="text-lg font-semibold mb-2">CPU Usage</h2>
      <p className="text-3xl font-bold">{cpu}%</p>
      <p className="text-sm text-gray-400">Average: {cpuAvg.toFixed(1)}%</p>
    </div>
  );
}
