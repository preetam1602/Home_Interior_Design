import { Product } from '../types';
import { products } from '../data';
import { Sparkles, Armchair, Bed, Utensils, Briefcase, ChefHat, Flower2, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface FurnitureViewProps {
  selectedDesigns: number[];
  onToggleSave: (id: number) => void;
}

const SECTIONS = [
  {
    key: 'living',
    name: 'Living Room',
    subtitle: 'Sophisticated comfort, elegant lounging, and premium social layouts',
    icon: Armchair,
  },
  {
    key: 'bedroom',
    name: 'Bedroom',
    subtitle: 'Tranquil retreats, custom modular wardrobes, and luxury beds',
    icon: Bed,
  },
  {
    key: 'dining',
    name: 'Dining Room',
    subtitle: 'Bespoke marble tables, dining chairs, and artistic bar cabinets',
    icon: Utensils,
  },
  {
    key: 'office',
    name: 'Office',
    subtitle: 'Ergonomic chairs, walnut writing desks, and modular libraries',
    icon: Briefcase,
  },
  {
    key: 'kitchen',
    name: 'Kitchen',
    subtitle: 'Modern prep islands, slide-out pantries, and custom light fixtures',
    icon: ChefHat,
  },
  {
    key: 'decor',
    name: 'Decor & Accessories',
    subtitle: 'Premium rugs, hand-crafted artwork, and curated table pieces',
    icon: Flower2,
  },
] as const;

export function FurnitureView({ selectedDesigns, onToggleSave }: FurnitureViewProps) {
  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)] pt-36 pb-24 px-4 md:px-8 lg:px-12 selection:bg-[var(--theme-accent-soft)]/30">
      {/* Dynamic Offer Marquee */}
      <div className="w-full bg-[var(--theme-text)]/96 border-b border-[var(--theme-border)] py-3 text-[var(--theme-bg)] overflow-hidden fixed top-[80px] left-0 z-40 backdrop-blur-md shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-8 flex items-center gap-2 font-medium tracking-wide uppercase text-[10px] sm:text-xs text-[var(--theme-accent-soft)]">
            🌟 Personalized Styling &bull; Free Floorplanning &bull; Color Consultation Included &bull; Premium Material Sourcing
          </span>
          <span className="mx-8 flex items-center gap-2 font-medium tracking-wide uppercase text-[10px] sm:text-xs text-[var(--theme-accent-soft)]">
            🌟 Personalized Styling &bull; Free Floorplanning &bull; Color Consultation Included &bull; Premium Material Sourcing
          </span>
          <span className="mx-8 flex items-center gap-2 font-medium tracking-wide uppercase text-[10px] sm:text-xs text-[var(--theme-accent-soft)]">
            🌟 Personalized Styling &bull; Free Floorplanning &bull; Color Consultation Included &bull; Premium Material Sourcing
          </span>
        </div>
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto text-center mb-20"
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/15 px-4.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-5 shadow-sm border border-[var(--theme-border)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)] animate-pulse" /> Curated Room Styling
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--theme-text)] font-bold tracking-tight mb-4 leading-tight">
          Bespoke Furniture & Styling
        </h1>
        <div className="w-24 h-1 bg-[var(--theme-accent-soft)] mx-auto rounded-full mb-6"></div>
        <p className="max-w-2xl mx-auto text-base md:text-lg text-[var(--theme-muted)] leading-relaxed font-light">
          Browse luxury design concepts organized by room. Save the items that define your dream aesthetic to include them directly in your customized design consultation.
        </p>
      </motion.div>

      {/* Room-based Sections */}
      {SECTIONS.map((section) => {
        const SectionIcon = section.icon;
        // Filter products that belong to this room, and show up to 5 featured items
        const sectionProducts = products
          .filter(p => p.room === section.key)
          .slice(0, 5);

        return (
          <div key={section.key} className="max-w-7xl mx-auto mb-28 scroll-mt-32">
            {/* Section Title */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3.5 mb-8 border-b border-[var(--theme-border)] pb-4"
            >
              <div className="p-3 bg-[var(--theme-accent-soft)]/15 rounded-2xl text-[var(--theme-accent)] border border-[var(--theme-border)]">
                <SectionIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-[var(--theme-text)] font-bold">
                  {section.name}
                </h2>
                <p className="text-xs md:text-sm text-[var(--theme-muted)] font-light mt-0.5">
                  {section.subtitle}
                </p>
              </div>
            </motion.div>

            {/* Product Grid (Products + Premium CTA Card) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {sectionProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSaved={selectedDesigns.includes(product.id)}
                  onToggle={() => onToggleSave(product.id)}
                  index={index}
                />
              ))}
              {/* Premium CTA card at the end of the section grid */}
              <PremiumCTAFeedbackCard />
            </div>
          </div>
        );
      })}
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
  const discount = 0.10; // Auto-apply 10% discount styling for luxury items
  const discountedPrice = product.price * (1 - discount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
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
          {/* Subtle brand tint hover overlay */}
          <div className="absolute inset-0 bg-[var(--theme-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Product Details */}
        <div className="p-6">
          <h3 className="text-xl font-serif text-[var(--theme-text)] font-bold mb-2 group-hover:text-[var(--theme-accent)] transition-colors leading-tight">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2.5 font-sans">
            <span className="text-lg font-bold text-[var(--theme-accent)]">
              ₹{discountedPrice.toLocaleString()}
            </span>
            <span className="text-xs text-[var(--theme-muted)] line-through font-light">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <p className="text-xs md:text-sm text-[var(--theme-muted)] leading-relaxed font-light line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Save Button */}
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

function PremiumCTAFeedbackCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col justify-between h-full p-8 min-h-[350px] group"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-600/20 transition-colors duration-500" />
      
      <div className="flex-grow flex flex-col justify-center text-center px-2 py-4">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/15 group-hover:scale-110 transition-transform">
          <Sparkles className="w-6 h-6 text-blue-300" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-white mb-4 tracking-tight leading-tight">
          500+ More Designs Available
        </h3>
        <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed mb-6">
          Visit our showroom or book a consultation to explore our complete catalog.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            const el = document.getElementById('contact');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs md:text-sm tracking-wide uppercase transition-all duration-300 bg-white text-slate-950 hover:bg-slate-100 active:scale-[0.97] cursor-pointer shadow-md"
        >
          Book Consultation
        </button>
      </div>
    </motion.div>
  );
}
