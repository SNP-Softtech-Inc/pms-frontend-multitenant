// Cancel Signature Request on the Documents tab (v1.83.0).
//
// The server (esignature-backend v1.12.0) finds the file from the request
// itself; the folder and name sent here are its fallback. The name must be the
// file's real name: a file uploaded under a taken name is stored as
// "X(2).pdf" while its meta still says "X.pdf", and sending that meta name
// is what used to clear the wrong file.

/** What to send for an item: { id, body } or null when it has no request. */
export const cancelRequest = (item) => {
  const id = item?.meta?.esignRequestId;
  if (!id) return null;

  return {
    id,
    body: {
      folder: item.meta.folder,
      name: item.name,
    },
  };
};

/**
 * The toast after a cancel: success when there is no error, otherwise the
 * server's reason (already signed, signing service unreachable, ...).
 */
export const cancelResultToast = (err, data = {}) => {
  if (!err) {
    return {
      title: "Signature request cancelled",
      description: data?.file
        ? `${data.file} can be edited and sent again.`
        : "The document can be edited and sent again.",
      type: "success",
    };
  }

  const body = err?.response?.data;
  const reason =
    (typeof body?.error === "string" && body.error) ||
    (typeof body?.message === "string" && body.message) ||
    "";

  return {
    title: "Could not cancel the signature request",
    description: reason || "Please try again.",
    type: "error",
  };
};
