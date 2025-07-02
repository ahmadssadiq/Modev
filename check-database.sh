#!/bin/bash

# AI Cost Optimizer - Database Query Helper
# This script helps you inspect the database contents

echo "🗄️  AI Cost Optimizer - Database Contents"
echo "========================================"

# Check if database exists
if [ ! -f "backend/ai_cost_optimizer.db" ]; then
    echo "❌ Database not found at backend/ai_cost_optimizer.db"
    echo "Make sure you've run the backend and created users first."
    exit 1
fi

DB_PATH="backend/ai_cost_optimizer.db"

echo ""
echo "👥 REGISTERED USERS:"
echo "-------------------"
sqlite3 "$DB_PATH" -header -column "
SELECT 
    id,
    email,
    full_name,
    is_active as Active,
    plan as Plan,
    datetime(created_at) as 'Created At'
FROM users
ORDER BY created_at DESC;
"

echo ""
echo "🔑 API KEYS:"
echo "------------"
sqlite3 "$DB_PATH" -header -column "
SELECT 
    ak.id,
    ak.name as 'Key Name',
    ak.provider as Provider,
    u.email as 'User Email',
    ak.is_active as Active,
    datetime(ak.created_at) as 'Added On',
    CASE 
        WHEN ak.last_used_at IS NULL THEN 'Never Used'
        ELSE datetime(ak.last_used_at)
    END as 'Last Used'
FROM api_keys ak
JOIN users u ON ak.user_id = u.id
ORDER BY ak.created_at DESC;
"

echo ""
echo "📊 USAGE STATISTICS:"
echo "-------------------"

# Check if there are any usage logs
USAGE_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM usage_logs;")

if [ "$USAGE_COUNT" -eq 0 ]; then
    echo "No usage logs found yet."
    echo "📝 Usage will appear here after making API calls through the proxy."
else
    echo "Total API calls logged: $USAGE_COUNT"
    echo ""
    echo "Recent Usage (Last 10):"
    sqlite3 "$DB_PATH" -header -column "
    SELECT 
        ul.id,
        u.email as User,
        ul.provider as Provider,
        ul.model as Model,
        ul.total_tokens as Tokens,
        printf('$%.4f', ul.cost) as Cost,
        ul.status_code as Status,
        datetime(ul.created_at) as 'Request Time'
    FROM usage_logs ul
    JOIN users u ON ul.user_id = u.id
    ORDER BY ul.created_at DESC
    LIMIT 10;
    "
fi

echo ""
echo "💰 BUDGET SETTINGS:"
echo "------------------"
BUDGET_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM budget_settings;")

if [ "$BUDGET_COUNT" -eq 0 ]; then
    echo "No budget settings configured yet."
    echo "💡 Set up budgets in the dashboard to control spending."
else
    sqlite3 "$DB_PATH" -header -column "
    SELECT 
        bs.id,
        u.email as User,
        bs.period_type as Period,
        printf('$%.2f', bs.limit_amount) as 'Budget Limit',
        printf('%.0f%%', bs.alert_threshold * 100) as 'Alert At',
        bs.enable_alerts as Alerts,
        bs.enable_auto_cutoff as 'Auto Cutoff'
    FROM budget_settings bs
    JOIN users u ON bs.user_id = u.id
    ORDER BY bs.created_at DESC;
    "
fi

echo ""
echo "📈 QUICK STATS:"
echo "--------------"
echo "Users: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM users;")"
echo "API Keys: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM api_keys WHERE is_active = 1;")"
echo "Total Requests: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM usage_logs;")"

if [ "$USAGE_COUNT" -gt 0 ]; then
    TOTAL_COST=$(sqlite3 "$DB_PATH" "SELECT COALESCE(SUM(cost), 0) FROM usage_logs;")
    echo "Total Cost: \$$(printf "%.4f" "$TOTAL_COST")"
fi

echo ""
echo "🔍 Database Location: $DB_PATH"
echo "📊 Dashboard: http://localhost:5173/dashboard"
echo "🛠️  API Docs: http://localhost:8000/docs"
echo "" 