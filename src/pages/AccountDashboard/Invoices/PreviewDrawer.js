

import React from "react";
import { X, Download, Printer, Send, ChevronLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";

const PreviewDrawer = ({
  open,
  onClose,
  rows = [],
  description,
  clientNote,
  subtotal = 0,
  taxRate = 0,
  taxTotal = 0,
  totalAmount = 0,
  onSave,
  invoiceNumber = "INV-2024-001",
  invoiceDate = new Date().toLocaleDateString(),
  dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  companyInfo = {
    name: "Your Company Name",
    address: "123 Business Street",
    city: "City, State 12345",
    email: "contact@company.com",
    phone: "+1 (555) 123-4567"
  },
  clientInfo = {
    name: "Client Name",
    address: "456 Client Avenue",
    city: "Client City, State 67890",
    email: "client@example.com",
    phone: "+1 (555) 987-6543"
  },
  currency = "$"
}) => {
  if (!open) return null;

  const formatCurrency = (amount) => {
    return `${currency}${parseFloat(amount || 0).toFixed(2)}`;
  };



  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[900px] lg:w-[1000px] bg-gray-50 shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>
            <Badge variant="secondary" className="ml-2">DRAFT</Badge>
          </div>
          <div className="flex items-center gap-2">
            
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Invoice Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Invoice Header with Gradient */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">INVOICE</h1>
                  <p className="text-orange-100">Payment Receipt</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-white text-sm font-medium">{invoiceNumber}</p>
                    <p className="text-orange-100 text-xs">Invoice Number</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company & Client Info */}
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* From Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">From</h3>
                  </div>
                  <div className="ml-10">
                    <p className="font-medium text-gray-900">{companyInfo.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{companyInfo.address}</p>
                    <p className="text-sm text-gray-600">{companyInfo.city}</p>
                    <p className="text-sm text-gray-600 mt-2">{companyInfo.email}</p>
                    <p className="text-sm text-gray-600">{companyInfo.phone}</p>
                  </div>
                </div>

                {/* To Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">To</h3>
                  </div>
                  <div className="ml-10">
                    <p className="font-medium text-gray-900">{clientInfo.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{clientInfo.address}</p>
                    <p className="text-sm text-gray-600">{clientInfo.city}</p>
                    <p className="text-sm text-gray-600 mt-2">{clientInfo.email}</p>
                    <p className="text-sm text-gray-600">{clientInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Invoice Date</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{invoiceDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{dueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Terms</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">Net 30</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Currency</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{currency} USD</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="px-8 py-4 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Description:</span> {description}
                </p>
              </div>
            )}

            {/* Items Table */}
            <div className="px-8 py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900">Product/Service</TableHead>
                      <TableHead className="font-semibold text-gray-900">Description</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Rate</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Qty</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length > 0 ? (
                      rows.map((row, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium text-gray-900">{row.productName}</TableCell>
                          <TableCell className="text-gray-600">{row.description || "-"}</TableCell>
                          <TableCell className="text-right text-gray-900">{row.rate || "$0.00"}</TableCell>
                          <TableCell className="text-right text-gray-900">{row.qty || "1"}</TableCell>
                          <TableCell className="text-right font-medium text-gray-900">
                            {row.amount || (row.rate * (row.qty || 1))}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No items in this invoice
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Totals Section */}
            {rows.length > 0 && (
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-end">
                  <div className="w-80">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Tax Rate ({taxRate}%):</span>
                        <span className="font-medium text-gray-900">{formatCurrency(taxTotal)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between pt-2">
                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-orange-600">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Note */}
            {clientNote && (
              <div className="px-8 py-6 border-t border-gray-100 bg-white">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{clientNote}</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Thank you for your business! Payment is due within 30 days.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  For any questions regarding this invoice, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-200 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            Close
          </Button>
          <Button
            onClick={onSave}
            className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
          >
            <Send className="h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewDrawer;