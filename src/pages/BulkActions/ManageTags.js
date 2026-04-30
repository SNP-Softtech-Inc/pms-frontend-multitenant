// // import React, { useEffect, useState, useMemo } from "react";
// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Select, MenuItem,
//   Button, Typography, Box, Paper, Chip, CircularProgress
// } from "@mui/material";
// import { toast } from "react-toastify";

// import { accountsAPI, templateAPI } from "../../services/api"; // ✅ adjust path
// const ManageTags = forwardRef(({ selectedAccounts, onClose, fetchData }, ref) => {
// // const ManageTags = ({ selectedAccounts, onClose, fetchData }) => {
//   const [tags, setTags] = useState([]);
//   const [tagActions, setTagActions] = useState({});
//   const [loading, setLoading] = useState(false);

//   // ================= FETCH TAGS =================
//   useEffect(() => {
//     fetchTags();
//   }, []);

//   const fetchTags = async () => {
//     try {
//       setLoading(true);
//       const res = await templateAPI.getAllTags();
//       const data = res.data;

//       setTags(data.tags || []);

//       // Initialize actions
//       const initial = {};
//       data.tags.forEach((tag) => {
//         initial[tag._id] = "Do nothing";
//       });

//       setTagActions(initial);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch tags");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= HANDLE CHANGE =================
//   const handleActionChange = (tagId, value) => {
//     setTagActions((prev) => ({
//       ...prev,
//       [tagId]: value,
//     }));
//   };

//   // ================= FILTER TAGS =================
//   const assignTags = useMemo(
//     () =>
//       Object.keys(tagActions).filter(
//         (id) => tagActions[id] === "Assign to all"
//       ),
//     [tagActions]
//   );

//   const removeTags = useMemo(
//     () =>
//       Object.keys(tagActions).filter(
//         (id) => tagActions[id] === "Remove from all"
//       ),
//     [tagActions]
//   );

//   // ================= API CALL =================
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       if (assignTags.length > 0) {
//         await accountsAPI.assignBulkTags({
//           accounts: selectedAccounts,
//           tags: assignTags,
//         });
//       }

//       if (removeTags.length > 0) {
//         await accountsAPI.removeBulkTags({
//           accounts: selectedAccounts,
//           tags: removeTags,
//         });
//       }

//       toast.success("Tags updated successfully");
//       fetchData();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };
// useImperativeHandle(ref, () => ({
//   submit: handleSubmit,
// }));
//   // ================= UI =================
//   return (
//     <Box sx={{ p: 2 }}>
     

//       {/* TABLE */}
//       <TableContainer
//         component={Paper}
        
//       >
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Tag</TableCell>
//               <TableCell align="right">Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={2} align="center">
//                   <CircularProgress size={28} />
//                 </TableCell>
//               </TableRow>
//             ) : (
//               tags.map((tag) => (
//                 <TableRow key={tag._id} hover>
//                   {/* TAG */}
//                   <TableCell>
//                     <Chip
//                       label={tag.tagName}
//                       size="small"
//                       sx={{
//                         backgroundColor: tag.tagColour,
//                         color: "#fff",
//                         fontWeight: 500,
//                       }}
//                     />
//                   </TableCell>

//                   {/* ACTION */}
//                   <TableCell align="right">
//                     <Select
//                       value={tagActions[tag._id] || "Do nothing"}
//                       onChange={(e) =>
//                         handleActionChange(tag._id, e.target.value)
//                       }
//                       size="small"
//                       sx={{ minWidth: 150 }}
//                     >
//                       <MenuItem value="Assign to all">
//                         Assign
//                       </MenuItem>
//                       <MenuItem value="Remove from all">
//                         Remove
//                       </MenuItem>
//                       <MenuItem value="Do nothing">
//                         Do nothing
//                       </MenuItem>
//                     </Select>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

     
//     </Box>
//   );
// });

// export default ManageTags;


import React, {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toast } from "react-toastify";
import { Loader2, Tag as TagIcon } from "lucide-react";

import { accountsAPI, templateAPI } from "../../services/api";
import { cn } from "../../lib/utils";

const ManageTags = forwardRef(({ selectedAccounts, onClose, fetchData }, ref) => {
  const [tags, setTags] = useState([]);
  const [tagActions, setTagActions] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= FETCH TAGS =================
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await templateAPI.getAllTags();
      const data = res.data;

      setTags(data.tags || []);

      // Initialize actions
      const initial = {};
      data.tags.forEach((tag) => {
        initial[tag._id] = "Do nothing";
      });

      setTagActions(initial);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleActionChange = (tagId, value) => {
    setTagActions((prev) => ({
      ...prev,
      [tagId]: value,
    }));
  };

  // ================= FILTER TAGS =================
  const assignTags = useMemo(
    () =>
      Object.keys(tagActions).filter(
        (id) => tagActions[id] === "Assign to all"
      ),
    [tagActions]
  );

  const removeTags = useMemo(
    () =>
      Object.keys(tagActions).filter(
        (id) => tagActions[id] === "Remove from all"
      ),
    [tagActions]
  );

  // ================= API CALL =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (assignTags.length > 0) {
        await accountsAPI.assignBulkTags({
          accounts: selectedAccounts,
          tags: assignTags,
        });
      }

      if (removeTags.length > 0) {
        await accountsAPI.removeBulkTags({
          accounts: selectedAccounts,
          tags: removeTags,
        });
      }

      toast.success("Tags updated successfully");
      fetchData();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  // Action options
  const actionOptions = [
    { value: "Assign to all", label: "Assign", color: "emerald" },
    { value: "Remove from all", label: "Remove", color: "red" },
    { value: "Do nothing", label: "Do nothing", color: "gray" },
  ];

  const getActionBadgeClass = (action) => {
    switch (action) {
      case "Assign to all":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300";
      case "Remove from all":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // ================= UI =================
  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="rounded-lg bg-muted/50 border border-border p-3">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Manage tags for <span className="font-medium text-foreground">{selectedAccounts.length}</span> selected account{selectedAccounts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Tags Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 border-b border-border bg-muted/30">
          <div className="px-4 py-3 text-left">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tag
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
          ) : tags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TagIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No tags found</p>
            </div>
          ) : (
            tags.map((tag) => {
              const currentAction = tagActions[tag._id] || "Do nothing";
              const isActive = currentAction !== "Do nothing";
              
              return (
                <div key={tag._id} className="grid grid-cols-2 hover:bg-muted/30 transition-colors">
                  {/* Tag column */}
                  <div className="px-4 py-3 flex items-center">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                        "transition-all duration-200",
                        isActive && "ring-2 ring-offset-1 ring-primary/20"
                      )}
                      style={{
                        backgroundColor: tag.tagColour,
                        color: "#fff",
                      }}
                    >
                      {tag.tagName}
                    </span>
                  </div>

                  {/* Action column */}
                  <div className="px-4 py-3 flex items-center justify-end">
                    <div className="relative">
                      <select
                        value={currentAction}
                        onChange={(e) =>
                          handleActionChange(tag._id, e.target.value)
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
      {(assignTags.length > 0 || removeTags.length > 0) && (
        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-medium text-foreground uppercase tracking-wider">
            Summary of changes
          </p>
          
          {assignTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Assign:</span>
              {tags
                .filter(t => assignTags.includes(t._id))
                .map(tag => (
                  <span
                    key={tag._id}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: tag.tagColour, color: "#fff" }}
                  >
                    {tag.tagName}
                  </span>
                ))}
            </div>
          )}
          
          {removeTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">Remove:</span>
              {tags
                .filter(t => removeTags.includes(t._id))
                .map(tag => (
                  <span
                    key={tag._id}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium line-through opacity-75"
                    style={{ backgroundColor: tag.tagColour, color: "#fff" }}
                  >
                    {tag.tagName}
                  </span>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ManageTags;