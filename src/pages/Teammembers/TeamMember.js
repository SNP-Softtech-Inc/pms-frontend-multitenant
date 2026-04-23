// import React, { useState } from "react";
// import { Button, ButtonGroup, Box } from "@mui/material";

// import ActiveMember from "./ActiveTeammembers";
// import Deactivatemember from "./Deactivatemember";
// import AddEditTeamMemberDrawer from "./AddEditTeamMemberDrawer";

// const TeamMember = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [showActive, setShowActive] = useState(true);
//   const [editData, setEditData] = useState(null);
//   const [refresh, setRefresh] = useState(false);

//   return (
//     <div>
//       {/* Buttons */}
//       <ButtonGroup variant="contained" sx={{gap:2}}>
//         <Button
//           onClick={() => setShowActive(true)}
//           color={showActive ? "secondary" : "primary"}
//         >
//           Active Members
//         </Button>

//         <Button
//           onClick={() => setShowActive(false)}
//           color={!showActive ? "secondary" : "primary"}
//         >
//           Deactive Members
//         </Button>

//         <Button
//           onClick={() => {
//             setEditData(null);
//             setDrawerOpen(true);
//           }}
//         >
//           + Add Member
//         </Button>
//       </ButtonGroup>

//       {/* List */}
//       <Box mt={2}>
//         {showActive ? (
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

//       {/* Drawer */}
//       <AddEditTeamMemberDrawer
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         editData={editData}
//         onSuccess={() => setRefresh((prev) => !prev)}
//       />
//     </div>
//   );
// };

// export default TeamMember;

import React, { useState } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";

import ActiveMember from "./ActiveTeammembers";
import Deactivatemember from "./Deactivatemember";
import AddEditTeamMemberDrawer from "./AddEditTeamMemberDrawer";
import CreateGroupDrawer from "./CreateGroupDrawer"; // 👈 NEW
import ActiveGroups from "./ActiveGroups"; // 👈 NEW
const TeamMember = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false); // 👈 NEW
  const [showActive, setShowActive] = useState(true);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  return (
    <div>
      {/* Buttons */}
      <ButtonGroup variant="contained" sx={{ gap: 2 }}>
        {/* <Button
          onClick={() => setShowActive(true)}
          color={showActive ? "secondary" : "primary"}
        >
          Active Members
        </Button>

        <Button
          onClick={() => setShowActive(false)}
          color={!showActive ? "secondary" : "primary"}
        >
          Deactive Members
        </Button> */}
        <Button
  onClick={() => {
    setShowActive(true);
    setShowGroups(false); // 👈 add this
  }}
  color={showActive && !showGroups ? "secondary" : "primary"}
>
  Active Members
</Button>

<Button
  onClick={() => {
    setShowActive(false);
    setShowGroups(false); // 👈 add this
  }}
  color={!showActive && !showGroups ? "secondary" : "primary"}
>
  Deactive Members
</Button>

        <Button
          onClick={() => {
            setEditData(null);
            setDrawerOpen(true);
          }}
        >
          + Add Member
        </Button>

        <Button color="success" onClick={() => setGroupDrawerOpen(true)}>
          + Create Group
        </Button>
        <Button
          color={showGroups ? "secondary" : "primary"}
          onClick={() => setShowGroups(true)}
        >
          Groups
        </Button>
      </ButtonGroup>

      {/* List */}
      {/* <Box mt={2}>
        {showActive ? (
          <ActiveMember
            refresh={refresh}
            onEdit={(data) => {
              setEditData(data);
              setDrawerOpen(true);
            }}
          />
        ) : (
          <Deactivatemember
            refresh={refresh}
            onEdit={(data) => {
              setEditData(data);
              setDrawerOpen(true);
            }}
          />
        )}
      </Box> */}
      <Box mt={2}>
        {showGroups ? (
          <ActiveGroups
            refresh={refresh}
            onEdit={(data) => {
              console.log("Edit group:", data);
            }}
          />
        ) : showActive ? (
          <ActiveMember
            refresh={refresh}
            onEdit={(data) => {
              setEditData(data);
              setDrawerOpen(true);
            }}
          />
        ) : (
          <Deactivatemember
            refresh={refresh}
            onEdit={(data) => {
              setEditData(data);
              setDrawerOpen(true);
            }}
          />
        )}
      </Box>
      {/* Member Drawer */}
      <AddEditTeamMemberDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editData={editData}
        onSuccess={() => setRefresh((prev) => !prev)}
      />

      {/* 👇 Group Drawer */}
      <CreateGroupDrawer
        open={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
        onSuccess={() => setRefresh((prev) => !prev)}
      />
    </div>
  );
};

export default TeamMember;
