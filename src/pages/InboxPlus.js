// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Avatar as ShadAvatar, AvatarFallback } from "../components/ui/avatar";
// import { Button as ShadButton } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Badge } from "../components/ui/badge";
// import { Separator } from "../components/ui/separator";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
// import {
//   Search, SlidersHorizontal, Archive, ArchiveRestore,
//   ChevronDown, ChevronUp, Paperclip, X, Mail, CheckCheck,
//   Trash2, Reply, Send,
// } from "lucide-react";
// import { emailSyncAPI } from "../services/api"; // adjust path
// const hasMongoIdTag = (subject = "") => {
//   return /#([a-f0-9]{24})#/i.test(subject);
// };

// const AVATAR_COLORS = ["#00ACC1","#7C3AED","#16A34A","#DC2626","#D97706","#2563EB","#DB2777"];
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
//   if (days < 7) return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
//   return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
// };

// const EmailViewer = () => {
//   const [threads, setThreads] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedThreadId, setExpandedThreadId] = useState(null);
//   const [expandedMessageId, setExpandedMessageId] = useState(null);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
//   const [tab, setTab] = useState(0); // 0 = All, 1 = Unread
//   const [replyText, setReplyText] = useState("");
//   const [replyingToMessageId, setReplyingToMessageId] = useState(null);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [checkedItems, setCheckedItems] = useState({
//     invoice: false,
//     proposal: false,
//     document: false,
//     documentSigned: false,
//     message: false,
//     organizer: false,
//   });
//  /* ================= FILTER CONFIG ================= */

//   const FILTER_KEYWORDS = {
//     invoice: ["invoice"],
//     proposal: ["proposal"],
//     document: ["document"],
//     documentSigned: ["signed", "document signed"],
//     message: ["message"],
//     organizer: ["organizer"],
//   };

//   const matchesSelectedFilters = (subject = "") => {
//     const activeFilters = Object.keys(checkedItems).filter(
//       (key) => checkedItems[key]
//     );

//     if (activeFilters.length === 0) return true;

//     const lowerSubject = subject.toLowerCase();

//     return activeFilters.some((filterKey) =>
//       FILTER_KEYWORDS[filterKey]?.some((keyword) =>
//         lowerSubject.includes(keyword)
//       )
//     );
//   };
//   const toggleFilterDrawer = (open) => () => {
//     setFilterDrawerOpen(open);
//   };

//   const handleCheckboxChange = (e) => {
//     setCheckedItems({
//       ...checkedItems,
//       [e.target.name]: e.target.checked,
//     });
//   };
//   const handleClearAll = () => {
//     const cleared = Object.keys(checkedItems).reduce((acc, key) => {
//       acc[key] = false;
//       return acc;
//     }, {});
//     setCheckedItems(cleared);
//     setFilterDrawerOpen(false);
//   };

//   const openAttachment = (attachment) => {
//     const byteCharacters = atob(attachment.data);
//     const byteNumbers = new Array(byteCharacters.length);

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     const blob = new Blob([byteArray], { type: attachment.mimeType });

//     const url = URL.createObjectURL(blob);

//     setPreviewFile({
//       ...attachment,
//       url,
//     });
//   };

//   useEffect(() => {
//   fetchEmails();
// }, []);

// const fetchEmails = async () => {
//   try {
//     const response = await emailSyncAPI.getMessageNotifications();

//     setThreads(response.data.threads || []);

//     console.log("Fetched threads:", response.data.threads);
//   } catch (err) {
//     console.error("Error fetching emails:", err);
//   }
// };

//   const handleExpandThread = (threadId) => {
//     setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
//     setExpandedMessageId(null);
//   };

//   const handleExpandMessage = (messageId) => {
//     setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
//   };

//   const getPreview = (html) => {
//     return html.replace(/<[^>]*>?/gm, "");
//   };

//   const extractEmail = (from) => {
//     const match = from.match(/<(.+?)>/);
//     return match ? match[1] : from;
//   };

// const hasMongoIdTag = (subject = "") => {
//   return /#[a-f0-9]{24}\b/i.test(subject);
// };

// const extractMongoId = (subject = "") => {
//   const match = subject.match(/#([a-f0-9]{24})\b/i);
//   return match ? match[1] : null;
// };

// const cleanSubjectText = (subject = "") => {
//   return subject.replace(/#[a-f0-9]{24}\b/i, "").trim();
// };

//   const buildAccountLink = (mongoId) => {
//     return `/admin/clients/accounts/accountsdash/overview/${mongoId}`;
//   };
//   const markThreadAsRead = async (threadId) => {
//     try {
//       await axios.patch(
//         "https://www.snptaxes.com/emailsync/messagesList/threads/mark-read",
//         {
//           threadId,
//         },
//       );
//       fetchEmails(); // refresh UI
//     } catch (err) {
//       console.error("Mark read failed", err);
//     }
//   };

//   const archiveThread = async (threadId, archived) => {
//     try {
//       await axios.patch(
//         "https://www.snptaxes.com/emailsync/messagesList/threads/archive",
//         {
//           threadId,
//           archived,
//         },
//       );
//       fetchEmails(); // refresh UI
//     } catch (err) {
//       console.error("Archive failed", err);
//     }
//   };

//   const sendReply = async () => {
//     if (!replyText.trim() || !selectedThread) return;
//     try {
//       await axios.post("https://www.snptaxes.com/emailsync/user/reply", {
//         to: extractEmail(selectedThread.latest?.from || ""),
//         subject: selectedThread.latest?.subject || "No Subject",
//         message: replyText,
//       });
//       setReplyText("");
//     } catch (err) {
//       console.error("Reply failed", err);
//     }
//   };

//   // const filteredThreads = threads.filter((thread) => {
//   //   const isArchived = thread.latest?.archived;
//   //   return tab === 0 ? !isArchived : isArchived;
//   // });

//   const filteredThreads = threads
//     .filter((thread) => {
//       const isArchived = thread.latest?.archived;
//       const isUnread = !thread.latest?.read;
//       if (tab === 0) return !isArchived;
//       if (tab === 1) return !isArchived && isUnread;
//       return true;
//     })
//     .filter((thread) => {
//       if (matchesSelectedFilters(thread.latest?.subject)) return true;
//       return thread.messages?.some((msg) => matchesSelectedFilters(msg.subject));
//     })
//     .filter((thread) => {
//       if (!searchQuery.trim()) return true;
//       const q = searchQuery.toLowerCase();
//       const latest = thread.latest;
//       if (latest?.from?.toLowerCase().includes(q)) return true;
//       if (cleanSubjectText(latest?.subject || "").toLowerCase().includes(q)) return true;
//       if (getPreview(latest?.body || "").toLowerCase().includes(q)) return true;
//       return thread.messages?.some(
//         (msg) =>
//           msg.from?.toLowerCase().includes(q) ||
//           cleanSubjectText(msg.subject || "").toLowerCase().includes(q) ||
//           getPreview(msg.body || "").toLowerCase().includes(q)
//       );
//     });
//   const renderLinkedSubject = (subject, isBold = false) => {
//     const mongoId = extractMongoId(subject);
//     const text = cleanSubjectText(subject) || "linktext";

//     if (!mongoId) return subject || "(No Subject)";

//     return (
//       <a
//         href={buildAccountLink(mongoId)}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-primary font-medium no-underline"
//         style={{ fontWeight: isBold ? "bold" : "normal" }}
//       >
//         {text}
//       </a>
//     );
//   };

//   const selectedThread = threads.find((t) => t._id === expandedThreadId);

//   const unreadCount = threads.filter((t) => !t.latest?.read).length;

//   return (
//     <div className="flex h-full overflow-hidden bg-background">

//       {/* ══════════════════════════════════
//           PANEL 1 — Thread List
//       ══════════════════════════════════ */}
//       <div className="w-[300px] shrink-0 flex flex-col border-r border-border/40 h-full overflow-hidden bg-background">

//         {/* Header */}
//         <div className="px-4 pt-4 pb-0 shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <h1 className="text-[15px] font-semibold text-foreground tracking-tight">Inbox</h1>
//             <ShadButton
//               variant="ghost"
//               size="sm"
//               className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
//               onClick={toggleFilterDrawer(true)}
//             >
//               <SlidersHorizontal className="h-3.5 w-3.5" />
//             </ShadButton>
//           </div>

//           {/* Search */}
//           <div className="relative mb-3">
//             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
//             <Input
//               placeholder="Search…"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-8 h-8 text-[12px] rounded-md border-0 bg-muted/50 focus-visible:bg-muted focus-visible:ring-1 placeholder:text-muted-foreground/50"
//             />
//           </div>

//           {/* Tabs */}
//           <div className="flex border-b border-border/40 -mx-4 px-4">
//             {["All", "Unread"].map((label, i) => (
//               <button
//                 key={label}
//                 onClick={() => setTab(i)}
//                 className={`px-3 py-2 text-[12px] font-medium border-b-2 -mb-px transition-colors duration-150 ${
//                   tab === i
//                     ? "border-primary text-foreground"
//                     : "border-transparent text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 {label}
//                 {i === 1 && unreadCount > 0 && (
//                   <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Thread rows */}
//         <div className="flex-1 overflow-y-auto">
//           {filteredThreads.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 gap-2">
//               <Mail className="h-8 w-8 text-muted-foreground/20" />
//               <p className="text-[12px] text-muted-foreground">No emails found</p>
//             </div>
//           ) : (
//             filteredThreads.map((thread) => {
//               const latest = thread.latest;
//               const isSelected = expandedThreadId === thread._id;
//               const isUnread = !latest?.read;

//               return (
//                 <div
//                   key={thread._id}
//                   onClick={() => { handleExpandThread(thread._id); setReplyingToMessageId(null); }}
//                   className={`group flex items-start gap-2.5 px-4 py-2.5 cursor-pointer transition-colors duration-150 ${
//                     isSelected ? "bg-muted" : "hover:bg-muted/40"
//                   }`}
//                 >
//                   {/* Unread dot */}
//                   <div className="shrink-0 mt-[7px]">
//                     <div className={`h-1.5 w-1.5 rounded-full transition-colors ${
//                       isUnread ? "bg-primary" : "bg-transparent"
//                     }`} />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     {/* Sender + time */}
//                     <div className="flex items-baseline justify-between gap-2">
//                       <span className={`text-[12.5px] truncate ${
//                         isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/70"
//                       }`}>
//                         {latest?.from?.replace(/<.*?>/g, "").trim() || "Unknown"}
//                       </span>
//                       <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
//                         {getRelativeTime(latest?.createdAt)}
//                       </span>
//                     </div>
//                     {/* Subject */}
//                     <div className={`text-[12px] truncate ${
//                       isUnread ? "font-semibold text-foreground" : "font-normal text-muted-foreground"
//                     }`}>
//                       {cleanSubjectText(latest?.subject || "") || "(No Subject)"}
//                     </div>
//                     {/* Preview */}
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

//       {/* ══════════════════════════════════
//           PANEL 2 — Email Content
//       ══════════════════════════════════ */}
//       <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
//         {selectedThread ? (
//           <>
//             {/* Content header: subject left, actions right */}
//             <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0 gap-4">
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-[15px] font-semibold text-foreground leading-tight truncate">
//                   {renderLinkedSubject(selectedThread.latest?.subject, true)}
//                 </h2>
//                 <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
//                   {selectedThread.messages.length} message{selectedThread.messages.length !== 1 ? "s" : ""}
//                   {" · "}
//                   {selectedThread.latest?.from?.replace(/<.*?>/g, "").trim()}
//                 </p>
//               </div>
//               <div className="flex items-center gap-1 shrink-0">
//                 {!selectedThread.latest?.read && (
//                   <ShadButton
//                     variant="ghost"
//                     size="sm"
//                     className="h-7 px-2.5 text-[11.5px] rounded-md gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
//                     onClick={(e) => { e.stopPropagation(); markThreadAsRead(expandedThreadId); }}
//                   >
//                     <CheckCheck className="h-3.5 w-3.5" />
//                     Mark read
//                   </ShadButton>
//                 )}
//                 <ShadButton
//                   variant="ghost"
//                   size="sm"
//                   className="h-7 px-2.5 text-[11.5px] rounded-md gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
//                   onClick={(e) => { e.stopPropagation(); archiveThread(expandedThreadId, !selectedThread.latest?.archived); }}
//                 >
//                   {selectedThread.latest?.archived
//                     ? <><ArchiveRestore className="h-3.5 w-3.5" /> Unarchive</>
//                     : <><Archive className="h-3.5 w-3.5" /> Archive</>
//                   }
//                 </ShadButton>
//                 <ShadButton
//                   variant="ghost"
//                   size="sm"
//                   className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
//                   onClick={() => handleExpandThread(expandedThreadId)}
//                 >
//                   <X className="h-3.5 w-3.5" />
//                 </ShadButton>
//               </div>
//             </div>

//             {/* ── Scrollable messages ── */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="px-6 py-4">
//                 {[...selectedThread.messages]
//                   .sort((a, b) => {
//                     const aTagged = hasMongoIdTag(a.subject);
//                     const bTagged = hasMongoIdTag(b.subject);
//                     if (aTagged && !bTagged) return -1;
//                     if (!aTagged && bTagged) return 1;
//                     return 0;
//                   })
//                   .map((email, idx, arr) => {
//                     const isExpanded = expandedMessageId === email.messageId;
//                     const emailAvatarBg = getAvatarColor(email.from || "");
//                     const emailInitials = getInitialsFromStr(email.from || "");

//                     return (
//                       <div
//                         key={email.messageId}
//                         className={`${idx < arr.length - 1 ? "border-b border-border/40" : ""}`}
//                       >
//                         {/* Collapsed row */}
//                         <div
//                           onClick={() => handleExpandMessage(email.messageId)}
//                           className={`flex items-start gap-3 py-3 cursor-pointer transition-colors duration-100 rounded-md ${
//                             isExpanded ? "" : "hover:bg-muted/40"
//                           }`}
//                         >
//                           <ShadAvatar className="h-8 w-8 shrink-0">
//                             <AvatarFallback style={{ backgroundColor: emailAvatarBg }} className="text-white text-[10px] font-bold">
//                               {emailInitials}
//                             </AvatarFallback>
//                           </ShadAvatar>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-baseline justify-between">
//                               <span className="text-[13px] font-semibold text-foreground">
//                                 {email.from?.replace(/<.*?>/g, "").trim()}
//                               </span>
//                               <div className="flex items-center gap-1.5 shrink-0 ml-3">
//                                 <span className="text-[11px] text-muted-foreground tabular-nums">
//                                   {new Date(email.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
//                                 </span>
//                                 {isExpanded
//                                   ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
//                                   : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
//                                 }
//                               </div>
//                             </div>
//                             {!isExpanded && (
//                               <p className="text-[12px] text-muted-foreground truncate mt-0.5">
//                                 {getPreview(email.body || "").slice(0, 120)}
//                               </p>
//                             )}
//                           </div>
//                         </div>

//                         {/* Expanded body */}
//                         {isExpanded && (
//                           <div className="ml-11 pb-4">
//                             {email.subject && hasMongoIdTag(email.subject) && (
//                               <div className="mb-3 text-[12.5px] font-semibold">
//                                 {renderLinkedSubject(email.subject, true)}
//                               </div>
//                             )}
//                             <div
//                               className="text-[13px] leading-6 text-foreground break-words [&_p]:mb-3 [&_a]:text-primary [&_a]:underline"
//                               dangerouslySetInnerHTML={{ __html: email.body }}
//                             />

//                             {/* Attachments */}
//                             {email.attachments?.length > 0 && (
//                               <div className="mt-4 pt-3 border-t border-border/40">
//                                 <p className="flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
//                                   <Paperclip className="h-2.5 w-2.5" />
//                                   {email.attachments.length} Attachment{email.attachments.length > 1 ? "s" : ""}
//                                 </p>
//                                 <div className="flex flex-wrap gap-1.5">
//                                   {email.attachments.map((att, i) => (
//                                     <button
//                                       key={i}
//                                       type="button"
//                                       onClick={(e) => { e.stopPropagation(); openAttachment(att); }}
//                                       className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/60 bg-muted/30 hover:bg-muted hover:border-border transition-colors text-left"
//                                     >
//                                       <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
//                                       <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">{att.filename}</span>
//                                       <span className="text-[10px] text-muted-foreground shrink-0">
//                                         {Math.round((att.data.length * 3) / 4 / 1024)} KB
//                                       </span>
//                                     </button>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}

//                             {/* Per-email reply */}
//                             {replyingToMessageId === email.messageId ? (
//                               <div className="mt-3 rounded-lg border border-border bg-muted/20 overflow-hidden">
//                                 <textarea
//                                   autoFocus
//                                   placeholder={`Reply to ${email.from?.replace(/<.*?>/g, "").trim()}…`}
//                                   value={replyText}
//                                   onChange={(e) => setReplyText(e.target.value)}
//                                   rows={3}
//                                   className="w-full bg-transparent px-4 pt-3 pb-1 text-[13px] text-foreground resize-none outline-none placeholder:text-muted-foreground/50"
//                                 />
//                                 <div className="flex items-center justify-between px-3 py-2 border-t border-border/40">
//                                   <ShadButton variant="ghost" size="sm" className="h-7 text-[11.5px] rounded-md text-muted-foreground hover:text-foreground" onClick={() => { setReplyingToMessageId(null); setReplyText(""); }}>
//                                     Cancel
//                                   </ShadButton>
//                                   <ShadButton size="sm" className="h-7 px-4 text-[12px] rounded-md gap-1.5 font-medium" onClick={() => { sendReply(); setReplyingToMessageId(null); }}>
//                                     <Send className="h-3.5 w-3.5" /> Send
//                                   </ShadButton>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="mt-3">
//                                 <ShadButton variant="outline" size="sm" className="h-7 px-3 text-[12px] rounded-md gap-1.5" onClick={() => { setReplyingToMessageId(email.messageId); setReplyText(""); }}>
//                                   <Reply className="h-3.5 w-3.5" /> Reply
//                                 </ShadButton>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>

//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center gap-2">
//             <Mail className="h-8 w-8 text-muted-foreground/20" />
//             <p className="text-[13px] font-medium text-foreground/60">Select a thread to read</p>
//           </div>
//         )}
//       </div>

//       {/* ── Attachment preview modal ── */}
//       {previewFile && (
//         <div
//           onClick={() => setPreviewFile(null)}
//           className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/65 backdrop-blur-sm"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-card rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border"
//             style={{ width: "85%", height: "90%" }}
//           >
//             <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
//               <span className="text-[13px] font-semibold text-foreground">{previewFile.filename}</span>
//               <ShadButton variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg" onClick={() => setPreviewFile(null)}>
//                 <X className="h-4 w-4" />
//               </ShadButton>
//             </div>
//             <div className="flex-1 overflow-hidden">
//               {previewFile.mimeType.startsWith("image/") && (
//                 <img src={previewFile.url} alt={previewFile.filename} className="w-full h-full object-contain" />
//               )}
//               {!previewFile.mimeType.startsWith("image/") && (
//                 <iframe src={previewFile.url} className="w-full h-full border-none" title="File Preview" />
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Filter Sheet ── */}
//       <Sheet open={filterDrawerOpen} onOpenChange={(o) => !o && setFilterDrawerOpen(false)}>
//         <SheetContent side="right" className="p-0 flex flex-col [&>button]:hidden w-[280px]">
//           <SheetHeader className="flex flex-row items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
//             <SheetTitle className="flex items-center gap-2 text-[13.5px] font-semibold">
//               <SlidersHorizontal className="h-4 w-4 text-primary" />
//               Filter emails
//             </SheetTitle>
//             <ShadButton variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg text-muted-foreground" onClick={() => setFilterDrawerOpen(false)}>
//               <X className="h-3.5 w-3.5" />
//             </ShadButton>
//           </SheetHeader>

//           <div className="flex-1 overflow-y-auto px-5 py-4">
//             <p className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Email Type</p>
//             <div className="space-y-0.5">
//               {Object.keys(checkedItems).map((key) => (
//                 <label
//                   key={key}
//                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-[13px] transition-colors ${
//                     checkedItems[key] ? "bg-primary/6 text-foreground" : "text-foreground hover:bg-muted/60"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     name={key}
//                     checked={checkedItems[key]}
//                     onChange={handleCheckboxChange}
//                     className="accent-primary h-3.5 w-3.5 shrink-0"
//                   />
//                   <span className={checkedItems[key] ? "font-semibold" : "font-normal"}>
//                     {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="border-t border-border px-5 py-3.5 flex justify-end gap-2 shrink-0">
//             <ShadButton variant="outline" size="sm" className="h-8 px-4 text-[12px] rounded-lg" onClick={handleClearAll}>
//               Clear all
//             </ShadButton>
//             <ShadButton size="sm" className="h-8 px-4 text-[12px] rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground" onClick={toggleFilterDrawer(false)}>
//               Apply
//             </ShadButton>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// };

// export default EmailViewer;

// import React, {
//   useEffect,
//   useState,
//   useMemo,
// } from "react";

// import {
//   Search,
//   Bell,
//   Mail,
//   ChevronDown,
//   ChevronUp,
//   Paperclip,
//   Reply,
//   Send,
//   X,
//   SlidersHorizontal,
//   Archive,
//   ArchiveRestore,
//   CheckCheck,
// } from "lucide-react";

// import {
//   Avatar as ShadAvatar,
//   AvatarFallback,
// } from "../components/ui/avatar";

// import { Button as ShadButton } from "../components/ui/button";

// import { Input } from "../components/ui/input";

// import {
//   Badge,
// } from "../components/ui/badge";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "../components/ui/sheet";

// import { Separator } from "../components/ui/separator";

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

// const getAvatarColor = (
//   str = ""
// ) => {
//   const hash = str
//     .split("")
//     .reduce(
//       (acc, c) =>
//         acc + c.charCodeAt(0),
//       0
//     );

//   return AVATAR_COLORS[
//     hash % AVATAR_COLORS.length
//   ];
// };

// const getInitialsFromStr = (
//   str = ""
// ) => {
//   const clean = str
//     .replace(/<.*?>/g, "")
//     .trim();

//   const parts =
//     clean.split(/[\s@]+/);

//   return (
//     (parts[0]?.[0] || "?") +
//     (parts[1]?.[0] || "")
//   ).toUpperCase();
// };

// const getRelativeTime = (
//   dateStr
// ) => {
//   if (!dateStr) return "";

//   const diff =
//     Date.now() -
//     new Date(dateStr);

//   const mins = Math.floor(
//     diff / 60000
//   );

//   if (mins < 1) return "Now";

//   if (mins < 60)
//     return `${mins}m`;

//   const hrs = Math.floor(
//     mins / 60
//   );

//   if (hrs < 24)
//     return `${hrs}h`;

//   const days = Math.floor(
//     hrs / 24
//   );

//   if (days < 7) {
//     return new Date(
//       dateStr
//     ).toLocaleDateString(
//       "en-US",
//       {
//         weekday: "short",
//       }
//     );
//   }

//   return new Date(
//     dateStr
//   ).toLocaleDateString(
//     "en-US",
//     {
//       month: "short",
//       day: "numeric",
//     }
//   );
// };

// const extractMongoId = (
//   subject = ""
// ) => {
//   const match =
//     subject.match(
//       /#([a-f0-9]{24})\b/i
//     );

//   return match
//     ? match[1]
//     : null;
// };

// const cleanSubjectText = (
//   subject = ""
// ) => {
//   return subject
//     .replace(
//       /#[a-f0-9]{24}\b/i,
//       ""
//     )
//     .trim();
// };

// const buildAccountLink = (
//   mongoId
// ) => {
//   return `/admin/clients/accounts/accountsdash/overview/${mongoId}`;
// };

// const extractEmail = (
//   from = ""
// ) => {
//   const match =
//     from.match(/<(.+?)>/);

//   return match
//     ? match[1]
//     : from;
// };

// const getPreview = (
//   html = ""
// ) => {
//   return html.replace(
//     /<[^>]*>?/gm,
//     ""
//   );
// };

// const EmailViewer = () => {
//   const [
//     notifications,
//     setNotifications,
//   ] = useState([]);

//   const [
//     communications,
//     setCommunications,
//   ] = useState([]);

//   const [tab, setTab] =
//     useState("communications");

//   const [
//     searchQuery,
//     setSearchQuery,
//   ] = useState("");

//   const [
//     expandedThreadId,
//     setExpandedThreadId,
//   ] = useState(null);

//   const [
//     expandedMessageId,
//     setExpandedMessageId,
//   ] = useState(null);

//   const [
//     replyText,
//     setReplyText,
//   ] = useState("");

//   const [
//     replyingToMessageId,
//     setReplyingToMessageId,
//   ] = useState(null);

//   const [
//     previewFile,
//     setPreviewFile,
//   ] = useState(null);

//   const [
//     filterDrawerOpen,
//     setFilterDrawerOpen,
//   ] = useState(false);

//   const [
//     checkedItems,
//     setCheckedItems,
//   ] = useState({
//     invoice: false,
//     proposal: false,
//     document: false,
//     organizer: false,
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//  const fetchData = async () => {
//   try {

//     // ✅ USE NEW EMAIL SYNC APIs

//     const [
//       notificationsRes,
//       communicationsRes,
//     ] = await Promise.all([
//       authAPI.getEmailNotifications(),
//       authAPI.getEmailCommunications(),
//     ]);

//     setNotifications(
//       notificationsRes?.data?.threads || []
//     );
//     console.log("setNotifications",notificationsRes?.data)

//     setCommunications(
//       communicationsRes?.data?.threads || []
//     );

//   } catch (error) {

//     console.log(
//       "EMAIL FETCH ERROR:",
//       error
//     );

//   }
// };

//   const currentThreads =
//     tab === "notifications"
//       ? notifications
//       : communications;

//   const unreadCount =
//     currentThreads.filter(
//       (t) => !t.latest?.isRead
//     ).length;

//   const filteredThreads =
//     currentThreads
//       .filter((thread) => {
//         if (
//           !searchQuery.trim()
//         )
//           return true;

//         const q =
//           searchQuery.toLowerCase();

//         return (
//           thread.latest?.from
//             ?.toLowerCase()
//             .includes(q) ||
//           thread.latest?.subject
//             ?.toLowerCase()
//             .includes(q) ||
//           thread.latest?.body
//             ?.toLowerCase()
//             .includes(q)
//         );
//       });

//   const selectedThread =
//     currentThreads.find(
//       (t) =>
//         t._id ===
//         expandedThreadId
//     );

//   const handleExpandThread = (
//     threadId
//   ) => {
//     setExpandedThreadId(
//       expandedThreadId ===
//         threadId
//         ? null
//         : threadId
//     );

//     setExpandedMessageId(
//       null
//     );
//   };

//   const handleExpandMessage =
//     (messageId) => {
//       setExpandedMessageId(
//         expandedMessageId ===
//           messageId
//           ? null
//           : messageId
//       );
//     };

//   const openAttachment = (
//     attachment
//   ) => {
//     const byteCharacters =
//       atob(attachment.data);

//     const byteNumbers =
//       new Array(
//         byteCharacters.length
//       );

//     for (
//       let i = 0;
//       i <
//       byteCharacters.length;
//       i++
//     ) {
//       byteNumbers[i] =
//         byteCharacters.charCodeAt(
//           i
//         );
//     }

//     const byteArray =
//       new Uint8Array(
//         byteNumbers
//       );

//     const blob = new Blob(
//       [byteArray],
//       {
//         type: attachment.mimeType,
//       }
//     );

//     const url =
//       URL.createObjectURL(
//         blob
//       );

//     setPreviewFile({
//       ...attachment,
//       url,
//     });
//   };

//   const sendReply =
//     async () => {
//       if (
//         !replyText.trim() ||
//         !selectedThread
//       )
//         return;

//       try {

//         await emailSyncAPI.replyEmail(
//           {
//             to: extractEmail(
//               selectedThread
//                 ?.latest
//                 ?.from || ""
//             ),

//             subject:
//               selectedThread
//                 ?.latest
//                 ?.subject ||
//               "No Subject",

//             message:
//               replyText,
//           }
//         );

//         setReplyText("");

//       } catch (error) {

//         console.log(error);

//       }
//     };

//   const renderLinkedSubject =
//     (
//       subject,
//       isBold = false
//     ) => {

//       const mongoId =
//         extractMongoId(
//           subject
//         );

//       const text =
//         cleanSubjectText(
//           subject
//         ) || "(No Subject)";

//       if (!mongoId) {
//         return text;
//       }

//       return (
//         <a
//           href={buildAccountLink(
//             mongoId
//           )}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-primary font-medium no-underline"
//           style={{
//             fontWeight:
//               isBold
//                 ? "bold"
//                 : "normal",
//           }}
//         >
//           {text}
//         </a>
//       );
//     };

//   return (
//     <div className="flex h-full overflow-hidden bg-background">

//       {/* LEFT PANEL */}

//       <div className="w-[320px] border-r border-border flex flex-col bg-background">

//         {/* HEADER */}

//         <div className="p-4 border-b border-border">

//           <div className="flex items-center justify-between mb-4">

//             <h1 className="text-lg font-semibold">
//               Emails
//             </h1>

//             <Badge variant="secondary">
//               {unreadCount}
//             </Badge>

//           </div>

//           {/* TABS */}

//           <div className="flex gap-2 mb-3">

//             <ShadButton
//               variant={
//                 tab ===
//                 "communications"
//                   ? "default"
//                   : "outline"
//               }
//               size="sm"
//               onClick={() =>
//                 setTab(
//                   "communications"
//                 )
//               }
//               className="flex-1"
//             >
//               <Mail className="h-4 w-4 mr-2" />
//               Communications
//             </ShadButton>

//             <ShadButton
//               variant={
//                 tab ===
//                 "notifications"
//                   ? "default"
//                   : "outline"
//               }
//               size="sm"
//               onClick={() =>
//                 setTab(
//                   "notifications"
//                 )
//               }
//               className="flex-1"
//             >
//               <Bell className="h-4 w-4 mr-2" />
//               Notifications
//             </ShadButton>

//           </div>

//           {/* SEARCH */}

//           <div className="relative">

//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

//             <Input
//               placeholder="Search emails..."
//               value={
//                 searchQuery
//               }
//               onChange={(e) =>
//                 setSearchQuery(
//                   e.target.value
//                 )
//               }
//               className="pl-9"
//             />

//           </div>

//         </div>

//         {/* THREADS */}

//         <div className="flex-1 overflow-y-auto">

//           {filteredThreads.map(
//             (thread) => {

//               const latest =
//                 thread.latest;

//               const isSelected =
//                 expandedThreadId ===
//                 thread._id;

//               return (
//                 <div
//                   key={thread._id}
//                   onClick={() =>
//                     handleExpandThread(
//                       thread._id
//                     )
//                   }
//                   className={`px-4 py-3 border-b border-border cursor-pointer transition-colors ${
//                     isSelected
//                       ? "bg-muted"
//                       : "hover:bg-muted/40"
//                   }`}
//                 >

//                   <div className="flex gap-3">

//                     <ShadAvatar className="h-9 w-9">

//                       <AvatarFallback
//                         style={{
//                           backgroundColor:
//                             getAvatarColor(
//                               latest?.from
//                             ),
//                         }}
//                         className="text-white font-semibold"
//                       >
//                         {getInitialsFromStr(
//                           latest?.from
//                         )}
//                       </AvatarFallback>

//                     </ShadAvatar>

//                     <div className="flex-1 min-w-0">

//                       <div className="flex justify-between items-start gap-2">

//                         <p className="font-medium text-sm truncate">
//                           {latest?.from
//                             ?.replace(
//                               /<.*?>/g,
//                               ""
//                             )
//                             .trim()}
//                         </p>

//                         <span className="text-xs text-muted-foreground whitespace-nowrap">
//                           {getRelativeTime(
//                             latest?.messageDate
//                           )}
//                         </span>

//                       </div>

//                       <div className="text-sm font-medium truncate mt-1">
//                         {cleanSubjectText(
//                           latest?.subject
//                         )}
//                       </div>

//                       <div className="text-xs text-muted-foreground truncate mt-1">
//                         {getPreview(
//                           latest?.body
//                         ).slice(
//                           0,
//                           80
//                         )}
//                       </div>

//                     </div>

//                   </div>

//                 </div>
//               );
//             }
//           )}

//         </div>

//       </div>

//       {/* RIGHT PANEL */}

//       <div className="flex-1 flex flex-col overflow-hidden">

//         {!selectedThread ? (

//           <div className="flex-1 flex flex-col items-center justify-center">

//             <Mail className="h-10 w-10 text-muted-foreground/30 mb-3" />

//             <p className="text-muted-foreground">
//               Select a thread
//             </p>

//           </div>

//         ) : (

//           <>

//             {/* HEADER */}

//             <div className="px-6 py-4 border-b border-border">

//               <h2 className="text-lg font-semibold">
//                 {renderLinkedSubject(
//                   selectedThread
//                     ?.latest
//                     ?.subject,
//                   true
//                 )}
//               </h2>

//               <p className="text-sm text-muted-foreground mt-1">
//                 {
//                   selectedThread
//                     ?.messages
//                     ?.length
//                 }{" "}
//                 messages
//               </p>

//             </div>

//             {/* MESSAGES */}

//             <div className="flex-1 overflow-y-auto px-6 py-4">

//               {selectedThread?.messages?.map(
//                 (email) => {

//                   const isExpanded =
//                     expandedMessageId ===
//                     email.messageId;

//                   return (
//                     <div
//                       key={
//                         email.messageId
//                       }
//                       className="border-b border-border py-4"
//                     >

//                       {/* MESSAGE HEADER */}

//                       <div
//                         onClick={() =>
//                           handleExpandMessage(
//                             email.messageId
//                           )
//                         }
//                         className="flex items-start gap-3 cursor-pointer"
//                       >

//                         <ShadAvatar className="h-10 w-10">

//                           <AvatarFallback
//                             style={{
//                               backgroundColor:
//                                 getAvatarColor(
//                                   email.from
//                                 ),
//                             }}
//                             className="text-white"
//                           >
//                             {getInitialsFromStr(
//                               email.from
//                             )}
//                           </AvatarFallback>

//                         </ShadAvatar>

//                         <div className="flex-1">

//                           <div className="flex justify-between">

//                             <div>

//                               <p className="font-semibold text-sm">
//                                 {email.from
//                                   ?.replace(
//                                     /<.*?>/g,
//                                     ""
//                                   )
//                                   .trim()}
//                               </p>

//                               <p className="text-xs text-muted-foreground">
//                                 {new Date(
//                                   email.messageDate
//                                 ).toLocaleString()}
//                               </p>

//                             </div>

//                             {isExpanded ? (
//                               <ChevronUp className="h-4 w-4 text-muted-foreground" />
//                             ) : (
//                               <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                             )}

//                           </div>

//                           {!isExpanded && (
//                             <div className="text-sm text-muted-foreground mt-2 truncate">
//                               {getPreview(
//                                 email.body
//                               ).slice(
//                                 0,
//                                 150
//                               )}
//                             </div>
//                           )}

//                         </div>

//                       </div>

//                       {/* BODY */}

//                       {isExpanded && (

//                         <div className="ml-13 mt-4">

//                           <div
//                             className="prose prose-sm max-w-none"
//                             dangerouslySetInnerHTML={{
//                               __html:
//                                 email.body,
//                             }}
//                           />

//                           {/* ATTACHMENTS */}

//                           {email
//                             ?.attachments
//                             ?.length >
//                             0 && (

//                             <div className="mt-4 flex flex-wrap gap-2">

//                               {email.attachments.map(
//                                 (
//                                   att,
//                                   i
//                                 ) => (

//                                   <button
//                                     key={
//                                       i
//                                     }
//                                     onClick={() =>
//                                       openAttachment(
//                                         att
//                                       )
//                                     }
//                                     className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted"
//                                   >

//                                     <Paperclip className="h-4 w-4" />

//                                     <span className="text-sm">
//                                       {
//                                         att.filename
//                                       }
//                                     </span>

//                                   </button>

//                                 )
//                               )}

//                             </div>

//                           )}

//                           {/* REPLY */}

//                           {replyingToMessageId ===
//                           email.messageId ? (

//                             <div className="mt-4 border rounded-xl overflow-hidden">

//                               <textarea
//                                 rows={4}
//                                 value={
//                                   replyText
//                                 }
//                                 onChange={(
//                                   e
//                                 ) =>
//                                   setReplyText(
//                                     e
//                                       .target
//                                       .value
//                                   )
//                                 }
//                                 placeholder="Write reply..."
//                                 className="w-full p-4 outline-none resize-none bg-transparent"
//                               />

//                               <div className="flex justify-end gap-2 p-3 border-t">

//                                 <ShadButton
//                                   variant="outline"
//                                   onClick={() => {
//                                     setReplyingToMessageId(
//                                       null
//                                     );

//                                     setReplyText(
//                                       ""
//                                     );
//                                   }}
//                                 >
//                                   Cancel
//                                 </ShadButton>

//                                 <ShadButton
//                                   onClick={() => {
//                                     sendReply();

//                                     setReplyingToMessageId(
//                                       null
//                                     );
//                                   }}
//                                 >
//                                   <Send className="h-4 w-4 mr-2" />
//                                   Send
//                                 </ShadButton>

//                               </div>

//                             </div>

//                           ) : (

//                             <div className="mt-4">

//                               <ShadButton
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   setReplyingToMessageId(
//                                     email.messageId
//                                   )
//                                 }
//                               >
//                                 <Reply className="h-4 w-4 mr-2" />
//                                 Reply
//                               </ShadButton>

//                             </div>

//                           )}

//                         </div>

//                       )}

//                     </div>
//                   );
//                 }
//               )}

//             </div>

//           </>

//         )}

//       </div>

//       {/* FILE PREVIEW */}

//       {previewFile && (

//         <div
//           className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
//           onClick={() =>
//             setPreviewFile(
//               null
//             )
//           }
//         >

//           <div
//             className="bg-background rounded-xl overflow-hidden w-[90%] h-[90%]"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             <div className="flex justify-between items-center px-4 py-3 border-b">

//               <p className="font-medium">
//                 {
//                   previewFile.filename
//                 }
//               </p>

//               <ShadButton
//                 variant="ghost"
//                 size="icon"
//                 onClick={() =>
//                   setPreviewFile(
//                     null
//                   )
//                 }
//               >
//                 <X className="h-4 w-4" />
//               </ShadButton>

//             </div>

//             <div className="h-full">

//               {previewFile.mimeType.startsWith(
//                 "image/"
//               ) ? (

//                 <img
//                   src={
//                     previewFile.url
//                   }
//                   alt={
//                     previewFile.filename
//                   }
//                   className="w-full h-full object-contain"
//                 />

//               ) : (

//                 <iframe
//                   src={
//                     previewFile.url
//                   }
//                   title="preview"
//                   className="w-full h-full"
//                 />

//               )}

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// export default EmailViewer;

import React, { useEffect, useState } from "react";
import {
  Archive,
  Check,
} from "lucide-react";
import {
  Search,
  Mail,
  ChevronDown,
  ChevronUp,
  Paperclip,

  X,
  SlidersHorizontal,
} from "lucide-react";

import { Avatar as ShadAvatar, AvatarFallback } from "../components/ui/avatar";

import { Button as ShadButton } from "../components/ui/button";

import { Input } from "../components/ui/input";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";

import { authAPI, emailSyncAPI } from "../services/api";

const AVATAR_COLORS = [
  "#00ACC1",
  "#7C3AED",
  "#16A34A",
  "#DC2626",
  "#D97706",
  "#2563EB",
  "#DB2777",
];

const getAvatarColor = (str = "") => {
  const hash = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const getInitialsFromStr = (str = "") => {
  const clean = str.replace(/<.*?>/g, "").trim();

  const parts = clean.split(/[\s@]+/);

  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return "";

  const diff = Date.now() - new Date(dateStr);

  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Now";

  if (mins < 60) return `${mins}m`;

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) return `${hrs}h`;

  const days = Math.floor(hrs / 24);

  if (days < 7) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const extractMongoId = (subject = "") => {
  const match = subject.match(/#([a-f0-9]{24})\b/i);

  return match ? match[1] : null;
};

const cleanSubjectText = (subject = "") => {
  return subject.replace(/#[a-f0-9]{24}\b/i, "").trim();
};

const buildAccountLink = (mongoId) => {
  return `/admin/clients/accounts/accountsdash/overview/${mongoId}`;
};

const extractEmail = (from = "") => {
  const match = from.match(/<(.+?)>/);

  return match ? match[1] : from;
};

const getPreview = (html = "") => {
  return html.replace(/<[^>]*>?/gm, "");
};

const EmailViewer = () => {
  const [notifications, setNotifications] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [expandedThreadId, setExpandedThreadId] = useState(null);

  const [expandedMessageId, setExpandedMessageId] = useState(null);

  const [replyText, setReplyText] = useState("");

  const [replyingToMessageId, setReplyingToMessageId] = useState(null);

  const [previewFile, setPreviewFile] = useState(null);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [checkedItems, setCheckedItems] = useState({
    invoice: false,
    proposal: false,
    document: false,
    organizer: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const notificationsRes = await authAPI.getEmailNotifications();

      setNotifications(notificationsRes?.data?.threads || []);
      console.log("setNotifications", notificationsRes?.data);
    } catch (error) {
      console.log("EMAIL FETCH ERROR:", error);
    }
  };

  const currentThreads = notifications;

  const unreadCount = currentThreads.filter((t) => !t.latest?.isRead).length;

  const filteredThreads = currentThreads.filter((thread) => {
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();

    return (
      thread.latest?.from?.toLowerCase().includes(q) ||
      thread.latest?.subject?.toLowerCase().includes(q) ||
      thread.latest?.body?.toLowerCase().includes(q)
    );
  });

  const selectedThread = currentThreads.find((t) => t._id === expandedThreadId);

  // const handleExpandThread = (threadId) => {
  //   setExpandedThreadId(expandedThreadId === threadId ? null : threadId);

  //   setExpandedMessageId(null);
  // };
const handleExpandThread =
  async (threadId) => {

    setExpandedThreadId(
      expandedThreadId ===
        threadId
        ? null
        : threadId
    );

    setExpandedMessageId(
      null
    );

    // ? AUTO MARK AS READ
    const thread =
      notifications.find(
        (t) =>
          t._id ===
          threadId
      );

    if (
      thread &&
      !thread.latest?.isRead
    ) {

      await handleMarkAsRead(
        threadId
      );

    }

  };
  const handleExpandMessage = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const handleMarkAsRead =
  async (threadId) => {

    try {

      await emailSyncAPI.markThreadAsRead(
        threadId
      );

      setNotifications(
        (prev) =>
          prev.map(
            (thread) => {

              if (
                thread._id !==
                threadId
              ) {
                return thread;
              }

              return {

                ...thread,

                latest: {
                  ...thread.latest,
                  isRead: true,
                },

                messages:
                  thread.messages.map(
                    (msg) => ({
                      ...msg,
                      isRead: true,
                    })
                  ),

              };

            }
          )
      );

    } catch (error) {

      console.log(
        "MARK READ ERROR:",
        error
      );

    }

  };

const handleArchiveThread =
  async (threadId) => {

    try {

      await emailSyncAPI.archiveThread(
        threadId
      );

      // ? REMOVE THREAD FROM UI
      setNotifications(
        (prev) =>
          prev.filter(
            (thread) =>
              thread._id !==
              threadId
          )
      );

      if (
        expandedThreadId ===
        threadId
      ) {

        setExpandedThreadId(
          null
        );

      }

    } catch (error) {

      console.log(
        "ARCHIVE ERROR:",
        error
      );

    }

  };
  const openAttachment = (attachment) => {
    const byteCharacters = atob(attachment.data);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: attachment.mimeType,
    });

    const url = URL.createObjectURL(blob);

    setPreviewFile({
      ...attachment,
      url,
    });
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedThread) return;

    try {
      await emailSyncAPI.replyEmail({
        to: extractEmail(selectedThread?.latest?.from || ""),

        subject: selectedThread?.latest?.subject || "No Subject",

        message: replyText,
      });

      setReplyText("");
    } catch (error) {
      console.log(error);
    }
  };

  const renderLinkedSubject = (subject, isBold = false) => {
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
        className="text-primary font-medium no-underline"
        style={{
          fontWeight: isBold ? "bold" : "normal",
        }}
      >
        {text}
      </a>
    );
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* LEFT PANEL */}

      <div className="w-[300px] shrink-0 flex flex-col border-r border-border/40 h-full overflow-hidden bg-background">
        {/* HEADER */}

        <div className="px-4 pt-4 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[15px] font-semibold text-foreground tracking-tight">
              Notifications
            </h1>

            <ShadButton
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </ShadButton>
          </div>

          {/* SEARCH */}

          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />

            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-[12px] rounded-md border-0 bg-muted/50 focus-visible:bg-muted focus-visible:ring-1 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* TITLE */}

          <div className="flex items-center justify-between border-b border-border/40 -mx-4 px-4">
            <div className="px-1 py-2">
              <span className="text-[12px] font-semibold text-foreground">
                Inbox
              </span>

              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* THREADS */}

        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Mail className="h-8 w-8 text-muted-foreground/20" />

              <p className="text-[12px] text-muted-foreground">
                No emails found
              </p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const latest = thread.latest;

              const isSelected = expandedThreadId === thread._id;

              return (
                <div
                  key={thread._id}
                  onClick={() => handleExpandThread(thread._id)}
                  className={`group flex items-start gap-2.5 px-4 py-2.5 cursor-pointer transition-colors duration-150 ${
                    isSelected ? "bg-muted" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="shrink-0 mt-[7px]">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        !latest?.isRead ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                  </div>

                  <ShadAvatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      style={{
                        backgroundColor: getAvatarColor(latest?.from),
                      }}
                      className="text-white text-[10px] font-bold"
                    >
                      {getInitialsFromStr(latest?.from)}
                    </AvatarFallback>
                  </ShadAvatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`text-[12.5px] truncate ${
                          !latest?.isRead
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground/70"
                        }`}
                      >
                        {latest?.from?.replace(/<.*?>/g, "").trim()}
                      </span>

                      <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
                        {getRelativeTime(latest?.messageDate)}
                      </span>
                    </div>

                    <div
                      className={`text-[12px] truncate ${
                        !latest?.isRead
                          ? "font-semibold text-foreground"
                          : "font-normal text-muted-foreground"
                      }`}
                    >
                      {cleanSubjectText(latest?.subject || "")}
                    </div>

                    <div className="text-[11px] text-muted-foreground/55 truncate">
                      {getPreview(latest?.body || "").slice(0, 60)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
        {!selectedThread ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Mail className="h-8 w-8 text-muted-foreground/20" />

            <p className="text-[13px] font-medium text-foreground/60">
              Select a thread to read
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}

            {/* <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0 gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-semibold text-foreground leading-tight truncate">
                  {renderLinkedSubject(selectedThread?.latest?.subject, true)}
                </h2>

                <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
                  {selectedThread?.messages?.length} messages
                </p>
              </div>
            </div> */}

<div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0 gap-4">

  <div className="flex-1 min-w-0">

    <h2 className="text-[15px] font-semibold text-foreground leading-tight truncate">
      {renderLinkedSubject(
        selectedThread
          ?.latest
          ?.subject,
        true
      )}
    </h2>

    <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
      {
        selectedThread
          ?.messages
          ?.length
      }{" "}
      messages
    </p>

  </div>

  {/* ACTIONS */}

  <div className="flex items-center gap-2">

    {!selectedThread
      ?.latest?.isRead && (

      <ShadButton
        variant="outline"
        size="sm"
        className="h-8 text-[12px]"
        onClick={() =>
          handleMarkAsRead(
            selectedThread._id
          )
        }
      >

        <Check className="h-3.5 w-3.5 mr-1" />

        Mark read

      </ShadButton>

    )}

    <ShadButton
      variant="outline"
      size="sm"
      className="h-8 text-[12px]"
      onClick={() =>
        handleArchiveThread(
          selectedThread._id
        )
      }
    >

      <Archive className="h-3.5 w-3.5 mr-1" />

      Archive

    </ShadButton>

  </div>

</div>
            {/* MESSAGES */}

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                {selectedThread?.messages?.map((email, idx, arr) => {
                  const isExpanded = expandedMessageId === email.messageId;

                  return (
                    <div
                      key={email.messageId}
                      className={`${
                        idx < arr.length - 1 ? "border-b border-border/40" : ""
                      }`}
                    >
                      {/* MESSAGE HEADER */}

                      <div
                        onClick={() => handleExpandMessage(email.messageId)}
                        className={`flex items-start gap-3 py-3 cursor-pointer transition-colors duration-100 rounded-md ${
                          isExpanded ? "" : "hover:bg-muted/40"
                        }`}
                      >
                        <ShadAvatar className="h-8 w-8 shrink-0">
                          <AvatarFallback
                            style={{
                              backgroundColor: getAvatarColor(email.from || ""),
                            }}
                            className="text-white text-[10px] font-bold"
                          >
                            {getInitialsFromStr(email.from || "")}
                          </AvatarFallback>
                        </ShadAvatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[13px] font-semibold text-foreground">
                              {email.from?.replace(/<.*?>/g, "").trim()}
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0 ml-3">
                              <span className="text-[11px] text-muted-foreground tabular-nums">
                                {new Date(email.messageDate).toLocaleString()}
                              </span>

                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                          </div>

                          {!isExpanded && (
                            <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                              {getPreview(email.body || "").slice(0, 120)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* BODY */}

                      {isExpanded && (
                        <div className="ml-11 pb-4">
                          <div
                            className="text-[13px] leading-6 text-foreground break-words [&_p]:mb-3 [&_a]:text-primary [&_a]:underline"
                            dangerouslySetInnerHTML={{
                              __html: email.body,
                            }}
                          />

                          {/* ATTACHMENTS */}

                          {email?.attachments?.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border/40">
                              <p className="flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                <Paperclip className="h-2.5 w-2.5" />
                                {email.attachments.length} Attachment
                                {email.attachments.length > 1 ? "s" : ""}
                              </p>

                              <div className="flex flex-wrap gap-1.5">
                                {email.attachments.map((att, i) => (
                                  <button
                                    key={i}
                                    onClick={() => openAttachment(att)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/60 bg-muted/30 hover:bg-muted hover:border-border transition-colors text-left"
                                  >
                                    <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />

                                    <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">
                                      {att.filename}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* REPLY */}

                          {/* {replyingToMessageId === email.messageId ? (
                            <div className="mt-3 rounded-lg border border-border bg-muted/20 overflow-hidden">
                              <textarea
                                rows={3}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Reply..."
                                className="w-full bg-transparent px-4 pt-3 pb-1 text-[13px] text-foreground resize-none outline-none placeholder:text-muted-foreground/50"
                              />

                              <div className="flex items-center justify-between px-3 py-2 border-t border-border/40">
                                <ShadButton
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-[11.5px] rounded-md text-muted-foreground hover:text-foreground"
                                  onClick={() => {
                                    setReplyingToMessageId(null);

                                    setReplyText("");
                                  }}
                                >
                                  Cancel
                                </ShadButton>

                                <ShadButton
                                  size="sm"
                                  className="h-7 px-4 text-[12px] rounded-md gap-1.5 font-medium"
                                  onClick={() => {
                                    sendReply();

                                    setReplyingToMessageId(null);
                                  }}
                                >
                                  <Send className="h-3.5 w-3.5" />
                                  Send
                                </ShadButton>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <ShadButton
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-[12px] rounded-md gap-1.5"
                                onClick={() => {
                                  setReplyingToMessageId(email.messageId);
                                }}
                              >
                                <Reply className="h-3.5 w-3.5" />
                                Reply
                              </ShadButton>
                            </div>
                          )} */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* PREVIEW */}

      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/65 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border"
            style={{
              width: "85%",
              height: "90%",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-[13px] font-semibold text-foreground">
                {previewFile.filename}
              </span>

              <ShadButton
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg"
                onClick={() => setPreviewFile(null)}
              >
                <X className="h-4 w-4" />
              </ShadButton>
            </div>

            <div className="flex-1 overflow-hidden">
              {previewFile.mimeType.startsWith("image/") ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.filename}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-none"
                  title="File Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* FILTER SHEET */}

      <Sheet
        open={filterDrawerOpen}
        onOpenChange={(o) => !o && setFilterDrawerOpen(false)}
      >
        <SheetContent
          side="right"
          className="p-0 flex flex-col [&>button]:hidden w-[280px]"
        >
          <SheetHeader className="flex flex-row items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
            <SheetTitle className="flex items-center gap-2 text-[13.5px] font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filter emails
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {Object.keys(checkedItems).map((key) => (
              <label
                key={key}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-[13px] hover:bg-muted/60"
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={checkedItems[key]}
                  onChange={(e) =>
                    setCheckedItems({
                      ...checkedItems,
                      [key]: e.target.checked,
                    })
                  }
                  className="accent-primary h-3.5 w-3.5 shrink-0"
                />

                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </label>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EmailViewer;
