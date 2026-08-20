// import { useState } from "react";
// import { useEffect } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   Autocomplete,
//   TextField,
//   Switch,
//   FormControlLabel,
//   Grid,
//   Divider,
// } from "@mui/material";
// import StagesSection from "./StagesSection";
// import { toast } from "react-toastify";
// import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
// import { useLocation, useNavigate } from "react-router-dom";
// import { templateAPI, authAPI } from "../../../services/api";
// const PipelineForm = () => {
//   const [pipelineName, setPipelineName] = useState("");
//   // sort jobs
//   const [sortbyjobs, setSortbyJobs] = useState([]);
//   const [selectedSortByJob, setSelectedSortByJob] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const handleSortingByJobs = (selectedOptions) => {
//     setSelectedSortByJob(selectedOptions);
//     console.log(selectedOptions);
//   };

//   useEffect(() => {
//     fetchSortByJob();
//   }, []);

//   const fetchSortByJob = async () => {
//     try {
//       const { data } = await templateAPI.getAllSortJobsBy();
//       setSortbyJobs(data.sortJobsBy || data);
//     } catch (error) {
//       console.error("Error fetching sort jobs:", error);
//     }
//   };

//   const optionsort = sortbyjobs.map((sort) => ({
//     value: sort._id,
//     label: sort.description,
//   }));

//   const [Account_id, setAccount_id] = useState(false);
//   const handleAccount_idChange = (event) => {
//     setAccount_id(event.target.checked);
//   };
//   const [Days_on_stage, setDays_on_stage] = useState(false);
//   const handleDays_on_stageChange = (event) => {
//     setDays_on_stage(event.target.checked);
//   };
//   const [Account_tags, setAccount_tags] = useState(false);
//   const handleAccount_tagsChange = (event) => {
//     setAccount_tags(event.target.checked);
//   };
//   const [clientFacing_status, setClientFacing_status] = useState(false);
//   const handleClientFacing_status = (event) => {
//     setClientFacing_status(event.target.checked);
//   };
//   const [startDate, setStartDate] = useState(false);
//   const handleStartDateChange = (event) => {
//     setStartDate(event.target.checked);
//   };
//   const [Name, setName] = useState(false);
//   const handleNameSwitchChange = (event) => {
//     setName(event.target.checked);
//   };
//   const [Due_date, setDue_date] = useState(false);
//   const handleDue_dateChange = (event) => {
//     setDue_date(event.target.checked);
//   };
//   const [Priority, setPriority] = useState(false);
//   const [Description, setDescription] = useState(false);
//   const [Assignees, setAssignees] = useState(false);
//   const handlePriorityChange = (event) => {
//     setPriority(event.target.checked);
//   };
//   const handleDescriptionChange = (event) => {
//     setDescription(event.target.checked);
//   };
//   const handleAssigneesChange = (event) => {
//     setAssignees(event.target.checked);
//   };

//   const [selectedUser, setSelectedUser] = useState([]);
//   const [combinedValues, setCombinedValues] = useState([]);

//   const handleUserChange = (newSelectedUsers) => {
//     setSelectedUser(newSelectedUsers);
//     const selectedValues = newSelectedUsers.map((option) => option.value);
//     setCombinedValues(selectedValues);
//   };

//   //Default Jobt template get
//   const [Defaulttemp, setDefaultTemp] = useState([]);
//   const [selectedJobtemp, setselectedJobTemp] = useState(null);
//   const handleJobtemp = (selectedOptions) => {
//     setselectedJobTemp(selectedOptions);
//     console.log("selcted job template", selectedOptions);
//   };
//   useEffect(() => {
//     fetchtemp();
//   }, []);

//   const fetchtemp = async () => {
//     try {
//       const { data } = await templateAPI.getAllJobTemplates();
//       setDefaultTemp(data.JobTemplates || data);
//     } catch (error) {
//       console.error("Error fetching templates:", error);
//     }
//   };
//   const optiontemp = Defaulttemp.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   // Stages functionality
//   const [stages, setStages] = useState([]);
//   const [stageNameErrors, setStageNameErrors] = useState([]);

//   const handleAddStage = (index) => {
//     const newStage = {
//       name: "",
//       conditions: [],
//       automations: [],
//       autoMove: false,
//       showDropdown: false,
//       activeAction: null,
//     };

//     // Insert new stage at the specified index
//     const updatedStages = [...stages];
//     updatedStages.splice(index, 0, newStage);

//     setStages(updatedStages);
//     setStageNameErrors([...stageNameErrors]);
//   };

//   const handleStageNameChange = (e, index) => {
//     const updatedStages = [...stages];
//     updatedStages[index].name = e.target.value;
//     setStages(updatedStages);

//     // Clear error when user starts typing
//     const updatedErrors = [...stageNameErrors];
//     updatedErrors[index] = "";
//     setStageNameErrors(updatedErrors);
//   };

//   const handleDeleteStage = (index) => {
//     const updatedStages = stages.filter((_, i) => i !== index);
//     setStages(updatedStages);

//     const updatedErrors = stageNameErrors.filter((_, i) => i !== index);
//     setStageNameErrors(updatedErrors);
//   };

//   const handleSaveAutomations = (stageIndex, automations) => {
//     setStages((prevStages) => {
//       const updatedStages = [...prevStages];
//       updatedStages[stageIndex] = {
//         ...updatedStages[stageIndex],
//         automations: automations,
//       };
//       return updatedStages;
//     });
//   };
//   // Save pipeline to backend
//   // Validate form before saving
//   const validateForm = () => {
//     const errors = {};

//     if (!pipelineName.trim()) {
//       errors.pipelineName = "Pipeline name is required";
//     }

//     if (stages.length < 2) {
//       errors.stages = "Please add at least 2 stages";
//     }

//     // Validate stage names
//     const stageErrors = stages.map((stage, index) => {
//       if (!stage.name.trim()) {
//         return `Stage ${index + 1} name is required`;
//       }
//       return "";
//     });

//     if (stageErrors.some((error) => error !== "")) {
//       errors.stageNames = stageErrors;
//     }

//     return errors;
//   };
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [pipelineId, setPipelineId] = useState(null);

//   // Get URL parameters for edit mode
//   const location = useLocation();

//   // Add this useEffect to handle edit mode
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const editId = searchParams.get("edit");

//     if (editId) {
//       setIsEditMode(true);
//       setPipelineId(editId);
//       fetchPipelineData(editId);
//     }
//   }, [location]);

//   // Fetch pipeline data for editing
//   const fetchPipelineData = async (id) => {
//     try {
//       setLoading(true);

//       const { data } = await templateAPI.getPipelineById(id);
//       const pipeline = data.pipeline;

//       setPipelineName(pipeline.pipelineName);

//       if (pipeline?.availableto) {
//         const assigneesData = pipeline.availableto.map((a) => ({
//           value: a._id,
//           label: a.username,
//         }));

//         setSelectedUser(assigneesData);
//         setCombinedValues(assigneesData.map((a) => a.value));
//       }

//       if (pipeline?.sortjobsby) {
//         setSelectedSortByJob({
//           value: pipeline.sortjobsby._id,
//           label: pipeline.sortjobsby.description,
//         });
//       }

//       if (pipeline?.defaultjobtemplate) {
//         setselectedJobTemp({
//           value: pipeline.defaultjobtemplate._id,
//           label: pipeline.defaultjobtemplate.templatename,
//         });
//       }

//       // switches
//       setAccount_id(pipeline.accountId || false);
//       setDays_on_stage(pipeline.days_on_Stage || false);
//       setAccount_tags(pipeline.accounttags || false);
//       setClientFacing_status(pipeline.clientFacing_status || false);
//       setStartDate(pipeline.startdate || false);
//       setName(pipeline.name || false);
//       setDue_date(pipeline.duedate || false);
//       setPriority(pipeline.priority || false);
//       setDescription(pipeline.description || false);
//       setAssignees(pipeline.assignees || false);

//       // stages
//       if (pipeline?.stages?.length) {
//         const formattedStages = pipeline.stages.map((stage, index) => ({
//           _id: stage._id,
//           name: stage.name,
//           order: stage.order || index + 1,
//           conditions: stage.conditions || [],
//           automations: stage.automations || [],
//           autoMove: stage.autoMove || false,
//           showDropdown: false,
//           activeAction: null,
//         }));

//         setStages(formattedStages);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load pipeline");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSavePipeline = async (exitAfterSave = false) => {
//     const errors = validateForm();

//     if (Object.keys(errors).length > 0) {
//       if (errors.pipelineName) toast.error("Pipeline name is required");
//       if (errors.stages) toast.error("Please add at least 2 stages");

//       if (errors.stageNames) {
//         setStageNameErrors(errors.stageNames);
//         const count = errors.stageNames.filter((e) => e).length;
//         if (count) toast.error(`${count} stage name(s) are required`);
//       }

//       return;
//     }

//     setLoading(true);

//     try {
//       const pipelineData = {
//         pipelineName: pipelineName.trim(),
//         availableto: combinedValues,
//         sortjobsby: selectedSortByJob?.value,
//         defaultjobtemplate: selectedJobtemp?.value,
//         accountId: Account_id,
//         description: Description,
//         duedate: Due_date,
//         accounttags: Account_tags,
//         priority: Priority,
//         days_on_Stage: Days_on_stage,
//         assignees: Assignees,
//         name: Name,
//         clientFacing_status,
//         startdate: startDate,
//         stages: stages.map((stage, index) => ({
//           ...(stage._id && { _id: stage._id }),
//           name: stage.name.trim(),
//           order: stage.order || index + 1,
//           conditions: stage.conditions || [],
//           // automations:
//           //   stage.automations?.map((auto) => ({
//           //     ...auto,
//           //     selectedtemp:
//           //       auto.selectedtemp?.value || auto.selectedtemp || null,
//           //   })) || [],
//           automations: stage.automations?.map((auto, i) => ({
//   type: auto.type,
//   index: auto.index || i + 1,

//   selectedtemp:
//     auto.selectedtemp?.value || auto.selectedtemp || null,

//   selectedTags: auto.selectedTags || [],
//   reminderChecked: auto.reminderChecked || false,
//   daysuntilNextReminder: auto.daysuntilNextReminder || "",
//   noOfReminder: auto.noOfReminder || "",

//   addTags: auto.addTags || [],
//   removeTags: auto.removeTags || [],

//   selectedAssignees: auto.selectedAssignees || [],
//   assigneesToRemove: auto.assigneesToRemove || [],

//   status: auto.status || null,
//   selectedClientStatus: auto.selectedClientStatus || null,
//   clientDescription: auto.clientDescription || "",

//   refModel: auto.refModel || null,
//   templateRefModel: auto.templateRefModel || null,
// })) || [],
//           autoMove: stage.autoMove || false,
//         })),
//         active: true,
//       };

//       let result;
// console.log("Pipeline data to save:", pipelineData);
//       if (isEditMode || pipelineId) {
//         const { data } = await templateAPI.updatePipeline(
//           pipelineId,
//           pipelineData,
//         );
//         console.log("Update response:", data);
//         result = data;
//       } else {
//         const { data } = await templateAPI.createPipeline(pipelineData);
//         result = data;

//         if (data.pipeline?._id) {
//           setPipelineId(data.pipeline._id);
//           setIsEditMode(true);
//         }
//       }

//       toast.success(
//         isEditMode || pipelineId
//           ? "Pipeline updated successfully!"
//           : "Pipeline created successfully!",
//       );

//       if (exitAfterSave) {
//         navigate("/firmtemp/pipelines");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || "Failed to save pipeline");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigate = useNavigate();
//   // Update the cancel handler
//   const handleCancel = () => {
//     // window.location.href = "/firmtemp/pipelines";
//     navigate("/firmtemp/pipelines");
//   };

//   // Handle save (without exiting)
//   const handleSave = () => {
//     handleSavePipeline(false);
//   };

//   // Handle save and exit
//   const handleSaveAndExit = () => {
//     handleSavePipeline(true);
//   };

//   return (
//     <Box p={3}>
//       <Box textAlign="center" mb={3}>
//         <Typography variant="h6">
//           {isEditMode ? "Edit Pipeline" : "Create Pipeline"}
//         </Typography>
//       </Box>
//       <Divider sx={{ mt: 1, margin: "0 auto" }} />
//       <Box p={3}>
//         <Grid container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//           {/* RIGHT SIDE – FORM INPUTS */}
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box>
//               <Box>
//                 <Typography variant="subtitle1" mb={1}>Pipeline Name</Typography>
//                 <TextField
//                   fullWidth
//                   value={pipelineName}
//                   onChange={(e) => setPipelineName(e.target.value)}
//                   size="small"
//                   // margin="normal"
                 
//                   placeholder="Pipeline Name"
//                 />
//               </Box>

//               <Box mt={3}>
//                  <Typography variant="subtitle1" mb={1}>Available To</Typography>

//                 <MultiSelectDropdown
//                   value={selectedUser}
//                   onChange={handleUserChange}
//                   placeholder="Job Assignees"
//                 />
//               </Box>

//               <Box mt={3}>
//                  <Typography variant="subtitle1" mb={1}>Sort jobs by</Typography>
//                 <Autocomplete
//                   options={optionsort}
//                   value={selectedSortByJob}
//                   onChange={(e, v) => handleSortingByJobs(v)}
//                   size="small"
//                   sx={{ mt: 1, background: "#fff" }}
//                   getOptionLabel={(o) => o.label}
//                   renderInput={(params) => (
//                     <TextField {...params} placeholder="Sort By Job" />
//                   )}
//                 />
//               </Box>

//               <Box mt={3}>
//                  <Typography variant="subtitle1" mb={1}>Default job template</Typography>
//                 <Autocomplete
//                   options={optiontemp}
//                   value={selectedJobtemp}
//                   onChange={(e, v) => handleJobtemp(v)}
//                   size="small"
//                   sx={{ mt: 1, background: "#fff" }}
//                   getOptionLabel={(o) => o.label}
//                   renderInput={(params) => (
//                     <TextField {...params} placeholder="Default job template" />
//                   )}
//                 />
//               </Box>
//             </Box>
//           </Grid>
//           {/* LEFT SIDE – JOB CARD FIELDS */}
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box p={2} sx={{ background: "#fff", borderRadius: "10px" }}>
//               {/* <Typography variant="h6" mb={2}>
//                 Job card fields
//               </Typography> */}
// <Typography variant="subtitle1" mb={1}>
//                           Job card fields
//                         </Typography>
//               <Grid container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//                 {/* COLUMN 1 */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ width: 200, pt: 1, pb: 1 }}>
//                     {" "}
//                     {/* Fixed width */}
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Account_id}
//                           onChange={handleAccount_idChange}
//                         />
//                       }
//                       label="Account ID"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Days_on_stage}
//                           onChange={handleDays_on_stageChange}
//                         />
//                       }
//                       label="Days in stage"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Account_tags}
//                           onChange={handleAccount_tagsChange}
//                         />
//                       }
//                       label="Account tags"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={clientFacing_status}
//                           onChange={handleClientFacing_status}
//                         />
//                       }
//                       label="Client-facing Status"
//                     />
//                   </Box>
//                 </Grid>

//                 {/* COLUMN 2 */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ width: 200, pt: 1, pb: 1 }}>
//                     {" "}
//                     {/* Same fixed width */}
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={startDate}
//                           onChange={handleStartDateChange}
//                         />
//                       }
//                       label="Start date"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Name}
//                           onChange={handleNameSwitchChange}
//                         />
//                       }
//                       label="Name"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Due_date}
//                           onChange={handleDue_dateChange}
//                         />
//                       }
//                       label="Due date"
//                     />
//                   </Box>
//                 </Grid>

//                 {/* COLUMN 3 */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ width: 200, pt: 1, pb: 1 }}>
//                     {" "}
//                     {/* Same fixed width */}
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Description}
//                           onChange={handleDescriptionChange}
//                         />
//                       }
//                       label="Description"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Assignees}
//                           onChange={handleAssigneesChange}
//                         />
//                       }
//                       label="Assignees"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={Priority}
//                           onChange={handlePriorityChange}
//                         />
//                       }
//                       label="Priority"
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>
//         </Grid>

//         {/* STAGES SECTION */}
//         <Box m={2}>
//           {" "}
//           <StagesSection
//             stages={stages}
//             stageNameErrors={stageNameErrors}
//             handleAddStage={handleAddStage}
//             handleDeleteStage={handleDeleteStage}
//             handleStageNameChange={handleStageNameChange}
//             handleSaveAutomations={handleSaveAutomations}
//           />
//         </Box>
//       </Box>

//       {/* Update button labels to be more clear */}
//       <Box display="flex" gap={2} mt={4}>
//         <Button
//           variant="contained"
//           sx={{ borderRadius: "15px" }}
//           onClick={handleSaveAndExit}
//           disabled={loading}
//         >
//           {loading
//             ? "Saving..."
//             : isEditMode || pipelineId
//               ? "Update & exit"
//               : "Save & exit"}
//         </Button>
//         <Button
//           variant="contained"
//           sx={{ borderRadius: "15px" }}
//           onClick={handleSave}
//           disabled={loading}
//         >
//           {loading ? "Saving..." : isEditMode || pipelineId ? "Update" : "Save"}
//         </Button>
//         <Button
//           variant="outlined"
//           sx={{ borderRadius: "15px" }}
//           onClick={handleCancel}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default PipelineForm;


import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import StagesSection from "./StagesSection";
import {useToastContext} from "../../../context/ToastContext"
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Loader2, ChevronLeft } from "lucide-react";
import { templateAPI, authAPI } from "../../../services/api";
import { Checkbox } from "../../../components/ui/checkbox";
// const pipelineSchema = z.object({
//   pipelineName: z.string().min(1, "Pipeline name is required"),
//   availableto: z.array(z.any()).optional(),
//   sortjobsby: z.any().optional(),
//   defaultjobtemplate: z.any().optional(),
//   accountId: z.boolean().optional(),
//   days_on_Stage: z.boolean().optional(),
//   accounttags: z.boolean().optional(),
//   clientFacing_status: z.boolean().optional(),
//   startdate: z.boolean().optional(),
//   name: z.boolean().optional(),
//   duedate: z.boolean().optional(),
//   description: z.boolean().optional(),
//   assignees: z.boolean().optional(),
//   priority: z.boolean().optional(),
// });
const pipelineSchema = z.object({
  pipelineName: z.string().min(1, "Pipeline name is required"),

  availableto: z.array(z.any()).default([]),

  sortjobsby: z.any().nullable().optional(),

  defaultjobtemplate: z.any().nullable().optional(),

  accountId: z.boolean().default(false),
  accounttags: z.boolean().default(false),

  stageTimeLimit: z.boolean().default(false),

  name: z.boolean().default(false),
  description: z.boolean().default(false),
  priority: z.boolean().default(false),

  startdate: z.boolean().default(false),
  duedate: z.boolean().default(false),

  intakeDate: z.boolean().default(false),
  internalDeadlineDate: z.boolean().default(false),

  timeBudget: z.boolean().default(false),
  tracked: z.boolean().default(false),
  timeVariance: z.boolean().default(false),
  budgetTimeSpent: z.boolean().default(false),

  assignees: z.boolean().default(false),

  clientFacingStatus: z.boolean().default(false),

  daysInStage: z.boolean().default(false),

  days_on_Stage: z.boolean().default(false),
});
const PipelineForm = () => {
  const form = useForm({
    resolver: zodResolver(pipelineSchema),
    // defaultValues: {
    //   pipelineName: "",
    //   availableto: [],
    //   sortjobsby: null,
    //   defaultjobtemplate: null,
    //   accountId: false,
    //   days_on_Stage: false,
    //   accounttags: false,
    //   clientFacing_status: false,
    //   startdate: false,
    //   name: false,
    //   duedate: false,
    //   description: false,
    //   assignees: false,
    //   priority: false,
    // },
    defaultValues: {
  pipelineName: "",
  availableto: [],
  sortjobsby: null,
  defaultjobtemplate: null,
  accountId: false,
  accounttags: false,
  stageTimeLimit: false,
  name: false,
  description: false,
  priority: false,
  startdate: false,
  duedate: false,
  intakeDate: false,
  internalDeadlineDate: false,
  timeBudget: false,
  tracked: false,
  timeVariance: false,
  budgetTimeSpent: false,
  assignees: false,
  clientFacingStatus: false,
  daysInStage: false,
  days_on_Stage: false, // Keep for backward compatibility if needed
},
  });
const CheckboxRow = ({ name, label }) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field }) => (
      <label className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
        <Checkbox
          checked={!!field.value}
          onCheckedChange={field.onChange}
          className="h-4 w-4"
        />
        <span className="text-sm text-foreground select-none">{label}</span>
      </label>
    )}
  />
);
  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSortByJob, setSelectedSortByJob] = useState(null);
const { showToast } = useToastContext();
  useEffect(() => {
    fetchSortByJob();
  }, []);

  const fetchSortByJob = async () => {
    try {
      const { data } = await templateAPI.getAllSortJobsBy();
      setSortbyJobs(data.sortJobsBy || data);
    } catch (error) {
      console.error("Error fetching sort jobs:", error);
    }
  };

  const optionsort = sortbyjobs.map((sort) => ({
    value: sort._id,
    label: sort.description,
  }));

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await authAPI.getUsersByRoles();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  // Default Job template get
  const [Defaulttemp, setDefaultTemp] = useState([]);
  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const { data } = await templateAPI.getAllJobTemplates();
      setDefaultTemp(data.JobTemplates || data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };
  const optiontemp = Defaulttemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  // Stages functionality
  const [stages, setStages] = useState([]);
  const [stageNameErrors, setStageNameErrors] = useState([]);

  const handleAddStage = (index) => {
    const newStage = {
      name: "",
      conditions: [],
      automations: [],
      autoMove: false,
      showDropdown: false,
      activeAction: null,
    };

    const updatedStages = [...stages];
    updatedStages.splice(index, 0, newStage);

    setStages(updatedStages);
    setStageNameErrors([...stageNameErrors]);
  };

  const handleStageNameChange = (e, index) => {
    const updatedStages = [...stages];
    updatedStages[index].name = e.target.value;
    setStages(updatedStages);

    const updatedErrors = [...stageNameErrors];
    updatedErrors[index] = "";
    setStageNameErrors(updatedErrors);
  };

  const handleDeleteStage = (index) => {
    const updatedStages = stages.filter((_, i) => i !== index);
    setStages(updatedStages);

    const updatedErrors = stageNameErrors.filter((_, i) => i !== index);
    setStageNameErrors(updatedErrors);
  };

  const handleSaveAutomations = (stageIndex, automations) => {
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      updatedStages[stageIndex] = {
        ...updatedStages[stageIndex],
        automations: automations,
      };
      return updatedStages;
    });
  };

  // Save pipeline to backend
  const [isEditMode, setIsEditMode] = useState(false);
  const [pipelineId, setPipelineId] = useState(null);

  // Get URL parameters for edit mode
  const location = useLocation();

  // Add this useEffect to handle edit mode
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get("edit");

    if (editId) {
      setIsEditMode(true);
      setPipelineId(editId);
      fetchPipelineData(editId);
    }
  }, [location]);

  // Fetch pipeline data for editing
  const fetchPipelineData = async (id) => {
    try {
      setLoading(true);
      const { data } = await templateAPI.getPipelineById(id);
      const pipeline = data.pipeline;

      // Populate form with existing data
      const patchValues = {
        pipelineName: pipeline.pipelineName,
        availableto: pipeline.availableto
          ? pipeline.availableto.map((a) => ({ value: a._id, label: a.username }))
          : [],
        sortjobsby: pipeline.sortjobsby
          ? { value: pipeline.sortjobsby._id, label: pipeline.sortjobsby.description }
          : null,
        defaultjobtemplate: pipeline.defaultjobtemplate
          ? { value: pipeline.defaultjobtemplate._id, label: pipeline.defaultjobtemplate.templatename }
          : null,
        // accountId: pipeline.accountId || false,
        // days_on_Stage: pipeline.days_on_Stage || false,
        // accounttags: pipeline.accounttags || false,
        // clientFacing_status: pipeline.clientFacing_status || false,
        // startdate: pipeline.startdate || false,
        // name: pipeline.name || false,
        // duedate: pipeline.duedate || false,
        // priority: pipeline.priority || false,
        // description: pipeline.description || false,
        // assignees: pipeline.assignees || false,
         accountId: pipeline.accountId || false,
      accounttags: pipeline.accounttags || false,
      stageTimeLimit: pipeline.stageTimeLimit || false,
      name: pipeline.name || false,
      description: pipeline.description || false,
      priority: pipeline.priority || false,
      startdate: pipeline.startdate || false,
      duedate: pipeline.duedate || false,
      intakeDate: pipeline.intakeDate || false,
      internalDeadlineDate: pipeline.internalDeadlineDate || false,
      timeBudget: pipeline.timeBudget || false,
      tracked: pipeline.tracked || false,
      timeVariance: pipeline.timeVariance || false,
      budgetTimeSpent: pipeline.budgetTimeSpent || false,
      assignees: pipeline.assignees || false,
      clientFacingStatus: pipeline.clientFacingStatus || false,
      daysInStage: pipeline.daysInStage || false,
      days_on_Stage: pipeline.days_on_Stage || false,
      };
      form.reset(patchValues);

      // Set stages
      if (pipeline.stages && pipeline.stages.length > 0) {
        const formattedStages = pipeline.stages.map((stage, index) => ({
          _id: stage._id,
          name: stage.name,
          order: stage.order || index + 1,
          conditions: stage.conditions || [],
          automations: stage.automations
            ? stage.automations.map((auto) => ({
                type: auto.type,
                index: auto.index,
                selectedtemp: auto.selectedtemp,
                refModel: auto.refModel,
                templateRefModel: auto.templateRefModel,
                selectedTags: auto.selectedTags || [],
                reminderChecked: auto.reminderChecked || false,
                daysuntilNextReminder: auto.daysuntilNextReminder || "",
                noOfReminder: auto.noOfReminder || "",
                addTags: auto.addTags || [],
                removeTags: auto.removeTags || [],
                selectedAssignees: auto.selectedAssignees || [],
                assigneesToRemove: auto.assigneesToRemove || [],
                status: auto.status || null,
                selectedClientStatus: auto.selectedClientStatus || null,
                clientDescription: auto.clientDescription || "",
                template: auto.template || null,
                tags: auto.tags || [],
                _id: auto._id,
              }))
            : [],
          autoMove: stage.autoMove || false,
          showDropdown: false,
          activeAction: null,
        }));
        setStages(formattedStages);
      }
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
      // toast.error("Failed to load pipeline data");
      showToast({
            title: "failed to load",
            type: "error",
            description: error?.response?.data?.message || "An error occurred while deleting the pipeline"
          });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePipeline = async (formValues, exitAfterSave = false) => {
    if (stages.length < 2) {
      showToast({
        title: "Please add at least 2 stages",
        type: "error",
      });
      return;
    }

    const stageErrors = stages.map((stage, i) =>
      !stage.name.trim() ? `Stage ${i + 1} name is required` : ""
    );
    if (stageErrors.some((e) => e !== "")) {
      setStageNameErrors(stageErrors);
      showToast({
        title: `${stageErrors.filter((e) => e !== "").length} stage name(s) are required`,
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const pipelineData = {
        pipelineName: formValues.pipelineName.trim(),
        availableto: (formValues.availableto || []).map((o) => o.value),
        sortjobsby: formValues.sortjobsby?.value,
        defaultjobtemplate: formValues.defaultjobtemplate?.value,
        // accountId: formValues.accountId,
        // description: formValues.description,
        // duedate: formValues.duedate,
        // accounttags: formValues.accounttags,
        // priority: formValues.priority,
        // days_on_Stage: formValues.days_on_Stage,
        // assignees: formValues.assignees,
        // name: formValues.name,
        // clientFacing_status: formValues.clientFacing_status,
        // startdate: formValues.startdate,
         accountId: formValues.accountId,
      accounttags: formValues.accounttags,
      stageTimeLimit: formValues.stageTimeLimit,
      name: formValues.name,
      description: formValues.description,
      priority: formValues.priority,
      startdate: formValues.startdate,
      duedate: formValues.duedate,
      intakeDate: formValues.intakeDate,
      internalDeadlineDate: formValues.internalDeadlineDate,
      timeBudget: formValues.timeBudget,
      tracked: formValues.tracked,
      timeVariance: formValues.timeVariance,
      budgetTimeSpent: formValues.budgetTimeSpent,
      assignees: formValues.assignees,
      clientFacingStatus: formValues.clientFacingStatus,
      daysInStage: formValues.daysInStage,
      days_on_Stage: formValues.days_on_Stage,
        stages: stages.map((stage, index) => ({
          ...(stage._id && { _id: stage._id }),
          name: stage.name.trim(),
          order: stage.order || index + 1,
          conditions: stage.conditions || [],
          automations: stage.automations
            ? stage.automations.map((auto) => ({
                type: auto.type,
                index: auto.index,
                selectedtemp: auto.selectedtemp
                  ? auto.selectedtemp.value || auto.selectedtemp
                  : null,
                selectedTags: auto.selectedTags || [],
                reminderChecked: auto.reminderChecked || false,
                daysuntilNextReminder: auto.daysuntilNextReminder || "",
                noOfReminder: auto.noOfReminder || "",
                addTags: auto.addTags || [],
                removeTags: auto.removeTags || [],
                selectedAssignees: auto.selectedAssignees || [],
                assigneesToRemove: auto.assigneesToRemove || [],
                status: auto.status || null,
                selectedClientStatus: auto.selectedClientStatus || null,
                clientDescription: auto.clientDescription || "",
                refModel: auto.refModel || null,
                templateRefModel: auto.templateRefModel || null,
              }))
            : [],
          autoMove: stage.autoMove || false,
        })),
        active: true,
      };

      console.log("Pipeline data to save:", pipelineData);

      let result;

      if (isEditMode || pipelineId) {
        const { data } = await templateAPI.updatePipeline(pipelineId, pipelineData);
        console.log("Update response:", data);
        result = data;
      } else {
        const { data } = await templateAPI.createPipeline(pipelineData);
        result = data;

        if (data.pipeline?._id) {
          setPipelineId(data.pipeline._id);
          setIsEditMode(true);
        }
      }

      const successMessage = isEditMode || pipelineId ? "updated" : "created";
      showToast({
        title: `Pipeline ${successMessage} successfully!`,
        type: "success",
      });

      if (exitAfterSave) {
        navigate("/firmtemp/pipelines");
      }
    } catch (error) {
      console.error("Error saving pipeline:", error);
      showToast({
        title:
          error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "save"} pipeline. Please try again.`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/firmtemp/pipelines");
  };

  const handleSave = form.handleSubmit((values) => handleSavePipeline(values, false));
  const handleSaveAndExit = form.handleSubmit((values) => handleSavePipeline(values, true));

  const SwitchRow = ({ name, label }) => (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <label className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
          <span className="text-sm text-foreground select-none">{label}</span>
          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
        </label>
      )}
    />
  );

  return (
    <Form {...form}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {isEditMode ? "Edit Pipeline" : "Create Pipeline"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Configure pipeline settings and stages</p>
          </div>
        </div>

        {/* Main form grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT – Pipeline settings */}
          <div className="space-y-5 rounded-xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pipeline Details</h2>

            <FormField
              control={form.control}
              name="pipelineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pipeline Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availableto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available To</FormLabel>
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
              name="sortjobsby"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort jobs by</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={field.value?.value ?? ""}
                      onChange={(e) => {
                        const found = optionsort.find((o) => o.value === e.target.value);
                        field.onChange(found ?? null);
                      }}
                    >
                      <option value="">Sort By Job</option>
                      {optionsort.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultjobtemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default job template</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={field.value?.value ?? ""}
                      onChange={(e) => {
                        const found = optiontemp.find((o) => o.value === e.target.value);
                        field.onChange(found ?? null);
                      }}
                    >
                      <option value="">Default job template</option>
                      {optiontemp.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* RIGHT – Job card fields */}
          {/* <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Job Card Fields</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
              <div className="space-y-1">
                <SwitchRow name="accountId" label="Account ID" />
                <SwitchRow name="days_on_Stage" label="Days in stage" />
                <SwitchRow name="accounttags" label="Account tags" />
                <SwitchRow name="clientFacing_status" label="Client-facing Status" />
              </div>
              <div className="space-y-1">
                <SwitchRow name="startdate" label="Start date" />
                <SwitchRow name="name" label="Name" />
                <SwitchRow name="duedate" label="Due date" />
              </div>
              <div className="space-y-1">
                <SwitchRow name="description" label="Description" />
                <SwitchRow name="assignees" label="Assignees" />
                <SwitchRow name="priority" label="Priority" />
              </div>
            </div>
          </div> */}
          {/* RIGHT – Job card fields */}
{/* <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Job Card Fields</h2>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
    <div className="space-y-1">
      <SwitchRow name="accountId" label="Account ID" />
      <SwitchRow name="accounttags" label="Account tags" />
      <SwitchRow name="stageTimeLimit" label="Stage time limit" />
      <SwitchRow name="name" label="Name" />
    </div>
    <div className="space-y-1">
      <SwitchRow name="description" label="Description" />
      <SwitchRow name="priority" label="Priority" />
      <SwitchRow name="startdate" label="Start date" />
      <SwitchRow name="duedate" label="Due date" />
    </div>
    <div className="space-y-1">
      <SwitchRow name="intakeDate" label="Intake date" />
      <SwitchRow name="internalDeadlineDate" label="Internal deadline date" />
      <SwitchRow name="timeBudget" label="Time budget" />
      <SwitchRow name="tracked" label="Tracked" />
    </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-1">
    <div className="space-y-1">
      <SwitchRow name="timeVariance" label="Time variance" />
      <SwitchRow name="budgetTimeSpent" label="Budget Time Spent" />
    </div>
    <div className="space-y-1">
      <SwitchRow name="assignees" label="Assignees" />
      <SwitchRow name="clientFacingStatus" label="Client-facing status" />
    </div>
    <div className="space-y-1">
      <SwitchRow name="daysInStage" label="Days in stage" />
    </div>
  </div>
</div> */}
<div className="rounded-xl border border-border bg-background p-6 shadow-sm">
  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Job Card Fields</h2>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
    <div className="space-y-1">
      <CheckboxRow name="accountId" label="Account ID" />
      <CheckboxRow name="accounttags" label="Account tags" />
      <CheckboxRow name="stageTimeLimit" label="Stage time limit" />
      <CheckboxRow name="name" label="Name" />
    </div>
    <div className="space-y-1">
      <CheckboxRow name="description" label="Description" />
      <CheckboxRow name="priority" label="Priority" />
      <CheckboxRow name="startdate" label="Start date" />
      <CheckboxRow name="duedate" label="Due date" />
    </div>
    <div className="space-y-1">
      <CheckboxRow name="intakeDate" label="Intake date" />
      <CheckboxRow name="internalDeadlineDate" label="Internal deadline date" />
      <CheckboxRow name="timeBudget" label="Time budget" />
      <CheckboxRow name="tracked" label="Tracked" />
    </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-1">
    <div className="space-y-1">
      <CheckboxRow name="timeVariance" label="Time variance" />
      <CheckboxRow name="budgetTimeSpent" label="Budget Time Spent" />
    </div>
    <div className="space-y-1">
      <CheckboxRow name="assignees" label="Assignees" />
      <CheckboxRow name="clientFacingStatus" label="Client-facing status" />
    </div>
    <div className="space-y-1">
      <CheckboxRow name="daysInStage" label="Days in stage" />
    </div>
  </div>
</div>
        </div>

        {/* Stages Section */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <StagesSection
            stages={stages}
            stageNameErrors={stageNameErrors}
            handleAddStage={handleAddStage}
            handleDeleteStage={handleDeleteStage}
            handleStageNameChange={handleStageNameChange}
            handleSaveAutomations={handleSaveAutomations}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button onClick={handleSaveAndExit} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : isEditMode || pipelineId ? "Update & Exit" : "Save & Exit"}
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : isEditMode || pipelineId ? "Update" : "Save"}
          </Button>
          <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </Form>
  );
};

export default PipelineForm;