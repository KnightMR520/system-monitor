export default function RamCard({ memory, total }) {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl shadow text-white">
      <h2 className="text-lg font-semibold mb-2">Memory</h2>
      <p className="text-3xl font-bold">{memory}%</p>
      <p className="text-sm text-gray-400">
        Total: {(total / 1_073_741_824).toFixed(1)} GB
      </p>
    </div>
  );
}
