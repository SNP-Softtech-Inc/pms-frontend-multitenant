import React from "react";
import {
  Popover,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ShortcodePopover = ({
  open,
  anchorEl,
  onClose,
  shortcuts,
  onSelectShortcut,
}) => {
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
          maxHeight: 400,
          overflow: "auto",
        },
      }}
    >
      <Box>
        <List
          className="dropdown-list"
          sx={{
            width: "300px",
            cursor: "pointer",
          }}
        >
          {shortcuts.map((shortcut, index) => (
            <ListItem
              key={index}
              onClick={() => onSelectShortcut(shortcut.value)}
              sx={{
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemText
                primary={shortcut.title}
                primaryTypographyProps={{
                  style: {
                    fontWeight: shortcut.isBold ? "bold" : "normal",
                    fontSize: "13px",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  );
};

export default ShortcodePopover;