"""create core tables

Revision ID: 35b9659436ae
Revises: 
Create Date: 2025-07-02 14:35:42.721238

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '35b9659436ae'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('model_pricing',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('provider', sa.String(length=50), nullable=False),
    sa.Column('model_name', sa.String(length=100), nullable=False),
    sa.Column('prompt_price_per_1k_tokens', sa.Float(), nullable=False),
    sa.Column('completion_price_per_1k_tokens', sa.Float(), nullable=False),
    sa.Column('price_per_request', sa.Float(), nullable=True),
    sa.Column('price_per_image', sa.Float(), nullable=True),
    sa.Column('price_per_minute', sa.Float(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('max_tokens', sa.Integer(), nullable=True),
    sa.Column('supports_streaming', sa.Boolean(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('effective_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deprecated_date', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_model_pricing_id'), 'model_pricing', ['id'], unique=False)
    op.create_index(op.f('ix_model_pricing_model_name'), 'model_pricing', ['model_name'], unique=False)
    op.create_index(op.f('ix_model_pricing_provider'), 'model_pricing', ['provider'], unique=False)
    op.create_table('teams',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_teams_id'), 'teams', ['id'], unique=False)
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('full_name', sa.String(length=255), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_verified', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('plan', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_table('api_keys',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('provider', sa.String(length=50), nullable=False),
    sa.Column('encrypted_key', sa.Text(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_api_keys_id'), 'api_keys', ['id'], unique=False)
    op.create_table('budget_settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('period_type', sa.String(length=20), nullable=False),
    sa.Column('limit_amount', sa.Float(), nullable=False),
    sa.Column('alert_threshold', sa.Float(), nullable=True),
    sa.Column('enable_alerts', sa.Boolean(), nullable=True),
    sa.Column('enable_auto_cutoff', sa.Boolean(), nullable=True),
    sa.Column('scope_type', sa.String(length=20), nullable=True),
    sa.Column('scope_id', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_budget_settings_id'), 'budget_settings', ['id'], unique=False)
    op.create_table('daily_usage_summaries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(timezone=True), nullable=False),
    sa.Column('total_requests', sa.Integer(), nullable=True),
    sa.Column('total_tokens', sa.Integer(), nullable=True),
    sa.Column('total_cost', sa.Float(), nullable=True),
    sa.Column('provider_breakdown', sa.JSON(), nullable=True),
    sa.Column('model_breakdown', sa.JSON(), nullable=True),
    sa.Column('avg_latency_ms', sa.Float(), nullable=True),
    sa.Column('error_count', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_daily_usage_summaries_date'), 'daily_usage_summaries', ['date'], unique=False)
    op.create_index(op.f('ix_daily_usage_summaries_id'), 'daily_usage_summaries', ['id'], unique=False)
    op.create_table('team_members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('team_id', sa.Integer(), nullable=False),
    sa.Column('role', sa.String(length=50), nullable=True),
    sa.Column('joined_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_team_members_id'), 'team_members', ['id'], unique=False)
    op.create_table('usage_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('api_key_id', sa.Integer(), nullable=False),
    sa.Column('provider', sa.String(length=50), nullable=False),
    sa.Column('model', sa.String(length=100), nullable=False),
    sa.Column('endpoint', sa.String(length=255), nullable=False),
    sa.Column('prompt_tokens', sa.Integer(), nullable=True),
    sa.Column('completion_tokens', sa.Integer(), nullable=True),
    sa.Column('total_tokens', sa.Integer(), nullable=True),
    sa.Column('cost', sa.Float(), nullable=True),
    sa.Column('latency_ms', sa.Integer(), nullable=True),
    sa.Column('status_code', sa.Integer(), nullable=False),
    sa.Column('request_size_bytes', sa.Integer(), nullable=True),
    sa.Column('response_size_bytes', sa.Integer(), nullable=True),
    sa.Column('extra_data', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.ForeignKeyConstraint(['api_key_id'], ['api_keys.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_usage_logs_created_at'), 'usage_logs', ['created_at'], unique=False)
    op.create_index(op.f('ix_usage_logs_id'), 'usage_logs', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_usage_logs_id'), table_name='usage_logs')
    op.drop_index(op.f('ix_usage_logs_created_at'), table_name='usage_logs')
    op.drop_table('usage_logs')
    op.drop_index(op.f('ix_team_members_id'), table_name='team_members')
    op.drop_table('team_members')
    op.drop_index(op.f('ix_daily_usage_summaries_id'), table_name='daily_usage_summaries')
    op.drop_index(op.f('ix_daily_usage_summaries_date'), table_name='daily_usage_summaries')
    op.drop_table('daily_usage_summaries')
    op.drop_index(op.f('ix_budget_settings_id'), table_name='budget_settings')
    op.drop_table('budget_settings')
    op.drop_index(op.f('ix_api_keys_id'), table_name='api_keys')
    op.drop_table('api_keys')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_teams_id'), table_name='teams')
    op.drop_table('teams')
    op.drop_index(op.f('ix_model_pricing_provider'), table_name='model_pricing')
    op.drop_index(op.f('ix_model_pricing_model_name'), table_name='model_pricing')
    op.drop_index(op.f('ix_model_pricing_id'), table_name='model_pricing')
    op.drop_table('model_pricing')
    # ### end Alembic commands ###
