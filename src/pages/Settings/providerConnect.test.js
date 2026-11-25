// providerConnect.js - starting a mailbox sign-in without the login token in
// any URL (v1.91.0).
//
// The Connect buttons used to send the browser to
// /api/googleauth/google?token=<login token>. A token in a URL is kept by
// nginx's access log and the browser's history. Now the page asks the server
// with the token in the Authorization header (authAPI.connectMailProvider) and
// gets back the provider's own sign-in URL, which is checked here before the
// browser is sent there.
import {
  isProviderSignInUrl,
  startProviderConnect,
  CONNECT_PROVIDERS,
} from "./providerConnect";

describe("isProviderSignInUrl", () => {
  it.each([
    ["google", "https://accounts.google.com/o/oauth2/v2/auth?state=S"],
    ["microsoft", "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?state=S"],
    ["zoho", "https://accounts.zoho.com/oauth/v2/auth?state=S"],
  ])("accepts %s's own sign-in page", (provider, url) => {
    expect(isProviderSignInUrl(provider, url)).toBe(true);
  });

  it.each([
    ["google", "http://accounts.google.com/o/oauth2/v2/auth", "not https"],
    ["google", "https://accounts.google.com.evil.example/o/oauth2", "a lookalike host"],
    ["google", "https://evil.example/?next=https://accounts.google.com", "another host"],
    ["google", "https://login.microsoftonline.com/common/oauth2/v2.0/authorize", "another provider's page"],
    ["microsoft", "https://accounts.google.com/o/oauth2/v2/auth", "another provider's page"],
    ["zoho", "https://accounts.zoho.com.evil.example/oauth", "a lookalike host"],
    ["google", "javascript:alert(1)", "a script URL"],
    ["google", "/api/googleauth/google?token=abc", "our own API, relative"],
    ["google", "", "nothing"],
    ["google", undefined, "nothing"],
    ["yahoo", "https://accounts.google.com/o/oauth2/v2/auth", "an unknown provider"],
  ])("refuses %s → %s (%s)", (provider, url) => {
    expect(isProviderSignInUrl(provider, url)).toBe(false);
  });

  it("refuses a URL that carries a token parameter, even on the right host", () => {
    expect(isProviderSignInUrl("google", "https://accounts.google.com/o/oauth2/v2/auth?token=abc")).toBe(false);
  });
});

describe("startProviderConnect", () => {
  it("knows exactly Google, Microsoft and Zoho", () => {
    expect(CONNECT_PROVIDERS).toEqual(["google", "microsoft", "zoho"]);
  });

  it("asks the server for the provider and returns its sign-in URL", async () => {
    const calls = [];
    const connect = (provider) => {
      calls.push(provider);
      return Promise.resolve({ data: { url: "https://accounts.google.com/o/oauth2/v2/auth?state=S" } });
    };

    await expect(startProviderConnect("google", connect)).resolves.toBe(
      "https://accounts.google.com/o/oauth2/v2/auth?state=S",
    );
    expect(calls).toEqual(["google"]);
  });

  it("refuses a URL that is not the provider's, rather than sending the browser there", async () => {
    const connect = () => Promise.resolve({ data: { url: "https://evil.example/" } });

    await expect(startProviderConnect("google", connect)).rejects.toThrow(/sign-in page/);
  });

  it("refuses an answer with no URL", async () => {
    const connect = () => Promise.resolve({ data: {} });

    await expect(startProviderConnect("microsoft", connect)).rejects.toThrow(/sign-in page/);
  });

  it("passes the server's error on, so the page can show its message", async () => {
    const err = Object.assign(new Error("Request failed"), { response: { status: 503, data: { message: "not configured" } } });
    const connect = () => Promise.reject(err);

    await expect(startProviderConnect("zoho", connect)).rejects.toBe(err);
  });

  it("does not call the server for an unknown provider", async () => {
    const calls = [];
    const connect = (p) => {
      calls.push(p);
      return Promise.resolve({ data: {} });
    };

    await expect(startProviderConnect("yahoo", connect)).rejects.toThrow(/provider/);
    expect(calls).toEqual([]);
  });
});
