// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
// } from "@mui/material";
// import { authAPI } from "../../services/api"; // adjust path

// const ActiveTeammembers = () => {
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch team members
//   const fetchTeamMembers = async () => {
//     try {
//       setLoading(true);
//       const res = await authAPI.getTeamMembers();

//       // Filter only active members
//       const activeMembers = res.data.data.filter(
//         (member) => member.active === true
//       );

//       setTeamMembers(activeMembers);
//     } catch (error) {
//       console.error("Error fetching team members:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeamMembers();
//   }, []);

//   return (
//     <Box p={2}>
//       <Typography variant="h5" mb={2}>
//         Active Team Members
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center">
//           <CircularProgress />
//         </Box>
//       ) : teamMembers.length === 0 ? (
//         <Typography>No active team members found</Typography>
//       ) : (
//         <Grid container spacing={2}>
//           {teamMembers.map((member) => (
//             <Grid item xs={12} sm={6} md={4} key={member._id}>
//               <Card
//                 sx={{
//                   borderRadius: 3,
//                   boxShadow: 3,
//                   transition: "0.3s",
//                   "&:hover": {
//                     transform: "translateY(-5px)",
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6">
//                     {member.firstName} {member.lastName}
//                   </Typography>

//                   <Typography variant="body2" color="text.secondary">
//                     {member.email}
//                   </Typography>

//                   <Box mt={1}>
//                     <Chip
//                       label={member.role}
//                       color="primary"
//                       size="small"
//                     />
//                   </Box>

//                   <Box mt={1}>
//                     <Chip
//                       label="Active"
//                       color="success"
//                       size="small"
//                     />
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default ActiveTeammembers;

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
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
        />
      )}
    </Box>
  );
};

export default ActiveTeammembers;