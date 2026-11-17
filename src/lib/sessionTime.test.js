// "Stay signed in for" and the expiry warning (v1.84.0). The field showed
// "Expired" right after an 8-hour sign-in: nothing told the screen when the
// session ends. signup-login v1.35.0 returns { startedAt, expiresAt,
// durationMs } on login, refresh and renew; these turn it into text.
import {
  parseSession,
  formatDuration,
  remainingMs,
  sessionRemainingText,
  warnAtMs,
  shouldWarn,
} from "./sessionTime";

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;
const T0 = Date.UTC(2026, 10, 17, 9, 0, 0);

const eightHours = {
  startedAt: new Date(T0).toISOString(),
  expiresAt: new Date(T0 + 8 * HOUR).toISOString(),
  durationMs: 8 * HOUR,
};

describe("parseSession", () => {
  it("reads the server's session into numbers", () => {
    expect(parseSession(eightHours)).toEqual({ expiresAt: T0 + 8 * HOUR, durationMs: 8 * HOUR });
  });

  it("is nothing for anything unusable", () => {
    expect(parseSession(null)).toBeNull();
    expect(parseSession({})).toBeNull();
    expect(parseSession({ expiresAt: "not a date", durationMs: 1 })).toBeNull();
    expect(parseSession({ expiresAt: eightHours.expiresAt, durationMs: 0 })).toBeNull();
  });
});

describe("formatDuration", () => {
  it("says hours and minutes in words", () => {
    expect(formatDuration(8 * HOUR)).toBe("8 hours");
    expect(formatDuration(7 * HOUR + 30 * MIN)).toBe("7 hours 30 minutes");
    expect(formatDuration(HOUR + MIN)).toBe("1 hour 1 minute");
    expect(formatDuration(30 * MIN)).toBe("30 minutes");
    expect(formatDuration(MIN)).toBe("1 minute");
  });

  it("goes to seconds under a minute", () => {
    expect(formatDuration(45 * 1000)).toBe("45 seconds");
    expect(formatDuration(1000)).toBe("1 second");
  });

  it("rounds up, so a just-started 8-hour session reads 8 hours, not 7 hours 59 minutes", () => {
    expect(formatDuration(8 * HOUR - 1)).toBe("8 hours");
    expect(formatDuration(7 * HOUR + 29 * MIN + 59 * 1000)).toBe("7 hours 30 minutes");
    expect(formatDuration(59 * 1000 + 1)).toBe("1 minute");
  });

  it("is zero for nothing left", () => {
    expect(formatDuration(0)).toBe("0 minutes");
    expect(formatDuration(-5)).toBe("0 minutes");
  });
});

describe("sessionRemainingText", () => {
  const s = parseSession(eightHours);

  it("shows the full length at the start", () => {
    expect(sessionRemainingText(s, T0)).toBe("8 hours remaining of 8 hours");
  });

  it("counts down: 30 minutes in, 7 hours 30 minutes are left", () => {
    expect(sessionRemainingText(s, T0 + 30 * MIN)).toBe("7 hours 30 minutes remaining of 8 hours");
  });

  it("says Expired once the end has passed", () => {
    expect(sessionRemainingText(s, T0 + 8 * HOUR)).toBe("Expired");
    expect(sessionRemainingText(s, T0 + 9 * HOUR)).toBe("Expired");
  });

  it("is empty, not Expired, while the session is not known yet", () => {
    expect(sessionRemainingText(null, T0)).toBe("");
  });

  it("measures what is left", () => {
    expect(remainingMs(s, T0 + HOUR)).toBe(7 * HOUR);
    expect(remainingMs(null, T0)).toBe(0);
  });
});

describe("the expiry warning", () => {
  const s = parseSession(eightHours);

  it("starts 10 minutes before the end", () => {
    expect(warnAtMs(s)).toBe(10 * MIN);
    expect(shouldWarn(s, T0 + 8 * HOUR - 11 * MIN)).toBe(false);
    expect(shouldWarn(s, T0 + 8 * HOUR - 10 * MIN)).toBe(true);
    expect(shouldWarn(s, T0 + 8 * HOUR - MIN)).toBe(true);
  });

  it("stops once the session has ended - that is the expiry, not a warning", () => {
    expect(shouldWarn(s, T0 + 8 * HOUR)).toBe(false);
  });

  it("starts halfway through a session shorter than 20 minutes, not the moment it begins", () => {
    const five = parseSession({ expiresAt: new Date(T0 + 5 * MIN).toISOString(), durationMs: 5 * MIN });
    expect(warnAtMs(five)).toBe(2.5 * MIN);
    expect(shouldWarn(five, T0)).toBe(false);
    expect(shouldWarn(five, T0 + 3 * MIN)).toBe(true);
  });

  it("never warns without a session", () => {
    expect(shouldWarn(null, T0)).toBe(false);
  });
});
