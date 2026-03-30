
// ============================
// 📁 Drawer: Move Folder / File (MUI Version)
// ============================

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Alert,
  ListItemIcon,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import axios from "axios";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import { docAPI } from "../../../services/api";
const MoveDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [destinationPath, setDestinationPath] = useState("");
  const [sourcePath, setSourcePath] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSourcePath(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSourcePath("");
      setDestinationPath("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleMove = async () => {
  try {
    setMessage("");

    if (!sourcePath || !destinationPath) {
      setMessage("Please select both source and destination paths.");
      return;
    }

    const res = await docAPI.moveItem({
      sourcePath,
      destinationPath,
    });

    const successMsg = res.data.message || "Moved successfully";

    setMessage(successMsg);
    toast.success(successMsg);

    onClose();
    await fetchFolderTree?.();
  } catch (err) {
    console.error(err);

    const errorMsg =
      err.response?.data?.error || "Move failed";

    setMessage(errorMsg);
    toast.error(errorMsg);
  }
};

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 360, p: 3, bgcolor: "#f8fff0", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Move Folder / File
        </Typography>

        <TextField
          label="Source Path"
          value={sourcePath}
          fullWidth
          margin="dense"
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Destination Path"
          value={destinationPath}
          onChange={(e) => setDestinationPath(e.target.value)}
          fullWidth
          margin="dense"
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleMove}
        >
          Move
        </Button>

        {message && (
          <Alert
            severity={message.includes("failed") ? "error" : "info"}
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Select Destination Folder
        </Typography>

        <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          <FolderTreeSelector
            items={folderTree}
            onSelect={(path) => setDestinationPath(path)}
            selectedFolder={destinationPath}
          />
        </Box>

        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ mt: 2, color: "#555" }}
        >
          Close
        </Button>
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
                "&:hover": { bgcolor: "#dbefff" },
                cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                if (!item.meta?.readOnly) onSelect(item.path);
              }}
            >
              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
              >
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
                (isExpanded ? (
                  <ExpandLess
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ) : (
                  <ExpandMore
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ))}
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
export default MoveDrawer;
