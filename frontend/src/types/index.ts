// User and Authentication Types
export interface User {
    id: number;
    email: string;
    full_name?: string;
    is_verified: boolean;
    plan: string;
    created_at: string;
    is_active: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

// API Key Types
export interface APIKey {
    id: number;
    name: string;
    provider: string;
    is_active: boolean;
    created_at: string;
    last_used_at?: string;
}

export interface APIKeyCreate {
    name: string;
    provider: string;
    api_key: string;
    team_id?: number;
}

// Usage and Analytics Types
export interface UsageLog {
    id: number;
    provider: string;
    model: string;
    endpoint: string;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost: number;
    latency_ms?: number;
    status_code: number;
    created_at: string;
}

export interface UsageSummary {
    total_requests: number;
    total_tokens: number;
    total_cost: number;
    period_start: string;
    period_end: string;
}

export interface DailyUsage {
    date: string;
    requests: number;
    tokens: number;
    cost: number;
}

export interface ModelBreakdown {
    model: string;
    provider: string;
    requests: number;
    tokens: number;
    cost: number;
    percentage: number;
}

export interface ProviderBreakdown {
    provider: string;
    requests: number;
    tokens: number;
    cost: number;
    percentage: number;
}

export interface AnalyticsResponse {
    summary: UsageSummary;
    daily_usage: DailyUsage[];
    model_breakdown: ModelBreakdown[];
    provider_breakdown: ProviderBreakdown[];
}

// Budget Types
export interface BudgetSetting {
    id: number;
    period_type: string;
    limit_amount: number;
    alert_threshold: number;
    enable_alerts: boolean;
    enable_auto_cutoff: boolean;
    scope_type: string;
    scope_id?: number;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface BudgetStatus {
    current_spend: number;
    budget_limit: number;
    percentage_used: number;
    period_type: string;
    period_start: string;
    period_end: string;
    is_over_budget: boolean;
    alerts_enabled: boolean;
}

export interface BudgetCreate {
    period_type: string;
    limit_amount: number;
    alert_threshold?: number;
    enable_alerts?: boolean;
    enable_auto_cutoff?: boolean;
}

// Recommendations Types
export interface Recommendation {
    type: string;
    title: string;
    description: string;
    potential_savings?: number;
    confidence: number;
    action_required: string;
    priority: string;
}

export interface RecommendationsResponse {
    recommendations: Recommendation[];
    total_potential_savings: number;
}

// Model Pricing Types
export interface ModelPricing {
    id: number;
    provider: string;
    model_name: string;
    prompt_price_per_1k_tokens: number;
    completion_price_per_1k_tokens: number;
    price_per_request?: number;
    price_per_image?: number;
    price_per_minute?: number;
    description?: string;
    max_tokens?: number;
    supports_streaming: boolean;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

// Account Stats Types
export interface AccountStats {
    current_month: {
        requests: number;
        tokens: number;
        cost: number;
    };
    all_time: {
        requests: number;
        tokens: number;
        cost: number;
    };
    active_api_keys: number;
    plan: string;
    member_since: string;
}

// UI State Types
export interface LoadingState {
    [key: string]: boolean;
}

export interface ErrorState {
    [key: string]: string | null;
}

// Chart Data Types
export interface ChartDataPoint {
    name: string;
    value: number;
    date?: string;
    cost?: number;
    requests?: number;
    tokens?: number;
}

// Navigation Types
export interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    current?: boolean;
}

// Table Types
export interface TableColumn<T> {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

// API Response Types
export interface APIResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

// Form Types
export interface FormErrors {
    [key: string]: string;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
} 