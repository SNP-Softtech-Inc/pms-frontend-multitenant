// Which synced messages the account's Inbox and Sent tabs show.
import { ownAddresses, isOurs, messagesForTab, isUnread, markReadLocally, withLatestBody } from "./emailTabs";

const FIRM = "silpa@firm.test";
const CLIENT = "client@gmail.test";

const msg = (from, to, subject = "Hello") => ({ from, to, subject });
const thread = (...messages) => ({ _id: `t-${Math.random()}`, messages });

describe("ownAddresses", () => {
  it("uses the mailboxes the server says are the firm's side", () => {
    expect(ownAddresses(["Silpa@Firm.test", "desk@zoho.test"], "")).toEqual(["silpa@firm.test", "desk@zoho.test"]);
  });

  it("falls back to the user's Gmail address when the server sends no list (older server)", () => {
    expect(ownAddresses(undefined, FIRM)).toEqual([FIRM]);
    expect(ownAddresses([], FIRM)).toEqual([FIRM]);
  });

  it("is empty when there is nothing to go on, rather than matching everything", () => {
    expect(ownAddresses(undefined, "")).toEqual([]);
    expect(ownAddresses([" ", null], undefined)).toEqual([]);
  });
});

describe("isOurs", () => {
  it("matches an address inside a display name, ignoring case", () => {
    expect(isOurs('"SNP Tax" <SILPA@firm.test>', [FIRM])).toBe(true);
    expect(isOurs(CLIENT, [FIRM])).toBe(false);
    expect(isOurs("", [])).toBe(false);
  });

  it("never lets a blank mailbox match everything", () => {
    expect(isOurs(CLIENT, [""])).toBe(false);
  });
});

describe("messagesForTab", () => {
  const sent = msg(`"SNP" <${FIRM}>`, [CLIENT], "Testing");
  const reply = msg(`Client <${CLIENT}>`, [`"SNP" <${FIRM}>`], "Re: Testing");
  const opts = (type) => ({ type, contactEmails: [CLIENT], mailboxes: [FIRM] });

  it("puts the firm's email in Sent and the client's reply in Inbox (the reported case)", () => {
    const threads = [thread(sent, reply)];

    expect(messagesForTab(threads, opts("sent"))[0].messages).toEqual([sent]);
    expect(messagesForTab(threads, opts("inbox"))[0].messages).toEqual([reply]);
  });

  it("works for a Zoho mailbox as for Gmail", () => {
    const zohoSent = msg("desk@zoho.test", [CLIENT]);

    expect(messagesForTab([thread(zohoSent)], { type: "sent", contactEmails: [CLIENT], mailboxes: ["desk@zoho.test"] })).toHaveLength(1);
  });

  it("leaves out messages with no contact of this account, or not involving the firm", () => {
    const otherClient = msg(FIRM, ["someone@else.test"]);
    const notOurs = msg(CLIENT, ["friend@else.test"]);

    expect(messagesForTab([thread(otherClient), thread(notOurs)], opts("sent"))).toEqual([]);
    expect(messagesForTab([thread(otherClient), thread(notOurs)], opts("inbox"))).toEqual([]);
  });

  it("drops threads left empty and keeps the rest of the thread", () => {
    const t = thread(sent, reply);
    const [kept] = messagesForTab([t, thread(reply)], opts("sent"));

    expect(kept._id).toBe(t._id);
    expect(messagesForTab([thread(reply)], opts("sent"))).toEqual([]);
  });

  it("still leaves out team-member invitation emails", () => {
    const invite = msg(FIRM, [CLIENT], "Silpa has invited you to join PMS");

    expect(messagesForTab([thread(invite)], opts("sent"))).toEqual([]);
  });

  it("accepts a single 'to' string and messages without a thread list", () => {
    expect(messagesForTab([thread(msg(FIRM, CLIENT))], opts("sent"))).toHaveLength(1);
    expect(messagesForTab([{ _id: "x" }], opts("sent"))).toEqual([]);
  });

  it("shows nothing when the firm's side is unknown", () => {
    expect(messagesForTab([thread(sent, reply)], { type: "inbox", contactEmails: [CLIENT], mailboxes: [] })).toEqual([]);
  });
});

describe("reading a thread", () => {
  const unread = { _id: "a", latest: { isRead: false }, messages: [{ isRead: false }, { isRead: true }] };
  const read = { _id: "b", latest: { isRead: true }, messages: [{ isRead: true }] };

  it("counts a thread as unread by its latest message, as the Unread tab does", () => {
    expect(isUnread(unread)).toBe(true);
    expect(isUnread(read)).toBe(false);
    expect(isUnread({ _id: "c" })).toBe(true);
  });

  it("marks one thread read on screen, without fetching the mailbox again", () => {
    const next = markReadLocally([unread, read], "a");

    expect(next[0].latest.isRead).toBe(true);
    expect(next[0].messages.every((m) => m.isRead)).toBe(true);
    expect(next[1]).toBe(read);
  });

  it("does not change the threads it was given", () => {
    markReadLocally([unread], "a");

    expect(unread.latest.isRead).toBe(false);
    expect(unread.messages[0].isRead).toBe(false);
  });

  it("leaves everything as is for an unknown thread", () => {
    const threads = [unread, read];
    expect(markReadLocally(threads, "zzz")).toEqual(threads);
  });
});

describe("withLatestBody (v1.81.0)", () => {
  // signup-login v1.33.0 sends `latest` as a summary; the body for the row's
  // preview and search comes from the same email in `messages`.
  const full = (id, body, extra = {}) => ({ _id: id, subject: `S ${id}`, body, from: CLIENT, to: [FIRM], isRead: false, ...extra });
  const summary = (id) => ({ _id: id, subject: `S ${id}`, isRead: false, messageDate: "2026-11-16T10:00:00Z" });

  it("fills the summary's body from the same email in messages", () => {
    const threads = [{ _id: "t1", latest: summary("e2"), messages: [full("e2", "<p>newest</p>"), full("e1", "<p>older</p>")] }];
    const [t] = withLatestBody(threads);
    expect(t.latest).toEqual({ ...summary("e2"), body: "<p>newest</p>" });
    expect(t.messages).toBe(threads[0].messages);
  });

  it("gives the same row text as a full latest did", () => {
    const e = full("e1", "<p>Hello <b>there</b></p>");
    const before = { _id: "t1", latest: e, messages: [e] };
    const after = withLatestBody([{ _id: "t1", latest: summary("e1"), messages: [e] }])[0];
    ["subject", "body", "isRead"].forEach((k) => expect(after.latest[k]).toBe(before.latest[k]));
  });

  it("works before messagesForTab drops the newest email from the tab's list", () => {
    const invite = full("e2", "<p>invite</p>", { subject: "Ann has invited you to join PMS", from: FIRM, to: [CLIENT] });
    const reply = full("e1", "<p>reply</p>");
    const loaded = withLatestBody([{ _id: "t1", latest: { ...summary("e2"), subject: invite.subject }, messages: [invite, reply] }]);
    const [t] = messagesForTab(loaded, { type: "inbox", contactEmails: [CLIENT], mailboxes: [FIRM] });
    expect(t.messages.map((m) => m._id)).toEqual(["e1"]);
    expect(t.latest.body).toBe("<p>invite</p>"); // the row still previews the newest email, as before
  });

  it("leaves a full latest from an older server alone", () => {
    const e = full("e1", "<p>x</p>");
    const threads = [{ _id: "t1", latest: e, messages: [e] }];
    expect(withLatestBody(threads)[0]).toBe(threads[0]);
  });

  it("keeps an empty body empty, not missing", () => {
    expect(withLatestBody([{ _id: "t", latest: summary("e1"), messages: [full("e1", "")] }])[0].latest.body).toBe("");
  });

  it("copes with no match, no latest and no threads", () => {
    const lone = { _id: "t", latest: summary("gone"), messages: [full("e1", "x")] };
    expect(withLatestBody([lone])[0]).toBe(lone);
    const bare = { _id: "t", messages: [] };
    expect(withLatestBody([bare])[0]).toBe(bare);
    expect(withLatestBody(undefined)).toEqual([]);
  });

  it("keeps unread and search working on the filled row", () => {
    const [t] = withLatestBody([{ _id: "t1", latest: summary("e1"), messages: [full("e1", "<p>quarterly estimate</p>")] }]);
    expect(isUnread(t)).toBe(true);
    expect([t.latest.subject, t.latest.body].join(" ").toLowerCase()).toContain("quarterly");
    expect(isUnread(markReadLocally([t], "t1")[0])).toBe(false);
  });
});

// Render tests are blocked in this repo (decisions.md, 2026-10-24), so the
// screen's wiring is checked in the source; commented-out lines are ignored.
describe("EmailViewer wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const src = fs
    .readFileSync(path.join(__dirname, "EmailViewer.js"), "utf8")
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");

  it("loads once the user is known, not only when they have a Gmail address", () => {
    expect(src).toMatch(/if \(userLoaded\) \{\s*fetchEmailCommunications\(\);/);
    expect(src).not.toMatch(/if \(supportEmail\) \{\s*fetchEmailCommunications\(\);/);
    expect(src).toMatch(/finally \{\s*setUserLoaded\(true\);/);
  });

  it("takes the firm's side from the server's mailbox list and filters with it", () => {
    expect(src).toMatch(/const ours = ownAddresses\(emailsRes\?\.data\?\.mailboxes, supportEmail\);/);
    expect(src).toMatch(/messagesForTab\(allThreads, \{\s*type,\s*contactEmails: syncedEmails,\s*mailboxes: ours,\s*\}\)/);
  });

  it("opens a thread quietly: no 'Mark as read' toast", () => {
    expect(src).not.toMatch(/title:\s*"Mark as read"/);
  });

  it("marks only an unread thread read, on screen, without re-fetching the mailbox", () => {
    expect(src).toContain("if (isUnread(thread)) markThreadAsRead(thread._id);");
    const start = src.indexOf("const markThreadAsRead = async");
    const body = src.slice(start, src.indexOf("};", start));
    expect(body).toContain("setThreads((prev) => markReadLocally(prev, threadId));");
    expect(body).toContain("await authAPI.markThreadAsRead(threadId);");
    expect(body).not.toContain("fetchEmailCommunications()");
    expect(body).not.toContain("showToast");
  });

  it("asks for this account's emails, and not at all without an account (v1.81.0)", () => {
    expect(src).toContain("await authAPI.getEmailCommunications(accountId);");
    expect(src).not.toContain("await authAPI.getEmailCommunications();");
    const start = src.indexOf("const fetchEmailCommunications = async");
    expect(src.indexOf("if (!accountId) return;", start)).toBeGreaterThan(start);
    expect(src.indexOf("if (!accountId) return;", start)).toBeLessThan(src.indexOf("getAccountContacts", start));
    expect(src).toMatch(/\}, \[type, userLoaded, supportEmail, accountId\]\);/);
  });

  it("fills latest's body before filtering, and still searches it (v1.81.0)", () => {
    expect(src).toMatch(/const allThreads = withLatestBody\(\s*emailsRes\?\.data\?\.threads/);
    expect(src.indexOf("withLatestBody(")).toBeLessThan(src.indexOf("messagesForTab(allThreads"));
    expect(src).toMatch(/t\.latest\?\.subject,\s*t\.latest\?\.body,/);
    expect(src).toContain('getPreview(latest?.body || "", 60)');
  });

  it("no longer compares against the Gmail address alone", () => {
    expect(src).not.toMatch(/supportEmail\.toLowerCase\(\)/);
  });
});
