from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.crud.products import create_product, delete_product, get_product_by_id, list_products, update_product
from backend.database import get_db
from backend.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["Product"])


@router.post("/product", response_model=ProductResponse)
def create_pro(pro: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, pro)


@router.get("/product", response_model=list[ProductResponse])
def list_pro(db: Session = Depends(get_db)):
    return list_products(db)


@router.get("/product/{product_id}", response_model=ProductResponse)
def get_pro_id(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.put("/product/{product_id}", response_model=ProductResponse)
def update_pro(product_id: int, up: ProductUpdate, db: Session = Depends(get_db)):
    updated_product = update_product(db, product_id, up)
    if not updated_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return updated_product


@router.delete("/product/{product_id}")
def delete_pro(product_id: int, db: Session = Depends(get_db)):
    deleted = delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"detail": "Product deleted successfully"}