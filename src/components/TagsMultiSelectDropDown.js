import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

// ✅ IMPORT YOUR API
import { templateAPI } from "../services/api"; // adjust path if needed

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select tags",
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);

  // Use prop options if passed, otherwise internal
  const options = propOptions || internalOptions;

  // ✅ FETCH TAGS USING templateAPI
  useEffect(() => {
    if (!propOptions) {
      const fetchTags = async () => {
        try {
          const res = await templateAPI.getAllTags();

          // ✅ API RESPONSE FORMAT
          const tags = res?.data?.tags || [];

          setInternalOptions(
            tags.map((tag) => ({
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            }))
          );
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };

      fetchTags();
    }
  }, [propOptions]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedValue) => {
    const newValue = value.some((item) => item.value === selectedValue)
      ? value.filter((item) => item.value !== selectedValue)
      : [...value, options.find((option) => option.value === selectedValue)];

    onChange && onChange(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSelection = () => {
    onChange && onChange([]);
  };

  // ✅ FILTER (search + remove selected)
  const filteredOptions = options
    .filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (option) => !value.some((selected) => selected.value === option.value)
    );

  return (
    <Box>
      <Box
        ref={containerRef}
        sx={{
           display: "flex",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          p: 1,
          cursor: "pointer",
          bgcolor: "#fff",
          minHeight: "40px",
          flexWrap: "wrap",
          borderRadius: "6px"
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value.length > 0 ? (
            value.map((item) => {
              const selectedOption = options.find(
                (option) => option.value === item.value
              );

              return (
                <Chip
                  key={item.value}
                  label={item.label}
                  onDelete={() => handleSelect(item.value)}
                  size="small"
                  sx={{
                    backgroundColor: selectedOption?.colour,
                    color: "#fff",
                    fontWeight: 550,
                    fontSize: "10px",
                    borderRadius: "16px",
                    height: "20px",
                  }}
                />
              );
            })
          ) : (
            <Typography variant="body2" color="textSecondary">
              {placeholder}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {value.length > 0 && (
            <IconButton onClick={clearSelection} size="small">
              <FaTimes />
            </IconButton>
          )}
          <IconButton size="small">
            {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: {
            width: menuWidth || "auto",
            maxHeight: "250px",
          },
        }}
      >
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
        </Box>

        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <Box
              key={option.value}
              sx={{
                color: "#fff",
                fontSize: "10px",
                borderRadius: "10px",
                margin: "5px 10px",
                display: "flex",
                width: "fit-content",
                backgroundColor: option.colour,
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => handleSelect(option.value)}
            >
              <Typography sx={{ fontSize: "inherit" }}>
                {option.label}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 2, color: "gray" }}>
            No results found
          </Typography>
        )}
      </Menu>
    </Box>
  );
};

export default TagsMultiSelectDropDown;