

// import React, { useMemo, useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Checkbox,
//   TablePagination,
//   Button,
//   Box,
//   ToggleButton,
//   ToggleButtonGroup,
// } from "@mui/material";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { accountsAPI, jobAPI } from "../../services/api";
// import { useConfirm } from "../../components/ConfirmDialogContext";
// import { toast } from "react-toastify";
// import { GoDotFill } from "react-icons/go";
// import FilterDropdown from "./JobFilter";
// import EditJobDrawer from "./EditJobDrawer"
// const JobList = () => {
//   const queryClient = useQueryClient();
//   const confirm = useConfirm();

//   const [filters, setFilters] = useState({});
//   const [selected, setSelected] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
// const [drawerOpen, setDrawerOpen] = useState(false);
// const [editJobId, setEditJobId] = useState(null);
//   // ✅ NEW STATE (Active / Archived)
//   const [isActive, setIsActive] = useState(true);

//   // =============================
//   // FETCH DATA
//   // =============================
//   const { data = [], isLoading } = useQuery({
//     queryKey: ["jobs-all", isActive],
//     queryFn: async () => {
//       const accRes = await accountsAPI.getAccountsList();
//       const accounts = accRes.data.accountlist || [];

//       if (accounts.length === 0) return [];

//       const accountIds = accounts.map((acc) => acc._id).join(",");

//       const jobRes = await jobAPI.getJobsByAccountIds(
//         accountIds,
//         isActive // 👈 dynamic
//       );
// console.log("joblist",jobRes)
//       return jobRes.data.jobList || [];
//     },
//   });

//   // =============================
//   // RESET PAGE ON FILTER/TOGGLE
//   // =============================
//   useEffect(() => {
//     setPage(0);
//     setSelected([]);
//   }, [filters, isActive]);

//   // =============================
//   // FORMAT DATA
//   // =============================
//   const tableData = useMemo(() => {
//     return data.map((job) => ({
//       id: job.id,
//       Name: job.Name || "-",
//       JobAssignee: job.JobAssignee?.join(", ") || "-",
//       Pipeline: job.Pipeline || "-",
//       Stage: job.Stage?.join(", ") || "-",
//       Account: job.Account?.join(", ") || "-",
//       Priority: job.Priority || "-",
//       ClientFacingStatus: job.visibilityForClient
//         ? job.ClientFacingStatus
//         : null,
//       StartDate: job.createdAt
//         ? new Date(job.createdAt).toLocaleDateString()
//         : "-",
//       DueDate: job.updatedAt
//         ? new Date(job.updatedAt).toLocaleDateString()
//         : "-",
//       updatedAt: job.updatedAt
//         ? new Date(job.updatedAt).toLocaleDateString()
//         : "-",
//     }));
//   }, [data]);

//   // =============================
//   // FILTERING
//   // =============================
//   const filteredData = useMemo(() => {
//     return tableData.filter((job) => {
//       if (
//         filters.jobAssignees?.length &&
//         !filters.jobAssignees.some((a) =>
//           job.JobAssignee?.includes(a)
//         )
//       ) return false;

//       if (
//         filters.clientStatus?.length &&
//         !filters.clientStatus.includes(
//           job.ClientFacingStatus?.statusName
//         )
//       ) return false;

//       if (
//         filters.accountName &&
//         !job.Account?.toLowerCase().includes(
//           filters.accountName.toLowerCase()
//         )
//       ) return false;

//       if (filters.priority && job.Priority !== filters.priority)
//         return false;

//       if (filters.pipelineStages) {
//         const match = Object.entries(filters.pipelineStages).some(
//           ([pipeline, stages]) =>
//             job.Pipeline === pipeline &&
//             stages.includes(job.Stage)
//         );

//         if (Object.keys(filters.pipelineStages).length && !match)
//           return false;
//       }

//       return true;
//     });
//   }, [tableData, filters]);

//   // =============================
//   // PAGINATION
//   // =============================
//   const paginatedData = filteredData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const pageIds = paginatedData.map((row) => row.id);


//   // =============================
//   // SELECTION
//   // =============================
//   const handleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id)
//         ? prev.filter((item) => item !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSelectPage = (checked) => {
//     if (checked) {
//       setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
//     } else {
//       setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
//     }
//   };

//   const handleSelectAll = () => {
//     setSelected(filteredData.map((row) => row.id));
//   };

//   const handleClearAll = () => setSelected([]);

//   // =============================
//   // DELETE
//   // =============================
//   const deleteMutation = useMutation({
//     mutationFn: async (ids) => {
//       await Promise.all(ids.map((id) => jobAPI.deleteJob(id)));
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["jobs-all"]);
//       toast.success("Jobs deleted successfully");
//       setSelected([]);
//     },
//   });

//   const handleBulkDelete = () => {
//     if (selected.length === 0) return;

//     confirm({
//       title: "Delete Jobs",
//       description: `Are you sure you want to delete ${selected.length} jobs?`,
//       onConfirm: () => deleteMutation.mutate(selected),
//     });
//   };
// const handleEdit = (id) => {
//   setEditJobId(id);
//   setDrawerOpen(true);
// };

//   // =============================
//   // UI
//   // =============================
//   return (
//     <div>
//       <h2>Job List</h2>

//       {/* ACTION BUTTONS */}
//       <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
//         <Button variant="contained" onClick={handleSelectAll}>
//           Select All
//         </Button>
//         <Button variant="outlined" onClick={handleClearAll}>
//           Clear
//         </Button>
//         <Button
//           variant="contained"
//           color="error"
//           onClick={handleBulkDelete}
//           disabled={selected.length === 0}
//         >
//           Delete Selected ({selected.length})
//         </Button>
//       </div>

//       {/* 🔥 TOGGLE + FILTER */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//         }}
//       >
//         <FilterDropdown onFilterChange={setFilters} />
//         <ToggleButtonGroup
//           value={isActive ? "active" : "archived"}
//           exclusive
//           onChange={(e, value) => {
//             if (value !== null) {
//               setIsActive(value === "active");
//             }
//           }}
//           size="small"
//         >
//           <ToggleButton value="active">Active</ToggleButton>
//           <ToggleButton value="archived">Archived</ToggleButton>
//         </ToggleButtonGroup>

        
//       </Box>

//       {/* TABLE */}
//       <TableContainer component={Paper}>
//         <Table sx={{ tableLayout: "fixed", minWidth: 1200 }}>
//           <TableHead>
           
//                         <TableRow>
//               <TableCell padding="checkbox" sx={{ width: 50 }} ><Checkbox onClick={handleSelectPage}/></TableCell>

//               <TableCell sx={{ width: 250 }}>Name</TableCell>
//               <TableCell sx={{ width: 250 }}>Job Assignee</TableCell>
//               <TableCell sx={{ width: 250 }}>Pipeline</TableCell>
//               <TableCell sx={{ width: 250 }}>Stage</TableCell>
//               <TableCell sx={{ width: 250 }}>Account</TableCell>
//               <TableCell sx={{ width: 250 }}>
//                 Client-Facing Status
//               </TableCell>
//               <TableCell sx={{ width: 100 }}>Priority</TableCell>
//               <TableCell sx={{ width: 120 }}>Start Date</TableCell>
//               <TableCell sx={{ width: 120 }}>Due Date</TableCell>
//               <TableCell sx={{ width: 140 }}>Last Updated</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan={11}>Loading...</TableCell>
//               </TableRow>
//             ) : paginatedData.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={11}>No jobs found</TableCell>
//               </TableRow>
//             ) : (
//               paginatedData.map((row) => {
//                 const isSelected = selected.includes(row.id);

//                 return (
//                   <TableRow
//                     key={row.id}
//                     hover
//                     selected={isSelected}
//                     onClick={() => handleSelect(row.id)}
//                   >
//                     <TableCell padding="checkbox">
//                       <Checkbox
//       checked={isSelected}
//       onClick={(e) => {
//         e.stopPropagation();
//         handleSelect(row.id);
//       }}
//     />
//                       {/* <Checkbox checked={isSelected}  /> */}
//                     </TableCell>

//                     <TableCell>{row.Name}</TableCell>
//                     <TableCell>{row.JobAssignee}</TableCell>
//                     <TableCell>{row.Pipeline}</TableCell>
//                     <TableCell>{row.Stage}</TableCell>
//                     <TableCell>{row.Account}</TableCell>

//                     <TableCell>
//                       {row.ClientFacingStatus ? (
//                         <span style={{ display: "flex", gap: 6 }}>
//                           <GoDotFill
//                             style={{
//                               color:
//                                 row.ClientFacingStatus.statusColor,
//                             }}
//                           />
//                           {row.ClientFacingStatus.statusName}
//                         </span>
//                       ) : (
//                         "—"
//                       )}
//                     </TableCell>

//                     <TableCell>{row.Priority}</TableCell>
//                     <TableCell>{row.StartDate}</TableCell>
//                     <TableCell>{row.DueDate}</TableCell>
//                     <TableCell>{row.updatedAt}</TableCell>
//                   <TableCell>
//     <Button
//       size="small"
//       variant="outlined"
//       onClick={(e) => {
//         e.stopPropagation();
//         handleEdit(row.id);
//       }}
//     >
//       Edit
//     </Button>
//   </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* ✅ FIXED PAGINATION */}
//       <TablePagination
//         rowsPerPageOptions={[25, 50, 100]}
//         component="div"
//         count={filteredData.length} // 👈 FIXED
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={(e, newPage) => setPage(newPage)}
//         onRowsPerPageChange={(e) => {
//           setRowsPerPage(parseInt(e.target.value, 10));
//           setPage(0);
//         }}
//       />
//       <EditJobDrawer
//   open={drawerOpen}
//   onClose={() => {
//     setDrawerOpen(false);
//     setEditJobId(null);
//   }}
//   jobId={editJobId}
// />
//     </div>
//   );
// };

// export default JobList;



import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsAPI, jobAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
import { MoreVertical, Archive, Trash2, X, Loader2 } from "lucide-react";
import FilterDropdown from "./JobFilter";
import EditJobDrawer from "./EditJobDrawer";

// shadcn/ui components
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../components/ui/toggle-group";

const JobList = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  // =============================
  // FETCH DATA
  // =============================
  const { data = [], isLoading } = useQuery({
    queryKey: ["jobs-all", isActive],
    queryFn: async () => {
      const accRes = await accountsAPI.getAccountsList();
      const accounts = accRes.data.accountlist || [];

      if (accounts.length === 0) return [];

      const accountIds = accounts.map((acc) => acc._id).join(",");

      const jobRes = await jobAPI.getJobsByAccountIds(
        accountIds,
        isActive
      );
      console.log("joblist", jobRes);
      return jobRes.data.jobList || [];
    },
  });

  // =============================
  // RESET PAGE ON FILTER/TOGGLE
  // =============================
  useEffect(() => {
    setPage(0);
    setSelected([]);
  }, [filters, isActive]);

  // =============================
  // FORMAT DATA
  // =============================
  const tableData = useMemo(() => {
    return data.map((job) => ({
      id: job.id,
      Name: job.Name || "-",
      JobAssignee: job.JobAssignee?.join(", ") || "-",
      Pipeline: job.Pipeline || "-",
      Stage: job.Stage?.join(", ") || "-",
      Account: job.Account?.join(", ") || "-",
      Priority: job.Priority || "-",
      ClientFacingStatus: job.visibilityForClient
        ? job.ClientFacingStatus
        : null,
      StartDate: job.createdAt
        ? new Date(job.createdAt).toLocaleDateString()
        : "-",
      DueDate: job.updatedAt
        ? new Date(job.updatedAt).toLocaleDateString()
        : "-",
      updatedAt: job.updatedAt
        ? new Date(job.updatedAt).toLocaleDateString()
        : "-",
      visibilityForClient: job.visibilityForClient,
      clientfacingstatus: job.ClientFacingStatus,
    }));
  }, [data]);

  // =============================
  // FILTERING
  // =============================
  const filteredData = useMemo(() => {
    return tableData.filter((job) => {
      if (
        filters.jobAssignees?.length &&
        !filters.jobAssignees.some((a) =>
          job.JobAssignee?.includes(a)
        )
      ) return false;

      if (
        filters.clientStatus?.length &&
        !filters.clientStatus.includes(
          job.ClientFacingStatus?.statusName
        )
      ) return false;

      if (
        filters.accountName &&
        !job.Account?.toLowerCase().includes(
          filters.accountName.toLowerCase()
        )
      ) return false;

      if (filters.priority && job.Priority !== filters.priority)
        return false;

      if (filters.pipelineStages) {
        const match = Object.entries(filters.pipelineStages).some(
          ([pipeline, stages]) =>
            job.Pipeline === pipeline &&
            stages.includes(job.Stage)
        );

        if (Object.keys(filters.pipelineStages).length && !match)
          return false;
      }

      return true;
    });
  }, [tableData, filters]);

  // =============================
  // PAGINATION
  // =============================
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const pageIds = paginatedData.map((row) => row.id);

  // =============================
  // SELECTION
  // =============================
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectPage = (checked) => {
    if (checked) {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectAll = () => {
    setSelected(filteredData.map((row) => row.id));
  };

  const handleClearAll = () => setSelected([]);

  // =============================
  // DELETE
  // =============================
  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => jobAPI.deleteJob(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs-all"]);
      toast.success("Jobs deleted successfully");
      setSelected([]);
    },
  });

  const handleBulkDelete = () => {
    if (selected.length === 0) return;

    confirm({
      title: "Delete Jobs",
      description: `Are you sure you want to delete ${selected.length} jobs?`,
      onConfirm: () => deleteMutation.mutate(selected),
    });
  };

  const handleEdit = (id) => {
    setEditJobId(id);
    setDrawerOpen(true);
  };

  const handleArchive = () => {
    // Archive functionality - you can implement this based on your API
    toast.info("Archive functionality to be implemented");
  };

  const handleDeleteJob = () => {
    if (selected.length === 0) return;
    handleBulkDelete();
  };

  // Priority classes for styling
  const PRIORITY_CLASSES = {
    urgent: "bg-zinc-950 text-white",
    high: "bg-red-500 text-white",
    medium: "bg-amber-500 text-white",
    low: "bg-emerald-500 text-white",
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Job List</h2>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" onClick={handleSelectAll} size="sm">
          Select All
        </Button>
        <Button variant="outline" onClick={handleClearAll} size="sm">
          Clear
        </Button>
        <Button
          variant="destructive"
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
          size="sm"
        >
          Delete Selected ({selected.length})
        </Button>
      </div>

      {/* TOGGLE + FILTER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterDropdown onFilterChange={setFilters} />
        <ToggleGroup
          type="single"
          value={isActive ? "active" : "archived"}
          onValueChange={(value) => {
            if (value) {
              setIsActive(value === "active");
            }
          }}
          size="sm"
          className="border rounded-md"
        >
          <ToggleGroupItem value="active" aria-label="Active Jobs" className="px-4">
            Active
          </ToggleGroupItem>
          <ToggleGroupItem value="archived" aria-label="Archived Jobs" className="px-4">
            Archived
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={pageIds.length > 0 && pageIds.every(id => selected.includes(id))}
                  onCheckedChange={(checked) => handleSelectPage(checked === true)}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[200px]">Job Assignee</TableHead>
              <TableHead className="min-w-[200px]">Pipeline</TableHead>
              <TableHead className="min-w-[200px]">Stage</TableHead>
              <TableHead className="min-w-[200px]">Account</TableHead>
              <TableHead className="min-w-[200px]">Client-Facing Status</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[120px]">Start Date</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
              <TableHead className="w-[140px]">Last Updated</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="h-64 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-64 text-center text-muted-foreground">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selected.includes(row.id);
                const priorityClass = row.Priority !== "-" 
                  ? PRIORITY_CLASSES[row.Priority?.toLowerCase()] 
                  : null;

                return (
                  <TableRow
                    key={row.id}
                    className={`group hover:bg-muted/50 cursor-pointer ${isSelected ? "bg-muted/30" : ""}`}
                    onClick={() => handleSelect(row.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      <button
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left truncate max-w-[180px] block"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(row.id);
                        }}
                      >
                        {row.Name}
                      </button>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-foreground/80 truncate block max-w-[180px]">
                        {row.JobAssignee}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-foreground/80">
                        {row.Pipeline}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-foreground/80">
                        {row.Stage}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-foreground/80 truncate block max-w-[180px]">
                        {row.Account}
                      </span>
                    </TableCell>

                    <TableCell>
                      {row.ClientFacingStatus ? (
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: row.ClientFacingStatus.statusColor }}
                          />
                          {row.ClientFacingStatus.statusName}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {row.Priority !== "-" ? (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${priorityClass}`}>
                          {row.Priority}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground">{row.StartDate}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground">{row.DueDate}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground">{row.updatedAt}</span>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu
                        open={openMenuId === row.id}
                        onOpenChange={(open) => setOpenMenuId(open ? row.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(row.id);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive();
                            }}
                          >
                            <Archive className="h-3.5 w-3.5 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              confirm({
                                title: "Delete Job",
                                description: `Are you sure you want to delete ${row.Name}?`,
                                onConfirm: () => deleteMutation.mutate([row.id]),
                              });
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {filteredData.length} total jobs
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
            >
              {[25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage) || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * rowsPerPage >= filteredData.length}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Job Drawer */}
      <EditJobDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditJobId(null);
        }}
        jobId={editJobId}
      />
    </div>
  );
};

export default JobList;