// import {
//   Box,
//   Typography,
//   Divider,
//   Grid,
//   Checkbox,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
//   List,
//   ListItem,
//   ListItemText,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import React, { useEffect, useState, useRef, useContext } from "react";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CloseIcon from "@mui/icons-material/Close";
// // import EditIcon from "@mui/icons-material/Edit";
// import Editor from "../../../components/Editor";
// import { useAuth } from "../../../context/AuthContext";
// import { chatAPI } from "../../../services/api";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";

// const ChatDetails = ({
//   chat,
//   getsChatDetails,
//   accountwiseChatlist,
//   onChatAction,
//   data,
//   isActiveTrue,
//   accountName,
// }) => {
//   console.log("chat details", chat);
//   const [showTasks, setShowTasks] = useState(false);
//   const [chatId, setChatId] = useState(chat._id);
//   const [chatTemplate, setChatTemplate] = useState(chat.chattemplateid);
//   const { user, isAuthenticated } = useAuth();
//   const [loginUserId, setLoginUserId] = useState();
//   const messageRefs = useRef({});
//   const [highlightedId, setHighlightedId] = useState(null);
//   const [replyTo, setReplyTo] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [editorContent, setEditorContent] = useState("");
//   const [tasks, setTasks] = useState([]);
//   const [chatanchorEl, setChatAnchorEl] = useState(null);
  
//   // Edit state
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [editContent, setEditContent] = useState("");

//   const [senderEmail, setSenderEmail] = useState("");
//   const [senderName, setSenderName] = useState("");

//   const handleChatMenuClose = () => {
//     setChatAnchorEl(null);
//   };

//   useEffect(() => {
//     if (user?.id) {
//       const id = user.id;
//       setLoginUserId(id);
//       setSenderEmail(user.email);
//       setSenderName(user?.group?.name ||user.username || user.name);
//     }
//     if (chat.clienttasks) {
//       setTasks(chat.clienttasks.flat());
//     }
//   }, [user, chat.clienttasks]);

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "short" });
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chat.description]);

//   const handleMenuClick = (event, message) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedMessage(message);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedMessage(null);
//   };

//   const handleEditorChange = (content) => {
//     setEditorContent(content);
//   };

//   const toggleTasks = () => {
//     setShowTasks(!showTasks);
//   };

//   // Check if message is within 10 minutes
//   const canEditMessage = (messageTime) => {
//     if (!messageTime) return false;
    
//     const messageTimestamp = new Date(messageTime).getTime();
//     const currentTime = new Date().getTime();
//     const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    
//     return (currentTime - messageTimestamp) <= tenMinutes;
//   };

//   // Check if message has any available menu options
//   const hasMenuOptions = (message) => {
//     // All messages have at least the Reply option
//     return true;
//   };

//   const updateChatDescription = async (message = "") => {
//     const contentToSend = message.trim() || editorContent.trim();
//     if (!contentToSend) return;

//     const newDescription = {
//       message: contentToSend,
//       fromwhome: "Admin",
//       senderid: senderName,
//     };

//     if (replyTo) {
//       newDescription.replyTo = replyTo._id;
//     }

//     try {
//       await chatAPI.updateChatDescription(chatId, {
//         newDescriptions: [newDescription]
//       });
      
//       setEditorContent("");
//       setReplyTo(null);
//       toast.success("Message sent");

//       await securemessagechatsend(chatId);
//       await updatechatStatus(chatId);
//       accountwiseChatlist(data, isActiveTrue);
//       getsChatDetails();
//     } catch (error) {
//       console.error("Send failed:", error);
//       toast.error("Send failed");
//     }
//   };

//   // Edit message function
//   const handleEditMessage = (message) => {
//     if (!canEditMessage(message.time)) {
//       toast.error("Cannot edit message after 10 minutes");
//       return;
//     }
    
//     setEditingMessage(message);
//     setEditContent(message.message);
//     setEditDialogOpen(true);
//     setAnchorEl(null);
//   };

//   const handleSaveEdit = async () => {
//     if (!editContent.trim() || !editingMessage) return;

//     try {
//       await chatAPI.updateMessage({
//         chatId: chatId,
//         messageId: editingMessage._id,
//         newMessage: editContent,
//       });

//       toast.success("Message updated successfully");
//       setEditDialogOpen(false);
//       setEditingMessage(null);
//       setEditContent("");
      
//       getsChatDetails();
//       accountwiseChatlist(data, isActiveTrue);
//     } catch (error) {
//       console.error("Error updating message:", error);
//       toast.error("Failed to update message");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditDialogOpen(false);
//     setEditingMessage(null);
//     setEditContent("");
//   };

//   const securemessagechatsend = async (chatId) => {
//   try {
//     const payload = {
//       accountid: data,
//       chattemplateid: chatTemplate,
//       username: senderName,
//       viewchatlink: "/login",
//       chatId: chatId,
//     };

//     const response = await sendSecureMessage(payload);

//     console.log(response.data); // axios style response
//   } catch (error) {
//     console.error("Secure message error:", error?.response?.data || error.message);
//   }
// };

//   const updatechatStatus = async (chatId) => {
//     try {
//       await chatAPI.updateChat(chatId, { chatstatus: false });
//       console.log("Status updated");
//     } catch (error) {
//       console.error("Error updating chat status:", error);
//     }
//   };

//   const handleTaskToggle = (id) => {
//     setTasks((prevTasks) => {
//       const updated = prevTasks.map((task) =>
//         task.id === id ? { ...task, checked: !task.checked } : task
//       );

//       updateClientTask(updated);
//       return updated;
//     });
//   };

//   const updateClientTask = async (updatedTasks) => {
//     try {
//       await chatAPI.updateTaskCheckedStatus({
//         chatId: chat._id,
//         taskUpdates: updatedTasks.map((task) => ({
//           id: task.id,
//           text: task.text,
//           checked: task.checked,
//         })),
//       });
      
//       toast.success("Task updated");
//       getsChatDetails();
//       accountwiseChatlist(data, isActiveTrue);
//     } catch (error) {
//       console.error(error);
//       toast.error("Task update failed");
//     }
//   };

//   const handleAddTask = () => {
//     const maxId =
//       tasks.length > 0 ? Math.max(...tasks.map((task) => Number(task.id))) : 0;

//     const newTaskItem = {
//       id: maxId + 1,
//       text: "",
//       checked: false,
//     };

//     setTasks([...tasks, newTaskItem]);
//   };

//   const handleDeleteTask = (id) => {
//     const updated = tasks.filter((task) => task.id !== id);
//     setTasks(updated);
//   };

//   const handleTaskTextChange = (id, newText) => {
//     const updated = tasks.map((task) =>
//       task.id === id ? { ...task, text: newText } : task
//     );
//     setTasks(updated);
//   };

//   const resendClientTask = async () => {
//     try {
//       await chatAPI.addClientTask({
//         chatId: chatId,
//         newTask: tasks,
//       });

//       const taskMessages = tasks
//         .filter((task) => !task.checked)
//         .map((task) => `• ${task.text}`)
//         .join("\n");

//       const description = `${taskMessages}`;
//       await updateAdminChatDescription(description);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const updateAdminChatDescription = async (description) => {
//     if (!description.trim()) return;
    
//     const newDescription = {
//       message: description,
//       fromwhome: "Admin",
//       senderid: senderName,
//     };

//     try {
//       await chatAPI.updateChatDescription(chatId, {
//         newDescriptions: [newDescription]
//       });
      
//       toast.success("Chat description updated successfully");
//       getsChatDetails();
//       await updatechatStatus(chatId);
//       accountwiseChatlist(data, isActiveTrue);
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to update chat description. Please try again.");
//     }
//   };

//   const handleDeleteMessage = async (messageToDelete) => {
//     try {
//       await chatAPI.deleteMessage({
//         chatId: chatId,
//         messageId: messageToDelete._id,
//       });

//       toast.success("Message deleted successfully");
//       getsChatDetails();
//       accountwiseChatlist(data, isActiveTrue);
//     } catch (error) {
//       console.error("Error deleting message:", error);
//       toast.error("Failed to delete message");
//     }
//   };

//   const handleArchiveThread = async (chatId) => {
//     try {
//       await chatAPI.updateChat(chatId, { active: !chat.active });
//       toast.success(chat.active ? "Chat archived successfully" : "Chat activated successfully");
//       accountwiseChatlist(data, isActiveTrue);
//       onChatAction();
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while submitting the form");
//     }
//     handleChatMenuClose();
//   };

//   const handleDeleteThread = async () => {
//     try {
//       await chatAPI.deleteChat(chatId);
//       onChatAction();
//       toast.success("Thread deleted successfully");
//       accountwiseChatlist(data, isActiveTrue);
//     } catch (error) {
//       console.error("Error deleting thread:", error);
//       toast.error("Failed to delete thread");
//     }
//   };

//   if (!chat) return null;

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Edit Dialog */}
//       <Dialog
//         open={editDialogOpen}
//         onClose={handleCancelEdit}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Edit Message</DialogTitle>
//         <DialogContent>
//           <Box sx={{ mt: 2, minHeight: 200 }}>
//             <Editor 
//               onChange={setEditContent} 
//               value={editContent} 
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelEdit}>Cancel</Button>
//           <Button 
//             onClick={handleSaveEdit} 
//             variant="contained"
//             disabled={!editContent.trim()}
//           >
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Main Chat Area */}
//       <Box sx={{ flex: 1, overflow: "hidden", pr: showTasks ? 2 : 0 }}>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box>

             
//             <Typography variant="h6" gutterBottom>
//               {chat.accountid?.accountName || accountName}
//             </Typography>
//             <Typography variant="subtitle2" gutterBottom>
//               {chat.chatsubject}
//             </Typography>
//           </Box>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             {tasks.length > 0 ? (
//               <Typography
//                 variant="subtitle2"
//                 fontWeight={600}
//                 sx={{ cursor: "pointer" }}
//                 onClick={toggleTasks}
//               >
//                 Client Tasks:{" "}
//                 {`${tasks.filter((task) => task.checked).length}/${tasks.length}`}
//               </Typography>
//             ) : (
//               <Typography
//                 variant="subtitle2"
//                 fontWeight={600}
//                 sx={{ cursor: "pointer", color: "primary.main" }}
//                 onClick={toggleTasks}
//               >
//                 + Add Client Task
//               </Typography>
//             )}

//             <IconButton
//               sx={{ cursor: "pointer" }}
//               onClick={(e) => setChatAnchorEl(e.currentTarget)}
//             >
//               <MoreVertIcon />
//             </IconButton>
//             <Menu
//               anchorEl={chatanchorEl}
//               open={Boolean(chatanchorEl)}
//               onClose={handleChatMenuClose}
//             >
//               <MenuItem
//                 onClick={() => {
//                   handleArchiveThread(chatId);
//                 }}
//               >
//                 {chat.active ? "Archive Thread" : "Activate Thread"}
//               </MenuItem>
//               <MenuItem
//                 onClick={() => {
//                   handleDeleteThread();
//                   handleChatMenuClose();
//                 }}
//               >
//                 Delete
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 1 }} />

//         <Box height={"40vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
//           {Array.isArray(chat.description) &&
//             chat.description.length > 0 &&
//             chat.description.map((desc, index) => (
//               <MessageItem
//                 key={desc._id || index}
//                 desc={desc}
//                 chat={chat}
//                 messageRefs={messageRefs}
//                 highlightedId={highlightedId}
//                 setHighlightedId={setHighlightedId}
//                 handleMenuClick={handleMenuClick}
//                 anchorEl={anchorEl}
//                 setAnchorEl={setAnchorEl}
//                 selectedMessage={selectedMessage}
//                 setReplyTo={setReplyTo}
//                 formatDate={formatDate}
//                 loginUserId={loginUserId}
//                 handleDeleteMessage={handleDeleteMessage}
//                 handleEditMessage={handleEditMessage}
//                 canEditMessage={canEditMessage}
//                 hasMenuOptions={hasMenuOptions}
//               />
//             ))}
//         </Box>

//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "1fr auto",
//             gap: 2,
//             alignItems: "start",
//             height: "35vh",
//             overflowY: "auto",
//           }}
//         >
//           {replyTo && (
//             <ReplyPreview replyTo={replyTo} setReplyTo={setReplyTo} />
//           )}
//           <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
//             <Editor onChange={handleEditorChange} value={editorContent} />
//             <Button
//               onClick={() => updateChatDescription()}
//               variant="contained"
//               sx={{ height: "fit-content", alignSelf: "end" }}
//             >
//               Send
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* Tasks Panel */}
//       {showTasks && (
//         <Box
//           sx={{
//             width: 300,
//             borderLeft: "1px solid #e0e0e0",
//             pl: 2,
//             pr: 1,
//             overflowY: "auto",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               pt: 2,
//               pb: 1,
//             }}
//           >
//             <Typography variant="h6">Client Tasks</Typography>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <IconButton onClick={handleAddTask} color="primary">
//                 <AddIcon />
//               </IconButton>
//               <IconButton onClick={toggleTasks} color="primary">
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//           </Box>

//           <List>
//             {tasks.map((task) => (
//               <ListItem
//                 key={task.id}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   px: 0,
//                 }}
//               >
//                 <Checkbox
//                   checked={task.checked}
//                   onChange={() => handleTaskToggle(task.id)}
//                 />
//                 <TextField
//                   value={task.text}
//                   onChange={(e) =>
//                     handleTaskTextChange(task.id, e.target.value)
//                   }
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   sx={{
//                     mr: 1,
//                     textDecoration: task.checked ? "line-through" : "none",
//                     input: {
//                       color: task.checked ? "#777" : "inherit",
//                     },
//                   }}
//                 />
//                 <IconButton
//                   onClick={() => handleDeleteTask(task.id)}
//                   color="error"
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </ListItem>
//             ))}
//           </List>
//           <Button variant="outlined" sx={{ mt: 2 }} onClick={resendClientTask}>
//             Resend Client Task
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// const MessageItem = ({
//   desc,
//   chat,
//   messageRefs,
//   highlightedId,
//   setHighlightedId,
//   handleMenuClick,
//   anchorEl,
//   setAnchorEl,
//   selectedMessage,
//   setReplyTo,
//   formatDate,
//   loginUserId,
//   handleDeleteMessage,
//   handleEditMessage,
//   canEditMessage,
//   hasMenuOptions,
// }) => {
//   const isClient = desc.fromwhome?.toLowerCase() === "client";
//   const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
//   const messageTime = desc.time ? formatDate(desc.time) : "Just now";
  
//   // Check if message can be edited (only admin messages within 10 minutes)
//   const isEditable = isAdmin && canEditMessage(desc.time);
  
//   // Check if message has any menu options (all messages have Reply option)
//   const showMenuIcon = true;

//   let senderDisplayName = "";
//   if (isClient && desc.senderid) {
//     senderDisplayName = desc.senderid;
//   } else if (isAdmin && desc.senderid) {
//     // senderDisplayName = "You";
//     senderDisplayName = desc.senderid;
//   }

//   return (
//     <Box
//       ref={(el) => {
//         if (desc._id) {
//           messageRefs.current[desc._id] = el;
//         }
//       }}
//       sx={{
//         display: "flex",
//         justifyContent: isClient ? "flex-start" : "flex-end",
//         mb: 2,
//         position: "relative",
//       }}
//     >
//       <Box
//         sx={{
//           maxWidth: "75%",
//           backgroundColor:
//             desc._id === highlightedId
//               ? "#fff2b3"
//               : isAdmin
//                 ? "#ffe6e6"
//                 : "#e6f0ff",
//           p: 2,
//           borderRadius: 2,
//           borderTopLeftRadius: isClient ? 16 : 4,
//           borderTopRightRadius: isClient ? 4 : 16,
//           boxShadow: 1,
//           position: "relative",
//         }}
//       >
//         {desc.replyTo && (
//           <ReplyPreviewItem
//             desc={desc}
//             chat={chat}
//             messageRefs={messageRefs}
//             setHighlightedId={setHighlightedId}
//           />
//         )}

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             color: "#333",
//           }}
//         >
//           <Typography
//             variant="subtitle2"
//             component="p"
//             gutterBottom
//             sx={{ fontWeight: "600" }}
//           >
//             {senderDisplayName}
//           </Typography>

//           {showMenuIcon && (
//             <MoreVertIcon
//               fontSize="small"
//               sx={{ cursor: "pointer" }}
//               onClick={(e) => handleMenuClick(e, desc)}
//             />
//           )}
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={() => setAnchorEl(null)}
//             PaperProps={{
//               elevation: 1,
//               sx: {
//                 boxShadow: "none",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               },
//             }}
//           >
//             {/* Reply option is always available for all messages */}
//             <MenuItem
//               onClick={() => {
//                 setReplyTo(selectedMessage);
//                 setAnchorEl(null);
//               }}
//             >
//               Reply
//             </MenuItem>
            
//             {/* Edit and Delete options - only for admin messages */}
//             {selectedMessage?.fromwhome?.toLowerCase() === "admin" && (
//               <>
//                 {/* Edit option - only if within 10 minutes */}
//                 {canEditMessage(selectedMessage.time) && (
//                   <MenuItem
//                     onClick={() => handleEditMessage(selectedMessage)}
//                   >
//                     Edit
//                   </MenuItem>
//                 )}
//                 {/* Delete option - always available for admin */}
//                 <MenuItem
//                   onClick={() => {
//                     handleDeleteMessage(selectedMessage);
//                     setAnchorEl(null);
//                   }}
//                 >
//                   Delete
//                 </MenuItem>
//               </>
//             )}
//           </Menu>
//         </Box>

//         <Typography
//           variant="body2"
//           sx={{ whiteSpace: "pre-wrap", color: "#333" }}
//           dangerouslySetInnerHTML={{
//             __html:
//               typeof desc.message === "string"
//                 ? desc.message
//                 : "No message available",
//           }}
//         />
//         <Typography
//           variant="caption"
//           sx={{
//             display: "block",
//             textAlign: "right",
//             color: "gray",
//             mt: 1,
//           }}
//         >
//           {messageTime}
//           {isAdmin && !isEditable && desc.time && (
//             <Typography
//               component="span"
//               variant="caption"
//               sx={{
//                 display: "block",
//                 fontStyle: "italic",
//                 color: "#888",
//                 mt: 0.5,
//               }}
//             >
//               (Edit expired)
//             </Typography>
//           )}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// const ReplyPreviewItem = ({ desc, chat, messageRefs, setHighlightedId }) => {
//   const repliedMsg = chat.description.find((msg) => msg._id === desc.replyTo);
//   if (!repliedMsg) return null;

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#f5f5f5",
//         borderLeft: "3px solid #1976d2",
//         px: 1,
//         py: 0.5,
//         mb: 1,
//       }}
//     >
//       <Typography
//         variant="caption"
//         fontWeight="bold"
//         sx={{ cursor: "pointer", color: "#1976d2" }}
//         onClick={() => {
//           const el = messageRefs.current[desc.replyTo];
//           if (el) {
//             el.scrollIntoView({
//               behavior: "smooth",
//               block: "center",
//             });
//             setHighlightedId(desc.replyTo);
//             setTimeout(() => setHighlightedId(null), 2000);
//           }
//         }}
//       >
//         {repliedMsg.fromwhome === "client"
//           ? repliedMsg.senderid?.username
//           : "You"}
//       </Typography>

//       <Typography
//         variant="body2"
//         sx={{ fontStyle: "italic", color: "#555" }}
//         dangerouslySetInnerHTML={{
//           __html:
//             repliedMsg.message?.length > 100
//               ? repliedMsg.message.slice(0, 100) + "..."
//               : repliedMsg.message,
//         }}
//       />
//     </Box>
//   );
// };

// const ReplyPreview = ({ replyTo, setReplyTo }) => (
//   <Box
//     sx={{
//       gridColumn: "1 / -1",
//       mb: 1,
//       p: 1.5,
//       backgroundColor: "#f4f6f8",
//       borderLeft: "4px solid #1976d2",
//       borderRadius: 1,
//       position: "relative",
//     }}
//   >
//     <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
//       Replying to:{" "}
//       {replyTo.fromwhome === "client"
//         ? replyTo.senderid?.username
//         : "You" || "Admin"}
//     </Typography>

//     <Typography
//       variant="body2"
//       sx={{ fontStyle: "italic", whiteSpace: "pre-wrap", pr: 4 }}
//       dangerouslySetInnerHTML={{
//         __html:
//           replyTo.message?.length > 100
//             ? `${replyTo.message.slice(0, 100)}...`
//             : replyTo.message,
//       }}
//     />

//     <IconButton
//       size="small"
//       onClick={() => setReplyTo(null)}
//       sx={{
//         position: "absolute",
//         top: 6,
//         right: 6,
//         color: "#777",
//         "&:hover": { color: "#000" },
//       }}
//     >
//       <CloseIcon fontSize="small" />
//     </IconButton>
//   </Box>
// );

// export default ChatDetails;

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { 
  MoreVertical, 
  X, 
  Plus, 
  Trash2, 
  CornerUpLeft, 
  Check 
} from "lucide-react";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";

// Your Custom Components/Context
import Editor from "../../../components/Editor";
import { useAuth } from "../../../context/AuthContext";
import { chatAPI } from "../../../services/api";

const ChatDetails = ({
  chat,
  getsChatDetails,
  accountwiseChatlist,
  onChatAction,
  data,
  isActiveTrue,
  accountName,
}) => {
  const [showTasks, setShowTasks] = useState(false);
  const [chatId, setChatId] = useState(chat._id);
  const [chatTemplate, setChatTemplate] = useState(chat.chattemplateid);
  const { user } = useAuth();
  const [loginUserId, setLoginUserId] = useState();
  const messageRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [tasks, setTasks] = useState([]);
  
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    if (user?.id) {
      setLoginUserId(user.id);
      setSenderEmail(user.email);
      setSenderName(user?.group?.name || user.username || user.name);
    }
    if (chat.clienttasks) {
      setTasks(chat.clienttasks.flat());
    }
  }, [user, chat.clienttasks]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.description]);

  const handleEditorChange = (content) => setEditorContent(content);
  const toggleTasks = () => setShowTasks(!showTasks);

  const canEditMessage = (messageTime) => {
    if (!messageTime) return false;
    const messageTimestamp = new Date(messageTime).getTime();
    const currentTime = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000;
    return (currentTime - messageTimestamp) <= tenMinutes;
  };

  const updateChatDescription = async (message = "") => {
    const contentToSend = message.trim() || editorContent.trim();
    if (!contentToSend) return;

    const newDescription = {
      message: contentToSend,
      fromwhome: "Admin",
      senderid: senderName,
    };

    if (replyTo) newDescription.replyTo = replyTo._id;

    try {
      await chatAPI.updateChatDescription(chatId, { newDescriptions: [newDescription] });
      setEditorContent("");
      setReplyTo(null);
      toast.success("Message sent");
      await securemessagechatsend(chatId);
      await updatechatStatus(chatId);
      accountwiseChatlist(data, isActiveTrue);
      getsChatDetails();
    } catch (error) {
      toast.error("Send failed");
    }
  };

  const handleEditMessage = (message) => {
    if (!canEditMessage(message.time)) {
      toast.error("Cannot edit message after 10 minutes");
      return;
    }
    setEditingMessage(message);
    setEditContent(message.message);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !editingMessage) return;
    try {
      await chatAPI.updateMessage({
        chatId: chatId,
        messageId: editingMessage._id,
        newMessage: editContent,
      });
      toast.success("Message updated successfully");
      setEditDialogOpen(false);
      setEditingMessage(null);
      setEditContent("");
      getsChatDetails();
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      toast.error("Failed to update message");
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingMessage(null);
    setEditContent("");
  };

  const securemessagechatsend = async (chatId) => {
    try {
      const payload = {
        accountid: data,
        chattemplateid: chatTemplate,
        username: senderName,
        viewchatlink: "/login",
        chatId: chatId,
      };
      await chatAPI.sendSecureMessage(payload); 
    } catch (error) {
      console.error("Secure message error:", error);
    }
  };

  const updatechatStatus = async (chatId) => {
    try {
      await chatAPI.updateChat(chatId, { chatstatus: false });
    } catch (error) {
      console.error("Error updating chat status:", error);
    }
  };

  const handleTaskToggle = (id) => {
    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      );
      updateClientTask(updated);
      return updated;
    });
  };

  const updateClientTask = async (updatedTasks) => {
    try {
      await chatAPI.updateTaskCheckedStatus({
        chatId: chat._id,
        taskUpdates: updatedTasks.map((task) => ({
          id: task.id,
          text: task.text,
          checked: task.checked,
        })),
      });
      toast.success("Task updated");
      getsChatDetails();
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      toast.error("Task update failed");
    }
  };

  const handleAddTask = () => {
    const maxId = tasks.length > 0 ? Math.max(...tasks.map((task) => Number(task.id))) : 0;
    const newTaskItem = { id: maxId + 1, text: "", checked: false };
    setTasks([...tasks, newTaskItem]);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleTaskTextChange = (id, newText) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)));
  };

  const resendClientTask = async () => {
    try {
      await chatAPI.addClientTask({ chatId, newTask: tasks });
      const taskMessages = tasks
        .filter((task) => !task.checked)
        .map((task) => `• ${task.text}`)
        .join("\n");
      await updateAdminChatDescription(taskMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAdminChatDescription = async (description) => {
    if (!description.trim()) return;
    try {
      await chatAPI.updateChatDescription(chatId, {
        newDescriptions: [{ message: description, fromwhome: "Admin", senderid: senderName }]
      });
      toast.success("Chat description updated successfully");
      getsChatDetails();
      await updatechatStatus(chatId);
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      toast.error("Failed to update chat description");
    }
  };

  const handleDeleteMessage = async (messageToDelete) => {
    try {
      await chatAPI.deleteMessage({ chatId, messageId: messageToDelete._id });
      toast.success("Message deleted successfully");
      getsChatDetails();
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleArchiveThread = async (id) => {
    try {
      await chatAPI.updateChat(id, { active: !chat.active });
      toast.success(chat.active ? "Chat archived" : "Chat activated");
      accountwiseChatlist(data, isActiveTrue);
      onChatAction();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDeleteThread = async () => {
    try {
      await chatAPI.deleteChat(chatId);
      onChatAction();
      toast.success("Thread deleted successfully");
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      toast.error("Failed to delete thread");
    }
  };

  if (!chat) return null;

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="min-h-[200px] mt-4">
            <Editor onChange={setEditContent} value={editContent} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editContent.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${showTasks ? "pr-4" : "pr-0"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold leading-none">
              {chat.accountid?.accountName || accountName}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{chat.chatsubject}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {tasks.length > 0 ? (
              <span className="text-sm font-semibold cursor-pointer hover:underline" onClick={toggleTasks}>
                Client Tasks: {tasks.filter(t => t.checked).length}/{tasks.length}
              </span>
            ) : (
              <Button variant="link" size="sm" onClick={toggleTasks} className="text-blue-600">
                + Add Client Task
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleArchiveThread(chatId)}>
                  {chat.active ? "Archive Thread" : "Activate Thread"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDeleteThread}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 h-[40vh]">
          {Array.isArray(chat.description) && chat.description.map((desc, index) => (
            <MessageItem
              key={desc._id || index}
              desc={desc}
              chat={chat}
              messageRefs={messageRefs}
              highlightedId={highlightedId}
              setHighlightedId={setHighlightedId}
              setReplyTo={setReplyTo}
              formatDate={formatDate}
              handleDeleteMessage={handleDeleteMessage}
              handleEditMessage={handleEditMessage}
              canEditMessage={canEditMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <Separator />

        <div className="p-4 h-[35vh] overflow-y-auto">
          {replyTo && (
            <div className="mb-2 p-3 bg-slate-50 border-l-4 border-blue-500 rounded relative">
              <p className="text-xs font-bold mb-1">
                Replying to: {replyTo.fromwhome === "client" ? replyTo.senderid : "Admin"}
              </p>
              <div 
                className="text-sm italic truncate pr-8"
                dangerouslySetInnerHTML={{ __html: replyTo.message }}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6" 
                onClick={() => setReplyTo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-4 items-start">
            <div className="flex-1">
               <Editor onChange={handleEditorChange} value={editorContent} />
            </div>
            <Button onClick={() => updateChatDescription()} className="mt-auto">Send</Button>
          </div>
        </div>
      </div>

      {/* Tasks Panel */}
      {showTasks && (
        <div className="w-80 border-l bg-slate-50/50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <h3 className="font-semibold">Client Tasks</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleAddTask}><Plus className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={toggleTasks}><X className="h-4 w-4" /></Button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 mb-2 bg-white p-2 rounded border shadow-sm">
                <Checkbox 
                  checked={task.checked} 
                  onCheckedChange={() => handleTaskToggle(task.id)} 
                />
                <Input 
                  value={task.text} 
                  onChange={(e) => handleTaskTextChange(task.id, e.target.value)}
                  className={`h-8 border-none focus-visible:ring-0 ${task.checked ? "line-through text-gray-400" : ""}`}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:text-red-700" 
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 border-t bg-white">
            <Button variant="outline" className="w-full" onClick={resendClientTask}>Resend Client Task</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageItem = ({
  desc,
  chat,
  messageRefs,
  highlightedId,
  setHighlightedId,
  setReplyTo,
  formatDate,
  handleDeleteMessage,
  handleEditMessage,
  canEditMessage,
}) => {
  const isClient = desc.fromwhome?.toLowerCase() === "client";
  const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
  const isEditable = isAdmin && canEditMessage(desc.time);

  return (
    <div
      ref={(el) => desc._id && (messageRefs.current[desc._id] = el)}
      className={`flex mb-4 ${isClient ? "justify-start" : "justify-end"}`}
    >
      <div className={`max-w-[75%] p-3 rounded-lg shadow-sm relative border ${
        desc._id === highlightedId ? "bg-yellow-100 border-yellow-300" : 
        isAdmin ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"
      } ${isClient ? "rounded-tl-none" : "rounded-tr-none"}`}>
        
        {desc.replyTo && (
           <ReplyPreviewItem 
             desc={desc} 
             chat={chat} 
             messageRefs={messageRefs} 
             setHighlightedId={setHighlightedId} 
           />
        )}

        <div className="flex justify-between items-start gap-4 mb-1">
          <span className="text-xs font-bold text-gray-700">{desc.senderid}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5"><MoreVertical className="h-3 w-3" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setReplyTo(desc)}>
                <CornerUpLeft className="mr-2 h-4 w-4" /> Reply
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  {isEditable && (
                    <DropdownMenuItem onClick={() => handleEditMessage(desc)}>
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMessage(desc)}>
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div 
          className="text-sm whitespace-pre-wrap text-gray-800"
          dangerouslySetInnerHTML={{ __html: desc.message || "No message available" }}
        />

        <div className="text-[10px] text-gray-400 text-right mt-1">
          {desc.time ? formatDate(desc.time) : "Just now"}
          {isAdmin && !isEditable && desc.time && (
            <span className="block italic text-gray-400">(Edit expired)</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ReplyPreviewItem = ({ desc, chat, messageRefs, setHighlightedId }) => {
  const repliedMsg = chat.description.find((msg) => msg._id === desc.replyTo);
  if (!repliedMsg) return null;

  const scrollToOriginal = () => {
    const el = messageRefs.current[desc.replyTo];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedId(desc.replyTo);
      setTimeout(() => setHighlightedId(null), 2000);
    }
  };

  return (
    <div className="mb-2 p-2 bg-black/5 border-l-2 border-blue-500 rounded text-xs cursor-pointer" onClick={scrollToOriginal}>
      <p className="font-bold text-blue-600">
        {repliedMsg.fromwhome === "client" ? repliedMsg.senderid : "You"}
      </p>
      <div 
        className="italic text-gray-600 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: repliedMsg.message }}
      />
    </div>
  );
};

export default ChatDetails;