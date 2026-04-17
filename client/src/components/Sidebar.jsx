import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, GitCompare, History, Settings, Bug } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';

const linkClass =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors';

export default function Sidebar({ onNavigate, variant = 'desktop' }) {
  const { t } = useLanguage();
  const isMobile = variant === 'mobile';

  const items = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/simulate', icon: Sprout, label: t('nav.newSim') },
    { to: '/disease', icon: Bug, label: t('nav.diseaseDetection') },
    { to: '/compare', icon: GitCompare, label: t('nav.compare') },
    { to: '/history', icon: History, label: t('nav.history') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <aside
      className={`${
        isMobile ? 'flex w-full' : 'hidden w-64 shrink-0 md:flex'
      } flex-col border-r border-farm-100/80 bg-white/90 py-2 dark:border-slate-800 dark:bg-slate-950/90 md:py-6`}
    >
      <nav className="flex flex-col gap-1 px-3">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? 'bg-gradient-to-r from-farm-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-farm-50 hover:text-farm-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <motion.span layoutId="navPill" className="h-1.5 w-1.5 rounded-full bg-white/90" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
