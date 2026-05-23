


// import React from "react";
// import { NavLink, Outlet, useLocation } from "react-router-dom";
// import { LayoutTemplate } from "lucide-react";
// import { Button } from "../components/ui/button";

// const NAV_LINKS = [
//   { to: "/firmtemp/templates/tasks", label: "Tasks" },
//   { to: "/firmtemp/templates/emails", label: "Emails" },
//   { to: "/firmtemp/templates/clientfacing", label: "Client-facing job statuses" },
//   { to: "/firmtemp/templates/jobs", label: "Jobs" },
//   { to: "/firmtemp/templates/chats", label: "Chats" },
//   { to: "/firmtemp/templates/folders", label: "Folders" },
//   { to: "/firmtemp/templates/invoices", label: "Invoices" },
//   { to: "/firmtemp/templates/proposals", label: "Proposals & Els" },
//   { to: "/firmtemp/templates/organizers", label: "Organizers" },
// ];

// const FirmTemplate = () => {
//   const location = useLocation();

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="sticky top-0 z-20 bg-background border-b border-border/40">
//         <div className="flex items-center gap-3 px-6 h-14 border-b border-border/40">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shrink-0">
//             <LayoutTemplate className="h-4 w-4 text-primary-foreground" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h1 className="text-base font-semibold text-foreground leading-none">
//               Firm Templates
//             </h1>
//             <p className="text-xs text-muted-foreground mt-0.5 leading-none">
//               Manage and configure your firm's template library
//             </p>
//           </div>
//         </div>

//         {/* Button Group Style Navigation */}
//         <div className="px-6 py-3">
//           <div className="flex flex-wrap gap-2">
//             {NAV_LINKS.map(({ to, label }) => {
//               const isActive = location.pathname === to;
              
//               return (
//                 <Button
//                   key={to}
//                   asChild
//                   variant={isActive ? "default" : "outline"}
//                   size="sm"
//                   className="text-sm font-normal"
//                 >
//                   <NavLink to={to}>{label}</NavLink>
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//       </header>

//       <main className="p-6">
//         <Outlet />
//       </main>
//     </div>
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
  {
    to: "/firmtemp/templates/clientfacing",
    label: "Client-facing job statuses",
  },
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
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header
        className="
          sticky top-0 z-20
          border-b border-border
          bg-background/95
          backdrop-blur supports-[backdrop-filter]:bg-background/80
        "
      >
        {/* Top Section */}
        <div
          className="
            flex items-center gap-4
            px-6 py-4
            border-b border-border/60
          "
        >
          {/* Icon */}
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-2xl
              bg-primary
              shadow-md
            "
          >
            <LayoutTemplate className="h-5 w-5 text-primary-foreground" />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              Firm Templates
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and configure your firm's template library
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;

              return (
                <Button
                  key={to}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`
                    rounded-xl px-4 py-2 text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? `
                          bg-primary
                          text-primary-foreground
                          shadow-sm
                          hover:bg-primary/90
                        `
                        : `
                          border border-border
                          bg-background
                          text-muted-foreground
                          hover:bg-accent
                          hover:text-accent-foreground
                          hover:border-primary/20
                        `
                    }
                  `}
                >
                  <NavLink to={to}>{label}</NavLink>
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className="
          p-6
          bg-background
        "
      >
        <div
          className="
            rounded-2xl
            border border-border
            bg-card
            text-card-foreground
            shadow-sm
            p-5
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FirmTemplate;