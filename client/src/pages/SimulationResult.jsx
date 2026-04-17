import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Sprout,
  Scale,
  Wallet,
  Banknote,
  PiggyBank,
  AlertOctagon,
  CloudSun,
  Shovel,
  Droplets,
  FileDown,
} from 'lucide-react';
import api from '../api/client.js';
import ResultCard from '../components/ResultCard.jsx';
import Loader from '../components/Loader.jsx';
import { exportSimulationPdf } from '../utils/exportPdf.js';

export default function SimulationResult() {
  const { id } = useParams();
  const [sim, setSim] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPending(true);
      try {
        const { data } = await api.get(`/simulations/${id}`);
        if (!cancelled) setSim(data);
      } catch {
        if (!cancelled) {
          toast.error('Could not load simulation');
          setSim(null);
        }
      } finally {
        if (!cancelled) setPending(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (pending) {
    return <Loader label="Fetching results…" />;
  }

  if (!sim) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-300">Simulation not found or you do not have access.</p>
        <Link to="/history" className="mt-4 inline-block text-sm font-semibold text-farm-700 hover:underline dark:text-farm-400">
          Back to history
        </Link>
      </div>
    );
  }

  const download = () => {
    try {
      exportSimulationPdf(sim);
      toast.success('PDF downloaded');
    } catch {
      toast.error('PDF export failed');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">AI prediction</h1>
          <p className="text-slate-600 dark:text-slate-400">Scenario for {sim.farmerName || 'your farm'} · {sim.location || '—'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-farm-600 dark:hover:bg-farm-500"
          >
            <FileDown className="h-4 w-4" />
            Download report (PDF)
          </button>
          <Link
            to="/simulate"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            New run
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ResultCard title="Recommended crop" value={sim.recommendedCrop} icon={Sprout} delay={0} />
        <ResultCard title="Yield prediction" value={`${sim.yield} tons`} hint="Model estimate for selected acreage" icon={Scale} delay={0.05} />
        <ResultCard title="Estimated cost" value={sim.cost.toLocaleString()} icon={Wallet} delay={0.1} />
        <ResultCard title="Expected revenue" value={sim.revenue.toLocaleString()} icon={Banknote} delay={0.12} />
        <ResultCard title="Net profit" value={sim.profit.toLocaleString()} icon={PiggyBank} delay={0.14} />
        <ResultCard title="Risk score" value={`${sim.risk} / 100`} hint="Higher means more climate / budget stress" icon={AlertOctagon} delay={0.16} />
        <ResultCard title="Climate suitability" value={`${sim.climateSuitability}%`} icon={CloudSun} delay={0.18} />
        <ResultCard title="Soil compatibility" value={`${sim.soilCompatibility}%`} icon={Shovel} delay={0.2} />
        <ResultCard title="Water need status" value={sim.waterNeedStatus} icon={Droplets} delay={0.22} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <div className="rounded-2xl border border-farm-100/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Why this crop</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{sim.recommendationReason}</p>
        </div>
        <div className="rounded-2xl border border-farm-100/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Alternative crops</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {(sim.alternativeCrops || []).map((a) => (
              <li key={a.name} className="flex justify-between rounded-xl bg-farm-50/80 px-3 py-2 dark:bg-slate-800/80">
                <span className="font-medium text-slate-900 dark:text-white">{a.name}</span>
                <span className="text-farm-800 dark:text-farm-300">Est. profit {a.estProfit?.toLocaleString?.() ?? a.estProfit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-farm-100/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Suggested fertilizers</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {(sim.suggestedFertilizers || []).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h2 className="font-display text-lg font-semibold text-amber-900 dark:text-amber-200">Pest warning alerts</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900/90 dark:text-amber-100/90">
            {(sim.pestWarnings || []).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
