

// ShortcodePopover.jsx (updated selection handling)
import React, { useState, useMemo } from "react";
import {
  Popover,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ShortcodePopover = ({
  open,
  anchorEl,
  onClose,
  shortcuts,
  onSelectShortcut,
  title = "Add Shortcode",
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShortcuts = useMemo(() => {
    if (!searchTerm.trim()) return shortcuts;
    
    return shortcuts.filter(shortcut => 
      shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shortcut.value && shortcut.value.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [shortcuts, searchTerm]);

  const handleSelectShortcut = (shortcutValue) => {
    if (shortcutValue && onSelectShortcut) {
      onSelectShortcut(shortcutValue);
    }
    setSearchTerm("");
    onClose();
  };

  const renderShortcuts = () => {
    const items = [];
    let currentCategory = null;
    let hasVisibleItems = false;

    filteredShortcuts.forEach((shortcut, index) => {
      if (shortcut.isBold) {
        if (hasVisibleItems) {
          items.push(
            <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          );
        }
        items.push(
          <ListItem key={`header-${index}`} sx={{ py: 0.5, bgcolor: '#f8f9fa' }}>
            <ListItemText
              primary={shortcut.title}
              primaryTypographyProps={{
                style: {
                  fontWeight: "bold",
                  fontSize: "12px",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                },
              }}
            />
          </ListItem>
        );
        currentCategory = shortcut.title;
        hasVisibleItems = false;
      } else {
        items.push(
          <ListItem
            key={`item-${index}`}
            onClick={() => handleSelectShortcut(shortcut.value)}
            sx={{
              py: 0.75,
              pl: 3,
              "&:hover": {
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              },
              transition: "background-color 0.2s",
            }}
          >
            <ListItemText
              primary={shortcut.title}
              secondary={shortcut.value && `[${shortcut.value}]`}
              primaryTypographyProps={{
                style: {
                  fontWeight: "normal",
                  fontSize: "13px",
                  color: "#333",
                },
              }}
              secondaryTypographyProps={{
                style: {
                  fontSize: "10px",
                  color: "#999",
                  fontFamily: "monospace",
                },
              }}
            />
          </ListItem>
        );
        hasVisibleItems = true;
      }
    });

    if (items.length === 0) {
      items.push(
        <ListItem key="empty" sx={{ py: 3, justifyContent: "center" }}>
          <Typography variant="body2" color="textSecondary">
            No shortcuts found
          </Typography>
        </ListItem>
      );
    }

    return items;
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          maxHeight: 500,
          overflow: "auto",
          minWidth: 300,
          maxWidth: 360,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Box>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
              fontSize: "13px",
            }}
          >
            {title}
          </Typography>
        </Box>

        {showSearch && (
          <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "#999" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                },
              }}
              autoFocus
            />
          </Box>
        )}

        <List
          className="shortcode-list"
          sx={{
            width: "100%",
            py: 0.5,
          }}
        >
          {renderShortcuts()}
        </List>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              fontSize: "11px",
              display: "block",
              textAlign: "center",
            }}
          >
            Click on any shortcode to insert at cursor position
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
};

export default ShortcodePopover;