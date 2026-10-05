import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FileSignature } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { esignAPI } from "../../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
const Signatures = () => {
  const { accountId } = useParams();
  console.log("accoiunt id for sign", accountId);
  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
  const [signatureList, setSignatureList] = useState([]);
  const { data } = useParams();
  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await esignAPI.getSignatureList(accountId);

        console.log("Signature list response:", res);

        setSignatureList(res.data || []);
      } catch (error) {
        console.error("Error fetching signatures:", error);
      }
    };

    if (accountId) {
      fetchSignatures();
    }
  }, [accountId]);
  // EsignRequest.status is one of pending / in_progress / completed. Only
  // "completed" and "pending" were matched here, so a partially signed
  // document ("in_progress") fell through to the neutral grey and read as
  // having no status at all.
  const statusStyles = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "signed" || s === "signaturecompleted")
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (s === "rejected" || s === "declined" || s === "cancelled")
      return "bg-red-50 text-red-700 border border-red-200";
    if (s === "in_progress" || s === "partiallysigned")
      return "bg-sky-50 text-sky-700 border border-sky-200";
    if (s === "pending" || s === "sent" || s === "opened" || s === "pendingsignature")
      return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  // The raw value was printed straight into the cell, so the column read
  // "pending" and "in_progress" rather than naming the state.
  const statusLabel = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "signed" || s === "signaturecompleted")
      return "Signed";
    if (s === "in_progress" || s === "partiallysigned") return "Partially Signed";
    if (s === "pending" || s === "sent" || s === "opened" || s === "pendingsignature")
      return "Pending Signature";
    if (s === "declined" || s === "rejected") return "Declined";
    if (s === "cancelled") return "Cancelled";
    return status || "—";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";

    // Folder metadata stores an already-formatted date such as "SEP-28-2026",
    // which new Date() does not parse reliably. Pass it straight through.
    if (typeof dateStr === "string" && /^[A-Z]{3}-\d{2}-\d{4}$/.test(dateStr)) {
      return dateStr;
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";

    const month = d.toLocaleString("en-US", { month: "short" });
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    const currentYear = new Date().getFullYear();

    return year === currentYear ? `${month}-${day}` : `${month}-${day}-${year}`;
  };

  const getSignedAt = (record) => {
    if (!record?.submitters?.length) return null;
    const completedDates = record.submitters
      .map((s) => s.completed_at)
      .filter(Boolean)
      .map((d) => new Date(d).getTime());
    if (!completedDates.length) return null;
    return new Date(Math.max(...completedDates));
  };

  const getRequestedAt = (record) => {
    if (!record?.submitters?.length) return record?.createdAt || null;
    const sentDates = record.submitters
      .map((s) => s.sent_at)
      .filter(Boolean)
      .map((d) => new Date(d).getTime());
    if (!sentDates.length) return record?.createdAt || null;
    return new Date(Math.min(...sentDates));
  };
  // const formatDate = (dateStr) => {
  //   if (!dateStr) return "—";
  //   const d = new Date(dateStr);
  //   if (isNaN(d.getTime())) return "—";
  //   return d.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   }) + ", " + d.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  // const getSignedAt = (record) => {
  //   if (!record?.submitters?.length) return null;
  //   const completedDates = record.submitters
  //     .map((s) => s.completed_at)
  //     .filter(Boolean)
  //     .map((d) => new Date(d).getTime());
  //   if (!completedDates.length) return null;
  //   return new Date(Math.max(...completedDates));
  // };
  return (
    <div className="p-4 md:p-6 bg-background min-h-full">
      {/* Header */}
      <div className="mb-5">
        <h2
          className="text-base font-semibold text-foreground"
          style={{
            fontFamily: "var(--font-family)",
            fontSize: "calc(1rem * parseFloat(var(--font-scale)) / 100)",
          }}
        >
          Signatures
        </h2>

        <p
          className="mt-1 text-muted-foreground"
          style={{
            fontFamily: "var(--font-family)",
            fontSize: "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
          }}
        >
          E-signature requests for this account
        </p>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            {/* Header - mirrors Approvals.js so the two tabs stay in sync */}
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                {[
                  "Document Name",
                  "Status",
                  "Date Uploaded",
                  "Date Requested",
                  "Date Signed",
                ].map((heading) => (
                  <TableHead
                    key={heading}
                    className="
                      px-4 py-3
                      text-left
                      uppercase
                      tracking-wide
                      text-muted-foreground
                      font-semibold
                      whitespace-nowrap
                    "
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "calc(0.72rem * parseFloat(var(--font-scale)) / 100)",
                    }}
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-border">
              {signatureList.length > 0 ? (
                signatureList.map((signautrelist, index) => (
                  <TableRow
                    key={signautrelist._id || index}
                    className="
                      transition-colors
                      hover:bg-muted/30
                    "
                  >
                    {/* File Name */}
                    <TableCell
                      className="px-4 py-3 font-medium text-foreground"
                      style={{
                        fontFamily: "var(--font-family)",
                        fontSize:
                          "calc(0.88rem * parseFloat(var(--font-scale)) / 100)",
                      }}
                    >
                      {/* The name itself opens the document, so the signed
                          result can be checked without hunting for an icon.
                          Opened straight from the click with no await first,
                          so the browser does not block the tab. */}
                      {signautrelist.fileUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              signautrelist.fileUrl,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                          title="Open document in a new tab"
                          className="text-left underline-offset-2 hover:underline hover:text-primary"
                        >
                          {signautrelist.filename || "—"}
                        </button>
                      ) : (
                        signautrelist.filename || "—"
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3">
                      <span
                        className={`
                          inline-flex items-center
                          rounded-full
                          px-2.5 py-1
                          text-[11px]
                          font-semibold
                          ring-1 ring-inset
                          ${statusStyles(signautrelist.status)}
                        `}
                        style={{
                          fontFamily: "var(--font-family)",
                        }}
                      >
                        {statusLabel(signautrelist.status)}
                      </span>
                    </TableCell>

                    {/* Date Uploaded */}
                    <TableCell
                      className="
                        whitespace-nowrap
                        px-4 py-3
                        text-muted-foreground
                      "
                      style={{
                        fontFamily: "var(--font-family)",
                        fontSize:
                          "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                      }}
                    >
                      {/* The document's own upload date when we have it.
                          Requests raised before that was captured fall back
                          to the request date, which is what this column
                          always showed. */}
                      {formatDate(
                        signautrelist.documentUploadedAt ||
                          signautrelist.createdAt,
                      )}
                    </TableCell>

                    {/* Date Requested */}
                    <TableCell
                      className="
                        whitespace-nowrap
                        px-4 py-3
                        text-muted-foreground
                      "
                      style={{
                        fontFamily: "var(--font-family)",
                        fontSize:
                          "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                      }}
                    >
                      {formatDate(getRequestedAt(signautrelist))}
                    </TableCell>

                    {/* Date Signed */}
                    <TableCell
                      className="
                        whitespace-nowrap
                        px-4 py-3
                        text-muted-foreground
                      "
                      style={{
                        fontFamily: "var(--font-family)",
                        fontSize:
                          "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                      }}
                    >
                      {formatDate(getSignedAt(signautrelist))}
                    </TableCell>


                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {/* colSpan must cover all five columns, otherwise the empty
                      state is centred over only part of the table. */}
                  <TableCell colSpan={5} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="
                          flex h-12 w-12 items-center justify-center
                          rounded-full
                          border border-border
                          bg-muted/40
                        "
                      >
                        <FileSignature
                          size={18}
                          className="text-muted-foreground/50"
                        />
                      </div>

                      <div className="space-y-1">
                        <p
                          className="font-medium text-foreground"
                          style={{
                            fontFamily: "var(--font-family)",
                            fontSize:
                              "calc(0.9rem * parseFloat(var(--font-scale)) / 100)",
                          }}
                        >
                          No signatures found
                        </p>

                        <p
                          className="text-muted-foreground"
                          style={{
                            fontFamily: "var(--font-family)",
                            fontSize:
                              "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
                          }}
                        >
                          Signature requests will appear here.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Signatures;
