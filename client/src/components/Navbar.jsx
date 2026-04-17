import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mic, Moon, Sun, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navbar({ onMenu }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-farm-100/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2">
          {onMenu && (
            <button
              type="button"
              onClick={onMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              aria-label="Open menu"
            >
              <span className="text-lg">☰</span>
            </button>
          )}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-farm-500 to-teal-600 text-white shadow-md">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Smart Farm
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toast('Voice assistant: connect your speech provider here.', { icon: '🎙️' });
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-farm-200 bg-farm-50 px-3 text-sm font-medium text-farm-800 transition hover:bg-farm-100 dark:border-slate-700 dark:bg-slate-900 dark:text-farm-200 dark:hover:bg-slate-800"
            aria-label="Voice assistant placeholder"
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {isAuthenticated ? (
            <>
              <span className="hidden items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:inline-flex">
                <User className="h-4 w-4" />
                {user?.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                  toast.success('Signed out');
                }}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800 dark:bg-farm-600 dark:hover:bg-farm-500"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="inline-flex h-10 items-center rounded-xl bg-gradient-to-r from-farm-600 to-teal-600 px-4 text-sm font-semibold text-white shadow-md hover:opacity-95"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
