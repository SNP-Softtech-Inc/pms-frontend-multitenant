import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDuplicate } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Input,
  Typography,
  Drawer,
  Divider,
  Switch,
  FormControlLabel,
  Autocomplete,
  Paper,Grid,Tooltip,Stack,Chip,CardContent,InputAdornment,Card,Radio,Checkbox
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill Snow theme
import "quill-emoji/dist/quill-emoji.css"; // Emoji styles
import Quill from "quill";
import "quill-emoji";
import { useDrag, useDrop } from "react-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
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
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: "#fff",
        border: isDragging ? "2px dashed #1976d2" : "1px solid #ddd",
        borderRadius: "4px",
        display: "flex",
        // alignItems: 'center'
      }}
    >
      <DragIndicatorIcon style={{ cursor: "move", marginRight: "8px" }} />
      {children}
    </div>
  );
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
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <DragIndicatorIcon style={{ cursor: "move", marginRight: "8px" }} />
      {children}
    </div>
  );
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

  // Quill editor modules and formats
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

  // Move question handler
  const moveQuestion = (dragIndex, hoverIndex) => {
    const draggedItem = formElements[dragIndex];
    const newFormElements = [...formElements];
    newFormElements.splice(dragIndex, 1);
    newFormElements.splice(hoverIndex, 0, draggedItem);
    setFormElements(newFormElements);
    onUpdate(section.id, text, newFormElements);
  };

  // Move option handler
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

  // Section save handler
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

  // Clear form handler
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

  // Save form element handler
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

  // Effect for selected element
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

  // Effect for section
  useEffect(() => {
    setSectionConditionBadge(section?.sectionsettings?.conditional);
  }, [section]);

  // Effect for text and form elements
  useEffect(() => {
    setText(section.text);
    setFormElements(section.formElements);
  }, [section]);

  // Handlers
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

  // Render options for radio, checkbox, dropdown
  const renderOptions = (element, type = "text") => {
    return (
      <Box sx={{ mt: 2 }}>
        {element.options &&
          element.options.map((option, index) => (
            <DraggableOption
              key={option.id}
              id={option.id}
              index={index}
              moveOption={moveOption}
              elementId={element.id}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {/* <DragIndicatorIcon sx={{ cursor: 'grab', color: 'grey.500' }} /> */}
                {type === "radio" ? (
                  <Radio disabled size="small" />
                ) : type === "checkbox" ? (
                  <Checkbox disabled size="small" />
                ) : type === "Yes/No" ? (
                  <Radio disabled size="small" />
                ) : null}
                <TextField
                  variant="outlined"
                  placeholder="Option"
                  value={option.text}
                  size="small"
                  fullWidth
                  onChange={(e) =>
                    handleOptionChange(element.id, option.id, e.target.value)
                  }
                />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteOption(element.id, option.id)}
                >
                  <RiDeleteBinLine />
                </IconButton>
              </Box>
            </DraggableOption>
          ))}
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleAddOption(element.id)}
          sx={{ mt: 1 }}
        >
          Add Option
        </Button>
      </Box>
    );
  };

  // Render form element based on type
  const renderFormElement = (element) => {
    const commonElementProps = {
      key: element.id,
      sx: { mb: 2, width:"100%" }
    };

    const commonTextFieldProps = {
      variant: "outlined",
      value: element.text,
      size: "small",
      fullWidth: true,
      // sx: { backgroundColor: "#fff" },
      onChange: (e) => handleElementTextChange(element.id, e.target.value),
    };


    const actionButtons = (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Settings">
          <IconButton size="small" onClick={() => handleSettingsClick(element.id)}>
            <IoSettingsOutline fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => handleDeleteFormElement(element.id)}>
            <RiDeleteBinLine fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

  const elementHeader = (label, element = {}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // 🔥 key change
      mb: 0.5,
      width: "100%",
    }}
  >
    {/* LEFT SIDE (Label) */}
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    {/* RIGHT SIDE (Badges) */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {element?.questionsectionsettings?.conditional && (
        <Chip label="Conditional" size="small" color="success" />
      )}

      {element?.questionsectionsettings?.required && (
        <Typography sx={{ color: "error.main", fontWeight: 500 }}>
          *
        </Typography>
      )}
    </Box>
  </Box>
);

    switch (element.type) {
      case "Free Entry":
        return (
          <Box {...commonElementProps}>
            {elementHeader("Free Entry",element)}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <TextField
                {...commonTextFieldProps}
                placeholder="Free Entry"
                
              />
              {actionButtons}
            </Box>
          </Box>
        );

      case "Email":
        return (
          <Box {...commonElementProps}>
            {elementHeader("Email",element)}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <TextField
                {...commonTextFieldProps}
                placeholder="Email"
                type="email"
                
              />
              {actionButtons}
            </Box>
          </Box>
        );

      case "Number":
        return (
          <Box {...commonElementProps}>
            {elementHeader("Number",element)}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <TextField
                {...commonTextFieldProps}
                placeholder="Number"
                // type="number"
                
              />
              {actionButtons}
            </Box>
          </Box>
        );

      case "Date":
        return (
          <Box {...commonElementProps} >
            {elementHeader("Date",element)}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <TextField
                {...commonTextFieldProps}
                placeholder="Date"
                // type="date"
                InputLabelProps={{ shrink: true }}
                
              />
              {actionButtons}
            </Box>
          </Box>
        );

      case "Radio Buttons":
        return (
          <Card variant="outlined" sx={{ mb: 2, p: 1 ,width:"100%"}}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              {elementHeader("Radio Button",element)}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <TextField
                  {...commonTextFieldProps}
                  placeholder="Radio Buttons"
                  
                />
                {actionButtons}
              </Box>
              {renderOptions(element, "radio")}
            </CardContent>
          </Card>
        );

      case "Checkboxes":
        return (
          <Card variant="outlined" sx={{ mb: 2, p: 1,width:"100%" }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              {elementHeader("Checkbox",element)}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <TextField
                  {...commonTextFieldProps}
                  placeholder="Checkboxes"
                  onChange={(e) =>
                    handleCheckboxTextChange(element.id, e.target.value)
                  }
                  
                />
                {actionButtons}
              </Box>
              {renderOptions(element, "checkbox")}
            </CardContent>
          </Card>
        );

      case "Dropdown":
        return (
          <Card variant="outlined" sx={{ mb: 2, p: 1 ,width:"100%"}}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              {elementHeader("Dropdown",element)}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <TextField
                  {...commonTextFieldProps}
                  placeholder="Dropdown"
                  onChange={(e) =>
                    handleCheckboxTextChange(element.id, e.target.value)
                  }
                  
                />
                {actionButtons}
              </Box>
              {renderOptions(element)}
            </CardContent>
          </Card>
        );

      case "Yes/No":
        return (
          <Card variant="outlined" sx={{ mb: 2, p: 1,width:"100%" }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              {elementHeader("Yes/No",element)}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <TextField
                  {...commonTextFieldProps}
                  placeholder="Yes/No"
                  
                />
                {actionButtons}
              </Box>
              {renderOptions(element, "Yes/No")}
            </CardContent>
          </Card>
        );

      case "File Upload":
        return (
          <Card variant="outlined" sx={{ mb: 2, p: 1,width:"100%" }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              {elementHeader("File Upload",element)}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <TextField
                  {...commonTextFieldProps}
                  placeholder="File Upload"
                  
                />
                {actionButtons}
              </Box>
              <Button
                component="label"
                variant="outlined"
                disabled
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
              >
                Upload files
              </Button>
            </CardContent>
          </Card>
        );

      case "Text Editor":
        return (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <ReactQuill
                  theme="snow"
                  value={element.text}
                  modules={modules}
                  formats={formats}
                  onChange={(newText) => handleQuillChange(element.id, newText)}
                  style={{ height: '200px', marginBottom: '50px' }}
                />
              </Box>
              {actionButtons}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card 
      variant="outlined" 
    
    >
      <CardContent>
        {/* Section Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <TextField
              variant="outlined"
              fullWidth
              value={text}
              size="small"
              onChange={handleTextChange}
              placeholder="Section text"
              sx={{ backgroundColor: '#fafafa' }}
            />
          </Box>
          
          {sectionConditionBadge && (
            <Chip
              label="Conditional"
              color="success"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Duplicate Section">
              <IconButton size="small" onClick={handleDuplicate}>
                <HiOutlineDuplicate />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Section Settings">
              <IconButton size="small" onClick={handleSectionSettingsClick}>
                <IoSettingsOutline />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Delete Section">
              <IconButton size="small" onClick={handleDelete}>
                <RiDeleteBinLine />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

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
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            startIcon={<AddIcon />}
          >
            Questions
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleAddFormElement("Text Editor")}
            startIcon={<AddIcon />}
          >
            Text Block
          </Button>
        </Stack>
      </CardContent>

      {/* Add Question Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
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
          <MenuItem key={type} onClick={() => handleAddFormElement(type)}>
            {type}
          </MenuItem>
        ))}
      </Menu>

      {/* Section Settings Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600, md: 800 } } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            p: 2,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Section Settings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {text}
              </Typography>
            </Box>
            <IconButton onClick={() => toggleDrawer(false)}>
              <IoMdClose />
            </IconButton>
          </Box>

          {/* Drawer Content */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {/* Repeat Section */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={repeateButton}
                      onChange={(event) => handleRepeateButton(event.target.checked)}
                      color="primary"
                    />
                  }
                  label="Allow client to repeat"
                />
              </Box>
              
              {repeateButton && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Button name (maximum 25 characters)
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={repeatButtonName}
                    onChange={(e) => setRepeatButtonName(e.target.value)}
                    inputProps={{ maxLength: 25 }}
                  />
                </Box>
              )}
            </Paper>

            {/* Conditional Section */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={conditionButton}
                      onChange={(event) => handleConditionButton(event.target.checked)}
                      color="primary"
                    />
                  }
                  label="Conditional"
                />
              </Box>
              
              {conditionButton && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Conditions
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddSectionQuestionAnswer}
                    >
                      Add
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Mode</Typography>
                    <Autocomplete
                      options={["Any", "All"]}
                      value={sectionMode}
                      onChange={(event, newValue) => setSectionMode(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                        />
                      )}
                      size="small"
                    />
                  </Box>

                  {sectionQuestionAnswers.map((qa, index) => (
                    <Grid container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={index} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="body2" gutterBottom>Question</Typography>
                        <Autocomplete
                          options={getAllQuestionsGrouped()}
                          getOptionLabel={(option) => option.text || ""}
                          groupBy={(option) => option.sectionName}
                          value={selectedSectionQuestions[index] || null}
                          onChange={(event, newValue) =>
                            handleSectionQuestionSelect(newValue, index)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              placeholder="Select question"
                            />
                          )}
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="body2" gutterBottom>Answer</Typography>
                        <Autocomplete
                          options={getAnswerOptions(selectedSectionQuestions[index])}
                          value={selectedSectionAnswers[index] || null}
                          onChange={(event, newValue) => {
                            const updatedAnswers = [...selectedSectionAnswers];
                            updatedAnswers[index] = newValue;
                            setSelectedSectionAnswers(updatedAnswers);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              placeholder="Select answer"
                            />
                          )}
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Box sx={{ mt: 4 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveQuestionAnswer(index)}
                            color="error"
                          >
                            <RiDeleteBinLine />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              )}
            </Paper>

            {/* Save/Cancel Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleSectionSave}
               
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => toggleDrawer(false)}
               
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Question Settings Drawer */}
      <Drawer
        anchor="right"
        open={queDrawerOpen}
        onClose={() => setQueDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            p: 2,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="h6">
              {selectedElement?.text || "Question Settings"}
            </Typography>
            <IconButton onClick={() => setQueDrawerOpen(false)}>
              <IoMdClose />
            </IconButton>
          </Box>

          {/* Drawer Content */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {/* Required Field */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={requiredButton}
                      onChange={(event) => handleRequiredButton(event.target.checked)}
                      color="primary"
                    />
                  }
                  label="Required"
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary">
                It is mandatory to respond to this question to submit the organizer
              </Typography>
            </Paper>

            {/* Pre-Filled Field */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={prefilledButton}
                      onChange={(event) => handlePrefilledButton(event.target.checked)}
                      color="primary"
                    />
                  }
                  label="Pre-Filled"
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary">
                If asked before, answer pre-populates from previous organizer
              </Typography>
            </Paper>

            {/* Conditional Field */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={queConditionButton}
                      onChange={(event) => handleQueConditionButton(event.target.checked)}
                      color="primary"
                    />
                  }
                  label="Conditional"
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                Ask question only in certain scenarios
              </Typography>
              
              {queConditionButton && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Conditions
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddQuestionAnswer}
                    >
                      Add
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Mode</Typography>
                    <Autocomplete
                      options={["Any", "All"]}
                      value={mode}
                      onChange={(event, newValue) => setMode(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                        />
                      )}
                      size="small"
                    />
                  </Box>

                  {questionAnswers.map((qa, index) => (
                    <Grid container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={index} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="body2" gutterBottom>Question</Typography>
                        <Autocomplete
                          options={getAllQuestionsGrouped()}
                          getOptionLabel={(option) => option.text || ""}
                          groupBy={(option) => option.sectionName}
                          value={selectedQuestions[index] || null}
                          onChange={(event, newValue) =>
                            handleQuestionSelect(newValue, index)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              placeholder="Select question"
                            />
                          )}
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="body2" gutterBottom>Answer</Typography>
                        <Autocomplete
                          options={getAnswerOptions(selectedQuestions[index])}
                          value={selectedAnswers[index] || null}
                          onChange={(event, newValue) => {
                            const updatedAnswers = [...selectedAnswers];
                            updatedAnswers[index] = newValue;
                            setSelectedAnswers(updatedAnswers);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              placeholder="Select answer"
                            />
                          )}
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Box sx={{ mt: 4 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveQuestionAnswer(index)}
                            color="error"
                          >
                            <RiDeleteBinLine />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              )}
            </Paper>

            {/* Description Field */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={descriptionButton}
                      onChange={(event) => handleDescriptionButton(event.target.checked)}
                      color="primary"
                    />
                  }
                  label="Description"
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                Add instructional text to help clients answer your question
              </Typography>
              
              {descriptionButton && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Description"
                  variant="outlined"
                  margin="normal"
                  value={descriptionText}
                  onChange={(event) => setDescriptionText(event.target.value)}
                />
              )}
            </Paper>

            {/* Save/Cancel Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ borderRadius: "15px", px: 4 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setQueDrawerOpen(false)}
                sx={{ borderRadius: "15px", px: 4 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Card>
  );
};


export default Section;
