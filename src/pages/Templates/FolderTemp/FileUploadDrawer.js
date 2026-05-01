

// import React, { useState, useEffect } from "react";
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
//   Collapse,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { docAPI } from "../../../services/api";
// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {

//   console.log("foldertree",folderTree)
//   const [file, setFile] = useState(null);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//    const [files, setFiles] = useState([]);
//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setFile(null);
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);
// const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const maxSize = 50 * 1024 * 1024; // 50 MB
//     const forbiddenTypes = ["video/", "audio/"];

//     const validFiles = selectedFiles.filter((file) => {
//       if (file.size > maxSize) {
//         alert(`❌ ${file.name} exceeds 50 MB limit.`);
//         return false;
//       }
//       if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
//         alert(`❌ ${file.name} is an audio or video file — not allowed.`);
//         return false;
//       }
//       return true;
//     });

//     setFiles(validFiles);
//   };
//   // const handleFileChange = (e) => setFile(e.target.files[0]);
//   const handleFolderSelect = (path) => setSelectedFolder(path);

  
//  const handleUpload = async () => {
//   if (files.length === 0 || !selectedFolder) {
//     setMessage("Please select files and a folder.");
//     return;
//   }

//   try {
//     const formData = new FormData();
//     files.forEach((file) => formData.append("files", file));

//     const res = await docAPI.uploadFile(formData, selectedFolder);

//     const successMsg = res.data.message || "Files uploaded successfully";

//     setMessage(`✅ ${successMsg}`);
//     toast.success(`✅ ${successMsg}`);

//     setFiles([]);
//     onClose();

//     await fetchFolderTree();
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err.response?.data?.error || "Error uploading files";

//     setMessage(`❌ ${errorMsg}`);
//     toast.error(errorMsg);
//   }
// };
  
//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📄 Upload File
//         </Typography>

       
//  <Button
//                   variant="outlined"
//                   component="label"
//                   fullWidth
//                   sx={{ mt: 1, mb: 2 }}
//                 >
//                   {files.length > 0
//                     ? `${files.length} file(s) selected`
//                     : "Select Files"}
//                   <input type="file" hidden multiple onChange={handleFileChange} />
//                 </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//         >
//           Upload
//         </Button>

//         {message && (
//           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
//         )}

//         <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
//           Close
//         </Button>

//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Select Folder from Tree
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

// // Recursive Folder Tree with files and MUI
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
//               {/* Render subfolders recursively */}
//               <FolderTreeSelector
//                 items={item.children}
//                 onSelect={onSelect}
//                 selectedFolder={selectedFolder}
//                 level={level + 1}
//               />

//               {/* Render files inside folder */}
//               {item.meta?.files?.length > 0 && (
//                 <List sx={{ pl: 4 }}>
//                   {item.meta.files.map((file) => (
//                     <ListItem
//                       key={file.name}
//                       sx={{ pl: 2 }}
//                     >
//                       <ListItemIcon>
//                         <InsertDriveFileIcon fontSize="small" />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={`${file.name}${
//                           file.readOnly ? " (Read Only)" : ""
//                         }`}
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

// export default FileUploadDrawer;



import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { docAPI } from "../../../services/api";
import { 
  Upload, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  File,
  Image,
  FileArchive,
  FileJson
} from "lucide-react";
import { Button } from "../../../components/ui/button";

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  console.log("foldertree", folderTree);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFiles([]);
      setMessage("");
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [isOpen, selectedFolderForMenu]);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="h-3.5 w-3.5" />;
    if (fileType.includes('pdf')) return <FileText className="h-3.5 w-3.5" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive className="h-3.5 w-3.5" />;
    if (fileType.includes('json')) return <FileJson className="h-3.5 w-3.5" />;
    return <File className="h-3.5 w-3.5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50 MB
    const forbiddenTypes = ["video/", "audio/"];

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 50 MB limit.`);
        return false;
      }
      if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
        toast.error(`${file.name} is an audio or video file — not allowed.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
    
    // Reset input value to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAllFiles = () => {
    setFiles([]);
  };

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select files to upload.");
      toast.error("Please select files to upload.");
      return;
    }

    if (!selectedFolder) {
      setMessage("Please select a destination folder.");
      toast.error("Please select a destination folder.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setMessage("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      // Simulate progress (you can replace with actual upload progress if your API supports it)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const res = await docAPI.uploadFile(formData, selectedFolder);

      clearInterval(progressInterval);
      setUploadProgress(100);

      const successMsg = res.data.message || "Files uploaded successfully";

      setMessage(`✓ ${successMsg}`);
      toast.success(`✓ ${successMsg}`);

      setTimeout(() => {
        setFiles([]);
        onClose();
        fetchFolderTree();
      }, 1500);
    } catch (err) {
      console.error(err);

      const errorMsg = err.response?.data?.error || "Error uploading files";
      setMessage(`✗ ${errorMsg}`);
      toast.error(errorMsg);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const maxSize = 50 * 1024 * 1024;
    const forbiddenTypes = ["video/", "audio/"];

    const validFiles = droppedFiles.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 50 MB limit.`);
        return false;
      }
      if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
        toast.error(`${file.name} is an audio or video file — not allowed.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
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
            <Upload className="h-5 w-5 text-primary" />
            Upload Files
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* File Selection Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              File Selection
            </h3>
            
            <div className="space-y-3">
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative"
              >
                <label className="flex flex-col items-center justify-center gap-2 w-full cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50">
                  <Upload className="h-8 w-8" />
                  <span className="font-medium">
                    {files.length > 0 ? "Add more files" : "Click to select files"}
                  </span>
                  <span className="text-xs">or drag and drop</span>
                  <span className="text-xs text-muted-foreground">
                    Maximum file size: 50 MB per file (No audio/video)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Selected Files ({files.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAllFiles}
                      disabled={isUploading}
                      className="text-destructive hover:text-destructive h-auto py-1"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Clear all
                    </Button>
                  </div>
                  
                  <div className="max-h-[200px] overflow-y-auto space-y-1 rounded-lg border border-border bg-muted/20 p-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs bg-background rounded-md px-2 py-1.5 border border-border group"
                      >
                        {getFileIcon(file.type)}
                        <span className="truncate flex-1 font-mono">
                          {file.name}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          disabled={isUploading}
                          className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Message Alert */}
              {message && (
                <div className={`rounded-lg border px-4 py-3 text-sm flex items-start gap-2 ${
                  message.toLowerCase().includes("✗") || 
                  message.toLowerCase().includes("error") ||
                  message.toLowerCase().includes("please")
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
            </div>
          </div>

          {/* Select Destination Folder Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Select Destination Folder
            </h3>
            <div className="max-h-[40vh] overflow-y-auto rounded-lg border border-border bg-background p-2">
              {folderTree && folderTree.length > 0 ? (
                <FolderTreeSelector
                  items={folderTree}
                  onSelect={handleFolderSelect}
                  selectedFolder={selectedFolder}
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
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || files.length === 0 || !selectedFolder}>
            {isUploading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length > 0 ? `(${files.length})` : ""}
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

  return (
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
  );
};

export default FileUploadDrawer;