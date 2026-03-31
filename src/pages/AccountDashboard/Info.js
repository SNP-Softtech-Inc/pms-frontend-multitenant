import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  IconButton,
  Drawer,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  accountsAPI,
  contactsAPI,
  templateAPI,
  authAPI,
} from "../../services/api"; // update path
import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";
// import ContactForm from "../../Pages/UpdateContact";
import MenuDropdown from "./MenuDropdown";
import UploadProfilePicture from "./ProfilePictureUpload";

import { Autocomplete, TextField } from "@mui/material";

const AccountDetails = () => {
  const { accountId } = useParams();
  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));

  const [account, setAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [tagList, setTagList] = useState([]);
  const [teamMemberList, setTeamMemberList] = useState([]);

  const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState(null);

  // ================= FETCH ACCOUNT DETAILS =================
  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccount(res.data);
    } catch (err) {
      console.error("Error fetching account details:", err);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  // ================= FETCH AVAILABLE CONTACTS =================
  const fetchAvailableContacts = async () => {
    try {
      const res = await contactsAPI.getContacts();
      const currentContactIds =
        account?.contacts?.map((c) => c.contact._id) || [];
      const filteredContacts = res.data.filter(
        (contact) => !currentContactIds.includes(contact._id),
      );
      setAvailableContacts(filteredContacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  useEffect(() => {
    if (addContactDrawerOpen && account) fetchAvailableContacts();
  }, [addContactDrawerOpen, account]);

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
  // const accountTags = tagList.length
  //   ? tagList.filter((tag) => account?.tags?.includes(tag._id))
  //   : [];

  // const assignedMembers = teamMemberList.length
  //   ? teamMemberList.filter((member) =>
  //       account?.teamMember?.includes(member._id)
  //     )
  //   : [];
  const accountTags = tagList.length
    ? tagList.filter((tag) => account?.tags?.includes(tag.value))
    : [];

  const assignedMembers = teamMemberList.length
    ? teamMemberList.filter((member) =>
        account?.teamMember?.includes(member.value),
      )
    : [];

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
    } catch (err) {
      console.error("Error linking contacts:", err);
    }
  };

  const handleUnlinkContact = async (contact) => {
    if (!window.confirm(`Unlink ${contact.contact.contactName}?`)) return;
    try {
      await accountsAPI.removeContactFromAccount(
        account._id,
        contact.contact._id,
      );
      await fetchAccountDetails();
    } catch (err) {
      console.error("Error unlinking contact:", err);
    }
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
      await fetch(`${process.env.REACT_APP_USER_LOGIN}/auth/forgot-password`, {
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
    setSelectedContactForEdit(contactData.contact);
    setContactEditDrawerOpen(true);
  };

  const handleContactUpdated = () => fetchAccountDetails();

  if (!account) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* LEFT SIDE - ACCOUNT DETAILS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="bold">
                Account Details
              </Typography>
              <Tooltip
                title={
                  storedData?.teammember?.manageAccounts === false
                    ? "No permission to edit accounts"
                    : ""
                }
              >
                <span>
                  <Button
                    variant="contained"
                    onClick={() => setDrawerOpen(true)}
                    disabled={storedData?.teammember?.manageAccounts === false}
                  >
                    Edit
                  </Button>
                </span>
              </Tooltip>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Avatar + Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <UploadProfilePicture
                accountId={account._id}
                currentImage={account.profilePicture}
                onUploadSuccess={fetchAccountDetails}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {account.accountName}
                </Typography>
                <Typography color="text.secondary">
                  {account.clientType}
                </Typography>
              </Box>
            </Box>

           
            {/* TAGS */}
<Box
  sx={{
    mt: 3,
    p: 2,
    borderRadius: 3,
    background: "#f9fafb",
    border: "1px solid #eee",
  }}
>
  <Typography
    variant="subtitle1"
    sx={{ fontWeight: 600, mb: 1, color: "#333" }}
  >
    Tags
  </Typography>

  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
    {accountTags?.length > 0 ? (
      accountTags.map((tag) => (
        <Chip
          key={tag.value}
          label={tag.label}
          sx={{
            backgroundColor: tag.colour,
            color: "#fff",
            fontWeight: 500,
            borderRadius: "8px",
            px: 0.5,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            },
          }}
        />
      ))
    ) : (
      <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
        No tags assigned
      </Typography>
    )}
  </Box>
</Box>

{/* TEAM MEMBERS */}
<Box
  sx={{
    mt: 3,
    p: 2,
    borderRadius: 3,
    background: "#f9fafb",
    border: "1px solid #eee",
  }}
>
  <Typography
    variant="subtitle1"
    sx={{ fontWeight: 600, mb: 1, color: "#333" }}
  >
    Team Members
  </Typography>

  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
    {assignedMembers?.length > 0 ? (
      assignedMembers.map((m) => (
        <Chip
          key={m.value}
          label={m.label}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            fontWeight: 500,
            backgroundColor: "#fff",
            border: "1px solid #d0d5dd",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              borderColor: "#1976d2",
            },
          }}
        />
      ))
    ) : (
      <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
        No team members assigned
      </Typography>
    )}
  </Box>
</Box>
          </Paper>
        </Grid>

        {/* RIGHT SIDE - CONTACTS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="bold">
                Contacts
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => setAddContactDrawerOpen(true)}
              >
                ADD CONTACT
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* CONTACT LIST */}
            {account.contacts?.length > 0 ? (
              account.contacts.map((c) => (
                <Box key={c.contact._id}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 2, py: 2 }}
                  >
                    <Box flex={1}>
                      <Tooltip
                        title={
                          storedData?.teammember?.manageContacts === false
                            ? "No permission to edit contacts"
                            : ""
                        }
                      >
                        <span>
                          <Typography
                            fontWeight="bold"
                            sx={{
                              cursor:
                                storedData?.teammember?.manageContacts === false
                                  ? "not-allowed"
                                  : "pointer",
                              color:
                                storedData?.teammember?.manageContacts === false
                                  ? "gray"
                                  : "inherit",
                              opacity:
                                storedData?.teammember?.manageContacts === false
                                  ? 0.6
                                  : 1,
                            }}
                            onClick={() => {
                              if (
                                storedData?.teammember?.manageContacts === false
                              )
                                return;
                              handleOpenContactEditDrawer(c);
                            }}
                          >
                            {c.contact.contactName}
                          </Typography>
                        </span>
                      </Tooltip>
                      <Typography color="text.secondary" fontSize={14}>
                        {c.contact.email || "-"}
                      </Typography>
                    </Box>

                    {/* Switches */}
                    <Box
                      width={260}
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Switch
                        checked={c.canLogin}
                        onChange={() => handleSwitchClick(c)}
                        color="primary"
                        disabled
                      />
                      <Switch
                        checked={c.canNotify}
                        onChange={() => handleNotifyToggle(c)}
                        color="primary"
                        disabled
                      />
                      <Switch
                        checked={c.canEmailSync}
                        onChange={() => handleEmailSyncToggle(c)}
                        color="primary"
                      />
                      <MenuDropdown
                        contact={c}
                        onUnlink={handleUnlinkContact}
                        onResetPassword={handleResetPassword}
                      />
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              ))
            ) : (
              <Typography sx={{ p: 2 }}>No contacts found</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Account Edit Drawer */}
      <AccountContactDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          fetchAccountDetails();
        }}
        accountId={account._id}
      />

      {/* Login Confirm Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancelToggle}>
        <DialogTitle>Confirm Access Change</DialogTitle>
        <DialogContent>
          <Typography>
            {newCanLoginValue
              ? `Give portal access to ${selectedContact?.contact.email}?`
              : `Remove portal access from ${selectedContact?.contact.email}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelToggle} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmToggle}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Contact Drawer */}
      <Drawer
        anchor="right"
        open={addContactDrawerOpen}
        onClose={() => {
          setAddContactDrawerOpen(false);
          setSelectedContacts([]);
        }}
        PaperProps={{ sx: { width: 500, p: 5 } }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Add Contacts to Account
          </Typography>
          <Autocomplete
            multiple
            options={availableContacts}
            getOptionLabel={(option) =>
              `${option.contactName} (${option.email})`
            }
            value={selectedContacts}
            onChange={(event, newValue) => setSelectedContacts(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search contacts..."
                variant="outlined"
                fullWidth
              />
            )}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setAddContactDrawerOpen(false);
                setSelectedContacts([]);
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLinkContacts}
              variant="contained"
              disabled={selectedContacts.length === 0}
            >
              Link Contacts ({selectedContacts.length})
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Contact Edit Drawer */}
      <Drawer
        anchor="right"
        open={contactEditDrawerOpen}
        onClose={() => setContactEditDrawerOpen(false)}
        sx={{ width: 600 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography variant="h6" fontWeight="bold">
            Edit Contact
          </Typography>
          <IconButton onClick={() => setContactEditDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {/* {selectedContactForEdit && (
          <ContactForm
            selectedContact={selectedContactForEdit}
            handleClose={() => setContactEditDrawerOpen(false)}
            onContactUpdated={handleContactUpdated}
          />
        )} */}
      </Drawer>
    </Box>
  );
};

export default AccountDetails;
