import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Checkbox,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import Delete from "@mui/icons-material/Delete";
import Archive from "@mui/icons-material/Archive";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { chatAPI, accountsAPI } from "../../services/api";
import ChatDetails from "./Communication/ChatDetails";
import NewChatDrawer from "./Communication/NewChatDrawer";
import { useConfirm } from "../../components/ConfirmDialogContext";
const Communication = () => {
  const { accountId } = useParams();
  const confirm = useConfirm();
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [accountName, setAccountName] = useState("");
  // ================= ACCOUNT DETAILS =================
const fetchAccountDetails = async (accountId) => {
  try {
    console.log("Calling API with accountId:", accountId);
    const res = await accountsAPI.getAccountById(accountId);
    console.log("Full response:", res);
    console.log("Account details:", res.data);
    setAccountName(res.data.accountName);
  } catch (error) {
    console.error("Error fetching account:", error);
  }
};
useEffect(() => {
  // console.log("accountId changed:", accountId);
  if (accountId) {
    fetchAccountDetails(accountId);
  }
}, [accountId]);

  // ================= CHAT LIST =================
  const accountwiseChatlist = async (accId, active) => {
    try {
      const res = await chatAPI.getChatsByAccountAndStatus(
        accId,
        active
      );
      setChatList(res.data.chataccountwise || []);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    accountwiseChatlist(accountId, isActiveTrue);
  }, [accountId, isActiveTrue]);

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
    return new Date(time).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  // ================= CHAT ACTIONS =================
  const handleShowChat = async (chatId) => {
    try {
      await chatAPI.markAllAsRead(chatId, accountId, "Admin");

      const chat = chatList.find((c) => c._id === chatId);
      setSelectedChat(chat);
      setChatId(chatId);

      accountwiseChatlist(accountId, isActiveTrue);
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const getsChatDetails = async () => {
    try {
      const res = await chatAPI.getChatById(chatId);
      setSelectedChat(res.data.chat);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  // ================= BULK ACTIONS =================
  const handleCheckboxChange = (id) => {
    setSelectedChatIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
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
          selectedChatIds.map((id) => chatAPI.deleteChat(id))
        );

        toast.success("Chats deleted");
        setSelectedChatIds([]);
        accountwiseChatlist(accountId, isActiveTrue);
      } catch (error) {
        toast.error("Delete failed");
      }
    },
  });
  
};

  const handleArchiveJob = async (id) => {
    try {
      await chatAPI.updateChat(id, { active: !isActiveTrue });
      toast.success("Updated successfully");
      accountwiseChatlist(accountId, isActiveTrue);
      setSelectedChatIds([]);
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleBulkArchive = () => {
    selectedChatIds.forEach(handleArchiveJob);
  };

  // ================= UI =================
  return (
    <Box mt={2}>
      {/* HEADER */}
     <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  mb={2}
  px={2}
  py={1.5}
  sx={{
    background: "#fff",
    borderRadius: 2,
    boxShadow: 1,
  }}
>
  <Box display="flex" alignItems="center" gap={2}>
    <Typography variant="h5" fontWeight={600}>
      Chats & Tasks
    </Typography>

    <ToggleButtonGroup
      value={isActiveTrue}
      exclusive
      size="small"
      onChange={(e, val) => val !== null && setIsActiveTrue(val)}
      sx={{
        background: "#f5f5f5",
        borderRadius: 2,
      }}
    >
      <ToggleButton value={true}>Active</ToggleButton>
      <ToggleButton value={false}>Archived</ToggleButton>
    </ToggleButtonGroup>

    {selectedChatIds.length > 0 && (
      <>
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={handleBulkDelete}
        >
          <Delete sx={{ mr: 0.5 }} /> Delete
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleBulkArchive}
        >
          <Archive sx={{ mr: 0.5 }} />
          {isActiveTrue ? "Archive" : "Unarchive"}
        </Button>
      </>
    )}
  </Box>

  <Button
    variant="contained"
    sx={{
      borderRadius: 2,
      textTransform: "none",
      fontWeight: 500,
    }}
    onClick={() => setOpen(true)}
  >
    New Chat
  </Button>
</Box>

      {/* MAIN */}
      <Box
  display="flex"
  height="85vh"
  gap={2}
  sx={{
    background: "#f9fafb",
    borderRadius: 2,
    p: 1,
  }}
>
        {/* CHAT LIST */}
       <Box
  width="30%"
  overflow="auto"
  sx={{
    background: "#fff",
    borderRadius: 2,
    boxShadow: 1,
  }}
>
          {chatList.map((chat) => {
            const unread = countUnreadAdminMessages(chat);

            return (
              <Box key={chat._id}>
                <Paper
  sx={{
    p: 1.5,
    m:2,
    cursor: "pointer",
    borderRadius: 2,
    transition: "all 0.2s ease",
    background:
      selectedChat?._id === chat._id ? "#e3f2fd" : "#fff",
    "&:hover": {
      background: "#f1f5f9",
      transform: "translateY(-1px)",
      boxShadow: 2,
    },
  }}
  onClick={() => handleShowChat(chat._id)}
>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
  <Box display="flex" alignItems="center" gap={1}>
    <Checkbox
      size="small"
      checked={isChatSelected(chat._id)}
      onChange={() => handleCheckboxChange(chat._id)}
      onClick={(e) => e.stopPropagation()}
    />
    <TelegramIcon fontSize="small" color="primary" />
    <Typography variant="caption" fontWeight={500}>
      {chat.accountid?.accountName}
    </Typography>
  </Box>

                    {unread > 0 && (
  <Box
    sx={{
      background: "#25D366",
      color: "#fff",
      borderRadius: "50%",
      minWidth: 22,
      height: 22,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    {unread}
  </Box>
)}
                  </Box>

                <Typography fontWeight={600} mt={0.5}>
  {chat.chatsubject}
</Typography>

                 <Typography
  variant="caption"
  color="text.secondary"
  sx={{
    display: "block",
    mt: 0.3,
  }}
>
                    {(() => {
                        const messages = chat.description || [];
                        const latest = messages[messages.length - 1];
                        if (!latest) return "No messages yet";

                        const clean =
                          latest.message?.replace(/<[^>]+>/g, "") || "";
                        const sender =
                          // latest.fromwhome === "Admin"
                          //   ? "You"
                          //   : latest.senderid || "";
                          latest.fromwhome === "Admin" && latest.senderid;

                        return `${sender}: ${
                          clean.length > 35 ? clean.slice(0, 35) + "..." : clean
                        }`;
                      })()}
                    {/* {chat.description?.slice(-1)[0]?.message || "No messages"} */}
                  </Typography>

                  <Box textAlign="right" mt={0.5}>
  <Typography variant="caption" color="text.secondary">
    {formatTime(chat.updatedAt)}
  </Typography>
</Box>
                </Paper>
                <Divider />
              </Box>
            );
          })}
        </Box>

        {/* CHAT DETAILS */}
      <Box
  width="70%"
  sx={{
    background: "#fff",
    borderRadius: 2,
    boxShadow: 1,
    p: 2,
  }}
>
          {selectedChat ? (
            <ChatDetails
              chat={selectedChat}
              getsChatDetails={getsChatDetails}
              accountwiseChatlist={accountwiseChatlist}
              data={accountId}
              accountName={accountName}
              isActiveTrue={isActiveTrue}
              onChatAction={() => setSelectedChat(null)}
            />
            // <Box>Chat details component goes here</Box>
          ) : (
            <Typography>Select a chat</Typography>
          )}
        </Box>
      </Box>

      {/* DRAWER */}
      <NewChatDrawer
        open={open}
        handleClose={() => setOpen(false)}
        accountwiseChatlist={accountwiseChatlist}
        data={accountId}
        isActiveTrue={isActiveTrue}
      />
    </Box>
  );
};

export default Communication;