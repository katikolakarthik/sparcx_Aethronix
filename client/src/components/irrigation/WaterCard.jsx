import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

export default function WaterCard({ title, value, subtitle, accent = 'from-sky-500 to-teal-600' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-farm-100/80 bg-white/90 p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-card-dark"
    >
      <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-md`}>
          <Droplets className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
