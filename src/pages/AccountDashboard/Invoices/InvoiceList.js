import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { invoiceAPI } from "../../../services/api"; // adjust path
import { useConfirm } from "../../../components/ConfirmDialogContext";
import CreateInvoiceDrawer from "./CreateInvoiceDrawer";
const InvoiceTable = () => {
  const { accountId } = useParams();
  const  confirm  = useConfirm();
  const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  // Overdue check
  // const isInvoiceOverdue = (invoice, paymentTermDays = 5) => {
  //   if (!invoice.invoicedate || invoice.invoiceStatus === "Paid") return false;

  //   const invoiceDate = new Date(invoice.invoicedate);
  //   const dueDate = new Date(invoiceDate);
  //   dueDate.setDate(dueDate.getDate() + paymentTermDays);

  //   const today = new Date();
  //   const isUnpaid = invoice.invoiceStatus === "Pending";
  //   const hasBalanceDue =
  //     invoice.balanceDueAmount === null || invoice.balanceDueAmount > 0;

  //   return today > dueDate && isUnpaid && hasBalanceDue;
  // };
  const isInvoiceOverdue = (invoice, paymentTermDays = 5) => {
  if (!invoice.invoicedate || invoice.invoiceStatus === "Paid") return false;

  const invoiceDate = new Date(invoice.invoicedate);
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + paymentTermDays);

  const today = new Date();
  
  // Strip time to only compare dates
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  const isUnpaid = invoice.invoiceStatus === "Pending";
  const hasBalanceDue =
    invoice.balanceDueAmount === null || invoice.balanceDueAmount > 0;

  return todayDateOnly > dueDateOnly && isUnpaid && hasBalanceDue;
};

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const res = await invoiceAPI.getInvoiceListByAccountId(accountId);
      console.log("Fetched invoices:", res.data);
      if (res.data?.invoice) {
        const updatedInvoices = await Promise.all(
          res.data.invoice.map(async (invoice) => {
            if (isInvoiceOverdue(invoice)) {
              await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, {
                invoiceStatus: "Overdue",
              });
              return { ...invoice, invoiceStatus: "Overdue" };
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
  const toggleMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      handleMenuClose()
      
    } catch {
      toast.error("Duplicate failed");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box mb={2}>
        <Button variant="contained" onClick={() => setOpenDrawer(true)}>
          Create Invoice
        </Button>{" "}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Posted</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Settings</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {accountInvoicesData.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  {row.invoicenumber}
                  {row.invoiceLabel && (
                    <Chip
                      label={row.invoiceLabel}
                      size="small"
                      color="warning"
                      sx={{ ml: 1 }}
                    />
                  )}
                </TableCell>

                <TableCell>{row.invoiceStatus}</TableCell>

                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>${row.summary.total}</TableCell>

                <TableCell>${row.paidAmount}</TableCell>

                <TableCell>${row.summary.total - row.paidAmount}</TableCell>

                <TableCell>{row.description}</TableCell>

                <TableCell>
                  <IconButton onClick={(e) => toggleMenu(e, row._id)}>
                    <CiMenuKebab />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={openMenuId === row._id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleDelete(row._id)}>
                      Delete
                    </MenuItem>
                    <MenuItem onClick={() => handleDuplicate(row._id)}>
                      Duplicate
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateInvoiceDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        fetchInvoices={fetchInvoices}
      />
    </Box>
  );
};

export default InvoiceTable;
