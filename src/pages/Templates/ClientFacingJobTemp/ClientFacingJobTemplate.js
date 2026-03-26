import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Drawer,
  Select,
  MenuItem,
  TextField,
  FormControl,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";
import { templateAPI } from "../../../services/api";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { useConfirm } from "../../../components/ConfirmDialogContext";

const Clientfacing = () => {
    const confirm = useConfirm();
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [clientFacingName, setClientFacingName] = useState("");
  const [clientFacingDescription, setClientFacingDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [jobId, setJobId] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    color: "",
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = [
    "#0d6efd",
    "#6c757d",
    "#198754",
    "#dc3545",
    "#ffc107",
    "#0dcaf0",
    "#FF5722",
    "#212529",
  ];

  // ✅ LOAD DATA
  const loadJobStatus = async () => {
    try {
      setLoading(true);
      const res = await templateAPI.getAllJobStatus();
      setClientFacingJobs(res.data.clientFacingJobStatues || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobStatus();
  }, []);

  // ✅ VALIDATION
  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", description: "", color: "" };

    if (!selectedColor) {
      newErrors.color = "Please select a color";
      valid = false;
    }
    if (!clientFacingName.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!clientFacingDescription.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ✅ CREATE
  const createJobFacing = async () => {
    if (!validateForm()) return;

    try {
      await templateAPI.createJobStatus({
        clientfacingName: clientFacingName.trim(),
        clientfacingColour: selectedColor,
        clientfacingdescription: clientFacingDescription.trim(),
      });

      toast.success("Created successfully");
      handleDrawerClose();
      loadJobStatus();
    } catch (error) {
      console.error(error);
      toast.error("Create failed");
    }
  };

  // ✅ UPDATE
  const updateJobFacing = async () => {
    try {
      await templateAPI.updateJobStatus(jobId, {
        clientfacingName: clientFacingName,
        clientfacingColour: selectedColor,
        clientfacingdescription: clientFacingDescription,
      });

      toast.success("Updated successfully");
      handleNewDrawerClose();
      loadJobStatus();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ DELETE
  
const deleteJobFacing = (id) => {

  confirm({
    title: "Delete Job Status",
    description: "Are you sure you want to delete this job status?",
    onConfirm: async () => {
      try {
        await templateAPI.deleteJobStatus(id);
        toast.success("Deleted successfully");
        loadJobStatus();
      } catch (error) {
        console.error(error);
        toast.error("Delete failed");
      }
    },
  });
};
  // ✅ EDIT
  const handleEdit = async (id) => {
    setIsNewDrawerOpen(true);

    try {
      const res = await templateAPI.getJobStatusById(id);
      const data = res.data.clientfacingjobstatuses;

      setJobId(data._id);
      setSelectedColor(data.clientfacingColour);
      setClientFacingName(data.clientfacingName);
      setClientFacingDescription(data.clientfacingdescription);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ RESET
  const resetForm = () => {
    setClientFacingName("");
    setClientFacingDescription("");
    setSelectedColor("");
    setErrors({ name: "", description: "", color: "" });
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    resetForm();
  };

  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
    setJobId(null);
    resetForm();
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>
        Create Status
      </Button>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box m={2}>
          {clientFacingJobs.map((job) => (
            <Box
              key={job._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mb: 2,
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flex: 1,
                  minWidth: 0, // allows the box to shrink and wrap text
                }}
              >
                <GoDotFill
                  style={{
                    color: job.clientfacingColour,
                    fontSize: "28px",
                    flexShrink: 0,
                    marginRight: "12px",
                    marginTop: "4px", // aligns dot with multiline text
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body1" fontWeight="600">
                    {job.clientfacingName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.clientfacingdescription}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginLeft: 2,
                }}
              >
                <IconButton
                  onClick={() => handleEdit(job._id)}
                  sx={{ color: "#1168bf" }}
                >
                  <RiEdit2Line />
                </IconButton>
                <IconButton
                  onClick={() => deleteJobFacing(job._id)}
                  sx={{ color: "#f52d2d" }}
                >
                  <RiDeleteBin6Line />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* SINGLE DRAWER FOR CREATE & EDIT */}
      <Drawer
        anchor="right"
        open={isDrawerOpen || isNewDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setIsNewDrawerOpen(false);
          resetForm();
        }}
      >
        <Box p={3} width={isSmallScreen ? "100%" : 500}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {jobId ? "Edit Status" : "Create Status"}
            </Typography>

            <IconButton
              onClick={() => {
                setIsDrawerOpen(false);
                setIsNewDrawerOpen(false);
                resetForm();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mb={2}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Typography variant="subtitle1" mb={1}>
                Color
              </Typography>

              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                renderValue={(value) => (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: value,
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              >
                {colors.map((c) => (
                  <MenuItem key={c} value={c}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: c,
                        borderRadius: "50%", // 👈 makes it circle
                        border: "1px solid #ccc", // optional (better visibility for light colors)
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1" mb={1}>
              Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Name"
              value={clientFacingName}
              onChange={(e) => setClientFacingName(e.target.value)}
            />
          </Box>
          <Box>
            {" "}
            <Typography variant="subtitle1" mb={1}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              placeholder="Description"
              rows={5}
              value={clientFacingDescription}
              onChange={(e) => {
                setClientFacingDescription(e.target.value);
                if (e.target.value.trim() && e.target.value.length <= 200) {
                  setErrors((prev) => ({ ...prev, description: "" })); // clear error
                }
              }}
              inputProps={{ maxLength: 200 }}
              helperText={`${clientFacingDescription.length}/200 characters`}
            />
          </Box>

          <Button
            onClick={jobId ? updateJobFacing : createJobFacing}
            sx={{ mt: 2 }}
            variant="contained"
          >
            {jobId ? "Update" : "Submit"}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Clientfacing;
