import { motion } from 'framer-motion';

export default function RiskMeter({ score = 0, severity }) {
  const pct = Math.min(100, Math.max(0, score));
  const color =
    pct >= 70 ? 'from-rose-500 to-orange-500' : pct >= 45 ? 'from-amber-400 to-yellow-500' : 'from-emerald-500 to-teal-500';

  return (
    <div className="rounded-2xl border border-farm-100/80 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-card-dark">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pest risk score</p>
          <p className="mt-1 font-display text-4xl font-extrabold text-slate-900 dark:text-white">{Math.round(pct)}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">out of 100</p>
        </div>
        {severity && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            {severity}
          </span>
        )}
      </div>
      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
