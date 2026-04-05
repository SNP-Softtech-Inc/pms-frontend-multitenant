// src/pages/Workflow/KanbanBoard.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const KanbanBoard = ({ pipeline, onBack }) => {
  const stages = pipeline?.stages || [];
  console.log("selcted pipeline", pipeline);
  return (
    <Box p={2}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">{pipeline.pipelineName}</Typography>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
      </Box>

      {/* Kanban Board */}
      <Box
        display="flex"
        gap={2}
        sx={{
          overflowX: "auto",
          alignItems: "flex-start",
        }}
      >
        {stages.map((stage) => (
          <Box
            key={stage._id}
            sx={{
              minWidth: 280,
              height: "70vh", // 👈 fixed height (you can adjust)
              backgroundColor: "#f4f5f7",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Stage Title */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {stage.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default KanbanBoard;
