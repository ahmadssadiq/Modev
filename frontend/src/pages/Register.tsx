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
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotifications';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const notify = useNotify();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!fullName) {
            newErrors.fullName = 'Full name is required';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email format is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
            await register({ email, password, full_name: fullName });
            notify.success('Welcome!', 'Account created successfully. Choose your plan to get started.');
            // Small delay to ensure auth state is updated
            setTimeout(() => {
                navigate('/plan-selection');
            }, 100);
        } catch (err: any) {
            console.error('Registration failed:', err);
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
                p: 3,
                position: 'relative',
            }}
        >
            {/* Back Button - Top Right of Screen */}
            <IconButton
                onClick={() => navigate(-1)}
                sx={{
                    position: 'fixed',
                    top: 24,
                    left: 24,
                    zIndex: 1000,
                    color: '#6b7280',
                    backgroundColor: '#ffffff',
                    width: 48,
                    height: 48,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                    }
                }}
            >
                <ArrowLeftIcon style={{ width: 24, height: 24 }} />
            </IconButton>

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
                        backgroundImage: 'url(https://images.unsplash.com/photo-1612522677838-2338b1b0b65d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
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

                {/* Right Side - Register Form */}
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
                        <Button
                            onClick={() => navigate('/')}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                minWidth: 'auto',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e55b30 0%, #ff9d7a 100%)',
                                    boxShadow: '0 4px 8px rgba(255, 97, 39, 0.3)',
                                }
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
                                MODEV
                            </Typography>
                        </Button>
                    </Box>

                    {/* Form Content */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            px: 5,
                            pt: 0,
                            pb: 2,
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
                                Create your account
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    color: '#666666',
                                    mb: 2,
                                    fontSize: '0.8rem',
                                }}
                            >
                            </Typography>

                            {/* Form */}
                            <Stack spacing={1.5} component="form" onSubmit={handleSubmit}>
                                {/* Full Name Field */}
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
                                        Full Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName}
                                        placeholder="Enter your full name"
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
                                        placeholder="Create password"
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

                                {/* Confirm Password Field */}
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
                                        Confirm Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        placeholder="Confirm password"
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                        size="small"
                                                        sx={{ color: '#999999' }}
                                                    >
                                                        {showConfirmPassword ? (
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

                                {/* Terms Agreement */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={agreeToTerms}
                                            onChange={(e) => setAgreeToTerms(e.target.checked)}
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
                                            I agree to the{' '}
                                            <Link
                                                to="/terms"
                                                style={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#667eea',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link
                                                to="/privacy"
                                                style={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#667eea',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Privacy Policy
                                            </Link>
                                        </Typography>
                                    }
                                />

                                {/* Error Display */}
                                {(error || errors.agreeToTerms) && (
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
                                            {error || errors.agreeToTerms}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Sign Up Button */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        py: 1,
                                        borderRadius: 2,
                                        background: '#FFB99F',
                                        textTransform: 'none',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            background: '#ff9d7a',
                                            boxShadow: 'none',
                                        },
                                        '&:disabled': {
                                            background: '#cccccc',
                                        },
                                    }}
                                >
                                    {loading ? 'Creating account...' : 'Create account'}
                                </Button>

                                <Divider sx={{ my: 1 }} />

                                {/* Google Sign Up */}
                                {/* <Button
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
                                                backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjY0IDkuMjA0NTVDMTcuNjQgOC41NjYzNiAxNy41ODI3IDcuOTUyNzMgMTcuNDc2NCA3LjM2MzY0SDE5VjEwLjY5OTFIMTMuNDQzNkMxMy4yNDE4IDExLjYyNTUgMTIuNDY2NCAxMi4zNzA5IDExLjQ1NDUgMTIuODM2NEw5LjM1OTA5IDExLjkzNjRWMTUuMTY5MUgxNC41MzgyQzE2LjU5NTUgMTMuMzM2NCAxNy42NCA1NC1lLTUgMTcuNjQgOS4yMDQ1NVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTkgMTgDMTEuNDMgMTggMTMuNDY3MyAxNy4xOTQ1IDE1IDEwLjI3MjdMMTEuNDU0NSAxMi44MzY0QzEwLjU5MDkgMTMuNzY2NCA5IDEzIDk5IDEzUzYuNDA5MSAxNS4yNzI3IDYuNDA5MSAxNS4yNzI3TDQuMjI3MjcgMTUuMjcyN0M1LjY5MDkxIDEzLjk2MzYgOCAxNCA5IDE4WiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNNC4yMjcyNyAxNS4yNzI3QzMuODQwOTEgMTQuMjk1NSA0LjE4MTgyIDEzLjE4MTggNCA5VjEyLjgzNjRIMTFMMTEuNDU0NSAxMi44MzY0QzEyLjQ5MDkgMTAuODE4MiAxMy4zNjM2IDUuODA5MDkgOSA1LjU0NTQ1WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNOSA0LjJDMTAuNjY4NCA0LjIgMTIuMjA0NSA0Ljc2MDkxIDEzLjQ1NDUgNi4wNTQ1NUwxMS40NTQ1IDcuNzI3MjdDMTAuNzQ1NSA3LjIyNzI3IDEwLjIyNzMgNi45ODI3MyA5IDUuNDU0NTVDNi45OTU0NSA1LjQ1NDU1IDUuMjQwOTEgNi44NjM2NCA0LjY4MTgyIDguNTQ1NDVMNC4yMjcyNyAxMS40NTQ1SDE4QzQgNi4yNTQ1NSA1LjcyNzI3IDQuMiA5IDQuMloiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+)',
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        />
                                    }
                                >
                                    Or sign up with Google
                                </Button> */}

                                {/* Sign In Link */}
                                <Box sx={{ textAlign: 'center', mt: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#666666',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        Already have an account?{' '}
                                        <Link
                                            to="/login"
                                            style={{
                                                fontFamily: '"Nunito Sans", sans-serif',
                                                color: '#667eea',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Sign in
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

export default Register; 