import React, { useState, useEffect } from "react";

import SingleSelectDropdown from "../../../components/SingleSelectDropdown";

import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import dayjs from "dayjs";
import { useToastContext } from "../../../context/ToastContext";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { cn } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { ExternalLink } from "lucide-react";
import { invoiceAPI } from "../../../services/api";
import { useQueryClient } from "@tanstack/react-query";

const OfflinePaymentDrawer = ({ open, onClose }) => {
 const queryClient = useQueryClient();
  const { showToast } = useToastContext();
  const [selectedAccount, setSelectedAccount] = useState(null);
  console.log("selected account id with name", selectedAccount);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [notifyClient, setNotifyClient] = useState(false);
  const [paymentMode, setPaymentMode] = useState({
    value: "Cash",
    label: "Cash",
  });

  const [rate, setRate] = useState("$ 0.00");
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const paymentsOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    {
      value: "Credit Card or Bank Debits",
      label: "Credit Card or Bank Debits",
    },
  ];
  const handleRateChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");

    // Allow only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 2 decimal places
    if (value.includes(".")) {
      const [whole, decimal] = value.split(".");
      value = `${whole}.${decimal.slice(0, 2)}`;
    }

    setRate(`$ ${value}`);
  };
  const handlePaymentOptionChange = (value) => {
    setPaymentMode(paymentsOptions.find((opt) => opt.value === value));
  };
  useEffect(() => {
    if (!selectedAccount?.value) return;

    const fetchInvoices = async () => {
      try {
        const res = await invoiceAPI.getPendingInvoicesByAccountId(
          selectedAccount.value,
        );

        setInvoiceList(res.data?.invoice || []);
        console.log("invoice list for the acc", res.data.invoice);
      } catch (err) {
        console.log(err);
      }
    };

    fetchInvoices();
  }, [selectedAccount]);
  const toggleInvoice = (invoice) => {
    const exists = selectedInvoices.find((i) => i._id === invoice._id);

    if (exists) {
      setSelectedInvoices((prev) => prev.filter((i) => i._id !== invoice._id));
    } else {
      setSelectedInvoices((prev) => [...prev, invoice]);
    }
  };

const totalSelected = selectedInvoices.reduce(
  (sum, item) => sum + Number(item.summary?.total || item.total || 0),
  0,
);
 
    const handleSave = async () => {
  try {
    setSaving(true);

    const amount = Number(rate.replace(/[^0-9.]/g, ""));

    await invoiceAPI.offlinePayment({
      accountId: selectedAccount.value,
      amount,
      paymentMethod: paymentMode.value,
      description,
      paymentDate: startDate.toISOString(),
      notifyClient,
      invoices: selectedInvoices.map((item) => item._id),
        paidAmount: totalSelected,
    });

    // Refresh account details everywhere
    queryClient.invalidateQueries({
      queryKey: ["account-details", selectedAccount.value],
    });

    // Refresh invoice list everywhere
    queryClient.invalidateQueries({
      queryKey: ["account-invoices", selectedAccount.value],
    });

    showToast({
      title: "Offline payment added successfully",
      type: "success",
    });

    handleClose();
  } catch (error) {
    showToast({
      title:
        error.response?.data?.message || "Failed to save offline payment",
      type: "error",
    });
  } finally {
    setSaving(false);
  }
};
const resetForm = () => {
  setSelectedAccount(null);
  setStartDate(dayjs());
  setDescription("");
  setInvoiceList([]);
  setSelectedInvoices([]);
  setNotifyClient(false);
  setPaymentMode({
    value: "Cash",
    label: "Cash",
  });
  setRate("$ 0.00");
};
const handleClose = () => {
  resetForm();
  onClose();
};
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className="
      absolute right-0 top-0 h-full w-full sm:w-[650px]
      bg-background text-foreground
      shadow-xl flex flex-col
      border-l border-border
    "
      >
        {/* Header */}
        <div
          className="
        flex items-center justify-between px-5 py-4
        border-b border-border shrink-0
      "
        >
          <h2 className="text-base font-semibold text-foreground">
            Offline Payment
          </h2>

          <button
            onClick={onClose}
            className="
            p-1 rounded-md
            text-muted-foreground
            hover:text-foreground hover:bg-accent
            transition-colors
          "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* Account */}
              <Label className="text-sm font-medium text-foreground">
                Account name, ID or email
              </Label>
              <SingleSelectDropdown
                value={selectedAccount}
                onChange={setSelectedAccount}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">
                Date
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1 border-border bg-background text-foreground hover:bg-accent",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    {startDate ? (
                      startDate.format("MM/DD/YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 bg-popover border border-border text-popover-foreground">
                  <Calendar
                    mode="single"
                    selected={startDate ? startDate.toDate() : undefined}
                    onSelect={(date) =>
                      date && handleStartDateChange(dayjs(date))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Amount
              </label>
              <input
                type="text"
                placeholder="$ 0.00"
                value={rate}
                onChange={handleRateChange}
                className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">
                Payment Method
              </Label>

              <Select
                value={paymentMode?.value}
                onValueChange={handlePaymentOptionChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>

                <SelectContent>
                  {paymentsOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow resize-none"
            />
          </div>
          <div className="mt-5 flex items-center space-x-2">
            <Checkbox
              checked={notifyClient}
              onCheckedChange={setNotifyClient}
            />

            <Label className="font-normal">Notify client by email</Label>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-base">
              Settle invoices paid outside of your system
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              Payments must cover the entire balance due. Partial payments are
              not supported.
            </p>
          </div>
          <div className="mt-5 rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 w-12"></th>
                  <th className="text-left p-3">Invoice #</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-right p-3">Amount</th>
                  <th className="w-12"></th>
                </tr>
              </thead>

              <tbody>
                {invoiceList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No Pending Invoice
                    </td>
                  </tr>
                ) : (
                  invoiceList.map((invoice) => {
                    const checked = selectedInvoices.some(
                      (i) => i._id === invoice._id,
                    );

                    return (
                      <tr
                        key={invoice._id}
                        className="border-t hover:bg-muted/40"
                      >
                        <td className="p-3">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleInvoice(invoice)}
                          />
                        </td>

                        <td className="p-3 font-medium text-blue-600">
                          {invoice.invoicenumber}
                        </td>

                        <td className="p-3">
                          {dayjs(invoice.invoiceDate).format("MMM DD YYYY")}
                        </td>

                        <td className="p-3 text-right">
                          $
                          {Number(
                            invoice.summary.total || invoice.total || 0,
                          ).toFixed(2)}
                        </td>

                        {/* <td className="p-3">
                          <ExternalLink
                            className="h-4 w-4 cursor-pointer text-muted-foreground"
                            onClick={() =>
                              window.open(`/invoice/${invoice._id}`, "_blank")
                            }
                          />
                        </td> */}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
        flex items-center justify-end gap-3 px-5 py-4
        border-t border-border shrink-0
        bg-background
      "
        >
          <button
            onClick={handleClose}
            className="
            h-9 px-4 text-sm font-medium
            border border-border rounded-lg
            text-foreground hover:bg-accent
          "
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={handleSave}
            className="
            h-9 px-4 text-sm font-medium
            bg-primary text-primary-foreground
            rounded-lg hover:bg-primary/90
            transition-colors disabled:opacity-50
          "
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflinePaymentDrawer;
