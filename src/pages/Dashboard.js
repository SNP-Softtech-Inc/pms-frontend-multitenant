
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Drawer,
//    List,
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
//   Collapse,
//   useMediaQuery,
//   Tooltip,
// } from "@mui/material";

// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   ExpandLess,
//   ExpandMore,
// } from "@mui/icons-material";

// import { useTheme } from "@mui/material/styles";
// import { useNavigate, Outlet, useLocation } from "react-router-dom";
// import LogoutButton from "../components/LogoutButton";
// import { sidebarAPI } from "../services/api";

// // React Icons
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
//   const theme = useTheme();
//   const isSmUp = useMediaQuery(theme.breakpoints.up("sm")); // screens >= 600px

//   const navigate = useNavigate();
//   const location = useLocation();

//   const [open, setOpen] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false); // for mobile drawer
//   const [sidebarItems, setSidebarItems] = useState([]);
//   const [openMenus, setOpenMenus] = useState({});
//   const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

//   const Icons = {
//     ...AiIcons,
//     ...MdIcons,
//     ...IoIcons,
//     ...GoIcons,
//     ...LuIcons,
//     ...LiaIcons,
//     ...FiIcons,
//   };

//   const getIcon = (iconName) => {
//     const IconComponent = Icons[iconName];
//     return IconComponent ? <IconComponent size={20} /> : <DashboardIcon />;
//   };

//   // Fetch sidebar items
//   useEffect(() => {
//     const fetchSidebar = async () => {
//       try {
//         const res = await sidebarAPI.getSidebar();
//         setSidebarItems(res.data || []);
//         console.log("sidebar menu items",res.data)
//       } catch (error) {
//         console.error("Sidebar fetch error:", error);
//       }
//     };
//     fetchSidebar();
//   }, []);

//   // Auto open submenu for active route
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
//     if (isSmUp) {
//       setOpen(!open);
//     } else {
//       setMobileOpen(!mobileOpen);
//     }
//   };

//   const drawerContent = (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
//         <Avatar sx={{ bgcolor: "primary.main" }}>S</Avatar>
//         {open && isSmUp && <Typography sx={{ ml: 1, fontWeight: 600 }}>SNP Admin</Typography>}
//       </Box>
//       <Divider />
//       <List>
//         {sidebarItems.map((item, index) => (
//           <React.Fragment key={index}>
//             <ListItem disablePadding>
//               <Tooltip title={!open ? item.label : ""} placement="right">
//                 <ListItemButton
//                   onClick={() => {
//                     if (item.submenu?.length > 0) {
//                       handleToggleMenu(index);
//                     } else {
//                       navigate(item.path);
//                       if (!isSmUp) setMobileOpen(false); // close mobile drawer on click
//                     }
//                   }}
//                   sx={{
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                     mx: 1,
//                     borderRadius: 2,
//                     mb: 0.5,
//                   }}
//                 >
//                   <ListItemIcon sx={{ minWidth: 35 }}>{getIcon(item.icon)}</ListItemIcon>
//                   <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
//                   {item.submenu?.length > 0 && open && (openMenus[index] ? <ExpandLess /> : <ExpandMore />)}
//                 </ListItemButton>
//               </Tooltip>
//             </ListItem>

//             {item.submenu?.length > 0 && (
//               <Collapse in={openMenus[index]} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                   {item.submenu.map((subItem, subIndex) => (
//                     <ListItem key={subIndex} disablePadding>
//                       <Tooltip title={!open ? subItem.label : ""} placement="right">
//                         <ListItemButton
//                           onClick={() => {
//                             navigate(subItem.path);
//                             if (!isSmUp) setMobileOpen(false);
//                           }}
//                           sx={{ pl: 6, mx: 1, borderRadius: 2 }}
//                         >
//                           <ListItemIcon sx={{ minWidth: 25 }}>{getIcon(subItem.icon)}</ListItemIcon>
//                           <ListItemText primary={subItem.label} />
//                         </ListItemButton>
//                       </Tooltip>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Collapse>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       {/* ================= DRAWER ================= */}
//       {isSmUp ? (
//         <Drawer
//           variant="permanent"
//           sx={{
//             width: open ? drawerWidth : collapsedDrawerWidth,
//             [`& .MuiDrawer-paper`]: {
//               width: open ? drawerWidth : collapsedDrawerWidth,
//               transition: "0.3s",
//               overflowX: "hidden",
//             },
//           }}
//         >
//           {drawerContent}
//         </Drawer>
//       ) : (
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={() => setMobileOpen(false)}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             [`& .MuiDrawer-paper`]: { width: drawerWidth },
//           }}
//         >
//           {drawerContent}
//         </Drawer>
//       )}

//       {/* ================= MAIN ================= */}
//       <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
//         {/* HEADER */}
//         <Box
//           sx={{
//             height: 70,
//             px: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderBottom: 1,
//             borderColor: "divider",
//             bgcolor: "background.paper",
//             flexShrink: 0,
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
//             flexGrow: 1,
//             overflowY: "auto",
//             p: 3,
//             bgcolor: "background.default",
//           }}
//         >
//           <Box
//             sx={{
//               bgcolor: "background.paper",
//               p: 3,
//               borderRadius: 3,
//               minHeight: "100%",
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
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // ✅ ACTIVE CHECK (main + submenu)
 
const isActive = (path, submenu = []) => {
  // ✅ exact match
  if (location.pathname === path) return true;

  // ✅ handle nested routes like /firmtemp/templates/*
  if (
    path.includes("/firmtemp/templates") &&
    location.pathname.startsWith("/firmtemp/templates")
  ) {
    return true;
  }

  // ✅ fallback for submenu
  return submenu?.some((sub) =>
    location.pathname.startsWith(sub.path)
  );
};
  const isSubActive = (path) => {
    return location.pathname.startsWith(path);
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

  // Auto open submenu
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

  // const handleDrawerToggle = () => {
  //   if (isSmUp) {
  //     setOpen(!open);
  //   } else {
  //     setMobileOpen(!mobileOpen);
  //   }
  // };
const handleDrawerToggle = () => {
  if (isSmUp) {
    setOpen((prev) => {
      const newState = !prev;

      // ✅ if collapsing → close all menus
      if (!newState) {
        setOpenMenus({});
      }

      return newState;
    });
  } else {
    setMobileOpen(!mobileOpen);
  }
};
  const drawerContent = (
    <Box>
      {/* HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>S</Avatar>
        {open && isSmUp && (
          <Typography sx={{ ml: 1, fontWeight: 600 }}>
            SNP Admin
          </Typography>
        )}
      </Box>

      <Divider />

      {/* MENU */}
      <List>
        {sidebarItems.map((item, index) => {
          const active = isActive(item.path, item.submenu);

          return (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <Tooltip title={!open ? item.label : ""} placement="right">
                  <ListItemButton
                    onClick={() => {
                      if (item.submenu?.length > 0) {
                        handleToggleMenu(index);
                      } else {
                        navigate(item.path);
                        if (!isSmUp) setMobileOpen(false);
                      }
                    }}
                    sx={{
                      position: "relative",
                      justifyContent: open ? "initial" : "center",
                      px: 2,
                      mx: 1,
                      borderRadius: 2,
                      mb: 0.5,
                      transition: "all 0.2s ease",

                      bgcolor: active
                        ? "rgba(25,118,210,0.08)"
                        : "transparent",

                      color: active ? "primary.main" : "text.primary",

                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.04)",
                      },

                      // LEFT BORDER
                      "&::before": active
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 6,
                            bottom: 6,
                            width: "4px",
                            borderRadius: "0 4px 4px 0",
                            bgcolor: "primary.main",
                          }
                        : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 35,
                        color: active
                          ? "primary.main"
                          : "text.secondary",
                      }}
                    >
                      {getIcon(item.icon)}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      sx={{
                        opacity: open ? 1 : 0,
                        "& .MuiTypography-root": {
                          fontSize: "0.9rem",
                          fontWeight: active ? 600 : 500,
                        },
                      }}
                    />

                    {item.submenu?.length > 0 && open &&
                      (openMenus[index] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      ))}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {/* SUBMENU */}
              {item.submenu?.length > 0 && (
                <Collapse in={openMenus[index]} timeout={300} unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem, subIndex) => {
                      const subActive = isSubActive(subItem.path);

                      return (
                        <ListItem key={subIndex} disablePadding>
                          <Tooltip
                            title={!open ? subItem.label : ""}
                            placement="right"
                          >
                            <ListItemButton
                              onClick={() => {
                                navigate(subItem.path);
                                if (!isSmUp) setMobileOpen(false);
                              }}
                              sx={{
                                pl: open ? 5 : 2,
                                mx: 1,
                                borderRadius: 2,
                                mb: 0.3,
                                transition: "all 0.2s ease",

                                bgcolor: subActive
                                  ? "rgba(25,118,210,0.12)"
                                  : "transparent",

                                color: subActive
                                  ? "primary.main"
                                  : "text.secondary",

                                "&:hover": {
                                  bgcolor: "rgba(0,0,0,0.04)",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 25,
                                  color: subActive
                                    ? "primary.main"
                                    : "text.secondary",
                                }}
                              >
                                {getIcon(subItem.icon)}
                              </ListItemIcon>

                              <ListItemText
                                primary={subItem.label}
                                sx={{
                                  "& .MuiTypography-root": {
                                    fontSize: "0.85rem",
                                    fontWeight: subActive ? 600 : 400,
                                  },
                                }}
                              />
                            </ListItemButton>
                          </Tooltip>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* DRAWER */}
      {isSmUp ? (
        <Drawer
          variant="permanent"
          // sx={{
          //   width: open ? drawerWidth : collapsedDrawerWidth,
          //   [`& .MuiDrawer-paper`]: {
          //     width: open ? drawerWidth : collapsedDrawerWidth,
          //     transition: "all 0.3s ease",
          //     overflowX: "hidden",
          //     borderRight: "1px solid rgba(0,0,0,0.08)",
          //     background: "#fff",
          //   },
          // }}
          sx={{
  width: open ? drawerWidth : collapsedDrawerWidth,
  [`& .MuiDrawer-paper`]: {
    width: open ? drawerWidth : collapsedDrawerWidth,
    transition: "all 0.3s ease",

    // ✅ FIX START
    overflowX: "hidden",
    overflowY: "auto",

    // hide scrollbar (all browsers)
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge

    "&::-webkit-scrollbar": {
      display: "none", // Chrome/Safari
    },
    // ✅ FIX END

    borderRight: "1px solid rgba(0,0,0,0.08)",
    background: "#fff",
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

      {/* MAIN */}
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
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography sx={{ ml: 2, fontWeight: 600 }}>
              Dashboard
            </Typography>
          </Box>

          <LogoutButton size="small" />
        </Box>

        {/* CONTENT */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
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