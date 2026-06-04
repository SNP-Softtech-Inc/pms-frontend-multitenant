import React from "react";

import { Checkbox } from "../../components/ui/checkbox";
import CloseIcon from "@mui/icons-material/Close";

export default function SelectedContactsDisplay({ contacts, onRemove, onUpdateField, isEditing = false }) {
  if (!contacts.length) return null;
  console.log("contacts",contacts)
  return (
  <div className="mb-5 space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h3
          className="
            text-sm font-semibold tracking-tight
            text-foreground
          "
          style={{
            fontFamily: "var(--font-family)",
            fontSize:
              "calc(0.95rem * var(--font-scale, 100) / 100)",
          }}
        >
          Selected Existing Contacts
        </h3>

        <p
          className="
            text-xs text-muted-foreground mt-0.5
          "
          style={{
            fontFamily: "var(--font-family)",
            fontSize:
              "calc(0.78rem * var(--font-scale, 100) / 100)",
          }}
        >
          Linked contacts associated with this account.
        </p>
      </div>

      <div
        className="
          inline-flex items-center justify-center
          min-w-6 h-6 px-2
          rounded-full
          bg-primary/10
          text-primary
          text-[11px] font-medium
          border border-primary/20
        "
      >
        {contacts.length}
      </div>
    </div>

    {/* Contact List */}
    <div className="space-y-2.5">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="
            group
            relative
            overflow-hidden

            rounded-2xl
            border border-border/60

            bg-background/70
            backdrop-blur-sm

            p-4

            shadow-sm
            transition-all duration-200

            hover:border-primary/20
            hover:shadow-md
            hover:bg-muted/20

            dark:bg-muted/10
            dark:hover:bg-muted/20
          "
        >
          {/* Top Glow */}
          <div
            className="
              absolute inset-x-0 top-0 h-px
              bg-gradient-to-r
              from-transparent
              via-border
              to-transparent
            "
          />

          <div className="flex items-start justify-between gap-4">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="space-y-1">
                <p
                  className="
                    truncate
                    text-sm font-semibold
                    text-foreground
                  "
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.92rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  {contact.contactName ||
                    `${contact.firstName} ${contact.lastName}`}
                </p>

                <p
                  className="
                    truncate
                    text-xs
                    text-muted-foreground
                  "
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.78rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  {contact.email}
                </p>
              </div>

              {/* Permissions */}
              <div className="flex flex-wrap items-center gap-5 mt-4">
                {[
                  {
                    field: "login",
                    label: "Login",
                  },
                  {
                    field: "notify",
                    label: "Notify",
                  },
                  {
                    field: "emailSync",
                    label: "Email Sync",
                  },
                ].map(({ field, label }) => (
                  <label
                    key={field}
                    className="
                      flex items-center gap-2
                      cursor-pointer
                      select-none
                    "
                  >
                    <Checkbox
                      checked={contact[field] || false}
                      // onCheckedChange={(checked) =>
                      //   onUpdateField(
                      //     index,
                      //     field,
                      //     checked
                      //   )
                      // }
                      onCheckedChange={(checked) =>
  onUpdateField(
    index,
    field,
    checked === true
  )
}
                      className="
                        h-4 w-4
                        rounded-[4px]
                        border-border/70
                        data-[state=checked]:border-primary
                        data-[state=checked]:bg-primary
                      "
                    />

                    <span
                      className="
                        text-xs font-medium
                        text-muted-foreground
                        transition-colors
                        group-hover:text-foreground
                      "
                      style={{
                        fontFamily:
                          "var(--font-family)",
                        fontSize:
                          "calc(0.78rem * var(--font-scale, 100) / 100)",
                      }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="
                inline-flex
                h-8 w-8
                items-center justify-center

                rounded-xl

                text-muted-foreground
                transition-all duration-200

                hover:bg-destructive/10
                hover:text-destructive

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-destructive/20
              "
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
  // return (
   
  //    <div className="mb-4">
  //     <h3 className="text-sm font-semibold text-slate-900 mb-2">Selected Existing Contacts</h3>
  //     <div className="space-y-2">
  //       {contacts.map((contact, index) => (
  //         <div key={index} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
  //           <div className="flex-1 min-w-0">
  //             <p className="text-sm font-medium text-slate-900">
  //               {contact.contactName || `${contact.firstName} ${contact.lastName}`}
  //             </p>
  //             <p className="text-xs text-slate-500 mt-0.5">{contact.email}</p>
  //             <div className="flex items-center gap-4 mt-2">
  //               <FormControlLabel
  //                 control={<Checkbox size="small" checked={contact.login || false}  onChange={e => onUpdateField(index, "login", e.target.checked)} sx={{ padding: '2px' }} />}
  //                 label={<span className="text-xs text-slate-600">Login</span>}
  //               />
  //               <FormControlLabel
  //                 control={<Checkbox size="small" checked={contact.notify || false}  onChange={e => onUpdateField(index, "notify", e.target.checked)} sx={{ padding: '2px' }} />}
  //                 label={<span className="text-xs text-slate-600">Notify</span>}
  //               />
  //               <FormControlLabel
  //                 control={<Checkbox size="small" checked={contact.emailSync || false}  onChange={e => onUpdateField(index, "emailSync", e.target.checked)} sx={{ padding: '2px' }} />}
  //                 label={<span className="text-xs text-slate-600">Email Sync</span>}
  //               />
  //             </div>
  //           </div>
  //           <button onClick={() => onRemove(index)} className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
  //             <CloseIcon fontSize="small" />
  //           </button>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
}
