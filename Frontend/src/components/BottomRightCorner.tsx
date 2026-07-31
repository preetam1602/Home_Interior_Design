import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export function BottomRightCorner() {
  const handleScrollToDesign = () => {
    const el = document.getElementById('design');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3 hidden md:flex"
    >
      <button
        onClick={handleScrollToDesign}
        className="px-6 py-4 rounded-[20px] bg-white/15 backdrop-blur-xl border border-white/20 hover:border-white/40 text-white shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
      >
        <div className="flex flex-col items-start text-left">
          <span className="text-[9px] uppercase tracking-widest text-[var(--theme-contrast)] font-semibold">Start Curation</span>
          <span className="text-sm font-semibold flex items-center gap-1">
            Explore Styling Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </button>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase tracking-wider font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent-soft)] animate-ping"></span>
        Studio Online &bull; Consulting Available
      </div>
    </motion.div>
  );
}
