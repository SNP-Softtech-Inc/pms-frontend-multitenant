import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  accountsAPI,
  templateAPI,
  invoiceAPI,
  chatAPI,
  proposalAPI,
  organizerAPI,
  folderManagementAPI,
  jobAPI,
} from "../../services/api";

const AutomationDrawer = ({
  open,
  onClose,
  automations,
  selectedAccounts,
  accountData,
  jobData,
  onSuccess,
  selectedStage,
  selectedPipeline,
  selectedtemp,
  jobName,
  description,
  username,
  combinedAssigneesValues,
  priority,
  absoluteDate,
  startsin,
  startsInDuration,
  duein,
  dueinduration,
  clientFacingStatus,
  inputText,
  selectedJob,
  clientDescription,
  startDate,
  dueDate,
  setDrawerOpen,
  navigate,
}) => {

  const [selectedAutomations, setSelectedAutomations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [templateData, setTemplateData] = useState({});
  const [tagData, setTagData] = useState({});
  const [accountsWithTags, setAccountsWithTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);

  

  // Initialize selected automations (select all by default)
  useEffect(() => {
    if (automations && automations.length > 0) {
      const allIndices = automations.map((_, index) => index);
      setSelectedAutomations(allIndices);
    }
  }, [automations]);

  // Fetch complete account data with tags
  useEffect(() => {
    const fetchAccountsWithTags = async () => {
      if (!selectedAccounts || selectedAccounts.length === 0) return;

      setLoading(true);
      try {
        const response = await accountsAPI.getMultipleAccountsByIds({
          ids: selectedAccounts,
        });
        setAccountsWithTags(response.data);
      } catch (error) {
        console.error("Error fetching accounts with tags:", error);
        toast.error("Failed to fetch account data");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsWithTags();
  }, [selectedAccounts]);

  // Fetch client facing jobs
  useEffect(() => {
    const fetchClientFacingJobsData = async () => {
      try {
        const response = await templateAPI.getAllJobStatus();
        setClientFacingJobs(response.data.clientFacingJobStatues || []);
      } catch (error) {
        console.error("Error fetching client facing jobs:", error);
      }
    };
    fetchClientFacingJobsData();
  }, []);

  // Fetch tag details for display
  const fetchTagDetails = async (tagIds) => {
    if (!tagIds || tagIds.length === 0) return [];

    try {
      const tagDetails = await Promise.all(
        tagIds.map(async (tagId) => {
          try {
            const response = await templateAPI.getTagById(tagId);
            return response.data.tag;
          } catch (error) {
            console.error(`Error fetching tag ${tagId}:`, error);
            return null;
          }
        })
      );
      return tagDetails.filter((tag) => tag !== null);
    } catch (error) {
      console.error("Error fetching tag details:", error);
      return [];
    }
  };

  // Fetch template data for display
  const fetchTemplateData = async (templateId, templateType) => {
    if (!templateId) return null;

    try {
      switch (templateType) {
        case "EmailTemplate":
          const emailRes = await templateAPI.getEmailTemplateById(templateId);
          return emailRes.data.emailTemplate?.templatename || "Unknown Email Template";

        case "TaskTemplate":
          const taskRes = await templateAPI.getTaskTemplateById(templateId);
          return taskRes.data.taskTemplate?.templatename || "Unknown Task Template";

        case "InvoiceTemplate":
          const invoiceRes = await templateAPI.getInvoiceTemplateById(templateId);
          return invoiceRes.data.invoiceTemplate?.templatename || "Unknown Invoice Template";

        case "ChatTemplate":
          const chatRes = await templateAPI.getChatTemplateById(templateId);
          return chatRes.data.chatTemplate?.templatename || "Unknown Chat Template";

        case "ProposalTemplate":
          const proposalRes = await proposalAPI.getProposalById(templateId);
          return proposalRes.data.templatename || "Unknown Proposal Template";

        case "OrganizerTemplate":
          const organizerRes = await organizerAPI.getOrganizerTemplateById(templateId);
          return organizerRes.data.organizerTemplate?.templatename || "Unknown Organizer Template";

        case "FolderTemplate":
          const folderRes = await folderManagementAPI.getFolderTemplateById(templateId);
          return folderRes.data.template?.templatename || "Unknown Folder Template";

        default:
          return null;
      }
    } catch (error) {
      console.error(`Error fetching ${templateType}:`, error);
      return "Error loading template";
    }
  };

  // Initialize template and tag data
  useEffect(() => {
    const initializeAutomationData = async () => {
      if (!automations || automations.length === 0) return;

      const templatePromises = automations.map(async (automation, index) => {
        if (automation.selectedtemp && automation.refModel) {
          const templateName = await fetchTemplateData(
            automation.selectedtemp,
            automation.refModel
          );
          return { index, templateName };
        }
        return { index, templateName: null };
      });

      const tagPromises = automations.map(async (automation, index) => {
        const selectedTags = await fetchTagDetails(automation.selectedTags || []);
        const addTags = await fetchTagDetails(automation.addTags || []);
        const removeTags = await fetchTagDetails(automation.removeTags || []);

        return {
          index,
          selectedTags,
          addTags,
          removeTags,
        };
      });

      const templateResults = await Promise.all(templatePromises);
      const tagResults = await Promise.all(tagPromises);

      const newTemplateData = {};
      templateResults.forEach((result) => {
        newTemplateData[result.index] = result.templateName;
      });

      const newTagData = {};
      tagResults.forEach((result) => {
        newTagData[result.index] = {
          selectedTags: result.selectedTags,
          addTags: result.addTags,
          removeTags: result.removeTags,
        };
      });

      setTemplateData(newTemplateData);
      setTagData(newTagData);
    };

    initializeAutomationData();
  }, [automations]);

  // Get account tags
  const getAccountTags = (accountId) => {
    const account = accountsWithTags.find((acc) => acc._id === accountId);
    return account ? account.tags || [] : [];
  };

  // Check if automation tags match account tags
  const checkTagMatch = (automationSelectedTags, accountId) => {
    if (!automationSelectedTags || automationSelectedTags.length === 0) {
      return true;
    }

    const accountTags = getAccountTags(accountId);
    const hasMatch = automationSelectedTags.some((automationTagId) =>
      accountTags.includes(automationTagId)
    );

    return hasMatch;
  };

  // Update job assignees based on automation
  const updateJobAssignees = (automation, currentAssignees) => {
    let updatedAssignees = [...currentAssignees];

    if (automation.addAssignees) {
      automation.addAssignees.forEach((assignee) => {
        const assigneeId = assignee._id || assignee;
        if (!updatedAssignees.includes(assigneeId)) {
          updatedAssignees.push(assigneeId);
        }
      });
    }

    if (automation.removeAssignees) {
      updatedAssignees = updatedAssignees.filter(
        (assigneeId) =>
          !automation.removeAssignees.some(
            (removeAssignee) => (removeAssignee._id || removeAssignee) === assigneeId
          )
      );
    }

    return updatedAssignees;
  };

  // Handle checkbox change
  const handleCheckboxChange = (index) => {
    setSelectedAutomations((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // Main handler for Move button
  const handleMove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const selectedAutos = selectedAutomations
        .map((index) => automations[index])
        .filter(Boolean);

      // Find specific automations
      const clientStatusAutomation = selectedAutos.find(
        (auto) => auto.type === "Update client-facing job status"
      );
      const assigneesAutomation = selectedAutos.find(
        (auto) => auto.type === "Update job assignees"
      );

      // Prepare payload for the API
      let finalAssignees = [...combinedAssigneesValues];

      if (assigneesAutomation) {
        finalAssignees = updateJobAssignees(assigneesAutomation, finalAssignees);
      }

      const payload = {
        accounts: selectedAccounts,
        automations: selectedAutos,
        stageid: selectedStage?.value || selectedStage?._id,
        pipeline: selectedPipeline?.value || selectedPipeline?._id,
        jobTemplate: selectedtemp?.value || selectedtemp?._id,
        jobname: jobName,
        description: description,
        username: username,
        jobassignees: finalAssignees,
        priority: priority,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        // showinclientportal: clientStatusAutomation
        //   ? clientStatusAutomation.status
        //   : clientFacingStatus,
        // jobnameforclient: inputText,
        // clientfacingstatus: clientStatusAutomation
        //   ? clientStatusAutomation.selectedClientStatus
        //   : selectedJob?.value,
        // clientfacingDescription: clientStatusAutomation
        //   ? clientStatusAutomation.clientDescription
        //   : clientDescription,
        startdate: startDate,
        enddate: dueDate,
      };

      // Call the API to create jobs
      const response = await jobAPI.runStageAutomation(payload);

      if (response.data) {
        toast.success(response.data.message || "Jobs started successfully");
        
        // if (onSuccess) onSuccess();
        if (setDrawerOpen) setDrawerOpen(false);
        onClose();
        // if (navigate) navigate("/jobs/activejob");
      }
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const clientStatusOptions = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 550, p: 2 }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          Automations for{" "}
          <Typography variant="h6" ml={1}>
            {selectedAccounts
              .map((accountId) => {
                const account = accountData.find(
                  (acc) => acc._id === accountId
                );
                return account ? account.accountName : null;
              })
              .filter(Boolean)
              .join(", ")}
          </Typography>
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {automations.map((automation, index) => {
              const currentTagData = tagData[index] || {};
              const templateName = templateData[index] || "Loading...";

              return (
                <Box
                  key={index}
                  sx={{
                    marginBottom: 2,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedAutomations.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      }
                      label={
                        <Typography variant="h6" component="span">
                          {automation.type}
                        </Typography>
                      }
                    />
                  </Box>

                  {/* Template Information */}
                  {automation.selectedtemp && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Template:
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {templateName}
                      </Typography>
                    </Box>
                  )}

                  {/* Add Assignees Information */}
                  {automation.type === "Update job assignees" &&
                    automation.addAssignees &&
                    automation.addAssignees.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                          Add Assignees:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                          {automation.addAssignees.map((assignee, idx) => (
                            <Chip
                              key={idx}
                              label={assignee.username || assignee.label || "Assignee"}
                              sx={{
                                backgroundColor: "#4caf50",
                                color: "#fff",
                                fontWeight: "500",
                                borderRadius: "20px",
                              }}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                  {/* Remove Assignees Information */}
                  {automation.type === "Update job assignees" &&
                    automation.removeAssignees &&
                    automation.removeAssignees.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                          Remove Assignees:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                          {automation.removeAssignees.map((assignee, idx) => (
                            <Chip
                              key={idx}
                              label={assignee.username || assignee.label || "Assignee"}
                              sx={{
                                backgroundColor: "#f44336",
                                color: "#fff",
                                fontWeight: "500",
                                borderRadius: "20px",
                                textDecoration: "line-through",
                              }}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                  {/* Selected Tags (Condition Tags) */}
                  {currentTagData.selectedTags &&
                    currentTagData.selectedTags.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Condition Tags:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          {currentTagData.selectedTags.map((tag) => (
                            <Chip
                              key={tag._id}
                              label={tag.tagName}
                              sx={{
                                backgroundColor: tag.tagColour,
                                color: "#fff",
                                fontWeight: "500",
                                borderRadius: "20px",
                              }}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                  {/* Add Tags */}
                  {automation.type === "Update account tags" &&
                    currentTagData.addTags &&
                    currentTagData.addTags.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="success.main"
                        >
                          Add Tags:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          {currentTagData.addTags.map((tag) => (
                            <Chip
                              key={tag._id}
                              label={tag.tagName}
                              sx={{
                                backgroundColor: tag.tagColour,
                                color: "#fff",
                                fontWeight: "500",
                                borderRadius: "20px",
                                border: "2px solid #4caf50",
                              }}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                  {/* Remove Tags */}
                  {automation.type === "Update account tags" &&
                    currentTagData.removeTags &&
                    currentTagData.removeTags.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="error.main"
                        >
                          Remove Tags:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          {currentTagData.removeTags.map((tag) => (
                            <Chip
                              key={tag._id}
                              label={tag.tagName}
                              sx={{
                                backgroundColor: tag.tagColour,
                                color: "#fff",
                                fontWeight: "500",
                                borderRadius: "20px",
                                border: "2px solid #f44336",
                                textDecoration: "line-through",
                              }}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                  {/* Client Status Information */}
                  {automation.type === "Update client-facing job status" && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Client Status:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {automation.selectedClientStatus && (
                          <>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor:
                                  clientStatusOptions?.find(
                                    (opt) =>
                                      opt.value === automation.selectedClientStatus
                                  )?.clientfacingColour || "#ccc",
                              }}
                            />
                            <Typography variant="body2">
                              {clientStatusOptions?.find(
                                (opt) => opt.value === automation.selectedClientStatus
                              )?.label ||
                                automation.selectedClientStatus ||
                                "Not set"}
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Visibility:{" "}
                        {automation.status
                          ? "Visible to client"
                          : "Hidden from client"}
                      </Typography>
                      {automation.statusDescription && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Description: {automation.statusDescription}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Warning for Account Tags Automation */}
                  {automation.type === "Update account tags" && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      This automation can affect conditions for automations below
                    </Alert>
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 5 }}>
          <Button
            variant="contained"
            onClick={handleMove}
            disabled={isProcessing}
           
          >
            {isProcessing ? <CircularProgress size={24} /> : "Move"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (setDrawerOpen) setDrawerOpen(false);
              onClose();
            }}
           
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AutomationDrawer;