import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import PestCard from '../components/pest/PestCard.jsx';
import PreventionPanel from '../components/pest/PreventionPanel.jsx';
import RiskMeter from '../components/pest/RiskMeter.jsx';
import { CROP_OPTIONS, INDIAN_STATES, WEATHER_OPTIONS } from '../constants/farmOptions.js';

const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

export default function PestAlerts() {
  const [crop, setCrop] = useState('Cotton');
  const [location, setLocation] = useState('Telangana');
  const [season, setSeason] = useState('Kharif');
  const [weather, setWeather] = useState('Humid');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const predict = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/pest/predict', { crop, location, season, weather });
      setAlert(data);
      toast.success('Pest risk assessed');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Assessment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-farm-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-farm-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-farm-200">
          <Bug className="h-3.5 w-3.5" /> Field intelligence
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Pest outbreak early warning</h1>
        <p className="text-slate-600 dark:text-slate-400">Rule-based mock risk — always confirm with scouting.</p>
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
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Crop
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Location (state)
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Season
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Weather pattern
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {WEATHER_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={predict}
          disabled={loading}
          className="mt-6 rounded-2xl bg-gradient-to-r from-farm-600 to-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          Assess pest risk
        </button>
      </motion.div>

      {alert && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <RiskMeter score={alert.riskScore} severity={alert.severity} />
          <div>
            <h2 className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">Likely pests</h2>
            <div className="space-y-3">
              {(alert.pests || []).map((p, i) => (
                <PestCard key={p.name} pest={p} index={i} />
              ))}
            </div>
          </div>
          <PreventionPanel tips={alert.preventionTips} treatmentNote={alert.treatmentNote} />
        </motion.div>
      )}
    </div>
  );
}
