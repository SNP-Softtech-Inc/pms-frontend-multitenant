// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Drawer,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   FormGroup,
//   Autocomplete,
//   Container,
//   Box,
//   Typography,
//   FormControl,
//   Select,
//   InputLabel,
//   MenuItem,
//   TextField,
//   FormControlLabel,
//   Checkbox,
//   Radio,
//   RadioGroup,
//   Button,
//   FormLabel,
//   Grid,
//   Paper,
//   LinearProgress,
//   Tooltip,
//   Switch,
// } from "@mui/material"; // Make sure you have MUI installed
// import { ExpandMore, ExpandLess } from "@mui/icons-material";
// import axios from "axios";
// import { RxCross2 } from "react-icons/rx";

// import { organizerAPI } from "../../../services/api"; // adjust path

// const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {
//   const { accountId } = useParams();

//   const [organizerTemp, setOrganizerTemp] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [organizerId, setOrganizerId] = useState("");
//   const [showConditional, setShowConditional] = useState(false);

//   useEffect(() => {
//     fetchOrganizerOfAccount();
//   }, [accountId]);

//   // ✅ UPDATED: using organizerAPI
//   const fetchOrganizerOfAccount = async () => {
//     try {
//       const response = await organizerAPI.getOrganizerByAccountId(accountId);

//       const result = response.data;

//       const selectedOrganizer = result.organizerAccountWise.find(
//         (org) => org._id === OrganizerData
//       );

//       setOrganizerTemp(selectedOrganizer);
//       setOrganizerId(selectedOrganizer._id);
//       setSections(selectedOrganizer.sections);
//     } catch (error) {
//       console.error("Error fetching organizers:", error);
//     }
//   };

//   const [expandedSections, setExpandedSections] = useState([]);

//   const handleToggleSection = (sectionId) => {
//     setExpandedSections((prev) =>
//       prev.includes(sectionId)
//         ? prev.filter((id) => id !== sectionId)
//         : [...prev, sectionId]
//     );
//   };

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [drawerContent, setDrawerContent] = useState("");

//   const handleOpenDrawer = (content) => {
//     setDrawerContent(content);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//   };

//   // ✅ UPDATED: using organizerAPI
//   const handleCheckboxChange = async (sectionId, formElementId, checked) => {
//     try {
//       await organizerAPI.updateFormElementActiveStatus(
//         organizerId,
//         sectionId,
//         formElementId,
//         { active: checked }
//       );

//       // local update
//       const updatedSections = sections.map((section) => {
//         if (section.id === sectionId) {
//           return {
//             ...section,
//             formElements: section.formElements.map((el) => {
//               if (el.id === formElementId) {
//                 return { ...el, active: checked };
//               }
//               return el;
//             }),
//           };
//         }
//         return section;
//       });

//       setSections(updatedSections);
//     } catch (error) {
//       console.error("Failed to update active status:", error);
//     }
//   };

//   const filteredSections = sections.filter((section) => {
//     return !section.sectionsettings?.conditional || showConditional;
//   });

//   return (
//     <Box>
//       <FormControlLabel
//         control={
//           <Switch
//             checked={showConditional}
//             onChange={(e) => setShowConditional(e.target.checked)}
//           />
//         }
//         label="Show Hidden Questions"
//         sx={{ mb: 2 }}
//       />

//       {filteredSections.length > 0 ? (
//         filteredSections.map((section) => (
//           <Box key={section.id} sx={{ marginBottom: 2 }}>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Typography
//                 sx={{ flexGrow: 1, cursor: "pointer" }}
//                 onClick={() => handleToggleSection(section.id)}
//               >
//                 {section.text}
//                 {section.sectionsettings?.conditional && showConditional && (
//                   <Typography
//                     component="span"
//                     sx={{
//                       fontStyle: "italic",
//                       color: "gray",
//                       fontSize: "0.85rem",
//                     }}
//                   >
//                     (Hidden Section)
//                   </Typography>
//                 )}
//               </Typography>

//               <Typography sx={{ fontSize: "0.9rem", color: "gray", ml: 1 }}>
//                 (
//                 {
//                   section.formElements.filter(
//                     (el) =>
//                       el.textvalue &&
//                       (!el.questionsectionsettings?.conditional ||
//                         showConditional)
//                   ).length
//                 }
//                 /
//                 {
//                   section.formElements.filter(
//                     (el) =>
//                       !el.questionsectionsettings?.conditional ||
//                       showConditional
//                   ).length
//                 }
//                 )
//               </Typography>

//               <IconButton onClick={() => handleToggleSection(section.id)}>
//                 {expandedSections.includes(section.id) ? (
//                   <ExpandLess />
//                 ) : (
//                   <ExpandMore />
//                 )}
//               </IconButton>
//             </Box>

//             {expandedSections.includes(section.id) && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell><strong>Question</strong></TableCell>
//                       <TableCell><strong>Answer</strong></TableCell>
//                       <TableCell><strong>Reviewed</strong></TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {section.formElements
//                       .filter(
//                         (el) =>
//                           !el.questionsectionsettings?.conditional ||
//                           showConditional
//                       )
//                       .map((formElement) => (
//                         <TableRow key={formElement.id}>
//                           <TableCell>
//                             {formElement.type === "Text Editor"
//                               ? "Text Block"
//                               : formElement.text}
//                           </TableCell>

//                           <TableCell>
//                             {formElement.type === "Text Editor" ? (
//                               <Box
//                                 sx={{ cursor: "pointer", color: "blue" }}
//                                 onClick={() =>
//                                   handleOpenDrawer(formElement.text)
//                                 }
//                               >
//                                 Display
//                               </Box>
//                             ) : (
//                               <div style={{ whiteSpace: "pre-line" }}>
//                                 {formElement.textvalue}
//                               </div>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             {formElement.type !== "Text Editor" && (
//                               <Checkbox
//                                 checked={formElement.active || false}
//                                 onChange={(e) =>
//                                   handleCheckboxChange(
//                                     section.id,
//                                     formElement.id,
//                                     e.target.checked
//                                   )
//                                 }
//                               />
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Box>
//         ))
//       ) : (
//         <Typography>No Data</Typography>
//       )}

//       <Button onClick={onClose}>Back</Button>

//       {/* Drawer */}
//       <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
//         <Box sx={{ width: 600, p: 2 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography>Text Block Content</Typography>
//             <RxCross2 onClick={handleCloseDrawer} />
//           </Box>

//           <Box mt={1}>
//             <div dangerouslySetInnerHTML={{ __html: drawerContent }} />
//           </Box>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default CreateOrganizerUpdate;


import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import axios from "axios";

import { organizerAPI } from "../../../services/api"; // adjust path

// shadcn/ui imports
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Switch } from "../../../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";

import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";
const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {
  const { accountId } = useParams();

  const [organizerTemp, setOrganizerTemp] = useState(null);
  const [sections, setSections] = useState([]);
  const [organizerId, setOrganizerId] = useState("");
  const [showConditional, setShowConditional] = useState(false);

  useEffect(() => {
    fetchOrganizerOfAccount();
  }, [accountId]);

  // ✅ UPDATED: using organizerAPI
  const fetchOrganizerOfAccount = async () => {
    try {
      const response = await organizerAPI.getOrganizerByAccountId(accountId);

      const result = response.data;

      const selectedOrganizer = result.organizerAccountWise.find(
        (org) => org._id === OrganizerData
      );

      setOrganizerTemp(selectedOrganizer);
      setOrganizerId(selectedOrganizer._id);
      setSections(selectedOrganizer.sections);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
  };

  const [expandedSections, setExpandedSections] = useState([]);

  const handleToggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");

  const handleOpenDrawer = (content) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // ✅ UPDATED: using organizerAPI
  const handleCheckboxChange = async (sectionId, formElementId, checked) => {
    try {
      await organizerAPI.updateFormElementActiveStatus(
        organizerId,
        sectionId,
        formElementId,
        { active: checked }
      );

      // local update
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            formElements: section.formElements.map((el) => {
              if (el.id === formElementId) {
                return { ...el, active: checked };
              }
              return el;
            }),
          };
        }
        return section;
      });

      setSections(updatedSections);
    } catch (error) {
      console.error("Failed to update active status:", error);
    }
  };

  const filteredSections = sections.filter((section) => {
    return !section.sectionsettings?.conditional || showConditional;
  });

  return (
  <div className="space-y-6">

    {/* TOP SWITCH */}
    <div className="flex items-center gap-3 mb-4">
      <Switch
        id="show-conditional"
        checked={showConditional}
        onCheckedChange={setShowConditional}
      />
      <Label
        htmlFor="show-conditional"
        className="text-sm font-medium text-foreground"
      >
        Show Hidden Questions
      </Label>
    </div>

    {/* SECTIONS */}
    {filteredSections.length > 0 ? (
      filteredSections.map((section) => (
        <Collapsible
          key={section.id}
          open={expandedSections.includes(section.id)}
          onOpenChange={() => handleToggleSection(section.id)}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >

          {/* HEADER */}
          <div className="flex items-center justify-between p-4 bg-muted/30">

            <div className="flex items-center flex-1">
              <CollapsibleTrigger asChild>
                <div className="flex items-center flex-1 cursor-pointer">
                  <span className="text-sm font-semibold text-foreground">
                    {section.text}

                    {section.sectionsettings?.conditional &&
                      showConditional && (
                        <span className="ml-2 text-xs italic text-muted-foreground">
                          (Hidden Section)
                        </span>
                      )}
                  </span>
                </div>
              </CollapsibleTrigger>

              <span className="text-xs text-muted-foreground ml-3">
                (
                {
                  section.formElements.filter(
                    (el) =>
                      el.textvalue &&
                      (!el.questionsectionsettings?.conditional ||
                        showConditional)
                  ).length
                }
                /
                {
                  section.formElements.filter(
                    (el) =>
                      !el.questionsectionsettings?.conditional ||
                      showConditional
                  ).length
                }
                )
              </span>
            </div>

            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
              >
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

          </div>

          {/* CONTENT */}
          <CollapsibleContent>
            <div className="border-t border-border">

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold text-foreground">
                      Question
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Answer
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Reviewed
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {section.formElements
                    .filter(
                      (el) =>
                        !el.questionsectionsettings?.conditional ||
                        showConditional
                    )
                    .map((formElement) => (
                      <TableRow
                        key={formElement.id}
                        className="hover:bg-muted/40 transition"
                      >

                        {/* QUESTION */}
                        <TableCell className="text-sm text-foreground">
                          {formElement.type === "Text Editor"
                            ? "Text Block"
                            : formElement.text}
                        </TableCell>

                        {/* ANSWER */}
                        <TableCell className="text-sm text-muted-foreground">
                          {formElement.type === "Text Editor" ? (
                            <Button
                              variant="link"
                              className="text-primary p-0 h-auto"
                              onClick={() =>
                                handleOpenDrawer(formElement.text)
                              }
                            >
                              Display
                            </Button>
                          ) : (
                            <div className="whitespace-pre-line">
                              {formElement.textvalue}
                            </div>
                          )}
                        </TableCell>

                        {/* REVIEW */}
                        <TableCell>
                          {formElement.type !== "Text Editor" && (
                            <Checkbox
                              checked={formElement.active || false}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  section.id,
                                  formElement.id,
                                  checked
                                )
                              }
                            />
                          )}
                        </TableCell>

                      </TableRow>
                    ))}
                </TableBody>
              </Table>

            </div>
          </CollapsibleContent>
        </Collapsible>
      ))
    ) : (
      <p className="text-sm text-muted-foreground">No Data</p>
    )}

    {/* BACK BUTTON */}
    <Button variant="outline" onClick={onClose}>
      Back
    </Button>

    {/* DIALOG (TEXT VIEWER) */}
    <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 rounded-2xl bg-background text-foreground">

        {/* HEADER */}
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle className="text-foreground">
            Text Block Content
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          <div
            className="text-sm text-foreground"
            dangerouslySetInnerHTML={{ __html: drawerContent }}
          />
        </div>

        {/* FOOTER */}
        <DialogFooter className="border-t border-border p-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>

  </div>
);
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2 mb-4">
//         <Switch
//           id="show-conditional"
//           checked={showConditional}
//           onCheckedChange={setShowConditional}
//         />
//         <Label htmlFor="show-conditional">Show Hidden Questions</Label>
//       </div>

//       {filteredSections.length > 0 ? (
//         filteredSections.map((section) => (
//           <Collapsible
//             key={section.id}
//             open={expandedSections.includes(section.id)}
//             onOpenChange={() => handleToggleSection(section.id)}
//             className="border rounded-lg"
//           >
//             <div className="flex items-center justify-between p-4">
//               <div className="flex items-center flex-1">
//                 <CollapsibleTrigger asChild>
//                   <div className="flex items-center flex-1 cursor-pointer">
//                     <span className="text-sm font-medium">
//                       {section.text}
//                       {section.sectionsettings?.conditional && showConditional && (
//                         <span className="italic text-gray-500 text-xs ml-2">
//                           (Hidden Section)
//                         </span>
//                       )}
//                     </span>
//                   </div>
//                 </CollapsibleTrigger>
                
//                 <span className="text-xs text-gray-500 ml-2">
//                   (
//                   {
//                     section.formElements.filter(
//                       (el) =>
//                         el.textvalue &&
//                         (!el.questionsectionsettings?.conditional ||
//                           showConditional)
//                     ).length
//                   }
//                   /
//                   {
//                     section.formElements.filter(
//                       (el) =>
//                         !el.questionsectionsettings?.conditional ||
//                         showConditional
//                     ).length
//                   }
//                   )
//                 </span>
//               </div>
              
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                   {expandedSections.includes(section.id) ? (
//                     <ChevronUp className="h-4 w-4" />
//                   ) : (
//                     <ChevronDown className="h-4 w-4" />
//                   )}
//                 </Button>
//               </CollapsibleTrigger>
//             </div>

//             <CollapsibleContent>
//               <div className="border-t">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="font-semibold">Question</TableHead>
//                       <TableHead className="font-semibold">Answer</TableHead>
//                       <TableHead className="font-semibold">Reviewed</TableHead>
//                     </TableRow>
//                   </TableHeader>

//                   <TableBody>
//                     {section.formElements
//                       .filter(
//                         (el) =>
//                           !el.questionsectionsettings?.conditional ||
//                           showConditional
//                       )
//                       .map((formElement) => (
//                         <TableRow key={formElement.id}>
//                           <TableCell>
//                             {formElement.type === "Text Editor"
//                               ? "Text Block"
//                               : formElement.text}
//                           </TableCell>

//                           <TableCell>
//                             {formElement.type === "Text Editor" ? (
//                               <Button
//                                 variant="link"
//                                 className="text-blue-600 p-0 h-auto"
//                                 onClick={() =>
//                                   handleOpenDrawer(formElement.text)
//                                 }
//                               >
//                                 Display
//                               </Button>
//                             ) : (
//                               <div className="whitespace-pre-line">
//                                 {formElement.textvalue}
//                               </div>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             {formElement.type !== "Text Editor" && (
//                               <Checkbox
//                                 checked={formElement.active || false}
//                                 onCheckedChange={(checked) =>
//                                   handleCheckboxChange(
//                                     section.id,
//                                     formElement.id,
//                                     checked
//                                   )
//                                 }
//                               />
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>
//         ))
//       ) : (
//         <p className="text-gray-500">No Data</p>
//       )}

//       <Button variant="outline" onClick={onClose}>
//         Back
//       </Button>

//       {/* shadcn/ui Drawer */}
//       {/* <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
//         <DrawerContent >
//           <div className="flex flex-col h-full">
//             <DrawerHeader className="border-b">
//               <div className="flex items-center justify-between">
//                 <DrawerTitle>Text Block Content</DrawerTitle>
//                 <DrawerClose asChild>
//                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </DrawerClose>
//               </div>
//             </DrawerHeader>
            
//             <div className="flex-1 overflow-y-auto p-4">
//               <div dangerouslySetInnerHTML={{ __html: drawerContent }} />
//             </div>
            
//             <DrawerFooter className="border-t">
//               <DrawerClose asChild>
//                 <Button variant="outline">Close</Button>
//               </DrawerClose>
//             </DrawerFooter>
//           </div>
//         </DrawerContent>
//       </Drawer> */}
//       <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
//   <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
    
//     {/* Header */}
//     <DialogHeader className="border-b p-4">
//       <div className="flex items-center justify-between">
//         <DialogTitle>Text Block Content</DialogTitle>

       
//       </div>
//     </DialogHeader>

//     {/* Body */}
//     <div className="flex-1 overflow-y-auto p-4">
//       <div dangerouslySetInnerHTML={{ __html: drawerContent }} />
//     </div>

//     {/* Footer */}
//     <DialogFooter className="border-t p-4">
//       <DialogClose asChild>
//         <Button variant="outline">Close</Button>
//       </DialogClose>
//     </DialogFooter>

//   </DialogContent>
// </Dialog>
//     </div>
//   );
};

export default CreateOrganizerUpdate;