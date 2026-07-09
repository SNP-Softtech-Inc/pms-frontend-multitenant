

// import React, { useState, useEffect } from "react";
// import "./login.css";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import {
//   Menu,
//   Alert,
//   Box,
//   Typography,
//   FormControl,
//   Button,
//   Checkbox,
//   IconButton,
//   InputAdornment,
//   Select,
//   MenuItem,
//   TextField,
//   CircularProgress,Autocomplete
// } from "@mui/material";
// import { Grid } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { NavLink, useNavigate, Link } from "react-router-dom";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import logo from "../Images/logoAdmin.png";

// import { useAuth } from "../context/AuthContext";
// import { authAPI } from "../services/api";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, isAuthenticated, loading } = useAuth();

//   const [apiError, setApiError] = useState("");
//   const [agreeToTerms, setAgreeToTerms] = useState(false);

//   const [inpval, setInpval] = useState({
//     email: "",
//     password: "",
//     expiryTime: "",
//   });
// const expiryOptions = [
//   { label: "Select time", value: "" },
//   { label: "1 min", value: "1min" },
//   { label: "5 min", value: "5min" },
//   { label: "30 min", value: "30min" },
//   { label: "4 hours", value: "4hours" },
//   { label: "8 hours", value: "8hours" },
// ];
//   const [userList, setUserList] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);

//   const setVal = (e) => {
//     const { name, value } = e.target;
//     setInpval((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleClickShowPassword = () =>
//     setShowPassword((show) => !show);

//   const handleMouseDownPassword = (e) => e.preventDefault();

//   const handleUserMenuClose = () => setAnchorEl(null);

//   const handleUserSelect = (user) => {
//     setSelectedUser(user);
//     setAnchorEl(null);
//   };

//   // 🔥 Check email users (Auth microservice)
//   const checkEmailForUsers = async (email) => {
//     if (!email || !email.includes("@")) return;

//     try {
//       const response = await authAPI.getUsersByEmail(email);

//       if (response.data.users?.length > 1) {
//         setUserList(response.data.users);
//       } else if (response.data.users?.length === 1) {
//         setSelectedUser(response.data.users[0]);
//       } else {
//         toast.error("No users found");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error");
//     }
//   };

//   const handleEmailBlur = async () => {
//     await checkEmailForUsers(inpval.email);
//   };

//   const handleUserMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   // 🔥 LOGIN HANDLER (uses AuthContext)
//   const loginuser = async (e) => {
//     e.preventDefault();

//     const { email, password, expiryTime } = inpval;

//     if (!email) return toast.error("Email required");
//     if (!email.includes("@")) return toast.error("Invalid email");
//     if (!password) return toast.error("Password required");
//     if (password.length < 6)
//       return toast.error("Min 6 characters");
//     if (!expiryTime) return toast.error("Select expiry time");
//     if (!agreeToTerms)
//       return toast.error("Accept terms");

//     if (userList.length > 1 && !selectedUser) {
//       return toast.error("Select account");
//     }

//     setApiError("");

//     const result = await login(email, password, expiryTime);

//     if (result.success) {
//       toast.success("Login successful");

//       setInpval({ email: "", password: "", expiryTime: "" });
//       setSelectedUser(null);
//       setAgreeToTerms(false);

//       // if (result.user.role === "admin") {
//       //   navigate("/admin/dashboard");
//       // } else {
//       //   navigate("/");
//       // }
//        navigate("/");
//     } else {
//       setApiError(result.error);
//       toast.error(result.error);
//     }
//   };

//   return (
//     <Grid container sx={{ height: "100vh" }}>
//       {/* LEFT */}
//       <Grid item xs={12} md={6}>
//         <Box sx={{ bgcolor: "primary.main", color: "white", p: 4, height: "100%" }}>
//           <img src={logo} alt="logo" style={{ height: 80 }} />

//           <Typography variant="h4" sx={{ mt: 3 }}>
//             Welcome Back
//           </Typography>

//           <Typography sx={{ mt: 2 }}>
//             Please login to continue
//           </Typography>
//         </Box>
//       </Grid>

//       {/* RIGHT */}
//       <Grid item xs={12} md={6}>
//         <Box sx={{ p: 4 }}>
//           <Typography variant="h5" mb={2}>
//             Login
//           </Typography>

//           {apiError && <Alert severity="error">{apiError}</Alert>}

//           <TextField
//             fullWidth
//             name="email"
//             placeholder="Email"
//             value={inpval.email}
//             onChange={setVal}
//             onBlur={handleEmailBlur}
//             sx={{ mt: 2 }}
//           />

//           {selectedUser && (
//             <Alert sx={{ mt: 1 }}>
//               {selectedUser.username} ({selectedUser.role})
//             </Alert>
//           )}

//           {userList.length > 1 && (
//             <>
//               <Button onClick={handleUserMenuOpen}>
//                 Select Account
//               </Button>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleUserMenuClose}
//               >
//                 {userList.map((u) => (
//                   <MenuItem
//                     key={u._id}
//                     onClick={() => handleUserSelect(u)}
//                   >
//                     {u.username}
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           )}

//           <TextField
//             fullWidth
//             type={showPassword ? "text" : "password"}
//             name="password"
//             placeholder="Password"
//             value={inpval.password}
//             onChange={setVal}
//             sx={{ mt: 2 }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleClickShowPassword}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

// <Typography mt={1} textAlign="right">
//   <Link to="/forgot-password">Forgot Password?</Link>
// </Typography>

// <FormControl fullWidth sx={{ mt: 2 }}>
//   <Autocomplete
//     options={expiryOptions}
//     value={
//       expiryOptions.find((opt) => opt.value === inpval.expiryTime) || null
//     }
//     onChange={(event, newValue) => {
//       setVal({
//         target: {
//           name: "expiryTime",
//           value: newValue ? newValue.value : "",
//         },
//       });
//     }}
//     getOptionLabel={(option) => option.label}
//     renderInput={(params) => (
//       <TextField {...params} label="Select time" />
//     )}
//     isOptionEqualToValue={(option, value) =>
//       option.value === value.value
//     }
//   />
// </FormControl>
//           {/* <FormControl fullWidth sx={{ mt: 2 }}>
//             <Select
//               name="expiryTime"
//               value={inpval.expiryTime}
//               onChange={setVal}
//             >
//               <MenuItem value="">Select time</MenuItem>
//               <MenuItem value="1min">1 min</MenuItem>
//               <MenuItem value="5min">5 min</MenuItem>
//               <MenuItem value="30min">30 min</MenuItem>
//               <MenuItem value="4hours">4 hours</MenuItem>
//               <MenuItem value="8hours">8 hours</MenuItem>
//             </Select>
//           </FormControl> */}

//           <Box mt={2}>
//             <Checkbox
//               checked={agreeToTerms}
//               onChange={(e) =>
//                 setAgreeToTerms(e.target.checked)
//               }
//             />
//             Agree to terms
//           </Box>

//           <Button
//             fullWidth
//             variant="contained"
//             onClick={loginuser}
//             disabled={loading}
//             sx={{ mt: 2 }}
//           >
//             {loading ? <CircularProgress size={20} /> : "Login"}
//           </Button>

//           <Typography mt={2}>
//             Don't have account?{" "}
//             <Link to="/signup">Signup</Link>
//           </Typography>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useToastContext } from "..//context/ToastContext";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../Images/logoAdmin.png";

import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

// shadcn/ui components
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Alert, AlertDescription } from "../components/ui/alert";

const Login = () => {
  const navigate = useNavigate();

  const { login, isAuthenticated, loading } = useAuth();
const {showToast} = useToastContext()
  const [apiError, setApiError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // ✅ Dialog
  const [openUserDialog, setOpenUserDialog] = useState(false);

  const [inpval, setInpval] = useState({
    email: "",
    password: "",
    expiryTime: "",
  });

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  // ================= REDIRECT =================
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // ================= INPUT CHANGE =================
  const setVal = (e) => {
    const { name, value } = e.target;

    setInpval((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SHOW PASSWORD =================
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // ================= SELECT USER =================
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(false);
  };

  // ================= CHECK USERS BY EMAIL =================
  const checkEmailForUsers = async (email) => {
     // ✅ Remove extra white spaces
  const cleanEmail = email.trim();
console.log("entred emawil",cleanEmail)
    // if (!email || !email.includes("@")) return;
 if (!cleanEmail || !cleanEmail.includes("@")) return;
    try {
      const response = await authAPI.getUsersByEmail(cleanEmail);

      const users = response.data.users || [];

      if (users.length > 1) {
        setUserList(users);

        // ✅ Open dialog automatically
        setOpenUserDialog(true);
      } else if (users.length === 1) {
        setSelectedUser(users[0]);
      } else {
        setUserList([]);
        setSelectedUser(null);
      }
    } catch (error) {
     showToast({
  title: error.response?.data?.message || "Error fetching users",
  type: "error",
});
    }
  };

  // ================= EMAIL BLUR =================
  const handleEmailBlur = async () => {
    await checkEmailForUsers(inpval.email);
  };

  // ================= LOGIN =================
  const loginuser = async (e) => {
    e.preventDefault();

    // const { email, password, expiryTime } = inpval;
  // ✅ Remove extra white spaces
  const email = inpval.email.trim();
  const password = inpval.password.trim();
  const expiryTime = inpval.expiryTime;
    if (!email) {
      return showToast({
        title: "Email required",
        description: "Please enter your email address.",
        type: "error",
      });
    }

    if (!email.includes("@")) {
      return showToast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        type: "error",
      });
    }

    if (!password) {
      return showToast({
        title: "Password required",
        description: "Please enter your password.",
        type: "error",
      });
    }

    if (password.length < 6) {
      return showToast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
        type: "error",
      });
    }

    if (!expiryTime) {
      return showToast({
        title: "Expiry time required",
        description: "Please select an expiry time.",
        type: "error",
      });
    }

    if (!agreeToTerms) {
      return showToast({
        title: "Terms & conditions required",
        description: "Please accept the terms and conditions.",
        type: "error",
      });
    }

    // ✅ Must select account
    if (userList.length > 1 && !selectedUser) {
      setOpenUserDialog(true);

      return showToast({
        title: "Please select account",
        description: "Multiple accounts found for this email.",
        type: "error",
      });
    }

    setApiError("");

    try {
      const result = await login(
        email,
        password,
        expiryTime,
        selectedUser?._id
      );

      // ✅ Backend says multiple accounts
      if (result?.multipleAccounts) {
        setUserList(result.users || []);
        setOpenUserDialog(true);

        return;
      }

      if (result.success) {
        showToast({
          title: "Login successful",
          description: "You have been logged in successfully.",
          type: "success",
        });

        setInpval({
          email: "",
          password: "",
          expiryTime: "",
        });

        setSelectedUser(null);
        setAgreeToTerms(false);

        navigate("/");
      } else {
        setApiError(result.error);

        showToast({
          title: "Login failed",
          description: result.error,
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        title: "Login failed",
        description: "An error occurred while logging in.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
      {/* ================= LEFT PANEL ================= */}
      <div
        className="
          hidden md:flex
          relative
          items-center justify-center
          p-16
          overflow-hidden
          text-white
          bg-gradient-to-br
          from-primary
          via-primary/90
          to-primary/70
        "
      >
        {/* Glow */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-white/10 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-3xl rounded-full" />

        <div className="relative max-w-md text-center space-y-6">
          <img
            src={logo}
            alt="logo"
            className="mx-auto h-16 mb-6"
          />

          <h1 className="text-4xl font-semibold tracking-tight text-white">
            PMS Solutions
          </h1>

          <p className="text-white/90 text-lg leading-relaxed">
            Welcome to SNP Tax & Financials, where tax management
            meets simplicity. Our advanced software streamlines tax
            processes for individuals, businesses, and professionals,
            ensuring accuracy and efficiency.
          </p>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card
            className="
              p-8
              rounded-2xl
              shadow-2xl
              border
              border-border
              bg-card
              text-card-foreground
              space-y-6
            "
          >
            {/* HEADER */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">
                Login Account
              </h2>

              <p className="text-sm text-muted-foreground">
                Welcome back. Enter your credentials.
              </p>
            </div>

            {/* ERROR */}
            {apiError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {apiError}
                </AlertDescription>
              </Alert>
            )}

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>

              <Input
                name="email"
                value={inpval.email}
                onChange={setVal}
                onBlur={handleEmailBlur}
                placeholder="Enter your email"
                className="focus-visible:ring-primary"
              />
            </div>

            {/* SELECTED ACCOUNT */}
            {selectedUser && (
              <Alert>
                <AlertDescription className="text-sm">
                  Logging in as{" "}
                  <span className="font-medium">
                    {selectedUser.username} (
                    {selectedUser.role})
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={inpval.password}
                  onChange={setVal}
                  placeholder="Password"
                  className="pr-10 focus-visible:ring-primary"
                />

                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                    hover:text-foreground
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* EXPIRY */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Stay signed in for
              </label>

              <Select
                value={inpval.expiryTime}
                onValueChange={(value) =>
                  setInpval((prev) => ({
                    ...prev,
                    expiryTime: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1min">
                    1 minute
                  </SelectItem>

                  <SelectItem value="5min">
                    5 minutes
                  </SelectItem>

                  <SelectItem value="30min">
                    30 minutes
                  </SelectItem>

                  <SelectItem value="4hours">
                    4 hours
                  </SelectItem>

                  <SelectItem value="8hours">
                    8 hours
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* TERMS */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) =>
                    setAgreeToTerms(e.target.checked)
                  }
                  className="
                    h-4 w-4
                    rounded
                    border-border
                    accent-primary
                  "
                />

                <span className="text-sm text-muted-foreground">
                  Agree to{" "}
                  <a
                    href="https://policies.google.com/terms?hl=en-US"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Terms & Conditions
                  </a>
                </span>
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <Button
              onClick={loginuser}
              disabled={loading}
              className="
                w-full
                bg-primary
                text-primary-foreground
                hover:bg-primary/90
              "
            >
              {loading ? (
                <div
                  className="
                    h-4 w-4 animate-spin
                    rounded-full
                    border-2
                    border-primary-foreground
                    border-t-transparent
                  "
                />
              ) : (
                "Login"
              )}
            </Button>

            {/* SIGNUP */}
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign Up
              </NavLink>
            </div>
          </Card>
        </div>
      </div>

      {/* ================= ACCOUNT SELECTION DIALOG ================= */}
      <Dialog
        open={openUserDialog}
        onOpenChange={setOpenUserDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Select Professional Account
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {userList.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="
                  border rounded-xl p-4 cursor-pointer
                  hover:border-primary
                  hover:bg-muted/40
                  transition-all
                "
              >
                <div className="font-medium">
                  {user.username}
                </div>

                <div className="text-sm text-muted-foreground">
                  {user.role}
                </div>

                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Login;