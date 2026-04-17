import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <motion.div
      layout
      className="rounded-2xl border border-farm-100/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="h-64 w-full min-h-[240px]">{children}</div>
    </motion.div>
  );
}
