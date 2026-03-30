import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import FileUploadDrawer from "./FileUploadDrawer";
import FolderUploadDrawer from "./FolderUploadDrawer";
import CreteFolderDrawer from "./CreteFolderDrawer";
import RenameDrawer from "./RenameDrawer";
import MoveDrawer from "./MoveDrawer";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Eye, PenTool, Stamp, Lock } from "lucide-react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
import { docAPI } from "../../../services/api";
const FolderTreeView = () => {
const { templateId } = useParams();
const location = useLocation();
const templateName = location.state?.templateName || "Unknown Template";
 const navigate = useNavigate();
  const decodedTemplateId = decodeURIComponent(templateId);
 const [expandedFolders, setExpandedFolders] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
  const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
  const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
  const [renameDrawer, SetRenameDrawer] = useState(null);
  const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
  const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
  const [templatename, setTemplateName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [folderTree, setFolderTree] = useState([]);
 
console.log("hgjhg",templateId)
  

  useEffect(() => {
    fetchFolderTree(templateId);
  }, [templateId]);

 // API call to fetch folder tree for a given template ID
  const fetchFolderTree = async (templateId) => {
  try {
    const res = await docAPI.listFoldersAndFiles(templateId);
    setFolderTree(res.data.contents || []);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch folder tree");
  }
};
  const toggleFolder = (path, isReadOnly) => {
    if (isReadOnly) return;
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleMenuOpen = (event, folder) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedFolderForMenu(folder);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
// Toggle read/unread
  const toggleReadStatus = (item) => {
    const newValue = !(item.meta?.readStatus || false);
    updateStatus(item, "readStatus", newValue);
    console.log("kujaki janavi", item.path);
  };

  const SIGN_STATUSES = [
    "sendForSignature",
    "pendingSignature",
    "signatureCompleted",
  ];

  const statusTextMap = {
    sendForSignature: "Send for Sign",
    pendingSignature: "Waiting for Signature",
    signatureCompleted: "Signature Received",
  };

  const toggleSignStatus = (item) => {
    console.log("signature path", item)
    const currentStatus = item.meta?.signStatus || "sendForSignature";

    // Find the next status in the cycle
    const currentIndex = SIGN_STATUSES.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % SIGN_STATUSES.length; // loops back to start if at end
    const nextStatus = SIGN_STATUSES[nextIndex];

    // Update the item meta
    updateStatus(item, "signStatus", nextStatus);
  };
  const APPROVAL_STATUSES = [
    "sendForApproval",
    "pendingApproval",
    "approvalCompleted",
  ];

  const approvalStatusTextMap = {
    sendForApproval: "Send for Approval",
    pendingApproval: "Waiting for Approval",
    approvalCompleted: "Approval Completed",
  };

  const toggleApprovalStatus = (item) => {
    const currentStatus = item.meta?.authStatus || "sendForApproval";

    // Find the next status in the cycle
    const currentIndex = APPROVAL_STATUSES.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % APPROVAL_STATUSES.length; // loops back to start if at end
    const nextStatus = APPROVAL_STATUSES[nextIndex];

    // Update the item meta
    updateStatus(item, "authStatus", nextStatus);
  };

  // 🔹 Frontend: Update any status (read, sign, approval)
const updateStatus = async (item, statusType, newValue) => {
  try {
    if (!item?.path) return alert("Invalid item selected");

    const body = {
      targetPath: item.path,
      status: {
        [statusType]: newValue,
      },
    };

    const res = await docAPI.updateStatus(body);

    alert(res.data.message || "Status updated successfully");
    fetchFolderTree(templateId);
  } catch (err) {
    console.error(err);
    alert("Error updating status");
  }
};

 const toggleReadOnly = async (item) => {
  try {
    const newStatus = !item.meta.readOnly;

    const body =
      item.type === "folder"
        ? { folderPath: item.path, readOnly: newStatus }
        : { filePath: item.path, readOnly: newStatus };

    if (item.type === "folder") {
      await docAPI.setFolderReadOnly(body);
    } else {
      await docAPI.setFileReadOnly(body);
    }

    await fetchFolderTree(templateId);

    // Collapse if locked
    if (item.type === "folder" && newStatus) {
      setExpandedFolders((prev) => {
        const updated = { ...prev };
        delete updated[item.path];
        return updated;
      });
    }

    handleMenuClose();
  } catch (err) {
    console.error(err);
    alert("Failed to update read-only status");
  }
};

  // 🗑️ Delete File or Folder (Universal)
  const deleteItem = async (item) => {
  if (!item?.path) return alert("Invalid path");

  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${item.name}"?`
  );
  if (!confirmDelete) return;

  try {
    const res = await docAPI.deleteItem({ targetPath: item.path });

    alert(res.data.message || "Deleted successfully");

    await fetchFolderTree(templateId);
  } catch (err) {
    console.error(err);
    alert("Error deleting item");
  }

  handleMenuClose();
};

 
 
 const renderTree = (items, level = 0, parentPath = "") => {
    return (
      <Box component="ul" sx={{ listStyle: "none", pl: level * 2, mb: 1 }}>
        {items.map((item) => {
          const fullPath = parentPath
            ? `${parentPath}/${item.name}`
            : item.name;
          const meta = item.meta || {};

          // 🎯 Define colors for statuses
          const getColor = (status) => (status ? "#1976d2" : "#9e9e9e");

          const StatusIcons = () => (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1 }}>
              <Eye size={16} color={getColor(meta.readStatus)} />
              <PenTool size={16} color={getColor(meta.signStatus)} />
              <Stamp size={16} color={getColor(meta.authStatus)} />
              <Lock size={16} color={meta.readOnly ? "#e53935" : "#9e9e9e"} />
            </Box>
          );
          

          return (
            <li key={fullPath} style={{ marginBottom: 8 }}>
              {item.type === "folder" ? (
                // 📁 Folder with open/close icon
                <Box
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    transition: "background-color 0.2s ease-in-out",
                  }}
                  onClick={() => toggleFolder(fullPath, meta.readOnly)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ flexGrow: 1, gap: 1 }}
                  >
                    {expandedFolders[fullPath] ? (
                      <FolderOpenIcon color="#1976d2" size={18} />
                    ) : (
                      <FolderClosedIcon color="#757575" size={18} />
                    )}
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {item.name}
                    </Typography>
                    <StatusIcons />
                  </Box>

                  {/* Optional: Folder menu */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  >
                    <MoreVertIcon size={16} />
                  </IconButton>
                </Box>
              ) : (
                // 📄 File with single dot icon
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    "&:hover .file-menu-icon": { opacity: 1 },
                  }}
                >
                  <FileIcon
                    size={16}
                    color="#757575"
                    style={{ marginRight: 6 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, wordBreak: "break-word" }}
                  >
                    {item.name}
                  </Typography>
                  <StatusIcons />

                  {/* 🔵 Single blue dot icon for file menu */}
                  <Box
                    className="file-menu-icon"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#1976d2",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      cursor: "pointer",
                      mr: 1,
                      ml: 1,
                    }}
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  />
                </Box>
              )}

              {/* Recursive children */}
              {expandedFolders[fullPath] &&
                item.children &&
                item.children.length > 0 && (
                  <Box
                    sx={{
                      ml: 2,
                      mt: 1,
                      borderLeft: "2px dashed #ccc",
                      pl: 2,
                    }}
                  >
                    {renderTree(item.children, level + 1, fullPath)}
                  </Box>
                )}
            </li>
          );
        })}
      </Box>
    );
  };
  return (

<Box sx={{ margin: "auto", p: 3 }}>
      {/* Template Name */}

      <Box sx={{display:'flex', alignItems:'center',gap:"35%"}}> 
 <KeyboardBackspaceIcon
          sx={{
            cursor: "pointer",
            fontSize: 28,
            mr: 1,
            "&:hover": { color: "#1976d2" },
          }}
          onClick={() => navigate("/firmtemp/templates/folders")}
        />  <Typography variant="h5" sx={{  textAlign: "center" }}>
        Template: {templateName}
      </Typography>
      </Box>
    

      {/* Action Buttons */}
      <Box sx={{  maxWidth: "1000px", mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            maxWidth: "600px",
            width: "100%",
            mx: "auto",
            my: 3,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            startIcon={<FolderIcon />}
            onClick={() => {
              setNewFolderDrawerOpen(true);
              handleMenuClose();
            }}
          >
            Create Folder
          </Button>

          <Button
            variant="contained"
            fullWidth
            startIcon={<UploadFileIcon />}
            onClick={() => setFileUploadDrawerOpen(true)}
          >
            Upload File
          </Button>

          <Button
            variant="contained"
            fullWidth
            startIcon={<DriveFolderUploadIcon />}
            onClick={() => setFolderUploaDrawerOpen(true)}
          >
            Upload Folder
          </Button>
        </Box>

        {/* Drawers */}
        <FileUploadDrawer
          isOpen={fileUploadDrawerOpen}
          onClose={() => setFileUploadDrawerOpen(false)}
          folderTree={folderTree}
          templateId={templateId}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <CreteFolderDrawer
          isOpen={newFolderDrawerOpen}
          onClose={() => {
            setNewFolderDrawerOpen(false);
          }}
          folderTree={folderTree}
          templateId={templateId}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <FolderUploadDrawer
          isOpen={folderUploaDrawerOpen}
          onClose={() => setFolderUploaDrawerOpen(false)}
          folderTree={folderTree}
          templateId={templateId}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <MoveDrawer
          isOpen={moveDrawerOpen}
          onClose={() => {
            setMoveDrawerOpen(false);
          }}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <RenameDrawer
          isOpen={renameDrawer}
          onClose={() => {
            SetRenameDrawer(false);
          }}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />
      </Box>

      {/* Folder Explorer */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📜 Folder Explorer
        </Typography>
        {folderTree ? (
          renderTree(folderTree)
        ) : (
          <Typography>Loading folder data...</Typography>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {(() => {
          const isLocked = selectedFolderForMenu?.meta?.readOnly === true;
          const isRead = selectedFolderForMenu?.meta?.readStatus === true;
          const currentStatus =
            selectedFolderForMenu?.meta?.signStatus || "sendForSignature";
          const isApproved = selectedFolderForMenu?.meta?.authStatus === true;
const restrictedNames = [
  "Client Uploaded Documents",
  "Firm Documents Shared with Client",
  "Private",
];

const isRestricted =
  restrictedNames.includes(selectedFolderForMenu?.name);

          return (
            <>
              <MenuItem
               disabled={isLocked || isRestricted}
                onClick={() => {
                  setMoveDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFileMoveIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Move
              </MenuItem>

              <MenuItem
                disabled={isLocked || isRestricted}
                onClick={() => {
                  deleteItem(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DeleteIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Delete
              </MenuItem>

              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  setNewFolderDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <FolderIcon sx={{ mr: 0.5, fontSize: 16 }} />
                New Folder
              </MenuItem>

              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  setFileUploadDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <UploadFileIcon sx={{ mr: 0.5, fontSize: 16 }} />
                New File
              </MenuItem>

              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  setFolderUploaDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFolderUploadIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Upload Folder
              </MenuItem>

              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  SetRenameDrawer(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFileMoveIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Edit
              </MenuItem>

              {/* <MenuItem
                disabled={isLocked}
                onClick={() => {
                  toggleSignStatus(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <PenTool
                  size={16}
                  color={
                    currentStatus === "signatureCompleted"
                      ? "#1976d2"
                      : "#807878ff"
                  }
                  style={{ marginRight: 6 }}
                />
                {statusTextMap[currentStatus]}
              </MenuItem> */}

              {/* <MenuItem
                disabled={isLocked}
                onClick={() => {
                  toggleReadStatus(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <Eye
                  size={16}
                  color={
                    isLocked
                      ? "#f5ecec"
                      : isRead
                      ? "#1976d2"
                      : "#807878ff"
                  }
                  style={{ marginRight: 6 }}
                />
                {isRead ? "Mark Unread" : "Mark Read"}
              </MenuItem> */}

              {/* <MenuItem
                disabled={isLocked}
                onClick={() => {
                  toggleApprovalStatus(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <Stamp
                  size={16}
                  color={
                    isApproved ? "#1976d2" : "#807878ff"
                  }
                  style={{ marginRight: 6 }}
                />
                {
                  approvalStatusTextMap[
                    selectedFolderForMenu?.meta?.authStatus ||
                      "sendForApproval"
                  ]
                }
              </MenuItem> */}

              <MenuItem
                onClick={() => {
                  toggleReadOnly(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                {isLocked ? (
                  <LockOpenIcon sx={{ mr: 0.5, fontSize: 16 }} />
                ) : (
                  <LockIcon sx={{ mr: 0.5, fontSize: 16 }} />
                )}
                {isLocked ? "Unlock" : "Lock"}
              </MenuItem>
            </>
          );
        })()}
      </Menu>
    </Box>
  );
};

export default FolderTreeView;
