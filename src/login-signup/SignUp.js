import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel, Box, Alert } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Autocomplete } from "@mui/material";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import firmsetting from "../Images/setting.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import logo from "../Images/logoAdmin.png";
import micropms from "../Images/micropms.png";
import { Link, Divider, IconButton, Typography, TextField, InputLabel, Checkbox, FormHelperText, Button, Grid, FormControl, Slider, Input, CircularProgress } from "@mui/material";
import { authAPI } from "../services/api";

const MyForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const handleAdminLogin = () => {
    navigate("/login");
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState(3);
  const [settingsStep, setSettingsStep] = useState(8);
  const [showEmailContent, setShowEmailContent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(true);
  const steps = ["Email", "Information", "Settings"];

  // Email verification state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Countries and states
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [firmName, setFirmName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountryD, setSelectedCountryD] = useState("");

  // Firm details
  const [firmSize, setFirmSize] = useState(1);
  const [inputValue, setInputValue] = useState(1);
  const [referenceFrom, setReferenceFrom] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [role, setRole] = useState("");

  // Personal info
  const [firstname, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");

  // Settings
  const [currencies, setCurrencies] = useState([]);
  const [url, setUrl] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Terms
  const [isChecked, setIsChecked] = useState(false);

  // Service options
  const serviceOptions = [
    "TaxPreparation",
    "TaxPlanning",
    "Advisory",
    "Resolution",
    "Payroll",
    "Accounting",
    "Audit",
    "LawFirm",
    "Bookkeeping",
    "Other"
  ];

  const referenceOptions = [
    "Google search",
    "Capterra/ Get app/ G2",
    "From a friend",
    "Offline event",
    "Social media",
    "Taxdome consultant/ Partner",
    "Other"
  ];

  const roleOptions = [
    "Owner or partner",
    "Book keeper or Accountant",
    "Operations / office Manager",
    "Admin",
    "Assistant",
    "Other"
  ];

  const languages = [
    { value: "English(British)", label: "English(British)" },
    { value: "Deutsch", label: "Deutsch" },
    { value: "Italiano", label: "Italiano" },
    { value: "Nederlands", label: "Nederlands" },
    { value: "Suomi", label: "Suomi" },
    { value: "Dansk", label: "Dansk" },
  ];

  // Button states
  const [buttonStates, setButtonStates] = useState([false, false, false, false, false, false, false]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [buttonStates2, setButtonStates2] = useState({});
  const [buttonStates3, setButtonStates3] = useState([false, false, false, false, false, false]);

  // Initialize button states
  useEffect(() => {
    const initialStates = {};
    serviceOptions.forEach(service => {
      initialStates[service] = false;
    });
    setButtonStates2(initialStates);
  }, []);

  // Password validation
  const passwordValidation = {
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasMinLength: password.length >= 8,
  };

  // Fetch countries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const countryOptions = data.data.map((country) => ({
          label: country.name,
        }));
        setCountries(countryOptions);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch states
  useEffect(() => {
    const getStatesData = async () => {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states");
        const data = await response.json();
        setStates(data.data);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };
    getStatesData();
  }, []);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        const currencyOptions = Object.keys(data.rates).map(currency => ({
          value: currency,
          label: `${currency} - ${currency}`,
        }));
        setCurrencies(currencyOptions);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  const countryStates = states.find((country) => country.name === selectedCountry)?.states || [];
  const stateOptions = countryStates.map((state, index) => ({
    value: state.name,
    label: state.name,
  }));

  // OTP Handlers
  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      // First check if email already exists
    //   const checkResponse = await authAPI.checkEmailExists(email);
    //   if (checkResponse.data.user && checkResponse.data.user.length > 0) {
    //     toast.error("User with this email already exists");
    //     setLoading(false);
    //     return;
    //   }

      // Send OTP
      await authAPI.sendOTP(email);
      setShowEmailContent(true);
      setApiSuccess("OTP sent to your email");
      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Send OTP error:", error);
      console.log("failed to send otp",error)
      setApiError(error.response?.data?.message || "Failed to send OTP");
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await authAPI.verifyOTP(email, otp);
      setIsEmailVerified(true);
      setApiSuccess("Email verified successfully");
      toast.success("Email verified successfully");
      handleNext();
    } catch (error) {
      console.error("Verify OTP error:", error);
      setApiError(error.response?.data?.message || "Failed to verify OTP");
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setApiError("");

    try {
      await authAPI.resendOTP(email);
      setApiSuccess("OTP resent successfully");
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Resend OTP error:", error);
      setApiError(error.response?.data?.message || "Failed to resend OTP");
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleClearOtp = () => {
    setOtp("");
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (subStep < 7) {
        setSubStep((prevSubStep) => prevSubStep + 1);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (settingsStep < 9) {
        setSettingsStep((prevSettingsStep) => prevSettingsStep + 1);
      }
    }
  };

  const setValbox = (event) => {
    setIsChecked(event.target.checked);
  };

  const createAccount = async () => {
    if (!email) {
      toast.error("Email is required!");
      return;
    }
    if (!isChecked) {
      toast.error("Accept terms and conditions");
      return;
    }
    await handleSendOTP();
  };

  // Validation functions
  const submitUserinfo = (e) => {
    e.preventDefault();
    if (firstname === "") {
      toast.error("First Name Required!");
    } else if (lastName === "") {
      toast.error("Last Name Required!");
    } else if (phoneNumber === "") {
      toast.error("Phone number required");
    } else {
      handleNext();
    }
  };

  const submitFerminfo = (e) => {
    e.preventDefault();
    if (firmName === "") {
      toast.error("Firm Name Required!");
    } else if (selectedCountry === "") {
      toast.error("Select Country!");
    } else if (selectedState === "") {
      toast.error("Select state!");
    } else {
      handleNext();
    }
  };

  const submitFirmDetail = (e) => {
    e.preventDefault();
    if (firmSize === 0) {
      toast.error("Select Firm Size!");
    } else if (!referenceFrom) {
      toast.error("Select how you heard about us!");
    } else {
      handleNext();
    }
  };

  const handleServiceToggle = (service) => {
    setButtonStates2(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const selectedServicesList = Object.keys(buttonStates2).filter(key => buttonStates2[key]);

  const handleSelectAll = () => {
    const allSelected = selectedServicesList.length === serviceOptions.length;
    const newStates = {};
    serviceOptions.forEach(service => {
      newStates[service] = !allSelected;
    });
    setButtonStates2(newStates);
  };

  const submitService = (e) => {
    e.preventDefault();
    if (selectedServicesList.length === 0) {
      toast.error("Select at least one service!");
    } else {
      handleNext();
    }
  };

  const handleToggle3 = (index) => {
    const updatedStates = buttonStates3.map((state, i) => (i === index ? !state : false));
    setButtonStates3(updatedStates);
    setRole(roleOptions[index]);
  };

  const submitRole = (e) => {
    e.preventDefault();
    if (!role) {
      toast.error("Select your role!");
    } else {
      handleNext();
    }
  };

  const submiturl = (e) => {
    e.preventDefault();
    if (url === "") {
      toast.error("Choose web URL!");
    } else if (!selectedCurrency) {
      toast.error("Select Currency!");
    } else if (!selectedLanguage) {
      toast.error("Select language!");
    } else {
      handleNext();
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();

    if (password === "") {
      toast.error("Password is required!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }
    if (confirmPassword === "") {
      toast.error("Confirm password is required!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const isValid = Object.values(passwordValidation).every(v => v === true);
    if (!isValid) {
      toast.error("Password does not meet requirements!");
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        email,
        password,
        username: `${firstname} ${lastName}`,
        firstName: firstname,
        middleName: middleName,
        lastName: lastName,
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        firmName,
        state: selectedState,
        country: selectedCountry,
        streetAddress: "",
        city: "",
        postalCode: "",
        firmPhoneNumber: phoneNumber.replace(/\D/g, ''),
        website: "",
        firmEmail: email,
        firmSize: firmSize,
        referenceFrom: referenceFrom,
        services: selectedServicesList,
        role: role,
        // firmURL: url.toLowerCase(),
        firmURL: url.toLowerCase() + ".pms.com",
        currency: selectedCurrency?.value || "USD",
        language: selectedLanguage?.value || "English(British)",
      };

      const response = await authAPI.registerAdmin(registrationData);
      
    //   localStorage.setItem('usersdatatoken', response.data.token);
    //   localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success("Registration successful!");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Render functions (keeping your existing render logic but updating with new state variables)
  const renderFormFields = () => {
    switch (currentStep) {
      case 0:
        return showEmailContent ? renderOTPVerification() : null;
      case 1:
        return renderInformationSteps();
      case 2:
        return renderSettingsSteps();
      default:
        return null;
    }
  };

  const renderOTPVerification = () => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
      <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
        Confirmation Code
      </Typography>

      <Typography sx={{ margin: "3px 0" }}>
        We sent a confirmation code to your email: <b>{email}</b>
      </Typography>

      <Typography sx={{ fontSize: "14px", margin: "3px 0" }}>Please, enter it below:</Typography>

      {apiError && <Alert severity="error" sx={{ mb: 2, width: "100%" }}>{apiError}</Alert>}
      {apiSuccess && <Alert severity="success" sx={{ mb: 2, width: "100%" }}>{apiSuccess}</Alert>}

      <Box sx={{ mt: 2, mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: "40px",
                height: "60px",
                fontSize: "42px",
                fontFamily: "Arial, sans-serif",
                margin: "10px",
                textAlign: "center",
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, alignItems: "center" }}>
        <Typography variant="body">
          <strong>Didn't receive it? </strong>
        </Typography>
        <Button variant="text" onClick={handleResendOTP} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Resend code"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px" }}>
        <Button variant="contained" onClick={handleClearOtp} disabled={loading}>
          Clear OTP
        </Button>
        <Button variant="contained" onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
          {loading ? <CircularProgress size={24} /> : "Verify"}
        </Button>
      </Box>
    </Box>
  );

  const renderInformationSteps = () => {
    switch (subStep) {
      case 3:
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
            <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
              <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
                Your Information
              </Typography>
              <form>
                <Box>
                  <InputLabel sx={{ color: "black" }}>First Name</InputLabel>
                  <TextField fullWidth placeholder="First Name" size="small" sx={{ mt: 2 }} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </Box>
                <Box>
                  <InputLabel sx={{ color: "black", mt: 2 }}>Middle Name</InputLabel>
                  <TextField fullWidth placeholder="Middle Name" size="small" sx={{ mt: 2 }} value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                </Box>
                <Box>
                  <InputLabel sx={{ color: "black", mt: 2 }}>Last Name</InputLabel>
                  <TextField fullWidth placeholder="Last Name" size="small" sx={{ mt: 2 }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Box>
                <Box sx={{ mb: 2, width: "100%" }}>
                  <InputLabel sx={{ color: "black", mt: 2 }}>Phone Number</InputLabel>
                  <PhoneInput
                    style={{ width: "100%" }}
                    country={"us"}
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    isValid={(inputNumber, country, countries) => {
                      return countries.some((country) => {
                        return startsWith(inputNumber, country.dialCode) || startsWith(country.dialCode, inputNumber);
                      });
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Button variant="contained" onClick={submitUserinfo} disabled={loading}>
                    Next
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
            <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
              <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
                Firm Information
              </Typography>
              <form>
                <Box>
                  <InputLabel sx={{ color: "black" }}>Firm Name</InputLabel>
                  <TextField fullWidth placeholder="Enter firm name" size="small" sx={{ mt: 2 }} value={firmName} onChange={(e) => setFirmName(e.target.value)} />
                </Box>

                <Box>
                  <InputLabel sx={{ color: "black", mt: 2 }}>Country</InputLabel>
                  <Autocomplete
                    sx={{ mt: 2 }}
                    size="small"
                    value={selectedCountryD}
                    onChange={(event, newValue) => {
                      setSelectedCountry(newValue?.label || "");
                      setSelectedCountryD(newValue || null);
                      setSelectedState("");
                    }}
                    options={countries}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} placeholder="Country" variant="outlined" />}
                  />
                </Box>

                <Box>
                  <InputLabel sx={{ color: "black", mt: 2 }}>State</InputLabel>
                  <Autocomplete
                    sx={{ mt: 2 }}
                    size="small"
                    value={stateOptions.find((option) => option.label === selectedState) || null}
                    onChange={(event, newValue) => {
                      setSelectedState(newValue?.label || "");
                    }}
                    options={stateOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} placeholder="States" variant="outlined" />}
                    disabled={!selectedCountry}
                  />
                </Box>
              </form>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 3 }}>
                <Button variant="contained" onClick={submitFerminfo} disabled={loading}>
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        );

      case 5:
        return (
          <>
            <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mt: "30px", textAlign: "center" }}>
              Firm details
            </Typography>
            <Box sx={{ justifyContent: "center", display: "flex", flexDirection: "column", px: 3 }}>
              <Box sx={{ mx: "auto", width: "100%", maxWidth: 500 }}>
                <InputLabel sx={{ mt: "3%", mb: "1%", fontWeight: "600" }}>Firm Size</InputLabel>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Input
                    value={firmSize}
                    size="small"
                    onChange={(e) => setFirmSize(Number(e.target.value))}
                    type="number"
                    sx={{
                      width: "80px",
                      p: "10px",
                      textAlign: "center",
                      border: "1px solid dodgerblue",
                      borderRadius: "4px",
                      mr: 2,
                    }}
                  />
                  <Slider
                    value={firmSize}
                    onChange={(e, val) => setFirmSize(val)}
                    min={1}
                    max={200}
                    marks={[
                      { value: 1, label: "1" },
                      { value: 50, label: "50" },
                      { value: 100, label: "100" },
                      { value: 200, label: "200+" },
                    ]}
                    sx={{ width: "70%" }}
                  />
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>How did you hear about PMS Solutions?</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {referenceOptions.map((option, index) => (
                      <Button
                        key={option}
                        variant={referenceFrom === option ? "contained" : "outlined"}
                        onClick={() => setReferenceFrom(option)}
                        sx={{ m: 0.5 }}
                      >
                        {option}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
                  <Button variant="contained" onClick={submitFirmDetail} disabled={loading}>
                    Next
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        );

      case 6:
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
            <Box sx={{ width: "100%", maxWidth: 800 }}>
              <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: 4, textAlign: "center" }}>
                Services your firm offers
              </Typography>

              <Grid container spacing={1}>
                {serviceOptions.map((service) => (
                  <Grid item xs={3} key={service}>
                    <Button
                      fullWidth
                      variant={buttonStates2[service] ? "contained" : "outlined"}
                      onClick={() => handleServiceToggle(service)}
                      sx={{ textTransform: "none", m: 0.5 }}
                    >
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Checkbox
                  checked={selectedServicesList.length === serviceOptions.length}
                  onChange={handleSelectAll}
                />
                <Typography>Select All</Typography>
                <Button variant="contained" onClick={submitService} sx={{ ml: 2 }} disabled={loading}>
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        );

      case 7:
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
            <Box sx={{ width: "100%", maxWidth: 600 }}>
              <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: 4, textAlign: "center" }}>
                Your role in the firm
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                {roleOptions.map((option, index) => (
                  <Button
                    key={option}
                    variant={role === option ? "contained" : "outlined"}
                    onClick={() => setRole(option)}
                    sx={{ width: "30%", m: 0.5 }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button variant="contained" onClick={submitRole} disabled={loading}>
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderSettingsSteps = () => {
    switch (settingsStep) {
      case 8:
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: "5%", flexDirection: { xs: "column", md: "row" } }}>
            <Box sx={{ width: { xs: "90%", md: "50%" }, p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>Firm Settings</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A powerful, integrated platform to manage teams, clients, projects.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                <b>from $50/mo per user</b> (with a 3-year subscription plan)
              </Typography>

              <Typography variant="h6" sx={{ mb: 2 }}>Firm Setting</Typography>
              <Typography sx={{ mb: 1 }}>Choose web URL</Typography>
              <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
                You will be able to set up a fully custom domain (without .pms.com) later
              </Typography>

              <TextField
                fullWidth
                size="small"
                value={url}
                onChange={(e) => setUrl(e.target.value.replace(/[^a-z0-9]/gi, '',))}
                placeholder="Enter your URL"
                sx={{ mb: 1 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">.pms.com</InputAdornment>,
                }}
              />
              <Typography variant="caption" color="error" sx={{ display: "block", mb: 2 }}>
                You cannot change it later
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography sx={{ mb: 1 }}>Select Currency:</Typography>
                  <Autocomplete
                    size="small"
                    value={selectedCurrency}
                    onChange={(event, newValue) => setSelectedCurrency(newValue)}
                    options={currencies}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => <TextField {...params} placeholder="Select a currency" />}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography sx={{ mb: 1 }}>Select Language:</Typography>
                  <Autocomplete
                    size="small"
                    value={selectedLanguage}
                    onChange={(event, newValue) => setSelectedLanguage(newValue)}
                    options={languages}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => <TextField {...params} placeholder="Select a language" />}
                  />
                </Box>
              </Box>

              <Button variant="contained" onClick={submiturl} sx={{ mt: 3 }} disabled={loading}>
                Continue
              </Button>
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" }, width: "50%" }}>
              <img style={{ height: "500px", width: "100%", objectFit: "cover" }} src={firmsetting} alt="Firm setting" />
            </Box>
          </Box>
        );

      case 9:
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
            <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
              <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
                Set Password
              </Typography>

              {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

              <Box>
                <Typography mb={1}>Password</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box mt={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <FormHelperText sx={{ display: "flex", color: passwordValidation.hasNumber ? "success.main" : "error.main" }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        a number
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <FormHelperText sx={{ display: "flex", color: passwordValidation.hasUppercase ? "success.main" : "error.main" }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        uppercase letter
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <FormHelperText sx={{ display: "flex", color: passwordValidation.hasLowercase ? "success.main" : "error.main" }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        lowercase letter
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <FormHelperText sx={{ display: "flex", color: passwordValidation.hasSymbol ? "success.main" : "error.main" }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        a symbol
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <FormHelperText sx={{ display: "flex", color: passwordValidation.hasMinLength ? "success.main" : "error.main" }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        at least 8 characters
                      </FormHelperText>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <Box mt={2}>
                <Typography mb={1}>Confirm Password</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mt={3} display="flex" justifyContent="center">
                <Button variant="contained" onClick={submitPassword} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Complete Registration"}
                </Button>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box>
        {showEmailContent && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 15px" }}>
            <Box sx={{ padding: "10px 15px", display: "flex", alignItems: "center" }}>
              <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
              <Typography variant="h6" sx={{ fontFamily: "sans-serif", color: "black", fontSize: "20px", fontWeight: "700", ml: 1 }}>
                PMS Solutions
              </Typography>
            </Box>
            <Stepper activeStep={currentStep} sx={{ flex: 1, mx: 2 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>
                    <Typography fontSize={{ xs: "16px", md: "20px" }}>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Button variant="outlined" onClick={handleAdminLogin}>
              Log In
            </Button>
          </Box>
        )}
      </Box>

      <Box>
        {renderFormFields()}
      </Box>

      <Box>
        {!showEmailContent && (
          <>
            <Box sx={{ padding: "10px 15px", display: "flex", alignItems: "center" }}>
              <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
              <Typography variant="h6" sx={{ fontFamily: "sans-serif", color: "black", fontSize: "20px", fontWeight: "700", ml: 1 }}>
                PMS Solutions
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
              <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
                <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
                  Signup
                </Typography>
                <p className="subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
                  Sign up your firm and start upgrading your workflow
                </p>

                {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

                <form>
                  <Box className="form-group">
                    <InputLabel sx={{ color: "black" }}>Email</InputLabel>
                    <TextField 
                      fullWidth 
                      type="email" 
                      placeholder="Enter Your Email" 
                      size="small" 
                      sx={{ mt: 2 }} 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", width: "100%", mt: 1 }}>
                    <Checkbox 
                      id="terms" 
                      checked={isChecked}
                      onChange={setValbox}
                    />
                    <Typography fontSize="14px" color="#696969" component="label" htmlFor="terms">
                      I agree to the terms and conditions
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button 
                      sx={{ mt: 2 }} 
                      variant="contained" 
                      onClick={createAccount}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Create Account"}
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
                    <Typography variant="body2">
                      Already have an account?{" "}
                      <Link component={NavLink} to="/login" sx={{ textDecoration: "none", color: "blue" }}>
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MyForm;