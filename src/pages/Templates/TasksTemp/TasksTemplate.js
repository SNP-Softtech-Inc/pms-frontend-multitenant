import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Autocomplete,
  Divider,
  TablePagination,
} from "@mui/material";

import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { FiPlusCircle } from "react-icons/fi";
import TagsMultiSelectDropDown from "../../../components/TagsMultiSelectDropDown"; // adjust path
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { templateAPI } from "../../../services/api";
import Editor from "../../../components/Editor";
import Priority from "../../../components/Priority";
import Status from "../../../components/Status";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const Tasks = () => {
  const confirm = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templatename, settemplatename] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("No status");
  const [description, setDescription] = useState("");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startsin, setstartsin] = useState(0);
  const [duein, setduein] = useState(0);
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  const [TaskTemplates, setTaskTemplates] = useState([]);
  // Inside your Tasks component
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleEditClick = () => {
    handleEdit(selectedRowId);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    const id = selectedRowId;
    console.log("selected id", id);
    confirm({
      title: "Delete Template",
      description: "Are you sure you want to delete this template?",
      onConfirm: async () => {
        await handleDelete(id);
      },
    });

    handleMenuClose();
  };
  // ================= FETCH =================
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

  const handleUserChange = (users) => {
    setSelectedUser(users);
    setCombinedValues(users.map((u) => u.value));
  };
  const handleEditorChange = (content) => {
    setDescription(content);
  };
  const handleStatusChange = (status) => {
    setStatus(status);
  };
  const handlePriorityChange = (priority) => {
    setPriority(priority);
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
  // Handler function to update state when dropdown value changes
  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };
  // Handler function to update state when dropdown value changes
  const handledueindateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
  };
  const handleTagsChange = (tags) => {
    setSelectedTags(tags); // UI (chips)
    setCombinedTagsValues(tags.map((t) => t.value)); // payload (ids)
  };
  // ================= EDIT =================
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getTaskTemplateById(id);
      const data = res.data.data;
      console.log("edit task temp", data);
      setEditingId(id);
      setShowForm(true);

      settemplatename(data.templatename || "");
      setStatus(data.status || "No status");
      setPriority(data.priority || "Medium");
      setDescription(data.description || "");
      setAbsoluteDates(data.absolutedates || false);

      setstartsin(data.startsin || "");
      setduein(data.duein || "");

      setStartsInDuration(data.startsinduration || "Days");
      setdueinduration(data.dueinduration || "Days");

      // setCombinedValues(data.taskassignees || []);
      const assignees = data.taskassignees || [];

      // convert API → dropdown format
      const formattedUsers = assignees.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      setSelectedUser(formattedUsers); // ✅ for UI
      setCombinedValues(assignees.map((u) => u._id)); // ✅ for payload

      setSubtasks(data.subtasks || [{ id: "1", text: "" }]);
      setCheckedSubtasks(
        data.subtasks?.filter((s) => s.checked).map((s) => s.id) || [],
      );

      setSubtaskSwitch(data.issubtaskschecked || false);
    } catch (err) {
      toast.error("Failed to load template");
    }
  };

  // ================= BUILD PAYLOAD =================
  const buildPayload = () => {
    const subtaskData = subtasks.map((s) => ({
      id: s.id,
      text: s.text,
      checked: checkedSubtasks.includes(s.id),
    }));

    return {
      templatename,
      status,
      priority,
      description,
      absolutedates: absoluteDate,
      taskassignees: combinedValues,
      tasktags: combinedTagsValues,
      issubtaskschecked: SubtaskSwitch,
      ...(absoluteDate
        ? {}
        : {
            startsin,
            startsinduration: startsInDuration,
            duein,
            dueinduration,
          }),
      subtasks: subtaskData,
    };
  };

  // ================= SAVE =================
  const handleSave = async (exit = false) => {
    if (!templatename.trim()) {
      return toast.error("Template name required");
    }

    try {
      setSaving(true);
      const payload = buildPayload();

      let res;

      if (editingId) {
        // UPDATE
        res = await templateAPI.updateTaskTemplate(editingId, payload);
        toast.success("Updated successfully");
      } else {
        // CREATE
        res = await templateAPI.createTaskTemplate(payload);
        toast.success("Created successfully");

        // ✅ Set editingId after create
        const newId = res?.data?.data?._id;
        setEditingId(newId);
      }

      fetchTaskData();

      if (exit) {
        resetFields();
        setShowForm(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving template");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      await templateAPI.deleteTaskTemplate(id);
      toast.success("Deleted");
      fetchTaskData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ================= RESET =================
  const resetFields = () => {
    setEditingId(null);
    settemplatename("");
    setPriority("Medium");
    setCombinedValues([]);
    setSelectedUser([]); // ✅ IMPORTANT
    setSelectedTags([]);
    setCombinedTagsValues([]);
    setStatus("No status");
    setDescription("");
    setAbsoluteDates(false);
    setstartsin("");
    setduein("");
    setSubtasks([{ id: "1", text: "" }]);
    setCheckedSubtasks([]);
    setSubtaskSwitch(false);
  };

  // ================= SUBTASK =================
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

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box p={2}>
          {!showForm ? (
            <>
              <Button variant="contained" onClick={() => setShowForm(true)}>
                Create Task Template
              </Button>

              {loading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {TaskTemplates.map((row) => ( */}
                      {TaskTemplates.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      ).map((row) => (
                        <TableRow key={row._id}>
                          <TableCell
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleEdit(row._id)}
                          >
                            {row.templatename}
                          </TableCell>

                          <TableCell>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, row._id)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEditClick}>
                        <RiEdit2Line style={{ marginRight: 8 }} /> Edit
                      </MenuItem>
                      <MenuItem onClick={handleDeleteClick}>
                        <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </Table>

                  <TablePagination
                    component="div"
                    count={TaskTemplates.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </TableContainer>
              )}
            </>
          ) : (
            <>
              <Box textAlign="center" mb={3}>
                <Typography variant="h6">
                  {editingId ? "Edit Task Template" : "Create Task Template"}
                </Typography>
              </Box>
              <Divider sx={{ mt: 1, margin: "0 auto" }} />
              <Box m={2}>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Grid
                      container
                      rowSpacing={3}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" mb={1}>
                          Template Name
                        </Typography>
                        <TextField
                          fullWidth
                          value={templatename}
                          placeholder="Task Template"
                          onChange={(e) => settemplatename(e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" mb={1}>
                          Status
                        </Typography>
                        <Status
                          onStatusChange={handleStatusChange}
                          selectedStatus={status}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography sx={{ mb: 1 }}>Task Assignee</Typography>
                        <MultiSelectDropdown
                          value={selectedUser}
                          onChange={handleUserChange}
                          placeholder="Select Assignees"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" mb={1}>
                          Priority
                        </Typography>
                        <Priority
                          onPriorityChange={handlePriorityChange}
                          selectedPriority={priority}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 12 }}>
                        <Editor
                          onChange={handleEditorChange}
                          initialContent={description}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 12 }}>
                        <Typography variant="subtitle1" mb={1}>
                          Tags
                        </Typography>
                        <TagsMultiSelectDropDown
                          value={selectedTags}
                          onChange={handleTagsChange}
                          placeholder="Select Tags"
                        />
                      </Grid>
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
                                  onChange={(e) => setstartsin(e.target.value)}
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
                                      (option) =>
                                        option.value === startsInDuration,
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
                                  onChange={(e) => setduein(e.target.value)}
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
                                      (option) =>
                                        option.value === dueinduration,
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
                    </Grid>
                  </Grid>
                  {/* add vertical line */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" }, // hide on small screens
                      borderRight: "1px solid #c7c7c7",
                      mx: 2, // horizontal spacing
                    }}
                  />
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1" mb={1}>
                        Subtasks
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={SubtaskSwitch}
                            onChange={(e) => setSubtaskSwitch(e.target.checked)}
                          />
                        }
                        label="Enable"
                      />
                    </Box>
                    <Box>
                      {SubtaskSwitch && (
                        <>
                          {subtasks.map((s) => (
                            <Box
                              key={s.id}
                              display="flex"
                              alignItems="center"
                              gap={2}
                              mt={1}
                            >
                              <Checkbox
                                checked={checkedSubtasks.includes(s.id)}
                                onChange={() => handleCheckboxChange(s.id)}
                              />
                              <TextField
                                value={s.text}
                                fullWidth
                                size="small"
                                onChange={(e) =>
                                  setSubtasks((prev) =>
                                    prev.map((p) =>
                                      p.id === s.id
                                        ? { ...p, text: e.target.value }
                                        : p,
                                    ),
                                  )
                                }
                              />
                              <IconButton
                                onClick={() => handleDeleteSubtask(s.id)}
                              >
                                <RiDeleteBin6Line />
                              </IconButton>
                            </Box>
                          ))}

                          <Button
                            variant="outlined"
                            onClick={handleAddSubtask}
                            sx={{ mt: 1 }}
                            startIcon={<FiPlusCircle />}
                          >
                            Add Subtask
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ mt: 1, margin: "0 auto" }} />

              <Box
                mt={4}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
              >
                <Button
                  variant="contained"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                >
                  Save & Exit
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                >
                  Save
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    resetFields();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default Tasks;
