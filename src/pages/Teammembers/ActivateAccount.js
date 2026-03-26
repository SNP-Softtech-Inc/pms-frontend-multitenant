import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
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
        // Redirect to login after 3 seconds
        // setTimeout(() => {
        //   navigate('/login');
        // }, 3000);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (activeStep === -1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
        <Paper sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Invalid Activation Link
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            {error || 'This activation link is invalid or has expired.'}
          </Typography>
          <Typography variant="body2" paragraph color="text.secondary">
            Please contact your administrator to request a new activation link.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleResendActivation}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Resend Email'}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f5f5f5',
      p: 2
    }}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#043a77', fontWeight: 700, mb: 1 }}>
              PMS Solutions
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Account Activation
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Team Member Info */}
          {teamMemberData && activeStep >= 1 && (
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Account Details
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {teamMemberData.firstName} {teamMemberData.lastName}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {teamMemberData.email}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {teamMemberData.role}
              </Typography>
              <Typography variant="body2">
                <strong>Firm:</strong> {teamMemberData.firmName}
              </Typography>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Step 1: Set Password */}
          {activeStep === 1 && (
            <form onSubmit={handleActivate}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please set a strong password for your account. You'll use this password to log in.
              </Typography>

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" display="block" sx={{ 
                  color: passwordValidation.hasMinLength ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 0.5
                }}>
                  <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasMinLength ? 'success' : 'disabled'} />
                  At least 8 characters
                </Typography>
                <Typography variant="caption" display="block" sx={{ 
                  color: passwordValidation.hasNumber ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 0.5
                }}>
                  <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasNumber ? 'success' : 'disabled'} />
                  Contains at least one number
                </Typography>
                <Typography variant="caption" display="block" sx={{ 
                  color: passwordValidation.hasUppercase ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 0.5
                }}>
                  <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasUppercase ? 'success' : 'disabled'} />
                  Contains at least one uppercase letter
                </Typography>
                <Typography variant="caption" display="block" sx={{ 
                  color: passwordValidation.hasLowercase ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 0.5
                }}>
                  <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasLowercase ? 'success' : 'disabled'} />
                  Contains at least one lowercase letter
                </Typography>
                <Typography variant="caption" display="block" sx={{ 
                  color: passwordValidation.hasSymbol ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <CheckCircleIcon fontSize="inherit" color={passwordValidation.hasSymbol ? 'success' : 'disabled'} />
                  Contains at least one special character
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
                error={confirmPassword && password !== confirmPassword}
                helperText={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        edge="end"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Activate Account'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="text"
                  onClick={handleResendActivation}
                  disabled={loading}
                  size="small"
                >
                  Resend Activation Email
                </Button>
              </Box>
            </form>
          )}

          {/* Step 2: Activation Complete */}
          {activeStep === 2 && (
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="success.main">
                Activation Complete!
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Your account has been successfully activated.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                You will be redirected to the login page in a few seconds...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Go to Login Now
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivateAccount;