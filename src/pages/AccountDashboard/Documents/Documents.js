// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   Menu,
//   MenuItem,
//   FormControl,
//   Alert,
//   Select,
//   CircularProgress,
//   InputLabel,
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
// import { useParams } from "react-router-dom";
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

// const DocsFolderTree = () => {
//   const { accountId } = useParams();
//   console.log("account id for the documentation", accountId);
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   console.log("selected template", selectedTemplate);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [sending, setSending] = useState(false);
//   // Fetch templates list - Using folderManagementAPI
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await folderManagementAPI.getFolderTemplates();
//         setTemplates(res.data.folderTemplates || []);
//       } catch (err) {
//         setError("Failed to fetch templates");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, []);

//   const applyTemplateToAccount = () => {
//     console.log("ghjh");

//     const payload = {
//       accountId: accountId,
//       templateId: selectedTemplate || null,
//     };

//     console.log("applyTemplateToAccount payload:", payload);

//     docAPI
//       .applyTemplateToAccount(payload)
//       .then((res) => {
//         console.log("API response:", res.data);

//         // alert("Folder Template Assign Successfully");
//         toast.success("Folder Template Assign Successfully");
//         setSelectedTemplate("");
//       })
//       .catch((error) => {
//         console.error("Error applying template:", error);
//         toast.error("Failed to Assign Folder Template");
//         alert("Failed to Assign Folder Template");
//       });
//   };

//   const FolderTreeView = ({ accountId }) => {
//     const [clientEmail, setClientEmail] = useState("");
//     const [expandedFolders, setExpandedFolders] = useState({});
//     const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//     const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
//     const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
//     const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
//     const [renameDrawer, SetRenameDrawer] = useState(null);
//     const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
//     const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
//     const [description, setDescription] = useState("");
//     const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
//     const [folderTree, setFolderTree] = useState([]);
//     const [selectedItem, setSelectedItem] = useState("");
//     const [token, setToken] = useState("");
//     const [showBuilderFor, setShowBuilderFor] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedItems, setSelectedItems] = useState(new Set());
//     const [selectAll, setSelectAll] = useState(false);
//     const [bulkMoveDrawerOpen, setBulkMoveDrawerOpen] = useState(false);
//     const [bulkLockDialogOpen, setBulkLockDialogOpen] = useState(false);
//     const [bulkOperationLoading, setBulkOperationLoading] = useState(false);
//     const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
//     const [selectedFileUrl, setSelectedFileUrl] = useState("");
//     const [selectedFileName, setSelectedFileName] = useState("");
//     const [openFileViewer, setOpenFileViewer] = useState(false);
//     const [openExcelDialog, setOpenExcelDialog] = useState(false);
//     const [openWordDialog, setOpenWordDialog] = useState(false);
//     const [openTextDialog, setOpenTextDialog] = useState(false);
//     const [textContent, setTextContent] = useState("");
//     const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
//     const [selectedDoc, setSelectedDoc] = useState(null);
//     const [invoiceList, setInvoiceList] = useState([]);
//     const [selectedInvoices, setSelectedInvoices] = useState([]);
//     const [emails, setEmails] = useState([]);

//     const SIGN_STATUSES = [
//       "sendForSignature",
//       "pendingSignature",
//       "signatureCompleted",
//     ];

//     const statusTextMap = {
//       sendForSignature: "Send for Sign",
//       pendingSignature: "Waiting for Signature",
//       signatureCompleted: "Signature Received",
//     };

//     const INVOICE_LOCK_STATUSES = ["pendingpayment", "paymentcompleted"];

//     const invoiceStatusTextMap = {
//       pendingpayment: "Pending Payment",
//       paymentcompleted: "Payment Completed",
//     };

//     const APPROVAL_STATUSES = [
//       "sendForApproval",
//       "pendingApproval",
//       "canceledApproval",
//       "approvalCompleted",
//     ];

//     const approvalStatusTextMap = {
//       sendForApproval: "Send for Approval",
//       pendingApproval: "Waiting for Approval",
//       canceledApproval: "Canceled Approval",
//       approvalCompleted: "Approval Completed",
//     };

//     const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;

//     // Fetch account details - Using accountsAPI
    // const fetchAccountDetails = async () => {
    //   try {
    //     const res = await accountsAPI.getAccountById(accountId);
    //     console.log("accounts details", res.data);
    //     const email = res.data?.contacts?.[0]?.contact?.email;
    //     setClientEmail(email);
    //     console.log("Client Email:", email);
    //   } catch (err) {
    //     console.error("Error fetching account details:", err);
    //   }
    // };

//     // Fetch folder tree - Using accountDocsAPI
//     const fetchFolderTree = async () => {
//       try {
//         const res = await accountDocsAPI.listFoldersAndFiles(accountId);
//         console.log("Folder tree data:", res?.data?.contents);
//         setFolderTree(res?.data?.contents || []);
//       } catch (err) {
//         console.error(err);
//         console.log("error list",err)
//         setError("Error fetching folder tree");
//       }
//     };

//     // Fetch emails - Using accountsAPI
//     const fetchEmails = async () => {
//       try {
//         const res = await accountsAPI.getAccountContactEmails(accountId);
//         setEmails(res.data.emails);
//         console.log("Fetched emails:", res.data.emails);
//       } catch (err) {
//         console.error("Error fetching emails:", err);
//       }
//     };

//     // Fetch invoices - Using API call (if you have an invoice API, use that)
//     const fetchInvoices = async () => {
//       try {
//         const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);

//         const invoices = res.data?.invoice || [];

//         setInvoiceList(invoices);
//       } catch (err) {
//         console.error("Error fetching invoices", err);
//       }
//     };

//     useEffect(() => {
//       if (accountId) {
//         fetchAccountDetails();
//         fetchFolderTree();
//         fetchEmails();
//       }
//     }, [accountId]);

//     useEffect(() => {
//       if (invoiceDialogOpen) fetchInvoices();
//     }, [invoiceDialogOpen]);

//     // Helper functions
//     const getAllChildrenPaths = (item) => {
//       const paths = [item.path];
//       if (item.children && item.children.length > 0) {
//         item.children.forEach((child) => {
//           paths.push(...getAllChildrenPaths(child));
//         });
//       }
//       return paths;
//     };

//     const handleSelectItem = (path) => {
//       setSelectedItems((prev) => {
//         const newSet = new Set(prev);
//         if (newSet.has(path)) {
//           newSet.delete(path);
//         } else {
//           newSet.add(path);
//         }
//         return newSet;
//       });
//     };

//     const handleFolderSelect = (item) => {
//       const allChildPaths = getAllChildrenPaths(item);
//       setSelectedItems((prev) => {
//         const newSet = new Set(prev);
//         const allSelected = allChildPaths.every((path) => newSet.has(path));
//         if (allSelected) {
//           allChildPaths.forEach((path) => newSet.delete(path));
//         } else {
//           allChildPaths.forEach((path) => newSet.add(path));
//         }
//         return newSet;
//       });
//     };

//     const isFolderPartiallySelected = (item) => {
//       const allChildPaths = getAllChildrenPaths(item);
//       const selectedCount = allChildPaths.filter((path) =>
//         selectedItems.has(path),
//       ).length;
//       return selectedCount > 0 && selectedCount < allChildPaths.length;
//     };

//     const handleSelectAll = () => {
//       if (selectAll) {
//         setSelectedItems(new Set());
//       } else {
//         const allPaths = new Set();
//         const collectPaths = (items) => {
//           items.forEach((item) => {
//             allPaths.add(item.path);
//             if (item.children && item.children.length > 0) {
//               collectPaths(item.children);
//             }
//           });
//         };
//         collectPaths(folderTree);
//         setSelectedItems(allPaths);
//       }
//       setSelectAll(!selectAll);
//     };

//     const toggleFolder = (path, isReadOnly) => {
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

//     // Update status - Using accountDocsAPI
//     const updateStatus = async (
//       item,
//       statusType,
//       newValue,
//       approvalId = null,
//       esignRequestId = null,
//     ) => {
//       try {
//         if (!item?.path) return alert("Invalid item selected");

//         const body = {
//           targetPath: item.path,
//           status: {
//             [statusType]: newValue,
//             ...(approvalId && { approvalId }),
//             ...(esignRequestId && { esignRequestId }),
//           },
//         };

//         const res = await accountDocsAPI.updateStatus(body);

//         if (res.status === 200 || res.status === 201) {
//           toast.success(res.data.message || "Status updated successfully");
//           fetchFolderTree();
//         } else {
//           toast.error(res.data.error || "Failed to update status");
//         }
//       } catch (err) {
//         console.error("Error updating status:", err);
//         toast.error("Error updating status");
//       }
//     };

//     // Toggle read-only - Using accountDocsAPI
//     const toggleReadOnly = async (item) => {
//       try {
//         const newStatus = !item.meta.readOnly;

//         const body =
//           item.type === "folder"
//             ? { folderPath: item.path, readOnly: newStatus }
//             : { filePath: item.path, readOnly: newStatus };

//         const res =
//           item.type === "folder"
//             ? await accountDocsAPI.setFolderReadOnly(body)
//             : await accountDocsAPI.setFileReadOnly(body);

//         if (res.status === 200 || res.status === 201) {
//           fetchFolderTree();
//           if (item.type === "folder" && newStatus) {
//             setExpandedFolders((prev) => {
//               const updated = { ...prev };
//               delete updated[item.path];
//               return updated;
//             });
//           }
//           handleMenuClose();
//           toast.success(res.data.message || "Updated successfully");
//         } else {
//           toast.error("Error: " + (res.data.error || "Failed to update"));
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to update read-only status");
//       }
//     };

//     // Trash item - Using accountDocsAPI
//     const trashItem = async (item) => {
//       if (!item?.path) return alert("Invalid path");
//       const confirmTrash = window.confirm(
//         `Are you sure you want to move "${item.name}" to Trash?`,
//       );
//       if (!confirmTrash) return;

//       try {
//         const response = await accountDocsAPI.trashItem({
//           targetPath: item.path,
//           trashedBy: "Admin",
//         });

//         if (response.data?.success) {
//           toast.success(response.data.message || "Moved to trash");
//           setTimeout(() => {
//             fetchFolderTree();
//           }, 500);
//         } else {
//           toast.error(response.data?.message || "Failed to move to trash");
//         }
//       } catch (err) {
//         console.error("Error trashing item:", err);
//         toast.error("Error moving item to trash");
//       }
//       handleMenuClose();
//     };

//     // Delete item - Using accountDocsAPI
//     const deleteItem = async (item) => {
//       if (!item?.path) return alert("Invalid path");
//       const confirmDelete = window.confirm(
//         `Are you sure you want to delete "${item.name}"? This cannot be undone!`,
//       );
//       if (!confirmDelete) return;

//       try {
//         const response = await accountDocsAPI.deleteItem({
//           targetPath: item.path,
//         });

//         if (response.data?.success) {
//           toast.success(response.data.message);
//           setTimeout(() => {
//             fetchFolderTree();
//           }, 800);
//         } else {
//           toast.error(response.data?.message || "Failed to delete");
//         }
//       } catch (err) {
//         console.error("Error deleting item:", err);
//         toast.error("Error deleting file or folder");
//       }
//       handleMenuClose();
//     };

//     // Bulk trash - Using accountDocsAPI
//     const handleBulkTrash = async () => {
//       if (selectedItems.size === 0) {
//         toast.warning("Please select items to move to trash");
//         return;
//       }

//       const confirmTrash = window.confirm(
//         `Are you sure you want to move ${selectedItems.size} item(s) to trash?`,
//       );
//       if (!confirmTrash) return;

//       setBulkOperationLoading(true);
//       try {
//         const paths = Array.from(selectedItems);
//         const response = await accountDocsAPI.bulkTrashItems({
//           targetPaths: paths,
//           trashedBy: "Admin",
//         });

//         if (response.data?.success) {
//           toast.success(
//             `${response.data.trashedItems?.length || selectedItems.size} item(s) moved to trash successfully`,
//           );
//           if (response.data.failedItems?.length > 0) {
//             toast.warning(`${response.data.failedItems.length} item(s) failed`);
//           }
//           setSelectedItems(new Set());
//           fetchFolderTree();
//         } else {
//           toast.error(response.data?.message || "Failed to trash items");
//         }
//       } catch (err) {
//         console.error("Bulk trash error:", err);
//         toast.error("Error moving items to trash: " + err.message);
//       } finally {
//         setBulkOperationLoading(false);
//       }
//     };

//     // Bulk delete - Using accountDocsAPI
//     const handleBulkDelete = async () => {
//       if (selectedItems.size === 0) {
//         toast.warning("Please select items to delete");
//         return;
//       }

//       const confirmDelete = window.confirm(
//         `Are you sure you want to delete ${selectedItems.size} item(s)? This cannot be undone!`,
//       );
//       if (!confirmDelete) return;

//       setBulkOperationLoading(true);
//       try {
//         const paths = Array.from(selectedItems);
//         const response = await accountDocsAPI.bulkDeleteItems({ paths });

//         if (response.data?.success) {
//           toast.success(
//             `${response.data.summary?.success || selectedItems.size} item(s) deleted successfully`,
//           );
//           if (response.data.errors?.length > 0) {
//             toast.warning(
//               `${response.data.errors.length} item(s) failed to delete`,
//             );
//           }
//           setSelectedItems(new Set());
//           fetchFolderTree();
//         } else {
//           toast.error(response.data?.message || "Failed to delete items");
//         }
//       } catch (err) {
//         console.error("Bulk delete error:", err);
//         toast.error("Error deleting items: " + err.message);
//       } finally {
//         setBulkOperationLoading(false);
//       }
//     };

//     // Bulk lock/unlock - Using accountDocsAPI
//     const handleBulkLock = async (lockStatus) => {
//       if (selectedItems.size === 0) {
//         toast.warning("Please select items to lock/unlock");
//         return;
//       }

//       setBulkOperationLoading(true);
//       try {
//         const paths = Array.from(selectedItems);
//         const response = await accountDocsAPI.bulkSetReadOnly({
//           paths,
//           readOnly: lockStatus === "lock",
//         });

//         if (response.data?.success) {
//           toast.success(
//             `${response.data.summary?.success || selectedItems.size} item(s) ${lockStatus === "lock" ? "locked" : "unlocked"} successfully`,
//           );
//           setSelectedItems(new Set());
//           fetchFolderTree();
//           setBulkLockDialogOpen(false);
//         } else {
//           toast.error(
//             response.data?.message || `Failed to ${lockStatus} items`,
//           );
//         }
//       } catch (err) {
//         console.error("Bulk lock error:", err);
//         toast.error(`Error ${lockStatus}ing items`);
//       } finally {
//         setBulkOperationLoading(false);
//       }
//     };

//     // Bulk download - Using accountDocsAPI
//     const handleBulkDownload = async () => {
//       if (selectedItems.size === 0) {
//         toast.warning("Please select items to download");
//         return;
//       }

//       setBulkOperationLoading(true);
//       try {
//         const paths = Array.from(selectedItems);
//         const response = await accountDocsAPI.downloadItems({ paths });

//         // Handle blob response
//         const blob = response.data;
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `selected_items_${new Date().getTime()}.zip`;
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//         toast.success("Download started");
//       } catch (err) {
//         console.error("Bulk download error:", err);
//         toast.error("Failed to download items");
//       } finally {
//         setBulkOperationLoading(false);
//       }
//     };

//     // Handle file click - Using accountDocsAPI to remove new tag
//     const handleFileClick = async (fullPath, fileName, meta = {}) => {
//       try {
//         if (meta.readOnly) {
//           alert("This file is locked and cannot be opened.");
//           return;
//         }

//         // Remove "New" tag if present
//         if (
//           meta.tags?.some((tag) => tag.isSystemTag && tag.tagName === "New")
//         ) {
//           await accountDocsAPI.removeNewTag({ filePath: fullPath });
//           await fetchFolderTree();
//         }

//         const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}uploads/accounts/${fullPath}`;
//         const extension = fileName.split(".").pop().toLowerCase();

//         if (extension === "xls" || extension === "xlsx") {
//           setSelectedFileUrl(fileUrl);
//           setSelectedFileName(fileName);
//           setOpenExcelDialog(true);
//           return;
//         }

//         if (extension === "doc" || extension === "docx") {
//           setSelectedFileUrl(fileUrl);
//           setSelectedFileName(fileName);
//           setOpenWordDialog(true);
//           return;
//         }

//         if (extension === "txt") {
//           const res = await fetch(fileUrl);
//           const text = await res.text();
//           setTextContent(text);
//           setSelectedFileName(fileName);
//           setOpenTextDialog(true);
//           return;
//         }

//         setSelectedFileUrl(fileUrl);
//         setSelectedFileName(fileName);
//         setOpenFileViewer(true);
//       } catch (error) {
//         console.error("Error opening/downloading file:", error);
//       }
//     };

//     // Toggle sign status
//     const toggleSignStatus = async (item) => {
//       try {
//         const fileUrl = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts/${item.path}`;
//         const fileName = item.name;
//         const res = await fetch(
//           `${SIGNATURE_API}/api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}&accountId=${accountId}`,
//         );
//         const data = await res.json();
//         console.log("token data", data);
//         setToken(data.token);
//         setShowBuilderFor(item);
//         setOpenDialog(true);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     // Cancel signature
//     const cancelSignature = async (item) => {
//       try {
//         await axios.delete(
//           `${SIGNATURE_API}/signature/cancel/${item.meta.esignRequestId}`,
//           {
//             data: {
//               folder: item.meta.folder,
//               name: item.meta.name,
//             },
//           },
//         );
//         alert("Signature request cancelled.");
//         fetchFolderTree();
//       } catch (err) {
//         console.error(err);
//         alert("Failed to cancel signature");
//       }
//     };

//     // Toggle approval status
//     const toggleApprovalStatus = (item) => {
//       handleMenuClose();
//       setSelectedItem(item);
//       setOpenApprovalDialog(true);
//     };

//     // Handle cancel approval
//     const handleCancelApproval = async (item) => {
//       try {
//         const res = await accountDocsAPI.toggleApproval({
//           approvalId: item.meta?.approvalId,
//           filePath: item.path,
//           action: "cancel",
//         });

//         if (res.status === 200 || res.status === 201) {
//           alert("Approval Request Cancelled");
//           fetchFolderTree();
//         } else {
//           throw new Error("Cancel failed");
//         }
//       } catch (err) {
//         alert("Cancel request failed");
//       }
//     };
//     const FILE_URL = process.env.REACT_APP_FOLDER_MANAGEMENT;
//     // Handle request approval
//     const handleRequestApproval = async () => {
//       if (!selectedItem) return;

//       try {
//         setSending(true);
//         const fileUrl = `${FILE_URL}/uploads/accounts/${selectedItem.path}`;

//         const payload = {
//           filePath: selectedItem.path,
//           action: "send",
//           accountId,
//           filename: selectedItem.name,
//           fileUrl,
//           clientEmail,
//           description,
//         };

//         const res = await accountDocsAPI.toggleApproval(payload);

//         if (res.status === 200 || res.status === 201) {
//           alert(`Approval request sent to ${clientEmail}`);
//           handleCloseDialog();
//           fetchFolderTree();
//         } else {
//           throw new Error(res.data?.error || "Failed to send approval");
//         }
//       } catch (error) {
//         console.error("Approval request failed:", error);
//         alert("Failed to send approval.");
//       } finally {
//         setSending(false);
//       }
//     };

//     // Handle invoice lock
//     const toggleInvoiceLock = async (item) => {
//       const filePath = item.path;
//       const invoiceIds = item.meta?.invoiceLock || [];
//       const isLocked = item.meta?.lockInvoiceStatus === "pendingpayment";

//       if (isLocked) {
//         if (!invoiceIds.length) {
//           toast.error("No invoice mapped!");
//           return;
//         }

//         try {
//           await accountDocsAPI.lockUnlockInvoice({
//             filePath,
//             invoiceIds,
//             action: "unlock",
//           });
//           toast.success("Invoice unlocked");
//           fetchFolderTree();
//         } catch (err) {
//           toast.error("Unlock failed");
//         }
//         return;
//       }

//       try {
//         const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);

//         const pendingInvoices = res.data?.invoice || [];

//         if (pendingInvoices.length === 0) {
//           toast.info("No pending invoices available");
//           return;
//         }

//         setInvoiceList(pendingInvoices);
//         setSelectedDoc(item);
//         setInvoiceDialogOpen(true);
//       } catch (error) {
//         toast.error("Failed to fetch invoices");
//         console.error(error);
//       }
//     };

//     const handleSubmit = () => {
//       if (selectedInvoices.length === 0) {
//         toast.warning("Select at least one invoice");
//         return;
//       }
//       confirmInvoiceLock(selectedInvoices);
//     };

//     const confirmInvoiceLock = async (invoiceIds) => {
//       try {
//         await accountDocsAPI.lockUnlockInvoice({
//           filePath: selectedDoc.path,
//           invoiceIds,
//           action: "lock",
//         });
//         toast.success("Invoice locked successfully");
//         setInvoiceDialogOpen(false);
//         fetchFolderTree();
//       } catch (err) {
//         toast.error("Lock failed");
//         console.log(err);
//       }
//     };

//     const handleCloseDialog = () => {
//       setOpenApprovalDialog(false);
//       setDescription("");
//       setSelectedItem(null);
//     };

//     const handleDownload = async (item) => {
//       try {
//         const response = await accountDocsAPI.downloadItems({
//           paths: item.path,
//         });
//         const blob = response.data;
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = item.name || "download";
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//       } catch (err) {
//         console.error("Download error:", err);
//       }
//     };

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
//         .replace(",", "")
//         .replace(" ", "-");
//     };

//     const getStatusChip = (meta, isFolder) => {
//       if (isFolder) return null;
//       const chips = [];

//       if (SIGN_STATUSES.includes(meta.signStatus)) {
//         let color = "default";
//         if (meta.signStatus === "pendingSignature") color = "warning";
//         if (meta.signStatus === "signatureCompleted") color = "success";
//         chips.push(
//           <Chip
//             key="signChip"
//             label={statusTextMap[meta.signStatus]}
//             size="small"
//             variant="outlined"
//             color={color}
//           />,
//         );
//       }

//       if (APPROVAL_STATUSES.includes(meta.authStatus)) {
//         let color = "default";
//         if (meta.authStatus === "pendingApproval") color = "warning";
//         if (meta.authStatus === "approvalCompleted") color = "success";
//         if (meta.authStatus === "canceledApproval") color = "error";

//         if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
//           chips.push(
//             <Tooltip
//               key="approvalCanceledChip"
//               title={meta.cancelReason}
//               placement="top-end"
//             >
//               <Chip
//                 label="Approval Canceled"
//                 size="small"
//                 variant="outlined"
//                 color="error"
//                 sx={{ cursor: "pointer" }}
//               />
//             </Tooltip>,
//           );
//         } else {
//           chips.push(
//             <Chip
//               key="approvalChip"
//               label={approvalStatusTextMap[meta.authStatus]}
//               size="small"
//               variant="outlined"
//               color={color}
//             />,
//           );
//         }
//       }

//       if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
//         let color = "default";
//         if (meta.lockInvoiceStatus === "pendingpayment") color = "warning";
//         if (meta.lockInvoiceStatus === "paymentcompleted") color = "success";
//         chips.push(
//           <Chip
//             key="invoiceLockChip"
//             label={invoiceStatusTextMap[meta.lockInvoiceStatus]}
//             size="small"
//             variant="outlined"
//             color={color}
//           />,
//         );
//       }

//       if (chips.length === 0) return null;
//       return <Box sx={{ display: "flex", gap: 1 }}>{chips}</Box>;
//     };

//     const getFolderCounts = (folder) => {
//       let fileCount = 0;
//       let folderCount = 0;

//       if (folder.children && folder.children.length > 0) {
//         folder.children.forEach((child) => {
//           if (child.type === "folder") {
//             folderCount += 1;
//             const subCounts = getFolderCounts(child);
//             fileCount += subCounts.fileCount;
//             folderCount += subCounts.folderCount;
//           } else {
//             fileCount += 1;
//           }
//         });
//       }
//       return { fileCount, folderCount };
//     };

//     const findNewSystemTag = (item) => {
//       const newTag = item.meta?.tags?.find(
//         (tag) => tag.isSystemTag && tag.tagName === "New",
//       );
//       if (newTag) return newTag;

//       if (item.children && item.children.length > 0) {
//         for (const child of item.children) {
//           const childTag = findNewSystemTag(child);
//           if (childTag) return childTag;
//         }
//       }
//       return null;
//     };

//     const renderTableRows = (items, level = 0, parentPath = "") => {
//       const sortedItems = [...items].sort((a, b) => {
//         if (a.type === "folder" && b.type !== "folder") return -1;
//         if (a.type !== "folder" && b.type === "folder") return 1;
//         return a.name.localeCompare(b.name);
//       });

//       return sortedItems.map((item) => {
//         const fullPath = item.path;
//         const meta = item.meta || {};
//         const isFolder = item.type === "folder";
//         const { folderCount, fileCount } = isFolder
//           ? getFolderCounts(item)
//           : { folderCount: 0, fileCount: 0 };
//         const isSelected = selectedItems.has(fullPath);
//         const isPartiallySelected = isFolder
//           ? isFolderPartiallySelected(item)
//           : false;
//         const inheritedNewTag = isFolder ? findNewSystemTag(item) : null;

//         const handleSafeFileClick = () => {
//           if (meta.readOnly) {
//             alert("This file is locked and cannot be opened.");
//             return;
//           }
//           if (!isFolder) {
//             handleFileClick(fullPath, item.name, meta);
//           }
//         };

//         return (
//           <React.Fragment key={fullPath}>
//             <TableRow
//               sx={{
//                 backgroundColor: level % 2 === 0 ? "#fafafa" : "white",
//                 "&:hover": { backgroundColor: "#f5f5f5" },
//               }}
//             >
//               <TableCell sx={{ width: "50px", paddingLeft: 2 }}>
//                 {isFolder ? (
//                   <Checkbox
//                     size="small"
//                     checked={isSelected}
//                     indeterminate={isPartiallySelected}
//                     onChange={() => handleFolderSelect(item)}
//                   />
//                 ) : (
//                   <Checkbox
//                     size="small"
//                     checked={isSelected}
//                     onChange={() => handleSelectItem(fullPath)}
//                   />
//                 )}
//               </TableCell>

//               <TableCell sx={{ paddingLeft: level * 4 + 2 }}>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   {isFolder ? (
//                     <>
//                       <IconButton
//                         size="small"
//                         onClick={() => toggleFolder(fullPath, meta.readOnly)}
//                         disabled={meta.readOnly}
//                         sx={{ mr: 0.5 }}
//                       >
//                         {expandedFolders[fullPath] ? (
//                           <FolderOpenIcon color="#1976d2" />
//                         ) : (
//                           <FolderClosedIcon color="#757575" />
//                         )}
//                       </IconButton>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           ml: 0.5,
//                           fontWeight: "medium",
//                           color: meta.readOnly ? "#999" : "inherit",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => toggleFolder(fullPath, meta.readOnly)}
//                       >
//                         {item.name}
//                         {inheritedNewTag && (
//                           <Chip
//                             label={inheritedNewTag.tagName}
//                             size="small"
//                             sx={{
//                               backgroundColor: inheritedNewTag.tagColour,
//                               color: "#fff",
//                               height: 18,
//                               fontSize: "0.7rem",
//                               ml: 0.8,
//                             }}
//                           />
//                         )}
//                         {meta.readOnly && (
//                           <Typography
//                             component="span"
//                             variant="caption"
//                             sx={{ color: "error.main", ml: 1 }}
//                           >
//                             (Locked)
//                           </Typography>
//                         )}
//                       </Typography>
//                     </>
//                   ) : (
//                     <>
//                       <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
//                       <Box sx={{ display: "flex", flexDirection: "column" }}>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: meta.readOnly ? "#999" : "#1976d2",
//                             textDecoration: meta.readOnly
//                               ? "none"
//                               : "underline",
//                             cursor: meta.readOnly ? "not-allowed" : "pointer",
//                           }}
//                           onClick={handleSafeFileClick}
//                         >
//                           {item.name}
//                           {meta.readOnly && (
//                             <Typography
//                               component="span"
//                               variant="caption"
//                               sx={{ color: "error.main", ml: 1 }}
//                             >
//                               (Locked)
//                             </Typography>
//                           )}
//                           {meta.tags?.map((tag, index) => (
//                             <Chip
//                               key={index}
//                               label={tag.tagName}
//                               size="small"
//                               sx={{
//                                 backgroundColor: tag.tagColour || "#e0e0e0",
//                                 color: "#fff",
//                                 height: 18,
//                                 fontSize: "0.7rem",
//                                 ml: 0.5,
//                               }}
//                             />
//                           ))}
//                         </Typography>
//                       </Box>
//                     </>
//                   )}
//                 </Box>
//               </TableCell>
//               <TableCell>
//                 <Typography variant="caption" sx={{ ml: 1, color: "gray" }}>
//                   ({folderCount} folders, {fileCount} files)
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Box sx={{ mt: 0.5 }}>{getStatusChip(meta, isFolder)}</Box>
//               </TableCell>
//               <TableCell>
//                 <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                   {formatUploadedAt(meta.uploadedAt)}
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                   {meta.uploadedBy}
//                 </Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <IconButton
//                   size="small"
//                   onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
//                 >
//                   <MoreVertIcon />
//                 </IconButton>
//               </TableCell>
//             </TableRow>

//             {isFolder &&
//               expandedFolders[fullPath] &&
//               item.children &&
//               item.children.length > 0 &&
//               renderTableRows(item.children, level + 1, fullPath)}
//           </React.Fragment>
//         );
//       });
//     };

//     return (
//       <Box sx={{ margin: "auto", p: 3 }}>
//         {/* Action Buttons */}
//         <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               gap: 1,
//               maxWidth: "600px",
//               width: "100%",
//               mx: "auto",
//               my: 3,
//             }}
//           >
//             <Button
//               variant="contained"
//               fullWidth
//               startIcon={<FolderIcon />}
//               onClick={() => {
//                 setNewFolderDrawerOpen(true);
//                 handleMenuClose();
//               }}
//             >
//               Create Folder
//             </Button>

//             <Button
//               variant="contained"
//               fullWidth
//               startIcon={<UploadFileIcon />}
//               onClick={() => setFileUploadDrawerOpen(true)}
//             >
//               Upload File
//             </Button>

//             <Button
//               variant="contained"
//               fullWidth
//               startIcon={<DriveFolderUploadIcon />}
//               onClick={() => setFolderUploaDrawerOpen(true)}
//             >
//               Upload Folder
//             </Button>
//           </Box>

//           {/* Bulk Operations Toolbar */}
//           {selectedItems.size > 0 && (
//             <Paper
//               elevation={2}
//               sx={{
//                 p: 2,
//                 mb: 3,
//                 bgcolor: "#e3f2fd",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: 1,
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold">
//                 {selectedItems.size} item(s) selected
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                 <Button
//                   variant="contained"
//                   size="small"
//                   startIcon={<DriveFileMoveIcon />}
//                   onClick={() => setBulkMoveDrawerOpen(true)}
//                   disabled={bulkOperationLoading}
//                 >
//                   Move
//                 </Button>

//                 <Button
//                   variant="contained"
//                   size="small"
//                   startIcon={<LockIcon />}
//                   onClick={() => setBulkLockDialogOpen(true)}
//                   disabled={bulkOperationLoading}
//                 >
//                   Lock/Unlock
//                 </Button>

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   size="small"
//                   startIcon={<DeleteIcon />}
//                   onClick={handleBulkTrash}
//                   disabled={bulkOperationLoading}
//                 >
//                   Delete
//                 </Button>

//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   startIcon={<DownloadIcon />}
//                   onClick={handleBulkDownload}
//                   disabled={bulkOperationLoading}
//                 >
//                   Download
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   size="small"
//                   onClick={() => setSelectedItems(new Set())}
//                   disabled={bulkOperationLoading}
//                 >
//                   Clear Selection
//                 </Button>
//               </Box>
//             </Paper>
//           )}

//           {/* Drawers */}
//           <FileUploadDrawer
//             isOpen={fileUploadDrawerOpen}
//             onClose={() => setFileUploadDrawerOpen(false)}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             accountId={accountId}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <CreteFolderDrawer
//             isOpen={newFolderDrawerOpen}
//             onClose={() => {
//               setNewFolderDrawerOpen(false);
//             }}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             accountId={accountId}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <FolderUploadDrawer
//             isOpen={folderUploaDrawerOpen}
//             onClose={() => setFolderUploaDrawerOpen(false)}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <MoveDrawer
//             isOpen={moveDrawerOpen}
//             onClose={() => {
//               setMoveDrawerOpen(false);
//             }}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />

//           <RenameDrawer
//             isOpen={renameDrawer}
//             onClose={() => {
//               SetRenameDrawer(false);
//             }}
//             folderTree={folderTree}
//             fetchFolderTree={() => fetchFolderTree(accountId)}
//             selectedFolderForMenu={selectedFolderForMenu}
//           />
//           {/* 🔴 Bulk Move Drawer */}
//           <MoveDrawer
//             isOpen={bulkMoveDrawerOpen}
//             onClose={() => setBulkMoveDrawerOpen(false)}
//             folderTree={folderTree}
//             fetchFolderTree={fetchFolderTree}
//             // Bulk mode props
//             isBulkOperation={true}
//             selectedPaths={Array.from(selectedItems)} // Array of selected paths
//             onMoveComplete={(targetPath) => {
//               // Optional callback after successful move
//               console.log("Bulk move completed to:", targetPath);
//               setSelectedItems(new Set()); // Clear selection
//             }}
//           />
//         </Box>

//         {/* Folder Explorer */}

//         <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             📜 Folder Explorer
//           </Typography>

//           {folderTree && folderTree.length > 0 ? (
//             <>
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ width: "50px" }}>
//                         <Checkbox
//                           checked={selectAll}
//                           indeterminate={selectedItems.size > 0 && !selectAll}
//                           onChange={handleSelectAll}
//                         />
//                       </TableCell>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Content</TableCell>
//                       <TableCell>Status</TableCell>
//                       <TableCell>Uploaded</TableCell>
//                       <TableCell>User</TableCell>
//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>{renderTableRows(folderTree)}</TableBody>
//                 </Table>
//               </TableContainer>
//             </>
//           ) : (
//             <Typography sx={{ p: 2, textAlign: "center" }}>
//               {/* Loading folder data... */}
//             </Typography>
//           )}
//         </Paper>
//         {/* 🔴 Bulk Lock Dialog */}
//         <Dialog
//           open={bulkLockDialogOpen}
//           onClose={() => setBulkLockDialogOpen(false)}
//         >
//           <DialogTitle>Lock/Unlock Selected Items</DialogTitle>
//           <DialogContent>
//             <Typography>
//               Do you want to lock or unlock the {selectedItems.size} selected
//               item(s)?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setBulkLockDialogOpen(false)}>Cancel</Button>
//             <Button
//               onClick={() => handleBulkLock("unlock")}
//               color="primary"
//               disabled={bulkOperationLoading}
//             >
//               Unlock
//             </Button>
//             <Button
//               onClick={() => handleBulkLock("lock")}
//               color="warning"
//               variant="contained"
//               disabled={bulkOperationLoading}
//             >
//               Lock
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog
//           open={openDialog}
//           onClose={() => setOpenDialog(false)}
//           fullWidth
//           maxWidth="lg"
//         >
//           <DialogTitle>
//             {/* {items.name} */}
//             {selectedFolderForMenu?.name || "Document"}
//             <IconButton
//               aria-label="close"
//               onClick={() => setOpenDialog(false)}
//               style={{ position: "absolute", right: 8, top: 8 }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent dividers>
            // {token && showBuilderFor && (
            //   <DocusealBuilder
            //     token={token}
            //     customCss={customCss}
            //     onComplete={() => {
            //       console.log("DocuSeal finished sending document");
            //       setShowBuilderFor(null);
            //       setOpenDialog(false);
            //     }}
            //   />
            // )}
//           </DialogContent>
//         </Dialog>

//         <Dialog
//           open={openApprovalDialog}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle>Request Approval</DialogTitle>
//           <DialogContent>
//             <TextField
//               multiline
//               rows={4}
//               fullWidth
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Type a short description or note..."
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog}>Cancel</Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleRequestApproval}
//               // disabled={!description.trim()}
//               disabled={!description.trim() || sending}
//             >
//               Send
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Menu
//           anchorEl={menuAnchorEl}
//           open={Boolean(menuAnchorEl)}
//           onClose={handleMenuClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           {(() => {
//             if (!selectedFolderForMenu) return null;

//             const item = selectedFolderForMenu;
//             const isFolder = item.type === "folder";
//             const isLocked = item?.meta?.readOnly === true;

//             // Determine doc category (adjust this logic if needed)
//             const path = item.path.toLowerCase();
//             let docType = "client"; // default
//             if (path.includes("firm")) docType = "firm";
//             if (path.includes("private")) docType = "private";
//             const PROTECTED_FOLDERS = [
//               "Client Uploaded Documents",
//               "Firm Documents Shared with Client",
//               "Private",
//             ];
//             const isProtectedFolder =
//               isFolder && PROTECTED_FOLDERS.includes(item.name);

//             const menuItems = [];

//             // -------------------------------
//             // 📁 FOLDER TYPE
//             // -------------------------------
//             if (isFolder) {
//               if (docType === "client") {
//                 menuItems.push(
//                   {
//                     icon: <FolderIcon />,
//                     label: "New Folder",
//                     action: () => setNewFolderDrawerOpen(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Edit",
//                     action: () => SetRenameDrawer(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Move",
//                     action: () => setMoveDrawerOpen(true),
//                   },
//                   {
//                     icon: <DeleteIcon />,
//                     label: "Delete",
//                     // action: () => deleteItem(item),
//                     action: () => trashItem(item),
//                     disabled: isProtectedFolder,
//                   },
//                   {
//                     icon: <DownloadIcon />,
//                     label: "Download",
//                     action: () => handleDownload(item),
//                   },
//                   {
//                     icon: <UploadFileIcon />,
//                     label: "New File",
//                     action: () => setFileUploadDrawerOpen(true),
//                   },
//                   {
//                     icon: <DriveFolderUploadIcon />,
//                     label: "Upload Folder",
//                     action: () => setFolderUploaDrawerOpen(true),
//                   },
//                   {
//                     icon: <LockIcon />,
//                     label: isLocked ? "Unlock" : "Lock",
//                     action: () => toggleReadOnly(item),
//                   },
//                 );
//               } else if (docType === "firm") {
//                 menuItems.push(
//                   {
//                     icon: <FolderIcon />,
//                     label: "New Folder",
//                     action: () => setNewFolderDrawerOpen(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Edit",
//                     action: () => SetRenameDrawer(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Move",
//                     action: () => setMoveDrawerOpen(true),
//                   },
//                   {
//                     icon: <UploadFileIcon />,
//                     label: "New File",
//                     action: () => setFileUploadDrawerOpen(true),
//                   },
//                   {
//                     icon: <DownloadIcon />,
//                     label: "Download",
//                     action: () => handleDownload(item),
//                   },
//                   {
//                     icon: <DriveFolderUploadIcon />,
//                     label: "Upload Folder",
//                     action: () => setFolderUploaDrawerOpen(true),
//                   },
//                   {
//                     icon: <DeleteIcon />,
//                     label: "Delete",
//                     // action: () => deleteItem(item),
//                     action: () => trashItem(item),
//                     disabled: isProtectedFolder,
//                   },
//                 );
//               } else if (docType === "private") {
//                 menuItems.push(
//                   {
//                     icon: <FolderIcon />,
//                     label: "New Folder",
//                     action: () => setNewFolderDrawerOpen(true),
//                   },
//                   {
//                     icon: <UploadFileIcon />,
//                     label: "New File",
//                     action: () => setFileUploadDrawerOpen(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Move",
//                     action: () => setMoveDrawerOpen(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Edit",
//                     action: () => SetRenameDrawer(true),
//                   },
//                   {
//                     icon: <DeleteIcon />,
//                     label: "Delete",
//                     //action: () => deleteItem(item),
//                     action: () => trashItem(item),
//                     disabled: isProtectedFolder,
//                   },
//                   {
//                     icon: <DownloadIcon />,
//                     label: "Download",
//                     action: () => handleDownload(item),
//                   },
//                 );
//               }
//             }

//             // -------------------------------
//             // 📄 FILE TYPE
//             // -------------------------------
//             else {
//               if (docType === "client") {
//                 menuItems.push(
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Edit",
//                     action: () => SetRenameDrawer(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Move",
//                     action: () => setMoveDrawerOpen(true),
//                   },
//                   {
//                     icon: <LockIcon />,
//                     label: isLocked ? "Unlock" : "Lock",
//                     action: () => toggleReadOnly(item),
//                   },
//                   {
//                     icon: <DeleteIcon />,
//                     label: "Delete",
//                     //action: () => deleteItem(item),
//                     action: () => trashItem(item),
//                   },
//                   {
//                     icon: <DownloadIcon />,
//                     label: "Download",
//                     action: () => handleDownload(item),
//                   },
//                 );
//               } else if (docType === "firm") {
//                 const currentStatus =
//                   item.meta?.signStatus || "sendForSignature";
//                 const approvalStatus =
//                   item.meta?.authStatus || "sendForApproval";
//                 const invoiceStatus = item.meta?.lockInvoiceStatus;

//                 const isSignatureDisabled =
//                   currentStatus === "pendingSignature" ||
//                   currentStatus === "signatureCompleted";

//                 const isApprovalCompleted =
//                   approvalStatus === "approvalCompleted";
//                 // const isApprovalPending = approvalStatus === "pendingApproval";
//                 const isApprovalCanceled =
//                   approvalStatus === "canceledApproval";

//                 let invoiceLabel = "Lock Invoice";
//                 if (invoiceStatus === "pendingpayment")
//                   invoiceLabel = "Unlock Invoice";
//                 if (invoiceStatus === "paymentcompleted" || !invoiceStatus)
//                   invoiceLabel = "Lock Invoice";

//                 menuItems.push(
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Edit",
//                     action: () => SetRenameDrawer(true),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Move",
//                     action: () => setMoveDrawerOpen(true),
//                   },
//                 );
//                 // SIGNATURE MENU
//                 if (currentStatus === "pendingSignature") {
//                   menuItems.push({
//                     icon: <CancelIcon />,
//                     label: "Cancel Signature Request",
//                     action: () => cancelSignature(item),
//                   });
//                 } else {
//                   menuItems.push({
//                     icon: <PenTool size={16} />,
//                     label: statusTextMap[currentStatus],
//                     action: () => toggleSignStatus(item),
//                     disabled: isSignatureDisabled,
//                   });
//                 }

//                 // ---------------- APPROVAL MENU LOGIC ----------------
//                 if (approvalStatus === "sendForApproval") {
//                   menuItems.push({
//                     icon: <Stamp size={16} />,
//                     label: "Send For Approval",
//                     action: () => toggleApprovalStatus(item),
//                     // action: () => handleOpenApprovalDialog(item),
//                   });
//                 }

//                 if (approvalStatus === "pendingApproval") {
//                   menuItems.push({
//                     icon: <CancelIcon />,
//                     label: "Cancel Approval Request",
//                     action: () => handleCancelApproval(item),
//                   });
//                 }

//                 if (isApprovalCompleted) {
//                   menuItems.push({
//                     icon: <Stamp size={16} />,
//                     label: "Approved",
//                     disabled: true,
//                   });
//                 }

//                 if (isApprovalCanceled) {
//                   menuItems.push({
//                     icon: <Stamp size={16} />,
//                     label: "Approval Canceled",
//                     disabled: true,
//                   });
//                 }

//                 // ---------------- INVOICE LOCK ----------------
//                 menuItems.push({
//                   icon:
//                     invoiceStatus === "pendingpayment" ? (
//                       <LockOpenIcon />
//                     ) : (
//                       <LockIcon />
//                     ),
//                   label: invoiceLabel,
//                   action: () => toggleInvoiceLock(item),
//                 });

//                 // ---------------- DELETE ----------------
//                 menuItems.push({
//                   icon: <DeleteIcon />,
//                   label: "Delete",
//                   //action: () => deleteItem(item),
//                   action: () => trashItem(item),
//                 });
//                 menuItems.push({
//                   icon: <DownloadIcon />,
//                   label: "Download",
//                   action: () => handleDownload(item),
//                 });
//               } else if (docType === "private") {
//                 menuItems.push(
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Edit",
//                     action: () => SetRenameDrawer(true),
//                   },
//                   {
//                     icon: <DeleteIcon />,
//                     label: "Delete",
//                     // action: () => deleteItem(item),
//                     action: () => trashItem(item),
//                   },
//                   {
//                     icon: <DownloadIcon />,
//                     label: "Download",
//                     action: () => handleDownload(item),
//                   },
//                   {
//                     icon: <DriveFileMoveIcon />,
//                     label: "Move",
//                     action: () => setMoveDrawerOpen(true),
//                   },
//                 );
//               }
//             }

//             return menuItems.map(({ icon, label, action, disabled }) => (
//               <MenuItem
//                 key={label}
//                 disabled={(label !== "Unlock" && isLocked) || disabled}
//                 // disabled={label !== "Unlock" && isLocked} // allow unlock even if locked
//                 onClick={() => {
//                   action();
//                   handleMenuClose();
//                 }}
//                 sx={{ fontSize: "0.8rem", py: 0.5 }}
//               >
//                 {React.cloneElement(icon, { sx: { mr: 0.5, fontSize: 16 } })}
//                 {label}
//               </MenuItem>
//             ));
//           })()}
//         </Menu>
//         <Dialog
//           open={invoiceDialogOpen}
//           onClose={() => setInvoiceDialogOpen(false)}
//           fullWidth
//           maxWidth="md"
//         >
//           <DialogTitle>Select Invoices To Lock</DialogTitle>

//           <DialogContent dividers>
//             {invoiceList.length === 0 && (
//               <Typography textAlign="center" color="text.secondary" p={2}>
//                 No invoices found
//               </Typography>
//             )}

//             <Box sx={{ overflowX: "auto", mt: 1 }}>
//               <Table sx={{ minWidth: 650 }}>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Select</TableCell>
//                     <TableCell>Invoice #</TableCell>
//                     <TableCell>Description</TableCell>
//                     <TableCell>Created At</TableCell>
//                     <TableCell>Amount</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {invoiceList.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={5}>No invoices found.</TableCell>
//                     </TableRow>
//                   ) : (
//                     invoiceList.map((inv) => {
//                       const id = inv._id;
//                       const checked = selectedInvoices.includes(id);

//                       return (
//                         <TableRow
//                           key={id}
//                           hover
//                           sx={{
//                             cursor: "pointer",
//                             bgcolor: checked ? "#e3f2fd" : "inherit",
//                           }} // optional: highlight selected
//                           onClick={() => {
//                             setSelectedInvoices((prev) => {
//                               const updated = prev.includes(id)
//                                 ? prev.filter((x) => x !== id)
//                                 : [...prev, id];

//                               console.log("Selected invoices:", updated); // <-- log here
//                               return updated;
//                             });
//                           }}
//                         >
//                           <TableCell>
//                             <Checkbox checked={checked} />
//                           </TableCell>
//                           <TableCell>{inv.invoicenumber}</TableCell>
//                           <TableCell>{inv.description || "—"}</TableCell>
//                           <TableCell>
//                             {new Date(inv.createdAt).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell>₹{inv.summary?.total}</TableCell>
//                         </TableRow>
//                       );
//                     })
//                   )}
//                 </TableBody>
//               </Table>
//             </Box>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
//             <Button variant="contained" onClick={handleSubmit}>
//               Lock Invoice
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog
//           open={openFileViewer}
//           onClose={() => setOpenFileViewer(false)}
//           fullWidth
//           maxWidth="lg" // Adjust size as needed (sm, md, lg, xl)
//         >
//           <DialogTitle
//             sx={{
//               m: 0,
//               p: 2,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Typography variant="h6" component="div">
//               {selectedFileName}
//             </Typography>
//             <IconButton
//               aria-label="close"
//               onClick={() => setOpenFileViewer(false)}
//               sx={{ color: (theme) => theme.palette.grey[500] }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent
//             dividers
//             sx={{ p: 0, height: "80vh", overflow: "hidden" }}
//           >
//             <Box
//               sx={{
//                 width: "100%",
//                 height: "100%",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 bgcolor: "#f5f5f5",
//               }}
//             >
//               {/* The iframe will handle PDFs, Images, and Text files. 
//           Browsers will automatically use their built-in viewers.
//       */}
//               <iframe
//                 src={selectedFileUrl}
//                 title="File Preview"
//                 width="100%"
//                 height="100%"
//                 style={{ border: "none" }}
//               />
//             </Box>
//           </DialogContent>
//         </Dialog>
//         <Dialog
//           open={openWordDialog}
//           onClose={() => setOpenWordDialog(false)}
//           maxWidth="lg"
//           fullWidth
//         >
//           {/* <DialogTitle>{selectedFileName}</DialogTitle> */}
//           <DialogTitle
//             sx={{
//               m: 0,
//               p: 2,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Typography variant="h6" component="div">
//               {selectedFileName}
//             </Typography>
//             <IconButton
//               aria-label="close"
//               onClick={() => setOpenWordDialog(false)}
//               sx={{ color: (theme) => theme.palette.grey[500] }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <iframe
//               src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedFileUrl)}`}
//               width="100%"
//               height="600px"
//               title="Word Viewer"
//             />
//           </DialogContent>
//         </Dialog>

//         <Dialog
//           open={openTextDialog}
//           onClose={() => setOpenTextDialog(false)}
//           maxWidth="md"
//           fullWidth
//         >
//           {/* <DialogTitle>{selectedFileName}</DialogTitle> */}
//           <DialogTitle
//             sx={{
//               m: 0,
//               p: 2,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Typography variant="h6" component="div">
//               {selectedFileName}
//             </Typography>
//             <IconButton
//               aria-label="close"
//               onClick={() => setOpenTextDialog(false)}
//               sx={{ color: (theme) => theme.palette.grey[500] }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <pre style={{ whiteSpace: "pre-wrap" }}>{textContent}</pre>
//           </DialogContent>
//         </Dialog>
//         <Dialog
//           open={openExcelDialog}
//           onClose={() => setOpenExcelDialog(false)}
//           maxWidth="lg"
//           fullWidth
//         >
//           <DialogTitle
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Typography>{selectedFileName}</Typography>
//             <IconButton
//               aria-label="close"
//               onClick={() => setOpenExcelDialog(false)}
//               sx={{ color: (theme) => theme.palette.grey[500] }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <iframe
//               src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedFileUrl)}`}
//               width="100%"
//               height="600px"
//               title="Excel Viewer"
//             />
//           </DialogContent>
//         </Dialog>
//         <Dialog
//           open={openTemplateDialog}
//           onClose={() => setOpenTemplateDialog(false)}
//           maxWidth="lg"
//           fullWidth
//         >
//           <DialogTitle>
//             {/* {items.name} */}
//             <IconButton
//               aria-label="close"
//               onClick={() => setOpenTemplateDialog(false)}
//               style={{ position: "absolute", right: 8, top: 8 }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent sx={{ height: "80vh" }}>
//             {token ? (
//               <DocusealBuilder
//                 token={token}
//                 onComplete={() => {
//                   console.log("Template edited");
//                   setOpenTemplateDialog(false);
//                 }}
//               />
//             ) : (
//               <p>Loading template...</p>
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>
//     );
//   };
//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Apply Template to Account
//       </Typography>

//       <FormControl fullWidth sx={{ mb: 2 }}>
//         <InputLabel id="template-label">Select Template</InputLabel>
//         <Select
//           labelId="template-label"
//           value={selectedTemplate}
//           label="Select Template"
//           onChange={(e) => setSelectedTemplate(e.target.value)}
//         >
//           <MenuItem value="">
//             <em>Choose a template</em>
//           </MenuItem>
//           {templates.map((template) => (
//             <MenuItem key={template._id} value={template._id}>
//               {template.templatename}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <Button
//         variant="contained"
//         color="primary"
//         disabled={loading || !selectedTemplate}
//         onClick={applyTemplateToAccount}
//         sx={{ textTransform: "none" }}
//       >
//         {loading ? (
//           <CircularProgress size={24} color="inherit" />
//         ) : (
//           "Apply Template"
//         )}
//       </Button>

//       <FolderTreeView accountId={accountId} />
//     </Box>
//   );
// };

// export default DocsFolderTree;



// DocsFolderTree.tsx (Parent Component)




import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import {useToastContext} from "../../../context/ToastContext";
import { FolderTreeView } from "./FolderTreeView";
import { folderManagementAPI, docAPI } from "../../../services/api";

const DocsFolderTree = () => {
  const { accountId } = useParams();
  const {showToast} = useToastContext();
  console.log("account id for the documentation", accountId);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  console.log("selected template", selectedTemplate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch templates list - Using folderManagementAPI
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await folderManagementAPI.getFolderTemplates();
        setTemplates(res.data.folderTemplates || []);
      } catch (err) {
        setError("Failed to fetch templates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const applyTemplateToAccount = () => {
    console.log("ghjh");

    const payload = {
      accountId: accountId,
      templateId: selectedTemplate || null,
    };

    console.log("applyTemplateToAccount payload:", payload);

    docAPI
      .applyTemplateToAccount(payload)
      .then((res) => {
        console.log("API response:", res.data);
        showToast({
          title: "Folder Template Assign Successfully",
          type: "success",
        });
        setSelectedTemplate("");
      })
      .catch((error) => {
        console.error("Error applying template:", error);
        showToast({
          title: "Failed to Assign Folder Template",
          type: "error",
        });
        alert("Failed to Assign Folder Template");
      });
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Apply Template to Account</CardTitle>
          <CardDescription>
            Select a folder template to apply to this account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Template
            </label>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template._id} value={template._id}>
                    {template.templatename}
                  </SelectItem>
                ))}
                {templates.length === 0 && !loading && (
                  <SelectItem value="no-templates" disabled>
                    No templates available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="default"
            disabled={loading || !selectedTemplate}
            onClick={applyTemplateToAccount}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Apply Template"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Folder Structure</CardTitle>
          <CardDescription>
            View and manage folder hierarchy for this account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FolderTreeView accountId={accountId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocsFolderTree;