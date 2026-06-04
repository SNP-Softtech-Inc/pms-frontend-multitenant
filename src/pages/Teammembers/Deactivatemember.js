import React, { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
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
import { useConfirm } from "../../components/ConfirmDialogContext";
import { toast } from "react-toastify";
const DeactiveTeammembers = ({ refresh, onEdit }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
const confirm = useConfirm();
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);

      const res = await authAPI.getInactiveTeamMembers();

      const inactiveMembers = res.data.data.map((m) => ({
        id: m._id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        role: m.role,
        status: m.active,
        raw: m,
      }));

      setRows(inactiveMembers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await authAPI.deleteTeamMember(id);
      fetchTeamMembers();
    } catch (err) {
      console.error(err);
    }
  };
const handleResendActivation = (teamMemberId, memberName) => {
  confirm({
    title: "Resend Activation Email",
    description: `Are you sure you want to resend the activation email to ${memberName}?`,
    onConfirm: async () => {
      try {
        const res = await authAPI.resendActivation(teamMemberId);

        console.log(res.data);

        // Optional: show toast here
        toast.success(res.data.message);

      } catch (error) {
        console.error(error);

        // Optional: show toast here
         toast.error(error?.response?.data?.message);
      }
    },
  });
};
  const handleEdit = (row) => {
    onEdit(row);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
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
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <Badge className="bg-red-500 text-white">
    //       Inactive
    //     </Badge>
    //   ),
    // },
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
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => handleEdit(member.raw)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
 <DropdownMenuItem
  onClick={() =>
    handleResendActivation(
      member.id,
      member.name
    )
  }
  className="text-green-600"
>
  Resend Activation Email
</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(member.id)}
              >
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
        Deactive Team Members
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

export default DeactiveTeammembers;