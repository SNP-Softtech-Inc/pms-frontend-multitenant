// // import React, { useState, useEffect } from "react";
// // import { Stepper, Step, StepLabel, Box, Alert } from "@mui/material";
// // import { NavLink, useNavigate } from "react-router-dom";
// // import { toast } from "react-toastify";
// // import { Autocomplete } from "@mui/material";
// // import OtpInput from "react-otp-input";
// // import PhoneInput from "react-phone-input-2";
// // import "react-phone-input-2/lib/style.css";
// // import startsWith from "lodash.startswith";
// // import firmsetting from "../Images/setting.png";
// // import Visibility from "@mui/icons-material/Visibility";
// // import VisibilityOff from "@mui/icons-material/VisibilityOff";
// // import InputAdornment from "@mui/material/InputAdornment";
// // import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// // import logo from "../Images/logoAdmin.png";
// // import micropms from "../Images/micropms.png";
// // import { Link, Divider, IconButton, Typography, TextField, InputLabel, Checkbox, FormHelperText, Button, Grid, FormControl, Slider, Input, CircularProgress } from "@mui/material";
// // import { authAPI } from "../services/api";

// // const MyForm = () => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [apiError, setApiError] = useState("");
// //   const [apiSuccess, setApiSuccess] = useState("");

// //   const handleAdminLogin = () => {
// //     navigate("/login");
// //   };

// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [subStep, setSubStep] = useState(3);
// //   const [settingsStep, setSettingsStep] = useState(8);
// //   const [showEmailContent, setShowEmailContent] = useState(false);
// //   const [phoneNumber, setPhoneNumber] = useState("");
// //   const [valid, setValid] = useState(true);
// //   const steps = ["Email", "Information", "Settings"];

// //   // Email verification state
// //   const [email, setEmail] = useState("");
// //   const [otp, setOtp] = useState("");
// //   const [isEmailVerified, setIsEmailVerified] = useState(false);

// //   // Countries and states
// //   const [countries, setCountries] = useState([]);
// //   const [selectedCountry, setSelectedCountry] = useState("");
// //   const [states, setStates] = useState([]);
// //   const [firmName, setFirmName] = useState("");
// //   const [selectedState, setSelectedState] = useState("");
// //   const [selectedCountryD, setSelectedCountryD] = useState("");

// //   // Firm details
// //   const [firmSize, setFirmSize] = useState(1);
// //   const [inputValue, setInputValue] = useState(1);
// //   const [referenceFrom, setReferenceFrom] = useState("");
// //   const [selectedServices, setSelectedServices] = useState([]);
// //   const [role, setRole] = useState("");

// //   // Personal info
// //   const [firstname, setFirstname] = useState("");
// //   const [lastName, setLastName] = useState("");
// //   const [middleName, setMiddleName] = useState("");

// //   // Settings
// //   const [currencies, setCurrencies] = useState([]);
// //   const [url, setUrl] = useState("");
// //   const [selectedCurrency, setSelectedCurrency] = useState(null);
// //   const [selectedLanguage, setSelectedLanguage] = useState(null);

// //   // Password
// //   const [password, setPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// //   // Terms
// //   const [isChecked, setIsChecked] = useState(false);

// //   // Service options
// //   const serviceOptions = [
// //     "TaxPreparation",
// //     "TaxPlanning",
// //     "Advisory",
// //     "Resolution",
// //     "Payroll",
// //     "Accounting",
// //     "Audit",
// //     "LawFirm",
// //     "Bookkeeping",
// //     "Other"
// //   ];

// //   const referenceOptions = [
// //     "Google search",
// //     "Capterra/ Get app/ G2",
// //     "From a friend",
// //     "Offline event",
// //     "Social media",
// //     "Taxdome consultant/ Partner",
// //     "Other"
// //   ];

// //   const roleOptions = [
// //     "Owner or partner",
// //     "Book keeper or Accountant",
// //     "Operations / office Manager",
// //     "Admin",
// //     "Assistant",
// //     "Other"
// //   ];

// //   const languages = [
// //     { value: "English(British)", label: "English(British)" },
// //     { value: "Deutsch", label: "Deutsch" },
// //     { value: "Italiano", label: "Italiano" },
// //     { value: "Nederlands", label: "Nederlands" },
// //     { value: "Suomi", label: "Suomi" },
// //     { value: "Dansk", label: "Dansk" },
// //   ];

// //   // Button states
// //   const [buttonStates, setButtonStates] = useState([false, false, false, false, false, false, false]);
// //   const [selectedButton, setSelectedButton] = useState(null);
// //   const [buttonStates2, setButtonStates2] = useState({});
// //   const [buttonStates3, setButtonStates3] = useState([false, false, false, false, false, false]);

// //   // Initialize button states
// //   useEffect(() => {
// //     const initialStates = {};
// //     serviceOptions.forEach(service => {
// //       initialStates[service] = false;
// //     });
// //     setButtonStates2(initialStates);
// //   }, []);

// //   // Password validation
// //   const passwordValidation = {
// //     hasNumber: /\d/.test(password),
// //     hasUppercase: /[A-Z]/.test(password),
// //     hasLowercase: /[a-z]/.test(password),
// //     hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
// //     hasMinLength: password.length >= 8,
// //   };

// //   // Fetch countries
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
// //         if (!response.ok) {
// //           throw new Error("Failed to fetch data");
// //         }
// //         const data = await response.json();
// //         const countryOptions = data.data.map((country) => ({
// //           label: country.name,
// //         }));
// //         setCountries(countryOptions);
// //       } catch (error) {
// //         console.error("Error fetching countries:", error);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   // Fetch states
// //   useEffect(() => {
// //     const getStatesData = async () => {
// //       try {
// //         const response = await fetch("https://countriesnow.space/api/v0.1/countries/states");
// //         const data = await response.json();
// //         setStates(data.data);
// //       } catch (error) {
// //         console.error("Error fetching state data:", error);
// //       }
// //     };
// //     getStatesData();
// //   }, []);

// //   // Fetch currencies
// //   useEffect(() => {
// //     const fetchCurrencies = async () => {
// //       try {
// //         const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
// //         const data = await response.json();
// //         const currencyOptions = Object.keys(data.rates).map(currency => ({
// //           value: currency,
// //           label: `${currency} - ${currency}`,
// //         }));
// //         setCurrencies(currencyOptions);
// //       } catch (error) {
// //         console.error("Error fetching currencies:", error);
// //       }
// //     };
// //     fetchCurrencies();
// //   }, []);

// //   const countryStates = states.find((country) => country.name === selectedCountry)?.states || [];
// //   const stateOptions = countryStates.map((state, index) => ({
// //     value: state.name,
// //     label: state.name,
// //   }));

// //   // OTP Handlers
// //   const handleSendOTP = async () => {
// //     if (!email) {
// //       toast.error("Email is required!");
// //       return;
// //     }

// //     setLoading(true);
// //     setApiError("");

// //     try {
 

// //       // Send OTP
// //       await authAPI.sendOTP(email);
// //       setShowEmailContent(true);
// //       setApiSuccess("OTP sent to your email");
// //       toast.success("OTP sent to your email");
// //     } catch (error) {
// //       console.error("Send OTP error:", error);
// //       console.log("failed to send otp",error)
// //       setApiError(error.response?.data?.message || "Failed to send OTP");
// //       toast.error(error.response?.data?.message || "Failed to send OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerifyOTP = async () => {
// //     if (!otp || otp.length !== 6) {
// //       toast.error("Please enter 6-digit OTP");
// //       return;
// //     }

// //     setLoading(true);
// //     setApiError("");

// //     try {
// //       await authAPI.verifyOTP(email, otp);
// //       setIsEmailVerified(true);
// //       setApiSuccess("Email verified successfully");
// //       toast.success("Email verified successfully");
// //       handleNext();
// //     } catch (error) {
// //       console.error("Verify OTP error:", error);
// //       setApiError(error.response?.data?.message || "Failed to verify OTP");
// //       toast.error(error.response?.data?.message || "Failed to verify OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleResendOTP = async () => {
// //     setLoading(true);
// //     setApiError("");

// //     try {
// //       await authAPI.resendOTP(email);
// //       setApiSuccess("OTP resent successfully");
// //       toast.success("OTP resent successfully");
// //     } catch (error) {
// //       console.error("Resend OTP error:", error);
// //       setApiError(error.response?.data?.message || "Failed to resend OTP");
// //       toast.error(error.response?.data?.message || "Failed to resend OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleClearOtp = () => {
// //     setOtp("");
// //   };

// //   const handleNext = () => {
// //     if (currentStep === 0) {
// //       setCurrentStep(1);
// //     } else if (currentStep === 1) {
// //       if (subStep < 7) {
// //         setSubStep((prevSubStep) => prevSubStep + 1);
// //       } else {
// //         setCurrentStep(2);
// //       }
// //     } else if (currentStep === 2) {
// //       if (settingsStep < 9) {
// //         setSettingsStep((prevSettingsStep) => prevSettingsStep + 1);
// //       }
// //     }
// //   };

// //   const setValbox = (event) => {
// //     setIsChecked(event.target.checked);
// //   };

// //   const createAccount = async () => {
// //     if (!email) {
// //       toast.error("Email is required!");
// //       return;
// //     }
// //     if (!isChecked) {
// //       toast.error("Accept terms and conditions");
// //       return;
// //     }
// //     await handleSendOTP();
// //   };

// //   // Validation functions
// //   const submitUserinfo = (e) => {
// //     e.preventDefault();
// //     if (firstname === "") {
// //       toast.error("First Name Required!");
// //     } else if (lastName === "") {
// //       toast.error("Last Name Required!");
// //     } else if (phoneNumber === "") {
// //       toast.error("Phone number required");
// //     } else {
// //       handleNext();
// //     }
// //   };

// //   const submitFerminfo = (e) => {
// //     e.preventDefault();
// //     if (firmName === "") {
// //       toast.error("Firm Name Required!");
// //     } else if (selectedCountry === "") {
// //       toast.error("Select Country!");
// //     } else if (selectedState === "") {
// //       toast.error("Select state!");
// //     } else {
// //       handleNext();
// //     }
// //   };

// //   const submitFirmDetail = (e) => {
// //     e.preventDefault();
// //     if (firmSize === 0) {
// //       toast.error("Select Firm Size!");
// //     } else if (!referenceFrom) {
// //       toast.error("Select how you heard about us!");
// //     } else {
// //       handleNext();
// //     }
// //   };

// //   const handleServiceToggle = (service) => {
// //     setButtonStates2(prev => ({
// //       ...prev,
// //       [service]: !prev[service]
// //     }));
// //   };

// //   const selectedServicesList = Object.keys(buttonStates2).filter(key => buttonStates2[key]);

// //   const handleSelectAll = () => {
// //     const allSelected = selectedServicesList.length === serviceOptions.length;
// //     const newStates = {};
// //     serviceOptions.forEach(service => {
// //       newStates[service] = !allSelected;
// //     });
// //     setButtonStates2(newStates);
// //   };

// //   const submitService = (e) => {
// //     e.preventDefault();
// //     if (selectedServicesList.length === 0) {
// //       toast.error("Select at least one service!");
// //     } else {
// //       handleNext();
// //     }
// //   };

// //   const handleToggle3 = (index) => {
// //     const updatedStates = buttonStates3.map((state, i) => (i === index ? !state : false));
// //     setButtonStates3(updatedStates);
// //     setRole(roleOptions[index]);
// //   };

// //   const submitRole = (e) => {
// //     e.preventDefault();
// //     if (!role) {
// //       toast.error("Select your role!");
// //     } else {
// //       handleNext();
// //     }
// //   };

// //   const submiturl = (e) => {
// //     e.preventDefault();
// //     if (url === "") {
// //       toast.error("Choose web URL!");
// //     } else if (!selectedCurrency) {
// //       toast.error("Select Currency!");
// //     } else if (!selectedLanguage) {
// //       toast.error("Select language!");
// //     } else {
// //       handleNext();
// //     }
// //   };

// //   const submitPassword = async (e) => {
// //     e.preventDefault();

// //     if (password === "") {
// //       toast.error("Password is required!");
// //       return;
// //     }
// //     if (password.length < 8) {
// //       toast.error("Password must be at least 8 characters!");
// //       return;
// //     }
// //     if (confirmPassword === "") {
// //       toast.error("Confirm password is required!");
// //       return;
// //     }
// //     if (password !== confirmPassword) {
// //       toast.error("Passwords do not match!");
// //       return;
// //     }

// //     const isValid = Object.values(passwordValidation).every(v => v === true);
// //     if (!isValid) {
// //       toast.error("Password does not meet requirements!");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const registrationData = {
// //         email,
// //         password,
// //         username: `${firstname} ${lastName}`,
// //         firstName: firstname,
// //         middleName: middleName,
// //         lastName: lastName,
// //         phoneNumber: phoneNumber.replace(/\D/g, ''),
// //         firmName,
// //         state: selectedState,
// //         country: selectedCountry,
// //         streetAddress: "",
// //         city: "",
// //         postalCode: "",
// //         firmPhoneNumber: phoneNumber.replace(/\D/g, ''),
// //         website: "",
// //         firmEmail: email,
// //         firmSize: firmSize,
// //         referenceFrom: referenceFrom,
// //         services: selectedServicesList,
// //         role: role,
// //         // firmURL: url.toLowerCase(),
// //         firmURL: url.toLowerCase() + ".pms.com",
// //         currency: selectedCurrency?.value || "USD",
// //         language: selectedLanguage?.value || "English(British)",
// //       };

// //       const response = await authAPI.registerAdmin(registrationData);
      
// //     //   localStorage.setItem('usersdatatoken', response.data.token);
// //     //   localStorage.setItem('user', JSON.stringify(response.data.user));
      
// //       toast.success("Registration successful!");
      
// //       setTimeout(() => {
// //         navigate("/login");
// //       }, 2000);
// //     } catch (error) {
// //       console.error("Registration error:", error);
// //       toast.error(error.response?.data?.message || "Registration failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Render functions (keeping your existing render logic but updating with new state variables)
// //   const renderFormFields = () => {
// //     switch (currentStep) {
// //       case 0:
// //         return showEmailContent ? renderOTPVerification() : null;
// //       case 1:
// //         return renderInformationSteps();
// //       case 2:
// //         return renderSettingsSteps();
// //       default:
// //         return null;
// //     }
// //   };

// //   const renderOTPVerification = () => (
// //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
// //       <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
// //         Confirmation Code
// //       </Typography>

// //       <Typography sx={{ margin: "3px 0" }}>
// //         We sent a confirmation code to your email: <b>{email}</b>
// //       </Typography>

// //       <Typography sx={{ fontSize: "14px", margin: "3px 0" }}>Please, enter it below:</Typography>

// //       {apiError && <Alert severity="error" sx={{ mb: 2, width: "100%" }}>{apiError}</Alert>}
// //       {apiSuccess && <Alert severity="success" sx={{ mb: 2, width: "100%" }}>{apiSuccess}</Alert>}

// //       <Box sx={{ mt: 2, mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
// //         <OtpInput
// //           value={otp}
// //           onChange={setOtp}
// //           numInputs={6}
// //           renderInput={(props) => (
// //             <input
// //               {...props}
// //               style={{
// //                 width: "40px",
// //                 height: "60px",
// //                 fontSize: "42px",
// //                 fontFamily: "Arial, sans-serif",
// //                 margin: "10px",
// //                 textAlign: "center",
// //               }}
// //             />
// //           )}
// //         />
// //       </Box>

// //       <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, alignItems: "center" }}>
// //         <Typography variant="body">
// //           <strong>Didn't receive it? </strong>
// //         </Typography>
// //         <Button variant="text" onClick={handleResendOTP} disabled={loading}>
// //           {loading ? <CircularProgress size={20} /> : "Resend code"}
// //         </Button>
// //       </Box>

// //       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px" }}>
// //         <Button variant="contained" onClick={handleClearOtp} disabled={loading}>
// //           Clear OTP
// //         </Button>
// //         <Button variant="contained" onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
// //           {loading ? <CircularProgress size={24} /> : "Verify"}
// //         </Button>
// //       </Box>
// //     </Box>
// //   );

// //   const renderInformationSteps = () => {
// //     switch (subStep) {
// //       case 3:
// //         return (
// //           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
// //             <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
// //               <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
// //                 Your Information
// //               </Typography>
// //               <form>
// //                 <Box>
// //                   <InputLabel sx={{ color: "black" }}>First Name</InputLabel>
// //                   <TextField fullWidth placeholder="First Name" size="small" sx={{ mt: 2 }} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
// //                 </Box>
// //                 <Box>
// //                   <InputLabel sx={{ color: "black", mt: 2 }}>Middle Name</InputLabel>
// //                   <TextField fullWidth placeholder="Middle Name" size="small" sx={{ mt: 2 }} value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
// //                 </Box>
// //                 <Box>
// //                   <InputLabel sx={{ color: "black", mt: 2 }}>Last Name</InputLabel>
// //                   <TextField fullWidth placeholder="Last Name" size="small" sx={{ mt: 2 }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
// //                 </Box>
// //                 <Box sx={{ mb: 2, width: "100%" }}>
// //                   <InputLabel sx={{ color: "black", mt: 2 }}>Phone Number</InputLabel>
// //                   <PhoneInput
// //                     style={{ width: "100%" }}
// //                     country={"us"}
// //                     placeholder="Enter phone number"
// //                     value={phoneNumber}
// //                     onChange={setPhoneNumber}
// //                     isValid={(inputNumber, country, countries) => {
// //                       return countries.some((country) => {
// //                         return startsWith(inputNumber, country.dialCode) || startsWith(country.dialCode, inputNumber);
// //                       });
// //                     }}
// //                   />
// //                 </Box>
// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
// //                   <Button variant="contained" onClick={submitUserinfo} disabled={loading}>
// //                     Next
// //                   </Button>
// //                 </Box>
// //               </form>
// //             </Box>
// //           </Box>
// //         );

// //       case 4:
// //         return (
// //           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
// //             <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
// //               <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
// //                 Firm Information
// //               </Typography>
// //               <form>
// //                 <Box>
// //                   <InputLabel sx={{ color: "black" }}>Firm Name</InputLabel>
// //                   <TextField fullWidth placeholder="Enter firm name" size="small" sx={{ mt: 2 }} value={firmName} onChange={(e) => setFirmName(e.target.value)} />
// //                 </Box>

// //                 <Box>
// //                   <InputLabel sx={{ color: "black", mt: 2 }}>Country</InputLabel>
// //                   <Autocomplete
// //                     sx={{ mt: 2 }}
// //                     size="small"
// //                     value={selectedCountryD}
// //                     onChange={(event, newValue) => {
// //                       setSelectedCountry(newValue?.label || "");
// //                       setSelectedCountryD(newValue || null);
// //                       setSelectedState("");
// //                     }}
// //                     options={countries}
// //                     getOptionLabel={(option) => option.label}
// //                     renderInput={(params) => <TextField {...params} placeholder="Country" variant="outlined" />}
// //                   />
// //                 </Box>

// //                 <Box>
// //                   <InputLabel sx={{ color: "black", mt: 2 }}>State</InputLabel>
// //                   <Autocomplete
// //                     sx={{ mt: 2 }}
// //                     size="small"
// //                     value={stateOptions.find((option) => option.label === selectedState) || null}
// //                     onChange={(event, newValue) => {
// //                       setSelectedState(newValue?.label || "");
// //                     }}
// //                     options={stateOptions}
// //                     getOptionLabel={(option) => option.label}
// //                     renderInput={(params) => <TextField {...params} placeholder="States" variant="outlined" />}
// //                     disabled={!selectedCountry}
// //                   />
// //                 </Box>
// //               </form>
// //               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 3 }}>
// //                 <Button variant="contained" onClick={submitFerminfo} disabled={loading}>
// //                   Next
// //                 </Button>
// //               </Box>
// //             </Box>
// //           </Box>
// //         );

// //       case 5:
// //         return (
// //           <>
// //             <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mt: "30px", textAlign: "center" }}>
// //               Firm details
// //             </Typography>
// //             <Box sx={{ justifyContent: "center", display: "flex", flexDirection: "column", px: 3 }}>
// //               <Box sx={{ mx: "auto", width: "100%", maxWidth: 500 }}>
// //                 <InputLabel sx={{ mt: "3%", mb: "1%", fontWeight: "600" }}>Firm Size</InputLabel>
// //                 <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
// //                   <Input
// //                     value={firmSize}
// //                     size="small"
// //                     onChange={(e) => setFirmSize(Number(e.target.value))}
// //                     type="number"
// //                     sx={{
// //                       width: "80px",
// //                       p: "10px",
// //                       textAlign: "center",
// //                       border: "1px solid dodgerblue",
// //                       borderRadius: "4px",
// //                       mr: 2,
// //                     }}
// //                   />
// //                   <Slider
// //                     value={firmSize}
// //                     onChange={(e, val) => setFirmSize(val)}
// //                     min={1}
// //                     max={200}
// //                     marks={[
// //                       { value: 1, label: "1" },
// //                       { value: 50, label: "50" },
// //                       { value: 100, label: "100" },
// //                       { value: 200, label: "200+" },
// //                     ]}
// //                     sx={{ width: "70%" }}
// //                   />
// //                 </Box>

// //                 <Box sx={{ mt: 4 }}>
// //                   <Typography variant="h6" sx={{ mb: 2 }}>How did you hear about PMS Solutions?</Typography>
// //                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
// //                     {referenceOptions.map((option, index) => (
// //                       <Button
// //                         key={option}
// //                         variant={referenceFrom === option ? "contained" : "outlined"}
// //                         onClick={() => setReferenceFrom(option)}
// //                         sx={{ m: 0.5 }}
// //                       >
// //                         {option}
// //                       </Button>
// //                     ))}
// //                   </Box>
// //                 </Box>

// //                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
// //                   <Button variant="contained" onClick={submitFirmDetail} disabled={loading}>
// //                     Next
// //                   </Button>
// //                 </Box>
// //               </Box>
// //             </Box>
// //           </>
// //         );

// //       case 6:
// //         return (
// //           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
// //             <Box sx={{ width: "100%", maxWidth: 800 }}>
// //               <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: 4, textAlign: "center" }}>
// //                 Services your firm offers
// //               </Typography>

// //               <Grid container spacing={1}>
// //                 {serviceOptions.map((service) => (
// //                   <Grid item xs={3} key={service}>
// //                     <Button
// //                       fullWidth
// //                       variant={buttonStates2[service] ? "contained" : "outlined"}
// //                       onClick={() => handleServiceToggle(service)}
// //                       sx={{ textTransform: "none", m: 0.5 }}
// //                     >
// //                       {service.replace(/([A-Z])/g, ' $1').trim()}
// //                     </Button>
// //                   </Grid>
// //                 ))}
// //               </Grid>

// //               <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
// //                 <Checkbox
// //                   checked={selectedServicesList.length === serviceOptions.length}
// //                   onChange={handleSelectAll}
// //                 />
// //                 <Typography>Select All</Typography>
// //                 <Button variant="contained" onClick={submitService} sx={{ ml: 2 }} disabled={loading}>
// //                   Next
// //                 </Button>
// //               </Box>
// //             </Box>
// //           </Box>
// //         );

// //       case 7:
// //         return (
// //           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
// //             <Box sx={{ width: "100%", maxWidth: 600 }}>
// //               <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: 4, textAlign: "center" }}>
// //                 Your role in the firm
// //               </Typography>

// //               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
// //                 {roleOptions.map((option, index) => (
// //                   <Button
// //                     key={option}
// //                     variant={role === option ? "contained" : "outlined"}
// //                     onClick={() => setRole(option)}
// //                     sx={{ width: "30%", m: 0.5 }}
// //                   >
// //                     {option}
// //                   </Button>
// //                 ))}
// //               </Box>

// //               <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
// //                 <Button variant="contained" onClick={submitRole} disabled={loading}>
// //                   Next
// //                 </Button>
// //               </Box>
// //             </Box>
// //           </Box>
// //         );

// //       default:
// //         return null;
// //     }
// //   };

// //   const renderSettingsSteps = () => {
// //     switch (settingsStep) {
// //       case 8:
// //         return (
// //           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: "5%", flexDirection: { xs: "column", md: "row" } }}>
// //             <Box sx={{ width: { xs: "90%", md: "50%" }, p: 3 }}>
// //               <Typography variant="h4" sx={{ mb: 2 }}>Firm Settings</Typography>
// //               <Typography variant="body1" sx={{ mb: 2 }}>
// //                 A powerful, integrated platform to manage teams, clients, projects.
// //               </Typography>
// //               <Typography variant="body1" sx={{ mb: 3 }}>
// //                 <b>from $50/mo per user</b> (with a 3-year subscription plan)
// //               </Typography>

// //               <Typography variant="h6" sx={{ mb: 2 }}>Firm Setting</Typography>
// //               <Typography sx={{ mb: 1 }}>Choose web URL</Typography>
// //               <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
// //                 You will be able to set up a fully custom domain (without .pms.com) later
// //               </Typography>

// //               <TextField
// //                 fullWidth
// //                 size="small"
// //                 value={url}
// //                 onChange={(e) => setUrl(e.target.value.replace(/[^a-z0-9]/gi, '',))}
// //                 placeholder="Enter your URL"
// //                 sx={{ mb: 1 }}
// //                 InputProps={{
// //                   endAdornment: <InputAdornment position="end">.pms.com</InputAdornment>,
// //                 }}
// //               />
// //               <Typography variant="caption" color="error" sx={{ display: "block", mb: 2 }}>
// //                 You cannot change it later
// //               </Typography>

// //               <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
// //                 <Box sx={{ flex: 1, minWidth: 200 }}>
// //                   <Typography sx={{ mb: 1 }}>Select Currency:</Typography>
// //                   <Autocomplete
// //                     size="small"
// //                     value={selectedCurrency}
// //                     onChange={(event, newValue) => setSelectedCurrency(newValue)}
// //                     options={currencies}
// //                     getOptionLabel={(option) => option.label || ""}
// //                     renderInput={(params) => <TextField {...params} placeholder="Select a currency" />}
// //                   />
// //                 </Box>
// //                 <Box sx={{ flex: 1, minWidth: 200 }}>
// //                   <Typography sx={{ mb: 1 }}>Select Language:</Typography>
// //                   <Autocomplete
// //                     size="small"
// //                     value={selectedLanguage}
// //                     onChange={(event, newValue) => setSelectedLanguage(newValue)}
// //                     options={languages}
// //                     getOptionLabel={(option) => option.label || ""}
// //                     renderInput={(params) => <TextField {...params} placeholder="Select a language" />}
// //                   />
// //                 </Box>
// //               </Box>

// //               <Button variant="contained" onClick={submiturl} sx={{ mt: 3 }} disabled={loading}>
// //                 Continue
// //               </Button>
// //             </Box>
// //             <Box sx={{ display: { xs: "none", md: "block" }, width: "50%" }}>
// //               <img style={{ height: "500px", width: "100%", objectFit: "cover" }} src={firmsetting} alt="Firm setting" />
// //             </Box>
// //           </Box>
// //         );

// //       case 9:
// //         return (
// //           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
// //             <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
// //               <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
// //                 Set Password
// //               </Typography>

// //               {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

// //               <Box>
// //                 <Typography mb={1}>Password</Typography>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   type={showPassword ? "text" : "password"}
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   placeholder="Password"
// //                   InputProps={{
// //                     endAdornment: (
// //                       <InputAdornment position="end">
// //                         <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
// //                           {showPassword ? <VisibilityOff /> : <Visibility />}
// //                         </IconButton>
// //                       </InputAdornment>
// //                     ),
// //                   }}
// //                 />

// //                 <Box mt={2}>
// //                   <Grid container spacing={1}>
// //                     <Grid item xs={6}>
// //                       <FormHelperText sx={{ display: "flex", color: passwordValidation.hasNumber ? "success.main" : "error.main" }}>
// //                         <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
// //                         a number
// //                       </FormHelperText>
// //                     </Grid>
// //                     <Grid item xs={6}>
// //                       <FormHelperText sx={{ display: "flex", color: passwordValidation.hasUppercase ? "success.main" : "error.main" }}>
// //                         <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
// //                         uppercase letter
// //                       </FormHelperText>
// //                     </Grid>
// //                     <Grid item xs={6}>
// //                       <FormHelperText sx={{ display: "flex", color: passwordValidation.hasLowercase ? "success.main" : "error.main" }}>
// //                         <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
// //                         lowercase letter
// //                       </FormHelperText>
// //                     </Grid>
// //                     <Grid item xs={6}>
// //                       <FormHelperText sx={{ display: "flex", color: passwordValidation.hasSymbol ? "success.main" : "error.main" }}>
// //                         <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
// //                         a symbol
// //                       </FormHelperText>
// //                     </Grid>
// //                     <Grid item xs={6}>
// //                       <FormHelperText sx={{ display: "flex", color: passwordValidation.hasMinLength ? "success.main" : "error.main" }}>
// //                         <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
// //                         at least 8 characters
// //                       </FormHelperText>
// //                     </Grid>
// //                   </Grid>
// //                 </Box>
// //               </Box>

// //               <Box mt={2}>
// //                 <Typography mb={1}>Confirm Password</Typography>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   type={showConfirmPassword ? "text" : "password"}
// //                   value={confirmPassword}
// //                   onChange={(e) => setConfirmPassword(e.target.value)}
// //                   placeholder="Confirm Password"
// //                   InputProps={{
// //                     endAdornment: (
// //                       <InputAdornment position="end">
// //                         <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
// //                           {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
// //                         </IconButton>
// //                       </InputAdornment>
// //                     ),
// //                   }}
// //                 />
// //               </Box>

// //               <Box mt={3} display="flex" justifyContent="center">
// //                 <Button variant="contained" onClick={submitPassword} disabled={loading}>
// //                   {loading ? <CircularProgress size={24} /> : "Complete Registration"}
// //                 </Button>
// //               </Box>
// //             </Box>
// //           </Box>
// //         );

// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <Box>
// //       <Box>
// //         {showEmailContent && (
// //           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 15px" }}>
// //             <Box sx={{ padding: "10px 15px", display: "flex", alignItems: "center" }}>
// //               <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
// //               <Typography variant="h6" sx={{ fontFamily: "sans-serif", color: "black", fontSize: "20px", fontWeight: "700", ml: 1 }}>
// //                 PMS Solutions
// //               </Typography>
// //             </Box>
// //             <Stepper activeStep={currentStep} sx={{ flex: 1, mx: 2 }}>
// //               {steps.map((label, index) => (
// //                 <Step key={index}>
// //                   <StepLabel>
// //                     <Typography fontSize={{ xs: "16px", md: "20px" }}>{label}</Typography>
// //                   </StepLabel>
// //                 </Step>
// //               ))}
// //             </Stepper>
// //             <Button variant="outlined" onClick={handleAdminLogin}>
// //               Log In
// //             </Button>
// //           </Box>
// //         )}
// //       </Box>

// //       <Box>
// //         {renderFormFields()}
// //       </Box>

// //       <Box>
// //         {!showEmailContent && (
// //           <>
// //             <Box sx={{ padding: "10px 15px", display: "flex", alignItems: "center" }}>
// //               <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
// //               <Typography variant="h6" sx={{ fontFamily: "sans-serif", color: "black", fontSize: "20px", fontWeight: "700", ml: 1 }}>
// //                 PMS Solutions
// //               </Typography>
// //             </Box>
// //             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5%", flexDirection: "column" }}>
// //               <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
// //                 <Typography variant="h1" sx={{ color: "black", fontSize: "35px", fontWeight: "700", mb: "20px", textAlign: "center" }}>
// //                   Signup
// //                 </Typography>
// //                 <p className="subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
// //                   Sign up your firm and start upgrading your workflow
// //                 </p>

// //                 {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

// //                 <form>
// //                   <Box className="form-group">
// //                     <InputLabel sx={{ color: "black" }}>Email</InputLabel>
// //                     <TextField 
// //                       fullWidth 
// //                       type="email" 
// //                       placeholder="Enter Your Email" 
// //                       size="small" 
// //                       sx={{ mt: 2 }} 
// //                       value={email} 
// //                       onChange={(e) => setEmail(e.target.value)} 
// //                     />
// //                   </Box>

// //                   <Box sx={{ display: "flex", alignItems: "center", width: "100%", mt: 1 }}>
// //                     <Checkbox 
// //                       id="terms" 
// //                       checked={isChecked}
// //                       onChange={setValbox}
// //                     />
// //                     <Typography fontSize="14px" color="#696969" component="label" htmlFor="terms">
// //                       I agree to the terms and conditions
// //                     </Typography>
// //                   </Box>

// //                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
// //                     <Button 
// //                       sx={{ mt: 2 }} 
// //                       variant="contained" 
// //                       onClick={createAccount}
// //                       disabled={loading}
// //                     >
// //                       {loading ? <CircularProgress size={24} /> : "Create Account"}
// //                     </Button>
// //                   </Box>

// //                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
// //                     <Typography variant="body2">
// //                       Already have an account?{" "}
// //                       <Link component={NavLink} to="/login" sx={{ textDecoration: "none", color: "blue" }}>
// //                         Sign in
// //                       </Link>
// //                     </Typography>
// //                   </Box>
// //                 </form>
// //               </Box>
// //             </Box>
// //           </>
// //         )}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default MyForm;

// import React, { useState, useEffect } from "react";
// import { useNavigate, NavLink } from "react-router-dom";
// import { toast } from "react-toastify";
// import OtpInput from "react-otp-input";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import startsWith from "lodash.startswith";
// import { Eye, EyeOff } from "lucide-react";

// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
// import { Checkbox } from "../components/ui/checkbox";
// import { Alert, AlertDescription } from "../components/ui/alert";
// import { Slider } from "../components/ui/slider";
// import { Progress } from "../components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import {
//   Stepper,
//   Step,
//   StepLabel,
// } from "../components/ui/stepper";

// import firmsetting from "../Images/setting.png";
// import logo from "../Images/logoAdmin.png";
// import micropms from "../Images/micropms.png";
// import { authAPI } from "../services/api";

// const MyForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [apiSuccess, setApiSuccess] = useState("");

//   const handleAdminLogin = () => {
//     navigate("/login");
//   };

//   const [currentStep, setCurrentStep] = useState(0);
//   const [subStep, setSubStep] = useState(3);
//   const [settingsStep, setSettingsStep] = useState(8);
//   const [showEmailContent, setShowEmailContent] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [valid, setValid] = useState(true);
//   const steps = ["Email", "Information", "Settings"];

//   // Email verification state
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isEmailVerified, setIsEmailVerified] = useState(false);

//   // Countries and states
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [states, setStates] = useState([]);
//   const [firmName, setFirmName] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCountryD, setSelectedCountryD] = useState("");

//   // Firm details
//   const [firmSize, setFirmSize] = useState(1);
//   const [inputValue, setInputValue] = useState(1);
//   const [referenceFrom, setReferenceFrom] = useState("");
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [role, setRole] = useState("");

//   // Personal info
//   const [firstname, setFirstname] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [middleName, setMiddleName] = useState("");

//   // Settings
//   const [currencies, setCurrencies] = useState([]);
//   const [url, setUrl] = useState("");
//   const [selectedCurrency, setSelectedCurrency] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState(null);

//   // Password
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Terms
//   const [isChecked, setIsChecked] = useState(false);

//   // Service options
//   const serviceOptions = [
//     "TaxPreparation",
//     "TaxPlanning",
//     "Advisory",
//     "Resolution",
//     "Payroll",
//     "Accounting",
//     "Audit",
//     "LawFirm",
//     "Bookkeeping",
//     "Other"
//   ];

//   const referenceOptions = [
//     "Google search",
//     "Capterra/ Get app/ G2",
//     "From a friend",
//     "Offline event",
//     "Social media",
//     "Taxdome consultant/ Partner",
//     "Other"
//   ];

//   const roleOptions = [
//     "Owner or partner",
//     "Book keeper or Accountant",
//     "Operations / office Manager",
//     "Admin",
//     "Assistant",
//     "Other"
//   ];

//   const languages = [
//     { value: "English(British)", label: "English(British)" },
//     { value: "Deutsch", label: "Deutsch" },
//     { value: "Italiano", label: "Italiano" },
//     { value: "Nederlands", label: "Nederlands" },
//     { value: "Suomi", label: "Suomi" },
//     { value: "Dansk", label: "Dansk" },
//   ];

//   // Button states
//   const [buttonStates, setButtonStates] = useState([false, false, false, false, false, false, false]);
//   const [selectedButton, setSelectedButton] = useState(null);
//   const [buttonStates2, setButtonStates2] = useState({});
//   const [buttonStates3, setButtonStates3] = useState([false, false, false, false, false, false]);

//   // Initialize button states
//   useEffect(() => {
//     const initialStates = {};
//     serviceOptions.forEach(service => {
//       initialStates[service] = false;
//     });
//     setButtonStates2(initialStates);
//   }, []);

//   // Password validation
//   const passwordValidation = {
//     hasNumber: /\d/.test(password),
//     hasUppercase: /[A-Z]/.test(password),
//     hasLowercase: /[a-z]/.test(password),
//     hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//     hasMinLength: password.length >= 8,
//   };

//   // Fetch countries
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         const countryOptions = data.data.map((country) => ({
//           label: country.name,
//         }));
//         setCountries(countryOptions);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   // Fetch states
//   useEffect(() => {
//     const getStatesData = async () => {
//       try {
//         const response = await fetch("https://countriesnow.space/api/v0.1/countries/states");
//         const data = await response.json();
//         setStates(data.data);
//       } catch (error) {
//         console.error("Error fetching state data:", error);
//       }
//     };
//     getStatesData();
//   }, []);

//   // Fetch currencies
//   useEffect(() => {
//     const fetchCurrencies = async () => {
//       try {
//         const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
//         const data = await response.json();
//         const currencyOptions = Object.keys(data.rates).map(currency => ({
//           value: currency,
//           label: `${currency} - ${currency}`,
//         }));
//         setCurrencies(currencyOptions);
//       } catch (error) {
//         console.error("Error fetching currencies:", error);
//       }
//     };
//     fetchCurrencies();
//   }, []);

//   const countryStates = states.find((country) => country.name === selectedCountry)?.states || [];
//   const stateOptions = countryStates.map((state, index) => ({
//     value: state.name,
//     label: state.name,
//   }));

//   // OTP Handlers
//   const handleSendOTP = async () => {
//     if (!email) {
//       toast.error("Email is required!");
//       return;
//     }

//     setLoading(true);
//     setApiError("");

//     try {
//       await authAPI.sendOTP(email);
//       setShowEmailContent(true);
//       setApiSuccess("OTP sent to your email");
//       toast.success("OTP sent to your email");
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setApiError(error.response?.data?.message || "Failed to send OTP");
//       toast.error(error.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otp || otp.length !== 6) {
//       toast.error("Please enter 6-digit OTP");
//       return;
//     }

//     setLoading(true);
//     setApiError("");

//     try {
//       await authAPI.verifyOTP(email, otp);
//       setIsEmailVerified(true);
//       setApiSuccess("Email verified successfully");
//       toast.success("Email verified successfully");
//       handleNext();
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       setApiError(error.response?.data?.message || "Failed to verify OTP");
//       toast.error(error.response?.data?.message || "Failed to verify OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setLoading(true);
//     setApiError("");

//     try {
//       await authAPI.resendOTP(email);
//       setApiSuccess("OTP resent successfully");
//       toast.success("OTP resent successfully");
//     } catch (error) {
//       console.error("Resend OTP error:", error);
//       setApiError(error.response?.data?.message || "Failed to resend OTP");
//       toast.error(error.response?.data?.message || "Failed to resend OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearOtp = () => {
//     setOtp("");
//   };

//   const handleNext = () => {
//     if (currentStep === 0) {
//       setCurrentStep(1);
//     } else if (currentStep === 1) {
//       if (subStep < 7) {
//         setSubStep((prevSubStep) => prevSubStep + 1);
//       } else {
//         setCurrentStep(2);
//       }
//     } else if (currentStep === 2) {
//       if (settingsStep < 9) {
//         setSettingsStep((prevSettingsStep) => prevSettingsStep + 1);
//       }
//     }
//   };

//   const setValbox = (checked) => {
//     setIsChecked(checked);
//   };

//   const createAccount = async () => {
//     if (!email) {
//       toast.error("Email is required!");
//       return;
//     }
//     if (!isChecked) {
//       toast.error("Accept terms and conditions");
//       return;
//     }
//     await handleSendOTP();
//   };

//   // Validation functions
//   const submitUserinfo = (e) => {
//     e.preventDefault();
//     if (firstname === "") {
//       toast.error("First Name Required!");
//     } else if (lastName === "") {
//       toast.error("Last Name Required!");
//     } else if (phoneNumber === "") {
//       toast.error("Phone number required");
//     } else {
//       handleNext();
//     }
//   };

//   const submitFerminfo = (e) => {
//     e.preventDefault();
//     if (firmName === "") {
//       toast.error("Firm Name Required!");
//     } else if (selectedCountry === "") {
//       toast.error("Select Country!");
//     } else if (selectedState === "") {
//       toast.error("Select state!");
//     } else {
//       handleNext();
//     }
//   };

//   const submitFirmDetail = (e) => {
//     e.preventDefault();
//     if (firmSize === 0) {
//       toast.error("Select Firm Size!");
//     } else if (!referenceFrom) {
//       toast.error("Select how you heard about us!");
//     } else {
//       handleNext();
//     }
//   };

//   const handleServiceToggle = (service) => {
//     setButtonStates2(prev => ({
//       ...prev,
//       [service]: !prev[service]
//     }));
//   };

//   const selectedServicesList = Object.keys(buttonStates2).filter(key => buttonStates2[key]);

//   const handleSelectAll = () => {
//     const allSelected = selectedServicesList.length === serviceOptions.length;
//     const newStates = {};
//     serviceOptions.forEach(service => {
//       newStates[service] = !allSelected;
//     });
//     setButtonStates2(newStates);
//   };

//   const submitService = (e) => {
//     e.preventDefault();
//     if (selectedServicesList.length === 0) {
//       toast.error("Select at least one service!");
//     } else {
//       handleNext();
//     }
//   };

//   const handleToggle3 = (index) => {
//     const updatedStates = buttonStates3.map((state, i) => (i === index ? !state : false));
//     setButtonStates3(updatedStates);
//     setRole(roleOptions[index]);
//   };

//   const submitRole = (e) => {
//     e.preventDefault();
//     if (!role) {
//       toast.error("Select your role!");
//     } else {
//       handleNext();
//     }
//   };

//   const submiturl = (e) => {
//     e.preventDefault();
//     if (url === "") {
//       toast.error("Choose web URL!");
//     } else if (!selectedCurrency) {
//       toast.error("Select Currency!");
//     } else if (!selectedLanguage) {
//       toast.error("Select language!");
//     } else {
//       handleNext();
//     }
//   };

//   const submitPassword = async (e) => {
//     e.preventDefault();

//     if (password === "") {
//       toast.error("Password is required!");
//       return;
//     }
//     if (password.length < 8) {
//       toast.error("Password must be at least 8 characters!");
//       return;
//     }
//     if (confirmPassword === "") {
//       toast.error("Confirm password is required!");
//       return;
//     }
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     const isValid = Object.values(passwordValidation).every(v => v === true);
//     if (!isValid) {
//       toast.error("Password does not meet requirements!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const registrationData = {
//         email,
//         password,
//         username: `${firstname} ${lastName}`,
//         firstName: firstname,
//         middleName: middleName,
//         lastName: lastName,
//         phoneNumber: phoneNumber.replace(/\D/g, ''),
//         firmName,
//         state: selectedState,
//         country: selectedCountry,
//         streetAddress: "",
//         city: "",
//         postalCode: "",
//         firmPhoneNumber: phoneNumber.replace(/\D/g, ''),
//         website: "",
//         firmEmail: email,
//         firmSize: firmSize,
//         referenceFrom: referenceFrom,
//         services: selectedServicesList,
//         role: role,
//         firmURL: url.toLowerCase() + ".pms.com",
//         currency: selectedCurrency?.value || "USD",
//         language: selectedLanguage?.value || "English(British)",
//       };

//       const response = await authAPI.registerAdmin(registrationData);
      
//       toast.success("Registration successful!");
      
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPasswordValidationColor = (isValid) => {
//     return isValid ? "text-green-600" : "text-red-600";
//   };

//   // Render functions
//   const renderFormFields = () => {
//     switch (currentStep) {
//       case 0:
//         return showEmailContent ? renderOTPVerification() : null;
//       case 1:
//         return renderInformationSteps();
//       case 2:
//         return renderSettingsSteps();
//       default:
//         return null;
//     }
//   };

//   const renderOTPVerification = () => (
//     <div className="flex justify-center items-center my-10 flex-col px-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold text-center">
//             Confirmation Code
//           </CardTitle>
//           <CardDescription className="text-center">
//             We sent a confirmation code to your email: <b>{email}</b>
//             <br />
//             Please enter it below:
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {apiError && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{apiError}</AlertDescription>
//             </Alert>
//           )}
//           {apiSuccess && (
//             <Alert className="mb-4 border-green-500 text-green-700">
//               <AlertDescription>{apiSuccess}</AlertDescription>
//             </Alert>
//           )}

//           <div className="flex justify-center my-4">
//             <OtpInput
//               value={otp}
//               onChange={setOtp}
//               numInputs={6}
//               renderInput={(props) => (
//                 <input
//                   {...props}
//                   className="w-12 h-14 text-4xl font-sans m-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               )}
//             />
//           </div>

//           <div className="flex justify-center gap-2 mb-4 items-center">
//             <span className="text-sm">Didn't receive it?</span>
//             <Button variant="link" onClick={handleResendOTP} disabled={loading}>
//               {loading ? "Sending..." : "Resend code"}
//             </Button>
//           </div>

//           <div className="flex gap-4 justify-center">
//             <Button variant="outline" onClick={handleClearOtp} disabled={loading}>
//               Clear OTP
//             </Button>
//             <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
//               {loading ? "Verifying..." : "Verify"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );

//   const renderInformationSteps = () => {
//     switch (subStep) {
//       case 3:
//         return (
//           <div className="flex justify-center items-center my-10 flex-col px-4">
//             <Card className="w-full max-w-md">
//               <CardHeader>
//                 <CardTitle className="text-3xl font-bold text-center">
//                   Your Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form>
//                   <div className="space-y-4">
//                     <div>
//                       <Label>First Name</Label>
//                       <Input
//                         placeholder="First Name"
//                         value={firstname}
//                         onChange={(e) => setFirstname(e.target.value)}
//                         className="mt-2"
//                       />
//                     </div>
//                     <div>
//                       <Label>Middle Name</Label>
//                       <Input
//                         placeholder="Middle Name"
//                         value={middleName}
//                         onChange={(e) => setMiddleName(e.target.value)}
//                         className="mt-2"
//                       />
//                     </div>
//                     <div>
//                       <Label>Last Name</Label>
//                       <Input
//                         placeholder="Last Name"
//                         value={lastName}
//                         onChange={(e) => setLastName(e.target.value)}
//                         className="mt-2"
//                       />
//                     </div>
//                     <div>
//                       <Label>Phone Number</Label>
//                       <PhoneInput
//                         containerStyle={{ width: "100%", marginTop: "8px" }}
//                         inputStyle={{ width: "100%", height: "40px" }}
//                         country={"us"}
//                         placeholder="Enter phone number"
//                         value={phoneNumber}
//                         onChange={setPhoneNumber}
//                         isValid={(inputNumber, country, countries) => {
//                           return countries.some((country) => {
//                             return startsWith(inputNumber, country.dialCode) || startsWith(country.dialCode, inputNumber);
//                           });
//                         }}
//                       />
//                     </div>
//                     <Button onClick={submitUserinfo} disabled={loading} className="w-full">
//                       Next
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="flex justify-center items-center my-10 flex-col px-4">
//             <Card className="w-full max-w-md">
//               <CardHeader>
//                 <CardTitle className="text-3xl font-bold text-center">
//                   Firm Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form>
//                   <div className="space-y-4">
//                     <div>
//                       <Label>Firm Name</Label>
//                       <Input
//                         placeholder="Enter firm name"
//                         value={firmName}
//                         onChange={(e) => setFirmName(e.target.value)}
//                         className="mt-2"
//                       />
//                     </div>

//                     <div>
//                       <Label>Country</Label>
//                       <Select
//                         value={selectedCountry}
//                         onValueChange={(value) => {
//                           setSelectedCountry(value);
//                           setSelectedState("");
//                         }}
//                       >
//                         <SelectTrigger className="mt-2">
//                           <SelectValue placeholder="Select Country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countries.map((country) => (
//                             <SelectItem key={country.label} value={country.label}>
//                               {country.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div>
//                       <Label>State</Label>
//                       <Select
//                         value={selectedState}
//                         onValueChange={setSelectedState}
//                         disabled={!selectedCountry}
//                       >
//                         <SelectTrigger className="mt-2">
//                           <SelectValue placeholder="Select State" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {stateOptions.map((state) => (
//                             <SelectItem key={state.value} value={state.value}>
//                               {state.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <Button onClick={submitFerminfo} disabled={loading} className="w-full">
//                       Next
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       case 5:
//         return (
//           <div className="flex justify-center items-center my-10 flex-col px-4">
//             <Card className="w-full max-w-2xl">
//               <CardHeader>
//                 <CardTitle className="text-3xl font-bold text-center">
//                   Firm details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div>
//                     <Label className="font-semibold">Firm Size</Label>
//                     <div className="flex items-center gap-4 mt-2">
//                       <Input
//                         type="number"
//                         value={firmSize}
//                         onChange={(e) => setFirmSize(Number(e.target.value))}
//                         className="w-24 text-center"
//                         min={1}
//                         max={200}
//                       />
//                       <Slider
//                         value={[firmSize]}
//                         onValueChange={(val) => setFirmSize(val[0])}
//                         min={1}
//                         max={200}
//                         step={1}
//                         className="flex-1"
//                       />
//                     </div>
//                     <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                       <span>1</span>
//                       <span>50</span>
//                       <span>100</span>
//                       <span>200+</span>
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="font-semibold">How did you hear about PMS Solutions?</Label>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {referenceOptions.map((option) => (
//                         <Button
//                           key={option}
//                           variant={referenceFrom === option ? "default" : "outline"}
//                           onClick={() => setReferenceFrom(option)}
//                           className="text-sm"
//                         >
//                           {option}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>

//                   <Button onClick={submitFirmDetail} disabled={loading} className="w-full">
//                     Next
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       case 6:
//         return (
//           <div className="flex justify-center items-center my-10 flex-col px-4">
//             <Card className="w-full max-w-4xl">
//               <CardHeader>
//                 <CardTitle className="text-3xl font-bold text-center">
//                   Services your firm offers
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
//                   {serviceOptions.map((service) => (
//                     <Button
//                       key={service}
//                       variant={buttonStates2[service] ? "default" : "outline"}
//                       onClick={() => handleServiceToggle(service)}
//                       className="text-sm"
//                     >
//                       {service.replace(/([A-Z])/g, ' $1').trim()}
//                     </Button>
//                   ))}
//                 </div>

//                 <div className="flex items-center justify-center gap-4 mt-6">
//                   <div className="flex items-center gap-2">
//                     <Checkbox
//                       id="select-all"
//                       checked={selectedServicesList.length === serviceOptions.length}
//                       onCheckedChange={handleSelectAll}
//                     />
//                     <Label htmlFor="select-all">Select All</Label>
//                   </div>
//                   <Button onClick={submitService} disabled={loading}>
//                     Next
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       case 7:
//         return (
//           <div className="flex justify-center items-center my-10 flex-col px-4">
//             <Card className="w-full max-w-2xl">
//               <CardHeader>
//                 <CardTitle className="text-3xl font-bold text-center">
//                   Your role in the firm
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {roleOptions.map((option) => (
//                     <Button
//                       key={option}
//                       variant={role === option ? "default" : "outline"}
//                       onClick={() => setRole(option)}
//                       className="w-full"
//                     >
//                       {option}
//                     </Button>
//                   ))}
//                 </div>
//                 <Button onClick={submitRole} disabled={loading} className="w-full mt-6">
//                   Next
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const renderSettingsSteps = () => {
//     switch (settingsStep) {
//       case 8:
//         return (
//           <div className="flex flex-col md:flex-row items-center justify-center my-10 px-4">
//             <Card className="w-full md:w-1/2">
//               <CardHeader>
//                 <CardTitle className="text-2xl">Firm Settings</CardTitle>
//                 <CardDescription>
//                   A powerful, integrated platform to manage teams, clients, projects.
//                   <br />
//                   <b>from $50/mo per user</b> (with a 3-year subscription plan)
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <Label>Choose web URL</Label>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       You will be able to set up a fully custom domain (without .pms.com) later
//                     </p>
//                     <div className="flex gap-2 mt-2">
//                       <Input
//                         value={url}
//                         onChange={(e) => setUrl(e.target.value.replace(/[^a-z0-9]/gi, ''))}
//                         placeholder="Enter your URL"
//                         className="flex-1"
//                       />
//                       <span className="text-sm text-muted-foreground flex items-center">.pms.com</span>
//                     </div>
//                     <p className="text-sm text-red-600 mt-1">You cannot change it later</p>
//                   </div>

//                   <div>
//                     <Label>Select Currency</Label>
//                     <Select
//                       value={selectedCurrency?.value}
//                       onValueChange={(value) => {
//                         const currency = currencies.find(c => c.value === value);
//                         setSelectedCurrency(currency);
//                       }}
//                     >
//                       <SelectTrigger className="mt-2">
//                         <SelectValue placeholder="Select a currency" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {currencies.map((currency) => (
//                           <SelectItem key={currency.value} value={currency.value}>
//                             {currency.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label>Select Language</Label>
//                     <Select
//                       value={selectedLanguage?.value}
//                       onValueChange={(value) => {
//                         const language = languages.find(l => l.value === value);
//                         setSelectedLanguage(language);
//                       }}
//                     >
//                       <SelectTrigger className="mt-2">
//                         <SelectValue placeholder="Select a language" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {languages.map((language) => (
//                           <SelectItem key={language.value} value={language.value}>
//                             {language.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <Button onClick={submiturl} disabled={loading} className="w-full">
//                     Continue
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//             <div className="hidden md:block w-1/2">
//               <img 
//                 style={{ height: "500px", width: "100%", objectFit: "cover" }} 
//                 src={firmsetting} 
//                 alt="Firm setting" 
//               />
//             </div>
//           </div>
//         );

//       case 9:
//         return (
//           <div className="flex justify-center items-center my-10 flex-col px-4">
//             <Card className="w-full max-w-md">
//               <CardHeader>
//                 <CardTitle className="text-3xl font-bold text-center">
//                   Set Password
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {apiError && (
//                   <Alert variant="destructive" className="mb-4">
//                     <AlertDescription>{apiError}</AlertDescription>
//                   </Alert>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <Label>Password</Label>
//                     <div className="relative mt-2">
//                       <Input
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Password"
//                         className="pr-10"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 mt-3">
//                       <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasNumber)}`}>
//                         <span>✓</span> a number
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasUppercase)}`}>
//                         <span>✓</span> uppercase letter
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasLowercase)}`}>
//                         <span>✓</span> lowercase letter
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasSymbol)}`}>
//                         <span>✓</span> a symbol
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasMinLength)} col-span-2`}>
//                         <span>✓</span> at least 8 characters
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <Label>Confirm Password</Label>
//                     <div className="relative mt-2">
//                       <Input
//                         type={showConfirmPassword ? "text" : "password"}
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         placeholder="Confirm Password"
//                         className="pr-10"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>
//                   </div>

//                   <Button onClick={submitPassword} disabled={loading} className="w-full">
//                     {loading ? "Registering..." : "Complete Registration"}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       {showEmailContent && (
//         <div className="flex items-center justify-between p-3 shadow-sm">
//           <div className="flex items-center gap-2 p-2">
//             <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
//             <span className="font-bold text-xl">PMS Solutions</span>
//           </div>
//           <Stepper activeStep={currentStep} className="flex-1 mx-4">
//             {steps.map((label, index) => (
//               <Step key={index}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//           <Button variant="outline" onClick={handleAdminLogin}>
//             Log In
//           </Button>
//         </div>
//       )}

//       <div>
//         {renderFormFields()}
//       </div>

//       {!showEmailContent && (
//         <div>
//           <div className="flex items-center gap-2 p-4">
//             <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
//             <span className="font-bold text-xl">PMS Solutions</span>
//           </div>
//           <div className="flex justify-center items-center my-10 flex-col px-4">
//             <Card className="w-full max-w-md">
//               <CardHeader>
//                 <CardTitle className="text-3xl font-bold text-center">
//                   Signup
//                 </CardTitle>
//                 <CardDescription className="text-center">
//                   Sign up your firm and start upgrading your workflow
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {apiError && (
//                   <Alert variant="destructive" className="mb-4">
//                     <AlertDescription>{apiError}</AlertDescription>
//                   </Alert>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <Label>Email</Label>
//                     <Input
//                       type="email"
//                       placeholder="Enter Your Email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="mt-2"
//                     />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Checkbox
//                       id="terms"
//                       checked={isChecked}
//                       onCheckedChange={setValbox}
//                     />
//                     <Label htmlFor="terms" className="text-sm text-gray-600">
//                       I agree to the terms and conditions
//                     </Label>
//                   </div>

//                   <Button onClick={createAccount} disabled={loading} className="w-full">
//                     {loading ? "Creating Account..." : "Create Account"}
//                   </Button>

//                   <div className="text-center text-sm">
//                     Already have an account?{" "}
//                     <NavLink to="/login" className="text-blue-600 hover:underline">
//                       Sign in
//                     </NavLink>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyForm;
import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {useToastContext} from "../context/ToastContext";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import firmsetting from "../Images/setting.png";
import micropms from "../Images/micropms.png";
import { authAPI } from "../services/api";

// Custom Stepper Component
const Stepper = ({ activeStep, steps, children }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= activeStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-xs mt-2 text-center font-medium hidden sm:block">
                {label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 ${
                  index < activeStep ? "bg-blue-600" : "bg-gray-200"
                }`}
                style={{ transform: "translateY(-50%)" }}
              />
            )}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

// Custom Slider Component
const CustomSlider = ({ value, onValueChange, min, max, step = 1 }) => {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className="relative w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([parseInt(e.target.value)])}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

const MyForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
const {showToast} = useToastContext();
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
  const [buttonStates2, setButtonStates2] = useState({});

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
      showToast({
        title: "Email required",
        description: "Please enter your email address.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await authAPI.sendOTP(email);
      setShowEmailContent(true);
      setApiSuccess("OTP sent to your email");
      showToast({
        title: "OTP sent",
        description: "OTP sent to your email",
        type: "success",
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      setApiError(error.response?.data?.message || "Failed to send OTP");
      showToast({
        title: "Failed to send OTP",
        description: error.response?.data?.message || "Failed to send OTP",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showToast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await authAPI.verifyOTP(email, otp);
      setIsEmailVerified(true);
      setApiSuccess("Email verified successfully");
      showToast({
        title: "Email verified successfully",
        description: "Your email has been verified successfully.",
        type: "success",
      });
      handleNext();
    } catch (error) {
      console.error("Verify OTP error:", error);
      setApiError(error.response?.data?.message || "Failed to verify OTP");
      showToast({
        title: "Failed to verify OTP",
        description: error.response?.data?.message || "Failed to verify OTP",
        type: "error",
      });
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
      showToast({
        title: "OTP resent",
        description: "OTP resent to your email",
        type: "success",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      setApiError(error.response?.data?.message || "Failed to resend OTP");
      showToast({
        title: "Failed to resend OTP",
        description: error.response?.data?.message || "Failed to resend OTP",
        type: "error",
      });
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

  const setValbox = (checked) => {
    setIsChecked(checked);
  };

  const createAccount = async () => {
    if (!email) {
      showToast({
        title: "Email required",
        description: "Please enter your email address.",
        type: "error",
      });
      return;
    }
    if (!isChecked) {
      showToast({
        title: "Terms and conditions",
        description: "Please accept the terms and conditions.",
        type: "error",
      });
      return;
    }
    await handleSendOTP();
  };

  // Validation functions
  const submitUserinfo = (e) => {
    e.preventDefault();
    if (firstname === "") {
      showToast({
        title: "First Name Required",
        description: "Please enter your first name.",
        type: "error",
      });
    } else if (lastName === "") {
      showToast({
        title: "Last Name Required",
        description: "Please enter your last name.",
        type: "error",
      });
    } else if (phoneNumber === "") {
      showToast({
        title: "Phone Number Required",
        description: "Please enter your phone number.",
        type: "error",
      });
    } else {
      handleNext();
    }
  };

  const submitFerminfo = (e) => {
    e.preventDefault();
    if (firmName === "") {
      showToast({
        title: "Firm Name Required",
        description: "Please enter your firm name.",
        type: "error",
      });
    } else if (selectedCountry === "") {
      showToast({
        title: "Country Required",
        description: "Please select a country.",
        type: "error",
      });
    } else if (selectedState === "") {
      showToast({
        title: "State Required",
        description: "Please select a state.",
        type: "error",
      });
    } else {
      handleNext();
    }
  };

  const submitFirmDetail = (e) => {
    e.preventDefault();
    if (firmSize === 0) {
      showToast({
        title: "Firm Size Required",
        description: "Please select your firm size.",
        type: "error",
      });
    } else if (!referenceFrom) {
      showToast({
        title: "Reference Required",
        description: "Please select how you heard about us.",
        type: "error",
      });
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
      showToast({
        title: "Services Required",
        description: "Please select at least one service.",
        type: "error",
      });
    } else {
      handleNext();
    }
  };

  const submitRole = (e) => {
    e.preventDefault();
    if (!role) {
      showToast({
        title: "Role Required",
        description: "Please select your role.",
        type: "error",
      });
    } else {
      handleNext();
    }
  };

  const submiturl = (e) => {
    e.preventDefault();
    if (url === "") {
      showToast({
        title: "Web URL Required",
        description: "Please choose a web URL.",
        type: "error",
      });
    } else if (!selectedCurrency) {
      showToast({
        title: "Currency Required",
        description: "Please select a currency.",
        type: "error",
      });
    } else if (!selectedLanguage) {
      showToast({
        title: "Language Required",
        description: "Please select a language.",
        type: "error",
      });
    } else {
      handleNext();
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();

    if (password === "") {
      showToast({
        title: "Password Required",
        description: "Please enter a password.",
        type: "error",
      });
      return;
    }
    if (password.length < 8) {
      showToast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters.",
        type: "error",
      });
      return;
    }
    if (confirmPassword === "") {
      showToast({
        title: "Confirm Password Required",
        description: "Please confirm your password.",
        type: "error",
      });
      return;
    }
    if (password !== confirmPassword) {
      showToast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        type: "error",
      });
      return;
    }

    const isValid = Object.values(passwordValidation).every(v => v === true);
    if (!isValid) {
      showToast({
        title: "Invalid Password",
        description: "Password does not meet requirements.",
        type: "error",
      });
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
        firmURL: url.toLowerCase() + ".pms.com",
        currency: selectedCurrency?.value || "USD",
        language: selectedLanguage?.value || "English(British)",
      };

      const response = await authAPI.registerAdmin(registrationData);
      
      showToast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showToast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Registration failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordValidationColor = (isValid) => {
    return isValid ? "text-green-600" : "text-red-600";
  };

  // Render functions
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
    <div className="flex justify-center items-center my-10 flex-col px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Confirmation Code
          </CardTitle>
          <CardDescription className="text-center">
            We sent a confirmation code to your email: <b>{email}</b>
            <br />
            Please enter it below:
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          {apiSuccess && (
            <Alert className="mb-4 border-green-500 text-green-700">
              <AlertDescription>{apiSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center my-4">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-12 h-14 text-4xl font-sans m-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>

          <div className="flex justify-center gap-2 mb-4 items-center">
            <span className="text-sm">Didn't receive it?</span>
            <Button variant="link" onClick={handleResendOTP} disabled={loading}>
              {loading ? "Sending..." : "Resend code"}
            </Button>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleClearOtp} disabled={loading}>
              Clear OTP
            </Button>
            <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInformationSteps = () => {
    switch (subStep) {
      case 3:
        return (
          <div className="flex justify-center items-center my-10 flex-col px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="space-y-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Middle Name</Label>
                      <Input
                        placeholder="Middle Name"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <PhoneInput
                        containerStyle={{ width: "100%", marginTop: "8px" }}
                        inputStyle={{ width: "100%", height: "40px" }}
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
                    </div>
                    <Button onClick={submitUserinfo} disabled={loading} className="w-full">
                      Next
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="flex justify-center items-center my-10 flex-col px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Firm Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="space-y-4">
                    <div>
                      <Label>Firm Name</Label>
                      <Input
                        placeholder="Enter firm name"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Country</Label>
                      <Select
                        value={selectedCountry}
                        onValueChange={(value) => {
                          setSelectedCountry(value);
                          setSelectedState("");
                        }}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.label} value={country.label}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>State</Label>
                      <Select
                        value={selectedState}
                        onValueChange={setSelectedState}
                        disabled={!selectedCountry}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateOptions.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={submitFerminfo} disabled={loading} className="w-full">
                      Next
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="flex justify-center items-center my-10 flex-col px-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Firm details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="font-semibold">Firm Size</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input
                        type="number"
                        value={firmSize}
                        onChange={(e) => setFirmSize(Number(e.target.value))}
                        className="w-24 text-center"
                        min={1}
                        max={200}
                      />
                      <CustomSlider
                        value={[firmSize]}
                        onValueChange={(val) => setFirmSize(val[0])}
                        min={1}
                        max={200}
                        step={1}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1</span>
                      <span>50</span>
                      <span>100</span>
                      <span>200+</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold">How did you hear about PMS Solutions?</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {referenceOptions.map((option) => (
                        <Button
                          key={option}
                          variant={referenceFrom === option ? "default" : "outline"}
                          onClick={() => setReferenceFrom(option)}
                          className="text-sm"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={submitFirmDetail} disabled={loading} className="w-full">
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="flex justify-center items-center my-10 flex-col px-4">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Services your firm offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {serviceOptions.map((service) => (
                    <Button
                      key={service}
                      variant={buttonStates2[service] ? "default" : "outline"}
                      onClick={() => handleServiceToggle(service)}
                      className="text-sm"
                    >
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedServicesList.length === serviceOptions.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all">Select All</Label>
                  </div>
                  <Button onClick={submitService} disabled={loading}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="flex justify-center items-center my-10 flex-col px-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Your role in the firm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roleOptions.map((option) => (
                    <Button
                      key={option}
                      variant={role === option ? "default" : "outline"}
                      onClick={() => setRole(option)}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Button onClick={submitRole} disabled={loading} className="w-full mt-6">
                  Next
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSettingsSteps = () => {
    switch (settingsStep) {
      case 8:
        return (
          <div className="flex flex-col md:flex-row items-center justify-center my-10 px-4">
            <Card className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle className="text-2xl">Firm Settings</CardTitle>
                <CardDescription>
                  A powerful, integrated platform to manage teams, clients, projects.
                  <br />
                  <b>from $50/mo per user</b> (with a 3-year subscription plan)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Choose web URL</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      You will be able to set up a fully custom domain (without .pms.com) later
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value.replace(/[^a-z0-9]/gi, ''))}
                        placeholder="Enter your URL"
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground flex items-center">.pms.com</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">You cannot change it later</p>
                  </div>

                  <div>
                    <Label>Select Currency</Label>
                    <Select
                      value={selectedCurrency?.value}
                      onValueChange={(value) => {
                        const currency = currencies.find(c => c.value === value);
                        setSelectedCurrency(currency);
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Select Language</Label>
                    <Select
                      value={selectedLanguage?.value}
                      onValueChange={(value) => {
                        const language = languages.find(l => l.value === value);
                        setSelectedLanguage(language);
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={submiturl} disabled={loading} className="w-full">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="hidden md:block w-1/2">
              <img 
                style={{ height: "500px", width: "100%", objectFit: "cover" }} 
                src={firmsetting} 
                alt="Firm setting" 
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="flex justify-center items-center my-10 flex-col px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Set Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                {apiError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{apiError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label>Password</Label>
                    <div className="relative mt-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasNumber)}`}>
                        <CheckCircle size={12} /> a number
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasUppercase)}`}>
                        <CheckCircle size={12} /> uppercase letter
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasLowercase)}`}>
                        <CheckCircle size={12} /> lowercase letter
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasSymbol)}`}>
                        <CheckCircle size={12} /> a symbol
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${getPasswordValidationColor(passwordValidation.hasMinLength)} col-span-2`}>
                        <CheckCircle size={12} /> at least 8 characters
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Confirm Password</Label>
                    <div className="relative mt-2">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button onClick={submitPassword} disabled={loading} className="w-full">
                    {loading ? "Registering..." : "Complete Registration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {showEmailContent && (
        <div className="flex items-center justify-between p-3 shadow-sm">
          <div className="flex items-center gap-2 p-2">
            <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
            <span className="font-bold text-xl">PMS Solutions</span>
          </div>
          <Stepper activeStep={currentStep} steps={steps}>
            {/* Children can be added here if needed */}
          </Stepper>
          <Button variant="outline" onClick={handleAdminLogin}>
            Log In
          </Button>
        </div>
      )}

      <div>
        {renderFormFields()}
      </div>

      {!showEmailContent && (
        <div>
          <div className="flex items-center gap-2 p-4">
            <img src={micropms} style={{ height: "40px" }} alt="PMS Logo" />
            <span className="font-bold text-xl">PMS Solutions</span>
          </div>
          <div className="flex justify-center items-center my-10 flex-col px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Signup
                </CardTitle>
                <CardDescription className="text-center">
                  Sign up your firm and start upgrading your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{apiError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="terms"
                      checked={isChecked}
                      onCheckedChange={setValbox}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the terms and conditions
                    </Label>
                  </div>

                  <Button onClick={createAccount} disabled={loading} className="w-full">
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <NavLink to="/login" className="text-blue-600 hover:underline">
                      Sign in
                    </NavLink>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyForm;