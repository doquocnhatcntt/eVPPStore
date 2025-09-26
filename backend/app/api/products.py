from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductOut

router = APIRouter(prefix="/products", tags=["products"])

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[ProductOut])
def list_products(q: str = "", barcode: str | None = None, page: int = 0, session: Session = Depends(get_session)):
    stmt = select(Product)
    if barcode:
        # Tìm đúng barcode → trả [] hoặc [1 item], không raise 500
        stmt = stmt.where(Product.barcode == barcode.strip())
        items = session.execute(stmt.limit(1)).scalars().all()
        return items
    else:
        like = f"%{q}%"
        stmt = stmt.where((Product.name.ilike(like)) | (Product.sku.ilike(like)))
        items = session.execute(stmt.limit(50).offset(page * 50)).scalars().all()
        return items

@router.post("", response_model=ProductOut)
def create_product(data: ProductCreate, session: Session = Depends(get_session)):
    p = Product(**data.model_dump())
    session.add(p)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    session.refresh(p)
    return p

@router.put("/{pid}", response_model=ProductOut)
def update_product(pid: str, data: ProductCreate, session: Session = Depends(get_session)):
    p = session.get(Product, pid)
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.model_dump().items():
        setattr(p, k, v)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    session.refresh(p)
    return p

@router.delete("/{pid}")
def delete_product(pid: str, session: Session = Depends(get_session)):
    p = session.get(Product, pid)
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    session.delete(p)
    session.commit()
    return {"ok": True}

# from fastapi import APIRouter, Depends, HTTPException, Query
# from sqlalchemy import select
# from sqlalchemy.orm import Session
# from app.core.db import SessionLocal
# from app.models.product import Product
# from app.schemas.product import ProductCreate, ProductOut

# router = APIRouter(prefix="/products", tags=["products"])

# def get_session():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.get("", response_model=list[ProductOut])
# def list_products(q: str = "", barcode: str | None = None, page: int = 0, session: Session = Depends(get_session)):
#     try:
#         stmt = select(Product)
#         if barcode:
#             # Tìm đúng barcode -> trả về list 0/1 phần tử, không raise
#             stmt = stmt.where(Product.barcode == barcode)
#             items = session.execute(stmt.limit(1)).scalars().all()
#             return items
#         else:
#             like = f"%{q}%"
#             stmt = stmt.where((Product.name.ilike(like)) | (Product.sku.ilike(like)))
#             items = session.execute(stmt.limit(50).offset(page * 50)).scalars().all()
#             return items
#     except Exception as e:
#         # Log ngắn và ném 500 có thông điệp để debug
#         raise HTTPException(status_code=500, detail=f"Internal error: {e}")

# @router.post("", response_model=ProductOut)
# def create_product(data: ProductCreate, session: Session = Depends(get_session)):
#     p = Product(**data.model_dump())
#     session.add(p)
#     try:
#         session.commit()
#     except Exception as e:
#         session.rollback()
#         raise HTTPException(status_code=400, detail=str(e))
#     session.refresh(p)
#     return p
