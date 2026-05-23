// // import React from "react";
// // import {
// //   Drawer,
// //   Box,
// //   Typography,
// //   Divider,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Button,
// //   useTheme,
// //   useMediaQuery,
// // } from "@mui/material";
// // import CloseIcon from "@mui/icons-material/Close";

// // const PreviewDrawer = ({
// //   open,
// //   onClose,
// //   rows,
// //   description,
// //   clientNote,
// //   subtotal,
// //   taxRate,
// //   taxTotal,
// //   totalAmount,
// //   onSave,
// // }) => {
// //   const theme = useTheme();
// //   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

// //   return (
// //     <Drawer
// //       anchor="right"
// //       open={open}
// //       onClose={onClose}
// //       PaperProps={{
// //         sx: {
// //           width: isSmallScreen ? "100%" : 800,
// //           p: 2,
// //           background: "#f8fafc",
// //         },
// //       }}
// //     >
// //       <Box sx={{ padding: 4 }}>
// //         {/* Invoice Header */}
// //         <Box
// //           sx={{
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "space-between",
// //           }}
// //         >
// //           <Typography>Preview</Typography>
// //           <CloseIcon
// //             sx={{ cursor: "pointer", color: "rgb(24, 118, 211)" }}
// //             onClick={onClose}
// //           />
// //         </Box>
// //         <Divider sx={{ mt: 2 }} />

// //         {/* Table */}
// //         <TableContainer
// //           component={Paper}
// //           sx={{
// //             background: "#fdfdfd",
// //             marginBottom: 4,
// //             height: { xs: "50vh", md: "auto" },
// //             mt: 4,
// //           }}
// //         >
// //           <Typography
// //             variant="h5"
// //             sx={{
// //               color: "#ff6700",
// //               fontWeight: "bold",
// //               marginBottom: 2,
// //               ml: 2,
// //               mt: 2,
// //             }}
// //           >
// //             Invoice
// //           </Typography>
// //           <Box
// //             sx={{
// //               display: "flex",
// //               flexDirection: "row",
// //               alignItems: "center",
// //               justifyContent: "space-between",
// //             }}
// //           >
// //             <Typography
// //               sx={{
// //                 color: "#cbd5e1",
// //                 marginBottom: 2,
// //                 ml: 2,
// //                 fontSize: 13,
// //               }}
// //             >
// //               [ACCOUNT_NAME]
// //             </Typography>
// //             <Typography fontSize={13}>
// //               Invoice number:{" "}
// //               <Typography
// //                 component="span"
// //                 sx={{
// //                   color: "#cbd5e1",
// //                   mr: 2,
// //                   marginBottom: 2,
// //                   fontSize: 13,
// //                 }}
// //               >
// //                 [INVOICE_NUMBER]
// //               </Typography>
// //             </Typography>
// //           </Box>

// //           <Box
// //             sx={{
// //               display: "flex",
// //               flexDirection: "row",
// //               alignItems: "center",
// //               justifyContent: "space-between",
// //             }}
// //           >
// //             <Typography
// //               sx={{
// //                 color: "#cbd5e1",
// //                 marginBottom: 2,
// //                 ml: 2,
// //                 fontSize: 13,
// //               }}
// //             >
// //               [CONTACT_NAME]
// //             </Typography>
// //             <Typography fontSize={13}>
// //               Date:{" "}
// //               <Typography
// //                 component="span"
// //                 sx={{
// //                   color: "#cbd5e1",
// //                   mr: 2,
// //                   marginBottom: 2,
// //                   fontSize: 13,
// //                 }}
// //               >
// //                 [DATE]
// //               </Typography>
// //             </Typography>
// //           </Box>

// //           <Box sx={{ ml: 2, marginBottom: 5 }}>
// //             <Typography sx={{ fontSize: 13 }}>
// //               Description: {description}
// //             </Typography>
// //           </Box>

// //           <Table sx={{ marginBottom: 10 }}>
// //             <TableHead>
// //               <TableRow sx={{ background: "#fff8f5" }}>
// //                 <TableCell>
// //                   <strong>Product/Service</strong>
// //                 </TableCell>
// //                 <TableCell>
// //                   <strong>Description</strong>
// //                 </TableCell>
// //                 <TableCell align="right">
// //                   <strong>Rate ($)</strong>
// //                 </TableCell>
// //                 <TableCell align="right">
// //                   <strong>Qty</strong>
// //                 </TableCell>
// //                 <TableCell align="right">
// //                   <strong>Amount</strong>
// //                 </TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {rows.map((row, index) => (
// //                 <TableRow key={index}>
// //                   <TableCell>{row.productName}</TableCell>
// //                   <TableCell>{row.description}</TableCell>
// //                   <TableCell align="right">{row.rate || "$0.00"}</TableCell>
// //                   <TableCell align="right">{row.qty || "1"}</TableCell>
// //                   <TableCell align="right">{row.amount || "$0.00"}</TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>

// //         {/* Summary Section */}
// //         <Box
// //           sx={{
// //             display: "flex",
// //             flexDirection: "column",
// //             alignItems: "flex-end",
// //             marginRight: 3,
// //             mt: 0,
// //           }}
// //         >
// //           <Typography sx={{ textAlign: "right", width: "100%" }}>
// //             <strong>Subtotal:</strong> ${subtotal || "0.00"}
// //           </Typography>
// //           <Typography sx={{ textAlign: "right", width: "100%" }}>
// //             <strong>Tax Rate:</strong> {taxRate || "0.00"}%
// //           </Typography>
// //           <Typography sx={{ textAlign: "right", width: "100%" }}>
// //             <strong>Tax Total:</strong> ${taxTotal?.toFixed(2) || "0.00"}
// //           </Typography>
// //           <Typography
// //             sx={{
// //               textAlign: "right",
// //               fontWeight: "bold",
// //               width: "100%",
// //               marginTop: 1,
// //             }}
// //           >
// //             <strong>Total:</strong> ${totalAmount || "0.00"}
// //           </Typography>
// //         </Box>

// //         {/* <Box>{clientNote}</Box> */}

// //         {/* Footer Buttons */}
// //         <Box
// //           sx={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             marginTop: 3,
// //           }}
// //         >
// //           <Button
// //             variant="contained"
// //             color="primary"
// //             onClick={onSave}
            
// //           >
// //             Save & Exit
// //           </Button>
// //         </Box>
// //       </Box>
// //     </Drawer>
// //   );
// // };

// // export default PreviewDrawer;

// import React from "react";
// import { X } from "lucide-react";
// import { Button } from "../../../components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table";

// const PreviewDrawer = ({
//   open,
//   onClose,
//   rows,
//   description,
//   clientNote,
//   subtotal,
//   taxRate,
//   taxTotal,
//   totalAmount,
//   onSave,
// }) => {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden">
//       <div 
//         className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
//         onClick={onClose} 
//       />
//       <div className="absolute right-0 top-0 h-full w-full sm:w-[800px] bg-slate-50 shadow-xl flex flex-col">
//         <div className="flex-1 overflow-y-auto p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-base font-semibold text-foreground">
//               Preview
//             </h2>
//             <button 
//               onClick={onClose} 
//               className="p-1 rounded-md text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//           <div className="border-t border-border" />

//           {/* Invoice Container */}
//           <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
//             {/* Invoice Header */}
//             <div className="p-4">
//               <h1 className="text-2xl font-bold text-[#ff6700] mb-4">
//                 Invoice
//               </h1>
              
//               <div className="flex flex-col space-y-2">
//                 <div className="flex justify-between items-start">
//                   <p className="text-sm text-slate-400">[ACCOUNT_NAME]</p>
//                   <p className="text-sm">
//                     Invoice number:{" "}
//                     <span className="text-slate-400">[INVOICE_NUMBER]</span>
//                   </p>
//                 </div>
                
//                 <div className="flex justify-between items-start">
//                   <p className="text-sm text-slate-400">[CONTACT_NAME]</p>
//                   <p className="text-sm">
//                     Date:{" "}
//                     <span className="text-slate-400">[DATE]</span>
//                   </p>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="mt-4 mb-6">
//                 <p className="text-sm">
//                   Description: {description}
//                 </p>
//               </div>

//               {/* Table */}
//               <div className="rounded-md border overflow-x-auto">
//                 <Table>
//                   <TableHeader className="bg-orange-50">
//                     <TableRow>
//                       <TableHead className="font-semibold">Product/Service</TableHead>
//                       <TableHead className="font-semibold">Description</TableHead>
//                       <TableHead className="font-semibold text-right">Rate ($)</TableHead>
//                       <TableHead className="font-semibold text-right">Qty</TableHead>
//                       <TableHead className="font-semibold text-right">Amount</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {rows.map((row, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{row.productName}</TableCell>
//                         <TableCell>{row.description}</TableCell>
//                         <TableCell className="text-right">{row.rate || "$0.00"}</TableCell>
//                         <TableCell className="text-right">{row.qty || "1"}</TableCell>
//                         <TableCell className="text-right">{row.amount || "$0.00"}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>

//           {/* Summary Section */}
//           <div className="flex flex-col items-end mt-6 space-y-1">
//             <p className="text-right">
//               <strong>Subtotal:</strong> ${subtotal || "0.00"}
//             </p>
//             <p className="text-right">
//               <strong>Tax Rate:</strong> {taxRate || "0.00"}%
//             </p>
//             <p className="text-right">
//               <strong>Tax Total:</strong> ${taxTotal?.toFixed(2) || "0.00"}
//             </p>
//             <p className="text-right font-bold mt-2">
//               <strong>Total:</strong> ${totalAmount || "0.00"}
//             </p>
//           </div>

//           {/* Client Note (commented in original) */}
//           {/* <div>{clientNote}</div> */}
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
//           <Button
//             onClick={onSave}
//             className="bg-primary text-primary-foreground hover:bg-primary/90"
//           >
//             Save & Exit
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreviewDrawer;

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

// const PreviewDrawer = ({
//   open,
//   onClose,
//   rows = [],
//   description,
//   clientNote,
//   subtotal = 0,
//   taxRate = 0,
//   taxTotal = 0,
//   totalAmount = 0,
//   onSave,
//   invoiceNumber = "INV-2024-001",
//   invoiceDate = new Date().toLocaleDateString(),
//   dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
//   companyInfo = {
//     name: "Your Company Name",
//     address: "123 Business Street",
//     city: "City, State 12345",
//     email: "contact@company.com",
//     phone: "+1 (555) 123-4567"
//   },
//   clientInfo = {
//     name: "Client Name",
//     address: "456 Client Avenue",
//     city: "Client City, State 67890",
//     email: "client@example.com",
//     phone: "+1 (555) 987-6543"
//   },
//   currency = "$"
// }) => {
//   if (!open) return null;

//   const formatCurrency = (amount) => {
//     return `${currency}${parseFloat(amount || 0).toFixed(2)}`;
//   };



//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
//         onClick={onClose} 
//       />
      
//       {/* Drawer */}
//       <div className="absolute right-0 top-0 h-full w-full sm:w-[900px] lg:w-[1000px] bg-gray-50 shadow-2xl flex flex-col">
//         {/* Drawer Header */}
//         <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={onClose} 
//               className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//             <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>
//             <Badge variant="secondary" className="ml-2">DRAFT</Badge>
//           </div>
//           <div className="flex items-center gap-2">
            
//             <button 
//               onClick={onClose} 
//               className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//           {/* Invoice Container */}
//           <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//             {/* Invoice Header with Gradient */}
//             <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h1 className="text-4xl font-bold text-white mb-2">INVOICE</h1>
//                   <p className="text-orange-100">Payment Receipt</p>
//                 </div>
//                 <div className="text-right">
//                   <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
//                     <p className="text-white text-sm font-medium">{invoiceNumber}</p>
//                     <p className="text-orange-100 text-xs">Invoice Number</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Company & Client Info */}
//             <div className="px-8 py-6 border-b border-gray-100">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* From Section */}
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
//                       <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                     </div>
//                     <h3 className="font-semibold text-gray-900">From</h3>
//                   </div>
//                   <div className="ml-10">
//                     <p className="font-medium text-gray-900">{companyInfo.name}</p>
//                     <p className="text-sm text-gray-600 mt-1">{companyInfo.address}</p>
//                     <p className="text-sm text-gray-600">{companyInfo.city}</p>
//                     <p className="text-sm text-gray-600 mt-2">{companyInfo.email}</p>
//                     <p className="text-sm text-gray-600">{companyInfo.phone}</p>
//                   </div>
//                 </div>

//                 {/* To Section */}
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                     <h3 className="font-semibold text-gray-900">To</h3>
//                   </div>
//                   <div className="ml-10">
//                     <p className="font-medium text-gray-900">{clientInfo.name}</p>
//                     <p className="text-sm text-gray-600 mt-1">{clientInfo.address}</p>
//                     <p className="text-sm text-gray-600">{clientInfo.city}</p>
//                     <p className="text-sm text-gray-600 mt-2">{clientInfo.email}</p>
//                     <p className="text-sm text-gray-600">{clientInfo.phone}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Invoice Details */}
//             <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase tracking-wide">Invoice Date</p>
//                   <p className="text-sm font-medium text-gray-900 mt-1">{invoiceDate}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
//                   <p className="text-sm font-medium text-gray-900 mt-1">{dueDate}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Terms</p>
//                   <p className="text-sm font-medium text-gray-900 mt-1">Net 30</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase tracking-wide">Currency</p>
//                   <p className="text-sm font-medium text-gray-900 mt-1">{currency} USD</p>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             {description && (
//               <div className="px-8 py-4 border-b border-gray-100">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Description:</span> {description}
//                 </p>
//               </div>
//             )}

//             {/* Items Table */}
//             <div className="px-8 py-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
//               <div className="rounded-lg border border-gray-200 overflow-hidden">
//                 <Table>
//                   <TableHeader className="bg-gray-50">
//                     <TableRow>
//                       <TableHead className="font-semibold text-gray-900">Product/Service</TableHead>
//                       <TableHead className="font-semibold text-gray-900">Description</TableHead>
//                       <TableHead className="font-semibold text-gray-900 text-right">Rate</TableHead>
//                       <TableHead className="font-semibold text-gray-900 text-right">Qty</TableHead>
//                       <TableHead className="font-semibold text-gray-900 text-right">Amount</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {rows.length > 0 ? (
//                       rows.map((row, index) => (
//                         <TableRow key={index} className="hover:bg-gray-50 transition-colors">
//                           <TableCell className="font-medium text-gray-900">{row.productName}</TableCell>
//                           <TableCell className="text-gray-600">{row.description || "-"}</TableCell>
//                           <TableCell className="text-right text-gray-900">{row.rate || "$0.00"}</TableCell>
//                           <TableCell className="text-right text-gray-900">{row.qty || "1"}</TableCell>
//                           <TableCell className="text-right font-medium text-gray-900">
//                             {row.amount || (row.rate * (row.qty || 1))}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={5} className="text-center py-8 text-gray-500">
//                           No items in this invoice
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>

//             {/* Totals Section */}
//             {rows.length > 0 && (
//               <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
//                 <div className="flex justify-end">
//                   <div className="w-80">
//                     <div className="space-y-3">
//                       <div className="flex justify-between py-2">
//                         <span className="text-gray-600">Subtotal:</span>
//                         <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
//                       </div>
//                       <div className="flex justify-between py-2">
//                         <span className="text-gray-600">Tax Rate ({taxRate}%):</span>
//                         <span className="font-medium text-gray-900">{formatCurrency(taxTotal)}</span>
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between pt-2">
//                         <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
//                         <span className="text-2xl font-bold text-orange-600">{formatCurrency(totalAmount)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Client Note */}
//             {clientNote && (
//               <div className="px-8 py-6 border-t border-gray-100 bg-white">
//                 <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
//                 <p className="text-sm text-gray-600">{clientNote}</p>
//               </div>
//             )}

//             {/* Footer */}
//             <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
//               <div className="text-center">
//                 <p className="text-xs text-gray-500">
//                   Thank you for your business! Payment is due within 30 days.
//                 </p>
//                 <p className="text-xs text-gray-400 mt-2">
//                   For any questions regarding this invoice, please contact our support team.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-200 shrink-0">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             className="gap-2"
//           >
//             Close
//           </Button>
//           <Button
//             onClick={onSave}
//             className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
//           >
//             <Send className="h-4 w-4" />
//             Send Invoice
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

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
  dueDate = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString(),
  companyInfo = {
    name: "Your Company Name",
    address: "123 Business Street",
    city: "City, State 12345",
    email: "contact@company.com",
    phone: "+1 (555) 123-4567",
  },
  clientInfo = {
    name: "Client Name",
    address: "456 Client Avenue",
    city: "Client City, State 67890",
    email: "client@example.com",
    phone: "+1 (555) 987-6543",
  },
  currency = "$",
}) => {
  if (!open) return null;

  const formatCurrency = (amount) => {
    return `${currency}${parseFloat(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-foreground/20
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          absolute right-0 top-0
          h-full w-full
          sm:w-[900px]
          lg:w-[1000px]
          bg-background
          border-l border-border
          shadow-2xl
          flex flex-col
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-6 py-4
            border-b border-border
            bg-background/95
            backdrop-blur
            shrink-0
          "
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="
                p-2 rounded-xl
                text-muted-foreground
                hover:text-foreground
                hover:bg-accent
                transition-colors
              "
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Invoice Preview
              </h2>

              <p className="text-sm text-muted-foreground">
                Review invoice before sending
              </p>
            </div>

            <Badge
              variant="secondary"
              className="
                ml-2
                bg-primary/10
                text-primary
                border border-primary/20
              "
            >
              DRAFT
            </Badge>
          </div>

          <button
            onClick={onClose}
            className="
              p-2 rounded-xl
              text-muted-foreground
              hover:text-foreground
              hover:bg-accent
              transition-colors
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="
            flex-1 overflow-y-auto
            bg-muted/30
            p-6
          "
        >
          {/* Invoice Card */}
          <div
            className="
              max-w-4xl mx-auto
              rounded-3xl
              border border-border
              bg-card
              text-card-foreground
              shadow-xl
              overflow-hidden
            "
          >
            {/* Top Banner */}
            <div
              className="
                bg-primary
                px-8 py-8
                text-primary-foreground
              "
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    INVOICE
                  </h1>

                  <p className="mt-2 text-primary-foreground/80">
                    Payment Receipt
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/10
                    backdrop-blur-sm
                    px-5 py-3
                    text-right
                  "
                >
                  <p className="text-sm font-semibold">
                    {invoiceNumber}
                  </p>

                  <p className="mt-1 text-xs text-primary-foreground/70">
                    Invoice Number
                  </p>
                </div>
              </div>
            </div>

            {/* Company + Client */}
            <div className="px-8 py-8 border-b border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* From */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-10 w-10 items-center justify-center
                        rounded-xl
                        bg-primary/10
                        text-primary
                      "
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground">
                      From
                    </h3>
                  </div>

                  <div className="pl-13 space-y-1">
                    <p className="font-semibold text-foreground">
                      {companyInfo.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {companyInfo.address}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {companyInfo.city}
                    </p>

                    <p className="pt-2 text-sm text-muted-foreground">
                      {companyInfo.email}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {companyInfo.phone}
                    </p>
                  </div>
                </div>

                {/* To */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-10 w-10 items-center justify-center
                        rounded-xl
                        bg-blue-500/10
                        text-blue-500
                      "
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground">
                      To
                    </h3>
                  </div>

                  <div className="pl-13 space-y-1">
                    <p className="font-semibold text-foreground">
                      {clientInfo.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {clientInfo.address}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {clientInfo.city}
                    </p>

                    <p className="pt-2 text-sm text-muted-foreground">
                      {clientInfo.email}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {clientInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div
              className="
                grid grid-cols-2 md:grid-cols-4
                gap-6
                px-8 py-6
                bg-muted/40
                border-b border-border
              "
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Invoice Date
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {invoiceDate}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Due Date
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {dueDate}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Payment Terms
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  Net 30
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Currency
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {currency} USD
                </p>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="px-8 py-5 border-b border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">
                    Description:
                  </span>{" "}
                  {description}
                </p>
              </div>
            )}

            {/* Table */}
            <div className="px-8 py-8">
              <div className="mb-5">
                <h3 className="text-xl font-semibold text-foreground">
                  Order Summary
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  List of invoice products and services
                </p>
              </div>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-border
                "
              >
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">
                        Product/Service
                      </TableHead>

                      <TableHead className="font-semibold text-foreground">
                        Description
                      </TableHead>

                      <TableHead className="text-right font-semibold text-foreground">
                        Rate
                      </TableHead>

                      <TableHead className="text-right font-semibold text-foreground">
                        Qty
                      </TableHead>

                      <TableHead className="text-right font-semibold text-foreground">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.length > 0 ? (
                      rows.map((row, index) => (
                        <TableRow
                          key={index}
                          className="
                            transition-colors
                            hover:bg-muted/40
                          "
                        >
                          <TableCell className="font-medium text-foreground">
                            {row.productName}
                          </TableCell>

                          <TableCell className="text-muted-foreground">
                            {row.description || "-"}
                          </TableCell>

                          <TableCell className="text-right text-foreground">
                            {row.rate || "$0.00"}
                          </TableCell>

                          <TableCell className="text-right text-foreground">
                            {row.qty || "1"}
                          </TableCell>

                          <TableCell className="text-right font-semibold text-foreground">
                            {row.amount ||
                              row.rate * (row.qty || 1)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="
                            py-12 text-center
                            text-muted-foreground
                          "
                        >
                          No items in this invoice
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Totals */}
            {rows.length > 0 && (
              <div
                className="
                  border-t border-border
                  bg-muted/30
                  px-8 py-8
                "
              >
                <div className="flex justify-end">
                  <div
                    className="
                      w-full max-w-sm
                      rounded-2xl
                      border border-border
                      bg-background
                      p-6
                      shadow-sm
                    "
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Subtotal
                        </span>

                        <span className="font-medium text-foreground">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Tax ({taxRate}%)
                        </span>

                        <span className="font-medium text-foreground">
                          {formatCurrency(taxTotal)}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-lg font-semibold text-foreground">
                          Total
                        </span>

                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Note */}
            {clientNote && (
              <div className="px-8 py-6 border-t border-border">
                <h4 className="mb-2 text-base font-semibold text-foreground">
                  Notes
                </h4>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {clientNote}
                </p>
              </div>
            )}

            {/* Footer */}
            <div
              className="
                border-t border-border
                bg-muted/20
                px-8 py-6
                text-center
              "
            >
              <p className="text-sm text-muted-foreground">
                Thank you for your business! Payment is due within 30 days.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                For any questions regarding this invoice, please contact our
                support team.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="
            flex items-center justify-end gap-3
            border-t border-border
            bg-background
            px-6 py-4
            shrink-0
          "
        >
          <Button
            variant="outline"
            onClick={onClose}
            className="
              rounded-xl
              border-border
              hover:bg-accent
            "
          >
            Close
          </Button>

          <Button
            onClick={onSave}
            className="
              rounded-xl
              bg-primary
              text-primary-foreground
              hover:bg-primary/90
              gap-2
            "
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