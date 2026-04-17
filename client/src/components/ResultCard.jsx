import { motion } from 'framer-motion';

export default function ResultCard({ title, value, hint, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl border border-farm-100/80 bg-gradient-to-br from-white to-farm-50/50 p-4 shadow-card dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80 dark:shadow-card-dark"
    >
      {Icon && (
        <div className="mb-2 inline-flex rounded-lg bg-farm-600/10 p-2 text-farm-700 dark:bg-farm-500/15 dark:text-farm-300">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </motion.div>
  );
}
