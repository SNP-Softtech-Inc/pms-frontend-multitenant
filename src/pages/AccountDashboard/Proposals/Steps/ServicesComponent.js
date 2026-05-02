

// import React,{useState,useEffect} from 'react';
// import {
//   Box,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   Button,
//   IconButton,
//   Typography,
//   InputLabel,
//   TextField,Alert,FormControl,FormHelperText,Menu,MenuItem,Autocomplete
// } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { RiCloseLine } from 'react-icons/ri';
// import { AiOutlinePlusCircle } from 'react-icons/ai';
// import { CiDiscount1 } from 'react-icons/ci';
// import CreatableSelect from 'react-select/creatable';
// import { templateAPI } from "../../../../services/api";
// import SaveAsServiceDrawer from "./SaveAsServiceDrawer"
// import EditServiceDrawer from "./EditServiceDrawer"



// const ServicesComponent = ({ 
//   formData, 
//   updateFormData, 
//   stepErrors, 
//   setStepErrors,
//   serviceoptions 
// }) => {
//   // Menu state management
//   const [menuAnchor, setMenuAnchor] = useState(null); // { rowIndex: null, anchorEl: null }
//   const [selectedRowData, setSelectedRowData] = useState(null);
//   const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//   const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
//   const [isNewServiceDrawerOpen, setIsNewServiceDrawerOpen] = useState(false);

//   const itemizedData = formData.services.itemizedData || {
//     name: '',
//     price: '',
//     rows: [getEmptyRow()],
//     subtotal: '0.00',
//     taxRate: '0',
//     taxTotal: '0.00',
//     totalAmount: '0.00'
//   };

//   function getEmptyRow() {
//     return {
//       productorService: '',
//       description: '',
//       rate: '0.00',
//       quantity: '1',
//       amount: '0.00',
//       tax: false,
//       isDiscount: false,
//     };
//   }

//   // Menu handlers
//   const handleMenuOpen = (event, rowIndex) => {
//     setMenuAnchor({
//       rowIndex,
//       anchorEl: event.currentTarget
//     });
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//   };

//   // Helper to check if menu is open for specific row
//   const isMenuOpen = (rowIndex) => {
//     return menuAnchor && menuAnchor.rowIndex === rowIndex;
//   };

//   const handleEditService = (row, rowIndex) => {
//     console.log("Row data:", row);
//     setSelectedRowData(row);
//     setSelectedRowIndex(rowIndex);
//     handleMenuClose();
//     setIsEditDrawerOpen(true);
//   };

//   const closeEditDrawer = () => {
//     setSelectedRowData(null);
//     setSelectedRowIndex(null);
//     handleMenuClose();
//     setIsEditDrawerOpen(false);
//   };

//   const handleSaveChanges = (updatedRowData = null) => {
//     const dataToUse = updatedRowData || selectedRowData;
    
//     if (selectedRowIndex !== null && dataToUse) {
//       console.log("🔄 Saving changes for row:", selectedRowIndex);
//       console.log("📝 Row data to save:", dataToUse);

//       const currentRows = [...itemizedData.rows];
//       const updatedRows = currentRows.map((row, index) => {
//         if (index === selectedRowIndex) {
//           return { ...dataToUse };
//         }
//         return row;
//       });

//       const recalculatedRows = recalculateRowAmounts(updatedRows);
//       const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
      
//       updateFormData('services', {
//         itemizedData: {
//           ...itemizedData,
//           rows: recalculatedRows,
//           ...summary
//         }
//       });
      
//       clearRowErrors(selectedRowIndex);
//     }
    
//     closeEditDrawer();
//   };

//   const handleDuplicate = (rowIndex) => {
//     if (rowIndex !== null) {
//       const rowToDuplicate = itemizedData.rows[rowIndex];
      
//       // Create a duplicate with "Copy" extension
//       const duplicatedRow = {
//         ...rowToDuplicate,
//         productorService: `${rowToDuplicate.productorService} Copy`,
//         description: rowToDuplicate.description,
//         rate: rowToDuplicate.rate,
//         quantity: rowToDuplicate.quantity,
//         amount: rowToDuplicate.amount,
//         tax: rowToDuplicate.tax,
//         isDiscount: rowToDuplicate.isDiscount,
//       };
      
//       // Insert the duplicated row after the original row
//       const newRows = [...itemizedData.rows];
//       newRows.splice(rowIndex + 1, 0, duplicatedRow);
      
//       const summary = calculateSummary(newRows, itemizedData.taxRate);
      
//       updateFormData('services', {
//         itemizedData: {
//           ...itemizedData,
//           rows: newRows,
//           ...summary
//         }
//       });
      
//       handleMenuClose();
//     }
//   };

//   // Validate itemized data
//   const validateItemizedData = () => {
//     const newErrors = {};
    
//     // Check if any rows exist
//     if (!itemizedData.rows || itemizedData.rows.length === 0) {
//       newErrors.itemized = 'At least one line item is required';
//     } else {
//       // Check each row for required fields
//       const rowErrors = itemizedData.rows.map((row, index) => {
//         const rowError = {};
        
//         if (!row.productorService?.trim()) {
//           rowError.productorService = 'Product/Service name is required';
//         }
        
//         if (!row.rate || parseFloat(row.rate) <= 0) {
//           rowError.rate = 'Valid rate is required';
//         }
        
//         if (!row.quantity || parseFloat(row.quantity) <= 0) {
//           rowError.quantity = 'Valid quantity is required';
//         }
        
//         return Object.keys(rowError).length > 0 ? { rowIndex: index, ...rowError } : null;
//       }).filter(Boolean);
      
//       if (rowErrors.length > 0) {
//         newErrors.rowErrors = rowErrors;
//         newErrors.itemizedDetails = 'Please fix line item errors';
//       }
//     }
    
//     setStepErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Clear specific error when field is updated
//   const clearFieldError = (field) => {
//     if (stepErrors[field]) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   // Clear row errors when a row is updated
//   const clearRowErrors = (rowIndex) => {
//     if (stepErrors.rowErrors) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         newErrors.rowErrors = newErrors.rowErrors.filter(error => error.rowIndex !== rowIndex);
//         if (newErrors.rowErrors.length === 0) {
//           delete newErrors.rowErrors;
//           delete newErrors.itemizedDetails;
//         }
//         return newErrors;
//       });
//     }
//   };

//   const updateItemizedData = (field, value) => {
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         [field]: value
//       }
//     });
//   };

//   const updateItemizedDataField = (field, value) => {
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         [field]: value
//       }
//     });
//   };

//   // Row management functions
//   const addRow = (isDiscount = false) => {
//     const newRow = getEmptyRow();
//     if (isDiscount) {
//       newRow.isDiscount = true;
//       newRow.productorService = 'Discount';
//     }
    
//     const updatedRows = [...(itemizedData.rows || []), newRow];
//     const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: updatedRows,
//         ...summary
//       }
//     });
    
//     // Clear errors when adding new row
//     clearFieldError('itemized');
//   };

//   const deleteRow = (rowIndex) => {
//     const updatedRows = itemizedData.rows.filter((_, index) => index !== rowIndex);
//     const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: updatedRows,
//         ...summary
//       }
//     });
    
//     // Clear errors for deleted row
//     clearRowErrors(rowIndex);
//     handleMenuClose();
//   };

//   const handleInputChange = (rowIndex, e) => {
//     const { name, value, type, checked } = e.target;
    
//     const updatedRows = itemizedData.rows.map((row, index) => 
//       index === rowIndex 
//         ? { ...row, [name]: type === 'checkbox' ? checked : value }
//         : row
//     );
    
//     const recalculatedRows = recalculateRowAmounts(updatedRows);
//     const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: recalculatedRows,
//         ...summary
//       }
//     });
    
//     // Clear errors when user starts typing
//     if (name === 'productorService' && value.trim() !== '') {
//       clearRowErrors(rowIndex);
//     }
//     if ((name === 'rate' || name === 'quantity') && value && parseFloat(value) > 0) {
//       clearRowErrors(rowIndex);
//     }
//   };

//   // New handler functions for CreatableSelect
//   const handleServiceChange = (index, selectedOption) => {
//     const updatedRows = itemizedData.rows.map((row, i) => 
//       i === index 
//         ? { ...row, productorService: selectedOption ? selectedOption.label : "" }
//         : row
//     );
    
//     const recalculatedRows = recalculateRowAmounts(updatedRows);
//     const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: recalculatedRows,
//         ...summary
//       }
//     });
    
//     // Clear errors when service is selected
//     if (selectedOption && selectedOption.label) {
//       clearRowErrors(index);
//     }
    
//     // Call fetch only if an option is actually selected
//     if (selectedOption && selectedOption.value) {
//       fetchservicebyid(selectedOption.value, index);
//     }
//   };

//   const fetchservicebyid = async (id, rowIndex) => {
//   try {
//     const response = await templateAPI.getServiceTemplateDetailedById(id);

//     const result = response.data;

//     const service = Array.isArray(result.serviceTemplate)
//       ? result.serviceTemplate[0]
//       : result.serviceTemplate;

//     const rate = service.rate
//       ? parseFloat(service.rate.replace("$", ""))
//       : 0;

//     const updatedRowData = {
//       productorService: service.serviceName || "",
//       description: service.description || "",
//       rate: rate.toFixed(2),
//       quantity: "1",
//       amount: rate.toFixed(2),
//       tax: service.tax || false,
//       isDiscount: false,
//     };

//     const currentRows = [...formData.services.itemizedData.rows];

//     const updatedRows = currentRows.map((row, index) =>
//       index === rowIndex ? { ...row, ...updatedRowData } : row
//     );

//     const recalculatedRows = recalculateRowAmounts(updatedRows);
//     const summary = calculateSummary(
//       recalculatedRows,
//       formData.services.itemizedData.taxRate
//     );

//     updateFormData("services", {
//       itemizedData: {
//         ...formData.services.itemizedData,
//         rows: recalculatedRows,
//         ...summary,
//       },
//     });

//     clearRowErrors(rowIndex);
//   } catch (error) {
//     console.error("Error fetching service:", error);
//   }
// };

//   const handleServiceInputChange = (inputValue, actionMeta, index) => {
//     if (actionMeta.action === "input-change") {
//       const updatedRows = itemizedData.rows.map((row, i) => 
//         i === index 
//           ? { ...row, productorService: inputValue }
//           : row
//       );
      
//       const recalculatedRows = recalculateRowAmounts(updatedRows);
//       const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
      
//       updateFormData('services', {
//         itemizedData: {
//           ...itemizedData,
//           rows: recalculatedRows,
//           ...summary
//         }
//       });
      
//       // Clear errors when user types
//       if (inputValue.trim() !== '') {
//         clearRowErrors(index);
//       }
//     }
//   };

//   const calculateSummary = (rows, taxRate = 0) => {
//     const subtotal = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
//     const taxRateValue = parseFloat(taxRate) || 0;
    
//     const taxableAmount = rows.reduce((sum, row) => {
//       return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
//     }, 0);
    
//     const taxTotal = taxableAmount * (taxRateValue / 100);
//     const totalAmount = subtotal + taxTotal;
    
//     return {
//       subtotal: subtotal.toFixed(2),
//       taxTotal: taxTotal.toFixed(2),
//       totalAmount: totalAmount.toFixed(2)
//     };
//   };

//   const recalculateRowAmounts = (rows) => {
//     return rows.map(row => {
//       const rate = parseFloat(row.rate) || 0;
//       const quantity = parseFloat(row.quantity) || 0;
//       const amount = rate * quantity;
//       return { ...row, amount: amount.toFixed(2) };
//     });
//   };

//   const handleTaxRateChange = (e) => {
//     const value = e.target.value;
//     updateItemizedDataField('taxRate', value);
    
//     // Recalculate tax with new rate
//     const subtotal = itemizedData.rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
//     const taxRateValue = parseFloat(value) || 0;
    
//     const taxableAmount = itemizedData.rows.reduce((sum, row) => {
//       return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
//     }, 0);
    
//     const taxTotal = taxableAmount * (taxRateValue / 100);
//     const totalAmount = subtotal + taxTotal;
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         taxRate: value,
//         taxTotal: taxTotal.toFixed(2),
//         totalAmount: totalAmount.toFixed(2)
//       }
//     });
//   };

//   // Get error for specific row and field
//   const getRowError = (rowIndex, field) => {
//     if (stepErrors.rowErrors) {
//       const rowError = stepErrors.rowErrors.find(error => error.rowIndex === rowIndex);
//       return rowError ? rowError[field] : null;
//     }
//     return null;
//   };
  
// const [categoryData, setCategoryData] = useState([]);
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//   try {
//     const response = await templateAPI.getAllCategories();
//     setCategoryData(response.data.category || []);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };
//   const categoryoptions = categoryData.map((category) => ({
//     value: category._id,
//     label: category.categoryName,
//   }));
//   // Handler for saving as new service
//   const handleServiceCreated = (newService) => {
//     console.log('New service created:', newService);
//   };

//   const handleCategoryCreated = (newCategory) => {
//     console.log('New category created:', newCategory);
//       fetchData()
//   };

//   return (
//     <div className="itemized-section">
//       <h3>Itemized Service</h3>
//       <div className="info-message">
//         <p>⚠️ No Payment step will be shown for itemized services</p>
//       </div>

//       {/* Line Items Section */}
//       <Box sx={{ mt: 3 }}>
//         <Box sx={{ margin: "20px 0 10px 0" }}>
//           <Typography variant="h6">Line items</Typography>
//           <Typography variant="body2">Client-facing itemized list of products and services</Typography>
//         </Box>
        
//         <Box sx={{ overflow: "auto", width: "100%" }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Product or service</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Rate</TableCell>
//                 <TableCell>Qty</TableCell>
//                 <TableCell>Amount</TableCell>
//                 <TableCell>Tax</TableCell>
//                 <TableCell></TableCell>
//                 <TableCell></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {itemizedData.rows && itemizedData.rows.map((row, rowIndex) => (
//                 <TableRow key={rowIndex}>
//                   <TableCell>
//                     <FormControl error={!!getRowError(rowIndex, 'productorService')}>
                      
//                       <Autocomplete
//                       size='small'
//   value={row.productorService ? 
//     (typeof row.productorService === 'string' ? 
//       { title: row.productorService } : 
//       { title: row.productorService.label }
//     ) : 
//     null
//   }
//   onChange={(event, newValue) => {
//     if (typeof newValue === 'string') {
//       // User typed and pressed enter
//       handleServiceChange(rowIndex, { label: newValue, value: newValue });
//     } else if (newValue && newValue.inputValue) {
//       // User clicked "Add" option
//       handleServiceChange(rowIndex, { 
//         label: newValue.inputValue, 
//         value: newValue.inputValue 
//       });
//     } else if (newValue) {
//       // User selected from existing options
//       handleServiceChange(rowIndex, { 
//         label: newValue.title, 
//         value: newValue.value || newValue.title 
//       });
//     } else {
//       // User cleared the selection
//       handleServiceChange(rowIndex, null);
//     }
//   }}
//   onInputChange={(event, inputValue, reason) => {
//     if (reason === 'input') {
//       handleServiceInputChange(inputValue, { action: 'input-change' }, rowIndex);
//     }
//   }}
//   filterOptions={(options, params) => {
//     const filtered = options.filter(option => 
//       option.title.toLowerCase().includes(params.inputValue.toLowerCase())
//     );

//     const { inputValue } = params;
//     // Suggest the creation of a new value
//     const isExisting = options.some((option) => 
//       inputValue.toLowerCase() === option.title.toLowerCase()
//     );
    
//     if (inputValue !== '' && !isExisting) {
//       filtered.push({
//         inputValue,
//         title: `Add "${inputValue}"`,
//       });
//     }

//     return filtered;
//   }}
//   selectOnFocus
//   clearOnBlur
//   handleHomeEndKeys
//   options={serviceoptions.map(option => ({
//     title: option.label,
//     value: option.value
//   }))}
//   getOptionLabel={(option) => {
//     // Value selected with enter, right from the input
//     if (typeof option === 'string') {
//       return option;
//     }
//     // Add "xxx" option created dynamically
//     if (option.inputValue) {
//       return option.inputValue;
//     }
//     // Regular option
//     return option.title;
//   }}
//   renderOption={(props, option) => {
//     const { key, ...optionProps } = props;
//     return (
//       <li key={key} {...optionProps}>
//         {option.title}
//       </li>
//     );
//   }}
//   sx={{ 
//     width: 180,
//     '& .MuiOutlinedInput-root': {
//       borderColor: getRowError(rowIndex, 'productorService') ? 'red' : 'inherit',
//       '& .MuiOutlinedInput-notchedOutline': {
//         borderColor: getRowError(rowIndex, 'productorService') ? 'red' : undefined,
//       },
//       '&:hover .MuiOutlinedInput-notchedOutline': {
//         borderColor: getRowError(rowIndex, 'productorService') ? 'red' : '#999',
//       },
//       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//         borderColor: getRowError(rowIndex, 'productorService') ? 'red' : '#2684ff',
//         boxShadow: getRowError(rowIndex, 'productorService') ? '0 0 0 1px red' : '0 0 0 1px #2684ff',
//       }
//     }
//   }}
//   freeSolo
//   renderInput={(params) => (
//     <TextField 
//       {...params} 
//       placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
//       error={!!getRowError(rowIndex, 'productorService')}
//       helperText={getRowError(rowIndex, 'productorService')}
//     />
//   )}
// />
//                       {getRowError(rowIndex, 'productorService') && (
//                         <FormHelperText error sx={{ mt: 0.5 }}>
//                           {getRowError(rowIndex, 'productorService')}
//                         </FormHelperText>
//                       )}
//                     </FormControl>
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       name="description"
//                       value={row.description}
//                       onChange={(e) => handleInputChange(rowIndex, e)}
//                       placeholder="Description"
//                       fullWidth
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       name="rate"
//                       value={row.rate}
//                       onChange={(e) => handleInputChange(rowIndex, e)}
//                       sx={{ width: "80px" }}
//                       error={!!getRowError(rowIndex, 'rate')}
//                       helperText={getRowError(rowIndex, 'rate')}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       name="quantity"
//                       value={row.quantity}
//                       onChange={(e) => handleInputChange(rowIndex, e)}
//                       sx={{ width: "60px" }}
//                       error={!!getRowError(rowIndex, 'quantity')}
//                       helperText={getRowError(rowIndex, 'quantity')}
//                     />
//                   </TableCell>
//                   <TableCell>${row.amount}</TableCell>
//                   <TableCell>
//                     <Checkbox 
//                       name="tax" 
//                       checked={row.tax} 
//                       onChange={(e) => handleInputChange(rowIndex, e)} 
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={(event) => handleMenuOpen(event, rowIndex)}>
//                       <MoreVertIcon />
//                     </IconButton>
//                     <Menu 
//                       anchorEl={menuAnchor?.anchorEl || null}
//                       open={isMenuOpen(rowIndex)}
//                       onClose={handleMenuClose}
//                       anchorOrigin={{ vertical: "top", horizontal: "left" }}
//                       transformOrigin={{ vertical: "top", horizontal: "left" }}
//                       sx={{ mt: 5 }}
//                     >
//                       <MenuItem onClick={() => handleEditService(row, rowIndex)}>
//                         Edit
//                       </MenuItem>
//                       <MenuItem onClick={() => handleDuplicate(rowIndex)}>
//                         Duplicate
//                       </MenuItem>
//                       <MenuItem onClick={() => deleteRow(rowIndex)}>
//                         Delete
//                       </MenuItem>
//                       <MenuItem onClick={() => {
//                         setSelectedRowData(row);
//                         setIsNewServiceDrawerOpen(true);
//                         handleMenuClose();
//                       }}>
//                         Save as new service
//                       </MenuItem>
//                     </Menu>
//                   </TableCell>
//                   <TableCell>
                   
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>

//         {/* Add Row Buttons */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" }}>
//           <Button 
//             onClick={() => addRow()} 
//             startIcon={<AiOutlinePlusCircle />} 
//             sx={{ color: "blue", fontSize: "15px" }}
//           >
//             Line item
//           </Button>
//           <Button 
//             onClick={() => addRow(true)} 
//             startIcon={<CiDiscount1 />} 
//             sx={{ color: "blue", fontSize: "15px" }}
//           >
//             Discount
//           </Button>
//         </Box>

//         {/* Summary Section */}
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6">Summary</Typography>
//           <Table sx={{ backgroundColor: "#fff", width: "50%" }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Subtotal</TableCell>
//                 <TableCell>Tax Rate</TableCell>
//                 <TableCell>Tax Total</TableCell>
//                 <TableCell>Total</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               <TableRow>
//                 <TableCell>${itemizedData.subtotal || '0.00'}</TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     value={itemizedData.taxRate || '0'}
//                     onChange={handleTaxRateChange}
//                     sx={{ width: "60px" }}
//                     InputProps={{
//                       endAdornment: '%',
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>${itemizedData.taxTotal || '0.00'}</TableCell>
//                 <TableCell>${itemizedData.totalAmount || '0.00'}</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </Box>
//       </Box>

//       {/* Drawers */}
//       <SaveAsServiceDrawer
//         open={isNewServiceDrawerOpen}
//         onClose={() => setIsNewServiceDrawerOpen(false)}
//         selectedRowData={selectedRowData}
//         onServiceCreated={handleServiceCreated}
//         onCategoryCreated={handleCategoryCreated}
//          categoryOptions={categoryoptions}// You'll need to pass these if available
//       />
      
//       <EditServiceDrawer
//         open={isEditDrawerOpen}
//         onClose={closeEditDrawer}
//         selectedRowData={selectedRowData}
//         setSelectedRowData={setSelectedRowData}
//         onSave={(updatedData) => handleSaveChanges(updatedData)}
//       />
//     </div>
//   );
// };
// export default ServicesComponent;
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Card, CardContent } from "../../../../components/ui/card";
import { MoreVertical, PlusCircle, Percent, DollarSign } from "lucide-react";
import { templateAPI } from "../../../../services/api";
import SaveAsServiceDrawer from "./SaveAsServiceDrawer";
import EditServiceDrawer from "./EditServiceDrawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { cn } from "../../../../lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";

const ServicesComponent = ({ 
  formData, 
  updateFormData, 
  stepErrors, 
  setStepErrors,
  serviceoptions 
}) => {
  // Menu state management
  const [menuOpenForRow, setMenuOpenForRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isNewServiceDrawerOpen, setIsNewServiceDrawerOpen] = useState(false);

  const itemizedData = formData.services.itemizedData || {
    name: '',
    price: '',
    rows: [getEmptyRow()],
    subtotal: '0.00',
    taxRate: '0',
    taxTotal: '0.00',
    totalAmount: '0.00'
  };

  function getEmptyRow() {
    return {
      productorService: '',
      description: '',
      rate: '0.00',
      quantity: '1',
      amount: '0.00',
      tax: false,
      isDiscount: false,
    };
  }

  // Menu handlers
  const handleMenuOpen = (rowIndex) => {
    setMenuOpenForRow(rowIndex);
  };

  const handleMenuClose = () => {
    setMenuOpenForRow(null);
  };

  const handleEditService = (row, rowIndex) => {
    console.log("Row data:", row);
    setSelectedRowData(row);
    setSelectedRowIndex(rowIndex);
    handleMenuClose();
    setIsEditDrawerOpen(true);
  };

  const closeEditDrawer = () => {
    setSelectedRowData(null);
    setSelectedRowIndex(null);
    handleMenuClose();
    setIsEditDrawerOpen(false);
  };

  const handleSaveChanges = (updatedRowData = null) => {
    const dataToUse = updatedRowData || selectedRowData;
    
    if (selectedRowIndex !== null && dataToUse) {
      console.log("🔄 Saving changes for row:", selectedRowIndex);
      console.log("📝 Row data to save:", dataToUse);

      const currentRows = [...itemizedData.rows];
      const updatedRows = currentRows.map((row, index) => {
        if (index === selectedRowIndex) {
          return { ...dataToUse };
        }
        return row;
      });

      const recalculatedRows = recalculateRowAmounts(updatedRows);
      const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
      
      updateFormData('services', {
        itemizedData: {
          ...itemizedData,
          rows: recalculatedRows,
          ...summary
        }
      });
      
      clearRowErrors(selectedRowIndex);
    }
    
    closeEditDrawer();
  };

  const handleDuplicate = (rowIndex) => {
    if (rowIndex !== null) {
      const rowToDuplicate = itemizedData.rows[rowIndex];
      
      const duplicatedRow = {
        ...rowToDuplicate,
        productorService: `${rowToDuplicate.productorService} Copy`,
        description: rowToDuplicate.description,
        rate: rowToDuplicate.rate,
        quantity: rowToDuplicate.quantity,
        amount: rowToDuplicate.amount,
        tax: rowToDuplicate.tax,
        isDiscount: rowToDuplicate.isDiscount,
      };
      
      const newRows = [...itemizedData.rows];
      newRows.splice(rowIndex + 1, 0, duplicatedRow);
      
      const summary = calculateSummary(newRows, itemizedData.taxRate);
      
      updateFormData('services', {
        itemizedData: {
          ...itemizedData,
          rows: newRows,
          ...summary
        }
      });
      
      handleMenuClose();
    }
  };

  // Validate itemized data
  const validateItemizedData = () => {
    const newErrors = {};
    
    if (!itemizedData.rows || itemizedData.rows.length === 0) {
      newErrors.itemized = 'At least one line item is required';
    } else {
      const rowErrors = itemizedData.rows.map((row, index) => {
        const rowError = {};
        
        if (!row.productorService?.trim()) {
          rowError.productorService = 'Product/Service name is required';
        }
        
        if (!row.rate || parseFloat(row.rate) <= 0) {
          rowError.rate = 'Valid rate is required';
        }
        
        if (!row.quantity || parseFloat(row.quantity) <= 0) {
          rowError.quantity = 'Valid quantity is required';
        }
        
        return Object.keys(rowError).length > 0 ? { rowIndex: index, ...rowError } : null;
      }).filter(Boolean);
      
      if (rowErrors.length > 0) {
        newErrors.rowErrors = rowErrors;
        newErrors.itemizedDetails = 'Please fix line item errors';
      }
    }
    
    setStepErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field) => {
    if (stepErrors[field]) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const clearRowErrors = (rowIndex) => {
    if (stepErrors.rowErrors) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        newErrors.rowErrors = newErrors.rowErrors.filter(error => error.rowIndex !== rowIndex);
        if (newErrors.rowErrors.length === 0) {
          delete newErrors.rowErrors;
          delete newErrors.itemizedDetails;
        }
        return newErrors;
      });
    }
  };

  const updateItemizedData = (field, value) => {
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        [field]: value
      }
    });
  };

  const updateItemizedDataField = (field, value) => {
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        [field]: value
      }
    });
  };

  const addRow = (isDiscount = false) => {
    const newRow = getEmptyRow();
    if (isDiscount) {
      newRow.isDiscount = true;
      newRow.productorService = 'Discount';
    }
    
    const updatedRows = [...(itemizedData.rows || []), newRow];
    const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: updatedRows,
        ...summary
      }
    });
    
    clearFieldError('itemized');
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = itemizedData.rows.filter((_, index) => index !== rowIndex);
    const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: updatedRows,
        ...summary
      }
    });
    
    clearRowErrors(rowIndex);
    handleMenuClose();
  };

  const handleInputChange = (rowIndex, e) => {
    const { name, value, type, checked } = e.target;
    
    const updatedRows = itemizedData.rows.map((row, index) => 
      index === rowIndex 
        ? { ...row, [name]: type === 'checkbox' ? checked : value }
        : row
    );
    
    const recalculatedRows = recalculateRowAmounts(updatedRows);
    const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: recalculatedRows,
        ...summary
      }
    });
    
    if (name === 'productorService' && value.trim() !== '') {
      clearRowErrors(rowIndex);
    }
    if ((name === 'rate' || name === 'quantity') && value && parseFloat(value) > 0) {
      clearRowErrors(rowIndex);
    }
  };

  const handleServiceChange = (index, selectedOption) => {
    const updatedRows = itemizedData.rows.map((row, i) => 
      i === index 
        ? { ...row, productorService: selectedOption ? selectedOption.label : "" }
        : row
    );
    
    const recalculatedRows = recalculateRowAmounts(updatedRows);
    const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: recalculatedRows,
        ...summary
      }
    });
    
    if (selectedOption && selectedOption.label) {
      clearRowErrors(index);
    }
    
    if (selectedOption && selectedOption.value) {
      fetchservicebyid(selectedOption.value, index);
    }
  };

  const fetchservicebyid = async (id, rowIndex) => {
    try {
      const response = await templateAPI.getServiceTemplateDetailedById(id);
      const result = response.data;
      const service = Array.isArray(result.serviceTemplate)
        ? result.serviceTemplate[0]
        : result.serviceTemplate;
      const rate = service.rate
        ? parseFloat(service.rate.replace("$", ""))
        : 0;

      const updatedRowData = {
        productorService: service.serviceName || "",
        description: service.description || "",
        rate: rate.toFixed(2),
        quantity: "1",
        amount: rate.toFixed(2),
        tax: service.tax || false,
        isDiscount: false,
      };

      const currentRows = [...formData.services.itemizedData.rows];
      const updatedRows = currentRows.map((row, index) =>
        index === rowIndex ? { ...row, ...updatedRowData } : row
      );

      const recalculatedRows = recalculateRowAmounts(updatedRows);
      const summary = calculateSummary(
        recalculatedRows,
        formData.services.itemizedData.taxRate
      );

      updateFormData("services", {
        itemizedData: {
          ...formData.services.itemizedData,
          rows: recalculatedRows,
          ...summary,
        },
      });

      clearRowErrors(rowIndex);
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  const handleServiceInputChange = (inputValue, actionMeta, index) => {
    if (actionMeta.action === "input-change") {
      const updatedRows = itemizedData.rows.map((row, i) => 
        i === index 
          ? { ...row, productorService: inputValue }
          : row
      );
      
      const recalculatedRows = recalculateRowAmounts(updatedRows);
      const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
      
      updateFormData('services', {
        itemizedData: {
          ...itemizedData,
          rows: recalculatedRows,
          ...summary
        }
      });
      
      if (inputValue.trim() !== '') {
        clearRowErrors(index);
      }
    }
  };

  const calculateSummary = (rows, taxRate = 0) => {
    const subtotal = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    const taxRateValue = parseFloat(taxRate) || 0;
    
    const taxableAmount = rows.reduce((sum, row) => {
      return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
    }, 0);
    
    const taxTotal = taxableAmount * (taxRateValue / 100);
    const totalAmount = subtotal + taxTotal;
    
    return {
      subtotal: subtotal.toFixed(2),
      taxTotal: taxTotal.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const recalculateRowAmounts = (rows) => {
    return rows.map(row => {
      const rate = parseFloat(row.rate) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      const amount = rate * quantity;
      return { ...row, amount: amount.toFixed(2) };
    });
  };

  const handleTaxRateChange = (e) => {
    const value = e.target.value;
    updateItemizedDataField('taxRate', value);
    
    const subtotal = itemizedData.rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    const taxRateValue = parseFloat(value) || 0;
    
    const taxableAmount = itemizedData.rows.reduce((sum, row) => {
      return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
    }, 0);
    
    const taxTotal = taxableAmount * (taxRateValue / 100);
    const totalAmount = subtotal + taxTotal;
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        taxRate: value,
        taxTotal: taxTotal.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      }
    });
  };

  const getRowError = (rowIndex, field) => {
    if (stepErrors.rowErrors) {
      const rowError = stepErrors.rowErrors.find(error => error.rowIndex === rowIndex);
      return rowError ? rowError[field] : null;
    }
    return null;
  };
  
  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await templateAPI.getAllCategories();
      setCategoryData(response.data.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const categoryoptions = categoryData.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));

  const handleServiceCreated = (newService) => {
    console.log('New service created:', newService);
  };

  const handleCategoryCreated = (newCategory) => {
    console.log('New category created:', newCategory);
    fetchData();
  };

  // Service Autocomplete Component
  const ServiceAutocomplete = ({ value, onChange, onInputChange, error, placeholder, disabled }) => {
    const [open, setOpen] = useState(false);
    
    const options = serviceoptions.map(option => ({
      value: option.value,
      label: option.label
    }));

    const displayValue = value?.label || value || '';

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[180px] justify-between font-normal",
              error && "border-red-500"
            )}
            disabled={disabled}
          >
            {displayValue || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search service..." 
              onValueChange={(search) => onInputChange(search, { action: 'input-change' })}
            />
            <CommandList>
              <CommandEmpty>No service found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={(currentValue) => {
                      onChange({ label: currentValue, value: option.value });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        displayValue === option.label ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Itemized Service</h3>
        <Alert className="mt-2 bg-yellow-50 border-yellow-200">
          <AlertDescription>
            ⚠️ No Payment step will be shown for itemized services
          </AlertDescription>
        </Alert>
      </div>

      {/* Line Items Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-semibold">Line items</h4>
          <p className="text-sm text-muted-foreground">
            Client-facing itemized list of products and services
          </p>
        </div>
        
        <div className="overflow-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Product or service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Rate</TableHead>
                <TableHead className="w-[80px]">Qty</TableHead>
                <TableHead className="w-[100px]">Amount</TableHead>
                <TableHead className="w-[60px]">Tax</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemizedData.rows && itemizedData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <div className="space-y-1">
                      <ServiceAutocomplete
                        value={row.productorService}
                        onChange={(selected) => handleServiceChange(rowIndex, selected)}
                        onInputChange={(input, meta) => handleServiceInputChange(input, meta, rowIndex)}
                        error={!!getRowError(rowIndex, 'productorService')}
                        placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                      />
                      {getRowError(rowIndex, 'productorService') && (
                        <p className="text-xs text-red-500">{getRowError(rowIndex, 'productorService')}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      size="default"
                      name="description"
                      value={row.description}
                      onChange={(e) => handleInputChange(rowIndex, e)}
                      placeholder="Description"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Input
                        size="default"
                        name="rate"
                        value={row.rate}
                        onChange={(e) => handleInputChange(rowIndex, e)}
                        className={cn("w-[80px]", getRowError(rowIndex, 'rate') && "border-red-500")}
                      />
                      {getRowError(rowIndex, 'rate') && (
                        <p className="text-xs text-red-500">{getRowError(rowIndex, 'rate')}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Input
                        size="default"
                        name="quantity"
                        value={row.quantity}
                        onChange={(e) => handleInputChange(rowIndex, e)}
                        className={cn("w-[60px]", getRowError(rowIndex, 'quantity') && "border-red-500")}
                      />
                      {getRowError(rowIndex, 'quantity') && (
                        <p className="text-xs text-red-500">{getRowError(rowIndex, 'quantity')}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${row.amount}</TableCell>
                  <TableCell>
                    <Checkbox
                      name="tax"
                      checked={row.tax}
                      onCheckedChange={(checked) => {
                        const event = { target: { name: 'tax', type: 'checkbox', checked } };
                        handleInputChange(rowIndex, event);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu open={menuOpenForRow === rowIndex} onOpenChange={(open) => !open && handleMenuClose()}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={() => handleMenuOpen(rowIndex)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditService(row, rowIndex)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(rowIndex)}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteRow(rowIndex)}>
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedRowData(row);
                          setIsNewServiceDrawerOpen(true);
                          handleMenuClose();
                        }}>
                          Save as new service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add Row Buttons */}
        <div className="flex items-center gap-4 mt-2">
          <Button 
            onClick={() => addRow()} 
            variant="link"
            className="text-blue-600 hover:text-blue-700 p-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Line item
          </Button>
          <Button 
            onClick={() => addRow(true)} 
            variant="link"
            className="text-blue-600 hover:text-blue-700 p-0"
          >
            <Percent className="mr-2 h-4 w-4" />
            Discount
          </Button>
        </div>

        {/* Summary Section */}
        <div className="mt-6">
          <h4 className="text-md font-semibold mb-3">Summary</h4>
          <div className="border rounded-lg bg-white w-full md:w-1/2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Tax Total</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {itemizedData.subtotal || '0.00'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        size="default"
                        value={itemizedData.taxRate || '0'}
                        onChange={handleTaxRateChange}
                        className="w-[60px]"
                      />
                      <span>%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {itemizedData.taxTotal || '0.00'}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {itemizedData.totalAmount || '0.00'}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <SaveAsServiceDrawer
        open={isNewServiceDrawerOpen}
        onClose={() => setIsNewServiceDrawerOpen(false)}
        selectedRowData={selectedRowData}
        onServiceCreated={handleServiceCreated}
        onCategoryCreated={handleCategoryCreated}
        categoryOptions={categoryoptions}
      />
      
      <EditServiceDrawer
        open={isEditDrawerOpen}
        onClose={closeEditDrawer}
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
        onSave={(updatedData) => handleSaveChanges(updatedData)}
      />
    </div>
  );
};

export default ServicesComponent;