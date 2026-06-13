import React, { useState, useEffect } from "react";
import { X, ChevronDown, Plus, Trash2 } from "lucide-react";
import {useToastContext} from "../../../context/ToastContext";
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
const {showToast} = useToastContext();
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
    const selectedOption = chatTemplateOptions.find(
      (opt) => opt.value === templateId,
    );
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
    {
      title: "Current day full date",
      isBold: false,
      value: "CURRENT_DAY_FULL_DATE",
    },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    {
      title: "Current month number",
      isBold: false,
      value: "CURRENT_MONTH_NUMBER",
    },
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
      showToast({
        title: "Select account",
        type: "error",
      });
      return;
    }

    if (!inputText.trim()) {
      showToast({
        title: "Enter subject",
        type: "error",
      });
      return;
    }

    try {
      const payload = {
        accountids: selectedaccount.map((a) => a.value),
        chatsubject: inputText,
        from: username,
        templatename: selectedtemp?.label || null,
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
        clienttasks: subtasks.map((task) => ({
          id: task.id, // Required by backend validation
          text: task.text,
          completed: task.completed || false,
        })),
        active: true,
        adminUserId: loginUserId,
      };

      const response = await chatAPI.createChat(payload);

      showToast({
        title: "Chat created successfully",
        type: "success",
      });
      accountwiseChatlist(data, isActiveTrue);
      handleClose();
      resetFields();
    } catch (err) {
      console.error("Error creating chat:", err);
      showToast({
        title: err.response?.data?.message || "Failed to create chat",
        type: "error",
      });
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
      {/* Overlay */}
      <div
        className="
        absolute inset-0
        bg-black/40
        backdrop-blur-sm
        dark:bg-black/60
      "
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className="
        absolute right-0 top-0
        flex h-full w-full flex-col

        border-l border-border
        bg-background
        text-foreground
        shadow-2xl

        sm:w-[650px]
      "
      >
        {/* HEADER */}
        <div
          className="
          flex items-center justify-between
          border-b border-border

          bg-muted/30
          dark:bg-muted/10

          px-6 py-5
          shrink-0
        "
        >
          <div>
            <h2
              className="font-semibold text-foreground"
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "calc(1.05rem * parseFloat(var(--font-scale)) / 100)",
              }}
            >
              New Chat
            </h2>

            <p
              className="mt-1 text-muted-foreground"
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
              }}
            >
              Create a new client conversation and tasks
            </p>
          </div>

          <button
            onClick={handleClose}
            className="
            flex h-9 w-9 items-center justify-center
            rounded-xl

            text-muted-foreground
            transition-all duration-200

            hover:bg-muted
            hover:text-foreground

            dark:hover:bg-muted/40
          "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* ACCOUNT */}
            <div
              className="
              rounded-2xl
              border border-border

              bg-card
              dark:bg-card/70

              p-5 shadow-sm
            "
            >
              <div className="space-y-2">
                <Label
                  className="text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  Account *
                </Label>

                <AccountMultiSelectDropdown
                  value={selectedaccount}
                  onChange={setSelectedaccount}
                />
              </div>
            </div>

            {/* TEMPLATE */}
            <div
              className="
              rounded-2xl border border-border
              bg-card dark:bg-card/70
              p-5 shadow-sm
            "
            >
              <div className="space-y-2">
                <Label
                  className="text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  Template
                </Label>

                <Select
                  value={selectedtemp?.value || ""}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger
                    className="
                    h-11 rounded-xl

                    border-border
                    bg-background
                    text-foreground

                    shadow-sm

                    dark:bg-muted/20
                    dark:border-border/70

                    focus:ring-2
                    focus:ring-primary/20
                  "
                  >
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>

                  <SelectContent
                    className="
                    rounded-xl
                    border border-border

                    bg-popover
                    text-popover-foreground

                    shadow-xl
                  "
                  >
                    {chatTemplateOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="rounded-md"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SUBJECT */}
            <div
              className="
              rounded-2xl border border-border
              bg-card dark:bg-card/70
              p-5 shadow-sm
            "
            >
              <div className="space-y-2">
                <Label
                  className="text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  Subject *
                </Label>

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
            </div>

            {/* DESCRIPTION */}
            <div
              className="
              rounded-2xl border border-border
              bg-card dark:bg-card/70
              p-5 shadow-sm
            "
            >
              <div className="space-y-2">
                <Label
                  className="text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  Description
                </Label>

                <EditorShortcodes
                  initialContent={description}
                  onChange={setDescription}
                />
              </div>
            </div>

            {/* REMINDERS */}
            <div
              className="
              rounded-2xl border border-border
              bg-card dark:bg-card/70
              p-5 shadow-sm
            "
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="send-reminders"
                    className="text-foreground"
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                    }}
                  >
                    Send reminders to client
                  </Label>

                  <Switch
                    id="send-reminders"
                    checked={absoluteDate}
                    onCheckedChange={setAbsoluteDates}
                  />
                </div>

                {absoluteDate && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="days-until-reminder"
                        className="text-foreground"
                      >
                        Days until next reminder
                      </Label>

                      <Input
                        id="days-until-reminder"
                        type="number"
                        value={daysuntilNextReminder}
                        onChange={(e) =>
                          setDaysuntilNextReminder(e.target.value)
                        }
                        min="1"
                        className="
                        h-11 rounded-xl

                        border border-border
                        bg-background
                        text-foreground
                        placeholder:text-muted-foreground

                        shadow-sm transition-all

                        dark:bg-muted/20
                        dark:border-border/70

                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                        focus-visible:border-primary
                      "
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="number-of-reminders"
                        className="text-foreground"
                      >
                        Number of reminders
                      </Label>

                      <Input
                        id="number-of-reminders"
                        type="number"
                        value={noOfReminder}
                        onChange={(e) =>
                          setNoOfReminder(parseInt(e.target.value) || 0)
                        }
                        min="1"
                        className="
                        h-11 rounded-xl

                        border border-border
                        bg-background
                        text-foreground
                        placeholder:text-muted-foreground

                        shadow-sm transition-all

                        dark:bg-muted/20
                        dark:border-border/70

                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                        focus-visible:border-primary
                      "
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* TASKS */}
            <div
              className="
              rounded-2xl border border-border
              bg-card dark:bg-card/70
              p-5 shadow-sm
            "
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-foreground"
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                    }}
                  >
                    Client Tasks
                  </Label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSubtasks([...subtasks, { id: Date.now(), text: "" }])
                    }
                    className="
                    rounded-xl border-border

                    bg-background
                    hover:bg-muted

                    dark:bg-muted/20
                    dark:hover:bg-muted/40
                  "
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Task
                  </Button>
                </div>

                <div className="space-y-3">
                  {subtasks.map((task) => (
                    <div
                      key={task.id}
                      className="
                      flex items-center gap-2

                      rounded-xl border border-border

                      bg-muted/20
                      dark:bg-muted/10

                      p-3
                    "
                    >
                      <Checkbox id={`task-${task.id}`} />

                      <Input
                        value={task.text}
                        onChange={(e) =>
                          setSubtasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id
                                ? { ...t, text: e.target.value }
                                : t,
                            ),
                          )
                        }
                        placeholder="Enter task description"
                        className="
                        h-10 flex-1 rounded-xl

                        border border-border
                        bg-background
                        text-foreground
                        placeholder:text-muted-foreground

                        shadow-sm

                        dark:bg-muted/20
                        dark:border-border/70

                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                        focus-visible:border-primary
                      "
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSubtasks((prev) =>
                            prev.filter((t) => t.id !== task.id),
                          )
                        }
                        className="
                        rounded-lg

                        hover:bg-destructive/10
                        hover:text-destructive
                      "
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {subtasks.length === 0 && (
                    <div
                      className="
                      rounded-xl border border-dashed border-border

                      bg-muted/20
                      dark:bg-muted/10

                      px-4 py-6 text-center
                    "
                    >
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.8rem * parseFloat(var(--font-scale)) / 100)",
                        }}
                      >
                        No tasks added yet. Click "Add Task" to create one.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
          flex items-center justify-end gap-3

          border-t border-border

          bg-muted/20
          dark:bg-muted/10

          px-6 py-4
          shrink-0
        "
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="
            rounded-xl border-border

            bg-background
            hover:bg-muted

            dark:bg-muted/20
            dark:hover:bg-muted/40
          "
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={saveChat}
            className="
            rounded-xl
            shadow-sm
          "
          >
            Create Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewChatDrawer;
