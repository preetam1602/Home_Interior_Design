import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { findProduct, getDisplayPrice } from '../../data';

interface RecommendedProductsProps {
  productIds: number[];
  estimatedTotal: number | null;
  savedDesigns: number[];
  onToggleSave: (id: number) => void;
}

export function RecommendedProducts({ productIds, estimatedTotal, savedDesigns, onToggleSave }: RecommendedProductsProps) {
  const items = productIds
    .map(id => findProduct(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (items.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {items.map((product, index) => {
          const isSaved = savedDesigns.includes(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="snap-start shrink-0 w-40 bg-white/70 border border-[var(--theme-border)] rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-white/45 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3 flex flex-col gap-1 flex-grow">
                <h4 className="text-sm font-serif font-bold text-[var(--theme-text)] leading-tight line-clamp-2">{product.name}</h4>
                <span className="text-xs font-bold text-[var(--theme-accent)]">
                  ₹{getDisplayPrice(product).toLocaleString()}{' '}
                  <span className="font-light text-[var(--theme-muted)] lowercase">{product.unit}</span>
                </span>
                <button
                  onClick={() => onToggleSave(product.id)}
                  className={`mt-auto pt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isSaved ? 'text-blue-600' : 'text-[var(--theme-muted)] hover:text-[var(--theme-accent)]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : 'fill-none'}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      {estimatedTotal !== null && (
        <p className="text-[11px] text-[var(--theme-muted)] mt-1">
          Furniture &amp; decor shown: approx. <strong className="text-[var(--theme-text)]">₹{estimatedTotal.toLocaleString()}</strong>
          {items.some(p => p.unit) && ' (paint & materials priced separately)'}
        </p>
      )}
    </div>
  );
}
