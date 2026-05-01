// // import { useState, useEffect, useRef } from "react";

// // import {
// //   Box,
// //   Button,
// //   TextField,
// //   Typography,
// //   Grid,
// //   Switch,
// //   FormControlLabel,
// //   Autocomplete,
// //   Chip,
// //   IconButton,
// //   Popover,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   TablePagination,
// //   Paper,
// //   Menu,
// //   MenuItem,
// //   CircularProgress,
// //   Divider,
// // } from "@mui/material";
// // import { Delete as DeleteIcon } from "@mui/icons-material";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { templateAPI } from "../../../services/api"; // Update path to your api.js
// // import Priority from "../../../components/Priority"; // Update path
// // import EditorShortcodes from "../../../components/EditorShortcodes"; // Update path
// // import MultiSelectDropdown from "../../../components/MultiSelectDropdown"; // Update path
// // import debounce from "lodash/debounce";
// // import { toast } from "react-toastify";
// // import dayjs from "dayjs";
// // import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// // import { useConfirm } from "../../../components/ConfirmDialogContext";
// // import MoreVertIcon from "@mui/icons-material/MoreVert";
// // import ShortcodeTextField from "../../../components/ShortcodeTextField";
// // const JobTemp = () => {
// //   const confirm = useConfirm();
// //   // Form state
// //   const [templatename, setTemplatename] = useState("");
// //   const [priority, setPriority] = useState("Medium");
// //   const [showForm, setShowForm] = useState(false);
// //   const [startsin, setStartsin] = useState(0);
// //   const [duein, setDuein] = useState(0);
// //   const [absoluteDate, setAbsoluteDates] = useState(false);
// //   const [startDate, setStartDate] = useState(null);
// //   const [dueDate, setDueDate] = useState(null);
// //   const [anchorEl, setAnchorEl] = useState(null);
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [jobName, setJobName] = useState("");
// //   const [shortcuts, setShortcuts] = useState([]);
// //   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
// //   const [selectedOption, setSelectedOption] = useState("contacts");

// //   const [startsInDuration, setStartsInDuration] = useState("Days");
// //   const [dueinduration, setDueinduration] = useState("Days");
// //   const [description, setDescription] = useState("");

// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [editingId, setEditingId] = useState(null); // Track which template is being edited

// //   // Client facing integration
// //   const [clientFacingStatus, setClientFacingStatus] = useState(false);

// //   const [anchorElClientJob, setAnchorElClientJob] = useState(null);
// //   const [anchorElDescription, setAnchorElDecription] = useState(null);
// //   const [inputText, setInputText] = useState("");
// //   const [charCount, setCharCount] = useState(0);
// //   const [clientDescription, setClientDescription] = useState("");
// //   const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
// //   const [showDropdownDescription, setShowDropdownDescription] = useState(false);
// //   const [selectedJob, setSelectedJob] = useState(null);
// //   const [clientFacingJobs, setClientFacingJobs] = useState([]);
// //   const [cursorPosition, setCursorPosition] = useState(0);
// //   const [comments, setComments] = useState([]);

// //   // Refs
// //   const descriptionFieldRef = useRef(null);
// //   const textFieldRef = useRef(null);

// //   // User selection state
// //   const [selectedUser, setSelectedUser] = useState([]);
// //   const [combinedValues, setCombinedValues] = useState();

// //   const [JobTemplates, setJobTemplates] = useState([]);
// //   const [templateNameError, setTemplateNameError] = useState("");
// //   const [errors, setErrors] = useState({});

// //   // Menu state
// //   const [anchorElMenu, setAnchorElMenu] = useState(null);
// //   const [tempIdGet, setTempIdGet] = useState("");
// //   const [openMenuId, setOpenMenuId] = useState(null);

// //   // Pagination state
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(30);

// //   // Fetch data on mount
// //   useEffect(() => {
// //     fetchClientFacingJobsData();
// //     // fetchUsersData();
// //     fetchJobTemplatesData();
// //   }, []);

// //   // Update shortcuts based on selected option
// //   useEffect(() => {
// //     if (selectedOption === "contacts" || selectedOption === "account") {
// //       const accountShortcuts = [
// //         { title: "Account Shortcodes", isBold: true },
// //         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
// //         { title: "Date Shortcodes", isBold: true },
// //         {
// //           title: "Current day full date",
// //           isBold: false,
// //           value: "CURRENT_DAY_FULL_DATE",
// //         },
// //         {
// //           title: "Current day number",
// //           isBold: false,
// //           value: "CURRENT_DAY_NUMBER",
// //         },
// //         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
// //         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
// //         {
// //           title: "Current month number",
// //           isBold: false,
// //           value: "CURRENT_MONTH_NUMBER",
// //         },
// //         {
// //           title: "Current month name",
// //           isBold: false,
// //           value: "CURRENT_MONTH_NAME",
// //         },
// //         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
// //         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
// //         {
// //           title: "Last day full date",
// //           isBold: false,
// //           value: "LAST_DAY_FULL_DATE",
// //         },
// //         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
// //         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
// //         { title: "Last week", isBold: false, value: "LAST_WEEK" },
// //         {
// //           title: "Last month number",
// //           isBold: false,
// //           value: "LAST_MONTH_NUMBER",
// //         },
// //         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
// //         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
// //         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
// //         {
// //           title: "Next day full date",
// //           isBold: false,
// //           value: "NEXT_DAY_FULL_DATE",
// //         },
// //         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
// //         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
// //         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
// //         {
// //           title: "Next month number",
// //           isBold: false,
// //           value: "NEXT_MONTH_NUMBER",
// //         },
// //         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
// //         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
// //         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
// //       ];
// //       setShortcuts(accountShortcuts);
// //       setFilteredShortcuts(accountShortcuts);
// //     }
// //   }, [selectedOption]);

// //   // Debounced template name check
// //   const debouncedCheck = debounce((name) => {
// //     if (name.trim() && !editingId) {
// //       // Only check for new templates, not when editing
// //       checkTemplateName(name);
// //     } else {
// //       setTemplateNameError("");
// //     }
// //   }, 500);

// //   useEffect(() => {
// //     debouncedCheck(templatename);
// //     return debouncedCheck.cancel;
// //   }, [templatename]);

// //   // ================= API CALLS =================
// //   const fetchClientFacingJobsData = async () => {
// //     try {
// //       const response = await templateAPI.getAllJobStatus();
// //       setClientFacingJobs(response.data.clientFacingJobStatues || []);
// //     } catch (error) {
// //       console.error("Error fetching client facing jobs:", error);
// //       toast.error("Failed to fetch client facing jobs");
// //     }
// //   };

// //   const fetchJobTemplatesData = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await templateAPI.getAllJobTemplates();
// //       setJobTemplates(response.data.JobTemplates || []);
// //     } catch (error) {
// //       console.error("Error fetching job templates:", error);
// //       toast.error("Failed to fetch job templates");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchJobTemplateData = async (templateId) => {
// //     setSubmitting(true);
// //     try {
// //       const response = await templateAPI.getJobTemplateById(templateId);
// //       const template = response.data.jobTemplate;
// //       console.log("job templzte edit", template);

// //       if (template) {
// //         setTemplatename(template.templatename || "");
// //         setJobName(template.jobname || "");
// //         setPriority(template.priority || "Medium");
// //         setDescription(template.description || "");
// //         setAbsoluteDates(template.absolutedates || false);
// //         setClientFacingStatus(template.showinclientportal || false);
// //         setInputText(template.jobnameforclient || "");
// //         setClientDescription(template.clientfacingDescription || "");
// //         setComments(template.comments || []);

// //         if (template.jobassignees && template.jobassignees.length > 0) {
// //           const selectedUsers = template.jobassignees.map((assignee) => ({
// //             value: assignee._id,
// //             label: assignee.username,
// //           }));
// //           setSelectedUser(selectedUsers);
// //           setCombinedValues(template.jobassignees.map((a) => a._id));
// //         }

// //         if (template.clientfacingstatus) {
// //           const status = clientFacingJobs.find(
// //             (s) => s._id === template.clientfacingstatus,
// //           );
// //           if (status) {
// //             setSelectedJob({
// //               value: status._id,
// //               label: status.clientfacingName,
// //             });
// //           }
// //         }

// //         if (template.absolutedates) {
// //           setStartDate(template.startdate ? dayjs(template.startdate) : null);
// //           setDueDate(template.enddate ? dayjs(template.enddate) : null);
// //         } else {
// //           setStartsin(template.startsin || 0);
// //           setDuein(template.duein || 0);
// //           setStartsInDuration(template.startsinduration || "Days");
// //           setDueinduration(template.dueinduration || "Days");
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error fetching job template:", error);
// //       toast.error("Failed to fetch job template details");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const checkTemplateName = async (name) => {
// //     try {
// //       const response = await templateAPI.checkJobTemplateNameExists(name);
// //       if (response.data.exists) {
// //         setTemplateNameError("Template name already exists");
// //       } else {
// //         setTemplateNameError("");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setTemplateNameError("");
// //     }
// //   };

// //   // ================= FORM HANDLERS =================
// //   const handleCreateJobTemplate = () => {
// //     setEditingId(null);
// //     handleClear();
// //     setShowForm(true);
// //   };

// //   const handleEditJobTemplate = (templateId) => {
// //     setEditingId(templateId);
// //     fetchJobTemplateData(templateId);
// //     setShowForm(true);
// //     setAnchorElMenu(null);
// //   };

// //   const handleCloseJobTemp = () => {
// //     setShowForm(false);
// //     setEditingId(null);
// //     handleClear();
// //   };
// //   const handleClear = () => {
// //     setTemplatename("");
// //     setJobName("");
// //     setSelectedUser([]);
// //     setPriority("Medium");
// //     setAbsoluteDates(false);
// //     setStartDate(null);
// //     setDueDate(null);
// //     setInputText("");
// //     setStartsin(0);
// //     setDuein(0);
// //     setClientDescription("");
// //     setClientFacingStatus(false);
// //     setComments([]);
// //     setDescription("");
// //     setSelectedJob(null);
// //     setErrors({});
// //     setTemplateNameError("");

// //     setCharCount(0);
// //     setCursorPosition(0);
// //   };

// //   const validateForm = () => {
// //     let tempErrors = {};
// //     if (!templatename) tempErrors.templatename = "Template name is required";
// //     if (!jobName) tempErrors.jobName = "Job name is required";

// //     setErrors(tempErrors);
// //     return Object.keys(tempErrors).length === 0;
// //   };

// //   const handleSubmit = async (saveAndExit = false) => {
// //     if (!validateForm()) {
// //       toast.error("Please fix the validation errors");
// //       return;
// //     }

// //     setSubmitting(true);

// //     try {
// //       const formData = {
// //         templatename,
// //         jobname: jobName,
// //         jobassignees: combinedValues,
// //         priority,
// //         description,
// //         absolutedates: absoluteDate,
// //         comments,
// //         showinclientportal: clientFacingStatus,
// //         jobnameforclient: inputText,
// //         clientfacingstatus: selectedJob?.value,
// //         clientfacingDescription: clientDescription,
// //       };

// //       if (absoluteDate) {
// //         formData.startdate = startDate;
// //         formData.enddate = dueDate;
// //       } else {
// //         formData.startsin = startsin;
// //         formData.startsinduration = startsInDuration;
// //         formData.duein = duein;
// //         formData.dueinduration = dueinduration;
// //       }
// //       let response;
// //       if (editingId) {
// //         // Update existing template
// //         response = await templateAPI.updateJobTemplate(editingId, formData);
// //         toast.success("Job Template updated successfully");
// //       } else {
// //         // Create new template
// //         response = await templateAPI.createJobTemplate(formData);
// //         toast.success("Job Template created successfully");
// //       }

// //       await fetchJobTemplatesData();

// //       if (saveAndExit) {
// //         setShowForm(false);
// //         setEditingId(null);
// //         handleClear();
// //       }
// //     } catch (error) {
// //       console.error("Error saving job template:", error);
// //       toast.error(`Failed to ${editingId ? "update" : "create"} Job Template`);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // ================= DELETE HANDLER =================

// //   const handleDeleteClick = (templateId) => {
// //     handleMenuClose();

// //     confirm({
// //       title: "Delete Job Template",
// //       description: "Are you sure you want to delete this job template?",
// //       onConfirm: async () => {
// //         try {
// //           await templateAPI.deleteJobTemplate(templateId);
// //           toast.success("Job Template deleted successfully");
// //           fetchJobTemplatesData();
// //         } catch (error) {
// //           console.error(error);
// //           toast.error("Failed to delete Job Template");
// //         }
// //       },
// //     });
// //   };

// //   // ================= UI HANDLERS =================
// //   const toggleMenu = (event, templateId) => {
// //     setAnchorElMenu(event.currentTarget);
// //     setOpenMenuId(templateId);
// //     setTempIdGet(templateId);
// //   };

// //   const handleMenuClose = () => {
// //     setAnchorElMenu(null);
// //     setOpenMenuId(null);
// //     setTempIdGet(null);
// //   };

// //   const handlePriorityChange = (priority) => {
// //     setPriority(priority);
// //   };

// //   const handleAbsolutesDates = (checked) => {
// //     setAbsoluteDates(checked);
// //   };

// //   const handleStartDateChange = (date) => {
// //     setStartDate(date);
// //   };

// //   const handleDueDateChange = (date) => {
// //     setDueDate(date);
// //   };

// //   const handleStartInDateChange = (event, newValue) => {
// //     setStartsInDuration(newValue ? newValue.value : null);
// //   };

// //   const handleDueInDateChange = (event, newValue) => {
// //     setDueinduration(newValue ? newValue.value : null);
// //   };

// //   const handleJobNameChange = (e) => {
// //     const { value, selectionStart } = e.target;
// //     setJobName(value);
// //     setCursorPosition(selectionStart);
// //   };

// //   const handleChatSubject = (e) => {
// //     const { value, selectionStart } = e.target;
// //     setInputText(value);
// //     setCursorPosition(selectionStart);
// //   };

// //   const handleClientFacing = (checked) => {
// //     setClientFacingStatus(checked);
// //   };

// //   const handleUserChange = (newSelectedUsers) => {
// //     setSelectedUser(newSelectedUsers);
// //     const selectedValues = newSelectedUsers.map((option) => option.value);
// //     setCombinedValues(selectedValues);
// //   };

// //   const handleJobChange = async (event, newValue) => {
// //     setSelectedJob(newValue);

// //     if (newValue && newValue.value) {
// //       try {
// //         const response = await templateAPI.getJobStatusById(newValue.value);
// //         setClientDescription(
// //           response.data.clientfacingjobstatuses.clientfacingdescription,
// //         );
// //       } catch (error) {
// //         console.error("Error fetching job status:", error);
// //       }
// //     }
// //   };

// //   const handleEditorChange = (content) => {
// //     setDescription(content);
// //   };

// //   // ================= SHORTCODE HANDLERS =================
// //   const handleAddShortcut = (shortcut) => {
// //     setJobName((prevText) => {
// //       const newText =
// //         prevText.slice(0, cursorPosition) +
// //         `[${shortcut}]` +
// //         prevText.slice(cursorPosition);
// //       return newText;
// //     });

// //     setTimeout(() => {
// //       if (textFieldRef.current) {
// //         textFieldRef.current.focus();
// //         textFieldRef.current.setSelectionRange(
// //           cursorPosition + shortcut.length + 2,
// //           cursorPosition + shortcut.length + 2,
// //         );
// //       }
// //     }, 0);

// //     setShowDropdown(false);
// //   };

// //   const handleJobAddShortcut = (shortcut) => {
// //     setInputText((prevText) => {
// //       const newText =
// //         prevText.slice(0, cursorPosition) +
// //         `[${shortcut}]` +
// //         prevText.slice(cursorPosition);
// //       return newText;
// //     });

// //     setTimeout(() => {
// //       if (textFieldRef.current) {
// //         textFieldRef.current.focus();
// //         textFieldRef.current.setSelectionRange(
// //           cursorPosition + shortcut.length + 2,
// //           cursorPosition + shortcut.length + 2,
// //         );
// //       }
// //     }, 0);

// //     setShowDropdownClientJob(false);
// //   };

// //   const handleDescriptionAddShortcut = (shortcut) => {
// //     setClientDescription((prevText) => {
// //       const newText =
// //         prevText.slice(0, cursorPosition) +
// //         `[${shortcut}]` +
// //         prevText.slice(cursorPosition);
// //       return newText.length <= 4000 ? newText : prevText;
// //     });

// //     setTimeout(() => {
// //       if (descriptionFieldRef.current) {
// //         descriptionFieldRef.current.focus();
// //         descriptionFieldRef.current.setSelectionRange(
// //           cursorPosition + shortcut.length + 2,
// //           cursorPosition + shortcut.length + 2,
// //         );
// //       }
// //     }, 0);

// //     setShowDropdownDescription(false);
// //   };

// //   const toggleDropdown = (event) => {
// //     setAnchorEl(event.currentTarget);
// //     setShowDropdown(!showDropdown);
// //   };

// //   const toggleShortcodeDropdown = (event) => {
// //     setAnchorElClientJob(event.currentTarget);
// //     setShowDropdownClientJob(!showDropdownClientJob);
// //   };

// //   const toggleDescriptionDropdown = (event) => {
// //     setAnchorElDecription(event.currentTarget);
// //     setShowDropdownDescription(!showDropdownDescription);
// //   };

// //   const handleCloseDropdown = () => {
// //     setShowDropdown(false);
// //     setShowDropdownClientJob(false);
// //     setShowDropdownDescription(false);
// //     setAnchorEl(null);
// //     setAnchorElClientJob(null);
// //     setAnchorElDecription(null);
// //   };

// //   // ================= COMMENT HANDLERS =================
// //   const addCommentField = () => {
// //     setComments([...comments, ""]);
// //   };

// //   const handleCommentChange = (index, value) => {
// //     const updatedComments = [...comments];
// //     updatedComments[index] = value;
// //     setComments(updatedComments);
// //   };

// //   const deleteCommentField = (index) => {
// //     const updatedComments = comments.filter((_, i) => i !== index);
// //     setComments(updatedComments);
// //   };

// //   // ================= PAGINATION HANDLERS =================
// //   const handleChangePage = (_, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   // ================= RENDER HELPERS =================
// //   const optionstatus = clientFacingJobs.map((status) => ({
// //     value: status._id,
// //     label: status.clientfacingName,
// //     clientfacingColour: status.clientfacingColour,
// //   }));

// //   const dayOptions = [
// //     { label: "Days", value: "Days" },
// //     { label: "Months", value: "Months" },
// //     { label: "Years", value: "Years" },
// //   ];

// //   const paginatedJobs = JobTemplates.slice(
// //     page * rowsPerPage,
// //     page * rowsPerPage + rowsPerPage,
// //   );

// //   // ================= MAIN RENDER =================
// //   return (
// //     <LocalizationProvider dateAdapter={AdapterDayjs}>
// //       <Box>
// //         {!showForm ? (
// //           <Box sx={{ mt: 2 }}>
// //             <Button
// //               variant="contained"
// //               color="primary"
// //               onClick={handleCreateJobTemplate}
// //             >
// //               Job Template
// //             </Button>

// //             {loading ? (
// //               <CircularProgress />
// //             ) : (
// //               <Box>
// //                 <TableContainer component={Paper} sx={{ mt: 2 }}>
// //                   <Table sx={{ width: "100%" }}>
// //                     <TableHead>
// //                       <TableRow>
// //                         <TableCell>Name</TableCell>
// //                         <TableCell>Actions</TableCell>
// //                       </TableRow>
// //                     </TableHead>
// //                     <TableBody>
// //                       {paginatedJobs.map((row) => (
// //                         <TableRow key={row._id}>
// //                           <TableCell
// //                             sx={{ cursor: "pointer" }}
// //                             onClick={() => handleEditJobTemplate(row._id)}
// //                           >
// //                             {row.templatename}
// //                           </TableCell>
// //                           <TableCell
// //                             style={{
// //                               fontSize: "12px",
// //                               padding: "4px 8px",
// //                               lineHeight: "1",
// //                             }}
// //                           >
// //                             <IconButton
// //                               onClick={(event) => toggleMenu(event, row._id)}
// //                             >
// //                               <MoreVertIcon />
// //                             </IconButton>
// //                           </TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                     <Menu
// //                       anchorEl={anchorElMenu}
// //                       open={Boolean(anchorElMenu)}
// //                       onClose={handleMenuClose}
// //                     >
// //                       <MenuItem
// //                         onClick={() => handleEditJobTemplate(tempIdGet)}
// //                       >
// //                         <RiEdit2Line style={{ marginRight: 8 }} /> Edit
// //                       </MenuItem>

// //                       <MenuItem onClick={() => handleDeleteClick(tempIdGet)}>
// //                         <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
// //                       </MenuItem>
// //                     </Menu>
// //                   </Table>
// //                   <TablePagination
// //                     rowsPerPageOptions={[30, 40, 50, 60, 100]}
// //                     component="div"
// //                     count={JobTemplates.length}
// //                     rowsPerPage={rowsPerPage}
// //                     page={page}
// //                     onPageChange={handleChangePage}
// //                     onRowsPerPageChange={handleChangeRowsPerPage}
// //                   />
// //                 </TableContainer>
// //               </Box>
// //             )}
// //           </Box>
// //         ) : (
// //           <Box sx={{ mt: 2 }}>
// //             <Box textAlign="center" mb={3}>
// //               <Typography variant="h6">
// //                 {editingId ? "Edit Job Template" : "Create Job Template"}
// //               </Typography>
// //             </Box>

// //             <Divider sx={{ mt: 1, margin: "0 auto" }} />

// //             <Box m={2}>
// //               <Grid
// //                 container
// //                 rowSpacing={3}
// //                 columnSpacing={{ xs: 1, sm: 2, md: 3 }}
// //               >
// //                 <Grid size={{ xs: 12, md: 6 }}>
// //                   <Grid
// //                     container
// //                     rowSpacing={3}
// //                     columnSpacing={{ xs: 1, sm: 2, md: 3 }}
// //                   >
// //                     <Grid size={{ xs: 12, md: 12 }}>
// //                       <Typography variant="subtitle1" mb={1}>
// //                         Template Name
// //                       </Typography>
// //                       <TextField
// //                         size="small"
// //                         fullWidth
// //                         placeholder="Template Name"
// //                         value={templatename}
// //                         onChange={(e) => setTemplatename(e.target.value)}
// //                       />
// //                     </Grid>

// //                     <Grid size={{ xs: 12, md: 12 }}>
// //                       <ShortcodeTextField
// //                         label="Job Name"
// //                         value={jobName}
// //                         onChange={(e) => {
// //                           const { value, selectionStart } = e.target;
// //                           setJobName(value);
// //                           setCursorPosition(selectionStart);
// //                         }}
// //                         placeholder="Job Name"
// //                         inputRef={textFieldRef}
// //                         onClick={(e) =>
// //                           setCursorPosition(e.target.selectionStart)
// //                         }
// //                         // shortcuts
// //                         shortcuts={filteredShortcuts}
// //                         showShortcutDropdown={showDropdown}
// //                         anchorElShortcut={anchorEl}
// //                         onToggleShortcutDropdown={toggleDropdown}
// //                         onCloseShortcutDropdown={handleCloseDropdown}
// //                         onAddShortcut={handleAddShortcut}
// //                       />
                      
// //                     </Grid>
// //                     <Grid size={{ xs: 12, md: 12 }}>
// //                       <Typography variant="subtitle1" mb={1}>
// //                         Job Assignees
// //                       </Typography>
// //                       <MultiSelectDropdown
// //                         value={selectedUser}
// //                         onChange={handleUserChange}
// //                         placeholder="Job Assignees"
// //                       />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, md: 12 }}>
// //                       <Typography variant="subtitle1" mb={1}>
// //                         Priority
// //                       </Typography>
// //                       <Priority
// //                         onPriorityChange={handlePriorityChange}
// //                         selectedPriority={priority}
// //                       />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, md: 12 }}>
// //                       <EditorShortcodes
// //                         onChange={handleEditorChange}
// //                         initialContent={description}
// //                       />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, md: 12 }}>
// //                       <Box
// //                         sx={{
// //                           display: "flex",
// //                           alignItems: "center",
// //                           justifyContent: "space-between",
// //                         }}
// //                       >
// //                         <Typography variant="subtitle1" mb={1}>
// //                           Start and Due Date
// //                         </Typography>
// //                         <FormControlLabel
// //                           control={
// //                             <Switch
// //                               checked={absoluteDate}
// //                               onChange={(event) =>
// //                                 handleAbsolutesDates(event.target.checked)
// //                               }
// //                               color="primary"
// //                             />
// //                           }
// //                           label={"Absolute Date"}
// //                         />
// //                       </Box>

// //                       {absoluteDate && (
// //                         <Grid
// //                           container
// //                           rowSpacing={3}
// //                           columnSpacing={{ xs: 1, sm: 2, md: 3 }}
// //                         >
// //                           <Grid size={{ xs: 12, md: 6 }}>
// //                             <DatePicker
// //                               label="Start Date"
// //                               value={startDate}
// //                               onChange={handleStartDateChange}
// //                               slotProps={{
// //                                 textField: {
// //                                   size: "small",
// //                                   fullWidth: true,
// //                                 },
// //                               }}
// //                             />
// //                           </Grid>

// //                           <Grid size={{ xs: 12, md: 6 }}>
// //                             <DatePicker
// //                               label="Due Date"
// //                               value={dueDate}
// //                               onChange={handleDueDateChange}
// //                               slotProps={{
// //                                 textField: {
// //                                   size: "small",
// //                                   fullWidth: true,
// //                                 },
// //                               }}
// //                             />
// //                           </Grid>
// //                         </Grid>
// //                       )}

// //                       {!absoluteDate && (
// //                         <>
// //                           <Grid
// //                             container
// //                             rowSpacing={3}
// //                             columnSpacing={{ xs: 1, sm: 2, md: 3 }}
// //                             sx={{ mb: 2 }}
// //                           >
// //                             <Grid size={{ xs: 12, md: 2 }}>
// //                               <Typography>Start In</Typography>
// //                             </Grid>
// //                             <Grid size={{ xs: 12, md: 5 }}>
// //                               <TextField
// //                                 size="small"
// //                                 value={startsin}
// //                                 fullWidth
// //                                 onChange={(e) => setStartsin(e.target.value)}
// //                               />
// //                             </Grid>
// //                             <Grid size={{ xs: 12, md: 5 }}>
// //                               <Autocomplete
// //                                 options={dayOptions}
// //                                 size="small"
// //                                 getOptionLabel={(option) => option.label}
// //                                 onChange={handleStartInDateChange}
// //                                 value={
// //                                   dayOptions.find(
// //                                     (option) =>
// //                                       option.value === startsInDuration,
// //                                   ) || null
// //                                 }
// //                                 renderInput={(params) => (
// //                                   <TextField {...params} size="small" />
// //                                 )}
// //                               />
// //                             </Grid>
// //                           </Grid>

// //                           <Grid
// //                             container
// //                             rowSpacing={3}
// //                             columnSpacing={{ xs: 1, sm: 2, md: 3 }}
// //                           >
// //                             <Grid size={{ xs: 12, md: 2 }}>
// //                               <Typography>Due In</Typography>
// //                             </Grid>
// //                             <Grid size={{ xs: 12, md: 5 }}>
// //                               <TextField
// //                                 size="small"
// //                                 value={duein}
// //                                 fullWidth
// //                                 onChange={(e) => setDuein(e.target.value)}
// //                               />
// //                             </Grid>
// //                             <Grid size={{ xs: 12, md: 5 }}>
// //                               <Autocomplete
// //                                 options={dayOptions}
// //                                 size="small"
// //                                 getOptionLabel={(option) => option.label}
// //                                 onChange={handleDueInDateChange}
// //                                 value={
// //                                   dayOptions.find(
// //                                     (option) => option.value === dueinduration,
// //                                   ) || null
// //                                 }
// //                                 renderInput={(params) => (
// //                                   <TextField {...params} size="small" />
// //                                 )}
// //                               />
// //                             </Grid>
// //                           </Grid>
// //                         </>
// //                       )}
// //                     </Grid>
// //                   </Grid>
// //                 </Grid>
// //                 <Box
// //                   sx={{
// //                     display: { xs: "none", md: "block" }, // hide on small screens
// //                     borderRight: "1px solid #c7c7c7",
// //                     mx: 2, // horizontal spacing
// //                   }}
// //                 />
// //                 <Grid size={{ xs: 12, md: 5 }}>
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       justifyContent: "space-between",
// //                     }}
// //                   >
// //                     <Typography variant="subtitle1" mb={1}>
// //                       Client-facing status
// //                     </Typography>
// //                     <FormControlLabel
// //                       control={
// //                         <Switch
// //                           onChange={(event) =>
// //                             handleClientFacing(event.target.checked)
// //                           }
// //                           checked={clientFacingStatus}
// //                           color="primary"
// //                         />
// //                       }
// //                       label="Show in Client portal"
// //                     />
// //                   </Box>
// //                   <Box mb={2}>
// //                     {clientFacingStatus && (
// //                       <>
// //                         <ShortcodeTextField
// //                           label="Job name for client"
// //                           value={inputText}
// //                           onChange={(e) => {
// //                             const { value, selectionStart } = e.target;
// //                             setInputText(value);
// //                             setCursorPosition(selectionStart);
// //                           }}
// //                           placeholder="Job name for client"
// //                           inputRef={textFieldRef}
// //                           onClick={(e) =>
// //                             setCursorPosition(e.target.selectionStart)
// //                           }
// //                           // shortcuts
// //                           shortcuts={filteredShortcuts}
// //                           showShortcutDropdown={showDropdownClientJob}
// //                           anchorElShortcut={anchorElClientJob}
// //                           onToggleShortcutDropdown={toggleShortcodeDropdown}
// //                           onCloseShortcutDropdown={handleCloseDropdown}
// //                           onAddShortcut={handleJobAddShortcut}
// //                         />
// //                         <Box mt={2}>
// //                           <Typography variant="subtitle1" mb={1}>
// //                             Status
// //                           </Typography>
// //                           <Autocomplete
// //                             options={optionstatus}
// //                             size="small"
// //                             sx={{ mt: 1 }}
// //                             value={selectedJob}
// //                             onChange={handleJobChange}
// //                             getOptionLabel={(option) => option.label}
// //                             isOptionEqualToValue={(option, value) =>
// //                               option.value === value.value
// //                             }
// //                             renderOption={(props, option) => (
// //                               <Box component="li" {...props}>
// //                                 <Chip
// //                                   size="small"
// //                                   style={{
// //                                     backgroundColor: option.clientfacingColour,
// //                                     marginRight: 8,
// //                                     marginLeft: 8,
// //                                     borderRadius: "50%",
// //                                     height: "15px",
// //                                   }}
// //                                 />
// //                                 {option.label}
// //                               </Box>
// //                             )}
// //                             renderInput={(params) => (
// //                               <TextField
// //                                 {...params}
// //                                 placeholder="Select Client Facing Job"
// //                                 InputProps={{
// //                                   ...params.InputProps,
// //                                   startAdornment:
// //                                     params.inputProps.value &&
// //                                     clientFacingJobs.length > 0 ? (
// //                                       <Chip
// //                                         size="small"
// //                                         style={{
// //                                           backgroundColor:
// //                                             clientFacingJobs.find(
// //                                               (job) =>
// //                                                 job.clientfacingName ===
// //                                                 params.inputProps.value,
// //                                             )?.clientfacingColour,
// //                                           marginRight: 8,
// //                                           marginLeft: 2,
// //                                           borderRadius: "50%",
// //                                           height: "15px",
// //                                         }}
// //                                       />
// //                                     ) : null,
// //                                 }}
// //                               />
// //                             )}
// //                           />
// //                         </Box>

// //                         <Box mt={2}>
// //                           <ShortcodeTextField
// //                             label="Description"
// //                             value={clientDescription}
// //                             onChange={(e) => {
// //                               const value = e.target.value;
// //                               if (value.length <= 4000) {
// //                                 setClientDescription(value);
// //                                 setCharCount(value.length);
// //                               }
// //                             }}
// //                             placeholder="Description"
// //                             multiline
// //                             rows={4}
// //                             maxLength={4000}
// //                             inputRef={descriptionFieldRef}
// //                             onClick={(e) =>
// //                               setCursorPosition(e.target.selectionStart)
// //                             }
// //                             helperText={`${clientDescription.length}/4000 characters`}
// //                             // shortcuts
// //                             shortcuts={filteredShortcuts}
// //                             showShortcutDropdown={showDropdownDescription}
// //                             anchorElShortcut={anchorElDescription}
// //                             onToggleShortcutDropdown={toggleDescriptionDropdown}
// //                             onCloseShortcutDropdown={handleCloseDropdown}
// //                             onAddShortcut={handleDescriptionAddShortcut}
// //                           />
// //                         </Box>
// //                       </>
// //                     )}
// //                   </Box>

// //                   <Divider sx={{ mt: 5, margin: "0 auto" }} />
// //                   <Box textAlign="center" m={3}>
// //                     <Button onClick={addCommentField}>Add comments</Button>

// //                     <Box m={2}>
// //                       {comments.map((comment, index) => (
// //                         <Box
// //                           key={index}
// //                           style={{
// //                             display: "flex",
// //                             alignItems: "center",
// //                             gap: "8px",
// //                           }}
// //                         >
// //                           <TextField
// //                             size="small"
// //                             value={comment}
// //                             onChange={(e) =>
// //                               handleCommentChange(index, e.target.value)
// //                             }
// //                             placeholder={`Comment ${index + 1}`}
// //                             variant="outlined"
// //                             fullWidth
// //                             multiline
// //                             margin="normal"
// //                           />
// //                           <IconButton onClick={() => deleteCommentField(index)}>
// //                             <DeleteIcon />
// //                           </IconButton>
// //                         </Box>
// //                       ))}
// //                     </Box>
// //                   </Box>
// //                 </Grid>
// //               </Grid>
// //             </Box>
// //             <Divider sx={{ mt: 1, margin: "0 auto" }} />

// //             <Box
// //               mt={4}
// //               display="flex"
// //               justifyContent="center"
// //               alignItems="center"
// //               gap={2}
// //             >
// //               <Button
// //                 variant="contained"
// //                 onClick={() => handleSubmit(true)}
// //                 disabled={submitting}
// //               >
// //                 {submitting ? "Saving..." : "Save & exit"}
// //               </Button>
// //               <Button
// //                 variant="contained"
// //                 onClick={() => handleSubmit(false)}
// //                 disabled={submitting}
// //               >
// //                 {submitting ? "Saving..." : "Save"}
// //               </Button>
// //               <Button variant="outlined" onClick={handleCloseJobTemp}>
// //                 Cancel
// //               </Button>
// //             </Box>
// //           </Box>
// //         )}
// //       </Box>
// //     </LocalizationProvider>
// //   );
// // };

// // export default JobTemp;


// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import debounce from "lodash/debounce";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import { FormPage, FormSection, FormRow, FormActions, FormGrid, ShortcodePopover, FormDatePicker, FormSelect } from "../../../components/ui/form-layout";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
// import { Input } from "../../../components/ui/input";
// import { Button } from "../../../components/ui/button";
// import { Switch } from "../../../components/ui/switch";
// import { Label } from "../../../components/ui/label";
// import { Textarea } from "../../../components/ui/textarea";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
// import { Plus, Trash2, MessageSquarePlus, Pencil, MoreVertical } from "lucide-react";
// import { DataTable } from "../../../components/data-table/data-table";
// import { DataTableToolbar } from "../../../components/data-table/toolbar";
// import { templateAPI } from "../../../services/api";
// import Priority from "../../../components/Priority";
// import EditorShortcodes from "../../../components/EditorShortcodes";
// import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

// dayjs.extend(customParseFormat);

// const jobSchema = z.object({
//   templatename: z.string().min(1, "Template name is required"),
//   jobName: z.string().min(1, "Job name is required"),
//   assignees: z.array(z.any()).optional(),
//   priority: z.string().optional(),
//   description: z.string().optional(),
//   absoluteDate: z.boolean().optional(),
//   startDate: z.any().optional(),
//   dueDate: z.any().optional(),
//   startsin: z.coerce.number().optional(),
//   startsInDuration: z.string().optional(),
//   duein: z.coerce.number().optional(),
//   dueinduration: z.string().optional(),
//   clientFacingStatus: z.boolean().optional(),
//   inputText: z.string().optional(),
//   selectedJob: z.any().optional(),
//   clientDescription: z.string().optional(),
//   comments: z.array(z.string()).optional(),
// });

// const JobTemp = ({ charLimit = 4000 }) => {
//   const confirm = useConfirm();
//   const [showForm, setShowForm] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [charCount, setCharCount] = useState(0);
//   const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
//   const [showDropdownDescription, setShowDropdownDescription] = useState(false);
//   const [clientFacingJobs, setClientFacingJobs] = useState([]);
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const [selectedOption, setSelectedOption] = useState("contacts");
//   const [templateNameError, setTemplateNameError] = useState("");
//   const [JobTemplates, setJobTemplates] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");

//   const textFieldRef = useRef(null);
//   const descriptionFieldRef = useRef(null);

//   const form = useForm({
//     resolver: zodResolver(jobSchema),
//     defaultValues: {
//       templatename: "",
//       jobName: "",
//       assignees: [],
//       priority: "Medium",
//       description: "",
//       absoluteDate: false,
//       startDate: null,
//       dueDate: null,
//       startsin: 0,
//       startsInDuration: "Days",
//       duein: 0,
//       dueinduration: "Days",
//       clientFacingStatus: false,
//       inputText: "",
//       selectedJob: null,
//       clientDescription: "",
//       comments: [],
//     },
//   });

//   // Fetch client facing jobs
//   const fetchClientFacingJobsData = async () => {
//     try {
//       const response = await templateAPI.getAllJobStatus();
//       setClientFacingJobs(response.data.clientFacingJobStatues || []);
//     } catch (error) {
//       console.error("Error fetching client facing jobs:", error);
//       toast.error("Failed to fetch client facing jobs");
//     }
//   };

//   // Fetch job templates
//   const fetchJobTemplatesData = async () => {
//     setLoading(true);
//     try {
//       const response = await templateAPI.getAllJobTemplates();
//       setJobTemplates(response.data.JobTemplates || []);
//     } catch (error) {
//       console.error("Error fetching job templates:", error);
//       toast.error("Failed to fetch job templates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch single job template for editing
//   const fetchJobTemplateData = async (templateId) => {
//     setSubmitting(true);
//     try {
//       const response = await templateAPI.getJobTemplateById(templateId);
//       const template = response.data.jobTemplate;

//       if (template) {
//         form.reset({
//           templatename: template.templatename || "",
//           jobName: template.jobname || "",
//           assignees: (template.jobassignees || []).map((assignee) => ({
//             value: assignee._id,
//             label: assignee.username,
//           })),
//           priority: template.priority || "Medium",
//           description: template.description || "",
//           absoluteDate: template.absolutedates || false,
//           startDate: template.startdate ? dayjs(template.startdate) : null,
//           dueDate: template.enddate ? dayjs(template.enddate) : null,
//           startsin: template.startsin || 0,
//           startsInDuration: template.startsinduration || "Days",
//           duein: template.duein || 0,
//           dueinduration: template.dueinduration || "Days",
//           clientFacingStatus: template.showinclientportal || false,
//           inputText: template.jobnameforclient || "",
//           selectedJob: template.clientfacingstatus ? {
//             value: template.clientfacingstatus,
//             label: clientFacingJobs.find(s => s._id === template.clientfacingstatus)?.clientfacingName,
//           } : null,
//           clientDescription: template.clientfacingDescription || "",
//           comments: template.comments || [],
//         });
//         setDescription(template.description || "");
//         setEditingId(templateId);
//       }
//     } catch (error) {
//       console.error("Error fetching job template:", error);
//       toast.error("Failed to fetch job template details");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Check template name exists
//   const checkTemplateName = async (name) => {
//     if (!name.trim() || editingId) return;
//     try {
//       const response = await templateAPI.checkJobTemplateNameExists(name);
//       if (response.data.exists) {
//         form.setError("templatename", { type: "manual", message: "Template name already exists" });
//       } else {
//         form.clearErrors("templatename");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const debouncedCheck = debounce((name) => {
//     if (name.trim()) checkTemplateName(name);
//     else form.clearErrors("templatename");
//   }, 500);

//   useEffect(() => {
//     const subscription = form.watch((value, { name }) => {
//       if (name === "templatename") debouncedCheck(value.templatename);
//     });
//     return () => {
//       subscription.unsubscribe();
//       debouncedCheck.cancel();
//     };
//   }, [form.watch, editingId]);

//   useEffect(() => {
//     fetchClientFacingJobsData();
//     fetchJobTemplatesData();
//   }, []);

//   // Update shortcuts based on selected option
//   useEffect(() => {
//     const accountShortcuts = [
//       { title: "Account Shortcodes", isBold: true },
//       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//       { title: "Date Shortcodes", isBold: true },
//       { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
//       { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
//       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//       { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
//       { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
//       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//       { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
//       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//       { title: "Last week", isBold: false, value: "LAST_WEEK" },
//       { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
//       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//       { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
//       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//       { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
//       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//     ];
//     setShortcuts(accountShortcuts);
//     setFilteredShortcuts(accountShortcuts);
//   }, [selectedOption]);

//   // Submit handlers
//   const submitJob = async (values, exitAfterSave) => {
//     const formData = values.absoluteDate
//       ? {
//           templatename: values.templatename,
//           jobname: values.jobName,
//           jobassignees: (values.assignees || []).map((o) => o.value),
//           priority: values.priority,
//           description: description,
//           absolutedates: true,
//           comments: values.comments || [],
//           showinclientportal: values.clientFacingStatus,
//           jobnameforclient: values.inputText,
//           clientfacingstatus: values.selectedJob?.value,
//           startdate: values.startDate,
//           enddate: values.dueDate,
//           clientfacingDescription: values.clientDescription,
//         }
//       : {
//           templatename: values.templatename,
//           jobname: values.jobName,
//           jobassignees: (values.assignees || []).map((o) => o.value),
//           priority: values.priority,
//           description: description,
//           absolutedates: false,
//           startsin: values.startsin,
//           startsinduration: values.startsInDuration,
//           duein: values.duein,
//           dueinduration: values.dueinduration,
//           comments: values.comments || [],
//           showinclientportal: values.clientFacingStatus,
//           jobnameforclient: values.inputText,
//           clientfacingstatus: values.selectedJob?.value,
//           clientfacingDescription: values.clientDescription,
//         };

//     try {
//       let response;
//       if (editingId) {
//         response = await templateAPI.updateJobTemplate(editingId, formData);
//         toast.success("Job Template updated successfully");
//       } else {
//         response = await templateAPI.createJobTemplate(formData);
//         toast.success("Job Template created successfully");
//       }

//       await fetchJobTemplatesData();

//       if (exitAfterSave) {
//         setShowForm(false);
//         setEditingId(null);
//         form.reset();
//         setDescription("");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(`Failed to ${editingId ? "update" : "create"} Job Template`);
//     }
//   };

//   const createjobtemp = form.handleSubmit((values) => submitJob(values, true));
//   const createsavejobtemp = form.handleSubmit((values) => submitJob(values, false));

//   // Delete handler with confirm dialog
//   const handleDelete = async (templateId) => {
//     confirm({
//       title: "Delete Job Template",
//       description: "Are you sure you want to delete this job template?",
//       onConfirm: async () => {
//         try {
//           await templateAPI.deleteJobTemplate(templateId);
//           toast.success("Job Template deleted successfully");
//           fetchJobTemplatesData();
//         } catch (error) {
//           console.error(error);
//           toast.error("Failed to delete Job Template");
//         }
//       },
//     });
//   };

//   const handleEdit = (templateId) => {
//     fetchJobTemplateData(templateId);
//     setShowForm(true);
//   };

//   const handleCreateJobTemplate = () => {
//     setEditingId(null);
//     form.reset({
//       templatename: "",
//       jobName: "",
//       assignees: [],
//       priority: "Medium",
//       description: "",
//       absoluteDate: false,
//       startDate: null,
//       dueDate: null,
//       startsin: 0,
//       startsInDuration: "Days",
//       duein: 0,
//       dueinduration: "Days",
//       clientFacingStatus: false,
//       inputText: "",
//       selectedJob: null,
//       clientDescription: "",
//       comments: [],
//     });
//     setDescription("");
//     setShowForm(true);
//   };

//   const handleCloseJobTemp = () => {
//     if (form.formState.isDirty) {
//       const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
//       if (!confirmClose) return;
//     }
//     setShowForm(false);
//     setEditingId(null);
//     form.reset();
//     setDescription("");
//   };

//   // Shortcode handlers
//   const handleAddShortcut = (shortcut) => {
//     const prev = form.getValues("jobName") || "";
//     const newText = prev.slice(0, cursorPosition) + `[${shortcut}]` + prev.slice(cursorPosition);
//     form.setValue("jobName", newText, { shouldDirty: true });
//     setTimeout(() => {
//       if (textFieldRef.current) {
//         textFieldRef.current.focus();
//         textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
//       }
//     }, 0);
//     setShowDropdown(false);
//   };

//   const handleJobAddShortcut = (shortcut) => {
//     const prev = form.getValues("inputText") || "";
//     const newText = prev.slice(0, cursorPosition) + `[${shortcut}]` + prev.slice(cursorPosition);
//     form.setValue("inputText", newText, { shouldDirty: true });
//     setTimeout(() => {
//       if (textFieldRef.current) {
//         textFieldRef.current.focus();
//         textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
//       }
//     }, 0);
//     setShowDropdownClientJob(false);
//   };

//   const handleDescriptionAddShortcut = (shortcut) => {
//     const prev = form.getValues("clientDescription") || "";
//     const newText = prev.slice(0, cursorPosition) + `[${shortcut}]` + prev.slice(cursorPosition);
//     if (newText.length <= charLimit) {
//       form.setValue("clientDescription", newText, { shouldDirty: true });
//       setCharCount(newText.length);
//     }
//     setTimeout(() => {
//       if (descriptionFieldRef.current) {
//         descriptionFieldRef.current.focus();
//         descriptionFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
//       }
//     }, 0);
//     setShowDropdownDescription(false);
//   };

//   const handleEditorChange = (content) => {
//     setDescription(content);
//     form.setValue("description", content, { shouldDirty: true });
//   };

//   const handleJobChange = async (newValue) => {
//     form.setValue("selectedJob", newValue, { shouldDirty: true });
//     if (newValue && newValue.value) {
//       try {
//         const response = await templateAPI.getJobStatusById(newValue.value);
//         form.setValue("clientDescription", response.data.clientfacingjobstatuses?.clientfacingdescription || "", { shouldDirty: true });
//         setCharCount((response.data.clientfacingjobstatuses?.clientfacingdescription || "").length);
//       } catch (error) {
//         console.error("Error fetching job status:", error);
//       }
//     }
//   };

//   // Comment handlers
//   const comments = form.watch("comments") || [];
//   const addCommentField = () => {
//     form.setValue("comments", [...comments, ""], { shouldDirty: true });
//   };
//   const handleCommentChange = (index, value) => {
//     const updatedComments = [...comments];
//     updatedComments[index] = value;
//     form.setValue("comments", updatedComments, { shouldDirty: true });
//   };
//   const deleteCommentField = (index) => {
//     const updatedComments = comments.filter((_, i) => i !== index);
//     form.setValue("comments", updatedComments, { shouldDirty: true });
//   };

//   const dayOptions = [
//     { label: "Days", value: "Days" },
//     { label: "Months", value: "Months" },
//     { label: "Years", value: "Years" },
//   ];

//   const optionstatus = clientFacingJobs.map((status) => ({
//     value: status._id,
//     label: status.clientfacingName,
//     clientfacingColour: status.clientfacingColour,
//   }));

//   const jobColumns = useMemo(() => [
//     {
//       accessorKey: "templatename",
//       header: "Name",
//       cell: ({ getValue, row }) => (
//         <button
//           onClick={() => handleEdit(row.original._id)}
//           className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
//         >
//           {getValue()}
//         </button>
//       ),
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       size: 80,
//       enableSorting: false,
//       cell: ({ row }) => (
//         <div className="flex items-center gap-0.5">
//           <button
//             onClick={() => handleEdit(row.original._id)}
//             className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
//             title="Edit"
//           >
//             <Pencil className="h-3.5 w-3.5" />
//           </button>
//           <button
//             onClick={() => handleDelete(row.original._id)}
//             className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
//             title="Delete"
//           >
//             <Trash2 className="h-3.5 w-3.5" />
//           </button>
//         </div>
//       ),
//     },
//   ], []);

//   return (
//     <div>
//       {!showForm ? (
//         <div className="mt-4 space-y-3">
//           <div className="flex items-center justify-between">
//             <Button size="sm" onClick={handleCreateJobTemplate}>
//               <Plus className="h-3.5 w-3.5 mr-1.5" /> Job Template
//             </Button>
//           </div>
//           <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
//           <DataTable
//             columns={jobColumns}
//             data={JobTemplates}
//             loading={loading}
//             globalFilter={globalFilter}
//             onGlobalFilterChange={setGlobalFilter}
//             enableRowSelection={false}
//             getRowId={(row) => row._id}
//             emptyMessage="No job templates found"
//             emptyDescription="Create your first job template to get started"
//             pageSize={30}
//           />
//         </div>
//       ) : (
//         <Form {...form}>
//           <FormPage
//             title={editingId ? "Edit Job Template" : "Create Job Template"}
//             subtitle="Configure your job template settings"
//             actions={
//               <>
//                 <Button type="button" variant="outline" onClick={handleCloseJobTemp} disabled={submitting}>
//                   Cancel
//                 </Button>
//                 <Button type="button" variant="secondary" onClick={createsavejobtemp} disabled={submitting}>
//                   {submitting ? "Saving..." : "Save"}
//                 </Button>
//                 <Button type="button" onClick={createjobtemp} disabled={submitting}>
//                   {submitting ? "Saving..." : "Save & Exit"}
//                 </Button>
//               </>
//             }
//           >
//             <FormGrid>
//               {/* LEFT COLUMN */}
//               <FormGrid.Main>
//                 <FormSection title="General Information">
//                   <FormField
//                     control={form.control}
//                     name="templatename"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Template Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Template Name" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="jobName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Job Name</FormLabel>
//                         <FormControl>
//                           <div className="space-y-2">
//                             <Input
//                               placeholder="Job Name"
//                               ref={textFieldRef}
//                               onClick={(e) => setCursorPosition(e.target.selectionStart)}
//                               {...field}
//                               onChange={(e) => {
//                                 setCursorPosition(e.target.selectionStart);
//                                 field.onChange(e);
//                               }}
//                             />
//                             <ShortcodePopover 
//                               shortcuts={filteredShortcuts} 
//                               onSelect={handleAddShortcut}
//                               open={showDropdown}
//                               onOpenChange={setShowDropdown}
//                               anchorEl={anchorEl}
//                               onAnchorElChange={setAnchorEl}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </FormSection>

//                 <FormSection title="Assignment">
//                   <FormField
//                     control={form.control}
//                     name="assignees"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Job Assignees</FormLabel>
//                         <FormControl>
//                           <MultiSelectDropdown
//                             value={field.value || []}
//                             onChange={field.onChange}
//                             placeholder="Job Assignees"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="priority"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Priority</FormLabel>
//                         <FormControl>
//                           <Priority
//                             onPriorityChange={(val) => field.onChange(val)}
//                             selectedPriority={field.value}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </FormSection>

//                 <FormSection title="Description">
//                   <EditorShortcodes 
//                     onChange={handleEditorChange} 
//                     initialContent={description}
//                   />
//                 </FormSection>

//                 <FormSection title="Start and Due Date">
//                   <FormField
//                     control={form.control}
//                     name="absoluteDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <div className="flex items-center justify-between">
//                             <Label className="text-sm font-medium">Absolute Date</Label>
//                             <Switch checked={!!field.value} onCheckedChange={field.onChange} />
//                           </div>
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />

//                   {form.watch("absoluteDate") && (
//                     <FormRow cols={2}>
//                       <FormField
//                         control={form.control}
//                         name="startDate"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Start Date</FormLabel>
//                             <FormControl>
//                               <FormDatePicker {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="dueDate"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Due Date</FormLabel>
//                             <FormControl>
//                               <FormDatePicker {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </FormRow>
//                   )}

//                   {!form.watch("absoluteDate") && (
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <Label className="w-16 shrink-0 text-sm">Start In</Label>
//                         <FormField
//                           control={form.control}
//                           name="startsin"
//                           render={({ field }) => (
//                             <FormItem className="flex-1">
//                               <FormControl>
//                                 <Input type="number" className="flex-1" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="startsInDuration"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Select value={field.value} onValueChange={field.onChange}>
//                                   <SelectTrigger className="w-28">
//                                     <SelectValue placeholder="Unit" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {dayOptions.map((opt) => (
//                                       <SelectItem key={opt.value} value={opt.value}>
//                                         {opt.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <Label className="w-16 shrink-0 text-sm">Due In</Label>
//                         <FormField
//                           control={form.control}
//                           name="duein"
//                           render={({ field }) => (
//                             <FormItem className="flex-1">
//                               <FormControl>
//                                 <Input type="number" className="flex-1" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="dueinduration"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Select value={field.value} onValueChange={field.onChange}>
//                                   <SelectTrigger className="w-28">
//                                     <SelectValue placeholder="Unit" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {dayOptions.map((opt) => (
//                                       <SelectItem key={opt.value} value={opt.value}>
//                                         {opt.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </FormSection>
//               </FormGrid.Main>

//               {/* RIGHT COLUMN */}
//               <FormGrid.Sidebar>
//                 <FormSection title="Client-Facing Status">
//                   <FormField
//                     control={form.control}
//                     name="clientFacingStatus"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <div className="flex items-center justify-between">
//                             <Label className="text-sm font-medium">Show in Client Portal</Label>
//                             <Switch checked={!!field.value} onCheckedChange={field.onChange} />
//                           </div>
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />

//                   {form.watch("clientFacingStatus") && (
//                     <div className="space-y-4 pt-2">
//                       <FormField
//                         control={form.control}
//                         name="inputText"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Job Name for Client</FormLabel>
//                             <FormControl>
//                               <div className="space-y-2">
//                                 <Input
//                                   placeholder="Job name for client"
//                                   ref={textFieldRef}
//                                   onClick={(e) => setCursorPosition(e.target.selectionStart)}
//                                   {...field}
//                                   onChange={(e) => {
//                                     setCursorPosition(e.target.selectionStart);
//                                     field.onChange(e);
//                                   }}
//                                 />
//                                 <ShortcodePopover 
//                                   shortcuts={filteredShortcuts} 
//                                   onSelect={handleJobAddShortcut}
//                                   open={showDropdownClientJob}
//                                   onOpenChange={setShowDropdownClientJob}
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="selectedJob"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Status</FormLabel>
//                             <FormControl>
//                               <Select
//                                 value={field.value?.value || ""}
//                                 onValueChange={(val) => {
//                                   const selected = optionstatus.find((s) => s.value === val) || null;
//                                   handleJobChange(selected);
//                                 }}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select Client Facing Job" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   {optionstatus.map((opt) => (
//                                     <SelectItem key={opt.value} value={opt.value}>
//                                       <div className="flex items-center gap-2">
//                                         <div 
//                                           className="w-3 h-3 rounded-full" 
//                                           style={{ backgroundColor: opt.clientfacingColour }}
//                                         />
//                                         {opt.label}
//                                       </div>
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="clientDescription"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Description</FormLabel>
//                             <FormControl>
//                               <div className="space-y-2">
//                                 <div className="relative">
//                                   <Textarea
//                                     ref={descriptionFieldRef}
//                                     placeholder="Description"
//                                     rows={4}
//                                     className="pr-16"
//                                     onClick={(e) => setCursorPosition(e.target.selectionStart)}
//                                     {...field}
//                                     onChange={(e) => {
//                                       if (e.target.value.length <= charLimit) {
//                                         setCharCount(e.target.value.length);
//                                         field.onChange(e);
//                                       }
//                                     }}
//                                   />
//                                   <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
//                                     {charCount}/{charLimit}
//                                   </span>
//                                 </div>
//                                 <ShortcodePopover 
//                                   shortcuts={filteredShortcuts} 
//                                   onSelect={handleDescriptionAddShortcut}
//                                   open={showDropdownDescription}
//                                   onOpenChange={setShowDropdownDescription}
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   )}
//                 </FormSection>

//                 <FormSection title="Comments">
//                   <div className="space-y-3">
//                     {comments.map((comment, index) => (
//                       <div key={index} className="flex items-start gap-2">
//                         <Textarea
//                           value={comment}
//                           onChange={(e) => handleCommentChange(index, e.target.value)}
//                           placeholder={`Comment ${index + 1}`}
//                           rows={2}
//                           className="flex-1"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => deleteCommentField(index)}
//                           className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     ))}
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       size="sm" 
//                       onClick={addCommentField} 
//                       className="w-full"
//                     >
//                       <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
//                       Add Comment
//                     </Button>
//                   </div>
//                 </FormSection>
//               </FormGrid.Sidebar>
//             </FormGrid>
//           </FormPage>
//         </Form>
//       )}
//     </div>
//   );
// };

// export default JobTemp;


import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import debounce from "lodash/debounce";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { FormPage, FormSection, FormRow, FormGrid, FormDatePicker } from "../../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { Plus, Trash2, MessageSquarePlus, Pencil } from "lucide-react";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import ShortcodeTextField from "../../../components/ShortcodeTextField";
import { templateAPI } from "../../../services/api";
import Priority from "../../../components/Priority";
import EditorShortcodes from "../../../components/EditorShortcodes";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

dayjs.extend(customParseFormat);

const jobSchema = z.object({
  templatename: z.string().min(1, "Template name is required"),
  jobName: z.string().min(1, "Job name is required"),
  assignees: z.array(z.any()).optional(),
  priority: z.string().optional(),
  description: z.string().optional(),
  absoluteDate: z.boolean().optional(),
  startDate: z.any().optional(),
  dueDate: z.any().optional(),
  startsin: z.coerce.number().optional(),
  startsInDuration: z.string().optional(),
  duein: z.coerce.number().optional(),
  dueinduration: z.string().optional(),
  clientFacingStatus: z.boolean().optional(),
  inputText: z.string().optional(),
  selectedJob: z.any().optional(),
  clientDescription: z.string().optional(),
  comments: z.array(z.string()).optional(),
});

// Shortcode definitions
const ACCOUNT_SHORTCUTS = [
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
  { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
  { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
  { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  { title: "Next year", isBold: false, value: "NEXT_YEAR" },
];

const JobTemp = ({ charLimit = 4000 }) => {
  const confirm = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [shortcuts] = useState(ACCOUNT_SHORTCUTS);
  const [filteredShortcuts, setFilteredShortcuts] = useState(ACCOUNT_SHORTCUTS);
  const [charCount, setCharCount] = useState(0);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [JobTemplates, setJobTemplates] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  
  // Shortcode dropdown states
  const [showJobNameDropdown, setShowJobNameDropdown] = useState(false);
  const [showClientJobNameDropdown, setShowClientJobNameDropdown] = useState(false);
  const [showDescriptionDropdown, setShowDescriptionDropdown] = useState(false);
  const [anchorElJobName, setAnchorElJobName] = useState(null);
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDescription] = useState(null);

  const textFieldRef = useRef(null);
  const clientJobNameRef = useRef(null);
  const descriptionFieldRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      templatename: "",
      jobName: "",
      assignees: [],
      priority: "Medium",
      description: "",
      absoluteDate: false,
      startDate: null,
      dueDate: null,
      startsin: 0,
      startsInDuration: "Days",
      duein: 0,
      dueinduration: "Days",
      clientFacingStatus: false,
      inputText: "",
      selectedJob: null,
      clientDescription: "",
      comments: [],
    },
  });

  // Helper function to insert shortcode at cursor position
  const insertShortcode = (fieldName, shortcut, inputRef) => {
    const currentValue = form.getValues(fieldName) || "";
    const newValue = currentValue.slice(0, cursorPosition) + 
                    `[${shortcut}]` + 
                    currentValue.slice(cursorPosition);
    
    form.setValue(fieldName, newValue, { shouldDirty: true });
    
    // Update char count for description field
    if (fieldName === "clientDescription") {
      setCharCount(newValue.length);
    }
    
    // Set cursor position after insertion
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.focus();
        const newCursorPos = cursorPosition + shortcut.length + 2;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
      }
    }, 0);
  };

  // Shortcode handlers
  const handleJobNameShortcut = (shortcut) => {
    insertShortcode("jobName", shortcut, textFieldRef);
    setShowJobNameDropdown(false);
  };

  const handleClientJobNameShortcut = (shortcut) => {
    insertShortcode("inputText", shortcut, clientJobNameRef);
    setShowClientJobNameDropdown(false);
  };

  const handleDescriptionShortcut = (shortcut) => {
    const currentValue = form.getValues("clientDescription") || "";
    const newValue = currentValue.slice(0, cursorPosition) + 
                    `[${shortcut}]` + 
                    currentValue.slice(cursorPosition);
    
    if (newValue.length <= charLimit) {
      form.setValue("clientDescription", newValue, { shouldDirty: true });
      setCharCount(newValue.length);
      
      setTimeout(() => {
        if (descriptionFieldRef.current) {
          descriptionFieldRef.current.focus();
          const newCursorPos = cursorPosition + shortcut.length + 2;
          descriptionFieldRef.current.setSelectionRange(newCursorPos, newCursorPos);
          setCursorPosition(newCursorPos);
        }
      }, 0);
    } else {
      toast.warning(`Description cannot exceed ${charLimit} characters`);
    }
    setShowDescriptionDropdown(false);
  };

  // Dropdown toggle handlers
  const toggleJobNameDropdown = (event) => {
    setAnchorElJobName(event.currentTarget);
    setShowJobNameDropdown(!showJobNameDropdown);
  };

  const toggleClientJobNameDropdown = (event) => {
    setAnchorElClientJob(event.currentTarget);
    setShowClientJobNameDropdown(!showClientJobNameDropdown);
  };

  const toggleDescriptionDropdown = (event) => {
    setAnchorElDescription(event.currentTarget);
    setShowDescriptionDropdown(!showDescriptionDropdown);
  };

  const closeJobNameDropdown = () => {
    setShowJobNameDropdown(false);
    setAnchorElJobName(null);
  };

  const closeClientJobNameDropdown = () => {
    setShowClientJobNameDropdown(false);
    setAnchorElClientJob(null);
  };

  const closeDescriptionDropdown = () => {
    setShowDescriptionDropdown(false);
    setAnchorElDescription(null);
  };

  // Fetch client facing jobs
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await templateAPI.getAllJobStatus();
      setClientFacingJobs(response.data.clientFacingJobStatues || []);
    } catch (error) {
      console.error("Error fetching client facing jobs:", error);
      toast.error("Failed to fetch client facing jobs");
    }
  };

  // Fetch job templates
  const fetchJobTemplatesData = async () => {
    setLoading(true);
    try {
      const response = await templateAPI.getAllJobTemplates();
      setJobTemplates(response.data.JobTemplates || []);
    } catch (error) {
      console.error("Error fetching job templates:", error);
      toast.error("Failed to fetch job templates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single job template for editing
  const fetchJobTemplateData = async (templateId) => {
    setSubmitting(true);
    try {
      const response = await templateAPI.getJobTemplateById(templateId);
      const template = response.data.jobTemplate;

      if (template) {
        form.reset({
          templatename: template.templatename || "",
          jobName: template.jobname || "",
          assignees: (template.jobassignees || []).map((assignee) => ({
            value: assignee._id,
            label: assignee.username,
          })),
          priority: template.priority || "Medium",
          description: template.description || "",
          absoluteDate: template.absolutedates || false,
          startDate: template.startdate ? dayjs(template.startdate) : null,
          dueDate: template.enddate ? dayjs(template.enddate) : null,
          startsin: template.startsin || 0,
          startsInDuration: template.startsinduration || "Days",
          duein: template.duein || 0,
          dueinduration: template.dueinduration || "Days",
          clientFacingStatus: template.showinclientportal || false,
          inputText: template.jobnameforclient || "",
          selectedJob: template.clientfacingstatus ? {
            value: template.clientfacingstatus,
            label: clientFacingJobs.find(s => s._id === template.clientfacingstatus)?.clientfacingName,
          } : null,
          clientDescription: template.clientfacingDescription || "",
          comments: template.comments || [],
        });
        setDescription(template.description || "");
        setCharCount((template.clientfacingDescription || "").length);
        setEditingId(templateId);
      }
    } catch (error) {
      console.error("Error fetching job template:", error);
      toast.error("Failed to fetch job template details");
    } finally {
      setSubmitting(false);
    }
  };

  // Check template name exists
  const checkTemplateName = async (name) => {
    if (!name.trim() || editingId) return;
    try {
      const response = await templateAPI.checkJobTemplateNameExists(name);
      if (response.data.exists) {
        form.setError("templatename", { type: "manual", message: "Template name already exists" });
      } else {
        form.clearErrors("templatename");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else form.clearErrors("templatename");
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "templatename") debouncedCheck(value.templatename);
    });
    return () => {
      subscription.unsubscribe();
      debouncedCheck.cancel();
    };
  }, [form.watch, editingId]);

  useEffect(() => {
    fetchClientFacingJobsData();
    fetchJobTemplatesData();
  }, []);

  // Submit handlers
  const submitJob = async (values, exitAfterSave) => {
    const formData = values.absoluteDate
      ? {
          templatename: values.templatename,
          jobname: values.jobName,
          jobassignees: (values.assignees || []).map((o) => o.value),
          priority: values.priority,
          description: description,
          absolutedates: true,
          comments: values.comments || [],
          showinclientportal: values.clientFacingStatus,
          jobnameforclient: values.inputText,
          clientfacingstatus: values.selectedJob?.value,
          startdate: values.startDate,
          enddate: values.dueDate,
          clientfacingDescription: values.clientDescription,
        }
      : {
          templatename: values.templatename,
          jobname: values.jobName,
          jobassignees: (values.assignees || []).map((o) => o.value),
          priority: values.priority,
          description: description,
          absolutedates: false,
          startsin: values.startsin,
          startsinduration: values.startsInDuration,
          duein: values.duein,
          dueinduration: values.dueinduration,
          comments: values.comments || [],
          showinclientportal: values.clientFacingStatus,
          jobnameforclient: values.inputText,
          clientfacingstatus: values.selectedJob?.value,
          clientfacingDescription: values.clientDescription,
        };

    try {
      if (editingId) {
        await templateAPI.updateJobTemplate(editingId, formData);
        toast.success("Job Template updated successfully");
      } else {
        await templateAPI.createJobTemplate(formData);
        toast.success("Job Template created successfully");
      }

      await fetchJobTemplatesData();

      if (exitAfterSave) {
        setShowForm(false);
        setEditingId(null);
        form.reset();
        setDescription("");
        setCharCount(0);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${editingId ? "update" : "create"} Job Template`);
    }
  };

  const handleSaveAndExit = form.handleSubmit((values) => submitJob(values, true));
  const handleSave = form.handleSubmit((values) => submitJob(values, false));

  const handleEdit = (templateId) => {
    fetchJobTemplateData(templateId);
    setShowForm(true);
  };

  const handleDelete = async (templateId) => {
    confirm({
      title: "Delete Job Template",
      description: "Are you sure you want to delete this job template?",
      onConfirm: async () => {
        try {
          await templateAPI.deleteJobTemplate(templateId);
          toast.success("Job Template deleted successfully");
          fetchJobTemplatesData();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete Job Template");
        }
      },
    });
  };

  const handleCreateJobTemplate = () => {
    setEditingId(null);
    form.reset({
      templatename: "",
      jobName: "",
      assignees: [],
      priority: "Medium",
      description: "",
      absoluteDate: false,
      startDate: null,
      dueDate: null,
      startsin: 0,
      startsInDuration: "Days",
      duein: 0,
      dueinduration: "Days",
      clientFacingStatus: false,
      inputText: "",
      selectedJob: null,
      clientDescription: "",
      comments: [],
    });
    setDescription("");
    setCharCount(0);
    setShowForm(true);
  };

  const handleCloseJobTemp = () => {
    if (form.formState.isDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) return;
    }
    setShowForm(false);
    setEditingId(null);
    form.reset();
    setDescription("");
    setCharCount(0);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
    form.setValue("description", content, { shouldDirty: true });
  };

  const handleJobChange = async (value) => {
    const selected = optionstatus.find((s) => s.value === value) || null;
    form.setValue("selectedJob", selected, { shouldDirty: true });
    if (selected && selected.value) {
      try {
        const response = await templateAPI.getJobStatusById(selected.value);
        const desc = response.data.clientfacingjobstatuses?.clientfacingdescription || "";
        form.setValue("clientDescription", desc, { shouldDirty: true });
        setCharCount(desc.length);
      } catch (error) {
        console.error("Error fetching job status:", error);
      }
    }
  };

  // Comment handlers
  const comments = form.watch("comments") || [];
  const addCommentField = () => {
    form.setValue("comments", [...comments, ""], { shouldDirty: true });
  };
  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    form.setValue("comments", updatedComments, { shouldDirty: true });
  };
  const deleteCommentField = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    form.setValue("comments", updatedComments, { shouldDirty: true });
  };

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  const jobColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div>
      {!showForm ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateJobTemplate}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Job Template
            </Button>
          </div>
          <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <DataTable
            columns={jobColumns}
            data={JobTemplates}
            loading={loading}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection={false}
            getRowId={(row) => row._id}
            emptyMessage="No job templates found"
            emptyDescription="Create your first job template to get started"
            pageSize={30}
          />
        </div>
      ) : (
        <Form {...form}>
          <FormPage
            title={editingId ? "Edit Job Template" : "Create Job Template"}
            subtitle="Configure your job template settings"
            actions={
              <>
                <Button type="button" variant="outline" onClick={handleCloseJobTemp} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="button" variant="secondary" onClick={handleSave} disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
                <Button type="button" onClick={handleSaveAndExit} disabled={submitting}>
                  {submitting ? "Saving..." : "Save & Exit"}
                </Button>
              </>
            }
          >
            <FormGrid>
              {/* LEFT COLUMN */}
              <FormGrid.Main>
                <FormSection title="General Information">
                  <FormField
                    control={form.control}
                    name="templatename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Template Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Name</FormLabel>
                        <FormControl>
                          <ShortcodeTextField
                            label=""
                            value={field.value}
                            onChange={(e) => {
                              const { value, selectionStart } = e.target;
                              field.onChange(value);
                              setCursorPosition(selectionStart);
                            }}
                            placeholder="Job Name"
                            inputRef={textFieldRef}
                            onClick={(e) => setCursorPosition(e.target.selectionStart)}
                            shortcuts={filteredShortcuts}
                            showShortcutDropdown={showJobNameDropdown}
                            anchorElShortcut={anchorElJobName}
                            onToggleShortcutDropdown={toggleJobNameDropdown}
                            onCloseShortcutDropdown={closeJobNameDropdown}
                            onAddShortcut={handleJobNameShortcut}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Assignment">
                  <FormField
                    control={form.control}
                    name="assignees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Assignees</FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Job Assignees"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Priority
                            onPriorityChange={(val) => field.onChange(val)}
                            selectedPriority={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Description">
                  <EditorShortcodes 
                    onChange={handleEditorChange} 
                    initialContent={description}
                  />
                </FormSection>

                <FormSection title="Start and Due Date">
                  <FormField
                    control={form.control}
                    name="absoluteDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Absolute Date</Label>
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("absoluteDate") && (
                    <FormRow cols={2}>
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <FormDatePicker {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <FormDatePicker {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormRow>
                  )}

                  {!form.watch("absoluteDate") && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Label className="w-16 shrink-0 text-sm">Start In</Label>
                        <FormField
                          control={form.control}
                          name="startsin"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input type="number" className="flex-1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startsInDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dayOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="w-16 shrink-0 text-sm">Due In</Label>
                        <FormField
                          control={form.control}
                          name="duein"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input type="number" className="flex-1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueinduration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dayOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </FormSection>
              </FormGrid.Main>

              {/* RIGHT COLUMN */}
              <FormGrid.Sidebar>
                <FormSection title="Client-Facing Status">
                  <FormField
                    control={form.control}
                    name="clientFacingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Show in Client Portal</Label>
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("clientFacingStatus") && (
                    <div className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="inputText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Name for Client</FormLabel>
                            <FormControl>
                              <ShortcodeTextField
                                label=""
                                value={field.value}
                                onChange={(e) => {
                                  const { value, selectionStart } = e.target;
                                  field.onChange(value);
                                  setCursorPosition(selectionStart);
                                }}
                                placeholder="Job name for client"
                                inputRef={clientJobNameRef}
                                onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                shortcuts={filteredShortcuts}
                                showShortcutDropdown={showClientJobNameDropdown}
                                anchorElShortcut={anchorElClientJob}
                                onToggleShortcutDropdown={toggleClientJobNameDropdown}
                                onCloseShortcutDropdown={closeClientJobNameDropdown}
                                onAddShortcut={handleClientJobNameShortcut}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="selectedJob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              value={field.value?.value || ""}
                              onValueChange={handleJobChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Client Facing Job" />
                              </SelectTrigger>
                              <SelectContent>
                                {optionstatus.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: opt.clientfacingColour }}
                                      />
                                      {opt.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <ShortcodeTextField
                                label=""
                                value={field.value}
                                onChange={(e) => {
                                  const { value, selectionStart } = e.target;
                                  if (value.length <= charLimit) {
                                    field.onChange(value);
                                    setCursorPosition(selectionStart);
                                    setCharCount(value.length);
                                  }
                                }}
                                placeholder="Description"
                                inputRef={descriptionFieldRef}
                                onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                shortcuts={filteredShortcuts}
                                showShortcutDropdown={showDescriptionDropdown}
                                anchorElShortcut={anchorElDescription}
                                onToggleShortcutDropdown={toggleDescriptionDropdown}
                                onCloseShortcutDropdown={closeDescriptionDropdown}
                                onAddShortcut={handleDescriptionShortcut}
                                multiline
                                rows={4}
                                maxLength={charLimit}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </FormSection>

                <FormSection title="Comments">
                  <div className="space-y-3">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Textarea
                          value={comment}
                          onChange={(e) => handleCommentChange(index, e.target.value)}
                          placeholder={`Comment ${index + 1}`}
                          rows={2}
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => deleteCommentField(index)}
                          className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addCommentField} 
                      className="w-full"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
                      Add Comment
                    </Button>
                  </div>
                </FormSection>
              </FormGrid.Sidebar>
            </FormGrid>
          </FormPage>
        </Form>
      )}
    </div>
  );
};

export default JobTemp;