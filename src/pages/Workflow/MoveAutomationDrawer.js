import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Checkbox,
  Button,
  Chip,
} from "@mui/material";

const AutomationDrawer = ({
  open,
  automations,
  onClose,
  onMoveJob,
  jobId,
  targetStage,
  accountName,
}) => {
  const safeAutomations = Array.isArray(automations) ? automations : [];

  const [selectedAutomationIndices, setSelectedAutomationIndices] = useState([]);

  // ✅ Initialize safely
  useEffect(() => {
    if (safeAutomations.length > 0) {
      setSelectedAutomationIndices(safeAutomations.map((_, i) => i));
    } else {
      setSelectedAutomationIndices([]);
    }
  }, [automations]);

  // ✅ Toggle selection
  const handleAutomationSelection = (index) => {
    setSelectedAutomationIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // ✅ Move handler
  const handleMove = () => {
    const selected = safeAutomations.filter((_, index) =>
      selectedAutomationIndices.includes(index)
    );

    onMoveJob(jobId, targetStage, selected);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Automations for {accountName || "Account"}
        </Typography>

        {/* ================= LIST ================= */}
        {safeAutomations.length > 0 ? (
          safeAutomations.map((automation, index) => {
            const addTags = Array.isArray(automation?.addTags)
              ? automation.addTags
              : [];

            const removeTags = Array.isArray(automation?.removeTags)
              ? automation.removeTags
              : [];

            return (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
              >
                {/* Header */}
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={selectedAutomationIndices.includes(index)}
                    onChange={() => handleAutomationSelection(index)}
                  />
                  <Typography fontWeight={600}>
                    {automation?.type || "Automation"}
                  </Typography>
                </Box>

                {/* Template */}
                {automation?.selectedtemp && (
                  <Typography variant="caption" color="text.secondary">
                    Template ID: {automation.selectedtemp}
                  </Typography>
                )}

                {/* Add Tags */}
                {addTags.length > 0 && (
                  <Box mt={1}>
                    <Typography variant="caption" color="green">
                      Add Tags:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {addTags.map((tag, i) => (
                        <Chip key={i} label={tag} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Remove Tags */}
                {removeTags.length > 0 && (
                  <Box mt={1}>
                    <Typography variant="caption" color="red">
                      Remove Tags:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {removeTags.map((tag, i) => (
                        <Chip key={i} label={tag} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })
        ) : (
          <Typography>No automations available</Typography>
        )}

        {/* ================= ACTIONS ================= */}
        <Box display="flex" gap={2} mt={3}>
          <Button variant="contained" onClick={handleMove} fullWidth>
            Move
          </Button>

          <Button variant="outlined" onClick={onClose} fullWidth>
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AutomationDrawer;