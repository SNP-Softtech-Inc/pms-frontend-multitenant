



// import React, { useEffect, useState } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Autocomplete,
// } from "@mui/material";
// import { authAPI } from "../../services/api";
// import { toast } from "react-toastify";

// const CreateGroupDrawer = ({ open, onClose, onSuccess, editData }) => {
//   const [name, setName] = useState("");
//   const [members, setMembers] = useState([]);
//   const [leader, setLeader] = useState(null);
//   const [allUsers, setAllUsers] = useState([]);

//   // ================= FETCH USERS =================
//   // useEffect(() => {
//   //   if (open) {
//   //     authAPI.getAllUsers().then((res) => {
//   //       const users = res.data?.users || [];

//   //       const teamMembersOnly = users.filter(
//   //         (u) => u.role === "team_member"
//   //       );

//   //       setAllUsers(teamMembersOnly);
//   //     });
//   //   }
//   // }, [open]);
// useEffect(() => {
//   if (open) {
//     authAPI.getAllUsers().then((res) => {
//       const users = res.data?.users || [];

//       const teamMembersOnly = users.filter(
//         (u) =>
//           u.role === "team_member" &&
//           (!u.group || u.group === null) // ✅ exclude users already in group
//       );
// console.log("Fetched users for group drawer:", teamMembersOnly); // Debug log
//       setAllUsers(teamMembersOnly);
//     });
//   }
// }, [open]);
//   // ================= PREFILL (EDIT MODE) =================
//   useEffect(() => {
//     if (editData && open) {
//       setName(editData.name || "");
//       setLeader(editData.leader || null);
//       setMembers(editData.members || []);
//     }
//   }, [editData, open]);

//   // ================= RESET WHEN CLOSED =================
//   useEffect(() => {
//     if (!open) {
//       setName("");
//       setLeader(null);
//       setMembers([]);
//     }
//   }, [open]);

//   // ================= REMOVE LEADER FROM MEMBERS =================
//   useEffect(() => {
//     if (leader) {
//       setMembers((prev) =>
//         prev.filter((m) => m._id !== leader._id)
//       );
//     }
//   }, [leader]);

//   // ================= SUBMIT =================
//   const handleSubmit = async () => {
//     try {
//       if (!name || !leader) {
//         return toast.error("Group name and leader required");
//       }

//       const payload = {
//         name,
//         leaderId: leader._id,
//         memberIds: members.map((m) => m._id),
//       };

//       if (editData) {
//         // ✅ UPDATE GROUP
//         await authAPI.updateGroup(editData._id, payload);
//         toast.success("Group updated");
//       } else {
//         // ✅ CREATE GROUP
//         await authAPI.createGroup(payload);
//         toast.success("Group created");
//       }

//       onSuccess();
//       onClose();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <Box sx={{ width: 400, p: 2 }}>
        
//         {/* Title */}
//         <Typography variant="h6">
//           {editData ? "Edit Group" : "Create Group"}
//         </Typography>

//         {/* Group Name */}
//         <TextField
//           fullWidth
//           label="Group Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           sx={{ my: 2 }}
//         />

//         {/* Leader */}
//         <Autocomplete
//           options={allUsers || []}
//           getOptionLabel={(opt) => opt?.username || ""}
//           value={leader}
//           onChange={(e, val) => setLeader(val)}
//           isOptionEqualToValue={(opt, val) => opt._id === val._id}
//           renderInput={(params) => (
//             <TextField {...params} label="Select Leader" />
//           )}
//         />

//         {/* Members */}
//         <Autocomplete
//           multiple
//           options={(allUsers || []).filter(
//             (user) => user._id !== leader?._id
//           )}
//           getOptionLabel={(opt) => opt?.username || ""}
//           value={members}
//           onChange={(e, val) => setMembers(val)}
//           isOptionEqualToValue={(opt, val) => opt._id === val._id}
//           renderInput={(params) => (
//             <TextField {...params} label="Select Members" />
//           )}
//           sx={{ mt: 2 }}
//         />

//         {/* Submit */}
//         <Button
//           variant="contained"
//           fullWidth
//           sx={{ mt: 3 }}
//           onClick={handleSubmit}
//         >
//           {editData ? "Update Group" : "Create Group"}
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default CreateGroupDrawer;


import React, { useEffect, useState } from "react";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { X, Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "../../components/ui/command";

const CreateGroupDrawer = ({ open, onClose, onSuccess, editData }) => {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [leader, setLeader] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [leaderOpen, setLeaderOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  // ================= FETCH USERS =================
  useEffect(() => {
    if (open) {
      authAPI.getAllUsers().then((res) => {
        const users = res.data?.users || [];

        const teamMembersOnly = users.filter((u) => {
          if (u.role !== "team_member") return false;

          // allow users without group
          if (!u.group) return true;

          // allow existing group users in edit mode
          if (editData) {
            const isLeader = u._id === editData.leader?._id;
            const isMember = editData.members?.some(
              (m) => m._id === u._id
            );
            return isLeader || isMember;
          }

          return false;
        });

        setAllUsers(teamMembersOnly);
      });
    }
  }, [open, editData]);

  // ================= PREFILL =================
  useEffect(() => {
    if (editData && open && allUsers.length > 0) {
      setName(editData.name || "");

      const leaderObj = allUsers.find(
        (u) => u._id === editData.leader?._id
      );
      setLeader(leaderObj || null);

      const memberObjs = allUsers.filter((u) =>
        editData.members?.some((m) => m._id === u._id)
      );
      setMembers(memberObjs);
    }
  }, [editData, open, allUsers]);

  // ================= RESET =================
  useEffect(() => {
    if (!open) {
      setName("");
      setLeader(null);
      setMembers([]);
    }
  }, [open]);

  // ================= REMOVE LEADER FROM MEMBERS =================
  useEffect(() => {
    if (leader) {
      setMembers((prev) =>
        prev.filter((m) => m._id !== leader._id)
      );
    }
  }, [leader]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!name || !leader) {
        return toast.error("Group name and leader required");
      }

      const payload = {
        name,
        leaderId: leader._id,
        memberIds: members.map((m) => m._id),
      };

      if (editData) {
        await authAPI.updateGroup(editData._id, payload);
        toast.success("Group updated");
      } else {
        await authAPI.createGroup(payload);
        toast.success("Group created");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-background shadow-xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-base font-semibold">
            {editData ? "Edit Group" : "Create Group"}
          </h2>
          <button onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Group Name */}
          <div>
            <label className="text-sm font-medium">Group Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-lg border"
            />
          </div>

          {/* Leader */}
          <div>
            <label className="text-sm font-medium">Select Leader</label>

            {/* <Popover open={leaderOpen} onOpenChange={setLeaderOpen}>
              <PopoverTrigger asChild>
                <button className="w-full mt-1 h-10 border rounded-lg px-3 flex justify-between items-center">
                  {leader ? leader.username : "Select Leader"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search leader..." />
                  <CommandList>
                    <CommandEmpty>No user found</CommandEmpty>

                    {allUsers.map((user) => (
                      <CommandItem
                        key={user._id}
                        onSelect={() => {
                          setLeader(user);
                          setLeaderOpen(false);
                        }}
                      >
                        {user.username}
                        {leader?._id === user._id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover> */}
            <Popover open={leaderOpen} onOpenChange={setLeaderOpen}>
  <PopoverTrigger asChild>
    <button
      disabled={!!editData} // ✅ disable in edit mode
      className={`w-full mt-1 h-10 border rounded-lg px-3 flex justify-between items-center ${
        editData
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : ""
      }`}
    >
      {leader ? leader.username : "Select Leader"}
      <ChevronsUpDown className="h-4 w-4 opacity-50" />
    </button>
  </PopoverTrigger>

  {/* ❌ Prevent opening popover in edit mode */}
  {!editData && (
    <PopoverContent className="p-0">
      <Command>
        <CommandInput placeholder="Search leader..." />
        <CommandList>
          <CommandEmpty>No user found</CommandEmpty>

          {allUsers.map((user) => (
            <CommandItem
              key={user._id}
              onSelect={() => {
                setLeader(user);
                setLeaderOpen(false);
              }}
            >
              {user.username}
              {leader?._id === user._id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </PopoverContent>
  )}
</Popover>
          </div>

          {/* Members */}
          <div>
            <label className="text-sm font-medium">Select Members</label>

            <Popover open={membersOpen} onOpenChange={setMembersOpen}>
              <PopoverTrigger asChild>
                <button className="w-full mt-1 min-h-10 border rounded-lg px-3 flex flex-wrap gap-1 items-center">
                  {members.length > 0
                    ? members.map((m) => (
                        <span
                          key={m._id}
                          className="bg-primary/10 text-xs px-2 py-1 rounded"
                        >
                          {m.username}
                        </span>
                      ))
                    : "Select Members"}
                  <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search members..." />
                  <CommandList>
                    <CommandEmpty>No user found</CommandEmpty>

                    {allUsers
                      .filter((u) => u._id !== leader?._id)
                      .map((user) => {
                        const isSelected = members.some(
                          (m) => m._id === user._id
                        );

                        return (
                          <CommandItem
                            key={user._id}
                            onSelect={() => {
                              if (isSelected) {
                                setMembers(
                                  members.filter(
                                    (m) => m._id !== user._id
                                  )
                                );
                              } else {
                                setMembers([...members, user]);
                              }
                            }}
                          >
                            {user.username}
                            {isSelected && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        );
                      })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="h-9 px-4 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="h-9 px-4 bg-primary text-white rounded-lg"
          >
            {editData ? "Update Group" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupDrawer;