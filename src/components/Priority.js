

import React from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  
  Chip,
} from "@mui/material";


const Priority = ({ onPriorityChange, selectedPriority }) => {
  const options = [
    { value: "Urgent", label: "Urgent", color: "#0E0402" },
    { value: "High", label: "High", color: "#fe676e" },
    { value: "Medium", label: "Medium", color: "#FFC300" },
    { value: "Low", label: "Low", color: "#56c288" },
  ];

  const handleChange = (event) => {
    onPriorityChange(event.target.value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: "auto",
      },
    },
  };

  return (
    <Box>
      
      <FormControl fullWidth>
        <Select
          size="small"
          value={selectedPriority || ""}
          onChange={handleChange}
          renderValue={(selected) => (
            <Chip
              label={selected}
              style={{
                backgroundColor: options.find((opt) => opt.value === selected)?.color,
                color: "#fff",
                fontWeight: 500,
                fontSize: "10px",
                borderRadius: "16px",
                height: "20px",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            />
          )}
          MenuProps={MenuProps}
          sx={{
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Chip
                label={option.label}
                style={{
                  backgroundColor: option.color,
                  color: "#fff",
                  fontSize: "10px",
                  borderRadius: "10px",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: option.color,
                    color: "#fff",
                  },
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Priority;
