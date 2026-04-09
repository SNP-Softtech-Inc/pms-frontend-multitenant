import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Box, Typography } from "@mui/material";

import { jobAPI, templateAPI } from "../../../services/api";
import KanbanBoard from "./AccountKanBan";

const Pipeline = () => {
  const { accountId } = useParams();

  // ✅ STEP 1: Fetch Jobs by Account
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs-by-account", accountId, true],
    enabled: !!accountId,
    queryFn: async () => {
      const res = await jobAPI.getJobsByAccount(accountId, true);
      return res.data.jobList || [];
    },
  });

  // ✅ STEP 2: Extract PipelineId (Assuming all jobs same pipeline OR pick first)
  const pipelineId = useMemo(() => {
    return jobs?.[0]?.PipelineId || null;
  }, [jobs]);

  // ✅ STEP 3: Fetch Pipeline Details
  const {
    data: pipeline,
    isLoading: pipelineLoading,
  } = useQuery({
    queryKey: ["pipeline-details", pipelineId],
    enabled: !!pipelineId,
    queryFn: async () => {
      const res = await templateAPI.getPipelineById(pipelineId);
      return res.data;
    },
  });

  // ✅ Loading State
  if (jobsLoading || pipelineLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // ✅ No Jobs Found
  if (!jobs.length) {
    return (
      <Box p={3}>
        <Typography>No jobs found for this account</Typography>
      </Box>
    );
  }

  // ✅ No Pipeline Found
  if (!pipeline) {
    return (
      <Box p={3}>
        <Typography>Pipeline not found</Typography>
      </Box>
    );
  }

  return (
    <KanbanBoard
      pipeline={pipeline}
      isActive={true}
      onBack={() => window.history.back()}
    />
  );
};

export default Pipeline;