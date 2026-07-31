import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg text-white mb-6"
    >
      <Sparkles className="w-4 h-4 text-[var(--theme-accent-soft)] animate-pulse" />
      <span className="text-xs uppercase tracking-widest font-semibold font-sans">
        RIVR Interior Studio
      </span>
    </motion.div>
  );
}
