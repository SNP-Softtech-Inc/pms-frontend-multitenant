import  {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  Autocomplete,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,

  Menu,
  MenuItem,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import EditorShortcodes from "../../../components/EditorShortcodes";
// import Grid from "@mui/material/Unstable_Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import debounce from "lodash.debounce";
import { templateAPI, authAPI } from "../../../services/api"; // Adjust the import path as needed
import ShortcodePopover from "../../../components/ShortcodePopover"
const EmailTemp = () => {
  const confirm = useConfirm();
  // ================= STATE =================
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [templateName, setTemplateName] = useState("");
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [inputText, setInputText] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [files, setFiles] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templateNameError, setTemplateNameError] = useState("");
  const [inputTextError, setInputTextError] = useState("");
  const [selectedUserError, setSelectedUserError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempIdget, setTempIdGet] = useState(null);

  const [selecteduser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([]);

  // Shortcode related states
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);

  // Inside your Tasks component

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

  const handleEditClick = () => {
    handleEdit(selectedRowId);
    handleMenuClose();
  };

  // ================= FETCH EMAIL TEMPLATES =================
  const fetchEmailTemplates = async () => {
    setLoading(true);
    try {
      const res = await templateAPI.getEmailTemplates();
      setEmailTemplates(res.data.emailTemplate || []);
    } catch (err) {
      console.error("Error fetching email templates:", err);
      toast.error("Failed to fetch email templates");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH USERS =================

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
    fetchEmailTemplates();
    // fetchUsers();
  }, []);

  // ================= SHORTCUTES HANDLERS =================
  useEffect(() => {
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        {
          title: "Custom field:Email",
          isBold: false,
          value: "CONTACT_CUSTOM_FIELD:Email",
        },
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
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
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
    }
  }, [selectedOption]);

  useEffect(() => {
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")),
    );
  }, [shortcuts]);

  const handleSubjectChange = (e) => {
    const { value, selectionStart } = e.target;
    setInputText(value);
    setCursorPosition(selectionStart);
  };

  const handleAddShortcut = (shortcut) => {
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

    setShowDropdown(false);
  };

  // ================= FILE UPLOAD =================
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png",
    multiple: true,
  });

  // ================= VALIDATION =================
  const validateForm = () => {
    let isValid = true;

    if (!templateName.trim()) {
      setTemplateNameError("Template name is required");
      isValid = false;
    } else {
      setTemplateNameError("");
    }

    if (!selecteduser) {
      setSelectedUserError("Please select a user");
      isValid = false;
    } else {
      setSelectedUserError("");
    }

    if (!inputText.trim()) {
      setInputTextError("Email subject is required");
      isValid = false;
    } else {
      setInputTextError("");
    }

    return isValid;
  };

  // ================= CHECK TEMPLATE NAME EXISTENCE =================
  const checkTemplateName = async (name) => {
    try {
      const res = await templateAPI.checkTemplateNameExists(name);
      if (res.data.exists) {
        setTemplateNameError("Template name already exists");
      } else {
        setTemplateNameError("");
      }
    } catch (err) {
      console.error(err);
      setTemplateNameError("");
    }
  };

  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else setTemplateNameError("");
  }, 500);

  useEffect(() => {
    debouncedCheck(templateName);
    return debouncedCheck.cancel;
  }, [templateName]);

  // ================= SAVE (CREATE + UPDATE) =================
  const handleSaveTemplate = async (exit = false) => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("templatename", templateName);
    formData.append("from", selecteduser.value);
    formData.append("emailsubject", inputText);
    formData.append("emailbody", emailBody);
    formData.append("mode", selectedOption);

    files.forEach((file) => formData.append("attachments", file));

    try {
      if (editingId) {
        // UPDATE
        await templateAPI.updateEmailTemplate(editingId, formData);
        toast.success("Email Template updated successfully");
      } else {
        // CREATE
        await templateAPI.createEmailTemplate(formData);
        toast.success("Email Template created successfully");
      }

      resetForm();

      if (exit) {
        setShowForm(false);
        fetchEmailTemplates();
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error saving template");
    }
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setEditingId(null);
    setTemplateName("");
    setSelectedUser("");
    setInputText("");
    setEmailBody("");
    setFiles([]);
    setTemplateNameError("");
    setSelectedUserError("");
    setInputTextError("");
  };

  // ================= EDIT =================
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getEmailTemplateById(id);
      const data = res.data.emailTemplate;
      console.log("template edit", data);
      setTemplateName(data.templatename);
      setInputText(data.emailsubject);
      setEmailBody(data.emailbody);
      setSelectedOption(data.mode || "contacts");
      setEditingId(id);
      setShowForm(true);
      if (data.attachments && data.attachments.length > 0) {
        const existingFiles = data.attachments.map((att) => ({
          name: att.filename, // matches your UI
          size: att.size,
          _id: att._id, // keep the ID so you can handle deletion separately
          existing: true, // custom flag to differentiate existing vs new files
        }));
        setFiles(existingFiles);
      } else {
        setFiles([]);
      }

      if (data.from) {
        // <-- adjust this according to your backend field
        // Find user object from userData
        const userOption = userData.find(
          (u) => u.value === data.from._id || u.value === data.from,
        );
        if (userOption) setSelectedUser(userOption);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load template");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await templateAPI.deleteEmailTemplate(id);
      toast.success("Data deleted successfully");
      // handleMenuClose();
      fetchEmailTemplates();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete template");
    }
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

  // ================= MENU HANDLERS =================

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setTempIdGet(null);
     setSelectedRowId(null);
  };

  const handleTempCancel = () => {
    resetForm();
    setShowForm(false);
  };

  // ================= USER AUTOCOMPLETE =================

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // ================= EDITOR CHANGE =================
  const handleEditorChange = (content) => {
    setEmailBody(content);
  };

  // ================= RENDER =================
  return (
    <Box>
      {!showForm ? (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            Create Template
          </Button>

          {loading ? (
            // <Box
            //   sx={{
            //     display: "flex",
            //     alignItems: "center",
            //     justifyContent: "center",
            //   }}
            // >
            <CircularProgress />
          ) : (
            // </Box>
            <Box>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {emailTemplates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
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
                  count={emailTemplates.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </TableContainer>
            </Box>
          )}
        </Box>
      ) : (
        <>
          <Box textAlign="center" mb={3}>
            <Typography variant="h6">
              {editingId ? "Edit Email Template" : "Create Email Template"}
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
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="subtitle1" mb={1}>
                      Template Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Template Name"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 12 }}>
                    <Box>
                      <Typography variant="subtitle1" mb={1}>
                        Mode
                      </Typography>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={selectedOption}
                          onChange={handleOptionChange}
                        >
                          <FormControlLabel
                            value="contacts"
                            control={<Radio />}
                            label="Contact Shortcodes"
                          />
                          <FormControlLabel
                            value="account"
                            control={<Radio />}
                            label="Account Shortcodes"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="subtitle1">From</Typography>
                    <Autocomplete
                      options={userData}
                      sx={{ mt: 2 }}
                      // size="small"
                      value={selecteduser}
                      onChange={handleUserChange}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      getOptionLabel={(option) => option.label || ""}
                      renderInput={(params) => (
                        <>
                          <TextField
                            {...params}
                            error={!!selectedUserError}
                            placeholder="From"
                          />
                        </>
                      )}
                      isClearable={true}
                    />
                  </Grid>
                 
                  <Grid size={{ xs: 12, md: 12 }}>
  <Typography variant="subtitle1" mb={1}>
    Subject
  </Typography>

  <TextField
    fullWidth
    name="subject"
    onChange={handleSubjectChange}
    inputRef={textFieldRef}
    value={inputText}
    onClick={(e) => setCursorPosition(e.target.selectionStart)}
    onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
    placeholder="Subject"
  />

  <Box>
    <Button
      variant="outlined"
      size="small"
      sx={{ mt: 2, textTransform: "none" }}
      onClick={(e) => {
        setAnchorEl(e.currentTarget);
        setShowDropdown(true);
      }}
    >
      Add Shortcode
    </Button>

    {/* ✅ Replace Popover with reusable component */}
    <ShortcodePopover
      open={showDropdown}
      anchorEl={anchorEl}
      onClose={() => setShowDropdown(false)}
      shortcuts={filteredShortcuts}
      onSelectShortcut={(value) => handleAddShortcut(value)}
    />
  </Box>
</Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <EditorShortcodes
                      onChange={handleEditorChange}
                      initialContent={emailBody}
                    />
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
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    {...getRootProps()}
                    sx={{
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "column",
                      border: "2px dashed #ccc",
                      padding: "20px",
                      width: "100%",
                      maxWidth: "500px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginBottom: "16px",
                    }}
                  >
                    <input
                      id="file-input"
                      {...getInputProps()}
                      style={{ display: "none" }}
                      multiple
                    />
                    <Typography variant="h6">Drag & drop file here</Typography>
                    <Typography variant="body2">or</Typography>
                    <Button variant="contained" color="primary">
                      Browse Files
                    </Button>
                    <Typography variant="body2" sx={{ marginTop: "8px" }}>
                      20 MB file size limit. Supported file types: PDF, DOC,
                      DOCX, XLS, XLSX, JPG, PNG.
                    </Typography>
                  </Box>

                  {files.length > 0 && (
                    <Box sx={{ width: "100%", marginTop: "16px" }}>
                      <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                        Selected Files:
                      </Typography>
                      {files.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <Typography variant="body1">
                            {file.name} ({(file.size / 1024).toFixed(2)} KB)
                          </Typography>
                          <IconButton
                            onClick={() => {
                              const updatedFiles = files.filter(
                                (_, i) => i !== index,
                              );
                              setFiles(updatedFiles);
                            }}
                            sx={{ color: "red" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
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
              color="primary"
              onClick={() => handleSaveTemplate(true)}
            >
              Save & Exit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSaveTemplate(false)}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={handleTempCancel}>
              Cancel
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EmailTemp;
