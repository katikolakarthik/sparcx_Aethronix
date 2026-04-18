import { ShieldCheck } from 'lucide-react';

export default function PreventionPanel({ tips = [], treatmentNote }) {
  return (
    <div className="space-y-4 rounded-2xl border border-farm-100/80 bg-gradient-to-br from-white to-farm-50/30 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
        <ShieldCheck className="h-5 w-5 text-farm-600 dark:text-farm-400" />
        Prevention & treatment
      </div>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
        {tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {treatmentNote && (
        <p className="rounded-xl border border-teal-200/80 bg-teal-50/80 p-4 text-sm text-teal-900 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-100">
          {treatmentNote}
        </p>
      )}
    </div>
  );
}
