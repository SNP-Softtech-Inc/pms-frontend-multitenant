// The documents tree refreshes quickly, so a client's upload shows up within
// seconds. Checked in the source because render tests are blocked in this
// repo (decisions.md, 2026-10-24); commented-out lines are ignored - this
// file carries a commented copy of itself.
const fs = require("fs");
const path = require("path");

const liveSource = (file) =>
  fs
    .readFileSync(path.join(__dirname, file), "utf8")
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");

describe("documents tree auto refresh", () => {
  const src = liveSource("FolderTreeView.js");

  it("uses the quick interval, imported from the shared rules", () => {
    expect(src).toMatch(/import \{ keepIfSame, QUICK_INTERVAL_MS \} from "\.\.\/\.\.\/\.\.\/lib\/autoRefresh";/);
    expect(src).toMatch(/useAutoRefresh\(\s*async \(\) => \{[\s\S]{0,200}?\},\s*\{\s*intervalMs: QUICK_INTERVAL_MS,\s*enabled:/);
  });

  it("still sets the tree only when it changed", () => {
    expect(src).toMatch(/setFolderTree\(keepIfSame\(res\?\.data\?\.contents \|\| \[\]\)\);/);
  });
});
