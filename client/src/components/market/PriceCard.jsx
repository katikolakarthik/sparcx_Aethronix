import { motion } from 'framer-motion';
import { IndianRupee, MapPin } from 'lucide-react';

export default function PriceCard({ crop, location, currentPrice, unit, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-farm-100/80 bg-white/70 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-card-dark">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-10 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-farm-100/80 bg-gradient-to-br from-white via-farm-50/40 to-teal-50/30 p-6 shadow-card dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:shadow-card-dark"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-farm-400/20 to-teal-500/20 blur-2xl" />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current mandi price</p>
      <p className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">{crop}</p>
      <div className="mt-4 flex items-end gap-2">
        <IndianRupee className="mb-1 h-6 w-6 text-farm-600 dark:text-farm-400" />
        <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">{currentPrice}</span>
        <span className="pb-1 text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>
      </div>
      {location && (
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="h-4 w-4 shrink-0 text-farm-500" />
          {location}
        </p>
      )}
    </motion.div>
  );
}
