// // src/pages/Workflow/Pipeline.js
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import { templateAPI } from "../../services/api";
// import { useAuth } from "../../context/AuthContext";
// import KanbanBoard from "./KanbanBoard";

// const Pipeline = () => {
//   const { user, loading: authLoading } = useAuth();

//   const [pipelines, setPipelines] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedPipeline, setSelectedPipeline] = useState(null);

//   useEffect(() => {
//     if (!authLoading && user?.id) {
//       fetchPipelines(user.id);
//     }
//   }, [authLoading, user]);

//   const fetchPipelines = async (userId) => {
//     setLoading(true);
//     try {
//       const response = await templateAPI.getPipelinesByUser(userId);
//       setPipelines(response.data.pipeline || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load pipelines");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePipelineClick = async (pipelineId) => {
//     try {
//       setLoading(true);
//       const res = await templateAPI.getPipelineById(pipelineId);
//       setSelectedPipeline(res.data.pipeline);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch pipeline details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔁 Show Kanban when selected
//   if (selectedPipeline) {
//     console.log("selcted pipeline",selectedPipeline)
//     return (
//       <KanbanBoard
//         pipeline={selectedPipeline}
//         onBack={() => setSelectedPipeline(null)}
//         isActive={true}
//       />
//     );
//   }

//   if (authLoading || loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!pipelines.length) {
//     return (
//       <Box mt={4} textAlign="center">
//         <Typography>No pipelines found</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box mt={4}>
//       <Typography variant="h6" mb={2}>
//         My Pipelines
//       </Typography>

//       <List>
//         {pipelines.map((pipeline) => (
//           <ListItem
//             key={pipeline._id}
//             divider
//             button
//             onClick={() => handlePipelineClick(pipeline._id)}
//           >
//             <ListItemText
//               primary={pipeline.pipelineName}
//               secondary={`Created: ${new Date(
//                 pipeline.createdAt
//               ).toLocaleDateString()}`}
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default Pipeline;

// src/pages/Workflow/Pipeline.js
import React, { useEffect, useState } from "react";
import {
  Loader2,
  ArrowLeft,
  CalendarDays,
  GitBranch,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { templateAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import KanbanBoard from "./KanbanBoard";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router-dom";
const Pipeline = () => {
  const { user, loading: authLoading } = useAuth();
const navigate = useNavigate();
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
 const [globalFilter, setGlobalFilter] = useState("");
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

  // Define table columns for pipelines

  const columns = [
    {
      accessorKey: "pipelineName",
      header: "Pipeline Name",
      cell: ({ row }) => (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
          onClick={() => handlePipelineClick(row.original._id)}
        >
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("pipelineName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>{date.toLocaleDateString()}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "stages",
      header: "Stages",
      cell: ({ row }) => {
        const stages = row.original.stages || [];
        return (
          <div className="flex gap-1">
            <Badge variant="secondary">{stages.length} stages</Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const pipeline = row.original;
        return (
          <div className="flex gap-2">
            {/* <Button
              onClick={() => handlePipelineClick(pipeline._id)}
              variant="ghost"
              size="sm"
            >
              View Pipeline
            </Button> */}
            <Button
              onClick={() => navigate(`/firmtemp/pipelines/pipelineform?edit=${pipeline._id}`)}
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  // 🔁 Show Kanban when selected
  if (selectedPipeline) {
    console.log("selected pipeline", selectedPipeline);
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
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pipelines.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">No Pipelines Found</CardTitle>
            <CardDescription className="text-center">
              You don't have any pipelines yet. Create your first pipeline to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Users className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Pipelines</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all your workflow pipelines
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipelines</CardTitle>
          <CardDescription>
            Select a pipeline to view its kanban board and manage tasks
          </CardDescription>
        </CardHeader>
        <CardContent>

                    <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <DataTable
            columns={columns}
            data={pipelines}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
             enableRowSelection={false}
            getRowId={(row) => row._id}
            emptyMessage="No pipelines found"
            emptyDescription="Create your first pipeline to get started"
            pageSize={30}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Pipeline;