// What the admin is told after Send for signature.
//
// The server sends only to recipients with a field on the page and reports
// the rest as `skipped` (esignature-backend v1.10.0), so the count comes from
// its answer rather than from everyone on the account.
export const sendResultToast = (data, requestedCount) => {
  const sent = Array.isArray(data?.submitters) ? data.submitters.length : requestedCount;
  const skipped = Array.isArray(data?.skipped) ? data.skipped : [];
  const names = skipped.map((s) => s?.name || s?.email).filter(Boolean);

  const toast = { title: `Sent to ${sent} recipient(s)`, type: "success" };

  if (names.length) {
    toast.description = `Not sent to ${names.join(", ")} - no field was placed for them.`;
  }

  return toast;
};
