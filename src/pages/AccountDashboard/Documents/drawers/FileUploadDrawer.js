

import React, { useState, useEffect } from "react";

import {useToastContext} from "../../../../context/ToastContext";
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
} from "lucide-react";

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  accountId,
}) => {
  const { user } = useAuth();
const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
const {showToast} = useToastContext();
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

  // Fetch invoices when dialog opens
  useEffect(() => {
    if (invoiceDialogOpen) {
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
  }, [invoiceDialogOpen, accountId]);

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

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (!files.length || !selectedFolder) {
      setMessage("Please select files and folder");
      return;
    }

    // Check for "Firm docs shared with client" folder
    if (selectedFolder.includes("Firm docs shared with client")) {
      try {
        const res = await invoiceAPI.getPendingInvoicesByAccountId(accountId);
        const invoices = res.data?.invoice || [];

        console.log("Fetched invoices:", invoices);
        setInvoiceList(invoices);

        if (invoices.length > 0) {
          setInvoiceConfirmOpen(true);
        } else {
          performUpload();
        }
      } catch (err) {
        console.error("Error fetching invoices", err);
        performUpload();
      }
    } else {
      performUpload();
    }
  };

  const performUpload = async () => {
    try {
       setUploading(true);

      const formData = new FormData();

      files.forEach((file) => formData.append("files", file));
      formData.append("invoices", JSON.stringify(selectedInvoices));
      formData.append("adminUserName", user?.username || "Unknown");

      await accountDocsAPI.uploadFile(formData, selectedFolder);

      showToast({
        title: "Files uploaded successfully",
        type: "success",
      });

      setInvoiceDialogOpen(false);
      setSelectedInvoices([]);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error(err);
      showToast({
        title: "Upload failed",
        type: "error",
      });
    }finally {
    setUploading(false);
  }
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

            {/* Selected folder display */}
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
  onClick={handleUpload}
  className="flex-1"
  disabled={uploading}
>
  {uploading ? "Uploading..." : "Upload"}
</Button>
          </div>
        </div>
      </div>

      {/* INVOICE LOCK CONFIRMATION MODAL */}
      {invoiceConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setInvoiceConfirmOpen(false)} />
          <div className="relative z-[61] w-full max-w-sm rounded-lg bg-background p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">Invoice Lock</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Do you want to lock this file to an invoice?
            </p>
            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
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
            </div>
          </div>
        </div>
      )}

      {/* INVOICE SELECTION MODAL */}
      {invoiceDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setInvoiceDialogOpen(false)} />
          <div className="relative z-[61] w-full max-w-2xl rounded-lg bg-background shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
              <h3 className="text-lg font-semibold text-foreground">Select Invoice(s)</h3>
              <button
                onClick={() => setInvoiceDialogOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto px-5 py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select one or more invoices before uploading.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoiceList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No invoices found.
                        </td>
                      </tr>
                    ) : (
                      invoiceList.map((inv) => {
                        const checked = selectedInvoices.includes(inv._id);
                        return (
                          <tr
                            key={inv._id}
                            onClick={() => {
                              setSelectedInvoices((prev) =>
                                prev.includes(inv._id)
                                  ? prev.filter((i) => i !== inv._id)
                                  : [...prev, inv._id]
                              );
                            }}
                            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                              checked ? "bg-primary/5" : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={checked}
                                readOnly
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {inv.invoicenumber}
                            </td>
                            <td className="px-4 py-3 text-foreground">
                              ₹{inv.summary?.total}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
                Cancel
              </Button>
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
            </div>
          </div>
        </div>
      )}
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

export default FileUploadDrawer;