


import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import {Label} from "../../components/ui/label"
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
import { useToastContext } from "../../context/ToastContext";
import { authAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
const ActiveTeammembers = ({ refresh, onEdit }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
const confirm = useConfirm();
const {showToast}= useToastContext()
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      // const res = await authAPI.getTeamMembers();
      const res = await authAPI.getActiveTeamMembers();
console.log("Fetched Team Members:", res.data.data);
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
const handleDeactivate = (id, memberName) => {
  confirm({
    title: "Deactivate Team Member",
    description: `Are you sure you want to deactivate ${memberName}? The team member will no longer be able to access the system.`,
    onConfirm: async () => {
      try {
        await authAPI.deactivateTeamMember(id);
        fetchTeamMembers();

        // Optional toast
        showToast({
          title: "Team member deactivated",
          description: "Team member deactivated successfully.",
          type: "success",
        });
      } catch (error) {
        console.error(error);

        // Optional toast
        showToast({
          title: "Failed to deactivate team member",
          description: error?.response?.data?.message || "Failed to deactivate team member.",
          type: "error",
        });
      }
    },
  });
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
  cell: ({ row }) => {
    const isActive = row.getValue("status");
// console.log("Row Status:", isActive);
    return (
      <Badge
        variant={isActive ? "success" : "secondary"}
        className={
          isActive
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  },
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
             <DropdownMenuItem
  onClick={() =>
    handleDeactivate(
      member.id,
      member.name
    )
  }
  className="text-orange-600"
>
  Deactivate
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
     <div className="flex justify-between items-center">
        <h6 className="text-lg font-semibold">Active Team Members</h6>
      </div>
      {/* <DataTable
        data={rows}
        columns={columns}
        toolbar={<DataTableToolbar />}
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
      /> */}
       <DataTableToolbar
              searchKey="name"
              searchPlaceholder="Search groups..."
            />
            
            <div >
              <DataTable
                columns={columns}
                data={rows}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
                disableSelectionOnClick
              />
              </div>
    </div>
  );
};

export default ActiveTeammembers;