import React, { useEffect, useState ,useMemo} from "react";
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
import { useToastContext } from "../../context/ToastContext";
import { Label } from "../../components/ui/label";
const DeactiveTeammembers = ({ refresh, onEdit }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm();
  const { showToast } = useToastContext();
    const [globalFilter, setGlobalFilter] = useState("");
  
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
      console.log("Inactive Team Members:", inactiveMembers);
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
          showToast({
            title: "Activation email resent",
            description: res.data.message,
            type: "success",
          });
        } catch (error) {
          console.error(error);

          // Optional: show toast here
          showToast({
            title: "Failed to resend activation email",
            description:
              error?.response?.data?.message ||
              "Failed to resend activation email.",
            type: "error",
          });
        }
      },
    });
  };
  const handleEdit = (row) => {
    onEdit(row);
  };

  // const columns = [
  //   {
  //     accessorKey: "name",
  //     header: "Name",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //   },
  //   {
  //     accessorKey: "role",
  //     header: "Role",
  //     cell: ({ row }) => (
  //       <Badge variant="default" className="bg-primary">
  //         {row.getValue("role")}
  //       </Badge>
  //     ),
  //   },

  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => {
  //       const isActive = row.getValue("status");
  //       return (
  //         <Badge
  //           variant={isActive ? "success" : "secondary"}
  //           className={
  //             isActive
  //               ? "bg-green-500 hover:bg-green-600 text-white"
  //               : "bg-red-500 hover:bg-red-600 text-white"
  //           }
  //         >
  //           {isActive ? "Active" : "Inactive"}
  //         </Badge>
  //       );
  //     },
  //   },
  //   {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       const member = row.original;

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>

  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>

  //             <DropdownMenuItem onClick={() => handleEdit(member.raw)}>
  //               <Edit className="mr-2 h-4 w-4" />
  //               Edit
  //             </DropdownMenuItem>
              // <DropdownMenuItem
              //   onClick={() => handleResendActivation(member.id, member.name)}
              //   className="text-green-600"
              // >
              //   Resend Activation Email
              // </DropdownMenuItem>
  //             <DropdownMenuItem onClick={() => handleDelete(member.id)}>
  //               <Trash2 className="mr-2 h-4 w-4" />
  //               Delete
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
  // ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 220,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-foreground truncate block max-w-[200px]">
            {getValue() || (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 240,
        cell: ({ getValue }) => (
          <span className="text-sm text-foreground/80 truncate block max-w-[220px]">
            {getValue() || (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 140,
        cell: ({ getValue }) => {
          const role = getValue();
  
          if (!role) {
            return (
              <span className="text-muted-foreground text-xs">—</span>
            );
          }
  
          let color =
            "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300";
  
          switch (role) {
            case "Admin":
              color =
                "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300";
              break;
  
            case "Manager":
              color =
                "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300";
              break;
  
            case "Employee":
              color =
                "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300";
              break;
  
            default:
              break;
          }
  
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${color}`}
            >
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: ({ getValue }) => {
          const isActive = getValue();
  
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 70,
        enableSorting: false,
        cell: ({ row }) => {
          const member = row.original;
  
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                >
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
                onClick={() => handleResendActivation(member.id, member.name)}
                className="text-green-600"
              >
                Resend Activation Email
              </DropdownMenuItem>
  
                <DropdownMenuItem
                  onClick={() => handleDelete(member.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

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
        <h6 className="text-lg font-semibold">Deactive Team Members</h6>
      </div>

{/* Toolbar */}
    <DataTableToolbar
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
    />

    {/* Table */}
    <DataTable
      columns={columns}
      data={rows}
      loading={loading}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      getRowId={(row) => row.id}
      emptyMessage="No deactive team members found"
      emptyDescription="There are currently no deactive team members."
      pageSize={10}
    />
    </div>
  );
};

export default DeactiveTeammembers;
