

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
const [showUnanswered, setShowUnanswered] = useState(false);
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

  // const [expandedSections, setExpandedSections] = useState([]);

  // const handleToggleSection = (sectionId) => {
  //   setExpandedSections((prev) =>
  //     prev.includes(sectionId)
  //       ? prev.filter((id) => id !== sectionId)
  //       : [...prev, sectionId]
  //   );
  // };

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

  // const filteredSections = sections.filter((section) => {
  //   return !section.sectionsettings?.conditional || showConditional;
  // });
const filteredSections = sections.filter((section) => {
  return !section.sectionsettings?.conditional || showConditional;
});
const expandedSections = filteredSections
  .filter((section) =>
    section.formElements.some(
      (el) =>
        !el.questionsectionsettings?.conditional ||
        showConditional
    ) && section.formElements.some(
      (el) => el.textvalue?.trim()
    )
  )
  .map((section) => section.id);
  return (
  <div className="space-y-6">

 
<div className="flex items-center gap-8 mb-4">

  {/* Hidden Questions */}
  <div className="flex items-center gap-3">
    <Switch
      id="show-conditional"
      checked={showConditional}
      onCheckedChange={setShowConditional}
    />
    <Label
      htmlFor="show-conditional"
      className="text-sm font-medium"
    >
      Show Hidden Questions
    </Label>
  </div>

  {/* Unanswered Questions */}
  <div className="flex items-center gap-3">
    <Switch
      id="show-unanswered"
      checked={showUnanswered}
      onCheckedChange={setShowUnanswered}
    />
    <Label
      htmlFor="show-unanswered"
      className="text-sm font-medium"
    >
      Show Unanswered Questions
    </Label>
  </div>

</div>
    {/* SECTIONS */}
    {filteredSections.length > 0 ? (
      filteredSections.map((section) => (
        // <Collapsible
        //   key={section.id}
        //   open={expandedSections.includes(section.id)}
        //   onOpenChange={() => handleToggleSection(section.id)}
        //   className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        // >
<Collapsible
  key={section.id}
  open={expandedSections.includes(section.id)}
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

                {/* <TableBody>
                  {section.formElements
                    .filter(
                      (el) =>
                        !el.questionsectionsettings?.conditional ||
                        showConditional
                    )
                    .map((formElement) => ( */}
                    <TableBody>
  {section.formElements
    .filter((el) => {
      // Hide conditional questions unless enabled
      if (
        el.questionsectionsettings?.conditional &&
        !showConditional
      ) {
        return false;
      }

      // OFF = only answered questions
      if (!showUnanswered) {
        return !!el.textvalue?.trim();
      }

      // ON = show all questions
      return true;
    })
    .sort((a, b) => {
      const aAnswered = !!a.textvalue?.trim();
      const bAnswered = !!b.textvalue?.trim();

      // Answered questions first
      return Number(bAnswered) - Number(aAnswered);
    })
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
};

export default CreateOrganizerUpdate;