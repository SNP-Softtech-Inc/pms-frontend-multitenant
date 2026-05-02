

// import React, { useState, useEffect } from "react";
// import { Drawer, Box, Typography, TextField, Button } from "@mui/material";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { accountDocsAPI } from "../../../../services/api";
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
//       setNewName(selectedFolderForMenu.name);
//       setMessage("");
//     } else if (!isOpen) {
//       setCurrentPath("");
//       setNewName("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // ✅ Rename function
//  const handleRename = async () => {
//   if (!newName.trim()) {
//     setMessage("⚠️ New name is required!");
//     return;
//   }

//   try {
//     const res = await accountDocsAPI.renameItem({
//       currentPath,
//       newName,
//     });

//     const successMsg = res?.data?.message || "Renamed successfully";

//     setMessage(`✅ ${successMsg}`);
//     toast.success(successMsg);

//     await fetchFolderTree(); // refresh
//     onClose();
//   } catch (err) {
//     console.error("Rename error:", err);

//     const errorMsg =
//       err?.response?.data?.error ||
//       err?.response?.data?.message ||
//       "Server Error";

//     toast.error(errorMsg);

//     setMessage(`❌ ${errorMsg}`);
//   }
// };

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           ✏️ Rename Item
//         </Typography>

//         {/* <TextField
//           label="Current Path"
//           value={currentPath}
//           InputProps={{ readOnly: true }}
//           fullWidth
//           margin="dense"
//         /> */}

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
import { toast } from "react-toastify";
import { Button } from "../../../../components/ui/button";
import { X, Edit2, AlertCircle } from "lucide-react";
import { accountDocsAPI } from "../../../../services/api";

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
      const res = await accountDocsAPI.renameItem({
        currentPath,
        newName,
      });

      const successMsg = res?.data?.message || "Renamed successfully";

      setMessage(`✅ ${successMsg}`);
      toast.success(successMsg);

      await fetchFolderTree(); // refresh
      onClose();
    } catch (err) {
      console.error("Rename error:", err);

      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Server Error";

      toast.error(errorMsg);

      setMessage(`❌ ${errorMsg}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRename();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
        
        {/* Drawer panel */}
        <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <Edit2 className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Rename Item</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Current Path (read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Current Path
              </label>
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground break-all">
                {currentPath || "—"}
              </div>
            </div>

            {/* New Name Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                New Name
              </label>
              <input
                type="text"
                placeholder="Enter new file or folder name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                autoFocus
              />
            </div>

            {/* Message Display */}
            {message && (
              <div className={`rounded-lg p-3 flex items-start gap-2 ${
                message.includes("✅") 
                  ? "bg-primary/10 border border-primary/20 text-primary"
                  : message.includes("❌") || message.includes("error")
                  ? "bg-destructive/10 border border-destructive/20 text-destructive"
                  : "bg-muted/50 border border-border text-foreground"
              }`}>
                {message.includes("❌") && <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={handleRename} className="flex-1">
              Rename
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenameDrawer;