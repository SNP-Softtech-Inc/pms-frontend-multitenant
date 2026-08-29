import React, { useState, useEffect ,useRef,useCallback} from "react";
import Cookies from "js-cookie";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

import { accountsAPI,authAPI } from "../services/api";
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

// const SingleSelectDropdown = ({
//   value = null,
//   onChange,
//   options: propOptions,
//   placeholder = "Select an account",
//   width = "100%",
// }) => {
//   const { user } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [internalOptions, setInternalOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [initialized, setInitialized] = useState(false);
//  const [permissions, setPermissions] = useState(null);
//   const [permissionsLoading, setPermissionsLoading] = useState(true);
// // ================= FETCH PERMISSIONS =================
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       try {
//         setPermissionsLoading(true);

//         if (user?.role === "team_member") {
//           console.log("Fetching permissions for:", user.id);

//           const res = await authAPI.getSingleUser(user.id);

//           console.log("getSingleUser response:", res.data);

//           const userPermissions = res?.data?.user?.permissions;

//           console.log("User permissions:", userPermissions);

//           setPermissions(userPermissions || {});
//         } else {
//           // Admin / other roles
//           setPermissions({
//             manageAccounts: true,
//             manageTags: true,
//             manageOrganizers: true,
//             managePipelines: true,
//             assignTeamMates: true,
//             viewallAccounts: true,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching user permissions:", error);
//         setPermissions({});
//       } finally {
//         setPermissionsLoading(false);
//       }
//     };

//     if (user) {
//       fetchUserPermissions();
//     }
//   }, [user]);
//   const options = propOptions || internalOptions;

//   // // Fetch accounts if no options provided
//   // useEffect(() => {
//   //   if (!propOptions && !initialized && user) {
//   //     const fetchAccounts = async () => {
//   //       try {
//   //         setLoading(true);
//   //         let res;

//   //         if (user?.role === "team_member") {
//   //           res = await accountsAPI.getAccountsByTeamMember(true);
//   //         } else {
//   //           res = await accountsAPI.getAccountsList(true);
//   //         }

//   //         const list = res.data.accountlist || [];
//   //         const formatted = list.map((acc) => ({
//   //           value: acc._id,
//   //           label: acc.accountName,
//   //         }));

//   //         setInternalOptions(formatted);

//   //         // Set default from cookie if no value selected
//   //         if (!value) {
//   //           const accountIdFromCookie = Cookies.get("accountId");
//   //           if (accountIdFromCookie) {
//   //             const matched = formatted.find(
//   //               (acc) => acc.value === accountIdFromCookie
//   //             );
//   //             if (matched && onChange) {
//   //               onChange(matched);
//   //             }
//   //           }
//   //         }
//   //         setInitialized(true);
//   //       } catch (error) {
//   //         console.error("Error fetching accounts:", error);
//   //       } finally {
//   //         setLoading(false);
//   //       }
//   //     };
//   //     fetchAccounts();
//   //   }
//   // }, [propOptions, initialized, onChange, value, user]);
// useEffect(() => {
//   // Don't fetch accounts until user and permissions are available
//   if (
//     propOptions ||
//     initialized ||
//     !user ||
//     permissionsLoading
//   ) {
//     return;
//   }

//   const fetchAccounts = async () => {
//     try {
//       setLoading(true);

//       let res;

//       if (
//         user.role === "team_member" &&
//         permissions?.viewallAccounts !== true
//       ) {
//         // Team member can only see assigned accounts
//         res = await accountsAPI.getAccountsByTeamMember(true);
//       } else {
//         // Admin OR team member with viewallAccounts === true
//         res = await accountsAPI.getAccountsList(true);
//       }

//       const list = res.data.accountlist || [];

//       const formatted = list.map((acc) => ({
//         value: acc._id,
//         label: acc.accountName,
//       }));

//       setInternalOptions(formatted);

//       // Set default from cookie if no value selected
//       if (!value || value.length === 0) {
//         const accountIdFromCookie = Cookies.get("accountId");

//         if (accountIdFromCookie) {
//           const matched = formatted.find(
//             (acc) => acc.value === accountIdFromCookie
//           );

//           if (matched && onChange) {
//             onChange([matched]);
//           }
//         }
//       }

//       setInitialized(true);
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAccounts();
// }, [
//   propOptions,
//   initialized,
//   onChange,
//   value,
//   user,
//   permissions,
//   permissionsLoading,
// ]);
//   // Handler for single selection
//   const handleSelect = (selectedValue) => {
//     const selectedOption = options.find((opt) => opt.value === selectedValue);
//     onChange?.(selectedOption);
//     setOpen(false); // Close dropdown after selection
//   };

//   // Get selected label for display
//   const getSelectedLabel = () => {
//     if (!value) return null;
//     if (typeof value === "object" && value.label) return value.label;
//     const option = options.find((opt) => opt.value === value);
//     return option?.label || null;
//   };

//   const selectedLabel = getSelectedLabel();

//   return (
//   <div style={{ width }} className="mt-2">
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="
//             w-full justify-between
//             min-h-[40px] h-auto
//             p-2 rounded-[10px]
//             border border-border
//             bg-background
//             text-foreground
//             hover:bg-accent
//           "
//         >
//           <div className="flex flex-wrap gap-1">
//             {selectedLabel ? (
//               <span className="text-sm text-foreground">
//                 {selectedLabel}
//               </span>
//             ) : (
//               <span className="text-sm text-muted-foreground font-normal">
//                 {placeholder}
//               </span>
//             )}
//           </div>

//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent
//         className="
//           p-0
//           bg-popover
//           text-popover-foreground
//           border border-border
//           shadow-lg
//         "
//         style={{ width: "var(--radix-popover-trigger-width)" }}
//       >
//         <Command className="bg-popover">
//           <CommandInput
//             placeholder="Search account..."
//             className="text-sm"
//           />

//           <CommandList className="max-h-[300px]">
//             {loading ? (
//               <div className="flex items-center justify-center p-4">
//                 <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//               </div>
//             ) : (
//               <>
//                 <CommandEmpty className="text-muted-foreground text-sm">
//                   No accounts found.
//                 </CommandEmpty>

//                 <CommandGroup>
//                   {options.map((option) => {
//                     const isSelected = value
//                       ? typeof value === "object"
//                         ? value.value === option.value
//                         : value === option.value
//                       : false;

//                     return (
//                       <CommandItem
//                         key={option.value}
//                         onSelect={() => handleSelect(option.value)}
//                         className="
//                           flex items-center justify-between
//                           cursor-pointer
//                           text-foreground
//                           hover:bg-accent
//                           rounded-md
//                         "
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
//   // return (
//   //   <div style={{ width }} className="mt-2">
//   //     <Popover open={open} onOpenChange={setOpen}>
//   //       <PopoverTrigger asChild>
//   //         <Button
//   //           variant="outline"
//   //           role="combobox"
//   //           aria-expanded={open}
//   //           className="w-full justify-between min-h-[40px] h-auto p-2 rounded-[10px] border-[#ccc] bg-white hover:bg-white"
//   //         >
//   //           <div className="flex flex-wrap gap-1">
//   //             {selectedLabel ? (
//   //               <span className="text-sm">{selectedLabel}</span>
//   //             ) : (
//   //               <span className="text-muted-foreground font-normal">
//   //                 {placeholder}
//   //               </span>
//   //             )}
//   //           </div>
//   //           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//   //         </Button>
//   //       </PopoverTrigger>

//   //       <PopoverContent 
//   //         className="p-0" 
//   //         style={{ width: "var(--radix-popover-trigger-width)" }}
//   //       >
//   //         <Command>
//   //           <CommandInput placeholder="Search account..." />
//   //           <CommandList className="max-h-[300px]">
//   //             {loading ? (
//   //               <div className="flex items-center justify-center p-4">
//   //                 <Loader2 className="h-4 w-4 animate-spin" />
//   //               </div>
//   //             ) : (
//   //               <>
//   //                 <CommandEmpty>No accounts found.</CommandEmpty>
//   //                 <CommandGroup>
//   //                   {options.map((option) => {
//   //                     const isSelected = value 
//   //                       ? (typeof value === "object" 
//   //                         ? value.value === option.value 
//   //                         : value === option.value)
//   //                       : false;
                      
//   //                     return (
//   //                       <CommandItem
//   //                         key={option.value}
//   //                         onSelect={() => handleSelect(option.value)}
//   //                         className="flex items-center justify-between cursor-pointer"
//   //                       >
//   //                         <span>{option.label}</span>
//   //                         {isSelected && (
//   //                           <svg
//   //                             className="h-4 w-4 text-primary"
//   //                             fill="none"
//   //                             stroke="currentColor"
//   //                             viewBox="0 0 24 24"
//   //                           >
//   //                             <path
//   //                               strokeLinecap="round"
//   //                               strokeLinejoin="round"
//   //                               strokeWidth={2}
//   //                               d="M5 13l4 4L19 7"
//   //                             />
//   //                           </svg>
//   //                         )}
//   //                       </CommandItem>
//   //                     );
//   //                   })}
//   //                 </CommandGroup>
//   //               </>
//   //             )}
//   //           </CommandList>
//   //         </Command>
//   //       </PopoverContent>
//   //     </Popover>
//   //   </div>
//   // );
// };
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
  const [permissions, setPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  const options = propOptions || internalOptions;

  // Keep a ref to the latest onChange/value so the fetch effect
  // doesn't need them in its dependency array (avoids re-running
  // just because the parent passed a fresh inline function).
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  }, [onChange, value]);

  // ================= FETCH PERMISSIONS =================
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        setPermissionsLoading(true);

        if (user?.role === "team_member") {
          const res = await authAPI.getSingleUser(user.id);
          const userPermissions = res?.data?.user?.permissions;
          setPermissions(userPermissions || {});
        } else {
          // Admin / other roles
          setPermissions({
            manageAccounts: true,
            manageTags: true,
            manageOrganizers: true,
            managePipelines: true,
            assignTeamMates: true,
            viewallAccounts: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        setPermissions({});
      } finally {
        setPermissionsLoading(false);
      }
    };

    if (user) {
      fetchUserPermissions();
    }
    // Only re-run when the user identity actually changes.
  }, [user?.id, user?.role]);

  // ================= FETCH ACCOUNTS =================
  useEffect(() => {
    // Don't fetch accounts until user and permissions are available
    if (propOptions || initialized || !user || permissionsLoading) {
      return;
    }

    const fetchAccounts = async () => {
      try {
        setLoading(true);

        let res;

        if (
          user.role === "team_member" &&
          permissions?.viewallAccounts !== true
        ) {
          // Team member can only see assigned accounts
          res = await accountsAPI.getAccountsByTeamMember(true);
        } else {
          // Admin OR team member with viewallAccounts === true
          res = await accountsAPI.getAccountsList(true);
        }

        const list = res.data.accountlist || [];

        const formatted = list.map((acc) => ({
          value: acc._id,
          label: acc.accountName,
        }));

        setInternalOptions(formatted);

        // Set default from cookie if no value selected.
        // NOTE: onChange expects a single { value, label } option object,
        // same shape as handleSelect below — do NOT wrap it in an array.
        const currentValue = valueRef.current;
        const hasValue = Array.isArray(currentValue)
          ? currentValue.length > 0
          : Boolean(currentValue);

        if (!hasValue) {
          const accountIdFromCookie = Cookies.get("accountId");

          if (accountIdFromCookie) {
            const matched = formatted.find(
              (acc) => acc.value === accountIdFromCookie
            );

            if (matched && onChangeRef.current) {
              onChangeRef.current(matched);
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
  }, [propOptions, initialized, user, permissions, permissionsLoading]);

  // Handler for single selection
  const handleSelect = useCallback(
    (selectedValue) => {
      const selectedOption = options.find((opt) => opt.value === selectedValue);
      onChange?.(selectedOption);
      setOpen(false); // Close dropdown after selection
    },
    [options, onChange]
  );

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
              disabled={loading}
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
};
export default SingleSelectDropdown;