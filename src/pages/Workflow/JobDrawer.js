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
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import CloseIcon from "@mui/icons-material/Close";
// import AccountMultiSelectDropdown from "../../components/AccountMultiSelectDropdown";
// import { useAuth } from "../../context/AuthContext";
// import { templateAPI } from "../../services/api";
// import MultiSelectDropdown from "../../components/AccountMultiSelectDropdown";
// import Priority from "../../components/Priority";
// import Editor from "../../components/Editor";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// const JobDrawer = ({ open, onClose }) => {
//   const [selectedaccount, setSelectedaccount] = useState([]);
//   const { user, loading: authLoading } = useAuth();
//   const [pipelines, setPipelines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [jobTemplate, setjobTemplate] = useState([]);
//   const [selctedJobTemp, setSelectedJobTemp] = useState(null);
//   const [selectedPipeline, setSelectedPipeline] = useState(null);
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

//   // ✅ NEW STATES
//   const [stages, setStages] = useState([]);
//   const [stagesLoading, setStagesLoading] = useState(false);
//   const [selectedStage, setSelectedStage] = useState(null);
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

//   // ================= FETCH STAGES =================
//   const fetchStages = async (pipelineId) => {
//     setStagesLoading(true);
//     try {
//       const res = await templateAPI.getPipelineStages(pipelineId);
//       const fetchedStages = res.data.data.stages || [];

//       setStages(fetchedStages);

//       // ✅ Auto select first stage
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
//     if (selectedPipeline?._id) {
//       fetchStages(selectedPipeline._id);
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
// const handleJobtemp = async (selectedOption) => {
//   setSelectedJobTemp(selectedOption);

//   if (!selectedOption?.value) return;

//   try {
//     const res = await templateAPI.getJobTemplateById(selectedOption.value);
//     const template = res.data?.jobTemplate || res.data;

//     console.log("Full Job Template:", template);

//     // ✅ JOB NAME
//     setJobName(template.jobname || "");

//     // ✅ DESCRIPTION
//     setDescription(template.description || "");

//     // ✅ PRIORITY
//     setPriority(template.priority || "Medium");

//     // ✅ ASSIGNEES
//     if (template.jobassignees?.length > 0) {
//       const mappedUsers = template.jobassignees.map((user) => ({
//         label: user.username,   // ⚠️ username (not name)
//         value: user._id,
//       }));

//       setSelectedUser(mappedUsers);
//       setCombinedValues(mappedUsers.map((u) => u.value));
//     }

//     // ✅ DATE HANDLING
//   if (template.absolutedates) {
//   setAbsoluteDates(true);

//   setStartDate(template.startdate ? dayjs(template.startdate) : null);
//   setDueDate(template.enddate ? dayjs(template.enddate) : null);
// } else {
//   setAbsoluteDates(false);

//   setstartsin(template.startsin || 0);
//   setduein(template.duein || 0);
//   setStartsInDuration(template.startsinduration || "Days");
//   setdueinduration(template.dueinduration || "Days");
// }

//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to load job template details");
//   }
// };
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
//   // Handler function to update state when dropdown value changes
//   const handleStartInDateChange = (event, newValue) => {
//     setStartsInDuration(newValue ? newValue.value : null);
//   };
//   // Handler function to update state when dropdown value changes
//   const handledueindateChange = (event, newValue) => {
//     setdueinduration(newValue ? newValue.value : null);
//   };
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={onClose}
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
//           <IconButton onClick={onClose}>
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
//             <Autocomplete
//               options={pipelines}
//               loading={loading}
//               value={selectedPipeline}
//               onChange={(event, newValue) => setSelectedPipeline(newValue)}
//               getOptionLabel={(option) => option?.pipelineName || ""}
//               isOptionEqualToValue={(option, value) => option._id === value._id}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Pipeline" fullWidth />
//               )}
//             />
//           </Box>

//           {/* ✅ STAGES UI */}

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
//                         onChange={(e) => setstartsin(e.target.value)}
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
//                         onChange={(e) => setduein(e.target.value)}
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
//           <Button variant="outlined" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button variant="contained">Save</Button>
//         </Box>
//       </Drawer>
//     </LocalizationProvider>
//   );
// };

// export default JobDrawer;


import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  CircularProgress,
  Autocomplete,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import AccountMultiSelectDropdown from "../../components/AccountMultiSelectDropdown";
import { useAuth } from "../../context/AuthContext";
import { templateAPI, jobAPI,accountsAPI } from "../../services/api"; // ✅ ADD jobAPI
import MultiSelectDropdown from "../../components/AccountMultiSelectDropdown";
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AutomationDrawer from "./AutomationDrawer";
const JobDrawer = ({ open, onClose, fetchJobData }) => { // ✅ ADD fetchJobData prop
  const [selectedaccount, setSelectedaccount] = useState([]);
  const { user, loading: authLoading } = useAuth();
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTemplate, setjobTemplate] = useState([]);
  const [selctedJobTemp, setSelectedJobTemp] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
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
  const [isSaving, setIsSaving] = useState(false); // ✅ ADD loading state

  // ✅ NEW STATES
  const [stages, setStages] = useState([]);
  const [stagesLoading, setStagesLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  // Add state for automation drawer
const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
const [stageAutomations, setStageAutomations] = useState([]);
const [accountData, setAccountData] = useState([]); 

// Add function to fetch account data for display
const fetchAccountData = async () => {
  try {
    const response = await accountsAPI.getAccountNamesByStatus(true);

    // Axios response → data is inside response.data
    setAccountData(response.data.accountlist || []);
  } catch (error) {
    console.error("Error fetching account data:", error);
  }
};

// Fetch account data on mount
useEffect(() => {
  fetchAccountData();
}, []);

  // ================= FETCH PIPELINES =================
  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchPipelines(user.id);
    }
  }, [authLoading, user]);

  const fetchPipelines = async (userId) => {
    setLoading(true);
    try {
      const response = await templateAPI.getPipelinesByUser(userId);
      setPipelines(response.data.pipeline || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pipelines");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH STAGES =================
  const fetchStages = async (pipelineId) => {
    setStagesLoading(true);
    try {
      const res = await templateAPI.getPipelineStages(pipelineId);
      const fetchedStages = res.data.data.stages || [];

      setStages(fetchedStages);

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

  // ✅ TRIGGER WHEN PIPELINE CHANGES
  useEffect(() => {
    if (selectedPipeline?._id) {
      fetchStages(selectedPipeline._id);
    } else {
      setStages([]);
      setSelectedStage(null);
    }
  }, [selectedPipeline]);

  useEffect(() => {
    fetchJobtemp();
  }, []);

  const fetchJobtemp = async () => {
    try {
      const { data } = await templateAPI.getAllJobTemplates();
      setjobTemplate(data.JobTemplates || data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const jobOptions = jobTemplate.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const handleJobtemp = async (selectedOption) => {
    setSelectedJobTemp(selectedOption);

    if (!selectedOption?.value) return;

    try {
      const res = await templateAPI.getJobTemplateById(selectedOption.value);
      const template = res.data?.jobTemplate || res.data;

      setJobName(template.jobname || "");
      setDescription(template.description || "");
      setPriority(template.priority || "Medium");

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

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };

  const handledueindateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
  };

  // ================= SAVE JOB FUNCTION =================
  // const handleSaveJob = async () => {
  //   // Validation
  //   if (!selectedPipeline) {
  //     toast.error("Please select a pipeline");
  //     return;
  //   }

  //   if (!selectedStage) {
  //     toast.error("Please select a stage");
  //     return;
  //   }

  //   if (!jobName.trim()) {
  //     toast.error("Please enter a job name");
  //     return;
  //   }

  //   if (selectedaccount.length === 0) {
  //     toast.error("Please select at least one account");
  //     return;
  //   }

  //   setIsSaving(true);

  //   try {
  //     // Prepare the job data
  //     const jobData = {
  //       accounts: selectedaccount.map(acc => acc.value || acc), // Handle both formats
  //       stageid: selectedStage._id,
  //       pipeline: selectedPipeline._id,
  //       templatename: selctedJobTemp?.value || null,
  //       jobname: jobName,
  //       jobassignees: combinedValues,
  //       priority: priority,
  //       description: description,
  //       absolutedates: absoluteDate,
  //       startsin: startsin,
  //       startsinduration: startsInDuration,
  //       duein: duein,
  //       dueinduration: dueinduration,
  //       showinclientportal: false, // Add this if needed
  //       jobnameforclient: jobName, // Add this if needed
  //       clientfacingstatus: null, // Add this if needed
  //       clientfacingDescription: "", // Add this if needed
  //       startdate: absoluteDate && startDate ? startDate.toISOString() : null,
  //       enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
  //     };

  //     console.log("Creating job with data:", jobData);

  //     // Use the jobAPI.createJob
  //     const response = await jobAPI.createJob(jobData);

  //     if (response.data) {
  //       toast.success("Job created successfully!");
  //       onClose();
        
  //       // Refresh job list if fetchJobData prop is provided
  //       if (fetchJobData) {
  //         fetchJobData();
  //       }
        
  //       // Reset form
  //       resetForm();
  //     }
  //   } catch (error) {
  //     console.error("Failed to create job:", error);
  //     toast.error(error.response?.data?.message || "Failed to create job");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
// Update handleSaveJob to check for automations
const handleSaveJob = async () => {
  // Validation
  if (!selectedPipeline) {
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

  // Check if selected stage has automations
  const stage = stages.find((s) => s._id === selectedStage._id);
  
  if (stage?.automations && stage.automations.length > 0) {
    // Store automations and open automation drawer
    setStageAutomations(stage.automations);
    
    // Prepare job data to pass to automation drawer
    const jobDataForAutomation = {
      accounts: selectedaccount.map(acc => acc.value || acc),
      stageid: selectedStage._id,
      pipeline: selectedPipeline._id,
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
      showinclientportal: false,
      jobnameforclient: jobName,
      clientfacingstatus: null,
      clientfacingDescription: "",
      startdate: absoluteDate && startDate ? startDate.toISOString() : null,
      enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
    };
    
    // Store job data in state or pass directly
    window.tempJobData = jobDataForAutomation;
    setAutomationDrawerOpen(true);
    return;
  }

  // If no automations, create job directly
  setIsSaving(true);

  try {
    const jobData = {
      accounts: selectedaccount.map(acc => acc.value || acc),
      stageid: selectedStage._id,
      pipeline: selectedPipeline._id,
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
      showinclientportal: false,
      jobnameforclient: jobName,
      clientfacingstatus: null,
      clientfacingDescription: "",
      startdate: absoluteDate && startDate ? startDate.toISOString() : null,
      enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
    };

    const response = await jobAPI.createJob(jobData);

    if (response.data) {
      toast.success("Job created successfully!");
      onClose();
      // if (fetchJobData) {
      //   fetchJobData();
      // }
      resetForm();
    }
  } catch (error) {
    console.error("Failed to create job:", error);
    toast.error(error.response?.data?.message || "Failed to create job");
  } finally {
    setIsSaving(false);
  }
};
  // Reset form function
  const resetForm = () => {
    setSelectedaccount([]);
    setSelectedPipeline(null);
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

  // Handle drawer close with reset
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 700,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #eee",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Create Job</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
          }}
        >
          {/* ACCOUNT */}
          <AccountMultiSelectDropdown
            value={selectedaccount}
            onChange={setSelectedaccount}
          />

          {/* PIPELINE */}
          <Box mt={2}>
            <Autocomplete
              options={pipelines}
              loading={loading}
              value={selectedPipeline}
              onChange={(event, newValue) => setSelectedPipeline(newValue)}
              getOptionLabel={(option) => option?.pipelineName || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} label="Select Pipeline" fullWidth />
              )}
            />
          </Box>

          {/* STAGES UI */}
          <Box mt={2}>
            <Autocomplete
              options={stages}
              loading={stagesLoading}
              value={selectedStage}
              onChange={(event, newValue) => setSelectedStage(newValue)}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Stage"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {stagesLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box mt={2}>
            <Autocomplete
              options={jobOptions}
              value={selctedJobTemp}
              onChange={(e, v) => handleJobtemp(v)}
              size="small"
              sx={{ mt: 1, background: "#fff" }}
              getOptionLabel={(o) => o.label}
              renderInput={(params) => (
                <TextField {...params} label="Default job template" />
              )}
            />
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              size="small"
              label="Job Name"
              required
            />
          </Box>

          <Box mt={2}>
            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Job Assignees"
            />
          </Box>

          <Box mt={2}>
            <Priority
              onPriorityChange={handlePriorityChange}
              selectedPriority={priority}
            />
          </Box>

          <Box mt={2}>
            <Editor value={description} onChange={handleEditorChange} />
          </Box>

          <Box mt={2}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" mb={1}>
                  Start and Due Date
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={absoluteDate}
                      onChange={(event) =>
                        handleAbsolutesDates(event.target.checked)
                      }
                    />
                  }
                  label="Absolute Date"
                />
              </Box>

              {absoluteDate && (
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Due Date"
                      value={dueDate}
                      onChange={handleDueDateChange}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {!absoluteDate && (
                <>
                  <Grid
                    container
                    rowSpacing={3}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    sx={{ mb: 2 }}
                  >
                    <Grid size={{ xs: 12, md: 2 }}>
                      <Typography>Start In</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <TextField
                        size="small"
                        value={startsin}
                        fullWidth
                        type="number"
                        onChange={(e) => setstartsin(Number(e.target.value))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Autocomplete
                        options={dayOptions}
                        size="small"
                        getOptionLabel={(option) => option.label}
                        onChange={handleStartInDateChange}
                        value={
                          dayOptions.find(
                            (option) => option.value === startsInDuration,
                          ) || null
                        }
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    rowSpacing={3}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid size={{ xs: 12, md: 2 }}>
                      <Typography>Due In</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <TextField
                        size="small"
                        value={duein}
                        fullWidth
                        type="number"
                        onChange={(e) => setduein(Number(e.target.value))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Autocomplete
                        options={dayOptions}
                        size="small"
                        getOptionLabel={(option) => option.label}
                        onChange={handledueindateChange}
                        value={
                          dayOptions.find(
                            (option) => option.value === dueinduration,
                          ) || null
                        }
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #eee",
            position: "sticky",
            bottom: 0,
            bgcolor: "background.paper",
          }}
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >
          <Button variant="outlined" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveJob}
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </Box>
      </Drawer>

       <AutomationDrawer
  open={automationDrawerOpen}
  onClose={() => setAutomationDrawerOpen(false)}
  automations={stageAutomations}
  selectedAccounts={selectedaccount.map(acc => acc.value || acc)}
  accountData={accountData}
  selectedStage={selectedStage}
  selectedPipeline={selectedPipeline}
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
  // clientFacingStatus={clientFacingStatus}
  // inputText={inputText}
  // selectedJob={selectedJob}
  // clientDescription={clientDescription}
  startDate={startDate}
  dueDate={dueDate}
  setDrawerOpen={setAutomationDrawerOpen}
  // navigate={navigate}
/>
    </LocalizationProvider>
  );
};

export default JobDrawer;