// Import a ZIP into an account's documents, one file per request.
//
// The ZIP is read here in the browser (readZip.js) and never sent whole.
// Until v1.67.0 it went to folder-management in one request, which nginx
// caps at 200 MB and the service held entirely in memory. Now:
//   - the ZIP can be any size; only a single file inside it is limited;
//   - a file that fails on a network blip is retried on its own;
//   - running the import again skips what already arrived, so an
//     interrupted import resumes instead of starting over.
//
// Pure logic, no React and no zip library: entries and the API are passed
// in, so this file is tested with plain objects (zipImport.test.js).

// Files the operating system leaves in folders and ZIPs. Not documents.
const SYSTEM_FILES = new Set([".ds_store", "thumbs.db", "desktop.ini"]);

/**
 * A ZIP entry's name as a path inside the account, or null for entries that
 * are not the firm's files (macOS's __MACOSX copies, OS clutter).
 */
export const normalizeEntryPath = (raw) => {
  const parts = String(raw || "")
    .replace(/\\/g, "/")
    .split("/")
    .filter((p) => p && p !== ".");

  if (parts.length === 0) return null;
  if (parts[0] === "__MACOSX") return null;
  if (SYSTEM_FILES.has(parts[parts.length - 1].toLowerCase())) return null;

  return parts.join("/");
};

/**
 * What to send: one entry per file (duplicates in the ZIP reported, not
 * sent twice) and the ZIP's folders, so empty ones are created too.
 *
 * entries: [{ path, size, directory, encrypted, read }]
 */
export const buildPlan = (entries) => {
  const files = [];
  const folders = [];
  const problems = [];
  const seen = new Set();

  for (const entry of entries) {
    const path = normalizeEntryPath(entry.path);
    if (!path) continue;

    if (entry.directory) {
      folders.push(path);
      continue;
    }
    if (seen.has(path)) {
      problems.push({ path, reason: "appears twice in the ZIP - only the first was imported" });
      continue;
    }
    seen.add(path);

    if (entry.encrypted) {
      problems.push({ path, reason: "is password-protected in the ZIP" });
      continue;
    }
    files.push({ path, size: entry.size, read: entry.read });
  }

  return { files, folders, problems };
};

const PREPARE_REASONS = {
  conflict: "a different file with this name is already in the account - not replaced",
  tooLarge: "is larger than the per-file limit",
  invalid: "has a name or path that cannot be used",
};

const UPLOAD_REASONS = {
  409: PREPARE_REASONS.conflict,
  413: PREPARE_REASONS.tooLarge,
  403: "is in a read-only folder",
  400: PREPARE_REASONS.invalid,
};

// Statuses worth another try: the request may never have reached the
// server, or the server was briefly unable to answer.
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

const statusOf = (err) => err?.response?.status;

const isRetryable = (err) => !err?.response || RETRYABLE.has(statusOf(err));

// Stops the whole import rather than one file.
const stopReasonFor = (err) => {
  if (statusOf(err) === 507) return "The server is nearly out of disk space. Uploads were paused - contact support.";
  if (statusOf(err) === 401) return "You were signed out. Sign in again and run the import again - it will carry on where it stopped.";
  return null;
};

const PREPARE_CHUNK = 5000;

export const DEFAULT_BACKOFF_MS = [1000, 3000, 9000];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Run an import.
 *
 * api: { prepare(body), uploadFile(accountId, path, blob), finish(accountId) }
 *      - axios-style: resolves to { status, data }, rejects with err.response
 * onProgress: called with the running totals after every file
 * shouldStop: () => true to stop sending new files (Cancel)
 *
 * Resolves to { uploaded, skipped, problems, finished, stopped, totalFiles }.
 * `finished` is true only when every file is in the account and the
 * account's "Incomplete Data" tag was removed.
 */
export const runImport = async ({
  entries,
  accountId,
  api,
  concurrency = 4,
  backoffMs = DEFAULT_BACKOFF_MS,
  wait = sleep,
  onProgress = () => {},
  shouldStop = () => false,
}) => {
  const plan = buildPlan(entries);
  const problems = [...plan.problems];
  const totals = {
    totalFiles: plan.files.length,
    done: 0,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    bytesTotal: plan.files.reduce((sum, f) => sum + (f.size || 0), 0),
    bytesDone: 0,
  };
  let stopped = null;

  if (plan.files.length === 0 && plan.folders.length === 0) {
    return {
      uploaded: 0,
      skipped: 0,
      problems,
      finished: false,
      stopped: "The ZIP has no files to import.",
      totalFiles: 0,
      notSent: 0,
    };
  }

  const report = () => onProgress({ ...totals, problems: problems.length });

  const withRetry = async (send) => {
    for (let attempt = 0; ; attempt++) {
      try {
        return await send();
      } catch (err) {
        if (stopReasonFor(err) || !isRetryable(err) || attempt >= backoffMs.length) throw err;
        await wait(backoffMs[attempt]);
      }
    }
  };

  const fail = (file, reason) => {
    totals.failed += 1;
    problems.push({ path: file.path, reason });
  };

  const settle = (file) => {
    totals.done += 1;
    totals.bytesDone += file.size || 0;
    report();
  };

  // ---- ask the server what is already there, in chunks
  const statusByPath = new Map();
  try {
    for (let i = 0; i < Math.max(plan.files.length, 1); i += PREPARE_CHUNK) {
      const chunk = plan.files.slice(i, i + PREPARE_CHUNK).map(({ path, size }) => ({ path, size }));
      const res = await withRetry(() =>
        api.prepare({ accountId, files: chunk, folders: i === 0 ? plan.folders : [] }),
      );
      for (const item of res.data?.files || []) statusByPath.set(item.path, item.status);
      for (const folder of res.data?.folders || []) {
        if (folder.status !== "ready") {
          problems.push({ path: folder.path, reason: "folder could not be created" });
        }
      }
    }
  } catch (err) {
    stopped =
      stopReasonFor(err) ||
      "The server could not be reached to start the import. Nothing was uploaded - try again.";
    return { uploaded: 0, skipped: 0, problems, finished: false, stopped, totalFiles: totals.totalFiles, notSent: 0 };
  }

  // ---- decide per file
  const queue = [];
  for (const file of plan.files) {
    const status = statusByPath.get(file.path);

    if (status === "new") queue.push(file);
    else if (status === "exists") {
      totals.skipped += 1;
      settle(file);
    } else {
      fail(file, PREPARE_REASONS[status] || "was not accepted by the server");
      settle(file);
    }
  }

  // ---- upload, a few at a time
  const uploadOne = async (file) => {
    let blob;
    try {
      blob = await file.read();
    } catch {
      fail(file, "could not be read from the ZIP - it may be damaged");
      return;
    }

    try {
      const res = await withRetry(() => api.uploadFile(accountId, file.path, blob));
      if (res.data?.status === "skipped") totals.skipped += 1;
      else totals.uploaded += 1;
    } catch (err) {
      const stopReason = stopReasonFor(err);
      if (stopReason) {
        stopped = stopped || stopReason;
        fail(file, "was not uploaded - the import stopped");
        return;
      }
      fail(
        file,
        UPLOAD_REASONS[statusOf(err)] ||
          (isRetryable(err) ? "failed after several tries - run the import again to retry it" : "was refused by the server"),
      );
    }
  };

  let next = 0;
  const worker = async () => {
    while (next < queue.length) {
      if (stopped) return;
      if (shouldStop()) {
        stopped = stopped || "Cancelled. Run the import again to carry on where it stopped.";
        return;
      }
      const file = queue[next++];
      await uploadOne(file);
      settle(file);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));

  // Files the workers never reached, after a stop.
  const notSent = queue.length - next;
  if (notSent > 0) totals.failed += notSent;

  // ---- mark the account complete only when nothing is missing
  let finished = false;
  if (!stopped && totals.failed === 0 && problems.length === 0) {
    try {
      await withRetry(() => api.finish(accountId));
      finished = true;
    } catch {
      problems.push({ path: "", reason: "All files arrived, but the account could not be marked complete - run the import again." });
    }
  }

  return {
    uploaded: totals.uploaded,
    skipped: totals.skipped,
    problems,
    finished,
    stopped,
    totalFiles: totals.totalFiles,
    notSent,
  };
};
