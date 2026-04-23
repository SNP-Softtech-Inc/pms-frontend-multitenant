import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";

import Editor from "../../components/Editor";

// ✅ AUTH
import { useAuth } from "../../context/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const messageRefs = useRef({});
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes flashHighlight {
      0% { background-color: #fff2b3; }
      100% { background-color: transparent; }
    }
  `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  // ================= FORMAT DATE =================
  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleString();
  };

  // ================= SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.description]);

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

      getsChatDetails();
      getsChatlist();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };
  // ✅ CHECK EDIT TIME (optional but recommended)
  const canEditMessage = (time) => {
    const msgTime = new Date(time).getTime();
    const now = new Date().getTime();
    return now - msgTime <= 10 * 60 * 1000; // 10 min
  };

  // ✅ OPEN EDIT
  const handleEditMessage = (msg) => {
    if (!canEditMessage(msg.time)) {
      toast.info("Edit time expired");
      setAnchorEl(null);
      return;
    }
    setEditingMessage(msg);
    setEditContent(msg.message);
    setEditDialogOpen(true);
    setAnchorEl(null);
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
    
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {chat?.participants
            ?.filter((user) => user._id !== loginUserId)
            ?.map((user) => user.username)
            ?.join(", ") || "Chat"}
        </Typography>
        {/* <IconButton onClick={() => setShowChatDetails(false)}>
          <CloseIcon />
        </IconButton> */}
      </Box>

      <Divider />

      {/* ================= MESSAGES ================= */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 3,
          py: 2,
          backgroundColor: "#f4f6f8",
        }}
      >
        {chat.description?.map((msg) => {
          const isMe =
            msg.senderid?._id === loginUserId || msg.senderid === loginUserId;

          const repliedMsg = chat.description.find(
            (m) => m._id === msg.replyTo,
          );

          return (
            <Box
              key={msg._id}
              ref={(el) => {
                if (msg._id) messageRefs.current[msg._id] = el;
              }}
              sx={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                mb: 2,
                transition: "all 0.3s ease",

                // ✅ HIGHLIGHT EFFECT
                ...(highlightedId === msg._id && {
                  backgroundColor: "#fff3cd",
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                }),
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  backgroundColor: isMe ? "#2563eb" : "#ffffff",
                  color: isMe ? "#fff" : "#1f2937",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  position: "relative",
                  transition: "all 0.2s ease",
                  "&:hover .msg-actions": {
                    opacity: 1,
                  },
                }}
              >
                {/* REPLY PREVIEW */}

                {repliedMsg && (
                  <Box
                    sx={{
                      backgroundColor: isMe
                        ? "rgba(255,255,255,0.15)"
                        : "#eef2f7",
                      borderLeft: "3px solid #2563eb",
                      px: 1,
                      py: 0.5,
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        const el = messageRefs.current[msg.replyTo];
                        if (el) {
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          setHighlightedId(msg.replyTo);
                          setTimeout(() => setHighlightedId(null), 2000);
                        }
                      }}
                    >
                      {repliedMsg.senderid?._id === loginUserId ||
                      repliedMsg.senderid === loginUserId
                        ? "You"
                        : repliedMsg.senderid?.username || "User"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", opacity: 0.8 }}
                      dangerouslySetInnerHTML={{
                        __html:
                          repliedMsg.message?.length > 100
                            ? repliedMsg.message.slice(0, 100) + "..."
                            : repliedMsg.message,
                      }}
                    />
                  </Box>
                )}

                {/* HEADER */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.5}
                >
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, fontWeight: 500 }}
                  >
                    {isMe ? "You" : msg.senderid?.username}
                  </Typography>

                  <MoreVertIcon
                    className="msg-actions"
                    sx={{
                      cursor: "pointer",
                      fontSize: 18,
                      opacity: 0,
                      transition: "0.2s",
                    }}
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedMessage(msg);
                    }}
                  />
                </Box>

                {/* MENU */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      minWidth: 150,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      mt: 1,
                    },
                  }}
                >
                  {/* Reply */}
                  <MenuItem
                    onClick={() => {
                      setReplyTo(selectedMessage);
                      setAnchorEl(null);
                    }}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      "&:hover": { backgroundColor: "#f3f4f6" },
                    }}
                  >
                    <ReplyIcon fontSize="small" />
                    Reply
                  </MenuItem>

                  {/* Edit */}
                  {selectedMessage &&
                    (selectedMessage.senderid?._id === loginUserId ||
                      selectedMessage.senderid === loginUserId) && (
                      <MenuItem
                        onClick={() => {
                          handleEditMessage(selectedMessage);
                          setAnchorEl(null);
                        }}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          "&:hover": { backgroundColor: "#f3f4f6" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                        Edit
                      </MenuItem>
                    )}

                  {/* Delete */}
                  {selectedMessage &&
                    (selectedMessage.senderid?._id === loginUserId ||
                      selectedMessage.senderid === loginUserId) && (
                      <MenuItem
                        onClick={() => {
                          handleDeleteMessage(selectedMessage);
                          setAnchorEl(null);
                        }}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          color: "#dc2626",
                          "&:hover": { backgroundColor: "#fee2e2" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                        Delete
                      </MenuItem>
                    )}
                </Menu>

                {/* MESSAGE */}
                <Typography
                  variant="body2"
                  sx={{ wordBreak: "break-word", mb: 0.5 }}
                  dangerouslySetInnerHTML={{
                    __html: msg.message,
                  }}
                />

                {/* TIME */}
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.5,
                    fontSize: "11px",
                    display: "block",
                    textAlign: "right",
                  }}
                >
                  {formatDate(msg.time)}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* ================= REPLY PREVIEW ================= */}

      {replyTo && (
        <Box
          sx={{
            mx: 2,
            mb: 1,
            p: 1.5,
            backgroundColor: "#eef4ff",
            borderLeft: "4px solid #2563eb",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            Replying to{" "}
            {replyTo.senderid?._id === loginUserId ||
            replyTo.senderid === loginUserId
              ? "You"
              : replyTo.senderid?.username || "User"}
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontStyle: "italic", pr: 4 }}
            dangerouslySetInnerHTML={{
              __html:
                replyTo.message?.length > 100
                  ? replyTo.message.slice(0, 100) + "..."
                  : replyTo.message,
            }}
          />

          <IconButton
            size="small"
            onClick={() => setReplyTo(null)}
            sx={{ position: "absolute", right: 5, top: 5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* ================= INPUT ================= */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          display: "flex",
          gap: 2,
          alignItems: "flex-end",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Editor value={editorContent} onChange={setEditorContent} />
        </Box>

        <Button
          variant="contained"
          onClick={updateChatDescription}
          sx={{
            height: "42px",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
          }}
        >
          Send
        </Button>
      </Box>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Message</DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Editor value={editContent} onChange={setEditContent} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatDetails;
