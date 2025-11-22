import subprocess
import time
from typing import Dict

import psutil


def get_gpu_util():
    try:
        out = subprocess.check_output(
            "nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total "
            "--format=csv,noheader,nounits",
            shell=True
        ).decode().strip()

        util, mem_used, mem_total = map(int, out.split(", "))
        return {
            "gpu_util": util,
            "gpu_memory_used": mem_used,
            "gpu_memory_total": mem_total
        }
    except:  # noqa: E722
        return None


class SystemMonitor:
    def __init__(self, sample_interval: float = 0.5):
        self.sample_interval = sample_interval

        # Baseline counters for per-second I/O deltas
        self._last_disk = psutil.disk_io_counters()
        self._last_net = psutil.net_io_counters()
        self._last_time = time.time()

    def sample(self) -> Dict:
        # CPU (block for interval)
        cpu = psutil.cpu_percent()
        cpu_per_core = psutil.cpu_percent(interval=self.sample_interval, percpu=True)
        cpu_avg = sum(cpu_per_core) / len(cpu_per_core)

        # GPU (optional)
        gpu = get_gpu_util()

        # Memory
        vm = psutil.virtual_memory()

        # Disk & network raw totals
        disk = psutil.disk_io_counters()
        net = psutil.net_io_counters()

        # Time since last update
        now = time.time()
        elapsed = max(now - self._last_time, 1e-6)

        # Rates (bytes/sec)
        read_rate = (disk.read_bytes - self._last_disk.read_bytes) / elapsed
        write_rate = (disk.write_bytes - self._last_disk.write_bytes) / elapsed
        net_recv_rate = (net.bytes_recv - self._last_net.bytes_recv) / elapsed
        net_sent_rate = (net.bytes_sent - self._last_net.bytes_sent) / elapsed

        # Update last counters
        self._last_disk = disk
        self._last_net = net
        self._last_time = now

        return {
            "cpu": cpu,
            "cpu_per_core": cpu_per_core,
            "cpu_avg_percent": cpu_avg,
            "memory_percent": vm.percent,
            "memory_total": vm.total,
            "disk_read_rate_bps": read_rate,
            "disk_write_rate_bps": write_rate,
            "net_recv_rate_bps": net_recv_rate,
            "net_sent_rate_bps": net_sent_rate,
            "gpu": gpu,
            "net_interfaces": {
                name: iface._asdict()
                for name, iface in psutil.net_io_counters(pernic=True).items()
            },
            "timestamp": now,
        }
