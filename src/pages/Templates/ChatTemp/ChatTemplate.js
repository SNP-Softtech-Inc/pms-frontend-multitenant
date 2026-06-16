// import { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   TablePagination,
//   Divider,
//   IconButton,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Editor from "../../../components/Editor"; // Your Editor component
// import { templateAPI, authAPI } from "../../../services/api"; // import your api.js functions
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// import { useConfirm } from "../../../components/ConfirmDialogContext";

// const ChatTemp = () => {
//   const confirm = useConfirm();
//   const [chatTemplates, setChatTemplates] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [selectedTemplate, setSelectedTemplate] = useState(null); // null = create mode
//   const [templateName, setTemplateName] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [inputText, setInputText] = useState("");
//   const [description, setDescription] = useState("");
//   const [absoluteDate, setAbsoluteDate] = useState(false);
//   const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
//   const [noOfReminder, setNoOfReminder] = useState(1);
//   const [subtasks, setSubtasks] = useState([]);
//   const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
//   const [checkedSubtasks, setCheckedSubtasks] = useState([]);
//   const [userData, setUserData] = useState([]);
//   const [templateNameError, setTemplateNameError] = useState("");
//   const [selectedUserError, setSelectedUserError] = useState("");
//   const [inputTextError, setInputTextError] = useState("");

//   // Load chat templates
//   const fetchTemplates = async () => {
//     setLoading(true);
//     try {
//       const data = await templateAPI.getAllChatTemplates();
//       setChatTemplates(data.data.chatTemplate || []);
//       console.log("chat template", data.data.chatTemplate);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await authAPI.getAllUsers({
//           page: 1,
//           limit: 50,
//           status: "active",
//         });

//         console.log("API RESPONSE:", res.data);

//         const users = res?.data?.users || [];

//         if (!users.length) {
//           console.warn("No users found");
//         }

//         const formatted = users.map((user) => ({
//           value: user._id,
//           label: user.username,
//         }));

//         console.log("FORMATTED USERS:", formatted);

//         setUserData(formatted);
//       } catch (err) {
//         console.error("User fetch error:", err?.response || err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   // Open form for create
//   const handleCreateChat = () => {
//     setSelectedTemplate(null); // create mode
//     clearForm();
//     setShowForm(true);
//   };

//   // Open form for edit
//   const handleEdit = (template) => {
//     setSelectedTemplate(template);
//     setTemplateName(template.templatename);
//     setSelectedUser(userData.find((o) => o.value === template.from) || null);
//     setInputText(template.chatsubject);
//     setDescription(template.description || "");
//     setAbsoluteDate(template.sendreminderstoclient || false);
//     setDaysuntilNextReminder(template.daysuntilnextreminder || "3");
//     setNoOfReminder(template.numberofreminders || 1);
//     setSubtasks(template.clienttasks || []);
//     setCheckedSubtasks(
//       (template.clienttasks || []).filter((t) => t.checked).map((t) => t.id),
//     );
//     setSubtaskSwitch(template.isclienttaskchecked || false);
//     setShowForm(true);
//   };
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   const handleMenuOpen = (event, row) => {
//     console.log("eowId", row);
//     setAnchorEl(event.currentTarget);
//     setSelectedRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRow(null);
//   };

//   const handleEditClick = () => {
//     handleEdit(selectedRow);
//     handleMenuClose();
//   };
//   const handleDeleteClick = () => {
//     const id = selectedRow?._id;
//     console.log("selected id", id);
//     confirm({
//       title: "Delete Template",
//       description: "Are you sure you want to delete this template?",
//       onConfirm: async () => {
//         await handleDelete(id);
//       },
//     });

//     handleMenuClose();
//   };
//   const handleDelete = async (id) => {
//     // if (!window.confirm("Are you sure you want to delete this chat template?"))
//     //   return;

//     try {
//       await templateAPI.deleteChatTemplate(id);
//       toast.success("Template deleted");
//       fetchTemplates();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete template");
//     }
//   };

//   const clearForm = () => {
//     setTemplateName("");
//     setSelectedUser(null);
//     setInputText("");
//     setDescription("");
//     setAbsoluteDate(false);
//     setDaysuntilNextReminder("3");
//     setNoOfReminder(1);
//     setSubtasks([]);
//     setCheckedSubtasks([]);
//     setSubtaskSwitch(false);
//   };

//   const validateForm = () => {
//     let isValid = true;

//     if (!templateName) {
//       setTemplateNameError("Template name is required");
//       isValid = false;
//     } else {
//       setTemplateNameError("");
//     }

//     if (!selectedUser) {
//       setSelectedUserError("Please select a user");
//       isValid = false;
//     } else {
//       setSelectedUserError("");
//     }

//     if (!inputText.trim()) {
//       setInputTextError("Chat subject is required");
//       isValid = false;
//     } else {
//       setInputTextError("");
//     }

//     return isValid;
//   };

//   // Save template (create or update)
//   const handleSave = async () => {
//     if (!validateForm()) return;

//     const subtaskData = subtasks.map(({ id, text }) => ({
//       id,
//       text,
//       checked: checkedSubtasks.includes(id),
//     }));

//     const payload = {
//       templatename: templateName,
//       from: selectedUser.value,
//       chatsubject: inputText,
//       description,
//       sendreminderstoclient: absoluteDate,
//       daysuntilnextreminder: daysuntilNextReminder,
//       numberofreminders: noOfReminder,
//       clienttasks: subtaskData,
//       isclienttaskchecked: SubtaskSwitch,
//       active: true,
//     };

//     try {
//       if (selectedTemplate) {
//         await templateAPI.updateChatTemplate(selectedTemplate._id, payload);
//         toast.success("Template updated successfully");
//       } else {
//         await templateAPI.createChatTemplate(payload);
//         toast.success("Template created successfully");
//       }
//       fetchTemplates();
//       setShowForm(false);
//       clearForm();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to save template");
//     }
//   };

//   return (
//     <Box>
//       {!showForm ? (
//         <Box mt={2}>
//           <Button variant="contained" onClick={handleCreateChat} sx={{mb:2}}>
//             Create Chat Template
//           </Button>
//           {loading ? (
//             <CircularProgress />
//           ) : (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Settings</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
                 
//                   {chatTemplates
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((row) => (
//                       <TableRow key={row._id}>
//                         <TableCell
//                           sx={{ cursor: "pointer" }}
//                           onClick={() => handleEdit(row)}
//                         >
//                           {row.templatename}
//                         </TableCell>

//                         <TableCell>
//                           <IconButton onClick={(e) => handleMenuOpen(e, row)}>
//                             <MoreVertIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//                 <Menu
//                   anchorEl={anchorEl}
//                   open={Boolean(anchorEl)}
//                   onClose={handleMenuClose}
//                 >
//                   <MenuItem onClick={handleEditClick}>
//                     <RiEdit2Line style={{ marginRight: 8 }} /> Edit
//                   </MenuItem>
//                   <MenuItem onClick={handleDeleteClick}>
//                     <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
//                   </MenuItem>
//                 </Menu>
//               </Table>
//               <TablePagination
//                 component="div"
//                 count={chatTemplates.length}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25]}
//               />
//             </TableContainer>
//           )}
//         </Box>
//       ) : (
//         <Box mt={2}>
//           {/* <Typography variant="h5">
//             {selectedTemplate ? "Edit Chat Template" : "Create Chat Template"}
//           </Typography> */}

//           <Box textAlign="center" mb={3}>
//             <Typography variant="h6">
//               {selectedTemplate ? "Edit Chat Template" : "Create Chat Template"}
//             </Typography>
//           </Box>
//           <Divider sx={{ my: 2 }} />
//           <Box mt={2}>
//             <Box>
//               <TextField
//                 label="Template Name"
//                 value={templateName}
//                 onChange={(e) => setTemplateName(e.target.value)}
//                 error={!!templateNameError}
//                 helperText={templateNameError}
//                 fullWidth
//                 size="small"
//                 sx={{ mb: 2 }}
//               />
//             </Box>
//             <Box>
//               <Autocomplete
//                 options={userData}
//                 value={selectedUser}
//                 onChange={(_, val) => setSelectedUser(val)}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="From"
//                     error={!!selectedUserError}
//                     helperText={selectedUserError}
//                     size="small"
//                   />
//                 )}
//               />
//             </Box>
//             <Box>
//               <TextField
//                 label="Chat Subject"
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 error={!!inputTextError}
//                 helperText={inputTextError}
//                 fullWidth
//                 size="small"
//                 sx={{ mt: 2 }}
//               />
//             </Box>
//             <Box mt={2}>
//               <Editor onChange={setDescription} value={description} />
//             </Box>
//           </Box>
//           <Divider sx={{ my: 2 }} />
//           <Box
//             mt={4}
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             gap={2}
//           >
//             <Button variant="contained" onClick={handleSave}>
//               Save
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => {
//                 clearForm();
//                 setShowForm(false);
//               }}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ChatTemp;


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import debounce from "lodash.debounce";
import axios from "axios";
import { FormPage, FormSection, FormRow, FormGrid, ShortcodePopover, FormSelect } from "../../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Trash2, Plus, GripVertical, Pencil, Loader2 } from "lucide-react";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import Editor from '../../../components/EditorShortcodes'; // Your existing Editor component
import { templateAPI, authAPI } from "../../../services/api";
import ShortcodeTextField from '../../../components/ShortcodeTextField';
import {useToastContext} from "../../../context/ToastContext";
import { useConfirm } from "../../../components/ConfirmDialogContext";


// const chatSchema = z.object({
//   templateName: z.string().min(1, "Template name is required"),
//   selecteduser: z.any().refine((v) => v && v.value, { message: "Please select a sender" }),
//   inputText: z.string().min(1, "Chat subject is required"),
//   description: z.string().optional(),
//   sendReminders: z.boolean().optional(),
//   daysuntilNextReminder: z.string().optional(),
//   noOfReminder: z.string().optional(),
//   SubtaskSwitch: z.boolean().optional(),
// });

const chatSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  selecteduser: z.any().refine(
    (v) => v && v.value,
    { message: "Please select a sender" }
  ),
  inputText: z.string().min(1, "Chat subject is required"),
  description: z.string().optional(),
  sendReminders: z.boolean().optional(),

  // Fixed
  daysuntilNextReminder: z.coerce.number().optional(),
  noOfReminder: z.coerce.number().optional(),

  SubtaskSwitch: z.boolean().optional(),
});
const ChatTemp = () => {
  const confirm = useConfirm();
  const { showToast } = useToastContext();
  const [chatTemplates, setChatTemplates] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null); // For edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      templateName: "",
      selecteduser: null,
      inputText: "",
      description: "",
      sendReminders: false,
      daysuntilNextReminder: "3",
      noOfReminder: "1",
      SubtaskSwitch: false,
    },
  });

  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);

  // Shortcodes state
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });
        const users = res?.data?.users || [];
        setUserData(users);
      } catch (err) {
        console.error("User fetch error:", err?.response || err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch chat templates
  const fetchChatTemplates = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const data = await templateAPI.getAllChatTemplates();
      setChatTemplates(data.data.chatTemplate || []);
    } catch (error) {
      console.error('Error fetching Chat templates:', error);
      showToast({
        title: "Failed to fetch templates",
        type: "error",
        description: "An error occurred while fetching chat templates",
      });
    } finally {
      await loaderDelay;
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatTemplates();
  }, []);

  // Setup shortcodes
  useEffect(() => {
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
  }, []);

  const handleAddShortcut = (shortcut) => {
    const current = form.getValues("inputText") || "";
    const newText = current.slice(0, cursorPosition) + `[${shortcut}]` + current.slice(cursorPosition);
    form.setValue("inputText", newText, { shouldDirty: true });
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
      }
    }, 0);
    setShowDropdown(false);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  // Subtask handlers
  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prevChecked) => 
      prevChecked.includes(id) 
        ? prevChecked.filter(checkedId => checkedId !== id) 
        : [...prevChecked, id]
    );
  };

  const handleAddSubtask = () => {
    const newId = subtasks.length > 0 ? Math.max(...subtasks.map(s => s.id)) + 1 : 1;
    setSubtasks([...subtasks, { id: newId, text: "", checked: false }]);
  };

  const handleInputChange = (id, value) => {
    setSubtasks((prevSubtasks) => 
      prevSubtasks.map((subtask) => 
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
    setCheckedSubtasks(checkedSubtasks.filter(checkedId => checkedId !== id));
  };

  const handleSubtaskSwitch = (checked) => {
    form.setValue("SubtaskSwitch", checked);
    if (checked && subtasks.length === 0) {
      setSubtasks([{ id: 1, text: '', checked: false }]);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(newSubtasks);
  };

  // Form actions
  const handleCreateChat = () => {
    setIsEditMode(false);
    setSelectedTemplate(null);
    setShowForm(true);
    form.reset();
    setDescription("");
    setSubtasks([]);
    setCheckedSubtasks([]);
  };

//   const handleEdit = (template) => {
//     setIsEditMode(true);
//     setSelectedTemplate(template);
//     form.setValue("templateName", template.templatename);
//     form.setValue("selecteduser", { value: template.from, label: userData.find(u => u._id === template.from)?.username || "" });
//     form.setValue("inputText", template.chatsubject);
//     form.setValue("description", template.description || "");
//     form.setValue("sendReminders", template.sendreminderstoclient || false);
//    form.setValue(
//   "daysuntilNextReminder",
//   String(template.daysuntilnextreminder || 3)
// );

// form.setValue(
//   "noOfReminder",
//   String(template.numberofreminders || 1)
// );
//     form.setValue("SubtaskSwitch", template.isclienttaskchecked || false);
//     setDescription(template.description || "");
//     setSubtasks(template.clienttasks || []);
//     setCheckedSubtasks((template.clienttasks || []).filter((t) => t.checked).map((t) => t.id));
//     setShowForm(true);
//   };
const handleEdit = (template) => {
  setIsEditMode(true);
  setSelectedTemplate(template);

  form.reset({
    templateName: template.templatename || "",
    selecteduser: {
      value:
        typeof template.from === "object"
          ? template.from._id
          : template.from,
      label:
        userData.find(
          (u) =>
            u._id ===
            (typeof template.from === "object"
              ? template.from._id
              : template.from)
        )?.username || "",
    },
    inputText: template.chatsubject || "",
    description: template.description || "",
    sendReminders: template.sendreminderstoclient || false,

    // Fixed
    daysuntilNextReminder:
      template.daysuntilnextreminder ?? 3,

    noOfReminder:
      template.numberofreminders ?? 1,

    SubtaskSwitch:
      template.isclienttaskchecked || false,
  });

  setDescription(template.description || "");
  setSubtasks(template.clienttasks || []);
  setCheckedSubtasks(
    (template.clienttasks || [])
      .filter((t) => t.checked)
      .map((t) => t.id)
  );

  setShowForm(true);
};
  const handleCloseChatTemp = () => {
    if (form.formState.isDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmClose) return;
    }
    setShowForm(false);
    setIsEditMode(false);
    setSelectedTemplate(null);
    form.reset();
    setDescription("");
    setSubtasks([]);
    setCheckedSubtasks([]);
  };

const handleDelete = (id,templateName) => {
  confirm({
    title: "Delete Template",
    // description: "Are you sure you want to delete this chat template?",
   description: (
        <>
          Are you sure you want to delete this chat{" "}
          <span className="font-semibold text-red-600">
            "{templateName}"
          </span>
          ?
        </>
      ),
    onConfirm: async () => {
      try {
        await templateAPI.deleteChatTemplate(id);
        showToast({
          title: "Template deleted successfully",
          description: "The chat template has been deleted.",
          type: "success",
        });
        fetchChatTemplates();
      } catch (error) {
        console.error(error);
        showToast({
          title: "Failed to delete template",
          type: "error",
          description: error.message || "An error occurred while deleting the template"
        });
      }
    },
  });
};

  const checkTemplateName = async (name, currentId = null) => {
    try {
      const existing = chatTemplates.find(t => t.templatename === name);
      if (existing && (!currentId || existing._id !== currentId)) {
        form.setError("templateName", { type: "manual", message: "Template name already exists" });
        return true;
      } else {
        form.clearErrors("templateName");
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const debouncedCheck = debounce(async (name, currentId) => {
    if (name.trim()) {
      await checkTemplateName(name, currentId);
    } else {
      form.clearErrors("templateName");
    }
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "templateName") {
        debouncedCheck(value.templateName, selectedTemplate?._id);
      }
    });
    return () => { 
      subscription.unsubscribe(); 
      debouncedCheck.cancel(); 
    };
  }, [form.watch, selectedTemplate]);

  const submitChat = async (values, exitAfterSave) => {
     console.log("SUBMIT CALLED", values);

    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      checked: checkedSubtasks.includes(id),
    }));

    // const payload = {
    //   templatename: values.templateName,
    //   from: values.selecteduser.value,
    //   chatsubject: values.inputText,
    //   description: description,
    //   sendreminderstoclient: values.sendReminders,
    //   daysuntilnextreminder: values.daysuntilNextReminder,
    //   numberofreminders: parseInt(values.noOfReminder, 10),
    //   clienttasks: subtaskData,
    //   isclienttaskchecked: values.SubtaskSwitch,
    //   active: true,
    // };
const payload = {
  templatename: values.templateName,
  from: values.selecteduser.value,
  chatsubject: values.inputText,
  description,

  sendreminderstoclient: values.sendReminders,

  daysuntilnextreminder: values.daysuntilNextReminder,

  numberofreminders: values.noOfReminder,

  clienttasks: subtaskData,
  isclienttaskchecked: values.SubtaskSwitch,
  active: true,
};
    try {
      if (isEditMode && selectedTemplate) {
        await templateAPI.updateChatTemplate(selectedTemplate._id, payload);
        showToast({
          title: "Template updated successfully",
          type: "success",
          description: "The chat template has been updated."
        });
      } else {
        await templateAPI.createChatTemplate(payload);
        showToast({
          title: "Template created successfully",
          type: "success",
          description: "A new chat template has been created."
        });
      }
      fetchChatTemplates();
      if (exitAfterSave) {
        setShowForm(false);
        setIsEditMode(false);
        setSelectedTemplate(null);
        form.reset();
        setDescription("");
        setSubtasks([]);
        setCheckedSubtasks([]);
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Failed to save template",
        type: "error",
        description: error.message || "An error occurred while saving the template"
      });
    }
  };

  // const savechat = form.handleSubmit((values) => submitChat(values, true));
  // const saveSchat = form.handleSubmit((values) => submitChat(values, false));
const savechat = form.handleSubmit(
  (values) => {
    console.log("VALID SUBMIT", values);
    submitChat(values, true);
  },
  (errors) => {
    console.log("FORM ERRORS", errors);
  }
);

const saveSchat = form.handleSubmit(
  (values) => {
    console.log("VALID SUBMIT", values);
    submitChat(values, false);
  },
  (errors) => {
    console.log("FORM ERRORS", errors);
  }
);
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleEditorChange = (content) => {
    setDescription(content);
    form.setValue("description", content, { shouldDirty: true });
  };

  const chatColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id,row.original.templatename)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], [userData]);

  return (
    <div>
      {!showForm ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateChat}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Chat
            </Button>
          </div>
          <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <DataTable
            columns={chatColumns}
            data={chatTemplates}
            loading={loading}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection={false}
            getRowId={(row) => row._id}
            emptyMessage="No chat templates found"
            emptyDescription="Create your first chat template to get started"
            pageSize={30}
          />
        </div>
      ) : (
        <Form {...form}>
          <FormPage
            title={isEditMode ? "Edit Chat Template" : "Create Chat Template"}
            subtitle="Configure your chat template"
            actions={
              <>
                <Button type="button" variant="outline" onClick={handleCloseChatTemp}>Cancel</Button>
                <Button type="button" variant="secondary" onClick={saveSchat}>Save</Button>
                <Button type="button" onClick={savechat}>Save & Exit</Button>
              </>
            }
          >
            <FormGrid>
              {/* ===== LEFT COLUMN ===== */}
              <FormGrid.Main>
                <FormSection title="Template Details">
                  <FormField
                    control={form.control}
                    name="templateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Template Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selecteduser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <FormSelect
                            value={field.value?.value || ""}
                            onChange={(e) => {
                              const selected = options.find((o) => o.value === e.target.value) || null;
                              field.onChange(selected);
                            }}
                          >
                            <option value="">Select Sender</option>
                            {options.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </FormSelect>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="inputText"
                    render={({ field }) => (
                      <FormItem>
                        
                       <FormField
  control={form.control}
  name="inputText"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Subject</FormLabel>
      <FormControl>
        <ShortcodeTextField
          label=""
          value={field.value}
          onChange={(e) => {
            const { value, selectionStart } = e.target;
            field.onChange(value);
            setCursorPosition(selectionStart);
          }}
          placeholder="Enter chat subject..."
          inputRef={textFieldRef}
          onClick={(e) => setCursorPosition(e.target.selectionStart)}
          shortcuts={filteredShortcuts}
          showShortcutDropdown={showDropdown}
          anchorElShortcut={anchorEl}
          onToggleShortcutDropdown={toggleDropdown}
          onCloseShortcutDropdown={handleCloseDropdown}
          onAddShortcut={handleAddShortcut}
          error={!!form.formState.errors.inputText}
          helperText={form.formState.errors.inputText?.message}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
  control={form.control}
  name="inputText"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Subject</FormLabel>
      <FormControl>
        <ShortcodeTextField
          label=""
          value={field.value}
          onChange={(e) => {
            const { value, selectionStart } = e.target;
            field.onChange(value);
            setCursorPosition(selectionStart);
          }}
          placeholder="Enter chat subject..."
          inputRef={textFieldRef}
          onClick={(e) => setCursorPosition(e.target.selectionStart)}
          shortcuts={filteredShortcuts}
          showShortcutDropdown={showDropdown}
          anchorElShortcut={anchorEl}
          onToggleShortcutDropdown={toggleDropdown}
          onCloseShortcutDropdown={handleCloseDropdown}
          onAddShortcut={handleAddShortcut}
          error={!!form.formState.errors.inputText}
          helperText={form.formState.errors.inputText?.message}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                </FormSection>

                <FormSection title="Description">
                  <Editor onChange={handleEditorChange} initialContent={description} />
                </FormSection>

                <FormSection title="Reminders">
                  <FormField
                    control={form.control}
                    name="sendReminders"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Send reminders to clients</Label>
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("sendReminders") && (
                    <FormRow cols={2}>
                      <FormField
                        control={form.control}
                        name="daysuntilNextReminder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days until next reminder</FormLabel>
                            <FormControl>
                              <Input placeholder="Days until next reminder" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="noOfReminder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No. of reminders</FormLabel>
                            <FormControl>
                              <Input placeholder="Number of reminders" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormRow>
                  )}
                </FormSection>
              </FormGrid.Main>

              {/* ===== RIGHT COLUMN: Client Tasks ===== */}
              <FormGrid.Sidebar>
                <FormSection title="Client Tasks">
                  <FormField
                    control={form.control}
                    name="SubtaskSwitch"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Enable Client Tasks</Label>
                            <Switch
                              checked={!!field.value}
                              onCheckedChange={(val) => { 
                                field.onChange(val); 
                                handleSubtaskSwitch(val); 
                              }}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("SubtaskSwitch") && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="subtaskList">
                        {(provided) => (
                          <div className="space-y-2" {...provided.droppableProps} ref={provided.innerRef}>
                            {subtasks.map((subtask, index) => (
                              <Draggable key={subtask.id} draggableId={String(subtask.id)} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-sm"
                                  >
                                    <Checkbox
                                      checked={checkedSubtasks.includes(subtask.id)}
                                      onCheckedChange={() => handleCheckboxChange(subtask.id)}
                                    />
                                    <Input
                                      placeholder="Things to do"
                                      value={subtask.text}
                                      onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                                      className="flex-1 border-0 shadow-none focus-visible:ring-0"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubtask(subtask.id)}
                                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div {...provided.dragHandleProps} className="cursor-grab rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent">
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <Button type="button" variant="ghost" size="sm" onClick={handleAddSubtask} className="mt-2 w-full text-primary">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Subtask
                            </Button>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </FormSection>
              </FormGrid.Sidebar>
            </FormGrid>
          </FormPage>
        </Form>
      )}
    </div>
  );
};

export default ChatTemp;