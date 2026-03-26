import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
const CategoryDrawer = ({
  open,
  onClose,
  onCreateCategory,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [categoryName, setCategoryName] = useState("");

  const handleCreate = () => {
    if (categoryName.trim()) {
      onCreateCategory(categoryName);
      setCategoryName("");
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
          width: isSmallScreen ? "100%" : "650px",
          maxWidth: "100%",
        },
      }}
    >
      <Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <ArrowBackRoundedIcon
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
          <Typography variant="h6">Create Category</Typography>
          <Box sx={{ width: 24 }} />
        </Box>
        <Divider />
      </Box>

      <Box p={3}>
        <InputLabel sx={{ color: "black", mb: 1 }}>
          Category Name
        </InputLabel>
        <TextField
          fullWidth
          placeholder="Enter category name"
          size="small"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
          autoFocus
        />
      </Box>

      <Box
        sx={{
          pt: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          margin: "8px",
          ml: 3,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={!categoryName.trim()}
         
        >
          Create
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
         
        >
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

export default CategoryDrawer;