/* ─── AccountTable — @tanstack/react-table + shadcn DataTable ─── */
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Mail,
  Briefcase,
  Users,
  Tag,
  Archive,
  RotateCcw,
  Trash2,
  X,
  UserSearch,
  AtSign,
  Building2,
  UserCog,
  TagsIcon,
} from "lucide-react";
import { useToastContext } from "../../context/ToastContext";
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { accountsAPI, authAPI } from "../../services/api";

// Components
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import TeamMemberMultiSelectDropDown from "../../components/MultiSelectDropdown";
import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";
import ManageTags from "../BulkActions/ManageTags";
import ManageTeams from "../BulkActions/ManageTeams";
import ManageContactSettings from "../BulkActions/ManageContactSettings";
import SendOrganizer from "../BulkActions/SendOrganizer";
import SendEmail from "../BulkActions/SendEmail";
import JobDrawer from "../../pages/Workflow/JobDrawer";

import { cn } from "../../lib/utils";

// ========== Helper Components ==========
function TagPills({ tags }) {
  if (!tags?.length)
    return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tags.slice(0, 2).map((t) => (
        <span
          key={t._id}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium truncate max-w-[110px]"
          style={{ backgroundColor: t.tagColour, color: "#fff" }}
        >
          {t.tagName}
        </span>
      ))}
      {tags.length > 2 && (
        <span
          title={tags
            .slice(2)
            .map((t) => t.tagName)
            .join(", ")}
          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border cursor-default"
        >
          +{tags.length - 2}
        </span>
      )}
    </div>
  );
}

// function MemberPills({ members }) {
//   if (!members?.length) return <span className="text-muted-foreground text-xs">—</span>;
//   const first = members[0];
//   return (
//     <div className="flex items-center gap-1">
//       <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 truncate max-w-[110px]">
//         {first.username}
//       </span>
//       {members.length > 1 && (
//         <span
//           title={members.slice(1).map((m) => m.username).join(", ")}
//           className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border"
//         >
//           +{members.length - 1}
//         </span>
//       )}
//     </div>
//   );
// }

function MemberPills({ members }) {
  if (!members?.length) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {members.slice(0, 3).map((member, index) => (
          <div
            key={member._id || index}
            title={member.username}
            className="h-7 w-7 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-semibold shadow-sm"
          >
            {member.username?.charAt(0)?.toUpperCase()}
          </div>
        ))}
      </div>

      {members.length > 3 && (
        <div
          title={members
            .slice(3)
            .map((m) => m.username)
            .join(", ")}
          className="ml-1 h-7 w-7 rounded-full border-2 border-background bg-muted text-muted-foreground flex items-center justify-center text-[11px] font-medium"
        >
          +{members.length - 3}
        </div>
      )}
    </div>
  );
}

function BulkActionBtn({
  label,
  icon: Icon,
  onClick,
  disabled,
  variant = "default",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "destructive"
          ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ========== Main Component ==========
const AccountTable = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();
  // Refs for bulk actions
  const manageTagsRef = useRef();
  const manageTeamRef = useRef();
  const sendOrganizerRef = useRef();
  const sendEmailRef = useRef();
  const manageSettingsRef = useRef();

  // State
  const [filterStatus, setFilterStatus] = useState("active");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  // const [permissions, setPermissions] = useState({});
const [permissions, setPermissions] = useState(null);
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bulkDrawerType, setBulkDrawerType] = useState(null);
  const [jobDrawerOpen, setJobDrawerOpen] = useState(false);

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Filters
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    accountName: "",
    type: "",
    teamMember: [],
    tags: [],
    email: "",
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        if (user?.role === "team_member") {
          const res = await authAPI.getSingleUser(user.id);
          setPermissions(res.data.user.permissions);
          console.log("gets permissions by the user logged",res.data.user.permissions)
        } else {
          setPermissions({
            manageAccounts: true,
            manageTags: true,
            manageOrganizers: true,
            managePipelines: true,
            assignTeamMates: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };
    fetchUserPermissions();
  }, [user]);

  // Fetch accounts using React Query
  // const { data: accountList = [], isLoading: loading } = useQuery({
  //   queryKey: ["accounts", filterStatus, user?.role],
  //   queryFn: async () => {
  //     const isActive = filterStatus === "active";
  //     let res;
  //     if (user?.role === "team_member") {
  //       res = await accountsAPI.getAccountsByTeamMember(isActive);
  //     } else {
  //       res = await accountsAPI.getAccountsList(isActive);
  //       console.log("Fetched accounts:", res.data.accountlist);
  //     }
  //     return res.data.accountlist || [];
  //   },
  //   enabled: !!user,
  // });
// Fetch accounts using React Query
const { data: accountList = [], isLoading: loading } = useQuery({
  queryKey: [
    "accounts",
    filterStatus,
    user?.role,
    permissions?.viewallAccounts,
  ],
  queryFn: async () => {
    const isActive = filterStatus === "active";
    let res;

    console.log("Role:", user?.role);
    console.log("Permission:", permissions?.viewallAccounts);

    if (
      user?.role === "team_member" &&
      !permissions?.viewallAccounts
    ) {
      res = await accountsAPI.getAccountsByTeamMember(isActive);
    } else {
      res = await accountsAPI.getAccountsList(isActive);
    }

    return res.data.accountlist || [];
  },
  enabled:
    !!user &&
    (user.role !== "team_member" || permissions !== null),
});  // Extract unique tags from accounts
  useEffect(() => {
    const tags = [
      ...new Map(
        accountList
          .flatMap((a) => a.tags || [])
          .map((tag) => [
            tag._id,
            {
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            },
          ]),
      ).values(),
    ];
    setUniqueTags(tags);
  }, [accountList]);

  // Filter accounts based on filters and global search
  const filteredData = useMemo(() => {
    let data = [...accountList];

    // Global filter search
    if (globalFilter) {
      const searchLower = globalFilter.toLowerCase();
      data = data.filter(
        (account) =>
          account.accountName?.toLowerCase().includes(searchLower) ||
          account.clientType?.toLowerCase().includes(searchLower) ||
          account.companyName?.toLowerCase().includes(searchLower) ||
          account.tags?.some((t) =>
            t.tagName?.toLowerCase().includes(searchLower),
          ) ||
          account.teamMember?.some((tm) =>
            tm.username?.toLowerCase().includes(searchLower),
          ) ||
          account.contacts?.some((c) =>
            c.contact?.email?.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Column filters
    if (filters.accountName) {
      data = data.filter((a) =>
        a.accountName
          ?.toLowerCase()
          .includes(filters.accountName.toLowerCase()),
      );
    }
    if (filters.email) {
      data = data.filter((a) =>
        a.contacts?.some((c) =>
          c.contact?.email?.toLowerCase().includes(filters.email.toLowerCase()),
        ),
      );
    }
    if (filters.type) {
      data = data.filter((a) => a.clientType === filters.type);
    }
    if (filters.teamMember.length) {
      const ids = filters.teamMember.map((t) => t.value);
      data = data.filter((a) =>
        a.teamMember?.some((tm) => ids.includes(tm._id)),
      );
    }
    if (filters.tags.length) {
      const ids = filters.tags.map((t) => t.value);
      data = data.filter((a) => a.tags?.some((t) => ids.includes(t._id)));
    }

    return data;
  }, [accountList, filters, globalFilter]);

  // Cookie sync
  const syncCookies = (ids) => {
    if (ids.length > 0) {
      const accs = ids
        .map((id) => {
          const a = accountList.find((x) => x._id === id);
          return a ? { id: a._id, name: a.accountName } : null;
        })
        .filter(Boolean);

      Cookies.set("selectedAccounts", JSON.stringify(accs), { path: "/" });
      Cookies.set("accountId", accs[accs.length - 1].id, { path: "/" });
      Cookies.set("accountName", accs[accs.length - 1].name, { path: "/" });
    } else {
      Cookies.remove("selectedAccounts", { path: "/" });
      Cookies.remove("accountId", { path: "/" });
      Cookies.remove("accountName", { path: "/" });
    }
  };

  const handleRowSelectionChange = (rowSel) => {
    const ids = Object.keys(rowSel).filter((k) => rowSel[k]);
    setSelectedIds(ids);
    syncCookies(ids);
  };

  // Bulk actions
  const handleArchive = async () => {
    try {
      await accountsAPI.updateAccountActiveStatus({
        ids: selectedIds,
        active: false,
      });
      showToast({
        title: "Accounts archived successfully",
        type: "success",
      });
      setSelectedIds([]);
      queryClient.invalidateQueries(["accounts"]);
      syncCookies([]);
    } catch {
      showToast({
        title: "Failed to archive accounts",
        type: "error",
      });
    }
  };

  const handleActivate = async () => {
    try {
      await accountsAPI.updateAccountActiveStatus({
        ids: selectedIds,
        active: true,
      });
      showToast({
        title: "Accounts activated successfully",
        type: "success",
      });
      setSelectedIds([]);
      queryClient.invalidateQueries(["accounts"]);
      syncCookies([]);
    } catch {
      showToast({
        title: "Failed to activate accounts",
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;
    try {
      await accountsAPI.deleteMultipleAccounts({ accountIds: selectedIds });
      showToast({
        title: "Accounts deleted successfully",
        type: "success",
      });
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
      setConfirmText("");
      queryClient.invalidateQueries(["accounts"]);
      syncCookies([]);
    } catch {
      showToast({
        title: "Failed to delete accounts",
        type: "error",
      });
    }
  };

  const openBulkDrawer = (type) => {
    setBulkDrawerType(type);
    setIsDrawerOpen(true);
  };

  const handleBulkDrawerClose = () => {
    setIsDrawerOpen(false);
    setBulkDrawerType(null);
    queryClient.invalidateQueries(["accounts"]);
  };

  const renderBulkContent = () => {
    switch (bulkDrawerType) {
      case "tags":
        return (
          <ManageTags
            ref={manageTagsRef}
            selectedAccounts={selectedIds}
            onClose={handleBulkDrawerClose}
            fetchData={() => queryClient.invalidateQueries(["accounts"])}
          />
        );
      case "organizer":
        return (
          <SendOrganizer
            ref={sendOrganizerRef}
            selectedAccounts={selectedIds}
            onClose={handleBulkDrawerClose}
            fetchData={() => queryClient.invalidateQueries(["accounts"])}
          />
        );
      case "team":
        return (
          <ManageTeams
            ref={manageTeamRef}
            selectedAccounts={selectedIds}
            onClose={handleBulkDrawerClose}
            fetchData={() => queryClient.invalidateQueries(["accounts"])}
          />
        );
      case "email":
        return (
          <SendEmail
            ref={sendEmailRef}
            selectedAccounts={selectedIds}
            onClose={handleBulkDrawerClose}
            fetchData={() => queryClient.invalidateQueries(["accounts"])}
          />
        );
      case "settings":
        return (
          <ManageContactSettings
            ref={manageSettingsRef}
            selectedAccounts={selectedIds}
            accountList={accountList}
            onClose={handleBulkDrawerClose}
            fetchData={() => queryClient.invalidateQueries(["accounts"])}
          />
        );
      default:
        return null;
    }
  };

  const handleBulkSave = () => {
    if (bulkDrawerType === "team") manageTeamRef.current?.submit();
    if (bulkDrawerType === "tags") manageTagsRef.current?.submit();
    if (bulkDrawerType === "settings") manageSettingsRef.current?.submit();
    if (bulkDrawerType === "organizer") sendOrganizerRef.current?.submit();
    if (bulkDrawerType === "email") sendEmailRef.current?.submit();
  };

  // Column definitions
  const columns = useMemo(
    () => [
      {
        accessorKey: "importId",
        header: "Code",
        size: 80,
        cell: ({ getValue }) => {
          const v = getValue();
          return v ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
              {v}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          );
        },
      },
      {
        accessorKey: "accountName",
        header: "Account Name",
        size: 220,
        cell: ({ row, getValue }) => (
          <Link
            to={`/clients/accounts/accountsdash/overview/${row.original._id}`}
            className="text-sm font-medium text-primary hover:text-primary/80 no-underline transition-colors truncate block max-w-[200px]"
          >
            {getValue() || "—"}
          </Link>
        ),
      },
      {
        accessorKey: "clientType",
        header: "Type",
        size: 110,
        cell: ({ getValue }) => {
          const v = getValue();
          if (!v)
            return <span className="text-muted-foreground text-xs">—</span>;
          const color =
            v === "Individual"
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
              : v === "Company"
                ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300"
                : "bg-muted text-muted-foreground border-border";
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${color}`}
            >
              {v}
            </span>
          );
        },
      },
      {
        accessorKey: "companyName",
        header: "Company",
        size: 160,
        cell: ({ getValue }) => (
          <span className="text-sm text-foreground/80 truncate block max-w-[150px]">
            {getValue() || <span className="text-muted-foreground">—</span>}
          </span>
        ),
      },
      {
        accessorKey: "tags",
        header: "Tags",
        size: 180,
        enableSorting: false,
        cell: ({ getValue }) => <TagPills tags={getValue()} />,
      },
      {
        accessorKey: "teamMember",
        header: "Team Members",
        size: 160,
        enableSorting: false,
        cell: ({ getValue }) => <MemberPills members={getValue()} />,
      },
      {
        id: "contactEmails",
        header: "Contact Emails",
        size: 200,
        enableSorting: false,
        cell: ({ row }) => {
          const emails =
            row.original.contacts
              ?.map((c) => c.contact?.email)
              .filter(Boolean) || [];
          if (!emails.length)
            return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <div className="flex items-center gap-1">
              <span className="text-xs text-foreground/80 truncate max-w-[160px]">
                {emails[0]}
              </span>
              {emails.length > 1 && (
                <span
                  className="text-[11px] text-muted-foreground"
                  title={emails.slice(1).join(", ")}
                >
                  +{emails.length - 1}
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  // Filter definitions
  const FILTER_DEFS = [
    { key: "accountName", label: "Name", Icon: UserSearch },
    { key: "email", label: "Email", Icon: AtSign },
    { key: "type", label: "Type", Icon: Building2 },
    { key: "teamMember", label: "Team Member", Icon: UserCog },
    { key: "tags", label: "Tags", Icon: TagsIcon },
  ];

  const toggleFilter = (key) => {
    if (activeFilters.includes(key)) {
      setActiveFilters((p) => p.filter((f) => f !== key));
      setFilters((p) => ({
        ...p,
        [key]: key === "teamMember" || key === "tags" ? [] : "",
      }));
    } else {
      setActiveFilters((p) => [...p, key]);
    }
  };

  const removeFilter = (key) => {
    setActiveFilters((p) => p.filter((f) => f !== key));
    setFilters((p) => ({
      ...p,
      [key]: key === "teamMember" || key === "tags" ? [] : "",
    }));
  };

  const filterButtons = FILTER_DEFS.map(({ key, label, Icon }) => {
    const active = activeFilters.includes(key);
    return (
      <button
        key={key}
        onClick={() => toggleFilter(key)}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors",
          active
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  });

  // Bulk actions buttons
  const bulkActions = (
    <>
      <BulkActionBtn
        label="Send Email"
        icon={Mail}
        onClick={() => openBulkDrawer("email")}
      />
      <BulkActionBtn
        label="Add Job"
        icon={Briefcase}
        onClick={() => setJobDrawerOpen(true)}
        disabled={!permissions?.managePipelines}
      />
      <BulkActionBtn
        label="Organizer"
        icon={Briefcase}
        onClick={() => openBulkDrawer("organizer")}
        disabled={!permissions?.manageOrganizers}
      />
      <BulkActionBtn
        label="Team"
        icon={Users}
        onClick={() => openBulkDrawer("team")}
        disabled={!permissions?.assignTeamMates}
      />
      <BulkActionBtn
        label="Tags"
        icon={Tag}
        onClick={() => openBulkDrawer("tags")}
        disabled={!permissions?.manageTags}
      />
      <div className="h-4 w-px bg-border/60 mx-1" />
      {filterStatus === "active" ? (
        <BulkActionBtn
          label="Archive"
          icon={Archive}
          onClick={handleArchive}
          disabled={!permissions?.manageAccounts}
        />
      ) : (
        <BulkActionBtn
          label="Activate"
          icon={RotateCcw}
          onClick={handleActivate}
          disabled={!permissions?.manageAccounts}
        />
      )}
      {filterStatus === "archived" && (
        <BulkActionBtn
          label="Delete"
          icon={Trash2}
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={!permissions?.manageAccounts}
        />
      )}
      <BulkActionBtn
        label="Settings"
        icon={UserCog}
        onClick={() => openBulkDrawer("settings")}
      />
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <p className="text-muted-foreground">Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Status toggle and Add button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 gap-0.5">
          {["active", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-3.5 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                filterStatus === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpenDrawer(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Add Account
        </button>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        filterButtons={filterButtons}
        selectedCount={selectedIds.length}
        bulkActions={bulkActions}
      >
        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {activeFilters.includes("accountName") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.accountName}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, accountName: e.target.value }))
                  }
                  placeholder="Account name…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36"
                />
                <button
                  onClick={() => removeFilter("accountName")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {activeFilters.includes("email") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.email}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36"
                />
                <button
                  onClick={() => removeFilter("email")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {activeFilters.includes("type") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, type: e.target.value }))
                  }
                  className="text-sm bg-transparent outline-none text-foreground"
                >
                  <option value="">All types</option>
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  onClick={() => removeFilter("type")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {/* {activeFilters.includes("teamMember") && (
              <div className="flex items-center gap-1.5 min-h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TeamMemberMultiSelectDropDown
                  value={filters.teamMember}
                  onChange={(v) => setFilters((p) => ({ ...p, teamMember: v }))}
                />
                <button onClick={() => removeFilter("teamMember")} className="text-muted-foreground hover:text-foreground shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )} */}
            {activeFilters.includes("teamMember") && (
              <div className="flex items-center gap-1.5 min-h-8 w-[400px] border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <div className="flex-1 min-w-0">
                  <TeamMemberMultiSelectDropDown
                    value={filters.teamMember}
                    onChange={(v) =>
                      setFilters((p) => ({ ...p, teamMember: v }))
                    }
                  />
                </div>

                <button
                  onClick={() => removeFilter("teamMember")}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {/* {activeFilters.includes("tags") && (
              <div className="flex items-center gap-1.5 min-h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TagsMultiSelectDropDown
                  value={filters.tags}
                  onChange={(v) => setFilters((p) => ({ ...p, tags: v }))}
                  options={uniqueTags}
                  placeholder="Tags…"
                />
                <button onClick={() => removeFilter("tags")} className="text-muted-foreground hover:text-foreground shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )} */}

            {activeFilters.includes("tags") && (
              <div className="flex items-center gap-1.5 min-h-8 w-[400px] border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <div className="flex-1 min-w-0">
                  <TagsMultiSelectDropDown
                    value={filters.tags}
                    onChange={(v) => setFilters((p) => ({ ...p, tags: v }))}
                    options={uniqueTags}
                    placeholder="Tags…"
                  />
                </div>

                <button
                  onClick={() => removeFilter("tags")}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </DataTableToolbar>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowSelectionChange={handleRowSelectionChange}
        getRowId={(row) => row._id}
        emptyMessage="No accounts found"
        emptyDescription={
          filterStatus === "archived"
            ? "No archived accounts"
            : "Create your first account to get started"
        }
        pageSize={25}
      />

      {/* Create/Edit Account Drawer */}
      <AccountContactDrawer
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          queryClient.invalidateQueries(["accounts"]);
        }}
      />

      {/* Bulk action drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={handleBulkDrawerClose}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                {bulkDrawerType === "tags" && "Manage Tags"}
                {bulkDrawerType === "team" && "Manage Team"}
                {bulkDrawerType === "email" && "Send Email"}
                {bulkDrawerType === "organizer" && "Send Organizer"}
                {bulkDrawerType === "settings" &&
                  "Edit Login, Notify and Email Sync"}
              </h2>
              <button
                onClick={handleBulkDrawerClose}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {renderBulkContent()}
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={handleBulkDrawerClose}
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSave}
                className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Drawer */}
      <JobDrawer open={jobDrawerOpen} onClose={() => setJobDrawerOpen(false)}    selectedIds={selectedIds}
/>

      {/* Delete confirmation dialog */}
      {/* {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="relative bg-background rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">Delete Accounts?</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete <strong>{selectedIds.length}</strong> account{selectedIds.length > 1 ? "s" : ""}. 
              Type <strong>DELETE</strong> to confirm.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setIsDeleteDialogOpen(false); setConfirmText(""); }} 
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={confirmText !== "DELETE"} 
                className="h-9 px-4 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setIsDeleteDialogOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 cursor-pointer"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setConfirmText("");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Delete Account
                    {selectedIds.length > 1 ? "s" : ""}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  You are about to permanently delete{" "}
                  <span className="font-semibold text-foreground">
                    {selectedIds.length}
                  </span>{" "}
                  account
                  {selectedIds.length > 1 ? "s" : ""}.
                </p>

                <p className="text-sm text-muted-foreground mt-2">
                  Type{" "}
                  <span className="font-bold tracking-wide text-destructive">
                    DELETE
                  </span>{" "}
                  below to confirm.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Confirmation
                </label>

                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  autoFocus
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setConfirmText("");
                }}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE"}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-destructive px-4 text-sm font-semibold text-destructive-foreground shadow-sm transition-all hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountTable;
