// The "Connect your email" box: one address in, one place to go out.
//
// The server's discovery answer decides it - Google sign-in, Microsoft
// sign-in, or the password form - and these pin that decision, including the
// cases where the right door exists but this server cannot open it yet
// (Microsoft before the Azure registration, IMAP without its encryption key).
import { isCompleteAddress, routeForDiscovery, imapProviderIdFor } from "./connectRoute";

const ALL = {
  google: { available: true },
  microsoft: { available: true },
  imap: { available: true },
};

describe("isCompleteAddress", () => {
  it.each(["me@gmail.com", "partner@their-firm.co.uk", "  me@zohomail.in  "])(
    "accepts %s",
    (email) => expect(isCompleteAddress(email)).toBe(true),
  );

  it.each(["", "me", "me@", "me@gmail", "@gmail.com", "me @gmail.com", null, undefined])(
    "rejects %p",
    (email) => expect(isCompleteAddress(email)).toBe(false),
  );
});

describe("routeForDiscovery", () => {
  it("sends a Google address to Google sign-in", () => {
    expect(routeForDiscovery({ found: false, oauthProvider: "google" }, ALL)).toEqual({ kind: "google" });
  });

  it("sends a Microsoft address to Microsoft sign-in", () => {
    expect(routeForDiscovery({ found: false, oauthProvider: "microsoft" }, ALL)).toEqual({ kind: "microsoft" });
  });

  it("explains, rather than redirecting to a 503, when Microsoft is not set up", () => {
    const route = routeForDiscovery(
      { found: false, oauthProvider: "microsoft" },
      { ...ALL, microsoft: { available: false } },
    );

    expect(route.kind).toBe("unavailable");
    expect(route.message).toMatch(/Outlook/);
  });

  it("explains when Google is not set up", () => {
    const route = routeForDiscovery(
      { found: false, oauthProvider: "google" },
      { ...ALL, google: { available: false } },
    );

    expect(route.kind).toBe("unavailable");
    expect(route.message).toMatch(/Google/);
  });

  it("opens the password form for a mailbox whose server was found", () => {
    expect(
      routeForDiscovery({ found: true, settings: { host: "imap.zoho.in", port: 993 } }, ALL),
    ).toEqual({ kind: "imap" });
  });

  it("opens the password form when nothing was found - the manual fields are the way on", () => {
    expect(routeForDiscovery({ found: false, oauthProvider: null, message: "x" }, ALL)).toEqual({ kind: "imap" });
  });

  it("opens the password form when the lookup itself failed", () => {
    expect(routeForDiscovery(null, ALL)).toEqual({ kind: "imap" });
  });

  it("explains when password mailboxes cannot be connected on this server", () => {
    const route = routeForDiscovery({ found: true }, { ...ALL, imap: { available: false } });

    expect(route.kind).toBe("unavailable");
    expect(route.message).toBeTruthy();
  });

  it("treats missing provider flags as unavailable", () => {
    expect(routeForDiscovery({ oauthProvider: "microsoft" }, {}).kind).toBe("unavailable");
    expect(routeForDiscovery({ found: true }, undefined).kind).toBe("unavailable");
  });
});

describe("routeForDiscovery - Zoho", () => {
  const WITH_ZOHO = { ...ALL, zoho: { available: true } };

  it.each([
    ["a personal Zoho address", "me@zohomail.in", "imap.zoho.in"],
    ["a firm's own domain on Zoho", "partner@theirfirm.com", "imappro.zoho.in"],
  ])("sends %s to Zoho sign-in when it is available", (_, email, host) => {
    expect(routeForDiscovery({ found: true, settings: { host } }, WITH_ZOHO, email)).toEqual({ kind: "zoho" });
  });

  it("keeps the password form for Zoho while Zoho sign-in is not set up", () => {
    expect(
      routeForDiscovery({ found: true, settings: { host: "imap.zoho.in" } }, ALL, "me@zohomail.in"),
    ).toEqual({ kind: "imap" });
  });

  it("does not send other mailboxes to Zoho", () => {
    expect(
      routeForDiscovery({ found: true, settings: { host: "imap.mail.yahoo.com" } }, WITH_ZOHO, "me@yahoo.com"),
    ).toEqual({ kind: "imap" });
  });

  it("recognises Zoho from the address when the lookup failed", () => {
    expect(routeForDiscovery(null, WITH_ZOHO, "me@zohomail.in")).toEqual({ kind: "zoho" });
  });
});

describe("imapProviderIdFor - which app-password note to show", () => {
  it.each([
    ["me@yahoo.com", "imap.mail.yahoo.com", "yahoo"],
    ["me@icloud.com", "imap.mail.me.com", "icloud"],
    ["me@me.com", "imap.mail.me.com", "icloud"],
    ["me@zohomail.in", "imap.zoho.in", "zoho"],
    ["partner@theirfirm.com", "imappro.zoho.in", "zoho"],
    ["me@aol.com", "imap.aol.com", "aol"],
    ["partner@theirfirm.com", "mail.theirfirm.com", "other"],
    ["partner@theirfirm.com", undefined, "other"],
  ])("%s on %s -> %s", (email, host, id) => {
    expect(imapProviderIdFor(email, host)).toBe(id);
  });

  it("does not read a firm's name as a provider", () => {
    expect(imapProviderIdFor("me@yahoolawfirm.com", "mail.yahoolawfirm.com")).toBe("other");
  });
});
