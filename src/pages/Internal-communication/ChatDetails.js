// import {
//   Box,
//   Typography,
//   Divider,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import React, { useEffect, useState, useRef } from "react";

// import Editor from "../../components/Editor";

// // ✅ AUTH
// import { useAuth } from "../../context/AuthContext";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CloseIcon from "@mui/icons-material/Close";
// import ReplyIcon from "@mui/icons-material/Reply";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// // ✅ API
// import { internalChatAPI } from "../../services/api";

// const ChatDetails = ({ chat, getsChatDetails, getsChatlist }) => {
//   const { user } = useAuth();
//   console.log("chat details", chat);
//   const loginUserId = user?._id || user?.id;
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [editContent, setEditContent] = useState("");
//   const [editorContent, setEditorContent] = useState("");
//   const [replyTo, setReplyTo] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [highlightedId, setHighlightedId] = useState(null);
//   const messageRefs = useRef({});
//   const messagesEndRef = useRef(null);
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//     @keyframes flashHighlight {
//       0% { background-color: #fff2b3; }
//       100% { background-color: transparent; }
//     }
//   `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);
//   // ================= FORMAT DATE =================
//   const formatDate = (timestamp) => {
//     const d = new Date(timestamp);
//     return d.toLocaleString();
//   };

//   // ================= SCROLL =================
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat.description]);

//   // ================= SEND MESSAGE =================
//   const updateChatDescription = async () => {
//     try {
//       if (!editorContent.trim()) return;

//       const newDescription = {
//         message: editorContent,
//         fromwhome: user?.role,
//         senderid: loginUserId,
//         isRead: false,
//         time: new Date(),
//         ...(replyTo && { replyTo: replyTo._id }),
//       };

//       await internalChatAPI.addMessageToChat(chat._id, {
//         messageData: newDescription,
//       });

//       toast.success("Message sent");

//       setEditorContent("");
//       setReplyTo(null);

//       getsChatlist();
//       getsChatDetails();
//     } catch (err) {
//       console.error(err);
//       toast.error("Send failed");
//     }
//   };

//   // ================= DELETE MESSAGE =================
//   const handleDeleteMessage = async (msg) => {
//     try {
//       await internalChatAPI.deleteMessage(chat._id, {
//         chatId: chat._id,
//         messageId: msg._id,
//       });

//       toast.success("Deleted");

//       getsChatDetails();
//       getsChatlist();
//     } catch (err) {
//       console.error(err);
//       toast.error("Delete failed");
//     }
//   };
//   // ✅ CHECK EDIT TIME (optional but recommended)
//   const canEditMessage = (time) => {
//     const msgTime = new Date(time).getTime();
//     const now = new Date().getTime();
//     return now - msgTime <= 10 * 60 * 1000; // 10 min
//   };

//   // ✅ OPEN EDIT
//   const handleEditMessage = (msg) => {
//     if (!canEditMessage(msg.time)) {
//       toast.info("Edit time expired");
//       setAnchorEl(null);
//       return;
//     }
//     setEditingMessage(msg);
//     setEditContent(msg.message);
//     setEditDialogOpen(true);
//     setAnchorEl(null);
//   };

//   // ✅ SAVE EDIT
//   const handleSaveEdit = async () => {
//     if (!editContent.trim()) return;

//     try {
//       await internalChatAPI.updateMessage(chat._id, {
//         messageId: editingMessage._id,
//         newMessage: editContent,
//       });

//       toast.success("Message updated");

//       setEditDialogOpen(false);
//       setEditingMessage(null);
//       setEditContent("");

//       getsChatDetails();
//     } catch (err) {
//       console.error(err);
//       toast.error("Update failed");
//     }
//   };
//   if (!chat) return null;

//   return (
    
//     <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//       {/* ================= HEADER ================= */}
//       <Box
//         sx={{
//           px: 2,
//           py: 1.5,
//           borderBottom: "1px solid #e0e0e0",
//           backgroundColor: "#ffffff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="subtitle1" fontWeight={600}>
//           {chat?.participants
//             ?.filter((user) => user._id !== loginUserId)
//             ?.map((user) => user.username)
//             ?.join(", ") || "Chat"}
//         </Typography>
//         {/* <IconButton onClick={() => setShowChatDetails(false)}>
//           <CloseIcon />
//         </IconButton> */}
//       </Box>

//       <Divider />

//       {/* ================= MESSAGES ================= */}
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           px: 3,
//           py: 2,
//           backgroundColor: "#f4f6f8",
//         }}
//       >
//         {chat.description?.map((msg) => {
//           const isMe =
//             msg.senderid?._id === loginUserId || msg.senderid === loginUserId;

//           const repliedMsg = chat.description.find(
//             (m) => m._id === msg.replyTo,
//           );

//           return (
//             <Box
//               key={msg._id}
//               ref={(el) => {
//                 if (msg._id) messageRefs.current[msg._id] = el;
//               }}
//               sx={{
//                 display: "flex",
//                 justifyContent: isMe ? "flex-end" : "flex-start",
//                 mb: 2,
//                 transition: "all 0.3s ease",

//                 // ✅ HIGHLIGHT EFFECT
//                 ...(highlightedId === msg._id && {
//                   backgroundColor: "#fff3cd",
//                   borderRadius: 2,
//                   px: 1,
//                   py: 0.5,
//                 }),
//               }}
//             >
//               <Box
//                 sx={{
//                   maxWidth: "70%",
//                   px: 2,
//                   py: 1.5,
//                   borderRadius: 3,
//                   backgroundColor: isMe ? "#2563eb" : "#ffffff",
//                   color: isMe ? "#fff" : "#1f2937",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
//                   position: "relative",
//                   transition: "all 0.2s ease",
//                   "&:hover .msg-actions": {
//                     opacity: 1,
//                   },
//                 }}
//               >
//                 {/* REPLY PREVIEW */}

//                 {repliedMsg && (
//                   <Box
//                     sx={{
//                       backgroundColor: isMe
//                         ? "rgba(255,255,255,0.15)"
//                         : "#eef2f7",
//                       borderLeft: "3px solid #2563eb",
//                       px: 1,
//                       py: 0.5,
//                       mb: 1,
//                       borderRadius: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="caption"
//                       fontWeight="bold"
//                       sx={{ cursor: "pointer" }}
//                       onClick={() => {
//                         const el = messageRefs.current[msg.replyTo];
//                         if (el) {
//                           el.scrollIntoView({
//                             behavior: "smooth",
//                             block: "center",
//                           });
//                           setHighlightedId(msg.replyTo);
//                           setTimeout(() => setHighlightedId(null), 2000);
//                         }
//                       }}
//                     >
//                       {repliedMsg.senderid?._id === loginUserId ||
//                       repliedMsg.senderid === loginUserId
//                         ? "You"
//                         : repliedMsg.senderid?.username || "User"}
//                     </Typography>

//                     <Typography
//                       variant="body2"
//                       sx={{ fontStyle: "italic", opacity: 0.8 }}
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           repliedMsg.message?.length > 100
//                             ? repliedMsg.message.slice(0, 100) + "..."
//                             : repliedMsg.message,
//                       }}
//                     />
//                   </Box>
//                 )}

//                 {/* HEADER */}
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   mb={0.5}
//                 >
//                   <Typography
//                     variant="caption"
//                     sx={{ opacity: 0.7, fontWeight: 500 }}
//                   >
//                     {isMe ? "You" : msg.senderid?.username}
//                   </Typography>

//                   <MoreVertIcon
//                     className="msg-actions"
//                     sx={{
//                       cursor: "pointer",
//                       fontSize: 18,
//                       opacity: 0,
//                       transition: "0.2s",
//                     }}
//                     onClick={(e) => {
//                       setAnchorEl(e.currentTarget);
//                       setSelectedMessage(msg);
//                     }}
//                   />
//                 </Box>

//                 {/* MENU */}
//                 <Menu
//                   anchorEl={anchorEl}
//                   open={Boolean(anchorEl)}
//                   onClose={() => setAnchorEl(null)}
//                   PaperProps={{
//                     sx: {
//                       borderRadius: 2,
//                       minWidth: 150,
//                       boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//                       mt: 1,
//                     },
//                   }}
//                 >
//                   {/* Reply */}
//                   <MenuItem
//                     onClick={() => {
//                       setReplyTo(selectedMessage);
//                       setAnchorEl(null);
//                     }}
//                     sx={{
//                       display: "flex",
//                       gap: 1.5,
//                       "&:hover": { backgroundColor: "#f3f4f6" },
//                     }}
//                   >
//                     <ReplyIcon fontSize="small" />
//                     Reply
//                   </MenuItem>

//                   {/* Edit */}
//                   {selectedMessage &&
//                     (selectedMessage.senderid?._id === loginUserId ||
//                       selectedMessage.senderid === loginUserId) && (
//                       <MenuItem
//                         onClick={() => {
//                           handleEditMessage(selectedMessage);
//                           setAnchorEl(null);
//                         }}
//                         sx={{
//                           display: "flex",
//                           gap: 1.5,
//                           "&:hover": { backgroundColor: "#f3f4f6" },
//                         }}
//                       >
//                         <EditIcon fontSize="small" />
//                         Edit
//                       </MenuItem>
//                     )}

//                   {/* Delete */}
//                   {selectedMessage &&
//                     (selectedMessage.senderid?._id === loginUserId ||
//                       selectedMessage.senderid === loginUserId) && (
//                       <MenuItem
//                         onClick={() => {
//                           handleDeleteMessage(selectedMessage);
//                           setAnchorEl(null);
//                         }}
//                         sx={{
//                           display: "flex",
//                           gap: 1.5,
//                           color: "#dc2626",
//                           "&:hover": { backgroundColor: "#fee2e2" },
//                         }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                         Delete
//                       </MenuItem>
//                     )}
//                 </Menu>

//                 {/* MESSAGE */}
//                 <Typography
//                   variant="body2"
//                   sx={{ wordBreak: "break-word", mb: 0.5 }}
//                   dangerouslySetInnerHTML={{
//                     __html: msg.message,
//                   }}
//                 />

//                 {/* TIME */}
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     opacity: 0.5,
//                     fontSize: "11px",
//                     display: "block",
//                     textAlign: "right",
//                   }}
//                 >
//                   {formatDate(msg.time)}
//                 </Typography>
//               </Box>
//             </Box>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </Box>

//       {/* ================= REPLY PREVIEW ================= */}

//       {replyTo && (
//         <Box
//           sx={{
//             mx: 2,
//             mb: 1,
//             p: 1.5,
//             backgroundColor: "#eef4ff",
//             borderLeft: "4px solid #2563eb",
//             borderRadius: 2,
//             position: "relative",
//           }}
//         >
//           <Typography variant="caption" fontWeight="bold">
//             Replying to{" "}
//             {replyTo.senderid?._id === loginUserId ||
//             replyTo.senderid === loginUserId
//               ? "You"
//               : replyTo.senderid?.username || "User"}
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{ fontStyle: "italic", pr: 4 }}
//             dangerouslySetInnerHTML={{
//               __html:
//                 replyTo.message?.length > 100
//                   ? replyTo.message.slice(0, 100) + "..."
//                   : replyTo.message,
//             }}
//           />

//           <IconButton
//             size="small"
//             onClick={() => setReplyTo(null)}
//             sx={{ position: "absolute", right: 5, top: 5 }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       )}

//       {/* ================= INPUT ================= */}
//       <Box
//         sx={{
//           p: 2,
//           borderTop: "1px solid #e5e7eb",
//           backgroundColor: "#ffffff",
//           display: "flex",
//           gap: 2,
//           alignItems: "flex-end",
//         }}
//       >
//         <Box sx={{ flex: 1 }}>
//           <Editor value={editorContent} onChange={setEditorContent} />
//         </Box>

//         <Button
//           variant="contained"
//           onClick={updateChatDescription}
//           sx={{
//             height: "42px",
//             textTransform: "none",
//             borderRadius: 2,
//             backgroundColor: "#2563eb",
//             "&:hover": { backgroundColor: "#1d4ed8" },
//           }}
//         >
//           Send
//         </Button>
//       </Box>

//       {/* ================= EDIT DIALOG ================= */}
//       <Dialog
//         open={editDialogOpen}
//         onClose={() => setEditDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Edit Message</DialogTitle>

//         <DialogContent>
//           <Box sx={{ mt: 2 }}>
//             <Editor value={editContent} onChange={setEditContent} />
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleSaveEdit} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ChatDetails;


import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { 
  MoreVertical, 
  X, 
  CornerUpLeft, 
  Pencil, 
  Trash2, 
  SendHorizontal 
} from "lucide-react";

import Editor from "../../components/Editor";

// ✅ AUTH
import { useAuth } from "../../context/AuthContext";
// ✅ API
import { internalChatAPI } from "../../services/api";

const ChatDetails = ({ chat, getsChatDetails, getsChatlist }) => {
  const { user } = useAuth();
  console.log("chat details", chat);
  const loginUserId = user?._id || user?.id;
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  
  const messageRefs = useRef({});
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes flashHighlight {
        0% { background-color: rgb(254 240 138 / 0.6); }
        100% { background-color: transparent; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ================= FORMAT DATE =================
  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  };

  // ================= SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.description]);

  // ================= SEND MESSAGE =================
  const updateChatDescription = async () => {
    try {
      if (!editorContent.trim()) return;

      const newDescription = {
        message: editorContent,
        fromwhome: user?.role,
        senderid: loginUserId,
        isRead: false,
        time: new Date(),
        ...(replyTo && { replyTo: replyTo._id }),
      };

      await internalChatAPI.addMessageToChat(chat._id, {
        messageData: newDescription,
      });

      toast.success("Message sent");

      setEditorContent("");
      setReplyTo(null);

      getsChatlist();
      getsChatDetails();
    } catch (err) {
      console.error(err);
      toast.error("Send failed");
    }
  };

  // ================= DELETE MESSAGE =================
  const handleDeleteMessage = async (msg) => {
    try {
      await internalChatAPI.deleteMessage(chat._id, {
        chatId: chat._id,
        messageId: msg._id,
      });

      toast.success("Deleted");
      setMenuOpenId(null);
      getsChatDetails();
      getsChatlist();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ✅ CHECK EDIT TIME
  const canEditMessage = (time) => {
    const msgTime = new Date(time).getTime();
    const now = new Date().getTime();
    return now - msgTime <= 10 * 60 * 1000; // 10 min
  };

  // ✅ OPEN EDIT
  const handleEditMessage = (msg) => {
    if (!canEditMessage(msg.time)) {
      toast.info("Edit time expired");
      setMenuOpenId(null);
      return;
    }
    setEditingMessage(msg);
    setEditContent(msg.message);
    setEditDialogOpen(true);
    setMenuOpenId(null);
  };

  // ✅ SAVE EDIT
  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      await internalChatAPI.updateMessage(chat._id, {
        messageId: editingMessage._id,
        newMessage: editContent,
      });

      toast.success("Message updated");

      setEditDialogOpen(false);
      setEditingMessage(null);
      setEditContent("");

      getsChatDetails();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!chat) return null;

  return (
    <div className="flex flex-col h-full bg-background font-sans antialiased text-slate-900 dark:text-slate-50">
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-10">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            {chat?.participants
              ?.filter((u) => u._id !== loginUserId)
              ?.map((u) => u.username)
              ?.join(", ") || "Chat"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {chat?.description?.length || 0} messages
          </p>
        </div>
      </header>

      {/* ================= MESSAGES ================= */}
      <main className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50 dark:bg-slate-900/50 space-y-4">
        {chat.description?.map((msg) => {
          const isMe = msg.senderid?._id === loginUserId || msg.senderid === loginUserId;
          const repliedMsg = chat.description.find((m) => m._id === msg.replyTo);
          const isMenuOpen = menuOpenId === msg._id;

          return (
            <div
              key={msg._id}
              ref={(el) => {
                if (msg._id) messageRefs.current[msg._id] = el;
              }}
              className={`flex w-full group ${isMe ? "justify-end" : "justify-start"} transition-colors duration-300`}
              style={highlightedId === msg._id ? { animation: "flashHighlight 2s ease-out" } : {}}
            >
              <div className={`relative flex flex-col max-w-[70%] space-y-1`}>
                
                {/* REPLY PREVIEW ATTACHED TO MSG */}
                {repliedMsg && (
                  <div 
                    onClick={() => {
                      const el = messageRefs.current[msg.replyTo];
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                        setHighlightedId(msg.replyTo);
                        setTimeout(() => setHighlightedId(null), 2000);
                      }
                    }}
                    className={`text-xs p-2 rounded-t-lg border-l-2 cursor-pointer transition-opacity hover:opacity-80 mix-blend-multiply dark:mix-blend-normal ${
                      isMe 
                        ? "bg-blue-600/20 text-blue-200 border-blue-400" 
                        : "bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-400"
                    }`}
                  >
                    <p className="font-semibold text-[11px] mb-0.5">
                      {repliedMsg.senderid?._id === loginUserId || repliedMsg.senderid === loginUserId
                        ? "You"
                        : repliedMsg.senderid?.username || "User"}
                    </p>
                    <div 
                      className="line-clamp-1 italic"
                      dangerouslySetInnerHTML={{
                        __html: repliedMsg.message
                      }}
                    />
                  </div>
                )}

                {/* MESSAGE BOX */}
                <div
                  className={`px-4 py-2.5 shadow-sm relative ${
                    repliedMsg ? "rounded-b-xl" : "rounded-xl"
                  } ${
                    isMe
                      ? "bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900"
                      : "bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {/* SENDER LABEL & CONTEXT ACTION */}
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-[11px] font-medium opacity-70">
                      {isMe ? "You" : msg.senderid?.username}
                    </span>
                    
                    {/* MORE ACTION ICON - Visible on row hover or open menu */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessage(msg);
                        setMenuOpenId(isMenuOpen ? null : msg._id);
                      }}
                      className={`rounded p-0.5 transition-opacity duration-200 focus:outline-none hover:bg-slate-500/10 ${
                        isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* HTML MESSAGE CONTENT */}
                  <div
                    className="text-sm break-words leading-relaxed ProseMirror"
                    dangerouslySetInnerHTML={{ __html: msg.message }}
                  />

                  {/* TIME DISP */}
                  <span className="text-[10px] opacity-50 block text-right mt-1 font-mono">
                    {formatDate(msg.time)}
                  </span>

                  {/* SHADCN-STYLE DROPDOWN MENU */}
                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-7 mt-1 w-36 rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 z-20 animate-in fade-in slide-in-from-top-1"
                    >
                      <button
                        onClick={() => {
                          setReplyTo(selectedMessage);
                          setMenuOpenId(null);
                        }}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <CornerUpLeft className="h-3.5 w-3.5" /> Reply
                      </button>
                      
                      {selectedMessage && (selectedMessage.senderid?._id === loginUserId || selectedMessage.senderid === loginUserId) && (
                        <>
                          <button
                            onClick={() => handleEditMessage(selectedMessage)}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(selectedMessage)}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-left"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* ================= GLOBAL REPLY PREVIEW STICKY BOX ================= */}
      {replyTo && (
        <div className="mx-6 my-2 p-3 bg-slate-100 dark:bg-slate-800/60 border-l-4 border-slate-900 dark:border-slate-400 rounded-r-lg flex items-start justify-between gap-4 animate-in slide-in-from-bottom-2">
          <div className="text-xs overflow-hidden">
            <span className="font-semibold block text-slate-500 dark:text-slate-400 mb-0.5">
              Replying to{" "}
              {replyTo.senderid?._id === loginUserId || replyTo.senderid === loginUserId
                ? "You"
                : replyTo.senderid?.username || "User"}
            </span>
            <div
              className="italic opacity-80 line-clamp-2 text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: replyTo.message }}
            />
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ================= INPUT FOOTER CONTAINER ================= */}
      <footer className="p-4 border-top border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-3 items-end">
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-slate-700 overflow-hidden">
          <Editor value={editorContent} onChange={setEditorContent} />
        </div>
        <button
          onClick={updateChatDescription}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 gap-2 shrink-0"
        >
          <span>Send</span>
          <SendHorizontal className="h-4 w-4" />
        </button>
      </footer>

      {/* ================= EDIT MODAL / DIALOG ================= */}
      {editDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-lg space-y-4 dark:border-slate-800 dark:bg-slate-950 zoom-in-95 animate-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Edit Message</h3>
              <button 
                onClick={() => setEditDialogOpen(false)}
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="py-2 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
              <Editor value={editContent} onChange={setEditContent} />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditDialogOpen(false)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 h-9 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-9 px-4 py-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDetails;