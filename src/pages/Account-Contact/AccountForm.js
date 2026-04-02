import React, { useState, useEffect, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../../redux/accountContactSlice";
import {
  Autocomplete,
  FormLabel,
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Radio,
  FormControlLabel,
  RadioGroup,
  Grid,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import countryList from "react-select-country-list";
import { templateAPI } from "../../services/api";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import { folderManagementAPI,authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext"; // adjust path
export default function AccountForm({ onContinue, isEditing = false }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { accountData } = useSelector((state) => state.accountContact);
  const [errors, setErrors] = useState({});

  const [tags, setTags] = useState([]);
  const [folderTemp, setFolderTemp] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  console.log("accountdata", accountData);

  const handleChange = (e) => {
    dispatch(setAccountData({ [e.target.name]: e.target.value }));
  };

  // Fetch Folder Templates
  useEffect(() => {
    const fetchFolderTemps = async () => {
      try {
        const res = await folderManagementAPI.getFolderTemplates();
        const data = res.data;

        if (data.folderTemplates?.length > 0) {
          const folderOptions = data.folderTemplates.map((folder) => ({
            value: folder._id,
            label: folder.templatename,
          }));

          setFolderTemp(folderOptions);

          const lastTemplate = folderOptions[folderOptions.length - 1];

          // ✅ EDIT MODE
          if (isEditing) {
            if (typeof accountData.folderTemp === "string") {
              const selectedFolder = folderOptions.find(
                (f) => f.value === accountData.folderTemp,
              );

              dispatch(
                setAccountData({
                  folderTemp: selectedFolder || lastTemplate,
                }),
              );
            } else if (!accountData.folderTemp) {
              dispatch(setAccountData({ folderTemp: lastTemplate }));
            }
          }

          // ✅ NEW MODE (only if not already set)
          else if (!accountData.folderTemp) {
            dispatch(setAccountData({ folderTemp: lastTemplate }));
          }
        } else {
          setFolderTemp([]);
        }
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };

    fetchFolderTemps();
  }, [isEditing, dispatch]);

  // Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await templateAPI.getAllTags();
        const tagsData = res?.data?.tags || [];
        console.log("Fetched tags bbb:", tagsData);
        const tagsOptions = tagsData.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));
        setTags(tagsOptions);

        // If editing and we have tag IDs, map them to the correct format
        if (
          accountData.tags &&
          accountData.tags.length > 0 &&
          typeof accountData.tags[0] === "string"
        ) {
          const selectedTags = tagsOptions.filter((tag) =>
            accountData.tags.includes(tag.value),
          );
          dispatch(setAccountData({ tags: selectedTags }));
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [accountData.tags]);

 useEffect(() => {
  const fetchTeamMembers = async () => {
    try {
      const res = await authAPI.getAllUsers({
        page: 1,
        limit: 50,
        status: "active",
      });

      const users = res?.data?.users || [];

      const teamMembersOptions = users.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      setTeamMembers(teamMembersOptions);

      // ================= EDIT MODE =================
      if (
        isEditing &&
        accountData.teamMember &&
        accountData.teamMember.length > 0
      ) {
        const selectedTeamMembers = teamMembersOptions.filter((member) =>
          accountData.teamMember.includes(member.value)
        );

        dispatch(setAccountData({ teamMembers: selectedTeamMembers }));
      }

      // ================= CREATE MODE =================
      else if (!isEditing && user?.id) {
        const loggedInUser = teamMembersOptions.find(
          (member) => member.value === user.id
        );

        if (loggedInUser) {
          console.log("Auto-selecting logged-in user:", loggedInUser);

          dispatch(
            setAccountData({ teamMembers: [loggedInUser] })
          );
        }
      }
    } catch (err) {
      console.error("User fetch error:", err?.response || err);
    }
  };

  fetchTeamMembers();
}, [isEditing, accountData.teamMember, user]);

  const handleAutocompleteChange = (field, newValue) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    dispatch(setAccountData({ [field]: newValue }));
  };

  const options = useMemo(() => countryList().getData(), []);

  return (
    <Box
      sx={{
        maxWidth: 750,
        mx: "auto",
        p: 3,
      }}
    >
      {/* CLIENT TYPE */}
      <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Client Type
        </Typography>

        <RadioGroup
          row
          name="clientType"
          value={accountData.clientType || ""}
          onChange={handleChange}
        >
          <FormControlLabel
            value="Individual"
            control={<Radio />}
            label="Individual"
          />
          <FormControlLabel
            value="Company"
            control={<Radio />}
            label="Company"
          />
        </RadioGroup>
      </FormControl>

      {/* ACCOUNT INFO */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Account Info
        </Typography>

        <Stack spacing={2}>
          <TextField
            size="small"
            fullWidth
            label="Account Name"
            name="accountName"
            value={accountData.accountName || ""}
            onChange={handleChange}
            error={!!errors.accountName}
            helperText={errors.accountName}
            required
          />

          {accountData.clientType === "Company" && (
            <TextField
              fullWidth
              size="small"
              label="Company Name"
              name="companyName"
              value={accountData.companyName || ""}
              onChange={handleChange}
              error={!!errors.companyName}
              helperText={errors.companyName}
              required
            />
          )}

          <MultiSelectDropdown
            value={accountData.teamMembers || []}
            options={teamMembers}
            onChange={(newValue) =>
              dispatch(setAccountData({ teamMembers: newValue }))
            }
            placeholder="Select Team Members"
            width="100%"
          />

          <TagsMultiSelectDropDown
            value={accountData.tags || []}
             options={tags}
            onChange={(newValue) =>
              dispatch(setAccountData({ tags: newValue }))
            }
            placeholder="Select tags"
          />
          <Box mt={1}>
            {" "}
            <Autocomplete
              options={folderTemp}
              getOptionLabel={(option) => option?.label || ""}
              value={accountData.folderTemp || null}
              onChange={(e, newValue) =>
                handleAutocompleteChange("folderTemp", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  label="Select Folder Template"
                  size="small"
                  required
                />
              )}
            />
          </Box>
        </Stack>
      </Box>

      {/* ADDRESS SECTION */}
      {accountData.clientType === "Company" && (
        <Box>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" fontWeight={600} mb={2}>
            Address
          </Typography>

          <Stack spacing={2}>
            <Autocomplete
              fullWidth
              options={options}
              getOptionLabel={(option) => option.label}
              value={
                options.find(
                  (opt) => opt.label === accountData?.country?.label,
                ) || null
              }
              onChange={(event, newValue) =>
                dispatch(setAccountData({ country: newValue }))
              }
              isOptionEqualToValue={(option, value) =>
                option.label === value?.label
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Country" size="small" />
              )}
            />

            <TextField
              fullWidth
              size="small"
              label="Street Address"
              name="streetAddress"
              value={accountData.streetAddress || ""}
              onChange={handleChange}
            />

            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="City"
                  name="city"
                  value={accountData.city || ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="State"
                  name="state"
                  value={accountData.state || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Zip Code"
                  name="postalCode"
                  value={accountData.postalCode || ""}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      )}

      {/* ACTION BUTTON */}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={onContinue}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
