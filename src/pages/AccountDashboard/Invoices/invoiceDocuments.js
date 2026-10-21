import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// =====================================================
// COMPANY DETAILS (hard-coded)
// =====================================================
// export const COMPANY_INFO = {
//   name: "SNP Taxes",
//   address: ["123 Main Street, Suite 100", "Austin, TX 78701"],
//   phone: "(555) 123-4567",
//   email: "billing@snptaxes.com",
// };
export const COMPANY_INFO = {
  name: "SNP Tax & Financials",
  address: [
    "3015 Hopyard Rd, Ste M  ",
    "Pleasanton, CA 94588",
  ],
  phone: "(925) 800-3561",
  email: "silpa@snptaxandfinancials.com",
  website: "http://www.snptaxandfinancials.com",
  // logo: path.join(__dirname, "../assets/logo.png"), // local PNG/JPG
};
// =====================================================
// SHARED HELPERS
// =====================================================
const COLORS = {
  primary: [31, 78, 173], // #1F4EAD
  text: [31, 41, 55], // #1F2937
  muted: [107, 114, 128], // #6B7280
  border: [229, 231, 235], // #E5E7EB
  rowAlt: [248, 249, 252], // #F8F9FC
};

export const formatAmount = (v) => `$${(Number(v) || 0).toFixed(2)}`;

export const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt)) return "-";
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isInvoicePaid = (invoice) =>
  String(invoice?.invoiceStatus || "").toLowerCase() === "paid";

// Uses invoice.payments if you have it, otherwise builds one row from paidAmount
export const getPaymentRows = (invoice) => {
  if (Array.isArray(invoice.payments) && invoice.payments.length) {
    return invoice.payments.map((p) => ({
      method: p.method || p.paymentMethod || "-",
      date: p.date || p.paidDate || p.createdAt,
      amount: p.amount,
    }));
  }
  if (Number(invoice.paidAmount) > 0) {
    return [
      {
        method: invoice.paymentMethod || "-",
        date: invoice.paidDate || invoice.updatedAt,
        amount: invoice.paidAmount,
      },
    ];
  }
  return [];
};

const getInvoiceTotals = (invoice) => {
  const summary = invoice.summary || {};
  const subtotal =
    summary.subtotal ??
    (invoice.lineItems || []).reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const taxTotal = Number(summary.taxTotal) || 0;
  const total = summary.total ?? Number(subtotal) + taxTotal;
  const taxRate = Number(summary.taxRate) || 0;
  const balanceDue =
    invoice.balanceDueAmount ?? Number(total) - (Number(invoice.paidAmount) || 0);
  return { subtotal, taxTotal, total, taxRate, balanceDue };
};

const getDatePaid = (invoice, paymentRows) =>
  isInvoicePaid(invoice)
    ? invoice.paidDate ||
      paymentRows[paymentRows.length - 1]?.date ||
      invoice.updatedAt
    : null;

// =====================================================
// PAID STAMP (drawn on a canvas, added to jsPDF as an image)
// =====================================================
const roundRectPath = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export const createPaidStampImage = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  const red = "rgba(220, 38, 38, 0.85)";

  ctx.translate(300, 150);
  ctx.rotate((-15 * Math.PI) / 180);

  const bw = 440;
  const bh = 150;

  // outer border
  ctx.strokeStyle = red;
  ctx.lineWidth = 10;
  roundRectPath(ctx, -bw / 2, -bh / 2, bw, bh, 18);
  ctx.stroke();

  // inner border
  ctx.lineWidth = 4;
  roundRectPath(ctx, -bw / 2 + 16, -bh / 2 + 16, bw - 32, bh - 32, 10);
  ctx.stroke();

  // text
  ctx.fillStyle = red;
  ctx.font = "bold 88px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PAID", 0, 6);

  return canvas.toDataURL("image/png");
};

// =====================================================
// jsPDF BUILDER (used by Download)
// =====================================================
export const buildInvoicePDF = (invoice, { logo, company = COMPANY_INFO } = {}) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const L = 15;
  const R = pageWidth - 15;
  const W = R - L;
  const bottomLimit = pageHeight - 25;

  const account = invoice.account || {};
  const paymentRows = getPaymentRows(invoice);
  const totals = getInvoiceTotals(invoice);
  const paid = isInvoicePaid(invoice);

  const setText = (size, style = "normal", color = COLORS.text) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const ensureSpace = (y, needed) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      return 20;
    }
    return y;
  };

  // ---------------- HEADER ----------------
  let logoBottom = 12;
  if (logo) {
    try {
      const props = doc.getImageProperties(logo);
      const scale = Math.min(40 / props.width, 20 / props.height);
      const w = props.width * scale;
      const h = props.height * scale;
      doc.addImage(logo, "PNG", L, 12, w, h);
      logoBottom = 12 + h;
    } catch (err) {
      console.warn("Logo could not be added:", err);
    }
  }

  setText(16, "bold");
  doc.text(company.name || "", R, 17, { align: "right" });

  const addressLines = [
    ...(Array.isArray(company.address) ? company.address : [company.address]),
    company.phone,
    company.email,
  ].filter(Boolean);

  setText(9, "normal", COLORS.muted);
  let hy = 23;
  addressLines.forEach((line) => {
    doc.text(line, R, hy, { align: "right" });
    hy += 4.5;
  });

  let y = Math.max(logoBottom, hy - 4.5) + 6;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(L, y, R, y);
  y += 10;

  // ---------------- INVOICE DETAILS ----------------
  const detailsTop = y;

  setText(8, "bold", COLORS.muted);
  doc.text("BILL TO", L, detailsTop);

  setText(12, "bold");
  doc.text(account.accountName || "-", L, detailsTop + 6);

  setText(9.5, "normal", COLORS.muted);
  if (account.email) doc.text(account.email, L, detailsTop + 11.5);

  const details = [
    ["Invoice Number", `#${invoice.invoicenumber ?? "-"}`],
    ["Invoice Date", formatDate(invoice.invoicedate)],
    ["Date Paid", formatDate(getDatePaid(invoice, paymentRows))],
  ];

  let dy = detailsTop;
  details.forEach(([label, value]) => {
    setText(9.5, "normal", COLORS.muted);
    doc.text(label, R - 80, dy);
    setText(9.5, "bold");
    doc.text(value, R, dy, { align: "right" });
    dy += 6.5;
  });

  y = Math.max(detailsTop + 12, dy) + 8;

  // ---------------- OPTIONAL DESCRIPTION ----------------
  if (invoice.description && String(invoice.description).trim()) {
    setText(9.5, "normal", COLORS.muted);
    const lines = doc.splitTextToSize(String(invoice.description).trim(), W);
    doc.text(lines, L, y);
    y += lines.length * 4.5 + 6;
  }

  // ---------------- PRODUCTS / SERVICES TABLE ----------------
  const tableCommon = {
    theme: "plain",
    margin: { left: L, right: pageWidth - R, top: 20, bottom: 25 },
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
      textColor: COLORS.text,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: COLORS.rowAlt },
    didDrawCell: (data) => {
      if (data.section !== "body") return;
      const { x, y: cy, width, height } = data.cell;
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.2);
      doc.line(x, cy + height, x + width, cy + height);
    },
  };

  const right = (content) => ({ content, styles: { halign: "right" } });

  y = ensureSpace(y, 30);
  setText(12, "bold");
  doc.text("Products / Services", L, y);

  const items = invoice.lineItems || [];

  autoTable(doc, {
    ...tableCommon,
    startY: y + 4,
    head: [["Product / Service", right("Rate"), right("Qty"), right("Amount")]],
    body: items.length
      ? items.map((item) => [
          item.productorService || "-",
          right(formatAmount(item.rate)),
          right(String(item.quantity ?? 0)),
          right(formatAmount(item.amount)),
        ])
      : [[{ content: "No items", colSpan: 4, styles: { textColor: COLORS.muted } }]],
    columnStyles: {
      0: { cellWidth: W - 105 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 45 },
    },
  });

  // ---------------- TOTALS (right side) ----------------
  y = ensureSpace(doc.lastAutoTable.finalY + 8, 30);
  const tLabelX = R - 75;

  [
    ["Subtotal", formatAmount(totals.subtotal)],
    [`Tax (${totals.taxRate}%)`, formatAmount(totals.taxTotal)],
  ].forEach(([label, value]) => {
    setText(9.5, "normal", COLORS.muted);
    doc.text(label, tLabelX, y);
    setText(9.5, "normal");
    doc.text(value, R - 3, y, { align: "right" });
    y += 7;
  });

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(tLabelX, y - 2, R, y - 2);
  y += 5;

  setText(12, "bold");
  doc.text("Total", tLabelX, y);
  setText(12, "bold", COLORS.primary);
  doc.text(formatAmount(totals.total), R - 3, y, { align: "right" });

  // ---------------- PAYMENT HISTORY ----------------
  y = ensureSpace(y + 16, 35);
  setText(12, "bold");
  doc.text("Payment History", L, y);

  autoTable(doc, {
    ...tableCommon,
    startY: y + 4,
    head: [["Payment Method", "Date", right("Total Amount")]],
    body: paymentRows.length
      ? paymentRows.map((p) => [
          String(p.method || "-"),
          formatDate(p.date),
          right(formatAmount(p.amount)),
        ])
      : [
          [
            {
              content: "No payments recorded yet.",
              colSpan: 3,
              styles: { textColor: COLORS.muted },
            },
          ],
        ],
    columnStyles: {
      0: { cellWidth: W - 95 },
      1: { cellWidth: 50 },
      2: { cellWidth: 45 },
    },
  });

  y = ensureSpace(doc.lastAutoTable.finalY + 9, 10);
  setText(11, "bold");
  doc.text("Balance Due", tLabelX, y);
  doc.text(formatAmount(totals.balanceDue), R - 3, y, { align: "right" });

  // ---------------- PAID STAMP (center of page 1) ----------------
  if (paid) {
    try {
      const stamp = createPaidStampImage();
      const sw = 80;
      const sh = 40;
      doc.setPage(1);
      doc.addImage(stamp, "PNG", (pageWidth - sw) / 2, (pageHeight - sh) / 2, sw, sh);
    } catch (err) {
      console.warn("PAID stamp could not be drawn:", err);
    }
  }

  // ---------------- FOOTER + PAGE COUNT (every page) ----------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.2);
    doc.line(L, pageHeight - 18, R, pageHeight - 18);

    setText(8.5, "normal", COLORS.muted);
    doc.text("Thank you for your business.", pageWidth / 2, pageHeight - 12, {
      align: "center",
    });
    doc.text(` ${i} / ${totalPages}`, R, pageHeight - 12, { align: "right" });
  }

  return doc;
};

// =====================================================
// HTML BUILDER (used by Print)
// =====================================================
const escapeHTML = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const buildInvoicePrintHTML = (invoice, { logo, company = COMPANY_INFO } = {}) => {
  const account = invoice.account || {};
  const paymentRows = getPaymentRows(invoice);
  const totals = getInvoiceTotals(invoice);
  const paid = isInvoicePaid(invoice);

  const addressLines = [
    ...(Array.isArray(company.address) ? company.address : [company.address]),
    company.phone,
    company.email,
  ].filter(Boolean);

  const items = invoice.lineItems || [];

  const itemRows = items.length
    ? items
        .map(
          (item) => `
        <tr>
          <td>${escapeHTML(item.productorService || "-")}</td>
          <td class="num">${formatAmount(item.rate)}</td>
          <td class="num">${escapeHTML(item.quantity ?? 0)}</td>
          <td class="num">${formatAmount(item.amount)}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="4" class="empty">No items</td></tr>`;

  const paymentHTML = paymentRows.length
    ? paymentRows
        .map(
          (p) => `
        <tr>
          <td>${escapeHTML(p.method || "-")}</td>
          <td>${formatDate(p.date)}</td>
          <td class="num">${formatAmount(p.amount)}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="3" class="empty">No payments recorded yet.</td></tr>`;

  const description = String(invoice.description || "").trim();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice_${escapeHTML(invoice.invoicenumber)}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 12mm 18mm;

      @bottom-center {
        content: "Thank you for your business.";
        font: 9px Arial, Helvetica, sans-serif;
        color: #6b7280;
      }

      @bottom-right {
        content: "Page " counter(page) " / " counter(pages);
        font: 9px Arial, Helvetica, sans-serif;
        color: #6b7280;
      }
    }

    * { box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
      margin: 0;
      font-size: 12px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .invoice { position: relative; }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .logo { max-width: 150px; max-height: 75px; object-fit: contain; }
    .company { text-align: right; }
    .company h2 { margin: 0 0 6px; font-size: 20px; }
    .company div { color: #6b7280; font-size: 11px; line-height: 1.6; }

    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0 22px; }

    /* DETAILS */
    .details {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 22px;
    }
    .label-small {
      font-size: 10px;
      font-weight: bold;
      color: #6b7280;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .client-name { font-size: 15px; font-weight: bold; }
    .client-email { color: #6b7280; margin-top: 3px; overflow-wrap: anywhere; }

    .info { width: 260px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 7px; }
    .info-row span:first-child { color: #6b7280; }
    .info-row span:last-child { font-weight: bold; }

    .description { color: #6b7280; line-height: 1.6; margin-bottom: 22px; white-space: pre-line; }

    /* TABLES */
    h3 { font-size: 15px; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    th {
      background: #1f4ead;
      color: #fff;
      text-align: left;
      padding: 9px 10px;
      font-size: 12px;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
      overflow-wrap: anywhere;
    }
    tbody tr:nth-child(even) { background: #f8f9fc; }
    .num { text-align: right; white-space: nowrap; }
    .empty { color: #6b7280; }

    /* TOTALS */
    .totals { width: 260px; margin: 16px 0 30px auto; }
    .totals-row { display: flex; justify-content: space-between; padding: 5px 10px; }
    .totals-row span:first-child { color: #6b7280; }
    .totals-row.total {
      border-top: 1px solid #e5e7eb;
      margin-top: 6px;
      padding-top: 10px;
      font-size: 15px;
      font-weight: bold;
    }
    .totals-row.total span:first-child { color: #1f2937; }
    .totals-row.total span:last-child { color: #1f4ead; }

    .balance {
      width: 260px;
      margin: 14px 0 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      font-size: 13px;
      font-weight: bold;
    }

    /* PAID STAMP — centered on page 1 */
    .paid-stamp {
      position: absolute;
      top: 133mm;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-15deg);
      border: 5px solid rgba(220, 38, 38, 0.85);
      border-radius: 12px;
      padding: 5px;
      z-index: 10;
      pointer-events: none;
    }
    .paid-stamp span {
      display: block;
      border: 2px solid rgba(220, 38, 38, 0.85);
      border-radius: 6px;
      padding: 6px 38px;
      font: bold 60px Arial, Helvetica, sans-serif;
      letter-spacing: 4px;
      color: rgba(220, 38, 38, 0.85);
      line-height: 1;
    }
  </style>
</head>
<body>
  <div class="invoice">
    ${paid ? `<div class="paid-stamp"><span>PAID</span></div>` : ""}

    <div class="header">
      <div>${logo ? `<img src="${logo}" class="logo" alt="Logo" />` : ""}</div>
      <div class="company">
        <h2>${escapeHTML(company.name)}</h2>
        ${addressLines.map((l) => `<div>${escapeHTML(l)}</div>`).join("")}
      </div>
    </div>

    <hr class="divider" />

    <div class="details">
      <div>
        <div class="label-small">BILL TO</div>
        <div class="client-name">${escapeHTML(account.accountName || "-")}</div>
        ${account.email ? `<div class="client-email">${escapeHTML(account.email)}</div>` : ""}
      </div>

      <div class="info">
        <div class="info-row"><span>Invoice Number</span><span>#${escapeHTML(invoice.invoicenumber ?? "-")}</span></div>
        <div class="info-row"><span>Invoice Date</span><span>${formatDate(invoice.invoicedate)}</span></div>
        <div class="info-row"><span>Date Paid</span><span>${formatDate(getDatePaid(invoice, paymentRows))}</span></div>
      </div>
    </div>

    ${description ? `<div class="description">${escapeHTML(description)}</div>` : ""}

    <h3>Products / Services</h3>
    <table>
      <thead>
        <tr>
          <th>Product / Service</th>
          <th class="num">Rate</th>
          <th class="num">Qty</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div class="totals">
      <div class="totals-row"><span>Subtotal</span><span>${formatAmount(totals.subtotal)}</span></div>
      <div class="totals-row"><span>Tax (${totals.taxRate}%)</span><span>${formatAmount(totals.taxTotal)}</span></div>
      <div class="totals-row total"><span>Total</span><span>${formatAmount(totals.total)}</span></div>
    </div>

    <h3>Payment History</h3>
    <table>
      <thead>
        <tr>
          <th>Payment Method</th>
          <th>Date</th>
          <th class="num">Total Amount</th>
        </tr>
      </thead>
      <tbody>${paymentHTML}</tbody>
    </table>

    <div class="balance"><span>Balance Due</span><span>${formatAmount(totals.balanceDue)}</span></div>
  </div>
</body>
</html>`;
};