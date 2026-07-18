


import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, FileText, Calendar, ListChecks } from "lucide-react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {useToastContext} from "../../../context/ToastContext";
// Shadcn UI Components
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

// Custom Components
import TagsMultiSelectDropDown from "../../../components/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import Editor from "../../../components/Editor";
import Priority from "../../../components/Priority";
import Status from "../../../components/Status";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { templateAPI } from "../../../services/api";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { PiDotsThreeOutlineVerticalThin } from "react-icons/pi";

// Form Components
import { FormPage, FormSection, FormRow, FormGrid, FormSwitchRow, FormSubtaskItem, FormSubtaskAdd } from "../../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import TextEditor from "../../../components/TextEditor";
// Validation Schema
const taskTemplateSchema = z.object({
  templatename: z.string().min(1, "Template name is required"),
  status: z.string().default("No status"),
  priority: z.string().default("Medium"),
  description: z.string().default(""),
  assignees: z.array(z.any()).default([]),
  tags: z.array(z.any()).default([]),
  absoluteDate: z.boolean().default(false),
  startsin: z.string().optional(),
  startsInDuration: z.string().optional(),
  duein: z.string().optional(),
  dueinduration: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  SubtaskSwitch: z.boolean().default(false),
});


const Tasks = () => {
  const confirm = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [TaskTemplates, setTaskTemplates] = useState([]);
  const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  const [description, setDescription] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
 const { showToast } = useToastContext();
  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  // Initialize Form
  const form = useForm({
    resolver: zodResolver(taskTemplateSchema),
    defaultValues: {
      templatename: "",
      status: "No status",
      priority: "Medium",
      description: "",
      assignees: [],
      tags: [],
      absoluteDate: false,
      startsin: "",
      startsInDuration: "Days",
      duein: "",
      dueinduration: "Days",
      startDate: "",
      dueDate: "",
      SubtaskSwitch: false,
    },
  });

  // Fetch Task Templates
  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const res = await templateAPI.getAllTaskTemplates();
      setTaskTemplates(res.data.TaskTemplates || []);
    } catch (err) {
      showToast({
        title: "Failed to fetch templates",
        description: err?.response?.data?.message || "An error occurred while fetching task templates",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, []);

  // Handle Editor Change
  const handleEditorChange = (content) => {
    setDescription(content);
    form.setValue("description", content);
  };

  // Handle Subtask Switch
  const handleSubtaskSwitch = (checked) => {
    if (!checked) {
      setSubtasks([{ id: "1", text: "" }]);
      setCheckedSubtasks([]);
    }
  };

  // Subtask Handlers
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now().toString(), text: "" }]);
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
    setCheckedSubtasks(checkedSubtasks.filter((i) => i !== id));
  };

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleInputChange = (id, value) => {
    setSubtasks((prev) =>
      prev.map((p) => (p.id === id ? { ...p, text: value } : p))
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(subtasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(items);
  };


const buildPayload = (values) => {
  const subtaskData = subtasks.map((s) => ({
    id: s.id,
    text: s.text,
    checked: checkedSubtasks.includes(s.id),
  }));

  return {
    templatename: values.templatename,

    status: values.status,

    priority: values.priority,

    description: values.description,

    absolutedates: values.absoluteDate,

    taskassignees: values.assignees.map((a) => a.value),

    tasktags: values.tags.map((t) => t.value),

    issubtaskschecked: values.SubtaskSwitch,

    ...(values.absoluteDate
      ? {
          startdate: values.startDate
            ? new Date(values.startDate)
            : null,

          enddate: values.dueDate
            ? new Date(values.dueDate)
            : null,
        }
      : {
          startsin: values.startsin
            ? Number(values.startsin)
            : null,

          startsinduration: values.startsInDuration,

          duein: values.duein
            ? Number(values.duein)
            : null,

          dueinduration: values.dueinduration,
        }),

    subtasks: subtaskData,
  };
};
  // Create/Update Task Template
  const handleSave = async (values, exit = false) => {
    try {
      setSaving(true);
      const payload = buildPayload(values);
console.log("payload",payload)
      if (editingId) {
        await templateAPI.updateTaskTemplate(editingId, payload);
        showToast({
          title: "Updated successfully",
          description: "The task template has been updated.",
          type: "success",
        });
      } else {
        const res = await templateAPI.createTaskTemplate(payload);
        showToast({
          title: "Created successfully",
          description: "The task template has been created.",
          type: "success",
        });
        setEditingId(res?.data?.data?._id);
      }

      // Refresh the table data
      await fetchTaskData();

      if (exit) {
        // Close form and reset all fields
        resetAndClose();
      }
    } catch (err) {
      showToast({
        title: err?.response?.data?.message || "Error saving template",
        description: "An error occurred while saving the template",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const createTaskTemp = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      await handleSave(form.getValues(), true); // Pass true to exit
    }
  };

  const createSaveTaskTemp = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      await handleSave(form.getValues(), false); // Pass false to stay
    }
  };

  // Edit Template
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getTaskTemplateById(id);
      const data = res.data.data;
console.log("task templates edit",data)
      setEditingId(id);
      setShowForm(true);

      const assignees = data.taskassignees || [];
      const formattedUsers = assignees.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      const tags = data.tasktags || [];
    const formattedTags = tags.map((tag) => ({
  value: tag._id,
  label: tag.tagName,
  colour: tag.tagColour,
}));

      form.reset({
        templatename: data.templatename || "",
        status: data.status || "No status",
        priority: data.priority || "Medium",
        description: data.description || "",
        assignees: formattedUsers,
        tags: formattedTags,
        absoluteDate: data.absolutedates || false,
        startsin: data.startsin?.toString() || "",
        startsInDuration: data.startsinduration || "Days",
        duein: data.duein?.toString() || "",
        dueinduration: data.dueinduration || "Days",
      startDate: data.startdate
  ? new Date(data.startdate).toISOString().split("T")[0]
  : "",

dueDate: data.enddate
  ? new Date(data.enddate).toISOString().split("T")[0]
  : "",
        SubtaskSwitch: data.issubtaskschecked || false,
      });

      setDescription(data.description || "");
      setSubtasks(data.subtasks || [{ id: "1", text: "" }]);
      setCheckedSubtasks(
        data.subtasks?.filter((s) => s.checked).map((s) => s.id) || []
      );
    } catch (err) {
      showToast({
        title: "Failed to load template",
        description: err?.response?.data?.message || "An error occurred while loading the template",
        type: "error",
      });
    }
  };

  // Delete Template
  const handleDelete = async (id) => {
    try {
      await templateAPI.deleteTaskTemplate(id);
      showToast({
        title: "Deleted successfully",
        description: "The task template has been deleted.",
        type: "success",
      });
      await fetchTaskData();
    } catch (err) {
      showToast({
        title: "Delete failed",
        description: err?.response?.data?.message || "An error occurred while deleting the template",
        type: "error",
      });
    }
  };

  // Reset and Close - This function now properly resets everything
  const resetAndClose = () => {
    // Reset all state
    setEditingId(null);
    setShowForm(false);
    setSubtasks([{ id: "1", text: "" }]);
    setCheckedSubtasks([]);
    setDescription("");
    setGlobalFilter(""); // Optional: reset global filter
    
    // Reset form to default values
    form.reset({
      templatename: "",
      status: "No status",
      priority: "Medium",
      description: "",
      assignees: [],
      tags: [],
      absoluteDate: false,
      startsin: "",
      startsInDuration: "Days",
      duein: "",
      dueinduration: "Days",
      startDate: "",
      dueDate: "",
      SubtaskSwitch: false,
    });
  };

  const handleTaskCancel = () => {
    resetAndClose();
  };

  const handleCreateTask = () => {
    // Reset everything before showing the form
    resetAndClose();
    // Then show the form
    setShowForm(true);
  };

  // Table Columns
  const taskColumns = [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleEdit(row.original._id)}
        >
          {row.original.templatename}
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-32">
          <Status
            onStatusChange={() => {}}
            selectedStatus={row.original.status}
          />
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <div className="w-28">
          <Priority
            onPriorityChange={() => {}}
            selectedPriority={row.original.priority}
          />
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <PiDotsThreeOutlineVerticalThin className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
              <RiEdit2Line className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                confirm({
                  title: "Delete Template",
                   description: (
        <>
          Are you sure you want to delete the template{" "}
          <span className="font-semibold text-red-600">
            "{row.original.templatename}"
          </span>
          ?
        </>
      ),
                  // description: "Are you sure you want to delete this template ?",
                  onConfirm: async () => {
                    await handleDelete(row.original._id);
                  },
                });
              }}
              className="text-destructive"
            >
              <RiDeleteBin6Line className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6">
      {!showForm ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateTask}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Task
            </Button>
          </div>

          <DataTableToolbar
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />

          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <DataTable
              columns={taskColumns}
              data={TaskTemplates}
              loading={loading}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              enableRowSelection={false}
              getRowId={(row) => row._id}
              emptyMessage="No task templates found"
              emptyDescription="Create your first task template to get started"
              pageSize={10}
            />
          )}
        </div>
      ) : (
        <Form {...form}>
          <FormPage
            title={editingId ? "Edit Task Template" : "Create Task Template"}
            subtitle="Configure your task template settings"
            actions={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTaskCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={createSaveTaskTemp}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={createTaskTemp}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save & Exit"}
                </Button>
              </>
            }
          >
            <FormGrid sidebarWidth="sm">
              {/* LEFT COLUMN */}
              <FormGrid.Main>
                {/* General Section */}
                <FormSection
                  title="General"
                  icon={<FileText className="h-4 w-4" />}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="templatename"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel >
                            Template Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter template name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Status
                              onStatusChange={field.onChange}
                              selectedStatus={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignees</FormLabel>
                          <FormControl>
                            <MultiSelectDropdown
                              value={field.value || []}
                              onChange={field.onChange}
                              placeholder="Select assignees"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Priority
                              onPriorityChange={field.onChange}
                              selectedPriority={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormSection>

                {/* Description Section */}
                <FormSection title="Description">
                  {/* <Editor
                    onChange={handleEditorChange}
                    value={form.watch("description")}
                  /> */}
                  <TextEditor
                    value={form.watch("description")}
                    onChange={(content) => {
                      form.setValue("description", content);
                      setDescription(content);
                    }}
                  />
                </FormSection>

                {/* Tags Section */}
                <FormSection title="Tags">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TagsMultiSelectDropDown
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select or search tags"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                {/* Dates Section */}
                <FormSection title="Dates" icon={<Calendar className="h-4 w-4" />}>
                  <FormField
                    control={form.control}
                    name="absoluteDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormSwitchRow
                            label="Use absolute dates"
                            description="Set fixed calendar dates instead of relative offsets"
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("absoluteDate") ? (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                     
                      <FormField
  control={form.control}
  name="startDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Start Date</FormLabel>
      <FormControl>
        <Input
          type="date"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="dueDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Due Date</FormLabel>
      <FormControl>
        <Input
          type="date"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                    </div>
                  ) : (
                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
                        <span className="text-sm font-medium text-foreground pb-2">
                          Start in
                        </span>
                        <FormField
                          control={form.control}
                          name="startsin"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="0"
                                  type="number"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startsInDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                  {...field}
                                >
                                  {dayOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
                        <span className="text-sm font-medium text-foreground pb-2">
                          Due in
                        </span>
                        <FormField
                          control={form.control}
                          name="duein"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="0"
                                  type="number"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueinduration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                  {...field}
                                >
                                  {dayOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </FormSection>
              </FormGrid.Main>

              {/* RIGHT COLUMN */}
              <FormGrid.Sidebar>
                <FormSection
                  title="Subtasks"
                  icon={<ListChecks className="h-4 w-4" />}
                  description="Add checklist items to this task template"
                >
                  <FormField
                    control={form.control}
                    name="SubtaskSwitch"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormSwitchRow
                            label="Enable subtasks"
                            description="Show a subtask checklist on every task created from this template"
                            checked={!!field.value}
                            onCheckedChange={(val) => {
                              field.onChange(val);
                              handleSubtaskSwitch(val);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("SubtaskSwitch") && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="subtaskList">
                        {(provided) => (
                          <div
                            className="space-y-2 mt-4"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {subtasks.map((subtask, index) => (
                              <Draggable
                                key={subtask.id}
                                draggableId={subtask.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <FormSubtaskItem
                                      text={subtask.text}
                                      checked={checkedSubtasks.includes(
                                        subtask.id
                                      )}
                                      onTextChange={(val) =>
                                        handleInputChange(subtask.id, val)
                                      }
                                      onCheckedChange={() =>
                                        handleCheckboxChange(subtask.id)
                                      }
                                      onDelete={() =>
                                        handleDeleteSubtask(subtask.id)
                                      }
                                      dragHandleProps={provided.dragHandleProps}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <FormSubtaskAdd onClick={handleAddSubtask} />
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

export default Tasks;