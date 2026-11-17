// src/components/SessionExpiryWarning.jsx
//
// Shown before the sign-in runs out (v1.84.0): 10 minutes before the end, or
// halfway through a sign-in shorter than 20 minutes (src/lib/sessionTime.js).
// "Renew session" asks the server for a fresh session of the same length
// (POST /api/auth/renew-session - only a session that is still valid can be
// renewed). "Dismiss" hides it for this session; at the end AuthContext signs
// the user out and says so.
import React, { useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToastContext } from "../context/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  formatDuration,
  parseSession,
  remainingMs,
  shouldWarn,
} from "../lib/sessionTime";

const SessionExpiryWarning = () => {
  const { isAuthenticated, session, renewSession } = useAuth();
  const { showToast } = useToastContext();

  const [now, setNow] = useState(() => Date.now());
  const [dismissedFor, setDismissedFor] = useState(null);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !session) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isAuthenticated, session]);

  const open =
    Boolean(isAuthenticated) &&
    shouldWarn(session, now) &&
    dismissedFor !== session?.expiresAt;

  const dismiss = () => setDismissedFor(session?.expiresAt ?? null);

  const renew = async () => {
    setRenewing(true);
    try {
      const data = await renewSession();
      const renewed = parseSession(data?.session);
      showToast({
        title: "Session renewed",
        description: renewed
          ? `You are signed in for another ${formatDuration(renewed.durationMs)}.`
          : "You can keep working.",
        type: "success",
      });
    } catch (err) {
      showToast({
        title: "Could not renew the session",
        description:
          err?.response?.data?.message ||
          "Please save your work and sign in again.",
        type: "error",
      });
    } finally {
      setRenewing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !renewing) dismiss();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Your session is about to expire
          </DialogTitle>
          <DialogDescription>
            Your session will expire in {formatDuration(remainingMs(session, now))}.
            Please save your work, or renew your session to avoid interruption.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={dismiss} disabled={renewing}>
            Dismiss
          </Button>
          <Button onClick={renew} disabled={renewing}>
            {renewing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Renewing...
              </>
            ) : (
              "Renew session"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionExpiryWarning;
