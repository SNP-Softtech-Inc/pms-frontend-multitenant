// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   CircularProgress,
//   IconButton,
//   Chip,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";

// import { authAPI } from "../../services/api";

// const ActiveTeammembers = ({ refresh,onEdit  }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchTeamMembers = async () => {
//     try {
//       setLoading(true);
//       const res = await authAPI.getTeamMembers();

//       const activeMembers = res.data.data
//         // .filter((m) => m.active === true)
//         .map((m) => ({
//           id: m._id,
//           name: `${m.firstName} ${m.lastName}`,
//           email: m.email,
//           role: m.role,
//           status: m.active,
//           raw: m,
//         }));

//       setRows(activeMembers);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeamMembers();
//   }, [refresh]);

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure to delete?")) return;

//     try {
//       await authAPI.deleteTeamMember(id);
//       fetchTeamMembers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ================= EDIT =================
//  const handleEdit = (row) => {
//   onEdit(row); // 🔥 send data to parent
// };

//   // ================= COLUMNS =================
//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },

//     { field: "email", headerName: "Email", flex: 1 },

//     {
//       field: "role",
//       headerName: "Role",
//       width: 130,
//       renderCell: (params) => (
//         <Chip label={params.value} color="primary" size="small" />
//       ),
//     },

//     {
//       field: "status",
//       headerName: "Status",
//       width: 130,
//       renderCell: () => (
//         <Chip label="Active" color="success" size="small" />
//       ),
//     },

//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 130,
//       renderCell: (params) => (
//         <>
//           <Tooltip title="Edit">
//             <IconButton
//               onClick={() => handleEdit(params.row.raw)}
//               color="primary"
//             >
//               <EditIcon />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Delete">
//             <IconButton
//               onClick={() => handleDelete(params.row.id)}
//               color="error"
//             >
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         </>
//       ),
//     },
//   ];

//   return (
//     <Box height={500}>
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <>
//         <Typography variant="h6" gutterBottom>
//           Active Team Members
//         </Typography>
//         <DataGrid
//           rows={rows}
//           columns={columns}
//           pageSize={5}
//           rowsPerPageOptions={[5, 10, 20]}
//           pagination
//           disableSelectionOnClick
//         /></>
        
//       )}
//     </Box>
//   );
// };

// export default ActiveTeammembers;


import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import { authAPI } from "../../services/api";

const ActiveTeammembers = ({ refresh, onEdit }) => {
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
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span>{row.getValue("email")}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="default" className="bg-primary">
          {row.getValue("role")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="success" className="bg-green-500 hover:bg-green-600">
          Active
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(member.raw)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(member.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Typography variant="h6" gutterBottom>
        Active Team Members
      </Typography>
      <DataTable
        data={rows}
        columns={columns}
        toolbar={<DataTableToolbar />}
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default ActiveTeammembers;