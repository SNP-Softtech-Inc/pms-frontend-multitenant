import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import { styled } from "@mui/system";

import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobAPI, templateAPI } from "../../../services/api";
import { useParams } from "react-router-dom";

import EditJobDrawer from "../../Workflow/EditJobDrawer";
import MoveAutomationDrawer from "../../Workflow/MoveAutomationDrawer";
import dayjs from "dayjs";
import { useConfirm } from "../../../components/ConfirmDialogContext";
dayjs.extend(require("dayjs/plugin/relativeTime"));

// ================= UI =================
const Column = styled(Box)(({ theme }) => ({
  minWidth: 320,
  height: "75vh",
  display: "flex",
  flexDirection: "column",
  background: "#f8fafc",
  borderRadius: 12,
  padding: theme.spacing(2),
}));

const JobCard = styled(Paper)(({ isDragging }) => ({
  padding: 14,
  marginBottom: 10,
  borderRadius: 10,
  background: isDragging ? "#e3f2fd" : "#fff",
}));

// ================= COMPONENT =================

const AccountKanbanBoard = ({ isActive = true }) => {
  const { accountId } = useParams();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  // ================= DRAWERS =================

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [hoveredJobId, setHoveredJobId] = useState(null);
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState(null);
  const handleEditOpen = (jobId) => {
    setEditJobId(jobId);
    setDrawerOpen(true);
  };

  // ================= FETCH PIPELINES =================
  const { data: pipelines = [], isLoading } = useQuery({
    queryKey: ["pipeline-jobs", accountId, isActive],
    queryFn: async () => {
      const res = await jobAPI.pipelineJobsByAccount(accountId, isActive);
      console.log("pipeline list by account id jobs",res)
      return res?.data?.pipelines || [];
    },
    enabled: !!accountId,
  });

  // ================= FETCH PIPELINE META =================
  const [pipelineMeta, setPipelineMeta] = useState({});

  useEffect(() => {
    const fetchMeta = async () => {
      const map = {};

      await Promise.all(
        pipelines.map(async (p) => {
          const res = await templateAPI.getPipelineById(p.pipelineId);
          map[p.pipelineId] = res?.data?.pipeline;
        }),
      );

      setPipelineMeta(map);
    };

    if (pipelines.length > 0) fetchMeta();
  }, [pipelines]);

  // ================= UPDATE STAGE =================
  const updateStageMutation = useMutation({
    mutationFn: ({ jobId, stageId }) =>
      jobAPI.updateJobStage(jobId, { stageId }),

    onMutate: async ({ jobId, stageId }) => {
      await queryClient.cancelQueries(["pipeline-jobs", accountId, isActive]);

      const prevData = queryClient.getQueryData([
        "pipeline-jobs",
        accountId,
        isActive,
      ]);

      queryClient.setQueryData(
        ["pipeline-jobs", accountId, isActive],
        (old = []) =>
          old.map((p) => ({
            ...p,
            jobs: p.jobs.map((job) =>
              job.id === jobId ? { ...job, StageId: stageId } : job,
            ),
          })),
      );

      return { prevData };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["pipeline-jobs", accountId, isActive],
        context?.prevData,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(["pipeline-jobs", accountId, isActive]);
    },
  });

  // ================= DELETE JOB =================
  const deleteMutation = useMutation({
    mutationFn: (jobId) => jobAPI.deleteJob(jobId),
    onSuccess: () => {
      toast.success("Job deleted");
      queryClient.invalidateQueries(["pipeline-jobs", accountId]);
    },
  });

  // ================= GROUP JOBS =================
  const grouped = useMemo(() => {
    const result = {};

    pipelines.forEach((p) => {
      const stages = pipelineMeta?.[p.pipelineId]?.stages || [];

      result[p.pipelineId] = {};

      stages.forEach((s) => {
        result[p.pipelineId][s._id] = [];
      });

      p.jobs.forEach((job) => {
        const stageId = job.StageId;
        if (result[p.pipelineId]?.[stageId]) {
          result[p.pipelineId][stageId].push(job);
        }
      });
    });

    return result;
  }, [pipelines, pipelineMeta]);

  // ================= DRAG =================
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    // Find pipeline + stage
    const pipelineId = Object.keys(pipelineMeta || {}).find((pid) =>
      pipelineMeta?.[pid]?.stages?.some(
        (s) => s._id === destination.droppableId,
      ),
    );

    const targetStage = pipelineMeta?.[pipelineId]?.stages?.find(
      (s) => s._id === destination.droppableId,
    );

    // ✅ If stage has automations → open drawer instead of moving
    if (targetStage?.automations?.length > 0) {
      setSelectedAutomationData({
        jobId: draggableId,
        stageId: destination.droppableId,
        automations: targetStage.automations,
      });

      setAutomationDrawerOpen(true);
      return;
    }

    // ✅ No automation → direct move
    updateStageMutation.mutate({
      jobId: draggableId,
      stageId: destination.droppableId,
    });
  };

  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    const cleanText = text.replace(/<[^>]+>/g, "");
    return cleanText.length > limit
      ? cleanText.slice(0, limit) + "..."
      : cleanText;
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // ================= PRIORITY STYLE =================
  const priorityConfig = {
    Urgent: { color: "#0E0402", text: "#fff" },
    High: { color: "#fe676e", text: "#fff" },
    Medium: { color: "#FFC300", text: "#fff" },
    Low: { color: "#56c288", text: "#fff" },
  };

  return (
    <Box p={3}>
      {/* HEADER */}

      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" flexDirection="column" gap={4}>
        {/* <Box display="flex" gap={3} overflow="auto"> */}
          {pipelines.map((p) => {
            const stages = pipelineMeta?.[p.pipelineId]?.stages || [];

            return (
              <Box key={p.pipelineId} mb={5}>
                {/* PIPELINE TITLE */}
                <Typography fontWeight="bold" mb={2}>
                  {p.pipelineName}
                </Typography>

                <Box display="flex" gap={2} overflow="auto">
                  {stages.map((stage) => (
                    <Droppable droppableId={stage._id} key={stage._id}>
                      {(provided) => (
                        <Column
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {/* STAGE HEADER */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={2}
                          >
                            <Typography fontWeight="bold">
                              {stage.name}
                            </Typography>

                            <Chip
                              label={
                                grouped?.[p.pipelineId]?.[stage._id]?.length ||
                                0
                              }
                              size="small"
                            />
                          </Box>

                          {/* JOBS */}
                          <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                            {(grouped?.[p.pipelineId]?.[stage._id] || []).map(
                              (job, index) => {
                                const priority =
                                  priorityConfig[job.Priority] || {};

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
                                        onMouseEnter={() =>
                                          setHoveredJobId(job.id)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredJobId(null)
                                        }
                                        sx={{
                                          position: "relative",
                                          borderLeft: `4px solid ${
                                            priority.color || "#ccc"
                                          }`,
                                        }}
                                      >
                                        {/* DELETE BUTTON */}
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
                                                    deleteMutation.mutate(
                                                      job.id,
                                                    ),
                                                });
                                              }}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        )}

                                        {/* CONTENT */}
                                        <Typography fontWeight="bold">
                                          {/* {job.Name} */}
                                          {truncateText(job.Name, 20)}
                                        </Typography>

                                        <Typography variant="body2">
                                          {job.Account?.join(", ")}
                                        </Typography>

                                        <Typography variant="caption">
                                          👤{" "}
                                          {job.JobAssignee?.join(", ") ||
                                            "Unassigned"}
                                        </Typography>

                                        <Typography
                                          variant="caption"
                                          display="block"
                                        >
                                          {truncateText(job.Description, 50)}
                                        </Typography>

                                        {/* PRIORITY CHIP */}
                                        <Chip
                                          label={priority.label || job.Priority}
                                          size="small"
                                          sx={{
                                            mt: 1,
                                            backgroundColor:
                                              priority.color || "#e0e0e0",
                                            color: priority.textColor || "#fff",
                                            fontWeight: 600,
                                          }}
                                        />

                                        <Typography
                                          variant="caption"
                                          display="block"
                                        >
                                          📅{" "}
                                          {dayjs(job.StartDate).format(
                                            "DD MMM",
                                          )}
                                        </Typography>

                                        <Typography
                                          variant="caption"
                                          display="block"
                                        >
                                          ⏳{" "}
                                          {dayjs(job.DueDate).format("DD MMM")}
                                        </Typography>

                                        <Typography
                                          variant="caption"
                                          display="block"
                                        >
                                          🔄 {dayjs(job.updatedAt).fromNow()}
                                        </Typography>
                                      </JobCard>
                                    )}
                                  </Draggable>
                                );
                              },
                            )}

                            {provided.placeholder}
                          </Box>
                        </Column>
                      )}
                    </Droppable>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DragDropContext>

      {/* DRAWERS */}

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

export default AccountKanbanBoard;
