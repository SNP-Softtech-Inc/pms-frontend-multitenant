// src/components/PasswordConfirmDialog.jsx
//
// Asks for the current password before a sensitive change (v1.84.0) - first
// used by My Account → Security → Login Details, which used window.prompt: a
// browser box headed with the site's address that showed the password as
// plain text. The password is checked by the server, not here; a refusal
// comes back as `error` and the dialog stays open to try again.
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PasswordConfirmDialog = ({
  open,
  title = "Confirm it's you",
  description = "Enter your current password to save these changes.",
  confirmLabel = "Confirm",
  error = "",
  submitting = false,
  onConfirm,
  onCancel,
}) => {
  const [password, setPassword] = useState("");

  // Never carry a typed password over to the next time it opens.
  useEffect(() => {
    if (!open) setPassword("");
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    if (!password || submitting) return;
    onConfirm(password);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !submitting) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="password-confirm-input">Current password</Label>
            <Input
              id="password-confirm-input"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(error)}
            />
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!password || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordConfirmDialog;
