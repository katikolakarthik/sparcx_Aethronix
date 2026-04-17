import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-farm-200/60 bg-white/80 py-10 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-farm-600 text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-semibold text-slate-900 dark:text-white">Smart Farm Simulator</p>
            <p className="text-sm text-slate-500">Plan smarter harvests with predictive insights.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
          <Link to="/" className="hover:text-farm-600 dark:hover:text-farm-400">
            Home
          </Link>
          <Link to="/register" className="hover:text-farm-600 dark:hover:text-farm-400">
            Get Started
          </Link>
          <Link to="/login" className="hover:text-farm-600 dark:hover:text-farm-400">
            Login
          </Link>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-slate-400">© {new Date().getFullYear()} Smart Farm Simulator. Demo project.</p>
    </footer>
  );
}
