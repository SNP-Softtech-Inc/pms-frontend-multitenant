// PMS-116: the create/edit invoice preview, drawn by invoice-backend from the
// one invoice template - the same design the client sees and the email, print
// and download carry. Shown in a sandboxed iframe (InvoiceDocumentFrame).
// Used by PreviewDrawer when REACT_APP_INVOICE_RENDERER=new.
import React, { useEffect, useState } from "react";
import { X, Send, ChevronLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InvoiceDocumentFrame from "../../../components/InvoiceDocumentFrame";
import { invoiceAPI } from "../../../services/api";

const ServerInvoicePreview = ({ data, onClose, onSave }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const key = JSON.stringify(data);

  useEffect(() => {
    let cancelled = false;
    setError("");
    invoiceAPI
      .previewInvoiceHtml(JSON.parse(key))
      .then((res) => {
        if (!cancelled) setHtml(typeof res.data === "string" ? res.data : "");
      })
      .catch(() => {
        if (!cancelled) setError("The preview could not be loaded. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[900px] lg:w-[1000px] bg-background border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Invoice Preview</h2>
              <p className="text-sm text-muted-foreground">Exactly as the client will see it</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-muted/30 p-4">
          {error ? (
            <p className="text-sm text-destructive p-4">{error}</p>
          ) : html ? (
            <InvoiceDocumentFrame html={html} title="Invoice preview" height="100%" />
          ) : (
            <p className="text-sm text-muted-foreground p-4">Loading preview…</p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-background shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSave} className="gap-2">
            <Send className="h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerInvoicePreview;
