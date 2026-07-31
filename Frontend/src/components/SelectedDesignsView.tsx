import { findProduct } from '../data';
import { Trash2, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SelectedDesignsViewProps {
  selectedDesigns: number[];
  onRemove: (id: number) => void;
  onClearAll: () => void;
  onProceedToConsultation: () => void;
}

export function SelectedDesignsView({
  selectedDesigns,
  onRemove,
  onClearAll,
  onProceedToConsultation
}: SelectedDesignsViewProps) {
  const savedProducts = selectedDesigns
    .map(id => findProduct(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (savedProducts.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center pt-36 pb-24 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full flex flex-col items-center justify-center p-12 bg-[var(--theme-surface)] backdrop-blur-md rounded-3xl border border-[var(--theme-border)] shadow-lg text-center"
        >
          <div className="w-16 h-16 bg-[var(--theme-accent-soft)]/12 rounded-full flex items-center justify-center mb-6 text-[var(--theme-accent)] border border-[var(--theme-border)]">
            <Heart className="w-8 h-8 animate-pulse text-[var(--theme-accent)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--theme-text)] mb-3 font-serif">No Saved Designs Yet</h3>
          <p className="text-[var(--theme-muted)] text-sm font-light leading-relaxed mb-8">
            Explore our curated paint colors, organic materials, and designer room catalogs. Save the concepts you love to attach them to your personalized interior plan.
          </p>
          <button
            onClick={onProceedToConsultation}
            className="px-6 py-3 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-strong)] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer"
          >
            Start Browsing
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)] pt-36 pb-24 px-4 md:px-8 lg:px-12 selection:bg-[var(--theme-accent-soft)]/30">
      <div className="max-w-5xl mx-auto">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-[var(--theme-border)]"
        >
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/15 px-4.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-sm border border-[var(--theme-border)]">
              <Heart className="w-3.5 h-3.5 fill-[var(--theme-accent)] text-[var(--theme-accent)]" /> Consultation Moodboard
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-[var(--theme-text)] font-bold tracking-tight">
              My Selected Designs ({savedProducts.length})
            </h1>
          </div>
          <button
            onClick={onClearAll}
            className="sm:self-end text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)] hover:text-red-600 transition-colors border border-[var(--theme-border)] hover:border-red-200 bg-white/40 px-5 py-2.5 rounded-xl cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Clear All Designs
          </button>
        </motion.div>

        {/* Selected Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {savedProducts.map((product) => {
              const displayRoom = product.room
                ? product.room.charAt(0).toUpperCase() + product.room.slice(1) + ' Room'
                : product.category.charAt(0).toUpperCase() + product.category.slice(1);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  key={product.id}
                  className="group flex gap-5 p-5 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-surface-strong)] transition-all duration-300 shadow-md hover:shadow-lg items-stretch"
                >
                  {/* Thumbnail Image */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white/45 flex-shrink-0 relative border border-[var(--theme-border)] shadow-inner">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Meta */}
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/15 px-2.5 py-1 rounded">
                            {displayRoom}
                          </span>
                          <h3 className="font-bold text-[var(--theme-text)] mt-2 text-lg leading-snug font-serif">
                            {product.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => onRemove(product.id)}
                          className="text-[var(--theme-muted)] hover:text-red-600 p-2 rounded-xl hover:bg-red-50/50 border border-transparent hover:border-red-100/50 transition-all cursor-pointer active:scale-90"
                          title="Remove Design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[var(--theme-muted)] font-light leading-relaxed mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl"
        >
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold font-serif text-[var(--theme-text)] mb-1">
              Ready to meet your designer?
            </h4>
            <p className="text-sm text-[var(--theme-muted)] font-light max-w-md">
              We will prepare custom moodboards, floorplans, and sample materials based on your {savedProducts.length} selected designs.
            </p>
          </div>
          <button
            onClick={onProceedToConsultation}
            className="w-full md:w-auto px-8 py-4 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-strong)] text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] text-center uppercase tracking-wider text-xs md:text-sm cursor-pointer flex items-center justify-center gap-2 border border-transparent hover:border-white/10"
          >
            Proceed to Request Consultation <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
