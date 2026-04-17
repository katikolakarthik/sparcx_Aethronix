import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';

export default function History() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/simulations/all');
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) {
          toast.error('Could not load history');
          setRows([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (rows === null) return <Loader label="Loading history…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">History</h1>
        <p className="text-slate-600 dark:text-slate-400">All simulations stored in MongoDB for your account.</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-farm-200 bg-white/60 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-slate-600 dark:text-slate-300">No simulations yet.</p>
          <Link to="/simulate" className="mt-3 inline-block text-sm font-semibold text-farm-700 hover:underline dark:text-farm-400">
            Run your first simulation
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-farm-100/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900 text-white dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Yield</th>
                  <th className="px-4 py-3">Profit</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-100">{r.location || '—'}</td>
                    <td className="px-4 py-3 font-medium text-farm-800 dark:text-farm-300">{r.recommendedCrop}</td>
                    <td className="px-4 py-3">{r.yield}</td>
                    <td className="px-4 py-3">{r.profit?.toLocaleString?.() ?? r.profit}</td>
                    <td className="px-4 py-3">{r.risk}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/results/${r._id}`} className="text-sm font-semibold text-farm-700 hover:underline dark:text-farm-400">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
