// What the admin is told when Send for Sign cannot open the signature screen.
import { signStartErrorToast } from "./signStartError";

const fs = require("fs");
const path = require("path");

const axiosError = (status, data) => ({ response: { status, data } });

describe("signStartErrorToast", () => {
  it("explains an account with no activated contact", () => {
    expect(
      signStartErrorToast(axiosError(400, { error: "No activated contacts found for this account" })),
    ).toEqual({
      title: "No one on this account can sign yet",
      description: "Activate at least one contact on this account, then send for signature again.",
      type: "error",
    });
  });

  it("passes on any other reason the server gives", () => {
    expect(signStartErrorToast(axiosError(404, { error: "Account not found" }))).toEqual({
      title: "Could not open the signature screen",
      description: "Account not found",
      type: "error",
    });
    expect(signStartErrorToast(axiosError(500, { message: "Missing API_KEY" })).description).toBe("Missing API_KEY");
  });

  it("asks to try again when there is no reason (network down, odd answer)", () => {
    const expected = { title: "Could not open the signature screen", description: "Please try again.", type: "error" };

    expect(signStartErrorToast(new Error("Network Error"))).toEqual(expected);
    expect(signStartErrorToast(undefined)).toEqual(expected);
    expect(signStartErrorToast(axiosError(500, "<html>"))).toEqual(expected);
    expect(signStartErrorToast(axiosError(500, { error: { code: 1 } }))).toEqual(expected);
  });
});

// Render tests are blocked in this repo (decisions.md, 2026-10-24), so the
// wiring is checked in the source; commented-out lines are ignored.
describe("Send for Sign wiring", () => {
  const src = fs
    .readFileSync(path.join(__dirname, "FolderTreeView.js"), "utf8")
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");

  it("shows the toast when the signature screen cannot open", () => {
    expect(src).toMatch(/import \{ signStartErrorToast \} from "\.\/signStartError";/);
    expect(src).toMatch(
      /const toggleSignStatus = async \(item\) => \{[\s\S]*?setOpenDialog\(true\);\s*\} catch \(err\) \{\s*console\.error\(err\);\s*showToast\(signStartErrorToast\(err\)\);\s*\}/,
    );
  });
});
