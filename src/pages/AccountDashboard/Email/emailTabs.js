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

// Each thread's newest email with its body, for the row's preview and search
// (v1.81.0). signup-login v1.33.0 sends `latest` as a summary - subject,
// read state, dates, no body - since the full email is already in
// `messages`; this takes the body from there. Run before messagesForTab,
// which can leave the newest email out of the tab's list while the row still
// shows it. A server that sends the full `latest` is left as it is.
export const withLatestBody = (threads) =>
  (threads || []).map((thread) => {
    const latest = thread?.latest;
    if (!latest || latest.body !== undefined) return thread;
    const full = (thread.messages || []).find((m) => String(m._id) === String(latest._id));
    return full ? { ...thread, latest: { ...latest, body: full.body } } : thread;
  });

// A thread is unread when its latest message is - the same test the Unread
// tab and the unread count use.
export const isUnread = (thread) => !thread?.latest?.isRead;

// The threads with one marked read, for the screen to show at once after a
// click (v1.78.0). Was a full re-fetch of the mailbox, plus a "Mark as read"
// toast, on every click. Returns new objects; the input is not changed.
export const markReadLocally = (threads, threadId) =>
  (threads || []).map((thread) =>
    thread._id !== threadId
      ? thread
      : {
          ...thread,
          latest: thread.latest ? { ...thread.latest, isRead: true } : thread.latest,
          messages: (thread.messages || []).map((m) => ({ ...m, isRead: true })),
        },
  );
