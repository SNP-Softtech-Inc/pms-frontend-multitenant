

// import React, { useState, useEffect } from "react";
// import { Plus, X } from "lucide-react";

// import NewChatDrawer from "./NewChat";
// import ChatDetails from "./ChatDetails";

// // ✅ NEW AUTH HOOK
// import { useAuth } from "../../context/AuthContext";
// // ✅ API SERVICE
// import { internalChatAPI } from "../../services/api";
// import { useAutoRefresh } from "../../hooks/useAutoRefresh";
// import { keepIfSame } from "../../lib/autoRefresh";

// const InternalCommunication = () => {
//   const { user } = useAuth();
//   const loginUserId = user?._id || user?.id;

//   const [open, setOpen] = useState(false);
//   const [chatList, setChatList] = useState([]);
//   const [chatId, setChatId] = useState("");
//   const [selectedChat, setSelectedChat] = useState(null);

//   // ================= GET CHAT LIST =================
//   const getsChatlist = async () => {
//     try {
//       if (!loginUserId) return;

//       const res = await internalChatAPI.getChatsByUserId(loginUserId);
//       const chatsData = Array.isArray(res.data.chats) ? res.data.chats : [];

//       setChatList(chatsData);
//     } catch (error) {
//       console.error("Error fetching chat list:", error);
//     }
//   };

//   useEffect(() => {
//     if (loginUserId) {
//       getsChatlist();
//     }
//   }, [loginUserId]);

//   // ================= COUNT UNREAD =================
//   const countUnreadMessages = (chat) => {
//     if (!chat.description) return 0;

//     return chat.description.reduce((count, msg) => {
//       if (msg.isRead === false && msg.senderid?._id !== loginUserId) {
//         return count + 1;
//       }
//       return count;
//     }, 0);
//   };

//   // ================= OPEN CHAT =================
//   const handleShowChat = async (id) => {
//     try {
//       await internalChatAPI.markAllMessagesAsRead(id);

//       const chat = chatList.find((c) => c._id === id);
//       setSelectedChat(chat);
//       setChatId(id);

//       getsChatlist();
//     } catch (error) {
//       console.error("Error marking read:", error);
//     }
//   };

//   // ================= GET CHAT DETAILS =================
//   const getsChatDetails = async () => {
//     try {
//       if (!chatId) return;

//       const res = await internalChatAPI.getChatById(chatId);
//       setSelectedChat(res.data.chat);
//     } catch (error) {
//       console.error("Error fetching chat:", error);
//     }
//   };

//   // Auto refresh, every 15s like the other chats: the list, and the open
//   // conversation. Unchanged data is kept as it is - ChatDetails scrolls to the
//   // bottom whenever a conversation "changes" - and an answer for a chat the
//   // user has since left is dropped.
//   useAutoRefresh(
//     async () => {
//       const listRes = await internalChatAPI.getChatsByUserId(loginUserId);
//       setChatList(keepIfSame(Array.isArray(listRes.data.chats) ? listRes.data.chats : []));

//       if (!chatId) return;
//       const asked = chatId;
//       const chatRes = await internalChatAPI.getChatById(asked);
//       setSelectedChat((current) =>
//         current && current._id && current._id !== asked ? current : keepIfSame(chatRes.data.chat)(current),
//       );
//     },
//     { intervalMs: 15000, enabled: Boolean(loginUserId) },
//   );

//   return (
//     <div className="mt-4">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-semibold text-foreground tracking-tight">
//           Communications
//         </h1>

//         <button
//           onClick={() => setOpen(true)}
//           className="inline-flex items-center justify-center gap-1.5 h-10 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
//         >
//           <Plus className="h-4 w-4" /> New Communication
//         </button>
//       </div>

//       {/* EMPTY STATE */}
//       {chatList.length === 0 ? (
//         <div className="text-center mt-32 text-muted-foreground space-y-3">
//           <h3 className="text-lg font-medium text-foreground">
//             No Communications Found
//           </h3>
//           <button
//             onClick={() => setOpen(true)}
//             className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium border border-input rounded-lg text-foreground bg-background hover:bg-muted transition-colors"
//           >
//             Create New
//           </button>
//         </div>
//       ) : (
//         /* MAIN WORKSPACE WRAPPER */
//         <div className="flex h-[85vh] gap-4 rounded-xl overflow-hidden border border-border bg-background">
          
//           {/* LEFT PANEL (CHAT LIST) */}
//           <div className="w-[30%] bg-muted/20 overflow-y-auto border-r border-border p-2 space-y-1">
//             {chatList.map((chat) => {
//               const receiver = chat.participants.find(
//                 (p) => p._id !== loginUserId
//               );

//               const unreadCount = countUnreadMessages(chat);
//               const latestMessage = chat.description?.[chat.description.length - 1];
//               // Stripping tags with a regex leaves HTML entities (e.g.
//               // "&nbsp;") visible as literal text; parse and read
//               // .textContent instead so entities are decoded correctly.
//               const preview = latestMessage?.message
//                 ? new DOMParser().parseFromString(latestMessage.message, "text/html").body.textContent.trim()
//                 : "";
//               const isSelected = selectedChat?._id === chat._id;

//               return (
//                 <div
//                   key={chat._id}
//                   onClick={() => handleShowChat(chat._id)}
//                   className={`group p-3 rounded-lg cursor-pointer transition-all border border-transparent select-none ${
//                     isSelected
//                       ? "bg-primary/10 border-primary/20 text-primary-foreground"
//                       : "hover:bg-muted/80 text-foreground"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between gap-2 mb-1">
//                     <p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
//                       {receiver?.username}
//                     </p>

//                     {unreadCount > 0 && (
//                       <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold rounded-full bg-primary text-primary-foreground">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-xs text-muted-foreground truncate max-w-[240px]">
//                     {preview.slice(0, 40)}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* RIGHT PANEL (CHAT COMPONENT PANEL) */}
//           <div className="w-[70%] bg-background flex flex-col">
//             {selectedChat ? (
//               <>
//                 {/* HEAD CONTAINER WITH CLOSE BUTTON */}
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20 shrink-0">
//                   <h2 className="text-sm font-semibold text-foreground">
//                     Chat
//                   </h2>

//                   <button
//                     onClick={() => setSelectedChat(null)}
//                     className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>

//                 {/* ACTIVE CHAT WORKSPACE BODY */}
//                 <div className="flex-1 overflow-hidden">
//                   <ChatDetails
//                     chat={selectedChat}
//                     getsChatDetails={getsChatDetails}
//                     getsChatlist={getsChatlist}
//                     loginUserId={loginUserId}
//                   />
//                 </div>
//               </>
//             ) : (
//               /* UNSELECTED STATE PLATFORM */
//               <div className="flex-1 flex items-center justify-center text-muted-foreground">
//                 <h3 className="text-base font-medium">
//                   Select a chat to start messaging
//                 </h3>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* NEW CHAT CUSTOM TAILWIND DRAWER OVERLAY */}
//       <NewChatDrawer
//         open={open}
//         handleClose={() => setOpen(false)}
//         getsChatlist={getsChatlist}
//       />
//     </div>
//   );
// };

// export default InternalCommunication;


import React, { useState, useEffect } from "react";
import { Plus, Search, Check, CheckCheck, MessageSquare } from "lucide-react";

import NewChatDrawer from "./NewChat";
import ChatDetails from "./ChatDetails";

// ✅ NEW AUTH HOOK
import { useAuth } from "../../context/AuthContext";
// ✅ API SERVICE
import { internalChatAPI } from "../../services/api";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import { keepIfSame } from "../../lib/autoRefresh";

// "Nov 11" style date for the list
const formatListDate = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

// Message HTML -> plain text (decodes entities like &nbsp;)
const toPlainText = (html) =>
  html ? new DOMParser().parseFromString(html, "text/html").body.textContent.trim() : "";

const InternalCommunication = () => {
  const { user } = useAuth();
  const loginUserId = user?._id || user?.id;

  const [open, setOpen] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");

  // ================= GET CHAT LIST =================
  const getsChatlist = async () => {
    try {
      if (!loginUserId) return;

      const res = await internalChatAPI.getChatsByUserId(loginUserId);
      const chatsData = Array.isArray(res.data.chats) ? res.data.chats : [];

      setChatList(chatsData);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    if (loginUserId) {
      getsChatlist();
    }
  }, [loginUserId]);

  // ================= COUNT UNREAD =================
  const countUnreadMessages = (chat) => {
    if (!chat.description) return 0;

    return chat.description.reduce((count, msg) => {
      if (msg.isRead === false && msg.senderid?._id !== loginUserId) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  // ================= OPEN CHAT =================
  const handleShowChat = async (id) => {
    try {
      await internalChatAPI.markAllMessagesAsRead(id);

      const chat = chatList.find((c) => c._id === id);
      setSelectedChat(chat);
      setChatId(id);

      getsChatlist();
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  // ================= GET CHAT DETAILS =================
  const getsChatDetails = async () => {
    try {
      if (!chatId) return;

      const res = await internalChatAPI.getChatById(chatId);
      setSelectedChat(res.data.chat);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  // Auto refresh, every 15s like the other chats: the list, and the open
  // conversation. Unchanged data is kept as it is - ChatDetails scrolls to the
  // bottom whenever a conversation "changes" - and an answer for a chat the
  // user has since left is dropped.
  useAutoRefresh(
    async () => {
      const listRes = await internalChatAPI.getChatsByUserId(loginUserId);
      setChatList(keepIfSame(Array.isArray(listRes.data.chats) ? listRes.data.chats : []));

      if (!chatId) return;
      const asked = chatId;
      const chatRes = await internalChatAPI.getChatById(asked);
      setSelectedChat((current) =>
        current && current._id && current._id !== asked ? current : keepIfSame(chatRes.data.chat)(current),
      );
    },
    { intervalMs: 15000, enabled: Boolean(loginUserId) },
  );

  const isMine = (msg) => msg?.senderid?._id === loginUserId || msg?.senderid === loginUserId;

  const filteredChats = chatList.filter((chat) => {
    if (!search.trim()) return true;
    const receiver = chat.participants?.find((p) => p._id !== loginUserId);
    return receiver?.username?.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <div className="mt-4">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Communications</h1>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Communication
        </button>
      </div>

      {/* EMPTY STATE */}
      {chatList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-24 py-16 space-y-3 rounded-2xl border border-slate-200 bg-white">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No communications yet</h3>
          <p className="text-sm text-slate-500">Start a conversation with a teammate.</p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start a chat
          </button>
        </div>
      ) : (
        /* MAIN WORKSPACE: two separate rounded cards, like the reference */
        <div className="flex h-[85vh] gap-4">
          {/* LEFT PANEL (CHAT LIST) */}
          <div className="w-[32%] min-w-[280px] flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus-within:border-primary/40 focus-within:bg-white transition-colors">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chats"
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredChats.length === 0 && (
                <p className="text-center text-sm text-slate-500 mt-8">No chats match “{search}”</p>
              )}

              {filteredChats.map((chat) => {
                const receiver = chat.participants.find((p) => p._id !== loginUserId);
                const unreadCount = countUnreadMessages(chat);
                const latestMessage = chat.description?.[chat.description.length - 1];
                const preview = toPlainText(latestMessage?.message);
                const isSelected = selectedChat?._id === chat._id;
                const lastIsMine = latestMessage && isMine(latestMessage);
                const senderName = lastIsMine
                  ? user?.username || "You"
                  : latestMessage?.senderid?.username || receiver?.username;

                return (
                  <div
                    key={chat._id}
                    onClick={() => handleShowChat(chat._id)}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer select-none border transition-colors ${
                      isSelected
                        ? "bg-primary/10 border-primary/25"
                        : unreadCount > 0
                        ? "bg-slate-50 border-transparent hover:bg-slate-100"
                        : "bg-white border-transparent hover:bg-slate-50"
                    }`}
                  >
                    {/* Name + date */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{receiver?.username}</p>

                      <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-500">
                        {lastIsMine &&
                          (latestMessage.isRead ? (
                            <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-slate-400" />
                          ))}
                        <span>{formatListDate(latestMessage?.time)}</span>
                      </div>
                    </div>

                    {/* "Sender: last message" + unread badge */}
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 truncate">
                        {latestMessage ? (
                          <>
                            <span className="font-semibold text-slate-600">{senderName}: </span>
                            {preview}
                          </>
                        ) : (
                          "No messages yet"
                        )}
                      </p>

                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-primary text-primary-foreground shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL (CONVERSATION) */}
          <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {selectedChat ? (
              <ChatDetails
                chat={selectedChat}
                getsChatDetails={getsChatDetails}
                getsChatlist={getsChatlist}
                loginUserId={loginUserId}
                onClose={() => setSelectedChat(null)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-50/60 px-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Select a chat to start messaging</h3>
                <p className="text-sm text-slate-500 mt-1">Your conversations will show up here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW CHAT DRAWER */}
      <NewChatDrawer open={open} handleClose={() => setOpen(false)} getsChatlist={getsChatlist} />
    </div>
  );
};

export default InternalCommunication;