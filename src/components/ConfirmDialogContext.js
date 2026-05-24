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
import { ShieldAlert } from "lucide-react";
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
      <AlertDialogContent
        className="
          max-w-md
          rounded-3xl
          border border-border/60
          bg-background/95
          backdrop-blur-xl
          shadow-2xl
          p-0
          overflow-hidden
        "
        style={{
          fontFamily: "var(--font-family)",
        }}
      >
        {/* Header */}
        <div
          className="
            flex items-start gap-4
            px-6 py-5
            border-b border-border/50
            bg-gradient-to-b
            from-muted/30
            to-transparent
          "
        >
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-2xl
              bg-destructive/10
              text-destructive
              border border-destructive/20
            "
          >
            <ShieldAlert className="h-5 w-5" />
          </div>

          <AlertDialogHeader className="space-y-1 text-left">
            <AlertDialogTitle
              className="
                text-foreground
                font-semibold
                tracking-tight
              "
              style={{
                fontSize:
                  "calc(1rem * var(--font-scale, 100) / 100)",
              }}
            >
              {dialogConfig.title || "Confirm Action"}
            </AlertDialogTitle>

            <AlertDialogDescription
              className="
                text-muted-foreground
                leading-relaxed
              "
              style={{
                fontSize:
                  "calc(0.88rem * var(--font-scale, 100) / 100)",
              }}
            >
              {dialogConfig.description ||
                "Are you sure you want to continue?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Footer */}
        <AlertDialogFooter
          className="
            flex-row justify-end gap-2
            px-6 py-4
            border-t border-border/40
            bg-muted/10
          "
        >
          <AlertDialogCancel
  onClick={handleClose}
  className="
    h-10 rounded-2xl

    border border-border/60
    bg-background
    text-foreground

    hover:bg-muted/70
    hover:text-foreground

    dark:bg-muted/20
    dark:hover:bg-muted/40
    dark:text-foreground

    shadow-sm
    transition-all duration-200
  "
  style={{
    fontFamily: "var(--font-family)",
    fontSize:
      "calc(0.86rem * var(--font-scale, 100) / 100)",
  }}
>
  Cancel
</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            className="
              h-10 rounded-2xl
              bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90
              shadow-sm
              transition-all duration-200
            "
            style={{
              fontSize:
                "calc(0.86rem * var(--font-scale, 100) / 100)",
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </ConfirmContext.Provider>
);
  // return (
  //   <ConfirmContext.Provider value={confirm}>
  //     {children}

  //     <AlertDialog open={open} onOpenChange={setOpen}>
  //       <AlertDialogContent>
  //         <AlertDialogHeader>
  //           <AlertDialogTitle>
  //             {dialogConfig.title || "Confirm"}
  //           </AlertDialogTitle>

  //           <AlertDialogDescription>
  //             {dialogConfig.description || "Are you sure?"}
  //           </AlertDialogDescription>
  //         </AlertDialogHeader>

  //         <AlertDialogFooter>
  //           <AlertDialogCancel onClick={handleClose}>
  //             Cancel
  //           </AlertDialogCancel>

  //           <AlertDialogAction
  //             onClick={handleConfirm}
  //             className="bg-destructive text-white hover:bg-destructive/90"
  //           >
  //             Confirm
  //           </AlertDialogAction>
  //         </AlertDialogFooter>
  //       </AlertDialogContent>
  //     </AlertDialog>
  //   </ConfirmContext.Provider>
  // );
};

export const useConfirm = () => useContext(ConfirmContext);