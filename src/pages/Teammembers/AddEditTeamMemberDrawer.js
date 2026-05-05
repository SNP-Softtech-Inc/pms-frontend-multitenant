// import React, { useEffect, useState } from "react";
// import {
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
//   Button,
//   Paper,
// } from "@mui/material";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import { authAPI } from "../../services/api";

// const AddEditTeamMemberDrawer = ({ open, onClose, editData, onSuccess }) => {
//   const isEdit = !!editData;

//   const initialPermissions = {
//     managePayments: false,
//     managePipelines: false,
//     manageTimeEntries: false,
//     manageAccounts: false,
//     manageTags: false,
//     manageOrganizers: false,
//     chargeFirmBalance: false,
//     manageContacts: false,
//     manageSites: false,
//     manageServices: false,
//     managePublicFilterTemplates: false,
//     manageTemplates: false,
//     manageMarketPlace: false,

//     manageInvoices: false,
//     manageJobRecurrence: false,
//     manageRatesinTimeEntries: false,
//     viewallAccounts: false,
//     manageCustomFields: false,
//     assignTeamMates: false,
//     viewAllContacts: false,
//     manageProposals: false,
//     manageEmails: false,
//     editOrganizersAnswers: false,
//     manageDocuments: false,
//     manageIRSTranscripts: false,
//     viewReporting: false,
//   };
//   const disabledPermissions = [
//     "managePayments",
//     "manageTimeEntries",
//     "chargeFirmBalance",
//     "manageSites",
//     "viewReporting",
  
//     "managefirmBalance",
//     "managesites",
//     "manageMarketPlace",
//     "managePublicFilterTemplates",
//     "manageJobRecurrence",
//     "manageRatesinTimeEntries",
//     "manageCustomFields",
//     "manageTeamMates",
//     "manageEmails",
//     "editOrganizersAnswers",
//     "manageDocuments",
//     "manageIRSTranscripts",
//     "viewReporting",
//   ];
//   const [formData, setFormData] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     email: "",
//     role: "",
//   });

//   const [permissions, setPermissions] = useState(initialPermissions);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ================= PREFILL EDIT =================
//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         firstName: editData.firstName || "",
//         middleName: editData.middleName || "",
//         lastName: editData.lastName || "",
//         email: editData.email || "",
//         role: editData.role || "",
//       });

//       setPermissions(editData.permissions || initialPermissions);
//       console.log("set permissions", editData);
//     }
//   }, [editData]);

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

//   // ================= SUBMIT =================
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       if (!formData.firstName || !formData.email) {
//         setError("First name and Email are required");
//         return;
//       }

//       const payload = { ...formData, permissions };

//       if (isEdit) {
//         await authAPI.updateTeamMember(editData._id, payload);
//         setSuccess("Updated successfully ✅");
//       } else {
//         await authAPI.registerTeamMember(payload);
//         setSuccess("Invitation sent successfully ✅");
//       }

//       onSuccess(); // 🔥 refresh parent
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const permissionList = Object.keys(initialPermissions);

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: { width: 700, borderRadius: "10px 0 0 10px" },
//       }}
//     >
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" p={2}>
//         <Typography variant="h6">
//           {isEdit ? "Edit Team Member" : "Add Team Member"}
//         </Typography>
//         <CloseRoundedIcon onClick={onClose} sx={{ cursor: "pointer" }} />
//       </Box>

//       <Divider />

//       <Box p={2}>
//         {error && <Alert severity="error">{error}</Alert>}
//         {success && <Alert severity="success">{success}</Alert>}
//       </Box>

//       {/* Form */}
//       <Box sx={{ p: 2, height: "90vh", overflowY: "auto" }}>
//         <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//           <Grid size={{ xs: 12, md: 4 }}>
//             {/* <InputLabel>First Name</InputLabel> */}
//             <TextField
//               fullWidth
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               size="small"
//               placeholder="First Name"
//               label="First Name"
//             />
//           </Grid>

//           <Grid size={{ xs: 12, md: 4 }}>
//             {/* <InputLabel>Middle Name</InputLabel> */}
//             <TextField
//               fullWidth
//               name="middleName"
//               value={formData.middleName}
//               onChange={handleChange}
//               size="small"
//               placeholder="Middle Name"
//               label="Middle Name"
//             />
//           </Grid>

//           <Grid size={{ xs: 12, md: 4 }}>
//             {/* <InputLabel>Last Name</InputLabel> */}
//             <TextField
//               fullWidth
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               size="small"
//               placeholder="Last Name"
//               label="Last Name"
//             />
//           </Grid>
//         </Grid>

//         <Box mt={3}>
//           {/* <InputLabel>Email</InputLabel> */}
//           <TextField
//             fullWidth
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             size="small"
//             disabled={isEdit}
//             placeholder="Email"
//             label="Email"
//           />
//         </Box>

//         <Box mt={3}>
//           {/* <InputLabel>Role</InputLabel> */}
//           <Select
//             fullWidth
//             size="small"
//             value={formData.role}
//             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//           >
//             <MenuItem value="">Select Role</MenuItem>
//             <MenuItem value="employee">Employee</MenuItem>
//             <MenuItem value="admin">Admin</MenuItem>
//           </Select>
//         </Box>

//         {/* Permissions */}
//         {formData.role === "employee" && (
//           <Box mt={3}>
//             <Typography sx={{ fontWeight: 500 }} variant="h6">
//               Access Rights
//             </Typography>

//             <Grid
//               container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//               mt={1}
//             >
//               {permissionList.map((key) => (
//                 <Grid size={{ xs: 12, sm: 6, md: 6 }} key={key}>
//                   {/* <Box display="flex" justifyContent="space-between"> */}
//                   <Paper
//                     elevation={2}
//                     sx={{
//                       p: 2,
//                       borderRadius: 2,
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography sx={{ fontWeight: 500 }}>{key}</Typography>
//                     {/* <Switch
//                       checked={permissions[key]}
//                       onChange={() => handlePermissionChange(key)}
//                     /> */}
//                     <Switch
//                       checked={permissions[key]}
//                       onChange={() => handlePermissionChange(key)}
//                       disabled={disabledPermissions.includes(key)}
//                     />
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         )}
//       </Box>

//       {/* Footer */}
//       <Box p={2} display="flex" gap={2}>
//         <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//           {loading ? "Saving..." : isEdit ? "Update" : "Send Invite"}
//         </Button>
//         <Button variant="outlined" onClick={onClose}>
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default AddEditTeamMemberDrawer;


import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
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
  
  const disabledPermissions = [
    "managePayments",
    "manageTimeEntries",
    "chargeFirmBalance",
    "manageSites",
    "viewReporting",
    "managefirmBalance",
    "managesites",
    "manageMarketPlace",
    "managePublicFilterTemplates",
    "manageJobRecurrence",
    "manageRatesinTimeEntries",
    "manageCustomFields",
    "manageTeamMates",
    "manageEmails",
    "editOrganizersAnswers",
    "manageDocuments",
    "manageIRSTranscripts",
    "viewReporting",
  ];
  
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[700px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-md bg-green-500/10 text-green-600 text-sm border border-green-500/20">
              {success}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="First Name"
              />
            </div>

            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Middle Name"
              />
            </div>

            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEdit}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Email"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>

          {/* Permissions */}
          {formData.role === "employee" && (
            <div className="mt-4">
              <h3 className="text-base font-semibold mb-3">Access Rights</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permissionList.map((key) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg border border-border bg-card flex justify-between items-center"
                  >
                    <span className="text-sm font-medium">{key}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={permissions[key]}
                      onClick={() => handlePermissionChange(key)}
                      disabled={disabledPermissions.includes(key)}
                      className={`
                        relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                        ${permissions[key] ? 'bg-primary' : 'bg-input'}
                        ${disabledPermissions.includes(key) ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform
                          ${permissions[key] ? 'translate-x-4' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTeamMemberDrawer;