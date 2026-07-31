import { motion } from 'motion/react';
import { Layers, Palette, Armchair } from 'lucide-react';

export function BottomLeftCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="absolute bottom-6 left-6 z-20 max-w-[280px] sm:max-w-xs p-5 sm:p-6 bg-slate-900/22 backdrop-blur-xl border border-white/15 rounded-[24px] text-white shadow-2xl flex flex-col gap-4 hidden md:flex"
    >
      <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--theme-contrast)]">
        Studio Status
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--theme-accent-soft)]/20 rounded-lg text-[var(--theme-accent-soft)]">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-white/60 block font-sans">Active Tones</span>
            <span className="text-sm font-semibold">16 Color Swatches</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--theme-accent-soft)]/20 rounded-lg text-[var(--theme-accent-soft)]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-white/60 block font-sans">Premium Textures</span>
            <span className="text-sm font-semibold">8 Surface Finishes</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--theme-accent-soft)]/20 rounded-lg text-[var(--theme-accent-soft)]">
            <Armchair className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-white/60 block font-sans">Luxury Furniture</span>
            <span className="text-sm font-semibold">16 Designer Styling Options</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
