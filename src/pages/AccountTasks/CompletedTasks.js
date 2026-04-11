import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { accountTasksAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext"; // adjust path
import { toast } from "react-toastify";

// ✅ Status Config
const TASK_STATUS = [
  { value: "No status", label: "No status", color: "#C4AEAD" },
  { value: "Planned", label: "Planned", color: "#4169E1" },
  { value: "In review", label: "In review", color: "#F6BE00" },
  { value: "In progress", label: "In progress", color: "#F6BE00" },
  { value: "On hold", label: "On hold", color: "#BCC6CC" },
  { value: "Extended", label: "Extended", color: "#82CAFF" },
  { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
  { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
  { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
  { value: "Completed", label: "Completed", color: "#00FF00" },
  { value: "Canceled", label: "Canceled", color: "#EB5406" },
];

// ✅ Helpers
const getStatusConfig = (status) =>
  TASK_STATUS.find((s) => s.value === status) || {
    label: status,
    color: "#999",
  };

const isLightColor = (hex) => {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const confirm = useConfirm(); // ✅ confirm dialog

  const fetchCompletedTasks = async () => {
    try {
      const res = await accountTasksAPI.getCompletedTasks();
      setTasks(res.data.list || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  // ✅ Delete with confirmation
  const handleDelete = (taskId) => {
    confirm({
      title: "Delete Task",
      description: "Are you sure you want to delete this completed task?",
      onConfirm: async () => {
        try {
          await accountTasksAPI.deleteTask(taskId);

          setTasks((prev) =>
            prev.filter((task) => task.id !== taskId)
          );

          toast.success("Task deleted successfully");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete task");
        }
      },
    });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Completed Tasks ({tasks.length})
      </Typography>

      {tasks.length === 0 ? (
        <Typography>No Completed Tasks</Typography>
      ) : (
        tasks.map((task) => {
          const statusObj = getStatusConfig(task.Status);

          return (
            <Paper
              key={task.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              {/* 🔹 Header */}
              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight="bold">{task.Name}</Typography>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography variant="body2">
                Account: {task.AccountName}
              </Typography>

              <Typography variant="body2">
                Priority: {task.Priority}
              </Typography>

              <Typography variant="body2">
                Subtasks: {task.CompletedSubtasks} / {task.SubtasksCount}
              </Typography>

              {/* 🎨 Status Chip */}
              <Chip
                label={statusObj.label}
                size="small"
                sx={{
                  mt: 1,
                  backgroundColor: statusObj.color,
                  color: isLightColor(statusObj.color) ? "#000" : "#fff",
                  fontWeight: 500,
                }}
              />
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default CompletedTasks;