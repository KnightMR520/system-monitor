export default function NetworkCard({ recv, sent }) {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl shadow text-white">
      <h2 className="text-lg font-semibold mb-2">Network</h2>
      <p>↓ {(recv / 1024).toFixed(2)} KB/s</p>
      <p>↑ {(sent / 1024).toFixed(2)} KB/s</p>
    </div>
  );
}
