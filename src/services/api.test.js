// Tests for URL construction in the API layer.
//
// axios is mocked, so nothing leaves the process and no backend needs to be
// running. What is checked is the URL the app *would* have requested, which
// is exactly where v1.59.0's bug lived.
//
// Two jest details this file has to work around:
//
// 1. jest hoists the jest.mock factory above the file's own declarations and
//    only lets it reference variables whose names begin with "mock" - hence
//    mockRecorded and mockStats.
//
// 2. Create React App sets resetMocks: true, which strips the implementation
//    from every jest.fn before each test. A mock built from jest.fn()
//    therefore loses its body and silently records nothing - it took a
//    diagnostic run to see that. The methods below are plain functions for
//    that reason, and call counts are tracked by hand.
const mockRecorded = [];
const mockStats = { createCalls: 0 };

jest.mock("axios", () => {
  const record = (method) => (url, arg) => {
    mockRecorded.push({ method, url, arg });
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

  // `import axios from "axios"` resolves to `.default`, so the module object
  // and its default must be the same reference.
  const api = {
    ...shared,
    create: () => {
      mockStats.createCalls += 1;
      return shared;
    },
  };
  api.__esModule = true;
  api.default = api;
  return api;
});

const {
  authAPI,
  accountsAPI,
  contactsAPI,
  accountDocsAPI,
  emailSyncAPI,
  esignAPI,
} = require("./api");

beforeEach(() => {
  mockRecorded.length = 0;
});

const lastUrl = () => {
  if (!mockRecorded.length) throw new Error("no request was recorded");
  return mockRecorded[mockRecorded.length - 1].url;
};

describe("authAPI.getAttachmentData - URL encoding", () => {
  // v1.59.0. Gmail attachment ids are base64url and several hundred
  // characters long. One carrying a character with meaning in a URL path was
  // read as part of the route, so the request 404ed or 500ed and looked like
  // a missing document. Not something anyone spots by eye.

  it("encodes a forward slash", async () => {
    await authAPI.getAttachmentData("abc/def");
    expect(lastUrl()).toContain("abc%2Fdef");
    expect(lastUrl()).not.toContain("abc/def");
  });

  it("encodes a plus", async () => {
    await authAPI.getAttachmentData("abc+def");
    expect(lastUrl()).toContain("abc%2Bdef");
  });

  it("encodes trailing base64 padding", async () => {
    await authAPI.getAttachmentData("abcdef==");
    expect(lastUrl()).toContain("abcdef%3D%3D");
  });

  it("leaves an ordinary id alone", async () => {
    await authAPI.getAttachmentData("plainid123");
    expect(lastUrl()).toContain("plainid123");
  });

  it("still targets the attachment route", async () => {
    await authAPI.getAttachmentData("abc/def");
    expect(lastUrl()).toContain("/api/emailsync/attachment/");
  });
});

describe("the API module", () => {
  it("creates a separate axios instance per backend", () => {
    // Each backend has its own base URL from its own REACT_APP_* variable.
    // A single shared instance would send every call to whichever base URL
    // happened to be configured last.
    expect(mockStats.createCalls).toBeGreaterThan(5);
  });

  it("exports the API groups the app imports", () => {
    for (const group of [
      authAPI,
      accountsAPI,
      contactsAPI,
      accountDocsAPI,
      emailSyncAPI,
      esignAPI,
    ]) {
      expect(typeof group).toBe("object");
    }
  });
});
