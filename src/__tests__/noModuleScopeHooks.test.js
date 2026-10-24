// Guards against the bug class that took the whole admin app down.
//
// In v1.48.0 two useState calls landed at MODULE SCOPE in
// FolderTreeView.js, because an edit was anchored on text that matched the
// file's large commented-out copy of itself rather than the live component.
// The file then threw on import:
//
//   TypeError: Cannot read properties of null (reading 'useState')
//
// That is an import-time failure, so it killed every route in the app, not
// just the Documents screen - a white page in production. The build
// succeeded; nothing in the normal pipeline catches it.
//
// This is a static check rather than a render test on purpose: it needs no
// provider tree, cannot be flaky, runs over the whole codebase in a second,
// and catches the fault in files no test renders.
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const SRC = path.join(__dirname, "..");

const collect = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "__tests__") continue;
      collect(full, out);
    } else if (/\.(js|jsx)$/.test(entry.name) && !/\.test\.jsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
};

const files = collect(SRC);

// A hook call is legal inside a function (component or custom hook) and
// nowhere else. getFunctionParent() returning null means module scope.
const findModuleScopeHooks = (code, filename) => {
  const offenders = [];
  let ast;

  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "classProperties", "optionalChaining", "nullishCoalescingOperator", "objectRestSpread"],
      errorRecovery: true,
    });
  } catch (e) {
    // A file that cannot be parsed is a separate problem; report it rather
    // than passing silently.
    return [{ name: "<parse error>", line: 0, message: e.message }];
  }

  traverse(ast, {
    CallExpression(p) {
      const callee = p.node.callee;
      if (callee.type !== "Identifier") return;
      if (!/^use[A-Z]/.test(callee.name)) return;
      if (p.getFunctionParent()) return; // inside a function - fine
      offenders.push({ name: callee.name, line: p.node.loc?.start.line ?? 0 });
    },
  });

  return offenders;
};

// A guard that cannot fail is worthless. These prove the detector actually
// detects, so a green run above means something.
describe("the detector itself", () => {
  it("flags a hook at module scope", () => {
    const bad = `
      import { useState } from "react";
      const [open, setOpen] = useState(false);
      export default function Thing() { return null; }
    `;
    const found = findModuleScopeHooks(bad, "bad.js");
    expect(found).toHaveLength(1);
    expect(found[0].name).toBe("useState");
  });

  it("flags the exact v1.48.0 shape - a hook between two components", () => {
    const bad = `
      function First() { return null; }
      const [showBuilderFor, setShowBuilderFor] = useState(null);
      function Second() { return null; }
    `;
    expect(findModuleScopeHooks(bad, "bad.js")).toHaveLength(1);
  });

  it("allows hooks inside a component", () => {
    const good = `
      import { useState, useEffect } from "react";
      export default function Thing() {
        const [open, setOpen] = useState(false);
        useEffect(() => {}, []);
        return null;
      }
    `;
    expect(findModuleScopeHooks(good, "good.js")).toHaveLength(0);
  });

  it("allows hooks inside a custom hook and an arrow component", () => {
    const good = `
      export const useThing = () => { const [a] = useState(1); return a; };
      const Arrow = () => { useEffect(() => {}, []); return null; };
    `;
    expect(findModuleScopeHooks(good, "good.js")).toHaveLength(0);
  });

  it("does not flag a non-hook function that merely starts with 'use'", () => {
    // `user(...)` is lowercase after "use" - not a hook by the naming rule.
    const good = `const x = user({ id: 1 });`;
    expect(findModuleScopeHooks(good, "good.js")).toHaveLength(0);
  });
});

describe("no React hooks at module scope", () => {
  it("finds source files to check", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it.each(files.map((f) => [path.relative(SRC, f), f]))(
    "%s",
    (rel, full) => {
      const offenders = findModuleScopeHooks(fs.readFileSync(full, "utf8"), rel);

      if (offenders.length) {
        const detail = offenders
          .map((o) => `  line ${o.line}: ${o.name}()${o.message ? " - " + o.message : ""}`)
          .join("\n");
        throw new Error(
          `${rel} calls a hook outside any function.\n${detail}\n\n` +
            "This throws at import time and takes down every route, not just " +
            "this screen. It is usually caused by editing against a textual " +
            "anchor that matched commented-out code - use line-targeted edits " +
            "in the large files. See decisions.md, v1.48.0."
        );
      }
    }
  );
});
