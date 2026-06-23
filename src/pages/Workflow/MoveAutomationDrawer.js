// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   CircularProgress,Chip,IconButton
// } from "@mui/material";
// import { toast } from "react-toastify";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { jobAPI,templateAPI,proposalAPI,organizerAPI,folderManagementAPI } from "../../services/api";
// import CloseIcon from "@mui/icons-material/Close";

// const MoveAutomationDrawer = ({
//   open,
//   onClose,
//   automations = [],
//   jobId,
//   stageId,
// }) => {
//   const queryClient = useQueryClient();
// console.log("automation for move",automations)
//   const [selectedAutomations, setSelectedAutomations] = useState([]);
//   const [templateData, setTemplateData] = useState({});
//   const [tagData, setTagData] = useState({});
//   const [clientFacingJobs, setClientFacingJobs] = useState([]);

//   // ✅ Select all by default
//   useEffect(() => {
//     if (automations.length > 0) {
//       setSelectedAutomations(automations.map((_, i) => i));
//     }
//   }, [automations]);

//   // ✅ Fetch client statuses
//   useEffect(() => {
//     const fetchStatuses = async () => {
//       try {
//         const res = await templateAPI.getAllJobStatus();
//         setClientFacingJobs(res.data.clientFacingJobStatues || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchStatuses();
//   }, []);

//   const clientStatusOptions = clientFacingJobs.map((status) => ({
//     value: status._id,
//     label: status.clientfacingName,
//     clientfacingColour: status.clientfacingColour,
//   }));

//   // ✅ Fetch Template Name
//   const fetchTemplateData = async (templateId, type) => {
//     try {
//       switch (type) {
//         case "EmailTemplate":
//           return (await templateAPI.getEmailTemplateById(templateId))
//             ?.data?.emailTemplate?.templatename;

//         case "TaskTemplate":
//           return (await templateAPI.getTaskTemplateById(templateId))
//             ?.data?.taskTemplate?.templatename;

//         case "InvoiceTemplate":
//           return (await templateAPI.getInvoiceTemplateById(templateId))
//             ?.data?.invoiceTemplate?.templatename;

//         case "ChatTemplate":
//           return (await templateAPI.getChatTemplateById(templateId))
//             ?.data?.chatTemplate?.templatename;

//         case "ProposalTemplate":
//           return (await proposalAPI.getProposalById(templateId))
//             ?.data?.templatename;

//         case "OrganizerTemplate":
//           return (await organizerAPI.getOrganizerTemplateById(templateId))
//             ?.data?.organizerTemplate?.templatename;

//         case "FolderTemplate":
//           return (await folderManagementAPI.getFolderTemplateById(templateId))
//             ?.data?.template?.templatename;

//         default:
//           return null;
//       }
//     } catch {
//       return "Error loading template";
//     }
//   };

//   // ✅ Fetch Tags
//   const fetchTagDetails = async (tagIds = []) => {
//     const res = await Promise.all(
//       tagIds.map(async (id) => {
//         try {
//           const r = await templateAPI.getTagById(id);
//           return r.data.tag;
//         } catch {
//           return null;
//         }
//       })
//     );
//     return res.filter(Boolean);
//   };

//   // ✅ Init template + tag data
//   useEffect(() => {
//     const init = async () => {
//       const tempObj = {};
//       const tagObj = {};

//       for (let i = 0; i < automations.length; i++) {
//         const auto = automations[i];

//         if (auto.selectedtemp && auto.refModel) {
//           tempObj[i] = await fetchTemplateData(
//             auto.selectedtemp,
//             auto.refModel
//           );
//         }

//         tagObj[i] = {
//           selectedTags: await fetchTagDetails(auto.selectedTags),
//           addTags: await fetchTagDetails(auto.addTags),
//           removeTags: await fetchTagDetails(auto.removeTags),
//         };
//       }

//       setTemplateData(tempObj);
//       setTagData(tagObj);
//     };

//     if (automations.length) init();
//   }, [automations]);

//   // ✅ Checkbox
//   const handleCheckboxChange = (index) => {
//     setSelectedAutomations((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index]
//     );
//   };

//   // ✅ Mutation
//   const runAutomationMutation = useMutation({
//     mutationFn: (payload) => jobAPI.runStageAutomation(payload),

//     onSuccess: (res) => {
//       toast.success(res?.data?.message || "Automation executed");
//       queryClient.invalidateQueries(["pipeline-jobs"]);
//       onClose();
//     },

//     onError: (err) => {
//       toast.error(err?.response?.data?.message || "Automation failed");
//     },
//   });

//   // ✅ Move handler
//   const handleMove = () => {
//     const selectedAutos = selectedAutomations
//       .map((i) => automations[i])
//       .filter(Boolean);

//     if (!selectedAutos.length) {
//       toast.warning("Select at least one automation");
//       return;
//     }

//     runAutomationMutation.mutate({
//       jobId,
//       stageId,
//       automations: selectedAutos,
//     });
//   };

//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <Box sx={{ width: 500, p: 2 }}>
//         <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
//         <Typography variant="h6" fontWeight="bold" mb={2}>
//           Stage Automations 
//         </Typography>
//         <IconButton onClick={onClose}>
//                   <CloseIcon />
//                 </IconButton>
// </Box>
//         {automations.map((automation, index) => {
//           const tagInfo = tagData[index] || {};
//           const templateName = templateData[index];

//           return (
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
//                     {automation.type}
//                   </Typography>
//                 }
//               />

//               {/* Template */}
//               {templateName && (
//                 <Typography variant="body2" mt={1}>
//                   Template: {templateName}
//                 </Typography>
//               )}

//               {/* Add Assignees */}
//               {automation.addAssignees?.length > 0 && (
//                 <Box mt={1}>
//                   <Typography color="success.main">
//                     Add Assignees:
//                   </Typography>
//                   {automation.addAssignees.map((a, i) => (
//                     <Chip key={i} label={a.username} size="small" />
//                   ))}
//                 </Box>
//               )}

//               {/* Remove Assignees */}
//               {automation.removeAssignees?.length > 0 && (
//                 <Box mt={1}>
//                   <Typography color="error.main">
//                     Remove Assignees:
//                   </Typography>
//                   {automation.removeAssignees.map((a, i) => (
//                     <Chip
//                       key={i}
//                       label={a.username}
//                       size="small"
//                       sx={{ textDecoration: "line-through" }}
//                     />
//                   ))}
//                 </Box>
//               )}

//               {/* Tags */}
//               {tagInfo.selectedTags?.length > 0 && (
//                 <Box mt={1}>
//                   <Typography>Condition Tags:</Typography>
//                   {tagInfo.selectedTags.map((tag) => (
//                     <Chip
//                       key={tag._id}
//                       label={tag.tagName}
//                       sx={{ backgroundColor: tag.tagColour, color: "#fff" }}
//                       size="small"
//                     />
//                   ))}
//                 </Box>
//               )}

//               {/* Client Status */}
//               {automation.type === "Update client-facing job status" && (
//                 <Box mt={1} display="flex" alignItems="center" gap={1}>
//                   <Box
//                     sx={{
//                       width: 10,
//                       height: 10,
//                       borderRadius: "50%",
//                       backgroundColor:
//                         clientStatusOptions.find(
//                           (c) => c.value === automation.selectedClientStatus
//                         )?.clientfacingColour || "#ccc",
//                     }}
//                   />
//                   <Typography>
//                     {
//                       clientStatusOptions.find(
//                         (c) => c.value === automation.selectedClientStatus
//                       )?.label
//                     }
//                   </Typography>
//                 </Box>
//               )}

//               {/* Add Tags */}
// {automation.type === "Update account tags" &&
//   tagInfo.addTags?.length > 0 && (
//     <Box mt={1}>
//       <Typography color="success.main">Add Tags:</Typography>
//       <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
//         {tagInfo.addTags.map((tag) => (
//           <Chip
//             key={tag._id}
//             label={tag.tagName}
//             sx={{
//               backgroundColor: tag.tagColour,
//               color: "#fff",
//               border: "2px solid #4caf50",
//             }}
//             size="small"
//           />
//         ))}
//       </Box>
//     </Box>
//   )}
//   {/* Remove Tags */}
// {automation.type === "Update account tags" &&
//   tagInfo.removeTags?.length > 0 && (
//     <Box mt={1}>
//       <Typography color="error.main">Remove Tags:</Typography>
//       <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
//         {tagInfo.removeTags.map((tag) => (
//           <Chip
//             key={tag._id}
//             label={tag.tagName}
//             sx={{
//               backgroundColor: tag.tagColour,
//               color: "#fff",
//               textDecoration: "line-through",
//               border: "2px solid #f44336",
//             }}
//             size="small"
//           />
//         ))}
//       </Box>
//     </Box>
//   )}
//             </Box>
//           );
//         })}

//         <Box display="flex" gap={2} mt={3}>
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleMove}
//             disabled={runAutomationMutation.isPending}
//           >
//             {runAutomationMutation.isPending ? (
//               <CircularProgress size={20} />
//             ) : (
//               "Move"
//             )}
//           </Button>

//           <Button fullWidth variant="outlined" onClick={onClose}>
//             Cancel
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };
// export default MoveAutomationDrawer;

import React, { useState, useEffect } from "react";
import { useToastContext } from "../../context/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobAPI, templateAPI, proposalAPI, organizerAPI, folderManagementAPI } from "../../services/api";
import { X, AlertCircle } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";

const MoveAutomationDrawer = ({
  open,
  onClose,
  automations = [],
  jobId,
  stageId,username
}) => {
  console.log("automation for move", username);
  const queryClient = useQueryClient();
const {showToast}=useToastContext()
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
            ?.data?.data?.templatename;

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
  const handleCheckboxChange = (index, checked) => {
    setSelectedAutomations((prev) =>
      checked
        ? [...prev, index]
        : prev.filter((i) => i !== index)
    );
  };

  // ✅ Mutation
  const runAutomationMutation = useMutation({
    mutationFn: (payload) => jobAPI.runStageAutomation(payload),

    onSuccess: (res) => {
          showToast({
      title: "Automation executed",
      description: res?.data?.message,
      type: "success",
    });

      queryClient.invalidateQueries(["pipeline-jobs"]);
      onClose();
    },

    onError: (err) => {
showToast({
      title: "Automation failed",
      description:
        err?.response?.data?.message ||
        "An error occurred while running the automation.",
      type: "error",
    });
    },
  });

  // ✅ Move handler
  const handleMove = () => {
    const selectedAutos = selectedAutomations
      .map((i) => automations[i])
      .filter(Boolean);

    // if (!selectedAutos.length) {
    //   toast.warning("Select at least one automation");
    //   return;
    // }

    runAutomationMutation.mutate({
      jobId,
      stageId,
      automations: selectedAutos,
      username: username
    });
  };

  const isProcessing = runAutomationMutation.isPending;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Drawer Content */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">Stage Automations</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              {automations.map((automation, index) => {
                const tagInfo = tagData[index] || {};
                const templateName = templateData[index];

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`automation-${index}`}
                        checked={selectedAutomations.includes(index)}
                        onCheckedChange={(checked) => handleCheckboxChange(index, checked)}
                      />
                      <Label
                        htmlFor={`automation-${index}`}
                        className="font-semibold text-base cursor-pointer"
                      >
                        {automation.type}
                      </Label>
                    </div>

                    {/* Template */}
                    {templateName && (
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Template:</span>
                        <p className="text-sm">{templateName}</p>
                      </div>
                    )}

                    {/* Add Assignees */}
                    {automation.addAssignees?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-green-600">Add Assignees:</span>
                        <div className="flex flex-wrap gap-2">
                          {automation.addAssignees.map((a, i) => (
                            <Badge
                              key={i}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              {a.username}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remove Assignees */}
                    {automation.removeAssignees?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-red-600">Remove Assignees:</span>
                        <div className="flex flex-wrap gap-2">
                          {automation.removeAssignees.map((a, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="border-red-500 text-red-600 line-through"
                            >
                              {a.username}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {tagInfo.selectedTags?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Condition Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {tagInfo.selectedTags.map((tag) => (
                            <Badge
                              key={tag._id}
                              style={{ backgroundColor: tag.tagColour }}
                              className="text-white"
                            >
                              {tag.tagName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Client Status */}
                    {automation.type === "Update client-facing job status" && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Client Status:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                clientStatusOptions.find(
                                  (c) => c.value === automation.selectedClientStatus
                                )?.clientfacingColour || "#ccc",
                            }}
                          />
                          <span className="text-sm">
                            {clientStatusOptions.find(
                              (c) => c.value === automation.selectedClientStatus
                            )?.label}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Add Tags */}
                    {automation.type === "Update account tags" &&
                      tagInfo.addTags?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-green-600">Add Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {tagInfo.addTags.map((tag) => (
                              <Badge
                                key={tag._id}
                                style={{ backgroundColor: tag.tagColour }}
                                className="text-white border-2 border-green-500"
                              >
                                {tag.tagName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Remove Tags */}
                    {automation.type === "Update account tags" &&
                      tagInfo.removeTags?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-red-600">Remove Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {tagInfo.removeTags.map((tag) => (
                              <Badge
                                key={tag._id}
                                style={{ backgroundColor: tag.tagColour }}
                                className="text-white line-through border-2 border-red-500"
                              >
                                {tag.tagName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Warning for Account Tags Automation */}
                    {automation.type === "Update account tags" && (
                      // <Alert variant="destructive" className="mt-2">
                      //   <AlertCircle className="h-4 w-4" />
                      //   <AlertDescription>
                      //     This automation can affect conditions for automations below
                      //   </AlertDescription>
                      // </Alert>
                        <Alert className="border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/30">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-700 dark:text-amber-300">
                          This automation can affect conditions for automations below.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={isProcessing}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              "Move"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoveAutomationDrawer;