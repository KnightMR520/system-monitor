import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export default function LineChartCard({
  title,
  data,
  dataKey,
  maxValue, // max value of the metric to compute thresholds
  unit = "", // optional display unit, e.g., "MB/s"
}) {
  const chartData = data.map((d) => {
    let value = getNestedValue(d, dataKey);

    // Convert to MB/s if numeric and maxValue is provided (assume bytes/sec)
    if (maxValue) {
      value = value / 1024 / 1024;
    }

    return { ...d, value };
  });

  const latestValue = chartData[chartData.length - 1]?.value ?? 0;

  // Dynamic thresholds
  let lineColor = "#4ade80"; // green
  if (maxValue) {
    if (latestValue >= maxValue * 0.8)
      lineColor = "#f87171"; // red
    else if (latestValue >= maxValue * 0.5) lineColor = "#facc15"; // yellow
  } else {
    // percentage fallback
    if (latestValue >= 80) lineColor = "#f87171";
    else if (latestValue >= 50) lineColor = "#facc15";
  }

  return (
    <div className="bg-neutral-800 p-4 rounded shadow text-white">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#444" />
          <XAxis
            dataKey="timestamp"
            reversed={true}
            tick={{ fontSize: 12, fill: "#ccc" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#ccc" }}
            domain={maxValue ? ["auto", "auto"] : [0, 100]} // <- FIXED domain for percentages
          />
          <Tooltip
            formatter={(val) =>
              typeof val === "number" ? val.toFixed(2) + " " + unit : val
            }
            contentStyle={{ background: "#222", border: "1px solid #555" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
