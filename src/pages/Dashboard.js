import React, { useState, useEffect } from "react";
import { useRef } from "react";
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
import cn from "classnames";
import FullLogo from "../Images/snp.png";
import Logo from "../Images/only s.png";
import {
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { sidebarAPI, leftSidebarAPI } from "../services/api";
import NewContactDrawer from "./Account-Contact/NewContactDrawer";
import AccountContactDrawer from "./Account-Contact/AccountContactDrawer";
// React Icons
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io5";
import * as GoIcons from "react-icons/go";
import * as LuIcons from "react-icons/lu";
import * as LiaIcons from "react-icons/lia";
import * as FiIcons from "react-icons/fi";
import * as RiIcons from "react-icons/ri";
import * as FaIcons from "react-icons/fa";
import CreateInvoiceDrawer from "./AccountDashboard/Invoices/CreateInvoiceDrawer";
import { authAPI } from "../services/api";
import NewChatDrawer from "./AccountDashboard/Communication/NewChatDrawer"; // adjust path
import JobDrawer from "./Workflow/JobDrawer";
import TasksDrawer from "./AccountTasks/TasksDrawer";
import { useAuth } from "../context/AuthContext";
import SearchComponent from "../components/SearchComponent";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";

const Dashboard = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState(null);

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const [plusAnchorEl, setPlusAnchorEl] = useState(null);
  const [plusMenuItems, setPlusMenuItems] = useState([]);
  const Icons = {
    ...AiIcons,
    ...MdIcons,
    ...IoIcons,
    ...GoIcons,
    ...LuIcons,
    ...LiaIcons,
    ...FiIcons,
    ...RiIcons,
    ...FaIcons,
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const [jobDrawerOpen, setJobDrawerOpen] = useState(false);
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);
  const [invoiceDrawer, setInvoiceDrawer] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false);
  const handleChatDrawerOpen = () => setChatDrawerOpen(true);
  const handleChatDrawerClose = () => setChatDrawerOpen(false);
  const handleDrawerOpen = () => setOpenDrawer(true);
  const handleDrawerClose = () => setOpenDrawer(false);
  const handleContactDrawerOpen = () => setContactDrawerOpen(true);
  const handleContactDrawerClose = () => setContactDrawerOpen(false);
  const handleJobDrawerOpen = () => setJobDrawerOpen(true);
  const handleTasksDrawerOpen = () => setTasksDrawerOpen(true);
  const handleTasksDrawerClose = () => setTasksDrawerOpen(false);
  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : <DashboardIcon />;
  };

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        if (user?.role === "team_member") {
          const res = await authAPI.getSingleUser(user.id);

          const userData = res.data;

          console.log("Fetched user data:", userData);

          // ✅ SET PERMISSIONS HERE
          setPermissions(userData.user.permissions);
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };

    fetchUserPermissions();
  }, [user]);
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        if (user?.role === "team_member") {
          const res = await authAPI.getSingleUser(user.id);

          const userData = res.data;
          console.log("Fetched user data for permissions:", userData);

          console.log("Team Member Permissions:", userData.user.permissions);
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };

    fetchUserPermissions();
  }, [user]);
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
    return submenu?.some((sub) => location.pathname.startsWith(sub.path));
  };
  const isSubActive = (path) => {
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const res = await sidebarAPI.getSidebar();
        let data = res.data || [];

        // ✅ If NOT team_member → show all
        if (user?.role !== "team_member") {
          setSidebarItems(data);
          return;
        }

        // ⛔ Wait until permissions loaded
        if (!permissions) return;

        // ✅ APPLY FILTERING
        const updatedSidebar = data
          .map((item) => {
            let newItem = { ...item };

            // =========================
            // ✅ ROLE BASED FILTER
            // =========================
            if (newItem.submenu?.length > 0) {
              newItem.submenu = newItem.submenu.filter((subItem) => {
                // Hide Teams & Plans
                if (subItem.label === "Teams & Plans") return false;

                // Hide Firm Settings inside Settings
                if (
                  newItem.label === "Settings" &&
                  subItem.label === "Firm Settings"
                )
                  return false;

                return true;
              });
            }

            // =========================
            // ✅ PERMISSION BASED FILTER
            // =========================
            if (newItem.submenu?.length > 0) {
              newItem.submenu = newItem.submenu.filter((sub) => {
                if (sub.label === "Tags" && !permissions.manageTags)
                  return false;
                if (sub.label === "Services" && !permissions.manageServices)
                  return false;
                if (
                  sub.label === "Pipeline Templates" &&
                  !permissions.managePipelines
                )
                  return false;
                if (
                  sub.label === "Firm Templates" &&
                  !permissions.manageTemplates
                )
                  return false;
                if (sub.label === "Contacts" && !permissions.viewAllContacts)
                  return false;
                if (
                  sub.label === "Proposal&Els" &&
                  !permissions.manageProposals
                )
                  return false;
                if (sub.label === "Invoices" && !permissions.viewallAccounts)
                  return false;
                if (sub.label === "Accounts" && !permissions.viewallAccounts)
                  return false;
                return true;
              });
            }

            // =========================
            // ✅ REMOVE PARENT ITEMS
            // =========================
            if (
              (newItem.label === "Tags" && permissions.manageTags) ||
              (newItem.label === "Services" && permissions.manageServices) ||
              (newItem.label === "Contacts" && permissions.viewAllContacts)
            ) {
              return null;
            }

            return newItem;
          })
          .filter(Boolean);

        setSidebarItems(updatedSidebar);
      } catch (error) {
        console.error("Sidebar fetch error:", error);
      }
    };

    fetchSidebar();
  }, [user, permissions]);
  useEffect(() => {
    const fetchPlusMenu = async () => {
      try {
        const res = await leftSidebarAPI.getLeftSidebar();
        let data = res.data || [];

        if (user?.role === "team_member" && permissions) {
          data = data.filter((item) => {
            if (item.label === "Account" && !permissions.manageAccounts)
              return false;
            if (item.label === "Contact" && !permissions.manageContacts)
              return false;
            if (item.label === "Jobs" && !permissions.managePipelines)
              return false;
            if (item.label === "Organizer" && !permissions.manageOrganizers)
              return false;
            if (item.label === "Invoice" && !permissions.manageInvoices)
              return false;

            return true;
          });
        }

        setPlusMenuItems(data);
      } catch (err) {
        console.error("Plus menu fetch error:", err);
      }
    };

    fetchPlusMenu();
  }, [user, permissions]);

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


  const handlePlusClose = () => {
    setPlusAnchorEl(null);
  };
 

  return (
  <>
    {/* ══════════════════════════════════════════════════════
        ROOT FLEX LAYOUT
    ══════════════════════════════════════════════════════ */}
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "var(--font-family)" }}>
      {/* ════════════════════════════════════════════════
          SIDEBAR PANEL
      ════════════════════════════════════════════════ */}
      <aside
        className={`flex flex-col border-r bg-background transition-all duration-300 
      ${open ? "w-[240px]" : "w-[70px]"} 
      ${!isSmUp && mobileOpen ? "fixed inset-y-0 left-0 z-50" : ""}`}
      >
        {/* ── Sidebar Header ───────────────────────── */}
        <div
          onClick={handleDrawerToggle}
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-border/40 cursor-pointer",
            open ? "px-4 justify-center" : "px-2 justify-center",
          )}
        >
          {open ? (
            <img
              src={FullLogo}
              alt="logo"
              className="h-10 w-auto object-contain"
            />
          ) : (
            <img
              src={Logo}
              alt="logo"
              className="h-8 w-auto object-contain"
            />
          )}
        </div>

        {/* ── Sidebar Menu ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
          {/* ───────── MAIN SECTION ───────── */}
          {open && (
            <p 
              className="px-2 font-semibold uppercase tracking-widest text-muted-foreground/50 select-none"
              style={{ fontSize: "calc(var(--text-caption) * parseFloat(var(--font-scale)) / 100)" }}
            >
              Main
            </p>
          )}

          {sidebarItems.slice(0, 4).map((item, index) => {
            const active = isActive(item.path, item.submenu);

            return (
              <div key={index}>
                {/* Main Item */}
                <button
                  onClick={() => {
                    if (item.submenu?.length) {
                      handleToggleMenu(index);
                    } else {
                      navigate(item.path);
                      if (!isSmUp) setMobileOpen(false);
                    }
                  }}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition
                  ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                  ${!open && "justify-center px-2"}
                `}
                style={{ fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" }}
                >
                  <span style={{ fontSize: "calc(var(--text-heading-sub) * parseFloat(var(--font-scale)) / 100)" }}>
                    {getIcon(item.icon)}
                  </span>

                  {open && (
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                  )}

                  {item.submenu?.length > 0 &&
                    open &&
                    (openMenus[index] ? (
                      <ExpandLess style={{ fontSize: "var(--text-body)" }} />
                    ) : (
                      <ExpandMore style={{ fontSize: "var(--text-body)" }} />
                    ))}
                </button>

                {/* Submenu */}
                {item.submenu?.length > 0 && openMenus[index] && (
                  <div className="ml-4 mt-1 border-l pl-3 space-y-1">
                    {item.submenu.map((sub, i) => {
                      const subActive = isSubActive(sub.path);

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            navigate(sub.path);
                            if (!isSmUp) setMobileOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition
                          ${
                            subActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                        `}
                        style={{ fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" }}
                        >
                          <span style={{ fontSize: "var(--text-body)" }}>{getIcon(sub.icon)}</span>
                          {open && <span>{sub.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* ───────── DIVIDER ───────── */}
          <div className="h-px bg-border/40 my-2" />

          {/* ───────── TOOLS SECTION ───────── */}
          {open && (
            <p 
              className="px-2 font-semibold uppercase tracking-widest text-muted-foreground/50 select-none"
              style={{ fontSize: "calc(var(--text-caption) * parseFloat(var(--font-scale)) / 100)" }}
            >
              Tools
            </p>
          )}

          {sidebarItems.slice(4).map((item, index) => {
            const realIndex = index + 4;
            const active = isActive(item.path, item.submenu);

            return (
              <div key={realIndex}>
                {/* Main Item */}
                <button
                  onClick={() => {
                    if (item.submenu?.length) {
                      handleToggleMenu(realIndex);
                    } else {
                      navigate(item.path);
                      if (!isSmUp) setMobileOpen(false);
                    }
                  }}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition
                  ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                  ${!open && "justify-center px-2"}
                `}
                style={{ fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" }}
                >
                  <span style={{ fontSize: "calc(var(--text-heading-sub) * parseFloat(var(--font-scale)) / 100)" }}>
                    {getIcon(item.icon)}
                  </span>

                  {open && (
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                  )}

                  {item.submenu?.length > 0 &&
                    open &&
                    (openMenus[realIndex] ? (
                      <ExpandLess style={{ fontSize: "var(--text-body)" }} />
                    ) : (
                      <ExpandMore style={{ fontSize: "var(--text-body)" }} />
                    ))}
                </button>

                {/* Submenu */}
                {item.submenu?.length > 0 && openMenus[realIndex] && (
                  <div className="ml-4 mt-1 border-l pl-3 space-y-1">
                    {item.submenu.map((sub, i) => {
                      const subActive = isSubActive(sub.path);

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            navigate(sub.path);
                            if (!isSmUp) setMobileOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition
                          ${
                            subActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                        `}
                        style={{ fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" }}
                        >
                          <span style={{ fontSize: "var(--text-body)" }}>{getIcon(sub.icon)}</span>
                          {open && <span>{sub.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ════════════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Header ─────────────────────────────── */}
        <header className="flex items-center justify-between border-b px-4 h-14 bg-background sticky top-0 z-20">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Menu Toggle */}
            {/* <button
              onClick={handleDrawerToggle}
              className="p-2 rounded-md hover:bg-muted"
              style={{ fontSize: "calc(var(--text-heading-sub) * parseFloat(var(--font-scale)) / 100)" }}
            >
              ☰
            </button> */}
            <button
  onClick={handleDrawerToggle}
  className="
    group
    flex items-center justify-center
    w-10 h-10
    rounded-xl
    border border-border
    bg-card
    text-foreground
    hover:bg-accent
    hover:text-primary
    hover:border-primary/40
    hover:shadow-md
    transition-all duration-200
    active:scale-95
    focus:outline-none
    focus:ring-2
    focus:ring-ring
  "
  style={{
    fontSize:
      "calc(var(--text-heading-sub, 1rem) * parseFloat(var(--font-scale)) / 100)",
    fontFamily: "var(--font-family)",
  }}
>
  <span className="group-hover:scale-110 transition-transform duration-200">
    ☰
  </span>
</button>

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white 
             hover:opacity-90 outline-none focus:outline-none border-0 ring-0 focus:ring-0"
                  style={{ fontSize: "calc(var(--text-heading-sub) * parseFloat(var(--font-scale)) / 100)" }}
                >
                  +
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-56 mt-2 rounded-xl overflow-hidden border shadow-lg animate-in fade-in zoom-in-95"
                style={{ fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" }}
              >
                {plusMenuItems.length > 0 ? (
                  plusMenuItems.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        if (item.label === "Account") handleDrawerOpen();
                        else if (item.label === "Contact") handleContactDrawerOpen();
                        else if (item.label === "Invoice") setInvoiceDrawer(true);
                        else if (item.label === "Chat") handleChatDrawerOpen();
                        else if (item.label === "Jobs") handleJobDrawerOpen();
                        else if (item.label === "Task") handleTasksDrawerOpen();
                        else navigate(item.path);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span style={{ fontSize: "var(--text-body)" }}>{getIcon(item.icon)}</span>
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No items found</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu> */}

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button
      className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground hover:opacity-90 outline-none focus:outline-none border-0 ring-0 focus:ring-0"
      style={{ 
        fontFamily: "var(--font-family)",
        fontSize: "calc(var(--text-heading-sub) * parseFloat(var(--font-scale)) / 100)",
        lineHeight: "1"
      }}
    >
      +
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="start"
    className="w-56 mt-2 rounded-xl overflow-hidden border bg-popover text-popover-foreground shadow-lg animate-in fade-in zoom-in-95"
    style={{ 
      fontFamily: "var(--font-family)",
      fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" 
    }}
  >
    {plusMenuItems.length > 0 ? (
      plusMenuItems.map((item, index) => (
        <DropdownMenuItem
          key={index}
          onClick={() => {
            if (item.label === "Account") handleDrawerOpen();
            else if (item.label === "Contact") handleContactDrawerOpen();
            else if (item.label === "Invoice") setInvoiceDrawer(true);
            else if (item.label === "Chat") handleChatDrawerOpen();
            else if (item.label === "Jobs") handleJobDrawerOpen();
            else if (item.label === "Task") handleTasksDrawerOpen();
            else navigate(item.path);
          }}
          className="flex items-center gap-2 cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground"
        >
          {/* Synchronized icon sizing wrapped in a styled container */}
          <span 
            className="flex items-center justify-center m-0 p-0 text-muted-foreground"
            style={{ 
              width: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)", 
              height: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" 
            }}
          >
            {getIcon(item.icon)}
          </span>
          
          <span style={{ lineHeight: "1.2" }}>{item.label}</span>
        </DropdownMenuItem>
      ))
    ) : (
      <DropdownMenuItem disabled className="text-muted-foreground">
        No items found
      </DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
            {/* Search */}
            <div className="w-[300px]">
              <SearchComponent />
            </div>
          </div>

          {/* Right Section */}
          <LogoutButton />
        </header>

        {/* ── Page Content ───────────────────────── */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <div className="bg-background border rounded-xl p-4 min-h-full shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ════════════════════════════════════════════════
          PLUS MENU (ShadCN style)
      ════════════════════════════════════════════════ */}
      {plusAnchorEl && (
        <div 
          className="fixed top-14 left-[260px] z-50 w-56 rounded-xl border shadow-lg animate-in fade-in zoom-in-95"
          style={{ fontSize: "calc(var(--text-body) * parseFloat(var(--font-scale)) / 100)" }}
        >
          <div className="p-1">
            {plusMenuItems.length > 0 ? (
              plusMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.label === "Account") handleDrawerOpen();
                    else if (item.label === "Contact") handleContactDrawerOpen();
                    else if (item.label === "Invoice") setInvoiceDrawer(true);
                    else if (item.label === "Chat") handleChatDrawerOpen();
                    else if (item.label === "Jobs") handleJobDrawerOpen();
                    else if (item.label === "Task") handleTasksDrawerOpen();
                    else navigate(item.path);

                    handlePlusClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <span style={{ fontSize: "var(--text-body)" }}>{getIcon(item.icon)}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-gray-400">No items found</div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          DRAWERS (UNCHANGED)
      ════════════════════════════════════════════════ */}
      <AccountContactDrawer open={openDrawer} onClose={handleDrawerClose} />
      <NewContactDrawer open={contactDrawerOpen} onClose={handleContactDrawerClose} />
      <CreateInvoiceDrawer open={invoiceDrawer} onClose={() => setInvoiceDrawer(false)} />
      <NewChatDrawer open={chatDrawerOpen} handleClose={handleChatDrawerClose} accountwiseChatlist={() => {}} data={null} isActiveTrue={true} />
      <JobDrawer open={jobDrawerOpen} onClose={() => setJobDrawerOpen(false)} />
      <TasksDrawer open={tasksDrawerOpen} onClose={() => setTasksDrawerOpen(false)} />
    </div>
  </>
);
//   return (
//     <>
//       {/* ══════════════════════════════════════════════════════
//         ROOT FLEX LAYOUT
//     ══════════════════════════════════════════════════════ */}
//       <div className="flex h-screen bg-background overflow-hidden">
//         {/* ════════════════════════════════════════════════
//           SIDEBAR PANEL
//       ════════════════════════════════════════════════ */}
//         <aside
//           className={`flex flex-col border-r bg-background transition-all duration-300 
//         ${open ? "w-[240px]" : "w-[70px]"} 
//         ${!isSmUp && mobileOpen ? "fixed inset-y-0 left-0 z-50" : ""}`}
//         >
//           {/* ── Sidebar Header ───────────────────────── */}
//           <div
//             onClick={handleDrawerToggle}
//             className={cn(
//               "flex h-16 shrink-0 items-center border-b border-border/40 cursor-pointer",
//               open ? "px-4 justify-center" : "px-2 justify-center",
//             )}
//           >
//             {open ? (
//               <img
//                 src={FullLogo}
//                 alt="logo"
//                 className="h-10 w-auto object-contain"
//               />
//             ) : (
//               <img
//                 src={Logo}
//                 alt="logo"
//                 className="h-8 w-auto object-contain"
//               />
//             )}
//           </div>

//           {/* ── Sidebar Menu ─────────────────────────── */}
//           <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
//             {/* ───────── MAIN SECTION ───────── */}
//             {open && (
//               <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
//                 Main
//               </p>
//             )}

//             {sidebarItems.slice(0, 4).map((item, index) => {
//               // 👈 adjust count
//               const active = isActive(item.path, item.submenu);

//               return (
//                 <div key={index}>
//                   {/* Main Item */}
//                   <button
//                     onClick={() => {
//                       if (item.submenu?.length) {
//                         handleToggleMenu(index);
//                       } else {
//                         navigate(item.path);
//                         if (!isSmUp) setMobileOpen(false);
//                       }
//                     }}
//                     className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition
//             ${
//               active
//                 ? "bg-primary/10 text-primary font-semibold"
//                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
//             }
//             ${!open && "justify-center px-2"}
//           `}
//                   >
//                     <span className="text-lg">{getIcon(item.icon)}</span>

//                     {open && (
//                       <span className="flex-1 text-left truncate">
//                         {item.label}
//                       </span>
//                     )}

//                     {item.submenu?.length > 0 &&
//                       open &&
//                       (openMenus[index] ? (
//                         <ExpandLess fontSize="small" />
//                       ) : (
//                         <ExpandMore fontSize="small" />
//                       ))}
//                   </button>

//                   {/* Submenu */}
//                   {item.submenu?.length > 0 && openMenus[index] && (
//                     <div className="ml-4 mt-1 border-l pl-3 space-y-1">
//                       {item.submenu.map((sub, i) => {
//                         const subActive = isSubActive(sub.path);

//                         return (
//                           <button
//                             key={i}
//                             onClick={() => {
//                               navigate(sub.path);
//                               if (!isSmUp) setMobileOpen(false);
//                             }}
//                             className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition
//                     ${
//                       subActive
//                         ? "bg-primary/10 text-primary font-medium"
//                         : "text-muted-foreground hover:bg-muted hover:text-foreground"
//                     }
//                   `}
//                           >
//                             <span>{getIcon(sub.icon)}</span>
//                             {open && <span>{sub.label}</span>}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}

//             {/* ───────── DIVIDER ───────── */}
//             <div className="h-px bg-border/40 my-2" />

//             {/* ───────── TOOLS SECTION ───────── */}
//             {open && (
//               <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
//                 Tools
//               </p>
//             )}

//             {sidebarItems.slice(4).map((item, index) => {
//               // 👈 remaining items
//               const realIndex = index + 4; // important for submenu state
//               const active = isActive(item.path, item.submenu);

//               return (
//                 <div key={realIndex}>
//                   {/* Main Item */}
//                   <button
//                     onClick={() => {
//                       if (item.submenu?.length) {
//                         handleToggleMenu(realIndex);
//                       } else {
//                         navigate(item.path);
//                         if (!isSmUp) setMobileOpen(false);
//                       }
//                     }}
//                     className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition
//             ${
//               active
//                 ? "bg-primary/10 text-primary font-semibold"
//                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
//             }
//             ${!open && "justify-center px-2"}
//           `}
//                   >
//                     <span className="text-lg">{getIcon(item.icon)}</span>

//                     {open && (
//                       <span className="flex-1 text-left truncate">
//                         {item.label}
//                       </span>
//                     )}

//                     {item.submenu?.length > 0 &&
//                       open &&
//                       (openMenus[realIndex] ? (
//                         <ExpandLess fontSize="small" />
//                       ) : (
//                         <ExpandMore fontSize="small" />
//                       ))}
//                   </button>

//                   {/* Submenu */}
//                   {item.submenu?.length > 0 && openMenus[realIndex] && (
//                     <div className="ml-4 mt-1 border-l pl-3 space-y-1">
//                       {item.submenu.map((sub, i) => {
//                         const subActive = isSubActive(sub.path);

//                         return (
//                           <button
//                             key={i}
//                             onClick={() => {
//                               navigate(sub.path);
//                               if (!isSmUp) setMobileOpen(false);
//                             }}
//                             className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition
//                     ${
//                       subActive
//                         ? "bg-primary/10 text-primary font-medium"
//                         : "text-muted-foreground hover:bg-muted hover:text-foreground"
//                     }
//                   `}
//                           >
//                             <span>{getIcon(sub.icon)}</span>
//                             {open && <span>{sub.label}</span>}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </aside>

//         {/* ════════════════════════════════════════════════
//           MAIN CONTENT AREA
//       ════════════════════════════════════════════════ */}
//         <div className="flex flex-1 flex-col overflow-hidden">
//           {/* ── Header ─────────────────────────────── */}
//           <header className="flex items-center justify-between border-b px-4 h-14 bg-background sticky top-0 z-20">
//             {/* Left Section */}
//             <div className="flex items-center gap-3">
//               {/* Menu Toggle */}
//               <button
//                 onClick={handleDrawerToggle}
//                 className="p-2 rounded-md hover:bg-muted"
//               >
//                 ☰
//               </button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button
//                     className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white 
//              hover:opacity-90 outline-none focus:outline-none border-0 ring-0 focus:ring-0"
//                   >
//                     +
//                   </button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent
//                   align="start"
//                   className="w-56 mt-2 rounded-xl overflow-hidden border  shadow-lg animate-in fade-in zoom-in-95"
//                 >
//                   {plusMenuItems.length > 0 ? (
//                     plusMenuItems.map((item, index) => (
//                       <DropdownMenuItem
//                         key={index}
//                         onClick={() => {
//                           if (item.label === "Account") handleDrawerOpen();
//                           else if (item.label === "Contact")
//                             handleContactDrawerOpen();
//                           else if (item.label === "Invoice")
//                             setInvoiceDrawer(true);
//                           else if (item.label === "Chat")
//                             handleChatDrawerOpen();
//                           else if (item.label === "Jobs") handleJobDrawerOpen();
//                           else if (item.label === "Task")
//                             handleTasksDrawerOpen();
//                           else navigate(item.path);
//                         }}
//                         className="flex items-center gap-2 cursor-pointer"
//                       >
//                         <span className="text-base">{getIcon(item.icon)}</span>
//                         <span>{item.label}</span>
//                       </DropdownMenuItem>
//                     ))
//                   ) : (
//                     <DropdownMenuItem disabled>No items found</DropdownMenuItem>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {/* Search */}
//               <div className="w-[300px]">
//                 <SearchComponent />
//               </div>
//             </div>

//             {/* Right Section */}
//             <LogoutButton />
//           </header>

//           {/* ── Page Content ───────────────────────── */}
//           {/* <main className="flex-1 overflow-y-auto p-4">
//             <div className="bg-background border rounded-xl p-4 min-h-full shadow-sm">
//               <Outlet />
//             </div>
//           </main> */}
//           <main className="flex-1 overflow-y-auto scrollbar-hide p-4">
//   <div className="bg-background border rounded-xl p-4 min-h-full shadow-sm">
//     <Outlet />
//   </div>
// </main>
//         </div>

//         {/* ════════════════════════════════════════════════
//           PLUS MENU (ShadCN style)
//       ════════════════════════════════════════════════ */}
//         {plusAnchorEl && (
//           <div className="fixed top-14 left-[260px] z-50 w-56 rounded-xl border  shadow-lg animate-in fade-in zoom-in-95">
//             <div className="p-1">
//               {plusMenuItems.length > 0 ? (
//                 plusMenuItems.map((item, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       if (item.label === "Account") handleDrawerOpen();
//                       else if (item.label === "Contact")
//                         handleContactDrawerOpen();
//                       else if (item.label === "Invoice") setInvoiceDrawer(true);
//                       else if (item.label === "Chat") handleChatDrawerOpen();
//                       else if (item.label === "Jobs") handleJobDrawerOpen();
//                       else if (item.label === "Task") handleTasksDrawerOpen();
//                       else navigate(item.path);

//                       handlePlusClose();
//                     }}
//                     className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
//                   >
//                     <span className="text-base">{getIcon(item.icon)}</span>
//                     <span className="flex-1 text-left">{item.label}</span>
//                   </button>
//                 ))
//               ) : (
//                 <div className="p-3 text-sm text-gray-400">No items found</div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ════════════════════════════════════════════════
//           DRAWERS (UNCHANGED)
//       ════════════════════════════════════════════════ */}
//         <AccountContactDrawer open={openDrawer} onClose={handleDrawerClose} />

//         <NewContactDrawer
//           open={contactDrawerOpen}
//           onClose={handleContactDrawerClose}
//         />

//         <CreateInvoiceDrawer
//           open={invoiceDrawer}
//           onClose={() => setInvoiceDrawer(false)}
//         />

//         <NewChatDrawer
//           open={chatDrawerOpen}
//           handleClose={handleChatDrawerClose}
//           accountwiseChatlist={() => {}}
//           data={null}
//           isActiveTrue={true}
//         />

//         <JobDrawer
//           open={jobDrawerOpen}
//           onClose={() => setJobDrawerOpen(false)}
//         />

//         <TasksDrawer
//           open={tasksDrawerOpen}
//           onClose={() => setTasksDrawerOpen(false)}
//         />
//       </div>
//     </>
//   );
};

export default Dashboard;
