import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { authAPI } from "../../services/api";

const ActiveTeammembers = ({ refresh,onEdit  }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getTeamMembers();

      const activeMembers = res.data.data
        // .filter((m) => m.active === true)
        .map((m) => ({
          id: m._id,
          name: `${m.firstName} ${m.lastName}`,
          email: m.email,
          role: m.role,
          status: m.active,
          raw: m,
        }));

      setRows(activeMembers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [refresh]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await authAPI.deleteTeamMember(id);
      fetchTeamMembers();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
 const handleEdit = (row) => {
  onEdit(row); // 🔥 send data to parent
};

  // ================= COLUMNS =================
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },

    { field: "email", headerName: "Email", flex: 1 },

    {
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" />
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: () => (
        <Chip label="Active" color="success" size="small" />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleEdit(params.row.raw)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box height={500}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
        <Typography variant="h6" gutterBottom>
          Active Team Members
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
        /></>
        
      )}
    </Box>
  );
};

export default ActiveTeammembers;