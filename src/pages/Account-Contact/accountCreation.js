// src/pages/Account-Contact/accountCreation.js
//
// Creating a client account with its contacts (v1.87.0): what the user is
// told, in plain words.
//
// Reported: names with () or [] showed "Regular expression is invalid:
// unmatched closing parenthesis" (fixed server-side in account-contact
// v1.15.0); a failed account still left its new contacts behind, with no
// word about it; duplicate warnings appeared after the fact; and clicking
// Save again created the contacts again.

const SUPPORT = "Please try again; if it keeps happening, contact support.";

const words = (field) =>
  String(field)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase();

/** A server or network failure as something a person can act on. */
export const friendlyError = (err, fallback = "Something went wrong. Please try again.") => {
  if (!err) return fallback;

  if (!err.response) {
    if (err.code === "ECONNABORTED" || /timeout/i.test(err.message || "")) {
      return "The server took too long to answer. Please try again.";
    }
    if (/network/i.test(err.message || "")) {
      return "Could not reach the server. Check your connection and try again.";
    }
    return fallback;
  }

  const data = err.response.data || {};

  if (data.name === "ValidationError" && data.errors) {
    const fields = Object.values(data.errors).map((e) => words(e.path || ""));
    return `Please check: ${fields.filter(Boolean).join(", ")}.`;
  }

  const text =
    (typeof data.error === "string" && data.error) ||
    (typeof data.message === "string" && data.message) ||
    "";

  if (/regular expression|regex/i.test(text)) {
    return `A name contains characters that could not be processed. ${SUPPORT}`;
  }
  if (/E11000|duplicate key/i.test(text)) {
    return "That name is already in use. Please choose a different one.";
  }
  if (/cast to|objectid|mongo|stack|at \w+ \(/i.test(text)) {
    return fallback;
  }

  return text || fallback;
};

/** The "create the duplicate or cancel?" question. */
export const duplicatePrompt = (duplicates) => {
  const one = duplicates.length === 1;
  const lines = duplicates.map(
    (d) => `• ${d.contactName || d.email}: ${d.reasons.join(" ")}`
  );

  return {
    title: one ? "Possible duplicate contact" : "Possible duplicate contacts",
    description: [
      ...lines,
      "",
      one
        ? "Create it anyway, or cancel to change it?"
        : "Create them anyway, or cancel to change them?",
    ].join("\n"),
    confirmText: "Create anyway",
    cancelText: "Cancel",
  };
};

/** Contacts were made, then the account failed. */
export const partialFailureMessage = (names, reason) => {
  const one = names.length === 1;
  return {
    title: one
      ? "Contact created, but the account was not"
      : "Contacts created, but the account was not",
    description: `${names.join(", ")} ${one ? "was" : "were"} created. The account was not: ${reason} Fix it and save again - the ${
      one ? "contact" : "contacts"
    } will not be created a second time.`,
  };
};

/** The same contact across save attempts. */
export const contactKey = (contact) => String(contact?.email || "").trim().toLowerCase();
