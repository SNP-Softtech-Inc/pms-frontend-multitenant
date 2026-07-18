
// // // import React, { useEffect, useState } from 'react';
// // // // import { Box } from '@mui/material';
// // // import ReactQuill from 'react-quill';
// // // import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
// // // import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
// // // import Quill from 'quill';
// // // import 'quill-emoji';

// // // Quill.register('modules/emoji', require('quill-emoji'));
// // // export default function Editor({ value, onChange, }) {
// // //   const [editorContent, setEditorContent] = useState(value);

  
// // //   // Toolbar configuration similar to what you had in mui-tiptap
// // //   const modules = {
// // //     toolbar: [
// // //       [{ 'font': [] }, {  'size': [] }], // Font family and size
// // //       [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
// // //       ['bold', 'italic', 'underline', 'strike'], // Formatting options
// // //       [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript/Superscript
// // //       [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
// // //       [{ 'color': [] }, { 'background': [] }], // Text color and highlight
// // //       ['blockquote', 'code-block'], // Blockquote and code
// // //       ['link', 'image'], // Links and images
// // //         [{ 'emoji': true }],
// // //       [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent/unindent
// // //       ['clean'], // Remove formatting
// // //       ['undo', 'redo'], // Undo/Redo
    
// // //     ],
// // //     'emoji-toolbar': true,
// // //     'emoji-textarea': false,
// // //     'emoji-shortname': true,
// // //     history: {
// // //       delay: 1000,
// // //       maxStack: 50,
// // //       userOnly: true,
// // //     },
// // //   };

// // //   const formats = [
// // //     'header', 'font', 'size',
// // //     'bold', 'italic', 'underline', 'strike',
// // //     'script', 'list', 'bullet', 'indent',
// // //     'color', 'background', 'align',
// // //     'blockquote', 'code-block', 'link', 'image',
// // //     'undo', 'redo','emoji'
// // //   ];

  

// // //    useEffect(() => {
// // //     setEditorContent(value || '');  // Changed from initialContent to value
// // //   }, [value]);
// // //   const handleChange = (content) => {
// // //     setEditorContent(content);
// // //     onChange(content); // Call the onChange prop with the current content
// // //   };

// // //   return (
   
// // //     <div style={{
// // //   "& .ql-editor": {
// // //     minHeight: "350px",
// // //     height: "auto",
// // //     overflowY: "visible"
// // //   }
// // // }}>
// // //   <ReactQuill
  
// // //     value={editorContent}
// // //     onChange={handleChange}
// // //     modules={modules}
// // //     formats={formats}
// // //     theme="snow"
// // //   />
// // // </div>

// // //   );
// // // }

// // // import React, { useEffect, useState } from 'react';
// // // import ReactQuill from 'react-quill';
// // // import 'react-quill/dist/quill.snow.css';
// // // import 'quill-emoji/dist/quill-emoji.css';
// // // import Quill from 'quill';
// // // import 'quill-emoji';

// // // Quill.register('modules/emoji', require('quill-emoji'));

// // // export default function Editor({ value, onChange }) {
// // //   const [editorContent, setEditorContent] = useState(value);

// // //   const modules = {
// // //     toolbar: [
// // //       [{ font: [] }, { size: [] }],
// // //       [{ header: '1' }, { header: '2' }, { align: [] }],
// // //       ['bold', 'italic', 'underline', 'strike'],
// // //       [{ script: 'sub' }, { script: 'super' }],
// // //       [{ list: 'ordered' }, { list: 'bullet' }],
// // //       [{ color: [] }, { background: [] }],
// // //       ['blockquote', 'code-block'],
// // //       ['link', 'image'],
// // //       ["emoji" ],
// // //       [{ indent: '-1' }, { indent: '+1' }],
// // //       ['clean'],
// // //     ],
// // //     'emoji-toolbar': true,
// // //     'emoji-textarea': false,
// // //     'emoji-shortname': true,
// // //     history: {
// // //       delay: 1000,
// // //       maxStack: 50,
// // //       userOnly: true,
// // //     },
// // //   };

// // //   const formats = [
// // //     'header',
// // //     'font',
// // //     'size',
// // //     'bold',
// // //     'italic',
// // //     'underline',
// // //     'strike',
// // //     'script',
// // //     'list',
// // //     'bullet',
// // //     'indent',
// // //     'color',
// // //     'background',
// // //     'align',
// // //     'blockquote',
// // //     'code-block',
// // //     'link',
// // //     'image',
// // //     'emoji',
// // //   ];

// // //   useEffect(() => {
// // //     setEditorContent(value || '');
// // //   }, [value]);

// // //   const handleChange = (content) => {
// // //     setEditorContent(content);
// // //     onChange(content);
// // //   };

// // //   return (
// // //     <div>
// // //       <ReactQuill
// // //         value={editorContent}
// // //         onChange={handleChange}
// // //         modules={modules}
// // //         formats={formats}
// // //         theme="snow"
// // //         style={{ height: 'auto', marginBottom: '50px' , overflowY:'auto' }}
// // //       />

// // //       <style>
// // //         {`
// // //           .ql-editor {
// // //             min-height: 300px;
// // //           }
// // //         `}
// // //       </style>
// // //     </div>
// // //   );
// // // }




// // import React, { useEffect, useState } from 'react';
// // import { Box } from '@mui/material';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
// // import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
// // import Quill from 'quill';
// // import 'quill-emoji';

// // Quill.register('modules/emoji', require('quill-emoji'));
// // export default function Editor({ initialContent, onChange,value }) {
// //   const [editorContent, setEditorContent] = useState(initialContent);

  
// //   // Toolbar configuration similar to what you had in mui-tiptap
// //   const modules = {
// //     toolbar: [
// //       [{ 'font': [] }, {  'size': [] }], // Font family and size
// //       [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
// //       ['bold', 'italic', 'underline', 'strike'], // Formatting options
// //       [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript/Superscript
// //       [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
// //       [{ 'color': [] }, { 'background': [] }], // Text color and highlight
// //       ['blockquote', 'code-block'], // Blockquote and code
// //       ['link'], // Links and images
// //         [{ 'emoji': true }],
// //       [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent/unindent
// //       ['clean'], // Remove formatting
// //       ['undo', 'redo'], // Undo/Redo
    
// //     ],
// //     'emoji-toolbar': true,
// //     'emoji-textarea': false,
// //     'emoji-shortname': true,
// //     history: {
// //       delay: 1000,
// //       maxStack: 50,
// //       userOnly: true,
// //     },
// //   };

// //   const formats = [
// //     'header', 'font', 'size',
// //     'bold', 'italic', 'underline', 'strike',
// //     'script', 'list', 'bullet', 'indent',
// //     'color', 'background', 'align',
// //     'blockquote', 'code-block', 'link', 'image',
// //     'undo', 'redo','emoji'
// //   ];

// //   useEffect(() => {
// //     if (initialContent) {
// //       setEditorContent(initialContent);
// //     }
// //   }, [initialContent]);

// //   const handleChange = (content) => {
// //     setEditorContent(content);
// //     onChange(content); // Call the onChange prop with the current content
// //   };

// //   return (
// //     // <Box
// //     //   sx={{height:'250px'}}
// //     // >
// //       <ReactQuill
// //         // value={editorContent}
// //         value={value}
// //         onChange={handleChange}
// //         modules={modules}
// //         formats={formats}
// //         theme="snow"
// //         style={{ height: '150px' }}
// //       />
// //     // </Box>
// //   );
// // }



import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import 'quill-emoji/dist/quill-emoji.css'; 


import Quill from 'quill';
import 'quill-emoji';

// Register the module safely if not registered already
if (!Quill.imports['modules/emoji']) {
  Quill.register('modules/emoji', require('quill-emoji'));
}

export default function Editor({ initialContent, onChange, value }) {
  const [editorContent, setEditorContent] = useState(initialContent || "");

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['link'],
     
      [{ 'emoji': true }], // Emoji placement in toolbar
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['clean'],
    ],
   
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'script', 'list', 'bullet', 'indent',
    'color', 'background', 'align',
    'blockquote', 'code-block', 'link', 'image',
    'emoji',
  ];

  const handleChange = (content) => {
    setEditorContent(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="quill-wrapper-container ">
      <ReactQuill
        value={value !== undefined ? value : editorContent}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        style={{ height: 'auto',marginBottom:"20px" }}
      />
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "quill-emoji/dist/quill-emoji.css";
// import Quill from "quill";
// import "quill-emoji";

// // Register emoji module safely
// if (!Quill.imports["modules/emoji"]) {
//   Quill.register("modules/emoji", require("quill-emoji"));
// }

// export default function Editor({
//   initialContent,
//   onChange,
//   value,
//   placeholder = "Write something...",
//   readOnly = false,
// }) {
//   const [editorContent, setEditorContent] = useState(
//     initialContent || ""
//   );

//   useEffect(() => {
//     if (initialContent !== undefined) {
//       setEditorContent(initialContent);
//     }
//   }, [initialContent]);

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       [
//         { header: "1" },
//         { header: "2" },
//         { align: [] },
//       ],
//       ["bold", "italic", "underline", "strike"],
//       [{ script: "sub" }, { script: "super" }],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//       ],
//       [{ color: [] }, { background: [] }],
//       ["blockquote", "code-block"],
//       ["link"],
//       [{ emoji: true }],
//       [{ indent: "-1" }, { indent: "+1" }],
//       ["clean"],
//     ],

//     "emoji-toolbar": true,
//     "emoji-textarea": false,
//     "emoji-shortname": true,

//     history: {
//       delay: 1000,
//       maxStack: 50,
//       userOnly: true,
//     },
//   };

//   const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "script",
//     "list",
//     "bullet",
//     "indent",
//     "color",
//     "background",
//     "align",
//     "blockquote",
//     "code-block",
//     "link",
//     "image",
//     "emoji",
//   ];

//   const handleChange = (content) => {
//     setEditorContent(content);

//     if (onChange) {
//       onChange(content);
//     }
//   };

//   return (
//     <div className="quill-theme-wrapper">
//       <ReactQuill
//         theme="snow"
//         value={
//           value !== undefined
//             ? value
//             : editorContent
//         }
//         onChange={handleChange}
//         modules={modules}
//         formats={formats}
//         placeholder={placeholder}
//         readOnly={readOnly}
//         style={{
//           height: "auto",
//           marginBottom: "20px",
//         }}
//       />

//       <style jsx global>{`
//         .quill-theme-wrapper {
//           width: 100%;
//         }

//         /* ================================
//            MAIN CONTAINER
//         ================================= */

//         .quill-theme-wrapper .ql-container {
//           border: 1px solid hsl(var(--border));
//           background: hsl(var(--background));
//           color: hsl(var(--foreground));
//           font-family: var(--font-family);
//           border-bottom-left-radius: 10px;
//           border-bottom-right-radius: 10px;
//           min-height: 180px;
//         }

//         .quill-theme-wrapper .ql-editor {
//           min-height: 180px;
//           color: hsl(var(--foreground));
//           font-size: 14px;
//           line-height: 1.7;
//         }

//         .quill-theme-wrapper .ql-editor.ql-blank::before {
//           color: hsl(var(--muted-foreground));
//           font-style: normal;
//         }

//         /* ================================
//            TOOLBAR
//         ================================= */

//         .quill-theme-wrapper .ql-toolbar {
//           border: 1px solid hsl(var(--border));
//           border-bottom: none;
//           background: hsl(var(--card));
//           border-top-left-radius: 10px;
//           border-top-right-radius: 10px;
//         }

//         /* Toolbar buttons */

//         .quill-theme-wrapper .ql-toolbar button {
//           color: hsl(var(--foreground));
//           transition: all 0.2s ease;
//           border-radius: 6px;
//         }

//         .quill-theme-wrapper .ql-toolbar button:hover {
//           background: hsl(var(--accent));
//           color: hsl(var(--primary));
//         }

//         .quill-theme-wrapper .ql-toolbar button.ql-active {
//           background: hsl(var(--primary) / 0.15);
//           color: hsl(var(--primary));
//         }

//         /* SVG icons */

//         .quill-theme-wrapper .ql-toolbar button svg {
//           stroke: currentColor;
//         }

//         .quill-theme-wrapper .ql-toolbar button .ql-fill {
//           fill: currentColor;
//         }

//         .quill-theme-wrapper .ql-toolbar button .ql-stroke {
//           stroke: currentColor;
//         }

//         /* ================================
//            PICKERS
//         ================================= */

//         .quill-theme-wrapper .ql-picker {
//           color: hsl(var(--foreground));
//         }

//         .quill-theme-wrapper .ql-picker-label {
//           border-radius: 6px;
//         }

//         .quill-theme-wrapper .ql-picker-label:hover {
//           color: hsl(var(--primary));
//         }

//         .quill-theme-wrapper .ql-picker-options {
//           background: hsl(var(--popover));
//           border: 1px solid hsl(var(--border));
//           color: hsl(var(--popover-foreground));
//           border-radius: 10px;
//           padding: 6px;
//           box-shadow:
//             0 10px 30px rgba(0, 0, 0, 0.15);
//         }

//         .quill-theme-wrapper .ql-picker-item {
//           color: hsl(var(--foreground));
//           border-radius: 6px;
//         }

//         .quill-theme-wrapper .ql-picker-item:hover {
//           background: hsl(var(--accent));
//           color: hsl(var(--primary));
//         }

//         /* ================================
//            TOOLTIP
//         ================================= */

//         .quill-theme-wrapper .ql-tooltip {
//           background: hsl(var(--popover));
//           color: hsl(var(--popover-foreground));
//           border: 1px solid hsl(var(--border));
//           border-radius: 10px;
//           box-shadow:
//             0 10px 30px rgba(0, 0, 0, 0.18);
//         }

//         .quill-theme-wrapper .ql-tooltip input {
//           background: hsl(var(--background));
//           border: 1px solid hsl(var(--border));
//           color: hsl(var(--foreground));
//           border-radius: 6px;
//         }

//         /* ================================
//            CODE BLOCK
//         ================================= */

//         .quill-theme-wrapper .ql-syntax {
//           background: hsl(var(--secondary));
//           color: hsl(var(--foreground));
//           border-radius: 8px;
//           padding: 12px;
//         }

//         /* ================================
//            BLOCKQUOTE
//         ================================= */

//         .quill-theme-wrapper blockquote {
//           border-left: 4px solid
//             hsl(var(--primary));
//           padding-left: 12px;
//           color: hsl(var(--muted-foreground));
//           margin-left: 0;
//         }

//         /* ================================
//            SCROLLBAR
//         ================================= */

//         .quill-theme-wrapper
//           .ql-editor::-webkit-scrollbar {
//           width: 8px;
//         }

//         .quill-theme-wrapper
//           .ql-editor::-webkit-scrollbar-track {
//           background: transparent;
//         }

//         .quill-theme-wrapper
//           .ql-editor::-webkit-scrollbar-thumb {
//           background: hsl(var(--border));
//           border-radius: 999px;
//         }

//         .quill-theme-wrapper
//           .ql-editor::-webkit-scrollbar-thumb:hover {
//           background: hsl(
//             var(--muted-foreground)
//           );
//         }

//         /* ================================
//            EMOJI PICKER
//         ================================= */

//         .emoji-picker {
//           background: hsl(var(--popover)) !important;
//           border: 1px solid
//             hsl(var(--border)) !important;
//           color: hsl(
//             var(--popover-foreground)
//           ) !important;
//         }

//         /* ================================
//            DARK MODE IMPROVEMENTS
//         ================================= */

//         .dark .quill-theme-wrapper .ql-toolbar,
//         .dark .quill-theme-wrapper .ql-container {
//           box-shadow: none;
//         }

//         .dark .quill-theme-wrapper .ql-picker-options,
//         .dark .quill-theme-wrapper .ql-tooltip {
//           box-shadow:
//             0 10px 30px rgba(0, 0, 0, 0.5);
//         }

//         /* ================================
//            FOCUS STATE
//         ================================= */

//         .quill-theme-wrapper
//           .ql-container.ql-snow:focus-within,
//         .quill-theme-wrapper
//           .ql-toolbar.ql-snow:focus-within {
//           border-color: hsl(var(--ring));
//         }

//         /* ================================
//            LINKS
//         ================================= */

//         .quill-theme-wrapper .ql-editor a {
//           color: hsl(var(--primary));
//         }

//         .quill-theme-wrapper .ql-editor a:hover {
//           opacity: 0.85;
//         }
//       `}</style>
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';
// import { Box } from '@mui/material';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import 'quill-emoji/dist/quill-emoji.css';
// import Quill from 'quill';
// import 'quill-emoji';

// Quill.register('modules/emoji', require('quill-emoji'));

// export default function Editor({ initialContent, onChange, value }) {
//   const [editorContent, setEditorContent] = useState(initialContent);

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       [{ header: '1' }, { header: '2' }, { align: [] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ script: 'sub' }, { script: 'super' }],
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       [{ color: [] }, { background: [] }],
//       ['blockquote', 'code-block'],
//        ['link', 'image',],
//       [{ emoji: true }],
//       [{ indent: '-1' }, { indent: '+1' }],
//       ['clean'],
//       ['undo', 'redo'],
//     ],
//     'emoji-toolbar': true,
//     'emoji-textarea': false,
//     'emoji-shortname': true,
//     history: {
//       delay: 1000,
//       maxStack: 50,
//       userOnly: true,
//     },
//   };

//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike',
//     'script', 'list', 'bullet', 'indent',
//     'color', 'background', 'align',
//     'blockquote', 'code-block', 'link', 'image',
//     'undo', 'redo', 'emoji',
//   ];

//   useEffect(() => {
//     if (initialContent) {
//       setEditorContent(initialContent);
//     }
//   }, [initialContent]);

//   const handleChange = (content) => {
//     setEditorContent(content);
//     onChange(content);
//   };

//   return (
//     <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
//       <ReactQuill
//         value={value}
//         onChange={handleChange}
//         modules={modules}
//         formats={formats}
//         theme="snow"
//        className="
//           [&_.ql-toolbar]:rounded-t-xl
//           [&_.ql-toolbar]:border-0
//           [&_.ql-toolbar]:border-b
//           [&_.ql-toolbar]:border-slate-200
//           [&_.ql-toolbar]:bg-slate-50

//           [&_.ql-container]:border-0
//           [&_.ql-container]:w-full
//           [&_.ql-container]:overflow-hidden

//           [&_.ql-editor]:min-h-[150px]
//           [&_.ql-editor]:w-full
//           [&_.ql-editor]:max-w-full
//           [&_.ql-editor]:break-words
//           [&_.ql-editor]:whitespace-pre-wrap
//           [&_.ql-editor]:overflow-wrap-anywhere
//           [&_.ql-editor]:text-sm
//           [&_.ql-editor]:leading-6

//           [&_.ql-editor.ql-blank::before]:not-italic
//           [&_.ql-editor.ql-blank::before]:text-slate-400
//         "
//       />
//     </div>
//   );
// }