// The signature builder offers only fields named for a signer, so every field
// on the page shows whose it is. Checked in the source because render tests
// are blocked in this repo (decisions.md, 2026-10-24); commented-out lines are
// ignored - this file carries a commented copy of itself.
const fs = require("fs");
const path = require("path");

const builderProps = () => {
  const live = fs
    .readFileSync(path.join(__dirname, "FolderTreeView.js"), "utf8")
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  const start = live.indexOf("<DocusealBuilder");
  return live.slice(start, live.indexOf("/>", start));
};

describe("signature builder fields", () => {
  const props = builderProps();

  it("offers each signer's own fields", () => {
    expect(props).toMatch(/\bfields=\{builderFields\}/);
  });

  it("offers nothing else - no generic Default or Custom field grid", () => {
    expect(props).toMatch(/\bonlyDefinedFields=\{true\}/);
    expect(props).toMatch(/\bwithCustomFieldsTab=\{false\}/);
  });

  it("writes the field's name, the signer, on the box", () => {
    expect(props).toMatch(/\bwithFieldPlaceholder=\{true\}/);
  });

  it("keeps Sign yourself, as chosen", () => {
    expect(props).not.toMatch(/withSignYourselfButton=\{false\}/);
  });
});

// DocuSeal writes a placed field's title - the signer's "Name (email)" -
// inside the box as a placeholder, in light grey at 30% opacity. The builder
// stylesheet makes it dark and bold so it can be read on any page.
describe("signer name on a placed field", () => {
  const css = fs.readFileSync(path.join(__dirname, "docuseal-dark-theme.css"), "utf8");
  const rule = css.match(/\.field-area span\[placeholder\]:empty::before\s*\{([^}]*)\}/);

  it("is dark, bold and a readable size", () => {
    expect(rule).not.toBeNull();
    expect(rule[1]).toMatch(/color:\s*#111827 !important;/);
    expect(rule[1]).toMatch(/font-weight:\s*600 !important;/);
    expect(rule[1]).toMatch(/font-size:\s*12px !important;/);
  });

  it("wraps a long email inside the box rather than running out of it", () => {
    expect(rule[1]).toMatch(/overflow-wrap:\s*anywhere;/);
  });
});
