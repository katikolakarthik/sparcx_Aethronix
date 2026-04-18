import { motion } from 'framer-motion';
import { Bug } from 'lucide-react';

export default function PestCard({ pest, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3 rounded-xl border border-farm-100/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow">
        <Bug className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display font-semibold text-slate-900 dark:text-white">{pest.name}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{pest.note}</p>
        {pest.riskContribution != null && (
          <p className="mt-2 text-xs font-medium text-farm-700 dark:text-farm-400">Weight ~{pest.riskContribution}</p>
        )}
      </div>
    </motion.div>
  );
}
