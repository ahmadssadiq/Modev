import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#667eea',
            light: '#93c5fd',
            dark: '#4c63d2',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#764ba2',
            light: '#a78bfa',
            dark: '#553c8b',
            contrastText: '#ffffff',
        },
        success: {
            main: '#22c55e',
            light: '#4ade80',
            dark: '#16a34a',
        },
        warning: {
            main: '#eab308',
            light: '#facc15',
            dark: '#ca8a04',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        background: {
            default: '#fafbfc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: [
            'Nunito Sans',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400,
        },
        h2: {
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400,
        },
        h3: {
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400,
        },
        h4: {
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400,
        },
        h5: {
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400,
        },
        h6: {
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400,
        },
        body1: {
            fontFamily: '"Nunito Sans", sans-serif',
        },
        body2: {
            fontFamily: '"Nunito Sans", sans-serif',
        },
        subtitle1: {
            fontFamily: '"Nunito Sans", sans-serif',
        },
        subtitle2: {
            fontFamily: '"Nunito Sans", sans-serif',
        },
        caption: {
            fontFamily: '"Nunito Sans", sans-serif',
        },
        overline: {
            fontFamily: '"Nunito Sans", sans-serif',
        },
        button: {
            fontFamily: '"Nunito Sans", sans-serif',
            textTransform: 'none',
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
                    textTransform: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontFamily: '"Nunito Sans", sans-serif',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontFamily: '"Nunito Sans", sans-serif',
                    },
                    '& .MuiInputLabel-root': {
                        fontFamily: '"Nunito Sans", sans-serif',
                    },
                    '& .MuiFormHelperText-root': {
                        fontFamily: '"Nunito Sans", sans-serif',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: '"Nunito Sans", sans-serif',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: '"Nunito Sans", sans-serif',
                    textTransform: 'none',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: '"Nunito Sans", sans-serif',
                },
            },
        },
    },
});

export default theme; 