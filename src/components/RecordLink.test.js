// Right-click "Open link in new tab / new window" on records (v1.85.0).
// Contacts, folders and some document names were buttons or clickable divs,
// so the browser had no link to offer. RecordLink is a real link: a plain
// click does what the screen always did, anything else is the browser's.
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import RecordLink from "./RecordLink";
import { isPlainLeftClick, ancestorPaths, withQuery } from "../lib/recordLinks";

const Where = () => <div data-testid="where">{useLocation().pathname + useLocation().search}</div>;

const renderAt = (ui) =>
  render(
    <MemoryRouter initialEntries={["/clients/contacts"]}>
      <Routes>
        <Route path="*" element={<>{ui}<Where /></>} />
      </Routes>
    </MemoryRouter>
  );

describe("isPlainLeftClick", () => {
  it("is a left click with no modifier key", () => {
    expect(isPlainLeftClick({ button: 0 })).toBe(true);
  });

  it("is not a click the browser should handle itself", () => {
    expect(isPlainLeftClick({ button: 0, ctrlKey: true })).toBe(false);
    expect(isPlainLeftClick({ button: 0, metaKey: true })).toBe(false);
    expect(isPlainLeftClick({ button: 0, shiftKey: true })).toBe(false);
    expect(isPlainLeftClick({ button: 0, altKey: true })).toBe(false);
    expect(isPlainLeftClick({ button: 1 })).toBe(false);
    expect(isPlainLeftClick(null)).toBe(false);
  });
});

describe("ancestorPaths", () => {
  it("lists every folder down to the one asked for, below the account", () => {
    expect(ancestorPaths("acc1/Firm docs shared with client/E-File Authorization")).toEqual([
      "acc1/Firm docs shared with client",
      "acc1/Firm docs shared with client/E-File Authorization",
    ]);
  });

  it("copes with a top-level path and with nothing", () => {
    expect(ancestorPaths("acc1")).toEqual(["acc1"]);
    expect(ancestorPaths("")).toEqual([]);
    expect(ancestorPaths(null)).toEqual([]);
  });
});

describe("withQuery", () => {
  it("adds one encoded parameter", () => {
    expect(withQuery("/a/b", "folder", "acc/Firm docs/E-File & Co")).toBe(
      "/a/b?folder=acc%2FFirm%20docs%2FE-File%20%26%20Co"
    );
  });
});

describe("RecordLink", () => {
  it("is a real link to the record, so the browser can open it in a new tab", () => {
    renderAt(<RecordLink to="/clients/contacts?contact=c1">Basha</RecordLink>);

    const link = screen.getByRole("link", { name: "Basha" });
    expect(link).toHaveAttribute("href", "/clients/contacts?contact=c1");
  });

  it("does what the screen always did on a plain click, without navigating", () => {
    const onOpen = jest.fn();
    const parent = jest.fn();
    renderAt(
      <div onClick={parent}>
        <RecordLink to="/clients/contacts?contact=c1" onOpen={onOpen}>Basha</RecordLink>
      </div>
    );

    fireEvent.click(screen.getByRole("link", { name: "Basha" }), { button: 0 });

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(parent).not.toHaveBeenCalled();
    expect(screen.getByTestId("where")).toHaveTextContent("/clients/contacts");
    expect(screen.getByTestId("where")).not.toHaveTextContent("contact=c1");
  });

  it("leaves Ctrl/Cmd/Shift-click to the browser and does not also act in this tab", () => {
    const onOpen = jest.fn();
    const parent = jest.fn();
    renderAt(
      <div onClick={parent}>
        <RecordLink to="/clients/contacts?contact=c1" onOpen={onOpen}>Basha</RecordLink>
      </div>
    );
    const link = screen.getByRole("link", { name: "Basha" });

    fireEvent.click(link, { button: 0, ctrlKey: true });
    fireEvent.click(link, { button: 0, metaKey: true });
    fireEvent.click(link, { button: 0, shiftKey: true });

    expect(onOpen).not.toHaveBeenCalled();
    expect(parent).not.toHaveBeenCalled();
  });

  it("navigates normally when there is nothing special to do on a click", () => {
    renderAt(<RecordLink to="/clients/accounts/accountsdash/overview/a1">Acme</RecordLink>);

    fireEvent.click(screen.getByRole("link", { name: "Acme" }), { button: 0 });

    expect(screen.getByTestId("where")).toHaveTextContent("/clients/accounts/accountsdash/overview/a1");
  });

  it("links to a file outside the app in a new tab", () => {
    renderAt(<RecordLink href="https://files.test/uploads/a.pdf" newTab>a.pdf</RecordLink>);

    const link = screen.getByRole("link", { name: "a.pdf" });
    expect(link).toHaveAttribute("href", "https://files.test/uploads/a.pdf");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
