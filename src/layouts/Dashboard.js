import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen bg-muted/30">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content */}
      <div
        className={`flex h-screen flex-col transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <AppHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}