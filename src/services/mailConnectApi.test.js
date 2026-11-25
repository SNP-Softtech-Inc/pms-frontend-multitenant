// The mailbox connect / disconnect API calls carry the login token in the
// Authorization header only - never in the URL (v1.91.0).
//
// Every one of these used to put ?token=<login token> on the URL, where
// nginx's access log kept it. The shared client already adds the
// Authorization header to every request (attachInterceptors), so the query
// copy was only ever a leak - and a bug: after a 401 the client retried with a
// fresh header but the same URL, whose expired ?token= the server reads first,
// so the retry failed again.
//
// axios is mocked as in api.test.js (see its notes on CRA's resetMocks); what
// is checked is the request the app would have made.
const mockRecorded = [];

jest.mock("axios", () => {
  const record = (method) => (url, arg, config) => {
    mockRecorded.push({ method, url, arg, config });
    return Promise.resolve({ data: {} });
  };

  const makeInstance = () => ({
    get: record("get"),
    post: record("post"),
    put: record("put"),
    patch: record("patch"),
    delete: record("delete"),
    interceptors: {
      request: { use: () => {}, eject: () => {} },
      response: { use: () => {}, eject: () => {} },
    },
    defaults: { headers: { common: {} } },
  });

  const shared = makeInstance();
  const api = { ...shared, create: () => shared };
  api.__esModule = true;
  api.default = api;
  return api;
});

const { authAPI } = require("./api");

// A stand-in login token: if any call still puts its argument in the URL,
// this string shows up there.
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.LOGIN-TOKEN-PAYLOAD.SIGNATURE";

beforeEach(() => {
  mockRecorded.length = 0;
});

const last = () => mockRecorded[mockRecorded.length - 1];

const expectNoToken = (req) => {
  expect(req.url).not.toMatch(/[?&]token=/);
  expect(req.url).not.toContain(TOKEN);
  expect(JSON.stringify(req.arg ?? null)).not.toContain(TOKEN);
};

describe("connectMailProvider", () => {
  it.each([
    ["google", "/api/googleauth/google/connect"],
    ["microsoft", "/api/emailsync/microsoft/connect"],
    ["zoho", "/api/emailsync/zoho/connect"],
  ])("%s: POST %s, no token in the URL or body", async (provider, path) => {
    await authAPI.connectMailProvider(provider);

    expect(last().method).toBe("post");
    expect(last().url).toBe(path);
    expectNoToken(last());
  });

  it("refuses an unknown provider without making a request", () => {
    expect(() => authAPI.connectMailProvider("yahoo")).toThrow(/provider/);
    expect(mockRecorded).toHaveLength(0);
  });
});

describe("mailbox calls no longer put the token in the URL", () => {
  // The second argument is what the callers used to pass; it must not reach
  // the URL even if an old caller still passes it.
  it.each([
    ["getMailAccounts", () => authAPI.getMailAccounts(TOKEN), "get", "/api/emailsync/mailaccounts"],
    ["getMailProviders", () => authAPI.getMailProviders(TOKEN), "get", "/api/emailsync/mailaccounts/providers"],
    [
      "discoverImapHost",
      () => authAPI.discoverImapHost("a+b@firm.com", TOKEN),
      "get",
      "/api/emailsync/imap/discover?email=a%2Bb%40firm.com",
    ],
    ["connectImapMailbox", () => authAPI.connectImapMailbox({ email: "a@firm.com" }, TOKEN), "post", "/api/emailsync/imap/connect"],
    ["disconnectImapMailbox", () => authAPI.disconnectImapMailbox("a@firm.com", TOKEN), "post", "/api/emailsync/imap/disconnect"],
    ["disconnectZohoMailbox", () => authAPI.disconnectZohoMailbox("a@firm.com", TOKEN), "post", "/api/emailsync/zoho/disconnect"],
  ])("%s", async (name, call, method, url) => {
    await call();

    expect(last().method).toBe(method);
    expect(last().url).toBe(url);
    expectNoToken(last());
  });

  it("Zoho disconnect names the mailbox in the body, not the URL", async () => {
    await authAPI.disconnectZohoMailbox("Box@Firm.com");

    expect(last().arg).toEqual({ email: "Box@Firm.com" });
    expect(last().url).not.toContain("Box");
  });

  it("IMAP connect still sends the form as the body", async () => {
    const form = { email: "a@firm.com", password: "app-password", host: "imap.firm.com", port: 993 };
    await authAPI.connectImapMailbox(form);

    expect(last().arg).toEqual(form);
  });
});
