// import React ,{useState}from 'react'
// import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import LinkOffIcon from '@mui/icons-material/LinkOff';
// import VpnKeyIcon from '@mui/icons-material/VpnKey';
// const MenuDropdown = ({ contact, onUnlink, onResetPassword }) => {
//     const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUnlinkClick = () => {
//     onUnlink(contact);
//     handleClose();
//   };

//   const handleResetPasswordClick = () => {
//     onResetPassword(contact);
//     handleClose();
//   };

//   return (
//     <>
//      <IconButton
//         onClick={handleClick}
//         size="small"
//         sx={{ ml: 1 }}
//       >
//         <MoreVertIcon />
//       </IconButton>
      
//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         onClick={(e) => e.stopPropagation()}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1,
//             minWidth: 160,
//           }
//         }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <MenuItem onClick={handleUnlinkClick}>
//           <ListItemIcon>
//             <LinkOffIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           <ListItemText primary="Unlink" primaryTypographyProps={{ color: 'error' }} />
//         </MenuItem>
        
//         <MenuItem onClick={handleResetPasswordClick} disabled={!contact.canLogin}>
//           <ListItemIcon>
//             <VpnKeyIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText primary="Reset Password" />
//         </MenuItem>
//       </Menu></>
//   )
// }

// export default MenuDropdown


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { Button } from "../../components/ui/button";

import {
  MoreVertical,
  Link2Off,
  KeyRound,
} from "lucide-react";

const MenuDropdown = ({
  contact,
  onUnlink,
  onResetPassword,
}) => {
  const handleUnlinkClick = (e) => {
    e.stopPropagation();
    onUnlink(contact);
  };

  const handleResetPasswordClick = (e) => {
    e.stopPropagation();
    onResetPassword(contact);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          className="
            h-8 w-8 rounded-xl
            text-muted-foreground
            hover:text-foreground
            hover:bg-muted/60
            transition-all duration-200
            shrink-0
          "
        >
          <MoreVertical className="h-4 w-4" />

          <span className="sr-only">
            Open menu
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          w-52 rounded-2xl
          border border-border/60
          bg-background/95
          backdrop-blur-xl
          shadow-xl
          p-1.5
        "
        style={{
          fontFamily: "var(--font-family)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={handleUnlinkClick}
          className="
            h-10 rounded-xl
            cursor-pointer
            gap-2.5
            text-destructive
            focus:bg-destructive/10
            focus:text-destructive
            transition-colors
          "
          style={{
            fontSize:
              "calc(0.88rem * var(--font-scale, 100) / 100)",
          }}
        >
          <Link2Off className="h-4 w-4" />

          <span>Unlink Contact</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={!contact.canLogin}
          onClick={handleResetPasswordClick}
          className="
            h-10 rounded-xl
            cursor-pointer
            gap-2.5
            transition-colors

            focus:bg-primary/10
            focus:text-primary

            disabled:opacity-40
            disabled:pointer-events-none
          "
          style={{
            fontSize:
              "calc(0.88rem * var(--font-scale, 100) / 100)",
          }}
        >
          <KeyRound className="h-4 w-4" />

          <span>Reset Password</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default MenuDropdown