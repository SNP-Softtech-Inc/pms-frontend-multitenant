import React, { useState,  } from "react";
import { useSelector } from "react-redux";
// import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { Card,CardContent } from "../../components/ui/card";

// import { Button } from "../../components/ui/button";
import AccountForm from "./AccountForm";
import ContactForm from "./ContactForm";
import { useToastContext } from "../../context/ToastContext";
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
  const {showToast} = useToastContext();
  const { accountData, contacts, selectedContacts } = useSelector(
    (state) => state.accountContact,
  );
const { user } = useAuth();
console.log("userData for account",user)
console.log("selected existing contact",selectedContacts)
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
  
  const handleSubmit = async (event, personalMessage = "") => {
  if (event) event.preventDefault();

  if (!accountData.accountName?.trim()) {
    showToast({
      title: "Account Name is required",
      type: "error",
    });
    setActiveStep(0);
    return;
  }

  if (
    accountData.clientType === "Company" &&
    !accountData.companyName?.trim()
  ) {
    showToast({
      title: "Company Name is required",
      type: "error",
    });
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
      showToast({
        title: `Duplicate emails: ${duplicates.join(", ")}`,
        type: "error",
      });
      return;
    }

    // ===== CHECK ACCOUNT NAME =====
    if (!isEditing) {
      try {
        const res = await accountsAPI.checkAccountName(
          accountData.accountName.trim(),
        );

        if (res.data.exists) {
          showToast({
            title: "Account name already exists",
            type: "error",
          });
          setActiveStep(0);
          return;
        }
      } catch (err) {
        console.warn("Check name failed, skipping...");
      }
    }

    // ===== CREATE NEW CONTACTS =====
    const createdContacts = [];

    for (let contact of contacts) {
      if (contact.email) {
        const payload = {
          ...contact,
          tags: contact.tags?.map((t) => t.value) || [],
          country: contact.country
            ? { name: contact.country.label }
            : {},
          personalMessage:
            contact.login && !contact._id
              ? personalMessage
              : "",
        };

        try {
          const { data } = await contactsAPI.createContact(payload);

          // preserve frontend flags
          createdContacts.push({
            ...data,
            login: contact.login,
            notify: contact.notify,
            emailSync: contact.emailSync,
          });
        } catch (err) {
          if (err.response?.status === 409) {
            showToast({
              title: `Email ${contact.email} already exists`,
              type: "error",
            });
            return;
          }

          throw err;
        }
      }
    }

    // ===== MERGE CONTACTS =====
    const allContacts = [
      ...createdContacts,
      ...selectedContacts,
    ];

    // ===== PREPARE ACCOUNT CONTACTS =====
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
      teamMember:
        accountData.teamMembers?.map((m) => m.value) || [],
      // Defensive filter: only send tag entries that actually resolved to
      // an id. If accountData.tags ever contains a raw (unhydrated) tag id
      // string instead of a {value,label} option, t.value would be
      // undefined and silently wipe the account's real tags on save.
      tags:
        accountData.tags
          ?.map((t) => t.value)
          .filter((v) => v !== undefined && v !== null) || [],
      country: accountData.country
        ? { name: accountData.country.label }
        : {},
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
      await accountsAPI.updateAccount(
        accountId,
        accountPayload,
      );

      finalAccountId = accountId;
    } else {
      const { data } =
        await accountsAPI.createAccount(accountPayload);

      finalAccountId = data._id;
    }

    // ===== UPDATE CONTACT ACCOUNT IDS =====
    for (let c of allContacts) {
      try {
        await contactsAPI.updateContact(c._id, {
          accountId: finalAccountId,
        });
      } catch (err) {
        console.error("Update contact failed", err);
      }
    }

    // ===== VERIFY ACCOUNT CONTACTS =====
    try {
      const res =
        await accountsAPI.getAccountById(finalAccountId);

      if (!res.data.contacts?.length) {
        await accountsAPI.updateAccount(finalAccountId, {
          contacts: accountContacts,
        });
      }
    } catch (err) {
      console.error("Verify failed", err);
    }

    // ===== SEND ACTIVATION EMAILS =====

for (let contact of selectedContacts) {
  if (contact?.login  && contact.isNewlySelected) {
    console.log(
      "Sending activation email to:",
      contact.email,
    );

    contactsAPI
      .resendActivationEmail(contact._id, {
        personalMessage,
      })
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((err) => {
        console.error("Email send failed", err);
      });
  }
}
    // ===== APPLY FOLDER TEMPLATE =====
    if (
      accountData.folderTemp &&
      accountData.folderTemp.value
    ) {
      await assignfoldertemp(
        finalAccountId,
        accountData.folderTemp.value,
      );
    }

    showToast({
      title: "Account saved successfully!",
      type: "success",
    });

    // ===== REFRESH ACCOUNT TABLE =====
    queryClient.invalidateQueries({
      queryKey: ["accounts"],
    });

    if (onCloseDrawer) onCloseDrawer();
    if (handleDrawerClose) handleDrawerClose();
  } catch (err) {
    console.error(err);
    showToast({
      title: "Something went wrong",
      type: "error",
    });
  }
};
  const stepDescription = activeStep === 0
    ? "Fill in the account details to continue"
    : "Add or link contacts for this account";
 
   return (
    <div className="max-w-3xl mx-auto mt-4">
      {/* Stepper */}

<SheetHeader
  className="
    relative
    px-5
    py-5
    rounded-2xl
    border
    border-border/60
    bg-card/80
    backdrop-blur-xl
    shadow-sm
    space-y-4
    overflow-hidden
  "
>
  {/* Soft gradient glow */}
  <div
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-primary/5
      via-transparent
      to-primary/5
      pointer-events-none
    "
  />

  {/* Step breadcrumb */}
  <div className="relative flex items-center gap-2">
    {steps.map((label, index) => (
      <React.Fragment key={label}>
        <div className="flex items-center gap-2 shrink-0">
          {/* Step Circle */}
          <div
            className={[
              `
              relative
              flex items-center justify-center
              rounded-full
              text-xs font-semibold
              transition-all duration-300
              border
              shadow-sm
            `,
              index < activeStep
                ? `
                  bg-primary
                  text-primary-foreground
                  border-primary
                `
                : index === activeStep
                ? `
                  bg-primary
                  text-primary-foreground
                  border-primary
                  ring-4 ring-primary/20
                  scale-105
                `
                : `
                  bg-muted
                  text-muted-foreground
                  border-border
                `,
            ].join(" ")}
            style={{
              width:
                "calc(1.9rem * parseFloat(var(--font-scale)) / 100)",
              height:
                "calc(1.9rem * parseFloat(var(--font-scale)) / 100)",
              fontFamily: "var(--font-family)",
            }}
          >
            {index < activeStep ? (
              <Check
                className="w-3.5 h-3.5"
                strokeWidth={2.5}
              />
            ) : (
              index + 1
            )}
          </div>

          {/* Step Label */}
          <SheetTitle
            className={[
              `
              text-sm
              font-medium
              leading-none
              transition-colors duration-200
              `,
              index <= activeStep
                ? "text-foreground"
                : "text-muted-foreground",
            ].join(" ")}
            style={{
              fontFamily: "var(--font-family)",
              fontSize:
                "calc(0.9rem * parseFloat(var(--font-scale)) / 100)",
            }}
          >
            {label}
          </SheetTitle>
        </div>

        {/* Connector */}
        {index < steps.length - 1 && (
          <div
            className={[
              `
              flex-1
              h-[2px]
              rounded-full
              transition-all duration-300
            `,
              index < activeStep
                ? "bg-primary"
                : "bg-border",
            ].join(" ")}
          />
        )}
      </React.Fragment>
    ))}
  </div>

  {/* Description */}
  <SheetDescription
    className="
      relative
      text-xs
      leading-relaxed
      text-muted-foreground
    "
    style={{
      fontFamily: "var(--font-family)",
      fontSize:
        "calc(0.75rem * parseFloat(var(--font-scale)) / 100)",
    }}
  >
    {stepDescription}
  </SheetDescription>
</SheetHeader>
      {/* Content */}
      <Card className="border rounded-lg mt-6">
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
