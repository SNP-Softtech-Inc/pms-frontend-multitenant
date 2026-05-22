// import React, { useState, useEffect, useRef } from "react";
// import Cookies from "js-cookie";
// import {
//   Box,
//   Checkbox,
//   TextField,
//   Menu,
//   Chip,
//   Typography,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { FaCaretUp, FaCaretDown } from "react-icons/fa";
// import { accountsAPI } from "../services/api"; // ✅ ONLY THIS API
// import { useAuth } from "../context/AuthContext";
// const MultiSelectDropdown = ({
//   value = [],
//   onChange,
//   options: propOptions,
//   placeholder = "Select from list",
//   width = "100%",
// }) => {
//   const containerRef = useRef(null);
// const { user } = useAuth();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [menuWidth, setMenuWidth] = useState(null);
//   const [internalOptions, setInternalOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [initialized, setInitialized] = useState(false);

//   const options = propOptions || internalOptions;

//   useEffect(() => {
//     if (!propOptions && !initialized && user) {
//       const fetchAccounts = async () => {
//         try {
//           setLoading(true);

//           let res;

//           // ✅ ROLE BASED API
//           if (user?.role === "team_member") {
//             res = await accountsAPI.getAccountsByTeamMember(true); // pass isActive if needed
//           } else {
//             res = await accountsAPI.getAccountsList(true);
//           }

//           const list = res.data.accountlist || [];

//           const formatted = list.map((acc) => ({
//             value: acc._id,
//             label: acc.accountName,
//           }));

//           setInternalOptions(formatted);

//           // ✅ AUTO SELECT FROM COOKIE
//           if (value.length === 0) {
//             const accountIdFromCookie = Cookies.get("accountId");

//             if (accountIdFromCookie) {
//               const matched = formatted.find(
//                 (acc) => acc.value === accountIdFromCookie
//               );

//               if (matched && onChange) {
//                 onChange([matched]);
//               }
//             }
//           }

//           setInitialized(true);
//         } catch (error) {
//           console.error("Error fetching accounts:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchAccounts();
//     }
//   }, [propOptions, initialized, onChange, value, user]);

//   // ================= HANDLERS =================

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     if (containerRef.current) {
//       setMenuWidth(containerRef.current.offsetWidth);
//     }
//   };

//   const handleClose = () => setAnchorEl(null);

//   const handleSelect = (selectedValue) => {
//     const newValue = value.some((item) => item.value === selectedValue)
//       ? value.filter((item) => item.value !== selectedValue)
//       : [...value, options.find((opt) => opt.value === selectedValue)];

//     onChange?.(newValue);
//   };

//   const clearSelection = () => onChange?.([]);

//   const filteredOptions = options.filter((option) =>
//     option.label.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ================= UI =================

//   return (
//     <Box sx={{ width }}>
//       {/* SELECT BOX */}
//       <Box
//         ref={containerRef}
//         onClick={handleClick}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           border: "1px solid #ccc",
//           borderRadius: "10px",
//           padding: "8px",
//           cursor: "pointer",
//           bgcolor: "#fff",
//           mt: 2,
//           minHeight: "40px",
//         }}
//       >
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flexGrow: 1 }}>
//           {value.length > 0 ? (
//             value.map((item) => (
//               <Chip
//                 key={item.value}
//                 label={item.label}
//                 size="small"
//                 onDelete={() => handleSelect(item.value)}
//                 sx={{ fontSize: "11px", borderRadius: "14px" }}
//               />
//             ))
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               {placeholder}
//             </Typography>
//           )}
//         </Box>

//         <IconButton size="small">
//           {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
//         </IconButton>
//       </Box>

//       {/* DROPDOWN */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             width: menuWidth || 300,
//             maxHeight: 300,
//           },
//         }}
//       >
//         {/* SEARCH */}
//         <Box sx={{ p: 1 }}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             autoFocus
//           />
//         </Box>

//         {/* OPTIONS */}
//         {loading ? (
//           <Box sx={{ textAlign: "center", p: 2 }}>
//             <CircularProgress size={20} />
//           </Box>
//         ) : filteredOptions.length > 0 ? (
//           filteredOptions.map((option) => (
//             <Box
//               key={option.value}
//               onClick={() => handleSelect(option.value)}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 px: 2,
//                 py: 1,
//                 cursor: "pointer",
//                 "&:hover": { bgcolor: "action.hover" },
//               }}
//             >
//               <Checkbox
//                 checked={value.some((v) => v.value === option.value)}
//                 size="small"
//               />
//               <Typography>{option.label}</Typography>
//             </Box>
//           ))
//         ) : (
//           <Typography sx={{ p: 2, color: "gray" }}>
//             No results found
//           </Typography>
//         )}

//         {/* CLEAR */}
//         {value.length > 0 && (
//           <Box
//             onClick={clearSelection}
//             sx={{
//               px: 2,
//               py: 1,
//               color: "red",
//               cursor: "pointer",
//               "&:hover": { bgcolor: "action.hover" },
//             }}
//           >
//             Clear selection
//           </Box>
//         )}
//       </Menu>
//     </Box>
//   );
// };

// export default MultiSelectDropdown;


import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { cn } from "../lib/utils"; // Standard Shadcn utility

import { accountsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Shadcn Components
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";

const MultiSelectDropdown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select from list",
  width = "100%",
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const options = propOptions || internalOptions;

  // ================= LOGIC (UNCHANGED) =================
  useEffect(() => {
    if (!propOptions && !initialized && user) {
      const fetchAccounts = async () => {
        try {
          setLoading(true);
          let res;

          if (user?.role === "team_member") {
            res = await accountsAPI.getAccountsByTeamMember(true);
          } else {
            res = await accountsAPI.getAccountsList(true);
          }

          const list = res.data.accountlist || [];
          const formatted = list.map((acc) => ({
            value: acc._id,
            label: acc.accountName,
          }));

          setInternalOptions(formatted);

          if (value.length === 0) {
            const accountIdFromCookie = Cookies.get("accountId");
            if (accountIdFromCookie) {
              const matched = formatted.find(
                (acc) => acc.value === accountIdFromCookie
              );
              if (matched && onChange) {
                onChange([matched]);
              }
            }
          }
          setInitialized(true);
        } catch (error) {
          console.error("Error fetching accounts:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAccounts();
    }
  }, [propOptions, initialized, onChange, value, user]);

  // ================= HANDLERS (UNCHANGED) =================
  const handleSelect = (selectedValue) => {
    const isSelected = value.some((item) => item.value === selectedValue);
    const newValue = isSelected
      ? value.filter((item) => item.value !== selectedValue)
      : [...value, options.find((opt) => opt.value === selectedValue)];

    onChange?.(newValue);
  };

  const handleUnselect = (e, itemValue) => {
    e.stopPropagation(); // Prevent dropdown from opening/closing
    const newValue = value.filter((item) => item.value !== itemValue);
    onChange?.(newValue);
  };

  const clearSelection = () => onChange?.([]);

  return (
    <div style={{ width }} className="mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto p-2 rounded-[10px] "
          >
            <div className="flex flex-wrap gap-1">
              {value.length > 0 ? (
                value.map((item) => (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className="text-[11px] font-normal rounded-full px-2 py-0 flex items-center gap-1"
                  >
                    {item.label}
                    <X
                      className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100"
                      onClick={(e) => handleUnselect(e, item.value)}
                    />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground font-normal">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList className="max-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      const isSelected = value.some((v) => v.value === option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => handleSelect(option.value)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox checked={isSelected} />
                          <span>{option.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}

              {value.length > 0 && (
                <>
                  <div className="h-[1px] bg-border my-1" />
                  <CommandItem
                    onSelect={clearSelection}
                    className="justify-center text-red-500 font-medium cursor-pointer focus:bg-red-50 focus:text-red-500"
                  >
                    Clear selection
                  </CommandItem>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelectDropdown;