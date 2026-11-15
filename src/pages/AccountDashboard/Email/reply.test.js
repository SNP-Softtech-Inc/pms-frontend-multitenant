// The Email tab's Reply (v1.80.0). The button posted to a route that did not
// exist; signup-login v1.29.0 adds it. The screen now sends only which email
// and the text - the server decides who it goes to, the subject and the
// mailbox - and says so when a reply fails instead of only logging it.
import { replyRequest, replyFailureMessage, REPLY_ACTIONS_AVAILABLE } from "./reply";

describe("replyRequest", () => {
  const email = { _id: "row-1", messageId: "18c2f0a1b2", from: "Client <client@x.test>", subject: "Hello" };

  it("sends only the email's id and the text", () => {
    expect(replyRequest(email, "Thanks,\nreceived.")).toEqual({ messageId: "18c2f0a1b2", body: "Thanks,\nreceived." });
  });

  it("never sends a recipient, subject or mailbox", () => {
    const sent = replyRequest(email, "Hi");
    expect(Object.keys(sent).sort()).toEqual(["body", "messageId"]);
  });

  it("is nothing to send without an email or without text", () => {
    expect(replyRequest(null, "Hi")).toBeNull();
    expect(replyRequest({ _id: "x" }, "Hi")).toBeNull();
    expect(replyRequest(email, "   ")).toBeNull();
    expect(replyRequest(email, undefined)).toBeNull();
  });
});

describe("replyFailureMessage", () => {
  it("shows the server's reason", () => {
    const error = { response: { status: 422, data: { message: "The mailbox this conversation is in cannot send." } } };
    expect(replyFailureMessage(error)).toBe("The mailbox this conversation is in cannot send.");
  });

  it("says plainly that nothing was sent when there is no reason", () => {
    expect(replyFailureMessage(new Error("Network Error"))).toMatch(/not sent/i);
    expect(replyFailureMessage(undefined)).toMatch(/not sent/i);
  });
});

describe("what is offered", () => {
  it("offers Reply only, for now", () => {
    expect(REPLY_ACTIONS_AVAILABLE).toEqual({ reply: true, replyAll: false, forward: false, attachments: false });
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

  const start = src.indexOf("const sendReply = async");
  const sendReply = src.slice(start, src.indexOf("\n  };", start));

  it("sends the request built from the email the composer is on", () => {
    expect(sendReply).toContain("const request = replyRequest(email, replyText);");
    expect(sendReply).toContain("await authAPI.replyEmail(request);");
    expect(sendReply).not.toMatch(/to:\s*replyTo|subject:\s*`Re:/);
  });

  it("closes the composer and clears the text only once the reply was accepted", () => {
    const tryBlock = sendReply.slice(sendReply.indexOf("try {"), sendReply.indexOf("catch"));
    const afterSend = tryBlock.slice(tryBlock.indexOf("await authAPI.replyEmail"));
    expect(afterSend).toContain('setReplyText("");');
    expect(afterSend).toContain("setReplyingToMessageId(null);");
  });

  it("shows why a reply failed, and keeps what was typed", () => {
    const catchBlock = sendReply.slice(sendReply.indexOf("catch"));
    expect(catchBlock).toContain("replyFailureMessage(error)");
    expect(catchBlock).toMatch(/type:\s*"error"/);
    expect(catchBlock).not.toContain("setReplyText(");
  });

  it("cannot send twice while a reply is on its way", () => {
    expect(sendReply).toContain("if (sendingReply) return;");
    expect(sendReply).toMatch(/finally \{\s*setSendingReply\(false\);/);
    expect(src).toMatch(/disabled=\{sendingReply \|\| !replyText\.trim\(\)\}/);
  });

  it("does not close the composer itself when Send is clicked", () => {
    expect(src).toMatch(/onClick=\{\(\) => sendReply\(email\)\}/);
    expect(src).not.toMatch(/sendReply\(\);\s*setReplyingToMessageId\(null\);/);
  });

  it("keeps Reply all, Forward and attachments switched off", () => {
    expect(src).toContain("disabled={!REPLY_ACTIONS_AVAILABLE.replyAll}");
    expect(src).toContain("disabled={!REPLY_ACTIONS_AVAILABLE.forward}");
    expect(src).toContain("disabled={!REPLY_ACTIONS_AVAILABLE.attachments}");
  });
});
