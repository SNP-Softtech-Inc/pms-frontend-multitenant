



// import React, { useState, useEffect } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent } from "../../components/ui/card";
// import ActiveMember from "./ActiveTeammembers";
// import Deactivatemember from "./Deactivatemember";
// import AddEditTeamMemberDrawer from "./AddEditTeamMemberDrawer";
// import CreateGroupDrawer from "./CreateGroupDrawer";
// import ActiveGroups from "./ActiveGroups";

// const TeamMember = () => {
//   const [activeTab, setActiveTab] = useState("active");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [refresh, setRefresh] = useState(false);

//   const handleTabChange = (value) => {
//     setActiveTab(value);
//   };

//   const getActionButton = () => {
//     if (activeTab !== "groups") {
//       return (
//         <Button
//           onClick={() => {
//             setEditData(null);
//             setDrawerOpen(true);
//           }}
//         >
//           + Add Member
//         </Button>
//       );
//     }

//     if (activeTab === "groups") {
//       return (
//         <Button
         
//           onClick={() => setGroupDrawerOpen(true)}
//         >
//           + Create Group
//         </Button>
//       );
//     }

//     return null;
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//           <div className="flex items-center justify-between">
//             <TabsList>
//               <TabsTrigger value="active">Active Members</TabsTrigger>
//               <TabsTrigger value="deactive">Deactive Members</TabsTrigger>
//               <TabsTrigger value="groups">Groups</TabsTrigger>
//             </TabsList>
            
//             <div className="flex items-center gap-2">
//               {getActionButton()}
//             </div>
//           </div>

//           <div className="mt-4">
//             <TabsContent value="active" className="mt-0">
//               <Card>
//                 <CardContent className="p-6">
//                   <ActiveMember
//                     refresh={refresh}
//                     onEdit={(data) => {
//                       setEditData(data);
//                       setDrawerOpen(true);
//                     }}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="deactive" className="mt-0">
//               <Card>
//                 <CardContent className="p-6">
//                   <Deactivatemember
//                     refresh={refresh}
//                     onEdit={(data) => {
//                       setEditData(data);
//                       setDrawerOpen(true);
//                     }}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="groups" className="mt-0">
//               <Card>
//                 <CardContent className="p-6">
//                   <ActiveGroups
//                     refresh={refresh}
//                     onEdit={(data) => {
//                       console.log("Edit group:", data);
//                     }}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </div>
//         </Tabs>
//       </div>

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

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {  useNavigate, useLocation } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import AddEditTeamMemberDrawer from "./AddEditTeamMemberDrawer";
import CreateGroupDrawer from "./CreateGroupDrawer";

const TeamMember = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const activeTab = location.pathname.includes("/groups")
    ? "groups"
    : location.pathname.includes("/deactive")
    ? "deactive"
    : "active";

  const handleTabChange = (value) => {
    switch (value) {
      case "active":
        navigate("firmtemp/teammember/active");
        break;
      case "deactive":
        navigate("firmtemp/teammember/deactive");
        break;
      case "groups":
        navigate("firmtemp/teammember/groups");
        break;
      default:
        break;
    }
  };

  const getActionButton = () => {
    if (activeTab === "groups") {
      return (
        <Button onClick={() => setGroupDrawerOpen(true)}>
          + Create Group
        </Button>
      );
    }

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
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">
                Active Members
              </TabsTrigger>

              <TabsTrigger value="deactive">
                Deactive Members
              </TabsTrigger>

              <TabsTrigger value="groups">
                Groups
              </TabsTrigger>
            </TabsList>

            {getActionButton()}
          </div>
        </Tabs>
      </div>

      {/* Child routes render here */}
      <Outlet
        context={{
          refresh,
          setRefresh,
          setEditData,
          setDrawerOpen,
        }}
      />

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