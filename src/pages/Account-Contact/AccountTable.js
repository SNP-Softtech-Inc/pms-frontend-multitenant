// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Chip,
//   TablePagination,
//   TableSortLabel,
//   Tooltip,
//   Stack,
//   Button,
//   Menu,
//   MenuItem,
//   TextField,
//   InputLabel,
//   Select,
//   FormControl,
//   Drawer,
//   Divider,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
// import TeamMemberMultiSelectDropDown from "../../components/MultiSelectDropdown";
// import { accountsAPI, authAPI } from "../../services/api"; // Adjust path to your api.js file
// import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";
// import EmailIcon from "@mui/icons-material/Email";
// import SendIcon from "@mui/icons-material/Send";
// import WorkIcon from "@mui/icons-material/Work";
// import GroupIcon from "@mui/icons-material/Group";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import ArchiveIcon from "@mui/icons-material/Archive";
// import UnarchiveIcon from "@mui/icons-material/Unarchive";
// import EditIcon from "@mui/icons-material/Edit";
// import ClearIcon from "@mui/icons-material/Clear";
// import ManageTags from "../BulkActions/ManageTags";
// import ManageTeams from "../BulkActions/ManageTeams";
// import ManageContactSettings from "../BulkActions/ManageContactSettings";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";
// import JobDrawer from "../../pages/Workflow/JobDrawer";
// import SendOrganizer from "../BulkActions/SendOrganizer";
// import SendEmail from "../BulkActions/SendEmail";
// import { useAuth } from "../../context/AuthContext";

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) return -1;
//   if (b[orderBy] > a[orderBy]) return 1;
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// const AccountTable = () => {
//   const { user } = useAuth();
//   console.log("Current user in AccountTable:", user);
//   const queryClient = useQueryClient();
//   const manageTagsRef = useRef();
//   const manageTeamRef = useRef();
//   const sendOrganizerRef = useRef();
//   const sendEmailRef = useRef();
//   const manageSettingsRef = useRef();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [order, setOrder] = useState(null);
//   const [orderBy, setOrderBy] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("active");
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [selectedAccounts, setSelectedAccounts] = useState([]);
//   const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
//   const [filters, setFilters] = useState({
//     accountName: "",
//     type: "",
//     teamMember: [],
//     tags: [],
//     email: "",
//   });

//   const [showFilters, setShowFilters] = useState({
//     accountName: false,
//     type: false,
//     teamMember: false,
//     tags: false,
//     email: false,
//   });
//   const [bulkDrawer, setBulkDrawer] = useState({
//     open: false,
//     type: null, // "tags" | "team" | "email" | etc.
//   });
//   const [jobDrawerOpen, setJobDrawerOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [accountsToDelete, setAccountsToDelete] = useState([]);
//   const [confirmText, setConfirmText] = useState("");
//   const [permissions, setPermissions] = useState({});
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       try {
//         if (user?.role === "team_member") {
//           const res = await authAPI.getSingleUser(user.id);

//           const userData = res.data;

//           // ✅ SET PERMISSIONS HERE
//           setPermissions(userData.user.permissions);
//           console.log("Fetched user permissions:", userData.user.permissions);
//         } else {
//           // If not a team member, assume full permissions (or handle as needed)
//           setPermissions({
//             manageAccounts: true,
//             manageTags: true,
//             manageOrganizers: true,
//             managePipelines: true,
//             assignTeamMates: true,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching user permissions:", error);
//       }
//     };

//     fetchUserPermissions();
//   }, [user]);
//   const handleBulkDrawerClose = () => {
//     setBulkDrawer({ open: false, type: null });
//     setSelectedAccounts([]); // ✅ clear selection
//   };
//   const [anchorEl, setAnchorEl] = useState(null);
//   // const { data, isLoading } = useQuery({
//   //   queryKey: ["accounts", filterStatus],
//   //   queryFn: async () => {
//   //     const isActive = filterStatus === "active";
//   //     const res = await accountsAPI.getAccountsList(isActive);
//   //     return res.data.accountlist || [];
//   //   },
//   // });
//   const { data, isLoading } = useQuery({
//   queryKey: ["accounts", filterStatus, user?.role],
//   queryFn: async () => {
//     const isActive = filterStatus === "active";

//     let res;

//     if (user?.role === "team_member") {
//       // ✅ call team member API
//       res = await accountsAPI.getAccountsByTeamMember(
      
//         isActive
//       );
//     } else {
//       // ✅ call normal API
//       res = await accountsAPI.getAccountsList(isActive);
//     }
// console.log("accounts list",res)
//     return res.data.accountlist || [];
//   },
//   enabled: !!user, // ensures user is loaded
// });
//   const accountList = data || [];
//   const uniqueTags = [
//     ...new Map(
//       accountList
//         .flatMap((a) => a.tags || [])
//         .map((tag) => [
//           tag._id,
//           {
//             value: tag._id,
//             label: tag.tagName,
//             colour: tag.tagColour,
//           },
//         ]),
//     ).values(),
//   ];
//   const loading = isLoading;
//   const handleDrawerClose = () => {
//     setOpenDrawer(false);
//   };

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   // Filter accounts based on active/archived status and other filters

//   const filteredList = accountList.filter((account) => {
//     if (account.active !== (filterStatus === "active")) return false;

//     if (
//       filters.accountName &&
//       !account.accountName
//         ?.toLowerCase()
//         .includes(filters.accountName.toLowerCase())
//     )
//       return false;

//     if (filters.type && account.clientType !== filters.type) return false;

//     if (
//       filters.email &&
//       !account.contacts?.some((c) =>
//         c.contact?.email?.toLowerCase().includes(filters.email.toLowerCase()),
//       )
//     )
//       return false;

//     if (
//       filters.tags.length > 0 &&
//       !account.tags?.some((t) =>
//         filters.tags.some((sel) => sel.value === t._id),
//       )
//     )
//       return false;

//     if (
//       filters.teamMember.length > 0 &&
//       !account.teamMember?.some((tm) =>
//         filters.teamMember.some((sel) => sel.value === tm._id),
//       )
//     )
//       return false;

//     return true;
//   });
//   const sortedList =
//     orderBy && order
//       ? filteredList.slice().sort(getComparator(order, orderBy))
//       : filteredList;

//   const paginatedList = sortedList.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   const renderLimitedChips = (items, getLabel, getColor) => {
//     if (!items || items.length === 0) return "—";

//     const first = items[0];
//     const remaining = items.slice(1);

//     return (
//       <Stack direction="row" spacing={1} flexWrap="wrap">
//         {/* First chip */}
//         <Tooltip title={getLabel(first)} placement="top">
//           <Chip
//             label={getLabel(first)}
//             size="small"
//             sx={getColor ? getColor(first) : {}}
//           />
//         </Tooltip>

//         {/* Remaining chips */}
//         {remaining.length > 0 && (
//           <Tooltip
//             placement="top"
//             title={
//               <Stack direction="row" spacing={1} flexWrap="wrap" maxWidth={250}>
//                 {remaining.map((item) => (
//                   <Chip
//                     key={item._id}
//                     label={getLabel(item)}
//                     size="small"
//                     sx={getColor ? getColor(item) : {}}
//                   />
//                 ))}
//               </Stack>
//             }
//           >
//             <Chip
//               label={`+${remaining.length} more`}
//               size="small"
//               variant="outlined"
//             />
//           </Tooltip>
//         )}
//       </Stack>
//     );
//   };
//   const handleFilterButtonClick = (e) => {
//     setAnchorEl(e.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const toggleFilter = (name) => {
//     setShowFilters((prev) => ({
//       ...prev,
//       [name]: !prev[name],
//     }));
//   };

//   const clearFilter = (name) => {
//     setFilters((prev) => ({
//       ...prev,
//       [name]: name === "teamMember" || name === "tags" ? [] : "",
//     }));

//     setShowFilters((prev) => ({
//       ...prev,
//       [name]: false,
//     }));
//   };

//   const handleFilterChange = (e) => {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value,
//     });
//     setPage(0);
//   };
//   const updateAccountCookies = (updatedSelected) => {
//     if (updatedSelected.length > 0) {
//       Cookies.set("selectedAccounts", JSON.stringify(updatedSelected), {
//         path: "/",
//       });

//       const latestId = updatedSelected[updatedSelected.length - 1];
//       const latestAccount = accountList.find((acc) => acc._id === latestId);

//       if (latestAccount) {
//         Cookies.set("accountId", latestAccount._id, { path: "/" });
//         Cookies.set("accountName", latestAccount.accountName, {
//           path: "/",
//         });
//       }
//     } else {
//       Cookies.remove("selectedAccounts", { path: "/" });
//       Cookies.remove("accountId", { path: "/" });
//       Cookies.remove("accountName", { path: "/" });
//     }
//   };
//   const renderBulkContent = () => {
//     switch (bulkDrawer.type) {
//       case "tags":
//         return (
//           <ManageTags
//             ref={manageTagsRef}
//             selectedAccounts={selectedAccounts}
//             onClose={handleBulkDrawerClose}
//             // onClose={() => setBulkDrawer({ open: false, type: null })}
//             fetchData={() => queryClient.invalidateQueries(["accounts"])}
//           />
//         );
//       case "organizer":
//         return (
//           <SendOrganizer
//             ref={sendOrganizerRef}
//             selectedAccounts={selectedAccounts}
//             onClose={handleBulkDrawerClose}
//             fetchData={() => queryClient.invalidateQueries(["accounts"])}
//           />
//         );
//       case "team":
//         return (
//           <ManageTeams
//             ref={manageTeamRef}
//             selectedAccounts={selectedAccounts}
//             onClose={handleBulkDrawerClose}
//             fetchData={() => queryClient.invalidateQueries(["accounts"])}
//           />
//         );

//       case "email":
//         return (
//           <SendEmail
//             ref={sendEmailRef}
//             selectedAccounts={selectedAccounts}
//             onClose={handleBulkDrawerClose}
//             fetchData={() => queryClient.invalidateQueries(["accounts"])}
//           />
//         );
//       case "settings":
//         return (
//           <ManageContactSettings
//             ref={manageSettingsRef}
//             selectedAccounts={selectedAccounts}
//             accountList={accountList}
//             onClose={handleBulkDrawerClose}
//             fetchData={() => queryClient.invalidateQueries(["accounts"])}
//           />
//         );
//       default:
//         return <Typography>Select an action</Typography>;
//     }
//   };
//   const handleArchiveAccount = async () => {
//     try {
//       await accountsAPI.updateAccountActiveStatus({
//         ids: selectedAccounts,
//         active: false,
//       });

//       toast.success("Account Archived successfully");

//       setSelectedAccounts([]);
//       // fetchAccountsList();
//       handleClose();
//       // ✅ React Query refetch
//       queryClient.invalidateQueries(["accounts"]);
//     } catch (error) {
//       console.error("Failed to archive account", error);
//       toast.error("Failed to archive account");
//     }
//   };

//   const handleActivateAccount = async () => {
//     try {
//       await accountsAPI.updateAccountActiveStatus({
//         ids: selectedAccounts,
//         active: true,
//       });

//       toast.success("Account Activated successfully");

//       setSelectedAccounts([]);
//       // fetchAccountsList();
//       handleClose();
//       // ✅ React Query refetch
//       queryClient.invalidateQueries(["accounts"]);
//     } catch (error) {
//       console.error("Failed to activate account", error);
//       toast.error("Failed to activate account");
//     }
//   };
//   const handleDeleteClick = () => {
//     const accountsToDeleteNames = selectedAccounts.map((id) => {
//       const account = accountList.find((acc) => acc._id === id);
//       return account ? account.accountName : id;
//     });

//     setAccountsToDelete(accountsToDeleteNames);
//     setIsDeleteDialogOpen(true);
//     handleClose();
//   };

//   const handleCloseDeleteDialog = () => {
//     setIsDeleteDialogOpen(false);
//     setAccountsToDelete([]);
//   };

//   const handleConfirmDelete = async () => {
//     if (confirmText === "DELETE") {
//       await handleDeleteAccount();
//       setConfirmText("");
//       handleCloseDeleteDialog();
//     }
//   };
//   const handleDeleteAccount = async () => {
//     try {
//       await accountsAPI.deleteMultipleAccounts({
//         accountIds: selectedAccounts,
//       });

//       console.log("Accounts deleted:", selectedAccounts);

//       setSelectedAccounts([]);
//       queryClient.invalidateQueries(["accounts"]); // ✅ updated
//       handleClose();
//       setIsDeleteDialogOpen(false);

//       toast.success("Account(s) deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete account", error);
//       toast.error("Failed to delete account(s)");
//     }
//   };
//   return (
//     <Box sx={{ p: 2 }}>
//       {/* Simple Active/Archived toggle */}
//       <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
//         <Box>
//           <Stack direction="row" spacing={2}>
//             <Typography
//               variant="button"
//               onClick={() => setFilterStatus("active")}
//               sx={{
//                 cursor: "pointer",
//                 fontWeight: filterStatus === "active" ? "bold" : "normal",
//                 color:
//                   filterStatus === "active" ? "primary.main" : "text.secondary",
//                 borderBottom: filterStatus === "active" ? "2px solid" : "none",
//                 borderColor: "primary.main",
//               }}
//             >
//               Active
//             </Typography>
//             <Typography
//               variant="button"
//               onClick={() => setFilterStatus("archived")}
//               sx={{
//                 cursor: "pointer",
//                 fontWeight: filterStatus === "archived" ? "bold" : "normal",
//                 color:
//                   filterStatus === "archived"
//                     ? "primary.main"
//                     : "text.secondary",
//                 borderBottom:
//                   filterStatus === "archived" ? "2px solid" : "none",
//                 borderColor: "primary.main",
//               }}
//             >
//               Archived
//             </Typography>
//           </Stack>
//         </Box>
//         <Box>
//           {" "}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setOpenDrawer(true)}
//           >
//             Add Account
//           </Button>
//         </Box>
//       </Box>

//       {loading ? (
//         <Typography sx={{ textAlign: "center", p: 3 }}>
//           Loading accounts...
//         </Typography>
//       ) : (
//         <Box>
//           <Box display="flex" alignItems="center" mb={2}>
//             <Button
//               variant="outlined"
//               sx={{ ml: 2 }}
//               onClick={handleFilterButtonClick}
//             >
//               Filters
//             </Button>
//             <Button
//               variant="outlined"
//               sx={{ ml: 2 }}
//               onClick={() => {
//                 if (selectedAccounts.length === filteredList.length) {
//                   setSelectedAccounts([]);
//                 } else {
//                   setSelectedAccounts(filteredList.map((a) => a._id));
//                 }
//               }}
//             >
//               {selectedAccounts.length === filteredList.length
//                 ? "Unselect All"
//                 : "Select All"}
//             </Button>
//           </Box>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//           >
//             {["accountName", "email", "type", "teamMember", "tags"].map(
//               (key) => (
//                 <MenuItem
//                   key={key}
//                   onClick={() => {
//                     toggleFilter(key);
//                     handleClose();
//                   }}
//                 >
//                   {key}
//                 </MenuItem>
//               ),
//             )}
//           </Menu>

//           <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
//             {showFilters.accountName && (
//               <Box display="flex">
//                 <TextField
//                   name="accountName"
//                   value={filters.accountName}
//                   onChange={handleFilterChange}
//                   size="small"
//                   placeholder="Account Name"
//                 />
//                 <DeleteIcon onClick={() => clearFilter("accountName")} />
//               </Box>
//             )}

//             {showFilters.email && (
//               <Box display="flex">
//                 <TextField
//                   name="email"
//                   value={filters.email}
//                   onChange={handleFilterChange}
//                   size="small"
//                   placeholder="Email"
//                 />
//                 <DeleteIcon onClick={() => clearFilter("email")} />
//               </Box>
//             )}
//             {showFilters.type && (
//               <Box display="flex" alignItems="center">
//                 <FormControl size="small" sx={{ width: 180, mr: 1 }}>
//                   <InputLabel>Type</InputLabel>
//                   <Select
//                     name="type"
//                     value={filters.type}
//                     onChange={handleFilterChange}
//                     label="Type"
//                   >
//                     <MenuItem value="">All</MenuItem>
//                     <MenuItem value="Individual">Individual</MenuItem>
//                     <MenuItem value="Company">Company</MenuItem>
//                     <MenuItem value="Other">Other</MenuItem>
//                   </Select>
//                 </FormControl>

//                 <DeleteIcon
//                   onClick={() => clearFilter("type")}
//                   sx={{ cursor: "pointer", color: "red" }}
//                 />
//               </Box>
//             )}
//             {showFilters.tags && (
//               <Box display="flex" alignItems="center">
//                 <Box sx={{ width: 250, mr: 1 }}>
//                   <TagsMultiSelectDropDown
//                     value={filters.tags}
//                     onChange={(newValue) => {
//                       setFilters((prev) => ({
//                         ...prev,
//                         tags: newValue,
//                       }));
//                       setPage(0);
//                     }}
//                     options={uniqueTags}
//                     placeholder="Select Tags"
//                   />
//                 </Box>

//                 <DeleteIcon
//                   onClick={() => clearFilter("tags")}
//                   sx={{ cursor: "pointer", color: "red" }}
//                 />
//               </Box>
//             )}
//             {showFilters.teamMember && (
//               <Box display="flex" alignItems="center">
//                 <Box sx={{ width: 250, mr: 1 }}>
//                   <TeamMemberMultiSelectDropDown
//                     value={filters.teamMember}
//                     onChange={(newValue) => {
//                       setFilters((prev) => ({
//                         ...prev,
//                         teamMember: newValue,
//                       }));
//                       setPage(0);
//                     }}
//                   />
//                 </Box>

//                 <DeleteIcon
//                   onClick={() => clearFilter("teamMember")}
//                   sx={{ cursor: "pointer", color: "red" }}
//                 />
//               </Box>
//             )}
//           </Stack>
//           {selectedAccounts.length > 0 && (
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 1.5,
//                 mb: 2,
//                 borderRadius: 2,
//                 border: "1px solid #e0e0e0",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 backgroundColor: "#f9fbff",
//               }}
//             >
//               {/* LEFT SIDE */}
//               <Typography sx={{ fontWeight: 500 }}>
//                 {selectedAccounts.length} selected
//               </Typography>

//               {/* RIGHT ACTIONS */}
//               <Stack direction="row" spacing={1}>
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<EmailIcon />}
//                   onClick={() => setBulkDrawer({ open: true, type: "email" })}
//                 >
//                   Send Email
//                 </Button>

//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<SendIcon />}
//                   onClick={() =>
//                     setBulkDrawer({ open: true, type: "organizer" })
//                   }
//                   disabled={!permissions?.manageOrganizers}
//                 >
//                   Send Organizer
//                 </Button>

//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<WorkIcon />}
//                   // onClick={setJobDrawerOpen}
//                   onClick={() => setJobDrawerOpen(true)}
//                   disabled={!permissions?.managePipelines}
//                   // onClick={() => setBulkDrawer({ open: true, type: "job" })}
//                 >
//                   Add Job
//                 </Button>

//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<GroupIcon />}
//                   disabled={!permissions?.assignTeamMates}
//                   onClick={() => setBulkDrawer({ open: true, type: "team" })}
//                 >
//                   Manage Team
//                 </Button>

//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<LocalOfferIcon />}
//                   disabled={!permissions?.manageTags}
//                   onClick={() => setBulkDrawer({ open: true, type: "tags" })}
//                 >
//                   Manage Tags
//                 </Button>

//                 {/* MORE ACTIONS */}
//                 <Button
//                   size="small"
//                   variant="contained"
//                   startIcon={<MoreVertIcon />}
//                   onClick={(e) => setBulkAnchorEl(e.currentTarget)}
//                 >
//                   More Actions
//                 </Button>

//                 {/* MENU */}
//                 <Menu
//                   anchorEl={bulkAnchorEl}
//                   open={Boolean(bulkAnchorEl)}
//                   onClose={() => setBulkAnchorEl(null)}
//                 >
//                   {/* Active / Archive toggle */}
//                   <MenuItem
//                     onClick={() => {
//                       if (filterStatus === "active") {
//                         handleArchiveAccount();
//                       } else {
//                         handleActivateAccount();
//                       }

//                       setBulkAnchorEl(null);
//                     }}
//                     disabled={!permissions?.manageAccounts}
//                   >
//                     {filterStatus === "active" ? (
//                       <>
//                         <ArchiveIcon sx={{ mr: 1 }} /> Archive Account
//                       </>
//                     ) : (
//                       <>
//                         <UnarchiveIcon sx={{ mr: 1 }} /> Activate Account
//                       </>
//                     )}
//                   </MenuItem>

//                   {/* Delete only for archived */}
//                   {filterStatus === "archived" && (
//                     <MenuItem
//                       onClick={handleDeleteClick}
//                       disabled={
//                         selectedAccounts.length === 0 ||
//                         !permissions?.manageAccounts
//                       }
//                       sx={{ color: "error.main" }}
//                     >
//                       <DeleteIcon sx={{ mr: 1 }} /> Delete Account
//                     </MenuItem>
//                   )}

//                   <MenuItem
//                     onClick={() => {
//                       console.log(
//                         "Edit Login/Notify/Email Sync",
//                         selectedAccounts,
//                       );
//                       setBulkAnchorEl(null);
//                       setBulkDrawer({ open: true, type: "settings" });
//                     }}
//                   >
//                     <EditIcon sx={{ mr: 1 }} /> Edit Login, Notify and Email
//                     Sync
//                   </MenuItem>
//                 </Menu>

//                 {/* CLEAR SELECTION */}
//                 <Button
//                   size="small"
//                   color="error"
//                   // onClick={() => setSelectedAccounts([])}
//                   onClick={() => {
//                     setSelectedAccounts([]);
//                     updateAccountCookies([]); // ✅ remove cookies
//                   }}
//                   startIcon={<ClearIcon />}
//                 >
//                   Clear
//                 </Button>
//               </Stack>
//             </Paper>
//           )}
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell padding="checkbox">
//                     <input
//                       type="checkbox"
//                       checked={
//                         paginatedList.length > 0 &&
//                         paginatedList.every((a) =>
//                           selectedAccounts.includes(a._id),
//                         )
//                       }
//                       onChange={() => {
//                         const pageIds = paginatedList.map((a) => a._id);

//                         const allSelected = pageIds.every((id) =>
//                           selectedAccounts.includes(id),
//                         );

//                         let updated;

//                         if (allSelected) {
//                           updated = selectedAccounts.filter(
//                             (id) => !pageIds.includes(id),
//                           );
//                         } else {
//                           updated = [
//                             ...new Set([...selectedAccounts, ...pageIds]),
//                           ];
//                         }

//                         setSelectedAccounts(updated);
//                         updateAccountCookies(updated); // ✅ instant cookie update
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell>Account Code</TableCell>
//                   <TableCell
//                     sortDirection={orderBy === "accountName" ? order : false}
//                     width={"500px"}
//                   >
//                     <TableSortLabel
//                       active={orderBy === "accountName"}
//                       direction={orderBy === "accountName" ? order : "asc"}
//                       onClick={() => handleRequestSort("accountName")}
//                     >
//                       Account Name
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell
//                     sortDirection={orderBy === "clientType" ? order : false}
//                   >
//                     <TableSortLabel
//                       active={orderBy === "clientType"}
//                       direction={orderBy === "clientType" ? order : "asc"}
//                       onClick={() => handleRequestSort("clientType")}
//                     >
//                       Client Type
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell
//                     sortDirection={orderBy === "companyName" ? order : false}
//                   >
//                     <TableSortLabel
//                       active={orderBy === "companyName"}
//                       direction={orderBy === "companyName" ? order : "asc"}
//                       onClick={() => handleRequestSort("companyName")}
//                     >
//                       Company Name
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell>Tags</TableCell>
//                   <TableCell>Team Members</TableCell>
//                   <TableCell>Contact Emails</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {paginatedList.length > 0 ? (
//                   paginatedList.map((account) => (
//                     <TableRow key={account._id}>
//                       <TableCell padding="checkbox">
//                         <input
//                           type="checkbox"
//                           checked={selectedAccounts.includes(account._id)}
//                           onChange={() => {
//                             let updated;

//                             if (selectedAccounts.includes(account._id)) {
//                               updated = selectedAccounts.filter(
//                                 (id) => id !== account._id,
//                               );
//                             } else {
//                               updated = [...selectedAccounts, account._id];
//                             }

//                             setSelectedAccounts(updated);
//                             updateAccountCookies(updated); // ✅ instant cookie update
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={account.importId || "—"}
//                           size="small"
//                           color="success"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Link
//                           to={`/clients/accounts/accountsdash/overview/${account._id}`}
//                           style={{
//                             textDecoration: "none",
//                             color: "#3f51b5",
//                             cursor: "pointer",
//                           }}
//                         >
//                           {account.accountName}
//                         </Link>
//                       </TableCell>
//                       <TableCell>{account.clientType || "—"}</TableCell>
//                       <TableCell>{account.companyName || "—"}</TableCell>

//                       <TableCell>
//                         {renderLimitedChips(
//                           account.tags,
//                           (t) => t.tagName,
//                           (t) => ({
//                             backgroundColor: t.tagColour,
//                             color: "#fff",
//                             fontWeight: 600,
//                           }),
//                         )}
//                       </TableCell>

//                       <TableCell>
//                         {renderLimitedChips(
//                           account.teamMember,
//                           (tm) => tm.username,
//                           () => ({
//                             border: "1px solid",
//                             borderColor: "primary.main",
//                             color: "primary.main",
//                           }),
//                         )}
//                       </TableCell>

//                       <TableCell>
//                         {renderLimitedChips(
//                           account.contacts
//                             ?.map((c) => c.contact)
//                             ?.filter((c) => c?.email?.trim()),
//                           (c) => c.email,
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} align="center">
//                       No accounts found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//             <TablePagination
//               component="div"
//               count={sortedList.length}
//               page={page}
//               onPageChange={(e, newPage) => setPage(newPage)}
//               rowsPerPage={rowsPerPage}
//               rowsPerPageOptions={[5, 10, 25, 30, 50, 100, 500]}
//               onRowsPerPageChange={(e) => {
//                 setRowsPerPage(parseInt(e.target.value));
//                 setPage(0);
//               }}
//             />
//           </TableContainer>
//         </Box>
//       )}

//       <AccountContactDrawer open={openDrawer} onClose={handleDrawerClose} />
//       <Drawer
//         anchor="right"
//         open={bulkDrawer.open}
//         onClose={() => setBulkDrawer({ open: false, type: null })}
//         PaperProps={{
//           sx: {
//             width: 500,
//             display: "flex",
//             flexDirection: "column",
//             height: "100%",
//           },
//         }}
//       >
//         {/* ===== HEADER (FIXED) ===== */}
//         <Box
//           sx={{
//             p: 2,
//             borderBottom: "1px solid #e0e0e0",
//             position: "sticky",
//             top: 0,
//             backgroundColor: "#fff",
//             zIndex: 10,
//           }}
//         >
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h6" sx={{ fontWeight: 600 }}>
//               {bulkDrawer.type === "tags" && "Manage Tags"}
//               {bulkDrawer.type === "team" && "Manage Team"}
//               {bulkDrawer.type === "email" && "Send Email"}
//               {bulkDrawer.type === "organizer" && "Send Organizer"}
//               {bulkDrawer.type === "settings" &&
//                 "Edit Login, Notify and Email Sync"}
//             </Typography>

//             <IconButton
//               onClick={() => setBulkDrawer({ open: false, type: null })}
//             >
//               ✕
//             </IconButton>
//           </Box>

//           <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
//             {selectedAccounts.length} selected
//           </Typography>
//         </Box>

//         {/* ===== SCROLLABLE CONTENT ===== */}
//         <Box
//           sx={{
//             flex: 1,
//             overflowY: "auto",
//             p: 2,
//           }}
//         >
//           {renderBulkContent()}
//         </Box>

//         {/* ===== FOOTER (FIXED) ===== */}
//         <Box
//           sx={{
//             p: 2,
//             borderTop: "1px solid #e0e0e0",
//             position: "sticky",
//             bottom: 0,
//             backgroundColor: "#fff",
//             zIndex: 10,
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <Button
//             variant="outlined"
//             onClick={() => setBulkDrawer({ open: false, type: null })}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={() => {
//               if (bulkDrawer.type === "team") {
//                 manageTeamRef.current?.submit();
//               }
//               if (bulkDrawer.type === "tags") {
//                 manageTagsRef.current?.submit();
//               }
//               if (bulkDrawer.type === "settings") {
//                 manageSettingsRef.current?.submit();
//               }
//               if (bulkDrawer.type === "organizer") {
//                 sendOrganizerRef.current?.submit(); // ✅ ADD THIS
//               }
//               if (bulkDrawer.type === "email") {
//                 sendEmailRef.current?.submit(); // ✅ ADD THIS
//               }
//             }}
//           >
//             Save
//           </Button>
//         </Box>
//       </Drawer>

//       <Dialog
//         open={isDeleteDialogOpen}
//         onClose={handleCloseDeleteDialog}
//         aria-labelledby="delete-dialog-title"
//         aria-describedby="delete-dialog-description"
//       >
//         <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>

//         <DialogContent>
//           <DialogContentText id="delete-dialog-description">
//             Are you sure you want to delete{" "}
//             <strong>{accountsToDelete.length}</strong>{" "}
//             {accountsToDelete.length === 1 ? "account" : "accounts"}? This
//             action cannot be undone.
//           </DialogContentText>

//           <Box sx={{ mt: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Accounts to be deleted:
//             </Typography>
//             <List dense>
//               {accountsToDelete.map((accountName, index) => (
//                 <ListItem key={index}>
//                   <ListItemText primary={accountName} />
//                 </ListItem>
//               ))}
//             </List>
//           </Box>

//           <DialogContentText sx={{ mt: 2 }}>
//             If you want to proceed, please type <strong>DELETE</strong> below.
//           </DialogContentText>

//           <TextField
//             fullWidth
//             margin="normal"
//             size="small"
//             variant="outlined"
//             value={confirmText}
//             onChange={(e) => setConfirmText(e.target.value)}
//             placeholder="Please enter the word DELETE"
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button
//             onClick={handleConfirmDelete}
//             color="error"
//             variant="contained"
//             disabled={confirmText !== "DELETE"}
//           >
//             Delete
//           </Button>
//           <Button onClick={handleCloseDeleteDialog} variant="outlined">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <JobDrawer open={jobDrawerOpen} onClose={() => setJobDrawerOpen(false)} />
//     </Box>
//   );
// };

// export default AccountTable;


/* ─── AccountTable — @tanstack/react-table + shadcn DataTable ─── */
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Mail, Briefcase, Users, Tag, Archive,
  RotateCcw, Trash2, X,
  UserSearch, AtSign, Building2, UserCog, TagsIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { accountsAPI, authAPI } from "../../services/api";

// Components
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import TeamMemberMultiSelectDropDown from "../../components/MultiSelectDropdown";
import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";
import ManageTags from "../BulkActions/ManageTags";
import ManageTeams from "../BulkActions/ManageTeams";
import ManageContactSettings from "../BulkActions/ManageContactSettings";
import SendOrganizer from "../BulkActions/SendOrganizer";
import SendEmail from "../BulkActions/SendEmail";
import JobDrawer from "../../pages/Workflow/JobDrawer";

import { cn } from "../../lib/utils";

// ========== Helper Components ==========
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

function MemberPills({ members }) {
  if (!members?.length) return <span className="text-muted-foreground text-xs">—</span>;
  const first = members[0];
  return (
    <div className="flex items-center gap-1">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 truncate max-w-[110px]">
        {first.username}
      </span>
      {members.length > 1 && (
        <span
          title={members.slice(1).map((m) => m.username).join(", ")}
          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border"
        >
          +{members.length - 1}
        </span>
      )}
    </div>
  );
}

function BulkActionBtn({ label, icon: Icon, onClick, disabled, variant = "default" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "destructive"
          ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ========== Main Component ==========
const AccountTable = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Refs for bulk actions
  const manageTagsRef = useRef();
  const manageTeamRef = useRef();
  const sendOrganizerRef = useRef();
  const sendEmailRef = useRef();
  const manageSettingsRef = useRef();

  // State
  const [filterStatus, setFilterStatus] = useState("active");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [permissions, setPermissions] = useState({});
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bulkDrawerType, setBulkDrawerType] = useState(null);
  const [jobDrawerOpen, setJobDrawerOpen] = useState(false);
  
  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  
  // Filters
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    accountName: "",
    type: "",
    teamMember: [],
    tags: [],
    email: "",
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        if (user?.role === "team_member") {
          const res = await authAPI.getSingleUser(user.id);
          setPermissions(res.data.user.permissions);
        } else {
          setPermissions({
            manageAccounts: true,
            manageTags: true,
            manageOrganizers: true,
            managePipelines: true,
            assignTeamMates: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };
    fetchUserPermissions();
  }, [user]);

  // Fetch accounts using React Query
  const { data: accountList = [], isLoading: loading } = useQuery({
    queryKey: ["accounts", filterStatus, user?.role],
    queryFn: async () => {
      const isActive = filterStatus === "active";
      let res;
      if (user?.role === "team_member") {
        res = await accountsAPI.getAccountsByTeamMember(isActive);
      } else {
        res = await accountsAPI.getAccountsList(isActive);
      }
      return res.data.accountlist || [];
    },
    enabled: !!user,
  });

  // Extract unique tags from accounts
  useEffect(() => {
    const tags = [
      ...new Map(
        accountList
          .flatMap((a) => a.tags || [])
          .map((tag) => [
            tag._id,
            {
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            },
          ]),
      ).values(),
    ];
    setUniqueTags(tags);
  }, [accountList]);

  // Filter accounts based on filters and global search
  const filteredData = useMemo(() => {
    let data = [...accountList];

    // Global filter search
    if (globalFilter) {
      const searchLower = globalFilter.toLowerCase();
      data = data.filter((account) =>
        account.accountName?.toLowerCase().includes(searchLower) ||
        account.clientType?.toLowerCase().includes(searchLower) ||
        account.companyName?.toLowerCase().includes(searchLower) ||
        account.tags?.some(t => t.tagName?.toLowerCase().includes(searchLower)) ||
        account.teamMember?.some(tm => tm.username?.toLowerCase().includes(searchLower)) ||
        account.contacts?.some(c => c.contact?.email?.toLowerCase().includes(searchLower))
      );
    }

    // Column filters
    if (filters.accountName) {
      data = data.filter((a) =>
        a.accountName?.toLowerCase().includes(filters.accountName.toLowerCase())
      );
    }
    if (filters.email) {
      data = data.filter((a) =>
        a.contacts?.some((c) =>
          c.contact?.email?.toLowerCase().includes(filters.email.toLowerCase())
        )
      );
    }
    if (filters.type) {
      data = data.filter((a) => a.clientType === filters.type);
    }
    if (filters.teamMember.length) {
      const ids = filters.teamMember.map((t) => t.value);
      data = data.filter((a) =>
        a.teamMember?.some((tm) => ids.includes(tm._id))
      );
    }
    if (filters.tags.length) {
      const ids = filters.tags.map((t) => t.value);
      data = data.filter((a) =>
        a.tags?.some((t) => ids.includes(t._id))
      );
    }

    return data;
  }, [accountList, filters, globalFilter]);

  // Cookie sync
  const syncCookies = (ids) => {
    if (ids.length > 0) {
      const accs = ids.map((id) => {
        const a = accountList.find((x) => x._id === id);
        return a ? { id: a._id, name: a.accountName } : null;
      }).filter(Boolean);
      
      Cookies.set("selectedAccounts", JSON.stringify(accs), { path: "/" });
      Cookies.set("accountId", accs[accs.length - 1].id, { path: "/" });
      Cookies.set("accountName", accs[accs.length - 1].name, { path: "/" });
    } else {
      Cookies.remove("selectedAccounts", { path: "/" });
      Cookies.remove("accountId", { path: "/" });
      Cookies.remove("accountName", { path: "/" });
    }
  };

  const handleRowSelectionChange = (rowSel) => {
    const ids = Object.keys(rowSel).filter((k) => rowSel[k]);
    setSelectedIds(ids);
    syncCookies(ids);
  };

  // Bulk actions
  const handleArchive = async () => {
    try {
      await accountsAPI.updateAccountActiveStatus({ ids: selectedIds, active: false });
      toast.success("Accounts archived successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries(["accounts"]);
      syncCookies([]);
    } catch {
      toast.error("Failed to archive accounts");
    }
  };

  const handleActivate = async () => {
    try {
      await accountsAPI.updateAccountActiveStatus({ ids: selectedIds, active: true });
      toast.success("Accounts activated successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries(["accounts"]);
      syncCookies([]);
    } catch {
      toast.error("Failed to activate accounts");
    }
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;
    try {
      await accountsAPI.deleteMultipleAccounts({ accountIds: selectedIds });
      toast.success("Accounts deleted successfully");
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
      setConfirmText("");
      queryClient.invalidateQueries(["accounts"]);
      syncCookies([]);
    } catch {
      toast.error("Failed to delete accounts");
    }
  };

  const openBulkDrawer = (type) => {
    setBulkDrawerType(type);
    setIsDrawerOpen(true);
  };

  const handleBulkDrawerClose = () => {
    setIsDrawerOpen(false);
    setBulkDrawerType(null);
    queryClient.invalidateQueries(["accounts"]);
  };

  const renderBulkContent = () => {
    switch (bulkDrawerType) {
      case "tags":
        return <ManageTags ref={manageTagsRef} selectedAccounts={selectedIds} onClose={handleBulkDrawerClose} fetchData={() => queryClient.invalidateQueries(["accounts"])} />;
      case "organizer":
        return <SendOrganizer ref={sendOrganizerRef} selectedAccounts={selectedIds} onClose={handleBulkDrawerClose} fetchData={() => queryClient.invalidateQueries(["accounts"])} />;
      case "team":
        return <ManageTeams ref={manageTeamRef} selectedAccounts={selectedIds} onClose={handleBulkDrawerClose} fetchData={() => queryClient.invalidateQueries(["accounts"])} />;
      case "email":
        return <SendEmail ref={sendEmailRef} selectedAccounts={selectedIds} onClose={handleBulkDrawerClose} fetchData={() => queryClient.invalidateQueries(["accounts"])} />;
      case "settings":
        return <ManageContactSettings ref={manageSettingsRef} selectedAccounts={selectedIds} accountList={accountList} onClose={handleBulkDrawerClose} fetchData={() => queryClient.invalidateQueries(["accounts"])} />;
      default:
        return null;
    }
  };

  const handleBulkSave = () => {
    if (bulkDrawerType === "team") manageTeamRef.current?.submit();
    if (bulkDrawerType === "tags") manageTagsRef.current?.submit();
    if (bulkDrawerType === "settings") manageSettingsRef.current?.submit();
    if (bulkDrawerType === "organizer") sendOrganizerRef.current?.submit();
    if (bulkDrawerType === "email") sendEmailRef.current?.submit();
  };

  // Column definitions
  const columns = useMemo(() => [
    {
      accessorKey: "importId",
      header: "Code",
      size: 80,
      cell: ({ getValue }) => {
        const v = getValue();
        return v
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">{v}</span>
          : <span className="text-muted-foreground text-xs">—</span>;
      },
    },
    {
      accessorKey: "accountName",
      header: "Account Name",
      size: 220,
      cell: ({ row, getValue }) => (
        <Link
          to={`/clients/accounts/accountsdash/overview/${row.original._id}`}
          className="text-sm font-medium text-primary hover:text-primary/80 no-underline transition-colors truncate block max-w-[200px]"
        >
          {getValue() || "—"}
        </Link>
      ),
    },
    {
      accessorKey: "clientType",
      header: "Type",
      size: 110,
      cell: ({ getValue }) => {
        const v = getValue();
        if (!v) return <span className="text-muted-foreground text-xs">—</span>;
        const color = v === "Individual" 
          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
          : v === "Company" 
          ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300"
          : "bg-muted text-muted-foreground border-border";
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${color}`}>{v}</span>;
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      size: 160,
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground/80 truncate block max-w-[150px]">
          {getValue() || <span className="text-muted-foreground">—</span>}
        </span>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      size: 180,
      enableSorting: false,
      cell: ({ getValue }) => <TagPills tags={getValue()} />,
    },
    {
      accessorKey: "teamMember",
      header: "Team Members",
      size: 160,
      enableSorting: false,
      cell: ({ getValue }) => <MemberPills members={getValue()} />,
    },
    {
      id: "contactEmails",
      header: "Contact Emails",
      size: 200,
      enableSorting: false,
      cell: ({ row }) => {
        const emails = row.original.contacts
          ?.map((c) => c.contact?.email)
          .filter(Boolean) || [];
        if (!emails.length) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <div className="flex items-center gap-1">
            <span className="text-xs text-foreground/80 truncate max-w-[160px]">{emails[0]}</span>
            {emails.length > 1 && (
              <span className="text-[11px] text-muted-foreground" title={emails.slice(1).join(", ")}>
                +{emails.length - 1}
              </span>
            )}
          </div>
        );
      },
    },
  ], []);

  // Filter definitions
  const FILTER_DEFS = [
    { key: "accountName", label: "Name", Icon: UserSearch },
    { key: "email", label: "Email", Icon: AtSign },
    { key: "type", label: "Type", Icon: Building2 },
    { key: "teamMember", label: "Team Member", Icon: UserCog },
    { key: "tags", label: "Tags", Icon: TagsIcon },
  ];

  const toggleFilter = (key) => {
    if (activeFilters.includes(key)) {
      setActiveFilters((p) => p.filter((f) => f !== key));
      setFilters((p) => ({ ...p, [key]: key === "teamMember" || key === "tags" ? [] : "" }));
    } else {
      setActiveFilters((p) => [...p, key]);
    }
  };

  const removeFilter = (key) => {
    setActiveFilters((p) => p.filter((f) => f !== key));
    setFilters((p) => ({ ...p, [key]: key === "teamMember" || key === "tags" ? [] : "" }));
  };

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

  // Bulk actions buttons
  const bulkActions = (
    <>
      <BulkActionBtn label="Send Email" icon={Mail} onClick={() => openBulkDrawer("email")} />
      <BulkActionBtn 
        label="Add Job" 
        icon={Briefcase} 
        onClick={() => setJobDrawerOpen(true)} 
        disabled={!permissions?.managePipelines} 
      />
      <BulkActionBtn 
        label="Organizer" 
        icon={Briefcase} 
        onClick={() => openBulkDrawer("organizer")} 
        disabled={!permissions?.manageOrganizers} 
      />
      <BulkActionBtn 
        label="Team" 
        icon={Users} 
        onClick={() => openBulkDrawer("team")} 
        disabled={!permissions?.assignTeamMates} 
      />
      <BulkActionBtn 
        label="Tags" 
        icon={Tag} 
        onClick={() => openBulkDrawer("tags")} 
        disabled={!permissions?.manageTags} 
      />
      <div className="h-4 w-px bg-border/60 mx-1" />
      {filterStatus === "active" ? (
        <BulkActionBtn label="Archive" icon={Archive} onClick={handleArchive} disabled={!permissions?.manageAccounts} />
      ) : (
        <BulkActionBtn label="Activate" icon={RotateCcw} onClick={handleActivate} disabled={!permissions?.manageAccounts} />
      )}
      {filterStatus === "archived" && (
        <BulkActionBtn label="Delete" icon={Trash2} variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={!permissions?.manageAccounts} />
      )}
      <BulkActionBtn label="Settings" icon={UserCog} onClick={() => openBulkDrawer("settings")} />
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <p className="text-muted-foreground">Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Status toggle and Add button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 gap-0.5">
          {["active", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-3.5 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                filterStatus === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpenDrawer(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Add Account
        </button>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        filterButtons={filterButtons}
        selectedCount={selectedIds.length}
        bulkActions={bulkActions}
      >
        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {activeFilters.includes("accountName") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.accountName}
                  onChange={(e) => setFilters((p) => ({ ...p, accountName: e.target.value }))}
                  placeholder="Account name…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36"
                />
                <button onClick={() => removeFilter("accountName")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {activeFilters.includes("email") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.email}
                  onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36"
                />
                <button onClick={() => removeFilter("email")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {activeFilters.includes("type") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                  className="text-sm bg-transparent outline-none text-foreground"
                >
                  <option value="">All types</option>
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={() => removeFilter("type")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {activeFilters.includes("teamMember") && (
              <div className="flex items-center gap-1.5 min-h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TeamMemberMultiSelectDropDown
                  value={filters.teamMember}
                  onChange={(v) => setFilters((p) => ({ ...p, teamMember: v }))}
                />
                <button onClick={() => removeFilter("teamMember")} className="text-muted-foreground hover:text-foreground shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {activeFilters.includes("tags") && (
              <div className="flex items-center gap-1.5 min-h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TagsMultiSelectDropDown
                  value={filters.tags}
                  onChange={(v) => setFilters((p) => ({ ...p, tags: v }))}
                  options={uniqueTags}
                  placeholder="Tags…"
                />
                <button onClick={() => removeFilter("tags")} className="text-muted-foreground hover:text-foreground shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </DataTableToolbar>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowSelectionChange={handleRowSelectionChange}
        getRowId={(row) => row._id}
        emptyMessage="No accounts found"
        emptyDescription={filterStatus === "archived" ? "No archived accounts" : "Create your first account to get started"}
        pageSize={25}
      />

      {/* Create/Edit Account Drawer */}
      <AccountContactDrawer 
        open={openDrawer} 
        onClose={() => {
          setOpenDrawer(false);
          queryClient.invalidateQueries(["accounts"]);
        }} 
      />

      {/* Bulk action drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleBulkDrawerClose} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                {bulkDrawerType === "tags" && "Manage Tags"}
                {bulkDrawerType === "team" && "Manage Team"}
                {bulkDrawerType === "email" && "Send Email"}
                {bulkDrawerType === "organizer" && "Send Organizer"}
                {bulkDrawerType === "settings" && "Edit Login, Notify and Email Sync"}
              </h2>
              <button onClick={handleBulkDrawerClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {renderBulkContent()}
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={handleBulkDrawerClose}
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSave}
                className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Drawer */}
      <JobDrawer open={jobDrawerOpen} onClose={() => setJobDrawerOpen(false)} />

      {/* Delete confirmation dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="relative bg-background rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">Delete Accounts?</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete <strong>{selectedIds.length}</strong> account{selectedIds.length > 1 ? "s" : ""}. 
              Type <strong>DELETE</strong> to confirm.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setIsDeleteDialogOpen(false); setConfirmText(""); }} 
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={confirmText !== "DELETE"} 
                className="h-9 px-4 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountTable;