
// import React, { useState } from "react";
// import {
//   Tabs,
//   Tab,
//   Box,
//   Button,
//   Stack
// } from "@mui/material";

// import ActiveMember from "./ActiveTeammembers";
// import Deactivatemember from "./Deactivatemember";
// import AddEditTeamMemberDrawer from "./AddEditTeamMemberDrawer";
// import CreateGroupDrawer from "./CreateGroupDrawer";
// import ActiveGroups from "./ActiveGroups";

// const TeamMember = () => {
//   const [tab, setTab] = useState(0); // 0: Active, 1: Deactive, 2: Groups
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [refresh, setRefresh] = useState(false);

//   const handleChange = (event, newValue) => {
//     setTab(newValue);
//   };

//   return (
//     <div>
//       {/* Tabs + Actions */}
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//       >
//         <Tabs value={tab} onChange={handleChange}>
//           <Tab label="Active Members" />
//           <Tab label="Deactive Members" />
//           <Tab label="Groups" />
//         </Tabs>

//         <Stack direction="row" spacing={1}>
//           {tab !== 2 && (
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setEditData(null);
//                 setDrawerOpen(true);
//               }}
//             >
//               + Add Member
//             </Button>
//           )}

//           {tab === 2 && (
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => setGroupDrawerOpen(true)}
//             >
//               + Create Group
//             </Button>
//           )}
//         </Stack>
//       </Stack>

//       {/* Content */}
//       <Box mt={2}>
//         {tab === 2 ? (
//           <ActiveGroups
//             refresh={refresh}
//             onEdit={(data) => {
//               console.log("Edit group:", data);
//             }}
//           />
//         ) : tab === 0 ? (
//           <ActiveMember
//             refresh={refresh}
//             onEdit={(data) => {
//               setEditData(data);
//               setDrawerOpen(true);
//             }}
//           />
//         ) : (
//           <Deactivatemember
//             refresh={refresh}
//             onEdit={(data) => {
//               setEditData(data);
//               setDrawerOpen(true);
//             }}
//           />
//         )}
//       </Box>

//       {/* Drawers */}
//       <AddEditTeamMemberDrawer
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         editData={editData}
//         onSuccess={() => setRefresh((prev) => !prev)}
//       />

//       <CreateGroupDrawer
//         open={groupDrawerOpen}
//         onClose={() => setGroupDrawerOpen(false)}
//         onSuccess={() => setRefresh((prev) => !prev)}
//       />
//     </div>
//   );
// };

// export default TeamMember;



import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { MoreHorizontal, Edit, Trash, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import ActiveMember from "./ActiveTeammembers";
import Deactivatemember from "./Deactivatemember";
import AddEditTeamMemberDrawer from "./AddEditTeamMemberDrawer";
import CreateGroupDrawer from "./CreateGroupDrawer";
import ActiveGroups from "./ActiveGroups";

const TeamMember = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const getActionButton = () => {
    if (activeTab !== "groups") {
      return (
        <Button
          onClick={() => {
            setEditData(null);
            setDrawerOpen(true);
          }}
        >
          + Add Member
        </Button>
      );
    }

    if (activeTab === "groups") {
      return (
        <Button
         
          onClick={() => setGroupDrawerOpen(true)}
        >
          + Create Group
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">Active Members</TabsTrigger>
              <TabsTrigger value="deactive">Deactive Members</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              {getActionButton()}
            </div>
          </div>

          <div className="mt-4">
            <TabsContent value="active" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <ActiveMember
                    refresh={refresh}
                    onEdit={(data) => {
                      setEditData(data);
                      setDrawerOpen(true);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deactive" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <Deactivatemember
                    refresh={refresh}
                    onEdit={(data) => {
                      setEditData(data);
                      setDrawerOpen(true);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <ActiveGroups
                    refresh={refresh}
                    onEdit={(data) => {
                      console.log("Edit group:", data);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <AddEditTeamMemberDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editData={editData}
        onSuccess={() => setRefresh((prev) => !prev)}
      />

      <CreateGroupDrawer
        open={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
        onSuccess={() => setRefresh((prev) => !prev)}
      />
    </div>
  );
};

export default TeamMember;