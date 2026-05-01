
// import React, { useState, useEffect } from 'react';
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
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
//   TablePagination
// } from '@mui/material';
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// import { Link, useNavigate } from 'react-router-dom';
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { toast } from 'react-toastify';
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import { proposalAPI } from '../../../services/api';

// const ProposalsTable = () => {
//   const confirm = useConfirm();
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProposal, setSelectedProposal] = useState(null);

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await proposalAPI.getAllProposals();
//         setProposals(res.data?.proposallist || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleTemplateClick = (proposal) => {
//     navigate(`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`);
//   };

//   const handleCreateNew = () => {
//     navigate('/firmtemp/templates/proposals/proposal-form');
//   };

//   const handleMenuOpen = (event, proposal) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProposal(proposal);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProposal(null);
//   };

//   const handleDelete = async (proposalId) => {
//     try {
//       await proposalAPI.deleteProposal(proposalId);
//       toast.success("Proposal deleted successfully");
//       setProposals((prev) => prev.filter((p) => p._id !== proposalId));
//     } catch (err) {
//       console.error("Delete error:", err);
//       toast.error("Failed to delete proposal");
//     } finally {
//       handleMenuClose();
//     }
//   };

//   const handleDeleteClick = () => {
//     if (!selectedProposal) return;

//     confirm({
//       title: "Delete Proposal",
//       description: `Are you sure you want to delete "${selectedProposal.templatename}"?`,
//       confirmText: "Delete",
//       cancelText: "Cancel",
//       onConfirm: async () => {
//         await handleDelete(selectedProposal._id);
//       },
//     });
//   };

//   // Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to first page
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//         <Typography variant="body1" sx={{ ml: 2 }}>
//           Loading proposals...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ mt: 2 }}>
//         Error: {error}
//       </Alert>
//     );
//   }

//   // Calculate current page data
//   const paginatedProposals = proposals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
       
//         <Button variant="contained" color="primary" onClick={handleCreateNew}>
//           Create New Proposal
//         </Button>
//       </Box>

//       <TableContainer component={Paper} >
//         <Table sx={{ width: "100%" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Template Name</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedProposals.map((proposal) => (
//               <TableRow key={proposal._id}>
//                 <TableCell>
//                   <Link
//                     to={`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`}
//                     style={{ textDecoration: "none", color: "black" }}
//                   >
//                     {proposal.templatename}
//                   </Link>
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

//         {/* Pagination */}
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={proposals.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>

//       {/* Menu for Edit / Delete */}
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         <MenuItem
//           onClick={() => {
//             handleTemplateClick(selectedProposal);
//             handleMenuClose();
//           }}
//         >
//           <RiEdit2Line style={{ marginRight: 8 }} /> Edit
//         </MenuItem>
//         <MenuItem sx={{ color: "red" }} onClick={handleDeleteClick}>
//           <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
//         </MenuItem>
//       </Menu>

//       {proposals.length === 0 && (
//         <Box textAlign="center" sx={{ mt: 4 }}>
//           <Typography variant="h6" color="text.secondary">
//             No proposals available
//           </Typography>
//           <Button variant="contained" color="primary" onClick={handleCreateNew} sx={{ mt: 2 }}>
//             Create Your First Proposal
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ProposalsTable;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/data-table/data-table';
import { DataTableToolbar } from '../../../components/data-table/toolbar';
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { proposalAPI } from '../../../services/api';

const ProposalsTable = () => {
  const confirm = useConfirm();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await proposalAPI.getAllProposals();
        setProposals(res.data?.proposallist || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateNew = () => {
    navigate('/firmtemp/templates/proposals/proposal-form');
  };

  const handleDeleteProposal = async (proposalId) => {
    try {
      await proposalAPI.deleteProposal(proposalId);
      toast.success("Proposal deleted successfully");
      setProposals((prev) => prev.filter((p) => p._id !== proposalId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete proposal");
    }
  };

  const handleDeleteClick = (proposal) => {
    confirm({
      title: "Delete Proposal",
      description: `Are you sure you want to delete "${proposal.templatename}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        await handleDeleteProposal(proposal._id);
      },
    });
  };

  const proposalColumns = useMemo(() => [
    {
      accessorKey: 'templatename',
      header: 'Template Name',
      cell: ({ getValue, row }) => (
        <button
          onClick={() => navigate(`/firmtemp/templates/proposals/proposal-form?edit=${row.original._id}`)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigate(`/firmtemp/templates/proposals/proposal-form?edit=${row.original._id}`)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], [navigate, confirm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-6">
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={handleCreateNew}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Proposal
        </Button>
      </div>
      
      {error && (
        <div className="rounded-md bg-destructive/15 p-3">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      )}
      
      <DataTableToolbar 
        globalFilter={globalFilter} 
        onGlobalFilterChange={setGlobalFilter} 
      />
      
      <DataTable
        columns={proposalColumns}
        data={proposals}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No proposals available"
        emptyDescription="Create your first proposal template to get started"
        pageSize={25}
      />
    </div>
  );
};

export default ProposalsTable;