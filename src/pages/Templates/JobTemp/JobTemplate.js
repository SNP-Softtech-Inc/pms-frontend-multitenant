


import React, { useState, useEffect, useMemo, useRef,useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {useToastContext} from "../../../context/ToastContext"
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import debounce from "lodash/debounce";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { FormPage, FormSection, FormRow, FormGrid, FormDatePicker } from "../../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { Plus, Trash2, MessageSquarePlus, Pencil } from "lucide-react";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import ShortcodeTextField from "../../../components/ShortcodeTextField";
import { templateAPI } from "../../../services/api";
import Priority from "../../../components/Priority";
import EditorShortcodes from "../../../components/TextEditorShortCodes";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

dayjs.extend(customParseFormat);

const jobSchema = z.object({
  templatename: z.string().min(1, "Template name is required"),
  jobName: z.string().min(1, "Job name is required"),
  assignees: z.array(z.any()).optional(),
  priority: z.string().optional(),
  description: z.string().optional(),
  absoluteDate: z.boolean().optional(),
  startDate: z.any().optional(),
  dueDate: z.any().optional(),
  startsin: z.coerce.number().optional(),
  startsInDuration: z.string().optional(),
  duein: z.coerce.number().optional(),
  dueinduration: z.string().optional(),
  clientFacingStatus: z.boolean().optional(),
  inputText: z.string().optional(),
  selectedJob: z.any().optional(),
  clientDescription: z.string().optional(),
  comments: z.array(z.string()).optional(),
});

// Shortcode definitions
const ACCOUNT_SHORTCUTS = [
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

const JobTemp = ({ charLimit = 4000 }) => {
  const confirm = useConfirm();
  const {showToast} = useToastContext();
  const [showForm, setShowForm] = useState(false);
  const [shortcuts] = useState(ACCOUNT_SHORTCUTS);
  const [filteredShortcuts, setFilteredShortcuts] = useState(ACCOUNT_SHORTCUTS);
  const [charCount, setCharCount] = useState(0);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [JobTemplates, setJobTemplates] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  
  // Shortcode dropdown states
  const [showJobNameDropdown, setShowJobNameDropdown] = useState(false);
  const [showClientJobNameDropdown, setShowClientJobNameDropdown] = useState(false);
  const [showDescriptionDropdown, setShowDescriptionDropdown] = useState(false);
  const [anchorElJobName, setAnchorElJobName] = useState(null);
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDescription] = useState(null);

  const textFieldRef = useRef(null);
  const clientJobNameRef = useRef(null);
  const descriptionFieldRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      templatename: "",
      jobName: "",
      assignees: [],
      priority: "Medium",
      description: "",
      absoluteDate: false,
      startDate: null,
      dueDate: null,
      startsin: 0,
      startsInDuration: "Days",
      duein: 0,
      dueinduration: "Days",
      clientFacingStatus: false,
      inputText: "",
      selectedJob: null,
      clientDescription: "",
      comments: [],
    },
  });

  // Helper function to insert shortcode at cursor position
  const insertShortcode = (fieldName, shortcut, inputRef) => {
    const currentValue = form.getValues(fieldName) || "";
    const newValue = currentValue.slice(0, cursorPosition) + 
                    `[${shortcut}]` + 
                    currentValue.slice(cursorPosition);
    
    form.setValue(fieldName, newValue, { shouldDirty: true });
    
    // Update char count for description field
    if (fieldName === "clientDescription") {
      setCharCount(newValue.length);
    }
    
    // Set cursor position after insertion
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.focus();
        const newCursorPos = cursorPosition + shortcut.length + 2;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
      }
    }, 0);
  };

  // Shortcode handlers
  const handleJobNameShortcut = (shortcut) => {
    insertShortcode("jobName", shortcut, textFieldRef);
    setShowJobNameDropdown(false);
  };

  const handleClientJobNameShortcut = (shortcut) => {
    insertShortcode("inputText", shortcut, clientJobNameRef);
    setShowClientJobNameDropdown(false);
  };

  const handleDescriptionShortcut = (shortcut) => {
    const currentValue = form.getValues("clientDescription") || "";
    const newValue = currentValue.slice(0, cursorPosition) + 
                    `[${shortcut}]` + 
                    currentValue.slice(cursorPosition);
    
    if (newValue.length <= charLimit) {
      form.setValue("clientDescription", newValue, { shouldDirty: true });
      setCharCount(newValue.length);
      
      setTimeout(() => {
        if (descriptionFieldRef.current) {
          descriptionFieldRef.current.focus();
          const newCursorPos = cursorPosition + shortcut.length + 2;
          descriptionFieldRef.current.setSelectionRange(newCursorPos, newCursorPos);
          setCursorPosition(newCursorPos);
        }
      }, 0);
    } else {
      showToast({
        title: "Warning",
        description: `Description cannot exceed ${charLimit} characters`,
        type: "warning",
      });
    }
    setShowDescriptionDropdown(false);
  };

  // Dropdown toggle handlers
  const toggleJobNameDropdown = (event) => {
    setAnchorElJobName(event.currentTarget);
    setShowJobNameDropdown(!showJobNameDropdown);
  };

  const toggleClientJobNameDropdown = (event) => {
    setAnchorElClientJob(event.currentTarget);
    setShowClientJobNameDropdown(!showClientJobNameDropdown);
  };

  const toggleDescriptionDropdown = (event) => {
    setAnchorElDescription(event.currentTarget);
    setShowDescriptionDropdown(!showDescriptionDropdown);
  };

  const closeJobNameDropdown = () => {
    setShowJobNameDropdown(false);
    setAnchorElJobName(null);
  };

  const closeClientJobNameDropdown = () => {
    setShowClientJobNameDropdown(false);
    setAnchorElClientJob(null);
  };

  const closeDescriptionDropdown = () => {
    setShowDescriptionDropdown(false);
    setAnchorElDescription(null);
  };

  // Fetch client facing jobs
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await templateAPI.getAllJobStatus();
      setClientFacingJobs(response.data.clientFacingJobStatues || []);
    } catch (error) {
      console.error("Error fetching client facing jobs:", error);
      showToast({
        title: "Error",
        description: "Failed to fetch client facing jobs",
        type: "error",
      });
    }
  };

  // Fetch job templates
  const fetchJobTemplatesData = async () => {
    setLoading(true);
    try {
      const response = await templateAPI.getAllJobTemplates();
      setJobTemplates(response.data.JobTemplates || []);
    } catch (error) {
      console.error("Error fetching job templates:", error);
      showToast({
        title: "Error",
        description: "Failed to fetch job templates",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch single job template for editing
  const fetchJobTemplateData = async (templateId) => {
    setSubmitting(true);
    try {
      const response = await templateAPI.getJobTemplateById(templateId);
      const template = response.data.jobTemplate;

      if (template) {
        form.reset({
          templatename: template.templatename || "",
          jobName: template.jobname || "",
          assignees: (template.jobassignees || []).map((assignee) => ({
            value: assignee._id,
            label: assignee.username,
          })),
          priority: template.priority || "Medium",
          description: template.description || "",
          absoluteDate: template.absolutedates || false,
          startDate: template.startdate ? dayjs(template.startdate) : null,
          dueDate: template.enddate ? dayjs(template.enddate) : null,
          startsin: template.startsin || 0,
          startsInDuration: template.startsinduration || "Days",
          duein: template.duein || 0,
          dueinduration: template.dueinduration || "Days",
          clientFacingStatus: template.showinclientportal || false,
          inputText: template.jobnameforclient || "",
          selectedJob: template.clientfacingstatus ? {
            value: template.clientfacingstatus,
            label: clientFacingJobs.find(s => s._id === template.clientfacingstatus)?.clientfacingName,
          } : null,
          clientDescription: template.clientfacingDescription || "",
          comments: template.comments || [],
        });
        setDescription(template.description || "");
        setCharCount((template.clientfacingDescription || "").length);
        setEditingId(templateId);
      }
    } catch (error) {
      console.error("Error fetching job template:", error);
      showToast({
        title: "Error",
        description: "Failed to fetch job template details",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Check template name exists
  const checkTemplateName = async (name) => {
    if (!name.trim() || editingId) return;
    try {
      const response = await templateAPI.checkJobTemplateNameExists(name);
      if (response.data.exists) {
        form.setError("templatename", { type: "manual", message: "Template name already exists" });
      } else {
        form.clearErrors("templatename");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else form.clearErrors("templatename");
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "templatename") debouncedCheck(value.templatename);
    });
    return () => {
      subscription.unsubscribe();
      debouncedCheck.cancel();
    };
  }, [form.watch, editingId]);

  useEffect(() => {
    fetchClientFacingJobsData();
    fetchJobTemplatesData();
  }, []);

  // Submit handlers
  const submitJob = async (values, exitAfterSave) => {
    const formData = values.absoluteDate
      ? {
          templatename: values.templatename,
          jobname: values.jobName,
          jobassignees: (values.assignees || []).map((o) => o.value),
          priority: values.priority,
          description: description,
          absolutedates: true,
          comments: values.comments || [],
          showinclientportal: values.clientFacingStatus,
          jobnameforclient: values.inputText,
          clientfacingstatus: values.selectedJob?.value,
          startdate: values.startDate,
          enddate: values.dueDate,
          clientfacingDescription: values.clientDescription,
        }
      : {
          templatename: values.templatename,
          jobname: values.jobName,
          jobassignees: (values.assignees || []).map((o) => o.value),
          priority: values.priority,
          description: description,
          absolutedates: false,
          startsin: values.startsin,
          startsinduration: values.startsInDuration,
          duein: values.duein,
          dueinduration: values.dueinduration,
          comments: values.comments || [],
          showinclientportal: values.clientFacingStatus,
          jobnameforclient: values.inputText,
          clientfacingstatus: values.selectedJob?.value,
          clientfacingDescription: values.clientDescription,
        };

    try {
      if (editingId) {
        await templateAPI.updateJobTemplate(editingId, formData);
        showToast({
          title: "Success",
          description: "Job Template updated successfully",
          type: "success",
        });
      } else {
        await templateAPI.createJobTemplate(formData);
        showToast({
          title: "Success",
          description: "Job Template created successfully",
          type: "success",
        });
      }

      await fetchJobTemplatesData();

      if (exitAfterSave) {
        setShowForm(false);
        setEditingId(null);
        form.reset();
        setDescription("");
        setCharCount(0);
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "create"} Job Template`,
        type: "error",
      });
    }
  };

  const handleSaveAndExit = form.handleSubmit((values) => submitJob(values, true));
  const handleSave = form.handleSubmit((values) => submitJob(values, false));

  const handleEdit = (templateId) => {
    fetchJobTemplateData(templateId);
    setShowForm(true);
  };

  const handleDelete = async (templateId,templateName) => {
    confirm({
      title: "Delete Job Template",
      // description: "Are you sure you want to delete this job template?",

      description: (
        <>
          Are you sure you want to delete this job{" "}
          <span className="font-semibold text-red-600">
            "{templateName}"
          </span>
          ?
        </>
      ),
      onConfirm: async () => {
        try {
          await templateAPI.deleteJobTemplate(templateId);
          showToast({
            title: "Success",
            description: "Job Template deleted successfully",
            type: "success",
          });
          fetchJobTemplatesData();
        } catch (error) {
          console.error(error);
          showToast({
            title: "Error",
            description: "Failed to delete Job Template",
            type: "error",
          });
        }
      },
    });
  };

  const handleCreateJobTemplate = () => {
    setEditingId(null);
    form.reset({
      templatename: "",
      jobName: "",
      assignees: [],
      priority: "Medium",
      description: "",
      absoluteDate: false,
      startDate: null,
      dueDate: null,
      startsin: 0,
      startsInDuration: "Days",
      duein: 0,
      dueinduration: "Days",
      clientFacingStatus: false,
      inputText: "",
      selectedJob: null,
      clientDescription: "",
      comments: [],
    });
    setDescription("");
    setCharCount(0);
    setShowForm(true);
  };

  const handleCloseJobTemp = () => {
    if (form.formState.isDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) return;
    }
    setShowForm(false);
    setEditingId(null);
    form.reset();
    setDescription("");
    setCharCount(0);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
    form.setValue("description", content, { shouldDirty: true });
  };

  const handleJobChange = async (value) => {
    const selected = optionstatus.find((s) => s.value === value) || null;
    form.setValue("selectedJob", selected, { shouldDirty: true });
    if (selected && selected.value) {
      try {
        const response = await templateAPI.getJobStatusById(selected.value);
        const desc = response.data.clientfacingjobstatuses?.clientfacingdescription || "";
        form.setValue("clientDescription", desc, { shouldDirty: true });
        setCharCount(desc.length);
      } catch (error) {
        console.error("Error fetching job status:", error);
      }
    }
  };

  // Comment handlers
  const comments = form.watch("comments") || [];
  const addCommentField = () => {
    form.setValue("comments", [...comments, ""], { shouldDirty: true });
  };
  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    form.setValue("comments", updatedComments, { shouldDirty: true });
  };
  const deleteCommentField = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    form.setValue("comments", updatedComments, { shouldDirty: true });
  };

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  const jobColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
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
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            // onClick={() => handleDelete(row.original._id)}
            onClick={()=> handleDelete(row.original._id, row.original.templatename)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div>
      {!showForm ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateJobTemplate}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Job Template
            </Button>
          </div>
          <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <DataTable
            columns={jobColumns}
            data={JobTemplates}
            loading={loading}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection={false}
            getRowId={(row) => row._id}
            emptyMessage="No job templates found"
            emptyDescription="Create your first job template to get started"
            pageSize={30}
          />
        </div>
      ) : (
        <Form {...form}>
          <FormPage
            title={editingId ? "Edit Job Template" : "Create Job Template"}
            subtitle="Configure your job template settings"
            actions={
              <>
                <Button type="button" variant="outline" onClick={handleCloseJobTemp} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="button" variant="secondary" onClick={handleSave} disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
                <Button type="button" onClick={handleSaveAndExit} disabled={submitting}>
                  {submitting ? "Saving..." : "Save & Exit"}
                </Button>
              </>
            }
          >
            <FormGrid>
              {/* LEFT COLUMN */}
              <FormGrid.Main>
                <FormSection title="General Information">
                  <FormField
                    control={form.control}
                    name="templatename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Template Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Name</FormLabel>
                        <FormControl>
                          <ShortcodeTextField
                            label=""
                            value={field.value}
                            onChange={(e) => {
                              const { value, selectionStart } = e.target;
                              field.onChange(value);
                              setCursorPosition(selectionStart);
                            }}
                            placeholder="Job Name"
                            inputRef={textFieldRef}
                            onClick={(e) => setCursorPosition(e.target.selectionStart)}
                            shortcuts={filteredShortcuts}
                            showShortcutDropdown={showJobNameDropdown}
                            anchorElShortcut={anchorElJobName}
                            onToggleShortcutDropdown={toggleJobNameDropdown}
                            onCloseShortcutDropdown={closeJobNameDropdown}
                            onAddShortcut={handleJobNameShortcut}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Assignment">
                  <FormField
                    control={form.control}
                    name="assignees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Assignees</FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Job Assignees"
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
                            onPriorityChange={(val) => field.onChange(val)}
                            selectedPriority={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Description">
                  <EditorShortcodes 
                    onChange={handleEditorChange} 
                    initialContent={description}
                  />
                </FormSection>

                <FormSection title="Start and Due Date">
                  <FormField
                    control={form.control}
                    name="absoluteDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Absolute Date</Label>
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("absoluteDate") && (
                    <FormRow cols={2}>
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <FormDatePicker {...field} />
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
                              <FormDatePicker {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormRow>
                  )}

                  {!form.watch("absoluteDate") && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Label className="w-16 shrink-0 text-sm">Start In</Label>
                        <FormField
                          control={form.control}
                          name="startsin"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input type="number" className="flex-1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startsInDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dayOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="w-16 shrink-0 text-sm">Due In</Label>
                        <FormField
                          control={form.control}
                          name="duein"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input type="number" className="flex-1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueinduration"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dayOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
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
                <FormSection title="Client-Facing Status">
                  <FormField
                    control={form.control}
                    name="clientFacingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Show in Client Portal</Label>
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("clientFacingStatus") && (
                    <div className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="inputText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Name for Client</FormLabel>
                            <FormControl>
                              <ShortcodeTextField
                                label=""
                                value={field.value}
                                onChange={(e) => {
                                  const { value, selectionStart } = e.target;
                                  field.onChange(value);
                                  setCursorPosition(selectionStart);
                                }}
                                placeholder="Job name for client"
                                inputRef={clientJobNameRef}
                                onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                shortcuts={filteredShortcuts}
                                showShortcutDropdown={showClientJobNameDropdown}
                                anchorElShortcut={anchorElClientJob}
                                onToggleShortcutDropdown={toggleClientJobNameDropdown}
                                onCloseShortcutDropdown={closeClientJobNameDropdown}
                                onAddShortcut={handleClientJobNameShortcut}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="selectedJob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              value={field.value?.value || ""}
                              onValueChange={handleJobChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Client Facing Job" />
                              </SelectTrigger>
                              <SelectContent>
                                {optionstatus.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: opt.clientfacingColour }}
                                      />
                                      {opt.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <ShortcodeTextField
                                label=""
                                value={field.value}
                                onChange={(e) => {
                                  const { value, selectionStart } = e.target;
                                  if (value.length <= charLimit) {
                                    field.onChange(value);
                                    setCursorPosition(selectionStart);
                                    setCharCount(value.length);
                                  }
                                }}
                                placeholder="Description"
                                inputRef={descriptionFieldRef}
                                onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                shortcuts={filteredShortcuts}
                                showShortcutDropdown={showDescriptionDropdown}
                                anchorElShortcut={anchorElDescription}
                                onToggleShortcutDropdown={toggleDescriptionDropdown}
                                onCloseShortcutDropdown={closeDescriptionDropdown}
                                onAddShortcut={handleDescriptionShortcut}
                                multiline
                                rows={4}
                                maxLength={charLimit}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </FormSection>

                <FormSection title="Comments">
                  <div className="space-y-3">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Textarea
                          value={comment}
                          onChange={(e) => handleCommentChange(index, e.target.value)}
                          placeholder={`Comment ${index + 1}`}
                          rows={2}
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => deleteCommentField(index)}
                          className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addCommentField} 
                      className="w-full"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
                      Add Comment
                    </Button>
                  </div>
                </FormSection>
              </FormGrid.Sidebar>
            </FormGrid>
          </FormPage>
        </Form>
      )}
    </div>
  );
};

export default JobTemp;