import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import SimulationForm from '../components/SimulationForm.jsx';
import Loader from '../components/Loader.jsx';

const initial = {
  farmerName: '',
  location: '',
  landSize: '10',
  soilType: 'Sandy',
  waterAvailability: 'Moderate',
  budget: '250000',
  season: 'Kharif',
  temperature: '28',
  rainfall: '95',
  cropPreference: 'Auto',
};

export default function NewSimulation() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const run = async () => {
    setLoading(true);
    try {
      const payload = {
        farmerName: form.farmerName,
        location: form.location,
        landSize: Number(form.landSize),
        soilType: form.soilType,
        waterAvailability: form.waterAvailability,
        budget: Number(form.budget),
        season: form.season,
        temperature: Number(form.temperature),
        rainfall: Number(form.rainfall),
        cropPreference: form.cropPreference,
      };
      const { data } = await api.post('/simulations/create', payload);
      toast.success('Simulation complete');
      navigate(`/results/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">New simulation</h1>
        <p className="text-slate-600 dark:text-slate-400">Tune inputs — our engine returns crop, economics, and risk.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-farm-100/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark md:p-8"
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/75">
            <Loader label="Running AI simulation…" />
          </div>
        )}
        <SimulationForm
          value={form}
          onChange={setForm}
          onSubmit={run}
          onReset={() => setForm(initial)}
          loading={loading}
        />
      </motion.div>
    </div>
  );
}
