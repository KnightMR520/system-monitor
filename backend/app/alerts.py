from typing import Any, Dict

# Simple alert rules — tweak thresholds here or move to DB later
ALERT_RULES = {
    "cpu_high": {"metric": "cpu_avg_percent", "threshold": 90, "severity": "critical"},
    "mem_warn": {"metric": "memory_percent", "threshold": 80, "severity": "warning"},
    # add more rules if needed, e.g. disk or GPU thresholds
}

def evaluate_alerts(sample: Dict[str, Any]) -> Dict[str, Any]:
    """Return a dict of active alerts for a metric sample."""
    alerts = {}
    if not sample:
        return alerts
    for key, rule in ALERT_RULES.items():
        m = rule["metric"]
        val = sample.get(m)
        if val is None:
            continue
        if val >= rule["threshold"]:
            alerts[key] = {
                "metric": m,
                "value": val,
                "threshold": rule["threshold"],
                "severity": rule.get("severity", "warning"),
            }
    return alerts
