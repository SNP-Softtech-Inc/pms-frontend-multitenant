import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Editor from "../../../components/Editor"; // Your Editor component
import { templateAPI, authAPI } from "../../../services/api"; // import your api.js functions
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { useConfirm } from "../../../components/ConfirmDialogContext";

const ChatTemp = () => {
  const confirm = useConfirm();
  const [chatTemplates, setChatTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // null = create mode
  const [templateName, setTemplateName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputText, setInputText] = useState("");
  const [description, setDescription] = useState("");
  const [absoluteDate, setAbsoluteDate] = useState(false);
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [subtasks, setSubtasks] = useState([]);
  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  const [userData, setUserData] = useState([]);
  const [templateNameError, setTemplateNameError] = useState("");
  const [selectedUserError, setSelectedUserError] = useState("");
  const [inputTextError, setInputTextError] = useState("");

  // Load chat templates
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await templateAPI.getAllChatTemplates();
      setChatTemplates(data.data.chatTemplate || []);
      console.log("chat template", data.data.chatTemplate);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });

        console.log("API RESPONSE:", res.data);

        const users = res?.data?.users || [];

        if (!users.length) {
          console.warn("No users found");
        }

        const formatted = users.map((user) => ({
          value: user._id,
          label: user.username,
        }));

        console.log("FORMATTED USERS:", formatted);

        setUserData(formatted);
      } catch (err) {
        console.error("User fetch error:", err?.response || err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Open form for create
  const handleCreateChat = () => {
    setSelectedTemplate(null); // create mode
    clearForm();
    setShowForm(true);
  };

  // Open form for edit
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setTemplateName(template.templatename);
    setSelectedUser(userData.find((o) => o.value === template.from) || null);
    setInputText(template.chatsubject);
    setDescription(template.description || "");
    setAbsoluteDate(template.sendreminderstoclient || false);
    setDaysuntilNextReminder(template.daysuntilnextreminder || "3");
    setNoOfReminder(template.numberofreminders || 1);
    setSubtasks(template.clienttasks || []);
    setCheckedSubtasks(
      (template.clienttasks || []).filter((t) => t.checked).map((t) => t.id),
    );
    setSubtaskSwitch(template.isclienttaskchecked || false);
    setShowForm(true);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleMenuOpen = (event, row) => {
    console.log("eowId", row);
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleEditClick = () => {
    handleEdit(selectedRow);
    handleMenuClose();
  };
  const handleDeleteClick = () => {
    const id = selectedRow?._id;
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
  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this chat template?"))
    //   return;

    try {
      await templateAPI.deleteChatTemplate(id);
      toast.success("Template deleted");
      fetchTemplates();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete template");
    }
  };

  const clearForm = () => {
    setTemplateName("");
    setSelectedUser(null);
    setInputText("");
    setDescription("");
    setAbsoluteDate(false);
    setDaysuntilNextReminder("3");
    setNoOfReminder(1);
    setSubtasks([]);
    setCheckedSubtasks([]);
    setSubtaskSwitch(false);
  };

  const validateForm = () => {
    let isValid = true;

    if (!templateName) {
      setTemplateNameError("Template name is required");
      isValid = false;
    } else {
      setTemplateNameError("");
    }

    if (!selectedUser) {
      setSelectedUserError("Please select a user");
      isValid = false;
    } else {
      setSelectedUserError("");
    }

    if (!inputText.trim()) {
      setInputTextError("Chat subject is required");
      isValid = false;
    } else {
      setInputTextError("");
    }

    return isValid;
  };

  // Save template (create or update)
  const handleSave = async () => {
    if (!validateForm()) return;

    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      checked: checkedSubtasks.includes(id),
    }));

    const payload = {
      templatename: templateName,
      from: selectedUser.value,
      chatsubject: inputText,
      description,
      sendreminderstoclient: absoluteDate,
      daysuntilnextreminder: daysuntilNextReminder,
      numberofreminders: noOfReminder,
      clienttasks: subtaskData,
      isclienttaskchecked: SubtaskSwitch,
      active: true,
    };

    try {
      if (selectedTemplate) {
        await templateAPI.updateChatTemplate(selectedTemplate._id, payload);
        toast.success("Template updated successfully");
      } else {
        await templateAPI.createChatTemplate(payload);
        toast.success("Template created successfully");
      }
      fetchTemplates();
      setShowForm(false);
      clearForm();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save template");
    }
  };

  return (
    <Box>
      {!showForm ? (
        <Box mt={2}>
          <Button variant="contained" onClick={handleCreateChat} sx={{mb:2}}>
            Create Chat Template
          </Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Settings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                 
                  {chatTemplates
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row._id}>
                        <TableCell
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleEdit(row)}
                        >
                          {row.templatename}
                        </TableCell>

                        <TableCell>
                          <IconButton onClick={(e) => handleMenuOpen(e, row)}>
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
                count={chatTemplates.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </TableContainer>
          )}
        </Box>
      ) : (
        <Box mt={2}>
          {/* <Typography variant="h5">
            {selectedTemplate ? "Edit Chat Template" : "Create Chat Template"}
          </Typography> */}

          <Box textAlign="center" mb={3}>
            <Typography variant="h6">
              {selectedTemplate ? "Edit Chat Template" : "Create Chat Template"}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box mt={2}>
            <Box>
              <TextField
                label="Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                error={!!templateNameError}
                helperText={templateNameError}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            </Box>
            <Box>
              <Autocomplete
                options={userData}
                value={selectedUser}
                onChange={(_, val) => setSelectedUser(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From"
                    error={!!selectedUserError}
                    helperText={selectedUserError}
                    size="small"
                  />
                )}
              />
            </Box>
            <Box>
              <TextField
                label="Chat Subject"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                error={!!inputTextError}
                helperText={inputTextError}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
              />
            </Box>
            <Box mt={2}>
              <Editor onChange={setDescription} value={description} />
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                clearForm();
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatTemp;
