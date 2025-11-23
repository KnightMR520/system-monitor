export default function DiskCard({ read, write }) {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl shadow text-white">
      <h2 className="text-lg font-semibold mb-2">Disk I/O</h2>
      <p>Read: {(read / 1024 / 1024).toFixed(2)} MB/s</p>
      <p>Write: {(write / 1024 / 1024).toFixed(2)} MB/s</p>
    </div>
  );
}
