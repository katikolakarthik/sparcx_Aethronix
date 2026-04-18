/**
 * Browser-native speech recognition (no cloud key required).
 * Chrome / Edge: full support. Firefox / Safari: often limited — show a friendly fallback.
 */

const LANG_MAP = {
  en: 'en-US',
  es: 'es-ES',
  hi: 'hi-IN',
  te: 'te-IN',
};

export function getSpeechRecognitionConstructor() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * @param {object} opts
 * @param {string} [opts.lang] - app language code (en, es, hi, te)
 * @param {(text: string) => void} opts.onFinal - final transcript
 * @param {(err: string) => void} opts.onError - error code or 'unsupported'
 * @param {() => void} [opts.onEnd] - recognition ended
 * @returns {SpeechRecognition | null}
 */
export function startVoiceListening({ lang, onFinal, onError, onEnd }) {
  const Ctor = getSpeechRecognitionConstructor();
  if (!Ctor) {
    onError?.('unsupported');
    return null;
  }

  const recognition = new Ctor();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = LANG_MAP[lang] || 'en-US';

  recognition.onresult = (event) => {
    let text = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      if (event.results[i].isFinal) {
        text += event.results[i][0].transcript;
      }
    }
    const trimmed = text.trim();
    if (trimmed) onFinal?.(trimmed);
  };

  recognition.onerror = (e) => {
    onError?.(e.error || 'unknown');
  };

  recognition.onend = () => {
    onEnd?.();
  };

  try {
    recognition.start();
  } catch {
    onError?.('start-failed');
    return null;
  }

  return recognition;
}

export function stopVoiceListening(recognition) {
  if (!recognition) return;
  try {
    recognition.stop();
  } catch {
    try {
      recognition.abort();
    } catch {
      /* ignore */
    }
  }
}
