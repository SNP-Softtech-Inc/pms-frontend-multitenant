// src/pages/AccountDashboard/contactPhones.js
//
// The phone line shown under a contact's name and email on the account page.
//
// account-contact keeps phoneNumbers as a list of strings, as the contact
// form saves them (react-phone-input-2: digits including the country code).
// Shown as stored and comma separated, the same as the Contacts list, so one
// number never looks different on two screens.
//
// Blank entries are dropped: an import with an empty "Phone" column stores
// [""], which is most contacts on staging.
export const contactPhonesText = (contact) => {
  const raw = contact?.phoneNumbers;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return list
    .filter((n) => n !== null && n !== undefined)
    .map((n) => String(n).trim())
    .filter(Boolean)
    .join(", ");
};
