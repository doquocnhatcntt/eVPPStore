from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "products",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("sku", sa.String(length=64), nullable=False, unique=True),
        sa.Column("barcode", sa.String(length=64), nullable=True, unique=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("stock_qty", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index("idx_products_barcode", "products", ["barcode"])
    op.create_index("idx_products_name", "products", ["name"])

def downgrade():
    op.drop_index("idx_products_name", table_name="products")
    op.drop_index("idx_products_barcode", table_name="products")
    op.drop_table("products")
