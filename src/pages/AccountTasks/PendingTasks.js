import React, { useEffect, useState, useMemo } from "react";
import { Trash2, Building2, Flag, CheckSquare, Pencil } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import { accountTasksAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { useToastContext } from "../../context/ToastContext"; // ✅ adjust path

// ✅ shadcn/ui imports
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { RiDeleteBin6Line } from "react-icons/ri";
import Priority from "../../components/Priority";
import Status from "../../components/Status";
import TasksDrawer from "./TasksDrawer";
import { useQuery,useQueryClient } from "@tanstack/react-query";
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


const PendingTasks = () => {
  const queryClient = useQueryClient();
  // const [tasks, setTasks] = useState([]);
  // const [loading, setLoading] = useState(true);
  const { showToast } = useToastContext(); // ✅ get showToast from context
  // ✅ Edit Dialog States
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  const confirm = useConfirm();
  const [globalFilter, setGlobalFilter] = useState("");
const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false);
const [drawerMode, setDrawerMode] = useState("create");
// const [selectedTask, setSelectedTask] = useState(null);
  // const fetchPendingTasks = async () => {
  //   try {
  //     const res = await accountTasksAPI.getPendingTasks();
  //     setTasks(res.data.list || []);
  //     console.log("gets account tsaks", res.data.list);
  //   } catch (err) {
  //     console.error(err);
  //     showToast({
  //       title: "Failed to fetch tasks",
  //       type: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchPendingTasks();
  // }, []);
  const {
  data: tasks = [],
  isLoading: loading,
} = useQuery({
  queryKey: ["pendingTasks"],
  queryFn: async () => {
    const res = await accountTasksAPI.getPendingTasks();
    return res.data.list || [];
  },
});
  const columns = useMemo(
    () => [
      {
        accessorKey: "Name",
        header: "Task",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.Name}</div>
        ),
      },
      {
        accessorKey: "AccountName",
        header: "Account",
        cell: ({ row }) => <div>{row.original.AccountName}</div>,
      },
      {
        accessorKey: "Priority",
        header: "Priority",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.Priority}</Badge>
        ),
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }) => {
          const status = getStatusConfig(row.original.Status);

          return (
            <Badge
              style={{
                backgroundColor: status.color,
                color: isLightColor(status.color) ? "#000" : "#fff",
              }}
            >
              {status.label}
            </Badge>
          );
        },
      },
      {
        id: "subtasks",
        header: "Subtasks",
        cell: ({ row }) => (
          <span>
            {row.original.CompletedSubtasks} / {row.original.SubtasksCount}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row.original.id)}
              className="text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [tasks],
  );
  // ✅ Open Edit Dialog

  // const handleEdit = async (taskId) => {
  //   try {
  //     setUpdateLoading(true);
  //     console.log("account task id", taskId);
  //     // ✅ Fetch latest task data
  //     const res = await accountTasksAPI.getTaskById(taskId);

  //     const taskData = res.data.task;

  //     setSelectedTask(taskData);
  //     console.log("selcted task to edit", taskData);
  //     // ✅ Status & Priority
  //     setSelectedPriority(taskData.priority || "");

  //     setSelectedStatus(taskData.status || "");

  //     // ✅ Subtasks
  //     const formattedSubtasks =
  //       taskData.subtasks?.map((s, index) => ({
  //         id: s.id || index + 1,
  //         text: s.text || "",
  //         completed: s.checked || false,
  //       })) || [];

  //     setSubtasks(formattedSubtasks);

  //     // ✅ Checked subtasks
  //     setCheckedSubtasks(
  //       formattedSubtasks.filter((s) => s.completed).map((s) => s.id),
  //     );

  //     setSubtaskSwitch(formattedSubtasks.length > 0);

  //     setEditOpen(true);
  //   } catch (err) {
  //     console.error(err);
  //     showToast({
  //       title: "Failed to fetch task",
  //       type: "error",
  //     });
  //   } finally {
  //     setUpdateLoading(false);
  //   }
  // };

  const handleEdit = async (taskId) => {
  try {
    setUpdateLoading(true);

    const res = await accountTasksAPI.getTaskById(taskId);

    setSelectedTask(res.data.task);
    console.log("selected task to edit", res.data.task);
    setDrawerMode("edit");
    setTasksDrawerOpen(true);
  } catch (err) {
    console.error(err);
    showToast({
      title: "Failed to fetch task",
      type: "error",
    });
  } finally {
    setUpdateLoading(false);
  }
};
  // ✅ Add Subtask
  const handleAddSubtask = () => {
    setSubtasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "",
        completed: false,
      },
    ]);
  };

  // ✅ Delete Subtask
  const handleDeleteSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));

    setCheckedSubtasks((prev) => prev.filter((item) => item !== id));
  };

  // ✅ Checkbox Change
  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

    setSubtasks((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              completed: !s.completed,
            }
          : s,
      ),
    );
  };
  // ✅ Update Task

  const handleUpdateTask = async () => {
    try {
      setUpdateLoading(true);

      const payload = {
        priority: selectedPriority,
        status: selectedStatus,

        subtasks: subtasks.map((s) => ({
          id: String(s.id),
          text: s.text,
          checked: checkedSubtasks.includes(s.id),
        })),
      };

      await accountTasksAPI.updateTask(selectedTask._id, payload);

      queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });

      showToast({
        title: "Task updated successfully",
        type: "success",
      });

      setEditOpen(false);

    } catch (err) {
      console.error(err);
      showToast({
        title: "Failed to update task",
        type: "error",
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  // ✅ Delete Task
  const handleDelete = (taskId) => {
    confirm({
      title: "Delete Task",
      description: "Are you sure you want to delete this task?",
      onConfirm: async () => {
        try {
          await accountTasksAPI.deleteTask(taskId);

          queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });

          showToast({
            title: "Task deleted successfully",
            type: "success",
          });
        } catch (err) {
          console.error(err);
          showToast({
            title: "Failed to delete task",
            type: "error",
          });
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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pending Tasks</h2>

            <p className="text-sm text-muted-foreground">
              Manage and track all pending tasks
            </p>
          </div>

          <Badge variant="secondary" className="px-4 py-1 text-sm">
            {tasks.length} Tasks
          </Badge>
        </div>

        {/* Empty State */}
        {tasks.length === 0 ? (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No Pending Tasks Found</p>
          </div>
        ) : (
          // ✅ Responsive Grid
          // <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          //   {tasks.map((task) => {
          //     const statusObj = getStatusConfig(task.Status);

          //     return (
          //       <Card
          //         key={task.id}
          //         className="group relative overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          //       >
          //         {/* Top Gradient */}
          //         <div
          //           className="h-1 w-full"
          //           style={{
          //             backgroundColor: statusObj.color,
          //           }}
          //         />

          //         <CardContent className="p-5">
          //           {/* Header */}
          //           <div className="mb-4 flex items-start justify-between gap-3">
          //             <div className="min-w-0 flex-1">
          //               <h3 className="truncate text-base font-semibold">
          //                 {task.Name}
          //               </h3>

          //               <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          //                 <Building2 className="h-4 w-4" />

          //                 <span className="truncate">
          //                   {task.AccountName}
          //                 </span>
          //               </div>
          //             </div>

          //             {/* Actions */}
          //             <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          //               {/* Edit */}
          //               <Button
          //                 variant="ghost"
          //                 size="icon"
          //                 onClick={() => handleEdit(task.id)}
          //                 className="hover:bg-blue-50 hover:text-blue-500"
          //               >
          //                 <Pencil className="h-4 w-4" />
          //               </Button>

          //               {/* Delete */}
          //               <Button
          //                 variant="ghost"
          //                 size="icon"
          //                 onClick={() => handleDelete(task.id)}
          //                 className="hover:bg-red-50 hover:text-red-500"
          //               >
          //                 <Trash2 className="h-4 w-4" />
          //               </Button>
          //             </div>
          //           </div>

          //           {/* Info */}
          //           <div className="space-y-3">
          //             {/* Priority */}
          //             <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
          //               <div className="flex items-center gap-2">
          //                 <Flag className="h-4 w-4 text-muted-foreground" />

          //                 <span className="text-sm text-muted-foreground">
          //                   Priority
          //                 </span>
          //               </div>

          //               <span className="text-sm font-medium">
          //                 {task.Priority}
          //               </span>
          //             </div>

          //             {/* Subtasks */}
          //             <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
          //               <div className="flex items-center gap-2">
          //                 <CheckSquare className="h-4 w-4 text-muted-foreground" />

          //                 <span className="text-sm text-muted-foreground">
          //                   Subtasks
          //                 </span>
          //               </div>

          //               <span className="text-sm font-medium">
          //                 {task.CompletedSubtasks} /{" "}
          //                 {task.SubtasksCount}
          //               </span>
          //             </div>
          //           </div>

          //           {/* Footer */}
          //           <div className="mt-5 flex items-center justify-between">
          //             <Badge
          //               className="rounded-full px-3 py-1 text-xs font-semibold"
          //               style={{
          //                 backgroundColor: statusObj.color,
          //                 color: isLightColor(statusObj.color)
          //                   ? "#000"
          //                   : "#fff",
          //               }}
          //             >
          //               {statusObj.label}
          //             </Badge>
          //           </div>
          //         </CardContent>
          //       </Card>
          //     );
          //   })}
          // </div>
          <div className="space-y-4">
            <DataTableToolbar
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
            />

            <DataTable
              columns={columns}
              data={tasks}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              emptyMessage="No pending tasks found"
              emptyDescription={
                tasks.length === 0
                  ? "There are currently no pending tasks."
                  : "Try changing your search or filters."
              }
            />
          </div>
        )}
      </div>

      {/* ✅ Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-3">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>

              <Priority
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <Status
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
            </div>

            {/* ✅ Subtasks */}
            <div className="border border-border rounded-xl p-4 bg-background">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Subtasks</h3>

                <button
                  type="button"
                  onClick={() => setSubtaskSwitch(!SubtaskSwitch)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    SubtaskSwitch ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      SubtaskSwitch ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {SubtaskSwitch && (
                <div className="mt-4 space-y-3">
                  {subtasks.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checkedSubtasks.includes(s.id)}
                        onChange={() => handleCheckboxChange(s.id)}
                        className="h-4 w-4 rounded border-border"
                      />

                      <Input
                        value={s.text}
                        onChange={(e) =>
                          setSubtasks((prev) =>
                            prev.map((p) =>
                              p.id === s.id
                                ? {
                                    ...p,
                                    text: e.target.value,
                                  }
                                : p,
                            ),
                          )
                        }
                        placeholder="Enter subtask"
                      />

                      <button
                        onClick={() => handleDeleteSubtask(s.id)}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSubtask}
                    className="h-9 px-4 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Add Subtask
                  </button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleUpdateTask} disabled={updateLoading}>
              {updateLoading ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TasksDrawer
  open={tasksDrawerOpen}
  mode={drawerMode}
  task={selectedTask}
  onClose={() => {
    setTasksDrawerOpen(false);
    setSelectedTask(null);
  }}
  onSuccess={() => {
    fetchPendingTasks();
    setTasksDrawerOpen(false);
    setSelectedTask(null);
  }}
/>
    </>
  );
};

export default PendingTasks;
