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
    Paper,
    alpha,
    useTheme,
    Divider,
    Badge,
} from '@mui/material';
import {
    CheckIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    CogIcon,
    BuildingOfficeIcon,
    SparklesIcon,
    CpuChipIcon,
    RocketLaunchIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotifications';

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
    popular?: boolean;
    gradient: string;
    badge?: string;
    savings?: string;
}

const PlanSelection: React.FC = () => {
    const theme = useTheme();
    const [selectedPlan, setSelectedPlan] = useState<string>('professional');
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
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: <ChartBarIcon className="w-8 h-8" />,
            features: [
                { text: 'Track up to $100/month AI spend', included: true },
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
            description: 'For teams serious about AI cost optimization',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            icon: <RocketLaunchIcon className="w-8 h-8" />,
            popular: true,
            badge: 'Most Popular',
            savings: 'Save $2,000/month on average',
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
            description: 'For large organizations with complex needs',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: <BuildingOfficeIcon className="w-8 h-8" />,
            badge: 'Best Value',
            savings: 'Save $10,000+/month',
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
        setSelectedPlan(planId);

        try {
            if (planId === 'free') {
                notify.success('Welcome!', 'You\'re all set with the Free plan. Start optimizing your AI costs!');
                navigate('/dashboard');
            } else if (planId === 'professional') {
                notify.success('Great choice!', 'Redirecting to checkout for the Professional plan...');
                // Here you would integrate with Stripe or other payment processor
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                notify.success('Enterprise interest!', 'Our team will contact you within 24 hours to discuss your needs.');
                navigate('/dashboard');
            }
        } catch (error) {
            notify.error('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none',
            },
        }}>
            {/* Header */}
            <Box sx={{
                p: 4,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                zIndex: 1,
            }}>
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}
                            >
                                <CpuChipIcon style={{ width: 24, height: 24, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                                CostOptim.ai
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
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

            <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            color: 'white',
                            mb: 2,
                        }}
                    >
                        Choose your{' '}
                        <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}>
                            optimization plan
                        </Box>
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'rgba(255,255,255,0.8)',
                            mb: 2,
                            maxWidth: '600px',
                            mx: 'auto',
                            lineHeight: 1.6,
                        }}
                    >
                        Welcome aboard, {user?.full_name?.split(' ')[0] || 'there'}!
                        Let's get you set up with the perfect plan to start saving on AI costs.
                    </Typography>
                    <Chip
                        label="🎉 14-day free trial on all paid plans"
                        sx={{
                            background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%)',
                            color: '#43e97b',
                            border: '1px solid rgba(67, 233, 123, 0.3)',
                            fontWeight: 600,
                        }}
                    />
                </Box>

                {/* Plans Grid */}
                <Grid container spacing={4} justifyContent="center">
                    {plans.map((plan) => (
                        <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: '24px',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: selectedPlan === plan.id
                                        ? '2px solid #43e97b'
                                        : '1px solid rgba(255,255,255,0.1)',
                                    position: 'relative',
                                    overflow: 'visible',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(67, 233, 123, 0.5)',
                                    },
                                }}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {plan.popular && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: plan.gradient,
                                            color: 'black',
                                            px: 3,
                                            py: 1,
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            zIndex: 1,
                                        }}
                                    >
                                        {plan.badge}
                                    </Box>
                                )}

                                <CardContent sx={{ p: 4, color: 'white' }}>
                                    {/* Plan Header */}
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '20px',
                                                background: plan.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2,
                                                color: plan.id === 'free' ? 'white' : 'black',
                                            }}
                                        >
                                            {plan.icon}
                                        </Box>
                                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
                                            {plan.name}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="h2" component="span" sx={{ fontWeight: 800 }}>
                                                {plan.price}
                                            </Typography>
                                            <Typography variant="h6" component="span" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                                                /{plan.period}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                                            {plan.description}
                                        </Typography>
                                        {plan.savings && (
                                            <Chip
                                                label={plan.savings}
                                                size="small"
                                                sx={{
                                                    background: 'rgba(67, 233, 123, 0.2)',
                                                    color: '#43e97b',
                                                    border: '1px solid rgba(67, 233, 123, 0.3)',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* Features List */}
                                    <List sx={{ mb: 4 }}>
                                        {plan.features.map((feature, index) => (
                                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    {feature.included ? (
                                                        <CheckIcon style={{ width: 20, height: 20, color: '#43e97b' }} />
                                                    ) : (
                                                        <XMarkIcon style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.3)' }} />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={feature.text}
                                                    sx={{
                                                        '& .MuiListItemText-primary': {
                                                            color: feature.included ? 'white' : 'rgba(255,255,255,0.5)',
                                                            fontSize: '0.9rem',
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
                                        variant={selectedPlan === plan.id ? "contained" : "outlined"}
                                        size="large"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectPlan(plan.id);
                                        }}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            ...(selectedPlan === plan.id ? {
                                                background: plan.gradient,
                                                color: plan.id === 'free' ? 'white' : 'black',
                                                '&:hover': {
                                                    background: plan.gradient,
                                                    transform: 'translateY(-1px)',
                                                },
                                            } : {
                                                borderColor: 'rgba(255,255,255,0.3)',
                                                color: 'white',
                                                '&:hover': {
                                                    borderColor: '#43e97b',
                                                    backgroundColor: 'rgba(67, 233, 123, 0.1)',
                                                },
                                            }),
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {plan.id === 'free' ? 'Start Free' :
                                            plan.id === 'enterprise' ? 'Contact Sales' :
                                                'Start 14-Day Trial'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Trust Indicators */}
                <Box sx={{ mt: 12, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 700, mb: 4 }}>
                        Trusted by 500+ AI companies
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid size={{ xs: 6, md: 3 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 800 }}>
                                    67%
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Average cost reduction
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 800 }}>
                                    {'< 60s'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Setup time
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 800 }}>
                                    $2.4M
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Total savings delivered
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 800 }}>
                                    99.99%
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Uptime SLA
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* FAQ */}
                <Box sx={{ mt: 12, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 700, mb: 4 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    textAlign: 'left',
                                }}
                            >
                                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                                    Can I change plans later?
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    textAlign: 'left',
                                }}
                            >
                                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                                    How does the free trial work?
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Get full access to all features for 14 days. No credit card required. Cancel anytime.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default PlanSelection; 