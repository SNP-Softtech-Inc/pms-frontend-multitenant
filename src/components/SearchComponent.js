// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { Search, X, Loader2, User, Building2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { accountsAPI, contactsAPI } from "../services/api";
// import NewContactDrawer from "../pages/Account-Contact/NewContactDrawer";

// // ---------------- Debounce Hook ----------------
// const useDebounce = (value, delay = 400) => {
//   const [debounced, setDebounced] = useState(value);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// };

// const FILTER_TYPES = ["All", "Accounts", "Contacts"];

// const SearchComponent = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const containerRef = useRef(null);

//   const [searchQuery, setSearchQuery] = useState("");
//   const debouncedQuery = useDebounce(searchQuery);

//   const [loading, setLoading] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [filterType, setFilterType] = useState("All");
//   const [isFocused, setIsFocused] = useState(false);

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [mode, setMode] = useState("create");

//   const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

//   // ---------------- Outside Click ----------------
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setIsFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ---------------- Search API ----------------
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!debouncedQuery) {
//         setOptions([]);
//         return;
//       }

//       setLoading(true);

//       try {
//         const isTeamMember = user?.role === "team_member";

//         const accountPromise = isTeamMember
//           ? accountsAPI.getAccountsByTeamMemberName({
//               active: true,
//               search: debouncedQuery,
//             })
//           : accountsAPI.getAccountNamesByStatus({
//               active: true,
//               search: debouncedQuery,
//             });

//         let combined = [];

//         if (isEmail(debouncedQuery)) {
//           const [accountsRes, contactsRes] = await Promise.all([
//             accountPromise,
//             contactsAPI.getContactsByEmail(debouncedQuery),
//           ]);

//           const accounts = accountsRes.data.accountlist || [];
//           const contacts = contactsRes.data.data || [];

//           combined = [
//             ...accounts.map((a) => ({
//               id: a._id,
//               label: a.accountName,
//               subLabel: a.emails?.join(", ") || "No Email",
//               type: "Accounts",
//             })),
//             ...contacts.map((c) => ({
//               id: c._id,
//               label: c.contactName,
//               subLabel: c.email,
//               type: "Contacts",
//             })),
//           ];
//         } else {
//           const [accountsRes, contactsRes] = await Promise.all([
//             accountPromise,
//             contactsAPI.getContactNames({ search: debouncedQuery }),
//           ]);

//           const accounts = accountsRes.data.accountlist || [];
//           const contacts = contactsRes.data.data || [];
//           console.log("Accounts:", accounts);
//           combined = [
//             ...accounts.map((a) => ({
//               id: a._id,
//               label: a.accountName,
//               subLabel: a.emails?.join(", ") || "No Email",
//               type: "Accounts",
//             })),
//             ...contacts.map((c) => ({
//               id: c._id,
//               label: c.contactName,
//               subLabel: c.email || "No Email",
//               type: "Contacts",
//             })),
//           ];
//         }

//         setOptions(combined);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [debouncedQuery]);

//   // ---------------- Filter ----------------
//   const filteredOptions = useMemo(() => {
//     return options.filter((o) => filterType === "All" || o.type === filterType);
//   }, [options, filterType]);

//   const typeCount = (type) =>
//     options.filter((o) => type === "All" || o.type === type).length;

//   // ---------------- Click ----------------
//   const handleClick = async (option) => {
//     console.log("Clicked option:", option);
//     if (option.type === "Accounts") {
//       navigate(`/clients/accounts/accountsdash/overview/${option.id}`);
//       setSearchQuery("");
//       return;
//     }

//     const res = await contactsAPI.getContactById(option.id);
//     setSelectedContact(res.data.data);
//     setDrawerOpen(true);
//     setMode("edit");

//     setSearchQuery("");
//     setOptions([]);
//     setIsFocused(false);
//   };

//   const showDropdown = isFocused && searchQuery;

//   return (
//     <>
//       <div ref={containerRef} className="relative w-80">
//         <div
//           className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-background shadow-sm transition ${
//             isFocused ? "border-primary ring-2 ring-primary/20" : "border-input"
//           }`}
//         >
//           {loading ? (
//             <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//           ) : (
//             <Search className="h-4 w-4 text-muted-foreground" />
//           )}

//           <input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onFocus={() => setIsFocused(true)}
//             placeholder="Search accounts & contacts..."
//             className="flex-1 bg-transparent text-sm outline-none"
//           />

//           {searchQuery && (
//             <button onClick={() => setSearchQuery("")}>
//               <X className="h-4 w-4 text-muted-foreground" />
//             </button>
//           )}
//         </div>

//         {showDropdown && (
//           <div className="absolute top-full mt-2 w-full rounded-xl border bg-popover shadow-xl z-50 overflow-hidden">
//             <div className="flex gap-2 p-2 border-b">
//               {FILTER_TYPES.map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => setFilterType(type)}
//                   className={`px-3 py-1 rounded-md text-xs ${
//                     filterType === type
//                       ? "bg-primary text-white"
//                       : "text-muted-foreground hover:bg-accent"
//                   }`}
//                 >
//                   {type} ({typeCount(type)})
//                 </button>
//               ))}
//             </div>

//             <div className="max-h-80 overflow-y-auto">
//               {filteredOptions.length === 0 ? (
//                 <p className="text-center text-sm text-muted-foreground py-6">
//                   No results found
//                 </p>
//               ) : (
//                 filteredOptions.map((opt) => (
//                   <button
//                     key={opt.id}
//                     onClick={() => handleClick(opt)}
//                     className="flex w-full items-center gap-3 px-3 py-2 hover:bg-accent"
//                   >
//                     <div
//                       className={`h-8 w-8 flex items-center justify-center rounded-lg text-white ${
//                         opt.type === "Accounts" ? "bg-primary" : "bg-green-500"
//                       }`}
//                     >
//                       {opt.type === "Accounts" ? (
//                         <Building2 size={16} />
//                       ) : (
//                         <User size={16} />
//                       )}
//                     </div>

//                     <div className="flex-1 text-left">
//                       <p className="text-sm font-medium">{opt.label}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {opt.subLabel}
//                       </p>
//                     </div>

//                     <span
//                       className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${opt.type === "Accounts" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"}`}
//                     >
//                       {opt.type === "Accounts" ? "Account" : "Contact"}
//                     </span>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Drawer */}
//       <NewContactDrawer
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         selectedContact={selectedContact}
//         mode={mode}
//       />
//     </>
//   );
// };

// export default SearchComponent;

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, Loader2, User, Building2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { accountsAPI, contactsAPI } from "../services/api";
import NewContactDrawer from "../pages/Account-Contact/NewContactDrawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

// ---------------- Debounce Hook ----------------
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// ---------------- Local Storage Helpers ----------------
const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 5;

const getRecentSearches = () => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentSearch = (item) => {
  try {
    const recent = getRecentSearches();
    // Remove duplicate if exists
    const filtered = recent.filter((r) => r.id !== item.id);
    // Add new item at the beginning
    const updated = [item, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

const removeRecentSearch = (id) => {
  try {
    const recent = getRecentSearches();
    const updated = recent.filter((r) => r.id !== id);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

const FILTER_TYPES = ["All", "Accounts", "Contacts"];

const SearchComponent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mode, setMode] = useState("create");

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  // ---------------- Search API ----------------
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery) {
        setOptions([]);
        return;
      }

      setLoading(true);

      try {
        const isTeamMember = user?.role === "team_member";

        const accountPromise = isTeamMember
          ? accountsAPI.getAccountsByTeamMemberName({
              active: true,
              search: debouncedQuery,
            })
          : accountsAPI.getAccountNamesByStatus({
              active: true,
              search: debouncedQuery,
            });

        let combined = [];

        if (isEmail(debouncedQuery)) {
          const [accountsRes, contactsRes] = await Promise.all([
            accountPromise,
            contactsAPI.getContactsByEmail(debouncedQuery),
          ]);

          const accounts = accountsRes.data.accountlist || [];
          const contacts = contactsRes.data.data || [];

          combined = [
            ...accounts.map((a) => ({
              id: a._id,
              label: a.accountName,
              subLabel: a.emails?.join(", ") || "No Email",
              type: "Accounts",
              timestamp: Date.now(),
            })),
            ...contacts.map((c) => ({
              id: c._id,
              label: c.contactName,
              subLabel: c.email,
              type: "Contacts",
              timestamp: Date.now(),
            })),
          ];
        } else {
          const [accountsRes, contactsRes] = await Promise.all([
            accountPromise,
            contactsAPI.getContactNames({ search: debouncedQuery }),
          ]);

          const accounts = accountsRes.data.accountlist || [];
          const contacts = contactsRes.data.data || [];

          combined = [
            ...accounts.map((a) => ({
              id: a._id,
              label: a.accountName,
              subLabel: a.emails?.join(", ") || "No Email",
              type: "Accounts",
              timestamp: Date.now(),
            })),
            ...contacts.map((c) => ({
              id: c._id,
              label: c.contactName,
              subLabel: c.email || "No Email",
              type: "Contacts",
              timestamp: Date.now(),
            })),
          ];
        }

        setOptions(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery, user?.role]);

  // ---------------- Filter ----------------
  const filteredOptions = useMemo(() => {
    return options.filter((o) => filterType === "All" || o.type === filterType);
  }, [options, filterType]);

  // ---------------- Click Handler ----------------
  const handleClick = async (option) => {
    console.log("Clicked option:", option);
    
    // Add to recent searches
    const updatedRecent = addRecentSearch(option);
    setRecentSearches(updatedRecent);

    if (option.type === "Accounts") {
      navigate(`/clients/accounts/accountsdash/overview/${option.id}`);
      setSearchQuery("");
      setOpen(false);
      return;
    }

    const res = await contactsAPI.getContactById(option.id);
    setSelectedContact(res.data.data);
    setDrawerOpen(true);
    setMode("edit");

    setSearchQuery("");
    setOptions([]);
    setOpen(false);
  };

  const handleRemoveRecent = (e, id) => {
    e.stopPropagation();
    const updated = removeRecentSearch(id);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
    }
  };

  // Determine if we should show recent searches
  const showRecentSearches = open && !searchQuery && recentSearches.length > 0;
  const showSearchResults = open && searchQuery && filteredOptions.length > 0;
  const showEmptyState = open && searchQuery && filteredOptions.length === 0 && !loading;

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-80 justify-between bg-background hover:bg-background"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Search accounts & contacts...
              </span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search accounts & contacts..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />

            {/* Filter Tabs */}
            {searchQuery && (
              <div className="flex gap-1 border-b px-2 py-1.5">
                {FILTER_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setFilterType(type)}
                  >
                    {type}
                    {type !== "All" && ` (${options.filter(o => o.type === type).length})`}
                  </Button>
                ))}
              </div>
            )}

            <CommandList>
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Recent Searches */}
              {showRecentSearches && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleClick(item)}
                      className="flex items-center gap-3"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm">{item.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.subLabel}
                          </span>
                        </div>
                        <Badge
                          variant={item.type === "Accounts" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {item.type === "Accounts" ? "Account" : "Contact"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleRemoveRecent(e, item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CommandItem>
                  ))}
                  <div className="flex justify-end px-2 py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={handleClearAllRecent}
                    >
                      Clear all
                    </Button>
                  </div>
                </CommandGroup>
              )}

              {/* Search Results */}
              {showSearchResults && (
                <CommandGroup heading="Search Results">
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => handleClick(option)}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          option.type === "Accounts"
                            ? "bg-primary/10 text-primary"
                            : "bg-green-500/10 text-green-500"
                        )}
                      >
                        {option.type === "Accounts" ? (
                          <Building2 className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.subLabel}
                        </span>
                      </div>
                      <Badge
                        variant={option.type === "Accounts" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {option.type === "Accounts" ? "Account" : "Contact"}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Empty State */}
              {showEmptyState && (
                <CommandEmpty>
                  <div className="flex flex-col items-center justify-center py-6">
                    <Search className="h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm font-medium">No results found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Drawer */}
      <NewContactDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedContact={selectedContact}
        mode={mode}
      />
    </>
  );
};

export default SearchComponent;