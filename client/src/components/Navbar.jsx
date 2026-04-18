import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mic, Moon, Sun, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getSpeechRecognitionConstructor, startVoiceListening, stopVoiceListening } from '../utils/voiceAssistant.js';

export default function Navbar({ onMenu }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const loadingToastIdRef = useRef(null);
  const voiceCancelledRef = useRef(false);

  const handleVoice = () => {
    if (recognitionRef.current) {
      voiceCancelledRef.current = true;
      stopVoiceListening(recognitionRef.current);
      recognitionRef.current = null;
      if (loadingToastIdRef.current) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }
      toast('Listening stopped.', { icon: '🎙️', duration: 2000 });
      return;
    }

    if (!getSpeechRecognitionConstructor()) {
      toast(
        () => (
          <div className="max-w-xs text-sm">
            <p className="font-semibold text-slate-900 dark:text-white">Voice isn’t available here</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Use <strong>Chrome</strong> or <strong>Edge</strong> for built-in speech-to-text, or connect Azure / Google Cloud Speech in production.
            </p>
          </div>
        ),
        { icon: '🎙️', duration: 6500 },
      );
      return;
    }

    voiceCancelledRef.current = false;
    const loadId = toast.loading('Listening… speak now (tap Voice again to stop)');
    loadingToastIdRef.current = loadId;

    const rec = startVoiceListening({
      lang,
      onFinal: (text) => {
        if (voiceCancelledRef.current) return;
        toast.dismiss(loadId);
        loadingToastIdRef.current = null;
        recognitionRef.current = null;
        if (text) {
          toast.success(`You said: “${text}”`, { icon: '🎙️', duration: 6000 });
        } else {
          toast('No words captured — try again.', { icon: '🎙️' });
        }
      },
      onError: (code) => {
        if (voiceCancelledRef.current) return;
        toast.dismiss(loadId);
        loadingToastIdRef.current = null;
        recognitionRef.current = null;
        if (code === 'aborted') return;
        const hints = {
          'not-allowed': 'Microphone blocked — allow access in the browser address bar.',
          'no-speech': 'No speech heard — try again closer to the mic.',
          'audio-capture': 'No microphone found or it is in use elsewhere.',
          network: 'Network error — check your connection.',
          unsupported: 'Speech recognition not supported in this browser.',
        };
        toast.error(hints[code] || `Voice error: ${code}`);
      },
      onEnd: () => {
        if (voiceCancelledRef.current) {
          voiceCancelledRef.current = false;
          return;
        }
        if (loadingToastIdRef.current) {
          toast.dismiss(loadingToastIdRef.current);
          loadingToastIdRef.current = null;
        }
        recognitionRef.current = null;
      },
    });

    if (rec) recognitionRef.current = rec;
    else {
      toast.dismiss(loadId);
      loadingToastIdRef.current = null;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-farm-100/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 md:px-6">
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
            onClick={handleVoice}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-farm-200 bg-farm-50 px-3 text-sm font-medium text-farm-800 transition hover:bg-farm-100 dark:border-slate-700 dark:bg-slate-900 dark:text-farm-200 dark:hover:bg-slate-800"
            aria-label="Voice: speak to capture text (browser speech recognition)"
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
