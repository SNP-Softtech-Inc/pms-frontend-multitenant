// src/lib/recordLinks.js
//
// Helpers for links that open records in a new tab (v1.85.0).

/**
 * A left click with no modifier key - the one click the screen handles
 * itself. Ctrl/Cmd/Shift/Alt-click and the middle button are the browser's
 * ("open in new tab / window"), as is right-click, which never fires click.
 */
export const isPlainLeftClick = (e) =>
  Boolean(e) &&
  (e.button === 0 || e.button === undefined) &&
  !e.metaKey &&
  !e.ctrlKey &&
  !e.shiftKey &&
  !e.altKey;

/**
 * Every folder from just below the account down to `path`, so a folder
 * opened from a link can be shown expanded:
 * "acc/Firm docs/E-File" → ["acc/Firm docs", "acc/Firm docs/E-File"].
 */
export const ancestorPaths = (path) => {
  const parts = String(path || "").split("/").filter(Boolean);
  if (parts.length <= 1) return parts;
  return parts.slice(1).map((_, i) => parts.slice(0, i + 2).join("/"));
};

/** `pathname?key=value`, the value encoded. */
export const withQuery = (pathname, key, value) =>
  `${pathname}?${key}=${encodeURIComponent(value)}`;
