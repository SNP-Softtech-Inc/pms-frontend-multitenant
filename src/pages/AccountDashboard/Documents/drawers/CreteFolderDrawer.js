

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
// import { accountDocsAPI } from "../../../../services/api";
// const CreateFolderDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,accountId
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
//   if (!folderName.trim()) {
//     setMessage("⚠️ Folder name is required!");
//     return;
//   }

//   try {
//     const payload = {
//       name: folderName,
//       parentPath: selectedFolder || "",
//       accountId: accountId,
//     };

//     const res = await accountDocsAPI.createFolder(payload);

//     const createdName = res?.data?.metaData?.name;

//     setMessage(`✅ Folder created: ${createdName}`);
//     toast.success(`Folder created: ${createdName}`);

//     setFolderName("");

//     // refresh tree
//     await fetchFolderTree();

//     onClose();
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err?.response?.data?.error || "Server Error while creating folder";

//     toast.error(errorMsg);

//     setMessage(`❌ Error: ${errorMsg}`);
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
           
//              <ListItem
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


// ============================
// 📁 Drawer: Create Folder (ShadCN version)
// ============================

import React, { useState, useEffect } from "react";
import { X, Folder, FolderOpen, ChevronDown, ChevronRight, FolderPlus } from "lucide-react";
import { toast } from "react-toastify";
import { accountDocsAPI } from "../../../../services/api";
import { Button } from "../../../../components/ui/button"; // Adjust path as needed

const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  accountId
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder(""); // reset selection when drawer closes
      setFolderName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setMessage("⚠️ Folder name is required!");
      return;
    }

    try {
      const payload = {
        name: folderName,
        parentPath: selectedFolder || "",
        accountId: accountId,
      };

      const res = await accountDocsAPI.createFolder(payload);

      const createdName = res?.data?.metaData?.name;

      setMessage(`✅ Folder created: ${createdName}`);
      toast.success(`Folder created: ${createdName}`);

      setFolderName("");

      // refresh tree
      await fetchFolderTree();

      onClose();
    } catch (err) {
      console.error(err);

      const errorMsg =
        err?.response?.data?.error || "Server Error while creating folder";

      toast.error(errorMsg);

      setMessage(`❌ Error: ${errorMsg}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div 
          className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        {/* Drawer panel */}
        <div className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-background shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <FolderPlus className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Create New Folder
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
            {/* Folder name input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Folder Name
              </label>
              <input
                type="text"
                placeholder="Enter new folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              />
            </div>

            {/* Selected path display */}
            {selectedFolder && (
              <div className="rounded-lg bg-muted/50 border border-border px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Parent folder</p>
                <p className="text-sm text-foreground break-all">{selectedFolder}</p>
              </div>
            )}

            {/* Message */}
            {message && (
              <p className="text-sm font-medium text-foreground">{message}</p>
            )}

            {/* Folder tree */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Select Parent Folder from Tree
              </p>
              <div className="rounded-lg border border-border bg-background overflow-auto max-h-80">
                <FolderTreeSelector
                  items={folderTree}
                  onSelect={handleFolderSelect}
                  selectedFolder={selectedFolder}
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
            <Button
              onClick={onClose}
              variant="outline"
              className="h-9 px-4 text-sm font-medium"
            >
              Close
            </Button>
            <Button
              onClick={handleCreateFolder}
              className="h-9 px-4 text-sm font-medium"
            >
              Create Folder
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className="py-1">
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const hasChildren = item.children?.length > 0;
        const isReadOnly = item.meta?.readOnly;

        return (
          <li key={item.path}>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md mx-1 mb-0.5 cursor-pointer transition-colors text-sm
                ${isSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}
                ${isReadOnly ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
              `}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              onClick={() => !isReadOnly && onSelect(item.path)}
            >
              {/* Expand toggle */}
              <button
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleExpand(item.path); 
                }}
              >
                {hasChildren
                  ? isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5" />
                    : <ChevronRight className="h-3.5 w-3.5" />
                  : <span className="w-3.5 inline-block" />}
              </button>

              {/* Folder icon */}
              {isExpanded
                ? <FolderOpen className="h-4 w-4 text-primary shrink-0" />
                : <Folder className="h-4 w-4 text-primary shrink-0" />}

              <span className="truncate">{item.name}</span>
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

export default CreateFolderDrawer;