-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, team_id)
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    encrypted_key TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create model_pricing table
CREATE TABLE IF NOT EXISTS public.model_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prompt_price_per_1k_tokens DECIMAL(10, 6) NOT NULL,
    completion_price_per_1k_tokens DECIMAL(10, 6) NOT NULL,
    price_per_request DECIMAL(10, 6),
    price_per_image DECIMAL(10, 6),
    price_per_minute DECIMAL(10, 6),
    description TEXT,
    max_tokens INTEGER,
    supports_streaming BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_date TIMESTAMP WITH TIME ZONE,
    deprecated_date TIMESTAMP WITH TIME ZONE,
    UNIQUE(provider, model_name)
);

-- Create usage_logs table
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10, 4) DEFAULT 0.0,
    latency_ms INTEGER,
    status_code INTEGER NOT NULL,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    extra_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_settings table
CREATE TABLE IF NOT EXISTS public.budget_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL,
    limit_amount DECIMAL(10, 2) NOT NULL,
    alert_threshold DECIMAL(3, 2) DEFAULT 0.8,
    enable_alerts BOOLEAN DEFAULT TRUE,
    enable_auto_cutoff BOOLEAN DEFAULT FALSE,
    scope_type VARCHAR(20) DEFAULT 'user',
    scope_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_usage_summaries table
CREATE TABLE IF NOT EXISTS public.daily_usage_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_requests INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost DECIMAL(10, 4) DEFAULT 0.0,
    provider_breakdown JSONB,
    model_breakdown JSONB,
    avg_latency_ms DECIMAL(10, 2),
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_provider ON public.api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_provider ON public.usage_logs(provider);
CREATE INDEX IF NOT EXISTS idx_usage_logs_model ON public.usage_logs(model);
CREATE INDEX IF NOT EXISTS idx_budget_settings_user_id ON public.budget_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_summaries_user_id ON public.daily_usage_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_summaries_date ON public.daily_usage_summaries(date);
CREATE INDEX IF NOT EXISTS idx_model_pricing_provider ON public.model_pricing(provider);
CREATE INDEX IF NOT EXISTS idx_model_pricing_model_name ON public.model_pricing(model_name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_model_pricing_updated_at BEFORE UPDATE ON public.model_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_settings_updated_at BEFORE UPDATE ON public.budget_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_usage_summaries_updated_at BEFORE UPDATE ON public.daily_usage_summaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default model pricing data
INSERT INTO public.model_pricing (provider, model_name, prompt_price_per_1k_tokens, completion_price_per_1k_tokens, description, max_tokens, supports_streaming) VALUES
-- OpenAI Models
('openai', 'gpt-4', 0.03, 0.06, 'GPT-4 model for complex reasoning tasks', 8192, true),
('openai', 'gpt-4-turbo', 0.01, 0.03, 'GPT-4 Turbo for faster, more efficient processing', 128000, true),
('openai', 'gpt-3.5-turbo', 0.0015, 0.002, 'GPT-3.5 Turbo for cost-effective general tasks', 4096, true),
('openai', 'gpt-4o', 0.005, 0.015, 'GPT-4o for multimodal capabilities', 128000, true),
('openai', 'gpt-4o-mini', 0.00015, 0.0006, 'GPT-4o Mini for lightweight tasks', 128000, true),

-- Anthropic Models
('anthropic', 'claude-3-opus-20240229', 0.015, 0.075, 'Claude 3 Opus for complex reasoning', 200000, true),
('anthropic', 'claude-3-sonnet-20240229', 0.003, 0.015, 'Claude 3 Sonnet for balanced performance', 200000, true),
('anthropic', 'claude-3-haiku-20240307', 0.00025, 0.00125, 'Claude 3 Haiku for fast, cost-effective tasks', 200000, true),

-- Azure OpenAI Models (same pricing as OpenAI)
('azure', 'gpt-4', 0.03, 0.06, 'Azure GPT-4 model', 8192, true),
('azure', 'gpt-4-turbo', 0.01, 0.03, 'Azure GPT-4 Turbo model', 128000, true),
('azure', 'gpt-3.5-turbo', 0.0015, 0.002, 'Azure GPT-3.5 Turbo model', 4096, true)

ON CONFLICT (provider, model_name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - can be enhanced later)
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "API keys belong to user" ON public.api_keys FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Usage logs belong to user" ON public.usage_logs FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Budget settings belong to user" ON public.budget_settings FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Daily summaries belong to user" ON public.daily_usage_summaries FOR ALL USING (auth.uid()::text = user_id::text);
