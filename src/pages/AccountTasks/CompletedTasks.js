// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   Chip,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { accountTasksAPI } from "../../services/api";
// import { useConfirm } from "../../components/ConfirmDialogContext"; // adjust path
// import { toast } from "react-toastify";

// // ✅ Status Config
// const TASK_STATUS = [
//   { value: "No status", label: "No status", color: "#C4AEAD" },
//   { value: "Planned", label: "Planned", color: "#4169E1" },
//   { value: "In review", label: "In review", color: "#F6BE00" },
//   { value: "In progress", label: "In progress", color: "#F6BE00" },
//   { value: "On hold", label: "On hold", color: "#BCC6CC" },
//   { value: "Extended", label: "Extended", color: "#82CAFF" },
//   { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
//   { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
//   { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
//   { value: "Completed", label: "Completed", color: "#00FF00" },
//   { value: "Canceled", label: "Canceled", color: "#EB5406" },
// ];

// // ✅ Helpers
// const getStatusConfig = (status) =>
//   TASK_STATUS.find((s) => s.value === status) || {
//     label: status,
//     color: "#999",
//   };

// const isLightColor = (hex) => {
//   const c = hex.substring(1);
//   const rgb = parseInt(c, 16);
//   const r = (rgb >> 16) & 255;
//   const g = (rgb >> 8) & 255;
//   const b = rgb & 255;
//   return r * 0.299 + g * 0.587 + b * 0.114 > 186;
// };

// const CompletedTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const confirm = useConfirm(); // ✅ confirm dialog

//   const fetchCompletedTasks = async () => {
//     try {
//       const res = await accountTasksAPI.getCompletedTasks();
//       setTasks(res.data.list || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompletedTasks();
//   }, []);

//   // ✅ Delete with confirmation
//   const handleDelete = (taskId) => {
//     confirm({
//       title: "Delete Task",
//       description: "Are you sure you want to delete this completed task?",
//       onConfirm: async () => {
//         try {
//           await accountTasksAPI.deleteTask(taskId);

//           setTasks((prev) =>
//             prev.filter((task) => task.id !== taskId)
//           );

//           toast.success("Task deleted successfully");
//         } catch (err) {
//           console.error(err);
//           toast.error("Failed to delete task");
//         }
//       },
//     });
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box>
//       <Typography variant="h6" mb={2}>
//         Completed Tasks ({tasks.length})
//       </Typography>

//       {tasks.length === 0 ? (
//         <Typography>No Completed Tasks</Typography>
//       ) : (
//         tasks.map((task) => {
//           const statusObj = getStatusConfig(task.Status);

//           return (
//             <Paper
//               key={task.id}
//               sx={{
//                 p: 2,
//                 mb: 2,
//                 borderRadius: 2,
//                 backgroundColor: "#f5f5f5",
//               }}
//             >
//               {/* 🔹 Header */}
//               <Box display="flex" justifyContent="space-between">
//                 <Typography fontWeight="bold">{task.Name}</Typography>

//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(task.id)}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Box>

//               <Typography variant="body2">
//                 Account: {task.AccountName}
//               </Typography>

//               <Typography variant="body2">
//                 Priority: {task.Priority}
//               </Typography>

//               <Typography variant="body2">
//                 Subtasks: {task.CompletedSubtasks} / {task.SubtasksCount}
//               </Typography>

//               {/* 🎨 Status Chip */}
//               <Chip
//                 label={statusObj.label}
//                 size="small"
//                 sx={{
//                   mt: 1,
//                   backgroundColor: statusObj.color,
//                   color: isLightColor(statusObj.color) ? "#000" : "#fff",
//                   fontWeight: 500,
//                 }}
//               />
//             </Paper>
//           );
//         })
//       )}
//     </Box>
//   );
// };

// export default CompletedTasks;


import React, { useEffect, useState } from "react";
import {
  Trash2,
  Building2,
  Flag,
  CheckSquare,
  CheckCircle2,
} from "lucide-react";

import { accountTasksAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { toast } from "react-toastify";

// ✅ shadcn/ui imports
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

// ✅ Status Config
const TASK_STATUS = [
  { value: "No status", label: "No status", color: "#C4AEAD" },
  { value: "Planned", label: "Planned", color: "#4169E1" },
  { value: "In review", label: "In review", color: "#F6BE00" },
  { value: "In progress", label: "In progress", color: "#F6BE00" },
  { value: "On hold", label: "On hold", color: "#BCC6CC" },
  { value: "Extended", label: "Extended", color: "#82CAFF" },
  {
    value: "Waiting for Client",
    label: "Waiting for Client",
    color: "#566D7E",
  },
  {
    value: "Waiting for Signatures",
    label: "Waiting for Signatures",
    color: "#566D7E",
  },
  {
    value: "Waiting for agency",
    label: "Waiting for agency",
    color: "#566D7E",
  },
  { value: "Completed", label: "Completed", color: "#22c55e" },
  { value: "Canceled", label: "Canceled", color: "#ef4444" },
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

  const confirm = useConfirm();

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

  // ✅ Delete Task
  const handleDelete = (taskId) => {
    confirm({
      title: "Delete Task",
      description:
        "Are you sure you want to delete this completed task?",
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

  // ✅ Loader
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Completed Tasks
          </h2>

          <p className="text-sm text-muted-foreground">
            Successfully completed tasks overview
          </p>
        </div>

        <Badge
          variant="secondary"
          className="bg-green-100 px-4 py-1 text-sm text-green-700"
        >
          {tasks.length} Completed
        </Badge>
      </div>

      {/* Empty State */}
      {tasks.length === 0 ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed">
          <p className="text-muted-foreground">
            No Completed Tasks Found
          </p>
        </div>
      ) : (
        // ✅ Responsive Grid
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tasks.map((task) => {
            const statusObj = getStatusConfig(task.Status);

            return (
              <Card
                key={task.id}
                className="group relative overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Top Green Gradient */}
                <div
                  className="h-1 w-full"
                  style={{
                    backgroundColor: statusObj.color,
                  }}
                />

                <CardContent className="p-5">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold">
                        {task.Name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />

                        <span className="truncate">
                          {task.AccountName}
                        </span>
                      </div>
                    </div>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(task.id)}
                      className="opacity-0 transition-opacity duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    {/* Priority */}
                    <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-muted-foreground" />

                        <span className="text-sm text-muted-foreground">
                          Priority
                        </span>
                      </div>

                      <span className="text-sm font-medium">
                        {task.Priority}
                      </span>
                    </div>

                    {/* Subtasks */}
                    <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />

                        <span className="text-sm text-muted-foreground">
                          Subtasks
                        </span>
                      </div>

                      <span className="text-sm font-medium">
                        {task.CompletedSubtasks} /{" "}
                        {task.SubtasksCount}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between">
                    <Badge
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: statusObj.color,
                        color: isLightColor(statusObj.color)
                          ? "#000"
                          : "#fff",
                      }}
                    >
                      {statusObj.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;