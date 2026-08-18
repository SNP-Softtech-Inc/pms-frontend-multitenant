import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { accountsAPI, invoiceAPI } from "../../../services/api";
import { CardContent } from "../../../components/ui/card";
import { Trash2 } from "lucide-react";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { useToastContext } from "../../../context/ToastContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";

const Payment = () => {
  const queryClient = useQueryClient();
    const { accountId } = useParams();
const confirm = useConfirm();
const accountName = Cookies.get("accountName");
const { showToast } = useToastContext();
  // const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // const fetchPayments = async () => {
  //   if (!accountId) return;

  //   try {
  //     setLoading(true);

  //     const res =
  //       await invoiceAPI.getOfflinePaymentsByAccountId(accountId);

  //     setPayments(res.data.payments || []);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchPayments();
  // }, [accountId]);
// =========================
  // Payments Query
  // =========================
  const {
    data: payments = [],
    isLoading: paymentLoading,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["account-payments", accountId],

    queryFn: async () => {
      const res =
        await invoiceAPI.getOfflinePaymentsByAccountId(accountId);

      return res.data?.payments || [];
    },

    enabled: !!accountId,
    refetchOnWindowFocus: true,
  });
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
);  const availableCredit = account?.creaditAval || 0;
  const columns = useMemo(
    () => [
      {
        accessorKey: "paymentNumber",
        header: "Payment #",
      },
      {
        accessorKey: "paymentDate",
        header: "Date",
        cell: ({ row }) =>
          dayjs(row.original.paymentDate).format("MMM-DD-YYYY"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <Badge
              className={
                status === "Successful"
                  ? "bg-green-500 hover:bg-green-500"
                  : status === "Pending"
                  ? "bg-yellow-500 hover:bg-yellow-500"
                  : status === "Refunded"
                  ? "bg-blue-500 hover:bg-blue-500"
                  : "bg-red-500 hover:bg-red-500"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) =>
          `$${Number(row.original.amount || 0).toFixed(2)}`,
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Method",
      },
      {
        accessorKey: "invoices",
        header: "Invoices Paid",
        cell: ({ row }) =>
          row.original.invoices?.length
            ? row.original.invoices
                .map((item) => item.invoicenumber)
                .join(", ")
            : "-",
      },
      {
        accessorKey: "refundAmt",
        header: "Refund",
        cell: ({ row }) =>
          row.original.refundAmt > 0 ? (
            <span className="text-red-500 font-medium">
              ${Number(row.original.refundAmt).toFixed(2)}
            </span>
          ) : (
            "-"
          ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[250px] truncate">
            {row.original.description || "-"}
          </div>
        ),
      },
      {
        accessorKey: "paymentProvider",
        header: "Payment Provider",
        cell: ({ row }) =>
          row.original.paymentProvider || "Offline",
      },
      {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <button
      onClick={() => handleDeletePayment(row.original)}
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  ),
}
    ],
    []
  );

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


const handleDeletePayment = async (payment) => {
  confirm({
    title: `Delete payment #${payment.paymentNumber}?`,
    description: `This payment was made by ${
      accountName
    } on ${dayjs(payment.paymentDate).format(
      "MMM D"
    )} and amounts to $${Number(payment.amount).toFixed(
      2
    )}. If you delete it, all associated information will be permanently lost.`,

    confirmText: "Delete",
    cancelText: "Cancel",

    onConfirm: async () => {
      try {
        await invoiceAPI.deleteOfflinePayment(payment._id);

        showToast({
          title: "Payment deleted successfully.",
          type: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["account-payments", accountId],
        });
        queryClient.invalidateQueries({
          queryKey: ["account-invoices", accountId],
        });
        queryClient.invalidateQueries({
          queryKey: ["account-details", accountId],
        });
      } catch (err) {
        showToast({
          title:
            err.response?.data?.message || "Unable to delete payment.",
          type: "error",
        });
      }
    },
  });
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
           
    
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Outstanding Balance</div>
                <div className="text-2xl font-bold text-green-600">
                  ${invoiceSummary.netDue.toFixed(2)}
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
    <Card className="rounded-xl border shadow-sm overflow-hidden">
    
  
    
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-semibold whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center h-24"
              >
                No payments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
    </div>
  );
};

export default Payment;