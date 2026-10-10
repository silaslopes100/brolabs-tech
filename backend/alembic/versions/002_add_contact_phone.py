"""Add phone to contact messages

Revision ID: 002_add_contact_phone
Revises: 001_initial_schema
Create Date: 2026-10-10

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002_add_contact_phone"
down_revision: Union[str, None] = "001_initial_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("contact_messages", sa.Column("phone", sa.String(length=40), nullable=True))


def downgrade() -> None:
    op.drop_column("contact_messages", "phone")
