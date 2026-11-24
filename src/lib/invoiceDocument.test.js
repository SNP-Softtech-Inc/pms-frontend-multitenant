// PMS-116: invoices come from invoice-backend's one template. These helpers
// download / print the server's PDF and show its HTML in a sandboxed iframe.
import React from "react";
import { render } from "@testing-library/react";
import {
  isNewInvoiceRenderer,
  invoiceFilename,
  downloadBlob,
  printPdfBlob,
} from "./invoiceDocument";
import InvoiceDocumentFrame from "../components/InvoiceDocumentFrame";

describe("isNewInvoiceRenderer", () => {
  it("is on only when REACT_APP_INVOICE_RENDERER is exactly 'new'", () => {
    expect(isNewInvoiceRenderer({ REACT_APP_INVOICE_RENDERER: "new" })).toBe(true);
    expect(isNewInvoiceRenderer({ REACT_APP_INVOICE_RENDERER: "legacy" })).toBe(false);
    expect(isNewInvoiceRenderer({ REACT_APP_INVOICE_RENDERER: "NEW " })).toBe(false);
    expect(isNewInvoiceRenderer({})).toBe(false);
  });
});

describe("invoiceFilename", () => {
  it("is invoice_<number>.pdf, with anything odd removed", () => {
    expect(invoiceFilename(128)).toBe("invoice_128.pdf");
    expect(invoiceFilename("12/../8")).toBe("invoice_128.pdf");
    expect(invoiceFilename(undefined)).toBe("invoice.pdf");
  });
});

describe("downloadBlob", () => {
  let created;
  let revoked;
  beforeEach(() => {
    created = [];
    revoked = [];
    global.URL.createObjectURL = jest.fn((b) => {
      created.push(b);
      return "blob:fake-1";
    });
    global.URL.revokeObjectURL = jest.fn((u) => revoked.push(u));
  });

  it("saves the blob under the given name and releases the object URL", () => {
    const clicks = [];
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function click() {
      clicks.push({ href: this.getAttribute("href"), download: this.getAttribute("download") });
    });
    jest.useFakeTimers();
    const blob = new Blob(["%PDF-"], { type: "application/pdf" });
    downloadBlob(blob, "invoice_128.pdf");
    expect(created).toEqual([blob]);
    expect(clicks).toEqual([{ href: "blob:fake-1", download: "invoice_128.pdf" }]);
    expect(document.querySelectorAll("a[download]").length).toBe(0); // link removed
    jest.runAllTimers();
    expect(revoked).toEqual(["blob:fake-1"]);
    jest.useRealTimers();
  });
});

describe("printPdfBlob", () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:fake-2");
    global.URL.revokeObjectURL = jest.fn();
  });

  it("loads the PDF in a hidden iframe and prints that same PDF", () => {
    printPdfBlob(new Blob(["%PDF-"], { type: "application/pdf" }));
    const frame = document.querySelector("iframe[data-invoice-print]");
    expect(frame).not.toBeNull();
    expect(frame.getAttribute("src")).toBe("blob:fake-2");
    const print = jest.fn();
    const focus = jest.fn();
    Object.defineProperty(frame, "contentWindow", { value: { print, focus } });
    frame.dispatchEvent(new Event("load"));
    expect(print).toHaveBeenCalledTimes(1);
    frame.remove();
  });
});

describe("InvoiceDocumentFrame", () => {
  it("shows the server's HTML in a fully sandboxed iframe: no scripts, no same-origin", () => {
    const html = "<!DOCTYPE html><html><body><p>Invoice #128</p></body></html>";
    const { container } = render(<InvoiceDocumentFrame html={html} title="Invoice #128" />);
    const frame = container.querySelector("iframe");
    expect(frame.getAttribute("sandbox")).toBe("");
    expect(frame.getAttribute("srcdoc")).toBe(html);
    expect(frame.getAttribute("title")).toBe("Invoice #128");
    expect(frame.getAttribute("referrerpolicy")).toBe("no-referrer");
  });

  it("renders nothing until there is HTML", () => {
    const { container } = render(<InvoiceDocumentFrame html="" title="x" />);
    expect(container.querySelector("iframe")).toBeNull();
  });
});
