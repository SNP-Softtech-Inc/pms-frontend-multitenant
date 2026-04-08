
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsAPI, jobAPI } from "../../services/api";
import { toast } from "react-toastify";

// 🎨 Column (Stage)
const Column = styled(Box)(({ theme }) => ({
  minWidth: 320,
  height: "75vh", // ✅ fixed height
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

  // ✅ Fetch jobs
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["pipeline-jobs", isActive, pipeline._id],
    queryFn: async () => {
      const accRes = await accountsAPI.getAccountsList();
      const accounts = accRes.data.accountlist || [];

      if (!accounts.length) return [];

      const accountIds = accounts.map((a) => a._id).join(",");
      const jobRes = await jobAPI.pipelineJoblist(accountIds, isActive);

      return jobRes.data.jobList || [];
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

      const stageObj = pipeline.stages.find(
        (s) => s._id === stageId
      );

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
              : job
          )
      );

      return { prevData };
    },

    onSuccess: (_, variables) => {
      const stageObj = pipeline.stages.find(
        (s) => s._id === variables.stageId
      );

      toast.success(`Moved to "${stageObj?.name}"`);
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["pipeline-jobs", isActive, pipeline._id],
        context?.prevData
      );
      toast.error("Failed to update");
    },

    onSettled: () => {
      queryClient.invalidateQueries([
        "pipeline-jobs",
        isActive,
        pipeline._id,
      ]);
    },
  });

  // ✅ Filter jobs by pipeline
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) => job.PipelineId === pipeline._id
    );
  }, [jobs, pipeline]);

  // ✅ Group jobs by stage
  const groupedJobs = useMemo(() => {
    const grouped = {};

    pipeline.stages.forEach((stage) => {
      grouped[stage._id] = [];
    });

    filteredJobs.forEach((job) => {
      const stageId = job.Stage?.id;
      if (stageId && grouped[stageId]) {
        grouped[stageId].push(job);
      }
    });

    return grouped;
  }, [filteredJobs, pipeline]);

  // 🎯 Drag End
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    updateStageMutation.mutate({
      jobId: draggableId,
      stageId: destination.droppableId,
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Typography
        sx={{ cursor: "pointer", mb: 1, color: "primary.main" }}
        onClick={onBack}
      >
        ← Back
      </Typography>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        {pipeline.pipelineName}
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" gap={2} overflow="auto">
          {pipeline.stages.map((stage) => {
            const jobCount = groupedJobs[stage._id]?.length || 0;

            return (
              <Droppable droppableId={stage._id} key={stage._id}>
                {(provided) => (
                  <Column
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {/* ✅ Header */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography fontWeight="bold">
                        {stage.name}
                      </Typography>

                      <Chip
                        label={jobCount}
                        size="small"
                        color="primary"
                      />
                    </Box>

                    {/* ✅ Scrollable Jobs */}
                    <Box
                      sx={{
                        overflowY: "auto",
                        flexGrow: 1,
                        pr: 1,
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#cbd5e1",
                          borderRadius: "6px",
                        },
                      }}
                    >
                      {groupedJobs[stage._id]?.map((job, index) => (
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
                            >
                              <Typography fontWeight="bold">
                                {job.Name}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {job.Account?.join(", ")}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Priority: {job.Priority}
                              </Typography>
                            </JobCard>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </Box>
                  </Column>
                )}
              </Droppable>
            );
          })}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;