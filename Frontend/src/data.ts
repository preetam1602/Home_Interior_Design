import { Product } from './types';
import catalog from './catalog.json';

// The catalog lives in catalog.json so the backend can seed the products table from the same source
// (see backend/seed_products.py).
export const products = catalog as Product[];

export function findProduct(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

export function getDiscountRate(id: number): number {
  if (id >= 109 && id <= 116) {
    return 0.05; // 5% discount on decor
  }
  if ((id >= 101 && id <= 108) || (id >= 117 && id <= 134)) {
    return 0.10; // 10% discount on furniture
  }
  return 0; // no discount
}

// Price shown on the site: furniture and decor cards carry a flat 10% offer.
// Mirrored in backend/services/product_retrieval.py so the AI consultant quotes the same price.
export function getDisplayPrice(product: Product): number {
  return product.category === 'furniture' || product.category === 'decor' ? product.price * 0.9 : product.price;
}
