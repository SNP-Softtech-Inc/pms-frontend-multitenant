import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useConfirm } from "../../../components/ConfirmDialogContext";
// ✅ use centralized API
import { accountDocsAPI } from "../../../services/api"; // adjust path

const Approvals = () => {
  const { accountId } = useParams();
  const [approvals, setApprovals] = useState([]);
const confirm = useConfirm();
  // ✅ Fetch approvals
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await accountDocsAPI.getApprovalsByAccount(accountId);
        setApprovals(res?.data?.approvals || []);
      } catch (err) {
        console.error("Error fetching approvals:", err);

        const errorMsg =
          err?.response?.data?.message || "Failed to fetch approvals";

        toast.error(errorMsg);
      }
    };

    fetchApprovals();
  }, [accountId]);

  // ✅ Delete approval
  const handleDelete = (id) => {
  confirm({
    title: "Delete Approval",
    description: "Are you sure you want to delete this approval?",
    onConfirm: async () => {
      try {
        await accountDocsAPI.deleteApproval(id);

        // instant UI update
        setApprovals((prev) => prev.filter((a) => a._id !== id));

        toast.success("Approval deleted successfully");
      } catch (err) {
        console.error("Error deleting approval:", err);

        const errorMsg =
          err?.response?.data?.message || "Failed to delete approval";

        toast.error(errorMsg);
      }
    },
  });
};

  return (
    <Box p={2}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Document Name</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {approvals.length > 0 ? (
              approvals.map((approval, index) => (
                <TableRow key={approval._id || index}>
                  <TableCell>{approval.filename || "—"}</TableCell>

                  {/* 🔥 status color */}
                  <TableCell>
                    <span
                      style={{
                        color:
                          approval.status === "approved"
                            ? "green"
                            : approval.status === "rejected"
                            ? "red"
                            : "orange",
                        fontWeight: 500,
                      }}
                    >
                      {approval.status}
                    </span>
                  </TableCell>

                  <TableCell>{approval.description || "—"}</TableCell>

                  <TableCell>
                    {approval.updatedAt
                      ? new Date(approval.updatedAt).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(approval._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No approvals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Approvals;