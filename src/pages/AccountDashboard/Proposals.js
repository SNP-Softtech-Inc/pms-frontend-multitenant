import React, { useState, useEffect } from "react";
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
  Chip,
  Button,
  IconButton,
  MenuItem,
  Menu,
  Checkbox,
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ProposalPreviewDialog from "./ProposalDialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DeleteOutlineRounded } from "@mui/icons-material";
import { proposalAPI } from "../../services/api"; // ✅ adjust path
import ProposalPreviewDialog from "./Proposals/ProposalDialog";
import { useConfirm } from "../../components/ConfirmDialogContext";


const AccountProposalTable = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
const confirm = useConfirm();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

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

  const isSelected = (id) => selectedIds.includes(id);

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllPage = (event) => {
    if (event.target.checked) {
      const pageIds = paginatedProposals.map((p) => p._id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = paginatedProposals.map((p) => p._id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const allPageSelected =
    paginatedProposals.length > 0 &&
    paginatedProposals.every((p) => selectedIds.includes(p._id));

  // ================= DELETE =================
  // const handleBulkDelete = async () => {
  //   if (!window.confirm("Delete selected proposals?")) return;

  //   try {
  //     const res = await proposalAPI.deleteMultipleAccountProposals({
  //       proposalIds: selectedIds,
  //     });

  //     toast.success(res.data.message || "Deleted successfully");

  //     setProposals((prev) =>
  //       prev.filter((p) => !selectedIds.includes(p._id))
  //     );

  //     setSelectedIds([]);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || "Delete failed");
  //   }
  // };
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
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Delete failed");
      }
    },
  });
};

const handleDelete = async () => {
  if (!selectedProposal) return;

  confirm({
    title: "Delete Proposal",
    description: "Are you sure you want to delete this proposal?",
    onConfirm: async () => {
      try {
        const res = await proposalAPI.deleteMultipleAccountProposals({
          proposalIds: [selectedProposal._id],
        });

        toast.success(res.data.message || "Deleted successfully");

        setProposals((prev) =>
          prev.filter((p) => p._id !== selectedProposal._id)
        );
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Delete failed");
      } finally {
        handleMenuClose();
      }
    },
  });
};
  // const handleDelete = async () => {
  //   if (!selectedProposal) return;

  //   if (!window.confirm("Delete this proposal?")) return;

  //   try {
  //     const res = await proposalAPI.deleteMultipleAccountProposals({
  //       proposalIds: [selectedProposal._id],
  //     });

  //     toast.success(res.data.message || "Deleted successfully");

  //     setProposals((prev) =>
  //       prev.filter((p) => p._id !== selectedProposal._id)
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || "Delete failed");
  //   } finally {
  //     handleMenuClose();
  //   }
  // };

  // ================= MENU =================
  const handleMenuOpen = (event, proposal) => {
    setAnchorEl(event.currentTarget);
    setSelectedProposal(proposal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProposal(null);
  };

  // ================= NAVIGATION =================
  const handleCreateNew = () => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal`
    );
  };

  const handleEdit = () => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${selectedProposal._id}`
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

  // ================= LOADING =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading proposals...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  // ================= UI =================
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Proposals List</Typography>
        <Button variant="contained" onClick={handleCreateNew}>
          Create New Proposal
        </Button>
      </Box>

      {selectedIds.length > 0 && (
        <DeleteOutlineRounded
          sx={{ color: "red", cursor: "pointer", mb: 2 }}
          onClick={handleBulkDelete}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allPageSelected}
                  indeterminate={
                    selectedIds.length > 0 && !allPageSelected
                  }
                  onChange={handleSelectAllPage}
                />
              </TableCell>
              <TableCell>Proposal Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedProposals.map((proposal) => (
              <TableRow key={proposal._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(proposal._id)}
                    onChange={() => handleSelectRow(proposal._id)}
                  />
                </TableCell>

                <TableCell>
                  <Typography
                    color="primary"
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpenDialog(proposal)}
                  >
                    {proposal.general?.proposalName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={proposal.status}
                    color={
                      proposal.status === "Signed" ? "success" : "default"
                    }
                  />
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
      </TableContainer>

      <TablePagination
        component="div"
        count={proposals.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />

      {/* MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedProposal?.status === "Signed" ? (
          <MenuItem onClick={handleMenuClose}>Download</MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleEdit();
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
        )}

        <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>

      {/* EMPTY STATE */}
      {proposals.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography>No proposals available</Typography>
          <Button variant="contained" onClick={handleCreateNew} sx={{ mt: 2 }}>
            Create First Proposal
          </Button>
        </Box>
      )}

      {/* DIALOG */}
      <ProposalPreviewDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        proposal={selectedProposal}
      />
    </Box>
  );
};

export default AccountProposalTable;