


// import React, { useState, useEffect ,useRef} from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,LinearProgress
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { toast } from "react-toastify";
// import { docAPI,  } from "../../../services/api";
// import JSZip from "jszip";
// import axios from "axios";
// const FolderUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [folderName, setFolderName] = useState("my-uploaded-folder");
//   const [files, setFiles] = useState([]);
//   const hiddenFileInput = useRef(null);
//   // open hidden input
//   const handleClick = () => {
//     hiddenFileInput.current.click();
//   };

  
//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//       setFolderName("");
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setFolderName("");
//       setFiles([]);
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   const handleUploadFolderSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);

//     if (selectedFiles.length > 0) {
//       const firstPath = selectedFiles[0].webkitRelativePath;
//       const topLevelFolder = firstPath.split("/")[0];
//       setFolderName(topLevelFolder);
//     }
//   };

//   const [progress, setProgress] = useState(0);


//  // Upload ZIP
//  const handleUpload = async () => {
//   if (!files.length) {
//     alert("Please select a folder first!");
//     return;
//   }

//   // ------------------------------
//   // ⭐ Use targetFolderPath logic
//   // ------------------------------
//   let targetFolderPath = selectedFolder
//     ? `${selectedFolder}/${folderName}`
//     : folderName;

//   targetFolderPath = targetFolderPath.replace(/\/+/g, "/");
//   console.log("Target Folder Path:", targetFolderPath);

//   setMessage("Zipping folder...");

//   const zip = new JSZip();
//   files.forEach((file) => {
//     zip.file(file.webkitRelativePath, file);
//   });

//   const zipBlob = await zip.generateAsync({ type: "blob" });

//   const formData = new FormData();
//   formData.append("folderZip", zipBlob, `${folderName}.zip`);
//   formData.append("folderName", folderName);
//   formData.append("folderPath", targetFolderPath);

//   setMessage("Uploading...");

//   try {
//     // ✅ Use the API function instead of direct axios.post
//     const res = await docAPI.uploadFolderZip(formData, targetFolderPath);
    
//     setMessage(res.data.message || "Uploaded successfully!");
//     onClose(); // Close drawer on success
//     fetchFolderTree(); // Refresh folder tree to show new upload
//     console.log(res.data.message);
//   } catch (err) {
//     console.error(err);
//     setMessage("Upload failed!");
//   }
// };

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📁 Upload Folder
//         </Typography>

//   {/* MUI Button instead of File Input */}
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleClick}
//         sx={{ mb: 2 }}
//       >
//         Select Folder
//       </Button>

//       {/* Hidden File Input */}
//       <input
//         type="file"
//         ref={hiddenFileInput}
//         onChange={handleUploadFolderSelect}
//         style={{ display: "none" }}
//         webkitdirectory="true"
//         directory="true"
//         multiple
//       />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//         >
//           🚀 Upload
//         </Button>
// {progress > 0 && progress < 100 && (
//   <Box sx={{ width: "100%", mt: 2 }}>
//     <LinearProgress variant="determinate" value={progress} />
//     <Typography align="center" sx={{ mt: 1 }}>
//       {progress}%
//     </Typography>
//   </Box>
// )}

//         {message && (
//           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
//         )}

//         <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
//           Close
//         </Button>

//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Select Parent Folder from Tree
//           </Typography>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={handleFolderSelect}
//             selectedFolder={selectedFolder}
//           />
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// // Recursive folder tree
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         const isExpanded = expanded[item.path];
//         const isSelected = selectedFolder === item.path;

//         if (item.type !== "folder") return null;

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

//             <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//               {/* Subfolders */}
//               <FolderTreeSelector
//                 items={item.children}
//                 onSelect={onSelect}
//                 selectedFolder={selectedFolder}
//                 level={level + 1}
//               />

//               {/* Files inside folder */}
//               {item.meta?.files?.length > 0 && (
//                 <List sx={{ pl: 4 }}>
//                   {item.meta.files.map((file) => (
//                     <ListItem key={file.name} sx={{ pl: 2 }}>
//                       <ListItemIcon>
//                         <InsertDriveFileIcon fontSize="small" />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={`${file.name}${file.readOnly ? " (Read Only)" : ""}`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//             </Collapse>
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

// export default FolderUploadDrawer;


import React, { useState, useEffect, useRef } from "react";
import {useToastContext} from "../../../context/ToastContext";
import JSZip from "jszip";
import { docAPI } from "../../../services/api";
import { 
  FolderUp, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText,
  X
} from "lucide-react";
import { Button } from "../../../components/ui/button";

const FolderUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [folderName, setFolderName] = useState("my-uploaded-folder");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const hiddenFileInput = useRef(null);
  const {showToast} = useToastContext();

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
      setFolderName("");
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setFiles([]);
      setMessage("");
      setProgress(0);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUploadFolderSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const firstPath = selectedFiles[0].webkitRelativePath;
      const topLevelFolder = firstPath.split("/")[0];
      setFolderName(topLevelFolder);
    }
  };

  const handleUpload = async () => {
    if (!files.length) {
      showToast({
        title: "No files selected",
        type: "error",
        description: "Please select a folder first!"
      });
      return;
    }

    let targetFolderPath = selectedFolder
      ? `${selectedFolder}/${folderName}`
      : folderName;

    targetFolderPath = targetFolderPath.replace(/\/+/g, "/");
    console.log("Target Folder Path:", targetFolderPath);

    setMessage("Zipping folder...");
    setProgress(10);

    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.webkitRelativePath, file);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    setProgress(40);

    const formData = new FormData();
    formData.append("folderZip", zipBlob, `${folderName}.zip`);
    formData.append("folderName", folderName);
    formData.append("folderPath", targetFolderPath);

    setMessage("Uploading...");
    setProgress(70);

    try {
      const res = await docAPI.uploadFolderZip(formData, targetFolderPath);
      setProgress(100);
      setMessage(res.data.message || "Uploaded successfully!");
      showToast({
        title: "Folder uploaded successfully",
        type: "success",
        description: res.data.message || "Folder uploaded successfully!"
      });
      setTimeout(() => {
        onClose();
        fetchFolderTree();
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed!");
      showToast({
        title: "Upload failed",
        type: "error",
        description: "An error occurred while uploading the folder"
      });
      setProgress(0);
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
            <FolderUp className="h-5 w-5 text-primary" />
            Upload Folder
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
          {/* Folder Selection Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FolderUp className="h-4 w-4 text-primary" />
              Folder Selection
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleClick}>
                  <FolderUp className="h-4 w-4 mr-2" />
                  Select Folder
                </Button>
                {files.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {files.length} file(s) from <strong className="text-foreground">{folderName}</strong>
                  </span>
                )}
              </div>
              
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleUploadFolderSelect}
                style={{ display: "none" }}
                webkitdirectory="true"
                directory="true"
                multiple
              />

              {/* Progress Bar */}
              {progress > 0 && progress < 100 && (
                <div className="mt-3 space-y-2">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">{progress}%</p>
                </div>
              )}

              {/* Message Alert */}
              {message && (
                <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
                  message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
                    : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Parent Folder Selection Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Select Parent Folder</h3>
            <div className="max-h-[40vh] overflow-y-auto rounded-lg border border-border bg-background p-2">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleUpload}>
            <FolderUp className="h-4 w-4 mr-2" />
            Upload
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

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        No folders available
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {items.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const hasChildren = item.children && item.children.length > 0;
        const hasFiles = item.meta?.files && item.meta.files.length > 0;

        return (
          <div key={item.path}>
            <div
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent text-foreground"
              } ${item.meta?.readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!item.meta?.readOnly) onSelect(item.path);
              }}
            >
              <button
                type="button"
                onClick={(e) => toggleExpand(e, item.path)}
                className="shrink-0 rounded p-0.5 hover:bg-accent transition-colors"
                disabled={!hasChildren && !hasFiles}
              >
                {hasChildren || hasFiles ? (
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
              
              {item.meta?.readOnly && (
                <span className="text-xs text-muted-foreground shrink-0">(Read Only)</span>
              )}
            </div>

            {/* Recursive children folders */}
            {isExpanded && hasChildren && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}

            {/* Files within folder */}
            {isExpanded && hasFiles && (
              <div className="space-y-0.5 ml-6 mt-0.5">
                {item.meta.files.map((file) => (
                  <div 
                    key={file.name} 
                    className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{file.name}</span>
                    {file.readOnly && (
                      <span className="text-xs text-muted-foreground shrink-0">(Read Only)</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FolderUploadDrawer;
