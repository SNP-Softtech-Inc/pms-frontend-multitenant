

// ShortcodeTextField.jsx
import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
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
  const textFieldRef = useRef(null);

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
    setCursorPosition(selectionStart);
    onChange(e);
  };

  const handleAddShortcutWithPosition = (shortcutValue) => {
    if (!shortcutValue) return;

    const newValue = 
      value.slice(0, cursorPosition) +
      `[${shortcutValue}]` +
      value.slice(cursorPosition);
    
    // Create a synthetic event to pass to onChange
    const syntheticEvent = {
      target: {
        value: newValue,
        name: label?.toLowerCase().replace(/\s/g, '_') || 'shortcode_field',
        selectionStart: cursorPosition + shortcutValue.length + 2,
      }
    };
    
    onChange(syntheticEvent);
    
    // Set cursor position after the inserted shortcut
    setTimeout(() => {
      if (textFieldRef.current) {
        const newCursorPosition = cursorPosition + shortcutValue.length + 2;
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        setCursorPosition(newCursorPosition);
      }
    }, 10);
    
    // IMPORTANT: Call the parent's close handler which should reset the anchor
    if (onCloseShortcutDropdown) {
      onCloseShortcutDropdown();
    }
    if(onCloseSwitchdropdown){
        onCloseSwitchdropdown()
    }
  };

  const handleToggleDropdown = (event) => {
    // Store the current cursor position before opening dropdown
    if (textFieldRef.current) {
      setCursorPosition(textFieldRef.current.selectionStart);
    }
    if (onToggleShortcutDropdown) {
      onToggleShortcutDropdown(event);
    }
  };

  // Ensure cursor position is tracked on focus
  const handleFocus = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  // Track cursor position on click
  const handleClick = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  // Track cursor position on key up (arrow keys, etc.)
  const handleKeyUp = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  return (
    <FormControl fullWidth sx={sx}>
      {label && (
        <InputLabel sx={{ color: "black", mb: 1, position: 'relative', transform: 'none' }}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </InputLabel>
      )}
      <TextField
        inputRef={textFieldRef}
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyUp={handleKeyUp}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        disabled={disabled}
        inputProps={{ maxLength }}
        fullWidth
        size="small"
        sx={{ mt: 1 }}
      />
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleToggleDropdown}
          disabled={disabled}
          sx={{ textTransform: 'none' }}
        >
          Add Shortcode
        </Button>
      </Box>
      <ShortcodePopover
        open={showShortcutDropdown}
        anchorEl={anchorElShortcut}
        onClose={() => {
          if (onCloseShortcutDropdown) {
            onCloseShortcutDropdown();
          }
          // Refocus the text field after closing
          setTimeout(() => {
            textFieldRef.current?.focus();
          }, 0);
        }}
        shortcuts={shortcuts}
        onSelectShortcut={handleAddShortcutWithPosition}
      />
    </FormControl>
  );
});

ShortcodeTextField.displayName = 'ShortcodeTextField';

export default ShortcodeTextField;