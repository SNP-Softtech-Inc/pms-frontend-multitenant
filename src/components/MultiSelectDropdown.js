// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Checkbox,
//   TextField,
//   Menu,
//   Chip,
//   Typography,
//   IconButton
// } from "@mui/material";
// import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";
// import { authAPI } from "../services/api";

// const MultiSelectDropdown = ({
//   value = [],
//   onChange,
//   placeholder = "Select Users",
// }) => {
//   const containerRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [menuWidth, setMenuWidth] = useState(null);
//   const [options, setOptions] = useState([]);

//   // ✅ FETCH USERS (FIXED)
// useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       const res = await authAPI.getAllUsers({
//         page: 1,
//         limit: 50,
//         status: "active",
//       });

//       console.log("API RESPONSE:", res.data);

//       const users = res?.data?.users || [];

//       if (!users.length) {
//         console.warn("No users found");
//       }

//       const formatted = users.map((user) => ({
//         value: user._id,
//         label: user.username,
//         // email: user.email,
//         // role: user.role,
//       }));

//       console.log("FORMATTED USERS:", formatted);

//       setOptions(formatted);
//     } catch (err) {
//       console.error("User fetch error:", err?.response || err);
//     }
//   };

//   fetchUsers();
// }, []);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     if (containerRef.current) {
//       setMenuWidth(containerRef.current.offsetWidth);
//     }
//   };

//   const handleClose = () => setAnchorEl(null);

//   const handleSelect = (selectedValue) => {
//     const exists = value.some((v) => v.value === selectedValue);

//     const newValue = exists
//       ? value.filter((v) => v.value !== selectedValue)
//       : [...value, options.find((o) => o.value === selectedValue)];

//     onChange(newValue);
//   };

//   const clearSelection = (e) => {
//     e.stopPropagation(); // 🔥 prevent dropdown open
//     onChange([]);
//   };

//   const filteredOptions = options.filter((option) =>
//     option.label.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box>
//       <Box
//         ref={containerRef}
//         onClick={handleClick}
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           border: "1px solid #ccc",
//           p: 1,
//           cursor: "pointer",
//           bgcolor: "#fff",
//           minHeight: "40px",
//           flexWrap: "wrap",
//           borderRadius: "6px"
//         }}
//       >
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//           {value.length > 0 ? (
//             value.map((item) => (
//               <Chip
//                 key={item.value}
//                 label={item.label}
//                 onDelete={(e) => {
//                   e.stopPropagation();
//                   handleSelect(item.value);
//                 }}
//                 size="small"
//               />
//             ))
//           ) : (
//             <Typography color="textSecondary">{placeholder}</Typography>
//           )}
//         </Box>

//         <Box display="flex" alignItems="center">
//           {value.length > 0 && (
//             <IconButton size="small" onClick={clearSelection}>
//               <FaTimes />
//             </IconButton>
//           )}
//           <IconButton size="small">
//             {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
//           </IconButton>
//         </Box>
//       </Box>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             width: menuWidth || "auto",
//             maxHeight: 250,
//           },
//         }}
//       >
//         <Box p={1}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search user..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </Box>

//         {filteredOptions.length > 0 ? (
//           filteredOptions.map((option) => (
//             <Box
//               key={option.value}
//               onClick={() => handleSelect(option.value)}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 p: 1,
//                 cursor: "pointer",
//                 "&:hover": { bgcolor: "#f5f5f5" },
//               }}
//             >
//               <Checkbox
//                 checked={value.some((v) => v.value === option.value)}
//               />

//               <Box>
//                 <Typography fontSize={13}>{option.label}</Typography>
//                 <Typography fontSize={11} color="gray">
//                   {option.email}
//                 </Typography>
//               </Box>
//             </Box>
//           ))
//         ) : (
//           <Typography sx={{ p: 2 }}>No users found</Typography>
//         )}
//       </Menu>
//     </Box>
//   );
// };

// export default MultiSelectDropdown;

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import { authAPI } from "../services/api";

const MultiSelectDropdown = ({
  value = [],
  onChange,
  placeholder = "Select Users",
}) => {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });

        const users = res?.data?.users || [];

        setOptions(
          users.map((u) => ({
            value: u._id,
            label: u.username,
            email: u.email,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const toggle = (val) => {
    const exists = value.some((v) => v.value === val);

    const newValue = exists
      ? value.filter((v) => v.value !== val)
      : [...value, options.find((o) => o.value === val)];

    onChange?.(newValue);
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={containerRef}
          className="flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border bg-white p-2"
          onClick={() =>
            setMenuWidth(containerRef.current?.offsetWidth)
          }
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((item) => (
                <Badge
                  key={item.value}
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(item.value);
                  }}
                >
                  {item.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">
                {placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {value.length > 0 && (
              <X className="h-4 w-4" onClick={clearAll} />
            )}
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="p-2"
        style={{ width: menuWidth || "auto" }}
      >
        <Input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

        <div className="max-h-60 overflow-auto">
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <div
                key={option.value}
                onClick={() => toggle(option.value)}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
              >
                <Check
                  className={`h-4 w-4 ${
                    value.some((v) => v.value === option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />

                <div>
                  <p className="text-sm">{option.label}</p>
                  <p className="text-xs text-gray-400">
                    {option.email}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 p-2">
              No users found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectDropdown;