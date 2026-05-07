// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Divider,
//   TextField,
//   InputAdornment,
//   Menu,
//   MenuItem,
//   Drawer,
//   Grid,
//   Chip,
//   Autocomplete,
//   Checkbox,
//   InputLabel,
// } from "@mui/material";
// import ControlPointIcon from "@mui/icons-material/ControlPoint";
// import { LuPenLine } from "react-icons/lu";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { RxCross2, RxDragHandleDots2 } from "react-icons/rx";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { AiOutlineSearch } from "react-icons/ai";
// import TagsMultiSelectDropDown from "../../../components/TagsSelectDropDown";
// import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
// import {
//   templateAPI,
//   authAPI,
//   organizerAPI,
//   proposalAPI,folderManagementAPI
// } from "../../../services/api";
// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
//   handleSaveAutomations,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, setAutomationSelect] = useState();
//   const [drawerAutomations, setDrawerAutomations] = useState([]);
//   const [drawerAnchorEl, setDrawerAnchorEl] = useState(null);
//   // State for conditions drawer (shared across all automations)
//   const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
//   const [currentAutomationIndex, setCurrentAutomationIndex] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [tempSelectedTags, setTempSelectedTags] = useState([]);
//   const [filteredTags, setFilteredTags] = useState([]);
//   const [clientFacingJobs, setClientFacingJobs] = useState([]);
//   //  const [conditionsFilterTags, setConditionsFilterTags] = useState([]);

//   const [addTaskTemplates, setAddTaskTemplates] = useState([]);
//   const [addEmailTemplates, setAddEmailTemplates] = useState([]);
//   const [addChatTemplates, setAddChatTemplates] = useState([]);
//   const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
//   const [addProposalsandElsTeplates, setAddProposalsandElsTeplates] = useState(
//     [],
//   );
//   const [addOrganizerTemplates, setAddOrganizerTemplates] = useState([]);
//   const [folderTemplates, setFolderTemplates] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [users, setUsers] = useState([]);
//   useEffect(() => {
//     fetchAllData();
//     fetchUsers();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       // Fetch tags
//       const tagsResponse = await templateAPI.getAllTags();
//       const tagsData = tagsResponse.data;
//       setFilteredTags(tagsData.tags);

//       const tagsOptions = (tagsData.tags || [])
//         .map((tag) => ({
//           value: tag._id || "",
//           label: tag.tagName || "",
//           colour: tag.tagColour || "#cccccc",
//         }))
//         .filter((tag) => tag.value && tag.label);
//       setTags(tagsOptions);

//       // Fetch all templates in parallel
//       await Promise.all([
//         fetchTaskTemplates(),
//         fetchEmailTemplates(),
//         fetchChatTemplates(),
//         fetchInvoiceTemplates(),
//         fetchProposalAndElsTemplates(),
//         fetchOrganizerTemplates(),
//         fetchFolderTemplates(),
//         fetchClientFacingJobsData(),
//       ]);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const fetchTaskTemplates = async () => {
//     try {
//       const response = await templateAPI.getAllTaskTemplates();
//       setAddTaskTemplates(response.data.TaskTemplates);
//     } catch (error) {
//       console.error("Error fetching task templates:", error);
//     }
//   };

//   const fetchEmailTemplates = async () => {
//     try {
//       const response = await templateAPI.getEmailTemplates();
//       setAddEmailTemplates(response.data.emailTemplate);
//     } catch (error) {
//       console.error("Error fetching email templates:", error);
//     }
//   };

//   const fetchChatTemplates = async () => {
//     try {
//       const response = await templateAPI.getAllChatTemplates();
//       setAddChatTemplates(response.data.chatTemplate);
//     } catch (error) {
//       console.error("Error fetching chat templates:", error);
//     }
//   };

//   const fetchInvoiceTemplates = async () => {
//     try {
//       const response = await templateAPI.getAllInvoiceTemplates();
//       setAddInvoiceTemplates(response.data.invoiceTemplate);
//     } catch (error) {
//       console.error("Error fetching invoice templates:", error);
//     }
//   };

//   const fetchProposalAndElsTemplates = async () => {
//     try {
//       const response = await proposalAPI.getAllProposals();
//       setAddProposalsandElsTeplates(response.data.proposallist);
//     } catch (error) {
//       console.error("Error fetching proposal templates:", error);
//     }
//   };

//   const fetchOrganizerTemplates = async () => {
//     try {
//       const response = await organizerAPI.getOrganizerTemplates();
//       setAddOrganizerTemplates(response.data.OrganizerTemplates);
//     } catch (error) {
//       console.error("Error fetching organizer templates:", error);
//     }
//   };

//   const fetchFolderTemplates = async () => {
//   try {
//     const res = await folderManagementAPI.getFolderTemplates();
//     setFolderTemplates(res.data.folderTemplates || []);
//   } catch (error) {
//     console.error("Error fetching folder templates:", error);
//   }
// };

//   const fetchClientFacingJobsData = async () => {
//     try {
//       const response = await templateAPI.getAllJobStatus();
//       setClientFacingJobs(response.data.clientFacingJobStatues);
//     } catch (error) {
//       console.error("Error fetching client facing jobs:", error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await authAPI.getTeamMembers(); // Adjust if you have a different endpoint
//       const data = response.data;
//       const userOptions = data.map((u) => ({
//         value: u._id,
//         label: u.username,
//       }));
//       setUsers(userOptions);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   // Map data to options
//   const taskTemplateOptions = addTaskTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const emailTemplateOptions = addEmailTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const chatTemplateOptions = addChatTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const invoiceTemplateOptions = addInvoiceTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const proposalElsOptions = addProposalsandElsTeplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const organizerOptions = addOrganizerTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const optionfolder = folderTemplates.map((folderTemplates) => ({
//     value: folderTemplates._id,
//     label: folderTemplates.templatename,
//   }));

//   const optionstatus = clientFacingJobs.map((status) => ({
//     value: status._id,
//     label: status.clientfacingName,
//     clientfacingColour: status.clientfacingColour,
//   }));

//   const statusOptions = [
//     { value: true, label: "Show status" },
//     { value: false, label: "Hide status" },
//   ];

//   const filteredConditionTags = filteredTags.filter((tag) =>
//     tag.tagName.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   // Add this function with your other handlers
//   const handleClientStatusSelection = async (
//     event,
//     newValue,
//     automationIndex,
//   ) => {
//     updateAutomationState(automationIndex, { selectedClientStatus: newValue });

//     if (newValue && newValue.value) {
//       const clientjobId = newValue.value;
//       try {
//         const response = await templateAPI.getJobStatusById(clientjobId);
//         const data = response.data;

//         // Update the automation with the fetched description
//         updateAutomationState(automationIndex, {
//           selectedClientStatus: newValue,
//           clientDescription:
//             data.clientfacingjobstatuses?.clientfacingdescription || "",
//         });
//       } catch (error) {
//         console.error("Error fetching client status data:", error);
//       }
//     } else {
//       // Clear the description if no status is selected
//       updateAutomationState(automationIndex, {
//         selectedClientStatus: null,
//         clientDescription: "",
//       });
//     }
//   };

//   const [clientDescription, setClientDescription] = useState("");
//   const maxDescriptionLength = 150;
//   const [selectedClientStatus, setSelectedClientStatus] = useState(null);

//   useEffect(() => {
//     fetchEmailTemplates();
//     fetchChatTemplates();
//     fetchTaskTemplates();
//     fetchInvoiceTemplates();
//     fetchProposalAndElsTemplates();
//     fetchOrganizerTemplates();
//     // fetchFolderData();
//     fetchClientFacingJobsData();
//   }, []);

//   // State for each automation type

//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleAddAutomation = (stageSelected, option) => {
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("Automation clicked:", option);

//     // Initialize drawer with the first automation
//     const newAutomation = {
//       type: option,
//       index: 1,
//       id: Date.now(),
//       // Initialize automation-specific state
//       selectedtemp: null,
//       selectedTags: [],
//       reminderChecked: false,
//       daysuntilNextReminder: "",
//       noOfReminder: "",
//       addTags: [],
//       removeTags: [],
//       selectedAssignees: [],
//       assigneesToRemove: [],
//       status: null,
//       selectedClientStatus: null,
//       clientDescription: "",
//     };

//     setDrawerAutomations([newAutomation]);
//     setAutomationSelect(option);
//     setIsDrawerOpen(true);
//     handleAutomationMenuClose();
//   };

//   const handleEditAutomations = (stageIndex) => {
//     const stage = stages[stageIndex];
//     if (stage && stage.automations && stage.automations.length > 0) {
//       // Restore automations with proper template and tag objects
//       const restoredAutomations = stage.automations.map((automation) => {
//         const restoredAutomation = { ...automation };

//         // Restore template object based on automation type
//         if (automation.selectedtemp) {
//           let templateOptions = [];
//           switch (automation.type) {
//             case "Create Task":
//               templateOptions = taskTemplateOptions;
//               break;
//             case "Send Email":
//               templateOptions = emailTemplateOptions;
//               break;
//             case "Send message":
//               templateOptions = chatTemplateOptions;
//               break;
//             case "Send Invoice":
//               templateOptions = invoiceTemplateOptions;
//               break;
//             case "Send Proposal/Els":
//               templateOptions = proposalElsOptions;
//               break;
//             case "Apply folder template":
//               templateOptions = optionfolder;
//               break;
//             case "Create Organizer":
//               templateOptions = organizerOptions;
//               break;
//             default:
//               templateOptions = [];
//           }

//           // Find the template object
//           const templateObj = templateOptions.find(
//             (opt) => opt.value === automation.selectedtemp,
//           );
//           restoredAutomation.selectedtemp = templateObj || null;
//         }

//         // Restore tags as objects (not just IDs)
//         if (automation.selectedTags && Array.isArray(automation.selectedTags)) {
//           restoredAutomation.selectedTags = automation.selectedTags
//             .map((tagId) => filteredTags.find((tag) => tag._id === tagId))
//             .filter(Boolean);
//         }

//         // SPECIAL: Restore addTags and removeTags for "Update account tags"
//         if (automation.type === "Update account tags") {
//           if (automation.addTags && Array.isArray(automation.addTags)) {
//             restoredAutomation.addTags = automation.addTags
//               .map((tagId) =>
//                 tags.find((tag) => tag.value === tagId || tag._id === tagId),
//               )
//               .filter(Boolean);
//           }

//           if (automation.removeTags && Array.isArray(automation.removeTags)) {
//             restoredAutomation.removeTags = automation.removeTags
//               .map((tagId) =>
//                 tags.find((tag) => tag.value === tagId || tag._id === tagId),
//               )
//               .filter(Boolean);
//           }
//         }

//         // FIX: Restore job assignees for "Update job assignees" - CORRECT FIELD NAMES
//         if (automation.type === "Update job assignees") {
//           console.log("Restoring Update job assignees automation:", automation);

//           // Restore selectedAssignees (to add)
//           if (
//             automation.selectedAssignees &&
//             Array.isArray(automation.selectedAssignees)
//           ) {
//             restoredAutomation.selectedAssignees = automation.selectedAssignees
//               .map((assigneeId) =>
//                 users.find(
//                   (user) =>
//                     user._id === assigneeId || user.value === assigneeId,
//                 ),
//               )
//               .filter(Boolean);
//             console.log(
//               "Restored selectedAssignees:",
//               restoredAutomation.selectedAssignees,
//             );
//           }

//           // Restore assigneesToRemove (to remove)
//           if (
//             automation.assigneesToRemove &&
//             Array.isArray(automation.assigneesToRemove)
//           ) {
//             restoredAutomation.assigneesToRemove = automation.assigneesToRemove
//               .map((assigneeId) =>
//                 users.find(
//                   (user) =>
//                     user._id === assigneeId || user.value === assigneeId,
//                 ),
//               )
//               .filter(Boolean);
//             console.log(
//               "Restored assigneesToRemove:",
//               restoredAutomation.assigneesToRemove,
//             );
//           }
//         }

//         // Restore client status
//         if (automation.selectedClientStatus) {
//           const statusObj = optionstatus.find(
//             (opt) => opt.value === automation.selectedClientStatus,
//           );
//           restoredAutomation.selectedClientStatus = statusObj || null;
//         }

//         // Restore status
//         if (automation.status !== undefined && automation.status !== null) {
//           const statusObj = statusOptions.find(
//             (opt) => opt.value === automation.status,
//           );
//           restoredAutomation.status = statusObj || null;
//         }

//         return restoredAutomation;
//       });
//       console.log("Restored automations for editing:", restoredAutomations);
//       setDrawerAutomations(restoredAutomations);
//       setStageSelected(stageIndex);
//       setIsDrawerOpen(true);
//     } else {
//       console.log("No existing automations to edit");
//     }
//   };
//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     setAutomationSelect(null);
//     setDrawerAutomations([]);
//   };

//   // Drawer menu handlers
//   const handleDrawerMenuOpen = (event) => {
//     setDrawerAnchorEl(event.currentTarget);
//   };

//   const handleDrawerMenuClose = () => {
//     setDrawerAnchorEl(null);
//   };

//   const handleDrawerMenuItemSelect = (option) => {
//     const newIndex = drawerAutomations.length + 1;
//     const newAutomation = {
//       type: option,
//       index: newIndex,
//       id: Date.now() + Math.random(),
//       // Initialize automation-specific state
//       selectedtemp: null,
//       selectedTags: [],
//       reminderChecked: false,
//       daysuntilNextReminder: "",
//       noOfReminder: "",
//       addTags: [],
//       removeTags: [],
//       selectedAssignees: [],
//       assigneesToRemove: [],
//       status: null,
//       selectedClientStatus: null,
//       clientDescription: "",
//     };

//     setDrawerAutomations((prev) => [...prev, newAutomation]);
//     handleDrawerMenuClose();
//   };

//   // Delete automation from drawer
//   const handleDeleteAutomation = (automationIndex) => {
//     setDrawerAutomations((prev) => {
//       const updatedAutomations = prev.filter(
//         (_, idx) => idx !== automationIndex,
//       );
//       return updatedAutomations.map((automation, idx) => ({
//         ...automation,
//         index: idx + 1,
//       }));
//     });
//   };

//   // Update automation state
//   const updateAutomationState = (automationIndex, updates) => {
//     setDrawerAutomations((prev) =>
//       prev.map((automation, idx) =>
//         idx === automationIndex ? { ...automation, ...updates } : automation,
//       ),
//     );
//   };

//   // Conditions handlers
//   const handleAddConditions = (automationIndex) => {
//     const automation = drawerAutomations[automationIndex];
//     // Set the current automation index and pre-populate with existing tags
//     setCurrentAutomationIndex(automationIndex);
//     setTempSelectedTags(automation.selectedTags || []);
//     setSearchTerm("");
//     setIsConditionsFormOpen(true);
//   };

//   const handleGoBack = () => {
//     setIsConditionsFormOpen(false);
//     setCurrentAutomationIndex(null);
//     setTempSelectedTags([]);
//     setSearchTerm("");
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleCheckboxChange = (tag) => {
//     setTempSelectedTags((prev) =>
//       prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
//     );
//   };

//   const handleAddTags = () => {
//     if (currentAutomationIndex !== null) {
//       updateAutomationState(currentAutomationIndex, {
//         selectedTags: tempSelectedTags,
//       });
//     }
//     handleGoBack();
//   };

//   // Template selection handler
//   const handletemp = (newValue, automationType, automationIndex) => {
//     updateAutomationState(automationIndex, { selectedtemp: newValue });
//   };

//   const handleSaveAllAutomations = () => {
//     if (stageSelected === null) {
//       console.error("No stage selected!");
//       return;
//     }

//     if (drawerAutomations.length === 0) {
//       console.error("No automations to save!");
//       return;
//     }

//     console.log("Saving all automations to stage:", stageSelected);
//     console.log("Automations to save:", drawerAutomations);

//     // Map automation types to their corresponding ref models
//     const automationTypeToRefModel = {
//       "Create Task": "TaskTemplate",
//       "Send Email": "EmailTemplate",
//       "Send message": "ChatTemplate",
//       "Send Invoice": "InvoiceTemplate",
//       "Send Proposal/Els": "ProposalTemplate",
//       "Apply folder template": "FolderTemplate",
//       "Create Organizer": "OrganizerTemplate",
//       "Update client-facing job status": null,
//       "Update account tags": null,
//       "Update job assignees": null,
//     };

//     // Prepare automations with template, tags, and refModel
//     const automationsWithDetails = drawerAutomations.map((automation) => {
//       const refModel = automationTypeToRefModel[automation.type];

//       // Base automation object
//       const automationData = {
//         ...automation,
//         // Store template details and refModel
//         selectedtemp: automation.selectedtemp
//           ? automation.selectedtemp.value
//           : null,
//         refModel: refModel,
//         templateRefModel: refModel,
//         // Store tag IDs for conditions
//         selectedTags: automation.selectedTags
//           ? automation.selectedTags.map((tag) => tag._id)
//           : [],
//         // Store client status and description
//         selectedClientStatus: automation.selectedClientStatus
//           ? automation.selectedClientStatus.value
//           : null,
//         status: automation.status ? automation.status.value : null,
//         clientDescription: automation.clientDescription || "",
//       };
//       console.log("Preparing automation for saving:", automationData);
//       // SPECIAL HANDLING FOR "Update account tags" AUTOMATION
//       if (automation.type === "Update account tags") {
//         // Store addTags and removeTags as arrays of tag IDs
//         automationData.addTags = automation.addTags
//           ? automation.addTags.map((tag) => tag.value || tag._id)
//           : [];
//         automationData.removeTags = automation.removeTags
//           ? automation.removeTags.map((tag) => tag.value || tag._id)
//           : [];

//         console.log("Update account tags automation data:", {
//           addTags: automationData.addTags,
//           removeTags: automationData.removeTags,
//           originalAddTags: automation.addTags,
//           originalRemoveTags: automation.removeTags,
//         });
//       } else {
//         // For other automation types, ensure these fields are empty arrays
//         automationData.addTags = [];
//         automationData.removeTags = [];
//       }

//       // Store assignee IDs (for "Update job assignees" automation)
//       // Store assignee IDs (for "Update job assignees" automation)
//       automationData.selectedAssignees = automation.selectedAssignees
//         ? automation.selectedAssignees.map((user) => user.value || user._id)
//         : [];
//       automationData.assigneesToRemove = automation.assigneesToRemove
//         ? automation.assigneesToRemove.map((user) => user.value || user._id)
//         : [];

//       return automationData;
//     });

//     console.log("Automations prepared for saving:", automationsWithDetails);

//     // Call the parent function to save automations to the stage
//     if (handleSaveAutomations) {
//       handleSaveAutomations(stageSelected, automationsWithDetails);
//     }

//     alert(
//       `Successfully saved ${drawerAutomations.length} automation(s) to stage ${stageSelected + 1}`,
//     );

//     // Close the drawer after saving
//     handleDrawerClose();
//   };

//   // Delete saved automation from stage
//   const handleDeleteSavedAutomation = (stageIndex, automationIndex) => {
//     if (handleSaveAutomations) {
//       const stage = stages[stageIndex];
//       if (stage && stage.automations) {
//         const updatedAutomations = stage.automations.filter(
//           (_, idx) => idx !== automationIndex,
//         );
//         handleSaveAutomations(stageIndex, updatedAutomations);
//       }
//     }
//   };

//   // Your complex renderActionContent function
//   const renderActionContent = (automation, index) => {
//     const automationSelect = automation.type;
//     const automationIndex = index;

//     // Helper function to get selected tags for this automation
//     const selectedTags = automation.selectedTags || [];
//     const selectedTagElements = selectedTags.map((tag, idx) => (
//       <Chip
//         key={idx}
//         label={tag.tagName}
//         sx={{
//           backgroundColor: tag.tagColour,
//           color: "#fff",
//           fontWeight: "500",
//           borderRadius: "20px",
//           marginRight: 1,
//         }}
//       />
//     ));

//     switch (automationSelect) {
//       case "Create Task":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>
//                 <Typography mb={1}>Select template</Typography>
//                 <Autocomplete
//                   options={taskTemplateOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.selectedtemp}
//                   onChange={(event, newValue) =>
//                     handletemp(newValue, automationSelect, automationIndex)
//                   }
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option) => (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ cursor: "pointer", margin: "5px 10px" }}
//                     >
//                       {option.label}
//                     </Box>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       sx={{ backgroundColor: "#fff" }}
//                       placeholder="Select Template"
//                       variant="outlined"
//                       size="small"
//                     />
//                   )}
//                   sx={{ width: "100%", marginTop: "8px" }}
//                   clearOnEscape
//                 />
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );

//       case "Send Email":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>
//                 <Typography mb={1}>Select template</Typography>
//                 <Autocomplete
//                   options={emailTemplateOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.selectedtemp}
//                   onChange={(event, newValue) =>
//                     handletemp(newValue, automationSelect, automationIndex)
//                   }
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option) => (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ cursor: "pointer", margin: "5px 10px" }}
//                     >
//                       {option.label}
//                     </Box>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       sx={{ backgroundColor: "#fff" }}
//                       placeholder="Select Template"
//                       variant="outlined"
//                       size="small"
//                     />
//                   )}
//                   sx={{ width: "100%", marginTop: "8px" }}
//                   clearOnEscape
//                 />
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );

//       case "Send message":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>
//                 <Typography mb={1}>Select template</Typography>
//                 <Autocomplete
//                   options={chatTemplateOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.selectedtemp}
//                   onChange={(event, newValue) =>
//                     handletemp(newValue, automationSelect, automationIndex)
//                   }
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option) => (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ cursor: "pointer", margin: "5px 10px" }}
//                     >
//                       {option.label}
//                     </Box>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       sx={{ backgroundColor: "#fff" }}
//                       placeholder="Select Template"
//                       variant="outlined"
//                       size="small"
//                     />
//                   )}
//                   sx={{ width: "100%", marginTop: "8px" }}
//                   clearOnEscape
//                 />
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );

//       case "Send Invoice":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>
//                 <Typography mb={1}>Select template</Typography>
//                 <Autocomplete
//                   options={invoiceTemplateOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.selectedtemp}
//                   onChange={(event, newValue) =>
//                     handletemp(newValue, automationSelect, automationIndex)
//                   }
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option) => (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ cursor: "pointer", margin: "5px 10px" }}
//                     >
//                       {option.label}
//                     </Box>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       sx={{ backgroundColor: "#fff" }}
//                       placeholder="Select Template"
//                       variant="outlined"
//                       size="small"
//                     />
//                   )}
//                   sx={{ width: "100%", marginTop: "8px" }}
//                   clearOnEscape
//                 />
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );

//       case "Send Proposal/Els":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>
//                 <Typography mb={1}>Select template</Typography>
//                 <Autocomplete
//                   options={proposalElsOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.selectedtemp}
//                   onChange={(event, newValue) =>
//                     handletemp(newValue, automationSelect, automationIndex)
//                   }
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option) => (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ cursor: "pointer", margin: "5px 10px" }}
//                     >
//                       {option.label}
//                     </Box>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       sx={{ backgroundColor: "#fff" }}
//                       placeholder="Select Template"
//                       variant="outlined"
//                       size="small"
//                     />
//                   )}
//                   sx={{ width: "100%", marginTop: "8px" }}
//                   clearOnEscape
//                 />
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );

//       case "Apply folder template":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>
//                 <Typography mb={1}>Select template</Typography>
//                 <Autocomplete
//                   options={optionfolder}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.selectedtemp}
//                   onChange={(event, newValue) =>
//                     handletemp(newValue, automationSelect, automationIndex)
//                   }
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option) => (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ cursor: "pointer", margin: "5px 10px" }}
//                     >
//                       {option.label}
//                     </Box>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       sx={{ backgroundColor: "#fff" }}
//                       placeholder="Select Template"
//                       variant="outlined"
//                       size="small"
//                     />
//                   )}
//                   sx={{ width: "100%", marginTop: "8px" }}
//                   clearOnEscape
//                 />
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );

//       case "Create Organizer":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>
//                 <Typography mb={1}>Select template</Typography>
//                 <Autocomplete
//                   options={organizerOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.selectedtemp}
//                   onChange={(event, newValue) =>
//                     handletemp(newValue, automationSelect, automationIndex)
//                   }
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value.value
//                   }
//                   renderOption={(props, option) => (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ cursor: "pointer", margin: "5px 10px" }}
//                     >
//                       {option.label}
//                     </Box>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       sx={{ backgroundColor: "#fff" }}
//                       placeholder="Select Template"
//                       variant="outlined"
//                       size="small"
//                     />
//                   )}
//                   sx={{ width: "100%", marginTop: "8px" }}
//                   clearOnEscape
//                 />
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );

//       case "Update client-facing job status":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>

//                 <Typography gutterBottom fontSize={"12px"}>
//                   The client-facing status will update automatically as soon as
//                   the job enters the stage. Your clients will see it in their
//                   client portal.
//                 </Typography>

//                 <InputLabel sx={{ color: "black", mb: 1, mt: 2 }}>
//                   Visibility for client
//                 </InputLabel>
//                 <Autocomplete
//                   options={statusOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={automation.status}
//                   onChange={(event, newValue) =>
//                     updateAutomationState(automationIndex, { status: newValue })
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       variant="outlined"
//                       placeholder="Select status"
//                     />
//                   )}
//                   fullWidth
//                 />

//                 {/* {(automation.status?.value === true || status?.value === true) && ( */}
//                 {automation.status?.value === true && (
//                   <Box>
//                     <Box>
//                       <InputLabel sx={{ color: "black", mb: 1, mt: 1 }}>
//                         Select status
//                       </InputLabel>
//                       <Autocomplete
//                         options={optionstatus}
//                         size="small"
//                         sx={{ mt: 1 }}
//                         value={
//                           automation.selectedClientStatus ||
//                           selectedClientStatus
//                         }
//                         onChange={(event, newValue) =>
//                           handleClientStatusSelection(
//                             event,
//                             newValue,
//                             automationIndex,
//                           )
//                         }
//                         getOptionLabel={(option) => option.label}
//                         isOptionEqualToValue={(option, value) =>
//                           option.value === value.value
//                         }
//                         renderOption={(props, option) => (
//                           <Box component="li" {...props}>
//                             <Chip
//                               size="small"
//                               style={{
//                                 backgroundColor: option.clientfacingColour,
//                                 marginRight: 8,
//                                 marginLeft: 8,
//                                 borderRadius: "50%",
//                                 height: "15px",
//                               }}
//                             />
//                             {option.label}
//                           </Box>
//                         )}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             placeholder="Select status"
//                             InputProps={{
//                               ...params.InputProps,
//                               startAdornment:
//                                 params.inputProps.value &&
//                                 clientFacingJobs.length > 0 ? (
//                                   <Chip
//                                     size="small"
//                                     style={{
//                                       backgroundColor: clientFacingJobs.find(
//                                         (job) =>
//                                           job.clientfacingName ===
//                                           params.inputProps.value,
//                                       )?.clientfacingColour,
//                                       marginRight: 8,
//                                       marginLeft: 2,
//                                       borderRadius: "50%",
//                                       height: "15px",
//                                     }}
//                                   />
//                                 ) : null,
//                             }}
//                           />
//                         )}
//                       />
//                     </Box>
//                     <Box mt={1}>
//                       <InputLabel sx={{ color: "black", mb: 1 }}>
//                         Status description for client
//                       </InputLabel>
//                       <TextField
//                         fullWidth
//                         multiline
//                         rows={4}
//                         variant="outlined"
//                         value={
//                           automation.clientDescription || clientDescription
//                         }
//                         onChange={(e) =>
//                           updateAutomationState(automationIndex, {
//                             clientDescription: e.target.value,
//                           })
//                         }
//                         placeholder="Status description for client"
//                       />
//                       <Typography variant="caption" color="textSecondary">
//                         {
//                           (automation.clientDescription || clientDescription)
//                             .length
//                         }
//                         /{maxDescriptionLength}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 )}

//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );
//       case "Update account tags":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>

//                 {/* Add Tags Section */}
//                 <Typography fontWeight={600} mt={1}>
//                   Add Tags
//                 </Typography>
//                 <TagsMultiSelectDropDown
//                   value={automation.addTags || []}
//                   onChange={(newValue) =>
//                     updateAutomationState(automationIndex, {
//                       addTags: newValue,
//                     })
//                   }
//                   options={tags.filter(
//                     (tag) =>
//                       tag &&
//                       tag.value &&
//                       tag.label &&
//                       !(automation.removeTags || []).some(
//                         (removeTag) =>
//                           removeTag && removeTag.value === tag.value,
//                       ),
//                   )}
//                   placeholder="Select tags to ADD"
//                 />

//                 {/* Remove Tags Section */}
//                 <Typography fontWeight={600} mt={3}>
//                   Remove Tags
//                 </Typography>
//                 <TagsMultiSelectDropDown
//                   value={automation.removeTags || []}
//                   onChange={(newValue) =>
//                     updateAutomationState(automationIndex, {
//                       removeTags: newValue,
//                     })
//                   }
//                   options={tags.filter(
//                     (tag) =>
//                       tag &&
//                       tag.value &&
//                       tag.label &&
//                       !(automation.addTags || []).some(
//                         (addTag) => addTag && addTag.value === tag.value,
//                       ),
//                   )}
//                   placeholder="Select tags to REMOVE"
//                 />

//                 {/* Conditions Section */}
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );
//       case "Update job assignees":
//         return (
//           <>
//             <Grid item>
//               <Box
//                 sx={{
//                   border: "2px solid #ddd",
//                   borderRadius: "8px",
//                   padding: 2,
//                 }}
//               >
//                 <Typography gutterBottom>{automationSelect}</Typography>

//                 {/* Add Tags Section */}
//                 <Typography fontWeight={600} mt={1}>
//                   Add Job Assignes
//                 </Typography>
//                 <MultiSelectDropdown
//                   value={automation.selectedAssignees || []}
//                   onChange={(newValue) =>
//                     updateAutomationState(automationIndex, {
//                       selectedAssignees: newValue,
//                     })
//                   }
//                   options={users.filter(
//                     (user) =>
//                       user &&
//                       user.value &&
//                       user.label &&
//                       !(automation.assigneesToRemove || []).some(
//                         (assigneesToRemove) =>
//                           assigneesToRemove &&
//                           assigneesToRemove.value === user.value,
//                       ),
//                   )}
//                   placeholder="Select Assignees to ADD"
//                 />

//                 {/* Remove Tags Section */}
//                 <Typography fontWeight={600} mt={3}>
//                   Remove Job Assignes
//                 </Typography>
//                 <MultiSelectDropdown
//                   value={automation.assigneesToRemove || []}
//                   onChange={(newValue) =>
//                     updateAutomationState(automationIndex, {
//                       assigneesToRemove: newValue,
//                     })
//                   }
//                   options={users.filter(
//                     (user) =>
//                       user &&
//                       user.value &&
//                       user.label &&
//                       !(automation.selectedAssignees || []).some(
//                         (selectedAssignees) =>
//                           selectedAssignees &&
//                           selectedAssignees.value === user.value,
//                       ),
//                   )}
//                   placeholder="Select Assignees to REMOVE"
//                 />

//                 {/* Conditions Section */}
//                 <Box mt={2}>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Box>
//                 <Button
//                   variant="text"
//                   onClick={() => handleAddConditions(automationIndex)}
//                 >
//                   {selectedTags.length > 0
//                     ? "Edit Conditions"
//                     : "Add Conditions"}
//                 </Button>
//               </Box>
//             </Grid>
//           </>
//         );
//       default:
//         return (
//           <Box>
//             <Typography variant="h6">{automationSelect} Automation</Typography>
//             <Typography>
//               Configure your {automationSelect.toLowerCase()} automation
//               settings here...
//             </Typography>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<ControlPointIcon />}
//           onClick={() => handleAddStage(stages.length)}
//         >
//           Add stage
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           gap: 3,
//           mb: 2,
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: 2,
//             overflowX: "auto",
//             px: 1,
//             pb: 1,
//             "&::-webkit-scrollbar": { height: 6 },
//             "&::-webkit-scrollbar-thumb": {
//               background: "#ccc",
//               borderRadius: "10px",
//             },
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* ================= STAGE CARD ================= */}
//               <Box
//                 sx={{
//                   minWidth: 300,
//                   maxWidth: 320,
//                   height: 500,
//                   display: "flex",
//                   flexDirection: "column",
//                   borderRadius: 3,
//                   backgroundColor: "#fff",
//                   border: "1px solid #e5e7eb",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
//                   flexShrink: 0,
//                 }}
//               >
//                 {/* ===== HEADER ===== */}
//                 <Box
//                   sx={{
//                     p: 2,
//                     borderBottom: "1px solid #eee",
//                     position: "sticky",
//                     top: 0,
//                     background: "#fff",
//                     zIndex: 1,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <RxDragHandleDots2 style={{ opacity: 0.5 }} />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: 12 }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       size="small"
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{
//                         color: "error.main",
//                         "&:hover": { backgroundColor: "#fee2e2" },
//                       }}
//                     >
//                       <RiDeleteBin6Line size={16} />
//                     </IconButton>
//                   </Box>
//                 </Box>

//                 {/* ===== BODY ===== */}
//                 <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
//                   {/* Stage Conditions */}
//                   <Typography variant="subtitle2" fontWeight={600}>
//                     Stage conditions
//                   </Typography>

//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                     sx={{ display: "block", mb: 2 }}
//                   >
//                     {index === 0
//                       ? "First stage can't have conditions"
//                       : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                   </Typography>

//                   {/* Automations */}
//                   <Typography variant="subtitle2" fontWeight={600}>
//                     Automations
//                   </Typography>

//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                     sx={{ display: "block", mb: 1 }}
//                   >
//                     Triggered when job enters stage
//                   </Typography>

//                   {/* ===== AUTOMATIONS LIST ===== */}
//                   {stage.automations && stage.automations.length > 0 ? (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 1.5,
//                       }}
//                     >
//                       {stage.automations.map((automation, autoIndex) => {
//                         // ===== HELPERS =====
//                         const getTemplateName = () => {
//                           if (!automation.selectedtemp) return null;

//                           switch (automation.type) {
//                             case "Create Task":
//                               return taskTemplateOptions.find(
//                                 (opt) => opt.value === automation.selectedtemp,
//                               )?.label;
//                             case "Send Email":
//                               return emailTemplateOptions.find(
//                                 (opt) => opt.value === automation.selectedtemp,
//                               )?.label;
//                             case "Send message":
//                               return chatTemplateOptions.find(
//                                 (opt) => opt.value === automation.selectedtemp,
//                               )?.label;
//                             case "Send Invoice":
//                               return invoiceTemplateOptions.find(
//                                 (opt) => opt.value === automation.selectedtemp,
//                               )?.label;
//                             case "Send Proposal/Els":
//                               return proposalElsOptions.find(
//                                 (opt) => opt.value === automation.selectedtemp,
//                               )?.label;
//                             case "Apply folder template":
//                               return optionfolder.find(
//                                 (opt) => opt.value === automation.selectedtemp,
//                               )?.label;
//                             case "Create Organizer":
//                               return organizerOptions.find(
//                                 (opt) => opt.value === automation.selectedtemp,
//                               )?.label;
//                             default:
//                               return null;
//                           }
//                         };

//                         const getTagDetails = (id) =>
//                           filteredTags.find((tag) => tag._id === id);

//                         const getAddRemoveTagDetails = (ids) =>
//                           ids?.map(getTagDetails).filter(Boolean) || [];

//                         const getClientStatusDetails = () =>
//                           optionstatus.find(
//                             (opt) =>
//                               opt.value === automation.selectedClientStatus,
//                           );

//                         const templateName = getTemplateName();
//                         const tagDetails =
//                           automation.selectedTags
//                             ?.map(getTagDetails)
//                             .filter(Boolean) || [];

//                         const clientStatusDetails = getClientStatusDetails();

//                         const addTagDetails =
//                           automation.type === "Update account tags"
//                             ? getAddRemoveTagDetails(automation.addTags)
//                             : [];

//                         const removeTagDetails =
//                           automation.type === "Update account tags"
//                             ? getAddRemoveTagDetails(automation.removeTags)
//                             : [];

//                         return (
//                           <Box
//                             key={automation.id || autoIndex}
//                             sx={{
//                               p: 1.5,
//                               borderRadius: 2,
//                               border: "1px solid #e5e7eb",
//                               background: "#fafafa",
//                               "&:hover": { background: "#f3f4f6" },
//                             }}
//                           >
//                             {/* HEADER */}
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 mb: 1,
//                               }}
//                             >
//                               <Box sx={{ display: "flex", gap: 1 }}>
//                                 <Box
//                                   sx={{
//                                     width: 22,
//                                     height: 22,
//                                     borderRadius: "50%",
//                                     bgcolor: "primary.main",
//                                     color: "#fff",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     fontSize: 11,
//                                   }}
//                                 >
//                                   {automation.index}
//                                 </Box>

//                                 <Typography variant="caption" fontWeight={600}>
//                                   {automation.type}
//                                 </Typography>
//                               </Box>

//                               <IconButton
//                                 size="small"
//                                 onClick={() =>
//                                   handleDeleteSavedAutomation(index, autoIndex)
//                                 }
//                                 sx={{ color: "error.main" }}
//                               >
//                                 <RiDeleteBin6Line size={14} />
//                               </IconButton>
//                             </Box>

//                             {/* TEMPLATE */}
//                             {templateName && (
//                               <Chip
//                                 label={templateName}
//                                 size="small"
//                                 variant="outlined"
//                                 sx={{ mb: 1, fontSize: 11 }}
//                               />
//                             )}

//                             {/* CLIENT STATUS */}
//                             {automation.type ===
//                               "Update client-facing job status" &&
//                               clientStatusDetails && (
//                                 <Box sx={{ mb: 1 }}>
//                                   <Typography
//                                     variant="caption"
//                                     color="text.secondary"
//                                     sx={{ fontWeight: "bold" }}
//                                   >
//                                     Client Status:
//                                   </Typography>

//                                   <Box
//                                     sx={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                       gap: 1,
//                                       mt: 0.5,
//                                       flexWrap: "wrap",
//                                     }}
//                                   >
//                                     {/* Status Dot + Label */}
//                                     <Box
//                                       sx={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         gap: 0.5,
//                                       }}
//                                     >
//                                       <Box
//                                         sx={{
//                                           width: 8,
//                                           height: 8,
//                                           borderRadius: "50%",
//                                           backgroundColor:
//                                             clientStatusDetails.clientfacingColour,
//                                         }}
//                                       />
//                                       <Typography
//                                         variant="body2"
//                                         sx={{
//                                           fontSize: "0.75rem",
//                                           fontWeight: 500,
//                                         }}
//                                       >
//                                         {clientStatusDetails.label}
//                                       </Typography>
//                                     </Box>

//                                     {/* Visibility Chip */}
//                                     <Chip
//                                       label={
//                                         automation.status === true
//                                           ? "Visible to Client"
//                                           : "Hidden from Client"
//                                       }
//                                       size="small"
//                                       variant="outlined"
//                                       color={
//                                         automation.status
//                                           ? "success"
//                                           : "default"
//                                       }
//                                       sx={{
//                                         fontSize: "0.65rem",
//                                         height: 20,
//                                       }}
//                                     />
//                                   </Box>
//                                 </Box>
//                               )}

//                             {/* TAGS */}
//                             {/* {[
//                               ...addTagDetails,
//                               ...removeTagDetails,
//                               ...tagDetails,
//                             ].length > 0 && (
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   flexWrap: "wrap",
//                                   gap: 0.5,
//                                 }}
//                               >
//                                 {[
//                                   ...addTagDetails,
//                                   ...removeTagDetails,
//                                   ...tagDetails,
//                                 ].map((tag) => (
//                                   <Chip
//                                     key={tag._id}
//                                     label={tag.tagName}
//                                     size="small"
//                                     sx={{
//                                       backgroundColor: tag.tagColour,
//                                       color: "#fff",
//                                       fontSize: 11,
//                                     }}
//                                   />
//                                 ))}
//                               </Box>
//                             )} */}
//                             {automation.type === "Update account tags" && (
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   flexDirection: "column",
//                                   gap: 1,
//                                 }}
//                               >
//                                 {/* ADD TAGS */}
//                                 {addTagDetails.length > 0 && (
//                                   <Box>
//                                     <Typography
//                                       variant="caption"
//                                       sx={{
//                                         fontWeight: 600,
//                                         color: "success.main",
//                                       }}
//                                     >
//                                       Add Tags:
//                                     </Typography>

//                                     <Box
//                                       sx={{
//                                         display: "flex",
//                                         flexWrap: "wrap",
//                                         gap: 0.5,
//                                         mt: 0.5,
//                                       }}
//                                     >
//                                       {addTagDetails.map((tag) => (
//                                         <Chip
//                                           key={tag._id}
//                                           label={tag.tagName}
//                                           size="small"
//                                           sx={{
//                                             backgroundColor: tag.tagColour,
//                                             color: "#fff",
//                                             fontSize: "0.7rem",
//                                             height: 22,
//                                           }}
//                                         />
//                                       ))}
//                                     </Box>
//                                   </Box>
//                                 )}

//                                 {/* REMOVE TAGS */}
//                                 {removeTagDetails.length > 0 && (
//                                   <Box>
//                                     <Typography
//                                       variant="caption"
//                                       sx={{
//                                         fontWeight: 600,
//                                         color: "error.main",
//                                       }}
//                                     >
//                                       Remove Tags:
//                                     </Typography>

//                                     <Box
//                                       sx={{
//                                         display: "flex",
//                                         flexWrap: "wrap",
//                                         gap: 0.5,
//                                         mt: 0.5,
//                                       }}
//                                     >
//                                       {removeTagDetails.map((tag) => (
//                                         <Chip
//                                           key={tag._id}
//                                           label={tag.tagName}
//                                           size="small"
//                                           sx={{
//                                             backgroundColor: tag.tagColour,
//                                             color: "#fff",
//                                             fontSize: "0.7rem",
//                                             height: 22,
//                                             opacity: 0.7, // 👈 visually differentiate remove
//                                             textDecoration: "line-through", // 👈 optional
//                                           }}
//                                         />
//                                       ))}
//                                     </Box>
//                                   </Box>
//                                 )}
//                               </Box>
//                             )}
//                             {tagDetails.length > 0 && (
//                               <Box sx={{ mt: 1 }}>
//                                 <Typography
//                                   variant="caption"
//                                   sx={{
//                                     fontWeight: 600,
//                                     color: "text.secondary",
//                                   }}
//                                 >
//                                   Conditions:
//                                 </Typography>

//                                 <Box
//                                   sx={{
//                                     display: "flex",
//                                     flexWrap: "wrap",
//                                     gap: 0.5,
//                                     mt: 0.5,
//                                   }}
//                                 >
//                                   {tagDetails.map((tag) => (
//                                     <Chip
//                                       key={tag._id}
//                                       label={tag.tagName}
//                                       size="small"
//                                       sx={{
//                                         fontSize: "0.7rem",
//                                         height: 22,

//                                         color: "white",
//                                         backgroundColor: tag.tagColour, // 20 for light transparency
//                                         fontWeight: 500,
//                                       }}
//                                     />
//                                   ))}
//                                 </Box>
//                               </Box>
//                             )}
//                             {/* REMINDERS */}
//                             {automation.reminderChecked && (
//                               <Typography variant="caption">
//                                 {automation.daysuntilNextReminder} days,{" "}
//                                 {automation.noOfReminder} times
//                               </Typography>
//                             )}

//                             {/* REF MODEL */}
//                             {automation.refModel && (
//                               <Typography variant="caption" display="block" mt={1}>
//                                 Ref: {automation.refModel}
//                               </Typography>
//                             )}
//                           </Box>
//                         );
//                       })}
//                     </Box>
//                   ) : (
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       fontStyle="italic"
//                     >
//                       No automations configured
//                     </Typography>
//                   )}

//                   {/* BUTTON */}
//                 </Box>
//                 <Box p={2}>
//                   <Button
//                     fullWidth
//                     sx={{ borderRadius: 2, textTransform: "none" }}
//                     variant={
//                       stage.automations?.length > 0 ? "contained" : "outlined"
//                     }
//                     startIcon={
//                       stage.automations?.length > 0 ? (
//                         <LuPenLine />
//                       ) : (
//                         <ControlPointIcon />
//                       )
//                     }
//                     onClick={(e) =>
//                       stage.automations?.length > 0
//                         ? handleEditAutomations(index)
//                         : handleAutomationMenuOpen(e, index)
//                     }
//                   >
//                     {stage.automations?.length > 0
//                       ? `Edit Automations (${stage.automations.length})`
//                       : "Add Automation"}
//                   </Button>
//                 </Box>
//               </Box>

//               {/* ADD STAGE BUTTON */}
//               {index < stages.length - 1 && (
//                 <IconButton
//                   onClick={() => handleAddStage(index + 1)}
//                   sx={{
//                     alignSelf: "center",
//                     border: "1px dashed #d1d5db",
//                     borderRadius: 2,
//                     height: 40,
//                     width: 40,
//                   }}
//                 >
//                   <ControlPointIcon />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem
//           onClick={() => handleAddAutomation(stageSelected, "Send Email")}
//         >
//           Send Email
//         </MenuItem>
//         <MenuItem
//           onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}
//         >
//           Send Invoice
//         </MenuItem>
//         <MenuItem
//           onClick={() =>
//             handleAddAutomation(stageSelected, "Send Proposal/Els")
//           }
//         >
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem
//           onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}
//         >
//           Create Organizer
//         </MenuItem>
//         <MenuItem
//           onClick={() =>
//             handleAddAutomation(stageSelected, "Apply folder template")
//           }
//         >
//           Apply folder template
//         </MenuItem>
//         <MenuItem
//           onClick={() =>
//             handleAddAutomation(stageSelected, "Update account tags")
//           }
//         >
//           Update account tags
//         </MenuItem>
        
//         <MenuItem
//           onClick={() => handleAddAutomation(stageSelected, "Create Task")}
//         >
//           Create Task
//         </MenuItem>
//         <MenuItem
//           onClick={() => handleAddAutomation(stageSelected, "Send message")}
//         >
//           Send message
//         </MenuItem>
//         <MenuItem
//           onClick={() =>
//             handleAddAutomation(
//               stageSelected,
//               "Update client-facing job status",
//             )
//           }
//         >
//           Update client-facing job status
//         </MenuItem>
//       </Menu>

//       {/* Automation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={handleDrawerClose}
//         PaperProps={{
//           sx: {
//             width: { xs: "100%", sm: "600px", md: "700px" },
//             padding: 2,
//           },
//         }}
//       >
//         <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//           {/* Header */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 3,
//             }}
//           >
//             <Typography variant="h5">
//               {stageSelected !== null &&
//               stages[stageSelected]?.automations?.length > 0
//                 ? `Edit Automations - Stage ${stageSelected + 1}`
//                 : `Add Automations - Stage ${stageSelected !== null ? stageSelected + 1 : "Loading..."}`}
//             </Typography>
//             <IconButton onClick={handleDrawerClose}>
//               <RiDeleteBin6Line />
//             </IconButton>
//           </Box>

//           {/* Automation List - Scrollable area */}
//           <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
//             {drawerAutomations.length === 0 ? (
//               <Box sx={{ textAlign: "center", py: 4 }}>
//                 <Typography variant="body1" color="text.secondary">
//                   No automations added yet. Click "Add Another Automation" to
//                   get started.
//                 </Typography>
//               </Box>
//             ) : (
//               drawerAutomations.map((automation, idx) => (
//                 <Box
//                   key={automation.id || idx}
//                   sx={{
//                     mb: 3,
//                     p: 2,
//                     border: "1px solid #e0e0e0",
//                     borderRadius: "8px",
//                     position: "relative",
//                   }}
//                 >
//                   <IconButton
//                     onClick={() => handleDeleteAutomation(idx)}
//                     sx={{
//                       position: "absolute",
//                       top: 8,
//                       right: 8,
//                       color: "red",
//                     }}
//                     size="small"
//                   >
//                     <RiDeleteBin6Line />
//                   </IconButton>

//                   <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
//                     Automation {automation.index}: {automation.type}
//                   </Typography>
//                   {renderActionContent(automation, idx)}
//                 </Box>
//               ))
//             )}
//           </Box>

//           {/* Footer with Action Buttons */}
//           <Box sx={{ borderTop: "1px solid #e0e0e0", pb: 5, pt: 2 }}>
//             <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<ControlPointIcon />}
//                 onClick={handleDrawerMenuOpen}
//                 sx={{ borderRadius: "8px" }}
//               >
//                 Add Another Automation
//               </Button>
//             </Box>

//             <Button
//               variant="contained"
//               fullWidth
//               onClick={handleSaveAllAutomations}
//               disabled={
//                 drawerAutomations.length === 0 || stageSelected === null
//               }
//             >
//               {stageSelected === null
//                 ? "No Stage Selected"
//                 : stages[stageSelected]?.automations?.length > 0
//                   ? `Update Automations (${drawerAutomations.length})`
//                   : `Save Automations (${drawerAutomations.length})`}
//             </Button>
//           </Box>

//           {/* Drawer Menu for Adding More Automations */}
//           <Menu
//             anchorEl={drawerAnchorEl}
//             open={Boolean(drawerAnchorEl)}
//             onClose={handleDrawerMenuClose}
//             PaperProps={{
//               style: {
//                 maxHeight: 200,
//                 overflowY: "auto",
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
//               Send Email
//             </MenuItem>
//             <MenuItem
//               onClick={() => handleDrawerMenuItemSelect("Send Invoice")}
//             >
//               Send Invoice
//             </MenuItem>
//             <MenuItem
//               onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}
//             >
//               Send Proposal/Els
//             </MenuItem>
//             <MenuItem
//               onClick={() => handleDrawerMenuItemSelect("Create Organizer")}
//             >
//               Create Organizer
//             </MenuItem>
//             <MenuItem
//               onClick={() =>
//                 handleDrawerMenuItemSelect("Apply folder template")
//               }
//             >
//               Apply folder template
//             </MenuItem>
//             <MenuItem
//               onClick={() => handleDrawerMenuItemSelect("Update account tags")}
//             >
//               Update account tags
//             </MenuItem>
//             {/* <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
//               Update job assignees
//             </MenuItem> */}
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
//               Create Task
//             </MenuItem>
//             <MenuItem
//               onClick={() => handleDrawerMenuItemSelect("Send message")}
//             >
//               Send message
//             </MenuItem>
//             <MenuItem
//               onClick={() =>
//                 handleDrawerMenuItemSelect("Update client-facing job status")
//               }
//             >
//               Update client-facing job status
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Drawer>

//       <Drawer
//         anchor="right"
//         open={isConditionsFormOpen}
//         onClose={handleGoBack}
//         BackdropProps={{ invisible: true }}
//         PaperProps={{ sx: { width: "550px", padding: 2 } }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <IconButton onClick={handleGoBack}>
//             <IoMdArrowRoundBack fontSize="large" color="blue" />
//           </IconButton>
//           <Typography variant="h6">Add conditions</Typography>
//         </Box>

//         <Box sx={{ padding: 2 }}>
//           <Typography variant="body1">
//             Apply automation only for accounts with these tags
//           </Typography>
//           <TextField
//             fullWidth
//             size="small"
//             variant="outlined"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
//             }}
//             sx={{ marginTop: 2 }}
//           />

//           <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
//             {filteredConditionTags.map((tag) => (
//               <Box
//                 key={tag._id}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 3,
//                   borderBottom: "1px solid grey",
//                   paddingBottom: 1,
//                 }}
//               >
//                 <Checkbox
//                   checked={tempSelectedTags.some(
//                     (selectedTag) => selectedTag._id === tag._id,
//                   )}
//                   onChange={() => handleCheckboxChange(tag)}
//                 />
//                 <Chip
//                   label={tag.tagName}
//                   sx={{
//                     backgroundColor: tag.tagColour,
//                     color: "#fff",
//                     fontWeight: "500",
//                     borderRadius: "20px",
//                     marginRight: 1,
//                   }}
//                 />
//               </Box>
//             ))}
//           </Box>

//           <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               disabled={tempSelectedTags.length === 0}
//               onClick={handleAddTags}
//             >
//               {currentAutomationIndex !== null &&
//               drawerAutomations[currentAutomationIndex]?.selectedTags?.length >
//                 0
//                 ? "Update"
//                 : "Add"}
//             </Button>
//             <Button variant="outlined" color="primary" onClick={handleGoBack}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default StagesSection;


import React, { useState, useEffect } from "react";
import { LuPenLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDragHandleDots2 } from "react-icons/rx";
import { Plus, X, Search, ArrowLeft } from "lucide-react";
import {
  templateAPI,
  authAPI,
  organizerAPI,
  proposalAPI,
  folderManagementAPI,
} from "../../../services/api";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import TagsMultiSelectDropDown from "../../../components/TagsSelectDropDown";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

const StagesSection = ({
  stages,
  stageNameErrors,
  handleAddStage,
  handleDeleteStage,
  handleStageNameChange,
  handleSaveAutomations,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [stageSelected, setStageSelected] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAutomations, setDrawerAutomations] = useState([]);
  const [drawerAnchorEl, setDrawerAnchorEl] = useState(null);
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [currentAutomationIndex, setCurrentAutomationIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
const [openAutomationMenu, setOpenAutomationMenu] = useState(false);
  const [addTaskTemplates, setAddTaskTemplates] = useState([]);
  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
  const [addChatTemplates, setAddChatTemplates] = useState([]);
  const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
  const [addProposalsandElsTeplates, setAddProposalsandElsTeplates] = useState([]);
  const [addOrganizerTemplates, setAddOrganizerTemplates] = useState([]);
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAllData();
    fetchUsers();
  }, []);

  const fetchAllData = async () => {
    try {
      const tagsResponse = await templateAPI.getAllTags();
      const tagsData = tagsResponse.data;
      setFilteredTags(tagsData.tags);

      const tagsOptions = (tagsData.tags || [])
        .map((tag) => ({
          value: tag._id || "",
          label: tag.tagName || "",
          colour: tag.tagColour || "#cccccc",
        }))
        .filter((tag) => tag.value && tag.label);
      setTags(tagsOptions);

      await Promise.all([
        fetchTaskTemplates(),
        fetchEmailTemplates(),
        fetchChatTemplates(),
        fetchInvoiceTemplates(),
        fetchProposalAndElsTemplates(),
        fetchOrganizerTemplates(),
        fetchFolderTemplates(),
        fetchClientFacingJobsData(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTaskTemplates = async () => {
    try {
      const response = await templateAPI.getAllTaskTemplates();
      setAddTaskTemplates(response.data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching task templates:", error);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const response = await templateAPI.getEmailTemplates();
      setAddEmailTemplates(response.data.emailTemplate);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  const fetchChatTemplates = async () => {
    try {
      const response = await templateAPI.getAllChatTemplates();
      setAddChatTemplates(response.data.chatTemplate);
    } catch (error) {
      console.error("Error fetching chat templates:", error);
    }
  };

  const fetchInvoiceTemplates = async () => {
    try {
      const response = await templateAPI.getAllInvoiceTemplates();
      setAddInvoiceTemplates(response.data.invoiceTemplate);
    } catch (error) {
      console.error("Error fetching invoice templates:", error);
    }
  };

  const fetchProposalAndElsTemplates = async () => {
    try {
      const response = await proposalAPI.getAllProposals();
      setAddProposalsandElsTeplates(response.data.proposallist);
    } catch (error) {
      console.error("Error fetching proposal templates:", error);
    }
  };

  const fetchOrganizerTemplates = async () => {
    try {
      const response = await organizerAPI.getOrganizerTemplates();
      setAddOrganizerTemplates(response.data.OrganizerTemplates);
    } catch (error) {
      console.error("Error fetching organizer templates:", error);
    }
  };

  const fetchFolderTemplates = async () => {
    try {
      const res = await folderManagementAPI.getFolderTemplates();
      setFolderTemplates(res.data.folderTemplates || []);
    } catch (error) {
      console.error("Error fetching folder templates:", error);
    }
  };

  const fetchClientFacingJobsData = async () => {
    try {
      const response = await templateAPI.getAllJobStatus();
      setClientFacingJobs(response.data.clientFacingJobStatues);
    } catch (error) {
      console.error("Error fetching client facing jobs:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getTeamMembers();
      const data = response.data;
      const userOptions = data.map((u) => ({
        value: u._id,
        label: u.username,
      }));
      setUsers(userOptions);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const taskTemplateOptions = addTaskTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const emailTemplateOptions = addEmailTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const chatTemplateOptions = addChatTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const invoiceTemplateOptions = addInvoiceTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const proposalElsOptions = addProposalsandElsTeplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const organizerOptions = addOrganizerTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const optionfolder = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));

  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  const statusOptions = [
    { value: true, label: "Show status" },
    { value: false, label: "Hide status" },
  ];

  const filteredConditionTags = filteredTags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientStatusSelection = async (event, newValue, automationIndex) => {
    updateAutomationState(automationIndex, { selectedClientStatus: newValue });

    if (newValue && newValue.value) {
      const clientjobId = newValue.value;
      try {
        const response = await templateAPI.getJobStatusById(clientjobId);
        const data = response.data;
        updateAutomationState(automationIndex, {
          selectedClientStatus: newValue,
          clientDescription: data.clientfacingjobstatuses?.clientfacingdescription || "",
        });
      } catch (error) {
        console.error("Error fetching client status data:", error);
      }
    } else {
      updateAutomationState(automationIndex, {
        selectedClientStatus: null,
        clientDescription: "",
      });
    }
  };

  const maxDescriptionLength = 150;

  // const handleAutomationMenuOpen = (event, stageIndex) => {
  //   setAnchorEl(event.currentTarget);
  //   setStageSelected(stageIndex);
  // };
const handleAutomationMenuOpen = (stageIndex) => {
  setStageSelected(stageIndex);
  setOpenAutomationMenu(true);
};
  // const handleAutomationMenuClose = () => {
  //   setAnchorEl(null);
  // };
  const handleAutomationMenuClose = () => {
  setOpenAutomationMenu(false);
};

  const handleAddAutomation = (stageSelected, option) => {
    const newAutomation = {
      type: option,
      index: 1,
      id: Date.now(),
      selectedtemp: null,
      selectedTags: [],
      reminderChecked: false,
      daysuntilNextReminder: "",
      noOfReminder: "",
      addTags: [],
      removeTags: [],
      selectedAssignees: [],
      assigneesToRemove: [],
      status: null,
      selectedClientStatus: null,
      clientDescription: "",
    };

    setDrawerAutomations([newAutomation]);
    setIsDrawerOpen(true);
    handleAutomationMenuClose();
  };

  const handleEditAutomations = (stageIndex) => {
    const stage = stages[stageIndex];
    if (stage && stage.automations && stage.automations.length > 0) {
      const restoredAutomations = stage.automations.map((automation) => {
        const restoredAutomation = { ...automation };

        if (automation.selectedtemp) {
          let templateOptions = [];
          switch (automation.type) {
            case "Create Task": templateOptions = taskTemplateOptions; break;
            case "Send Email": templateOptions = emailTemplateOptions; break;
            case "Send message": templateOptions = chatTemplateOptions; break;
            case "Send Invoice": templateOptions = invoiceTemplateOptions; break;
            case "Send Proposal/Els": templateOptions = proposalElsOptions; break;
            case "Apply folder template": templateOptions = optionfolder; break;
            case "Create Organizer": templateOptions = organizerOptions; break;
            default: templateOptions = [];
          }
          const templateObj = templateOptions.find(
            (opt) => opt.value === automation.selectedtemp
          );
          restoredAutomation.selectedtemp = templateObj || null;
        }

        if (automation.selectedTags && Array.isArray(automation.selectedTags)) {
          restoredAutomation.selectedTags = automation.selectedTags
            .map((tagId) => filteredTags.find((tag) => tag._id === tagId))
            .filter(Boolean);
        }

        if (automation.type === "Update account tags") {
          if (automation.addTags && Array.isArray(automation.addTags)) {
            restoredAutomation.addTags = automation.addTags
              .map((tagId) => tags.find((tag) => tag.value === tagId || tag._id === tagId))
              .filter(Boolean);
          }
          if (automation.removeTags && Array.isArray(automation.removeTags)) {
            restoredAutomation.removeTags = automation.removeTags
              .map((tagId) => tags.find((tag) => tag.value === tagId || tag._id === tagId))
              .filter(Boolean);
          }
        }

        if (automation.type === "Update job assignees") {
          if (automation.selectedAssignees && Array.isArray(automation.selectedAssignees)) {
            restoredAutomation.selectedAssignees = automation.selectedAssignees
              .map((assigneeId) => users.find((user) => user._id === assigneeId || user.value === assigneeId))
              .filter(Boolean);
          }
          if (automation.assigneesToRemove && Array.isArray(automation.assigneesToRemove)) {
            restoredAutomation.assigneesToRemove = automation.assigneesToRemove
              .map((assigneeId) => users.find((user) => user._id === assigneeId || user.value === assigneeId))
              .filter(Boolean);
          }
        }

        if (automation.selectedClientStatus) {
          const statusObj = optionstatus.find(
            (opt) => opt.value === automation.selectedClientStatus
          );
          restoredAutomation.selectedClientStatus = statusObj || null;
        }

        if (automation.status !== undefined && automation.status !== null) {
          const statusObj = statusOptions.find((opt) => opt.value === automation.status);
          restoredAutomation.status = statusObj || null;
        }

        return restoredAutomation;
      });
      setDrawerAutomations(restoredAutomations);
      setStageSelected(stageIndex);
      setIsDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setDrawerAutomations([]);
  };

  const handleDrawerMenuOpen = (event) => {
    setDrawerAnchorEl(event.currentTarget);
  };

  const handleDrawerMenuClose = () => {
    setDrawerAnchorEl(null);
  };

  const handleDrawerMenuItemSelect = (option) => {
    const newIndex = drawerAutomations.length + 1;
    const newAutomation = {
      type: option,
      index: newIndex,
      id: Date.now() + Math.random(),
      selectedtemp: null,
      selectedTags: [],
      reminderChecked: false,
      daysuntilNextReminder: "",
      noOfReminder: "",
      addTags: [],
      removeTags: [],
      selectedAssignees: [],
      assigneesToRemove: [],
      status: null,
      selectedClientStatus: null,
      clientDescription: "",
    };
    setDrawerAutomations((prev) => [...prev, newAutomation]);
    handleDrawerMenuClose();
  };

  const handleDeleteAutomation = (automationIndex) => {
    setDrawerAutomations((prev) => {
      const updatedAutomations = prev.filter((_, idx) => idx !== automationIndex);
      return updatedAutomations.map((automation, idx) => ({
        ...automation,
        index: idx + 1,
      }));
    });
  };

  const updateAutomationState = (automationIndex, updates) => {
    setDrawerAutomations((prev) =>
      prev.map((automation, idx) =>
        idx === automationIndex ? { ...automation, ...updates } : automation
      )
    );
  };

  const handleAddConditions = (automationIndex) => {
    const automation = drawerAutomations[automationIndex];
    setCurrentAutomationIndex(automationIndex);
    setTempSelectedTags(automation.selectedTags || []);
    setSearchTerm("");
    setIsConditionsFormOpen(true);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
    setCurrentAutomationIndex(null);
    setTempSelectedTags([]);
    setSearchTerm("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (tag) => {
    setTempSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddTags = () => {
    if (currentAutomationIndex !== null) {
      updateAutomationState(currentAutomationIndex, {
        selectedTags: tempSelectedTags,
      });
    }
    handleGoBack();
  };

  const handletemp = (newValue, automationType, automationIndex) => {
    updateAutomationState(automationIndex, { selectedtemp: newValue });
  };

  const handleSaveAllAutomations = () => {
    if (stageSelected === null) return;

    const automationTypeToRefModel = {
      "Create Task": "TaskTemplate",
      "Send Email": "EmailTemplate",
      "Send message": "ChatTemplate",
      "Send Invoice": "InvoiceTemplate",
      "Send Proposal/Els": "ProposalTemplate",
      "Apply folder template": "FolderTemplate",
      "Create Organizer": "OrganizerTemplate",
      "Update client-facing job status": null,
      "Update account tags": null,
      "Update job assignees": null,
    };

    const automationsWithDetails = drawerAutomations.map((automation) => {
      const refModel = automationTypeToRefModel[automation.type];
      const automationData = {
        ...automation,
        selectedtemp: automation.selectedtemp ? automation.selectedtemp.value : null,
        refModel: refModel,
        templateRefModel: refModel,
        selectedTags: automation.selectedTags ? automation.selectedTags.map((tag) => tag._id) : [],
        selectedClientStatus: automation.selectedClientStatus ? automation.selectedClientStatus.value : null,
        status: automation.status ? automation.status.value : null,
        clientDescription: automation.clientDescription || "",
      };

      if (automation.type === "Update account tags") {
        automationData.addTags = automation.addTags ? automation.addTags.map((tag) => tag.value || tag._id) : [];
        automationData.removeTags = automation.removeTags ? automation.removeTags.map((tag) => tag.value || tag._id) : [];
      } else {
        automationData.addTags = [];
        automationData.removeTags = [];
      }

      automationData.selectedAssignees = automation.selectedAssignees
        ? automation.selectedAssignees.map((user) => user.value || user._id)
        : [];
      automationData.assigneesToRemove = automation.assigneesToRemove
        ? automation.assigneesToRemove.map((user) => user.value || user._id)
        : [];

      return automationData;
    });

    if (handleSaveAutomations) {
      handleSaveAutomations(stageSelected, automationsWithDetails);
    }
    handleDrawerClose();
  };

  const handleDeleteSavedAutomation = (stageIndex, automationIndex) => {
    if (handleSaveAutomations) {
      const stage = stages[stageIndex];
      if (stage && stage.automations) {
        const updatedAutomations = stage.automations.filter((_, idx) => idx !== automationIndex);
        handleSaveAutomations(stageIndex, updatedAutomations);
      }
    }
  };

  const renderActionContent = (automation, index) => {
    const automationSelect = automation.type;
    const automationIndex = index;

    const selectedTags = automation.selectedTags || [];
    const selectedTagElements = selectedTags.map((tag, idx) => (
      <Badge
        key={idx}
        style={{ backgroundColor: tag.tagColour }}
        className="mr-1 text-white font-medium rounded-full"
      >
        {tag.tagName}
      </Badge>
    ));

    const renderTemplateSelector = (options) => (
      <div className="space-y-2">
        <Label className="text-sm">Select template</Label>
        <Select
          value={automation.selectedtemp?.value || ""}
          onValueChange={(value) => {
            const selected = options.find((opt) => opt.value === value);
            handletemp(selected, automationSelect, automationIndex);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Template" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );

    switch (automationSelect) {
      case "Create Task":
      case "Send Email":
      case "Send message":
      case "Send Invoice":
      case "Send Proposal/Els":
      case "Apply folder template":
      case "Create Organizer":
        const optionsMap = {
          "Create Task": taskTemplateOptions,
          "Send Email": emailTemplateOptions,
          "Send message": chatTemplateOptions,
          "Send Invoice": invoiceTemplateOptions,
          "Send Proposal/Els": proposalElsOptions,
          "Apply folder template": optionfolder,
          "Create Organizer": organizerOptions,
        };
        return (
          <div className="border-2 border-border rounded-lg p-4 space-y-3">
            <p className="font-medium">{automationSelect}</p>
            {renderTemplateSelector(optionsMap[automationSelect])}
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm">Only for:</span>
                {selectedTagElements}
              </div>
            )}
            <Button
              variant="link"
              className="px-0"
              onClick={() => handleAddConditions(automationIndex)}
            >
              {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
            </Button>
          </div>
        );

      case "Update client-facing job status":
        return (
          <div className="border-2 border-border rounded-lg p-4 space-y-3">
            <p className="font-medium">{automationSelect}</p>
            <p className="text-xs text-muted-foreground">
              The client-facing status will update automatically as soon as the job enters the stage. Your clients will see it in their client portal.
            </p>

            <div className="space-y-2">
              <Label>Visibility for client</Label>
              <Select
                value={automation.status?.value?.toString() || ""}
                onValueChange={(value) => {
                  const selected = statusOptions.find((opt) => opt.value.toString() === value);
                  updateAutomationState(automationIndex, { status: selected });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value.toString()} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {automation.status?.value === true && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Select status</Label>
                  <Select
                    value={automation.selectedClientStatus?.value || ""}
                    onValueChange={(value) => {
                      const selected = optionstatus.find((opt) => opt.value === value);
                      handleClientStatusSelection(null, selected, automationIndex);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionstatus.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: option.clientfacingColour }}
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status description for client</Label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={automation.clientDescription || ""}
                    onChange={(e) =>
                      updateAutomationState(automationIndex, { clientDescription: e.target.value })
                    }
                    placeholder="Status description for client"
                  />
                  <p className="text-xs text-muted-foreground">
                    {(automation.clientDescription || "").length}/{maxDescriptionLength}
                  </p>
                </div>
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm">Only for:</span>
                {selectedTagElements}
              </div>
            )}
            <Button
              variant="link"
              className="px-0"
              onClick={() => handleAddConditions(automationIndex)}
            >
              {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
            </Button>
          </div>
        );

      case "Update account tags":
        return (
          <div className="border-2 border-border rounded-lg p-4 space-y-3">
            <p className="font-medium">{automationSelect}</p>

            <div className="space-y-2">
              <Label className="font-semibold">Add Tags</Label>
              <TagsMultiSelectDropDown
                value={automation.addTags || []}
                onChange={(newValue) =>
                  updateAutomationState(automationIndex, { addTags: newValue })
                }
                options={tags.filter(
                  (tag) =>
                    tag &&
                    tag.value &&
                    tag.label &&
                    !(automation.removeTags || []).some(
                      (removeTag) => removeTag && removeTag.value === tag.value
                    )
                )}
                placeholder="Select tags to ADD"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Remove Tags</Label>
              <TagsMultiSelectDropDown
                value={automation.removeTags || []}
                onChange={(newValue) =>
                  updateAutomationState(automationIndex, { removeTags: newValue })
                }
                options={tags.filter(
                  (tag) =>
                    tag &&
                    tag.value &&
                    tag.label &&
                    !(automation.addTags || []).some(
                      (addTag) => addTag && addTag.value === tag.value
                    )
                )}
                placeholder="Select tags to REMOVE"
              />
            </div>

            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm">Only for:</span>
                {selectedTagElements}
              </div>
            )}
            <Button
              variant="link"
              className="px-0"
              onClick={() => handleAddConditions(automationIndex)}
            >
              {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
            </Button>
          </div>
        );

      case "Update job assignees":
        return (
          <div className="border-2 border-border rounded-lg p-4 space-y-3">
            <p className="font-medium">{automationSelect}</p>

            <div className="space-y-2">
              <Label className="font-semibold">Add Job Assignees</Label>
              <MultiSelectDropdown
                value={automation.selectedAssignees || []}
                onChange={(newValue) =>
                  updateAutomationState(automationIndex, { selectedAssignees: newValue })
                }
                options={users.filter(
                  (user) =>
                    user &&
                    user.value &&
                    user.label &&
                    !(automation.assigneesToRemove || []).some(
                      (assigneesToRemove) =>
                        assigneesToRemove && assigneesToRemove.value === user.value
                    )
                )}
                placeholder="Select Assignees to ADD"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Remove Job Assignees</Label>
              <MultiSelectDropdown
                value={automation.assigneesToRemove || []}
                onChange={(newValue) =>
                  updateAutomationState(automationIndex, { assigneesToRemove: newValue })
                }
                options={users.filter(
                  (user) =>
                    user &&
                    user.value &&
                    user.label &&
                    !(automation.selectedAssignees || []).some(
                      (selectedAssignees) =>
                        selectedAssignees && selectedAssignees.value === user.value
                    )
                )}
                placeholder="Select Assignees to REMOVE"
              />
            </div>

            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm">Only for:</span>
                {selectedTagElements}
              </div>
            )}
            <Button
              variant="link"
              className="px-0"
              onClick={() => handleAddConditions(automationIndex)}
            >
              {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
            </Button>
          </div>
        );

      default:
        return (
          <div>
            <h3 className="font-semibold">{automationSelect} Automation</h3>
            <p className="text-sm text-muted-foreground">
              Configure your {automationSelect.toLowerCase()} automation settings here...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stages</h3>
        <Button onClick={() => handleAddStage(stages.length)} className="gap-2">
          <Plus className="h-4 w-4" /> Add stage
        </Button>
      </div>

      {/* Stages Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-2 px-1">
        {stages.map((stage, index) => (
          <React.Fragment key={index}>
            {/* Stage Card */}
            <div className="min-w-[300px] max-w-[320px] h-[500px] flex flex-col rounded-xl border border-border bg-background shadow-sm flex-shrink-0">
              {/* Header */}
              <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
                <div className="flex items-center gap-2">
                  <RxDragHandleDots2 className="opacity-50" />
                  <div className="flex-1">
                    <Input
                      variant="standard"
                      placeholder="Stage Name"
                      value={stage.name}
                      onChange={(e) => handleStageNameChange(e, index)}
                      className={`border-none shadow-none px-0 ${stageNameErrors[index] ? "border-red-500" : ""}`}
                    />
                    {stageNameErrors[index] && (
                      <p className="text-xs text-red-500 mt-1">{stageNameErrors[index]}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteStage(index)}
                    className="text-destructive hover:bg-destructive/10 h-8 w-8"
                  >
                    <RiDeleteBin6Line size={16} />
                  </Button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                <div>
                  <p className="text-sm font-semibold">Stage conditions</p>
                  <p className="text-xs text-muted-foreground">
                    {index === 0
                      ? "First stage can't have conditions"
                      : index === stages.length - 1
                      ? "Last stage can't have conditions"
                      : "Job enters this stage if conditions are met"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold">Automations</p>
                  <p className="text-xs text-muted-foreground">Triggered when job enters stage</p>
                </div>

               
                {/* Automations List */}
{stage.automations && stage.automations.length > 0 ? (
  <div className="flex flex-col gap-1.5">
    {stage.automations.map((automation, autoIndex) => {
      // ===== HELPERS =====
      const getTemplateName = () => {
        if (!automation.selectedtemp) return null;

        switch (automation.type) {
          case "Create Task":
            return taskTemplateOptions.find(
              (opt) => opt.value === automation.selectedtemp
            )?.label;
          case "Send Email":
            return emailTemplateOptions.find(
              (opt) => opt.value === automation.selectedtemp
            )?.label;
          case "Send message":
            return chatTemplateOptions.find(
              (opt) => opt.value === automation.selectedtemp
            )?.label;
          case "Send Invoice":
            return invoiceTemplateOptions.find(
              (opt) => opt.value === automation.selectedtemp
            )?.label;
          case "Send Proposal/Els":
            return proposalElsOptions.find(
              (opt) => opt.value === automation.selectedtemp
            )?.label;
          case "Apply folder template":
            return optionfolder.find(
              (opt) => opt.value === automation.selectedtemp
            )?.label;
          case "Create Organizer":
            return organizerOptions.find(
              (opt) => opt.value === automation.selectedtemp
            )?.label;
          default:
            return null;
        }
      };

      const getTagDetails = (id) =>
        filteredTags.find((tag) => tag._id === id);

      const getAddRemoveTagDetails = (ids) =>
        ids?.map(getTagDetails).filter(Boolean) || [];

      const getClientStatusDetails = () =>
        optionstatus.find(
          (opt) => opt.value === automation.selectedClientStatus
        );

      const templateName = getTemplateName();
      const tagDetails =
        automation.selectedTags
          ?.map(getTagDetails)
          .filter(Boolean) || [];

      const clientStatusDetails = getClientStatusDetails();

      const addTagDetails =
        automation.type === "Update account tags"
          ? getAddRemoveTagDetails(automation.addTags)
          : [];

      const removeTagDetails =
        automation.type === "Update account tags"
          ? getAddRemoveTagDetails(automation.removeTags)
          : [];

      return (
        <div
          key={automation.id || autoIndex}
          className="p-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          {/* HEADER */}
          <div className="flex justify-between mb-1">
            <div className="flex gap-1">
              <div className="w-[22px] h-[22px] rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-medium">
                {automation.index}
              </div>
              <span className="text-[11px] font-semibold">{automation.type}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteSavedAutomation(index, autoIndex)}
              className="text-destructive hover:bg-destructive/10 h-6 w-6"
            >
              <RiDeleteBin6Line size={14} />
            </Button>
          </div>

          {/* TEMPLATE */}
          {templateName && (
            <Badge variant="outline" className="mb-1 text-[11px]">
              {templateName}
            </Badge>
          )}

          {/* CLIENT STATUS */}
          {automation.type === "Update client-facing job status" &&
            clientStatusDetails && (
              <div className="mb-1">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Client Status:
                </span>
                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                  {/* Status Dot + Label */}
                  <div className="flex items-center gap-0.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: clientStatusDetails.clientfacingColour }}
                    />
                    <span className="text-[11px] font-medium">
                      {clientStatusDetails.label}
                    </span>
                  </div>

                  {/* Visibility Chip */}
                  <Badge
                    variant={automation.status === true ? "default" : "outline"}
                    className="text-[10px]"
                  >
                    {automation.status === true
                      ? "Visible to Client"
                      : "Hidden from Client"}
                  </Badge>
                </div>
              </div>
            )}

          {/* UPDATE ACCOUNT TAGS SECTION */}
          {automation.type === "Update account tags" && (
            <div className="flex flex-col gap-1">
              {/* ADD TAGS */}
              {addTagDetails.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">
                    Add Tags:
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {addTagDetails.map((tag) => (
                      <Badge
                        key={tag._id}
                        style={{ backgroundColor: tag.tagColour }}
                        className="text-white text-[11px] h-[22px]"
                      >
                        {tag.tagName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* REMOVE TAGS */}
              {removeTagDetails.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-destructive">
                    Remove Tags:
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {removeTagDetails.map((tag) => (
                      <Badge
                        key={tag._id}
                        style={{ backgroundColor: tag.tagColour }}
                        className="text-white text-[11px] h-[22px] opacity-70 line-through"
                      >
                        {tag.tagName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONDITIONS TAGS */}
          {tagDetails.length > 0 && (
            <div className="mt-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Conditions:
              </span>
              <div className="flex flex-wrap gap-0.5 mt-0.5">
                {tagDetails.map((tag) => (
                  <Badge
                    key={tag._id}
                    style={{ backgroundColor: tag.tagColour }}
                    className="text-white text-[11px] h-[22px] font-medium"
                  >
                    {tag.tagName}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* REMINDERS */}
          {automation.reminderChecked && (
            <span className="text-[11px] text-muted-foreground">
              {automation.daysuntilNextReminder} days,{" "}
              {automation.noOfReminder} times
            </span>
          )}

          {/* REF MODEL */}
          {automation.refModel && (
            <span className="text-[11px] text-muted-foreground block mt-1">
              Ref: {automation.refModel}
            </span>
          )}
        </div>
      );
    })}
  </div>
) : (
  <p className="text-sm text-muted-foreground italic">
    No automations configured
  </p>
)}
              </div>

              {/* Footer */}
              {/* <div className="p-4 border-t border-border">
                <Button
                  variant={stage.automations?.length > 0 ? "default" : "outline"}
                  className="w-full gap-2"
                  // onClick={(e) =>
                  //   stage.automations?.length > 0
                  //     ? handleEditAutomations(index)
                  //     : handleAutomationMenuOpen(e, index)
                  // }
                  onClick={() =>
  stage.automations?.length > 0
    ? handleEditAutomations(index)
    : handleAutomationMenuOpen(index)
}
                >
                  {stage.automations?.length > 0 ? (
                    <>
                      <LuPenLine className="h-4 w-4" /> Edit Automations ({stage.automations.length})
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Add Automation
                    </>
                  )}
                </Button>
              </div> */}
              <div className="p-4 border-t border-border">
  {stage.automations?.length > 0 ? (
    <Button
      className="w-full gap-2"
      onClick={() => handleEditAutomations(index)}
    >
      <LuPenLine className="h-4 w-4" />
      Edit Automations ({stage.automations.length})
    </Button>
  ) : (
    <DropdownMenu
      open={openAutomationMenu && stageSelected === index}
      onOpenChange={(open) => {
        setOpenAutomationMenu(open);
        if (open) setStageSelected(index);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Automation
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Send Email")
          }
        >
          Send Email
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Send Invoice")
          }
        >
          Send Invoice
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Send Proposal/Els")
          }
        >
          Send Proposal/Els
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Create Organizer")
          }
        >
          Create Organizer
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Apply folder template")
          }
        >
          Apply folder template
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Update account tags")
          }
        >
          Update account tags
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Create Task")
          }
        >
          Create Task
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(index, "Send message")
          }
        >
          Send message
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            handleAddAutomation(
              index,
              "Update client-facing job status"
            )
          }
        >
          Update client-facing job status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
</div>
            </div>

            {/* Add Stage Button Between Stages */}
            {index < stages.length - 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAddStage(index + 1)}
                className="self-center border-dashed h-10 w-10 rounded-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Automation Menu Dropdown */}
      {/* <DropdownMenu open={Boolean(anchorEl)} onOpenChange={setAnchorEl}>
        <DropdownMenuTrigger asChild>
          <span />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[200px] overflow-y-auto">
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
            Send Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
            Send Proposal/Els
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
            Create Organizer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
            Apply folder template
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
            Update account tags
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
            Create Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
            Send message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
            Update client-facing job status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}

      {/* Automation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleDrawerClose} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[700px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                {stageSelected !== null && stages[stageSelected]?.automations?.length > 0
                  ? `Edit Automations - Stage ${stageSelected + 1}`
                  : `Add Automations - Stage ${stageSelected !== null ? stageSelected + 1 : "Loading..."}`}
              </h2>
              <button
                onClick={handleDrawerClose}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {drawerAutomations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No automations added yet. Click "Add Another Automation" to get started.
                  </p>
                </div>
              ) : (
                drawerAutomations.map((automation, idx) => (
                  <div key={automation.id || idx} className="relative border border-border rounded-lg p-4 bg-muted/30">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAutomation(idx)}
                      className="absolute top-3 right-3 text-destructive hover:bg-destructive/10 h-7 w-7"
                    >
                      <RiDeleteBin6Line className="h-4 w-4" />
                    </Button>
                    <h3 className="text-sm font-semibold mb-3 pr-8">
                      Automation {automation.index}: {automation.type}
                    </h3>
                    {renderActionContent(automation, idx)}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border shrink-0 p-5 space-y-3">
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleDrawerMenuOpen} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Another Automation
                </Button>
              </div>
              <Button
                onClick={handleSaveAllAutomations}
                disabled={drawerAutomations.length === 0 || stageSelected === null}
                className="w-full"
              >
                {stageSelected === null
                  ? "No Stage Selected"
                  : stages[stageSelected]?.automations?.length > 0
                  ? `Update Automations (${drawerAutomations.length})`
                  : `Save Automations (${drawerAutomations.length})`}
              </Button>
            </div>

            {/* Drawer Menu for Adding More Automations */}
            <DropdownMenu open={Boolean(drawerAnchorEl)} onOpenChange={setDrawerAnchorEl}>
              <DropdownMenuTrigger asChild>
                <span />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[200px] overflow-y-auto">
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
                  Send Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
                  Send Proposal/Els
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
                  Create Organizer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
                  Apply folder template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
                  Update account tags
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
                  Create Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
                  Send message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
                  Update client-facing job status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Conditions Drawer */}
      {isConditionsFormOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleGoBack} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[550px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
              <button
                onClick={handleGoBack}
                className="p-1 rounded-md text-primary hover:bg-primary/10 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-base font-semibold text-foreground">Add conditions</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-sm text-muted-foreground mb-4">
                Apply automation only for accounts with these tags
              </p>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[60vh]">
                <div className="space-y-3">
                  {filteredConditionTags.map((tag) => (
                    <div key={tag._id} className="flex items-center gap-3 py-2 border-b border-border">
                      <Checkbox
                        checked={tempSelectedTags.some((selectedTag) => selectedTag._id === tag._id)}
                        onCheckedChange={() => handleCheckboxChange(tag)}
                      />
                      <Badge
                        style={{ backgroundColor: tag.tagColour }}
                        className="text-white font-medium rounded-full"
                      >
                        {tag.tagName}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={handleGoBack}>
                Cancel
              </Button>
              <Button
                onClick={handleAddTags}
                disabled={tempSelectedTags.length === 0}
              >
                {currentAutomationIndex !== null &&
                drawerAutomations[currentAutomationIndex]?.selectedTags?.length > 0
                  ? "Update"
                  : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StagesSection;