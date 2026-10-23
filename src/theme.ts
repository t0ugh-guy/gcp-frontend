import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#16a34a', light: '#4ade80', dark: '#166534' },
    secondary: { main: '#d97706', light: '#fbbf24', dark: '#92400e' },
    error: { main: '#dc2626' },
    background: { default: '#f0fdf4', paper: '#ffffff' },
    text: { primary: '#14532d', secondary: '#4b5563' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease, background 0.25s ease',
          '&:hover': {
            boxShadow: '0 8px 28px rgba(22,163,74,0.14)',
            transform: 'translateY(-3px)',
            background: 'rgba(255, 255, 255, 0.95)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 6 } },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#f0fdf4' },
          transition: 'background 0.15s ease',
        },
      },
    },
  },
})
