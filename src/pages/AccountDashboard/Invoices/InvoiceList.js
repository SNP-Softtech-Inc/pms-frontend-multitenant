import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useToastContext } from "../../../context/ToastContext";
import { useParams } from "react-router-dom";
import { invoiceAPI, accountsAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import CreateInvoiceDrawer from "./CreateInvoiceDrawer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import logo from "../../../Images/snp.png";
import { buildInvoicePDF, buildInvoicePrintHTML } from "./invoiceDocuments";
import PayInvoice from "./payInvoiceDrawer";
import { Card, CardContent } from "../../../components/ui/card";
import { useQuery } from "@tanstack/react-query";
const InvoiceTable = () => {
  const { accountId } = useParams();
  const { showToast } = useToastContext();
  const confirm = useConfirm();
  // const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState(null);
  // const [account, setAccount] = useState(null);
  // Check if an invoice is overdue
  const isInvoiceOverdue = (invoice, paymentTermDays = 5) => {
    if (!invoice.invoicedate || invoice.invoiceStatus === "Paid") return false;

    const invoiceDate = new Date(invoice.invoicedate);
    const today = new Date();

    // Skip invoices created today
    if (
      invoiceDate.getFullYear() === today.getFullYear() &&
      invoiceDate.getMonth() === today.getMonth() &&
      invoiceDate.getDate() === today.getDate()
    ) {
      return false;
    }

    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTermDays);

    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const dueDateOnly = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
    );

    const isUnpaid = invoice.invoiceStatus === "Pending";

    // Use balanceDueAmount if set, otherwise fallback to total
    const balance = invoice.balanceDueAmount ?? invoice.summary?.total ?? 0;
    const hasBalanceDue = balance > 0;

    return todayDateOnly > dueDateOnly && isUnpaid && hasBalanceDue;
  };

  const {
    data: account,
    isLoading: accountLoading,
    refetch: refetchAccount,
  } = useQuery({
    queryKey: ["account-details", accountId],
    queryFn: async () => {
      const res = await accountsAPI.getAccountById(accountId);
      return res.data;
    },
    enabled: !!accountId,
    refetchOnWindowFocus: true,
  });
  //   const fetchAccountDetails = async () => {
  //   try {
  //     const res = await accountsAPI.getAccountById(accountId);
  //     setAccount(res.data);
  //     console.log("selcted accounts details",res.data)
  //   } catch (err) {
  //     console.error("Error fetching account details:", err);
  //   }
  // };

  // Fetch invoices and update overdue status safely
  // const fetchInvoices = async () => {
  //   try {
  //     const res = await invoiceAPI.getInvoiceListByAccountId(accountId);
  //     console.log("Fetched invoices:", res.data);

  //     if (res.data?.invoice) {
  //       const updatedInvoices = await Promise.all(
  //         res.data.invoice.map(async (invoice) => {
  //           const overdue = isInvoiceOverdue(invoice);

  //           // Only update if overdue AND not already overdue
  //           if (overdue && invoice.invoiceStatus !== "Overdue") {
  //             try {
  //               await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, {
  //                 invoiceStatus: "Overdue",
  //               });
  //               return { ...invoice, invoiceStatus: "Overdue" };
  //             } catch (err) {
  //               console.error("Failed to update invoice status:", err);
  //               return invoice; // fallback to original
  //             }
  //           }

  //           return invoice;
  //         }),
  //       );

  //       setAccountInvoicesData(updatedInvoices);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     showToast({
  //       title: "Failed to fetch invoices",
  //       type: "error",
  //     });
  //   }
  // };

  // useEffect(() => {
  //   fetchInvoices();
  //     // fetchAccountDetails();

  // }, [accountId]);
  const {
    data: accountInvoicesData = [],
    isLoading: invoiceLoading,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["account-invoices", accountId],
    queryFn: async () => {
      const res = await invoiceAPI.getInvoiceListByAccountId(accountId);

      const updatedInvoices = await Promise.all(
        (res.data?.invoice || []).map(async (invoice) => {
          const overdue = isInvoiceOverdue(invoice);

          if (overdue && invoice.invoiceStatus !== "Overdue") {
            try {
              await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, {
                invoiceStatus: "Overdue",
              });

              return {
                ...invoice,
                invoiceStatus: "Overdue",
              };
            } catch (err) {
              console.error("Failed to update invoice status:", err);
              return invoice;
            }
          }

          return invoice;
        }),
      );

      return updatedInvoices;
    },
    enabled: !!accountId,
    refetchOnWindowFocus: true,
  });
  // Menu handlers
  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    confirm({
      title: "Delete Invoice",
      description:
        "Are you sure you want to delete this invoice? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await invoiceAPI.deleteInvoice(id);
          showToast({
            title: "Deleted successfully",
            type: "success",
          });

          refetchInvoices();
        } catch (err) {
          showToast({
            title: "Delete failed",
            type: "error",
          });
        }
      },
    });
  };

  // Duplicate
  const handleDuplicate = async (id) => {
    const invoice = accountInvoicesData.find((i) => i._id === id);
    if (!invoice) return;

    try {
      await invoiceAPI.createInvoice({
        ...invoice,
        invoiceLabel: "Copy",
      });

      showToast({
        title: "Duplicated successfully",
        type: "success",
      });
      refetchInvoices();
      handleMenuClose();
    } catch {
      showToast({
        title: "Duplicate failed",
        type: "error",
      });
    }
  };

  //print
 
// const handlePrint = async (_id) => {
//   try {
//     const res = await invoiceAPI.getInvoiceForPrint(_id);

//     const invoice = res.data.invoice;
//     const account = invoice.account || {};
//     const summary = invoice.summary || {};

//     const isPaid = invoice.invoiceStatus?.toLowerCase() === "paid";

//     // Escape HTML values
//     const escapeHTML = (value) =>
//       String(value ?? "")
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#39;");

//     const formatDate = (date) =>
//       date ? new Date(date).toLocaleDateString() : "-";

//     const formatAmount = (amount) =>
//       `$${Number(amount || 0).toFixed(2)}`;

//     const lineItems = (invoice.lineItems || [])
//       .map(
//         (item) => `
//           <tr>
//             <td>${escapeHTML(item.productorService)}</td>
//             <td>${formatAmount(item.rate)}</td>
//             <td>${escapeHTML(item.quantity)}</td>
//             <td>${formatAmount(item.amount)}</td>
//           </tr>
//         `
//       )
//       .join("");

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Invoice_${escapeHTML(invoice.invoicenumber)}</title>

//         <style>
//           @page {
//             size: A4;
//             margin: 12mm;
//           }

//           * {
//             box-sizing: border-box;
//           }

//           body {
//             font-family: Arial, Helvetica, sans-serif;
//             color: #222;
//             margin: 0;
//             padding: 0;
//             font-size: 12px;
//             position: relative;
//           }

//           .invoice-container {
//             width: 100%;
//             position: relative;
//             background: #fff;
//           }

//           /* HEADER */

//           .header {
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-start;
//             min-height: 55px;
//           }

//           .logo {
//             width: 130px;
//             height: auto;
//             max-height: 70px;
//             object-fit: contain;
//           }

//           .company-details {
//             text-align: right;
//             line-height: 1.6;
//             font-size: 10px;
//           }

//           .company-details h2 {
//             font-size: 18px;
//             margin: 0 0 4px;
//           }

//           .divider {
//             border: none;
//             border-top: 2px solid #1e88e5;
//             margin: 12px 0 20px;
//           }

//           /* INVOICE TITLE */

//           .invoice-title {
//             font-size: 28px;
//             font-weight: bold;
//             margin-bottom: 25px;
//           }

//           /* BILL TO + INVOICE DETAILS */

//           .details {
//             display: flex;
//             justify-content: space-between;
//             gap: 20px;
//             margin-bottom: 20px;
//           }

//           .bill-to {
//             width: 55%;
//             line-height: 1.7;
//             overflow-wrap: anywhere;
//           }

//           .invoice-info {
//             width: 45%;
//           }

//           .section-title {
//             font-size: 13px;
//             font-weight: bold;
//             margin-bottom: 8px;
//           }

//           .info-row {
//             display: flex;
//             justify-content: space-between;
//             gap: 10px;
//             margin-bottom: 8px;
//           }

//           .info-row strong {
//             min-width: 65px;
//           }

//           .info-row span {
//             text-align: right;
//             overflow-wrap: anywhere;
//           }

//           /* DESCRIPTION */

//           .description {
//             margin: 20px 0;
//             line-height: 1.6;
//             overflow-wrap: anywhere;
//           }

//           /* TABLE */

//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 15px;
//             position: relative;
//             z-index: 1;
//           }

//           thead {
//             display: table-header-group;
//           }

//           tr {
//             page-break-inside: avoid;
//           }

//           th {
//             background-color: #1976d2;
//             color: #fff;
//             font-weight: bold;
//             padding: 11px 8px;
//             text-align: left;
//             border: 1px solid #ddd;
//           }

//           td {
//             padding: 10px 8px;
//             border: 1px solid #ddd;
//             overflow-wrap: anywhere;
//           }

//           tbody tr:nth-child(even) {
//             background-color: #f8f8f8;
//           }

//           /* TOTALS */

//           .summary {
//             width: 240px;
//             margin-left: auto;
//             margin-top: 20px;
//             position: relative;
//             z-index: 1;
//           }

//           .summary-row {
//             display: flex;
//             justify-content: space-between;
//             padding: 6px 0;
//           }

//           .total-row {
//             font-size: 16px;
//             font-weight: bold;
//             border-top: 1px solid #ccc;
//             margin-top: 8px;
//             padding-top: 12px;
//           }

//           /* PAID WATERMARK */

//           .paid-watermark {
//             position: fixed;
//             top: 40%;
//             left: 50%;
//             transform: translate(-50%, -50%) rotate(-30deg);
//             font-size: 90px;
//             font-weight: bold;
//             color: rgba(200, 0, 0, 0.15);
//             z-index: 0;
//             pointer-events: none;
//           }

//           @media print {
//             body {
//               -webkit-print-color-adjust: exact;
//               print-color-adjust: exact;
//             }

//             .invoice-container {
//               width: 100%;
//             }
//           }
//         </style>
//       </head>

//       <body>
//         <div class="invoice-container">

//           ${
//             isPaid
//               ? `<div class="paid-watermark">PAID</div>`
//               : ""
//           }

//           <!-- HEADER -->

//           <div class="header">
//             <div>
//               <img src="${logo}" class="logo" />
//             </div>

//             <div class="company-details">
//               <h2>SNP Tax & Financials</h2>
//               <div>3015 Hopyard Rd, Ste M Pleasanton, CA 94588 </div>
//               <div>(925) 800-3561</div>
//               <div>silpa@snptaxandfinancials.com</div>
//               <div>http://www.snptaxandfinancials.com</div>
//             </div>
//           </div>

//           <hr class="divider" />

//           <!-- INVOICE TITLE -->

//           <div class="invoice-title">INVOICE</div>

//           <!-- BILL TO + INVOICE DETAILS -->

//           <div class="details">

//             <div class="bill-to">
//               <div class="section-title">Bill To</div>

//               <div>${escapeHTML(account.accountName)}</div>
//               <div>${escapeHTML(account.contactName)}</div>
//               <div>${escapeHTML(account.email)}</div>
//               <div>${escapeHTML(account.streetAddress)}</div>
//             </div>

//             <div class="invoice-info">

//               <div class="info-row">
//                 <strong>Invoice #</strong>
//                 <span>${escapeHTML(invoice.invoicenumber)}</span>
//               </div>

//               <div class="info-row">
//                 <strong>Date</strong>
//                 <span>${formatDate(invoice.invoicedate)}</span>
//               </div>

//               <div class="info-row">
//                 <strong>Status</strong>
//                 <span>${escapeHTML(invoice.invoiceStatus || "-")}</span>
//               </div>

//               <div class="info-row">
//                 <strong>Paid Date</strong>
//                 <span>
//                   ${
//                     isPaid
//                       ? formatDate(invoice.updatedAt)
//                       : "-"
//                   }
//                 </span>
//               </div>

//             </div>
//           </div>

//           <!-- DESCRIPTION -->

//           <div class="description">
//             <strong>Description</strong>
//             <div>${escapeHTML(invoice.description || "-")}</div>
//           </div>

//           <!-- PRODUCT / SERVICE TABLE -->

//           <table>
//             <thead>
//               <tr>
//                 <th>Product/Service</th>
//                 <th>Rate</th>
//                 <th>Quantity</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>

//             <tbody>
//               ${lineItems}
//             </tbody>
//           </table>

//           <!-- SUMMARY -->

//           <div class="summary">

//             <div class="summary-row">
//               <span>Subtotal</span>
//               <span>${formatAmount(summary.subtotal)}</span>
//             </div>

//             <div class="summary-row">
//               <span>Tax</span>
//               <span>${formatAmount(summary.taxTotal)}</span>
//             </div>

//             <div class="summary-row total-row">
//               <span>TOTAL</span>
//               <span>${formatAmount(summary.total)}</span>
//             </div>

//           </div>

//         </div>
//       </body>
//       </html>
//     `;

//     // Create a hidden iframe for printing
//     const iframe = document.createElement("iframe");

//     iframe.style.position = "fixed";
//     iframe.style.width = "0";
//     iframe.style.height = "0";
//     iframe.style.border = "0";
//     iframe.style.right = "0";
//     iframe.style.bottom = "0";

//     document.body.appendChild(iframe);

//     const printDoc = iframe.contentWindow.document;

//     printDoc.open();
//     printDoc.write(printContent);
//     printDoc.close();

//     // Wait for the logo and document to load before printing
//     iframe.onload = async () => {
//       const images = Array.from(printDoc.images);

//       await Promise.all(
//         images.map((img) => {
//           if (img.complete) return Promise.resolve();

//           return new Promise((resolve) => {
//             img.onload = resolve;
//             img.onerror = resolve;
//           });
//         })
//       );

//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();

//       handleMenuClose();
//     };

//   } catch (error) {
//     console.error("Error printing invoice:", error);

//     showToast({
//       title: "Failed to print invoice",
//       type: "error",
//     });
//   }
// };

// DOWNLOAD
const handleDownload = async (_id) => {
  try {
    const res = await invoiceAPI.getInvoiceForPrint(_id);
    const invoice = res.data.invoice;

    const doc = buildInvoicePDF(invoice, { logo });
    doc.save(`Invoice_${invoice.invoicenumber}.pdf`);

    showToast({ title: "Invoice downloaded successfully", type: "success" });
    handleMenuClose();
  } catch (error) {
    console.error("Error downloading invoice:", error);
    showToast({ title: "Failed to download invoice", type: "error" });
  }
};

// PRINT
const handlePrint = async (_id) => {
  try {
    const res = await invoiceAPI.getInvoiceForPrint(_id);
    const invoice = res.data.invoice;

    const printContent = buildInvoicePrintHTML(invoice, { logo });

    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      position: "fixed",
      width: "0",
      height: "0",
      border: "0",
      right: "0",
      bottom: "0",
    });
    document.body.appendChild(iframe);

    const printDoc = iframe.contentWindow.document;
    printDoc.open();
    printDoc.write(printContent);
    printDoc.close();

    const images = Array.from(printDoc.images);
    await Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            })
      )
    );

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // remove the iframe after the print dialog closes
    setTimeout(() => iframe.remove(), 1000);

    handleMenuClose();
  } catch (error) {
    console.error("Error printing invoice:", error);
    showToast({ title: "Failed to print invoice", type: "error" });
  }
};
  const [payDrawerOpen, setPayDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setPayDrawerOpen(true);
  };
  //download
  // const handleDownload = async (_id) => {
  //   try {
  //     // ✅ Fetch data using API
  //     const res = await invoiceAPI.getInvoiceForPrint(_id);
  //     const invoiceData = res.data;

  //     const invoice = invoiceData.invoice;
  //     console.log("Invoice data for download:", invoice);
  //     const accountName = invoice.account?.accountName || "Unknown Account";

  //     const doc = new jsPDF();
  //     const pageWidth = doc.internal.pageSize.getWidth();

  //     doc.addImage(logo, "PNG", 15, 10, 35, 18); // logo
  //     // ================= HEADER =================
  //     // doc.setFontSize(16);
  //     // doc.setFont(undefined, "bold");
  //     // doc.text(`Invoice #${invoice.invoicenumber}`, 10, 10);
  //     doc.setFontSize(18);
  //     doc.setFont(undefined, "bold");
  //     doc.text("SNP Tax & Financials", pageWidth - 15, 15, {
  //       align: "right",
  //     });

  //     doc.setFontSize(10);
  //     doc.setFont(undefined, "normal");

  //     doc.text(
  //       "3015 Hopyard Rd, Ste M Pleasanton, CA 94588 ",
  //       pageWidth - 15,
  //       22,
  //       {
  //         align: "right",
  //       },
  //     );

  //     doc.text("(925) 800-3561", pageWidth - 15, 27, {
  //       align: "right",
  //     });

  //     doc.text("silpa@snptaxandfinancials.com", pageWidth - 15, 32, {
  //       align: "right",
  //     });

  //     doc.text("http://www.snptaxandfinancials.com", pageWidth - 15, 37, {
  //       align: "right",
  //     });

  //     doc.setDrawColor(30, 136, 229);
  //     doc.line(10, 45, 200, 45);

  //     doc.setFontSize(24);
  //     doc.setFont(undefined, "bold");

  //     doc.text("INVOICE", 15, 58);
  //     doc.setFontSize(12);
  //     doc.setFont(undefined, "normal");
  //     // doc.text(
  //     //   `Date: ${new Date(invoice.invoicedate).toLocaleDateString()}`,
  //     //   10,
  //     //   20,
  //     // );

  //     const account = invoice.account || {};

  //     doc.setFontSize(12);
  //     doc.setFont(undefined, "bold");

  //     doc.text("Bill To", 15, 72);

  //     doc.setFont(undefined, "normal");

  //     doc.text(account.accountName || "", 15, 80);

  //     doc.text(account.contactName || "", 15, 86);

  //     doc.text(account.email || "", 15, 92);

  //     doc.text(account.streetAddress || "", 15, 98);
  //     doc.setFont(undefined, "bold");

  //     doc.text("Invoice #", 140, 72);

  //     doc.setFont(undefined, "normal");

  //     doc.text(String(invoice.invoicenumber), 175, 72);

  //     doc.setFont(undefined, "bold");

  //     doc.text("Date", 140, 80);

  //     doc.setFont(undefined, "normal");

  //     doc.text(new Date(invoice.invoicedate).toLocaleDateString(), 175, 80);

  //     doc.setFont(undefined, "bold");

  //     doc.text("Status", 140, 88);

  //     doc.setFont(undefined, "normal");

  //     doc.text(invoice.invoiceStatus || "-", 175, 88);

  //     doc.setFont(undefined, "bold");

  //     doc.text("Paid Date", 140, 96);

  //     doc.setFont(undefined, "normal");

  //     doc.text(
  //       invoice.updatedAt && invoice.invoiceStatus.toLowerCase() === "paid"
  //         ? new Date(invoice.updatedAt).toLocaleDateString()
  //         : "-",
  //       175,
  //       96,
  //     );
  //     doc.setFont(undefined, "bold");

  //     doc.text("Description", 15, 110);

  //     doc.setFont(undefined, "normal");

  //     doc.text(invoice.description || "-", 15, 118);
  //     // doc.text(`Account: ${accountName}`, 10, 30);
  //     // doc.text(`Description: ${invoice.description || "-"}`, 10, 40);

  //     // ================= TABLE =================
  //     autoTable(doc, {
  //       startY: 130,
  //       head: [["Product/Service", "Rate", "Quantity", "Amount"]],
  //       body: invoice.lineItems.map((item) => [
  //         item.productorService,
  //         `$${item.rate}`,
  //         item.quantity,
  //         `$${item.amount}`,
  //       ]),
  //       theme: "grid",
  //       // headStyles: {
  //       //   fillColor: [240, 240, 240],
  //       //   textColor: [0, 0, 0],
  //       // },
  //       // styles: {
  //       //   fontSize: 11,
  //       // },
  //       headStyles: {
  //         fillColor: [25, 118, 210],
  //         textColor: 255,
  //         fontStyle: "bold",
  //       },

  //       alternateRowStyles: {
  //         fillColor: [248, 248, 248],
  //       },

  //       styles: {
  //         fontSize: 10,
  //         cellPadding: 4,
  //       },
  //     });

  //     // ================= SUMMARY =================
  //     // const summaryY = doc.lastAutoTable.finalY + 10;
  //     // // const pageWidth = doc.internal.pageSize.getWidth();

  //     // doc.setFontSize(12);

  //     // doc.text(
  //     //   `Subtotal: $${invoice.summary.subtotal.toFixed(2)}`,
  //     //   pageWidth - 70,
  //     //   summaryY,
  //     // );

  //     // doc.text(
  //     //   `Tax: $${invoice.summary.taxTotal.toFixed(2)}`,
  //     //   pageWidth - 70,
  //     //   summaryY + 10,
  //     // );

  //     // doc.setFontSize(14);
  //     // doc.setFont(undefined, "bold");

  //     // doc.text(
  //     //   `Total: $${invoice.summary.total.toFixed(2)}`,
  //     //   pageWidth - 70,
  //     //   summaryY + 20,
  //     // );
  //     const finalY = doc.lastAutoTable.finalY + 15;

  //     doc.setFont(undefined, "normal");

  //     doc.text("Subtotal", 140, finalY);

  //     doc.text(`$${invoice.summary.subtotal.toFixed(2)}`, 195, finalY, {
  //       align: "right",
  //     });

  //     doc.text("Tax", 140, finalY + 8);

  //     doc.text(`$${invoice.summary.taxTotal.toFixed(2)}`, 195, finalY + 8, {
  //       align: "right",
  //     });

  //     doc.setFontSize(14);

  //     doc.setFont(undefined, "bold");

  //     doc.text("TOTAL", 140, finalY + 20);

  //     doc.text(`$${invoice.summary.total.toFixed(2)}`, 195, finalY + 20, {
  //       align: "right",
  //     });
  //     if (invoice.invoiceStatus?.toLowerCase() === "paid") {
  //       doc.saveGraphicsState();

  //       doc.setGState(new doc.GState({ opacity: 0.15 }));

  //       doc.setTextColor(200, 0, 0);

  //       doc.setFontSize(70);

  //       doc.setFont(undefined, "bold");

  //       doc.text("PAID", pageWidth / 2, 160, {
  //         angle: 330,
  //         align: "center",
  //       });

  //       doc.restoreGraphicsState();
  //     }
  //     // ================= DOWNLOAD =================
  //     doc.save(`Invoice_${invoice.invoicenumber}.pdf`);

  //     showToast({
  //       title: "Invoice downloaded successfully",
  //       type: "success",
  //     });
  //     handleMenuClose();
  //   } catch (error) {
  //     console.error("Error downloading invoice:", error);
  //     showToast({
  //       title: "Failed to download invoice",
  //       type: "error",
  //     });
  //   }
  // };

  // Helper function to get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid":
        return "default";
      case "Pending":
        return "secondary";
      case "Overdue":
        return "destructive";
      default:
        return "outline";
    }
  };
  const handleEdit = (invoice) => {
    setEditInvoiceId(invoice._id);
    setOpenDrawer(true);
    handleMenuClose();
  };
const invoiceSummary = accountInvoicesData.reduce(
  (acc, invoice) => {
    const paid = Number(invoice.paidAmount || 0);
    const balance = Number(invoice.balanceDueAmount || 0);

    acc.totalInvoices += 1;
    acc.totalPaid += paid;
    acc.totalUnpaid += balance;
    acc.netDue += balance;

    return acc;
  },
  {
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    netDue: 0,
  }
);
  // const invoiceSummary = accountInvoicesData.reduce(
  //   (acc, invoice) => {
  //     const total = Number(invoice.balanceDueAmount || 0);
  //     const paid = Number(invoice.paidAmount || 0);
  //     const balance = total - paid;

  //     acc.totalInvoices += 1;
  //     acc.totalPaid += paid;
  //     acc.totalUnpaid += balance > 0 ? balance : 0;
  //     acc.netDue += balance;

  //     return acc;
  //   },
  //   {
  //     totalInvoices: 0,
  //     totalPaid: 0,
  //     totalUnpaid: 0,
  //     netDue: 0,
  //   },
  // );
  const availableCredit = account?.creaditAval || 0;
  const invoiceAmount = selectedInvoice?.summary?.total || 0;

  const amountToPay =
    availableCredit >= invoiceAmount ? 0 : invoiceAmount - availableCredit;

  return (
    <div className="mt-2 space-y-4">
      <div className="mb-2">
        <Button onClick={() => setOpenDrawer(true)}>Create Invoice</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              Number of Invoices
            </div>
            <div className="text-2xl font-bold">
              {invoiceSummary.totalInvoices}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Paid Amount</div>
            <div className="text-2xl font-bold text-green-600">
              ${invoiceSummary.totalPaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Unpaid Amount</div>
            <div className="text-2xl font-bold text-red-600">
              ${invoiceSummary.totalUnpaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              Credit Available
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ${Number(account?.creaditAval || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Net Due</div>
            <div className="text-2xl font-bold text-orange-600">
              ${invoiceSummary.netDue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* {(account?.creaditAval || 0) <= 0 && (
  <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    <strong>Note:</strong> You do not have any available credit to pay invoices. Please add credit to your account before attempting to pay an invoice.
  </div>
)} */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[50px]">Settings</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {accountInvoicesData.map((row) => (
                  <TableRow key={row._id}>
                    {/* <TableCell className="font-medium">
                      {row.invoicenumber}
                    </TableCell> */}
<TableCell className="font-medium">
  <button
    type="button"
    onClick={() => handleEdit(row)}
    className="text-blue-600 hover:underline cursor-pointer"
  >
    {row.invoicenumber}
  </button>
</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(row.invoiceStatus)}>
                        {row.invoiceStatus}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>${row.summary.total}</TableCell>

                    <TableCell>${row.paidAmount}</TableCell>

                    <TableCell>${row.balanceDueAmount}</TableCell>

                    <TableCell className="max-w-[200px] truncate">
                      {row.description}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu
                        open={openMenuId === row._id}
                        onOpenChange={(open) => {
                          if (!open) setOpenMenuId(null);
                          else setOpenMenuId(row._id);
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Show Edit only for Pending invoices */}

                          {["Pending", "Overdue"].includes(
                            row.invoiceStatus,
                          ) && (
                            <DropdownMenuItem onClick={() => handleEdit(row)}>
                              Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(row._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                          {/* {row.invoiceStatus === "Pending" && ( */}
                          {/* {["Pending", "Overdue"].includes(
                            row.invoiceStatus,
                          ) && (
                            <DropdownMenuItem
                              onClick={() => handlePayInvoice(row)}
                            >
                              Pay Invoice
                            </DropdownMenuItem>
                          )} */}
                          {["Pending", "Overdue"].includes(row.invoiceStatus) &&
  (account?.creaditAval || 0) > 0 && (
    <DropdownMenuItem onClick={() => handlePayInvoice(row)}>
      Pay Invoice
    </DropdownMenuItem>
)}
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(row._id)}
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePrint(row._id)}
                          >
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(row._id)}
                          >
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateInvoiceDrawer
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setEditInvoiceId(null);
        }}
        fetchInvoices={refetchInvoices}
        editInvoiceId={editInvoiceId}
      />
      <PayInvoice
        open={payDrawerOpen}
        setOpen={setPayDrawerOpen}
        selectedInvoice={selectedInvoice}
        availableCredit={account?.creaditAval || 0}
        amountToPay={amountToPay}
      />
    </div>
  );
};

export default InvoiceTable;
