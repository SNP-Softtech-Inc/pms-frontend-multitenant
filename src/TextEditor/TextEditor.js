
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Font,
  FontColor,
  FontBackgroundColor,
  Alignment,
  List,
  Link,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageInsert,
  BlockQuote,
  Code,
  CodeBlock,
  Autoformat,
  PasteFromOffice,
  Undo,
  Base64UploadAdapter
} from "ckeditor5";
import EmojiPlugin from "./EmojiPlugin";
import ShortcodePlugin from "./ShortcodePlugin";
import FileUploadPlugin from "./FileUploadPlugin";
import "ckeditor5/ckeditor5.css";
import { accountDocsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ================= FOLDER TREE SELECTOR =================
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul style={{ padding: "4px 0", margin: 0, listStyle: "none" }}>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isExpanded = expanded[item.path];
        const isSelected = selectedFolder === item.path;
        const hasChildren = item.children?.length > 0;
        const isReadOnly = item.meta?.readOnly;

        return (
          <li key={item.path} style={{ margin: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "6px",
                margin: "2px 4px",
                cursor: isReadOnly ? "default" : "pointer",
                transition: "all 0.15s",
                paddingLeft: `${12 + level * 16}px`,
                background: isSelected ? "#e3f2fd" : "transparent",
                color: isSelected ? "#1976d2" : "#1a1a1a",
                fontWeight: isSelected ? "500" : "400",
                opacity: isReadOnly ? "0.5" : "1",
                pointerEvents: isReadOnly ? "none" : "auto",
              }}
              onClick={() => !isReadOnly && onSelect(item.path)}
              onMouseEnter={(e) => {
                if (!isSelected && !isReadOnly) {
                  e.currentTarget.style.background = "#f5f8ff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#666",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) toggleExpand(item.path);
                }}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <span>▼</span>
                  ) : (
                    <span>▶</span>
                  )
                ) : (
                  <span style={{ width: "14px", display: "inline-block" }} />
                )}
              </button>

              <span style={{ fontSize: "16px" }}>
                {isExpanded ? "📂" : "📁"}
              </span>

              <span style={{ flex: 1, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.name}
              </span>

              {isSelected && (
                <span style={{ color: "#1976d2", fontSize: "14px" }}>✓</span>
              )}
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

// ================= MAIN UPLOAD DRAWER =================
const FileUploadDrawer = ({
  isOpen,
  onClose,
  accountId,
  files: selectedFiles,
  onConfirm,
  onFileUploadComplete,
}) => {
    const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderTree, setFolderTree] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch folder tree when drawer opens
  useEffect(() => {
    if (isOpen && accountId) {
      fetchFolderTree();
    }
  }, [isOpen, accountId]);

  // Set files when prop changes
  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  }, [selectedFiles]);

  const fetchFolderTree = async () => {
    if (!accountId) {
      setError("Account ID is required");
      return;
    }

    setLoadingFolders(true);
    setError(null);

    try {
      const res = await accountDocsAPI.clientListFoldersAndFiles(accountId);
      console.log("Folder tree response:", res);
      
      let treeData = [];
      if (res?.data?.contents) {
        treeData = res.data.contents;
      } else if (res?.contents) {
        treeData = res.contents;
      } else if (Array.isArray(res?.data)) {
        treeData = res.data;
      } else if (Array.isArray(res)) {
        treeData = res;
      }

      setFolderTree(treeData);
      
      // Auto-select first folder if available
      // if (treeData.length > 0 && !selectedFolder) {
      //   const firstFolder = findFirstFolder(treeData);
      //   if (firstFolder) {
      //     setSelectedFolder(firstFolder.path);
      //   }
      // }
    } catch (err) {
      console.error("Error fetching folder tree:", err);
      setError("Error fetching folder tree");
      // Fallback folders
      setFolderTree([
        {
          id: "client_uploaded",
          name: "Client uploaded documents",
          type: "folder",
          path: "Client uploaded documents",
          children: []
        },
        {
          id: "firm_docs_shared",
          name: "Firm docs shared with client",
          type: "folder",
          path: "Firm docs shared with client",
          children: []
        }
      ]);
    } finally {
      setLoadingFolders(false);
    }
  };

  const findFirstFolder = (items) => {
    for (const item of items) {
      if (item.type === "folder") {
        return item;
      }
      if (item.children) {
        const found = findFirstFolder(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFolderSelect = (path) => {
    setSelectedFolder(path);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024;

    const validFiles = selected.filter((file) => {
      if (file.size > maxSize) {
        setMessage(`${file.name} exceeds 50MB`);
        return false;
      }
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        setMessage(`${file.name} is not allowed`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
    setMessage("");
  };
// In FileUploadDrawer component - update handleUpload function

// const handleUpload = async () => {
//   if (!files.length || !selectedFolder) {
//     setMessage("Please select files and folder");
//     return;
//   }

//   setUploading(true);
//   setMessage("");

//   try {
//     const formData = new FormData();

//     files.forEach((file) => formData.append("files", file));
//     formData.append("adminUserName", user?.username || "Unknown");

//     const res = await accountDocsAPI.uploadFile(formData, selectedFolder);

//     console.log("Upload response:", res);

//     if (res.status === 200 || res.status === 201) {
//       // Files returned from the upload API
//       const uploadedFiles = res.data?.files || [];

//       // Your website base URL
//       const baseUrl = process.env.REACT_APP_FOLDER_MANAGEMENT;

//       const fileLinks = uploadedFiles.map((file, index) => {
//         const fileName =
//           file.originalname || file.filename || `File ${index + 1}`;

//         const fileSize = file.size || 0;

//         const sizeKB = Math.round(fileSize / 1024);
//         const sizeStr =
//           sizeKB > 1024
//             ? `${(sizeKB / 1024).toFixed(1)} MB`
//             : `${sizeKB} KB`;

//         // Convert absolute server path to public URL
//         // Example:
//         // /var/www/pms-backend-multitenant/folder-mangement/uploads/accounts/...
//         // ->
//         // https://www.snptaxes.com/uploads/accounts/...
//         let fileUrl = "#";

//         if (file.path) {
//           const publicPath = file.path
//             .replace(/\\/g, "/")
//             .replace(
//               "/var/www/pms-backend-multitenant/folder-mangement/",
//               ""
//             );

//           fileUrl = `${baseUrl}/${encodeURI(publicPath)}`;
//         }

//         return `
//           <a
//             href="${fileUrl}"
//             target="_blank"
//             rel="noopener noreferrer"
//             style="
//               color:#1976d2;
//               text-decoration:none;
//               font-weight:500;

//               padding:2px 0;
//               display:inline-block;
//             "
//           >
//             📎 ${fileName}
//           </a>
        
//         `;
//       });
//         // <span style="color:#666;font-size:12px;">
//         //     (${sizeStr})
//         //   </span>

//       const fileMessage = fileLinks.join("<br>");

//       // Send HTML message to chat
//       if (onFileUploadComplete) {
//         onFileUploadComplete(uploadedFiles, fileMessage, true);
//       }

//       if (onConfirm) {
//         onConfirm(selectedFolder, uploadedFiles);
//       }

//       setMessage(`${uploadedFiles.length} file(s) uploaded successfully!`);

//       setTimeout(() => {
//         setFiles([]);
//         setSelectedFolder("");
//         setMessage("");
//         setUploading(false);
//         onClose();
//       }, 1000);
//     } else {
//       throw new Error(res.data?.message || "Upload failed");
//     }
//   } catch (err) {
//     console.error("Upload failed:", err);

//     setMessage(
//       `Upload failed: ${
//         err.response?.data?.message || err.message || "Unknown error"
//       }`
//     );
//   } finally {
//     setUploading(false);
//   }
// };
const handleUpload = async () => {
  if (!files.length || !selectedFolder) {
    setMessage("Please select files and folder");
    return;
  }

  setUploading(true);
  setMessage("");

  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("adminUserName", user?.username || "Unknown");

    const res = await accountDocsAPI.uploadFile(formData, selectedFolder);
    console.log("Upload response:", res);

    if (res.status === 200 || res.status === 201) {
      const uploadedFiles = res.data?.files || [];
      const baseUrl = process.env.REACT_APP_FOLDER_MANAGEMENT;

      // Helper function to check if file is an image
      const isImageFile = (file) => {
        const fileName = file.originalname || file.filename || file.name || '';
        const ext = fileName.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'].includes(ext);
      };

      // Generate HTML for files - images as actual images, others as links
      let fileHtml = '';
      
      uploadedFiles.forEach((file) => {
        const fileName = file.originalname || file.filename || file.name || 'file';
        const fileSize = file.size || 0;
        const sizeKB = Math.round(fileSize / 1024);
        const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
        
        if (file.path) {
          const publicPath = file.path
            .replace(/\\/g, "/")
            .replace("/var/www/pms-backend-multitenant/folder-mangement/", "");
          const fileUrl = `${baseUrl}/${encodeURI(publicPath)}`;
          
          if (isImageFile(file)) {
            // For images - display the actual image with click to enlarge
            fileHtml += `
              <div style=" display: inline-block; max-width: 100%;">
                <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" 
                   style="display: block; text-decoration: none;">
                  <img src="${fileUrl}" alt="${fileName}" 
                    style=" width: auto; height: auto;
                           border-radius: 8px; border: 1px solid #e0e0e0; 
                           cursor: pointer; object-fit: contain;
                           background: #f5f5f5; padding: 4px;
                           transition: transform 0.2s, box-shadow 0.2s;"
                    onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';"
                  />
                </a>
              </div>
            `;
                            // <div style="font-size: 11px; color: #888; margin-top: 4px; text-align: center; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                //   ${fileName} (${sizeStr})
                // </div>

          } else {
            // For non-image files - show as links
            fileHtml += `
              <div >
                <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" 
                  style="color: #1976d2; text-decoration: none; font-weight: 500; 
                        display: inline-block; padding: 2px 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  📎 ${fileName}
                  <span style="color: #666; font-size: 12px; font-weight: normal;">(${sizeStr})</span>
                </a>
              </div>
            `;
          }
        }
      });

      const fileMessage = fileHtml;

      // Send to parent component with HTML flag
      if (onFileUploadComplete) {
        onFileUploadComplete(uploadedFiles, fileMessage, true);
      }

      if (onConfirm) {
        onConfirm(selectedFolder, uploadedFiles);
      }

      setMessage(`${uploadedFiles.length} file(s) uploaded successfully!`);

      setTimeout(() => {
        setFiles([]);
        setSelectedFolder("");
        setMessage("");
        setUploading(false);
        onClose();
      }, 1000);
    } else {
      throw new Error(res.data?.message || "Upload failed");
    }
  } catch (err) {
    console.error("Upload failed:", err);
    setMessage(
      `Upload failed: ${
        err.response?.data?.message || err.message || "Unknown error"
      }`
    );
  } finally {
    setUploading(false);
  }
};
  // Remove file from list
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const fileCount = files?.length || 0;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 99998,
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Left Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "450px",
          maxWidth: "90%",
          background: "white",
          zIndex: 99999,
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e8ecf0",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>📎</span>
            <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#1a1a1a" }}>
              Upload File{fileCount > 1 ? 's' : ''}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#666",
              padding: "4px 8px",
              borderRadius: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
         

          {/* Selected files list */}
          {files.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {Array.from(files).map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "8px",
                    background: "#f5f7fa",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#1a1a1a",
                  }}
                >
                  <span>📄</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.name}
                  </span>
                  <span style={{ fontSize: "11px", color: "#666", whiteSpace: "nowrap" }}>
                    {Math.round(f.size / 1024)} KB
                  </span>
                  <button
                    onClick={() => removeFile(i)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#999",
                      fontSize: "16px",
                      padding: "0 4px",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#d32f2f"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#999"}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "13px",
                background: message.includes("failed") ? "#ffebee" : "#e8f5e9",
                color: message.includes("failed") ? "#c62828" : "#2e7d32",
              }}
            >
              {message}
            </div>
          )}

          {/* Folder tree */}
          <div>
            <p style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 8px", color: "#1a1a1a" }}>
              Select Folder
            </p>
            <div
              style={{
                borderRadius: "8px",
                border: "1px solid #e8ecf0",
                background: "white",
                overflow: "auto",
                maxHeight: "280px",
              }}
            >
              {loadingFolders ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    border: "3px solid #f3f3f3",
                    borderTop: "3px solid #1976d2",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 8px",
                  }} />
                  Loading folders...
                </div>
              ) : error ? (
                <div style={{ padding: "16px", textAlign: "center", color: "#d32f2f" }}>
                  ⚠️ {error}
                </div>
              ) : folderTree.length === 0 ? (
                <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
                  No folders available
                </div>
              ) : (
                <FolderTreeSelector
                  items={folderTree}
                  onSelect={handleFolderSelect}
                  selectedFolder={selectedFolder}
                />
              )}
            </div>
          </div>

          
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            padding: "16px 20px",
            borderTop: "1px solid #e8ecf0",
            flexShrink: 0,
            background: "#fafafa",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #d0d5dd",
              background: "white",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              color: "#333",
              transition: "all 0.2s",
              flex: 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !files.length || !selectedFolder}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: (!uploading && files.length && selectedFolder) ? "#1976d2" : "#e8ecf0",
              color: (!uploading && files.length && selectedFolder) ? "white" : "#999",
              cursor: (!uploading && files.length && selectedFolder) ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s",
              flex: 1,
            }}
            onMouseEnter={(e) => {
              if (!uploading && files.length && selectedFolder) {
                e.currentTarget.style.background = "#1565c0";
              }
            }}
            onMouseLeave={(e) => {
              if (!uploading && files.length && selectedFolder) {
                e.currentTarget.style.background = "#1976d2";
              }
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

// ================= MAIN TEXT EDITOR COMPONENT =================
export default function TextEditor({ 
  value = "", onChange,
  accountId, 

  onFileUploadComplete 
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef();
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showShortcodes, setShowShortcodes] = useState(false);
  const [currentEditor, setCurrentEditor] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFolderDrawer, setShowFolderDrawer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const accountShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Date Shortcodes", isBold: true },
    { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
    { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
    { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
    { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
    { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
    { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
    { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
    { title: "Last week", isBold: false, value: "LAST_WEEK" },
    { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
    { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
    { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
    { title: "Last year", isBold: false, value: "LAST_YEAR" },
    { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
    { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
    { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
    { title: "Next week", isBold: false, value: "NEXT_WEEK" },
    { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
    { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
    { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
    { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  ];

  // Handler for file upload event from CKEditor
  useEffect(() => {
    const handler = e => {
      editorRef.current = e.detail.editor;
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    window.addEventListener("ckeditor-upload-file", handler);
    return () => window.removeEventListener("ckeditor-upload-file", handler);
  }, []);

  // Handler for emoji picker
  useEffect(() => {
    const handler = (e) => {
      editorRef.current = e.detail.editor;
      setShowPicker(true);
    };

    window.addEventListener("ckeditor-open-emoji", handler);
    return () => window.removeEventListener("ckeditor-open-emoji", handler);
  }, []);

  // Handler for shortcodes
  useEffect(() => {
    const handler = (e) => {
      setCurrentEditor(e.detail.editor);
      setShowShortcodes(true);
    };

    window.addEventListener("ckeditor-open-shortcodes", handler);
    return () => window.removeEventListener("ckeditor-open-shortcodes", handler);
  }, []);

  const insertShortcode = (value) => {
    if (!currentEditor) return;

    currentEditor.model.change((writer) => {
      currentEditor.model.insertContent(
        writer.createText(`[${value}]`),
        currentEditor.model.document.selection
      );
    });

    setShowShortcodes(false);
  };

  const insertEmoji = (emojiData) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.model.change((writer) => {
      editor.model.insertContent(
        writer.createText(emojiData.emoji),
        editor.model.document.selection
      );
    });

    setShowPicker(false);
  };

  const filteredShortcuts = accountShortcuts.filter((item) => {
    if (item.isBold) return true;
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Handle file selection from input
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);
    setShowFolderDrawer(true);
    e.target.value = null;
  };

  // Handle folder confirmation and file upload
  const handleFolderConfirm = async (folderId, files) => {
    // This is now handled in the FileUploadDrawer component
    console.log("Folder confirmed:", folderId, files);
  };

  const closeDrawer = () => {
    setShowFolderDrawer(false);
    setSelectedFiles([]);
  };
 // Close functions for dropdowns
  const closeEmojiPicker = () => {
    setShowPicker(false);
  };

  const closeShortcodes = () => {
    setShowShortcodes(false);
    setSearch(""); // Reset search when closing
  };

  return (
    <div style={{ position: "relative" }}>
      {/* {showPicker && (
        <div
          style={{
            position: "absolute",
            top: 45,
            left: 10,
            zIndex: 9999,
          }}
        >
          <EmojiPicker onEmojiClick={insertEmoji} />
        </div>
      )}

      {showShortcodes && (
        <div
          style={{
            position: "absolute",
            top: 45,
            left: 10,
            width: 380,
            maxHeight: 450,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 8px 25px rgba(0,0,0,.18)",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          <div style={{ padding: 12 }}>
            <input
              placeholder="Search shortcodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 6,
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              maxHeight: 360,
              overflowY: "auto",
            }}
          >
            {filteredShortcuts.map((item, index) =>
              item.isBold ? (
                <div
                  key={index}
                  style={{
                    padding: "10px 16px",
                    background: "#f7f7f7",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  {item.title}
                </div>
              ) : (
                <div
                  key={index}
                  onClick={() => insertShortcode(item.value)}
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f8ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <div>{item.title}</div>
                  <div
                    style={{
                      color: "#1976d2",
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {"[" + item.value + "]"}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )} */}
 {showPicker && (
        <div
          style={{
            zIndex: 9999,
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <button
            onClick={closeEmojiPicker}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              zIndex: 10000,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f0f0')}
            aria-label="Close emoji picker"
          >
            ✕
          </button>
          <EmojiPicker onEmojiClick={insertEmoji} />
        </div>
      )}
      
      {showShortcodes && (
        <div
          style={{
            zIndex: 9999,
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '320px',
            maxWidth: '90vw',
            position: 'relative',
          }}
        >
          <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Shortcodes</span>
            <button
              onClick={closeShortcodes}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background 0.2s',
                color: '#666',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              aria-label="Close shortcodes"
            >
              ✕
            </button>
          </div>
          
          <div style={{ padding: 12 }}>
            <input
              placeholder="Search shortcodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 6,
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            />
          </div>

          <div
            style={{
              maxHeight: 360,
              overflowY: "auto",
            }}
          >
            {filteredShortcuts.map((item, index) =>
              item.isBold ? (
                <div
                  key={index}
                  style={{
                    padding: "10px 16px",
                    background: "#f7f7f7",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  {item.title}
                </div>
              ) : (
                <div
                  key={index}
                  onClick={() => insertShortcode(item.value)}
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f8ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <div>{item.title}</div>

                  <div
                    style={{
                      color: "#1976d2",
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {"[" + item.value + "]"}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}
      {/* File input - hidden */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
      />

      {/* File Upload Drawer - Left side */}
      <FileUploadDrawer
        isOpen={showFolderDrawer}
        onClose={closeDrawer}
        accountId={accountId}
        files={selectedFiles}
        onConfirm={handleFolderConfirm}
        onFileUploadComplete={onFileUploadComplete}
      />

      {/* Loading overlay */}
      {isUploading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999999,
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #1976d2",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px"
            }} />
            <div>Uploading files...</div>
          </div>
        </div>
      )}

      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",

          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Font,
            FontColor,
            FontBackgroundColor,
            Alignment,
            List,
            Link,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            Image,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            ImageResize,
            ImageInsert,
            BlockQuote,
            Code,
            CodeBlock,
            Autoformat,
            PasteFromOffice,
            Base64UploadAdapter,
            Undo,
            EmojiPlugin,
            ShortcodePlugin,
            FileUploadPlugin
          ],

          toolbar: [
            "undo",
            "redo",

            "|",

            "emoji",
            "shortcodes",
            "attachFile",

            "|",

            "heading",

            "|",

            "fontFamily",
            "fontSize",

            "|",

            "fontColor",
            "fontBackgroundColor",

            "|",

            "bold",
            "italic",
            "underline",
            "strikethrough",

            "|",

            "alignment",

            "|",

            "bulletedList",
            "numberedList",

            "|",

            "link",

            "insertTable",

            "blockQuote",

            "code",

            "codeBlock",

            "insertImage",
          ],

          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
            ],
          },
        }}
         onReady={(editor) => {
            console.log("Editor Ready");
          }}
          onChange={(event, editor) => {
            const data = editor.getData();

            if (onChange) {
              onChange(data);
            }
          }}
      />
    </div>
  );
}