// src/pages/Teammembers/bulk.js
//
// Teams & Plans bulk actions (v1.89.0): run the per-record action for each
// selected row and report exactly what happened.
//
// One at a time, not all at once: each call is the same request a single
// row's menu makes (with its own checks on the server), the server is not
// flooded, and the result says which ones failed and why.

const reasonOf = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Unknown error";

/** { succeeded: [item], failed: [{ item, reason }] } */
export const runBulk = async (items, action) => {
  const succeeded = [];
  const failed = [];

  for (const item of items) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await action(item);
      succeeded.push(item);
    } catch (err) {
      failed.push({ item, reason: reasonOf(err) });
    }
  }

  return { succeeded, failed };
};

export const countLabel = (n, noun) => `${n} ${noun}${n === 1 ? "" : "s"}`;

/**
 * The toast after a bulk action: "Deactivated 3 team members", etc.
 * action = { verb: "deactivate", done: "Deactivated" }.
 */
export const bulkResultToast = ({ verb, done }, noun, { succeeded, failed }) => {
  if (failed.length === 0) {
    return { title: `${done} ${countLabel(succeeded.length, noun)}`, type: "success" };
  }

  const description = failed
    .map(({ item, reason }) => `${item?.name || "One item"}: ${reason}`)
    .join("\n");

  if (succeeded.length === 0) {
    return {
      title: `Could not ${verb} any of the ${countLabel(failed.length, noun)}`,
      description,
      type: "error",
      duration: 10000,
    };
  }

  return {
    title: `${done} ${countLabel(succeeded.length, noun)}; ${failed.length} could not be`,
    description,
    type: "warning",
    duration: 10000,
  };
};
