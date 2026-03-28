

import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputLabel,
  Switch,
  FormControlLabel,
  Autocomplete,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Menu,
  MenuItem,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import CreatableSelect from "react-select/creatable";
import Editor from "../../../components/Editor";
import ShortcodeTextField from "../../../components/ShortcodeTextField";
import LineItemsAndSummary from "../../../components/LineItemsAndSummary";
// const InvoiceTemplateForm = ({
//   formData,
//   setFormData,
//   rows,
//   subtotal,
//   setSubtotal,
//   taxRate,
//   setTaxRate,
//   taxTotal,
//   totalAmount,
//   description,
//   clientmsg,
//   setClientmsg,
//   serviceoptions,
//   showShortcutDropdown,
//   showSwitchDropdown,
//   anchorElShortcut,
//   switchanchorEl,
//   filteredShortcuts,
//   switchfilteredShortcuts,
//   onDescriptionChange,
//   onAddShortcut,
//   onSwitchAddShortcut,
//   onToggleShortcutDropdown,
//   onToggleSwitchDropdown,
//   onCloseShortcutDropdown,
//   onCloseSwitchdropdown,
//   onInputChange,
//   onServiceChange,
//   onServiceInputChange,
//   onAddRow,
//   onDeleteRow,
//   onEditService,
//   onDeleteService,
//   onDuplicate,
//   onSaveAsNewService,
//   onSave,
//   onSaveAndExit,
//   onCancel,
//   onOpenPreview,
//   isEditMode = false,
//   loading = false,
// }) => {
 
//   const [anchorElNew, setAnchorElNew] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);

//   const paymentsOptions = [
//     { value: "Bank Debits", label: "Bank Debits" },
//     { value: "Credit Card", label: "Credit Card" },
//     {
//       value: "Credit Card or Bank Debits",
//       label: "Credit Card or Bank Debits",
//     },
//   ];

//   const handleMenuOpen = (event, index) => {
//     setAnchorElNew(event.currentTarget);
//     setSelectedRow(index);
//   };

//   const handleMenuClose = () => {
//     setAnchorElNew(null);
//     setSelectedRow(null);
//   };

//   const handleSubtotalChange = (event) => {
//     const value = parseFloat(event.target.value) || 0;
//     setSubtotal(value);
//   };

//   const handleTaxRateChange = (event) => {
//     const value = parseFloat(event.target.value) || 0;
//     setTaxRate(value);
//   };

//   const handlePaymentOptionChange = (event, selectedOption) => {
//     setFormData({ ...formData, paymentMode: selectedOption });
//   };

//   const handleEmailToClient = (event) => {
//     setFormData({ ...formData, emailToClient: event.target.checked });
//   };

//   const handlePayUsingCredits = (event) => {
//     setFormData({ ...formData, payUsingCredits: event.target.checked });
//   };

//   const handleInvoiceReminders = (event) => {
//     setFormData({ ...formData, invoiceReminders: event.target.checked });
//   };

//   const handleServiceChangeWrapper = (index, selectedOption) => {
//     if (selectedOption && onServiceChange) {
//       onServiceChange(index, selectedOption);
//     }
//   };

//   const handleServiceInputChangeWrapper = (inputValue, actionMeta, index) => {
//     if (onServiceInputChange) {
//       onServiceInputChange(inputValue, actionMeta, index);
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "400px",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ mt: 2 }}>
//       <form>
//         <Box>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               mb: 2,
//             }}
//           >
//             <Box>
//               <Typography variant="h6">
//                 {isEditMode
//                   ? "Edit Invoice Template"
//                   : "Create Invoice Template"}
//               </Typography>
//             </Box>
//             <Button
//               onClick={onOpenPreview}
//               startIcon={<PlagiarismIcon fontSize="small" />}
//               sx={{
//                 color: "#1168bf",
//                 textTransform: "none",
//                 padding: 0,
//                 minWidth: "auto",
//               }}
//             >
//               Preview
//             </Button>
//           </Box>
//           <Divider sx={{ mt: 1, margin: "0 auto" }} />
//           <Box>
//             <Grid
//               container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Box m={2}>
//                   <Box>
//                     <InputLabel sx={{ color: "black" }}>
//                       Template Name
//                     </InputLabel>
//                     <TextField
//                       fullWidth
//                       name="TemplateName"
//                       placeholder="Template Name"
//                       size="small"
//                       sx={{ mt: 2 }}
//                       error={!!formData.templatenameError}
//                       value={formData.templatename}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           templatename: e.target.value,
//                         })
//                       }
//                     />
//                   </Box>

//                   {/* Description with ShortcodeTextField */}
//                   <Box sx={{ mt: 2 }}>
//                     <ShortcodeTextField
//                       label="Description"
//                       value={description}
//                       onChange={onDescriptionChange}
//                       placeholder="Description"
//                       error={!!formData.descriptionError}
//                       multiline
//                       rows={3}
//                       maxLength={50000}
//                       shortcuts={filteredShortcuts}
//                       showShortcutDropdown={showShortcutDropdown}
//                       anchorElShortcut={anchorElShortcut}
//                       onToggleShortcutDropdown={onToggleShortcutDropdown}
//                       onCloseShortcutDropdown={onCloseShortcutDropdown}
//                       onAddShortcut={onAddShortcut}
//                     />
//                   </Box>

//                   <Box sx={{ mt: 2 }}>
//                     <InputLabel sx={{ color: "black" }}>
//                       Choose payment method
//                     </InputLabel>
//                     <Autocomplete
//                       size="small"
//                       fullWidth
//                       sx={{ mt: 1 }}
//                       options={paymentsOptions}
//                       getOptionLabel={(option) => option?.label || ""}
//                       onChange={handlePaymentOptionChange}
//                       value={formData.paymentMode}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           placeholder="Select Payment Mode"
//                           variant="outlined"
//                         />
//                       )}
//                       isOptionEqualToValue={(option, value) =>
//                         option.value === value?.value
//                       }
//                       clearOnEscape
//                     />
//                   </Box>

//                   <Box mt={2}>
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           onChange={handleEmailToClient}
//                           checked={formData.emailToClient}
//                           color="primary"
//                         />
//                       }
//                       label={"Send email to client when invoice created"}
//                     />
//                     {formData.emailToClient && (
//                       <Box mt={2}>
//                         {/* Client Message with ShortcodeTextField */}
//                         <ShortcodeTextField
//                           label="Email Message to Client"
//                           value={clientmsg}
//                           onChange={(e) => setClientmsg(e.target.value)}
//                           placeholder="Enter email message to client..."
//                           multiline
//                           rows={3}
//                           shortcuts={switchfilteredShortcuts}
//                           showShortcutDropdown={showSwitchDropdown}
//                           anchorElShortcut={switchanchorEl}
//                           onToggleShortcutDropdown={onToggleSwitchDropdown}
//                           onCloseSwitchdropdown={onCloseSwitchdropdown}
//                           onAddShortcut={onSwitchAddShortcut}
//                         />
//                       </Box>
//                     )}
//                   </Box>

//                   <Box mt={2}>
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           onChange={handlePayUsingCredits}
//                           checked={formData.payUsingCredits}
//                           color="primary"
//                         />
//                       }
//                       label={"Pay invoice with credits if available"}
//                     />
//                   </Box>

//                   <Box mt={2}>
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           onChange={handleInvoiceReminders}
//                           checked={formData.invoiceReminders}
//                           color="primary"
//                         />
//                       }
//                       label={"Send Reminders to clients"}
//                     />
//                     {formData.invoiceReminders && (
//                       <Box
//                         sx={{
//                           display: "flex",
//                           gap: "20px",
//                           flexDirection: "column",
//                           mt: 2,
//                         }}
//                       >
//                         <Box>
//                           <InputLabel sx={{ color: "black" }}>
//                             Days until next reminder
//                           </InputLabel>
//                           <TextField
//                             fullWidth
//                             placeholder="Days until next reminder"
//                             size="small"
//                             sx={{ mt: 1 }}
//                             value={formData.daysNextReminder}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 daysNextReminder: e.target.value,
//                               })
//                             }
//                           />
//                         </Box>
//                         <Box>
//                           <InputLabel sx={{ color: "black" }}>
//                             Number of reminders
//                           </InputLabel>
//                           <TextField
//                             fullWidth
//                             placeholder="Number of reminders"
//                             size="small"
//                             sx={{ mt: 1 }}
//                             value={formData.numOfReminder}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 numOfReminder: e.target.value,
//                               })
//                             }
//                           />
//                         </Box>
//                       </Box>
//                     )}
//                   </Box>
//                 </Box>
//               </Grid>

//               {/* add vertical line */}
//               <Box
//                 sx={{
//                   display: { xs: "none", md: "block" },
//                   borderRight: "1px solid #c7c7c7",
//                   mx: 2,
//                 }}
//               />

//               <Grid size={{ xs: 12, md: 5 }}>
//                 <Box>
//                   <Box sx={{ margin: "20px 0 10px 0" }}>
//                     <Typography variant="h6">Line items</Typography>
//                     <Typography variant="body2">
//                       Client-facing itemized list of products and services
//                     </Typography>
//                   </Box>

//                   <Box sx={{ overflow: "auto", width: "100%" }}>
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               position: "sticky",
//                               left: 0,
//                               backgroundColor: "white",
//                               zIndex: 1,
//                               width: "20%",
//                             }}
//                           >
//                             Product or service
//                           </TableCell>
//                           <TableCell>Description</TableCell>
//                           <TableCell>Rate</TableCell>
//                           <TableCell>Qty</TableCell>
//                           <TableCell>Amount</TableCell>
//                           <TableCell>Tax</TableCell>
//                           <TableCell>Settings</TableCell>
//                           <TableCell></TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {rows.map((row, index) => (
//                           <TableRow key={index}>
//                             <TableCell
//                               sx={{
//                                 position: "sticky",
//                                 left: 0,
//                                 backgroundColor: "white",
//                                 zIndex: 1,
//                               }}
//                             >
//                               <CreatableSelect
//                                 placeholder={
//                                   row.isDiscount
//                                     ? "Reason for discount"
//                                     : "Product or Service"
//                                 }
//                                 options={serviceoptions}
//                                 value={
//                                   row.productName
//                                     ? serviceoptions.find(
//                                         (option) =>
//                                           option.label === row.productName,
//                                       ) || {
//                                         label: row.productName,
//                                         value: row.productName,
//                                       }
//                                     : null
//                                 }
//                                 onChange={(selectedOption) =>
//                                   handleServiceChangeWrapper(
//                                     index,
//                                     selectedOption,
//                                   )
//                                 }
//                                 onInputChange={(inputValue, actionMeta) =>
//                                   handleServiceInputChangeWrapper(
//                                     inputValue,
//                                     actionMeta,
//                                     index,
//                                   )
//                                 }
//                                 isClearable
//                                 styles={{
//                                   container: (provided) => ({
//                                     ...provided,
//                                     width: "180px",
//                                   }),
//                                   control: (provided) => ({
//                                     ...provided,
//                                     width: "180px",
//                                   }),
//                                   menuPortal: (provided) => ({
//                                     ...provided,
//                                     zIndex: 9999,
//                                   }),
//                                 }}
//                                 menuPortalTarget={document.body}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <input
//                                 type="text"
//                                 name="description"
//                                 value={row.description}
//                                 onChange={(e) => onInputChange(index, e)}
//                                 style={{ border: "none", width: "100%" }}
//                                 placeholder="Description"
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <input
//                                 type="text"
//                                 name="rate"
//                                 value={row.rate}
//                                 onChange={(e) => onInputChange(index, e)}
//                                 style={{ border: "none", width: "100%" }}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <input
//                                 type="text"
//                                 name="qty"
//                                 value={row.qty}
//                                 onChange={(e) => onInputChange(index, e)}
//                                 style={{ border: "none", width: "100%" }}
//                               />
//                             </TableCell>
//                             <TableCell>{row.amount}</TableCell>
//                             <TableCell>
//                               <Checkbox
//                                 name="tax"
//                                 checked={row.tax}
//                                 onChange={(e) => onInputChange(index, e)}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <IconButton
//                                 onClick={(event) =>
//                                   handleMenuOpen(event, index)
//                                 }
//                               >
//                                 <BsThreeDotsVertical />
//                               </IconButton>
//                               <Menu
//                                 anchorEl={anchorElNew}
//                                 open={
//                                   Boolean(anchorElNew) && selectedRow === index
//                                 }
//                                 onClose={handleMenuClose}
//                                 anchorOrigin={{
//                                   vertical: "top",
//                                   horizontal: "left",
//                                 }}
//                                 transformOrigin={{
//                                   vertical: "top",
//                                   horizontal: "left",
//                                 }}
//                               >
//                                 <MenuItem
//                                   onClick={() => {
//                                     onEditService(row, index);
//                                     handleMenuClose();
//                                   }}
//                                 >
//                                   Edit
//                                 </MenuItem>
//                                 <MenuItem
//                                   onClick={() => {
//                                     onDeleteService(index);
//                                     handleMenuClose();
//                                   }}
//                                 >
//                                   Delete
//                                 </MenuItem>
//                                 <MenuItem
//                                   onClick={() => {
//                                     onSaveAsNewService(row);
//                                     handleMenuClose();
//                                   }}
//                                 >
//                                   Save as new service
//                                 </MenuItem>
//                                 <MenuItem
//                                   onClick={() => {
//                                     onDuplicate(index);
//                                     handleMenuClose();
//                                   }}
//                                 >
//                                   Duplicate
//                                 </MenuItem>
//                               </Menu>
//                             </TableCell>
//                             <TableCell>
//                               <IconButton
//                                 onClick={() => {
//                                   onDeleteRow(index);
//                                   handleMenuClose();
//                                 }}
//                               >
//                                 <RiCloseLine />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </Box>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "20px",
//                       marginTop: "10px",
//                     }}
//                   >
//                     <Button
//                       onClick={() => onAddRow(false)}
//                       startIcon={<AiOutlinePlusCircle />}
//                       sx={{ color: "blue", fontSize: "15px" }}
//                     >
//                       Line item
//                     </Button>
//                     <Button
//                       onClick={() => onAddRow(true)}
//                       startIcon={<CiDiscount1 />}
//                       sx={{ color: "blue", fontSize: "15px" }}
//                     >
//                       Discount
//                     </Button>
//                   </Box>

//                   <Typography variant="h6" sx={{ mt: 2 }}>
//                     Summary
//                   </Typography>
//                   <Table sx={{ backgroundColor: "#fff" }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Subtotal</TableCell>
//                         <TableCell>Tax Rate</TableCell>
//                         <TableCell>Tax Total</TableCell>
//                         <TableCell>Total</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             $
//                             <input
//                               value={subtotal}
//                               onChange={handleSubtotalChange}
//                               style={{ border: "none", width: "50%" }}
//                             />
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <input
//                               value={taxRate}
//                               onChange={handleTaxRateChange}
//                               style={{ border: "none", width: "50%" }}
//                             />
//                             %
//                           </Box>
//                         </TableCell>
//                         <TableCell>${taxTotal?.toFixed(2) || "0.00"}</TableCell>
//                         <TableCell>${totalAmount || "0.00"}</TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>

//                   <Box sx={{ mb: 10, mt: 2 }}>
//                     <Typography variant="h6" mb={1}>
//                       Note to client
//                     </Typography>
//                     <Editor
//                       onChange={(content) =>
//                         setFormData({ ...formData, clientNote: content })
//                       }
//                       initialContent={formData.clientNote}
//                     />
//                   </Box>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>

//           <Divider sx={{ mt: 1, margin: "0 auto" }} />
//           <Box
//             mt={4}
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             gap={2}
//           >
//             <Button onClick={onSaveAndExit} variant="contained" color="primary">
//               {isEditMode ? "Update & Exit" : "Save & Exit"}
//             </Button>
//             <Button onClick={onSave} variant="contained" color="primary">
//               {isEditMode ? "Update" : "Save"}
//             </Button>
//             <Button variant="outlined" onClick={onCancel}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </form>
//     </Box>
//   );
// };
const InvoiceTemplateForm = ({
  formData,
  setFormData,
  rows,
  subtotal,
  setSubtotal,
  taxRate,
  setTaxRate,
  taxTotal,
  totalAmount,
  description,
  clientmsg,
  setClientmsg,
  serviceoptions,
  showShortcutDropdown,
  showSwitchDropdown,
  anchorElShortcut,
  switchanchorEl,
  filteredShortcuts,
  switchfilteredShortcuts,
  onDescriptionChange,
  onAddShortcut,
  onSwitchAddShortcut,
  onToggleShortcutDropdown,
  onToggleSwitchDropdown,
  onCloseShortcutDropdown,
  onCloseSwitchdropdown,
  onInputChange,
  onServiceChange,
  onServiceInputChange,
  onAddRow,
  onDeleteRow,
  onEditService,
  onDeleteService,
  onDuplicate,
  onSaveAsNewService,
  onSave,
  onSaveAndExit,
  onCancel,
  onOpenPreview,
  isEditMode = false,
  loading = false,
}) => {
  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    {
      value: "Credit Card or Bank Debits",
      label: "Credit Card or Bank Debits",
    },
  ];

  const handlePaymentOptionChange = (event, selectedOption) => {
    setFormData({ ...formData, paymentMode: selectedOption });
  };

  const handleEmailToClient = (event) => {
    setFormData({ ...formData, emailToClient: event.target.checked });
  };

  const handlePayUsingCredits = (event) => {
    setFormData({ ...formData, payUsingCredits: event.target.checked });
  };

  const handleInvoiceReminders = (event) => {
    setFormData({ ...formData, invoiceReminders: event.target.checked });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <form>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6">
                {isEditMode
                  ? "Edit Invoice Template"
                  : "Create Invoice Template"}
              </Typography>
            </Box>
            <Button
              onClick={onOpenPreview}
              startIcon={<PlagiarismIcon fontSize="small" />}
              sx={{
                color: "#1168bf",
                textTransform: "none",
                padding: 0,
                minWidth: "auto",
              }}
            >
              Preview
            </Button>
          </Box>
          <Divider sx={{ mt: 1, margin: "0 auto" }} />
          <Box>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Box m={2}>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>
                      Template Name
                    </InputLabel>
                    <TextField
                      fullWidth
                      name="TemplateName"
                      placeholder="Template Name"
                      size="small"
                      sx={{ mt: 2 }}
                      error={!!formData.templatenameError}
                      value={formData.templatename}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templatename: e.target.value,
                        })
                      }
                    />
                  </Box>

                  {/* Description with ShortcodeTextField */}
                  <Box sx={{ mt: 2 }}>
                    <ShortcodeTextField
                      label="Description"
                      value={description}
                      onChange={onDescriptionChange}
                      placeholder="Description"
                      error={!!formData.descriptionError}
                      multiline
                      rows={3}
                      maxLength={50000}
                      shortcuts={filteredShortcuts}
                      showShortcutDropdown={showShortcutDropdown}
                      anchorElShortcut={anchorElShortcut}
                      onToggleShortcutDropdown={onToggleShortcutDropdown}
                      onCloseShortcutDropdown={onCloseShortcutDropdown}
                      onAddShortcut={onAddShortcut}
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <InputLabel sx={{ color: "black" }}>
                      Choose payment method
                    </InputLabel>
                    <Autocomplete
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                      options={paymentsOptions}
                      getOptionLabel={(option) => option?.label || ""}
                      onChange={handlePaymentOptionChange}
                      value={formData.paymentMode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Payment Mode"
                          variant="outlined"
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value?.value
                      }
                      clearOnEscape
                    />
                  </Box>

                  <Box mt={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={handleEmailToClient}
                          checked={formData.emailToClient}
                          color="primary"
                        />
                      }
                      label={"Send email to client when invoice created"}
                    />
                    {formData.emailToClient && (
                      <Box mt={2}>
                        {/* Client Message with ShortcodeTextField */}
                        <ShortcodeTextField
                          label="Email Message to Client"
                          value={clientmsg}
                          onChange={(e) => setClientmsg(e.target.value)}
                          placeholder="Enter email message to client..."
                          multiline
                          rows={3}
                          shortcuts={switchfilteredShortcuts}
                          showShortcutDropdown={showSwitchDropdown}
                          anchorElShortcut={switchanchorEl}
                          onToggleShortcutDropdown={onToggleSwitchDropdown}
                          onCloseSwitchdropdown={onCloseSwitchdropdown}
                          onAddShortcut={onSwitchAddShortcut}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box mt={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={handlePayUsingCredits}
                          checked={formData.payUsingCredits}
                          color="primary"
                        />
                      }
                      label={"Pay invoice with credits if available"}
                    />
                  </Box>

                  <Box mt={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={handleInvoiceReminders}
                          checked={formData.invoiceReminders}
                          color="primary"
                        />
                      }
                      label={"Send Reminders to clients"}
                    />
                    {formData.invoiceReminders && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "20px",
                          flexDirection: "column",
                          mt: 2,
                        }}
                      >
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            Days until next reminder
                          </InputLabel>
                          <TextField
                            fullWidth
                            placeholder="Days until next reminder"
                            size="small"
                            sx={{ mt: 1 }}
                            value={formData.daysNextReminder}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                daysNextReminder: e.target.value,
                              })
                            }
                          />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            Number of reminders
                          </InputLabel>
                          <TextField
                            fullWidth
                            placeholder="Number of reminders"
                            size="small"
                            sx={{ mt: 1 }}
                            value={formData.numOfReminder}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                numOfReminder: e.target.value,
                              })
                            }
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* add vertical line */}
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  borderRight: "1px solid #c7c7c7",
                  mx: 2,
                }}
              />

              <Grid size={{ xs: 12, md: 5 }}>
                <Box>
                  {/* Replace the entire line items and summary section with the reusable component */}
                  <LineItemsAndSummary
                    rows={rows}
                    serviceoptions={serviceoptions}
                    onInputChange={onInputChange}
                    onServiceChange={onServiceChange}
                    onServiceInputChange={onServiceInputChange}
                    onAddRow={onAddRow}
                    onDeleteRow={onDeleteRow}
                    onEditService={onEditService}
                    onDeleteService={onDeleteService}
                    onSaveAsNewService={onSaveAsNewService}
                    onDuplicate={onDuplicate}
                    subtotal={subtotal}
                    onSubtotalChange={setSubtotal}
                    taxRate={taxRate}
                    onTaxRateChange={setTaxRate}
                    taxTotal={taxTotal}
                    totalAmount={totalAmount}
                    lineItemsTitle="Line items"
                    lineItemsSubtitle="Client-facing itemized list of products and services"
                    summaryTitle="Summary"
                  />

                  <Box sx={{ mb: 10, mt: 2 }}>
                    <Typography variant="h6" mb={1}>
                      Note to client
                    </Typography>
                    <Editor
                      onChange={(content) =>
                        setFormData({ ...formData, clientNote: content })
                      }
                      initialContent={formData.clientNote}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mt: 1, margin: "0 auto" }} />
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Button onClick={onSaveAndExit} variant="contained" color="primary">
              {isEditMode ? "Update & Exit" : "Save & Exit"}
            </Button>
            <Button onClick={onSave} variant="contained" color="primary">
              {isEditMode ? "Update" : "Save"}
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default InvoiceTemplateForm;