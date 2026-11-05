// Tests for the browser-side ZIP import (zipImport.js).
//
// No ZIP library and no server: entries are plain objects and the API is a
// fake that records calls. Plain functions rather than jest.fn, because
// Create React App's resetMocks strips jest.fn implementations between tests.
import { normalizeEntryPath, buildPlan, runImport } from "./zipImport";

const ACCOUNT = "6a8b21f10643df5942d0a018";

const entry = (path, size = 10, extra = {}) => ({
  path,
  size,
  directory: false,
  encrypted: false,
  read: async () => `blob:${path}`,
  ...extra,
});
const dir = (path) => ({ path, size: 0, directory: true, read: async () => null });

const httpError = (status, data = {}) => Object.assign(new Error(`HTTP ${status}`), { response: { status, data } });
const networkError = () => new Error("Network Error");

// A fake folder-management. `existing` maps path -> "exists" | "conflict" |
// "tooLarge" | "invalid"; `failures` maps path -> list of errors to throw on
// successive upload attempts before succeeding.
const fakeApi = ({ existing = {}, failures = {}, prepareErrors = [], finishErrors = [] } = {}) => {
  const calls = { prepare: [], upload: [], finish: [] };
  let inFlight = 0;
  let maxInFlight = 0;
  const attempts = {};

  return {
    calls,
    maxInFlight: () => maxInFlight,
    prepare: async (body) => {
      calls.prepare.push(body);
      if (prepareErrors.length) throw prepareErrors.shift();
      return {
        status: 200,
        data: {
          files: body.files.map((f) => ({ path: f.path, status: existing[f.path] || "new" })),
          folders: body.folders.map((p) => ({ path: p, status: "ready" })),
        },
      };
    },
    uploadFile: async (accountId, path, blob) => {
      calls.upload.push({ accountId, path, blob });
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((r) => setTimeout(r, 1));
      inFlight -= 1;
      attempts[path] = (attempts[path] || 0) + 1;
      const queued = failures[path] || [];
      if (queued.length >= attempts[path]) throw queued[attempts[path] - 1];
      return { status: 201, data: { status: "uploaded", path } };
    },
    finish: async (accountId) => {
      calls.finish.push(accountId);
      if (finishErrors.length) throw finishErrors.shift();
      return { status: 200, data: { success: true, tagRemoved: true } };
    },
  };
};

const noWait = async () => {};
const run = (entries, api, extra = {}) =>
  runImport({ entries, accountId: ACCOUNT, api, wait: noWait, ...extra });

describe("normalizeEntryPath", () => {
  it.each([
    ["2023/Taxes/W-2.pdf", "2023/Taxes/W-2.pdf"],
    ["2023\\Taxes\\W-2.pdf", "2023/Taxes/W-2.pdf"],
    ["./2023//W-2.pdf", "2023/W-2.pdf"],
    ["/2023/W-2.pdf", "2023/W-2.pdf"],
    ["2023/", "2023"],
  ])("%j becomes %j", (raw, expected) => {
    expect(normalizeEntryPath(raw)).toBe(expected);
  });

  it.each(["__MACOSX/2023/._W-2.pdf", "2023/.DS_Store", "Thumbs.db", "a/desktop.ini", "", "./"])(
    "drops %j, which is not the firm's file",
    (raw) => {
      expect(normalizeEntryPath(raw)).toBeNull();
    },
  );
});

describe("buildPlan", () => {
  it("separates files and folders, and reports duplicates and password-protected files", () => {
    const plan = buildPlan([
      dir("2023/"),
      entry("2023/a.pdf"),
      entry("2023\\a.pdf"),
      entry("2023/locked.pdf", 5, { encrypted: true }),
      entry("__MACOSX/2023/._a.pdf"),
    ]);

    expect(plan.folders).toEqual(["2023"]);
    expect(plan.files.map((f) => f.path)).toEqual(["2023/a.pdf"]);
    expect(plan.problems.map((p) => p.path)).toEqual(["2023/a.pdf", "2023/locked.pdf"]);
  });
});

describe("runImport", () => {
  it("uploads every new file and marks the account complete", async () => {
    const api = fakeApi();
    const result = await run([dir("2023/"), entry("2023/a.pdf"), entry("b.pdf")], api);

    expect(api.calls.prepare).toEqual([
      { accountId: ACCOUNT, files: [{ path: "2023/a.pdf", size: 10 }, { path: "b.pdf", size: 10 }], folders: ["2023"] },
    ]);
    expect(api.calls.upload.map((c) => [c.accountId, c.path, c.blob])).toEqual([
      [ACCOUNT, "2023/a.pdf", "blob:2023/a.pdf"],
      [ACCOUNT, "b.pdf", "blob:b.pdf"],
    ]);
    expect(api.calls.finish).toEqual([ACCOUNT]);
    expect(result).toMatchObject({ uploaded: 2, skipped: 0, problems: [], finished: true, stopped: null });
  });

  it("resumes: files already in the account are not sent again", async () => {
    const api = fakeApi({ existing: { "a.pdf": "exists" } });
    const result = await run([entry("a.pdf"), entry("b.pdf")], api);

    expect(api.calls.upload.map((c) => c.path)).toEqual(["b.pdf"]);
    expect(result).toMatchObject({ uploaded: 1, skipped: 1, finished: true });
  });

  it("never sends a file the server says would conflict, is too large or is invalid - and leaves the account incomplete", async () => {
    const api = fakeApi({ existing: { "c.pdf": "conflict", "big.pdf": "tooLarge", "bad.pdf": "invalid" } });
    const result = await run([entry("c.pdf"), entry("big.pdf"), entry("bad.pdf"), entry("ok.pdf")], api);

    expect(api.calls.upload.map((c) => c.path)).toEqual(["ok.pdf"]);
    expect(result.problems.map((p) => p.path)).toEqual(["c.pdf", "big.pdf", "bad.pdf"]);
    expect(result.problems[0].reason).toMatch(/not replaced/);
    expect(api.calls.finish).toEqual([]);
    expect(result.finished).toBe(false);
  });

  it("retries a file after a network error and carries on", async () => {
    const api = fakeApi({ failures: { "a.pdf": [networkError(), httpError(502)] } });
    const waits = [];
    const result = await run([entry("a.pdf")], api, { wait: async (ms) => waits.push(ms) });

    expect(api.calls.upload.filter((c) => c.path === "a.pdf")).toHaveLength(3);
    expect(waits).toEqual([1000, 3000]);
    expect(result).toMatchObject({ uploaded: 1, finished: true });
  });

  it("gives up on a file after its retries, reports it, and does not mark the account complete", async () => {
    const api = fakeApi({ failures: { "a.pdf": [networkError(), networkError(), networkError(), networkError()] } });
    const result = await run([entry("a.pdf"), entry("b.pdf")], api);

    expect(api.calls.upload.filter((c) => c.path === "a.pdf")).toHaveLength(4);
    expect(result.uploaded).toBe(1);
    expect(result.problems).toEqual([{ path: "a.pdf", reason: expect.stringMatching(/run the import again/) }]);
    expect(result.finished).toBe(false);
  });

  it.each([
    [409, /not replaced/],
    [413, /per-file limit/],
    [403, /read-only/],
  ])("reports an upload refused with %i without retrying it", async (status, reason) => {
    const api = fakeApi({ failures: { "a.pdf": [httpError(status)] } });
    const result = await run([entry("a.pdf")], api);

    expect(api.calls.upload).toHaveLength(1);
    expect(result.problems[0].reason).toMatch(reason);
  });

  it("stops everything when the server is nearly out of disk", async () => {
    const api = fakeApi({ failures: { "a.pdf": [httpError(507)] } });
    const files = ["a.pdf", "b.pdf", "c.pdf", "d.pdf", "e.pdf"].map((p) => entry(p));
    const result = await run(files, api, { concurrency: 1 });

    expect(api.calls.upload.map((c) => c.path)).toEqual(["a.pdf"]);
    expect(result.stopped).toMatch(/disk space/);
    expect(result.notSent).toBe(4);
    expect(api.calls.finish).toEqual([]);
  });

  it("stops and says so when the user was signed out", async () => {
    const api = fakeApi({ failures: { "a.pdf": [httpError(401)] } });
    const result = await run([entry("a.pdf"), entry("b.pdf")], api, { concurrency: 1 });

    expect(result.stopped).toMatch(/signed out/);
    expect(api.calls.upload).toHaveLength(1);
  });

  it("stops sending new files on Cancel", async () => {
    const api = fakeApi();
    let cancelled = false;
    const files = ["a.pdf", "b.pdf", "c.pdf"].map((p) => entry(p));
    const result = await run(files, api, {
      concurrency: 1,
      shouldStop: () => cancelled,
      onProgress: () => {
        cancelled = true;
      },
    });

    expect(api.calls.upload.map((c) => c.path)).toEqual(["a.pdf"]);
    expect(result.stopped).toMatch(/Cancelled/);
    expect(result.finished).toBe(false);
  });

  it("reports a file the ZIP cannot give up, without sending it", async () => {
    const api = fakeApi();
    const broken = entry("broken.pdf", 10, {
      read: async () => {
        throw new Error("invalid deflate data");
      },
    });
    const result = await run([broken, entry("ok.pdf")], api);

    expect(api.calls.upload.map((c) => c.path)).toEqual(["ok.pdf"]);
    expect(result.problems[0]).toEqual({ path: "broken.pdf", reason: expect.stringMatching(/damaged/) });
  });

  it("never has more uploads in flight than allowed", async () => {
    const api = fakeApi();
    const files = Array.from({ length: 20 }, (_, i) => entry(`f${i}.pdf`));
    await run(files, api, { concurrency: 3 });

    expect(api.calls.upload).toHaveLength(20);
    expect(api.maxInFlight()).toBe(3);
  });

  it("asks about a large ZIP in chunks, sending the folders once", async () => {
    const files = Array.from({ length: 12001 }, (_, i) => entry(`f${i}.pdf`, 1));
    // All already there, so the test is about the asking, not 12001 uploads.
    const api = fakeApi({ existing: Object.fromEntries(files.map((f) => [f.path, "exists"])) });
    const result = await run([dir("A/"), ...files], api);

    expect(api.calls.prepare.map((b) => b.files.length)).toEqual([5000, 5000, 2001]);
    expect(api.calls.prepare.map((b) => b.folders)).toEqual([["A"], [], []]);
    expect(result).toMatchObject({ skipped: 12001, finished: true });
  });

  it("reports progress up to every file and byte", async () => {
    const api = fakeApi({ existing: { "a.pdf": "exists" } });
    const seen = [];
    await run([entry("a.pdf", 100), entry("b.pdf", 50)], api, { onProgress: (p) => seen.push(p) });

    expect(seen[seen.length - 1]).toMatchObject({
      totalFiles: 2,
      done: 2,
      uploaded: 1,
      skipped: 1,
      bytesTotal: 150,
      bytesDone: 150,
    });
  });

  it("uploads nothing when the server cannot be reached to start", async () => {
    const api = fakeApi({ prepareErrors: [networkError(), networkError(), networkError(), networkError()] });
    const result = await run([entry("a.pdf")], api);

    expect(api.calls.upload).toEqual([]);
    expect(result.stopped).toMatch(/could not be reached/);
  });

  it("does not mark an empty ZIP complete", async () => {
    const api = fakeApi();
    const result = await run([entry("__MACOSX/x"), entry(".DS_Store")], api);

    expect(api.calls.prepare).toEqual([]);
    expect(api.calls.finish).toEqual([]);
    expect(result.stopped).toMatch(/no files/);
  });

  it("says so when every file arrived but the account could not be marked complete", async () => {
    const api = fakeApi({ finishErrors: [httpError(400)] });
    const result = await run([entry("a.pdf")], api);

    expect(result.finished).toBe(false);
    expect(result.problems[0].reason).toMatch(/could not be marked complete/);
  });
});
