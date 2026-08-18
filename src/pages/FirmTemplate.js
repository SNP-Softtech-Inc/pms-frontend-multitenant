

// import React, { useEffect, useState } from "react";
// import { NavLink, Outlet, useLocation } from "react-router-dom";
// import { LayoutTemplate } from "lucide-react";
// import { Button } from "../components/ui/button";

// const NAV_LINKS = [
//   { to: "/firmtemp/templates/tasks", label: "Tasks" },
//   { to: "/firmtemp/templates/emails", label: "Emails" },
//   {
//     to: "/firmtemp/templates/clientfacing",
//     label: "Client-facing job statuses",
//   },
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
//     <div className="min-h-screen bg-background text-foreground">
//       {/* HEADER */}
//       {/* z-20 */}
//       <header
//         className="
//        sticky top-0 z-20 
//           border-b border-border
//           bg-background/95
//           backdrop-blur
//           supports-[backdrop-filter]:bg-background/80
//         "
//       >
     
//         {/* Top Section */}
//         <div
//           className="
//             flex items-center gap-4
//             px-6 py-4
//             border-b border-border/60
//           "
//         >
//           {/* Icon */}
//           <div
//             className="
//               flex h-10 w-10 shrink-0 items-center justify-center
//               rounded-2xl
//               bg-primary
//               shadow-md
//             "
//           >
//             <LayoutTemplate className="h-5 w-5 text-primary-foreground" />
//           </div>

//           {/* Title */}
//           <div className="min-w-0 flex-1">
//             <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
//               Firm Templates
//             </h1>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Manage and configure your firm's template library
//             </p>
//           </div>
//         </div>

//         {/* NAVIGATION */}
//         <div className="px-6 py-4">
//           <div className="flex flex-wrap gap-2">
//             {NAV_LINKS.map(({ to, label }) => {
//               const isActive = location.pathname === to;

//               return (
//                 <Button
//                   key={to}
//                   asChild
//                   variant={isActive ? "default" : "ghost"}
//                   size="sm"
//                   className={`
//                     rounded-xl px-4 py-2 text-sm font-medium
//                     transition-all duration-200
//                     ${
//                       isActive
//                         ? `
//                           bg-primary
//                           text-primary-foreground
//                           shadow-sm
//                           hover:bg-primary/90
//                         `
//                         : `
//                           border border-border
//                           bg-background
//                           text-muted-foreground
//                           hover:bg-accent
//                           hover:text-accent-foreground
//                           hover:border-primary/20
//                         `
//                     }
//                   `}
//                 >
//                   <NavLink to={to}>{label}</NavLink>
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main
//         // className="
//         //   p-6
//         //   bg-background
//         // "
//       >
//         {/* <div
//           className="
//             rounded-2xl
//             border border-border
//             bg-card
//             text-card-foreground
//             shadow-sm
//             p-5
//           "
//         > */}
//           <Outlet />
//         {/* </div> */}
//       </main>
//     </div>
//   );
// };

// export default FirmTemplate;


import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutTemplate, FolderKanban } from "lucide-react";

const NAV_LINKS = [
  { to: "/firmtemp/templates/tasks", label: "Tasks" },
  { to: "/firmtemp/templates/emails", label: "Emails" },
  {
    to: "/firmtemp/templates/clientfacing",
    label: "Client-facing Status",
  },
  { to: "/firmtemp/templates/jobs", label: "Jobs" },
  { to: "/firmtemp/templates/chats", label: "Chats" },
  { to: "/firmtemp/templates/folders", label: "Folders" },
  { to: "/firmtemp/templates/invoices", label: "Invoices" },
  { to: "/firmtemp/templates/proposals", label: "Proposals & ELs" },
  { to: "/firmtemp/templates/organizers", label: "Organizers" },
];

const FirmTemplate = () => {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Top */}
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LayoutTemplate className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Firm Templates
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage reusable templates and standardize workflows across your
                firm.
              </p>
            </div>
          </div>

          {/* Optional actions */}
          <div className="flex items-center gap-3">
            {/* Example
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
            */}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t bg-background">
          <div className="px-8">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default FirmTemplate;