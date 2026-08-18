// // import React, { useEffect, useRef, useState } from "react";
// // import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

// // import { Input } from "../components/ui/input";
// // import { Badge } from "../components/ui/badge";
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger,
// // } from "../components/ui/popover";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuTrigger,
// // } from "../components/ui/dropdown-menu";
// // import { authAPI } from "../services/api";

// // const MultiSelectDropdown = ({
// //   value = [],
// //   onChange,
// //   placeholder = "Select Users",
// // }) => {
// //   const containerRef = useRef(null);
// //   const [open, setOpen] = useState(false);
// //   const [search, setSearch] = useState("");
// //   const [menuWidth, setMenuWidth] = useState(null);
// //   const [options, setOptions] = useState([]);

// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         const res = await authAPI.getAllUsers({
// //           page: 1,
// //           limit: 100,
// //           status: "active",
// //         });

// //         const users = res?.data?.users || [];

// //         setOptions(
// //           users.map((u) => ({
// //             value: u._id,
// //             label: u.username,
// //             email: u.email,
// //           }))
// //         );
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);

// //   const toggle = (val) => {
// //     const exists = value.some((v) => v.value === val);

// //     const newValue = exists
// //       ? value.filter((v) => v.value !== val)
// //       : [...value, options.find((o) => o.value === val)];

// //     onChange?.(newValue);
// //   };

// //   const clearAll = (e) => {
// //     e.stopPropagation();
// //     onChange?.([]);
// //   };

// //   const filtered = options.filter((o) =>
// //     o.label.toLowerCase().includes(search.toLowerCase())
// //   );

// //  return (
// //   <DropdownMenu open={open} onOpenChange={setOpen}>
// //     <DropdownMenuTrigger asChild>
// //       <div
// //         ref={containerRef}
// //         className="
// //           flex min-h-10 w-full cursor-pointer items-center justify-between
// //           rounded-xl border border-border bg-background
// //           px-3 py-2
// //           transition-all duration-200
// //           hover:border-primary/40
// //           hover:bg-accent/40
// //           focus-within:ring-2 focus-within:ring-ring
// //         "
// //         onClick={() =>
// //           setMenuWidth(containerRef.current?.offsetWidth)
// //         }
// //       >
// //         {/* Selected Values */}
// //         <div className="flex flex-wrap gap-1.5">
// //           {value.length > 0 ? (
// //             value.map((item) => (
// //               <Badge
// //                 key={item.value}
// //                 className="
// //                   flex items-center gap-1
// //                   rounded-md
// //                   bg-primary/10
// //                   text-primary
// //                   border border-primary/20
// //                   hover:bg-primary/20
// //                   transition-colors
// //                   text-xs font-medium
// //                 "
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   toggle(item.value);
// //                 }}
// //               >
// //                 {item.label}
// //                 <X className="h-3 w-3 cursor-pointer" />
// //               </Badge>
// //             ))
// //           ) : (
// //             <span className="text-sm text-muted-foreground">
// //               {placeholder}
// //             </span>
// //           )}
// //         </div>

// //         {/* Right Icons */}
// //         <div className="flex items-center gap-2 text-muted-foreground">
// //           {value.length > 0 && (
// //             <button
// //               type="button"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 clearAll(e);
// //               }}
// //               className="
// //                 rounded-sm p-0.5
// //                 hover:bg-muted
// //                 hover:text-foreground
// //                 transition-colors
// //               "
// //             >
// //               <X className="h-4 w-4" />
// //             </button>
// //           )}

// //           {open ? (
// //             <ChevronUp className="h-4 w-4 transition-transform" />
// //           ) : (
// //             <ChevronDown className="h-4 w-4 transition-transform" />
// //           )}
// //         </div>
// //       </div>
// //     </DropdownMenuTrigger>

// //     <DropdownMenuContent
// //       align="start"
// //       className="
// //         p-3
// //         border border-border
// //         bg-popover
// //         text-popover-foreground
// //         shadow-xl
// //         rounded-xl
// //       "
// //       style={{ width: menuWidth || "auto" }}
// //       onCloseAutoFocus={(e) => e.preventDefault()}
// //     >
// //       {/* Search */}
// //       <Input
// //         placeholder="Search user..."
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
// //         onClick={(e) => e.stopPropagation()}
// //         className="
// //           mb-3
// //           bg-background
// //           border-border
// //           text-foreground
// //           placeholder:text-muted-foreground
// //           focus-visible:ring-ring
// //         "
// //       />

// //       {/* Options */}
// //       <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
// //         {filtered.length > 0 ? (
// //           filtered.map((option) => {
// //             const isSelected = value.some(
// //               (v) => v.value === option.value
// //             );

// //             return (
// //               <div
// //                 key={option.value}
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   toggle(option.value);
// //                 }}
// //                 className={`
// //                   flex cursor-pointer items-center gap-3
// //                   rounded-lg px-3 py-2
// //                   transition-all duration-150
// //                   ${
// //                     isSelected
// //                       ? "bg-primary/10 border border-primary/20"
// //                       : "hover:bg-accent"
// //                   }
// //                 `}
// //               >
// //                 <Check
// //                   className={`h-4 w-4 shrink-0 transition-opacity ${
// //                     isSelected
// //                       ? "opacity-100 text-primary"
// //                       : "opacity-0"
// //                   }`}
// //                 />

// //                 <div className="min-w-0 flex-1">
// //                   <p className="truncate text-sm font-medium text-foreground">
// //                     {option.label}
// //                   </p>

// //                   <p className="truncate text-xs text-muted-foreground">
// //                     {option.email}
// //                   </p>
// //                 </div>
// //               </div>
// //             );
// //           })
// //         ) : (
// //           <div className="py-6 text-center">
// //             <p className="text-sm text-muted-foreground">
// //               No users found
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </DropdownMenuContent>
// //   </DropdownMenu>
// // );
// // };

// // export default MultiSelectDropdown;

// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { authAPI } from "../services/api";

// const MultiSelectDropdown = ({
//   value = [],
//   onChange,
//   placeholder = "Select Users",
// }) => {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await authAPI.getAllUsers({
//           page: 1,
//           limit: 100,
//           status: "active",
//         });

//         const users = res?.data?.users || [];

//         setOptions(
//           users.map((u) => ({
//             value: u._id,
//             label: u.username,
//             email: u.email,
//           }))
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (

// <Select
//   isMulti
//   options={options}
//   value={value}
//   onChange={(selected) => onChange?.(selected || [])}
//   placeholder={placeholder}
//   closeMenuOnSelect={false}
//   isClearable
//   getOptionLabel={(option) => option.label}
//   getOptionValue={(option) => option.value}
//   formatOptionLabel={(option) => (
//     <div className="flex flex-col">
//       <span className="font-medium">{option.label}</span>

//     </div>
//   )}
//   styles={{
//     control: (base, state) => ({
//       ...base,
//       minHeight: 40,
//       borderRadius: 12,
//       backgroundColor: "hsl(var(--background))",
//       borderColor: state.isFocused
//         ? "hsl(var(--ring))"
//         : "hsl(var(--border))",
//       color: "hsl(var(--foreground))",
//       boxShadow: state.isFocused
//         ? "0 0 0 2px hsl(var(--ring) / .2)"
//         : "none",
//       "&:hover": {
//         borderColor: "hsl(var(--ring))",
//       },
//     }),

//     valueContainer: (base) => ({
//       ...base,
//       padding: "2px 10px",
//     }),

//     input: (base) => ({
//       ...base,
//       color: "hsl(var(--foreground))",
//     }),

//     placeholder: (base) => ({
//       ...base,
//       color: "hsl(var(--muted-foreground))",
//     }),

//     singleValue: (base) => ({
//       ...base,
//       color: "hsl(var(--foreground))",
//     }),

//     menu: (base) => ({
//       ...base,
//       backgroundColor: "hsl(var(--popover))",
//       border: "1px solid hsl(var(--border))",
//       borderRadius: 12,
//       overflow: "hidden",
//       zIndex: 9999,
//     }),

//     menuList: (base) => ({
//       ...base,
//       padding: 6,
//       backgroundColor: "hsl(var(--popover))",
//     }),

//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "hsl(var(--primary) / .15)"
//         : state.isFocused
//         ? "hsl(var(--accent))"
//         : "transparent",
//       color: "hsl(var(--foreground))",
//       cursor: "pointer",
//       borderRadius: 8,
//       marginBottom: 2,
//       ":active": {
//         backgroundColor: "hsl(var(--primary) / .2)",
//       },
//     }),

//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: "hsl(var(--primary) / .12)",
//       borderRadius: 8,
//     }),

//     multiValueLabel: (base) => ({
//       ...base,
//       color: "hsl(var(--primary))",
//       fontWeight: 500,
//     }),

//     multiValueRemove: (base) => ({
//       ...base,
//       color: "hsl(var(--primary))",
//       cursor: "pointer",
//       ":hover": {
//         backgroundColor: "hsl(var(--primary))",
//         color: "hsl(var(--primary-foreground))",
//       },
//     }),

//     clearIndicator: (base) => ({
//       ...base,
//       color: "hsl(var(--muted-foreground))",
//       ":hover": {
//         color: "hsl(var(--foreground))",
//       },
//     }),

//     dropdownIndicator: (base) => ({
//       ...base,
//       color: "hsl(var(--muted-foreground))",
//       ":hover": {
//         color: "hsl(var(--foreground))",
//       },
//     }),

//     indicatorSeparator: (base) => ({
//       ...base,
//       backgroundColor: "hsl(var(--border))",
//     }),
//   }}
// />
//   );
// };

// export default MultiSelectDropdown;

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
const MultiSelectDropdown = ({
  value = [],
  onChange,
  placeholder = "Select Users",
  width = "100%",
}) => {
  const { user } = useAuth();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  // ================= FETCH USERS =================
  useEffect(() => {
    if (!user || initialized) return;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 100,
          status: "active",
        });
        const users = res?.data?.users || [];
        const formattedUsers = users.map((u) => ({
          value: u._id,
          label: u.username,
          email: u.email,
        }));
        setOptions(formattedUsers);
        // ================= DEFAULT LOGGED-IN USER =================
        if (value.length === 0 && user?._id) {
          const loggedInUser = formattedUsers.find(
            (item) => item.value === user._id,
          );
          if (loggedInUser) {
            onChange?.([loggedInUser]);
          }
        }
        setInitialized(true);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user, initialized, onChange, value]);
  return (
    <div style={{ width }}>
      {" "}
      <Select
        isMulti
        options={options}
        value={value}
        onChange={(selected) => onChange?.(selected || [])}
        placeholder={placeholder}
        closeMenuOnSelect={false}
        isClearable
        isLoading={loading}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        formatOptionLabel={(option) => (
          <div>
            {" "}
            <div className="font-medium">{option.label}</div>{" "}
            {/* {option.email && (
              <div className="text-xs text-muted-foreground">
                {" "}
                {option.email}{" "}
              </div>
            )}{" "} */}
          </div>
        )}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: 40,
            borderRadius: 12,
            backgroundColor: "hsl(var(--background))",
            borderColor: state.isFocused
              ? "hsl(var(--ring))"
              : "hsl(var(--border))",
            color: "hsl(var(--foreground))",
            boxShadow: state.isFocused
              ? "0 0 0 2px hsl(var(--ring) / .2)"
              : "none",
            "&:hover": { borderColor: "hsl(var(--ring))" },
          }),
          valueContainer: (base) => ({ ...base, padding: "2px 8px" }),
          input: (base) => ({ ...base, color: "hsl(var(--foreground))" }),
          placeholder: (base) => ({
            ...base,
            color: "hsl(var(--muted-foreground))",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "hsl(var(--primary) / .12)",
            borderRadius: 8,
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "hsl(var(--primary))",
            fontWeight: 500,
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "hsl(var(--primary))",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            overflow: "hidden",
            zIndex: 9999,
          }),
          menuList: (base) => ({
            ...base,
            padding: 6,
            backgroundColor: "hsl(var(--popover))",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
              ? "hsl(var(--accent))"
              : "transparent",
            color: "hsl(var(--foreground))",
            cursor: "pointer",
            borderRadius: 8,
            marginBottom: 2,
          }),
          clearIndicator: (base) => ({
            ...base,
            color: "hsl(var(--muted-foreground))",
            ":hover": { color: "hsl(var(--foreground))" },
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: "hsl(var(--muted-foreground))",
            ":hover": { color: "hsl(var(--foreground))" },
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: "hsl(var(--border))",
          }),
        }}
      />{" "}
    </div>
  );
};
export default MultiSelectDropdown;
