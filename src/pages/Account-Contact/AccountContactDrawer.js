


import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetOverlay
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";
import AccountContactForm from "./AccountContactForm";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccountData,
  setSelectedContacts,
  setDraftFor,
  resetForm,
  restoreNewDraft,
} from "../../redux/accountContactSlice";
import { loadNewDraft } from "../../redux/accountContactDraft";
import { accountsAPI } from "../../services/api";

export default function AccountContactDrawer({
  open,
  onClose,
  accountId = null,
  handleDrawerClose,
}) {
  const dispatch = useDispatch();
  const draftFor = useSelector((state) => state.accountContact.draftFor);

  useEffect(() => {
    // Closing no longer clears anything - a half-filled form survives an
    // accidental Back/overlay click and is still there on reopen. The form is
    // cleared instead when a different thing is opened, and after a
    // successful save (see AccountContactForm).
    if (!open) return;

    const target = accountId || "new";

    // Already holding the draft for this exact target - leave it alone.
    if (draftFor === target) return;

    if (accountId) {
      (async () => {
        try {
          const { data: account } =
            await accountsAPI.getAccountById(accountId);

          dispatch(setAccountData(account));

          const selectedContacts =
            account.contacts?.map((c) => ({
              ...c.contact,
              login: c.canLogin,
              notify: c.canNotify || false,
              emailSync: c.canEmailSync || false,
              _id: c.contact._id,
            })) || [];

          dispatch(setSelectedContacts(selectedContacts));
          dispatch(setDraftFor(accountId));
        } catch (error) {
          console.error("Failed to load account data:", error);
          dispatch(resetForm());
          onClose();
        }
      })();
    } else {
      // Opening "new account" while the form holds something else - usually
      // an account that was opened for editing in between. Before clearing,
      // check whether a half-filled draft was stashed: losing it here is how
      // a typed-out Company account came back blank and reset to Individual.
      const draft = loadNewDraft();

      if (draft) {
        dispatch(restoreNewDraft(draft));
      } else {
        dispatch(resetForm());
        dispatch(setDraftFor("new"));
      }
    }
  }, [open, accountId, draftFor, dispatch, onClose]);

  return (

<Sheet open={open} onOpenChange={onClose}>
  {/* 👇 Use your exact styling */}
  <SheetOverlay className="bg-foreground/20 backdrop-blur-sm" />

  <SheetContent
    side="right"
    className="!w-[700px] !max-w-none p-0 flex flex-col"
  >
    {/* Header */}
    {/* <SheetHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
      <SheetTitle className="text-lg font-semibold">
        {accountId ? "Update Account" : "Create Account"}
      </SheetTitle>
    </SheetHeader> */}
<SheetHeader
  className="
    flex
    flex-row
    items-center
    justify-between
    border-b
    border-border/60
    bg-card/80
    backdrop-blur-xl
    px-6
    py-4
    sticky
    top-0
    z-20
    shadow-sm
  "
>
  <div className="flex flex-col gap-1">
    <SheetTitle
      className="
        text-foreground
        font-semibold
        tracking-tight
      "
      style={{
        fontFamily: "var(--font-family)",
        fontSize:
          "calc(1.125rem * parseFloat(var(--font-scale)) / 100)",
      }}
    >
      {accountId ? "Update Account" : "Create Account"}
    </SheetTitle>

    <p
      className="
        text-xs
        text-muted-foreground
      "
      style={{
        fontFamily: "var(--font-family)",
        fontSize:
          "calc(0.75rem * parseFloat(var(--font-scale)) / 100)",
      }}
    >
      Manage account details and assignments.
    </p>
  </div>
  <div><X className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" onClick={onClose}/></div>
</SheetHeader>
    {/* Body */}
    <div className="p-6 overflow-y-auto flex-1">
      <AccountContactForm
        isEditing={!!accountId}
        accountId={accountId}
        onCloseDrawer={onClose}
        handleDrawerClose={handleDrawerClose}
      />
    </div>
  </SheetContent>
</Sheet>
  );
}