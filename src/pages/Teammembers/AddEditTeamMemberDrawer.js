import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Switch,
  Button,Paper
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { authAPI } from "../../services/api";

const AddEditTeamMemberDrawer = ({ open, onClose, editData, onSuccess }) => {
  const isEdit = !!editData;

  const initialPermissions = {
    managePayments: false,
    managePipelines: false,
    manageTimeEntries: false,
    manageAccounts: false,
    manageTags: false,
    manageOrganizers: false,
    chargeFirmBalance: false,
    manageContacts: false,
    manageSites: false,
    manageServices: false,
    managePublicFilterTemplates: false,
    manageTemplates: false,
    manageMarketPlace: false,

    manageInvoices: false,
    manageJobRecurrence: false,
    manageRatesinTimeEntries: false,
    viewallAccounts: false,
    manageCustomFields: false,
    assignTeamMates: false,
    viewAllContacts: false,
    manageProposals: false,
    manageEmails: false,
    editOrganizersAnswers: false,
    manageDocuments: false,
    manageIRSTranscripts: false,
    viewReporting: false,
  };
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [permissions, setPermissions] = useState(initialPermissions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= PREFILL EDIT =================
  useEffect(() => {
    if (editData) {
      setFormData({
        firstName: editData.firstName || "",
        middleName: editData.middleName || "",
        lastName: editData.lastName || "",
        email: editData.email || "",
        role: editData.role || "",
      });

      setPermissions(editData.permissions || initialPermissions);
      console.log("set permissions", editData);
    }
  }, [editData]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!formData.firstName || !formData.email) {
        setError("First name and Email are required");
        return;
      }

      const payload = { ...formData, permissions };

      if (isEdit) {
        await authAPI.updateTeamMember(editData._id, payload);
        setSuccess("Updated successfully ✅");
      } else {
        await authAPI.registerTeamMember(payload);
        setSuccess("Invitation sent successfully ✅");
      }

      onSuccess(); // 🔥 refresh parent
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const permissionList = Object.keys(initialPermissions);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 700, borderRadius: "10px 0 0 10px" },
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" p={2}>
        <Typography variant="h6">
          {isEdit ? "Edit Team Member" : "Add Team Member"}
        </Typography>
        <CloseRoundedIcon onClick={onClose} sx={{ cursor: "pointer" }} />
      </Box>

      <Divider />

      <Box p={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>

      {/* Form */}
      <Box sx={{ p: 2, height: "70vh", overflowY: "auto" }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            {/* <InputLabel>First Name</InputLabel> */}
            <TextField
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              size="small"
              placeholder="First Name"
              label="First Name"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {/* <InputLabel>Middle Name</InputLabel> */}
            <TextField
              fullWidth
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              size="small"
              placeholder="Middle Name"
              label="Middle Name"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {/* <InputLabel>Last Name</InputLabel> */}
            <TextField
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              size="small"
              placeholder="Last Name"
              label="Last Name"
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          {/* <InputLabel>Email</InputLabel> */}
          <TextField
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            size="small"
            disabled={isEdit}
            placeholder="Email"
            label="Email"
          />
        </Box>

        <Box mt={3}>
          {/* <InputLabel>Role</InputLabel> */}
          <Select
            fullWidth
            size="small"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </Box>

        {/* Permissions */}
        {formData.role === "employee" && (
          <Box mt={3}>
            <Typography sx={{ fontWeight: 500 }} variant="h6">Access Rights</Typography>

            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              mt={1}
            >
              {permissionList.map((key) => (
                <Grid size={{ xs: 12, sm: 6, md: 6 }} key={key}>
                  {/* <Box display="flex" justifyContent="space-between"> */}
                    <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      ><Typography sx={{ fontWeight: 500 }}>{key}</Typography>
                    <Switch
                      checked={permissions[key]}
                      onChange={() => handlePermissionChange(key)}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box p={2} display="flex" gap={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Send Invite"}
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

export default AddEditTeamMemberDrawer;
