import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAssetUrl } from '../../api/client.js';

export default function DetectionHistoryTable({ rows, onRefresh }) {
  if (!rows?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-farm-200 bg-white/60 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-slate-600 dark:text-slate-300">No disease scans yet.</p>
        <p className="mt-2 text-sm text-slate-500">Run a detection to build your agronomy audit trail.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-farm-100/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <p className="font-display font-semibold text-slate-900 dark:text-white">Saved scans</p>
        {onRefresh && (
          <button type="button" onClick={onRefresh} className="text-sm font-semibold text-farm-700 hover:underline dark:text-farm-400">
            Refresh
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900 text-white dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Crop</th>
              <th className="px-4 py-3">Disease</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Thumb</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-800 dark:text-slate-100">{r.cropType}</td>
                <td className="px-4 py-3 font-medium text-farm-800 dark:text-farm-300">{r.diseaseName}</td>
                <td className="px-4 py-3">{r.confidence}%</td>
                <td className="px-4 py-3">{r.severity}</td>
                <td className="px-4 py-3">
                  <Link to={`/disease?scan=${r._id}`} className="inline-flex items-center gap-2">
                    <img src={publicAssetUrl(r.imageUrl)} alt="" className="h-12 w-12 rounded-lg border border-slate-200 object-cover dark:border-slate-700" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
