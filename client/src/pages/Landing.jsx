import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, LineChart, Shield, Droplets, Quote } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const features = [
  {
    title: 'Predictive yield',
    desc: 'Scenario-test acres, soil, and climate before you sow.',
    icon: LineChart,
  },
  {
    title: 'Profit clarity',
    desc: 'Cost, revenue, and net margin in one premium dashboard.',
    icon: Sprout,
  },
  {
    title: 'Risk radar',
    desc: 'Climate mismatch and water stress surfaced as a clear score.',
    icon: Shield,
  },
  {
    title: 'Water smart',
    desc: 'Irrigation posture hints tied to crop water curves.',
    icon: Droplets,
  },
];

const testimonials = [
  {
    quote: 'We cut blind trials on marginal plots. The UI feels like a fintech for farms.',
    name: 'Ananya Rao',
    role: 'Agri-cooperative lead',
  },
  {
    quote: 'Charts my team actually uses. Export to PDF for our lender pack in seconds.',
    name: 'Marcus Chen',
    role: 'Farm operations',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-farm-50 dark:bg-slate-950">
      <Navbar />
      <section className="relative overflow-hidden border-b border-farm-100/80 bg-hero-mesh dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-farm-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-farm-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-farm-200">
              <Sprout className="h-3.5 w-3.5" /> AI-assisted planning
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Smart Farm Simulator
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Predict yield, cost, profit, and risks using AI before cultivation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-farm-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 backdrop-blur hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                Live Demo
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="mt-14 grid gap-4 md:grid-cols-3"
          >
            {['Simulate', 'Compare', 'Export PDF'].map((label, i) => (
              <div
                key={label}
                className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-card-dark"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-farm-700 dark:text-farm-300">Step {i + 1}</p>
                <p className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{label}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Crafted motion, charts, and agronomy cues.</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Why teams choose it</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Premium cards, responsive layout, and a green agronomy palette tuned for clarity.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, desc, icon: Icon }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-farm-100/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
            >
              <div className="mb-3 inline-flex rounded-xl bg-farm-600/10 p-2 text-farm-700 dark:bg-farm-500/15 dark:text-farm-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-farm-100/80 bg-white/60 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Testimonials</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-2xl border border-farm-100/80 bg-gradient-to-br from-farm-50 to-white p-6 shadow-card dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:shadow-card-dark"
              >
                <Quote className="absolute right-4 top-4 h-10 w-10 text-farm-200 dark:text-farm-900" />
                <blockquote className="relative text-slate-700 dark:text-slate-200">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-farm-800 dark:text-farm-300">
                  {t.name}
                  <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">{t.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
