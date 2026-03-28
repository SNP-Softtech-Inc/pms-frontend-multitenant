
// OrganizerPreview.js
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogContent,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// const OrganizerPreview = ({ open, onClose, organizerData }) => {
//   const {
//     organizerName,
//     sections,
//     shouldShowElement,
//     stripHtmlTags,
//   } = organizerData;
// console.log("sections",shouldShowElement)
//   // Preview state
//   const [activeStep, setActiveStep] = useState(0);
//   const [startDate, setStartDate] = useState(null);
//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
//   const [inputValues, setInputValues] = useState({});
//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
//   const [answeredElements, setAnsweredElements] = useState({});

//   // Get visible sections based on conditions
//   const visibleSections = useMemo(() => {
//     return sections.filter(section => {
//       if (!section.sectionsettings?.conditional) return true;
      
//       const conditions = section.sectionsettings.conditions || [];
//       const mode = section.sectionsettings.mode || "All";
      
//       if (conditions.length === 0) return true;
      
//       let matchedConditions = 0;
      
//       conditions.forEach((condition) => {
//         if (!condition.question || !condition.answer) return;
        
//         let conditionMet = false;
        
//         // Check radio values
//         for (const key in radioValues) {
//           const [checkSectionId] = key.split('_');
//           if (key.endsWith(`_${condition.question}`) && 
//               radioValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
        
//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") return;
//           return;
//         }
        
//         // Check checkbox values
//         for (const key in checkboxValues) {
//           const [checkSectionId] = key.split('_');
//           if (key.endsWith(`_${condition.question}`) && 
//               checkboxValues[key]?.[condition.answer]) {
//             conditionMet = true;
//             break;
//           }
//         }
        
//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") return;
//           return;
//         }
        
//         // Check dropdown values
//         for (const key in selectedDropdownValues) {
//           const [checkSectionId] = key.split('_');
//           if (key.endsWith(`_${condition.question}`) && 
//               selectedDropdownValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
//           }
//         }
        
//         if (conditionMet) {
//           matchedConditions++;
//           if (mode === "Any") return;
//           return;
//         }
        
//         // Check yes/no values
//         for (const key in selectedYesNoValues) {
//           const [checkSectionId] = key.split('_');
//           if (key.endsWith(`_${condition.question}`) && 
//               selectedYesNoValues[key] === condition.answer) {
//             conditionMet = true;
//             break;
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
//     });
//   }, [sections, radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues]);

//   const totalSteps = visibleSections.length;

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep(prev => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep(prev => prev - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     setActiveStep(event.target.value);
//   };

//   const handleRadioChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setRadioValues(prev => ({ ...prev, [key]: value }));
//     setAnsweredElements(prev => ({ ...prev, [key]: true }));
//   };

//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setCheckboxValues(prev => ({
//       ...prev,
//       [key]: {
//         ...prev[key],
//         [value]: !prev[key]?.[value],
//       },
//     }));
//     setAnsweredElements(prev => ({ ...prev, [key]: true }));
//   };

//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedYesNoValues(prev => ({ ...prev, [key]: value }));
//     setAnsweredElements(prev => ({ ...prev, [key]: true }));
//   };

//   const handleInputChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setInputValues(prev => ({ ...prev, [key]: event.target.value }));
//     setAnsweredElements(prev => ({ ...prev, [key]: true }));
//   };

//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedDropdownValues(prev => ({ ...prev, [key]: event.target.value }));
//     setAnsweredElements(prev => ({ ...prev, [key]: true }));
//   };

//   const handleStartDateChange = (date, elementText, sectionId) => {
//     setStartDate(date);
//     const key = `${sectionId}_${elementText}`;
//     setAnsweredElements(prev => ({ ...prev, [key]: true }));
//   };

//   // Render form element based on type
//   const renderFormElement = (element, sectionId) => {
//     switch (element.type) {
//       case "Text Editor":
//         return (
//           <Box mt={2} mb={2} key={element.id}>
//             <Typography>{stripHtmlTags(element.text)}</Typography>
//           </Box>
//         );

//       case "Free Entry":
//       case "Email":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <TextField
//               variant="outlined"
//               size="small"
//               multiline
//               fullWidth
//               placeholder={`${element.type} Answer`}
//               inputProps={{
//                 type: element.type === "Free Entry" ? "text" : element.type.toLowerCase(),
//               }}
//               maxRows={8}
//               value={inputValues[`${sectionId}_${element.text}`] || ""}
//               onChange={(e) => handleInputChange(e, element.text, sectionId)}
//             />
//           </Box>
//         );

//       case "Number":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <TextField
//               variant="outlined"
//               size="small"
//               multiline
//               fullWidth
//               placeholder="Number Answer"
//               inputProps={{
//                 type: "text",
//                 inputMode: "numeric",
//                 pattern: "[0-9]*",
//               }}
//               value={inputValues[`${sectionId}_${element.text}`] || ""}
//               onChange={(e) => {
//                 const numericValue = e.target.value.replace(/\D/g, "");
//                 handleInputChange({ target: { value: numericValue } }, element.text, sectionId);
//               }}
//             />
//           </Box>
//         );

//       case "Radio Buttons":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//               {element.options.map((option) => (
//                 <Button
//                   key={option.text}
//                   variant={
//                     radioValues[`${sectionId}_${element.text}`] === option.text
//                       ? "contained"
//                       : "outlined"
//                   }
//                   onClick={() => handleRadioChange(option.text, element.text, sectionId)}
//                 >
//                   {option.text}
//                 </Button>
//               ))}
//             </Box>
//           </Box>
//         );

//       case "Checkboxes":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//               {element.options.map((option) => (
//                 <Button
//                   key={option.text}
//                   variant={
//                     checkboxValues[`${sectionId}_${element.text}`]?.[option.text]
//                       ? "contained"
//                       : "outlined"
//                   }
//                   onClick={() => handleCheckboxChange(option.text, element.text, sectionId)}
//                 >
//                   {option.text}
//                 </Button>
//               ))}
//             </Box>
//           </Box>
//         );

//       case "Yes/No":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <Box sx={{ display: "flex", gap: 1 }}>
//               {element.options.map((option) => (
//                 <Button
//                   key={option.text}
//                   variant={
//                     selectedYesNoValues[`${sectionId}_${element.text}`] === option.text
//                       ? "contained"
//                       : "outlined"
//                   }
//                   onClick={() => handleYesNoChange(option.text, element.text, sectionId)}
//                 >
//                   {option.text}
//                 </Button>
//               ))}
//             </Box>
//           </Box>
//         );

//       case "Dropdown":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <FormControl fullWidth>
//               <Select
//                 value={selectedDropdownValues[`${sectionId}_${element.text}`] || ""}
//                 onChange={(event) => handleDropdownValueChange(event, element.text, sectionId)}
//                 size="small"
//               >
//                 {element.options.map((option) => (
//                   <MenuItem key={option.text} value={option.text}>
//                     {option.text}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         );

//       case "Date":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <DatePicker
//               format="MM/DD/YYYY"
//               sx={{ width: "100%", backgroundColor: "#fff" }}
//               value={startDate}
//               onChange={(date) => handleStartDateChange(date, element.text, sectionId)}
//               slotProps={{
//                 textField: { size: "small", fullWidth: true }
//               }}
//             />
//           </Box>
//         );

//       case "File Upload":
//         return (
//           <Box key={element.id} mt={2} mb={2}>
//             <Typography fontSize="18px" mb={1}>
//               {element.text}
//             </Typography>
//             <Tooltip title="Unavailable in preview mode" placement="top">
//               <TextField
//                 variant="outlined"
//                 size="small"
//                 fullWidth
//                 disabled
//                 placeholder="Add Document"
//                 sx={{
//                   cursor: "not-allowed",
//                   "& .MuiInputBase-input": {
//                     pointerEvents: "none",
//                     cursor: "not-allowed",
//                   },
//                 }}
//               />
//             </Tooltip>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullScreen>
//       <DialogContent>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <Box>
//             {/* Header */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//               <Box>
//                 <Typography fontWeight="bold" variant="h6">
//                   Preview mode
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   The client sees your organizer like this
//                 </Typography>
//               </Box>
//               <Button variant="text" onClick={onClose}>
//                 Back to edit
//               </Button>
//             </Box>

//             {/* Organizer Name */}
//             <Typography variant="h5" gutterBottom>
//               {organizerName}
//             </Typography>

//             {/* Section Selector */}
//             {totalSteps > 0 && (
//               <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
//                 <Select
//                   value={activeStep}
//                   onChange={handleDropdownChange}
//                   size="small"
//                 >
//                   {visibleSections.map((section, index) => {
//                     const visibleElements = section.formElements.filter(
//                       (el) => shouldShowElement(el, section.id)
//                     );

//                     const answeredCount = visibleElements.reduce(
//                       (count, element) => {
//                         const key = `${section.id}_${element.text}`;
//                         return count + (answeredElements[key] ? 1 : 0);
//                       },
//                       0
//                     );

//                     const totalVisibleElements = visibleElements.length;

//                     return (
//                       <MenuItem key={section.id} value={index}>
//                         {section.text} ({answeredCount}/{totalVisibleElements})
//                       </MenuItem>
//                     );
//                   })}
//                 </Select>
//               </FormControl>
//             )}

//             {/* Progress Bar */}
//             {totalSteps > 0 && (
//               <Box mt={2} mb={2}>
//                 <LinearProgress
//                   variant="determinate"
//                   value={((activeStep + 1) / totalSteps) * 100}
//                 />
//               </Box>
//             )}

//             {/* Form Content */}
//             <Box sx={{ pl: { xs: 0, md: 20 }, pr: { xs: 0, md: 20 } }}>
//               {visibleSections.map((section, sectionIndex) => (
//                 sectionIndex === activeStep && (
//                   <Box key={section.id}>
//                     {section.formElements.map((element) => (
//                       shouldShowElement(element, section.id) && 
//                       renderFormElement(element, section.id)
//                     ))}
//                   </Box>
//                 )
//               ))}

//               {/* Navigation Buttons */}
//               {totalSteps > 0 && (
//                 <Box mt={3} display="flex" gap={3} alignItems="center">
//                   <Button
//                     disabled={activeStep === 0}
//                     onClick={handleBack}
//                     variant="contained"
//                   >
//                     Back
//                   </Button>
//                   <Button
//                     onClick={handleNext}
//                     disabled={activeStep === totalSteps - 1}
//                     variant="contained"
//                   >
//                     Next
//                   </Button>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </LocalizationProvider>
//       </DialogContent>
//     </Dialog>
//   );
// };

const OrganizerPreview = ({
  open,
  onClose,
  organizerName,
  sections,
  shouldShowElement,
  stripHtmlTags,
  visibleSections,
  activeStep,
  totalSteps,
  onActiveStepChange,
  answeredElements,
  radioValues,
  checkboxValues,
  selectedYesNoValues,
  selectedDropdownValues,
  inputValues,
  startDate,
  onStartDateChange,
  onRadioChange,
  onCheckboxChange,
  onYesNoChange,
  onDropdownValueChange,
  onInputChange,
}) => {
  const handleDropdownChange = (event) => {
    onActiveStepChange(event.target.value);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      onActiveStepChange(activeStep - 1);
    }
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      onActiveStepChange(activeStep + 1);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <Box>
                <Box>
                  <Typography fontWeight="bold">
                    Preview mode
                  </Typography>
                  <Typography>
                    The client sees your organizer like this
                  </Typography>
                </Box>
                <Button variant="text" onClick={onClose}>
                  Back to edit
                </Button>
              </Box>
              <Typography variant="text" gutterBottom>
                {organizerName}
              </Typography>

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
                    const visibleElements = section.formElements.filter(
                      (el) => shouldShowElement(el, section.id)
                    );

                    const answeredCount = visibleElements.reduce(
                      (count, element) => {
                        const key = `${section.id}_${element.text}`;
                        return count + (answeredElements[key] ? 1 : 0);
                      },
                      0
                    );

                    const totalVisibleElements = visibleElements.length;

                    return (
                      <MenuItem key={section.id} value={index}>
                        {section.text} ({answeredCount}/
                        {totalVisibleElements})
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
                                      {stripHtmlTags(element.text)}
                                    </Typography>
                                  </Box>
                                )}

                                {(element.type === "Free Entry" ||
                                  element.type === "Email") && (
                                  <Box>
                                    <Typography
                                      fontSize="18px"
                                      mb={1}
                                      mt={1}
                                    >
                                      {element.text}
                                    </Typography>
                                    <TextField
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
                                        onInputChange(
                                          e,
                                          element.text,
                                          section.id
                                        )
                                      }
                                    />
                                  </Box>
                                )}

                                {element.type === "Number" && (
                                  <Box>
                                    <Typography
                                      fontSize="18px"
                                      mb={1}
                                      mt={1}
                                    >
                                      {element.text}
                                    </Typography>
                                    <TextField
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
                                          e.target.value.replace(
                                            /\D/g,
                                            ""
                                          );
                                        onInputChange(
                                          {
                                            target: {
                                              value: numericValue,
                                            },
                                          },
                                          element.text,
                                          section.id
                                        );
                                      }}
                                    />
                                  </Box>
                                )}

                                {element.type === "Radio Buttons" && (
                                  <Box>
                                    <Typography
                                      fontSize="18px"
                                      mb={1}
                                      mt={1}
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
                                          onClick={() =>
                                            onRadioChange(
                                              option.text,
                                              element.text,
                                              section.id
                                            )
                                          }
                                        >
                                          {option.text}
                                        </Button>
                                      ))}
                                    </Box>
                                  </Box>
                                )}

                                {element.type === "Checkboxes" && (
                                  <Box>
                                    <Typography fontSize="18px">
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
                                          onClick={() =>
                                            onCheckboxChange(
                                              option.text,
                                              element.text,
                                              section.id
                                            )
                                          }
                                        >
                                          {option.text}
                                        </Button>
                                      ))}
                                    </Box>
                                  </Box>
                                )}

                                {element.type === "Yes/No" && (
                                  <Box>
                                    <Typography fontSize="18px">
                                      {element.text}
                                    </Typography>
                                    <Box
                                      sx={{ display: "flex", gap: 1 }}
                                    >
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
                                          onClick={() =>
                                            onYesNoChange(
                                              option.text,
                                              element.text,
                                              section.id
                                            )
                                          }
                                        >
                                          {option.text}
                                        </Button>
                                      ))}
                                    </Box>
                                  </Box>
                                )}

                                {element.type === "Dropdown" && (
                                  <Box>
                                    <Typography fontSize="18px">
                                      {element.text}
                                    </Typography>
                                    <FormControl fullWidth>
                                      <Select
                                        value={
                                          selectedDropdownValues[
                                            `${section.id}_${element.text}`
                                          ] || ""
                                        }
                                        onChange={(event) =>
                                          onDropdownValueChange(
                                            event,
                                            element.text,
                                            section.id
                                          )
                                        }
                                        size="small"
                                      >
                                        {element.options.map(
                                          (option) => (
                                            <MenuItem
                                              key={option.text}
                                              value={option.text}
                                            >
                                              {option.text}
                                            </MenuItem>
                                          )
                                        )}
                                      </Select>
                                    </FormControl>
                                  </Box>
                                )}

                                {element.type === "Date" && (
                                  <Box>
                                    <Typography fontSize="18px">
                                      {element.text}
                                    </Typography>
                                    <DatePicker
                                      format="MM/DD/YYYY"
                                      sx={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                      }}
                                      selected={startDate}
                                      onChange={onStartDateChange}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                        />
                                      )}
                                    />
                                  </Box>
                                )}

                                {element.type === "File Upload" && (
                                  <Box>
                                    <Typography
                                      fontSize="18px"
                                      mb={1}
                                      mt={2}
                                    >
                                      {element.text}
                                    </Typography>
                                    <Tooltip
                                      title="Unavailable in preview mode"
                                      placement="top"
                                    >
                                      <Box
                                        sx={{
                                          position: "relative",
                                          width: "100%",
                                        }}
                                      >
                                        <TextField
                                          variant="outlined"
                                          size="small"
                                          fullWidth
                                          disabled
                                          placeholder="Add Document"
                                          sx={{
                                            cursor: "not-allowed",
                                            "& .MuiInputBase-input": {
                                              pointerEvents: "none",
                                              cursor: "not-allowed",
                                            },
                                          }}
                                        />
                                      </Box>
                                    </Tooltip>
                                  </Box>
                                )}
                              </Box>
                            )
                        )}
                      </Box>
                    )
                )}
                <Box mt={3} display="flex" gap={3} alignItems="center">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="contained"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={activeStep === totalSteps - 1}
                    variant="contained"
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizerPreview;