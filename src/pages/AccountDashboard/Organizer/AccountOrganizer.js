// import {
//   Box,
//   Typography,
//   Divider,
//   Dialog,
//   Tooltip,
//   FormControlLabel,
//   Switch,
//   InputLabel,
//   DialogContent,
//   Select,
//   LinearProgress,
//   Autocomplete,
//   TextField,
//   MenuItem,
//   Chip,
//   Container,
//   Button,
//   Checkbox,
//   FormControl,
// } from "@mui/material";
// import { useState, useEffect, useContext } from "react";
// import { Navigate, useParams, useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { toast } from "react-toastify";

// import { organizerAPI, accountsAPI } from "../../../services/api"; // Adjust import path as needed

// const AccountOrganizer = () => {
//   const { accountId } = useParams();

//   const [organizerTemplate, setOrganizerTemplate] = useState([]);
//   const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] =
//     useState("");
//   const [selectedAccount, setSelectedAccount] = useState([]);
//   const [showOrganizerForm, setShowOrganizerForm] = useState(false);
//   const [organizeraccountwise, setorganizeraccountwise] = useState();
//   const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOrganizerTemplateData();
//     fetchAccountsData();
//   }, []);

//   const fetchOrganizerTemplateData = async () => {
//     try {
//       const result = await organizerAPI.getOrganizerTemplates();
//       console.log("Organizer Templates:", result);
//       setOrganizerTemplate(result.data.OrganizerTemplates
//  || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to fetch organizer templates");
//     }
//   };

//   const [accountData, setAccountData] = useState([]);

//   useEffect(() => {
//     fetchAccountsData();
//   }, []);

//   const fetchAccountsData = async () => {
//     try {
//       const response = await accountsAPI.getAccountNamesByStatus(true);

//       const result = response.data;

//       const accounts =
//         result.accounts || result.accountlist || result.teamAccounts || [];

//       if (Array.isArray(accounts)) {
//         setAccountData(accounts);

//         const selectedAccounts = accounts
//           .filter((account) =>
//             Array.isArray(accountId)
//               ? accountId.includes(account._id)
//               : account._id === accountId,
//           )
//           .map((acc) => ({
//             label: acc.accountName,
//             value: acc._id,
//           }));

//         setSelectedAccount(selectedAccounts.length ? selectedAccounts : []);
//       } else {
//         console.error("Account list is not an array", result);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to fetch accounts");
//     }
//   };

//   // Dropdown Options
//   const AccountsOptions = (accountData || []).map((account) => ({
//     value: account._id,
//     label: account.accountName,
//   }));

//   const handleOrganizerTemplateChange = async (event) => {
//     const selectedValue = event.target.value;
//     setSelectedOrganizerTemplate(selectedValue);
//     await fetchOrganizerTemplateDataByTempId(selectedValue);
//   };

//   const [sections, setSections] = useState([]);
//   const [organizerName, setOrganizerName] = useState("");

//   const handleOrganizerNameChange = (e) => {
//     setOrganizerName(e.target.value);
//   };

//   const fetchOrganizerTemplateDataByTempId = async (
//     selectedOrganizerTempid,
//   ) => {
//     try {
//       const result = await organizerAPI.getOrganizerTemplateById(
//         selectedOrganizerTempid,
//       );
//       console.log("Organizer Template Details:", result);
//       // console.log(result.organizerTemplate.sections);
//       setSelectedOrganizerTempData(result.data.organizerTemplate);
//       setSections(result.data.organizerTemplate.sections);
//       setOrganizerName(result.data.organizerTemplate.organizerName);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to fetch organizer template details");
//     }
//   };

//   console.log(selectedOrganizerTempData);

//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
//   const handlePreview = () => {
//     setPreviewDialogOpen(true);
//     console.log(selectedOrganizerTempData.sections);
//     const sections = selectedOrganizerTempData.sections;
//     const data = {
//       sections,
//     };
//     console.log("Data for preview:", data);
//   };

//   const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
//     value: organizertemp._id,
//     label: organizertemp.templatename,
//   }));

//   const handleOrganizerFormClose = () => {
//     navigate(`/clients/accounts/accountsdash/organizers/${accountId}`);
//   };

//   //Preview
//   const [startDate, setStartDate] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);
//   const [answeredElements, setAnsweredElements] = useState({});
//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
//   const [inputValues, setInputValues] = useState({});

//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});

//   const [repeatedSections, setRepeatedSections] = useState({});

//   const shouldShowSection = (section) => {
//     if (!section.sectionsettings?.conditional) return true;

//     const conditions = section.sectionsettings.conditions || [];
//     const mode = section.sectionsettings.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     conditions.forEach((condition) => {
//       if (!condition.question || !condition.answer) return;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             radioValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in checkboxValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             checkboxValues[key]?.[condition.answer]
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedDropdownValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             selectedDropdownValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedYesNoValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             selectedYesNoValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//       }
//     });

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };

//   const getVisibleSections = () => sections.filter(shouldShowSection);
//   const visibleSections = getVisibleSections();

//   const handleInputChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     const { value } = event.target;
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const totalSteps = visibleSections.length;

//   const handleClosePreview = () => {
//     setPreviewDialogOpen(false);
//   };

//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     const selectedIndex = event.target.value;
//     setActiveStep(selectedIndex);
//   };

//   const shouldShowElement = (element, sectionId) => {
//     const settings = element.questionsectionsettings;
//     if (!settings?.conditional) return true;

//     const conditions = settings?.conditions || [];
//     const mode = settings?.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     for (const condition of conditions) {
//       const { question, answer } = condition;
//       if (!question || !answer) continue;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           radioValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in checkboxValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           checkboxValues[key]?.[answer]
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedDropdownValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedDropdownValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedYesNoValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedYesNoValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       if (mode === "All" && !conditionMet) {
//         return false;
//       }
//     }

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };

//   const handleRadioChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setRadioValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setCheckboxValues((prevValues) => ({
//       ...prevValues,
//       [key]: {
//         ...prevValues[key],
//         [value]: !prevValues[key]?.[value],
//       },
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedYesNoValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedDropdownValues((prevValues) => ({
//       ...prevValues,
//       [key]: event.target.value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const stripHtmlTags = (html) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;
//     return tempDiv.innerText || tempDiv.textContent || "";
//   };

//   const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
//   const [noOfReminder, setNoOfReminder] = useState(1);
//   const [reminder, setReminder] = useState(false);

//   const handleAbsolutesDates = (checked) => {
//     setReminder(checked);
//   };

//   const createOrganizerOfAccount = async () => {
//     try {
//       const requestData = {
//         accountid: accountId,
//         organizertemplateid: selectedOrganizerTemplate,
//         organizerName: organizerName,
//         reminders: reminder,
//         noofreminders: noOfReminder,
//         daysuntilnextreminder: daysuntilNextReminder,
//         // jobid: ["661e495d11a097f731ccd6e8"],
//         fileUploadPath: "",
//         sections:
//           selectedOrganizerTempData?.sections?.map((section) => ({
//             name: section?.text || "",
//             id: section?.id?.toString() || "",
//             text: section?.text || "",
//             sectionsettings: {
//               sectionRepeatingMode:
//                 section?.sectionsettings?.sectionRepeatingMode || false,
//               buttonName:
//                 section?.sectionsettings?.buttonName || "Repeat Section",
//               conditional: section?.sectionsettings?.conditional || false,
//               conditions: section?.sectionsettings?.conditions || [],
//               mode: section?.sectionsettings?.mode || "Any",
//             },
//             formElements:
//               section?.formElements?.map((question) => ({
//                 type: question?.type || "",
//                 id: question?.id || "",
//                 sectionid: question?.sectionid || "",
//                 options:
//                   question?.options?.map((option) => ({
//                     id: option?.id || "",
//                     text: option?.text || "",
//                     selected: option?.selected || false,
//                   })) || [],
//                 text: question?.text || "",
//                 textvalue: question?.textvalue || "",
//                 questionsectionsettings: {
//                   required:
//                     question?.questionsectionsettings?.required || false,
//                   prefilled:
//                     question?.questionsectionsettings?.prefilled || false,
//                   conditional:
//                     question?.questionsectionsettings?.conditional || false,
//                   conditions:
//                     question?.questionsectionsettings?.conditions || [],
//                   descriptionEnabled:
//                     question?.questionsectionsettings?.descriptionEnabled ||
//                     false,
//                   description:
//                     question?.questionsectionsettings?.description || "",
//                   mode: question?.questionsectionsettings?.mode || "Any",
//                 },
//               })) || [],
//           })) || [],
//         status: "Pending",
//         active: true,
//       };

//       console.log("Request data:", requestData);

//       const result = await organizerAPI.createOrganizerAccountWise(requestData);

//       console.log(result);
//       console.log(result.newOrganizerAccountWise);

//       setorganizeraccountwise(result.newOrganizerAccountWise);
//       setShowOrganizerForm(true);
//       setSelectedOrganizerTemplate(selectedOrganizerTemplate);
//       console.log(selectedOrganizerTemplate);
//       toast.success("New organizer created successfully");

//       navigate(`/clients/accounts/accountsdash/organizers/${accountId}`);
//     } catch (error) {
//       console.error("Error creating organizer:", error);
//       toast.error("Failed to create organizer");
//     }
//   };

//   const handleDelete = (valueToDelete) => {
//     setSelectedAccount((prevSelected) =>
//       prevSelected.filter((value) => value !== valueToDelete),
//     );
//   };

//   return (
//     <>
//       <Box mt={3} borderBottom={"2px solid #e2e8f0"} p={2}>
//         <Typography fontSize={20}>
//           <strong>Create organizer</strong>
//         </Typography>
//       </Box>

//       <Box mt={3}>
//         <Typography>Accounts</Typography>
//         <Autocomplete
//           multiple
//           size="small"
//           sx={{ marginTop: "10px" }}
//           options={AccountsOptions}
//           getOptionLabel={(option) => option.label}
//           value={selectedAccount}
//           onChange={(event, newValue) => {
//             setSelectedAccount(newValue);
//           }}
//           disabled
//           renderTags={(selected, getTagProps) =>
//             selected.map((option, index) => (
//               <Chip
//                 key={option.value}
//                 label={option.label}
//                 {...getTagProps({ index })}
//                 onDelete={() => handleDelete(option.value)}
//               />
//             ))
//           }
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               placeholder="Select Accounts"
//             />
//           )}
//           renderOption={(props, option, { selected }) => (
//             <li {...props}>
//               <Checkbox
//                 checked={selectedAccount.some(
//                   (acc) => acc.value === option.value,
//                 )}
//                 style={{ marginRight: 8 }}
//               />
//               {option.label}
//             </li>
//           )}
//         />
//       </Box>

//       <Box mt={3}>
//         <FormControl fullWidth sx={{ marginBottom: "10px" }}>
//           <Typography gutterBottom>Organizer Template</Typography>
//           <Select
//             value={selectedOrganizerTemplate}
//             size="small"
//             sx={{ mt: 2 }}
//             onChange={handleOrganizerTemplateChange}
//             renderValue={(selected) => {
//               const option = OrganizerTemplateOptions.find(
//                 (opt) => opt.value === selected,
//               );
//               return option ? option.label : "";
//             }}
//           >
//             <MenuItem value="">
//               <em>None</em>
//             </MenuItem>
//             {OrganizerTemplateOptions.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <Box mt={2}>
//         <TextField
//           variant="outlined"
//           fullWidth
//           value={organizerName || ""}
//           placeholder="Organizer Name"
//           size="small"
//           onChange={handleOrganizerNameChange}
//         />
//       </Box>

//       <Box mt={2}>
//         <Button variant="contained" onClick={handlePreview}>
//           Preview Mode
//         </Button>
//       </Box>

//       <Box mt={2} display={"flex"} alignItems={"center"}>
//         <Box>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={reminder}
//                 onChange={(event) => handleAbsolutesDates(event.target.checked)}
//                 color="primary"
//               />
//             }
//           />
//         </Box>
//         <Typography variant="h6">Reminders</Typography>
//       </Box>

//       <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
//         {reminder && (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
//             <Box>
//               <InputLabel sx={{ color: "black" }}>
//                 Days until next reminder
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 name="Daysuntilnextreminder"
//                 value={daysuntilNextReminder}
//                 onChange={(e) => setDaysuntilNextReminder(e.target.value)}
//                 placeholder="Days until next reminder"
//                 size="small"
//                 sx={{ mt: 2 }}
//               />
//             </Box>

//             <Box>
//               <InputLabel sx={{ color: "black" }}>No Of reminders</InputLabel>
//               <TextField
//                 fullWidth
//                 name="No Of reminders"
//                 value={noOfReminder}
//                 onChange={(e) => setNoOfReminder(e.target.value)}
//                 placeholder="NoOfreminders"
//                 size="small"
//                 sx={{ mt: 2 }}
//               />
//             </Box>
//           </Box>
//         )}
//       </Box>

//       <Box display={"flex"} gap={2} alignItems={"center"} mt={2}>
//         <Box>
//           <Button onClick={createOrganizerOfAccount} variant="contained">
//             Create
//           </Button>
//         </Box>

//         <Box>
//           <Button onClick={handleOrganizerFormClose} variant="outlined">
//             Cancel
//           </Button>
//         </Box>
//       </Box>

//       <Dialog open={previewDialogOpen} onClose={handleClosePreview} fullScreen>
//         <DialogContent>
//           <Box>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     border: "2px solid #3FA2F6",
//                     p: 2,
//                     mb: 3,
//                     borderRadius: "10px",
//                     backgroundColor: "#96C9F4",
//                   }}
//                 >
//                   <Box>
//                     <Typography fontWeight="bold">Preview mode</Typography>
//                     <Typography>
//                       The client sees your organizer like this
//                     </Typography>
//                   </Box>
//                   <Button variant="text" onClick={handleClosePreview}>
//                     Back to edit
//                   </Button>
//                 </Box>
//                 <Typography variant="text" gutterBottom>
//                   {organizerName}
//                 </Typography>

//                 <FormControl
//                   fullWidth
//                   sx={{ marginBottom: "10px", marginTop: "10px" }}
//                 >
//                   <Select
//                     value={activeStep}
//                     onChange={handleDropdownChange}
//                     size="small"
//                   >
//                     {visibleSections.map((section, index) => {
//                       const visibleElements = section.formElements.filter(
//                         (el) => shouldShowElement(el, section.id),
//                       );

//                       const answeredCount = visibleElements.reduce(
//                         (count, element) => {
//                           const key = `${section.id}_${element.text}`;
//                           return count + (answeredElements[key] ? 1 : 0);
//                         },
//                         0,
//                       );

//                       const totalVisibleElements = visibleElements.length;

//                       return (
//                         <MenuItem key={section.id} value={index}>
//                           {section.text} ({answeredCount}/{totalVisibleElements}
//                           )
//                         </MenuItem>
//                       );
//                     })}
//                   </Select>
//                 </FormControl>

//                 <Box mt={2} mb={2}>
//                   <LinearProgress
//                     variant="determinate"
//                     value={((activeStep + 1) / totalSteps) * 100}
//                   />
//                 </Box>

//                 <Box sx={{ pl: 20, pr: 20 }}>
//                   {visibleSections.map(
//                     (section, sectionIndex) =>
//                       sectionIndex === activeStep && (
//                         <Box key={section.id}>
//                           {section.formElements.map(
//                             (element) =>
//                               shouldShowElement(element, section.id) && (
//                                 <Box key={`${section.id}_${element.id}`}>
//                                   {/* Text Editor */}
//                                   {element.type === "Text Editor" && (
//                                     <Box mt={2} mb={2}>
//                                       <Typography>
//                                         {stripHtmlTags(element.text)}
//                                       </Typography>
//                                     </Box>
//                                   )}

//                                   {/* Free Entry or Email */}
//                                   {(element.type === "Free Entry" ||
//                                     element.type === "Email") && (
//                                     <Box>
//                                       <Typography fontSize="18px" mb={1} mt={1}>
//                                         {element.text}
//                                       </Typography>
//                                       <TextField
//                                         variant="outlined"
//                                         size="small"
//                                         multiline
//                                         fullWidth
//                                         placeholder={`${element.type} Answer`}
//                                         inputProps={{
//                                           type:
//                                             element.type === "Free Entry"
//                                               ? "text"
//                                               : element.type.toLowerCase(),
//                                         }}
//                                         maxRows={8}
//                                         style={{ display: "block" }}
//                                         value={
//                                           inputValues[
//                                             `${section.id}_${element.text}`
//                                           ] || ""
//                                         }
//                                         onChange={(e) =>
//                                           handleInputChange(
//                                             e,
//                                             element.text,
//                                             section.id,
//                                           )
//                                         }
//                                       />
//                                     </Box>
//                                   )}

//                                   {/* Number */}
//                                   {element.type === "Number" && (
//                                     <Box>
//                                       <Typography fontSize="18px" mb={1} mt={1}>
//                                         {element.text}
//                                       </Typography>
//                                       <TextField
//                                         variant="outlined"
//                                         size="small"
//                                         multiline
//                                         fullWidth
//                                         placeholder={`${element.type} Answer`}
//                                         inputProps={{
//                                           type: "text",
//                                           inputMode: "numeric",
//                                           pattern: "[0-9]*",
//                                         }}
//                                         maxRows={8}
//                                         style={{
//                                           display: "block",
//                                           marginTop: "15px",
//                                         }}
//                                         value={
//                                           inputValues[
//                                             `${section.id}_${element.text}`
//                                           ] || ""
//                                         }
//                                         onChange={(e) => {
//                                           const numericValue =
//                                             e.target.value.replace(/\D/g, "");
//                                           handleInputChange(
//                                             { target: { value: numericValue } },
//                                             element.text,
//                                             section.id,
//                                           );
//                                         }}
//                                       />
//                                     </Box>
//                                   )}

//                                  {/* Radio Buttons */}
// {element.type === "Radio Buttons" && (
//   <Box>
//     <Typography fontSize="18px" mb={1} mt={1}>
//       {element.text}
//     </Typography>
//     <Box
//       sx={{
//         display: "flex",
//         gap: 1,
//         flexWrap: "wrap",
//       }}
//     >
//       {element.options.map((option) => (
//         <Button
//           key={option.text}
//           variant={
//             radioValues[`${section.id}_${element.text}`] === option.text
//               ? "contained"
//               : "outlined"
//           }
//           onClick={() =>
//             handleRadioChange(option.text, element.text, section.id)
//           }
//           sx={{
//             borderRadius: "15px",
//           }}
//         >
//           {option.text}
//         </Button>
//       ))}
//     </Box>
//   </Box>
// )}

// {/* Checkboxes */}
// {element.type === "Checkboxes" && (
//   <Box>
//     <Typography fontSize="18px">{element.text}</Typography>
//     <Box
//       sx={{
//         display: "flex",
//         gap: 1,
//         flexWrap: "wrap",
//       }}
//     >
//       {element.options.map((option) => (
//         <Button
//           key={option.text}
//           variant={
//             checkboxValues[`${section.id}_${element.text}`]?.[option.text]
//               ? "contained"
//               : "outlined"
//           }
//           onClick={() =>
//             handleCheckboxChange(option.text, element.text, section.id)
//           }
//           sx={{
//             borderRadius: "15px",
//           }}
//         >
//           {option.text}
//         </Button>
//       ))}
//     </Box>
//   </Box>
// )}

// {/* Yes/No */}
// {element.type === "Yes/No" && (
//   <Box>
//     <Typography fontSize="18px">{element.text}</Typography>
//     <Box sx={{ display: "flex", gap: 1 }}>
//       {element.options.map((option) => (
//         <Button
//           key={option.text}
//           variant={
//             selectedYesNoValues[`${section.id}_${element.text}`] === option.text
//               ? "contained"
//               : "outlined"
//           }
//           onClick={() =>
//             handleYesNoChange(option.text, element.text, section.id)
//           }
//           sx={{
//             borderRadius: "15px",
//           }}
//         >
//           {option.text}
//         </Button>
//       ))}
//     </Box>
//   </Box>
// )}

//                                   {/* Dropdown */}
//                                   {element.type === "Dropdown" && (
//                                     <Box>
//                                       <Typography fontSize="18px">
//                                         {element.text}
//                                       </Typography>
//                                       <FormControl fullWidth>
//                                         <Select
//                                           value={
//                                             selectedDropdownValues[
//                                               `${section.id}_${element.text}`
//                                             ] || ""
//                                           }
//                                           onChange={(event) =>
//                                             handleDropdownValueChange(
//                                               event,
//                                               element.text,
//                                               section.id,
//                                             )
//                                           }
//                                           size="small"
//                                         >
//                                           {element.options.map((option) => (
//                                             <MenuItem
//                                               key={option.text}
//                                               value={option.text}
//                                             >
//                                               {option.text}
//                                             </MenuItem>
//                                           ))}
//                                         </Select>
//                                       </FormControl>
//                                     </Box>
//                                   )}

//                                   {/* Date */}
//                                   {element.type === "Date" && (
//                                     <Box>
//                                       <Typography fontSize="18px">
//                                         {element.text}
//                                       </Typography>
//                                       <DatePicker
//                                         format="MM/DD/YYYY"
//                                         sx={{
//                                           width: "100%",
//                                           backgroundColor: "#fff",
//                                         }}
//                                         value={startDate}
//                                         onChange={handleStartDateChange}
//                                         slotProps={{
//                                           textField: {
//                                             size: "small",
//                                             fullWidth: true,
//                                           },
//                                         }}
//                                         onOpen={() =>
//                                           setAnsweredElements(
//                                             (prevAnswered) => ({
//                                               ...prevAnswered,
//                                               [`${section.id}_${element.text}`]: true,
//                                             }),
//                                           )
//                                         }
//                                       />
//                                     </Box>
//                                   )}

//                                   {/* File Upload */}
//                                   {element.type === "File Upload" && (
//                                     <Box>
//                                       <Typography fontSize="18px" mb={1} mt={2}>
//                                         {element.text}
//                                       </Typography>
//                                       <Tooltip
//                                         title="Unavailable in preview mode"
//                                         placement="top"
//                                       >
//                                         <Box
//                                           sx={{
//                                             position: "relative",
//                                             width: "100%",
//                                           }}
//                                         >
//                                           <TextField
//                                             variant="outlined"
//                                             size="small"
//                                             fullWidth
//                                             disabled
//                                             placeholder="Add Document"
//                                             sx={{
//                                               cursor: "not-allowed",
//                                               "& .MuiInputBase-input": {
//                                                 pointerEvents: "none",
//                                                 cursor: "not-allowed",
//                                               },
//                                             }}
//                                           />
//                                         </Box>
//                                       </Tooltip>
//                                     </Box>
//                                   )}
//                                 </Box>
//                               ),
//                           )}
//                         </Box>
//                       ),
//                   )}
//                   <Box mt={3} display="flex" gap={3} alignItems="center">
//                     <Button
//                       disabled={activeStep === 0}
//                       onClick={handleBack}
//                       variant="contained"
                     
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       onClick={handleNext}
//                       disabled={activeStep === totalSteps - 1}
//                       variant="contained"
                     
//                     >
//                       Next
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>
//             </LocalizationProvider>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default AccountOrganizer;


// import {
//   Box,
//   Typography,
//   Divider,
//   Dialog,
//   Tooltip,
//   FormControlLabel,
//   Switch,
//   InputLabel,
//   DialogContent,
//   Select,
//   LinearProgress,
//   Autocomplete,
//   TextField,
//   MenuItem,
//   Chip,
//   Container,
//   Button,
//   Checkbox,
//   FormControl,
// } from "@mui/material";
// import { useState, useEffect, useContext } from "react";
// import { Navigate, useParams, useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { toast } from "react-toastify";

// import { organizerAPI, accountsAPI } from "../../../services/api"; // Adjust import path as needed
// import AccountMultiSelectDropdown from "../../../components/AccountMultiSelectDropdown"; // Adjust import path

// const AccountOrganizer = () => {
//   const { accountId } = useParams();

//   const [organizerTemplate, setOrganizerTemplate] = useState([]);
//   const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] =
//     useState("");
//   const [selectedAccount, setSelectedAccount] = useState([]);
//   const [showOrganizerForm, setShowOrganizerForm] = useState(false);
//   const [organizeraccountwise, setorganizeraccountwise] = useState();
//   const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOrganizerTemplateData();
//     fetchAccountsData();
//   }, []);

//   const fetchOrganizerTemplateData = async () => {
//     try {
//       const result = await organizerAPI.getOrganizerTemplates();
//       console.log("Organizer Templates:", result);
//       setOrganizerTemplate(result.data.OrganizerTemplates || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to fetch organizer templates");
//     }
//   };

//   const [accountData, setAccountData] = useState([]);

//   useEffect(() => {
//     fetchAccountsData();
//   }, []);

//   const fetchAccountsData = async () => {
//     try {
//       const response = await accountsAPI.getAccountNamesByStatus({ active: true });
//       const result = response.data;
//       const accounts = result.accounts || result.accountlist || result.teamAccounts || [];

//       if (Array.isArray(accounts)) {
//         setAccountData(accounts);
        
//         // If accountId is provided in URL, pre-select it
//         if (accountId) {
//           const preselectedAccount = accounts
//             .filter(account => account._id === accountId)
//             .map(acc => ({
//               label: acc.accountName,
//               value: acc._id,
//             }));
          
//           if (preselectedAccount.length) {
//             setSelectedAccount(preselectedAccount);
//           }
//         }
//       } else {
//         console.error("Account list is not an array", result);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to fetch accounts");
//     }
//   };

//   // Format accounts for MultiSelectDropdown if needed as prop
//   const AccountsOptions = (accountData || []).map((account) => ({
//     value: account._id,
//     label: account.accountName,
//   }));

//   const handleOrganizerTemplateChange = async (event) => {
//     const selectedValue = event.target.value;
//     setSelectedOrganizerTemplate(selectedValue);
//     await fetchOrganizerTemplateDataByTempId(selectedValue);
//   };

//   const [sections, setSections] = useState([]);
//   const [organizerName, setOrganizerName] = useState("");

//   const handleOrganizerNameChange = (e) => {
//     setOrganizerName(e.target.value);
//   };

//   const fetchOrganizerTemplateDataByTempId = async (selectedOrganizerTempid) => {
//     try {
//       const result = await organizerAPI.getOrganizerTemplateById(selectedOrganizerTempid);
//       console.log("Organizer Template Details:", result);
//       setSelectedOrganizerTempData(result.data.organizerTemplate);
//       setSections(result.data.organizerTemplate.sections);
//       setOrganizerName(result.data.organizerTemplate.organizerName);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to fetch organizer template details");
//     }
//   };

//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
//   const handlePreview = () => {
//     setPreviewDialogOpen(true);
//     console.log(selectedOrganizerTempData.sections);
//     const sections = selectedOrganizerTempData.sections;
//     const data = {
//       sections,
//     };
//     console.log("Data for preview:", data);
//   };

//   const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
//     value: organizertemp._id,
//     label: organizertemp.templatename,
//   }));

//   const handleOrganizerFormClose = () => {
//     navigate(`/clients/accounts/accountsdash/organizers/${accountId}`);
//   };

//   // Preview states
//   const [startDate, setStartDate] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);
//   const [answeredElements, setAnsweredElements] = useState({});
//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
//   const [inputValues, setInputValues] = useState({});
//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
//   const [repeatedSections, setRepeatedSections] = useState({});

//   const shouldShowSection = (section) => {
//     if (!section.sectionsettings?.conditional) return true;

//     const conditions = section.sectionsettings.conditions || [];
//     const mode = section.sectionsettings.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     conditions.forEach((condition) => {
//       if (!condition.question || !condition.answer) return;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (key.endsWith(`_${condition.question}`) && radioValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in checkboxValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (key.endsWith(`_${condition.question}`) && checkboxValues[key]?.[condition.answer]) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedDropdownValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (key.endsWith(`_${condition.question}`) && selectedDropdownValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedYesNoValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (key.endsWith(`_${condition.question}`) && selectedYesNoValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//       }
//     });

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };

//   const getVisibleSections = () => sections.filter(shouldShowSection);
//   const visibleSections = getVisibleSections();

//   const handleInputChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     const { value } = event.target;
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const totalSteps = visibleSections.length;

//   const handleClosePreview = () => {
//     setPreviewDialogOpen(false);
//   };

//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     const selectedIndex = event.target.value;
//     setActiveStep(selectedIndex);
//   };

//   const shouldShowElement = (element, sectionId) => {
//     const settings = element.questionsectionsettings;
//     if (!settings?.conditional) return true;

//     const conditions = settings?.conditions || [];
//     const mode = settings?.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     for (const condition of conditions) {
//       const { question, answer } = condition;
//       if (!question || !answer) continue;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           radioValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in checkboxValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           checkboxValues[key]?.[answer]
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedDropdownValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedDropdownValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedYesNoValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedYesNoValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       if (mode === "All" && !conditionMet) {
//         return false;
//       }
//     }

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };

//   const handleRadioChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setRadioValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setCheckboxValues((prevValues) => ({
//       ...prevValues,
//       [key]: {
//         ...prevValues[key],
//         [value]: !prevValues[key]?.[value],
//       },
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedYesNoValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedDropdownValues((prevValues) => ({
//       ...prevValues,
//       [key]: event.target.value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const stripHtmlTags = (html) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;
//     return tempDiv.innerText || tempDiv.textContent || "";
//   };

//   const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
//   const [noOfReminder, setNoOfReminder] = useState(1);
//   const [reminder, setReminder] = useState(false);

//   const handleAbsolutesDates = (checked) => {
//     setReminder(checked);
//   };

//   const createOrganizerOfAccount = async () => {
//     try {
//       const requestData = {
//         accountid: accountId,
//         organizertemplateid: selectedOrganizerTemplate,
//         organizerName: organizerName,
//         reminders: reminder,
//         noofreminders: noOfReminder,
//         daysuntilnextreminder: daysuntilNextReminder,
//         fileUploadPath: "",
//         sections: selectedOrganizerTempData?.sections?.map((section) => ({
//           name: section?.text || "",
//           id: section?.id?.toString() || "",
//           text: section?.text || "",
//           sectionsettings: {
//             sectionRepeatingMode: section?.sectionsettings?.sectionRepeatingMode || false,
//             buttonName: section?.sectionsettings?.buttonName || "Repeat Section",
//             conditional: section?.sectionsettings?.conditional || false,
//             conditions: section?.sectionsettings?.conditions || [],
//             mode: section?.sectionsettings?.mode || "Any",
//           },
//           formElements: section?.formElements?.map((question) => ({
//             type: question?.type || "",
//             id: question?.id || "",
//             sectionid: question?.sectionid || "",
//             options: question?.options?.map((option) => ({
//               id: option?.id || "",
//               text: option?.text || "",
//               selected: option?.selected || false,
//             })) || [],
//             text: question?.text || "",
//             textvalue: question?.textvalue || "",
//             questionsectionsettings: {
//               required: question?.questionsectionsettings?.required || false,
//               prefilled: question?.questionsectionsettings?.prefilled || false,
//               conditional: question?.questionsectionsettings?.conditional || false,
//               conditions: question?.questionsectionsettings?.conditions || [],
//               descriptionEnabled: question?.questionsectionsettings?.descriptionEnabled || false,
//               description: question?.questionsectionsettings?.description || "",
//               mode: question?.questionsectionsettings?.mode || "Any",
//             },
//           })) || [],
//         })) || [],
//         status: "Pending",
//         active: true,
//       };

//       console.log("Request data:", requestData);

//       const result = await organizerAPI.createOrganizerAccountWise(requestData);

//       console.log(result);
//       console.log(result.newOrganizerAccountWise);

//       setorganizeraccountwise(result.newOrganizerAccountWise);
//       setShowOrganizerForm(true);
//       setSelectedOrganizerTemplate(selectedOrganizerTemplate);
//       console.log(selectedOrganizerTemplate);
//       toast.success("New organizer created successfully");

//       navigate(`/clients/accounts/accountsdash/organizers/${accountId}`);
//     } catch (error) {
//       console.error("Error creating organizer:", error);
//       toast.error("Failed to create organizer");
//     }
//   };

//   // Handler for MultiSelectDropdown
//   const handleAccountSelectionChange = (selectedAccounts) => {
//     setSelectedAccount(selectedAccounts);
//     // If you need to handle single account selection for the URL param
//     if (selectedAccounts.length > 0 && accountId !== selectedAccounts[0].value) {
//       // Navigate or update as needed
//       navigate(`/clients/accounts/accountsdash/organizers/${selectedAccounts[0].value}`);
//     }
//   };

//   return (
//     <>
//       <Box mt={3} borderBottom={"2px solid #e2e8f0"} p={2}>
//         <Typography fontSize={20}>
//           <strong>Create organizer</strong>
//         </Typography>
//       </Box>

//       <Box mt={3}>
//         <Typography gutterBottom>Accounts</Typography>
//         {/* Replace the Autocomplete with MultiSelectDropdown */}
//         <AccountMultiSelectDropdown
//         value={selectedAccount}
//               onChange={selectedAccount}
//         />
//       </Box>

//       <Box mt={3}>
//         <FormControl fullWidth sx={{ marginBottom: "10px" }}>
//           <Typography gutterBottom>Organizer Template</Typography>
//           <Select
//             value={selectedOrganizerTemplate}
//             size="small"
//             sx={{ mt: 2 }}
//             onChange={handleOrganizerTemplateChange}
//             renderValue={(selected) => {
//               const option = OrganizerTemplateOptions.find(
//                 (opt) => opt.value === selected,
//               );
//               return option ? option.label : "";
//             }}
//           >
//             <MenuItem value="">
//               <em>None</em>
//             </MenuItem>
//             {OrganizerTemplateOptions.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <Box mt={2}>
//         <TextField
//           variant="outlined"
//           fullWidth
//           value={organizerName || ""}
//           placeholder="Organizer Name"
//           size="small"
//           onChange={handleOrganizerNameChange}
//         />
//       </Box>

//       <Box mt={2}>
//         <Button variant="contained" onClick={handlePreview}>
//           Preview Mode
//         </Button>
//       </Box>

//       <Box mt={2} display={"flex"} alignItems={"center"}>
//         <Box>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={reminder}
//                 onChange={(event) => handleAbsolutesDates(event.target.checked)}
//                 color="primary"
//               />
//             }
//           />
//         </Box>
//         <Typography variant="h6">Reminders</Typography>
//       </Box>

//       <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
//         {reminder && (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
//             <Box>
//               <InputLabel sx={{ color: "black" }}>
//                 Days until next reminder
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 name="Daysuntilnextreminder"
//                 value={daysuntilNextReminder}
//                 onChange={(e) => setDaysuntilNextReminder(e.target.value)}
//                 placeholder="Days until next reminder"
//                 size="small"
//                 sx={{ mt: 2 }}
//               />
//             </Box>

//             <Box>
//               <InputLabel sx={{ color: "black" }}>No Of reminders</InputLabel>
//               <TextField
//                 fullWidth
//                 name="No Of reminders"
//                 value={noOfReminder}
//                 onChange={(e) => setNoOfReminder(e.target.value)}
//                 placeholder="NoOfreminders"
//                 size="small"
//                 sx={{ mt: 2 }}
//               />
//             </Box>
//           </Box>
//         )}
//       </Box>

//       <Box display={"flex"} gap={2} alignItems={"center"} mt={2}>
//         <Box>
//           <Button onClick={createOrganizerOfAccount} variant="contained">
//             Create
//           </Button>
//         </Box>

//         <Box>
//           <Button onClick={handleOrganizerFormClose} variant="outlined">
//             Cancel
//           </Button>
//         </Box>
//       </Box>

//       {/* Preview Dialog remains the same */}
//       <Dialog open={previewDialogOpen} onClose={handleClosePreview} fullScreen>
//         <DialogContent>
//           <Box>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     border: "2px solid #3FA2F6",
//                     p: 2,
//                     mb: 3,
//                     borderRadius: "10px",
//                     backgroundColor: "#96C9F4",
//                   }}
//                 >
//                   <Box>
//                     <Typography fontWeight="bold">Preview mode</Typography>
//                     <Typography>
//                       The client sees your organizer like this
//                     </Typography>
//                   </Box>
//                   <Button variant="text" onClick={handleClosePreview}>
//                     Back to edit
//                   </Button>
//                 </Box>
//                 <Typography variant="text" gutterBottom>
//                   {organizerName}
//                 </Typography>

//                 <FormControl
//                   fullWidth
//                   sx={{ marginBottom: "10px", marginTop: "10px" }}
//                 >
//                   <Select
//                     value={activeStep}
//                     onChange={handleDropdownChange}
//                     size="small"
//                   >
//                     {visibleSections.map((section, index) => {
//                       const visibleElements = section.formElements.filter(
//                         (el) => shouldShowElement(el, section.id),
//                       );

//                       const answeredCount = visibleElements.reduce(
//                         (count, element) => {
//                           const key = `${section.id}_${element.text}`;
//                           return count + (answeredElements[key] ? 1 : 0);
//                         },
//                         0,
//                       );

//                       const totalVisibleElements = visibleElements.length;

//                       return (
//                         <MenuItem key={section.id} value={index}>
//                           {section.text} ({answeredCount}/{totalVisibleElements})
//                         </MenuItem>
//                       );
//                     })}
//                   </Select>
//                 </FormControl>

//                 <Box mt={2} mb={2}>
//                   <LinearProgress
//                     variant="determinate"
//                     value={((activeStep + 1) / totalSteps) * 100}
//                   />
//                 </Box>

//                 <Box sx={{ pl: 20, pr: 20 }}>
//                   {visibleSections.map(
//                     (section, sectionIndex) =>
//                       sectionIndex === activeStep && (
//                         <Box key={section.id}>
//                           {section.formElements.map(
//                             (element) =>
//                               shouldShowElement(element, section.id) && (
//                                 <Box key={`${section.id}_${element.id}`}>
//                                   {/* Text Editor */}
//                                   {element.type === "Text Editor" && (
//                                     <Box mt={2} mb={2}>
//                                       <Typography>
//                                         {stripHtmlTags(element.text)}
//                                       </Typography>
//                                     </Box>
//                                   )}

//                                   {/* Free Entry or Email */}
//                                   {(element.type === "Free Entry" ||
//                                     element.type === "Email") && (
//                                     <Box>
//                                       <Typography fontSize="18px" mb={1} mt={1}>
//                                         {element.text}
//                                       </Typography>
//                                       <TextField
//                                         variant="outlined"
//                                         size="small"
//                                         multiline
//                                         fullWidth
//                                         placeholder={`${element.type} Answer`}
//                                         inputProps={{
//                                           type:
//                                             element.type === "Free Entry"
//                                               ? "text"
//                                               : element.type.toLowerCase(),
//                                         }}
//                                         maxRows={8}
//                                         style={{ display: "block" }}
//                                         value={
//                                           inputValues[
//                                             `${section.id}_${element.text}`
//                                           ] || ""
//                                         }
//                                         onChange={(e) =>
//                                           handleInputChange(
//                                             e,
//                                             element.text,
//                                             section.id,
//                                           )
//                                         }
//                                       />
//                                     </Box>
//                                   )}

//                                   {/* Number */}
//                                   {element.type === "Number" && (
//                                     <Box>
//                                       <Typography fontSize="18px" mb={1} mt={1}>
//                                         {element.text}
//                                       </Typography>
//                                       <TextField
//                                         variant="outlined"
//                                         size="small"
//                                         multiline
//                                         fullWidth
//                                         placeholder={`${element.type} Answer`}
//                                         inputProps={{
//                                           type: "text",
//                                           inputMode: "numeric",
//                                           pattern: "[0-9]*",
//                                         }}
//                                         maxRows={8}
//                                         style={{
//                                           display: "block",
//                                           marginTop: "15px",
//                                         }}
//                                         value={
//                                           inputValues[
//                                             `${section.id}_${element.text}`
//                                           ] || ""
//                                         }
//                                         onChange={(e) => {
//                                           const numericValue =
//                                             e.target.value.replace(/\D/g, "");
//                                           handleInputChange(
//                                             { target: { value: numericValue } },
//                                             element.text,
//                                             section.id,
//                                           );
//                                         }}
//                                       />
//                                     </Box>
//                                   )}

//                                   {/* Radio Buttons */}
//                                   {element.type === "Radio Buttons" && (
//                                     <Box>
//                                       <Typography fontSize="18px" mb={1} mt={1}>
//                                         {element.text}
//                                       </Typography>
//                                       <Box
//                                         sx={{
//                                           display: "flex",
//                                           gap: 1,
//                                           flexWrap: "wrap",
//                                         }}
//                                       >
//                                         {element.options.map((option) => (
//                                           <Button
//                                             key={option.text}
//                                             variant={
//                                               radioValues[`${section.id}_${element.text}`] === option.text
//                                                 ? "contained"
//                                                 : "outlined"
//                                             }
//                                             onClick={() =>
//                                               handleRadioChange(option.text, element.text, section.id)
//                                             }
//                                             sx={{
//                                               borderRadius: "15px",
//                                             }}
//                                           >
//                                             {option.text}
//                                           </Button>
//                                         ))}
//                                       </Box>
//                                     </Box>
//                                   )}

//                                   {/* Checkboxes */}
//                                   {element.type === "Checkboxes" && (
//                                     <Box>
//                                       <Typography fontSize="18px">{element.text}</Typography>
//                                       <Box
//                                         sx={{
//                                           display: "flex",
//                                           gap: 1,
//                                           flexWrap: "wrap",
//                                         }}
//                                       >
//                                         {element.options.map((option) => (
//                                           <Button
//                                             key={option.text}
//                                             variant={
//                                               checkboxValues[`${section.id}_${element.text}`]?.[option.text]
//                                                 ? "contained"
//                                                 : "outlined"
//                                             }
//                                             onClick={() =>
//                                               handleCheckboxChange(option.text, element.text, section.id)
//                                             }
//                                             sx={{
//                                               borderRadius: "15px",
//                                             }}
//                                           >
//                                             {option.text}
//                                           </Button>
//                                         ))}
//                                       </Box>
//                                     </Box>
//                                   )}

//                                   {/* Yes/No */}
//                                   {element.type === "Yes/No" && (
//                                     <Box>
//                                       <Typography fontSize="18px">{element.text}</Typography>
//                                       <Box sx={{ display: "flex", gap: 1 }}>
//                                         {element.options.map((option) => (
//                                           <Button
//                                             key={option.text}
//                                             variant={
//                                               selectedYesNoValues[`${section.id}_${element.text}`] === option.text
//                                                 ? "contained"
//                                                 : "outlined"
//                                             }
//                                             onClick={() =>
//                                               handleYesNoChange(option.text, element.text, section.id)
//                                             }
//                                             sx={{
//                                               borderRadius: "15px",
//                                             }}
//                                           >
//                                             {option.text}
//                                           </Button>
//                                         ))}
//                                       </Box>
//                                     </Box>
//                                   )}

//                                   {/* Dropdown */}
//                                   {element.type === "Dropdown" && (
//                                     <Box>
//                                       <Typography fontSize="18px">
//                                         {element.text}
//                                       </Typography>
//                                       <FormControl fullWidth>
//                                         <Select
//                                           value={
//                                             selectedDropdownValues[
//                                               `${section.id}_${element.text}`
//                                             ] || ""
//                                           }
//                                           onChange={(event) =>
//                                             handleDropdownValueChange(
//                                               event,
//                                               element.text,
//                                               section.id,
//                                             )
//                                           }
//                                           size="small"
//                                         >
//                                           {element.options.map((option) => (
//                                             <MenuItem
//                                               key={option.text}
//                                               value={option.text}
//                                             >
//                                               {option.text}
//                                             </MenuItem>
//                                           ))}
//                                         </Select>
//                                       </FormControl>
//                                     </Box>
//                                   )}

//                                   {/* Date */}
//                                   {element.type === "Date" && (
//                                     <Box>
//                                       <Typography fontSize="18px">
//                                         {element.text}
//                                       </Typography>
//                                       <DatePicker
//                                         format="MM/DD/YYYY"
//                                         sx={{
//                                           width: "100%",
//                                           backgroundColor: "#fff",
//                                         }}
//                                         value={startDate}
//                                         onChange={handleStartDateChange}
//                                         slotProps={{
//                                           textField: {
//                                             size: "small",
//                                             fullWidth: true,
//                                           },
//                                         }}
//                                         onOpen={() =>
//                                           setAnsweredElements(
//                                             (prevAnswered) => ({
//                                               ...prevAnswered,
//                                               [`${section.id}_${element.text}`]: true,
//                                             }),
//                                           )
//                                         }
//                                       />
//                                     </Box>
//                                   )}

//                                   {/* File Upload */}
//                                   {element.type === "File Upload" && (
//                                     <Box>
//                                       <Typography fontSize="18px" mb={1} mt={2}>
//                                         {element.text}
//                                       </Typography>
//                                       <Tooltip
//                                         title="Unavailable in preview mode"
//                                         placement="top"
//                                       >
//                                         <Box
//                                           sx={{
//                                             position: "relative",
//                                             width: "100%",
//                                           }}
//                                         >
//                                           <TextField
//                                             variant="outlined"
//                                             size="small"
//                                             fullWidth
//                                             disabled
//                                             placeholder="Add Document"
//                                             sx={{
//                                               cursor: "not-allowed",
//                                               "& .MuiInputBase-input": {
//                                                 pointerEvents: "none",
//                                                 cursor: "not-allowed",
//                                               },
//                                             }}
//                                           />
//                                         </Box>
//                                       </Tooltip>
//                                     </Box>
//                                   )}
//                                 </Box>
//                               ),
//                           )}
//                         </Box>
//                       ),
//                   )}
//                   <Box mt={3} display="flex" gap={3} alignItems="center">
//                     <Button
//                       disabled={activeStep === 0}
//                       onClick={handleBack}
//                       variant="contained"
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       onClick={handleNext}
//                       disabled={activeStep === totalSteps - 1}
//                       variant="contained"
//                     >
//                       Next
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>
//             </LocalizationProvider>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default AccountOrganizer;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { organizerAPI, accountsAPI } from "../../../services/api";
import AccountMultiSelectDropdown from "../../../components/AccountMultiSelectDropdown";

// shadcn/ui imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Progress } from "../../../components/ui/progress";
import { Textarea } from "../../../components/ui/textarea";
import { Checkbox } from "../../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { cn } from "../../../lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const AccountOrganizer = () => {
  const { accountId } = useParams();

  const [organizerTemplate, setOrganizerTemplate] = useState([]);
  const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] =
    useState("");
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [organizeraccountwise, setorganizeraccountwise] = useState();
  const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizerTemplateData();
    fetchAccountsData();
  }, []);

  const fetchOrganizerTemplateData = async () => {
    try {
      const result = await organizerAPI.getOrganizerTemplates();
      console.log("Organizer Templates:", result);
      setOrganizerTemplate(result.data.OrganizerTemplates || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch organizer templates");
    }
  };

  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    fetchAccountsData();
  }, []);

  const fetchAccountsData = async () => {
    try {
      const response = await accountsAPI.getAccountNamesByStatus({ active: true });
      const result = response.data;
      const accounts = result.accounts || result.accountlist || result.teamAccounts || [];

      if (Array.isArray(accounts)) {
        setAccountData(accounts);
        
        if (accountId) {
          const preselectedAccount = accounts
            .filter(account => account._id === accountId)
            .map(acc => ({
              label: acc.accountName,
              value: acc._id,
            }));
          
          if (preselectedAccount.length) {
            setSelectedAccount(preselectedAccount);
          }
        }
      } else {
        console.error("Account list is not an array", result);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch accounts");
    }
  };

  const AccountsOptions = (accountData || []).map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  const handleOrganizerTemplateChange = async (selectedValue) => {
    setSelectedOrganizerTemplate(selectedValue);
    await fetchOrganizerTemplateDataByTempId(selectedValue);
  };

  const [sections, setSections] = useState([]);
  const [organizerName, setOrganizerName] = useState("");

  const handleOrganizerNameChange = (e) => {
    setOrganizerName(e.target.value);
  };

  const fetchOrganizerTemplateDataByTempId = async (selectedOrganizerTempid) => {
    try {
      const result = await organizerAPI.getOrganizerTemplateById(selectedOrganizerTempid);
      console.log("Organizer Template Details:", result);
      setSelectedOrganizerTempData(result.data.organizerTemplate);
      setSections(result.data.organizerTemplate.sections);
      setOrganizerName(result.data.organizerTemplate.organizerName);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch organizer template details");
    }
  };

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const handlePreview = () => {
    setPreviewDialogOpen(true);
    console.log(selectedOrganizerTempData.sections);
    const sections = selectedOrganizerTempData.sections;
    const data = {
      sections,
    };
    console.log("Data for preview:", data);
  };

  const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
    value: organizertemp._id,
    label: organizertemp.templatename,
  }));

  const handleOrganizerFormClose = () => {
    navigate(`/clients/accounts/accountsdash/organizers/${accountId}`);
  };

  // Preview states
  const [startDate, setStartDate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answeredElements, setAnsweredElements] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [repeatedSections, setRepeatedSections] = useState({});

  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;

    const conditions = section.sectionsettings.conditions || [];
    const mode = section.sectionsettings.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    conditions.forEach((condition) => {
      if (!condition.question || !condition.answer) return;

      let conditionMet = false;

      for (const key in radioValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (key.endsWith(`_${condition.question}`) && radioValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in checkboxValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (key.endsWith(`_${condition.question}`) && checkboxValues[key]?.[condition.answer]) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedDropdownValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (key.endsWith(`_${condition.question}`) && selectedDropdownValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedYesNoValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (key.endsWith(`_${condition.question}`) && selectedYesNoValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
      }
    });

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };

  const getVisibleSections = () => sections.filter(shouldShowSection);
  const visibleSections = getVisibleSections();

  const handleInputChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const totalSteps = visibleSections.length;

  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (value) => {
    setActiveStep(parseInt(value));
  };

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;

    const conditions = settings?.conditions || [];
    const mode = settings?.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      for (const key in radioValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          radioValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in checkboxValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          checkboxValues[key]?.[answer]
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedDropdownValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedYesNoValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      if (mode === "All" && !conditionMet) {
        return false;
      }
    }

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };

  const handleRadioChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleCheckboxChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleYesNoChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleDropdownValueChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };

  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [reminder, setReminder] = useState(false);

  const handleAbsolutesDates = (checked) => {
    setReminder(checked);
  };

  const createOrganizerOfAccount = async () => {
    try {
      const requestData = {
        accountid: accountId,
        organizertemplateid: selectedOrganizerTemplate,
        organizerName: organizerName,
        reminders: reminder,
        noofreminders: noOfReminder,
        daysuntilnextreminder: daysuntilNextReminder,
        fileUploadPath: "",
        sections: selectedOrganizerTempData?.sections?.map((section) => ({
          name: section?.text || "",
          id: section?.id?.toString() || "",
          text: section?.text || "",
          sectionsettings: {
            sectionRepeatingMode: section?.sectionsettings?.sectionRepeatingMode || false,
            buttonName: section?.sectionsettings?.buttonName || "Repeat Section",
            conditional: section?.sectionsettings?.conditional || false,
            conditions: section?.sectionsettings?.conditions || [],
            mode: section?.sectionsettings?.mode || "Any",
          },
          formElements: section?.formElements?.map((question) => ({
            type: question?.type || "",
            id: question?.id || "",
            sectionid: question?.sectionid || "",
            options: question?.options?.map((option) => ({
              id: option?.id || "",
              text: option?.text || "",
              selected: option?.selected || false,
            })) || [],
            text: question?.text || "",
            textvalue: question?.textvalue || "",
            questionsectionsettings: {
              required: question?.questionsectionsettings?.required || false,
              prefilled: question?.questionsectionsettings?.prefilled || false,
              conditional: question?.questionsectionsettings?.conditional || false,
              conditions: question?.questionsectionsettings?.conditions || [],
              descriptionEnabled: question?.questionsectionsettings?.descriptionEnabled || false,
              description: question?.questionsectionsettings?.description || "",
              mode: question?.questionsectionsettings?.mode || "Any",
            },
          })) || [],
        })) || [],
        status: "Pending",
        active: true,
      };

      console.log("Request data:", requestData);

      const result = await organizerAPI.createOrganizerAccountWise(requestData);

      console.log(result);
      console.log(result.newOrganizerAccountWise);

      setorganizeraccountwise(result.newOrganizerAccountWise);
      setShowOrganizerForm(true);
      setSelectedOrganizerTemplate(selectedOrganizerTemplate);
      console.log(selectedOrganizerTemplate);
      toast.success("New organizer created successfully");

      navigate(`/clients/accounts/accountsdash/organizers/${accountId}`);
    } catch (error) {
      console.error("Error creating organizer:", error);
      toast.error("Failed to create organizer");
    }
  };

  const handleAccountSelectionChange = (selectedAccounts) => {
    setSelectedAccount(selectedAccounts);
    if (selectedAccounts.length > 0 && accountId !== selectedAccounts[0].value) {
      navigate(`/clients/accounts/accountsdash/organizers/${selectedAccounts[0].value}`);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4 mt-3">
          <h2 className="text-xl font-bold">Create organizer</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Accounts</Label>
            <AccountMultiSelectDropdown
              value={selectedAccount}
              onChange={selectedAccount}
            />
          </div>

          <div>
            <Label className="mb-2 block">Organizer Template</Label>
            <Select
              value={selectedOrganizerTemplate || "none"}
              onValueChange={(value) => handleOrganizerTemplateChange(value === "none" ? "" : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select organizer template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {OrganizerTemplateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Organizer Name"
              value={organizerName || ""}
              onChange={handleOrganizerNameChange}
            />
          </div>

          <div>
            <Button onClick={handlePreview} variant="default">
              Preview Mode
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={reminder}
                onCheckedChange={handleAbsolutesDates}
                id="reminder-mode"
              />
              <Label htmlFor="reminder-mode">Reminders</Label>
            </div>
          </div>

          {reminder && (
            <div className="flex items-center gap-6 mt-2">
              <div className="flex-1">
                <Label className="mb-2 block">Days until next reminder</Label>
                <Input
                  value={daysuntilNextReminder}
                  onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                  placeholder="Days until next reminder"
                />
              </div>

              <div className="flex-1">
                <Label className="mb-2 block">No Of reminders</Label>
                <Input
                  value={noOfReminder}
                  onChange={(e) => setNoOfReminder(e.target.value)}
                  placeholder="NoOfreminders"
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 items-center">
            <Button onClick={createOrganizerOfAccount} variant="default">
              Create
            </Button>
            <Button onClick={handleOrganizerFormClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-6xl w-full h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview Mode</DialogTitle>
            </DialogHeader>
            
            <div>
              <div className="border-2 border-blue-400 p-4 mb-6 rounded-lg bg-blue-100 flex items-center justify-between">
                <div>
                  <p className="font-bold">Preview mode</p>
                  <p className="text-sm">The client sees your organizer like this</p>
                </div>
                <Button variant="ghost" onClick={handleClosePreview}>
                  Back to edit
                </Button>
              </div>

              <p className="mb-4">{organizerName}</p>

              <div className="mb-4">
                <Select 
                  value={activeStep.toString()} 
                  onValueChange={handleDropdownChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {visibleSections.map((section, index) => {
                      const visibleElements = section.formElements.filter(
                        (el) => shouldShowElement(el, section.id),
                      );

                      const answeredCount = visibleElements.reduce(
                        (count, element) => {
                          const key = `${section.id}_${element.text}`;
                          return count + (answeredElements[key] ? 1 : 0);
                        },
                        0,
                      );

                      const totalVisibleElements = visibleElements.length;

                      return (
                        <SelectItem key={section.id} value={index.toString()}>
                          {section.text} ({answeredCount}/{totalVisibleElements})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="my-4">
                <Progress value={((activeStep + 1) / totalSteps) * 100} />
              </div>

              <div className="px-20">
                {visibleSections.map(
                  (section, sectionIndex) =>
                    sectionIndex === activeStep && (
                      <div key={section.id} className="space-y-6">
                        {section.formElements.map(
                          (element) =>
                            shouldShowElement(element, section.id) && (
                              <div key={`${section.id}_${element.id}`} className="space-y-2">
                                {/* Text Editor */}
                                {element.type === "Text Editor" && (
                                  <div className="my-2">
                                    <p>{stripHtmlTags(element.text)}</p>
                                  </div>
                                )}

                                {/* Free Entry or Email */}
                                {(element.type === "Free Entry" ||
                                  element.type === "Email") && (
                                  <div>
                                    <Label className="text-lg mb-1 block">
                                      {element.text}
                                    </Label>
                                    <Textarea
                                      placeholder={`${element.type} Answer`}
                                      className="w-full"
                                      value={
                                        inputValues[
                                          `${section.id}_${element.text}`
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          e,
                                          element.text,
                                          section.id,
                                        )
                                      }
                                    />
                                  </div>
                                )}

                                {/* Number */}
                                {element.type === "Number" && (
                                  <div>
                                    <Label className="text-lg mb-1 block">
                                      {element.text}
                                    </Label>
                                    <Input
                                      type="text"
                                      placeholder={`${element.type} Answer`}
                                      className="w-full"
                                      value={
                                        inputValues[
                                          `${section.id}_${element.text}`
                                        ] || ""
                                      }
                                      onChange={(e) => {
                                        const numericValue =
                                          e.target.value.replace(/\D/g, "");
                                        handleInputChange(
                                          { target: { value: numericValue } },
                                          element.text,
                                          section.id,
                                        );
                                      }}
                                    />
                                  </div>
                                )}

                                {/* Radio Buttons */}
                                {element.type === "Radio Buttons" && (
                                  <div>
                                    <Label className="text-lg mb-2 block">
                                      {element.text}
                                    </Label>
                                    <RadioGroup
                                      value={
                                        radioValues[`${section.id}_${element.text}`]
                                      }
                                      onValueChange={(value) =>
                                        handleRadioChange(value, element.text, section.id)
                                      }
                                      className="flex flex-wrap gap-4"
                                    >
                                      {element.options.map((option) => (
                                        <div key={option.text} className="flex items-center space-x-2">
                                          <RadioGroupItem value={option.text} id={`${section.id}_${element.id}_${option.text}`} />
                                          <Label htmlFor={`${section.id}_${element.id}_${option.text}`}>
                                            {option.text}
                                          </Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                )}

                                {/* Checkboxes */}
                                {element.type === "Checkboxes" && (
                                  <div>
                                    <Label className="text-lg mb-2 block">
                                      {element.text}
                                    </Label>
                                    <div className="flex flex-wrap gap-4">
                                      {element.options.map((option) => (
                                        <div key={option.text} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`${section.id}_${element.id}_${option.text}`}
                                            checked={
                                              checkboxValues[`${section.id}_${element.text}`]?.[option.text] || false
                                            }
                                            onCheckedChange={() =>
                                              handleCheckboxChange(option.text, element.text, section.id)
                                            }
                                          />
                                          <Label htmlFor={`${section.id}_${element.id}_${option.text}`}>
                                            {option.text}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Yes/No */}
                                {element.type === "Yes/No" && (
                                  <div>
                                    <Label className="text-lg mb-2 block">
                                      {element.text}
                                    </Label>
                                    <RadioGroup
                                      value={
                                        selectedYesNoValues[`${section.id}_${element.text}`]
                                      }
                                      onValueChange={(value) =>
                                        handleYesNoChange(value, element.text, section.id)
                                      }
                                      className="flex gap-4"
                                    >
                                      {element.options.map((option) => (
                                        <div key={option.text} className="flex items-center space-x-2">
                                          <RadioGroupItem value={option.text} id={`${section.id}_${element.id}_${option.text}`} />
                                          <Label htmlFor={`${section.id}_${element.id}_${option.text}`}>
                                            {option.text}
                                          </Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                )}

                                {/* Dropdown */}
                                {element.type === "Dropdown" && (
                                  <div>
                                    <Label className="text-lg mb-2 block">
                                      {element.text}
                                    </Label>
                                    <Select
                                      value={
                                        selectedDropdownValues[
                                          `${section.id}_${element.text}`
                                        ] || "none"
                                      }
                                      onValueChange={(value) =>
                                        handleDropdownValueChange(value === "none" ? "" : value, element.text, section.id)
                                      }
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select option" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">Select an option</SelectItem>
                                        {element.options.map((option) => (
                                          <SelectItem key={option.text} value={option.text}>
                                            {option.text}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                {/* Date */}
                                {element.type === "Date" && (
                                  <div>
                                    <Label className="text-lg mb-2 block">
                                      {element.text}
                                    </Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !startDate && "text-muted-foreground"
                                          )}
                                          onClick={() =>
                                            setAnsweredElements((prev) => ({
                                              ...prev,
                                              [`${section.id}_${element.text}`]: true,
                                            }))
                                          }
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {startDate ? format(startDate, "MM/dd/yyyy") : "Select date"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0">
                                        <Calendar
                                          mode="single"
                                          selected={startDate}
                                          onSelect={handleStartDateChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}

                                {/* File Upload */}
                                {element.type === "File Upload" && (
                                  <div>
                                    <Label className="text-lg mb-2 block">
                                      {element.text}
                                    </Label>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="relative w-full">
                                          <Input
                                            disabled
                                            placeholder="Add Document"
                                            className="cursor-not-allowed"
                                          />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Unavailable in preview mode</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    ),
                )}
                <div className="flex gap-4 items-center mt-6">
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant="default"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={activeStep === totalSteps - 1}
                    variant="default"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AccountOrganizer;