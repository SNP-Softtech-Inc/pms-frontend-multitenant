// src/lib/sessionTime.js
//
// The sign-in's remaining time, as words (v1.84.0).
//
// A sign-in lasts as long as the "Stay signed in for" choice made at login
// (its refresh-token cookie). The cookie is httpOnly, so signup-login v1.35.0
// returns { startedAt, expiresAt, durationMs } on login, refresh and renew.
// AuthContext keeps it; My Account → Security and the expiry warning read it
// through these functions.

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/** The warning shows this long before the end ... */
export const WARN_BEFORE_MS = 10 * MINUTE;

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** { expiresAt, durationMs } in milliseconds, or null if unusable. */
export const parseSession = (raw) => {
  if (!raw) return null;
  const expiresAt = new Date(raw.expiresAt).getTime();
  const durationMs = Number(raw.durationMs);
  if (!Number.isFinite(expiresAt) || !Number.isFinite(durationMs) || durationMs <= 0) {
    return null;
  }
  return { expiresAt, durationMs };
};

/**
 * "8 hours", "7 hours 30 minutes", "1 minute", "45 seconds". Rounded up to
 * the unit shown, so a session that started a moment ago still reads its
 * full length.
 */
export const formatDuration = (ms) => {
  if (!(ms > 0)) return "0 minutes";

  const seconds = Math.ceil(ms / SECOND);
  if (seconds < 60) return plural(seconds, "second");

  const totalMinutes = Math.ceil(ms / MINUTE);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return plural(minutes, "minute");
  if (minutes === 0) return plural(hours, "hour");
  return `${plural(hours, "hour")} ${plural(minutes, "minute")}`;
};

export const remainingMs = (session, now = Date.now()) =>
  session ? Math.max(0, session.expiresAt - now) : 0;

/**
 * "7 hours 30 minutes remaining of 8 hours"; "Expired" once it has ended;
 * "" while the session is not known yet (rather than a false "Expired").
 */
export const sessionRemainingText = (session, now = Date.now()) => {
  if (!session) return "";
  const left = remainingMs(session, now);
  if (left <= 0) return "Expired";
  return `${formatDuration(left)} remaining of ${formatDuration(session.durationMs)}`;
};

/**
 * ... or halfway through, for a sign-in shorter than twice that (the
 * 1- and 5-minute choices), so it does not appear the moment one starts.
 */
export const warnAtMs = (session) =>
  session ? Math.min(WARN_BEFORE_MS, session.durationMs / 2) : 0;

export const shouldWarn = (session, now = Date.now()) => {
  if (!session) return false;
  const left = remainingMs(session, now);
  return left > 0 && left <= warnAtMs(session);
};
