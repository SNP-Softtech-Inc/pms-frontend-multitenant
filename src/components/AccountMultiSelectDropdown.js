import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Checkbox,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { accountsAPI } from "../services/api"; // ✅ ONLY THIS API

const MultiSelectDropdown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select from list",
  width = "100%",
}) => {
  const containerRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const options = propOptions || internalOptions;

  // ✅ FETCH ONLY ALL ACCOUNTS
  useEffect(() => {
    if (!propOptions && !initialized) {
      const fetchAccounts = async () => {
        try {
          setLoading(true);

          const res = await accountsAPI.getAccountsList();

          const list = res.data.accountlist || [];

          const formatted = list.map((acc) => ({
            value: acc._id,
            label: acc.accountName,
          }));

          setInternalOptions(formatted);

          // ✅ AUTO SELECT FROM COOKIE (optional)
          if (value.length === 0) {
            const accountIdFromCookie = Cookies.get("accountId");

            if (accountIdFromCookie) {
              const matched = formatted.find(
                (acc) => acc.value === accountIdFromCookie
              );

              if (matched && onChange) {
                onChange([matched]);
              }
            }
          }

          setInitialized(true);
        } catch (error) {
          console.error("Error fetching accounts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAccounts();
    }
  }, [propOptions, initialized, onChange, value]);

  // ================= HANDLERS =================

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (selectedValue) => {
    const newValue = value.some((item) => item.value === selectedValue)
      ? value.filter((item) => item.value !== selectedValue)
      : [...value, options.find((opt) => opt.value === selectedValue)];

    onChange?.(newValue);
  };

  const clearSelection = () => onChange?.([]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= UI =================

  return (
    <Box sx={{ width }}>
      {/* SELECT BOX */}
      <Box
        ref={containerRef}
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "8px",
          cursor: "pointer",
          bgcolor: "#fff",
          mt: 2,
          minHeight: "40px",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flexGrow: 1 }}>
          {value.length > 0 ? (
            value.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                size="small"
                onDelete={() => handleSelect(item.value)}
                sx={{ fontSize: "11px", borderRadius: "14px" }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {placeholder}
            </Typography>
          )}
        </Box>

        <IconButton size="small">
          {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
        </IconButton>
      </Box>

      {/* DROPDOWN */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: menuWidth || 300,
            maxHeight: 300,
          },
        }}
      >
        {/* SEARCH */}
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </Box>

        {/* OPTIONS */}
        {loading ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <CircularProgress size={20} />
          </Box>
        ) : filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <Box
              key={option.value}
              onClick={() => handleSelect(option.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Checkbox
                checked={value.some((v) => v.value === option.value)}
                size="small"
              />
              <Typography>{option.label}</Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 2, color: "gray" }}>
            No results found
          </Typography>
        )}

        {/* CLEAR */}
        {value.length > 0 && (
          <Box
            onClick={clearSelection}
            sx={{
              px: 2,
              py: 1,
              color: "red",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Clear selection
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default MultiSelectDropdown;