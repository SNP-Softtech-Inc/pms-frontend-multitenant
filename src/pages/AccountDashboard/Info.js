

// import { useEffect, useState,useMemo } from "react";
// import { useParams } from "react-router-dom";
// import {
//   accountsAPI,
//   contactsAPI,
//   templateAPI,
//   authAPI,
// } from "../../services/api";
// import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";
// import MenuDropdown from "./MenuDropdown";
// import UploadProfilePicture from "./ProfilePictureUpload";
// import NewContactDrawer from "../Account-Contact/NewContactDrawer";
// import { Autocomplete, TextField } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Switch } from "../../components/ui/switch";
// import { Badge } from "../../components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from "../../components/ui/drawer";
// import { ScrollArea } from "../../components/ui/scroll-area";
// import { Checkbox } from "../../components/ui/checkbox";
// import { Loader, X, Users } from "lucide-react";
// import { useConfirm } from "../../components/ConfirmDialogContext";
// import { ShieldCheck } from "lucide-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useAutoRefresh } from "../../hooks/useAutoRefresh";
// import { keepIfSame } from "../../lib/autoRefresh";
// import { activationStatusOf } from "./activationStatus";
// import { contactPhonesText } from "./contactPhones";

// // Login/Notify/Email Sync are disabled for now (feature on hold, not
// // removed) - flip this back to true to re-enable the controls.
// const CONTACT_LOGIN_FEATURES_ENABLED = false;

// const AccountDetails = () => {
//   const { accountId } = useParams();
//   const queryClient = useQueryClient();
//   const { user } = useAuth();
//   const confirm = useConfirm();
//   const [account, setAccount] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [newCanLoginValue, setNewCanLoginValue] = useState(false);
//   const [mode, setMode] = useState("edit");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

//   // const [availableContacts, setAvailableContacts] = useState([]);
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [contactSearch, setContactSearch] = useState("");

//   const [tagList, setTagList] = useState([]);
//   const [teamMemberList, setTeamMemberList] = useState([]);

//   const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
//   const [selectedContactForEdit, setSelectedContactForEdit] = useState(null);
// const { data: allContacts = [], refetch: refetchContacts } = useQuery({
//   queryKey: ["contacts"],
//   queryFn: async () => {
//     const res = await contactsAPI.getContacts();
//     return res.data;
//   },
//   enabled: addContactDrawerOpen,
// });
// const availableContacts = useMemo(() => {
//   // A contacts entry can carry a null `contact` - the referenced document
//   // may have been deleted, or the populate may not have resolved. Reading
//   // c.contact._id then throws, React unmounts, and the Info tab renders as a
//   // blank white screen with no way back. Filtered rather than optional-chained
//   // so the id list cannot end up holding undefined either.
//   const currentContactIds =
//     account?.contacts
//       ?.filter((c) => c?.contact?._id)
//       .map((c) => c.contact._id) || [];

//   return allContacts.filter(
//     (contact) => !currentContactIds.includes(contact._id)
//   );
// }, [allContacts, account]);
//   // Filter available contacts for search
//   const filteredAvailableContacts = availableContacts.filter(
//     (contact) =>
//       contact.contactName
//         ?.toLowerCase()
//         .includes(contactSearch.toLowerCase()) ||
//       contact.email?.toLowerCase().includes(contactSearch.toLowerCase()),
//   );

//   // ================= FETCH ACCOUNT DETAILS =================
//   const fetchAccountDetails = async () => {
//     try {
//       const res = await accountsAPI.getAccountById(accountId);
//       setAccount(res.data);
//       console.log("Fetched account details:", res.data);
//     } catch (err) {
//       console.error("Error fetching account details:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAccountDetails();
//   }, [accountId]);

//   // Auto refresh: contacts, activation status and tags stay current. Paused
//   // while a drawer or the login dialog is open; unchanged data is kept as it
//   // is, so nothing on the page re-renders for nothing.
//   useAutoRefresh(
//     async () => {
//       const res = await accountsAPI.getAccountById(accountId);
//       setAccount(keepIfSame(res.data));
//     },
//     {
//       enabled:
//         Boolean(accountId) &&
//         !dialogOpen &&
//         !drawerOpen &&
//         !addContactDrawerOpen &&
//         !contactEditDrawerOpen,
//     },
//   );

//   // ================= FETCH AVAILABLE CONTACTS =================
//   // const fetchAvailableContacts = async () => {
//   //   try {
//   //     const res = await contactsAPI.getContacts();
//   //     const currentContactIds =
//   //       account?.contacts?.map((c) => c.contact._id) || [];
//   //     const filteredContacts = res.data.filter(
//   //       (contact) => !currentContactIds.includes(contact._id),
//   //     );
//   //     setAvailableContacts(filteredContacts);
//   //   } catch (err) {
//   //     console.error("Error fetching contacts:", err);
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (addContactDrawerOpen && account) fetchAvailableContacts();
//   // }, [addContactDrawerOpen, account]);

//   // ================= FETCH TAGS =================
//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const res = await templateAPI.getAllTags();
//         const tags = res?.data?.tags || [];
//         const formattedTags = tags.map((tag) => ({
//           value: tag._id,
//           label: tag.tagName,
//           colour: tag.tagColour,
//         }));
//         setTagList(formattedTags);
//       } catch (err) {
//         console.error("Error fetching tags:", err?.response || err);
//       }
//     };
//     fetchTags();
//   }, []);

//   // ================= FETCH TEAM MEMBERS =================
//   useEffect(() => {
//     const fetchTeam = async () => {
//       try {
//         const res = await authAPI.getAllUsers({
//           page: 1,
//           limit: 50,
//           status: "active",
//         });
//         const users = res?.data?.users || [];
//         const formattedUsers = users.map((user) => ({
//           value: user._id,
//           label: user.username,
//         }));
//         setTeamMemberList(formattedUsers);
//       } catch (err) {
//         console.error("Error fetching team members:", err?.response || err);
//       }
//     };
//     fetchTeam();
//   }, []);

//   // ================= FILTERED TAGS & MEMBERS =================
//   const accountTags = tagList.length
//     ? tagList.filter((tag) => account?.tags?.includes(tag.value))
//     : [];

//   const assignedMembers = teamMemberList.length
//     ? teamMemberList.filter((member) =>
//         account?.teamMember?.includes(member.value),
//       )
//     : [];

//   // ================= HANDLE SWITCHES =================
//   const handleSwitchClick = (contact) => {
//     setSelectedContact(contact);
//     setNewCanLoginValue(!contact.canLogin);
//     setDialogOpen(true);
//   };

//   const handleNotifyToggle = async (contact) => {
//     try {
//       await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
//         canNotify: !contact.canNotify,
//       });
//       await fetchAccountDetails();
//     } catch (err) {
//       console.error("Error updating canNotify:", err);
//     }
//   };

//   const handleEmailSyncToggle = async (contact) => {
//     try {
//       await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
//         canEmailSync: !contact.canEmailSync,
//       });
//       await fetchAccountDetails();
//     } catch (err) {
//       console.error("Error updating canEmailSync:", err);
//     }
//   };

//   const handleConfirmToggle = async () => {
//     if (!selectedContact) return;
//     try {
//       await accountsAPI.toggleContactLogin(
//         account._id,
//         selectedContact.contact._id,
//         {
//           canLogin: newCanLoginValue,
//         },
//       );
//       await fetchAccountDetails();
//     } catch (err) {
//       console.error("Error updating canLogin:", err);
//     } finally {
//       setDialogOpen(false);
//       setSelectedContact(null);
//     }
//   };

//   const handleCancelToggle = () => {
//     setDialogOpen(false);
//     setSelectedContact(null);
//   };

//   // ================= LINK / UNLINK CONTACTS =================
//   const handleLinkContacts = async () => {
//     if (selectedContacts.length === 0) return;
//     try {
//       const contactsToAdd = selectedContacts.map((contact) => ({
//         contact: contact._id,
//         canLogin: false,
//         canNotify: false,
//         canEmailSync: false,
//       }));
//       await accountsAPI.addContactsToAccount(account._id, {
//         contacts: contactsToAdd,
//       });
//       await fetchAccountDetails();
//       setAddContactDrawerOpen(false);
//       setSelectedContacts([]);
//       setContactSearch("");
//     } catch (err) {
//       console.error("Error linking contacts:", err);
//     }
//   };

//   const handleUnlinkContact = async (contact) => {
//     confirm({
//       title: "Unlink Contact",
//       description: `Are you sure you want to unlink ${contact.contact.contactName}? This action cannot be undone.`,
//       onConfirm: async () => {
//         try {
//           await accountsAPI.removeContactFromAccount(
//             account._id,
//             contact.contact._id,
//           );
//           await fetchAccountDetails();
//         } catch (err) {
//           console.error("Error unlinking contact:", err);
//         }
//       },
//     });
//   };
//   // const handleUnlinkContact = async (contact) => {
//   //   if (!window.confirm(`Unlink ${contact.contact.contactName}?`)) return;
//   //   try {
//   //     await accountsAPI.removeContactFromAccount(
//   //       account._id,
//   //       contact.contact._id,
//   //     );
//   //     await fetchAccountDetails();
//   //   } catch (err) {
//   //     console.error("Error unlinking contact:", err);
//   //   }
//   // };

//   // ================= RESET PASSWORD =================
//   const handleResetPassword = async (contact) => {
//     if (!contact.canLogin) {
//       alert("Enable login access first.");
//       return;
//     }
//     if (!window.confirm(`Reset password for ${contact.contact.contactName}?`))
//       return;
//     try {
//       await fetch(`${process.env.REACT_APP_AUTH_USER}/auth/forgot-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: contact.contact.email }),
//       });
//       alert("Password reset email sent!");
//     } catch (err) {
//       console.error("Error resetting password:", err);
//     }
//   };

//   // ================= CONTACT EDIT =================
//   const handleOpenContactEditDrawer = (contactData) => {
//     console.log("Opening edit drawer for contact:", contactData);
//     setSelectedContactForEdit(contactData.contact);
//     setContactEditDrawerOpen(true);
//     setMode("edit");
//   };

//   // const handleContactUpdated = () => {
//   //   fetchAccountDetails(accountId);
//   //   setContactEditDrawerOpen(false);
//   // };
//   // const handleContactUpdated = async () => {
//   //   await fetchAccountDetails();
//   //   setContactEditDrawerOpen(false);
//   // };


// const handleContactUpdated = async () => {
//   await fetchAccountDetails();

//   await queryClient.invalidateQueries({
//     queryKey: ["contacts"],
//   });

//   setContactEditDrawerOpen(false);
// };

// const ACTIVATION_BADGES = {
//   pending: {
//     label: "Pending Activation",
//     className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
//   },
//   activated: {
//     label: "Active",
//     className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
//   },
//   expired: {
//     label: "Link Expired",
//     className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
//   },
//   not_sent: {
//     label: "Not Activated",
//     className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100",
//   },
// };
//   const toggleCls =
//     "w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600";
//   const cancelBtnCls =
//     "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

//   if (!account)
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-muted-foreground">
//           <Loader />
//         </p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-6 space-y-4">
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//         {/* LEFT — Account Details */}
//         <div className="bg-card rounded-xl border border-border overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-border">
//             <h2 className="text-sm font-semibold text-foreground">
//               Account Details
//             </h2>
//             <span
//               title={
//                 user?.role === "team_member" && user?.manageAccounts === false
//                   ? "You don't have permission to edit accounts"
//                   : ""
//               }
//             >
//               <Button
//                 type="button"
//                 onClick={() => setDrawerOpen(true)}
//                 disabled={
//                   user?.role === "team_member" && user?.manageAccounts === false
//                 }
//                 size="sm"
//               >
//                 Edit
//               </Button>
//             </span>
//           </div>

//           <div className="px-5 py-4 space-y-5">
//             {/* Avatar + Name */}
//             <div className="flex items-center gap-4">
//               <UploadProfilePicture
//                 accountId={account._id}
//                 currentImage={account.profilePicture}
//                 onUploadSuccess={fetchAccountDetails}
//               />
//               <div>
//                 <p className="font-semibold text-foreground">
//                   {account.accountName}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-0.5">
//                   {account.clientType}
//                 </p>
//               </div>
//             </div>

//             <div className="border-t border-border" />

//             {/* Tags */}
//             <div>
//               <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
//                 Tags
//               </p>
//               <div className="flex flex-wrap gap-1.5">
//                 {accountTags?.length > 0 ? (
//                   accountTags.map((tag) => (
//                     <span
//                       key={tag.value}
//                       className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
//                       style={{ backgroundColor: tag.colour }}
//                     >
//                       {tag.label}
//                     </span>
//                   ))
//                 ) : (
//                   <span className="text-xs text-muted-foreground">
//                     No tags assigned
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Team Members */}
//             <div>
//               <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
//                 Team Members
//               </p>
//               <div className="flex flex-wrap gap-1.5">
//                 {assignedMembers?.length > 0 ? (
//                   assignedMembers.map((m) => (
//                     <span
//                       key={m.value}
//                       className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border border-border bg-muted text-muted-foreground"
//                     >
//                       {m.label}
//                     </span>
//                   ))
//                 ) : (
//                   <span className="text-xs text-muted-foreground">
//                     No members assigned
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT — Contacts */}
//         <div className="bg-card rounded-xl border border-border overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-border">
//             <h2 className="text-sm font-semibold text-foreground">Contacts</h2>
//             <Button
//               type="button"
//               size="sm"
//               onClick={() => setAddContactDrawerOpen(true)}
//             >
//               + Add Contact
//             </Button>
//           </div>

         
//           <div className="grid grid-cols-[1fr_auto] items-center px-5 py-2 bg-muted border-b border-border">
//             <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
//               Contact
//             </span>
//             <div className="flex items-center gap-5 mr-8">
//               <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">
//                 Login
//               </span>
//               <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">
//                 Notify
//               </span>
//               <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-14 text-center">
//                 Email Sync
//               </span>
//               <span className="w-8"></span>
//             </div>
//           </div>

          

//           <div className="space-y-2">
//             {account.contacts?.filter((c) => c?.contact)?.length > 0 ? (
//               account.contacts
//                 .filter((c) => c?.contact)
//                 .map((c) => (
//                 <div
//                   key={c.contact._id}
//                   className="
        
//           group
//           rounded-2xl
//           border border-border/50
//           bg-background/70
//           backdrop-blur-sm

//           transition-all duration-200

//           hover:border-border
//           hover:bg-muted/30
//           hover:shadow-sm
//         "
//                 >
//                   <div
//                     className="
//             grid grid-cols-[1fr_auto]
//             items-center gap-4
//             px-5 py-4
//           "
//                   >
                    
//                     <div className="min-w-0">
//                       <span
//                         title={
//                           user?.role === "team_member" &&
//                           user?.manageContacts === false
//                             ? "You don't have permission to edit contacts"
//                             : ""
//                         }
//                         className={`
//                 block truncate
//                 font-medium
//                 transition-colors duration-200

//                 ${
//                   user?.role === "team_member" && user?.manageContacts === false
//                     ? "text-muted-foreground cursor-not-allowed opacity-60"
//                     : "text-foreground cursor-pointer hover:text-primary"
//                 }
//               `}
//                         style={{
//                           fontFamily: "var(--font-family)",
//                           fontSize:
//                             "calc(0.92rem * var(--font-scale, 100) / 100)",
//                         }}
//                         onClick={() => {
//                           if (
//                             user?.role === "team_member" &&
//                             user?.manageContacts === false
//                           )
//                             return;

//                           handleOpenContactEditDrawer(c);
//                         }}
//                       >
//                         {c.contact?.contactName || "Unnamed contact"}
//                       </span>

//                       <span
//                         className="
//                 mt-1 block truncate
//                 text-muted-foreground
//               "
//                         style={{
//                           fontFamily: "var(--font-family)",
//                           fontSize:
//                             "calc(0.76rem * var(--font-scale, 100) / 100)",
//                         }}
//                       >
//                         {c.contact?.email || "—"}
//                       </span>


//                       <span
//                         className="
//                 mt-0.5 block truncate
//                 text-muted-foreground
//               "
//                         title={contactPhonesText(c.contact) || undefined}
//                         style={{
//                           fontFamily: "var(--font-family)",
//                           fontSize:
//                             "calc(0.76rem * var(--font-scale, 100) / 100)",
//                         }}
//                       >
//                         {contactPhonesText(c.contact) || "No phone number"}
//                       </span>
//                     </div>

                    
//                     <div className="flex flex-col items-end gap-2">
                     
//   {c.canLogin && (() => {
//   const badge = ACTIVATION_BADGES[activationStatusOf(c.contact)];

//   return (
//     <Badge className={`border text-[10px] font-medium ${badge.className}`}>
//       {badge.label}
//     </Badge>
//   );
// })()}
//                       <div className="flex items-center gap-4 sm:gap-5">
                      
//                         <div className="flex flex-col items-center gap-1">
//                           <span
//                             className="text-[10px] text-muted-foreground"
//                             style={{
//                               fontSize:
//                                 "calc(0.62rem * var(--font-scale, 100) / 100)",
//                             }}
//                           >
//                             Login
//                           </span>

//                           <Switch
//                             checked={c.canLogin}
//                             disabled={!CONTACT_LOGIN_FEATURES_ENABLED}
//                             onCheckedChange={() => handleSwitchClick(c)}
//                             className="
//                   data-[state=checked]:bg-primary
//                   data-[state=unchecked]:bg-muted-foreground/30
//                 "
//                           />
//                         </div>

                        
//                         <div className="flex flex-col items-center gap-1">
//                           <span
//                             className="text-[10px] text-muted-foreground"
//                             style={{
//                               fontSize:
//                                 "calc(0.62rem * var(--font-scale, 100) / 100)",
//                             }}
//                           >
//                             Notify
//                           </span>

//                           <Switch
//                             checked={c.canNotify}
//                             disabled={!CONTACT_LOGIN_FEATURES_ENABLED}
//                             onCheckedChange={() => handleNotifyToggle(c)}
//                             className="
//                   data-[state=checked]:bg-primary
//                   data-[state=unchecked]:bg-muted-foreground/30
//                 "
//                           />
//                         </div>


//                         <div className="flex flex-col items-center gap-1">
//                           <span
//                             className="text-[10px] text-muted-foreground"
//                             style={{
//                               fontSize:
//                                 "calc(0.62rem * var(--font-scale, 100) / 100)",
//                             }}
//                           >
//                             Sync
//                           </span>

//                           <Switch
//                             checked={c.canEmailSync}
//                             disabled={!CONTACT_LOGIN_FEATURES_ENABLED}
//                             onCheckedChange={() => handleEmailSyncToggle(c)}
//                             className="
//                   data-[state=checked]:bg-primary
//                   data-[state=unchecked]:bg-muted-foreground/30
//                 "
//                           />
//                         </div>

                        
//                         <div className="ml-1">
//                           <MenuDropdown
//                             contact={c}
//                             onUnlink={handleUnlinkContact}
//                             onResetPassword={handleResetPassword}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div
//                 className="
//         flex flex-col items-center justify-center
//         rounded-2xl
//         border border-dashed border-border/60
//         bg-muted/10
//         py-14 px-6
//         text-center
//       "
//               >
//                 <div
//                   className="
//           mb-4 flex h-12 w-12 items-center justify-center
//           rounded-full bg-muted
//         "
//                 >
//                   <Users className="h-5 w-5 text-muted-foreground" />
//                 </div>

//                 <p
//                   className="font-medium text-foreground"
//                   style={{
//                     fontFamily: "var(--font-family)",
//                     fontSize: "calc(0.92rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   No contacts linked
//                 </p>

//                 <p
//                   className="mt-1 text-muted-foreground"
//                   style={{
//                     fontFamily: "var(--font-family)",
//                     fontSize: "calc(0.76rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   Add or link contacts to this account.
//                 </p>

//                 <Button
//                   type="button"
//                   onClick={() => setAddContactDrawerOpen(true)}
//                   variant="outline"
//                   size="sm"
//                   className="
//           mt-5
//           rounded-xl
//           border-border/60
//           hover:bg-muted/50
//         "
//                   style={{
//                     fontSize: "calc(0.82rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   Add Contact
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

        


//       </div>

//       {/* Account edit drawer */}
//       <AccountContactDrawer
//         open={drawerOpen}
//         onClose={() => {
//           setDrawerOpen(false);
//           fetchAccountDetails();
//         }}
//         accountId={account._id}
//       />

//       {/* Confirm access change modal */}

//       <Dialog open={dialogOpen} onOpenChange={handleCancelToggle}>
//         <DialogContent
//           className="
//       sm:max-w-md
//       rounded-3xl
//       border border-border/50
//       bg-background/95
//       backdrop-blur-xl
//       shadow-2xl
//       p-0 overflow-hidden
//     "
//           style={{
//             fontFamily: "var(--font-family)",
//           }}
//         >
//           {/* Header */}
//           <DialogHeader
//             className="
//         px-6 pt-6 pb-4
//         border-b border-border/40
//         space-y-2
//       "
//           >
//             <div className="flex items-start gap-3">
//               <div
//                 className="
//             flex h-11 w-11 shrink-0 items-center justify-center
//             rounded-2xl
//             bg-primary/10
//             border border-primary/20
//           "
//               >
//                 <ShieldCheck className="h-5 w-5 text-primary" />
//               </div>

//               <div className="space-y-1">
//                 <DialogTitle
//                   className="
//               text-base font-semibold tracking-tight
//               text-foreground
//             "
//                   style={{
//                     fontSize: "calc(1rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   Confirm Access Change
//                 </DialogTitle>

//                 <DialogDescription
//                   className="
//               text-sm leading-relaxed
//               text-muted-foreground
//             "
//                   style={{
//                     fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   {newCanLoginValue
//                     ? `Grant portal login access to ${selectedContact?.contact.email}?`
//                     : `Remove portal login access from ${selectedContact?.contact.email}?`}
//                 </DialogDescription>
//               </div>
//             </div>
//           </DialogHeader>

//           {/* Body */}
//           <div className="px-6 py-5">
//             <div
//               className="
//           rounded-2xl
//           border border-border/50
//           bg-muted/30
//           px-4 py-3
//         "
//             >
//               <p
//                 className="text-xs font-medium text-muted-foreground mb-1"
//                 style={{
//                   fontSize: "calc(0.72rem * var(--font-scale, 100) / 100)",
//                 }}
//               >
//                 CONTACT EMAIL
//               </p>

//               <p
//                 className="text-sm font-medium text-foreground break-all"
//                 style={{
//                   fontSize: "calc(0.88rem * var(--font-scale, 100) / 100)",
//                 }}
//               >
//                 {selectedContact?.contact.email}
//               </p>
//             </div>
//           </div>

//           {/* Footer */}
//           <DialogFooter
//             className="
//         px-6 py-4
//         border-t border-border/40
//         bg-muted/10
//         flex-row justify-end gap-2
//       "
//           >
//             <Button
//               variant="outline"
//               onClick={handleCancelToggle}
//               className="
//     rounded-xl
//     border-border/60
//     bg-background
//     text-foreground

//     hover:bg-muted/60
//     hover:text-foreground

//     dark:bg-background/80
//     dark:border-border/70
//     dark:text-foreground
//     dark:hover:bg-muted/50

//     transition-all duration-200
//   "
//               style={{
//                 fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
//               }}
//             >
//               Cancel
//             </Button>

//             <Button
//               onClick={handleConfirmToggle}
//               className="
//           rounded-xl
//           shadow-sm
//           transition-all duration-200
//         "
//               style={{
//                 fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
//               }}
//             >
//               Confirm
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       {/* Add Contact drawer */}

//       {/* <Drawer
//         open={addContactDrawerOpen}
//         onOpenChange={setAddContactDrawerOpen}
//         direction="right"
//       >
//         <DrawerContent
//           className="
//       w-full sm:max-w-[500px]
//       right-0 top-0 left-auto mt-0 rounded-none
//       border-l border-border/50
//       bg-background/95 backdrop-blur-xl
//       shadow-2xl
//       flex flex-col
//     "
//           style={{
//             fontFamily: "var(--font-family)",
//           }}
//         >
          
//           <DrawerHeader
//             className="
//         border-b border-border/50
//         px-6 py-5
//         bg-background/80
//         backdrop-blur-md
//       "
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="space-y-1">
//                 <DrawerTitle
//                   className="
//               text-base font-semibold tracking-tight
//               text-foreground
//             "
//                   style={{
//                     fontSize: "calc(1rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   Add Contacts to Account
//                 </DrawerTitle>

//                 <p
//                   className="text-xs text-muted-foreground"
//                   style={{
//                     fontSize: "calc(0.78rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   Search and link existing contacts to this account.
//                 </p>
//               </div>

            
//               <div className="flex items-center gap-2">
//       <Button
//         size="sm"
//         onClick={() => {
//           setSelectedContactForEdit(null);
//           setMode("create");
//           setContactEditDrawerOpen(true);
//         }}
//       >
//         + Create Contact
//       </Button>

//       <DrawerClose asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-9 w-9 rounded-xl"
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </DrawerClose>
//     </div>
//             </div>
//           </DrawerHeader>

         
//           <div
//             className="
//         px-6 py-4
//         border-b border-border/40
//         bg-muted/20
//       "
//           >
//             <div className="relative">
//               <Input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 value={contactSearch}
//                 onChange={(e) => setContactSearch(e.target.value)}
//                 className="
//             h-11 rounded-2xl
//             border-border/60
//             bg-background/80
//             shadow-sm
//             px-4

//             transition-all duration-200

//             focus-visible:ring-2
//             focus-visible:ring-primary/20
//             focus-visible:border-primary/40

//             dark:bg-background/60
//             dark:border-border/50
//           "
//                 style={{
//                   fontFamily: "var(--font-family)",
//                   fontSize: "calc(0.92rem * var(--font-scale, 100) / 100)",
//                 }}
//               />
//             </div>
//           </div>

          
//           <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
//             <div className="px-3 py-3 space-y-2">
//               {filteredAvailableContacts.map((c) => {
//                 const isSelected = selectedContacts.some(
//                   (s) => s._id === c._id,
//                 );

//                 return (
//                   <label
//                     key={c._id}
//                     className={`
//                 group flex items-start gap-3
//                 rounded-2xl border
//                 px-4 py-3
//                 cursor-pointer
//                 transition-all duration-200

//                 ${
//                   isSelected
//                     ? "border-primary/30 bg-primary/5 shadow-sm"
//                     : "border-border/50 bg-background/70 hover:bg-muted/40 hover:border-border"
//                 }
//               `}
//                   >
//                     <Checkbox
//                       checked={isSelected}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           setSelectedContacts((prev) => [...prev, c]);
//                         } else {
//                           setSelectedContacts((prev) =>
//                             prev.filter((s) => s._id !== c._id),
//                           );
//                         }
//                       }}
//                       className="mt-0.5"
//                     />

//                     <div className="min-w-0 flex-1">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <p
//                           className="
//                       text-sm font-medium
//                       text-foreground truncate
//                     "
//                           style={{
//                             fontSize:
//                               "calc(0.9rem * var(--font-scale, 100) / 100)",
//                           }}
//                         >
//                           {c.contactName}
//                         </p>

//                         {isSelected && (
//                           <span
//                             className="
//                         inline-flex items-center
//                         rounded-full
//                         border border-primary/20
//                         bg-primary/10
//                         px-2 py-0.5
//                         text-[10px] font-medium
//                         text-primary
//                       "
//                           >
//                             Selected
//                           </span>
//                         )}
//                       </div>

//                       <p
//                         className="
//                     mt-1 text-xs
//                     text-muted-foreground truncate
//                   "
//                         style={{
//                           fontSize:
//                             "calc(0.75rem * var(--font-scale, 100) / 100)",
//                         }}
//                       >
//                         {c.email}
//                       </p>
//                     </div>
//                   </label>
//                 );
//               })}

//               {filteredAvailableContacts.length === 0 && (
//                 <div
//                   className="
//               flex flex-col items-center justify-center
//               py-14 text-center
//             "
//                 >
//                   <div
//                     className="
//                 mb-3 flex h-12 w-12 items-center justify-center
//                 rounded-full bg-muted
//               "
//                   >
//                     <X className="h-5 w-5 text-muted-foreground" />
//                   </div>

//                   <p
//                     className="text-sm font-medium text-foreground"
//                     style={{
//                       fontSize: "calc(0.9rem * var(--font-scale, 100) / 100)",
//                     }}
//                   >
//                     No contacts found
//                   </p>

//                   <p
//                     className="mt-1 text-xs text-muted-foreground"
//                     style={{
//                       fontSize: "calc(0.75rem * var(--font-scale, 100) / 100)",
//                     }}
//                   >
//                     Try searching with another name or email.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>

          
//           <DrawerFooter
//             className="
//         border-t border-border/50
//         bg-background/80 backdrop-blur-md
//         px-6 py-4
//       "
//           >
//             <div className="flex items-center justify-between gap-3">
//               <div className="text-xs text-muted-foreground">
//                 {selectedContacts.length > 0 ? (
//                   <span>
//                     {selectedContacts.length} contact
//                     {selectedContacts.length !== 1 ? "s" : ""} selected
//                   </span>
//                 ) : (
//                   <span>Select contacts to continue</span>
//                 )}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setAddContactDrawerOpen(false);
//                     setSelectedContacts([]);
//                     setContactSearch("");
//                   }}
//                   className="
//               rounded-xl
//               border-border/60
//               hover:bg-muted/50
//             "
//                   style={{
//                     fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   onClick={handleLinkContacts}
//                   disabled={selectedContacts.length === 0}
//                   className="
//               rounded-xl
//               shadow-sm
//               transition-all duration-200
//             "
//                   style={{
//                     fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
//                   }}
//                 >
//                   Link{" "}
//                   {selectedContacts.length > 0
//                     ? `${selectedContacts.length} `
//                     : ""}
//                   Contact
//                   {selectedContacts.length !== 1 ? "s" : ""}
//                 </Button>
//               </div>
//             </div>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer> */}
// {addContactDrawerOpen && (
//   <div className="fixed inset-0 z-50 overflow-hidden">
//     {/* Overlay */}
//     <div
//       className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
//       onClick={() => {
//         setAddContactDrawerOpen(false);
//         setSelectedContacts([]);
//         setContactSearch("");
//       }}
//     />

//     {/* Drawer */}
//     <div className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-background text-foreground border-l border-border shadow-2xl flex flex-col">

//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-background">
//         <div className="space-y-0.5">
//           <h2 className="text-base font-semibold tracking-tight">
//             Add Contacts to Account
//           </h2>

//           <p className="text-xs text-muted-foreground">
//             Search and link existing contacts to this account.
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             size="sm"
//             onClick={() => {
//               setSelectedContactForEdit(null);
//               setMode("create");
//               setContactEditDrawerOpen(true);
//             }}
//           >
//             + Create Contact
//           </Button>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               setAddContactDrawerOpen(false);
//               setSelectedContacts([]);
//               setContactSearch("");
//             }}
//             className="h-9 w-9"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="px-5 py-4 border-b border-border shrink-0">
//         <Input
//           placeholder="Search by name or email..."
//           value={contactSearch}
//           onChange={(e) => setContactSearch(e.target.value)}
//         />
//       </div>

//       {/* Content */}
//       <ScrollArea className="flex-1">
//         <div className="p-5 space-y-3">
//           {filteredAvailableContacts.map((c) => {
//             const isSelected = selectedContacts.some(
//               (s) => s._id === c._id
//             );

//             return (
//               <label
//                 key={c._id}
//                 className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors
//                   ${
//                     isSelected
//                       ? "border-primary bg-primary/5"
//                       : "border-border hover:bg-accent"
//                   }`}
//               >
//                 <Checkbox
//                   checked={isSelected}
//                   onCheckedChange={(checked) => {
//                     if (checked) {
//                       setSelectedContacts((prev) => [...prev, c]);
//                     } else {
//                       setSelectedContacts((prev) =>
//                         prev.filter((s) => s._id !== c._id)
//                       );
//                     }
//                   }}
//                 />

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium truncate">
//                       {c.contactName}
//                     </p>

//                     {isSelected && (
//                       <span className="rounded-full bg-primary/10 text-primary text-[10px] px-2 py-0.5">
//                         Selected
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-xs text-muted-foreground truncate mt-1">
//                     {c.email}
//                   </p>
//                 </div>
//               </label>
//             );
//           })}

//           {filteredAvailableContacts.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16">
//               <X className="h-8 w-8 text-muted-foreground mb-3" />

//               <p className="font-medium">
//                 No contacts found
//               </p>

//               <p className="text-sm text-muted-foreground">
//                 Try another search.
//               </p>
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       {/* Footer */}
//       <div className="flex items-center justify-between px-5 py-4 border-t border-border shrink-0 bg-background">
//         <span className="text-sm text-muted-foreground">
//           {selectedContacts.length > 0
//             ? `${selectedContacts.length} contact${
//                 selectedContacts.length > 1 ? "s" : ""
//               } selected`
//             : "Select contacts to continue"}
//         </span>

//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => {
//               setAddContactDrawerOpen(false);
//               setSelectedContacts([]);
//               setContactSearch("");
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             disabled={selectedContacts.length === 0}
//             onClick={handleLinkContacts}
//           >
//             Link
//             {selectedContacts.length > 0 &&
//               ` ${selectedContacts.length}`}
//           </Button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//       {/* Contact Edit Drawer */}
//       <NewContactDrawer
//         open={contactEditDrawerOpen}
//         onClose={() => setContactEditDrawerOpen(false)}
//         selectedContact={selectedContactForEdit}
//         mode={mode}
//         onContactUpdated={handleContactUpdated}
//       />
//     </div>
//   );
// };

// export default AccountDetails;

import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  accountsAPI,
  contactsAPI,
  templateAPI,
  authAPI,
} from "../../services/api";
import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";
import MenuDropdown from "./MenuDropdown";
import UploadProfilePicture from "./ProfilePictureUpload";
import NewContactDrawer from "../Account-Contact/NewContactDrawer";
import { Autocomplete, TextField } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Loader,
  X,
  Users,
  ShieldCheck,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import { keepIfSame } from "../../lib/autoRefresh";
import { activationStatusOf } from "./activationStatus";
import { contactPhonesText } from "./contactPhones";
import PhoneNumbersWithFlags from "./PhoneNumbersWithFlags"
// Login/Notify/Email Sync are disabled for now (feature on hold, not
// removed) - flip this back to true to re-enable the controls.
const CONTACT_LOGIN_FEATURES_ENABLED = false;

const ACTIVATION_BADGES = {
  pending: {
    label: "Pending Activation",
    className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  activated: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  expired: {
    label: "Link Expired",
    className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
  },
  not_sent: {
    label: "Not Activated",
    className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100",
  },
};

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

const AccountDetails = () => {
  const { accountId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const confirm = useConfirm();
  const [account, setAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);
  const [mode, setMode] = useState("edit");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");

  const [tagList, setTagList] = useState([]);
  const [teamMemberList, setTeamMemberList] = useState([]);

  const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState(null);

  // Which contact cards are expanded: { [contactId]: true }
  const [expandedContacts, setExpandedContacts] = useState({});
  const toggleContact = (id) =>
    setExpandedContacts((prev) => ({ ...prev, [id]: !prev[id] }));

  const { data: allContacts = [], refetch: refetchContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await contactsAPI.getContacts();
      return res.data;
    },
    enabled: addContactDrawerOpen,
  });

  const availableContacts = useMemo(() => {
    // A contacts entry can carry a null `contact` - the referenced document
    // may have been deleted, or the populate may not have resolved. Reading
    // c.contact._id then throws, React unmounts, and the Info tab renders as a
    // blank white screen with no way back. Filtered rather than optional-chained
    // so the id list cannot end up holding undefined either.
    const currentContactIds =
      account?.contacts
        ?.filter((c) => c?.contact?._id)
        .map((c) => c.contact._id) || [];

    return allContacts.filter(
      (contact) => !currentContactIds.includes(contact._id),
    );
  }, [allContacts, account]);

  // Filter available contacts for search
  const filteredAvailableContacts = availableContacts.filter(
    (contact) =>
      contact.contactName
        ?.toLowerCase()
        .includes(contactSearch.toLowerCase()) ||
      contact.email?.toLowerCase().includes(contactSearch.toLowerCase()),
  );

  // ================= FETCH ACCOUNT DETAILS =================
  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccount(res.data);
      console.log("Fetched account details:", res.data);
    } catch (err) {
      console.error("Error fetching account details:", err);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  // Auto refresh: contacts, activation status and tags stay current. Paused
  // while a drawer or the login dialog is open; unchanged data is kept as it
  // is, so nothing on the page re-renders for nothing.
  useAutoRefresh(
    async () => {
      const res = await accountsAPI.getAccountById(accountId);
      setAccount(keepIfSame(res.data));
    },
    {
      enabled:
        Boolean(accountId) &&
        !dialogOpen &&
        !drawerOpen &&
        !addContactDrawerOpen &&
        !contactEditDrawerOpen,
    },
  );

  // ================= FETCH TAGS =================
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await templateAPI.getAllTags();
        const tags = res?.data?.tags || [];
        const formattedTags = tags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));
        setTagList(formattedTags);
      } catch (err) {
        console.error("Error fetching tags:", err?.response || err);
      }
    };
    fetchTags();
  }, []);

  // ================= FETCH TEAM MEMBERS =================
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });
        const users = res?.data?.users || [];
        const formattedUsers = users.map((user) => ({
          value: user._id,
          label: user.username,
        }));
        setTeamMemberList(formattedUsers);
      } catch (err) {
        console.error("Error fetching team members:", err?.response || err);
      }
    };
    fetchTeam();
  }, []);

  // ================= FILTERED TAGS & MEMBERS =================
  const accountTags = tagList.length
    ? tagList.filter((tag) => account?.tags?.includes(tag.value))
    : [];

  const assignedMembers = teamMemberList.length
    ? teamMemberList.filter((member) =>
        account?.teamMember?.includes(member.value),
      )
    : [];

  // ================= CONTACT CARDS =================
  const linkedContacts = account?.contacts?.filter((c) => c?.contact) ?? [];

  const canEditContacts = !(
    user?.role === "team_member" && user?.manageContacts === false
  );

  // ================= HANDLE SWITCHES =================
  const handleSwitchClick = (contact) => {
    setSelectedContact(contact);
    setNewCanLoginValue(!contact.canLogin);
    setDialogOpen(true);
  };

  const handleNotifyToggle = async (contact) => {
    try {
      await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
        canNotify: !contact.canNotify,
      });
      await fetchAccountDetails();
    } catch (err) {
      console.error("Error updating canNotify:", err);
    }
  };

  const handleEmailSyncToggle = async (contact) => {
    try {
      await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
        canEmailSync: !contact.canEmailSync,
      });
      await fetchAccountDetails();
    } catch (err) {
      console.error("Error updating canEmailSync:", err);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedContact) return;
    try {
      await accountsAPI.toggleContactLogin(
        account._id,
        selectedContact.contact._id,
        {
          canLogin: newCanLoginValue,
        },
      );
      await fetchAccountDetails();
    } catch (err) {
      console.error("Error updating canLogin:", err);
    } finally {
      setDialogOpen(false);
      setSelectedContact(null);
    }
  };

  const handleCancelToggle = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };

  // ================= LINK / UNLINK CONTACTS =================
  const handleLinkContacts = async () => {
    if (selectedContacts.length === 0) return;
    try {
      const contactsToAdd = selectedContacts.map((contact) => ({
        contact: contact._id,
        canLogin: false,
        canNotify: false,
        canEmailSync: false,
      }));
      await accountsAPI.addContactsToAccount(account._id, {
        contacts: contactsToAdd,
      });
      await fetchAccountDetails();
      setAddContactDrawerOpen(false);
      setSelectedContacts([]);
      setContactSearch("");
    } catch (err) {
      console.error("Error linking contacts:", err);
    }
  };

  const handleUnlinkContact = async (contact) => {
    confirm({
      title: "Unlink Contact",
      description: `Are you sure you want to unlink ${contact.contact.contactName}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await accountsAPI.removeContactFromAccount(
            account._id,
            contact.contact._id,
          );
          await fetchAccountDetails();
        } catch (err) {
          console.error("Error unlinking contact:", err);
        }
      },
    });
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async (contact) => {
    if (!contact.canLogin) {
      alert("Enable login access first.");
      return;
    }
    if (!window.confirm(`Reset password for ${contact.contact.contactName}?`))
      return;
    try {
      await fetch(`${process.env.REACT_APP_AUTH_USER}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact.contact.email }),
      });
      alert("Password reset email sent!");
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  // ================= CONTACT EDIT =================
  const handleOpenContactEditDrawer = (contactData) => {
    console.log("Opening edit drawer for contact:", contactData);
    setSelectedContactForEdit(contactData.contact);
    setContactEditDrawerOpen(true);
    setMode("edit");
  };

  const handleContactUpdated = async () => {
    await fetchAccountDetails();

    await queryClient.invalidateQueries({
      queryKey: ["contacts"],
    });

    setContactEditDrawerOpen(false);
  };

  const closeAddContactDrawer = () => {
    setAddContactDrawerOpen(false);
    setSelectedContacts([]);
    setContactSearch("");
  };

  if (!account)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          <Loader />
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* LEFT — Account Details */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Account Details
            </h2>
            <span
              title={
                user?.role === "team_member" && user?.manageAccounts === false
                  ? "You don't have permission to edit accounts"
                  : ""
              }
            >
              <Button
                type="button"
                onClick={() => setDrawerOpen(true)}
                disabled={
                  user?.role === "team_member" && user?.manageAccounts === false
                }
                size="sm"
              >
                Edit
              </Button>
            </span>
          </div>

          <div className="px-5 py-4 space-y-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <UploadProfilePicture
                accountId={account._id}
                currentImage={account.profilePicture}
                onUploadSuccess={fetchAccountDetails}
              />
              <div>
                <p className="font-semibold text-foreground">
                  {account.accountName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {account.clientType}
                </p>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Tags */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {accountTags?.length > 0 ? (
                  accountTags.map((tag) => (
                    <span
                      key={tag.value}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
                      style={{ backgroundColor: tag.colour }}
                    >
                      {tag.label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No tags assigned
                  </span>
                )}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Team Members
              </p>
              <div className="flex flex-wrap gap-1.5">
                {assignedMembers?.length > 0 ? (
                  assignedMembers.map((m) => (
                    <span
                      key={m.value}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border border-border bg-muted text-muted-foreground"
                    >
                      {m.label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No members assigned
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Contacts (collapsible cards) */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Contacts
              {linkedContacts.length > 0 && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {linkedContacts.length}
                </span>
              )}
            </h2>
            <Button
              type="button"
              size="sm"
              onClick={() => setAddContactDrawerOpen(true)}
            >
              + Add Contact
            </Button>
          </div>

          <div className="p-4 space-y-3">
            {linkedContacts.length > 0 ? (
              linkedContacts.map((c) => {
                const id = c.contact._id;
                const isOpen = !!expandedContacts[id];
                const phones = contactPhonesText(c.contact);
                const badge = c.canLogin
                  ? ACTIVATION_BADGES[activationStatusOf(c.contact)] ||
                    ACTIVATION_BADGES.not_sent
                  : null;

                const toggles = [
                  {
                    key: "login",
                    label: "Login",
                    checked: c.canLogin,
                    onChange: () => handleSwitchClick(c),
                  },
                  {
                    key: "notify",
                    label: "Notify",
                    checked: c.canNotify,
                    onChange: () => handleNotifyToggle(c),
                  },
                  {
                    key: "sync",
                    label: "Email Sync",
                    checked: c.canEmailSync,
                    onChange: () => handleEmailSyncToggle(c),
                  },
                ];

                return (
                  <div
                    key={id}
                    className={`rounded-xl border bg-background transition-colors duration-200 ${
                      isOpen
                        ? "border-border shadow-sm"
                        : "border-border/60 hover:border-border"
                    }`}
                  >
                    {/* Card header — click to expand / collapse */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onClick={() => toggleContact(id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleContact(id);
                        }
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {initialsOf(c.contact?.contactName)}
                      </div>

                      {/* Name + preview */}
                      <div className="min-w-0 flex-1">
                        <span
                          title={
                            canEditContacts
                              ? ""
                              : "You don't have permission to edit contacts"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (canEditContacts) handleOpenContactEditDrawer(c);
                          }}
                          className={`block truncate font-medium transition-colors duration-200 ${
                            canEditContacts
                              ? "text-foreground hover:text-primary cursor-pointer"
                              : "text-muted-foreground cursor-not-allowed opacity-60"
                          }`}
                          style={{
                            fontFamily: "var(--font-family)",
                            fontSize:
                              "calc(0.92rem * var(--font-scale, 100) / 100)",
                          }}
                        >
                          {c.contact?.contactName || "Unnamed contact"}
                        </span>

                        {!isOpen && (
                          <span
                            className="block truncate text-muted-foreground"
                            style={{
                              fontFamily: "var(--font-family)",
                              fontSize:
                                "calc(0.74rem * var(--font-scale, 100) / 100)",
                            }}
                          >
                            {c.contact?.email || phones || "No contact details"}
                          </span>
                        )}
                      </div>

                      {/* Badge, menu, chevron */}
                      <div className="flex shrink-0 items-center gap-2">
                        {badge && (
                          <Badge
                            className={`hidden sm:inline-flex border text-[10px] font-medium ${badge.className}`}
                          >
                            {badge.label}
                          </Badge>
                        )}

                        <div onClick={(e) => e.stopPropagation()}>
                          <MenuDropdown
                            contact={c}
                            onUnlink={handleUnlinkContact}
                            onResetPassword={handleResetPassword}
                          />
                        </div>

                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Collapsible body */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-4">
                          {/* Badge on small screens */}
                          {badge && (
                            <Badge
                              className={`sm:hidden border text-[10px] font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </Badge>
                          )}

                          {/* Email + phone */}
                          {/* <div
                            className="space-y-2"
                            style={{
                              fontFamily: "var(--font-family)",
                              fontSize:
                                "calc(0.8rem * var(--font-scale, 100) / 100)",
                            }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              {c.contact?.email ? (
                                <a
                                  href={`mailto:${c.contact.email}`}
                                  className="truncate text-foreground hover:text-primary"
                                >
                                  {c.contact.email}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">
                                  No email
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 min-w-0">
                              <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <span
                                title={phones || undefined}
                                className={`truncate ${
                                  phones
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {phones || "No phone number"}
                              </span>
                            </div>
                          </div> */}
<div
                            className="space-y-2"
                            style={{
                              fontFamily: "var(--font-family)",
                              fontSize:
                                "calc(0.8rem * var(--font-scale, 100) / 100)",
                            }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              {c.contact?.email ? (
                                <a
                                  href={`mailto:${c.contact.email}`}
                                  className="truncate text-foreground hover:text-primary"
                                >
                                  {c.contact.email}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">
                                  No email
                                </span>
                              )}
                            </div>

                            <PhoneNumbersWithFlags text={phones} />
                          </div>
                          {/* Login / Notify / Email Sync */}
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {toggles.map((t) => (
                              <label
                                key={t.key}
                                className={`flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 ${
                                  CONTACT_LOGIN_FEATURES_ENABLED
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed opacity-60"
                                }`}
                              >
                                <Checkbox
                                  checked={!!t.checked}
                                  disabled={!CONTACT_LOGIN_FEATURES_ENABLED}
                                  onCheckedChange={t.onChange}
                                />
                                <span
                                  className="text-foreground"
                                  style={{
                                    fontSize:
                                      "calc(0.78rem * var(--font-scale, 100) / 100)",
                                  }}
                                >
                                  {t.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 py-14 px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>

                <p
                  className="font-medium text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(0.92rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  No contacts linked
                </p>

                <p
                  className="mt-1 text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(0.76rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Add or link contacts to this account.
                </p>

                <Button
                  type="button"
                  onClick={() => setAddContactDrawerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="mt-5 rounded-xl border-border/60 hover:bg-muted/50"
                  style={{
                    fontSize: "calc(0.82rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Add Contact
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account edit drawer */}
      <AccountContactDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          fetchAccountDetails();
        }}
        accountId={account._id}
      />

      {/* Confirm access change modal */}
      <Dialog open={dialogOpen} onOpenChange={handleCancelToggle}>
        <DialogContent
          className="sm:max-w-md rounded-3xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden"
          style={{ fontFamily: "var(--font-family)" }}
        >
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40 space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>

              <div className="space-y-1">
                <DialogTitle
                  className="text-base font-semibold tracking-tight text-foreground"
                  style={{
                    fontSize: "calc(1rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Confirm Access Change
                </DialogTitle>

                <DialogDescription
                  className="text-sm leading-relaxed text-muted-foreground"
                  style={{
                    fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  {newCanLoginValue
                    ? `Grant portal login access to ${selectedContact?.contact.email}?`
                    : `Remove portal login access from ${selectedContact?.contact.email}?`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="rounded-2xl border border-border/50 bg-muted/30 px-4 py-3">
              <p
                className="text-xs font-medium text-muted-foreground mb-1"
                style={{
                  fontSize: "calc(0.72rem * var(--font-scale, 100) / 100)",
                }}
              >
                CONTACT EMAIL
              </p>

              <p
                className="text-sm font-medium text-foreground break-all"
                style={{
                  fontSize: "calc(0.88rem * var(--font-scale, 100) / 100)",
                }}
              >
                {selectedContact?.contact.email}
              </p>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/10 flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancelToggle}
              className="rounded-xl border-border/60 bg-background text-foreground hover:bg-muted/60 hover:text-foreground dark:bg-background/80 dark:border-border/70 dark:text-foreground dark:hover:bg-muted/50 transition-all duration-200"
              style={{
                fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirmToggle}
              className="rounded-xl shadow-sm transition-all duration-200"
              style={{
                fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact drawer */}
      {addContactDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeAddContactDrawer}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-background text-foreground border-l border-border shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-background">
              <div className="space-y-0.5">
                <h2 className="text-base font-semibold tracking-tight">
                  Add Contacts to Account
                </h2>
                <p className="text-xs text-muted-foreground">
                  Search and link existing contacts to this account.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedContactForEdit(null);
                    setMode("create");
                    setContactEditDrawerOpen(true);
                  }}
                >
                  + Create Contact
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeAddContactDrawer}
                  className="h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-4 border-b border-border shrink-0">
              <Input
                placeholder="Search by name or email..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-3">
                {filteredAvailableContacts.map((c) => {
                  const isSelected = selectedContacts.some(
                    (s) => s._id === c._id,
                  );

                  return (
                    <label
                      key={c._id}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedContacts((prev) => [...prev, c]);
                          } else {
                            setSelectedContacts((prev) =>
                              prev.filter((s) => s._id !== c._id),
                            );
                          }
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {c.contactName}
                          </p>

                          {isSelected && (
                            <span className="rounded-full bg-primary/10 text-primary text-[10px] px-2 py-0.5">
                              Selected
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {c.email}
                        </p>
                      </div>
                    </label>
                  );
                })}

                {filteredAvailableContacts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <X className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="font-medium">No contacts found</p>
                    <p className="text-sm text-muted-foreground">
                      Try another search.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-border shrink-0 bg-background">
              <span className="text-sm text-muted-foreground">
                {selectedContacts.length > 0
                  ? `${selectedContacts.length} contact${
                      selectedContacts.length > 1 ? "s" : ""
                    } selected`
                  : "Select contacts to continue"}
              </span>

              <div className="flex gap-2">
                <Button variant="outline" onClick={closeAddContactDrawer}>
                  Cancel
                </Button>

                <Button
                  disabled={selectedContacts.length === 0}
                  onClick={handleLinkContacts}
                >
                  Link
                  {selectedContacts.length > 0 &&
                    ` ${selectedContacts.length}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Edit Drawer */}
      <NewContactDrawer
        open={contactEditDrawerOpen}
        onClose={() => setContactEditDrawerOpen(false)}
        selectedContact={selectedContactForEdit}
        mode={mode}
        onContactUpdated={handleContactUpdated}
      />
    </div>
  );
};

export default AccountDetails;