import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TEAM = 'sparcx';
const PROBLEM_ID = '5';

const PROBLEM_TITLE = 'Smart Farm Simulator (AI + Climate + Crop)';

const FARMER_CHALLENGES = [
  'Wrong crop selection based on guesswork',
  'Climate uncertainty and changing rainfall',
  'Low profit due to poor planning',
  'Crop diseases causing heavy losses',
  'Lack of quick guidance on medicines and treatment',
  'Difficulty finding nearby agriculture stores',
];

const SOLUTION_INTRO =
  'Smart Farm Simulator with AI Crop Disease Detection is an intelligent platform that helps farmers:';

const SOLUTION_POINTS = [
  'Predict best crop based on soil, climate, and water',
  'Estimate yield, cost, profit, and risks before cultivation',
  'Detect crop diseases using image upload',
  'Recommend suitable medicines instantly',
  'Find nearest stores with required medicines',
];

const INNOVATION = [
  {
    title: 'AI Crop Strategy Simulator',
    desc: 'Compare crops and choose the most profitable option.',
  },
  {
    title: 'Profit & Risk Prediction',
    desc: 'Know expected profit and farming risk before investing.',
  },
  {
    title: 'AI Disease Detection',
    desc: 'Upload leaf image and detect disease instantly.',
  },
  {
    title: 'Smart Treatment Engine',
    desc: 'Get medicine suggestions, dosage, and safety steps.',
  },
  {
    title: 'Nearest Store Finder',
    desc: 'Locate nearby agri stores with available medicines.',
  },
  {
    title: 'Interactive Dashboard',
    desc: 'Charts, analytics, and simulation history.',
  },
  {
    title: 'Voice Support Ready',
    desc: 'Future support for Telugu / Hindi / English farmers.',
  },
];

function SectionHeading({ kicker, title, subtitle }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="mb-10"
    >
      {kicker ? (
        <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/90">{kicker}</p>
      ) : null}
      <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">{subtitle}</p> : null}
    </motion.header>
  );
}

function BulletList({ items, delayBase = 0 }) {
  return (
    <ul className="flex flex-col gap-3 md:gap-4">
      {items.map((line, i) => (
        <motion.li
          key={line}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: delayBase + 0.04 * i }}
          className="flex gap-3 text-zinc-200"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/90" aria-hidden />
          <span className="text-base leading-relaxed md:text-lg">{line}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function CheckFeature({ title, desc, delay }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className="flex gap-4"
    >
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400 text-white shadow-[0_0_20px_rgba(52,211,153,0.35)]"
        aria-hidden
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="pt-0.5">
        <p className="font-display text-base font-semibold text-white md:text-lg">{title}</p>
        <p className="mt-1 text-base leading-relaxed text-zinc-400 md:text-lg">{desc}</p>
      </div>
    </motion.li>
  );
}

export default function Presentation() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Title */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-32 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center"
        >
          <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.28em] text-amber-300/90">
            Problem statement #{PROBLEM_ID}
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {PROBLEM_TITLE}
          </h1>
        </motion.div>

        <div className="pointer-events-none absolute bottom-10 left-6 flex flex-col gap-2 md:bottom-12 md:left-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-4xl drop-shadow-[0_0_22px_rgba(250,204,21,0.85)] filter md:text-5xl"
            aria-hidden
          >
            💡
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="pointer-events-auto text-left"
          >
            <p className="font-display text-lg font-bold tracking-wide text-amber-200">{TEAM}</p>
            <p className="text-sm text-zinc-400">Team name</p>
          </motion.div>
        </div>

        <Link
          to="/"
          className="pointer-events-auto absolute right-6 top-6 rounded-full border border-zinc-700/80 bg-zinc-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 backdrop-blur transition hover:border-amber-400/50 hover:text-amber-200 md:right-10 md:top-8"
        >
          App home
        </Link>
      </section>

      {/* Farmer challenges */}
      <section className="border-t border-zinc-900 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            kicker="Context"
            title="Farmers face many challenges such as:"
          />
          <BulletList items={FARMER_CHALLENGES} />
        </div>
      </section>

      {/* Our solution */}
      <section className="border-t border-zinc-900 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="text-3xl drop-shadow-[0_0_18px_rgba(250,204,21,0.6)]" aria-hidden>
              💡
            </span>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Our Solution</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mb-8 text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            {SOLUTION_INTRO}
          </motion.p>
          <BulletList items={SOLUTION_POINTS} delayBase={0.08} />
        </div>
      </section>

      {/* Unique features */}
      <section className="border-t border-zinc-900 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            kicker="Differentiators"
            title="Unique Features / Innovation"
          />
          <ul className="flex flex-col gap-8 md:gap-9">
            {INNOVATION.map((item, i) => (
              <CheckFeature key={item.title} {...item} delay={0.05 * i} />
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-6 py-10 text-center text-sm text-zinc-600">
        {TEAM} · Problem statement #{PROBLEM_ID} · {PROBLEM_TITLE}
      </footer>
    </div>
  );
}
