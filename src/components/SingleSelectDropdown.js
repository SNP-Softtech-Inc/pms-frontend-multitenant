import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

import { accountsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Shadcn Components
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const SingleSelectDropdown = ({
  value = null,
  onChange,
  options: propOptions,
  placeholder = "Select an account",
  width = "100%",
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const options = propOptions || internalOptions;

  // Fetch accounts if no options provided
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

          // Set default from cookie if no value selected
          if (!value) {
            const accountIdFromCookie = Cookies.get("accountId");
            if (accountIdFromCookie) {
              const matched = formatted.find(
                (acc) => acc.value === accountIdFromCookie
              );
              if (matched && onChange) {
                onChange(matched);
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

  // Handler for single selection
  const handleSelect = (selectedValue) => {
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    onChange?.(selectedOption);
    setOpen(false); // Close dropdown after selection
  };

  // Get selected label for display
  const getSelectedLabel = () => {
    if (!value) return null;
    if (typeof value === "object" && value.label) return value.label;
    const option = options.find((opt) => opt.value === value);
    return option?.label || null;
  };

  const selectedLabel = getSelectedLabel();

  return (
  <div style={{ width }} className="mt-2">
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="
            w-full justify-between
            min-h-[40px] h-auto
            p-2 rounded-[10px]
            border border-border
            bg-background
            text-foreground
            hover:bg-accent
          "
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabel ? (
              <span className="text-sm text-foreground">
                {selectedLabel}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground font-normal">
                {placeholder}
              </span>
            )}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="
          p-0
          bg-popover
          text-popover-foreground
          border border-border
          shadow-lg
        "
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command className="bg-popover">
          <CommandInput
            placeholder="Search account..."
            className="text-sm"
          />

          <CommandList className="max-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty className="text-muted-foreground text-sm">
                  No accounts found.
                </CommandEmpty>

                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = value
                      ? typeof value === "object"
                        ? value.value === option.value
                        : value === option.value
                      : false;

                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelect(option.value)}
                        className="
                          flex items-center justify-between
                          cursor-pointer
                          text-foreground
                          hover:bg-accent
                          rounded-md
                        "
                      >
                        <span>{option.label}</span>

                        {isSelected && (
                          <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
);
  // return (
  //   <div style={{ width }} className="mt-2">
  //     <Popover open={open} onOpenChange={setOpen}>
  //       <PopoverTrigger asChild>
  //         <Button
  //           variant="outline"
  //           role="combobox"
  //           aria-expanded={open}
  //           className="w-full justify-between min-h-[40px] h-auto p-2 rounded-[10px] border-[#ccc] bg-white hover:bg-white"
  //         >
  //           <div className="flex flex-wrap gap-1">
  //             {selectedLabel ? (
  //               <span className="text-sm">{selectedLabel}</span>
  //             ) : (
  //               <span className="text-muted-foreground font-normal">
  //                 {placeholder}
  //               </span>
  //             )}
  //           </div>
  //           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  //         </Button>
  //       </PopoverTrigger>

  //       <PopoverContent 
  //         className="p-0" 
  //         style={{ width: "var(--radix-popover-trigger-width)" }}
  //       >
  //         <Command>
  //           <CommandInput placeholder="Search account..." />
  //           <CommandList className="max-h-[300px]">
  //             {loading ? (
  //               <div className="flex items-center justify-center p-4">
  //                 <Loader2 className="h-4 w-4 animate-spin" />
  //               </div>
  //             ) : (
  //               <>
  //                 <CommandEmpty>No accounts found.</CommandEmpty>
  //                 <CommandGroup>
  //                   {options.map((option) => {
  //                     const isSelected = value 
  //                       ? (typeof value === "object" 
  //                         ? value.value === option.value 
  //                         : value === option.value)
  //                       : false;
                      
  //                     return (
  //                       <CommandItem
  //                         key={option.value}
  //                         onSelect={() => handleSelect(option.value)}
  //                         className="flex items-center justify-between cursor-pointer"
  //                       >
  //                         <span>{option.label}</span>
  //                         {isSelected && (
  //                           <svg
  //                             className="h-4 w-4 text-primary"
  //                             fill="none"
  //                             stroke="currentColor"
  //                             viewBox="0 0 24 24"
  //                           >
  //                             <path
  //                               strokeLinecap="round"
  //                               strokeLinejoin="round"
  //                               strokeWidth={2}
  //                               d="M5 13l4 4L19 7"
  //                             />
  //                           </svg>
  //                         )}
  //                       </CommandItem>
  //                     );
  //                   })}
  //                 </CommandGroup>
  //               </>
  //             )}
  //           </CommandList>
  //         </Command>
  //       </PopoverContent>
  //     </Popover>
  //   </div>
  // );
};

export default SingleSelectDropdown;