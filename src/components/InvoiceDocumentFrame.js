// PMS-116: shows invoice-backend's invoice HTML.
// sandbox="" (empty) = no scripts, no forms, no popups, and a unique origin, so
// the document cannot touch this app, its storage or its token. The HTML also
// carries its own CSP (no network, no script).
import React from "react";

const InvoiceDocumentFrame = ({ html, title, height = "calc(100vh - 160px)" }) => {
  if (!html) return null;
  return (
    <iframe
      title={title}
      sandbox=""
      referrerPolicy="no-referrer"
      srcDoc={html}
      style={{ width: "100%", height, border: 0, background: "#eef2f6", borderRadius: 8 }}
    />
  );
};

export default InvoiceDocumentFrame;
