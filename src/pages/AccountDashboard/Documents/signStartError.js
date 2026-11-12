// What the admin is told when Send for Sign cannot open the signature screen.
//
// Before opening it, the server lists who can sign: the account's activated
// contacts with an email (esignature-backend, GET /api/generate-token). With
// nobody it answers 400 "No activated contacts found for this account". This
// used to go only to the browser console, so the click looked dead.
const NO_SIGNERS = /no activated contacts/i;

export const signStartErrorToast = (err) => {
  const data = err?.response?.data;
  const reason = (typeof data?.error === "string" && data.error) ||
    (typeof data?.message === "string" && data.message) || "";

  if (NO_SIGNERS.test(reason)) {
    return {
      title: "No one on this account can sign yet",
      description: "Activate at least one contact on this account, then send for signature again.",
      type: "error",
    };
  }

  return {
    title: "Could not open the signature screen",
    description: reason || "Please try again.",
    type: "error",
  };
};
