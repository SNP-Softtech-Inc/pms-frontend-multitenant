// Helpers for transferring an auth session to a newly opened tab.
//
// Because the access token lives in sessionStorage (per-tab), a tab opened via
// "open in new tab" / window.open starts with no token. We mark such URLs with a
// `?handoff=<uuid>` query param; the new tab then asks already-authenticated tabs
// for the current token over a BroadcastChannel and adopts it.

export const HANDOFF_CHANNEL = "auth-handoff";
export const HANDOFF_PARAM = "handoff";
export const EXPIRES_KEY = "sessionExpiresAt";

// Map the login "Stay signed in for" select values to milliseconds.
const EXPIRY_MS = {
  "1min": 1 * 60 * 1000,
  "5min": 5 * 60 * 1000,
  "30min": 30 * 60 * 1000,
  "4hours": 4 * 60 * 60 * 1000,
  "8hours": 8 * 60 * 60 * 1000,
};

export const parseExpiryToMs = (expiryTime) => {
  return EXPIRY_MS[expiryTime] ?? EXPIRY_MS["30min"];
};

// Read the handoff id from the current URL, if present.
export const getHandoffIdFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(HANDOFF_PARAM);
  } catch {
    return null;
  }
};

// Remove the handoff param from the address bar without a navigation.
export const stripHandoffParam = () => {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(HANDOFF_PARAM)) return;
    url.searchParams.delete(HANDOFF_PARAM);
    const search = url.searchParams.toString();
    const newUrl = url.pathname + (search ? `?${search}` : "") + url.hash;
    window.history.replaceState({}, "", newUrl);
  } catch {
    // no-op
  }
};

// Ask other tabs for the current session token. Resolves with
// { token, expiresAt } from the first authenticated tab, or null on timeout.
export const requestHandoffToken = (handoffId, timeoutMs = 2000) => {
  return new Promise((resolve) => {
    if (typeof BroadcastChannel === "undefined") {
      resolve(null);
      return;
    }

    let settled = false;
    const channel = new BroadcastChannel(HANDOFF_CHANNEL);

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      channel.close();
      resolve(result);
    };

    channel.onmessage = (event) => {
      const data = event.data;
      if (
        data &&
        data.type === "response" &&
        data.handoffId === handoffId &&
        data.token
      ) {
        finish({ token: data.token, expiresAt: data.expiresAt });
      }
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    channel.postMessage({ type: "request", handoffId });
  });
};

// Keep an open channel that answers token requests from newly opened tabs and
// invokes onLogout when a sibling tab broadcasts a logout. `getSession` returns
// { token, expiresAt } for this tab (or a falsy token when not authenticated).
// Returns a cleanup function.
export const startHandoffResponder = (getSession, onLogout) => {
  if (typeof BroadcastChannel === "undefined") {
    return () => {};
  }

  const channel = new BroadcastChannel(HANDOFF_CHANNEL);

  channel.onmessage = (event) => {
    const data = event.data;
    if (!data) return;

    if (data.type === "request") {
      const session = getSession();
      if (session && session.token) {
        channel.postMessage({
          type: "response",
          handoffId: data.handoffId,
          token: session.token,
          expiresAt: session.expiresAt,
        });
      }
    } else if (data.type === "logout" && typeof onLogout === "function") {
      onLogout();
    }
  };

  return () => channel.close();
};

// Broadcast a logout so sibling tabs can drop their session too.
export const broadcastLogout = () => {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(HANDOFF_CHANNEL);
  channel.postMessage({ type: "logout" });
  channel.close();
};
