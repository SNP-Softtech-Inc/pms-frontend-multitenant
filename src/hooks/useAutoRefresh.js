// src/hooks/useAutoRefresh.js
//
// One line per screen:
//
//   useAutoRefresh(() => loadAccounts({ silent: true }));
//   useAutoRefresh(refetch, { enabled: !drawerOpen });   // pause while editing
//
// The rules (visible only, on return to the tab, no overlap, survives a
// failure) live in src/lib/autoRefresh.js.
//
// The callback is read through a ref, so a screen can pass an inline function
// without restarting the timer on every render - and the timer always calls
// the latest one, with current filters and page.
import { useEffect, useRef } from "react";
import { startAutoRefresh, DEFAULT_INTERVAL_MS } from "../lib/autoRefresh";

export const useAutoRefresh = (refresh, { enabled = true, intervalMs = DEFAULT_INTERVAL_MS } = {}) => {
  const latest = useRef(refresh);
  latest.current = refresh;

  useEffect(() => {
    if (!enabled) return undefined;
    return startAutoRefresh((reason) => latest.current?.(reason), { intervalMs });
  }, [enabled, intervalMs]);
};

export default useAutoRefresh;
