const DEFAULT_QUERIES = [
  'Best crop for black soil?',
  'Medicine for leaf spots?',
  'When to irrigate cotton?',
  'Best time to sell maize?',
];

export default function QuickActions({ onPick, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_QUERIES.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onPick(q)}
          className="rounded-full border border-farm-200/80 bg-farm-50/90 px-3 py-1.5 text-left text-xs font-medium text-farm-900 transition hover:bg-farm-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-farm-200 dark:hover:bg-slate-700"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
