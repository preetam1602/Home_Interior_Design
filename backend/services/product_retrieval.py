"""Product lookup for the AI consultant.

The catalog is small (~50 items), so the whole catalog is handed to the LLM rather than
pre-filtering with search. Revisit this once the catalog grows into the hundreds.
"""
from sqlalchemy.orm import Session

from backend.models.product import Product

DISCOUNTED_CATEGORIES = {"furniture", "decor"}
SITE_DISCOUNT = 0.10


def site_price(product: Product) -> int:
    # Mirrors getDisplayPrice in Frontend/src/data.ts — furniture and decor show 10% off on the site.
    if product.category in DISCOUNTED_CATEGORIES:
        return round(product.price * (1 - SITE_DISCOUNT))
    return product.price


def get_catalog(db: Session) -> dict[int, Product]:
    return {p.id: p for p in db.query(Product).order_by(Product.id).all()}


def format_product_line(product: Product) -> str:
    unit = product.unit.lstrip("/ ").strip() if product.unit else None  # "/ litre" -> "litre"
    price = f"₹{site_price(product)}{f' per {unit}' if unit else ''}"
    parts = [
        str(product.id),
        product.name,
        product.category,
        f"room: {product.room}" if product.room else None,
        price,
        f"styles: {', '.join(product.styles)}" if product.styles else None,
        product.description,
    ]
    return " | ".join(p for p in parts if p)


def estimate_total(products: list[Product]) -> int | None:
    # Paint and materials are priced per litre / sq.ft, so only per-item products can be summed.
    per_item = [p for p in products if not p.unit]
    return sum(site_price(p) for p in per_item) if per_item else None
