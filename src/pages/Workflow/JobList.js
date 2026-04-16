

import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsAPI, jobAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
import FilterDropdown from "./JobFilter";
import EditJobDrawer from "./EditJobDrawer"
const JobList = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
const [drawerOpen, setDrawerOpen] = useState(false);
const [editJobId, setEditJobId] = useState(null);
  // ✅ NEW STATE (Active / Archived)
  const [isActive, setIsActive] = useState(true);

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
        isActive // 👈 dynamic
      );
console.log("joblist",jobRes)
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

  // =============================
  // UI
  // =============================
  return (
    <div>
      <h2>Job List</h2>

      {/* ACTION BUTTONS */}
      <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
        <Button variant="contained" onClick={handleSelectAll}>
          Select All
        </Button>
        <Button variant="outlined" onClick={handleClearAll}>
          Clear
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
        >
          Delete Selected ({selected.length})
        </Button>
      </div>

      {/* 🔥 TOGGLE + FILTER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <FilterDropdown onFilterChange={setFilters} />
        <ToggleButtonGroup
          value={isActive ? "active" : "archived"}
          exclusive
          onChange={(e, value) => {
            if (value !== null) {
              setIsActive(value === "active");
            }
          }}
          size="small"
        >
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="archived">Archived</ToggleButton>
        </ToggleButtonGroup>

        
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed", minWidth: 1200 }}>
          <TableHead>
           
                        <TableRow>
              <TableCell padding="checkbox" sx={{ width: 50 }} ><Checkbox onClick={handleSelectPage}/></TableCell>

              <TableCell sx={{ width: 250 }}>Name</TableCell>
              <TableCell sx={{ width: 250 }}>Job Assignee</TableCell>
              <TableCell sx={{ width: 250 }}>Pipeline</TableCell>
              <TableCell sx={{ width: 250 }}>Stage</TableCell>
              <TableCell sx={{ width: 250 }}>Account</TableCell>
              <TableCell sx={{ width: 250 }}>
                Client-Facing Status
              </TableCell>
              <TableCell sx={{ width: 100 }}>Priority</TableCell>
              <TableCell sx={{ width: 120 }}>Start Date</TableCell>
              <TableCell sx={{ width: 120 }}>Due Date</TableCell>
              <TableCell sx={{ width: 140 }}>Last Updated</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={11}>Loading...</TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>No jobs found</TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selected.includes(row.id);

                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isSelected}
                    onClick={() => handleSelect(row.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
      checked={isSelected}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect(row.id);
      }}
    />
                      {/* <Checkbox checked={isSelected}  /> */}
                    </TableCell>

                    <TableCell>{row.Name}</TableCell>
                    <TableCell>{row.JobAssignee}</TableCell>
                    <TableCell>{row.Pipeline}</TableCell>
                    <TableCell>{row.Stage}</TableCell>
                    <TableCell>{row.Account}</TableCell>

                    <TableCell>
                      {row.ClientFacingStatus ? (
                        <span style={{ display: "flex", gap: 6 }}>
                          <GoDotFill
                            style={{
                              color:
                                row.ClientFacingStatus.statusColor,
                            }}
                          />
                          {row.ClientFacingStatus.statusName}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>{row.Priority}</TableCell>
                    <TableCell>{row.StartDate}</TableCell>
                    <TableCell>{row.DueDate}</TableCell>
                    <TableCell>{row.updatedAt}</TableCell>
                  <TableCell>
    <Button
      size="small"
      variant="outlined"
      onClick={(e) => {
        e.stopPropagation();
        handleEdit(row.id);
      }}
    >
      Edit
    </Button>
  </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ FIXED PAGINATION */}
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={filteredData.length} // 👈 FIXED
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
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