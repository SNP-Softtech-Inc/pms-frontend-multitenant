// src/lib/autoRefresh.js
//
// Keep a screen's server data current without the user pressing reload.
//
// Before this, each screen that refreshed itself had its own copy of a
// setInterval + visibilitychange block, and most screens had none - which is
// why auto refresh "worked on some screens and not others". Screens now call
// useAutoRefresh (src/hooks/useAutoRefresh.js), which wraps this.
//
// The rules, in one place:
//   - on a timer, but only while the tab is visible - a hidden tab costs the
//     servers nothing
//   - at once when the user comes back to the tab or window
//   - never two at once: a slow server does not stack requests
//   - a failed refresh is logged and the next one still runs
//   - stopping is total: no timer, no listeners, no late callback

export const DEFAULT_INTERVAL_MS = 30000;

/**
 * A state updater for quiet refreshes: setRows(keepIfSame(next)).
 *
 * Returns the CURRENT value when the new one is identical, so React skips the
 * re-render and nothing downstream resets - tables jump back to page 1 when
 * their data changes identity, and some screens scroll to the bottom when a
 * thread "changes". Compared as JSON: server data, small enough per screen.
 */
export const keepIfSame = (next) => (current) => {
  if (current === undefined) return next;
  try {
    return JSON.stringify(current) === JSON.stringify(next) ? current : next;
  } catch {
    return next;
  }
};

// Returning to a tab fires both visibilitychange and focus; within this gap
// they count as one refresh.
const DEFAULT_MIN_GAP_MS = 2000;

// Below this, every open tab of every user becomes real load on 15 backends.
const MIN_INTERVAL_MS = 5000;

/**
 * @param refresh  async (reason: "interval" | "visible") => void - should load
 *                 quietly, without a spinner or resetting what the user is
 *                 looking at
 * @returns stop()
 */
export const startAutoRefresh = (
  refresh,
  {
    intervalMs = DEFAULT_INTERVAL_MS,
    minGapMs = DEFAULT_MIN_GAP_MS,
    doc = document,
    win = window,
  } = {},
) => {
  if (!(intervalMs >= MIN_INTERVAL_MS)) {
    throw new Error(`auto refresh interval must be at least ${MIN_INTERVAL_MS} ms`);
  }

  let stopped = false;
  let running = false;
  let lastStarted = -Infinity;

  const run = async (reason) => {
    if (stopped || running || doc.visibilityState === "hidden") return;

    const now = Date.now();
    if (now - lastStarted < minGapMs) return;

    running = true;
    lastStarted = now;
    try {
      await refresh(reason);
    } catch (error) {
      // The screen keeps what it already shows; the next tick tries again.
      console.warn("Auto refresh failed:", error?.message || error);
    } finally {
      running = false;
    }
  };

  const timer = win.setInterval(() => run("interval"), intervalMs);

  const onReturn = () => {
    if (doc.visibilityState !== "hidden") run("visible");
  };

  doc.addEventListener("visibilitychange", onReturn);
  win.addEventListener("focus", onReturn);

  return () => {
    stopped = true;
    win.clearInterval(timer);
    doc.removeEventListener("visibilitychange", onReturn);
    win.removeEventListener("focus", onReturn);
  };
};
