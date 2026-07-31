import { Product } from '../types';
import { products } from '../data';
import { Sparkles, Palette, Layers, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface MaterialViewProps {
  selectedDesigns: number[];
  onToggleSave: (id: number) => void;
}

export function MaterialView({ selectedDesigns, onToggleSave }: MaterialViewProps) {
  const colorProducts = products.filter(p => p.category === 'color');
  const materialProducts = products.filter(p => p.category === 'material');

  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)] py-24 px-4 md:px-8 lg:px-12 selection:bg-[var(--theme-accent-soft)]/30">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/15 px-4.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-5 shadow-sm border border-[var(--theme-border)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)] animate-pulse" /> Design Essentials
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--theme-text)] font-bold tracking-tight mb-4 leading-tight">
          Color & Material Selection
        </h1>
        <div className="w-24 h-1 bg-[var(--theme-accent-soft)] mx-auto rounded-full mb-6"></div>
        <p className="max-w-2xl mx-auto text-base md:text-lg text-[var(--theme-muted)] leading-relaxed font-light">
          Choosing the right tones, organic textures, and premium finishes is vital to enhancing your visual environment. Explore our curated paint swatches and architectural surfaces.
        </p>
      </motion.div>

      {/* Colors Section */}
      <div className="max-w-7xl mx-auto mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8 border-b border-[var(--theme-border)] pb-4"
        >
          <div className="p-2.5 bg-[var(--theme-accent-soft)]/15 rounded-xl text-[var(--theme-accent)]">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[var(--theme-text)] font-semibold">Premium Paint Swatches</h2>
            <p className="text-xs md:text-sm text-[var(--theme-muted)] font-light">Harmony, warmth, and artistic character in every shade</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {colorProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isSaved={selectedDesigns.includes(product.id)}
              onToggle={() => onToggleSave(product.id)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Materials Section */}
      <div className="max-w-7xl mx-auto mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8 border-b border-[var(--theme-border)] pb-4"
        >
          <div className="p-2.5 bg-[var(--theme-accent-soft)]/15 rounded-xl text-[var(--theme-accent)]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[var(--theme-text)] font-semibold">Architectural Surfaces</h2>
            <p className="text-xs md:text-sm text-[var(--theme-muted)] font-light">Premium materials that blend structural durability, organic texture, and exquisite style</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {materialProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isSaved={selectedDesigns.includes(product.id)}
              onToggle={() => onToggleSave(product.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onToggle: () => void;
  index: number;
}

function ProductCard({ product, isSaved, onToggle, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group relative bg-[var(--theme-surface)] backdrop-blur-md border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-surface-strong)] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[rgba(140,115,85,0.05)] transition-all duration-500 flex flex-col justify-between h-full"
    >
      <div>
        {/* Product Image */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-white/45 relative shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
            loading="lazy"
          />
          {/* Subtle brand tint overlay */}
          <div className="absolute inset-0 bg-[var(--theme-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Product Details */}
        <div className="p-6">
          <h3 className="text-xl font-serif text-[var(--theme-text)] font-bold mb-2 group-hover:text-[var(--theme-accent)] transition-colors leading-tight">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-[var(--theme-accent)] block mb-2 font-sans tracking-tight">
            ₹{product.price.toLocaleString()} <span className="text-xs font-light text-slate-500 lowercase">{product.unit}</span>
          </span>
          <p className="text-xs md:text-sm text-[var(--theme-muted)] leading-relaxed font-light line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="p-6 pt-0">
        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs md:text-sm tracking-wide uppercase transition-all duration-300 cursor-pointer shadow-sm ${
            isSaved
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'
              : 'bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-strong)] text-white shadow-[rgba(140,115,85,0.1)] hover:-translate-y-0.5'
          }`}
        >
          {isSaved ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-white animate-bounce" /> Saved to Designs
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-white fill-none group-hover:fill-white/30" /> Save Design
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
