import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Helper to get nested values from an object using a key string like "gpu.gpu_util"
 */
function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export default function LineChartCard({ title, data, dataKey }) {
  // Preprocess data to flatten nested keys
  const chartData = data.map((d) => ({
    ...d,
    value: getNestedValue(d, dataKey),
  }));

  return (
    <div className="bg-neutral-800 p-4 rounded shadow text-white">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(val) =>
              typeof val === "number" ? val.toFixed(2) : val
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
