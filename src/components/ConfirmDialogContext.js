import React, { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const confirm = ({ title, description, onConfirm }) => {
    setDialogConfig({ title, description, onConfirm });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    dialogConfig.onConfirm?.();
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogConfig.title || "Confirm"}</DialogTitle>

        <DialogContent>
          <Typography>
            {dialogConfig.description || "Are you sure?"}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);