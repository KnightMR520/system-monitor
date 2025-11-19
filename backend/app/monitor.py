import psutil
import time
from typing import Dict


class SystemMonitor:
    def __init__(self, sample_interval: float = 0.5):
        """
        sample_interval: how long psutil waits when measuring cpu_percent
        (lower = more responsive, but slightly more CPU)
        """
        self.sample_interval = sample_interval
        # store last counters for computing deltas if needed
        self._last_disk = psutil.disk_io_counters()
        self._last_net = psutil.net_io_counters()
        self._last_time = time.time()

    def sample(self) -> Dict:
        # CPU percent (since last call over the interval)
        cpu = psutil.cpu_percent(interval=self.sample_interval, percpu=True)
        cpu_avg = sum(cpu) / len(cpu) if cpu else 0.0

        vm = psutil.virtual_memory()
        disk = psutil.disk_io_counters()
        net = psutil.net_io_counters()

        now = time.time()
        elapsed = max(now - self._last_time, 1e-6)

        # compute per-second rates for disk & network since last sample
        read_rate = (disk.read_bytes - self._last_disk.read_bytes) / elapsed
        write_rate = (disk.write_bytes - self._last_disk.write_bytes) / elapsed
        net_recv_rate = (net.bytes_recv - self._last_net.bytes_recv) / elapsed
        net_sent_rate = (net.bytes_sent - self._last_net.bytes_sent) / elapsed

        # update last counters
        self._last_disk = disk
        self._last_net = net
        self._last_time = now

        return {
            "cpu_per_core": cpu,
            "cpu_avg_percent": cpu_avg,
            "memory_percent": vm.percent,
            "memory_total": vm.total,
            "disk_read_rate_bps": read_rate,
            "disk_write_rate_bps": write_rate,
            "net_recv_rate_bps": net_recv_rate,
            "net_sent_rate_bps": net_sent_rate,
            "timestamp": now,
        }
