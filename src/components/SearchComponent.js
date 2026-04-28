import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Stack,
  Typography,
  Divider,
  CircularProgress,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  IconButton,
  Drawer,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path

import { accountsAPI, contactsAPI } from "../services/api";
import NewContactDrawer from "../pages/Account-Contact/NewContactDrawer";

// -------------------------------
// 🔥 Debounce Hook
// -------------------------------
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const SearchComponent = () => {
    const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
 const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  // -------------------------------
  // 🔥 SEARCH EFFECT (DEBOUNCED)
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery) {
        setOptions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let combinedOptions = [];

       const isTeamMember = user?.role === "team_member";

//        const accountPromise = isTeamMember
//   ? accountsAPI.getAccountsByTeamMember(true)
//   : accountsAPI.getAccountNamesByStatus(true);

const accountPromise = isTeamMember
  ? accountsAPI.getAccountsByTeamMember({
      active: true,
      search: debouncedQuery,
    })
  : accountsAPI.getAccountNamesByStatus({
      active: true,
      search: debouncedQuery,
    });
        // -------------------------------
        // EMAIL SEARCH
        // -------------------------------
        if (isEmail(debouncedQuery)) {
          const [accountsRes, contactsRes] = await Promise.all([
            accountPromise,
            contactsAPI.getContactsByEmail(debouncedQuery),
          ]);

          const accounts =
            accountsRes.data.accountlist || accountsRes.data || [];

          const contacts = contactsRes.data.data || [];
          combinedOptions = [
            ...accounts.map((a) => ({
              id: a._id,
              label: a.accountName,
              subLabel:
                a.emails?.length > 0
                  ? a.emails.join(", ")
                  : "No Email",
              type: "Accounts",
            })),
            ...contacts.map((c) => ({
              id: c._id,
              label: c.contactName,
              subLabel: c.email,
              type: "Contacts",
            })),
          ];
        }

        // -------------------------------
        // NAME SEARCH
        // -------------------------------
        else {
          const [accountsRes, contactsRes] = await Promise.all([
            accountPromise,
           contactsAPI.getContactNames({ search: debouncedQuery }),
          ]);

          const accounts =
            accountsRes.data.accountlist || accountsRes.data || [];

          const contacts = contactsRes.data.data || [];

          combinedOptions = [
            ...accounts.map((a) => ({
              id: a._id,
              label: a.accountName,
              subLabel:
                a.emails?.length > 0
                  ? a.emails.join(", ")
                  : "No Email",
              type: "Accounts",
            })),
            ...contacts.map((c) => ({
              id: c._id,
              label: c.contactName,
              subLabel: c.email ?? "No Email",
              type: "Contacts",
            })),
          ];
        }

        setOptions(combinedOptions);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  // -------------------------------
  // FILTERED RESULTS
  // -------------------------------
  const filteredOptions = useMemo(() => {
    return options.filter(
      (opt) => filterType === "All" || opt.type === filterType
    );
  }, [options, filterType]);

  // -------------------------------
  // CLICK HANDLER
  // -------------------------------
  const handleClick = async (option) => {
    console.log("Clicked option:", option);
    if (option.type === "Accounts") {
      navigate(`/clients/accounts/accountsdash/overview/${option.id}`);
      setSearchQuery("");
      return;
    }

    try {
      const res = await contactsAPI.getContactById(option.id);
      console.log("Fetched contact details:", res.data);
      setDrawerOpen(true);
      setSelectedContact(res.data.data);
       setMode("edit");
      setSearchQuery("");
      setOptions([]);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <Box sx={{ position: "relative", width: 360 }}>
      {/* Search Input */}
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search accounts or contacts..."
        size="small"
        fullWidth
        sx={{
          bgcolor: "#f9fafb",
          borderRadius: "10px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
          ),
          endAdornment: (
            <>
              {loading && <CircularProgress size={18} />}
              {searchQuery && !loading && (
                <IconButton onClick={() => setSearchQuery("")} size="small">
                  <RxCross2 />
                </IconButton>
              )}
            </>
          ),
        }}
      />

      {/* Dropdown */}
      {searchQuery && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "105%",
            left: 0,
            right: 0,
            borderRadius: 3,
            mt: 1,
            zIndex: 20,
            maxHeight: 420,
            overflow: "hidden",
          }}
        >
          {/* Filter Tabs */}
          <Stack direction="row" spacing={2} sx={{ p: 2 }}>
            {["All", "Accounts", "Contacts"].map((type) => {
              const count = options.filter(
                (o) => type === "All" || o.type === type
              ).length;

              return (
                <Chip
                  key={type}
                  label={`${type} (${count})`}
                  clickable
                  color={filterType === type ? "primary" : "default"}
                  onClick={() => setFilterType(type)}
                />
              );
            })}
          </Stack>

          <Divider />

          {/* Results */}
          {loading ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : filteredOptions.length > 0 ? (
            <List>
              {filteredOptions.map((option) => (
                <ListItemButton
                  key={option.id}
                  onClick={() => handleClick(option)}
                  sx={{
                    "&:hover": { bgcolor: "#f5f7fa" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                      {option.label?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={option.label}
                    secondary={option.subLabel}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{
                      fontSize: "0.8rem",
                      color: "text.secondary",
                    }}
                  />

                  <Chip
                    label={option.type}
                    size="small"
                    color={option.type === "Accounts" ? "info" : "success"}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography sx={{ p: 3, textAlign: "center", color: "gray" }}>
              No results found
            </Typography>
          )}
        </Paper>
      )}

    <NewContactDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedContact={selectedContact}
        mode={mode}
      />
    </Box>
  );
};

export default SearchComponent;