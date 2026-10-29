// The auto-refresh core every screen uses: refresh while visible, on a timer
// and on return to the tab; never two at once; a failure never stops it.
//
// Tested as a plain function with a fake document and window, because render
// tests are blocked in this repo (see decisions.md, 2026-10-24).
import { startAutoRefresh } from "./autoRefresh";

// A minimal document/window pair: visibility is settable, events dispatch.
const fakeEnv = () => {
  const doc = new EventTarget();
  doc.visibilityState = "visible";
  const win = new EventTarget();
  win.setInterval = (fn, ms) => setInterval(fn, ms);
  win.clearInterval = (id) => clearInterval(id);
  return {
    doc,
    win,
    hide: () => {
      doc.visibilityState = "hidden";
      doc.dispatchEvent(new Event("visibilitychange"));
    },
    show: () => {
      doc.visibilityState = "visible";
      doc.dispatchEvent(new Event("visibilitychange"));
    },
    focus: () => win.dispatchEvent(new Event("focus")),
  };
};

// Lets pending promise callbacks run under fake timers.
const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve();
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

// CRA's resetMocks strips jest.fn implementations before each test, so the
// refresh is a plain function that counts its own calls.
const counter = (impl = async () => {}) => {
  const fn = async (...args) => {
    fn.calls.push(args);
    return impl(...args);
  };
  fn.calls = [];
  return fn;
};

describe("startAutoRefresh", () => {
  it("refreshes on the interval while the tab is visible", async () => {
    const env = fakeEnv();
    const refresh = counter();
    startAutoRefresh(refresh, { intervalMs: 30000, doc: env.doc, win: env.win });

    expect(refresh.calls).toHaveLength(0); // the screen already loaded once itself
    jest.advanceTimersByTime(30000);
    await flush();
    jest.advanceTimersByTime(30000);
    await flush();

    expect(refresh.calls).toHaveLength(2);
    expect(refresh.calls[0]).toEqual(["interval"]);
  });

  it("does nothing while the tab is hidden", async () => {
    const env = fakeEnv();
    const refresh = counter();
    startAutoRefresh(refresh, { intervalMs: 30000, doc: env.doc, win: env.win });

    env.hide();
    jest.advanceTimersByTime(120000);
    await flush();

    expect(refresh.calls).toHaveLength(0);
  });

  it("refreshes at once when the user comes back to the tab", async () => {
    const env = fakeEnv();
    const refresh = counter();
    startAutoRefresh(refresh, { intervalMs: 30000, doc: env.doc, win: env.win });

    env.hide();
    jest.advanceTimersByTime(60000);
    env.show();
    await flush();

    expect(refresh.calls).toEqual([["visible"]]);
  });

  it("refreshes when the window regains focus", async () => {
    const env = fakeEnv();
    const refresh = counter();
    startAutoRefresh(refresh, { intervalMs: 30000, minGapMs: 0, doc: env.doc, win: env.win });

    env.focus();
    await flush();

    expect(refresh.calls).toEqual([["visible"]]);
  });

  it("counts returning to the tab and focus, which fire together, as one refresh", async () => {
    const env = fakeEnv();
    const refresh = counter();
    startAutoRefresh(refresh, { intervalMs: 30000, doc: env.doc, win: env.win });

    env.hide();
    env.show();
    env.focus();
    await flush();

    expect(refresh.calls).toHaveLength(1);
  });

  it("never runs two refreshes at once - a slow server does not stack requests", async () => {
    const env = fakeEnv();
    let release;
    const refresh = counter(() => new Promise((r) => { release = r; }));
    startAutoRefresh(refresh, { intervalMs: 5000, minGapMs: 0, doc: env.doc, win: env.win });

    jest.advanceTimersByTime(5000);
    await flush();
    jest.advanceTimersByTime(20000);
    await flush();
    expect(refresh.calls).toHaveLength(1);

    release();
    await flush();
    jest.advanceTimersByTime(5000);
    await flush();
    expect(refresh.calls).toHaveLength(2);
  });

  it("keeps going after a refresh fails", async () => {
    const env = fakeEnv();
    let n = 0;
    const refresh = counter(async () => {
      n += 1;
      if (n === 1) throw new Error("network down");
    });
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    startAutoRefresh(refresh, { intervalMs: 5000, minGapMs: 0, doc: env.doc, win: env.win });

    jest.advanceTimersByTime(5000);
    await flush();
    jest.advanceTimersByTime(5000);
    await flush();

    expect(refresh.calls).toHaveLength(2);
    warn.mockRestore();
  });

  it("stops completely when stopped - no timer, no listeners", async () => {
    const env = fakeEnv();
    const refresh = counter();
    const stop = startAutoRefresh(refresh, { intervalMs: 5000, minGapMs: 0, doc: env.doc, win: env.win });

    stop();
    jest.advanceTimersByTime(50000);
    env.hide();
    env.show();
    env.focus();
    await flush();

    expect(refresh.calls).toHaveLength(0);
  });

  it("does not call back after being stopped mid-refresh", async () => {
    // A screen that unmounts while its refresh is in flight must not be
    // refreshed again by a timer that should be gone.
    const env = fakeEnv();
    let release;
    const refresh = counter(() => new Promise((r) => { release = r; }));
    const stop = startAutoRefresh(refresh, { intervalMs: 5000, minGapMs: 0, doc: env.doc, win: env.win });

    jest.advanceTimersByTime(5000);
    await flush();
    stop();
    release();
    await flush();
    jest.advanceTimersByTime(25000);
    await flush();

    expect(refresh.calls).toHaveLength(1);
  });

  it("refuses an interval under 5 seconds - it would hammer the servers", () => {
    const env = fakeEnv();
    expect(() => startAutoRefresh(async () => {}, { intervalMs: 1000, doc: env.doc, win: env.win })).toThrow(/interval/i);
  });
});

describe("keepIfSame", () => {
  // A table resets to page 1 whenever its data changes identity, so a quiet
  // refresh must hand back the very same object when nothing changed.
  const { keepIfSame } = require("./autoRefresh");

  it("keeps the current object when the new data is identical", () => {
    const current = [{ id: 1, name: "A" }];
    const next = [{ id: 1, name: "A" }];
    expect(keepIfSame(next)(current)).toBe(current);
  });

  it("takes the new data when anything changed", () => {
    const current = [{ id: 1, name: "A" }];
    const next = [{ id: 1, name: "B" }];
    expect(keepIfSame(next)(current)).toBe(next);
  });

  it("takes the new data when there was none before", () => {
    const next = [];
    expect(keepIfSame(next)(undefined)).toBe(next);
  });

  it("takes the new data when it cannot be compared", () => {
    const circular = {};
    circular.self = circular;
    expect(keepIfSame(circular)({})).toBe(circular);
  });
});
