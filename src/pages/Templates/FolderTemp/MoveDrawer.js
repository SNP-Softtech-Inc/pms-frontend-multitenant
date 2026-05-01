
// // ============================
// // 📁 Drawer: Move Folder / File (MUI Version)
// // ============================

// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Collapse,
//   Alert,
//   ListItemIcon,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import axios from "axios";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { toast } from "react-toastify";
// import { docAPI } from "../../../services/api";
// const MoveDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [destinationPath, setDestinationPath] = useState("");
//   const [sourcePath, setSourcePath] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSourcePath(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSourcePath("");
//       setDestinationPath("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleMove = async () => {
//   try {
//     setMessage("");

//     if (!sourcePath || !destinationPath) {
//       setMessage("Please select both source and destination paths.");
//       return;
//     }

//     const res = await docAPI.moveItem({
//       sourcePath,
//       destinationPath,
//     });

//     const successMsg = res.data.message || "Moved successfully";

//     setMessage(successMsg);
//     toast.success(successMsg);

//     onClose();
//     await fetchFolderTree?.();
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err.response?.data?.error || "Move failed";

//     setMessage(errorMsg);
//     toast.error(errorMsg);
//   }
// };

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 360, p: 3, bgcolor: "#f8fff0", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📁 Move Folder / File
//         </Typography>

//         <TextField
//           label="Source Path"
//           value={sourcePath}
//           fullWidth
//           margin="dense"
//           InputProps={{ readOnly: true }}
//         />

//         <TextField
//           label="Destination Path"
//           value={destinationPath}
//           onChange={(e) => setDestinationPath(e.target.value)}
//           fullWidth
//           margin="dense"
//         />

//         <Button
//           variant="contained"
//           fullWidth
//           sx={{ mt: 2 }}
//           onClick={handleMove}
//         >
//           Move
//         </Button>

//         {message && (
//           <Alert
//             severity={message.includes("failed") ? "error" : "info"}
//             sx={{ mt: 2 }}
//           >
//             {message}
//           </Alert>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle1" gutterBottom>
//           Select Destination Folder
//         </Typography>

//         <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={(path) => setDestinationPath(path)}
//             selectedFolder={destinationPath}
//           />
//         </Box>

//         <Button
//           onClick={onClose}
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2, color: "#555" }}
//         >
//           Close
//         </Button>
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
//               <ListItemIcon
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleExpand(item.path);
//                 }}
//               >
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
//                 (isExpanded ? (
//                   <ExpandLess
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ) : (
//                   <ExpandMore
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ))}
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
// export default MoveDrawer;


import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { docAPI } from "../../../services/api";
import { 
  FolderInput, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  X,
  MoveRight
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

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
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSourcePath(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSourcePath("");
      setDestinationPath("");
      setMessage("");
      setIsMoving(false);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleMove = async () => {
    try {
      setIsMoving(true);
      setMessage("");

      if (!sourcePath || !destinationPath) {
        setMessage("Please select both source and destination paths.");
        toast.error("Please select both source and destination paths.");
        setIsMoving(false);
        return;
      }

      if (sourcePath === destinationPath) {
        setMessage("Source and destination paths cannot be the same.");
        toast.error("Source and destination paths cannot be the same.");
        setIsMoving(false);
        return;
      }

      const res = await docAPI.moveItem({
        sourcePath,
        destinationPath,
      });

      const successMsg = res.data.message || "Moved successfully";

      setMessage(successMsg);
      toast.success(successMsg);

      setTimeout(() => {
        onClose();
        fetchFolderTree?.();
      }, 1000);
    } catch (err) {
      console.error(err);

      const errorMsg = err.response?.data?.error || "Move failed";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsMoving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer content */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FolderInput className="h-5 w-5 text-primary" />
            Move Folder / File
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
          {/* Move Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <MoveRight className="h-4 w-4 text-primary" />
              Move Details
            </h3>
            
            <div className="space-y-4">
              {/* Source Path */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Source Path
                </label>
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground font-mono">
                  {sourcePath || "—"}
                </div>
              </div>

              {/* Destination Path */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Destination Path
                </label>
                <Input
                  value={destinationPath}
                  onChange={(e) => setDestinationPath(e.target.value)}
                  placeholder="Select from tree below or type path"
                  className="font-mono text-sm"
                />
              </div>

              {/* Message Alert */}
              {message && (
                <div className={`rounded-lg border px-4 py-3 text-sm ${
                  message.toLowerCase().includes("fail") || 
                  message.toLowerCase().includes("please") ||
                  message.toLowerCase().includes("cannot")
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
                    : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Select Destination Folder Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Select Destination Folder
            </h3>
            <div className="max-h-[45vh] overflow-y-auto rounded-lg border border-border bg-background p-2">
              {folderTree && folderTree.length > 0 ? (
                <FolderTreeSelector
                  items={folderTree}
                  onSelect={(path) => setDestinationPath(path)}
                  selectedFolder={destinationPath}
                  sourcePath={sourcePath}
                />
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No folders available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isMoving}>
            Cancel
          </Button>
          <Button onClick={handleMove} disabled={isMoving}>
            {isMoving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Moving...
              </>
            ) : (
              <>
                <MoveRight className="h-4 w-4 mr-2" />
                Move
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Recursive Folder Tree Selector Component
const FolderTreeSelector = ({ items, onSelect, selectedFolder, sourcePath, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (e, path) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="space-y-0.5" style={{ paddingLeft: level > 0 ? 16 : 0 }}>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const hasChildren = item.children && item.children.length > 0;
        const isSourceFolder = sourcePath === item.path;
        const isDisabled = item.meta?.readOnly || isSourceFolder;

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
              
              {isSourceFolder && (
                <span className="text-xs text-muted-foreground shrink-0">(Current Location)</span>
              )}
              
              {item.meta?.readOnly && (
                <span className="text-xs text-muted-foreground shrink-0">(Read Only)</span>
              )}
            </div>

            {isExpanded && hasChildren && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                sourcePath={sourcePath}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MoveDrawer;