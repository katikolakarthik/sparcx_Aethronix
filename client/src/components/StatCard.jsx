import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'from-farm-500 to-teal-500', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      className="group relative flex h-full min-h-[128px] flex-col overflow-hidden rounded-2xl border border-farm-100/80 bg-white p-4 shadow-card transition-shadow hover:shadow-lg sm:min-h-[132px] sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-2xl transition-opacity group-hover:opacity-25`}
      />
      <div className="flex flex-1 items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 pr-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs">
            {title}
          </p>
          <p className="mt-1.5 break-words font-display text-xl font-bold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-md`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
