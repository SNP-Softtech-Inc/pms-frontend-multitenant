import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateGroupDrawer from "./CreateGroupDrawer";
import { authAPI } from "../../services/api";

const ActiveGroups = ({ refresh, onEdit }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
const [editData, setEditData] = useState(null);
const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const res = await authAPI.getGroups();

      console.log("Groups:", res.data);

      const groups = res.data || [];

      const formatted = groups.map((g) => ({
        id: g._id,
        name: g.name,
        leader: g.leader?.username || "N/A",
        membersCount: g.members?.length || 0,
        members: g.members || [],
        raw: g,
      }));

      setRows(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [refresh]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this group?")) return;

    try {
      await authAPI.deleteGroup(id); // 👈 add this API if not exists
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
 const handleEdit = (row) => {
  const group = row.raw;

  const formattedGroup = {
    _id: group._id,
    name: group.name,
    leader: group.leader || null,
    members: group.members || [],
  };

  // ✅ existing flow (unchanged)
  if (onEdit) onEdit(formattedGroup);

  // ✅ NEW: open drawer locally
  setEditData(formattedGroup);
  setGroupDrawerOpen(true);
};

  // ================= COLUMNS =================
  const columns = [
    {
      field: "name",
      headerName: "Group Name",
      flex: 1,
    },

    {
      field: "leader",
      headerName: "Leader",
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value} color="secondary" size="small" />
      ),
    },

    {
      field: "membersCount",
      headerName: "Members",
      width: 120,
    },

    {
      field: "members",
      headerName: "Members List",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value.slice(0, 3).map((m) => (
            <Chip
              key={m._id}
              label={m.username}
              size="small"
              variant="outlined"
            />
          ))}
          {params.value.length > 3 && (
            <Chip label={`+${params.value.length - 3}`} size="small" />
          )}
        </Box>
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
              onClick={() => handleEdit(params.row)}
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
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
        />
      )}

      <CreateGroupDrawer
  open={groupDrawerOpen}
  onClose={() => {
    setGroupDrawerOpen(false);
    setEditData(null);
  }}
  editData={editData}
  onSuccess={() => {
    fetchGroups(); // refresh table
  }}
/>
    </Box>
  );
};

export default ActiveGroups;