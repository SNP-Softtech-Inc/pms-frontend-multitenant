import React, { useState,  } from "react";
import { useSelector } from "react-redux";
// import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { Card,CardContent } from "../../components/ui/card";

// import { Button } from "../../components/ui/button";
import AccountForm from "./AccountForm";
import ContactForm from "./ContactForm";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // adjust path
import { accountsAPI, contactsAPI,docAPI } from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";
const steps = ["Account Information", "Contact Information"];
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../components/ui/sheet";
import { Check } from "lucide-react";
export default function AccountContactForm({
  isEditing,
  accountId,
  onCloseDrawer,
  handleDrawerClose,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const queryClient = useQueryClient();
  const { accountData, contacts, selectedContacts } = useSelector(
    (state) => state.accountContact,
  );
const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
const assignfoldertemp = async (accountId, foldertempId) => {
  try {
    const payload = {
      accountId: accountId,
      templateId: foldertempId || null,
    };

    console.log("assignfoldertemp payload:", payload);

    const res = await docAPI.applyTemplateToAccount(payload);

    console.log("API response:", res.data);
  } catch (error) {
    console.error("Error applying template:", error);
  }
};
  // ================= MAIN SUBMIT =================
  const handleSubmit = async (event, personalMessage = "") => {
    if (event) event.preventDefault();

    if (!accountData.accountName?.trim()) {
      toast.warning("Account Name is required");
      setActiveStep(0);
      return;
    }

    if (
      accountData.clientType === "Company" &&
      !accountData.companyName?.trim()
    ) {
      toast.warning("Company Name is required");
      setActiveStep(0);
      return;
    }

    try {
      // ===== DUPLICATE EMAIL CHECK =====
      const allEmails = [
        ...contacts.map((c) => c.email?.toLowerCase().trim()),
        ...selectedContacts.map((c) => c.email?.toLowerCase().trim()),
      ].filter(Boolean);

      const duplicates = allEmails.filter(
        (email, i) => allEmails.indexOf(email) !== i,
      );

      if (duplicates.length > 0) {
        toast.error(`Duplicate emails: ${duplicates.join(", ")}`);
        return;
      }

      // ===== CHECK ACCOUNT NAME =====
      if (!isEditing) {
        try {
          const res = await accountsAPI.checkAccountName(
            accountData.accountName.trim(),
          );

          if (res.data.exists) {
            toast.error("Account name already exists");
            setActiveStep(0);
            return;
          }
        } catch (err) {
          console.warn("Check name failed, skipping...");
        }
      }

      // ===== CREATE CONTACTS =====
      const createdContacts = [];

      for (let contact of contacts) {
        if (contact.email) {
          const payload = {
            ...contact,
            tags: contact.tags?.map((t) => t.value) || [],
            country: contact.country ? { name: contact.country.label } : {},
            personalMessage:
              contact.login && !contact._id ? personalMessage : "",
          };

          try {
            const { data } = await contactsAPI.createContact(payload);
            createdContacts.push(data);
          } catch (err) {
            if (err.response?.status === 409) {
              toast.error(`Email ${contact.email} already exists`);
              return;
            }
            throw err;
          }
        }
      }

      // ===== PREPARE CONTACTS =====
      const allContacts = [...createdContacts, ...selectedContacts];

      const accountContacts = allContacts.map((c) => {
        const original = [...contacts, ...selectedContacts].find(
          (x) => x.email === c.email,
        );

        return {
          contact: c._id,
          canLogin: original?.login || false,
          canNotify: original?.notify || false,
          canEmailSync: original?.emailSync || false,
        };
      });

      // ===== ACCOUNT PAYLOAD =====
      const accountPayload = {
        accountName: accountData.accountName,
        clientType: accountData.clientType,
        companyName: accountData.companyName || "",
        teamMember: accountData.teamMembers?.map((m) => m.value) || [],
        tags: accountData.tags?.map((t) => t.value) || [],
        country: accountData.country ? { name: accountData.country.label } : {},
        streetAddress: accountData.streetAddress || "",
        city: accountData.city || "",
        state: accountData.state || "",
        postalCode: accountData.postalCode || "",
        adminUserId: user?.id || "",
        contacts: accountContacts,
        active: true,
      };

      // ===== CREATE / UPDATE ACCOUNT =====
      let finalAccountId;

      if (isEditing && accountId) {
        const { data } = await accountsAPI.updateAccount(
          accountId,
          accountPayload,
        );
        finalAccountId = accountId;
      } else {
        const { data } = await accountsAPI.createAccount(accountPayload);
        finalAccountId = data._id;
      }

      // ===== UPDATE CONTACTS WITH ACCOUNT =====
      for (let c of allContacts) {
        try {
          await contactsAPI.updateContact(c._id, {
            accountId: finalAccountId,
          });
        } catch (err) {
          console.error("Update contact failed", err);
        }
      }

      // ===== VERIFY ACCOUNT =====
      try {
        const res = await accountsAPI.getAccountById(finalAccountId);

        if (!res.data.contacts?.length) {
          await accountsAPI.updateAccount(finalAccountId, {
            contacts: accountContacts,
          });
        }
      } catch (err) {
        console.error("Verify failed", err);
      }

      // ===== SEND ACTIVATION EMAIL =====
      for (let contact of selectedContacts) {
        if (contact.login && contact.isNewlySelected) {
          try {
            await contactsAPI.resendActivationEmail(contact._id);
          } catch (err) {
            console.error("Email send failed", err);
          }
        }
      }
      // STEP 10: Handle folder template assignment
      if (accountData.folderTemp && accountData.folderTemp.value) {
        await assignfoldertemp(finalAccountId, accountData.folderTemp.value);
      }

      toast.success("Account saved successfully!");

      // 🔥 THIS refreshes table automatically
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      if (onCloseDrawer) onCloseDrawer();
      if (handleDrawerClose) handleDrawerClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };
  const stepDescription = activeStep === 0
    ? "Fill in the account details to continue"
    : "Add or link contacts for this account";
  // return (
  //   <Box sx={{ maxWidth: 800, margin: "auto", mt: 2 }}>
  //     <Stepper activeStep={activeStep}>
  //       {steps.map((label) => (
  //         <Step key={label}>
  //           <StepLabel>{label}</StepLabel>
  //         </Step>
  //       ))}
  //     </Stepper>

  //     <Box sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
  //       {activeStep === 0 && (
  //         <AccountForm
  //           onContinue={() => setActiveStep(1)}
  //           isEditing={isEditing}
  //         />
  //       )}

  //       {activeStep === 1 && (
  //         <ContactForm
  //           onBack={() => setActiveStep(0)}
  //           onSubmit={handleSubmit}
  //           isEditing={isEditing}
  //           isSubmitting={isSubmitting}
  //           setIsSubmitting={setIsSubmitting}
  //         />
  //       )}
  //     </Box>
  //   </Box>
  // );
   return (
    <div className="max-w-3xl mx-auto mt-4">
      {/* Stepper */}
      {/* Step header */}
      <SheetHeader className="px-0 pb-4 border-b border-border/40 space-y-3">
        {/* Step breadcrumb */}
        <div className="flex items-center gap-2">
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={[
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                  index < activeStep
                    ? "bg-primary text-primary-foreground"
                    : index === activeStep
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground",
                ].join(" ")}>
                  {index < activeStep
                    ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    : index + 1}
                </div>
                <SheetTitle className={[
                  "text-sm font-medium leading-none",
                  index <= activeStep ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}>
                  {label}
                </SheetTitle>
              </div>
              {index < steps.length - 1 && (
                <div className={[
                  "flex-1 h-px mx-1",
                  index < activeStep ? "bg-primary" : "bg-border",
                ].join(" ")} />
              )}
            </React.Fragment>
          ))}
        </div>
        <SheetDescription className="text-xs text-muted-foreground">
          {stepDescription}
        </SheetDescription>
      </SheetHeader>

      {/* Content */}
      <Card className="border rounded-lg">
        <CardContent className="p-6">
          {activeStep === 0 && (
            <AccountForm
              onContinue={() => setActiveStep(1)}
              isEditing={isEditing}
            />
          )}

          {activeStep === 1 && (
            <ContactForm
              onBack={() => setActiveStep(0)}
              onSubmit={handleSubmit}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
