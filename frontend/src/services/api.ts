import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    APIKey,
    APIKeyCreate,
    AnalyticsResponse,
    BudgetStatus,
    BudgetSetting,
    BudgetCreate,
    RecommendationsResponse,
    ModelPricing,
    AccountStats,
} from '../types';

class APIService {
    private api: AxiosInstance;
    private baseURL: string;

    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.clearAuth();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Authentication Methods
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
        if (response.data.access_token) {
            this.setAuth(response.data.access_token);
        }
        return response.data;
    }

    async register(data: RegisterRequest): Promise<User> {
        const response: AxiosResponse<User> = await this.api.post('/auth/register', data);
        return response.data;
    }

    async getCurrentUser(): Promise<User> {
        const response: AxiosResponse<User> = await this.api.get('/auth/me');
        return response.data;
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const response: AxiosResponse<User> = await this.api.put('/auth/me', data);
        return response.data;
    }

    async verifyToken(): Promise<User> {
        const response: AxiosResponse<User> = await this.api.post('/auth/verify-token');
        return response.data;
    }

    async updateUserPlan(planId: string): Promise<{ message: string; plan: string }> {
        const response = await this.api.post('/auth/select-plan', { plan: planId });
        return response.data;
    }

    async upgradePlan(targetPlan: string): Promise<{ message: string; new_plan: string }> {
        const response = await this.api.post('/admin/account/upgrade-plan', { target_plan: targetPlan });
        return response.data;
    }

    async exportAccountData(): Promise<any> {
        const response = await this.api.get('/admin/account/export-data');
        return response.data;
    }

    // API Key Methods
    async getAPIKeys(): Promise<APIKey[]> {
        const response: AxiosResponse<APIKey[]> = await this.api.get('/proxy/api-keys');
        return response.data;
    }

    async addAPIKey(data: APIKeyCreate): Promise<{ message: string }> {
        const response = await this.api.post('/proxy/api-keys', data);
        return response.data;
    }

    async deleteAPIKey(keyId: number): Promise<{ message: string }> {
        const response = await this.api.delete(`/proxy/api-keys/${keyId}`);
        return response.data;
    }

    // Analytics Methods
    async getUsageAnalytics(periodDays: number = 30): Promise<AnalyticsResponse> {
        const response: AxiosResponse<AnalyticsResponse> = await this.api.get(
            `/analytics/usage-summary?period_days=${periodDays}`
        );
        return response.data;
    }

    async getBudgetStatus(): Promise<BudgetStatus[]> {
        const response: AxiosResponse<BudgetStatus[]> = await this.api.get('/analytics/budget-status');
        return response.data;
    }

    async getRecommendations(): Promise<RecommendationsResponse> {
        const response: AxiosResponse<RecommendationsResponse> = await this.api.get('/analytics/recommendations');
        return response.data;
    }

    async getCostComparison(promptTokens: number, completionTokens: number, providers?: string): Promise<any> {
        const params = new URLSearchParams({
            prompt_tokens: promptTokens.toString(),
            completion_tokens: completionTokens.toString(),
        });

        if (providers) {
            params.append('providers', providers);
        }

        const response = await this.api.get(`/analytics/cost-comparison?${params}`);
        return response.data;
    }

    async getUsageTrends(days: number = 30): Promise<any> {
        const response = await this.api.get(`/analytics/usage-trends?days=${days}`);
        return response.data;
    }

    // Budget Methods
    async getBudgetSettings(): Promise<BudgetSetting[]> {
        const response: AxiosResponse<BudgetSetting[]> = await this.api.get('/admin/budget-settings');
        return response.data;
    }

    async createBudgetSetting(data: BudgetCreate): Promise<BudgetSetting> {
        const response: AxiosResponse<BudgetSetting> = await this.api.post('/admin/budget-settings', data);
        return response.data;
    }

    async updateBudgetSetting(id: number, data: Partial<BudgetCreate>): Promise<BudgetSetting> {
        const response: AxiosResponse<BudgetSetting> = await this.api.put(`/admin/budget-settings/${id}`, data);
        return response.data;
    }

    async deleteBudgetSetting(id: number): Promise<{ message: string }> {
        const response = await this.api.delete(`/admin/budget-settings/${id}`);
        return response.data;
    }

    // Model Pricing Methods
    async getModelPricing(provider?: string): Promise<ModelPricing[]> {
        const params = provider ? `?provider=${provider}` : '';
        const response: AxiosResponse<ModelPricing[]> = await this.api.get(`/admin/model-pricing${params}`);
        return response.data;
    }

    // Account Methods
    async getAccountStats(): Promise<AccountStats> {
        const response: AxiosResponse<AccountStats> = await this.api.get('/admin/account/usage-stats');
        return response.data;
    }

    // Health Check
    async healthCheck(): Promise<{ status: string; database: string; environment: string }> {
        const response = await this.api.get('/health');
        return response.data;
    }

    // Auth Helper Methods
    setAuth(token: string): void {
        localStorage.setItem('access_token', token);
    }

    clearAuth(): void {
        localStorage.removeItem('access_token');
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    }

    // Utility Methods
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        }).format(amount);
    }

    formatNumber(num: number): string {
        return new Intl.NumberFormat('en-US').format(num);
    }

    formatDate(date: string): string {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(date));
    }

    formatDateTime(date: string): string {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    }

    calculatePercentageChange(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }

    generateRandomId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Create singleton instance
const apiService = new APIService();

export default apiService; 