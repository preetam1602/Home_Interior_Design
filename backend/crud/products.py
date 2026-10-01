from sqlalchemy.orm import Session

from backend.models.product import Product
from backend.schemas.product import ProductCreate, ProductUpdate


def get_product_by_id(db: Session, product_id: int) -> Product | None:
    return db.query(Product).filter(Product.id == product_id).first()


def list_products(db: Session) -> list[Product]:
    return db.query(Product).order_by(Product.created_at.desc()).all()


def create_product(db: Session, product: ProductCreate) -> Product:
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        category=product.category,
        stock=product.stock,
        room=product.room,
        unit=product.unit,
        styles=product.styles,
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product_update: ProductUpdate) -> Product | None:
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None

    for field, value in product_update.model_dump(exclude_unset=True).items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int) -> bool:
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return False

    db.delete(db_product)
    db.commit()
    return True
