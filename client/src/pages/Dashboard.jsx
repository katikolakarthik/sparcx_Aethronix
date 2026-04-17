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
import { Sprout, Coins, AlertTriangle, Layers } from 'lucide-react';
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

export default function Dashboard() {
  const [sims, setSims] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/simulations/all');
        if (!cancelled) setSims(data);
      } catch {
        if (!cancelled) {
          setSims([]);
          toast.error('Could not load dashboard data');
        }
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

  if (sims === null) {
    return <Loader label="Loading dashboard…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Executive snapshot of your simulations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total simulations" value={String(stats.total)} subtitle="All-time runs" icon={Layers} delay={0} />
        <StatCard
          title="Best crop"
          value={stats.bestCrop}
          subtitle="By cumulative profit"
          icon={Sprout}
          accent="from-emerald-500 to-teal-600"
          delay={0.05}
        />
        <StatCard
          title="Predicted profit"
          value={`${stats.profitSum.toLocaleString()}`}
          subtitle="Sum of net profit"
          icon={Coins}
          accent="from-amber-500 to-orange-500"
          delay={0.1}
        />
        <StatCard
          title="Risk level"
          value={stats.risk}
          subtitle={stats.avgRisk != null ? `Avg score ${Math.round(stats.avgRisk)}` : 'No runs yet'}
          icon={AlertTriangle}
          accent="from-rose-500 to-orange-500"
          delay={0.15}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Profit comparison" subtitle="Net profit by recommended crop">
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
