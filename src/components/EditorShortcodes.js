
// // import React, { useEffect, useState, useRef } from 'react';
// // import { Box, Button } from '@mui/material';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css';
// // import 'quill-emoji/dist/quill-emoji.css';
// // import Quill from 'quill';
// // import 'quill-emoji';

// // import ShortcodePopover from './ShortcodePopover';

// // Quill.register('modules/emoji', require('quill-emoji'));

// // export default function Editor({ initialContent, onChange }) {
// //   const [editorContent, setEditorContent] = useState(initialContent || '');
// //   const [shortcuts, setShortcuts] = useState([]);
// //   const [anchorEl, setAnchorEl] = useState(null);
// //   const quillRef = useRef(null);

// //   const [selectedOption] = useState("contacts");

// //   // Load shortcuts
// //   useEffect(() => {
// //     if (selectedOption === "contacts" || selectedOption === "account") {
// //       const accountShortcuts = [
// //         { title: "Account Shortcodes", isBold: true },
// //         { title: "Account Name", value: "ACCOUNT_NAME" },

// //         { title: "Date Shortcodes", isBold: true },
// //         { title: "Current day full date", value: "CURRENT_DAY_FULL_DATE" },
// //         { title: "Current day number", value: "CURRENT_DAY_NUMBER" },
// //         { title: "Current day name", value: "CURRENT_DAY_NAME" },
// //         { title: "Current week", value: "CURRENT_WEEK" },
// //         { title: "Current month number", value: "CURRENT_MONTH_NUMBER" },
// //         { title: "Current month name", value: "CURRENT_MONTH_NAME" },
// //         { title: "Current quarter", value: "CURRENT_QUARTER" },
// //         { title: "Current year", value: "CURRENT_YEAR" },
// //         { title: "Last day full date", value: "LAST_DAY_FULL_DATE" },
// //         { title: "Last day number", value: "LAST_DAY_NUMBER" },
// //         { title: "Last day name", value: "LAST_DAY_NAME" },
// //         { title: "Last week", value: "LAST_WEEK" },
// //         { title: "Last month number", value: "LAST_MONTH_NUMBER" },
// //         { title: "Last month name", value: "LAST_MONTH_NAME" },
// //         { title: "Last quarter", value: "LAST_QUARTER" },
// //         { title: "Last_year", value: "LAST_YEAR" },
// //         { title: "Next day full date", value: "NEXT_DAY_FULL_DATE" },
// //         { title: "Next day number", value: "NEXT_DAY_NUMBER" },
// //         { title: "Next day name", value: "NEXT_DAY_NAME" },
// //         { title: "Next week", value: "NEXT_WEEK" },
// //         { title: "Next month number", value: "NEXT_MONTH_NUMBER" },
// //         { title: "Next month name", value: "NEXT_MONTH_NAME" },
// //         { title: "Next quarter", value: "NEXT_QUARTER" },
// //         { title: "Next year", value: "NEXT_YEAR" },
// //       ];

// //       setShortcuts(accountShortcuts);
// //     }
// //   }, [selectedOption]);

// //   // Open popover
// //   const handleOpen = (event) => {
// //     setAnchorEl(event.currentTarget);
// //   };

// //   // Close popover
// //   const handleClose = () => {
// //     setAnchorEl(null);
// //   };

// //   // ✅ Insert shortcode into Quill
// //   const handleInsertShortcut = (value) => {
// //     if (quillRef.current) {
// //       const editor = quillRef.current.getEditor();

// //       editor.focus();

// //       let range = editor.getSelection();

// //       if (!range) {
// //         range = { index: editor.getLength(), length: 0 };
// //       }

// //       editor.insertText(range.index, `[${value}]`);
// //       editor.setSelection(range.index + value.length + 2);
// //     }

// //     handleClose();
// //   };

// //   // Handle content change
// //   const handleEditorChange = (content) => {
// //     setEditorContent(content);
// //     onChange(content);
// //   };

// //   useEffect(() => {
// //     if (initialContent) {
// //       setEditorContent(initialContent);
// //     }
// //   }, [initialContent]);

// //   // Toolbar config
// //   const modules = {
// //     toolbar: [
// //       [{ font: [] }, { size: [] }],
// //       [{ header: '1' }, { header: '2' }, { align: [] }],
// //       ['bold', 'italic', 'underline', 'strike'],
// //       [{ script: 'sub' }, { script: 'super' }],
// //       [{ list: 'ordered' }, { list: 'bullet' }],
// //       [{ color: [] }, { background: [] }],
// //       ['blockquote', 'code-block'],
// //       ['link', 'image'],
// //       [{ emoji: true }],
// //       [{ indent: '-1' }, { indent: '+1' }],
// //       ['clean'],
// //     ],
// //     'emoji-toolbar': true,
// //     'emoji-shortname': true,
// //   };

// //   const formats = [
// //     'header', 'font', 'size',
// //     'bold', 'italic', 'underline', 'strike',
// //     'script', 'list', 'bullet', 'indent',
// //     'color', 'background', 'align',
// //     'blockquote', 'code-block', 'link', 'image',
// //     'emoji'
// //   ];

// //   return (
// //     <Box
// //       sx={{
// //         "& .ql-editor": {
// //           minHeight: "150px",
// //         }
// //       }}
// //     >
// //       <ReactQuill
// //         ref={quillRef}
// //         value={editorContent}
// //         onChange={handleEditorChange}
// //         modules={modules}
// //         formats={formats}
// //         theme="snow"
// //       />

// //       {/* Button */}
// //       <Button
// //         variant="outlined"
// //         size="small"
// //         onClick={handleOpen}
// //         sx={{ mt: 2, textTransform: "none" }}
// //       >
// //         Add Shortcode
// //       </Button>

// //       {/* ✅ Reusable Popover */}
// //       <ShortcodePopover
// //         open={Boolean(anchorEl)}
// //         anchorEl={anchorEl}
// //         onClose={handleClose}
// //         shortcuts={shortcuts}
// //         onSelectShortcut={handleInsertShortcut}
// //       />
// //     </Box>
// //   );
// // }

// import React, { useEffect, useState, useRef } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import 'quill-emoji/dist/quill-emoji.css';
// import Quill from 'quill';
// import 'quill-emoji';
// import { createPortal } from 'react-dom';
// import { Braces } from 'lucide-react';
// import ShortcodePopover from './ShortcodePopover';

// Quill.register('modules/emoji', require('quill-emoji'));

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

// export default function Editor({ initialContent, onChange }) {
//   const [editorContent, setEditorContent] = useState(initialContent || '');
//   const [shortcuts, setShortcuts] = useState([]);
//   const [popoverAnchor, setPopoverAnchor] = useState(null);
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//   const [savedSelection, setSavedSelection] = useState(null);
//   const quillRef = useRef(null);
//   const buttonRef = useRef(null);

//   const [selectedOption] = useState("contacts");

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

//   // Add custom button to toolbar
//   useEffect(() => {
//     const addButtonToToolbar = () => {
//       const toolbar = document.querySelector('.ql-toolbar');
//       if (toolbar && !toolbar.querySelector('.ql-shortcode')) {
//         // Find the formats group
//         const formatsGroup = toolbar.querySelector('.ql-formats');
//         if (formatsGroup) {
//           // Create button wrapper
//           const buttonWrapper = document.createElement('span');
//           buttonWrapper.className = 'ql-formats';
          
//           // Create button
//           const button = document.createElement('button');
//           button.className = 'ql-shortcode';
//           button.type = 'button';
          
//           // Add SVG icon (bracket icon)
//           button.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="pointer-events: none;"><path d="M13 3L13 21"/><path d="M8 8L3 12L8 16"/><path d="M16 8L21 12L16 16"/></svg>`;
//           button.title = 'Insert Shortcode';
//           button.onclick = (e) => {
//             e.preventDefault();
//             handleOpen(e);
//           };
          
//           buttonWrapper.appendChild(button);
          
//           // Insert after the clean button or at the end
//           const cleanButton = toolbar.querySelector('.ql-clean');
//           if (cleanButton && cleanButton.parentElement) {
//             cleanButton.parentElement.insertAdjacentElement('afterend', buttonWrapper);
//           } else {
//             toolbar.appendChild(buttonWrapper);
//           }
//         }
//       }
//     };
    
//     const timer = setTimeout(addButtonToToolbar, 200);
//     return () => clearTimeout(timer);
//   }, []);

//   const saveCurrentSelection = () => {
//     if (quillRef.current) {
//       const editor = quillRef.current.getEditor();
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
//     setPopoverAnchor(event.currentTarget);
//     setIsPopoverOpen(true);
//   };

//   const handleClose = () => {
//     setPopoverAnchor(null);
//     setIsPopoverOpen(false);
    
//     setTimeout(() => {
//       if (quillRef.current) {
//         const editor = quillRef.current.getEditor();
//         editor.focus();
//         if (savedSelection) {
//           editor.setSelection(savedSelection.index, savedSelection.length);
//         }
//       }
//     }, 50);
//   };

//   const handleInsertShortcut = (value) => {
//     if (quillRef.current && value) {
//       const editor = quillRef.current.getEditor();
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

//   const handleEditorChange = (content, delta, source, editor) => {
//     setEditorContent(content);
//     onChange(content);
//   };

//   useEffect(() => {
//     if (initialContent) {
//       setEditorContent(initialContent);
//     }
//   }, [initialContent]);

//   // Toolbar modules configuration
//   const modules = {
//     toolbar: {
//       container: [
//         [{ 'font': [] }, { 'size': [] }],
//         [{ 'header': ['1', '2', false] }, { 'align': [] }],
//         ['bold', 'italic', 'underline', 'strike'],
//         [{ 'script': 'sub' }, { 'script': 'super' }],
//         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//         [{ 'color': [] }, { 'background': [] }],
//         ['blockquote', 'code-block'],
//         ['link', 'image'],
//         ['emoji'],
//         [{ 'indent': '-1' }, { 'indent': '+1' }],
//         ['clean']
//       ],
//     },
//     'emoji-toolbar': true,
//     'emoji-shortname': true,
//   };

//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike',
//     'script', 'list', 'bullet', 'indent',
//     'color', 'background', 'align',
//     'blockquote', 'code-block', 'link', 'image',
//     'emoji'
//   ];

//   return (
//     <div className="w-full">
//       <style jsx global>{`
//         .ql-editor {
//           min-height: 150px;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//         }
//         .ql-container {
//           font-size: 14px;
//         }
//         .ql-toolbar {
//           border-top-left-radius: 0.375rem;
//           border-top-right-radius: 0.375rem;
//           border-color: #e5e7eb;
//           background-color: #f9fafb;
//           position: relative;
//           z-index: 10;
//         }
//         .ql-container {
//           border-bottom-left-radius: 0.375rem;
//           border-bottom-right-radius: 0.375rem;
//           border-color: #e5e7eb;
//         }
//         .ql-editor {
//           font-family: inherit;
//         }
//         .ql-shortcode {
//           width: 28px !important;
//           height: 24px !important;
//           display: inline-flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           cursor: pointer !important;
//           background: transparent !important;
//           border: none !important;
//           border-radius: 3px !important;
//           transition: background-color 0.2s !important;
//           color: #444 !important;
//           padding: 0 !important;
//         }
//         .ql-shortcode:hover {
//           background-color: #e5e7eb !important;
//           color: #000 !important;
//         }
//         .ql-shortcode svg {
//           width: 14px;
//           height: 14px;
//           stroke: currentColor;
//           stroke-width: 2;
//           fill: none;
//         }
//         .ql-formats {
//           display: inline-flex;
//           align-items: center;
//           gap: 2px;
//         }
//       `}</style>
      
//       <ReactQuill
//         ref={quillRef}
//         value={editorContent}
//         onChange={handleEditorChange}
//         modules={modules}
//         formats={formats}
//         theme="snow"
//       />

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

import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import Quill from 'quill';
import 'quill-emoji';
import { createPortal } from 'react-dom';
import { Braces } from 'lucide-react';
import ShortcodePopover from './ShortcodePopover';

Quill.register('modules/emoji', require('quill-emoji'));

// Register custom shortcode blot/format
const Inline = Quill.import('blots/inline');
class ShortcodeBlot extends Inline {
  static create(value) {
    const node = super.create();
    node.setAttribute('data-shortcode', value);
    node.setAttribute('contenteditable', 'false');
    node.style.backgroundColor = '#e8f0fe';
    node.style.padding = '2px 4px';
    node.style.borderRadius = '4px';
    node.style.fontFamily = 'monospace';
    node.style.fontSize = '12px';
    node.style.color = '#1a73e8';
    node.innerText = `[${value}]`;
    return node;
  }

  static value(node) {
    return node.getAttribute('data-shortcode');
  }
}
ShortcodeBlot.blotName = 'shortcode';
ShortcodeBlot.tagName = 'span';
Quill.register(ShortcodeBlot);

export default function Editor({ initialContent, onChange }) {
  const [editorContent, setEditorContent] = useState(initialContent || '');
  const [shortcuts, setShortcuts] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [savedSelection, setSavedSelection] = useState(null);
  const quillRef = useRef(null);
  const buttonRef = useRef(null);
  const [isButtonAdded, setIsButtonAdded] = useState(false);

  const [selectedOption] = useState("contacts");

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

  // Add custom button to toolbar
  useEffect(() => {
    const addButtonToToolbar = () => {
      const toolbar = document.querySelector('.ql-toolbar');
      if (toolbar && !toolbar.querySelector('.ql-shortcode')) {
        // Create button wrapper
        const buttonWrapper = document.createElement('span');
        buttonWrapper.className = 'ql-formats';
        
        // Create button
        const button = document.createElement('button');
        button.className = 'ql-shortcode';
        button.type = 'button';
        button.ref = buttonRef;
        
        // Add SVG icon (bracket icon)
        button.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="pointer-events: none;"><path d="M13 3L13 21"/><path d="M8 8L3 12L8 16"/><path d="M16 8L21 12L16 16"/></svg>`;
        button.title = 'Insert Shortcode';
        
        // Store reference to button
        buttonRef.current = button;
        
        buttonWrapper.appendChild(button);
        
        // Insert after the clean button or at the end
        const cleanButton = toolbar.querySelector('.ql-clean');
        if (cleanButton && cleanButton.parentElement) {
          cleanButton.parentElement.insertAdjacentElement('afterend', buttonWrapper);
        } else {
          toolbar.appendChild(buttonWrapper);
        }
        
        setIsButtonAdded(true);
      }
    };
    
    const timer = setTimeout(addButtonToToolbar, 200);
    return () => clearTimeout(timer);
  }, []);

  // Add click handler to button after it's added
  useEffect(() => {
    if (isButtonAdded && buttonRef.current) {
      const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle popover
        if (isPopoverOpen) {
          // If popover is open, close it
          handleClose();
        } else {
          // If popover is closed, open it
          handleOpen(e);
        }
      };
      
      buttonRef.current.onclick = handleButtonClick;
      
      return () => {
        if (buttonRef.current) {
          buttonRef.current.onclick = null;
        }
      };
    }
  }, [isButtonAdded, isPopoverOpen]);

  const saveCurrentSelection = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection();
      if (selection) {
        setSavedSelection(selection);
      } else {
        setSavedSelection({ index: editor.getLength(), length: 0 });
      }
    }
  };

  const handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    saveCurrentSelection();
    setPopoverAnchor(buttonRef.current);
    setIsPopoverOpen(true);
  };

  const handleClose = () => {
    setPopoverAnchor(null);
    setIsPopoverOpen(false);
    
    setTimeout(() => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.focus();
        if (savedSelection) {
          editor.setSelection(savedSelection.index, savedSelection.length);
        }
      }
    }, 50);
  };

  const handleInsertShortcut = (value) => {
    if (quillRef.current && value) {
      const editor = quillRef.current.getEditor();
      editor.focus();
      
      let range = savedSelection;
      if (!range) {
        range = editor.getSelection();
      }
      
      if (!range) {
        range = { index: editor.getLength(), length: 0 };
      }
      
      // Insert text format
      editor.insertText(range.index, `[${value}]`);
      const newPosition = range.index + value.length + 2;
      editor.setSelection(newPosition, 0);
      setSavedSelection(null);
    }
    
    handleClose();
  };

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
    onChange(content);
  };

  useEffect(() => {
    if (initialContent) {
      setEditorContent(initialContent);
    }
  }, [initialContent]);

  // Toolbar modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': [] }],
        [{ 'header': ['1', '2', false] }, { 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        ['link', ],
        ['emoji'],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['clean']
      ],
    },
    'emoji-toolbar': true,
    'emoji-shortname': true,
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'script', 'list', 'bullet', 'indent',
    'color', 'background', 'align',
    'blockquote', 'code-block', 'link', 'image', 'document',
    'emoji'
  ];

  return (
    <div className="w-full">
      <style jsx global>{`
        .ql-editor {
          min-height: 150px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .ql-container {
          font-size: 14px;
        }
        .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: #e5e7eb;
         
          position: relative;
          z-index: 10;
        }
        .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: #e5e7eb;
        }
        .ql-editor {
          font-family: inherit;
        }
        .ql-shortcode {
          width: 28px !important;
          height: 24px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          background: transparent !important;
          border: none !important;
          border-radius: 3px !important;
          transition: background-color 0.2s !important;
          color: #444 !important;
          padding: 0 !important;
        }
        .ql-shortcode:hover {
          background-color: #e5e7eb !important;
          color: #000 !important;
        }
        .ql-shortcode svg {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
        }
        .ql-formats {
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />

      {typeof document !== 'undefined' && createPortal(
        <ShortcodePopover
          open={isPopoverOpen}
          anchorEl={popoverAnchor}
          onClose={handleClose}
          shortcuts={shortcuts}
          onSelectShortcut={handleInsertShortcut}
        />,
        document.body
      )}
    </div>
  );
}