


import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  TextField,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Grid,
  Paper,
  InputAdornment,
  Checkbox,
  TableCell,
  TableBody,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  Alert,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import axios from "axios";
const MyAccount = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;

  const { user, updateUserData, logout } = useAuth();

  // Personal Details State
  const [isEditable, setIsEditable] = useState(false);
  const [showSaveButtons, setShowSaveButtons] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [signedtime, setSignedTime] = useState(0);
  
  // Image State
  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);
  
  // Authentication Dialog State
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passShow, setPassShow] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Login Details Edit State
  const [isLoginEditable, setIsLoginEditable] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  
  // Notifications State
  const [userNotifications, setUserNotifications] = useState([]);
  const [notificationDocId, setNotificationDocId] = useState("");
  
  // Snackbar for session expiry
  const [sessionExpiryAlert, setSessionExpiryAlert] = useState(false);
const [emailsync, setEmailSync] = useState("");
  const notificationItems = [
    "Invoices", "Payments", "Organizers", "Uploads", "E-signatures",
    "Approvals", "Done uploading", "Tasks", "Messages", "New mail",
    "Proposals", "Jobs", "Mentions", "SMS",
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
    // console.log("constructing image url with path:", `${AUTH_USER_URL}${path}`);
    return `${AUTH_USER_URL}${path}`;
  };

  // Session Time Tracker
  useEffect(() => {
    const updateSignedTime = () => {
      const expiry = localStorage.getItem("sessionExpiry");
      if (!expiry) return;

      const remainingMs = Number(expiry) - Date.now();
      if (remainingMs <= 0) {
        setSignedTime(0);
      } else {
        setSignedTime(Math.floor(remainingMs / 1000));
      }
    };

    updateSignedTime();
    const interval = setInterval(updateSignedTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimePeriod = (seconds) => {
    if (!seconds) return "";
    if (seconds < 3600) {
      const mins = Math.ceil(seconds / 60);
      return `${mins} minute${mins > 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0
        ? `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`
        : `${hours} hour${hours > 1 ? "s" : ""}`;
    }
  };

  // Fetch User Data
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
        toast.error("Failed to load profile");
      }
    };

    if (user?.id) fetchUser();
  }, [user]);

  // Fetch Notifications
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
        toast.error("Failed to load notifications");
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
      toast.success("Profile updated successfully");

      if (res.data?.user) {
        updateUserData(res.data.user);
      }
      if (res.data?.user?.profilePicture) {
        setCurrentImage(res.data.user.profilePicture);
      }

      setIsEditable(false);
      setShowSaveButtons(false);
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUploading(false);
    }
  };

  // ================= AUTHENTICATION HANDLERS =================
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
        // Password verified - enable login details editing
        setOpenPasswordModal(false);
        setCurrentPassword("");
        setPasswordError("");
        setIsLoginEditable(true);
        setShowSaveButtons(true);
        setTempEmail(email);
        setTempUsername(username);
        toast.success("Password verified. You can now edit login details.");
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Invalid password. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await authAPI.changePassword({
        userId: user.id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      toast.success(response.data.message || "Password changed successfully");

      // If password change requires re-login
      if (response.data.requiresReLogin) {
        setSessionExpiryAlert(true);
        toast.info("Please login again with your new password");
        
        // Auto logout after 3 seconds
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
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleSaveLoginChanges = async () => {
    // Check if any changes were made
    if (tempEmail === email && tempUsername === username) {
      toast.info("No changes to save");
      setIsLoginEditable(false);
      setShowSaveButtons(false);
      return;
    }

    try {
      // Re-prompt for password for security
      const password = window.prompt("Please enter your password to confirm changes:");
      if (!password) {
        toast.info("Password is required to save changes");
        return;
      }

      const response = await authAPI.updateLoginDetails({
        userId: user.id,
        email: tempEmail,
        username: tempUsername,
        currentPassword: password,
      });

      toast.success(response.data.message || "Login details updated successfully");
      
      setEmail(tempEmail);
      setUsername(tempUsername);
      setIsLoginEditable(false);
      setShowSaveButtons(false);

      // Update auth context with new user data
      if (response.data.user) {
        updateUserData(response.data.user);
      }

      // If new token provided, update it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Show warning if email needs verification
      if (response.data.warning) {
        toast.warning(response.data.warning);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update login details");
    }
  };

  const handleCancelLoginEdit = () => {
    setIsLoginEditable(false);
    setShowSaveButtons(false);
    setTempEmail("");
    setTempUsername("");
  };

  const getInitials = () => {
    return `${firstName?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();
  };

  // Notification Handlers
  const handleNotificationChange = async (name) => {
    const notifId = notificationIdMap[name];
    if (!notifId) return;

    const updated = !notificationState[name];
    setNotificationState((prev) => ({ ...prev, [name]: updated }));

    try {
      await authAPI.updateNotification(notificationDocId, notifId, {
        inbox: updated,
      });
      toast.success(`${name} inbox updated`);
    } catch (error) {
      console.error("Failed to update notification:", error);
      toast.error("Failed to update notification");
      // Revert on error
      setNotificationState((prev) => ({ ...prev, [name]: !updated }));
    }
  };

  const handleEmailNotificationChange = async (name) => {
    const notifId = notificationIdMap[name];
    if (!notifId) return;

    const updated = !emailNotificationState[name];
    setEmailNotificationState((prev) => ({ ...prev, [name]: updated }));

    try {
      await authAPI.updateNotification(notificationDocId, notifId, {
        email: updated,
      });
      toast.success(`${name} email updated`);
    } catch (error) {
      console.error("Failed to update email notification:", error);
      toast.error("Failed to update email notification");
      // Revert on error
      setEmailNotificationState((prev) => ({ ...prev, [name]: !updated }));
    }
  };
    const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_EMAIL_SYNC}/emailsync/auth/google`;
  };
  const [emailList, setEmailList] = useState([]);
  const handleTokenLogin = async () => {
  const targetEmail = emailsync;

  console.log("target", targetEmail);

  if (!targetEmail) {
    alert("⚠️ Please enter your email or login with Google first.");
    return;
  }

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_EMAIL_SYNC}/emailsync/user/login-with-token/${targetEmail}`
    );

    console.log("payload", res.data);

    setEmail(targetEmail);
    setEmailList(res.data.emails || []);
    localStorage.setItem("gmail_user_email", targetEmail);
    setEmailSync(targetEmail);

    // ✅ Update emailSyncEmail in backend
    await authAPI.updateEmailSyncEmail({
      emailSyncEmail: targetEmail,
    });

    alert("✅ Logged in using refresh token!");
  } catch (err) {
    console.error(err);

    alert("❌ Token login failed. Please login with Google again.");
  }
};
  const handleEmailSync = async () => {
  if (!emailsync?.trim()) {
    alert("⚠️ Please enter an email address.");
    return;
  }

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_EMAIL_SYNC}/emailsync/user/exists/${emailsync}`
    );

    // ✅ If user exists → token login
    if (response.data.exists) {
      console.log("User exists, using token login.");

      await handleTokenLogin();

      // ✅ Update email sync email
      await authAPI.updateEmailSyncEmail({
        emailSyncEmail: emailsync,
      });

      console.log("Email sync updated successfully.");
    }

    // ✅ If user does not exist → Google login
    else {
      console.log("User not found, redirecting to Google login.");

      setEmail(emailsync);

      // 🚀 Do NOT continue after Google redirect
      return await handleGoogleLogin();
    }
       // ✅ Update email sync email
      await authAPI.updateEmailSyncEmail({
        emailSyncEmail: emailsync,
      });
  } catch (error) {
    console.error("Email sync failed:", error);
    console.log("email sync error", error);

    alert("❌ Something went wrong while checking email existence.");
  }
};
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Session Expiry Alert */}
      <Snackbar
        open={sessionExpiryAlert}
        autoHideDuration={5000}
        onClose={() => setSessionExpiryAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setSessionExpiryAlert(false)}>
          Password changed! You will be logged out in a moment. Please login again.
        </Alert>
      </Snackbar>

      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Account Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your personal information, password, and preferences
        </Typography>
      </Box>

      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: 5 }}>
        {/* ================= PERSONAL DETAILS ================= */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Personal Details</Typography>
              <IconButton onClick={handleEditClick}>
                <BorderColorRoundedIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {!isEditable ? (
              <Box mt={3} display="flex" gap={3} alignItems="center">
                <Avatar
                  src={preview || getImageUrl(currentImage)}
                  sx={{ width: 100, height: 100 }}
                >
                  {!preview && !currentImage && getInitials()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {/* {firstName} {middleName} {lastname} */}
                    {username}
                  </Typography>
                  <Typography color="text.secondary">{phonenumber}</Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Box position="relative">
                    <Avatar
                      src={preview || getImageUrl(currentImage)}
                      sx={{ width: 100, height: 100 }}
                    />
                    <input
                      type="file"
                      hidden
                      id="upload"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <label htmlFor="upload">
                      <IconButton
                        component="span"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "primary.main",
                          color: "#fff",
                          "&:hover": { bgcolor: "primary.dark" }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </label>
                  </Box>
                </Box>

                <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"} gap={2}>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Middle Name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Last Name"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <TextField
                    label="Phone Number"
                    value={phonenumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    fullWidth
                  />
                </Box>
              </Box>
            )}

            {showSaveButtons && !isLoginEditable && (
              <Box mt={3} display="flex" gap={2}>
                <Button variant="contained" onClick={handleSaveButtonClick} disabled={isUploading}>
                  {isUploading ? <CircularProgress size={20} /> : "Save"}
                </Button>
                <Button variant="outlined" onClick={handleCancelButtonClick}>
                  Cancel
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* ================= LOGIN DETAILS ================= */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Login Details</Typography>
              <IconButton onClick={toggleAlert}>
                <BorderColorRoundedIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email"
                value={isLoginEditable ? tempEmail : email}
                onChange={(e) => setTempEmail(e.target.value)}
                disabled={!isLoginEditable}
                fullWidth
                helperText={isLoginEditable && "Changing email will require re-verification"}
              />

              <TextField
                label="Username"
                value={isLoginEditable ? tempUsername : username}
                onChange={(e) => setTempUsername(e.target.value)}
                disabled={!isLoginEditable}
                fullWidth
              />

              <TextField
                label="Stay signed in for"
                size="small"
                fullWidth
                disabled
                value={formatTimePeriod(signedtime)}
                InputProps={{ readOnly: true }}
              />
            </Box>

            {isLoginEditable && showSaveButtons && (
              <Box mt={3} display="flex" gap={2}>
                <Button variant="contained" onClick={handleSaveLoginChanges}>
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={handleCancelLoginEdit}>
                  Cancel
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
       
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Notification Preferences</Typography>
              <HelpOutlineRoundedIcon sx={{ color: "blue" }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Notification</TableCell>
                    <TableCell align="center">INBOX+</TableCell>
                    <TableCell align="center">EMAIL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notificationItems.map((item) => (
                    <TableRow key={item}>
                      <TableCell>{item}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={notificationState[item] || false}
                          onChange={() => handleNotificationChange(item)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={emailNotificationState[item] || false}
                          onChange={() => handleEmailNotificationChange(item)}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid size={{xs:12,md:6}}>
            <Box className="emailsyns">
            <Box>
              <Typography variant="h6"> Email Sync</Typography>
            </Box>
            <Box className="hr" style={{ marginTop: "10px" }}></Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "20px",
              }}
            >
              <p>
                Sync your existing email with TaxDome — all your client messages
                in one place.
              </p>
              <HelpOutlineRoundedIcon style={{ color: "blue" }} />
            </Box>
            <Box style={{ marginTop: "25px" }}>
              <Box sx={{ width: "94%", margin: "8px" }}>
                <Box className="base-TextField-root">
                  <label htmlFor="last-name">Email for sync</label>
                  <TextField
                    name="Email for sync"
                    // value={emailId}
                    value={emailsync}
                    onChange={(e) => setEmailSync(e.target.value)}
                   
                    size="small"
                    margin="normal"
                    fullWidth
                    placeholder="Email for sync"
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  // onClick={handleEmailIdSubmit}
                  onClick={handleEmailSync}
                  sx={{
                    mt: 2,
                    width: isSmallScreen ? "100%" : "auto",
                    borderRadius: "10px",
                  }}
                >
                  Sync your email
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid> */}

<Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  {/* ================= NOTIFICATION PREFERENCES ================= */}
  <Grid size={{ xs: 12, md: 6 }}>
    <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Notification Preferences</Typography>
        <HelpOutlineRoundedIcon sx={{ color: "blue" }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <TableContainer sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Notification</TableCell>
              <TableCell align="center">INBOX+</TableCell>
              <TableCell align="center">EMAIL</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {notificationItems.map((item) => (
              <TableRow key={item}>
                <TableCell>{item}</TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={notificationState[item] || false}
                    onChange={() => handleNotificationChange(item)}
                    color="primary"
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={emailNotificationState[item] || false}
                    onChange={() => handleEmailNotificationChange(item)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Grid>

  {/* ================= EMAIL SYNC ================= */}
  <Grid size={{ xs: 12, md: 6 }}>
    <Paper sx={{ p: 3, borderRadius: 3, height: "auto" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Email Sync</Typography>
        <HelpOutlineRoundedIcon sx={{ color: "blue" }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="text.secondary" mb={3}>
        Sync your existing email with TaxDome — all your client messages
        in one place.
      </Typography>

      <Box>
        <TextField
          label="Email for sync"
          name="emailSync"
          value={emailsync}
          onChange={(e) => setEmailSync(e.target.value)}
          size="small"
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleEmailSync}
          sx={{
            mt: 3,
            width: isSmallScreen ? "100%" : "auto",
            borderRadius: "10px",
          }}
        >
          Sync your email
        </Button>
      </Box>
    </Paper>
  </Grid>
</Grid>
      {/* Authentication Dialog */}
      <Dialog open={openPasswordModal} onClose={handleCloseAlert} fullWidth maxWidth="sm">
        <DialogContent sx={{ p: 3 }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Authentication Required</Typography>
              <CloseRoundedIcon onClick={handleCloseAlert} sx={{ cursor: "pointer" }} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {!showPasswordChange ? (
              <>
                <Typography color="textSecondary" gutterBottom>
                  Please verify your identity to continue
                </Typography>

                <TextField
                  label="Current Password"
                  type={passShow ? "text" : "password"}
                  fullWidth
                  size="small"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  sx={{ mt: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setPassShow(!passShow)} edge="end">
                          {passShow ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box mt={1}>
                  <NavLink to="/forgot-password" style={{ color: "#6495ED", textDecoration: "none" }}>
                    Forgot Password?
                  </NavLink>
                </Box>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
                  <Button variant="outlined" onClick={() => setShowPasswordChange(true)}>
                    Change Password
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleVerifyPassword}
                    disabled={isVerifying}
                  >
                    {isVerifying ? <CircularProgress size={24} /> : "Continue"}
                  </Button>
                  <Button variant="outlined" onClick={handleCloseAlert}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Change Password
                </Typography>

                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  size="small"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  size="small"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  helperText="Password must be at least 6 characters"
                />

                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  size="small"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                  <Button variant="outlined" onClick={() => setShowPasswordChange(false)}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleChangePassword}>
                    Update Password
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MyAccount;