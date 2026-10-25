// Regression tests for the IMAP connect form's state transition.
//
// Every IMAP connection attempt was failing with "Invalid credentials",
// against any provider. The server log, once it reported the credential's
// shape, gave it away:
//
//   IMAP VERIFY FAILED: vardhank@zohomail.in | host: imap.zoho.in
//     | kind: auth | server: Invalid credentials(Failure)
//     | user=v len=12 outerSpace=no innerSpace=no
//
//   user=v
//
// The username sent to the mail server was the single character "v".
//
// The cause was in the email field's change handler, which ran per keystroke:
//
//   setImapForm((prev) => ({ ...prev, email, username: prev.username || email }));
//
//   keystroke 1  email "v"        prev.username ""  -> username "v"
//   keystroke 2  email "va"       prev.username "v" -> username stays "v"
//   keystroke 8  email "vardhank" prev.username "v" -> username stays "v"
//
// Once username was non-empty it could never update, so it kept the first
// character typed. The intent - default the username to the address unless
// overridden - was right; evaluating it on every keystroke was not.
//
// There is no username input in the UI, so the field can only ever hold what
// this handler put there. The server already defaults it (username || email),
// which is the correct place for that decision.
import { nextImapFormForEmail } from "./imapFormState";

const EMPTY = { email: "", host: "", port: 993, username: "", password: "" };

// Type a string one character at a time, exactly as the handler sees it.
const typeEmail = (text, initial = EMPTY) =>
  text.split("").reduce(
    (state, _char, i) => nextImapFormForEmail(state, text.slice(0, i + 1)),
    initial
  );

describe("typing an address into the IMAP form", () => {
  it("does not leave the username as the first character typed", () => {
    const state = typeEmail("vardhank@zohomail.in");
    expect(state.username).not.toBe("v");
  });

  it("leaves the username empty, so the server applies its own default", () => {
    const state = typeEmail("vardhank@zohomail.in");
    expect(state.username).toBe("");
  });

  it("records the full address", () => {
    expect(typeEmail("vardhank@zohomail.in").email).toBe("vardhank@zohomail.in");
  });

  it("is unaffected by how many characters were typed", () => {
    expect(typeEmail("a@b.com").username).toBe("");
    expect(typeEmail("a.very.long.address@somefirm.co.uk").username).toBe("");
  });

  it("keeps a username that was set deliberately", () => {
    // No input offers this today, but the server honours it, so the state
    // transition must not discard it if one is ever added.
    const state = typeEmail("vardhank@zohomail.in", { ...EMPTY, username: "chosen" });
    expect(state.username).toBe("chosen");
  });

  it("leaves the other fields alone", () => {
    const state = typeEmail("a@b.com", { ...EMPTY, host: "mail.example.com", port: 143 });
    expect(state.host).toBe("mail.example.com");
    expect(state.port).toBe(143);
  });

  it("handles the address being cleared", () => {
    const typed = typeEmail("a@b.com");
    const cleared = nextImapFormForEmail(typed, "");
    expect(cleared.email).toBe("");
    expect(cleared.username).toBe("");
  });
});
