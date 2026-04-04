import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import { invoiceAPI, accountsAPI } from "../services/api"; // adjust path
import { useNavigate } from "react-router-dom";

const InvoiceTable = () => {
  const [billingInvoice, setBillingInvoice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("active"); // can switch to 'inactive'
const navigate=useNavigate()
  // Fetch invoice data
  const fetchInvoiceData = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get active accounts
      const accountsResponse = await accountsAPI.getAccountsList(filterStatus === "active");
      const accountsData = accountsResponse.data.accountlist || [];

      if (!accountsData.length) {
        console.log("No accounts found");
        setBillingInvoice([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Prepare account IDs
      const accountIds = accountsData.map((acc) => acc._id).join(",");

      // 3️⃣ Fetch invoices for these accounts
      const response = await invoiceAPI.getInvoiceListByAccountId(accountIds);
      const invoices = response.data.invoice || [];

      // 4️⃣ Check overdue invoices and update status
      const updatedInvoices = await Promise.all(
        invoices.map(async (invoice) => {
          const isOverdue = new Date(invoice.scheduleinvoicedate) < new Date() && invoice.invoiceStatus !== "Paid";
          if (isOverdue) {
            await invoiceAPI.updateInvoiceStatus(invoice.invoicenumber, { invoiceStatus: "Overdue" });
            return { ...invoice, invoiceStatus: "Overdue" };
          }
          return invoice;
        })
      );

      setBillingInvoice(updatedInvoices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [filterStatus]);

  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  const handleEdit = (id) => {
    console.log("Edit invoice:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete invoice:", id);
  };

  const handleAccountDash = (invoiceId, accountId) => {
    // console.log("Go to account dashboard:", accountId, "invoice:", invoiceId);
    // navigate(`/`)
    navigate(`/clients/accounts/accountsdash/overview/${accountId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (!billingInvoice.length) {
    return (
      <Box textAlign="center" mt={5}>
        No invoices found.
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ overflow: "visible" }}>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Client</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Invoice #</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Status</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Posted</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Total</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Amount Paid</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Balance due</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Last Paid</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Description</TableCell>
            <TableCell sx={{ fontSize: "12px", fontWeight: "bold", padding: "16px" }}>Settings</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billingInvoice.map((row) => (
            <TableRow key={row._id}>
              <TableCell
                sx={{ fontSize: "12px", padding: "4px 8px", lineHeight: 1, cursor: "pointer", color: "#3f51b5" }}
                onClick={() => handleAccountDash(row._id, row.account?._id)}
              >
                {row.account?.accountName || "—"}
              </TableCell>
              <TableCell
                sx={{ fontSize: "12px", padding: "4px 8px", lineHeight: 1, fontWeight: "normal", cursor: "pointer", color: "#3f51b5" }}
                onClick={() => handleEdit(row._id)}
              >
                {row.invoicenumber}
              </TableCell>
              <TableCell>{row.invoiceStatus || "—"}</TableCell>
              <TableCell>
                {row.createdAt ? new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(row.createdAt)) : "—"}
              </TableCell>
              <TableCell>${row.summary?.total || 0}</TableCell>
              <TableCell>${row.paidAmount || 0}</TableCell>
              <TableCell>${(row.summary?.total || 0) - (row.paidAmount || 0)}</TableCell>
              <TableCell>{row.lastPaid || "—"}</TableCell>
              <TableCell>{row.description || "—"}</TableCell>
              <TableCell sx={{ fontSize: "12px", padding: "4px 8px", lineHeight: 1 }}>
                <IconButton onClick={() => toggleMenu(row._id)} sx={{ color: "#2c59fa" }}>
                  <CiMenuKebab style={{ fontSize: 25 }} />
                  {openMenuId === row._id && (
                    <Box sx={{ position: "absolute", zIndex: 1, backgroundColor: "#fff", boxShadow: 1, borderRadius: 1, p: 1, left: "20px", m: 2, top: "10px", textAlign: "start" }}>
                      <Typography sx={{ fontSize: 12, fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>Edit</Typography>
                      <Typography sx={{ fontSize: 12, color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row._id)}>Delete</Typography>
                    </Box>
                  )}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceTable;