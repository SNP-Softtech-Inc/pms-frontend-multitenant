

import React, { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  jobAPI,
  accountsAPI,
  templateAPI,
  accountTasksAPI,
} from "../../services/api";
import { RiDeleteBin6Line } from "react-icons/ri";
import { X } from "lucide-react";
import {useToastContext} from "../../context/ToastContext"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import Status from "../../components/Status";
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { Calendar } from "../../components/ui/calendar";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import SingleSelectDropdown from "../../components/SingleSelectDropdown";
const TasksDrawer = ({ open, onClose,  mode = "create",
  task = null,
  onSuccess, }) => {
  const { user } = useAuth();
const { showToast } = useToastContext();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
console.log("selected job",selectedJob)
  const [taskTemplates, setTaskTemplates] = useState([]);
 const queryClient = useQueryClient();
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
console.log("accounts task details",task)

useEffect(() => {
  if (mode === "edit" && task) {
    // Account
    if (task.accounts) {
      setSelectedAccount({
        value: task.accounts._id,
        label: task.accounts.accountName,
      });
    }

    // Job
    if (task.job) {
      setSelectedJob({
        value: task.job._id,
        label: task.job.Name,
      });
    } else {
      setSelectedJob(null);
    }

    // Template
    if (task.templatename) {
      setselectedTemp({
        value: task.templatename._id,
        label: task.templatename.templatename,
      });
    }

    // Assignees
    const users =
      task.taskassignees?.map((u) => ({
        value: u._id,
        label: u.username,
      })) || [];

    setSelectedUser(users);
    setCombinedValues(users.map((u) => u.value));

    // Tags
    const tags =
  task.tasktags?.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour || "#000000",
  })) || [];

setSelectedTags(tags);
setCombinedTagsValues(tags.map((t) => t.value));

    // Other fields
    settemplatename(task.taskname || "");
    setPriority(task.priority || "Medium");
    setStatus(task.status || "No status");
    setDescription(task.description || "");

    setSubtasks(task.subtasks || []);
    setCheckedSubtasks(
      task.subtasks?.filter((s) => s.checked).map((s) => s.id) || []
    );

    setSubtaskSwitch(task.issubtaskschecked || false);

    setStartDate(task.startdate ? dayjs(task.startdate) : null);
    setDueDate(task.enddate ? dayjs(task.enddate) : null);
  }

  if (mode === "create") {
    resetForm();
  }
}, [mode, task]);
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs-by-account", selectedAccount?.value],
    queryFn: async () => {
      if (!selectedAccount?.value) return [];

      const jobRes = await jobAPI.getJobsByAccountIds(
        selectedAccount.value,
        true,
      );

      return jobRes.data.jobList || [];
    },
    enabled: !!selectedAccount?.value,
  });

  const jobsoptions = jobs.map((job) => ({
    value: job.id,
    label: job.Name,
    group: job.Pipeline || "Others",
  }));



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
    setSelectedTags(tags);
    setCombinedTagsValues(tags.map((t) => t.value));
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
console.log("gets task details by task id",template)
      settemplatename(template.templatename || "");
      setStatus(template.status || "No status");
      setPriority(template.priority || "Medium");
      setDescription(template.description || "");

      const assignees = template.taskassignees || [];

      const formattedUsers = assignees.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      setSelectedUser(formattedUsers);
      setCombinedValues(assignees.map((u) => u._id));

      setSubtasks(template.subtasks || [{ id: "1", text: "" }]);

      setCheckedSubtasks(
        template.subtasks?.filter((s) => s.checked).map((s) => s.id) || [],
      );

      setSubtaskSwitch(template.issubtaskschecked || false);
        // ✅ SET DATES
    setStartDate(
      template.startdate
        ? dayjs(template.startdate)
        : null,
    );

    setDueDate(
      template.enddate
        ? dayjs(template.enddate)
        : null,
    );
    } catch (error) {
      console.error(error);
      showToast({
        title: "Failed to load job template details",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setSelectedAccount(null);
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
  const handleUpdateTask = async () => {
  try {
    if (!selectedAccount?.value) {
      showToast({
        title: "Please select account",
        type: "error",
      });
      return;
    }

    if (!templatename) {
      showToast({
        title: "Please enter task name",
        type: "error",
      });
      return;
    }

    const payload = {
      accounts: selectedAccount?.value,
      job: selectedJob?.value || null,

      templatename: selectedtemp?.value || null,
      taskname: templatename,
      status,
      priority,
      description,

      taskassignees: combinedValues,
      tasktags: combinedTagsValues,

      startdate: startDate,
      enddate: dueDate,

      issubtaskschecked: SubtaskSwitch,

      subtasks: subtasks.map((s) => ({
        id: s.id,
        text: s.text,
        checked: checkedSubtasks.includes(s.id),
      })),
    };

    console.log("UPDATE TASK PAYLOAD 👉", payload);

    setSaving(true);

    await accountTasksAPI.updateTask(task._id, payload);
// Refetch pending tasks
queryClient.invalidateQueries({
  queryKey: ["pendingTasks"],
});
    showToast({
      title: "Task updated successfully 🎉",
      type: "success",
    });

    // onSuccess?.();
    onClose();
  } catch (error) {
    console.error(error);

    showToast({
      title: "Failed to update task",
      type: "error",
    });
  } finally {
    setSaving(false);
  }
};
const handleSave = async () => {
  if (mode === "create") {
    await handleCreateTask();
  } else {
    await handleUpdateTask();
  }

  // onSuccess?.();
};
  const handleCreateTask = async () => {
    try {
      if (!selectedAccount?.value) {
        showToast({
          title: "Please select account",
          type: "error",
        });
        return;
      }

      if (!templatename) {
        showToast({
          title: "Please enter task name",
          type: "error",
        });
        return;
      }

      const payload = {
        accounts: selectedAccount?.value,
        job: selectedJob?.value || null,

        templatename: selectedtemp?.value,
        taskname: templatename,
        status,
        priority,
        description,

        taskassignees: combinedValues,
        tasktags: combinedTagsValues,

        startdate: startDate,
        enddate: dueDate,

        issubtaskschecked: SubtaskSwitch,

        subtasks: subtasks.map((s) => ({
          id: s.id,
          text: s.text,
          checked: checkedSubtasks.includes(s.id),
        })),
      };

      console.log("CREATE TASK PAYLOAD 👉", payload);

      setSaving(true);

      await accountTasksAPI.createTask(payload);

      setSaving(false);
// Refetch pending tasks
queryClient.invalidateQueries({
  queryKey: ["pendingTasks"],
});

      showToast({
        title: "Task created successfully 🎉",
        type: "success",
      });

      resetForm();

      onClose();
    } catch (error) {
      console.error(error);
      setSaving(false);
      showToast({
        title: "Failed to create task",
        type: "error",
      });
    }
  };

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-50 overflow-hidden">

    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Drawer */}
    <div className="
      absolute right-0 top-0 h-full w-full sm:w-[650px]
      bg-background text-foreground
      shadow-xl flex flex-col
      border-l border-border
    ">

      {/* Header */}
      <div className="
        flex items-center justify-between px-5 py-4
        border-b border-border shrink-0
      ">
        {/* <h2 className="text-base font-semibold text-foreground">
          Create Task
        </h2> */}
<h2 className="text-base font-semibold">
  {mode === "edit" ? "Edit Task" : "Create Task"}
</h2>
        <button
          onClick={onClose}
          className="
            p-1 rounded-md
            text-muted-foreground
            hover:text-foreground hover:bg-accent
            transition-colors
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-5">

          {/* Account */}
          <SingleSelectDropdown
            value={selectedAccount}
            onChange={setSelectedAccount}
          />

          {/* Job */}
          <div>
            <Label className="text-sm font-medium text-foreground">
              Select Job
            </Label>

            <Select
              value={selectedJob ? String(selectedJob.value) : undefined}
              onValueChange={(value) => {
                const selected = jobsoptions.find(
                  (job) => String(job.value) === String(value)
                );

                setSelectedJob(selected || null);
              }}
              disabled={!selectedAccount?.value}
            >
              <SelectTrigger className="
                mt-1 w-full
                bg-background border-border
                text-foreground
                hover:bg-accent
              ">
                <SelectValue placeholder="Select Job" />
              </SelectTrigger>

              <SelectContent className="
                w-[550px]
                bg-card border border-border
              ">
                {Object.entries(
                  jobsoptions.reduce((acc, job) => {
                    if (!acc[job.group]) acc[job.group] = [];
                    acc[job.group].push(job);
                    return acc;
                  }, {})
                ).map(([group, items]) => (
                  <div key={group}>

                    {/* Group Heading */}
                    <div className="
                      px-3 py-2 text-xs font-semibold
                      text-muted-foreground uppercase tracking-wide
                    ">
                      {group}
                    </div>

                    {/* Items */}
                    {items.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                        className="min-h-[50px] py-2 text-foreground"
                      >
                        <div className="break-words whitespace-normal leading-5 pr-6">
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template */}
          <div>
            <Label className="text-sm font-medium text-foreground">
              Select Template
            </Label>

            <Select
              value={selectedtemp?.value || ""}
              onValueChange={(value) => {
                const selected =
                  taskTemplateOptions.find((t) => t.value === value) || null;
                handletemp(selected);
              }}
            >
              <SelectTrigger className="
                mt-1
                bg-background border-border
                text-foreground
                hover:bg-accent
              ">
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>

              <SelectContent className="bg-card border border-border">
                {taskTemplateOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-foreground"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status + Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Status
              onStatusChange={handleStatusChange}
              selectedStatus={status}
            />

            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Assignees"
            />

            <Priority
              onPriorityChange={handlePriorityChange}
              selectedPriority={priority}
            />

            <Input
              value={templatename}
              placeholder="Task Name"
              onChange={(e) => settemplatename(e.target.value)}
              className="
                bg-background border-border
                text-foreground
                focus:ring-primary
              "
            />
          </div>

          {/* Editor */}
          <Editor onChange={handleEditorChange} value={description} />

          {/* Tags */}
          <TagsMultiSelectDropDown
            value={selectedTags}
            onChange={handleTagsChange}
            placeholder="Tags"
          />

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Start Date */}
            <div>
              <Label className="text-sm font-medium text-foreground">
                Start Date
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      w-full justify-start text-left font-normal mt-1
                      border-border bg-background text-foreground
                      hover:bg-accent
                    "
                  >
                    {startDate ? (
                      startDate.format("MM/DD/YYYY")
                    ) : (
                      <span className="text-muted-foreground">
                        Pick a date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="bg-card border border-border">
                  <Calendar
                    mode="single"
                    selected={startDate ? startDate.toDate() : undefined}
                    onSelect={(date) =>
                      date && handleStartDateChange(dayjs(date))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Due Date */}
            <div>
              <Label className="text-sm font-medium text-foreground">
                Due Date
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      w-full justify-start text-left font-normal mt-1
                      border-border bg-background text-foreground
                      hover:bg-accent
                    "
                  >
                    {dueDate ? (
                      dueDate.format("MM/DD/YYYY")
                    ) : (
                      <span className="text-muted-foreground">
                        Pick a date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="bg-card border border-border">
                  <Calendar
                    mode="single"
                    selected={dueDate ? dueDate.toDate() : undefined}
                    onSelect={(date) =>
                      date && handleDueDateChange(dayjs(date))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Subtasks */}
          <div className="border border-border rounded-xl p-4 bg-card">

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                Subtasks
              </h3>

              <button
                type="button"
                onClick={() => setSubtaskSwitch(!SubtaskSwitch)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${SubtaskSwitch ? "bg-primary" : "bg-muted"}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-background transition-transform
                    ${SubtaskSwitch ? "translate-x-6" : "translate-x-1"}
                  `}
                />
              </button>
            </div>

            {SubtaskSwitch && (
              <div className="mt-4 space-y-3">

                {subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">

                    <input
                      type="checkbox"
                      checked={checkedSubtasks.includes(s.id)}
                      onChange={() => handleCheckboxChange(s.id)}
                      className="h-4 w-4 rounded border-border"
                    />

                    <Input
                      value={s.text}
                      onChange={(e) =>
                        setSubtasks((prev) =>
                          prev.map((p) =>
                            p.id === s.id
                              ? { ...p, text: e.target.value }
                              : p
                          )
                        )
                      }
                      className="bg-background border-border text-foreground"
                    />

                    <button
                      onClick={() => handleDeleteSubtask(s.id)}
                      className="
                        p-2 rounded-md
                        text-muted-foreground
                        hover:bg-accent
                      "
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>

                  </div>
                ))}

                <button
                  onClick={handleAddSubtask}
                  className="
                    h-9 px-4 text-sm font-medium
                    border border-border rounded-lg
                    hover:bg-accent transition-colors
                  "
                >
                  Add Subtask
                </button>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="
        flex items-center justify-end gap-3 px-5 py-4
        border-t border-border shrink-0
        bg-background
      ">

        <button
          onClick={onClose}
          className="
            h-9 px-4 text-sm font-medium
            border border-border rounded-lg
            text-foreground hover:bg-accent
          "
        >
          Cancel
        </button>

        {/* <button
          onClick={handleCreateTask}
          disabled={saving}
          className="
            h-9 px-4 text-sm font-medium
            bg-primary text-primary-foreground
            rounded-lg hover:bg-primary/90
            transition-colors disabled:opacity-50
          "
        >
          {saving ? "Saving..." : "Save"}
        </button> */}
<button
  onClick={handleSave}
  disabled={saving}
  className="h-9 px-4 rounded-lg bg-primary text-primary-foreground"
>
  {saving
    ? "Saving..."
    : mode === "edit"
    ? "Update Task"
    : "Create Task"}
</button>
      </div>

    </div>
  </div>
);
};

export default TasksDrawer;
