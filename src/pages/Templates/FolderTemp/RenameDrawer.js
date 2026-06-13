

// import React, { useState, useEffect } from "react";
// import { Drawer, Box, Typography, TextField, Button } from "@mui/material";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { docAPI } from "../../../services/api";
// const RenameDrawer = ({
//   isOpen,
//   onClose,
//   fetchFolderTree,
//   selectedFolderForMenu, // the selected file/folder to rename
// }) => {
//   const [newName, setNewName] = useState("");
//   const [currentPath, setCurrentPath] = useState("");
//   const [message, setMessage] = useState("");

//   // ✅ Pre-fill selected item info
//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setCurrentPath(selectedFolderForMenu.path);
//       console.log("Selected item for rename:", selectedFolderForMenu.path);
//       setNewName(selectedFolderForMenu.name);
//       setMessage("");
//     } else if (!isOpen) {
//       setCurrentPath("");
//       setNewName("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // ✅ Rename function
//   const handleRename = async () => {
//   if (!newName.trim()) {
//     setMessage("⚠️ New name is required!");
//     return;
//   }

//   try {
//     const res = await docAPI.renameItem({
//       currentPath: currentPath,
//       newName,
//     });

//     const successMsg = res.data.message || "Renamed successfully";

//     setMessage(`✅ ${successMsg}`);
//     toast.success(successMsg);

//     onClose();
//     await fetchFolderTree();
//   } catch (err) {
//     console.error("Rename error:", err);

//     const errorMsg =
//       err.response?.data?.error || "Server Error";

//     setMessage(`❌ ${errorMsg}`);
//     toast.error(errorMsg);
//   }
// };

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           ✏️ Rename Item
//         </Typography>

       
//         <TextField
//           label="New Name"
//           value={newName}
//           onChange={(e) => setNewName(e.target.value)}
//           placeholder="Enter new file or folder name"
//           fullWidth
//           margin="dense"
//         />

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 2 }}
//           onClick={handleRename}
//         >
//           Rename
//         </Button>

//         {message && (
//           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
//         )}

//         <Button
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2 }}
//           onClick={onClose}
//         >
//           Close
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default RenameDrawer;



import React, { useState, useEffect } from "react";

import { docAPI } from "../../../services/api";
import { 
  PenLine, 
  X, 
  FileText, 
  Folder,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useToastContext } from "../../../context/ToastContext";
const RenameDrawer = ({
  isOpen,
  onClose,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [newName, setNewName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [message, setMessage] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
const {showToast} = useToastContext();
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setCurrentPath(selectedFolderForMenu.path);
      setCurrentName(selectedFolderForMenu.name);
      setCurrentType(selectedFolderForMenu.type);
      setNewName(selectedFolderForMenu.name);
      setMessage("");
      setIsRenaming(false);
    } else if (!isOpen) {
      setCurrentPath("");
      setCurrentName("");
      setCurrentType("");
      setNewName("");
      setMessage("");
      setIsRenaming(false);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleRename = async () => {
    if (!newName.trim()) {
      setMessage("New name is required!");
      showToast({
        title: "Invalid name",
        type: "error",
        description: "New name is required!"
      });
      return;
    }

    if (newName.trim() === currentName) {
      setMessage("New name is the same as current name.");
      showToast({
        title: "Invalid name",
        type: "error",
        description: "New name is the same as current name."
      });
      return;
    }

    setIsRenaming(true);
    setMessage("");

    try {
      const res = await docAPI.renameItem({
        currentPath: currentPath,
        newName: newName.trim(),
      });

      const successMsg = res.data.message || "Renamed successfully";

      setMessage(`✓ ${successMsg}`);
      showToast({
        title: "Item renamed successfully",
        type: "success",
        description: successMsg
      });

      setTimeout(() => {
        onClose();
        fetchFolderTree?.();
      }, 1000);
    } catch (err) {
      console.error("Rename error:", err);

      const errorMsg = err.response?.data?.error || "Server Error";
      setMessage(`✗ ${errorMsg}`);
      showToast({
        title: "Rename failed",
        type: "error",
        description: errorMsg
      });
    } finally {
      setIsRenaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isRenaming && newName.trim()) {
      handleRename();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer content */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            Rename Item
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
          {/* Current Item Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              {currentType === 'folder' ? (
                <Folder className="h-4 w-4 text-primary" />
              ) : (
                <FileText className="h-4 w-4 text-primary" />
              )}
              Current Item
            </h3>
            
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground capitalize">
                  {currentType || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Name:</span>
                <span className="font-medium text-foreground font-mono">
                  {currentName || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Path:</span>
                <span className="font-medium text-foreground font-mono text-xs truncate max-w-[250px]">
                  {currentPath || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Rename Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary" />
              New Name
            </h3>
            
            <div className="space-y-3">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter new file or folder name"
                autoFocus
                disabled={isRenaming}
                className="font-mono text-sm"
              />

              {/* Message Alert */}
              {message && (
                <div className={`rounded-lg border px-4 py-3 text-sm flex items-start gap-2 ${
                  message.toLowerCase().includes("✗") || 
                  message.toLowerCase().includes("error") ||
                  message.toLowerCase().includes("required")
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
                    : message.toLowerCase().includes("✓")
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
                    : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400"
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
                <p>• File extensions should be preserved (e.g., .pdf, .docx)</p>
                <p>• Folder names cannot contain: / \ : * ? " &lt; &gt; |</p>
                <p>• Press Enter to confirm rename</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isRenaming}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={isRenaming || !newName.trim()}>
            {isRenaming ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Renaming...
              </>
            ) : (
              <>
                <PenLine className="h-4 w-4 mr-2" />
                Rename
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RenameDrawer;