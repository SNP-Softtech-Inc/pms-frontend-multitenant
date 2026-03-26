import React, { useState } from "react";
import { Box, TextField, Button, Typography,Container } from "@mui/material";
import { toast } from "react-toastify";
import { authAPI } from "../services/api";
import micropms from "../Images/logoAdmin.png";
import { NavLink } from "react-router-dom";
const ForgotPassword = () => {
    const ADMIN_URL= process.env.REACT_APP_CLIENT_URL
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) return toast.error("Enter email");

    try {
      await authAPI.forgotPassword({
        email,
        url: `${ADMIN_URL}/reset-password`,
      });

      toast.success("Reset link sent to email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    // <Box p={4}>
    //   <Typography variant="h5">Forgot Password</Typography>

    //   <TextField
    //     fullWidth
    //     placeholder="Enter your email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     sx={{ mt: 2 }}
    //   />

    //   <Button
    //     fullWidth
    //     variant="contained"
    //     onClick={handleSubmit}
    //     sx={{ mt: 2 }}
    //   >
    //     Send Reset Link
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
          <Typography fontSize={32} fontWeight={700} mb={2}>
            Reset your password
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Enter your email to receive a reset link
          </Typography>

             <TextField
        fullWidth
        placeholder="Enter your email"
        value={email}
        margin="normal"
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mt: 2 }}
      />
          <Box display="flex" gap={2} justifyContent="center" mt={5}>
            <Button variant="contained" onClick={handleSubmit}>
              Get Reset Link
            </Button>

            <NavLink to="/login" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Back to Login</Button>
            </NavLink>
          </Box>
        </Box>

       
      </Container>
    </>
  );
};

export default ForgotPassword;