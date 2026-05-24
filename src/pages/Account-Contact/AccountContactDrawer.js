


// import React, { useEffect } from "react";
// import { Drawer, Box, Typography, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import AccountContactForm from "./AccountContactForm";
// import { useDispatch } from "react-redux";
// import { setAccountData, setSelectedContacts, resetForm } from "../../redux/accountContactSlice";
// import { accountsAPI } from "../../services/api"; // ✅ import API

// export default function AccountContactDrawer({
//   open,
//   onClose,
//   accountId = null,
//   // fetchAccountsList,
//   handleDrawerClose,
// }) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (open && accountId) {
//       (async () => {
//         try {
//           // ✅ Use API instead of axios
//           const { data: account } = await accountsAPI.getAccountById(accountId);
// console.log("Fetched account details:", account);
//           // Dispatch account data
//           dispatch(setAccountData(account));

//           // Map account contacts
//           const selectedContacts =
//             account.contacts?.map((c) => ({
//               ...c.contact,
//               login: c.canLogin,
//               notify: c.canNotify || false,
//               emailSync: c.canEmailSync || false,
//               _id: c.contact._id,
//             })) || [];

//           dispatch(setSelectedContacts(selectedContacts));
//         } catch (error) {
//           console.error("Failed to load account data:", error);
//           dispatch(resetForm());
//           onClose();
//         }
//       })();
//     } else if (!open) {
//       dispatch(resetForm());
//     }
//   }, [open, accountId, dispatch, onClose]);

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{ sx: { width: 700, maxWidth: "100vw" } }}
//     >
     
//       <Box
//   sx={{
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     px: 3,
//     py: 2,
//     borderBottom: "1px solid",
//     borderColor: "divider",
//     bgcolor: "background.paper",
//   }}
// >
//   <Typography
//     variant="h6"
//     fontWeight={600}
//   >
//     {accountId ? "Update Account" : "Create Account"}
//   </Typography>

//   <IconButton
//     onClick={onClose}
//     sx={{
//       borderRadius: 2,
//       "&:hover": {
//         bgcolor: "grey.100",
//       },
//     }}
//   >
//     <CloseIcon />
//   </IconButton>
// </Box>

//       <Box sx={{ p: 3 }}>
//         <AccountContactForm
//           isEditing={!!accountId}
//           accountId={accountId}
//           onCloseDrawer={onClose}
//           // fetchAccountsList={fetchAccountsList}
//           handleDrawerClose={handleDrawerClose}
//         />
//       </Box>
//     </Drawer>
//   );
// }


import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetOverlay
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";
import AccountContactForm from "./AccountContactForm";
import { useDispatch } from "react-redux";
import {
  setAccountData,
  setSelectedContacts,
  resetForm,
} from "../../redux/accountContactSlice";
import { accountsAPI } from "../../services/api";

export default function AccountContactDrawer({
  open,
  onClose,
  accountId = null,
  handleDrawerClose,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open && accountId) {
      (async () => {
        try {
          const { data: account } =
            await accountsAPI.getAccountById(accountId);

          console.log("Fetched account details:", account);

          dispatch(setAccountData(account));

          const selectedContacts =
            account.contacts?.map((c) => ({
              ...c.contact,
              login: c.canLogin,
              notify: c.canNotify || false,
              emailSync: c.canEmailSync || false,
              _id: c.contact._id,
            })) || [];

          dispatch(setSelectedContacts(selectedContacts));
        } catch (error) {
          console.error("Failed to load account data:", error);
          dispatch(resetForm());
          onClose();
        }
      })();
    } else if (!open) {
      dispatch(resetForm());
    }
  }, [open, accountId, dispatch, onClose]);

  return (

<Sheet open={open} onOpenChange={onClose}>
  {/* 👇 Use your exact styling */}
  <SheetOverlay className="bg-foreground/20 backdrop-blur-sm" />

  <SheetContent
    side="right"
    className="!w-[700px] !max-w-none p-0 flex flex-col"
  >
    {/* Header */}
    {/* <SheetHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
      <SheetTitle className="text-lg font-semibold">
        {accountId ? "Update Account" : "Create Account"}
      </SheetTitle>
    </SheetHeader> */}
<SheetHeader
  className="
    flex
    flex-row
    items-center
    justify-between
    border-b
    border-border/60
    bg-card/80
    backdrop-blur-xl
    px-6
    py-4
    sticky
    top-0
    z-20
    shadow-sm
  "
>
  <div className="flex flex-col gap-1">
    <SheetTitle
      className="
        text-foreground
        font-semibold
        tracking-tight
      "
      style={{
        fontFamily: "var(--font-family)",
        fontSize:
          "calc(1.125rem * parseFloat(var(--font-scale)) / 100)",
      }}
    >
      {accountId ? "Update Account" : "Create Account"}
    </SheetTitle>

    <p
      className="
        text-xs
        text-muted-foreground
      "
      style={{
        fontFamily: "var(--font-family)",
        fontSize:
          "calc(0.75rem * parseFloat(var(--font-scale)) / 100)",
      }}
    >
      Manage account details and assignments.
    </p>
  </div>
  <div><X className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" onClick={onClose}/></div>
</SheetHeader>
    {/* Body */}
    <div className="p-6 overflow-y-auto flex-1">
      <AccountContactForm
        isEditing={!!accountId}
        accountId={accountId}
        onCloseDrawer={onClose}
        handleDrawerClose={handleDrawerClose}
      />
    </div>
  </SheetContent>
</Sheet>
  );
}