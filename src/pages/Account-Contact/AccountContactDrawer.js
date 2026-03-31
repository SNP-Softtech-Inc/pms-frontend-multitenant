


import React, { useEffect } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountContactForm from "./AccountContactForm";
import { useDispatch } from "react-redux";
import { setAccountData, setSelectedContacts, resetForm } from "../../redux/accountContactSlice";
import { accountsAPI } from "../../services/api"; // ✅ import API

export default function AccountContactDrawer({
  open,
  onClose,
  accountId = null,
  // fetchAccountsList,
  handleDrawerClose,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open && accountId) {
      (async () => {
        try {
          // ✅ Use API instead of axios
          const { data: account } = await accountsAPI.getAccountById(accountId);
console.log("Fetched account details:", account);
          // Dispatch account data
          dispatch(setAccountData(account));

          // Map account contacts
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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 700, maxWidth: "100vw" } }}
    >
     
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 3,
    py: 2,
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  }}
>
  <Typography
    variant="h6"
    fontWeight={600}
  >
    {accountId ? "Update Account" : "Create Account"}
  </Typography>

  <IconButton
    onClick={onClose}
    sx={{
      borderRadius: 2,
      "&:hover": {
        bgcolor: "grey.100",
      },
    }}
  >
    <CloseIcon />
  </IconButton>
</Box>

      <Box sx={{ p: 3 }}>
        <AccountContactForm
          isEditing={!!accountId}
          accountId={accountId}
          onCloseDrawer={onClose}
          // fetchAccountsList={fetchAccountsList}
          handleDrawerClose={handleDrawerClose}
        />
      </Box>
    </Drawer>
  );
}