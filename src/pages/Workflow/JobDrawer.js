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
  FormControlLabel,Chip
} from "@mui/material";
import { useState, useEffect,useRef } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import AccountMultiSelectDropdown from "../../components/AccountMultiSelectDropdown";
import { useAuth } from "../../context/AuthContext";
import { templateAPI, jobAPI, accountsAPI } from "../../services/api"; // ✅ ADD jobAPI
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AutomationDrawer from "./AutomationDrawer";
import ShortcodeTextField from "../../components/ShortcodeTextField"
const JobDrawer = ({ open, onClose, fetchJobData,selectedPipeline = null }) => {
  // ✅ ADD fetchJobData prop
  const [selectedaccount, setSelectedaccount] = useState([]);
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTemplate, setjobTemplate] = useState([]);
  const [selctedJobTemp, setSelectedJobTemp] = useState(null);
  // const [selectedPipeline, setSelectedPipeline] = useState(null);
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
  const [isSaving, setIsSaving] = useState(false); // ✅ ADD loading state
  const [clientFacingStatus, setClientFacingStatus] = useState(false);
const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [clientDescription, setClientDescription] = useState("");
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
    const [cursorPosition, setCursorPosition] = useState(0);
      const [selectedJob, setSelectedJob] = useState(null);
      const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
        const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
        const [showDropdownDescription, setShowDropdownDescription] = useState(false);
     const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
    const [showDropdown, setShowDropdown] = useState(false);
//   useEffect(() => {
//   if (selectedPipeline) {
//     setPipelineValue(selectedPipeline);
//   }
// }, [selectedPipeline]);
useEffect(() => {
  if (selectedPipeline) {
    setPipelineValue(selectedPipeline);
  } else {
    setStages([]);
    setSelectedStage(null);
  }
}, [selectedPipeline]);
  // ✅ NEW STATES
  const [stages, setStages] = useState([]);
  const [stagesLoading, setStagesLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
// Refs
  const descriptionFieldRef = useRef(null);
  const textFieldRef = useRef(null);
  // Add state for automation drawer
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [stageAutomations, setStageAutomations] = useState([]);
  const [accountData, setAccountData] = useState([]);

  // Update shortcuts based on selected option
    useEffect(() => {
      if (selectedOption === "contacts" || selectedOption === "account") {
        const accountShortcuts = [
          { title: "Account Shortcodes", isBold: true },
          { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
          { title: "Date Shortcodes", isBold: true },
          {
            title: "Current day full date",
            isBold: false,
            value: "CURRENT_DAY_FULL_DATE",
          },
          {
            title: "Current day number",
            isBold: false,
            value: "CURRENT_DAY_NUMBER",
          },
          { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
          { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
          {
            title: "Current month number",
            isBold: false,
            value: "CURRENT_MONTH_NUMBER",
          },
          {
            title: "Current month name",
            isBold: false,
            value: "CURRENT_MONTH_NAME",
          },
          { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
          { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
          {
            title: "Last day full date",
            isBold: false,
            value: "LAST_DAY_FULL_DATE",
          },
          { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
          { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
          { title: "Last week", isBold: false, value: "LAST_WEEK" },
          {
            title: "Last month number",
            isBold: false,
            value: "LAST_MONTH_NUMBER",
          },
          { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
          { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
          { title: "Last_year", isBold: false, value: "LAST_YEAR" },
          {
            title: "Next day full date",
            isBold: false,
            value: "NEXT_DAY_FULL_DATE",
          },
          { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
          { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
          { title: "Next week", isBold: false, value: "NEXT_WEEK" },
          {
            title: "Next month number",
            isBold: false,
            value: "NEXT_MONTH_NUMBER",
          },
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
          cursorPosition + shortcut.length + 2,
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
          cursorPosition + shortcut.length + 2,
        );
      }
    }, 0);

    setShowDropdownClientJob(false);
  };
   const handleJobChange = async (event, newValue) => {
      setSelectedJob(newValue);
  
      if (newValue && newValue.value) {
        try {
          const response = await templateAPI.getJobStatusById(newValue.value);
          setClientDescription(
            response.data.clientfacingjobstatuses.clientfacingdescription,
          );
        } catch (error) {
          console.error("Error fetching job status:", error);
        }
      }
    };
  const toggleShortcodeDropdown = (event) => {
    setAnchorElClientJob(event.currentTarget);
    setShowDropdownClientJob(!showDropdownClientJob);
  };

  const toggleDescriptionDropdown = (event) => {
    setAnchorElDecription(event.currentTarget);
    setShowDropdownDescription(!showDropdownDescription);
  };
   const handleCloseDropdown = () => {
    setShowDropdown(false);
    setShowDropdownClientJob(false);
    setShowDropdownDescription(false);
    // setAnchorEl(null);
    setAnchorElClientJob(null);
    setAnchorElDecription(null);
  };
  const handleClientFacing = (checked) => {
    setClientFacingStatus(checked);
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
     useEffect(() => {
        fetchClientFacingJobsData();
       
      }, []);
  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));
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

  // const handleJobtemp = async (selectedOption) => {
  //   setSelectedJobTemp(selectedOption);

  //   if (!selectedOption?.value) return;

  //   try {
  //     const res = await templateAPI.getJobTemplateById(selectedOption.value);
  //     const template = res.data?.jobTemplate || res.data;

  //     setJobName(template.jobname || "");
  //     setDescription(template.description || "");
  //     setPriority(template.priority || "Medium");

  //     if (template.jobassignees?.length > 0) {
  //       const mappedUsers = template.jobassignees.map((user) => ({
  //         label: user.username,
  //         value: user._id,
  //       }));

  //       setSelectedUser(mappedUsers);
  //       setCombinedValues(mappedUsers.map((u) => u.value));
  //     }

  //     if (template.absolutedates) {
  //       setAbsoluteDates(true);
  //       setStartDate(template.startdate ? dayjs(template.startdate) : null);
  //       setDueDate(template.enddate ? dayjs(template.enddate) : null);
  //     } else {
  //       setAbsoluteDates(false);
  //       setstartsin(template.startsin || 0);
  //       setduein(template.duein || 0);
  //       setStartsInDuration(template.startsinduration || "Days");
  //       setdueinduration(template.dueinduration || "Days");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to load job template details");
  //   }
  // };
const handleJobtemp = async (selectedOption) => {
  setSelectedJobTemp(selectedOption);

  if (!selectedOption?.value) return;

  try {
    const res = await templateAPI.getJobTemplateById(selectedOption.value);
    const template = res.data?.jobTemplate || res.data;
console.log("gets job template details",template)
    setJobName(template.jobname || "");
    setDescription(template.description || "");
    setPriority(template.priority || "Medium");

    // ✅ ADD THIS BLOCK
    setClientFacingStatus(template.showinclientportal || false);

    setInputText(template.jobnameforclient || template.jobname || "");
    setClientDescription(template.clientfacingDescription || "");

    if (template.clientfacingstatus && clientFacingJobs.length > 0) {
  const matchedStatus = clientFacingJobs.find(
    (status) => status._id === template.clientfacingstatus
  );

  if (matchedStatus) {
    setSelectedJob({
      value: matchedStatus._id,
      label: matchedStatus.clientfacingName,
      clientfacingColour: matchedStatus.clientfacingColour,
    });
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
  const createJobMutation = useMutation({
    mutationFn: (jobData) => jobAPI.createJob(jobData),

    onSuccess: (response) => {
      if (response?.data) {
        toast.success("Job created successfully!");

        // 🔥 Refresh job list
        queryClient.invalidateQueries(["jobs-all"]);

        onClose();
        resetForm();
      }
    },

    onError: (error) => {
      console.error("Failed to create job:", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    },
  });
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
        accounts: selectedaccount.map((acc) => acc.value || acc),
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
        showinclientportal: clientFacingStatus,
        jobnameforclient: jobName,
        clientfacingstatus: selectedJob.value,
        clientfacingDescription: clientDescription,
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
        accounts: selectedaccount.map((acc) => acc.value || acc),
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
       showinclientportal: clientFacingStatus,
        jobnameforclient: jobName,
        clientfacingstatus: selectedJob.value,
        clientfacingDescription: clientDescription,
        startdate: absoluteDate && startDate ? startDate.toISOString() : null,
        enddate: absoluteDate && dueDate ? dueDate.toISOString() : null,
      };

      // 🔥 ONLY THIS LINE CHANGED
      createJobMutation.mutate(jobData);
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
            {/* <Autocomplete
              options={pipelines}
              loading={loading}
              value={selectedPipeline}
              onChange={(event, newValue) => setSelectedPipeline(newValue)}
              getOptionLabel={(option) => option?.pipelineName || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} label="Select Pipeline" fullWidth />
              )}
            /> */}
            <Autocomplete
  options={pipelines}
  loading={loading}
  value={pipelineValue}
  onChange={(event, newValue) => setPipelineValue(newValue)}
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
          <Box mt={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" mb={1}>
                Client-facing status
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(event) =>
                      handleClientFacing(event.target.checked)
                    }
                    checked={clientFacingStatus}
                    color="primary"
                  />
                }
                label="Show in Client portal"
              />
            </Box>
             <Box mb={2}>
                                {clientFacingStatus && (
                                  <>
                                    <ShortcodeTextField
                                      label="Job name for client"
                                      value={inputText}
                                      onChange={(e) => {
                                        const { value, selectionStart } = e.target;
                                        setInputText(value);
                                        setCursorPosition(selectionStart);
                                      }}
                                      placeholder="Job name for client"
                                      inputRef={textFieldRef}
                                      onClick={(e) =>
                                        setCursorPosition(e.target.selectionStart)
                                      }
                                      // shortcuts
                                      shortcuts={filteredShortcuts}
                                      showShortcutDropdown={showDropdownClientJob}
                                      anchorElShortcut={anchorElClientJob}
                                      onToggleShortcutDropdown={toggleShortcodeDropdown}
                                      onCloseShortcutDropdown={handleCloseDropdown}
                                      onAddShortcut={handleJobAddShortcut}
                                    />
                                    <Box mt={2}>
                                      <Typography variant="subtitle1" mb={1}>
                                        Status
                                      </Typography>
                                      <Autocomplete
                                        options={optionstatus}
                                        size="small"
                                        sx={{ mt: 1 }}
                                        value={selectedJob}
                                        onChange={handleJobChange}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) =>
                                          option.value === value.value
                                        }
                                        renderOption={(props, option) => (
                                          <Box component="li" {...props}>
                                            <Chip
                                              size="small"
                                              style={{
                                                backgroundColor: option.clientfacingColour,
                                                marginRight: 8,
                                                marginLeft: 8,
                                                borderRadius: "50%",
                                                height: "15px",
                                              }}
                                            />
                                            {option.label}
                                          </Box>
                                        )}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder="Select Client Facing Job"
                                            InputProps={{
                                              ...params.InputProps,
                                              startAdornment:
                                                params.inputProps.value &&
                                                clientFacingJobs.length > 0 ? (
                                                  <Chip
                                                    size="small"
                                                    style={{
                                                      backgroundColor:
                                                        clientFacingJobs.find(
                                                          (job) =>
                                                            job.clientfacingName ===
                                                            params.inputProps.value,
                                                        )?.clientfacingColour,
                                                      marginRight: 8,
                                                      marginLeft: 2,
                                                      borderRadius: "50%",
                                                      height: "15px",
                                                    }}
                                                  />
                                                ) : null,
                                            }}
                                          />
                                        )}
                                      />
                                    </Box>
            
                                    <Box mt={2}>
                                      <ShortcodeTextField
                                        label="Description"
                                        value={clientDescription}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (value.length <= 4000) {
                                            setClientDescription(value);
                                            setCharCount(value.length);
                                          }
                                        }}
                                        placeholder="Description"
                                        multiline
                                        rows={4}
                                        maxLength={4000}
                                        inputRef={descriptionFieldRef}
                                        onClick={(e) =>
                                          setCursorPosition(e.target.selectionStart)
                                        }
                                        helperText={`${clientDescription.length}/4000 characters`}
                                        // shortcuts
                                        shortcuts={filteredShortcuts}
                                        showShortcutDropdown={showDropdownDescription}
                                        anchorElShortcut={anchorElDescription}
                                        onToggleShortcutDropdown={toggleDescriptionDropdown}
                                        onCloseShortcutDropdown={handleCloseDropdown}
                                        onAddShortcut={handleDescriptionAddShortcut}
                                      />
                                    </Box>
                                  </>
                                )}
                              </Box>
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
        selectedAccounts={selectedaccount.map((acc) => acc.value || acc)}
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
        jobDrwerClose={onClose}
        startDate={startDate}
        dueDate={dueDate}
        setDrawerOpen={setAutomationDrawerOpen}
        resetForm={resetForm}
         clientFacingStatus={clientFacingStatus}
  jobnameforclient={inputText}
  clientfacingstatus={selectedJob?.value || null}
  clientfacingDescription={clientDescription}
      />
    </LocalizationProvider>
  );
};

export default JobDrawer;
