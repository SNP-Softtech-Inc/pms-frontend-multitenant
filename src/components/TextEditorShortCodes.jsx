// import { useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import EmojiPicker from "emoji-picker-react";
// import "quill/dist/quill.snow.css";
// import { createPortal } from 'react-dom';
// import ShortcodePopover from './ShortcodePopover'; // Make sure this path is correct

// // Register custom shortcode blot/format
// const Inline = Quill.import('blots/inline');
// class ShortcodeBlot extends Inline {
//   static create(value) {
//     const node = super.create();
//     node.setAttribute('data-shortcode', value);
//     node.setAttribute('contenteditable', 'false');
//     node.style.backgroundColor = '#e8f0fe';
//     node.style.padding = '2px 4px';
//     node.style.borderRadius = '4px';
//     node.style.fontFamily = 'monospace';
//     node.style.fontSize = '12px';
//     node.style.color = '#1a73e8';
//     node.innerText = `[${value}]`;
//     return node;
//   }

//   static value(node) {
//     return node.getAttribute('data-shortcode');
//   }
// }
// ShortcodeBlot.blotName = 'shortcode';
// ShortcodeBlot.tagName = 'span';
// Quill.register(ShortcodeBlot);

// export default function TextEditor({ value, onChange, selectedOption = "contacts" }) {
//   const editorRef = useRef(null);
//   const quillRef = useRef(null);
//   const emojiButtonRef = useRef(null);
//   const shortcodeButtonRef = useRef(null);

//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [shortcuts, setShortcuts] = useState([]);
//   const [popoverAnchor, setPopoverAnchor] = useState(null);
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//   const [savedSelection, setSavedSelection] = useState(null);

//   // Load shortcuts
//   useEffect(() => {
//     if (selectedOption === "contacts" || selectedOption === "account") {
//       const accountShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         { title: "Contact Shortcodes", isBold: true },
//         { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
//         { title: "First Name", isBold: false, value: "FIRST_NAME" },
//         { title: "Last Name", isBold: false, value: "LAST_NAME" },
//         { title: "Phone Number", isBold: false, value: "PHONE_NUMBER" },
//         { title: "Date Shortcodes", isBold: true },
//         { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
//         { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
//         { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//       ];
//       setShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);

//   useEffect(() => {
//     if (!editorRef.current || quillRef.current) return;

//     quillRef.current = new Quill(editorRef.current, {
//       theme: "snow",
//       placeholder: "Write something...",
//       modules: {
//         toolbar: [
//           [{ 'font': [] }],
//           [{ header: [1, 2, 3, false] }],
//           ["bold", "italic", "underline", "strike"],
//           [{ color: [] }, { background: [] }],
//           [{ list: "ordered" }, { list: "bullet" }],
//           [{ align: [] }],
//           ["blockquote", "code-block"],
//           ["link", "image"],
//           ["clean"],
//         ],
//       },
//     });

//     const toolbar = quillRef.current.getModule("toolbar").container;

//     // Add Emoji button
//     const emojiBtn = document.createElement("button");
//     emojiBtn.type = "button";
//     emojiBtn.innerHTML = "😊";
//     emojiBtn.title = "Emoji";
//     emojiBtn.style.fontSize = "18px";
//     emojiBtn.style.padding = "0 8px";
//     toolbar.appendChild(emojiBtn);
//     emojiButtonRef.current = emojiBtn;

//     emojiBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       setShowEmojiPicker((prev) => !prev);
//     });

//     // Add Shortcode button
//     const shortcodeBtn = document.createElement("button");
//     shortcodeBtn.type = "button";
//     shortcodeBtn.className = "ql-shortcode";
//     shortcodeBtn.title = "Insert Shortcode";
//     shortcodeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="pointer-events: none;"><path d="M13 3L13 21"/><path d="M8 8L3 12L8 16"/><path d="M16 8L21 12L16 16"/></svg>`;
//     shortcodeBtn.style.display = 'inline-flex';
//     shortcodeBtn.style.alignItems = 'center';
//     shortcodeBtn.style.justifyContent = 'center';
//     shortcodeBtn.style.width = '28px';
//     shortcodeBtn.style.height = '24px';
//     shortcodeBtn.style.cursor = 'pointer';
//     shortcodeBtn.style.background = 'transparent';
//     shortcodeBtn.style.border = 'none';
//     shortcodeBtn.style.borderRadius = '3px';
//     shortcodeBtn.style.color = '#444';
//     shortcodeBtn.style.padding = '0';
//     shortcodeBtn.style.margin = '0 2px';
    
//     toolbar.appendChild(shortcodeBtn);
//     shortcodeButtonRef.current = shortcodeBtn;

//     shortcodeBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation();
      
//       if (isPopoverOpen) {
//         handleClose();
//       } else {
//         handleOpen(e);
//       }
//     });

//     quillRef.current.on("text-change", () => {
//       onChange?.(quillRef.current.root.innerHTML);
//     });

//     // Add styles for the shortcode button
//     const style = document.createElement('style');
//     style.textContent = `
//       .ql-shortcode:hover {
//         background-color: #e5e7eb !important;
//         color: #000 !important;
//       }
//       .ql-shortcode svg {
//         width: 14px;
//         height: 14px;
//         stroke: currentColor;
//         stroke-width: 2;
//         fill: none;
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       // Cleanup
//       if (emojiBtn) {
//         emojiBtn.removeEventListener("click", () => {});
//       }
//       if (shortcodeBtn) {
//         shortcodeBtn.removeEventListener("click", () => {});
//       }
//       if (style.parentNode) {
//         style.parentNode.removeChild(style);
//       }
//     };
//   }, [onChange]);

//   useEffect(() => {
//     if (
//       quillRef.current &&
//       value !== quillRef.current.root.innerHTML
//     ) {
//       quillRef.current.root.innerHTML = value || "";
//     }
//   }, [value]);

//   const saveCurrentSelection = () => {
//     if (quillRef.current) {
//       const editor = quillRef.current;
//       const selection = editor.getSelection();
//       if (selection) {
//         setSavedSelection(selection);
//       } else {
//         setSavedSelection({ index: editor.getLength(), length: 0 });
//       }
//     }
//   };

//   const handleOpen = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     saveCurrentSelection();
//     setPopoverAnchor(shortcodeButtonRef.current);
//     setIsPopoverOpen(true);
//   };

//   const handleClose = () => {
//     setPopoverAnchor(null);
//     setIsPopoverOpen(false);
    
//     setTimeout(() => {
//       if (quillRef.current) {
//         const editor = quillRef.current;
//         editor.focus();
//         if (savedSelection) {
//           editor.setSelection(savedSelection.index, savedSelection.length);
//         }
//       }
//     }, 50);
//   };

//   const handleInsertShortcut = (value) => {
//     if (quillRef.current && value) {
//       const editor = quillRef.current;
//       editor.focus();
      
//       let range = savedSelection;
//       if (!range) {
//         range = editor.getSelection();
//       }
      
//       if (!range) {
//         range = { index: editor.getLength(), length: 0 };
//       }
      
//       // Insert text format
//       editor.insertText(range.index, `[${value}]`);
//       const newPosition = range.index + value.length + 2;
//       editor.setSelection(newPosition, 0);
//       setSavedSelection(null);
//     }
    
//     handleClose();
//   };

//   const handleEmojiClick = (emojiData) => {
//     const quill = quillRef.current;

//     if (!quill) return;

//     const range = quill.getSelection(true);
//     const index = range ? range.index : quill.getLength();

//     quill.insertText(index, emojiData.emoji);
//     quill.setSelection(index + emojiData.emoji.length);

//     setShowEmojiPicker(false);
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       {showEmojiPicker && (
//         <div
//           style={{
//             position: "absolute",
//             top: 45,
//             right: 0,
//             zIndex: 1000,
//           }}
//         >
//           <EmojiPicker onEmojiClick={handleEmojiClick} />
//         </div>
//       )}
 
//       <div ref={editorRef} style={{ minHeight: 300 }} />

//       {typeof document !== 'undefined' && createPortal(
//         <ShortcodePopover
//           open={isPopoverOpen}
//           anchorEl={popoverAnchor}
//           onClose={handleClose}
//           shortcuts={shortcuts}
//           onSelectShortcut={handleInsertShortcut}
//         />,
//         document.body
//       )}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import EmojiPicker from "emoji-picker-react";
import { createPortal } from "react-dom";
import ShortcodePopover from "./ShortcodePopover";
import "quill/dist/quill.snow.css";

export default function TextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const shortcodeButtonRef = useRef(null);

const [shortcuts, setShortcuts] = useState([]);

const [isPopoverOpen, setIsPopoverOpen] = useState(false);
const [savedSelection, setSavedSelection] = useState(null);
  const [selectedOption] = useState("contacts");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Load shortcuts
  useEffect(() => {
    if (selectedOption === "contacts" || selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone Number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write something...",
      modules: {
        toolbar: [  [{ 'font': [] },],
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    // Add Emoji button to toolbar
    const toolbar = quillRef.current.getModule("toolbar").container;

    const emojiBtn = document.createElement("button");
    emojiBtn.type = "button";
    emojiBtn.innerHTML = "😊";
    emojiBtn.title = "Emoji";
    emojiBtn.style.fontSize = "18px";
    emojiBtn.style.padding = "0 8px";
const shortcodeBtn = document.createElement("button");
shortcodeBtn.type = "button";
shortcodeBtn.innerHTML = "{}";
shortcodeBtn.title = "Insert Shortcode";

toolbar.appendChild(shortcodeBtn);

shortcodeButtonRef.current = shortcodeBtn;
    toolbar.appendChild(emojiBtn);

    emojiButtonRef.current = emojiBtn;

    emojiBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setShowEmojiPicker((prev) => !prev);
    });

    shortcodeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const quill = quillRef.current;
      if (!quill) return;

      const range = quill.getSelection(true);
      if (!range) return;

      setSavedSelection(range);
      setIsPopoverOpen(true);
    });

    quillRef.current.on("text-change", () => {
      onChange?.(quillRef.current.root.innerHTML);
    });
  }, [onChange]);

  useEffect(() => {
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);
const handleInsertShortcut = (value) => {
    const quill = quillRef.current;
    if (!quill || !value) return;

    const range = savedSelection || quill.getSelection(true);
    if (!range) return;

    quill.insertText(range.index, `[${value}]`);
    quill.setSelection(range.index + value.length + 2);
    setSavedSelection(null);
    setIsPopoverOpen(false);
  };    
  const handleClose = () => {
    setIsPopoverOpen(false);
    setSavedSelection(null);
  };
  const handleEmojiClick = (emojiData) => {
    const quill = quillRef.current;

    if (!quill) return;

    const range = quill.getSelection(true);

    const index = range ? range.index : quill.getLength();

    quill.insertText(index, emojiData.emoji);
    quill.setSelection(index + emojiData.emoji.length);

    setShowEmojiPicker(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {showEmojiPicker && (
        <div
          style={{
            position: "absolute",
            top: 45,
            right: 0,
            zIndex: 1000,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
   {createPortal(
        <ShortcodePopover
          open={isPopoverOpen}
          anchorEl={shortcodeButtonRef.current}
          onClose={handleClose}
          shortcuts={shortcuts}
          onSelectShortcut={handleInsertShortcut}
        />,
        document.body
      )}
      <div ref={editorRef} style={{ minHeight: 300 }} />
    </div>
  );
}