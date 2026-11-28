// The password-reset token stays out of every URL the server sees (v1.92.0).
//
// The emailed link was /admin/reset-password/<id>/<token> and the page posted
// to /api/auth/reset-password/<id>/<token>: nginx logged the token twice.
// signup-login v1.54.0 sends /admin/reset-password#id=<id>&token=<token> - a
// browser never sends what follows '#' - and the page posts the token in the
// body (signup-login v1.53.0). Links in the old form keep working.
const fs = require("fs");
const path = require("path");
const { resetCredentialsFrom, hashWithoutCredentials } = require("./resetLink");

describe("resetCredentialsFrom", () => {
  it("reads a new-style link's id and token after '#'", () => {
    expect(resetCredentialsFrom({}, "#id=abc123&token=eyJ.x.y")).toEqual({ id: "abc123", token: "eyJ.x.y" });
  });

  it("reads an old-style link's id and token from the route", () => {
    expect(resetCredentialsFrom({ id: "abc123", token: "eyJ.x.y" }, "")).toEqual({ id: "abc123", token: "eyJ.x.y" });
  });

  it("prefers the route when both are present", () => {
    expect(resetCredentialsFrom({ id: "r", token: "rt" }, "#id=h&token=ht")).toEqual({ id: "r", token: "rt" });
  });

  it("decodes percent-encoding", () => {
    expect(resetCredentialsFrom({}, "#id=a%2Bb&token=t%3D")).toEqual({ id: "a+b", token: "t=" });
  });

  it("gives empty strings when the link has neither", () => {
    expect(resetCredentialsFrom({}, "")).toEqual({ id: "", token: "" });
    expect(resetCredentialsFrom(undefined, undefined)).toEqual({ id: "", token: "" });
  });
});

describe("hashWithoutCredentials", () => {
  it("drops id and token from the hash, keeping anything else", () => {
    expect(hashWithoutCredentials("#id=a&token=b")).toBe("");
    expect(hashWithoutCredentials("#id=a&token=b&tab=2")).toBe("#tab=2");
    expect(hashWithoutCredentials("")).toBe("");
  });
});

describe("source", () => {
  const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
  const live = (text) => text.split(/\r?\n/).filter((l) => !/^\s*\/\//.test(l)).join("\n");

  it("the API call puts no id or token in the URL", () => {
    const api = live(read("services/api.js"));
    expect(api).not.toMatch(/reset-password\/\$\{/);
    expect(api).toMatch(/post\(\s*["'`]\/api\/auth\/reset-password["'`]\s*,/);
  });

  it("the page reads the token through resetLink and clears it from the address bar", () => {
    const page = live(read("login-signup/ResetPassword.js"));
    expect(page).toMatch(/resetCredentialsFrom\(/);
    expect(page).toMatch(/history\.replaceState\(/);
  });

  it("App routes the new link (no id/token in the path) and still the old one", () => {
    const app = live(read("App.js"));
    expect(app).toMatch(/path="\/reset-password"\s/);
    expect(app).toMatch(/path="\/reset-password\/:id\/:token"/);
  });
});
