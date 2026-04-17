import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pill, HelpCircle } from 'lucide-react';
import HowToApplyModal from './HowToApplyModal.jsx';

export default function MedicineCard({ medicine, index = 0 }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group rounded-2xl border border-farm-100/80 bg-gradient-to-br from-white to-farm-50/40 p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80 dark:shadow-card-dark"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-600/10 text-farm-800 dark:bg-farm-500/15 dark:text-farm-200">
              <Pill className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{medicine.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Est. ₹{medicine.priceEstimate}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 rounded-xl border border-farm-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-farm-800 shadow-sm hover:bg-farm-50 dark:border-slate-700 dark:bg-slate-950 dark:text-farm-200 dark:hover:bg-slate-800"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            How to apply
          </button>
        </div>
        <dl className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <dt className="text-xs font-bold uppercase text-slate-400">Usage amount</dt>
            <dd>{medicine.usageAmount}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-400">Spray method</dt>
            <dd>{medicine.sprayMethod}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-400">Duration</dt>
            <dd>{medicine.duration}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-400">Precautions</dt>
            <dd>{medicine.safetyPrecautions}</dd>
          </div>
        </dl>
      </motion.div>
      <AnimatePresence>
        {open && <HowToApplyModal key={medicine.name} onClose={() => setOpen(false)} medicine={medicine} />}
      </AnimatePresence>
    </>
  );
}
