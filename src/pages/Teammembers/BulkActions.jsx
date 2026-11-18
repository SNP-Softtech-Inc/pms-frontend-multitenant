// src/pages/Teammembers/BulkActions.jsx
//
// Teams & Plans bulk actions (v1.89.0): the buttons shown in the table
// toolbar when rows are selected, and the "Add to group" picker.
//
// Every action asks first (useConfirm). Delete says it cannot be undone. Each
// runs the same per-row request the row menu uses, one at a time (bulk.js),
// and the toast names any that failed and why.
import React, { useEffect, useState } from "react";
import { Loader2, Trash2, UserX, UserCheck, Mail, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { authAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { useToastContext } from "../../context/ToastContext";
import { runBulk, bulkResultToast, countLabel } from "./bulk";

const ask = (confirm, prompt) =>
  new Promise((resolve) =>
    confirm({ ...prompt, onConfirm: () => resolve(true), onCancel: () => resolve(false) })
  );

const names = (rows) => {
  const shown = rows.slice(0, 5).map((r) => r.name).join(", ");
  return rows.length > 5 ? `${shown} and ${rows.length - 5} more` : shown;
};

/** Pick one of the firm's groups. Resolves the chosen group id, or null. */
export const AddToGroupDialog = ({ open, count, onCancel, onAdd, busy }) => {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setGroupId("");
    setLoading(true);
    authAPI
      .getGroups()
      .then((res) => setGroups(res?.data?.data || res?.data?.groups || res?.data || []))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !busy && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to group</DialogTitle>
          <DialogDescription>
            Add {countLabel(count, "team member")} to the group you choose.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading groups…</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">There are no groups yet. Create one on the Groups tab.</p>
        ) : (
          <select
            aria-label="Group"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            disabled={busy}
          >
            <option value="">Choose a group…</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name || g.groupName || "Unnamed group"}
              </option>
            ))}
          </select>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={() => onAdd(groupId)} disabled={!groupId || busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * kind: "active" | "inactive" | "groups"
 * rows: the selected rows ({ id, name, raw })
 * onDone: refresh the list and clear the selection
 */
const BulkActions = ({ kind, rows, onDone }) => {
  const confirm = useConfirm();
  const { showToast } = useToastContext();
  const [busy, setBusy] = useState(false);
  const [groupPicker, setGroupPicker] = useState(false);

  const noun = kind === "groups" ? "group" : "team member";

  const run = async (action, request) => {
    setBusy(true);
    try {
      const result = await runBulk(rows, request);
      showToast(bulkResultToast(action, noun, result));
    } finally {
      setBusy(false);
      onDone();
    }
  };

  const confirmThen = async (prompt, action, request) => {
    if (busy || rows.length === 0) return;
    if (await ask(confirm, prompt)) await run(action, request);
  };

  const deactivate = () =>
    confirmThen(
      {
        title: `Deactivate ${countLabel(rows.length, "team member")}?`,
        description: `${names(rows)} will no longer be able to sign in. You can reactivate them from Deactive Members.`,
        confirmText: "Deactivate",
      },
      { verb: "deactivate", done: "Deactivated" },
      (r) => authAPI.deactivateTeamMember(r.id)
    );

  const reactivate = () =>
    confirmThen(
      {
        title: `Reactivate ${countLabel(rows.length, "team member")}?`,
        description: `${names(rows)} will be able to sign in again. Anyone who has not accepted their invitation yet needs it resent instead.`,
        confirmText: "Reactivate",
      },
      { verb: "reactivate", done: "Reactivated" },
      (r) => authAPI.reactivateTeamMember(r.id)
    );

  const resend = () =>
    confirmThen(
      {
        title: `Resend activation to ${countLabel(rows.length, "team member")}?`,
        description: `An activation email goes to ${names(rows)}.`,
        confirmText: "Resend",
      },
      { verb: "resend activation to", done: "Resent activation to" },
      (r) => authAPI.resendActivation(r.id)
    );

  const remove = () =>
    confirmThen(
      {
        title: `Delete ${countLabel(rows.length, noun)}?`,
        description:
          kind === "groups"
            ? `${names(rows)} will be deleted. Their members are not deleted. This cannot be undone.`
            : `${names(rows)} will be deleted, with their sign-in. This cannot be undone. To keep their history, deactivate them instead.`,
        confirmText: "Delete permanently",
      },
      { verb: "delete", done: "Deleted" },
      (r) => (kind === "groups" ? authAPI.deleteGroup(r.id) : authAPI.deleteTeamMember(r.id))
    );

  const addToGroup = async (groupId) => {
    const userIds = rows.map((r) => r.raw?.userId).filter(Boolean);
    setBusy(true);
    try {
      await authAPI.addMembersToGroup(groupId, userIds);
      const skipped = rows.length - userIds.length;
      showToast({
        title: `Added ${countLabel(userIds.length, "team member")} to the group`,
        description: skipped ? `${countLabel(skipped, "member")} without a sign-in yet could not be added.` : undefined,
        type: skipped ? "warning" : "success",
      });
      setGroupPicker(false);
    } catch (err) {
      showToast({
        title: "Could not add them to the group",
        description: err?.response?.data?.message || "Please try again.",
        type: "error",
      });
    } finally {
      setBusy(false);
      onDone();
    }
  };

  const btn = "h-7 gap-1.5 text-xs";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {busy ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Working" /> : null}

      {kind === "active" && (
        <>
          <Button size="sm" variant="outline" className={btn} disabled={busy} onClick={() => setGroupPicker(true)}>
            <Users className="h-3.5 w-3.5" /> Add to group
          </Button>
          <Button size="sm" variant="outline" className={btn} disabled={busy} onClick={deactivate}>
            <UserX className="h-3.5 w-3.5" /> Deactivate
          </Button>
        </>
      )}

      {kind === "inactive" && (
        <>
          <Button size="sm" variant="outline" className={btn} disabled={busy} onClick={reactivate}>
            <UserCheck className="h-3.5 w-3.5" /> Reactivate
          </Button>
          <Button size="sm" variant="outline" className={btn} disabled={busy} onClick={resend}>
            <Mail className="h-3.5 w-3.5" /> Resend activation
          </Button>
        </>
      )}

      <Button size="sm" variant="outline" className={`${btn} text-destructive hover:text-destructive`} disabled={busy} onClick={remove}>
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </Button>

      {kind === "active" && (
        <AddToGroupDialog
          open={groupPicker}
          count={rows.length}
          busy={busy}
          onCancel={() => setGroupPicker(false)}
          onAdd={addToGroup}
        />
      )}
    </div>
  );
};

export default BulkActions;
