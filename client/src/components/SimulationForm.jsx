import { forwardRef } from 'react';

const soilOptions = ['Black', 'Red', 'Sandy', 'Clay'];
const waterOptions = ['Abundant', 'Moderate', 'Low', 'Scarce'];
const seasonOptions = ['Kharif', 'Rabi', 'Zaid', 'Monsoon', 'Summer', 'Winter'];
const cropPrefs = ['Auto', 'Rice', 'Cotton', 'Maize'];

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {label}
    </span>
    {children}
  </label>
);

const inputClass =
  'mt-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-farm-500/30 transition focus:border-farm-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

const SimulationForm = forwardRef(function SimulationForm({ value, onChange, onSubmit, onReset, loading }, ref) {
  const v = (name) => value[name] ?? '';

  const set = (name, val) => onChange({ ...value, [name]: val });

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <Field label="Farmer name">
        <input className={inputClass} value={v('farmerName')} onChange={(e) => set('farmerName', e.target.value)} />
      </Field>
      <Field label="Location">
        <input className={inputClass} value={v('location')} onChange={(e) => set('location', e.target.value)} placeholder="District / State" />
      </Field>
      <Field label="Land size (acres)">
        <input
          type="number"
          min="0.1"
          step="0.1"
          className={inputClass}
          value={v('landSize')}
          onChange={(e) => set('landSize', e.target.value)}
          required
        />
      </Field>
      <Field label="Soil type">
        <select className={inputClass} value={v('soilType')} onChange={(e) => set('soilType', e.target.value)} required>
          {soilOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Water availability">
        <select className={inputClass} value={v('waterAvailability')} onChange={(e) => set('waterAvailability', e.target.value)} required>
          {waterOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Budget (local currency)">
        <input type="number" min="1000" className={inputClass} value={v('budget')} onChange={(e) => set('budget', e.target.value)} required />
      </Field>
      <Field label="Season">
        <select className={inputClass} value={v('season')} onChange={(e) => set('season', e.target.value)}>
          {seasonOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Temperature (°C)">
        <input type="number" className={inputClass} value={v('temperature')} onChange={(e) => set('temperature', e.target.value)} />
      </Field>
      <Field label="Rainfall (mm)">
        <input type="number" className={inputClass} value={v('rainfall')} onChange={(e) => set('rainfall', e.target.value)} />
      </Field>
      <Field label="Crop preference">
        <select className={inputClass} value={v('cropPreference')} onChange={(e) => set('cropPreference', e.target.value)}>
          {cropPrefs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <div className="md:col-span-2 mt-2 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-xl bg-gradient-to-r from-farm-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {loading ? 'Simulating…' : 'Run simulation'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex flex-1 min-w-[120px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
        >
          Reset
        </button>
      </div>
    </form>
  );
});

export default SimulationForm;
