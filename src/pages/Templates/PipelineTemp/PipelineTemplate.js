import { useState } from "react";
import { useEffect } from "react";

import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from "@mui/material";
import StagesSection from "./StagesSection";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { templateAPI, authAPI } from "../../../services/api";
const PipelineForm = () => {
  const [pipelineName, setPipelineName] = useState("");
  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
    console.log(selectedOptions);
  };

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

  const [Account_id, setAccount_id] = useState(false);
  const handleAccount_idChange = (event) => {
    setAccount_id(event.target.checked);
  };
  const [Days_on_stage, setDays_on_stage] = useState(false);
  const handleDays_on_stageChange = (event) => {
    setDays_on_stage(event.target.checked);
  };
  const [Account_tags, setAccount_tags] = useState(false);
  const handleAccount_tagsChange = (event) => {
    setAccount_tags(event.target.checked);
  };
  const [clientFacing_status, setClientFacing_status] = useState(false);
  const handleClientFacing_status = (event) => {
    setClientFacing_status(event.target.checked);
  };
  const [startDate, setStartDate] = useState(false);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.checked);
  };
  const [Name, setName] = useState(false);
  const handleNameSwitchChange = (event) => {
    setName(event.target.checked);
  };
  const [Due_date, setDue_date] = useState(false);
  const handleDue_dateChange = (event) => {
    setDue_date(event.target.checked);
  };
  const [Priority, setPriority] = useState(false);
  const [Description, setDescription] = useState(false);
  const [Assignees, setAssignees] = useState(false);
  const handlePriorityChange = (event) => {
    setPriority(event.target.checked);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.checked);
  };
  const handleAssigneesChange = (event) => {
    setAssignees(event.target.checked);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
  };

  //Default Jobt template get
  const [Defaulttemp, setDefaultTemp] = useState([]);
  const [selectedJobtemp, setselectedJobTemp] = useState(null);
  const handleJobtemp = (selectedOptions) => {
    setselectedJobTemp(selectedOptions);
    console.log("selcted job template", selectedOptions);
  };
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

    // Insert new stage at the specified index
    const updatedStages = [...stages];
    updatedStages.splice(index, 0, newStage);

    setStages(updatedStages);
    setStageNameErrors([...stageNameErrors]);
  };

  const handleStageNameChange = (e, index) => {
    const updatedStages = [...stages];
    updatedStages[index].name = e.target.value;
    setStages(updatedStages);

    // Clear error when user starts typing
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
  // Validate form before saving
  const validateForm = () => {
    const errors = {};

    if (!pipelineName.trim()) {
      errors.pipelineName = "Pipeline name is required";
    }

    if (stages.length < 2) {
      errors.stages = "Please add at least 2 stages";
    }

    // Validate stage names
    const stageErrors = stages.map((stage, index) => {
      if (!stage.name.trim()) {
        return `Stage ${index + 1} name is required`;
      }
      return "";
    });

    if (stageErrors.some((error) => error !== "")) {
      errors.stageNames = stageErrors;
    }

    return errors;
  };
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

      setPipelineName(pipeline.pipelineName);

      if (pipeline?.availableto) {
        const assigneesData = pipeline.availableto.map((a) => ({
          value: a._id,
          label: a.username,
        }));

        setSelectedUser(assigneesData);
        setCombinedValues(assigneesData.map((a) => a.value));
      }

      if (pipeline?.sortjobsby) {
        setSelectedSortByJob({
          value: pipeline.sortjobsby._id,
          label: pipeline.sortjobsby.description,
        });
      }

      if (pipeline?.defaultjobtemplate) {
        setselectedJobTemp({
          value: pipeline.defaultjobtemplate._id,
          label: pipeline.defaultjobtemplate.templatename,
        });
      }

      // switches
      setAccount_id(pipeline.accountId || false);
      setDays_on_stage(pipeline.days_on_Stage || false);
      setAccount_tags(pipeline.accounttags || false);
      setClientFacing_status(pipeline.clientFacing_status || false);
      setStartDate(pipeline.startdate || false);
      setName(pipeline.name || false);
      setDue_date(pipeline.duedate || false);
      setPriority(pipeline.priority || false);
      setDescription(pipeline.description || false);
      setAssignees(pipeline.assignees || false);

      // stages
      if (pipeline?.stages?.length) {
        const formattedStages = pipeline.stages.map((stage, index) => ({
          _id: stage._id,
          name: stage.name,
          order: stage.order || index + 1,
          conditions: stage.conditions || [],
          automations: stage.automations || [],
          autoMove: stage.autoMove || false,
          showDropdown: false,
          activeAction: null,
        }));

        setStages(formattedStages);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  };
  const handleSavePipeline = async (exitAfterSave = false) => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      if (errors.pipelineName) toast.error("Pipeline name is required");
      if (errors.stages) toast.error("Please add at least 2 stages");

      if (errors.stageNames) {
        setStageNameErrors(errors.stageNames);
        const count = errors.stageNames.filter((e) => e).length;
        if (count) toast.error(`${count} stage name(s) are required`);
      }

      return;
    }

    setLoading(true);

    try {
      const pipelineData = {
        pipelineName: pipelineName.trim(),
        availableto: combinedValues,
        sortjobsby: selectedSortByJob?.value,
        defaultjobtemplate: selectedJobtemp?.value,
        accountId: Account_id,
        description: Description,
        duedate: Due_date,
        accounttags: Account_tags,
        priority: Priority,
        days_on_Stage: Days_on_stage,
        assignees: Assignees,
        name: Name,
        clientFacing_status,
        startdate: startDate,
        stages: stages.map((stage, index) => ({
          ...(stage._id && { _id: stage._id }),
          name: stage.name.trim(),
          order: stage.order || index + 1,
          conditions: stage.conditions || [],
          // automations:
          //   stage.automations?.map((auto) => ({
          //     ...auto,
          //     selectedtemp:
          //       auto.selectedtemp?.value || auto.selectedtemp || null,
          //   })) || [],
          automations: stage.automations?.map((auto, i) => ({
  type: auto.type,
  index: auto.index || i + 1,

  selectedtemp:
    auto.selectedtemp?.value || auto.selectedtemp || null,

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
})) || [],
          autoMove: stage.autoMove || false,
        })),
        active: true,
      };

      let result;
console.log("Pipeline data to save:", pipelineData);
      if (isEditMode || pipelineId) {
        const { data } = await templateAPI.updatePipeline(
          pipelineId,
          pipelineData,
        );
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

      toast.success(
        isEditMode || pipelineId
          ? "Pipeline updated successfully!"
          : "Pipeline created successfully!",
      );

      if (exitAfterSave) {
        navigate("/firmtemp/pipelines");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save pipeline");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  // Update the cancel handler
  const handleCancel = () => {
    // window.location.href = "/firmtemp/pipelines";
    navigate("/firmtemp/pipelines");
  };

  // Handle save (without exiting)
  const handleSave = () => {
    handleSavePipeline(false);
  };

  // Handle save and exit
  const handleSaveAndExit = () => {
    handleSavePipeline(true);
  };

  return (
    <Box p={3}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h6">
          {isEditMode ? "Edit Pipeline" : "Create Pipeline"}
        </Typography>
      </Box>
      <Divider sx={{ mt: 1, margin: "0 auto" }} />
      <Box p={3}>
        <Grid container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* RIGHT SIDE – FORM INPUTS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Box>
                <Typography variant="subtitle1" mb={1}>Pipeline Name</Typography>
                <TextField
                  fullWidth
                  value={pipelineName}
                  onChange={(e) => setPipelineName(e.target.value)}
                  size="small"
                  // margin="normal"
                 
                  placeholder="Pipeline Name"
                />
              </Box>

              <Box mt={3}>
                 <Typography variant="subtitle1" mb={1}>Available To</Typography>

                <MultiSelectDropdown
                  value={selectedUser}
                  onChange={handleUserChange}
                  placeholder="Job Assignees"
                />
              </Box>

              <Box mt={3}>
                 <Typography variant="subtitle1" mb={1}>Sort jobs by</Typography>
                <Autocomplete
                  options={optionsort}
                  value={selectedSortByJob}
                  onChange={(e, v) => handleSortingByJobs(v)}
                  size="small"
                  sx={{ mt: 1, background: "#fff" }}
                  getOptionLabel={(o) => o.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Sort By Job" />
                  )}
                />
              </Box>

              <Box mt={3}>
                 <Typography variant="subtitle1" mb={1}>Default job template</Typography>
                <Autocomplete
                  options={optiontemp}
                  value={selectedJobtemp}
                  onChange={(e, v) => handleJobtemp(v)}
                  size="small"
                  sx={{ mt: 1, background: "#fff" }}
                  getOptionLabel={(o) => o.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Default job template" />
                  )}
                />
              </Box>
            </Box>
          </Grid>
          {/* LEFT SIDE – JOB CARD FIELDS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box p={2} sx={{ background: "#fff", borderRadius: "10px" }}>
              {/* <Typography variant="h6" mb={2}>
                Job card fields
              </Typography> */}
<Typography variant="subtitle1" mb={1}>
                          Job card fields
                        </Typography>
              <Grid container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {/* COLUMN 1 */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ width: 200, pt: 1, pb: 1 }}>
                    {" "}
                    {/* Fixed width */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Account_id}
                          onChange={handleAccount_idChange}
                        />
                      }
                      label="Account ID"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Days_on_stage}
                          onChange={handleDays_on_stageChange}
                        />
                      }
                      label="Days in stage"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Account_tags}
                          onChange={handleAccount_tagsChange}
                        />
                      }
                      label="Account tags"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={clientFacing_status}
                          onChange={handleClientFacing_status}
                        />
                      }
                      label="Client-facing Status"
                    />
                  </Box>
                </Grid>

                {/* COLUMN 2 */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ width: 200, pt: 1, pb: 1 }}>
                    {" "}
                    {/* Same fixed width */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={startDate}
                          onChange={handleStartDateChange}
                        />
                      }
                      label="Start date"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Name}
                          onChange={handleNameSwitchChange}
                        />
                      }
                      label="Name"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Due_date}
                          onChange={handleDue_dateChange}
                        />
                      }
                      label="Due date"
                    />
                  </Box>
                </Grid>

                {/* COLUMN 3 */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ width: 200, pt: 1, pb: 1 }}>
                    {" "}
                    {/* Same fixed width */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Description}
                          onChange={handleDescriptionChange}
                        />
                      }
                      label="Description"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Assignees}
                          onChange={handleAssigneesChange}
                        />
                      }
                      label="Assignees"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Priority}
                          onChange={handlePriorityChange}
                        />
                      }
                      label="Priority"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* STAGES SECTION */}
        <Box m={2}>
          {" "}
          <StagesSection
            stages={stages}
            stageNameErrors={stageNameErrors}
            handleAddStage={handleAddStage}
            handleDeleteStage={handleDeleteStage}
            handleStageNameChange={handleStageNameChange}
            handleSaveAutomations={handleSaveAutomations}
          />
        </Box>
      </Box>

      {/* Update button labels to be more clear */}
      <Box display="flex" gap={2} mt={4}>
        <Button
          variant="contained"
          sx={{ borderRadius: "15px" }}
          onClick={handleSaveAndExit}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : isEditMode || pipelineId
              ? "Update & exit"
              : "Save & exit"}
        </Button>
        <Button
          variant="contained"
          sx={{ borderRadius: "15px" }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : isEditMode || pipelineId ? "Update" : "Save"}
        </Button>
        <Button
          variant="outlined"
          sx={{ borderRadius: "15px" }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default PipelineForm;
