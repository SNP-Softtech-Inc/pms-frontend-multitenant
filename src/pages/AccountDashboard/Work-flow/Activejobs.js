import React, { useMemo, useState } from "react";
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Checkbox, Button
// } from "@mui/material";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../../../components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { useParams } from "react-router-dom";
import { jobAPI } from "../../../services/api";
import {useToastContext} from '../../../context/ToastContext';
const ActiveJobsList = () => {
  const { accountId } = useParams(); // ✅ HERE
  console.log("accountid for the atcive job,",accountId)
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const {showToast} = useToastContext();

  const [selected, setSelected] = useState([]);

  // ✅ FETCH USING accountId
  const { data = [], isLoading } = useQuery({
    queryKey: ["jobs-by-account", accountId, true],
    enabled: !!accountId,
    queryFn: async () => {
      const res = await jobAPI.getJobsByAccount(accountId, true);
      console.log("active job list",res)
      return res.data.jobList || [];
    },
  });

  const tableData = useMemo(() => {
    return data.map((job) => ({
      id: job.id,
      Name: job.Name || "-",
      JobAssignee: job.JobAssignee?.join(", ") || "-",
      Pipeline: job.Pipeline || "-",
      Stage: job.Stage || "-",
      Account: job.Account?.join(", ") || "-",
      Priority: job.Priority || "-",
      StartDate: job.createdAt
        ? new Date(job.createdAt).toLocaleDateString()
        : "-",
      DueDate: job.updatedAt
        ? new Date(job.updatedAt).toLocaleDateString()
        : "-",
    }));
  }, [data]);

  // DELETE
  // const deleteMutation = useMutation({
  //   mutationFn: async (ids) => {
  //     await Promise.all(ids.map((id) => jobAPI.deleteJob(id)));
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["jobs-by-account", accountId]);
  //     setSelected([]);
  //   },
  // });
  const deleteMutation = useMutation({
  mutationFn: async (ids) => {
    await Promise.all(ids.map((id) => jobAPI.deleteJob(id)));
  },
  onSuccess: () => {
    showToast({
      title: "Job(s) deleted successfully 🗑️",
      type: "success",
    });

    queryClient.invalidateQueries({
      queryKey: ["jobs-by-account", accountId],
    });

    setSelected([]);
  },
  onError: (error) => {
    showToast({
      title: "Failed to delete job ❌",
      type: "error",
    });
  },
});

  // ARCHIVE
//   const archiveMutation = useMutation({
//     mutationFn: async (id) => {
//       await jobAPI.updateJob(id, { active: false });
//     },
//     onSuccess: () => {
//   queryClient.invalidateQueries({
//     queryKey: ["jobs-by-account", accountId],
//     exact: false,
//   });
// }
//   });
const archiveMutation = useMutation({
  mutationFn: async (id) => {
    await jobAPI.updateJob(id, { active: false });
  },
  onSuccess: () => {
    showToast({
      title: "Job archived successfully 📦",
      type: "success",
    });

    queryClient.invalidateQueries({
      queryKey: ["jobs-by-account", accountId],
      exact: false,
    });
  },
  onError: (error) => {
    showToast({
      title: "Failed to archive job ❌",
      type: "error",
    });
  },
});
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (!selected.length) return;

    confirm({
      title: "Delete Jobs",
      description: `Delete ${selected.length} jobs?`,
      onConfirm: () => deleteMutation.mutate(selected),
    });
  };
  return (
  <div className="w-full">

    {/* Header */}
    <h2 className="text-xl font-semibold text-foreground mb-4">
      Active Jobs
    </h2>

    {/* Delete Button */}
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={!selected.length}
      className="mb-4"
    >
      Delete ({selected.length})
    </Button>

    {/* Table Container */}
    <div className="rounded-xl border border-border bg-background overflow-hidden">

      <Table>

        {/* Head */}
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border hover:bg-muted/20">

            <TableHead />

            <TableHead className="text-foreground font-semibold">
              Name
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Assignee
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Pipeline
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Stage
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Account
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Priority
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Start
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Due
            </TableHead>

            <TableHead className="text-foreground font-semibold">
              Action
            </TableHead>

          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>

          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-muted-foreground py-6"
              >
                Loading...
              </TableCell>
            </TableRow>

          ) : tableData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-muted-foreground py-6"
              >
                No jobs found
              </TableCell>
            </TableRow>

          ) : (
            tableData.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/30 transition-colors"
              >

                {/* Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                  />
                </TableCell>

                <TableCell className="text-foreground">
                  {row.Name}
                </TableCell>

                <TableCell className="text-foreground">
                  {row.JobAssignee}
                </TableCell>

                <TableCell className="text-foreground">
                  {row.Pipeline}
                </TableCell>

                <TableCell className="text-foreground">
                  {row.Stage}
                </TableCell>

                <TableCell className="text-foreground">
                  {row.Account}
                </TableCell>

                <TableCell className="text-foreground">
                  {row.Priority}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {row.StartDate}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {row.DueDate}
                </TableCell>

                {/* Action */}
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => archiveMutation.mutate(row.id)}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Archive
                  </Button>
                </TableCell>

              </TableRow>
            ))
          )}

        </TableBody>

      </Table>

    </div>
  </div>
);

  // return (
  //   <>
  //     <h2>Active Jobs</h2>

  //     <Button
  //       color="error"
  //       variant="contained"
  //       onClick={handleDelete}
  //       disabled={!selected.length}
  //       sx={{ mb: 2 }}
  //     >
  //       Delete ({selected.length})
  //     </Button>

  //     <TableContainer >
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell />
  //             <TableCell>Name</TableCell>
  //             <TableCell>Assignee</TableCell>
  //             <TableCell>Pipeline</TableCell>
  //             <TableCell>Stage</TableCell>
  //             <TableCell>Account</TableCell>
  //             <TableCell>Priority</TableCell>
  //             <TableCell>Start</TableCell>
  //             <TableCell>Due</TableCell>
  //             <TableCell>Action</TableCell>
  //           </TableRow>
  //         </TableHead>

  //         <TableBody>
  //           {isLoading ? (
  //             <TableRow>
  //               <TableCell colSpan={10}>Loading...</TableCell>
  //             </TableRow>
  //           ) : tableData.length === 0 ? (
  //             <TableRow>
  //               <TableCell colSpan={10}>No jobs found</TableCell>
  //             </TableRow>
  //           ) : (
  //             tableData.map((row) => (
  //               <TableRow key={row.id}>
  //                 <TableCell>
  //                   <Checkbox
  //                     checked={selected.includes(row.id)}
  //                     onChange={() => handleSelect(row.id)}
  //                   />
  //                 </TableCell>

  //                 <TableCell>{row.Name}</TableCell>
  //                 <TableCell>{row.JobAssignee}</TableCell>
  //                 <TableCell>{row.Pipeline}</TableCell>
  //                 <TableCell>{row.Stage}</TableCell>
  //                 <TableCell>{row.Account}</TableCell>
  //                 <TableCell>{row.Priority}</TableCell>
  //                 <TableCell>{row.StartDate}</TableCell>
  //                 <TableCell>{row.DueDate}</TableCell>

  //                 <TableCell>
  //                   <Button
  //                     size="small"
  //                     color="warning"
  //                     variant="outlined"
  //                     onClick={() => archiveMutation.mutate(row.id)}
  //                   >
  //                     Archive
  //                   </Button>
  //                 </TableCell>
  //               </TableRow>
  //             ))
  //           )}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </>
  // );
};

export default ActiveJobsList;