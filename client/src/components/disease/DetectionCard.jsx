import { motion } from 'framer-motion';

export default function DetectionCard({ title, value, hint, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="glass relative overflow-hidden rounded-2xl border border-farm-100/80 p-5 shadow-card dark:border-slate-800 dark:shadow-card-dark"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-farm-400/30 to-teal-500/20 blur-2xl" />
      {Icon && (
        <div className="mb-2 inline-flex rounded-xl bg-farm-600/10 p-2 text-farm-700 dark:bg-farm-500/15 dark:text-farm-300">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </motion.div>
  );
}
