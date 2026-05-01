
// // OrganizerPreview.js
// import React, { useState, useMemo } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   FormControl,
//   Select,
//   MenuItem,
//   LinearProgress,
//   Dialog,
//   DialogContent,
//   Tooltip,
//   FormControlLabel,
//   Checkbox,
//   Radio,
//   RadioGroup,
//   FormLabel,
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";



// const OrganizerPreview = ({
//   open,
//   onClose,
//   organizerName,
//   sections,
//   shouldShowElement,
//   stripHtmlTags,
//   visibleSections,
//   activeStep,
//   totalSteps,
//   onActiveStepChange,
//   answeredElements,
//   radioValues,
//   checkboxValues,
//   selectedYesNoValues,
//   selectedDropdownValues,
//   inputValues,
//   startDate,
//   onStartDateChange,
//   onRadioChange,
//   onCheckboxChange,
//   onYesNoChange,
//   onDropdownValueChange,
//   onInputChange,
// }) => {
//   const handleDropdownChange = (event) => {
//     onActiveStepChange(event.target.value);
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       onActiveStepChange(activeStep - 1);
//     }
//   };

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       onActiveStepChange(activeStep + 1);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullScreen>
//       <DialogContent>
//         <Box>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Box>
//               <Box>
//                 <Box>
//                   <Typography fontWeight="bold">
//                     Preview mode
//                   </Typography>
//                   <Typography>
//                     The client sees your organizer like this
//                   </Typography>
//                 </Box>
//                 <Button variant="text" onClick={onClose}>
//                   Back to edit
//                 </Button>
//               </Box>
//               <Typography variant="text" gutterBottom>
//                 {organizerName}
//               </Typography>

//               <FormControl
//                 fullWidth
//                 sx={{ marginBottom: "10px", marginTop: "10px" }}
//               >
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
//                         {section.text} ({answeredCount}/
//                         {totalVisibleElements})
//                       </MenuItem>
//                     );
//                   })}
//                 </Select>
//               </FormControl>

//               <Box mt={2} mb={2}>
//                 <LinearProgress
//                   variant="determinate"
//                   value={((activeStep + 1) / totalSteps) * 100}
//                 />
//               </Box>

//               <Box sx={{ pl: 20, pr: 20 }}>
//                 {visibleSections.map(
//                   (section, sectionIndex) =>
//                     sectionIndex === activeStep && (
//                       <Box key={section.id}>
//                         {section.formElements.map(
//                           (element) =>
//                             shouldShowElement(element, section.id) && (
//                               <Box key={`${section.id}_${element.id}`}>
//                                 {element.type === "Text Editor" && (
//                                   <Box mt={2} mb={2}>
//                                     <Typography>
//                                       {stripHtmlTags(element.text)}
//                                     </Typography>
//                                   </Box>
//                                 )}

//                                 {(element.type === "Free Entry" ||
//                                   element.type === "Email") && (
//                                   <Box>
//                                     <Typography
//                                       fontSize="18px"
//                                       mb={1}
//                                       mt={1}
//                                     >
//                                       {element.text}
//                                     </Typography>
//                                     <TextField
//                                       variant="outlined"
//                                       size="small"
//                                       multiline
//                                       fullWidth
//                                       placeholder={`${element.type} Answer`}
//                                       inputProps={{
//                                         type:
//                                           element.type === "Free Entry"
//                                             ? "text"
//                                             : element.type.toLowerCase(),
//                                       }}
//                                       maxRows={8}
//                                       style={{ display: "block" }}
//                                       value={
//                                         inputValues[
//                                           `${section.id}_${element.text}`
//                                         ] || ""
//                                       }
//                                       onChange={(e) =>
//                                         onInputChange(
//                                           e,
//                                           element.text,
//                                           section.id
//                                         )
//                                       }
//                                     />
//                                   </Box>
//                                 )}

//                                 {element.type === "Number" && (
//                                   <Box>
//                                     <Typography
//                                       fontSize="18px"
//                                       mb={1}
//                                       mt={1}
//                                     >
//                                       {element.text}
//                                     </Typography>
//                                     <TextField
//                                       variant="outlined"
//                                       size="small"
//                                       multiline
//                                       fullWidth
//                                       placeholder={`${element.type} Answer`}
//                                       inputProps={{
//                                         type: "text",
//                                         inputMode: "numeric",
//                                         pattern: "[0-9]*",
//                                       }}
//                                       maxRows={8}
//                                       style={{
//                                         display: "block",
//                                         marginTop: "15px",
//                                       }}
//                                       value={
//                                         inputValues[
//                                           `${section.id}_${element.text}`
//                                         ] || ""
//                                       }
//                                       onChange={(e) => {
//                                         const numericValue =
//                                           e.target.value.replace(
//                                             /\D/g,
//                                             ""
//                                           );
//                                         onInputChange(
//                                           {
//                                             target: {
//                                               value: numericValue,
//                                             },
//                                           },
//                                           element.text,
//                                           section.id
//                                         );
//                                       }}
//                                     />
//                                   </Box>
//                                 )}

//                                 {element.type === "Radio Buttons" && (
//                                   <Box>
//                                     <Typography
//                                       fontSize="18px"
//                                       mb={1}
//                                       mt={1}
//                                     >
//                                       {element.text}
//                                     </Typography>
//                                     <Box
//                                       sx={{
//                                         display: "flex",
//                                         gap: 1,
//                                         flexWrap: "wrap",
//                                       }}
//                                     >
//                                       {element.options.map((option) => (
//                                         <Button
//                                           key={option.text}
//                                           variant={
//                                             radioValues[
//                                               `${section.id}_${element.text}`
//                                             ] === option.text
//                                               ? "contained"
//                                               : "outlined"
//                                           }
//                                           onClick={() =>
//                                             onRadioChange(
//                                               option.text,
//                                               element.text,
//                                               section.id
//                                             )
//                                           }
//                                         >
//                                           {option.text}
//                                         </Button>
//                                       ))}
//                                     </Box>
//                                   </Box>
//                                 )}

//                                 {element.type === "Checkboxes" && (
//                                   <Box>
//                                     <Typography fontSize="18px">
//                                       {element.text}
//                                     </Typography>
//                                     <Box
//                                       sx={{
//                                         display: "flex",
//                                         gap: 1,
//                                         flexWrap: "wrap",
//                                       }}
//                                     >
//                                       {element.options.map((option) => (
//                                         <Button
//                                           key={option.text}
//                                           variant={
//                                             checkboxValues[
//                                               `${section.id}_${element.text}`
//                                             ]?.[option.text]
//                                               ? "contained"
//                                               : "outlined"
//                                           }
//                                           onClick={() =>
//                                             onCheckboxChange(
//                                               option.text,
//                                               element.text,
//                                               section.id
//                                             )
//                                           }
//                                         >
//                                           {option.text}
//                                         </Button>
//                                       ))}
//                                     </Box>
//                                   </Box>
//                                 )}

//                                 {element.type === "Yes/No" && (
//                                   <Box>
//                                     <Typography fontSize="18px">
//                                       {element.text}
//                                     </Typography>
//                                     <Box
//                                       sx={{ display: "flex", gap: 1 }}
//                                     >
//                                       {element.options.map((option) => (
//                                         <Button
//                                           key={option.text}
//                                           variant={
//                                             selectedYesNoValues[
//                                               `${section.id}_${element.text}`
//                                             ] === option.text
//                                               ? "contained"
//                                               : "outlined"
//                                           }
//                                           onClick={() =>
//                                             onYesNoChange(
//                                               option.text,
//                                               element.text,
//                                               section.id
//                                             )
//                                           }
//                                         >
//                                           {option.text}
//                                         </Button>
//                                       ))}
//                                     </Box>
//                                   </Box>
//                                 )}

//                                 {element.type === "Dropdown" && (
//                                   <Box>
//                                     <Typography fontSize="18px">
//                                       {element.text}
//                                     </Typography>
//                                     <FormControl fullWidth>
//                                       <Select
//                                         value={
//                                           selectedDropdownValues[
//                                             `${section.id}_${element.text}`
//                                           ] || ""
//                                         }
//                                         onChange={(event) =>
//                                           onDropdownValueChange(
//                                             event,
//                                             element.text,
//                                             section.id
//                                           )
//                                         }
//                                         size="small"
//                                       >
//                                         {element.options.map(
//                                           (option) => (
//                                             <MenuItem
//                                               key={option.text}
//                                               value={option.text}
//                                             >
//                                               {option.text}
//                                             </MenuItem>
//                                           )
//                                         )}
//                                       </Select>
//                                     </FormControl>
//                                   </Box>
//                                 )}

//                                 {element.type === "Date" && (
//                                   <Box>
//                                     <Typography fontSize="18px">
//                                       {element.text}
//                                     </Typography>
//                                     <DatePicker
//                                       format="MM/DD/YYYY"
//                                       sx={{
//                                         width: "100%",
//                                         backgroundColor: "#fff",
//                                       }}
//                                       selected={startDate}
//                                       onChange={onStartDateChange}
//                                       renderInput={(params) => (
//                                         <TextField
//                                           {...params}
//                                           size="small"
//                                         />
//                                       )}
//                                     />
//                                   </Box>
//                                 )}

//                                 {element.type === "File Upload" && (
//                                   <Box>
//                                     <Typography
//                                       fontSize="18px"
//                                       mb={1}
//                                       mt={2}
//                                     >
//                                       {element.text}
//                                     </Typography>
//                                     <Tooltip
//                                       title="Unavailable in preview mode"
//                                       placement="top"
//                                     >
//                                       <Box
//                                         sx={{
//                                           position: "relative",
//                                           width: "100%",
//                                         }}
//                                       >
//                                         <TextField
//                                           variant="outlined"
//                                           size="small"
//                                           fullWidth
//                                           disabled
//                                           placeholder="Add Document"
//                                           sx={{
//                                             cursor: "not-allowed",
//                                             "& .MuiInputBase-input": {
//                                               pointerEvents: "none",
//                                               cursor: "not-allowed",
//                                             },
//                                           }}
//                                         />
//                                       </Box>
//                                     </Tooltip>
//                                   </Box>
//                                 )}
//                               </Box>
//                             )
//                         )}
//                       </Box>
//                     )
//                 )}
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
//               </Box>
//             </Box>
//           </LocalizationProvider>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default OrganizerPreview;

// OrganizerPreview.js
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Progress } from "../../../components/ui/progress";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { cn } from "../../../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

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
  const handleDropdownChange = (value) => {
    onActiveStepChange(parseInt(value));
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h3 className="font-bold text-lg">Preview mode</h3>
              <p className="text-sm text-gray-500">
                The client sees your organizer like this
              </p>
            </div>
            {/* <Button variant="ghost" onClick={onClose}>
              Back to edit
            </Button> */}
          </div>

          {/* Organizer Name */}
          <h2 className="text-xl mb-4">{organizerName}</h2>

          {/* Section Selector */}
          <div className="mb-4">
            <Select value={activeStep.toString()} onValueChange={handleDropdownChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                    <SelectItem key={section.id} value={index.toString()}>
                      {section.text} ({answeredCount}/{totalVisibleElements})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={((activeStep + 1) / totalSteps) * 100} className="h-2" />
          </div>

          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            {visibleSections.map(
              (section, sectionIndex) =>
                sectionIndex === activeStep && (
                  <div key={section.id} className="space-y-6">
                    {section.formElements.map(
                      (element) =>
                        shouldShowElement(element, section.id) && (
                          <div key={`${section.id}_${element.id}`} className="space-y-2">
                            {/* Text Editor Type */}
                            {element.type === "Text Editor" && (
                              <div className="py-4">
                                <p className="text-gray-700">
                                  {stripHtmlTags(element.text)}
                                </p>
                              </div>
                            )}

                            {/* Free Entry & Email Type */}
                            {(element.type === "Free Entry" ||
                              element.type === "Email") && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <Textarea
                                  placeholder={`${element.type} Answer`}
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
                                  className="resize-none"
                                  rows={3}
                                />
                              </div>
                            )}

                            {/* Number Type */}
                            {element.type === "Number" && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  placeholder={`${element.type} Answer`}
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
                              </div>
                            )}

                            {/* Radio Buttons Type */}
                            {element.type === "Radio Buttons" && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <div className="flex gap-2 flex-wrap">
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        radioValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text
                                          ? "default"
                                          : "outline"
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
                                </div>
                              </div>
                            )}

                            {/* Checkboxes Type */}
                            {element.type === "Checkboxes" && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <div className="flex gap-2 flex-wrap">
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        checkboxValues[
                                          `${section.id}_${element.text}`
                                        ]?.[option.text]
                                          ? "default"
                                          : "outline"
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
                                </div>
                              </div>
                            )}

                            {/* Yes/No Type */}
                            {element.type === "Yes/No" && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <div className="flex gap-2">
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        selectedYesNoValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text
                                          ? "default"
                                          : "outline"
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
                                </div>
                              </div>
                            )}

                            {/* Dropdown Type */}
                            {element.type === "Dropdown" && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <Select
                                  value={
                                    selectedDropdownValues[
                                      `${section.id}_${element.text}`
                                    ] || ""
                                  }
                                  onValueChange={(value) =>
                                    onDropdownValueChange(
                                      { target: { value } },
                                      element.text,
                                      section.id
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {element.options.map(
                                      (option) => (
                                        <SelectItem
                                          key={option.text}
                                          value={option.text}
                                        >
                                          {option.text}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Date Type */}
                            {element.type === "Date" && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {startDate ? (
                                        format(startDate, "MM/dd/yyyy")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={startDate}
                                      onSelect={onStartDateChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}

                            {/* File Upload Type */}
                            {element.type === "File Upload" && (
                              <div>
                                <Label className="text-lg mb-2 block">
                                  {element.text}
                                </Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="relative w-full">
                                        <Input
                                          disabled
                                          placeholder="Add Document"
                                          className="cursor-not-allowed opacity-50"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Unavailable in preview mode</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                )
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-3 items-center">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="default"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={activeStep === totalSteps - 1}
                variant="default"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizerPreview;