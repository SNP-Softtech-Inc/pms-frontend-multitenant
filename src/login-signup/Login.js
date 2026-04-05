

import React, { useState, useEffect } from "react";
import "./login.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
  Menu,
  Alert,
  Box,
  Typography,
  FormControl,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Grid } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink, useNavigate, Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import logo from "../Images/logoAdmin.png";

import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const [apiError, setApiError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [inpval, setInpval] = useState({
    email: "",
    password: "",
    expiryTime: "",
  });

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () =>
    setShowPassword((show) => !show);

  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleUserMenuClose = () => setAnchorEl(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setAnchorEl(null);
  };

  // 🔥 Check email users (Auth microservice)
  const checkEmailForUsers = async (email) => {
    if (!email || !email.includes("@")) return;

    try {
      const response = await authAPI.getUsersByEmail(email);

      if (response.data.users?.length > 1) {
        setUserList(response.data.users);
      } else if (response.data.users?.length === 1) {
        setSelectedUser(response.data.users[0]);
      } else {
        toast.error("No users found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const handleEmailBlur = async () => {
    await checkEmailForUsers(inpval.email);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 🔥 LOGIN HANDLER (uses AuthContext)
  const loginuser = async (e) => {
    e.preventDefault();

    const { email, password, expiryTime } = inpval;

    if (!email) return toast.error("Email required");
    if (!email.includes("@")) return toast.error("Invalid email");
    if (!password) return toast.error("Password required");
    if (password.length < 6)
      return toast.error("Min 6 characters");
    if (!expiryTime) return toast.error("Select expiry time");
    if (!agreeToTerms)
      return toast.error("Accept terms");

    if (userList.length > 1 && !selectedUser) {
      return toast.error("Select account");
    }

    setApiError("");

    const result = await login(email, password, expiryTime);

    if (result.success) {
      toast.success("Login successful");

      setInpval({ email: "", password: "", expiryTime: "" });
      setSelectedUser(null);
      setAgreeToTerms(false);

      // if (result.user.role === "admin") {
      //   navigate("/admin/dashboard");
      // } else {
      //   navigate("/");
      // }
       navigate("/");
    } else {
      setApiError(result.error);
      toast.error(result.error);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* LEFT */}
      <Grid item xs={12} md={6}>
        <Box sx={{ bgcolor: "primary.main", color: "white", p: 4, height: "100%" }}>
          <img src={logo} alt="logo" style={{ height: 80 }} />

          <Typography variant="h4" sx={{ mt: 3 }}>
            Welcome Back
          </Typography>

          <Typography sx={{ mt: 2 }}>
            Please login to continue
          </Typography>
        </Box>
      </Grid>

      {/* RIGHT */}
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" mb={2}>
            Login
          </Typography>

          {apiError && <Alert severity="error">{apiError}</Alert>}

          <TextField
            fullWidth
            name="email"
            placeholder="Email"
            value={inpval.email}
            onChange={setVal}
            onBlur={handleEmailBlur}
            sx={{ mt: 2 }}
          />

          {selectedUser && (
            <Alert sx={{ mt: 1 }}>
              {selectedUser.username} ({selectedUser.role})
            </Alert>
          )}

          {userList.length > 1 && (
            <>
              <Button onClick={handleUserMenuOpen}>
                Select Account
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
              >
                {userList.map((u) => (
                  <MenuItem
                    key={u._id}
                    onClick={() => handleUserSelect(u)}
                  >
                    {u.username}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={inpval.password}
            onChange={setVal}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

<Typography mt={1} textAlign="right">
  <Link to="/forgot-password">Forgot Password?</Link>
</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              name="expiryTime"
              value={inpval.expiryTime}
              onChange={setVal}
            >
              <MenuItem value="">Select time</MenuItem>
              <MenuItem value="1min">1 min</MenuItem>
              <MenuItem value="5min">5 min</MenuItem>
              <MenuItem value="30min">30 min</MenuItem>
              <MenuItem value="4hours">4 hours</MenuItem>
              <MenuItem value="8hours">8 hours</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2}>
            <Checkbox
              checked={agreeToTerms}
              onChange={(e) =>
                setAgreeToTerms(e.target.checked)
              }
            />
            Agree to terms
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={loginuser}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={20} /> : "Login"}
          </Button>

          <Typography mt={2}>
            Don't have account?{" "}
            <Link to="/signup">Signup</Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;