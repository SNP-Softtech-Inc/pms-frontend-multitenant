import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Preserve the originally-requested URL (e.g. a deep link from an
    // email notification) so Login can send the user back to it instead
    // of always landing on the default dashboard after signing in.
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;