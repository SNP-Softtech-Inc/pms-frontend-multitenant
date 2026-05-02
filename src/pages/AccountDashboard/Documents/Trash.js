// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   Menu,
//   MenuItem,
//   TableCell,
//   TableHead,
//   TableRow,
//   TableBody,
//   Table,
//   TableContainer,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DeleteIcon from "@mui/icons-material/Delete";
// import RestoreIcon from "@mui/icons-material/Restore";
// import { useParams } from "react-router-dom";
// import {
//   Folder as FolderClosedIcon,
//   FolderOpen as FolderOpenIcon,
// } from "lucide-react";
// import {accountDocsAPI} from "../../../services/api";
// import DownloadIcon from "@mui/icons-material/Download";
// import { toast } from "react-toastify";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import { AiFillFileUnknown } from "react-icons/ai";
// const Trash = () => {
//   const { accountId } = useParams();
//   const FolderTreeView = ({ accountId }) => {
//     const [expandedFolders, setExpandedFolders] = useState({});
//     const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//     const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
//     const [error, setError] = useState(null);
//     const [folderTree, setFolderTree] = useState([]);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [deleteConfirmText, setDeleteConfirmText] = useState("");
//     const [itemToDelete, setItemToDelete] = useState(null);

//     useEffect(() => {
//       fetchFolderTree(accountId);
//     }, [accountId]);

//     // API call to fetch folder tree for a given template ID
//   const fetchFolderTree = async (accountId) => {
//   try {
//     const res = await accountDocsAPI.listTrashedItems();

//     if (res.status === 200) {
//       // adjust based on your backend response
//       setFolderTree(res.data.contents?.Admin || []);
//     } else {
//       setError("Failed to fetch folder tree");
//     }
//   } catch (err) {
//     console.error(err);
//     setError("Error fetching folder tree");
//   }
// };
//     const toggleFolder = (path, isReadOnly) => {
//       // if (isReadOnly) return;
//       setExpandedFolders((prev) => ({
//         ...prev,
//         [path]: !prev[path],
//       }));
//     };

//     const handleMenuOpen = (event, folder) => {
//       event.stopPropagation();
//       setMenuAnchorEl(event.currentTarget);
//       setSelectedFolderForMenu(folder);
//     };

//     const handleMenuClose = () => {
//       setMenuAnchorEl(null);
//     };

//     // Update getAllChildrenPaths to work with item.path
//     const getAllChildrenPaths = (item) => {
//       const paths = [item.path];
//       if (item.children && item.children.length > 0) {
//         item.children.forEach((child) => {
//           paths.push(...getAllChildrenPaths(child));
//         });
//       }
//       return paths;
//     };

//    const restoreItem = async (item) => {
//   try {
//     const res = await accountDocsAPI.restoreItem({
//       targetPath: item.path,
//     });

//     const successMsg =
//       res?.data?.message || "Item restored successfully";

//     toast.success(successMsg);
//     await fetchFolderTree(accountId);
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err?.response?.data?.message || "Restore failed";

//     toast.error(errorMsg);
//   }
// };
//     const handleDownload = async (item) => {
//   try {
//     const res = await accountDocsAPI.downloadItems({
//       paths: item.path, // backend supports string or array
//     });

//     const blob = new Blob([res.data]);
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = item.name || "download";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     console.error("Download error:", err);

//     const errorMsg =
//       err?.response?.data?.error || "Download failed";

//     toast.error(errorMsg);
//   }
// };
//     // 🗑️ Delete File or Folder (Universal)
//     const deleteItem = async (item) => {
//   if (!item?.path) {
//     toast.error("Invalid path");
//     return;
//   }

//   try {
//     const res = await accountDocsAPI.deleteItem({
//       targetPath: item.path,
//     });

//     const successMsg =
//       res?.data?.message || "Deleted successfully";

//     toast.success(successMsg);

//     await fetchFolderTree(accountId);
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err?.response?.data?.message || "Delete failed";

//     toast.error(errorMsg);
//   }
// };

//     const getFileIcon = (fileName) => {
//       const ext = fileName.split(".").pop().toLowerCase();

//       switch (ext) {
//         case "pdf":
//           return <FaFilePdf color="#d32f2f" size={18} />;
//         case "jpg":
//         case "jpeg":
//         case "png":
//         case "gif":
//           return <FaFileImage color="#1976d2" size={18} />;
//         case "doc":
//         case "docx":
//           return <FaFileWord color="#1565c0" size={18} />;
//         case "xls":
//         case "xlsx":
//           return <FaFileExcel color="#2e7d32" size={18} />;
//         case "txt":
//         case "md":
//           return <FaFileAlt color="#616161" size={18} />;
//         default:
//           return <AiFillFileUnknown color="#757575" size={18} />;
//       }
//     };

//     const formatUploadedAt = (dateValue) => {
//       if (!dateValue) return "";

//       // If already in "DEC-19 2025" format
//       if (
//         typeof dateValue === "string" &&
//         /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
//       ) {
//         return dateValue;
//       }

//       const date = new Date(dateValue);
//       if (isNaN(date)) return dateValue;

//       return date
//         .toLocaleDateString("en-US", {
//           month: "short",
//           day: "2-digit",
//           year: "numeric",
//         })
//         .toUpperCase()
//         .replace(",", "") // remove comma
//         .replace(" ", "-"); // replace first space with dash
//     };
  
// // const TrashedInfo = ({ meta }) => {
// //   if (!meta?.trash?.trashedAt) return null;

// //   const trashedAt = new Date(meta.trash.trashedAt);
// //   const now = new Date();

// //   // Calculate remaining time until 60 days
// //   const diffTime = trashedAt.getTime() + 60 * 24 * 60 * 60 * 1000 - now.getTime(); // 60 days in ms
// //   const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// //   // Format trashed date
// //   const formattedDate = trashedAt
// //     .toLocaleDateString("en-US", {
// //       month: "short",
// //       day: "2-digit",
// //       year: "numeric",
// //     })
// //     .toUpperCase()
// //     .replace(",", ""); // e.g., DEC-29 2025

// //   return (
// //     <Typography variant="caption" sx={{ fontWeight: "bold" }}>
// //       {formattedDate} ({remainingDays > 0 ? `${remainingDays} day${remainingDays > 1 ? "s" : ""} left` : "Deleting soon"})
// //     </Typography>
// //   );
// // };

// const TrashedInfo = ({ meta }) => {
//   if (!meta?.trash?.trashedAt) return null;

//   const trashedAt = new Date(meta.trash.trashedAt);
//   const now = new Date();

//   const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

//   // Remaining time
//   const diffTime = trashedAt.getTime() + TWO_HOURS_MS - now.getTime();

//   if (diffTime <= 0) {
//     return (
//       <Typography variant="caption" sx={{ fontWeight: "bold", color: "error.main" }}>
//         Deleting soon
//       </Typography>
//     );
//   }

//   const remainingMinutes = Math.ceil(diffTime / (1000 * 60));
//   const hours = Math.floor(remainingMinutes / 60);
//   const minutes = remainingMinutes % 60;

//   // Format trashed date
//   const formattedDate = trashedAt
//     .toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     })
//     .toUpperCase()
//     .replace(",", "");

//   return (
//     <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//       {formattedDate} (
//       {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}
//       {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`} left)
//     </Typography>
//   );
// };

//     const findNewSystemTag = (item) => {
//       // console.log("Finding 'New' tag in item:", item);
//       // Check current item
//       const newTag = item.meta?.tags?.find(
//         (tag) => tag.isSystemTag && tag.tagName === "New"
//       );

//       if (newTag) return newTag;

//       // Check children recursively
//       if (item.children && item.children.length > 0) {
//         for (const child of item.children) {
//           const childTag = findNewSystemTag(child);
//           if (childTag) return childTag;
//         }
//       }

//       return null;
//     };

//     const renderTrashedRows = (items, level = 0, parentPath = "") => {
//       return items.map((item) => {
//         const fullPath = item.path;
//         const meta = item.meta || {};
//         const isFolder = item.type === "folder";

//         const showMenu =
//           level === 0 && (item.type === "folder" || item.type === "file");

//         const getAllChildrenPaths = (item) => {
//           const paths = [item.path];
//           if (item.children && item.children.length > 0) {
//             item.children.forEach((child) => {
//               paths.push(...getAllChildrenPaths(child));
//             });
//           }
//           return paths;
//         };

//         return (
//           <React.Fragment key={fullPath}>
//             <TableRow
//               sx={{
//                 backgroundColor: level % 2 === 0 ? "#fafafa" : "white",
//                 "&:hover": { backgroundColor: "#f5f5f5" },
//               }}
//             >
//               <TableCell sx={{ paddingLeft: level * 4 + 2 }}>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   {isFolder ? (
//                     <>
//                       <IconButton
//                         size="small"
//                         onClick={() => toggleFolder(fullPath)}
//                         sx={{ mr: 0.5 }}
//                       >
//                         {expandedFolders[fullPath] ? (
//                           <FolderOpenIcon />
//                         ) : (
//                           <FolderClosedIcon />
//                         )}
//                       </IconButton>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           ml: 0.5,
//                           fontWeight: "medium",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => toggleFolder(fullPath)}
//                       >
//                         {item.name} (Trashed)
//                       </Typography>
//                     </>
//                   ) : (
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
//                       <Typography
//                         variant="body2"
//                         sx={{ cursor: "not-allowed" }}
//                       >
//                         {item.name} (Trashed)
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </TableCell>

//               <TableCell>
//                 {level === 0 && <TrashedInfo meta={meta} />}
//               </TableCell>

//               <TableCell align="right">
//                 {showMenu && (
//                   <IconButton
//                     size="small"
//                     onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
//                   >
//                     <MoreVertIcon />
//                   </IconButton>
//                 )}
//               </TableCell>
//             </TableRow>

//             {isFolder &&
//               expandedFolders[fullPath] &&
//               item.children &&
//               item.children.length > 0 &&
//               renderTrashedRows(item.children, level + 1, fullPath)}
//           </React.Fragment>
//         );
//       });
//     };

//     return (
//       <Box sx={{ margin: "auto", p: 3 }}>
//         <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             📜 Folder Explorer
//           </Typography>
// <Box
//   sx={{
//     mb: 2,
//     p: 1.5,
//     borderRadius: 1,
//     backgroundColor: "#fff8e1",
//     border: "1px solid #ffe082",
//   }}
// >
//   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//     ⚠️ Items in Trash will be <strong>permanently deleted after 60 days</strong>.
//     <br />
//     Please restore important files or folders before this period.
//   </Typography>
// </Box>
//           {folderTree && folderTree.length > 0 ? (
//             <>
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>

//                       <TableCell>Trashed</TableCell>

//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>{renderTrashedRows(folderTree)}</TableBody>
//                 </Table>
//               </TableContainer>
//             </>
//           ) : (
//             <Typography sx={{ p: 2, textAlign: "center" }}>
//               🗑️ Trash is empty.
//             </Typography>
//           )}
//         </Paper>
//         <Menu
//           anchorEl={menuAnchorEl}
//           open={Boolean(menuAnchorEl)}
//           onClose={handleMenuClose}
//         >
//           {selectedFolderForMenu && (
//             <>
//               <MenuItem
//                 onClick={() => {
//                   restoreItem(selectedFolderForMenu);
//                   handleMenuClose();
//                 }}
//               >
//                 <RestoreIcon sx={{ mr: 1 }} />
//                 Restore
//               </MenuItem>

//               {/* <MenuItem
//                 onClick={() => {
//                   deleteItem(selectedFolderForMenu);
//                   handleMenuClose();
//                 }}
//                 sx={{ color: "error.main" }}
//               > */}
//               <MenuItem
//                 onClick={() => {
//                   setItemToDelete(selectedFolderForMenu);
//                   setDeleteConfirmText("");
//                   setDeleteDialogOpen(true);
//                   handleMenuClose();
//                 }}
//                 sx={{ color: "error.main" }}
//               >
//                 <DeleteIcon sx={{ mr: 1 }} />
//                 Delete Permanently
//               </MenuItem>
//               <MenuItem
//                 onClick={() => {
//                   handleDownload(selectedFolderForMenu);
//                   handleMenuClose();
//                 }}
//               >
//                 <DownloadIcon sx={{ mr: 1 }} />
//                 Download
//               </MenuItem>
//             </>
//           )}
//         </Menu>

//         <Dialog
//           open={deleteDialogOpen}
//           onClose={() => setDeleteDialogOpen(false)}
//           maxWidth="xs"
//           fullWidth
//         >
//           <DialogTitle sx={{ color: "error.main" }}>
//             Delete Permanently
//           </DialogTitle>

//           <DialogContent>
//             <Typography variant="body2" sx={{ mb: 2 }}>
//               This action <strong>cannot be undone</strong>.
//               <br />
//               Type <strong>DELETE</strong> to confirm permanent deletion of:
//             </Typography>

//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               {itemToDelete?.name}
//             </Typography>

//             <TextField
//               autoFocus
//               fullWidth
//               placeholder="Type DELETE"
//               value={deleteConfirmText}
//               onChange={(e) => setDeleteConfirmText(e.target.value)}
//               error={
//                 deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE"
//               }
//               helperText={
//                 deleteConfirmText && deleteConfirmText !== "DELETE"
//                   ? "You must type DELETE exactly"
//                   : " "
//               }
//             />
//           </DialogContent>

//           <DialogActions>
//             <Button
//               onClick={() => setDeleteDialogOpen(false)}
//               variant="outlined"
//             >
//               Cancel
//             </Button>

//             <Button
//               variant="contained"
//               color="error"
//               disabled={deleteConfirmText !== "DELETE"}
//               onClick={async () => {
//                 await deleteItem(itemToDelete);
//                 setDeleteDialogOpen(false);
//                 setItemToDelete(null);
//               }}
//             >
//               Delete Permanently
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     );
//   };
//   return (
//     <Box>
//       <FolderTreeView accountId={accountId} />
//     </Box>
//   );
// };

// export default Trash;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { accountDocsAPI } from "../../../services/api";
import { toast } from "react-toastify";

import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";

import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";

import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "../../../components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";

import { Input } from "../../../components/ui/input";

import { MoreVertical, Trash2, RotateCcw, Download } from "lucide-react";

const Trash = () => {
  const { accountId } = useParams();

  const FolderTreeView = ({ accountId }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [error, setError] = useState(null);
    const [folderTree, setFolderTree] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
      fetchFolderTree(accountId);
    }, [accountId]);

    const fetchFolderTree = async () => {
      try {
        const res = await accountDocsAPI.listTrashedItems();
        if (res.status === 200) {
          setFolderTree(res.data.contents?.Admin || []);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching folder tree");
      }
    };

    const toggleFolder = (path) => {
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const restoreItem = async (item) => {
      try {
        const res = await accountDocsAPI.restoreItem({
          targetPath: item.path,
        });
        toast.success(res?.data?.message || "Item restored successfully");
        await fetchFolderTree(accountId);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Restore failed");
      }
    };

    const handleDownload = async (item) => {
      try {
        const res = await accountDocsAPI.downloadItems({
          paths: item.path,
        });

        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = item.name || "download";
        a.click();

        window.URL.revokeObjectURL(url);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Download failed");
      }
    };

    const deleteItem = async (item) => {
      try {
        const res = await accountDocsAPI.deleteItem({
          targetPath: item.path,
        });
        toast.success(res?.data?.message || "Deleted successfully");
        await fetchFolderTree(accountId);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Delete failed");
      }
    };

    const getFileIcon = (fileName) => {
      const ext = fileName.split(".").pop().toLowerCase();

      switch (ext) {
        case "pdf":
          return <FaFilePdf className="text-red-600" size={18} />;
        case "jpg":
        case "jpeg":
        case "png":
          return <FaFileImage className="text-blue-600" size={18} />;
        case "doc":
        case "docx":
          return <FaFileWord className="text-blue-800" size={18} />;
        case "xls":
        case "xlsx":
          return <FaFileExcel className="text-green-700" size={18} />;
        case "txt":
          return <FaFileAlt className="text-gray-500" size={18} />;
        default:
          return <AiFillFileUnknown className="text-gray-400" size={18} />;
      }
    };

    const TrashedInfo = ({ meta }) => {
      if (!meta?.trash?.trashedAt) return null;

      const trashedAt = new Date(meta.trash.trashedAt);
      const now = new Date();

      const diffTime =
        trashedAt.getTime() + 2 * 60 * 60 * 1000 - now.getTime();

      if (diffTime <= 0) {
        return <span className="text-red-500 text-xs">Deleting soon</span>;
      }

      const mins = Math.ceil(diffTime / 60000);
      const h = Math.floor(mins / 60);
      const m = mins % 60;

      return (
        <span className="text-xs font-medium">
          {h > 0 && `${h} hr `} {m} min left
        </span>
      );
    };

    const renderRows = (items, level = 0) =>
      items.map((item) => {
        const isFolder = item.type === "folder";

        return (
          <React.Fragment key={item.path}>
            <TableRow className="hover:bg-muted/50">
              <TableCell className="pl-4">
                <div className="flex items-center gap-2">
                  {isFolder ? (
                    <>
                      <button onClick={() => toggleFolder(item.path)}>
                        {expandedFolders[item.path] ? (
                          <FolderOpenIcon size={16} />
                        ) : (
                          <FolderClosedIcon size={16} />
                        )}
                      </button>
                      <span
                        className="cursor-pointer font-medium"
                        onClick={() => toggleFolder(item.path)}
                      >
                        {item.name} (Trashed)
                      </span>
                    </>
                  ) : (
                    <>
                      {getFileIcon(item.name)}
                      <span>{item.name} (Trashed)</span>
                    </>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <TrashedInfo meta={item.meta} />
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => restoreItem(item)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restore
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setItemToDelete(item);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Permanently
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDownload(item)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            {isFolder &&
              expandedFolders[item.path] &&
              item.children &&
              renderRows(item.children, level + 1)}
          </React.Fragment>
        );
      });

    return (
      <div className="p-6">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">📜 Folder Explorer</h2>

          <div className="mb-3 rounded-md border bg-yellow-50 p-3 text-sm">
            ⚠️ Items will be permanently deleted after 60 days
          </div>

          {folderTree.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Trashed</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>{renderRows(folderTree)}</TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              🗑️ Trash is empty
            </div>
          )}
        </div>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">
                Delete Permanently
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm">
              Type <b>DELETE</b> to confirm
            </p>

            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={async () => {
                  await deleteItem(itemToDelete);
                  setDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return <FolderTreeView accountId={accountId} />;
};

export default Trash;