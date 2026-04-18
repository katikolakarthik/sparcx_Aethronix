import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const styles = {
  Buy: 'from-emerald-500 to-teal-600 text-white',
  Sell: 'from-rose-500 to-orange-500 text-white',
  Hold: 'from-amber-400 to-yellow-500 text-slate-900',
};

const icons = { Buy: TrendingUp, Sell: TrendingDown, Hold: Minus };

export default function RecommendationBadge({ recommendation, confidence, weekPrice, monthPrice, unit = '₹/kg' }) {
  const rec = recommendation || 'Hold';
  const Icon = icons[rec] || Minus;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-4 rounded-2xl border border-farm-100/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-card-dark"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">AI recommendation</p>
          <div
            className={`mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2 font-display text-lg font-bold shadow-md ${styles[rec] || styles.Hold}`}
          >
            <Icon className="h-5 w-5" />
            {rec}
          </div>
        </div>
        {confidence != null && (
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-950/80">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Confidence</p>
            <p className="font-display text-2xl font-bold text-farm-600 dark:text-farm-400">{Math.round(confidence)}%</p>
          </div>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">Predicted next week</p>
          <p className="font-display text-xl font-bold text-slate-900 dark:text-white">
            ₹{weekPrice}
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400"> {unit}</span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">Predicted next month</p>
          <p className="font-display text-xl font-bold text-slate-900 dark:text-white">
            ₹{monthPrice}
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400"> {unit}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
