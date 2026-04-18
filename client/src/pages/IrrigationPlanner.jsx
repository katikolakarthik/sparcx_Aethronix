import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import AlertBanner from '../components/irrigation/AlertBanner.jsx';
import ScheduleTimeline from '../components/irrigation/ScheduleTimeline.jsx';
import WaterCard from '../components/irrigation/WaterCard.jsx';
import { CROP_OPTIONS, SOIL_TYPES, WATER_SOURCES, WEATHER_OPTIONS } from '../constants/farmOptions.js';

export default function IrrigationPlanner() {
  const [form, setForm] = useState({
    crop: 'Cotton',
    landSize: '10',
    soilType: 'Black soil',
    weather: 'Humid',
    waterSource: 'Drip system',
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const submit = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/irrigation/plan', {
        crop: form.crop,
        landSize: Number(form.landSize),
        soilType: form.soilType,
        weather: form.weather,
        waterSource: form.waterSource,
      });
      setPlan(data);
      toast.success('Irrigation plan ready');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Plan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-farm-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-farm-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-farm-200">
          <Droplets className="h-3.5 w-3.5" /> Water smart
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Smart irrigation planner</h1>
        <p className="text-slate-600 dark:text-slate-400">Weekly schedule, next pass, and conservation tips (mock engine).</p>
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
              value={form.crop}
              onChange={(e) => setForm((f) => ({ ...f, crop: e.target.value }))}
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
            Land size (acres)
            <input
              type="number"
              value={form.landSize}
              onChange={(e) => setForm((f) => ({ ...f, landSize: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Soil type
            <select
              value={form.soilType}
              onChange={(e) => setForm((f) => ({ ...f, soilType: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Weather outlook
            <select
              value={form.weather}
              onChange={(e) => setForm((f) => ({ ...f, weather: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {WEATHER_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Water source
            <select
              value={form.waterSource}
              onChange={(e) => setForm((f) => ({ ...f, waterSource: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {WATER_SOURCES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="mt-6 rounded-2xl bg-gradient-to-r from-farm-600 to-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          Build irrigation plan
        </button>
      </motion.div>

      {plan && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <AlertBanner show={plan.droughtWarning} message={plan.droughtMessage} />
          <div className="grid gap-4 sm:grid-cols-2">
            <WaterCard title="Water needed today" value={`${plan.waterNeededToday} L`} subtitle="Approx. field application" />
            <WaterCard
              title="Next irrigation"
              value={plan.nextIrrigationDate}
              subtitle="Suggested calendar date"
              accent="from-farm-500 to-emerald-600"
            />
          </div>
          <div className="rounded-3xl border border-farm-100/80 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-card-dark">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Weekly timeline</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total seasonal need ~{plan.waterNeeded} L (mock)</p>
            <div className="mt-6">
              <ScheduleTimeline schedule={plan.schedule} />
            </div>
          </div>
          <div className="rounded-3xl border border-farm-100/80 bg-gradient-to-br from-white to-sky-50/40 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Water saving tips</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {(plan.tips || []).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
