

import React, { useState, useMemo } from "react";
import { invoiceAPI, accountsAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../components/ConfirmDialogContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastContext } from "../context/ToastContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import CreateInvoiceDrawer from "./AccountDashboard/Invoices/CreateInvoiceDrawer";

import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";

const InvoiceTable = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const navigate = useNavigate();
const {showToast}= useToastContext()
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active");

  const [filters, setFilters] = useState({
    clientName: "",
    invoiceNumber: "",
  });

  const [activeFilters, setActiveFilters] = useState([]);

  const [openDrawer, setOpenDrawer] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ================= FETCH =================
  const { data: invoicesData = [], isLoading, isError } = useQuery({
    queryKey: ["invoices", filterStatus],
    queryFn: async () => {
      const accountsRes = await accountsAPI.getAccountsList(
        filterStatus === "active"
      );

      const accountIds = (accountsRes.data.accountlist || [])
        .map((acc) => acc._id)
        .join(",");

      if (!accountIds) return [];

      const res = await invoiceAPI.getInvoiceListByAccountId(accountIds);
      return res.data.invoice || [];
    },
  });

  // ================= FILTER =================
  // const filteredInvoices = useMemo(() => {
  //   return invoicesData.filter((inv) => {
  //     const matchClient = filters.clientName
  //       ? inv.account?.accountName
  //           ?.toLowerCase()
  //           .includes(filters.clientName.toLowerCase())
  //       : true;

  //     const matchInvoice = filters.invoiceNumber
  //       ? inv.invoicenumber
  //           ?.toLowerCase()
  //           .includes(filters.invoiceNumber.toLowerCase())
  //       : true;

  //     return matchClient && matchInvoice;
  //   });
  // }, [invoicesData, filters]);
const filteredInvoices = useMemo(() => {
  return invoicesData.filter((inv) => {
    const matchClient = filters.clientName
      ? String(inv.account?.accountName || "")
          .toLowerCase()
          .includes(filters.clientName.toLowerCase())
      : true;

    const matchInvoice = filters.invoiceNumber
      ? String(inv.invoicenumber || "")
          .toLowerCase()
          .includes(filters.invoiceNumber.toLowerCase())
      : true;

    return matchClient && matchInvoice;
  });
}, [invoicesData, filters]);
  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => invoiceAPI.deleteInvoice(id)));
    },
    onSuccess: () => {
     showToast({
      title: "Invoice(s) deleted successfully",
      description: "The selected invoices have been removed.",
      type: "success",
    });

      queryClient.invalidateQueries(["invoices"]);
      setSelectedInvoices([]);
    },
    onError: () => showToast({
      title: "Error",
      description: "Failed to delete invoices",
      type: "error",
    }),
  });

  // ================= HANDLERS =================
  const handleSelectOne = (id) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setFilters({ clientName: "", invoiceNumber: "" });
    setActiveFilters([]);
  };

  const handleAccountDash = (invoiceId, accountId) => {
    navigate(`/clients/accounts/accountsdash/overview/${accountId}`);
  };

  // ================= COLUMNS =================
  const columns = [
   
    {
      accessorKey: "account.accountName",
      header: "Client",
      cell: ({ row }) => (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() =>
            handleAccountDash(
              row.original._id,
              row.original.account?._id
            )
          }
        >
          {row.original.account?.accountName || "—"}
        </span>
      ),
    },
    {
      accessorKey: "invoicenumber",
      header: "Invoice #",
    },
    {
      accessorKey: "invoiceStatus",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Posted",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "—",
    },
    {
      header: "Total",
      cell: ({ row }) => `$${row.original.summary?.total || 0}`,
    },
    {
      header: "Paid",
      cell: ({ row }) => `$${row.original.paidAmount || 0}`,
    },
    {
      header: "Balance",
      cell: ({ row }) =>
        `$${(row.original.summary?.total || 0) -
          (row.original.paidAmount || 0)}`,
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="icon"
          onClick={() =>
            confirm({
              title: "Delete Invoice?",
              description: "Are you sure you want to delete this invoice?",
              onConfirm: () =>
                deleteMutation.mutate([row.original._id]),
            })
          }
        >
          <RiDeleteBin6Line />
        </Button>
      ),
    },
  ];

  // ================= PAGINATION =================
  const paginatedData = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div>Error loading invoices</div>;

  return (
    <div className="space-y-4">
    
      <DataTableToolbar>
  <div className="flex w-full justify-between items-center">
    
    {/* LEFT SIDE (Filters + Search) */}
    <div className="flex flex-wrap gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>+ Add Filter</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => addFilter("clientName")}>
            Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addFilter("invoiceNumber")}>
            Invoice #
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" onClick={clearFilters}>
        Clear Filters
      </Button>

      {activeFilters.includes("clientName") && (
        <Input
          placeholder="Client"
          value={filters.clientName}
          onChange={(e) =>
            setFilters({ ...filters, clientName: e.target.value })
          }
        />
      )}

      {activeFilters.includes("invoiceNumber") && (
        <Input
          placeholder="Invoice #"
          value={filters.invoiceNumber}
          onChange={(e) =>
            setFilters({
              ...filters,
              invoiceNumber: e.target.value,
            })
          }
        />
      )}
    </div>

    {/* RIGHT SIDE (Actions) */}
    <div className="flex gap-2">
      <Button onClick={() => setOpenDrawer(true)}>
        + Create Invoice
      </Button>

      <Button
        variant="destructive"
        disabled={!selectedInvoices.length}
        onClick={() =>
          confirm({
            title: "Delete Invoices?",
            description: `Delete ${selectedInvoices.length} invoice(s)?`,
            onConfirm: () =>
              deleteMutation.mutate(selectedInvoices),
          })
        }
      >
        Delete ({selectedInvoices.length})
      </Button>
    </div>

  </div>
</DataTableToolbar>

      {/* TABLE */}
      <DataTable columns={columns} data={paginatedData} />

     

      {/* DRAWER */}
      <CreateInvoiceDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        fetchInvoices={() =>
          queryClient.invalidateQueries(["invoices", filterStatus])
        }
      />
    </div>
  );
};

export default InvoiceTable;