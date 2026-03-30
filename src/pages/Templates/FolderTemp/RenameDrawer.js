

import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { docAPI } from "../../../services/api";
const RenameDrawer = ({
  isOpen,
  onClose,
  fetchFolderTree,
  selectedFolderForMenu, // the selected file/folder to rename
}) => {
  const [newName, setNewName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Pre-fill selected item info
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setCurrentPath(selectedFolderForMenu.path);
      console.log("Selected item for rename:", selectedFolderForMenu.path);
      setNewName(selectedFolderForMenu.name);
      setMessage("");
    } else if (!isOpen) {
      setCurrentPath("");
      setNewName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  // ✅ Rename function
  const handleRename = async () => {
  if (!newName.trim()) {
    setMessage("⚠️ New name is required!");
    return;
  }

  try {
    const res = await docAPI.renameItem({
      currentPath: currentPath,
      newName,
    });

    const successMsg = res.data.message || "Renamed successfully";

    setMessage(`✅ ${successMsg}`);
    toast.success(successMsg);

    onClose();
    await fetchFolderTree();
  } catch (err) {
    console.error("Rename error:", err);

    const errorMsg =
      err.response?.data?.error || "Server Error";

    setMessage(`❌ ${errorMsg}`);
    toast.error(errorMsg);
  }
};

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          ✏️ Rename Item
        </Typography>

       
        <TextField
          label="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new file or folder name"
          fullWidth
          margin="dense"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRename}
        >
          Rename
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default RenameDrawer;

