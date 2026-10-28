


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Divider,
//   Avatar,
//   TextField,
//   Button,
//   IconButton,
//   useMediaQuery,
//   useTheme,
//   CircularProgress,
//   Grid,
//   Paper,
//   InputAdornment,
//   Checkbox,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Table,
//   TableRow,
//   TableHead,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
// import { useAuth } from "../../context/AuthContext";
// import { authAPI } from "../../services/api";
// import { toast } from "react-toastify";
// import { Dialog, DialogContent } from "@mui/material";
// import { NavLink, useNavigate } from "react-router-dom";
// import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
// import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
// import axios from "axios";
// const MyAccount = () => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();

//   const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;
// const EMAIL_SYNC = process.env.REACT_APP_EMAIL_SYNC
//   const { user, updateUserData, logout } = useAuth();
// console.log("users deatils",user)
//   // Personal Details State
//   const [isEditable, setIsEditable] = useState(false);
//   const [showSaveButtons, setShowSaveButtons] = useState(false);
//   const [firstName, setFirstName] = useState("");
//   const [middleName, setMiddleName] = useState("");
//   const [lastname, setLastName] = useState("");
//   const [phonenumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [signedtime, setSignedTime] = useState(0);
  
//   // Image State
//   const [currentImage, setCurrentImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [image, setImage] = useState(null);
  
//   // Authentication Dialog State
//   const [openPasswordModal, setOpenPasswordModal] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [passShow, setPassShow] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
  
//   // Password Change State
//   const [showPasswordChange, setShowPasswordChange] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
  
//   // Login Details Edit State
//   const [isLoginEditable, setIsLoginEditable] = useState(false);
//   const [tempEmail, setTempEmail] = useState("");
//   const [tempUsername, setTempUsername] = useState("");
  
//   // Notifications State
//   const [userNotifications, setUserNotifications] = useState([]);
//   const [notificationDocId, setNotificationDocId] = useState("");
  
//   // Snackbar for session expiry
//   const [sessionExpiryAlert, setSessionExpiryAlert] = useState(false);
// const [emailsync, setEmailSync] = useState("");
//   const notificationItems = [
//     "Invoices", "Payments", "Organizers", "Uploads", "E-signatures",
//     "Approvals", "Done uploading", "Tasks", "Messages", "New mail",
//     "Proposals", "Jobs", "Mentions", "SMS",
//   ];

//   const [notificationState, setNotificationState] = useState(
//     notificationItems.reduce((acc, item) => ({ ...acc, [item]: false }), {})
//   );

//   const [emailNotificationState, setEmailNotificationState] = useState(
//     notificationItems.reduce((acc, item) => ({ ...acc, [item]: false }), {})
//   );

//   const getImageUrl = (path) => {
//     if (!path) return "";
//     if (path.startsWith("http")) return path;
//     // console.log("constructing image url with path:", `${AUTH_USER_URL}${path}`);
//     return `${AUTH_USER_URL}${path}`;
//   };

//   // Session Time Tracker
//   useEffect(() => {
//     const updateSignedTime = () => {
//       const expiry = localStorage.getItem("sessionExpiry");
//       if (!expiry) return;

//       const remainingMs = Number(expiry) - Date.now();
//       if (remainingMs <= 0) {
//         setSignedTime(0);
//       } else {
//         setSignedTime(Math.floor(remainingMs / 1000));
//       }
//     };

//     updateSignedTime();
//     const interval = setInterval(updateSignedTime, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const formatTimePeriod = (seconds) => {
//     if (!seconds) return "";
//     if (seconds < 3600) {
//       const mins = Math.ceil(seconds / 60);
//       return `${mins} minute${mins > 1 ? "s" : ""}`;
//     } else {
//       const hours = Math.floor(seconds / 3600);
//       const minutes = Math.floor((seconds % 3600) / 60);
//       return minutes > 0
//         ? `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`
//         : `${hours} hour${hours > 1 ? "s" : ""}`;
//     }
//   };

//   // Fetch User Data
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await authAPI.getSingleUser(user.id);
//         const { user: userData, profile } = res.data;

//         setFirstName(profile?.firstName || "");
//         setMiddleName(profile?.middleName || "");
//         setLastName(profile?.lastName || "");
//         setPhoneNumber(profile?.phoneNumber || "");
//         setEmail(userData?.email || "");
//         setUsername(userData?.username || "");
//         setCurrentImage(userData?.profilePicture || null);
//         setPreview(null);
//          setEmailSync(userData.emailSyncEmail || "");
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load profile");
//       }
//     };

//     if (user?.id) fetchUser();
//   }, [user]);

//   // Fetch Notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await authAPI.getNotificationByUser(user.id);
//         const notifData = res.data?.notification;
//         if (!notifData) return;

//         setNotificationDocId(notifData._id);
//         setUserNotifications(notifData.notifications);

//         const newNotificationState = {};
//         const newEmailNotificationState = {};
//         notifData.notifications.forEach((notif) => {
//           const name = notif.notificationDescription;
//           newNotificationState[name] = notif.inbox;
//           newEmailNotificationState[name] = notif.email;
//         });

//         setNotificationState(newNotificationState);
//         setEmailNotificationState(newEmailNotificationState);
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error);
//         toast.error("Failed to load notifications");
//       }
//     };

//     if (user?.id) fetchNotifications();
//   }, [user]);

//   const notificationIdMap = {};
//   userNotifications.forEach((notif) => {
//     notificationIdMap[notif.notificationDescription] = notif._id;
//   });

//   // ================= HANDLERS =================
//   const handleEditClick = () => {
//     setIsEditable(true);
//     setShowSaveButtons(true);
//   };

//   const handleCancelButtonClick = () => {
//     setIsEditable(false);
//     setShowSaveButtons(false);
//     setImage(null);
//     setPreview(null);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveButtonClick = async () => {
//     try {
//       setIsUploading(true);
//       const payload = {
//         firstName,
//         middleName,
//         lastName: lastname,
//         phoneNumber: phonenumber,
//       };
//       if (image) payload.profilePicture = image;

//       const res = await authAPI.updateMyProfile(payload);
//       toast.success("Profile updated successfully");

//       if (res.data?.user) {
//         updateUserData(res.data.user);
//       }
//       if (res.data?.user?.profilePicture) {
//         setCurrentImage(res.data.user.profilePicture);
//       }

//       setIsEditable(false);
//       setShowSaveButtons(false);
//       setImage(null);
//       setPreview(null);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Update failed");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // ================= AUTHENTICATION HANDLERS =================
//   const toggleAlert = () => {
//     setOpenPasswordModal(true);
//     setShowPasswordChange(false);
//     setCurrentPassword("");
//     setPasswordError("");
//   };

//   const handleCloseAlert = () => {
//     setOpenPasswordModal(false);
//     setShowPasswordChange(false);
//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//     setPasswordError("");
//   };

//   const handleVerifyPassword = async () => {
//     if (!currentPassword) {
//       setPasswordError("Please enter your password");
//       return;
//     }

//     setIsVerifying(true);
//     setPasswordError("");

//     try {
//       const response = await authAPI.verifyPassword({
//         userId: user.id,
//         password: currentPassword,
//       });

//       if (response.data.valid) {
//         // Password verified - enable login details editing
//         setOpenPasswordModal(false);
//         setCurrentPassword("");
//         setPasswordError("");
//         setIsLoginEditable(true);
//         setShowSaveButtons(true);
//         setTempEmail(email);
//         setTempUsername(username);
//         toast.success("Password verified. You can now edit login details.");
//       }
//     } catch (error) {
//       setPasswordError(error.response?.data?.message || "Invalid password. Please try again.");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     if (newPassword !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     try {
//       const response = await authAPI.changePassword({
//         userId: user.id,
//         currentPassword: currentPassword,
//         newPassword: newPassword,
//       });

//       toast.success(response.data.message || "Password changed successfully");

//       // If password change requires re-login
//       if (response.data.requiresReLogin) {
//         setSessionExpiryAlert(true);
//         toast.info("Please login again with your new password");
        
//         // Auto logout after 3 seconds
//         setTimeout(async () => {
//           await logout(false);
//           navigate("/admin/login");
//         }, 3000);
//       }

//       setShowPasswordChange(false);
//       setNewPassword("");
//       setConfirmPassword("");
//       setCurrentPassword("");
//       handleCloseAlert();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to change password");
//     }
//   };

//   const handleSaveLoginChanges = async () => {
//     // Check if any changes were made
//     if (tempEmail === email && tempUsername === username) {
//       toast.info("No changes to save");
//       setIsLoginEditable(false);
//       setShowSaveButtons(false);
//       return;
//     }

//     try {
//       // Re-prompt for password for security
//       const password = window.prompt("Please enter your password to confirm changes:");
//       if (!password) {
//         toast.info("Password is required to save changes");
//         return;
//       }

//       const response = await authAPI.updateLoginDetails({
//         userId: user.id,
//         email: tempEmail,
//         username: tempUsername,
//         currentPassword: password,
//       });

//       toast.success(response.data.message || "Login details updated successfully");
      
//       setEmail(tempEmail);
//       setUsername(tempUsername);
//       setIsLoginEditable(false);
//       setShowSaveButtons(false);

//       // Update auth context with new user data
//       if (response.data.user) {
//         updateUserData(response.data.user);
//       }

//       // If new token provided, update it
//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token);
//       }

//       // Show warning if email needs verification
//       if (response.data.warning) {
//         toast.warning(response.data.warning);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update login details");
//     }
//   };

//   const handleCancelLoginEdit = () => {
//     setIsLoginEditable(false);
//     setShowSaveButtons(false);
//     setTempEmail("");
//     setTempUsername("");
//   };

//   const getInitials = () => {
//     return `${firstName?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();
//   };

//   // Notification Handlers
//   const handleNotificationChange = async (name) => {
//     const notifId = notificationIdMap[name];
//     if (!notifId) return;

//     const updated = !notificationState[name];
//     setNotificationState((prev) => ({ ...prev, [name]: updated }));

//     try {
//       await authAPI.updateNotification(notificationDocId, notifId, {
//         inbox: updated,
//       });
//       toast.success(`${name} inbox updated`);
//     } catch (error) {
//       console.error("Failed to update notification:", error);
//       toast.error("Failed to update notification");
//       // Revert on error
//       setNotificationState((prev) => ({ ...prev, [name]: !updated }));
//     }
//   };

//   const handleEmailNotificationChange = async (name) => {
//     const notifId = notificationIdMap[name];
//     if (!notifId) return;

//     const updated = !emailNotificationState[name];
//     setEmailNotificationState((prev) => ({ ...prev, [name]: updated }));

//     try {
//       await authAPI.updateNotification(notificationDocId, notifId, {
//         email: updated,
//       });
//       toast.success(`${name} email updated`);
//     } catch (error) {
//       console.error("Failed to update email notification:", error);
//       toast.error("Failed to update email notification");
//       // Revert on error
//       setEmailNotificationState((prev) => ({ ...prev, [name]: !updated }));
//     }
//   };
//   const [emailList, setEmailList] = useState([]);
//   const handleTokenLogin = async () => {
//     const targetEmail = emailsync;
//     console.log("target", targetEmail);
//     if (!targetEmail) {
//       alert("⚠️ Please enter your email or login with Google first.");
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `${EMAIL_SYNC}/emailsync/user/login-with-token/${targetEmail}`
//       );
//       console.log("payload", res.data);
//       setEmail(targetEmail);
//       // setProfile(res.data.profile);
//       setEmailList(res.data.emails || []);
//       localStorage.setItem("gmail_user_email", targetEmail);
//       setEmailSync(targetEmail);

//       await updateUserEmailSync( targetEmail);
//       alert("✅ Logged in using refresh token!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Token login failed. Please login with Google again.");
//     }
//   };
 
//   const updateUserEmailSync = async (emailSyncValue) => {
//   try {
//     console.log("Sending email sync:", emailSyncValue);

//     const res = await authAPI.updateEmailSyncEmail({
//       emailSyncEmail: emailSyncValue,
//     });

//     console.log("✅ Email sync updated:", res.data);

//     if (res.data?.user?.emailSyncEmail) {
//       setEmailSync(res.data.user.emailSyncEmail);
//     }

//     if (res.data?.user) {
//       updateUserData(res.data.user);
//     }

//     return res.data;
//   } catch (error) {
//     console.error("❌ Failed to update email sync:");

//     console.log("FULL ERROR:", error);

//     console.log("ERROR RESPONSE:", error.response);

//     console.log("ERROR DATA:", error.response?.data);

//     throw error;
//   }
// };
// const handleEmailSync = async () => {
//   if (!emailsync) {
//     alert("⚠️ Please enter an email address.");
//     return;
//   }

//   try {
//     const res = await axios.get(
//       `${EMAIL_SYNC}/emailsync/user/exists/${emailsync}`
//     );

//     console.log("Exists response:", res.data);

//     if (res.data.exists) {
//       console.log("User exists, using token login.");

//       await handleTokenLogin();
//     } else {
//       console.log("User not found, redirecting to Google login.");

//       await updateUserEmailSync(emailsync);

//       // window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
//       window.location.href = `${EMAIL_SYNC}/emailsync/auth/google?tenantId=${user.tenantId}`;
//     }
//   } catch (error) {
//     console.error("Email sync failed:", error);
//     console.log("Error response:", error.response?.data);

//     alert(
//       error.response?.data?.message ||
//         "❌ Something went wrong while checking email existence."
//     );
//   }
// };
// const USER_URL = process.env.REACT_APP_AUTH_USER;
// const handleConnectGmail = async () => {
//   try {
//     // Save email sync value first
//     // await updateUserEmailSync(emailsync);

//     // JWT token from login
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Login token missing");
//       return;
//     }

//     // Redirect to backend Google OAuth
//     window.location.href =
//       `${USER_URL}/api/googleauth/google?token=${token}`;

//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to connect Gmail");
//   }
// };

//   return (
//     <Box sx={{ p: 3, width: "100%" }}>
//       {/* Session Expiry Alert */}
//       <Snackbar
//         open={sessionExpiryAlert}
//         autoHideDuration={5000}
//         onClose={() => setSessionExpiryAlert(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert severity="warning" onClose={() => setSessionExpiryAlert(false)}>
//           Password changed! You will be logged out in a moment. Please login again.
//         </Alert>
//       </Snackbar>

//       <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={3}>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Account Settings
//         </Typography>
//         <Typography variant="body1" color="textSecondary">
//           Manage your personal information, password, and preferences
//         </Typography>
//       </Box>

//       <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: 5 }}>
//         {/* ================= PERSONAL DETAILS ================= */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//               <Typography variant="h6">Personal Details</Typography>
//               <IconButton onClick={handleEditClick}>
//                 <BorderColorRoundedIcon />
//               </IconButton>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             {!isEditable ? (
//               <Box mt={3} display="flex" gap={3} alignItems="center">
//                 <Avatar
//                   src={preview || getImageUrl(currentImage)}
//                   sx={{ width: 100, height: 100 }}
//                 >
//                   {!preview && !currentImage && getInitials()}
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h6">
//                     {/* {firstName} {middleName} {lastname} */}
//                     {username}
//                   </Typography>
//                   <Typography color="text.secondary">{phonenumber}</Typography>
//                 </Box>
//               </Box>
//             ) : (
//               <Box>
//                 <Box display="flex" justifyContent="center" mb={2}>
//                   <Box position="relative">
//                     <Avatar
//                       src={preview || getImageUrl(currentImage)}
//                       sx={{ width: 100, height: 100 }}
//                     />
//                     <input
//                       type="file"
//                       hidden
//                       id="upload"
//                       onChange={handleImageChange}
//                       accept="image/*"
//                     />
//                     <label htmlFor="upload">
//                       <IconButton
//                         component="span"
//                         sx={{
//                           position: "absolute",
//                           bottom: 0,
//                           right: 0,
//                           bgcolor: "primary.main",
//                           color: "#fff",
//                           "&:hover": { bgcolor: "primary.dark" }
//                         }}
//                       >
//                         <EditIcon />
//                       </IconButton>
//                     </label>
//                   </Box>
//                 </Box>

//                 <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"} gap={2}>
//                   <TextField
//                     label="First Name"
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     fullWidth
//                   />
//                   <TextField
//                     label="Middle Name"
//                     value={middleName}
//                     onChange={(e) => setMiddleName(e.target.value)}
//                     fullWidth
//                   />
//                   <TextField
//                     label="Last Name"
//                     value={lastname}
//                     onChange={(e) => setLastName(e.target.value)}
//                     fullWidth
//                   />
//                 </Box>

//                 <Box mt={2}>
//                   <TextField
//                     label="Phone Number"
//                     value={phonenumber}
//                     onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
//                     fullWidth
//                   />
//                 </Box>
//               </Box>
//             )}

//             {showSaveButtons && !isLoginEditable && (
//               <Box mt={3} display="flex" gap={2}>
//                 <Button variant="contained" onClick={handleSaveButtonClick} disabled={isUploading}>
//                   {isUploading ? <CircularProgress size={20} /> : "Save"}
//                 </Button>
//                 <Button variant="outlined" onClick={handleCancelButtonClick}>
//                   Cancel
//                 </Button>
//               </Box>
//             )}
//           </Paper>
//         </Grid>

//         {/* ================= LOGIN DETAILS ================= */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//               <Typography variant="h6">Login Details</Typography>
//               <IconButton onClick={toggleAlert}>
//                 <BorderColorRoundedIcon />
//               </IconButton>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             <Box display="flex" flexDirection="column" gap={2}>
//               <TextField
//                 label="Email"
//                 value={isLoginEditable ? tempEmail : email}
//                 onChange={(e) => setTempEmail(e.target.value)}
//                 disabled={!isLoginEditable}
//                 fullWidth
//                 helperText={isLoginEditable && "Changing email will require re-verification"}
//               />

//               <TextField
//                 label="Username"
//                 value={isLoginEditable ? tempUsername : username}
//                 onChange={(e) => setTempUsername(e.target.value)}
//                 disabled={!isLoginEditable}
//                 fullWidth
//               />

//               <TextField
//                 label="Stay signed in for"
//                 size="small"
//                 fullWidth
//                 disabled
//                 value={formatTimePeriod(signedtime)}
//                 InputProps={{ readOnly: true }}
//               />
//             </Box>

//             {isLoginEditable && showSaveButtons && (
//               <Box mt={3} display="flex" gap={2}>
//                 <Button variant="contained" onClick={handleSaveLoginChanges}>
//                   Save Changes
//                 </Button>
//                 <Button variant="outlined" onClick={handleCancelLoginEdit}>
//                   Cancel
//                 </Button>
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

      

// <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//   {/* ================= NOTIFICATION PREFERENCES ================= */}
//   <Grid size={{ xs: 12, md: 6 }}>
//     <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography variant="h6">Notification Preferences</Typography>
//         <HelpOutlineRoundedIcon sx={{ color: "blue" }} />
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       <TableContainer sx={{ borderRadius: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Notification</TableCell>
//               <TableCell align="center">INBOX+</TableCell>
//               <TableCell align="center">EMAIL</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {notificationItems.map((item) => (
//               <TableRow key={item}>
//                 <TableCell>{item}</TableCell>

//                 <TableCell align="center">
//                   <Checkbox
//                     checked={notificationState[item] || false}
//                     onChange={() => handleNotificationChange(item)}
//                     color="primary"
//                   />
//                 </TableCell>

//                 <TableCell align="center">
//                   <Checkbox
//                     checked={emailNotificationState[item] || false}
//                     onChange={() => handleEmailNotificationChange(item)}
//                     color="primary"
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   </Grid>

//   {/* ================= EMAIL SYNC ================= */}
//   <Grid size={{ xs: 12, md: 6 }}>
//     <Paper sx={{ p: 3, borderRadius: 3, height: "auto" }}>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography variant="h6">Email Sync</Typography>
//         <HelpOutlineRoundedIcon sx={{ color: "blue" }} />
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       <Typography variant="body2" color="text.secondary" mb={3}>
//         Sync your existing email with TaxDome — all your client messages
//         in one place.
//       </Typography>

//       <Box>
//         <TextField
//           label="Email for sync"
//           name="emailSync"
//           value={emailsync}
//           onChange={(e) => setEmailSync(e.target.value)}
//           size="small"
//           fullWidth
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//            onClick={handleEmailSync}
//           sx={{
//             mt: 3,
//             width: isSmallScreen ? "100%" : "auto",
//             borderRadius: "10px",
//           }}
//         >
//           Sync your email
//         </Button>
//         <Button
//     variant="outlined"
//     color="error"
//     onClick={handleConnectGmail}
//     sx={{
//       width: isSmallScreen ? "100%" : "auto",
//       borderRadius: "10px",
//     }}
//   >
//     Connect Gmail
//   </Button>
//       </Box>
//     </Paper>
//   </Grid>
// </Grid>
//       {/* Authentication Dialog */}
//       <Dialog open={openPasswordModal} onClose={handleCloseAlert} fullWidth maxWidth="sm">
//         <DialogContent sx={{ p: 3 }}>
//           <Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//               <Typography variant="h6">Authentication Required</Typography>
//               <CloseRoundedIcon onClick={handleCloseAlert} sx={{ cursor: "pointer" }} />
//             </Box>

//             <Divider sx={{ mb: 2 }} />

//             {!showPasswordChange ? (
//               <>
//                 <Typography color="textSecondary" gutterBottom>
//                   Please verify your identity to continue
//                 </Typography>

//                 <TextField
//                   label="Current Password"
//                   type={passShow ? "text" : "password"}
//                   fullWidth
//                   size="small"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   error={!!passwordError}
//                   helperText={passwordError}
//                   sx={{ mt: 2 }}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton onClick={() => setPassShow(!passShow)} edge="end">
//                           {passShow ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <Box mt={1}>
//                   <NavLink to="/forgot-password" style={{ color: "#6495ED", textDecoration: "none" }}>
//                     Forgot Password?
//                   </NavLink>
//                 </Box>

//                 <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
//                   <Button variant="outlined" onClick={() => setShowPasswordChange(true)}>
//                     Change Password
//                   </Button>
//                   <Button
//                     variant="contained"
//                     onClick={handleVerifyPassword}
//                     disabled={isVerifying}
//                   >
//                     {isVerifying ? <CircularProgress size={24} /> : "Continue"}
//                   </Button>
//                   <Button variant="outlined" onClick={handleCloseAlert}>
//                     Cancel
//                   </Button>
//                 </Box>
//               </>
//             ) : (
//               <>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Change Password
//                 </Typography>

//                 <TextField
//                   label="Current Password"
//                   type="password"
//                   fullWidth
//                   size="small"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   sx={{ mb: 2 }}
//                 />

//                 <TextField
//                   label="New Password"
//                   type="password"
//                   fullWidth
//                   size="small"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   sx={{ mb: 2 }}
//                   helperText="Password must be at least 6 characters"
//                 />

//                 <TextField
//                   label="Confirm New Password"
//                   type="password"
//                   fullWidth
//                   size="small"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   sx={{ mb: 2 }}
//                 />

//                 <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
//                   <Button variant="outlined" onClick={() => setShowPasswordChange(false)}>
//                     Back
//                   </Button>
//                   <Button variant="contained" onClick={handleChangePassword}>
//                     Update Password
//                   </Button>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// export default MyAccount;




import React, { useState, useEffect } from "react";
import {
  Edit,
  HelpCircle,
  X,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";

import axios from "axios";
import { useToastContext } from "../../context/ToastContext";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TAB_LIST_CLASS,
  TAB_TRIGGER_CLASS,
} from "../../components/SettingsTabs";
import { SiGmail, SiIcloud, SiZoho } from "react-icons/si";
import { FaMicrosoft, FaYahoo, FaAt, FaEnvelope } from "react-icons/fa";
import { authAPI } from "../../services/api";

// SHADCN UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";

import { Input } from "../../components/ui/input";

import { Label } from "../../components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

import { Checkbox } from "../../components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Alert,
  AlertDescription,
} from "../../components/ui/alert";
import {
  getAccessToken,
   setAccessToken as saveAccessToken,
  // getAccessToken,
  clearAccessToken,
} from "../../services/tokenService";
import { nextImapFormForEmail } from "./imapFormState";
import { isCompleteAddress, routeForDiscovery, imapProviderIdFor } from "./connectRoute";
// Providers worth naming in the UI.
//
// All of them connect over IMAP and all of them have their host discovered
// from the address, so this is presentation only: a Yahoo user does not think
// of themselves as "Other", and will conclude Yahoo is unsupported if that is
// the only button on offer.
//
// `appPassword` is where the provider issues one. Each of these blocks a
// plain password over IMAP when 2FA is on, and each hides the setting
// somewhere different, so the instruction is worth carrying.
const IMAP_PROVIDERS = [
  {
    id: "yahoo",
    label: "Yahoo",
    Icon: FaYahoo,
    color: "#6001D2",
    appPassword: "Yahoo requires an app password: Account Security → Generate app password.",
  },
  {
    id: "icloud",
    label: "iCloud",
    Icon: SiIcloud,
    color: "#3693F3",
    appPassword: "iCloud requires an app password: Apple ID → Sign-In and Security → App-Specific Passwords.",
  },
  {
    id: "zoho",
    label: "Zoho",
    Icon: SiZoho,
    color: "#E42527",
    appPassword: "Zoho may require an app password if two-factor authentication is on.",
  },
  {
    id: "aol",
    label: "AOL",
    // Neither Simple Icons nor Font Awesome carries an AOL mark, so this is
    // a generic @ rather than a brand that is not theirs.
    Icon: FaAt,
    color: "#1D7BD6",
    appPassword: "AOL requires an app password: Account Security → Generate app password.",
  },
  {
    id: "other",
    label: "Other",
    Icon: FaEnvelope,
    color: "#64748B",
    appPassword: null,
  },
];

// The icon shown against a connected mailbox in the list. Keyed by the
// provider the server reports, not by anything the user typed.
const providerIcon = (provider, host) => {
  if (provider === "google") return { Icon: SiGmail, color: "#EA4335" };
  if (provider === "microsoft") return { Icon: FaMicrosoft, color: "#0078D4" };

  // An IMAP mailbox is whatever its host says it is.
  const match = IMAP_PROVIDERS.find(
    (candidate) =>
      candidate.id !== "other" && String(host || "").includes(candidate.id),
  );

  return match
    ? { Icon: match.Icon, color: match.color }
    : { Icon: FaEnvelope, color: "#64748B" };
};


const MyAccount = () => {
  const navigate = useNavigate();

  // Connected mailboxes, across every provider. Until now this page could
  // connect Gmail but never showed what was connected - there was no way to
  // see a mailbox, or to tell a working connection from a broken one.
  const [mailAccounts, setMailAccounts] = useState([]);
  const [mailProviders, setMailProviders] = useState({
    google: { available: true },
    microsoft: { available: false },
    imap: { available: false },
    zoho: { available: false },
  });
  const [loadingMailboxes, setLoadingMailboxes] = useState(false);

  // The IMAP form is hidden until asked for - it needs a host, username and
  // password, which is far more than the one-click OAuth providers.
  const [showImapForm, setShowImapForm] = useState(false);
  const [imapForm, setImapForm] = useState({
    email: "",
    host: "",
    port: 993,
    username: "",
    password: "",
  });
  const [connectingImap, setConnectingImap] = useState(false);

  // Server details are discovered, not typed. These hold the outcome: what
  // was found, or why nothing was, plus whether the manual fields have been
  // opened as a fallback.
  const [imapDiscovery, setImapDiscovery] = useState(null);
  const [showImapAdvanced, setShowImapAdvanced] = useState(false);

  // Which named provider the user chose. Affects the guidance shown, not the
  // connection - the server is discovered from the address either way.
  const [imapProvider, setImapProvider] = useState(null);

  // "Connect your email": one address, and the server's answer decides where
  // it goes. The provider buttons stay available behind a link.
  const [connectEmail, setConnectEmail] = useState("");
  const [routingConnect, setRoutingConnect] = useState(false);
  const [connectNotice, setConnectNotice] = useState(null);
  const [showProviderChoice, setShowProviderChoice] = useState(false);

  const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;
  const EMAIL_SYNC = process.env.REACT_APP_EMAIL_SYNC;
  const USER_URL = process.env.REACT_APP_AUTH_USER;

  const { user, logout, loadUser } = useAuth();
const { showToast } = useToastContext();
  console.log("users deatils", user);
const expiresAt = user?.expiresAt;
console.log("shdgjhsdcsd",expiresAt)
  // ================= STATES =================

  const [isEditable, setIsEditable] = useState(false);
  const [showSaveButtons, setShowSaveButtons] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [signedtime, setSignedTime] = useState(0);

  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passShow, setPassShow] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoginEditable, setIsLoginEditable] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [tempUsername, setTempUsername] = useState("");

  const [userNotifications, setUserNotifications] = useState([]);
  const [notificationDocId, setNotificationDocId] = useState("");

  const [sessionExpiryAlert, setSessionExpiryAlert] = useState(false);

  const [emailsync, setEmailSync] = useState("");

  const [emailList, setEmailList] = useState([]);

  const notificationItems = [
    "Invoices",
    "Payments",
    "Organizers",
    "Uploads",
    "E-signatures",
    "Approvals",
    "Done uploading",
    "Tasks",
    "Messages",
    "New mail",
    "Proposals",
    "Jobs",
    "Mentions",
    "SMS",
  ];

  const [notificationState, setNotificationState] = useState(
    notificationItems.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const [emailNotificationState, setEmailNotificationState] = useState(
    notificationItems.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${AUTH_USER_URL}${path}`;
  };

  // ================= SESSION TRACKER =================
useEffect(() => {
  if (!expiresAt) return;

  const updateSignedTime = () => {
    const remainingSeconds = Math.max(
      0,
      Math.floor((expiresAt - Date.now()) / 1000)
    );

    setSignedTime(remainingSeconds);
  };

  updateSignedTime();

  const interval = setInterval(updateSignedTime, 1000);

  return () => clearInterval(interval);
}, [expiresAt]);

const formatTimePeriod = (seconds) => {
  if (seconds <= 0) return "Expired";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes} min`;
};

  // ================= FETCH USER =================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.getSingleUser(user.id);

        const { user: userData, profile } = res.data;

        setFirstName(profile?.firstName || "");
        setMiddleName(profile?.middleName || "");
        setLastName(profile?.lastName || "");
        setPhoneNumber(profile?.phoneNumber || "");
        setEmail(userData?.email || "");
        setUsername(userData?.username || "");
        setCurrentImage(userData?.profilePicture || null);
        setPreview(null);
        setEmailSync(userData.emailSyncEmail || "");
      } catch (error) {
        console.error(error);
        showToast({
          title: "Failed to load profile",
          description: "Failed to load profile.",
          type: "error",
        });
      }
    };

    if (user?.id) fetchUser();
  }, [user]);

  // ================= FETCH NOTIFICATIONS =================

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authAPI.getNotificationByUser(user.id);

        const notifData = res.data?.notification;

        if (!notifData) return;

        setNotificationDocId(notifData._id);

        setUserNotifications(notifData.notifications);

        const newNotificationState = {};
        const newEmailNotificationState = {};

        notifData.notifications.forEach((notif) => {
          const name = notif.notificationDescription;

          newNotificationState[name] = notif.inbox;
          newEmailNotificationState[name] = notif.email;
        });

        setNotificationState(newNotificationState);
        setEmailNotificationState(newEmailNotificationState);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        showToast({
          title: "Failed to load notifications",
          description: "Failed to load notifications.",
          type: "error",
        });
      }
    };

    if (user?.id) fetchNotifications();
  }, [user]);

  const notificationIdMap = {};

  userNotifications.forEach((notif) => {
    notificationIdMap[notif.notificationDescription] = notif._id;
  });

  // ================= HANDLERS =================

  const handleEditClick = () => {
    setIsEditable(true);
    setShowSaveButtons(true);
  };

  const handleCancelButtonClick = () => {
    setIsEditable(false);
    setShowSaveButtons(false);
    setImage(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();

      reader.onloadend = () => setPreview(reader.result);

      reader.readAsDataURL(file);
    }
  };

  const handleSaveButtonClick = async () => {
    try {
      setIsUploading(true);

      const payload = {
        firstName,
        middleName,
        lastName: lastname,
        phoneNumber: phonenumber,
      };

      if (image) payload.profilePicture = image;

      const res = await authAPI.updateMyProfile(payload);

      showToast({
        title: "Profile updated successfully",
        description: "Your profile has been updated.",
        type: "success",
      });

      // if (res.data?.user) {
      //   updateUserData(res.data.user);
      // }

      if (res.data?.user?.profilePicture) {
        setCurrentImage(res.data.user.profilePicture);
      }

      setIsEditable(false);
      setShowSaveButtons(false);
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);

      showToast({
        title: "Failed to update profile",
        description: error.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ================= AUTH =================

  const toggleAlert = () => {
    setOpenPasswordModal(true);
    setShowPasswordChange(false);
    setCurrentPassword("");
    setPasswordError("");
  };

  const handleCloseAlert = () => {
    setOpenPasswordModal(false);
    setShowPasswordChange(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleVerifyPassword = async () => {
    if (!currentPassword) {
      setPasswordError("Please enter your password");
      return;
    }

    setIsVerifying(true);
    setPasswordError("");

    try {
      const response = await authAPI.verifyPassword({
        userId: user.id,
        password: currentPassword,
      });

      if (response.data.valid) {
        setOpenPasswordModal(false);
        setCurrentPassword("");
        setPasswordError("");
        setIsLoginEditable(true);
        setShowSaveButtons(true);
        setTempEmail(email);
        setTempUsername(username);

        showToast({
  title: "Password verified",
  description: "You can now edit login details.",
  type: "success",
});
      }
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Invalid password. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast({
        title: "Failed to change password",
        description: "Passwords do not match",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      showToast({
        title: "Failed to change password",
        description: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    try {
      const response = await authAPI.changePassword({
        userId: user.id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      showToast({
        title: "Password changed successfully",
        description: response.data.message || "Password changed successfully",
        type: "success",
      });

      if (response.data.requiresReLogin) {
        setSessionExpiryAlert(true);

        showToast({
          title: "Please login again",
          description: "Please login again with your new password",
          type: "info",
        });

        setTimeout(async () => {
          await logout(false);

          navigate("/admin/login");
        }, 3000);
      }

      setShowPasswordChange(false);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");

      handleCloseAlert();
    } catch (error) {
      showToast({
        title: "Failed to change password",
        description: error.response?.data?.message || "Failed to change password",
        type: "error",
      });
    }
  };

  const handleSaveLoginChanges = async () => {
    if (tempEmail === email && tempUsername === username) {
      showToast({
        title: "No changes to save",
        description: "No changes to save.",
        type: "info",
      });

      setIsLoginEditable(false);
      setShowSaveButtons(false);

      return;
    }

    try {
      const password = window.prompt(
        "Please enter your password to confirm changes:"
      );

      if (!password) {
        showToast({
          title: "Password is required",
          description: "Password is required to save changes",
          type: "info",
        });
        return;
      }

      const response = await authAPI.updateLoginDetails({
        userId: user.id,
        email: tempEmail,
        username: tempUsername,
        currentPassword: password,
      });

     showToast({
  title: "Login details updated",
  description:
    response.data.message || "Login details updated successfully.",
  type: "success",
});

      setEmail(tempEmail);
      setUsername(tempUsername);
      setIsLoginEditable(false);
      setShowSaveButtons(false);

      if (response.data.user) {
        await loadUser();
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.warning) {
  showToast({
    title: "Warning",
    description: response.data.warning,
    type: "warning",
  });
}
    } catch (error) {
      console.log("Error updating login details:", error);
      showToast({
        title: "Failed to update login details",
        description: error.response?.data?.message || "Failed to update login details",
        type: "error",
      });
    }
  };

  const handleCancelLoginEdit = () => {
    setIsLoginEditable(false);
    setShowSaveButtons(false);
    setTempEmail("");
    setTempUsername("");
  };

  const getInitials = () => {
    return `${firstName?.[0] || ""}${
      lastname?.[0] || ""
    }`.toUpperCase();
  };

  // ================= NOTIFICATIONS =================

  const handleNotificationChange = async (name) => {
    const notifId = notificationIdMap[name];

    if (!notifId) return;

    const updated = !notificationState[name];

    setNotificationState((prev) => ({
      ...prev,
      [name]: updated,
    }));

    try {
      await authAPI.updateNotification(
        notificationDocId,
        notifId,
        {
          inbox: updated,
        }
      );

      showToast({
        title: "Notification updated",
        description: `${name} inbox updated`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to update notification:", error);

      showToast({
        title: "Failed to update notification",
        description: "Failed to update notification",
        type: "error",
      });

      setNotificationState((prev) => ({
        ...prev,
        [name]: !updated,
      }));
    }
  };

  const handleEmailNotificationChange = async (name) => {
    const notifId = notificationIdMap[name];

    if (!notifId) return;

    const updated = !emailNotificationState[name];

    setEmailNotificationState((prev) => ({
      ...prev,
      [name]: updated,
    }));

    try {
      await authAPI.updateNotification(
        notificationDocId,
        notifId,
        {
          email: updated,
        }
      );

      showToast({
        title: "Email notification updated",
        description: `${name} email updated`,
        type: "success",
      });
    } catch (error) {
      console.error(
        "Failed to update email notification:",
        error
      );

      showToast({
        title: "Failed to update email notification",
        description: "Failed to update email notification",
        type: "error",
      });

      setEmailNotificationState((prev) => ({
        ...prev,
        [name]: !updated,
      }));
    }
  };

  // ================= EMAIL SYNC =================

  const handleTokenLogin = async () => {
    const targetEmail = emailsync;

    if (!targetEmail) {
      alert(
        "⚠️ Please enter your email or login with Google first."
      );

      return;
    }

    try {
      const res = await axios.get(
        `${EMAIL_SYNC}/emailsync/user/login-with-token/${targetEmail}`
      );

      console.log("payload", res.data);

      setEmail(targetEmail);

      setEmailList(res.data.emails || []);

      localStorage.setItem(
        "gmail_user_email",
        targetEmail
      );

      setEmailSync(targetEmail);

      await updateUserEmailSync(targetEmail);

      alert("✅ Logged in using refresh token!");
    } catch (err) {
      console.error(err);

      alert(
        "❌ Token login failed. Please login with Google again."
      );
    }
  };

  const updateUserEmailSync = async (
    emailSyncValue
  ) => {
    try {
      const res =
        await authAPI.updateEmailSyncEmail({
          emailSyncEmail: emailSyncValue,
        });

      if (res.data?.user?.emailSyncEmail) {
        setEmailSync(res.data.user.emailSyncEmail);
      }

      if (res.data?.user) {
        await loadUser();
      }

      return res.data;
    } catch (error) {
      console.error("❌ Failed to update email sync:");
      throw error;
    }
  };

  const handleEmailSync = async () => {
    if (!emailsync) {
      alert("⚠️ Please enter an email address.");
      return;
    }

    try {
      const res = await axios.get(
        `${EMAIL_SYNC}/emailsync/user/exists/${emailsync}`
      );

      if (res.data.exists) {
        await handleTokenLogin();
      } else {
        await updateUserEmailSync(emailsync);

        window.location.href = `${EMAIL_SYNC}/emailsync/auth/google?tenantId=${user.tenantId}`;
      }
    } catch (error) {
      console.error("Email sync failed:", error);

      alert(
        error.response?.data?.message ||
          "❌ Something went wrong while checking email existence."
      );
    }
  };

  // ---------------- CONNECTED MAILBOXES ----------------
  const loadMailboxes = async () => {
    const token = getAccessToken();

    if (!token) return;

    try {
      setLoadingMailboxes(true);

      // Both are best-effort: a mailbox list is not worth failing the whole
      // Account Settings page over, so a failure leaves the section empty
      // rather than breaking the tab.
      const [accountsRes, providersRes] = await Promise.allSettled([
        authAPI.getMailAccounts(token),
        authAPI.getMailProviders(token),
      ]);

      if (accountsRes.status === "fulfilled") {
        setMailAccounts(accountsRes.value?.data?.accounts || []);
      }

      if (providersRes.status === "fulfilled") {
        setMailProviders(
          providersRes.value?.data?.providers || mailProviders,
        );
      }
    } catch (err) {
      console.error("Load mailboxes failed:", err);
    } finally {
      setLoadingMailboxes(false);
    }
  };

  useEffect(() => {
    loadMailboxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Microsoft is a full-page redirect, like Gmail - the browser leaves the
  // app and returns to this page once consent is given.
  const handleConnectMicrosoft = () => {
    const token = getAccessToken();

    if (!token) {
      showToast({
        title: "Login token missing",
        description: "Please login again to connect a mailbox.",
        type: "error",
      });
      return;
    }

    window.location.href = `${USER_URL}/api/emailsync/microsoft?token=${token}`;
  };

  // Zoho sign-in, the same full-page redirect as Microsoft. Only offered
  // where the server reports Zoho available; otherwise Zoho keeps the
  // password form.
  const handleConnectZoho = () => {
    const token = getAccessToken();

    if (!token) {
      showToast({
        title: "Login token missing",
        description: "Please login again to connect a mailbox.",
        type: "error",
      });
      return;
    }

    window.location.href = `${USER_URL}/api/emailsync/zoho?token=${token}`;
  };

  // A named provider button works if its mailbox can connect at all: by
  // password (IMAP), or for Zoho by signing in.
  const providerButtonEnabled = (provider) =>
    Boolean(
      mailProviders.imap?.available ||
        (provider.id === "zoho" && mailProviders.zoho?.available),
    );

  const handleImapEmailChange = (email) => {
    // Do NOT derive the username here. This runs per keystroke, so
    // `prev.username || email` locked the username to the first character
    // typed and every IMAP login was attempted as user "v". The server
    // defaults it (username || email) at the point of use instead.
    setImapForm((prev) => nextImapFormForEmail(prev, email));

    // A changed address invalidates whatever was discovered for the old one.
    if (imapDiscovery) setImapDiscovery(null);
  };

  // Find the server once the address is complete.
  //
  // On blur rather than on change: discovery opens real TLS connections to
  // several candidate hosts, which is far too slow to run per keystroke. The
  // first version guessed a hostname from a string and was wrong for every
  // Plesk and cPanel domain, which is how someone ended up reading
  // "getaddrinfo ENOTFOUND".
  const handleImapEmailBlur = async () => {
    const { email } = imapForm;

    if (!email.includes("@") || imapDiscovery) return;

    try {
      setImapDiscovery({ searching: true });

      const token = getAccessToken();
      const res = await authAPI.discoverImapHost(email, token);
      const data = res?.data || {};

      setImapDiscovery(data);

      if (data.found) {
        setImapForm((prev) => ({
          ...prev,
          host: data.settings.host,
          port: data.settings.port || 993,
        }));
      } else if (!data.oauthProvider) {
        // Nothing was reachable, so the manual fields open with the
        // explanation above them rather than leaving a dead end.
        //
        // Not for a Workspace or 365 domain though: there is no IMAP host to
        // type, and offering the fields would suggest otherwise.
        setShowImapAdvanced(true);
      }
    } catch (err) {
      setImapDiscovery({
        found: false,
        message: "Could not look up this mail server.",
      });
      setShowImapAdvanced(true);
    }
  };

  const handleConnectImap = async () => {
    if (connectingImap) return;

    const { email, password } = imapForm;

    // The server is no longer required from the user - the backend discovers
    // it when none is supplied.
    if (!email || !password) {
      showToast({
        title: "Missing details",
        description: "Enter your email address and password.",
        type: "error",
      });
      return;
    }

    try {
      setConnectingImap(true);

      const token = getAccessToken();

      // The server verifies by actually opening the mailbox before storing
      // anything, so a wrong password fails here rather than silently
      // becoming a mailbox that never syncs.
      await authAPI.connectImapMailbox(imapForm, token);

      showToast({
        title: "Mailbox connected",
        description: `${email} is now syncing.`,
        type: "success",
      });

      setShowImapForm(false);
      setImapForm({ email: "", host: "", port: 993, username: "", password: "" });
      setImapDiscovery(null);
      setShowImapAdvanced(false);
      setImapProvider(null);
      setConnectEmail("");

      await loadMailboxes();
    } catch (err) {
      console.error("IMAP connect failed:", err);

      const data = err?.response?.data || {};

      showToast({
        title: "Could not connect",
        // The server explains in plain terms - a certificate issued for
        // another name, a closed port, an address with no mail server - and
        // the hint says what to do about it.
        description:
          [data.message, data.hint].filter(Boolean).join(" ") ||
          "Check the details and try again.",
        type: "error",
      });

      // Let the details be corrected by hand rather than leaving a dead end.
      if (data.message) {
        setImapDiscovery(data);
        setShowImapAdvanced(true);
      }
    } finally {
      setConnectingImap(false);
    }
  };

  const handleDisconnectZoho = async (email) => {
    try {
      const token = getAccessToken();
      await authAPI.disconnectZohoMailbox(email, token);

      showToast({
        title: "Mailbox disconnected",
        type: "success",
      });

      await loadMailboxes();
    } catch (err) {
      console.error("Zoho disconnect failed:", err);
      showToast({ title: "Could not disconnect", type: "error" });
    }
  };

  const handleDisconnectImap = async (email) => {
    try {
      const token = getAccessToken();
      await authAPI.disconnectImapMailbox(email, token);

      showToast({
        title: "Mailbox disconnected",
        type: "success",
      });

      await loadMailboxes();
    } catch (err) {
      console.error("IMAP disconnect failed:", err);
      showToast({ title: "Could not disconnect", type: "error" });
    }
  };

  const handleConnectGmail = async () => {
    try {
      // const token = localStorage.getItem("token");
   const token = getAccessToken();
console.log("getasscestoken",token)
   console.log()
      if (!token) {
        showToast({
          title: "Login token missing",
          description: "Please login again to connect Gmail.",
          type: "error",
        });
        return;
      }

      window.location.href = `${USER_URL}/api/googleauth/google?token=${token}`;
    } catch (error) {
      console.error(error);
      showToast({
        title: "Failed to connect Gmail",
        description: "Failed to connect Gmail",
        type: "error",
      });
    }
  };

  // Ask the server who runs this address, then go there: Google or Microsoft
  // sign-in, or the password form with the server already filled in. The
  // decision itself is in connectRoute.js, where it is tested.
  const handleContinueConnect = async () => {
    const address = connectEmail.trim();

    if (routingConnect || !isCompleteAddress(address)) return;

    setConnectNotice(null);
    setRoutingConnect(true);

    let discovery = null;

    try {
      const res = await authAPI.discoverImapHost(address, getAccessToken());
      discovery = res?.data || null;
    } catch (err) {
      // The password form, with its manual fields open, is still a way on.
      console.error("Mail server lookup failed:", err);
      discovery = { found: false, message: "Could not look up this mail server." };
    } finally {
      setRoutingConnect(false);
    }

    const route = routeForDiscovery(discovery, mailProviders, address);

    if (route.kind === "google") return handleConnectGmail();
    if (route.kind === "microsoft") return handleConnectMicrosoft();
    if (route.kind === "zoho") return handleConnectZoho();

    if (route.kind === "unavailable") {
      setConnectNotice(route.message);
      return;
    }

    const host = discovery?.settings?.host || "";
    const providerId = imapProviderIdFor(address, host);

    setImapProvider(IMAP_PROVIDERS.find((p) => p.id === providerId) || null);
    setImapForm({
      email: address,
      host,
      port: discovery?.settings?.port || 993,
      username: "",
      password: "",
    });
    // Set alongside the address, so the form's own on-blur lookup does not
    // run the same discovery again.
    setImapDiscovery(discovery);
    setShowImapAdvanced(!discovery?.found);
    setShowImapForm(true);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {sessionExpiryAlert && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertDescription>
            Password changed! You will be logged out in a
            moment. Please login again.
          </AlertDescription>
        </Alert>
      )}

      {/* HEADER - left aligned and sized to match Firm Settings, which
          the centred text-3xl heading did not. */}
      <h1 className="text-xl font-semibold text-foreground mb-5">
        Account Settings
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        {/* Tab Bar */}
        <TabsList className={TAB_LIST_CLASS}>
          <TabsTrigger value="profile" className={TAB_TRIGGER_CLASS}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className={TAB_TRIGGER_CLASS}>
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className={TAB_TRIGGER_CLASS}>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="emailsync" className={TAB_TRIGGER_CLASS}>
            Email Sync
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
        {/* PERSONAL DETAILS */}

        <Card className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-3.5 space-y-0">
            <CardTitle className="text-sm font-semibold text-foreground">Personal Details</CardTitle>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleEditClick}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent>
            {!isEditable ? (
              <div className="flex items-center gap-4 mt-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={
                      preview || getImageUrl(currentImage)
                    }
                  />

                  <AvatarFallback>
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-lg font-semibold">
                    {username}
                  </h3>

                  <p className="text-muted-foreground">
                    {phonenumber}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={
                          preview ||
                          getImageUrl(currentImage)
                        }
                      />
                    </Avatar>

                    <input
                      type="file"
                      hidden
                      id="upload"
                      onChange={handleImageChange}
                      accept="image/*"
                    />

                    <label htmlFor="upload">
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                        asChild
                      >
                        <span>
                          <Edit className="w-4 h-4" />
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                  />

                  <Input
                    placeholder="Middle Name"
                    value={middleName}
                    onChange={(e) =>
                      setMiddleName(e.target.value)
                    }
                  />

                  <Input
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                  />
                </div>

                <Input
                  placeholder="Phone Number"
                  value={phonenumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />
              </div>
            )}

            {showSaveButtons && !isLoginEditable && (
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveButtonClick}
                  disabled={isUploading}
                >
                  {isUploading
                    ? "Saving..."
                    : "Save"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCancelButtonClick}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">

        <Card className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-3.5 space-y-0">
            <CardTitle className="text-sm font-semibold text-foreground">Login Details</CardTitle>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleAlert}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>

              <Input
                value={
                  isLoginEditable ? tempEmail : email
                }
                onChange={(e) =>
                  setTempEmail(e.target.value)
                }
                disabled={!isLoginEditable}
              />
            </div>

            <div>
              <Label>Username</Label>

              <Input
                value={
                  isLoginEditable
                    ? tempUsername
                    : username
                }
                onChange={(e) =>
                  setTempUsername(e.target.value)
                }
                disabled={!isLoginEditable}
              />
            </div>

            <div>
              <Label>Stay signed in for</Label>

              <Input
                disabled
                value={formatTimePeriod(signedtime)}
              />
            </div>

            {isLoginEditable && showSaveButtons && (
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSaveLoginChanges}
                >
                  Save Changes
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCancelLoginEdit}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
        {/* NOTIFICATIONS */}

        <Card className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-3.5 space-y-0">
            <CardTitle className="text-sm font-semibold text-foreground">
              Notification Preferences
            </CardTitle>

            <HelpCircle className="w-5 h-5 text-blue-500" />
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Notification
                  </TableHead>

                  <TableHead className="text-center">
                    INBOX+
                  </TableHead>

                  <TableHead className="text-center">
                    EMAIL
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {notificationItems.map((item) => (
                  <TableRow key={item}>
                    <TableCell>{item}</TableCell>

                    <TableCell className="text-center">
                      <Checkbox
                        checked={
                          notificationState[item] ||
                          false
                        }
                        onCheckedChange={() =>
                          handleNotificationChange(
                            item
                          )
                        }
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <Checkbox
                        checked={
                          emailNotificationState[
                            item
                          ] || false
                        }
                        onCheckedChange={() =>
                          handleEmailNotificationChange(
                            item
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="emailsync" className="space-y-6">

        <Card className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-3.5 space-y-0">
            <CardTitle className="text-sm font-semibold text-foreground">Email Sync</CardTitle>

            <HelpCircle className="w-5 h-5 text-blue-500" />
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Connect a mailbox to bring client messages into the inbox.
              Gmail, Outlook and Microsoft 365 connect in one step; anything
              else connects over IMAP.
            </p>

            {/* CONNECTED MAILBOXES - this page could connect Gmail but never
                showed what was connected, so there was no way to tell a
                working mailbox from a broken one. */}
            <div className="space-y-2">
              <Label className="text-xs">Connected mailboxes</Label>

              {loadingMailboxes && mailAccounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : mailAccounts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No mailboxes connected yet.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border rounded-lg border border-border">
                  {mailAccounts.map((account) => (
                    <li
                      key={`${account.provider}-${account.email}`}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {(() => {
                          const { Icon, color } = providerIcon(
                            account.provider,
                            account.host,
                          );
                          return (
                            <Icon
                              className="h-5 w-5 shrink-0"
                              style={{ color }}
                            />
                          );
                        })()}

                        <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {account.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {account.provider === "google"
                            ? "Gmail"
                            : account.provider === "microsoft"
                              ? "Outlook / Microsoft 365"
                              : account.provider === "zoho"
                                ? "Zoho · signed in with Zoho"
                                : account.host || "IMAP"}
                          {account.lastSyncAt
                            ? ` · last synced ${new Date(account.lastSyncAt).toLocaleString()}`
                            : ""}
                        </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            account.connected && !account.syncDisabled
                              ? "bg-emerald-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {account.connected && !account.syncDisabled
                            ? "Syncing"
                            : "Paused"}
                        </span>

                        {/* Gmail predates this list and still lives in the
                            older fields, so it has no disconnect here yet
                            rather than a button that would not work. */}
                        {account.provider === "imap" && account.connected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisconnectImap(account.email)}
                          >
                            Disconnect
                          </Button>
                        )}
                        {account.provider === "zoho" && account.connected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisconnectZoho(account.email)}
                          >
                            Disconnect
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ADD A MAILBOX */}
            <div className="space-y-3 border-t border-border pt-4">
              <Label className="text-xs">Add a mailbox</Label>

              {/* One box for every provider. Gmail, Google Workspace,
                  Outlook and Microsoft 365 go straight to their own sign-in
                  page; anything else gets the password form. */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  placeholder="you@yourfirm.com"
                  value={connectEmail}
                  onChange={(e) => {
                    setConnectEmail(e.target.value);
                    if (connectNotice) setConnectNotice(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleContinueConnect();
                  }}
                  disabled={routingConnect}
                />
                <Button
                  onClick={handleContinueConnect}
                  disabled={routingConnect || !isCompleteAddress(connectEmail)}
                  className="min-w-[110px]"
                >
                  {routingConnect ? "Checking..." : "Continue"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Gmail, Google Workspace, Outlook and Microsoft 365 sign in on
                their own page. Any other mailbox asks for its password.
              </p>

              {connectNotice && (
                <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2">
                  <p className="text-xs text-amber-900">{connectNotice}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowProviderChoice((v) => !v)}
                className="text-xs text-muted-foreground underline"
              >
                {showProviderChoice ? "Hide providers" : "Choose your provider instead"}
              </button>

              {showProviderChoice && (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button onClick={handleConnectGmail} className="gap-2">
                  <SiGmail className="h-4 w-4" />
                  Connect Gmail
                </Button>

                {/* Disabled rather than hidden when the server cannot
                    currently connect it - a button that answers 503 is worse
                    than one that explains itself. */}
                <Button
                  variant="outline"
                  onClick={handleConnectMicrosoft}
                  disabled={!mailProviders.microsoft?.available}
                  title={
                    mailProviders.microsoft?.available
                      ? "Connect an Outlook or Microsoft 365 mailbox"
                      : "Not configured on this server yet"
                  }
                  className="gap-2"
                >
                  <FaMicrosoft
                    className="h-4 w-4"
                    style={{
                      color: mailProviders.microsoft?.available
                        ? "#0078D4"
                        : undefined,
                    }}
                  />
                  Connect Outlook
                </Button>

                {/* Named rather than a single "Other (IMAP)". These all
                    take the same path - the difference is that someone with a
                    Yahoo address can see that Yahoo works. */}
                {IMAP_PROVIDERS.map((provider) => (
                  <Button
                    key={provider.id}
                    variant="outline"
                    onClick={() => {
                      // Zoho signs in where the server supports it, with no
                      // password; every other provider opens the form.
                      if (provider.id === "zoho" && mailProviders.zoho?.available) {
                        handleConnectZoho();
                        return;
                      }
                      setImapProvider(provider);
                      setShowImapForm(true);
                    }}
                    disabled={!providerButtonEnabled(provider)}
                    title={
                      providerButtonEnabled(provider)
                        ? `Connect a ${provider.label} mailbox`
                        : "Not configured on this server yet"
                    }
                    className="gap-2"
                  >
                    {/* The mark greys out with the button rather than staying
                        in brand colour on a disabled control, which would
                        read as still clickable. */}
                    <provider.Icon
                      className="h-4 w-4"
                      style={{
                        color: providerButtonEnabled(provider)
                          ? provider.color
                          : undefined,
                      }}
                    />
                    {provider.label}
                  </Button>
                ))}
              </div>
              )}

              {showImapForm && mailProviders.imap?.available && (
                <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                  {imapProvider && (
                    <div className="flex items-center gap-2 pb-1">
                      <imapProvider.Icon
                        className="h-4 w-4"
                        style={{ color: imapProvider.color }}
                      />
                      <span className="text-sm font-medium">
                        Connect {imapProvider.label}
                      </span>
                    </div>
                  )}

                  {/* Email and password only. The server name, port and TLS
                      settings are worked out from the address - asking for
                      them was the whole reason connecting a mailbox needed a
                      support conversation. */}
                  <Input
                    placeholder="you@example.com"
                    value={imapForm.email}
                    onChange={(e) => handleImapEmailChange(e.target.value)}
                    onBlur={handleImapEmailBlur}
                    disabled={connectingImap}
                  />

                  <Input
                    type="password"
                    placeholder="Password"
                    value={imapForm.password}
                    onChange={(e) =>
                      setImapForm((p) => ({ ...p, password: e.target.value }))
                    }
                    disabled={connectingImap}
                  />

                  {/* What discovery found, or why it found nothing. */}
                  {imapDiscovery?.searching && (
                    <p className="text-xs text-muted-foreground">
                      Looking up your mail server...
                    </p>
                  )}

                  {imapDiscovery?.found && (
                    <p className="text-xs text-emerald-600">
                      Found your mail server ({imapDiscovery.settings?.host}).
                    </p>
                  )}

                  {/* A domain run by Google Workspace or Microsoft 365 is
                      not a failure - it is the wrong door. Those mailboxes
                      connect by OAuth, so the right button is offered
                      directly rather than leaving the user in a form that
                      cannot work for them. */}
                  {imapDiscovery?.oauthProvider && (
                    <div className="rounded-md border border-blue-300 bg-blue-50 px-3 py-3">
                      <p className="text-xs text-blue-900">
                        {imapDiscovery.message} {imapDiscovery.hint}
                      </p>

                      <Button
                        size="sm"
                        className="mt-2 gap-2"
                        onClick={
                          imapDiscovery.oauthProvider === "google"
                            ? handleConnectGmail
                            : handleConnectMicrosoft
                        }
                        disabled={
                          imapDiscovery.oauthProvider === "microsoft" &&
                          !mailProviders.microsoft?.available
                        }
                      >
                        {imapDiscovery.oauthProvider === "google" ? (
                          <>
                            <SiGmail className="h-4 w-4" />
                            Connect Gmail instead
                          </>
                        ) : (
                          <>
                            <FaMicrosoft className="h-4 w-4" />
                            Connect Outlook instead
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {imapDiscovery &&
                    !imapDiscovery.found &&
                    !imapDiscovery.searching &&
                    !imapDiscovery.oauthProvider && (
                    <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2">
                      <p className="text-xs text-amber-900">
                        {imapDiscovery.message}
                      </p>
                      {imapDiscovery.hint && (
                        <p className="mt-1 text-xs text-amber-800">
                          {imapDiscovery.hint}
                        </p>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {imapProvider?.appPassword ||
                      "Some providers need an app password rather than your normal one."}{" "}
                    It is encrypted before being stored and is never shown
                    again.
                  </p>

                  {/* The manual fields stay available, because discovery
                      cannot succeed against a server that is firewalled or
                      presents a certificate for another name. They open on
                      their own when that happens. */}
                  <button
                    type="button"
                    onClick={() => setShowImapAdvanced((v) => !v)}
                    className="text-xs text-muted-foreground underline"
                  >
                    {showImapAdvanced ? "Hide server settings" : "Enter server settings manually"}
                  </button>

                  {showImapAdvanced && (
                    <div className="flex gap-3">
                      <Input
                        placeholder="mail.example.com"
                        value={imapForm.host}
                        onChange={(e) =>
                          setImapForm((p) => ({ ...p, host: e.target.value }))
                        }
                        disabled={connectingImap}
                      />
                      <Input
                        className="w-24"
                        placeholder="993"
                        value={imapForm.port}
                        onChange={(e) =>
                          setImapForm((p) => ({ ...p, port: Number(e.target.value) || 993 }))
                        }
                        disabled={connectingImap}
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImapForm(false)}
                      disabled={connectingImap}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleConnectImap}
                      disabled={connectingImap}
                      className="min-w-[110px]"
                    >
                      {connectingImap ? "Connecting..." : "Connect"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </TabsContent>
      </Tabs>

      {/* PASSWORD DIALOG */}

      <Dialog
        open={openPasswordModal}
        onOpenChange={setOpenPasswordModal}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                Authentication Required
              </DialogTitle>

              <X
                className="w-5 h-5 cursor-pointer"
                onClick={handleCloseAlert}
              />
            </div>
          </DialogHeader>

          {!showPasswordChange ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please verify your identity to continue
              </p>

              <div className="space-y-2">
                <Label>Current Password</Label>

                <div className="relative">
                  <Input
                    type={
                      passShow
                        ? "text"
                        : "password"
                    }
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() =>
                      setPassShow(!passShow)
                    }
                  >
                    {passShow ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-sm text-red-500">
                    {passwordError}
                  </p>
                )}
              </div>

              <NavLink
                to="/forgot-password"
                className="text-sm text-blue-500"
              >
                Forgot Password?
              </NavLink>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowPasswordChange(true)
                  }
                >
                  Change Password
                </Button>

                <Button
                  onClick={handleVerifyPassword}
                  disabled={isVerifying}
                >
                  {isVerifying
                    ? "Verifying..."
                    : "Continue"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCloseAlert}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>

                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <Label>New Password</Label>

                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                />

                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 6
                  characters
                </p>
              </div>

              <div>
                <Label>Confirm New Password</Label>

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowPasswordChange(false)
                  }
                >
                  Back
                </Button>

                <Button
                  onClick={handleChangePassword}
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAccount;