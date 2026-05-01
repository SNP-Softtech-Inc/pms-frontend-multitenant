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
// import CreateGroupDrawer from "./CreateGroupDrawer";
// import { authAPI } from "../../services/api";

// const ActiveGroups = ({ refresh, onEdit }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);
// const [editData, setEditData] = useState(null);
// const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);

//   const fetchGroups = async () => {
//     try {
//       setLoading(true);

//       const res = await authAPI.getGroups();

//       console.log("Groups:", res.data);

//       const groups = res.data || [];

//       const formatted = groups.map((g) => ({
//         id: g._id,
//         name: g.name,
//         leader: g.leader?.username || "N/A",
//         membersCount: g.members?.length || 0,
//         members: g.members || [],
//         raw: g,
//       }));

//       setRows(formatted);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, [refresh]);

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this group?")) return;
// console.log("Deleting group with id:", id); // Debug log
//     try {
//       await authAPI.deleteGroup(id); // 👈 add this API if not exists
//       fetchGroups();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ================= EDIT =================
//  const handleEdit = (row) => {
//   const group = row.raw;

//   const formattedGroup = {
//     _id: group._id,
//     name: group.name,
//     leader: group.leader || null,
//     members: group.members || [],
//   };

//   // ✅ existing flow (unchanged)
//   if (onEdit) onEdit(formattedGroup);

//   // ✅ NEW: open drawer locally
//   setEditData(formattedGroup);
//   setGroupDrawerOpen(true);
// };

//   // ================= COLUMNS =================
//   const columns = [
//     {
//       field: "name",
//       headerName: "Group Name",
//       flex: 1,
//     },

//     {
//       field: "leader",
//       headerName: "Leader",
//       flex: 1,
//       renderCell: (params) => (
//         <Chip label={params.value} color="secondary" size="small" />
//       ),
//     },

//     {
//       field: "membersCount",
//       headerName: "Members",
//       width: 120,
//     },

//     {
//       field: "members",
//       headerName: "Members List",
//       flex: 1,
//       renderCell: (params) => (
//         <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
//           {params.value.slice(0, 3).map((m) => (
//             <Chip
//               key={m._id}
//               label={m.username}
//               size="small"
//               variant="outlined"
//             />
//           ))}
//           {params.value.length > 3 && (
//             <Chip label={`+${params.value.length - 3}`} size="small" />
//           )}
//         </Box>
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
//               onClick={() => handleEdit(params.row)}
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
//           Active Groups
//         </Typography>
//          <DataGrid
//           rows={rows}
//           columns={columns}
//           pageSize={5}
//           rowsPerPageOptions={[5, 10, 20]}
//           pagination
//           disableSelectionOnClick
//         /></>
       
//       )}

//       <CreateGroupDrawer
//   open={groupDrawerOpen}
//   onClose={() => {
//     setGroupDrawerOpen(false);
//     setEditData(null);
//   }}
//   editData={editData}
//   onSuccess={() => {
//     fetchGroups(); // refresh table
//   }}
// />
//     </Box>
//   );
// };

// export default ActiveGroups;

import React, { use, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Trash2, Pencil } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import CreateGroupDrawer from "./CreateGroupDrawer";
import { authAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
const ActiveGroups = ({ refresh, onEdit }) => {
  const confirm = useConfirm();
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

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete this group?")) return;
  //   console.log("Deleting group with id:", id);
  //   try {
  //     await authAPI.deleteGroup(id);
  //     fetchGroups();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

    const handleDelete = (id) => {
    confirm({
      title: "Delete Group",
      description: "Are you sure you want to delete this group?",
      onConfirm: async () => {
        console.log("Deleting group with id:", id);
        try {
          await authAPI.deleteGroup(id);
          fetchGroups();
        } catch (err) {
          console.error(err);
        }
      },
    });
  };
  const handleEdit = (row) => {
    const group = row.raw;
    const formattedGroup = {
      _id: group._id,
      name: group.name,
      leader: group.leader || null,
      members: group.members || [],
    };

    if (onEdit) onEdit(formattedGroup);
    setEditData(formattedGroup);
    setGroupDrawerOpen(true);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Group Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "leader",
      header: "Leader",
      cell: ({ row }) => {
        const leader = row.getValue("leader");
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            {leader}
          </Badge>
        );
      },
    },
    {
      accessorKey: "membersCount",
      header: "Members",
      cell: ({ row }) => row.getValue("membersCount"),
    },
    {
      accessorKey: "members",
      header: "Members List",
      cell: ({ row }) => {
        const members = row.getValue("members");
        return (
          <div className="flex gap-1 flex-wrap">
            {members.slice(0, 3).map((m) => (
              <Badge key={m._id} variant="outline" className="text-xs">
                {m.username}
              </Badge>
            ))}
            {members.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{members.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <TooltipProvider>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(group)}
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Group</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(group.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Group</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h6 className="text-lg font-semibold">Active Groups</h6>
      </div>

      <DataTableToolbar
        searchKey="name"
        searchPlaceholder="Search groups..."
      />
      
      <div className="h-[500px]">
        <DataTable
          columns={columns}
          data={rows}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
        />
      </div>

      <CreateGroupDrawer
        open={groupDrawerOpen}
        onClose={() => {
          setGroupDrawerOpen(false);
          setEditData(null);
        }}
        editData={editData}
        onSuccess={() => {
          fetchGroups();
        }}
      />
    </div>
  );
};

export default ActiveGroups;