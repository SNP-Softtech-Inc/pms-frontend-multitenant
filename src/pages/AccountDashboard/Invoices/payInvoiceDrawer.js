// import React from 'react'
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "../../../components/ui/sheet";
// import { Button } from "../../../components/ui/button";
// import {useToastContext} from "../../../context/ToastContext";
// import { invoiceAPI } from "../../../services/api";
// import { useQueryClient } from "@tanstack/react-query";

// const payInvoiceDrawer = ({
//   open,
//   setOpen,
//   selectedInvoice,
//   availableCredit,
//     amountToPay,
// }) => {

//      const queryClient = useQueryClient();
    
//     const {showToast} = useToastContext();
//    const handleProceedPayment = async () => {
//   try {
//     const payload = {
//       invoiceId: selectedInvoice._id,
//       accountId: selectedInvoice.account,
//       creditApplied: Math.min(
//         availableCredit,
//         selectedInvoice.summary.total
//       ),
//       amountPaid: amountToPay,
//     };

//     await invoiceAPI.payAdminInvoice(payload);
//     // Refresh account details everywhere
//     queryClient.invalidateQueries({
//       queryKey: ["account-details", selectedAccount.value],
//     });

//     // Refresh invoice list everywhere
//     queryClient.invalidateQueries({
//       queryKey: ["account-invoices", selectedAccount.value],
//     });

// showToast({
//       title: "Payment Successful",
//       description: "Invoice paid successfully."
//     });
//     setOpen(false);
//   } catch (err) {
//     showToast({
//       title: "Payment Failed",
//       description: err.response?.data?.message || "Payment failed"
//     });
//   }
// };
//   return (

    
//     <div>
//  <Sheet open={open} onOpenChange={setOpen}>
//   <SheetContent side="right" className="w-[450px]">

//     <SheetHeader>
//       <SheetTitle>Pay Invoice</SheetTitle>
//     </SheetHeader>

//     {selectedInvoice && (
//       <div className="space-y-5 mt-6">

//         <div>
//           <p className="text-sm text-gray-500">Invoice Number</p>
//           <p className="font-semibold">
//             {selectedInvoice.invoicenumber}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">Invoice Amount</p>
//           <p className="font-semibold">
//             ${selectedInvoice.summary.total.toFixed(2)}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">Credit applied</p>
//           <p className="font-semibold text-green-600">
//             ${availableCredit.toFixed(2)}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">Amount to Pay</p>

//           <p className="font-bold text-xl">
//             ${amountToPay.toFixed(2)}
//           </p>

//           {amountToPay === 0 && (
//             <p className="text-green-600 text-sm">
//               This invoice can be fully paid using available credit.
//             </p>
//           )}
//         </div>

//         <Button
//           className="w-full"
//           onClick={handleProceedPayment}
//         >
//           Proceed Payment
//         </Button>

//       </div>
//     )}

//   </SheetContent>
// </Sheet>
//     </div>
//   )
// }

// export default payInvoiceDrawer

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { useToastContext } from "../../../context/ToastContext";
import { invoiceAPI } from "../../../services/api";
import { useQueryClient } from "@tanstack/react-query";

const PayInvoiceDrawer = ({
  open,
  setOpen,
  selectedInvoice,
  availableCredit,
  amountToPay,
}) => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();
console.log("selectedInvoice", selectedInvoice);
  const [loading, setLoading] = useState(false);

  const handleProceedPayment = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const payload = {
        invoiceId: selectedInvoice._id,
        accountId: selectedInvoice.account,
        creditApplied: Math.min(
          availableCredit,
          selectedInvoice.summary.total
        ),
        amountPaid: amountToPay,
      };

      await invoiceAPI.payAdminInvoice(payload);

      // Refresh account details
      queryClient.invalidateQueries({
        queryKey: ["account-details", selectedInvoice.account._id],
      });

      // Refresh invoice list
      queryClient.invalidateQueries({
        queryKey: ["account-invoices", selectedInvoice.account._id],
      });

      showToast({
        title: "Payment Successful",
        description: "Invoice paid successfully.",
      });

      setOpen(false);
    } catch (err) {
      showToast({
        title: "Payment Failed",
        description:
          err.response?.data?.message || "Payment failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[450px]">
        <SheetHeader>
          <SheetTitle>Pay Invoice</SheetTitle>
        </SheetHeader>

        {selectedInvoice && (
          <div className="space-y-5 mt-6">
            <div>
              <p className="text-sm text-gray-500">Invoice Number</p>
              <p className="font-semibold">
                {selectedInvoice.invoicenumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Invoice Amount</p>
              <p className="font-semibold">
                ${selectedInvoice.summary.total.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Credit Applied</p>
              <p className="font-semibold text-green-600">
                ${availableCredit.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount to Pay</p>

              <p className="font-bold text-xl">
                ${amountToPay.toFixed(2)}
              </p>

              {amountToPay === 0 && (
                <p className="text-green-600 text-sm">
                  This invoice can be fully paid using available credit.
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleProceedPayment}
              disabled={loading}
            >
              {loading ? "Processing Payment..." : "Proceed Payment"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default PayInvoiceDrawer;