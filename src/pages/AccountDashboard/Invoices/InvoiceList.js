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
  //     const invoiceData = res.data;

  //     const accountName =
  //       invoiceData.invoice.account.accountName || "Unknown Account";

  //     const printContent = `
  //     <style>
  //       body { font-family: Arial; padding: 20px; }
  //       table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  //       th, td { border: 1px solid #ddd; padding: 8px; }
  //       th { background: #f2f2f2; }
  //     </style>

  //     <h2>Invoice #${invoiceData.invoice.invoicenumber}</h2>
  //     <p>Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}</p>
  //     <p><strong>${accountName}</strong></p>
  //     <p>${invoiceData.invoice.description}</p>

  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Product</th>
  //           <th>Rate</th>
  //           <th>Qty</th>
  //           <th>Amount</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         ${invoiceData.invoice.lineItems
  //           .map(
  //             (item) => `
  //           <tr>
  //             <td>${item.productorService}</td>
  //             <td>$${item.rate}</td>
  //             <td>${item.quantity}</td>
  //             <td>$${item.amount}</td>
  //           </tr>
  //         `,
  //           )
  //           .join("")}
  //       </tbody>
  //     </table>

  //     <h3>Total: $${invoiceData.invoice.summary.total}</h3>
  //   `;

  //     const win = window.open("", "_blank");
  //     win.document.write(`
  //     <html>
  //       <body onload="window.print(); window.close();">
  //         ${printContent}
  //       </body>
  //     </html>
  //   `);
  //     win.document.close();

  //     handleMenuClose();
  //   } catch (error) {
  //     console.error(error);
  //     showToast({
  //       title: "Failed to print invoice",
  //       type: "error",
  //     });
  //   }
  // };

  const handlePrint = async (_id) => {
    try {
      const res = await invoiceAPI.getInvoiceForPrint(_id);

      const invoice = res.data.invoice;

      const account = invoice.account || {};
      const summary = invoice.summary || {};

      const company = {
        name: "SNP Tax & Financials",
        address: "3015 Hopyard Rd, Ste M Pleasanton, CA 94588 ",
        phone: "(925) 800-3561",
        email: "silpa@snptaxandfinancials.com",
        website: "http://www.snptaxandfinancials.com",
        logo, // <-- replace with your logo path
      };

      const isPaid =
        invoice.invoiceStatus && invoice.invoiceStatus.toLowerCase() === "paid";

      const printContent = `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>Invoice</title>

<style>

*{
    box-sizing:border-box;
}

body{

    font-family:Arial,Helvetica,sans-serif;
    color:#333;
    padding:40px;
    margin:0;
    position:relative;

}

.invoice{

    width:100%;
}

.header{

    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    border-bottom:2px solid #1976d2;
    padding-bottom:20px;

}

.logo{

    width:170px;

}

.company{

    text-align:right;
    line-height:1.6;
}

.company h2{

    margin:0;
    color:#1976d2;

}

.title{

    margin-top:30px;
    display:flex;
    justify-content:space-between;
    align-items:flex-start;

}

.title h1{

    margin:0;
    font-size:38px;
    color:#1976d2;

}

.info{

    display:flex;
    justify-content:space-between;
    margin-top:30px;

}

.billTo{

    width:45%;
}

.invoiceInfo{

    width:40%;
}

.invoiceInfo table{

    width:100%;
}

.invoiceInfo td{

    padding:5px 0;
}

.description{

    margin-top:25px;
}

.description b{

    color:#1976d2;
}

.items{

    width:100%;
    border-collapse:collapse;
    margin-top:25px;

}

.items th{

    background:#1976d2;
    color:#fff;
    padding:12px;
    text-align:left;

}

.items td{

    padding:12px;
    border-bottom:1px solid #ddd;

}

.items tr:nth-child(even){

    background:#fafafa;

}

.summary{

    width:320px;
    margin-left:auto;
    margin-top:30px;
}

.summary table{

    width:100%;
    border-collapse:collapse;
}

.summary td{

    padding:10px;
    border-bottom:1px solid #ddd;

}

.total{

    font-size:18px;
    font-weight:bold;
}

.footer{

    margin-top:70px;
    text-align:center;
    font-size:13px;
    color:#666;
    border-top:1px solid #ddd;
    padding-top:20px;

}

.paid{

    position:fixed;
    top:55%;
    left:50%;
    transform:translate(-50%,-50%) rotate(-25deg);
    font-size:85px;
    font-weight:bold;
    color:#c62828;
    border:6px solid #c62828;
    padding:12px 40px;
    opacity:.18;
    letter-spacing:5px;
    pointer-events:none;

}

</style>

</head>

<body>

${isPaid ? `<div class="paid">PAID</div>` : ""}

<div class="invoice">

<div class="header">

<div>

<img src="${company.logo}" class="logo">

</div>

<div class="company">

<h2>${company.name}</h2>

<div>${company.address}</div>



<div>${company.email}</div>

<div>${company.website}</div>


<div>${company.phone}</div>

</div>

</div>

<div class="title">

<h1>Invoice</h1>

</div>

<div class="info">

<div class="billTo">

<h3>Bill To</h3>

<div><b>${account.accountName || ""}</b></div>

<div>${account.email || ""}</div>


</div>

<div class="invoiceInfo">

<table>

<tr>

<td><b>Invoice #</b></td>

<td>${invoice.invoicenumber}</td>

</tr>

<tr>

<td><b>Invoice Date</b></td>

<td>${new Date(invoice.invoicedate).toLocaleDateString()}</td>

</tr>
<tr>

<td><b>Payment Method</b></td>

<td>${invoice.paymentMethod || "-"}</td>

</tr>
<tr>

<td><b>Paid Date</b></td>

<td>${
        invoice.updatedAt && invoice.invoiceStatus.toLowerCase() === "paid"
          ? new Date(invoice.updatedAt).toLocaleDateString()
          : "-"
      }</td>

</tr>





</table>

</div>

</div>

<div class="description">

<b>Description</b>

<p>${invoice.description || "-"}</p>

</div>


<div class="summary">

<table>

<tr>

<td>Subtotal</td>

<td align="right">$${Number(summary.subtotal || 0).toFixed(2)}</td>

</tr>

<tr>

<td>Tax</td>

<td align="right">$${Number(summary.taxTotal || 0).toFixed(2)}</td>

</tr>

<tr class="total">

<td>Total</td>

<td align="right">$${Number(summary.total || 0).toFixed(2)}</td>

</tr>

</table>

</div>



</div>

</body>

</html>
`;

      // const printWindow = window.open("", "_blank");

      // printWindow.document.open();
      // printWindow.document.write(printContent);
      // printWindow.document.close();

      // printWindow.onload = () => {
      //   printWindow.focus();
      //   printWindow.print();
      //   printWindow.close();
      // };
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(printContent);
      doc.close();

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        // setTimeout(() => {
        //   document.body.removeChild(iframe);
        // }, 1000);
      };

      handleMenuClose();
      // handleMenuClose();
    } catch (error) {
      console.error(error);

      showToast({
        title: "Failed to print invoice",
        type: "error",
      });
    }
  };
  const [payDrawerOpen, setPayDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setPayDrawerOpen(true);
  };
  //download
  const handleDownload = async (_id) => {
    try {
      // ✅ Fetch data using API
      const res = await invoiceAPI.getInvoiceForPrint(_id);
      const invoiceData = res.data;

      const invoice = invoiceData.invoice;
      console.log("Invoice data for download:", invoice);
      const accountName = invoice.account?.accountName || "Unknown Account";

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.addImage(logo, "PNG", 15, 10, 35, 18); // logo
      // ================= HEADER =================
      // doc.setFontSize(16);
      // doc.setFont(undefined, "bold");
      // doc.text(`Invoice #${invoice.invoicenumber}`, 10, 10);
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text("SNP Tax & Financials", pageWidth - 15, 15, {
        align: "right",
      });

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");

      doc.text(
        "3015 Hopyard Rd, Ste M Pleasanton, CA 94588 ",
        pageWidth - 15,
        22,
        {
          align: "right",
        },
      );

      doc.text("(925) 800-3561", pageWidth - 15, 27, {
        align: "right",
      });

      doc.text("silpa@snptaxandfinancials.com", pageWidth - 15, 32, {
        align: "right",
      });

      doc.text("http://www.snptaxandfinancials.com", pageWidth - 15, 37, {
        align: "right",
      });

      doc.setDrawColor(30, 136, 229);
      doc.line(10, 45, 200, 45);

      doc.setFontSize(24);
      doc.setFont(undefined, "bold");

      doc.text("INVOICE", 15, 58);
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      // doc.text(
      //   `Date: ${new Date(invoice.invoicedate).toLocaleDateString()}`,
      //   10,
      //   20,
      // );

      const account = invoice.account || {};

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");

      doc.text("Bill To", 15, 72);

      doc.setFont(undefined, "normal");

      doc.text(account.accountName || "", 15, 80);

      doc.text(account.contactName || "", 15, 86);

      doc.text(account.email || "", 15, 92);

      doc.text(account.streetAddress || "", 15, 98);
      doc.setFont(undefined, "bold");

      doc.text("Invoice #", 140, 72);

      doc.setFont(undefined, "normal");

      doc.text(String(invoice.invoicenumber), 175, 72);

      doc.setFont(undefined, "bold");

      doc.text("Date", 140, 80);

      doc.setFont(undefined, "normal");

      doc.text(new Date(invoice.invoicedate).toLocaleDateString(), 175, 80);

      doc.setFont(undefined, "bold");

      doc.text("Status", 140, 88);

      doc.setFont(undefined, "normal");

      doc.text(invoice.invoiceStatus || "-", 175, 88);

      doc.setFont(undefined, "bold");

      doc.text("Paid Date", 140, 96);

      doc.setFont(undefined, "normal");

      doc.text(
        invoice.updatedAt && invoice.invoiceStatus.toLowerCase() === "paid"
          ? new Date(invoice.updatedAt).toLocaleDateString()
          : "-",
        175,
        96,
      );
      doc.setFont(undefined, "bold");

      doc.text("Description", 15, 110);

      doc.setFont(undefined, "normal");

      doc.text(invoice.description || "-", 15, 118);
      // doc.text(`Account: ${accountName}`, 10, 30);
      // doc.text(`Description: ${invoice.description || "-"}`, 10, 40);

      // ================= TABLE =================
      autoTable(doc, {
        startY: 130,
        head: [["Product/Service", "Rate", "Quantity", "Amount"]],
        body: invoice.lineItems.map((item) => [
          item.productorService,
          `$${item.rate}`,
          item.quantity,
          `$${item.amount}`,
        ]),
        theme: "grid",
        // headStyles: {
        //   fillColor: [240, 240, 240],
        //   textColor: [0, 0, 0],
        // },
        // styles: {
        //   fontSize: 11,
        // },
        headStyles: {
          fillColor: [25, 118, 210],
          textColor: 255,
          fontStyle: "bold",
        },

        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },

        styles: {
          fontSize: 10,
          cellPadding: 4,
        },
      });

      // ================= SUMMARY =================
      // const summaryY = doc.lastAutoTable.finalY + 10;
      // // const pageWidth = doc.internal.pageSize.getWidth();

      // doc.setFontSize(12);

      // doc.text(
      //   `Subtotal: $${invoice.summary.subtotal.toFixed(2)}`,
      //   pageWidth - 70,
      //   summaryY,
      // );

      // doc.text(
      //   `Tax: $${invoice.summary.taxTotal.toFixed(2)}`,
      //   pageWidth - 70,
      //   summaryY + 10,
      // );

      // doc.setFontSize(14);
      // doc.setFont(undefined, "bold");

      // doc.text(
      //   `Total: $${invoice.summary.total.toFixed(2)}`,
      //   pageWidth - 70,
      //   summaryY + 20,
      // );
      const finalY = doc.lastAutoTable.finalY + 15;

      doc.setFont(undefined, "normal");

      doc.text("Subtotal", 140, finalY);

      doc.text(`$${invoice.summary.subtotal.toFixed(2)}`, 195, finalY, {
        align: "right",
      });

      doc.text("Tax", 140, finalY + 8);

      doc.text(`$${invoice.summary.taxTotal.toFixed(2)}`, 195, finalY + 8, {
        align: "right",
      });

      doc.setFontSize(14);

      doc.setFont(undefined, "bold");

      doc.text("TOTAL", 140, finalY + 20);

      doc.text(`$${invoice.summary.total.toFixed(2)}`, 195, finalY + 20, {
        align: "right",
      });
      if (invoice.invoiceStatus?.toLowerCase() === "paid") {
        doc.saveGraphicsState();

        doc.setGState(new doc.GState({ opacity: 0.15 }));

        doc.setTextColor(200, 0, 0);

        doc.setFontSize(70);

        doc.setFont(undefined, "bold");

        doc.text("PAID", pageWidth / 2, 160, {
          angle: 330,
          align: "center",
        });

        doc.restoreGraphicsState();
      }
      // ================= DOWNLOAD =================
      doc.save(`Invoice_${invoice.invoicenumber}.pdf`);

      showToast({
        title: "Invoice downloaded successfully",
        type: "success",
      });
      handleMenuClose();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      showToast({
        title: "Failed to download invoice",
        type: "error",
      });
    }
  };

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
                    <TableCell className="font-medium">
                      {row.invoicenumber}
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
                          {["Pending", "Overdue"].includes(
                            row.invoiceStatus,
                          ) && (
                            <DropdownMenuItem
                              onClick={() => handlePayInvoice(row)}
                            >
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
