import React, { useState ,useEffect} from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Devices as DevicesIcon,
  Person as PersonIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import {authAPI} from '../services/api';
const LogoutButton = () => {
    const AUTH_USER_URL =
    process.env.REACT_APP_AUTH_USER;

    
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialog, setLogoutDialog] = useState({ open: false, logoutAll: false });
    const [userData, setUserData] = useState({
    username: 'User',
    email: 'email',
    profilePicture: null
  });

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitial = user?.username?.charAt(0)?.toUpperCase() || 'U';
 const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${AUTH_USER_URL}${path}`;
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.id) return;

        const res = await authAPI.getSingleUser(user.id);
        const { user: userInfo, } = res.data;
console.log("logged user",res.data)
        setUserData({
          username: userInfo?.username || 'User',
          email: userInfo?.email || 'email',
          profilePicture: userInfo?.profilePicture
 || null
        });
      } catch (error) {
        console.error(error);
        // toast.error('Failed to load profile');
      }
    };

    fetchUser();
  }, [user?.id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/settings/myaccount');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/settings/firmsettings');
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialog({ open: true, logoutAll: false });
  };

  const handleLogoutAllClick = () => {
    handleMenuClose();
    setLogoutDialog({ open: true, logoutAll: true });
  };

  const handleDialogClose = () => {
    setLogoutDialog({ open: false, logoutAll: false });
  };

  return (
    <>
      <Button
        onClick={handleMenuOpen}
        color="inherit"
        sx={{ textTransform: 'none' }}
        startIcon={
          // <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          //   {userInitial}
          // </Avatar>
                     <Avatar
            sx={{ width: 32, height: 32 }}
            src={getImageUrl(userData.profilePicture) || undefined}
          >
            {!userData.profilePicture && userInitial}
          </Avatar>

        }
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'email'}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
        </MenuItem>

        <MenuItem onClick={handleLogoutAllClick}>
          <ListItemIcon>
            <DevicesIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText primary="Logout from all devices" sx={{ color: 'warning.main' }} />
        </MenuItem>
      </Menu>

      <Logout
        open={logoutDialog.open}
        onClose={handleDialogClose}
        logoutAll={logoutDialog.logoutAll}
      />
    </>
  );
};

export default LogoutButton;