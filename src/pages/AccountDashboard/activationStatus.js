// src/pages/AccountDashboard/activationStatus.js
//
// Which activation badge a login-enabled contact gets on the account page.
//
// Read from the contact itself (account details populates it), where
// account-contact keeps the truth: isActivated, and when the last activation
// link expires. The badge used to read activationStatus / isActivated from
// the account's contact entry - fields the backend does not send - so every
// login-enabled contact showed "Pending Activation", including clients who
// had been using the portal for weeks.
//
// Returns a key of ACTIVATION_BADGES in Info.js.
export const activationStatusOf = (contact, now = Date.now()) => {
  if (!contact) return "not_sent";
  if (contact.isActivated) return "activated";

  const expires = contact.activationTokenExpires
    ? new Date(contact.activationTokenExpires).getTime()
    : NaN;

  if (Number.isNaN(expires)) return "not_sent";
  return expires < now ? "expired" : "pending";
};
