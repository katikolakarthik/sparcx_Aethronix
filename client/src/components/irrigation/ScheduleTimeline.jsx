import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';

export default function ScheduleTimeline({ schedule }) {
  if (!schedule?.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Generate a plan to see the weekly timeline.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-farm-400 to-teal-500 opacity-40" />
      <ul className="space-y-4">
        {schedule.map((row, i) => (
          <motion.li
            key={`${row.date}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="relative flex gap-4 pl-1"
          >
            <div className="z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-farm-500 shadow dark:border-slate-900">
              <CalendarClock className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 rounded-xl border border-farm-100/80 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display font-semibold text-slate-900 dark:text-white">
                  {row.dayLabel} · {row.date}
                </p>
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800 dark:bg-sky-950/60 dark:text-sky-200">
                  {row.liters} L
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{row.note}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
