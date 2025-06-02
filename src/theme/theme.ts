import { createTheme } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";

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

const theme = createTheme({
  palette: {
    primary: {
      main: "#0F4C81",
      light: "#5684AE",
    },
    background: {
      default: "#F0F7F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#94A3B8",
    },
    calendar: {
      lightBlue: "#1a73e8",
      darkBlue: "#0F4C81",
      lightOrange: "#f6bf26",
      darkOrange: "#F9BE81",
      tileColor: "rgba(26, 115, 232, 0.08)",
    },
    divider: "rgba(0, 0, 0, 0.06)",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#0F4C81",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#0F4C81",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.8125rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.8125rem",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontSize: "0.8125rem",
          padding: "4px 12px",
          minHeight: 32,
        },
        outlined: {
          borderColor: "#E2E8F0",
          color: "#64748B",
          "&:hover": {
            borderColor: "#CBD5E1",
            backgroundColor: "rgba(15, 76, 129, 0.04)",
          },
        },
        contained: {
          backgroundColor: "#5684AE",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#0F4C81",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#0F4C81",
          padding: 8,
          "&:hover": {
            backgroundColor: "rgba(15, 76, 129, 0.04)",
          },
        },
        sizeSmall: {
          padding: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 20,
          fontSize: "0.6875rem",
          backgroundColor: "#5684AE",
          color: "#FFFFFF",
          fontWeight: 500,
        },
        sizeSmall: {
          height: 18,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 24,
          height: 24,
          fontSize: "0.875rem",
          border: "2px solid #FFFFFF",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        grouped: {
          "&:not(:last-of-type)": {
            borderColor: "rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
  },
});

export default theme;
