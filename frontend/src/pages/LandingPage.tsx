import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    // Card,
    // CardContent,
    Stack,
    Chip,
    Paper,
    Avatar,
} from '@mui/material';
import {
    CurrencyDollarIcon,
    // ChartBarIcon,
    ClockIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    // BoltIcon,
    EyeIcon,
    // CodeBracketIcon,
    ArrowRightIcon,
    // CheckIcon,
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');

    const integrations = [
        { name: 'OpenAI', logo: '🤖', color: '#10B981' },
        { name: 'Anthropic', logo: '🧠', color: '#8B5CF6' },
        { name: 'Azure OpenAI', logo: '☁️', color: '#3B82F6' },
        { name: 'Google AI', logo: '🌟', color: '#F59E0B' },
    ];

    const insights = [
        {
            icon: <EyeIcon className="h-8 w-8" />,
            title: 'Real-time Cost Visibility',
            description: 'See exactly where every dollar goes across all AI providers. No more surprise bills - track usage and costs in real-time.',
        },
        {
            icon: <ShieldCheckIcon className="h-8 w-8" />,
            title: 'Budget Protection & Alerts',
            description: 'Set spending limits and get instant alerts when approaching them. Auto-cutoff prevents runaway costs.',
        },
        {
            icon: <CpuChipIcon className="h-8 w-8" />,
            title: 'Multi-vendor Consolidation',
            description: 'One dashboard for all AI providers - OpenAI, Anthropic, Azure, and more. Compare costs and performance easily.',
        },
        {
            icon: <CurrencyDollarIcon className="h-8 w-8" />,
            title: '30% Automatic Savings',
            description: 'Our optimization engine identifies cheaper alternatives and suggests model switches that maintain quality.',
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

    // const stats = [
        { label: 'Average Cost Reduction', value: '30%', description: 'in first month' },
        { label: 'Setup Time', value: '<60s', description: 'drop-in integration' },
        { label: 'Supported Providers', value: '4+', description: 'and growing' },
        { label: 'Enterprise Ready', value: '99.9%', description: 'uptime SLA' },
    ];

    const codeExamples = {
        javascript: {
            code: [
                { type: 'import', content: 'import OpenAI from "openai";' },
                { type: 'empty', content: '' },
                { type: 'const', content: 'const openai = new OpenAI({' },
                { type: 'indent', content: 'apiKey: "YOUR_MODEV_API_KEY",' },
                { type: 'indent', content: 'baseURL: "https://api.modev.ai/v1/"' },
                { type: 'close', content: '});' },
                { type: 'empty', content: '' },
                { type: 'comment', content: '// That\'s it! All your OpenAI calls now go through MoDev' },
                { type: 'comment', content: '// Real-time cost tracking, budget alerts, and optimization tips' },
            ]
        },
        python: {
            code: [
                { type: 'import', content: 'from openai import OpenAI' },
                { type: 'empty', content: '' },
                { type: 'const', content: 'client = OpenAI(' },
                { type: 'indent', content: 'api_key="YOUR_MODEV_API_KEY",' },
                { type: 'indent', content: 'base_url="https://api.modev.ai/v1/"' },
                { type: 'close', content: ')' },
                { type: 'empty', content: '' },
                { type: 'comment', content: '# That\'s it! All your OpenAI calls now go through MoDev' },
                { type: 'comment', content: '# Real-time cost tracking, budget alerts, and optimization tips' },
            ]
        },
        curl: {
            code: [
                { type: 'comment', content: '# Set your MoDev API key' },
                { type: 'const', content: 'export MODEV_API_KEY="YOUR_MODEV_API_KEY"' },
                { type: 'empty', content: '' },
                { type: 'comment', content: '# Make API calls through MoDev proxy' },
                { type: 'curl', content: 'curl https://api.modev.ai/v1/chat/completions \\' },
                { type: 'indent', content: '  -H "Authorization: Bearer $MODEV_API_KEY" \\' },
                { type: 'indent', content: '  -H "Content-Type: application/json" \\' },
                { type: 'indent', content: '  -d \'{' },
                { type: 'indent', content: '    "model": "gpt-4",' },
                { type: 'indent', content: '    "messages": [{"role": "user", "content": "Hello!"}]' },
                { type: 'indent', content: '  }\'' },
                { type: 'empty', content: '' },
                { type: 'comment', content: '# Real-time cost tracking, budget alerts, and optimization tips' },
            ]
        }
    };

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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CpuChipIcon style={{ width: 14, height: 14, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Instrument Serif", serif',
                                    fontWeight: 1000,
                                    color: '#111827',
                                    fontSize: '2rem',
                                }}
                            >
                                MODEV
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
                                    background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(255, 97, 39, 0.3)',
                                        background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
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
                                        background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
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
                                Teams building fast, then boom - OpenAI bills spike without warning. Our transparent proxy gives you real-time cost visibility and budget protection with zero code changes needed.
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
                                        background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(255, 97, 39, 0.3)',
                                            background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                        }
                                    }}
                                >
                                    Start Free Trial
                                </Button>
                                {/* <Button
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
                                </Button> */}
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
                                    background: 'linear-gradient(135deg, #FFEDE7 0%, #764ba220 100%)',
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

                                    }}
                                >
                                    {/* Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, }}>
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
                                                            color: metric.positive ? '#22c55e' : '#B22222',
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
                                            background: 'linear-gradient(135deg, rgba(117, 234, 102, 0.1) 0%, rgba(163, 0, 0, 0.1) 100%)',
                                            borderRadius: '8px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <svg width="100%" height="100%" viewBox="0 0 300 80">
                                            <path
                                                d="M0,0 Q75,40 150,30 T300,40"
                                                stroke="#B22222"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                            <path
                                                d="M0,0 Q75,40 150,30 T300,40 L300,80 L0,80 Z"
                                                fill="rgba(234, 102, 102, 0.2)"
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

            {/* Drop-in Integration Section */}
            <Box sx={{ backgroundColor: '#ffffff', py: 16 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: '"Instrument Serif", serif',
                                fontSize: { xs: '2.5rem', md: '3rem' },
                                fontWeight: 400,
                                color: '#111827',
                                mb: 3,
                            }}
                        >
                            Get integrated in{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                seconds
                            </Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#6b7280',
                                fontWeight: 400,
                                maxWidth: '600px',
                                mx: 'auto',
                                fontSize: '1.125rem',
                                lineHeight: 1.6,
                            }}
                        >
                            The simplest integration that connects seamlessly to any LLM provider and framework.
                        </Typography>
                    </Box>

                    {/* Code Examples */}
                    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                        {/* Language Tabs */}
                        <Box sx={{ display: 'flex', mb: 3, borderBottom: '1px solid #e5e7eb' }}>
                            {['javascript', 'python', 'curl'].map((lang) => (
                                <Button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    sx={{
                                        py: 1.5,
                                        px: 3,
                                        borderRadius: 0,
                                        backgroundColor: selectedLanguage === lang ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                                        color: selectedLanguage === lang ? '#667eea' : '#6b7280',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 500,
                                        textTransform: 'lowercase',
                                        '&:hover': {
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                        }
                                    }}
                                >
                                    {lang}
                                </Button>
                            ))}
                        </Box>

                        {/* Code Block */}
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: '#FFEDE7',
                                borderRadius: '12px',
                                p: 4,
                                fontFamily: '"JetBrains Mono", "Consolas", monospace',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Code Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                </Box>
                                <Button
                                    size="small"
                                    sx={{
                                        color: '#666666',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontSize: '0.75rem',
                                        minWidth: 'auto',
                                        p: 1,
                                    }}
                                >
                                    Copy
                                </Button>
                            </Box>

                            {/* Code Content */}
                            <Box sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                                {codeExamples[selectedLanguage as keyof typeof codeExamples].code.map((line, index) => {
                                    if (line.type === 'empty') {
                                        return <Box key={index} sx={{ height: '1rem' }} />;
                                    }

                                    const getSyntaxHighlighting = (content: string, type: string) => {
                                        if (type === 'comment') {
                                            return <span style={{ color: '#666666', fontStyle: 'italic' }}>{content}</span>;
                                        }
                                        if (type === 'import') {
                                            const parts = content.split(' ');
                                            return (
                                                <>
                                                    <span style={{ color: '#d97706' }}>{parts[0]}</span>{' '}
                                                    <span style={{ color: '#0369a1' }}>{parts[1]}</span>{' '}
                                                    {parts[2] && <span style={{ color: '#d97706' }}>{parts[2]}</span>}{' '}
                                                    {parts[3] && <span style={{ color: '#059669' }}>"{parts[3].replace(/"/g, '')}"</span>}
                                                    {content.includes(';') && ';'}
                                                </>
                                            );
                                        }
                                        if (type === 'const') {
                                            if (content.includes('=')) {
                                                const [varPart, ...rest] = content.split('=');
                                                return (
                                                    <>
                                                        <span style={{ color: '#d97706' }}>const</span>{' '}
                                                        <span style={{ color: '#0369a1' }}>{varPart.trim()}</span>{' '}
                                                        <span style={{ color: '#d97706' }}>=</span>{' '}
                                                        {rest.join('=').includes('new') ? (
                                                            <>
                                                                <span style={{ color: '#d97706' }}>new</span>{' '}
                                                                <span style={{ color: '#0369a1' }}>{rest.join('=').replace('new ', '').replace('(', '')}</span>({'{'}
                                                            </>
                                                        ) : (
                                                            <span style={{ color: '#059669' }}>"{rest.join('=').trim().replace(/"/g, '')}"</span>
                                                        )}
                                                    </>
                                                );
                                            }
                                            return <span style={{ color: '#333333' }}>{content}</span>;
                                        }
                                        if (type === 'indent') {
                                            if (content.includes(':')) {
                                                const [key, ...valueParts] = content.split(':');
                                                return (
                                                    <Box sx={{ color: '#333333', ml: 2, mb: 1 }}>
                                                        <span style={{ color: '#0369a1' }}>{key.trim()}</span>:{' '}
                                                        {valueParts.join(':').includes('"') ? (
                                                            <span style={{ color: '#059669' }}>"{valueParts.join(':').trim().replace(/"/g, '')}"</span>
                                                        ) : (
                                                            <span style={{ color: '#0369a1' }}>{valueParts.join(':').trim()}</span>
                                                        )}
                                                        {content.includes(',') && ','}
                                                    </Box>
                                                );
                                            }
                                            return <Box sx={{ color: '#333333', ml: 2, mb: 1 }}>{content}</Box>;
                                        }
                                        if (type === 'close') {
                                            return <Box sx={{ color: '#333333', mb: 2 }}>{content}</Box>;
                                        }
                                        if (type === 'curl') {
                                            return <Box sx={{ color: '#333333', mb: 1 }}>{content}</Box>;
                                        }
                                        return <Box sx={{ color: '#333333', mb: 1 }}>{content}</Box>;
                                    };

                                    return (
                                        <Box key={index}>
                                            {getSyntaxHighlighting(line.content, line.type)}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>

                        {/* Integration Features */}
                        <Box sx={{ mt: 6 }}>
                            <Grid container spacing={4}>
                                {[
                                    { icon: <ClockIcon className="h-6 w-6" />, title: 'Zero Downtime', desc: 'Drop-in replacement with identical API' },
                                    { icon: <ShieldCheckIcon className="h-6 w-6" />, title: 'Secure by Default', desc: 'Encrypted API keys and secure proxy' },
                                    { icon: <EyeIcon className="h-6 w-6" />, title: 'Real-time Monitoring', desc: 'Instant cost visibility and alerts' },
                                    { icon: <CurrencyDollarIcon className="h-6 w-6" />, title: 'Automatic Savings', desc: 'Up to 30% cost reduction immediately' },
                                ].map((feature, index) => (
                                    <Grid size={{ xs: 6, md: 3 }} key={index}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '12px',
                                                    backgroundColor: '#f0f9ff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 2,
                                                    color: '#0369a1',
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontFamily: '"Instrument Serif", serif',
                                                    fontWeight: 400,
                                                    color: '#111827',
                                                    mb: 1,
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#6b7280',
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                {feature.desc}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </Box>

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
                            Stop AI bills from{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                spiraling out of control
                            </Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#6b7280',
                                fontWeight: 400,
                                maxWidth: '600px',
                                fontSize: '1rem',
                                lineHeight: 1.6,
                            }}
                        >
                            Teams ship fast, then get hit with massive AI bills. We give you the transparency and control you need to avoid surprises.
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
                                            color: '#FF6127',
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
                    <Box sx={{ mt: 12, pt: 1 }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: { xs: 300, md: 400 },
                                borderRadius: '20px',
                                backgroundImage: 'url(https://images.unsplash.com/photo-1739978080544-7d8ad1670f98?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            {/* "See the Big Picture" Section */}
            <Box sx={{ backgroundColor: '#fafbfc', py: 12 }}>
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
            {/* <Container maxWidth="lg" sx={{ py: 12 }}>
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
                                        color: '#FF6127',
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
            </Container> */}

            {/* Pricing Section */}
            {/* <Box sx={{ backgroundColor: '#f9fafb', py: 16 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 12 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: '"Instrument Serif", serif',
                                fontSize: { xs: '2.5rem', md: '3rem' },
                                fontWeight: 400,
                                color: '#111827',
                                mb: 3,
                            }}
                        >
                            Simple, transparent pricing
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Nunito Sans", sans-serif',
                                color: '#6b7280',
                                fontWeight: 400,
                                maxWidth: '600px',
                                mx: 'auto',
                                fontSize: '1.125rem',
                            }}
                        >
                            Start free, scale as you grow. No hidden fees, no surprise charges.
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center"> */}
            {/* Free Tier */}
            {/* <Grid size={{ xs: 12, md: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '16px',
                                    border: '2px solid #e5e7eb',
                                    p: 4,
                                    backgroundColor: '#ffffff',
                                    height: '100%',
                                    position: 'relative',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: '"Instrument Serif", serif',
                                        fontWeight: 400,
                                        color: '#111827',
                                        mb: 2,
                                    }}
                                >
                                    Starter
                                </Typography>
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontFamily: '"Instrument Serif", serif',
                                            fontWeight: 400,
                                            color: '#111827',
                                            display: 'inline',
                                        }}
                                    >
                                        $0
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#6b7280',
                                            display: 'inline',
                                            ml: 1,
                                        }}
                                    >
                                        /month
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        color: '#6b7280',
                                        mb: 4,
                                    }}
                                >
                                    Perfect for getting started and tracking up to $1,000 monthly spend
                                </Typography>
                                <Stack spacing={2} sx={{ mb: 6 }}>
                                    {[
                                        'Track up to $1,000/month spend',
                                        'Real-time cost monitoring',
                                        'Basic budget alerts',
                                        'Multi-provider support',
                                        'Community support',
                                    ].map((feature, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CheckIcon style={{ width: 16, height: 16, color: '#22c55e' }} />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#374151',
                                                }}
                                            >
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        py: 1.5,
                                        borderColor: '#e5e7eb',
                                        color: '#374151',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 500,
                                        '&:hover': {
                                            borderColor: '#667eea',
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                        }
                                    }}
                                >
                                    Get Started Free
                                </Button>
                            </Paper>
                        </Grid> */}

            {/* Pro Tier */}
            {/* <Grid size={{ xs: 12, md: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '16px',
                                    border: '2px solid #FF6127',
                                    p: 4,
                                    backgroundColor: '#ffffff',
                                    height: '100%',
                                    position: 'relative',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -1,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: '#FF6127',
                                        color: 'white',
                                        px: 3,
                                        py: 0.5,
                                        borderRadius: '0 0 8px 8px',
                                        fontSize: '0.75rem',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 600,
                                    }}
                                >
                                    MOST POPULAR
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: '"Instrument Serif", serif',
                                        fontWeight: 400,
                                        color: '#111827',
                                        mb: 2,
                                        mt: 2,
                                    }}
                                >
                                    Professional
                                </Typography>
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontFamily: '"Instrument Serif", serif',
                                            fontWeight: 400,
                                            color: '#111827',
                                            display: 'inline',
                                        }}
                                    >
                                        $99
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#6b7280',
                                            display: 'inline',
                                            ml: 1,
                                        }}
                                    >
                                        /month
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        color: '#6b7280',
                                        mb: 4,
                                    }}
                                >
                                    Advanced optimization features and unlimited tracking for growing teams
                                </Typography>
                                <Stack spacing={2} sx={{ mb: 6 }}>
                                    {[
                                        'Unlimited spend tracking',
                                        'Advanced cost optimization',
                                        'Custom budget controls',
                                        'Team collaboration',
                                        'API access',
                                        'Priority support',
                                        'Cost forecasting',
                                    ].map((feature, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CheckIcon style={{ width: 16, height: 16, color: '#22c55e' }} />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#374151',
                                                }}
                                            >
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(255, 97, 39, 0.3)',
                                        }
                                    }}
                                >
                                    Start Free Trial
                                </Button>
                            </Paper>
                        </Grid> */}

            {/* Enterprise Tier */}
            {/* <Grid size={{ xs: 12, md: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '16px',
                                    border: '2px solid #e5e7eb',
                                    p: 4,
                                    backgroundColor: '#ffffff',
                                    height: '100%',
                                    position: 'relative',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: '"Instrument Serif", serif',
                                        fontWeight: 400,
                                        color: '#111827',
                                        mb: 2,
                                    }}
                                >
                                    Enterprise
                                </Typography>
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontFamily: '"Instrument Serif", serif',
                                            fontWeight: 400,
                                            color: '#111827',
                                            display: 'inline',
                                        }}
                                    >
                                        $499
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: '"Nunito Sans", sans-serif',
                                            color: '#6b7280',
                                            display: 'inline',
                                            ml: 1,
                                        }}
                                    >
                                        /month
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        color: '#6b7280',
                                        mb: 4,
                                    }}
                                >
                                    For teams spending $10K+ monthly with custom integrations
                                </Typography>
                                <Stack spacing={2} sx={{ mb: 6 }}>
                                    {[
                                        'Everything in Professional',
                                        'Custom integrations',
                                        'Dedicated support manager',
                                        'SLA guarantees',
                                        'Advanced security features',
                                        'Custom reporting',
                                        'On-premise deployment',
                                    ].map((feature, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CheckIcon style={{ width: 16, height: 16, color: '#22c55e' }} />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: '"Nunito Sans", sans-serif',
                                                    color: '#374151',
                                                }}
                                            >
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        borderColor: '#e5e7eb',
                                        color: '#374151',
                                        fontFamily: '"Nunito Sans", sans-serif',
                                        fontWeight: 500,
                                        '&:hover': {
                                            borderColor: '#667eea',
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                        }
                                    }}
                                >
                                    Contact Sales
                                </Button>
                            </Paper>
                        </Grid> */}
            {/* </Grid>
                </Container>
            </Box> */}

            {/* CTA Section */}
            {/* <Box sx={{ backgroundColor: '#111827', py: 12 }}>
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
                                    backgroundColor: '#FF6127',
                                    fontFamily: '"Nunito Sans", sans-serif',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#e55b30',
                                        boxShadow: '0 4px 12px rgba(255, 97, 39, 0.3)',
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
            </Box> */}

            {/* Footer */}
            <Box sx={{ backgroundColor: '#f9fafb', py: 8 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
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
                                    fontWeight: 800,
                                    color: '#111827',
                                }}
                            >
                                MoDev
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
                            © 2024 MoDev. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage; 