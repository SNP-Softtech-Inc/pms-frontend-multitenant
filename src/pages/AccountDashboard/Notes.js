


// import React, { useEffect, useState } from "react";
// // import Editor from "../../components/TextEditor";
// import { useParams } from "react-router-dom";
// import {useToastContext} from "../../context/ToastContext"

// import { Button } from "../../components/ui/button";
// import { Card, CardContent } from "../../components/ui/card";
// import { Badge } from "../../components/ui/badge";


// import { Input } from "../../components/ui/input";

// import {
//   Edit3,
//   Trash2,
//   Pin,
//   Archive,
//   ArchiveRestore,
//   Plus,
// } from "lucide-react";

// import { accountNoteAPI } from "../../services/api";
// import { useAuth } from "../../context/AuthContext";
// import { useConfirm } from "../../components/ConfirmDialogContext";
// import { X, ChevronDown,  } from "lucide-react";
// import { Label } from "../../components/ui/label";
// import TextEditor from "../../components/textEditor/TextEditior";
// const NoteApp = () => {
//   const { accountId } = useParams();
//   const { user } = useAuth();
//   const confirm = useConfirm();
// const {showToast} = useToastContext()
//   const [view, setView] = useState("active");
//   const [notes, setNotes] = useState([]);
// const [newNoteFiles, setNewNoteFiles] = useState([]);
//   const [openDrawer, setOpenDrawer] = useState(false);
// const [editingNoteFiles, setEditingNoteFiles] = useState([]);
// const [newNoteTitle, setNewNoteTitle] = useState("");
// const [newNoteText, setNewNoteText] = useState("");

//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [editingNoteText, setEditingNoteText] = useState("");

//   // ---------------- FETCH NOTES ----------------
//   const handleFetchNotesByAccId = async (id) => {
//     try {
//       const res = await accountNoteAPI.getNotesByAccountId(id);

//       const formatted = res.data.notes.map((note) => ({
//         id: note._id,
//         text: note.noteData,
//           title: note.title,
//         createdBy: note.createdBy,
//         time: new Date(note.createdAt).toLocaleString(),
//         archived: !note.active,
//         pinned: note.pinned || false,
//       }));

//       formatted.sort((a, b) => {
//         if (a.pinned && !b.pinned) return -1;
//         if (!a.pinned && b.pinned) return 1;
//         return new Date(b.time) - new Date(a.time);
//       });

//       setNotes(formatted);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     handleFetchNotesByAccId(accountId);
//   }, [accountId]);

//   const handleAddNote = async () => {
//   try {
//     const formData = new FormData();

//     formData.append("account", accountId);
//     formData.append("title", newNoteTitle);
//     formData.append("noteData", newNoteText);
//     formData.append(
//       "createdBy",
//       user?.username || user?.firstName || "Unknown"
//     );

//     // Add files coming from TextEditor
//     newNoteFiles.forEach((file) => {
//       formData.append("files", file);
//     });

//     await accountNoteAPI.createNote(formData);

//     showToast({
//       title: "Note created",
//       type: "success",
//     });

//     setNewNoteTitle("");
//     setNewNoteText("");
//     setNewNoteFiles([]);
//     setOpenDrawer(false);

//     handleFetchNotesByAccId(accountId);
//   } catch (err) {
//     console.error("Create note error:", err);
//   }
// };
// // const handleAddNote = async () => {
// //   const payload = {
// //     account: accountId,
// //     title: newNoteTitle,
// //     noteData: newNoteText,
// //     createdBy: user?.username || user?.firstName || "Unknown",
// //   };
// // console.log("note details",payload)
// //   try {
    
// //     await accountNoteAPI.createNote(payload);

// //     showToast({
// //       title: "Note created",
// //       type: "success",
// //     });

// //     setNewNoteTitle("");
// //     setNewNoteText("");
// //     setOpenDrawer(false);

// //     handleFetchNotesByAccId(accountId);
// //   } catch (err) {
// //     console.error(err);
// //   }
// // };
//   // ---------------- PIN ----------------
//   const handleTogglePin = async (note) => {
//     try {
//       await accountNoteAPI.updateNote(note.id, {
//         pinned: !note.pinned,
//       });
//       handleFetchNotesByAccId(accountId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ---------------- ARCHIVE ----------------
//   const handleArchive = async (id) => {
//     await accountNoteAPI.updateNote(id, { active: false });
//     showToast({
//       title: "Note archived",
//       type: "success",
//     });
//     handleFetchNotesByAccId(accountId);
//   };

//   const handleUnarchive = async (id) => {
//     await accountNoteAPI.updateNote(id, { active: true });
//     showToast({
//       title: "Note restored",
//       type: "success",
//     });
//     handleFetchNotesByAccId(accountId);
//   };

//   // ---------------- DELETE ----------------
//   const handleDelete = (id) => {
//     confirm({
//       title: "Delete Note",
//       description: "This action cannot be undone.",
//       onConfirm: async () => {
//         await accountNoteAPI.deleteNote(id);
//         showToast({
//           title: "Note deleted",
//           type: "success",
//         });
//         handleFetchNotesByAccId(accountId);
//       },
//     });
//   };

//   // ---------------- EDIT ----------------
//   const handleEdit = (note) => {
//     setEditingNoteId(note.id);
//     setEditingNoteText(note.text);
//   };

//   const handleUpdate = async () => {
//     await accountNoteAPI.updateNote(editingNoteId, {
//       noteData: editingNoteText,
//     });

//     setEditingNoteId(null);
//     setEditingNoteText("");
//     handleFetchNotesByAccId(accountId);
//   };

//   const filtered = notes.filter((n) =>
//     view === "active" ? !n.archived : n.archived
//   );

  
// return (
//   <div className="min-h-screen bg-background text-foreground p-6">

//     {/* Header */}
//     <div className="flex items-center justify-between mb-6">

//       {/* View Toggle */}
//       <div className="flex gap-2 p-1 rounded-xl border border-border bg-muted/30 shadow-sm">
//         <Button
//           variant={view === "active" ? "default" : "ghost"}
//           onClick={() => setView("active")}
//         >
//           Active
//         </Button>

//         <Button
//           variant={view === "archived" ? "default" : "ghost"}
//           onClick={() => setView("archived")}
//         >
//           Archived
//         </Button>
//       </div>

//       {/* New Note */}
//       <Button onClick={() => setOpenDrawer(true)}>
//         <Plus className="w-4 h-4 mr-2" />
//         New Note
//       </Button>
//     </div>

    
// {openDrawer && (
//   <div className="fixed inset-0 z-50 overflow-hidden">
//     {/* Overlay */}
//     <div
//       className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
//       onClick={() => setOpenDrawer(false)}
//     />

//     {/* Drawer */}
//     <div
//       className="
//         absolute right-0 top-0
//         flex h-full w-full flex-col
//         bg-background text-foreground
//         border-l border-border
//         shadow-2xl
//         sm:w-[650px]
//       "
//     >
//       {/* Header */}
//       <div
//         className="
//           flex items-center justify-between
//           border-b border-border
//           bg-muted/30 dark:bg-muted/10
//           px-6 py-5 shrink-0
//         "
//       >
//         <div>
//           <h2
//             className="font-semibold text-foreground"
//             style={{
//               fontFamily: "var(--font-family)",
//               fontSize:
//                 "calc(1.05rem * parseFloat(var(--font-scale)) / 100)",
//             }}
//           >
//             Create Note
//           </h2>

//           <p
//             className="mt-1 text-muted-foreground"
//             style={{
//               fontFamily: "var(--font-family)",
//               fontSize:
//                 "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
//             }}
//           >
//             Add a title and description for this note.
//           </p>
//         </div>

//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setOpenDrawer(false)}
//           className="
//             rounded-xl
//             text-muted-foreground
//             hover:bg-muted
//             hover:text-foreground
//           "
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Body */}
//       <div className="flex-1 overflow-y-auto px-6 py-6">
//         <div className="space-y-6">
//           {/* Title */}
//           <div
//             className="
//               rounded-2xl
//               border border-border
//               bg-card dark:bg-card/70
//               p-5 shadow-sm
//             "
//           >
//             <div className="space-y-2">
//               <Label>Title</Label>

//               <Input
//                 placeholder="Enter note title..."
//                 value={newNoteTitle}
//                 onChange={(e) => setNewNoteTitle(e.target.value)}
//                 className="
//                   h-11 rounded-xl
//                   border-border
//                   bg-background
//                   shadow-sm
//                   focus-visible:ring-2
//                   focus-visible:ring-primary/20
//                 "
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div
//             className="
//               rounded-2xl
//               border border-border
//               bg-card dark:bg-card/70
//               p-5 shadow-sm
//             "
//           >
//             <div className="space-y-2">
//               <Label>Description</Label>

//               {/* <Editor
//                 value={newNoteText}
//                 onChange={setNewNoteText}
//               /> */}
//                 <TextEditor  value={newNoteText} onChange={setNewNoteText}  />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div
//         className="
//           flex items-center justify-end gap-3
//           border-t border-border
//           bg-muted/20 dark:bg-muted/10
//           px-6 py-4 shrink-0
//         "
//       >
//         <Button
//           variant="outline"
//           onClick={() => setOpenDrawer(false)}
//           className="rounded-xl"
//         >
//           Cancel
//         </Button>

//         <Button
//           onClick={handleAddNote}
//           disabled={!newNoteTitle.trim()}
//           className="rounded-xl"
//         >
//           Save Note
//         </Button>
//       </div>
//     </div>
//   </div>
// )}
//     {/* Notes List */}
//     <div className="space-y-5">
//       {filtered.map((note) => (
//         <Card
//           key={note.id}
//           className={`
//             relative overflow-hidden rounded-2xl
//             bg-card text-card-foreground
//             border border-border
//             shadow-sm transition-all duration-200
//             hover:shadow-lg hover:-translate-y-[1px]
//             ${note.pinned ? "border-yellow-500/40" : ""}
//           `}
//         >

//           {/* Pinned Accent */}
//           {note.pinned && (
//             <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500" />
//           )}

//           <CardContent className="p-5">

//             {/* EDIT MODE */}
//             {editingNoteId === note.id ? (
//               <>
//                 <div className="mb-3 text-sm font-medium text-muted-foreground">
//                   Editing note...
//                 </div>

//                 <TextEditor
//                   value={editingNoteText}
//                   onChange={setEditingNoteText}
//                 />

//                 <div className="mt-4 flex gap-2">
//                   <Button onClick={handleUpdate}>
//                     Update
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() => setEditingNoteId(null)}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* HEADER */}
//                 <div className="flex items-start justify-between gap-4">

//                   <div className="space-y-1">
//                     <div className="text-xs text-muted-foreground">
//                       {note.createdBy}
//                     </div>

//                     <div className="text-xs text-muted-foreground/70">
//                       {note.time}
//                     </div>
//                   </div>

//                   {note.pinned && (
//                     <span className="text-yellow-500">📌</span>
//                   )}
//                 </div>

//                 {/* BODY */}
//                 {/* <div
//                   className="prose prose-sm max-w-none text-foreground/80 mt-4"
//                   dangerouslySetInnerHTML={{
//                     __html: note.text || "No content",
//                   }}
//                 /> */}
// <div className="mt-4">

//   <h3 className="text-lg font-semibold">
//     {note.title}
//   </h3>

//   <div
//     className="prose prose-sm max-w-none mt-3 text-foreground/80"
//     dangerouslySetInnerHTML={{
//       __html: note.text || "No description",
//     }}
//   />

// </div>
//                 {/* FOOTER */}
//                 <div className="mt-5 flex items-center justify-between">

//                   {/* ACTIONS */}
//                   <div className="flex items-center gap-1">

//                     {view === "active" ? (
//                       <>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleTogglePin(note)}
//                           className="hover:bg-muted"
//                         >
//                           <Pin
//                             className={`w-4 h-4 ${
//                               note.pinned
//                                 ? "text-yellow-500"
//                                 : "text-muted-foreground"
//                             }`}
//                           />
//                         </Button>

//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleArchive(note.id)}
//                         >
//                           <Archive className="w-4 h-4 text-muted-foreground" />
//                         </Button>

//                         <Button
//                           variant="ghost"
//                           onClick={() => handleEdit(note)}
//                           className="text-muted-foreground"
//                         >
//                           <Edit3 className="w-4 h-4 mr-2" />
//                           Edit
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Button
//                           variant="ghost"
//                           onClick={() => handleUnarchive(note.id)}
//                         >
//                           <ArchiveRestore className="w-4 h-4 mr-2" />
//                           Restore
//                         </Button>

//                         <Button
//                           variant="ghost"
//                           className="text-red-500 hover:text-red-600"
//                           onClick={() => handleDelete(note.id)}
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" />
//                           Delete
//                         </Button>
//                       </>
//                     )}
//                   </div>

//                   {/* TAG */}
//                   <Badge
//                     variant="secondary"
//                     className="rounded-full px-3 py-1 text-xs bg-muted text-muted-foreground border border-border"
//                   >
//                     {view === "active" ? "Active" : "Archived"}
//                   </Badge>

//                 </div>
//               </>
//             )}

//           </CardContent>
//         </Card>
//       ))}
//     </div>

//   </div>
// );
// };

// export default NoteApp;




import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToastContext } from "../../context/ToastContext";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
  Edit3,
  Trash2,
  Pin,
  Archive,
  ArchiveRestore,
  Plus,
  X,
  Loader2,
  Lock,
  AlertTriangle,
} from "lucide-react";

import { accountNoteAPI } from "../../services/api";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import { keepIfSame } from "../../lib/autoRefresh";
import { useAuth } from "../../context/AuthContext";
import { useConfirm } from "../../components/ConfirmDialogContext";
import TextEditor from "../../components/textEditor/TextEditior";

const NoteApp = () => {
  const { accountId } = useParams();
  const { user } = useAuth();
  const confirm = useConfirm();
  const { showToast } = useToastContext();

  const [view, setView] = useState("active");
  // Which note type is being shown. Reviewer notes are an append-only log -
  // permanent once written - so they live in their own tab rather than mixed
  // in with editable notes.
  const [noteTab, setNoteTab] = useState("standard");
  const [notes, setNotes] = useState([]);

  // Drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");

  // Note form
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Files
  const [newNoteFiles, setNewNoteFiles] = useState([]);
  const [editingNoteFiles, setEditingNoteFiles] = useState([]);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Appending to a reviewer note's log. Only one composer is open at a time -
  // the id of the note it belongs to - so the + on another note closes it
  // rather than leaving half-typed entries scattered down the page.
  const [logComposerNoteId, setLogComposerNoteId] = useState(null);
  const [logText, setLogText] = useState("");
  const [isAppendingLog, setIsAppendingLog] = useState(false);

  // ---------------- FETCH NOTES ----------------
  // silent (auto refresh): isFetching untouched, and unchanged notes kept as
  // they are.
  const handleFetchNotesByAccId = async (id, { silent = false } = {}) => {
    try {
      if (!silent) setIsFetching(true);

      const res = await accountNoteAPI.getNotesByAccountId(id);

      const formatted = res.data.notes.map((note) => ({
        id: note._id,
        text: note.noteData,
        title: note.title,
        createdBy: note.createdBy,
        time: new Date(note.createdAt).toLocaleString(),
        archived: !note.active,
        pinned: note.pinned || false,
        // Older notes predate the field and are standard by default.
        noteType: note.noteType || "standard",
        // A reviewer note is a heading with an append-only log under it.
        // Reviewer notes written before the log existed have none, so their
        // body stands in as the first entry - read at display time, nothing
        // stored is rewritten.
        logs:
          note.logs?.length > 0
            ? note.logs.map((log) => ({
                id: log._id,
                text: log.text,
                createdBy: log.createdBy,
                createdByEmail: log.createdByEmail || "",
                time: new Date(log.createdAt).toLocaleString(),
              }))
            : note.noteType === "reviewer"
              ? [
                  {
                    id: `${note._id}-legacy`,
                    text: note.noteData,
                    createdBy: note.createdBy,
                    createdByEmail: "",
                    time: new Date(note.createdAt).toLocaleString(),
                  },
                ]
              : [],
      }));

      formatted.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        return new Date(b.time) - new Date(a.time);
      });

      setNotes(silent ? keepIfSame(formatted) : formatted);
    } catch (err) {
      console.error("Fetch notes error:", err);
    } finally {
      if (!silent) setIsFetching(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      handleFetchNotesByAccId(accountId);
    }
  }, [accountId]);

  // Paused while a note is being written or saved.
  useAutoRefresh(() => handleFetchNotesByAccId(accountId, { silent: true }), {
    enabled: Boolean(accountId) && !openDrawer && !isSaving,
  });

  // ---------------- OPEN CREATE DRAWER ----------------
  const handleOpenCreateDrawer = () => {
    if (isSaving) return;

    setDrawerMode("create");
    setEditingNoteId(null);

    setNoteTitle("");
    setNoteText("");

    setNewNoteFiles([]);
    setEditingNoteFiles([]);

    setOpenDrawer(true);
  };

  // ---------------- OPEN EDIT DRAWER ----------------
  const handleEdit = (note) => {
    if (isSaving) return;

    setDrawerMode("edit");
    setEditingNoteId(note.id);

    setNoteTitle(note.title || "");
    setNoteText(note.text || "");

    setNewNoteFiles([]);
    setEditingNoteFiles([]);

    setOpenDrawer(true);
  };

  // ---------------- CLOSE DRAWER ----------------
  const handleCloseDrawer = () => {
    if (isSaving) return;

    setOpenDrawer(false);

    setDrawerMode("create");
    setEditingNoteId(null);

    setNoteTitle("");
    setNoteText("");

    setNewNoteFiles([]);
    setEditingNoteFiles([]);
  };

  // ---------------- CREATE NOTE ----------------
  // Creating a reviewer note is irreversible, so confirm before writing it.
  // Standard notes save straight away as before.
  const handleAddNote = async () => {
    if (!noteTitle.trim() || isSaving) return;

    if (noteTab === "reviewer") {
      confirm({
        title: "Save reviewer note?",
        description:
          "Reviewer notes are a permanent record. Once saved, this note cannot be edited or deleted - you can only add further notes.",
        onConfirm: () => saveNote("reviewer"),
      });
      return;
    }

    await saveNote("standard");
  };

  const saveNote = async (noteType) => {
    try {
      setIsSaving(true);

      const formData = new FormData();

      formData.append("account", accountId);
      formData.append("title", noteTitle.trim());
      formData.append("noteData", noteText);
      formData.append("noteType", noteType);
      formData.append(
        "createdBy",
        user?.username || user?.firstName || "Unknown"
      );

      // Add files coming from TextEditor
      newNoteFiles.forEach((file) => {
        formData.append("files", file);
      });

      await accountNoteAPI.createNote(formData);

      showToast({
        title: "Note created",
        type: "success",
      });

      handleCloseDrawerAfterSave();

      await handleFetchNotesByAccId(accountId);
    } catch (err) {
      console.error("Create note error:", err);

      showToast({
        title: "Failed to create note",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- UPDATE NOTE ----------------
  const handleUpdate = async () => {
    if (!editingNoteId || !noteTitle.trim() || isSaving) return;

    try {
      setIsSaving(true);

      await accountNoteAPI.updateNote(editingNoteId, {
        title: noteTitle.trim(),
        noteData: noteText,
      });

      showToast({
        title: "Note updated",
        type: "success",
      });

      handleCloseDrawerAfterSave();

      await handleFetchNotesByAccId(accountId);
    } catch (err) {
      console.error("Update note error:", err);

      showToast({
        title: "Failed to update note",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- CLOSE AFTER SAVE ----------------
  const handleCloseDrawerAfterSave = () => {
    setOpenDrawer(false);

    setDrawerMode("create");
    setEditingNoteId(null);

    setNoteTitle("");
    setNoteText("");

    setNewNoteFiles([]);
    setEditingNoteFiles([]);
  };

  // ---------------- SAVE / UPDATE ----------------
  const handleSaveNote = async () => {
    if (drawerMode === "edit") {
      await handleUpdate();
    } else {
      await handleAddNote();
    }
  };

  // ---------------- APPEND REVIEWER LOG ----------------
  const handleOpenLogComposer = (noteId) => {
    if (isAppendingLog) return;

    setLogComposerNoteId(noteId);
    setLogText("");
  };

  const handleCloseLogComposer = () => {
    if (isAppendingLog) return;

    setLogComposerNoteId(null);
    setLogText("");
  };

  // Adding an entry is irreversible, so it is confirmed the same way creating
  // a reviewer note is.
  const handleAppendLog = (noteId) => {
    if (!logText.trim() || isAppendingLog) return;

    confirm({
      title: "Add log entry?",
      description:
        "This entry becomes part of a permanent record. Once added it cannot be edited or removed - you can only add further entries.",
      onConfirm: async () => {
        try {
          setIsAppendingLog(true);

          await accountNoteAPI.appendReviewerLog(noteId, logText.trim());

          showToast({
            title: "Log added",
            type: "success",
          });

          setLogComposerNoteId(null);
          setLogText("");

          await handleFetchNotesByAccId(accountId);
        } catch (err) {
          console.error("Append log error:", err);

          showToast({
            title:
              err?.response?.data?.error || "Failed to add log",
            type: "error",
          });
        } finally {
          setIsAppendingLog(false);
        }
      },
    });
  };

  // ---------------- PIN ----------------
  const handleTogglePin = async (note) => {
    try {
      await accountNoteAPI.updateNote(note.id, {
        pinned: !note.pinned,
      });

      await handleFetchNotesByAccId(accountId);
    } catch (err) {
      console.error("Toggle pin error:", err);

      showToast({
        title: "Failed to update pin",
        type: "error",
      });
    }
  };

  // ---------------- ARCHIVE ----------------
  const handleArchive = async (id) => {
    try {
      await accountNoteAPI.updateNote(id, {
        active: false,
      });

      showToast({
        title: "Note archived",
        type: "success",
      });

      await handleFetchNotesByAccId(accountId);
    } catch (err) {
      console.error("Archive note error:", err);

      showToast({
        title: "Failed to archive note",
        type: "error",
      });
    }
  };

  // ---------------- UNARCHIVE ----------------
  const handleUnarchive = async (id) => {
    try {
      await accountNoteAPI.updateNote(id, {
        active: true,
      });

      showToast({
        title: "Note restored",
        type: "success",
      });

      await handleFetchNotesByAccId(accountId);
    } catch (err) {
      console.error("Restore note error:", err);

      showToast({
        title: "Failed to restore note",
        type: "error",
      });
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = (id) => {
    confirm({
      title: "Delete Note",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        try {
          await accountNoteAPI.deleteNote(id);

          showToast({
            title: "Note deleted",
            type: "success",
          });

          await handleFetchNotesByAccId(accountId);
        } catch (err) {
          console.error("Delete note error:", err);

          showToast({
            title: "Failed to delete note",
            type: "error",
          });
        }
      },
    });
  };

  const isReviewerTab = noteTab === "reviewer";

  const filtered = notes.filter(
    (n) =>
      n.noteType === noteTab &&
      (view === "active" ? !n.archived : n.archived)
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Note type tabs */}
      <div className="mb-4 flex gap-2 p-1 rounded-xl border border-border bg-muted/30 shadow-sm w-fit">
        <Button
          variant={noteTab === "standard" ? "default" : "ghost"}
          onClick={() => setNoteTab("standard")}
        >
          Notes
        </Button>

        <Button
          variant={noteTab === "reviewer" ? "default" : "ghost"}
          onClick={() => setNoteTab("reviewer")}
        >
          Reviewer Notes
        </Button>
      </div>

      {isReviewerTab && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
          <span>
            A reviewer note is a heading - "June Tax return" - with a log
            underneath it. Use + to add an entry; each one is stamped with who
            wrote it and when, and becomes a permanent record that cannot be
            edited or removed. Archiving files a note out of the active list
            without changing anything it holds.
          </span>
        </div>
      )}

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
        <Button
          onClick={handleOpenCreateDrawer}
          disabled={isSaving}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* =========================================================
          CREATE / EDIT DRAWER
      ========================================================= */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div
            className={`
              absolute inset-0
              bg-black/40
              backdrop-blur-sm
              dark:bg-black/60
              ${isSaving ? "cursor-not-allowed" : ""}
            `}
            onClick={handleCloseDrawer}
          />

          {/* Drawer */}
          <div
            className="
              absolute right-0 top-0
              flex h-full w-full flex-col
              bg-background text-foreground
              border-l border-border
              shadow-2xl
              sm:w-[650px]
            "
          >
            {/* Header */}
            <div
              className="
                flex items-center justify-between
                border-b border-border
                bg-muted/30 dark:bg-muted/10
                px-6 py-5
                shrink-0
              "
            >
              <div>
                <h2
                  className="font-semibold text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(1.05rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  {drawerMode === "edit"
                    ? "Edit Note"
                    : isReviewerTab
                      ? "Create Reviewer Note"
                      : "Create Note"}
                </h2>

                <p
                  className="mt-1 text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  {drawerMode === "edit"
                    ? "Update the title and description for this note."
                    : isReviewerTab
                      ? "The title names the work; the entry below opens its log. Both are a permanent record - further entries can be added with +, but nothing can be edited or removed."
                      : "Add a title and description for this note."}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDrawer}
                disabled={isSaving}
                className="
                  rounded-xl
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Title */}
                <div
                  className="
                    rounded-2xl
                    border border-border
                    bg-card dark:bg-card/70
                    p-5 shadow-sm
                  "
                >
                  <div className="space-y-2">
                    <Label>Title</Label>

                    <Input
                      placeholder={
                        isReviewerTab
                          ? 'Name the work, e.g. "June Tax return"...'
                          : "Enter note title..."
                      }
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      disabled={isSaving}
                      className="
                        h-11 rounded-xl
                        border-border
                        bg-background
                        shadow-sm
                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                      "
                    />
                  </div>
                </div>

                {/* Description */}
                <div
                  className="
                    rounded-2xl
                    border border-border
                    bg-card dark:bg-card/70
                    p-5 shadow-sm
                  "
                >
                  <div className="space-y-2">
                    <Label>
                      {isReviewerTab && drawerMode === "create"
                        ? "First log entry"
                        : "Description"}
                    </Label>

                    <TextEditor
                      value={noteText}
                      onChange={setNoteText}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="
                flex items-center justify-end gap-3
                border-t border-border
                bg-muted/20 dark:bg-muted/10
                px-6 py-4
                shrink-0
              "
            >
              <Button
                variant="outline"
                onClick={handleCloseDrawer}
                disabled={isSaving}
                className="rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveNote}
                disabled={!noteTitle.trim() || isSaving}
                className="rounded-xl min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                    {drawerMode === "edit"
                      ? "Updating..."
                      : "Saving..."}
                  </>
                ) : (
                  <>
                    {drawerMode === "edit"
                      ? "Update Note"
                      : "Save Note"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          NOTES LIST
      ========================================================= */}
      <div className="space-y-5">
        {/* An empty tab with no explanation reads as a broken page - say what
            belongs here and how to start one. */}
        {!isFetching && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground/80">
              {view === "archived"
                ? `No archived ${isReviewerTab ? "reviewer notes" : "notes"} yet.`
                : isReviewerTab
                  ? "No reviewer notes yet."
                  : "No notes yet."}
            </p>

            {view === "active" && (
              <p className="mt-1 text-xs text-muted-foreground">
                {isReviewerTab
                  ? 'Use New Note to name a piece of work - "June Tax return" - then add entries to its log with +.'
                  : "Use New Note to add one."}
              </p>
            )}
          </div>
        )}

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
              <div className="mt-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">
                    {note.title}
                  </h3>

                  {/* Appending is the only change a reviewer note accepts, so
                      + sits on the heading rather than among the actions. */}
                  {note.noteType === "reviewer" && view === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      title="Add a log entry"
                      disabled={isAppendingLog}
                      onClick={() =>
                        logComposerNoteId === note.id
                          ? handleCloseLogComposer()
                          : handleOpenLogComposer(note.id)
                      }
                      className="shrink-0 rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {note.noteType === "reviewer" ? (
                  <>
                    {/* The log. Oldest first, so it reads as a sequence of
                        events rather than newest-first like the note list. */}
                    <ol className="mt-4 space-y-3 border-l border-border pl-4">
                      {note.logs.map((log, index) => (
                        <li key={log.id} className="relative">
                          <span className="absolute -left-[21px] top-2 h-2 w-2 rounded-full bg-border" />

                          <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/70">
                              Log {index + 1}
                            </span>

                            <span>
                              {log.createdByEmail
                                ? `${log.createdBy} (${log.createdByEmail})`
                                : log.createdBy}
                            </span>

                            <span className="text-muted-foreground/70">
                              {log.time}
                            </span>
                          </div>

                          <div
                            className="prose prose-sm max-w-none mt-1 text-foreground/80"
                            dangerouslySetInnerHTML={{
                              __html: log.text || "No description",
                            }}
                          />
                        </li>
                      ))}
                    </ol>

                    {logComposerNoteId === note.id && (
                      <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4">
                        <Label className="text-xs">New log entry</Label>

                        <div className="mt-2">
                          <TextEditor
                            value={logText}
                            onChange={setLogText}
                            disabled={isAppendingLog}
                          />
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                          Added as you, with the current time. Permanent once
                          saved.
                        </p>

                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={handleCloseLogComposer}
                            disabled={isAppendingLog}
                          >
                            Cancel
                          </Button>

                          <Button
                            size="sm"
                            className="rounded-xl min-w-[110px]"
                            onClick={() => handleAppendLog(note.id)}
                            disabled={!logText.trim() || isAppendingLog}
                          >
                            {isAppendingLog ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              "Add log"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="prose prose-sm max-w-none mt-3 text-foreground/80"
                    dangerouslySetInnerHTML={{
                      __html: note.text || "No description",
                    }}
                  />
                )}
              </div>

              {/* FOOTER */}
              <div className="mt-5 flex items-center justify-between">
                {/* ACTIONS - a reviewer note is permanent, so it gets no
                    edit, delete, pin or archive controls. The server rejects
                    those operations too; this just keeps them off screen. */}
                <div className="flex items-center gap-1">
                  {note.noteType === "reviewer" ? (
                    // A reviewer note is permanent: never editable, never
                    // deletable. Archiving is allowed because it files the
                    // entry away without altering it, so an active one can be
                    // moved to Archived and brought back. Archived reviewer
                    // notes get Restore only - no Delete.
                    <>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" />
                        Permanent record
                      </span>

                      {view === "active" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Archive this note"
                          onClick={() => handleArchive(note.id)}
                        >
                          <Archive className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          title="Restore this note"
                          onClick={() => handleUnarchive(note.id)}
                        >
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                    </>
                  ) : view === "active" ? (
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
                  className="
                    rounded-full px-3 py-1 text-xs
                    bg-muted text-muted-foreground
                    border border-border
                  "
                >
                  {view === "active" ? "Active" : "Archived"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NoteApp;

