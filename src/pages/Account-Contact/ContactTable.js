

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   TablePagination,
//   Paper,
//   TextField,
//   Chip,
//   Stack,
//   Button,
//   Menu,
//   MenuItem,
//   Typography,
//   Drawer,
//   Tooltip,
//   CircularProgress,
// } from "@mui/material";
// import NewContactDrawer from "./NewContactDrawer";
// import TagMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
// import { toast } from "react-toastify";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { contactsAPI } from "../../services/api";
// import { useConfirm } from "../../components/ConfirmDialogContext";

// const ContactsTable = () => {
//   const queryClient = useQueryClient();
//   const confirm = useConfirm();

//   const [selectedContact, setSelectedContact] = useState(null);
//   const [userRole, setUserRole] = useState("");
//   const [canManageContacts, setCanManageContacts] = useState(true);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);

//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [selectedContacts, setSelectedContacts] = useState([]);

//   const [filters, setFilters] = useState({
//     contactName: "",
//     email: "",
//     company: "",
//     tags: [],
//     contactCode: "",
//   });

//   const [activeFilters, setActiveFilters] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [mode, setMode] = useState("create");



//   // ================= FETCH CONTACTS =================
//   const {
//     data: contactsData,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["contacts"],
//     queryFn: async () => {
//       const res = await contactsAPI.getContacts();
//       return res.data;
//     },
//   });

//   const contacts = contactsData || [];

//   // ================= FILTERING =================
//   useEffect(() => {
//     let result = [...contacts];

//     if (filters.contactName) {
//       result = result.filter((c) =>
//         c.contactName
//           ?.toLowerCase()
//           .includes(filters.contactName.toLowerCase()),
//       );
//     }

//     if (filters.email) {
//       result = result.filter((c) =>
//         c.email?.toLowerCase().includes(filters.email.toLowerCase()),
//       );
//     }

//     if (filters.company) {
//       result = result.filter((c) =>
//         c.companyName?.toLowerCase().includes(filters.company.toLowerCase()),
//       );
//     }

//     if (filters.contactCode) {
//       result = result.filter((c) =>
//         c.contactCode
//           ?.toLowerCase()
//           .includes(filters.contactCode.toLowerCase()),
//       );
//     }

//     if (filters.tags.length > 0) {
//       result = result.filter((c) =>
//         c.tags?.some((t) => filters.tags.some((sel) => sel.value === t._id)),
//       );
//     }

//     setFilteredContacts(result);
//     setPage(0);
//   }, [filters, contacts]);

//   // ================= DELETE =================
//   const deleteMutation = useMutation({
//     mutationFn: (ids) => contactsAPI.deleteContacts({ ids }),
//     onSuccess: () => {
//       toast.success("Contact Deleted Successfully");
//       queryClient.invalidateQueries(["contacts"]);
//       setSelectedContacts([]);
//     },
//     onError: () => {
//       toast.error("Delete failed");
//     },
//   });

//   // ================= HANDLERS =================
//   const handleOpenDrawer = (contact = null) => {
//     if (contact) {
//       setMode("edit");
//       setSelectedContact(contact);
//     } else {
//       setMode("create");
//       setSelectedContact(null);
//     }
//     setDrawerOpen(true);
//   };

//   const handleSelectOne = (id) => {
//     setSelectedContacts((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedContacts.length === filteredContacts.length) {
//       setSelectedContacts([]);
//     } else {
//       setSelectedContacts(filteredContacts.map((c) => c._id));
//     }
//   };

//   const addFilter = (filter) => {
//     if (!activeFilters.includes(filter)) {
//       setActiveFilters([...activeFilters, filter]);
//     }
//     setAnchorEl(null);
//   };

//   const clearFilters = () => {
//     setFilters({
//       contactName: "",
//       email: "",
//       company: "",
//       tags: [],
//       contactCode: "",
//     });
//     setActiveFilters([]);
//   };

//   // ================= UI STATES =================
//   if (isLoading) {
//     return (
//       <Box textAlign="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return <Typography>Error loading contacts</Typography>;
//   }

//   return (
//     <Box p={3} sx={{ backgroundColor: "#f6f8fb", minHeight: "100vh" }}>
//       {/* FILTER SECTION */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 2.5,
//           mb: 2,
//           borderRadius: 3,
//           border: "1px solid #e0e0e0",
//         }}
//       >
//         <Button
//           variant="contained"
//           sx={{ textTransform: "none", borderRadius: 2 }}
//           onClick={(e) => setAnchorEl(e.currentTarget)}
//         >
//           + Add Filter
//         </Button>

//         <Button
//           variant="outlined"
//           sx={{ ml: 2, textTransform: "none", borderRadius: 2 }}
//           onClick={clearFilters}
//         >
//           Clear Filters
//         </Button>

//         <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
//           <MenuItem onClick={() => addFilter("contactName")}>
//             Contact Name
//           </MenuItem>
//           <MenuItem onClick={() => addFilter("email")}>Email</MenuItem>
//           <MenuItem onClick={() => addFilter("company")}>Company</MenuItem>
//           <MenuItem onClick={() => addFilter("tags")}>Tags</MenuItem>
//           <MenuItem onClick={() => addFilter("contactCode")}>
//             Contact Code
//           </MenuItem>
//         </Menu>

//         <Stack direction="row" spacing={2} mt={2} flexWrap="wrap" useFlexGap>
//           {activeFilters.includes("contactName") && (
//             <TextField
//               size="small"
//               label="Name"
//               value={filters.contactName}
//               onChange={(e) =>
//                 setFilters({ ...filters, contactName: e.target.value })
//               }
//             />
//           )}

//           {activeFilters.includes("email") && (
//             <TextField
//               size="small"
//               label="Email"
//               value={filters.email}
//               onChange={(e) =>
//                 setFilters({ ...filters, email: e.target.value })
//               }
//             />
//           )}

//           {activeFilters.includes("company") && (
//             <TextField
//               size="small"
//               label="Company"
//               value={filters.company}
//               onChange={(e) =>
//                 setFilters({ ...filters, company: e.target.value })
//               }
//             />
//           )}

//           {activeFilters.includes("contactCode") && (
//             <TextField
//               size="small"
//               label="Contact Code"
//               value={filters.contactCode}
//               onChange={(e) =>
//                 setFilters({ ...filters, contactCode: e.target.value })
//               }
//             />
//           )}

//           {activeFilters.includes("tags") && (
//             <TagMultiSelectDropDown
//               value={filters.tags}
//               onChange={(newTags) => setFilters({ ...filters, tags: newTags })}
//               options={[
//                 ...new Map(
//                   contacts
//                     .flatMap((c) => c.tags || [])
//                     .map((tag) => [
//                       tag._id,
//                       {
//                         value: tag._id,
//                         label: tag.tagName,
//                         colour: tag.tagColour,
//                       },
//                     ]),
//                 ).values(),
//               ]}
//               width="250px"
//             />
//           )}
//         </Stack>
//       </Paper>

//       {/* DELETE BUTTON */}
//       <Box display="flex" alignItems="center" gap={2} m={2}>
//       <Button
//         variant="contained"
//         color="error"
//         disabled={!selectedContacts.length || !canManageContacts}
//         sx={{  textTransform: "none", borderRadius: 2 }}
//         onClick={() => {
//           if (!canManageContacts) {
//             toast.error("No permission");
//             return;
//           }

//           confirm({
//             title: "Delete Contacts?",
//             description: `Delete ${selectedContacts.length} contact(s)?`,
//             onConfirm: () => deleteMutation.mutate(selectedContacts),
//           });
//         }}
//       >
//         Delete Selected ({selectedContacts.length})
//       </Button>
//       <Button
//         variant="outlined"
//         sx={{  textTransform: "none", borderRadius: 2 }}
//         disabled={!filteredContacts.length}
//         onClick={() => {
//           if (selectedContacts.length === filteredContacts.length) {
//             setSelectedContacts([]);
//           } else {
//             setSelectedContacts(filteredContacts.map((c) => c._id));
//           }
//         }}
//       >
//         {selectedContacts.length === filteredContacts.length
//           ? "Unselect All"
//           : "Select All"}
//       </Button>
//       </Box>
//       {/* TABLE */}
//       <TableContainer
//         component={Paper}
//         elevation={0}
//         sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#fafafa" }}>
//               <TableCell padding="checkbox">
//                 <input
//                   type="checkbox"
//                   disabled={!canManageContacts}
//                   checked={
//                     filteredContacts
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage,
//                       )
//                       .every((c) => selectedContacts.includes(c._id)) &&
//                     filteredContacts.length > 0
//                   }
//                   onChange={() => {
//                     const pageContacts = filteredContacts
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage,
//                       )
//                       .map((c) => c._id);

//                     const allSelected = pageContacts.every((id) =>
//                       selectedContacts.includes(id),
//                     );

//                     if (allSelected) {
//                       // Unselect current page
//                       setSelectedContacts((prev) =>
//                         prev.filter((id) => !pageContacts.includes(id)),
//                       );
//                     } else {
//                       // Select current page
//                       setSelectedContacts((prev) => [
//                         ...new Set([...prev, ...pageContacts]),
//                       ]);
//                     }
//                   }}
//                 />
//               </TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Phones</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {filteredContacts.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   <Typography sx={{ py: 5, color: "#888" }}>
//                     No contacts found
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}

//             {filteredContacts
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((c) => (
//                 <TableRow
//                   key={c._id}
//                   sx={{
//                     "&:hover": { backgroundColor: "#f9fbff" },
//                     transition: "0.2s",
//                   }}
//                 >
//                   <TableCell padding="checkbox">
//                     <input
//                       type="checkbox"
//                       checked={selectedContacts.includes(c._id)}
//                       onChange={() => handleSelectOne(c._id)}
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <Chip
//                       label={c.contactCode || "—"}
//                       size="small"
//                       sx={{
//                         backgroundColor: "#e8f5e9",
//                         color: "#2e7d32",
//                       }}
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <Button
//                       onClick={() => handleOpenDrawer(c)}
//                       sx={{
//                         textTransform: "none",
//                         color: "#1976d2",
//                       }}
//                     >
//                       {c.contactName || "—"}
//                     </Button>
//                   </TableCell>

//                   <TableCell>{c.email || "—"}</TableCell>
//                   <TableCell>{c.companyName || "—"}</TableCell>
//                   <TableCell>{c.phoneNumbers?.join(", ") || "—"}</TableCell>

//                   <TableCell>
//                     {c.tags?.slice(0, 2).map((t) => (
//                       <Chip
//                         key={t._id}
//                         label={t.tagName}
//                         size="small"
//                         sx={{
//                           mr: 0.5,
//                           backgroundColor: t.tagColour,
//                           color: "#fff",
//                         }}
//                       />
//                     ))}

//                     {c.tags?.length > 2 && (
//                       <Tooltip
//                         arrow
//                         title={
//                           <Box display="flex" gap={0.5} flexWrap="wrap">
//                             {c.tags.slice(2).map((t) => (
//                               <Chip
//                                 key={t._id}
//                                 label={t.tagName}
//                                 size="small"
//                                 sx={{
//                                   backgroundColor: t.tagColour,
//                                   color: "#fff",
//                                 }}
//                               />
//                             ))}
//                           </Box>
//                         }
//                       >
//                         <Chip
//                           label={`+${c.tags.length - 2}`}
//                           size="small"
//                           sx={{ cursor: "pointer" }}
//                         />
//                       </Tooltip>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>

//         <TablePagination
//           component="div"
//           count={filteredContacts.length}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//           sx={{ borderTop: "1px solid #eee" }}
//         />
//       </TableContainer>

//       <NewContactDrawer
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         selectedContact={selectedContact}
//         mode={mode}
//       />
//     </Box>
//   );
// };

// export default ContactsTable;


/* ─── ContactTable — @tanstack/react-table + shadcn DataTable ─── */
import React, { useEffect, useState, useMemo } from "react";
import {useToastContext} from "../../context/ToastContext"
import { Trash2, X, UserSearch, AtSign, Building2, Hash, TagsIcon } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import TagMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import NewContactDrawer from "./NewContactDrawer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { cn } from "../../lib/utils";

function TagPills({ tags }) {
  if (!tags?.length) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tags.slice(0, 2).map((t) => (
        <span
          key={t._id}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium truncate max-w-[110px]"
          style={{ backgroundColor: t.tagColour, color: "#fff" }}
        >
          {t.tagName}
        </span>
      ))}
      {tags.length > 2 && (
        <span
          title={tags.slice(2).map((t) => t.tagName).join(", ")}
          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border cursor-default"
        >
          +{tags.length - 2}
        </span>
      )}
    </div>
  );
}

const ContactsTable = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
const { showToast } = useToastContext();
  const [userRole, setUserRole] = useState("");
  const [canManageContacts, setCanManageContacts] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mode, setMode] = useState("create");

  const [filters, setFilters] = useState({
    contactName: "",
    email: "",
    company: "",
    tags: [],
    contactCode: "",
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // ================= FETCH CONTACTS =================
  const {
    data: contactsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await contactsAPI.getContacts();
      return res.data;
    },
  });

  const contacts = contactsData || [];

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: (ids) => contactsAPI.deleteContacts({ ids }),
    onSuccess: () => {
      showToast({
        title: "Contact Deleted Successfully",
        type: "success",
      });
      queryClient.invalidateQueries(["contacts"]);
      setSelectedIds([]);
    },
    onError: () => {
      showToast({
        title: "Delete failed",
        type: "error",
      });
    },
  });

  // ================= UNIQUE TAG OPTIONS =================
  const uniqueTagOptions = useMemo(
    () =>
      Array.from(
        new Map(
          contacts
            .flatMap((c) => c.tags || [])
            .map((t) => [
              t._id,
              { value: t._id, label: t.tagName, colour: t.tagColour },
            ])
        ).values()
      ),
    [contacts]
  );

  // ================= FILTERED DATA =================
  const filteredData = useMemo(() => {
    let d = [...contacts];
    if (filters.contactName) {
      d = d.filter((c) =>
        c.contactName?.toLowerCase().includes(filters.contactName.toLowerCase())
      );
    }
    if (filters.email) {
      d = d.filter((c) =>
        c.email?.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.company) {
      d = d.filter((c) =>
        c.companyName?.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    if (filters.contactCode) {
      d = d.filter((c) =>
        c.contactCode?.toLowerCase().includes(filters.contactCode.toLowerCase())
      );
    }
    if (filters.tags.length) {
      d = d.filter((c) =>
        c.tags?.some((t) => filters.tags.some((s) => s.value === t._id))
      );
    }
    return d;
  }, [contacts, filters]);

  // ================= HANDLERS =================
  const handleOpenDrawer = (contact = null) => {
    if (!canManageContacts) {
      showToast({
        title: "You do not have permission to edit contacts",
        type: "info",
      });
      return;
    }
    if (contact) {
      setMode("edit");
      setSelectedContact(contact);
    } else {
      setMode("create");
      setSelectedContact(null);
    }
    setDrawerOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    
    confirm({
      title: "Delete Contacts?",
      description: `Delete ${selectedIds.length} contact(s)?`,
      onConfirm: () => deleteMutation.mutate(selectedIds),
    });
  };

  const toggleFilter = (key) => {
    if (activeFilters.includes(key)) {
      setActiveFilters((p) => p.filter((f) => f !== key));
      setFilters((p) => ({ ...p, [key]: key === "tags" ? [] : "" }));
    } else {
      setActiveFilters((p) => [...p, key]);
    }
  };

  const removeFilter = (key) => {
    setActiveFilters((p) => p.filter((f) => f !== key));
    setFilters((p) => ({ ...p, [key]: key === "tags" ? [] : "" }));
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

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        accessorKey: "contactCode",
        header: "Code",
        size: 100,
        cell: ({ getValue }) => {
          const v = getValue();
          return v ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {v}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          );
        },
      },
      {
        accessorKey: "contactName",
        header: "Contact Name",
        size: 200,
        cell: ({ row, getValue }) => (
          <button
            onClick={() => handleOpenDrawer(row.original)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-left truncate max-w-[180px] block"
          >
            {getValue() || "—"}
          </button>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
        cell: ({ getValue }) => (
          <span className="text-sm text-foreground/80 truncate block max-w-[190px]">
            {getValue() || <span className="text-muted-foreground">—</span>}
          </span>
        ),
      },
      {
        accessorKey: "companyName",
        header: "Company",
        size: 160,
        cell: ({ getValue }) => (
          <span className="text-sm text-foreground/80">
            {getValue() || <span className="text-muted-foreground">—</span>}
          </span>
        ),
      },
      {
        accessorKey: "phoneNumbers",
        header: "Phones",
        size: 160,
        enableSorting: false,
        cell: ({ getValue }) => {
          const nums = getValue();
          if (!nums?.length) return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <span className="text-sm text-foreground/80 truncate block max-w-[150px]">
              {nums.join(", ")}
            </span>
          );
        },
      },
      {
        accessorKey: "tags",
        header: "Tags",
        size: 200,
        enableSorting: false,
        cell: ({ getValue }) => <TagPills tags={getValue()} />,
      },
    ],
    [canManageContacts]
  );

  // ================= FILTER DEFINITIONS =================
  const FILTER_DEFS = [
    { key: "contactName", label: "Name", Icon: UserSearch },
    { key: "email", label: "Email", Icon: AtSign },
    { key: "company", label: "Company", Icon: Building2 },
    { key: "contactCode", label: "Contact Code", Icon: Hash },
    { key: "tags", label: "Tags", Icon: TagsIcon },
  ];

  const filterButtons = FILTER_DEFS.map(({ key, label, Icon }) => {
    const active = activeFilters.includes(key);
    return (
      <button
        key={key}
        onClick={() => toggleFilter(key)}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors",
          active
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  });

  // ================= BULK ACTIONS =================
  const bulkActions = canManageContacts ? (
    <button
      onClick={handleDeleteSelected}
      disabled={!selectedIds.length}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border transition-colors",
        selectedIds.length
          ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
      )}
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete ({selectedIds.length})
    </button>
  ) : null;

  // ================= SELECT ALL HANDLER =================
  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((c) => c._id));
    }
  };

  const selectAllButton = filteredData.length > 0 && (
    <button
      onClick={handleSelectAll}
      className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
    >
      {selectedIds.length === filteredData.length ? "Unselect All" : "Select All"}
    </button>
  );

  // ================= LOADING & ERROR STATES =================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading contacts</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          Contacts
        </h1>
      </div>

      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        filterButtons={filterButtons}
        selectedCount={selectedIds.length}
        bulkActions={bulkActions}
        extraActions={selectAllButton}
      >
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {activeFilters.includes("contactName") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.contactName}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, contactName: e.target.value }))
                  }
                  placeholder="Name…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-32"
                />
                <button
                  onClick={() => removeFilter("contactName")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {activeFilters.includes("email") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.email}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36"
                />
                <button
                  onClick={() => removeFilter("email")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {activeFilters.includes("company") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.company}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, company: e.target.value }))
                  }
                  placeholder="Company…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-32"
                />
                <button
                  onClick={() => removeFilter("company")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {activeFilters.includes("contactCode") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.contactCode}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, contactCode: e.target.value }))
                  }
                  placeholder="Contact Code…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-28"
                />
                <button
                  onClick={() => removeFilter("contactCode")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* {activeFilters.includes("tags") && (
              <div className="flex items-center gap-1.5 min-h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TagMultiSelectDropDown
                  value={filters.tags}
                  onChange={(v) => setFilters((p) => ({ ...p, tags: v }))}
                  options={uniqueTagOptions}
                  width="200px"
                />
                <button
                  onClick={() => removeFilter("tags")}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )} */}
  {activeFilters.includes("tags") && (
  <div className="flex items-center gap-1.5 min-h-8 w-[400px] border border-border rounded-lg pl-1 pr-1.5 bg-background">
    <div className="flex-1 min-w-0">
         <TagMultiSelectDropDown
                  value={filters.tags}
                  onChange={(v) => setFilters((p) => ({ ...p, tags: v }))}
                  options={uniqueTagOptions}
                  width="200px"
                />
    </div>

    <button
      onClick={() => removeFilter("tags")}
      className="text-muted-foreground hover:text-foreground shrink-0"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  </div>
)}
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={filteredData}
        loading={isLoading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={canManageContacts}
        onRowSelectionChange={(rowSel) =>
          setSelectedIds(Object.keys(rowSel).filter((k) => rowSel[k]))
        }
        getRowId={(row) => row._id}
        emptyMessage="No contacts found"
        emptyDescription="Add contacts to get started"
        pageSize={25}
      />

      {/* New Contact Drawer */}
      <NewContactDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          queryClient.invalidateQueries(["contacts"]);
        }}
        selectedContact={selectedContact}
        mode={mode}
      />
    </div>
  );
};

export default ContactsTable;