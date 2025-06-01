import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    calendar: {
      lightBlue: string;
      darkBlue: string;
      lightOrange: string;
      darkOrange: string;
      tileColor: string;
    };
  }
  interface PaletteOptions {
    calendar: {
      lightBlue: string;
      darkBlue: string;
      lightOrange: string;
      darkOrange: string;
      tileColor: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0F4C81", // Dark Blue
      light: "#5684AE", // Light Blue
    },
    secondary: {
      main: "#F9BE81", // Dark Orange
      light: "#FFE4C8", // Light Orange
    },
    calendar: {
      lightBlue: "#5684AE",
      darkBlue: "#0F4C81",
      lightOrange: "#FFE4C8",
      darkOrange: "#F9BE81",
      tileColor: "#E4F6ED",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
});
