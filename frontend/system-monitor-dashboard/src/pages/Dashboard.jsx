import { useState } from "react";
import LineChartCard from "../components/LineChartCard";
import useRealtimeHistory from "../hooks/useRealtimeHistory";
import SettingsModal from "../components/SettingsModal";
import AlertsBanner from "../components/AlertsBanner";
import useSettings from "../hooks/useSettings";

export default function Dashboard() {
  // --- SETTINGS FROM BACKEND ---
  const { settings, loading, updateSettings } = useSettings();

  // Local UI modal toggle
  const [showSettings, setShowSettings] = useState(false);

  // Use sample_interval from backend settings, default to 0.5s
  const sampleIntervalMs = settings?.sample_interval
    ? settings.sample_interval * 1000
    : 500;
  const history = useRealtimeHistory(60, sampleIntervalMs);

  if (loading || !settings) {
    return <div className="text-white p-4">Loading settings...</div>;
  }

  if (history.length === 0) {
    return <div className="text-white p-4">Loading metrics...</div>;
  }

  return (
    <div className="p-4 w-full max-w-[1400px] mx-auto">
      {/* ----- HEADER ----- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">System Dashboard</h1>
        <button
          className="bg-neutral-700 px-3 py-1 rounded hover:bg-neutral-600"
          onClick={() => setShowSettings(true)}
        >
          ⚙ Settings
        </button>
      </div>

      {/* ----- SETTINGS MODAL ----- */}
      <SettingsModal
        open={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={async (updated) => {
          await updateSettings(updated); // Save to backend
          setShowSettings(false);
        }}
      />

      {/* ----- ALERTS ----- */}
      <AlertsBanner history={history} />

      {/* ----- CHART GRID ----- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="CPU %"
          data={history}
          dataKey="cpu_avg_percent"
          fixedMin={0}
          fixedMax={100}
          highlightThreshold={90} // turns red if any value >90%
        />

        <LineChartCard
          title="Memory %"
          data={history}
          dataKey="memory_percent"
          fixedMin={0}
          fixedMax={100}
          highlightThreshold={90}
        />

        <LineChartCard
          title="Disk Read MB/s"
          data={history}
          dataKey="disk_read_rate_bps"
          maxValue={308993.8729150295}
          unit="MB/s"
        />
        <LineChartCard
          title="Disk Write MB/s"
          data={history}
          dataKey="disk_write_rate_bps"
          maxValue={1379206.805500449}
          unit="MB/s"
        />
        <LineChartCard
          title="Network In MB/s"
          data={history}
          dataKey="net_recv_rate_bps"
          maxValue={519297.50843730476}
          unit="MB/s"
        />
        <LineChartCard
          title="Network Out MB/s"
          dataKey="net_sent_rate_bps"
          data={history}
          maxValue={91870.86650031243}
          unit="MB/s"
        />

        {settings.enable_gpu && (
          <LineChartCard
            title="GPU %"
            data={history}
            dataKey="gpu.gpu_util"
            fixedMin={0}
            fixedMax={100}
            highlightThreshold={90}
          />
        )}
      </div>
    </div>
  );
}
