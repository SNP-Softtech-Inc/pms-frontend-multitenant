import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { invoiceAPI } from "../../services/api";

const PendingInvoices = ({
  accountId,
  setInvoicesCount,

}) => {
  const [billingInvoices, setBillingInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const response =
        await invoiceAPI.getPendingInvoicesByAccountId(
          accountId
        );

      console.log("response", response.data);

      const invoices = response.data?.invoice || [];

      setBillingInvoices(invoices);

      // send count to parent
      setInvoicesCount?.(invoices.length);
    } catch (error) {
      console.error("Error fetching invoices:", error);

      setInvoicesCount?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchInvoices();
    }
  }, [accountId]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/60">
      <CreditCard className="text-5xl mb-3 opacity-50" />

      <p className="text-sm text-muted-foreground">
        No pending invoices found
      </p>
    </div>
  );

  return (
    <div className="p-4">
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-muted-foreground">
                Loading invoices...
              </p>
            </div>
          ) : billingInvoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    Invoice #
                  </TableHead>

                  <TableHead className="font-semibold">
                    Amount
                  </TableHead>

                  <TableHead className="font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="font-semibold">
                    Due Date
                  </TableHead>

                
                </TableRow>
              </TableHeader>

              <TableBody>
                {billingInvoices.map((invoice, index) => (
                  <TableRow
                    key={invoice._id || index}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                   
                  >
                    {/* Invoice Number */}
                    <TableCell className="font-medium">
                      #{invoice.invoicenumber}
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard
                          size={14}
                          className="text-emerald-500"
                        />

                        <span className="font-semibold">
                          $
                          {invoice?.summary?.total || 0}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge className="bg-red-500 text-white border-0">
                        Pending
                      </Badge>
                    </TableCell>

                    {/* Due Date */}
                    <TableCell>
                      {invoice?.duedate
                        ? new Date(
                            invoice.duedate
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>

                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingInvoices;