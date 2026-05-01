// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   CircularProgress,
//   IconButton,
//   InputAdornment,
//   Stepper,
//   Step,
//   StepLabel,
//   Card,
//   CardContent
// } from '@mui/material';
// import {
//   Visibility,
//   VisibilityOff,
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon
// } from '@mui/icons-material';
// import { toast } from 'react-toastify';
// import { authAPI } from '../../services/api';

// const ActivateAccount = () => {
//   const { id, token } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [validating, setValidating] = useState(true);
//   const [error, setError] = useState('');
//   const [teamMemberData, setTeamMemberData] = useState(null);
  
//   // Password fields
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
//   // Password validation
//   const [passwordValidation, setPasswordValidation] = useState({
//     hasMinLength: false,
//     hasNumber: false,
//     hasUppercase: false,
//     hasLowercase: false,
//     hasSymbol: false
//   });

//   // Steps
//   const [activeStep, setActiveStep] = useState(0);
//   const steps = ['Validate Link', 'Set Password', 'Activation Complete'];

//   // Validate token on load
//   useEffect(() => {
//     validateToken();
//   }, []);

//   // Password validation effect
//   useEffect(() => {
//     setPasswordValidation({
//       hasMinLength: password.length >= 8,
//       hasNumber: /\d/.test(password),
//       hasUppercase: /[A-Z]/.test(password),
//       hasLowercase: /[a-z]/.test(password),
//       hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
//     });
//   }, [password]);

//   const validateToken = async () => {
//     setValidating(true);
//     setError('');
    
//     try {
//       const response = await authAPI.validateActivationToken(id, token);
      
//       if (response.data.success) {
//         setTeamMemberData(response.data.data);
//         setActiveStep(1);
//         toast.success('Link verified successfully! Please set your password.');
//       }
//     } catch (error) {
//       console.error('Validation error:', error);
//       const errorMessage = error.response?.data?.message || 'Invalid or expired activation link';
//       setError(errorMessage);
//       setActiveStep(-1);
//       toast.error(errorMessage);
//     } finally {
//       setValidating(false);
//     }
//   };

//   const handleActivate = async (e) => {
//     e.preventDefault();

//     // Validate password
//     const isValid = Object.values(passwordValidation).every(v => v === true);
//     if (!isValid) {
//       toast.error('Please meet all password requirements');
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await authAPI.activateTeamMember(id, token, password, confirmPassword);

//       if (response.data.success) {
//         setActiveStep(2);
//         toast.success('Account activated successfully!');
//           navigate('/login');
//         // Redirect to login after 3 seconds
//         // setTimeout(() => {
//         //   navigate('/login');
//         // }, 3000);
//       }
//     } catch (error) {
//       console.error('Activation error:', error);
//       const errorMessage = error.response?.data?.message || 'Activation failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendActivation = async () => {
//     if (!teamMemberData?.teamMemberId) {
//       toast.error('Team member ID not found');
//       return;
//     }

//     setLoading(true);
//     try {
//       await authAPI.resendActivation(teamMemberData.teamMemberId);
//       toast.success('New activation email sent! Please check your inbox.');
//     } catch (error) {
//       console.error('Resend error:', error);
//       toast.error(error.response?.data?.message || 'Failed to resend activation email');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (validating) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (activeStep === -1) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
//         <Paper sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
//           <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
//           <Typography variant="h5" color="error" gutterBottom>
//             Invalid Activation Link
//           </Typography>
//           <Typography variant="body1" paragraph color="text.secondary">
//             {error || 'This activation link is invalid or has expired.'}
//           </Typography>
//           <Typography variant="body2" paragraph color="text.secondary">
//             Please contact your administrator to request a new activation link.
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
//             <Button 
//               variant="contained" 
//               onClick={() => navigate('/login')}
//             >
//               Go to Login
//             </Button>
//             <Button 
//               variant="outlined" 
//               onClick={handleResendActivation}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={20} /> : 'Resend Email'}
//             </Button>
//           </Box>
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       minHeight: '100vh', 
//       display: 'flex', 
//       alignItems: 'center', 
//       justifyContent: 'center',
//       bgcolor: '#f5f5f5',
//       p: 2
//     }}>
//       <Card sx={{ maxWidth: 500, width: '100%' }}>
//         <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
//           {/* Header */}
//           <Box sx={{ textAlign: 'center', mb: 4 }}>
//             <Typography variant="h4" sx={{ color: '#043a77', fontWeight: 700, mb: 1 }}>
//               PMS Solutions
//             </Typography>
//             <Typography variant="h6" color="text.secondary">
//               Account Activation
//             </Typography>
//           </Box>

//           {/* Stepper */}
//           <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           {/* Team Member Info */}
//           {teamMemberData && activeStep >= 1 && (
//             <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
//               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                 Account Details
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Name:</strong> {teamMemberData.firstName} {teamMemberData.lastName}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Email:</strong> {teamMemberData.email}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Role:</strong> {teamMemberData.role}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Firm:</strong> {teamMemberData.firmName}
//               </Typography>
//             </Paper>
//           )}

//           {error && (
//             <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//               {error}
//             </Alert>
//           )}

//           {/* Step 1: Set Password */}
//           {activeStep === 1 && (
//             <form onSubmit={handleActivate}>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                 Please set a strong password for your account. You'll use this password to log in.
//               </Typography>

//               <TextField
//                 fullWidth
//                 label="Password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 sx={{ mb: 2 }}
//                 disabled={loading}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton 
//                         onClick={() => setShowPassword(!showPassword)} 
//                         edge="end"
//                         disabled={loading}
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="caption" display="block" sx={{ 
//                   color: passwordValidation.hasMinLength ? 'success.main' : 'text.secondary',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 0.5,
//                   mb: 0.5
//                 }}>
//                   <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasMinLength ? 'success' : 'disabled'} />
//                   At least 8 characters
//                 </Typography>
//                 <Typography variant="caption" display="block" sx={{ 
//                   color: passwordValidation.hasNumber ? 'success.main' : 'text.secondary',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 0.5,
//                   mb: 0.5
//                 }}>
//                   <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasNumber ? 'success' : 'disabled'} />
//                   Contains at least one number
//                 </Typography>
//                 <Typography variant="caption" display="block" sx={{ 
//                   color: passwordValidation.hasUppercase ? 'success.main' : 'text.secondary',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 0.5,
//                   mb: 0.5
//                 }}>
//                   <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasUppercase ? 'success' : 'disabled'} />
//                   Contains at least one uppercase letter
//                 </Typography>
//                 <Typography variant="caption" display="block" sx={{ 
//                   color: passwordValidation.hasLowercase ? 'success.main' : 'text.secondary',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 0.5,
//                   mb: 0.5
//                 }}>
//                   <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasLowercase ? 'success' : 'disabled'} />
//                   Contains at least one lowercase letter
//                 </Typography>
//                 <Typography variant="caption" display="block" sx={{ 
//                   color: passwordValidation.hasSymbol ? 'success.main' : 'text.secondary',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 0.5
//                 }}>
//                   <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasSymbol ? 'success' : 'disabled'} />
//                   Contains at least one special character
//                 </Typography>
//               </Box>

//               <TextField
//                 fullWidth
//                 label="Confirm Password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 sx={{ mb: 3 }}
//                 error={confirmPassword && password !== confirmPassword}
//                 helperText={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
//                 disabled={loading}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton 
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
//                         edge="end"
//                         disabled={loading}
//                       >
//                         {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 disabled={loading}
//                 sx={{ py: 1.5 }}
//               >
//                 {loading ? <CircularProgress size={24} /> : 'Activate Account'}
//               </Button>

//               <Box sx={{ mt: 2, textAlign: 'center' }}>
//                 <Button
//                   variant="text"
//                   onClick={handleResendActivation}
//                   disabled={loading}
//                   size="small"
//                 >
//                   Resend Activation Email
//                 </Button>
//               </Box>
//             </form>
//           )}

//           {/* Step 2: Activation Complete */}
//           {activeStep === 2 && (
//             <Box sx={{ textAlign: 'center' }}>
//               <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
//               <Typography variant="h5" gutterBottom color="success.main">
//                 Activation Complete!
//               </Typography>
//               <Typography variant="body1" paragraph color="text.secondary">
//                 Your account has been successfully activated.
//               </Typography>
//               <Typography variant="body2" color="text.secondary" paragraph>
//                 You will be redirected to the login page in a few seconds...
//               </Typography>
//               <Button
//                 variant="contained"
//                 onClick={() => navigate('/login')}
//                 sx={{ mt: 2 }}
//               >
//                 Go to Login Now
//               </Button>
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ActivateAccount;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';

const ActivateAccount = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState('');
  const [teamMemberData, setTeamMemberData] = useState(null);
  
  // Password fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSymbol: false
  });

  // Steps
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Validate Link', 'Set Password', 'Activation Complete'];

  // Validate token on load
  useEffect(() => {
    validateToken();
  }, []);

  // Password validation effect
  useEffect(() => {
    setPasswordValidation({
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const validateToken = async () => {
    setValidating(true);
    setError('');
    
    try {
      const response = await authAPI.validateActivationToken(id, token);
      
      if (response.data.success) {
        setTeamMemberData(response.data.data);
        setActiveStep(1);
        toast.success('Link verified successfully! Please set your password.');
      }
    } catch (error) {
      console.error('Validation error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid or expired activation link';
      setError(errorMessage);
      setActiveStep(-1);
      toast.error(errorMessage);
    } finally {
      setValidating(false);
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();

    // Validate password
    const isValid = Object.values(passwordValidation).every(v => v === true);
    if (!isValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.activateTeamMember(id, token, password, confirmPassword);

      if (response.data.success) {
        setActiveStep(2);
        toast.success('Account activated successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Activation error:', error);
      const errorMessage = error.response?.data?.message || 'Activation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendActivation = async () => {
    if (!teamMemberData?.teamMemberId) {
      toast.error('Team member ID not found');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resendActivation(teamMemberData.teamMemberId);
      toast.success('New activation email sent! Please check your inbox.');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend activation email');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (activeStep === -1) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-2">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Invalid Activation Link
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'This activation link is invalid or has expired.'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact your administrator to request a new activation link.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Go to Login
            </button>
            <button
              onClick={handleResendActivation}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Resend Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#043a77] mb-2">
              PMS Solutions
            </h1>
            <h2 className="text-lg text-gray-600">
              Account Activation
            </h2>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((label, index) => (
                <div key={label} className="flex flex-col items-center flex-1">
                  <div className="relative flex items-center justify-center w-full">
                    {index !== 0 && (
                      <div className={`absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 ${
                        index <= activeStep ? 'bg-primary' : 'bg-gray-200'
                      }`} style={{ left: '-50%', right: '50%' }} />
                    )}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      index < activeStep 
                        ? 'bg-primary text-white' 
                        : index === activeStep 
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < activeStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${
                      index === activeStep ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Member Info */}
          {teamMemberData && activeStep >= 1 && (
            <div className="bg-gray-50 rounded-lg border p-4 mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Account Details
              </p>
              <p className="text-sm">
                <strong>Name:</strong> {teamMemberData.firstName} {teamMemberData.lastName}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {teamMemberData.email}
              </p>
              <p className="text-sm">
                <strong>Role:</strong> {teamMemberData.role}
              </p>
              <p className="text-sm">
                <strong>Firm:</strong> {teamMemberData.firmName}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {/* Step 1: Set Password */}
          {activeStep === 1 && (
            <form onSubmit={handleActivate}>
              <p className="text-sm text-gray-600 mb-4">
                Please set a strong password for your account. You'll use this password to log in.
              </p>

              <div className="mb-4">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-4 space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasMinLength ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasNumber ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                    Contains at least one number
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasUppercase ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                    Contains at least one uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasLowercase ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}>
                    Contains at least one lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasSymbol ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-500'}>
                    Contains at least one special character
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={`flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-500 focus-visible:ring-red-500' 
                        : 'border-input'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Activate Account
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResendActivation}
                  disabled={loading}
                  className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                >
                  Resend Activation Email
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Activation Complete */}
          {activeStep === 2 && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Activation Complete!
              </h2>
              <p className="text-gray-600 mb-2">
                Your account has been successfully activated.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                You will be redirected to the login page in a few seconds...
              </p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Go to Login Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;