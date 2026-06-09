import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {

  X,
  Plus,
  Trash2,
  CornerUpLeft,
  Check,
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
import {
  MoreVertical,
  Printer,
  MailOpen,
  Mail,
} from "lucide-react";
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
      toast.success("Task updated");
    } catch (error) {
      toast.error("Task update failed");
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

  const updateAdminChatDescription = async (description) => {
    if (!description.trim()) return;
    try {
      await chatAPI.updateChatDescription(chatId, {
        newDescriptions: [
          { message: description, fromwhome: "Admin", senderid: senderName },
        ],
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
const handlePrintChat = () => {
  const printWindow = window.open("", "_blank");

  const messagesHtml = chat.description
    ?.map(
      (msg) => `
      <div class="message ${msg.fromwhome === "client" ? "client" : "admin"}">
        <div class="header">
          <strong>${
            msg.fromwhome === "client"
              ? msg.senderid || "Client"
              : "Admin"
          }</strong>
          <span>${formatDate(msg.createdAt)}</span>
        </div>
        <div class="body">
          ${msg.message || ""}
        </div>
      </div>
    `
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>${chat.chatsubject}</title>
        <style>
          body{
            font-family: Arial, sans-serif;
            padding:30px;
            color:#222;
            background:#fff;
          }

          .header-section{
            border-bottom:2px solid #e5e7eb;
            margin-bottom:25px;
            padding-bottom:15px;
          }

          .account{
            font-size:24px;
            font-weight:700;
          }

          .subject{
            color:#666;
            margin-top:5px;
          }

          .message{
            margin-bottom:20px;
            padding:15px;
            border-radius:10px;
            border:1px solid #e5e7eb;
          }

          .admin{
            background:#f8fafc;
          }

          .client{
            background:#eef6ff;
          }

          .header{
            display:flex;
            justify-content:space-between;
            margin-bottom:10px;
            font-size:12px;
            color:#666;
          }

          .body{
            font-size:14px;
            line-height:1.6;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          table td,
          table th{
            border:1px solid #ddd;
            padding:8px;
          }

          @media print{
            body{
              padding:0;
            }
          }
        </style>
      </head>

      <body>
        <div class="header-section">
          <div class="account">
            ${chat.accountid?.accountName || accountName}
          </div>

          <div class="subject">
            ${chat.chatsubject}
          </div>
        </div>

        ${messagesHtml}
      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 500);
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
    <div className="flex h-full w-full bg-background rounded-lg overflow-hidden shadow-sm">
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="min-h-[200px]">
            <Editor onChange={setEditContent} value={editContent} />
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

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${showTasks ? "mr-0" : ""}`}>
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
              <Button variant="ghost" size="sm" onClick={toggleTasks} className="h-8 text-xs">
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
                <DropdownMenuItem onClick={() => handleArchiveThread(chatId)}>
                  {chat.active ? "Archive Thread" : "Activate Thread"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteThread} className="text-destructive">
                  Delete Thread
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-3">
            {Array.isArray(chat.description) &&
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
              ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <Separator />

        {/* Reply Indicator & Editor */}
        <div className="px-6 py-4 bg-card/30">
          {replyTo && (
            <div className="mb-3 p-3 rounded-md bg-muted/50 border-l-2 border-primary relative">
              <p className="text-xs font-medium text-primary mb-1">
                Replying to {replyTo.fromwhome === "client" ? replyTo.senderid : "Admin"}
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
              <Editor onChange={handleEditorChange} value={editorContent} />
            </div>
            <Button onClick={() => updateChatDescription()} className="h-10 px-5">
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
              <Button variant="ghost" size="icon" onClick={handleAddTask} className="h-7 w-7">
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTasks} className="h-7 w-7">
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
                    onChange={(e) => handleTaskTextChange(task.id, e.target.value)}
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
            <Button  onClick={resendClientTask} className="w-full text-sm h-9">
              Resend Tasks
            </Button>
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
          className="text-sm leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: desc.message || "No message available" }}
        />

        {/* Footer */}
        <div className="flex justify-end mt-1.5">
          <span className="text-[11px] text-muted-foreground">
            {desc.time ? formatDate(desc.time) : "Just now"}
          </span>
          {/* {isAdmin && !isEditable && desc.time && (
            <span className="text-[10px] text-muted-foreground ml-2 italic">
              (locked)
            </span>
          )} */}
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