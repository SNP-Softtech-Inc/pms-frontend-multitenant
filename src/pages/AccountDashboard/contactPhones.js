// src/pages/AccountDashboard/contactPhones.js
//
// The phone line shown under a contact's name and email on the account page.
//
// account-contact keeps phoneNumbers as a list of strings. The contact form
// (react-phone-input-2) saves digits with the country code first and no
// "+", e.g. "919175981613", which is hard to read. Shown here in
// international format: "+91 91759 81613".
//
// Display only - nothing stored is changed.
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Only digits and the usual separators: something that could be a number
// saved without its "+".
const DIGITS_ONLY = /^[\d\s().-]+$/;

/**
 * One stored number in international format, or the stored text unchanged
 * when it is not a number we can recognise. A 10-digit US number imported
 * without its country code is left alone rather than given a guessed one,
 * which would show a different, wrong number.
 */
export const formatPhone = (raw) => {
  const text = raw === null || raw === undefined ? "" : String(raw).trim();
  if (!text) return "";

  const candidate = text.startsWith("+")
    ? text
    : DIGITS_ONLY.test(text)
      ? `+${text.replace(/\D/g, "")}`
      : null;

  if (candidate) {
    const parsed = parsePhoneNumberFromString(candidate);
    if (parsed && parsed.isValid()) return parsed.formatInternational();
  }

  return text;
};

/**
 * Every number a contact has, formatted and comma separated. Blank entries
 * are dropped: an import with an empty "Phone" column stores [""], which is
 * most contacts on staging.
 */
export const contactPhonesText = (contact) => {
  const raw = contact?.phoneNumbers;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return list.map(formatPhone).filter(Boolean).join(", ");
};
