

// ============================
// 📁 Drawer: Create Folder (MUI version)
// ============================

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,  Collapse,  ListItemIcon,
} from "@mui/material";
import axios from "axios";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import { accountDocsAPI } from "../../../../services/api";
const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,accountId
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder(""); // reset selection when drawer closes
      setFolderName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
  if (!folderName.trim()) {
    setMessage("⚠️ Folder name is required!");
    return;
  }

  try {
    const payload = {
      name: folderName,
      parentPath: selectedFolder || "",
      accountId: accountId,
    };

    const res = await accountDocsAPI.createFolder(payload);

    const createdName = res?.data?.metaData?.name;

    setMessage(`✅ Folder created: ${createdName}`);
    toast.success(`Folder created: ${createdName}`);

    setFolderName("");

    // refresh tree
    await fetchFolderTree();

    onClose();
  } catch (err) {
    console.error(err);

    const errorMsg =
      err?.response?.data?.error || "Server Error while creating folder";

    toast.error(errorMsg);

    setMessage(`❌ Error: ${errorMsg}`);
  }
};

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 500, p: 3,  height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Create New Folder
        </Typography>

        <TextField
         
          placeholder="Enter new folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          fullWidth
          margin="dense"
        />

       

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateFolder}
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Folder
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Close
        </Button>

        {/* {!selectedFolder && ( */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Parent Folder from Tree
            </Typography>
            <FolderTreeSelector
              items={folderTree}
              onSelect={handleFolderSelect}
              selectedFolder={selectedFolder}
            />
          </Box>
        {/* )} */}
      </Box>
    </Drawer>
  );
};


const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <List disablePadding>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];

        return (
          <React.Fragment key={item.path}>
           
             <ListItem
              sx={{
                pl: 2 + level * 2,
                bgcolor: isSelected ? "#b2d8ff" : "transparent",
                borderRadius: 1,
                mb: 0.5,
            
                cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
                opacity: item.meta?.readOnly ? 0.6 : 1,
            
                "&:hover": {
                  bgcolor: item.meta?.readOnly ? "transparent" : "#dbefff",
                },
            
                pointerEvents: item.meta?.readOnly ? "none" : "auto",
              }}
              onClick={() => onSelect(item.path)}
            >
              <ListItemIcon onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }}>
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#0056b3" : "inherit",
                }}
              />
              {item.children?.length > 0 &&
                (isExpanded ? <ExpandLess onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} /> : <ExpandMore onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} />)}
            </ListItem>

            {item.children?.length > 0 && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <FolderTreeSelector
                  items={item.children}
                  onSelect={onSelect}
                  selectedFolder={selectedFolder}
                  level={level + 1}
                />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};
export default CreateFolderDrawer;

