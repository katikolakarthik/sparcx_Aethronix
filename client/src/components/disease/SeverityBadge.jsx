import { motion } from 'framer-motion';

const styles = {
  Low: 'bg-emerald-500/15 text-emerald-800 ring-emerald-500/30 dark:text-emerald-200',
  Medium: 'bg-amber-500/15 text-amber-900 ring-amber-500/30 dark:text-amber-100',
  High: 'bg-rose-500/15 text-rose-900 ring-rose-500/30 dark:text-rose-100',
};

export default function SeverityBadge({ level }) {
  const key = ['Low', 'Medium', 'High'].includes(level) ? level : 'Low';
  return (
    <motion.span
      layout
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${styles[key]}`}
    >
      {key} severity
    </motion.span>
  );
}
