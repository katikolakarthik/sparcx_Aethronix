import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function HowToApplyModal({ onClose, medicine }) {
  if (!medicine) return null;
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-farm-100/80 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-farm-700 dark:text-farm-300">How to apply</p>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{medicine.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-700 dark:text-slate-200">
          <li>
            <span className="font-semibold">Mix:</span> {medicine.usageAmount}
          </li>
          <li>
            <span className="font-semibold">Spray method:</span> {medicine.sprayMethod}
          </li>
          <li>
            <span className="font-semibold">Schedule:</span> {medicine.duration}
          </li>
          <li>
            <span className="font-semibold">Safety:</span> {medicine.safetyPrecautions}
          </li>
          <li>Calibrate nozzles; spray in calm air; wear PPE; log application dates for PHI compliance.</li>
        </ol>
      </motion.div>
    </motion.div>
  );
}
