import {
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
  IconButton,
  Box,
  TextField,
  Button,
  Input,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useCallback, useContext } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { debounce } from "lodash";

import { organizerAPI } from "../../../services/api";

const OrganizerDialog = ({ open, handleClose, organizer, accountid }) => {
  const sections = organizer?.sections;
  console.log("sections", sections);
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [uploadedFiles, setUploadedFiles] = useState({}); // Stores file names for each file upload question
  const [file, setFile] = useState(null);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  // Create a debounced auto-save function

  const debouncedAutoSave = useCallback(
    debounce(async (data) => {
      try {
        await organizerAPI.autoSaveOrganizer(organizer._id, data);
        console.log("Auto-save successful");
      } catch (error) {
        console.error("Error auto-saving organizer:", error);
      }
    }, 2000),
    [organizer?._id],
  );
  // Function to prepare data for submission (used by both auto-save and submit)
  const prepareSubmitData = (finalSubmit = false) => {
    return {
      sections:
        organizer?.sections?.map((section) => ({
          name: section?.text || "",
          id: section?.id?.toString() || "",
          text: section?.text || "",
          sectionsettings: section?.sectionsettings,
          formElements:
            section?.formElements?.map((question) => ({
              type: question?.type || "",
              id: question?.id || "",
              sectionid: section?.id || "",
              options:
                question?.options?.map((option) => ({
                  id: option?.id || "",
                  text: option?.text || "",
                  selected: getOptionSelectedState(
                    question,
                    option,
                    section.id,
                  ),
                })) || [],
              text: question?.text || "",
              textvalue: getQuestionTextValue(question, section.id),
              questionsectionsettings: question?.questionsectionsettings,
              ...(question.type === "File Upload" && {
                fileMetadata: {
                  fileName:
                    uploadedFiles[`${section.id}_${question.text}`] || "",
                  // Add other metadata like upload date, size, etc.
                },
              }),
            })) || [],
        })) || [],
      status: finalSubmit ? "Completed" : "In Progress",
      // completedby:loginuserid,
      active: true,
      lastSaved: new Date().toISOString(),
    };
  };

  // Auto-save whenever relevant state changes
  useEffect(() => {
    if (open && organizer?._id) {
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);
    }
  }, [
    open,
    organizer?._id,
    inputValues,
    radioValues,
    checkboxValues,
    selectedYesNoValues,
    selectedDropdownValues,
    startDate,
    uploadedFiles,
    debouncedAutoSave,
  ]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

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

  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;
    const conditions = section.sectionsettings.conditions || [];

    return conditions.every((condition) => {
      if (!condition.question || !condition.answer) return false;

      for (const key in radioValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          radioValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in checkboxValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          checkboxValues[key]?.[condition.answer]
        ) {
          return true;
        }
      }

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedDropdownValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedYesNoValues[key] === condition.answer
        ) {
          return true;
        }
      }
      return false;
    });
  };

  const getVisibleSections = () => (sections || []).filter(shouldShowSection);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    const conditions = settings?.conditions || [];

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      for (const key in radioValues) {
        if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in checkboxValues) {
        if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      return false;
    }

    return true;
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

  const handleSubmit = async () => {
    try {
      const data = prepareSubmitData(true);

      if (data.status === "Completed") {
        await organizerAPI.completeAndNotifyOrganizer(organizer._id, data);
      } else {
        await organizerAPI.updateOrganizerAccountWise(organizer._id, data);
      }

      toast.success("Organizer updated successfully");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update organizer");
    }
  };

  const getQuestionTextValue = (question, sectionId) => {
    const key = `${sectionId}_${question.text}`;

    switch (question.type) {
      case "Free Entry":
      case "Email":
      case "Number":
        return inputValues[key] || "";
      case "Radio Buttons":
        return radioValues[key] || "";
      case "Checkboxes":
        return checkboxValues[key]
          ? Object.keys(checkboxValues[key])
              .filter((k) => checkboxValues[key][k])
              .join(", ")
          : "";
      case "Yes/No":
        return selectedYesNoValues[key] || "";
      case "Dropdown":
        return selectedDropdownValues[key] || "";
      case "Date":
        return startDate?.toISOString() || "";
      case "Text Editor":
        return question.text || "";
      case "File Upload":
        return uploadedFiles[key] || "";
      default:
        return "";
    }
  };

  const getOptionSelectedState = (question, option, sectionId) => {
    const key = `${sectionId}_${question.text}`;
    switch (question.type) {
      case "Radio Buttons":
        return radioValues[key] === option.text;
      case "Checkboxes":
        return checkboxValues[key]?.[option.text] || false;
      case "Yes/No":
        return selectedYesNoValues[key] === option.text;
      case "Dropdown":
        return selectedDropdownValues[key] === option.text;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (organizer?.sections) {
      const newInputValues = {};
      const newRadioValues = {};
      const newCheckboxValues = {};
      const newSelectedYesNoValues = {};
      const newSelectedDropdownValues = {};
      const newAnsweredElements = {};
      const newUploadedFiles = {};
      let initialDate = dayjs();

      organizer.sections.forEach((section) => {
        section.formElements.forEach((element) => {
          const key = `${section.id}_${element.text}`;

          if (element.textvalue) {
            newAnsweredElements[key] = true;

            switch (element.type) {
              case "Free Entry":
              case "Email":
              case "Number":
                newInputValues[key] = element.textvalue;
                break;
              case "Radio Buttons":
                newRadioValues[key] = element.textvalue;
                break;
              case "Checkboxes":
                const selectedOptions = element.textvalue
                  .split(",")
                  .map((s) => s.trim());
                newCheckboxValues[key] = {};
                element.options.forEach((option) => {
                  newCheckboxValues[key][option.text] =
                    selectedOptions.includes(option.text);
                });
                break;
              case "Yes/No":
                newSelectedYesNoValues[key] = element.textvalue;
                break;
              case "Dropdown":
                newSelectedDropdownValues[key] = element.textvalue;
                break;
              case "Date":
                initialDate = dayjs(element.textvalue);
                break;
              case "File Upload":
                // If there's a textvalue, assume it's a file name
                if (element.textvalue) {
                  newUploadedFiles[key] = element.textvalue;
                }
                break;
            }
          }
        });
      });

      setInputValues(newInputValues);
      setRadioValues(newRadioValues);
      setCheckboxValues(newCheckboxValues);
      setSelectedYesNoValues(newSelectedYesNoValues);
      setSelectedDropdownValues(newSelectedDropdownValues);
      setAnsweredElements(newAnsweredElements);
      setStartDate(initialDate);
      setUploadedFiles(newUploadedFiles);
    }
  }, [organizer]);

  const isElementActive = (element) => {
    if (organizer?.issealed) return true;
    return element.active === true;
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog fullScreen open={open} onClose={handleClose}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" component="p">
              {organizer?.organizerName || "Organizer"}
            </Typography>
            <IconButton edge="end" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl
              fullWidth
              sx={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <Select
                value={activeStep}
                onChange={handleDropdownChange}
                size="small"
              >
                {visibleSections.map((section, index) => {
                  const visibleElements = section.formElements.filter((el) =>
                    shouldShowElement(el, section.id),
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
                    <MenuItem key={section.id} value={index}>
                      {section.text} ({answeredCount}/{totalVisibleElements})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box mt={2} mb={2}>
              <LinearProgress
                variant="determinate"
                value={((activeStep + 1) / totalSteps) * 100}
              />
            </Box>

            <Box sx={{ pl: 20, pr: 20 }}>
              {visibleSections.map(
                (section, sectionIndex) =>
                  sectionIndex === activeStep && (
                    <Box key={section.id}>
                      {section.formElements.map(
                        (element) =>
                          shouldShowElement(element, section.id) && (
                            <Box key={`${section.id}_${element.id}`}>
                              {element.type === "Text Editor" && (
                                <Box mt={2} mb={2}>
                                  <Typography>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: element.text,
                                      }}
                                    />
                                  </Typography>
                                </Box>
                              )}

                              {(element.type === "Free Entry" ||
                                element.type === "Email") && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <TextField
                                    disabled={isElementActive(element)}
                                    variant="outlined"
                                    size="small"
                                    multiline
                                    fullWidth
                                    placeholder={`${element.type} Answer`}
                                    inputProps={{
                                      type:
                                        element.type === "Free Entry"
                                          ? "text"
                                          : element.type.toLowerCase(),
                                    }}
                                    maxRows={8}
                                    style={{ display: "block" }}
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
                                </Box>
                              )}

                              {element.type === "Number" && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <TextField
                                    disabled={isElementActive(element)}
                                    variant="outlined"
                                    size="small"
                                    multiline
                                    fullWidth
                                    placeholder={`${element.type} Answer`}
                                    inputProps={{
                                      type: "text",
                                      inputMode: "numeric",
                                      pattern: "[0-9]*",
                                    }}
                                    maxRows={8}
                                    style={{
                                      display: "block",
                                      marginTop: "15px",
                                    }}
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
                                </Box>
                              )}

                              {element.type === "Radio Buttons" && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {element.options.map((option) => (
                                      <Button
                                        key={option.text}
                                        variant={
                                          radioValues[
                                            `${section.id}_${element.text}`
                                          ] === option.text
                                            ? "contained"
                                            : "outlined"
                                        }
                                        disabled={isElementActive(element)}
                                        onClick={() =>
                                          !isElementActive(element) &&
                                          handleRadioChange(
                                            option.text,
                                            element.text,
                                            section.id,
                                          )
                                        }
                                        sx={{
                                          borderRadius: "15px",
                                        }}
                                      >
                                        {option.text}
                                      </Button>
                                    ))}
                                  </Box>
                                </Box>
                              )}

                              {element.type === "Checkboxes" && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {element.options.map((option) => (
                                      <Button
                                        key={option.text}
                                        variant={
                                          checkboxValues[
                                            `${section.id}_${element.text}`
                                          ]?.[option.text]
                                            ? "contained"
                                            : "outlined"
                                        }
                                        disabled={isElementActive(element)}
                                        onClick={() =>
                                          !isElementActive(element) &&
                                          handleCheckboxChange(
                                            option.text,
                                            element.text,
                                            section.id,
                                          )
                                        }
                                        sx={{
                                          borderRadius: "15px",
                                        }}
                                      >
                                        {option.text}
                                      </Button>
                                    ))}
                                  </Box>
                                </Box>
                              )}

                              {element.type === "Yes/No" && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    {element.options.map((option) => (
                                      <Button
                                        key={option.text}
                                        variant={
                                          selectedYesNoValues[
                                            `${section.id}_${element.text}`
                                          ] === option.text
                                            ? "contained"
                                            : "outlined"
                                        }
                                        disabled={isElementActive(element)}
                                        onClick={() =>
                                          !isElementActive(element) &&
                                          handleYesNoChange(
                                            option.text,
                                            element.text,
                                            section.id,
                                          )
                                        }
                                        sx={{
                                          borderRadius: "15px",
                                        }}
                                      >
                                        {option.text}
                                      </Button>
                                    ))}
                                  </Box>
                                </Box>
                              )}

                              {element.type === "Dropdown" && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <FormControl fullWidth>
                                    <Select
                                      value={
                                        selectedDropdownValues[
                                          `${section.id}_${element.text}`
                                        ] || ""
                                      }
                                      disabled={isElementActive(element)}
                                      onChange={(event) =>
                                        handleDropdownValueChange(
                                          event,
                                          element.text,
                                          section.id,
                                        )
                                      }
                                      size="small"
                                    >
                                      {element.options.map((option) => (
                                        <MenuItem
                                          key={option.text}
                                          value={option.text}
                                        >
                                          {option.text}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                              )}

                              {element.type === "Date" && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <DatePicker
                                    format="MM/DD/YYYY"
                                    sx={{
                                      width: "100%",
                                      backgroundColor: "#fff",
                                    }}
                                    value={startDate}
                                    disabled={isElementActive(element)}
                                    onChange={(newValue) => {
                                      if (!isElementActive(element)) {
                                        setStartDate(newValue);
                                        setAnsweredElements((prev) => ({
                                          ...prev,
                                          [`${section.id}_${element.text}`]: true,
                                        }));
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField {...params} size="small" />
                                    )}
                                  />
                                </Box>
                              )}

                              {/* {element.type === "File Upload" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                This file upload question
                              </Box>
                            )} */}
                              {element.type === "File Upload" && (
                                <Box mt={2}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    gutterBottom
                                    sx={{ fontWeight: "550" }}
                                  >
                                    {element.text}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      component="label"
                                      htmlFor={`fileInput_${section.id}_${element.id}`}
                                      sx={{
                                        cursor: isElementActive(element)
                                          ? "default"
                                          : "pointer",
                                      }}
                                    >
                                      Upload Document
                                    </Typography>
                                    <Input
                                      type="file"
                                      id={`fileInput_${section.id}_${element.id}`}
                                      onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        if (selectedFile) {
                                          setFile(selectedFile);
                                          setIsDocumentForm(true);
                                          // Store the temporary file name in state
                                          const key = `${section.id}_${element.text}`;
                                          setUploadedFiles((prev) => ({
                                            ...prev,
                                            [key]: selectedFile.name,
                                          }));
                                          setAnsweredElements((prev) => ({
                                            ...prev,
                                            [key]: true,
                                          }));
                                        }
                                      }}
                                      sx={{ display: "none" }}
                                      disabled={isElementActive(element)}
                                    />
                                  </Box>
                                  {uploadedFiles[
                                    `${section.id}_${element.text}`
                                  ] && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mt: 1,
                                      }}
                                    >
                                      <Typography variant="caption">
                                        Selected file:{" "}
                                        {
                                          uploadedFiles[
                                            `${section.id}_${element.text}`
                                          ]
                                        }
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          const key = `${section.id}_${element.text}`;
                                          setUploadedFiles((prev) => {
                                            const newState = { ...prev };
                                            delete newState[key];
                                            return newState;
                                          });
                                          setAnsweredElements((prev) => ({
                                            ...prev,
                                            [key]: false,
                                          }));
                                          // Trigger auto-save with the removed file
                                          const data = prepareSubmitData(false);
                                          debouncedAutoSave(data);
                                        }}
                                        disabled={isElementActive(element)}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              )}
                            </Box>
                          ),
                      )}
                    </Box>
                  ),
              )}

              <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
              >
                <Box display="flex" gap={3} alignItems="center">
                  {activeStep > 0 && (
                    <Button onClick={handleBack} variant="outlined">
                      <ArrowBackIcon fontSize="small" />
                    </Button>
                  )}

                  {activeStep < totalSteps - 1 ? (
                    <Button onClick={handleNext} variant="contained">
                      Next{" "}
                      <ArrowForwardIcon
                        fontSize="small"
                        sx={{ marginLeft: 2 }}
                      />
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleSubmit}>
                      Submit
                    </Button>
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography>
                    Step {activeStep + 1} of {totalSteps}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </LocalizationProvider>
    </>
  );
};

export default OrganizerDialog;
