"use client";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "#ffffff",
          contrastText: "#000000",
        },
        secondary: {
          main: "#ffffff",
          contrastText: "#000000",
        },
        background: {
          default: "#000000",
          paper: "#111111",
        },
        text: {
          primary: "#ffffff",
          secondary: "#cccccc",
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: "#000000",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#000000",
          contrastText: "#ffffff",
        },
        background: {
          default: "#ffffff",
          paper: "#eeeeee",
        },
        text: {
          primary: "#000000",
          secondary: "#333333",
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-noto-sans), sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
