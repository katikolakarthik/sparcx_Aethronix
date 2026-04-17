import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../components/ChartCard.jsx';

const crops = [
  { name: 'Rice', cost: 185000, yield: 42, profit: 118000, water: 'High', risk: 38 },
  { name: 'Cotton', cost: 210000, yield: 16, profit: 142000, water: 'Moderate', risk: 52 },
  { name: 'Maize', cost: 142000, yield: 34, profit: 105600, water: 'Moderate', risk: 44 },
];

const chartProfit = crops.map((c) => ({ name: c.name, profit: c.profit / 1000 }));
const chartRisk = crops.map((c) => ({ name: c.name, risk: c.risk }));

export default function CompareCrops() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Compare crops</h1>
        <p className="text-slate-600 dark:text-slate-400">Rice, cotton, and maize — benchmarked on a 100-acre reference block.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-farm-100/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-farm-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Crop</th>
                <th className="px-4 py-3 font-semibold">Cost</th>
                <th className="px-4 py-3 font-semibold">Yield (tons)</th>
                <th className="px-4 py-3 font-semibold">Profit</th>
                <th className="px-4 py-3 font-semibold">Water need</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((row) => (
                <tr key={row.name} className="border-t border-slate-100 odd:bg-farm-50/40 dark:border-slate-800 dark:odd:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.yield}</td>
                  <td className="px-4 py-3 text-farm-800 dark:text-farm-300">{row.profit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.water}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Profit snapshot" subtitle="Thousands (reference block)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartProfit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" name="Profit (k)" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Risk posture" subtitle="Heuristic risk score (lower is calmer)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRisk}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="risk" name="Risk" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
