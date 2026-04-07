
// // src/pages/Workflow/KanbanBoard.js
// import React, { useMemo } from "react";
// import { Box, Typography, Button, Paper } from "@mui/material";
// import { useQuery } from "@tanstack/react-query";
// import { accountsAPI, jobAPI } from "../../services/api";

// const KanbanBoard = ({ pipeline, onBack, isActive }) => {
//   // ✅ Normalize pipeline stages (_id → id)
//   const stages = useMemo(() => {
//     return (pipeline?.stages || []).map((stage) => ({
//       ...stage,
//       id: stage._id || stage.id,
//     }));
//   }, [pipeline]);

//   // ✅ Fetch jobs
//   const { data = [], isLoading } = useQuery({
//     queryKey: ["pipeline-jobs", isActive],
//     queryFn: async () => {
//       const accRes = await accountsAPI.getAccountsList();
//       const accounts = accRes.data.accountlist || [];

//       if (accounts.length === 0) return [];

//       const accountIds = accounts.map((acc) => acc._id).join(",");

//       const jobRes = await jobAPI.pipelineJoblist(
//         accountIds,
//         isActive
//       );

//       console.log("pipeline joblist kanban", jobRes);

//       return jobRes.data.jobList || [];
//     },
//   });

//   const jobs = data;

//   // ✅ Normalize jobs (Stage.id safety)
//   const normalizedJobs = useMemo(() => {
//     return jobs.map((job) => ({
//       ...job,
//       Stage: (job.Stage || []).map((s) => ({
//         ...s,
//         id: s.id || s._id,
//       })),
//     }));
//   }, [jobs]);

//   // ✅ Filter jobs by selected pipeline
//   const filteredJobs = useMemo(() => {
//     return normalizedJobs.filter(
//       (job) => job.PipelineId === pipeline?._id
//     );
//   }, [normalizedJobs, pipeline]);

//   // ✅ Group jobs by stage
//   const jobsByStage = useMemo(() => {
//     const grouped = {};

//     filteredJobs.forEach((job) => {
//       if (Array.isArray(job.Stage)) {
//         job.Stage.forEach((stage) => {
//           const stageId = stage?.id;

//           if (!stageId) return;

//           if (!grouped[stageId]) {
//             grouped[stageId] = [];
//           }

//           grouped[stageId].push(job);
//         });
//       }
//     });

//     return grouped;
//   }, [filteredJobs]);

//   return (
//     <Box p={2}>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Typography variant="h5">
//           {pipeline?.pipelineName}
//         </Typography>
//         <Button variant="outlined" onClick={onBack}>
//           Back
//         </Button>
//       </Box>

//       {/* Loading */}
//       {isLoading && <Typography>Loading jobs...</Typography>}

//       {/* Kanban Board */}
//       <Box
//         display="flex"
//         gap={2}
//         sx={{
//           overflowX: "auto",
//           alignItems: "flex-start",
//         }}
//       >
//         {stages.map((stage) => {
//           const stageJobs = jobsByStage[stage.id] || [];

//           return (
//             <Box
//               key={stage.id}
//               sx={{
//                 minWidth: 280,
//                 height: "70vh",
//                 backgroundColor: "#f4f5f7",
//                 borderRadius: 2,
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               {/* Stage Title */}
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontWeight: 600, mb: 1 }}
//               >
//                 {stage.name} ({stageJobs.length})
//               </Typography>

//               {/* Job Cards */}
//               <Box
//                 sx={{
//                   overflowY: "auto",
//                   flex: 1,
//                 }}
//               >
//                 {stageJobs.map((job) => (
//                   <Paper
//                     key={job.id}
//                     sx={{
//                       p: 1.5,
//                       mb: 1,
//                       borderRadius: 2,
//                       cursor: "pointer",
//                       "&:hover": {
//                         backgroundColor: "#e3f2fd",
//                       },
//                     }}
//                   >
//                     {/* Title + Priority */}
//                     <Box
//                       display="flex"
//                       justifyContent="space-between"
//                     >
//                       <Typography
//                         variant="body2"
//                         fontWeight={600}
//                       >
//                         {job.Name}
//                       </Typography>

//                       <Box
//                         sx={{
//                           width: 8,
//                           height: 8,
//                           borderRadius: "50%",
//                           backgroundColor:
//                             job.Priority === "High"
//                               ? "red"
//                               : job.Priority === "Medium"
//                               ? "orange"
//                               : "green",
//                         }}
//                       />
//                     </Box>

//                     {/* Account */}
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                     >
//                       {job.Account?.join(", ")}
//                     </Typography>

//                     {/* Assignees */}
//                     <Typography
//                       variant="caption"
//                       display="block"
//                     >
//                       {job.JobAssignee?.join(", ")}
//                     </Typography>

//                     {/* Due Date */}
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                     >
//                       Due:{" "}
//                       {job.DueDate
//                         ? new Date(
//                             job.DueDate
//                           ).toLocaleDateString()
//                         : "-"}
//                     </Typography>
//                   </Paper>
//                 ))}

//                 {/* Empty State */}
//                 {stageJobs.length === 0 && (
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mt: 1 }}
//                   >
//                     No jobs
//                   </Typography>
//                 )}
//               </Box>
//             </Box>
//           );
//         })}
//       </Box>
//     </Box>
//   );
// };

// export default KanbanBoard;


import React, { useMemo, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { accountsAPI, jobAPI } from "../../services/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AutomationDrawer from "./AutomationDrawer";

const KanbanBoard = ({ pipeline, onBack, isActive }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [targetStage, setTargetStage] = useState(null);
  const [stageAutomations, setStageAutomations] = useState([]);

  // ✅ Normalize stages
  const stages = useMemo(() => {
    return (pipeline?.stages || []).map((stage) => ({
      ...stage,
      id: stage._id || stage.id,
    }));
  }, [pipeline]);

  // ✅ Fetch jobs
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["pipeline-jobs", isActive],
    queryFn: async () => {
      const accRes = await accountsAPI.getAccountsList();
      const accounts = accRes.data.accountlist || [];

      if (accounts.length === 0) return [];

      const accountIds = accounts.map((acc) => acc._id).join(",");

      const jobRes = await jobAPI.pipelineJoblist(accountIds, isActive);

      return jobRes.data.jobList || [];
    },
  });

  const normalizedJobs = useMemo(() => {
    return data.map((job) => ({
      ...job,
      Stage: (job.Stage || []).map((s) => ({
        ...s,
        id: s.id || s._id,
      })),
    }));
  }, [data]);

  const filteredJobs = useMemo(() => {
    return normalizedJobs.filter(
      (job) => job.PipelineId === pipeline?._id
    );
  }, [normalizedJobs, pipeline]);

  const jobsByStage = useMemo(() => {
    const grouped = {};
    filteredJobs.forEach((job) => {
      job.Stage?.forEach((stage) => {
        if (!grouped[stage.id]) grouped[stage.id] = [];
        grouped[stage.id].push(job);
      });
    });
    return grouped;
  }, [filteredJobs]);

  // ================= DRAG END =================
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const jobId = result.draggableId;
    const destinationStageId = result.destination.droppableId;

    const stage = stages.find((s) => s.id === destinationStageId);

    if (!stage) return;

    const automations = stage.automations || [];

    const job = filteredJobs.find((j) => j.id === jobId);

    // ✅ If automations exist → open drawer
    if (automations.length > 0) {
      setSelectedJob(job);
      setTargetStage(destinationStageId);
      setStageAutomations(automations);
      setDrawerOpen(true);
    } else {
      // ✅ Direct move
      await jobAPI.updateJobStage(jobId, {
        stageId: destinationStageId,
      });

      refetch();
    }
  };

  // ================= MOVE AFTER AUTOMATION =================
  const handleMoveJob = async (jobId, stageId, automations) => {
    try {
      await jobAPI.runStageAutomation({
        jobId,
        stageId,
        automations,
      });

      setDrawerOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">
          {pipeline?.pipelineName}
        </Typography>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
      </Box>

      {isLoading && <Typography>Loading...</Typography>}

      {/* ================= DND ================= */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="flex" gap={2} sx={{ overflowX: "auto" }}>
          {stages.map((stage) => {
            const stageJobs = jobsByStage[stage.id] || [];

            return (
              <Droppable droppableId={stage.id} key={stage.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minWidth: 280,
                      height: "70vh",
                      backgroundColor: "#f4f5f7",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography fontWeight={600}>
                      {stage.name} ({stageJobs.length})
                    </Typography>

                    {stageJobs.map((job, index) => (
                      <Draggable
                        key={job.id}
                        draggableId={job.id}
                        index={index}
                      >
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              borderRadius: 2,
                              cursor: "pointer",
                            }}
                          >
                            <Typography fontWeight={600}>
                              {job.Name}
                            </Typography>

                            <Typography variant="caption">
                              {job.Account?.join(", ")}
                            </Typography>
                          </Paper>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {stageJobs.length === 0 && (
                      <Typography variant="body2">
                        No jobs
                      </Typography>
                    )}
                  </Box>
                )}
              </Droppable>
            );
          })}
        </Box>
      </DragDropContext>

      {/* ================= AUTOMATION DRAWER ================= */}
      <AutomationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        automations={stageAutomations}
        jobId={selectedJob?.id}
        targetStage={targetStage}
        accountId={selectedJob?.Account?.[0]}
        accountName={selectedJob?.Account?.[0]}
        onMoveJob={handleMoveJob}
      />
    </Box>
  );
};

export default KanbanBoard;