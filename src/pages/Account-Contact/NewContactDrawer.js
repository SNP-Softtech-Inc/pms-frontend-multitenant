import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { contactsAPI } from "../../services/api";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import {
  Grid,
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  TextField,
  Autocomplete,
  InputLabel,
  Chip,
  Alert,
} from "@mui/material";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import CloseIcon from "@mui/icons-material/Close";
const NewContactDrawer = ({ open, onClose, selectedContact, mode }) => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const queryClient = useQueryClient();
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Individual state hooks for form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [combinedValues, setCombinedValues] = useState();
  const [ssnError, setSsnError] = useState("");
  console.log(selectedCountry);
  // SSN auto-formatter
  const formatSSN = (value) => {
    const v = value.replace(/\D/g, "").slice(0, 9); // only digits

    if (v.length > 5) return `${v.slice(0, 3)}-${v.slice(3, 5)}-${v.slice(5)}`;
    if (v.length > 3) return `${v.slice(0, 3)}-${v.slice(3)}`;
    return v;
  };

  // SSN validation rules
  const validateSSN = (value) => {
    const cleaned = value.replace(/-/g, "");

    if (cleaned.length !== 9) return "SSN must be 9 digits";

    if (/^(000|666|9\d{2})/.test(cleaned)) return "Invalid SSN starting digits";
    if (/^\d{3}00\d{4}$/.test(cleaned)) return "Invalid SSN middle digits";
    if (/^\d{5}0000$/.test(cleaned)) return "Invalid SSN last digits";

    return ""; // valid
  };

  useEffect(() => {
    if (mode === "edit" && selectedContact) {
      console.log(selectedContact);
      setFirstName(selectedContact.firstName || "");
      setMiddleName(selectedContact.middleName || "");
      setLastName(selectedContact.lastName || "");
      setContactName(selectedContact.contactName || "");
      setCompanyName(selectedContact.companyName || "");
      setEmail(selectedContact.email || "");
      setNote(selectedContact.note || "");
      setSsn(selectedContact.ssn || "");

      setStreetAddress(selectedContact.streetAddress || "");
      setCity(selectedContact.city || "");
      setState(selectedContact.state || "");
      setPostalCode(selectedContact.postalCode || "");

      // phones
      const phones =
        selectedContact.phoneNumbers?.map((p, i) => ({
          id: Date.now() + i,
          phone: p,
          country: "us",
        })) || [];

      setPhoneNumbers(phones);

      // tags
      // ✅ FIX TAGS
    if (selectedContact.tags && selectedContact.tags.length > 0) {
      const formattedTags = selectedContact.tags.map((tag) => ({
        label: tag.tagName,
        value: tag._id,
        color: tag.tagColour,
      }));

      setSelectedTags(formattedTags); // 👈 IMPORTANT (for UI)
      setCombinedValues(formattedTags.map((t) => t.value)); // 👈 for API
    } else {
      setSelectedTags([]);
      setCombinedValues([]);
    }
  }
    

    if (mode === "create") {
      resetForm();
    }
  }, [selectedContact, mode]);

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setContactName("");
    setCompanyName("");
    setEmail("");
    setNote("");
    setSsn("");
    setStreetAddress("");
    setCity("");
    setState("");
    setPostalCode("");
    setPhoneNumbers([]);
    setSelectedTags([]);
    setCombinedValues([]);
  };

  // Main change handler
  const handleSSNChange = (e) => {
    const formatted = formatSSN(e.target.value);
    setSsn(formatted);

    const error = validateSSN(formatted);
    setSsnError(error); // "" means no error
  };

  const options = useMemo(() => countryList().getData(), []);

  const handlePhoneNumberChange = (phoneValue, countryData, id) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.map((item) =>
        item.id === id
          ? {
              ...item,
              phone: phoneValue,
              countryCode: countryData.dialCode, // Store country dial code
              country: countryData.countryCode.toLowerCase(), // Store country code (e.g., 'us')
            }
          : item,
      ),
    );
  };
  // Update contactName when firstName, middleName, or lastName changes
  useEffect(() => {
    setContactName(`${firstName} ${middleName} ${lastName}`.trim());
  }, [firstName, middleName, lastName]);

  const handleAddPhoneNumber = () => {
    setPhoneNumbers((prevPhoneNumbers) => [
      ...prevPhoneNumbers,
      {
        id: Date.now(),
        phone: "",
        country: "us", // Default country
        isPrimary: false,
      },
    ]);
  };

  const handleDeletePhoneNumber = (id) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.filter((item) => item.id !== id),
    );
  };

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmaileError] = useState("");
  const validateForm = () => {
    let isValid = true;
    if (!firstName) {
      setFirstNameError("First name is required");

      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // ✅ Check: At least Email OR Phone Number
    const hasEmail = email?.trim();
    const hasPhone = phoneNumbers.some((p) => p.phone && p.phone.trim() !== "");

    if (!hasEmail && !hasPhone) {
      toast.info("At least Email or Phone Number is required");
      // setEmaileError("Email or Phone Number is required");
      isValid = false;
    } else {
      setEmaileError("");
    }

    // ✅ If email exists, validate format
    if (hasEmail) {
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
        setEmaileError("Please enter a valid email address.");
        isValid = false;
      }
    }
    return isValid;
  };

  const sendingData = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formattedPhoneNumbers = phoneNumbers.map((item) => item.phone);
    const countryPayload = selectedCountry
      ? { name: selectedCountry.label, code: selectedCountry.value }
      : null;
    const payload = {
      firstName,
      middleName,
      lastName,
      contactName,
      companyName,
      note,
      ssn,
      email,
      tags: combinedValues,
      country: countryPayload,
      streetAddress,
      city,
      state,
      postalCode,
      phoneNumbers: formattedPhoneNumbers,
    };

    try {
      if (mode === "edit") {
        await contactsAPI.updateContactWithoutPassword(
          selectedContact._id,
          payload,
        );
        toast.success("Contact updated successfully!");
      } else {
        await contactsAPI.createContact(payload);
        toast.success("Contact created successfully!");
      }

      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  //   const sendingData = async (e) => {
  //     e.preventDefault();

  //     if (!validateForm()) return;

  //     const formattedPhoneNumbers = phoneNumbers.map((item) => item.phone);

  // const countryPayload = selectedCountry
  //   ? { name: selectedCountry.label, code: selectedCountry.value }
  //   : null;

  //     const payload = {
  //       firstName,
  //       middleName,
  //       lastName,
  //       contactName,
  //       companyName,
  //       note,
  //       ssn,
  //       email,
  //       tags: combinedValues,
  //       country: countryPayload,
  //       streetAddress,
  //       city,
  //       state,
  //       postalCode,
  //       phoneNumbers: formattedPhoneNumbers,
  //     };

  //     try {
  //       const res = await contactsAPI.createContact(payload);
  //       toast.success("Contact created successfully!");
  //       onClose();
  //         // 🔥 THIS refreshes table automatically
  //       queryClient.invalidateQueries({ queryKey: ["contacts"] });
  //       // navigate("/clients/contacts");
  //     } catch (error) {
  //       const errMsg = error?.response?.data?.error || "Failed to create contact";
  //       // If email conflict
  //       if (error?.response?.status === 409) {
  //         setEmaileError(errMsg);
  //         toast.warning("Entered email is already used");
  //         return;
  //       }
  //       toast.error(errMsg);
  //     }
  //   };

  const [selectedTags, setSelectedTags] = useState([]);

  //Tag FetchData ================
  const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    console.log(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
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
        <Typography variant="h6">
          {mode === "edit" ? "Edit Contact" : "New Contact"}
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
      <Box>
        <Box
          component="form"
          sx={{
            px: "3%",
            height: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Name Fields */}
          <Box m={2}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  value={firstName}
                  label="First Name *"
                  placeholder="First Name *"
                  size="small"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFirstName(value);
                    if (value.trim() !== "") setFirstNameError("");
                  }}
                  error={!!firstNameError}
                />

                {firstNameError && (
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{
                      mt: 0.5,
                      fontSize: "11px",
                      borderRadius: "10px",
                      height: "23px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": { fontSize: "16px", mr: 1 },
                    }}
                  >
                    {firstNameError}
                  </Alert>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  name="middleName"
                  value={middleName}
                  label="Middle Name"
                  placeholder="Middle Name"
                  size="small"
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  name="lastName"
                  value={lastName}
                  label="Last Name *"
                  placeholder="Last Name *"
                  size="small"
                  onChange={(e) => {
                    const value = e.target.value;
                    setLastName(value);
                    if (value.trim() !== "") setLastNameError("");
                  }}
                  error={!!lastNameError}
                />
                {lastNameError && (
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{
                      mt: 0.5,
                      fontSize: "11px",
                      borderRadius: "10px",
                      height: "23px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": { fontSize: "16px", mr: 1 },
                    }}
                  >
                    {lastNameError}
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Box>
          {/* Contact & Company */}
          <Stack spacing={2} m={2}>
            <Box>
              <TextField
                fullWidth
                name="contactName"
                label="Contact Name"
                value={contactName}
                placeholder="Contact Name"
                size="small"
                onChange={(e) => setContactName(e.target.value)}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                name="companyName"
                label="Company Name"
                value={companyName}
                placeholder="Company Name"
                size="small"
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Box>

            {/* Email */}
            <Box>
              <TextField
                fullWidth
                name="email"
                value={email}
                placeholder="Email *"
                label="Email *"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
              />
              {emailError && (
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{
                    mt: 0.5,
                    fontSize: "11px",
                    borderRadius: "10px",
                    height: "23px",
                    display: "flex",
                    alignItems: "center",
                    "& .MuiAlert-icon": { fontSize: "16px", mr: 1 },
                  }}
                >
                  {emailError}
                </Alert>
              )}
            </Box>
          </Stack>

          {/* Tags & Note */}
          <Stack spacing={2} m={2}>
            <Box>
              <TagsMultiSelectDropDown
                value={selectedTags}
                onChange={handleTagChange}
                placeholder="Tags"
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                name="note"
                multiline
                size="small"
                placeholder="Note"
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Box>

            {/* SSN */}
            <Box>
              <TextField
                fullWidth
                name="ssn"
                value={ssn}
                placeholder="123-45-6789"
                size="small"
                label="SSN"
                onChange={handleSSNChange}
                error={!!ssnError}
                helperText={ssnError || "Format: 123-45-6789"}
                inputProps={{
                  maxLength: 11,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Box>
          </Stack>

          {/* Phone Numbers */}
          <Typography variant="h6" mt={3} m={2} fontWeight="bold">
            Phone Numbers
          </Typography>
          <Stack spacing={2} m={2}>
            {phoneNumbers.map((phone) => (
              <Box key={phone.id} sx={{ position: "relative" }}>
                {phone.isPrimary && (
                  <Chip
                    label="Primary phone"
                    color="primary"
                    size="small"
                    sx={{ position: "absolute", top: -20, left: 0 }}
                  />
                )}
                <Box display="flex" alignItems="center" gap={2}>
                  <PhoneInput
                    country="us"
                    value={phone.phone}
                    onChange={(value, country) =>
                      handlePhoneNumberChange(value, country, phone.id)
                    }
                    inputStyle={{ width: "100%" }}
                    buttonStyle={{
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    }}
                    containerStyle={{ display: "flex", flex: 1 }}
                  />
                  <AiOutlineDelete
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeletePhoneNumber(phone.id)}
                  />
                </Box>
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "blue",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={handleAddPhoneNumber}
            >
              <AiOutlinePlusCircle />
              <Typography>Add phone number</Typography>
            </Box>
          </Stack>

          {/* Address */}
          <Typography variant="h6" m={2} fontWeight="bold">
            Address
          </Typography>
          <Stack spacing={2} m={2}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              value={selectedCountry}
              onChange={(e, newVal) => setSelectedCountry(newVal)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Country"
                  size="small"
                />
              )}
            />
            <TextField
              fullWidth
              name="streetAddress"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Street address"
              size="small"
              label="Street Address"
            />
          </Stack>
          <Box m={2}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid size={{ xs: 12, md: 4 }}>
                {" "}
                <TextField
                  fullWidth
                  name="city"
                  value={city}
                  placeholder="City"
                  label="City"
                  size="small"
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  name="state"
                  value={state}
                  label="State/Province"
                  placeholder="State/Province"
                  size="small"
                  onChange={(e) => setState(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  name="postalCode"
                  value={postalCode}
                  placeholder="ZIP/Postal Code"
                  label="ZIP/Postal Code"
                  size="small"
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
              mb: 2,
            }}
          >
            <Button variant="contained" onClick={sendingData}>
              Create
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NewContactDrawer;
