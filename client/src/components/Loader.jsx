import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

/** Full-screen or inline loading indicator */
export default function Loader({ label = 'Running simulation…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-farm-400 to-teal-500 text-white shadow-lg"
        animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <Leaf className="h-9 w-9" />
        <motion.span
          className="absolute inset-0 rounded-2xl border-2 border-white/40"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      </motion.div>
      <p className="font-display text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
