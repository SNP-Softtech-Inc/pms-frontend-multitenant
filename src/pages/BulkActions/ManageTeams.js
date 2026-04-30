// import React, { useEffect, useState, useMemo, forwardRef, useImperativeHandle } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Select,
//   MenuItem,
//   Typography,
//   Box,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import { accountsAPI, authAPI } from "../../services/api";

// const ManageTeams = forwardRef(
//   ({ selectedAccounts, onClose, fetchData }, ref) => {
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [actions, setActions] = useState({});
//     const [loading, setLoading] = useState(false);

//     // ================= FETCH TEAM =================
//     useEffect(() => {
//       fetchTeamMembers();
//     }, []);

//     const fetchTeamMembers = async () => {
//       try {
//         setLoading(true);

//         const res = await authAPI.getAllUsers(); // ✅ use API
//         const data = res.data.users || [];

//         setTeamMembers(data);

//         const initial = {};
//         data.forEach((user) => {
//           initial[user._id] = "Do nothing";
//         });

//         setActions(initial);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch team members");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // ================= HANDLE CHANGE =================
//     const handleActionChange = (userId, value) => {
//       setActions((prev) => ({
//         ...prev,
//         [userId]: value,
//       }));
//     };

//     // ================= FILTER =================
//     const assignMembers = useMemo(
//       () =>
//         Object.keys(actions).filter(
//           (id) => actions[id] === "Assign to all"
//         ),
//       [actions]
//     );

//     const removeMembers = useMemo(
//       () =>
//         Object.keys(actions).filter(
//           (id) => actions[id] === "Remove from all"
//         ),
//       [actions]
//     );

//     // ================= SUBMIT (FOR DRAWER BUTTON) =================
//     const handleSubmit = async () => {
//       try {
//         setLoading(true);

//         if (assignMembers.length > 0) {
//           await accountsAPI.assignTeamMembers({
//             accounts: selectedAccounts,
//             teamMembers: assignMembers,
//           });
//         }

//         if (removeMembers.length > 0) {
//           await accountsAPI.removeTeamMembers({
//             accounts: selectedAccounts,
//             teamMembers: removeMembers,
//           });
//         }

//         toast.success("Team updated successfully");

//         fetchData(); // refresh table
//         onClose();   // close drawer
//       } catch (err) {
//         console.error(err);
//         toast.error("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // ✅ expose to parent drawer button
//     useImperativeHandle(ref, () => ({
//       submit: handleSubmit,
//     }));

//     // ================= UI =================
//     return (
//       <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        
//         <TableContainer component={Paper} sx={{ flex: 1 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Team Member</TableCell>
//                 <TableCell align="right">Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={2} align="center">
//                     <CircularProgress size={28} />
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 teamMembers.map((user) => (
//                   <TableRow key={user._id} hover>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {user.username}
//                       </Typography>
//                     </TableCell>

//                     <TableCell align="right">
//                       <Select
//                         value={actions[user._id] || "Do nothing"}
//                         onChange={(e) =>
//                           handleActionChange(user._id, e.target.value)
//                         }
//                         size="small"
//                         sx={{ minWidth: 150 }}
//                       >
//                         <MenuItem value="Assign to all">
//                           Assign
//                         </MenuItem>
//                         <MenuItem value="Remove from all">
//                           Remove
//                         </MenuItem>
//                         <MenuItem value="Do nothing">
//                           Do nothing
//                         </MenuItem>
//                       </Select>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   }
// );

// export default ManageTeams;

import React, { useEffect, useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { Users, Loader2, UserPlus, UserMinus } from "lucide-react";
import { accountsAPI, authAPI } from "../../services/api";
import { cn } from "../../lib/utils";

const ManageTeams = forwardRef(
  ({ selectedAccounts, onClose, fetchData }, ref) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [actions, setActions] = useState({});
    const [loading, setLoading] = useState(false);

    // ================= FETCH TEAM =================
    useEffect(() => {
      fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
      try {
        setLoading(true);

        const res = await authAPI.getAllUsers(); // ✅ use API
        const data = res.data.users || [];

        setTeamMembers(data);

        const initial = {};
        data.forEach((user) => {
          initial[user._id] = "Do nothing";
        });

        setActions(initial);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch team members");
      } finally {
        setLoading(false);
      }
    };

    // ================= HANDLE CHANGE =================
    const handleActionChange = (userId, value) => {
      setActions((prev) => ({
        ...prev,
        [userId]: value,
      }));
    };

    // ================= FILTER =================
    const assignMembers = useMemo(
      () =>
        Object.keys(actions).filter(
          (id) => actions[id] === "Assign to all"
        ),
      [actions]
    );

    const removeMembers = useMemo(
      () =>
        Object.keys(actions).filter(
          (id) => actions[id] === "Remove from all"
        ),
      [actions]
    );

    // ================= SUBMIT (FOR DRAWER BUTTON) =================
    const handleSubmit = async () => {
      try {
        setLoading(true);

        if (assignMembers.length > 0) {
          await accountsAPI.assignTeamMembers({
            accounts: selectedAccounts,
            teamMembers: assignMembers,
          });
        }

        if (removeMembers.length > 0) {
          await accountsAPI.removeTeamMembers({
            accounts: selectedAccounts,
            teamMembers: removeMembers,
          });
        }

        toast.success("Team updated successfully");

        fetchData(); // refresh table
        onClose();   // close drawer
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    // ✅ expose to parent drawer button
    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    // Action options
    const actionOptions = [
      { value: "Assign to all", label: "Assign", color: "emerald", icon: UserPlus },
      { value: "Remove from all", label: "Remove", color: "red", icon: UserMinus },
      { value: "Do nothing", label: "Do nothing", color: "gray", icon: null },
    ];

    // ================= UI =================
    return (
      <div className="space-y-4">
        {/* Header info */}
        <div className="rounded-lg bg-muted/50 border border-border p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Manage team members for <span className="font-medium text-foreground">{selectedAccounts.length}</span> selected account{selectedAccounts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 border-b border-border bg-muted/30">
            <div className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Team Member
              </span>
            </div>
            <div className="px-4 py-3 text-right">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No team members found</p>
              </div>
            ) : (
              teamMembers.map((user) => {
                const currentAction = actions[user._id] || "Do nothing";
                const isActive = currentAction !== "Do nothing";
                const selectedOption = actionOptions.find(opt => opt.value === currentAction);
                const IconComponent = selectedOption?.icon;
                
                return (
                  <div key={user._id} className="grid grid-cols-2 hover:bg-muted/30 transition-colors">
                    {/* Team Member column */}
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className={cn(
                        "p-1.5 rounded-md transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted/50 text-muted-foreground"
                      )}>
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.username}
                        </p>
                        {user.email && (
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action column */}
                    <div className="px-4 py-3 flex items-center justify-end">
                      <div className="relative">
                        <select
                          value={currentAction}
                          onChange={(e) =>
                            handleActionChange(user._id, e.target.value)
                          }
                          className={cn(
                            "h-9 px-3 pr-8 text-sm rounded-md border transition-all duration-200",
                            "bg-background text-foreground appearance-none",
                            "border-border hover:border-primary/50",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                            "cursor-pointer",
                            currentAction !== "Do nothing" && "border-primary/50 bg-primary/5"
                          )}
                          style={{ minWidth: "150px" }}
                        >
                          {actionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        
                        {/* Custom dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Summary of changes */}
        {(assignMembers.length > 0 || removeMembers.length > 0) && (
          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-xs font-medium text-foreground uppercase tracking-wider">
              Summary of changes
            </p>
            
            {assignMembers.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <UserPlus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Assign:</span>
                {teamMembers
                  .filter(user => assignMembers.includes(user._id))
                  .map(user => (
                    <span
                      key={user._id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                      {user.username}
                    </span>
                  ))}
              </div>
            )}
            
            {removeMembers.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <UserMinus className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">Remove:</span>
                {teamMembers
                  .filter(user => removeMembers.includes(user._id))
                  .map(user => (
                    <span
                      key={user._id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 line-through"
                    >
                      {user.username}
                    </span>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default ManageTeams;