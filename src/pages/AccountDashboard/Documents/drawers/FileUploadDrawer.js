import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";

import {
  Drawer,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";
import { accountDocsAPI,invoiceAPI  } from "../../../../services/api";

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  accountId,
}) => {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  // Invoice states
  const [invoiceConfirmOpen, setInvoiceConfirmOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  // Reset state
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFiles([]);
      setMessage("");
      setSelectedInvoices([]);
    }
  }, [isOpen, selectedFolderForMenu]);

  // Fetch invoices



  // File validation
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024;

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 50MB`);
        return false;
      }
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        toast.error(`${file.name} is not allowed`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  // const handleUpload = async () => {
  //   if (!files.length || !selectedFolder) {
  //     setMessage("Please select files and folder");
  //     return;
  //   }

  //   if (selectedFolder.includes("Firm Documents Shared with Client")) {
  //     try {
  //       const res = await fetch(
  //         `https://www.snptaxes.com/workflow/invoices/invoice/pending/invoicelistby/accountid/${accountId}`
  //       );
  //       const data = await res.json();

  //       if (!data.invoice?.length) {
  //         performUpload();
  //       } else {
  //         setInvoiceConfirmOpen(true);
  //       }
  //     } catch {
  //       performUpload();
  //     }
  //   } else {
  //     performUpload();
  //   }
  // };

  const handleUpload = async () => {
  if (!files.length || !selectedFolder) {
    setMessage("Please select files and folder");
    return;
  }

  // 🚨 Only check for this folder
  if (selectedFolder.includes("Firm docs shared with client")) {
    try {
      const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);
      const invoices = res.data?.invoice || [];

      console.log("Fetched invoices:", invoices);

      setInvoiceList(invoices);

      if (invoices.length > 0) {
        // 🔥 Show confirm dialog if invoices exist
        setInvoiceConfirmOpen(true);
      } else {
        // ✅ No invoices → upload directly
        performUpload();
      }
    } catch (err) {
      console.error("Error fetching invoices", err);

      // fallback → allow upload
      performUpload();
    }
  } else {
    performUpload();
  }
};
  const performUpload = async () => {
    try {
      const formData = new FormData();

      files.forEach((file) => formData.append("files", file));
      formData.append("invoices", JSON.stringify(selectedInvoices));
      formData.append("adminUserName", user?.username || "Unknown");

      await accountDocsAPI.uploadFile(formData, selectedFolder);

      toast.success("Files uploaded successfully");

      setInvoiceDialogOpen(false);
      setSelectedInvoices([]);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  return (
    <>
      {/* DRAWER */}
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
          <Typography variant="h6">📄 Upload File</Typography>

          <Button component="label" fullWidth sx={{ mt: 2 }}>
            {files.length
              ? `${files.length} file(s) selected`
              : "Select Files"}
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          <Button variant="contained" fullWidth onClick={handleUpload}>
            Upload
          </Button>

          {message && <Typography mt={2}>{message}</Typography>}

          <Button fullWidth sx={{ mt: 2 }} onClick={onClose}>
            Close
          </Button>

          <Box mt={3}>
            <Typography>Select Folder</Typography>
            <FolderTreeSelector
              items={folderTree}
              onSelect={setSelectedFolder}
              selectedFolder={selectedFolder}
            />
          </Box>
        </Box>
      </Drawer>

      {/* CONFIRM */}
      <Dialog open={invoiceConfirmOpen}>
        <DialogTitle>Invoice Lock</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setInvoiceConfirmOpen(false);
              performUpload();
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setInvoiceConfirmOpen(false);
              setInvoiceDialogOpen(true);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* INVOICE TABLE */}
      <Dialog open={invoiceDialogOpen} fullWidth maxWidth="md">
        <DialogTitle>Select Invoices</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {invoiceList.map((inv) => {
                const checked = selectedInvoices.includes(inv._id);

                return (
                  <TableRow
                    key={inv._id}
                    onClick={() => {
                      setSelectedInvoices((prev) =>
                        prev.includes(inv._id)
                          ? prev.filter((i) => i !== inv._id)
                          : [...prev, inv._id]
                      );
                    }}
                  >
                    <TableCell>
                      <Checkbox checked={checked} />
                    </TableCell>
                    <TableCell>{inv.invoicenumber}</TableCell>
                    <TableCell>₹{inv.summary?.total}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!selectedInvoices.length) {
                toast.warning("Select at least one invoice");
                return;
              }
              performUpload();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ================= FOLDER TREE =================
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <List>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isExpanded = expanded[item.path];
        const isSelected = selectedFolder === item.path;

        return (
          <React.Fragment key={item.path}>
            <ListItem
              sx={{
                pl: 2 + level * 2,
                bgcolor: isSelected ? "#b2d8ff" : "transparent",
                cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
                opacity: item.meta?.readOnly ? 0.6 : 1,
              }}
              onClick={() => !item.meta?.readOnly && onSelect(item.path)}
            >
              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
              >
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              </ListItemIcon>

              <ListItemText primary={item.name} />

              {item.children?.length > 0 &&
                (isExpanded ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>

            <Collapse in={isExpanded}>
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default FileUploadDrawer;