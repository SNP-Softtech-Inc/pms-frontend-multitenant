

// // ============================
// // 📁 Drawer: Create Folder (MUI version)
// // ============================

// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,  Collapse,  ListItemIcon,
// } from "@mui/material";
// import axios from "axios";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { toast } from "react-toastify";
// import { docAPI } from "../../../services/api"; // adjust path
// const CreateFolderDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,templateId
// }) => {
//   const [folderName, setFolderName] = useState("");
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder(""); // reset selection when drawer closes
//       setFolderName("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleCreateFolder = async () => {
//   if (!folderName) {
//     setMessage("⚠️ Folder name is required!");
//     return;
//   }

//   try {
//     const res = await docAPI.createFolder({
//       name: folderName,
//       parentPath: selectedFolder || "",
//       templateId: templateId,
//     });

//     const createdName = res.data?.metaData?.name;

//     setMessage(`✅ Folder created: ${createdName}`);
//     toast.success(`Folder created: ${createdName}`);

//     setFolderName("");

//     await fetchFolderTree(); // refresh tree

//     onClose();
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err.response?.data?.error || "Server Error";

//     toast.error(errorMsg);

//     setMessage(`❌ Error creating folder: ${errorMsg}`);
//   }
// };

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 500, p: 3,  height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📁 Create New Folder
//         </Typography>

//         <TextField
         
//           placeholder="Enter new folder name"
//           value={folderName}
//           onChange={(e) => setFolderName(e.target.value)}
//           fullWidth
//           margin="dense"
//         />

       

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleCreateFolder}
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Create Folder
//         </Button>

//         {message && (
//           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
//         )}

//         <Button
//           onClick={onClose}
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Close
//         </Button>

//         {/* {!selectedFolder && ( */}
//           <Box sx={{ mt: 3 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Select Parent Folder from Tree
//             </Typography>
//             <FolderTreeSelector
//               items={folderTree}
//               onSelect={handleFolderSelect}
//               selectedFolder={selectedFolder}
//             />
//           </Box>
//         {/* )} */}
//       </Box>
//     </Drawer>
//   );
// };

// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];

//         return (
//           <React.Fragment key={item.path}>
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 "&:hover": { bgcolor: "#dbefff" },
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//               }}
//               onClick={() => {
//                 if (!item.meta?.readOnly) onSelect(item.path);
//               }}
//             >
//               <ListItemIcon onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }}>
//                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
//               </ListItemIcon>
//               <ListItemText
//                 primary={item.name}
//                 sx={{
//                   fontWeight: isSelected ? "bold" : "normal",
//                   color: isSelected ? "#0056b3" : "inherit",
//                 }}
//               />
//               {item.children?.length > 0 &&
//                 (isExpanded ? <ExpandLess onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} /> : <ExpandMore onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} />)}
//             </ListItem>

//             {item.children?.length > 0 && (
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   level={level + 1}
//                 />
//               </Collapse>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };
// export default CreateFolderDrawer;



import React, { useState, useEffect } from "react";
import {useToastContext} from "../../../context/ToastContext";
import { docAPI } from "../../../services/api";
import { 
  FolderPlus, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  templateId
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
const {showToast} = useToastContext();
  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setMessage("");
      setIsCreating(false);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setMessage("Folder name is required!");
      showToast({
        title: "Invalid folder name",
        type: "error",
        description: "Folder name is required!"
      } );
      return;
    }

    // Validate folder name (no special characters that might cause issues)
    const invalidChars = /[<>:"/\\|?*]/g;
    if (invalidChars.test(folderName)) {
      setMessage("Folder name cannot contain: < > : \" / \\ | ? *");
      showToast({
        title: "Invalid folder name",
        type: "error",
        description: "Folder name contains invalid characters"
      });
      return;
    }

    setIsCreating(true);
    setMessage("");

    try {
      const res = await docAPI.createFolder({
        name: folderName.trim(),
        parentPath: selectedFolder || "",
        templateId: templateId,
      });

      const createdName = res.data?.metaData?.name || folderName;

      setMessage(`✓ Folder created: ${createdName}`);
      showToast({
        title: "Folder created successfully",
        type: "success",
        description: `Folder created: ${createdName}`
      });

      // Reset form
      setFolderName("");
      
      // Refresh tree and close drawer
      await fetchFolderTree();
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Create folder error:", err);

      const errorMsg = err.response?.data?.error || "Server Error";
      
      setMessage(`✗ Error creating folder: ${errorMsg}`);
      showToast({
        title: "Folder creation failed",
        type: "error",
        description: errorMsg
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isCreating && folderName.trim()) {
      handleCreateFolder();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer content */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[550px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Create New Folder
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Folder Details Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-primary" />
              Folder Details
            </h3>
            
            <div className="space-y-3">
              {/* Selected Parent Path (if any) */}
              {selectedFolder && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Parent Folder:</span>
                    <span className="font-medium text-foreground font-mono text-xs truncate max-w-[300px]">
                      {selectedFolder}
                    </span>
                  </div>
                </div>
              )}

              {/* Folder Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Folder Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter new folder name"
                  autoFocus
                  disabled={isCreating}
                  className="font-mono text-sm"
                />
              </div>

              {/* Message Alert */}
              {message && (
                <div className={`rounded-lg border px-4 py-3 text-sm flex items-start gap-2 ${
                  message.toLowerCase().includes("✗") || 
                  message.toLowerCase().includes("error") ||
                  message.toLowerCase().includes("required") ||
                  message.toLowerCase().includes("cannot contain")
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
                    : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
                }`}>
                  {message.toLowerCase().includes("✓") ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : message.toLowerCase().includes("✗") || message.toLowerCase().includes("error") ? (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : null}
                  <span>{message}</span>
                </div>
              )}

              {/* Help text */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Folder names cannot contain: <code className="px-1 bg-muted rounded">&lt; &gt; : " / \ | ? *</code></p>
                <p>• Press Enter to create folder</p>
                <p>• Leave parent folder empty to create in root</p>
              </div>
            </div>
          </div>

          {/* Select Parent Folder Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Select Parent Folder (Optional)
            </h3>
            <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-border bg-background p-2">
              {folderTree && folderTree.length > 0 ? (
                <FolderTreeSelector
                  items={folderTree}
                  onSelect={handleFolderSelect}
                  selectedFolder={selectedFolder}
                />
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No folders available. Folder will be created in root.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} disabled={isCreating || !folderName.trim()}>
            {isCreating ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Recursive Folder Tree Selector Component
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (e, path) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Clear selection button for root
  const handleClearSelection = (e) => {
    e.stopPropagation();
    onSelect("");
  };

  return (
    <div className="space-y-2">
      {/* Root option */}
      {level === 0 && (
        <div
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
            selectedFolder === "" 
              ? "bg-primary/10 text-primary font-medium"
              : "hover:bg-accent text-foreground"
          }`}
          onClick={() => onSelect("")}
        >
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate flex-1">(Root Directory)</span>
          {selectedFolder === "" && (
            <button
              onClick={handleClearSelection}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      )}
      
      <div className="space-y-0.5" style={{ paddingLeft: level > 0 ? 16 : 0 }}>
        {items?.map((item) => {
          if (item.type !== "folder") return null;

          const isSelected = selectedFolder === item.path;
          const isExpanded = expanded[item.path];
          const hasChildren = item.children && item.children.length > 0;
          const isDisabled = item.meta?.readOnly;

          return (
            <div key={item.path}>
              <div
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent text-foreground"
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (!isDisabled) onSelect(item.path);
                }}
              >
                <button
                  type="button"
                  onClick={(e) => toggleExpand(e, item.path)}
                  className="shrink-0 rounded p-0.5 hover:bg-accent transition-colors"
                  disabled={!hasChildren}
                >
                  {hasChildren ? (
                    isExpanded ? 
                      <ChevronDown className="h-3.5 w-3.5" /> : 
                      <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <span className="w-3.5" />
                  )}
                </button>
                
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                
                <span className="truncate flex-1">{item.name}</span>
                
                {isDisabled && (
                  <span className="text-xs text-muted-foreground shrink-0">(Read Only)</span>
                )}
                
                {isSelected && !isDisabled && (
                  <span className="text-xs text-primary shrink-0">Selected</span>
                )}
              </div>

              {isExpanded && hasChildren && (
                <FolderTreeSelector
                  items={item.children}
                  onSelect={onSelect}
                  selectedFolder={selectedFolder}
                  level={level + 1}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreateFolderDrawer;