// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Menu,
//   MenuItem,
//   Chip,
//   Button,
// } from "@mui/material";
// import { CiMenuKebab } from "react-icons/ci";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import { invoiceAPI } from "../../../services/api"; // adjust path
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import CreateInvoiceDrawer from "./CreateInvoiceDrawer";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// const InvoiceTable = () => {
//   const { accountId } = useParams();
//   const confirm = useConfirm();
//   const [accountInvoicesData, setAccountInvoicesData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [openDrawer, setOpenDrawer] = useState(false);

//   // Check if an invoice is overdue
//   const isInvoiceOverdue = (invoice, paymentTermDays = 5) => {
//     if (!invoice.invoicedate || invoice.invoiceStatus === "Paid") return false;

//     const invoiceDate = new Date(invoice.invoicedate);
//     const today = new Date();

//     // Skip invoices created today
//     if (
//       invoiceDate.getFullYear() === today.getFullYear() &&
//       invoiceDate.getMonth() === today.getMonth() &&
//       invoiceDate.getDate() === today.getDate()
//     ) {
//       return false;
//     }

//     const dueDate = new Date(invoiceDate);
//     dueDate.setDate(dueDate.getDate() + paymentTermDays);

//     const todayDateOnly = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate(),
//     );
//     const dueDateOnly = new Date(
//       dueDate.getFullYear(),
//       dueDate.getMonth(),
//       dueDate.getDate(),
//     );

//     const isUnpaid = invoice.invoiceStatus === "Pending";

//     // Use balanceDueAmount if set, otherwise fallback to total
//     const balance = invoice.balanceDueAmount ?? invoice.summary?.total ?? 0;
//     const hasBalanceDue = balance > 0;

//     return todayDateOnly > dueDateOnly && isUnpaid && hasBalanceDue;
//   };

//   // Fetch invoices and update overdue status safely
//   const fetchInvoices = async () => {
//     try {
//       const res = await invoiceAPI.getInvoiceListByAccountId(accountId);
//       console.log("Fetched invoices:", res.data);

//       if (res.data?.invoice) {
//         const updatedInvoices = await Promise.all(
//           res.data.invoice.map(async (invoice) => {
//             const overdue = isInvoiceOverdue(invoice);

//             // Only update if overdue AND not already overdue
//             if (overdue && invoice.invoiceStatus !== "Overdue") {
//               try {
//                 await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, {
//                   invoiceStatus: "Overdue",
//                 });
//                 return { ...invoice, invoiceStatus: "Overdue" };
//               } catch (err) {
//                 console.error("Failed to update invoice status:", err);
//                 return invoice; // fallback to original
//               }
//             }

//             return invoice;
//           }),
//         );

//         setAccountInvoicesData(updatedInvoices);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch invoices");
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, [accountId]);

//   // Menu handlers
//   const toggleMenu = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setOpenMenuId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setOpenMenuId(null);
//   };

//   const handleDelete = (id) => {
//     confirm({
//       title: "Delete Invoice",
//       description:
//         "Are you sure you want to delete this invoice? This action cannot be undone.",
//       onConfirm: async () => {
//         try {
//           await invoiceAPI.deleteInvoice(id);
//           toast.success("Deleted successfully");

//           setAccountInvoicesData((prev) =>
//             prev.filter((inv) => inv._id !== id),
//           );
//         } catch (err) {
//           toast.error("Delete failed");
//         }
//       },
//     });
//   };

//   // Duplicate
//   const handleDuplicate = async (id) => {
//     const invoice = accountInvoicesData.find((i) => i._id === id);
//     if (!invoice) return;

//     try {
//       await invoiceAPI.createInvoice({
//         ...invoice,
//         invoiceLabel: "Copy",
//       });

//       toast.success("Duplicated");
//       fetchInvoices();
//       handleMenuClose();
//     } catch {
//       toast.error("Duplicate failed");
//     }
//   };
//   //print
//   const handlePrint = async (_id) => {
//     try {
//       const res = await invoiceAPI.getInvoiceForPrint(_id);
//       const invoiceData = res.data;

//       const accountName =
//         invoiceData.invoice.account.accountName || "Unknown Account";

//       const printContent = `
//       <style>
//         body { font-family: Arial; padding: 20px; }
//         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//         th, td { border: 1px solid #ddd; padding: 8px; }
//         th { background: #f2f2f2; }
//       </style>

//       <h2>Invoice #${invoiceData.invoice.invoicenumber}</h2>
//       <p>Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}</p>
//       <p><strong>${accountName}</strong></p>
//       <p>${invoiceData.invoice.description}</p>

//       <table>
//         <thead>
//           <tr>
//             <th>Product</th>
//             <th>Rate</th>
//             <th>Qty</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${invoiceData.invoice.lineItems
//             .map(
//               (item) => `
//             <tr>
//               <td>${item.productorService}</td>
//               <td>$${item.rate}</td>
//               <td>${item.quantity}</td>
//               <td>$${item.amount}</td>
//             </tr>
//           `,
//             )
//             .join("")}
//         </tbody>
//       </table>

//       <h3>Total: $${invoiceData.invoice.summary.total}</h3>
//     `;

//       const win = window.open("", "_blank");
//       win.document.write(`
//       <html>
//         <body onload="window.print(); window.close();">
//           ${printContent}
//         </body>
//       </html>
//     `);
//       win.document.close();

//       handleMenuClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to print invoice");
//     }
//   };

//   //download
// // const handleDownload = async (_id) => {
// //   try {
// //     const res = await invoiceAPI.getInvoiceForPrint(_id);
// //     const invoiceData = res.data;

// //     const doc = new jsPDF();

// //     const accountName =
// //       invoiceData.invoice.account.accountName || "Unknown Account";

// //     doc.setFontSize(14);
// //     doc.text(`Invoice #${invoiceData.invoice.invoicenumber}`, 10, 10);
// //     doc.text(
// //       `Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}`,
// //       10,
// //       20
// //     );
// //     doc.text(`Account: ${accountName}`, 10, 30);

// //     // ✅ FIXED HERE
// //     autoTable(doc, {
// //       startY: 40,
// //       head: [["Product", "Rate", "Qty", "Amount"]],
// //       body: invoiceData.invoice.lineItems.map((item) => [
// //         item.productorService,
// //         `$${item.rate}`,
// //         item.quantity,
// //         `$${item.amount}`,
// //       ]),
// //     });

// //     const finalY = doc.lastAutoTable.finalY;

// //     doc.text(
// //       `Total: $${invoiceData.invoice.summary.total.toFixed(2)}`,
// //       10,
// //       finalY + 10
// //     );

// //     doc.save(`Invoice_${invoiceData.invoice.invoicenumber}.pdf`);

// //     toast.success("Downloaded successfully");
// //     handleMenuClose();
// //   } catch (error) {
// //     console.error(error);
// //     toast.error("Failed to download invoice");
// //   }
// // };

// const handleDownload = async (_id) => {
//   try {
//     // ✅ Fetch data using API
//     const res = await invoiceAPI.getInvoiceForPrint(_id);
//     const invoiceData = res.data;

//     const invoice = invoiceData.invoice;

//     const accountName =
//       invoice.account?.accountName || "Unknown Account";

//     const doc = new jsPDF();

//     // ================= HEADER =================
//     doc.setFontSize(16);
//     doc.setFont(undefined, "bold");
//     doc.text(`Invoice #${invoice.invoicenumber}`, 10, 10);

//     doc.setFontSize(12);
//     doc.setFont(undefined, "normal");
//     doc.text(
//       `Date: ${new Date(invoice.invoicedate).toLocaleDateString()}`,
//       10,
//       20
//     );

//     doc.text(`Account: ${accountName}`, 10, 30);
//     doc.text(`Description: ${invoice.description || "-"}`, 10, 40);

//     // ================= TABLE =================
//     autoTable(doc, {
//       startY: 50,
//       head: [["Product/Service", "Rate", "Quantity", "Amount"]],
//       body: invoice.lineItems.map((item) => [
//         item.productorService,
//         `$${item.rate}`,
//         item.quantity,
//         `$${item.amount}`,
//       ]),
//       theme: "grid",
//       headStyles: {
//         fillColor: [240, 240, 240],
//         textColor: [0, 0, 0],
//       },
//       styles: {
//         fontSize: 11,
//       },
//     });

//     // ================= SUMMARY =================
//     const summaryY = doc.lastAutoTable.finalY + 10;
//     const pageWidth = doc.internal.pageSize.getWidth();

//     doc.setFontSize(12);

//     doc.text(
//       `Subtotal: $${invoice.summary.subtotal.toFixed(2)}`,
//       pageWidth - 70,
//       summaryY
//     );

//     doc.text(
//       `Tax: $${invoice.summary.taxTotal.toFixed(2)}`,
//       pageWidth - 70,
//       summaryY + 10
//     );

//     doc.setFontSize(14);
//     doc.setFont(undefined, "bold");

//     doc.text(
//       `Total: $${invoice.summary.total.toFixed(2)}`,
//       pageWidth - 70,
//       summaryY + 20
//     );

//     // ================= DOWNLOAD =================
//     doc.save(`Invoice_${invoice.invoicenumber}.pdf`);

//     toast.success("Invoice downloaded successfully");
//     handleMenuClose();
//   } catch (error) {
//     console.error("Error downloading invoice:", error);
//     toast.error("Failed to download invoice");
//   }
// };
//   return (
//     <Box sx={{ mt: 2 }}>
//       <Box mb={2}>
//         <Button variant="contained" onClick={() => setOpenDrawer(true)}>
//           Create Invoice
//         </Button>{" "}
//       </Box>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Invoice #</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Posted</TableCell>
//               <TableCell>Total</TableCell>
//               <TableCell>Paid</TableCell>
//               <TableCell>Balance</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Settings</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {accountInvoicesData.map((row) => (
//               <TableRow key={row._id}>
//                 <TableCell>
//                   {row.invoicenumber}
//                   {row.invoiceLabel && (
//                     <Chip
//                       label={row.invoiceLabel}
//                       size="small"
//                       color="warning"
//                       sx={{ ml: 1 }}
//                     />
//                   )}
//                 </TableCell>

//                 <TableCell>{row.invoiceStatus}</TableCell>

//                 <TableCell>
//                   {new Date(row.createdAt).toLocaleDateString()}
//                 </TableCell>

//                 <TableCell>${row.summary.total}</TableCell>

//                 <TableCell>${row.paidAmount}</TableCell>

//                 <TableCell>${row.summary.total - row.paidAmount}</TableCell>

//                 <TableCell>{row.description}</TableCell>

//                 <TableCell>
//                   <IconButton onClick={(e) => toggleMenu(e, row._id)}>
//                     <CiMenuKebab />
//                   </IconButton>

//                   <Menu
//                     anchorEl={anchorEl}
//                     open={openMenuId === row._id}
//                     onClose={handleMenuClose}
//                   >
//                     <MenuItem onClick={() => handleDelete(row._id)}>
//                       Delete
//                     </MenuItem>
//                     <MenuItem onClick={() => handleDuplicate(row._id)}>
//                       Duplicate
//                     </MenuItem>
//                     <MenuItem onClick={() => handlePrint(row._id)}>
//                       Print
//                     </MenuItem>

//                     <MenuItem onClick={() => handleDownload(row._id)}>
//                       Download
//                     </MenuItem>
//                   </Menu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <CreateInvoiceDrawer
//         open={openDrawer}
//         onClose={() => setOpenDrawer(false)}
//         fetchInvoices={fetchInvoices}
//       />
//     </Box>
//   );
// };

// export default InvoiceTable;

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { invoiceAPI } from "../../../services/api";
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
import { Card, CardContent } from "../../../components/ui/card";

const InvoiceTable = () => {
  const { accountId } = useParams();
  const confirm = useConfirm();
  const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
const [editInvoiceId, setEditInvoiceId] = useState(null);
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

  // Fetch invoices and update overdue status safely
  const fetchInvoices = async () => {
    try {
      const res = await invoiceAPI.getInvoiceListByAccountId(accountId);
      console.log("Fetched invoices:", res.data);

      if (res.data?.invoice) {
        const updatedInvoices = await Promise.all(
          res.data.invoice.map(async (invoice) => {
            const overdue = isInvoiceOverdue(invoice);

            // Only update if overdue AND not already overdue
            if (overdue && invoice.invoiceStatus !== "Overdue") {
              try {
                await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, {
                  invoiceStatus: "Overdue",
                });
                return { ...invoice, invoiceStatus: "Overdue" };
              } catch (err) {
                console.error("Failed to update invoice status:", err);
                return invoice; // fallback to original
              }
            }

            return invoice;
          }),
        );

        setAccountInvoicesData(updatedInvoices);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch invoices");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [accountId]);

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
          toast.success("Deleted successfully");

          setAccountInvoicesData((prev) =>
            prev.filter((inv) => inv._id !== id),
          );
        } catch (err) {
          toast.error("Delete failed");
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

      toast.success("Duplicated");
      fetchInvoices();
      handleMenuClose();
    } catch {
      toast.error("Duplicate failed");
    }
  };

  //print
  const handlePrint = async (_id) => {
    try {
      const res = await invoiceAPI.getInvoiceForPrint(_id);
      const invoiceData = res.data;

      const accountName =
        invoiceData.invoice.account.accountName || "Unknown Account";

      const printContent = `
      <style>
        body { font-family: Arial; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f2f2f2; }
      </style>

      <h2>Invoice #${invoiceData.invoice.invoicenumber}</h2>
      <p>Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}</p>
      <p><strong>${accountName}</strong></p>
      <p>${invoiceData.invoice.description}</p>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Rate</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.invoice.lineItems
            .map(
              (item) => `
            <tr>
              <td>${item.productorService}</td>
              <td>$${item.rate}</td>
              <td>${item.quantity}</td>
              <td>$${item.amount}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <h3>Total: $${invoiceData.invoice.summary.total}</h3>
    `;

      const win = window.open("", "_blank");
      win.document.write(`
      <html>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
      win.document.close();

      handleMenuClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to print invoice");
    }
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

      // ================= HEADER =================
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text(`Invoice #${invoice.invoicenumber}`, 10, 10);

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(
        `Date: ${new Date(invoice.invoicedate).toLocaleDateString()}`,
        10,
        20,
      );

      doc.text(`Account: ${accountName}`, 10, 30);
      doc.text(`Description: ${invoice.description || "-"}`, 10, 40);

      // ================= TABLE =================
      autoTable(doc, {
        startY: 50,
        head: [["Product/Service", "Rate", "Quantity", "Amount"]],
        body: invoice.lineItems.map((item) => [
          item.productorService,
          `$${item.rate}`,
          item.quantity,
          `$${item.amount}`,
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
        },
        styles: {
          fontSize: 11,
        },
      });

      // ================= SUMMARY =================
      const summaryY = doc.lastAutoTable.finalY + 10;
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(12);

      doc.text(
        `Subtotal: $${invoice.summary.subtotal.toFixed(2)}`,
        pageWidth - 70,
        summaryY,
      );

      doc.text(
        `Tax: $${invoice.summary.taxTotal.toFixed(2)}`,
        pageWidth - 70,
        summaryY + 10,
      );

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");

      doc.text(
        `Total: $${invoice.summary.total.toFixed(2)}`,
        pageWidth - 70,
        summaryY + 20,
      );

      // ================= DOWNLOAD =================
      doc.save(`Invoice_${invoice.invoicenumber}.pdf`);

      toast.success("Invoice downloaded successfully");
      handleMenuClose();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
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
  return (
    <div className="mt-2 space-y-4">
      <div className="mb-2">
        <Button onClick={() => setOpenDrawer(true)}>Create Invoice</Button>
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
                      {/* {row.invoiceLabel && (
                        <Badge variant="warning" className="ml-1">
                          {row.invoiceLabel}
                        </Badge>
                      )} */}
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

                    <TableCell>${row.summary.total - row.paidAmount}</TableCell>

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
  {row.invoiceStatus === "Pending" && (
    <DropdownMenuItem
      onClick={() => handleEdit(row)}
    >
      Edit
    </DropdownMenuItem>
  )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(row._id)}
                          >
                            Delete
                          </DropdownMenuItem>
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

      {/* <CreateInvoiceDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        fetchInvoices={fetchInvoices}
      /> */}
      <CreateInvoiceDrawer
  open={openDrawer}
  onClose={() => {
    setOpenDrawer(false);
    setEditInvoiceId(null);
  }}
  fetchInvoices={fetchInvoices}
  editInvoiceId={editInvoiceId}
/>
    </div>
  );
};

export default InvoiceTable;
