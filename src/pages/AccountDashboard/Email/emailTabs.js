// Which synced messages the account's Inbox and Sent tabs show.
//
// Moved out of EmailViewer.js so it can be tested. The rules are unchanged,
// except that the firm's side is now a LIST of mailboxes rather than the
// user's Gmail address alone (v1.77.0): signup-login v1.26.1 returns the
// mailboxes the user is connected to, so a Zoho, IMAP or Outlook mailbox
// counts too. An older server sends no list; the Gmail address is used then.

const lower = (value) => String(value || "").toLowerCase();

// The firm's side of a conversation, lower-cased.
export const ownAddresses = (fromServer, gmailEmail) => {
  const given = Array.isArray(fromServer) && fromServer.length ? fromServer : [gmailEmail];
  return [...new Set(given.map((e) => lower(e).trim()).filter(Boolean))];
};

// Is this From / To value one of ours? Values may carry a display name
// ("SNP <silpa@…>"), so it is a contains-match, as before. A blank mailbox
// would match every address, so it never counts.
export const isOurs = (address, mailboxes) => {
  const value = lower(address);
  return mailboxes.some((m) => Boolean(m) && value.includes(m));
};

const toListOf = (msg) => (Array.isArray(msg.to) ? msg.to : [msg.to || ""]).map(lower);

// The threads for one tab, each holding only that tab's messages: Inbox is a
// contact writing to the firm, Sent is the firm writing to a contact.
export const messagesForTab = (threads, { type, contactEmails, mailboxes }) => {
  const contacts = (contactEmails || []).map(lower).filter(Boolean);

  return (threads || [])
    .map((thread) => {
      const messages = (thread.messages || []).filter((msg) => {
        // Team-member invitations are not client correspondence.
        if (/has invited you to join PMS/i.test(msg.subject || "")) return false;

        const from = lower(msg.from);
        const toList = toListOf(msg);

        const involvesContact = contacts.some((c) => from.includes(c) || toList.some((t) => t.includes(c)));
        const involvesUs = isOurs(from, mailboxes) || toList.some((t) => isOurs(t, mailboxes));
        if (!involvesContact || !involvesUs) return false;

        if (type === "inbox") return contacts.some((c) => from.includes(c));
        if (type === "sent") return isOurs(from, mailboxes);
        return false;
      });

      return { ...thread, messages };
    })
    .filter((thread) => thread.messages.length > 0);
};
