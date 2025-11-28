export default function AlertsBanner({ history }) {
  if (!history || history.length === 0) return null;

  const latest = history[history.length - 1];

  const alerts = [];

  // CPU alert
  if (latest.cpu_avg_percent >= 90) {
    alerts.push({
      type: "danger",
      msg: `CPU usage critically high: ${latest.cpu_avg_percent.toFixed(1)}%`,
    });
  } else if (latest.cpu_avg_percent >= 80) {
    alerts.push({
      type: "warning",
      msg: `CPU usage elevated: ${latest.cpu_avg_percent.toFixed(1)}%`,
    });
  }

  // Memory alert
  if (latest.memory_percent >= 90) {
    alerts.push({
      type: "danger",
      msg: `Memory usage critically high: ${latest.memory_percent.toFixed(1)}%`,
    });
  } else if (latest.memory_percent >= 80) {
    alerts.push({
      type: "warning",
      msg: `Memory usage elevated: ${latest.memory_percent.toFixed(1)}%`,
    });
  }

  // GPU alert
  if (latest.gpu?.gpu_util !== undefined) {
    if (latest.gpu.gpu_util >= 90) {
      alerts.push({
        type: "danger",
        msg: `GPU usage critically high: ${latest.gpu.gpu_util.toFixed(1)}%`,
      });
    } else if (latest.gpu.gpu_util >= 80) {
      alerts.push({
        type: "warning",
        msg: `GPU usage elevated: ${latest.gpu.gpu_util.toFixed(1)}%`,
      });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className={`p-3 rounded text-white ${
            alert.type === "danger"
              ? "bg-red-700" // stronger red
              : alert.type === "warning"
                ? "bg-yellow-600"
                : "bg-neutral-700"
          }`}
        >
          {alert.msg}
        </div>
      ))}
    </div>
  );
}
