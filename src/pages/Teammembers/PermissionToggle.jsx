// src/pages/Teammembers/PermissionToggle.jsx
//
// One Access Rights permission (v1.86.0). The old toggle's "off" track was
// bg-input - nearly the card's own white - so on and off looked alike.
//   on           primary track, highlighted card, "On"
//   off          grey track, grey label, "Off"
//   unavailable  a permission the app does not act on yet: dashed card,
//                "Not available", cannot be switched
import React from "react";
import { cn } from "../../lib/utils";

const PermissionToggle = ({ label, checked = false, unavailable = false, onToggle }) => {
  const state = checked ? "on" : "off";

  return (
    <div
      data-permission
      data-state={state}
      className={cn(
        "p-3 rounded-lg border flex justify-between items-center gap-3 transition-colors",
        unavailable
          ? "border-dashed border-border bg-muted/30"
          : checked
            ? "border-primary/50 bg-primary/5"
            : "border-border bg-card"
      )}
    >
      <div className="min-w-0">
        <span
          className={cn(
            "block text-sm font-medium",
            checked && !unavailable ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        {unavailable ? (
          <span className="block text-xs text-muted-foreground">Not available</span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          aria-hidden="true"
          className={cn(
            "text-xs font-semibold w-6 text-right",
            checked ? "text-primary" : "text-muted-foreground"
          )}
        >
          {checked ? "On" : "Off"}
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          data-state={state}
          disabled={unavailable}
          onClick={() => {
            if (!unavailable) onToggle();
          }}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            checked ? "bg-primary" : "bg-muted-foreground/40",
            unavailable ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          )}
        >
          <span
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform",
              checked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default PermissionToggle;
