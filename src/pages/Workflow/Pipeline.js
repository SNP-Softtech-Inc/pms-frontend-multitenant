// src/pages/Workflow/Pipeline.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { toast } from "react-toastify";
import { templateAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import KanbanBoard from "./KanbanBoard";

const Pipeline = () => {
  const { user, loading: authLoading } = useAuth();

  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPipeline, setSelectedPipeline] = useState(null);

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchPipelines(user.id);
    }
  }, [authLoading, user]);

  const fetchPipelines = async (userId) => {
    setLoading(true);
    try {
      const response = await templateAPI.getPipelinesByUser(userId);
      setPipelines(response.data.pipeline || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pipelines");
    } finally {
      setLoading(false);
    }
  };

  const handlePipelineClick = async (pipelineId) => {
    try {
      setLoading(true);
      const res = await templateAPI.getPipelineById(pipelineId);
      setSelectedPipeline(res.data.pipeline);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pipeline details");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Show Kanban when selected
  if (selectedPipeline) {
    console.log("selcted pipeline",selectedPipeline)
    return (
      <KanbanBoard
        pipeline={selectedPipeline}
        onBack={() => setSelectedPipeline(null)}
        isActive={true}
      />
    );
  }

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pipelines.length) {
    return (
      <Box mt={4} textAlign="center">
        <Typography>No pipelines found</Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        My Pipelines
      </Typography>

      <List>
        {pipelines.map((pipeline) => (
          <ListItem
            key={pipeline._id}
            divider
            button
            onClick={() => handlePipelineClick(pipeline._id)}
          >
            <ListItemText
              primary={pipeline.pipelineName}
              secondary={`Created: ${new Date(
                pipeline.createdAt
              ).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Pipeline;