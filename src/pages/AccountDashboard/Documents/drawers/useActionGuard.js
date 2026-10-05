import React, { useCallback, useRef, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * Guards a drawer against being dismissed while something is still running.
 *
 * Clicking the backdrop used to call onClose outright, so an upload in
 * progress vanished behind the drawer and the user had no way of telling
 * whether it had been cancelled or was still going. When `busy` is true the
 * dismissal is held and a confirmation is shown instead.
 *
 * `abortRef` is optional. When the caller stores an AbortController on it,
 * choosing to terminate actually aborts the request rather than only hiding
 * the drawer - otherwise "terminate" would be a label for something that did
 * not happen.
 */
export function useActionGuard(busy, onClose, abortRef = null) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const internalAbortRef = useRef(null);
  const controllerRef = abortRef || internalAbortRef;

  // Use for the backdrop and the X button.
  const requestClose = useCallback(() => {
    if (busy) {
      setConfirmOpen(true);
      return;
    }
    onClose?.();
  }, [busy, onClose]);

  const resumeAction = useCallback(() => setConfirmOpen(false), []);

  const terminateAction = useCallback(() => {
    setConfirmOpen(false);
    try {
      controllerRef.current?.abort();
    } catch {
      // Already settled - nothing to stop.
    }
    onClose?.();
  }, [controllerRef, onClose]);

  return { confirmOpen, requestClose, resumeAction, terminateAction };
}

export function ActionInProgressDialog({
  open,
  title = "Action still in progress",
  description = "Closing now will stop it. Do you want to continue the action or terminate it?",
  continueLabel = "Continue action",
  terminateLabel = "Terminate action",
  onResume,
  onTerminate,
}) {
  if (!open) return null;

  return (
    // Above the drawer's own z-50 so it is not buried by the panel it guards.
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onTerminate}>
            {terminateLabel}
          </Button>
          <Button onClick={onResume}>{continueLabel}</Button>
        </div>
      </div>
    </div>
  );
}
