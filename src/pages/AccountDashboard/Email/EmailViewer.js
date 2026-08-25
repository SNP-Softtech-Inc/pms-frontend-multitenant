


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import ComposeEmailDrawer from "./ComposeDrawer";

// import { Avatar as ShadAvatar, AvatarFallback } from "../../../components/ui/avatar";
// import { Button as ShadButton } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";

// import { useAuth } from "../../../context/AuthContext";

// import {
//   authAPI,
//   accountsAPI,
// } from "../../../services/api";
// import { useToastContext } from "../../../context/ToastContext";
// import {
//   Search,
//   Reply,
//   X,
//   Pencil,
//   Paperclip,
//   Send as SendIcon,
//   ChevronDown,
//   ChevronUp,
//   Mail,
// } from "lucide-react";

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
//   const hash = str
//     .split("")
//     .reduce((acc, c) => acc + c.charCodeAt(0), 0);

//   return AVATAR_COLORS[hash % AVATAR_COLORS.length];
// };

// const getInitialsFromStr = (str = "") => {
//   const clean = str.replace(/<.*?>/g, "").trim();

//   const parts = clean.split(/[\s@]+/);

//   return (
//     ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase()
//   );
// };

// const getRelativeTime = (dateStr) => {
//   if (!dateStr) return "";

//   const diffDays = Math.floor(
//     (Date.now() - new Date(dateStr)) / 86400000
//   );

//   if (diffDays === 0) return "Today";
//   if (diffDays === 1) return "1D";

//   return `${diffDays}D`;
// };

// const EmailViewer = ({ type }) => {
//   console.log("fectinh emails by type",type)
//   const { accountId } = useParams();
//   const navigate = useNavigate();
// const {showToast} = useToastContext();
//   const { user } = useAuth();

  

//   const loginUserId = user?.id;

//   const [threads, setThreads] = useState([]);
//   const [selectedThreadId, setSelectedThreadId] = useState(null);
//   const [threadTab, setThreadTab] = useState(0);

//   const [replyText, setReplyText] = useState("");
//   const [replyingToMessageId, setReplyingToMessageId] =
//     useState(null);

//   const [expandedMessageId, setExpandedMessageId] =
//     useState(null);

//   const [previewFile, setPreviewFile] = useState(null);

//   const [openDrawer, setOpenDrawer] = useState(false);

//   const [contactMap, setContactMap] = useState({});

//   const [supportEmail, setSupportEmail] = useState("");

//   useEffect(() => {
//     fetchLoggedInUser();
//   }, [loginUserId]);

//   useEffect(() => {
//     if (supportEmail) {
//       fetchEmailCommunications();
//     }
//   }, [type, supportEmail]);

//   // ✅ FETCH LOGGED IN USER EMAIL
//   const fetchLoggedInUser = async () => {
//     try {
//       if (!loginUserId) return;

//       const res = await authAPI.getSingleUser(loginUserId);

//       console.log("Single user:", res.data);

//       const gmailEmail =
//         res?.data?.user.gmailEmail ||
//         res?.data?.user?.gmailEmail ||
//         "";

//       setSupportEmail(gmailEmail);
//       console.log("supposrt gmail",gmailEmail)
//     } catch (error) {
//       console.error("Error fetching user", error);
//     }
//   };

//   // ✅ FETCH EMAIL COMMUNICATIONS
//   const fetchEmailCommunications = async () => {
//     try {
//       // ✅ ACCOUNT CONTACTS
//       const contactsRes =
//         await accountsAPI.getAccountContacts(accountId);

//       const syncedEmails = (contactsRes.data.data || [])
//         .filter(
//           (item) =>
//             item.canEmailSync && item.contact?.email
//         )
//         .map((item) =>
//           item.contact.email.toLowerCase()
//         );

//       const contactMapTemp = {};

//       (contactsRes.data.data || []).forEach((item) => {
//         if (
//           item.canEmailSync &&
//           item.contact?.email
//         ) {
//           contactMapTemp[
//             item.contact.email.toLowerCase()
//           ] =
//             item.contact.contactName ||
//             item.contact.email;
//         }
//       });

//       setContactMap(contactMapTemp);

//       if (!syncedEmails.length) {
//         setThreads([]);
//         return;
//       }

//       // ✅ NEW API
//       const emailsRes =
//         await authAPI.getEmailCommunications();

//       console.log(
//         "Email communications:",
//         emailsRes.data
//       );

//       const allThreads =
//         emailsRes?.data?.threads ||
//         emailsRes?.data?.data ||
//         [];

      



// const filteredThreads = allThreads
//   .map((thread) => {
//     // Only keep messages that match the direction for this tab
//     const matchingMessages = thread.messages.filter((msg) => {
//       const from = msg.from?.toLowerCase() || "";
//       const toList = Array.isArray(msg.to)
//         ? msg.to.map((t) => t.toLowerCase())
//         : [(msg.to || "").toLowerCase()];

//       const involvesContact = syncedEmails.some((email) => {
//         const emailLower = email.toLowerCase();
//         return from.includes(emailLower) || toList.some((t) => t.includes(emailLower));
//       });

//       const involvesSupport =
//         from.includes(supportEmail.toLowerCase()) ||
//         toList.some((t) => t.includes(supportEmail.toLowerCase()));

//       if (!involvesContact || !involvesSupport) return false;

//       if (type === "inbox") {
//         // contact -> support (from is a contact email)
//         return syncedEmails.some((email) => from.includes(email.toLowerCase()));
//       }

//       if (type === "sent") {
//         // support -> contact (from is support)
//         return from.includes(supportEmail.toLowerCase());
//       }

//       return false;
//     });

//     return { ...thread, messages: matchingMessages };
//   })
//   .filter((thread) => thread.messages.length > 0);

// // setThreads(filteredThreads);
// setThreads(filteredThreads);

//       console.log(
//         "Filtered threads:",
//         filteredThreads
//       );
//     } catch (error) {
//       console.error(
//         "Error fetching email communications",
//         error
//       );
//     }
//   };

//   const unreadCount = threads.filter(
//     (t) => !t.latest?.read
//   ).length;

//   useEffect(() => {
//     navigate(".", {
//       state: { unreadCount },
//     });
//   }, [unreadCount]);

//   // ✅ HELPERS
//   const getName = (from) =>
//     from?.replace(/<.*?>/g, "").trim();

//   const formatThreadTitle = (thread) => {
//     let recipients = new Set();

//     const normalize = (email) =>
//       email
//         ?.toLowerCase()
//         .replace(/<.*?>/g, "")
//         .trim();

//     thread.messages.forEach((msg) => {
//       const from = normalize(msg.from);

//       const toList = Array.isArray(msg.to)
//         ? msg.to
//         : [msg.to || ""];

//       if (
//         from.includes(
//           supportEmail.toLowerCase()
//         )
//       ) {
//         toList.forEach((email) => {
//           const clean = normalize(email);

//           if (
//             clean &&
//             !clean.includes(
//               supportEmail.toLowerCase()
//             )
//           ) {
//             recipients.add(clean);
//           }
//         });
//       } else {
//         if (
//           from &&
//           !from.includes(
//             supportEmail.toLowerCase()
//           )
//         ) {
//           recipients.add(from);
//         }
//       }
//     });

//     const names = Array.from(recipients).map(
//       (email) => {
//         const key = Object.keys(contactMap).find(
//           (e) => email.includes(e)
//         );

//         return key
//           ? contactMap[key]
//           : getName(email);
//       }
//     );

//     const messageCount =
//       thread.messages.length;

//     const countText =
//       messageCount > 1
//         ? ` (${messageCount})`
//         : "";

//     const displayNames =
//       names.length > 1
//         ? names.join(", ")
//         : names[0] || "Unknown";

//     return type === "sent"
//       ? `me → ${displayNames}${countText}`
//       : `${displayNames} → me${countText}`;
//   };

//   const getPreview = (
//     html,
//     length = 80
//   ) => {
//     const text = html.replace(
//       /<[^>]*>?/gm,
//       ""
//     );

//     return text.length > length
//       ? text.slice(0, length) + "..."
//       : text;
//   };

//   const openAttachment = (
//     attachment
//   ) => {
//     const byteCharacters = atob(
//       attachment.data
//     );

//     const byteNumbers = new Array(
//       byteCharacters.length
//     );

//     for (
//       let i = 0;
//       i < byteCharacters.length;
//       i++
//     ) {
//       byteNumbers[i] =
//         byteCharacters.charCodeAt(i);
//     }

//     const blob = new Blob(
//       [new Uint8Array(byteNumbers)],
//       {
//         type: attachment.mimeType,
//       }
//     );

//     setPreviewFile({
//       ...attachment,
//       url: URL.createObjectURL(blob),
//     });
//   };

//   // ✅ SEND REPLY
// //   const sendReply = async () => {
// //     try {
// //       const thread = threads.find(
// //         (t) => t._id === selectedThreadId
// //       );

// //       if (!thread) return;

// //       const lastEmail =
// //         thread.messages[
// //           thread.messages.length - 1
// //         ];

// //       const toList = Array.isArray(
// //         lastEmail.to
// //       )
// //         ? lastEmail.to
// //         : [lastEmail.to];

// //       const replyTo =
// //         toList[toList.length - 1];

// //  console.log("replying to", replyTo, "with text", replyText);
// // await authAPI.replyEmail({
// //   to: replyTo,
// //   subject: `Re: ${
// //     lastEmail.subject || "No Subject"
// //   }`,
// //   message: replyText,
// //   threadId: thread._id,
// // });
// //       setReplyText("");

// //       alert("Reply sent!");

// //       fetchEmailCommunications();
// //     } catch (error) {
// //       console.error(
// //         "Reply send error",
// //         error
// //       );
// //     }
// //   };
// // ✅ SEND REPLY
// const sendReply = async () => {
//   try {
//     const thread = threads.find(
//       (t) => t._id === selectedThreadId
//     );

//     if (!thread) return;

//     const lastEmail =
//       thread.messages[
//         thread.messages.length - 1
//       ];

//     // ✅ Reply to the sender of the last email
//     const replyTo = lastEmail.from;

//     await authAPI.replyEmail({
//       to: replyTo,
//       subject: `Re: ${
//         lastEmail.subject || "No Subject"
//       }`,
//       message: replyText,
//       threadId: thread._id,
//     });

  
// showToast({
//   title: "Reply Sent",
//   description: "Your reply has been sent successfully.",
//   type: "success",
//   duration: 3000,
// });
//   setReplyText("");
//     // alert("Reply sent!");

//     fetchEmailCommunications();
//   } catch (error) {
//     console.error(
//       "Reply send error",
//       error
//     );
//   }
// };
//   // ✅ MARK READ
//   // const markThreadAsRead = async (
//   //   threadId
//   // ) => {
//   //   try {
//   //     await axios.patch(
//   //       "https://www.snptaxes.com/emailsync/messagesList/threads/mark-read",
//   //       { threadId }
//   //     );

//   //     fetchEmailCommunications();
//   //   } catch (err) {
//   //     console.error(
//   //       "Mark read failed",
//   //       err
//   //     );
//   //   }
//   // };
//  const markThreadAsRead = async (threadId) => {
//     const toastId = showToast({
//       title: "Processing...",
//       description: "Marking thread as read",
//       type: "loading",
//       duration: Infinity,
//     });

//     try {
//       await authAPI.markThreadAsRead(threadId);

//       // Update in both states if needed
//       setNotifications((prev) =>
//         prev.map((t) =>
//           t._id === threadId
//             ? {
//                 ...t,
//                 latest: { ...t.latest, isRead: true },
//               }
//             : t,
//         ),
//       );

//       setArchivedNotifications((prev) =>
//         prev.map((t) =>
//           t._id === threadId
//             ? {
//                 ...t,
//                 latest: { ...t.latest, isRead: true },
//               }
//             : t,
//         ),
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
//   const selectedThread = threads.find(
//     (t) => t._id === selectedThreadId
//   );

//   const visibleThreads = threads.filter(
//     (t) => {
//       if (threadTab === 1)
//         return !t.latest?.read;

//       return true;
//     }
//   );

//   return (
//     <div className="flex h-full overflow-hidden bg-background">
//       {/* LEFT PANEL */}
//       <div className="w-[300px] shrink-0 flex flex-col border-r border-border/40 h-full overflow-hidden bg-background">
//         {/* HEADER */}
//         <div className="px-4 pt-4 pb-0 shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <h1 className="text-[15px] font-semibold text-foreground tracking-tight capitalize">
//               {type}
//             </h1>

//             <ShadButton
//               variant="ghost"
//               size="sm"
//               className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
//               onClick={() =>
//                 setOpenDrawer(true)
//               }
//               title="Compose"
//             >
//               <Pencil className="h-3.5 w-3.5" />
//             </ShadButton>
//           </div>

//           {/* SEARCH */}
//           <div className="relative mb-3">
//             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />

//             <Input
//               placeholder="Search…"
//               className="pl-8 h-8 text-[12px] rounded-md border-0 bg-muted/50 focus-visible:bg-muted focus-visible:ring-1 placeholder:text-muted-foreground/50"
//             />
//           </div>

//           {/* TABS */}
//           <div className="flex border-b border-border/40 -mx-4 px-4">
//             {["All", "Unread"].map(
//               (label, i) => (
//                 <button
//                   key={label}
//                   onClick={() =>
//                     setThreadTab(i)
//                   }
//                   className={`px-3 py-2 text-[12px] font-medium border-b-2 -mb-px transition-colors duration-150 ${
//                     threadTab === i
//                       ? "border-primary text-foreground"
//                       : "border-transparent text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   {label}

//                   {i === 1 &&
//                     unreadCount > 0 && (
//                       <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1">
//                         {unreadCount}
//                       </span>
//                     )}
//                 </button>
//               )
//             )}
//           </div>
//         </div>

//         {/* THREADS */}
//         <div className="flex-1 overflow-y-auto">
//           {visibleThreads.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 gap-2">
//               <Mail className="h-8 w-8 text-muted-foreground/20" />

//               <p className="text-[12px] text-muted-foreground">
//                 No emails found
//               </p>
//             </div>
//           ) : (
//             visibleThreads.map((thread) => {
//               const latest =
//                 thread.latest;

//               const isSelected =
//                 selectedThreadId ===
//                 thread._id;

//               const isUnread =
//                 !latest?.read;

//               return (
//                 <div
//                   key={thread._id}
//                   onClick={() => {
//                     setSelectedThreadId(
//                       thread._id
//                     );

//                     setExpandedMessageId(
//                       null
//                     );

//                     setReplyingToMessageId(
//                       null
//                     );

//                     markThreadAsRead(
//                       thread._id
//                     );
//                   }}
//                   className={`group flex items-start gap-2.5 px-4 py-2.5 cursor-pointer transition-colors duration-150 ${
//                     isSelected
//                       ? "bg-muted"
//                       : "hover:bg-muted/40"
//                   }`}
//                 >
//                   <div className="shrink-0 mt-[7px]">
//                     <div
//                       className={`h-1.5 w-1.5 rounded-full transition-colors ${
//                         isUnread
//                           ? "bg-primary"
//                           : "bg-transparent"
//                       }`}
//                     />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-baseline justify-between gap-2">
//                       <span
//                         className={`text-[12.5px] truncate ${
//                           isUnread
//                             ? "font-semibold text-foreground"
//                             : "font-medium text-foreground/70"
//                         }`}
//                       >
//                         {formatThreadTitle(
//                           thread
//                         )}
//                       </span>

//                       <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
//                         {getRelativeTime(
//                           latest?.createdAt ||
//                             latest?.date
//                         )}
//                       </span>
//                     </div>

//                     <div
//                       className={`text-[12px] truncate ${
//                         isUnread
//                           ? "font-semibold text-foreground"
//                           : "font-normal text-muted-foreground"
//                       }`}
//                     >
//                       {latest?.subject ||
//                         "(No Subject)"}
//                     </div>

//                     <div className="text-[11px] text-muted-foreground/55 truncate">
//                       {getPreview(
//                         latest?.body || "",
//                         60
//                       )}
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
//         {selectedThread ? (
//           <>
//             <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0 gap-4">
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-[15px] font-semibold text-foreground leading-tight truncate">
//                   {selectedThread.latest
//                     ?.subject ||
//                     "(No Subject)"}
//                 </h2>

//                 <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
//                   {
//                     selectedThread.messages
//                       .length
//                   }{" "}
//                   messages
//                 </p>
//               </div>

//               <ShadButton
//                 variant="ghost"
//                 size="sm"
//                 className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
//                 onClick={() =>
//                   setSelectedThreadId(null)
//                 }
//               >
//                 <X className="h-3.5 w-3.5" />
//               </ShadButton>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               <div className="px-6 py-4">
//                 {selectedThread.messages.map(
//                   (email, idx) => {
//                     const isExpanded =
//                       expandedMessageId ===
//                       (email.messageId ||
//                         idx);

//                     const emailAvatarBg =
//                       getAvatarColor(
//                         email.from || ""
//                       );

//                     const emailInitials =
//                       getInitialsFromStr(
//                         email.from || ""
//                       );

//                     return (
//                       <div
//                         key={
//                           email.messageId ||
//                           idx
//                         }
//                         className={`${
//                           idx <
//                           selectedThread
//                             .messages
//                             .length -
//                             1
//                             ? "border-b border-border/40"
//                             : ""
//                         }`}
//                       >
//                         <div
//                           onClick={() =>
//                             setExpandedMessageId(
//                               isExpanded
//                                 ? null
//                                 : email.messageId ||
//                                     idx
//                             )
//                           }
//                           className={`flex items-start gap-3 py-3 cursor-pointer transition-colors duration-100 rounded-md ${
//                             isExpanded
//                               ? ""
//                               : "hover:bg-muted/40"
//                           }`}
//                         >
//                           <ShadAvatar className="h-8 w-8 shrink-0">
//                             <AvatarFallback
//                               style={{
//                                 backgroundColor:
//                                   emailAvatarBg,
//                               }}
//                               className="text-white text-[10px] font-bold"
//                             >
//                               {
//                                 emailInitials
//                               }
//                             </AvatarFallback>
//                           </ShadAvatar>

//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-baseline justify-between">
//                               <div className="min-w-0 flex items-baseline gap-2">
//                                 <span className="text-[13px] font-semibold text-foreground">
//                                   {getName(
//                                     email.from
//                                   )}
//                                 </span>

//                                 <span className="text-[11px] text-muted-foreground truncate">
//                                   to{" "}
//                                   {Array.isArray(
//                                     email.to
//                                   )
//                                     ? email.to.join(
//                                         ", "
//                                       )
//                                     : email.to}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-1.5 shrink-0 ml-3">
//                                 <span className="text-[11px] text-muted-foreground tabular-nums">
//                                   {new Date(
//                                     email.createdAt
//                                   ).toLocaleString()}
//                                 </span>

//                                 {isExpanded ? (
//                                   <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
//                                 ) : (
//                                   <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
//                                 )}
//                               </div>
//                             </div>

//                             {!isExpanded && (
//                               <p className="text-[12px] text-muted-foreground truncate mt-0.5">
//                                 {getPreview(
//                                   email.body ||
//                                     "",
//                                   120
//                                 )}
//                               </p>
//                             )}
//                           </div>
//                         </div>

//                         {isExpanded && (
//                           <div className="ml-11 pb-4">
//                             <div
//                               className="text-[13px] leading-6 text-foreground break-words"
//                               dangerouslySetInnerHTML={{
//                                 __html:
//                                   email.body,
//                               }}
//                             />

//                             {/* ATTACHMENTS */}
//                             {email.attachments
//                               ?.length > 0 && (
//                               <div className="mt-4 pt-3 border-t border-border/40">
//                                 <div className="flex flex-wrap gap-1.5">
//                                   {email.attachments.map(
//                                     (
//                                       att,
//                                       i
//                                     ) => (
//                                       <button
//                                         key={
//                                           i
//                                         }
//                                         type="button"
//                                         onClick={() =>
//                                           openAttachment(
//                                             att
//                                           )
//                                         }
//                                         className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/60 bg-muted/30 hover:bg-muted"
//                                       >
//                                         <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />

//                                         <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">
//                                           {
//                                             att.filename
//                                           }
//                                         </span>
//                                       </button>
//                                     )
//                                   )}
//                                 </div>
//                               </div>
//                             )}

//                             {/* REPLY */}
//                             {replyingToMessageId ===
//                             (email.messageId ||
//                               idx) ? (
//                               <div className="mt-3 rounded-lg border border-border bg-muted/20 overflow-hidden">
//                                 <textarea
//                                   autoFocus
//                                   placeholder={`Reply to ${getName(
//                                     email.from
//                                   )}…`}
//                                   value={
//                                     replyText
//                                   }
//                                   onChange={(
//                                     e
//                                   ) =>
//                                     setReplyText(
//                                       e.target
//                                         .value
//                                     )
//                                   }
//                                   rows={3}
//                                   className="w-full bg-transparent px-4 pt-3 pb-1 text-[13px] text-foreground resize-none outline-none"
//                                 />

//                                 <div className="flex items-center justify-between px-3 py-2 border-t border-border/40">
//                                   <ShadButton
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-7 text-[11.5px]"
//                                     onClick={() => {
//                                       setReplyingToMessageId(
//                                         null
//                                       );

//                                       setReplyText(
//                                         ""
//                                       );
//                                     }}
//                                   >
//                                     Cancel
//                                   </ShadButton>

//                                   <ShadButton
//                                     size="sm"
//                                     className="h-7 px-4 text-[12px] rounded-md gap-1.5 font-medium"
//                                     onClick={() => {
//                                       sendReply();

//                                       setReplyingToMessageId(
//                                         null
//                                       );
//                                     }}
//                                   >
//                                     <SendIcon className="h-3.5 w-3.5" />
//                                     Send
//                                   </ShadButton>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="mt-3">
//                                 <ShadButton
//                                   variant="outline"
//                                   size="sm"
//                                   className="h-7 px-3 text-[12px] rounded-md gap-1.5"
//                                   onClick={() => {
//                                     setReplyingToMessageId(
//                                       email.messageId ||
//                                         idx
//                                     );

//                                     setReplyText(
//                                       ""
//                                     );
//                                   }}
//                                 >
//                                   <Reply className="h-3.5 w-3.5" />
//                                   Reply
//                                 </ShadButton>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   }
//                 )}
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center gap-2">
//             <Mail className="h-8 w-8 text-muted-foreground/20" />

//             <p className="text-[13px] font-medium text-foreground/60">
//               Select a thread to read
//             </p>
//           </div>
//         )}
//       </div>

//       {/* ATTACHMENT PREVIEW */}
//       {previewFile && (
//         <div
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm"
//           onClick={() =>
//             setPreviewFile(null)
//           }
//         >
//           <div
//             className="w-[85%] h-[90%] bg-card rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >
//             <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
//               <span className="text-[13px] font-semibold text-foreground">
//                 {previewFile.filename}
//               </span>

//               <ShadButton
//                 variant="ghost"
//                 size="sm"
//                 className="h-7 w-7 p-0 rounded-lg"
//                 onClick={() =>
//                   setPreviewFile(null)
//                 }
//               >
//                 <X className="h-4 w-4" />
//               </ShadButton>
//             </div>

//             <div className="flex-1 overflow-hidden">
//               {previewFile.mimeType?.startsWith(
//                 "image/"
//               ) ? (
//                 <img
//                   src={previewFile.url}
//                   alt={
//                     previewFile.filename
//                   }
//                   className="w-full h-full object-contain"
//                 />
//               ) : (
//                 <iframe
//                   src={previewFile.url}
//                   className="w-full h-full border-none"
//                   title="Preview"
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* COMPOSE DRAWER */}
//       <ComposeEmailDrawer
//         open={openDrawer}
//         onClose={() =>
//           setOpenDrawer(false)
//         }
//       />
//     </div>
//   );
// };

// export default EmailViewer;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComposeEmailDrawer from "./ComposeDrawer";

import { Avatar as ShadAvatar, AvatarFallback } from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";

import { useAuth } from "../../../context/AuthContext";

import {
  authAPI,
  accountsAPI,
  emailSyncApi,
} from "../../../services/api";

import {
  Search,
  Reply,
  ReplyAll,
  Forward,
  X,
  Pencil,
  Paperclip,
  Send as SendIcon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Mail,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Square,
  CheckSquare,
  RotateCw,
} from "lucide-react";
import { useToastContext } from "../../../context/ToastContext";
// ─────────────────────────────────────────────────────────────
// Gmail's own palette. Kept as constants instead of scattering
// hex codes through the markup, since these values are load-bearing
// (they ARE what makes it read as Gmail).
// ─────────────────────────────────────────────────────────────
const GMAIL = {
  red: "#D93025",
  redHover: "#C5221F",
  blue: "#1A73E8",
  blueSelected: "#D3E3FD",
  blueSelectedHover: "#C2DBFF",
  star: "#F4B400",
  text: "#202124",
  textSecondary: "#5F6368",
  border: "#E0E0E0",
  hoverGrey: "#F1F3F4",
  unreadBg: "#FFFFFF",
  readBg: "#F2F6FC",
  panelBg: "#FFFFFF",
};

const FONT_STACK =
  "'Google Sans', 'Product Sans', Roboto, Arial, Helvetica, sans-serif";

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
  const hash = str
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const getInitialsFromStr = (str = "") => {
  const clean = str.replace(/<.*?>/g, "").trim();

  const parts = clean.split(/[\s@]+/);

  return (
    ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase()
  );
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const diffDays = Math.floor((now - date) / 86400000);

  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const EmailViewer = ({ type }) => {
  const { accountId } = useParams();
  const navigate = useNavigate();
const {showToast} = useToastContext();
  const { user } = useAuth();

  const loginUserId = user?.id;

  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [threadTab, setThreadTab] = useState(0);

  const [replyText, setReplyText] = useState("");
  const [replyingToMessageId, setReplyingToMessageId] =
    useState(null);
  const [replyMode, setReplyMode] = useState("reply"); // reply | replyAll | forward

  // Set of message keys currently expanded. Gmail opens a thread with
  // every message stacked and expanded, not just the latest one.
  const [expandedMessageIds, setExpandedMessageIds] = useState(new Set());

  const toggleMessageExpanded = (msgKey) => {
    setExpandedMessageIds((prev) => {
      const next = new Set(prev);

      if (next.has(msgKey)) {
        next.delete(msgKey);
      } else {
        next.add(msgKey);
      }

      return next;
    });
  };

  const [previewFile, setPreviewFile] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);

  const [contactMap, setContactMap] = useState({});

  const [supportEmail, setSupportEmail] = useState("");

  const [hoveredThreadId, setHoveredThreadId] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [starredIds, setStarredIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLoggedInUser();
  }, [loginUserId]);

  useEffect(() => {
    if (supportEmail) {
      fetchEmailCommunications();
    }
  }, [type, supportEmail]);

  // ✅ FETCH LOGGED IN USER EMAIL
  const fetchLoggedInUser = async () => {
    try {
      if (!loginUserId) return;

      const res = await authAPI.getSingleUser(loginUserId);

      const gmailEmail =
        res?.data?.user.gmailEmail ||
        res?.data?.user?.gmailEmail ||
        "";

      setSupportEmail(gmailEmail);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  // ✅ FETCH EMAIL COMMUNICATIONS
  const fetchEmailCommunications = async () => {
    try {
      setRefreshing(true);

      // ✅ ACCOUNT CONTACTS
      const contactsRes =
        await accountsAPI.getAccountContacts(accountId);

      const syncedEmails = (contactsRes.data.data || [])
        .filter(
          (item) =>
            item.canEmailSync && item.contact?.email
        )
        .map((item) =>
          item.contact.email.toLowerCase()
        );

      const contactMapTemp = {};

      (contactsRes.data.data || []).forEach((item) => {
        if (
          item.canEmailSync &&
          item.contact?.email
        ) {
          contactMapTemp[
            item.contact.email.toLowerCase()
          ] =
            item.contact.contactName ||
            item.contact.email;
        }
      });

      setContactMap(contactMapTemp);

      if (!syncedEmails.length) {
        setThreads([]);
        setRefreshing(false);
        return;
      }

      // ✅ NEW API
      const emailsRes =
        await authAPI.getEmailCommunications();

      const allThreads =
        emailsRes?.data?.threads ||
        emailsRes?.data?.data ||
        [];

      const filteredThreads = allThreads
        .map((thread) => {
          // Only keep messages that match the direction for this tab
          const matchingMessages = thread.messages.filter((msg) => {
            const from = msg.from?.toLowerCase() || "";
            const toList = Array.isArray(msg.to)
              ? msg.to.map((t) => t.toLowerCase())
              : [(msg.to || "").toLowerCase()];

            const involvesContact = syncedEmails.some((email) => {
              const emailLower = email.toLowerCase();
              return from.includes(emailLower) || toList.some((t) => t.includes(emailLower));
            });

            const involvesSupport =
              from.includes(supportEmail.toLowerCase()) ||
              toList.some((t) => t.includes(supportEmail.toLowerCase()));

            if (!involvesContact || !involvesSupport) return false;

            if (type === "inbox") {
              // contact -> support (from is a contact email)
              return syncedEmails.some((email) => from.includes(email.toLowerCase()));
            }

            if (type === "sent") {
              // support -> contact (from is support)
              return from.includes(supportEmail.toLowerCase());
            }

            return false;
          });

          return { ...thread, messages: matchingMessages };
        })
        .filter((thread) => thread.messages.length > 0);

      setThreads(filteredThreads);
    } catch (error) {
      console.error(
        "Error fetching email communications",
        error
      );
    } finally {
      setRefreshing(false);
    }
  };

  const unreadCount = threads.filter(
    (t) => !t.latest?.isRead
  ).length;

  useEffect(() => {
    navigate(".", {
      state: { unreadCount },
    });
  }, [unreadCount]);

  // ✅ HELPERS
  const getName = (from) =>
    from?.replace(/<.*?>/g, "").trim();

  const formatThreadTitle = (thread) => {
    let recipients = new Set();

    const normalize = (email) =>
      email
        ?.toLowerCase()
        .replace(/<.*?>/g, "")
        .trim();

    thread.messages.forEach((msg) => {
      const from = normalize(msg.from);

      const toList = Array.isArray(msg.to)
        ? msg.to
        : [msg.to || ""];

      if (
        from.includes(
          supportEmail.toLowerCase()
        )
      ) {
        toList.forEach((email) => {
          const clean = normalize(email);

          if (
            clean &&
            !clean.includes(
              supportEmail.toLowerCase()
            )
          ) {
            recipients.add(clean);
          }
        });
      } else {
        if (
          from &&
          !from.includes(
            supportEmail.toLowerCase()
          )
        ) {
          recipients.add(from);
        }
      }
    });

    const names = Array.from(recipients).map(
      (email) => {
        const key = Object.keys(contactMap).find(
          (e) => email.includes(e)
        );

        return key
          ? contactMap[key]
          : getName(email);
      }
    );

    const messageCount =
      thread.messages.length;

    const countText =
      messageCount > 1
        ? ` (${messageCount})`
        : "";

    const displayNames =
      names.length > 1
        ? names.join(", ")
        : names[0] || "Unknown";

    return type === "sent"
      ? `${displayNames}${countText}`
      : `${displayNames}${countText}`;
  };

  const getPreview = (
    html,
    length = 80
  ) => {
    const text = (html || "").replace(
      /<[^>]*>?/gm,
      ""
    );

    return text.length > length
      ? text.slice(0, length) + "..."
      : text;
  };

  const openAttachment = (
    attachment
  ) => {
    const byteCharacters = atob(
      attachment.data
    );

    const byteNumbers = new Array(
      byteCharacters.length
    );

    for (
      let i = 0;
      i < byteCharacters.length;
      i++
    ) {
      byteNumbers[i] =
        byteCharacters.charCodeAt(i);
    }

    const blob = new Blob(
      [new Uint8Array(byteNumbers)],
      {
        type: attachment.mimeType,
      }
    );

    setPreviewFile({
      ...attachment,
      url: URL.createObjectURL(blob),
    });
  };

  // ✅ SEND REPLY
  const sendReply = async () => {
    try {
      const thread = threads.find(
        (t) => t._id === selectedThreadId
      );

      if (!thread) return;

      const lastEmail =
        thread.messages[
          thread.messages.length - 1
        ];

      // ✅ Reply to the sender of the last email
      const replyTo = lastEmail.from;

      await authAPI.replyEmail({
        to: replyTo,
        subject: `Re: ${
          lastEmail.subject || "No Subject"
        }`,
        message: replyText,
        threadId: thread._id,
      });

      setReplyText("");
showToast({
  title:"Reply sent",
  type:"success"
})
      fetchEmailCommunications();
    } catch (error) {
      console.error(
        "Reply send error",
        error
      );
    }
  };

  // ✅ MARK READ
  const markThreadAsRead = async (
    threadId
  ) => {
    try {
      await authAPI.markThreadAsRead(threadId);
 showToast({
  title:"Mark as read",
  type:"success"
 })
      fetchEmailCommunications();
    } catch (err) {
      console.error(
        "Mark read failed",
        err
      );
    }
  };

  const toggleStar = (e, threadId) => {
    e.stopPropagation();

    setStarredIds((prev) => {
      const next = new Set(prev);

      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }

      return next;
    });
  };

  const toggleRowSelect = (e, threadId) => {
    e.stopPropagation();

    setSelectedRowIds((prev) => {
      const next = new Set(prev);

      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }

      return next;
    });
  };

  const selectedThread = threads.find(
    (t) => t._id === selectedThreadId
  );

  const visibleThreads = threads
    .filter((t) => {
      if (threadTab === 1)
        return !t.latest?.isRead;

      return true;
    })
    .filter((t) => {
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();

      const hay = [
        formatThreadTitle(t),
        t.latest?.subject,
        t.latest?.body,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });

  return (
    <div
      className="flex h-full overflow-hidden bg-white"
      style={{ fontFamily: FONT_STACK, color: GMAIL.text }}
    >
      {/* LEFT PANEL — Gmail thread list */}
      <div className="w-[360px] shrink-0 flex flex-col h-full overflow-hidden bg-white border-r border-[#E0E0E0]">
        {/* HEADER / SEARCH BAR */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F6368] pointer-events-none" />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mail"
                className="w-full h-10 pl-10 pr-3 text-[14px] rounded-full bg-[#EAF1FB] focus:bg-white focus:shadow-[0_1px_3px_rgba(0,0,0,0.2)] outline-none border-none placeholder:text-[#5F6368] transition-shadow"
              />
            </div>

            <button
              onClick={() => fetchEmailCommunications()}
              title="Refresh"
              className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[#5F6368] hover:bg-[#F1F3F4] transition-colors"
            >
              <RotateCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {/* COMPOSE — Gmail's pill button */}
          <button
            onClick={() => setOpenDrawer(true)}
            className="flex items-center gap-3 h-14 pl-4 pr-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-shadow bg-white text-[14px] font-medium"
            style={{ color: GMAIL.text }}
          >
            <Pencil className="h-5 w-5" style={{ color: GMAIL.redHover }} fill={GMAIL.redHover} />
            Compose
          </button>
        </div>

        {/* TABS */}
        <div className="flex items-center border-b border-[#E0E0E0] px-2">
          {["All Mail", "Unread"].map((label, i) => (
            <button
              key={label}
              onClick={() => setThreadTab(i)}
              className={`relative px-4 py-3 text-[13px] font-medium tracking-wide transition-colors ${
                threadTab === i
                  ? "text-[#D93025]"
                  : "text-[#5F6368] hover:text-[#202124]"
              }`}
            >
              {label.toUpperCase()}

              {i === 1 && unreadCount > 0 && (
                <span className="ml-1.5 text-[11px] font-semibold text-[#5F6368]">
                  {unreadCount}
                </span>
              )}

              {threadTab === i && (
                <span
                  className="absolute left-2 right-2 -bottom-px h-[3px] rounded-t-full"
                  style={{ backgroundColor: GMAIL.red }}
                />
              )}
            </button>
          ))}
        </div>

        {/* THREADS */}
        <div className="flex-1 overflow-y-auto">
          {visibleThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Mail className="h-10 w-10 text-[#DADCE0]" strokeWidth={1.5} />

              <p className="text-[13px] text-[#5F6368]">
                No conversations found
              </p>
            </div>
          ) : (
            visibleThreads.map((thread) => {
              const latest = thread.latest;
              const isSelected = selectedThreadId === thread._id;
              const isUnread = !latest?.isRead;
              const isRowHovered = hoveredThreadId === thread._id;
              const isChecked = selectedRowIds.has(thread._id);
              const isStarred = starredIds.has(thread._id);
              const hasAttachment = thread.messages.some(
                (m) => m.attachments?.length > 0
              );

              const rowBg = isSelected
                ? isRowHovered
                  ? GMAIL.blueSelectedHover
                  : GMAIL.blueSelected
                : isRowHovered
                ? GMAIL.hoverGrey
                : isUnread
                ? GMAIL.unreadBg
                : GMAIL.readBg;

              return (
                <div
                  key={thread._id}
                  onMouseEnter={() => setHoveredThreadId(thread._id)}
                  onMouseLeave={() => setHoveredThreadId(null)}
                  onClick={() => {
                    setSelectedThreadId(thread._id);
                    setExpandedMessageIds(
                      new Set(
                        thread.messages.map((m, i) =>
                          (m.messageId || i).toString()
                        )
                      )
                    );
                    setReplyingToMessageId(null);
                    markThreadAsRead(thread._id);
                  }}
                  style={{
                    backgroundColor: rowBg,
                    boxShadow: isRowHovered && !isSelected
                      ? "inset 1px 0 0 #E0E0E0, inset -1px 0 0 #E0E0E0, 0 1px 2px 0 rgba(60,64,67,0.15)"
                      : "none",
                  }}
                  className="group relative flex items-center gap-3 pl-3 pr-4 h-11 cursor-pointer border-b border-[#F1F1F1] transition-colors"
                >
                  {/* checkbox (hover) / star */}
                  {/* <div className="flex items-center gap-2 shrink-0 w-[46px]">
                    <button
                      onClick={(e) => toggleRowSelect(e, thread._id)}
                      className={`${
                        isChecked || isRowHovered ? "flex" : "hidden group-hover:flex"
                      } h-4 w-4 items-center justify-center text-[#5F6368] hover:text-[#202124]`}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4" style={{ color: GMAIL.blue }} />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => toggleStar(e, thread._id)}
                      className="h-4 w-4 flex items-center justify-center"
                    >
                      <Star
                        className="h-4 w-4"
                        style={{
                          color: isStarred ? GMAIL.star : "#C9CDD1",
                        }}
                        fill={isStarred ? GMAIL.star : "none"}
                      />
                    </button>
                  </div> */}

                  {/* sender / subject / snippet, single truncating line like Gmail */}
                  <div className="flex-1 min-w-0 flex items-baseline gap-2">
                    <span
                      className={`shrink-0 max-w-[120px] truncate text-[13.5px] ${
                        isUnread ? "font-bold text-[#202124]" : "font-normal text-[#202124]"
                      }`}
                    >
                      {formatThreadTitle(thread)}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-[13.5px]">
                      <span
                        className={
                          isUnread
                            ? "font-bold text-[#202124]"
                            : "font-normal text-[#202124]"
                        }
                      >
                        {latest?.subject || "(no subject)"}
                      </span>

                      <span className="text-[#5F6368] font-normal">
                        {" "}
                        - {getPreview(latest?.body || "", 60)}
                      </span>
                    </span>
                  </div>

                  {/* date / attachment icon, hidden on hover in favor of actions */}
                  <div className="shrink-0 flex items-center gap-2">
                    <div
                      className={`items-center gap-1.5 ${
                        isRowHovered ? "hidden" : "flex"
                      }`}
                    >
                      {hasAttachment && (
                        <Paperclip className="h-3.5 w-3.5 text-[#5F6368]" />
                      )}

                      <span
                        className={`text-[12px] tabular-nums ${
                          isUnread
                            ? "font-bold text-[#202124]"
                            : "text-[#5F6368]"
                        }`}
                      >
                        {getRelativeTime(latest?.createdAt || latest?.date)}
                      </span>
                    </div>

                    {/* hover actions, Gmail shows archive/delete/mark-read icons here */}
                    {/* <div
                      className={`items-center gap-0.5 ${
                        isRowHovered ? "flex" : "hidden"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="Archive"
                        className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#E8EAED] text-[#5F6368]"
                      >
                        <Archive className="h-4 w-4" />
                      </button>

                      <button
                        title="Delete"
                        className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#E8EAED] text-[#5F6368]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL — reading pane */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-white">
        {selectedThread ? (
          <>
            {/* toolbar */}
            <div className="flex items-center gap-1 px-3 h-14 border-b border-[#E0E0E0] shrink-0">
              <button
                onClick={() => setSelectedThreadId(null)}
                title="Back to inbox"
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#F1F3F4] text-[#5F6368]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="h-6 w-px bg-[#E0E0E0] mx-1" />

              <button
                title="Archive"
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#F1F3F4] text-[#5F6368]"
              >
                <Archive className="h-4.5 w-4.5" />
              </button>

              <button
                title="Delete"
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#F1F3F4] text-[#5F6368]"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>

              <div className="flex-1" />

              <button
                title="More"
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#F1F3F4] text-[#5F6368]"
              >
                <MoreVertical className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[820px] mx-auto px-6 py-5">
                <h2 className="text-[22px] font-normal text-[#202124] leading-snug mb-4 pr-4">
                  {selectedThread.latest?.subject || "(no subject)"}
                </h2>

                {selectedThread.messages.map((email, idx) => {
                  const msgKey = (email.messageId || idx).toString();
                  const isExpanded = expandedMessageIds.has(msgKey);
                  const isLast = idx === selectedThread.messages.length - 1;

                  const emailAvatarBg = getAvatarColor(email.from || "");
                  const emailInitials = getInitialsFromStr(email.from || "");

                  return (
                    <div
                      key={email.messageId || idx}
                      className="rounded-lg mb-2 overflow-hidden"
                      style={{
                        border: isExpanded ? `1px solid ${GMAIL.border}` : "none",
                      }}
                    >
                      {/* collapsed / header row */}
                      <div
                        onClick={() =>
                          toggleMessageExpanded(msgKey)
                        }
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                          isExpanded ? "bg-white" : "hover:bg-[#F5F6F7] bg-[#F5F6F7] rounded-lg"
                        }`}
                      >
                        <ShadAvatar className="h-8 w-8 shrink-0 mt-0.5">
                          <AvatarFallback
                            style={{ backgroundColor: emailAvatarBg }}
                            className="text-white text-[11px] font-semibold"
                          >
                            {emailInitials}
                          </AvatarFallback>
                        </ShadAvatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <div className="min-w-0 flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-[13.5px] font-semibold text-[#202124]">
                                {getName(email.from)}
                              </span>

                              {!isExpanded && (
                                <span className="text-[12.5px] text-[#5F6368] truncate">
                                  {getPreview(email.body || "", 90)}
                                </span>
                              )}

                              {isExpanded && (
                                <span className="text-[12px] text-[#5F6368]">
                                  {"<" + (email.from?.match(/<(.+)>/)?.[1] || email.from) + ">"}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[12px] text-[#5F6368] tabular-nums">
                                {email.createdAt
                                  ? new Date(email.createdAt).toLocaleString([], {
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>

                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-[#5F6368]" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-[#5F6368]" />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <span className="text-[12px] text-[#5F6368]">
                              to{" "}
                              {Array.isArray(email.to) ? email.to.join(", ") : email.to}
                            </span>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1">
                          <div
                            className="text-[14px] leading-6 text-[#202124] break-words"
                            dangerouslySetInnerHTML={{ __html: email.body }}
                          />

                          {/* ATTACHMENTS */}
                          {email.attachments?.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-[#E0E0E0]">
                              <div className="flex flex-wrap gap-2">
                                {email.attachments.map((att, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => openAttachment(att)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E0E0E0] bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-shadow"
                                  >
                                    <Paperclip className="h-3.5 w-3.5 text-[#5F6368] shrink-0" />

                                    <span className="text-[12px] font-medium text-[#202124] truncate max-w-[160px]">
                                      {att.filename}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* inline reply/forward pill row, only meaningful on the last message */}
                          {isLast && replyingToMessageId !== msgKey && (
                            <div className="mt-4 flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setReplyMode("reply");
                                  setReplyingToMessageId(msgKey);
                                  setReplyText("");
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#E0E0E0] text-[13px] font-medium text-[#202124] hover:bg-[#F1F3F4] transition-colors"
                              >
                                <Reply className="h-4 w-4" />
                                Reply
                              </button>

                              <button
                                onClick={() => {
                                  setReplyMode("replyAll");
                                  setReplyingToMessageId(msgKey);
                                  setReplyText("");
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#E0E0E0] text-[13px] font-medium text-[#202124] hover:bg-[#F1F3F4] transition-colors"
                              >
                                <ReplyAll className="h-4 w-4" />
                                Reply all
                              </button>

                              <button
                                onClick={() => {
                                  setReplyMode("forward");
                                  setReplyingToMessageId(msgKey);
                                  setReplyText("");
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#E0E0E0] text-[13px] font-medium text-[#202124] hover:bg-[#F1F3F4] transition-colors"
                              >
                                <Forward className="h-4 w-4" />
                                Forward
                              </button>
                            </div>
                          )}

                          {/* REPLY COMPOSER */}
                          {replyingToMessageId === msgKey && (
                            <div className="mt-4 rounded-2xl border border-[#E0E0E0] shadow-[0_1px_3px_rgba(0,0,0,0.15)] overflow-hidden">
                              <div className="px-4 pt-3 pb-1 text-[12px] text-[#5F6368]">
                                {replyMode === "forward" ? "To" : getName(email.from)}
                              </div>

                              <textarea
                                autoFocus
                                placeholder={
                                  replyMode === "forward"
                                    ? "Add a message…"
                                    : `Reply to ${getName(email.from)}…`
                                }
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                                className="w-full bg-transparent px-4 pt-1 pb-2 text-[14px] text-[#202124] resize-none outline-none"
                              />

                              <div className="flex items-center justify-between px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      sendReply();
                                      setReplyingToMessageId(null);
                                    }}
                                    className="flex items-center gap-2 h-9 px-5 rounded-full text-white text-[13.5px] font-medium transition-colors"
                                    style={{ backgroundColor: GMAIL.blue }}
                                  >
                                    Send
                                    <SendIcon className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    title="Attach files"
                                    className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#F1F3F4] text-[#5F6368]"
                                  >
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => {
                                    setReplyingToMessageId(null);
                                    setReplyText("");
                                  }}
                                  className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#F1F3F4] text-[#5F6368]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Mail className="h-12 w-12 text-[#DADCE0]" strokeWidth={1.5} />

            <p className="text-[14px] text-[#5F6368]">
              Select a conversation to read
            </p>
          </div>
        )}
      </div>

      {/* ATTACHMENT PREVIEW */}
      {previewFile && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="w-[85%] h-[90%] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-[#E0E0E0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0E0E0] shrink-0">
              <span className="text-[13px] font-semibold text-[#202124]">
                {previewFile.filename}
              </span>

              <button
                onClick={() => setPreviewFile(null)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#F1F3F4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {previewFile.mimeType?.startsWith("image/") ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.filename}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-none"
                  title="Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMPOSE DRAWER */}
      <ComposeEmailDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </div>
  );
};

export default EmailViewer;
