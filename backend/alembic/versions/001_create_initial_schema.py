"""create users, campaigns, and campaign_outputs tables

Revision ID: 001_create_initial_schema
Revises: 
Create Date: 2026-07-25 12:45:00.000000

"""
from alembic import op
import sqlalchemy as sqa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_create_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create users table
    op.create_table(
        'users',
        sqa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sqa.Column('supabase_uid', sqa.String(), nullable=False),
        sqa.Column('email', sqa.String(), nullable=False),
        sqa.Column('full_name', sqa.String(), nullable=True),
        sqa.Column('company_name', sqa.String(), nullable=True),
        sqa.Column('is_active', sqa.Boolean(), nullable=False, server_default=sqa.text('true')),
        sqa.Column('created_at', sqa.DateTime(), nullable=False, server_default=sqa.text('now()')),
        sqa.Column('updated_at', sqa.DateTime(), nullable=False, server_default=sqa.text('now()')),
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_supabase_uid'), 'users', ['supabase_uid'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Create campaigns table
    op.create_table(
        'campaigns',
        sqa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sqa.Column('user_id', postgresql.UUID(as_uuid=True), sqa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sqa.Column('title', sqa.String(), nullable=False),
        sqa.Column('description', sqa.Text(), nullable=True),
        sqa.Column('industry', sqa.String(), nullable=True),
        sqa.Column('target_audience', sqa.Text(), nullable=True),
        sqa.Column('budget', sqa.String(), nullable=True),
        sqa.Column('goal', sqa.String(), nullable=True),
        sqa.Column('tone', sqa.String(), nullable=True),
        sqa.Column('created_at', sqa.DateTime(), nullable=False, server_default=sqa.text('now()')),
        sqa.Column('updated_at', sqa.DateTime(), nullable=False, server_default=sqa.text('now()')),
    )
    op.create_index(op.f('ix_campaigns_id'), 'campaigns', ['id'], unique=False)
    op.create_index(op.f('ix_campaigns_user_id'), 'campaigns', ['user_id'], unique=False)

    # 3. Create campaign_outputs table
    op.create_table(
        'campaign_outputs',
        sqa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sqa.Column('campaign_id', postgresql.UUID(as_uuid=True), sqa.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=False, unique=True),
        sqa.Column('persona', sqa.JSON(), nullable=True),
        sqa.Column('marketing_strategy', sqa.JSON(), nullable=True),
        sqa.Column('google_ads', sqa.JSON(), nullable=True),
        sqa.Column('facebook_ads', sqa.JSON(), nullable=True),
        sqa.Column('instagram_ads', sqa.JSON(), nullable=True),
        sqa.Column('linkedin_ads', sqa.JSON(), nullable=True),
        sqa.Column('keywords', sqa.JSON(), nullable=True),
        sqa.Column('hashtags', sqa.JSON(), nullable=True),
        sqa.Column('budget_breakdown', sqa.JSON(), nullable=True),
        sqa.Column('status', sqa.String(), nullable=False, server_default='draft'),
        sqa.Column('created_at', sqa.DateTime(), nullable=False, server_default=sqa.text('now()')),
        sqa.Column('updated_at', sqa.DateTime(), nullable=False, server_default=sqa.text('now()')),
    )
    op.create_index(op.f('ix_campaign_outputs_id'), 'campaign_outputs', ['id'], unique=False)
    op.create_index(op.f('ix_campaign_outputs_campaign_id'), 'campaign_outputs', ['campaign_id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_campaign_outputs_campaign_id'), table_name='campaign_outputs')
    op.drop_index(op.f('ix_campaign_outputs_id'), table_name='campaign_outputs')
    op.drop_table('campaign_outputs')

    op.drop_index(op.f('ix_campaigns_user_id'), table_name='campaigns')
    op.drop_index(op.f('ix_campaigns_id'), table_name='campaigns')
    op.drop_table('campaigns')

    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_supabase_uid'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
