import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useToastContext } from "../../context/ToastContext";
import { chatAPI, accountsAPI } from "../../services/api";
import ChatDetails from "./Communication/ChatDetails";
import NewChatDrawer from "./Communication/NewChatDrawer";
import { useConfirm } from "../../components/ConfirmDialogContext";
import {
  Trash2,
  Archive,
  X,
  Check,
  Search,
  MoreVertical,
  Pin,
  Star,Loader2 
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
// shadcn/ui components
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Card } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";

const Communication = () => {
  const { accountId } = useParams();
  const { showToast } = useToastContext();
  const confirm = useConfirm();
  const [chatList, setChatList] = useState([]);
  const [filteredChatList, setFilteredChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [accountName, setAccountName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedChats, setPinnedChats] = useState([]);
const [isChatLoading, setIsChatLoading] = useState(false);
  // ================= ACCOUNT DETAILS =================
  const fetchAccountDetails = async (accountId) => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccountName(res.data.accountName);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountDetails(accountId);
    }
  }, [accountId]);

  // ================= CHAT LIST =================
  const accountwiseChatlist = async (accId, active) => {
    try {
      const res = await chatAPI.getChatsByAccountAndStatus(
        accId,
        active,
        "admin",
      );
      const chats = res.data.chataccountwise || [];
      setChatList(chats);
      setFilteredChatList(chats);

      console.log("Fetched chat list:", chats);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    accountwiseChatlist(accountId, isActiveTrue);
  }, [accountId, isActiveTrue]);

  // Filter chats based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChatList(chatList);
    } else {
      const filtered = chatList.filter(
        (chat) =>
          chat.chatsubject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.accountid?.accountName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (chat.description?.slice(-1)[0]?.message || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredChatList(filtered);
    }
  }, [searchQuery, chatList]);

  // ================= HELPERS =================
  const countUnreadAdminMessages = (chat) => {
    if (!chat.description) return 0;
    return chat.description.reduce((count, msg) => {
      return msg.isRead === false && msg.fromwhome === "client"
        ? count + 1
        : count;
    }, 0);
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name.charAt(0).toUpperCase();
  };

  // ================= CHAT ACTIONS =================

  const handleShowChat = async (chatId) => {
     setIsChatLoading(true);
    try {
      await chatAPI.markAllAsRead(chatId, accountId, "client");

      setChatId(chatId);

      const res = await chatAPI.getChatById(chatId, "admin");
      setSelectedChat(res.data.chat);

      await accountwiseChatlist(accountId, isActiveTrue);
    } catch (error) {
      console.error("Mark read error:", error);
    }
    finally {
    setIsChatLoading(false);
  }
  };
  const getsChatDetails = async () => {
    try {
      const res = await chatAPI.getChatById(chatId, "admin");
      setSelectedChat(res.data.chat);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  // ================= BULK ACTIONS =================
  const handleCheckboxChange = (id) => {
    setSelectedChatIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isChatSelected = (id) => selectedChatIds.includes(id);

  const handleBulkDelete = () => {
    confirm({
      title: "Delete Chats",
      description: "Are you sure you want to delete selected chats?",
      onConfirm: async () => {
        try {
          await Promise.all(
            selectedChatIds.map((id) => chatAPI.deleteChatForAdmin(id)),
          );
          showToast({
            title: "Chats deleted",
            type: "success",
          });
          setSelectedChatIds([]);
          if (selectedChat && selectedChatIds.includes(selectedChat._id)) {
            setSelectedChat(null);
          }
          accountwiseChatlist(accountId, isActiveTrue);
        } catch (error) {
          console.error(error);
          showToast({
            title: "Failed to delete chats",
            type: "error",
          });
        }
      },
    });
  };

  const handleArchiveJob = async (id) => {
    try {
      await chatAPI.updateChat(id, { active: !isActiveTrue });
      showToast({
        title: "Updated successfully",
        type: "success",
      });
      accountwiseChatlist(accountId, isActiveTrue);
      setSelectedChatIds([]);
    } catch (err) {
      showToast({
        title: "Failed to update chat",
        type: "error",
      });
    }
  };

  const handleBulkArchive = () => {
    selectedChatIds.forEach(handleArchiveJob);
  };

  const handlePinChat = (chatId, e) => {
    e.stopPropagation();
    setPinnedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [chatId, ...prev],
    );
  };

  const isChatPinned = (chatId) => pinnedChats.includes(chatId);

  const sortedChats = [...filteredChatList].sort((a, b) => {
    const aPinned = isChatPinned(a._id);
    const bPinned = isChatPinned(b._id);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    const aLastMessage = a.description?.[a.description.length - 1];
    const bLastMessage = b.description?.[b.description.length - 1];

    const aTime = new Date(
      aLastMessage?.time || aLastMessage?.createdAt || a.updatedAt,
    ).getTime();

    const bTime = new Date(
      bLastMessage?.time || bLastMessage?.createdAt || b.updatedAt,
    ).getTime();

    return bTime - aTime;
  });
const getTickStatus = (message) => {
  // Only show ticks for admin's messages
  if (message.fromwhome === 'client') {
    return null; // No ticks
  }

  // Admin's messages
  if (message.isRead === true) {
    return '✓✓'; // Read (Blue double tick in WhatsApp)
  }

  // If you had an 'isDelivered' field:
  // if (message.isDelivered === true) {
  //   return '✓✓'; // Delivered (Grey double tick)
  // }

  return '✓'; // Sent (Single grey tick)
};
  // Usage in your component
const renderMessage = (message) => {
  const ticks = getTickStatus(message);
  
  return (
    <div>
      {/* <span>{message.message}</span> */}
      {ticks && (
        <span style={{ 
          marginLeft: '4px',
          color: ticks === '✓✓' ? '#4FC3F7' : '#999' // Blue for read, grey for sent/delivered
        }}>
          {ticks}
        </span>
      )}
      <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
        {formatTime(message.time)}
      </span>
    </div>
  );
};
  return (
    <div className="mt-4 bg-background">
      {/* HEADER */}
      <div
        className="
        mb-4 flex flex-col gap-4
        rounded-2xl border border-border
        bg-card px-4 py-4 shadow-sm
        lg:flex-row lg:items-center lg:justify-between
      "
      >
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1
              className="text-foreground font-semibold"
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "calc(1.2rem * parseFloat(var(--font-scale)) / 100)",
              }}
            >
              Chats & Tasks
            </h1>
            <p
              className="text-muted-foreground mt-0.5"
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
              }}
            >
              Manage conversations, tasks, and client communication
            </p>
          </div>

          <Tabs
            value={isActiveTrue ? "active" : "archived"}
            onValueChange={(val) => setIsActiveTrue(val === "active")}
            className="w-auto"
          >
            <TabsList className="h-10 rounded-xl border border-border bg-muted/40 p-1">
              <TabsTrigger
                value="active"
                className="rounded-lg px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="rounded-lg px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {selectedChatIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="rounded-xl border-destructive/30 text-destructive transition-all hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
                className="rounded-xl border-border transition-all hover:bg-muted"
              >
                <Archive className="mr-1 h-4 w-4" />
                {isActiveTrue ? "Archive" : "Unarchive"}
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="rounded-xl px-5 shadow-sm transition-all"
        >
          New Chat
        </Button>
      </div>

      {/* MAIN */}

      {/* <div className="grid h-[85vh] gap-4 grid-cols-[360px_minmax(0,1fr)]"> */}
<div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6 h-[80vh]">
        <div className="sm:col-span-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm flex flex-col min-w-0">
          {" "}
          <ScrollArea className="flex-1">
            <div className="space-y-0.5 p-2">
              {sortedChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FaTelegramPlane className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    No conversations
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Start a new chat to begin
                  </p>
                </div>
              ) : (
                sortedChats.map((chat) => {
                  const unread = countUnreadAdminMessages(chat);
        const isLoading = isChatLoading && selectedChat?._id === chat._id;

                  const lastMessage =
                    chat.description?.length > 0
                      ? chat.description[chat.description.length - 1]
                      : null;

                  let lastMessageText = "No messages yet";
                  let imageSrc = null;

                  if (lastMessage?.message) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                      lastMessage.message,
                      "text/html",
                    );

                    // Get image
                    const img = doc.querySelector("img");
                    if (img) {
                      imageSrc = img.getAttribute("src");
                    }

                    // Get text (if any)
                    lastMessageText = doc.body.textContent.trim();
                  }

                  const lastMessageSender = !lastMessage
                    ? ""
                    : lastMessage.fromwhome === "Admin"
                      ? lastMessage.senderid || "You"
                      : lastMessage.senderid || "Client";

                  const truncatedMessage =
                    lastMessageText.length > 30
                      ? lastMessageText.substring(0, 30) + "..."
                      : lastMessageText;
                      const truncatedSubject =
  (chat.chatsubject || "No subject").length > 30
    ? (chat.chatsubject || "No subject").substring(0, 30) + "..."
    : (chat.chatsubject || "No subject");
                  return (
                    <div
                      key={chat._id}
                      className={`
                      group relative flex cursor-pointer items-start gap-2 rounded-xl p-2.5
                      transition-all duration-150
                      ${
                        selectedChat?._id === chat._id
                          ? "bg-primary/10 ring-1 ring-primary/20"
                          : "hover:bg-muted/50"
                      }
                                    ${isLoading ? "pointer-events-none" : ""}

                    `}
                      onClick={() => handleShowChat(chat._id)}
                    >
                                  {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl z-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

                      {/* Checkbox */}
                      <div
                        className={`
                        shrink-0 transition-opacity duration-150 mt-0.5
                        ${
                          selectedChatIds.includes(chat._id) ||
                          selectedChat?._id === chat._id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }
                        ${isLoading ? "opacity-50" : ""}
                      `}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isChatSelected(chat._id)}
                          onCheckedChange={() => handleCheckboxChange(chat._id)}
                          className="h-3.5 w-3.5"
                                          disabled={isLoading}

                        />
                      </div>

                      {/* Content Container */}
                      <div className="flex-1 min-w-0">
                        {/* Row 1: Name and Time */}
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-sm font-semibold text-foreground truncate flex-1">
                            {chat.accountid?.accountName || "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {/* {formatTime(
                              lastMessage?.time ||
                                lastMessage?.createdAt ||
                                chat.updatedAt,
                            )} */}
                            {renderMessage(lastMessage || { message: "No messages yet", time: chat.updatedAt, fromwhome: "client" })}
                          </span>
                        </div>

                        {/* Row 2: Subject */}
                        {/* <div className="text-xs font-medium text-foreground/80 truncate mt-0.5">
                          {chat.chatsubject || "No subject"}
                        </div> */}
<div className="text-xs font-medium text-foreground/80 mt-0.5">
  {truncatedSubject}
</div>
                        {/* Row 3: Message Preview + Unread Badge */}
                        {/* <div className="flex justify-between items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-1 min-w-0 flex-1">
                            {lastMessage && (
                              <span className="text-[10px] font-semibold text-muted-foreground shrink-0">
                                {lastMessageSender}:
                              </span>
                            )}

                            {imageSrc ? (
                              <>
                                <img
                                  src={imageSrc}
                                  alt="preview"
                                  className="w-5 h-5 rounded object-cover shrink-0"
                                />

                                <span className="text-[10px] text-muted-foreground truncate">
                                  {lastMessageText ? lastMessageText : "Photo"}
                                </span>
                              </>
                            ) : (
                              <span
                                className="text-[10px] text-muted-foreground truncate"
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {lastMessageText}
                              </span>
                            )}
                          </div>
                          {unread > 0 && (
                            <div className="shrink-0">
                              <Badge className="h-4 min-w-[18px] rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                                {unread}
                              </Badge>
                            </div>
                          )}
                        </div> */}
                        {/* Row 3: Message Preview + Unread Badge */}
<div className="flex justify-between items-center gap-2 mt-0.5">
  <div className="flex items-center gap-1 min-w-0 flex-1">
    {lastMessage && (
      <span className="text-[10px] font-semibold text-muted-foreground shrink-0">
        {lastMessageSender}:
      </span>
    )}

    {imageSrc ? (
      <>
        <img
          src={imageSrc}
          alt="preview"
          className="w-5 h-5 rounded object-cover shrink-0"
        />

        <span className="text-[10px] text-muted-foreground truncate">
          {truncatedMessage || "Photo"}
        </span>
      </>
    ) : (
      <span className="text-[10px] text-muted-foreground truncate">
        {truncatedMessage}
      </span>
    )}
  </div>

  {unread > 0 && (
    <div className="shrink-0">
      <Badge className="h-4 min-w-[18px] rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
        {unread}
      </Badge>
    </div>
  )}
</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* CHAT DETAILS */}
        {/* <div className="sm:col-span-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm min-w-0">
          {selectedChat ? (
            <ChatDetails
              chat={selectedChat}
              getsChatDetails={getsChatDetails}
              accountwiseChatlist={accountwiseChatlist}
              data={accountId}
              accountName={accountName}
              isActiveTrue={isActiveTrue}
              onChatAction={() => {
                setSelectedChat(null);
                accountwiseChatlist(accountId, isActiveTrue);
              }}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <FaTelegramPlane className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  No chat selected
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Select a conversation from the left panel
                </p>
              </div>
            </div>
          )}
        </div> */}
        {/* CHAT DETAILS */}
<div className="sm:col-span-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm min-w-0">
  {isChatLoading ? (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading conversation...</p>
    </div>
  ) : selectedChat ? (
    <ChatDetails
      chat={selectedChat}
      getsChatDetails={getsChatDetails}
      accountwiseChatlist={accountwiseChatlist}
      data={accountId}
      accountName={accountName}
      isActiveTrue={isActiveTrue}
      onChatAction={() => {
        setSelectedChat(null);
        accountwiseChatlist(accountId, isActiveTrue);
      }}
    />
  ) : (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FaTelegramPlane className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">No chat selected</p>
        <p className="mt-1 text-muted-foreground text-sm">
          Select a conversation from the left panel
        </p>
      </div>
    </div>
  )}
</div>
      </div>

      {/* DRAWER */}
      <NewChatDrawer
        open={open}
        handleClose={() => setOpen(false)}
        accountwiseChatlist={accountwiseChatlist}
        data={accountId}
        isActiveTrue={isActiveTrue}
      />
    </div>
  );
};

export default Communication;
