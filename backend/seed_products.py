"""Sync the products table with the frontend catalog (Frontend/src/catalog.json).

Run from the project root:  python -m backend.seed_products

Rows are upserted by id so product ids stay identical to the ones the frontend uses for saved
designs and consultation items. Existing stock values are kept.
"""
import json
from pathlib import Path

from sqlalchemy import text

from backend.database import Base, SessionLocal, engine
from backend.models.product import Product

CATALOG_PATH = Path(__file__).resolve().parent.parent / "Frontend" / "src" / "catalog.json"


def ensure_columns() -> None:
    # create_all() does not alter existing tables, so add the newer columns by hand (Postgres).
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS room VARCHAR"))
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS unit VARCHAR"))
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS styles JSON"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_products_room ON products (room)"))


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_columns()
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))

    db = SessionLocal()
    try:
        created = updated = 0
        for item in catalog:
            product = db.get(Product, item["id"])
            if product is None:
                product = Product(id=item["id"], stock=0)
                db.add(product)
                created += 1
            else:
                updated += 1
            product.name = item["name"]
            product.description = item.get("description")
            product.price = item["price"]
            product.category = item["category"]
            product.image_url = item.get("image")
            product.room = item.get("room")
            product.unit = item.get("unit")
            product.styles = item.get("styles")
        db.commit()

        # Keep the id sequence ahead of the explicit ids inserted above.
        db.execute(text("SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products))"))
        db.commit()
        print(f"Products synced from {CATALOG_PATH.name}: {created} created, {updated} updated")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
