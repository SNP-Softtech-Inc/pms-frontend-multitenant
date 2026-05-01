// import  {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
// } from "react";
// import { toast } from "react-toastify";
// import {
//   Box,
//   Button,
//   Typography,
//   IconButton,
//   Radio,
//   FormControlLabel,
//   RadioGroup,
//   FormControl,
//   List,
//   ListItem,
//   ListItemText,
//   Popover,
//   TextField,
//   Autocomplete,
//   TableContainer,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,

//   Menu,
//   MenuItem,
//   CircularProgress,
//   Grid,
//   Divider,
// } from "@mui/material";

// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import EditorShortcodes from "../../../components/EditorShortcodes";
// // import Grid from "@mui/material/Unstable_Grid2";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useDropzone } from "react-dropzone";
// import debounce from "lodash.debounce";
// import { templateAPI, authAPI } from "../../../services/api"; // Adjust the import path as needed
// import ShortcodePopover from "../../../components/ShortcodePopover"
// const EmailTemp = () => {
//   const confirm = useConfirm();
//   // ================= STATE =================
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [templateName, setTemplateName] = useState("");
//   const [selectedOption, setSelectedOption] = useState("contacts");
//   const [inputText, setInputText] = useState("");
//   const [emailBody, setEmailBody] = useState("");
//   const [files, setFiles] = useState([]);
//   const [emailTemplates, setEmailTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [templateNameError, setTemplateNameError] = useState("");
//   const [inputTextError, setInputTextError] = useState("");
//   const [selectedUserError, setSelectedUserError] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [tempIdget, setTempIdGet] = useState(null);

//   const [selecteduser, setSelectedUser] = useState(null);
//   const [userData, setUserData] = useState([]);

//   // Shortcode related states
//   const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textFieldRef = useRef(null);

//   // Inside your Tasks component

//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   const handleMenuOpen = (event, rowId) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRowId(rowId);
//   };

//   const handleEditClick = () => {
//     handleEdit(selectedRowId);
//     handleMenuClose();
//   };

//   // ================= FETCH EMAIL TEMPLATES =================
//   const fetchEmailTemplates = async () => {
//     setLoading(true);
//     try {
//       const res = await templateAPI.getEmailTemplates();
//       setEmailTemplates(res.data.emailTemplate || []);
//     } catch (err) {
//       console.error("Error fetching email templates:", err);
//       toast.error("Failed to fetch email templates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= FETCH USERS =================

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await authAPI.getAllUsers({
//           page: 1,
//           limit: 50,
//           status: "active",
//         });

//         console.log("API RESPONSE:", res.data);

//         const users = res?.data?.users || [];

//         if (!users.length) {
//           console.warn("No users found");
//         }

//         const formatted = users.map((user) => ({
//           value: user._id,
//           label: user.username,
//         }));

//         console.log("FORMATTED USERS:", formatted);

//         setUserData(formatted);
//       } catch (err) {
//         console.error("User fetch error:", err?.response || err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     fetchEmailTemplates();
//     // fetchUsers();
//   }, []);

//   // ================= SHORTCUTES HANDLERS =================
//   useEffect(() => {
//     if (selectedOption === "contacts") {
//       const contactShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         { title: "Contact Shortcodes", isBold: true },
//         { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
//         { title: "First Name", isBold: false, value: "FIRST_NAME" },
//         { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
//         { title: "Last Name", isBold: false, value: "LAST_NAME" },
//         { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
//         { title: "Country", isBold: false, value: "COUNTRY" },
//         { title: "Company name", isBold: false, value: "COMPANY_NAME " },
//         { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
//         { title: "City", isBold: false, value: "CITY" },
//         { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
//         { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
//         {
//           title: "Custom field:Email",
//           isBold: false,
//           value: "CONTACT_CUSTOM_FIELD:Email",
//         },
//         { title: "Date Shortcodes", isBold: true },
//         {
//           title: "Current day full date",
//           isBold: false,
//           value: "CURRENT_DAY_FULL_DATE",
//         },
//         {
//           title: "Current day number",
//           isBold: false,
//           value: "CURRENT_DAY_NUMBER",
//         },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         {
//           title: "Current month number",
//           isBold: false,
//           value: "CURRENT_MONTH_NUMBER",
//         },
//         {
//           title: "Current month name",
//           isBold: false,
//           value: "CURRENT_MONTH_NAME",
//         },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//         {
//           title: "Last day full date",
//           isBold: false,
//           value: "LAST_DAY_FULL_DATE",
//         },
//         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//         { title: "Last week", isBold: false, value: "LAST_WEEK" },
//         {
//           title: "Last month number",
//           isBold: false,
//           value: "LAST_MONTH_NUMBER",
//         },
//         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//         {
//           title: "Next day full date",
//           isBold: false,
//           value: "NEXT_DAY_FULL_DATE",
//         },
//         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//         {
//           title: "Next month number",
//           isBold: false,
//           value: "NEXT_MONTH_NUMBER",
//         },
//         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//       ];
//       setShortcuts(contactShortcuts);
//     } else if (selectedOption === "account") {
//       const accountShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         { title: "Date Shortcodes", isBold: true },
//         {
//           title: "Current day full date",
//           isBold: false,
//           value: "CURRENT_DAY_FULL_DATE",
//         },
//         {
//           title: "Current day number",
//           isBold: false,
//           value: "CURRENT_DAY_NUMBER",
//         },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         {
//           title: "Current month number",
//           isBold: false,
//           value: "CURRENT_MONTH_NUMBER",
//         },
//         {
//           title: "Current month name",
//           isBold: false,
//           value: "CURRENT_MONTH_NAME",
//         },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//         {
//           title: "Last day full date",
//           isBold: false,
//           value: "LAST_DAY_FULL_DATE",
//         },
//         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//         { title: "Last week", isBold: false, value: "LAST_WEEK" },
//         {
//           title: "Last month number",
//           isBold: false,
//           value: "LAST_MONTH_NUMBER",
//         },
//         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//         {
//           title: "Next day full date",
//           isBold: false,
//           value: "NEXT_DAY_FULL_DATE",
//         },
//         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//         {
//           title: "Next month number",
//           isBold: false,
//           value: "NEXT_MONTH_NUMBER",
//         },
//         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//       ];
//       setShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);

//   useEffect(() => {
//     setFilteredShortcuts(
//       shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")),
//     );
//   }, [shortcuts]);

//   const handleSubjectChange = (e) => {
//     const { value, selectionStart } = e.target;
//     setInputText(value);
//     setCursorPosition(selectionStart);
//   };

//   const handleAddShortcut = (shortcut) => {
//     setInputText((prevText) => {
//       const newText =
//         prevText.slice(0, cursorPosition) +
//         `[${shortcut}]` +
//         prevText.slice(cursorPosition);
//       return newText;
//     });

//     setTimeout(() => {
//       if (textFieldRef.current) {
//         textFieldRef.current.focus();
//         textFieldRef.current.setSelectionRange(
//           cursorPosition + shortcut.length + 2,
//           cursorPosition + shortcut.length + 2,
//         );
//       }
//     }, 0);

//     setShowDropdown(false);
//   };

//   // ================= FILE UPLOAD =================
//   const onDrop = useCallback((acceptedFiles) => {
//     setFiles((prev) => [...prev, ...acceptedFiles]);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept:
//       "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png",
//     multiple: true,
//   });

//   // ================= VALIDATION =================
//   const validateForm = () => {
//     let isValid = true;

//     if (!templateName.trim()) {
//       setTemplateNameError("Template name is required");
//       isValid = false;
//     } else {
//       setTemplateNameError("");
//     }

//     if (!selecteduser) {
//       setSelectedUserError("Please select a user");
//       isValid = false;
//     } else {
//       setSelectedUserError("");
//     }

//     if (!inputText.trim()) {
//       setInputTextError("Email subject is required");
//       isValid = false;
//     } else {
//       setInputTextError("");
//     }

//     return isValid;
//   };

//   // ================= CHECK TEMPLATE NAME EXISTENCE =================
//   const checkTemplateName = async (name) => {
//     try {
//       const res = await templateAPI.checkTemplateNameExists(name);
//       if (res.data.exists) {
//         setTemplateNameError("Template name already exists");
//       } else {
//         setTemplateNameError("");
//       }
//     } catch (err) {
//       console.error(err);
//       setTemplateNameError("");
//     }
//   };

//   const debouncedCheck = debounce((name) => {
//     if (name.trim()) checkTemplateName(name);
//     else setTemplateNameError("");
//   }, 500);

//   useEffect(() => {
//     debouncedCheck(templateName);
//     return debouncedCheck.cancel;
//   }, [templateName]);

//   // ================= SAVE (CREATE + UPDATE) =================
//   const handleSaveTemplate = async (exit = false) => {
//     if (!validateForm()) return;

//     const formData = new FormData();
//     formData.append("templatename", templateName);
//     formData.append("from", selecteduser.value);
//     formData.append("emailsubject", inputText);
//     formData.append("emailbody", emailBody);
//     formData.append("mode", selectedOption);

//     files.forEach((file) => formData.append("attachments", file));

//     try {
//       if (editingId) {
//         // UPDATE
//         await templateAPI.updateEmailTemplate(editingId, formData);
//         toast.success("Email Template updated successfully");
//       } else {
//         // CREATE
//         await templateAPI.createEmailTemplate(formData);
//         toast.success("Email Template created successfully");
//       }

//       resetForm();

//       if (exit) {
//         setShowForm(false);
//         fetchEmailTemplates();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Error saving template");
//     }
//   };

//   // ================= RESET FORM =================
//   const resetForm = () => {
//     setEditingId(null);
//     setTemplateName("");
//     setSelectedUser("");
//     setInputText("");
//     setEmailBody("");
//     setFiles([]);
//     setTemplateNameError("");
//     setSelectedUserError("");
//     setInputTextError("");
//   };

//   // ================= EDIT =================
//   const handleEdit = async (id) => {
//     try {
//       const res = await templateAPI.getEmailTemplateById(id);
//       const data = res.data.emailTemplate;
//       console.log("template edit", data);
//       setTemplateName(data.templatename);
//       setInputText(data.emailsubject);
//       setEmailBody(data.emailbody);
//       setSelectedOption(data.mode || "contacts");
//       setEditingId(id);
//       setShowForm(true);
//       if (data.attachments && data.attachments.length > 0) {
//         const existingFiles = data.attachments.map((att) => ({
//           name: att.filename, // matches your UI
//           size: att.size,
//           _id: att._id, // keep the ID so you can handle deletion separately
//           existing: true, // custom flag to differentiate existing vs new files
//         }));
//         setFiles(existingFiles);
//       } else {
//         setFiles([]);
//       }

//       if (data.from) {
//         // <-- adjust this according to your backend field
//         // Find user object from userData
//         const userOption = userData.find(
//           (u) => u.value === data.from._id || u.value === data.from,
//         );
//         if (userOption) setSelectedUser(userOption);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load template");
//     }
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     try {
//       await templateAPI.deleteEmailTemplate(id);
//       toast.success("Data deleted successfully");
//       // handleMenuClose();
//       fetchEmailTemplates();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete template");
//     }
//   };

//   const handleDeleteClick = () => {
//     const id = selectedRowId;
//     console.log("selected id", id);
//     confirm({
//       title: "Delete Template",
//       description: "Are you sure you want to delete this template?",
//       onConfirm: async () => {
//         await handleDelete(id);
//       },
//     });

//     handleMenuClose();
//   };

//   // ================= MENU HANDLERS =================

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     // setTempIdGet(null);
//      setSelectedRowId(null);
//   };

//   const handleTempCancel = () => {
//     resetForm();
//     setShowForm(false);
//   };

//   // ================= USER AUTOCOMPLETE =================

//   const handleUserChange = (event, selectedOptions) => {
//     setSelectedUser(selectedOptions);
//   };

//   const handleOptionChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   // ================= EDITOR CHANGE =================
//   const handleEditorChange = (content) => {
//     setEmailBody(content);
//   };

//   // ================= RENDER =================
//   return (
//     <Box>
//       {!showForm ? (
//         <Box sx={{ mt: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//           >
//             Create Template
//           </Button>

//           {loading ? (
//             // <Box
//             //   sx={{
//             //     display: "flex",
//             //     alignItems: "center",
//             //     justifyContent: "center",
//             //   }}
//             // >
//             <CircularProgress />
//           ) : (
//             // </Box>
//             <Box>
//               <TableContainer component={Paper} sx={{ mt: 2 }}>
//                 <Table sx={{ width: "100%" }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {emailTemplates
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage,
//                       )
//                       .map((row) => (
//                         <TableRow key={row._id}>
//                           <TableCell
//                             sx={{ cursor: "pointer" }}
//                             onClick={() => handleEdit(row._id)}
//                           >
//                             {row.templatename}
//                           </TableCell>
//                           <TableCell>
//                             <IconButton
//                               onClick={(e) => handleMenuOpen(e, row._id)}
//                             >
//                               <MoreVertIcon />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>

//                   <Menu
//                     anchorEl={anchorEl}
//                     open={Boolean(anchorEl)}
//                     onClose={handleMenuClose}
//                   >
//                     <MenuItem onClick={handleEditClick}>
//                       <RiEdit2Line style={{ marginRight: 8 }} /> Edit
//                     </MenuItem>
//                     <MenuItem onClick={handleDeleteClick}>
//                       <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
//                     </MenuItem>
//                   </Menu>
//                 </Table>
//                 <TablePagination
//                   component="div"
//                   count={emailTemplates.length}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   rowsPerPage={rowsPerPage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   rowsPerPageOptions={[5, 10, 25]}
//                 />
//               </TableContainer>
//             </Box>
//           )}
//         </Box>
//       ) : (
//         <>
//           <Box textAlign="center" mb={3}>
//             <Typography variant="h6">
//               {editingId ? "Edit Email Template" : "Create Email Template"}
//             </Typography>
//           </Box>
//           <Divider sx={{ mt: 1, margin: "0 auto" }} />

//           <Box m={2}>
//             <Grid
//               container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Grid
//                   container
//                   rowSpacing={3}
//                   columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                 >
//                   <Grid size={{ xs: 12, md: 12 }}>
//                     <Typography variant="subtitle1" mb={1}>
//                       Template Name
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       name="templateName"
//                       value={templateName}
//                       onChange={(e) => setTemplateName(e.target.value)}
//                       placeholder="Template Name"
//                     />
//                   </Grid>

//                   <Grid size={{ xs: 12, md: 12 }}>
//                     <Box>
//                       <Typography variant="subtitle1" mb={1}>
//                         Mode
//                       </Typography>
//                       <FormControl>
//                         <RadioGroup
//                           aria-labelledby="demo-controlled-radio-buttons-group"
//                           name="controlled-radio-buttons-group"
//                           value={selectedOption}
//                           onChange={handleOptionChange}
//                         >
//                           <FormControlLabel
//                             value="contacts"
//                             control={<Radio />}
//                             label="Contact Shortcodes"
//                           />
//                           <FormControlLabel
//                             value="account"
//                             control={<Radio />}
//                             label="Account Shortcodes"
//                           />
//                         </RadioGroup>
//                       </FormControl>
//                     </Box>
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 12 }}>
//                     <Typography variant="subtitle1">From</Typography>
//                     <Autocomplete
//                       options={userData}
//                       sx={{ mt: 2 }}
//                       // size="small"
//                       value={selecteduser}
//                       onChange={handleUserChange}
//                       isOptionEqualToValue={(option, value) =>
//                         option.value === value.value
//                       }
//                       getOptionLabel={(option) => option.label || ""}
//                       renderInput={(params) => (
//                         <>
//                           <TextField
//                             {...params}
//                             error={!!selectedUserError}
//                             placeholder="From"
//                           />
//                         </>
//                       )}
//                       isClearable={true}
//                     />
//                   </Grid>
                 
//                   <Grid size={{ xs: 12, md: 12 }}>
//   <Typography variant="subtitle1" mb={1}>
//     Subject
//   </Typography>

//   <TextField
//     fullWidth
//     name="subject"
//     onChange={handleSubjectChange}
//     inputRef={textFieldRef}
//     value={inputText}
//     onClick={(e) => setCursorPosition(e.target.selectionStart)}
//     onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
//     placeholder="Subject"
//   />

//   <Box>
//     <Button
//       variant="outlined"
//       size="small"
//       sx={{ mt: 2, textTransform: "none" }}
//       onClick={(e) => {
//         setAnchorEl(e.currentTarget);
//         setShowDropdown(true);
//       }}
//     >
//       Add Shortcode
//     </Button>

//     {/* ✅ Replace Popover with reusable component */}
//     <ShortcodePopover
//       open={showDropdown}
//       anchorEl={anchorEl}
//       onClose={() => setShowDropdown(false)}
//       shortcuts={filteredShortcuts}
//       onSelectShortcut={(value) => handleAddShortcut(value)}
//     />
//   </Box>
// </Grid>
//                   <Grid size={{ xs: 12, md: 12 }}>
//                     <EditorShortcodes
//                       onChange={handleEditorChange}
//                       initialContent={emailBody}
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>
//               {/* add vertical line */}
//               <Box
//                 sx={{
//                   display: { xs: "none", md: "block" }, // hide on small screens
//                   borderRight: "1px solid #c7c7c7",
//                   mx: 2, // horizontal spacing
//                 }}
//               />
//               <Grid size={{ xs: 12, md: 5 }}>
//                 <Box
//                   sx={{
//                     alignItems: "center",
//                     display: "flex",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Box
//                     {...getRootProps()}
//                     sx={{
//                       alignItems: "center",
//                       justifyContent: "center",
//                       display: "flex",
//                       flexDirection: "column",
//                       border: "2px dashed #ccc",
//                       padding: "20px",
//                       width: "100%",
//                       maxWidth: "500px",
//                       textAlign: "center",
//                       cursor: "pointer",
//                       marginBottom: "16px",
//                     }}
//                   >
//                     <input
//                       id="file-input"
//                       {...getInputProps()}
//                       style={{ display: "none" }}
//                       multiple
//                     />
//                     <Typography variant="h6">Drag & drop file here</Typography>
//                     <Typography variant="body2">or</Typography>
//                     <Button variant="contained" color="primary">
//                       Browse Files
//                     </Button>
//                     <Typography variant="body2" sx={{ marginTop: "8px" }}>
//                       20 MB file size limit. Supported file types: PDF, DOC,
//                       DOCX, XLS, XLSX, JPG, PNG.
//                     </Typography>
//                   </Box>

//                   {files.length > 0 && (
//                     <Box sx={{ width: "100%", marginTop: "16px" }}>
//                       <Typography variant="h6" sx={{ marginBottom: "8px" }}>
//                         Selected Files:
//                       </Typography>
//                       {files.map((file, index) => (
//                         <Box
//                           key={index}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             padding: "8px",
//                             borderBottom: "1px solid #eee",
//                           }}
//                         >
//                           <Typography variant="body1">
//                             {file.name} ({(file.size / 1024).toFixed(2)} KB)
//                           </Typography>
//                           <IconButton
//                             onClick={() => {
//                               const updatedFiles = files.filter(
//                                 (_, i) => i !== index,
//                               );
//                               setFiles(updatedFiles);
//                             }}
//                             sx={{ color: "red" }}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </Box>
//                       ))}
//                     </Box>
//                   )}
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
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleSaveTemplate(true)}
//             >
//               Save & Exit
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleSaveTemplate(false)}
//             >
//               Save
//             </Button>
//             <Button variant="outlined" onClick={handleTempCancel}>
//               Cancel
//             </Button>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default EmailTemp;


import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import debounce from "lodash.debounce";
import { Plus, Upload, Trash2, FileText, Pencil } from "lucide-react";

// Shadcn UI Components
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

// Custom Components
import EditorShortcodes from "../../../components/EditorShortcodes";
import ShortcodeTextField from "../../../components/ShortcodeTextField";
import { FormPage, FormSection, FormGrid } from "../../../components/ui/form-layout";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { templateAPI, authAPI } from "../../../services/api";

// Icons
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";

// Validation Schema
const emailSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  selectedUser: z.any().refine((v) => v && v.value, { message: "Please select a sender" }),
  subject: z.string().min(1, "Email subject is required"),
  mode: z.string().optional().default("contacts"),
});

const EmailTemp = () => {
  const confirm = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [files, setFiles] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [userData, setUserData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [subject, setSubject] = useState("");

  // Shortcode states
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize Form
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      templateName: "",
      selectedUser: null,
      subject: "",
      mode: "contacts",
    },
  });

  const selectedMode = form.watch("mode");

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });
        const users = res?.data?.users || [];
        const formatted = users.map((user) => ({
          value: user._id,
          label: user.username,
        }));
        setUserData(formatted);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Email Templates
  const fetchEmailTemplates = async () => {
    setLoading(true);
    try {
      const res = await templateAPI.getEmailTemplates();
      setEmailTemplates(res.data.emailTemplate || []);
    } catch (err) {
      console.error("Error fetching email templates:", err);
      toast.error("Failed to fetch email templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailTemplates();
  }, []);

  // Shortcodes based on mode
  useEffect(() => {
    const contactShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      { title: "Contact Shortcodes", isBold: true },
      { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
      { title: "First Name", isBold: false, value: "FIRST_NAME" },
      { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
      { title: "Last Name", isBold: false, value: "LAST_NAME" },
      { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
      { title: "Country", isBold: false, value: "COUNTRY" },
      { title: "Company name", isBold: false, value: "COMPANY_NAME" },
      { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
      { title: "City", isBold: false, value: "CITY" },
      { title: "State/Province", isBold: false, value: "STATE_PROVINCE" },
      { title: "Zip/Postal code", isBold: false, value: "ZIP_POSTAL_CODE" },
      { title: "Date Shortcodes", isBold: true },
      { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
      { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
      { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
      { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
      { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
      { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
      { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
      { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
      { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
      { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
      { title: "Last week", isBold: false, value: "LAST_WEEK" },
      { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
      { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
      { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
      { title: "Last year", isBold: false, value: "LAST_YEAR" },
      { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
      { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
      { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
      { title: "Next week", isBold: false, value: "NEXT_WEEK" },
      { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
      { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
      { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
      { title: "Next year", isBold: false, value: "NEXT_YEAR" },
    ];

    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      { title: "Date Shortcodes", isBold: true },
      { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
      { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
      { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
      { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
      { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
      { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
      { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
      { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
      { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
      { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
      { title: "Last week", isBold: false, value: "LAST_WEEK" },
      { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
      { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
      { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
      { title: "Last year", isBold: false, value: "LAST_YEAR" },
      { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
      { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
      { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
      { title: "Next week", isBold: false, value: "NEXT_WEEK" },
      { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
      { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
      { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
      { title: "Next year", isBold: false, value: "NEXT_YEAR" },
    ];

    setShortcuts(selectedMode === "contacts" ? contactShortcuts : accountShortcuts);
  }, [selectedMode]);

  useEffect(() => {
    setFilteredShortcuts(shortcuts);
  }, [shortcuts]);

  // Shortcode Handlers
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  const handleAddShortcut = (shortcut) => {
    const currentSubject = subject;
    const newText = currentSubject.slice(0, cursorPosition) + `[${shortcut}]` + currentSubject.slice(cursorPosition);
    setSubject(newText);
    form.setValue("subject", newText, { shouldDirty: true });
    
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);
    setShowDropdown(false);
  };

  // File Upload
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  // Check Template Name
  const checkTemplateName = async (name) => {
    try {
      const res = await templateAPI.checkTemplateNameExists(name);
      if (res.data.exists) {
        form.setError("templateName", { type: "manual", message: "Template name already exists" });
      } else {
        form.clearErrors("templateName");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else form.clearErrors("templateName");
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "templateName") debouncedCheck(value.templateName);
    });
    return () => {
      subscription.unsubscribe();
      debouncedCheck.cancel();
    };
  }, [form.watch]);

  // Save Template
  const handleSaveTemplate = async (values, exit = false) => {
    setSaving(true);
    const formData = new FormData();
    formData.append("templatename", values.templateName);
    formData.append("from", values.selectedUser.value);
    formData.append("emailsubject", subject);
    formData.append("emailbody", emailBody);
    formData.append("mode", values.mode || "contacts");
    files.forEach((file) => formData.append("attachments", file));

    try {
      if (editingId) {
        await templateAPI.updateEmailTemplate(editingId, formData);
        toast.success("Email Template updated successfully");
      } else {
        await templateAPI.createEmailTemplate(formData);
        toast.success("Email Template created successfully");
      }
      await fetchEmailTemplates();
      
      if (exit) {
        resetAndClose();
      } else {
        if (!editingId) {
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error saving template");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExit = form.handleSubmit((values) => handleSaveTemplate(values, true));
  const handleSave = form.handleSubmit((values) => handleSaveTemplate(values, false));

  // Edit Template
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getEmailTemplateById(id);
      const data = res.data.emailTemplate;
      console.log("template edit", data);
      setEditingId(id);
      setShowForm(true);
      setEmailBody(data.emailbody || "");
      setSubject(data.emailsubject || "");
      
      if (data.attachments && data.attachments.length > 0) {
        const existingFiles = data.attachments.map((att) => ({
          name: att.filename,
          size: att.size,
          _id: att._id,
          existing: true,
        }));
        setFiles(existingFiles);
      } else {
        setFiles([]);
      }
      
      const userOption = userData.find((u) => u.value === data.from?._id || u.value === data.from);
      
      form.reset({
        templateName: data.templatename || "",
        selectedUser: userOption || null,
        subject: data.emailsubject || "",
        mode: data.mode || "contacts",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load template");
    }
  };

  // Delete Template
  const handleDelete = async (id) => {
    try {
      await templateAPI.deleteEmailTemplate(id);
      toast.success("Template deleted successfully");
      await fetchEmailTemplates();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete template");
    }
  };

  // Reset Functions
  const resetForm = () => {
    setEditingId(null);
    setEmailBody("");
    setFiles([]);
    setSubject("");
    setCursorPosition(0);
    form.reset({
      templateName: "",
      selectedUser: null,
      subject: "",
      mode: "contacts",
    });
  };

  const resetAndClose = () => {
    resetForm();
    setShowForm(false);
  };

  const handleCancel = () => {
    if (form.formState.isDirty || emailBody || files.length > 0) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) return;
    }
    resetAndClose();
  };

  const handleCreateNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Table Columns
  const emailColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleEdit(row.original._id)}
        >
          {row.original.templatename}
        </Button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
              <RiEdit2Line className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                confirm({
                  title: "Delete Template",
                  description: "Are you sure you want to delete this template?",
                  onConfirm: async () => {
                    await handleDelete(row.original._id);
                  },
                });
              }}
              className="text-destructive"
            >
              <RiDeleteBin6Line className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  return (
    <div className="p-6">
      {!showForm ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateNew}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Email
            </Button>
          </div>
          
          <DataTableToolbar
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />
          
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <DataTable
              columns={emailColumns}
              data={emailTemplates}
              loading={loading}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              enableRowSelection={false}
              getRowId={(row) => row._id}
              emptyMessage="No email templates found"
              emptyDescription="Create your first email template to get started"
              pageSize={30}
            />
          )}
        </div>
      ) : (
        <Form {...form}>
          <FormPage
            title={editingId ? "Edit Email Template" : "Create Email Template"}
            subtitle="Configure your email template settings"
            actions={
              <>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveExit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save & Exit"}
                </Button>
              </>
            }
          >
            <FormGrid>
              {/* LEFT COLUMN */}
              <FormGrid.Main>
                <FormSection title="Template Details">
                  <FormField
                    control={form.control}
                    name="templateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter template name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex gap-6"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="contacts" id="contacts" />
                              <Label htmlFor="contacts" className="cursor-pointer">Contact Shortcodes</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="account" id="account" />
                              <Label htmlFor="account" className="cursor-pointer">Account Shortcodes</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Sender & Subject">
                  <FormField
                    control={form.control}
                    name="selectedUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.value || ""}
                            onValueChange={(value) => {
                              const selected = userData.find((u) => u.value === value) || null;
                              field.onChange(selected);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sender" />
                            </SelectTrigger>
                            <SelectContent>
                              {userData.map((user) => (
                                <SelectItem key={user.value} value={user.value}>
                                  {user.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                      
                        <FormControl>
                          <ShortcodeTextField
                            label="Subject"
                            value={subject}
                            onChange={(e) => {
                              const { value, selectionStart } = e.target;
                              setSubject(value);
                              setCursorPosition(selectionStart);
                              field.onChange(value);
                            }}
                            placeholder="Enter email subject"
                            inputRef={textFieldRef}
                            onClick={(e) => setCursorPosition(e.target.selectionStart)}
                            shortcuts={filteredShortcuts}
                            showShortcutDropdown={showDropdown}
                            anchorElShortcut={anchorEl}
                            onToggleShortcutDropdown={toggleDropdown}
                            onCloseShortcutDropdown={handleCloseDropdown}
                            onAddShortcut={handleAddShortcut}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Email Body">
                  <EditorShortcodes 
                    onChange={setEmailBody} 
                    initialContent={emailBody}
                  />
                </FormSection>
              </FormGrid.Main>

              {/* RIGHT COLUMN - Attachments */}
              <FormGrid.Sidebar>
                <FormSection title="Attachments">
                  {/* Dropzone */}
                  <div
                    {...getRootProps()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <input {...getInputProps()} multiple />
                    <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Drag & drop files here</p>
                    <p className="mt-1 text-xs text-muted-foreground">or</p>
                    <Button type="button" variant="outline" size="sm" className="mt-3">
                      Browse Files
                    </Button>
                    <p className="mt-3 text-xs text-muted-foreground">
                      20 MB file size limit. Supported: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                    </p>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-medium text-foreground">Selected Files:</p>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedFiles = files.filter((_, i) => i !== index);
                              setFiles(updatedFiles);
                            }}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FormSection>
              </FormGrid.Sidebar>
            </FormGrid>
          </FormPage>
        </Form>
      )}
    </div>
  );
};

export default EmailTemp;