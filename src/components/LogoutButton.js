// import React, { useState ,useEffect} from 'react';
// import {
//   Button,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Typography,
//   Box,
//   Avatar
// } from '@mui/material';
// import {
//   Logout as LogoutIcon,
//   Devices as DevicesIcon,
//   Person as PersonIcon,
//   Settings as SettingsIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import Logout from './Logout';
// import {authAPI} from '../services/api';
// const LogoutButton = () => {
//     const AUTH_USER_URL =
//     process.env.REACT_APP_AUTH_USER;

    
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [logoutDialog, setLogoutDialog] = useState({ open: false, logoutAll: false });
//     const [userData, setUserData] = useState({
//     username: 'User',
//     email: 'email',
//     profilePicture: null
//   });

//   // Get user data from localStorage
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const userInitial = user?.username?.charAt(0)?.toUpperCase() || 'U';
//  const getImageUrl = (path) => {
//     if (!path) return "";
//     if (path.startsWith("http")) return path;
//     return `${AUTH_USER_URL}${path}`;
//   };
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (!user?.id) return;

//         const res = await authAPI.getSingleUser(user.id);
//         const { user: userInfo, } = res.data;
// console.log("logged user",res.data)
//         setUserData({
//           username: userInfo?.username || 'User',
//           email: userInfo?.email || 'email',
//           profilePicture: userInfo?.profilePicture
//  || null
//         });
//       } catch (error) {
//         console.error(error);
//         // toast.error('Failed to load profile');
//       }
//     };

//     fetchUser();
//   }, [user?.id]);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleProfileClick = () => {
//     handleMenuClose();
//     navigate('/settings/myaccount');
//   };

//   const handleSettingsClick = () => {
//     handleMenuClose();
//     navigate('/settings/firmsettings');
//   };

//   const handleLogoutClick = () => {
//     handleMenuClose();
//     setLogoutDialog({ open: true, logoutAll: false });
//   };

//   const handleLogoutAllClick = () => {
//     handleMenuClose();
//     setLogoutDialog({ open: true, logoutAll: true });
//   };

//   const handleDialogClose = () => {
//     setLogoutDialog({ open: false, logoutAll: false });
//   };

//   return (
//     <>
//       <Button
//         onClick={handleMenuOpen}
//         color="inherit"
//         sx={{ textTransform: 'none' }}
//         startIcon={
//           // <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
//           //   {userInitial}
//           // </Avatar>
//                      <Avatar
//             sx={{ width: 32, height: 32 }}
//             src={getImageUrl(userData.profilePicture) || undefined}
//           >
//             {!userData.profilePicture && userInitial}
//           </Avatar>

//         }
//       >
//         <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
//           <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
//             {user?.username || 'User'}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {user?.email || 'email'}
//           </Typography>
//         </Box>
//       </Button>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MenuItem onClick={handleProfileClick}>
//           <ListItemIcon>
//             <PersonIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Profile</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={handleSettingsClick}>
//           <ListItemIcon>
//             <SettingsIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Settings</ListItemText>
//         </MenuItem>

//         <Divider />

//         <MenuItem onClick={handleLogoutClick}>
//           <ListItemIcon>
//             <LogoutIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
//         </MenuItem>

//         <MenuItem onClick={handleLogoutAllClick}>
//           <ListItemIcon>
//             <DevicesIcon fontSize="small" color="warning" />
//           </ListItemIcon>
//           <ListItemText primary="Logout from all devices" sx={{ color: 'warning.main' }} />
//         </MenuItem>
//       </Menu>

//       <Logout
//         open={logoutDialog.open}
//         onClose={handleDialogClose}
//         logoutAll={logoutDialog.logoutAll}
//       />
//     </>
//   );
// };

// export default LogoutButton;


import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import Logout from "./Logout";

import {
  LogOut,
  Settings,
  User,
  Monitor,
} from "lucide-react";

const LogoutButton = () => {
  const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;

  const navigate = useNavigate();
  const [logoutDialog, setLogoutDialog] = useState({
    open: false,
    logoutAll: false,
  });

  const [userData, setUserData] = useState({
    username: "User",
    email: "email",
    profilePicture: null,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userInitial = user?.username?.charAt(0)?.toUpperCase() || "U";

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${AUTH_USER_URL}${path}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;

      try {
        const res = await authAPI.getSingleUser(user.id);
        const { user: userInfo } = res.data;

        setUserData({
          username: userInfo?.username || "User",
          email: userInfo?.email || "email",
          profilePicture: userInfo?.profilePicture || null,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [user?.id]);
return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 outline-none"
            style={{ fontFamily: "var(--font-family)" }}
          >
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getImageUrl(userData.profilePicture)} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>

              {/* Green online dot */}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
            </div>

            {/* Typography scaled dynamically based on theme rules */}
            {/* <div className="hidden sm:flex flex-col text-left">
              <span 
                style={{ fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)", lineHeight: "1.2" }}
              >
                {userData.username}
              </span>
              <span 
                className="text-muted-foreground"
                style={{ fontSize: "calc(var(--text-caption) * parseFloat(var(--font-scale)) / 100)", marginTop: "2px" }}
              >
                {userData.email}
              </span>
            </div> */}
            <div className="hidden sm:flex flex-col text-left">
  {/* Added text-foreground to adapt automatically between light/dark themes */}
  <span 
    className="text-foreground font-medium"
    style={{ 
      fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)", 
      lineHeight: "1.2" 
    }}
  >
    {userData.username}
  </span>
  
  {/* text-muted-foreground works perfectly across themes as long as the parent background matches */}
  <span 
    className="text-muted-foreground"
    style={{ 
      fontSize: "calc(var(--text-caption) * parseFloat(var(--font-scale)) / 100)", 
      marginTop: "2px" 
    }}
  >
    {userData.email}
  </span>
</div>
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown Menu Items scaling inline elements synchronously */}
        <DropdownMenuContent 
          align="end" 
          className="w-56"
          style={{ 
            fontFamily: "var(--font-family)",
            fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" 
          }}
        >
          <DropdownMenuItem onClick={() => navigate("/settings/myaccount")}>
            <User 
              className="mr-2" 
              style={{ width: "var(--text-body)", height: "var(--text-body)" }} 
            />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/settings/firmsettings")}>
            <Settings 
              className="mr-2" 
              style={{ width: "var(--text-body)", height: "var(--text-body)" }} 
            />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setLogoutDialog({ open: true, logoutAll: false })}
            className="text-red-500"
          >
            <LogOut 
              className="mr-2" 
              style={{ width: "var(--text-body)", height: "var(--text-body)" }} 
            />
            Logout
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setLogoutDialog({ open: true, logoutAll: true })}
            className="text-yellow-500"
          >
            <Monitor 
              className="mr-2" 
              style={{ width: "var(--text-body)", height: "var(--text-body)" }} 
            />
            Logout all devices
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Logout
        open={logoutDialog.open}
        onClose={() => setLogoutDialog({ open: false, logoutAll: false })}
        logoutAll={logoutDialog.logoutAll}
      />
    </>
  );
};
//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="flex items-center gap-2">
//             {/* <Avatar className="h-8 w-8">
//               <AvatarImage src={getImageUrl(userData.profilePicture)} />
//               <AvatarFallback>{userInitial}</AvatarFallback>
//             </Avatar> */}
// <div className="relative">
//   <Avatar className="h-8 w-8">
//     <AvatarImage src={getImageUrl(userData.profilePicture)} />
//     <AvatarFallback>{userInitial}</AvatarFallback>
//   </Avatar>

//   {/* Green online dot */}
//   <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
// </div>
//             <div className="hidden sm:flex flex-col text-left">
//               <span className="text-sm">{userData.username}</span>
//               <span className="text-xs text-muted-foreground">
//                 {userData.email}
//               </span>
//             </div>
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-56">
//           <DropdownMenuItem onClick={() => navigate("/settings/myaccount")}>
//             <User className="mr-2 h-4 w-4" />
//             Profile
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => navigate("/settings/firmsettings")}>
//             <Settings className="mr-2 h-4 w-4" />
//             Settings
//           </DropdownMenuItem>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem
//             onClick={() =>
//               setLogoutDialog({ open: true, logoutAll: false })
//             }
//             className="text-red-500"
//           >
//             <LogOut className="mr-2 h-4 w-4" />
//             Logout
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() =>
//               setLogoutDialog({ open: true, logoutAll: true })
//             }
//             className="text-yellow-500"
//           >
//             <Monitor className="mr-2 h-4 w-4" />
//             Logout all devices
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       <Logout
//         open={logoutDialog.open}
//         onClose={() => setLogoutDialog({ open: false, logoutAll: false })}
//         logoutAll={logoutDialog.logoutAll}
//       />
//     </>
//   );
// };

export default LogoutButton;