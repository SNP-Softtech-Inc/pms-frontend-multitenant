

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   FormGroup,
//   FormControlLabel,
//   Switch,
//   Button,
//   Paper,
//   Card,
//   CardContent,
//   CircularProgress,
//   FormControl,
//   Autocomplete,
//   Popover,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { InfoOutlined } from "@mui/icons-material";
// import { useParams } from "react-router-dom";
// import Cookies from "js-cookie";
// import MultiSelectDropdown from "../../../../components/MultiSelectDropdown";
// import ShortcodeTextField from "../../../../components/ShortcodeTextField";
// import { useAuth } from "../../../../context/AuthContext";
// import {
//   accountsAPI,
//   proposalAPI,
//   templateAPI,
//   authAPI,
// } from "../../../../services/api";

// const GeneralStep = ({
//   formData,
//   updateFormData,
//   nextStep,
//   stepErrors,
//   setStepErrors,
// }) => {
//   const { accountId } = useParams();
//   const { user } = useAuth();

//  console.log("GeneralStep render - formData:", formData);
//   const [accounts, setAccounts] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [invoiceTemplates, setInvoiceTemplates] = useState([]);
//   const [internalOptions, setInternalOptions] = useState([]);

//   // === SHORTCODES States ===
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textFieldRef = useRef(null);

//   useEffect(() => {
//     const accountShortcuts = [
//       { title: "Account Shortcodes", isBold: true },
//       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//       { title: "Date Shortcodes", isBold: true },
//       {
//         title: "Current day full date",
//         isBold: false,
//         value: "CURRENT_DAY_FULL_DATE",
//       },
//       {
//         title: "Current day number",
//         isBold: false,
//         value: "CURRENT_DAY_NUMBER",
//       },
//       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//       {
//         title: "Current month number",
//         isBold: false,
//         value: "CURRENT_MONTH_NUMBER",
//       },
//       {
//         title: "Current month name",
//         isBold: false,
//         value: "CURRENT_MONTH_NAME",
//       },
//       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//       {
//         title: "Last day full date",
//         isBold: false,
//         value: "LAST_DAY_FULL_DATE",
//       },
//       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//       { title: "Last week", isBold: false, value: "LAST_WEEK" },
//       { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
//       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//       { title: "Last year", isBold: false, value: "LAST_YEAR" },
//       {
//         title: "Next day full date",
//         isBold: false,
//         value: "NEXT_DAY_FULL_DATE",
//       },
//       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//       { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
//       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//     ];
//     setShortcuts(accountShortcuts);
//     setFilteredShortcuts(accountShortcuts);
//   }, []);

//   // Fetch accounts and templates on component mount
//   useEffect(() => {
//     fetchAccounts();
//     fetchTemplates();
//     fetchInvoiceTemplates();
//     fetchTeamMembers();
//   }, []);



// const fetchAccounts = async () => {
//   try {
//     // 🔹 1. CHECK COOKIES FIRST (no API call needed)
//     const accountIdCookie = Cookies.get("accountId");
//     const accountName = Cookies.get("accountName");

//     if (accountIdCookie && accountName) {
//       const selectedAccount = {
//         label: accountName,
//         value: accountIdCookie,
//       };

//       updateFormData("general", {
//         account: [selectedAccount],
//       });

//       if (stepErrors.account) {
//         setStepErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors.account;
//           return newErrors;
//         });
//       }

//       console.log("Account set from cookies:", selectedAccount);
//       return; // ✅ STOP HERE (no API call)
//     }

//     // 🔹 2. ROLE-BASED API CALL
//     let response;

//     if (user?.role === "team_member") {
//       response = await accountsAPI.getAccountsByTeamMember(true);
//     } else {
//       response = await accountsAPI.getAccountNamesByStatus(true);
//     }

//     const result = response?.data || {};
//     const accountList = Array.isArray(result.accountlist)
//       ? result.accountlist
//       : [];

//     setAccounts(accountList);
//     console.log("Fetched accounts:", accountList);

//     // 🔹 3. AUTO-SELECT FROM PARAMS (if exists)
//     const selectedAccountData = accountList.find(
//       (account) => account._id === accountId
//     );

//     if (selectedAccountData) {
//       const selectedAccount = {
//         label: selectedAccountData.accountName,
//         value: selectedAccountData._id,
//       };

//       updateFormData("general", {
//         account: [selectedAccount],
//       });

//       if (stepErrors.account) {
//         setStepErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors.account;
//           return newErrors;
//         });
//       }

//       console.log("Auto-selected account:", selectedAccount);
//     }
//   } catch (error) {
//     console.error("Error fetching accounts:", error);
//   }
// };
//   const fetchTemplates = async () => {
//     try {
//       setLoading(true);
//       const response = await proposalAPI.getAllProposals();
//       setTemplates(response.data.proposallist || []);
//       console.log("proposal template", response.data.proposallist);
//     } catch (error) {
//       console.error("Error fetching templates:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchInvoiceTemplates = async () => {
//     try {
//       const response = await templateAPI.getAllInvoiceTemplates();
//       setInvoiceTemplates(response.data.invoiceTemplate || response.data || []);
//     } catch (error) {
//       console.error("Error fetching invoice templates:", error);
//     }
//   };

// const fetchTeamMembers = async () => {
//   try {
//     const response = await authAPI.getAllUsers({
//       page: 1,
//       limit: 50,
//       status: "active",
//     });

//     console.log("API RESPONSE:", response.data);

//     // Handle different response structures
//     let users = [];
//     if (response.data?.users) {
//       users = response.data.users;
//     } else if (Array.isArray(response.data)) {
//       users = response.data;
//     } else if (response.data?.data?.users) {
//       users = response.data.data.users;
//     }

//     if (!users.length) {
//       console.warn("No users found");
//     }

//     const formatted = users.map((user) => ({
//       value: user._id,
//       label: user.username,
//       email: user.email, // Keep email for display if needed
//     }));

//     console.log("FORMATTED USERS:", formatted);
//     setInternalOptions(formatted);
//   } catch (err) {
//     console.error("User fetch error:", err?.response || err);
//   }
// };

//   // Fetch template data
//   const fetchTemplateData = async (templateId) => {
//     try {
//       setLoading(true);
//       const response = await proposalAPI.getProposalById(templateId);
//       const templateData = response.data;

//       console.log("Template data received:", templateData);

//       // Transform the template data
//       const transformedData = transformTemplateToForm(templateData);
//  // Handle team members from template
//     let templateTeamMembers = templateData.general?.teamMembers || [];
    
//     // Ensure team members are stored as array of IDs (not objects)
//     if (templateTeamMembers.length > 0 && typeof templateTeamMembers[0] === 'object') {
//       // If they are objects, extract the IDs
//       templateTeamMembers = templateTeamMembers.map(tm => tm.value || tm._id || tm);
//     }

//     // If template has no team members and we have a logged-in user, use that
//     let teamMembersToUse = templateTeamMembers;
//     if (!teamMembersToUse.length && user?.id) {
//       teamMembersToUse = [user.id];
//     }
//       // Update all form sections with the transformed template data
//       updateFormData("general", {
//         ...formData.general,
//         template: {
//           value: templateId,
//           label:
//             templateData.general?.templateName ||
//             templateData.general?.proposalName ||
//             "Template",
//         },
//         proposalTemp: templateId,
//         proposalName:
//           templateData.general?.proposalName ||
//           templateData.general?.templateName ||
//           "",
//         introductionEnabled: templateData.general?.introductionEnabled ?? true,
//         termsEnabled: templateData.general?.termsEnabled ?? true,
//         servicesEnabled: templateData.general?.servicesEnabled ?? true,
//         paymentsEnabled: templateData.general?.paymentsEnabled ?? false,
//         teamMembers: teamMembersToUse,
//       });

//       // Update other sections with transformed template data
//       if (transformedData.introduction) {
//         updateFormData("introduction", transformedData.introduction);
//       }

//       if (transformedData.terms) {
//         updateFormData("terms", transformedData.terms);
//       }

//       if (transformedData.services) {
//         updateFormData("services", transformedData.services);
//       }

//       if (transformedData.payments) {
//         updateFormData("payments", transformedData.payments);
//       }

//       // Clear all step errors after template data is loaded
//       setStepErrors({});
//     } catch (error) {
//       console.error("Error fetching template data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Transform template data
//   const transformTemplateToForm = (templateData) => {
//     return {
//       introduction: {
//         title: templateData.introduction?.title || "",
//         description: templateData.introduction?.description || "",
//       },
//       terms: {
//         title: templateData.terms?.title || "",
//         description: templateData.terms?.description || "",
//       },
//       services: {
//         option: templateData.services?.option || "",
//         invoices: transformInvoicesForForm(
//           templateData.services?.invoices || [],
//         ),
//         itemizedData: transformItemizedDataForForm(
//           templateData.services?.itemizedData,
//         ),
//       },
//       payments: {
//         method: templateData.payments?.method || "",
//         amount: templateData.payments?.amount || 0,
//       },
//     };
//   };

//   const transformInvoicesForForm = (invoices) => {
//     if (!invoices || invoices.length === 0) {
//       return [{ id: 1, ...getEmptyInvoice() }];
//     }

//     return invoices.map((invoice, index) => {
//       const template = invoiceTemplates.find(
//         (t) => t._id === invoice.invoiceTemplate,
//       );

//       return {
//         id: index + 1,
//         invoiceTemplate: invoice.invoiceTemplate
//           ? {
//               value: invoice.invoiceTemplate,
//               label: template?.templatename || "Template",
//             }
//           : null,
//         teamMembers: invoice.teamMembers || [],
//         issueInvoice: "immediately",
//         specificDate: null,
//         selectedTime: null,
//         description: invoice.description || "",
//         charCount: invoice.description?.length || 0,
//         charLimit: 1000,
//         rows: transformLineItemsToRows(invoice.lineItems || []),
//         subtotal: invoice.subtotal?.toString() || "0.00",
//         taxRate: invoice.taxRate?.toString() || "0",
//         taxTotal: invoice.taxTotal?.toString() || "0.00",
//         totalAmount: invoice.totalAmount?.toString() || "0.00",
//         clientNote: "",
//       };
//     });
//   };

//   const transformLineItemsToRows = (lineItems) => {
//     if (!lineItems || lineItems.length === 0) {
//       return [getEmptyRow()];
//     }

//     return lineItems.map((item) => ({
//       productorService: item.productorService || "",
//       description: item.description || "",
//       rate: item.rate?.toString() || "0.00",
//       quantity: item.quantity?.toString() || "1",
//       amount: item.amount?.toString() || "0.00",
//       tax: item.tax || false,
//       isDiscount: false,
//     }));
//   };

//   const transformItemizedDataForForm = (itemizedData) => {
//     if (!itemizedData) {
//       return {
//         price: 0,
//         name: "",
//         rows: [getEmptyRow()],
//         subtotal: "0.00",
//         taxRate: "0",
//         taxTotal: "0.00",
//         totalAmount: "0.00",
//       };
//     }

//     return {
//       ...itemizedData,
//       price: itemizedData.price || 0,
//       name: itemizedData.name || "",
//       rows: transformLineItemsToRows(itemizedData.lineItems),
//       subtotal: itemizedData.subtotal?.toString() || "0.00",
//       taxRate: itemizedData.taxRate?.toString() || "0",
//       taxTotal: itemizedData.taxTotal?.toString() || "0.00",
//       totalAmount: itemizedData.totalAmount?.toString() || "0.00",
//     };
//   };

//   function getEmptyRow() {
//     return {
//       productorService: "",
//       description: "",
//       rate: "0.00",
//       quantity: "1",
//       amount: "0.00",
//       tax: false,
//       isDiscount: false,
//     };
//   }

//   function getEmptyInvoice() {
//     return {
//       invoiceTemplate: null,
//       teamMember: [],
//       issueInvoice: "immediately",
//       specificDate: null,
//       selectedTime: null,
//       description: "",
//       charCount: 0,
//       charLimit: 1000,
//       rows: [getEmptyRow()],
//       subtotal: "0.00",
//       taxRate: "0",
//       taxTotal: "0.00",
//       totalAmount: "0.00",
//       clientNote: "",
//     };
//   }

//   // Get selected users objects from stored IDs or default to logged-in user
//  const getSelectedUsers = () => {
//   let selectedIds = formData.general.teamMembers || [];

//   // If no team members selected and we have a logged-in user, set default
//   if (!selectedIds.length && user?.id && !formData.general.proposalTemp) {
//     selectedIds = [user.id];
//     // Update formData with default user
//     updateFormData("general", {
//       teamMembers: selectedIds,
//     });
//   }

//   // Convert IDs to objects that MultiSelectDropdown expects
//   const selectedUsers = selectedIds
//     .map((userId) => {
//       const foundUser = internalOptions.find((opt) => opt.value === userId);
//       return foundUser || { value: userId, label: `User ${userId}` };
//     })
//     .filter(Boolean); // Remove any undefined/null values

//   console.log("Selected users:", selectedUsers);
//   return selectedUsers;
// };

//   const handleTeamMembersChange = (newSelectedUsers) => {
//   // Extract just the IDs from the user objects
//   const selectedIds = newSelectedUsers.map((user) => user.value);
  
//   console.log("Team members changed:", selectedIds);
  
//   updateFormData("general", {
//     teamMembers: selectedIds,
//   });
  
//   // Clear error if exists
//   if (stepErrors.teamMembers && selectedIds.length > 0) {
//     setStepErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors.teamMembers;
//       return newErrors;
//     });
//   }
// };

//   const handleInputChange = (field, value) => {
//     updateFormData("general", { [field]: value });

//     if (value && value.toString().trim() !== "" && stepErrors[field]) {
//       setStepErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

// const handleAccountChange = (selectedAccount) => {
//   updateFormData("general", {
//     account: selectedAccount || null,
//   });

//   if (selectedAccount && stepErrors.account) {
//     setStepErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors.account;
//       return newErrors;
//     });
//   }
// };


//   const getCurrentTemplateValue = () => {
//     if (!formData.general.template && formData.general.proposalTemp) {
//       const foundTemplate = templates.find(
//         (t) => t._id === formData.general.proposalTemp,
//       );
//       if (foundTemplate) {
//         return {
//           value: foundTemplate._id,
//           label:
//             foundTemplate.general?.templateName ||
//             foundTemplate.general?.proposalName ||
//             "Unnamed Template",
//         };
//       }
//     }
//     return formData.general.template || null;
//   };

//   const handleTemplateChange = (event, selectedTemplate) => {
//     if (selectedTemplate) {
//       updateFormData("general", {
//         template: selectedTemplate,
//         proposalTemp: selectedTemplate?.value,
//       });
//       fetchTemplateData(selectedTemplate.value);
//     } else {
//       clearTemplateData();
//     }

//     if (selectedTemplate && stepErrors.template) {
//       setStepErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.template;
//         return newErrors;
//       });
//     }
//   };

//   const clearTemplateData = () => {
//     updateFormData("general", {
//       ...formData.general,
//       template: null,
//       proposalTemp: "",
//       proposalName: "",
//       teamMembers: [],
//       introductionEnabled: false,
//       termsEnabled: false,
//       servicesEnabled: false,
//     });

//     updateFormData("introduction", {
//       title: "",
//       description: "",
//     });

//     updateFormData("terms", {
//       title: "",
//       description: "",
//     });

//     updateFormData("services", {
//       option: "",
//       invoices: [{ id: 1, ...getEmptyInvoice() }],
//       itemizedData: {
//         price: 0,
//         name: "",
//         rows: [getEmptyRow()],
//         subtotal: "0.00",
//         taxRate: "0",
//         taxTotal: "0.00",
//         totalAmount: "0.00",
//       },
//     });

//     updateFormData("payments", {
//       method: "",
//       amount: 0,
//     });
//   };

//   const handleVisibilityChange = (field, value) => {
//     updateFormData("general", { [field]: value });
//   };

//   const toggleDropdown = (event) => {
//     setAnchorEl(event.currentTarget);
//     setShowDropdown(!showDropdown);
//   };

//   const handleCloseDropdown = () => {
//     setAnchorEl(null);
//     setShowDropdown(false);
//   };

  

//   const StepCard = ({ title, description, checked, onChange, name }) => (
//     <Card
//       variant="outlined"
//       sx={{
//         mb: 2,
//         borderColor: checked ? "primary.main" : "grey.300",
//         borderWidth: checked ? 2 : 1,
//         backgroundColor: checked ? "primary.50" : "background.paper",
//         transition: "all 0.2s ease-in-out",
//         "&:hover": {
//           borderColor: "primary.light",
//           boxShadow: 1,
//         },
//       }}
//     >
//       <CardContent sx={{ "&:last-child": { pb: 2 } }}>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={checked}
//               onChange={(e) => onChange(name, e.target.checked)}
//               color="primary"
//             />
//           }
//           label={
//             <Typography variant="h6" component="span" color="text.primary">
//               {title}
//             </Typography>
//           }
//           sx={{ width: "100%", mb: 1 }}
//         />
//         <Box sx={{ display: "flex", alignItems: "flex-start", ml: 6 }}>
//           <InfoOutlined
//             sx={{
//               fontSize: 16,
//               color: "text.secondary",
//               mr: 1,
//               mt: 0.25,
//             }}
//           />
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{ lineHeight: 1.5 }}
//           >
//             {description}
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   const accountOptions = accounts.map((account) => ({
//     value: account._id,
//     label: account.accountName,
//   }));

//   const templateOptions = templates.map((template) => ({
//     value: template._id,
//     label:
//       template.general?.templateName ||
//       template.general?.proposalName ||
//       "Unnamed Template",
//   }));

//   return (
//     <Box>
//       <Typography
//         variant="h4"
//         gutterBottom
//         color="primary"
//         fontWeight="600"
//         sx={{ mb: 4 }}
//       >
//         General Information
//       </Typography>

//       {loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
//           <CircularProgress />
//           <Typography sx={{ ml: 2 }}>Loading template data...</Typography>
//         </Box>
//       )}

//       <Paper elevation={0} sx={{ p: 3, mb: 4, }}>
//         <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
//           Basic Details
//         </Typography>

//         {/* Account Selection */}
//         <FormControl fullWidth error={!!stepErrors.account} sx={{ mb: 3 }}>
//           <Autocomplete
//             multiple
//             options={accountOptions}
//             value={formData.general.account || []}

//             onChange={(event, value) => handleAccountChange(value)}
//             isOptionEqualToValue={(option, value) =>
//               option?.value === value?.value
//             }
//             getOptionLabel={(option) => option?.label || ""}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 error={!!stepErrors.account}
//                 helperText={stepErrors.account}
//                 placeholder="Search for an account..."
//               />
//             )}
//             loading={loading}
//           />
//         </FormControl>

//         {/* Template Selection */}
//         <FormControl fullWidth error={!!stepErrors.template} sx={{ mb: 3 }}>
//           <Autocomplete
//             options={templateOptions}
//             value={getCurrentTemplateValue()}
//             onChange={handleTemplateChange}
//             isOptionEqualToValue={(option, value) =>
//               option?.value === value?.value
//             }
//             getOptionLabel={(option) => option?.label || ""}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 error={!!stepErrors.proposalTemp}
//                 helperText={
//                   stepErrors.proposalTemp ||
//                   "Choose a template to pre-fill the proposal"
//                 }
//                 placeholder="Search for a template..."
//               />
//             )}
//             loading={loading}
//           />
//         </FormControl>

       

//         {/* Proposal Name with Shortcode Support */}
//         <Box sx={{ mb: 2 }}>
//           <ShortcodeTextField
//             label="Proposal name (visible to clients)"
//             value={formData.general.proposalName || ""}
//             onChange={(e) => {
//               const { value, selectionStart } = e.target;
//               handleInputChange("proposalName", value);
//               setCursorPosition(selectionStart);
//             }}
//             onClick={(e) => setCursorPosition(e.target.selectionStart)}
//             inputRef={textFieldRef}
//             required
//             error={!!stepErrors.proposalName}
//             helperText={stepErrors.proposalName}
//             placeholder="Proposal name (visible to clients)"
//             shortcuts={filteredShortcuts}
//             showShortcutDropdown={showDropdown}
//             anchorElShortcut={anchorEl}
//             onToggleShortcutDropdown={toggleDropdown}
//             onCloseShortcutDropdown={handleCloseDropdown}
//             onAddShortcut={(shortcut) => {
//               const current = formData.general.proposalName || "";
//               const newValue =
//                 current.slice(0, cursorPosition) +
//                 `[${shortcut}]` +
//                 current.slice(cursorPosition);
//               updateFormData("general", { proposalName: newValue });
//               setTimeout(() => {
//                 if (textFieldRef.current) {
//                   const newCursor = cursorPosition + shortcut.length + 2;
//                   textFieldRef.current.focus();
//                   textFieldRef.current.setSelectionRange(newCursor, newCursor);
//                   setCursorPosition(newCursor);
//                 }
//               }, 0);
//             }}
//           />
//         </Box>

//         {/* Team Members */}
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
//             Team Members *
//           </Typography>

//           <MultiSelectDropdown
//             value={getSelectedUsers()}
//             onChange={handleTeamMembersChange}
//             placeholder="Team Member"
//             options={internalOptions}
//           />
//         </Box>
//       </Paper>

//       <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider" }}>
//         <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
//           Configure Proposal Steps
//         </Typography>

//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Customize which steps to include in your proposal. Each step helps
//           communicate different aspects of your service to clients.
//         </Typography>

//         <FormGroup>
//           <StepCard
//             title="Introduction Step"
//             description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share"
//             checked={formData.general.introductionEnabled || false}
//             onChange={handleVisibilityChange}
//             name="introductionEnabled"
//           />

//           <StepCard
//             title="Terms Step"
//             description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed."
//             checked={formData.general.termsEnabled || false}
//             onChange={handleVisibilityChange}
//             name="termsEnabled"
//           />

//           <StepCard
//             title="Services & Invoices Step"
//             description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically."
//             checked={formData.general.servicesEnabled || false}
//             onChange={handleVisibilityChange}
//             name="servicesEnabled"
//           />

//           <StepCard
//             title="Payment Step"
//             description="Configure payment methods and terms for your proposal."
//             checked={formData.general.paymentsEnabled || false}
//             onChange={handleVisibilityChange}
//             name="paymentsEnabled"
//           />
//         </FormGroup>
//       </Paper>
//     </Box>
//   );
// };

// export default GeneralStep;


import React, { useState, useEffect, useRef } from "react";
import { Input } from "../../../../components/ui/input";
import { Checkbox } from "../../../../components/ui/checkbox";
import { InfoOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import MultiSelectDropdown from "../../../../components/MultiSelectDropdown";
import ShortcodeTextField from "../../../../components/ShortcodeTextField";
import SingleSelectDropdown from "../../../../components/SingleSelectDropdown"; // Import the new component
import { useAuth } from "../../../../context/AuthContext";
import {
  accountsAPI,
  proposalAPI,
  templateAPI,
  authAPI,
} from "../../../../services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { InfoIcon } from "lucide-react";
const GeneralStep = ({
  formData,
  updateFormData,
  nextStep,
  stepErrors,
  setStepErrors,
}) => {
  const { accountId } = useParams();
  const { user } = useAuth();

  console.log("GeneralStep render - formData:", formData);
  const [accounts, setAccounts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);

  // === SHORTCODES States ===
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);

  useEffect(() => {
    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      { title: "Date Shortcodes", isBold: true },
      {
        title: "Current day full date",
        isBold: false,
        value: "CURRENT_DAY_FULL_DATE",
      },
      {
        title: "Current day number",
        isBold: false,
        value: "CURRENT_DAY_NUMBER",
      },
      { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
      { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
      {
        title: "Current month number",
        isBold: false,
        value: "CURRENT_MONTH_NUMBER",
      },
      {
        title: "Current month name",
        isBold: false,
        value: "CURRENT_MONTH_NAME",
      },
      { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
      { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      {
        title: "Last day full date",
        isBold: false,
        value: "LAST_DAY_FULL_DATE",
      },
      { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
      { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
      { title: "Last week", isBold: false, value: "LAST_WEEK" },
      { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
      { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
      { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
      { title: "Last year", isBold: false, value: "LAST_YEAR" },
      {
        title: "Next day full date",
        isBold: false,
        value: "NEXT_DAY_FULL_DATE",
      },
      { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
      { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
      { title: "Next week", isBold: false, value: "NEXT_WEEK" },
      { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
      { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
      { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
      { title: "Next year", isBold: false, value: "NEXT_YEAR" },
    ];
    setShortcuts(accountShortcuts);
    setFilteredShortcuts(accountShortcuts);
  }, []);

  // Fetch accounts and templates on component mount
  useEffect(() => {
    fetchAccounts();
    fetchTemplates();
    fetchInvoiceTemplates();
    fetchTeamMembers();
  }, []);

  const fetchAccounts = async () => {
    try {
      // 🔹 1. CHECK COOKIES FIRST (no API call needed)
      const accountIdCookie = Cookies.get("accountId");
      const accountName = Cookies.get("accountName");

      if (accountIdCookie && accountName) {
        const selectedAccount = {
          label: accountName,
          value: accountIdCookie,
        };

        updateFormData("general", {
          account: selectedAccount, // Now storing a single object, not array
        });

        if (stepErrors.account) {
          setStepErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.account;
            return newErrors;
          });
        }

        console.log("Account set from cookies:", selectedAccount);
        return; // ✅ STOP HERE (no API call needed)
      }

      // 🔹 2. ROLE-BASED API CALL
      let response;

      if (user?.role === "team_member") {
        response = await accountsAPI.getAccountsByTeamMember(true);
      } else {
        response = await accountsAPI.getAccountNamesByStatus(true);
      }

      const result = response?.data || {};
      const accountList = Array.isArray(result.accountlist)
        ? result.accountlist
        : [];

      setAccounts(accountList);
      console.log("Fetched accounts:", accountList);

      // 🔹 3. AUTO-SELECT FROM PARAMS (if exists)
      const selectedAccountData = accountList.find(
        (account) => account._id === accountId
      );

      if (selectedAccountData) {
        const selectedAccount = {
          label: selectedAccountData.accountName,
          value: selectedAccountData._id,
        };

        updateFormData("general", {
          account: selectedAccount,
        });

        if (stepErrors.account) {
          setStepErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.account;
            return newErrors;
          });
        }

        console.log("Auto-selected account:", selectedAccount);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await proposalAPI.getAllProposals();
      setTemplates(response.data.proposallist || []);
      console.log("proposal template", response.data.proposallist);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceTemplates = async () => {
    try {
      const response = await templateAPI.getAllInvoiceTemplates();
      setInvoiceTemplates(response.data.invoiceTemplate || response.data || []);
    } catch (error) {
      console.error("Error fetching invoice templates:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await authAPI.getAllUsers({
        page: 1,
        limit: 50,
        status: "active",
      });

      console.log("API RESPONSE:", response.data);

      // Handle different response structures
      let users = [];
      if (response.data?.users) {
        users = response.data.users;
      } else if (Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data?.data?.users) {
        users = response.data.data.users;
      }

      if (!users.length) {
        console.warn("No users found");
      }

      const formatted = users.map((user) => ({
        value: user._id,
        label: user.username,
        email: user.email, // Keep email for display if needed
      }));

      console.log("FORMATTED USERS:", formatted);
      setInternalOptions(formatted);
    } catch (err) {
      console.error("User fetch error:", err?.response || err);
    }
  };

  // Fetch template data
  const fetchTemplateData = async (templateId) => {
    try {
      setLoading(true);
      const response = await proposalAPI.getProposalById(templateId);
      const templateData = response.data;

      console.log("Template data received:", templateData);

      // Transform the template data
      const transformedData = transformTemplateToForm(templateData);
      
      // Handle team members from template
      let templateTeamMembers = templateData.general?.teamMembers || [];
      
      // Ensure team members are stored as array of IDs (not objects)
      if (templateTeamMembers.length > 0 && typeof templateTeamMembers[0] === 'object') {
        // If they are objects, extract the IDs
        templateTeamMembers = templateTeamMembers.map(tm => tm.value || tm._id || tm);
      }

      // If template has no team members and we have a logged-in user, use that
      let teamMembersToUse = templateTeamMembers;
      if (!teamMembersToUse.length && user?.id) {
        teamMembersToUse = [user.id];
      }
      
      // Update all form sections with the transformed template data
      updateFormData("general", {
        ...formData.general,
        template: {
          value: templateId,
          label:
            templateData.general?.templateName ||
            templateData.general?.proposalName ||
            "Template",
        },
        proposalTemp: templateId,
        proposalName:
          templateData.general?.proposalName ||
          templateData.general?.templateName ||
          "",
        introductionEnabled: templateData.general?.introductionEnabled ?? true,
        termsEnabled: templateData.general?.termsEnabled ?? true,
        servicesEnabled: templateData.general?.servicesEnabled ?? true,
        paymentsEnabled: templateData.general?.paymentsEnabled ?? false,
        teamMembers: teamMembersToUse,
      });

      // Update other sections with transformed template data
      if (transformedData.introduction) {
        updateFormData("introduction", transformedData.introduction);
      }

      if (transformedData.terms) {
        updateFormData("terms", transformedData.terms);
      }

      if (transformedData.services) {
        updateFormData("services", transformedData.services);
      }

      if (transformedData.payments) {
        updateFormData("payments", transformedData.payments);
      }

      // Clear all step errors after template data is loaded
      setStepErrors({});
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform template data
  const transformTemplateToForm = (templateData) => {
    return {
      introduction: {
        title: templateData.introduction?.title || "",
        description: templateData.introduction?.description || "",
      },
      terms: {
        title: templateData.terms?.title || "",
        description: templateData.terms?.description || "",
      },
      services: {
        option: templateData.services?.option || "",
        invoices: transformInvoicesForForm(
          templateData.services?.invoices || [],
        ),
        itemizedData: transformItemizedDataForForm(
          templateData.services?.itemizedData,
        ),
      },
      payments: {
        method: templateData.payments?.method || "",
        amount: templateData.payments?.amount || 0,
      },
    };
  };

  const transformInvoicesForForm = (invoices) => {
    if (!invoices || invoices.length === 0) {
      return [{ id: 1, ...getEmptyInvoice() }];
    }

    return invoices.map((invoice, index) => {
      const template = invoiceTemplates.find(
        (t) => t._id === invoice.invoiceTemplate,
      );

      return {
        id: index + 1,
        invoiceTemplate: invoice.invoiceTemplate
          ? {
              value: invoice.invoiceTemplate,
              label: template?.templatename || "Template",
            }
          : null,
        teamMembers: invoice.teamMembers || [],
        issueInvoice: "immediately",
        specificDate: null,
        selectedTime: null,
        description: invoice.description || "",
        charCount: invoice.description?.length || 0,
        charLimit: 1000,
        rows: transformLineItemsToRows(invoice.lineItems || []),
        subtotal: invoice.subtotal?.toString() || "0.00",
        taxRate: invoice.taxRate?.toString() || "0",
        taxTotal: invoice.taxTotal?.toString() || "0.00",
        totalAmount: invoice.totalAmount?.toString() || "0.00",
        clientNote: "",
      };
    });
  };

  const transformLineItemsToRows = (lineItems) => {
    if (!lineItems || lineItems.length === 0) {
      return [getEmptyRow()];
    }

    return lineItems.map((item) => ({
      productorService: item.productorService || "",
      description: item.description || "",
      rate: item.rate?.toString() || "0.00",
      quantity: item.quantity?.toString() || "1",
      amount: item.amount?.toString() || "0.00",
      tax: item.tax || false,
      isDiscount: false,
    }));
  };

  const transformItemizedDataForForm = (itemizedData) => {
    if (!itemizedData) {
      return {
        price: 0,
        name: "",
        rows: [getEmptyRow()],
        subtotal: "0.00",
        taxRate: "0",
        taxTotal: "0.00",
        totalAmount: "0.00",
      };
    }

    return {
      ...itemizedData,
      price: itemizedData.price || 0,
      name: itemizedData.name || "",
      rows: transformLineItemsToRows(itemizedData.lineItems),
      subtotal: itemizedData.subtotal?.toString() || "0.00",
      taxRate: itemizedData.taxRate?.toString() || "0",
      taxTotal: itemizedData.taxTotal?.toString() || "0.00",
      totalAmount: itemizedData.totalAmount?.toString() || "0.00",
    };
  };

  function getEmptyRow() {
    return {
      productorService: "",
      description: "",
      rate: "0.00",
      quantity: "1",
      amount: "0.00",
      tax: false,
      isDiscount: false,
    };
  }

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMember: [],
      issueInvoice: "immediately",
      specificDate: null,
      selectedTime: null,
      description: "",
      charCount: 0,
      charLimit: 1000,
      rows: [getEmptyRow()],
      subtotal: "0.00",
      taxRate: "0",
      taxTotal: "0.00",
      totalAmount: "0.00",
      clientNote: "",
    };
  }

  // Get selected users objects from stored IDs or default to logged-in user
  const getSelectedUsers = () => {
    let selectedIds = formData.general.teamMembers || [];

    // If no team members selected and we have a logged-in user, set default
    if (!selectedIds.length && user?.id && !formData.general.proposalTemp) {
      selectedIds = [user.id];
      // Update formData with default user
      updateFormData("general", {
        teamMembers: selectedIds,
      });
    }

    // Convert IDs to objects that MultiSelectDropdown expects
    const selectedUsers = selectedIds
      .map((userId) => {
        const foundUser = internalOptions.find((opt) => opt.value === userId);
        return foundUser || { value: userId, label: `User ${userId}` };
      })
      .filter(Boolean); // Remove any undefined/null values

    console.log("Selected users:", selectedUsers);
    return selectedUsers;
  };

  const handleTeamMembersChange = (newSelectedUsers) => {
    // Extract just the IDs from the user objects
    const selectedIds = newSelectedUsers.map((user) => user.value);
    
    console.log("Team members changed:", selectedIds);
    
    updateFormData("general", {
      teamMembers: selectedIds,
    });
    
    // Clear error if exists
    if (stepErrors.teamMembers && selectedIds.length > 0) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.teamMembers;
        return newErrors;
      });
    }
  };

  const handleInputChange = (field, value) => {
    updateFormData("general", { [field]: value });

    if (value && value.toString().trim() !== "" && stepErrors[field]) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Updated to handle single account selection (not array)
  const handleAccountChange = (selectedAccount) => {
    updateFormData("general", {
      account: selectedAccount || null,
    });

    if (selectedAccount && stepErrors.account) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.account;
        return newErrors;
      });
    }
  };

  // Get current account value for the SingleSelectDropdown
 // Get current account value for the SingleSelectDropdown
const getCurrentAccountValue = () => {
  const account = formData.general.account;
  
  console.log("Getting current account value:", account);
  
  // If account is null or undefined, return null
  if (!account) return null;
  
  // If account is an object with value and label (our expected format)
  if (typeof account === 'object' && account.value && account.label) {
    return account;
  }
  
  // If account is an object with _id and accountName (from API)
  if (typeof account === 'object' && account._id && account.accountName) {
    return {
      value: account._id,
      label: account.accountName
    };
  }
  
  // If account is just an ID string, try to find the full object
  if (typeof account === 'string') {
    const foundAccount = accounts.find(acc => acc._id === account);
    if (foundAccount) {
      return {
        value: foundAccount._id,
        label: foundAccount.accountName
      };
    }
  }
  
  return null;
};

  const getCurrentTemplateValue = () => {
    if (!formData.general.template && formData.general.proposalTemp) {
      const foundTemplate = templates.find(
        (t) => t._id === formData.general.proposalTemp,
      );
      if (foundTemplate) {
        return {
          value: foundTemplate._id,
          label:
            foundTemplate.general?.templateName ||
            foundTemplate.general?.proposalName ||
            "Unnamed Template",
        };
      }
    }
    return formData.general.template || null;
  };

  const handleTemplateChange = (event, selectedTemplate) => {
    if (selectedTemplate) {
      updateFormData("general", {
        template: selectedTemplate,
        proposalTemp: selectedTemplate?.value,
      });
      fetchTemplateData(selectedTemplate.value);
    } else {
      clearTemplateData();
    }

    if (selectedTemplate && stepErrors.template) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.template;
        return newErrors;
      });
    }
  };

  const clearTemplateData = () => {
    updateFormData("general", {
      ...formData.general,
      template: null,
      proposalTemp: "",
      proposalName: "",
      teamMembers: [],
      introductionEnabled: false,
      termsEnabled: false,
      servicesEnabled: false,
    });

    updateFormData("introduction", {
      title: "",
      description: "",
    });

    updateFormData("terms", {
      title: "",
      description: "",
    });

    updateFormData("services", {
      option: "",
      invoices: [{ id: 1, ...getEmptyInvoice() }],
      itemizedData: {
        price: 0,
        name: "",
        rows: [getEmptyRow()],
        subtotal: "0.00",
        taxRate: "0",
        taxTotal: "0.00",
        totalAmount: "0.00",
      },
    });

    updateFormData("payments", {
      method: "",
      amount: 0,
    });
  };

  const handleVisibilityChange = (field, value) => {
    updateFormData("general", { [field]: value });
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  // const StepCard = ({ title, description, checked, onChange, name }) => (
  //   <Card
  //     variant="outlined"
  //     sx={{
  //       mb: 2,
  //       borderColor: checked ? "primary.main" : "grey.300",
  //       borderWidth: checked ? 2 : 1,
  //       backgroundColor: checked ? "primary.50" : "background.paper",
  //       transition: "all 0.2s ease-in-out",
  //       "&:hover": {
  //         borderColor: "primary.light",
  //         boxShadow: 1,
  //       },
  //     }}
  //   >
  //     <CardContent sx={{ "&:last-child": { pb: 2 } }}>
  //       <FormControlLabel
  //         control={
  //           <Switch
  //             checked={checked}
  //             onChange={(e) => onChange(name, e.target.checked)}
  //             color="primary"
  //           />
  //         }
  //         label={
  //           <Typography variant="h6" component="span" color="text.primary">
  //             {title}
  //           </Typography>
  //         }
  //         sx={{ width: "100%", mb: 1 }}
  //       />
  //       <Box sx={{ display: "flex", alignItems: "flex-start", ml: 6 }}>
  //         <InfoOutlined
  //           sx={{
  //             fontSize: 16,
  //             color: "text.secondary",
  //             mr: 1,
  //             mt: 0.25,
  //           }}
  //         />
  //         <Typography
  //           variant="body2"
  //           color="text.secondary"
  //           sx={{ lineHeight: 1.5 }}
  //         >
  //           {description}
  //         </Typography>
  //       </Box>
  //     </CardContent>
  //   </Card>
  // );
const StepCard = ({ title, description, checked, onChange, name }) => (
  <div
    className={`
      rounded-lg border p-4 transition-all duration-200 ease-in-out
      ${checked 
        ? 'border-primary border-2 bg-primary/5' 
        : 'border-border bg-card'
      }
      hover:border-primary/50 hover:shadow-sm
    `}
  >
    <div className="flex items-start gap-3">
      <Checkbox
        id={name}
        checked={checked}
        onCheckedChange={(checked) => onChange(name, checked)}
        className="mt-1"
      />
      <div className="flex-1 space-y-2">
        <label
          htmlFor={name}
          className="text-base font-semibold leading-6 cursor-pointer"
        >
          {title}
        </label>
        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <InfoIcon className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </div>
);
  const accountOptions = accounts.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  const templateOptions = templates.map((template) => ({
    value: template._id,
    label:
      template.general?.templateName ||
      template.general?.proposalName ||
      "Unnamed Template",
  }));
return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">
        General Information
      </h2>

      {loading && (
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading template data...</p>
        </div>
      )}

      {/* BASIC DETAILS */}
      <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
        <h3 className="font-semibold text-primary">Basic Details</h3>

        {/* Account Selection */}
        <div>
          <label className="text-sm font-medium">
            Account *
          </label>
          <SingleSelectDropdown
            value={getCurrentAccountValue()}
            onChange={handleAccountChange}
            options={accountOptions}
            placeholder="Select an account..."
          />
          {stepErrors.account && (
            <p className="text-xs text-destructive mt-1">
              {stepErrors.account}
            </p>
          )}
        </div>

        {/* Template Selection */}
        <div>
          <label className="text-sm font-medium">
            Template
          </label>
          
          <div className="w-full">
          <Select
  value={getCurrentTemplateValue()?.value || ""}
  onValueChange={(val) => {
    const selected = templateOptions.find((opt) => opt.value === val);
    handleTemplateChange(null, selected);
  }}
>
 <SelectTrigger className="w-full">
    <SelectValue placeholder="Select template..." />
  </SelectTrigger>

  <SelectContent>
    {templateOptions.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>{/* Error / helper text */}
{stepErrors.proposalTemp ? (
  <p className="text-sm text-red-500 mt-1">
    {stepErrors.proposalTemp}
  </p>
) : (
  <p className="text-sm text-muted-foreground mt-1">
    Choose a template to pre-fill the proposal
  </p>
)}</div>


        </div>

        {/* Proposal Name with Shortcode Support */}
        <div>
          <ShortcodeTextField
            label="Proposal name (visible to clients)"
            value={formData.general.proposalName || ""}
            onChange={(e) => {
              const { value, selectionStart } = e.target;
              handleInputChange("proposalName", value);
              setCursorPosition(selectionStart);
            }}
            onClick={(e) => setCursorPosition(e.target.selectionStart)}
            inputRef={textFieldRef}
            required
            error={!!stepErrors.proposalName}
            helperText={stepErrors.proposalName}
            placeholder="Proposal name (visible to clients)"
            shortcuts={filteredShortcuts}
            showShortcutDropdown={showDropdown}
            anchorElShortcut={anchorEl}
            onToggleShortcutDropdown={toggleDropdown}
            onCloseShortcutDropdown={handleCloseDropdown}
            onAddShortcut={(shortcut) => {
              const current = formData.general.proposalName || "";
              const newValue =
                current.slice(0, cursorPosition) +
                `[${shortcut}]` +
                current.slice(cursorPosition);
              updateFormData("general", { proposalName: newValue });
              setTimeout(() => {
                if (textFieldRef.current) {
                  const newCursor = cursorPosition + shortcut.length + 2;
                  textFieldRef.current.focus();
                  textFieldRef.current.setSelectionRange(newCursor, newCursor);
                  setCursorPosition(newCursor);
                }
              }, 0);
            }}
          />
        </div>

        {/* Team Members */}
        <div>
          <label className="text-sm font-medium">
            Team Members *
          </label>
          <MultiSelectDropdown
            value={getSelectedUsers()}
            onChange={handleTeamMembersChange}
            placeholder="Team Member"
            options={internalOptions}
          />
        </div>
      </div>

      {/* CONFIGURE PROPOSAL STEPS */}
      <div className="rounded-xl border p-6">
        <h3 className="font-semibold text-primary mb-2">
          Configure Proposal Steps
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          Customize which steps to include in your proposal. Each step helps
          communicate different aspects of your service to clients.
        </p>

        <div className="space-y-3">
          <StepCard
            title="Introduction Step"
            description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share"
            checked={formData.general.introductionEnabled || false}
            onChange={handleVisibilityChange}
            name="introductionEnabled"
          />

          <StepCard
            title="Terms Step"
            description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed."
            checked={formData.general.termsEnabled || false}
            onChange={handleVisibilityChange}
            name="termsEnabled"
          />

          <StepCard
            title="Services & Invoices Step"
            description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically."
            checked={formData.general.servicesEnabled || false}
            onChange={handleVisibilityChange}
            name="servicesEnabled"
          />

          <StepCard
            title="Payment Step"
            description="Configure payment methods and terms for your proposal."
            checked={formData.general.paymentsEnabled || false}
            onChange={handleVisibilityChange}
            name="paymentsEnabled"
          />
        </div>
      </div>
    </div>
);
  // return (
  //   <Box>
  //     <Typography
  //       variant="h4"
  //       gutterBottom
  //       color="primary"
  //       fontWeight="600"
  //       sx={{ mb: 4 }}
  //     >
  //       General Information
  //     </Typography>

  //     {loading && (
  //       <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
  //         <CircularProgress />
  //         <Typography sx={{ ml: 2 }}>Loading template data...</Typography>
  //       </Box>
  //     )}

  //     <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
  //       <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
  //         Basic Details
  //       </Typography>

  //       {/* Account Selection - Updated to use SingleSelectDropdown */}
  //       <Box sx={{ mb: 3 }}>
  //         <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
  //           Account *
  //         </Typography>
  //         <SingleSelectDropdown
  //           value={getCurrentAccountValue()}
  //           onChange={handleAccountChange}
  //           options={accountOptions}
  //           placeholder="Select an account..."
  //         />
  //         {stepErrors.account && (
  //           <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
  //             {stepErrors.account}
  //           </Typography>
  //         )}
  //       </Box>

  //       {/* Template Selection */}
  //       <FormControl fullWidth error={!!stepErrors.template} sx={{ mb: 3 }}>
  //         <Autocomplete
  //           options={templateOptions}
  //           value={getCurrentTemplateValue()}
  //           onChange={handleTemplateChange}
  //           isOptionEqualToValue={(option, value) =>
  //             option?.value === value?.value
  //           }
  //           getOptionLabel={(option) => option?.label || ""}
  //           renderInput={(params) => (
  //             <TextField
  //               {...params}
  //               error={!!stepErrors.proposalTemp}
  //               helperText={
  //                 stepErrors.proposalTemp ||
  //                 "Choose a template to pre-fill the proposal"
  //               }
  //               placeholder="Search for a template..."
  //             />
  //           )}
  //           loading={loading}
  //         />
  //       </FormControl>

  //       {/* Proposal Name with Shortcode Support */}
  //       <Box sx={{ mb: 2 }}>
  //         <ShortcodeTextField
  //           label="Proposal name (visible to clients)"
  //           value={formData.general.proposalName || ""}
  //           onChange={(e) => {
  //             const { value, selectionStart } = e.target;
  //             handleInputChange("proposalName", value);
  //             setCursorPosition(selectionStart);
  //           }}
  //           onClick={(e) => setCursorPosition(e.target.selectionStart)}
  //           inputRef={textFieldRef}
  //           required
  //           error={!!stepErrors.proposalName}
  //           helperText={stepErrors.proposalName}
  //           placeholder="Proposal name (visible to clients)"
  //           shortcuts={filteredShortcuts}
  //           showShortcutDropdown={showDropdown}
  //           anchorElShortcut={anchorEl}
  //           onToggleShortcutDropdown={toggleDropdown}
  //           onCloseShortcutDropdown={handleCloseDropdown}
  //           onAddShortcut={(shortcut) => {
  //             const current = formData.general.proposalName || "";
  //             const newValue =
  //               current.slice(0, cursorPosition) +
  //               `[${shortcut}]` +
  //               current.slice(cursorPosition);
  //             updateFormData("general", { proposalName: newValue });
  //             setTimeout(() => {
  //               if (textFieldRef.current) {
  //                 const newCursor = cursorPosition + shortcut.length + 2;
  //                 textFieldRef.current.focus();
  //                 textFieldRef.current.setSelectionRange(newCursor, newCursor);
  //                 setCursorPosition(newCursor);
  //               }
  //             }, 0);
  //           }}
  //         />
  //       </Box>

  //       {/* Team Members */}
  //       <Box sx={{ mt: 2 }}>
  //         <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
  //           Team Members *
  //         </Typography>

  //         <MultiSelectDropdown
  //           value={getSelectedUsers()}
  //           onChange={handleTeamMembersChange}
  //           placeholder="Team Member"
  //           options={internalOptions}
  //         />
  //       </Box>
  //     </Paper>

  //     <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider" }}>
  //       <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
  //         Configure Proposal Steps
  //       </Typography>

  //       <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
  //         Customize which steps to include in your proposal. Each step helps
  //         communicate different aspects of your service to clients.
  //       </Typography>

  //       <FormGroup>
  //         <StepCard
  //           title="Introduction Step"
  //           description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share"
  //           checked={formData.general.introductionEnabled || false}
  //           onChange={handleVisibilityChange}
  //           name="introductionEnabled"
  //         />

  //         <StepCard
  //           title="Terms Step"
  //           description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed."
  //           checked={formData.general.termsEnabled || false}
  //           onChange={handleVisibilityChange}
  //           name="termsEnabled"
  //         />

  //         <StepCard
  //           title="Services & Invoices Step"
  //           description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically."
  //           checked={formData.general.servicesEnabled || false}
  //           onChange={handleVisibilityChange}
  //           name="servicesEnabled"
  //         />

  //         <StepCard
  //           title="Payment Step"
  //           description="Configure payment methods and terms for your proposal."
  //           checked={formData.general.paymentsEnabled || false}
  //           onChange={handleVisibilityChange}
  //           name="paymentsEnabled"
  //         />
  //       </FormGroup>
  //     </Paper>
  //   </Box>
  // );
};

export default GeneralStep;