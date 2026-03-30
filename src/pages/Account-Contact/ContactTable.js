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
  IconButton,
  Divider,
  Typography,
  Drawer,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import NewContactDrawer from "./NewContactDrawer";
import TagMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext"; // adjust path
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

  // ================= PERMISSIONS =================
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    setUserRole(storedUserRole);

    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const manage = storedData?.teammember?.manageContacts;

    if (storedUserRole === "TeamMember") {
      setCanManageContacts(Boolean(manage));
    } else {
      setCanManageContacts(true);
    }
  }, []);

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
    setPage(0); // reset page on filter change
  }, [filters, contacts]);

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: (ids) => contactsAPI.deleteContacts({ ids }),
    onSuccess: () => {
      toast.success("Contact Deleted Successfully");
      queryClient.invalidateQueries(["contacts"]);
      setSelectedContacts([]);
      // setOpenDeleteDialog(false);
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });



  // ================= HANDLERS =================
  // const handleOpenDrawer = (contact) => {
  //   if (!canManageContacts) {
  //     toast.info("You do not have permission to edit contacts");
  //     return;
  //   }
  //   setSelectedContact(contact);
  //   setOpenDrawer(true);
  // };

  const [drawerOpen, setDrawerOpen] = useState(false);
// const [selectedContact, setSelectedContact] = useState(null);
const [mode, setMode] = useState("create");

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

  const handleContactUpdated = () => {
    queryClient.invalidateQueries(["contacts"]);
  };

  // ================= FILTER UI =================
  const addFilter = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
    setAnchorEl(null);
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
    <Box p={2}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Add Filter
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setFilters({
              contactName: "",
              email: "",
              company: "",
              tags: [],
              contactCode: "",
            });
            setActiveFilters([]);
          }}
          sx={{ ml: 2 }}
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

        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
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

      <Button
        variant="contained"
        color="error"
        disabled={!selectedContacts.length || !canManageContacts}
        onClick={() => {
          if (!canManageContacts) {
            toast.error("You do not have permission to delete contacts");
            return;
          }

          confirm({
            title: "Delete Contacts?",
            description: `Are you sure you want to delete ${selectedContacts.length} contact(s)? This action cannot be undone.`,
            onConfirm: () => {
              deleteMutation.mutate(selectedContacts);
            },
          });
        }}
        sx={{ mb: 2 }}
      >
        Delete Selected ({selectedContacts.length})
      </Button>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  disabled={!canManageContacts}
                  checked={
                    selectedContacts.length > 0 &&
                    selectedContacts.length === filteredContacts.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Phones</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((c) => (
                <TableRow key={c._id}>
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
                      color="success"
                    />
                  </TableCell>

                  <TableCell>
                    <Button onClick={() => handleOpenDrawer(c)}>
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
                        sx={{ mr: 0.5 }}
                      />
                    ))}
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
