import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Stack,
    Divider,
} from '@mui/material';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotifications';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const notify = useNotify();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email format is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await login({ email, password });
            notify.success('Welcome back!', 'Successfully logged in');
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login failed:', err);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                p: 3
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: 1000,
                    height: 600,
                    backgroundColor: '#ffffff',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
            >
                {/* Left Side - Background Image */}
                <Box
                    sx={{
                        flex: 1,
                        backgroundImage: 'url(https://images.unsplash.com/photo-1749226697962-950d46f7a0f7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                        },
                    }}
                />

                {/* Right Side - Login Form */}
                <Box
                    sx={{
                        width: 480,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        position: 'relative',
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ p: 4, textAlign: 'right' }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#ffffff',
                                }}
                            />
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontFamily: '"Instrument Serif", serif',
                                    color: '#ffffff',
                                    fontWeight: 400,
                                    fontSize: '0.9rem',
                                }}
                            >
                                MovDev
                            </Typography>
                        </Box>
                    </Box>

                    {/* Form Content */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            px: 5,
                            pt: 0,
                            pb: 30,
                        }}
                    >
                        <Box sx={{ maxWidth: 340, width: '100%' }}>
                            {/* Header */}
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: '"Instrument Serif", serif',
                                    color: '#1a1a1a',
                                    fontWeight: 400,
                                    mb: 0.5,
                                    fontSize: '1.5rem',
                                }}
                            >
                                Nice to see you again
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    color: '#666666',
                                    mb: 3,
                                    fontSize: '0.8rem',
                                }}
                            >
                                Login
                            </Typography>

                            {/* Form */}
                            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#333333',
                                            mb: 0.5,
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        Email or phone number
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        placeholder="Enter your email"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#f8f9fa',
                                                border: 'none',
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: '2px solid #667eea',
                                                },
                                                '&.Mui-error fieldset': {
                                                    border: '2px solid #ef4444',
                                                },
                                                '& input': {
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#333333',
                                                    fontSize: '0.8rem',
                                                    py: 1,
                                                    '&::placeholder': {
                                                        color: '#999999',
                                                        opacity: 1,
                                                    },
                                                },
                                            },
                                            '& .MuiFormHelperText-root': {
                                                fontFamily: '"Nunito Sans", sans-serif',
                                                fontSize: '0.7rem',
                                                mt: 0.5,
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Password Field */}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#333333',
                                            mb: 0.5,
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        placeholder="Enter password"
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        size="small"
                                                        sx={{ color: '#999999' }}
                                                    >
                                                        {showPassword ? (
                                                            <EyeSlashIcon style={{ width: 16, height: 16 }} />
                                                        ) : (
                                                            <EyeIcon style={{ width: 16, height: 16 }} />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#f8f9fa',
                                                border: 'none',
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: '2px solid #667eea',
                                                },
                                                '&.Mui-error fieldset': {
                                                    border: '2px solid #ef4444',
                                                },
                                                '& input': {
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#333333',
                                                    fontSize: '0.8rem',
                                                    py: 1,
                                                    '&::placeholder': {
                                                        color: '#999999',
                                                        opacity: 1,
                                                    },
                                                },
                                            },
                                            '& .MuiFormHelperText-root': {
                                                fontFamily: '"Nunito Sans", sans-serif',
                                                fontSize: '0.7rem',
                                                mt: 0.5,
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Remember Me & Forgot Password */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                size="small"
                                                sx={{
                                                    color: '#cccccc',
                                                    padding: 0.5,
                                                    '&.Mui-checked': {
                                                        color: '#667eea',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#666666',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                Remember me
                                            </Typography>
                                        }
                                    />
                                    <Link
                                        to="/forgot-password"
                                        style={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#667eea',
                                            textDecoration: 'none',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                </Box>

                                {/* Error Display */}
                                {error && (
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: '#fef2f2',
                                            border: '1px solid #fecaca',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: '"Nunito Sans", sans-serif',
                                                color: '#dc2626',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {error}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Sign In Button */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        py: 1,
                                        borderRadius: 2,
                                        background: '#1976d2',
                                        textTransform: 'none',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            background: '#1565c0',
                                            boxShadow: 'none',
                                        },
                                        '&:disabled': {
                                            background: '#cccccc',
                                        },
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </Button>

                                <Divider sx={{ my: 1 }} />

                                {/* Google Sign In */}
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        py: 1,
                                        borderRadius: 2,
                                        borderColor: '#e0e0e0',
                                        color: '#ffffff',
                                        textTransform: 'none',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 500,
                                        fontSize: '0.8rem',
                                        backgroundColor: '#333333',
                                        '&:hover': {
                                            backgroundColor: '#555555',
                                            borderColor: '#333333',
                                        },
                                    }}
                                    startIcon={
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjY0IDkuMjA0NTVDMTcuNjQgOC41NjYzNiAxNy41ODI3IDcuOTUyNzMgMTcuNDc2NCA3LjM2MzY0SDE5VjEwLjY5OTFIMTMuNDQzNkMxMy4yNDE4IDExLjYyNTUgMTIuNDY2NCAxMi4zNzA5IDExLjQ1NDUgMTIuODM2NEw5LjM1OTA5IDExLjkzNjRWMTUuMTY5MUgxNC41MzgyQzE2LjU5NTUgMTMuMzM2NCAxNy42NCA1NC1lLTUgMTcuNjQgOS4yMDQ1NVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTkgMThDMTEuNDMgMTggMTMuNDY3MyAxNy4xOTQ1IDE1IDEwLjI3MjdMMTEuNDU0NSAxMi44MzY0QzEwLjU5MDkgMTMuNzY2NCA5IDEzIDk5IDEzUzYuNDA5MSAxNS4yNzI3IDYuNDA5MSAxNS4yNzI3TDQuMjI3MjcgMTUuMjcyN0M1LjY5MDkxIDEzLjk2MzYgOCAxNCA5IDE4WiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNNC4yMjcyNyAxNS4yNzI3QzMuODQwOTEgMTQuMjk1NSA0LjE4MTgyIDEzLjE4MTggNCA5VjEyLjgzNjRIMTFMMTEuNDU0NSAxMi44MzY0QzEyLjQ5MDkgMTAuODE4MiAxMy4zNjM2IDUuODA5MDkgOSA1LjU0NTQ1WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNOSA0LjJDMTAuNjY4NCA0LjIgMTIuMjA0NSA0Ljc2MDkxIDEzLjQ1NDUgNi4wNTQ1NUwxMS40NTQ1IDcuNzI3MjdDMTAuNzQ1NSA3LjIyNzI3IDEwLjIyNzMgNi45ODI3MyA5IDUuNDU0NTVDNi45OTU0NSA1LjQ1NDU1IDUuMjQwOTEgNi44NjM2NCA0LjY4MTgyIDguNTQ1NDVMNC4yMjcyNyAxMS40NTQ1SDE4QzQgNi4yNTQ1NSA1LjcyNzI3IDQuMiA5IDQuMloiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+)',
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        />
                                    }
                                >
                                    Or sign in with Google
                                </Button>

                                {/* Sign Up Link */}
                                <Box sx={{ textAlign: 'center', mt: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#666666',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        Don't have an account?{' '}
                                        <Link
                                            to="/register"
                                            style={{
                                                fontFamily: '"Nunito Sans", sans-serif',
                                                color: '#667eea',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Sign up now
                                        </Link>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login; 