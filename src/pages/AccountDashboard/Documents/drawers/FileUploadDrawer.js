

import React, { useState, useEffect } from "react";
import { useToastContext } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/AuthContext";
import { accountDocsAPI, invoiceAPI } from "../../../../services/api";
import { Button } from "../../../../components/ui/button";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  X,
  Upload,
  FileUp,
  Link2,
  Lock,
  Landmark,
  Briefcase,
  Settings,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { accountsAPI, } from "../../../../services/api";

// ================= SETTINGS DRAWER =================
const SettingsDrawer = ({
  isOpen,
  onClose,
  files,
  selectedFolder,
  onOpenInvoicePanel,
  selectedInvoices,
  onUpload,
  uploading,
  accountId,
  fetchFolderTree,
}) => {
  const { user } = useAuth();
  const { showToast } = useToastContext();
  //  const { accountId } = useParams();
  const [notifyClient, setNotifyClient] = useState(false);
  const [markAsRead, setMarkAsRead] = useState(false);
  const [notifyFollowers, setNotifyFollowers] = useState(false);
  const [requestApproval, setRequestApproval] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
   const [clientEmail, setClientEmail] = useState("");
  const [sendingApproval, setSendingApproval] = useState(false);
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

    useEffect(() => {
      if (accountId) {
        fetchAccountDetails();
       
      }
    }, [accountId]);
  // Reset when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setNotifyClient(false);
      setMarkAsRead(false);
      setNotifyFollowers(false);
      setRequestApproval(false);
      setDescription("");
      setTags("");
      setSendingApproval(false);
    }
  }, [isOpen]);

  // Handle request approval
  const handleRequestApproval = async (filePath, fileName) => {
    try {
      setSendingApproval(true);
      
      // Get client email from user or account
      // const clientEmail = user?.email || user?.username || "client@example.com";
      
      const fileUrl = `${process.env.REACT_APP_FILE_URL || ''}/uploads/accounts/${filePath}`;

      const payload = {
        filePath: filePath,
        action: "send",
        accountId,
        filename: fileName,
        fileUrl,
        clientEmail,
        description: description || "Review the document for approval",
      };

      const res = await accountDocsAPI.toggleApproval(payload);

      if (res.status === 200 || res.status === 201) {
        showToast({
          title: `Approval request sent to ${clientEmail}`,
          type: "success",
        });
        fetchFolderTree();
        return true;
      } else {
        throw new Error(res.data?.error || "Failed to send approval");
      }
    } catch (error) {
      console.error("Approval request failed:", error);
      showToast({
        title: "Failed to send approval request",
        type: "error",
      });
      return false;
    } finally {
      setSendingApproval(false);
    }
  };

 
const handleUploadWithApproval = async () => {
  const uploadSettings = {
    notifyClient,
    clientEmail,
  };

  if (requestApproval && files.length > 0) {
    // Upload files first
    const uploadSuccess = await onUpload(uploadSettings);

    if (uploadSuccess) {
      // Send approval for each uploaded file
      for (const file of files) {
        const filePath = `${selectedFolder}/${file.name}`;
        await handleRequestApproval(filePath, file.name);
      }
    }
  } else {
    // Regular upload
    await onUpload(uploadSettings);
  }
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[55] overflow-hidden">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Settings</h2>
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
          {/* Selected folder display */}
          {selectedFolder && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
              <p className="text-xs font-medium text-primary mb-0.5">Uploading to</p>
              <p className="text-sm text-foreground break-all">{selectedFolder}</p>
            </div>
          )}

          {/* Files to upload */}
          {files.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Files to upload</p>
              {Array.from(files).map((f, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-sm text-foreground">
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {Math.round(f.size / 1024)} KB
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Settings Section */}
          <div className="space-y-4 border-t border-border pt-4">
            {/* Notify client */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">Notify client</span>
              <input
                type="checkbox"
                checked={notifyClient}
                onChange={(e) => setNotifyClient(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            {/* Mark as read for client */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">Mark as read for client</span>
              <input
                type="checkbox"
                checked={markAsRead}
                onChange={(e) => setMarkAsRead(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            {/* Notify followers when client opens document */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">Notify followers when client opens document</span>
              <input
                type="checkbox"
                checked={notifyFollowers}
                onChange={(e) => setNotifyFollowers(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            {/* Request client approval */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">Request client approval</span>
              <input
                type="checkbox"
                checked={requestApproval}
                onChange={(e) => setRequestApproval(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            {/* Approval info message */}
            {requestApproval && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  📝 Approval request will be sent to client after upload with description: 
                  <span className="font-medium block mt-1">
                    "{description || "Review the document for approval"}"
                  </span>
                </p>
              </div>
            )}

            {/* Add description */}
            <div className="space-y-1">
              <label className="text-sm text-foreground">Add description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add document description"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Add tags */}
            <div className="space-y-1">
              <label className="text-sm text-foreground">Add tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Add tags to all docs (or click up individually)</p>
            </div>

            {/* Lock document to unpaid invoice - Clickable */}
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-colors border border-border"
              onClick={onOpenInvoicePanel}
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Lock document to unpaid invoice</span>
              </div>
              <span className="text-sm text-primary font-medium">Link invoice →</span>
            </div>

            {/* Show selected invoices count */}
            {selectedInvoices.length > 0 && (
              <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg">
                {selectedInvoices.length} invoice(s) linked
              </div>
            )}

            {/* Bank debit info */}
            <div className="rounded-lg bg-muted/30 p-3 border border-border">
              <div className="flex items-start gap-2">
                <Landmark className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Clients paying by bank debit?</span><br />
                  Your firm's admin can now choose when documents unlock — immediately or after the payment clears. Ask them to check locked document settings.
                </p>
              </div>
            </div>

            {/* Jobs */}
            <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Link documents to jobs</span>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">
                Link jobs →
              </button>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              It will help you to automate your document workflow.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleUploadWithApproval}
            className="flex-1"
            disabled={uploading || sendingApproval}
          >
            {sendingApproval 
              ? "Sending Approval..." 
              : uploading 
                ? "Uploading..." 
                : requestApproval 
                  ? "Upload & Request Approval" 
                  : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ================= INVOICE PANEL DRAWER =================
const InvoicePanelDrawer = ({
  isOpen,
  onClose,
  onBack,
  invoiceList,
  selectedInvoices,
  setSelectedInvoices,
  description,
  setDescription,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <Link2 className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Link invoice</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to settings
          </button>

          {/* Description field */}
          <div className="space-y-1">
            <label className="text-sm text-foreground">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Invoice list */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {invoiceList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pending invoices found.
              </p>
            ) : (
              invoiceList.map((inv) => {
                const isSelected = selectedInvoices.includes(inv._id);
                return (
                  <div
                    key={inv._id}
                    onClick={() => {
                      setSelectedInvoices((prev) =>
                        prev.includes(inv._id)
                          ? prev.filter((i) => i !== inv._id)
                          : [...prev, inv._id]
                      );
                    }}
                    className={`rounded-lg border-2 p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {inv.description || inv.invoicenumber || `Invoice #${inv._id.slice(-6)}`}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-foreground">
                          ₹{inv.summary?.total?.toFixed(2) || "0.00"}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          inv.status?.toLowerCase() === "overdue"
                            ? "bg-red-100 text-red-700"
                            : inv.status?.toLowerCase() === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {inv.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected count */}
          {selectedInvoices.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedInvoices.length} invoice(s) selected
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="flex-1"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

// ================= MAIN UPLOAD DRAWER =================
const FileUploadDrawer = ({
  isOpen,
  onClose,
  // folderTree,
  // fetchFolderTree,
  selectedFolderForMenu,
  accountId,onFilesSelected
}) => {
  const { user } = useAuth();
  console.log("hvdhgs accointid",accountId)
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const { showToast } = useToastContext();
   const [folderTree, setFolderTree] = useState([]);

    // Fetch folder tree - Using accountDocsAPI
   // Fetch folder tree - Using accountDocsAPI
const fetchFolderTree = async () => {
  console.log("fetchFolderTree called with accountId:", accountId);
  
  if (!accountId) {
    console.warn("Account ID is missing, cannot fetch folder tree");
    setError("Account ID is required");
    return;
  }

  try {
    const res = await accountDocsAPI.listFoldersAndFiles(accountId);
    console.log("Folder tree response:", res);
    console.log("Folder tree data:", res?.data?.contents);
    setFolderTree(res?.data?.contents || []);
  } catch (err) {
    console.error("Error fetching folder tree:", err);
    console.log("Error details:", err.response?.data || err.message);
    setError("Error fetching folder tree");
  }
};

// Call fetchFolderTree when component mounts or accountId changes
useEffect(() => {
  console.log("AccountId changed or component mounted:", accountId);
  if (accountId) {
    fetchFolderTree();
  }
}, [accountId]);
  // Drawer visibility states
  const [showSettings, setShowSettings] = useState(false);
  const [showInvoicePanel, setShowInvoicePanel] = useState(false);
  
  // Invoice states
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [invoiceDescription, setInvoiceDescription] = useState("");

  // Check if folder is "Firm docs shared with client"
  const isFirmDocsFolder = selectedFolder?.includes("Firm docs shared with client");

  // Reset state when main drawer opens
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
      setShowSettings(false);
      setShowInvoicePanel(false);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFiles([]);
      setMessage("");
      setSelectedInvoices([]);
      setInvoiceDescription("");
      setShowSettings(false);
      setShowInvoicePanel(false);
    }
  }, [isOpen, selectedFolderForMenu]);

  // Fetch invoices when invoice panel opens
  useEffect(() => {
    if (showInvoicePanel) {
      const fetchInvoices = async () => {
        try {
          const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);
          setInvoiceList(res.data?.invoice || []);
        } catch (err) {
          console.error("Error fetching invoices", err);
        }
      };
      fetchInvoices();
    }
  }, [showInvoicePanel, accountId]);

  // File validation
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024;

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        showToast({
          title: `${file.name} exceeds 50MB`,
          type: "error",
        });
        return false;
      }
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        showToast({
          title: `${file.name} is not allowed`,
          type: "error",
        });
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const handleFolderSelect = (path) => {
    setSelectedFolder(path);
    // Close settings when folder changes
    setShowSettings(false);
  };

  // Handle the main action button click (Upload or Next)
  const handleMainAction = () => {
    if (!files.length || !selectedFolder) {
      setMessage("Please select files and folder");
      return;
    }

    // If folder is "Firm docs shared with client", open settings instead of uploading
    if (isFirmDocsFolder) {
      setShowSettings(true);
    } else {
      // Direct upload for non-firm docs folders
      handleUpload();
    }
  };
const handleUpload = async (settings = {}) => {
  try {
    setUploading(true);

    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));

    formData.append("invoices", JSON.stringify(selectedInvoices));
    formData.append("adminUserName", user?.username || "Unknown");
    formData.append("invoiceDescription", invoiceDescription);

    formData.append("notifyClient", settings.notifyClient || false);
    formData.append("clientEmail", settings.clientEmail || "");

    // await accountDocsAPI.uploadFile(formData, selectedFolder);
const result = await accountDocsAPI.uploadFile(formData, selectedFolder);

    // Pass uploaded files back with details
    // if (onFilesSelected && result.data?.files) {
    //   // If API returns file details
    //   const uploadedFiles = result.data.files.map(file => ({
    //     ...file,
    //     name: file.name || file.filename,
    //     url: file.url || file.fileUrl || `/uploads/accounts/${selectedFolder}/${file.name}`,
    //     size: file.size,
    //     path: `${selectedFolder}/${file.name}`,
    //     uploadDate: new Date().toISOString(),
    //   }));
      
    //   onFilesSelected(uploadedFiles);
    // } else {
    //   // Fallback: pass the original files with path info
    //   const uploadedFiles = files.map(file => ({
    //     name: file.name,
    //     size: file.size,
    //     path: `${selectedFolder}/${file.name}`,
    //     url: `/uploads/accounts/${selectedFolder}/${file.name}`,
    //     uploadDate: new Date().toISOString(),
    //   }));
      
    //   onFilesSelected(uploadedFiles);
    // }
    showToast({
      title: "Files uploaded successfully",
      type: "success",
    });

    setSelectedInvoices([]);
    setInvoiceDescription("");
    onClose();
    fetchFolderTree();

    return true;
  } catch (err) {
    console.error(err);

    showToast({
      title: "Upload failed",
      type: "error",
    });

    return false;
  } finally {
    setUploading(false);
  }
};


  // Open invoice panel from settings
  const handleOpenInvoicePanel = () => {
    setShowInvoicePanel(true);
  };

  // Close invoice panel and go back to settings
  const handleCloseInvoicePanel = () => {
    setShowInvoicePanel(false);
  };

  // Save invoice selection and go back to settings
  const handleSaveInvoices = () => {
    if (!selectedInvoices.length) {
      showToast({
        title: "Please select at least one invoice",
        type: "warning",
      });
      return;
    }
    setShowInvoicePanel(false);
    showToast({
      title: `${selectedInvoices.length} invoice(s) linked`,
      type: "success",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* MAIN UPLOAD DRAWER */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
        
        <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <FileUp className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Upload File</h2>
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
            {/* File picker */}
            <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {files.length > 0 ? `${files.length} file(s) selected` : "Click to select files"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Max 50 MB per file. No audio/video.</p>
              </div>
              <input type="file" className="hidden" multiple onChange={handleFileChange} />
            </label>

            {/* Selected files list */}
            {files.length > 0 && (
              <div className="space-y-1">
                {Array.from(files).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-sm text-foreground">
                    <span className="truncate flex-1">{f.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {Math.round(f.size / 1024)} KB
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Folder info badge */}
            {isFirmDocsFolder && files.length > 0 && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  ⚡ Uploading to "Firm docs shared with client". Click "Next" to configure settings.
                </p>
              </div>
            )}

            {/* Message */}
            {message && (
              <p className="text-sm font-medium text-foreground">{message}</p>
            )}

            {/* Folder tree */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Select Folder</p>
              <div className="rounded-lg border border-border bg-background overflow-auto max-h-72">
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
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleMainAction}
              className="flex-1"
              disabled={uploading || !files.length || !selectedFolder}
            >
              {isFirmDocsFolder ? "Next →" : uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>

      {/* SETTINGS DRAWER */}
      <SettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        files={files}
        selectedFolder={selectedFolder}
        onOpenInvoicePanel={handleOpenInvoicePanel}
        selectedInvoices={selectedInvoices}
        // onUpload={handleUpload}
          onUpload={(settings) => handleUpload(settings)}

        uploading={uploading}
        accountId={accountId}
        fetchFolderTree={fetchFolderTree}
      />

      {/* INVOICE PANEL DRAWER */}
      <InvoicePanelDrawer
        isOpen={showInvoicePanel}
        onClose={() => {
          setShowInvoicePanel(false);
          setShowSettings(false);
        }}
        onBack={handleCloseInvoicePanel}
        invoiceList={invoiceList}
        selectedInvoices={selectedInvoices}
        setSelectedInvoices={setSelectedInvoices}
        description={invoiceDescription}
        setDescription={setInvoiceDescription}
        onSave={handleSaveInvoices}
      />
    </>
  );
};

// ================= FOLDER TREE SELECTOR =================
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

              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-primary shrink-0" />
              )}

              <span className="truncate">{item.name}</span>
            </div>

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

export default FileUploadDrawer;