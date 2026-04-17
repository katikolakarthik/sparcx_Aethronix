import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Store } from 'lucide-react';

export default function StoreCard({ store, index = 0 }) {
  const mapsHref = store.lat
    ? `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address || store.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-card-dark"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-800 dark:text-teal-200">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <h4 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{store.name}</h4>
            <p className="text-xs font-semibold text-farm-700 dark:text-farm-300">{store.distance}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
            store.isOpen ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {store.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      <p className="mt-3 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-farm-600" />
        {store.address}
      </p>
      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <Phone className="h-4 w-4 text-farm-600" />
        {store.contactNumber || '—'}
      </p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-200">Stock highlights:</span>{' '}
        {(store.availableMedicines || []).slice(0, 4).join(', ')}
        {(store.availableMedicines || []).length > 4 ? '…' : ''}
      </p>
      <a
        href={mapsHref}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-farm-600 to-teal-600 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
      >
        <Navigation className="h-4 w-4" />
        Navigate
      </a>
    </motion.div>
  );
}
