import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: { verticalAlign: 'middle', fontSize: '24px' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { color: 'inherit' },
        colorPrimary: { color: '#1976d2' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { fontSize: '14px' },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: { zIndex: 11000 },
      },
    },
  },
});
