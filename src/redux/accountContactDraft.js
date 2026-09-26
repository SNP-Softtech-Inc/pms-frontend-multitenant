// Persistence for the half-filled "create account" form.
//
// The redux store is in-memory only, so anything that tears the app down -
// a refresh, the browser Back button leaving the SPA, a crash - took the
// draft with it and the form came back on initialState, which is why the
// account type silently reverted to "Individual" and the typed details were
// gone. Keeping the draft in sessionStorage lets it survive those, and lets
// it survive opening an existing account for editing in between (that
// repoints draftFor at the account id, so reopening "create" would otherwise
// clear the form).
//
// sessionStorage rather than localStorage: the draft belongs to this tab and
// should not outlive it. Every access is wrapped because storage throws in
// private mode and when site data is blocked.

const KEY = "pms.accountContact.newDraft.v1";

// Whether the user has actually typed something worth keeping. Without this
// an untouched form would be saved and then "restored" over nothing.
export const isDraftWorthKeeping = (state) => {
  if (!state) return false;

  const account = state.accountData || {};

  const hasAccountText = [
    "accountName",
    "companyName",
    "country",
    "streetAddress",
    "city",
    "state",
    "postalCode",
  ].some((field) => String(account[field] || "").trim() !== "");

  return (
    hasAccountText ||
    account.clientType === "Company" ||
    (account.tags?.length || 0) > 0 ||
    (account.teamMember?.length || 0) > 0 ||
    (state.contacts?.length || 0) > 0 ||
    (state.selectedContacts?.length || 0) > 0
  );
};

export const saveNewDraft = (state) => {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        accountData: state.accountData,
        contacts: state.contacts,
        selectedContacts: state.selectedContacts,
      }),
    );
  } catch {
    // Storage unavailable or full - the draft just falls back to being
    // in-memory only, which is what it was before.
  }
};

export const loadNewDraft = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    const draft = JSON.parse(raw);
    // Anything without accountData is not a draft we wrote.
    if (!draft?.accountData) return null;

    return draft;
  } catch {
    return null;
  }
};

export const clearNewDraft = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to do - a stale draft is cleared again on the next save.
  }
};
