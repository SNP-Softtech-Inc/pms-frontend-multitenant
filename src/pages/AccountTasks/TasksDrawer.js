import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jobAPI, accountsAPI, templateAPI,accountTasksAPI } from "../../services/api"; // adjust path if needed
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import Status from "../../components/Status";
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { useAuth } from "../../context/AuthContext";
const TasksDrawer = ({ open, onClose }) => {
  const {user} = useAuth();
  const [selectedaccount, setSelectedaccount] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [accountOptions, setAccountOptions] = useState([]);
  const [taskTemplates, setTaskTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
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
  // 🔹 Fetch Accounts
  // useEffect(() => {
  //   const fetchAccounts = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await accountsAPI.getAccountNamesByStatus(true);

  //       const formatted = res.data.accountlist.map((acc) => ({
  //         label: acc.accountName,
  //         value: acc._id,
  //       }));

  //       setAccountOptions(formatted);

  //       // ✅ Get from cookies
  //       const cookieAccountId = Cookies.get("accountId");
  //       const cookieAccountName = Cookies.get("accountName");

  //       if (cookieAccountId && cookieAccountName) {
  //         // Try to find in fetched list
  //         const matched = formatted.find(
  //           (acc) => acc.value === cookieAccountId,
  //         );

  //         if (matched) {
  //           setSelectedaccount(matched);
  //         } else {
  //           // fallback (if not in list)
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

  //   if (open) fetchAccounts();
  // }, [open]);


  useEffect(() => {
  const fetchAccounts = async () => {
    try {
      setLoading(true);

      let res;

      // ✅ ROLE BASED API
      if (user?.role === "team_member") {
        res = await accountsAPI.getAccountsByTeamMember(true);
      } else {
        res = await accountsAPI.getAccountNamesByStatus(true);
      }

      const list = res.data.accountlist || [];

      const formatted = list.map((acc) => ({
        label: acc.accountName,
        value: acc._id,
      }));

      setAccountOptions(formatted);

      // ✅ COOKIE HANDLING
      const cookieAccountId = Cookies.get("accountId");
      const cookieAccountName = Cookies.get("accountName");

      if (cookieAccountId && cookieAccountName) {
        const matched = formatted.find(
          (acc) => acc.value === cookieAccountId
        );

        if (matched) {
          setSelectedaccount(matched);
        } else {
          // fallback if not in list
          setSelectedaccount({
            label: cookieAccountName,
            value: cookieAccountId,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    } finally {
      setLoading(false);
    }
  };

  if (open && user) fetchAccounts();
}, [open, user]);
  const handleAccountChange = (value) => {
    setSelectedaccount(value);
  };
  // ✅ Fetch jobs based on selected account (using value instead of _id)
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs-by-account", selectedaccount?.value],
    queryFn: async () => {
      if (!selectedaccount?.value) return [];

      const jobRes = await jobAPI.getJobsByAccountIds(
        selectedaccount.value, // ✅ FIXED
        true,
      );

      return jobRes.data.jobList || [];
    },
    enabled: !!selectedaccount?.value,
  });
  console.log("jobs per pieplien", jobs);
  // ✅ Convert jobs to Autocomplete options
  const jobsoptions = jobs.map((job) => ({
    value: job._id,
    label: job.Name,
    group: job.Pipeline || "Others",
  }));

  // ✅ Handle job change
  const handleJobChange = (job) => {
    setSelectedJob(job);
  };
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
    setSelectedTags(tags); // UI (chips)
    setCombinedTagsValues(tags.map((t) => t.value)); // payload (ids)
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

      settemplatename(template.templatename || "");
      setStatus(template.status || "No status");
      setPriority(template.priority || "Medium");
      setDescription(template.description || "");


      // setCombinedValues(data.taskassignees || []);
      const assignees = template.taskassignees || [];

      // convert API → dropdown format
      const formattedUsers = assignees.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      setSelectedUser(formattedUsers); // ✅ for UI
      setCombinedValues(assignees.map((u) => u._id)); // ✅ for payload

      setSubtasks(template.subtasks || [{ id: "1", text: "" }]);
      setCheckedSubtasks(
        template.subtasks?.filter((s) => s.checked).map((s) => s.id) || [],
      );

      setSubtaskSwitch(template.issubtaskschecked || false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job template details");
    }
  };
  const resetForm = () => {
  setSelectedaccount(null);
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
    // 🔹 Validation (basic)
    if (!selectedaccount?.value) {
      toast.error("Please select account");
      return;
    }

    if (!templatename) {
      toast.error("Please enter task name");
      return;
    }

    // 🔹 Prepare payload
    const payload = {
      accounts: selectedaccount?.value,
      job: selectedJob?.value || null,

      templatename: selectedtemp?.value,
      taskname: templatename,
      status,
      priority,
      description,

      taskassignees: combinedValues, // user ids
      tasktags: combinedTagsValues, // tag ids
      // Absolute Dates
       startdate: startDate,
      enddate: dueDate,
      // Subtasks
      issubtaskschecked: SubtaskSwitch,
      subtasks: subtasks.map((s) => ({
        id: s.id,
        text: s.text,
        checked: checkedSubtasks.includes(s.id),
      })),
    };

    console.log("CREATE TASK PAYLOAD 👉", payload);

    // 🔹 API Call
    // await accountTasksAPI.createTask(payload);
setSaving(true);
await accountTasksAPI.createTask(payload);
setSaving(false);
    toast.success("Task created successfully 🎉");

    // 🔹 Reset form (optional)
    resetForm();

    // 🔹 Close drawer
    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create task");
  }
};
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 500,
          display: "flex",
          flexDirection: "column",
          // bgcolor: "#f9fafb", // light background
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          bgcolor: "#fff",
          zIndex: 10,
        }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" fontWeight={600}>
          Create Task
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          flex: 1,
          overflowY: "auto",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Account */}
            <Autocomplete
              size="small"
              options={accountOptions}
              value={selectedaccount}
              onChange={(e, value) => handleAccountChange(value)}
              isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
              }
              getOptionLabel={(option) => option?.label || ""}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Account"
                  sx={{ bgcolor: "#fff", borderRadius: 2 }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && <CircularProgress size={18} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Job */}
            <Autocomplete
              size="small"
              options={jobsoptions}
              groupBy={(option) => option.group}
              value={selectedJob}
              loading={jobsLoading}
              disabled={!selectedaccount?.value}
              onChange={(event, newValue) => handleJobChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Job"
                  sx={{ bgcolor: "#fff", borderRadius: 2 }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {jobsLoading && <CircularProgress size={18} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
              }
            />

            {/* Template */}
            <Autocomplete
              size="small"
              options={taskTemplateOptions}
              value={selectedtemp}
              onChange={(event, newValue) => handletemp(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Template"
                  sx={{ bgcolor: "#fff", borderRadius: 2 }}
                />
              )}
            />

            {/* Section Card */}
            <Box>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <Status
                    onStatusChange={handleStatusChange}
                    selectedStatus={status}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <MultiSelectDropdown
                    value={selectedUser}
                    onChange={handleUserChange}
                    placeholder="Assignees"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Priority
                    onPriorityChange={handlePriorityChange}
                    selectedPriority={priority}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={templatename}
                    placeholder="Task Name"
                    onChange={(e) => settemplatename(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Editor */}
            <Box>
              <Editor onChange={handleEditorChange} value={description} />
            </Box>

            <TagsMultiSelectDropDown
              value={selectedTags}
              onChange={handleTagsChange}
              placeholder="Tags"
            />

            {/* Dates */}
            <Box
              
            >
             

              
                <Grid container spacing={2} mt={1}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Start"
                      value={startDate}
                      onChange={handleStartDateChange}
                      slotProps={{
                        textField: { size: "small", fullWidth: true },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Due"
                      value={dueDate}
                      onChange={handleDueDateChange}
                      slotProps={{
                        textField: { size: "small", fullWidth: true },
                      }}
                    />
                  </Grid>
                </Grid>
              
            </Box>

            {/* Subtasks */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderRadius: 3,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={500}>Subtasks</Typography>
                <Switch
                  checked={SubtaskSwitch}
                  onChange={(e) => setSubtaskSwitch(e.target.checked)}
                />
              </Box>

              {SubtaskSwitch &&
                subtasks.map((s) => (
                  <Box key={s.id} display="flex" gap={1} mt={1}>
                    <Checkbox
                      checked={checkedSubtasks.includes(s.id)}
                      onChange={() => handleCheckboxChange(s.id)}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      value={s.text}
                      onChange={(e) =>
                        setSubtasks((prev) =>
                          prev.map((p) =>
                            p.id === s.id ? { ...p, text: e.target.value } : p,
                          ),
                        )
                      }
                    />
                    <IconButton onClick={() => handleDeleteSubtask(s.id)}>
                      <RiDeleteBin6Line />
                    </IconButton>
                  </Box>
                ))}

              {SubtaskSwitch && (
                <Button
                  variant="outlined"
                  onClick={handleAddSubtask}
                  sx={{ mt: 1 }}
                >
                  Add Subtask
                </Button>
              )}
            </Box>
          </Box>
        </LocalizationProvider>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e0e0e0",
          bgcolor: "#fff",
          position: "sticky",
          bottom: 0,
        }}
        display="flex"
        justifyContent="flex-end"
        gap={2}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
     <Button variant="contained" onClick={handleCreateTask} disabled={saving}>
  {saving ? "Saving..." : "Save"}
</Button>
      </Box>
    </Drawer>
  );
};

export default TasksDrawer;
