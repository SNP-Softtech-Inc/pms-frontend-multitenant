// Which synced messages the account's Inbox and Sent tabs show.
import { ownAddresses, isOurs, messagesForTab, isUnread, markReadLocally } from "./emailTabs";

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

  it("no longer compares against the Gmail address alone", () => {
    expect(src).not.toMatch(/supportEmail\.toLowerCase\(\)/);
  });
});
