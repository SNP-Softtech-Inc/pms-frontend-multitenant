// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   CircularProgress,
//   Box,
//   Alert,
//   Chip,
//   Button,
//   IconButton,
//   MenuItem,
//   Menu,
//   Checkbox,
//   TablePagination,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// // import ProposalPreviewDialog from "./ProposalDialog";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { DeleteOutlineRounded } from "@mui/icons-material";
// import { proposalAPI } from "../../services/api"; // ✅ adjust path
// import ProposalPreviewDialog from "./Proposals/ProposalDialog";
// import { useConfirm } from "../../components/ConfirmDialogContext";


// const AccountProposalTable = () => {
//   const { accountId } = useParams();
//   const navigate = useNavigate();
// const confirm = useConfirm();
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);

//   const [anchorEl, setAnchorEl] = useState(null);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedIds, setSelectedIds] = useState([]);

//   // ================= FETCH DATA =================
//  useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const res = await proposalAPI.getAccountProposalsByAccountIds([
//         accountId,
//       ]);

//       console.log("Fetched proposals:", res.data.proposallist);

//       setProposals(res.data.proposallist || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [accountId]);

//   // ================= PAGINATION =================
//   const paginatedProposals = proposals.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const isSelected = (id) => selectedIds.includes(id);

//   const handleSelectRow = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAllPage = (event) => {
//     if (event.target.checked) {
//       const pageIds = paginatedProposals.map((p) => p._id);
//       setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
//     } else {
//       const pageIds = paginatedProposals.map((p) => p._id);
//       setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
//     }
//   };

//   const allPageSelected =
//     paginatedProposals.length > 0 &&
//     paginatedProposals.every((p) => selectedIds.includes(p._id));

  
//   const handleBulkDelete = async () => {
//   confirm({
//     title: "Delete Proposals",
//     description: "Are you sure you want to delete selected proposals?",
//     onConfirm: async () => {
//       try {
//         const res = await proposalAPI.deleteMultipleAccountProposals({
//           proposalIds: selectedIds,
//         });

//         toast.success(res.data.message || "Deleted successfully");

//         setProposals((prev) =>
//           prev.filter((p) => !selectedIds.includes(p._id))
//         );

//         setSelectedIds([]);
//       } catch (err) {
//         console.error(err);
//         toast.error(err.response?.data?.message || "Delete failed");
//       }
//     },
//   });
// };

// const handleDelete = async () => {
//   if (!selectedProposal) return;

//   confirm({
//     title: "Delete Proposal",
//     description: "Are you sure you want to delete this proposal?",
//     onConfirm: async () => {
//       try {
//         const res = await proposalAPI.deleteMultipleAccountProposals({
//           proposalIds: [selectedProposal._id],
//         });

//         toast.success(res.data.message || "Deleted successfully");

//         setProposals((prev) =>
//           prev.filter((p) => p._id !== selectedProposal._id)
//         );
//       } catch (err) {
//         console.error(err);
//         toast.error(err.response?.data?.message || "Delete failed");
//       } finally {
//         handleMenuClose();
//       }
//     },
//   });
// };
  

//   // ================= MENU =================
//   const handleMenuOpen = (event, proposal) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProposal(proposal);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProposal(null);
//   };

//   // ================= NAVIGATION =================
//   const handleCreateNew = () => {
//     navigate(
//       `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal`
//     );
//   };

//   const handleEdit = () => {
//     navigate(
//       `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${selectedProposal._id}`
//     );
//   };

//   // ================= DIALOG =================
//   const handleOpenDialog = (proposal) => {
//     setSelectedProposal(proposal);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedProposal(null);
//   };

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading proposals...</Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return <Alert severity="error">Error: {error}</Alert>;
//   }

//   // ================= UI =================
//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" mb={3}>
//         <Typography variant="h4">Proposals List</Typography>
//         <Button variant="contained" onClick={handleCreateNew}>
//           Create New Proposal
//         </Button>
//       </Box>

//       {selectedIds.length > 0 && (
//         <DeleteOutlineRounded
//           sx={{ color: "red", cursor: "pointer", mb: 2 }}
//           onClick={handleBulkDelete}
//         />
//       )}

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox
//                   checked={allPageSelected}
//                   indeterminate={
//                     selectedIds.length > 0 && !allPageSelected
//                   }
//                   onChange={handleSelectAllPage}
//                 />
//               </TableCell>
//               <TableCell>Proposal Name</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {paginatedProposals.map((proposal) => (
//               <TableRow key={proposal._id}>
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={isSelected(proposal._id)}
//                     onChange={() => handleSelectRow(proposal._id)}
//                   />
//                 </TableCell>

//                 <TableCell>
//                   <Typography
//                     color="primary"
//                     sx={{ cursor: "pointer" }}
//                     onClick={() => handleOpenDialog(proposal)}
//                   >
//                     {proposal.general?.proposalName}
//                   </Typography>
//                 </TableCell>

//                 <TableCell>
//                   <Chip
//                     label={proposal.status}
//                     color={
//                       proposal.status === "Signed" ? "success" : "default"
//                     }
//                   />
//                 </TableCell>

//                 <TableCell>
//                   <IconButton onClick={(e) => handleMenuOpen(e, proposal)}>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={proposals.length}
//         page={page}
//         onPageChange={(e, newPage) => setPage(newPage)}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={(e) =>
//           setRowsPerPage(parseInt(e.target.value, 10))
//         }
//       />

//       {/* MENU */}
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         {selectedProposal?.status === "Signed" ? (
//           <MenuItem onClick={handleMenuClose}>Download</MenuItem>
//         ) : (
//           <MenuItem
//             onClick={() => {
//               handleEdit();
//               handleMenuClose();
//             }}
//           >
//             Edit
//           </MenuItem>
//         )}

//         <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
//           Delete
//         </MenuItem>
//       </Menu>

//       {/* EMPTY STATE */}
//       {proposals.length === 0 && (
//         <Box textAlign="center" mt={4}>
//           <Typography>No proposals available</Typography>
//           <Button variant="contained" onClick={handleCreateNew} sx={{ mt: 2 }}>
//             Create First Proposal
//           </Button>
//         </Box>
//       )}

//       {/* DIALOG */}
//       <ProposalPreviewDialog
//         open={openDialog}
//         handleClose={handleCloseDialog}
//         proposal={selectedProposal}
//       />
//     </Box>
//   );
// };

// export default AccountProposalTable;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { proposalAPI } from "../../services/api";
import ProposalPreviewDialog from "./Proposals/ProposalDialog";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";

const AccountProposalTable = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await proposalAPI.getAccountProposalsByAccountIds([
          accountId,
        ]);

        console.log("Fetched proposals:", res.data.proposallist);

        setProposals(res.data.proposallist || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  // ================= PAGINATION =================
  const paginatedProposals = proposals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    confirm({
      title: "Delete Proposals",
      description: "Are you sure you want to delete selected proposals?",
      onConfirm: async () => {
        try {
          const res = await proposalAPI.deleteMultipleAccountProposals({
            proposalIds: selectedIds,
          });

          toast.success(res.data.message || "Deleted successfully");

          setProposals((prev) =>
            prev.filter((p) => !selectedIds.includes(p._id))
          );

          setSelectedIds([]);
          setRowSelection({});
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Delete failed");
        }
      },
    });
  };

  const handleDelete = async (proposal) => {
    confirm({
      title: "Delete Proposal",
      description: "Are you sure you want to delete this proposal?",
      onConfirm: async () => {
        try {
          const res = await proposalAPI.deleteMultipleAccountProposals({
            proposalIds: [proposal._id],
          });

          toast.success(res.data.message || "Deleted successfully");

          setProposals((prev) =>
            prev.filter((p) => p._id !== proposal._id)
          );
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Delete failed");
        }
      },
    });
  };

  // ================= NAVIGATION =================
  const handleCreateNew = () => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal`
    );
  };

  const handleEdit = (proposal) => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${proposal._id}`
    );
  };

  // ================= DIALOG =================
  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      id: "select",
      // header: ({ table }) => (
      //   <Checkbox
      //     checked={table.getIsAllPageRowsSelected()}
      //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //     aria-label="Select all"
      //   />
      // ),
      // cell: ({ row }) => (
      //   <Checkbox
      //     checked={row.getIsSelected()}
      //     onCheckedChange={(value) => {
      //       row.toggleSelected(!!value);
      //       handleSelectRow(row.original._id);
      //     }}
      //     aria-label="Select row"
      //   />
      // ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "general.proposalName",
      header: "Proposal Name",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-medium text-primary hover:underline cursor-pointer"
          onClick={() => handleOpenDialog(row.original)}
        >
          {row.original.general?.proposalName || "Untitled"}
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Signed" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const proposal = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {proposal.status === "Signed" ? (
                <DropdownMenuItem>Download</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleEdit(proposal)}>
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => handleDelete(proposal)}
                className="text-red-600 focus:text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ================= TOOLBAR FILTERS =================
  const filters = [
    {
      id: "status",
      label: "Status",
      options: [
        { value: "Draft", label: "Draft" },
        { value: "Sent", label: "Sent" },
        { value: "Signed", label: "Signed" },
        { value: "Expired", label: "Expired" },
      ],
    },
  ];

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Proposals List</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Proposal
        </Button>
      </div>

      {/* Bulk Delete Button */}
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleBulkDelete}
          className="mb-4"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected ({selectedIds.length})
        </Button>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedProposals}
        toolbar={
          <DataTableToolbar
            filters={filters}
            onFilterChange={(filters) => {
              // Handle filter changes here
              console.log("Filters changed:", filters);
            }}
          />
        }
        onRowSelectionChange={(selection) => {
          const selected = Object.keys(selection).map(
            (index) => paginatedProposals[parseInt(index)]?._id
          ).filter(Boolean);
          setSelectedIds(selected);
        }}
      />



      {/* Dialog */}
      <ProposalPreviewDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        proposal={selectedProposal}
      />
    </div>
  );
};

export default AccountProposalTable;