-- Seed data for AI Cost Optimizer
-- This file contains initial data for the application

-- Insert default model pricing data
INSERT INTO model_pricing (provider, model_name, prompt_price_per_1k_tokens, completion_price_per_1k_tokens, description, max_tokens, supports_streaming, is_active) VALUES
('openai', 'gpt-4', 0.03, 0.06, 'GPT-4 model for complex reasoning tasks', 8192, true, true),
('openai', 'gpt-4-turbo', 0.01, 0.03, 'GPT-4 Turbo for faster, more efficient processing', 128000, true, true),
('openai', 'gpt-3.5-turbo', 0.0015, 0.002, 'GPT-3.5 Turbo for cost-effective tasks', 4096, true, true),
('anthropic', 'claude-3-opus', 0.015, 0.075, 'Claude 3 Opus for complex analysis', 200000, true, true),
('anthropic', 'claude-3-sonnet', 0.003, 0.015, 'Claude 3 Sonnet for balanced performance', 200000, true, true),
('anthropic', 'claude-3-haiku', 0.00025, 0.00125, 'Claude 3 Haiku for fast, simple tasks', 200000, true, true),
('azure', 'gpt-4', 0.03, 0.06, 'Azure OpenAI GPT-4', 8192, true, true),
('azure', 'gpt-35-turbo', 0.0015, 0.002, 'Azure OpenAI GPT-3.5 Turbo', 4096, true, true),
('google', 'gemini-pro', 0.0005, 0.0015, 'Google Gemini Pro', 32768, true, true),
('google', 'gemini-flash', 0.000075, 0.0003, 'Google Gemini Flash', 1048576, true, true)
ON CONFLICT (provider, model_name) DO NOTHING;

-- Insert default budget settings for new users
INSERT INTO budget_settings (user_id, period_type, limit_amount, alert_threshold, enable_alerts, enable_auto_cutoff, scope_type, is_active) VALUES
(1, 'monthly', 1000.00, 0.8, true, true, 'global', true)
ON CONFLICT (user_id, period_type, scope_type) DO NOTHING; 