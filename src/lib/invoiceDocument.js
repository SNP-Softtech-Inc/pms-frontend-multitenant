// PMS-116: invoices come from invoice-backend's one template.
// - Download and Print both use the server's PDF, so they are the same
//   document (and the same one the client gets by email).
// - On screen, the server's HTML is shown in a sandboxed iframe
//   (components/InvoiceDocumentFrame).
// Switched on with REACT_APP_INVOICE_RENDERER=new; otherwise the screens keep
// their older jsPDF / HTML builders (invoiceDocuments.js).

export const isNewInvoiceRenderer = (env = process.env) => env.REACT_APP_INVOICE_RENDERER === "new";

export const invoiceFilename = (number) => {
  const safe = String(number ?? "").replace(/[^0-9A-Za-z_-]/g, "");
  return safe ? `invoice_${safe}.pdf` : "invoice.pdf";
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};

// Prints the PDF itself (not a re-drawn page), so Print == Download.
export const printPdfBlob = (blob) => {
  const url = URL.createObjectURL(blob);
  const frame = document.createElement("iframe");
  frame.setAttribute("data-invoice-print", "");
  Object.assign(frame.style, { position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "0" });
  frame.addEventListener("load", () => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch (e) {
      // A browser that cannot print a PDF from a frame: open it instead.
      window.open(url, "_blank", "noopener");
    }
  });
  frame.setAttribute("src", url);
  document.body.appendChild(frame);
  // The print dialog blocks; clean up well after it.
  setTimeout(() => {
    frame.remove();
    URL.revokeObjectURL(url);
  }, 60000);
};
