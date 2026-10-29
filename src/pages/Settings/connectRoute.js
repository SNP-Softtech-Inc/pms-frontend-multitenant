// Where the "Connect your email" box sends an address.
//
// Kept out of MyAccount.js so it can be tested. The server's discovery answer
// decides it: an address run by Google goes to Google sign-in, one run by
// Microsoft to Microsoft sign-in, and anything else to the password form,
// with its server already filled in when one was found.

export const isCompleteAddress = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? "").trim());

const UNAVAILABLE = {
  google: "Google mailboxes can't be connected on this server yet.",
  microsoft:
    "Outlook and Microsoft 365 mailboxes can't be connected yet. They will be once Microsoft sign-in is set up.",
  imap: "This mailbox connects with a password, which isn't set up on this server yet.",
};

/**
 * @param discovery  the /imap/discover answer, or null if the lookup failed
 * @param providers  which providers this server can connect right now
 * @param address    the address typed, for recognising Zoho
 * @returns {{kind: "google"|"microsoft"|"zoho"|"imap"} | {kind: "unavailable", message: string}}
 */
export const routeForDiscovery = (discovery, providers, address) => {
  const oauth = discovery?.oauthProvider;

  // Zoho signs in where the server supports it, and otherwise keeps the
  // password form it always had - so a server without Zoho sign-in set up
  // behaves exactly as before.
  if (
    oauth !== "google" &&
    oauth !== "microsoft" &&
    providers?.zoho?.available &&
    imapProviderIdFor(address, discovery?.settings?.host) === "zoho"
  ) {
    return { kind: "zoho" };
  }

  const kind = oauth === "google" || oauth === "microsoft" ? oauth : "imap";

  // A redirect to a provider the server has not configured lands on a 503,
  // so say so here instead.
  if (!providers?.[kind]?.available) {
    return { kind: "unavailable", message: UNAVAILABLE[kind] };
  }

  return { kind };
};

// Which named provider an IMAP mailbox belongs to, so the form can show that
// provider's app-password note. Matched on whole domain labels of the address
// and the discovered host - "yahoolawfirm.com" is not Yahoo.
const PROVIDER_LABELS = [
  { id: "yahoo", labels: ["yahoo"] },
  { id: "icloud", labels: ["icloud", "me", "mac"] },
  { id: "zoho", labels: ["zoho", "zohomail"] },
  { id: "aol", labels: ["aol"] },
];

const labelsOf = (name) => String(name || "").toLowerCase().split(".");

export const imapProviderIdFor = (email, host) => {
  const domain = String(email || "").split("@")[1] || "";
  const seen = new Set([...labelsOf(domain), ...labelsOf(host)]);

  return PROVIDER_LABELS.find((p) => p.labels.some((l) => seen.has(l)))?.id || "other";
};
