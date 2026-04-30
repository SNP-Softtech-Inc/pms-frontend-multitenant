// import React, {
//   useState,
//   useMemo,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
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
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import EmailIcon from "@mui/icons-material/Email";
// import { toast } from "react-toastify";

// import { accountsAPI } from "../../services/api";

// const ManageContactSettings = forwardRef(
//   ({ selectedAccounts, accountList, onClose, fetchData }, ref) => {
//     const [settings, setSettings] = useState({
//       login: "Do nothing",
//       notify: "Do nothing",
//       emailSync: "Do nothing",
//     });

//     // ================= HANDLE CHANGE =================
//     const handleSettingChange = (key, value) => {
//       setSettings((prev) => ({
//         ...prev,
//         [key]: value,
//       }));
//     };

//     // ================= BUILD UPDATES =================
//     const updates = useMemo(() => {
//       const result = [];

//       selectedAccounts.forEach((accountId) => {
//         const account = accountList.find((a) => a._id === accountId);

//         if (account?.contacts?.length) {
//           account.contacts.forEach((contact) => {
//             const contactId = contact.contact?._id || contact.contact;
//             if (!contactId) return;

//             const data = {
//               canLogin:
//                 settings.login === "Assign to all"
//                   ? true
//                   : settings.login === "Remove from all"
//                   ? false
//                   : undefined,

//               canNotify:
//                 settings.notify === "Assign to all"
//                   ? true
//                   : settings.notify === "Remove from all"
//                   ? false
//                   : undefined,

//               canEmailSync:
//                 settings.emailSync === "Assign to all"
//                   ? true
//                   : settings.emailSync === "Remove from all"
//                   ? false
//                   : undefined,
//             };

//             // remove undefined
//             Object.keys(data).forEach((k) => {
//               if (data[k] === undefined) delete data[k];
//             });

//             if (Object.keys(data).length > 0) {
//               result.push({
//                 accountId,
//                 contactId,
//                 data,
//               });
//             }
//           });
//         }
//       });

//       return result;
//     }, [selectedAccounts, accountList, settings]);

//     // ================= SUBMIT =================
//     const handleSubmit = async () => {
//       try {
//         if (updates.length === 0) {
//           toast.info("No changes selected");
//           return;
//         }

//         await Promise.all(
//           updates.map((item) =>
//             accountsAPI.toggleContactLogin(
//               item.accountId,
//               item.contactId,
//               item.data
//             )
//           )
//         );

//         toast.success("Contact settings updated");

//         fetchData();
//         onClose();
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to update settings");
//       }
//     };

//     // expose submit to drawer
//     useImperativeHandle(ref, () => ({
//       submit: handleSubmit,
//     }));

//     // ================= UI =================
//     return (
//       <Box>
//         <Typography variant="body2" color="text.secondary" mb={2}>
//           Bulk edit updates all email addresses linked to selected accounts.
//         </Typography>

//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Settings</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {[
//                 {
//                   label: "Login",
//                   key: "login",
//                   icon: <PersonIcon />,
//                 },
//                 {
//                   label: "Notify",
//                   key: "notify",
//                   icon: <NotificationsIcon />,
//                 },
//                 {
//                   label: "Email Sync",
//                   key: "emailSync",
//                   icon: <EmailIcon />,
//                 },
//               ].map((item) => (
//                 <TableRow key={item.key}>
//                   <TableCell>
//                     <Box display="flex" alignItems="center" gap={1}>
//                       {item.icon}
//                       <Typography>{item.label}</Typography>
//                     </Box>
//                   </TableCell>

//                   <TableCell>
//                     <Select
//                       value={settings[item.key]}
//                       onChange={(e) =>
//                         handleSettingChange(item.key, e.target.value)
//                       }
//                       size="small"
//                       sx={{ width: 160 }}
//                     >
//                       <MenuItem value="Assign to all">
//                         Assign to all
//                       </MenuItem>
//                       <MenuItem value="Remove from all">
//                         Remove from all
//                       </MenuItem>
//                       <MenuItem value="Do nothing">
//                         Do nothing
//                       </MenuItem>
//                     </Select>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   }
// );

// export default ManageContactSettings;


import React, {
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toast } from "react-toastify";
import { User, Bell, Mail } from "lucide-react";

import { accountsAPI } from "../../services/api";

import { cn } from "../../lib/utils";

const ManageContactSettings = forwardRef(
  ({ selectedAccounts, accountList, onClose, fetchData }, ref) => {
    const [settings, setSettings] = useState({
      login: "Do nothing",
      notify: "Do nothing",
      emailSync: "Do nothing",
    });

    // ================= HANDLE CHANGE =================
    const handleSettingChange = (key, value) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    // ================= BUILD UPDATES =================
    const updates = useMemo(() => {
      const result = [];

      selectedAccounts.forEach((accountId) => {
        const account = accountList.find((a) => a._id === accountId);

        if (account?.contacts?.length) {
          account.contacts.forEach((contact) => {
            const contactId = contact.contact?._id || contact.contact;
            if (!contactId) return;

            const data = {
              canLogin:
                settings.login === "Assign to all"
                  ? true
                  : settings.login === "Remove from all"
                  ? false
                  : undefined,

              canNotify:
                settings.notify === "Assign to all"
                  ? true
                  : settings.notify === "Remove from all"
                  ? false
                  : undefined,

              canEmailSync:
                settings.emailSync === "Assign to all"
                  ? true
                  : settings.emailSync === "Remove from all"
                  ? false
                  : undefined,
            };

            // remove undefined
            Object.keys(data).forEach((k) => {
              if (data[k] === undefined) delete data[k];
            });

            if (Object.keys(data).length > 0) {
              result.push({
                accountId,
                contactId,
                data,
              });
            }
          });
        }
      });

      return result;
    }, [selectedAccounts, accountList, settings]);

    // ================= SUBMIT =================
    const handleSubmit = async () => {
      try {
        if (updates.length === 0) {
          toast.info("No changes selected");
          return;
        }

        await Promise.all(
          updates.map((item) =>
            accountsAPI.toggleContactLogin(
              item.accountId,
              item.contactId,
              item.data
            )
          )
        );

        toast.success("Contact settings updated");

        fetchData();
        onClose();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update settings");
      }
    };

    // expose submit to drawer
    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    // Setting options
    const settingOptions = [
      { value: "Assign to all", label: "Assign to all" },
      { value: "Remove from all", label: "Remove from all" },
      { value: "Do nothing", label: "Do nothing" },
    ];

    // Setting items configuration
    const settingItems = [
      {
        label: "Login",
        key: "login",
        icon: User,
        description: "Allow contacts to log in to the account",
      },
      {
        label: "Notify",
        key: "notify",
        icon: Bell,
        description: "Send notifications to these contacts",
      },
      {
        label: "Email Sync",
        key: "emailSync",
        icon: Mail,
        description: "Enable email synchronization for contacts",
      },
    ];

    // ================= UI =================
    return (
      <div className="space-y-4">
        {/* Info message */}
        <div className="rounded-lg bg-muted/50 border border-border p-3">
          <p className="text-sm text-muted-foreground">
            Bulk edit updates all email addresses linked to selected accounts.
          </p>
        </div>

        {/* Settings table */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 border-b border-border bg-muted/30">
            <div className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Settings
              </span>
            </div>
            <div className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {settingItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = settings[item.key] !== "Do nothing";
              
              return (
                <div key={item.key} className="grid grid-cols-2">
                  {/* Setting column */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-md transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted/50 text-muted-foreground"
                    )}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Action column */}
                  <div className="px-4 py-3 flex items-center">
                    <select
                      value={settings[item.key]}
                      onChange={(e) =>
                        handleSettingChange(item.key, e.target.value)
                      }
                      className={cn(
                        "h-9 px-3 text-sm rounded-md border transition-all duration-200",
                        "bg-background text-foreground",
                        "border-border hover:border-primary/50",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "cursor-pointer"
                      )}
                      style={{ width: "160px" }}
                    >
                      {settingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected summary (optional visual feedback) */}
        {updates.length > 0 && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs text-primary/80">
              <span className="font-medium">{updates.length}</span> contact
              {updates.length !== 1 ? "s" : ""} will be updated across{" "}
              <span className="font-medium">{selectedAccounts.length}</span>{" "}
              account{selectedAccounts.length !== 1 ? "s" : ""}.
            </p>
          </div>
        )}
      </div>
    );
  }
);

export default ManageContactSettings;