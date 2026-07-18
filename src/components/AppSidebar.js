import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { Button } from "./ui/button";

const menus = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    url: "/projects",
  },
  {
    icon: Users,
    title: "Clients",
    url: "/clients",
  },
  {
    icon: FileText,
    title: "Documents",
    url: "/documents",
  },
  {
    icon: Settings,
    title: "Settings",
    url: "/settings",
  },
];

export default function AppSidebar({
  collapsed,
  setCollapsed,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <aside
      className={`
fixed top-0 left-0 z-50 h-screen bg-background border-r
transition-all duration-300

${collapsed ? "w-20" : "w-72"}

${
  sidebarOpen
    ? "translate-x-0"
    : "-translate-x-full lg:translate-x-0"
}
`}
    >
      {/* Logo */}

      <div className="flex h-16 items-center justify-between border-b px-5">
        {!collapsed && (
          <h2 className="font-bold text-xl tracking-tight">My CRM</h2>
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </Button>
      </div>

      {/* Menu */}

      <nav className="space-y-2 p-3">
        {menus.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `
flex items-center rounded-xl px-4 py-3
transition-all

${
  isActive
    ? "bg-primary text-primary-foreground"
    : "hover:bg-muted"
}
`
            }
          >
            <item.icon size={20} />

            {!collapsed && (
              <span className="ml-3">{item.title}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}