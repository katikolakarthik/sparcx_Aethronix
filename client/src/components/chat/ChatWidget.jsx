import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Mic, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import ChatBubble from './ChatBubble.jsx';
import QuickActions from './QuickActions.jsx';

export default function ChatWidget() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your AI farming assistant. Ask about crops, irrigation, disease, or schemes.' },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setLoading(true);
    try {
      const { data } = await api.post('/chat/message', { message: trimmed, lang });
      setMessages((m) => [...m, { role: 'assistant', text: data.response }]);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Chat failed');
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry — I could not reach the assistant service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        layout
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-farm-600 to-teal-600 text-white shadow-lg shadow-farm-900/20 ring-4 ring-white/30 dark:ring-slate-900/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-[60] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-3xl border border-farm-100/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95"
          >
            <div className="border-b border-farm-100/80 bg-gradient-to-r from-farm-600/10 to-teal-600/10 px-4 py-3 dark:border-slate-800">
              <p className="font-display text-sm font-bold text-slate-900 dark:text-white">AI Farmer Assistant</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Telugu / Hindi / English ready · Voice coming soon</p>
            </div>

            <div className="max-h-[min(52vh,360px)] space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((msg, i) => (
                <ChatBubble key={`m-${i}`} role={msg.role === 'user' ? 'user' : 'assistant'}>
                  {msg.text}
                </ChatBubble>
              ))}
              {loading && (
                <p className="text-xs text-slate-500 dark:text-slate-400">Assistant is thinking…</p>
              )}
              <div ref={endRef} />
            </div>

            <div className="space-y-2 border-t border-farm-100/80 bg-farm-50/30 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
              <QuickActions disabled={loading} onPick={(q) => send(q)} />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled
                  title="Voice input — coming soon"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 dark:border-slate-600"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Ask anything…"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-farm-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => send()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-farm-600 to-teal-600 text-white shadow-md disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
