import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import {
  Bold, Italic, Underline, List, ListOrdered,
  Loader2, Pencil, StickyNote,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { accountDocsAPI } from "../../../services/api"; // adjust path
import { useToastContext } from "../../../context/ToastContext"; // adjust path

const SANITIZE = {
  ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "ul", "ol", "li", "p", "br", "div", "span"],
  ALLOWED_ATTR: [],
};
const clean = (html) => DOMPurify.sanitize(html || "", SANITIZE);
const isBlank = (html) =>
  !clean(html).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const formatWhen = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short", day: "2-digit", year: "numeric",
        hour: "numeric", minute: "2-digit",
      })
    : "";

/* ---------------- Rich text editor ---------------- */
// Uncontrolled on purpose: setting innerHTML on every keystroke would move
// the caret. The initial value is applied once; remount with a `key` to reset.
const NoteEditor = ({ initialHtml = "", onChange, placeholder, autoFocus }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = clean(initialHtml);
      if (autoFocus) ref.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = (command) => {
    document.execCommand(command, false, null);
    ref.current?.focus();
    onChange?.(ref.current?.innerHTML || "");
  };

  const tools = [
    { cmd: "bold", icon: Bold, title: "Bold" },
    { cmd: "italic", icon: Italic, title: "Italic" },
    { cmd: "underline", icon: Underline, title: "Underline" },
    { cmd: "insertUnorderedList", icon: List, title: "Bulleted list" },
    { cmd: "insertOrderedList", icon: ListOrdered, title: "Numbered list" },
  ];

  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex gap-1 border-b border-border px-2 py-1.5">
        {tools.map(({ cmd, icon: Icon, title }) => (
          <Button
            key={cmd}
            type="button"
            variant="ghost"
            size="sm"
            title={title}
            className="h-7 w-7 p-0"
            // mousedown, not click - keeps the text selection in the editor
            onMouseDown={(e) => {
              e.preventDefault();
              run(cmd);
            }}
          >
            <Icon className="h-3.5 w-3.5" />
          </Button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
        className="note-editor min-h-[120px] max-h-[260px] overflow-auto px-3 py-2 text-sm outline-none
                   [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                   empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
};

/* ---------------- Dialog ---------------- */
export const FileNotesDialog = ({ file, open, onClose, onSaved }) => {
  const { showToast } = useToastContext();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState("");
  const [draftKey, setDraftKey] = useState(0); // remounts the editor to clear it

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  const loadNotes = async () => {
    if (!file?.path) return;
    setLoading(true);
    try {
      const res = await accountDocsAPI.getFileNotes(file.path);
      setNotes(res?.data?.notes || []);
    } catch (err) {
      console.error("Load notes failed:", err);
      showToast({ title: "Could not load notes", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setDraft("");
      setDraftKey((k) => k + 1);
      setEditingId(null);
      loadNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, file?.path]);

  const hasUnsaved = !isBlank(draft) || editingId !== null;

  const requestClose = () => {
    if (saving) return;
    if (hasUnsaved && !window.confirm("You have an unsaved note. Discard it?")) return;
    onClose();
  };

  const handleAdd = async () => {
    if (isBlank(draft)) return;
    setSaving(true);
    try {
      const res = await accountDocsAPI.addFileNote({
        filePath: file.path,
        content: clean(draft),
      });
      setNotes((prev) => [...prev, res.data.note]);
      setDraft("");
      setDraftKey((k) => k + 1);
      showToast({ title: "Note added", type: "success" });
      onSaved?.();
    } catch (err) {
      console.error("Add note failed:", err);
      showToast({
        title: err?.response?.data?.error || "Failed to add note",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (noteId) => {
    if (isBlank(editDraft)) return;
    setSaving(true);
    try {
      const res = await accountDocsAPI.updateFileNote(noteId, {
        filePath: file.path,
        content: clean(editDraft),
      });
      setNotes((prev) => prev.map((n) => (n.id === noteId ? res.data.note : n)));
      setEditingId(null);
      showToast({ title: "Note updated", type: "success" });
      onSaved?.();
    } catch (err) {
      console.error("Update note failed:", err);
      showToast({
        title: err?.response?.data?.error || "Failed to update note",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && requestClose()}>
      <DialogContent
        className="sm:max-w-2xl max-h-[88vh] flex flex-col"
        style={{ background: "hsl(var(--card))" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <StickyNote className="h-5 w-5" /> Notes
          </DialogTitle>
          <DialogDescription className="truncate">{file?.name}</DialogDescription>
        </DialogHeader>

        {/* Existing notes */}
        <div className="flex-1 overflow-auto space-y-3 pr-1">
          {loading ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No notes on this file yet.
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-xl border border-border p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {note.createdBy?.name || "Unknown"}
                    </span>{" "}
                    · {formatWhen(note.createdAt)}
                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <span>
                        {" "}· edited {formatWhen(note.updatedAt)}
                        {note.updatedBy?.name ? ` by ${note.updatedBy.name}` : ""}
                      </span>
                    )}
                  </div>
                  {editingId !== note.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      disabled={saving || editingId !== null}
                      onClick={() => {
                        setEditingId(note.id);
                        setEditDraft(note.content);
                      }}
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                </div>

                {editingId === note.id ? (
                  <div className="space-y-2">
                    <NoteEditor
                      key={`edit-${note.id}`}
                      initialHtml={note.content}
                      onChange={setEditDraft}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={saving}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={saving || isBlank(editDraft)}
                        onClick={() => handleUpdate(note.id)}
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: clean(note.content) }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* New note */}
        <div className="space-y-2 border-t border-border pt-4">
          <NoteEditor
            key={`new-${draftKey}`}
            onChange={setDraft}
            placeholder="Write a note about this file..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={requestClose} disabled={saving}>
              Close
            </Button>
            <Button onClick={handleAdd} disabled={saving || isBlank(draft)}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Add note"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileNotesDialog;