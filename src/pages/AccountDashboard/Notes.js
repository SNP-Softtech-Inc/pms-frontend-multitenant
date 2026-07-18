


import React, { useEffect, useState } from "react";
import Editor from "../../components/TextEditor";
import { useParams } from "react-router-dom";
import {useToastContext} from "../../context/ToastContext"

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../../components/ui/drawer";

import { Input } from "../../components/ui/input";

import {
  Edit3,
  Trash2,
  Pin,
  Archive,
  ArchiveRestore,
  Plus,
} from "lucide-react";

import { accountNoteAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useConfirm } from "../../components/ConfirmDialogContext";

const NoteApp = () => {
  const { accountId } = useParams();
  const { user } = useAuth();
  const confirm = useConfirm();
const {showToast} = useToastContext()
  const [view, setView] = useState("active");
  const [notes, setNotes] = useState([]);

  const [openDrawer, setOpenDrawer] = useState(false);

const [newNoteTitle, setNewNoteTitle] = useState("");
const [newNoteText, setNewNoteText] = useState("");

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  // ---------------- FETCH NOTES ----------------
  const handleFetchNotesByAccId = async (id) => {
    try {
      const res = await accountNoteAPI.getNotesByAccountId(id);

      const formatted = res.data.notes.map((note) => ({
        id: note._id,
        text: note.noteData,
          title: note.title,
        createdBy: note.createdBy,
        time: new Date(note.createdAt).toLocaleString(),
        archived: !note.active,
        pinned: note.pinned || false,
      }));

      formatted.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.time) - new Date(a.time);
      });

      setNotes(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleFetchNotesByAccId(accountId);
  }, [accountId]);

  // ---------------- CREATE ----------------
  // const handleAddNote = async () => {
  //   const payload = {
  //     account: accountId,
  //     noteData: newNoteText,
  //     createdBy: user?.username || user?.firstName || "Unknown",
  //   };

  //   try {
  //     await accountNoteAPI.createNote(payload);
  //     showToast({
  //       title: "Note created",
  //       type: "success",
  //     });
  //     setNewNoteText("");
  //     setNewNoteVisible(false);
  //     handleFetchNotesByAccId(accountId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
const handleAddNote = async () => {
  const payload = {
    account: accountId,
    title: newNoteTitle,
    noteData: newNoteText,
    createdBy: user?.username || user?.firstName || "Unknown",
  };

  try {
    await accountNoteAPI.createNote(payload);

    showToast({
      title: "Note created",
      type: "success",
    });

    setNewNoteTitle("");
    setNewNoteText("");
    setOpenDrawer(false);

    handleFetchNotesByAccId(accountId);
  } catch (err) {
    console.error(err);
  }
};
  // ---------------- PIN ----------------
  const handleTogglePin = async (note) => {
    try {
      await accountNoteAPI.updateNote(note.id, {
        pinned: !note.pinned,
      });
      handleFetchNotesByAccId(accountId);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- ARCHIVE ----------------
  const handleArchive = async (id) => {
    await accountNoteAPI.updateNote(id, { active: false });
    showToast({
      title: "Note archived",
      type: "success",
    });
    handleFetchNotesByAccId(accountId);
  };

  const handleUnarchive = async (id) => {
    await accountNoteAPI.updateNote(id, { active: true });
    showToast({
      title: "Note restored",
      type: "success",
    });
    handleFetchNotesByAccId(accountId);
  };

  // ---------------- DELETE ----------------
  const handleDelete = (id) => {
    confirm({
      title: "Delete Note",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        await accountNoteAPI.deleteNote(id);
        showToast({
          title: "Note deleted",
          type: "success",
        });
        handleFetchNotesByAccId(accountId);
      },
    });
  };

  // ---------------- EDIT ----------------
  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.text);
  };

  const handleUpdate = async () => {
    await accountNoteAPI.updateNote(editingNoteId, {
      noteData: editingNoteText,
    });

    setEditingNoteId(null);
    setEditingNoteText("");
    handleFetchNotesByAccId(accountId);
  };

  const filtered = notes.filter((n) =>
    view === "active" ? !n.archived : n.archived
  );

  
return (
  <div className="min-h-screen bg-background text-foreground p-6">

    {/* Header */}
    <div className="flex items-center justify-between mb-6">

      {/* View Toggle */}
      <div className="flex gap-2 p-1 rounded-xl border border-border bg-muted/30 shadow-sm">
        <Button
          variant={view === "active" ? "default" : "ghost"}
          onClick={() => setView("active")}
        >
          Active
        </Button>

        <Button
          variant={view === "archived" ? "default" : "ghost"}
          onClick={() => setView("archived")}
        >
          Archived
        </Button>
      </div>

      {/* New Note */}
      <Button onClick={() => setOpenDrawer(true)}>
        <Plus className="w-4 h-4 mr-2" />
        New Note
      </Button>
    </div>

    {/* Create Note */}
    {/* {newNoteVisible && (
      <Card className="mb-6 bg-card border border-border shadow-sm">
        <CardContent className="p-4 space-y-4">

          <div className="relative z-10">
            <Editor value={newNoteText} onChange={setNewNoteText} />
          </div>

          <div className="flex gap-3 mt-6 relative z-20">
            <Button onClick={handleAddNote}>
              Save new note
            </Button>

            <Button
              variant="outline"
              onClick={() => setNewNoteVisible(false)}
            >
              Cancel
            </Button>
          </div>

        </CardContent>
      </Card>
    )} */}
<Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
  <DrawerContent className="max-w-3xl mx-auto">

    <DrawerHeader>
      <DrawerTitle>Create Note</DrawerTitle>
      <DrawerDescription>
        Add a title and description for this note.
      </DrawerDescription>
    </DrawerHeader>

    <div className="px-6 pb-4 space-y-5">

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Title
        </label>

        <Input
          placeholder="Enter note title..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description
        </label>

        <Editor
          value={newNoteText}
          onChange={setNewNoteText}
        />
      </div>

    </div>

    <DrawerFooter className="flex-row justify-end gap-2">

      <DrawerClose asChild>
        <Button variant="outline">
          Cancel
        </Button>
      </DrawerClose>

      <Button
        onClick={handleAddNote}
        disabled={!newNoteTitle.trim()}
      >
        Save Note
      </Button>

    </DrawerFooter>

  </DrawerContent>
</Drawer>
    {/* Notes List */}
    <div className="space-y-5">
      {filtered.map((note) => (
        <Card
          key={note.id}
          className={`
            relative overflow-hidden rounded-2xl
            bg-card text-card-foreground
            border border-border
            shadow-sm transition-all duration-200
            hover:shadow-lg hover:-translate-y-[1px]
            ${note.pinned ? "border-yellow-500/40" : ""}
          `}
        >

          {/* Pinned Accent */}
          {note.pinned && (
            <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500" />
          )}

          <CardContent className="p-5">

            {/* EDIT MODE */}
            {editingNoteId === note.id ? (
              <>
                <div className="mb-3 text-sm font-medium text-muted-foreground">
                  Editing note...
                </div>

                <Editor
                  value={editingNoteText}
                  onChange={setEditingNoteText}
                />

                <div className="mt-4 flex gap-2">
                  <Button onClick={handleUpdate}>
                    Update
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setEditingNoteId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* HEADER */}
                <div className="flex items-start justify-between gap-4">

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {note.createdBy}
                    </div>

                    <div className="text-xs text-muted-foreground/70">
                      {note.time}
                    </div>
                  </div>

                  {note.pinned && (
                    <span className="text-yellow-500">📌</span>
                  )}
                </div>

                {/* BODY */}
                {/* <div
                  className="prose prose-sm max-w-none text-foreground/80 mt-4"
                  dangerouslySetInnerHTML={{
                    __html: note.text || "No content",
                  }}
                /> */}
<div className="mt-4">

  <h3 className="text-lg font-semibold">
    {note.title}
  </h3>

  <div
    className="prose prose-sm max-w-none mt-3 text-foreground/80"
    dangerouslySetInnerHTML={{
      __html: note.text || "No description",
    }}
  />

</div>
                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between">

                  {/* ACTIONS */}
                  <div className="flex items-center gap-1">

                    {view === "active" ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTogglePin(note)}
                          className="hover:bg-muted"
                        >
                          <Pin
                            className={`w-4 h-4 ${
                              note.pinned
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleArchive(note.id)}
                        >
                          <Archive className="w-4 h-4 text-muted-foreground" />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => handleEdit(note)}
                          className="text-muted-foreground"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => handleUnarchive(note.id)}
                        >
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restore
                        </Button>

                        <Button
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>

                  {/* TAG */}
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs bg-muted text-muted-foreground border border-border"
                  >
                    {view === "active" ? "Active" : "Archived"}
                  </Badge>

                </div>
              </>
            )}

          </CardContent>
        </Card>
      ))}
    </div>

  </div>
);
};

export default NoteApp;


