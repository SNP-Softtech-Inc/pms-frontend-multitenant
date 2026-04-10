import React, { useEffect, useState, useRef } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  InputLabel,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Autocomplete,Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { jobAPI, accountsAPI, templateAPI } from "../../services/api"; // ✅ UPDATED
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import ShortcodeTextField from "../../components/ShortcodeTextField";
const EditJobDrawer = ({ open, onClose, jobId }) => {
  const queryClient = useQueryClient();

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
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [showDropdown, setShowDropdown] = useState(false);
  // Refs
  const descriptionFieldRef = useRef(null);
  const textFieldRef = useRef(null);
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
console.log("edit job drawer details",job)
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
      const stageObj = job?.pipeline?.stages?.find(
        (s) => s._id === job.stageid,
      );

      setSelectedStage(
        stageObj ? { label: stageObj.name, value: stageObj._id } : null,
      );

      // Assignees
      setSelectedUser(
        job?.jobassignees?.map((u) => ({
          label: u.username,
          value: u._id,
        })) || [],
      );

      // Priority
      setPriority(job?.priority || "");

      // Description
      setDescription(job?.description || "");

      // Dates
      setStartDate(job?.startdate ? dayjs(job.startdate) : null);
      setDueDate(job?.enddate ? dayjs(job.enddate) : null);

      // Client Facing
     // Client Facing
setClientFacingStatus(job?.showinclientportal || false);
setInputText(job?.jobnameforclient || "");
setClientDescription(job?.clientfacingDescription || "");

// ✅ SET SELECTED STATUS
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
          ...new Map(
            job.accounts[0].tags.map((tag) => [tag._id, tag]),
          ).values(),
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

  // ✅ NEW: Tags update mutation
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
        clientfacingstatus:selectedJob?.value
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

      toast.success("Job updated successfully");
      queryClient.invalidateQueries(["jobs-all"]);
      queryClient.invalidateQueries(["accounts-all"]);

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // ================= UI =================
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    //   <Drawer
    //     anchor="right"
    //     open={open}
    //     onClose={onClose}
    //     PaperProps={{
    //       sx: {
    //         width: 500,
    //         maxWidth: "100%",
    //         borderRadius: "10px 0 0 10px",
    //       },
    //     }}
    //   >
    //     {/* HEADER */}
    //     <Box p={2} display="flex" justifyContent="space-between">
    //       <Typography fontWeight="bold">Edit Job</Typography>
    //       <IconButton onClick={onClose}>
    //         <CloseIcon />
    //       </IconButton>
    //     </Box>
    //     <Divider />

    //     {/* BODY */}
    //     <Box p={2} sx={{ overflowY: "auto", height: "85vh" }}>
    //       <InputLabel>Account</InputLabel>
    //       <TextField value={selectedAccount} fullWidth size="small" disabled />

    //       <InputLabel sx={{ mt: 2 }}>Job Name</InputLabel>
    //       <TextField
    //         value={jobName}
    //         onChange={(e) => setJobName(e.target.value)}
    //         fullWidth
    //         size="small"
    //       />

    //       <InputLabel sx={{ mt: 2 }}>Pipeline</InputLabel>
    //       <TextField
    //         value={selectedPipeline?.label || ""}
    //         fullWidth
    //         size="small"
    //         disabled
    //       />

    //       <InputLabel sx={{ mt: 2 }}>Stage</InputLabel>
    //       <TextField
    //         value={selectedStage?.label || ""}
    //         fullWidth
    //         size="small"
    //         disabled
    //       />

    //       <TagsMultiSelectDropDown
    //         value={tagsList}
    //         onChange={handleTagsChange}
    //         placeholder="Select Tags"
    //       />

    //       <Box mt={2}>
    //         <MultiSelectDropdown
    //           value={selectedUser}
    //           onChange={setSelectedUser}
    //         />
    //       </Box>

    //       <Box mt={2}>
    //         <Priority
    //           selectedPriority={priority}
    //           onPriorityChange={setPriority}
    //         />
    //       </Box>

    //       <Box mt={2}>
    //         <InputLabel>Start Date</InputLabel>
    //         <DatePicker
    //           value={startDate}
    //           onChange={setStartDate}
    //           slotProps={{ textField: { size: "small", fullWidth: true } }}
    //         />
    //       </Box>

    //       <Box mt={2}>
    //         <InputLabel>Due Date</InputLabel>
    //         <DatePicker
    //           value={dueDate}
    //           onChange={setDueDate}
    //           slotProps={{ textField: { size: "small", fullWidth: true } }}
    //         />
    //       </Box>

    //       <Box mt={2}>
    //         <Editor value={description} onChange={setDescription} />
    //       </Box>

    //       <Box mt={3}>
    //         <FormControlLabel
    //           control={
    //             <Switch
    //               checked={clientFacingStatus}
    //               onChange={(e) => setClientFacingStatus(e.target.checked)}
    //             />
    //           }
    //           label="Client Facing"
    //         />

    //         <Box mb={2}>
    //           {clientFacingStatus && (
    //             <>
    //               <ShortcodeTextField
    //                 label="Job name for client"
    //                 value={inputText}
    //                 onChange={(e) => {
    //                   const { value, selectionStart } = e.target;
    //                   setInputText(value);
    //                   setCursorPosition(selectionStart);
    //                 }}
    //                 placeholder="Job name for client"
    //                 inputRef={textFieldRef}
    //                 onClick={(e) => setCursorPosition(e.target.selectionStart)}
    //                 // shortcuts
    //                 shortcuts={filteredShortcuts}
    //                 showShortcutDropdown={showDropdownClientJob}
    //                 anchorElShortcut={anchorElClientJob}
    //                 onToggleShortcutDropdown={toggleShortcodeDropdown}
    //                 onCloseShortcutDropdown={handleCloseDropdown}
    //                 onAddShortcut={handleJobAddShortcut}
    //               />
    //               <Box mt={2}>
    //                 <Typography variant="subtitle1" mb={1}>
    //                   Status
    //                 </Typography>
    //                 <Autocomplete
    //                   options={optionstatus}
    //                   size="small"
    //                   sx={{ mt: 1 }}
    //                   value={selectedJob}
    //                   onChange={handleJobChange}
    //                   getOptionLabel={(option) => option.label}
    //                   isOptionEqualToValue={(option, value) =>
    //                     option.value === value.value
    //                   }
    //                   renderOption={(props, option) => (
    //                     <Box component="li" {...props}>
    //                       <Chip
    //                         size="small"
    //                         style={{
    //                           backgroundColor: option.clientfacingColour,
    //                           marginRight: 8,
    //                           marginLeft: 8,
    //                           borderRadius: "50%",
    //                           height: "15px",
    //                         }}
    //                       />
    //                       {option.label}
    //                     </Box>
    //                   )}
    //                   renderInput={(params) => (
    //                     <TextField
    //                       {...params}
    //                       placeholder="Select Client Facing Job"
    //                       InputProps={{
    //                         ...params.InputProps,
    //                         startAdornment:
    //                           params.inputProps.value &&
    //                           clientFacingJobs.length > 0 ? (
    //                             <Chip
    //                               size="small"
    //                               style={{
    //                                 backgroundColor: clientFacingJobs.find(
    //                                   (job) =>
    //                                     job.clientfacingName ===
    //                                     params.inputProps.value,
    //                                 )?.clientfacingColour,
    //                                 marginRight: 8,
    //                                 marginLeft: 2,
    //                                 borderRadius: "50%",
    //                                 height: "15px",
    //                               }}
    //                             />
    //                           ) : null,
    //                       }}
    //                     />
    //                   )}
    //                 />
    //               </Box>

    //               <Box mt={2}>
    //                 <ShortcodeTextField
    //                   label="Description"
    //                   value={clientDescription}
    //                   onChange={(e) => {
    //                     const value = e.target.value;
    //                     if (value.length <= 4000) {
    //                       setClientDescription(value);
    //                       setCharCount(value.length);
    //                     }
    //                   }}
    //                   placeholder="Description"
    //                   multiline
    //                   rows={4}
    //                   maxLength={4000}
    //                   inputRef={descriptionFieldRef}
    //                   onClick={(e) =>
    //                     setCursorPosition(e.target.selectionStart)
    //                   }
    //                   helperText={`${clientDescription.length}/4000 characters`}
    //                   // shortcuts
    //                   shortcuts={filteredShortcuts}
    //                   showShortcutDropdown={showDropdownDescription}
    //                   anchorElShortcut={anchorElDescription}
    //                   onToggleShortcutDropdown={toggleDescriptionDropdown}
    //                   onCloseShortcutDropdown={handleCloseDropdown}
    //                   onAddShortcut={handleDescriptionAddShortcut}
    //                 />
    //               </Box>
    //             </>
    //           )}
    //         </Box>
    //       </Box>

    //       <Box mt={4} display="flex" gap={2}>
    //         <Button variant="contained" onClick={handleSave}>
    //           Save
    //         </Button>
    //         <Button variant="outlined" onClick={onClose}>
    //           Cancel
    //         </Button>
    //       </Box>
    //     </Box>
    //   </Drawer>
    // </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        width: 520,
        maxWidth: "100%",
        borderRadius: "16px 0 0 16px",
        // backgroundColor: "#f9fafb",
      },
    }}
  >
    {/* HEADER */}
    <Box
      p={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
        borderBottom: "1px solid #eee",
      }}
    >
      <Typography fontWeight={600} fontSize={18}>
        Edit Job
      </Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* BODY */}
    <Box p={2} sx={{ overflowY: "auto", height: "calc(100% - 130px)" }}>
      {/* SECTION 1 */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={2}>
          Basic Info
        </Typography>

        <TextField
          label="Account"
          value={selectedAccount}
          fullWidth
          size="small"
          disabled
          sx={{ mb: 2 }}
        />

        <TextField
          label="Job Name"
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          fullWidth
          size="small"
        />
      </Paper>

      {/* SECTION 2 */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={2}>
          Workflow
        </Typography>

        <TextField
          label="Pipeline"
          value={selectedPipeline?.label || ""}
          fullWidth
          size="small"
          disabled
          sx={{ mb: 2 }}
        />

        <TextField
          label="Stage"
          value={selectedStage?.label || ""}
          fullWidth
          size="small"
          disabled
        />
      </Paper>

      {/* SECTION 3 */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={2}>
          Tags & Assignees
        </Typography>

        <TagsMultiSelectDropDown
          value={tagsList}
          onChange={handleTagsChange}
          placeholder="Select Tags"
        />

        <Box mt={2}>
          <MultiSelectDropdown
            value={selectedUser}
            onChange={setSelectedUser}
          />
        </Box>

        <Box mt={2}>
          <Priority
            selectedPriority={priority}
            onPriorityChange={setPriority}
          />
        </Box>
      </Paper>

      {/* SECTION 4 */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={2}>
          Dates
        </Typography>

        <Box display="flex" gap={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Box>
      </Paper>

      {/* SECTION 5 */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={2}>
          Description
        </Typography>

        <Editor value={description} onChange={setDescription} />
      </Paper>

      {/* CLIENT SECTION */}
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontWeight={600}>Client Facing</Typography>
          <Switch
            checked={clientFacingStatus}
            onChange={(e) => setClientFacingStatus(e.target.checked)}
          />
        </Box>

        {clientFacingStatus && (
          <>
            <Box mt={2}>
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
                anchorElShortcut={anchorElClientJob}
                onToggleShortcutDropdown={toggleShortcodeDropdown}
                onCloseShortcutDropdown={handleCloseDropdown}
                onAddShortcut={handleJobAddShortcut}
              />
            </Box>

            <Box mt={2}>
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

  // ✅ Dropdown option with color dot
  renderOption={(props, option) => (
    <Box
      component="li"
      {...props}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: option.clientfacingColour,
        }}
      />
      {option.label}
    </Box>
  )}

  // ✅ Selected value with color dot inside input
  renderInput={(params) => (
    <TextField
      {...params}
      label="Status"
      InputProps={{
        ...params.InputProps,
        startAdornment: selectedJob ? (
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: selectedJob.clientfacingColour,
              mr: 1,
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
                  }
                }}
                multiline
                rows={4}
                inputRef={descriptionFieldRef}
                helperText={`${clientDescription.length}/4000 characters`}
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
      </Paper>
    </Box>

    {/* FOOTER */}
    <Box
      p={2}
      display="flex"
      gap={2}
      justifyContent="flex-end"
      sx={{
        position: "sticky",
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid #eee",
      }}
    >
      <Button variant="outlined" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Box>
  </Drawer>
</LocalizationProvider>
  );
};

export default EditJobDrawer;
