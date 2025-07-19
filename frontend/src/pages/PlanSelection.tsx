import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    // Paper,
    // alpha,
    // useTheme,
    // Divider,
    // Badge,
} from '@mui/material';
import {
    CheckIcon,
    ChartBarIcon,
    // ShieldCheckIcon,
    // CogIcon,
    BuildingOfficeIcon,
    // SparklesIcon,
    CpuChipIcon,
    RocketLaunchIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotifications';
import apiService from '../services/api';

interface PlanFeature {
    text: string;
    included: boolean;
}

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: PlanFeature[];
    icon: React.ReactNode;
    gradient: string;
    badge?: string;
    savings?: string;
    disabled?: boolean;
}

const PlanSelection: React.FC = () => {
    // const theme = useTheme();
    const [selectedPlan, setSelectedPlan] = useState<string>('free');
    const { user } = useAuth();
    const navigate = useNavigate();
    const notify = useNotify();

    const plans: Plan[] = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for exploring AI cost optimization',
            gradient: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
            icon: <ChartBarIcon className="w-8 h-8" />,
            features: [
                { text: 'Track up to $1,000/month AI spend', included: true },
                { text: 'Basic cost analytics dashboard', included: true },
                { text: 'Email alerts for budget limits', included: true },
                { text: '3 AI provider integrations', included: true },
                { text: 'Community support', included: true },
                { text: 'Advanced analytics', included: false },
                { text: 'Custom alerts & automations', included: false },
                { text: 'Team collaboration', included: false },
                { text: 'Priority support', included: false },
            ],
        },
        {
            id: 'professional',
            name: 'Professional',
            price: '$49',
            period: 'per month',
            description: 'Coming soon - Advanced AI cost optimization',
            gradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
            icon: <RocketLaunchIcon className="w-8 h-8" />,
            badge: 'Coming Soon',
            savings: 'Demo Mode - Not Available Yet',
            disabled: true,
            features: [
                { text: 'Unlimited AI spend tracking', included: true },
                { text: 'Advanced analytics & insights', included: true },
                { text: 'Intelligent cost optimization', included: true },
                { text: 'Unlimited provider integrations', included: true },
                { text: 'Custom alerts & automations', included: true },
                { text: 'Team collaboration (up to 10 members)', included: true },
                { text: 'API access', included: true },
                { text: 'Priority email support', included: true },
                { text: 'Dedicated account manager', included: false },
            ],
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 'Custom',
            period: 'pricing',
            description: 'Coming soon - For large organizations',
            gradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
            icon: <BuildingOfficeIcon className="w-8 h-8" />,
            badge: 'Coming Soon',
            savings: 'Demo Mode - Not Available Yet',
            disabled: true,
            features: [
                { text: 'Everything in Professional', included: true },
                { text: 'Unlimited team members', included: true },
                { text: 'Advanced security controls', included: true },
                { text: 'Custom integrations', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: 'SLA guarantees', included: true },
                { text: 'On-premise deployment', included: true },
                { text: '24/7 phone & chat support', included: true },
                { text: 'Custom onboarding', included: true },
            ],
        },
    ];

    const handleSelectPlan = async (planId: string) => {
        // Only allow free plan selection in demo mode
        if (planId !== 'free') {
            notify.info('Demo Mode', 'Only the Free plan is available during demo. Paid plans coming soon!');
            return;
        }

        setSelectedPlan(planId);

        try {
            // Update user's plan in backend
            await apiService.updateUserPlan(planId);

            notify.success('Welcome!', 'You\'re all set with the Free plan. Start optimizing your AI costs!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to update plan:', error);
            // Continue to dashboard even if API call fails for demo
            notify.success('Welcome!', 'You\'re all set with the Free plan. Start optimizing your AI costs!');
            navigate('/dashboard');
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(255, 97, 39, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 185, 159, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none',
            },
        }}>
            {/* Header */}
            <Box sx={{
                p: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                zIndex: 1,
                flexShrink: 0,
            }}>
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}
                            >
                                <CpuChipIcon style={{ width: 20, height: 20, color: 'white' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                                MODEV
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                fontSize: '0.8rem',
                                py: 0.5,
                                px: 2,
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            Skip for now
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 1.5, position: 'relative', zIndex: 1, overflow: 'auto' }}>
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 2.5, flexShrink: 0 }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            color: 'white',
                            mb: 0.5,
                            fontSize: { xs: '1.5rem', md: '2rem' },
                        }}
                    >
                        Choose your{' '}
                        <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}>
                            optimization plan
                        </Box>
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.8)',
                            mb: 1,
                            maxWidth: '450px',
                            mx: 'auto',
                            lineHeight: 1.3,
                            fontSize: '0.85rem',
                        }}
                    >
                        Welcome aboard, {user?.full_name?.split(' ')[0] || 'there'}! Let's get you set up with the perfect plan.
                    </Typography>
                    <Chip
                        label="🚀 Demo Mode - Free Plan Available"
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 97, 39, 0.2) 0%, rgba(255, 185, 159, 0.2) 100%)',
                            color: '#FF6127',
                            border: '1px solid rgba(255, 97, 39, 0.3)',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: '24px',
                            marginTop: '10px',
                            marginBottom: '50px',
                        }}
                    />
                </Box>

                {/* Plans Grid */}
                <Grid container spacing={1.5} justifyContent="center" sx={{ mb: 1.5, flex: 1 }}>
                    {plans.map((plan) => (
                        <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                            <Card
                                sx={{
                                    height: 350,
                                    borderRadius: '12px',
                                    background: plan.disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: selectedPlan === plan.id && !plan.disabled
                                        ? '2px solid #FF6127'
                                        : plan.disabled
                                            ? '1px solid rgba(255,255,255,0.05)'
                                            : '1px solid rgba(255,255,255,0.1)',
                                    position: 'relative',
                                    overflow: 'visible',
                                    transition: 'all 0.3s ease',
                                    cursor: plan.disabled ? 'not-allowed' : 'pointer',
                                    opacity: plan.disabled ? 0.6 : 1,
                                    '&:hover': plan.disabled ? {} : {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255, 97, 39, 0.5)',
                                    },
                                }}
                                onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
                            >
                                {plan.badge && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -6,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: plan.disabled ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)' : plan.gradient,
                                            color: plan.id === 'free' ? 'white' : 'black',
                                            px: 1.5,
                                            py: 0.25,
                                            borderRadius: '8px',
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            zIndex: 1,
                                        }}
                                    >
                                        {plan.badge}
                                    </Box>
                                )}

                                <CardContent sx={{ p: 2, color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Plan Header */}
                                    <Box sx={{ textAlign: 'center', mb: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: '12px',
                                                background: plan.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 1,
                                                color: plan.id === 'free' ? 'white' : plan.disabled ? 'rgba(255,255,255,0.7)' : 'black',
                                            }}
                                        >
                                            {plan.icon}
                                        </Box>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, mb: 0.5, fontSize: '1.1rem' }}>
                                            {plan.name}
                                        </Typography>
                                        <Box sx={{ mb: 0.5 }}>
                                            <Typography variant="h5" component="span" sx={{ fontWeight: 800, fontSize: '1.5rem' }}>
                                                {plan.price}
                                            </Typography>
                                            <Typography variant="caption" component="span" sx={{ color: 'rgba(255,255,255,0.7)', ml: 0.5, fontSize: '0.7rem' }}>
                                                /{plan.period}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.7rem', display: 'block' }}>
                                            {plan.description}
                                        </Typography>
                                        {plan.savings && (
                                            <Chip
                                                label={plan.savings}
                                                size="small"
                                                sx={{
                                                    background: plan.disabled ? 'rgba(156, 163, 175, 0.2)' : 'rgba(255, 97, 39, 0.2)',
                                                    color: plan.disabled ? '#9CA3AF' : '#FF6127',
                                                    border: plan.disabled ? '1px solid rgba(156, 163, 175, 0.3)' : '1px solid rgba(255, 97, 39, 0.3)',
                                                    fontWeight: 600,
                                                    fontSize: '0.6rem',
                                                    height: '20px',
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* Features List */}
                                    <List sx={{ mb: 1.5, flex: 1, py: 0 }}>
                                        {plan.features.slice(0, 5).map((feature, index) => (
                                            <ListItem key={index} sx={{ px: 0, py: 0.1 }}>
                                                <ListItemIcon sx={{ minWidth: 20 }}>
                                                    {feature.included ? (
                                                        <CheckIcon style={{ width: 14, height: 14, color: plan.disabled ? '#9CA3AF' : '#22c55e' }} />
                                                    ) : (
                                                        <XMarkIcon style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={feature.text}
                                                    sx={{
                                                        '& .MuiListItemText-primary': {
                                                            color: feature.included ? (plan.disabled ? 'rgba(255,255,255,0.6)' : 'white') : 'rgba(255,255,255,0.5)',
                                                            fontSize: '0.7rem',
                                                            textDecoration: feature.included ? 'none' : 'line-through',
                                                        },
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>

                                    {/* CTA Button */}
                                    <Button
                                        fullWidth
                                        variant={selectedPlan === plan.id && !plan.disabled ? "contained" : "outlined"}
                                        size="small"
                                        disabled={plan.disabled}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectPlan(plan.id);
                                        }}
                                        sx={{
                                            py: 0.75,
                                            borderRadius: '6px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            ...(selectedPlan === plan.id && !plan.disabled ? {
                                                background: plan.gradient,
                                                color: plan.id === 'free' ? 'white' : 'black',
                                                '&:hover': {
                                                    background: plan.gradient,
                                                    transform: 'translateY(-1px)',
                                                },
                                            } : {
                                                borderColor: plan.disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
                                                color: plan.disabled ? 'rgba(255,255,255,0.4)' : 'white',
                                                '&:hover': plan.disabled ? {} : {
                                                    borderColor: '#FF6127',
                                                    backgroundColor: 'rgba(255, 97, 39, 0.1)',
                                                },
                                            }),
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {plan.id === 'free' ? 'Start Free' :
                                            plan.disabled ? 'Coming Soon' :
                                                plan.id === 'enterprise' ? 'Contact Sales' :
                                                    'Start 14-Day Trial'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PlanSelection; 