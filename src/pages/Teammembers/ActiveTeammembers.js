


import React, { useEffect, useState,useMemo } from "react";
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
  const [globalFilter, setGlobalFilter] = useState("");

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
      console.log("Active Team Members:", activeMembers);
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
//   const columns = [
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ row }) => <span>{row.getValue("name")}</span>,
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//       cell: ({ row }) => <span>{row.getValue("email")}</span>,
//     },
//     {
//       accessorKey: "role",
//       header: "Role",
//       cell: ({ row }) => (
//         <Badge variant="default" className="bg-primary">
//           {row.getValue("role")}
//         </Badge>
//       ),
//     },

//     {
//   accessorKey: "status",
//   header: "Status",
//   cell: ({ row }) => {
//     const isActive = row.getValue("status");
// // console.log("Row Status:", isActive);
//     return (
//       <Badge
//         variant={isActive ? "success" : "secondary"}
//         className={
//           isActive
//             ? "bg-green-500 hover:bg-green-600 text-white"
//             : "bg-red-500 hover:bg-red-600 text-white"
//         }
//       >
//         {isActive ? "Active" : "Inactive"}
//       </Badge>
//     );
//   },
// },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => {
//         const member = row.original;
//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
              
//               <DropdownMenuItem onClick={() => handleEdit(member.raw)}>
//                 <Edit className="mr-2 h-4 w-4" />
//                 Edit
//               </DropdownMenuItem>
//              <DropdownMenuItem
//   onClick={() =>
//     handleDeactivate(
//       member.id,
//       member.name
//     )
//   }
//   className="text-orange-600"
// >
//   Deactivate
// </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleDelete(member.id)}>
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];
// ================= COLUMNS =================
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
                onClick={() =>
                  handleDeactivate(member.id, member.name)
                }
                className="text-orange-600"
              >
                Deactivate
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
    {/* Header */}
    <div className="flex items-center justify-between">
      <h6 className="text-lg font-semibold">Active Team Members</h6>
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
      emptyMessage="No active team members found"
      emptyDescription="There are currently no active team members."
      pageSize={10}
    />
  </div>
);
  
};

export default ActiveTeammembers;


// import React, { useEffect, useState } from "react";
// import {
//   CircularProgress,
// } from "@mui/material";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";

// import { Input } from "../../components/ui/input";
// import { Button } from "../../components/ui/button";
// import { Badge } from "../../components/ui/badge";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";

// import {
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";

// import { authAPI } from "../../services/api";
// import { useToastContext } from "../../context/ToastContext";
// import { useConfirm } from "../../components/ConfirmDialogContext";

// const ActiveTeammembers = ({ refresh, onEdit }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [sorting, setSorting] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");

//   const confirm = useConfirm();
//   const { showToast } = useToastContext();

//   const fetchTeamMembers = async () => {
//     try {
//       setLoading(true);

//       const res = await authAPI.getActiveTeamMembers();

//       const activeMembers = res.data.data.map((m) => ({
//         id: m._id,
//         name: `${m.firstName} ${m.lastName}`,
//         email: m.email,
//         role: m.role,
//         status: m.active,
//         raw: m,
//       }));

//       setRows(activeMembers);
//     } catch (error) {
//       console.error(error);

//       showToast({
//         title: "Error",
//         description: "Failed to load team members.",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeamMembers();
//   }, [refresh]);

//   const handleEdit = (row) => {
//     onEdit(row);
//   };

//   const handleDelete = (id, memberName) => {
//     confirm({
//       title: "Delete Team Member",
//       description: `Are you sure you want to delete ${memberName}? This action cannot be undone.`,
//       onConfirm: async () => {
//         try {
//           await authAPI.deleteTeamMember(id);

//           showToast({
//             title: "Deleted",
//             description: "Team member deleted successfully.",
//             type: "success",
//           });

//           fetchTeamMembers();
//         } catch (error) {
//           showToast({
//             title: "Delete Failed",
//             description:
//               error?.response?.data?.message ||
//               "Failed to delete team member.",
//             type: "error",
//           });
//         }
//       },
//     });
//   };

//   const handleDeactivate = (id, memberName) => {
//     confirm({
//       title: "Deactivate Team Member",
//       description: `Are you sure you want to deactivate ${memberName}? The team member will no longer be able to access the system.`,
//       onConfirm: async () => {
//         try {
//           await authAPI.deactivateTeamMember(id);

//           showToast({
//             title: "Success",
//             description: "Team member deactivated successfully.",
//             type: "success",
//           });

//           fetchTeamMembers();
//         } catch (error) {
//           showToast({
//             title: "Error",
//             description:
//               error?.response?.data?.message ||
//               "Failed to deactivate team member.",
//             type: "error",
//           });
//         }
//       },
//     });
//   };

//   const columns = [
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() =>
//             column.toggleSorting(
//               column.getIsSorted() === "asc"
//             )
//           }
//         >
//           Name
//           {column.getIsSorted() === "asc" ? (
//             <ChevronUp className="ml-2 h-4 w-4" />
//           ) : (
//             <ChevronDown className="ml-2 h-4 w-4" />
//           )}
//         </Button>
//       ),
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//     },
//     {
//       accessorKey: "role",
//       header: "Role",
//       cell: ({ row }) => (
//         <Badge className="bg-primary">
//           {row.getValue("role")}
//         </Badge>
//       ),
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const active = row.getValue("status");

//         return (
//           <Badge
//             className={
//               active
//                 ? "bg-green-500 text-white"
//                 : "bg-red-500 text-white"
//             }
//           >
//             {active ? "Active" : "Inactive"}
//           </Badge>
//         );
//       },
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => {
//         const member = row.original;

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="h-8 w-8 p-0"
//               >
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>
//                 Actions
//               </DropdownMenuLabel>

//               <DropdownMenuItem
//                 onClick={() => handleEdit(member.raw)}
//               >
//                 <Edit className="mr-2 h-4 w-4" />
//                 Edit
//               </DropdownMenuItem>

//               <DropdownMenuItem
//                 className="text-orange-600"
//                 onClick={() =>
//                   handleDeactivate(
//                     member.id,
//                     member.name
//                   )
//                 }
//               >
//                 Deactivate
//               </DropdownMenuItem>

//               <DropdownMenuItem
//                 className="text-red-600"
//                 onClick={() =>
//                   handleDelete(
//                     member.id,
//                     member.name
//                   )
//                 }
//               >
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: rows,
//     columns,
//     state: {
//       sorting,
//       globalFilter,
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     globalFilterFn: "includesString",
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h6 className="text-lg font-semibold">
//           Active Team Members
//         </h6>
//       </div>

//       <div className="flex items-center justify-between gap-4">
//         <Input
//           placeholder="Search team members..."
//           value={globalFilter ?? ""}
//           onChange={(e) =>
//             setGlobalFilter(e.target.value)
//           }
//           className="max-w-sm"
//         />

      
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map(
//               (headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map(
//                     (header) => (
//                       <TableHead key={header.id}>
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column
//                                 .columnDef.header,
//                               header.getContext()
//                             )}
//                       </TableHead>
//                     )
//                   )}
//                 </TableRow>
//               )
//             )}
//           </TableHeader>

//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table
//                 .getRowModel()
//                 .rows.map((row) => (
//                   <TableRow key={row.id}>
//                     {row
//                       .getVisibleCells()
//                       .map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef
//                               .cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No team members found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-between">
//           <Select
//           value={`${table.getState().pagination.pageSize}`}
//           onValueChange={(value) =>
//             table.setPageSize(Number(value))
//           }
//         >
//           <SelectTrigger className="w-[120px]">
//             <SelectValue />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="5">5</SelectItem>
//             <SelectItem value="10">10</SelectItem>
//             <SelectItem value="20">20</SelectItem>
//             <SelectItem value="50">50</SelectItem>
//              <SelectItem value="100">100</SelectItem>
//               <SelectItem value="200">200</SelectItem>
//           </SelectContent>
//         </Select>
//         <div className="text-sm text-muted-foreground">
//           Showing{" "}
//           {table.getRowModel().rows.length} of{" "}
//           {rows.length} records
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               table.previousPage()
//             }
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>

//           <span className="text-sm">
//             Page{" "}
//             {table.getState().pagination.pageIndex +
//               1}{" "}
//             of {table.getPageCount()}
//           </span>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActiveTeammembers;