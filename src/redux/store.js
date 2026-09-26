// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import accountContactReducer from "./accountContactSlice";
import { isDraftWorthKeeping, saveNewDraft } from "./accountContactDraft";

const store = configureStore({
  reducer: {
    accountContact: accountContactReducer,
  },
});

// Mirror the in-progress "create account" form into sessionStorage so it
// survives a refresh or the browser Back button. Only the new-account draft
// is mirrored: while an existing account is being edited draftFor holds its
// id, and that state is reloaded from the API rather than restored.
// Clearing is deliberate - see accountContactDraft.js.
let last = {};

store.subscribe(() => {
  const state = store.getState().accountContact;

  if (state.draftFor !== "new" || !isDraftWorthKeeping(state)) return;

  // Every dispatch notifies subscribers, including ones that leave this
  // slice untouched, so skip the write when none of the three pieces we
  // persist has actually moved. Immer gives us a new reference for whichever
  // part changed, so identity checks are enough.
  if (
    state.accountData === last.accountData &&
    state.contacts === last.contacts &&
    state.selectedContacts === last.selectedContacts
  ) {
    return;
  }

  last = {
    accountData: state.accountData,
    contacts: state.contacts,
    selectedContacts: state.selectedContacts,
  };

  saveNewDraft(state);
});

export default store;
