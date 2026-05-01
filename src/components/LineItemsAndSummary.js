// // import React, { useState } from "react";
// // import {
// //   Box,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableRow,
// //   IconButton,
// //   Menu,
// //   MenuItem,
// //   Button,
// //   Typography,
// //   Checkbox,
// // } from "@mui/material";
// // import { AiOutlinePlusCircle } from "react-icons/ai";
// // import { CiDiscount1 } from "react-icons/ci";
// // import { BsThreeDotsVertical } from "react-icons/bs";
// // import { RiCloseLine } from "react-icons/ri";

// // import { Autocomplete, TextField } from "@mui/material";
// // const LineItemsAndSummary = ({
// //   // Line items props
// //   rows = [],
// //   serviceoptions = [],
// //   onInputChange,
// //   onServiceChange,
// //   onServiceInputChange,
// //   onAddRow,
// //   onDeleteRow,
// //   onEditService,
// //   onDeleteService,
// //   onSaveAsNewService,
// //   onDuplicate,
  
// //   // Summary props
// //   subtotal = 0,
// //   onSubtotalChange,
// //   taxRate = 0,
// //   onTaxRateChange,
// //   taxTotal = 0,
// //   totalAmount = 0,
  
// //   // Optional styling
// //   tableWidth = "100%",
// //   showSummary = true,
// //   showAddButtons = true,
// //   summaryTitle = "Summary",
// //   lineItemsTitle = "Line items",
// //   lineItemsSubtitle = "Client-facing itemized list of products and services",
  
// //   // Optional: allow custom table headers
// //   customHeaders,
  
// //   // Optional: additional actions
// //   additionalActions,
// // }) => {
// //   const [anchorElNew, setAnchorElNew] = useState(null);
// //   const [selectedRow, setSelectedRow] = useState(null);

// //   const defaultHeaders = [
// //     { id: "product", label: "Product or service", width: "20%" },
// //     { id: "description", label: "Description" },
// //     { id: "rate", label: "Rate" },
// //     { id: "qty", label: "Qty" },
// //     { id: "amount", label: "Amount" },
// //     { id: "tax", label: "Tax" },
// //     { id: "settings", label: "Settings" },
// //     { id: "actions", label: "" },
// //   ];

// //   const headers = customHeaders || defaultHeaders;

// //   const handleMenuOpen = (event, index) => {
// //     setAnchorElNew(event.currentTarget);
// //     setSelectedRow(index);
// //   };

// //   const handleMenuClose = () => {
// //     setAnchorElNew(null);
// //     setSelectedRow(null);
// //   };

 

// //   const handleTaxRateChange = (event) => {
// //     const value = parseFloat(event.target.value) || 0;
// //     if (onTaxRateChange) {
// //       onTaxRateChange(value);
// //     }
// //   };

// //   return (
// //     <Box>
// //       {/* Line Items Section */}
// //       {(lineItemsTitle || lineItemsSubtitle) && (
// //         <Box sx={{ margin: "20px 0 10px 0" }}>
// //           {lineItemsTitle && <Typography variant="h6">{lineItemsTitle}</Typography>}
// //           {lineItemsSubtitle && (
// //             <Typography variant="body2">{lineItemsSubtitle}</Typography>
// //           )}
// //         </Box>
// //       )}

// //       <Box sx={{ overflow: "auto", width: tableWidth }}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               {headers.map((header, index) => (
// //                 <TableCell
// //                   key={header.id}
// //                   sx={
// //                     index === 0
// //                       ? {
// //                           position: "sticky",
// //                           left: 0,
// //                           backgroundColor: "white",
// //                           zIndex: 1,
// //                           width: header.width || "auto",
// //                         }
// //                       : {}
// //                   }
// //                 >
// //                   {header.label}
// //                 </TableCell>
// //               ))}
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {rows.map((row, index) => (
// //               <TableRow key={row.id || index}>
// //                 {/* Product or Service Column */}
// //                 {headers.some(h => h.id === "product") && (
// //                   <TableCell
// //                     sx={{
// //                       position: "sticky",
// //                       left: 0,
// //                       backgroundColor: "white",
// //                       zIndex: 1,
// //                     }}
// //                   >
                    
// //                     <Autocomplete
// //   size="small"
// //   freeSolo
// //   options={serviceoptions.map((option) => ({
// //     label: option.label,
// //     value: option.value,
// //   }))}

// //   value={
// //     row.productName
// //       ? {
// //           label: row.productName,
// //           value: row.productName,
// //         }
// //       : null
// //   }

// //   onChange={(event, newValue) => {
// //     let formatted = null;

// //     if (typeof newValue === "string") {
// //       // typed and pressed enter
// //       formatted = { label: newValue, value: newValue };
// //     } else if (newValue && newValue.inputValue) {
// //       // clicked "Add new"
// //       formatted = {
// //         label: newValue.inputValue,
// //         value: newValue.inputValue,
// //       };
// //     } else if (newValue) {
// //       // selected existing
// //       formatted = newValue;
// //     }

// //     onServiceChange && onServiceChange(index, formatted);
// //   }}

// //   onInputChange={(event, inputValue, reason) => {
// //     if (reason === "input") {
// //       onServiceInputChange &&
// //         onServiceInputChange(inputValue, { action: "input-change" }, index);
// //     }
// //   }}

// //   filterOptions={(options, params) => {
// //     const filtered = options.filter((option) =>
// //       option.label
// //         .toLowerCase()
// //         .includes(params.inputValue.toLowerCase())
// //     );

// //     const isExisting = options.some(
// //       (option) =>
// //         option.label.toLowerCase() ===
// //         params.inputValue.toLowerCase()
// //     );

// //     if (params.inputValue !== "" && !isExisting) {
// //       filtered.push({
// //         inputValue: params.inputValue,
// //         label: `Add "${params.inputValue}"`,
// //       });
// //     }

// //     return filtered;
// //   }}

// //   getOptionLabel={(option) => {
// //     if (typeof option === "string") return option;
// //     if (option.inputValue) return option.inputValue;
// //     return option.label || "";
// //   }}

// //   renderOption={(props, option) => (
// //     <li {...props}>
// //       {option.label}
// //     </li>
// //   )}

// //   renderInput={(params) => (
// //     <TextField
// //       {...params}
// //       placeholder={
// //         row.isDiscount
// //           ? "Reason for discount"
// //           : "Product or Service"
// //       }
// //     />
// //   )}

// //   sx={{ width: 180 }}
// // />
// //                   </TableCell>
// //                 )}

// //                 {/* Description Column */}
// //                 {headers.some(h => h.id === "description") && (
// //                   <TableCell>
// //                     <TextField
// //                     //   type="text"
// //                       name="description"
// //                       value={row.description || ""}
// //                       onChange={(e) => onInputChange && onInputChange(index, e)}
// //                       fullWidth
// //                       placeholder="Description"
// //                        sx={{ width: 180 }}
// //                     />
// //                   </TableCell>
// //                 )}

// //                 {/* Rate Column */}
// //                 {headers.some(h => h.id === "rate") && (
// //                   <TableCell>
// //                     <TextField
// //                       fullWidth
// //                       name="rate"
// //                       value={row.rate || ""}
// //                       onChange={(e) => onInputChange && onInputChange(index, e)}
// //                        sx={{ width: 100 }}
// //                     />
// //                   </TableCell>
// //                 )}

// //                 {/* Quantity Column */}
// //                 {headers.some(h => h.id === "qty") && (
// //                   <TableCell>
// //                     <TextField
// //                      fullWidth
// //                       name="qty"
// //                       value={row.qty || ""}
// //                       onChange={(e) => onInputChange && onInputChange(index, e)}
// //                       sx={{ width: 50 }}
// //                     />
// //                   </TableCell>
// //                 )}

// //                 {/* Amount Column */}
// //                 {headers.some(h => h.id === "amount") && (
// //                   <TableCell>{row.amount || "0.00"}</TableCell>
// //                 )}

// //                 {/* Tax Column */}
// //                 {headers.some(h => h.id === "tax") && (
// //                   <TableCell>
// //                     <Checkbox
// //                       name="tax"
// //                       checked={row.tax || false}
// //                       onChange={(e) => onInputChange && onInputChange(index, e)}
// //                     />
// //                   </TableCell>
// //                 )}

// //                 {/* Settings Column (Menu) */}
// //                 {headers.some(h => h.id === "settings") && (
// //                   <TableCell>
// //                     <IconButton onClick={(event) => handleMenuOpen(event, index)}>
// //                       <BsThreeDotsVertical />
// //                     </IconButton>
// //                     <Menu
// //                       anchorEl={anchorElNew}
// //                       open={Boolean(anchorElNew) && selectedRow === index}
// //                       onClose={handleMenuClose}
// //                       anchorOrigin={{
// //                         vertical: "top",
// //                         horizontal: "left",
// //                       }}
// //                       transformOrigin={{
// //                         vertical: "top",
// //                         horizontal: "left",
// //                       }}
// //                     >
// //                       <MenuItem
// //                         onClick={() => {
// //                           onEditService && onEditService(row, index);
// //                           handleMenuClose();
// //                         }}
// //                       >
// //                         Edit
// //                       </MenuItem>
// //                       <MenuItem
// //                         onClick={() => {
// //                           onDeleteService && onDeleteService(index);
// //                           handleMenuClose();
// //                         }}
// //                       >
// //                         Delete
// //                       </MenuItem>
// //                       <MenuItem
// //                         onClick={() => {
// //                           onSaveAsNewService && onSaveAsNewService(row);
// //                           handleMenuClose();
// //                         }}
// //                       >
// //                         Save as new service
// //                       </MenuItem>
// //                       <MenuItem
// //                         onClick={() => {
// //                           onDuplicate && onDuplicate(index);
// //                           handleMenuClose();
// //                         }}
// //                       >
// //                         Duplicate
// //                       </MenuItem>
// //                     </Menu>
// //                   </TableCell>
// //                 )}

// //                 {/* Actions Column (Delete Icon) */}
// //                 {headers.some(h => h.id === "actions") && (
// //                   <TableCell>
// //                     <IconButton
// //                       onClick={() => {
// //                         onDeleteRow && onDeleteRow(index);
// //                         handleMenuClose();
// //                       }}
// //                     >
// //                       <RiCloseLine />
// //                     </IconButton>
// //                   </TableCell>
// //                 )}

// //                 {/* Additional custom columns */}
// //                 {additionalActions && additionalActions(row, index)}
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </Box>

// //       {/* Add Row Buttons */}
// //       {showAddButtons && (
// //         <Box
// //           sx={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: "20px",
// //             marginTop: "10px",
// //           }}
// //         >
// //           <Button
// //             onClick={() => onAddRow && onAddRow(false)}
// //             startIcon={<AiOutlinePlusCircle />}
// //             sx={{ color: "blue", fontSize: "15px" }}
// //           >
// //             Line item
// //           </Button>
// //           <Button
// //             onClick={() => onAddRow && onAddRow(true)}
// //             startIcon={<CiDiscount1 />}
// //             sx={{ color: "blue", fontSize: "15px" }}
// //           >
// //             Discount
// //           </Button>
// //         </Box>
// //       )}

// //       {/* Summary Section */}
// //       {showSummary && (
// //         <>
// //           <Typography variant="h6" sx={{ mt: 2 }}>
// //             {summaryTitle}
// //           </Typography>
// //           <Table sx={{ backgroundColor: "#fff" }}>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Subtotal</TableCell>
// //                 <TableCell>Tax Rate</TableCell>
// //                 <TableCell>Tax Total</TableCell>
// //                 <TableCell>Total</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               <TableRow>
// //                 <TableCell>
// //                   <Box sx={{ display: "flex", alignItems: "center" }}>
// //                     ${subtotal}
                    
// //                   </Box>
// //                 </TableCell>
// //                 <TableCell>
// //                   <Box sx={{ display: "flex", alignItems: "center" }}>
// //                     <TextField
// //                       value={taxRate}
// //                       onChange={handleTaxRateChange}
// //                        sx={{ width: 100 }}
// //                         InputProps={{
// //                       endAdornment: "%",
// //                     }}
// //                     />
// //                     {/* % */}
// //                   </Box>
// //                 </TableCell>
// //                 <TableCell>${taxTotal?.toFixed(2) || "0.00"}</TableCell>
// //                 <TableCell>${totalAmount || "0.00"}</TableCell>
// //               </TableRow>
// //             </TableBody>
// //           </Table>
// //         </>
// //       )}
// //     </Box>
// //   );
// // };

// // export default LineItemsAndSummary;


// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import { Button } from "../components/ui/button";
// import { Checkbox } from "../components/ui/checkbox";
// import { Input } from "../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import { Plus, Percent, MoreVertical, X } from "lucide-react";

// const LineItemsAndSummary = ({
//   // Line items props
//   rows = [],
//   serviceoptions = [],
//   onInputChange,
//   onServiceChange,
//   onServiceInputChange,
//   onAddRow,
//   onDeleteRow,
//   onEditService,
//   onDeleteService,
//   onSaveAsNewService,
//   onDuplicate,
  
//   // Summary props
//   subtotal = 0,
//   onSubtotalChange,
//   taxRate = 0,
//   onTaxRateChange,
//   taxTotal = 0,
//   totalAmount = 0,
  
//   // Optional styling
//   tableWidth = "100%",
//   showSummary = true,
//   showAddButtons = true,
//   summaryTitle = "Summary",
//   lineItemsTitle = "Line items",
//   lineItemsSubtitle = "Client-facing itemized list of products and services",
  
//   // Optional: allow custom table headers
//   customHeaders,
  
//   // Optional: additional actions
//   additionalActions,
// }) => {
//   const [selectedRow, setSelectedRow] = useState(null);

//   const defaultHeaders = [
//     { id: "product", label: "Product or service", width: "20%" },
//     { id: "description", label: "Description" },
//     { id: "rate", label: "Rate" },
//     { id: "qty", label: "Qty" },
//     { id: "amount", label: "Amount" },
//     { id: "tax", label: "Tax" },
//     { id: "settings", label: "Settings" },
//     { id: "actions", label: "" },
//   ];

//   const headers = customHeaders || defaultHeaders;

//   const handleServiceInputChange = (inputValue, index) => {
//     if (onServiceInputChange) {
//       onServiceInputChange(inputValue, { action: "input-change" }, index);
//     }
//   };

//   const handleTaxRateChange = (event) => {
//     const value = parseFloat(event.target.value) || 0;
//     if (onTaxRateChange) {
//       onTaxRateChange(value);
//     }
//   };

//   // Filter options for service autocomplete
//   const getFilteredOptions = (inputValue) => {
//     const filtered = serviceoptions.filter((option) =>
//       option.label.toLowerCase().includes(inputValue.toLowerCase())
//     );

//     const isExisting = serviceoptions.some(
//       (option) => option.label.toLowerCase() === inputValue.toLowerCase()
//     );

//     if (inputValue !== "" && !isExisting) {
//       filtered.push({
//         inputValue: inputValue,
//         label: `Add "${inputValue}"`,
//         value: inputValue,
//       });
//     }

//     return filtered;
//   };

//   return (
//     <div className="w-full">
//       {/* Line Items Section */}
//       {(lineItemsTitle || lineItemsSubtitle) && (
//         <div className="mb-4 mt-5">
//           {lineItemsTitle && (
//             <h4 className="text-lg font-semibold">{lineItemsTitle}</h4>
//           )}
//           {lineItemsSubtitle && (
//             <p className="text-sm text-muted-foreground">{lineItemsSubtitle}</p>
//           )}
//         </div>
//       )}

//       <div className="overflow-x-auto rounded-lg border border-border" style={{ width: tableWidth }}>
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/50">
//               {headers.map((header, index) => (
//                 <TableHeader
//                   key={header.id}
//                   className={
//                     index === 0
//                       ? "sticky left-0 bg-muted/50 z-10"
//                       : ""
//                   }
//                   style={{ width: header.width }}
//                 >
//                   {header.label}
//                 </TableHeader>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {rows.map((row, index) => (
//               <TableRow key={row.id || index} className="border-b border-border last:border-0">
//                 {/* Product or Service Column */}
//                 {headers.some(h => h.id === "product") && (
//                   <TableCell
//                     className="sticky left-0 bg-card z-10"
//                     style={{ minWidth: 200 }}
//                   >
//                     <div className="relative">
//                       <ServiceCombobox
//                         options={serviceoptions}
//                         value={row.productName || ""}
//                         placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
//                         onChange={(newValue) => {
//                           let formatted = null;
//                           if (typeof newValue === "string") {
//                             formatted = { label: newValue, value: newValue };
//                           } else if (newValue && newValue.inputValue) {
//                             formatted = {
//                               label: newValue.inputValue,
//                               value: newValue.inputValue,
//                             };
//                           } else if (newValue) {
//                             formatted = newValue;
//                           }
//                           onServiceChange && onServiceChange(index, formatted);
//                         }}
//                         onInputChange={(inputValue) => handleServiceInputChange(inputValue, index)}
//                       />
//                     </div>
//                   </TableCell>
//                 )}

//                 {/* Description Column */}
//                 {headers.some(h => h.id === "description") && (
//                   <TableCell>
//                     <Input
//                       type="text"
//                       name="description"
//                       value={row.description || ""}
//                       onChange={(e) => onInputChange && onInputChange(index, e)}
//                       placeholder="Description"
//                       className="w-40"
//                     />
//                   </TableCell>
//                 )}

//                 {/* Rate Column */}
//                 {headers.some(h => h.id === "rate") && (
//                   <TableCell>
//                     <Input
//                       type="text"
//                       name="rate"
//                       value={row.rate || ""}
//                       onChange={(e) => onInputChange && onInputChange(index, e)}
//                       className="w-24"
//                     />
//                   </TableCell>
//                 )}

//                 {/* Quantity Column */}
//                 {headers.some(h => h.id === "qty") && (
//                   <TableCell>
//                     <Input
//                       type="text"
//                       name="qty"
//                       value={row.qty || ""}
//                       onChange={(e) => onInputChange && onInputChange(index, e)}
//                       className="w-20"
//                     />
//                   </TableCell>
//                 )}

//                 {/* Amount Column */}
//                 {headers.some(h => h.id === "amount") && (
//                   <TableCell className="font-medium">
//                     {row.amount || "0.00"}
//                   </TableCell>
//                 )}

//                 {/* Tax Column */}
//                 {headers.some(h => h.id === "tax") && (
//                   <TableCell>
//                     <Checkbox
//                       name="tax"
//                       checked={row.tax || false}
//                       onCheckedChange={(checked) => {
//                         const event = {
//                           target: { name: "tax", checked, type: "checkbox" }
//                         };
//                         onInputChange && onInputChange(index, event);
//                       }}
//                     />
//                   </TableCell>
//                 )}

//                 {/* Settings Column (Menu) */}
//                 {headers.some(h => h.id === "settings") && (
//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={() => {
//                             onEditService && onEditService(row, index);
//                           }}
//                         >
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => {
//                             onDeleteService && onDeleteService(index);
//                           }}
//                           className="text-destructive"
//                         >
//                           Delete
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => {
//                             onSaveAsNewService && onSaveAsNewService(row);
//                           }}
//                         >
//                           Save as new service
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => {
//                             onDuplicate && onDuplicate(index);
//                           }}
//                         >
//                           Duplicate
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 )}

//                 {/* Actions Column (Delete Icon) */}
//                 {headers.some(h => h.id === "actions") && (
//                   <TableCell>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 text-muted-foreground hover:text-destructive"
//                       onClick={() => {
//                         onDeleteRow && onDeleteRow(index);
//                       }}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 )}

//                 {/* Additional custom columns */}
//                 {additionalActions && additionalActions(row, index)}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Add Row Buttons */}
//       {showAddButtons && (
//         <div className="flex items-center gap-5 mt-3">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => onAddRow && onAddRow(false)}
//             className="text-primary hover:text-primary/80"
//           >
//             <Plus className="h-4 w-4 mr-1" />
//             Line item
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => onAddRow && onAddRow(true)}
//             className="text-primary hover:text-primary/80"
//           >
//             <Percent className="h-4 w-4 mr-1" />
//             Discount
//           </Button>
//         </div>
//       )}

//       {/* Summary Section */}
//       {showSummary && (
//         <div className="mt-4">
//           <h4 className="text-lg font-semibold mb-2">{summaryTitle}</h4>
//           <div className="rounded-lg border border-border bg-card overflow-hidden">
//             <div className="grid grid-cols-4 divide-x divide-border">
//               <div className="px-4 py-3">
//                 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
//                   Subtotal
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <span className="text-sm text-muted-foreground">$</span>
//                   <span className="text-sm font-medium text-foreground">
//                     {subtotal}
//                   </span>
//                 </div>
//               </div>
//               <div className="px-4 py-3">
//                 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
//                   Tax Rate
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <Input
//                     value={taxRate}
//                     onChange={handleTaxRateChange}
//                     className="w-20 h-8"
//                   />
//                   <span className="text-sm text-muted-foreground">%</span>
//                 </div>
//               </div>
//               <div className="px-4 py-3">
//                 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
//                   Tax Total
//                 </p>
//                 <p className="text-sm font-medium text-foreground">
//                   ${taxTotal?.toFixed(2) || "0.00"}
//                 </p>
//               </div>
//               <div className="px-4 py-3 bg-muted/40">
//                 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
//                   Total
//                 </p>
//                 <p className="text-sm font-bold text-foreground">
//                   ${totalAmount || "0.00"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ServiceCombobox Component for the autocomplete functionality
// const ServiceCombobox = ({ options, value, placeholder, onChange, onInputChange }) => {
//   const [open, setOpen] = useState(false);
//   const [inputValue, setInputValue] = useState(value || "");
//   const [filteredOptions, setFilteredOptions] = useState(options);

//   const handleInputChange = (e) => {
//     const newValue = e.target.value;
//     setInputValue(newValue);
//     onInputChange?.(newValue);
    
//     // Filter options
//     const filtered = options.filter((option) =>
//       option.label.toLowerCase().includes(newValue.toLowerCase())
//     );
    
//     const isExisting = options.some(
//       (option) => option.label.toLowerCase() === newValue.toLowerCase()
//     );
    
//     if (newValue !== "" && !isExisting) {
//       filtered.push({
//         inputValue: newValue,
//         label: `Add "${newValue}"`,
//         value: newValue,
//       });
//     }
    
//     setFilteredOptions(filtered);
//     setOpen(true);
//   };

//   const handleSelect = (option) => {
//     if (option.inputValue) {
//       onChange?.(option.inputValue);
//       setInputValue(option.inputValue);
//     } else {
//       onChange?.(option);
//       setInputValue(option.label);
//     }
//     setOpen(false);
//   };

//   return (
//     <div className="relative">
//       <Input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         onFocus={() => setOpen(true)}
//         placeholder={placeholder}
//         className="w-full"
//       />
//       {open && filteredOptions.length > 0 && (
//         <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
//           <div className="max-h-60 overflow-auto py-1">
//             {filteredOptions.map((option, idx) => (
//               <button
//                 key={idx}
//                 type="button"
//                 className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
//                 onClick={() => handleSelect(option)}
//               >
//                 {option.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LineItemsAndSummary;

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Plus, Percent, MoreVertical, X } from "lucide-react";
import { Button } from "../components/ui/button";

const LineItemsAndSummary = ({
  // Line items props
  rows = [],
  serviceoptions = [],
  onInputChange,
  onServiceChange,
  onServiceInputChange,
  onAddRow,
  onDeleteRow,
  onEditService,
  onDeleteService,
  onSaveAsNewService,
  onDuplicate,
  
  // Summary props
  subtotal = 0,
  onSubtotalChange,
  taxRate = 0,
  onTaxRateChange,
  taxTotal = 0,
  totalAmount = 0,
  
  // Optional styling
  tableWidth = "100%",
  showSummary = true,
  showAddButtons = true,
  summaryTitle = "Summary",
  lineItemsTitle = "Line items",
  lineItemsSubtitle = "Client-facing itemized list of products and services",
  
  // Optional: allow custom table headers
  customHeaders,
  
  // Optional: additional actions
  additionalActions,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [openServiceDropdown, setOpenServiceDropdown] = useState(null);

  const handleMenuOpen = (event, index) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right
    });
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setSelectedRow(null);
  };

  const handleServiceInputChange = (inputValue, index) => {
    if (onServiceInputChange) {
      onServiceInputChange(inputValue, { action: "input-change" }, index);
    }
  };

  const handleTaxRateChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    if (onTaxRateChange) {
      onTaxRateChange(value);
    }
  };

  const handleSubtotalChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    if (onSubtotalChange) {
      onSubtotalChange(value);
    }
  };

  return (
    <div className="w-full">
      {/* Line Items Section */}
      <div className="mb-4">
        <h4 className="text-base font-semibold text-foreground">{lineItemsTitle}</h4>
        <p className="text-sm text-muted-foreground mt-1">{lineItemsSubtitle}</p>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="sticky left-0 bg-muted/50 px-3 py-2 text-left font-medium text-muted-foreground" style={{ minWidth: 180 }}>
                Product/Service
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground" style={{ minWidth: 140 }}>
                Description
              </th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground" style={{ minWidth: 90 }}>
                Rate
              </th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground" style={{ minWidth: 60 }}>
                Qty
              </th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground" style={{ minWidth: 90 }}>
                Amount
              </th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground" style={{ minWidth: 48 }}>
                Tax
              </th>
              <th className="px-3 py-2 w-10" />
              <th className="px-3 py-2 w-10" />
             </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                  No items added yet
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || index} className="border-b border-border last:border-0">
                  <td className="sticky left-0 bg-card px-2 py-1.5" style={{ minWidth: 200 }}>
                    <ServiceCombobox
                      options={serviceoptions}
                      value={row.productName || ''}
                      placeholder={row.isDiscount ? 'Reason for discount' : 'Product or Service'}
                      onChange={(newValue) => {
                        let formatted = null;
                        if (typeof newValue === "string") {
                          formatted = { label: newValue, value: newValue };
                        } else if (newValue && newValue.inputValue) {
                          formatted = {
                            label: newValue.inputValue,
                            value: newValue.inputValue,
                          };
                        } else if (newValue) {
                          formatted = newValue;
                        }
                        onServiceChange && onServiceChange(index, formatted);
                      }}
                      onInputChange={(text) => handleServiceInputChange(text, index)}
                      isOpen={openServiceDropdown === index}
                      onOpenChange={(isOpen) => setOpenServiceDropdown(isOpen ? index : null)}
                    />
                   </td>
                  <td className="px-2 py-1.5" style={{ minWidth: 140 }}>
                    <input
                      type="text"
                      name="description"
                      value={row.description || ''}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                      className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Description"
                    />
                   </td>
                  <td className="px-2 py-1.5 text-right" style={{ minWidth: 90 }}>
                    <input
                      type="text"
                      name="rate"
                      value={row.rate || ''}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                      className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm text-right outline-none focus:ring-1 focus:ring-ring"
                      placeholder="0.00"
                    />
                   </td>
                  <td className="px-2 py-1.5 text-right" style={{ minWidth: 60 }}>
                    <input
                      type="text"
                      name="qty"
                      value={row.qty || ''}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                      className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm text-right outline-none focus:ring-1 focus:ring-ring"
                      placeholder="1"
                    />
                   </td>
                  <td className="px-2 py-1.5 text-sm text-right font-medium" style={{ minWidth: 90 }}>
                    {row.amount || '0.00'}
                   </td>
                  <td className="px-2 py-1.5 text-center">
                    <input
                      type="checkbox"
                      name="tax"
                      checked={row.tax || false}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                   </td>
                  <td className="px-1 py-1.5">
                    <ActionMenu
                      row={row}
                      index={index}
                      onEditService={onEditService}
                      onDeleteService={onDeleteService}
                      onSaveAsNewService={onSaveAsNewService}
                      onDuplicate={onDuplicate}
                      isOpen={selectedRow === index}
                      onOpen={handleMenuOpen}
                      onClose={handleMenuClose}
                      menuPosition={menuPosition}
                    />
                   </td>
                  <td className="px-1 py-1.5">
                    <button
                      type="button"
                      onClick={() => onDeleteRow && onDeleteRow(index)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                   </td>
                 </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Row Buttons */}
      {showAddButtons && (
        <div className="flex items-center gap-4 mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onAddRow && onAddRow(false)}
            className="text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4 mr-1" /> Line item
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onAddRow && onAddRow(true)}
            className="text-primary hover:text-primary/80"
          >
            <Percent className="h-4 w-4 mr-1" /> Discount
          </Button>
        </div>
      )}

      {/* Summary Section */}
      {showSummary && (
        <div className="mt-6">
          <h4 className="text-base font-semibold mb-3">{summaryTitle}</h4>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-4 divide-x divide-border">
              <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Subtotal
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">$</span>
                  <input
                    value={subtotal}
                    onChange={handleSubtotalChange}
                    className="w-full rounded border-0 bg-transparent px-0 py-0.5 text-sm font-medium text-foreground outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Tax Rate
                </p>
                <div className="flex items-center gap-1">
                  <input
                    value={taxRate}
                    onChange={handleTaxRateChange}
                    className="w-full rounded border-0 bg-transparent px-0 py-0.5 text-sm font-medium text-foreground outline-none focus:ring-0"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Tax Total
                </p>
                <p className="text-sm font-medium text-foreground">
                  ${taxTotal?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="px-4 py-3 bg-muted/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Total
                </p>
                <p className="text-sm font-bold text-foreground">
                  ${totalAmount || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ActionMenu Component with fixed positioning
const ActionMenu = ({ 
  row, 
  index, 
  onEditService, 
  onDeleteService, 
  onSaveAsNewService, 
  onDuplicate, 
  isOpen, 
  onOpen, 
  onClose,
  menuPosition 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    const handleScroll = () => {
      onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(event) => onOpen(event, index)}
        className="rounded p-1 text-muted-foreground hover:bg-accent transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <div 
            ref={menuRef}
            className="fixed z-50 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg"
            style={{
              top: menuPosition.top + 'px',
              right: menuPosition.right + 'px'
            }}
          >
            <button
              type="button"
              onClick={() => {
                onEditService && onEditService(row, index);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent transition-colors"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteService && onDeleteService(index);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent text-destructive transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveAsNewService && onSaveAsNewService(row);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent transition-colors"
            >
              Save as new service
            </button>
            <button
              type="button"
              onClick={() => {
                onDuplicate && onDuplicate(index);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent transition-colors"
            >
              Duplicate
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ServiceCombobox Component with fixed positioning
const ServiceCombobox = ({ options, value, placeholder, onChange, onInputChange, isOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    const isExisting = options.some(
      (option) => option.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (inputValue !== "" && !isExisting) {
      filtered.push({
        inputValue: inputValue,
        label: `Add "${inputValue}"`,
        value: inputValue,
      });
    }
    
    return filtered;
  }, [options, inputValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    const handleScroll = () => {
      setOpen(false);
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, setOpen]);

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  };

  const handleInputFocus = () => {
    updateDropdownPosition();
    setOpen(true);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
    updateDropdownPosition();
    setOpen(true);
  };

  const handleSelect = (option) => {
    if (option.inputValue) {
      onChange?.(option.inputValue);
      setInputValue(option.inputValue);
    } else {
      onChange?.(option);
      setInputValue(option.label);
    }
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
      />
      {open && filteredOptions.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div 
            className="fixed z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-card py-1 shadow-lg"
            style={{
              top: dropdownPosition.top + 'px',
              left: dropdownPosition.left + 'px',
              minWidth: '200px'
            }}
          >
            {filteredOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent transition-colors whitespace-nowrap"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LineItemsAndSummary;