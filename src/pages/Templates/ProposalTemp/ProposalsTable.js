

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
//   Chip,
//   Button
// } from '@mui/material';
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";

// import { Link, useNavigate } from 'react-router-dom';
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import { toast } from 'react-toastify';
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import { proposalAPI } from '../../../services/api';
// const ProposalsTable = () => {
//   const confirm = useConfirm();
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);              // menu anchor
//   const [selectedProposal, setSelectedProposal] = useState(null); // which row clicked
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await proposalAPI.getAllProposals();
// setProposals(res.data?.proposallist || []);
       
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleTemplateClick = (proposal) => {

//     console.log("proposal to edit", proposal)
//     // Navigate to proposal form with the proposal ID
//     navigate(`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`);
//   };

//   const handleCreateNew = () => {
//     // Navigate to empty proposal form
//     navigate('/firmtemp/templates/proposals/proposal-form');
//   };

//    // ✅ Open menu for selected row
//   const handleMenuOpen = (event, proposal) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProposal(proposal);
//   };

//   // ✅ Close menu
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProposal(null);
//   };

// // ✅ Actual delete function (API call only)
// const handleDelete = async (proposalId) => {
//   try {
//     await proposalAPI.deleteProposal(proposalId);
//     toast.success("Proposal deleted successfully");
//     setProposals((prev) => prev.filter((p) => p._id !== proposalId));
//   } catch (err) {
//     console.error("Delete error:", err);
//     toast.error("Failed to delete proposal");
//   } finally {
//     handleMenuClose();
//   }
// };

// // ✅ Delete click → show confirmation first
// const handleDeleteClick = () => {
//   if (!selectedProposal) return;

//   confirm({
//     title: "Delete Proposal",
//     description: `Are you sure you want to delete "${selectedProposal.templatename}"?`,
//     confirmText: "Delete",
//     cancelText: "Cancel",
//     onConfirm: async () => {
//       await handleDelete(selectedProposal._id);
//     },
//   });
// };

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

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4">
//           Proposals List
//         </Typography>
//         <Button 
//           variant="contained" 
//           color="primary"
//           onClick={handleCreateNew}
//         >
//           Create New Proposal
//         </Button>
//       </Box>
      
//       <TableContainer component={Paper} elevation={3}>
//         <Table sx={{ minWidth: 650 }} size="medium">
//           <TableHead >
//             <TableRow>
              
             
//               <TableCell >
//                 Template Name
//               </TableCell>
//               <TableCell>
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {proposals.map((proposal) => (
//               <TableRow
//                 key={proposal._id}
               
//               >
               
                
//                 <TableCell>
               
//                  <Link  to={`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`}
//                       style={{
//                         textDecoration: "none",
//                         color: "black",
//                         // fontWeight: 500,
//                       }}> {proposal.templatename} </Link>
                 
//                 </TableCell>
//                   <TableCell>
//                   <IconButton onClick={(e) => handleMenuOpen(e, proposal)}>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//         {/* ✅ MENU FOR EDIT / DELETE */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem
//           onClick={() => {
//             handleTemplateClick(selectedProposal);
//             handleMenuClose();
//           }}
//         >
//         <RiEdit2Line style={{ marginRight: 8 }} />  Edit
//         </MenuItem>

//        <MenuItem sx={{ color: "red" }} onClick={handleDeleteClick}>
//  <RiDeleteBin6Line style={{ marginRight: 8 }} />   Delete
// </MenuItem>
//       </Menu>
//       {proposals.length === 0 && (
//         <Box textAlign="center" sx={{ mt: 4 }}>
//           <Typography variant="h6" color="text.secondary">
//             No proposals available
//           </Typography>
//           <Button 
//             variant="contained" 
//             color="primary"
//             onClick={handleCreateNew}
//             sx={{ mt: 2 }}
//           >
//             Create Your First Proposal
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ProposalsTable;

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TablePagination
} from '@mui/material';
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from 'react-toastify';
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { proposalAPI } from '../../../services/api';

const ProposalsTable = () => {
  const confirm = useConfirm();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleTemplateClick = (proposal) => {
    navigate(`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`);
  };

  const handleCreateNew = () => {
    navigate('/firmtemp/templates/proposals/proposal-form');
  };

  const handleMenuOpen = (event, proposal) => {
    setAnchorEl(event.currentTarget);
    setSelectedProposal(proposal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProposal(null);
  };

  const handleDelete = async (proposalId) => {
    try {
      await proposalAPI.deleteProposal(proposalId);
      toast.success("Proposal deleted successfully");
      setProposals((prev) => prev.filter((p) => p._id !== proposalId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete proposal");
    } finally {
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    if (!selectedProposal) return;

    confirm({
      title: "Delete Proposal",
      description: `Are you sure you want to delete "${selectedProposal.templatename}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        await handleDelete(selectedProposal._id);
      },
    });
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading proposals...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  // Calculate current page data
  const paginatedProposals = proposals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Proposals List</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateNew}>
          Create New Proposal
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Template Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProposals.map((proposal) => (
              <TableRow key={proposal._id}>
                <TableCell>
                  <Link
                    to={`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {proposal.templatename}
                  </Link>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, proposal)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={proposals.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Menu for Edit / Delete */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleTemplateClick(selectedProposal);
            handleMenuClose();
          }}
        >
          <RiEdit2Line style={{ marginRight: 8 }} /> Edit
        </MenuItem>
        <MenuItem sx={{ color: "red" }} onClick={handleDeleteClick}>
          <RiDeleteBin6Line style={{ marginRight: 8 }} /> Delete
        </MenuItem>
      </Menu>

      {proposals.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No proposals available
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCreateNew} sx={{ mt: 2 }}>
            Create Your First Proposal
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProposalsTable;