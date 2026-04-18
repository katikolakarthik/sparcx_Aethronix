import { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import SchemeCard from '../components/schemes/SchemeCard.jsx';
import { CROP_OPTIONS, FARMER_CATEGORIES, INDIAN_STATES } from '../constants/farmOptions.js';

export default function Schemes() {
  const [state, setState] = useState('Telangana');
  const [landSize, setLandSize] = useState('5');
  const [cropType, setCropType] = useState('Cotton');
  const [farmerCategory, setFarmerCategory] = useState('Small farmer');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const find = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/schemes/recommend', {
        state,
        landSize: Number(landSize),
        cropType,
        farmerCategory,
      });
      setResults(data.results || []);
      toast.success(`Found ${data.results?.length || 0} schemes`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-farm-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-farm-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-farm-200">
          <Landmark className="h-3.5 w-3.5" /> Government programs
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Schemes & subsidy finder</h1>
        <p className="text-slate-600 dark:text-slate-400">Filter mock catalogue — official links open in a new tab.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-farm-100/80 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-card-dark md:p-8"
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-slate-950/70">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-farm-500 border-t-transparent" />
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            State
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Land size (acres)
            <input
              type="number"
              min="0"
              step="0.1"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Crop type
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Farmer category
            <select
              value={farmerCategory}
              onChange={(e) => setFarmerCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {FARMER_CATEGORIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={find}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-farm-600 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60 md:w-auto md:px-10"
        >
          Find matching schemes
        </button>
      </motion.div>

      <div className="space-y-4">
        {(results || []).length === 0 && !loading && (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">Submit filters to see scheme cards.</p>
        )}
        {(results || []).map((s, i) => (
          <SchemeCard key={s.id || s.name} scheme={s} index={i} />
        ))}
      </div>
    </div>
  );
}
