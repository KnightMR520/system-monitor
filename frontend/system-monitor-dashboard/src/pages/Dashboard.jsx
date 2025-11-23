import LineChartCard from "../components/LineChartCard";
import useWebSocketMetrics from "../hooks/useWebSocketMetrics";

export default function Dashboard() {
  const metrics = useWebSocketMetrics();

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="p-4 w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="CPU %"
          data={[metrics]}
          dataKey="cpu_avg_percent"
        />
        <LineChartCard
          title="Memory %"
          data={[metrics]}
          dataKey="memory_percent"
        />
        <LineChartCard
          title="Disk Read"
          data={[metrics]}
          dataKey="disk_read_rate_bps"
        />
        <LineChartCard
          title="Disk Write"
          data={[metrics]}
          dataKey="disk_write_rate_bps"
        />
        <LineChartCard
          title="Network In"
          data={[metrics]}
          dataKey="net_recv_rate_bps"
        />
        <LineChartCard
          title="Network Out"
          data={[metrics]}
          dataKey="net_sent_rate_bps"
        />
        <LineChartCard title="GPU %" data={[metrics]} dataKey="gpu.gpu_util" />
      </div>
    </div>
  );
}
