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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@mui/material";
import { NavLink } from "react-router-dom";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
const MyAccount = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const AUTH_USER_URL =
    process.env.REACT_APP_AUTH_USER;

  const { user, updateUserData } = useAuth();

  const [isEditable, setIsEditable] = useState(false);
  const [showSaveButtons, setShowSaveButtons] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [signedtime, setSignedTime] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [userNotifications, setUserNotifications] = useState([]); // list of individual notifications
  const [notificationDocId, setNotificationDocId] = useState(""); // parent Notification document _id
  const [currentPassword, setCurrentPassword] = useState("");

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

  const emailNotificationItems = [
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
    notificationItems.reduce((acc, item) => ({ ...acc, [item]: false }), {}),
  );

  const [emailNotificationState, setEmailNotificationState] = useState(
    emailNotificationItems.reduce(
      (acc, item) => ({ ...acc, [item]: false }),
      {},
    ),
  );
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${AUTH_USER_URL}${path}`;
  };
  useEffect(() => {
    const updateSignedTime = () => {
      const expiry = localStorage.getItem("sessionExpiry");

      if (!expiry) return;

      const remainingMs = Number(expiry) - Date.now();

      if (remainingMs <= 0) {
        setSignedTime(0);
      } else {
        setSignedTime(Math.floor(remainingMs / 1000)); // convert to seconds
      }
    };

    updateSignedTime();

    // update every second (live countdown 🔥)
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
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    if (user?.id) fetchUser();
  }, [user]);
  // Function to toggle the alert box
  const toggleAlert = () => {
    setOpenPasswordModal(true);
  };

  const handleCloseAlert = () => {
    setOpenPasswordModal(false);
  };
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
        email,
        username,
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

  const getInitials = () => {
    return `${firstName?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();
  };

  const handleUpdatePasswordClick = () => {
    setOpenPasswordModal(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authAPI.getNotificationByUser(user.id);
        const notifData = res.data?.notification;
        console.log("notifications data", notifData);
        if (!notifData) return;

        setNotificationDocId(notifData._id); // parent document _id
        setUserNotifications(notifData.notifications); // individual notifications

        // Initialize checkbox states
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

  // Prepare a mapping of notificationDescription -> _id for easier updates
  const notificationIdMap = {};
  userNotifications.forEach((notif) => {
    notificationIdMap[notif.notificationDescription] = notif._id;
  });
  const handleNotificationChange = async (name) => {
    const notifId = notificationIdMap[name]; // get _id from your mapping
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
    }
  };

  const handleEmailNotificationChange = async (name) => {
    const notifId = notificationIdMap[name]; // get _id from your mapping
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
    }
  };
 
  return (
    <Box sx={{ p: 3, width: "100%" }}>
        <Box
      display="flex"
      flexDirection="column"
      alignItems="center" // horizontally centers content
      textAlign="center" // centers text for multiple lines
      mb={3}
    >
      <Typography variant="h4" component="h1" fontWeight="bold">
        Account Settings
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Manage your personal information, password, and preferences
      </Typography>
    </Box>
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ mb: 5 }}
      >
        {/* ================= PERSONAL DETAILS ================= */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
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
                    {firstName} {middleName} {lastname}
                  </Typography>
                  <Typography color="text.secondary">{phonenumber}</Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                {/* IMAGE */}
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
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </label>
                  </Box>
                </Box>

                {/* INPUTS */}
                <Box
                  display="flex"
                  flexDirection={isSmallScreen ? "column" : "row"}
                  gap={2}
                >
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
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    fullWidth
                  />
                </Box>
              </Box>
            )}

            {/* ================= ACTION BUTTONS ================= */}
            {showSaveButtons && (
              <Box mt={3} display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={handleSaveButtonClick}
                  disabled={isUploading}
                >
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {" "}
              <Typography variant="h6">Login Details</Typography>
              <IconButton onClick={toggleAlert}>
                <BorderColorRoundedIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                fullWidth
              />

              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled
                fullWidth
              />

              <TextField
                label="Stay signed in for"
                size="small"
                fullWidth
                disabled
                value={formatTimePeriod(signedtime)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* ================= NOTIFICATION PREFERENCES ================= */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
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
                        {item !== "Documents" ? (
                          <Checkbox
                            // checked={notificationState[item]}
                            checked={notificationState[item] || false}
                            onChange={() => handleNotificationChange(item)}
                            color="primary"
                          />
                        ) : null}
                      </TableCell>
                      <TableCell align="center">
                        {item !== "Documents" ? (
                          <Checkbox
                            // checked={emailNotificationState[item]}
                            checked={emailNotificationState[item] || false}
                            onChange={() => handleEmailNotificationChange(item)}
                            color="primary"
                          />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openPasswordModal}
        onClose={handleCloseAlert}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent sx={{ p: 2 }}>
          <Box className="overlay-login-container">
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Authentication</Typography>
              <CloseRoundedIcon
                onClick={handleCloseAlert}
                sx={{ cursor: "pointer" }}
              />
            </Box>

            <hr style={{ margin: "15px 0" }} />

            {/* Info Text */}
            <Typography>
              In order to change your login details you must provide your
              current password.
            </Typography>

            {/* Password Field */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                mt: 2,
              }}
            >
              <TextField
                label="Password"
                name="password"
                type={passShow ? "text" : "password"}
                placeholder="Enter your password"
                size="small"
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPassShow(!passShow)}
                        edge="end"
                      >
                        {passShow ? (
                          <VisibilityOffRoundedIcon />
                        ) : (
                          <VisibilityRoundedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Forgot password */}
            <Box mt={1}>
              <NavLink
                to="/forgot-password"
                style={{
                  color: "#6495ED",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Forgot Password?
              </NavLink>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button variant="contained" onClick={handleUpdatePasswordClick}>
                Submit
              </Button>

              <Button variant="outlined" onClick={handleCloseAlert}>
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MyAccount;
