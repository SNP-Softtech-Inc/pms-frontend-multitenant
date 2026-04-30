// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   IconButton,
//   Switch,
//   FormControlLabel,
//   Checkbox,
//   TableContainer,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Grid,
//   Autocomplete,
//   Divider,
//   TablePagination,
// } from "@mui/material";

// import { Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// import { toast } from "react-toastify";
// import { FiPlusCircle } from "react-icons/fi";
// import TagsMultiSelectDropDown from "../../../components/TagsMultiSelectDropDown"; // adjust path
// import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
// import { templateAPI } from "../../../services/api";
// import Editor from "../../../components/Editor";
// import Priority from "../../../components/Priority";
// import Status from "../../../components/Status";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// const Tasks = () => {
//   const confirm = useConfirm();
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [templatename, settemplatename] = useState("");
//   const [priority, setPriority] = useState("Medium");
//   const [status, setStatus] = useState("No status");
//   const [description, setDescription] = useState("");
//   const [absoluteDate, setAbsoluteDates] = useState(false);
//   const [startsin, setstartsin] = useState(0);
//   const [duein, setduein] = useState(0);
//   const [startsInDuration, setStartsInDuration] = useState("Days");
//   const [dueinduration, setdueinduration] = useState("Days");
//   const [selectedUser, setSelectedUser] = useState([]);
//   const [combinedValues, setCombinedValues] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [combinedTagsValues, setCombinedTagsValues] = useState([]);
//   const [startDate, setStartDate] = useState(null);
//   const [dueDate, setDueDate] = useState(null);
//   const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
//   const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);
//   const [checkedSubtasks, setCheckedSubtasks] = useState([]);
//   const [TaskTemplates, setTaskTemplates] = useState([]);
//   // Inside your Tasks component
//   const [anchorEl, setAnchorEl] = useState(null);
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

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRowId(null);
//   };

//   const handleEditClick = () => {
//     handleEdit(selectedRowId);
//     handleMenuClose();
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
//   // ================= FETCH =================
//   const fetchTaskData = async () => {
//     try {
//       setLoading(true);
//       const res = await templateAPI.getAllTaskTemplates();
//       setTaskTemplates(res.data.TaskTemplates || []);
//     } catch (err) {
//       toast.error("Failed to fetch templates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTaskData();
//   }, []);

//   const handleUserChange = (users) => {
//     setSelectedUser(users);
//     setCombinedValues(users.map((u) => u.value));
//   };
//   const handleEditorChange = (content) => {
//     setDescription(content);
//   };
//   const handleStatusChange = (status) => {
//     setStatus(status);
//   };
//   const handlePriorityChange = (priority) => {
//     setPriority(priority);
//   };
//   const handleAbsolutesDates = (checked) => {
//     setAbsoluteDates(checked);
//   };

//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };
//   const handleDueDateChange = (date) => {
//     setDueDate(date);
//   };
//   const dayOptions = [
//     { label: "Days", value: "Days" },
//     { label: "Months", value: "Months" },
//     { label: "Years", value: "Years" },
//   ];
//   // Handler function to update state when dropdown value changes
//   const handleStartInDateChange = (event, newValue) => {
//     setStartsInDuration(newValue ? newValue.value : null);
//   };
//   // Handler function to update state when dropdown value changes
//   const handledueindateChange = (event, newValue) => {
//     setdueinduration(newValue ? newValue.value : null);
//   };
//   const handleTagsChange = (tags) => {
//     setSelectedTags(tags); // UI (chips)
//     setCombinedTagsValues(tags.map((t) => t.value)); // payload (ids)
//   };
//   // ================= EDIT =================
//   const handleEdit = async (id) => {
//     try {
//       const res = await templateAPI.getTaskTemplateById(id);
//       const data = res.data.data;
//       console.log("edit task temp", data);
//       setEditingId(id);
//       setShowForm(true);

//       settemplatename(data.templatename || "");
//       setStatus(data.status || "No status");
//       setPriority(data.priority || "Medium");
//       setDescription(data.description || "");
//       setAbsoluteDates(data.absolutedates || false);

//       setstartsin(data.startsin || "");
//       setduein(data.duein || "");

//       setStartsInDuration(data.startsinduration || "Days");
//       setdueinduration(data.dueinduration || "Days");

//       // setCombinedValues(data.taskassignees || []);
//       const assignees = data.taskassignees || [];

//       // convert API → dropdown format
//       const formattedUsers = assignees.map((user) => ({
//         value: user._id,
//         label: user.username,
//       }));

//       setSelectedUser(formattedUsers); // ✅ for UI
//       setCombinedValues(assignees.map((u) => u._id)); // ✅ for payload

//       setSubtasks(data.subtasks || [{ id: "1", text: "" }]);
//       setCheckedSubtasks(
//         data.subtasks?.filter((s) => s.checked).map((s) => s.id) || [],
//       );

//       setSubtaskSwitch(data.issubtaskschecked || false);
//     } catch (err) {
//       toast.error("Failed to load template");
//     }
//   };

//   // ================= BUILD PAYLOAD =================
//   const buildPayload = () => {
//     const subtaskData = subtasks.map((s) => ({
//       id: s.id,
//       text: s.text,
//       checked: checkedSubtasks.includes(s.id),
//     }));

//     return {
//       templatename,
//       status,
//       priority,
//       description,
//       absolutedates: absoluteDate,
//       taskassignees: combinedValues,
//       tasktags: combinedTagsValues,
//       issubtaskschecked: SubtaskSwitch,
//       ...(absoluteDate
//         ? {}
//         : {
//             startsin,
//             startsinduration: startsInDuration,
//             duein,
//             dueinduration,
//           }),
//       subtasks: subtaskData,
//     };
//   };

//   // ================= SAVE =================
//   const handleSave = async (exit = false) => {
//     if (!templatename.trim()) {
//       return toast.error("Template name required");
//     }

//     try {
//       setSaving(true);
//       const payload = buildPayload();

//       let res;

//       if (editingId) {
//         // UPDATE
//         res = await templateAPI.updateTaskTemplate(editingId, payload);
//         toast.success("Updated successfully");
//       } else {
//         // CREATE
//         res = await templateAPI.createTaskTemplate(payload);
//         toast.success("Created successfully");

//         // ✅ Set editingId after create
//         const newId = res?.data?.data?._id;
//         setEditingId(newId);
//       }

//       fetchTaskData();

//       if (exit) {
//         resetFields();
//         setShowForm(false);
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Error saving template");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================= DELETE =================

//   const handleDelete = async (id) => {
//     try {
//       await templateAPI.deleteTaskTemplate(id);
//       toast.success("Deleted");
//       fetchTaskData();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   // ================= RESET =================
//   const resetFields = () => {
//     setEditingId(null);
//     settemplatename("");
//     setPriority("Medium");
//     setCombinedValues([]);
//     setSelectedUser([]); // ✅ IMPORTANT
//     setSelectedTags([]);
//     setCombinedTagsValues([]);
//     setStatus("No status");
//     setDescription("");
//     setAbsoluteDates(false);
//     setstartsin("");
//     setduein("");
//     setSubtasks([{ id: "1", text: "" }]);
//     setCheckedSubtasks([]);
//     setSubtaskSwitch(false);
//   };

//   // ================= SUBTASK =================
//   const handleAddSubtask = () => {
//     setSubtasks([...subtasks, { id: Date.now().toString(), text: "" }]);
//   };

//   const handleDeleteSubtask = (id) => {
//     setSubtasks(subtasks.filter((s) => s.id !== id));
//   };

//   const handleCheckboxChange = (id) => {
//     setCheckedSubtasks((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
//     );
//   };

//   return (
//     <Box>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Box p={2}>
//           {!showForm ? (
//             <>
//               <Button variant="contained" onClick={() => setShowForm(true)}>
//                 Create Task Template
//               </Button>

//               {loading ? (
//                 <CircularProgress />
//               ) : (
//                 <TableContainer component={Paper} sx={{ mt: 2 }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Name</TableCell>
//                         <TableCell>Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {/* {TaskTemplates.map((row) => ( */}
//                       {TaskTemplates.slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage,
//                       ).map((row) => (
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
//                     </TableBody>

//                     <Menu
//                       anchorEl={anchorEl}
//                       open={Boolean(anchorEl)}
//                       onClose={handleMenuClose}
//                     >
//                       <MenuItem onClick={handleEditClick}>
//                         <RiEdit2Line style={{ marginRight: 8 }} /> Edit
//                       </MenuItem>
//                       <MenuItem onClick={handleDeleteClick}>
//                         <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
//                       </MenuItem>
//                     </Menu>
//                   </Table>

//                   <TablePagination
//                     component="div"
//                     count={TaskTemplates.length}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     rowsPerPageOptions={[5, 10, 25]}
//                   />
//                 </TableContainer>
//               )}
//             </>
//           ) : (
//             <>
//               <Box textAlign="center" mb={3}>
//                 <Typography variant="h6">
//                   {editingId ? "Edit Task Template" : "Create Task Template"}
//                 </Typography>
//               </Box>
//               <Divider sx={{ mt: 1, margin: "0 auto" }} />
//               <Box m={2}>
//                 <Grid
//                   container
//                   rowSpacing={3}
//                   columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                 >
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Grid
//                       container
//                       rowSpacing={3}
//                       columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                     >
//                       <Grid size={{ xs: 12, md: 6 }}>
//                         <Typography variant="subtitle1" mb={1}>
//                           Template Name
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           value={templatename}
//                           placeholder="Task Template"
//                           onChange={(e) => settemplatename(e.target.value)}
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 6 }}>
//                         <Typography variant="subtitle1" mb={1}>
//                           Status
//                         </Typography>
//                         <Status
//                           onStatusChange={handleStatusChange}
//                           selectedStatus={status}
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 6 }}>
//                         <Typography sx={{ mb: 1 }}>Task Assignee</Typography>
//                         <MultiSelectDropdown
//                           value={selectedUser}
//                           onChange={handleUserChange}
//                           placeholder="Select Assignees"
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 6 }}>
//                         <Typography variant="subtitle1" mb={1}>
//                           Priority
//                         </Typography>
//                         <Priority
//                           onPriorityChange={handlePriorityChange}
//                           selectedPriority={priority}
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 12 }}>
//                         <Editor
//                           onChange={handleEditorChange}
//                           value={description}
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 12 }}>
//                         <Typography variant="subtitle1" mb={1}>
//                           Tags
//                         </Typography>
//                         <TagsMultiSelectDropDown
//                           value={selectedTags}
//                           onChange={handleTagsChange}
//                           placeholder="Select Tags"
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 12 }}>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <Typography variant="subtitle1" mb={1}>
//                             Start and Due Date
//                           </Typography>
//                           <FormControlLabel
//                             control={
//                               <Switch
//                                 checked={absoluteDate}
//                                 onChange={(event) =>
//                                   handleAbsolutesDates(event.target.checked)
//                                 }
//                               />
//                             }
//                             label="Absolute Date"
//                           />
//                         </Box>

//                         {absoluteDate && (
//                           <Grid
//                             container
//                             rowSpacing={3}
//                             columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                           >
//                             <Grid size={{ xs: 12, md: 6 }}>
//                               <DatePicker
//                                 label="Start Date"
//                                 value={startDate}
//                                 onChange={handleStartDateChange}
//                                 slotProps={{
//                                   textField: {
//                                     size: "small",
//                                     fullWidth: true,
//                                   },
//                                 }}
//                               />
//                             </Grid>

//                             <Grid size={{ xs: 12, md: 6 }}>
//                               <DatePicker
//                                 label="Due Date"
//                                 value={dueDate}
//                                 onChange={handleDueDateChange}
//                                 slotProps={{
//                                   textField: {
//                                     size: "small",
//                                     fullWidth: true,
//                                   },
//                                 }}
//                               />
//                             </Grid>
//                           </Grid>
//                         )}

//                         {!absoluteDate && (
//                           <>
//                             <Grid
//                               container
//                               rowSpacing={3}
//                               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                               sx={{ mb: 2 }}
//                             >
//                               <Grid size={{ xs: 12, md: 2 }}>
//                                 <Typography>Start In</Typography>
//                               </Grid>
//                               <Grid size={{ xs: 12, md: 5 }}>
//                                 <TextField
//                                   size="small"
//                                   value={startsin}
//                                   fullWidth
//                                   onChange={(e) => setstartsin(e.target.value)}
//                                 />
//                               </Grid>
//                               <Grid size={{ xs: 12, md: 5 }}>
//                                 <Autocomplete
//                                   options={dayOptions}
//                                   size="small"
//                                   getOptionLabel={(option) => option.label}
//                                   onChange={handleStartInDateChange}
//                                   value={
//                                     dayOptions.find(
//                                       (option) =>
//                                         option.value === startsInDuration,
//                                     ) || null
//                                   }
//                                   renderInput={(params) => (
//                                     <TextField {...params} size="small" />
//                                   )}
//                                 />
//                               </Grid>
//                             </Grid>

//                             <Grid
//                               container
//                               rowSpacing={3}
//                               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                             >
//                               <Grid size={{ xs: 12, md: 2 }}>
//                                 <Typography>Due In</Typography>
//                               </Grid>
//                               <Grid size={{ xs: 12, md: 5 }}>
//                                 <TextField
//                                   size="small"
//                                   value={duein}
//                                   fullWidth
//                                   onChange={(e) => setduein(e.target.value)}
//                                 />
//                               </Grid>
//                               <Grid size={{ xs: 12, md: 5 }}>
//                                 <Autocomplete
//                                   options={dayOptions}
//                                   size="small"
//                                   getOptionLabel={(option) => option.label}
//                                   onChange={handledueindateChange}
//                                   value={
//                                     dayOptions.find(
//                                       (option) =>
//                                         option.value === dueinduration,
//                                     ) || null
//                                   }
//                                   renderInput={(params) => (
//                                     <TextField {...params} size="small" />
//                                   )}
//                                 />
//                               </Grid>
//                             </Grid>
//                           </>
//                         )}
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                   {/* add vertical line */}
//                   <Box
//                     sx={{
//                       display: { xs: "none", md: "block" }, // hide on small screens
//                       borderRight: "1px solid #c7c7c7",
//                       mx: 2, // horizontal spacing
//                     }}
//                   />
//                   <Grid size={{ xs: 12, md: 5 }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Typography variant="subtitle1" mb={1}>
//                         Subtasks
//                       </Typography>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={SubtaskSwitch}
//                             onChange={(e) => setSubtaskSwitch(e.target.checked)}
//                           />
//                         }
//                         label="Enable"
//                       />
//                     </Box>
//                     <Box>
//                       {SubtaskSwitch && (
//                         <>
//                           {subtasks.map((s) => (
//                             <Box
//                               key={s.id}
//                               display="flex"
//                               alignItems="center"
//                               gap={2}
//                               mt={1}
//                             >
//                               <Checkbox
//                                 checked={checkedSubtasks.includes(s.id)}
//                                 onChange={() => handleCheckboxChange(s.id)}
//                               />
//                               <TextField
//                                 value={s.text}
//                                 fullWidth
//                                 size="small"
//                                 onChange={(e) =>
//                                   setSubtasks((prev) =>
//                                     prev.map((p) =>
//                                       p.id === s.id
//                                         ? { ...p, text: e.target.value }
//                                         : p,
//                                     ),
//                                   )
//                                 }
//                               />
//                               <IconButton
//                                 onClick={() => handleDeleteSubtask(s.id)}
//                               >
//                                 <RiDeleteBin6Line />
//                               </IconButton>
//                             </Box>
//                           ))}

//                           <Button
//                             variant="outlined"
//                             onClick={handleAddSubtask}
//                             sx={{ mt: 1 }}
//                             startIcon={<FiPlusCircle />}
//                           >
//                             Add Subtask
//                           </Button>
//                         </>
//                       )}
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Box>

//               <Divider sx={{ mt: 1, margin: "0 auto" }} />

//               <Box
//                 mt={4}
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 gap={2}
//               >
//                 <Button
//                   variant="contained"
//                   onClick={() => handleSave(true)}
//                   disabled={saving}
//                 >
//                   Save & Exit
//                 </Button>

//                 <Button
//                   variant="contained"
//                   onClick={() => handleSave(false)}
//                   disabled={saving}
//                 >
//                   Save
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   onClick={() => {
//                     resetFields();
//                     setShowForm(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Box>
//       </LocalizationProvider>
//     </Box>
//   );
// };

// export default Tasks;


import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, FileText, Calendar, ListChecks } from "lucide-react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Shadcn UI Components
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

// Custom Components
import TagsMultiSelectDropDown from "../../../components/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import Editor from "../../../components/Editor";
import Priority from "../../../components/Priority";
import Status from "../../../components/Status";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { templateAPI } from "../../../services/api";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { PiDotsThreeOutlineVerticalThin } from "react-icons/pi";

// Form Components
import { FormPage, FormSection, FormRow, FormGrid, FormSwitchRow, FormSubtaskItem, FormSubtaskAdd } from "../../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";

// Validation Schema
const taskTemplateSchema = z.object({
  templatename: z.string().min(1, "Template name is required"),
  status: z.string().default("No status"),
  priority: z.string().default("Medium"),
  description: z.string().default(""),
  assignees: z.array(z.any()).default([]),
  tags: z.array(z.any()).default([]),
  absoluteDate: z.boolean().default(false),
  startsin: z.string().optional(),
  startsInDuration: z.string().optional(),
  duein: z.string().optional(),
  dueinduration: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  SubtaskSwitch: z.boolean().default(false),
});

// const Tasks = () => {
//   const confirm = useConfirm();
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [TaskTemplates, setTaskTemplates] = useState([]);
//   const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);
//   const [checkedSubtasks, setCheckedSubtasks] = useState([]);
//   const [description, setDescription] = useState("");
//   const [globalFilter, setGlobalFilter] = useState("");

//   const dayOptions = [
//     { label: "Days", value: "Days" },
//     { label: "Months", value: "Months" },
//     { label: "Years", value: "Years" },
//   ];

//   // Initialize Form
//   const form = useForm({
//     resolver: zodResolver(taskTemplateSchema),
//     defaultValues: {
//       templatename: "",
//       status: "No status",
//       priority: "Medium",
//       description: "",
//       assignees: [],
//       tags: [],
//       absoluteDate: false,
//       startsin: "",
//       startsInDuration: "Days",
//       duein: "",
//       dueinduration: "Days",
//       startDate: "",
//       dueDate: "",
//       SubtaskSwitch: false,
//     },
//   });

//   // Fetch Task Templates
//   const fetchTaskData = async () => {
//     try {
//       setLoading(true);
//       const res = await templateAPI.getAllTaskTemplates();
//       setTaskTemplates(res.data.TaskTemplates || []);
//     } catch (err) {
//       toast.error("Failed to fetch templates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTaskData();
//   }, []);

//   // Handle Editor Change
//   const handleEditorChange = (content) => {
//     setDescription(content);
//     form.setValue("description", content);
//   };

//   // Handle Subtask Switch
//   const handleSubtaskSwitch = (checked) => {
//     if (!checked) {
//       setSubtasks([{ id: "1", text: "" }]);
//       setCheckedSubtasks([]);
//     }
//   };

//   // Subtask Handlers
//   const handleAddSubtask = () => {
//     setSubtasks([...subtasks, { id: Date.now().toString(), text: "" }]);
//   };

//   const handleDeleteSubtask = (id) => {
//     setSubtasks(subtasks.filter((s) => s.id !== id));
//     setCheckedSubtasks(checkedSubtasks.filter((i) => i !== id));
//   };

//   const handleCheckboxChange = (id) => {
//     setCheckedSubtasks((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const handleInputChange = (id, value) => {
//     setSubtasks((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, text: value } : p))
//     );
//   };

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const items = Array.from(subtasks);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setSubtasks(items);
//   };

//   // Build Payload
//   const buildPayload = (values) => {
//     const subtaskData = subtasks.map((s) => ({
//       id: s.id,
//       text: s.text,
//       checked: checkedSubtasks.includes(s.id),
//     }));

//     return {
//       templatename: values.templatename,
//       status: values.status,
//       priority: values.priority,
//       description: values.description,
//       absolutedates: values.absoluteDate,
//       taskassignees: values.assignees.map((a) => a.value),
//       tasktags: values.tags.map((t) => t.value),
//       issubtaskschecked: values.SubtaskSwitch,
//       ...(values.absoluteDate
//         ? {
//             startDate: values.startDate,
//             dueDate: values.dueDate,
//           }
//         : {
//             startsin: values.startsin,
//             startsinduration: values.startsInDuration,
//             duein: values.duein,
//             dueinduration: values.dueinduration,
//           }),
//       subtasks: subtaskData,
//     };
//   };

//   // Create/Update Task Template
//   const handleSave = async (values, exit = false) => {
//     try {
//       setSaving(true);
//       const payload = buildPayload(values);

//       if (editingId) {
//         await templateAPI.updateTaskTemplate(editingId, payload);
//         toast.success("Updated successfully");
//       } else {
//         const res = await templateAPI.createTaskTemplate(payload);
//         toast.success("Created successfully");
//         setEditingId(res?.data?.data?._id);
//       }

//       fetchTaskData();

//       if (exit) {
//         resetAndClose();
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Error saving template");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const createTaskTemp = async () => {
//     const isValid = await form.trigger();
//     if (isValid) {
//       handleSave(form.getValues(), false);
//     }
//   };

//   const createSaveTaskTemp = async () => {
//     const isValid = await form.trigger();
//     if (isValid) {
//       handleSave(form.getValues(), true);
//     }
//   };

//   // Edit Template
//   const handleEdit = async (id) => {
//     try {
//       const res = await templateAPI.getTaskTemplateById(id);
//       const data = res.data.data;

//       setEditingId(id);
//       setShowForm(true);

//       const assignees = data.taskassignees || [];
//       const formattedUsers = assignees.map((user) => ({
//         value: user._id,
//         label: user.username,
//       }));

//       const tags = data.tasktags || [];
//       const formattedTags = tags.map((tag) => ({
//         value: tag._id,
//         label: tag.tagname,
//       }));

//       form.reset({
//         templatename: data.templatename || "",
//         status: data.status || "No status",
//         priority: data.priority || "Medium",
//         description: data.description || "",
//         assignees: formattedUsers,
//         tags: formattedTags,
//         absoluteDate: data.absolutedates || false,
//         startsin: data.startsin?.toString() || "",
//         startsInDuration: data.startsinduration || "Days",
//         duein: data.duein?.toString() || "",
//         dueinduration: data.dueinduration || "Days",
//         startDate: data.startDate || "",
//         dueDate: data.dueDate || "",
//         SubtaskSwitch: data.issubtaskschecked || false,
//       });

//       setDescription(data.description || "");
//       setSubtasks(data.subtasks || [{ id: "1", text: "" }]);
//       setCheckedSubtasks(
//         data.subtasks?.filter((s) => s.checked).map((s) => s.id) || []
//       );
//     } catch (err) {
//       toast.error("Failed to load template");
//     }
//   };

//   // Delete Template
//   const handleDelete = async (id) => {
//     try {
//       await templateAPI.deleteTaskTemplate(id);
//       toast.success("Deleted successfully");
//       fetchTaskData();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   // Reset and Close
//   const resetAndClose = () => {
//     setEditingId(null);
//     setShowForm(false);
//     setSubtasks([{ id: "1", text: "" }]);
//     setCheckedSubtasks([]);
//     setDescription("");
//     form.reset({
//       templatename: "",
//       status: "No status",
//       priority: "Medium",
//       description: "",
//       assignees: [],
//       tags: [],
//       absoluteDate: false,
//       startsin: "",
//       startsInDuration: "Days",
//       duein: "",
//       dueinduration: "Days",
//       startDate: "",
//       dueDate: "",
//       SubtaskSwitch: false,
//     });
//   };

//   const handleTaskCancel = () => {
//     resetAndClose();
//   };

//   const handleCreateTask = () => {
//     resetAndClose();
//     setShowForm(true);
//   };

//   // Table Columns
//   const taskColumns = [
//     {
//       accessorKey: "templatename",
//       header: "Name",
//       cell: ({ row }) => (
//         <Button
//           variant="link"
//           className="p-0 h-auto font-normal"
//           onClick={() => handleEdit(row.original._id)}
//         >
//           {row.original.templatename}
//         </Button>
//       ),
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => (
//         <Status
//           onStatusChange={() => {}}
//           selectedStatus={row.original.status}
//         />
//       ),
//     },
//     {
//       accessorKey: "priority",
//       header: "Priority",
//       cell: ({ row }) => (
//         <Priority
//           onPriorityChange={() => {}}
//           selectedPriority={row.original.priority}
//         />
//       ),
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="sm">
//               <PiDotsThreeOutlineVerticalThin  className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
//               <RiEdit2Line className="mr-2 h-4 w-4" /> Edit
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => {
//                 confirm({
//                   title: "Delete Template",
//                   description: "Are you sure you want to delete this template?",
//                   onConfirm: async () => {
//                     await handleDelete(row.original._id);
//                   },
//                 });
//               }}
//               className="text-destructive"
//             >
//               <RiDeleteBin6Line className="mr-2 h-4 w-4" /> Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       {!showForm ? (
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <Button size="sm" onClick={handleCreateTask}>
//               <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Task
//             </Button>
//           </div>

//           <DataTableToolbar
//             globalFilter={globalFilter}
//             onGlobalFilterChange={setGlobalFilter}
//           />

//           {loading ? (
//             <Card>
//               <CardContent className="p-6">
//                 <div className="space-y-2">
//                   <Skeleton className="h-10 w-full" />
//                   <Skeleton className="h-10 w-full" />
//                   <Skeleton className="h-10 w-full" />
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <DataTable
//               columns={taskColumns}
//               data={TaskTemplates}
//               loading={loading}
//               globalFilter={globalFilter}
//               onGlobalFilterChange={setGlobalFilter}
//               enableRowSelection={false}
//               getRowId={(row) => row._id}
//               emptyMessage="No task templates found"
//               emptyDescription="Create your first task template to get started"
//               pageSize={10}
//             />
//           )}
//         </div>
//       ) : (
//         <Form {...form}>
//           <FormPage
//             title={editingId ? "Edit Task Template" : "Create Task Template"}
//             subtitle="Configure your task template settings"
//             actions={
//               <>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleTaskCancel}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   onClick={createSaveTaskTemp}
//                   disabled={saving}
//                 >
//                   Save
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={createTaskTemp}
//                   disabled={saving}
//                 >
//                   Save & Exit
//                 </Button>
//               </>
//             }
//           >
//             <FormGrid sidebarWidth="sm">
//               {/* LEFT COLUMN */}
//               <FormGrid.Main>
//                 {/* General Section */}
//                 <FormSection
//                   title="General"
//                   icon={<FileText className="h-4 w-4" />}
//                 >
//                   <div className="grid grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="templatename"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>
//                             Template Name <span className="text-destructive">*</span>
//                           </FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Enter template name"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="status"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Status</FormLabel>
//                           <FormControl>
//                             <Status
//                               onStatusChange={field.onChange}
//                               selectedStatus={field.value}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="assignees"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Assignees</FormLabel>
//                           <FormControl>
//                             <MultiSelectDropdown
//                               value={field.value || []}
//                               onChange={field.onChange}
//                               placeholder="Select assignees"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="priority"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Priority</FormLabel>
//                           <FormControl>
//                             <Priority
//                               onPriorityChange={field.onChange}
//                               selectedPriority={field.value}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </FormSection>

//                 {/* Description Section */}
//                 <FormSection title="Description">
//                   <Editor
//                     onChange={handleEditorChange}
//                     value={form.watch("description")}
//                   />
//                 </FormSection>

//                 {/* Tags Section */}
//                 <FormSection title="Tags">
//                   <FormField
//                     control={form.control}
//                     name="tags"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <TagsMultiSelectDropDown
//                             value={field.value || []}
//                             onChange={field.onChange}
//                             placeholder="Select or search tags"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </FormSection>

//                 {/* Dates Section */}
//                 <FormSection title="Dates" icon={<Calendar className="h-4 w-4" />}>
//                   <FormField
//                     control={form.control}
//                     name="absoluteDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <FormSwitchRow
//                             label="Use absolute dates"
//                             description="Set fixed calendar dates instead of relative offsets"
//                             checked={!!field.value}
//                             onCheckedChange={field.onChange}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />

//                   {form.watch("absoluteDate") ? (
//                     <div className="grid grid-cols-2 gap-4 mt-4">
//                       <FormField
//                         control={form.control}
//                         name="startDate"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Start Date</FormLabel>
//                             <FormControl>
//                               <Input type="date" {...field} />
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
//                               <Input type="date" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   ) : (
//                     <div className="space-y-3 mt-4">
//                       <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
//                         <span className="text-sm font-medium text-foreground pb-2">
//                           Start in
//                         </span>
//                         <FormField
//                           control={form.control}
//                           name="startsin"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   placeholder="0"
//                                   type="number"
//                                   min="0"
//                                   {...field}
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="startsInDuration"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <select
//                                   className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
//                                   {...field}
//                                 >
//                                   {dayOptions.map((opt) => (
//                                     <option key={opt.value} value={opt.value}>
//                                       {opt.label}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                       <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
//                         <span className="text-sm font-medium text-foreground pb-2">
//                           Due in
//                         </span>
//                         <FormField
//                           control={form.control}
//                           name="duein"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   placeholder="0"
//                                   type="number"
//                                   min="0"
//                                   {...field}
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="dueinduration"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <select
//                                   className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
//                                   {...field}
//                                 >
//                                   {dayOptions.map((opt) => (
//                                     <option key={opt.value} value={opt.value}>
//                                       {opt.label}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </FormControl>
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
//                 <FormSection
//                   title="Subtasks"
//                   icon={<ListChecks className="h-4 w-4" />}
//                   description="Add checklist items to this task template"
//                 >
//                   <FormField
//                     control={form.control}
//                     name="SubtaskSwitch"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <FormSwitchRow
//                             label="Enable subtasks"
//                             description="Show a subtask checklist on every task created from this template"
//                             checked={!!field.value}
//                             onCheckedChange={(val) => {
//                               field.onChange(val);
//                               handleSubtaskSwitch(val);
//                             }}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />

//                   {form.watch("SubtaskSwitch") && (
//                     <DragDropContext onDragEnd={handleDragEnd}>
//                       <Droppable droppableId="subtaskList">
//                         {(provided) => (
//                           <div
//                             className="space-y-2 mt-4"
//                             {...provided.droppableProps}
//                             ref={provided.innerRef}
//                           >
//                             {subtasks.map((subtask, index) => (
//                               <Draggable
//                                 key={subtask.id}
//                                 draggableId={subtask.id}
//                                 index={index}
//                               >
//                                 {(provided) => (
//                                   <div
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                   >
//                                     <FormSubtaskItem
//                                       text={subtask.text}
//                                       checked={checkedSubtasks.includes(
//                                         subtask.id
//                                       )}
//                                       onTextChange={(val) =>
//                                         handleInputChange(subtask.id, val)
//                                       }
//                                       onCheckedChange={() =>
//                                         handleCheckboxChange(subtask.id)
//                                       }
//                                       onDelete={() =>
//                                         handleDeleteSubtask(subtask.id)
//                                       }
//                                       dragHandleProps={provided.dragHandleProps}
//                                     />
//                                   </div>
//                                 )}
//                               </Draggable>
//                             ))}
//                             {provided.placeholder}
//                             <FormSubtaskAdd onClick={handleAddSubtask} />
//                           </div>
//                         )}
//                       </Droppable>
//                     </DragDropContext>
//                   )}
//                 </FormSection>
//               </FormGrid.Sidebar>
//             </FormGrid>
//           </FormPage>
//         </Form>
//       )}
//     </div>
//   );
// };
const Tasks = () => {
  const confirm = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [TaskTemplates, setTaskTemplates] = useState([]);
  const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  const [description, setDescription] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  // Initialize Form
  const form = useForm({
    resolver: zodResolver(taskTemplateSchema),
    defaultValues: {
      templatename: "",
      status: "No status",
      priority: "Medium",
      description: "",
      assignees: [],
      tags: [],
      absoluteDate: false,
      startsin: "",
      startsInDuration: "Days",
      duein: "",
      dueinduration: "Days",
      startDate: "",
      dueDate: "",
      SubtaskSwitch: false,
    },
  });

  // Fetch Task Templates
  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const res = await templateAPI.getAllTaskTemplates();
      setTaskTemplates(res.data.TaskTemplates || []);
    } catch (err) {
      toast.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, []);

  // Handle Editor Change
  const handleEditorChange = (content) => {
    setDescription(content);
    form.setValue("description", content);
  };

  // Handle Subtask Switch
  const handleSubtaskSwitch = (checked) => {
    if (!checked) {
      setSubtasks([{ id: "1", text: "" }]);
      setCheckedSubtasks([]);
    }
  };

  // Subtask Handlers
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now().toString(), text: "" }]);
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
    setCheckedSubtasks(checkedSubtasks.filter((i) => i !== id));
  };

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleInputChange = (id, value) => {
    setSubtasks((prev) =>
      prev.map((p) => (p.id === id ? { ...p, text: value } : p))
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(subtasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(items);
  };

  // Build Payload
  const buildPayload = (values) => {
    const subtaskData = subtasks.map((s) => ({
      id: s.id,
      text: s.text,
      checked: checkedSubtasks.includes(s.id),
    }));

    return {
      templatename: values.templatename,
      status: values.status,
      priority: values.priority,
      description: values.description,
      absolutedates: values.absoluteDate,
      taskassignees: values.assignees.map((a) => a.value),
      tasktags: values.tags.map((t) => t.value),
      issubtaskschecked: values.SubtaskSwitch,
      ...(values.absoluteDate
        ? {
            startDate: values.startDate,
            dueDate: values.dueDate,
          }
        : {
            startsin: values.startsin,
            startsinduration: values.startsInDuration,
            duein: values.duein,
            dueinduration: values.dueinduration,
          }),
      subtasks: subtaskData,
    };
  };

  // Create/Update Task Template
  const handleSave = async (values, exit = false) => {
    try {
      setSaving(true);
      const payload = buildPayload(values);

      if (editingId) {
        await templateAPI.updateTaskTemplate(editingId, payload);
        toast.success("Updated successfully");
      } else {
        const res = await templateAPI.createTaskTemplate(payload);
        toast.success("Created successfully");
        setEditingId(res?.data?.data?._id);
      }

      // Refresh the table data
      await fetchTaskData();

      if (exit) {
        // Close form and reset all fields
        resetAndClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving template");
    } finally {
      setSaving(false);
    }
  };

  const createTaskTemp = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      await handleSave(form.getValues(), true); // Pass true to exit
    }
  };

  const createSaveTaskTemp = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      await handleSave(form.getValues(), false); // Pass false to stay
    }
  };

  // Edit Template
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getTaskTemplateById(id);
      const data = res.data.data;

      setEditingId(id);
      setShowForm(true);

      const assignees = data.taskassignees || [];
      const formattedUsers = assignees.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      const tags = data.tasktags || [];
      const formattedTags = tags.map((tag) => ({
        value: tag._id,
        label: tag.tagname,
      }));

      form.reset({
        templatename: data.templatename || "",
        status: data.status || "No status",
        priority: data.priority || "Medium",
        description: data.description || "",
        assignees: formattedUsers,
        tags: formattedTags,
        absoluteDate: data.absolutedates || false,
        startsin: data.startsin?.toString() || "",
        startsInDuration: data.startsinduration || "Days",
        duein: data.duein?.toString() || "",
        dueinduration: data.dueinduration || "Days",
        startDate: data.startDate || "",
        dueDate: data.dueDate || "",
        SubtaskSwitch: data.issubtaskschecked || false,
      });

      setDescription(data.description || "");
      setSubtasks(data.subtasks || [{ id: "1", text: "" }]);
      setCheckedSubtasks(
        data.subtasks?.filter((s) => s.checked).map((s) => s.id) || []
      );
    } catch (err) {
      toast.error("Failed to load template");
    }
  };

  // Delete Template
  const handleDelete = async (id) => {
    try {
      await templateAPI.deleteTaskTemplate(id);
      toast.success("Deleted successfully");
      await fetchTaskData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Reset and Close - This function now properly resets everything
  const resetAndClose = () => {
    // Reset all state
    setEditingId(null);
    setShowForm(false);
    setSubtasks([{ id: "1", text: "" }]);
    setCheckedSubtasks([]);
    setDescription("");
    setGlobalFilter(""); // Optional: reset global filter
    
    // Reset form to default values
    form.reset({
      templatename: "",
      status: "No status",
      priority: "Medium",
      description: "",
      assignees: [],
      tags: [],
      absoluteDate: false,
      startsin: "",
      startsInDuration: "Days",
      duein: "",
      dueinduration: "Days",
      startDate: "",
      dueDate: "",
      SubtaskSwitch: false,
    });
  };

  const handleTaskCancel = () => {
    resetAndClose();
  };

  const handleCreateTask = () => {
    // Reset everything before showing the form
    resetAndClose();
    // Then show the form
    setShowForm(true);
  };

  // Table Columns
  const taskColumns = [
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-32">
          <Status
            onStatusChange={() => {}}
            selectedStatus={row.original.status}
          />
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <div className="w-28">
          <Priority
            onPriorityChange={() => {}}
            selectedPriority={row.original.priority}
          />
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <PiDotsThreeOutlineVerticalThin className="h-4 w-4" />
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
  ];

  return (
    <div className="p-6">
      {!showForm ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateTask}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Task
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
              columns={taskColumns}
              data={TaskTemplates}
              loading={loading}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              enableRowSelection={false}
              getRowId={(row) => row._id}
              emptyMessage="No task templates found"
              emptyDescription="Create your first task template to get started"
              pageSize={10}
            />
          )}
        </div>
      ) : (
        <Form {...form}>
          <FormPage
            title={editingId ? "Edit Task Template" : "Create Task Template"}
            subtitle="Configure your task template settings"
            actions={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTaskCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={createSaveTaskTemp}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={createTaskTemp}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save & Exit"}
                </Button>
              </>
            }
          >
            <FormGrid sidebarWidth="sm">
              {/* LEFT COLUMN */}
              <FormGrid.Main>
                {/* General Section */}
                <FormSection
                  title="General"
                  icon={<FileText className="h-4 w-4" />}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="templatename"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Template Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter template name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Status
                              onStatusChange={field.onChange}
                              selectedStatus={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignees</FormLabel>
                          <FormControl>
                            <MultiSelectDropdown
                              value={field.value || []}
                              onChange={field.onChange}
                              placeholder="Select assignees"
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
                              onPriorityChange={field.onChange}
                              selectedPriority={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormSection>

                {/* Description Section */}
                <FormSection title="Description">
                  <Editor
                    onChange={handleEditorChange}
                    value={form.watch("description")}
                  />
                </FormSection>

                {/* Tags Section */}
                <FormSection title="Tags">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TagsMultiSelectDropDown
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select or search tags"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                {/* Dates Section */}
                <FormSection title="Dates" icon={<Calendar className="h-4 w-4" />}>
                  <FormField
                    control={form.control}
                    name="absoluteDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormSwitchRow
                            label="Use absolute dates"
                            description="Set fixed calendar dates instead of relative offsets"
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("absoluteDate") ? (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
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
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
                        <span className="text-sm font-medium text-foreground pb-2">
                          Start in
                        </span>
                        <FormField
                          control={form.control}
                          name="startsin"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="0"
                                  type="number"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startsInDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                  {...field}
                                >
                                  {dayOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
                        <span className="text-sm font-medium text-foreground pb-2">
                          Due in
                        </span>
                        <FormField
                          control={form.control}
                          name="duein"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="0"
                                  type="number"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueinduration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                  {...field}
                                >
                                  {dayOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
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
                <FormSection
                  title="Subtasks"
                  icon={<ListChecks className="h-4 w-4" />}
                  description="Add checklist items to this task template"
                >
                  <FormField
                    control={form.control}
                    name="SubtaskSwitch"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormSwitchRow
                            label="Enable subtasks"
                            description="Show a subtask checklist on every task created from this template"
                            checked={!!field.value}
                            onCheckedChange={(val) => {
                              field.onChange(val);
                              handleSubtaskSwitch(val);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("SubtaskSwitch") && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="subtaskList">
                        {(provided) => (
                          <div
                            className="space-y-2 mt-4"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {subtasks.map((subtask, index) => (
                              <Draggable
                                key={subtask.id}
                                draggableId={subtask.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <FormSubtaskItem
                                      text={subtask.text}
                                      checked={checkedSubtasks.includes(
                                        subtask.id
                                      )}
                                      onTextChange={(val) =>
                                        handleInputChange(subtask.id, val)
                                      }
                                      onCheckedChange={() =>
                                        handleCheckboxChange(subtask.id)
                                      }
                                      onDelete={() =>
                                        handleDeleteSubtask(subtask.id)
                                      }
                                      dragHandleProps={provided.dragHandleProps}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <FormSubtaskAdd onClick={handleAddSubtask} />
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
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

export default Tasks;