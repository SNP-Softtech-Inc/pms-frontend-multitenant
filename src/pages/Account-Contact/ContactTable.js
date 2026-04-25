

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Paper,
  TextField,
  Chip,
  Stack,
  Button,
  Menu,
  MenuItem,
  Typography,
  Drawer,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import NewContactDrawer from "./NewContactDrawer";
import TagMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";

const ContactsTable = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [selectedContact, setSelectedContact] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [canManageContacts, setCanManageContacts] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [filters, setFilters] = useState({
    contactName: "",
    email: "",
    company: "",
    tags: [],
    contactCode: "",
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("create");

  // ================= PERMISSIONS =================
  // useEffect(() => {
  //   const storedUserRole = localStorage.getItem("userRole");
  //   setUserRole(storedUserRole);

  //   const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  //   const manage = storedData?.teammember?.manageContacts;

  //   if (storedUserRole === "TeamMember") {
  //     setCanManageContacts(Boolean(manage));
  //   } else {
  //     setCanManageContacts(true);
  //   }
  // }, []);

  // ================= FETCH CONTACTS =================
  const {
    data: contactsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await contactsAPI.getContacts();
      return res.data;
    },
  });

  const contacts = contactsData || [];

  // ================= FILTERING =================
  useEffect(() => {
    let result = [...contacts];

    if (filters.contactName) {
      result = result.filter((c) =>
        c.contactName
          ?.toLowerCase()
          .includes(filters.contactName.toLowerCase()),
      );
    }

    if (filters.email) {
      result = result.filter((c) =>
        c.email?.toLowerCase().includes(filters.email.toLowerCase()),
      );
    }

    if (filters.company) {
      result = result.filter((c) =>
        c.companyName?.toLowerCase().includes(filters.company.toLowerCase()),
      );
    }

    if (filters.contactCode) {
      result = result.filter((c) =>
        c.contactCode
          ?.toLowerCase()
          .includes(filters.contactCode.toLowerCase()),
      );
    }

    if (filters.tags.length > 0) {
      result = result.filter((c) =>
        c.tags?.some((t) => filters.tags.some((sel) => sel.value === t._id)),
      );
    }

    setFilteredContacts(result);
    setPage(0);
  }, [filters, contacts]);

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: (ids) => contactsAPI.deleteContacts({ ids }),
    onSuccess: () => {
      toast.success("Contact Deleted Successfully");
      queryClient.invalidateQueries(["contacts"]);
      setSelectedContacts([]);
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  // ================= HANDLERS =================
  const handleOpenDrawer = (contact = null) => {
    if (contact) {
      setMode("edit");
      setSelectedContact(contact);
    } else {
      setMode("create");
      setSelectedContact(null);
    }
    setDrawerOpen(true);
  };

  const handleSelectOne = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c._id));
    }
  };

  const addFilter = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
    setAnchorEl(null);
  };

  const clearFilters = () => {
    setFilters({
      contactName: "",
      email: "",
      company: "",
      tags: [],
      contactCode: "",
    });
    setActiveFilters([]);
  };

  // ================= UI STATES =================
  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading contacts</Typography>;
  }

  return (
    <Box p={3} sx={{ backgroundColor: "#f6f8fb", minHeight: "100vh" }}>
      {/* FILTER SECTION */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
        }}
      >
        <Button
          variant="contained"
          sx={{ textTransform: "none", borderRadius: 2 }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          + Add Filter
        </Button>

        <Button
          variant="outlined"
          sx={{ ml: 2, textTransform: "none", borderRadius: 2 }}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => addFilter("contactName")}>
            Contact Name
          </MenuItem>
          <MenuItem onClick={() => addFilter("email")}>Email</MenuItem>
          <MenuItem onClick={() => addFilter("company")}>Company</MenuItem>
          <MenuItem onClick={() => addFilter("tags")}>Tags</MenuItem>
          <MenuItem onClick={() => addFilter("contactCode")}>
            Contact Code
          </MenuItem>
        </Menu>

        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap" useFlexGap>
          {activeFilters.includes("contactName") && (
            <TextField
              size="small"
              label="Name"
              value={filters.contactName}
              onChange={(e) =>
                setFilters({ ...filters, contactName: e.target.value })
              }
            />
          )}

          {activeFilters.includes("email") && (
            <TextField
              size="small"
              label="Email"
              value={filters.email}
              onChange={(e) =>
                setFilters({ ...filters, email: e.target.value })
              }
            />
          )}

          {activeFilters.includes("company") && (
            <TextField
              size="small"
              label="Company"
              value={filters.company}
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
            />
          )}

          {activeFilters.includes("contactCode") && (
            <TextField
              size="small"
              label="Contact Code"
              value={filters.contactCode}
              onChange={(e) =>
                setFilters({ ...filters, contactCode: e.target.value })
              }
            />
          )}

          {activeFilters.includes("tags") && (
            <TagMultiSelectDropDown
              value={filters.tags}
              onChange={(newTags) => setFilters({ ...filters, tags: newTags })}
              options={[
                ...new Map(
                  contacts
                    .flatMap((c) => c.tags || [])
                    .map((tag) => [
                      tag._id,
                      {
                        value: tag._id,
                        label: tag.tagName,
                        colour: tag.tagColour,
                      },
                    ]),
                ).values(),
              ]}
              width="250px"
            />
          )}
        </Stack>
      </Paper>

      {/* DELETE BUTTON */}
      <Box display="flex" alignItems="center" gap={2} m={2}>
      <Button
        variant="contained"
        color="error"
        disabled={!selectedContacts.length || !canManageContacts}
        sx={{  textTransform: "none", borderRadius: 2 }}
        onClick={() => {
          if (!canManageContacts) {
            toast.error("No permission");
            return;
          }

          confirm({
            title: "Delete Contacts?",
            description: `Delete ${selectedContacts.length} contact(s)?`,
            onConfirm: () => deleteMutation.mutate(selectedContacts),
          });
        }}
      >
        Delete Selected ({selectedContacts.length})
      </Button>
      <Button
        variant="outlined"
        sx={{  textTransform: "none", borderRadius: 2 }}
        disabled={!filteredContacts.length}
        onClick={() => {
          if (selectedContacts.length === filteredContacts.length) {
            setSelectedContacts([]);
          } else {
            setSelectedContacts(filteredContacts.map((c) => c._id));
          }
        }}
      >
        {selectedContacts.length === filteredContacts.length
          ? "Unselect All"
          : "Select All"}
      </Button>
      </Box>
      {/* TABLE */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  disabled={!canManageContacts}
                  checked={
                    filteredContacts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .every((c) => selectedContacts.includes(c._id)) &&
                    filteredContacts.length > 0
                  }
                  onChange={() => {
                    const pageContacts = filteredContacts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((c) => c._id);

                    const allSelected = pageContacts.every((id) =>
                      selectedContacts.includes(id),
                    );

                    if (allSelected) {
                      // Unselect current page
                      setSelectedContacts((prev) =>
                        prev.filter((id) => !pageContacts.includes(id)),
                      );
                    } else {
                      // Select current page
                      setSelectedContacts((prev) => [
                        ...new Set([...prev, ...pageContacts]),
                      ]);
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phones</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ py: 5, color: "#888" }}>
                    No contacts found
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {filteredContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((c) => (
                <TableRow
                  key={c._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9fbff" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(c._id)}
                      onChange={() => handleSelectOne(c._id)}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={c.contactCode || "—"}
                      size="small"
                      sx={{
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() => handleOpenDrawer(c)}
                      sx={{
                        textTransform: "none",
                        color: "#1976d2",
                      }}
                    >
                      {c.contactName || "—"}
                    </Button>
                  </TableCell>

                  <TableCell>{c.email || "—"}</TableCell>
                  <TableCell>{c.companyName || "—"}</TableCell>
                  <TableCell>{c.phoneNumbers?.join(", ") || "—"}</TableCell>

                  <TableCell>
                    {c.tags?.slice(0, 2).map((t) => (
                      <Chip
                        key={t._id}
                        label={t.tagName}
                        size="small"
                        sx={{
                          mr: 0.5,
                          backgroundColor: t.tagColour,
                          color: "#fff",
                        }}
                      />
                    ))}

                    {c.tags?.length > 2 && (
                      <Tooltip
                        arrow
                        title={
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {c.tags.slice(2).map((t) => (
                              <Chip
                                key={t._id}
                                label={t.tagName}
                                size="small"
                                sx={{
                                  backgroundColor: t.tagColour,
                                  color: "#fff",
                                }}
                              />
                            ))}
                          </Box>
                        }
                      >
                        <Chip
                          label={`+${c.tags.length - 2}`}
                          size="small"
                          sx={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredContacts.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: "1px solid #eee" }}
        />
      </TableContainer>

      <NewContactDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedContact={selectedContact}
        mode={mode}
      />
    </Box>
  );
};

export default ContactsTable;
