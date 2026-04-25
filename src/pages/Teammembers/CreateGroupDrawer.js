



import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";

const CreateGroupDrawer = ({ open, onClose, onSuccess, editData }) => {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [leader, setLeader] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // ================= FETCH USERS =================
  // useEffect(() => {
  //   if (open) {
  //     authAPI.getAllUsers().then((res) => {
  //       const users = res.data?.users || [];

  //       const teamMembersOnly = users.filter(
  //         (u) => u.role === "team_member"
  //       );

  //       setAllUsers(teamMembersOnly);
  //     });
  //   }
  // }, [open]);
useEffect(() => {
  if (open) {
    authAPI.getAllUsers().then((res) => {
      const users = res.data?.users || [];

      const teamMembersOnly = users.filter(
        (u) =>
          u.role === "team_member" &&
          (!u.group || u.group === null) // ✅ exclude users already in group
      );
console.log("Fetched users for group drawer:", teamMembersOnly); // Debug log
      setAllUsers(teamMembersOnly);
    });
  }
}, [open]);
  // ================= PREFILL (EDIT MODE) =================
  useEffect(() => {
    if (editData && open) {
      setName(editData.name || "");
      setLeader(editData.leader || null);
      setMembers(editData.members || []);
    }
  }, [editData, open]);

  // ================= RESET WHEN CLOSED =================
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
        // ✅ UPDATE GROUP
        await authAPI.updateGroup(editData._id, payload);
        toast.success("Group updated");
      } else {
        // ✅ CREATE GROUP
        await authAPI.createGroup(payload);
        toast.success("Group created");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 2 }}>
        
        {/* Title */}
        <Typography variant="h6">
          {editData ? "Edit Group" : "Create Group"}
        </Typography>

        {/* Group Name */}
        <TextField
          fullWidth
          label="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ my: 2 }}
        />

        {/* Leader */}
        <Autocomplete
          options={allUsers || []}
          getOptionLabel={(opt) => opt?.username || ""}
          value={leader}
          onChange={(e, val) => setLeader(val)}
          isOptionEqualToValue={(opt, val) => opt._id === val._id}
          renderInput={(params) => (
            <TextField {...params} label="Select Leader" />
          )}
        />

        {/* Members */}
        <Autocomplete
          multiple
          options={(allUsers || []).filter(
            (user) => user._id !== leader?._id
          )}
          getOptionLabel={(opt) => opt?.username || ""}
          value={members}
          onChange={(e, val) => setMembers(val)}
          isOptionEqualToValue={(opt, val) => opt._id === val._id}
          renderInput={(params) => (
            <TextField {...params} label="Select Members" />
          )}
          sx={{ mt: 2 }}
        />

        {/* Submit */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          {editData ? "Update Group" : "Create Group"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default CreateGroupDrawer;