import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-farm-50/50 dark:bg-slate-950">
      <Navbar onMenu={() => setMobileOpen(true)} />
      <div className="mx-auto flex w-full max-w-[1440px]">
        <Sidebar onNavigate={() => setMobileOpen(false)} />
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <motion.aside
                initial={{ x: -240 }}
                animate={{ x: 0 }}
                exit={{ x: -240 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="absolute left-0 top-0 h-full w-[min(88vw,240px)] border-r border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <span className="font-display font-semibold">Menu</span>
                  <button type="button" className="text-sm text-slate-500" onClick={() => setMobileOpen(false)}>
                    Close
                  </button>
                </div>
                <div className="p-2">
                  <Sidebar variant="mobile" onNavigate={() => setMobileOpen(false)} />
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
