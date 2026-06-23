// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Chip,
//   Alert,
//   CircularProgress,
//   IconButton,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import {
//   accountsAPI,
//   templateAPI,
//   invoiceAPI,
//   chatAPI,
//   proposalAPI,
//   organizerAPI,
//   folderManagementAPI,
//   jobAPI,
// } from "../../services/api";
// import CloseIcon from "@mui/icons-material/Close";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// const AutomationDrawer = ({
//   open,
//   onClose,
//   automations,
//   selectedAccounts,
//   accountData,
//   selectedStage,
//   selectedPipeline,
//   selectedtemp,
//   jobName,
//   description,
//   username,
//   combinedAssigneesValues,
//   priority,
//   absoluteDate,
//   startsin,
//   startsInDuration,
//   duein,
//   dueinduration,
//   startDate,
//   dueDate,
//   setDrawerOpen,
//   jobDrwerClose,resetForm
// }) => {
// const queryClient = useQueryClient();
//   const [selectedAutomations, setSelectedAutomations] = useState([]);

//   // const [isProcessing, setIsProcessing] = useState(false);
//   const [templateData, setTemplateData] = useState({});
//   const [tagData, setTagData] = useState({});
//   const [accountsWithTags, setAccountsWithTags] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [clientFacingJobs, setClientFacingJobs] = useState([]);

  

//   // Initialize selected automations (select all by default)
//   useEffect(() => {
//     if (automations && automations.length > 0) {
//       const allIndices = automations.map((_, index) => index);
//       setSelectedAutomations(allIndices);
//     }
//   }, [automations]);

//   // Fetch complete account data with tags
//   useEffect(() => {
//     const fetchAccountsWithTags = async () => {
//       if (!selectedAccounts || selectedAccounts.length === 0) return;

//       setLoading(true);
//       try {
//         const response = await accountsAPI.getMultipleAccountsByIds({
//           ids: selectedAccounts,
//         });
//         setAccountsWithTags(response.data);
//       } catch (error) {
//         console.error("Error fetching accounts with tags:", error);
//         toast.error("Failed to fetch account data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccountsWithTags();
//   }, [selectedAccounts]);

//   // Fetch client facing jobs
//   useEffect(() => {
//     const fetchClientFacingJobsData = async () => {
//       try {
//         const response = await templateAPI.getAllJobStatus();
//         setClientFacingJobs(response.data.clientFacingJobStatues || []);
//       } catch (error) {
//         console.error("Error fetching client facing jobs:", error);
//       }
//     };
//     fetchClientFacingJobsData();
//   }, []);

//   // Fetch tag details for display


//   // Fetch template data for display
//   const fetchTemplateData = async (templateId, templateType) => {
//     if (!templateId) return null;

//     try {
//       switch (templateType) {
//         case "EmailTemplate":
//           const emailRes = await templateAPI.getEmailTemplateById(templateId);
//           return emailRes.data.emailTemplate?.templatename || "Unknown Email Template";

//         case "TaskTemplate":
//           const taskRes = await templateAPI.getTaskTemplateById(templateId);
//           return taskRes.data.taskTemplate?.templatename || "Unknown Task Template";

//         case "InvoiceTemplate":
//           const invoiceRes = await templateAPI.getInvoiceTemplateById(templateId);
//           return invoiceRes.data.invoiceTemplate?.templatename || "Unknown Invoice Template";

//         case "ChatTemplate":
//           const chatRes = await templateAPI.getChatTemplateById(templateId);
//           return chatRes.data.chatTemplate?.templatename || "Unknown Chat Template";

//         case "ProposalTemplate":
//           const proposalRes = await proposalAPI.getProposalById(templateId);
//           return proposalRes.data.templatename || "Unknown Proposal Template";

//         case "OrganizerTemplate":
//           const organizerRes = await organizerAPI.getOrganizerTemplateById(templateId);
//           return organizerRes.data.organizerTemplate?.templatename || "Unknown Organizer Template";

//         case "FolderTemplate":
//           const folderRes = await folderManagementAPI.getFolderTemplateById(templateId);
//           return folderRes.data.template?.templatename || "Unknown Folder Template";

//         default:
//           return null;
//       }
//     } catch (error) {
//       console.error(`Error fetching ${templateType}:`, error);
//       return "Error loading template";
//     }
//   };

//   // Initialize template and tag data
//   useEffect(() => {
//     const initializeAutomationData = async () => {
//       if (!automations || automations.length === 0) return;

//       const templatePromises = automations.map(async (automation, index) => {
//         if (automation.selectedtemp && automation.refModel) {
//           const templateName = await fetchTemplateData(
//             automation.selectedtemp,
//             automation.refModel
//           );
//           return { index, templateName };
//         }
//         return { index, templateName: null };
//       });

//       // const tagPromises = automations.map(async (automation, index) => {
//       //   const selectedTags = await fetchTagDetails(automation.selectedTags || []);
//       //   const addTags = await fetchTagDetails(automation.addTags || []);
//       //   const removeTags = await fetchTagDetails(automation.removeTags || []);

//       //   return {
//       //     index,
//       //     selectedTags,
//       //     addTags,
//       //     removeTags,
//       //   };
//       // });
// const tagPromises = automations.map((automation, index) => {
//   return {
//     index,
//     selectedTags: automation.selectedTags || [],
//     addTags: automation.addTags || [],
//     removeTags: automation.removeTags || [],
//   };
// });
//       const templateResults = await Promise.all(templatePromises);
//       const tagResults = await Promise.all(tagPromises);

//       const newTemplateData = {};
//       templateResults.forEach((result) => {
//         newTemplateData[result.index] = result.templateName;
//       });

//       const newTagData = {};
//       tagResults.forEach((result) => {
//         newTagData[result.index] = {
//           selectedTags: result.selectedTags,
//           addTags: result.addTags,
//           removeTags: result.removeTags,
//         };
//       });

//       setTemplateData(newTemplateData);
//       setTagData(newTagData);
//     };

//     initializeAutomationData();
//   }, [automations]);

//   // Get account tags
//   const getAccountTags = (accountId) => {
//     const account = accountsWithTags.find((acc) => acc._id === accountId);
//     return account ? account.tags || [] : [];
//   };

//   // Check if automation tags match account tags
//   const checkTagMatch = (automationSelectedTags, accountId) => {
//     if (!automationSelectedTags || automationSelectedTags.length === 0) {
//       return true;
//     }

//     const accountTags = getAccountTags(accountId);
//     const hasMatch = automationSelectedTags.some((automationTagId) =>
//       accountTags.includes(automationTagId)
//     );

//     return hasMatch;
//   };

//   // Update job assignees based on automation
//   const updateJobAssignees = (automation, currentAssignees) => {
//     let updatedAssignees = [...currentAssignees];

//     if (automation.addAssignees) {
//       automation.addAssignees.forEach((assignee) => {
//         const assigneeId = assignee._id || assignee;
//         if (!updatedAssignees.includes(assigneeId)) {
//           updatedAssignees.push(assigneeId);
//         }
//       });
//     }

//     if (automation.removeAssignees) {
//       updatedAssignees = updatedAssignees.filter(
//         (assigneeId) =>
//           !automation.removeAssignees.some(
//             (removeAssignee) => (removeAssignee._id || removeAssignee) === assigneeId
//           )
//       );
//     }

//     return updatedAssignees;
//   };

//   // Handle checkbox change
//   const handleCheckboxChange = (index) => {
//     setSelectedAutomations((prevSelected) =>
//       prevSelected.includes(index)
//         ? prevSelected.filter((i) => i !== index)
//         : [...prevSelected, index]
//     );
//   };
// const createBulkJobMutation = useMutation({
//   mutationFn: (payload) => jobAPI.createBulkJob(payload),

//   onSuccess: (response) => {
//     toast.success(response?.data?.message || "Jobs created successfully");

//     // 🔥 refresh job list
//     queryClient.invalidateQueries(["jobs-all"]);

//     if (setDrawerOpen) setDrawerOpen(false);
//     onClose();
//     jobDrwerClose();
//     resetForm();
//   },

//   onError: (error) => {
//     console.error("Operation failed:", error);
//     toast.error(
//       error.response?.data?.message || error.message || "Something went wrong"
//     );
//   },
// });
//  const isProcessing = createBulkJobMutation.isPending;
//   // Main handler for Move button
//   const handleMove = async () => {
//     if (isProcessing) return;
//     // setIsProcessing(true);

//     try {
//       const selectedAutos = selectedAutomations
//         .map((index) => automations[index])
//         .filter(Boolean);

//       // Find specific automations
//       const clientStatusAutomation = selectedAutos.find(
//         (auto) => auto.type === "Update client-facing job status"
//       );
//       const assigneesAutomation = selectedAutos.find(
//         (auto) => auto.type === "Update job assignees"
//       );

//       // Prepare payload for the API
//       let finalAssignees = [...combinedAssigneesValues];

//       if (assigneesAutomation) {
//         finalAssignees = updateJobAssignees(assigneesAutomation, finalAssignees);
//       }

//       const payload = {
//         accounts: selectedAccounts,
//         automations: selectedAutos,
//         stageid: selectedStage?.value || selectedStage?._id,
//         pipeline: selectedPipeline?.value || selectedPipeline?._id,
//         jobTemplate: selectedtemp?.value || selectedtemp?._id,
//         jobname: jobName,
//         description: description,
//         username: username,
//         jobassignees: finalAssignees,
//         priority: priority,
//         absolutedates: absoluteDate,
//         startsin: startsin,
//         startsinduration: startsInDuration,
//         duein: duein,
//         dueinduration: dueinduration,
//         startdate: startDate,
//         enddate: dueDate,
//       };

//       // Call the API to create jobs
//       // const response = await jobAPI.runStageAutomation(payload);
//      createBulkJobMutation.mutate(payload);
//     } catch (error) {
//       console.error("Operation failed:", error);
//       toast.error(error.response?.data?.message || error.message || "Something went wrong");
//     } 
//   };

//   const clientStatusOptions = clientFacingJobs.map((status) => ({
//     value: status._id,
//     label: status.clientfacingName,
//     clientfacingColour: status.clientfacingColour,
//   }));

//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <Box sx={{ width: 550, p: 2 }}>
//         <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
//         <Typography variant="h6" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//           Automations for{" "}
//           <Typography variant="h6" ml={1}>
//             {selectedAccounts
//               .map((accountId) => {
//                 const account = accountData.find(
//                   (acc) => acc._id === accountId
//                 );
//                 return account ? account.accountName : null;
//               })
//               .filter(Boolean)
//               .join(", ")}
//           </Typography>
//         </Typography>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//         </Box>

//         {loading ? (
//           <Box display="flex" justifyContent="center" p={3}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Box>
//             {automations.map((automation, index) => {
//               const currentTagData = tagData[index] || {};
//               const templateName = templateData[index] || "Loading...";

//               return (
//                 <Box
//                   key={index}
//                   sx={{
//                     marginBottom: 2,
//                     p: 2,
//                     border: "1px solid #e0e0e0",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={selectedAutomations.includes(index)}
//                           onChange={() => handleCheckboxChange(index)}
//                         />
//                       }
//                       label={
//                         <Typography variant="h6" component="span">
//                           {automation.type}
//                         </Typography>
//                       }
//                     />
//                   </Box>

//                   {/* Template Information */}
//                   {automation.selectedtemp && (
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         Template:
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {templateName}
//                       </Typography>
//                     </Box>
//                   )}

//                   {/* Add Assignees Information */}
//                   {automation.type === "Update job assignees" &&
//                     automation.addAssignees &&
//                     automation.addAssignees.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle1" fontWeight="bold" color="success.main">
//                           Add Assignees:
//                         </Typography>
//                         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                           {automation.addAssignees.map((assignee, idx) => (
//                             <Chip
//                               key={idx}
//                               label={assignee.username || assignee.label || "Assignee"}
//                               sx={{
//                                 backgroundColor: "#4caf50",
//                                 color: "#fff",
//                                 fontWeight: "500",
//                                 borderRadius: "20px",
//                               }}
//                               size="small"
//                             />
//                           ))}
//                         </Box>
//                       </Box>
//                     )}

//                   {/* Remove Assignees Information */}
//                   {automation.type === "Update job assignees" &&
//                     automation.removeAssignees &&
//                     automation.removeAssignees.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle1" fontWeight="bold" color="error.main">
//                           Remove Assignees:
//                         </Typography>
//                         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                           {automation.removeAssignees.map((assignee, idx) => (
//                             <Chip
//                               key={idx}
//                               label={assignee.username || assignee.label || "Assignee"}
//                               sx={{
//                                 backgroundColor: "#f44336",
//                                 color: "#fff",
//                                 fontWeight: "500",
//                                 borderRadius: "20px",
//                                 textDecoration: "line-through",
//                               }}
//                               size="small"
//                             />
//                           ))}
//                         </Box>
//                       </Box>
//                     )}

//                   {/* Selected Tags (Condition Tags) */}
//                   {currentTagData.selectedTags &&
//                     currentTagData.selectedTags.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           Condition Tags:
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 1,
//                             mt: 1,
//                           }}
//                         >
//                           {currentTagData.selectedTags.map((tag) => (
//                             <Chip
//                               key={tag._id}
//                               label={tag.tagName}
//                               sx={{
//                                 backgroundColor: tag.tagColour,
//                                 color: "#fff",
//                                 fontWeight: "500",
//                                 borderRadius: "20px",
//                               }}
//                               size="small"
//                             />
//                           ))}
//                         </Box>
//                       </Box>
//                     )}

//                   {/* Add Tags */}
//                   {automation.type === "Update account tags" &&
//                     currentTagData.addTags &&
//                     currentTagData.addTags.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography
//                           variant="subtitle1"
//                           fontWeight="bold"
//                           color="success.main"
//                         >
//                           Add Tags:
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 1,
//                             mt: 1,
//                           }}
//                         >
//                          {currentTagData.addTags.map((tag) => (
//   <Chip
//     key={tag._id}
//     label={tag.tagName}
//     sx={{
//       backgroundColor: tag.tagColour,
//       color: "#fff",
//     }}
//   />
// ))}
//                         </Box>
//                       </Box>
//                     )}

//                   {/* Remove Tags */}
//                   {automation.type === "Update account tags" &&
//                     currentTagData.removeTags &&
//                     currentTagData.removeTags.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography
//                           variant="subtitle1"
//                           fontWeight="bold"
//                           color="error.main"
//                         >
//                           Remove Tags:
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 1,
//                             mt: 1,
//                           }}
//                         >
//                           {/* {currentTagData.removeTags.map((tag) => (
//                             <Chip
//                               key={tag._id}
//                               label={tag.tagName}
//                               sx={{
//                                 backgroundColor: tag.tagColour,
//                                 color: "#fff",
//                                 fontWeight: "500",
//                                 borderRadius: "20px",
//                                 border: "2px solid #f44336",
//                                 textDecoration: "line-through",
//                               }}
//                               size="small"
//                             />
//                           ))} */}
//                           {currentTagData.removeTags.map((tag) => (
//   <Chip
//     key={tag._id}
//     label={tag.tagName}
//     sx={{
//       backgroundColor: tag.tagColour,
//       color: "#fff",
//     }}
//   />
// ))}
//                         </Box>
//                       </Box>
//                     )}

//                   {/* Client Status Information */}
//                   {automation.type === "Update client-facing job status" && (
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         Client Status:
//                       </Typography>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 1,
//                           mt: 1,
//                         }}
//                       >
//                         {automation.selectedClientStatus && (
//                           <>
//                             <Box
//                               sx={{
//                                 width: 12,
//                                 height: 12,
//                                 borderRadius: "50%",
//                                 backgroundColor:
//                                   clientStatusOptions?.find(
//                                     (opt) =>
//                                       opt.value === automation.selectedClientStatus
//                                   )?.clientfacingColour || "#ccc",
//                               }}
//                             />
//                             <Typography variant="body2">
//                               {clientStatusOptions?.find(
//                                 (opt) => opt.value === automation.selectedClientStatus
//                               )?.label ||
//                                 automation.selectedClientStatus ||
//                                 "Not set"}
//                             </Typography>
//                           </>
//                         )}
//                       </Box>
//                       <Typography variant="body2" sx={{ mt: 1 }}>
//                         Visibility:{" "}
//                         {automation.status
//                           ? "Visible to client"
//                           : "Hidden from client"}
//                       </Typography>
//                       {automation.statusDescription && (
//                         <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                           Description: {automation.statusDescription}
//                         </Typography>
//                       )}
//                     </Box>
//                   )}

//                   {/* Warning for Account Tags Automation */}
//                   {automation.type === "Update account tags" && (
//                     <Alert severity="warning" sx={{ mt: 2 }}>
//                       This automation can affect conditions for automations below
//                     </Alert>
//                   )}
//                 </Box>
//               );
//             })}
//           </Box>
//         )}

//         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 5 }}>
//           <Button
//             variant="contained"
//             onClick={handleMove}
//             disabled={isProcessing}
           
//           >
//             {isProcessing ? <CircularProgress size={24} /> : "Move"}
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => {
//               if (setDrawerOpen) setDrawerOpen(false);
//               onClose();
//             }}
           
//           >
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default AutomationDrawer;




import React, { useState, useEffect } from "react";
import {useToastContext} from "../../context/ToastContext";
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
import { X, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// shadcn/ui components
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

const AutomationDrawer = ({
  open,
  onClose,
  automations,
  selectedAccounts,
  accountData,
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
  startDate,
  dueDate,
  setDrawerOpen,
  jobDrwerClose,
  resetForm
}) => {
  const queryClient = useQueryClient();
  const {showToast} = useToastContext();
  const [selectedAutomations, setSelectedAutomations] = useState([]);
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
        showToast({
          title: "Failed to fetch account data",
          type: "error",
        });
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
          return taskRes.data.data?.templatename || "Unknown Task Template";

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

      const tagPromises = automations.map((automation, index) => {
        return {
          index,
          selectedTags: automation.selectedTags || [],
          addTags: automation.addTags || [],
          removeTags: automation.removeTags || [],
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
  const handleCheckboxChange = (index, checked) => {
    setSelectedAutomations((prevSelected) =>
      checked
        ? [...prevSelected, index]
        : prevSelected.filter((i) => i !== index)
    );
  };

  const createBulkJobMutation = useMutation({
    mutationFn: (payload) => jobAPI.createBulkJob(payload),
    onSuccess: (response) => {
      showToast({
        title: response?.data?.message || "Jobs created successfully",
        type: "success",
      });
      queryClient.invalidateQueries(["jobs-all"]);
      if (setDrawerOpen) setDrawerOpen(false);
      onClose();
      jobDrwerClose();
      resetForm();
    },
    onError: (error) => {
      console.error("Operation failed:", error);
      showToast({
        title: "Failed to create jobs",
        type: "error",
      });
    },
  });

  const isProcessing = createBulkJobMutation.isPending;

  // Main handler for Move button
  const handleMove = async () => {
    if (isProcessing) return;

    try {
      const selectedAutos = selectedAutomations
        .map((index) => automations[index])
        .filter(Boolean);

      const clientStatusAutomation = selectedAutos.find(
        (auto) => auto.type === "Update client-facing job status"
      );
      const assigneesAutomation = selectedAutos.find(
        (auto) => auto.type === "Update job assignees"
      );

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
        startdate: startDate,
        enddate: dueDate,
      };

      createBulkJobMutation.mutate(payload);
    } catch (error) {
      console.error("Operation failed:", error);
      showToast({
        title: "Failed to create jobs",
        type: "error",
      });
    }
  };

  const clientStatusOptions = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  if (!open) return null;

  const accountNames = selectedAccounts
    .map((accountId) => {
      const account = accountData.find((acc) => acc._id === accountId);
      return account ? account.accountName : null;
    })
    .filter(Boolean)
    .join(", ");
return (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    />

    {/* Drawer */}
    <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background border-l border-border shadow-2xl flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-card">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-base font-semibold text-foreground whitespace-nowrap">
            Automations for
          </h2>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm font-medium text-muted-foreground truncate max-w-[300px]">
                  {accountNames}
                </span>
              </TooltipTrigger>

              <TooltipContent className="bg-popover text-popover-foreground border border-border">
                <p>{accountNames}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <button
          onClick={onClose}
          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {automations.map((automation, index) => {
                const currentTagData =
                  tagData[index] || {};

                const templateName =
                  templateData[index] ||
                  "Loading...";

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4 transition-colors"
                  >
                    {/* Automation Header */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`automation-${index}`}
                        checked={selectedAutomations.includes(
                          index
                        )}
                        onCheckedChange={(
                          checked
                        ) =>
                          handleCheckboxChange(
                            index,
                            checked
                          )
                        }
                        className="mt-0.5"
                      />

                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`automation-${index}`}
                          className="text-sm font-semibold text-foreground cursor-pointer"
                        >
                          {automation.type}
                        </Label>
                      </div>
                    </div>

                    {/* Template */}
                    {automation.selectedtemp && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Template
                        </span>

                        <p className="text-sm text-foreground">
                          {templateName}
                        </p>
                      </div>
                    )}

                    {/* Add Assignees */}
                    {automation.type ===
                      "Update job assignees" &&
                      automation.addAssignees &&
                      automation.addAssignees
                        .length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
                            Add Assignees
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {automation.addAssignees.map(
                              (
                                assignee,
                                idx
                              ) => (
                                <Badge
                                  key={idx}
                                  className="bg-green-500 hover:bg-green-600 text-white border-0"
                                >
                                  {assignee.username ||
                                    assignee.label ||
                                    "Assignee"}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Remove Assignees */}
                    {automation.type ===
                      "Update job assignees" &&
                      automation.removeAssignees &&
                      automation.removeAssignees
                        .length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
                            Remove Assignees
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {automation.removeAssignees.map(
                              (
                                assignee,
                                idx
                              ) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="border-red-500 text-red-600 dark:text-red-400 line-through bg-transparent"
                                >
                                  {assignee.username ||
                                    assignee.label ||
                                    "Assignee"}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Condition Tags */}
                    {currentTagData.selectedTags &&
                      currentTagData.selectedTags
                        .length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Condition Tags
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {currentTagData.selectedTags.map(
                              (tag) => (
                                <Badge
                                  key={tag._id}
                                  style={{
                                    backgroundColor:
                                      tag.tagColour,
                                  }}
                                  className="text-white border-0"
                                >
                                  {tag.tagName}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Add Tags */}
                    {automation.type ===
                      "Update account tags" &&
                      currentTagData.addTags &&
                      currentTagData.addTags
                        .length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
                            Add Tags
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {currentTagData.addTags.map(
                              (tag) => (
                                <Badge
                                  key={tag._id}
                                  style={{
                                    backgroundColor:
                                      tag.tagColour,
                                  }}
                                  className="text-white border-0"
                                >
                                  {tag.tagName}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Remove Tags */}
                    {automation.type ===
                      "Update account tags" &&
                      currentTagData.removeTags &&
                      currentTagData.removeTags
                        .length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
                            Remove Tags
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {currentTagData.removeTags.map(
                              (tag) => (
                                <Badge
                                  key={tag._id}
                                  style={{
                                    backgroundColor:
                                      tag.tagColour,
                                  }}
                                  className="text-white border-0"
                                >
                                  {tag.tagName}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Client Status */}
                    {automation.type ===
                      "Update client-facing job status" && (
                      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                        
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Client Status
                        </span>

                        <div className="flex items-center gap-2">
                          {automation.selectedClientStatus && (
                            <>
                              <div
                                className="h-3 w-3 rounded-full border border-border"
                                style={{
                                  backgroundColor:
                                    clientStatusOptions?.find(
                                      (opt) =>
                                        opt.value ===
                                        (
                                          automation.selectedClientStatus
                                            ?._id ||
                                          automation.selectedClientStatus
                                        )
                                    )
                                      ?.clientfacingColour ||
                                    "#ccc",
                                }}
                              />

                              <span className="text-sm text-foreground">
                                {automation
                                  .selectedClientStatus
                                  ?.clientfacingName ||
                                  clientStatusOptions?.find(
                                    (opt) =>
                                      opt.value ===
                                      (
                                        automation
                                          .selectedClientStatus
                                          ?._id ||
                                        automation.selectedClientStatus
                                      )
                                  )?.label ||
                                  "Not set"}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Visibility:{" "}
                          <span className="font-medium text-foreground">
                            {automation.status
                              ? "Visible to client"
                              : "Hidden from client"}
                          </span>
                        </p>

                        {(automation.statusDescription ||
                          automation.clientDescription) && (
                          <div className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Description
                            </span>

                            <p className="text-sm text-foreground leading-relaxed">
                              {automation.statusDescription ||
                                automation.clientDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Warning */}
                    {automation.type ===
                      "Update account tags" && (
                      // <Alert
                      //   variant="destructive"
                      //   className="border-red-500/30 bg-red-500/10 dark:bg-red-950/30"
                      // >
                      //   <AlertCircle className="h-4 w-4" />

                      //   <AlertDescription>
                      //     This automation can affect
                      //     conditions for automations
                      //     below
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
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0 bg-card">
        
        <Button
          variant="outline"
          onClick={() => {
            if (setDrawerOpen)
              setDrawerOpen(false);

            onClose();
          }}
          disabled={isProcessing}
        >
          Close
        </Button>

        <Button
          onClick={handleMove}
          disabled={isProcessing}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
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
//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
//         onClick={onClose} 
//       />
      
//       {/* Drawer Content */}
//       <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
//           <div className="flex items-center gap-2">
//             <h2 className="text-base font-semibold text-foreground">Automations for</h2>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <span className="text-sm font-medium text-muted-foreground truncate max-w-[300px]">
//                     {accountNames}
//                   </span>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>{accountNames}</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Body */}
//         <ScrollArea className="flex-1">
//           <div className="p-4 space-y-4">
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {automations.map((automation, index) => {
//                   const currentTagData = tagData[index] || {};
//                   const templateName = templateData[index] || "Loading...";

//                   return (
//                     <div
//                       key={index}
//                       className="border rounded-lg p-4 space-y-3"
//                     >
//                       <div className="flex items-center space-x-2">
//                         <Checkbox
//                           id={`automation-${index}`}
//                           checked={selectedAutomations.includes(index)}
//                           onCheckedChange={(checked) => handleCheckboxChange(index, checked)}
//                         />
//                         <Label
//                           htmlFor={`automation-${index}`}
//                           className="font-semibold text-base cursor-pointer"
//                         >
//                           {automation.type}
//                         </Label>
//                       </div>

//                       {/* Template Information */}
//                       {automation.selectedtemp && (
//                         <div className="space-y-1">
//                           <span className="text-sm font-medium text-muted-foreground">Template:</span>
//                           <p className="text-sm">{templateName}</p>
//                         </div>
//                       )}

//                       {/* Add Assignees Information */}
//                       {automation.type === "Update job assignees" &&
//                         automation.addAssignees &&
//                         automation.addAssignees.length > 0 && (
//                           <div className="space-y-2">
//                             <span className="text-sm font-medium text-green-600">Add Assignees:</span>
//                             <div className="flex flex-wrap gap-2">
//                               {automation.addAssignees.map((assignee, idx) => (
//                                 <Badge
//                                   key={idx}
//                                   className="bg-green-500 hover:bg-green-600 text-white"
//                                 >
//                                   {assignee.username || assignee.label || "Assignee"}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       {/* Remove Assignees Information */}
//                       {automation.type === "Update job assignees" &&
//                         automation.removeAssignees &&
//                         automation.removeAssignees.length > 0 && (
//                           <div className="space-y-2">
//                             <span className="text-sm font-medium text-red-600">Remove Assignees:</span>
//                             <div className="flex flex-wrap gap-2">
//                               {automation.removeAssignees.map((assignee, idx) => (
//                                 <Badge
//                                   key={idx}
//                                   variant="outline"
//                                   className="border-red-500 text-red-600 line-through"
//                                 >
//                                   {assignee.username || assignee.label || "Assignee"}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       {/* Selected Tags (Condition Tags) */}
//                       {currentTagData.selectedTags &&
//                         currentTagData.selectedTags.length > 0 && (
//                           <div className="space-y-2">
//                             <span className="text-sm font-medium">Condition Tags:</span>
//                             <div className="flex flex-wrap gap-2">
//                               {currentTagData.selectedTags.map((tag) => (
//                                 <Badge
//                                   key={tag._id}
//                                   style={{ backgroundColor: tag.tagColour }}
//                                   className="text-white"
//                                 >
//                                   {tag.tagName}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       {/* Add Tags */}
//                       {automation.type === "Update account tags" &&
//                         currentTagData.addTags &&
//                         currentTagData.addTags.length > 0 && (
//                           <div className="space-y-2">
//                             <span className="text-sm font-medium text-green-600">Add Tags:</span>
//                             <div className="flex flex-wrap gap-2">
//                               {currentTagData.addTags.map((tag) => (
//                                 <Badge
//                                   key={tag._id}
//                                   style={{ backgroundColor: tag.tagColour }}
//                                   className="text-white"
//                                 >
//                                   {tag.tagName}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       {/* Remove Tags */}
//                       {automation.type === "Update account tags" &&
//                         currentTagData.removeTags &&
//                         currentTagData.removeTags.length > 0 && (
//                           <div className="space-y-2">
//                             <span className="text-sm font-medium text-red-600">Remove Tags:</span>
//                             <div className="flex flex-wrap gap-2">
//                               {currentTagData.removeTags.map((tag) => (
//                                 <Badge
//                                   key={tag._id}
//                                   style={{ backgroundColor: tag.tagColour }}
//                                   className="text-white"
//                                 >
//                                   {tag.tagName}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       {/* Client Status Information */}
//                       {/* {automation.type === "Update client-facing job status" && (
//                         <div className="space-y-2">
//                           <span className="text-sm font-medium">Client Status:</span>
//                           <div className="flex items-center gap-2">
//                             {automation.selectedClientStatus && (
//                               <>
//                                 <div
//                                   className="w-3 h-3 rounded-full"
//                                   style={{
//                                     backgroundColor:
//                                       clientStatusOptions?.find(
//                                         (opt) => opt.value === automation.selectedClientStatus
//                                       )?.clientfacingColour || "#ccc",
//                                   }}
//                                 />
//                                 <span className="text-sm">
//                                   {clientStatusOptions?.find(
//                                     (opt) => opt.value === automation.selectedClientStatus
//                                   )?.label ||
//                                     automation.selectedClientStatus ||
//                                     "Not set"}
//                                 </span>
//                               </>
//                             )}
//                           </div>
//                           <p className="text-sm">
//                             Visibility:{" "}
//                             {automation.status
//                               ? "Visible to client"
//                               : "Hidden from client"}
//                           </p>
//                           {automation.statusDescription && (
//                             <p className="text-sm text-muted-foreground">
//                               Description: {automation.statusDescription}
//                             </p>
//                           )}
//                         </div>
//                       )} */}
// {/* Client Status Information */}
// {automation.type === "Update client-facing job status" && (
//   <div className="space-y-2">
//     <span className="text-sm font-medium">Client Status:</span>

//     <div className="flex items-center gap-2">
//       {automation.selectedClientStatus && (
//         <>
//           <div
//             className="w-3 h-3 rounded-full"
//             style={{
//               backgroundColor:
//                 clientStatusOptions?.find(
//                   (opt) =>
//                     opt.value ===
//                     (automation.selectedClientStatus?._id ||
//                       automation.selectedClientStatus)
//                 )?.clientfacingColour || "#ccc",
//             }}
//           />

//           <span className="text-sm">
//             {automation.selectedClientStatus?.clientfacingName ||
//               clientStatusOptions?.find(
//                 (opt) =>
//                   opt.value ===
//                   (automation.selectedClientStatus?._id ||
//                     automation.selectedClientStatus)
//               )?.label ||
//               "Not set"}
//           </span>
//         </>
//       )}
//     </div>

//     <p className="text-sm">
//       Visibility:{" "}
//       {automation.status
//         ? "Visible to client"
//         : "Hidden from client"}
//     </p>

//     {(automation.statusDescription ||
//       automation.clientDescription) && (
//       <p className="text-sm text-muted-foreground">
//         Description:{" "}
//         {automation.statusDescription ||
//           automation.clientDescription}
//       </p>
//     )}
//   </div>
// )}
//                       {/* Warning for Account Tags Automation */}
//                       {automation.type === "Update account tags" && (
//                         <Alert variant="destructive" className="mt-2">
//                           <AlertCircle className="h-4 w-4" />
//                           <AlertDescription>
//                             This automation can affect conditions for automations below
//                           </AlertDescription>
//                         </Alert>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0">
//           <Button
//             variant="outline"
//             onClick={() => {
//               if (setDrawerOpen) setDrawerOpen(false);
//               onClose();
//             }}
//             disabled={isProcessing}
//           >
//             Close
//           </Button>
//           <Button
//             onClick={handleMove}
//             disabled={isProcessing}
//             className="bg-primary text-primary-foreground hover:bg-primary/90"
//           >
//             {isProcessing ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Processing...
//               </>
//             ) : (
//               "Move"
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
};

export default AutomationDrawer;