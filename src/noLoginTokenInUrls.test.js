// The login token never goes into a URL or the browser console (v1.91.0).
//
// A source scan rather than a render test (render tests are blocked in this
// repo - decisions.md, 2026-10-24). It reads every .js/.jsx file under src and
// fails on a live (not commented-out) line that:
//   - builds a URL with a token parameter: `token=${…}`, `?token=`, `&token=`
//   - logs a token: console.log/info/debug/warn/error(…token…)
//
// Until v1.91.0 the Connect buttons sent the browser to
// /api/googleauth/google?token=<login token>, six mailbox API calls put it on
// the URL too, and two debug lines printed it to the console on every page
// load. nginx's access log, the browser's history and anyone looking at the
// console all had a login good for up to 8 hours.
const fs = require("fs");
const path = require("path");

const SRC = __dirname;

// Copies of the old Account Settings page that nothing imports (only
// pages/Settings/MyAccount is routed, from App.js). They still hold the old
// Gmail line; they are allowed here ONLY while unimported - the last test
// fails the moment one of them is wired in.
const UNROUTED_COPIES = [
  "components/MyAccount.js",
  "pages/Templates/ProposalTemp/Steps/MyAccount.js",
];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(js|jsx)$/.test(entry.name) && !/\.test\.(js|jsx)$/.test(entry.name) ? [full] : [];
  });

const rel = (file) => path.relative(SRC, file).split(path.sep).join("/");

// Lines that run: not `// …`, not inside a /* … */ block.
const liveLines = (file) => {
  const out = [];
  let inBlock = false;

  fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line, i) => {
      let text = line;

      if (inBlock) {
        const end = text.indexOf("*/");
        if (end === -1) return;
        text = text.slice(end + 2);
        inBlock = false;
      }

      const trimmed = text.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

      const start = text.indexOf("/*");
      if (start !== -1 && text.indexOf("*/", start) === -1) {
        inBlock = true;
        text = text.slice(0, start);
      }

      out.push({ n: i + 1, text });
    });

  return out;
};

const TOKEN_IN_URL = /token=\$\{|[?&]token=/i;
const TOKEN_LOGGED = /console\.(log|info|debug|warn|error)\([^)]*\b(token|accessToken|refreshToken|getAccessToken\(\))\b/;

const files = walk(SRC).filter((f) => !UNROUTED_COPIES.includes(rel(f)));

const offending = (pattern) =>
  files.flatMap((f) =>
    liveLines(f)
      .filter(({ text }) => pattern.test(text))
      .map(({ n, text }) => `${rel(f)}:${n}: ${text.trim()}`),
  );

describe("the login token stays out of URLs and the console", () => {
  it("scans the files it should (sanity)", () => {
    const names = files.map(rel);
    expect(names).toContain("services/api.js");
    expect(names).toContain("pages/Settings/MyAccount.js");
    expect(names).toContain("context/AuthContext.js");
  });

  it("no live line puts a token in a URL", () => {
    expect(offending(TOKEN_IN_URL)).toEqual([]);
  });

  it("no live line logs a token", () => {
    expect(offending(TOKEN_LOGGED)).toEqual([]);
  });

  it("the unrouted copies of the old settings page are still imported by nothing", () => {
    const importers = walk(SRC)
      .filter((f) => !UNROUTED_COPIES.includes(rel(f)))
      .flatMap((f) =>
        liveLines(f)
          .filter(({ text }) =>
            /(import|require)\b.*(components\/MyAccount|ProposalTemp\/Steps\/MyAccount)['"]/.test(text),
          )
          .map(({ n }) => `${rel(f)}:${n}`),
      );

    expect(importers).toEqual([]);
  });
});
