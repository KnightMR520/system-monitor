import { useEffect, useState } from "react";
import LineChartCard from "../components/LineChartCard";

export default function History() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("24h");

  const getHours = (range) => {
    if (range === "1h") return 1;
    if (range === "24h") return 24;
    if (range === "7d") return 168;
    return 24;
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/metrics/history?hours=${getHours(range)}`)
      .then((res) => res.json())
      .then((rawData) => {
        const flatData = rawData.map((item) => {
          const estTime = new Date(item.timestamp).toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            timestamp: estTime,
            cpu_avg: item.cpu_avg,
            memory_percent: item.memory_percent,
            disk_read_bps: item.disk_read_bps,
            disk_write_bps: item.disk_write_bps,
            net_recv_bps: item.net_recv_bps,
            net_sent_bps: item.net_sent_bps,
            gpu_util: item.gpu?.gpu_util || 0,
          };
        });

        setData(flatData);
      })
      .catch(console.error);
  }, [range]);

  return (
    <div className="p-4 text-white w-full max-w-[1400px] mx-auto">
      <div className="mb-4">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-neutral-800 p-2 rounded"
        >
          <option value="1h">Last 1h</option>
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="CPU %"
          data={data}
          dataKey="cpu_avg"
          xKey="timestamp"
        />
        <LineChartCard
          title="Memory %"
          data={data}
          dataKey="memory_percent"
          xKey="timestamp"
        />
        <LineChartCard
          title="Disk Read"
          data={data}
          dataKey="disk_read_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="Disk Write"
          data={data}
          dataKey="disk_write_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="Network In"
          data={data}
          dataKey="net_recv_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="Network Out"
          data={data}
          dataKey="net_sent_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="GPU %"
          data={data}
          dataKey="gpu_util"
          xKey="timestamp"
        />
      </div>
    </div>
  );
}
