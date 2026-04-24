import {
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Autocomplete,
  Checkbox,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
// import { LoginContext } from "../../../Sidebar/Context/Context";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import { templateAPI, chatAPI } from "../../../services/api";

import AccountMultiSelectDropdown from "../../../components/AccountMultiSelectDropdown";
import EditorShortcodes from "../../../components/EditorShortcodes";
import ShortcodeTextField from "../../../components/ShortcodeTextField";

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
const loginUserId = user?.id;     // or user?.id depending on backend
const username = user?.group?.name || user?.username;   // or user?.name
  // ================= USER =================
 

  // ================= TEMPLATE =================
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await templateAPI.getAllChatTemplates(); // create this if not exists
      setChatTemplates(res.data.chatTemplate || []);
    } catch (err) {
      console.error(err);
    }
  };

  const chatTemplateOptions = chatTemplates.map((t) => ({
    label: t.templatename,
    value: t._id,
  }));

  const handleTemplateChange = async (temp) => {
    setselectedTemp(temp);

    if (!temp) return;

    try {
      const res = await templateAPI.getChatTemplateById(temp.value);

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
        description: [
          {
            message: description,
            fromwhome: "Admin",
            senderid: username,
            isRead: false,
          },
        ],
        sendreminderstoclient: absoluteDate,
        daysuntilnextreminder: daysuntilNextReminder,
        numberofreminders: noOfReminder,
        clienttasks: subtasks,
        active: true,
        adminUserId: loginUserId,
      };

      await chatAPI.createChat(payload);

      toast.success("Chat created");

      accountwiseChatlist(data, isActiveTrue);
      handleClose();
      resetFields();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  const resetFields = () => {
    setselectedTemp(null);
    setInputText("");
    setDescription("");
    setSubtasks([]);
  };

  // ================= UI =================
  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box width={500}>
        {/* HEADER */}
        <Box p={2} display="flex" justifyContent="space-between">
          <Typography variant="h6">New Chat</Typography>
          <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
        </Box>

        <Divider />

        <Box p={3}>
          {/* ACCOUNT */}
          <AccountMultiSelectDropdown
            value={selectedaccount}
            onChange={setSelectedaccount}
          />

          {/* TEMPLATE */}
          <Autocomplete
            options={chatTemplateOptions}
            value={selectedtemp}
            onChange={(e, val) => handleTemplateChange(val)}
            renderInput={(params) => (
              <TextField {...params} label="Template" size="small" />
            )}
            sx={{ mt: 2 }}
          />

          {/* SUBJECT (SHORTCODE FIELD ✅) */}
          <ShortcodeTextField
            label="Subject"
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
            sx={{ mt: 2 }}
          />

          {/* DESCRIPTION */}
          <Box mt={2}>
            <EditorShortcodes
              initialContent={description}
              onChange={setDescription}
            />
          </Box>

          {/* REMINDER */}
          <FormControlLabel
            control={
              <Switch
                checked={absoluteDate}
                onChange={(e) => setAbsoluteDates(e.target.checked)}
              />
            }
            label="Send reminders"
          />

          {/* TASKS */}
          <Box mt={2}>
            <Button
              onClick={() =>
                setSubtasks([...subtasks, { id: Date.now(), text: "" }])
              }
            >
              Add Task
            </Button>

            {subtasks.map((task) => (
              <Box key={task.id} display="flex" gap={1} mt={1}>
                <Checkbox />
                <TextField
                  size="small"
                  fullWidth
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
                />
                <IconButton
                  onClick={() =>
                    setSubtasks((prev) =>
                      prev.filter((t) => t.id !== task.id)
                    )
                  }
                >
                  ❌
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        {/* FOOTER */}
        <Box p={2} display="flex" gap={2}>
          <Button variant="contained" onClick={saveChat}>
            Create
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NewChatDrawer;