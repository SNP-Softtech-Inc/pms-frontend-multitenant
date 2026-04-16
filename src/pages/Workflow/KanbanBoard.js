import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsAPI, jobAPI } from "../../services/api";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MoveAutomationDrawer from "./MoveAutomationDrawer";
import JobDrawer from "./JobDrawer";
import EditJobDrawer from "./EditJobDrawer";
import { useConfirm } from "../../components/ConfirmDialogContext";

dayjs.extend(relativeTime);

// 🎨 Column
const Column = styled(Box)(({ theme }) => ({
  minWidth: 320,
  height: "75vh",
  display: "flex",
  flexDirection: "column",
  background: "#f8fafc",
  borderRadius: 12,
  padding: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
}));

// 🎨 Job Card
const JobCard = styled(Paper)(({ isDragging }) => ({
  padding: 16,
  marginBottom: 12,
  borderRadius: 12,
  cursor: "grab",
  transition: "0.2s",
  background: isDragging ? "#e3f2fd" : "#ffffff",
  boxShadow: isDragging
    ? "0 8px 20px rgba(0,0,0,0.15)"
    : "0 2px 6px rgba(0,0,0,0.05)",
}));

const KanbanBoard = ({ pipeline, onBack, isActive }) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [jobDrawerOpen, setJobDrawerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [hoveredJobId, setHoveredJobId] = useState(null);
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState(null);
  const handleEditOpen = (jobId) => {
    setEditJobId(jobId);
    setDrawerOpen(true);
  };

  // ✅ Fetch Jobs
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["pipeline-jobs", isActive, pipeline._id],
    queryFn: async () => {
      const accRes = await accountsAPI.getAccountsList();
      const accounts = accRes.data.accountlist || [];

      if (!accounts.length) return [];

      const accountIds = accounts.map((a) => a._id).join(",");
      const jobRes = await jobAPI.pipelineJoblist(accountIds, isActive);
      console.log("job details in pipeline", jobRes);
      return jobRes.data.jobList || [];
    },
  });

  // ✅ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (jobId) => jobAPI.deleteJob(jobId),

    onSuccess: () => {
      toast.success("Job deleted");
      queryClient.invalidateQueries(["pipeline-jobs", isActive, pipeline._id]);
    },

    onError: () => {
      toast.error("Delete failed");
    },
  });

  // ✅ Update Stage Mutation
  const updateStageMutation = useMutation({
    mutationFn: ({ jobId, stageId }) =>
      jobAPI.updateJobStage(jobId, { stageId }),

    onMutate: async ({ jobId, stageId }) => {
      await queryClient.cancelQueries([
        "pipeline-jobs",
        isActive,
        pipeline._id,
      ]);

      const prevData = queryClient.getQueryData([
        "pipeline-jobs",
        isActive,
        pipeline._id,
      ]);

      const stageObj = pipeline.stages.find((s) => s._id === stageId);

      queryClient.setQueryData(
        ["pipeline-jobs", isActive, pipeline._id],
        (old = []) =>
          old.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  Stage: {
                    id: stageId,
                    name: stageObj?.name,
                  },
                }
              : job,
          ),
      );

      return { prevData };
    },

    onSuccess: (_, variables) => {
      const stageObj = pipeline.stages.find((s) => s._id === variables.stageId);

      toast.success(`Moved to "${stageObj?.name}"`);
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["pipeline-jobs", isActive, pipeline._id],
        context?.prevData,
      );
      toast.error("Failed to update");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["pipeline-jobs", isActive, pipeline._id]);
    },
  });

  // ✅ Filter & Group
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => job.PipelineId === pipeline._id);
  }, [jobs, pipeline]);

  const groupedJobs = useMemo(() => {
    const grouped = {};
    pipeline.stages.forEach((stage) => (grouped[stage._id] = []));

    filteredJobs.forEach((job) => {
      const stageId = job.Stage?.id;
      if (stageId && grouped[stageId]) {
        grouped[stageId].push(job);
      }
    });

    return grouped;
  }, [filteredJobs, pipeline]);

  // const onDragEnd = (result) => {
  //   const { source, destination, draggableId } = result;
  //   if (!destination) return;
  //   if (source.droppableId === destination.droppableId) return;

  //   updateStageMutation.mutate({
  //     jobId: draggableId,
  //     stageId: destination.droppableId,
  //   });
  // };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const targetStage = pipeline.stages.find(
      (s) => s._id === destination.droppableId,
    );

    // ✅ If stage has automations → open drawer
    if (targetStage?.automations?.length > 0) {
      setSelectedAutomationData({
        jobId: draggableId,
        stageId: destination.droppableId,
        automations: targetStage.automations,
      });

      setAutomationDrawerOpen(true);
    } else {
      // ✅ No automation → direct move
      updateStageMutation.mutate({
        jobId: draggableId,
        stageId: destination.droppableId,
      });
    }
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    const cleanText = text.replace(/<[^>]+>/g, "");
    return cleanText.length > limit
      ? cleanText.slice(0, limit) + "..."
      : cleanText;
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3}>
        <Typography
          sx={{
            cursor: "pointer",
            mb: 1,
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
          onClick={onBack}
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </Typography>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold">
            {pipeline.pipelineName}
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setJobDrawerOpen(true)}
          >
            Add Job
          </Button>
        </Box>
      </Box>

      {/* Board */}

      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" gap={2} overflow="auto">
          {pipeline.stages.map((stage) => (
            <Droppable droppableId={stage._id} key={stage._id}>
              {(provided) => (
                <Column ref={provided.innerRef} {...provided.droppableProps}>
                  {/* Stage Header */}
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography fontWeight="bold">{stage.name}</Typography>
                    <Chip
                      label={groupedJobs[stage._id]?.length || 0}
                      size="small"
                    />
                  </Box>

                  {/* Jobs */}
                  <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                    {groupedJobs[stage._id]?.map((job, index) => {
                      // ✅ Priority config per job
                      const priorityConfig = {
                        Urgent: {
                          label: "Urgent",
                          color: "#0E0402",
                          textColor: "#fff",
                        },
                        High: {
                          label: "High",
                          color: "#fe676e",
                          textColor: "#fff",
                        },
                        Medium: {
                          label: "Medium",
                          color: "#FFC300",
                          textColor: "#000",
                        },
                        Low: {
                          label: "Low",
                          color: "#56c288",
                          textColor: "#fff",
                        },
                      };

                      const priority = priorityConfig[job.Priority] || {};

                      return (
                        <Draggable
                          key={job.id}
                          draggableId={job.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <JobCard
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                              onClick={() => handleEditOpen(job.id)}
                              onMouseEnter={() => setHoveredJobId(job.id)}
                              onMouseLeave={() => setHoveredJobId(null)}
                              sx={{
                                position: "relative",
                                borderLeft: `4px solid ${priority.color || "#ccc"}`, // 🎯 pro UI
                              }}
                            >
                              {/* DELETE */}
                              {hoveredJobId === job.id && (
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      position: "absolute",
                                      top: 6,
                                      right: 6,
                                      color: "error.main",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      confirm({
                                        title: "Delete Job",
                                        description:
                                          "Are you sure you want to delete this job?",
                                        onConfirm: () =>
                                          deleteMutation.mutate(job.id),
                                      });
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* CONTENT */}
                              <Typography fontWeight="bold">
                                {/* {job.Name}
                                 */}
                                  {truncateText(job.Name, 20)}
                              </Typography>

                              <Typography variant="body2">
                                {job.Account?.join(", ")}
                              </Typography>

                              <Typography variant="caption">
                                👤 {job.JobAssignee?.join(", ") || "Unassigned"}
                              </Typography>

                              <Typography variant="caption" display="block">
                                {truncateText(job.Description, 20)}
                              </Typography>

                              {/* ✅ Priority Chip */}
                              <Chip
                                label={priority.label || job.Priority}
                                size="small"
                                sx={{
                                  mt: 1,
                                  backgroundColor: priority.color || "#e0e0e0",
                                  color: priority.textColor || "#000",
                                  fontWeight: 600,
                                }}
                              />

                              <Typography variant="caption" display="block">
                                📅 {dayjs(job.StartDate).format("DD MMM")}
                              </Typography>

                              <Typography variant="caption" display="block">
                                ⏳ {dayjs(job.DueDate).format("DD MMM")}
                              </Typography>

                              <Typography variant="caption" display="block">
                                🔄 {dayjs(job.updatedAt).fromNow()}
                              </Typography>
                            </JobCard>
                          )}
                        </Draggable>
                      );
                    })}

                    {provided.placeholder}
                  </Box>
                </Column>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
      {/* Drawers */}
      <JobDrawer open={jobDrawerOpen} onClose={() => setJobDrawerOpen(false)} selectedPipeline={pipeline} />

      <EditJobDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditJobId(null);
        }}
        jobId={editJobId}
      />
      <MoveAutomationDrawer
        open={automationDrawerOpen}
        onClose={() => setAutomationDrawerOpen(false)}
        automations={selectedAutomationData?.automations || []}
        jobId={selectedAutomationData?.jobId}
        stageId={selectedAutomationData?.stageId}
      />
    </Box>
  );
};

export default KanbanBoard;
