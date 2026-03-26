// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   ButtonGroup,
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Grid,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   Divider,
//   Switch,
// } from "@mui/material";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// import ActiveMember from "./ActiveTeammembers";
// import Deactivatemember from "./Deactivatemember";
// import { authAPI } from "../../services/api";

// const TeamMember = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [showActive, setShowActive] = useState(true);

//   // ================= FORM =================
//   const [formData, setFormData] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     email: "",
//     role: "",
//   });

//   // ================= PERMISSIONS =================
//   const initialPermissions = {
//     payments: false,
//     pipelines: false,
//     timeEntries: false,
//     accounts: false,
//     tags: false,
//     organizers: false,
//     firmBalance: false,
//     contacts: false,
//     site: false,
//     services: false,
//     filterTemplates: false,
//     templates: false,
//     marketplace: false,

//     invoices: false,
//     jobRecurrences: false,
//     ratesTimeEntries: false,
//     allAccounts: false,
//     customFields: false,
//     teammates: false,
//     allContacts: false,
//     proposals: false,
//     email: false,
//     organizerAnswers: false,
//     documents: false,
//     transcripts: false,
//     reporting: false,
//   };

//   const [permissions, setPermissions] = useState(initialPermissions);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ================= HANDLERS =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePermissionChange = (key) => {
//     setPermissions((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // Auto enable all permissions if admin
//   useEffect(() => {
//     if (formData.role === "admin") {
//       const allTrue = {};
//       Object.keys(initialPermissions).forEach((key) => {
//         allTrue[key] = true;
//       });
//       setPermissions(allTrue);
//     }
//   }, [formData.role]);

//   // ================= SUBMIT =================
//   const handleSubmitTeamMember = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       if (!formData.firstName || !formData.email) {
//         setError("First name and Email are required");
//         return;
//       }

//       const payload = {
//         ...formData,
//         permissions,
//       };

//       await authAPI.registerTeamMember(payload);

//       setSuccess("Invitation sent successfully ✅");

//       setFormData({
//         firstName: "",
//         middleName: "",
//         lastName: "",
//         email: "",
//         role: "",
//       });

//       setPermissions(initialPermissions);

//       // setTimeout(() => setDrawerOpen(false), 1000);
// setDrawerOpen(false);


//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= PERMISSION UI =================
//   const permissionList = [
//     "payments",
//     "pipelines",
//     "timeEntries",
//     "accounts",
//     "tags",
//     "organizers",
//     "firmBalance",
//     "contacts",
//     "site",
//     "services",
//     "filterTemplates",
//     "templates",
//     "marketplace",
//     "invoices",
//     "jobRecurrences",
//     "ratesTimeEntries",
//     "allAccounts",
//     "customFields",
//     "teammates",
//     "allContacts",
//     "proposals",
//     "email",
//     "organizerAnswers",
//     "documents",
//     "transcripts",
//     "reporting",
//   ];

//   // ================= UI =================
//   return (
//     <div>
//       {/* Top Buttons */}
//       <ButtonGroup variant="contained">
//         <Button
//           onClick={() => setShowActive(true)}
//           color={showActive ? "secondary" : "primary"}
//         >
//           Active Members
//         </Button>
//         <Button
//           onClick={() => setShowActive(false)}
//           color={!showActive ? "secondary" : "primary"}
//         >
//           Deactive Members
//         </Button>
//         <Button onClick={() => setDrawerOpen(true)}>+ Add Member</Button>
//       </ButtonGroup>

//       {/* Content */}
//       <Box mt={2}>
//         {showActive ? <ActiveMember /> : <Deactivatemember />}
//       </Box>

//       {/* Drawer */}
//       <Drawer
//         anchor="right"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         PaperProps={{
//           sx: {
//             width: "600px",
//             borderRadius: "10px 0 0 10px",
//           },
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             p: 2,
//           }}
//         >
//           <Typography variant="h6">Add New Team Member</Typography>
//           <CloseRoundedIcon
//             onClick={() => setDrawerOpen(false)}
//             sx={{ cursor: "pointer" }}
//           />
//         </Box>

//         <Divider />

//         {/* Alerts */}
//         <Box p={2}>
//           {error && <Alert severity="error">{error}</Alert>}
//           {success && <Alert severity="success">{success}</Alert>}
//         </Box>

//         {/* Form */}
//         <Box sx={{ p: 2, height: "70vh", overflowY: "auto" }}>
//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <InputLabel>First Name</InputLabel>
//               <TextField
//                 fullWidth
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 size="small"
//               />
//             </Grid>

//             <Grid item xs={4}>
//               <InputLabel>Middle Name</InputLabel>
//               <TextField
//                 fullWidth
//                 name="middleName"
//                 value={formData.middleName}
//                 onChange={handleChange}
//                 size="small"
//               />
//             </Grid>

//             <Grid item xs={4}>
//               <InputLabel>Last Name</InputLabel>
//               <TextField
//                 fullWidth
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 size="small"
//               />
//             </Grid>
//           </Grid>

//           <Box mt={3}>
//             <InputLabel>Email</InputLabel>
//             <TextField
//               fullWidth
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               size="small"
//             />
//           </Box>

//           <Box mt={3}>
//             <InputLabel>Role</InputLabel>
//             <Select
//               fullWidth
//               size="small"
//               value={formData.role}
//               onChange={(e) =>
//                 setFormData({ ...formData, role: e.target.value })
//               }
//             >
//               <MenuItem value="">Select Role</MenuItem>
//               <MenuItem value="employee">Employee</MenuItem>
//               <MenuItem value="admin">Admin</MenuItem>
//             </Select>
//           </Box>

//           {/* Permissions */}
//           {formData.role === "employee" && (
//             <Box mt={3}>
//               <Typography variant="subtitle1">Access Rights</Typography>

//               <Grid container spacing={1} mt={1}>
//                 {permissionList.map((key) => (
//                   <Grid item xs={6} key={key}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         border: "1px solid #eee",
//                         borderRadius: "8px",
//                         p: 1,
//                       }}
//                     >
//                       <Typography sx={{ textTransform: "capitalize" }}>
//                         {key}
//                       </Typography>

//                       <Switch
//                         checked={permissions[key]}
//                         onChange={() => handlePermissionChange(key)}
//                       />
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Box>
//           )}
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             p: 2,
//             display: "flex",
//             gap: 2,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={handleSubmitTeamMember}
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send Invite"}
//           </Button>

//           <Button variant="outlined" onClick={() => setDrawerOpen(false)}>
//             Cancel
//           </Button>
//         </Box>
//       </Drawer>
//     </div>
//   );
// };

// export default TeamMember;

import React, { useState } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";

import ActiveMember from "./ActiveTeammembers";
import Deactivatemember from "./Deactivatemember";
import AddEditTeamMemberDrawer from "./AddEditTeamMemberDrawer";

const TeamMember = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      {/* Buttons */}
      <ButtonGroup variant="contained" sx={{gap:2}}>
        <Button
          onClick={() => setShowActive(true)}
          color={showActive ? "secondary" : "primary"}
        >
          Active Members
        </Button>

        <Button
          onClick={() => setShowActive(false)}
          color={!showActive ? "secondary" : "primary"}
        >
          Deactive Members
        </Button>

        <Button
          onClick={() => {
            setEditData(null);
            setDrawerOpen(true);
          }}
        >
          + Add Member
        </Button>
      </ButtonGroup>

      {/* List */}
      <Box mt={2}>
        {showActive ? (
          <ActiveMember
            refresh={refresh}
            onEdit={(data) => {
              setEditData(data);
              setDrawerOpen(true);
            }}
          />
        ) : (
          <Deactivatemember
            refresh={refresh}
            onEdit={(data) => {
              setEditData(data);
              setDrawerOpen(true);
            }}
          />
        )}
      </Box>

      {/* Drawer */}
      <AddEditTeamMemberDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editData={editData}
        onSuccess={() => setRefresh((prev) => !prev)}
      />
    </div>
  );
};

export default TeamMember;