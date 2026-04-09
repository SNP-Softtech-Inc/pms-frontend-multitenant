import React, { useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, Button
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { useParams } from "react-router-dom";
import { jobAPI } from "../../../services/api";
import { toast } from "react-toastify";
const ArchivedJobsList = () => {
  const { accountId } = useParams(); // ✅ HERE
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [selected, setSelected] = useState([]);

  // ✅ FETCH ARCHIVED
  const { data = [], isLoading } = useQuery({
    queryKey: ["jobs-by-account", accountId, false],
    enabled: !!accountId,
    queryFn: async () => {
      const res = await jobAPI.getJobsByAccountIds(accountId, false);
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
    toast.success("Job(s) deleted successfully 🗑️");

    queryClient.invalidateQueries({
      queryKey: ["jobs-by-account", accountId],
    });

    setSelected([]);
  },
  onError: (error) => {
    toast.error(error?.message || "Failed to delete job ❌");
  },
});

//   // RESTORE
//   const restoreMutation = useMutation({
//     mutationFn: async (id) => {
//       await jobAPI.updateJob(id, { active: true });
//     },
//    onSuccess: () => {
//   queryClient.invalidateQueries({
//     queryKey: ["jobs-by-account", accountId],
//     exact: false,
//   });
// }
//   });

const restoreMutation = useMutation({
  mutationFn: async (id) => {
    await jobAPI.updateJob(id, { active: true });
  },
  onSuccess: () => {
    toast.success("Job restored successfully ✅");

    queryClient.invalidateQueries({
      queryKey: ["jobs-by-account", accountId],
      exact: false,
    });
  },
  onError: (error) => {
    toast.error(error?.message || "Failed to restore job ❌");
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
    <>
      <h2>Archived Jobs</h2>

      <Button
        color="error"
        variant="contained"
        onClick={handleDelete}
        disabled={!selected.length}
        sx={{ mb: 2 }}
      >
        Delete ({selected.length})
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Pipeline</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>No jobs found</TableCell>
              </TableRow>
            ) : (
              tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                    />
                  </TableCell>

                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.JobAssignee}</TableCell>
                  <TableCell>{row.Pipeline}</TableCell>
                  <TableCell>{row.Stage}</TableCell>
                  <TableCell>{row.Account}</TableCell>
                  <TableCell>{row.Priority}</TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      color="success"
                      variant="outlined"
                      onClick={() => restoreMutation.mutate(row.id)}
                    >
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ArchivedJobsList;