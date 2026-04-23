import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Divider,IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import NewChatDrawer from "./NewChat";
import ChatDetails from "./ChatDetails";

// ✅ NEW AUTH HOOK
import { useAuth } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
// ✅ API SERVICE
import { internalChatAPI } from "../../services/api";

const InternalCommunication = () => {
  const theme = useTheme();

  const { user, tenantId } = useAuth();
  const loginUserId = user?._id || user?.id;

  const [open, setOpen] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

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

  return (

    <Box mt={2}>
  {/* HEADER */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={2}
  >
    <Typography variant="h5" fontWeight={600}>
      Communications
    </Typography>

    <Button
      variant="contained"
      sx={{
        textTransform: "none",
        borderRadius: 2,
        px: 2.5,
        boxShadow: "none",
      }}
      onClick={() => setOpen(true)}
    >
      + New Communication
    </Button>
  </Box>

  {/* EMPTY */}
  {chatList.length === 0 ? (
    <Box
      textAlign="center"
      mt={12}
      sx={{ color: "text.secondary" }}
    >
      <Typography variant="h6" mb={1}>
        No Communications Found
      </Typography>
      <Button
        variant="outlined"
        sx={{ borderRadius: 2, textTransform: "none" }}
        onClick={() => setOpen(true)}
      >
        Create New
      </Button>
    </Box>
  ) : (
    <Box
      display="flex"
      height="85vh"
      gap={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* LEFT PANEL */}
      <Box
        width="30%"
        sx={{
          backgroundColor: "#fafafa",
          overflowY: "auto",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        {chatList.map((chat) => {
          const receiver = chat.participants.find(
            (p) => p._id !== loginUserId
          );

          const unreadCount = countUnreadMessages(chat);
          const latestMessage =
            chat.description?.[chat.description.length - 1];

          const preview =
            latestMessage?.message?.replace(/<[^>]+>/g, "") || "";

          return (
            <Box key={chat._id} sx={{ borderBottom: "1px solid #e5e7eb", "&:last-child": { borderBottom: "none" } ,m:2}}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                 
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#eef2ff",
                  },
                }}
                onClick={() => handleShowChat(chat._id)}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    noWrap
                  >
                    {receiver?.username}
                  </Typography>

                  {unreadCount > 0 && (
                    <Box
                      sx={{
                        background: theme.palette.primary.main,
                        color: "#fff",
                        borderRadius: "50%",
                        minWidth: 20,
                        height: 20,
                        px: 0.5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {unreadCount}
                    </Box>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {preview.slice(0, 40)}
                </Typography>
              </Paper>
            </Box>
          );
        })}
      </Box>

      {/* RIGHT PANEL */}
     
      <Box
  width="70%"
  sx={{
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    // borderLeft: "1px solid #f1f5f9",
  }}
>
  {selectedChat ? (
    <>
      {/* HEADER WITH CLOSE */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        sx={{
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography fontWeight={600}>
          Chat
        </Typography>

        <IconButton
          size="small"
          onClick={() => setSelectedChat(null)}
          sx={{
            borderRadius: 2,
            "&:hover": { backgroundColor: "#eef2ff" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* CHAT CONTENT */}
      <Box flex={1} overflow="hidden">
        <ChatDetails
          chat={selectedChat}
          getsChatDetails={getsChatDetails}
          getsChatlist={getsChatlist}
          loginUserId={loginUserId}
        />
      </Box>
    </>
  ) : (
    <Box
      flex={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      color="text.secondary"
    >
      <Typography variant="h6">
        Select a chat to start messaging
      </Typography>
    </Box>
  )}
</Box>
    </Box>
  )}

  {/* DRAWER */}
  <NewChatDrawer
    open={open}
    handleClose={() => setOpen(false)}
    getsChatlist={getsChatlist}
  />
</Box>
  );
};

export default InternalCommunication;
