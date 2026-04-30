

// // // ShortcodeTextField.jsx
// // import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
// // import {
// //   Box,
// //   TextField,
// //   Button,
// //   InputLabel,
// //   FormControl,
// // } from "@mui/material";
// // import ShortcodePopover from "./ShortcodePopover";


// // const ShortcodeTextField = forwardRef(({
// //   label,
// //   value,
// //   onChange,
// //   placeholder,
// //   error,
// //   helperText,
// //   multiline = false,
// //   rows = 3,
// //   shortcuts,
// //   showShortcutDropdown,
// //   anchorElShortcut,
// //   onToggleShortcutDropdown,
// //   onCloseShortcutDropdown,
// //   onCloseSwitchdropdown,
// //   onAddShortcut,
// //   disabled = false,
// //   required = false,
// //   maxLength,
// //   sx = {},
// // }, ref) => {
// //   const [cursorPosition, setCursorPosition] = useState(0);
// //   const textFieldRef = useRef(null);

// //   useImperativeHandle(ref, () => ({
// //     focus: () => {
// //       textFieldRef.current?.focus();
// //     },
// //     setSelectionRange: (start, end) => {
// //       textFieldRef.current?.setSelectionRange(start, end);
// //     },
// //     get value() {
// //       return value;
// //     },
// //   }));

// //   // Update cursor position when selection changes
// //   const handleSelect = (e) => {
// //     if (e.target.selectionStart !== undefined) {
// //       setCursorPosition(e.target.selectionStart);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { value, selectionStart } = e.target;
// //     setCursorPosition(selectionStart);
// //     onChange(e);
// //   };

// //   const handleAddShortcutWithPosition = (shortcutValue) => {
// //     if (!shortcutValue) return;

// //     const newValue = 
// //       value.slice(0, cursorPosition) +
// //       `[${shortcutValue}]` +
// //       value.slice(cursorPosition);
    
// //     // Create a synthetic event to pass to onChange
// //     const syntheticEvent = {
// //       target: {
// //         value: newValue,
// //         name: label?.toLowerCase().replace(/\s/g, '_') || 'shortcode_field',
// //         selectionStart: cursorPosition + shortcutValue.length + 2,
// //       }
// //     };
    
// //     onChange(syntheticEvent);
    
// //     // Set cursor position after the inserted shortcut
// //     setTimeout(() => {
// //       if (textFieldRef.current) {
// //         const newCursorPosition = cursorPosition + shortcutValue.length + 2;
// //         textFieldRef.current.focus();
// //         textFieldRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
// //         setCursorPosition(newCursorPosition);
// //       }
// //     }, 10);
    
// //     // IMPORTANT: Call the parent's close handler which should reset the anchor
// //     if (onCloseShortcutDropdown) {
// //       onCloseShortcutDropdown();
// //     }
// //     if(onCloseSwitchdropdown){
// //         onCloseSwitchdropdown()
// //     }
// //   };

// //   const handleToggleDropdown = (event) => {
// //     // Store the current cursor position before opening dropdown
// //     if (textFieldRef.current) {
// //       setCursorPosition(textFieldRef.current.selectionStart);
// //     }
// //     if (onToggleShortcutDropdown) {
// //       onToggleShortcutDropdown(event);
// //     }
// //   };

// //   // Ensure cursor position is tracked on focus
// //   const handleFocus = (e) => {
// //     setCursorPosition(e.target.selectionStart);
// //   };

// //   // Track cursor position on click
// //   const handleClick = (e) => {
// //     setCursorPosition(e.target.selectionStart);
// //   };

// //   // Track cursor position on key up (arrow keys, etc.)
// //   const handleKeyUp = (e) => {
// //     setCursorPosition(e.target.selectionStart);
// //   };

// //   return (
// //     <FormControl fullWidth sx={sx}>
// //       {label && (
// //         <InputLabel sx={{ color: "black", mb: 1, position: 'relative', transform: 'none' }}>
// //           {label}
// //           {required && <span style={{ color: 'red' }}> *</span>}
// //         </InputLabel>
// //       )}
// //       <TextField
// //         inputRef={textFieldRef}
// //         value={value}
// //         onChange={handleChange}
// //         onSelect={handleSelect}
// //         onFocus={handleFocus}
// //         onClick={handleClick}
// //         onKeyUp={handleKeyUp}
// //         placeholder={placeholder}
// //         error={error}
// //         helperText={helperText}
// //         multiline={multiline}
// //         rows={multiline ? rows : undefined}
// //         disabled={disabled}
// //         inputProps={{ maxLength }}
// //         fullWidth
// //         size="small"
// //         sx={{ mt: 1 }}
// //       />
// //       <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
// //         <Button
// //           variant="outlined"
// //           size="small"
// //           onClick={handleToggleDropdown}
// //           disabled={disabled}
// //           sx={{ textTransform: 'none' }}
// //         >
// //           Add Shortcode
// //         </Button>
// //       </Box>
// //       <ShortcodePopover
// //         open={showShortcutDropdown}
// //         anchorEl={anchorElShortcut}
// //         onClose={() => {
// //           if (onCloseShortcutDropdown) {
// //             onCloseShortcutDropdown();
// //           }
// //           // Refocus the text field after closing
// //           setTimeout(() => {
// //             textFieldRef.current?.focus();
// //           }, 0);
// //         }}
// //         shortcuts={shortcuts}
// //         onSelectShortcut={handleAddShortcutWithPosition}
// //       />
// //     </FormControl>
// //   );
// // });

// // ShortcodeTextField.displayName = 'ShortcodeTextField';

// // export default ShortcodeTextField;


// import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
// import { Plus } from "lucide-react";
// import ShortcodePopover from "./ShortcodePopover";

// const ShortcodeTextField = forwardRef(({
//   label,
//   value,
//   onChange,
//   placeholder,
//   error,
//   helperText,
//   multiline = false,
//   rows = 3,
//   shortcuts,
//   showShortcutDropdown,
//   anchorElShortcut,
//   onToggleShortcutDropdown,
//   onCloseShortcutDropdown,
//   onCloseSwitchdropdown,
//   onAddShortcut,
//   disabled = false,
//   required = false,
//   maxLength,
//   sx = {},
// }, ref) => {
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textFieldRef = useRef(null);

//   useImperativeHandle(ref, () => ({
//     focus: () => {
//       textFieldRef.current?.focus();
//     },
//     setSelectionRange: (start, end) => {
//       textFieldRef.current?.setSelectionRange(start, end);
//     },
//     get value() {
//       return value;
//     },
//   }));

//   // Update cursor position when selection changes
//   const handleSelect = (e) => {
//     if (e.target.selectionStart !== undefined) {
//       setCursorPosition(e.target.selectionStart);
//     }
//   };

//   const handleChange = (e) => {
//     const { value, selectionStart } = e.target;
//     setCursorPosition(selectionStart);
//     onChange(e);
//   };

//   const handleAddShortcutWithPosition = (shortcutValue) => {
//     if (!shortcutValue) return;

//     const newValue = 
//       value.slice(0, cursorPosition) +
//       `[${shortcutValue}]` +
//       value.slice(cursorPosition);
    
//     // Create a synthetic event to pass to onChange
//     const syntheticEvent = {
//       target: {
//         value: newValue,
//         name: label?.toLowerCase().replace(/\s/g, '_') || 'shortcode_field',
//         selectionStart: cursorPosition + shortcutValue.length + 2,
//       }
//     };
    
//     onChange(syntheticEvent);
    
//     // Set cursor position after the inserted shortcut
//     setTimeout(() => {
//       if (textFieldRef.current) {
//         const newCursorPosition = cursorPosition + shortcutValue.length + 2;
//         textFieldRef.current.focus();
//         textFieldRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
//         setCursorPosition(newCursorPosition);
//       }
//     }, 10);
    
//     // IMPORTANT: Call the parent's close handler which should reset the anchor
//     if (onCloseShortcutDropdown) {
//       onCloseShortcutDropdown();
//     }
//     if(onCloseSwitchdropdown){
//         onCloseSwitchdropdown();
//     }
//   };

//   const handleToggleDropdown = (event) => {
//     // Store the current cursor position before opening dropdown
//     if (textFieldRef.current) {
//       setCursorPosition(textFieldRef.current.selectionStart);
//     }
//     if (onToggleShortcutDropdown) {
//       onToggleShortcutDropdown(event);
//     }
//   };

//   // Ensure cursor position is tracked on focus
//   const handleFocus = (e) => {
//     setCursorPosition(e.target.selectionStart);
//   };

//   // Track cursor position on click
//   const handleClick = (e) => {
//     setCursorPosition(e.target.selectionStart);
//   };

//   // Track cursor position on key up (arrow keys, etc.)
//   const handleKeyUp = (e) => {
//     setCursorPosition(e.target.selectionStart);
//   };

//   return (
//     <div className="w-full" style={sx}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//           {required && <span className="text-red-500 ml-0.5">*</span>}
//         </label>
//       )}
      
//       {multiline ? (
//         <textarea
//           ref={textFieldRef}
//           value={value}
//           onChange={handleChange}
//           onSelect={handleSelect}
//           onFocus={handleFocus}
//           onClick={handleClick}
//           onKeyUp={handleKeyUp}
//           placeholder={placeholder}
//           disabled={disabled}
//           maxLength={maxLength}
//           rows={rows}
//           className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
//             error ? 'border-red-500' : 'border-gray-300'
//           } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
//         />
//       ) : (
//         <input
//           ref={textFieldRef}
//           type="text"
//           value={value}
//           onChange={handleChange}
//           onSelect={handleSelect}
//           onFocus={handleFocus}
//           onClick={handleClick}
//           onKeyUp={handleKeyUp}
//           placeholder={placeholder}
//           disabled={disabled}
//           maxLength={maxLength}
//           className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//             error ? 'border-red-500' : 'border-gray-300'
//           } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
//         />
//       )}
      
//       {helperText && (
//         <p className={`text-sm mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
//           {helperText}
//         </p>
//       )}
      
//       <div className="mt-2 flex justify-end">
//         <button
//           type="button"
//           onClick={handleToggleDropdown}
//           disabled={disabled}
//           className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <Plus className="h-3.5 w-3.5" />
//           Add Shortcode
//         </button>
//       </div>
      
//       <ShortcodePopover
//         open={showShortcutDropdown}
//         anchorEl={anchorElShortcut}
//         onClose={() => {
//           if (onCloseShortcutDropdown) {
//             onCloseShortcutDropdown();
//           }
//           // Refocus the text field after closing
//           setTimeout(() => {
//             textFieldRef.current?.focus();
//           }, 0);
//         }}
//         shortcuts={shortcuts}
//         onSelectShortcut={handleAddShortcutWithPosition}
//       />
//     </div>
//   );
// });

// ShortcodeTextField.displayName = 'ShortcodeTextField';

// export default ShortcodeTextField;


import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Plus } from "lucide-react";
import ShortcodePopover from "./ShortcodePopover";

const ShortcodeTextField = forwardRef(({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  multiline = false,
  rows = 3,
  shortcuts,
  showShortcutDropdown,
  anchorElShortcut,
  onToggleShortcutDropdown,
  onCloseShortcutDropdown,
  onCloseSwitchdropdown,
  onAddShortcut,
  disabled = false,
  required = false,
  maxLength,
  sx = {},
}, ref) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [buttonRef, setButtonRef] = useState(null);
  const textFieldRef = useRef(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textFieldRef.current?.focus();
    },
    setSelectionRange: (start, end) => {
      textFieldRef.current?.setSelectionRange(start, end);
    },
    get value() {
      return value;
    },
  }));

  // Update cursor position when selection changes
  const handleSelect = (e) => {
    if (e.target.selectionStart !== undefined) {
      setCursorPosition(e.target.selectionStart);
    }
  };

  const handleChange = (e) => {
    const { value, selectionStart } = e.target;
    setCursorPosition(selectionStart || 0);
    onChange(e);
  };

  const handleAddShortcutWithPosition = (shortcutValue) => {
    if (!shortcutValue) return;

    const newValue = 
      value.slice(0, cursorPosition) +
      `[${shortcutValue}]` +
      value.slice(cursorPosition);
    
    const syntheticEvent = {
      target: {
        value: newValue,
        name: label?.toLowerCase().replace(/\s/g, '_') || 'shortcode_field',
        selectionStart: cursorPosition + shortcutValue.length + 2,
      }
    };
    
    onChange(syntheticEvent);
    
    setTimeout(() => {
      if (textFieldRef.current) {
        const newCursorPosition = cursorPosition + shortcutValue.length + 2;
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        setCursorPosition(newCursorPosition);
      }
    }, 10);
    
    if (onCloseShortcutDropdown) {
      onCloseShortcutDropdown();
    }
    if(onCloseSwitchdropdown){
        onCloseSwitchdropdown();
    }
  };

  const handleToggleDropdown = (event) => {
    // Store the button reference for positioning
    setButtonRef(event.currentTarget);
    
    // Store current cursor position
    if (textFieldRef.current) {
      setCursorPosition(textFieldRef.current.selectionStart || 0);
    }
    
    if (onToggleShortcutDropdown) {
      onToggleShortcutDropdown(event);
    }
  };

  const handleFocus = (e) => {
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleClick = (e) => {
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleKeyUp = (e) => {
    setCursorPosition(e.target.selectionStart || 0);
  };

  // Use either the passed anchorEl or our buttonRef
  const anchorElement = anchorElShortcut || buttonRef;

  return (
    <div className="w-full relative" style={sx} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      {multiline ? (
        <textarea
          ref={textFieldRef}
          value={value}
          onChange={handleChange}
          onSelect={handleSelect}
          onFocus={handleFocus}
          onClick={handleClick}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
      ) : (
        <input
          ref={textFieldRef}
          type="text"
          value={value}
          onChange={handleChange}
          onSelect={handleSelect}
          onFocus={handleFocus}
          onClick={handleClick}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
      )}
      
      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
      
      <div className="mt-2 flex justify-start">
        <button
          type="button"
          ref={(node) => {
            if (node && !buttonRef) setButtonRef(node);
          }}
          onClick={handleToggleDropdown}
          disabled={disabled}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Shortcode
        </button>
      </div>
      
      <ShortcodePopover
        open={showShortcutDropdown}
        anchorEl={anchorElement}
        onClose={() => {
          if (onCloseShortcutDropdown) {
            onCloseShortcutDropdown();
          }
          setTimeout(() => {
            textFieldRef.current?.focus();
          }, 0);
        }}
        shortcuts={shortcuts}
        onSelectShortcut={handleAddShortcutWithPosition}
      />
    </div>
  );
});

ShortcodeTextField.displayName = 'ShortcodeTextField';

export default ShortcodeTextField;