// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import Section from "./organizertempSection";
// import { toast } from "react-toastify";
// import { CircularProgress, Divider, TableContainer } from "@mui/material";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Box,
//   Button,
//   TextField,
//   IconButton,
//   Typography,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogContent,
//   Menu,
//   InputLabel,
//   LinearProgress,
//   Select,
//   MenuItem,
//   Tooltip,
//   FormControl,
//   TablePagination,
//   InputAdornment,
// } from "@mui/material";
// import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import { useNavigate } from "react-router-dom";
// import { CiMenuKebab } from "react-icons/ci";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { useTheme } from "@mui/material/styles";

// import debounce from "lodash.debounce";
// import { useDrag, useDrop, DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { organizerAPI } from "../../../services/api";
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import OrganizerSettingsDrawer from "./OrganizerSettingsDrawer";
// import ShortcodeTextField from "../../../components/ShortcodeTextField";
// import OrganizerPreview from "./OrganizerPreview";
// // SectionItem component remains the same
// const SectionItem = ({
//   section,
//   onClick,
//   onDrop,
//   index,
//   truncateText,
//   isSelected,
// }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "SECTION",
//     item: { id: section.id, index },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   const [, drop] = useDrop({
//     accept: "SECTION",
//     hover: (item) => {
//       if (item.index !== index) {
//         onDrop(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <Box
//       ref={(node) => drag(drop(node))}
//       key={section.id}
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         opacity: isDragging ? 0.5 : 1,
//         cursor: "move",
//         mb: 1,
//       }}
//     >
//       <TextField
//         placeholder={`Section Name`}
//         className="section-name"
//         size="small"
//         margin="normal"
//         value={truncateText(section.text, 5)}
//         InputProps={{
//           readOnly: true,
//           startAdornment: (
//             <InputAdornment position="start">
//               <DragIndicatorIcon sx={{ cursor: "move" }} />
//             </InputAdornment>
//           ),
//         }}
//         sx={{
//           backgroundColor: isSelected ? "#E0F7FA" : "#fff",
//           cursor: "pointer",
//           width: "100%",
//         }}
//         onClick={() => onClick(section)}
//         fullWidth
//       />
//     </Box>
//   );
// };
// const OrganizersTemp = () => {
//   const confirm = useConfirm();
//   const moveSection = (fromIndex, toIndex) => {
//     const newSections = [...sections];
//     const [movedSection] = newSections.splice(fromIndex, 1);
//     newSections.splice(toIndex, 0, movedSection);
//     setSections(newSections);
//   };

//   const truncateText = (text, maxWords) => {
//     const words = text.split(" ");
//     if (words.length > maxWords) {
//       return words.slice(0, maxWords).join(" ") + " ..";
//     }
//     return text;
//   };

//   const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("contacts");

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);

//   // New state for edit mode
//   const [mode, setMode] = useState("create"); // 'create' or 'edit'
//   const [currentTemplateId, setCurrentTemplateId] = useState(null);
//   const [loadingTemplate, setLoadingTemplate] = useState(false);

//   // Fixed: Added proper dependency and memoized filter
//   useEffect(() => {
//     setFilteredShortcuts(
//       shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")),
//     );
//   }, [shortcuts]);

//   useEffect(() => {
//     if (selectedOption === "contacts" || selectedOption === "account") {
//       const accountShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         { title: "Date Shortcodes", isBold: true },
//         {
//           title: "Current day full date",
//           isBold: false,
//           value: "CURRENT_DAY_FULL_DATE",
//         },
//         {
//           title: "Current day number",
//           isBold: false,
//           value: "CURRENT_DAY_NUMBER",
//         },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         {
//           title: "Current month number",
//           isBold: false,
//           value: "CURRENT_MONTH_NUMBER",
//         },
//         {
//           title: "Current month name",
//           isBold: false,
//           value: "CURRENT_MONTH_NAME",
//         },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//         {
//           title: "Last day full date",
//           isBold: false,
//           value: "LAST_DAY_FULL_DATE",
//         },
//         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//         { title: "Last week", isBold: false, value: "LAST_WEEK" },
//         {
//           title: "Last month number",
//           isBold: false,
//           value: "LAST_MONTH_NUMBER",
//         },
//         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//         {
//           title: "Next day full date",
//           isBold: false,
//           value: "NEXT_DAY_FULL_DATE",
//         },
//         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//         {
//           title: "Next month number",
//           isBold: false,
//           value: "NEXT_MONTH_NUMBER",
//         },
//         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//       ];
//       setShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);

//   const handleCloseDropdown = () => {
//     setShowDropdown(false);
//     setAnchorEl(null);
//   };

//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textFieldRef = useRef(null);

//   const handlejobName = (e) => {
//     const { value, selectionStart } = e.target;
//     setOrganizerName(value);
//     setCursorPosition(selectionStart);
//   };

//   const toggleDropdown = (event) => {
//     setAnchorEl(event.currentTarget);
//     setShowDropdown(!showDropdown);
//   };

//   const handleAddShortcut = (shortcut) => {
//     setOrganizerName((prevText) => {
//       const newText =
//         prevText.slice(0, cursorPosition) +
//         `[${shortcut}]` +
//         prevText.slice(cursorPosition);
//       return newText;
//     });

//     setTimeout(() => {
//       if (textFieldRef.current) {
//         textFieldRef.current.focus();
//         textFieldRef.current.setSelectionRange(
//           cursorPosition + shortcut.length + 2,
//           cursorPosition + shortcut.length + 2,
//         );
//       }
//     }, 0);

//     setShowDropdown(false);
//   };

//   const [templateName, setTemplateName] = useState("");
//   const [organizerName, setOrganizerName] = useState("");
//   const [sections, setSections] = useState([]);
//   const [selectedSection, setSelectedSection] = useState(null);

//   const handleSectionSaveData = (settings) => {
//     setSections((prevSections) =>
//       prevSections.map((section) =>
//         section.id === selectedSection.id
//           ? { ...section, sectionsettings: settings }
//           : section,
//       ),
//     );
//   };

//   const addSection = () => {
//     const newSection = {
//       id: Date.now(),
//       name: `Section ${sections.length + 1}`,
//       text: "",
//       formElements: [],
//       sectionSettings: {
//         sectionRepeatingMode: false,
//         buttonName: "",
//         conditional: false,
//         mode: "",
//         conditions: [
//           {
//             question: "",
//             answer: "",
//           },
//         ],
//       },
//     };
//     setSections([...sections, newSection]);
//     setSelectedSection(newSection);
//   };

//   const handleSectionClick = (section) => {
//     setSelectedSection(section);
//   };

//   const handleDeleteSection = (id) => {
//     const newSections = sections.filter((section) => section.id !== id);
//     setSections(newSections);
//     if (selectedSection && selectedSection.id === id) {
//       setSelectedSection(null);
//     }
//   };

//   const handleUpdateSection = (
//     id,
//     newText,
//     newFormElements,
//     newSectionSettings,
//   ) => {
//     setSections((prevSections) =>
//       prevSections.map((section) =>
//         section.id === id
//           ? {
//               ...section,
//               text: newText,
//               formElements: newFormElements,
//               sectionSettings: {
//                 ...section.sectionSettings,
//                 ...newSectionSettings,
//               },
//             }
//           : section,
//       ),
//     );
//   };

//   const handleDuplicateSection = (sectionId) => {
//     const sectionToDuplicate = sections.find(
//       (section) => section.id === sectionId,
//     );

//     if (sectionToDuplicate) {
//       const newSectionId = Date.now();

//       const duplicatedFormElements = sectionToDuplicate.formElements.map(
//         (element) => ({
//           ...element,
//           id: Date.now() + Math.floor(Math.random() * 1000),
//           sectionid: newSectionId,
//         }),
//       );

//       const duplicatedSection = {
//         ...sectionToDuplicate,
//         id: newSectionId,
//         text: `${sectionToDuplicate.text} (Copy)`,
//         formElements: duplicatedFormElements,
//       };

//       setSections([...sections, duplicatedSection]);
//     }
//   };

//   const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] =
//     useState(false);

//   const handleCreateInvoiceClick = () => {
//     resetForm();
//     setMode("create");
//     setCurrentTemplateId(null);
//     setShowOrganizerTemplateForm(true);
//   };

//   const handleFormSave = (elementId, formData) => {
//     setSections((prevSections) =>
//       prevSections.map((section) => ({
//         ...section,
//         formElements: section.formElements.map((el) =>
//           el.id === elementId
//             ? { ...el, questionsectionsettings: formData }
//             : el,
//         ),
//       })),
//     );
//   };

//   // New function to reset form
//   const resetForm = () => {
//     setTemplateName("");
//     setOrganizerName("");
//     setSections([]);
//     setSelectedSection(null);
//     setTemplateNameError("");
//     setOrganizerError("");
//     setIsFormDirty(false);
//     setLoginChecked(false);
//     setNotifyChecked(false);
//     setAutoSaveChecked(false);
//     setEmailSyncChecked(false);
//     setNoOfReminder(1);
//     setDaysUntilNextReminder(3);
//     setActiveStep(0);
//     setRadioValues({});
//     setCheckboxValues({});
//     setAnsweredElements({});
//     setSelectedYesNoValues({});
//     setInputValues({});
//     setSelectedDropdownValues({});
//     setRepeatedSections({});
//     setPreviousVisibleSections([]);
//   };

//   // New function to fetch template for editing
//   const fetchTemplateForEdit = async (templateId) => {
//     setLoadingTemplate(true);
//     try {
//       const response = await organizerAPI.getOrganizerTemplateById(templateId);
//       const templateData = response.data.organizerTemplate;
//       console.log("edit template dta", response.data);
//       // Populate form with template data
//       setTemplateName(templateData.templatename || "");
//       setOrganizerName(templateData.organizerName || "");
//       setSections(templateData.sections || []);
//       setSelectedSection(templateData.sections?.[0] || null);

//       // Populate settings
//       if (templateData.organizersettings) {
//         setLoginChecked(
//           templateData.organizersettings.notifyaboutdocumentupload || false,
//         );
//         setNotifyChecked(
//           templateData.organizersettings.organizerselfservice || false,
//         );
//         setEmailSyncChecked(
//           templateData.organizersettings.automaticallysealaftersubmission ||
//             false,
//         );
//         setAutoSaveChecked(
//           templateData.organizersettings.sendreminderstoclient || false,
//         );
//         setDaysUntilNextReminder(
//           templateData.organizersettings.daysuntilnextreminder || "3",
//         );
//         setNoOfReminder(templateData.organizersettings.numberofreminders || 1);
//       }

//       setMode("edit");
//       setCurrentTemplateId(templateId);
//       setShowOrganizerTemplateForm(true);
//     } catch (error) {
//       console.error("Error fetching template:", error);
//       toast.error(
//         error.response?.data?.error || "Failed to load template data",
//       );
//     } finally {
//       setLoadingTemplate(false);
//     }
//   };

//   // Modified save function to handle both create and update
//   const saveandexitOrganizerTemp = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     const organizersettings = {
//       notifyaboutdocumentupload: loginChecked,
//       organizerselfservice: notifyChecked,
//       automaticallysealaftersubmission: emailSyncChecked,
//       sendreminderstoclient: autoSaveChecked,
//       daysuntilnextreminder: daysUntilNextReminder,
//       numberofreminders: noOfReminder,
//     };

//     const requestData = {
//       templatename: templateName,
//       organizerName: organizerName,
//       sections: sections.map((section) => ({
//         name: section.text,
//         text: section.text,
//         id: section.id.toString(),
//         sectionsettings: section.sectionsettings || {},
//         formElements: section.formElements.map((element) => ({
//           type: element.type,
//           id: element.id,
//           sectionid: element.sectionid,
//           options: element.options.map((option) => ({
//             id: option.id,
//             text: option.text,
//           })),
//           text: element.text,
//           questionsectionsettings: element.questionsectionsettings || {},
//         })),
//       })),
//       organizersettings: organizersettings,
//       active: true,
//     };

//     try {
//       let result;
//       if (mode === "edit" && currentTemplateId) {
//         // Update existing template
//         result = await organizerAPI.updateOrganizerTemplate(
//           currentTemplateId,
//           requestData,
//         );
//         if (result && result.status === 200) {
//           toast.success("Organizer Template updated successfully");
//           handleMenuClose();
//           setShowOrganizerTemplateForm(false);
//           resetForm();
//           fetchOrganizerTemplates();
//         } else {
//           const errorMessage =
//             result?.data?.error || "Failed to update Organizer Template";
//           toast.error(errorMessage);
//         }
//       } else {
//         // Create new template
//         result = await organizerAPI.createOrganizerTemplate(requestData);
//         if (result && result.status === 201) {
//           toast.success("Organizer Template created successfully");
//           handleMenuClose();
//           setShowOrganizerTemplateForm(false);
//           resetForm();
//           fetchOrganizerTemplates();
//         } else {
//           const errorMessage =
//             result?.data?.error || "Failed to create Organizer Template";
//           toast.error(errorMessage);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       const errorMessage =
//         error.response?.data?.error ||
//         error.message ||
//         `${mode === "edit" ? "Failed to update" : "Failed to create"} Organizer Template`;
//       toast.error(errorMessage);
//     }
//   };

//   const saveOrganizerTemp = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     const organizersettings = {
//       notifyaboutdocumentupload: loginChecked,
//       organizerselfservice: notifyChecked,
//       automaticallysealaftersubmission: emailSyncChecked,
//       sendreminderstoclient: autoSaveChecked,
//       daysuntilnextreminder: daysUntilNextReminder,
//       numberofreminders: noOfReminder,
//     };

//     const requestData = {
//       templatename: templateName,
//       organizerName: organizerName,
//       sections: sections.map((section) => ({
//         name: section.text,
//         text: section.text,
//         id: section.id.toString(),
//         sectionsettings: section.sectionsettings || {},
//         formElements: section.formElements.map((element) => ({
//           type: element.type,
//           id: element.id,
//           sectionid: element.sectionid,
//           options: element.options.map((option) => ({
//             id: option.id,
//             text: option.text,
//           })),
//           text: element.text,
//           questionsectionsettings: element.questionsectionsettings || {},
//         })),
//       })),
//       organizersettings: organizersettings,
//       active: true,
//     };

//     try {
//       let result;
//       if (mode === "edit" && currentTemplateId) {
//         // Update existing template
//         result = await organizerAPI.updateOrganizerTemplate(
//           currentTemplateId,
//           requestData,
//         );
//         if (result && result.status === 200) {
//           toast.success("Organizer Template updated successfully");
//           fetchOrganizerTemplates();
//         } else {
//           toast.error(
//             result?.data?.error || "Failed to update Organizer Template",
//           );
//         }
//       } else {
//         // Create new template
//         result = await organizerAPI.createOrganizerTemplate(requestData);
//         if (
//           result &&
//           result.message === "Organizer Template created successfully"
//         ) {
//           toast.success("Organizer Template created successfully");
//           fetchOrganizerTemplates();
//         } else {
//           toast.error(result.error || "Failed to create Organizer Template");
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         error.response?.data?.error ||
//           `${mode === "edit" ? "Failed to update" : "Failed to create"} Organizer Template`,
//       );
//     }
//   };

//   const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrganizerTemplates = async () => {
//     setLoading(true);
//     const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
//     try {
//       const response = await organizerAPI.getOrganizerTemplates();
//       setOrganizerTemplatesData(response?.data?.OrganizerTemplates || []);
//     } catch (error) {
//       console.error("Error fetching email templates:", error);
//       toast.error("Failed to fetch organizer templates");
//       setOrganizerTemplatesData([]);
//     } finally {
//       await loaderDelay;
//       setLoading(false);
//     }
//   };

//   const handleEdit = (_id) => {
//     fetchTemplateForEdit(_id);
//   };
//   // For delete (destructive action)
//   const handleDelete = async (_id) => {
//     confirm({
//       title: "Delete Organizer Template",
//       description:
//         "Are you sure you want to delete this organizer template? This action cannot be undone.",
//       confirmText: "Delete",
//       confirmColor: "error",
//       onConfirm: async () => {
//         try {
//           const result = await organizerAPI.deleteOrganizerTemplate(_id);
//           toast.success("Item deleted successfully");
//           handleMenuClose();
//           fetchOrganizerTemplates();
//         } catch (error) {
//           console.error(error);
//           toast.error(error.response?.data?.error || "Failed to delete item");
//         }
//       },
//     });
//   };
//   // const handleDelete = async (_id) => {
//   //   const isConfirmed = window.confirm(
//   //     "Are you sure you want to delete this organizer template?"
//   //   );

//   //   if (isConfirmed) {
//   //     try {
//   //       const result = await organizerAPI.deleteOrganizerTemplate(_id);
//   //       toast.success("Item deleted successfully");
//   //       handleMenuClose();
//   //       fetchOrganizerTemplates();
//   //     } catch (error) {
//   //       console.error(error);
//   //       toast.error(error.response?.data?.error || "Failed to delete item");
//   //     }
//   //   }
//   // };

//   useEffect(() => {
//     fetchOrganizerTemplates();
//   }, []);

//   const [tempIdget, setTempIdGet] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);

//   const toggleMenu = (event, _id) => {
//     setAnchorEl(event.currentTarget);
//     setOpenMenuId(_id);
//     setTempIdGet(_id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setOpenMenuId(null);
//     setTempIdGet(null);
//   };

//   const [isFormDirty, setIsFormDirty] = useState(false);

//   const handleCancel = () => {
//     // if (isFormDirty) {
//     //   const confirmClose = window.confirm(
//     //     "You have unsaved changes. Are you sure you want to cancel?"
//     //   );
//     //   if (!confirmClose) {
//     //     return;
//     //   }
//     // }
//     setShowOrganizerTemplateForm(false);
//     resetForm();
//   };

//   useEffect(() => {
//     if (templateName || organizerName) {
//       setIsFormDirty(true);
//     } else {
//       setIsFormDirty(false);
//     }
//   }, [templateName, organizerName]);

//   const [templateNameError, setTemplateNameError] = useState("");
//   const [organizerError, setOrganizerError] = useState("");

//   const validateForm = () => {
//     let isValid = true;
//     if (!templateName) {
//       setTemplateNameError("Template name is required");
//       isValid = false;
//     } else {
//       setTemplateNameError("");
//     }

//     if (!organizerName) {
//       setOrganizerError("Organizer name is required");
//       isValid = false;
//     } else {
//       setOrganizerError("");
//     }
//     return isValid;
//   };
//   const handleDuplicateTemplate = async (id) => {
//     try {
//       const res = await organizerAPI.duplicateOrganizerTemplate(id);
//       console.log("Duplicated:", res.data);

//       // optional: refresh list
//       fetchOrganizerTemplates();
//     } catch (error) {
//       console.error("Duplicate failed:", error);
//     }
//   };
//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

//   const handlePreview = () => {
//     setPreviewDialogOpen(true);
//   };

//   const handleClosePreview = () => {
//     setPreviewDialogOpen(false);
//   };

//   const [startDate, setStartDate] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);

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

//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [answeredElements, setAnsweredElements] = useState({});

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

//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});

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

//   const [inputValues, setInputValues] = useState({});

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

//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});

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

//   const [repeatedSections, setRepeatedSections] = useState({});

//   // FIXED: Memoized shouldShowElement function
//   const shouldShowElement = useCallback(
//     (element, sectionId) => {
//       const settings = element.questionsectionsettings;
//       if (!settings?.conditional) return true;

//       const conditions = settings?.conditions || [];
//       const mode = settings?.mode || "All";

//       if (conditions.length === 0) return true;

//       let matchedConditions = 0;

//       for (const condition of conditions) {
//         const { question, answer } = condition;
//         if (!question || !answer) continue;

//         let conditionMet = false;

//         for (const key in radioValues) {
//           const [keySectionId] = key.split("_");
//           const numericKeySectionId = Number(keySectionId);
//           const numericCurrentSectionId =
//             typeof sectionId === "string" ? Number(sectionId) : sectionId;

//           if (
//             numericKeySectionId === numericCurrentSectionId &&
//             key.endsWith(`_${question}`) &&
//             radioValues[key] === answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") continue;
//           else continue;
//         }

//         for (const key in checkboxValues) {
//           const [keySectionId] = key.split("_");
//           const numericKeySectionId = Number(keySectionId);
//           const numericCurrentSectionId =
//             typeof sectionId === "string" ? Number(sectionId) : sectionId;

//           if (
//             numericKeySectionId === numericCurrentSectionId &&
//             key.endsWith(`_${question}`) &&
//             checkboxValues[key]?.[answer]
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") continue;
//           else continue;
//         }

//         for (const key in selectedDropdownValues) {
//           const [keySectionId] = key.split("_");
//           const numericKeySectionId = Number(keySectionId);
//           const numericCurrentSectionId =
//             typeof sectionId === "string" ? Number(sectionId) : sectionId;

//           if (
//             numericKeySectionId === numericCurrentSectionId &&
//             key.endsWith(`_${question}`) &&
//             selectedDropdownValues[key] === answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") continue;
//           else continue;
//         }

//         for (const key in selectedYesNoValues) {
//           const [keySectionId] = key.split("_");
//           const numericKeySectionId = Number(keySectionId);
//           const numericCurrentSectionId =
//             typeof sectionId === "string" ? Number(sectionId) : sectionId;

//           if (
//             numericKeySectionId === numericCurrentSectionId &&
//             key.endsWith(`_${question}`) &&
//             selectedYesNoValues[key] === answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") continue;
//           else continue;
//         }

//         if (mode === "All" && !conditionMet) {
//           return false;
//         }
//       }

//       if (mode === "Any") {
//         return matchedConditions > 0;
//       } else {
//         return matchedConditions === conditions.length;
//       }
//     },
//     [radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues],
//   );

//   const [previousVisibleSections, setPreviousVisibleSections] = useState([]);

//   // FIXED: Memoized clearSectionValues function
//   const clearSectionValues = useCallback((sectionId) => {
//     setRadioValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         const [keySectionId] = key.split("_");
//         if (keySectionId === sectionId.toString()) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setCheckboxValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         const [keySectionId] = key.split("_");
//         if (keySectionId === sectionId.toString()) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedDropdownValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         const [keySectionId] = key.split("_");
//         if (keySectionId === sectionId.toString()) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedYesNoValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         const [keySectionId] = key.split("_");
//         if (keySectionId === sectionId.toString()) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setInputValues((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         const [keySectionId] = key.split("_");
//         if (keySectionId === sectionId.toString()) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setAnsweredElements((prev) => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach((key) => {
//         const [keySectionId] = key.split("_");
//         if (keySectionId === sectionId.toString()) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });
//   }, []);

//   // FIXED: Memoized checkSectionVisibility function
//   const checkSectionVisibility = useCallback(
//     (section) => {
//       if (!section.sectionsettings?.conditional) return true;

//       const conditions = section.sectionsettings.conditions || [];
//       const mode = section.sectionsettings.mode || "All";

//       if (conditions.length === 0) return true;

//       let matchedConditions = 0;

//       conditions.forEach((condition) => {
//         if (!condition.question || !condition.answer) return;

//         let conditionMet = false;

//         for (const key in radioValues) {
//           const [checkSectionId] = key.split("_");
//           const numericCheckSectionId = Number(checkSectionId);
//           const isRepeatedSection = Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId);

//           if (!isRepeatedSection) {
//             if (
//               key.endsWith(`_${condition.question}`) &&
//               radioValues[key] === condition.answer
//             ) {
//               conditionMet = true;
//               break;
//             }
//           }
//         }

//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") return;
//           return;
//         }

//         for (const key in checkboxValues) {
//           const [checkSectionId] = key.split("_");
//           const numericCheckSectionId = Number(checkSectionId);
//           const isRepeatedSection = Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId);

//           if (!isRepeatedSection) {
//             if (
//               key.endsWith(`_${condition.question}`) &&
//               checkboxValues[key]?.[condition.answer]
//             ) {
//               conditionMet = true;
//               break;
//             }
//           }
//         }

//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") return;
//           return;
//         }

//         for (const key in selectedDropdownValues) {
//           const [checkSectionId] = key.split("_");
//           const numericCheckSectionId = Number(checkSectionId);
//           const isRepeatedSection = Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId);

//           if (!isRepeatedSection) {
//             if (
//               key.endsWith(`_${condition.question}`) &&
//               selectedDropdownValues[key] === condition.answer
//             ) {
//               conditionMet = true;
//               break;
//             }
//           }
//         }

//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") return;
//           return;
//         }

//         for (const key in selectedYesNoValues) {
//           const [checkSectionId] = key.split("_");
//           const numericCheckSectionId = Number(checkSectionId);
//           const isRepeatedSection = Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId);

//           if (!isRepeatedSection) {
//             if (
//               key.endsWith(`_${condition.question}`) &&
//               selectedYesNoValues[key] === condition.answer
//             ) {
//               conditionMet = true;
//               break;
//             }
//           }
//         }

//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") return;
//         }
//       });

//       if (mode === "Any") {
//         return matchedConditions > 0;
//       } else {
//         return matchedConditions === conditions.length;
//       }
//     },
//     [
//       radioValues,
//       checkboxValues,
//       selectedDropdownValues,
//       selectedYesNoValues,
//       repeatedSections,
//     ],
//   );

//   // FIXED: Memoized shouldShowSection function
//   const shouldShowSection = useCallback(
//     (section) => {
//       const isCurrentlyVisible = checkSectionVisibility(section);
//       return isCurrentlyVisible;
//     },
//     [checkSectionVisibility],
//   );

//   // FIXED: Optimized useEffect for section visibility
//   useEffect(() => {
//     const currentlyVisible = sections.filter((section) =>
//       shouldShowSection(section),
//     );

//     // Check if the visible sections have actually changed
//     const hasChanged =
//       currentlyVisible.length !== previousVisibleSections.length ||
//       currentlyVisible.some(
//         (section) =>
//           !previousVisibleSections.some((prev) => prev.id === section.id),
//       );

//     if (hasChanged) {
//       const sectionsToClear = previousVisibleSections.filter(
//         (prevSection) =>
//           !currentlyVisible.some(
//             (currSection) => currSection.id === prevSection.id,
//           ),
//       );

//       sectionsToClear.forEach((section) => {
//         clearSectionValues(section.id);
//       });

//       setPreviousVisibleSections(currentlyVisible);
//     }
//   }, [
//     sections,
//     shouldShowSection,
//     clearSectionValues,
//     previousVisibleSections,
//   ]);

//   // FIXED: Memoized getVisibleSections function
//   const getVisibleSections = useCallback(() => {
//     return sections.filter((section) => shouldShowSection(section));
//   }, [sections, shouldShowSection]);

//   // FIXED: Memoized visibleSections
//   const visibleSections = useMemo(
//     () => getVisibleSections(),
//     [getVisibleSections],
//   );
//   const totalSteps = visibleSections.length;

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const handleDrawerOpen = () => {
//     setIsDrawerOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//   };

//   const theme = useTheme();

//   const [loginChecked, setLoginChecked] = useState(false);
//   const [notifyChecked, setNotifyChecked] = useState(false);
//   const [emailSyncChecked, setEmailSyncChecked] = useState(false);
//   const [autoSaveChecked, setAutoSaveChecked] = useState(false);

//   const handleLoginToggle = (checked) => {
//     setLoginChecked(checked);
//   };

//   const handleNotifyToggle = (checked) => {
//     setNotifyChecked(checked);
//   };

//   const handleEmailSyncToggle = (checked) => {
//     setEmailSyncChecked(checked);
//   };

//   const handleAutoSaveToggle = (checked) => {
//     setAutoSaveChecked(checked);
//   };

//   const [daysUntilNextReminder, setDaysUntilNextReminder] = useState("3");
//   const [noOfReminder, setNoOfReminder] = useState(1);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(30);

//   const handleChangePage = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedOrganizers = Array.isArray(organizerTemplatesData)
//     ? organizerTemplatesData.slice(
//         page * rowsPerPage,
//         page * rowsPerPage + rowsPerPage,
//       )
//     : [];

//   const checkTemplateName = async (name) => {
//     try {
//       const res = await organizerAPI.checkTemplateNameExists(name);
//       if (mode === "edit" && currentTemplateId) {
//         const originalTemplate = organizerTemplatesData.find(
//           (t) => t._id === currentTemplateId,
//         );
//         if (originalTemplate && originalTemplate.templatename === name) {
//           setTemplateNameError("");
//           return;
//         }
//       }
//       if (res.data.exists) {
//         setTemplateNameError("Template name already exists");
//       } else {
//         setTemplateNameError("");
//       }
//     } catch (err) {
//       console.error(err);
//       setTemplateNameError("");
//     }
//   };
//   // Prepare preview data
//   const previewData = useMemo(
//     () => ({
//       organizerName,
//       sections,
//       shouldShowElement,
//       stripHtmlTags,
//     }),
//     [organizerName, sections, shouldShowElement, stripHtmlTags],
//   );

//   // FIXED: Memoized debounced function
//   const debouncedCheck = useMemo(
//     () =>
//       debounce((name) => {
//         if (name.trim()) checkTemplateName(name);
//         else setTemplateNameError("");
//       }, 500),
//     [mode, currentTemplateId, organizerTemplatesData],
//   );

//   // FIXED: useEffect with proper cleanup
//   useEffect(() => {
//     debouncedCheck(templateName);
//     return () => {
//       debouncedCheck.cancel();
//     };
//   }, [templateName, debouncedCheck]);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <Box p={3}>
//         {!showOrganizerTemplateForm && (
//           <Box>
//             <Button
//               variant="contained"
//               onClick={handleCreateInvoiceClick}
//               sx={{ mb: 2 }}
//             >
//               Create Template
//             </Button>
//             <Box>
//               {loading ? (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <CircularProgress
//                     style={{ fontSize: "300px", color: "blue" }}
//                   />
//                 </Box>
//               ) : (
//                 <Box>
//                   <TableContainer
//                     component={Paper}
//                     sx={{ overflow: "visible" }}
//                   >
//                     <Table sx={{ width: "100%" }} aria-label="simple table">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>Template Name</TableCell>
//                           <TableCell>Used in Pipelines</TableCell>
//                           <TableCell>Settings</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {paginatedOrganizers.map((row) => (
//                           <TableRow key={row._id}>
//                             <TableCell
//                               onClick={() => handleEdit(row._id)}
//                               sx={{ cursor: "pointer" }}
//                             >
//                               {row.templatename}
//                             </TableCell>
//                             <TableCell></TableCell>
//                             <TableCell>
//                               <IconButton
//                                 onClick={(event) => toggleMenu(event, row._id)}
//                                 size="small"
//                               >
//                                 <MoreVertIcon />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl)}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleEdit(tempIdget)}>
//                           <RiEdit2Line style={{ marginRight: 8 }} /> Edit
//                         </MenuItem>
//                         <MenuItem
//                           onClick={() => {
//                             handleDuplicateTemplate(tempIdget);
//                             handleMenuClose();
//                           }}
//                         >
//                           <HiOutlineDocumentDuplicate
//                             style={{ marginRight: 8 }}
//                           />{" "}
//                           Duplicate
//                         </MenuItem>
//                         <MenuItem onClick={() => handleDelete(tempIdget)}>
//                           <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
//                         </MenuItem>
//                       </Menu>
//                     </Table>
//                     <TablePagination
//                       rowsPerPageOptions={[30, 40, 50, 60, 100]}
//                       component="div"
//                       count={
//                         Array.isArray(organizerTemplatesData)
//                           ? organizerTemplatesData.length
//                           : 0
//                       }
//                       rowsPerPage={rowsPerPage}
//                       page={page}
//                       onPageChange={handleChangePage}
//                       onRowsPerPageChange={handleChangeRowsPerPage}
//                     />
//                   </TableContainer>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         )}
//         {showOrganizerTemplateForm && (
//           <>
//             {loadingTemplate ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   minHeight: "400px",
//                 }}
//               >
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <>
//                 <Box>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       mb: 3,
//                       pb: 2,
//                       borderBottom: "1px solid",
//                       borderColor: "divider",
//                     }}
//                   >
//                     <Typography
//                       variant="h5"
//                       sx={{
//                         fontWeight: 600,
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       {mode === "edit" ? "Edit Template" : "Create Template"}
//                     </Typography>

//                     <Box sx={{ display: "flex", gap: 1 }}>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         onClick={handlePreview}
//                         sx={{
//                           textTransform: "none",
//                           borderRadius: "8px",
//                           px: 2,
//                         }}
//                       >
//                         Preview
//                       </Button>

//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={handleDrawerOpen}
//                         sx={{
//                           textTransform: "none",
//                           borderRadius: "8px",
//                           px: 2,
//                         }}
//                       >
//                         Setting
//                       </Button>
//                     </Box>
//                   </Box>

//                   <Box>
//                     <InputLabel sx={{ color: "black" }}>
//                       Template Name
//                     </InputLabel>
//                     <TextField
//                       value={templateName}
//                       onChange={(e) => setTemplateName(e.target.value)}
//                       fullWidth
//                       size="small"
//                       placeholder="Template name"
//                       sx={{ backgroundColor: "#fff", mt: 2 }}
//                       className="organizer-input-label"
//                       error={!!templateNameError}
//                     />
//                     {!!templateNameError && (
//                       <Alert
//                         sx={{
//                           width: "96%",
//                           p: "0",
//                           pl: "4%",
//                           height: "23px",
//                           borderRadius: "10px",
//                           borderTopLeftRadius: "0",
//                           borderTopRightRadius: "0",
//                           fontSize: "15px",
//                           display: "flex",
//                           alignItems: "center",
//                           "& .MuiAlert-icon": {
//                             fontSize: "16px",
//                             mr: "8px",
//                           },
//                         }}
//                         variant="filled"
//                         severity="error"
//                       >
//                         {templateNameError}
//                       </Alert>
//                     )}
//                   </Box>
//                   <Box mt={2}>
//                     <Box mt={2}>
                      // <ShortcodeTextField
                      //   label="Organizer name"
                      //   value={organizerName}
                      //   onChange={(e) => {
                      //     const { value, selectionStart } = e.target;
                      //     setOrganizerName(value);
                      //     setCursorPosition(selectionStart);
                      //   }}
                      //   onClick={(e) =>
                      //     setCursorPosition(e.target.selectionStart)
                      //   }
                      //   inputRef={textFieldRef}
                      //   placeholder="Organizer name"
                      //   error={!!organizerError}
                      //   helperText={organizerError}
                      //   shortcuts={filteredShortcuts}
                      //   showShortcutDropdown={showDropdown}
                      //   anchorElShortcut={anchorEl}
                      //   onToggleShortcutDropdown={toggleDropdown}
                      //   onCloseShortcutDropdown={handleCloseDropdown}
                      //   onAddShortcut={(shortcut) => {
                      //     const newText =
                      //       organizerName.slice(0, cursorPosition) +
                      //       `[${shortcut}]` +
                      //       organizerName.slice(cursorPosition);
                      //     setOrganizerName(newText);
                      //     setTimeout(() => {
                      //       if (textFieldRef.current) {
                      //         const newCursor =
                      //           cursorPosition + shortcut.length + 2;
                      //         textFieldRef.current.focus();
                      //         textFieldRef.current.setSelectionRange(
                      //           newCursor,
                      //           newCursor,
                      //         );
                      //         setCursorPosition(newCursor);
                      //       }
                      //     }, 0);
                      //   }}
                      // />
//                     </Box>
//                   </Box>
//                 </Box>
//                 {/* <Box
//                   className="organizer-container"
//                   sx={{
//                     display: "flex",
//                     marginTop: "40px",
//                     height: "auto",
//                     width: "100%",
//                     gap: 3,
//                   }}
//                 >
//                   <Box
//                     className="left-org-container"
//                     sx={{ padding: "10px", width: "30%", height: "auto", p: 2 }}
//                   >
//                     <Box>
//                       {sections.map((section, index) => (
//                         <SectionItem
//                           key={section.id}
//                           section={section}
//                           index={index}
//                           onClick={handleSectionClick}
//                           onDrop={moveSection}
//                           truncateText={truncateText}
//                           isSelected={selectedSection?.id === section.id}
//                         />
//                       ))}
//                     </Box>
//                     <Box
//                       sx={{ width: "50%", height: "25px", marginTop: "20px" }}
//                     >
//                       <Button variant="contained" onClick={addSection}>
//                         New section
//                       </Button>
//                     </Box>
//                   </Box>
//                   <Box
//                     className="right-container"
//                     sx={{ borderRadius: "20px", width: "70%", height: "auto" }}
//                   >
//                     {selectedSection && (
//                       <DndProvider backend={HTML5Backend}>
//                         <Section
//                           section={selectedSection}
//                           onDelete={handleDeleteSection}
//                           onUpdate={handleUpdateSection}
//                           onDuplicate={handleDuplicateSection}
//                           onSaveFormData={handleFormSave}
//                           onSaveSectionData={handleSectionSaveData}
//                           sections={sections}
//                         />
//                       </DndProvider>
//                     )}
//                   </Box>
//                 </Box> */}
//                 <Box
//   className="organizer-container"
//   sx={{
//     display: "flex",
//     flexDirection: { xs: "column", md: "row" },
//     gap: 3,
//     mt: 4,
//     width: "100%",
//   }}
// >
//   {/* LEFT PANEL */}
//   <Box
//     // className="left-org-container"
//     sx={{
//       width: { xs: "100%", md: "30%" },
//       bgcolor: "background.paper",
//       borderRadius: 3,
//       boxShadow: 2,
//       p: 2,
//       height: "fit-content",
//     }}
//   >
//     {/* Sections List */}
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//       {sections.map((section, index) => (
//         <SectionItem
//           key={section.id}
//           section={section}
//           index={index}
//           onClick={handleSectionClick}
//           onDrop={moveSection}
//           truncateText={truncateText}
//           isSelected={selectedSection?.id === section.id}
//         />
//       ))}
//     </Box>

//     {/* Add Section Button */}
//     <Box sx={{ mt: 3 }}>
//       <Button
//         variant="contained"
//         fullWidth
//         onClick={addSection}
//         sx={{
//           textTransform: "none",
//           borderRadius: 2,
//           fontWeight: 500,
//         }}
//       >
//         + New Section
//       </Button>
//     </Box>
//   </Box>

//   {/* RIGHT PANEL */}
//   <Box
//     className="right-container"
//     sx={{
//       width: { xs: "100%", md: "70%" },
//       bgcolor: "background.paper",
//       borderRadius: 3,
//       boxShadow: 2,
//       p: 2,
//       minHeight: "400px",
//     }}
//   >
//     {selectedSection ? (
//       <DndProvider backend={HTML5Backend}>
//         <Section
//           section={selectedSection}
//           onDelete={handleDeleteSection}
//           onUpdate={handleUpdateSection}
//           onDuplicate={handleDuplicateSection}
//           onSaveFormData={handleFormSave}
//           onSaveSectionData={handleSectionSaveData}
//           sections={sections}
//         />
//       </DndProvider>
//     ) : (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//           color: "text.secondary",
//           fontSize: "14px",
//         }}
//       >
//         Select a section to start editing
//       </Box>
//     )}
//   </Box>
// </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     gap: "10px",
//                     marginLeft: "10px",
//                     marginBottom: "20px",
//                     marginTop: "20px",
//                   }}
//                 >
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     onClick={saveandexitOrganizerTemp}
//                   >
//                     {mode === "edit" ? "Update & exit" : "Save & exit"}
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     onClick={saveOrganizerTemp}
//                   >
//                     {mode === "edit" ? "Update" : "Save"}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outlined"
//                     color="primary"
//                     onClick={handleCancel}
//                   >
//                     Cancel
//                   </Button>
//                 </Box>

//                 <OrganizerSettingsDrawer
//                   open={isDrawerOpen}
//                   onClose={handleDrawerClose}
//                   loginChecked={loginChecked}
//                   onLoginToggle={handleLoginToggle}
//                   notifyChecked={notifyChecked}
//                   onNotifyToggle={handleNotifyToggle}
//                   emailSyncChecked={emailSyncChecked}
//                   onEmailSyncToggle={handleEmailSyncToggle}
//                   autoSaveChecked={autoSaveChecked}
//                   onAutoSaveToggle={handleAutoSaveToggle}
//                   daysUntilNextReminder={daysUntilNextReminder}
//                   onDaysUntilNextReminderChange={setDaysUntilNextReminder}
//                   noOfReminder={noOfReminder}
//                   onNoOfReminderChange={setNoOfReminder}
//                 />

//                 <OrganizerPreview
//                   open={previewDialogOpen}
//                   onClose={handleClosePreview}
//                   organizerName={organizerName}
//                   sections={sections}
//                   shouldShowElement={shouldShowElement}
//                   stripHtmlTags={stripHtmlTags}
//                   visibleSections={visibleSections}
//                   activeStep={activeStep}
//                   totalSteps={totalSteps}
//                   onActiveStepChange={setActiveStep}
//                   answeredElements={answeredElements}
//                   radioValues={radioValues}
//                   checkboxValues={checkboxValues}
//                   selectedYesNoValues={selectedYesNoValues}
//                   selectedDropdownValues={selectedDropdownValues}
//                   inputValues={inputValues}
//                   startDate={startDate}
//                   onStartDateChange={handleStartDateChange}
//                   onRadioChange={handleRadioChange}
//                   onCheckboxChange={handleCheckboxChange}
//                   onYesNoChange={handleYesNoChange}
//                   onDropdownValueChange={handleDropdownValueChange}
//                   onInputChange={handleInputChange}
//                 />
//               </>
//             )}
//           </>
//         )}
//       </Box>
//     </DndProvider>
//   );
// };

// export default OrganizersTemp;

// {
//   /* <OrganizerPreview
//               open={previewDialogOpen}
//               onClose={handleClosePreview}
//               organizerData={previewData}
//             /> */
// }



import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Section from "./organizertempSection";
import { useToastContext } from "../../../context/ToastContext";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import debounce from "lodash.debounce";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  FormPage,
  FormSection,
  FormField,
  FormRow,
  FormGrid,
  FormDrawer,
  ShortcodePopover,
} from "../../../components/ui/form-layout";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import {
  GripVertical,
  Settings,
  Eye,
  Plus,
  X,
  Pencil,
  Trash2,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import { organizerAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import OrganizerSettingsDrawer from "./OrganizerSettingsDrawer";
import ShortcodeTextField from "../../../components/ShortcodeTextField";
import OrganizerPreview from "./OrganizerPreview";

// Section Item Component (Draggable)
const SectionItem = ({
  section,
  onClick,
  onDrop,
  index,
  truncateText,
  isSelected,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SECTION",
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: "SECTION",
    hover: (item) => {
      if (item.index !== index) {
        onDrop(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 mb-2 cursor-move transition-colors ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:bg-accent/50"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onClick(section)}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-sm truncate flex-1">
        {truncateText(section.text, 5)}
      </span>
    </div>
  );
};

const OrganizersTemp = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();
const {showToast} = useToastContext()
  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    setSections(newSections);
  };

  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + " ..";
    }
    return text;
  };

  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // New state for edit mode
  const [mode, setMode] = useState("create");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    if (selectedOption === "contacts" || selectedOption === "account") {
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
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };

  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);

  const handlejobName = (e) => {
    const { value, selectionStart } = e.target;
    setOrganizerName(value);
    setCursorPosition(selectionStart);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleAddShortcut = (shortcut) => {
    setOrganizerName((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText;
    });

    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);

    setShowDropdown(false);
  };

  const [templateName, setTemplateName] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionSaveData = (settings) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === selectedSection.id
          ? { ...section, sectionsettings: settings }
          : section
      )
    );
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      text: "",
      formElements: [],
      sectionSettings: {
        sectionRepeatingMode: false,
        buttonName: "",
        conditional: false,
        mode: "",
        conditions: [
          {
            question: "",
            answer: "",
          },
        ],
      },
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleDeleteSection = (id) => {
    const newSections = sections.filter((section) => section.id !== id);
    setSections(newSections);
    if (selectedSection && selectedSection.id === id) {
      setSelectedSection(null);
    }
  };

  const handleUpdateSection = (
    id,
    newText,
    newFormElements,
    newSectionSettings
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? {
              ...section,
              text: newText,
              formElements: newFormElements,
              sectionSettings: {
                ...section.sectionSettings,
                ...newSectionSettings,
              },
            }
          : section
      )
    );
  };

  const handleDuplicateSection = (sectionId) => {
    const sectionToDuplicate = sections.find(
      (section) => section.id === sectionId
    );

    if (sectionToDuplicate) {
      const newSectionId = Date.now();

      const duplicatedFormElements = sectionToDuplicate.formElements.map(
        (element) => ({
          ...element,
          id: Date.now() + Math.floor(Math.random() * 1000),
          sectionid: newSectionId,
        })
      );

      const duplicatedSection = {
        ...sectionToDuplicate,
        id: newSectionId,
        text: `${sectionToDuplicate.text} (Copy)`,
        formElements: duplicatedFormElements,
      };

      setSections([...sections, duplicatedSection]);
    }
  };

  const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] =
    useState(false);

  const handleCreateInvoiceClick = () => {
    resetForm();
    setMode("create");
    setCurrentTemplateId(null);
    setShowOrganizerTemplateForm(true);
  };

  const handleFormSave = (elementId, formData) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        formElements: section.formElements.map((el) =>
          el.id === elementId
            ? { ...el, questionsectionsettings: formData }
            : el
        ),
      }))
    );
  };

  const resetForm = () => {
    setTemplateName("");
    setOrganizerName("");
    setSections([]);
    setSelectedSection(null);
    setTemplateNameError("");
    setOrganizerError("");
    setIsFormDirty(false);
    setLoginChecked(false);
    setNotifyChecked(false);
    setAutoSaveChecked(false);
    setEmailSyncChecked(false);
    setNoOfReminder(1);
    setDaysUntilNextReminder(3);
    setActiveStep(0);
    setRadioValues({});
    setCheckboxValues({});
    setAnsweredElements({});
    setSelectedYesNoValues({});
    setInputValues({});
    setSelectedDropdownValues({});
    setRepeatedSections({});
    setPreviousVisibleSections([]);
  };

  const fetchTemplateForEdit = async (templateId) => {
    setLoadingTemplate(true);
    try {
      const response = await organizerAPI.getOrganizerTemplateById(templateId);
      const templateData = response.data.organizerTemplate;
      setTemplateName(templateData.templatename || "");
      setOrganizerName(templateData.organizerName || "");
      setSections(templateData.sections || []);
      setSelectedSection(templateData.sections?.[0] || null);

      if (templateData.organizersettings) {
        setLoginChecked(
          templateData.organizersettings.notifyaboutdocumentupload || false
        );
        setNotifyChecked(
          templateData.organizersettings.organizerselfservice || false
        );
        setEmailSyncChecked(
          templateData.organizersettings.automaticallysealaftersubmission ||
            false
        );
        setAutoSaveChecked(
          templateData.organizersettings.sendreminderstoclient || false
        );
        setDaysUntilNextReminder(
          templateData.organizersettings.daysuntilnextreminder || "3"
        );
        setNoOfReminder(templateData.organizersettings.numberofreminders || 1);
      }

      setMode("edit");
      setCurrentTemplateId(templateId);
      setShowOrganizerTemplateForm(true);
    } catch (error) {
      console.error("Error fetching template:", error);
     showToast({
  title: "Error",
  description: error.response?.data?.error || "Failed to load template data",
  type: "error",
});
    } finally {
      setLoadingTemplate(false);
    }
  };

  const saveandexitOrganizerTemp = async () => {
    if (!validateForm()) {
      return;
    }

    const organizersettings = {
      notifyaboutdocumentupload: loginChecked,
      organizerselfservice: notifyChecked,
      automaticallysealaftersubmission: emailSyncChecked,
      sendreminderstoclient: autoSaveChecked,
      daysuntilnextreminder: daysUntilNextReminder,
      numberofreminders: noOfReminder,
    };

    const requestData = {
      templatename: templateName,
      organizerName: organizerName,
      sections: sections.map((section) => ({
        name: section.text,
        text: section.text,
        id: section.id.toString(),
        sectionsettings: section.sectionsettings || {},
        formElements: section.formElements.map((element) => ({
          type: element.type,
          id: element.id,
          sectionid: element.sectionid,
          options: element.options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
          text: element.text,
          questionsectionsettings: element.questionsectionsettings || {},
        })),
      })),
      organizersettings: organizersettings,
      active: true,
    };

    try {
      let result;
      if (mode === "edit" && currentTemplateId) {
        result = await organizerAPI.updateOrganizerTemplate(
          currentTemplateId,
          requestData
        );
        if (result && result.status === 200) {
          showToast({
            title: "Success",
            description: "Organizer Template updated successfully",
            type: "success",
          });
          handleMenuClose();
          setShowOrganizerTemplateForm(false);
          resetForm();
          fetchOrganizerTemplates();
        } else {
          const errorMessage =
            result?.data?.error || "Failed to update Organizer Template";
          showToast({
            title: "Error",
            description: errorMessage,
            type: "error",
          });
        }
      } else {
        result = await organizerAPI.createOrganizerTemplate(requestData);
        if (result && result.status === 201) {
          showToast({
            title: "Success",
            description: "Organizer Template created successfully",
            type: "success",
          });
          handleMenuClose();
          setShowOrganizerTemplateForm(false);
          resetForm();
          fetchOrganizerTemplates();
        } else {
          const errorMessage =
            result?.data?.error || "Failed to create Organizer Template";
          showToast({
            title: "Error",
            description: errorMessage,
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        `${mode === "edit" ? "Failed to update" : "Failed to create"} Organizer Template`;
      showToast({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    }
  };

  const saveOrganizerTemp = async () => {
    if (!validateForm()) {
      return;
    }

    const organizersettings = {
      notifyaboutdocumentupload: loginChecked,
      organizerselfservice: notifyChecked,
      automaticallysealaftersubmission: emailSyncChecked,
      sendreminderstoclient: autoSaveChecked,
      daysuntilnextreminder: daysUntilNextReminder,
      numberofreminders: noOfReminder,
    };

    const requestData = {
      templatename: templateName,
      organizerName: organizerName,
      sections: sections.map((section) => ({
        name: section.text,
        text: section.text,
        id: section.id.toString(),
        sectionsettings: section.sectionsettings || {},
        formElements: section.formElements.map((element) => ({
          type: element.type,
          id: element.id,
          sectionid: element.sectionid,
          options: element.options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
          text: element.text,
          questionsectionsettings: element.questionsectionsettings || {},
        })),
      })),
      organizersettings: organizersettings,
      active: true,
    };

    try {
      let result;
      if (mode === "edit" && currentTemplateId) {
        result = await organizerAPI.updateOrganizerTemplate(
          currentTemplateId,
          requestData
        );
        if (result && result.status === 200) {
          showToast({
            title: "Success",
            description: "Organizer Template updated successfully",
            type: "success",
          });
          fetchOrganizerTemplates();
        } else {
          showToast({
            title: "Error",
            description: result?.data?.error || "Failed to update Organizer Template",
            type: "error",
          });
        }
      } else {
        result = await organizerAPI.createOrganizerTemplate(requestData);
        if (result && result.message === "Organizer Template created successfully") {
          showToast({
            title: "Success",
            description: "Organizer Template created successfully",
            type: "success",
          });
          fetchOrganizerTemplates();
        } else {
          showToast({
            title: "Error",
            description: result.error || "Failed to create Organizer Template",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        description: error.response?.data?.error || `${mode === "edit" ? "Failed to update" : "Failed to create"} Organizer Template`,
        type: "error",
      });
      
    }
  };

  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizerTemplates = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await organizerAPI.getOrganizerTemplates();
      setOrganizerTemplatesData(response?.data?.OrganizerTemplates || []);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      showToast({
        title: "Error",
        description: "Failed to fetch organizer templates",
        type: "error",
      });
      setOrganizerTemplatesData([]);
    } finally {
      await loaderDelay;
      setLoading(false);
    }
  };

  const handleEdit = (_id) => {
    fetchTemplateForEdit(_id);
  };

  const handleDelete = async (_id,organizerName) => {
    confirm({
      title: "Delete Organizer Template",
       description: (
        <>
          Are you sure you want to delete this orgnizer{" "}
          <span className="font-semibold text-red-600">
            "{organizerName}"
          </span>
          ?
        </>
      ),
      // description:
      //   "Are you sure you want to delete this organizer template? This action cannot be undone.",
      confirmText: "Delete",
      confirmColor: "error",
      onConfirm: async () => {
        try {
          const result = await organizerAPI.deleteOrganizerTemplate(_id);
          showToast({
            title: "Success",
            description: "Item deleted successfully",
            type: "success",
          });
          handleMenuClose();
          fetchOrganizerTemplates();
        } catch (error) {
          console.error(error);
          showToast({
            title: "Error",
            description: error.response?.data?.error || "Failed to delete item",
            type: "error",
          });
        }
      },
    });
  };

  useEffect(() => {
    fetchOrganizerTemplates();
  }, []);

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (event, _id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(_id);
    setTempIdGet(_id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setTempIdGet(null);
  };

  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleCancel = () => {
    setShowOrganizerTemplateForm(false);
    resetForm();
  };

  useEffect(() => {
    if (templateName || organizerName) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templateName, organizerName]);

  const [templateNameError, setTemplateNameError] = useState("");
  const [organizerError, setOrganizerError] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!templateName) {
      setTemplateNameError("Template name is required");
      isValid = false;
    } else {
      setTemplateNameError("");
    }

    if (!organizerName) {
      setOrganizerError("Organizer name is required");
      isValid = false;
    } else {
      setOrganizerError("");
    }
    return isValid;
  };

  const handleDuplicateTemplate = async (id) => {
    try {
      const res = await organizerAPI.duplicateOrganizerTemplate(id);
      showToast({
        title: "Success",
        description: "Template duplicated successfully",
        type: "success",
      });
      fetchOrganizerTemplates();
    } catch (error) {
      console.error("Duplicate failed:", error);
      showToast({
        title: "Error",
        description: "Failed to duplicate template",
        type: "error",
      });
    }
  };

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const handlePreview = () => {
    setPreviewDialogOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
  };

  const [startDate, setStartDate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

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

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});

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

  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});

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

  const [inputValues, setInputValues] = useState({});

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

  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});

  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
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

  const [repeatedSections, setRepeatedSections] = useState({});

  const shouldShowElement = useCallback(
    (element, sectionId) => {
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
          const numericCurrentSectionId =
            typeof sectionId === "string" ? Number(sectionId) : sectionId;

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
          const numericCurrentSectionId =
            typeof sectionId === "string" ? Number(sectionId) : sectionId;

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
          const numericCurrentSectionId =
            typeof sectionId === "string" ? Number(sectionId) : sectionId;

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
          const numericCurrentSectionId =
            typeof sectionId === "string" ? Number(sectionId) : sectionId;

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
    },
    [radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues]
  );

  const [previousVisibleSections, setPreviousVisibleSections] = useState([]);

  const clearSectionValues = useCallback((sectionId) => {
    setRadioValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setCheckboxValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedDropdownValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedYesNoValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setInputValues((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setAnsweredElements((prev) => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const [keySectionId] = key.split("_");
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });
  }, []);

  const checkSectionVisibility = useCallback(
    (section) => {
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
          const isRepeatedSection = Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId);

          if (!isRepeatedSection) {
            if (
              key.endsWith(`_${condition.question}`) &&
              radioValues[key] === condition.answer
            ) {
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
          const isRepeatedSection = Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId);

          if (!isRepeatedSection) {
            if (
              key.endsWith(`_${condition.question}`) &&
              checkboxValues[key]?.[condition.answer]
            ) {
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
          const isRepeatedSection = Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId);

          if (!isRepeatedSection) {
            if (
              key.endsWith(`_${condition.question}`) &&
              selectedDropdownValues[key] === condition.answer
            ) {
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
          const isRepeatedSection = Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId);

          if (!isRepeatedSection) {
            if (
              key.endsWith(`_${condition.question}`) &&
              selectedYesNoValues[key] === condition.answer
            ) {
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
    },
    [
      radioValues,
      checkboxValues,
      selectedDropdownValues,
      selectedYesNoValues,
      repeatedSections,
    ]
  );

  const shouldShowSection = useCallback(
    (section) => {
      const isCurrentlyVisible = checkSectionVisibility(section);
      return isCurrentlyVisible;
    },
    [checkSectionVisibility]
  );

  useEffect(() => {
    const currentlyVisible = sections.filter((section) =>
      shouldShowSection(section)
    );

    const hasChanged =
      currentlyVisible.length !== previousVisibleSections.length ||
      currentlyVisible.some(
        (section) =>
          !previousVisibleSections.some((prev) => prev.id === section.id)
      );

    if (hasChanged) {
      const sectionsToClear = previousVisibleSections.filter(
        (prevSection) =>
          !currentlyVisible.some(
            (currSection) => currSection.id === prevSection.id
          )
      );

      sectionsToClear.forEach((section) => {
        clearSectionValues(section.id);
      });

      setPreviousVisibleSections(currentlyVisible);
    }
  }, [
    sections,
    shouldShowSection,
    clearSectionValues,
    previousVisibleSections,
  ]);

  const getVisibleSections = useCallback(() => {
    return sections.filter((section) => shouldShowSection(section));
  }, [sections, shouldShowSection]);

  const visibleSections = useMemo(
    () => getVisibleSections(),
    [getVisibleSections]
  );
  const totalSteps = visibleSections.length;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const [loginChecked, setLoginChecked] = useState(false);
  const [notifyChecked, setNotifyChecked] = useState(false);
  const [emailSyncChecked, setEmailSyncChecked] = useState(false);
  const [autoSaveChecked, setAutoSaveChecked] = useState(false);

  const handleLoginToggle = (checked) => {
    setLoginChecked(checked);
  };

  const handleNotifyToggle = (checked) => {
    setNotifyChecked(checked);
  };

  const handleEmailSyncToggle = (checked) => {
    setEmailSyncChecked(checked);
  };

  const handleAutoSaveToggle = (checked) => {
    setAutoSaveChecked(checked);
  };

  const [daysUntilNextReminder, setDaysUntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrganizers = Array.isArray(organizerTemplatesData)
    ? organizerTemplatesData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : [];

  const checkTemplateName = async (name) => {
    try {
      const res = await organizerAPI.checkTemplateNameExists(name);
      if (mode === "edit" && currentTemplateId) {
        const originalTemplate = organizerTemplatesData.find(
          (t) => t._id === currentTemplateId
        );
        if (originalTemplate && originalTemplate.templatename === name) {
          setTemplateNameError("");
          return;
        }
      }
      if (res.data.exists) {
        setTemplateNameError("Template name already exists");
      } else {
        setTemplateNameError("");
      }
    } catch (err) {
      console.error(err);
      setTemplateNameError("");
    }
  };

  const debouncedCheck = useMemo(
    () =>
      debounce((name) => {
        if (name.trim()) checkTemplateName(name);
        else setTemplateNameError("");
      }, 500),
    [mode, currentTemplateId, organizerTemplatesData]
  );

  useEffect(() => {
    debouncedCheck(templateName);
    return () => {
      debouncedCheck.cancel();
    };
  }, [templateName, debouncedCheck]);

  const organizerColumns = useMemo(
    () => [
      {
        accessorKey: "templatename",
        header: "Template Name",
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
        id: "usedInPipelines",
        header: "Used in Pipelines",
        cell: () => <span className="text-sm text-muted-foreground">—</span>,
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
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
              onClick={() => handleDuplicateTemplate(row.original._id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              title="Duplicate"
            >
              <ClipboardList className="h-3.5 w-3.5" />
            </button>
            <button
              // onClick={() => handleDelete(row.original._id)}
                onClick={() =>
    handleDelete(row.original._id, row.original.templatename)
  }
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        {!showOrganizerTemplateForm && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button size="sm" onClick={handleCreateInvoiceClick}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Template
              </Button>
            </div>
            <DataTableToolbar
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
            />
            <DataTable
              columns={organizerColumns}
              data={organizerTemplatesData}
              loading={loading}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              enableRowSelection={false}
              getRowId={(row) => row._id}
              emptyMessage="No organizer templates found"
              emptyDescription="Create your first organizer template to get started"
              pageSize={30}
            />
          </div>
        )}

        {showOrganizerTemplateForm && (
          <>
            {loadingTemplate ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <>
                <FormPage
                  title={mode === "edit" ? "Edit Template" : "Create Template"}
                  subtitle="Customize your organizer template"
                  actions={
                    <>
                      <button
                        type="button"
                        onClick={handlePreview}
                        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={handleDrawerOpen}
                        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Setting
                      </button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button variant="secondary" onClick={saveOrganizerTemp}>
                        {mode === "edit" ? "Update" : "Save"}
                      </Button>
                      <Button onClick={saveandexitOrganizerTemp}>
                        {mode === "edit" ? "Update & exit" : "Save & exit"}
                      </Button>
                    </>
                  }
                >
                  <FormSection title="General">
                    <FormField
                      label="Template Name"
                      error={templateNameError}
                      required
                    >
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template name"
                        error={!!templateNameError}
                      />
                      {templateNameError && (
                        <p className="text-sm text-destructive mt-1">
                          {templateNameError}
                        </p>
                      )}
                    </FormField>

                    <FormField  error={organizerError} required>
                                            <ShortcodeTextField
                        label="Organizer name"
                        value={organizerName}
                        onChange={(e) => {
                          const { value, selectionStart } = e.target;
                          setOrganizerName(value);
                          setCursorPosition(selectionStart);
                        }}
                        onClick={(e) =>
                          setCursorPosition(e.target.selectionStart)
                        }
                        inputRef={textFieldRef}
                        placeholder="Organizer name"
                        error={!!organizerError}
                        helperText={organizerError}
                        shortcuts={filteredShortcuts}
                        showShortcutDropdown={showDropdown}
                        anchorElShortcut={anchorEl}
                        onToggleShortcutDropdown={toggleDropdown}
                        onCloseShortcutDropdown={handleCloseDropdown}
                        onAddShortcut={(shortcut) => {
                          const newText =
                            organizerName.slice(0, cursorPosition) +
                            `[${shortcut}]` +
                            organizerName.slice(cursorPosition);
                          setOrganizerName(newText);
                          setTimeout(() => {
                            if (textFieldRef.current) {
                              const newCursor =
                                cursorPosition + shortcut.length + 2;
                              textFieldRef.current.focus();
                              textFieldRef.current.setSelectionRange(
                                newCursor,
                                newCursor,
                              );
                              setCursorPosition(newCursor);
                            }
                          }, 0);
                        }}
                      />
                    </FormField>

                   
                  </FormSection>

                  {/* Sections Builder */}
                  <div className="flex flex-col md:flex-row gap-6 mt-6">
                    {/* Left: Section list */}
                    <div className="w-full md:w-[30%] space-y-2">
                      <FormSection title="Sections">
                        {sections.map((section, index) => (
                          <SectionItem
                            key={section.id}
                            section={section}
                            index={index}
                            onClick={handleSectionClick}
                            onDrop={moveSection}
                            truncateText={truncateText}
                            isSelected={selectedSection?.id === section.id}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSection}
                          className="mt-3 w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New section
                        </Button>
                      </FormSection>
                    </div>

                    {/* Right: Section editor */}
                    <div className="w-full md:w-[70%]">
                      {selectedSection ? (
                        <DndProvider backend={HTML5Backend}>
                          <Section
                            section={selectedSection}
                            onDelete={handleDeleteSection}
                            onUpdate={handleUpdateSection}
                            onDuplicate={handleDuplicateSection}
                            onSaveFormData={handleFormSave}
                            onSaveSectionData={handleSectionSaveData}
                            sections={sections}
                          />
                        </DndProvider>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm border rounded-lg bg-muted/20">
                          Select a section to start editing
                        </div>
                      )}
                    </div>
                  </div>
                </FormPage>

                {/* Settings Drawer */}
                {/* Settings Drawer */}
{isDrawerOpen && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    <div 
      className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
      onClick={handleDrawerClose} 
    />
    <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <h2 className="text-base font-semibold text-foreground">
          Organizer Settings
        </h2>
        <button 
          onClick={handleDrawerClose} 
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Notify about document upload</Label>
            <Switch
              checked={loginChecked}
              onCheckedChange={handleLoginToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Organizer self service</Label>
            <Switch
              checked={notifyChecked}
              onCheckedChange={handleNotifyToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              Automatically seal after submission
            </Label>
            <Switch
              checked={emailSyncChecked}
              onCheckedChange={handleEmailSyncToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Send reminders to clients</Label>
            <Switch
              checked={autoSaveChecked}
              onCheckedChange={handleAutoSaveToggle}
            />
          </div>
          {autoSaveChecked && (
            <div className="space-y-4 pl-1 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Days until next reminder</Label>
                  <Input
                    value={daysUntilNextReminder}
                    onChange={(e) => setDaysUntilNextReminder(e.target.value)}
                    placeholder="Days until next reminder"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">No. of reminders</Label>
                  <Input
                    value={noOfReminder}
                    onChange={(e) => setNoOfReminder(e.target.value)}
                    placeholder="No. of reminders"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
        <button
          onClick={handleDrawerClose}
          className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDrawerClose}
          className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

                {/* Preview Dialog */}
                <OrganizerPreview
                  open={previewDialogOpen}
                  onClose={handleClosePreview}
                  organizerName={organizerName}
                  sections={sections}
                  shouldShowElement={shouldShowElement}
                  stripHtmlTags={stripHtmlTags}
                  visibleSections={visibleSections}
                  activeStep={activeStep}
                  totalSteps={totalSteps}
                  onActiveStepChange={setActiveStep}
                  answeredElements={answeredElements}
                  radioValues={radioValues}
                  checkboxValues={checkboxValues}
                  selectedYesNoValues={selectedYesNoValues}
                  selectedDropdownValues={selectedDropdownValues}
                  inputValues={inputValues}
                  startDate={startDate}
                  onStartDateChange={handleStartDateChange}
                  onRadioChange={handleRadioChange}
                  onCheckboxChange={handleCheckboxChange}
                  onYesNoChange={handleYesNoChange}
                  onDropdownValueChange={handleDropdownValueChange}
                  onInputChange={handleInputChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </DndProvider>
  );
};

export default OrganizersTemp;
