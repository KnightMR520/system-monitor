import LineChartCard from "../components/LineChartCard";
import useRealtimeHistory from "../hooks/useRealtimeHistory";

export default function Dashboard() {
  const history = useRealtimeHistory(60); // 60 latest samples

  if (history.length === 0) return <div>Loading...</div>;

  return (
    <div className="p-4 w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="CPU %"
          data={history}
          dataKey="cpu_avg_percent"
          xKey="timestamp"
        />
        <LineChartCard
          title="Memory %"
          data={history}
          dataKey="memory_percent"
          xKey="timestamp"
        />
        <LineChartCard
          title="Disk Read"
          data={history}
          dataKey="disk_read_rate_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="Disk Write"
          data={history}
          dataKey="disk_write_rate_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="Network In"
          data={history}
          dataKey="net_recv_rate_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="Network Out"
          data={history}
          dataKey="net_sent_rate_bps"
          xKey="timestamp"
        />
        <LineChartCard
          title="GPU %"
          data={history}
          dataKey="gpu.gpu_util"
          xKey="timestamp"
        />
      </div>
    </div>
  );
}
