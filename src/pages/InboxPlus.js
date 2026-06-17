

// import React, { useEffect, useState } from "react";
// import {
//   Archive,
//   Check,
// } from "lucide-react";
// import {
//   Search,
//   Mail,
//   ChevronDown,
//   ChevronUp,
//   Paperclip,

//   X,
//   SlidersHorizontal,
// } from "lucide-react";

// import { Avatar as ShadAvatar, AvatarFallback } from "../components/ui/avatar";

// import { Button as ShadButton } from "../components/ui/button";

// import { Input } from "../components/ui/input";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "../components/ui/sheet";

// import { authAPI, emailSyncAPI } from "../services/api";

// const AVATAR_COLORS = [
//   "#00ACC1",
//   "#7C3AED",
//   "#16A34A",
//   "#DC2626",
//   "#D97706",
//   "#2563EB",
//   "#DB2777",
// ];

// const getAvatarColor = (str = "") => {
//   const hash = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

//   return AVATAR_COLORS[hash % AVATAR_COLORS.length];
// };

// const getInitialsFromStr = (str = "") => {
//   const clean = str.replace(/<.*?>/g, "").trim();

//   const parts = clean.split(/[\s@]+/);

//   return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
// };

// const getRelativeTime = (dateStr) => {
//   if (!dateStr) return "";

//   const diff = Date.now() - new Date(dateStr);

//   const mins = Math.floor(diff / 60000);

//   if (mins < 1) return "Now";

//   if (mins < 60) return `${mins}m`;

//   const hrs = Math.floor(mins / 60);

//   if (hrs < 24) return `${hrs}h`;

//   const days = Math.floor(hrs / 24);

//   if (days < 7) {
//     return new Date(dateStr).toLocaleDateString("en-US", {
//       weekday: "short",
//     });
//   }

//   return new Date(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// };

// const extractMongoId = (subject = "") => {
//   const match = subject.match(/#([a-f0-9]{24})\b/i);

//   return match ? match[1] : null;
// };

// const cleanSubjectText = (subject = "") => {
//   return subject.replace(/#[a-f0-9]{24}\b/i, "").trim();
// };

// const buildAccountLink = (mongoId) => {
//   return `/admin/clients/accounts/accountsdash/overview/${mongoId}`;
// };

// const extractEmail = (from = "") => {
//   const match = from.match(/<(.+?)>/);

//   return match ? match[1] : from;
// };

// const getPreview = (html = "") => {
//   return html.replace(/<[^>]*>?/gm, "");
// };

// const EmailViewer = () => {
//   const [notifications, setNotifications] = useState([]);

//   const [searchQuery, setSearchQuery] = useState("");

//   const [expandedThreadId, setExpandedThreadId] = useState(null);

//   const [expandedMessageId, setExpandedMessageId] = useState(null);

//   const [replyText, setReplyText] = useState("");

//   const [replyingToMessageId, setReplyingToMessageId] = useState(null);

//   const [previewFile, setPreviewFile] = useState(null);

//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

//   const [checkedItems, setCheckedItems] = useState({
//     invoice: false,
//     proposal: false,
//     document: false,
//     organizer: false,
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const notificationsRes = await authAPI.getEmailNotifications();

//       setNotifications(notificationsRes?.data?.threads || []);
//       console.log("setNotifications", notificationsRes?.data);
//     } catch (error) {
//       console.log("EMAIL FETCH ERROR:", error);
//     }
//   };

//   const currentThreads = notifications;

//   const unreadCount = currentThreads.filter((t) => !t.latest?.isRead).length;

//   const filteredThreads = currentThreads.filter((thread) => {
//     if (!searchQuery.trim()) return true;

//     const q = searchQuery.toLowerCase();

//     return (
//       thread.latest?.from?.toLowerCase().includes(q) ||
//       thread.latest?.subject?.toLowerCase().includes(q) ||
//       thread.latest?.body?.toLowerCase().includes(q)
//     );
//   });

//   const selectedThread = currentThreads.find((t) => t._id === expandedThreadId);

//   // const handleExpandThread = (threadId) => {
//   //   setExpandedThreadId(expandedThreadId === threadId ? null : threadId);

//   //   setExpandedMessageId(null);
//   // };
// const handleExpandThread =
//   async (threadId) => {

//     setExpandedThreadId(
//       expandedThreadId ===
//         threadId
//         ? null
//         : threadId
//     );

//     setExpandedMessageId(
//       null
//     );

//     // ? AUTO MARK AS READ
//     const thread =
//       notifications.find(
//         (t) =>
//           t._id ===
//           threadId
//       );

//     if (
//       thread &&
//       !thread.latest?.isRead
//     ) {

//       await handleMarkAsRead(
//         threadId
//       );

//     }

//   };
//   const handleExpandMessage = (messageId) => {
//     setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
//   };

//   const handleMarkAsRead =
//   async (threadId) => {

//     try {

//       await emailSyncAPI.markThreadAsRead(
//         threadId
//       );

//       setNotifications(
//         (prev) =>
//           prev.map(
//             (thread) => {

//               if (
//                 thread._id !==
//                 threadId
//               ) {
//                 return thread;
//               }

//               return {

//                 ...thread,

//                 latest: {
//                   ...thread.latest,
//                   isRead: true,
//                 },

//                 messages:
//                   thread.messages.map(
//                     (msg) => ({
//                       ...msg,
//                       isRead: true,
//                     })
//                   ),

//               };

//             }
//           )
//       );

//     } catch (error) {

//       console.log(
//         "MARK READ ERROR:",
//         error
//       );

//     }

//   };

// const handleArchiveThread =
//   async (threadId) => {

//     try {

//       await emailSyncAPI.archiveThread(
//         threadId
//       );

//       // ? REMOVE THREAD FROM UI
//       setNotifications(
//         (prev) =>
//           prev.filter(
//             (thread) =>
//               thread._id !==
//               threadId
//           )
//       );

//       if (
//         expandedThreadId ===
//         threadId
//       ) {

//         setExpandedThreadId(
//           null
//         );

//       }

//     } catch (error) {

//       console.log(
//         "ARCHIVE ERROR:",
//         error
//       );

//     }

//   };
//   const openAttachment = (attachment) => {
//     const byteCharacters = atob(attachment.data);

//     const byteNumbers = new Array(byteCharacters.length);

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);

//     const blob = new Blob([byteArray], {
//       type: attachment.mimeType,
//     });

//     const url = URL.createObjectURL(blob);

//     setPreviewFile({
//       ...attachment,
//       url,
//     });
//   };

//   const sendReply = async () => {
//     if (!replyText.trim() || !selectedThread) return;

//     try {
//       await emailSyncAPI.replyEmail({
//         to: extractEmail(selectedThread?.latest?.from || ""),

//         subject: selectedThread?.latest?.subject || "No Subject",

//         message: replyText,
//       });

//       setReplyText("");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const renderLinkedSubject = (subject, isBold = false) => {
//     const mongoId = extractMongoId(subject);

//     const text = cleanSubjectText(subject) || "(No Subject)";

//     if (!mongoId) {
//       return text;
//     }

//     return (
//       <a
//         href={buildAccountLink(mongoId)}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-primary font-medium no-underline"
//         style={{
//           fontWeight: isBold ? "bold" : "normal",
//         }}
//       >
//         {text}
//       </a>
//     );
//   };

//   return (
//     <div className="flex h-full overflow-hidden bg-background">
//       {/* LEFT PANEL */}

//       <div className="w-[300px] shrink-0 flex flex-col border-r border-border/40 h-full overflow-hidden bg-background">
//         {/* HEADER */}

//         <div className="px-4 pt-4 pb-0 shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <h1 className="text-[15px] font-semibold text-foreground tracking-tight">
//               Notifications
//             </h1>

//             <ShadButton
//               variant="ghost"
//               size="sm"
//               className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
//               onClick={() => setFilterDrawerOpen(true)}
//             >
//               <SlidersHorizontal className="h-3.5 w-3.5" />
//             </ShadButton>
//           </div>

//           {/* SEARCH */}

//           <div className="relative mb-3">
//             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />

//             <Input
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-8 h-8 text-[12px] rounded-md border-0 bg-muted/50 focus-visible:bg-muted focus-visible:ring-1 placeholder:text-muted-foreground/50"
//             />
//           </div>

//           {/* TITLE */}

//           <div className="flex items-center justify-between border-b border-border/40 -mx-4 px-4">
//             <div className="px-1 py-2">
//               <span className="text-[12px] font-semibold text-foreground">
//                 Inbox
//               </span>

//               {unreadCount > 0 && (
//                 <span className="ml-2 inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1">
//                   {unreadCount}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* THREADS */}

//         <div className="flex-1 overflow-y-auto">
//           {filteredThreads.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 gap-2">
//               <Mail className="h-8 w-8 text-muted-foreground/20" />

//               <p className="text-[12px] text-muted-foreground">
//                 No emails found
//               </p>
//             </div>
//           ) : (
//             filteredThreads.map((thread) => {
//               const latest = thread.latest;

//               const isSelected = expandedThreadId === thread._id;

//               return (
//                 <div
//                   key={thread._id}
//                   onClick={() => handleExpandThread(thread._id)}
//                   className={`group flex items-start gap-2.5 px-4 py-2.5 cursor-pointer transition-colors duration-150 ${
//                     isSelected ? "bg-muted" : "hover:bg-muted/40"
//                   }`}
//                 >
//                   <div className="shrink-0 mt-[7px]">
//                     <div
//                       className={`h-1.5 w-1.5 rounded-full ${
//                         !latest?.isRead ? "bg-primary" : "bg-transparent"
//                       }`}
//                     />
//                   </div>

//                   <ShadAvatar className="h-8 w-8 shrink-0">
//                     <AvatarFallback
//                       style={{
//                         backgroundColor: getAvatarColor(latest?.from),
//                       }}
//                       className="text-white text-[10px] font-bold"
//                     >
//                       {getInitialsFromStr(latest?.from)}
//                     </AvatarFallback>
//                   </ShadAvatar>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-baseline justify-between gap-2">
//                       {/* <span
//                         className={`text-[12.5px] truncate ${
//                           !latest?.isRead
//                             ? "font-semibold text-foreground"
//                             : "font-medium text-foreground/70"
//                         }`}
//                       >
//                         {latest?.from?.replace(/<.*?>/g, "").trim()}
//                       </span> */}

//                       <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
//                         {getRelativeTime(latest?.messageDate)}
//                       </span>
//                     </div>

//                     <div
//                       className={`text-[12px] truncate ${
//                         !latest?.isRead
//                           ? "font-semibold text-foreground"
//                           : "font-normal text-muted-foreground"
//                       }`}
//                     >
//                       {cleanSubjectText(latest?.subject || "")}
//                     </div>

//                     <div className="text-[11px] text-muted-foreground/55 truncate">
//                       {getPreview(latest?.body || "").slice(0, 60)}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL */}

//       <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
//         {!selectedThread ? (
//           <div className="flex-1 flex flex-col items-center justify-center gap-2">
//             <Mail className="h-8 w-8 text-muted-foreground/20" />

//             <p className="text-[13px] font-medium text-foreground/60">
//               Select a thread to read
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* HEADER */}

//             {/* <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0 gap-4">
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-[15px] font-semibold text-foreground leading-tight truncate">
//                   {renderLinkedSubject(selectedThread?.latest?.subject, true)}
//                 </h2>

//                 <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
//                   {selectedThread?.messages?.length} messages
//                 </p>
//               </div>
//             </div> */}

// <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0 gap-4">

//   <div className="flex-1 min-w-0">

//     <h2 className="text-[15px] font-semibold text-foreground leading-tight truncate">
//       {renderLinkedSubject(
//         selectedThread
//           ?.latest
//           ?.subject,
//         true
//       )}
//     </h2>

//     <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
//       {
//         selectedThread
//           ?.messages
//           ?.length
//       }{" "}
//       messages
//     </p>

//   </div>

//   {/* ACTIONS */}

//   <div className="flex items-center gap-2">

//     {!selectedThread
//       ?.latest?.isRead && (

//       <ShadButton
//         variant="outline"
//         size="sm"
//         className="h-8 text-[12px]"
//         onClick={() =>
//           handleMarkAsRead(
//             selectedThread._id
//           )
//         }
//       >

//         <Check className="h-3.5 w-3.5 mr-1" />

//         Mark read

//       </ShadButton>

//     )}

//     <ShadButton
//       variant="outline"
//       size="sm"
//       className="h-8 text-[12px]"
//       onClick={() =>
//         handleArchiveThread(
//           selectedThread._id
//         )
//       }
//     >

//       <Archive className="h-3.5 w-3.5 mr-1" />

//       Archive

//     </ShadButton>

//   </div>

// </div>
//             {/* MESSAGES */}

//             <div className="flex-1 overflow-y-auto">
//               <div className="px-6 py-4">
//                 {selectedThread?.messages?.map((email, idx, arr) => {
//                   const isExpanded = expandedMessageId === email.messageId;

//                   return (
//                     <div
//                       key={email.messageId}
//                       className={`${
//                         idx < arr.length - 1 ? "border-b border-border/40" : ""
//                       }`}
//                     >
//                       {/* MESSAGE HEADER */}

//                       <div
//                         onClick={() => handleExpandMessage(email.messageId)}
//                         className={`flex items-start gap-3 py-3 cursor-pointer transition-colors duration-100 rounded-md ${
//                           isExpanded ? "" : "hover:bg-muted/40"
//                         }`}
//                       >
//                         <ShadAvatar className="h-8 w-8 shrink-0">
//                           <AvatarFallback
//                             style={{
//                               backgroundColor: getAvatarColor(email.from || ""),
//                             }}
//                             className="text-white text-[10px] font-bold"
//                           >
//                             {getInitialsFromStr(email.from || "")}
//                           </AvatarFallback>
//                         </ShadAvatar>

//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-baseline justify-between">
//                             <span className="text-[13px] font-semibold text-foreground">
//                               {email.from?.replace(/<.*?>/g, "").trim()}
//                             </span>

//                             <div className="flex items-center gap-1.5 shrink-0 ml-3">
//                               <span className="text-[11px] text-muted-foreground tabular-nums">
//                                 {new Date(email.messageDate).toLocaleString()}
//                               </span>

//                               {isExpanded ? (
//                                 <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
//                               ) : (
//                                 <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
//                               )}
//                             </div>
//                           </div>

//                           {!isExpanded && (
//                             <p className="text-[12px] text-muted-foreground truncate mt-0.5">
//                               {getPreview(email.body || "").slice(0, 120)}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       {/* BODY */}

//                       {isExpanded && (
//                         <div className="ml-11 pb-4">
//                           <div
//                             className="text-[13px] leading-6 text-foreground break-words [&_p]:mb-3 [&_a]:text-primary [&_a]:underline"
//                             dangerouslySetInnerHTML={{
//                               __html: email.body,
//                             }}
//                           />

//                           {/* ATTACHMENTS */}

//                           {email?.attachments?.length > 0 && (
//                             <div className="mt-4 pt-3 border-t border-border/40">
//                               <p className="flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
//                                 <Paperclip className="h-2.5 w-2.5" />
//                                 {email.attachments.length} Attachment
//                                 {email.attachments.length > 1 ? "s" : ""}
//                               </p>

//                               <div className="flex flex-wrap gap-1.5">
//                                 {email.attachments.map((att, i) => (
//                                   <button
//                                     key={i}
//                                     onClick={() => openAttachment(att)}
//                                     className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/60 bg-muted/30 hover:bg-muted hover:border-border transition-colors text-left"
//                                   >
//                                     <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />

//                                     <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">
//                                       {att.filename}
//                                     </span>
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                           {/* REPLY */}

//                           {/* {replyingToMessageId === email.messageId ? (
//                             <div className="mt-3 rounded-lg border border-border bg-muted/20 overflow-hidden">
//                               <textarea
//                                 rows={3}
//                                 value={replyText}
//                                 onChange={(e) => setReplyText(e.target.value)}
//                                 placeholder="Reply..."
//                                 className="w-full bg-transparent px-4 pt-3 pb-1 text-[13px] text-foreground resize-none outline-none placeholder:text-muted-foreground/50"
//                               />

//                               <div className="flex items-center justify-between px-3 py-2 border-t border-border/40">
//                                 <ShadButton
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-7 text-[11.5px] rounded-md text-muted-foreground hover:text-foreground"
//                                   onClick={() => {
//                                     setReplyingToMessageId(null);

//                                     setReplyText("");
//                                   }}
//                                 >
//                                   Cancel
//                                 </ShadButton>

//                                 <ShadButton
//                                   size="sm"
//                                   className="h-7 px-4 text-[12px] rounded-md gap-1.5 font-medium"
//                                   onClick={() => {
//                                     sendReply();

//                                     setReplyingToMessageId(null);
//                                   }}
//                                 >
//                                   <Send className="h-3.5 w-3.5" />
//                                   Send
//                                 </ShadButton>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="mt-3">
//                               <ShadButton
//                                 variant="outline"
//                                 size="sm"
//                                 className="h-7 px-3 text-[12px] rounded-md gap-1.5"
//                                 onClick={() => {
//                                   setReplyingToMessageId(email.messageId);
//                                 }}
//                               >
//                                 <Reply className="h-3.5 w-3.5" />
//                                 Reply
//                               </ShadButton>
//                             </div>
//                           )} */}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* PREVIEW */}

//       {previewFile && (
//         <div
//           onClick={() => setPreviewFile(null)}
//           className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/65 backdrop-blur-sm"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-card rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border"
//             style={{
//               width: "85%",
//               height: "90%",
//             }}
//           >
//             <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
//               <span className="text-[13px] font-semibold text-foreground">
//                 {previewFile.filename}
//               </span>

//               <ShadButton
//                 variant="ghost"
//                 size="sm"
//                 className="h-7 w-7 p-0 rounded-lg"
//                 onClick={() => setPreviewFile(null)}
//               >
//                 <X className="h-4 w-4" />
//               </ShadButton>
//             </div>

//             <div className="flex-1 overflow-hidden">
//               {previewFile.mimeType.startsWith("image/") ? (
//                 <img
//                   src={previewFile.url}
//                   alt={previewFile.filename}
//                   className="w-full h-full object-contain"
//                 />
//               ) : (
//                 <iframe
//                   src={previewFile.url}
//                   className="w-full h-full border-none"
//                   title="File Preview"
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FILTER SHEET */}

//       <Sheet
//         open={filterDrawerOpen}
//         onOpenChange={(o) => !o && setFilterDrawerOpen(false)}
//       >
//         <SheetContent
//           side="right"
//           className="p-0 flex flex-col [&>button]:hidden w-[280px]"
//         >
//           <SheetHeader className="flex flex-row items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
//             <SheetTitle className="flex items-center gap-2 text-[13.5px] font-semibold">
//               <SlidersHorizontal className="h-4 w-4 text-primary" />
//               Filter emails
//             </SheetTitle>
//           </SheetHeader>

//           <div className="flex-1 overflow-y-auto px-5 py-4">
//             {Object.keys(checkedItems).map((key) => (
//               <label
//                 key={key}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-[13px] hover:bg-muted/60"
//               >
//                 <input
//                   type="checkbox"
//                   name={key}
//                   checked={checkedItems[key]}
//                   onChange={(e) =>
//                     setCheckedItems({
//                       ...checkedItems,
//                       [key]: e.target.checked,
//                     })
//                   }
//                   className="accent-primary h-3.5 w-3.5 shrink-0"
//                 />

//                 <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
//               </label>
//             ))}
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// };

// export default EmailViewer;


import React, { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Check,
  Mail,
  Paperclip,
  Search,
  SlidersHorizontal,
  X,
  ExternalLink,Undo2
} from "lucide-react";
import { useToastContext } from "../context/ToastContext";
import { Button as ShadButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";

import { authAPI,  } from "../services/api";

const extractMongoId = (subject = "") => {
  const match = subject.match(/#([a-f0-9]{24})\b/i);
  return match ? match[1] : null;
};
const cleanSubjectText = (subject = "") =>
  subject.replace(/#[a-f0-9]{24}\b/i, "").trim();

const getPreview = (html = "") =>
  html.replace(/<[^>]*>?/gm, "");
const buildAccountLink = (mongoId) => {
  return `/admin/clients/accounts/accountsdash/overview/${mongoId}`;
};

const renderLinkedSubject = (subject) => {
  const mongoId = extractMongoId(subject);

  const text = cleanSubjectText(subject) || "(No Subject)";

  if (!mongoId) {
    return text;
  }

  return (
    <a
      href={buildAccountLink(mongoId)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline font-medium"
    >
      {text}
    </a>
  );
};


export default function InboxPlus() {
  const [notifications, setNotifications] = useState([]);
  const [archivedNotifications, setArchivedNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("inbox");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastContext();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both inbox and archived in parallel using the query parameter
      const [inboxRes, archivedRes] = await Promise.all([
        authAPI.getEmailNotifications(false),  // archived=false
        authAPI.getEmailNotifications(true)     // archived=true
      ]);
      
      // Note: Your backend returns data in data.threads
      const inboxThreads = inboxRes?.data?.data?.threads || [];
      const archivedThreads = archivedRes?.data?.data?.threads || [];
      console.log("hgftcvhgb list",inboxThreads)
      setNotifications(inboxThreads);
      setArchivedNotifications(archivedThreads);
      
      console.log("Fetched threads:", { 
        inbox: inboxThreads.length, 
        archived: archivedThreads.length 
      });
    } catch (err) {
      console.error(err);
      showToast({
        title: "Error",
        description: "Failed to fetch notifications",
        type: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current view data
  const currentData = viewMode === "inbox" ? notifications : archivedNotifications;

  // const filteredThreads = useMemo(() => {
  //   return currentData.filter((thread) => {
  //     if (!searchQuery.trim()) return true;
  //     const q = searchQuery.toLowerCase();

  //     return (
  //       thread.latest?.subject?.toLowerCase().includes(q) ||
  //       thread.latest?.from?.toLowerCase().includes(q) ||
  //       thread.latest?.body?.toLowerCase().includes(q)
  //     );
  //   });
  // }, [currentData, searchQuery]);
// Add this state near the other useState declarations
const [activeFilters, setActiveFilters] = useState({
  all: true,
  invoices: false,
  documents: false,
  emails: false,
  tasks: false,
  organizers: false,
  chats: false,
  signatures: false,
  proposals: false,
  system: false,
  newAccounts: false,
  jobs: false,
  accountSettings: false,
  mentions: false,
  sms: false,
  clientRequests: false
});

// Add filter categories with their search keywords
const filterCategories = [
  { key: 'all', label: 'All', keywords: [] },
  { key: 'invoices', label: 'Invoices', keywords: ['invoice', 'payment', 'bill', 'receipt'] },
  { key: 'documents', label: 'Documents', keywords: ['document', 'file', 'attachment', 'pdf'] },
  { key: 'emails', label: 'Emails', keywords: ['email', 'mail', 'message'] },
  { key: 'tasks', label: 'Tasks', keywords: ['task', 'todo', 'assignment', 'assigned'] },
  { key: 'organizers', label: 'Organizers', keywords: ['organizer', 'calendar', 'meeting', 'event'] },
  { key: 'messages', label: 'Chats', keywords: ['chat', 'conversation', 'message'] },
  { key: 'signatures', label: 'Signatures', keywords: ['signature', 'sign', 'approval', 'authorized'] },
  { key: 'proposals', label: 'Proposals', keywords: ['proposal', 'quote', 'estimate', 'bid'] },
  { key: 'approvals', label: 'Approvals', keywords: ['approved', 'cancelled', 'document', ] },
];

// Update the filteredThreads useMemo to include filters
const filteredThreads = useMemo(() => {
  return currentData.filter((thread) => {
    const subject = thread.latest?.subject || '';
    const body = getPreview(thread.latest?.body || '');
    const from = thread.latest?.from || '';
    const combinedText = `${subject} ${body} ${from}`.toLowerCase();

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        subject.toLowerCase().includes(q) ||
        body.toLowerCase().includes(q) ||
        from.toLowerCase().includes(q);
      
      if (!matchesSearch) return false;
    }

    // Category filters - search for keywords in subject or body
    if (!activeFilters.all) {
      const activeFilterKeys = Object.keys(activeFilters).filter(key => 
        key !== 'all' && activeFilters[key]
      );
      
      // If no specific filters are active, show all
      if (activeFilterKeys.length === 0) return true;
      
      // Check if thread matches any active filter based on keywords
      return activeFilterKeys.some(filterKey => {
        const filterConfig = filterCategories.find(f => f.key === filterKey);
        if (!filterConfig) return false;
        
        // Check if any keyword from this filter appears in the combined text
        return filterConfig.keywords.some(keyword => 
          combinedText.includes(keyword.toLowerCase())
        );
      });
    }

    return true;
  });
}, [currentData, searchQuery, activeFilters]);

// Add this function to handle filter changes
const handleFilterChange = (filterKey) => {
  if (filterKey === 'all') {
    // If "All" is clicked, reset all filters
    const newFilters = {};
    Object.keys(activeFilters).forEach(key => {
      newFilters[key] = key === 'all';
    });
    setActiveFilters(newFilters);
  } else {
    // Toggle the specific filter
    setActiveFilters(prev => ({
      ...prev,
      all: false, // Deselect "All" when any specific filter is selected
      [filterKey]: !prev[filterKey]
    }));
  }
};

  const handleMarkAsRead = async (threadId) => {
    const toastId = showToast({
      title: "Processing...",
      description: "Marking thread as read",
      type: "loading",
      duration: Infinity,
    });

    try {
      await authAPI.markThreadAsRead(threadId);
      
      // Update in both states if needed
      setNotifications((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? {
                ...t,
                latest: { ...t.latest, isRead: true },
              }
            : t
        )
      );
      
      setArchivedNotifications((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? {
                ...t,
                latest: { ...t.latest, isRead: true },
              }
            : t
        )
      );

      showToast({
        id: toastId,
        title: "Success",
        description: "Thread marked as read successfully",
        type: "success",
        duration: 3000,
      });

    } catch (e) {
      console.error(e);
      showToast({
        id: toastId,
        title: "Error",
        description: "Failed to mark thread as read",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleArchiveThread = async (threadId) => {
    try {
      await authAPI.archiveThread(threadId);
      
      // Find the thread being archived
      const threadToArchive = notifications.find(t => t._id === threadId);
      
      // Remove from inbox
      setNotifications((prev) => prev.filter((t) => t._id !== threadId));
      
      // Add to archived
      if (threadToArchive) {
        setArchivedNotifications((prev) => [
          { ...threadToArchive, isArchived: true },
          ...prev
        ]);
      }

      setSelectedThread(null);

      showToast({
        title: "Success",
        description: "Thread archived successfully",
        type: "success",
        duration: 3000,
      });

    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to archive thread. Please try again.",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleUnarchiveThread = async (threadId) => {
    try {
      await authAPI.unarchiveThread(threadId);
      
      // Find the thread being unarchived
      const threadToUnarchive = archivedNotifications.find(t => t._id === threadId);
      
      // Remove from archived
      setArchivedNotifications((prev) => prev.filter((t) => t._id !== threadId));
      
      // Add to inbox
      if (threadToUnarchive) {
        setNotifications((prev) => [
          { ...threadToUnarchive, isArchived: false },
          ...prev
        ]);
      }

      setSelectedThread(null);

      showToast({
        title: "Success",
        description: "Thread restored to inbox",
        type: "success",
        duration: 3000,
      });

    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to unarchive thread. Please try again.",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleBulkArchive = async () => {
    if (selectedRows.length === 0) {
      showToast({
        title: "No Selection",
        description: "Please select at least one thread to archive",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const threadsToArchive = notifications.filter(t => selectedRows.includes(t._id));
      
      // Archive all selected threads
      await Promise.all(selectedRows.map(id => authAPI.archiveThread(id)));
      
      // Update state
      setNotifications((prev) => prev.filter((t) => !selectedRows.includes(t._id)));
      setArchivedNotifications((prev) => [
        ...threadsToArchive.map(t => ({ ...t, isArchived: true })),
        ...prev
      ]);
      
      setSelectedRows([]);

      showToast({
        title: "Success",
        description: `${selectedRows.length} thread(s) archived successfully`,
        type: "success",
        duration: 3000,
      });

    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to archive selected threads",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleBulkUnarchive = async () => {
    if (selectedRows.length === 0) {
      showToast({
        title: "No Selection",
        description: "Please select at least one thread to restore",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const threadsToUnarchive = archivedNotifications.filter(t => selectedRows.includes(t._id));
      
      // Unarchive all selected threads
      await Promise.all(selectedRows.map(id => authAPI.unarchiveThread(id)));
      
      // Update state
      setArchivedNotifications((prev) => prev.filter((t) => !selectedRows.includes(t._id)));
      setNotifications((prev) => [
        ...threadsToUnarchive.map(t => ({ ...t, isArchived: false })),
        ...prev
      ]);
      
      setSelectedRows([]);

      showToast({
        title: "Success",
        description: `${selectedRows.length} thread(s) restored successfully`,
        type: "success",
        duration: 3000,
      });

    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to restore selected threads",
        type: "error",
        duration: 4000,
      });
    }
  };

const openAttachment = async (attachment) => {
  try {
    if (!attachment) {
      showToast({
        title: "Error",
        description: "No attachment found",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const toastId = showToast({
      title: "Loading...",
      description: `Downloading ${attachment.filename || 'attachment'}`,
      type: "loading",
      duration: Infinity,
    });

    // Fetch attachment data from backend
    const response = await authAPI.getAttachmentData(attachment.attachmentId);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch attachment");
    }

    const attachmentData = response.data.data;
    const mimeType = response.data.mimeType || attachment.mimeType;
    const filename = response.data.filename || attachment.filename || 'download';
    
    // Decode base64
    let base64Data = attachmentData;
    if (base64Data.includes('base64,')) {
      base64Data = base64Data.split('base64,')[1];
    }
    
    base64Data = base64Data.replace(/\s/g, '');
    
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], {
      type: mimeType || 'application/octet-stream',
    });

    const url = URL.createObjectURL(blob);

    // Update toast
    showToast({
      id: toastId,
      title: "Success",
      description: `${filename} loaded successfully`,
      type: "success",
      duration: 2000,
    });

    // Handle based on file type
    const fileExtension = filename.split('.').pop()?.toLowerCase() || '';
    const fileType = mimeType?.split('/')[0] || '';

    // ============ PDF FILES ============
    if (mimeType === 'application/pdf' || fileExtension === 'pdf') {
      // Open PDF in new tab
      window.open(url, '_blank');
    }
    
    // ============ IMAGE FILES ============
    else if (
      mimeType?.startsWith('image/') ||
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'].includes(fileExtension)
    ) {
      // Open image in new tab with preview
      setPreviewFile({
        ...attachment,
        url: url,
        blob: blob,
        filename: filename,
        mimeType: mimeType,
      });
      window.open(url, '_blank');
    }
    
    // ============ EXCEL FILES ============
    else if (
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.oasis.opendocument.spreadsheet' ||
      ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv', 'tsv'].includes(fileExtension)
    ) {
      // For Excel files, download directly
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: "Download Started",
        description: `${filename} is being downloaded`,
        type: "info",
        duration: 3000,
      });
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    
    // ============ WORD FILES ============
    else if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ['doc', 'docx'].includes(fileExtension)
    ) {
      // For Word files, download directly
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: "Download Started",
        description: `${filename} is being downloaded`,
        type: "info",
        duration: 3000,
      });
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    
    // ============ POWERPOINT FILES ============
    else if (
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      ['ppt', 'pptx', 'pps', 'ppsx'].includes(fileExtension)
    ) {
      // For PowerPoint files, download directly
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: "Download Started",
        description: `${filename} is being downloaded`,
        type: "info",
        duration: 3000,
      });
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    
    // ============ TEXT FILES ============
    else if (
      mimeType?.startsWith('text/') ||
      ['txt', 'log', 'md', 'rtf'].includes(fileExtension)
    ) {
      // For text files, open in new tab
      window.open(url, '_blank');
    }
    
    // ============ ZIP/ARCHIVE FILES ============
    else if (
      mimeType === 'application/zip' ||
      mimeType === 'application/x-zip-compressed' ||
      mimeType === 'application/x-rar-compressed' ||
      mimeType === 'application/x-7z-compressed' ||
      ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension)
    ) {
      // For archive files, download directly
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: "Download Started",
        description: `${filename} is being downloaded`,
        type: "info",
        duration: 3000,
      });
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    
    // ============ VIDEO FILES ============
    else if (
      mimeType?.startsWith('video/') ||
      ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(fileExtension)
    ) {
      // For video files, open in new tab
      window.open(url, '_blank');
    }
    
    // ============ AUDIO FILES ============
    else if (
      mimeType?.startsWith('audio/') ||
      ['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(fileExtension)
    ) {
      // For audio files, open in new tab
      window.open(url, '_blank');
    }
    
    // ============ JSON/XML FILES ============
    else if (
      ['json', 'xml', 'yaml', 'yml'].includes(fileExtension)
    ) {
      // For JSON/XML files, open in new tab
      window.open(url, '_blank');
    }
    
    // ============ DEFAULT - Download ============
    else {
      // For unknown file types, download directly
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: "Download Started",
        description: `${filename} is being downloaded`,
        type: "info",
        duration: 3000,
      });
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

  } catch (error) {
    console.error('Error opening attachment:', error);
    showToast({
      title: "Error",
      description: `Failed to open attachment: ${error.message}`,
      type: "error",
      duration: 4000,
    });
  }
};

// Add this helper function near the top of your component
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  // Get month abbreviation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  
  // Get day with leading zero
  const day = String(date.getDate()).padStart(2, '0');
  
  // Get year
  const year = date.getFullYear();
  
  // Get time (12-hour format)
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const time = `${hours}:${minutes} ${ampm}`;
  
  return `${month}-${day}-${year}, ${time}`;
};

// Alternative simpler version using built-in Intl.DateTimeFormat
const formatDateSimple = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  const options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-US', options)
    .format(date)
    .replace(/(\d+), (\d+)/, '$1-$2') // Replace comma with hyphen for date format
    .replace(/(\w{3}) (\d{2}), (\d{4})/, '$1-$2-$3'); // Format as Nov-02-2025
};


// Helper function to format file sizes
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center p-2 bg-gray-50 border-b">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      )}

      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-lg">
            {viewMode === "inbox" ? "Notifications" : "Archived"}
          </h1>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-1 ml-4 border rounded-md p-1 bg-gray-50">
            <button
              onClick={() => {
                setViewMode("inbox");
                setSelectedRows([]);
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === "inbox"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inbox ({notifications.length})
            </button>
            <button
              onClick={() => {
                setViewMode("archived");
                setSelectedRows([]);
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === "archived"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Archived ({archivedNotifications.length})
            </button>
          </div>

          <ShadButton
            variant="ghost"
            size="sm"
            onClick={() => setFilterDrawerOpen(true)}
          >
            <SlidersHorizontal size={16} />
          </ShadButton>
        </div>

        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder={`Search ${viewMode === "inbox" ? "notifications" : "archived"}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 border-b bg-slate-50">
        <input
          type="checkbox"
          checked={
            filteredThreads.length > 0 &&
            selectedRows.length === filteredThreads.length
          }
          onChange={(e) =>
            setSelectedRows(
              e.target.checked
                ? filteredThreads.map((t) => t._id)
                : []
            )
          }
        />

        {viewMode === "inbox" ? (
          <>
            <ShadButton variant="outline" size="sm" onClick={handleBulkArchive}>
              Archive Selected
            </ShadButton>
          </>
        ) : (
          <>
            <ShadButton variant="outline" size="sm" onClick={handleBulkUnarchive}>
              Restore to Inbox
            </ShadButton>
          </>
        )}

        <span className="text-sm text-muted-foreground">
          {selectedRows.length} selected
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">Notification</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Attachment</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredThreads.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  {viewMode === "inbox" 
                    ? "No notifications found" 
                    : "No archived notifications"}
                </td>
              </tr>
            ) : (
              filteredThreads.map((thread) => (
                <tr
                  key={thread._id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(thread._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows((p) => [...p, thread._id]);
                        } else {
                          setSelectedRows((p) =>
                            p.filter((id) => id !== thread._id)
                          );
                        }
                      }}
                    />
                  </td>

                  <td className="p-3">
                    <div className="font-medium">
                      {renderLinkedSubject(thread.latest?.subject)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getPreview(thread.latest?.body || "").slice(0, 100)}
                    </div>
                  </td>

                  <td className="p-3">
                    {/* {new Date(
                      thread.latest?.messageDate
                    ).toLocaleString()} */}
                     {formatDate(thread.latest?.messageDate)}
                  </td>

                  <td className="p-3">
                    {thread.latest?.attachments?.[0] ? (
                      <button
                        onClick={() =>
                          openAttachment(thread.latest.attachments[0])
                        }
                        className="flex items-center gap-2 text-blue-600"
                      >
                        <Paperclip size={14} />
                        {thread.latest.attachments[0].filename}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {thread.latest?.isRead ? (
                      <Check className="mx-auto text-green-600" size={16} />
                    ) : (
                      <button
                        onClick={() => handleMarkAsRead(thread._id)}
                        className="text-blue-600 text-xs"
                      >
                        Mark Read
                      </button>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedThread(thread)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <ExternalLink size={16} />
                      </button>
                      
                      {viewMode === "inbox" ? (
                        <button
                          onClick={() => handleArchiveThread(thread._id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Archive"
                        >
                          <Archive size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnarchiveThread(thread._id)}
                          className="text-green-600 hover:text-green-800"
                          title="Restore to Inbox"
                        >
                          <Undo2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* {selectedThread && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-[700px] bg-white h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">
                {renderLinkedSubject(selectedThread.latest?.subject)}
              </h2>
              <div className="flex gap-2">
                {viewMode === "inbox" ? (
                  <ShadButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchiveThread(selectedThread._id)}
                  >
                    <Archive size={14} />
                  </ShadButton>
                ) : (
                  <ShadButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnarchiveThread(selectedThread._id)}
                    className="text-green-600"
                  >
                    <Undo2 size={14} />
                  </ShadButton>
                )}

                <ShadButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedThread(null)}
                >
                  <X size={16} />
                </ShadButton>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedThread.messages?.map((msg) => (
                <div key={msg.messageId} className="border rounded-lg p-4">
                
                  <div
                    dangerouslySetInnerHTML={{ __html: msg.body }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
{selectedThread && (
  <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
    <div className="w-[700px] bg-white h-full overflow-auto">
      <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="font-semibold text-lg">
          {renderLinkedSubject(selectedThread.latest?.subject)}
        </h2>
        <div className="flex gap-2">
          {viewMode === "inbox" ? (
            <ShadButton
              variant="outline"
              size="sm"
              onClick={() => handleArchiveThread(selectedThread._id)}
            >
              <Archive size={14} />
            </ShadButton>
          ) : (
            <ShadButton
              variant="outline"
              size="sm"
              onClick={() => handleUnarchiveThread(selectedThread._id)}
              className="text-green-600"
            >
              <Undo2 size={14} />
            </ShadButton>
          )}

          <ShadButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedThread(null)}
          >
            <X size={16} />
          </ShadButton>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {selectedThread.messages?.map((msg, index) => (
          <div key={msg.messageId || index} className="border rounded-lg p-4 bg-white shadow-sm">
          

            {/* Message Body */}
            <div className="prose max-w-none mb-4">
              {msg.body ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: msg.body }}
                  className="email-body"
                />
              ) : (
                <p className="text-gray-500 italic">No content available</p>
              )}
            </div>

            {/* Attachments */}
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Attachments ({msg.attachments.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {msg.attachments.map((attachment, idx) => (
                    <button
                      key={idx}
                      onClick={() => openAttachment(attachment)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm text-blue-700 transition-colors border border-blue-200"
                    >
                      <Paperclip size={14} />
                      <span>{attachment.filename || `Attachment ${idx + 1}`}</span>
                      {attachment.size && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({formatFileSize(attachment.size)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      {/* <Sheet
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet> */}
      <Sheet
  open={filterDrawerOpen}
  onOpenChange={setFilterDrawerOpen}
>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    
    <div className="mt-6 space-y-6">
      {/* Filter Categories */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">Categories</h4>
        <div className="space-y-2">
          {filterCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleFilterChange(category.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                activeFilters[category.key]
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{category.label}</span>
                {category.key !== 'all' && (
                  <span className="text-xs text-gray-400">
                    ({category.keywords.length} keywords)
                  </span>
                )}
              </div>
              {activeFilters[category.key] && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {!activeFilters.all && Object.keys(activeFilters).some(key => key !== 'all' && activeFilters[key]) && (
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700">
            <span className="font-medium">Active filters:</span>{' '}
            {Object.keys(activeFilters)
              .filter(key => key !== 'all' && activeFilters[key])
              .map(key => filterCategories.find(f => f.key === key)?.label)
              .filter(Boolean)
              .join(', ')}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Searching in subject, body, and sender
          </p>
        </div>
      )}

      {/* Clear Filters Button */}
      <div className="pt-4 border-t">
        <ShadButton
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            const newFilters = {};
            Object.keys(activeFilters).forEach(key => {
              newFilters[key] = key === 'all';
            });
            setActiveFilters(newFilters);
          }}
        >
          Clear All Filters
        </ShadButton>
      </div>

      {/* Apply Filters Button */}
      <ShadButton
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={() => setFilterDrawerOpen(false)}
      >
        Apply Filters
      </ShadButton>
    </div>
  </SheetContent>
</Sheet>
    </div>
  );
}


// export default function InboxPlus() {
//   const [notifications, setNotifications] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectedThread, setSelectedThread] = useState(null);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
// const {showToast}=useToastContext();
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await authAPI.getEmailNotifications();
//       setNotifications(res?.data?.threads || []);
//       console.log("fected threds list",res?.data.threads)
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filteredThreads = useMemo(() => {
//     return notifications.filter((thread) => {
//       if (!searchQuery.trim()) return true;
//       const q = searchQuery.toLowerCase();

//       return (
//         thread.latest?.subject?.toLowerCase().includes(q) ||
//         thread.latest?.from?.toLowerCase().includes(q) ||
//         thread.latest?.body?.toLowerCase().includes(q)
//       );
//     });
//   }, [notifications, searchQuery]);

  

//   const handleMarkAsRead = async (threadId) => {
//   const toastId = showToast({
//     title: "Processing...",
//     description: "Marking thread as read",
//     type: "loading",
//     duration: Infinity, // Keep until resolved
//   });

//   try {
//     await authAPI.markThreadAsRead(threadId);
    
//     setNotifications((prev) =>
//       prev.map((t) =>
//         t._id === threadId
//           ? {
//               ...t,
//               latest: { ...t.latest, isRead: true },
//             }
//           : t
//       )
//     );

//     // Update the loading toast to success
//     showToast({
//       id: toastId,
//       title: "Success",
//       description: "Thread marked as read successfully",
//       type: "success",
//       duration: 3000,
//     });

//   } catch (e) {
//     console.error(e);
    
//     // Update the loading toast to error
//     showToast({
//       id: toastId,
//       title: "Error",
//       description: "Failed to mark thread as read",
//       type: "error",
//       duration: 4000,
//     });
//   }
// };

// const handleArchiveThread = async (threadId) => {
//   try {
//     await authAPI.archiveThread(threadId);
    
//     setNotifications((prev) =>
//       prev.filter((t) => t._id !== threadId)
//     );

//     // Close the detail panel if open
//     setSelectedThread(null);

//     // Success toast
//     showToast({
//       title: "Success",
//       description: "Thread archived successfully",
//       type: "success",
//       duration: 3000,
//     });

//   } catch (e) {
//     console.error(e);
    
//     // Error toast
//     showToast({
//       title: "Error",
//       description: "Failed to archive thread. Please try again.",
//       type: "error",
//       duration: 4000,
//     });
//   }
// };
 

//   const openAttachment = (attachment) => {
//     const byteCharacters = atob(attachment.data);
//     const byteNumbers = Array.from(byteCharacters).map((c) =>
//       c.charCodeAt(0)
//     );

//     const blob = new Blob([new Uint8Array(byteNumbers)], {
//       type: attachment.mimeType,
//     });

//     setPreviewFile({
//       ...attachment,
//       url: URL.createObjectURL(blob),
//     });
//   };

//   return (
//     <div className="h-full flex flex-col bg-white">
//       <div className="flex items-center justify-between p-4 border-b">
//         <div className="flex items-center gap-3">
//           <h1 className="font-semibold text-lg">Notifications</h1>

//           <ShadButton
//             variant="ghost"
//             size="sm"
//             onClick={() => setFilterDrawerOpen(true)}
//           >
//             <SlidersHorizontal size={16} />
//           </ShadButton>
//         </div>

//         <div className="relative w-80">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//           <Input
//             className="pl-9"
//             placeholder="Search notifications"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 border-b bg-slate-50">
//         <input
//           type="checkbox"
//           checked={
//             filteredThreads.length > 0 &&
//             selectedRows.length === filteredThreads.length
//           }
//           onChange={(e) =>
//             setSelectedRows(
//               e.target.checked
//                 ? filteredThreads.map((t) => t._id)
//                 : []
//             )
//           }
//         />

//         <ShadButton variant="outline" size="sm">
//           Archive For Me
//         </ShadButton>

//         <span className="text-sm text-muted-foreground">
//           {selectedRows.length} selected
//         </span>
//       </div>

//       <div className="flex-1 overflow-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-100 sticky top-0">
//             <tr>
//               <th className="p-3 text-left"></th>
//               <th className="p-3 text-left">Notification</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Attachment</th>
//               <th className="p-3 text-center">Status</th>
//               <th className="p-3 text-center">Open</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredThreads.map((thread) => (
//               <tr
//                 key={thread._id}
//                 className="border-b hover:bg-slate-50"
//               >
//                 <td className="p-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedRows.includes(thread._id)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedRows((p) => [...p, thread._id]);
//                       } else {
//                         setSelectedRows((p) =>
//                           p.filter((id) => id !== thread._id)
//                         );
//                       }
//                     }}
//                   />
//                 </td>

//                 <td className="p-3">
               
//                   <div className="font-medium">
//   {renderLinkedSubject(thread.latest?.subject)}
// </div>
//                   <div className="text-xs text-gray-500">
//                     {getPreview(thread.latest?.body || "").slice(0, 100)}
//                   </div>
//                 </td>

//                 <td className="p-3">
//                   {new Date(
//                     thread.latest?.messageDate
//                   ).toLocaleString()}
//                 </td>

//                 <td className="p-3">
//                   {thread.latest?.attachments?.[0] ? (
//                     <button
//                       onClick={() =>
//                         openAttachment(thread.latest.attachments[0])
//                       }
//                       className="flex items-center gap-2 text-blue-600"
//                     >
//                       <Paperclip size={14} />
//                       {thread.latest.attachments[0].filename}
//                     </button>
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 <td className="p-3 text-center">
//                   {thread.latest?.isRead ? (
//                     <Check className="mx-auto text-green-600" size={16} />
//                   ) : (
//                     <button
//                       onClick={() => handleMarkAsRead(thread._id)}
//                       className="text-blue-600 text-xs"
//                     >
//                       Mark Read
//                     </button>
//                   )}
//                 </td>

//                 <td className="p-3 text-center">
//                   <button
//                     onClick={() => setSelectedThread(thread)}
//                   >
//                     <ExternalLink size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedThread && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
//           <div className="w-[700px] bg-white h-full overflow-auto">
//             <div className="flex justify-between items-center p-4 border-b">
//               {/* <h2 className="font-semibold">
//                 {cleanSubjectText(
//                   selectedThread.latest?.subject
//                 )}
//               </h2> */}
// <h2 className="font-semibold">
//   {renderLinkedSubject(selectedThread.latest?.subject)}
// </h2>
//               <div className="flex gap-2">
//                 <ShadButton
//                   variant="outline"
//                   size="sm"
//                   onClick={() =>
//                     handleArchiveThread(selectedThread._id)
//                   }
//                 >
//                   <Archive size={14} />
//                 </ShadButton>

//                 <ShadButton
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setSelectedThread(null)}
//                 >
//                   <X size={16} />
//                 </ShadButton>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               {selectedThread.messages?.map((msg) => (
//                 <div key={msg.messageId} className="border rounded-lg p-4">
//                   <div className="font-medium mb-3">{msg.from}</div>

//                   <div
//                     dangerouslySetInnerHTML={{ __html: msg.body }}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       <Sheet
//         open={filterDrawerOpen}
//         onOpenChange={setFilterDrawerOpen}
//       >
//         <SheetContent side="right">
//           <SheetHeader>
//             <SheetTitle>Filters</SheetTitle>
//           </SheetHeader>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }
// export default function InboxPlus() {
//   const [notifications, setNotifications] = useState([]);
//   const [archivedNotifications, setArchivedNotifications] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectedThread, setSelectedThread] = useState(null);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("inbox"); // "inbox" or "archived"
//   const { showToast } = useToastContext();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await authAPI.getEmailNotifications();
//       const allThreads = res?.data?.threads || [];
      
//       // Separate archived and non-archived
//       const archived = allThreads.filter(thread => thread.isArchived === true);
//       const inbox = allThreads.filter(thread => thread.isArchived !== true);
      
//       setNotifications(inbox);
//       setArchivedNotifications(archived);
//       console.log("Fetched threads:", { inbox, archived });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Get current view data
//   const currentData = viewMode === "inbox" ? notifications : archivedNotifications;

//   const filteredThreads = useMemo(() => {
//     return currentData.filter((thread) => {
//       if (!searchQuery.trim()) return true;
//       const q = searchQuery.toLowerCase();

//       return (
//         thread.latest?.subject?.toLowerCase().includes(q) ||
//         thread.latest?.from?.toLowerCase().includes(q) ||
//         thread.latest?.body?.toLowerCase().includes(q)
//       );
//     });
//   }, [currentData, searchQuery]);

//   const handleMarkAsRead = async (threadId) => {
//     const toastId = showToast({
//       title: "Processing...",
//       description: "Marking thread as read",
//       type: "loading",
//       duration: Infinity,
//     });

//     try {
//       await authAPI.markThreadAsRead(threadId);
      
//       setNotifications((prev) =>
//         prev.map((t) =>
//           t._id === threadId
//             ? {
//                 ...t,
//                 latest: { ...t.latest, isRead: true },
//               }
//             : t
//         )
//       );

//       showToast({
//         id: toastId,
//         title: "Success",
//         description: "Thread marked as read successfully",
//         type: "success",
//         duration: 3000,
//       });

//     } catch (e) {
//       console.error(e);
//       showToast({
//         id: toastId,
//         title: "Error",
//         description: "Failed to mark thread as read",
//         type: "error",
//         duration: 4000,
//       });
//     }
//   };

//   const handleArchiveThread = async (threadId) => {
//     try {
//       await authAPI.archiveThread(threadId);
      
//       // Find the thread being archived
//       const threadToArchive = notifications.find(t => t._id === threadId);
      
//       // Remove from inbox
//       setNotifications((prev) => prev.filter((t) => t._id !== threadId));
      
//       // Add to archived
//       if (threadToArchive) {
//         setArchivedNotifications((prev) => [
//           { ...threadToArchive, isArchived: true },
//           ...prev
//         ]);
//       }

//       setSelectedThread(null);

//       showToast({
//         title: "Success",
//         description: "Thread archived successfully",
//         type: "success",
//         duration: 3000,
//       });

//     } catch (e) {
//       console.error(e);
//       showToast({
//         title: "Error",
//         description: "Failed to archive thread. Please try again.",
//         type: "error",
//         duration: 4000,
//       });
//     }
//   };

//   const handleUnarchiveThread = async (threadId) => {
//     try {
//       await authAPI.unarchiveThread(threadId);
      
//       // Find the thread being unarchived
//       const threadToUnarchive = archivedNotifications.find(t => t._id === threadId);
      
//       // Remove from archived
//       setArchivedNotifications((prev) => prev.filter((t) => t._id !== threadId));
      
//       // Add to inbox
//       if (threadToUnarchive) {
//         setNotifications((prev) => [
//           { ...threadToUnarchive, isArchived: false },
//           ...prev
//         ]);
//       }

//       setSelectedThread(null);

//       showToast({
//         title: "Success",
//         description: "Thread restored to inbox",
//         type: "success",
//         duration: 3000,
//       });

//     } catch (e) {
//       console.error(e);
//       showToast({
//         title: "Error",
//         description: "Failed to unarchive thread. Please try again.",
//         type: "error",
//         duration: 4000,
//       });
//     }
//   };

//   const handleBulkArchive = async () => {
//     if (selectedRows.length === 0) {
//       showToast({
//         title: "No Selection",
//         description: "Please select at least one thread to archive",
//         type: "warning",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       const threadsToArchive = notifications.filter(t => selectedRows.includes(t._id));
      
//       // Archive all selected threads
//       await Promise.all(selectedRows.map(id => authAPI.archiveThread(id)));
      
//       // Update state
//       setNotifications((prev) => prev.filter((t) => !selectedRows.includes(t._id)));
//       setArchivedNotifications((prev) => [
//         ...threadsToArchive.map(t => ({ ...t, isArchived: true })),
//         ...prev
//       ]);
      
//       setSelectedRows([]);

//       showToast({
//         title: "Success",
//         description: `${selectedRows.length} thread(s) archived successfully`,
//         type: "success",
//         duration: 3000,
//       });

//     } catch (e) {
//       console.error(e);
//       showToast({
//         title: "Error",
//         description: "Failed to archive selected threads",
//         type: "error",
//         duration: 4000,
//       });
//     }
//   };

//   const handleBulkUnarchive = async () => {
//     if (selectedRows.length === 0) {
//       showToast({
//         title: "No Selection",
//         description: "Please select at least one thread to restore",
//         type: "warning",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       const threadsToUnarchive = archivedNotifications.filter(t => selectedRows.includes(t._id));
      
//       // Unarchive all selected threads
//       await Promise.all(selectedRows.map(id => authAPI.unarchiveThread(id)));
      
//       // Update state
//       setArchivedNotifications((prev) => prev.filter((t) => !selectedRows.includes(t._id)));
//       setNotifications((prev) => [
//         ...threadsToUnarchive.map(t => ({ ...t, isArchived: false })),
//         ...prev
//       ]);
      
//       setSelectedRows([]);

//       showToast({
//         title: "Success",
//         description: `${selectedRows.length} thread(s) restored successfully`,
//         type: "success",
//         duration: 3000,
//       });

//     } catch (e) {
//       console.error(e);
//       showToast({
//         title: "Error",
//         description: "Failed to restore selected threads",
//         type: "error",
//         duration: 4000,
//       });
//     }
//   };

//   const openAttachment = (attachment) => {
//     const byteCharacters = atob(attachment.data);
//     const byteNumbers = Array.from(byteCharacters).map((c) =>
//       c.charCodeAt(0)
//     );

//     const blob = new Blob([new Uint8Array(byteNumbers)], {
//       type: attachment.mimeType,
//     });

//     setPreviewFile({
//       ...attachment,
//       url: URL.createObjectURL(blob),
//     });
//   };

//   return (
//     <div className="h-full flex flex-col bg-white">
//       <div className="flex items-center justify-between p-4 border-b">
//         <div className="flex items-center gap-3">
//           <h1 className="font-semibold text-lg">
//             {viewMode === "inbox" ? "Notifications" : "Archived"}
//           </h1>

//           {/* View Toggle Buttons */}
//           <div className="flex items-center gap-1 ml-4 border rounded-md p-1 bg-gray-50">
//             <button
//               onClick={() => {
//                 setViewMode("inbox");
//                 setSelectedRows([]);
//               }}
//               className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                 viewMode === "inbox"
//                   ? "bg-white shadow-sm text-gray-900"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Inbox ({notifications.length})
//             </button>
//             <button
//               onClick={() => {
//                 setViewMode("archived");
//                 setSelectedRows([]);
//               }}
//               className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                 viewMode === "archived"
//                   ? "bg-white shadow-sm text-gray-900"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Archived ({archivedNotifications.length})
//             </button>
//           </div>

//           <ShadButton
//             variant="ghost"
//             size="sm"
//             onClick={() => setFilterDrawerOpen(true)}
//           >
//             <SlidersHorizontal size={16} />
//           </ShadButton>
//         </div>

//         <div className="relative w-80">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//           <Input
//             className="pl-9"
//             placeholder={`Search ${viewMode === "inbox" ? "notifications" : "archived"}`}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 border-b bg-slate-50">
//         <input
//           type="checkbox"
//           checked={
//             filteredThreads.length > 0 &&
//             selectedRows.length === filteredThreads.length
//           }
//           onChange={(e) =>
//             setSelectedRows(
//               e.target.checked
//                 ? filteredThreads.map((t) => t._id)
//                 : []
//             )
//           }
//         />

//         {viewMode === "inbox" ? (
//           <>
//             <ShadButton variant="outline" size="sm" onClick={handleBulkArchive}>
//               Archive Selected
//             </ShadButton>
//           </>
//         ) : (
//           <>
//             <ShadButton variant="outline" size="sm" onClick={handleBulkUnarchive}>
//               Restore to Inbox
//             </ShadButton>
//           </>
//         )}

//         <span className="text-sm text-muted-foreground">
//           {selectedRows.length} selected
//         </span>
//       </div>

//       <div className="flex-1 overflow-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-100 sticky top-0">
//             <tr>
//               <th className="p-3 text-left"></th>
//               <th className="p-3 text-left">Notification</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Attachment</th>
//               <th className="p-3 text-center">Status</th>
//               <th className="p-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredThreads.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="p-8 text-center text-gray-500">
//                   {viewMode === "inbox" 
//                     ? "No notifications found" 
//                     : "No archived notifications"}
//                 </td>
//               </tr>
//             ) : (
//               filteredThreads.map((thread) => (
//                 <tr
//                   key={thread._id}
//                   className="border-b hover:bg-slate-50"
//                 >
//                   <td className="p-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedRows.includes(thread._id)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedRows((p) => [...p, thread._id]);
//                         } else {
//                           setSelectedRows((p) =>
//                             p.filter((id) => id !== thread._id)
//                           );
//                         }
//                       }}
//                     />
//                   </td>

//                   <td className="p-3">
//                     <div className="font-medium">
//                       {renderLinkedSubject(thread.latest?.subject)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {getPreview(thread.latest?.body || "").slice(0, 100)}
//                     </div>
//                   </td>

//                   <td className="p-3">
//                     {new Date(
//                       thread.latest?.messageDate
//                     ).toLocaleString()}
//                   </td>

//                   <td className="p-3">
//                     {thread.latest?.attachments?.[0] ? (
//                       <button
//                         onClick={() =>
//                           openAttachment(thread.latest.attachments[0])
//                         }
//                         className="flex items-center gap-2 text-blue-600"
//                       >
//                         <Paperclip size={14} />
//                         {thread.latest.attachments[0].filename}
//                       </button>
//                     ) : (
//                       "-"
//                     )}
//                   </td>

//                   <td className="p-3 text-center">
//                     {thread.latest?.isRead ? (
//                       <Check className="mx-auto text-green-600" size={16} />
//                     ) : (
//                       <button
//                         onClick={() => handleMarkAsRead(thread._id)}
//                         className="text-blue-600 text-xs"
//                       >
//                         Mark Read
//                       </button>
//                     )}
//                   </td>

//                   <td className="p-3 text-center">
//                     <div className="flex items-center justify-center gap-2">
//                       <button
//                         onClick={() => setSelectedThread(thread)}
//                         className="text-gray-600 hover:text-gray-900"
//                         title="View Details"
//                       >
//                         <ExternalLink size={16} />
//                       </button>
                      
//                       {viewMode === "inbox" ? (
//                         <button
//                           onClick={() => handleArchiveThread(thread._id)}
//                           className="text-gray-600 hover:text-gray-900"
//                           title="Archive"
//                         >
//                           <Archive size={16} />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleUnarchiveThread(thread._id)}
//                           className="text-green-600 hover:text-green-800"
//                           title="Restore to Inbox"
//                         >
//                           <Undo2 size={16} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {selectedThread && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
//           <div className="w-[700px] bg-white h-full overflow-auto">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="font-semibold">
//                 {renderLinkedSubject(selectedThread.latest?.subject)}
//               </h2>
//               <div className="flex gap-2">
//                 {viewMode === "inbox" ? (
//                   <ShadButton
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleArchiveThread(selectedThread._id)}
//                   >
//                     <Archive size={14} />
//                   </ShadButton>
//                 ) : (
//                   <ShadButton
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleUnarchiveThread(selectedThread._id)}
//                     className="text-green-600"
//                   >
//                     <Undo2 size={14} />
//                   </ShadButton>
//                 )}

//                 <ShadButton
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setSelectedThread(null)}
//                 >
//                   <X size={16} />
//                 </ShadButton>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               {selectedThread.messages?.map((msg) => (
//                 <div key={msg.messageId} className="border rounded-lg p-4">
//                   <div className="font-medium mb-3">{msg.from}</div>
//                   <div
//                     dangerouslySetInnerHTML={{ __html: msg.body }}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       <Sheet
//         open={filterDrawerOpen}
//         onOpenChange={setFilterDrawerOpen}
//       >
//         <SheetContent side="right">
//           <SheetHeader>
//             <SheetTitle>Filters</SheetTitle>
//           </SheetHeader>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }