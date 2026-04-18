import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  GitCompare,
  History,
  Settings,
  Bug,
  LineChart,
  Landmark,
  Droplets,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';

const linkClass =
  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium leading-snug transition-colors';

export default function Sidebar({ onNavigate, variant = 'desktop' }) {
  const { t } = useLanguage();
  const isMobile = variant === 'mobile';

  const items = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/simulate', icon: Sprout, label: t('nav.newSim') },
    { to: '/disease', icon: Bug, label: t('nav.diseaseDetection') },
    { to: '/market', icon: LineChart, label: t('nav.market') },
    { to: '/schemes', icon: Landmark, label: t('nav.schemes') },
    { to: '/irrigation', icon: Droplets, label: t('nav.irrigation') },
    { to: '/pest-alerts', icon: ShieldAlert, label: t('nav.pestAlerts') },
    { to: '/compare', icon: GitCompare, label: t('nav.compare') },
    { to: '/history', icon: History, label: t('nav.history') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <aside
      className={`${
        isMobile ? 'flex w-full' : 'hidden w-52 shrink-0 md:flex'
      } flex-col border-r border-farm-100/80 bg-white/90 py-2 dark:border-slate-800 dark:bg-slate-950/90 md:w-56 md:py-5`}
    >
      <nav className="flex flex-col gap-0.5 px-2 md:px-2.5">
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
                <Icon className="h-[18px] w-[18px] shrink-0 md:h-5 md:w-5" />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <motion.span layoutId={`navPill-${variant}`} className="h-1.5 w-1.5 rounded-full bg-white/90" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
