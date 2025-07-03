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
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 800,
        },
        h2: {
            fontWeight: 800,
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
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
                    },
                },
            },
        },
    },
});

export default theme; 