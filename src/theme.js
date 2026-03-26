import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563eb", // Blue
    },
    secondary: {
      main: "#7c3aed", // Purple
    },

    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },

    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },

    divider: "#e5e7eb",
  },

  typography: {
    fontFamily: "'Inter', sans-serif",

    h6: {
      fontWeight: 600,
    },
    body2: {
      fontSize: "0.875rem",
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #e5e7eb",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
     // ✅ ADD THIS
  MuiTextField: {
    defaultProps: {
      size: "small",
    },
  },
  },
});