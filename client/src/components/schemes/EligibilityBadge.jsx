import { CheckCircle2, Info } from 'lucide-react';

export default function EligibilityBadge({ eligible = true, compact }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        eligible
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
          : 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200'
      }`}
    >
      {eligible ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
      {eligible ? (compact ? 'Match' : 'Likely eligible') : 'Review rules'}
    </span>
  );
}
