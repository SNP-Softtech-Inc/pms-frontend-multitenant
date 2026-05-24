// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   Chip,
//   Button,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { accountsAPI, jobAPI } from "../../services/api";
// import { toast } from "react-toastify";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import MoveAutomationDrawer from "./MoveAutomationDrawer";
// import JobDrawer from "./JobDrawer";
// import EditJobDrawer from "./EditJobDrawer";
// import { useConfirm } from "../../components/ConfirmDialogContext";

// dayjs.extend(relativeTime);

// // 🎨 Column
// const Column = styled(Box)(({ theme }) => ({
//   minWidth: 320,
//   height: "75vh",
//   display: "flex",
//   flexDirection: "column",
//   background: "#f8fafc",
//   borderRadius: 12,
//   padding: theme.spacing(2),
//   boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
// }));

// // 🎨 Job Card
// const JobCard = styled(Paper)(({ isDragging }) => ({
//   padding: 16,
//   marginBottom: 12,
//   borderRadius: 12,
//   cursor: "grab",
//   transition: "0.2s",
//   background: isDragging ? "#e3f2fd" : "#ffffff",
//   boxShadow: isDragging
//     ? "0 8px 20px rgba(0,0,0,0.15)"
//     : "0 2px 6px rgba(0,0,0,0.05)",
// }));

// const KanbanBoard = ({ pipeline, onBack, isActive }) => {
//   const queryClient = useQueryClient();
//   const confirm = useConfirm();

//   const [jobDrawerOpen, setJobDrawerOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editJobId, setEditJobId] = useState(null);
//   const [hoveredJobId, setHoveredJobId] = useState(null);
//   const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
//   const [selectedAutomationData, setSelectedAutomationData] = useState(null);
//   const handleEditOpen = (jobId) => {
//     setEditJobId(jobId);
//     setDrawerOpen(true);
//   };

//   // ✅ Fetch Jobs
//   const { data: jobs = [], isLoading } = useQuery({
//     queryKey: ["pipeline-jobs", isActive, pipeline._id],
//     queryFn: async () => {
//       const accRes = await accountsAPI.getAccountsList();
//       const accounts = accRes.data.accountlist || [];

//       if (!accounts.length) return [];

//       const accountIds = accounts.map((a) => a._id).join(",");
//       const jobRes = await jobAPI.pipelineJoblist(accountIds, isActive);
//       console.log("job details in pipeline", jobRes);
//       return jobRes.data.jobList || [];
//     },
//   });

//   // ✅ Delete Mutation
//   const deleteMutation = useMutation({
//     mutationFn: (jobId) => jobAPI.deleteJob(jobId),

//     onSuccess: () => {
//       toast.success("Job deleted");
//       queryClient.invalidateQueries(["pipeline-jobs", isActive, pipeline._id]);
//     },

//     onError: () => {
//       toast.error("Delete failed");
//     },
//   });

//   // ✅ Update Stage Mutation
//   const updateStageMutation = useMutation({
//     mutationFn: ({ jobId, stageId }) =>
//       jobAPI.updateJobStage(jobId, { stageId }),

//     onMutate: async ({ jobId, stageId }) => {
//       await queryClient.cancelQueries([
//         "pipeline-jobs",
//         isActive,
//         pipeline._id,
//       ]);

//       const prevData = queryClient.getQueryData([
//         "pipeline-jobs",
//         isActive,
//         pipeline._id,
//       ]);

//       const stageObj = pipeline.stages.find((s) => s._id === stageId);

//       queryClient.setQueryData(
//         ["pipeline-jobs", isActive, pipeline._id],
//         (old = []) =>
//           old.map((job) =>
//             job.id === jobId
//               ? {
//                   ...job,
//                   Stage: {
//                     id: stageId,
//                     name: stageObj?.name,
//                   },
//                 }
//               : job,
//           ),
//       );

//       return { prevData };
//     },

//     onSuccess: (_, variables) => {
//       const stageObj = pipeline.stages.find((s) => s._id === variables.stageId);

//       toast.success(`Moved to "${stageObj?.name}"`);
//     },

//     onError: (_, __, context) => {
//       queryClient.setQueryData(
//         ["pipeline-jobs", isActive, pipeline._id],
//         context?.prevData,
//       );
//       toast.error("Failed to update");
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries(["pipeline-jobs", isActive, pipeline._id]);
//     },
//   });

//   // ✅ Filter & Group
//   const filteredJobs = useMemo(() => {
//     return jobs.filter((job) => job.PipelineId === pipeline._id);
//   }, [jobs, pipeline]);

//   const groupedJobs = useMemo(() => {
//     const grouped = {};
//     pipeline.stages.forEach((stage) => (grouped[stage._id] = []));

//     filteredJobs.forEach((job) => {
//       const stageId = job.Stage?.id;
//       if (stageId && grouped[stageId]) {
//         grouped[stageId].push(job);
//       }
//     });

//     return grouped;
//   }, [filteredJobs, pipeline]);



//   const onDragEnd = (result) => {
//     const { source, destination, draggableId } = result;

//     if (!destination) return;
//     if (source.droppableId === destination.droppableId) return;

//     const targetStage = pipeline.stages.find(
//       (s) => s._id === destination.droppableId,
//     );

//     // ✅ If stage has automations → open drawer
//     if (targetStage?.automations?.length > 0) {
//       setSelectedAutomationData({
//         jobId: draggableId,
//         stageId: destination.droppableId,
//         automations: targetStage.automations,
//       });

//       setAutomationDrawerOpen(true);
//     } else {
//       // ✅ No automation → direct move
//       updateStageMutation.mutate({
//         jobId: draggableId,
//         stageId: destination.droppableId,
//       });
//     }
//   };
//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const truncateText = (text, limit = 50) => {
//     if (!text) return "";
//     const cleanText = text.replace(/<[^>]+>/g, "");
//     return cleanText.length > limit
//       ? cleanText.slice(0, limit) + "..."
//       : cleanText;
//   };

//   return (
//     <Box p={3}>
//       {/* Header */}
//       <Box mb={3}>
//         <Typography
//           sx={{
//             cursor: "pointer",
//             mb: 1,
//             color: "primary.main",
//             display: "flex",
//             alignItems: "center",
//             gap: 0.5,
//           }}
//           onClick={onBack}
//         >
//           <ArrowBackIcon fontSize="small" />
//           Back
//         </Typography>

//         <Box display="flex" justifyContent="space-between">
//           <Typography variant="h5" fontWeight="bold">
//             {pipeline.pipelineName}
//           </Typography>

//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setJobDrawerOpen(true)}
//           >
//             Add Job
//           </Button>
//         </Box>
//       </Box>

//       {/* Board */}

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Box display="flex" gap={2} overflow="auto">
//           {pipeline.stages.map((stage) => (
//             <Droppable droppableId={stage._id} key={stage._id}>
//               {(provided) => (
//                 <Column ref={provided.innerRef} {...provided.droppableProps}>
//                   {/* Stage Header */}
//                   <Box display="flex" justifyContent="space-between" mb={2}>
//                     <Typography fontWeight="bold">{stage.name}</Typography>
//                     <Chip
//                       label={groupedJobs[stage._id]?.length || 0}
//                       size="small"
//                     />
//                   </Box>

//                   {/* Jobs */}
//                   <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
//                     {groupedJobs[stage._id]?.map((job, index) => {
//                       // ✅ Priority config per job
//                       const priorityConfig = {
//                         Urgent: {
//                           label: "Urgent",
//                           color: "#0E0402",
//                           textColor: "#fff",
//                         },
//                         High: {
//                           label: "High",
//                           color: "#fe676e",
//                           textColor: "#fff",
//                         },
//                         Medium: {
//                           label: "Medium",
//                           color: "#FFC300",
//                           textColor: "#000",
//                         },
//                         Low: {
//                           label: "Low",
//                           color: "#56c288",
//                           textColor: "#fff",
//                         },
//                       };

//                       const priority = priorityConfig[job.Priority] || {};

//                       return (
//                         <Draggable
//                           key={job.id}
//                           draggableId={job.id}
//                           index={index}
//                         >
//                           {(provided, snapshot) => (
//                             <JobCard
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               isDragging={snapshot.isDragging}
//                               onClick={() => handleEditOpen(job.id)}
//                               onMouseEnter={() => setHoveredJobId(job.id)}
//                               onMouseLeave={() => setHoveredJobId(null)}
//                               sx={{
//                                 position: "relative",
//                                 borderLeft: `4px solid ${priority.color || "#ccc"}`, // 🎯 pro UI
//                               }}
//                             >
//                               {/* DELETE */}
//                               {hoveredJobId === job.id && (
//                                 <Tooltip title="Delete">
//                                   <IconButton
//                                     size="small"
//                                     sx={{
//                                       position: "absolute",
//                                       top: 6,
//                                       right: 6,
//                                       color: "error.main",
//                                     }}
//                                     onClick={(e) => {
//                                       e.stopPropagation();

//                                       confirm({
//                                         title: "Delete Job",
//                                         description:
//                                           "Are you sure you want to delete this job?",
//                                         onConfirm: () =>
//                                           deleteMutation.mutate(job.id),
//                                       });
//                                     }}
//                                   >
//                                     <DeleteIcon fontSize="small" />
//                                   </IconButton>
//                                 </Tooltip>
//                               )}

//                               {/* CONTENT */}
//                               <Typography fontWeight="bold">
//                                 {/* {job.Name}
//                                  */}
//                                   {truncateText(job.Name, 20)}
//                               </Typography>

//                               <Typography variant="body2">
//                                 {job.Account?.join(", ")}
//                               </Typography>

//                               <Typography variant="caption">
//                                 👤 {job.JobAssignee?.join(", ") || "Unassigned"}
//                               </Typography>

//                               <Typography variant="caption" display="block">
//                                 {truncateText(job.Description, 20)}
//                               </Typography>

//                               {/* ✅ Priority Chip */}
//                               <Chip
//                                 label={priority.label || job.Priority}
//                                 size="small"
//                                 sx={{
//                                   mt: 1,
//                                   backgroundColor: priority.color || "#e0e0e0",
//                                   color: priority.textColor || "#000",
//                                   fontWeight: 600,
//                                 }}
//                               />

//                               <Typography variant="caption" display="block">
//                                 📅 {dayjs(job.StartDate).format("DD MMM")}
//                               </Typography>

//                               <Typography variant="caption" display="block">
//                                 ⏳ {dayjs(job.DueDate).format("DD MMM")}
//                               </Typography>

//                               <Typography variant="caption" display="block">
//                                 🔄 {dayjs(job.updatedAt).fromNow()}
//                               </Typography>
//                             </JobCard>
//                           )}
//                         </Draggable>
//                       );
//                     })}

//                     {provided.placeholder}
//                   </Box>
//                 </Column>
//               )}
//             </Droppable>
//           ))}
//         </Box>
//       </DragDropContext>
//       {/* Drawers */}
//       <JobDrawer open={jobDrawerOpen} onClose={() => setJobDrawerOpen(false)} selectedPipeline={pipeline} />

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

// export default KanbanBoard;


import React, { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsAPI, jobAPI } from "../../services/api";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User, 
  Calendar, 
  Clock, 
  RefreshCw 
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Shadcn Components
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

// Custom Drawers (ensure these are also converted to shadcn/Sheet or Dialog)
import MoveAutomationDrawer from "./MoveAutomationDrawer";
import JobDrawer from "./JobDrawer";
import EditJobDrawer from "./EditJobDrawer";
import { useConfirm } from "../../components/ConfirmDialogContext";

dayjs.extend(relativeTime);

const KanbanBoard = ({ pipeline, onBack, isActive }) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [jobDrawerOpen, setJobDrawerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [hoveredJobId, setHoveredJobId] = useState(null);
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState(null);

  const handleEditOpen = (jobId) => {
    setEditJobId(jobId);
    setDrawerOpen(true);
  };

  // ✅ Fetch Jobs (Logic remains identical)
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

  // ✅ Mutations (Logic remains identical)
  const deleteMutation = useMutation({
    mutationFn: (jobId) => jobAPI.deleteJob(jobId),
    onSuccess: () => {
      toast.success("Job deleted");
      queryClient.invalidateQueries(["pipeline-jobs", isActive, pipeline._id]);
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ jobId, stageId }) => jobAPI.updateJobStage(jobId, { stageId }),
    onMutate: async ({ jobId, stageId }) => {
      await queryClient.cancelQueries(["pipeline-jobs", isActive, pipeline._id]);
      const prevData = queryClient.getQueryData(["pipeline-jobs", isActive, pipeline._id]);
      const stageObj = pipeline.stages.find((s) => s._id === stageId);

      queryClient.setQueryData(["pipeline-jobs", isActive, pipeline._id], (old = []) =>
        old.map((job) =>
          job.id === jobId ? { ...job, Stage: { id: stageId, name: stageObj?.name } } : job
        )
      );
      return { prevData };
    },
    onSuccess: (_, variables) => {
      const stageObj = pipeline.stages.find((s) => s._id === variables.stageId);
      toast.success(`Moved to "${stageObj?.name}"`);
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["pipeline-jobs", isActive, pipeline._id], context?.prevData);
      toast.error("Failed to update");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["pipeline-jobs", isActive, pipeline._id]);
    },
  });

  // ✅ Grouping Logic
  const filteredJobs = useMemo(() => jobs.filter((job) => job.PipelineId === pipeline._id), [jobs, pipeline]);

  const groupedJobs = useMemo(() => {
    const grouped = {};
    pipeline.stages.forEach((stage) => (grouped[stage._id] = []));
    filteredJobs.forEach((job) => {
      const stageId = job.Stage?.id;
      if (stageId && grouped[stageId]) grouped[stageId].push(job);
    });
    return grouped;
  }, [filteredJobs, pipeline]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const targetStage = pipeline.stages.find((s) => s._id === destination.droppableId);
    if (targetStage?.automations?.length > 0) {
      setSelectedAutomationData({ jobId: draggableId, stageId: destination.droppableId, automations: targetStage.automations });
      setAutomationDrawerOpen(true);
    } else {
      updateStageMutation.mutate({ jobId: draggableId, stageId: destination.droppableId });
    }
  };

  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    const cleanText = text.replace(/<[^>]+>/g, "");
    return cleanText.length > limit ? cleanText.slice(0, limit) + "..." : cleanText;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10 space-x-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[75vh] w-[320px] rounded-xl" />
        ))}
      </div>
    );
  }

  const priorityConfig = {
    Urgent: { label: "Urgent", bg: "bg-[#0E0402]", text: "text-white", border: "border-l-[#0E0402]" },
    High: { label: "High", bg: "bg-[#fe676e]", text: "text-white", border: "border-l-[#fe676e]" },
    Medium: { label: "Medium", bg: "bg-[#FFC300]", text: "text-black", border: "border-l-[#FFC300]" },
    Low: { label: "Low", bg: "bg-[#56c288]", text: "text-white", border: "border-l-[#56c288]" },
  };

  return (
    <div className="p-6">
      {/* Header */}
      {/* <div className="mb-6 flex flex-col gap-2">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{pipeline.pipelineName}</h1>
          <Button onClick={() => setJobDrawerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Job
          </Button>
        </div>
      </div> */}
<div className="mb-8 px-1">
  {/* Back button with improved hover state */}
  <button 
    onClick={onBack} 
    className="group mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
  >
    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> 
    Back to Pipelines
  </button>

  {/* Main header area */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {pipeline.pipelineName}
      </h1>
      {pipeline.description && (
        <p className="text-sm text-muted-foreground">
          {pipeline.description}
        </p>
      )}
    </div>
    
    <Button 
      onClick={() => setJobDrawerOpen(true)}
      className="shadow-sm hover:shadow transition-shadow duration-200"
    >
      <Plus className="mr-2 h-4 w-4" /> 
      Add Job
    </Button>
  </div>
</div>
      {/* Board */}
      {/* <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipeline.stages.map((stage) => (
            <Droppable droppableId={stage._id} key={stage._id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col min-w-[320px] h-[75vh]  rounded-xl p-4 shadow-sm border border-slate-200"
                >
                 
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-semibold text-slate-700">{stage.name}</h3>
                    <Badge variant="secondary" className="rounded-full">
                      {groupedJobs[stage._id]?.length || 0}
                    </Badge>
                  </div>

                 
                  <ScrollArea className="flex-grow pr-3">
                    <div className="flex flex-col gap-3">
                      {groupedJobs[stage._id]?.map((job, index) => {
                        const priority = priorityConfig[job.Priority] || { border: "border-l-slate-300", bg: "bg-slate-200" };
                        
                        return (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => handleEditOpen(job.id)}
                                onMouseEnter={() => setHoveredJobId(job.id)}
                                onMouseLeave={() => setHoveredJobId(null)}
                                className={`
                                  relative cursor-grab transition-all border-l-4 shadow-sm
                                  ${priority.border}
                                  ${snapshot.isDragging ? "bg-blue-50 rotate-2 shadow-lg" : "bg-white hover:shadow-md"}
                                `}
                              >
                                <CardContent className="p-4 space-y-2">
                                 
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
                                                description: "Are you sure you want to delete this job?",
                                                onConfirm: () => deleteMutation.mutate(job.id),
                                              });
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete Job</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}

                                  <p className="font-bold text-slate-900 leading-tight">
                                    {truncateText(job.Name, 20)}
                                  </p>
                                  
                                  <p className="text-sm text-slate-600 font-medium">
                                    {job.Account?.join(", ")}
                                  </p>

                                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <User className="h-3 w-3" />
                                    {job.JobAssignee?.join(", ") || "Unassigned"}
                                  </div>

                                  <p className="text-xs text-slate-500 italic">
                                    {truncateText(job.Description, 20)}
                                  </p>

                                  <Badge className={`${priority.bg} ${priority.text} border-none font-bold`}>
                                    {priority.label || job.Priority}
                                  </Badge>

                                  <div className="grid grid-cols-1 gap-1 pt-2">
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                      <Calendar className="h-3 w-3" />
                                      Start: {dayjs(job.StartDate).format("DD MMM")}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                      <Clock className="h-3 w-3" />
                                      Due: {dayjs(job.DueDate).format("DD MMM")}
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
                      })}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext> */}


<DragDropContext onDragEnd={onDragEnd}>
  <div className="flex gap-4 overflow-x-auto pb-4">

    {pipeline.stages.map((stage) => (
      <Droppable droppableId={stage._id} key={stage._id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="
              flex flex-col min-w-[320px] h-[75vh]
              rounded-xl p-4
              border border-border
              bg-card
              shadow-sm
              hover:shadow-md
              transition-all
            "
          >

            {/* Stage Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-semibold text-foreground">
                {stage.name}
              </h3>

              <Badge
                variant="secondary"
                className="rounded-full bg-muted text-muted-foreground"
              >
                {groupedJobs[stage._id]?.length || 0}
              </Badge>
            </div>

            {/* Jobs List */}
            <ScrollArea className="flex-grow pr-2">
              <div className="flex flex-col gap-3">

                {groupedJobs[stage._id]?.map((job, index) => {
                  const priority = priorityConfig[job.Priority] || {
                    border: "border-l-border",
                    bg: "bg-muted",
                    text: "text-foreground",
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
                          onMouseEnter={() => setHoveredJobId(job.id)}
                          onMouseLeave={() => setHoveredJobId(null)}
                          className={`
                            relative cursor-grab
                            border-l-4 border-border
                            bg-card text-card-foreground
                            transition-all rounded-lg

                            ${
                              snapshot.isDragging
                                ? "bg-accent/40 rotate-2 shadow-lg"
                                : "hover:bg-accent/20 hover:shadow-md"
                            }

                            ${priority.border}
                          `}
                        >
                          <CardContent className="p-4 space-y-2">

                            {/* Delete Button */}
                            {hoveredJobId === job.id && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="
                                        absolute top-2 right-2
                                        h-8 w-8
                                        text-destructive
                                        hover:bg-destructive/10
                                      "
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        confirm({
                                          title: "Delete Job",
                                          description:
                                            "Are you sure you want to delete this job?",
                                          onConfirm: () =>
                                            deleteMutation.mutate(job.id),
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
                            <p className="font-semibold text-card-foreground leading-tight">
                              {truncateText(job.Name, 20)}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {job.Account?.join(", ")}
                            </p>

                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {job.JobAssignee?.join(", ") || "Unassigned"}
                            </div>

                            <p className="text-xs text-muted-foreground italic">
                              {truncateText(job.Description, 20)}
                            </p>

                            {/* PRIORITY */}
                            <Badge
                              className={`
                                ${priority.bg}
                                ${priority.text}
                                border-none font-semibold
                              `}
                            >
                              {priority.label || job.Priority}
                            </Badge>

                            {/* DATES */}
                            <div className="grid grid-cols-1 gap-1 pt-2">

                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Start: {dayjs(job.StartDate).format("DD MMM")}
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Due: {dayjs(job.DueDate).format("DD MMM")}
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] text-primary">
                                <RefreshCw className="h-3 w-3" />
                                {dayjs(job.updatedAt).fromNow()}
                              </div>

                            </div>

                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            </ScrollArea>

          </div>
        )}
      </Droppable>
    ))}

  </div>
</DragDropContext>
      {/* Drawers */}
      <JobDrawer 
        open={jobDrawerOpen} 
        onClose={() => setJobDrawerOpen(false)} 
        selectedPipeline={pipeline} 
      />
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

export default KanbanBoard;