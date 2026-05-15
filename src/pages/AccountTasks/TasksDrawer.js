// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Autocomplete,
//   TextField,
//   CircularProgress,
//   Grid,
//   FormControlLabel,
//   Switch,
//   Checkbox,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { useQuery } from "@tanstack/react-query";
// import Cookies from "js-cookie";
// import { jobAPI, accountsAPI, templateAPI,accountTasksAPI } from "../../services/api"; // adjust path if needed
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { toast } from "react-toastify";
// import Status from "../../components/Status";
// import Priority from "../../components/Priority";
// import Editor from "../../components/Editor";
// import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
// import MultiSelectDropdown from "../../components/MultiSelectDropdown";
// import { useAuth } from "../../context/AuthContext";
// const TasksDrawer = ({ open, onClose }) => {
//   const {user} = useAuth();
//   const [selectedaccount, setSelectedaccount] = useState(null);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [accountOptions, setAccountOptions] = useState([]);
//   const [taskTemplates, setTaskTemplates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedtemp, setselectedTemp] = useState(null);
//   const [selectedUser, setSelectedUser] = useState([]);
//   const [combinedValues, setCombinedValues] = useState([]);
//   const [templatename, settemplatename] = useState("");
//   const [priority, setPriority] = useState("Medium");
//   const [status, setStatus] = useState("No status");
//   const [description, setDescription] = useState("");

//   const [selectedTags, setSelectedTags] = useState([]);
//   const [combinedTagsValues, setCombinedTagsValues] = useState([]);
//   const [startDate, setStartDate] = useState(null);
//   const [dueDate, setDueDate] = useState(null);
//   const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
//   const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);
//   const [checkedSubtasks, setCheckedSubtasks] = useState([]);
//   const [saving, setSaving] = useState(false);
//   useEffect(() => {
//   const fetchAccounts = async () => {
//     try {
//       setLoading(true);

//       let res;

//       // ✅ ROLE BASED API
//       if (user?.role === "team_member") {
//         res = await accountsAPI.getAccountsByTeamMember(true);
//       } else {
//         res = await accountsAPI.getAccountNamesByStatus(true);
//       }

//       const list = res.data.accountlist || [];

//       const formatted = list.map((acc) => ({
//         label: acc.accountName,
//         value: acc._id,
//       }));

//       setAccountOptions(formatted);

//       // ✅ COOKIE HANDLING
//       const cookieAccountId = Cookies.get("accountId");
//       const cookieAccountName = Cookies.get("accountName");

//       if (cookieAccountId && cookieAccountName) {
//         const matched = formatted.find(
//           (acc) => acc.value === cookieAccountId
//         );

//         if (matched) {
//           setSelectedaccount(matched);
//         } else {
//           // fallback if not in list
//           setSelectedaccount({
//             label: cookieAccountName,
//             value: cookieAccountId,
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch accounts", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (open && user) fetchAccounts();
// }, [open, user]);
//   const handleAccountChange = (value) => {
//     setSelectedaccount(value);
//   };
//   // ✅ Fetch jobs based on selected account (using value instead of _id)
//   const { data: jobs = [], isLoading: jobsLoading } = useQuery({
//     queryKey: ["jobs-by-account", selectedaccount?.value],
//     queryFn: async () => {
//       if (!selectedaccount?.value) return [];

//       const jobRes = await jobAPI.getJobsByAccountIds(
//         selectedaccount.value, // ✅ FIXED
//         true,
//       );

//       return jobRes.data.jobList || [];
//     },
//     enabled: !!selectedaccount?.value,
//   });
//   console.log("jobs per pieplien", jobs);
//   // ✅ Convert jobs to Autocomplete options
//   const jobsoptions = jobs.map((job) => ({
//     value: job._id,
//     label: job.Name,
//     group: job.Pipeline || "Others",
//   }));

//   // ✅ Handle job change
//   const handleJobChange = (job) => {
//     setSelectedJob(job);
//   };
//   const fetchTaskTemplates = async () => {
//     try {
//       const res = await templateAPI.getAllTaskTemplates();
//       setTaskTemplates(res.data.TaskTemplates || []);
//     } catch (error) {
//       console.error("Error fetching templates:", error);
//     }
//   };
//   const taskTemplateOptions = taskTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));
//   useEffect(() => {
//     fetchTaskTemplates();
//   }, []);
//   const handleStatusChange = (status) => {
//     setStatus(status);
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
//   const handleTagsChange = (tags) => {
//     setSelectedTags(tags); // UI (chips)
//     setCombinedTagsValues(tags.map((t) => t.value)); // payload (ids)
//   };

//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };
//   const handleDueDateChange = (date) => {
//     setDueDate(date);
//   };

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
//   const handletemp = async (selectedOption) => {
//     setselectedTemp(selectedOption);

//     if (!selectedOption?.value) return;

//     try {
//       const res = await templateAPI.getTaskTemplateById(selectedOption.value);
//       const template = res.data?.data;

//       settemplatename(template.templatename || "");
//       setStatus(template.status || "No status");
//       setPriority(template.priority || "Medium");
//       setDescription(template.description || "");

//       // setCombinedValues(data.taskassignees || []);
//       const assignees = template.taskassignees || [];

//       // convert API → dropdown format
//       const formattedUsers = assignees.map((user) => ({
//         value: user._id,
//         label: user.username,
//       }));

//       setSelectedUser(formattedUsers); // ✅ for UI
//       setCombinedValues(assignees.map((u) => u._id)); // ✅ for payload

//       setSubtasks(template.subtasks || [{ id: "1", text: "" }]);
//       setCheckedSubtasks(
//         template.subtasks?.filter((s) => s.checked).map((s) => s.id) || [],
//       );

//       setSubtaskSwitch(template.issubtaskschecked || false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load job template details");
//     }
//   };
//   const resetForm = () => {
//   setSelectedaccount(null);
//   setSelectedJob(null);
//   setselectedTemp(null);
//   setSelectedUser([]);
//   setCombinedValues([]);
//   settemplatename("");
//   setPriority("Medium");
//   setStatus("No status");
//   setDescription("");
//   setSelectedTags([]);
//   setCombinedTagsValues([]);
//   setStartDate(null);
//   setDueDate(null);
//   setSubtaskSwitch(false);
//   setSubtasks([{ id: "1", text: "" }]);
//   setCheckedSubtasks([]);
// };
//   const handleCreateTask = async () => {
//   try {
//     // 🔹 Validation (basic)
//     if (!selectedaccount?.value) {
//       toast.error("Please select account");
//       return;
//     }

//     if (!templatename) {
//       toast.error("Please enter task name");
//       return;
//     }

//     // 🔹 Prepare payload
//     const payload = {
//       accounts: selectedaccount?.value,
//       job: selectedJob?.value || null,

//       templatename: selectedtemp?.value,
//       taskname: templatename,
//       status,
//       priority,
//       description,

//       taskassignees: combinedValues, // user ids
//       tasktags: combinedTagsValues, // tag ids
//       // Absolute Dates
//        startdate: startDate,
//       enddate: dueDate,
//       // Subtasks
//       issubtaskschecked: SubtaskSwitch,
//       subtasks: subtasks.map((s) => ({
//         id: s.id,
//         text: s.text,
//         checked: checkedSubtasks.includes(s.id),
//       })),
//     };

//     console.log("CREATE TASK PAYLOAD 👉", payload);

//     // 🔹 API Call
//     // await accountTasksAPI.createTask(payload);
// setSaving(true);
// await accountTasksAPI.createTask(payload);
// setSaving(false);
//     toast.success("Task created successfully 🎉");

//     // 🔹 Reset form (optional)
//     resetForm();

//     // 🔹 Close drawer
//     onClose();
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to create task");
//   }
// };
//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: 500,
//           display: "flex",
//           flexDirection: "column",
//           // bgcolor: "#f9fafb", // light background
//         },
//       }}
//     >
//       {/* Header */}
//       <Box
//         sx={{
//           p: 2,
//           borderBottom: "1px solid #e0e0e0",
//           position: "sticky",
//           top: 0,
//           bgcolor: "#fff",
//           zIndex: 10,
//         }}
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//       >
//         <Typography variant="h6" fontWeight={600}>
//           Create Task
//         </Typography>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       {/* Content */}
//       <Box
//         sx={{
//           px: 2,
//           py: 1.5,
//           flex: 1,
//           overflowY: "auto",
//         }}
//       >
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <Box display="flex" flexDirection="column" gap={2}>
//             {/* Account */}
//             <Autocomplete
//               size="small"
//               options={accountOptions}
//               value={selectedaccount}
//               onChange={(e, value) => handleAccountChange(value)}
//               isOptionEqualToValue={(option, value) =>
//                 option?.value === value?.value
//               }
//               getOptionLabel={(option) => option?.label || ""}
//               loading={loading}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   placeholder="Search Account"
//                   sx={{ bgcolor: "#fff", borderRadius: 2 }}
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {loading && <CircularProgress size={18} />}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//             />

//             {/* Job */}
//             <Autocomplete
//               size="small"
//               options={jobsoptions}
//               groupBy={(option) => option.group}
//               value={selectedJob}
//               loading={jobsLoading}
//               disabled={!selectedaccount?.value}
//               onChange={(event, newValue) => handleJobChange(newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   placeholder="Select Job"
//                   sx={{ bgcolor: "#fff", borderRadius: 2 }}
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {jobsLoading && <CircularProgress size={18} />}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               getOptionLabel={(option) => option.label || ""}
//               isOptionEqualToValue={(option, value) =>
//                 option?.value === value?.value
//               }
//             />

//             {/* Template */}
//             <Autocomplete
//               size="small"
//               options={taskTemplateOptions}
//               value={selectedtemp}
//               onChange={(event, newValue) => handletemp(newValue)}
//               isOptionEqualToValue={(option, value) =>
//                 option.value === value.value
//               }
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   placeholder="Select Template"
//                   sx={{ bgcolor: "#fff", borderRadius: 2 }}
//                 />
//               )}
//             />

//             {/* Section Card */}
//             <Box>
//               <Grid
//                 container
//                 rowSpacing={3}
//                 columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//               >
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Status
//                     onStatusChange={handleStatusChange}
//                     selectedStatus={status}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <MultiSelectDropdown
//                     value={selectedUser}
//                     onChange={handleUserChange}
//                     placeholder="Assignees"
//                   />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Priority
//                     onPriorityChange={handlePriorityChange}
//                     selectedPriority={priority}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <TextField
//                     size="small"
//                     fullWidth
//                     value={templatename}
//                     placeholder="Task Name"
//                     onChange={(e) => settemplatename(e.target.value)}
//                   />
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* Editor */}
//             <Box>
//               <Editor onChange={handleEditorChange} value={description} />
//             </Box>

//             <TagsMultiSelectDropDown
//               value={selectedTags}
//               onChange={handleTagsChange}
//               placeholder="Tags"
//             />

//             {/* Dates */}
//             <Box

//             >

//                 <Grid container spacing={2} mt={1}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <DatePicker
//                       label="Start"
//                       value={startDate}
//                       onChange={handleStartDateChange}
//                       slotProps={{
//                         textField: { size: "small", fullWidth: true },
//                       }}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <DatePicker
//                       label="Due"
//                       value={dueDate}
//                       onChange={handleDueDateChange}
//                       slotProps={{
//                         textField: { size: "small", fullWidth: true },
//                       }}
//                     />
//                   </Grid>
//                 </Grid>

//             </Box>

//             {/* Subtasks */}
//             <Box
//               sx={{
//                 p: 2,
//                 bgcolor: "#fff",
//                 borderRadius: 3,
//               }}
//             >
//               <Box display="flex" justifyContent="space-between">
//                 <Typography fontWeight={500}>Subtasks</Typography>
//                 <Switch
//                   checked={SubtaskSwitch}
//                   onChange={(e) => setSubtaskSwitch(e.target.checked)}
//                 />
//               </Box>

//               {SubtaskSwitch &&
//                 subtasks.map((s) => (
//                   <Box key={s.id} display="flex" gap={1} mt={1}>
//                     <Checkbox
//                       checked={checkedSubtasks.includes(s.id)}
//                       onChange={() => handleCheckboxChange(s.id)}
//                     />
//                     <TextField
//                       size="small"
//                       fullWidth
//                       value={s.text}
//                       onChange={(e) =>
//                         setSubtasks((prev) =>
//                           prev.map((p) =>
//                             p.id === s.id ? { ...p, text: e.target.value } : p,
//                           ),
//                         )
//                       }
//                     />
//                     <IconButton onClick={() => handleDeleteSubtask(s.id)}>
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>
//                 ))}

//               {SubtaskSwitch && (
//                 <Button
//                   variant="outlined"
//                   onClick={handleAddSubtask}
//                   sx={{ mt: 1 }}
//                 >
//                   Add Subtask
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </LocalizationProvider>
//       </Box>

//       {/* Footer */}
//       <Box
//         sx={{
//           p: 2,
//           borderTop: "1px solid #e0e0e0",
//           bgcolor: "#fff",
//           position: "sticky",
//           bottom: 0,
//         }}
//         display="flex"
//         justifyContent="flex-end"
//         gap={2}
//       >
//         <Button variant="outlined" onClick={onClose}>
//           Cancel
//         </Button>
//      <Button variant="contained" onClick={handleCreateTask} disabled={saving}>
//   {saving ? "Saving..." : "Save"}
// </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default TasksDrawer;

import React, { useState, useEffect } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  jobAPI,
  accountsAPI,
  templateAPI,
  accountTasksAPI,
} from "../../services/api";
import { RiDeleteBin6Line } from "react-icons/ri";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import Status from "../../components/Status";
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { Calendar } from "../../components/ui/calendar";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import dayjs from "dayjs";
import SingleSelectDropdown from "../../components/SingleSelectDropdown";
const TasksDrawer = ({ open, onClose }) => {
  const { user } = useAuth();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const [taskTemplates, setTaskTemplates] = useState([]);
 
  const [selectedtemp, setselectedTemp] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [templatename, settemplatename] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("No status");
  const [description, setDescription] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const [saving, setSaving] = useState(false);



  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs-by-account", selectedAccount?.value],
    queryFn: async () => {
      if (!selectedAccount?.value) return [];

      const jobRes = await jobAPI.getJobsByAccountIds(
        selectedAccount.value,
        true,
      );

      return jobRes.data.jobList || [];
    },
    enabled: !!selectedAccount?.value,
  });

  const jobsoptions = jobs.map((job) => ({
    value: job._id,
    label: job.Name,
    group: job.Pipeline || "Others",
  }));



  const fetchTaskTemplates = async () => {
    try {
      const res = await templateAPI.getAllTaskTemplates();
      setTaskTemplates(res.data.TaskTemplates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const taskTemplateOptions = taskTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  useEffect(() => {
    fetchTaskTemplates();
  }, []);

  const handleStatusChange = (status) => {
    setStatus(status);
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

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
    setCombinedTagsValues(tags.map((t) => t.value));
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now().toString(), text: "" }]);
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handletemp = async (selectedOption) => {
    setselectedTemp(selectedOption);

    if (!selectedOption?.value) return;

    try {
      const res = await templateAPI.getTaskTemplateById(selectedOption.value);

      const template = res.data?.data;
console.log("gets task details by task id",template)
      settemplatename(template.templatename || "");
      setStatus(template.status || "No status");
      setPriority(template.priority || "Medium");
      setDescription(template.description || "");

      const assignees = template.taskassignees || [];

      const formattedUsers = assignees.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      setSelectedUser(formattedUsers);
      setCombinedValues(assignees.map((u) => u._id));

      setSubtasks(template.subtasks || [{ id: "1", text: "" }]);

      setCheckedSubtasks(
        template.subtasks?.filter((s) => s.checked).map((s) => s.id) || [],
      );

      setSubtaskSwitch(template.issubtaskschecked || false);
        // ✅ SET DATES
    setStartDate(
      template.startdate
        ? dayjs(template.startdate)
        : null,
    );

    setDueDate(
      template.enddate
        ? dayjs(template.enddate)
        : null,
    );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job template details");
    }
  };

  const resetForm = () => {
    setSelectedAccount(null);
    setSelectedJob(null);
    setselectedTemp(null);
    setSelectedUser([]);
    setCombinedValues([]);
    settemplatename("");
    setPriority("Medium");
    setStatus("No status");
    setDescription("");
    setSelectedTags([]);
    setCombinedTagsValues([]);
    setStartDate(null);
    setDueDate(null);
    setSubtaskSwitch(false);
    setSubtasks([{ id: "1", text: "" }]);
    setCheckedSubtasks([]);
  };

  const handleCreateTask = async () => {
    try {
      if (!selectedAccount?.value) {
        toast.error("Please select account");
        return;
      }

      if (!templatename) {
        toast.error("Please enter task name");
        return;
      }

      const payload = {
        accounts: selectedAccount?.value,
        job: selectedJob?.value || null,

        templatename: selectedtemp?.value,
        taskname: templatename,
        status,
        priority,
        description,

        taskassignees: combinedValues,
        tasktags: combinedTagsValues,

        startdate: startDate,
        enddate: dueDate,

        issubtaskschecked: SubtaskSwitch,

        subtasks: subtasks.map((s) => ({
          id: s.id,
          text: s.text,
          checked: checkedSubtasks.includes(s.id),
        })),
      };

      console.log("CREATE TASK PAYLOAD 👉", payload);

      setSaving(true);

      await accountTasksAPI.createTask(payload);

      setSaving(false);

      toast.success("Task created successfully 🎉");

      resetForm();

      onClose();
    } catch (error) {
      console.error(error);
      setSaving(false);
      toast.error("Failed to create task");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            Create Task
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-5">
            {/* Account */}
            <SingleSelectDropdown
              value={selectedAccount}
              onChange={setSelectedAccount}
            />

            {/* Job */}
            {/* Job */}
<div>
  <Label className="text-sm font-medium">
    Select Job
  </Label>

  <Select
    value={
      selectedJob
        ? String(selectedJob.value)
        : undefined
    }
    onValueChange={(value) => {
      const selected = jobsoptions.find(
        (job) =>
          String(job.value) === String(value),
      );

      console.log("SELECTED JOB", selected);

      setSelectedJob(selected || null);
    }}
    disabled={!selectedAccount?.value}
  >
    <SelectTrigger className="mt-1 w-full">
      <SelectValue placeholder="Select Job" />
    </SelectTrigger>

    <SelectContent className="w-[550px]">
      {Object.entries(
        jobsoptions.reduce((acc, job) => {
          if (!acc[job.group]) {
            acc[job.group] = [];
          }

          acc[job.group].push(job);

          return acc;
        }, {}),
      ).map(([group, items]) => (
        <div key={group}>
          {/* Group Heading */}
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {group}
          </div>

          {/* Items */}
          {items.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              className="min-h-[50px] items-start py-2"
            >
              <div className="break-words whitespace-normal leading-5 pr-6">
                {option.label}
              </div>
            </SelectItem>
          ))}
        </div>
      ))}
    </SelectContent>
  </Select>
</div>

            {/* Template */}
            <div>
              <Label className="text-sm font-medium">Select Template</Label>

              <Select
                value={selectedtemp?.value || ""}
                onValueChange={(value) => {
                  const selected =
                    taskTemplateOptions.find((temp) => temp.value === value) ||
                    null;

                  handletemp(selected);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>

                <SelectContent>
                  {taskTemplateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Status + Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Status
                onStatusChange={handleStatusChange}
                selectedStatus={status}
              />

              <MultiSelectDropdown
                value={selectedUser}
                onChange={handleUserChange}
                placeholder="Assignees"
              />

              <Priority
                onPriorityChange={handlePriorityChange}
                selectedPriority={priority}
              />

              <Input
                size="small"
                fullWidth
                value={templatename}
                placeholder="Task Name"
                onChange={(e) => settemplatename(e.target.value)}
              />
            </div>

            {/* Editor */}
            <Editor onChange={handleEditorChange} value={description} />

            {/* Tags */}
            <TagsMultiSelectDropDown
              value={selectedTags}
              onChange={handleTagsChange}
              placeholder="Tags"
            />

            {/* Dates */}
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <Label className="text-sm font-medium">Start Date</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      {startDate ? (
                        startDate.format("MM/DD/YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate ? startDate.toDate() : undefined}
                      onSelect={(date) =>
                        date && handleStartDateChange(dayjs(date))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Due Date */}
              <div>
                <Label className="text-sm font-medium">Due Date</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !dueDate && "text-muted-foreground",
                      )}
                    >
                      {dueDate ? (
                        dueDate.format("MM/DD/YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate ? dueDate.toDate() : undefined}
                      onSelect={(date) =>
                        date && handleDueDateChange(dayjs(date))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Subtasks */}
            <div className="border border-border rounded-xl p-4 bg-background">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Subtasks</h3>

                <button
                  type="button"
                  onClick={() => setSubtaskSwitch(!SubtaskSwitch)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    SubtaskSwitch ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      SubtaskSwitch ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {SubtaskSwitch && (
                <div className="mt-4 space-y-3">
                  {subtasks.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checkedSubtasks.includes(s.id)}
                        onChange={() => handleCheckboxChange(s.id)}
                        className="h-4 w-4 rounded border-border"
                      />

                      <Input
                        size="small"
                        fullWidth
                        value={s.text}
                        onChange={(e) =>
                          setSubtasks((prev) =>
                            prev.map((p) =>
                              p.id === s.id
                                ? {
                                    ...p,
                                    text: e.target.value,
                                  }
                                : p,
                            ),
                          )
                        }
                      />

                      <button
                        onClick={() => handleDeleteSubtask(s.id)}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSubtask}
                    className="h-9 px-4 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Add Subtask
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateTask}
            disabled={saving}
            className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksDrawer;
