import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function AlertBanner({ show, message }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-amber-950 dark:border-amber-900/50 dark:from-amber-950/40 dark:to-orange-950/30 dark:text-amber-100"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-display font-semibold">Drought / stress watch</p>
        <p className="mt-1 text-sm opacity-90">{message}</p>
      </div>
    </motion.div>
  );
}
