import React, { useEffect, useState, useRef } from "react";
import {useToastContext} from "../../../context/ToastContext"
import { X, Plus, Trash2, CornerUpLeft } from "lucide-react";
import { Check, CheckCheck } from "lucide-react";

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
import TextEditor from "../../../components/TextEditor";
import { MoreVertical, Printer, MailOpen, Mail } from "lucide-react";
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
  const { showToast } = useToastContext();
  console.log("ChatDetails render with chat:", chat);
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

  const getUserOptions = () => {
  const options = [];

  // Group Name
  if (user?.group?.name) {
    options.push({
      label: user.group.name,
      value: user.group.name,
    });
  }

  // Logged-in User
  options.push({
    label: user.username,
    value: user.username,
  });

  // Other Group Members
  user?.group?.members?.forEach((member) => {
    if (member._id !== user.id) {
      options.push({
        label: member.username,
        value: member.username,
      });
    }
  });

  return options;
};
const [changeUserOpen, setChangeUserOpen] = useState(false);
const [selectedMessage, setSelectedMessage] = useState(null);
const [selectedSender, setSelectedSender] = useState("");
const handleChangeUser = (message) => {
  setSelectedMessage(message);
  setSelectedSender(message.senderid || "");
  setChangeUserOpen(true);
};
const handleSaveUserChange = async () => {
  try {
    await chatAPI.updateMessage({
      chatId: chatId,
      messageId: selectedMessage._id,
      senderid: selectedSender,
    });

    showToast({
      title: "User updated successfully",
      type: "success",
    });

    setChangeUserOpen(false);
    setSelectedMessage(null);

    getsChatDetails();
    accountwiseChatlist(data, isActiveTrue);
  } catch (error) {
    showToast({
      title: "Failed to update user",
      type: "error",
    });
  }
};
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
    return currentTime - messageTimestamp <= tenMinutes;
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
      await chatAPI.updateChatDescription(chatId, {
        newDescriptions: [newDescription],
      });
      setEditorContent("");
      setReplyTo(null);
      showToast({
        title: "Message sent",
        type: "success",
      });
      await securemessagechatsend(chatId);
      await updatechatStatus(chatId);
      accountwiseChatlist(data, isActiveTrue);
      getsChatDetails();
    } catch (error) {
      showToast({
        title: "Send failed",
        type: "error",
      });
    }
  };

  const handleEditMessage = (message) => {
    if (!canEditMessage(message.time)) {
      showToast({
        title: "Cannot edit message after 10 minutes",
        type: "error",
      });
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
      showToast({
        title: "Message updated successfully",
        type: "success",
      });
      setEditDialogOpen(false);
      setEditingMessage(null);
      setEditContent("");
      getsChatDetails();
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      showToast({
        title: "Failed to update message",
        type: "error",
      });
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
        task.id === id ? { ...task, checked: !task.checked } : task,
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
      showToast({
        title: "Task updated",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Task update failed",
        type: "error",
      });
    }
  };

  const handleAddTask = () => {
    const maxId =
      tasks.length > 0 ? Math.max(...tasks.map((task) => Number(task.id))) : 0;
    const newTaskItem = { id: maxId + 1, text: "", checked: false };
    setTasks([...tasks, newTaskItem]);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleTaskTextChange = (id, newText) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)),
    );
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

  // const updateAdminChatDescription = async (description) => {
  //   if (!description.trim()) return;
  //   try {
  //     await chatAPI.updateChatDescription(chatId, {
  //       newDescriptions: [
  //         { message: description, fromwhome: "Admin", senderid: senderName },
  //       ],
  //     });
  //     showToast({
  //       title: "Chat description updated successfully",
  //       type: "success",
  //     });
  //     getsChatDetails();
  //     await updatechatStatus(chatId);
  //     accountwiseChatlist(data, isActiveTrue);
  //   } catch (error) {
  //     showToast({
  //       title: "Failed to update chat description",
  //       type: "error",
  //     });
  //   }
  // };
const updateAdminChatDescription = async (message) => {
  if (!message.trim()) return;

  const formData = new FormData();

  formData.append(
    "newDescriptions",
    JSON.stringify([
      {
        message,
        fromwhome: "Admin",
        senderid: senderName,
      },
    ])
  );

  attachments.forEach((file) => {
    formData.append("attachments", file);
  });

  await chatAPI.updateChatDescription(chatId, formData);
};
  const handleDeleteMessage = async (messageToDelete) => {
    try {
      await chatAPI.deleteMessage({ chatId, messageId: messageToDelete._id });
      showToast({
        title: "Message deleted successfully",
        type: "success",
      });
      getsChatDetails();
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      showToast({
        title: "Failed to delete message",
        type: "error",
      });
    }
  };
  const handleMarkAsRead = async (chatId) => {
    try {
      await chatAPI.markThreadAsRead(chatId);

      showToast({
        title: "Chat marked as read",
        type: "success",
      });

      // getsChatDetails();

      // Close the selected chat after marking as read
      onChatAction(); // This will set selectedChat to null in the parent component
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsUnread = async (chatId) => {
    try {
      await chatAPI.markThreadAsUnread(chatId);

      showToast({
        title: "Chat marked as unread",
        type: "success",
      });

      // getsChatDetails();

      // Close the selected chat after marking as unread
      onChatAction(); // This will set selectedChat to null in the parent component
    } catch (error) {
      console.error(error);
    }
  };
  //   const handleMarkAsRead = async (chatId) => {
  //   try {
  //     await chatAPI.markThreadAsRead(chatId);

  //     showToast({
  //       title: "Success",
  //       type: "success",
  //     });

  // getsChatDetails()
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleMarkAsUnread = async (chatId) => {
  //   try {
  //     await chatAPI.markThreadAsUnread(chatId);

  //     toast({
  //       title: "Success",
  //       description: "Thread marked as unread",
  //     });

  //  getsChatDetails()
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handlePrintChat = () => {
    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const printWindow = iframe.contentWindow;
    const isDark = document.documentElement.classList.contains("dark");

    const colors = {
      background: isDark ? "#09090b" : "#f4f6f8",
      text: isDark ? "#fafafa" : "#1f2937",
      bubble: isDark ? "#18181b" : "#ffffff",
      adminBubble: isDark ? "#1e293b" : "#edf3fb",
      border: isDark ? "#27272a" : "#d9dee5",
      muted: isDark ? "#a1a1aa" : "#64748b",
      primary: isDark ? "#60a5fa" : "#2563eb",
    };
    const getStatusIcon = (isRead) => {
      return isRead
        ? `<span class="tick tick-read">✓✓</span>`
        : `<span class="tick">✓</span>`;
    };
    const messagesHtml = chat.description
      ?.map((msg) => {
        const isClient = msg.fromwhome === "client";

        return `
        <div class="message-row ${isClient ? "left" : "right"}">
          ${
            isClient
              ? `
            <div class="avatar">
              ${msg.senderid?.substring(0, 2).toUpperCase() || "CL"}
            </div>
          `
              : ""
          }

          <div class="bubble">
            ${isClient ? `<div class="name">${msg.senderid}</div>` : ""}

            <div class="content">
              ${msg.message || ""}
            </div>

          <div class="footer">
  <span>${formatDate(msg.time || msg.createdAt)}</span>

  ${!isClient ? getStatusIcon(msg.isRead) : ""}
</div>
          </div>
        </div>
      `;
      })
      .join("");

    printWindow.document.write(`
  <html>
  <head>
    <title>Chat Transcript</title>

    <style>
  *{
    box-sizing:border-box;
  }

  body{
    font-family: Inter, Arial, sans-serif;
    background:${colors.background};
    color:${colors.text};
    padding:30px;
  }

  .page{
    max-width:1100px;
    margin:auto;
  }

  .top-bar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:25px;
    font-size:14px;
  }

  .company{
    font-weight:700;
    font-size:18px;
  }

  .thread-info{
    margin-bottom:35px;
  }

  .thread-info p{
    margin:8px 0;
  }

  .thread-info strong{
    display:inline-block;
    width:150px;
  }

  .message-row{
    display:flex;
    margin-bottom:18px;
    align-items:flex-end;
  }

  .message-row.left{
    justify-content:flex-start;
  }

  .message-row.right{
    justify-content:flex-end;
  }

  .avatar{
    width:42px;
    height:42px;
    border-radius:50%;
    background:${colors.primary};
    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:600;
    margin-right:12px;
  }

  .bubble{
    max-width:65%;
    padding:16px;
    border-radius:14px;
    background:${colors.bubble};
    border:1px solid ${colors.border};
  }

  .right .bubble{
    background:${colors.adminBubble};
  }

  .name{
    font-weight:700;
    margin-bottom:10px;
  }

  .content{
    line-height:1.7;
    word-break:break-word;
  }

  .footer{
    margin-top:10px;
    display:flex;
    justify-content:flex-end;
    align-items:center;
    gap:5px;
    font-size:12px;
    color:${colors.muted};
  }

  .tick{
    font-size:13px;
    font-weight:700;
    color:${colors.muted};
  }

  .tick-read{
    color:${colors.primary};
  }

  @media print{
    body{
      padding:0;
      background:white !important;
      color:black !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .bubble{
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
  </head>

  <body>
    <div class="page">

      <div class="top-bar">
        <div>${new Date().toLocaleString()}</div>
        <div class="company">SNP Tax & Financials</div>
      </div>

      <div class="thread-info">
        <p>
          <strong>Print date:</strong>
          ${new Date().toLocaleDateString()}
        </p>

        <p>
          <strong>Thread author:</strong>
          ${chat.accountid?.accountName || accountName}
        </p>

        <p>
          <strong>Thread subject:</strong>
          ${chat.chatsubject}
        </p>
      </div>

      ${messagesHtml}

    </div>
  </body>
  </html>
  `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };
  const handleArchiveThread = async (id) => {
    try {
      await chatAPI.updateChat(id, { active: !chat.active });
      showToast({
        title: chat.active ? "Chat archived" : "Chat activated",
        type: "success",
      });
      accountwiseChatlist(data, isActiveTrue);
      onChatAction();
    } catch (error) {
      showToast({
        title: "Action failed",
        type: "error",
      });
    }
  };

  const handleDeleteThread = async () => {
    try {
      await chatAPI.deleteChat(chatId);
      onChatAction();
      showToast({
        title: "Thread deleted successfully",
        type: "success",
      });
      accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      showToast({
        title: "Failed to delete thread",
        type: "error",
      });
    }
  };

  const getDateLabel = (date) => {
    const msgDate = new Date(date);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (msgDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return msgDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
    }

    return msgDate.toLocaleDateString();
  };

  // ADD HERE 👇
  const groupedMessages = [];

  if (Array.isArray(chat.description)) {
    let lastDate = "";

    chat.description.forEach((msg) => {
      const currentDate = getDateLabel(msg.time || msg.createdAt);

      if (currentDate !== lastDate) {
        groupedMessages.push({
          type: "date",
          label: currentDate,
        });

        lastDate = currentDate;
      }

      groupedMessages.push({
        type: "message",
        data: msg,
      });
    });
  }
  // const latestMessage =
  // chat?.description?.[chat.description.length - 1];
  const latestClientMessage = [...(chat?.description || [])]
    .reverse()
    .find((msg) => msg.fromwhome === "client");
  if (!chat) return null;

  return (
    <div className="flex h-full w-full bg-background rounded-lg overflow-hidden shadow-sm">
      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="min-h-[200px]">
            {/* <Editor onChange={setEditContent} value={editContent} /> */}
            <TextEditor  value={editContent} onChange={setEditContent} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editContent.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* chnage user dialog box */}

      <Dialog open={changeUserOpen} onOpenChange={setChangeUserOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Change User</DialogTitle>
    </DialogHeader>

 <select
  className="w-full border rounded-md p-2"
  value={selectedSender}
  onChange={(e) => setSelectedSender(e.target.value)}
>
  <option value="">Select User</option>

  {getUserOptions().map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setChangeUserOpen(false)}
      >
        Cancel
      </Button>

      <Button onClick={handleSaveUserChange}>
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${showTasks ? "mr-0" : ""}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card/50">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold truncate">
              {chat.accountid?.accountName || accountName}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {chat.chatsubject}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {tasks.length > 0 ? (
              <button
                onClick={toggleTasks}
                className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
              >
                Tasks: {tasks.filter((t) => t.checked).length}/{tasks.length}
              </button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTasks}
                className="h-8 text-xs"
              >
                + Add Task
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handlePrintChat}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Chat
                </DropdownMenuItem>
                {latestClientMessage &&
                  (latestClientMessage.isRead ? (
                    <DropdownMenuItem
                      onClick={() => handleMarkAsUnread(chat._id)}
                    >
                      Mark as Unread
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleMarkAsRead(chat._id)}
                    >
                      Mark as Read
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuItem onClick={() => handleArchiveThread(chatId)}>
                  {chat.active ? "Archive Thread" : "Activate Thread"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteThread}
                  className="text-destructive"
                >
                  Delete Thread
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-3">
            {/* {Array.isArray(chat.description) &&
              chat.description.map((desc, index) => (
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
              ))} */}
            {groupedMessages.map((item, index) => {
              if (item.type === "date") {
                return (
                  <div
                    key={`date-${index}`}
                    className="flex justify-center my-4"
                  >
                    <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium">
                      {item.label}
                    </div>
                  </div>
                );
              }

              return (
                <MessageItem
                  key={item.data._id || index}
                  desc={item.data}
                  chat={chat}
                  messageRefs={messageRefs}
                  highlightedId={highlightedId}
                  setHighlightedId={setHighlightedId}
                  setReplyTo={setReplyTo}
                  formatDate={formatDate}
                  handleDeleteMessage={handleDeleteMessage}
                  handleEditMessage={handleEditMessage}
                  canEditMessage={canEditMessage}
                   user={user}
  handleChangeUser={handleChangeUser}
                />
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <Separator />

        {/* Reply Indicator & Editor */}
        <div className="px-6 py-4 bg-card/30">
          {replyTo && (
            <div className="mb-3 p-3 rounded-md bg-muted/50 border-l-2 border-primary relative">
              <p className="text-xs font-medium text-primary mb-1">
                Replying to{" "}
                {replyTo.fromwhome === "client" ? replyTo.senderid : "Admin"}
              </p>
              <div
                className="text-xs text-muted-foreground line-clamp-2 pr-6"
                dangerouslySetInnerHTML={{ __html: replyTo.message }}
              />
              <button
                onClick={() => setReplyTo(null)}
                className="absolute right-2 top-2 p-1 rounded hover:bg-background"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              {/* <Editor onChange={handleEditorChange} value={editorContent} /> */}
              <TextEditor value={editorContent} onChange={handleEditorChange} />
            </div>
            <Button
              onClick={() => updateChatDescription()}
              className="h-10 px-5"
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Tasks Sidebar */}
      {showTasks && (
        <div className="w-80 flex flex-col border-l bg-card/50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-medium">Client Tasks</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddTask}
                className="h-7 w-7"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTasks}
                className="h-7 w-7"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-3">
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded-md border bg-background"
                >
                  <Checkbox
                    checked={task.checked}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    className="h-4 w-4"
                  />
                  <Input
                    value={task.text}
                    onChange={(e) =>
                      handleTaskTextChange(task.id, e.target.value)
                    }
                    placeholder="Task description..."
                    className={`h-8 text-sm border-0 shadow-none focus-visible:ring-0 px-1 ${
                      task.checked ? "line-through text-muted-foreground" : ""
                    }`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <Button onClick={resendClientTask} className="w-full text-sm h-9">
              Resend Tasks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
const MessageStatus = ({ isRead }) => {
  return isRead ? (
    <CheckCheck size={14} className="text-primary" />
  ) : (
    <Check size={14} className="text-muted-foreground" />
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
  canEditMessage,user,handleChangeUser,
}) => {
  const isClient = desc.fromwhome?.toLowerCase() === "client";
  const isAdmin = desc.fromwhome === "Admin";
  const isEditable = isAdmin && canEditMessage(desc.time);

  return (
    <div
      ref={(el) => desc._id && (messageRefs.current[desc._id] = el)}
      className={`flex ${isClient ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`
          relative max-w-[75%] rounded-lg px-4 py-2.5
          ${desc._id === highlightedId ? "ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-950/30" : ""}
          ${isAdmin ? "bg-primary/5 border border-primary/10" : "bg-muted/30 border"}
        `}
      >
        {/* Reply Preview */}
        {desc.replyTo && (
          <ReplyPreviewItem
            desc={desc}
            chat={chat}
            messageRefs={messageRefs}
            setHighlightedId={setHighlightedId}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="text-xs font-medium text-foreground/80">
            {desc.senderid}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setReplyTo(desc)}>
                <CornerUpLeft className="mr-2 h-3.5 w-3.5" />
                Reply
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  {isEditable && (
                    <DropdownMenuItem onClick={() => handleEditMessage(desc)}>
                      Edit
                    </DropdownMenuItem>
                  )}
                      {user?.role === "team_member" && (
      <DropdownMenuItem onClick={() => handleChangeUser(desc)}>
        Change User
      </DropdownMenuItem>
    )}

                  <DropdownMenuItem
                    onClick={() => handleDeleteMessage(desc)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Message Content */}

        <div
          className="text-sm leading-relaxed break-words whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: desc.message || "No message available",
          }}
        />

        {/* Footer */}

        <div className="flex items-center justify-end gap-1 mt-1.5">
          <span className="text-[11px] text-muted-foreground">
            {desc.time ? formatDate(desc.time) : "Just now"}
          </span>

          {isAdmin && <MessageStatus isRead={desc.isRead} />}
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
    <div
      onClick={scrollToOriginal}
      className="mb-2 p-2 rounded bg-black/5 dark:bg-white/5 border-l-2 border-blue-500 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
    >
      <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
        {repliedMsg.fromwhome === "client" ? repliedMsg.senderid : "You"}
      </p>
      <div
        className="text-xs text-muted-foreground line-clamp-2"
        dangerouslySetInnerHTML={{ __html: repliedMsg.message }}
      />
    </div>
  );
};

export default ChatDetails;
