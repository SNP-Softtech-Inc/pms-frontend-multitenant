// import React, { useMemo, useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   Chip,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import { styled } from "@mui/system";

// import DeleteIcon from "@mui/icons-material/Delete";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { jobAPI, templateAPI } from "../../../services/api";
// import { useParams } from "react-router-dom";

// import EditJobDrawer from "../../Workflow/EditJobDrawer";
// import MoveAutomationDrawer from "../../Workflow/MoveAutomationDrawer";
// import dayjs from "dayjs";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// dayjs.extend(require("dayjs/plugin/relativeTime"));

// // ================= UI =================
// const Column = styled(Box)(({ theme }) => ({
//   minWidth: 320,
//   height: "75vh",
//   display: "flex",
//   flexDirection: "column",
//   background: "#f8fafc",
//   borderRadius: 12,
//   padding: theme.spacing(2),
// }));

// const JobCard = styled(Paper)(({ isDragging }) => ({
//   padding: 14,
//   marginBottom: 10,
//   borderRadius: 10,
//   background: isDragging ? "#e3f2fd" : "#fff",
// }));

// // ================= COMPONENT =================

// const AccountKanbanBoard = ({ isActive = true }) => {
//   const { accountId } = useParams();
//   const queryClient = useQueryClient();
//   const confirm = useConfirm();

//   // ================= DRAWERS =================

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editJobId, setEditJobId] = useState(null);
//   const [hoveredJobId, setHoveredJobId] = useState(null);
//   const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
//   const [selectedAutomationData, setSelectedAutomationData] = useState(null);
//   const handleEditOpen = (jobId) => {
//     setEditJobId(jobId);
//     setDrawerOpen(true);
//   };

//   // ================= FETCH PIPELINES =================
//   const { data: pipelines = [], isLoading } = useQuery({
//     queryKey: ["pipeline-jobs", accountId, isActive],
//     queryFn: async () => {
//       const res = await jobAPI.pipelineJobsByAccount(accountId, isActive);
//       console.log("pipeline list by account id jobs",res)
//       return res?.data?.pipelines || [];
//     },
//     enabled: !!accountId,
//   });

//   // ================= FETCH PIPELINE META =================
//   const [pipelineMeta, setPipelineMeta] = useState({});

//   useEffect(() => {
//     const fetchMeta = async () => {
//       const map = {};

//       await Promise.all(
//         pipelines.map(async (p) => {
//           const res = await templateAPI.getPipelineById(p.pipelineId);
//           map[p.pipelineId] = res?.data?.pipeline;
//         }),
//       );

//       setPipelineMeta(map);
//     };

//     if (pipelines.length > 0) fetchMeta();
//   }, [pipelines]);

//   // ================= UPDATE STAGE =================
//   const updateStageMutation = useMutation({
//     mutationFn: ({ jobId, stageId }) =>
//       jobAPI.updateJobStage(jobId, { stageId }),

//     onMutate: async ({ jobId, stageId }) => {
//       await queryClient.cancelQueries(["pipeline-jobs", accountId, isActive]);

//       const prevData = queryClient.getQueryData([
//         "pipeline-jobs",
//         accountId,
//         isActive,
//       ]);

//       queryClient.setQueryData(
//         ["pipeline-jobs", accountId, isActive],
//         (old = []) =>
//           old.map((p) => ({
//             ...p,
//             jobs: p.jobs.map((job) =>
//               job.id === jobId ? { ...job, StageId: stageId } : job,
//             ),
//           })),
//       );

//       return { prevData };
//     },

//     onError: (_, __, context) => {
//       queryClient.setQueryData(
//         ["pipeline-jobs", accountId, isActive],
//         context?.prevData,
//       );
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries(["pipeline-jobs", accountId, isActive]);
//     },
//   });

//   // ================= DELETE JOB =================
//   const deleteMutation = useMutation({
//     mutationFn: (jobId) => jobAPI.deleteJob(jobId),
//     onSuccess: () => {
//       toast.success("Job deleted");
//       queryClient.invalidateQueries(["pipeline-jobs", accountId]);
//     },
//   });

//   // ================= GROUP JOBS =================
//   const grouped = useMemo(() => {
//     const result = {};

//     pipelines.forEach((p) => {
//       const stages = pipelineMeta?.[p.pipelineId]?.stages || [];

//       result[p.pipelineId] = {};

//       stages.forEach((s) => {
//         result[p.pipelineId][s._id] = [];
//       });

//       p.jobs.forEach((job) => {
//         const stageId = job.StageId;
//         if (result[p.pipelineId]?.[stageId]) {
//           result[p.pipelineId][stageId].push(job);
//         }
//       });
//     });

//     return result;
//   }, [pipelines, pipelineMeta]);

//   // ================= DRAG =================
//   const onDragEnd = (result) => {
//     const { source, destination, draggableId } = result;

//     if (!destination) return;
//     if (source.droppableId === destination.droppableId) return;

//     // Find pipeline + stage
//     const pipelineId = Object.keys(pipelineMeta || {}).find((pid) =>
//       pipelineMeta?.[pid]?.stages?.some(
//         (s) => s._id === destination.droppableId,
//       ),
//     );

//     const targetStage = pipelineMeta?.[pipelineId]?.stages?.find(
//       (s) => s._id === destination.droppableId,
//     );

//     // ✅ If stage has automations → open drawer instead of moving
//     if (targetStage?.automations?.length > 0) {
//       setSelectedAutomationData({
//         jobId: draggableId,
//         stageId: destination.droppableId,
//         automations: targetStage.automations,
//       });

//       setAutomationDrawerOpen(true);
//       return;
//     }

//     // ✅ No automation → direct move
//     updateStageMutation.mutate({
//       jobId: draggableId,
//       stageId: destination.droppableId,
//     });
//   };

//   const truncateText = (text, limit = 50) => {
//     if (!text) return "";
//     const cleanText = text.replace(/<[^>]+>/g, "");
//     return cleanText.length > limit
//       ? cleanText.slice(0, limit) + "..."
//       : cleanText;
//   };
//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // ================= PRIORITY STYLE =================
//   const priorityConfig = {
//     Urgent: { color: "#0E0402", text: "#fff" },
//     High: { color: "#fe676e", text: "#fff" },
//     Medium: { color: "#FFC300", text: "#fff" },
//     Low: { color: "#56c288", text: "#fff" },
//   };

//   return (
//     <Box p={3}>
//       {/* HEADER */}

//       {/* BOARD */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Box display="flex" flexDirection="column" gap={4}>
//         {/* <Box display="flex" gap={3} overflow="auto"> */}
//           {pipelines.map((p) => {
//             const stages = pipelineMeta?.[p.pipelineId]?.stages || [];

//             return (
//               <Box key={p.pipelineId} mb={5}>
//                 {/* PIPELINE TITLE */}
//                 <Typography fontWeight="bold" mb={2}>
//                   {p.pipelineName}
//                 </Typography>

//                 <Box display="flex" gap={2} overflow="auto">
//                   {stages.map((stage) => (
//                     <Droppable droppableId={stage._id} key={stage._id}>
//                       {(provided) => (
//                         <Column
//                           ref={provided.innerRef}
//                           {...provided.droppableProps}
//                         >
//                           {/* STAGE HEADER */}
//                           <Box
//                             display="flex"
//                             justifyContent="space-between"
//                             mb={2}
//                           >
//                             <Typography fontWeight="bold">
//                               {stage.name}
//                             </Typography>

//                             <Chip
//                               label={
//                                 grouped?.[p.pipelineId]?.[stage._id]?.length ||
//                                 0
//                               }
//                               size="small"
//                             />
//                           </Box>

//                           {/* JOBS */}
//                           <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
//                             {(grouped?.[p.pipelineId]?.[stage._id] || []).map(
//                               (job, index) => {
//                                 const priority =
//                                   priorityConfig[job.Priority] || {};

//                                 return (
//                                   <Draggable
//                                     key={job.id}
//                                     draggableId={job.id}
//                                     index={index}
//                                   >
//                                     {(provided, snapshot) => (
//                                       <JobCard
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         isDragging={snapshot.isDragging}
//                                         onClick={() => handleEditOpen(job.id)}
//                                         onMouseEnter={() =>
//                                           setHoveredJobId(job.id)
//                                         }
//                                         onMouseLeave={() =>
//                                           setHoveredJobId(null)
//                                         }
//                                         sx={{
//                                           position: "relative",
//                                           borderLeft: `4px solid ${
//                                             priority.color || "#ccc"
//                                           }`,
//                                         }}
//                                       >
//                                         {/* DELETE BUTTON */}
//                                         {hoveredJobId === job.id && (
//                                           <Tooltip title="Delete">
//                                             <IconButton
//                                               size="small"
//                                               sx={{
//                                                 position: "absolute",
//                                                 top: 6,
//                                                 right: 6,
//                                                 color: "error.main",
//                                               }}
//                                               onClick={(e) => {
//                                                 e.stopPropagation();

//                                                 confirm({
//                                                   title: "Delete Job",
//                                                   description:
//                                                     "Are you sure you want to delete this job?",
//                                                   onConfirm: () =>
//                                                     deleteMutation.mutate(
//                                                       job.id,
//                                                     ),
//                                                 });
//                                               }}
//                                             >
//                                               <DeleteIcon fontSize="small" />
//                                             </IconButton>
//                                           </Tooltip>
//                                         )}

//                                         {/* CONTENT */}
//                                         <Typography fontWeight="bold">
//                                           {/* {job.Name} */}
//                                           {truncateText(job.Name, 20)}
//                                         </Typography>

//                                         <Typography variant="body2">
//                                           {job.Account?.join(", ")}
//                                         </Typography>

//                                         <Typography variant="caption">
//                                           👤{" "}
//                                           {job.JobAssignee?.join(", ") ||
//                                             "Unassigned"}
//                                         </Typography>

//                                         <Typography
//                                           variant="caption"
//                                           display="block"
//                                         >
//                                           {truncateText(job.Description, 50)}
//                                         </Typography>

//                                         {/* PRIORITY CHIP */}
//                                         <Chip
//                                           label={priority.label || job.Priority}
//                                           size="small"
//                                           sx={{
//                                             mt: 1,
//                                             backgroundColor:
//                                               priority.color || "#e0e0e0",
//                                             color: priority.textColor || "#fff",
//                                             fontWeight: 600,
//                                           }}
//                                         />

//                                         <Typography
//                                           variant="caption"
//                                           display="block"
//                                         >
//                                           📅{" "}
//                                           {dayjs(job.StartDate).format(
//                                             "DD MMM",
//                                           )}
//                                         </Typography>

//                                         <Typography
//                                           variant="caption"
//                                           display="block"
//                                         >
//                                           ⏳{" "}
//                                           {dayjs(job.DueDate).format("DD MMM")}
//                                         </Typography>

//                                         <Typography
//                                           variant="caption"
//                                           display="block"
//                                         >
//                                           🔄 {dayjs(job.updatedAt).fromNow()}
//                                         </Typography>
//                                       </JobCard>
//                                     )}
//                                   </Draggable>
//                                 );
//                               },
//                             )}

//                             {provided.placeholder}
//                           </Box>
//                         </Column>
//                       )}
//                     </Droppable>
//                   ))}
//                 </Box>
//               </Box>
//             );
//           })}
//         </Box>
//       </DragDropContext>

//       {/* DRAWERS */}

//       <EditJobDrawer
//         open={drawerOpen}
//         onClose={() => {
//           setDrawerOpen(false);
//           setEditJobId(null);
//         }}
//         jobId={editJobId}
//       />
//       <MoveAutomationDrawer
//         open={automationDrawerOpen}
//         onClose={() => setAutomationDrawerOpen(false)}
//         automations={selectedAutomationData?.automations || []}
//         jobId={selectedAutomationData?.jobId}
//         stageId={selectedAutomationData?.stageId}
//       />
//     </Box>
//   );
// };

// export default AccountKanbanBoard;


import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { jobAPI, templateAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import EditJobDrawer from "../../Workflow/EditJobDrawer";
import MoveAutomationDrawer from "../../Workflow/MoveAutomationDrawer";

// shadcn/ui components
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Skeleton } from "../../../components/ui/skeleton";

// Icons
import {
  Trash2,
  User,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";

dayjs.extend(relativeTime);

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
      console.log("pipeline list by account id jobs", res);
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
        })
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
              job.id === jobId ? { ...job, StageId: stageId } : job
            ),
          }))
      );

      return { prevData };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["pipeline-jobs", accountId, isActive],
        context?.prevData
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
      pipelineMeta?.[pid]?.stages?.some((s) => s._id === destination.droppableId)
    );

    const targetStage = pipelineMeta?.[pipelineId]?.stages?.find(
      (s) => s._id === destination.droppableId
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
      <div className="flex justify-center gap-4 p-10">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[75vh] w-[320px] rounded-xl" />
        ))}
      </div>
    );
  }

  // ================= PRIORITY STYLE =================
  const priorityConfig = {
    Urgent: {
      label: "Urgent",
      bg: "bg-[#0E0402]",
      text: "text-white",
      border: "border-l-[#0E0402]",
    },
    High: {
      label: "High",
      bg: "bg-[#fe676e]",
      text: "text-white",
      border: "border-l-[#fe676e]",
    },
    Medium: {
      label: "Medium",
      bg: "bg-[#FFC300]",
      text: "text-black",
      border: "border-l-[#FFC300]",
    },
    Low: {
      label: "Low",
      bg: "bg-[#56c288]",
      text: "text-white",
      border: "border-l-[#56c288]",
    },
  };

  return (
    <div className="p-6">
      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col gap-6">
          {pipelines.map((p) => {
            const stages = pipelineMeta?.[p.pipelineId]?.stages || [];

            return (
              <div key={p.pipelineId} className="mb-5">
                {/* PIPELINE TITLE */}
                <h2 className="font-bold text-lg mb-3 text-foreground">
                  {p.pipelineName}
                </h2>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  {stages.map((stage) => (
                    <Droppable droppableId={stage._id} key={stage._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex flex-col min-w-[320px] h-[75vh] rounded-xl p-4 shadow-sm border border-slate-200"
                        >
                          {/* STAGE HEADER */}
                          <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="font-semibold text-slate-700">
                              {stage.name}
                            </h3>

                            <Badge variant="secondary" className="rounded-full">
                              {grouped?.[p.pipelineId]?.[stage._id]?.length || 0}
                            </Badge>
                          </div>

                          {/* JOBS */}
                          <ScrollArea className="flex-grow pr-3">
                            <div className="flex flex-col gap-3">
                              {(grouped?.[p.pipelineId]?.[stage._id] || []).map(
                                (job, index) => {
                                  const priority = priorityConfig[job.Priority] || {
                                    border: "border-l-slate-300",
                                    bg: "bg-slate-200",
                                    text: "text-white",
                                  };

                                  return (
                                    <Draggable
                                      key={job.id}
                                      draggableId={job.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <Card
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          onClick={() => handleEditOpen(job.id)}
                                          onMouseEnter={() =>
                                            setHoveredJobId(job.id)
                                          }
                                          onMouseLeave={() =>
                                            setHoveredJobId(null)
                                          }
                                          className={`
                                            relative cursor-grab transition-all border-l-4 shadow-sm
                                            ${priority.border}
                                            ${
                                              snapshot.isDragging
                                                ? "bg-blue-50 rotate-1 shadow-lg"
                                                : "bg-white hover:shadow-md"
                                            }
                                          `}
                                        >
                                          <CardContent className="p-4 space-y-2">
                                            {/* DELETE BUTTON */}
                                            {hoveredJobId === job.id && (
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="absolute top-2 right-2 h-8 w-8 text-destructive hover:bg-destructive/10"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirm({
                                                          title: "Delete Job",
                                                          description:
                                                            "Are you sure you want to delete this job?",
                                                          onConfirm: () =>
                                                            deleteMutation.mutate(
                                                              job.id
                                                            ),
                                                        });
                                                      }}
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    Delete Job
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            )}

                                            {/* CONTENT */}
                                            <p className="font-bold text-slate-900 leading-tight">
                                              {truncateText(job.Name, 20)}
                                            </p>

                                            <p className="text-sm text-slate-600 font-medium">
                                              {job.Account?.join(", ")}
                                            </p>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                              <User className="h-3 w-3" />
                                              {job.JobAssignee?.join(", ") ||
                                                "Unassigned"}
                                            </div>

                                            <p className="text-xs text-slate-500 italic">
                                              {truncateText(job.Description, 50)}
                                            </p>

                                            {/* PRIORITY CHIP */}
                                            <Badge
                                              className={`${priority.bg} ${priority.text} border-none font-bold`}
                                            >
                                              {priority.label || job.Priority}
                                            </Badge>

                                            <div className="grid grid-cols-1 gap-1 pt-2">
                                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                                <Calendar className="h-3 w-3" />
                                                {dayjs(job.StartDate).format(
                                                  "DD MMM"
                                                )}
                                              </div>
                                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                                <Clock className="h-3 w-3" />
                                                {dayjs(job.DueDate).format(
                                                  "DD MMM"
                                                )}
                                              </div>
                                              <div className="flex items-center gap-1.5 text-[10px] text-primary/60">
                                                <RefreshCw className="h-3 w-3" />
                                                {dayjs(job.updatedAt).fromNow()}
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}
                                    </Draggable>
                                  );
                                }
                              )}
                              {provided.placeholder}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
    </div>
  );
};

export default AccountKanbanBoard;