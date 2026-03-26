import React from "react";
import { ButtonGroup, Button, Box } from "@mui/material";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const tabs = [
  { label: "Tasks", path: "/firmtemp/templates/tasks" },
  { label: "Emails", path: "/firmtemp/templates/emails" },
  { label: "Client-facing job statuses", path: "/firmtemp/templates/clientfacing" },
  { label: "Jobs", path: "/firmtemp/templates/jobs" },
  { label: "Chats", path: "/firmtemp/templates/chats" },
  { label: "Folders", path: "/firmtemp/templates/folders" },
  { label: "Invoices", path: "/firmtemp/templates/invoices" },
  { label: "Proposals & Els", path: "/firmtemp/templates/proposals" },
  { label: "Organizers", path: "/firmtemp/templates/organizers" },
];

const FirmTemplate = () => {
  const location = useLocation();

  return (
    <Box sx={{ p: 2 }}>
      {/* Button Group */}
      <ButtonGroup variant="outlined" sx={{ flexWrap: "wrap",gap:2 }}>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Button
              key={tab.path}
              component={NavLink}
              to={tab.path}
              variant={isActive ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
                m: 0.5,
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </ButtonGroup>

      {/* Page Content */}
      <Box sx={{ mt: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default FirmTemplate;