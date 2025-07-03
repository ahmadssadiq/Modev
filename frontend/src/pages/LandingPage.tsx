import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';

const LandingPage: React.FC = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Typography variant="h2" gutterBottom sx={{ color: '#333' }}>
                    Welcome to MovDev
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ color: '#666', mb: 4 }}>
                    AI Cost Optimization Platform - Test Landing Page
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/register"
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Get Started
                    </Button>
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/login"
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Sign In
                    </Button>
                </Box>
                <Typography variant="body1" sx={{ mt: 4, color: '#888' }}>
                    If you can see this page, the routing is working correctly.
                </Typography>
            </Container>
        </Box>
    );
};

export default LandingPage; 