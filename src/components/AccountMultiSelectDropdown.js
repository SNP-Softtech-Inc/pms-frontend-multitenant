


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
import Select from "react-select";
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
const filteredOptions = options.filter(
  (option) => !value.some((v) => v.value === option.value)
);
  const clearSelection = () => onChange?.([]);
// return (
//   <div style={{ width }} className="mt-2">
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <div
//           className="
//             flex min-h-10 w-full cursor-pointer items-center justify-between
//             rounded-xl border border-border bg-background
//             px-3 py-2
//             transition-all duration-200
//             hover:border-primary/40
//             hover:bg-accent/40
//             focus-within:ring-2 focus-within:ring-ring
//           "
//         >
//           {/* Selected Values */}
//           <div className="flex flex-wrap gap-1.5">
//             {value.length > 0 ? (
//               value.map((item) => (
//                 <Badge
//                   key={item.value}
//                   className="
//                     flex items-center gap-1
//                     rounded-md
//                     bg-primary/10
//                     text-primary
//                     border border-primary/20
//                     hover:bg-primary/20
//                     transition-colors
//                     text-xs font-medium
//                   "
//                 >
//                   {item.label}

//                   <X
//                     className="
//                       h-3 w-3 cursor-pointer
//                       opacity-70 hover:opacity-100
//                     "
//                     onClick={(e) =>
//                       handleUnselect(e, item.value)
//                     }
//                   />
//                 </Badge>
//               ))
//             ) : (
//               <span className="text-sm text-muted-foreground">
//                 {placeholder}
//               </span>
//             )}
//           </div>

//           {/* Right Icon */}
//           <div className="flex items-center gap-2 text-muted-foreground">
//             <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-70" />
//           </div>
//         </div>
//       </PopoverTrigger>

//       <PopoverContent
//         align="start"
//         className="
//           p-3
//           border border-border
//           bg-popover
//           text-popover-foreground
//           shadow-xl
//           rounded-xl
//         "
//         style={{
//           width:
//             "var(--radix-popover-trigger-width)",
//         }}
//       >
//         <Command className="bg-transparent">
//           {/* Search */}
//           <CommandInput
//             placeholder="Search..."
//             className="
//               mb-3
//               border border-border
//               bg-background
//               text-foreground
//               placeholder:text-muted-foreground
//               focus-visible:ring-ring
//             "
//           />

//           {/* Options */}
//           <CommandList className="max-h-[300px] overflow-y-auto pr-1">
//             {loading ? (
//               <div className="flex items-center justify-center p-5">
//                 <Loader2 className="h-4 w-4 animate-spin text-primary" />
//               </div>
//             ) : (
//               <>
//                 <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
//                   No results found.
//                 </CommandEmpty>

//                 <CommandGroup className="space-y-1">
//                   {options.map((option) => {
//                     const isSelected =
//                       value.some(
//                         (v) =>
//                           v.value === option.value
//                       );

//                     return (
//                       <CommandItem
//                         key={option.value}
//                         onSelect={() =>
//                           handleSelect(
//                             option.value
//                           )
//                         }
//                         className={`
//                           flex cursor-pointer items-center gap-3
//                           rounded-lg px-3 py-2
//                           transition-all duration-150
//                           ${
//                             isSelected
//                               ? "bg-primary/10 border border-primary/20"
//                               : "hover:bg-accent"
//                           }
//                         `}
//                       >
//                         <Checkbox
//                           checked={isSelected}
//                           className="
//                             border-border
//                             data-[state=checked]:bg-primary
//                             data-[state=checked]:border-primary
//                           "
//                         />

//                         <span className="text-sm font-medium text-foreground">
//                           {option.label}
//                         </span>
//                       </CommandItem>
//                     );
//                   })}
//                 </CommandGroup>
//               </>
//             )}

//             {/* Clear Selection */}
//             {value.length > 0 && (
//               <>
//                 <div className="h-px bg-border my-2" />

//                 <CommandItem
//                   onSelect={clearSelection}
//                   className="
//                     justify-center
//                     rounded-lg
//                     py-2
//                     text-sm
//                     font-medium
//                     text-destructive
//                     cursor-pointer
//                     transition-colors
//                     hover:bg-destructive/10
//                     focus:bg-destructive/10
//                   "
//                 >
//                   Clear selection
//                 </CommandItem>
//               </>
//             )}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   </div>
// );
return (
  <div style={{ width }} className="mt-2">
    <Select
      isMulti
      isLoading={loading}
      options={filteredOptions}
      value={value}
      onChange={(selected) => onChange?.(selected || [])}
      placeholder={placeholder}
      closeMenuOnSelect={false}
      hideSelectedOptions
      isClearable
      noOptionsMessage={() => "No results found"}
      loadingMessage={() => "Loading..."}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
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
          "&:hover": {
            borderColor: "hsl(var(--ring))",
          },
        }),

        valueContainer: (base) => ({
          ...base,
          padding: "2px 8px",
        }),

        input: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),

        placeholder: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
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

        clearIndicator: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
          ":hover": {
            color: "hsl(var(--foreground))",
          },
        }),

        dropdownIndicator: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
          ":hover": {
            color: "hsl(var(--foreground))",
          },
        }),

        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--border))",
        }),
      }}
    />
  </div>
);
};

export default MultiSelectDropdown;