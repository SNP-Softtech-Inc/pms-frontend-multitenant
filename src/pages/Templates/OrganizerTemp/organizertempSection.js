// import React, { useState, useEffect, useRef } from "react";
// import { HiOutlineDuplicate } from "react-icons/hi";
// import { RiDeleteBinLine } from "react-icons/ri";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import {
//   Box,
//   TextField,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
//   Input,
//   Typography,
//   Drawer,
//   Divider,
//   Switch,
//   FormControlLabel,
//   Autocomplete,
//   Paper,Grid,Tooltip,Stack,Chip,CardContent,InputAdornment,Card,Radio,Checkbox
// } from "@mui/material";
// import AddIcon from '@mui/icons-material/Add';
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css"; // Quill Snow theme
// import "quill-emoji/dist/quill-emoji.css"; // Emoji styles
// import Quill from "quill";
// import "quill-emoji";
// import { useDrag, useDrop } from "react-dnd";
// import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import { IoSettingsOutline } from "react-icons/io5";
// import { IoMdClose } from "react-icons/io";
// Quill.register("modules/emoji", require("quill-emoji"));

// const ItemTypes = {
//   QUESTION: "question",
//   OPTION: "option",
// };

// const DraggableQuestion = ({ id, index, moveQuestion, children }) => {
//   const ref = useRef(null);

//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.QUESTION,
//     item: { id, index },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.QUESTION,
//     hover(item, monitor) {
//       if (!ref.current) return;
//       const dragIndex = item.index;
//       const hoverIndex = index;

//       if (dragIndex === hoverIndex) return;

//       const hoverBoundingRect = ref.current?.getBoundingClientRect();
//       const hoverMiddleY =
//         (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY = clientOffset.y - hoverBoundingRect.top;

//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

//       moveQuestion(dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });

//   drag(drop(ref));

//   return (
//     <div
//       ref={ref}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         cursor: "move",
//         padding: "8px",
//         marginBottom: "8px",
//         backgroundColor: "#fff",
//         border: isDragging ? "2px dashed #1976d2" : "1px solid #ddd",
//         borderRadius: "4px",
//         display: "flex",
//         // alignItems: 'center'
//       }}
//     >
//       <DragIndicatorIcon style={{ cursor: "move", marginRight: "8px" }} />
//       {children}
//     </div>
//   );
// };

// const DraggableOption = ({ id, index, moveOption, children, elementId }) => {
//   const ref = useRef(null);

//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.OPTION,
//     item: { id, index, elementId },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.OPTION,
//     hover(item, monitor) {
//       if (!ref.current) return;
//       if (item.elementId !== elementId) return;

//       const dragIndex = item.index;
//       const hoverIndex = index;

//       if (dragIndex === hoverIndex) return;

//       const hoverBoundingRect = ref.current?.getBoundingClientRect();
//       const hoverMiddleY =
//         (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY = clientOffset.y - hoverBoundingRect.top;

//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

//       moveOption(elementId, dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });

//   drag(drop(ref));

//   return (
//     <div
//       ref={ref}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         cursor: "move",
//         display: "flex",
//         alignItems: "center",
//         marginBottom: "8px",
//       }}
//     >
//       <DragIndicatorIcon style={{ cursor: "move", marginRight: "8px" }} />
//       {children}
//     </div>
//   );
// };
// const Section = ({
//   sections,
//   section,
//   onDelete,
//   onUpdate,
//   onDuplicate,
//   onSaveFormData,
//   onSaveSectionData,
// }) => {
//   const [text, setText] = useState(section.text);
//   const [formElements, setFormElements] = useState(section.formElements || []);
//   const [isDrawerOpen, setDrawerOpen] = useState(false);
//   const [queDrawerOpen, setQueDrawerOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [repeateButton, setRepeateButton] = useState(false);
//   const [conditionButton, setConditionButton] = useState(false);
//   const [prefilledButton, setPrefilledButton] = useState(false);
//   const [descriptionButton, setDescriptionButton] = useState(false);
//   const [descriptionText, setDescriptionText] = useState("");
//   const [mode, setMode] = useState("Any");
//   const [sectionMode, setSectionMode] = useState("Any");
//   const [repeatButtonName, setRepeatButtonName] = useState("Repeat Section");
//   const [queConditionButton, setQueConditionButton] = useState(false);
//   const [questionAnswers, setQuestionAnswers] = useState([
//     { question: "", questionId: null, answer: "", optionvalue: false },
//   ]);
//   const [requiredButton, setRequiredButton] = useState(false);
//   const [sectionQuestionAnswers, setSectionQuestionAnswers] = useState([
//     { question: "", questionId: null, answer: "", optionvalue: false },
//   ]);
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [sectionConditionBadge, setSectionConditionBadge] = useState(false);
//   const [questionsAnswersMap, setQuestionsAnswersMap] = useState({});
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [selectedSectionData, setSelectedSectionData] = useState(null);
//   const [selectedQuestions, setSelectedQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState([]);
//   const [selectedSectionQuestions, setSelectedSectionQuestions] = useState([]);
//   const [selectedSectionAnswers, setSelectedSectionAnswers] = useState([]);

//   // Quill editor modules and formats
//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       [{ header: "1" }, { header: "2" }, { align: [] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ script: "sub" }, { script: "super" }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ color: [] }, { background: [] }],
//       ["blockquote", "code-block"],
//       ["link", "image"],
//       [{ emoji: true }],
//       [{ indent: "-1" }, { indent: "+1" }],
//       ["clean"],
//       ["undo", "redo"],
//     ],
//     history: {
//       delay: 1000,
//       maxStack: 50,
//       userOnly: true,
//     },
//     "emoji-toolbar": true,
//     "emoji-textarea": false,
//     "emoji-shortname": true,
//   };

//   const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "script",
//     "list",
//     "bullet",
//     "indent",
//     "color",
//     "background",
//     "align",
//     "blockquote",
//     "code-block",
//     "link",
//     "image",
//     "undo",
//     "redo",
//     "emoji",
//   ];

//   // Move question handler
//   const moveQuestion = (dragIndex, hoverIndex) => {
//     const draggedItem = formElements[dragIndex];
//     const newFormElements = [...formElements];
//     newFormElements.splice(dragIndex, 1);
//     newFormElements.splice(hoverIndex, 0, draggedItem);
//     setFormElements(newFormElements);
//     onUpdate(section.id, text, newFormElements);
//   };

//   // Move option handler
//   const moveOption = (elementId, dragIndex, hoverIndex) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId && element.options) {
//         const draggedOption = element.options[dragIndex];
//         const newOptions = [...element.options];
//         newOptions.splice(dragIndex, 1);
//         newOptions.splice(hoverIndex, 0, draggedOption);
//         return { ...element, options: newOptions };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   // Section save handler
//   const handleSectionSave = () => {
//     const sectionsettings = {
//       sectionRepeatingMode: repeateButton,
//       buttonName: repeateButton ? repeatButtonName : "",
//       conditional: conditionButton,
//       mode: sectionMode,
//       conditions: conditionButton
//         ? sectionQuestionAnswers.map((qa, index) => ({
//             question: selectedSectionQuestions[index]?.text || "",
//             questionId: selectedSectionQuestions[index]?.id || null,
//             answer: selectedSectionAnswers[index] || "",
//             optionvalue: false,
//           }))
//         : [],
//     };

//     if (onSaveSectionData) {
//       onSaveSectionData(sectionsettings);
//       setSectionConditionBadge(sectionsettings.conditional);
//       toggleDrawer(false);
//       setRepeateButton(false);
//       setRepeatButtonName("");
//       setConditionButton(false);
//       setSectionMode("");
//       setSelectedSectionQuestions([]);
//       setSelectedSectionAnswers([]);
//       setSectionQuestionAnswers([]);
//     }
//   };

//   // Clear form handler
//   const clearForm = () => {
//     setRequiredButton(false);
//     setPrefilledButton(false);
//     setQueConditionButton(false);
//     setDescriptionButton(false);
//     setDescriptionText("");
//     setSelectedQuestions([]);
//     setSelectedAnswers([]);
//     setMode("Any");
//     setQuestionAnswers([]);
//   };

//   // Save form element handler
//   const handleSave = () => {
//     if (selectedElement) {
//       const formData = {
//         required: requiredButton,
//         prefilled: prefilledButton,
//         conditional: queConditionButton,
//         mode: mode,
//         conditions: queConditionButton
//           ? questionAnswers.map((qa, index) => ({
//               question: selectedQuestions[index]?.text || "",
//               questionId: selectedQuestions[index]?.id || null,
//               answer: selectedAnswers[index] || "",
//               optionvalue: false,
//             }))
//           : [],
//         descriptionEnabled: descriptionButton,
//         description: descriptionButton ? descriptionText : "",
//       };

//       setQuestionsAnswersMap((prev) => ({
//         ...prev,
//         [selectedElement.id]: {
//           questionAnswers: questionAnswers,
//           description: descriptionText,
//         },
//       }));

//       onSaveFormData(selectedElement.id, formData);

//       const updatedFormElements = formElements.map((element) =>
//         element.id === selectedElement.id
//           ? { ...element, questionsectionsettings: formData }
//           : element
//       );
//       setFormElements(updatedFormElements);
//       clearForm();
//       setQueDrawerOpen(false);
//     }
//   };

//   // Effect for selected element
//   useEffect(() => {
//     if (selectedElement) {
//       const { questionsectionsettings } = selectedElement;
//       setRequiredButton(questionsectionsettings?.required || false);
//       setPrefilledButton(questionsectionsettings?.prefilled || false);
//       setQueConditionButton(questionsectionsettings?.conditional || false);
//       setDescriptionButton(questionsectionsettings?.descriptionEnabled || false);
//       setDescriptionText(questionsectionsettings?.description || "");
//       setMode(questionsectionsettings?.mode || "Any");

//       const conditions = questionsectionsettings?.conditions || [];
//       const questions = conditions.map(
//         (cond) => formElements.find((el) => el.id === cond.questionId) || null
//       );
//       const answers = conditions.map((cond) => cond.answer || null);

//       setQuestionAnswers(conditions);
//       setSelectedQuestions(questions);
//       setSelectedAnswers(answers);
//     }
//   }, [selectedElement, formElements]);

//   // Effect for section
//   useEffect(() => {
//     setSectionConditionBadge(section?.sectionsettings?.conditional);
//   }, [section]);

//   // Effect for text and form elements
//   useEffect(() => {
//     setText(section.text);
//     setFormElements(section.formElements);
//   }, [section]);

//   // Handlers
//   const handleRequiredButton = (checked) => setRequiredButton(checked);
//   const handleDescriptionButton = (checked) => setDescriptionButton(checked);
//   const handlePrefilledButton = (checked) => setPrefilledButton(checked);
//   const handleRepeateButton = (checked) => setRepeateButton(checked);
//   const handleConditionButton = (checked) => setConditionButton(checked);
//   const handleQueConditionButton = (checked) => setQueConditionButton(checked);

//   const handleAddQuestionAnswer = () => {
//     setQuestionAnswers([
//       ...questionAnswers,
//       { question: "", questionId: null, answer: "", optionvalue: false },
//     ]);
//   };

//   const handleAddSectionQuestionAnswer = () => {
//     setSectionQuestionAnswers([
//       ...sectionQuestionAnswers,
//       { question: "", questionId: null, answer: "", optionvalue: false },
//     ]);
//   };

//   const handleRemoveQuestionAnswer = (index) => {
//     const updatedList = questionAnswers.filter((_, i) => i !== index);
//     setQuestionAnswers(updatedList);
//     const updatedSectionList = sectionQuestionAnswers.filter(
//       (_, i) => i !== index
//     );
//     setSectionQuestionAnswers(updatedSectionList);
//   };

//   const handleSectionSettingsClick = () => {
//     const updatedSection = sections.find((sec) => sec.id === section.id);
//     toggleDrawer(true);
//     if (updatedSection && updatedSection.sectionsettings) {
//       setSelectedSectionData(updatedSection);
//       setSelectedSectionId(updatedSection.id);
//       setRepeateButton(updatedSection.sectionsettings.sectionRepeatingMode || false);
//       setRepeatButtonName(updatedSection.sectionsettings.buttonName || "Repeat Section");
//       setConditionButton(updatedSection.sectionsettings.conditional || false);
//       setSectionMode(updatedSection.sectionsettings.mode || "Any");
      
//       const conditions = updatedSection.sectionsettings.conditions || [];
//       setSectionQuestionAnswers(conditions);
//       const questions = conditions.map(
//         (cond) => getAllQuestions().find((q) => q.id === cond.questionId) || null
//       );
//       const answers = conditions.map((cond) => cond.answer || null);
//       setSelectedSectionQuestions(questions);
//       setSelectedSectionAnswers(answers);
//     }
//   };

//   const toggleDrawer = (open) => setDrawerOpen(open);

//   const getAllQuestions = () => {
//     return sections.flatMap((section) =>
//       section.formElements.filter(
//         (element) =>
//           element.type === "Radio Buttons" ||
//           element.type === "Checkboxes" ||
//           element.type === "Dropdown"
//       )
//     );
//   };

//   const getAllQuestionsGrouped = () => {
//     const allQuestions = [];
//     sections.forEach((section) => {
//       const sectionQuestions = section.formElements.filter(
//         (element) =>
//           element.type === "Radio Buttons" ||
//           element.type === "Checkboxes" ||
//           element.type === "Dropdown"
//       );
//       sectionQuestions.forEach((question) => {
//         allQuestions.push({
//           ...question,
//           sectionName: section.text || `Section ${section.id}`,
//           sectionId: section.id
//         });
//       });
//     });
//     return allQuestions;
//   };

//   const handleSettingsClick = (elementId) => {
//     const updatedElement = formElements.find(
//       (element) => element.id === elementId
//     );
//     if (updatedElement) {
//       setSelectedElement(updatedElement);
//       setQueDrawerOpen(true);
//     }
//   };

//   const handleDelete = () => onDelete(section.id);
//   const handleDuplicate = () => onDuplicate(section.id);
  
//   const handleTextChange = (event) => {
//     const newText = event.target.value;
//     setText(newText);
//     onUpdate(section.id, newText, formElements);
//   };

//   const handleAddFormElement = (type) => {
//     const newElement = {
//       type,
//       id: Date.now(),
//       sectionid: section.id,
//       options: [],
//       text: "",
//       questionsectionsettings: {
//         required: false,
//         prefilled: false,
//         conditional: false,
//         mode: "",
//         conditions: [{ question: "", questionId: null, answer: "", optionvalue: false }],
//         descriptionEnabled: false,
//         description: "",
//       },
//     };
//     const updatedFormElements = [...formElements, newElement];
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//     setAnchorEl(null);
//   };

//   const handleDeleteFormElement = (id) => {
//     const updatedFormElements = formElements.filter(
//       (element) => element.id !== id
//     );
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleAddOption = (elementId) => {
//     const newOption = { id: Date.now(), text: "" };
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, options: [...(element.options || []), newOption] };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleOptionChange = (elementId, optionId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         const updatedOptions = element.options.map((option) => {
//           if (option.id === optionId) {
//             return { ...option, text: newText };
//           }
//           return option;
//         });
//         return { ...element, options: updatedOptions };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleDeleteOption = (elementId, optionId) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         const updatedOptions = element.options.filter(
//           (option) => option.id !== optionId
//         );
//         return { ...element, options: updatedOptions };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleCheckboxTextChange = (elementId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, text: newText };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleElementTextChange = (elementId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, text: newText };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleQuillChange = (elementId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, text: newText };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleQuestionSelect = (value, index) => {
//     const allQuestions = getAllQuestionsGrouped();
//     const selectedQuestion = allQuestions.find((q) => q.id === value?.id);
//     const updatedQuestions = [...selectedQuestions];
//     updatedQuestions[index] = selectedQuestion;
//     setSelectedQuestions(updatedQuestions);
//     const updatedAnswers = [...selectedAnswers];
//     updatedAnswers[index] = null;
//     setSelectedAnswers(updatedAnswers);
//   };

//   const handleSectionQuestionSelect = (value, index) => {
//     const allQuestions = getAllQuestionsGrouped();
//     const selectedQuestion = allQuestions.find((q) => q.id === value?.id);
//     const updatedQuestions = [...selectedSectionQuestions];
//     updatedQuestions[index] = selectedQuestion;
//     setSelectedSectionQuestions(updatedQuestions);
//     const updatedAnswers = [...selectedSectionAnswers];
//     updatedAnswers[index] = null;
//     setSelectedSectionAnswers(updatedAnswers);
//   };

//   const getAnswerOptions = (questionElement) => {
//     if (!questionElement) return [];
//     return questionElement.options?.map((option) => option.text) || [];
//   };

//   // Render options for radio, checkbox, dropdown
//   const renderOptions = (element, type = "text") => {
//     return (
//       <Box sx={{ mt: 2 }}>
//         {element.options &&
//           element.options.map((option, index) => (
//             <DraggableOption
//               key={option.id}
//               id={option.id}
//               index={index}
//               moveOption={moveOption}
//               elementId={element.id}
//             >
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                 {/* <DragIndicatorIcon sx={{ cursor: 'grab', color: 'grey.500' }} /> */}
//                 {type === "radio" ? (
//                   <Radio disabled size="small" />
//                 ) : type === "checkbox" ? (
//                   <Checkbox disabled size="small" />
//                 ) : type === "Yes/No" ? (
//                   <Radio disabled size="small" />
//                 ) : null}
//                 <TextField
//                   variant="outlined"
//                   placeholder="Option"
//                   value={option.text}
//                   size="small"
//                   fullWidth
//                   onChange={(e) =>
//                     handleOptionChange(element.id, option.id, e.target.value)
//                   }
//                 />
//                 <IconButton
//                   size="small"
//                   onClick={() => handleDeleteOption(element.id, option.id)}
//                 >
//                   <RiDeleteBinLine />
//                 </IconButton>
//               </Box>
//             </DraggableOption>
//           ))}
//         <Button
//           variant="outlined"
//           size="small"
//           startIcon={<AddIcon />}
//           onClick={() => handleAddOption(element.id)}
//           sx={{ mt: 1 }}
//         >
//           Add Option
//         </Button>
//       </Box>
//     );
//   };

//   // Render form element based on type
//   const renderFormElement = (element) => {
//     const commonElementProps = {
//       key: element.id,
//       sx: { mb: 2, width:"100%" }
//     };

//     const commonTextFieldProps = {
//       variant: "outlined",
//       value: element.text,
//       size: "small",
//       fullWidth: true,
//       // sx: { backgroundColor: "#fff" },
//       onChange: (e) => handleElementTextChange(element.id, e.target.value),
//     };


//     const actionButtons = (
//       <Box sx={{ display: 'flex', gap: 0.5 }}>
//         <Tooltip title="Settings">
//           <IconButton size="small" onClick={() => handleSettingsClick(element.id)}>
//             <IoSettingsOutline fontSize="small" />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Delete">
//           <IconButton size="small" onClick={() => handleDeleteFormElement(element.id)}>
//             <RiDeleteBinLine fontSize="small" />
//           </IconButton>
//         </Tooltip>
//       </Box>
//     );

//   const elementHeader = (label, element = {}) => (
//   <Box
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between", // 🔥 key change
//       mb: 0.5,
//       width: "100%",
//     }}
//   >
//     {/* LEFT SIDE (Label) */}
//     <Typography variant="caption" color="text.secondary">
//       {label}
//     </Typography>

//     {/* RIGHT SIDE (Badges) */}
//     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//       {element?.questionsectionsettings?.conditional && (
//         <Chip label="Conditional" size="small" color="success" />
//       )}

//       {element?.questionsectionsettings?.required && (
//         <Typography sx={{ color: "error.main", fontWeight: 500 }}>
//           *
//         </Typography>
//       )}
//     </Box>
//   </Box>
// );

//     switch (element.type) {
//       case "Free Entry":
//         return (
//           <Box {...commonElementProps}>
//             {elementHeader("Free Entry",element)}
//             <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//               <TextField
//                 {...commonTextFieldProps}
//                 placeholder="Free Entry"
                
//               />
//               {actionButtons}
//             </Box>
//           </Box>
//         );

//       case "Email":
//         return (
//           <Box {...commonElementProps}>
//             {elementHeader("Email",element)}
//             <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//               <TextField
//                 {...commonTextFieldProps}
//                 placeholder="Email"
//                 type="email"
                
//               />
//               {actionButtons}
//             </Box>
//           </Box>
//         );

//       case "Number":
//         return (
//           <Box {...commonElementProps}>
//             {elementHeader("Number",element)}
//             <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//               <TextField
//                 {...commonTextFieldProps}
//                 placeholder="Number"
//                 // type="number"
                
//               />
//               {actionButtons}
//             </Box>
//           </Box>
//         );

//       case "Date":
//         return (
//           <Box {...commonElementProps} >
//             {elementHeader("Date",element)}
//             <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//               <TextField
//                 {...commonTextFieldProps}
//                 placeholder="Date"
//                 // type="date"
//                 InputLabelProps={{ shrink: true }}
                
//               />
//               {actionButtons}
//             </Box>
//           </Box>
//         );

//       case "Radio Buttons":
//         return (
//           <Card variant="outlined" sx={{ mb: 2, p: 1 ,width:"100%"}}>
//             <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
//               {elementHeader("Radio Button",element)}
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//                 <TextField
//                   {...commonTextFieldProps}
//                   placeholder="Radio Buttons"
                  
//                 />
//                 {actionButtons}
//               </Box>
//               {renderOptions(element, "radio")}
//             </CardContent>
//           </Card>
//         );

//       case "Checkboxes":
//         return (
//           <Card variant="outlined" sx={{ mb: 2, p: 1,width:"100%" }}>
//             <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
//               {elementHeader("Checkbox",element)}
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//                 <TextField
//                   {...commonTextFieldProps}
//                   placeholder="Checkboxes"
//                   onChange={(e) =>
//                     handleCheckboxTextChange(element.id, e.target.value)
//                   }
                  
//                 />
//                 {actionButtons}
//               </Box>
//               {renderOptions(element, "checkbox")}
//             </CardContent>
//           </Card>
//         );

//       case "Dropdown":
//         return (
//           <Card variant="outlined" sx={{ mb: 2, p: 1 ,width:"100%"}}>
//             <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
//               {elementHeader("Dropdown",element)}
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//                 <TextField
//                   {...commonTextFieldProps}
//                   placeholder="Dropdown"
//                   onChange={(e) =>
//                     handleCheckboxTextChange(element.id, e.target.value)
//                   }
                  
//                 />
//                 {actionButtons}
//               </Box>
//               {renderOptions(element)}
//             </CardContent>
//           </Card>
//         );

//       case "Yes/No":
//         return (
//           <Card variant="outlined" sx={{ mb: 2, p: 1,width:"100%" }}>
//             <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
//               {elementHeader("Yes/No",element)}
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//                 <TextField
//                   {...commonTextFieldProps}
//                   placeholder="Yes/No"
                  
//                 />
//                 {actionButtons}
//               </Box>
//               {renderOptions(element, "Yes/No")}
//             </CardContent>
//           </Card>
//         );

//       case "File Upload":
//         return (
//           <Card variant="outlined" sx={{ mb: 2, p: 1,width:"100%" }}>
//             <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
//               {elementHeader("File Upload",element)}
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//                 <TextField
//                   {...commonTextFieldProps}
//                   placeholder="File Upload"
                  
//                 />
//                 {actionButtons}
//               </Box>
//               <Button
//                 component="label"
//                 variant="outlined"
//                 disabled
//                 startIcon={<CloudUploadIcon />}
//                 sx={{ mt: 1 }}
//               >
//                 Upload files
//               </Button>
//             </CardContent>
//           </Card>
//         );

//       case "Text Editor":
//         return (
//           <Box sx={{ mt: 2, mb: 2 }}>
//             <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//               <Box sx={{ flex: 1 }}>
//                 <ReactQuill
//                   theme="snow"
//                   value={element.text}
//                   modules={modules}
//                   formats={formats}
//                   onChange={(newText) => handleQuillChange(element.id, newText)}
//                   style={{ height: '200px', marginBottom: '50px' }}
//                 />
//               </Box>
//               {actionButtons}
//             </Box>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Card 
//       variant="outlined" 
    
//     >
//       <CardContent>
//         {/* Section Header */}
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
//           <Box sx={{ flex: 1, mr: 2 }}>
//             <TextField
//               variant="outlined"
//               fullWidth
//               value={text}
//               size="small"
//               onChange={handleTextChange}
//               placeholder="Section text"
//               sx={{ backgroundColor: '#fafafa' }}
//             />
//           </Box>
          
//           {sectionConditionBadge && (
//             <Chip
//               label="Conditional"
//               color="success"
//               size="small"
//               sx={{ mr: 1 }}
//             />
//           )}
          
//           <Box sx={{ display: "flex", gap: 0.5 }}>
//             <Tooltip title="Duplicate Section">
//               <IconButton size="small" onClick={handleDuplicate}>
//                 <HiOutlineDuplicate />
//               </IconButton>
//             </Tooltip>
            
//             <Tooltip title="Section Settings">
//               <IconButton size="small" onClick={handleSectionSettingsClick}>
//                 <IoSettingsOutline />
//               </IconButton>
//             </Tooltip>
            
//             <Tooltip title="Delete Section">
//               <IconButton size="small" onClick={handleDelete}>
//                 <RiDeleteBinLine />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>

//         {/* Form Elements */}
//         {formElements.map((element, index) => (
//           <DraggableQuestion
//             key={element.id}
//             id={element.id}
//             index={index}
//             moveQuestion={moveQuestion}
//           >
//             {renderFormElement(element)}
//           </DraggableQuestion>
//         ))}

//         {/* Add Element Buttons */}
//         <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//           <Button
//             variant="contained"
//             onClick={(event) => setAnchorEl(event.currentTarget)}
//             startIcon={<AddIcon />}
//           >
//             Questions
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => handleAddFormElement("Text Editor")}
//             startIcon={<AddIcon />}
//           >
//             Text Block
//           </Button>
//         </Stack>
//       </CardContent>

//       {/* Add Question Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => setAnchorEl(null)}
//       >
//         {[
//           "Free Entry",
//           "Email",
//           "Number",
//           "Date",
//           "Radio Buttons",
//           "Checkboxes",
//           "Dropdown",
//           "Yes/No",
//           "File Upload",
//         ].map((type) => (
//           <MenuItem key={type} onClick={() => handleAddFormElement(type)}>
//             {type}
//           </MenuItem>
//         ))}
//       </Menu>

//       {/* Section Settings Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={() => toggleDrawer(false)}
//         PaperProps={{ sx: { width: { xs: '100%', sm: 600, md: 800 } } }}
//       >
//         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//           {/* Drawer Header */}
//           <Box sx={{ 
//             display: "flex", 
//             justifyContent: "space-between", 
//             alignItems: "center", 
//             p: 2,
//             borderBottom: 1,
//             borderColor: 'divider'
//           }}>
//             <Box>
//               <Typography variant="h6" gutterBottom>
//                 Section Settings
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 {text}
//               </Typography>
//             </Box>
//             <IconButton onClick={() => toggleDrawer(false)}>
//               <IoMdClose />
//             </IconButton>
//           </Box>

//           {/* Drawer Content */}
//           <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
//             {/* Repeat Section */}
//             <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//               <Box display="flex" alignItems="center">
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={repeateButton}
//                       onChange={(event) => handleRepeateButton(event.target.checked)}
//                       color="primary"
//                     />
//                   }
//                   label="Allow client to repeat"
//                 />
//               </Box>
              
//               {repeateButton && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="body2" gutterBottom>
//                     Button name (maximum 25 characters)
//                   </Typography>
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     value={repeatButtonName}
//                     onChange={(e) => setRepeatButtonName(e.target.value)}
//                     inputProps={{ maxLength: 25 }}
//                   />
//                 </Box>
//               )}
//             </Paper>

//             {/* Conditional Section */}
//             <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//               <Box display="flex" alignItems="center">
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={conditionButton}
//                       onChange={(event) => handleConditionButton(event.target.checked)}
//                       color="primary"
//                     />
//                   }
//                   label="Conditional"
//                 />
//               </Box>
              
//               {conditionButton && (
//                 <Box sx={{ mt: 2 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       Conditions
//                     </Typography>
//                     <Button
//                       variant="text"
//                       size="small"
//                       startIcon={<AddIcon />}
//                       onClick={handleAddSectionQuestionAnswer}
//                     >
//                       Add
//                     </Button>
//                   </Box>
//                   <Divider sx={{ mb: 2 }} />
                  
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="body2" gutterBottom>Mode</Typography>
//                     <Autocomplete
//                       options={["Any", "All"]}
//                       value={sectionMode}
//                       onChange={(event, newValue) => setSectionMode(newValue)}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           variant="outlined"
//                           size="small"
//                         />
//                       )}
//                       size="small"
//                     />
//                   </Box>

//                   {sectionQuestionAnswers.map((qa, index) => (
//                     <Grid container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={index} sx={{ mb: 2 }}>
//                       <Grid size={{ xs: 12, md: 5 }}>
//                         <Typography variant="body2" gutterBottom>Question</Typography>
//                         <Autocomplete
//                           options={getAllQuestionsGrouped()}
//                           getOptionLabel={(option) => option.text || ""}
//                           groupBy={(option) => option.sectionName}
//                           value={selectedSectionQuestions[index] || null}
//                           onChange={(event, newValue) =>
//                             handleSectionQuestionSelect(newValue, index)
//                           }
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               variant="outlined"
//                               size="small"
//                               placeholder="Select question"
//                             />
//                           )}
//                           size="small"
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 5 }}>
//                         <Typography variant="body2" gutterBottom>Answer</Typography>
//                         <Autocomplete
//                           options={getAnswerOptions(selectedSectionQuestions[index])}
//                           value={selectedSectionAnswers[index] || null}
//                           onChange={(event, newValue) => {
//                             const updatedAnswers = [...selectedSectionAnswers];
//                             updatedAnswers[index] = newValue;
//                             setSelectedSectionAnswers(updatedAnswers);
//                           }}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               variant="outlined"
//                               size="small"
//                               placeholder="Select answer"
//                             />
//                           )}
//                           size="small"
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 2 }}>
//                         <Box sx={{ mt: 4 }}>
//                           <IconButton
//                             size="small"
//                             onClick={() => handleRemoveQuestionAnswer(index)}
//                             color="error"
//                           >
//                             <RiDeleteBinLine />
//                           </IconButton>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   ))}
//                 </Box>
//               )}
//             </Paper>

//             {/* Save/Cancel Buttons */}
//             <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//               <Button
//                 variant="contained"
//                 onClick={handleSectionSave}
               
//               >
//                 Save
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={() => toggleDrawer(false)}
               
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Question Settings Drawer */}
//       <Drawer
//         anchor="right"
//         open={queDrawerOpen}
//         onClose={() => setQueDrawerOpen(false)}
//         PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}
//       >
//         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//           {/* Drawer Header */}
//           <Box sx={{ 
//             display: "flex", 
//             justifyContent: "space-between", 
//             alignItems: "center", 
//             p: 2,
//             borderBottom: 1,
//             borderColor: 'divider'
//           }}>
//             <Typography variant="h6">
//               {selectedElement?.text || "Question Settings"}
//             </Typography>
//             <IconButton onClick={() => setQueDrawerOpen(false)}>
//               <IoMdClose />
//             </IconButton>
//           </Box>

//           {/* Drawer Content */}
//           <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
//             {/* Required Field */}
//             <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={requiredButton}
//                       onChange={(event) => handleRequiredButton(event.target.checked)}
//                       color="primary"
//                     />
//                   }
//                   label="Required"
//                 />
//               </Box>
//               <Divider sx={{ my: 1 }} />
//               <Typography variant="caption" color="textSecondary">
//                 It is mandatory to respond to this question to submit the organizer
//               </Typography>
//             </Paper>

//             {/* Pre-Filled Field */}
//             <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={prefilledButton}
//                       onChange={(event) => handlePrefilledButton(event.target.checked)}
//                       color="primary"
//                     />
//                   }
//                   label="Pre-Filled"
//                 />
//               </Box>
//               <Divider sx={{ my: 1 }} />
//               <Typography variant="caption" color="textSecondary">
//                 If asked before, answer pre-populates from previous organizer
//               </Typography>
//             </Paper>

//             {/* Conditional Field */}
//             <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={queConditionButton}
//                       onChange={(event) => handleQueConditionButton(event.target.checked)}
//                       color="primary"
//                     />
//                   }
//                   label="Conditional"
//                 />
//               </Box>
//               <Divider sx={{ my: 1 }} />
//               <Typography variant="caption" color="textSecondary" display="block" mb={2}>
//                 Ask question only in certain scenarios
//               </Typography>
              
//               {queConditionButton && (
//                 <Box sx={{ mt: 2 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       Conditions
//                     </Typography>
//                     <Button
//                       variant="text"
//                       size="small"
//                       startIcon={<AddIcon />}
//                       onClick={handleAddQuestionAnswer}
//                     >
//                       Add
//                     </Button>
//                   </Box>
//                   <Divider sx={{ mb: 2 }} />
                  
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="body2" gutterBottom>Mode</Typography>
//                     <Autocomplete
//                       options={["Any", "All"]}
//                       value={mode}
//                       onChange={(event, newValue) => setMode(newValue)}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           variant="outlined"
//                           size="small"
//                         />
//                       )}
//                       size="small"
//                     />
//                   </Box>

//                   {questionAnswers.map((qa, index) => (
//                     <Grid container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={index} sx={{ mb: 2 }}>
//                       <Grid size={{ xs: 12, md: 5 }}>
//                         <Typography variant="body2" gutterBottom>Question</Typography>
//                         <Autocomplete
//                           options={getAllQuestionsGrouped()}
//                           getOptionLabel={(option) => option.text || ""}
//                           groupBy={(option) => option.sectionName}
//                           value={selectedQuestions[index] || null}
//                           onChange={(event, newValue) =>
//                             handleQuestionSelect(newValue, index)
//                           }
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               variant="outlined"
//                               size="small"
//                               placeholder="Select question"
//                             />
//                           )}
//                           size="small"
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 5 }}>
//                         <Typography variant="body2" gutterBottom>Answer</Typography>
//                         <Autocomplete
//                           options={getAnswerOptions(selectedQuestions[index])}
//                           value={selectedAnswers[index] || null}
//                           onChange={(event, newValue) => {
//                             const updatedAnswers = [...selectedAnswers];
//                             updatedAnswers[index] = newValue;
//                             setSelectedAnswers(updatedAnswers);
//                           }}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               variant="outlined"
//                               size="small"
//                               placeholder="Select answer"
//                             />
//                           )}
//                           size="small"
//                         />
//                       </Grid>
//                       <Grid size={{ xs: 12, md: 2 }}>
//                         <Box sx={{ mt: 4 }}>
//                           <IconButton
//                             size="small"
//                             onClick={() => handleRemoveQuestionAnswer(index)}
//                             color="error"
//                           >
//                             <RiDeleteBinLine />
//                           </IconButton>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   ))}
//                 </Box>
//               )}
//             </Paper>

//             {/* Description Field */}
//             <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={descriptionButton}
//                       onChange={(event) => handleDescriptionButton(event.target.checked)}
//                       color="primary"
//                     />
//                   }
//                   label="Description"
//                 />
//               </Box>
//               <Divider sx={{ my: 1 }} />
//               <Typography variant="caption" color="textSecondary" display="block" mb={2}>
//                 Add instructional text to help clients answer your question
//               </Typography>
              
//               {descriptionButton && (
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   placeholder="Description"
//                   variant="outlined"
//                   margin="normal"
//                   value={descriptionText}
//                   onChange={(event) => setDescriptionText(event.target.value)}
//                 />
//               )}
//             </Paper>

//             {/* Save/Cancel Buttons */}
//             <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//               <Button
//                 variant="contained"
//                 onClick={handleSave}
//                 sx={{ borderRadius: "15px", px: 4 }}
//               >
//                 Save
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={() => setQueDrawerOpen(false)}
//                 sx={{ borderRadius: "15px", px: 4 }}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Drawer>
//     </Card>
//   );
// };


// export default Section;


import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical, X, Settings, Trash2, Copy, Plus, CloudUpload } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Checkbox } from "../../../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import Quill from "quill";
import "quill-emoji";

Quill.register("modules/emoji", require("quill-emoji"));

const ItemTypes = {
  QUESTION: "question",
  OPTION: "option",
};

const DraggableQuestion = ({ id, index, moveQuestion, children }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.QUESTION,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.QUESTION,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));
return (
  <div
    ref={ref}
    className={`p-2 mb-2 rounded-md flex items-center transition-all duration-200 ${
      isDragging 
        ? "opacity-50 border-2 border-dashed border-primary bg-primary/5" 
        : "border border-border bg-card hover:border-primary/40"
    }`}
    style={{ cursor: "move" }}
  >
    <GripVertical className="h-4 w-4 mr-2 text-muted-foreground cursor-move hover:text-foreground transition-colors" />
    {children}
  </div>
);
  // return (
  //   <div
  //     ref={ref}
  //     className={`p-2 mb-2 bg-white border rounded-md flex items-center ${
  //       isDragging ? "opacity-50 border-blue-500 border-dashed" : "border-gray-200"
  //     }`}
  //     style={{ cursor: "move" }}
  //   >
  //     <GripVertical className="h-4 w-4 mr-2 text-gray-400 cursor-move" />
  //     {children}
  //   </div>
  // );
};

const DraggableOption = ({ id, index, moveOption, children, elementId }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.OPTION,
    item: { id, index, elementId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.OPTION,
    hover(item, monitor) {
      if (!ref.current) return;
      if (item.elementId !== elementId) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveOption(elementId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));
return (
  <div
    ref={ref}
    className={`flex items-center mb-2 p-1 rounded transition-all duration-200 ${
      isDragging 
        ? "opacity-50 bg-primary/5 border-2 border-dashed border-primary" 
        : "opacity-100 hover:bg-accent/50"
    }`}
    style={{ cursor: "move" }}
  >
    <GripVertical className="h-4 w-4 mr-2 text-muted-foreground cursor-move hover:text-foreground transition-colors" />
    {children}
  </div>
);
  // return (
  //   <div
  //     ref={ref}
  //     className={`flex items-center mb-2 ${isDragging ? "opacity-50" : "opacity-100"}`}
  //     style={{ cursor: "move" }}
  //   >
  //     <GripVertical className="h-4 w-4 mr-2 text-gray-400 cursor-move" />
  //     {children}
  //   </div>
  // );
};
const Section = ({
  sections,
  section,
  onDelete,
  onUpdate,
  onDuplicate,
  onSaveFormData,
  onSaveSectionData,
}) => {
  const [text, setText] = useState(section.text);
  const [formElements, setFormElements] = useState(section.formElements || []);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [queDrawerOpen, setQueDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [repeateButton, setRepeateButton] = useState(false);
  const [conditionButton, setConditionButton] = useState(false);
  const [prefilledButton, setPrefilledButton] = useState(false);
  const [descriptionButton, setDescriptionButton] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");
  const [mode, setMode] = useState("Any");
  const [sectionMode, setSectionMode] = useState("Any");
  const [repeatButtonName, setRepeatButtonName] = useState("Repeat Section");
  const [queConditionButton, setQueConditionButton] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState([
    { question: "", questionId: null, answer: "", optionvalue: false },
  ]);
  const [requiredButton, setRequiredButton] = useState(false);
  const [sectionQuestionAnswers, setSectionQuestionAnswers] = useState([
    { question: "", questionId: null, answer: "", optionvalue: false },
  ]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [sectionConditionBadge, setSectionConditionBadge] = useState(false);
  const [questionsAnswersMap, setQuestionsAnswersMap] = useState({});
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedSectionData, setSelectedSectionData] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [selectedSectionQuestions, setSelectedSectionQuestions] = useState([]);
  const [selectedSectionAnswers, setSelectedSectionAnswers] = useState([]);

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: "1" }, { header: "2" }, { align: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      [{ emoji: true }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["clean"],
      ["undo", "redo"],
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
    },
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "undo",
    "redo",
    "emoji",
  ];

  const moveQuestion = (dragIndex, hoverIndex) => {
    const draggedItem = formElements[dragIndex];
    const newFormElements = [...formElements];
    newFormElements.splice(dragIndex, 1);
    newFormElements.splice(hoverIndex, 0, draggedItem);
    setFormElements(newFormElements);
    onUpdate(section.id, text, newFormElements);
  };

  const moveOption = (elementId, dragIndex, hoverIndex) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId && element.options) {
        const draggedOption = element.options[dragIndex];
        const newOptions = [...element.options];
        newOptions.splice(dragIndex, 1);
        newOptions.splice(hoverIndex, 0, draggedOption);
        return { ...element, options: newOptions };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleSectionSave = () => {
    const sectionsettings = {
      sectionRepeatingMode: repeateButton,
      buttonName: repeateButton ? repeatButtonName : "",
      conditional: conditionButton,
      mode: sectionMode,
      conditions: conditionButton
        ? sectionQuestionAnswers.map((qa, index) => ({
            question: selectedSectionQuestions[index]?.text || "",
            questionId: selectedSectionQuestions[index]?.id || null,
            answer: selectedSectionAnswers[index] || "",
            optionvalue: false,
          }))
        : [],
    };

    if (onSaveSectionData) {
      onSaveSectionData(sectionsettings);
      setSectionConditionBadge(sectionsettings.conditional);
      toggleDrawer(false);
      setRepeateButton(false);
      setRepeatButtonName("");
      setConditionButton(false);
      setSectionMode("");
      setSelectedSectionQuestions([]);
      setSelectedSectionAnswers([]);
      setSectionQuestionAnswers([]);
    }
  };

  const clearForm = () => {
    setRequiredButton(false);
    setPrefilledButton(false);
    setQueConditionButton(false);
    setDescriptionButton(false);
    setDescriptionText("");
    setSelectedQuestions([]);
    setSelectedAnswers([]);
    setMode("Any");
    setQuestionAnswers([]);
  };

  const handleSave = () => {
    if (selectedElement) {
      const formData = {
        required: requiredButton,
        prefilled: prefilledButton,
        conditional: queConditionButton,
        mode: mode,
        conditions: queConditionButton
          ? questionAnswers.map((qa, index) => ({
              question: selectedQuestions[index]?.text || "",
              questionId: selectedQuestions[index]?.id || null,
              answer: selectedAnswers[index] || "",
              optionvalue: false,
            }))
          : [],
        descriptionEnabled: descriptionButton,
        description: descriptionButton ? descriptionText : "",
      };

      setQuestionsAnswersMap((prev) => ({
        ...prev,
        [selectedElement.id]: {
          questionAnswers: questionAnswers,
          description: descriptionText,
        },
      }));

      onSaveFormData(selectedElement.id, formData);

      const updatedFormElements = formElements.map((element) =>
        element.id === selectedElement.id
          ? { ...element, questionsectionsettings: formData }
          : element
      );
      setFormElements(updatedFormElements);
      clearForm();
      setQueDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (selectedElement) {
      const { questionsectionsettings } = selectedElement;
      setRequiredButton(questionsectionsettings?.required || false);
      setPrefilledButton(questionsectionsettings?.prefilled || false);
      setQueConditionButton(questionsectionsettings?.conditional || false);
      setDescriptionButton(questionsectionsettings?.descriptionEnabled || false);
      setDescriptionText(questionsectionsettings?.description || "");
      setMode(questionsectionsettings?.mode || "Any");

      const conditions = questionsectionsettings?.conditions || [];
      const questions = conditions.map(
        (cond) => formElements.find((el) => el.id === cond.questionId) || null
      );
      const answers = conditions.map((cond) => cond.answer || null);

      setQuestionAnswers(conditions);
      setSelectedQuestions(questions);
      setSelectedAnswers(answers);
    }
  }, [selectedElement, formElements]);

  useEffect(() => {
    setSectionConditionBadge(section?.sectionsettings?.conditional);
  }, [section]);

  useEffect(() => {
    setText(section.text);
    setFormElements(section.formElements);
  }, [section]);

  const handleRequiredButton = (checked) => setRequiredButton(checked);
  const handleDescriptionButton = (checked) => setDescriptionButton(checked);
  const handlePrefilledButton = (checked) => setPrefilledButton(checked);
  const handleRepeateButton = (checked) => setRepeateButton(checked);
  const handleConditionButton = (checked) => setConditionButton(checked);
  const handleQueConditionButton = (checked) => setQueConditionButton(checked);

  const handleAddQuestionAnswer = () => {
    setQuestionAnswers([
      ...questionAnswers,
      { question: "", questionId: null, answer: "", optionvalue: false },
    ]);
  };

  const handleAddSectionQuestionAnswer = () => {
    setSectionQuestionAnswers([
      ...sectionQuestionAnswers,
      { question: "", questionId: null, answer: "", optionvalue: false },
    ]);
  };

  const handleRemoveQuestionAnswer = (index) => {
    const updatedList = questionAnswers.filter((_, i) => i !== index);
    setQuestionAnswers(updatedList);
    const updatedSectionList = sectionQuestionAnswers.filter(
      (_, i) => i !== index
    );
    setSectionQuestionAnswers(updatedSectionList);
  };

  const handleSectionSettingsClick = () => {
    const updatedSection = sections.find((sec) => sec.id === section.id);
    toggleDrawer(true);
    if (updatedSection && updatedSection.sectionsettings) {
      setSelectedSectionData(updatedSection);
      setSelectedSectionId(updatedSection.id);
      setRepeateButton(updatedSection.sectionsettings.sectionRepeatingMode || false);
      setRepeatButtonName(updatedSection.sectionsettings.buttonName || "Repeat Section");
      setConditionButton(updatedSection.sectionsettings.conditional || false);
      setSectionMode(updatedSection.sectionsettings.mode || "Any");
      
      const conditions = updatedSection.sectionsettings.conditions || [];
      setSectionQuestionAnswers(conditions);
      const questions = conditions.map(
        (cond) => getAllQuestions().find((q) => q.id === cond.questionId) || null
      );
      const answers = conditions.map((cond) => cond.answer || null);
      setSelectedSectionQuestions(questions);
      setSelectedSectionAnswers(answers);
    }
  };

  const toggleDrawer = (open) => setDrawerOpen(open);

  const getAllQuestions = () => {
    return sections.flatMap((section) =>
      section.formElements.filter(
        (element) =>
          element.type === "Radio Buttons" ||
          element.type === "Checkboxes" ||
          element.type === "Dropdown"
      )
    );
  };

  const getAllQuestionsGrouped = () => {
    const allQuestions = [];
    sections.forEach((section) => {
      const sectionQuestions = section.formElements.filter(
        (element) =>
          element.type === "Radio Buttons" ||
          element.type === "Checkboxes" ||
          element.type === "Dropdown"
      );
      sectionQuestions.forEach((question) => {
        allQuestions.push({
          ...question,
          sectionName: section.text || `Section ${section.id}`,
          sectionId: section.id
        });
      });
    });
    return allQuestions;
  };

  const handleSettingsClick = (elementId) => {
    const updatedElement = formElements.find(
      (element) => element.id === elementId
    );
    if (updatedElement) {
      setSelectedElement(updatedElement);
      setQueDrawerOpen(true);
    }
  };

  const handleDelete = () => onDelete(section.id);
  const handleDuplicate = () => onDuplicate(section.id);
  
  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    onUpdate(section.id, newText, formElements);
  };

  const handleAddFormElement = (type) => {
    const newElement = {
      type,
      id: Date.now(),
      sectionid: section.id,
      options: [],
      text: "",
      questionsectionsettings: {
        required: false,
        prefilled: false,
        conditional: false,
        mode: "",
        conditions: [{ question: "", questionId: null, answer: "", optionvalue: false }],
        descriptionEnabled: false,
        description: "",
      },
    };
    const updatedFormElements = [...formElements, newElement];
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
    setAnchorEl(null);
  };

  const handleDeleteFormElement = (id) => {
    const updatedFormElements = formElements.filter(
      (element) => element.id !== id
    );
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleAddOption = (elementId) => {
    const newOption = { id: Date.now(), text: "" };
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, options: [...(element.options || []), newOption] };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleOptionChange = (elementId, optionId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        const updatedOptions = element.options.map((option) => {
          if (option.id === optionId) {
            return { ...option, text: newText };
          }
          return option;
        });
        return { ...element, options: updatedOptions };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleDeleteOption = (elementId, optionId) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        const updatedOptions = element.options.filter(
          (option) => option.id !== optionId
        );
        return { ...element, options: updatedOptions };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleCheckboxTextChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleElementTextChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleQuillChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleQuestionSelect = (value, index) => {
    const allQuestions = getAllQuestionsGrouped();
    const selectedQuestion = allQuestions.find((q) => q.id === value?.id);
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions[index] = selectedQuestion;
    setSelectedQuestions(updatedQuestions);
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = null;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSectionQuestionSelect = (value, index) => {
    const allQuestions = getAllQuestionsGrouped();
    const selectedQuestion = allQuestions.find((q) => q.id === value?.id);
    const updatedQuestions = [...selectedSectionQuestions];
    updatedQuestions[index] = selectedQuestion;
    setSelectedSectionQuestions(updatedQuestions);
    const updatedAnswers = [...selectedSectionAnswers];
    updatedAnswers[index] = null;
    setSelectedSectionAnswers(updatedAnswers);
  };

  const getAnswerOptions = (questionElement) => {
    if (!questionElement) return [];
    return questionElement.options?.map((option) => option.text) || [];
  };

  const renderOptions = (element, type = "text") => {
    return (
      <div className="mt-4 space-y-2">
        {element.options &&
          element.options.map((option, index) => (
            <DraggableOption
              key={option.id}
              id={option.id}
              index={index}
              moveOption={moveOption}
              elementId={element.id}
            >
              <div className="flex items-center gap-2 w-full">
                {type === "radio" && (
                  <div className="h-4 w-4 rounded-full border border-border" />
                )}
                {type === "checkbox" && (
                  <div className="h-4 w-4 rounded border border-border" />
                )}
                {type === "Yes/No" && (
                  <div className="h-4 w-4 rounded-full border border-border" />
                )}
                <Input
                  placeholder="Option"
                  value={option.text}
                  className="flex-1 bg-background text-foreground border-border focus:ring-ring"
                  onChange={(e) =>
                    handleOptionChange(element.id, option.id, e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteOption(element.id, option.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </DraggableOption>
          ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddOption(element.id)}
          className="mt-2 text-foreground border-border hover:bg-accent hover:text-accent-foreground"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>
    );
  };

  const ElementHeader = ({ label, element }) => (
    <div className="flex items-center justify-between mb-1 w-full">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {element?.questionsectionsettings?.conditional && (
          <Badge variant="outline" className="mr-2 border-green-500/50 text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/50">
            Conditional question
          </Badge>
        )}
        {element?.questionsectionsettings?.required && (
          <span className="text-destructive font-medium">*</span>
        )}
      </div>
    </div>
  );

  const renderFormElement = (element) => {
    const commonTextFieldProps = {
      value: element.text,
      onChange: (e) => handleElementTextChange(element.id, e.target.value),
      placeholder: element.type,
      className: "flex-1 w-full bg-background text-foreground border-border focus:ring-ring",
    };

    const actionButtons = (
      <div className="flex gap-1 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSettingsClick(element.id)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFormElement(element.id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );

    switch (element.type) {
      case "Free Entry":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Free Entry" element={element} />
              <div className="flex items-start gap-2 w-full">
                <Input {...commonTextFieldProps} />
                {actionButtons}
              </div>
            </CardContent>
          </Card>
        );

      case "Email":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Email" element={element} />
              <div className="flex items-start gap-2 w-full">
                <Input type="email" {...commonTextFieldProps} />
                {actionButtons}
              </div>
            </CardContent>
          </Card>
        );

      case "Number":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Number" element={element} />
              <div className="flex items-start gap-2 w-full">
                <Input type="text" inputMode="numeric" {...commonTextFieldProps} />
                {actionButtons}
              </div>
            </CardContent>
          </Card>
        );

      case "Date":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Date" element={element} />
              <div className="flex items-start gap-2 w-full">
                <Input 
                  type="text" 
                  placeholder="MM/DD/YYYY"
                  {...commonTextFieldProps} 
                />
                {actionButtons}
              </div>
            </CardContent>
          </Card>
        );

      case "Radio Buttons":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Radio Button" element={element} />
              <div className="flex items-start gap-2 mb-2 w-full">
                <Input {...commonTextFieldProps} />
                {actionButtons}
              </div>
              {renderOptions(element, "radio")}
            </CardContent>
          </Card>
        );

      case "Checkboxes":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Checkbox" element={element} />
              <div className="flex items-start gap-2 mb-2 w-full">
                <Input
                  {...commonTextFieldProps}
                  onChange={(e) =>
                    handleCheckboxTextChange(element.id, e.target.value)
                  }
                />
                {actionButtons}
              </div>
              {renderOptions(element, "checkbox")}
            </CardContent>
          </Card>
        );

      case "Dropdown":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Dropdown" element={element} />
              <div className="flex items-start gap-2 mb-2 w-full">
                <Input
                  {...commonTextFieldProps}
                  onChange={(e) =>
                    handleCheckboxTextChange(element.id, e.target.value)
                  }
                />
                {actionButtons}
              </div>
              {renderOptions(element)}
            </CardContent>
          </Card>
        );

      case "Yes/No":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="Yes/No" element={element} />
              <div className="flex items-start gap-2 mb-2 w-full">
                <Input {...commonTextFieldProps} />
                {actionButtons}
              </div>
              {renderOptions(element, "Yes/No")}
            </CardContent>
          </Card>
        );

      case "File Upload":
        return (
          <Card className="mb-4 w-full bg-card border-border">
            <CardContent className="p-3">
              <ElementHeader label="File Upload" element={element} />
              <div className="flex items-start gap-2 mb-2 w-full">
                <Input {...commonTextFieldProps} />
                {actionButtons}
              </div>
              <Button variant="outline" disabled className="mt-2 border-border text-muted-foreground">
                <CloudUpload className="h-4 w-4 mr-2" />
                Upload files
              </Button>
            </CardContent>
          </Card>
        );

      case "Text Editor":
        return (
          <Card className="mb-4 w-full h-auto bg-card border-border">
            <CardContent className="p-3 h-auto">
              <ElementHeader label="Text Editor" element={element} />
              <div className="flex items-start gap-2 w-full">
                <div className="flex-1 w-full">
                  <ReactQuill
                    theme="snow"
                    value={element.text}
                    modules={modules}
                    formats={formats}
                    onChange={(newText) => handleQuillChange(element.id, newText)}
                    className="min-h-[200px] [&_.ql-toolbar]:border-border [&_.ql-container]:border-border [&_.ql-editor]:bg-background [&_.ql-editor]:text-foreground"
                  />
                </div>
                {actionButtons}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        {/* Section Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-4">
            <Input
              value={text}
              onChange={handleTextChange}
              placeholder="Section text"
              className="bg-muted border-border text-foreground focus:ring-ring"
            />
          </div>
          
          {sectionConditionBadge && (
            <Badge variant="outline" className="mr-2 border-green-500/50 text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/50">
              Conditional section
            </Badge>
          )}
          
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleDuplicate} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate Section</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleSectionSettingsClick} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Section Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Section</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Form Elements */}
        {formElements.map((element, index) => (
          <DraggableQuestion
            key={element.id}
            id={element.id}
            index={index}
            moveQuestion={moveQuestion}
          >
            {renderFormElement(element)}
          </DraggableQuestion>
        ))}

        {/* Add Element Buttons */}
        <div className="flex gap-4 mt-6">
          <Button onClick={(event) => setAnchorEl(event.currentTarget)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Questions
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddFormElement("Text Editor")}
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Text Block
          </Button>
        </div>
      </CardContent>

      {/* Add Question Menu */}
      <Dialog open={Boolean(anchorEl)} onOpenChange={() => setAnchorEl(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Question</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {[
              "Free Entry",
              "Email",
              "Number",
              "Date",
              "Radio Buttons",
              "Checkboxes",
              "Dropdown",
              "Yes/No",
              "File Upload",
            ].map((type) => (
              <Button
                key={type}
                variant="ghost"
                className="justify-start text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleAddFormElement(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Section Settings Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => toggleDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Section Settings
                </h2>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
              <button onClick={() => toggleDrawer(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Repeat Section */}
              <div className="border border-border rounded-lg p-4 mb-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="repeat-section" className="text-foreground">Allow client to repeat</Label>
                  <Switch
                    id="repeat-section"
                    checked={repeateButton}
                    onCheckedChange={handleRepeateButton}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {repeateButton && (
                  <div className="mt-4">
                    <Label className="text-sm mb-1 block text-foreground">
                      Button name (maximum 25 characters)
                    </Label>
                    <Input
                      value={repeatButtonName}
                      onChange={(e) => setRepeatButtonName(e.target.value)}
                      maxLength={25}
                      className="bg-background border-border text-foreground focus:ring-ring"
                    />
                  </div>
                )}
              </div>

              {/* Conditional Section */}
              <div className="border border-border rounded-lg p-4 mb-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="conditional-section" className="text-foreground">Conditional</Label>
                  <Switch
                    id="conditional-section"
                    checked={conditionButton}
                    onCheckedChange={handleConditionButton}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {conditionButton && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Conditions</h4>
                      <Button variant="ghost" size="sm" onClick={handleAddSectionQuestionAnswer} className="text-foreground hover:bg-accent">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <Separator className="bg-border" />
                    
                    <div>
                      <Label className="text-sm mb-1 block text-foreground">Mode</Label>
                      <Select value={sectionMode} onValueChange={setSectionMode}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Any">Any</SelectItem>
                          <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {sectionQuestionAnswers.map((qa, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-5">
                          <Label className="text-sm mb-1 block text-foreground">Question</Label>
                          <Select
                            value={selectedSectionQuestions[index]?.id?.toString() || ""}
                            onValueChange={(value) => {
                              const allQuestions = getAllQuestionsGrouped();
                              const selected = allQuestions.find(q => q.id.toString() === value);
                              handleSectionQuestionSelect(selected, index);
                            }}
                          >
                            <SelectTrigger className="bg-background border-border text-foreground">
                              <SelectValue placeholder="Select question" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              {getAllQuestionsGrouped().map((q) => (
                                <SelectItem key={q.id} value={q.id.toString()}>
                                  {q.sectionName}: {q.text}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-5">
                          <Label className="text-sm mb-1 block text-foreground">Answer</Label>
                          <Select
                            value={selectedSectionAnswers[index] || ""}
                            onValueChange={(value) => {
                              const updatedAnswers = [...selectedSectionAnswers];
                              updatedAnswers[index] = value;
                              setSelectedSectionAnswers(updatedAnswers);
                            }}
                            disabled={!selectedSectionQuestions[index]}
                          >
                            <SelectTrigger className="bg-background border-border text-foreground">
                              <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              {getAnswerOptions(selectedSectionQuestions[index]).map((answer) => (
                                <SelectItem key={answer} value={answer}>
                                  {answer}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestionAnswer(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={() => toggleDrawer(false)}
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSectionSave}
                className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Settings Drawer */}
      {queDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setQueDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-background border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                {selectedElement?.text || "Question Settings"}
              </h2>
              <button onClick={() => setQueDrawerOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Required Field */}
              <div className="border border-border rounded-lg p-4 mb-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="required" className="text-foreground">Required</Label>
                  <Switch
                    id="required"
                    checked={requiredButton}
                    onCheckedChange={handleRequiredButton}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <Separator className="my-2 bg-border" />
                <p className="text-xs text-muted-foreground">
                  It is mandatory to respond to this question to submit the organizer
                </p>
              </div>

              {/* Pre-Filled Field */}
              <div className="border border-border rounded-lg p-4 mb-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="prefilled" className="text-foreground">Pre-Filled</Label>
                  <Switch
                    id="prefilled"
                    checked={prefilledButton}
                    onCheckedChange={handlePrefilledButton}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <Separator className="my-2 bg-border" />
                <p className="text-xs text-muted-foreground">
                  If asked before, answer pre-populates from previous organizer
                </p>
              </div>

              {/* Conditional Field */}
              <div className="border border-border rounded-lg p-4 mb-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="conditional" className="text-foreground">Conditional</Label>
                  <Switch
                    id="conditional"
                    checked={queConditionButton}
                    onCheckedChange={handleQueConditionButton}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <Separator className="my-2 bg-border" />
                <p className="text-xs text-muted-foreground mb-4">
                  Ask question only in certain scenarios
                </p>
                
                {queConditionButton && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Conditions</h4>
                      <Button variant="ghost" size="sm" onClick={handleAddQuestionAnswer} className="text-foreground hover:bg-accent">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <Separator className="bg-border" />
                    
                    <div>
                      <Label className="text-sm mb-1 block text-foreground">Mode</Label>
                      <Select value={mode} onValueChange={setMode}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Any">Any</SelectItem>
                          <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {questionAnswers.map((qa, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-5">
                          <Label className="text-sm mb-1 block text-foreground">Question</Label>
                          <Select
                            value={selectedQuestions[index]?.id?.toString() || ""}
                            onValueChange={(value) => {
                              const allQuestions = getAllQuestionsGrouped();
                              const selected = allQuestions.find(q => q.id.toString() === value);
                              handleQuestionSelect(selected, index);
                            }}
                          >
                            <SelectTrigger className="bg-background border-border text-foreground">
                              <SelectValue placeholder="Select question" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              {getAllQuestionsGrouped().map((q) => (
                                <SelectItem key={q.id} value={q.id.toString()}>
                                  {q.sectionName}: {q.text}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-5">
                          <Label className="text-sm mb-1 block text-foreground">Answer</Label>
                          <Select
                            value={selectedAnswers[index] || ""}
                            onValueChange={(value) => {
                              const updatedAnswers = [...selectedAnswers];
                              updatedAnswers[index] = value;
                              setSelectedAnswers(updatedAnswers);
                            }}
                            disabled={!selectedQuestions[index]}
                          >
                            <SelectTrigger className="bg-background border-border text-foreground">
                              <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              {getAnswerOptions(selectedQuestions[index]).map((answer) => (
                                <SelectItem key={answer} value={answer}>
                                  {answer}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestionAnswer(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Field */}
              <div className="border border-border rounded-lg p-4 mb-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Switch
                    id="description"
                    checked={descriptionButton}
                    onCheckedChange={handleDescriptionButton}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <Separator className="my-2 bg-border" />
                <p className="text-xs text-muted-foreground mb-4">
                  Add instructional text to help clients answer your question
                </p>
                
                {descriptionButton && (
                  <Textarea
                    placeholder="Description"
                    value={descriptionText}
                    onChange={(event) => setDescriptionText(event.target.value)}
                    rows={4}
                    className="bg-background border-border text-foreground focus:ring-ring"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={() => setQueDrawerOpen(false)}
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
// const Section = ({
//   sections,
//   section,
//   onDelete,
//   onUpdate,
//   onDuplicate,
//   onSaveFormData,
//   onSaveSectionData,
// }) => {
//   const [text, setText] = useState(section.text);
//   const [formElements, setFormElements] = useState(section.formElements || []);
//   const [isDrawerOpen, setDrawerOpen] = useState(false);
//   const [queDrawerOpen, setQueDrawerOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [repeateButton, setRepeateButton] = useState(false);
//   const [conditionButton, setConditionButton] = useState(false);
//   const [prefilledButton, setPrefilledButton] = useState(false);
//   const [descriptionButton, setDescriptionButton] = useState(false);
//   const [descriptionText, setDescriptionText] = useState("");
//   const [mode, setMode] = useState("Any");
//   const [sectionMode, setSectionMode] = useState("Any");
//   const [repeatButtonName, setRepeatButtonName] = useState("Repeat Section");
//   const [queConditionButton, setQueConditionButton] = useState(false);
//   const [questionAnswers, setQuestionAnswers] = useState([
//     { question: "", questionId: null, answer: "", optionvalue: false },
//   ]);
//   const [requiredButton, setRequiredButton] = useState(false);
//   const [sectionQuestionAnswers, setSectionQuestionAnswers] = useState([
//     { question: "", questionId: null, answer: "", optionvalue: false },
//   ]);
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [sectionConditionBadge, setSectionConditionBadge] = useState(false);
//   const [questionsAnswersMap, setQuestionsAnswersMap] = useState({});
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [selectedSectionData, setSelectedSectionData] = useState(null);
//   const [selectedQuestions, setSelectedQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState([]);
//   const [selectedSectionQuestions, setSelectedSectionQuestions] = useState([]);
//   const [selectedSectionAnswers, setSelectedSectionAnswers] = useState([]);

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       [{ header: "1" }, { header: "2" }, { align: [] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ script: "sub" }, { script: "super" }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ color: [] }, { background: [] }],
//       ["blockquote", "code-block"],
//       ["link", "image"],
//       [{ emoji: true }],
//       [{ indent: "-1" }, { indent: "+1" }],
//       ["clean"],
//       ["undo", "redo"],
//     ],
//     history: {
//       delay: 1000,
//       maxStack: 50,
//       userOnly: true,
//     },
//     "emoji-toolbar": true,
//     "emoji-textarea": false,
//     "emoji-shortname": true,
//   };

//   const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "script",
//     "list",
//     "bullet",
//     "indent",
//     "color",
//     "background",
//     "align",
//     "blockquote",
//     "code-block",
//     "link",
//     "image",
//     "undo",
//     "redo",
//     "emoji",
//   ];

//   const moveQuestion = (dragIndex, hoverIndex) => {
//     const draggedItem = formElements[dragIndex];
//     const newFormElements = [...formElements];
//     newFormElements.splice(dragIndex, 1);
//     newFormElements.splice(hoverIndex, 0, draggedItem);
//     setFormElements(newFormElements);
//     onUpdate(section.id, text, newFormElements);
//   };

//   const moveOption = (elementId, dragIndex, hoverIndex) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId && element.options) {
//         const draggedOption = element.options[dragIndex];
//         const newOptions = [...element.options];
//         newOptions.splice(dragIndex, 1);
//         newOptions.splice(hoverIndex, 0, draggedOption);
//         return { ...element, options: newOptions };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleSectionSave = () => {
//     const sectionsettings = {
//       sectionRepeatingMode: repeateButton,
//       buttonName: repeateButton ? repeatButtonName : "",
//       conditional: conditionButton,
//       mode: sectionMode,
//       conditions: conditionButton
//         ? sectionQuestionAnswers.map((qa, index) => ({
//             question: selectedSectionQuestions[index]?.text || "",
//             questionId: selectedSectionQuestions[index]?.id || null,
//             answer: selectedSectionAnswers[index] || "",
//             optionvalue: false,
//           }))
//         : [],
//     };

//     if (onSaveSectionData) {
//       onSaveSectionData(sectionsettings);
//       setSectionConditionBadge(sectionsettings.conditional);
//       toggleDrawer(false);
//       setRepeateButton(false);
//       setRepeatButtonName("");
//       setConditionButton(false);
//       setSectionMode("");
//       setSelectedSectionQuestions([]);
//       setSelectedSectionAnswers([]);
//       setSectionQuestionAnswers([]);
//     }
//   };

//   const clearForm = () => {
//     setRequiredButton(false);
//     setPrefilledButton(false);
//     setQueConditionButton(false);
//     setDescriptionButton(false);
//     setDescriptionText("");
//     setSelectedQuestions([]);
//     setSelectedAnswers([]);
//     setMode("Any");
//     setQuestionAnswers([]);
//   };

//   const handleSave = () => {
//     if (selectedElement) {
//       const formData = {
//         required: requiredButton,
//         prefilled: prefilledButton,
//         conditional: queConditionButton,
//         mode: mode,
//         conditions: queConditionButton
//           ? questionAnswers.map((qa, index) => ({
//               question: selectedQuestions[index]?.text || "",
//               questionId: selectedQuestions[index]?.id || null,
//               answer: selectedAnswers[index] || "",
//               optionvalue: false,
//             }))
//           : [],
//         descriptionEnabled: descriptionButton,
//         description: descriptionButton ? descriptionText : "",
//       };

//       setQuestionsAnswersMap((prev) => ({
//         ...prev,
//         [selectedElement.id]: {
//           questionAnswers: questionAnswers,
//           description: descriptionText,
//         },
//       }));

//       onSaveFormData(selectedElement.id, formData);

//       const updatedFormElements = formElements.map((element) =>
//         element.id === selectedElement.id
//           ? { ...element, questionsectionsettings: formData }
//           : element
//       );
//       setFormElements(updatedFormElements);
//       clearForm();
//       setQueDrawerOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedElement) {
//       const { questionsectionsettings } = selectedElement;
//       setRequiredButton(questionsectionsettings?.required || false);
//       setPrefilledButton(questionsectionsettings?.prefilled || false);
//       setQueConditionButton(questionsectionsettings?.conditional || false);
//       setDescriptionButton(questionsectionsettings?.descriptionEnabled || false);
//       setDescriptionText(questionsectionsettings?.description || "");
//       setMode(questionsectionsettings?.mode || "Any");

//       const conditions = questionsectionsettings?.conditions || [];
//       const questions = conditions.map(
//         (cond) => formElements.find((el) => el.id === cond.questionId) || null
//       );
//       const answers = conditions.map((cond) => cond.answer || null);

//       setQuestionAnswers(conditions);
//       setSelectedQuestions(questions);
//       setSelectedAnswers(answers);
//     }
//   }, [selectedElement, formElements]);

//   useEffect(() => {
//     setSectionConditionBadge(section?.sectionsettings?.conditional);
//   }, [section]);

//   useEffect(() => {
//     setText(section.text);
//     setFormElements(section.formElements);
//   }, [section]);

//   const handleRequiredButton = (checked) => setRequiredButton(checked);
//   const handleDescriptionButton = (checked) => setDescriptionButton(checked);
//   const handlePrefilledButton = (checked) => setPrefilledButton(checked);
//   const handleRepeateButton = (checked) => setRepeateButton(checked);
//   const handleConditionButton = (checked) => setConditionButton(checked);
//   const handleQueConditionButton = (checked) => setQueConditionButton(checked);

//   const handleAddQuestionAnswer = () => {
//     setQuestionAnswers([
//       ...questionAnswers,
//       { question: "", questionId: null, answer: "", optionvalue: false },
//     ]);
//   };

//   const handleAddSectionQuestionAnswer = () => {
//     setSectionQuestionAnswers([
//       ...sectionQuestionAnswers,
//       { question: "", questionId: null, answer: "", optionvalue: false },
//     ]);
//   };

//   const handleRemoveQuestionAnswer = (index) => {
//     const updatedList = questionAnswers.filter((_, i) => i !== index);
//     setQuestionAnswers(updatedList);
//     const updatedSectionList = sectionQuestionAnswers.filter(
//       (_, i) => i !== index
//     );
//     setSectionQuestionAnswers(updatedSectionList);
//   };

//   const handleSectionSettingsClick = () => {
//     const updatedSection = sections.find((sec) => sec.id === section.id);
//     toggleDrawer(true);
//     if (updatedSection && updatedSection.sectionsettings) {
//       setSelectedSectionData(updatedSection);
//       setSelectedSectionId(updatedSection.id);
//       setRepeateButton(updatedSection.sectionsettings.sectionRepeatingMode || false);
//       setRepeatButtonName(updatedSection.sectionsettings.buttonName || "Repeat Section");
//       setConditionButton(updatedSection.sectionsettings.conditional || false);
//       setSectionMode(updatedSection.sectionsettings.mode || "Any");
      
//       const conditions = updatedSection.sectionsettings.conditions || [];
//       setSectionQuestionAnswers(conditions);
//       const questions = conditions.map(
//         (cond) => getAllQuestions().find((q) => q.id === cond.questionId) || null
//       );
//       const answers = conditions.map((cond) => cond.answer || null);
//       setSelectedSectionQuestions(questions);
//       setSelectedSectionAnswers(answers);
//     }
//   };

//   const toggleDrawer = (open) => setDrawerOpen(open);

//   const getAllQuestions = () => {
//     return sections.flatMap((section) =>
//       section.formElements.filter(
//         (element) =>
//           element.type === "Radio Buttons" ||
//           element.type === "Checkboxes" ||
//           element.type === "Dropdown"
//       )
//     );
//   };

//   const getAllQuestionsGrouped = () => {
//     const allQuestions = [];
//     sections.forEach((section) => {
//       const sectionQuestions = section.formElements.filter(
//         (element) =>
//           element.type === "Radio Buttons" ||
//           element.type === "Checkboxes" ||
//           element.type === "Dropdown"
//       );
//       sectionQuestions.forEach((question) => {
//         allQuestions.push({
//           ...question,
//           sectionName: section.text || `Section ${section.id}`,
//           sectionId: section.id
//         });
//       });
//     });
//     return allQuestions;
//   };

//   const handleSettingsClick = (elementId) => {
//     const updatedElement = formElements.find(
//       (element) => element.id === elementId
//     );
//     if (updatedElement) {
//       setSelectedElement(updatedElement);
//       setQueDrawerOpen(true);
//     }
//   };

//   const handleDelete = () => onDelete(section.id);
//   const handleDuplicate = () => onDuplicate(section.id);
  
//   const handleTextChange = (event) => {
//     const newText = event.target.value;
//     setText(newText);
//     onUpdate(section.id, newText, formElements);
//   };

//   const handleAddFormElement = (type) => {
//     const newElement = {
//       type,
//       id: Date.now(),
//       sectionid: section.id,
//       options: [],
//       text: "",
//       questionsectionsettings: {
//         required: false,
//         prefilled: false,
//         conditional: false,
//         mode: "",
//         conditions: [{ question: "", questionId: null, answer: "", optionvalue: false }],
//         descriptionEnabled: false,
//         description: "",
//       },
//     };
//     const updatedFormElements = [...formElements, newElement];
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//     setAnchorEl(null);
//   };

//   const handleDeleteFormElement = (id) => {
//     const updatedFormElements = formElements.filter(
//       (element) => element.id !== id
//     );
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleAddOption = (elementId) => {
//     const newOption = { id: Date.now(), text: "" };
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, options: [...(element.options || []), newOption] };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleOptionChange = (elementId, optionId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         const updatedOptions = element.options.map((option) => {
//           if (option.id === optionId) {
//             return { ...option, text: newText };
//           }
//           return option;
//         });
//         return { ...element, options: updatedOptions };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleDeleteOption = (elementId, optionId) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         const updatedOptions = element.options.filter(
//           (option) => option.id !== optionId
//         );
//         return { ...element, options: updatedOptions };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleCheckboxTextChange = (elementId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, text: newText };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleElementTextChange = (elementId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, text: newText };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleQuillChange = (elementId, newText) => {
//     const updatedFormElements = formElements.map((element) => {
//       if (element.id === elementId) {
//         return { ...element, text: newText };
//       }
//       return element;
//     });
//     setFormElements(updatedFormElements);
//     onUpdate(section.id, text, updatedFormElements);
//   };

//   const handleQuestionSelect = (value, index) => {
//     const allQuestions = getAllQuestionsGrouped();
//     const selectedQuestion = allQuestions.find((q) => q.id === value?.id);
//     const updatedQuestions = [...selectedQuestions];
//     updatedQuestions[index] = selectedQuestion;
//     setSelectedQuestions(updatedQuestions);
//     const updatedAnswers = [...selectedAnswers];
//     updatedAnswers[index] = null;
//     setSelectedAnswers(updatedAnswers);
//   };

//   const handleSectionQuestionSelect = (value, index) => {
//     const allQuestions = getAllQuestionsGrouped();
//     const selectedQuestion = allQuestions.find((q) => q.id === value?.id);
//     const updatedQuestions = [...selectedSectionQuestions];
//     updatedQuestions[index] = selectedQuestion;
//     setSelectedSectionQuestions(updatedQuestions);
//     const updatedAnswers = [...selectedSectionAnswers];
//     updatedAnswers[index] = null;
//     setSelectedSectionAnswers(updatedAnswers);
//   };

//   const getAnswerOptions = (questionElement) => {
//     if (!questionElement) return [];
//     return questionElement.options?.map((option) => option.text) || [];
//   };

//   const renderOptions = (element, type = "text") => {
//     return (
//       <div className="mt-4 space-y-2">
//         {element.options &&
//           element.options.map((option, index) => (
//             <DraggableOption
//               key={option.id}
//               id={option.id}
//               index={index}
//               moveOption={moveOption}
//               elementId={element.id}
//             >
//               <div className="flex items-center gap-2 w-full">
//                 {type === "radio" && (
//                   <div className="h-4 w-4 rounded-full border border-gray-300" />
//                 )}
//                 {type === "checkbox" && (
//                   <div className="h-4 w-4 rounded border border-gray-300" />
//                 )}
//                 {type === "Yes/No" && (
//                   <div className="h-4 w-4 rounded-full border border-gray-300" />
//                 )}
//                 <Input
//                   placeholder="Option"
//                   value={option.text}
//                   className="flex-1"
//                   onChange={(e) =>
//                     handleOptionChange(element.id, option.id, e.target.value)
//                   }
//                 />
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => handleDeleteOption(element.id, option.id)}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </DraggableOption>
//           ))}
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleAddOption(element.id)}
//           className="mt-2"
//         >
//           <Plus className="h-4 w-4 mr-1" />
//           Add Option
//         </Button>
//       </div>
//     );
//   };

//   const ElementHeader = ({ label, element }) => (
//     <div className="flex items-center justify-between mb-1 w-full">
//       <span className="text-xs text-gray-500">{label}</span>
//       <div className="flex items-center gap-1">
//         {element?.questionsectionsettings?.conditional && (
          
//             <Badge variant="outline" className="mr-2 border-green-500 text-white bg-green-500">
//     Conditional question
//   </Badge>
//         )}
//         {element?.questionsectionsettings?.required && (
//           <span className="text-red-500 font-medium">*</span>
//         )}
//       </div>
//     </div>
//   );

 


//   const renderFormElement = (element) => {
//   const commonTextFieldProps = {
//     value: element.text,
//     onChange: (e) => handleElementTextChange(element.id, e.target.value),
//     placeholder: element.type,
//     className: "flex-1 w-full",
//   };

//   const actionButtons = (
//     <div className="flex gap-1 shrink-0">
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleSettingsClick(element.id)}
//             >
//               <Settings className="h-4 w-4" />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Settings</TooltipContent>
//         </Tooltip>
//       </TooltipProvider>
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleDeleteFormElement(element.id)}
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Delete</TooltipContent>
//         </Tooltip>
//       </TooltipProvider>
//     </div>
//   );

//   switch (element.type) {
//     case "Free Entry":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="Free Entry" element={element} />
//             <div className="flex items-start gap-2 w-full">
//               <Input {...commonTextFieldProps} />
//               {actionButtons}
//             </div>
//           </CardContent>
//         </Card>
//       );

//     case "Email":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="Email" element={element} />
//             <div className="flex items-start gap-2 w-full">
//               <Input type="email" {...commonTextFieldProps} />
//               {actionButtons}
//             </div>
//           </CardContent>
//         </Card>
//       );

//     case "Number":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="Number" element={element} />
//             <div className="flex items-start gap-2 w-full">
//               <Input type="text" inputMode="numeric" {...commonTextFieldProps} />
//               {actionButtons}
//             </div>
//           </CardContent>
//         </Card>
//       );

//    case "Date":
//   return (
//     <Card className="mb-4 w-full">
//       <CardContent className="p-3">
//         <ElementHeader label="Date" element={element} />
//         <div className="flex items-start gap-2 w-full">
//           <Input 
//             type="text" 
//             placeholder="MM/DD/YYYY"
//             {...commonTextFieldProps} 
//           />
//           {actionButtons}
//         </div>
//       </CardContent>
//     </Card>
//   );

//     case "Radio Buttons":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="Radio Button" element={element} />
//             <div className="flex items-start gap-2 mb-2 w-full">
//               <Input {...commonTextFieldProps} />
//               {actionButtons}
//             </div>
//             {renderOptions(element, "radio")}
//           </CardContent>
//         </Card>
//       );

//     case "Checkboxes":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="Checkbox" element={element} />
//             <div className="flex items-start gap-2 mb-2 w-full">
//               <Input
//                 {...commonTextFieldProps}
//                 onChange={(e) =>
//                   handleCheckboxTextChange(element.id, e.target.value)
//                 }
//               />
//               {actionButtons}
//             </div>
//             {renderOptions(element, "checkbox")}
//           </CardContent>
//         </Card>
//       );

//     case "Dropdown":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="Dropdown" element={element} />
//             <div className="flex items-start gap-2 mb-2 w-full">
//               <Input
//                 {...commonTextFieldProps}
//                 onChange={(e) =>
//                   handleCheckboxTextChange(element.id, e.target.value)
//                 }
//               />
//               {actionButtons}
//             </div>
//             {renderOptions(element)}
//           </CardContent>
//         </Card>
//       );

//     case "Yes/No":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="Yes/No" element={element} />
//             <div className="flex items-start gap-2 mb-2 w-full">
//               <Input {...commonTextFieldProps} />
//               {actionButtons}
//             </div>
//             {renderOptions(element, "Yes/No")}
//           </CardContent>
//         </Card>
//       );

//     case "File Upload":
//       return (
//         <Card className="mb-4 w-full">
//           <CardContent className="p-3">
//             <ElementHeader label="File Upload" element={element} />
//             <div className="flex items-start gap-2 mb-2 w-full">
//               <Input {...commonTextFieldProps} />
//               {actionButtons}
//             </div>
//             <Button variant="outline" disabled className="mt-2">
//               <CloudUpload className="h-4 w-4 mr-2" />
//               Upload files
//             </Button>
//           </CardContent>
//         </Card>
//       );

//     case "Text Editor":
//       return (
        
//         <Card className="mb-4 w-full h-auto">
//   <CardContent className="p-3 h-auto">
//     <ElementHeader label="Text Editor" element={element} />

//     <div className="flex items-start gap-2 w-full">
//       <div className="flex-1 w-full">
//         <ReactQuill
//           theme="snow"
//           value={element.text}
//           modules={modules}
//           formats={formats}
//           onChange={(newText) => handleQuillChange(element.id, newText)}
//           className="min-h-[200px]"
//         />
//       </div>

//       {actionButtons}
//     </div>
//   </CardContent>
// </Card>
//       );

//     default:
//       return null;
//   }
// };
//   return (
//     <Card>
//       <CardContent className="p-4">
//         {/* Section Header */}
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex-1 mr-4">
//             <Input
//               value={text}
//               onChange={handleTextChange}
//               placeholder="Section text"
//               className="bg-gray-50"
//             />
//           </div>
          
//          {sectionConditionBadge && (
//   <Badge variant="outline" className="mr-2 border-green-500 text-white bg-green-500">
//     Conditional section
//   </Badge>
// )}
          
//           <div className="flex gap-1">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button variant="ghost" size="sm" onClick={handleDuplicate}>
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Duplicate Section</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
            
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button variant="ghost" size="sm" onClick={handleSectionSettingsClick}>
//                     <Settings className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Section Settings</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
            
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button variant="ghost" size="sm" onClick={handleDelete}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Delete Section</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         </div>

//         {/* Form Elements */}
//         {formElements.map((element, index) => (
//           <DraggableQuestion
//             key={element.id}
//             id={element.id}
//             index={index}
//             moveQuestion={moveQuestion}
//           >
//             {renderFormElement(element)}
//           </DraggableQuestion>
//         ))}

//         {/* Add Element Buttons */}
//         <div className="flex gap-4 mt-6">
//           <Button onClick={(event) => setAnchorEl(event.currentTarget)}>
//             <Plus className="h-4 w-4 mr-2" />
//             Questions
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => handleAddFormElement("Text Editor")}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Text Block
//           </Button>
//         </div>
//       </CardContent>

//       {/* Add Question Menu - Using Dialog as popover替代 */}
//       <Dialog open={Boolean(anchorEl)} onOpenChange={() => setAnchorEl(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Question</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col gap-2">
//             {[
//               "Free Entry",
//               "Email",
//               "Number",
//               "Date",
//               "Radio Buttons",
//               "Checkboxes",
//               "Dropdown",
//               "Yes/No",
//               "File Upload",
//             ].map((type) => (
//               <Button
//                 key={type}
//                 variant="ghost"
//                 className="justify-start"
//                 onClick={() => handleAddFormElement(type)}
//               >
//                 {type}
//               </Button>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Section Settings Drawer */}
//       {isDrawerOpen && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => toggleDrawer(false)} />
//           <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
//             <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
//               <div>
//                 <h2 className="text-base font-semibold text-foreground">
//                   Section Settings
//                 </h2>
//                 <p className="text-sm text-muted-foreground">{text}</p>
//               </div>
//               <button onClick={() => toggleDrawer(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               {/* Repeat Section */}
//               <div className="border rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <Label htmlFor="repeat-section">Allow client to repeat</Label>
//                   <Switch
//                     id="repeat-section"
//                     checked={repeateButton}
//                     onCheckedChange={handleRepeateButton}
//                   />
//                 </div>
                
//                 {repeateButton && (
//                   <div className="mt-4">
//                     <Label className="text-sm mb-1 block">
//                       Button name (maximum 25 characters)
//                     </Label>
//                     <Input
//                       value={repeatButtonName}
//                       onChange={(e) => setRepeatButtonName(e.target.value)}
//                       maxLength={25}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Conditional Section */}
//               <div className="border rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <Label htmlFor="conditional-section">Conditional</Label>
//                   <Switch
//                     id="conditional-section"
//                     checked={conditionButton}
//                     onCheckedChange={handleConditionButton}
//                   />
//                 </div>
                
//                 {conditionButton && (
//                   <div className="mt-4 space-y-4">
//                     <div className="flex items-center justify-between">
//                       <h4 className="font-medium">Conditions</h4>
//                       <Button variant="ghost" size="sm" onClick={handleAddSectionQuestionAnswer}>
//                         <Plus className="h-4 w-4 mr-1" />
//                         Add
//                       </Button>
//                     </div>
//                     <Separator />
                    
//                     <div>
//                       <Label className="text-sm mb-1 block">Mode</Label>
//                       <Select value={sectionMode} onValueChange={setSectionMode}>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Any">Any</SelectItem>
//                           <SelectItem value="All">All</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {sectionQuestionAnswers.map((qa, index) => (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-end">
//                         <div className="col-span-5">
//                           <Label className="text-sm mb-1 block">Question</Label>
//                           <Select
//                             value={selectedSectionQuestions[index]?.id?.toString() || ""}
//                             onValueChange={(value) => {
//                               const allQuestions = getAllQuestionsGrouped();
//                               const selected = allQuestions.find(q => q.id.toString() === value);
//                               handleSectionQuestionSelect(selected, index);
//                             }}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select question" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {getAllQuestionsGrouped().map((q) => (
//                                 <SelectItem key={q.id} value={q.id.toString()}>
//                                   {q.sectionName}: {q.text}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="col-span-5">
//                           <Label className="text-sm mb-1 block">Answer</Label>
//                           <Select
//                             value={selectedSectionAnswers[index] || ""}
//                             onValueChange={(value) => {
//                               const updatedAnswers = [...selectedSectionAnswers];
//                               updatedAnswers[index] = value;
//                               setSelectedSectionAnswers(updatedAnswers);
//                             }}
//                             disabled={!selectedSectionQuestions[index]}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select answer" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {getAnswerOptions(selectedSectionQuestions[index]).map((answer) => (
//                                 <SelectItem key={answer} value={answer}>
//                                   {answer}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="col-span-2">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleRemoveQuestionAnswer(index)}
//                             className="text-red-500"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
//               <button
//                 onClick={() => toggleDrawer(false)}
//                 className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSectionSave}
//                 className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Question Settings Drawer */}
//       {queDrawerOpen && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setQueDrawerOpen(false)} />
//           <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-background shadow-xl flex flex-col">
//             <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
//               <h2 className="text-base font-semibold text-foreground">
//                 {selectedElement?.text || "Question Settings"}
//               </h2>
//               <button onClick={() => setQueDrawerOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               {/* Required Field */}
//               <div className="border rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <Label htmlFor="required">Required</Label>
//                   <Switch
//                     id="required"
//                     checked={requiredButton}
//                     onCheckedChange={handleRequiredButton}
//                   />
//                 </div>
//                 <Separator className="my-2" />
//                 <p className="text-xs text-muted-foreground">
//                   It is mandatory to respond to this question to submit the organizer
//                 </p>
//               </div>

//               {/* Pre-Filled Field */}
//               <div className="border rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <Label htmlFor="prefilled">Pre-Filled</Label>
//                   <Switch
//                     id="prefilled"
//                     checked={prefilledButton}
//                     onCheckedChange={handlePrefilledButton}
//                   />
//                 </div>
//                 <Separator className="my-2" />
//                 <p className="text-xs text-muted-foreground">
//                   If asked before, answer pre-populates from previous organizer
//                 </p>
//               </div>

//               {/* Conditional Field */}
//               <div className="border rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <Label htmlFor="conditional">Conditional</Label>
//                   <Switch
//                     id="conditional"
//                     checked={queConditionButton}
//                     onCheckedChange={handleQueConditionButton}
//                   />
//                 </div>
//                 <Separator className="my-2" />
//                 <p className="text-xs text-muted-foreground mb-4">
//                   Ask question only in certain scenarios
//                 </p>
                
//                 {queConditionButton && (
//                   <div className="mt-4 space-y-4">
//                     <div className="flex items-center justify-between">
//                       <h4 className="font-medium">Conditions</h4>
//                       <Button variant="ghost" size="sm" onClick={handleAddQuestionAnswer}>
//                         <Plus className="h-4 w-4 mr-1" />
//                         Add
//                       </Button>
//                     </div>
//                     <Separator />
                    
//                     <div>
//                       <Label className="text-sm mb-1 block">Mode</Label>
//                       <Select value={mode} onValueChange={setMode}>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Any">Any</SelectItem>
//                           <SelectItem value="All">All</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {questionAnswers.map((qa, index) => (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-end">
//                         <div className="col-span-5">
//                           <Label className="text-sm mb-1 block">Question</Label>
//                           <Select
//                             value={selectedQuestions[index]?.id?.toString() || ""}
//                             onValueChange={(value) => {
//                               const allQuestions = getAllQuestionsGrouped();
//                               const selected = allQuestions.find(q => q.id.toString() === value);
//                               handleQuestionSelect(selected, index);
//                             }}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select question" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {getAllQuestionsGrouped().map((q) => (
//                                 <SelectItem key={q.id} value={q.id.toString()}>
//                                   {q.sectionName}: {q.text}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="col-span-5">
//                           <Label className="text-sm mb-1 block">Answer</Label>
//                           <Select
//                             value={selectedAnswers[index] || ""}
//                             onValueChange={(value) => {
//                               const updatedAnswers = [...selectedAnswers];
//                               updatedAnswers[index] = value;
//                               setSelectedAnswers(updatedAnswers);
//                             }}
//                             disabled={!selectedQuestions[index]}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select answer" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {getAnswerOptions(selectedQuestions[index]).map((answer) => (
//                                 <SelectItem key={answer} value={answer}>
//                                   {answer}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="col-span-2">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleRemoveQuestionAnswer(index)}
//                             className="text-red-500"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Description Field */}
//               <div className="border rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Switch
//                     id="description"
//                     checked={descriptionButton}
//                     onCheckedChange={handleDescriptionButton}
//                   />
//                 </div>
//                 <Separator className="my-2" />
//                 <p className="text-xs text-muted-foreground mb-4">
//                   Add instructional text to help clients answer your question
//                 </p>
                
//                 {descriptionButton && (
//                   <Textarea
//                     placeholder="Description"
//                     value={descriptionText}
//                     onChange={(event) => setDescriptionText(event.target.value)}
//                     rows={4}
//                   />
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
//               <button
//                 onClick={() => setQueDrawerOpen(false)}
//                 className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// };

export default Section;
