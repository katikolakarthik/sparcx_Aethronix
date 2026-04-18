import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Sprout, Coins, AlertTriangle, Layers, LineChart as LineChartIcon, Droplets, Bug, Landmark, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import Loader from '../components/Loader.jsx';

function riskLabel(avg) {
  if (avg == null || Number.isNaN(avg)) return '—';
  if (avg < 35) return 'Low';
  if (avg < 65) return 'Medium';
  return 'High';
}

const EMPTY_SNAPSHOT = {
  bestCropToday: '—',
  predictedProfit: 0,
  diseaseAlerts: 'No scans yet',
  marketOpportunity: 'Run market predictor',
  waterNeedToday: '—',
  schemeEligibilityCount: 0,
  charts: { priceTrend: [], waterUsage: [], pestRisk: [] },
};

export default function Dashboard() {
  const [sims, setSims] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [simRes, snapRes] = await Promise.allSettled([api.get('/simulations/all'), api.get('/assistant/snapshot')]);
      if (cancelled) return;
      if (simRes.status === 'fulfilled') setSims(simRes.value.data);
      else {
        setSims([]);
        toast.error('Could not load simulations');
      }
      if (snapRes.status === 'fulfilled') setSnapshot(snapRes.value.data);
      else {
        setSnapshot(EMPTY_SNAPSHOT);
        toast.error('Assistant snapshot unavailable');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!sims || sims.length === 0) {
      return {
        total: 0,
        bestCrop: '—',
        profitSum: 0,
        risk: '—',
        profitByCrop: [],
        yieldByCrop: [],
        climateSeries: [],
        avgRisk: null,
      };
    }
    const total = sims.length;
    const profitSum = sims.reduce((a, s) => a + (s.profit || 0), 0);
    const byCrop = {};
    sims.forEach((s) => {
      const c = s.recommendedCrop || 'Unknown';
      byCrop[c] = byCrop[c] || { profit: 0, yield: 0, n: 0 };
      byCrop[c].profit += s.profit || 0;
      byCrop[c].yield += s.yield || 0;
      byCrop[c].n += 1;
    });
    const bestCrop = Object.entries(byCrop).sort((a, b) => b[1].profit - a[1].profit)[0]?.[0] || '—';
    const avgRisk = sims.reduce((a, s) => a + (s.risk || 0), 0) / sims.length;
    const profitByCrop = Object.entries(byCrop).map(([name, v]) => ({ name, profit: Math.round(v.profit) }));
    const yieldByCrop = Object.entries(byCrop).map(([name, v]) => ({
      name,
      yield: Number((v.yield / v.n).toFixed(2)),
    }));
    const climateSeries = [...sims]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-8)
      .map((s, i) => ({
        label: `S${i + 1}`,
        rainfall: s.rainfall || 0,
        temperature: s.temperature || 0,
      }));
    return { total, bestCrop, profitSum, risk: riskLabel(avgRisk), profitByCrop, yieldByCrop, climateSeries, avgRisk };
  }, [sims]);

  const snap = snapshot || EMPTY_SNAPSHOT;

  if (sims === null) {
    return <Loader label="Loading dashboard…" />;
  }

  const priceTrend = snap.charts?.priceTrend?.length ? snap.charts.priceTrend : [];
  const waterUsage = snap.charts?.waterUsage?.length ? snap.charts.waterUsage : [];
  const pestRisk = snap.charts?.pestRisk?.length ? snap.charts.pestRisk : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Executive snapshot — simulations plus AI farming assistant signals.</p>
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Best crop today"
          value={snap.bestCropToday || stats.bestCrop}
          subtitle="From simulations & trends"
          icon={Sprout}
          delay={0}
        />
        <StatCard
          title="Predicted profit"
          value={stats.profitSum.toLocaleString()}
          subtitle="Sum of net profit (simulations)"
          icon={Coins}
          accent="from-amber-500 to-orange-500"
          delay={0.04}
        />
        <StatCard
          title="Disease alerts"
          value={snap.diseaseAlerts === 'No scans yet' ? 'None' : snap.diseaseAlerts?.match(/\(([^)]+)\)/)?.[1] || 'New'}
          subtitle={snap.diseaseAlerts || 'Upload a leaf scan'}
          icon={Bug}
          accent="from-violet-500 to-purple-600"
          delay={0.08}
        />
        <StatCard
          title="Market opportunity"
          value={snap.marketOpportunity?.split('·')[0]?.trim() || '—'}
          subtitle={snap.marketOpportunity || 'Open market intelligence'}
          icon={LineChartIcon}
          accent="from-sky-500 to-teal-600"
          delay={0.12}
        />
        <StatCard
          title="Water need today"
          value={snap.waterNeedToday || '—'}
          subtitle="From last irrigation plan"
          icon={Droplets}
          accent="from-cyan-500 to-blue-600"
          delay={0.16}
        />
        <StatCard
          title="Scheme matches"
          value={String(snap.schemeEligibilityCount ?? 0)}
          subtitle="Last subsidy search"
          icon={Landmark}
          accent="from-emerald-600 to-farm-700"
          delay={0.2}
        />
        <StatCard title="Total simulations" value={String(stats.total)} subtitle="All-time runs" icon={Layers} delay={0.22} />
        <StatCard
          title="Climate risk"
          value={stats.risk}
          subtitle={stats.avgRisk != null ? `Avg score ${Math.round(stats.avgRisk)}` : 'No runs yet'}
          icon={AlertTriangle}
          accent="from-rose-500 to-orange-500"
          delay={0.24}
        />
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Assistant analytics</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard title="Price trend" subtitle="Latest market prediction curve">
            {priceTrend.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Run Market Intelligence forecast.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" name="Price" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Water usage" subtitle="Weekly plan from irrigation assistant">
            {waterUsage.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Generate an irrigation plan.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="liters" name="Liters" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Pest risk" subtitle="Recent assessments">
            {pestRisk.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Run a pest alert check.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pestRisk}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="risk" name="Risk score" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Profit comparison" subtitle="Net profit by recommended crop" action={<Activity className="h-4 w-4 text-slate-400" />}>
          {stats.profitByCrop.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Run a simulation to see profit by crop.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.profitByCrop}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" name="Profit" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Crop yield" subtitle="Average predicted yield (tons)">
          {stats.yieldByCrop.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Yield curves appear after your first run.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.yieldByCrop}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="yield" name="Yield (tons)" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard title="Climate trend" subtitle="Rainfall vs temperature across recent simulations">
            {stats.climateSeries.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Climate trend charts populate from your simulation history.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.climateSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#22c55e" strokeWidth={2} dot />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    name="Temp (°C)"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
