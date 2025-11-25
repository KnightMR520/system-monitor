import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
          <CartesianGrid stroke="#444" />

          {/* Right-to-left scrolling */}
          <XAxis
            dataKey="timestamp"
            reversed={true}
            tick={{ fontSize: 12, fill: "#ccc" }}
          />

          {/* Fixed Y-axis 0–100% */}
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#ccc" }} />

          <Tooltip
            formatter={(val) =>
              typeof val === "number" ? val.toFixed(2) : val
            }
            contentStyle={{ background: "#222", border: "1px solid #555" }}
            labelStyle={{ color: "#fff" }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} // Prevent jitter
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
