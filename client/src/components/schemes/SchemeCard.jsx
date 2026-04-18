import { motion } from 'framer-motion';
import { ExternalLink, Landmark } from 'lucide-react';
import EligibilityBadge from './EligibilityBadge.jsx';

export default function SchemeCard({ scheme, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border border-farm-100/80 bg-white/90 p-5 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-card-dark"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-farm-400/15 to-teal-500/15 blur-2xl" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-farm-600 to-teal-600 text-white shadow-md">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{scheme.name}</h3>
            <p className="mt-1 text-sm text-farm-700 dark:text-farm-300">{scheme.benefitAmount}</p>
          </div>
        </div>
        <EligibilityBadge eligible />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{scheme.eligibility}</p>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
        {(scheme.applySteps || []).map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={scheme.officialLink || '#'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-farm-700 hover:text-farm-800 dark:text-farm-400 dark:hover:text-farm-300"
        >
          Official portal <ExternalLink className="h-4 w-4" />
        </a>
        {scheme.stateHint && <span className="text-xs text-slate-500 dark:text-slate-500">State: {scheme.stateHint}</span>}
      </div>
    </motion.article>
  );
}
