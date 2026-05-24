// import React, { useEffect, useState, useContext } from "react";

// import Editor from "../../components/Editor";
// import {
//   Edit,
//   Delete,
//   PushPin,
//   Archive,
//   Unarchive,
// } from "@mui/icons-material";
// import { useParams } from "react-router-dom";

// import { toast } from "react-toastify";

// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import { accountNoteAPI } from "../../services/api";
// import { Input } from "../../components/ui/input";
// import { Badge } from "../../components/ui/badge";
// import { useAuth } from "../../context/AuthContext";
// import { useConfirm } from "../../components/ConfirmDialogContext";
// const NoteApp = () => {
//   const { accountId } = useParams();
// const { user } = useAuth();
// const confirm = useConfirm();
//   const [view, setView] = useState("active");
//   const [notes, setNotes] = useState([]);
//   const [newNoteVisible, setNewNoteVisible] = useState(false);
//   const [newNoteText, setNewNoteText] = useState("");
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [editingNoteText, setEditingNoteText] = useState("");

 

// const handleFetchNotesByAccId = async (accountId) => {
//   try {
//     const response =
//       await accountNoteAPI.getNotesByAccountId(accountId);

//     const formattedNotes = response.data.notes.map((note) => ({
//       id: note._id,
//       text: note.noteData,
//       createdBy: note.createdBy,
//       time: new Date(note.createdAt).toLocaleDateString(
//         "en-US",
//         {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         }
//       ),
//       editedTime: note.updatedAt
//         ? new Date(note.updatedAt).toLocaleTimeString(
//             "en-US",
//             {
//               hour: "2-digit",
//               minute: "2-digit",
//               hour12: true,
//             }
//           )
//         : null,
//       archived: !note.active,
//       pinned: note.pinned || false,
//     }));

//     formattedNotes.sort((a, b) => {
//       if (a.pinned && !b.pinned) return -1;
//       if (!a.pinned && b.pinned) return 1;
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });

//     setNotes(formattedNotes);
//   } catch (error) {
//     console.error("Error fetching notes:", error);
//   }
// };

//   useEffect(() => {
//     handleFetchNotesByAccId(accountId);
//   }, []);

//   const handleEditorChange = (content) => {
//     setNewNoteText(content);
//   };

//   const handleAddNote = async () => {
//   const payload = {
//     account: accountId,
//     noteData: newNoteText,
//     createdBy:
//       user?.username ||
//       user?.firstName ||
//       "Unknown User",
//   };

//   try {
//     await accountNoteAPI.createNote(payload);

//     setNewNoteText("");
//     setNewNoteVisible(false);

//     toast.success("Note created successfully");

//     handleFetchNotesByAccId(accountId);
//   } catch (error) {
//     console.error("Failed to add note:", error);
//   }
// };

// const handleTogglePin = async (noteId) => {
//   try {
//     const note = notes.find((n) => n.id === noteId);

//     if (!note) return;

//     await accountNoteAPI.updateNote(noteId, {
//       pinned: !note.pinned,
//     });

//     handleFetchNotesByAccId(accountId);
//   } catch (error) {
//     console.error("Failed to toggle pin:", error);
//   }
// };

//   const handleEditNote = (noteId, noteText) => {
//     setEditingNoteId(noteId);
//     setEditingNoteText(noteText);
//   };

//   const handleUpdateNote = async () => {
//   if (!editingNoteId) return;

//   try {
//     await accountNoteAPI.updateNote(editingNoteId, {
//       noteData: editingNoteText,
//     });

//     handleFetchNotesByAccId(accountId);

//     setEditingNoteId(null);
//     setEditingNoteText("");
//   } catch (error) {
//     console.error("Failed to update note:", error);
//   }
// };

//   const handleCancelEdit = () => {
//     setEditingNoteId(null);
//     setEditingNoteText("");
//   };

//   const filteredNotes = notes.filter(
//     (note) => note.archived === (view === "archived")
//   );

// const handleArchiveNote = async (noteId) => {
//   try {
//     await accountNoteAPI.updateNote(noteId, {
//       active: false,
//     });

//     toast.success("Note archived");

//     handleFetchNotesByAccId(accountId);
//   } catch (error) {
//     console.error("Failed to archive note:", error);
//   }
// };
//   const handleUnarchiveNote = async (noteId) => {
//   try {
//     await accountNoteAPI.updateNote(noteId, {
//       active: true,
//     });

//     toast.success("Note Restored Successfully");

//     handleFetchNotesByAccId(accountId);
//   } catch (error) {
//     console.error("Failed to unarchive note:", error);
//   }
// };

//  const handleDeleteClick = (noteId) => {
//   confirm({
//     title: "Delete Note",
//     description:
//       "This action cannot be undone. Are you sure you want to delete this note?",
//     onConfirm: async () => {
//       try {
//         await accountNoteAPI.deleteNote(noteId);

//         handleFetchNotesByAccId(accountId);

//         toast.success("Note deleted successfully");
//       } catch (error) {
//         console.error("Failed to delete note:", error);
//       }
//     },
//   });
// };

 


//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Top Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-2 rounded-xl border bg-white p-1 shadow-sm">
//           <Button
//             variant={view === "active" ? "default" : "ghost"}
//             onClick={() => setView("active")}
//             className="rounded-lg"
//           >
//             Active
//           </Button>

//           <Button
//             variant={view === "archived" ? "default" : "ghost"}
//             onClick={() => setView("archived")}
//             className="rounded-lg"
//           >
//             Archived
//           </Button>
//         </div>

//         <Button
//           onClick={() => setNewNoteVisible(true)}
//           className="rounded-xl"
//         >
//           New Note
//         </Button>
//       </div>

//       {/* Create Note */}
//       {newNoteVisible && (
//         <Card className="mb-6 rounded-2xl border-0 shadow-md">
//           <CardContent className="p-5">
//             <Editor
//               onChange={handleEditorChange}
//               value={newNoteText}
//             />

//             <div className="mt-5 flex gap-3">
//               <Button
//                 onClick={handleAddNote}
//                 className="rounded-xl"
//               >
//                 Save
//               </Button>

//               <Button
//                 variant="outline"
//                 className="rounded-xl"
//                 onClick={() => setNewNoteVisible(false)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Notes */}
//       <div className="space-y-4">
//         {filteredNotes.map((note) => (
//           <Card
//             key={note.id}
//             className={`rounded-2xl border-0 shadow-sm transition-all hover:shadow-md ${
//               note.pinned
//                 ? "border-l-4 border-l-yellow-400"
//                 : ""
//             }`}
//           >
//             <CardContent className="p-5">
//               {editingNoteId === note.id ? (
//                 <>
//                   <Editor
//                     onChange={setEditingNoteText}
//                     value={editingNoteText}
//                   />

//                   <div className="mt-5 flex gap-3">
//                     <Button
//                       onClick={handleUpdateNote}
//                       className="rounded-xl"
//                     >
//                       Update
//                     </Button>

//                     <Button
//                       variant="outline"
//                       className="rounded-xl"
//                       onClick={handleCancelEdit}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* Content */}
//                   <div
//                     className="prose prose-sm max-w-none text-slate-700"
//                     dangerouslySetInnerHTML={{
//                       __html:
//                         note.text || "No content available",
//                     }}
//                   />

//                   {/* Footer */}
//                   <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
//                     <div className="flex items-center gap-2">
//                       {view === "active" ? (
//                         <>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() =>
//                               handleTogglePin(note.id)
//                             }
//                             className={`rounded-full ${
//                               note.pinned
//                                 ? "text-yellow-500"
//                                 : ""
//                             }`}
//                           >
//                             <PushPin fontSize="small" />
//                           </Button>

//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() =>
//                               handleArchiveNote(note.id)
//                             }
//                           >
//                             <Archive fontSize="small" />
//                           </Button>

//                           <Button
//                             variant="ghost"
//                             className="gap-2"
//                             onClick={() =>
//                               handleEditNote(
//                                 note.id,
//                                 note.text
//                               )
//                             }
//                           >
//                             <Edit fontSize="small" />
//                             Edit
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button
//                             variant="ghost"
//                             className="gap-2"
//                             onClick={() =>
//                               handleUnarchiveNote(note.id)
//                             }
//                           >
//                             <Unarchive fontSize="small" />
//                             Move to Active
//                           </Button>

//                           <Button
//                             variant="ghost"
//                             className="gap-2 text-red-500 hover:text-red-600"
//                             onClick={() =>
//                               handleDeleteClick(note.id)
//                             }
//                           >
//                             <Delete fontSize="small" />
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </div>

//                     <Badge
//                       variant="secondary"
//                       className="rounded-full px-3 py-1 text-xs"
//                     >
//                       {view === "active"
//                         ? `Created by ${note.createdBy} on ${note.time}`
//                         : `Archived by ${note.createdBy} on ${note.time}`}
//                     </Badge>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

    
//     </div>
//   );
// };

// export default NoteApp;


import React, { useEffect, useState } from "react";
import Editor from "../../components/Editor";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

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

  const [view, setView] = useState("active");
  const [notes, setNotes] = useState([]);

  const [newNoteVisible, setNewNoteVisible] = useState(false);
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
  const handleAddNote = async () => {
    const payload = {
      account: accountId,
      noteData: newNoteText,
      createdBy: user?.username || user?.firstName || "Unknown",
    };

    try {
      await accountNoteAPI.createNote(payload);
      toast.success("Note created");
      setNewNoteText("");
      setNewNoteVisible(false);
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
    toast.success("Archived");
    handleFetchNotesByAccId(accountId);
  };

  const handleUnarchive = async (id) => {
    await accountNoteAPI.updateNote(id, { active: true });
    toast.success("Restored");
    handleFetchNotesByAccId(accountId);
  };

  // ---------------- DELETE ----------------
  const handleDelete = (id) => {
    confirm({
      title: "Delete Note",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        await accountNoteAPI.deleteNote(id);
        toast.success("Deleted");
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

  // ---------------- UI ----------------
//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border">
//           <Button
//             variant={view === "active" ? "default" : "ghost"}
//             onClick={() => setView("active")}
//           >
//             Active
//           </Button>
//           <Button
//             variant={view === "archived" ? "default" : "ghost"}
//             onClick={() => setView("archived")}
//           >
//             Archived
//           </Button>
//         </div>

//         <Button onClick={() => setNewNoteVisible(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           New Note
//         </Button>
//       </div>

//       {/* Create Note */}
//       {newNoteVisible && (
      
//         <Card className="mb-6">
//   <CardContent className="p-4 space-y-4">
    
//     {/* IMPORTANT WRAPPER */}
//     <div className="relative z-10">
//       <Editor value={newNoteText} onChange={setNewNoteText} />
//     </div>

//     <div className="flex gap-3 mt-6 relative z-20">
//       <Button onClick={handleAddNote}>
//         Save new note
//       </Button>

//       <Button
//         variant="outline"
//         onClick={() => setNewNoteVisible(false)}
//       >
//         Cancel
//       </Button>
//     </div>

//   </CardContent>
// </Card>
//       )}

     
//       <div className="space-y-5">
//   {filtered.map((note) => (
//     <Card
//       key={note.id}
//       className={`
//         relative overflow-hidden rounded-2xl border bg-white
//         shadow-sm transition-all duration-200
//         hover:shadow-lg hover:-translate-y-[1px]
//         ${note.pinned ? "border-yellow-200" : "border-slate-200"}
//       `}
//     >
//       {/* Pinned Accent Bar */}
//       {note.pinned && (
//         <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400" />
//       )}

//       <CardContent className="p-5">
//         {editingNoteId === note.id ? (
//           <>
//             <div className="mb-3 text-sm font-medium text-slate-600">
//               Editing note...
//             </div>

//             <Editor
//               value={editingNoteText}
//               onChange={setEditingNoteText}
//             />

//             <div className="mt-4 flex gap-2">
//               <Button onClick={handleUpdate}>Update</Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setEditingNoteId(null)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* HEADER */}
//             <div className="flex items-start justify-between gap-4">
//               <div className="space-y-1">
//                 <div className="text-xs text-slate-500">
//                   {note.createdBy}
//                 </div>

//                 <div className="text-xs text-slate-400">
//                   {note.time}
//                 </div>
//               </div>

//               {note.pinned && (
//                 <span className="text-yellow-500">
//                   📌
//                 </span>
//               )}
//             </div>

//             {/* BODY */}
//             <div
//               className="prose prose-sm max-w-none text-slate-700 mt-4 line-clamp-none"
//               dangerouslySetInnerHTML={{
//                 __html: note.text || "No content",
//               }}
//             />

//             {/* FOOTER */}
//             <div className="mt-5 flex items-center justify-between">
//               {/* ACTIONS */}
//               <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition">
//                 {view === "active" ? (
//                   <>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleTogglePin(note)}
//                       className="hover:bg-yellow-50"
//                     >
//                       <Pin
//                         className={`w-4 h-4 ${
//                           note.pinned
//                             ? "text-yellow-500"
//                             : "text-slate-500"
//                         }`}
//                       />
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleArchive(note.id)}
//                     >
//                       <Archive className="w-4 h-4 text-slate-500" />
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       onClick={() => handleEdit(note)}
//                       className="text-slate-600"
//                     >
//                       <Edit3 className="w-4 h-4 mr-2" />
//                       Edit
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button
//                       variant="ghost"
//                       onClick={() => handleUnarchive(note.id)}
//                     >
//                       <ArchiveRestore className="w-4 h-4 mr-2" />
//                       Restore
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       className="text-red-500 hover:text-red-600"
//                       onClick={() => handleDelete(note.id)}
//                     >
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Delete
//                     </Button>
//                   </>
//                 )}
//               </div>

//               {/* TAG BADGE */}
//               <Badge
//                 variant="secondary"
//                 className="rounded-full px-3 py-1 text-xs bg-slate-100 text-slate-600"
//               >
//                 {view === "active" ? "Active" : "Archived"}
//               </Badge>
//             </div>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   ))}
// </div>
//     </div>
//   );
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
      <Button onClick={() => setNewNoteVisible(true)}>
        <Plus className="w-4 h-4 mr-2" />
        New Note
      </Button>
    </div>

    {/* Create Note */}
    {newNoteVisible && (
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
    )}

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
                <div
                  className="prose prose-sm max-w-none text-foreground/80 mt-4"
                  dangerouslySetInnerHTML={{
                    __html: note.text || "No content",
                  }}
                />

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