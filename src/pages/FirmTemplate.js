// import React from "react";
// import { ButtonGroup, Button, Box } from "@mui/material";
// import { NavLink, Outlet, useLocation } from "react-router-dom";

// const tabs = [
//   { label: "Tasks", path: "/firmtemp/templates/tasks" },
//   { label: "Emails", path: "/firmtemp/templates/emails" },
//   { label: "Client-facing job statuses", path: "/firmtemp/templates/clientfacing" },
//   { label: "Jobs", path: "/firmtemp/templates/jobs" },
//   { label: "Chats", path: "/firmtemp/templates/chats" },
//   { label: "Folders", path: "/firmtemp/templates/folders" },
//   { label: "Invoices", path: "/firmtemp/templates/invoices" },
//   { label: "Proposals & Els", path: "/firmtemp/templates/proposals" },
//   { label: "Organizers", path: "/firmtemp/templates/organizers" },
// ];

// const FirmTemplate = () => {
//   const location = useLocation();

//   return (
//     <Box sx={{ p: 2 }}>
//       {/* Button Group */}
//       <ButtonGroup variant="outlined" sx={{ flexWrap: "wrap",gap:2 }}>
//         {tabs.map((tab) => {
//           const isActive = location.pathname === tab.path;

//           return (
//             <Button
//               key={tab.path}
//               component={NavLink}
//               to={tab.path}
//               variant={isActive ? "contained" : "outlined"}
//               sx={{
//                 textTransform: "none",
//                 m: 0.5,
//               }}
//             >
//               {tab.label}
//             </Button>
//           );
//         })}
//       </ButtonGroup>

//       {/* Page Content */}
//       <Box sx={{ mt: 3 }}>
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default FirmTemplate;


import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import { Button } from "../components/ui/button";

const NAV_LINKS = [
  { to: "/firmtemp/templates/tasks", label: "Tasks" },
  { to: "/firmtemp/templates/emails", label: "Emails" },
  { to: "/firmtemp/templates/clientfacing", label: "Client-facing job statuses" },
  { to: "/firmtemp/templates/jobs", label: "Jobs" },
  { to: "/firmtemp/templates/chats", label: "Chats" },
  { to: "/firmtemp/templates/folders", label: "Folders" },
  { to: "/firmtemp/templates/invoices", label: "Invoices" },
  { to: "/firmtemp/templates/proposals", label: "Proposals & Els" },
  { to: "/firmtemp/templates/organizers", label: "Organizers" },
];

const FirmTemplate = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background border-b border-border/40">
        <div className="flex items-center gap-3 px-6 h-14 border-b border-border/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shrink-0">
            <LayoutTemplate className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground leading-none">
              Firm Templates
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 leading-none">
              Manage and configure your firm's template library
            </p>
          </div>
        </div>

        {/* Button Group Style Navigation */}
        <div className="px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              
              return (
                <Button
                  key={to}
                  asChild
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="text-sm font-normal"
                >
                  <NavLink to={to}>{label}</NavLink>
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default FirmTemplate;