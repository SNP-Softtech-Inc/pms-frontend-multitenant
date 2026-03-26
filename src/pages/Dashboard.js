// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Drawer,
//   Toolbar,
//   List,
//   Typography,
//   Divider,
//   IconButton,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Menu,
//   MenuItem,
//   Badge,
//   Tooltip,
// } from "@mui/material";

// import {
//   Menu as MenuIcon,
//   ChevronLeft,
//   ChevronRight,
//   Dashboard as DashboardIcon,
//   Notifications,
//   ExpandLess,
//   ExpandMore,
// } from "@mui/icons-material";

// import { Collapse } from "@mui/material";
// import { useAuth } from "../context/AuthContext";
// import LogoutButton from "../components/LogoutButton";
// import { sidebarAPI } from "../services/api";
// import { useNavigate, Outlet, useLocation } from "react-router-dom";

// // 🔥 React Icons (dynamic icons support)
// import * as AiIcons from "react-icons/ai";
// import * as MdIcons from "react-icons/md";
// import * as IoIcons from "react-icons/io5";
// import * as GoIcons from "react-icons/go";
// import * as LuIcons from "react-icons/lu";
// import * as LiaIcons from "react-icons/lia";
// import * as FiIcons from "react-icons/fi";

// const drawerWidth = 240;
// const collapsedDrawerWidth = 70;

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [open, setOpen] = useState(true);
//   const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
//   const [sidebarItems, setSidebarItems] = useState([]);
//   const [openMenus, setOpenMenus] = useState({});
//   const Icons = {
//     ...AiIcons,
//     ...MdIcons,
//     ...IoIcons,
//     ...GoIcons,
//     ...LuIcons,
//     ...LiaIcons,
//     ...FiIcons,
//   };
//   // 🔥 Dynamic icon render
//   const getIcon = (iconName) => {
//     const IconComponent = Icons[iconName];
//     return IconComponent ? <IconComponent size={20} /> : <DashboardIcon />;
//   };

//   // Fetch sidebar
//   useEffect(() => {
//     const fetchSidebar = async () => {
//       try {
//         const res = await sidebarAPI.getSidebar();
//         setSidebarItems(res.data || []);
//       } catch (error) {
//         console.error("Sidebar fetch error:", error);
//       }
//     };
//     fetchSidebar();
//   }, []);

//   // 🔥 Auto open submenu
//   useEffect(() => {
//     const newOpenMenus = {};

//     sidebarItems.forEach((item, index) => {
//       if (item.submenu?.some((sub) => location.pathname.startsWith(sub.path))) {
//         newOpenMenus[index] = true;
//       }
//     });

//     setOpenMenus(newOpenMenus);
//   }, [location.pathname, sidebarItems]);

//   const handleToggleMenu = (index) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDrawerToggle = () => {
//     setOpen(!open);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         minHeight: "100vh",
//         bgcolor: "background.default",
//       }}
//     >
//       {/* ================= SIDEBAR ================= */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: open ? drawerWidth : collapsedDrawerWidth,
//           [`& .MuiDrawer-paper`]: {
//             width: open ? drawerWidth : collapsedDrawerWidth,
//             transition: "0.3s",
//             overflowX: "hidden",
//           },
//         }}
//       >
//         {/* Logo */}
//         <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
//           <Avatar sx={{ bgcolor: "primary.main" }}>S</Avatar>
//           {open && (
//             <Typography sx={{ ml: 1, fontWeight: 600 }}>SNP Admin</Typography>
//           )}
//         </Box>
//         <Divider />
//         <List>
//           {sidebarItems.map((item, index) => (
//             <React.Fragment key={index}>
//               {/* MAIN MENU */}
//               <ListItem disablePadding>
//                 <Tooltip title={!open ? item.label : ""} placement="right">
//                   <ListItemButton
//                     onClick={() => {
//                       if (item.submenu?.length > 0) {
//                         handleToggleMenu(index);
//                       } else {
//                         navigate(item.path);
//                       }
//                     }}
//                     sx={{
//                       justifyContent: open ? "initial" : "center",
//                       px: 2.5,
//                       mx: 1,
//                       borderRadius: 2,
//                       mb: 0.5,
//                     }}
//                   >
//                     <ListItemIcon sx={{ minWidth: 35 }}>
//                       {getIcon(item.icon)}
//                     </ListItemIcon>

//                     <ListItemText
//                       primary={item.label}
//                       sx={{ opacity: open ? 1 : 0 }}
//                     />

//                     {item.submenu?.length > 0 &&
//                       open &&
//                       (openMenus[index] ? <ExpandLess /> : <ExpandMore />)}
//                   </ListItemButton>
//                 </Tooltip>
//               </ListItem>

//               {/* SUBMENU */}
//               {item.submenu?.length > 0 && (
//                 <Collapse in={openMenus[index]} timeout="auto" unmountOnExit>
//                   <List component="div" disablePadding>
//                     {item.submenu.map((subItem, subIndex) => (
//                       <ListItem key={subIndex} disablePadding>
//                         <Tooltip
//                           title={!open ? subItem.label : ""}
//                           placement="right"
//                         >
//                           <ListItemButton
//                             onClick={() => navigate(subItem.path)}
//                             sx={{
//                               pl: 6,
//                               mx: 1,
//                               borderRadius: 2,
//                             }}
//                           >
//                             <ListItemIcon sx={{ minWidth: 25 }}>
//                               {getIcon(subItem.icon)}
//                             </ListItemIcon>
//                             <ListItemText primary={subItem.label} />
//                           </ListItemButton>
//                         </Tooltip>
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Collapse>
//               )}
//             </React.Fragment>
//           ))}
//         </List>
//       </Drawer>

//       {/* ================= MAIN ================= */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           display: "flex",
//           flexDirection: "column", // stack header + content
//           height: "100vh",
//         }}
//       >
//         {/* HEADER */}
//         <Box
//           sx={{
//             height: 70,
//             px: 4,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderBottom: 1,
//             borderColor: "divider",
//             bgcolor: "background.paper",
//             flexShrink: 0, // prevent shrinking
//           }}
//         >
//           <Box display="flex" alignItems="center">
//             <IconButton onClick={handleDrawerToggle}>
//               <MenuIcon />
//             </IconButton>
//             <Typography sx={{ ml: 2, fontWeight: 600 }}>Dashboard</Typography>
//           </Box>

//           <Box display="flex" alignItems="center" gap={2}>
//             <LogoutButton size="small" />
//           </Box>
//         </Box>

//         {/* CONTENT */}
//         <Box
//           sx={{
//             flexGrow: 1, // take remaining space
//             overflowY: "auto", // enable scrolling
//             p: 3,
//             bgcolor: "background.default",
//           }}
//         >
//           <Box
//             sx={{
//               bgcolor: "background.paper",
//               p: 3,
//               borderRadius: 3,
//               minHeight: "100%", // fill available height
//               boxShadow: 1,
//             }}
//           >
//             <Outlet />
//           </Box>
//         </Box>
//       </Box>

//       {/* NOTIFICATIONS */}
//       <Menu
//         anchorEl={notificationAnchorEl}
//         open={Boolean(notificationAnchorEl)}
//         onClose={() => setNotificationAnchorEl(null)}
//       >
//         <MenuItem>No new notifications</MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
 
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
  useMediaQuery,
  Tooltip,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { sidebarAPI } from "../services/api";

// React Icons
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io5";
import * as GoIcons from "react-icons/go";
import * as LuIcons from "react-icons/lu";
import * as LiaIcons from "react-icons/lia";
import * as FiIcons from "react-icons/fi";

const drawerWidth = 240;
const collapsedDrawerWidth = 70;

const Dashboard = () => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm")); // screens >= 600px

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false); // for mobile drawer
  const [sidebarItems, setSidebarItems] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const Icons = {
    ...AiIcons,
    ...MdIcons,
    ...IoIcons,
    ...GoIcons,
    ...LuIcons,
    ...LiaIcons,
    ...FiIcons,
  };

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : <DashboardIcon />;
  };

  // Fetch sidebar items
  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const res = await sidebarAPI.getSidebar();
        setSidebarItems(res.data || []);
      } catch (error) {
        console.error("Sidebar fetch error:", error);
      }
    };
    fetchSidebar();
  }, []);

  // Auto open submenu for active route
  useEffect(() => {
    const newOpenMenus = {};
    sidebarItems.forEach((item, index) => {
      if (item.submenu?.some((sub) => location.pathname.startsWith(sub.path))) {
        newOpenMenus[index] = true;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname, sidebarItems]);

  const handleToggleMenu = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDrawerToggle = () => {
    if (isSmUp) {
      setOpen(!open);
    } else {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawerContent = (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>S</Avatar>
        {open && isSmUp && <Typography sx={{ ml: 1, fontWeight: 600 }}>SNP Admin</Typography>}
      </Box>
      <Divider />
      <List>
        {sidebarItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <Tooltip title={!open ? item.label : ""} placement="right">
                <ListItemButton
                  onClick={() => {
                    if (item.submenu?.length > 0) {
                      handleToggleMenu(index);
                    } else {
                      navigate(item.path);
                      if (!isSmUp) setMobileOpen(false); // close mobile drawer on click
                    }
                  }}
                  sx={{
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 35 }}>{getIcon(item.icon)}</ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                  {item.submenu?.length > 0 && open && (openMenus[index] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {item.submenu?.length > 0 && (
              <Collapse in={openMenus[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subItem, subIndex) => (
                    <ListItem key={subIndex} disablePadding>
                      <Tooltip title={!open ? subItem.label : ""} placement="right">
                        <ListItemButton
                          onClick={() => {
                            navigate(subItem.path);
                            if (!isSmUp) setMobileOpen(false);
                          }}
                          sx={{ pl: 6, mx: 1, borderRadius: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 25 }}>{getIcon(subItem.icon)}</ListItemIcon>
                          <ListItemText primary={subItem.label} />
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ================= DRAWER ================= */}
      {isSmUp ? (
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : collapsedDrawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: open ? drawerWidth : collapsedDrawerWidth,
              transition: "0.3s",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* ================= MAIN ================= */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <Box
          sx={{
            height: 70,
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            flexShrink: 0,
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography sx={{ ml: 2, fontWeight: 600 }}>Dashboard</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <LogoutButton size="small" />
          </Box>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 3,
              minHeight: "100%",
              boxShadow: 1,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* NOTIFICATIONS */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={() => setNotificationAnchorEl(null)}
      >
        <MenuItem>No new notifications</MenuItem>
      </Menu>
    </Box>
  );
};

export default Dashboard;