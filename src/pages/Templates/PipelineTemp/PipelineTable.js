import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Stack,
  Tab,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useConfirm } from "../../../components/ConfirmDialogContext";
import { templateAPI } from "../../../services/api";
import { toast } from "react-toastify";
const PipelineTable = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);

  const [pipelineData, setPipelineData] = useState([]);

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const { data } = await templateAPI.getAllPipelines();
      setPipelineData(data.pipeline || data);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const handleMenuOpen = (event, pipeline) => {
    setAnchorEl(event.currentTarget);
    setSelectedPipeline(pipeline);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPipeline(null);
  };

  // ============================
  // 💥 EDIT Pipeline
  // ============================
  // EDIT Pipeline - Navigate with pipeline ID
  const handleEdit = () => {
    if (selectedPipeline) {
      navigate(`/firmtemp/pipelines/pipelineform?edit=${selectedPipeline._id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (!selectedPipeline) return;

    confirm({
      title: "Delete Pipeline",
      description: `Are you sure you want to delete "${selectedPipeline.pipelineName}"?`,

      onConfirm: async () => {
        try {
          await templateAPI.deletePipeline(selectedPipeline._id);

          toast.success("Pipeline deleted successfully");

          // ✅ Optimistic UI update (better UX)
          setPipelineData((prev) =>
            prev.filter((p) => p._id !== selectedPipeline._id),
          );

          handleMenuClose();
        } catch (error) {
          console.error("Error deleting pipeline:", error);
          toast.error(
            error?.response?.data?.message || "Failed to delete pipeline",
          );
        }
      },
    });
  };
  const handelCreateNew = () => {
    // Navigate to empty proposal form
    navigate(`/firmtemp/pipelines/pipelineform`);
  };
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" component="div">
          Pipeline Templates
        </Typography>
        <Button variant="contained" color="primary" onClick={handelCreateNew}>
          Create New Pipeline
        </Button>
      </Stack>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pipeline Name</TableCell>
              <TableCell>Total Stages</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pipelineData?.length > 0 ? (
              pipelineData.map((pipeline, index) => (
                <TableRow key={pipeline._id}>
                  {/* <TableCell>{pipeline.pipelineName}</TableCell> */}
                  <TableCell>
                    <Link
                      to={`/firmtemp/pipelines/pipelineform?edit=${pipeline._id}`}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: 500,
                      }}
                    >
                      {pipeline.pipelineName}
                    </Link>
                  </TableCell>
                  <TableCell>{pipeline.stages?.length}</TableCell>

                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, pipeline)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 3 }}>
                  No pipelines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Three-dot Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </TableContainer>
    </>
  );
};

export default PipelineTable;
