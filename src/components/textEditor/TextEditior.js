


//working code
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
  Base64UploadAdapter,
} from "ckeditor5";

import EmojiPlugin from "./EmojiPlugin";
import ShortcodePlugin from "./ShortcodePlugin";
import FileUploadPlugin from "./FileUploadPlugin";
import FileUploadDrawer from "../../pages/AccountDashboard/Documents/drawers/FileUploadDrawer";
import "ckeditor5/ckeditor5.css";

//export default function TextEditor() {
export default function TextEditor({ value = "", onChange, type , 

  accountId, onFileUploadComplete }) {
console.log("entred value",value)
    console.log("accountsd in textedotor",accountId)
  const editorRef = useRef(null);
  const fileInputRef = useRef();
  const contactShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Contact Shortcodes", isBold: true },
    { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
    { title: "First Name", isBold: false, value: "FIRST_NAME" },
    { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
    { title: "Last Name", isBold: false, value: "LAST_NAME" },
    { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
    { title: "Country", isBold: false, value: "COUNTRY" },
    { title: "Company name", isBold: false, value: "COMPANY_NAME" },
    { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
    { title: "City", isBold: false, value: "CITY" },
    { title: "State/Province", isBold: false, value: "STATE_PROVINCE" },
    { title: "Zip/Postal code", isBold: false, value: "ZIP_POSTAL_CODE" },
    { title: "Date Shortcodes", isBold: true },
    {
      title: "Current day full date",
      isBold: false,
      value: "CURRENT_DAY_FULL_DATE",
    },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    {
      title: "Current month number",
      isBold: false,
      value: "CURRENT_MONTH_NUMBER",
    },
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
  const accountShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Date Shortcodes", isBold: true },
    {
      title: "Current day full date",
      isBold: false,
      value: "CURRENT_DAY_FULL_DATE",
    },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    {
      title: "Current month number",
      isBold: false,
      value: "CURRENT_MONTH_NUMBER",
    },
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

 // Handle file upload - open drawer
  useEffect(() => {
    const handler = (e) => {
      editorRef.current = e.detail.editor;
      // Open the drawer instead of clicking hidden input
      setShowUploadDrawer(true);
    };

    window.addEventListener("ckeditor-upload-file", handler);

    return () => window.removeEventListener("ckeditor-upload-file", handler);
  }, []);

  // Handle files after upload - AUTO SEND ACTUAL FILES
const handleFilesUploaded = (files) => {
  const editor = editorRef.current;
  if (!editor || !files || files.length === 0) return;

  // Insert a simple indicator that files were uploaded (optional)
  editor.model.change((writer) => {
    const selection = editor.model.document.selection;
    const fileIndicator = writer.createText(`\n\n📎 ${files.length} file(s) attached\n`);
    editor.model.insertContent(fileIndicator, selection);
  });

  // Update the editor content
  const updatedContent = editor.getData();
  if (onChange) {
    onChange(updatedContent);
  }

  // Call the parent callback with the actual files
  if (onFileUploadComplete) {
    onFileUploadComplete(files);
  }

  // Close the drawer
  setShowUploadDrawer(false);
  
  
  
  // Option 1: Use a custom event
  const event = new CustomEvent('auto-send-message', { 
    detail: { files } 
  });
  window.dispatchEvent(event);

};
   // State for file upload drawer
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showShortcodes, setShowShortcodes] = useState(false);
  const [currentEditor, setCurrentEditor] = useState(null);
  
  useEffect(() => {
    const handler = (e) => {
      editorRef.current = e.detail.editor;
      setShowPicker(true);
    };

    window.addEventListener("ckeditor-open-emoji", handler);

    return () => window.removeEventListener("ckeditor-open-emoji", handler);
  }, []);
  
  useEffect(() => {
    const handler = (e) => {
      setCurrentEditor(e.detail.editor);
      setShowShortcodes(true);
    };

    window.addEventListener("ckeditor-open-shortcodes", handler);

    return () => {
      window.removeEventListener("ckeditor-open-shortcodes", handler);
    };
  }, []);
  
  // Handle file upload - open drawer instead of native file input
  useEffect(() => {
    const handler = (e) => {
      editorRef.current = e.detail.editor;
      // Open the drawer instead of clicking hidden input
      setShowUploadDrawer(true);
    };

    window.addEventListener("ckeditor-upload-file", handler);

    return () => window.removeEventListener("ckeditor-upload-file", handler);
  }, []);

  const insertShortcode = (value) => {
    if (!currentEditor) return;

    currentEditor.model.change((writer) => {
      currentEditor.model.insertContent(
        writer.createText(`[${value}]`),
        currentEditor.model.document.selection,
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
        editor.model.document.selection,
      );
    });

    setShowPicker(false);
  };

  // Close functions for dropdowns
  const closeEmojiPicker = () => {
    setShowPicker(false);
  };

  const closeShortcodes = () => {
    setShowShortcodes(false);
    setSearch(""); // Reset search when closing
  };

  const shortcuts = type === "contact" ? contactShortcuts : accountShortcuts;
  const filteredShortcuts = shortcuts.filter((item) => {
    if (item.isBold) return true;

    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase())
    );
  });
  
  // Handle file selection from drawer
  const handleFilesSelected = (uploadedFiles) => {
    const editor = editorRef.current;
    if (!editor || !uploadedFiles || uploadedFiles.length === 0) return;

    // Insert file links or names into the editor
    editor.model.change((writer) => {
      const selection = editor.model.document.selection;
      
      uploadedFiles.forEach((file, index) => {
        const fileText = writer.createText(
          `${index > 0 ? '\n' : ''}[${file.name}]${index < uploadedFiles.length - 1 ? '\n' : ''}`
        );
        editor.model.insertContent(fileText, selection);
      });
    });

    // Notify parent if needed
    if (onFilesSelected) {
      onFilesSelected(uploadedFiles);
    }
  };
  
  const insertFile = (file) => {
    const editor = editorRef.current;

    editor.model.change((writer) => {
      const text = writer.createText(file.name);

      editor.model.insertContent(text, editor.model.document.selection);
    });
  };

  return (
    <div>
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
      
      <FileUploadDrawer
        isOpen={showUploadDrawer}
        onClose={() => {
          setShowUploadDrawer(false);
          setSelectedFolderForMenu(null);
        }}
      
        selectedFolderForMenu={selectedFolderForMenu}
        accountId={accountId}
        onFilesSelected={handleFilesUploaded} // Optional: handle selected files
      />
      
      <div className="w-full ">
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
              FileUploadPlugin,
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
    </div>
  );
}