// import React, { useEffect, useState, useMemo } from "react";
// import { Trash2, Building2, Flag, CheckSquare, Pencil } from "lucide-react";
// import { DataTable } from "../../components/data-table/data-table";
// import { DataTableToolbar } from "../../components/data-table/toolbar";
// import { accountTasksAPI } from "../../services/api";
// import { useConfirm } from "../../components/ConfirmDialogContext";
// import { useToastContext } from "../../context/ToastContext"; // ✅ adjust path

// // ✅ shadcn/ui imports
// import { Card, CardContent } from "../../components/ui/card";
// import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../../components/ui/dialog";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import Priority from "../../components/Priority";
// import Status from "../../components/Status";
// import TasksDrawer from "./TasksDrawer";
// import { useQuery,useQueryClient } from "@tanstack/react-query";
// // ✅ Status Config
// const TASK_STATUS = [
//   { value: "No status", label: "No status", color: "#C4AEAD" },
//   { value: "Planned", label: "Planned", color: "#4169E1" },
//   { value: "In review", label: "In review", color: "#F6BE00" },
//   { value: "In progress", label: "In progress", color: "#F6BE00" },
//   { value: "On hold", label: "On hold", color: "#BCC6CC" },
//   { value: "Extended", label: "Extended", color: "#82CAFF" },
//   {
//     value: "Waiting for Client",
//     label: "Waiting for Client",
//     color: "#566D7E",
//   },
//   {
//     value: "Waiting for Signatures",
//     label: "Waiting for Signatures",
//     color: "#566D7E",
//   },
//   {
//     value: "Waiting for agency",
//     label: "Waiting for agency",
//     color: "#566D7E",
//   },
//   { value: "Completed", label: "Completed", color: "#22c55e" },
//   { value: "Canceled", label: "Canceled", color: "#ef4444" },
// ];

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


// const PendingTasks = () => {
//   const queryClient = useQueryClient();
//   // const [tasks, setTasks] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   const { showToast } = useToastContext(); // ✅ get showToast from context
//   // ✅ Edit Dialog States
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [selectedPriority, setSelectedPriority] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
//   const [subtasks, setSubtasks] = useState([]);
//   const [checkedSubtasks, setCheckedSubtasks] = useState([]);
//   const confirm = useConfirm();
//   const [globalFilter, setGlobalFilter] = useState("");
// const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false);
// const [drawerMode, setDrawerMode] = useState("create");
// // const [selectedTask, setSelectedTask] = useState(null);
//   // const fetchPendingTasks = async () => {
//   //   try {
//   //     const res = await accountTasksAPI.getPendingTasks();
//   //     setTasks(res.data.list || []);
//   //     console.log("gets account tsaks", res.data.list);
//   //   } catch (err) {
//   //     console.error(err);
//   //     showToast({
//   //       title: "Failed to fetch tasks",
//   //       type: "error",
//   //     });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchPendingTasks();
//   // }, []);
//   const {
//   data: tasks = [],
//   isLoading: loading,
// } = useQuery({
//   queryKey: ["pendingTasks"],
//   queryFn: async () => {
//     const res = await accountTasksAPI.getPendingTasks();
//     return res.data.list || [];
//   },
// });
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "Name",
//         header: "Task",
//         cell: ({ row }) => (
//           <div className="font-medium">{row.original.Name}</div>
//         ),
//       },
//       {
//         accessorKey: "AccountName",
//         header: "Account",
//         cell: ({ row }) => <div>{row.original.AccountName}</div>,
//       },
//       {
//         accessorKey: "Priority",
//         header: "Priority",
//         cell: ({ row }) => (
//           <Badge variant="outline">{row.original.Priority}</Badge>
//         ),
//       },
//       {
//         accessorKey: "Status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = getStatusConfig(row.original.Status);

//           return (
//             <Badge
//               style={{
//                 backgroundColor: status.color,
//                 color: isLightColor(status.color) ? "#000" : "#fff",
//               }}
//             >
//               {status.label}
//             </Badge>
//           );
//         },
//       },
//       {
//         id: "subtasks",
//         header: "Subtasks",
//         cell: ({ row }) => (
//           <span>
//             {row.original.CompletedSubtasks} / {row.original.SubtasksCount}
//           </span>
//         ),
//       },
//       {
//         id: "actions",
//         header: "Actions",
//         enableSorting: false,
//         enableHiding: false,
//         cell: ({ row }) => (
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleEdit(row.original.id)}
//             >
//               <Pencil className="h-4 w-4" />
//             </Button>

//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleDelete(row.original.id)}
//               className="text-red-500"
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </div>
//         ),
//       },
//     ],
//     [tasks],
//   );
//   // ✅ Open Edit Dialog

  

//   const handleEdit = async (taskId) => {
//   try {
//     setUpdateLoading(true);

//     const res = await accountTasksAPI.getTaskById(taskId);

//     setSelectedTask(res.data.task);
//     console.log("selected task to edit", res.data.task);
//     setDrawerMode("edit");
//     setTasksDrawerOpen(true);
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
//   // ✅ Add Subtask
//   const handleAddSubtask = () => {
//     setSubtasks((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         text: "",
//         completed: false,
//       },
//     ]);
//   };

//   // ✅ Delete Subtask
//   const handleDeleteSubtask = (id) => {
//     setSubtasks((prev) => prev.filter((s) => s.id !== id));

//     setCheckedSubtasks((prev) => prev.filter((item) => item !== id));
//   };

//   // ✅ Checkbox Change
//   const handleCheckboxChange = (id) => {
//     setCheckedSubtasks((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );

//     setSubtasks((prev) =>
//       prev.map((s) =>
//         s.id === id
//           ? {
//               ...s,
//               completed: !s.completed,
//             }
//           : s,
//       ),
//     );
//   };
//   // ✅ Update Task

//   const handleUpdateTask = async () => {
//     try {
//       setUpdateLoading(true);

//       const payload = {
//         priority: selectedPriority,
//         status: selectedStatus,

//         subtasks: subtasks.map((s) => ({
//           id: String(s.id),
//           text: s.text,
//           checked: checkedSubtasks.includes(s.id),
//         })),
//       };

//       await accountTasksAPI.updateTask(selectedTask._id, payload);

//       queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });

//       showToast({
//         title: "Task updated successfully",
//         type: "success",
//       });

//       setEditOpen(false);

//     } catch (err) {
//       console.error(err);
//       showToast({
//         title: "Failed to update task",
//         type: "error",
//       });
//     } finally {
//       setUpdateLoading(false);
//     }
//   };
//   // ✅ Delete Task
//   const handleDelete = (taskId) => {
//     confirm({
//       title: "Delete Task",
//       description: "Are you sure you want to delete this task?",
//       onConfirm: async () => {
//         try {
//           await accountTasksAPI.deleteTask(taskId);

//           queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });

//           showToast({
//             title: "Task deleted successfully",
//             type: "success",
//           });
//         } catch (err) {
//           console.error(err);
//           showToast({
//             title: "Failed to delete task",
//             type: "error",
//           });
//         }
//       },
//     });
//   };

//   // ✅ Loader
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight">Pending Tasks</h2>

//             <p className="text-sm text-muted-foreground">
//               Manage and track all pending tasks
//             </p>
//           </div>

//           <Badge variant="secondary" className="px-4 py-1 text-sm">
//             {tasks.length} Tasks
//           </Badge>
//         </div>

//         {/* Empty State */}
//         {tasks.length === 0 ? (
//           <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed">
//             <p className="text-muted-foreground">No Pending Tasks Found</p>
//           </div>
//         ) : (
         
//           <div className="space-y-4">
//             <DataTableToolbar
//               globalFilter={globalFilter}
//               onGlobalFilterChange={setGlobalFilter}
//             />

//             <DataTable
//               columns={columns}
//               data={tasks}
//               globalFilter={globalFilter}
//               onGlobalFilterChange={setGlobalFilter}
//               emptyMessage="No pending tasks found"
//               emptyDescription={
//                 tasks.length === 0
//                   ? "There are currently no pending tasks."
//                   : "Try changing your search or filters."
//               }
//             />
//           </div>
//         )}
//       </div>

//       {/* ✅ Edit Dialog */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent className="sm:max-w-md rounded-2xl">
//           <DialogHeader>
//             <DialogTitle>Edit Task</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-5 py-3">
//             {/* Priority */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Priority</label>

//               <Priority
//                 selectedPriority={selectedPriority}
//                 onPriorityChange={setSelectedPriority}
//               />
//             </div>

//             {/* Status */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Status</label>

//               <Status
//                 selectedStatus={selectedStatus}
//                 onStatusChange={setSelectedStatus}
//               />
//             </div>

//             {/* ✅ Subtasks */}
//             <div className="border border-border rounded-xl p-4 bg-background">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-medium">Subtasks</h3>

//                 <button
//                   type="button"
//                   onClick={() => setSubtaskSwitch(!SubtaskSwitch)}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                     SubtaskSwitch ? "bg-primary" : "bg-muted"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                       SubtaskSwitch ? "translate-x-6" : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//               </div>

//               {SubtaskSwitch && (
//                 <div className="mt-4 space-y-3">
//                   {subtasks.map((s) => (
//                     <div key={s.id} className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={checkedSubtasks.includes(s.id)}
//                         onChange={() => handleCheckboxChange(s.id)}
//                         className="h-4 w-4 rounded border-border"
//                       />

//                       <Input
//                         value={s.text}
//                         onChange={(e) =>
//                           setSubtasks((prev) =>
//                             prev.map((p) =>
//                               p.id === s.id
//                                 ? {
//                                     ...p,
//                                     text: e.target.value,
//                                   }
//                                 : p,
//                             ),
//                           )
//                         }
//                         placeholder="Enter subtask"
//                       />

//                       <button
//                         onClick={() => handleDeleteSubtask(s.id)}
//                         className="p-2 rounded-md hover:bg-muted text-muted-foreground"
//                       >
//                         <RiDeleteBin6Line size={18} />
//                       </button>
//                     </div>
//                   ))}

//                   <button
//                     onClick={handleAddSubtask}
//                     className="h-9 px-4 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
//                   >
//                     Add Subtask
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setEditOpen(false)}>
//               Cancel
//             </Button>

//             <Button onClick={handleUpdateTask} disabled={updateLoading}>
//               {updateLoading ? "Updating..." : "Update Task"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <TasksDrawer
//   open={tasksDrawerOpen}
//   mode={drawerMode}
//   task={selectedTask}
//   onClose={() => {
//     setTasksDrawerOpen(false);
//     setSelectedTask(null);
//   }}
//   onSuccess={() => {
//     fetchPendingTasks();
//     setTasksDrawerOpen(false);
//     setSelectedTask(null);
//   }}
// />
//     </>
//   );
// };

// export default PendingTasks;
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Trash2, Pencil, X } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import { accountTasksAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { useToastContext } from "../../context/ToastContext";

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
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

// ✅ Checkbox that supports the "indeterminate" (partially selected) state
const SelectCheckbox = ({ checked, indeterminate, onChange, ariaLabel }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={ariaLabel}
      className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
    />
  );
};

const PendingTasks = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();
  const confirm = useConfirm();

  // Edit dialog states
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");

  // ✅ Row selection: { [taskId]: true }
  const [rowSelection, setRowSelection] = useState({});
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );

  const { data: tasks = [], isLoading: loading } = useQuery({
    queryKey: ["pendingTasks"],
    queryFn: async () => {
      const res = await accountTasksAPI.getPendingTasks();
      return res.data.list || [];
    },
  });

  // ✅ Drop selections for tasks that no longer exist (after refetch)
  useEffect(() => {
    setRowSelection((prev) => {
      const ids = new Set(tasks.map((t) => String(t.id)));
      const next = {};
      Object.keys(prev).forEach((id) => {
        if (prev[id] && ids.has(id)) next[id] = true;
      });
      return next;
    });
  }, [tasks]);

  const columns = useMemo(
    () => [
      // ✅ Selection column
      {
        id: "select",
        // header: ({ table }) => (
        //   <SelectCheckbox
        //     checked={table.getIsAllPageRowsSelected()}
        //     indeterminate={table.getIsSomePageRowsSelected()}
        //     onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        //     ariaLabel="Select all tasks"
        //   />
        // ),
        // cell: ({ row }) => (
        //   <SelectCheckbox
        //     checked={row.getIsSelected()}
        //     onChange={(e) => row.toggleSelected(e.target.checked)}
        //     ariaLabel={`Select ${row.original.Name}`}
        //   />
        // ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "Name",
        header: "Task",
        cell: ({ row }) => <div className="font-medium">{row.original.Name}</div>,
      },
      {
        accessorKey: "AccountName",
        header: "Account",
        cell: ({ row }) => <div>{row.original.AccountName}</div>,
      },
      {
        accessorKey: "Priority",
        header: "Priority",
        cell: ({ row }) => <Badge variant="outline">{row.original.Priority}</Badge>,
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
            <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original.id)}>
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

  const handleEdit = async (taskId) => {
    try {
      setUpdateLoading(true);
      const res = await accountTasksAPI.getTaskById(taskId);
      setSelectedTask(res.data.task);
      setDrawerMode("edit");
      setTasksDrawerOpen(true);
    } catch (err) {
      console.error(err);
      showToast({ title: "Failed to fetch task", type: "error" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddSubtask = () => {
    setSubtasks((prev) => [...prev, { id: Date.now(), text: "", completed: false }]);
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
    setCheckedSubtasks((prev) => prev.filter((item) => item !== id));
  };

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    );
  };

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
      showToast({ title: "Task updated successfully", type: "success" });
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      showToast({ title: "Failed to update task", type: "error" });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Single delete
  const handleDelete = (taskId) => {
    confirm({
      title: "Delete Task",
      description: "Are you sure you want to delete this task?",
      onConfirm: async () => {
        try {
          await accountTasksAPI.deleteTask(taskId);
          queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });
          showToast({ title: "Task deleted successfully", type: "success" });
        } catch (err) {
          console.error(err);
          showToast({ title: "Failed to delete task", type: "error" });
        }
      },
    });
  };

  // ✅ Bulk delete
  const handleBulkDelete = () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;

    confirm({
      title: `Delete ${ids.length} task${ids.length > 1 ? "s" : ""}`,
      description: `Are you sure you want to delete ${ids.length} selected task${
        ids.length > 1 ? "s" : ""
      }? This can't be undone.`,
      onConfirm: async () => {
        setBulkDeleting(true);
        try {
          // If your backend has a bulk endpoint, replace this with:
          // await accountTasksAPI.deleteTasks(ids);
          const results = await Promise.allSettled(
            ids.map((id) => accountTasksAPI.deleteTask(id)),
          );

          const failed = results.filter((r) => r.status === "rejected").length;
          const succeeded = ids.length - failed;

          queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });
          setRowSelection({});

          if (failed === 0) {
            showToast({
              title: `${succeeded} task${succeeded > 1 ? "s" : ""} deleted`,
              type: "success",
            });
          } else {
            showToast({
              title: `Deleted ${succeeded} of ${ids.length} tasks. ${failed} failed.`,
              type: "error",
            });
          }
        } catch (err) {
          console.error(err);
          showToast({ title: "Failed to delete tasks", type: "error" });
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  };

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
            <p className="text-sm text-muted-foreground">Manage and track all pending tasks</p>
          </div>
          <Badge variant="secondary" className="px-4 py-1 text-sm">
            {tasks.length} Tasks
          </Badge>
        </div>

        {tasks.length === 0 ? (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No Pending Tasks Found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <DataTableToolbar
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
              />

              {/* ✅ Bulk action bar — only visible when rows are selected */}
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
                  <span className="text-sm font-medium">
                    {selectedIds.length} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRowSelection({})}
                    disabled={bulkDeleting}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleting}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    {bulkDeleting ? "Deleting..." : `Delete (${selectedIds.length})`}
                  </Button>
                </div>
              )}
            </div>

            <DataTable
              columns={columns}
              data={tasks}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              // ✅ selection props (see DataTable changes)
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              getRowId={(row) => String(row.id)}
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Priority selectedPriority={selectedPriority} onPriorityChange={setSelectedPriority} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Status selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            </div>

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
                            prev.map((p) => (p.id === s.id ? { ...p, text: e.target.value } : p)),
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
          // ✅ fetchPendingTasks no longer exists — refetch via React Query
          queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });
          setTasksDrawerOpen(false);
          setSelectedTask(null);
        }}
      />
    </>
  );
};

export default PendingTasks;
