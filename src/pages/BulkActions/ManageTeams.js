import React, { useEffect, useState, useMemo, forwardRef, useImperativeHandle } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { accountsAPI, authAPI } from "../../services/api";

const ManageTeams = forwardRef(
  ({ selectedAccounts, onClose, fetchData }, ref) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [actions, setActions] = useState({});
    const [loading, setLoading] = useState(false);

    // ================= FETCH TEAM =================
    useEffect(() => {
      fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
      try {
        setLoading(true);

        const res = await authAPI.getAllUsers(); // ✅ use API
        const data = res.data.users || [];

        setTeamMembers(data);

        const initial = {};
        data.forEach((user) => {
          initial[user._id] = "Do nothing";
        });

        setActions(initial);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch team members");
      } finally {
        setLoading(false);
      }
    };

    // ================= HANDLE CHANGE =================
    const handleActionChange = (userId, value) => {
      setActions((prev) => ({
        ...prev,
        [userId]: value,
      }));
    };

    // ================= FILTER =================
    const assignMembers = useMemo(
      () =>
        Object.keys(actions).filter(
          (id) => actions[id] === "Assign to all"
        ),
      [actions]
    );

    const removeMembers = useMemo(
      () =>
        Object.keys(actions).filter(
          (id) => actions[id] === "Remove from all"
        ),
      [actions]
    );

    // ================= SUBMIT (FOR DRAWER BUTTON) =================
    const handleSubmit = async () => {
      try {
        setLoading(true);

        if (assignMembers.length > 0) {
          await accountsAPI.assignTeamMembers({
            accounts: selectedAccounts,
            teamMembers: assignMembers,
          });
        }

        if (removeMembers.length > 0) {
          await accountsAPI.removeTeamMembers({
            accounts: selectedAccounts,
            teamMembers: removeMembers,
          });
        }

        toast.success("Team updated successfully");

        fetchData(); // refresh table
        onClose();   // close drawer
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    // ✅ expose to parent drawer button
    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    // ================= UI =================
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Team Member</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : (
                teamMembers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {user.username}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Select
                        value={actions[user._id] || "Do nothing"}
                        onChange={(e) =>
                          handleActionChange(user._id, e.target.value)
                        }
                        size="small"
                        sx={{ minWidth: 150 }}
                      >
                        <MenuItem value="Assign to all">
                          Assign
                        </MenuItem>
                        <MenuItem value="Remove from all">
                          Remove
                        </MenuItem>
                        <MenuItem value="Do nothing">
                          Do nothing
                        </MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
);

export default ManageTeams;