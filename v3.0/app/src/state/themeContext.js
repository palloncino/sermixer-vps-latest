import React, { createContext, useState, useContext, useEffect } from "react";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export function useThemeContext() {
  return useContext(ThemeContext);
}

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#333" : "#ffffff",
        light: "#555555",
        dark: "#333",
        contrastText: mode === "light" ? "#ffffff" : "#333",
      },
      secondary: {
        main: mode === "light" ? "#ff6b6b" : "#4db6ac",
        light: "#ff9b9b",
        dark: "#00897b",
        contrastText: mode === "light" ? "#ffffff" : "#ffffff",
      },
      error: {
        main: "#d32f2f",
      },
      warning: {
        main: "#ffa726",
      },
      info: {
        main: "#2979ff",
      },
      success: {
        main: "#2e7d32",
      },
      background: {
        default: mode === "light" ? "#ffffff" : "#303030",
        paper: mode === "light" ? "#fff" : "#fff",
      },
      text: {
        primary: mode === "light" ? "#333" : "#ffffff",
        secondary: mode === "light" ? "#757575" : "#bcbcbc",
      },
      action: {
        active: mode === "light" ? "#333" : "#ffffff",
        hover: mode === "light" ? "#f5f5f5" : "#383838",
        selected: mode === "light" ? "#e0e0e0" : "#4f4f4f",
        disabled: mode === "light" ? "#f5f5f5" : "#424242",
        disabledBackground: mode === "light" ? "#f9f9f9" : "#616161",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === "light"
                ? "#444e57"
                : "#5b6c7e",
            },
          },
          contained: {
            background: mode === "light"
              ? "linear-gradient(to right, #4a5a6e 0%, #333d44 100%)"
              : "linear-gradient(to right, #4a5a6e 0%, #333d44 100%)",
            color: "#ffffff",
            '&:hover': {
              background: mode === "light"
                ? "linear-gradient(to right, #5b6c7e 0%, #444e57 100%)"
                : "linear-gradient(to right, #5b6c7e 0%, #444e57 100%)",
            },
          },
          outlined: {
            border: `1px solid ${mode === "light" ? "#333" : "#ffffff"}`,
            color: mode === "light" ? "#333" : "#ffffff",
            '&:hover': {
              border: `1px solid ${mode === "light" ? "#555" : "#ddd"}`,
              backgroundColor: "transparent",
            },
          },
          containedError: {
            backgroundColor: "#d32f2f",
            color: "#ffffff",
            '&:hover': {
              backgroundColor: "#b71c1c",
            },
          },
          outlinedError: {
            border: "1px solid #d32f2f",
            color: "#d32f2f",
            '&:hover': {
              backgroundColor: "rgba(211, 47, 47, 0.04)",
            },
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1440,
        xl: 1920,
        xxl: 2560,
      },
    },
  });


  const theme = createTheme(getDesignTokens(themeMode));

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};