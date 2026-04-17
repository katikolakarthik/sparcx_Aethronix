import { createContext, useContext, useMemo, useState } from 'react';
import { strings } from '../i18n/strings.js';

const LanguageContext = createContext(null);
const KEY = 'sfs_lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(KEY) || 'en');

  const setLanguage = (code) => {
    setLang(code);
    localStorage.setItem(KEY, code);
  };

  const t = (path) => {
    const parts = path.split('.');
    let cur = strings[lang] || strings.en;
    for (const p of parts) {
      cur = cur?.[p];
    }
    if (cur == null) {
      let fb = strings.en;
      for (const p of parts) {
        fb = fb?.[p];
      }
      return fb ?? path;
    }
    return cur;
  };

  const value = useMemo(() => ({ lang, setLanguage, t }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
