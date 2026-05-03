// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Box, TextField, Button, Typography,OutlinedInput,Container,InputAdornment } from "@mui/material";
// import { toast } from "react-toastify";
// import { authAPI } from "../services/api";
// import micropms from "../Images/logoAdmin.png";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// const ResetPassword = () => {
//   const { id, token } = useParams();
//   const navigate = useNavigate();
// const [showPassword, setShowPassword] = useState(false);
// const [comfirShowPassword, setComfirmShowPassword]=useState(false)
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSubmit = async () => {
//     if (!password) return toast.error("Enter password");
//     if (password.length < 6) return toast.error("Min 6 chars");
//     if (password !== confirmPassword)
//       return toast.error("Passwords do not match");

//     try {
//       await authAPI.resetPassword(id, token, { password });

//       toast.success("Password updated successfully");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   return (
    
//       <>
//       {/* Header */}
//       <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
//         <img src={micropms} style={{ height: 40 }} />
//         <Typography sx={{ ml: 1, fontWeight: 700, fontSize: 20 }}>
//           PMS Solutions
//         </Typography>
//       </Box>

//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             mt: 10,
//             p: 4,
//             borderRadius: 3,
//             boxShadow: 3,
//             textAlign: "center",
//           }}
//         >
//           <Typography fontSize={32} fontWeight={700} mb={3}>
//             Set New Password
//           </Typography>

//           {/* Password */}
//           <Box mb={3}>
//             <Typography textAlign="left">Password</Typography>
//             <OutlinedInput
//               fullWidth
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               endAdornment={
//                 <InputAdornment position="end">
//                   <Button onClick={() => setShowPassword(!showPassword)}>
//                     {showPassword ? <Visibility /> : <VisibilityOff />}
//                   </Button>
//                 </InputAdornment>
//               }
//             />
//           </Box>

//           {/* Confirm Password */}
//           <Box mb={3}>
//             <Typography textAlign="left">Confirm Password</Typography>
//             <OutlinedInput
//               fullWidth
//               type={comfirShowPassword ? "text" : "password"}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm password"
//                endAdornment={
//                 <InputAdornment position="end">
//                   <Button onClick={() => setComfirmShowPassword(!comfirShowPassword)}>
//                     {comfirShowPassword ? <Visibility /> : <VisibilityOff />}
//                   </Button>
//                 </InputAdornment>
//               }
//             />
//           </Box>

//           <Button variant="contained" fullWidth onClick={handleSubmit}>
//             Continue
//           </Button>
//         </Box>
//       </Container>
//     </>
//   );
// };

// export default ResetPassword;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "..//components/ui/button";
import { Input } from "..//components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "..//components/ui/card";
import { Label } from "..//components/ui/label";
import { toast } from "react-toastify";
import { authAPI } from "../services/api";
import micropms from "../Images/logoAdmin.png";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [comfirShowPassword, setComfirmShowPassword] = useState(false);
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
    <>
      {/* Header */}
      <div className="p-2 flex items-center">
        <img src={micropms} style={{ height: 40 }} alt="logo" />
        <span className="ml-1 font-bold text-xl">
          PMS Solutions
        </span>
      </div>

      <div className="max-w-md mx-auto">
        <div className="mt-10">
          <Card className="shadow-lg text-center rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold mb-3">
                Set New Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Password */}
              <div className="mb-3">
                <Label htmlFor="password" className="text-left block mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <Label htmlFor="confirmPassword" className="text-left block mb-2">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={comfirShowPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setComfirmShowPassword(!comfirShowPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                  >
                    {comfirShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button variant="default" className="w-full" onClick={handleSubmit}>
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;