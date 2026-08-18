


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
} from "lucide-react";

import { accountNoteAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useConfirm } from "../../components/ConfirmDialogContext";
import TextEditor from "../../components/textEditor/TextEditior";

const NoteApp = () => {
  const { accountId } = useParams();
  const { user } = useAuth();
  const confirm = useConfirm();
  const { showToast } = useToastContext();

  const [view, setView] = useState("active");
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

  // ---------------- FETCH NOTES ----------------
  const handleFetchNotesByAccId = async (id) => {
    try {
      setIsFetching(true);

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
      console.error("Fetch notes error:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      handleFetchNotesByAccId(accountId);
    }
  }, [accountId]);

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
  const handleAddNote = async () => {
    if (!noteTitle.trim() || isSaving) return;

    try {
      setIsSaving(true);

      const formData = new FormData();

      formData.append("account", accountId);
      formData.append("title", noteTitle.trim());
      formData.append("noteData", noteText);
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
                  {drawerMode === "edit" ? "Edit Note" : "Create Note"}
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
                      placeholder="Enter note title..."
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
                    <Label>Description</Label>

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

