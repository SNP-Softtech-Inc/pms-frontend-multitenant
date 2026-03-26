import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Devices as DevicesIcon,
  PhoneAndroid as MobileIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getActiveSessions();
      setSessions(response.data.sessions || []);
    } catch (error) {
      setError('Failed to load sessions');
      console.error('Sessions error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogoutAll = async () => {
    try {
      await authAPI.logoutAllDevices();
      toast.success('Logged out from all other devices');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to logout from other devices');
    }
  };

  const getDeviceIcon = (device) => {
    const type = device?.type?.toLowerCase() || '';
    if (type.includes('mobile')) return <MobileIcon />;
    if (type.includes('tablet')) return <TabletIcon />;
    return <LaptopIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Active Sessions</Typography>
          <Box>
            <IconButton onClick={fetchSessions} size="small">
              <RefreshIcon />
            </IconButton>
            <Button 
              variant="outlined" 
              color="error" 
              size="small" 
              onClick={handleLogoutAll}
              sx={{ ml: 1 }}
            >
              Logout All
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <List>
          {sessions.map((session, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemIcon>
                  {getDeviceIcon(session)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {session.device || 'Unknown Device'}
                      {session.current && (
                        <Typography 
                          variant="caption" 
                          sx={{ ml: 1, color: 'success.main' }}
                        >
                          (Current)
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={`Last active: ${new Date(session.lastActive).toLocaleString()}`}
                />
                {!session.current && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {index < sessions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {sessions.length === 0 && !error && (
          <Typography color="text.secondary" align="center">
            No active sessions found
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Sessions;