import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Stack,
    Chip,
    Paper,
    Avatar,
} from '@mui/material';
import {
    CurrencyDollarIcon,
    ChartBarIcon,
    ClockIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    BoltIcon,
    EyeIcon,
    CodeBracketIcon,
    ArrowRightIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
    const integrations = [
        { name: 'OpenAI', logo: '🤖', color: '#10B981' },
        { name: 'Anthropic', logo: '🧠', color: '#8B5CF6' },
        { name: 'Azure OpenAI', logo: '☁️', color: '#3B82F6' },
        { name: 'Google AI', logo: '🌟', color: '#F59E0B' },
    ];

    const insights = [
        {
            icon: <CurrencyDollarIcon className="h-8 w-8" />,
            title: 'Amplify Insights',
            description: 'Unlock data-driven decisions with comprehensive analytics, revealing key opportunities for strategic regional growth.',
        },
        {
            icon: <ShieldCheckIcon className="h-8 w-8" />,
            title: 'Control Your Global Presence',
            description: 'Manage and track AI model offsets ensuring consistent performance and streamlined operations everywhere.',
        },
        {
            icon: <BoltIcon className="h-8 w-8" />,
            title: 'Remove Language Barriers',
            description: 'Adapt to diverse markets with built-in localization for clear communication and enhanced user experience.',
        },
        {
            icon: <ChartBarIcon className="h-8 w-8" />,
            title: 'Visualize Growth',
            description: 'Generate precise, visually compelling reports that illustrate your growth trajectories across all regions.',
        },
    ];

    const bigPictureFeatures = [
        {
            number: '01',
            title: 'Spot Trends in Seconds',
            description: 'No more digging through numbers. Get instant insights into your AI cost patterns.',
        },
        {
            number: '02',
            title: 'Get Everyone on the Same Page',
            description: 'Share easy-to-understand reports with your team for better decision making.',
        },
        {
            number: '03',
            title: 'Make Presentations Pop',
            description: 'Interactive dashboards and visualizations keep your audience engaged with cost data.',
        },
        {
            number: '04',
            title: 'Your Global Snapshot',
            description: 'Get a quick, clear overview of your entire AI operation costs and performance.',
        },
    ];

    const stats = [
        { label: 'Average Cost Reduction', value: '30%', description: 'in first month' },
        { label: 'Setup Time', value: '<60s', description: 'drop-in integration' },
        { label: 'Supported Providers', value: '4+', description: 'and growing' },
        { label: 'Enterprise Ready', value: '99.9%', description: 'uptime SLA' },
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#fafbfc',
            fontFamily: '"Nunito Sans", sans-serif',
        }}>
            {/* Header */}
            <Box
                component="header"
                sx={{
                    py: 2,
                    px: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #e5e7eb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CpuChipIcon style={{ width: 20, height: 20, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Instrument Serif", serif',
                                    fontWeight: 400,
                                    color: '#111827',
                                    fontSize: '1.25rem',
                                }}
                            >
                                MovDev
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/login"
                                sx={{
                                    borderColor: '#e5e7eb',
                                    color: '#374151',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontWeight: 500,
                                    '&:hover': {
                                        borderColor: '#667eea',
                                        backgroundColor: 'rgba(102, 126, 234, 0.05)'
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/register"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ pt: 8, pb: 12 }}>
                <Grid container spacing={6} alignItems="center">
                    {/* Left Side - Content */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ mb: 4 }}>
                            <Chip
                                label="✨ Vendor-Neutral AI Cost Optimization"
                                sx={{
                                    backgroundColor: '#f0f9ff',
                                    color: '#0369a1',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontWeight: 500,
                                    mb: 3,
                                    fontSize: '0.875rem',
                                }}
                            />

                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: '"Instrument Serif", serif',
                                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.1,
                                    color: '#111827',
                                    mb: 3,
                                    letterSpacing: '-0.025em',
                                }}
                            >
                                Optimize Your{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                    }}
                                >
                                    AI Costs
                                </Box>
                                {' '}in Real-Time
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    color: '#6b7280',
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    mb: 4,
                                    fontSize: '1.125rem',
                                }}
                            >
                                The vendor-neutral platform that sits between your applications and AI providers.
                                Track usage, control costs, and save up to 30% on AI spending in your first month.
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    component={Link}
                                    to="/register"
                                    endIcon={<ArrowRightIcon style={{ width: 16, height: 16 }} />}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        }
                                    }}
                                >
                                    Start Free Trial
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    component={Link}
                                    to="/dashboard"
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderColor: '#e5e7eb',
                                        color: '#374151',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        '&:hover': {
                                            borderColor: '#667eea',
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)'
                                        }
                                    }}
                                >
                                    View Demo
                                </Button>
                            </Stack>

                            {/* Integrations */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        color: '#6b7280',
                                        mb: 2,
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    WORKS WITH ALL MAJOR AI PROVIDERS
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {integrations.map((integration, index) => (
                                        <Chip
                                            key={index}
                                            avatar={<Avatar sx={{ bgcolor: 'transparent', fontSize: '1rem' }}>{integration.logo}</Avatar>}
                                            label={integration.name}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                fontFamily: '"Nunito Sans", sans-serif',
                                                borderColor: '#e5e7eb',
                                                backgroundColor: '#ffffff',
                                                '&:hover': {
                                                    borderColor: integration.color,
                                                    backgroundColor: `${integration.color}10`,
                                                }
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Side - Dashboard Preview */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ position: 'relative' }}>
                            {/* Background Gradient */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -20,
                                    left: -20,
                                    right: -20,
                                    bottom: -20,
                                    background: 'linear-gradient(135deg, #667eea10 0%, #764ba220 100%)',
                                    borderRadius: '24px',
                                    zIndex: 0,
                                }}
                            />

                            {/* Dashboard Cards */}
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                {/* Main Dashboard Card */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '16px',
                                        border: '1px solid #e5e7eb',
                                        backgroundColor: '#ffffff',
                                        p: 4,
                                        mb: 3,
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    {/* Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: '"Instrument Serif", serif',
                                                fontWeight: 400,
                                                color: '#111827'
                                            }}
                                        >
                                            AI Cost Dashboard
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                        </Box>
                                    </Box>

                                    {/* Metrics - Fixed to equal width */}
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        {[
                                            { label: 'Total Cost', value: '$247.83', change: '-23%', positive: true },
                                            { label: 'API Calls', value: '1.2M', change: '+12%', positive: false },
                                        ].map((metric, index) => (
                                            <Grid size={{ xs: 6 }} key={index}>
                                                <Box sx={{ textAlign: 'left', width: '100%' }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: '"Nunito Sans", sans-serif',
                                                            color: '#6b7280',
                                                            fontSize: '0.75rem',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        {metric.label}
                                                    </Typography>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontFamily: '"Instrument Serif", serif',
                                                            color: '#111827',
                                                            fontWeight: 400,
                                                            mb: 0.5,
                                                            fontSize: '1.25rem'
                                                        }}
                                                    >
                                                        {metric.value}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontFamily: '"Nunito Sans", sans-serif',
                                                            color: metric.positive ? '#22c55e' : '#6b7280',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {metric.change} vs last month
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Cost Chart Preview */}
                                    <Box
                                        sx={{
                                            height: 80,
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                            borderRadius: '8px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <svg width="100%" height="100%" viewBox="0 0 300 80">
                                            <path
                                                d="M0,60 Q75,40 150,30 T300,20"
                                                stroke="#667eea"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                            <path
                                                d="M0,60 Q75,40 150,30 T300,20 L300,80 L0,80 Z"
                                                fill="rgba(102, 126, 234, 0.2)"
                                            />
                                        </svg>
                                    </Box>
                                </Paper>

                                {/* Model Usage Card */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        backgroundColor: '#ffffff',
                                        p: 3,
                                        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                                        transform: 'translateX(20px)',
                                        width: 'calc(100% - 20px)',
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontFamily: '"Instrument Serif", serif',
                                            color: '#111827',
                                            fontWeight: 400,
                                            mb: 2
                                        }}
                                    >
                                        Model Usage Breakdown
                                    </Typography>
                                    {[
                                        { model: 'GPT-4 Turbo', cost: '$123.45', usage: '45%' },
                                        { model: 'Claude 3 Sonnet', cost: '$89.12', usage: '32%' },
                                        { model: 'GPT-3.5 Turbo', cost: '$35.26', usage: '23%' },
                                    ].map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: '"Nunito Sans", sans-serif',
                                                        color: '#111827',
                                                        fontWeight: 500,
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    {item.model}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right', minWidth: '80px' }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: '"Instrument Serif", serif',
                                                        color: '#111827',
                                                        fontWeight: 400,
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    {item.cost}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontFamily: '"Nunito Sans", sans-serif',
                                                        color: '#6b7280',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    {item.usage}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Paper>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* "We've cracked the code" Section */}
            <Box sx={{ backgroundColor: '#ffffff', py: 16 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'left', mb: 8 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#6b7280',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                mb: 3,
                                letterSpacing: '0.05em',
                            }}
                        >
                            Benefits
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: '"Instrument Serif", serif',
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                fontWeight: 400,
                                color: '#111827',
                                mb: 4,
                                lineHeight: 1.2,
                            }}
                        >
                            We've cracked the code.
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#6b7280',
                                fontWeight: 400,
                                maxWidth: '500px',
                                fontSize: '1rem',
                                lineHeight: 1.6,
                            }}
                        >
                            Area provides real insights, without the data overload
                        </Typography>
                    </Box>

                    <Grid container spacing={6}>
                        {insights.map((insight, index) => (
                            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={index}>
                                <Box sx={{ textAlign: 'left' }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '12px',
                                            backgroundColor: '#f8fafc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            color: '#667eea',
                                        }}
                                    >
                                        {insight.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: '"Instrument Serif", serif',
                                            fontWeight: 400,
                                            color: '#111827',
                                            mb: 2,
                                            fontSize: '1.125rem',
                                        }}
                                    >
                                        {insight.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#6b7280',
                                            lineHeight: 1.6,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {insight.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Large Image Section */}
                    <Box sx={{ mt: 12 }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: { xs: 300, md: 400 },
                                borderRadius: '20px',
                                backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            {/* "See the Big Picture" Section */}
            <Box sx={{ backgroundColor: '#fafbfc', py: 16 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: '"Instrument Serif", serif',
                                    fontSize: { xs: '2.5rem', md: '3rem' },
                                    fontWeight: 400,
                                    color: '#111827',
                                    mb: 4,
                                    lineHeight: 1.2,
                                }}
                            >
                                See the Big Picture
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    color: '#6b7280',
                                    mb: 6,
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                }}
                            >
                                Area turns your data into clear, vibrant visuals that show you exactly what's happening in each region.
                            </Typography>

                            <Stack spacing={4} sx={{ mb: 6 }}>
                                {bigPictureFeatures.map((feature, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: '"Instrument Serif", serif',
                                                color: '#667eea',
                                                fontWeight: 400,
                                                fontSize: '1rem',
                                                minWidth: '30px',
                                            }}
                                        >
                                            {feature.number}
                                        </Typography>
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontFamily: '"Instrument Serif", serif',
                                                    fontWeight: 400,
                                                    color: '#111827',
                                                    mb: 1,
                                                    fontSize: '1.125rem',
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#6b7280',
                                                    lineHeight: 1.6,
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>

                            <Button
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
                                    color: '#ffffff',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontWeight: 600,
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(163, 230, 53, 0.3)',
                                        background: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
                                    }
                                }}
                            >
                                Discover More
                            </Button>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: { xs: 300, md: 400 },
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #c7b299 0%, #a89173 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Abstract 3D Geometric Shapes */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '80%',
                                        height: '80%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {/* Cylinder Stack */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 300,
                                        }}
                                    >
                                        {[0, 1, 2, 3].map((index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: index * 60,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: 80 - index * 10,
                                                    height: 50,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                    borderRadius: '50px 50px 20px 20px',
                                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                {/* Navigation dots */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 20,
                                        right: 20,
                                        display: 'flex',
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.6)' }} />
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 1)' }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Instrument Serif", serif',
                            fontSize: { xs: '1.875rem', md: '2.25rem' },
                            fontWeight: 400,
                            color: '#111827',
                            mb: 3,
                        }}
                    >
                        Trusted by developers worldwide
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 6, md: 3 }} key={index}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontFamily: '"Instrument Serif", serif',
                                        fontWeight: 400,
                                        color: '#667eea',
                                        mb: 1,
                                        fontSize: { xs: '2rem', md: '2.5rem' },
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: '"Instrument Serif", serif',
                                        color: '#111827',
                                        fontWeight: 400,
                                        mb: 0.5
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        color: '#6b7280'
                                    }}
                                >
                                    {stat.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box sx={{ backgroundColor: '#111827', py: 12 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: '"Instrument Serif", serif',
                                fontWeight: 400,
                                color: '#ffffff',
                                mb: 3,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                            }}
                        >
                            Ready to optimize your AI costs?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#9ca3af',
                                mb: 6,
                                maxWidth: '600px',
                                mx: 'auto'
                            }}
                        >
                            Start saving up to 30% on your AI spending today. No credit card required.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/register"
                                sx={{
                                    py: 2,
                                    px: 6,
                                    backgroundColor: '#667eea',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#5b6fd8',
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                    }
                                }}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                component={Link}
                                to="/login"
                                sx={{
                                    py: 2,
                                    px: 6,
                                    borderColor: '#374151',
                                    color: '#ffffff',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    '&:hover': {
                                        borderColor: '#667eea',
                                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ backgroundColor: '#f9fafb', py: 8 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '8px',
                                    background: 'linear-gradient(35deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CpuChipIcon style={{ width: 16, height: 16, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Instrument Serif", serif',
                                    fontWeight: 400,
                                    color: '#111827',
                                }}
                            >
                                MovDev
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#6b7280',
                                mb: 2
                            }}
                        >
                            The vendor-neutral platform for AI cost optimization.
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#9ca3af'
                            }}
                        >
                            © 2024 MovDev. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage; 