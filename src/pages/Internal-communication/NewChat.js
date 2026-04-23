import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import Editor from "../../components/Editor";

// ✅ AUTH
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
// ✅ API
import { internalChatAPI } from "../../services/api";

const NewChat = ({ open, handleClose, getsChatlist }) => {
  const { user } = useAuth();
  const loginUserId = user?._id || user?.id;

  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([]);
const [loading, setLoading] = useState(false);
 
  // ================= FETCH USERS (UPDATED) =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });

        const users = res?.data?.users || [];

        console.log("Raw users:", users);

        if (!users.length) {
          console.warn("No users found");
        }

        // ✅ remove logged-in user
        const filteredUsers = users.filter((u) => u._id !== loginUserId);

        // ✅ format for Autocomplete
        const formatted = filteredUsers.map((u) => ({
          value: u._id,
          label: u.username,
        }));

        setUserData(formatted); // use existing state
        console.log("Fetched users:", formatted);
      } catch (err) {
        console.error("User fetch error:", err?.response || err);
        toast.error("Failed to load users");
      }
    };

    if (loginUserId) {
      fetchUsers();
    }
  }, [loginUserId]);

  // ================= OPTIONS =================
  const options = userData.map((u) => ({
    value: u._id,
    label: u.username,
  }));

  // ================= CREATE CHAT =================
  const saveChat = async () => {
    try {
      if (!selectedUser) {
        return toast.error("Please select a user");
      }

      if (!description?.trim()) {
        return toast.error("Message is required");
      }
 setLoading(true); // ✅ start loading
      const payload = {
        participants: [loginUserId, selectedUser.value],
        description: [
          {
            message: description,
            fromwhome: user?.role,
            senderid: loginUserId,
            isRead: false,
          },
        ],
        active: "true",
      };

      await internalChatAPI.sendMessage(payload);

      toast.success("Chat created");

      handleClose();
      clearFields();
      getsChatlist();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create chat");
    }
    finally {
    setLoading(false); // ✅ stop loading
  }
  };

  // ================= CLEAR =================
  const clearFields = () => {
    setSelectedUser(null);
    setDescription("");
  };

  const handleCloseDrawer = () => {
    handleClose();
    clearFields();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleCloseDrawer}
      PaperProps={{ sx: { width: 600 } }}
    >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" p={2}>
        <Typography variant="h6">New Chat</Typography>
        <CloseIcon onClick={handleCloseDrawer} sx={{ cursor: "pointer" }} />
      </Box>

      <Divider />

      {/* BODY */}
      <Box p={3}>
        <Typography>To</Typography>

        <Autocomplete
          options={userData}
          value={selectedUser}
          onChange={(e, val) => setSelectedUser(val)}
          getOptionLabel={(opt) => opt.label || ""}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select user" />
          )}
          sx={{ mt: 2, mb: 2 }}
        />

        <Editor initialContent={description} onChange={setDescription} />
      </Box>

      {/* FOOTER */}
      <Box p={2} display="flex" gap={2}>
        <Button
  variant="contained"
  onClick={saveChat}
  disabled={loading}
>
  {loading ? "Creating..." : "Create Chat"}
</Button>

        <Button variant="outlined" onClick={handleCloseDrawer}>
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

export default NewChat;
