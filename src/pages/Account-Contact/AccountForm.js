import React, { useState, useEffect, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../../redux/accountContactSlice";
import {
  Autocomplete,
  FormLabel,
  Box,
  // Button,
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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
// import { Label, Input } from "../../components/ui/form";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../components/ui/sheet";
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
 const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";
  // return (
  //   <Box
  //     sx={{
  //       maxWidth: 750,
  //       mx: "auto",
  //       p: 3,
  //     }}
  //   >
  //     {/* CLIENT TYPE */}
  //     <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
  //       <Typography variant="h6" fontWeight={600} mb={1}>
  //         Client Type
  //       </Typography>

  //       <RadioGroup
  //         row
  //         name="clientType"
  //         value={accountData.clientType || ""}
  //         onChange={handleChange}
  //       >
  //         <FormControlLabel
  //           value="Individual"
  //           control={<Radio />}
  //           label="Individual"
  //         />
  //         <FormControlLabel
  //           value="Company"
  //           control={<Radio />}
  //           label="Company"
  //         />
  //       </RadioGroup>
  //     </FormControl>

  //     {/* ACCOUNT INFO */}
  //     <Box mb={4}>
  //       <Typography variant="h6" fontWeight={600} mb={2}>
  //         Account Info
  //       </Typography>

  //       <Stack spacing={2}>
  //         <TextField
  //           size="small"
  //           fullWidth
  //           label="Account Name"
  //           name="accountName"
  //           value={accountData.accountName || ""}
  //           onChange={handleChange}
  //           error={!!errors.accountName}
  //           helperText={errors.accountName}
  //           required
  //         />

  //         {accountData.clientType === "Company" && (
  //           <TextField
  //             fullWidth
  //             size="small"
  //             label="Company Name"
  //             name="companyName"
  //             value={accountData.companyName || ""}
  //             onChange={handleChange}
  //             error={!!errors.companyName}
  //             helperText={errors.companyName}
  //             required
  //           />
  //         )}

  //         <MultiSelectDropdown
  //           value={accountData.teamMembers || []}
  //           options={teamMembers}
  //           onChange={(newValue) =>
  //             dispatch(setAccountData({ teamMembers: newValue }))
  //           }
  //           placeholder="Select Team Members"
  //           width="100%"
  //         />

  //         <TagsMultiSelectDropDown
  //           value={accountData.tags || []}
  //            options={tags}
  //           onChange={(newValue) =>
  //             dispatch(setAccountData({ tags: newValue }))
  //           }
  //           placeholder="Select tags"
  //         />
  //         <Box mt={1}>
  //           {" "}
  //           <Autocomplete
  //             options={folderTemp}
  //             getOptionLabel={(option) => option?.label || ""}
  //             value={accountData.folderTemp || null}
  //             onChange={(e, newValue) =>
  //               handleAutocompleteChange("folderTemp", newValue)
  //             }
  //             renderInput={(params) => (
  //               <TextField
  //                 {...params}
  //                 margin="normal"
  //                 label="Select Folder Template"
  //                 size="small"
  //                 required
  //               />
  //             )}
  //           />
  //         </Box>
  //       </Stack>
  //     </Box>

  //     {/* ADDRESS SECTION */}
  //     {accountData.clientType === "Company" && (
  //       <Box>
  //         <Divider sx={{ mb: 3 }} />

  //         <Typography variant="h6" fontWeight={600} mb={2}>
  //           Address
  //         </Typography>

  //         <Stack spacing={2}>
  //           <Autocomplete
  //             fullWidth
  //             options={options}
  //             getOptionLabel={(option) => option.label}
  //             value={
  //               options.find(
  //                 (opt) => opt.label === accountData?.country?.label,
  //               ) || null
  //             }
  //             onChange={(event, newValue) =>
  //               dispatch(setAccountData({ country: newValue }))
  //             }
  //             isOptionEqualToValue={(option, value) =>
  //               option.label === value?.label
  //             }
  //             renderInput={(params) => (
  //               <TextField {...params} label="Select Country" size="small" />
  //             )}
  //           />

  //           <TextField
  //             fullWidth
  //             size="small"
  //             label="Street Address"
  //             name="streetAddress"
  //             value={accountData.streetAddress || ""}
  //             onChange={handleChange}
  //           />

  //           <Grid
  //             container
  //             rowSpacing={3}
  //             columnSpacing={{ xs: 1, sm: 2, md: 3 }}
  //           >
  //             <Grid size={{ xs: 12, md: 4 }}>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 label="City"
  //                 name="city"
  //                 value={accountData.city || ""}
  //                 onChange={handleChange}
  //               />
  //             </Grid>

  //             <Grid size={{ xs: 12, md: 4 }}>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 label="State"
  //                 name="state"
  //                 value={accountData.state || ""}
  //                 onChange={handleChange}
  //               />
  //             </Grid>
  //             <Grid size={{ xs: 12, md: 4 }}>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 label="Zip Code"
  //                 name="postalCode"
  //                 value={accountData.postalCode || ""}
  //                 onChange={handleChange}
  //               />
  //             </Grid>
  //           </Grid>
  //         </Stack>
  //       </Box>
  //     )}

  //     {/* ACTION BUTTON */}
  //     <Box mt={4} display="flex" justifyContent="flex-end">
  //       <Button
  //         variant="contained"
  //         onClick={onContinue}
  //         sx={{
  //           px: 4,
  //           py: 1,
  //           borderRadius: 2,
  //           textTransform: "none",
  //           fontWeight: 600,
  //         }}
  //       >
  //         Continue
  //       </Button>
  //     </Box>
  //   </Box>
  // );


  return (
  <div className="flex flex-col h-full">
    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto space-y-6 pb-2 px-4">

      {/* Client Type */}
      <div className="space-y-3">
        <SheetHeader className="px-0 py-0 space-y-0.5">
          <SheetTitle className="text-sm font-semibold">Client Type</SheetTitle>
          <SheetDescription className="text-xs">
            Select whether this is an individual or company account.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-6">
          {["Individual", "Company"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="clientType"
                value={type}
                checked={(accountData.clientType || "") === type}
                onChange={handleChange}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm text-foreground">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Account Info */}
      <div className="space-y-3">
        <SheetHeader className="px-0 py-0 space-y-0.5">
          <SheetTitle className="text-sm font-semibold">Account Info</SheetTitle>
          <SheetDescription className="text-xs">
            Enter the primary account details.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>
              Account Name <span className="text-destructive">*</span>
            </Label>
            <Input
              name="accountName"
              value={accountData.accountName || ""}
              placeholder="Account Name"
              className={errors.accountName ? "border-destructive" : ""}
              onChange={handleChange}
            />
            {errors.accountName && (
              <p className="text-xs text-destructive">{errors.accountName}</p>
            )}
          </div>

          {accountData.clientType === "Company" && (
            <div className="space-y-1.5">
              <Label>
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                name="companyName"
                value={accountData.companyName || ""}
                placeholder="Company Name"
                className={errors.companyName ? "border-destructive" : ""}
                onChange={handleChange}
              />
              {errors.companyName && (
                <p className="text-xs text-destructive">
                  {errors.companyName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assignment */}
      <div className="space-y-3">
        <SheetHeader className="px-0 py-0 space-y-0.5">
          <SheetTitle className="text-sm font-semibold">Assignment</SheetTitle>
          <SheetDescription className="text-xs">
            Assign team members, tags and a folder template.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3">
          <MultiSelectDropdown
            value={accountData.teamMembers || []}
            onChange={(newValue) =>
              dispatch(setAccountData({ teamMembers: newValue }))
            }
            options={teamMembers}
            placeholder="Select Team Members"
            width="100%"
          />

          <TagsMultiSelectDropDown
            value={accountData.tags || []}
            onChange={(newValue) =>
              dispatch(setAccountData({ tags: newValue }))
            }
            options={tags}
            placeholder="Select tags"
          />

          <div className="space-y-1.5">
            <Label>
              Folder Template <span className="text-destructive">*</span>
            </Label>
            <select
              value={accountData.folderTemp?.value || ""}
              onChange={(e) => {
                const opt =
                  folderTemp.find((f) => f.value === e.target.value) || null;
                handleAutocompleteChange("folderTemp", opt);
              }}
              className={selectCls}
            >
              <option value="">Select Folder Template</option>
              {folderTemp.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      {accountData.clientType === "Company" && (
        <div className="space-y-3">
          <SheetHeader className="px-0 py-0 space-y-0.5">
            <SheetTitle className="text-sm font-semibold">Address</SheetTitle>
            <SheetDescription className="text-xs">
              Company billing or mailing address.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Country</Label>
              <select
                value={
                  options.find(
                    (o) => o.label === accountData?.country?.label
                  )?.value || ""
                }
                onChange={(e) => {
                  const found =
                    options.find((o) => o.value === e.target.value) || null;
                  dispatch(setAccountData({ country: found }));
                }}
                className={selectCls}
              >
                <option value="">Select Country</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Street Address</Label>
              <Input
                name="streetAddress"
                value={accountData.streetAddress || ""}
                placeholder="Street address"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input
                  name="city"
                  value={accountData.city || ""}
                  placeholder="City"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label>State</Label>
                <Input
                  name="state"
                  value={accountData.state || ""}
                  placeholder="State"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label>ZIP Code</Label>
                <Input
                  name="postalCode"
                  value={accountData.postalCode || ""}
                  placeholder="ZIP Code"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Footer */}
    <SheetFooter className="border-t border-border/40 pt-3 pb-1">
      <div className="flex justify-end w-full">
        <Button size="sm" onClick={onContinue} className="gap-1.5">
          Continue
        </Button>
      </div>
    </SheetFooter>
  </div>
);
}
