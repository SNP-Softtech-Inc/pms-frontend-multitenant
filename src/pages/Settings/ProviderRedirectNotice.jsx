// src/pages/Settings/ProviderRedirectNotice.jsx
//
// Shown when "Connect with Google / Microsoft / Zoho" is pressed: says the
// browser is about to leave for the provider's own sign-in page, then goes
// there by itself (providerRedirect.js). Continue now goes at once; Cancel
// stays on the page.
import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { SiGmail, SiZoho } from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { redirectCopy, scheduleRedirect } from "./providerRedirect";

const ICONS = { google: SiGmail, microsoft: FaMicrosoft, zoho: SiZoho };

/**
 * @param redirect  { provider, url } while redirecting, else null
 * @param onCancel  clears `redirect`
 */
const ProviderRedirectNotice = ({ redirect, onCancel }) => {
  const scheduled = useRef(null);

  useEffect(() => {
    if (!redirect) return undefined;

    scheduled.current = scheduleRedirect(redirect.url);
    return () => scheduled.current?.cancel();
  }, [redirect]);

  // Coming back with the browser's Back button can restore this page from
  // the cache with the notice still up; clear it instead of leaving the user
  // looking at a spinner that will never finish.
  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) onCancel();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [onCancel]);

  if (!redirect) return null;

  const copy = redirectCopy(redirect.provider);
  const Icon = ICONS[redirect.provider];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="provider-redirect-title"
      aria-describedby="provider-redirect-body"
    >
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-lg">
        {Icon && <Icon className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />}

        <h2 id="provider-redirect-title" className="text-lg font-semibold text-foreground">
          {copy.title}
        </h2>

        <p id="provider-redirect-body" className="mt-2 text-sm text-muted-foreground">
          {copy.body}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground" aria-live="polite">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Redirecting…
        </div>

        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => scheduled.current?.goNow()}>
            Continue now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderRedirectNotice;
