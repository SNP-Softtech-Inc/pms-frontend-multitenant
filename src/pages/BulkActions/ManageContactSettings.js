import React, {
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import { toast } from "react-toastify";

import { accountsAPI } from "../../services/api";

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

    // ================= UI =================
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Bulk edit updates all email addresses linked to selected accounts.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Settings</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {[
                {
                  label: "Login",
                  key: "login",
                  icon: <PersonIcon />,
                },
                {
                  label: "Notify",
                  key: "notify",
                  icon: <NotificationsIcon />,
                },
                {
                  label: "Email Sync",
                  key: "emailSync",
                  icon: <EmailIcon />,
                },
              ].map((item) => (
                <TableRow key={item.key}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {item.icon}
                      <Typography>{item.label}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={settings[item.key]}
                      onChange={(e) =>
                        handleSettingChange(item.key, e.target.value)
                      }
                      size="small"
                      sx={{ width: 160 }}
                    >
                      <MenuItem value="Assign to all">
                        Assign to all
                      </MenuItem>
                      <MenuItem value="Remove from all">
                        Remove from all
                      </MenuItem>
                      <MenuItem value="Do nothing">
                        Do nothing
                      </MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
);

export default ManageContactSettings;