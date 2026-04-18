import { motion } from 'framer-motion';

export default function ChatBubble({ role, children }) {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-farm-600 to-teal-600 text-white'
            : 'border border-slate-200/80 bg-white/95 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}
