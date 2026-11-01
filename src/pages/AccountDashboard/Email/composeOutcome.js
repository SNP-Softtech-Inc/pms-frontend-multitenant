// src/pages/AccountDashboard/Email/composeOutcome.js
//
// What the Compose drawer tells staff after Send, from the server's answer
// { emailsSent, failed, failures: [{ email, reason }] }.
//
// The drawer said "Email Sent" whatever the answer was. Compose now sends
// from the firm's own mailbox (account-contact v1.13.0); a firm with none
// connected has every email refused, so the reason has to reach staff.
//
// Returns { type, title, description?, close } - `type` is a showToast type;
// `close: false` keeps the drawer and the draft open when nothing went.
export const composeOutcome = (data) => {
  const sent = Number(data?.emailsSent) || 0;
  const failed = Array.isArray(data?.failed) ? data.failed : [];
  const failures = Array.isArray(data?.failures) ? data.failures : [];

  if (sent > 0 && failed.length === 0) {
    return { type: "success", title: "Email Sent", close: true };
  }

  // Each distinct reason once; a server without `failures` names who failed.
  const reasons = [...new Set(failures.map((f) => f?.reason).filter(Boolean))];
  const why = reasons.length
    ? reasons.join(" ")
    : failed.length
      ? `Could not send to ${failed.join(", ")}.`
      : "The server did not confirm that anything was sent.";

  if (sent === 0) {
    return { type: "error", title: "Email not sent", description: why, close: false };
  }

  return {
    type: "warning",
    title: `Sent to ${sent} of ${sent + failed.length}`,
    description: `Not sent to ${failed.join(", ")}. ${reasons.join(" ")}`.trim(),
    close: true,
  };
};
