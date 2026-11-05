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

describe("accountDocsAPI - migration import (v1.67.0)", () => {
  const last = () => mockRecorded[mockRecorded.length - 1];

  it("asks what is already there", async () => {
    const body = { accountId: "a1", files: [{ path: "2023/a.pdf", size: 3 }], folders: ["2023"] };
    await accountDocsAPI.importPrepare(body);
    expect(last()).toMatchObject({ method: "post", url: "/accounts/docs/import/prepare", arg: body });
  });

  it("sends one file, with the account and the path in the query - not the body", async () => {
    // The server checks both before reading a byte of the file, which it can
    // only do if they arrive ahead of it.
    await accountDocsAPI.importFile("a1", "2023/Taxes/W-2.pdf", new Blob(["x"]));

    const { url, arg, config } = last();
    expect(url).toBe("/accounts/docs/import/file");
    expect(config.params).toEqual({ accountId: "a1", path: "2023/Taxes/W-2.pdf" });
    expect(arg).toBeInstanceOf(FormData);
    expect([...arg.keys()]).toEqual(["file"]);
    expect(arg.get("file").name).toBe("W-2.pdf");
  });

  it("marks the account complete", async () => {
    await accountDocsAPI.importFinish("a1");
    expect(last()).toMatchObject({ url: "/accounts/docs/import/finish", arg: { accountId: "a1" } });
  });
});
