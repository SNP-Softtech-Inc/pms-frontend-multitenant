import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,Chip,IconButton
} from "@mui/material";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobAPI,templateAPI,proposalAPI,organizerAPI,folderManagementAPI } from "../../services/api";
import CloseIcon from "@mui/icons-material/Close";
// const MoveAutomationDrawer = ({
//   open,
//   onClose,
//   automations = [],
//   jobId,
//   stageId,
// }) => {
//   const queryClient = useQueryClient();

//   const [selectedAutomations, setSelectedAutomations] = useState([]);

//   // ✅ Select all by default
//   useEffect(() => {
//     if (automations.length > 0) {
//       setSelectedAutomations(automations.map((_, i) => i));
//     }
//   }, [automations]);

//   // ✅ Mutation (RUN AUTOMATION + MOVE)
//   const runAutomationMutation = useMutation({
//     mutationFn: (payload) => jobAPI.runStageAutomation(payload),

//     onSuccess: (res) => {
//       toast.success(res?.data?.message || "Automation executed");

//       queryClient.invalidateQueries(["pipeline-jobs"]);
//       onClose();
//     },

//     onError: (err) => {
//       toast.error(
//         err?.response?.data?.message || "Automation failed"
//       );
//     },
//   });

//   // ✅ Checkbox handler
//   const handleCheckboxChange = (index) => {
//     setSelectedAutomations((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index]
//     );
//   };

//   // ✅ Run Automations
//   const handleMove = () => {
//     const selectedAutos = selectedAutomations
//       .map((i) => automations[i])
//       .filter(Boolean);

//     if (!selectedAutos.length) {
//       toast.warning("Select at least one automation");
//       return;
//     }

//     const payload = {
//       jobId,
//       stageId,
//       automations: selectedAutos,
//     };

//     runAutomationMutation.mutate(payload);
//   };

//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <Box sx={{ width: 450, p: 2 }}>
//         {/* Header */}
//         <Typography variant="h6" fontWeight="bold" mb={2}>
//           Stage Automations
//         </Typography>

//         {/* Automation List */}
//         {automations.length === 0 ? (
//           <Typography color="text.secondary">
//             No automations available
//           </Typography>
//         ) : (
//           automations.map((automation, index) => (
//             <Box
//               key={index}
//               sx={{
//                 mb: 2,
//                 p: 2,
//                 border: "1px solid #e0e0e0",
//                 borderRadius: 2,
//               }}
//             >
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedAutomations.includes(index)}
//                     onChange={() => handleCheckboxChange(index)}
//                   />
//                 }
//                 label={
//                   <Typography fontWeight="bold">
//                     {automation.type || "Automation"}
//                   </Typography>
//                 }
//               />

//               {/* Optional Description */}
//               {automation.description && (
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   mt={1}
//                 >
//                   {automation.description}
//                 </Typography>
//               )}
//             </Box>
//           ))
//         )}

//         {/* Actions */}
//         <Box display="flex" gap={2} mt={4}>
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleMove}
//             disabled={runAutomationMutation.isPending}
//           >
//             {runAutomationMutation.isPending ? (
//               <CircularProgress size={22} />
//             ) : (
//               "Move"
//             )}
//           </Button>

//           <Button variant="outlined" fullWidth onClick={onClose}>
//             Cancel
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

const MoveAutomationDrawer = ({
  open,
  onClose,
  automations = [],
  jobId,
  stageId,
}) => {
  const queryClient = useQueryClient();
console.log("automation for move",automations)
  const [selectedAutomations, setSelectedAutomations] = useState([]);
  const [templateData, setTemplateData] = useState({});
  const [tagData, setTagData] = useState({});
  const [clientFacingJobs, setClientFacingJobs] = useState([]);

  // ✅ Select all by default
  useEffect(() => {
    if (automations.length > 0) {
      setSelectedAutomations(automations.map((_, i) => i));
    }
  }, [automations]);

  // ✅ Fetch client statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await templateAPI.getAllJobStatus();
        setClientFacingJobs(res.data.clientFacingJobStatues || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatuses();
  }, []);

  const clientStatusOptions = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  // ✅ Fetch Template Name
  const fetchTemplateData = async (templateId, type) => {
    try {
      switch (type) {
        case "EmailTemplate":
          return (await templateAPI.getEmailTemplateById(templateId))
            ?.data?.emailTemplate?.templatename;

        case "TaskTemplate":
          return (await templateAPI.getTaskTemplateById(templateId))
            ?.data?.taskTemplate?.templatename;

        case "InvoiceTemplate":
          return (await templateAPI.getInvoiceTemplateById(templateId))
            ?.data?.invoiceTemplate?.templatename;

        case "ChatTemplate":
          return (await templateAPI.getChatTemplateById(templateId))
            ?.data?.chatTemplate?.templatename;

        case "ProposalTemplate":
          return (await proposalAPI.getProposalById(templateId))
            ?.data?.templatename;

        case "OrganizerTemplate":
          return (await organizerAPI.getOrganizerTemplateById(templateId))
            ?.data?.organizerTemplate?.templatename;

        case "FolderTemplate":
          return (await folderManagementAPI.getFolderTemplateById(templateId))
            ?.data?.template?.templatename;

        default:
          return null;
      }
    } catch {
      return "Error loading template";
    }
  };

  // ✅ Fetch Tags
  const fetchTagDetails = async (tagIds = []) => {
    const res = await Promise.all(
      tagIds.map(async (id) => {
        try {
          const r = await templateAPI.getTagById(id);
          return r.data.tag;
        } catch {
          return null;
        }
      })
    );
    return res.filter(Boolean);
  };

  // ✅ Init template + tag data
  useEffect(() => {
    const init = async () => {
      const tempObj = {};
      const tagObj = {};

      for (let i = 0; i < automations.length; i++) {
        const auto = automations[i];

        if (auto.selectedtemp && auto.refModel) {
          tempObj[i] = await fetchTemplateData(
            auto.selectedtemp,
            auto.refModel
          );
        }

        tagObj[i] = {
          selectedTags: await fetchTagDetails(auto.selectedTags),
          addTags: await fetchTagDetails(auto.addTags),
          removeTags: await fetchTagDetails(auto.removeTags),
        };
      }

      setTemplateData(tempObj);
      setTagData(tagObj);
    };

    if (automations.length) init();
  }, [automations]);

  // ✅ Checkbox
  const handleCheckboxChange = (index) => {
    setSelectedAutomations((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // ✅ Mutation
  const runAutomationMutation = useMutation({
    mutationFn: (payload) => jobAPI.runStageAutomation(payload),

    onSuccess: (res) => {
      toast.success(res?.data?.message || "Automation executed");
      queryClient.invalidateQueries(["pipeline-jobs"]);
      onClose();
    },

    onError: (err) => {
      toast.error(err?.response?.data?.message || "Automation failed");
    },
  });

  // ✅ Move handler
  const handleMove = () => {
    const selectedAutos = selectedAutomations
      .map((i) => automations[i])
      .filter(Boolean);

    if (!selectedAutos.length) {
      toast.warning("Select at least one automation");
      return;
    }

    runAutomationMutation.mutate({
      jobId,
      stageId,
      automations: selectedAutos,
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 500, p: 2 }}>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Stage Automations 
        </Typography>
        <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
</Box>
        {automations.map((automation, index) => {
          const tagInfo = tagData[index] || {};
          const templateName = templateData[index];

          return (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedAutomations.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                }
                label={
                  <Typography fontWeight="bold">
                    {automation.type}
                  </Typography>
                }
              />

              {/* Template */}
              {templateName && (
                <Typography variant="body2" mt={1}>
                  Template: {templateName}
                </Typography>
              )}

              {/* Add Assignees */}
              {automation.addAssignees?.length > 0 && (
                <Box mt={1}>
                  <Typography color="success.main">
                    Add Assignees:
                  </Typography>
                  {automation.addAssignees.map((a, i) => (
                    <Chip key={i} label={a.username} size="small" />
                  ))}
                </Box>
              )}

              {/* Remove Assignees */}
              {automation.removeAssignees?.length > 0 && (
                <Box mt={1}>
                  <Typography color="error.main">
                    Remove Assignees:
                  </Typography>
                  {automation.removeAssignees.map((a, i) => (
                    <Chip
                      key={i}
                      label={a.username}
                      size="small"
                      sx={{ textDecoration: "line-through" }}
                    />
                  ))}
                </Box>
              )}

              {/* Tags */}
              {tagInfo.selectedTags?.length > 0 && (
                <Box mt={1}>
                  <Typography>Condition Tags:</Typography>
                  {tagInfo.selectedTags.map((tag) => (
                    <Chip
                      key={tag._id}
                      label={tag.tagName}
                      sx={{ backgroundColor: tag.tagColour, color: "#fff" }}
                      size="small"
                    />
                  ))}
                </Box>
              )}

              {/* Client Status */}
              {automation.type === "Update client-facing job status" && (
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor:
                        clientStatusOptions.find(
                          (c) => c.value === automation.selectedClientStatus
                        )?.clientfacingColour || "#ccc",
                    }}
                  />
                  <Typography>
                    {
                      clientStatusOptions.find(
                        (c) => c.value === automation.selectedClientStatus
                      )?.label
                    }
                  </Typography>
                </Box>
              )}

              {/* Add Tags */}
{automation.type === "Update account tags" &&
  tagInfo.addTags?.length > 0 && (
    <Box mt={1}>
      <Typography color="success.main">Add Tags:</Typography>
      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
        {tagInfo.addTags.map((tag) => (
          <Chip
            key={tag._id}
            label={tag.tagName}
            sx={{
              backgroundColor: tag.tagColour,
              color: "#fff",
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
  tagInfo.removeTags?.length > 0 && (
    <Box mt={1}>
      <Typography color="error.main">Remove Tags:</Typography>
      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
        {tagInfo.removeTags.map((tag) => (
          <Chip
            key={tag._id}
            label={tag.tagName}
            sx={{
              backgroundColor: tag.tagColour,
              color: "#fff",
              textDecoration: "line-through",
              border: "2px solid #f44336",
            }}
            size="small"
          />
        ))}
      </Box>
    </Box>
  )}
            </Box>
          );
        })}

        <Box display="flex" gap={2} mt={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleMove}
            disabled={runAutomationMutation.isPending}
          >
            {runAutomationMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Move"
            )}
          </Button>

          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
export default MoveAutomationDrawer;