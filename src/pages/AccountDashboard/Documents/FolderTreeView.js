// // FolderTreeView.tsx (Separate Component File)
// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   Menu,
//   MenuItem,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
//   Chip,
//   Tooltip,
//   Checkbox,
//   TableCell,
//   TableHead,
//   TableRow,
//   TableBody,
//   Table,
//   TableContainer,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import customCss from "./docuseal-dark-theme.css";
// import { DocusealBuilder } from "@docuseal/react";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
// import FileUploadDrawer from "./drawers/FileUploadDrawer";
// import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
// import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
// import RenameDrawer from "./drawers/RenameDrawer";
// import MoveDrawer from "./drawers/MoveDrawer";
// import {
//   Folder as FolderIcon,
//   InsertDriveFile as FileIcon,
//   Lock as LockIcon,
//   LockOpen as LockOpenIcon,
// } from "@mui/icons-material";
// import axios from "axios";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
// import { Eye, PenTool, Stamp, Lock } from "lucide-react";
// import {
//   Folder as FolderClosedIcon,
//   FolderOpen as FolderOpenIcon,
// } from "lucide-react";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import CancelIcon from "@mui/icons-material/Cancel";
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
// import * as XLSX from "xlsx";

// import {
//   accountDocsAPI,
//   folderManagementAPI,
//   accountsAPI,
//   docAPI,
//   invoiceAPI,
// } from "../../../services/api";

// export const FolderTreeView = ({ accountId }) => {
//   const [clientEmail, setClientEmail] = useState("");
//   const [expandedFolders, setExpandedFolders] = useState({});
//   const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//   const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
//   const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
//   const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
//   const [renameDrawer, SetRenameDrawer] = useState(null);
//   const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
//   const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
//   const [description, setDescription] = useState("");
//   const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
//   const [folderTree, setFolderTree] = useState([]);
//   const [selectedItem, setSelectedItem] = useState("");
//   const [token, setToken] = useState("");
//   const [showBuilderFor, setShowBuilderFor] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedItems, setSelectedItems] = useState(new Set());
//   const [selectAll, setSelectAll] = useState(false);
//   const [bulkMoveDrawerOpen, setBulkMoveDrawerOpen] = useState(false);
//   const [bulkLockDialogOpen, setBulkLockDialogOpen] = useState(false);
//   const [bulkOperationLoading, setBulkOperationLoading] = useState(false);
//   const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
//   const [selectedFileUrl, setSelectedFileUrl] = useState("");
//   const [selectedFileName, setSelectedFileName] = useState("");
//   const [openFileViewer, setOpenFileViewer] = useState(false);
//   const [openExcelDialog, setOpenExcelDialog] = useState(false);
//   const [openWordDialog, setOpenWordDialog] = useState(false);
//   const [openTextDialog, setOpenTextDialog] = useState(false);
//   const [textContent, setTextContent] = useState("");
//   const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [invoiceList, setInvoiceList] = useState([]);
//   const [selectedInvoices, setSelectedInvoices] = useState([]);
//   const [emails, setEmails] = useState([]);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState("");

//   const SIGN_STATUSES = [
//     "sendForSignature",
//     "pendingSignature",
//     "signatureCompleted",
//   ];

//   const statusTextMap = {
//     sendForSignature: "Send for Sign",
//     pendingSignature: "Waiting for Signature",
//     signatureCompleted: "Signature Received",
//   };

//   const INVOICE_LOCK_STATUSES = ["pendingpayment", "paymentcompleted"];

//   const invoiceStatusTextMap = {
//     pendingpayment: "Pending Payment",
//     paymentcompleted: "Payment Completed",
//   };

//   const APPROVAL_STATUSES = [
//     "sendForApproval",
//     "pendingApproval",
//     "canceledApproval",
//     "approvalCompleted",
//   ];

//   const approvalStatusTextMap = {
//     sendForApproval: "Send for Approval",
//     pendingApproval: "Waiting for Approval",
//     canceledApproval: "Canceled Approval",
//     approvalCompleted: "Approval Completed",
//   };

//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;

//   // Fetch account details - Using accountsAPI
//   const fetchAccountDetails = async () => {
//     try {
//       const res = await accountsAPI.getAccountById(accountId);
//       console.log("accounts details", res.data);
//       const email = res.data?.contacts?.[0]?.contact?.email;
//       setClientEmail(email);
//       console.log("Client Email:", email);
//     } catch (err) {
//       console.error("Error fetching account details:", err);
//     }
//   };

//   // Fetch folder tree - Using accountDocsAPI
//   const fetchFolderTree = async () => {
//     try {
//       const res = await accountDocsAPI.listFoldersAndFiles(accountId);
//       console.log("Folder tree data:", res?.data?.contents);
//       setFolderTree(res?.data?.contents || []);
//     } catch (err) {
//       console.error(err);
//       console.log("error list", err);
//       setError("Error fetching folder tree");
//     }
//   };

//   // Fetch emails - Using accountsAPI
//   const fetchEmails = async () => {
//     try {
//       const res = await accountsAPI.getAccountContactEmails(accountId);
//       setEmails(res.data.emails);
//       console.log("Fetched emails:", res.data.emails);
//     } catch (err) {
//       console.error("Error fetching emails:", err);
//     }
//   };

//   // Fetch invoices - Using API call (if you have an invoice API, use that)
//   const fetchInvoices = async () => {
//     try {
//       const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);

//       const invoices = res.data?.invoice || [];

//       setInvoiceList(invoices);
//     } catch (err) {
//       console.error("Error fetching invoices", err);
//     }
//   };

//   useEffect(() => {
//     if (accountId) {
//       fetchAccountDetails();
//       fetchFolderTree();
//       fetchEmails();
//     }
//   }, [accountId]);

//   useEffect(() => {
//     if (invoiceDialogOpen) fetchInvoices();
//   }, [invoiceDialogOpen]);

//   // Helper functions
//   const getAllChildrenPaths = (item) => {
//     const paths = [item.path];
//     if (item.children && item.children.length > 0) {
//       item.children.forEach((child) => {
//         paths.push(...getAllChildrenPaths(child));
//       });
//     }
//     return paths;
//   };

//   const handleSelectItem = (path) => {
//     setSelectedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(path)) {
//         newSet.delete(path);
//       } else {
//         newSet.add(path);
//       }
//       return newSet;
//     });
//   };

//   const handleFolderSelect = (item) => {
//     const allChildPaths = getAllChildrenPaths(item);
//     setSelectedItems((prev) => {
//       const newSet = new Set(prev);
//       const allSelected = allChildPaths.every((path) => newSet.has(path));
//       if (allSelected) {
//         allChildPaths.forEach((path) => newSet.delete(path));
//       } else {
//         allChildPaths.forEach((path) => newSet.add(path));
//       }
//       return newSet;
//     });
//   };

//   const isFolderPartiallySelected = (item) => {
//     const allChildPaths = getAllChildrenPaths(item);
//     const selectedCount = allChildPaths.filter((path) =>
//       selectedItems.has(path),
//     ).length;
//     return selectedCount > 0 && selectedCount < allChildPaths.length;
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedItems(new Set());
//     } else {
//       const allPaths = new Set();
//       const collectPaths = (items) => {
//         items.forEach((item) => {
//           allPaths.add(item.path);
//           if (item.children && item.children.length > 0) {
//             collectPaths(item.children);
//           }
//         });
//       };
//       collectPaths(folderTree);
//       setSelectedItems(allPaths);
//     }
//     setSelectAll(!selectAll);
//   };

//   const toggleFolder = (path, isReadOnly) => {
//     setExpandedFolders((prev) => ({
//       ...prev,
//       [path]: !prev[path],
//     }));
//   };

//   const handleMenuOpen = (event, folder) => {
//     event.stopPropagation();
//     setMenuAnchorEl(event.currentTarget);
//     setSelectedFolderForMenu(folder);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchorEl(null);
//   };

//   // Update status - Using accountDocsAPI
//   const updateStatus = async (
//     item,
//     statusType,
//     newValue,
//     approvalId = null,
//     esignRequestId = null,
//   ) => {
//     try {
//       if (!item?.path) return alert("Invalid item selected");

//       const body = {
//         targetPath: item.path,
//         status: {
//           [statusType]: newValue,
//           ...(approvalId && { approvalId }),
//           ...(esignRequestId && { esignRequestId }),
//         },
//       };

//       const res = await accountDocsAPI.updateStatus(body);

//       if (res.status === 200 || res.status === 201) {
//         toast.success(res.data.message || "Status updated successfully");
//         fetchFolderTree();
//       } else {
//         toast.error(res.data.error || "Failed to update status");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       toast.error("Error updating status");
//     }
//   };

//   // Toggle read-only - Using accountDocsAPI
//   const toggleReadOnly = async (item) => {
//     try {
//       const newStatus = !item.meta.readOnly;

//       const body =
//         item.type === "folder"
//           ? { folderPath: item.path, readOnly: newStatus }
//           : { filePath: item.path, readOnly: newStatus };

//       const res =
//         item.type === "folder"
//           ? await accountDocsAPI.setFolderReadOnly(body)
//           : await accountDocsAPI.setFileReadOnly(body);

//       if (res.status === 200 || res.status === 201) {
//         fetchFolderTree();
//         if (item.type === "folder" && newStatus) {
//           setExpandedFolders((prev) => {
//             const updated = { ...prev };
//             delete updated[item.path];
//             return updated;
//           });
//         }
//         handleMenuClose();
//         toast.success(res.data.message || "Updated successfully");
//       } else {
//         toast.error("Error: " + (res.data.error || "Failed to update"));
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update read-only status");
//     }
//   };

//   // Trash item - Using accountDocsAPI
//   const trashItem = async (item) => {
//     if (!item?.path) return alert("Invalid path");
//     const confirmTrash = window.confirm(
//       `Are you sure you want to move "${item.name}" to Trash?`,
//     );
//     if (!confirmTrash) return;

//     try {
//       const response = await accountDocsAPI.trashItem({
//         targetPath: item.path,
//         trashedBy: "Admin",
//       });

//       if (response.data?.success) {
//         toast.success(response.data.message || "Moved to trash");
//         setTimeout(() => {
//           fetchFolderTree();
//         }, 500);
//       } else {
//         toast.error(response.data?.message || "Failed to move to trash");
//       }
//     } catch (err) {
//       console.error("Error trashing item:", err);
//       toast.error("Error moving item to trash");
//     }
//     handleMenuClose();
//   };

//   // Delete item - Using accountDocsAPI
//   const deleteItem = async (item) => {
//     if (!item?.path) return alert("Invalid path");
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete "${item.name}"? This cannot be undone!`,
//     );
//     if (!confirmDelete) return;

//     try {
//       const response = await accountDocsAPI.deleteItem({
//         targetPath: item.path,
//       });

//       if (response.data?.success) {
//         toast.success(response.data.message);
//         setTimeout(() => {
//           fetchFolderTree();
//         }, 800);
//       } else {
//         toast.error(response.data?.message || "Failed to delete");
//       }
//     } catch (err) {
//       console.error("Error deleting item:", err);
//       toast.error("Error deleting file or folder");
//     }
//     handleMenuClose();
//   };

//   // Bulk trash - Using accountDocsAPI
//   const handleBulkTrash = async () => {
//     if (selectedItems.size === 0) {
//       toast.warning("Please select items to move to trash");
//       return;
//     }

//     const confirmTrash = window.confirm(
//       `Are you sure you want to move ${selectedItems.size} item(s) to trash?`,
//     );
//     if (!confirmTrash) return;

//     setBulkOperationLoading(true);
//     try {
//       const paths = Array.from(selectedItems);
//       const response = await accountDocsAPI.bulkTrashItems({
//         targetPaths: paths,
//         trashedBy: "Admin",
//       });

//       if (response.data?.success) {
//         toast.success(
//           `${response.data.trashedItems?.length || selectedItems.size} item(s) moved to trash successfully`,
//         );
//         if (response.data.failedItems?.length > 0) {
//           toast.warning(`${response.data.failedItems.length} item(s) failed`);
//         }
//         setSelectedItems(new Set());
//         fetchFolderTree();
//       } else {
//         toast.error(response.data?.message || "Failed to trash items");
//       }
//     } catch (err) {
//       console.error("Bulk trash error:", err);
//       toast.error("Error moving items to trash: " + err.message);
//     } finally {
//       setBulkOperationLoading(false);
//     }
//   };

//   // Bulk delete - Using accountDocsAPI
//   const handleBulkDelete = async () => {
//     if (selectedItems.size === 0) {
//       toast.warning("Please select items to delete");
//       return;
//     }

//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete ${selectedItems.size} item(s)? This cannot be undone!`,
//     );
//     if (!confirmDelete) return;

//     setBulkOperationLoading(true);
//     try {
//       const paths = Array.from(selectedItems);
//       const response = await accountDocsAPI.bulkDeleteItems({ paths });

//       if (response.data?.success) {
//         toast.success(
//           `${response.data.summary?.success || selectedItems.size} item(s) deleted successfully`,
//         );
//         if (response.data.errors?.length > 0) {
//           toast.warning(
//             `${response.data.errors.length} item(s) failed to delete`,
//           );
//         }
//         setSelectedItems(new Set());
//         fetchFolderTree();
//       } else {
//         toast.error(response.data?.message || "Failed to delete items");
//       }
//     } catch (err) {
//       console.error("Bulk delete error:", err);
//       toast.error("Error deleting items: " + err.message);
//     } finally {
//       setBulkOperationLoading(false);
//     }
//   };

//   // Bulk lock/unlock - Using accountDocsAPI
//   const handleBulkLock = async (lockStatus) => {
//     if (selectedItems.size === 0) {
//       toast.warning("Please select items to lock/unlock");
//       return;
//     }

//     setBulkOperationLoading(true);
//     try {
//       const paths = Array.from(selectedItems);
//       const response = await accountDocsAPI.bulkSetReadOnly({
//         paths,
//         readOnly: lockStatus === "lock",
//       });

//       if (response.data?.success) {
//         toast.success(
//           `${response.data.summary?.success || selectedItems.size} item(s) ${lockStatus === "lock" ? "locked" : "unlocked"} successfully`,
//         );
//         setSelectedItems(new Set());
//         fetchFolderTree();
//         setBulkLockDialogOpen(false);
//       } else {
//         toast.error(
//           response.data?.message || `Failed to ${lockStatus} items`,
//         );
//       }
//     } catch (err) {
//       console.error("Bulk lock error:", err);
//       toast.error(`Error ${lockStatus}ing items`);
//     } finally {
//       setBulkOperationLoading(false);
//     }
//   };

//   // Bulk download - Using accountDocsAPI
//   const handleBulkDownload = async () => {
//     if (selectedItems.size === 0) {
//       toast.warning("Please select items to download");
//       return;
//     }

//     setBulkOperationLoading(true);
//     try {
//       const paths = Array.from(selectedItems);
//       const response = await accountDocsAPI.downloadItems({ paths });

//       // Handle blob response
//       const blob = response.data;
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `selected_items_${new Date().getTime()}.zip`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//       toast.success("Download started");
//     } catch (err) {
//       console.error("Bulk download error:", err);
//       toast.error("Failed to download items");
//     } finally {
//       setBulkOperationLoading(false);
//     }
//   };

//   // Handle file click - Using accountDocsAPI to remove new tag
//   const handleFileClick = async (fullPath, fileName, meta = {}) => {
//     try {
//       if (meta.readOnly) {
//         alert("This file is locked and cannot be opened.");
//         return;
//       }

//       // Remove "New" tag if present
//       if (
//         meta.tags?.some((tag) => tag.isSystemTag && tag.tagName === "New")
//       ) {
//         await accountDocsAPI.removeNewTag({ filePath: fullPath });
//         await fetchFolderTree();
//       }

//       const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}uploads/accounts/${fullPath}`;
//       const extension = fileName.split(".").pop().toLowerCase();

//       if (extension === "xls" || extension === "xlsx") {
//         setSelectedFileUrl(fileUrl);
//         setSelectedFileName(fileName);
//         setOpenExcelDialog(true);
//         return;
//       }

//       if (extension === "doc" || extension === "docx") {
//         setSelectedFileUrl(fileUrl);
//         setSelectedFileName(fileName);
//         setOpenWordDialog(true);
//         return;
//       }

//       if (extension === "txt") {
//         const res = await fetch(fileUrl);
//         const text = await res.text();
//         setTextContent(text);
//         setSelectedFileName(fileName);
//         setOpenTextDialog(true);
//         return;
//       }

//       setSelectedFileUrl(fileUrl);
//       setSelectedFileName(fileName);
//       setOpenFileViewer(true);
//     } catch (error) {
//       console.error("Error opening/downloading file:", error);
//     }
//   };

//   // Toggle sign status
//   const toggleSignStatus = async (item) => {
//     try {
//       const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts/${item.path}`;
//       const fileName = item.name;
//       const res = await fetch(
//         `${SIGNATURE_API}api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}&accountId=${accountId}`,
//       );
//       const data = await res.json();
//       console.log("token data", data);
//       setToken(data.token);
//       setShowBuilderFor(item);
//       setOpenDialog(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Cancel signature
//   const cancelSignature = async (item) => {
//     try {
//       await axios.delete(
//         `${SIGNATURE_API}signature/cancel/${item.meta.esignRequestId}`,
//         {
//           data: {
//             folder: item.meta.folder,
//             name: item.meta.name,
//           },
//         },
//       );
//       alert("Signature request cancelled.");
//       fetchFolderTree();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to cancel signature");
//     }
//   };

//   // Toggle approval status
//   const toggleApprovalStatus = (item) => {
//     handleMenuClose();
//     setSelectedItem(item);
//     setOpenApprovalDialog(true);
//   };

//   // Handle cancel approval
//   const handleCancelApproval = async (item) => {
//     try {
//       const res = await accountDocsAPI.toggleApproval({
//         approvalId: item.meta?.approvalId,
//         filePath: item.path,
//         action: "cancel",
//       });

//       if (res.status === 200 || res.status === 201) {
//         alert("Approval Request Cancelled");
//         fetchFolderTree();
//       } else {
//         throw new Error("Cancel failed");
//       }
//     } catch (err) {
//       alert("Cancel request failed");
//     }
//   };
//   const FILE_URL = process.env.REACT_APP_FOLDER_MANAGEMENT;
//   // Handle request approval
//   const handleRequestApproval = async () => {
//     if (!selectedItem) return;

//     try {
//       setSending(true);
//       const fileUrl = `${FILE_URL}/uploads/accounts/${selectedItem.path}`;

//       const payload = {
//         filePath: selectedItem.path,
//         action: "send",
//         accountId,
//         filename: selectedItem.name,
//         fileUrl,
//         clientEmail,
//         description,
//       };

//       const res = await accountDocsAPI.toggleApproval(payload);

//       if (res.status === 200 || res.status === 201) {
//         alert(`Approval request sent to ${clientEmail}`);
//         handleCloseDialog();
//         fetchFolderTree();
//       } else {
//         throw new Error(res.data?.error || "Failed to send approval");
//       }
//     } catch (error) {
//       console.error("Approval request failed:", error);
//       alert("Failed to send approval.");
//     } finally {
//       setSending(false);
//     }
//   };

//   // Handle invoice lock
//   const toggleInvoiceLock = async (item) => {
//     const filePath = item.path;
//     const invoiceIds = item.meta?.invoiceLock || [];
//     const isLocked = item.meta?.lockInvoiceStatus === "pendingpayment";

//     if (isLocked) {
//       if (!invoiceIds.length) {
//         toast.error("No invoice mapped!");
//         return;
//       }

//       try {
//         await accountDocsAPI.lockUnlockInvoice({
//           filePath,
//           invoiceIds,
//           action: "unlock",
//         });
//         toast.success("Invoice unlocked");
//         fetchFolderTree();
//       } catch (err) {
//         toast.error("Unlock failed");
//       }
//       return;
//     }

//     try {
//       const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);

//       const pendingInvoices = res.data?.invoice || [];

//       if (pendingInvoices.length === 0) {
//         toast.info("No pending invoices available");
//         return;
//       }

//       setInvoiceList(pendingInvoices);
//       setSelectedDoc(item);
//       setInvoiceDialogOpen(true);
//     } catch (error) {
//       toast.error("Failed to fetch invoices");
//       console.error(error);
//     }
//   };

//   const handleSubmit = () => {
//     if (selectedInvoices.length === 0) {
//       toast.warning("Select at least one invoice");
//       return;
//     }
//     confirmInvoiceLock(selectedInvoices);
//   };

//   const confirmInvoiceLock = async (invoiceIds) => {
//     try {
//       await accountDocsAPI.lockUnlockInvoice({
//         filePath: selectedDoc.path,
//         invoiceIds,
//         action: "lock",
//       });
//       toast.success("Invoice locked successfully");
//       setInvoiceDialogOpen(false);
//       fetchFolderTree();
//     } catch (err) {
//       toast.error("Lock failed");
//       console.log(err);
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenApprovalDialog(false);
//     setDescription("");
//     setSelectedItem(null);
//   };

//   const handleDownload = async (item) => {
//     try {
//       const response = await accountDocsAPI.downloadItems({
//         paths: item.path,
//       });
//       const blob = response.data;
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = item.name || "download";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download error:", err);
//     }
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

//   const formatUploadedAt = (dateValue) => {
//     if (!dateValue) return "";
//     if (
//       typeof dateValue === "string" &&
//       /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
//     ) {
//       return dateValue;
//     }
//     const date = new Date(dateValue);
//     if (isNaN(date)) return dateValue;
//     return date
//       .toLocaleDateString("en-US", {
//         month: "short",
//         day: "2-digit",
//         year: "numeric",
//       })
//       .toUpperCase()
//       .replace(",", "")
//       .replace(" ", "-");
//   };

//   const getStatusChip = (meta, isFolder) => {
//     if (isFolder) return null;
//     const chips = [];

//     if (SIGN_STATUSES.includes(meta.signStatus)) {
//       let color = "default";
//       if (meta.signStatus === "pendingSignature") color = "warning";
//       if (meta.signStatus === "signatureCompleted") color = "success";
//       chips.push(
//         <Chip
//           key="signChip"
//           label={statusTextMap[meta.signStatus]}
//           size="small"
//           variant="outlined"
//           color={color}
//         />,
//       );
//     }

//     if (APPROVAL_STATUSES.includes(meta.authStatus)) {
//       let color = "default";
//       if (meta.authStatus === "pendingApproval") color = "warning";
//       if (meta.authStatus === "approvalCompleted") color = "success";
//       if (meta.authStatus === "canceledApproval") color = "error";

//       if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
//         chips.push(
//           <Tooltip
//             key="approvalCanceledChip"
//             title={meta.cancelReason}
//             placement="top-end"
//           >
//             <Chip
//               label="Approval Canceled"
//               size="small"
//               variant="outlined"
//               color="error"
//               sx={{ cursor: "pointer" }}
//             />
//           </Tooltip>,
//         );
//       } else {
//         chips.push(
//           <Chip
//             key="approvalChip"
//             label={approvalStatusTextMap[meta.authStatus]}
//             size="small"
//             variant="outlined"
//             color={color}
//           />,
//         );
//       }
//     }

//     if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
//       let color = "default";
//       if (meta.lockInvoiceStatus === "pendingpayment") color = "warning";
//       if (meta.lockInvoiceStatus === "paymentcompleted") color = "success";
//       chips.push(
//         <Chip
//           key="invoiceLockChip"
//           label={invoiceStatusTextMap[meta.lockInvoiceStatus]}
//           size="small"
//           variant="outlined"
//           color={color}
//         />,
//       );
//     }

//     if (chips.length === 0) return null;
//     return <Box sx={{ display: "flex", gap: 1 }}>{chips}</Box>;
//   };

//   const getFolderCounts = (folder) => {
//     let fileCount = 0;
//     let folderCount = 0;

//     if (folder.children && folder.children.length > 0) {
//       folder.children.forEach((child) => {
//         if (child.type === "folder") {
//           folderCount += 1;
//           const subCounts = getFolderCounts(child);
//           fileCount += subCounts.fileCount;
//           folderCount += subCounts.folderCount;
//         } else {
//           fileCount += 1;
//         }
//       });
//     }
//     return { fileCount, folderCount };
//   };

//   const findNewSystemTag = (item) => {
//     const newTag = item.meta?.tags?.find(
//       (tag) => tag.isSystemTag && tag.tagName === "New",
//     );
//     if (newTag) return newTag;

//     if (item.children && item.children.length > 0) {
//       for (const child of item.children) {
//         const childTag = findNewSystemTag(child);
//         if (childTag) return childTag;
//       }
//     }
//     return null;
//   };

//   const renderTableRows = (items, level = 0, parentPath = "") => {
//     const sortedItems = [...items].sort((a, b) => {
//       if (a.type === "folder" && b.type !== "folder") return -1;
//       if (a.type !== "folder" && b.type === "folder") return 1;
//       return a.name.localeCompare(b.name);
//     });

//     return sortedItems.map((item) => {
//       const fullPath = item.path;
//       const meta = item.meta || {};
//       const isFolder = item.type === "folder";
//       const { folderCount, fileCount } = isFolder
//         ? getFolderCounts(item)
//         : { folderCount: 0, fileCount: 0 };
//       const isSelected = selectedItems.has(fullPath);
//       const isPartiallySelected = isFolder
//         ? isFolderPartiallySelected(item)
//         : false;
//       const inheritedNewTag = isFolder ? findNewSystemTag(item) : null;

//       const handleSafeFileClick = () => {
//         if (meta.readOnly) {
//           alert("This file is locked and cannot be opened.");
//           return;
//         }
//         if (!isFolder) {
//           handleFileClick(fullPath, item.name, meta);
//         }
//       };

//       return (
//         <React.Fragment key={fullPath}>
//           <TableRow
//             sx={{
//               backgroundColor: level % 2 === 0 ? "#fafafa" : "white",
//               "&:hover": { backgroundColor: "#f5f5f5" },
//             }}
//           >
//             <TableCell sx={{ width: "50px", paddingLeft: 2 }}>
//               {isFolder ? (
//                 <Checkbox
//                   size="small"
//                   checked={isSelected}
//                   indeterminate={isPartiallySelected}
//                   onChange={() => handleFolderSelect(item)}
//                 />
//               ) : (
//                 <Checkbox
//                   size="small"
//                   checked={isSelected}
//                   onChange={() => handleSelectItem(fullPath)}
//                 />
//               )}
//             </TableCell>

//             <TableCell sx={{ paddingLeft: level * 4 + 2 }}>
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 {isFolder ? (
//                   <>
//                     <IconButton
//                       size="small"
//                       onClick={() => toggleFolder(fullPath, meta.readOnly)}
//                       disabled={meta.readOnly}
//                       sx={{ mr: 0.5 }}
//                     >
//                       {expandedFolders[fullPath] ? (
//                         <FolderOpenIcon color="#1976d2" />
//                       ) : (
//                         <FolderClosedIcon color="#757575" />
//                       )}
//                     </IconButton>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         ml: 0.5,
//                         fontWeight: "medium",
//                         color: meta.readOnly ? "#999" : "inherit",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => toggleFolder(fullPath, meta.readOnly)}
//                     >
//                       {item.name}
//                       {inheritedNewTag && (
//                         <Chip
//                           label={inheritedNewTag.tagName}
//                           size="small"
//                           sx={{
//                             backgroundColor: inheritedNewTag.tagColour,
//                             color: "#fff",
//                             height: 18,
//                             fontSize: "0.7rem",
//                             ml: 0.8,
//                           }}
//                         />
//                       )}
//                       {meta.readOnly && (
//                         <Typography
//                           component="span"
//                           variant="caption"
//                           sx={{ color: "error.main", ml: 1 }}
//                         >
//                           (Locked)
//                         </Typography>
//                       )}
//                     </Typography>
//                   </>
//                 ) : (
//                   <>
//                     <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
//                     <Box sx={{ display: "flex", flexDirection: "column" }}>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: meta.readOnly ? "#999" : "#1976d2",
//                           textDecoration: meta.readOnly
//                             ? "none"
//                             : "underline",
//                           cursor: meta.readOnly ? "not-allowed" : "pointer",
//                         }}
//                         onClick={handleSafeFileClick}
//                       >
//                         {item.name}
//                         {meta.readOnly && (
//                           <Typography
//                             component="span"
//                             variant="caption"
//                             sx={{ color: "error.main", ml: 1 }}
//                           >
//                             (Locked)
//                           </Typography>
//                         )}
//                         {meta.tags?.map((tag, index) => (
//                           <Chip
//                             key={index}
//                             label={tag.tagName}
//                             size="small"
//                             sx={{
//                               backgroundColor: tag.tagColour || "#e0e0e0",
//                               color: "#fff",
//                               height: 18,
//                               fontSize: "0.7rem",
//                               ml: 0.5,
//                             }}
//                           />
//                         ))}
//                       </Typography>
//                     </Box>
//                   </>
//                 )}
//               </Box>
//             </TableCell>
//             <TableCell>
//               <Typography variant="caption" sx={{ ml: 1, color: "gray" }}>
//                 ({folderCount} folders, {fileCount} files)
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Box sx={{ mt: 0.5 }}>{getStatusChip(meta, isFolder)}</Box>
//             </TableCell>
//             <TableCell>
//               <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                 {formatUploadedAt(meta.uploadedAt)}
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                 {meta.uploadedBy}
//               </Typography>
//             </TableCell>
//             <TableCell align="right">
//               <IconButton
//                 size="small"
//                 onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>

//           {isFolder &&
//             expandedFolders[fullPath] &&
//             item.children &&
//             item.children.length > 0 &&
//             renderTableRows(item.children, level + 1, fullPath)}
//         </React.Fragment>
//       );
//     });
//   };

//   return (
//     <Box sx={{ margin: "auto", p: 3 }}>
//       {/* Action Buttons */}
//       <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             gap: 1,
//             maxWidth: "600px",
//             width: "100%",
//             mx: "auto",
//             my: 3,
//           }}
//         >
//           <Button
//             variant="contained"
//             fullWidth
//             startIcon={<FolderIcon />}
//             onClick={() => {
//               setNewFolderDrawerOpen(true);
//               handleMenuClose();
//             }}
//           >
//             Create Folder
//           </Button>

//           <Button
//             variant="contained"
//             fullWidth
//             startIcon={<UploadFileIcon />}
//             onClick={() => setFileUploadDrawerOpen(true)}
//           >
//             Upload File
//           </Button>

//           <Button
//             variant="contained"
//             fullWidth
//             startIcon={<DriveFolderUploadIcon />}
//             onClick={() => setFolderUploaDrawerOpen(true)}
//           >
//             Upload Folder
//           </Button>
//         </Box>

//         {/* Bulk Operations Toolbar */}
//         {selectedItems.size > 0 && (
//           <Paper
//             elevation={2}
//             sx={{
//               p: 2,
//               mb: 3,
//               bgcolor: "#e3f2fd",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             <Typography variant="subtitle1" fontWeight="bold">
//               {selectedItems.size} item(s) selected
//             </Typography>

//             <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//               <Button
//                 variant="contained"
//                 size="small"
//                 startIcon={<DriveFileMoveIcon />}
//                 onClick={() => setBulkMoveDrawerOpen(true)}
//                 disabled={bulkOperationLoading}
//               >
//                 Move
//               </Button>

//               <Button
//                 variant="contained"
//                 size="small"
//                 startIcon={<LockIcon />}
//                 onClick={() => setBulkLockDialogOpen(true)}
//                 disabled={bulkOperationLoading}
//               >
//                 Lock/Unlock
//               </Button>

//               <Button
//                 variant="contained"
//                 color="secondary"
//                 size="small"
//                 startIcon={<DeleteIcon />}
//                 onClick={handleBulkTrash}
//                 disabled={bulkOperationLoading}
//               >
//                 Delete
//               </Button>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 size="small"
//                 startIcon={<DownloadIcon />}
//                 onClick={handleBulkDownload}
//                 disabled={bulkOperationLoading}
//               >
//                 Download
//               </Button>

//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => setSelectedItems(new Set())}
//                 disabled={bulkOperationLoading}
//               >
//                 Clear Selection
//               </Button>
//             </Box>
//           </Paper>
//         )}

//         {/* Drawers */}
//         <FileUploadDrawer
//           isOpen={fileUploadDrawerOpen}
//           onClose={() => setFileUploadDrawerOpen(false)}
//           folderTree={folderTree}
//           fetchFolderTree={() => fetchFolderTree(accountId)}
//           accountId={accountId}
//           selectedFolderForMenu={selectedFolderForMenu}
//         />

//         <CreteFolderDrawer
//           isOpen={newFolderDrawerOpen}
//           onClose={() => {
//             setNewFolderDrawerOpen(false);
//           }}
//           folderTree={folderTree}
//           fetchFolderTree={() => fetchFolderTree(accountId)}
//           accountId={accountId}
//           selectedFolderForMenu={selectedFolderForMenu}
//         />

//         <FolderUploadDrawer
//           isOpen={folderUploaDrawerOpen}
//           onClose={() => setFolderUploaDrawerOpen(false)}
//           folderTree={folderTree}
//           fetchFolderTree={() => fetchFolderTree(accountId)}
//           selectedFolderForMenu={selectedFolderForMenu}
//         />

//         <MoveDrawer
//           isOpen={moveDrawerOpen}
//           onClose={() => {
//             setMoveDrawerOpen(false);
//           }}
//           folderTree={folderTree}
//           fetchFolderTree={() => fetchFolderTree(accountId)}
//           selectedFolderForMenu={selectedFolderForMenu}
//         />

//         <RenameDrawer
//           isOpen={renameDrawer}
//           onClose={() => {
//             SetRenameDrawer(false);
//           }}
//           folderTree={folderTree}
//           fetchFolderTree={() => fetchFolderTree(accountId)}
//           selectedFolderForMenu={selectedFolderForMenu}
//         />
//         {/* 🔴 Bulk Move Drawer */}
//         <MoveDrawer
//           isOpen={bulkMoveDrawerOpen}
//           onClose={() => setBulkMoveDrawerOpen(false)}
//           folderTree={folderTree}
//           fetchFolderTree={fetchFolderTree}
//           // Bulk mode props
//           isBulkOperation={true}
//           selectedPaths={Array.from(selectedItems)} // Array of selected paths
//           onMoveComplete={(targetPath) => {
//             // Optional callback after successful move
//             console.log("Bulk move completed to:", targetPath);
//             setSelectedItems(new Set()); // Clear selection
//           }}
//         />
//       </Box>

//       {/* Folder Explorer */}

//       <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           📜 Folder Explorer
//         </Typography>

//         {folderTree && folderTree.length > 0 ? (
//           <>
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ width: "50px" }}>
//                       <Checkbox
//                         checked={selectAll}
//                         indeterminate={selectedItems.size > 0 && !selectAll}
//                         onChange={handleSelectAll}
//                       />
//                     </TableCell>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Content</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Uploaded</TableCell>
//                     <TableCell>User</TableCell>
//                     <TableCell align="right">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>{renderTableRows(folderTree)}</TableBody>
//               </Table>
//             </TableContainer>
//           </>
//         ) : (
//           <Typography sx={{ p: 2, textAlign: "center" }}>
//             {/* Loading folder data... */}
//           </Typography>
//         )}
//       </Paper>
//       {/* 🔴 Bulk Lock Dialog */}
//       <Dialog
//         open={bulkLockDialogOpen}
//         onClose={() => setBulkLockDialogOpen(false)}
//       >
//         <DialogTitle>Lock/Unlock Selected Items</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Do you want to lock or unlock the {selectedItems.size} selected
//             item(s)?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBulkLockDialogOpen(false)}>Cancel</Button>
//           <Button
//             onClick={() => handleBulkLock("unlock")}
//             color="primary"
//             disabled={bulkOperationLoading}
//           >
//             Unlock
//           </Button>
//           <Button
//             onClick={() => handleBulkLock("lock")}
//             color="warning"
//             variant="contained"
//             disabled={bulkOperationLoading}
//           >
//             Lock
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         fullWidth
//         maxWidth="lg"
//       >
//         <DialogTitle>
//           {/* {items.name} */}
//           {selectedFolderForMenu?.name || "Document"}
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpenDialog(false)}
//             style={{ position: "absolute", right: 8, top: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           {token && showBuilderFor && (
//             <DocusealBuilder
//               token={token}
//               customCss={customCss}
//               onComplete={() => {
//                 console.log("DocuSeal finished sending document");
//                 setShowBuilderFor(null);
//                 setOpenDialog(false);
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={openApprovalDialog}
//         onClose={handleCloseDialog}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>Request Approval</DialogTitle>
//         <DialogContent>
//           <TextField
//             multiline
//             rows={4}
//             fullWidth
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Type a short description or note..."
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleRequestApproval}
//             // disabled={!description.trim()}
//             disabled={!description.trim() || sending}
//           >
//             Send
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Menu
//         anchorEl={menuAnchorEl}
//         open={Boolean(menuAnchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         {(() => {
//           if (!selectedFolderForMenu) return null;

//           const item = selectedFolderForMenu;
//           const isFolder = item.type === "folder";
//           const isLocked = item?.meta?.readOnly === true;

//           // Determine doc category (adjust this logic if needed)
//           const path = item.path.toLowerCase();
//           let docType = "client"; // default
//           if (path.includes("firm")) docType = "firm";
//           if (path.includes("private")) docType = "private";
//           const PROTECTED_FOLDERS = [
//             "Client Uploaded Documents",
//             "Firm Documents Shared with Client",
//             "Private",
//           ];
//           const isProtectedFolder =
//             isFolder && PROTECTED_FOLDERS.includes(item.name);

//           const menuItems = [];

//           // -------------------------------
//           // 📁 FOLDER TYPE
//           // -------------------------------
//           if (isFolder) {
//             if (docType === "client") {
//               menuItems.push(
//                 {
//                   icon: <FolderIcon />,
//                   label: "New Folder",
//                   action: () => setNewFolderDrawerOpen(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Edit",
//                   action: () => SetRenameDrawer(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Move",
//                   action: () => setMoveDrawerOpen(true),
//                 },
//                 {
//                   icon: <DeleteIcon />,
//                   label: "Delete",
//                   // action: () => deleteItem(item),
//                   action: () => trashItem(item),
//                   disabled: isProtectedFolder,
//                 },
//                 {
//                   icon: <DownloadIcon />,
//                   label: "Download",
//                   action: () => handleDownload(item),
//                 },
//                 {
//                   icon: <UploadFileIcon />,
//                   label: "New File",
//                   action: () => setFileUploadDrawerOpen(true),
//                 },
//                 {
//                   icon: <DriveFolderUploadIcon />,
//                   label: "Upload Folder",
//                   action: () => setFolderUploaDrawerOpen(true),
//                 },
//                 {
//                   icon: <LockIcon />,
//                   label: isLocked ? "Unlock" : "Lock",
//                   action: () => toggleReadOnly(item),
//                 },
//               );
//             } else if (docType === "firm") {
//               menuItems.push(
//                 {
//                   icon: <FolderIcon />,
//                   label: "New Folder",
//                   action: () => setNewFolderDrawerOpen(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Edit",
//                   action: () => SetRenameDrawer(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Move",
//                   action: () => setMoveDrawerOpen(true),
//                 },
//                 {
//                   icon: <UploadFileIcon />,
//                   label: "New File",
//                   action: () => setFileUploadDrawerOpen(true),
//                 },
//                 {
//                   icon: <DownloadIcon />,
//                   label: "Download",
//                   action: () => handleDownload(item),
//                 },
//                 {
//                   icon: <DriveFolderUploadIcon />,
//                   label: "Upload Folder",
//                   action: () => setFolderUploaDrawerOpen(true),
//                 },
//                 {
//                   icon: <DeleteIcon />,
//                   label: "Delete",
//                   // action: () => deleteItem(item),
//                   action: () => trashItem(item),
//                   disabled: isProtectedFolder,
//                 },
//               );
//             } else if (docType === "private") {
//               menuItems.push(
//                 {
//                   icon: <FolderIcon />,
//                   label: "New Folder",
//                   action: () => setNewFolderDrawerOpen(true),
//                 },
//                 {
//                   icon: <UploadFileIcon />,
//                   label: "New File",
//                   action: () => setFileUploadDrawerOpen(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Move",
//                   action: () => setMoveDrawerOpen(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Edit",
//                   action: () => SetRenameDrawer(true),
//                 },
//                 {
//                   icon: <DeleteIcon />,
//                   label: "Delete",
//                   //action: () => deleteItem(item),
//                   action: () => trashItem(item),
//                   disabled: isProtectedFolder,
//                 },
//                 {
//                   icon: <DownloadIcon />,
//                   label: "Download",
//                   action: () => handleDownload(item),
//                 },
//               );
//             }
//           }

//           // -------------------------------
//           // 📄 FILE TYPE
//           // -------------------------------
//           else {
//             if (docType === "client") {
//               menuItems.push(
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Edit",
//                   action: () => SetRenameDrawer(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Move",
//                   action: () => setMoveDrawerOpen(true),
//                 },
//                 {
//                   icon: <LockIcon />,
//                   label: isLocked ? "Unlock" : "Lock",
//                   action: () => toggleReadOnly(item),
//                 },
//                 {
//                   icon: <DeleteIcon />,
//                   label: "Delete",
//                   //action: () => deleteItem(item),
//                   action: () => trashItem(item),
//                 },
//                 {
//                   icon: <DownloadIcon />,
//                   label: "Download",
//                   action: () => handleDownload(item),
//                 },
//               );
//             } else if (docType === "firm") {
//               const currentStatus =
//                 item.meta?.signStatus || "sendForSignature";
//               const approvalStatus =
//                 item.meta?.authStatus || "sendForApproval";
//               const invoiceStatus = item.meta?.lockInvoiceStatus;

//               const isSignatureDisabled =
//                 currentStatus === "pendingSignature" ||
//                 currentStatus === "signatureCompleted";

//               const isApprovalCompleted =
//                 approvalStatus === "approvalCompleted";
//               // const isApprovalPending = approvalStatus === "pendingApproval";
//               const isApprovalCanceled =
//                 approvalStatus === "canceledApproval";

//               let invoiceLabel = "Lock Invoice";
//               if (invoiceStatus === "pendingpayment")
//                 invoiceLabel = "Unlock Invoice";
//               if (invoiceStatus === "paymentcompleted" || !invoiceStatus)
//                 invoiceLabel = "Lock Invoice";

//               menuItems.push(
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Edit",
//                   action: () => SetRenameDrawer(true),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Move",
//                   action: () => setMoveDrawerOpen(true),
//                 },
//               );
//               // SIGNATURE MENU
//               if (currentStatus === "pendingSignature") {
//                 menuItems.push({
//                   icon: <CancelIcon />,
//                   label: "Cancel Signature Request",
//                   action: () => cancelSignature(item),
//                 });
//               } else {
//                 menuItems.push({
//                   icon: <PenTool size={16} />,
//                   label: statusTextMap[currentStatus],
//                   action: () => toggleSignStatus(item),
//                   disabled: isSignatureDisabled,
//                 });
//               }

//               // ---------------- APPROVAL MENU LOGIC ----------------
//               if (approvalStatus === "sendForApproval") {
//                 menuItems.push({
//                   icon: <Stamp size={16} />,
//                   label: "Send For Approval",
//                   action: () => toggleApprovalStatus(item),
//                   // action: () => handleOpenApprovalDialog(item),
//                 });
//               }

//               if (approvalStatus === "pendingApproval") {
//                 menuItems.push({
//                   icon: <CancelIcon />,
//                   label: "Cancel Approval Request",
//                   action: () => handleCancelApproval(item),
//                 });
//               }

//               if (isApprovalCompleted) {
//                 menuItems.push({
//                   icon: <Stamp size={16} />,
//                   label: "Approved",
//                   disabled: true,
//                 });
//               }

//               if (isApprovalCanceled) {
//                 menuItems.push({
//                   icon: <Stamp size={16} />,
//                   label: "Approval Canceled",
//                   disabled: true,
//                 });
//               }

//               // ---------------- INVOICE LOCK ----------------
//               menuItems.push({
//                 icon:
//                   invoiceStatus === "pendingpayment" ? (
//                     <LockOpenIcon />
//                   ) : (
//                     <LockIcon />
//                   ),
//                 label: invoiceLabel,
//                 action: () => toggleInvoiceLock(item),
//               });

//               // ---------------- DELETE ----------------
//               menuItems.push({
//                 icon: <DeleteIcon />,
//                 label: "Delete",
//                 //action: () => deleteItem(item),
//                 action: () => trashItem(item),
//               });
//               menuItems.push({
//                 icon: <DownloadIcon />,
//                 label: "Download",
//                 action: () => handleDownload(item),
//               });
//             } else if (docType === "private") {
//               menuItems.push(
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Edit",
//                   action: () => SetRenameDrawer(true),
//                 },
//                 {
//                   icon: <DeleteIcon />,
//                   label: "Delete",
//                   // action: () => deleteItem(item),
//                   action: () => trashItem(item),
//                 },
//                 {
//                   icon: <DownloadIcon />,
//                   label: "Download",
//                   action: () => handleDownload(item),
//                 },
//                 {
//                   icon: <DriveFileMoveIcon />,
//                   label: "Move",
//                   action: () => setMoveDrawerOpen(true),
//                 },
//               );
//             }
//           }

//           return menuItems.map(({ icon, label, action, disabled }) => (
//             <MenuItem
//               key={label}
//               disabled={(label !== "Unlock" && isLocked) || disabled}
//               // disabled={label !== "Unlock" && isLocked} // allow unlock even if locked
//               onClick={() => {
//                 action();
//                 handleMenuClose();
//               }}
//               sx={{ fontSize: "0.8rem", py: 0.5 }}
//             >
//               {React.cloneElement(icon, { sx: { mr: 0.5, fontSize: 16 } })}
//               {label}
//             </MenuItem>
//           ));
//         })()}
//       </Menu>
//       <Dialog
//         open={invoiceDialogOpen}
//         onClose={() => setInvoiceDialogOpen(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>Select Invoices To Lock</DialogTitle>

//         <DialogContent dividers>
//           {invoiceList.length === 0 && (
//             <Typography textAlign="center" color="text.secondary" p={2}>
//               No invoices found
//             </Typography>
//           )}

//           <Box sx={{ overflowX: "auto", mt: 1 }}>
//             <Table sx={{ minWidth: 650 }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Select</TableCell>
//                   <TableCell>Invoice #</TableCell>
//                   <TableCell>Description</TableCell>
//                   <TableCell>Created At</TableCell>
//                   <TableCell>Amount</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {invoiceList.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={5}>No invoices found.</TableCell>
//                   </TableRow>
//                 ) : (
//                   invoiceList.map((inv) => {
//                     const id = inv._id;
//                     const checked = selectedInvoices.includes(id);

//                     return (
//                       <TableRow
//                         key={id}
//                         hover
//                         sx={{
//                           cursor: "pointer",
//                           bgcolor: checked ? "#e3f2fd" : "inherit",
//                         }} // optional: highlight selected
//                         onClick={() => {
//                           setSelectedInvoices((prev) => {
//                             const updated = prev.includes(id)
//                               ? prev.filter((x) => x !== id)
//                               : [...prev, id];

//                             console.log("Selected invoices:", updated); // <-- log here
//                             return updated;
//                           });
//                         }}
//                       >
//                         <TableCell>
//                           <Checkbox checked={checked} />
//                         </TableCell>
//                         <TableCell>{inv.invoicenumber}</TableCell>
//                         <TableCell>{inv.description || "—"}</TableCell>
//                         <TableCell>
//                           {new Date(inv.createdAt).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>₹{inv.summary?.total}</TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit}>
//             Lock Invoice
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog
//         open={openFileViewer}
//         onClose={() => setOpenFileViewer(false)}
//         fullWidth
//         maxWidth="lg" // Adjust size as needed (sm, md, lg, xl)
//       >
//         <DialogTitle
//           sx={{
//             m: 0,
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6" component="div">
//             {selectedFileName}
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpenFileViewer(false)}
//             sx={{ color: (theme) => theme.palette.grey[500] }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent
//           dividers
//           sx={{ p: 0, height: "80vh", overflow: "hidden" }}
//         >
//           <Box
//             sx={{
//               width: "100%",
//               height: "100%",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               bgcolor: "#f5f5f5",
//             }}
//           >
//             {/* The iframe will handle PDFs, Images, and Text files. 
//           Browsers will automatically use their built-in viewers.
//       */}
//             <iframe
//               src={selectedFileUrl}
//               title="File Preview"
//               width="100%"
//               height="100%"
//               style={{ border: "none" }}
//             />
//           </Box>
//         </DialogContent>
//       </Dialog>
//       <Dialog
//         open={openWordDialog}
//         onClose={() => setOpenWordDialog(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         {/* <DialogTitle>{selectedFileName}</DialogTitle> */}
//         <DialogTitle
//           sx={{
//             m: 0,
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6" component="div">
//             {selectedFileName}
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpenWordDialog(false)}
//             sx={{ color: (theme) => theme.palette.grey[500] }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <iframe
//             src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedFileUrl)}`}
//             width="100%"
//             height="600px"
//             title="Word Viewer"
//           />
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={openTextDialog}
//         onClose={() => setOpenTextDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         {/* <DialogTitle>{selectedFileName}</DialogTitle> */}
//         <DialogTitle
//           sx={{
//             m: 0,
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6" component="div">
//             {selectedFileName}
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpenTextDialog(false)}
//             sx={{ color: (theme) => theme.palette.grey[500] }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <pre style={{ whiteSpace: "pre-wrap" }}>{textContent}</pre>
//         </DialogContent>
//       </Dialog>
//       <Dialog
//         open={openExcelDialog}
//         onClose={() => setOpenExcelDialog(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography>{selectedFileName}</Typography>
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpenExcelDialog(false)}
//             sx={{ color: (theme) => theme.palette.grey[500] }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <iframe
//             src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedFileUrl)}`}
//             width="100%"
//             height="600px"
//             title="Excel Viewer"
//           />
//         </DialogContent>
//       </Dialog>
//       <Dialog
//         open={openTemplateDialog}
//         onClose={() => setOpenTemplateDialog(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <DialogTitle>
//           {/* {items.name} */}
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpenTemplateDialog(false)}
//             style={{ position: "absolute", right: 8, top: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ height: "80vh" }}>
//           {token ? (
//             <DocusealBuilder
//               token={token}
//               onComplete={() => {
//                 console.log("Template edited");
//                 setOpenTemplateDialog(false);
//               }}
//             />
//           ) : (
//             <p>Loading template...</p>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// FolderTreeView.jsx
import React, { useState, useEffect } from "react";
import { DocusealBuilder } from "@docuseal/react";
import {
  MoreVertical,
  Folder as FolderIcon,
  FolderOpen,
  FolderClosed,
  FileIcon,
  Lock,
  Unlock,
  Upload,
  FolderUp,
  Trash2,
  Move,
  Download,
  CheckCircle,
  XCircle,
  CancelCircle,
  Eye,
  PenTool,
  Stamp,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
import { toast } from "react-toastify";

// shadcn/ui imports
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { Textarea } from "../../../components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";

// Custom Drawers (keep as is)
import FileUploadDrawer from "./drawers/FileUploadDrawer";
import CreateFolderDrawer from "./drawers/CreteFolderDrawer";
import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";

// API imports
import {
  accountDocsAPI,
  accountsAPI,
  invoiceAPI,
} from "../../../services/api";

// Custom CSS
import "./docuseal-dark-theme.css";
import { useConfirm } from "../../../components/ConfirmDialogContext";
export const FolderTreeView = ({ accountId }) => {
  const confirm = useConfirm();
  const [clientEmail, setClientEmail] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
  const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
  const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
  const [renameDrawer, SetRenameDrawer] = useState(null);
  const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
  const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
  const [bulkMoveDrawerOpen, setBulkMoveDrawerOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [folderTree, setFolderTree] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [token, setToken] = useState("");
  const [showBuilderFor, setShowBuilderFor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [bulkLockDialogOpen, setBulkLockDialogOpen] = useState(false);
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false);
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [openFileViewer, setOpenFileViewer] = useState(false);
  const [openExcelDialog, setOpenExcelDialog] = useState(false);
  const [openWordDialog, setOpenWordDialog] = useState(false);
  const [openTextDialog, setOpenTextDialog] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [emails, setEmails] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const SIGN_STATUSES = [
    "sendForSignature",
    "pendingSignature",
    "signatureCompleted",
  ];

  const statusTextMap = {
    sendForSignature: "Send for Sign",
    pendingSignature: "Waiting for Signature",
    signatureCompleted: "Signature Received",
  };

  const INVOICE_LOCK_STATUSES = ["pendingpayment", "paymentcompleted"];

  const invoiceStatusTextMap = {
    pendingpayment: "Pending Payment",
    paymentcompleted: "Payment Completed",
  };

  const APPROVAL_STATUSES = [
    "sendForApproval",
    "pendingApproval",
    "canceledApproval",
    "approvalCompleted",
  ];

  const approvalStatusTextMap = {
    sendForApproval: "Send for Approval",
    pendingApproval: "Waiting for Approval",
    canceledApproval: "Canceled Approval",
    approvalCompleted: "Approval Completed",
  };

  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;

  // Fetch account details - Using accountsAPI
  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      console.log("accounts details", res.data);
      const email = res.data?.contacts?.[0]?.contact?.email;
      setClientEmail(email);
      console.log("Client Email:", email);
    } catch (err) {
      console.error("Error fetching account details:", err);
    }
  };

  // Fetch folder tree - Using accountDocsAPI
  const fetchFolderTree = async () => {
    try {
      const res = await accountDocsAPI.listFoldersAndFiles(accountId);
      console.log("Folder tree data:", res?.data?.contents);
      setFolderTree(res?.data?.contents || []);
    } catch (err) {
      console.error(err);
      console.log("error list", err);
      setError("Error fetching folder tree");
    }
  };

  // Fetch emails - Using accountsAPI
  const fetchEmails = async () => {
    try {
      const res = await accountsAPI.getAccountContactEmails(accountId);
      setEmails(res.data.emails);
      console.log("Fetched emails:", res.data.emails);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  // Fetch invoices - Using API call
  const fetchInvoices = async () => {
    try {
      const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);
      const invoices = res.data?.invoice || [];
      setInvoiceList(invoices);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountDetails();
      fetchFolderTree();
      fetchEmails();
    }
  }, [accountId]);

  useEffect(() => {
    if (invoiceDialogOpen) fetchInvoices();
  }, [invoiceDialogOpen]);

  // Helper functions
  const getAllChildrenPaths = (item) => {
    const paths = [item.path];
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        paths.push(...getAllChildrenPaths(child));
      });
    }
    return paths;
  };

  const handleSelectItem = (path) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFolderSelect = (item) => {
    const allChildPaths = getAllChildrenPaths(item);
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      const allSelected = allChildPaths.every((path) => newSet.has(path));
      if (allSelected) {
        allChildPaths.forEach((path) => newSet.delete(path));
      } else {
        allChildPaths.forEach((path) => newSet.add(path));
      }
      return newSet;
    });
  };

  const isFolderPartiallySelected = (item) => {
    const allChildPaths = getAllChildrenPaths(item);
    const selectedCount = allChildPaths.filter((path) =>
      selectedItems.has(path),
    ).length;
    return selectedCount > 0 && selectedCount < allChildPaths.length;
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allPaths = new Set();
      const collectPaths = (items) => {
        items.forEach((item) => {
          allPaths.add(item.path);
          if (item.children && item.children.length > 0) {
            collectPaths(item.children);
          }
        });
      };
      collectPaths(folderTree);
      setSelectedItems(allPaths);
    }
    setSelectAll(!selectAll);
  };

  const toggleFolder = (path, isReadOnly) => {
    if (!isReadOnly) {
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    }
  };

  const handleMenuOpen = (event, folder) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedFolderForMenu(folder);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Update status - Using accountDocsAPI
  const updateStatus = async (
    item,
    statusType,
    newValue,
    approvalId = null,
    esignRequestId = null,
  ) => {
    try {
      if (!item?.path) return alert("Invalid item selected");

      const body = {
        targetPath: item.path,
        status: {
          [statusType]: newValue,
          ...(approvalId && { approvalId }),
          ...(esignRequestId && { esignRequestId }),
        },
      };

      const res = await accountDocsAPI.updateStatus(body);

      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || "Status updated successfully");
        fetchFolderTree();
      } else {
        toast.error(res.data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error updating status");
    }
  };

  // Toggle read-only - Using accountDocsAPI
  const toggleReadOnly = async (item) => {
    try {
      const newStatus = !item.meta.readOnly;

      const body =
        item.type === "folder"
          ? { folderPath: item.path, readOnly: newStatus }
          : { filePath: item.path, readOnly: newStatus };

      const res =
        item.type === "folder"
          ? await accountDocsAPI.setFolderReadOnly(body)
          : await accountDocsAPI.setFileReadOnly(body);

      if (res.status === 200 || res.status === 201) {
        fetchFolderTree();
        if (item.type === "folder" && newStatus) {
          setExpandedFolders((prev) => {
            const updated = { ...prev };
            delete updated[item.path];
            return updated;
          });
        }
        handleMenuClose();
        toast.success(res.data.message || "Updated successfully");
      } else {
        toast.error("Error: " + (res.data.error || "Failed to update"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update read-only status");
    }
  };

  // Trash item - Using accountDocsAPI
  // const trashItem = async (item) => {
  //   if (!item?.path) return alert("Invalid path");
  //   const confirmTrash = window.confirm(
  //     `Are you sure you want to move "${item.name}" to Trash?`,
  //   );
  //   if (!confirmTrash) return;

  //   try {
  //     const response = await accountDocsAPI.trashItem({
  //       targetPath: item.path,
  //       trashedBy: "Admin",
  //     });

  //     if (response.data?.success) {
  //       toast.success(response.data.message || "Moved to trash");
  //       setTimeout(() => {
  //         fetchFolderTree();
  //       }, 500);
  //     } else {
  //       toast.error(response.data?.message || "Failed to move to trash");
  //     }
  //   } catch (err) {
  //     console.error("Error trashing item:", err);
  //     toast.error("Error moving item to trash");
  //   }
  //   handleMenuClose();
  // };

  const trashItem = async (item) => {
  if (!item?.path) return alert("Invalid path");

  confirm({
    title: "Move to Trash",
    description: `Are you sure you want to move "${item.name}" to Trash?`,
    onConfirm: async () => {
      try {
        const response = await accountDocsAPI.trashItem({
          targetPath: item.path,
          trashedBy: "Admin",
        });

        if (response.data?.success) {
          toast.success(response.data.message || "Moved to trash");
          setTimeout(() => {
            fetchFolderTree();
          }, 500);
        } else {
          toast.error(response.data?.message || "Failed to move to trash");
        }
      } catch (err) {
        console.error("Error trashing item:", err);
        toast.error("Error moving item to trash");
      }

      handleMenuClose();
    },
  });
};
  // Delete item - Using accountDocsAPI
  const deleteItem = async (item) => {
    if (!item?.path) return alert("Invalid path");
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.name}"? This cannot be undone!`,
    );
    if (!confirmDelete) return;

    try {
      const response = await accountDocsAPI.deleteItem({
        targetPath: item.path,
      });

      if (response.data?.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          fetchFolderTree();
        }, 800);
      } else {
        toast.error(response.data?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Error deleting file or folder");
    }
    handleMenuClose();
  };

  // Bulk trash - Using accountDocsAPI
  const handleBulkTrash = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to move to trash");
      return;
    }

    const confirmTrash = window.confirm(
      `Are you sure you want to move ${selectedItems.size} item(s) to trash?`,
    );
    if (!confirmTrash) return;

    setBulkOperationLoading(true);
    try {
      const paths = Array.from(selectedItems);
      const response = await accountDocsAPI.bulkTrashItems({
        targetPaths: paths,
        trashedBy: "Admin",
      });

      if (response.data?.success) {
        toast.success(
          `${response.data.trashedItems?.length || selectedItems.size} item(s) moved to trash successfully`,
        );
        if (response.data.failedItems?.length > 0) {
          toast.warning(`${response.data.failedItems.length} item(s) failed`);
        }
        setSelectedItems(new Set());
        fetchFolderTree();
      } else {
        toast.error(response.data?.message || "Failed to trash items");
      }
    } catch (err) {
      console.error("Bulk trash error:", err);
      toast.error("Error moving items to trash: " + err.message);
    } finally {
      setBulkOperationLoading(false);
    }
  };

  // Bulk delete - Using accountDocsAPI
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to delete");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedItems.size} item(s)? This cannot be undone!`,
    );
    if (!confirmDelete) return;

    setBulkOperationLoading(true);
    try {
      const paths = Array.from(selectedItems);
      const response = await accountDocsAPI.bulkDeleteItems({ paths });

      if (response.data?.success) {
        toast.success(
          `${response.data.summary?.success || selectedItems.size} item(s) deleted successfully`,
        );
        if (response.data.errors?.length > 0) {
          toast.warning(
            `${response.data.errors.length} item(s) failed to delete`,
          );
        }
        setSelectedItems(new Set());
        fetchFolderTree();
      } else {
        toast.error(response.data?.message || "Failed to delete items");
      }
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast.error("Error deleting items: " + err.message);
    } finally {
      setBulkOperationLoading(false);
    }
  };

  // Bulk lock/unlock - Using accountDocsAPI
  const handleBulkLock = async (lockStatus) => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to lock/unlock");
      return;
    }

    setBulkOperationLoading(true);
    try {
      const paths = Array.from(selectedItems);
      const response = await accountDocsAPI.bulkSetReadOnly({
        paths,
        readOnly: lockStatus === "lock",
      });

      if (response.data?.success) {
        toast.success(
          `${response.data.summary?.success || selectedItems.size} item(s) ${lockStatus === "lock" ? "locked" : "unlocked"} successfully`,
        );
        setSelectedItems(new Set());
        fetchFolderTree();
        setBulkLockDialogOpen(false);
      } else {
        toast.error(
          response.data?.message || `Failed to ${lockStatus} items`,
        );
      }
    } catch (err) {
      console.error("Bulk lock error:", err);
      toast.error(`Error ${lockStatus}ing items`);
    } finally {
      setBulkOperationLoading(false);
    }
  };

  // Bulk download - Using accountDocsAPI
  const handleBulkDownload = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to download");
      return;
    }

    setBulkOperationLoading(true);
    try {
      const paths = Array.from(selectedItems);
      const response = await accountDocsAPI.downloadItems({ paths });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `selected_items_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (err) {
      console.error("Bulk download error:", err);
      toast.error("Failed to download items");
    } finally {
      setBulkOperationLoading(false);
    }
  };

  // Handle file click - Using accountDocsAPI to remove new tag
  const handleFileClick = async (fullPath, fileName, meta = {}) => {
    try {
      if (meta.readOnly) {
        alert("This file is locked and cannot be opened.");
        return;
      }

      if (
        meta.tags?.some((tag) => tag.isSystemTag && tag.tagName === "New")
      ) {
        await accountDocsAPI.removeNewTag({ filePath: fullPath });
        await fetchFolderTree();
      }

      const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}uploads/accounts/${fullPath}`;
      const extension = fileName.split(".").pop().toLowerCase();

      if (extension === "xls" || extension === "xlsx") {
        setSelectedFileUrl(fileUrl);
        setSelectedFileName(fileName);
        setOpenExcelDialog(true);
        return;
      }

      if (extension === "doc" || extension === "docx") {
        setSelectedFileUrl(fileUrl);
        setSelectedFileName(fileName);
        setOpenWordDialog(true);
        return;
      }

      if (extension === "txt") {
        const res = await fetch(fileUrl);
        const text = await res.text();
        setTextContent(text);
        setSelectedFileName(fileName);
        setOpenTextDialog(true);
        return;
      }

      setSelectedFileUrl(fileUrl);
      setSelectedFileName(fileName);
      setOpenFileViewer(true);
    } catch (error) {
      console.error("Error opening/downloading file:", error);
    }
  };

  // Toggle sign status
  const toggleSignStatus = async (item) => {
    try {
      const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts/${item.path}`;
      const fileName = item.name;
      const res = await fetch(
        `${SIGNATURE_API}api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}&accountId=${accountId}`,
      );
      const data = await res.json();
      console.log("token data", data);
      setToken(data.token);
      setShowBuilderFor(item);
      setOpenDialog(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel signature
  const cancelSignature = async (item) => {
    try {
      await axios.delete(
        `${SIGNATURE_API}signature/cancel/${item.meta.esignRequestId}`,
        {
          data: {
            folder: item.meta.folder,
            name: item.meta.name,
          },
        },
      );
      alert("Signature request cancelled.");
      fetchFolderTree();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel signature");
    }
  };

  // Toggle approval status
  const toggleApprovalStatus = (item) => {
    handleMenuClose();
    setSelectedItem(item);
    setOpenApprovalDialog(true);
  };

  // Handle cancel approval
  const handleCancelApproval = async (item) => {
    try {
      const res = await accountDocsAPI.toggleApproval({
        approvalId: item.meta?.approvalId,
        filePath: item.path,
        action: "cancel",
      });

      if (res.status === 200 || res.status === 201) {
        alert("Approval Request Cancelled");
        fetchFolderTree();
      } else {
        throw new Error("Cancel failed");
      }
    } catch (err) {
      alert("Cancel request failed");
    }
  };

  const FILE_URL = process.env.REACT_APP_FOLDER_MANAGEMENT;

  // Handle request approval
  const handleRequestApproval = async () => {
    if (!selectedItem) return;

    try {
      setSending(true);
      const fileUrl = `${FILE_URL}/uploads/accounts/${selectedItem.path}`;

      const payload = {
        filePath: selectedItem.path,
        action: "send",
        accountId,
        filename: selectedItem.name,
        fileUrl,
        clientEmail,
        description,
      };

      const res = await accountDocsAPI.toggleApproval(payload);

      if (res.status === 200 || res.status === 201) {
        alert(`Approval request sent to ${clientEmail}`);
        handleCloseDialog();
        fetchFolderTree();
      } else {
        throw new Error(res.data?.error || "Failed to send approval");
      }
    } catch (error) {
      console.error("Approval request failed:", error);
      alert("Failed to send approval.");
    } finally {
      setSending(false);
    }
  };

  // Handle invoice lock
  const toggleInvoiceLock = async (item) => {
    const filePath = item.path;
    const invoiceIds = item.meta?.invoiceLock || [];
    const isLocked = item.meta?.lockInvoiceStatus === "pendingpayment";

    if (isLocked) {
      if (!invoiceIds.length) {
        toast.error("No invoice mapped!");
        return;
      }

      try {
        await accountDocsAPI.lockUnlockInvoice({
          filePath,
          invoiceIds,
          action: "unlock",
        });
        toast.success("Invoice unlocked");
        fetchFolderTree();
      } catch (err) {
        toast.error("Unlock failed");
      }
      return;
    }

    try {
      const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);
      const pendingInvoices = res.data?.invoice || [];

      if (pendingInvoices.length === 0) {
        toast.info("No pending invoices available");
        return;
      }

      setInvoiceList(pendingInvoices);
      setSelectedDoc(item);
      setInvoiceDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (selectedInvoices.length === 0) {
      toast.warning("Select at least one invoice");
      return;
    }
    confirmInvoiceLock(selectedInvoices);
  };

  const confirmInvoiceLock = async (invoiceIds) => {
    try {
      await accountDocsAPI.lockUnlockInvoice({
        filePath: selectedDoc.path,
        invoiceIds,
        action: "lock",
      });
      toast.success("Invoice locked successfully");
      setInvoiceDialogOpen(false);
      fetchFolderTree();
    } catch (err) {
      toast.error("Lock failed");
      console.log(err);
    }
  };

  const handleCloseDialog = () => {
    setOpenApprovalDialog(false);
    setDescription("");
    setSelectedItem(null);
  };

  const handleDownload = async (item) => {
    try {
      const response = await accountDocsAPI.downloadItems({
        paths: item.path,
      });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf color="#d32f2f" size={18} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
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

  const formatUploadedAt = (dateValue) => {
    if (!dateValue) return "";
    if (
      typeof dateValue === "string" &&
      /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
    ) {
      return dateValue;
    }
    const date = new Date(dateValue);
    if (isNaN(date)) return dateValue;
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase()
      .replace(",", "")
      .replace(" ", "-");
  };

//   const getStatusChip = (meta, isFolder) => {
//     if (isFolder) return null;
//     const chips = [];

//     if (SIGN_STATUSES.includes(meta.signStatus)) {
//       let variant = "default";
//       if (meta.signStatus === "pendingSignature") variant = "warning";
//       if (meta.signStatus === "signatureCompleted") variant = "success";
//       chips.push(
//         <Badge key="signChip" variant={variant}>
//           {statusTextMap[meta.signStatus]}
//         </Badge>,
//       );
//     }

//     if (APPROVAL_STATUSES.includes(meta.authStatus)) {
//       let variant = "default";
//       if (meta.authStatus === "pendingApproval") variant = "warning";
//       if (meta.authStatus === "approvalCompleted") variant = "success";
//       if (meta.authStatus === "canceledApproval") variant = "destructive";

//       if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
//         chips.push(
//           <TooltipProvider key="approvalCanceledChip">
//             <Tooltip>
//               <TooltipTrigger>
//                 <Badge variant="destructive">Approval Canceled</Badge>
//               </TooltipTrigger>
//               <TooltipContent>{meta.cancelReason}</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>,
//         );
//       } else {
//         chips.push(
//           <Badge key="approvalChip" variant={variant}>
//             {approvalStatusTextMap[meta.authStatus]}
//           </Badge>,
//         );
//       }
//     }

//     if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
//       let variant = "default";
//       if (meta.lockInvoiceStatus === "pendingpayment") variant = "warning";
//       if (meta.lockInvoiceStatus === "paymentcompleted") variant = "success";
//       chips.push(
//         <Badge key="invoiceLockChip" variant={variant}>
//           {invoiceStatusTextMap[meta.lockInvoiceStatus]}
//         </Badge>,
//       );
//     }

//     if (chips.length === 0) return null;
//     return <div className="flex gap-1">{chips}</div>;
//   };
const getStatusChip = (meta, isFolder) => {
    if (isFolder) return null;
    const chips = [];

    if (SIGN_STATUSES.includes(meta.signStatus)) {
      chips.push(
        <Badge 
          key="signChip" 
          className={
            meta.signStatus === "pendingSignature" 
              ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
              : meta.signStatus === "signatureCompleted"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-500 hover:bg-slate-600 text-white"
          }
        >
          {statusTextMap[meta.signStatus]}
        </Badge>,
      );
    }

    if (APPROVAL_STATUSES.includes(meta.authStatus)) {
      if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
        chips.push(
          <TooltipProvider key="approvalCanceledChip">
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="destructive">Approval Canceled</Badge>
              </TooltipTrigger>
              <TooltipContent>{meta.cancelReason}</TooltipContent>
            </Tooltip>
          </TooltipProvider>,
        );
      } else {
        chips.push(
          <Badge 
            key="approvalChip"
            className={
              meta.authStatus === "pendingApproval"
                ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
                : meta.authStatus === "approvalCompleted"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
                : "bg-slate-500 hover:bg-slate-600 text-white"
            }
          >
            {approvalStatusTextMap[meta.authStatus]}
          </Badge>,
        );
      }
    }

    if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
      chips.push(
        <Badge 
          key="invoiceLockChip"
          className={
            meta.lockInvoiceStatus === "pendingpayment"
              ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
              : meta.lockInvoiceStatus === "paymentcompleted"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-500 hover:bg-slate-600 text-white"
          }
        >
          {invoiceStatusTextMap[meta.lockInvoiceStatus]}
        </Badge>,
      );
    }

    if (chips.length === 0) return null;
    return <div className="flex gap-1 flex-wrap">{chips}</div>;
  };
  const getFolderCounts = (folder) => {
    let fileCount = 0;
    let folderCount = 0;

    if (folder.children && folder.children.length > 0) {
      folder.children.forEach((child) => {
        if (child.type === "folder") {
          folderCount += 1;
          const subCounts = getFolderCounts(child);
          fileCount += subCounts.fileCount;
          folderCount += subCounts.folderCount;
        } else {
          fileCount += 1;
        }
      });
    }
    return { fileCount, folderCount };
  };

  const findNewSystemTag = (item) => {
    const newTag = item.meta?.tags?.find(
      (tag) => tag.isSystemTag && tag.tagName === "New",
    );
    if (newTag) return newTag;

    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        const childTag = findNewSystemTag(child);
        if (childTag) return childTag;
      }
    }
    return null;
  };

  const renderTableRows = (items, level = 0, parentPath = "") => {
    const sortedItems = [...items].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedItems.map((item) => {
      const fullPath = item.path;
      const meta = item.meta || {};
      const isFolder = item.type === "folder";
      const { folderCount, fileCount } = isFolder
        ? getFolderCounts(item)
        : { folderCount: 0, fileCount: 0 };
      const isSelected = selectedItems.has(fullPath);
      const isPartiallySelected = isFolder
        ? isFolderPartiallySelected(item)
        : false;
      const inheritedNewTag = isFolder ? findNewSystemTag(item) : null;

      const handleSafeFileClick = () => {
        if (meta.readOnly) {
          alert("This file is locked and cannot be opened.");
          return;
        }
        if (!isFolder) {
          handleFileClick(fullPath, item.name, meta);
        }
      };

      return (
        <React.Fragment key={fullPath}>
          <TableRow className={level % 2 === 0 ? "bg-muted/50" : "bg-background"}>
            <TableCell className="w-[50px] pl-2">
              {isFolder ? (
                <Checkbox
                  checked={isSelected}
                  data-indeterminate={isPartiallySelected}
                  onCheckedChange={() => handleFolderSelect(item)}
                />
              ) : (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelectItem(fullPath)}
                />
              )}
            </TableCell>

            <TableCell style={{ paddingLeft: level * 16 + 8 }}>
              <div className="flex items-center">
                {isFolder ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 mr-1"
                      onClick={() => toggleFolder(fullPath, meta.readOnly)}
                      disabled={meta.readOnly}
                    >
                      {expandedFolders[fullPath] ? (
                        <ChevronDown className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <span
                      className={`ml-0.5 font-medium text-sm cursor-pointer ${
                        meta.readOnly ? "text-muted-foreground" : ""
                      }`}
                      onClick={() => toggleFolder(fullPath, meta.readOnly)}
                    >
                      {item.name}
                      {inheritedNewTag && (
                        <Badge
                          className="ml-1 h-4 text-[0.7rem]"
                          style={{ backgroundColor: inheritedNewTag.tagColour }}
                        >
                          {inheritedNewTag.tagName}
                        </Badge>
                      )}
                      {meta.readOnly && (
                        <span className="ml-1 text-xs text-destructive">
                          (Locked)
                        </span>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mr-1">{getFileIcon(item.name)}</span>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm ${
                          meta.readOnly
                            ? "text-muted-foreground"
                            : "text-primary underline cursor-pointer"
                        }`}
                        onClick={handleSafeFileClick}
                      >
                        {item.name}
                        {meta.readOnly && (
                          <span className="ml-1 text-xs text-destructive">
                            (Locked)
                          </span>
                        )}
                        {meta.tags?.map((tag, index) => (
                          <Badge
                            key={index}
                            className="ml-1 h-4 text-[0.7rem]"
                            style={{ backgroundColor: tag.tagColour || "#e0e0e0" }}
                          >
                            {tag.tagName}
                          </Badge>
                        ))}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-xs text-muted-foreground ml-1">
                ({folderCount} folders, {fileCount} files)
              </span>
            </TableCell>
            <TableCell>
              <div className="mt-0.5">{getStatusChip(meta, isFolder)}</div>
            </TableCell>
            <TableCell>
              <span className="text-xs font-medium">
                {formatUploadedAt(meta.uploadedAt)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-xs font-medium">{meta.uploadedBy}</span>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>

          {isFolder &&
            expandedFolders[fullPath] &&
            item.children &&
            item.children.length > 0 &&
            renderTableRows(item.children, level + 1, fullPath)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Action Buttons */}
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[600px] w-full mx-auto mb-6">
          <Button
            variant="default"
            className="w-full shadow-sm hover:shadow-md transition-shadow"
            onClick={() => {
              setNewFolderDrawerOpen(true);
              handleMenuClose();
            }}
          >
            <FolderIcon className="mr-2 h-4 w-4" />
            Create Folder
          </Button>

          <Button
            variant="default"
            className="w-full shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setFileUploadDrawerOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>

          <Button
            variant="default"
            className="w-full shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setFolderUploaDrawerOpen(true)}
          >
            <FolderUp className="mr-2 h-4 w-4" />
            Upload Folder
          </Button>
        </div>

        {/* Bulk Operations Toolbar */}
        {selectedItems.size > 0 && (
          <Card className="mb-6 bg-primary/5 border-primary/20 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="font-semibold text-sm">
                  {selectedItems.size} item(s) selected
                </span>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkMoveDrawerOpen(true)}
                    disabled={bulkOperationLoading}
                    className="shadow-sm"
                  >
                    <Move className="mr-1 h-4 w-4" />
                    Move
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkLockDialogOpen(true)}
                    disabled={bulkOperationLoading}
                    className="shadow-sm"
                  >
                    <Lock className="mr-1 h-4 w-4" />
                    Lock/Unlock
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkTrash}
                    disabled={bulkOperationLoading}
                    className="shadow-sm"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleBulkDownload}
                    disabled={bulkOperationLoading}
                    className="shadow-sm"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedItems(new Set())}
                    disabled={bulkOperationLoading}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Drawers - Keep as is */}
        <FileUploadDrawer
          isOpen={fileUploadDrawerOpen}
          onClose={() => setFileUploadDrawerOpen(false)}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(accountId)}
          accountId={accountId}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <CreateFolderDrawer
          isOpen={newFolderDrawerOpen}
          onClose={() => {
            setNewFolderDrawerOpen(false);
          }}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(accountId)}
          accountId={accountId}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <FolderUploadDrawer
          isOpen={folderUploaDrawerOpen}
          onClose={() => setFolderUploaDrawerOpen(false)}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(accountId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <MoveDrawer
          isOpen={moveDrawerOpen}
          onClose={() => {
            setMoveDrawerOpen(false);
          }}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(accountId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <RenameDrawer
          isOpen={renameDrawer}
          onClose={() => {
            SetRenameDrawer(false);
          }}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(accountId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <MoveDrawer
          isOpen={bulkMoveDrawerOpen}
          onClose={() => setBulkMoveDrawerOpen(false)}
          folderTree={folderTree}
          fetchFolderTree={fetchFolderTree}
          isBulkOperation={true}
          selectedPaths={Array.from(selectedItems)}
          onMoveComplete={(targetPath) => {
            console.log("Bulk move completed to:", targetPath);
            setSelectedItems(new Set());
          }}
        />
      </div>

      {/* Folder Explorer */}
      <Card className="mt-6 shadow-lg border-0">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-primary" />
            Folder Explorer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {folderTree && folderTree.length > 0 ? (
            <div className="overflow-auto rounded-lg">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-b-2">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectAll}
                        data-indeterminate={selectedItems.size > 0 && !selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Content</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Uploaded</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows(folderTree)}</TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <FolderIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No folders or files found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Lock Dialog */}
      <Dialog open={bulkLockDialogOpen} onOpenChange={setBulkLockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Lock/Unlock Selected Items</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Do you want to lock or unlock the {selectedItems.size} selected
              item(s)?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setBulkLockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkLock("unlock")}
              disabled={bulkOperationLoading}
            >
              Unlock
            </Button>
            <Button
              onClick={() => handleBulkLock("lock")}
              variant="default"
              disabled={bulkOperationLoading}
            >
              Lock
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Docuseal Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">{selectedFolderForMenu?.name || "Document"}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto flex-1 min-h-0 p-6 pt-2">
            {token && showBuilderFor && (
              <DocusealBuilder
                token={token}
                customCss={/* Your custom CSS */ ""}
                onComplete={() => {
                  console.log("DocuSeal finished sending document");
                  setShowBuilderFor(null);
                  setOpenDialog(false);
                }}
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={() => setOpenDialog(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={openApprovalDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Request Approval</DialogTitle>
            <DialogDescription>
              Send an approval request for this document
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type a short description or note..."
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleRequestApproval}
              disabled={!description.trim() || sending}
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {menuAnchorEl && selectedFolderForMenu && (
        <div
          className="fixed inset-0 z-50"
          onClick={handleMenuClose}
          onContextMenu={(e) => {
            e.preventDefault();
            handleMenuClose();
          }}
        >
          <div
            className="absolute z-50 min-w-[200px] rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
            style={{
              top: menuAnchorEl.getBoundingClientRect().bottom,
              left: menuAnchorEl.getBoundingClientRect().left,
            }}
          >
            {(() => {
              const item = selectedFolderForMenu;
              const isFolder = item.type === "folder";
              const isLocked = item?.meta?.readOnly === true;

              const path = item.path.toLowerCase();
              let docType = "client";
              if (path.includes("firm")) docType = "firm";
              if (path.includes("private")) docType = "private";
              const PROTECTED_FOLDERS = [
                "Client Uploaded Documents",
                "Firm Documents Shared with Client",
                "Private",
              ];
              const isProtectedFolder =
                isFolder && PROTECTED_FOLDERS.includes(item.name);

              const menuItems = [];

              if (isFolder) {
                if (docType === "client") {
                  menuItems.push(
                    {
                      icon: <FolderIcon className="mr-2 h-4 w-4" />,
                      label: "New Folder",
                      action: () => setNewFolderDrawerOpen(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Edit",
                      action: () => SetRenameDrawer(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Move",
                      action: () => setMoveDrawerOpen(true),
                    },
                    {
                      icon: <Trash2 className="mr-2 h-4 w-4" />,
                      label: "Delete",
                      action: () => trashItem(item),
                      disabled: isProtectedFolder,
                    },
                    {
                      icon: <Download className="mr-2 h-4 w-4" />,
                      label: "Download",
                      action: () => handleDownload(item),
                    },
                    {
                      icon: <Upload className="mr-2 h-4 w-4" />,
                      label: "New File",
                      action: () => setFileUploadDrawerOpen(true),
                    },
                    {
                      icon: <FolderUp className="mr-2 h-4 w-4" />,
                      label: "Upload Folder",
                      action: () => setFolderUploaDrawerOpen(true),
                    },
                    {
                      icon: isLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />,
                      label: isLocked ? "Unlock" : "Lock",
                      action: () => toggleReadOnly(item),
                    },
                  );
                } else if (docType === "firm") {
                  menuItems.push(
                    {
                      icon: <FolderIcon className="mr-2 h-4 w-4" />,
                      label: "New Folder",
                      action: () => setNewFolderDrawerOpen(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Edit",
                      action: () => SetRenameDrawer(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Move",
                      action: () => setMoveDrawerOpen(true),
                    },
                    {
                      icon: <Upload className="mr-2 h-4 w-4" />,
                      label: "New File",
                      action: () => setFileUploadDrawerOpen(true),
                    },
                    {
                      icon: <Download className="mr-2 h-4 w-4" />,
                      label: "Download",
                      action: () => handleDownload(item),
                    },
                    {
                      icon: <FolderUp className="mr-2 h-4 w-4" />,
                      label: "Upload Folder",
                      action: () => setFolderUploaDrawerOpen(true),
                    },
                    {
                      icon: <Trash2 className="mr-2 h-4 w-4" />,
                      label: "Delete",
                      action: () => trashItem(item),
                      disabled: isProtectedFolder,
                    },
                  );
                } else if (docType === "private") {
                  menuItems.push(
                    {
                      icon: <FolderIcon className="mr-2 h-4 w-4" />,
                      label: "New Folder",
                      action: () => setNewFolderDrawerOpen(true),
                    },
                    {
                      icon: <Upload className="mr-2 h-4 w-4" />,
                      label: "New File",
                      action: () => setFileUploadDrawerOpen(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Move",
                      action: () => setMoveDrawerOpen(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Edit",
                      action: () => SetRenameDrawer(true),
                    },
                    {
                      icon: <Trash2 className="mr-2 h-4 w-4" />,
                      label: "Delete",
                      action: () => trashItem(item),
                      disabled: isProtectedFolder,
                    },
                    {
                      icon: <Download className="mr-2 h-4 w-4" />,
                      label: "Download",
                      action: () => handleDownload(item),
                    },
                  );
                }
              } else {
                if (docType === "client") {
                  menuItems.push(
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Edit",
                      action: () => SetRenameDrawer(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Move",
                      action: () => setMoveDrawerOpen(true),
                    },
                    {
                      icon: isLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />,
                      label: isLocked ? "Unlock" : "Lock",
                      action: () => toggleReadOnly(item),
                    },
                    {
                      icon: <Trash2 className="mr-2 h-4 w-4" />,
                      label: "Delete",
                      action: () => trashItem(item),
                    },
                    {
                      icon: <Download className="mr-2 h-4 w-4" />,
                      label: "Download",
                      action: () => handleDownload(item),
                    },
                  );
                } else if (docType === "firm") {
                  const currentStatus =
                    item.meta?.signStatus || "sendForSignature";
                  const approvalStatus =
                    item.meta?.authStatus || "sendForApproval";
                  const invoiceStatus = item.meta?.lockInvoiceStatus;

                  const isSignatureDisabled =
                    currentStatus === "pendingSignature" ||
                    currentStatus === "signatureCompleted";

                  const isApprovalCompleted =
                    approvalStatus === "approvalCompleted";
                  const isApprovalCanceled =
                    approvalStatus === "canceledApproval";

                  let invoiceLabel = "Lock Invoice";
                  if (invoiceStatus === "pendingpayment")
                    invoiceLabel = "Unlock Invoice";
                  if (invoiceStatus === "paymentcompleted" || !invoiceStatus)
                    invoiceLabel = "Lock Invoice";

                  menuItems.push(
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Edit",
                      action: () => SetRenameDrawer(true),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Move",
                      action: () => setMoveDrawerOpen(true),
                    },
                  );

                  if (currentStatus === "pendingSignature") {
                    menuItems.push({
                      icon: <XCircle className="mr-2 h-4 w-4" />,
                      label: "Cancel Signature Request",
                      action: () => cancelSignature(item),
                    });
                  } else {
                    menuItems.push({
                      icon: <PenTool className="mr-2 h-4 w-4" size={16} />,
                      label: statusTextMap[currentStatus],
                      action: () => toggleSignStatus(item),
                      disabled: isSignatureDisabled,
                    });
                  }

                  if (approvalStatus === "sendForApproval") {
                    menuItems.push({
                      icon: <Stamp className="mr-2 h-4 w-4" size={16} />,
                      label: "Send For Approval",
                      action: () => toggleApprovalStatus(item),
                    });
                  }

                  if (approvalStatus === "pendingApproval") {
                    menuItems.push({
                      icon: <XCircle className="mr-2 h-4 w-4" />,
                      label: "Cancel Approval Request",
                      action: () => handleCancelApproval(item),
                    });
                  }

                  if (isApprovalCompleted) {
                    menuItems.push({
                      icon: <Stamp className="mr-2 h-4 w-4" size={16} />,
                      label: "Approved",
                      disabled: true,
                    });
                  }

                  if (isApprovalCanceled) {
                    menuItems.push({
                      icon: <Stamp className="mr-2 h-4 w-4" size={16} />,
                      label: "Approval Canceled",
                      disabled: true,
                    });
                  }

                  menuItems.push({
                    icon: invoiceStatus === "pendingpayment" ? (
                      <Unlock className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    ),
                    label: invoiceLabel,
                    action: () => toggleInvoiceLock(item),
                  });

                  menuItems.push({
                    icon: <Trash2 className="mr-2 h-4 w-4" />,
                    label: "Delete",
                    action: () => trashItem(item),
                  });
                  menuItems.push({
                    icon: <Download className="mr-2 h-4 w-4" />,
                    label: "Download",
                    action: () => handleDownload(item),
                  });
                } else if (docType === "private") {
                  menuItems.push(
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Edit",
                      action: () => SetRenameDrawer(true),
                    },
                    {
                      icon: <Trash2 className="mr-2 h-4 w-4" />,
                      label: "Delete",
                      action: () => trashItem(item),
                    },
                    {
                      icon: <Download className="mr-2 h-4 w-4" />,
                      label: "Download",
                      action: () => handleDownload(item),
                    },
                    {
                      icon: <Move className="mr-2 h-4 w-4" />,
                      label: "Move",
                      action: () => setMoveDrawerOpen(true),
                    },
                  );
                }
              }

              return menuItems.map(({ icon, label, action, disabled }) => (
                <button
                  key={label}
                  className={`flex w-full items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  disabled={disabled}
                  onClick={() => {
                    action?.();
                    handleMenuClose();
                  }}
                >
                  {icon}
                  {label}
                </button>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Invoice Dialog */}
      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Invoices To Lock</DialogTitle>
            <DialogDescription>
              Choose invoices to associate with this document
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto flex-1">
            {invoiceList.length === 0 && (
              <div className="text-center text-muted-foreground p-8">
                No invoices found
              </div>
            )}
            <div className="overflow-x-auto mt-1">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-[60px]">Select</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoiceList.map((inv) => {
                      const id = inv._id;
                      const checked = selectedInvoices.includes(id);

                      return (
                        <TableRow
                          key={id}
                          className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                            checked ? "bg-primary/5" : ""
                          }`}
                          onClick={() => {
                            setSelectedInvoices((prev) => {
                              const updated = prev.includes(id)
                                ? prev.filter((x) => x !== id)
                                : [...prev, id];
                              console.log("Selected invoices:", updated);
                              return updated;
                            });
                          }}
                        >
                          <TableCell>
                            <Checkbox checked={checked} />
                          </TableCell>
                          <TableCell className="font-medium">{inv.invoicenumber}</TableCell>
                          <TableCell>{inv.description || "—"}</TableCell>
                          <TableCell>
                            {new Date(inv.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{inv.summary?.total?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Lock Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Viewer Dialog */}
      <Dialog open={openFileViewer} onOpenChange={setOpenFileViewer}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl truncate">{selectedFileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 bg-muted rounded-b-lg overflow-hidden">
            <iframe
              src={selectedFileUrl}
              title="File Preview"
              className="w-full h-full border-0"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={() => setOpenFileViewer(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogContent>
      </Dialog>

      {/* Word Viewer Dialog */}
      <Dialog open={openWordDialog} onOpenChange={setOpenWordDialog}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl truncate">{selectedFileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedFileUrl)}`}
              className="w-full h-[600px] border-0 rounded-lg"
              title="Word Viewer"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Text Viewer Dialog */}
      <Dialog open={openTextDialog} onOpenChange={setOpenTextDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl truncate">{selectedFileName}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 border rounded-lg p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {textContent}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Excel Viewer Dialog */}
      <Dialog open={openExcelDialog} onOpenChange={setOpenExcelDialog}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl truncate">{selectedFileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedFileUrl)}`}
              className="w-full h-[600px] border-0 rounded-lg"
              title="Excel Viewer"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};