import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Box,
  TableContainer,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import { useConfirm } from "../components/ConfirmDialogContext";
import { TablePagination } from "@mui/material";
// ✅ IMPORT APIs
import { accountsAPI, proposalAPI } from "../services/api"; // adjust path if needed

const ProposalsEls = () => {
  const [proposallist, setProposalList] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm();
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};
  // ================= FETCH DATA =================
  const fetchPrprosalsAllData = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch accounts
      const accountsResponse = await accountsAPI.getAccountsList(
        filterStatus === "active",
      );

      const accountsData = accountsResponse.data.accountlist || [];

      if (!accountsData.length) {
        setProposalList([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Extract account IDs
      const accountIds = accountsData.map((acc) => acc._id);

      // 3️⃣ Fetch proposals
      const response =
        await proposalAPI.getAccountProposalsByAccountIds(accountIds);

      setProposalList(response.data.proposallist || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrprosalsAllData();
  }, [filterStatus]);

  // ================= HANDLERS =================
  const handleEdit = (_id, accountId) => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${_id}`,
    );
  };

  const handleAccountDash = (accountId) => {
    navigate(`/clients/accounts/accountsdash/overview/${accountId}`);
  };

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
  };

  const handleDelete = (_id) => {
    confirm({
      title: "Delete Proposal",
      description: "Are you sure you want to delete this proposal?",
      onConfirm: async () => {
        try {
          const res = await proposalAPI.deleteMultipleAccountProposals({
            proposalIds: [_id], // ✅ pass single id as array
          });

          toast.success(res.data.message || "Deleted successfully");

          // ✅ Option 2 (if you prefer API refresh)
          fetchPrprosalsAllData();
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Delete failed");
        } finally {
          setOpenMenuId(null); // safe call
        }
      },
    });
  };
  const handleCreateProposal = () => {
    navigate("/billing/proposalsandels/new");
  };

  // ================= UI =================
  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Proposals & Els
        </Typography>

        <Button variant="contained" onClick={handleCreateProposal}>
          New Proposals & Els
        </Button>
      </Box>

      {/* LOADING */}
      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflow: "visible" }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Client Name",
                  "Proposal Name",
                  "Status",
                  "Payment",
                  "Auth",
                  "Invoicing",
                  "Date",
                  "Signed",
                  "Settings",
                ].map((header, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {proposallist.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No proposals found
                  </TableCell>
                </TableRow>
              ) : (
                // proposallist.map((row) => (
                  proposallist
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((row) => (
                  <TableRow key={row._id}>
                    {/* CLIENT NAME */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          cursor: "pointer",
                          color: "#3f51b5",
                        }}
                        onClick={() =>
                          handleAccountDash(row.general.account?.[0]?._id)
                        }
                      >
                        {row.general.account?.[0]?.accountName || "—"}
                      </Typography>
                    </TableCell>

                    {/* PROPOSAL NAME */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          cursor: "pointer",
                          color: "#3f51b5",
                        }}
                        onClick={() =>
                          handleEdit(row._id, row.general.account?.[0]?._id)
                        }
                      >
                        {row.general.proposalName || "Untitled"}
                      </Typography>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell sx={{ fontSize: "12px" }}>
                      {row.status}
                    </TableCell>

                    {/* PLACEHOLDERS */}
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>

                    {/* DATE */}
                    <TableCell sx={{ fontSize: "12px" }}>
                      {row.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(row.createdAt))
                        : "—"}
                    </TableCell>

                    <TableCell>—</TableCell>

                    {/* SETTINGS */}
                    <TableCell sx={{ position: "relative" }}>
                      <IconButton
                        onClick={() => toggleMenu(row._id)}
                        sx={{ color: "#2c59fa" }}
                      >
                        <CiMenuKebab size={22} />
                      </IconButton>

                      {openMenuId === row._id && (
                        <Box
                          sx={{
                            position: "absolute",
                            zIndex: 10,
                            backgroundColor: "#fff",
                            boxShadow: 3,
                            borderRadius: 1,
                            p: 1,
                            right: 0,
                            mt: 1,
                            minWidth: "100px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                              mb: 1,
                            }}
                            onClick={() =>
                              handleEdit(row._id, row.general.account?.[0]?._id)
                            }
                          >
                            Edit
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "red",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => handleDelete(row._id)}
                          >
                            Delete
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
  component="div"
  count={proposallist.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[5, 10, 25, 50]}
/>
        </TableContainer>
      )}
    </Box>
  );
};

export default ProposalsEls;
