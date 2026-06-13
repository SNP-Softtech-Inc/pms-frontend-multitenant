

// // ============================
// // 📁 Drawer: Move Folder / File (MUI Version) - Supports Single & Bulk
// // ============================

// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Collapse,
//   Alert,
//   ListItemIcon,
//   Chip,
//   Stack,
//   CircularProgress
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import axios from "axios";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
// import { toast } from "react-toastify";
// import { accountDocsAPI } from "../../../../services/api";
// const MoveDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   // New props for bulk operations
//   isBulkOperation = false,
//   selectedPaths = [],
//   onMoveComplete
// }) => {
  
//   const [destinationPath, setDestinationPath] = useState("");
//   const [sourcePaths, setSourcePaths] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       if (isBulkOperation && selectedPaths.length > 0) {
//         // Bulk mode: use provided paths
//         setSourcePaths(selectedPaths);
//       } else if (selectedFolderForMenu) {
//         // Single mode: use selected item
//         setSourcePaths([selectedFolderForMenu.path]);
//       }
//     } else {
//       // Reset on close
//       // setSourcePaths([]);
//       setDestinationPath("");
//       setMessage("");
//       setLoading(false);
//     }
//   }, [isOpen, selectedFolderForMenu, isBulkOperation, selectedPaths]);

//  const handleMove = async () => {
//   try {
//     setMessage("");
//     setLoading(true);

//     if (sourcePaths.length === 0) {
//       setMessage("No source items selected.");
//       toast.warning("No items selected");
//       return;
//     }

//     if (!destinationPath) {
//       setMessage("Please select a destination folder.");
//       toast.warning("Select destination folder");
//       return;
//     }

//     const isBulk = sourcePaths.length > 1 || isBulkOperation;

//     let res;

//     if (isBulk) {
//       // ✅ bulk move API
//       res = await accountDocsAPI.bulkMoveItems({
//         paths: sourcePaths,
//         targetPath: destinationPath,
//       });
//     } else {
//       // ✅ single move API
//       res = await accountDocsAPI.moveItem({
//         sourcePath: sourcePaths[0],
//         destinationPath: destinationPath,
//       });
//     }

//     const successMsg = res?.data?.message || "Moved successfully";

//     setMessage(successMsg);
//     toast.success(successMsg);

//     // callback for parent (important for bulk UI refresh)
//     if (onMoveComplete && typeof onMoveComplete === "function") {
//       onMoveComplete(destinationPath);
//     }

//     await fetchFolderTree?.();
//     onClose();
//   } catch (err) {
//     console.error(err);

//     const errorMessage =
//       err?.response?.data?.error ||
//       err?.response?.data?.message ||
//       "Move failed";

//     setMessage(errorMessage);
//     toast.error(errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };

//   // Function to get item name from path
//   const getItemNameFromPath = (path) => {
//     console.log("Getting item name from path:", path);
//     return path.split('/').pop() || path;
//   };

//   // Check if destination is a subfolder of any source (to prevent circular moves)
//   const isInvalidDestination = (destPath) => {
//     // console.log("Checking invalid destination:", destPath, sourcePaths);
//     return sourcePaths.some(sourcePath => {
//       return destPath.startsWith(sourcePath + '/') || destPath === sourcePath;
//     });
//   };



//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 420, p: 3, bgcolor: "#f8fff0", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           {isBulkOperation ? "📦 Move Multiple Items" : "📁 Move Item"}
//         </Typography>

//         {/* Source Items Display */}
//         <Box sx={{ mb: 3, p: 2, bgcolor: "#f0f8ff", borderRadius: 1 }}>
//           <Typography variant="subtitle2" color="primary" gutterBottom>
//             {isBulkOperation ? "Items to Move:" : "Item to Move:"}
//           </Typography>
          
//           {sourcePaths.length === 0 ? (
//             <Typography variant="body2" color="text.secondary">
//               No items selected
//             </Typography>
//           ) : (
//             <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//               {sourcePaths.slice(0, 5).map((path, index) => (
//                 <Chip
//                   key={index}
//                   label={getItemNameFromPath(path)}
//                   size="small"
//                   variant="outlined"
//                   color="primary"
//                 />
//               ))}
//               {sourcePaths.length > 5 && (
//                 <Chip
//                   label={`+${sourcePaths.length - 5} more`}
//                   size="small"
//                   variant="outlined"
//                 />
//               )}
//             </Stack>
//           )}
          
//           <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
//             Total: {sourcePaths.length} item(s)
//           </Typography>
//         </Box>

//         {/* Move Button */}
//         <Button
//           variant="contained"
//           fullWidth
//           sx={{ mt: 2 }}
//           onClick={handleMove}
//           disabled={!destinationPath || sourcePaths.length === 0 || loading || isInvalidDestination(destinationPath)}
//           startIcon={loading ? <CircularProgress size={20} /> : <MoveToInboxIcon />}
//         >
//           {loading ? "Moving..." : "Move Items"}
//         </Button>

//         {isInvalidDestination(destinationPath) && (
//           <Alert severity="warning" sx={{ mt: 2 }}>
//             Cannot move a folder into itself or its subfolder
//           </Alert>
//         )}

//         {message && (
//           <Alert
//             severity={message.includes("failed") || message.includes("error") ? "error" : "info"}
//             sx={{ mt: 2 }}
//           >
//             {message}
//           </Alert>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle1" gutterBottom>
//           Select Destination Folder
//         </Typography>

//         <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={(path) => setDestinationPath(path)}
//             selectedFolder={destinationPath}
//             disabledPaths={sourcePaths} // Disable source folders from being selected
//           />
//         </Box>

//         <Typography variant="body2" color="text.secondary" sx={{ mt: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
//           Selected destination: {destinationPath || "None"}
//         </Typography>

//         <Button
//           onClick={onClose}
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2, color: "#555" }}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// // ============================
// // 🔹 Recursive Folder Tree Selector (MUI) - Enhanced
// // ============================

// const FolderTreeSelector = ({ 
//   items, 
//   onSelect, 
//   selectedFolder, 
//   disabledPaths = [],
//   level = 0 
// }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   // Check if a folder should be disabled (is a source path or contains a source path)
//   // const isFolderDisabled = (itemPath) => {
//   //   return disabledPaths.some(disabledPath => 
//   //     disabledPath === itemPath || 
//   //     itemPath.startsWith(disabledPath + '/') ||
//   //     disabledPath.startsWith(itemPath + '/')
//   //   );
//   // };
//   const isFolderDisabled = (itemPath) => {
//   return disabledPaths.includes(itemPath);
// };


//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];
//         const isDisabled = isFolderDisabled(item.path) || item.meta?.readOnly;

//         return (
//           <React.Fragment key={item.path}>
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 "&:hover": { 
//                   bgcolor: isDisabled ? "transparent" : "#dbefff" 
//                 },
//                 cursor: isDisabled ? "not-allowed" : "pointer",
//                 opacity: isDisabled ? 0.5 : 1,
//               }}
//               onClick={() => {
//                 if (!isDisabled) onSelect(item.path);
//               }}
//             >
//               <ListItemIcon 
//                 onClick={(e) => { 
//                   e.stopPropagation(); 
//                   if (!isDisabled) toggleExpand(item.path); 
//                 }}
//                 sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
//               >
//                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
//               </ListItemIcon>
//               <ListItemText
//                 primary={
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     {item.name}
//                     {item.meta?.readOnly && (
//                       <Typography 
//                         component="span" 
//                         variant="caption" 
//                         sx={{ color: "error.main", ml: 1 }}
//                       >
//                         (Locked)
//                       </Typography>
//                     )}
//                   </Box>
//                 }
//                 sx={{
//                   fontWeight: isSelected ? "bold" : "normal",
//                   color: isSelected ? "#0056b3" : isDisabled ? "#999" : "inherit",
//                 }}
//               />
//               {item.children?.length > 0 && (
//                 <Box onClick={(e) => { 
//                   e.stopPropagation(); 
//                   if (!isDisabled) toggleExpand(item.path); 
//                 }}>
//                   {isExpanded ? 
//                     <ExpandLess sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }} /> : 
//                     <ExpandMore sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }} />
//                   }
//                 </Box>
//               )}
//             </ListItem>

//             {item.children?.length > 0 && (
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   disabledPaths={disabledPaths}
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

// ============================
// 📁 Drawer: Move Folder / File (ShadCN Version) - Supports Single & Bulk
// ============================

import React, { useState, useEffect } from "react";
import { 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Move,
  AlertCircle,
  Lock
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {useToastContext} from "../../../../context/ToastContext";
import { accountDocsAPI } from "../../../../services/api";

const MoveDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  // New props for bulk operations
  isBulkOperation = false,
  selectedPaths = [],
  onMoveComplete
}) => {
  const [destinationPath, setDestinationPath] = useState("");
  const [sourcePaths, setSourcePaths] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const {showToast} = useToastContext();
  useEffect(() => {
    if (isOpen) {
      if (isBulkOperation && selectedPaths.length > 0) {
        // Bulk mode: use provided paths
        setSourcePaths(selectedPaths);
      } else if (selectedFolderForMenu) {
        // Single mode: use selected item
        setSourcePaths([selectedFolderForMenu.path]);
      }
    } else {
      // Reset on close
      setDestinationPath("");
      setMessage("");
      setLoading(false);
    }
  }, [isOpen, selectedFolderForMenu, isBulkOperation, selectedPaths]);

  const handleMove = async () => {
    try {
      setMessage("");
      setLoading(true);

      if (sourcePaths.length === 0) {
        setMessage("No source items selected.");
        showToast({
          title: "No items selected",
          type: "warning",
        });
        return;
      }

      if (!destinationPath) {
        setMessage("Please select a destination folder.");
        showToast({
          title: "Select destination folder",
          type: "warning",
        });
        return;
      }

      const isBulk = sourcePaths.length > 1 || isBulkOperation;

      let res;

      if (isBulk) {
        // ✅ bulk move API
        res = await accountDocsAPI.bulkMoveItems({
          paths: sourcePaths,
          targetPath: destinationPath,
        });
      } else {
        // ✅ single move API
        res = await accountDocsAPI.moveItem({
          sourcePath: sourcePaths[0],
          destinationPath: destinationPath,
        });
      }

      const successMsg = res?.data?.message || "Moved successfully";

      setMessage(successMsg);
      showToast({
        title: successMsg,
        type: "success",
      });

      // callback for parent (important for bulk UI refresh)
      if (onMoveComplete && typeof onMoveComplete === "function") {
        onMoveComplete(destinationPath);
      }

      await fetchFolderTree?.();
      onClose();
    } catch (err) {
      console.error(err);

      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Move failed";

      setMessage(errorMessage);
      showToast({
        title: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get item name from path
  const getItemNameFromPath = (path) => {
    return path.split('/').pop() || path;
  };

  // Check if destination is a subfolder of any source (to prevent circular moves)
  const isInvalidDestination = (destPath) => {
    return sourcePaths.some(sourcePath => {
      return destPath.startsWith(sourcePath + '/') || destPath === sourcePath;
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
        
        {/* Drawer panel */}
        <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-background shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <Move className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                {isBulkOperation ? "Move Multiple Items" : "Move Item"}
              </h2>
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
            {/* Source Items Display */}
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
              <p className="text-sm font-semibold text-primary mb-2">
                {isBulkOperation ? "Items to Move:" : "Item to Move:"}
              </p>
              
              {sourcePaths.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No items selected
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sourcePaths.slice(0, 5).map((path, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {getItemNameFromPath(path)}
                    </span>
                  ))}
                  {sourcePaths.length > 5 && (
                    <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      +{sourcePaths.length - 5} more
                    </span>
                  )}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Total: {sourcePaths.length} item(s)
              </p>
            </div>

            {/* Warning message for invalid destination */}
            {isInvalidDestination(destinationPath) && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">
                  Cannot move a folder into itself or its subfolder
                </p>
              </div>
            )}

            {/* Message display */}
            {message && (
              <div className={`rounded-lg p-3 ${
                message.includes("failed") || message.includes("error") 
                  ? "bg-destructive/10 border border-destructive/20 text-destructive" 
                  : "bg-primary/10 border border-primary/20 text-primary"
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Folder Tree */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Select Destination Folder
              </p>
              <div className="rounded-lg border border-border bg-background overflow-auto max-h-80">
                <FolderTreeSelector
                  items={folderTree}
                  onSelect={(path) => setDestinationPath(path)}
                  selectedFolder={destinationPath}
                  disabledPaths={sourcePaths}
                />
              </div>
            </div>

            {/* Selected destination display */}
            <div className="rounded-lg bg-muted/30 border border-border p-3">
              <p className="text-xs text-muted-foreground mb-1">Selected destination:</p>
              <p className="text-sm text-foreground break-all">
                {destinationPath || "None"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleMove}
              disabled={!destinationPath || sourcePaths.length === 0 || loading || isInvalidDestination(destinationPath)}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Moving...
                </>
              ) : (
                <>
                  <Move className="h-4 w-4 mr-2" />
                  Move Items
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================
// 🔹 Recursive Folder Tree Selector (ShadCN) - Enhanced
// ============================

const FolderTreeSelector = ({ 
  items, 
  onSelect, 
  selectedFolder, 
  disabledPaths = [],
  level = 0 
}) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Check if a folder should be disabled (is a source path)
  const isFolderDisabled = (itemPath) => {
    return disabledPaths.includes(itemPath);
  };

  return (
    <ul className="py-1">
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const isDisabled = isFolderDisabled(item.path) || item.meta?.readOnly;
        const hasChildren = item.children?.length > 0;

        return (
          <li key={item.path}>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md mx-1 mb-0.5 transition-colors text-sm
                ${
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                }
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : "cursor-pointer"
                }
              `}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              onClick={() => !isDisabled && onSelect(item.path)}
            >
              {/* Expand/Collapse button */}
              <button
                className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) toggleExpand(item.path);
                }}
                disabled={isDisabled}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )
                ) : (
                  <span className="w-3.5 inline-block" />
                )}
              </button>

              {/* Folder icon */}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-primary shrink-0" />
              )}

              {/* Folder name */}
              <span className="truncate flex-1">
                {item.name}
              </span>

              {/* Lock icon for read-only */}
              {item.meta?.readOnly && (
                <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
            </div>

            {/* Recursive children */}
            {hasChildren && isExpanded && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                disabledPaths={disabledPaths}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MoveDrawer;