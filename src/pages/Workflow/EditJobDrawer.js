// import React, { useEffect, useState, useRef } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   TextField,
//   InputLabel,
//   Button,
//   Switch,
//   FormControlLabel,
//   Chip,
//   Autocomplete,Paper
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { toast } from "react-toastify";
// import { jobAPI, accountsAPI, templateAPI } from "../../services/api"; // ✅ UPDATED
// import Priority from "../../components/Priority";
// import Editor from "../../components/Editor";
// import MultiSelectDropdown from "../../components/MultiSelectDropdown";
// import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
// import ShortcodeTextField from "../../components/ShortcodeTextField";
// const EditJobDrawer = ({ open, onClose, jobId }) => {
//   const queryClient = useQueryClient();

//   // ================= STATE =================
//   const [jobName, setJobName] = useState("");
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [selectedPipeline, setSelectedPipeline] = useState(null);
//   const [selectedStage, setSelectedStage] = useState(null);
//   const [selectedUser, setSelectedUser] = useState([]);
//   const [priority, setPriority] = useState("");
//   const [description, setDescription] = useState("");

//   const [tagsList, setTagsList] = useState([]);
//   const [accountTags, setAccountTags] = useState([]);

//   const [startDate, setStartDate] = useState(null);
//   const [dueDate, setDueDate] = useState(null);

//   const [clientFacingStatus, setClientFacingStatus] = useState(false);
//   const [clientJobName, setClientJobName] = useState("");

//   const [inputText, setInputText] = useState("");
//   const [charCount, setCharCount] = useState(0);
//   const [clientDescription, setClientDescription] = useState("");
//   const [clientFacingJobs, setClientFacingJobs] = useState([]);
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [anchorElClientJob, setAnchorElClientJob] = useState(null);
//   const [anchorElDescription, setAnchorElDecription] = useState(null);
//   const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
//   const [showDropdownDescription, setShowDropdownDescription] = useState(false);
//   const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("contacts");
//   const [showDropdown, setShowDropdown] = useState(false);
//   // Refs
//   const descriptionFieldRef = useRef(null);
//   const textFieldRef = useRef(null);
//   // Update shortcuts based on selected option
//   useEffect(() => {
//     if (selectedOption === "contacts" || selectedOption === "account") {
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
//       setFilteredShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);
//   const handleDescriptionAddShortcut = (shortcut) => {
//     setClientDescription((prevText) => {
//       const newText =
//         prevText.slice(0, cursorPosition) +
//         `[${shortcut}]` +
//         prevText.slice(cursorPosition);
//       return newText.length <= 4000 ? newText : prevText;
//     });

//     setTimeout(() => {
//       if (descriptionFieldRef.current) {
//         descriptionFieldRef.current.focus();
//         descriptionFieldRef.current.setSelectionRange(
//           cursorPosition + shortcut.length + 2,
//           cursorPosition + shortcut.length + 2,
//         );
//       }
//     }, 0);

//     setShowDropdownDescription(false);
//   };
//   const handleJobAddShortcut = (shortcut) => {
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

//     setShowDropdownClientJob(false);
//   };
//   const handleJobChange = async (event, newValue) => {
//     setSelectedJob(newValue);

//     if (newValue && newValue.value) {
//       try {
//         const response = await templateAPI.getJobStatusById(newValue.value);
//         setClientDescription(
//           response.data.clientfacingjobstatuses.clientfacingdescription,
//         );
//       } catch (error) {
//         console.error("Error fetching job status:", error);
//       }
//     }
//   };
//   const toggleShortcodeDropdown = (event) => {
//     setAnchorElClientJob(event.currentTarget);
//     setShowDropdownClientJob(!showDropdownClientJob);
//   };

//   const toggleDescriptionDropdown = (event) => {
//     setAnchorElDecription(event.currentTarget);
//     setShowDropdownDescription(!showDropdownDescription);
//   };
//   const handleCloseDropdown = () => {
//     setShowDropdown(false);
//     setShowDropdownClientJob(false);
//     setShowDropdownDescription(false);
//     // setAnchorEl(null);
//     setAnchorElClientJob(null);
//     setAnchorElDecription(null);
//   };
  
//   const fetchClientFacingJobsData = async () => {
//     try {
//       const response = await templateAPI.getAllJobStatus();
//       setClientFacingJobs(response.data.clientFacingJobStatues || []);
//     } catch (error) {
//       console.error("Error fetching client facing jobs:", error);
//       toast.error("Failed to fetch client facing jobs");
//     }
//   };
//   useEffect(() => {
//     fetchClientFacingJobsData();
//   }, []);
//   const optionstatus = clientFacingJobs.map((status) => ({
//     value: status._id,
//     label: status.clientfacingName,
//     clientfacingColour: status.clientfacingColour,
//   }));
//   // ================= FETCH =================
//   const { data } = useQuery({
//     queryKey: ["job-detail", jobId],
//     queryFn: () => jobAPI.getJobDetail(jobId),
//     enabled: !!jobId && open,
//   });

//   // ================= PREFILL =================
//   useEffect(() => {
//     if (data) {
//       const job = data?.data?.job;
// console.log("edit job drawer details",job)
//       // Job Name
//       setJobName(job?.jobname || "");

//       // Account
//       setSelectedAccount(job?.accounts?.[0]?.accountName || "");

//       // Pipeline
//       setSelectedPipeline({
//         label: job?.pipeline?.pipelineName,
//         value: job?.pipeline?._id,
//       });

//       // Stage
//       const stageObj = job?.pipeline?.stages?.find(
//         (s) => s._id === job.stageid,
//       );

//       setSelectedStage(
//         stageObj ? { label: stageObj.name, value: stageObj._id } : null,
//       );

//       // Assignees
//       setSelectedUser(
//         job?.jobassignees?.map((u) => ({
//           label: u.username,
//           value: u._id,
//         })) || [],
//       );

//       // Priority
//       setPriority(job?.priority || "");

//       // Description
//       setDescription(job?.description || "");

//       // Dates
//       setStartDate(job?.startdate ? dayjs(job.startdate) : null);
//       setDueDate(job?.enddate ? dayjs(job.enddate) : null);

//       // Client Facing
//      // Client Facing
// setClientFacingStatus(job?.showinclientportal || false);
// setInputText(job?.jobnameforclient || "");
// setClientDescription(job?.clientfacingDescription || "");

// // ✅ SET SELECTED STATUS
// if (job?.clientfacingstatus) {
//   setSelectedJob({
//     value: job.clientfacingstatus._id,
//     label: job.clientfacingstatus.clientfacingName,
//     clientfacingColour: job.clientfacingstatus.clientfacingColour,
//   });
// }

//       // TAGS
//       if (job?.accounts?.[0]?.tags?.length) {
//         const uniqueTags = [
//           ...new Map(
//             job.accounts[0].tags.map((tag) => [tag._id, tag]),
//           ).values(),
//         ];

//         const tagsData = uniqueTags.map((tag) => ({
//           value: tag._id,
//           label: tag.tagName,
//           colour: tag.tagColour,
//         }));

//         setTagsList(tagsData);
//         setAccountTags(tagsData.map((t) => t.value));
//       }
//     }
//   }, [data]);

//   const handleTagsChange = (tags) => {
//     setTagsList(tags);
//     setAccountTags(tags.map((t) => t.value));
//   };

//   // ================= UPDATE =================
//   const updateMutation = useMutation({
//     mutationFn: (payload) => jobAPI.updateJob(jobId, payload),
//   });

//   // ✅ NEW: Tags update mutation
//   const updateTagsMutation = useMutation({
//     mutationFn: (payload) => accountsAPI.assignBulkTags(payload),
//   });

//   const handleSave = async () => {
//     try {
//       const payload = {
//         jobname: jobName,
//         jobassignees: selectedUser.map((u) => u.value),
//         priority,
//         description,
//         stageid: selectedStage?.value,
//         startdate: startDate,
//         enddate: dueDate,
//         showinclientportal: clientFacingStatus,
//         jobnameforclient: inputText,
//         clientfacingDescription: clientDescription,
//         clientfacingstatus:selectedJob?.value
//       };

//       // 1️⃣ Update Job
//       await updateMutation.mutateAsync(payload);

//       // 2️⃣ Update Account Tags
//       if (accountTags?.length && data?.data?.job?.accounts?.length) {
//         const selectedAccounts = data.data.job.accounts.map((a) => a._id);

//         await updateTagsMutation.mutateAsync({
//           accounts: selectedAccounts,
//           tags: accountTags,
//         });
//       }

//       toast.success("Job updated successfully");
//       queryClient.invalidateQueries(["jobs-all"]);
//       queryClient.invalidateQueries(["accounts-all"]);

//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast.error("Update failed");
//     }
//   };

//   // ================= UI =================
//   return (

//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//   <Drawer
//     anchor="right"
//     open={open}
//     onClose={onClose}
//     PaperProps={{
//       sx: {
//         width: 520,
//         maxWidth: "100%",
//         borderRadius: "16px 0 0 16px",
//         // backgroundColor: "#f9fafb",
//       },
//     }}
//   >
//     {/* HEADER */}
//     <Box
//       p={2}
//       display="flex"
//       justifyContent="space-between"
//       alignItems="center"
//       sx={{
//         position: "sticky",
//         top: 0,
//         background: "#fff",
//         zIndex: 10,
//         borderBottom: "1px solid #eee",
//       }}
//     >
//       <Typography fontWeight={600} fontSize={18}>
//         Edit Job
//       </Typography>
//       <IconButton onClick={onClose}>
//         <CloseIcon />
//       </IconButton>
//     </Box>

//     {/* BODY */}
//     <Box p={2} sx={{ overflowY: "auto", height: "calc(100% - 130px)" }}>
//       {/* SECTION 1 */}
//       <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Basic Info
//         </Typography>

//         <TextField
//           label="Account"
//           value={selectedAccount}
//           fullWidth
//           size="small"
//           disabled
//           sx={{ mb: 2 }}
//         />

//         <TextField
//           label="Job Name"
//           value={jobName}
//           onChange={(e) => setJobName(e.target.value)}
//           fullWidth
//           size="small"
//         />
//       </Paper>

//       {/* SECTION 2 */}
//       <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Workflow
//         </Typography>

//         <TextField
//           label="Pipeline"
//           value={selectedPipeline?.label || ""}
//           fullWidth
//           size="small"
//           disabled
//           sx={{ mb: 2 }}
//         />

//         <TextField
//           label="Stage"
//           value={selectedStage?.label || ""}
//           fullWidth
//           size="small"
//           disabled
//         />
//       </Paper>

//       {/* SECTION 3 */}
//       <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Tags & Assignees
//         </Typography>

//         <TagsMultiSelectDropDown
//           value={tagsList}
//           onChange={handleTagsChange}
//           placeholder="Select Tags"
//         />

//         <Box mt={2}>
//           <MultiSelectDropdown
//             value={selectedUser}
//             onChange={setSelectedUser}
//           />
//         </Box>

//         <Box mt={2}>
//           <Priority
//             selectedPriority={priority}
//             onPriorityChange={setPriority}
//           />
//         </Box>
//       </Paper>

//       {/* SECTION 4 */}
//       <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Dates
//         </Typography>

//         <Box display="flex" gap={2}>
//           <DatePicker
//             label="Start Date"
//             value={startDate}
//             onChange={setStartDate}
//             slotProps={{ textField: { size: "small", fullWidth: true } }}
//           />
//           <DatePicker
//             label="Due Date"
//             value={dueDate}
//             onChange={setDueDate}
//             slotProps={{ textField: { size: "small", fullWidth: true } }}
//           />
//         </Box>
//       </Paper>

//       {/* SECTION 5 */}
//       <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
//         <Typography fontWeight={600} mb={2}>
//           Description
//         </Typography>

//         <Editor value={description} onChange={setDescription} />
//       </Paper>

//       {/* CLIENT SECTION */}
//       <Paper sx={{ p: 2, borderRadius: 3 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between">
//           <Typography fontWeight={600}>Client Facing</Typography>
//           <Switch
//             checked={clientFacingStatus}
//             onChange={(e) => setClientFacingStatus(e.target.checked)}
//           />
//         </Box>

//         {clientFacingStatus && (
//           <>
//             <Box mt={2}>
//               <ShortcodeTextField
//                 label="Job name for client"
//                 value={inputText}
//                 onChange={(e) => {
//                   const { value, selectionStart } = e.target;
//                   setInputText(value);
//                   setCursorPosition(selectionStart);
//                 }}
//                 inputRef={textFieldRef}
//                 shortcuts={filteredShortcuts}
//                 showShortcutDropdown={showDropdownClientJob}
//                 anchorElShortcut={anchorElClientJob}
//                 onToggleShortcutDropdown={toggleShortcodeDropdown}
//                 onCloseShortcutDropdown={handleCloseDropdown}
//                 onAddShortcut={handleJobAddShortcut}
//               />
//             </Box>

//             <Box mt={2}>
//               <Autocomplete
//   options={optionstatus}
//   size="small"
//   sx={{ mt: 1 }}
//   value={selectedJob}
//   onChange={handleJobChange}
//   getOptionLabel={(option) => option.label}
//   isOptionEqualToValue={(option, value) =>
//     option.value === value.value
//   }

//   // ✅ Dropdown option with color dot
//   renderOption={(props, option) => (
//     <Box
//       component="li"
//       {...props}
//       sx={{ display: "flex", alignItems: "center", gap: 1 }}
//     >
//       <Box
//         sx={{
//           width: 10,
//           height: 10,
//           borderRadius: "50%",
//           backgroundColor: option.clientfacingColour,
//         }}
//       />
//       {option.label}
//     </Box>
//   )}

//   // ✅ Selected value with color dot inside input
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       label="Status"
//       InputProps={{
//         ...params.InputProps,
//         startAdornment: selectedJob ? (
//           <Box
//             sx={{
//               width: 10,
//               height: 10,
//               borderRadius: "50%",
//               backgroundColor: selectedJob.clientfacingColour,
//               mr: 1,
//             }}
//           />
//         ) : null,
//       }}
//     />
//   )}
// />
//             </Box>

//             <Box mt={2}>
//               <ShortcodeTextField
//                 label="Description"
//                 value={clientDescription}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value.length <= 4000) {
//                     setClientDescription(value);
//                   }
//                 }}
//                 multiline
//                 rows={4}
//                 inputRef={descriptionFieldRef}
//                 helperText={`${clientDescription.length}/4000 characters`}
//                 shortcuts={filteredShortcuts}
//                 showShortcutDropdown={showDropdownDescription}
//                 anchorElShortcut={anchorElDescription}
//                 onToggleShortcutDropdown={toggleDescriptionDropdown}
//                 onCloseShortcutDropdown={handleCloseDropdown}
//                 onAddShortcut={handleDescriptionAddShortcut}
//               />
//             </Box>
//           </>
//         )}
//       </Paper>
//     </Box>

//     {/* FOOTER */}
//     <Box
//       p={2}
//       display="flex"
//       gap={2}
//       justifyContent="flex-end"
//       sx={{
//         position: "sticky",
//         bottom: 0,
//         background: "#fff",
//         borderTop: "1px solid #eee",
//       }}
//     >
//       <Button variant="outlined" onClick={onClose}>
//         Cancel
//       </Button>
//       <Button variant="contained" onClick={handleSave}>
//         Save
//       </Button>
//     </Box>
//   </Drawer>
// </LocalizationProvider>
//   );
// };

// export default EditJobDrawer;


import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {useToastContext} from "../../context/ToastContext"
import dayjs from "dayjs";
import { X, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// shadcn/ui components
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Card, CardContent } from "../../components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { cn } from "../../lib/utils";

// Custom components
import { jobAPI, accountsAPI, templateAPI } from "../../services/api";
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import ShortcodeTextField from "../../components/ShortcodeTextField";

const EditJobDrawer = ({ open, onClose, jobId }) => {
  const queryClient = useQueryClient();
const { showToast } = useToastContext();
  // ================= STATE =================
  const [jobName, setJobName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const [tagsList, setTagsList] = useState([]);
  const [accountTags, setAccountTags] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [clientJobName, setClientJobName] = useState("");

  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [clientDescription, setClientDescription] = useState("");
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Status dropdown state
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [dueDatePickerOpen, setDueDatePickerOpen] = useState(false);

  // Refs
  const descriptionFieldRef = useRef(null);
  const textFieldRef = useRef(null);
  const statusRef = useRef(null);

  // Update shortcuts based on selected option
  useEffect(() => {
    if (selectedOption === "contacts" || selectedOption === "account") {
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
      setShortcuts(accountShortcuts);
      setFilteredShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const handleDescriptionAddShortcut = (shortcut) => {
    setClientDescription((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText.length <= 4000 ? newText : prevText;
    });

    setTimeout(() => {
      if (descriptionFieldRef.current) {
        descriptionFieldRef.current.focus();
        descriptionFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);

    setShowDropdownDescription(false);
  };

  const handleJobAddShortcut = (shortcut) => {
    setInputText((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText;
    });

    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);

    setShowDropdownClientJob(false);
  };

  const handleJobChange = (status) => {
    setSelectedJob(status);
    setStatusDropdownOpen(false);

    if (status && status.value) {
      (async () => {
        try {
          const response = await templateAPI.getJobStatusById(status.value);
          setClientDescription(
            response.data.clientfacingjobstatuses.clientfacingdescription
          );
        } catch (error) {
          console.error("Error fetching job status:", error);
        }
      })();
    }
  };

  const toggleShortcodeDropdown = () => {
    setShowDropdownClientJob(!showDropdownClientJob);
  };

  const toggleDescriptionDropdown = () => {
    setShowDropdownDescription(!showDropdownDescription);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setShowDropdownClientJob(false);
    setShowDropdownDescription(false);
  };

  const fetchClientFacingJobsData = async () => {
    try {
      const response = await templateAPI.getAllJobStatus();
      setClientFacingJobs(response.data.clientFacingJobStatues || []);
    } catch (error) {
      console.error("Error fetching client facing jobs:", error);
      showToast({
        title: "Failed to fetch client facing jobs",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchClientFacingJobsData();
  }, []);

  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  // ================= FETCH =================
  const { data } = useQuery({
    queryKey: ["job-detail", jobId],
    queryFn: () => jobAPI.getJobDetail(jobId),
    enabled: !!jobId && open,
  });

  // ================= PREFILL =================
  useEffect(() => {
    if (data) {
      const job = data?.data?.job;
      console.log("edit job drawer details", job);

      // Job Name
      setJobName(job?.jobname || "");

      // Account
      setSelectedAccount(job?.accounts?.[0]?.accountName || "");

      // Pipeline
      setSelectedPipeline({
        label: job?.pipeline?.pipelineName,
        value: job?.pipeline?._id,
      });

      // Stage
      const stageObj = job?.pipeline?.stages?.find((s) => s._id === job.stageid);
      setSelectedStage(
        stageObj ? { label: stageObj.name, value: stageObj._id } : null
      );

      // Assignees
      setSelectedUser(
        job?.jobassignees?.map((u) => ({
          label: u.username,
          value: u._id,
        })) || []
      );

      // Priority
      setPriority(job?.priority || "");

      // Description
      setDescription(job?.description || "");

      // Dates
      setStartDate(job?.startdate ? dayjs(job.startdate) : null);
      setDueDate(job?.enddate ? dayjs(job.enddate) : null);

      // Client Facing
      setClientFacingStatus(job?.showinclientportal || false);
      setInputText(job?.jobnameforclient || "");
      setClientDescription(job?.clientfacingDescription || "");

      // SET SELECTED STATUS
      if (job?.clientfacingstatus) {
        setSelectedJob({
          value: job.clientfacingstatus._id,
          label: job.clientfacingstatus.clientfacingName,
          clientfacingColour: job.clientfacingstatus.clientfacingColour,
        });
      }

      // TAGS
      if (job?.accounts?.[0]?.tags?.length) {
        const uniqueTags = [
          ...new Map(job.accounts[0].tags.map((tag) => [tag._id, tag])).values(),
        ];

        const tagsData = uniqueTags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));

        setTagsList(tagsData);
        setAccountTags(tagsData.map((t) => t.value));
      }
    }
  }, [data]);

  const handleTagsChange = (tags) => {
    setTagsList(tags);
    setAccountTags(tags.map((t) => t.value));
  };

  // ================= UPDATE =================
  const updateMutation = useMutation({
    mutationFn: (payload) => jobAPI.updateJob(jobId, payload),
  });

  const updateTagsMutation = useMutation({
    mutationFn: (payload) => accountsAPI.assignBulkTags(payload),
  });

  const handleSave = async () => {
    try {
      const payload = {
        jobname: jobName,
        jobassignees: selectedUser.map((u) => u.value),
        priority,
        description,
        stageid: selectedStage?.value,
        startdate: startDate,
        enddate: dueDate,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingDescription: clientDescription,
        clientfacingstatus: selectedJob?.value,
      };

      // 1️⃣ Update Job
      await updateMutation.mutateAsync(payload);

      // 2️⃣ Update Account Tags
      if (accountTags?.length && data?.data?.job?.accounts?.length) {
        const selectedAccounts = data.data.job.accounts.map((a) => a._id);
        await updateTagsMutation.mutateAsync({
          accounts: selectedAccounts,
          tags: accountTags,
        });
      }

      showToast({
        title: "Job updated successfully",
        type: "success",
      });
      queryClient.invalidateQueries(["jobs-all"]);
      queryClient.invalidateQueries(["accounts-all"]);

      onClose();
    } catch (err) {
      console.error(err);
      showToast({
        title: "Update failed",
        type: "error",
      });
    }
  };

  // Simple DatePicker component
  const SimpleDatePicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value ? value.toDate() : null);

    const handleDateSelect = (date) => {
      setSelectedDate(date);
      onChange(date ? dayjs(date) : null);
      setIsOpen(false);
    };

    return (
  <div className="relative flex-1">

    <Label className="text-sm font-medium mb-1 block text-foreground">
      {label}
    </Label>

    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="
        w-full flex items-center justify-between px-3 py-2 text-sm
        border border-border rounded-md
        bg-background
        text-foreground
        hover:bg-accent
        focus:outline-none focus:ring-2 focus:ring-primary
        transition-colors
      "
    >
      <span className={value ? "text-foreground" : "text-muted-foreground"}>
        {value ? value.format("MMMM D, YYYY") : "Select date"}
      </span>

      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
    </button>

    {isOpen && (
      <div
        className="
          absolute top-full left-0 mt-1 z-50
          bg-card border border-border
          rounded-md shadow-lg p-2
        "
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
      </div>
    )}

  </div>
);

    // return (
    //   <div className="relative flex-1">
    //     <Label className="text-sm font-medium mb-1 block">{label}</Label>
    //     <button
    //       type="button"
    //       onClick={() => setIsOpen(!isOpen)}
    //       className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     >
    //       <span className={value ? "text-gray-900" : "text-gray-500"}>
    //         {value ? value.format("MMMM D, YYYY") : "Select date"}
    //       </span>
    //       <CalendarIcon className="h-4 w-4 text-gray-400" />
    //     </button>
    //     {isOpen && (
    //       <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2">
    //         <Calendar
    //           mode="single"
    //           selected={selectedDate}
    //           onSelect={handleDateSelect}
    //           initialFocus
    //         />
    //       </div>
    //     )}
    //   </div>
    // );
  };

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-50 overflow-hidden">

    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Drawer */}
    <div className="
      absolute right-0 top-0 h-full w-full sm:w-[650px]
      bg-card text-card-foreground
      shadow-xl flex flex-col border-l border-border
    ">

      {/* Header */}
      <div className="
        flex items-center justify-between px-5 py-4
        border-b border-border shrink-0
      ">
        <h2 className="text-base font-semibold text-foreground">
          Edit Job
        </h2>

        <button
          onClick={onClose}
          className="
            p-1 rounded-md
            text-muted-foreground
            hover:text-foreground
            hover:bg-accent
            transition-colors
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">

          {/* SECTION 1 */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Basic Info</h3>

              <div className="space-y-2">
                <Label>Account</Label>
                <Input
                  value={selectedAccount}
                  disabled
                  className="bg-muted border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Name</Label>
                <Input
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2 */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Workflow</h3>

              <div className="space-y-2">
                <Label>Pipeline</Label>
                <Input
                  value={selectedPipeline?.label || ""}
                  disabled
                  className="bg-muted border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Stage</Label>
                <Input
                  value={selectedStage?.label || ""}
                  disabled
                  className="bg-muted border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3 */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">
                Tags & Assignees
              </h3>

              <TagsMultiSelectDropDown
                value={tagsList}
                onChange={handleTagsChange}
                placeholder="Select Tags"
              />

              <MultiSelectDropdown
                value={selectedUser}
                onChange={setSelectedUser}
              />

              <Priority
                selectedPriority={priority}
                onPriorityChange={setPriority}
              />
            </CardContent>
          </Card>

          {/* SECTION 4 */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Dates</h3>

              <div className="flex gap-3">
                <SimpleDatePicker
                  value={startDate}
                  onChange={setStartDate}
                  label="Start Date"
                />
                <SimpleDatePicker
                  value={dueDate}
                  onChange={setDueDate}
                  label="Due Date"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5 */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Description</h3>

              <Editor value={description} onChange={setDescription} />
            </CardContent>
          </Card>

          {/* CLIENT SECTION */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Client Facing
                </h3>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={clientFacingStatus}
                    onCheckedChange={setClientFacingStatus}
                  />
                  <span className="text-sm text-muted-foreground">
                    Show in Client Portal
                  </span>
                </div>
              </div>

              {clientFacingStatus && (
                <div className="space-y-3 pt-2">

                  {/* Job Name */}
                  <ShortcodeTextField
                    label="Job name for client"
                    value={inputText}
                    onChange={(e) => {
                      const { value, selectionStart } = e.target;
                      setInputText(value);
                      setCursorPosition(selectionStart);
                    }}
                    inputRef={textFieldRef}
                    shortcuts={filteredShortcuts}
                    showShortcutDropdown={showDropdownClientJob}
                    onToggleShortcutDropdown={toggleShortcodeDropdown}
                    onCloseShortcutDropdown={handleCloseDropdown}
                    onAddShortcut={handleJobAddShortcut}
                  />

                  {/* Status Dropdown */}
                  <div className="relative" ref={statusRef}>
                    <Label className="text-sm font-medium mb-1 block">
                      Status
                    </Label>

                    <button
                      type="button"
                      onClick={() =>
                        setStatusDropdownOpen(!statusDropdownOpen)
                      }
                      className="
                        w-full flex items-center gap-2 px-3 py-2 text-sm
                        border border-border rounded-md
                        bg-background
                        hover:bg-accent
                        focus:outline-none focus:ring-2 focus:ring-primary
                      "
                    >
                      {selectedJob && (
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: selectedJob.clientfacingColour,
                          }}
                        />
                      )}

                      <span className="flex-1 text-left text-foreground">
                        {selectedJob?.label || "Select status..."}
                      </span>

                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {statusDropdownOpen && (
                      <div className="
                        absolute top-full left-0 right-0 mt-1 z-50
                        bg-card border border-border rounded-md shadow-lg
                        max-h-60 overflow-y-auto
                      ">
                        {optionstatus.map((status) => (
                          <button
                            key={status.value}
                            onClick={() => handleJobChange(status)}
                            className="
                              w-full flex items-center gap-2 px-3 py-2 text-sm
                              hover:bg-accent
                              text-foreground
                            "
                          >
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: status.clientfacingColour,
                              }}
                            />
                            {status.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Client Description */}
                  <ShortcodeTextField
                    label="Description"
                    value={clientDescription}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 4000) {
                        setClientDescription(value);
                      }
                    }}
                    multiline
                    rows={4}
                    inputRef={descriptionFieldRef}
                    helperText={`${clientDescription.length}/4000 characters`}
                    shortcuts={filteredShortcuts}
                    showShortcutDropdown={showDropdownDescription}
                    onToggleShortcutDropdown={toggleDescriptionDropdown}
                    onCloseShortcutDropdown={handleCloseDropdown}
                    onAddShortcut={handleDescriptionAddShortcut}
                  />

                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="
        flex items-center justify-end gap-3 px-5 py-4
        border-t border-border shrink-0
      ">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Save
        </Button>
      </div>

    </div>
  </div>
);
  // return (
  //   <div className="fixed inset-0 z-50 overflow-hidden">
  //     {/* Backdrop */}
  //     <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

  //     {/* Drawer Content */}
  //     <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-white shadow-xl flex flex-col">
  //       {/* Header */}
  //       <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
  //         <h2 className="text-base font-semibold text-gray-900">Edit Job</h2>
  //         <button
  //           onClick={onClose}
  //           className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
  //         >
  //           <X className="h-4 w-4" />
  //         </button>
  //       </div>

  //       {/* Body */}
  //       <ScrollArea className="flex-1">
  //         <div className="p-4 space-y-4">
  //           {/* SECTION 1 - Basic Info */}
  //           <Card>
  //             <CardContent className="p-4 space-y-3">
  //               <h3 className="font-semibold text-gray-900">Basic Info</h3>
  //               <div className="space-y-2">
  //                 <Label>Account</Label>
  //                 <Input
  //                   value={selectedAccount}
  //                   disabled
  //                   className="bg-gray-50"
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label>Job Name</Label>
  //                 <Input
  //                   value={jobName}
  //                   onChange={(e) => setJobName(e.target.value)}
  //                 />
  //               </div>
  //             </CardContent>
  //           </Card>

  //           {/* SECTION 2 - Workflow */}
  //           <Card>
  //             <CardContent className="p-4 space-y-3">
  //               <h3 className="font-semibold text-gray-900">Workflow</h3>
  //               <div className="space-y-2">
  //                 <Label>Pipeline</Label>
  //                 <Input
  //                   value={selectedPipeline?.label || ""}
  //                   disabled
  //                   className="bg-gray-50"
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label>Stage</Label>
  //                 <Input
  //                   value={selectedStage?.label || ""}
  //                   disabled
  //                   className="bg-gray-50"
  //                 />
  //               </div>
  //             </CardContent>
  //           </Card>

  //           {/* SECTION 3 - Tags & Assignees */}
  //           <Card>
  //             <CardContent className="p-4 space-y-3">
  //               <h3 className="font-semibold text-gray-900">Tags & Assignees</h3>
  //               <TagsMultiSelectDropDown
  //                 value={tagsList}
  //                 onChange={handleTagsChange}
  //                 placeholder="Select Tags"
  //               />
  //               <MultiSelectDropdown
  //                 value={selectedUser}
  //                 onChange={setSelectedUser}
  //               />
  //               <Priority
  //                 selectedPriority={priority}
  //                 onPriorityChange={setPriority}
  //               />
  //             </CardContent>
  //           </Card>

  //           {/* SECTION 4 - Dates */}
  //           <Card>
  //             <CardContent className="p-4 space-y-3">
  //               <h3 className="font-semibold text-gray-900">Dates</h3>
  //               <div className="flex gap-3">
  //                 <SimpleDatePicker
  //                   value={startDate}
  //                   onChange={setStartDate}
  //                   label="Start Date"
  //                 />
  //                 <SimpleDatePicker
  //                   value={dueDate}
  //                   onChange={setDueDate}
  //                   label="Due Date"
  //                 />
  //               </div>
  //             </CardContent>
  //           </Card>

  //           {/* SECTION 5 - Description */}
  //           <Card>
  //             <CardContent className="p-4 space-y-3">
  //               <h3 className="font-semibold text-gray-900">Description</h3>
  //               <Editor value={description} onChange={setDescription} />
  //             </CardContent>
  //           </Card>

  //           {/* CLIENT SECTION */}
  //           <Card>
  //             <CardContent className="p-4 space-y-3">
  //               <div className="flex items-center justify-between">
  //                 <h3 className="font-semibold text-gray-900">Client Facing</h3>
  //                 <div className="flex items-center gap-2">
  //                   <Switch
  //                     checked={clientFacingStatus}
  //                     onCheckedChange={setClientFacingStatus}
  //                   />
  //                   <span className="text-sm text-gray-600">Show in Client Portal</span>
  //                 </div>
  //               </div>

  //               {clientFacingStatus && (
  //                 <div className="space-y-3 pt-2">
  //                   <ShortcodeTextField
  //                     label="Job name for client"
  //                     value={inputText}
  //                     onChange={(e) => {
  //                       const { value, selectionStart } = e.target;
  //                       setInputText(value);
  //                       setCursorPosition(selectionStart);
  //                     }}
  //                     inputRef={textFieldRef}
  //                     shortcuts={filteredShortcuts}
  //                     showShortcutDropdown={showDropdownClientJob}
  //                     onToggleShortcutDropdown={toggleShortcodeDropdown}
  //                     onCloseShortcutDropdown={handleCloseDropdown}
  //                     onAddShortcut={handleJobAddShortcut}
  //                   />

  //                   {/* Status Dropdown */}
  //                   <div className="relative" ref={statusRef}>
  //                     <Label className="text-sm font-medium mb-1 block">Status</Label>
  //                     <button
  //                       type="button"
  //                       onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
  //                       className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //                     >
  //                       {selectedJob && (
  //                         <div
  //                           className="h-3 w-3 rounded-full"
  //                           style={{ backgroundColor: selectedJob.clientfacingColour }}
  //                         />
  //                       )}
  //                       <span className="flex-1 text-left text-gray-900">
  //                         {selectedJob?.label || "Select status..."}
  //                       </span>
  //                       <ChevronDown className="h-4 w-4 text-gray-400" />
  //                     </button>
  //                     {statusDropdownOpen && (
  //                       <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
  //                         {optionstatus.map((status) => (
  //                           <button
  //                             key={status.value}
  //                             onClick={() => handleJobChange(status)}
  //                             className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none"
  //                           >
  //                             <div
  //                               className="h-3 w-3 rounded-full"
  //                               style={{ backgroundColor: status.clientfacingColour }}
  //                             />
  //                             {status.label}
  //                           </button>
  //                         ))}
  //                       </div>
  //                     )}
  //                   </div>

  //                   <ShortcodeTextField
  //                     label="Description"
  //                     value={clientDescription}
  //                     onChange={(e) => {
  //                       const value = e.target.value;
  //                       if (value.length <= 4000) {
  //                         setClientDescription(value);
  //                       }
  //                     }}
  //                     multiline
  //                     rows={4}
  //                     inputRef={descriptionFieldRef}
  //                     helperText={`${clientDescription.length}/4000 characters`}
  //                     shortcuts={filteredShortcuts}
  //                     showShortcutDropdown={showDropdownDescription}
  //                     onToggleShortcutDropdown={toggleDescriptionDropdown}
  //                     onCloseShortcutDropdown={handleCloseDropdown}
  //                     onAddShortcut={handleDescriptionAddShortcut}
  //                   />
  //                 </div>
  //               )}
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </ScrollArea>

  //       {/* Footer */}
  //       <div className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0">
  //         <Button variant="outline" onClick={onClose}>
  //           Cancel
  //         </Button>
  //         <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
  //           Save
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default EditJobDrawer;