from typing import Any, Dict

# default settings (changeable via API)
_SETTINGS: Dict[str, Any] = {
    "sample_interval": 0.5,  # seconds used by SystemMonitor when measuring percpu
    "enable_gpu": True,
    "log_to_db": True,
    # add other toggles here
}

def get_settings() -> Dict[str, Any]:
    return dict(_SETTINGS)

def update_settings(updates: Dict[str, Any]) -> Dict[str, Any]:
    for k, v in updates.items():
        if k in _SETTINGS:
            _SETTINGS[k] = v
    return get_settings()
