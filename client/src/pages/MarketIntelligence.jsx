import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import ChartCard from '../components/ChartCard.jsx';
import PriceCard from '../components/market/PriceCard.jsx';
import RecommendationBadge from '../components/market/RecommendationBadge.jsx';
import TrendChart from '../components/market/TrendChart.jsx';
import { CROP_OPTIONS, INDIAN_STATES } from '../constants/farmOptions.js';

export default function MarketIntelligence() {
  const [crop, setCrop] = useState('Tomato');
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Hyderabad');
  const [priceLoading, setPriceLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [live, setLive] = useState(null);
  const [forecast, setForecast] = useState(null);

  const loadPrices = useCallback(async () => {
    setPriceLoading(true);
    try {
      const { data } = await api.get('/market/prices', { params: { crop, state, district } });
      setLive(data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not load prices');
    } finally {
      setPriceLoading(false);
    }
  }, [crop, state, district]);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const runPredict = async () => {
    setForecastLoading(true);
    try {
      const { data } = await api.post('/market/predict', { crop, state, district });
      setForecast(data);
      toast.success('Forecast updated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Forecast failed');
    } finally {
      setForecastLoading(false);
    }
  };

  const chartData =
    forecast?.trendSeries?.map((p) => ({
      name: p.label,
      price: p.price,
      projected: p.projected,
    })) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-farm-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-farm-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-farm-200">
          <LineChart className="h-3.5 w-3.5" /> Market intelligence
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Live market price predictor</h1>
        <p className="text-slate-600 dark:text-slate-400">Mock AI trends for demo — select crop and mandi region.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 rounded-3xl border border-farm-100/80 bg-white/90 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-card-dark md:grid-cols-3 md:p-8"
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Crop
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {CROP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          State
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          District
          <input
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
        <div className="flex flex-wrap items-end gap-3 md:col-span-3">
          <button
            type="button"
            onClick={loadPrices}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
          >
            Refresh price
          </button>
          <button
            type="button"
            disabled={forecastLoading}
            onClick={runPredict}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-farm-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {forecastLoading ? 'Predicting…' : 'Run AI forecast'}
          </button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PriceCard
          crop={crop}
          location={live?.location}
          currentPrice={live?.currentPrice ?? forecast?.currentPrice}
          unit={live?.unit || forecast?.unit || '₹/kg'}
          loading={priceLoading && !forecast}
        />
        {forecast ? (
          <RecommendationBadge
            recommendation={forecast.recommendation}
            confidence={forecast.confidence}
            weekPrice={forecast.predictedPriceWeek}
            monthPrice={forecast.predictedPriceMonth}
            unit={forecast.unit}
          />
        ) : (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Run a forecast to see Buy / Hold / Sell guidance.
          </div>
        )}
      </div>

      <ChartCard title="Price trend" subtitle="Historical mock curve + short projection">
        <TrendChart data={chartData} />
      </ChartCard>
    </div>
  );
}
