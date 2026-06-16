// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Menu,
//   MenuItem,
//   Typography,
//   Button,
//   Stack,
//   Tab,
// } from "@mui/material";
// import { useNavigate, Link } from "react-router-dom";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// import { useConfirm } from "../../../components/ConfirmDialogContext";
// import { templateAPI } from "../../../services/api";
// import { toast } from "react-toastify";
// const PipelineTable = () => {
//   const navigate = useNavigate();
//   const confirm = useConfirm();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedPipeline, setSelectedPipeline] = useState(null);

//   const [pipelineData, setPipelineData] = useState([]);

//   useEffect(() => {
//     fetchPipelineData();
//   }, []);

//   const fetchPipelineData = async () => {
//     try {
//       const { data } = await templateAPI.getAllPipelines();
//       setPipelineData(data.pipeline || data);
//     } catch (error) {
//       console.error("Error fetching pipeline data:", error);
//     }
//   };

//   const handleMenuOpen = (event, pipeline) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedPipeline(pipeline);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedPipeline(null);
//   };

//   // ============================
//   // 💥 EDIT Pipeline
//   // ============================
//   // EDIT Pipeline - Navigate with pipeline ID
//   const handleEdit = () => {
//     if (selectedPipeline) {
//       navigate(`/firmtemp/pipelines/pipelineform?edit=${selectedPipeline._id}`);
//     }
//     handleMenuClose();
//   };

//   const handleDelete = () => {
//     if (!selectedPipeline) return;

//     confirm({
//       title: "Delete Pipeline",
//       description: `Are you sure you want to delete "${selectedPipeline.pipelineName}"?`,

//       onConfirm: async () => {
//         try {
//           await templateAPI.deletePipeline(selectedPipeline._id);

//           toast.success("Pipeline deleted successfully");

//           // ✅ Optimistic UI update (better UX)
//           setPipelineData((prev) =>
//             prev.filter((p) => p._id !== selectedPipeline._id),
//           );

//           handleMenuClose();
//         } catch (error) {
//           console.error("Error deleting pipeline:", error);
//           toast.error(
//             error?.response?.data?.message || "Failed to delete pipeline",
//           );
//         }
//       },
//     });
//   };
//   const handelCreateNew = () => {
//     // Navigate to empty proposal form
//     navigate(`/firmtemp/pipelines/pipelineform`);
//   };
//   return (
//     <>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography variant="h6" component="div">
//           Pipeline Templates
//         </Typography>
//         <Button variant="contained" color="primary" onClick={handelCreateNew}>
//           Create New Pipeline
//         </Button>
//       </Stack>
//       <TableContainer component={Paper} elevation={2}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Pipeline Name</TableCell>
//               <TableCell>Total Stages</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {pipelineData?.length > 0 ? (
//               pipelineData.map((pipeline, index) => (
//                 <TableRow key={pipeline._id}>
//                   {/* <TableCell>{pipeline.pipelineName}</TableCell> */}
//                   <TableCell>
//                     <Link
//                       to={`/firmtemp/pipelines/pipelineform?edit=${pipeline._id}`}
//                       style={{
//                         textDecoration: "none",
//                         color: "black",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {pipeline.pipelineName}
//                     </Link>
//                   </TableCell>
//                   <TableCell>{pipeline.stages?.length}</TableCell>

//                   <TableCell>
//                     <IconButton onClick={(e) => handleMenuOpen(e, pipeline)}>
//                       <MoreVertIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={4} sx={{ textAlign: "center", py: 3 }}>
//                   No pipelines found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//         {/* Three-dot Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={handleEdit}>Edit</MenuItem>
//           <MenuItem onClick={handleDelete}>Delete</MenuItem>
//         </Menu>
//       </TableContainer>
//     </>
//   );
// };

// export default PipelineTable;


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useToastContext } from "../../../context/ToastContext";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { DataTable } from "../../../components/data-table/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { templateAPI } from "../../../services/api";

const PipelineTable = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
const {showToast} = useToastContext();
  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    setLoading(true);
    try {
      const { data } = await templateAPI.getAllPipelines();
      setPipelineData(data.pipeline || data);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/firmtemp/pipelines/pipelineform?edit=${id}`);
  };

  const handleDelete = async (id, pipelineName) => {
    confirm({
      title: "Delete Pipeline",
      // description: `Are you sure you want to delete "${pipelineName}"?`,
       description: (
        <>
          Are you sure you want to delete this orgnizer{" "}
          <span className="font-semibold text-red-600">
            "{pipelineName}"
          </span>
          ?
        </>
      ),
      onConfirm: async () => {
        try {
          await templateAPI.deletePipeline(id);
          showToast({
            title: "Pipeline deleted successfully",
            type: "success",
            description: "The pipeline has been deleted successfully"
          });

          // ✅ Optimistic UI update (better UX)
          setPipelineData((prev) => prev.filter((p) => p._id !== id));
        } catch (error) {
          console.error("Error deleting pipeline:", error);
          showToast({
            title: "Failed to delete pipeline",
            type: "error",
            description: error?.response?.data?.message || "An error occurred while deleting the pipeline"
          });
        }
      },
    });
  };

  const handleCreateNew = () => {
    navigate(`/firmtemp/pipelines/pipelineform`);
  };

  const pipelineColumns = useMemo(
    () => [
      {
        accessorKey: "pipelineName",
        header: "Pipeline Name",
        cell: ({ getValue, row }) => (
          <button
            onClick={() => handleEdit(row.original._id)}
            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
          >
            {getValue()}
          </button>
        ),
      },
      {
        accessorKey: "stages",
        header: "Total Stages",
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue()?.length || 0}</Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(row.original._id, row.original.pipelineName)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pipeline Templates</h2>
        <Button size="sm" onClick={handleCreateNew}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Pipeline
        </Button>
      </div>
      <DataTable
        columns={pipelineColumns}
        data={pipelineData}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No pipelines found"
        emptyDescription="Create your first pipeline template to get started"
        pageSize={25}
      />
    </div>
  );
};

export default PipelineTable;