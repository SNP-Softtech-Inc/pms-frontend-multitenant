// import React, { createContext, useContext, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
// } from "@mui/material";

// const ConfirmContext = createContext();

// export const ConfirmProvider = ({ children }) => {
//   const [open, setOpen] = useState(false);
//   const [dialogConfig, setDialogConfig] = useState({});

//   const confirm = ({ title, description, onConfirm }) => {
//     setDialogConfig({ title, description, onConfirm });
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleConfirm = () => {
//     dialogConfig.onConfirm?.();
//     setOpen(false);
//   };

//   return (
//     <ConfirmContext.Provider value={confirm}>
//       {children}

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>{dialogConfig.title || "Confirm"}</DialogTitle>

//         <DialogContent>
//           <Typography>
//             {dialogConfig.description || "Are you sure?"}
//           </Typography>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button color="error" variant="contained" onClick={handleConfirm}>
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </ConfirmContext.Provider>
//   );
// };

// export const useConfirm = () => useContext(ConfirmContext);


import React, { createContext, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const confirm = ({ title, description, onConfirm }) => {
    setDialogConfig({ title, description, onConfirm });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    dialogConfig.onConfirm?.();
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogConfig.title || "Confirm"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {dialogConfig.description || "Are you sure?"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);