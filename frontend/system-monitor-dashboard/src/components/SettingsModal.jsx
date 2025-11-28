import React, { useState, useEffect } from "react";
import useRealtimeHistory from "../hooks/useRealtimeHistory";

export default function SettingsModal({ open, onClose, settings, onSave }) {
  const history = useRealtimeHistory(1); // get latest metric
  const latest = history[history.length - 1];

  const [local, setLocal] = useState({
    sample_interval: 0.5,
    enable_gpu: true,
    log_to_db: true,
  });

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal({
        sample_interval: settings.sample_interval ?? 0.5,
        enable_gpu: settings.enable_gpu ?? true,
        log_to_db: settings.log_to_db ?? true,
      });
    }
  }, [settings]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/50">
      <div className="w-full max-w-md bg-neutral-900 text-white rounded shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">Settings</h2>

        <div className="text-xs text-neutral-400 mb-4">
          Latest Metric: {latest?.value ?? "—"}
        </div>

        <label className="block mb-2">
          <div className="text-sm">Sampling interval (seconds)</div>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={local.sample_interval}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                sample_interval: parseFloat(e.target.value),
              }))
            }
            className="mt-1 w-full bg-neutral-800 p-2 rounded"
          />
        </label>

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={local.enable_gpu}
            onChange={(e) =>
              setLocal((s) => ({ ...s, enable_gpu: e.target.checked }))
            }
          />
          <span className="text-sm">Enable GPU sampling</span>
        </label>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={local.log_to_db}
            onChange={(e) =>
              setLocal((s) => ({ ...s, log_to_db: e.target.checked }))
            }
          />
          <span className="text-sm">Log metrics to DB</span>
        </label>

        <div className="flex justify-end gap-2">
          <button
            className="bg-neutral-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 px-4 py-2 rounded"
            onClick={() => onSave(local)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
