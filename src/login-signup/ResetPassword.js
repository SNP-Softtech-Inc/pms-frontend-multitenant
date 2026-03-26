import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography,OutlinedInput,Container,InputAdornment } from "@mui/material";
import { toast } from "react-toastify";
import { authAPI } from "../services/api";
import micropms from "../Images/logoAdmin.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [comfirShowPassword, setComfirmShowPassword]=useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!password) return toast.error("Enter password");
    if (password.length < 6) return toast.error("Min 6 chars");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await authAPI.resetPassword(id, token, { password });

      toast.success("Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    // <Box p={4}>
    //   <Typography variant="h5">Reset Password</Typography>

    //   <TextField
    //     fullWidth
    //     type="password"
    //     placeholder="New Password"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //     sx={{ mt: 2 }}
    //   />

    //   <TextField
    //     fullWidth
    //     type="password"
    //     placeholder="Confirm Password"
    //     value={confirmPassword}
    //     onChange={(e) => setConfirmPassword(e.target.value)}
    //     sx={{ mt: 2 }}
    //   />

    //   <Button
    //     fullWidth
    //     variant="contained"
    //     onClick={handleSubmit}
    //     sx={{ mt: 2 }}
    //   >
    //     Update Password
    //   </Button>
    // </Box>
      <>
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <img src={micropms} style={{ height: 40 }} />
        <Typography sx={{ ml: 1, fontWeight: 700, fontSize: 20 }}>
          PMS Solutions
        </Typography>
      </Box>

      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 10,
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Typography fontSize={32} fontWeight={700} mb={3}>
            Set New Password
          </Typography>

          {/* Password */}
          <Box mb={3}>
            <Typography textAlign="left">Password</Typography>
            <OutlinedInput
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              endAdornment={
                <InputAdornment position="end">
                  <Button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </Button>
                </InputAdornment>
              }
            />
          </Box>

          {/* Confirm Password */}
          <Box mb={3}>
            <Typography textAlign="left">Confirm Password</Typography>
            <OutlinedInput
              fullWidth
              type={comfirShowPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
               endAdornment={
                <InputAdornment position="end">
                  <Button onClick={() => setComfirmShowPassword(!comfirShowPassword)}>
                    {comfirShowPassword ? <Visibility /> : <VisibilityOff />}
                  </Button>
                </InputAdornment>
              }
            />
          </Box>

          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Continue
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ResetPassword;