

// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import { useAuth } from '../context/AuthContext';


// const Logout = ({ open, onClose, logoutAll = false }) => {
//   const { logout } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogout = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       console.log('Starting logout process...');
//       await logout(logoutAll);
//       console.log('Logout process completed');
      
//       // Close the dialog
//       onClose();
      
//     } catch (error) {
//       console.error('Logout error in component:', error);
      
//       // Even if there's an error, we still want to close the dialog
//       // because the AuthContext should have cleared local data
//       setError('Logout completed with warnings');
      
//       // Close dialog after a short delay
//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={loading ? undefined : onClose} 
//       maxWidth="sm" 
//       fullWidth
//     >
//       <DialogTitle>
//         <Typography variant="h5" component="div">
//           {logoutAll ? 'Logout from All Devices' : 'Confirm Logout'}
//         </Typography>
//       </DialogTitle>
      
//       <DialogContent>
//         {error && (
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
        
//         <Typography variant="body1" sx={{ mb: 2 }}>
//           {logoutAll 
//             ? 'Are you sure you want to logout from all devices?'
//             : 'Are you sure you want to logout?'}
//         </Typography>

//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//             <CircularProgress size={30} />
//           </Box>
//         )}
//       </DialogContent>
      
//       <DialogActions sx={{ p: 2, gap: 1 }}>
//         <Button 
//           onClick={onClose} 
//           variant="outlined"
//           disabled={loading}
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleLogout} 
//           variant="contained" 
//           color="error"
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : 'Logout'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default Logout;

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

const Logout = ({ open, onClose, logoutAll = false }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout(logoutAll);
      onClose();
    } catch (err) {
      console.error(err);
      setTimeout(onClose, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {logoutAll
              ? "Logout from All Devices"
              : "Confirm Logout"}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {logoutAll
            ? "Are you sure you want to logout from all devices?"
            : "Are you sure you want to logout?"}
        </p>

        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Logout;