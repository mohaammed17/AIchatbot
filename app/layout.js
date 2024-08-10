"use client";

import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './page';  // Adjust this import based on your directory structure

export default function RootLayout() {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode,
      background: {
        default: mode === 'light' ? '#f0f0f0' : '#121212',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#ffffff',
      },
    },
  }), [mode]);

  return (
    <html lang="en">
      <body style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1668681919287-7367677cdc4c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: "#121212",
        color: theme.palette.text.primary
      }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div id="main-content">
            <Home toggleMode={toggleMode} mode={mode} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
