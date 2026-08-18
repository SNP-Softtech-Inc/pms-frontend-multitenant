


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
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  Settings,
  User,
  Monitor,
} from "lucide-react";

const LogoutButton = () => {
  const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;

  const navigate = useNavigate();
    const { user } = useAuth();
  console.log("logged user in login buuton",user)
  const [logoutDialog, setLogoutDialog] = useState({
    open: false,
    logoutAll: false,
  });

  const [userData, setUserData] = useState({
    username: "username",
    email: "email",
    profilePicture: null,
  });

  // const user = JSON.parse(localStorage.getItem("user") || "{}");
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
console.log("login user",res.data)
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