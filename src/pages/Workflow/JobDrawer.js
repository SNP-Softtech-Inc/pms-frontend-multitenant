// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   TextField,
//   CircularProgress,
//   Autocomplete,
//   Grid,
//   Switch,
//   FormControlLabel,
//   Chip,
// } from "@mui/material";
// import { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";
// import CloseIcon from "@mui/icons-material/Close";
// import AccountMultiSelectDropdown from "../../components/AccountMultiSelectDropdown";
// import { useAuth } from "../../context/AuthContext";
// import { templateAPI, jobAPI, accountsAPI } from "../../services/api"; // ✅ ADD jobAPI
// import MultiSelectDropdown from "../../components/MultiSelectDropdown";
// import Priority from "../../components/Priority";
// import Editor from "../../components/Editor";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import AutomationDrawer from "./AutomationDrawer";
// import ShortcodeTextField from "../../components/ShortcodeTextField";
// const JobDrawer = ({ open, onClose, fetchJobData, selectedPipeline }) => {
//   // ✅ ADD fetchJobData prop
//   const [selectedaccount, setSelectedaccount] = useState([]);
//   const queryClient = useQueryClient();
//   const { user, loading: authLoading } = useAuth();
//   const [pipelines, setPipelines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [jobTemplate, setjobTemplate] = useState([]);
//   const [selctedJobTemp, setSelectedJobTemp] = useState(null);
//   // const [selectedPipeline, setSelectedPipeline] = useState(null);
//   const [pipelineValue, setPipelineValue] = useState(null);
//   const [jobName, setJobName] = useState("");
//   const [selectedUser, setSelectedUser] = useState([]);
//   const [combinedValues, setCombinedValues] = useState([]);
//   const [priority, setPriority] = useState("Medium");
//   const [description, setDescription] = useState("");
//   const [absoluteDate, setAbsoluteDates] = useState(false);
//   const [startsin, setstartsin] = useState(0);
//   const [duein, setduein] = useState(0);
//   const [startsInDuration, setStartsInDuration] = useState("Days");
//   const [dueinduration, setdueinduration] = useState("Days");
//   const [dueDate, setDueDate] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [isSaving, setIsSaving] = useState(false); // ✅ ADD loading state
//   const [clientFacingStatus, setClientFacingStatus] = useState(false);
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
//   // const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const selectedOption = "contacts";
//   // const [selectedOption, setSelectedOption] = useState("contacts");
//   // const [showDropdown, setShowDropdown] = useState(false);
//   // useEffect(() => {
//   //   if (selectedPipeline) {
//   //     setPipelineValue(selectedPipeline);
//   //   }
//   // }, [selectedPipeline]);
//   const activePipeline = selectedPipeline || pipelineValue;
//   useEffect(() => {
//   if (activePipeline?._id) {
//     fetchStages(activePipeline._id);
//   } else {
//     setStages([]);
//     setSelectedStage(null);
//   }
// }, [activePipeline?._id]); // ✅ FIX
//   // ✅ NEW STATES
//   const [stages, setStages] = useState([]);
//   const [stagesLoading, setStagesLoading] = useState(false);
//   const [selectedStage, setSelectedStage] = useState(null);
//   // Refs
//   const descriptionFieldRef = useRef(null);
//   const textFieldRef = useRef(null);
//   // Add state for automation drawer
//   const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
//   const [stageAutomations, setStageAutomations] = useState([]);
//   const [accountData, setAccountData] = useState([]);

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
//       // setShortcuts(accountShortcuts);
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
//     // setShowDropdown(false);
//     setShowDropdownClientJob(false);
//     setShowDropdownDescription(false);
//     // setAnchorEl(null);
//     setAnchorElClientJob(null);
//     setAnchorElDecription(null);
//   };
//   const handleClientFacing = (checked) => {
//     setClientFacingStatus(checked);
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
//   // Add function to fetch account data for display
//   const fetchAccountData = async () => {
//     try {
//       const response = await accountsAPI.getAccountNamesByStatus(true);

//       // Axios response → data is inside response.data
//       setAccountData(response.data.accountlist || []);
//     } catch (error) {
//       console.error("Error fetching account data:", error);
//     }
//   };

//   // Fetch account data on mount
//   useEffect(() => {
//     fetchAccountData();
//   }, []);

//   // ================= FETCH PIPELINES =================
//   useEffect(() => {
//     if (!authLoading && user?.id) {
//       fetchPipelines(user.id);
//     }
//   }, [authLoading, user]);

//   const fetchPipelines = async (userId) => {
//     setLoading(true);
//     try {
//       const response = await templateAPI.getPipelinesByUser(userId);
//       setPipelines(response.data.pipeline || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load pipelines");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handlePipelineChange = (event, newValue) => {
//     setPipelineValue(newValue);

//     if (newValue?._id) {
//       fetchStages(newValue._id);
//     } else {
//       setStages([]);
//       setSelectedStage(null);
//     }
//   };
//   // ================= FETCH STAGES =================
//   const fetchStages = async (pipelineId) => {
//     setStagesLoading(true);
//     try {
//       const res = await templateAPI.getPipelineStages(pipelineId);
//       const fetchedStages = res.data.data.stages || [];

//       setStages(fetchedStages);

//       if (fetchedStages.length > 0) {
//         setSelectedStage(fetchedStages[0]);
//       } else {
//         setSelectedStage(null);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load stages");
//     } finally {
//       setStagesLoading(false);
//     }
//   };

//   // ✅ TRIGGER WHEN PIPELINE CHANGES
//   useEffect(() => {
//     // if (selectedPipeline?._id) {
//     //   fetchStages(selectedPipeline._id);
//     // }
//     if (activePipeline?._id) {
//       fetchStages(activePipeline._id);
//     } else {
//       setStages([]);
//       setSelectedStage(null);
//     }
//   }, [selectedPipeline]);

//   useEffect(() => {
//     fetchJobtemp();
//   }, []);

//   const fetchJobtemp = async () => {
//     try {
//       const { data } = await templateAPI.getAllJobTemplates();
//       setjobTemplate(data.JobTemplates || data);
//     } catch (error) {
//       console.error("Error fetching templates:", error);
//     }
//   };

//   const jobOptions = jobTemplate.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const handleJobtemp = async (selectedOption) => {
//     setSelectedJobTemp(selectedOption);

//     if (!selectedOption?.value) return;

//     try {
//       const res = await templateAPI.getJobTemplateById(selectedOption.value);
//       const template = res.data?.jobTemplate || res.data;
//       console.log("gets job template details", template);
//       setJobName(template.jobname || "");
//       setDescription(template.description || "");
//       setPriority(template.priority || "Medium");

//       // ✅ ADD THIS BLOCK
//       setClientFacingStatus(template.showinclientportal || false);

//       setInputText(template.jobnameforclient || template.jobname || "");
//       setClientDescription(template.clientfacingDescription || "");

//       if (template.clientfacingstatus && clientFacingJobs.length > 0) {
//         const matchedStatus = clientFacingJobs.find(
//           (status) => status._id === template.clientfacingstatus,
//         );

//         if (matchedStatus) {
//           setSelectedJob({
//             value: matchedStatus._id,
//             label: matchedStatus.clientfacingName,
//             clientfacingColour: matchedStatus.clientfacingColour,
//           });
//         }
//       }

//       if (template.jobassignees?.length > 0) {
//         const mappedUsers = template.jobassignees.map((user) => ({
//           label: user.username,
//           value: user._id,
//         }));

//         setSelectedUser(mappedUsers);
//         setCombinedValues(mappedUsers.map((u) => u.value));
//       }

//       if (template.absolutedates) {
//         setAbsoluteDates(true);
//         setStartDate(template.startdate ? dayjs(template.startdate) : null);
//         setDueDate(template.enddate ? dayjs(template.enddate) : null);
//       } else {
//         setAbsoluteDates(false);
//         setstartsin(template.startsin || 0);
//         setduein(template.duein || 0);
//         setStartsInDuration(template.startsinduration || "Days");
//         setdueinduration(template.dueinduration || "Days");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load job template details");
//     }
//   };
//   const handleUserChange = (users) => {
//     setSelectedUser(users);
//     setCombinedValues(users.map((u) => u.value));
//   };

//   const handlePriorityChange = (priority) => {
//     setPriority(priority);
//   };

//   const handleEditorChange = (content) => {
//     setDescription(content);
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

//   const handleStartInDateChange = (event, newValue) => {
//     setStartsInDuration(newValue ? newValue.value : null);
//   };

//   const handledueindateChange = (event, newValue) => {
//     setdueinduration(newValue ? newValue.value : null);
//   };

//   // ================= SAVE JOB FUNCTION =================
//   const createJobMutation = useMutation({
//     mutationFn: (jobData) => jobAPI.createJob(jobData),

//     onSuccess: (response) => {
//       if (response?.data) {
//         toast.success("Job created successfully!");

//         // 🔥 Refresh job list
//         queryClient.invalidateQueries(["jobs-all"]);

//         onClose();
//         resetForm();
//       }
//     },

//     onError: (error) => {
//       console.error("Failed to create job:", error);
//       toast.error(error.response?.data?.message || "Failed to create job");
//     },
//   });
//   // Update handleSaveJob to check for automations
//   const handleSaveJob = async () => {
//     if (!activePipeline) {
//       toast.error("Please select a pipeline");
//       return;
//     }

//     if (!selectedStage) {
//       toast.error("Please select a stage");
//       return;
//     }

//     if (!jobName.trim()) {
//       toast.error("Please enter a job name");
//       return;
//     }

//     if (selectedaccount.length === 0) {
//       toast.error("Please select at least one account");
//       return;
//     }

//     // Check if selected stage has automations
//     const stage = stages.find((s) => s._id === selectedStage._id);

//     if (stage?.automations && stage.automations.length > 0) {
//       // Store automations and open automation drawer
//       setStageAutomations(stage.automations);

//       // Prepare job data to pass to automation drawer
//       const jobDataForAutomation = {
//         accounts: selectedaccount.map((acc) => acc.value || acc),
//         stageid: selectedStage._id,
//         pipeline: activePipeline._id,
//         templatename: selctedJobTemp?.value || null,
//         jobname: jobName,
//         jobassignees: combinedValues,
//         priority: priority,
//         description: description,
//         absolutedates: absoluteDate,
//         startsin: startsin,
//         startsinduration: startsInDuration,
//         duein: duein,
//         dueinduration: dueinduration,
//         showinclientportal: clientFacingStatus,
//         jobnameforclient: jobName,
//         clientfacingstatus: selectedJob.value,
//         clientfacingDescription: clientDescription,
//         startdate: absoluteDate && startDate ? startDate.toISOString() : null,
//         enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
//       };

//       // Store job data in state or pass directly
//       window.tempJobData = jobDataForAutomation;
//       setAutomationDrawerOpen(true);
//       return;
//     }

//     // If no automations, create job directly
//     setIsSaving(true);

//     try {
//       const jobData = {
//         accounts: selectedaccount.map((acc) => acc.value || acc),
//         stageid: selectedStage._id,
//         pipeline: activePipeline._id,
//         templatename: selctedJobTemp?.value || null,
//         jobname: jobName,
//         jobassignees: combinedValues,
//         priority: priority,
//         description: description,
//         absolutedates: absoluteDate,
//         startsin: startsin,
//         startsinduration: startsInDuration,
//         duein: duein,
//         dueinduration: dueinduration,
//         showinclientportal: clientFacingStatus,
//         jobnameforclient: jobName,
//         clientfacingstatus: selectedJob.value,
//         clientfacingDescription: clientDescription,
//         startdate: absoluteDate && startDate ? startDate.toISOString() : null,
//         enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
//       };

//       // 🔥 ONLY THIS LINE CHANGED
//       createJobMutation.mutate(jobData);
//     } catch (error) {
//       console.error("Failed to create job:", error);
//       toast.error(error.response?.data?.message || "Failed to create job");
//     } finally {
//       setIsSaving(false);
//     }
//   };
//   // Reset form function
//   const resetForm = () => {
//     setSelectedaccount([]);
//     setPipelineValue(null);
//     setSelectedStage(null);
//     setSelectedJobTemp(null);
//     setJobName("");
//     setSelectedUser([]);
//     setCombinedValues([]);
//     setPriority("Medium");
//     setDescription("");
//     setAbsoluteDates(false);
//     setstartsin(0);
//     setduein(0);
//     setStartsInDuration("Days");
//     setdueinduration("Days");
//     setDueDate(null);
//     setStartDate(null);
//   };

//   // Handle drawer close with reset
//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           sx: {
//             width: 700,
//             display: "flex",
//             flexDirection: "column",
//           },
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             p: 2,
//             borderBottom: "1px solid #eee",
//             position: "sticky",
//             top: 0,
//             bgcolor: "background.paper",
//             zIndex: 1,
//           }}
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Typography variant="h6">Create Job</Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         {/* Content */}
//         <Box
//           sx={{
//             flex: 1,
//             overflowY: "auto",
//             p: 2,
//           }}
//         >
//           {/* ACCOUNT */}
//           <AccountMultiSelectDropdown
//             value={selectedaccount}
//             onChange={setSelectedaccount}
//           />

//           {/* PIPELINE */}
//           <Box mt={2}>
//             {/* <Autocomplete
//               options={pipelines}
//               loading={loading}
//               value={selectedPipeline}
//               onChange={(event, newValue) => setSelectedPipeline(newValue)}
//               getOptionLabel={(option) => option?.pipelineName || ""}
//               isOptionEqualToValue={(option, value) => option._id === value._id}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Pipeline" fullWidth />
//               )}
//             /> */}
//             <Autocomplete
//               options={pipelines}
//               loading={loading}
//               value={pipelineValue}
//               onChange={handlePipelineChange}
//               // onChange={(event, newValue) => setPipelineValue(newValue)}
//               getOptionLabel={(option) => option?.pipelineName || ""}
//               isOptionEqualToValue={(option, value) => option._id === value._id}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Pipeline" fullWidth />
//               )}
//             />
//           </Box>

//           {/* STAGES UI */}
//           <Box mt={2}>
//             <Autocomplete
//               options={stages}
//               loading={stagesLoading}
//               value={selectedStage}
//               onChange={(event, newValue) => setSelectedStage(newValue)}
//               getOptionLabel={(option) => option?.name || ""}
//               isOptionEqualToValue={(option, value) => option._id === value._id}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Stage"
//                   fullWidth
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {stagesLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//             />
//           </Box>

//           <Box mt={2}>
//             <Autocomplete
//               options={jobOptions}
//               value={selctedJobTemp}
//               onChange={(e, v) => handleJobtemp(v)}
//               size="small"
//               sx={{ mt: 1, background: "#fff" }}
//               getOptionLabel={(o) => o.label}
//               renderInput={(params) => (
//                 <TextField {...params} label="Default job template" />
//               )}
//             />
//           </Box>

//           <Box mt={2}>
//             <TextField
//               fullWidth
//               value={jobName}
//               onChange={(e) => setJobName(e.target.value)}
//               size="small"
//               label="Job Name"
//               required
//             />
//           </Box>

//           <Box mt={2}>
//             <MultiSelectDropdown
//               value={selectedUser}
//               onChange={handleUserChange}
//               placeholder="Job Assignees"
//             />
//           </Box>

//           <Box mt={2}>
//             <Priority
//               onPriorityChange={handlePriorityChange}
//               selectedPriority={priority}
//             />
//           </Box>

//           <Box mt={2}>
//             <Editor value={description} onChange={handleEditorChange} />
//           </Box>

//           <Box mt={2}>
//             <Grid size={{ xs: 12, md: 12 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Typography variant="subtitle1" mb={1}>
//                   Start and Due Date
//                 </Typography>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={absoluteDate}
//                       onChange={(event) =>
//                         handleAbsolutesDates(event.target.checked)
//                       }
//                     />
//                   }
//                   label="Absolute Date"
//                 />
//               </Box>

//               {absoluteDate && (
//                 <Grid
//                   container
//                   rowSpacing={3}
//                   columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                 >
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <DatePicker
//                       label="Start Date"
//                       value={startDate}
//                       onChange={handleStartDateChange}
//                       slotProps={{
//                         textField: {
//                           size: "small",
//                           fullWidth: true,
//                         },
//                       }}
//                     />
//                   </Grid>

//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <DatePicker
//                       label="Due Date"
//                       value={dueDate}
//                       onChange={handleDueDateChange}
//                       slotProps={{
//                         textField: {
//                           size: "small",
//                           fullWidth: true,
//                         },
//                       }}
//                     />
//                   </Grid>
//                 </Grid>
//               )}

//               {!absoluteDate && (
//                 <>
//                   <Grid
//                     container
//                     rowSpacing={3}
//                     columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                     sx={{ mb: 2 }}
//                   >
//                     <Grid size={{ xs: 12, md: 2 }}>
//                       <Typography>Start In</Typography>
//                     </Grid>
//                     <Grid size={{ xs: 12, md: 5 }}>
//                       <TextField
//                         size="small"
//                         value={startsin}
//                         fullWidth
//                         type="number"
//                         onChange={(e) => setstartsin(Number(e.target.value))}
//                       />
//                     </Grid>
//                     <Grid size={{ xs: 12, md: 5 }}>
//                       <Autocomplete
//                         options={dayOptions}
//                         size="small"
//                         getOptionLabel={(option) => option.label}
//                         onChange={handleStartInDateChange}
//                         value={
//                           dayOptions.find(
//                             (option) => option.value === startsInDuration,
//                           ) || null
//                         }
//                         renderInput={(params) => (
//                           <TextField {...params} size="small" />
//                         )}
//                       />
//                     </Grid>
//                   </Grid>

//                   <Grid
//                     container
//                     rowSpacing={3}
//                     columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//                   >
//                     <Grid size={{ xs: 12, md: 2 }}>
//                       <Typography>Due In</Typography>
//                     </Grid>
//                     <Grid size={{ xs: 12, md: 5 }}>
//                       <TextField
//                         size="small"
//                         value={duein}
//                         fullWidth
//                         type="number"
//                         onChange={(e) => setduein(Number(e.target.value))}
//                       />
//                     </Grid>
//                     <Grid size={{ xs: 12, md: 5 }}>
//                       <Autocomplete
//                         options={dayOptions}
//                         size="small"
//                         getOptionLabel={(option) => option.label}
//                         onChange={handledueindateChange}
//                         value={
//                           dayOptions.find(
//                             (option) => option.value === dueinduration,
//                           ) || null
//                         }
//                         renderInput={(params) => (
//                           <TextField {...params} size="small" />
//                         )}
//                       />
//                     </Grid>
//                   </Grid>
//                 </>
//               )}
//             </Grid>
//           </Box>
//           <Box mt={2}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Typography variant="subtitle1" mb={1}>
//                 Client-facing status
//               </Typography>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     onChange={(event) =>
//                       handleClientFacing(event.target.checked)
//                     }
//                     checked={clientFacingStatus}
//                     color="primary"
//                   />
//                 }
//                 label="Show in Client portal"
//               />
//             </Box>
//             <Box mb={2}>
//               {clientFacingStatus && (
//                 <>
//                   <ShortcodeTextField
//                     label="Job name for client"
//                     value={inputText}
//                     onChange={(e) => {
//                       const { value, selectionStart } = e.target;
//                       setInputText(value);
//                       setCursorPosition(selectionStart);
//                     }}
//                     placeholder="Job name for client"
//                     inputRef={textFieldRef}
//                     onClick={(e) => setCursorPosition(e.target.selectionStart)}
//                     // shortcuts
//                     shortcuts={filteredShortcuts}
//                     showShortcutDropdown={showDropdownClientJob}
//                     anchorElShortcut={anchorElClientJob}
//                     onToggleShortcutDropdown={toggleShortcodeDropdown}
//                     onCloseShortcutDropdown={handleCloseDropdown}
//                     onAddShortcut={handleJobAddShortcut}
//                   />
//                   <Box mt={2}>
//                     <Typography variant="subtitle1" mb={1}>
//                       Status
//                     </Typography>
//                     <Autocomplete
//                       options={optionstatus}
//                       size="small"
//                       sx={{ mt: 1 }}
//                       value={selectedJob}
//                       onChange={handleJobChange}
//                       getOptionLabel={(option) => option.label}
//                       isOptionEqualToValue={(option, value) =>
//                         option.value === value.value
//                       }
//                       renderOption={(props, option) => (
//                         <Box component="li" {...props}>
//                           <Chip
//                             size="small"
//                             style={{
//                               backgroundColor: option.clientfacingColour,
//                               marginRight: 8,
//                               marginLeft: 8,
//                               borderRadius: "50%",
//                               height: "15px",
//                             }}
//                           />
//                           {option.label}
//                         </Box>
//                       )}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           placeholder="Select Client Facing Job"
//                           InputProps={{
//                             ...params.InputProps,
//                             startAdornment:
//                               params.inputProps.value &&
//                               clientFacingJobs.length > 0 ? (
//                                 <Chip
//                                   size="small"
//                                   style={{
//                                     backgroundColor: clientFacingJobs.find(
//                                       (job) =>
//                                         job.clientfacingName ===
//                                         params.inputProps.value,
//                                     )?.clientfacingColour,
//                                     marginRight: 8,
//                                     marginLeft: 2,
//                                     borderRadius: "50%",
//                                     height: "15px",
//                                   }}
//                                 />
//                               ) : null,
//                           }}
//                         />
//                       )}
//                     />
//                   </Box>

//                   <Box mt={2}>
//                     <ShortcodeTextField
//                       label="Description"
//                       value={clientDescription}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (value.length <= 4000) {
//                           setClientDescription(value);
//                           setCharCount(value.length);
//                         }
//                       }}
//                       placeholder="Description"
//                       multiline
//                       rows={4}
//                       maxLength={4000}
//                       inputRef={descriptionFieldRef}
//                       onClick={(e) =>
//                         setCursorPosition(e.target.selectionStart)
//                       }
//                       helperText={`${clientDescription.length}/4000 characters`}
//                       // shortcuts
//                       shortcuts={filteredShortcuts}
//                       showShortcutDropdown={showDropdownDescription}
//                       anchorElShortcut={anchorElDescription}
//                       onToggleShortcutDropdown={toggleDescriptionDropdown}
//                       onCloseShortcutDropdown={handleCloseDropdown}
//                       onAddShortcut={handleDescriptionAddShortcut}
//                     />
//                   </Box>
//                 </>
//               )}
//             </Box>
//           </Box>
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             p: 2,
//             borderTop: "1px solid #eee",
//             position: "sticky",
//             bottom: 0,
//             bgcolor: "background.paper",
//           }}
//           display="flex"
//           justifyContent="flex-end"
//           gap={2}
//         >
//           <Button variant="outlined" onClick={handleClose} disabled={isSaving}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSaveJob}
//             disabled={isSaving}
//           >
//             {isSaving ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </Box>
//       </Drawer>

//       <AutomationDrawer
//         open={automationDrawerOpen}
//         onClose={() => setAutomationDrawerOpen(false)}
//         automations={stageAutomations}
//         selectedAccounts={selectedaccount.map((acc) => acc.value || acc)}
//         accountData={accountData}
//         selectedStage={selectedStage}
//         // selectedPipeline={selectedPipeline}
//         selectedPipeline={activePipeline}
//         selectedtemp={selctedJobTemp}
//         jobName={jobName}
//         description={description}
//         username={user?.username}
//         combinedAssigneesValues={combinedValues}
//         priority={priority}
//         absoluteDate={absoluteDate}
//         startsin={startsin}
//         startsInDuration={startsInDuration}
//         duein={duein}
//         dueinduration={dueinduration}
//         jobDrwerClose={onClose}
//         startDate={startDate}
//         dueDate={dueDate}
//         setDrawerOpen={setAutomationDrawerOpen}
//         resetForm={resetForm}
//         clientFacingStatus={clientFacingStatus}
//         jobnameforclient={inputText}
//         clientfacingstatus={selectedJob?.value || null}
//         clientfacingDescription={clientDescription}
//       />
//     </LocalizationProvider>
//   );
// };

// export default JobDrawer;


import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { templateAPI, jobAPI, accountsAPI } from "../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { X } from "lucide-react";

// shadcn/ui components
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

// Custom components
import AccountMultiSelectDropdown from "../../components/AccountMultiSelectDropdown";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import ShortcodeTextField from "../../components/ShortcodeTextField";
import AutomationDrawer from "./AutomationDrawer";

const JobDrawer = ({ open, onClose, fetchJobData, selectedPipeline }) => {
  console.log("selectedPipeline in JobDrawer:", selectedPipeline);
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  
  // States
  const [selectedaccount, setSelectedaccount] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTemplate, setjobTemplate] = useState([]);
  const [selctedJobTemp, setSelectedJobTemp] = useState(null);
  const [pipelineValue, setPipelineValue] = useState(null);
  const [jobName, setJobName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startsin, setstartsin] = useState(0);
  const [duein, setduein] = useState(0);
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  const [dueDate, setDueDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [clientDescription, setClientDescription] = useState("");
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [stages, setStages] = useState([]);
  const [stagesLoading, setStagesLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [stageAutomations, setStageAutomations] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [pipelineSearchOpen, setPipelineSearchOpen] = useState(false);
  const [stageSearchOpen, setStageSearchOpen] = useState(false);
  const [jobTemplateSearchOpen, setJobTemplateSearchOpen] = useState(false);
  const [statusSearchOpen, setStatusSearchOpen] = useState(false);
useEffect(() => {
  if (selectedPipeline) {
    setPipelineValue(selectedPipeline);
  }
}, [selectedPipeline]);
  // Refs
  const descriptionFieldRef = useRef(null);
  const textFieldRef = useRef(null);

  const activePipeline = selectedPipeline || pipelineValue;
  const selectedOption = "contacts";
console.log("active pipeline",activePipeline)
  // Shortcuts
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
      setFilteredShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (activePipeline?._id) {
      fetchStages(activePipeline._id);
    } else {
      setStages([]);
      setSelectedStage(null);
    }
  }, [activePipeline?._id]);

  // Fetch functions
  const fetchPipelines = async (userId) => {
    setLoading(true);
    try {
      const response = await templateAPI.getPipelinesByUser(userId);
      console.log("Fetched pipelines:", response.data.pipeline);
      setPipelines(response.data.pipeline || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pipelines");
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async (pipelineId) => {
    setStagesLoading(true);
    try {
      const res = await templateAPI.getPipelineStages(pipelineId);
      const fetchedStages = res.data.data.stages || [];
      setStages(fetchedStages);
      console.log("njdsbhjbvaga",fetchedStages)
      if (fetchedStages.length > 0) {
        setSelectedStage(fetchedStages[0]);
      } else {
        setSelectedStage(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stages");
    } finally {
      setStagesLoading(false);
    }
  };

  const fetchJobtemp = async () => {
    try {
      const { data } = await templateAPI.getAllJobTemplates();
      setjobTemplate(data.JobTemplates || data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchClientFacingJobsData = async () => {
    try {
      const response = await templateAPI.getAllJobStatus();
      setClientFacingJobs(response.data.clientFacingJobStatues || []);
    } catch (error) {
      console.error("Error fetching client facing jobs:", error);
      toast.error("Failed to fetch client facing jobs");
    }
  };


  // Effects
  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchPipelines(user.id);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (selectedPipeline?._id) {
      fetchStages(selectedPipeline._id);
    }
  }, [selectedPipeline]);

  useEffect(() => {
    fetchJobtemp();
    fetchClientFacingJobsData();
    // fetchAccountData();
  }, []);

  // Handlers
  const handlePipelineChange = (pipelineId) => {
    const newPipeline = pipelines.find(p => p._id === pipelineId);
    setPipelineValue(newPipeline);
    if (newPipeline?._id) {
      fetchStages(newPipeline._id);
    } else {
      setStages([]);
      setSelectedStage(null);
    }
  };

  const handleJobtemp = async (templateId) => {
    const selectedOption = jobTemplate.find(temp => temp._id === templateId);
    setSelectedJobTemp(selectedOption);

    if (!templateId) return;

    try {
      const res = await templateAPI.getJobTemplateById(templateId);
      const template = res.data?.jobTemplate || res.data;
      setJobName(template.jobname || "");
      setDescription(template.description || "");
      setPriority(template.priority || "Medium");
      setClientFacingStatus(template.showinclientportal || false);
      setInputText(template.jobnameforclient || template.jobname || "");
      setClientDescription(template.clientfacingDescription || "");

      if (template.clientfacingstatus && clientFacingJobs.length > 0) {
        const matchedStatus = clientFacingJobs.find(
          (status) => status._id === template.clientfacingstatus
        );
        if (matchedStatus) {
          setSelectedJob(matchedStatus);
        }
      }

      if (template.jobassignees?.length > 0) {
        const mappedUsers = template.jobassignees.map((user) => ({
          label: user.username,
          value: user._id,
        }));
        setSelectedUser(mappedUsers);
        setCombinedValues(mappedUsers.map((u) => u.value));
      }

      if (template.absolutedates) {
        setAbsoluteDates(true);
        setStartDate(template.startdate ? dayjs(template.startdate) : null);
        setDueDate(template.enddate ? dayjs(template.enddate) : null);
      } else {
        setAbsoluteDates(false);
        setstartsin(template.startsin || 0);
        setduein(template.duein || 0);
        setStartsInDuration(template.startsinduration || "Days");
        setdueinduration(template.dueinduration || "Days");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job template details");
    }
  };

  const handleUserChange = (users) => {
    setSelectedUser(users);
    setCombinedValues(users.map((u) => u.value));
  };

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };

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
      }
    }, 0);
    setShowDropdownClientJob(false);
  };

  const createJobMutation = useMutation({
    mutationFn: (jobData) => jobAPI.createJob(jobData),
    onSuccess: (response) => {
      if (response?.data) {
        toast.success("Job created successfully!");
        queryClient.invalidateQueries(["jobs-all"]);
        handleClose();
        resetForm();
      }
    },
    onError: (error) => {
      console.error("Failed to create job:", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    },
  });

  const handleSaveJob = async () => {
    if (!activePipeline) {
      toast.error("Please select a pipeline");
      return;
    }

    if (!selectedStage) {
      toast.error("Please select a stage");
      return;
    }

    if (!jobName.trim()) {
      toast.error("Please enter a job name");
      return;
    }

    if (selectedaccount.length === 0) {
      toast.error("Please select at least one account");
      return;
    }

    const stage = stages.find((s) => s._id === selectedStage._id);
console.log("stages for the job drawer",stages)
    if (stage?.automations && stage.automations.length > 0) {
      setStageAutomations(stage.automations);
      console.log("stage automations",stage.automations)
      const jobDataForAutomation = {
        accounts: selectedaccount.map((acc) => acc.value || acc),
        stageid: selectedStage._id,
        pipeline: activePipeline._id,
        templatename: selctedJobTemp?.value || null,
        jobname: jobName,
        jobassignees: combinedValues,
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        showinclientportal: clientFacingStatus,
        jobnameforclient: jobName,
        clientfacingstatus: selectedJob?.value,
        clientfacingDescription: clientDescription,
        startdate: absoluteDate && startDate ? startDate.toISOString() : null,
        enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
      };
      window.tempJobData = jobDataForAutomation;
      console.log("jobDataForAutomation",jobDataForAutomation)
      setAutomationDrawerOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const jobData = {
        accounts: selectedaccount.map((acc) => acc.value || acc),
        stageid: selectedStage._id,
        pipeline: activePipeline._id,
        templatename: selctedJobTemp?.value || null,
        jobname: jobName,
        jobassignees: combinedValues,
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        showinclientportal: clientFacingStatus,
        jobnameforclient: jobName,
        clientfacingstatus: selectedJob?.value,
        clientfacingDescription: clientDescription,
        startdate: absoluteDate && startDate ? startDate.toISOString() : null,
        enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
      };
      console.log("jobdata",jobData)
      createJobMutation.mutate(jobData);
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedaccount([]);
    setPipelineValue(null);
    setSelectedStage(null);
    setSelectedJobTemp(null);
    setJobName("");
    setSelectedUser([]);
    setCombinedValues([]);
    setPriority("Medium");
    setDescription("");
    setAbsoluteDates(false);
    setstartsin(0);
    setduein(0);
    setStartsInDuration("Days");
    setdueinduration("Days");
    setDueDate(null);
    setStartDate(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  return (
//     <>
//       <div className="fixed inset-0 z-50 overflow-hidden">
//         <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />
//         <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
//             <h2 className="text-base font-semibold">Create Job</h2>
//             <button
//               onClick={handleClose}
//               className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>

//           {/* Content */}
//           <ScrollArea className="flex-1">
//             <div className="p-4 space-y-4">
//               {/* Account */}
//               <AccountMultiSelectDropdown
//                 value={selectedaccount}
//                 onChange={setSelectedaccount}
//               />

//               {/* Pipeline */}
//               <div className="space-y-2">
//                 <Label>Select Pipeline</Label>
//                 <Popover open={pipelineSearchOpen} onOpenChange={setPipelineSearchOpen}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={pipelineSearchOpen}
//                       className="w-full justify-between font-normal"
//                     >
//                       {pipelineValue?.pipelineName || "Select pipeline..."}
//                     </Button>
//                   </PopoverTrigger>
//                  <PopoverContent
//   className="w-[var(--radix-popover-trigger-width)] p-0"
//   align="start"
// >
//                     <Command>
//                       <CommandInput placeholder="Search pipeline..." />
//                       <CommandList>
//                         <CommandEmpty>No pipeline found.</CommandEmpty>
//                         <CommandGroup>
//                           {pipelines.map((pipeline) => (
//                             <CommandItem
//                               key={pipeline._id}
//                               value={pipeline.pipelineName}
//                               onSelect={() => {
//                                 handlePipelineChange(pipeline._id);
//                                 setPipelineSearchOpen(false);
//                               }}
//                             >
//                               {pipeline.pipelineName}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* Stage */}
//               <div className="space-y-2">
//                 <Label>Select Stage</Label>
//                 <Popover open={stageSearchOpen} onOpenChange={setStageSearchOpen}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={stageSearchOpen}
//                       className="w-full justify-between font-normal"
//                       disabled={stages.length === 0}
//                     >
//                       {selectedStage?.name || "Select stage..."}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent
//   className="w-[var(--radix-popover-trigger-width)] p-0"
//   align="start"
// >
//                     <Command>
//                       <CommandInput placeholder="Search stage..." />
//                       <CommandList>
//                         <CommandEmpty>No stage found.</CommandEmpty>
//                         <CommandGroup>
//                           {stages.map((stage) => (
//                             <CommandItem
//                               key={stage._id}
//                               value={stage.name}
//                               onSelect={() => {
//                                 setSelectedStage(stage);
//                                 setStageSearchOpen(false);
//                               }}
//                             >
//                               {stage.name}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* Job Template */}
//               <div className="space-y-2">
//                 <Label>Default job template</Label>
//                 <Popover open={jobTemplateSearchOpen} onOpenChange={setJobTemplateSearchOpen}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={jobTemplateSearchOpen}
//                       className="w-full justify-between font-normal"
//                     >
//                       {selctedJobTemp?.templatename || "Select template..."}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent
//   className="w-[var(--radix-popover-trigger-width)] p-0"
//   align="start"
// >
//                     <Command>
//                       <CommandInput placeholder="Search template..." />
//                       <CommandList>
//                         <CommandEmpty>No template found.</CommandEmpty>
//                         <CommandGroup>
//                           {jobTemplate.map((template) => (
//                             <CommandItem
//                               key={template._id}
//                               value={template.templatename}
//                               onSelect={() => {
//                                 handleJobtemp(template._id);
//                                 setJobTemplateSearchOpen(false);
//                               }}
//                             >
//                               {template.templatename}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* Job Name */}
//               <div className="space-y-2">
//                 <Label>Job Name *</Label>
//                 <Input
//                   value={jobName}
//                   onChange={(e) => setJobName(e.target.value)}
//                   placeholder="Enter job name"
//                 />
//               </div>

//               {/* Job Assignees */}
//               <div className="space-y-2">
//                 <Label>Job Assignees</Label>
//                 <MultiSelectDropdown
//                   value={selectedUser}
//                   onChange={handleUserChange}
//                   placeholder="Select assignees"
//                 />
//               </div>

//               {/* Priority */}
//               <div className="space-y-2">
//                 <Label>Priority</Label>
//                 <Priority
//                   onPriorityChange={handlePriorityChange}
//                   selectedPriority={priority}
//                 />
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label>Description</Label>
//                 <Editor value={description} onChange={handleEditorChange} />
//               </div>

//               {/* Start and Due Date */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <Label>Start and Due Date</Label>
//                   <div className="flex items-center gap-2">
//                     <Switch
//                       checked={absoluteDate}
//                       onCheckedChange={handleAbsolutesDates}
//                     />
//                     <span className="text-sm">Absolute Date</span>
//                   </div>
//                 </div>

//                 {absoluteDate ? (
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="space-y-2">
//                       <Label>Start Date</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={cn(
//                               "w-full justify-start text-left font-normal",
//                               !startDate && "text-muted-foreground"
//                             )}
//                           >
//                             {startDate ? format(startDate.toDate(), "PPP") : "Select date"}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={startDate?.toDate()}
//                             onSelect={(date) => setStartDate(date ? dayjs(date) : null)}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Due Date</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={cn(
//                               "w-full justify-start text-left font-normal",
//                               !dueDate && "text-muted-foreground"
//                             )}
//                           >
//                             {dueDate ? format(dueDate.toDate(), "PPP") : "Select date"}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={dueDate?.toDate()}
//                             onSelect={(date) => setDueDate(date ? dayjs(date) : null)}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-3 gap-3">
//                       <Label className="col-span-1">Start In</Label>
//                       <Input
//                         type="number"
//                         value={startsin}
//                         onChange={(e) => setstartsin(Number(e.target.value))}
//                         className="col-span-1"
//                       />
//                       <Select value={startsInDuration} onValueChange={setStartsInDuration}>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {dayOptions.map((option) => (
//                             <SelectItem key={option.value} value={option.value}>
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="grid grid-cols-3 gap-3">
//                       <Label className="col-span-1">Due In</Label>
//                       <Input
//                         type="number"
//                         value={duein}
//                         onChange={(e) => setduein(Number(e.target.value))}
//                         className="col-span-1"
//                       />
//                       <Select value={dueinduration} onValueChange={setdueinduration}>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {dayOptions.map((option) => (
//                             <SelectItem key={option.value} value={option.value}>
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Client-facing status */}
//               <Separator />
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <Label>Client-facing status</Label>
//                   <div className="flex items-center gap-2">
//                     <Switch
//                       checked={clientFacingStatus}
//                       onCheckedChange={setClientFacingStatus}
//                     />
//                     <span className="text-sm">Show in Client portal</span>
//                   </div>
//                 </div>

//                 {clientFacingStatus && (
//                   <div className="space-y-3">
//                     <ShortcodeTextField
//                       label="Job name for client"
//                       value={inputText}
//                       onChange={(e) => {
//                         const { value, selectionStart } = e.target;
//                         setInputText(value);
//                         setCursorPosition(selectionStart);
//                       }}
//                       placeholder="Job name for client"
//                       inputRef={textFieldRef}
//                       shortcuts={filteredShortcuts}
//                       showShortcutDropdown={showDropdownClientJob}
//                       onToggleShortcutDropdown={() => setShowDropdownClientJob(!showDropdownClientJob)}
//                       onCloseShortcutDropdown={() => setShowDropdownClientJob(false)}
//                       onAddShortcut={handleJobAddShortcut}
//                     />

//                     <div className="space-y-2">
//                       <Label>Status</Label>
//                       <Popover open={statusSearchOpen} onOpenChange={setStatusSearchOpen}>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             role="combobox"
//                             aria-expanded={statusSearchOpen}
//                             className="w-full justify-between font-normal"
//                           >
//                             {selectedJob?.clientfacingName || "Select status..."}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-full p-0" align="start">
//                           <Command>
//                             <CommandInput placeholder="Search status..." />
//                             <CommandList>
//                               <CommandEmpty>No status found.</CommandEmpty>
//                               <CommandGroup>
//                                 {optionstatus.map((status) => (
//                                   <CommandItem
//                                     key={status.value}
//                                     value={status.label}
//                                     onSelect={() => {
//                                       const matched = clientFacingJobs.find(
//                                         (job) => job._id === status.value
//                                       );
//                                       setSelectedJob(matched);
//                                       setStatusSearchOpen(false);
//                                     }}
//                                   >
//                                     <div className="flex items-center gap-2">
//                                       <div
//                                         className="h-3 w-3 rounded-full"
//                                         style={{ backgroundColor: status.clientfacingColour }}
//                                       />
//                                       {status.label}
//                                     </div>
//                                   </CommandItem>
//                                 ))}
//                               </CommandGroup>
//                             </CommandList>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//                     </div>

//                     <ShortcodeTextField
//                       label="Description"
//                       value={clientDescription}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (value.length <= 4000) {
//                           setClientDescription(value);
//                           setCharCount(value.length);
//                         }
//                       }}
//                       placeholder="Description"
//                       multiline
//                       rows={4}
//                       inputRef={descriptionFieldRef}
//                       helperText={`${clientDescription.length}/4000 characters`}
//                       shortcuts={filteredShortcuts}
//                       showShortcutDropdown={showDropdownDescription}
//                       onToggleShortcutDropdown={() => setShowDropdownDescription(!showDropdownDescription)}
//                       onCloseShortcutDropdown={() => setShowDropdownDescription(false)}
//                       onAddShortcut={handleDescriptionAddShortcut}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </ScrollArea>

//           {/* Footer */}
//           <div className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0">
//             <Button
//               variant="outline"
//               onClick={handleClose}
//               disabled={isSaving}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSaveJob}
//               disabled={isSaving}
//               className="bg-primary text-primary-foreground hover:bg-primary/90"
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <AutomationDrawer
//         open={automationDrawerOpen}
//         onClose={() => setAutomationDrawerOpen(false)}
//         automations={stageAutomations}
//         selectedAccounts={selectedaccount.map((acc) => acc.value || acc)}
//         accountData={accountData}
//         selectedStage={selectedStage}
//         selectedPipeline={activePipeline}
//         selectedtemp={selctedJobTemp}
//         jobName={jobName}
//         description={description}
//         username={user?.username}
//         combinedAssigneesValues={combinedValues}
//         priority={priority}
//         absoluteDate={absoluteDate}
//         startsin={startsin}
//         startsInDuration={startsInDuration}
//         duein={duein}
//         dueinduration={dueinduration}
//         jobDrwerClose={onClose}
//         startDate={startDate}
//         dueDate={dueDate}
//         setDrawerOpen={setAutomationDrawerOpen}
//         resetForm={resetForm}
//         clientFacingStatus={clientFacingStatus}
//         jobnameforclient={inputText}
//         clientfacingstatus={selectedJob?._id || null}
//         clientfacingDescription={clientDescription}
//       />
//     </>

<>
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={handleClose}
    />

    {/* Drawer */}
    <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background text-foreground border-l border-border shadow-2xl flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-background">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight">
            Create Job
          </h2>

          <p className="text-xs text-muted-foreground">
            Create and configure a new workflow job
          </p>
        </div>

        <button
          onClick={handleClose}
          className="
            inline-flex items-center justify-center
            h-9 w-9 rounded-md
            text-muted-foreground
            hover:text-foreground
            hover:bg-accent
            transition-colors
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">

          {/* Account */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Account
            </Label>

            <AccountMultiSelectDropdown
              value={selectedaccount}
              onChange={setSelectedaccount}
            />
          </div>

          {/* Pipeline */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Select Pipeline
            </Label>

            <Popover
              open={pipelineSearchOpen}
              onOpenChange={setPipelineSearchOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={pipelineSearchOpen}
                  className="
                    w-full justify-between font-normal
                    bg-background
                    border-border
                    text-foreground
                    hover:bg-accent
                  "
                >
                  {pipelineValue?.pipelineName ||
                    "Select pipeline..."}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="
                  w-[var(--radix-popover-trigger-width)]
                  p-0
                  border-border
                  bg-popover
                  text-popover-foreground
                "
                align="start"
              >
                <Command className="bg-popover">
                  <CommandInput
                    placeholder="Search pipeline..."
                    className="border-border"
                  />

                  <CommandList>
                    <CommandEmpty>
                      No pipeline found.
                    </CommandEmpty>

                    <CommandGroup>
                      {pipelines.map((pipeline) => (
                        <CommandItem
                          key={pipeline._id}
                          value={pipeline.pipelineName}
                          onSelect={() => {
                            handlePipelineChange(
                              pipeline._id
                            );
                            setPipelineSearchOpen(false);
                          }}
                          className="
                            cursor-pointer
                            hover:bg-accent
                          "
                        >
                          {pipeline.pipelineName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Select Stage
            </Label>

            <Popover
              open={stageSearchOpen}
              onOpenChange={setStageSearchOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={stageSearchOpen}
                  disabled={stages.length === 0}
                  className="
                    w-full justify-between font-normal
                    bg-background
                    border-border
                    text-foreground
                    hover:bg-accent
                  "
                >
                  {selectedStage?.name ||
                    "Select stage..."}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="
                  w-[var(--radix-popover-trigger-width)]
                  p-0
                  border-border
                  bg-popover
                  text-popover-foreground
                "
                align="start"
              >
                <Command className="bg-popover">
                  <CommandInput placeholder="Search stage..." />

                  <CommandList>
                    <CommandEmpty>
                      No stage found.
                    </CommandEmpty>

                    <CommandGroup>
                      {stages.map((stage) => (
                        <CommandItem
                          key={stage._id}
                          value={stage.name}
                          onSelect={() => {
                            setSelectedStage(stage);
                            setStageSearchOpen(false);
                          }}
                          className="cursor-pointer hover:bg-accent"
                        >
                          {stage.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Job Template */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Default job template
            </Label>

            <Popover
              open={jobTemplateSearchOpen}
              onOpenChange={setJobTemplateSearchOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={jobTemplateSearchOpen}
                  className="
                    w-full justify-between font-normal
                    bg-background
                    border-border
                    text-foreground
                    hover:bg-accent
                  "
                >
                  {selctedJobTemp?.templatename ||
                    "Select template..."}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="
                  w-[var(--radix-popover-trigger-width)]
                  p-0
                  border-border
                  bg-popover
                  text-popover-foreground
                "
                align="start"
              >
                <Command className="bg-popover">
                  <CommandInput placeholder="Search template..." />

                  <CommandList>
                    <CommandEmpty>
                      No template found.
                    </CommandEmpty>

                    <CommandGroup>
                      {jobTemplate.map((template) => (
                        <CommandItem
                          key={template._id}
                          value={template.templatename}
                          onSelect={() => {
                            handleJobtemp(template._id);
                            setJobTemplateSearchOpen(false);
                          }}
                          className="cursor-pointer hover:bg-accent"
                        >
                          {template.templatename}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Job Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Job Name *
            </Label>

            <Input
              value={jobName}
              onChange={(e) =>
                setJobName(e.target.value)
              }
              placeholder="Enter job name"
              className="
                bg-background
                border-border
                text-foreground
                placeholder:text-muted-foreground
                focus-visible:ring-ring
              "
            />
          </div>

          {/* Job Assignees */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Job Assignees
            </Label>

            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Select assignees"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Priority
            </Label>

            <Priority
              onPriorityChange={
                handlePriorityChange
              }
              selectedPriority={priority}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Description
            </Label>

            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Editor
                value={description}
                onChange={handleEditorChange}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Start and Due Date
              </Label>

              <div className="flex items-center gap-2">
                <Switch
                  checked={absoluteDate}
                  onCheckedChange={
                    handleAbsolutesDates
                  }
                />

                <span className="text-sm text-muted-foreground">
                  Absolute Date
                </span>
              </div>
            </div>

            {absoluteDate ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label>Start Date</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          `
                          w-full justify-start
                          text-left font-normal
                          bg-background
                          border-border
                          hover:bg-accent
                          `,
                          !startDate &&
                            "text-muted-foreground"
                        )}
                      >
                        {startDate
                          ? format(
                              startDate.toDate(),
                              "PPP"
                            )
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0 border-border bg-popover">
                      <Calendar
                        mode="single"
                        selected={startDate?.toDate()}
                        onSelect={(date) =>
                          setStartDate(
                            date
                              ? dayjs(date)
                              : null
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label>Due Date</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          `
                          w-full justify-start
                          text-left font-normal
                          bg-background
                          border-border
                          hover:bg-accent
                          `,
                          !dueDate &&
                            "text-muted-foreground"
                        )}
                      >
                        {dueDate
                          ? format(
                              dueDate.toDate(),
                              "PPP"
                            )
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0 border-border bg-popover">
                      <Calendar
                        mode="single"
                        selected={dueDate?.toDate()}
                        onSelect={(date) =>
                          setDueDate(
                            date
                              ? dayjs(date)
                              : null
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 items-center">
                  <Label>Start In</Label>

                  <Input
                    type="number"
                    value={startsin}
                    onChange={(e) =>
                      setstartsin(
                        Number(e.target.value)
                      )
                    }
                  />

                  <Select
                    value={startsInDuration}
                    onValueChange={
                      setStartsInDuration
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {dayOptions.map(
                        (option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3 items-center">
                  <Label>Due In</Label>

                  <Input
                    type="number"
                    value={duein}
                    onChange={(e) =>
                      setduein(
                        Number(e.target.value)
                      )
                    }
                  />

                  <Select
                    value={dueinduration}
                    onValueChange={
                      setdueinduration
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {dayOptions.map(
                        (option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Client Facing */}
          <Separator className="bg-border" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Client-facing status
              </Label>

              <div className="flex items-center gap-2">
                <Switch
                  checked={clientFacingStatus}
                  onCheckedChange={
                    setClientFacingStatus
                  }
                />

                <span className="text-sm text-muted-foreground">
                  Show in Client portal
                </span>
              </div>
            </div>

            {clientFacingStatus && (
              <div className="space-y-4">

                {/* Client Job Name */}
                <ShortcodeTextField
                  label="Job name for client"
                  value={inputText}
                  onChange={(e) => {
                    const {
                      value,
                      selectionStart,
                    } = e.target;

                    setInputText(value);
                    setCursorPosition(
                      selectionStart
                    );
                  }}
                  placeholder="Job name for client"
                  inputRef={textFieldRef}
                  shortcuts={filteredShortcuts}
                  showShortcutDropdown={
                    showDropdownClientJob
                  }
                  onToggleShortcutDropdown={() =>
                    setShowDropdownClientJob(
                      !showDropdownClientJob
                    )
                  }
                  onCloseShortcutDropdown={() =>
                    setShowDropdownClientJob(
                      false
                    )
                  }
                  onAddShortcut={
                    handleJobAddShortcut
                  }
                />

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>

                  <Popover
                    open={statusSearchOpen}
                    onOpenChange={
                      setStatusSearchOpen
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={
                          statusSearchOpen
                        }
                        className="
                          w-full justify-between font-normal
                          bg-background
                          border-border
                          hover:bg-accent
                        "
                      >
                        {selectedJob?.clientfacingName ||
                          "Select status..."}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="
                        w-full p-0
                        border-border
                        bg-popover
                      "
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search status..." />

                        <CommandList>
                          <CommandEmpty>
                            No status found.
                          </CommandEmpty>

                          <CommandGroup>
                            {optionstatus.map(
                              (status) => (
                                <CommandItem
                                  key={status.value}
                                  value={
                                    status.label
                                  }
                                  onSelect={() => {
                                    const matched =
                                      clientFacingJobs.find(
                                        (job) =>
                                          job._id ===
                                          status.value
                                      );

                                    setSelectedJob(
                                      matched
                                    );

                                    setStatusSearchOpen(
                                      false
                                    );
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{
                                        backgroundColor:
                                          status.clientfacingColour,
                                      }}
                                    />

                                    {status.label}
                                  </div>
                                </CommandItem>
                              )
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Client Description */}
                <ShortcodeTextField
                  label="Description"
                  value={clientDescription}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    if (
                      value.length <= 4000
                    ) {
                      setClientDescription(
                        value
                      );

                      setCharCount(
                        value.length
                      );
                    }
                  }}
                  placeholder="Description"
                  multiline
                  rows={4}
                  inputRef={
                    descriptionFieldRef
                  }
                  helperText={`${clientDescription.length}/4000 characters`}
                  shortcuts={filteredShortcuts}
                  showShortcutDropdown={
                    showDropdownDescription
                  }
                  onToggleShortcutDropdown={() =>
                    setShowDropdownDescription(
                      !showDropdownDescription
                    )
                  }
                  onCloseShortcutDropdown={() =>
                    setShowDropdownDescription(
                      false
                    )
                  }
                  onAddShortcut={
                    handleDescriptionAddShortcut
                  }
                />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0 bg-background">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSaveJob}
          disabled={isSaving}
          className="
            bg-primary
            text-primary-foreground
            hover:bg-primary/90
          "
        >
          {isSaving
            ? "Saving..."
            : "Save"}
        </Button>
      </div>
    </div>
  </div>

  {/* Automation Drawer */}
  <AutomationDrawer
    open={automationDrawerOpen}
    onClose={() =>
      setAutomationDrawerOpen(false)
    }
    automations={stageAutomations}
    selectedAccounts={selectedaccount.map(
      (acc) => acc.value || acc
    )}
    accountData={accountData}
    selectedStage={selectedStage}
    selectedPipeline={activePipeline}
    selectedtemp={selctedJobTemp}
    jobName={jobName}
    description={description}
    username={user?.username}
    combinedAssigneesValues={combinedValues}
    priority={priority}
    absoluteDate={absoluteDate}
    startsin={startsin}
    startsInDuration={startsInDuration}
    duein={duein}
    dueinduration={dueinduration}
    jobDrwerClose={onClose}
    startDate={startDate}
    dueDate={dueDate}
    setDrawerOpen={setAutomationDrawerOpen}
    resetForm={resetForm}
    clientFacingStatus={clientFacingStatus}
    jobnameforclient={inputText}
    clientfacingstatus={
      selectedJob?._id || null
    }
    clientfacingDescription={
      clientDescription
    }
  />
</>
  );
};

export default JobDrawer;