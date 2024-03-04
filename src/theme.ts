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
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { fontSize: '14px' },
      },
    },
  },
});
