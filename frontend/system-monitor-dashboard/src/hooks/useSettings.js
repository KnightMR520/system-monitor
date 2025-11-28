import { useEffect, useState } from "react";

export default function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSettings(json);
    } catch (err) {
      console.error("fetchSettings error", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateSettings(payload) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSettings(json);
      return json;
    } catch (err) {
      console.error("updateSettings error", err);
      throw err;
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refresh: fetchSettings, updateSettings };
}
