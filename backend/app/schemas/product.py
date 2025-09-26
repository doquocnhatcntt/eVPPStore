from pydantic import BaseModel, Field, field_serializer
from typing import Optional
from uuid import UUID
from decimal import Decimal

class ProductCreate(BaseModel):
    sku: str
    barcode: Optional[str] = None
    name: str
    price: float = Field(ge=0)
    stock_qty: int = 0

class ProductOut(BaseModel):
    id: UUID
    sku: str
    barcode: Optional[str]
    name: str
    price: Decimal
    stock_qty: int

    # Trả về float để JSON hoá chắc chắn, tránh Decimal gây lỗi 500
    @field_serializer('price')
    def serialize_price(self, v: Decimal):
        return float(v)

    class Config:
        from_attributes = True