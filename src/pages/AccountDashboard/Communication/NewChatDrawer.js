// import {
//   Drawer,
//   Box,
//   Typography,
//   Divider,
//   Button,
//   TextField,
//   Autocomplete,
//   Checkbox,
//   Switch,
//   FormControlLabel,
//   IconButton,
// } from "@mui/material";
// import React, { useState, useEffect, useContext } from "react";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";
// // import { LoginContext } from "../../../Sidebar/Context/Context";
// import { useAuth } from "../../../context/AuthContext"; // adjust path
// import { templateAPI, chatAPI } from "../../../services/api";

// import AccountMultiSelectDropdown from "../../../components/AccountMultiSelectDropdown";
// import EditorShortcodes from "../../../components/EditorShortcodes";
// import ShortcodeTextField from "../../../components/ShortcodeTextField";

// const NewChatDrawer = ({
//   open,
//   handleClose,
//   accountwiseChatlist,
//   data,
//   isActiveTrue,
// }) => {


//   const [selectedaccount, setSelectedaccount] = useState([]);
//   const [chatTemplates, setChatTemplates] = useState([]);
//   const [selectedtemp, setselectedTemp] = useState(null);

//   const [inputText, setInputText] = useState("");
//   const [description, setDescription] = useState("");

//   const [absoluteDate, setAbsoluteDates] = useState(false);
//   const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
//   const [noOfReminder, setNoOfReminder] = useState(1);

//   const [subtasks, setSubtasks] = useState([]);
// const { user } = useAuth();
// console.log("Logged in user:", user);
// const loginUserId = user?.id;     // or user?.id depending on backend
// const username = user?.group?.name || user?.username;   // or user?.name
//   // ================= USER =================
 

//   // ================= TEMPLATE =================
//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   const fetchTemplates = async () => {
//     try {
//       const res = await templateAPI.getAllChatTemplates(); // create this if not exists
//       setChatTemplates(res.data.chatTemplate || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const chatTemplateOptions = chatTemplates.map((t) => ({
//     label: t.templatename,
//     value: t._id,
//   }));

//   const handleTemplateChange = async (temp) => {
//     setselectedTemp(temp);

//     if (!temp) return;

//     try {
//       const res = await templateAPI.getChatTemplateById(temp.value);

//       const template = res.data.chatTemplate;

//       setInputText(template.chatsubject);
//       setDescription(template.description);
//       setAbsoluteDates(template.sendreminderstoclient);
//       setDaysuntilNextReminder(template.daysuntilnextreminder);
//       setNoOfReminder(template.numberofreminders);

//       setSubtasks(template.clienttasks || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ================= SHORTCODES =================
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);

// const shortcuts = [
//   { title: "Account Shortcodes", isBold: true },
//   { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },

//   { title: "Date Shortcodes", isBold: true },
//   { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
//   { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
//   { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//   { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//   { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
//   { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
//   { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//   { title: "Current year", isBold: false, value: "CURRENT_YEAR" },

//   { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
//   { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//   { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//   { title: "Last week", isBold: false, value: "LAST_WEEK" },
//   { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
//   { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//   { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//   { title: "Last year", isBold: false, value: "LAST_YEAR" },

//   { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
//   { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//   { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//   { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//   { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
//   { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//   { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//   { title: "Next year", isBold: false, value: "NEXT_YEAR" },
// ];

//   // ================= SAVE =================
//   const saveChat = async () => {
//     if (!selectedaccount.length) {
//       toast.error("Select account");
//       return;
//     }

//     if (!inputText.trim()) {
//       toast.error("Enter subject");
//       return;
//     }

//     try {
//       const payload = {
//         accountids: selectedaccount.map((a) => a.value),
//         chatsubject: inputText,
//         description: [
//           {
//             message: description,
//             fromwhome: "Admin",
//             senderid: username,
//             isRead: false,
//           },
//         ],
//         sendreminderstoclient: absoluteDate,
//         daysuntilnextreminder: daysuntilNextReminder,
//         numberofreminders: noOfReminder,
//         clienttasks: subtasks,
//         active: true,
//         adminUserId: loginUserId,
//       };

//       await chatAPI.createChat(payload);

//       toast.success("Chat created");

//       accountwiseChatlist(data, isActiveTrue);
//       handleClose();
//       resetFields();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed");
//     }
//   };

//   const resetFields = () => {
//     setselectedTemp(null);
//     setInputText("");
//     setDescription("");
//     setSubtasks([]);
//   };

//   // ================= UI =================
//   return (
//     <Drawer anchor="right" open={open} onClose={handleClose}>
//       <Box width={500}>
//         {/* HEADER */}
//         <Box p={2} display="flex" justifyContent="space-between">
//           <Typography variant="h6">New Chat</Typography>
//           <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
//         </Box>

//         <Divider />

//         <Box p={3}>
//           {/* ACCOUNT */}
//           <AccountMultiSelectDropdown
//             value={selectedaccount}
//             onChange={setSelectedaccount}
//           />

//           {/* TEMPLATE */}
//           <Autocomplete
//             options={chatTemplateOptions}
//             value={selectedtemp}
//             onChange={(e, val) => handleTemplateChange(val)}
//             renderInput={(params) => (
//               <TextField {...params} label="Template" size="small" />
//             )}
//             sx={{ mt: 2 }}
//           />

//           {/* SUBJECT (SHORTCODE FIELD ✅) */}
//           <ShortcodeTextField
//             label="Subject"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             shortcuts={shortcuts}
//             showShortcutDropdown={showDropdown}
//             anchorElShortcut={anchorEl}
//             onToggleShortcutDropdown={(e) => {
//               setAnchorEl(e.currentTarget);
//               setShowDropdown(true);
//             }}
//             onCloseShortcutDropdown={() => {
//               setAnchorEl(null);
//               setShowDropdown(false);
//             }}
//             sx={{ mt: 2 }}
//           />

//           {/* DESCRIPTION */}
//           <Box mt={2}>
//             <EditorShortcodes
//               initialContent={description}
//               onChange={setDescription}
//             />
//           </Box>

//           {/* REMINDER */}
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={absoluteDate}
//                 onChange={(e) => setAbsoluteDates(e.target.checked)}
//               />
//             }
//             label="Send reminders"
//           />

//           {/* TASKS */}
//           <Box mt={2}>
//             <Button
//               onClick={() =>
//                 setSubtasks([...subtasks, { id: Date.now(), text: "" }])
//               }
//             >
//               Add Task
//             </Button>

//             {subtasks.map((task) => (
//               <Box key={task.id} display="flex" gap={1} mt={1}>
//                 <Checkbox />
//                 <TextField
//                   size="small"
//                   fullWidth
//                   value={task.text}
//                   onChange={(e) =>
//                     setSubtasks((prev) =>
//                       prev.map((t) =>
//                         t.id === task.id
//                           ? { ...t, text: e.target.value }
//                           : t
//                       )
//                     )
//                   }
//                 />
//                 <IconButton
//                   onClick={() =>
//                     setSubtasks((prev) =>
//                       prev.filter((t) => t.id !== task.id)
//                     )
//                   }
//                 >
//                   ❌
//                 </IconButton>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* FOOTER */}
//         <Box p={2} display="flex" gap={2}>
//           <Button variant="contained" onClick={saveChat}>
//             Create
//           </Button>
//           <Button onClick={handleClose}>Cancel</Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default NewChatDrawer;

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { templateAPI, chatAPI } from "../../../services/api";

import AccountMultiSelectDropdown from "../../../components/AccountMultiSelectDropdown";
import EditorShortcodes from "../../../components/EditorShortcodes";
import ShortcodeTextField from "../../../components/ShortcodeTextField";

// Shadcn UI components (using correct paths)
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Switch } from "../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { fromJSON } from "postcss";

const NewChatDrawer = ({
  open,
  handleClose,
  accountwiseChatlist,
  data,
  isActiveTrue,
}) => {
  const [selectedaccount, setSelectedaccount] = useState([]);
  const [chatTemplates, setChatTemplates] = useState([]);
  const [selectedtemp, setselectedTemp] = useState(null);

  const [inputText, setInputText] = useState("");
  const [description, setDescription] = useState("");

  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);

  const [subtasks, setSubtasks] = useState([]);
  const { user } = useAuth();
  console.log("Logged in user:", user);
  const loginUserId = user?.id;
  const username = user?.group?.name || user?.username;

  // ================= TEMPLATE =================
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await templateAPI.getAllChatTemplates();
      setChatTemplates(res.data.chatTemplate || []);
    } catch (err) {
      console.error(err);
    }
  };

  const chatTemplateOptions = chatTemplates.map((t) => ({
    label: t.templatename,
    value: t._id,
  }));

  const handleTemplateChange = async (templateId) => {
    const selectedOption = chatTemplateOptions.find(opt => opt.value === templateId);
    setselectedTemp(selectedOption);

    if (!templateId) return;

    try {
      const res = await templateAPI.getChatTemplateById(templateId);

      const template = res.data.chatTemplate;

      setInputText(template.chatsubject);
      setDescription(template.description);
      setAbsoluteDates(template.sendreminderstoclient);
      setDaysuntilNextReminder(template.daysuntilnextreminder);
      setNoOfReminder(template.numberofreminders);

      setSubtasks(template.clienttasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SHORTCODES =================
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const shortcuts = [
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
    { title: "Last year", isBold: false, value: "LAST_YEAR" },

    { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
    { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
    { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
    { title: "Next week", isBold: false, value: "NEXT_WEEK" },
    { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
    { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
    { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
    { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  ];

  // ================= SAVE =================
  // ================= SAVE =================
const saveChat = async () => {
  if (!selectedaccount.length) {
    toast.error("Select account");
    return;
  }

  if (!inputText.trim()) {
    toast.error("Enter subject");
    return;
  }

  try {
    const payload = {
      accountids: selectedaccount.map((a) => a.value),
      chatsubject: inputText,
      from:username,
      templatename:selectedtemp?.label || null,
      description: [
        {
          message: description,
          fromwhome: "Admin",
          senderid: username,
          isRead: false,
        },
      ],
      sendreminderstoclient: absoluteDate,
      daysuntilnextreminder: parseInt(daysuntilNextReminder),
      numberofreminders: noOfReminder,
      clienttasks: subtasks.map(task => ({ 
        id: task.id,      // Required by backend validation
        text: task.text,
        completed: task.completed || false
      })),
      active: true,
      adminUserId: loginUserId,
    };

    const response = await chatAPI.createChat(payload);
    
    toast.success("Chat created successfully");
    accountwiseChatlist(data, isActiveTrue);
    handleClose();
    resetFields();
  } catch (err) {
    console.error("Error creating chat:", err);
    toast.error(err.response?.data?.message || "Failed to create chat");
  }
};

  const resetFields = () => {
    setselectedTemp(null);
    setInputText("");
    setDescription("");
    setSubtasks([]);
    setAbsoluteDates(false);
    setDaysuntilNextReminder("3");
    setNoOfReminder(1);
    setSelectedaccount([]);
  };

  // ================= UI =================
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">New Chat</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* ACCOUNT */}
          <div className="space-y-2">
            <Label>Account *</Label>
            <AccountMultiSelectDropdown
              value={selectedaccount}
              onChange={setSelectedaccount}
            />
          </div>

          {/* TEMPLATE */}
          <div className="space-y-2">
            <Label>Template</Label>
            <Select
              value={selectedtemp?.value || ""}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {chatTemplateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SUBJECT (SHORTCODE FIELD ✅) */}
          <div className="space-y-2">
            <Label>Subject *</Label>
            <ShortcodeTextField
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              shortcuts={shortcuts}
              showShortcutDropdown={showDropdown}
              anchorElShortcut={anchorEl}
              onToggleShortcutDropdown={(e) => {
                setAnchorEl(e.currentTarget);
                setShowDropdown(true);
              }}
              onCloseShortcutDropdown={() => {
                setAnchorEl(null);
                setShowDropdown(false);
              }}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <EditorShortcodes
              initialContent={description}
              onChange={setDescription}
            />
          </div>

          {/* REMINDER SETTINGS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="send-reminders">Send reminders to client</Label>
              <Switch
                id="send-reminders"
                checked={absoluteDate}
                onCheckedChange={setAbsoluteDates}
              />
            </div>

            {absoluteDate && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="days-until-reminder">Days until next reminder</Label>
                  <Input
                    id="days-until-reminder"
                    type="number"
                    value={daysuntilNextReminder}
                    onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number-of-reminders">Number of reminders</Label>
                  <Input
                    id="number-of-reminders"
                    type="number"
                    value={noOfReminder}
                    onChange={(e) => setNoOfReminder(parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
              </>
            )}
          </div>

          {/* TASKS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Client Tasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSubtasks([...subtasks, { id: Date.now(), text: "" }])
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>

            <div className="space-y-2">
              {subtasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <Checkbox id={`task-${task.id}`} />
                  <Input
                    value={task.text}
                    onChange={(e) =>
                      setSubtasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id
                            ? { ...t, text: e.target.value }
                            : t
                        )
                      )
                    }
                    placeholder="Enter task description"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSubtasks((prev) =>
                        prev.filter((t) => t.id !== task.id)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {subtasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks added yet. Click "Add Task" to create one.</p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={saveChat}
          >
            Create Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewChatDrawer;