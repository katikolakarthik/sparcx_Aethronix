import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme, toggleTheme } = useTheme();
  const { lang, setLanguage, t } = useLanguage();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(name);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">{t('settings.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('settings.subtitle')}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 rounded-3xl border border-farm-100/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark md:p-8"
      >
        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t('settings.language')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Multi-language ready — extend strings in <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">src/i18n/strings.js</code>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { code: 'en', label: 'English' },
              { code: 'es', label: 'Español' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'te', label: 'తెలుగు' },
            ].map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLanguage(opt.code);
                  toast.success(`Language: ${opt.label}`);
                }}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  lang === opt.code
                    ? 'border-farm-600 bg-farm-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t('settings.theme')}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                theme === 'light' ? 'border-farm-600 bg-farm-50 text-farm-900' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('settings.light')}
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                theme === 'dark' ? 'border-farm-600 bg-slate-900 text-white' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('settings.dark')}
            </button>
            <button type="button" onClick={toggleTheme} className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
              Toggle
            </button>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t('settings.profile')}</h2>
          <form onSubmit={saveProfile} className="mt-3 space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Email (read only)</label>
              <input
                disabled
                className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                value={user?.email || ''}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-farm-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : t('settings.saveProfile')}
            </button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
