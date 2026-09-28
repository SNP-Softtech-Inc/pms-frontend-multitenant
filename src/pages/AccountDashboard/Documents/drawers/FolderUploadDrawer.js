// import React, { useState, useEffect, useRef } from "react";
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
// import JSZip from "jszip";
// import axios from "axios";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { toast } from "react-toastify";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import { accountDocsAPI } from "../../../../services/api";
// import { AiFillFileUnknown } from "react-icons/ai";
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
//   const handleUpload = async () => {
//   if (!files.length) {
//     toast.error("Please select a folder first!");
//     return;
//   }

//   if (!selectedFolder || selectedFolder.trim() === "") {
//     toast.error("Please select target path first!");
//     return;
//   }

//   try {
//     setMessage("Zipping folder...");

//     // build target path
//     let targetFolderPath = selectedFolder
//       ? `${selectedFolder}/${folderName}`
//       : folderName;

//     targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

//     const zip = new JSZip();

//     files.forEach((file) => {
//       zip.file(file.webkitRelativePath, file);
//     });

//     const zipBlob = await zip.generateAsync({ type: "blob" });

//     const formData = new FormData();
//     formData.append("folderZip", zipBlob, `${folderName}.zip`);
//     formData.append("folderName", folderName);
//     formData.append("folderPath", targetFolderPath);

//     setMessage("Uploading...");

//     // ✅ use centralized API
//     const res = await accountDocsAPI.uploadFolderZip(formData);

//     const successMsg = res?.data?.message || "Uploaded successfully!";

//     setMessage(successMsg);
//     toast.success("Folder uploaded successfully");

//     await fetchFolderTree();
//     onClose();
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err?.response?.data?.error || "Upload failed!";

//     toast.error(errorMsg);
//     setMessage(`❌ ${errorMsg}`);
//   }
// };

  
//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📁 Upload Folder
//         </Typography>

//         {/* MUI Button instead of File Input */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleClick}
//           sx={{ mb: 2 }}
//         >
//           Select Folder
//         </Button>

//         {/* Hidden File Input */}
//         <input
//           type="file"
//           ref={hiddenFileInput}
//           onChange={handleUploadFolderSelect}
//           style={{ display: "none" }}
//           webkitdirectory="true"
//           directory="true"
//           multiple
//         />

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//         >
//           🚀 Upload
//         </Button>

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
//   console.log("FolderTreeSelector items:", items);  
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };
//   const getFileIcon = (fileName) => {
//     const ext = fileName.split(".").pop().toLowerCase();

//     switch (ext) {
//       case "pdf":
//         return <FaFilePdf color="#d32f2f" size={18} />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <FaFileImage color="#1976d2" size={18} />;
//       case "doc":
//       case "docx":
//         return <FaFileWord color="#1565c0" size={18} />;
//       case "xls":
//       case "xlsx":
//         return <FaFileExcel color="#2e7d32" size={18} />;
//       case "txt":
//       case "md":
//         return <FaFileAlt color="#616161" size={18} />;
//       default:
//         return <AiFillFileUnknown color="#757575" size={18} />;
//     }
//   };
//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         const isExpanded = expanded[item.path];
//         const isSelected = selectedFolder === item.path;

//         if (item.type !== "folder") return null;

//         return (
//           <React.Fragment key={item.path}>
//             {/* <ListItem
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
//             > */}
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,

//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//                 opacity: item.meta?.readOnly ? 0.6 : 1,

//                 "&:hover": {
//                   bgcolor: item.meta?.readOnly ? "transparent" : "#dbefff",
//                 },

//                 pointerEvents: item.meta?.readOnly ? "none" : "auto",
//               }}
//               onClick={() => onSelect(item.path)}
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
//               {/* {item.meta?.files?.length > 0 && (
//                 <List sx={{ pl: 4 }}>
//                   {item.meta.files.map((file) => (
//                     <ListItem key={file.name} sx={{ pl: 2 }}>
//                       <ListItemIcon>
//                         <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={`${file.name}${file.readOnly ? " (Read Only)" : ""}`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               )} */}
//             </Collapse>
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

// export default FolderUploadDrawer;


import React, { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import {useToastContext} from "../../../../context/ToastContext";
import { Button } from "../../../../components/ui/button";
import { 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight, 
  X, 
  FolderUp, 
  Upload,
  FileText
} from "lucide-react";
import { accountDocsAPI } from "../../../../services/api";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";

const FolderUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const hiddenFileInput = useRef(null);
const {showToast} = useToastContext();
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFiles([]);
      setMessage("");
      setUploading(false);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  // Staged entries are { file, relativePath }. Dropped files carry their path
  // in the directory entry rather than in webkitRelativePath (which is
  // read-only and empty for drops), so the path is tracked alongside the file
  // instead of read off it.
  const folderGroups = files.reduce((groups, item) => {
    const root = item.relativePath.split("/")[0];
    (groups[root] = groups[root] || []).push(item);
    return groups;
  }, {});

  const folderNames = Object.keys(folderGroups);

  // Add to what is already staged rather than replacing it. Re-adding the
  // same folder must not stage its files twice, hence the path check.
  const stageItems = (incoming) => {
    setFiles((prev) => {
      const seen = new Set(prev.map((i) => i.relativePath));
      return [
        ...prev,
        ...incoming.filter((i) => !seen.has(i.relativePath)),
      ];
    });
  };

  const handleUploadFolderSelect = (e) => {
    const picked = Array.from(e.target.files);
    if (picked.length === 0) return;

    stageItems(
      picked.map((file) => ({ file, relativePath: file.webkitRelativePath })),
    );

    // Let the same folder be re-picked later; without this the input keeps
    // its value and firing change again for it is not guaranteed.
    e.target.value = "";
  };

  // readEntries hands back at most 100 entries per call, so it has to be
  // drained in a loop or large folders arrive truncated.
  const readAllEntries = (reader) =>
    new Promise((resolve, reject) => {
      const out = [];
      const next = () =>
        reader.readEntries((batch) => {
          if (batch.length === 0) return resolve(out);
          out.push(...batch);
          next();
        }, reject);
      next();
    });

  const collectFiles = async (entry, prefix) => {
    if (entry.isFile) {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      return [{ file, relativePath: `${prefix}${entry.name}` }];
    }

    const entries = await readAllEntries(entry.createReader());
    const nested = await Promise.all(
      entries.map((child) => collectFiles(child, `${prefix}${entry.name}/`)),
    );
    return nested.flat();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    if (uploading) return;

    // Read every dropped item's entry up front: the DataTransfer list is
    // emptied as soon as this handler yields, so awaiting first loses it.
    const entries = Array.from(e.dataTransfer.items)
      .map((item) => item.webkitGetAsEntry?.())
      .filter(Boolean);

    const directories = entries.filter((entry) => entry.isDirectory);

    if (directories.length === 0) {
      showToast({
        title: "Drop folders here, not individual files",
        type: "warning",
      });
      return;
    }

    try {
      const collected = await Promise.all(
        directories.map((entry) => collectFiles(entry, "")),
      );
      stageItems(collected.flat());
    } catch (err) {
      console.error("Failed to read dropped folders:", err);
      showToast({
        title: "Could not read one of the dropped folders",
        type: "error",
      });
    }
  };

  const removeFolder = (name) => {
    setFiles((prev) =>
      prev.filter((i) => i.relativePath.split("/")[0] !== name),
    );
  };

  const handleUpload = async () => {
    // Guard a second click while a batch is still running.
    if (uploading) return;

    if (!files.length) {
      showToast({
        title: "Please select a folder first!",
        type: "error",
      });
      return;
    }

    if (!selectedFolder || selectedFolder.trim() === "") {
      showToast({
        title: "Please select target path first!",
        type: "error",
      });
      return;
    }

    setUploading(true);

    const destination = selectedFolder.replace(/\/+$/, "");

    // Several folders go out as one archive to /upload-multi-folder, which
    // keeps each entry's root folder. The single-folder endpoint cannot be
    // used for this: it strips the first path segment, so two roots would be
    // stripped and their contents merged into one directory.
    if (folderNames.length > 1) {
      try {
        setMessage(`Zipping ${folderNames.length} folders...`);

        const zip = new JSZip();
        files.forEach((item) => {
          zip.file(item.relativePath, item.file);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });

        const formData = new FormData();
        formData.append("folderZip", zipBlob, "folders.zip");
        formData.append("folderPath", destination);

        setMessage(`Uploading ${folderNames.length} folders...`);

        const res = await accountDocsAPI.uploadMultiFolderZip(formData);

        const uploaded = res?.data?.folders?.length ?? folderNames.length;

        showToast({
          title: `${uploaded} folders uploaded successfully`,
          type: "success",
        });
        setMessage("Uploaded successfully!");

        await fetchFolderTree();
        onClose();
      } catch (err) {
        console.error(err);
        const errorMsg = err?.response?.data?.error || "Upload failed!";
        showToast({ title: errorMsg, type: "error" });
        setMessage(`❌ ${errorMsg}`);
      } finally {
        setUploading(false);
      }
      return;
    }

    // A single folder keeps using the original endpoint, unchanged.
    const failed = [];

    try {
      for (let i = 0; i < folderNames.length; i++) {
        const name = folderNames[i];

        setMessage(
          `Zipping ${name} (${i + 1} of ${folderNames.length})...`,
        );

        const targetFolderPath = `${selectedFolder}/${name}`.replace(
          /\/+/g,
          "/",
        );

        const zip = new JSZip();
        folderGroups[name].forEach((item) => {
          zip.file(item.relativePath, item.file);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });

        const formData = new FormData();
        formData.append("folderZip", zipBlob, `${name}.zip`);
        formData.append("folderName", name);
        formData.append("folderPath", targetFolderPath);

        setMessage(`Uploading ${name} (${i + 1} of ${folderNames.length})...`);

        try {
          await accountDocsAPI.uploadFolderZip(formData);
        } catch (err) {
          // Keep going: one bad folder should not abandon the rest of the
          // batch, and the user is told exactly which ones did not make it.
          console.error(`Upload failed for ${name}:`, err);
          failed.push(name);
        }
      }

      const uploaded = folderNames.length - failed.length;

      if (failed.length > 0) {
        showToast({
          title: `${uploaded} of ${folderNames.length} folder(s) uploaded. Failed: ${failed.join(", ")}`,
          type: uploaded > 0 ? "warning" : "error",
        });
        setMessage(`❌ Failed: ${failed.join(", ")}`);
      } else {
        showToast({
          title: `${uploaded} folder${uploaded === 1 ? "" : "s"} uploaded successfully`,
          type: "success",
        });
        setMessage("Uploaded successfully!");
      }

      await fetchFolderTree();

      // Only close when everything landed - otherwise leave the drawer open
      // with the folders that failed still staged, so they can be retried.
      if (failed.length === 0) {
        onClose();
      } else {
        setFiles((prev) =>
          prev.filter((i) => failed.includes(i.relativePath.split("/")[0])),
        );
      }
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      </div>

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[450px] flex-col bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <FolderUp className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Upload Folder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Folder picker - drop several folders at once, or browse for one
              at a time. A file dialog can only ever return a single folder,
              so dropping is the only way to select several in one action. */}
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (!uploading) setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted/30"
              }`}
            >
              <Upload className="h-5 w-5 text-muted-foreground" />

              <p className="text-sm font-medium text-foreground">
                Drag folders here
              </p>

              <p className="text-xs text-muted-foreground">
                Drop as many as you like at once
              </p>

              <button
                onClick={handleClick}
                disabled={uploading}
                className="mt-1 text-xs font-medium text-primary underline-offset-2 hover:underline disabled:opacity-50"
              >
                {folderNames.length > 0
                  ? "or add another folder"
                  : "or browse for a folder"}
              </button>
            </div>

            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleUploadFolderSelect}
              className="hidden"
              webkitdirectory="true"
              directory="true"
              multiple
            />
          </div>

          {/* Staged folders */}
          {folderNames.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-primary">
                {folderNames.length} folder
                {folderNames.length === 1 ? "" : "s"} to upload
              </p>

              {folderNames.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {folderGroups[name].length} file(s)
                    </p>
                  </div>

                  <button
                    onClick={() => removeFolder(name)}
                    disabled={uploading}
                    aria-label={`Remove ${name}`}
                    className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Selected destination */}
          {selectedFolder && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
              <p className="text-xs font-medium text-primary mb-0.5">Uploading to</p>
              <p className="text-sm text-foreground break-all">{selectedFolder}</p>
            </div>
          )}

          {/* Message */}
          {message && (
            <p className="text-sm font-medium text-foreground">{message}</p>
          )}

          {/* Folder tree */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Select Parent Folder from Tree</p>
            <div className="rounded-lg border border-border bg-background overflow-auto max-h-80">
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
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || folderNames.length === 0}
            className="flex-1 disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : folderNames.length > 1
                ? `Upload ${folderNames.length} Folders`
                : "Upload"}
          </Button>
        </div>
      </div>
    </>
  );
};

// Helper function for file icons (for potential future use)
const getFileIcon = (fileName) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return <FaFilePdf color="#d32f2f" size={18} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <FaFileImage color="#1976d2" size={18} />;
    case "doc":
    case "docx":
      return <FaFileWord color="#1565c0" size={18} />;
    case "xls":
    case "xlsx":
      return <FaFileExcel color="#2e7d32" size={18} />;
    case "txt":
    case "md":
      return <FaFileAlt color="#616161" size={18} />;
    default:
      return <AiFillFileUnknown color="#757575" size={18} />;
  }
};

// Recursive folder tree selector
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className="py-1">
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isExpanded = expanded[item.path];
        const isSelected = selectedFolder === item.path;
        const hasChildren = item.children?.length > 0;
        const isReadOnly = item.meta?.readOnly;

        return (
          <li key={item.path}>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md mx-1 mb-0.5 cursor-pointer transition-colors text-sm
                ${
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                }
                ${
                  isReadOnly
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }
              `}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              onClick={() => !isReadOnly && onSelect(item.path)}
            >
              {/* Expand/Collapse button */}
              <button
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
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

              <span className="truncate flex-1">{item.name}</span>
            </div>

            {/* Recursive children */}
            {hasChildren && isExpanded && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FolderUploadDrawer;