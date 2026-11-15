// The Email tab's Reply (v1.80.0).
//
// The button posted { to, subject, message, threadId } to
// /api/emailsync/reply, which did not exist - every reply failed, silently.
// signup-login v1.29.0 adds the route and works out the recipient, the
// subject, the mailbox and the threading from the stored email, so the
// screen sends only which email and the text.

// Reply all, Forward and attachments are not built on the server yet.
export const REPLY_ACTIONS_AVAILABLE = Object.freeze({
  reply: true,
  replyAll: false,
  forward: false,
  attachments: false,
});

// The request for a reply to `email`, or null when there is nothing to send.
export const replyRequest = (email, text) => {
  if (!email?.messageId) return null;
  if (typeof text !== "string" || !text.trim()) return null;
  return { messageId: email.messageId, body: text };
};

// What to tell the user when a reply was not sent.
export const replyFailureMessage = (error) =>
  error?.response?.data?.message || "Your reply was not sent. Please try again.";
