import React, { useEffect, useState, useMemo } from "react";
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
  Button,
  Menu,
  MenuItem,
  Stack,
  TextField,
  TablePagination,
} from "@mui/material";
import { invoiceAPI, accountsAPI } from "../services/api"; // adjust path
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../components/ConfirmDialogContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import CreateInvoiceDrawer from "./AccountDashboard/Invoices/CreateInvoiceDrawer";
const InvoiceTable = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState({ clientName: "", invoiceNumber: "" });
  const [activeFilters, setActiveFilters] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const open = Boolean(anchorEl);

  // ================= FETCH INVOICES =================
  const {
    data: invoicesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invoices", filterStatus],
    queryFn: async () => {
      const accountsRes = await accountsAPI.getAccountsList(
        filterStatus === "active",
      );
      const accountIds = (accountsRes.data.accountlist || [])
        .map((acc) => acc._id)
        .join(",");
      if (!accountIds) return [];

      const res = await invoiceAPI.getInvoiceListByAccountId(accountIds);
      return res.data.invoice || [];
    },
  });

  const invoices = invoicesData || [];

  // ================= FILTERING =================
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchClient = filters.clientName
        ? inv.account?.accountName
            ?.toLowerCase()
            .includes(filters.clientName.toLowerCase())
        : true;

      const matchInvoice = filters.invoiceNumber
        ? inv.invoicenumber
            ?.toLowerCase()
            .includes(filters.invoiceNumber.toLowerCase())
        : true;

      return matchClient && matchInvoice;
    });
  }, [invoices, filters]);

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => invoiceAPI.deleteInvoice(id)));
    },
    onSuccess: () => {
      toast.success("Invoice(s) deleted successfully");
      queryClient.invalidateQueries(["invoices"]);
      setSelectedInvoices([]);
    },
    onError: () => toast.error("Delete failed"),
  });

  // ================= HANDLERS =================

  const handleSelectOne = (id) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((i) => i._id));
    }
  };

  const addFilter = (filter) => {
    if (!activeFilters.includes(filter))
      setActiveFilters([...activeFilters, filter]);
    setAnchorEl(null);
  };

  const clearFilters = () => {
    setFilters({ clientName: "", invoiceNumber: "" });
    setActiveFilters([]);
  };
  const handleAccountDash = (invoiceId, accountId) => {
    navigate(`/clients/accounts/accountsdash/overview/${accountId}`);
  };

  // ================= UI =================
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading invoices</Typography>;
  }

  // if (!filteredInvoices.length) {
  //   return <Box textAlign="center" mt={5}>No invoices found.</Box>;
  // }

  return (
    <Box>
      {/* FILTER SECTION */}
      {/* <Paper
        elevation={0}
        sx={{ p: 2, mb: 2, borderRadius: 3, border: "1px solid #e0e0e0" }}
      >
        <Box>
          {" "}
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            + Add Filter
          </Button>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>

        <Box >
          <Button
            variant="contained"
            color="primary"
            
          >
            + Create Invoice
          </Button>
        </Box>
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => addFilter("clientName")}>Client</MenuItem>
          <MenuItem onClick={() => addFilter("invoiceNumber")}>
            Invoice #
          </MenuItem>
        </Menu>

        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
          {activeFilters.includes("clientName") && (
            <TextField
              size="small"
              label="Client"
              value={filters.clientName}
              onChange={(e) =>
                setFilters({ ...filters, clientName: e.target.value })
              }
            />
          )}
          {activeFilters.includes("invoiceNumber") && (
            <TextField
              size="small"
              label="Invoice #"
              value={filters.invoiceNumber}
              onChange={(e) =>
                setFilters({ ...filters, invoiceNumber: e.target.value })
              }
            />
          )}
        </Stack>
      </Paper> */}
<Paper
  elevation={0}
  sx={{
    p: 2,
    mb: 2,
    borderRadius: 3,
    border: "1px solid #e0e0e0",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
  }}
>
  {/* Filters */}
  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
    <Button
      variant="contained"
      sx={{ mr: 2 }}
      onClick={(e) => setAnchorEl(e.currentTarget)}
    >
      + Add Filter
    </Button>
    <Button variant="outlined" onClick={clearFilters}>
      Clear Filters
    </Button>
    
    <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
      <MenuItem onClick={() => addFilter("clientName")}>Client</MenuItem>
      <MenuItem onClick={() => addFilter("invoiceNumber")}>Invoice #</MenuItem>
    </Menu>
  </Box>

  {/* Active Filter Inputs */}
  <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ flexGrow: 1 }}>
    {activeFilters.includes("clientName") && (
      <TextField
        size="small"
        label="Client"
        value={filters.clientName}
        onChange={(e) => setFilters({ ...filters, clientName: e.target.value })}
      />
    )}
    {activeFilters.includes("invoiceNumber") && (
      <TextField
        size="small"
        label="Invoice #"
        value={filters.invoiceNumber}
        onChange={(e) => setFilters({ ...filters, invoiceNumber: e.target.value })}
      />
    )}
  </Stack>

  {/* Create Invoice Button at the end */}
  <Box>
    <Button
      variant="contained"
      color="primary"
     onClick={() => setOpenDrawer(true)}
    >
      + Create Invoice
    </Button>
  </Box>
</Paper>
      {/* DELETE / SELECT BUTTONS */}
      <Box display="flex" alignItems="center" gap={2} m={2}>
        <Button
          variant="contained"
          color="error"
          disabled={!selectedInvoices.length}
          onClick={() =>
            confirm({
              title: "Delete Invoices?",
              description: `Delete ${selectedInvoices.length} invoice(s)?`,
              onConfirm: () => deleteMutation.mutate(selectedInvoices),
            })
          }
        >
          Delete Selected ({selectedInvoices.length})
        </Button>
        <Button variant="outlined" onClick={handleSelectAll}>
          {selectedInvoices.length === filteredInvoices.length
            ? "Unselect All"
            : "Select All"}
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          overflow: "visible",
          borderRadius: 3,
          border: "1px solid #e0e0e0",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={filteredInvoices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .every((inv) => selectedInvoices.includes(inv._id))}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Invoice #</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Posted</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Balance Due</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Settings</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredInvoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(row._id)}
                      onChange={() => handleSelectOne(row._id)}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer", color: "#3f51b5" }}
                    onClick={() => handleAccountDash(row._id, row.account?._id)}
                  >
                    {row.account?.accountName || "—"}
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer", color: "#3f51b5" }}
                    // onClick={() => handleEdit(row._id)}
                  >
                    {row.invoicenumber || "—"}
                  </TableCell>
                  <TableCell>{row.invoiceStatus || "—"}</TableCell>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>${row.summary?.total || 0}</TableCell>
                  <TableCell>${row.paidAmount || 0}</TableCell>
                  <TableCell>
                    ${(row.summary?.total || 0) - (row.paidAmount || 0)}
                  </TableCell>
                  <TableCell>{row.description || "—"}</TableCell>

                  <TableCell>
                    {/* <IconButton sx={{color:"red"}}><RiDeleteBin6Line/></IconButton> */}
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() =>
                        confirm({
                          title: "Delete Invoice?",
                          description:
                            "Are you sure you want to delete this invoice?",
                          onConfirm: () => deleteMutation.mutate([row._id]),
                        })
                      }
                    >
                      <RiDeleteBin6Line />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredInvoices.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: "1px solid #eee" }}
        />
      </TableContainer>

       <CreateInvoiceDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        // fetchInvoices={filteredInvoices}
        fetchInvoices={() => queryClient.invalidateQueries(["invoices", filterStatus])}
      />
    </Box>
  );
};

export default InvoiceTable;
