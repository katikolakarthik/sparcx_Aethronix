import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, ImagePlus, Trash2 } from 'lucide-react';

export default function ImageUploader({ file, previewUrl, onFile, onReset, disabled }) {
  const inputRef = useRef(null);
  const camRef = useRef(null);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (disabled) return;
      const f = e.dataTransfer?.files?.[0];
      if (f && f.type.startsWith('image/')) onFile(f);
    },
    [disabled, onFile],
  );

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <motion.div
        layout
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-farm-300/80 bg-farm-50/40 p-8 text-center transition dark:border-farm-700/50 dark:bg-slate-900/50 ${
          disabled ? 'pointer-events-none opacity-60' : 'hover:border-farm-500 hover:bg-farm-50/70 dark:hover:bg-slate-900'
        }`}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) inputRef.current?.click();
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
        <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
        <ImagePlus className="mx-auto h-10 w-10 text-farm-600 dark:text-farm-400" />
        <p className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-white">Drag & drop your crop photo</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">PNG, JPG, WebP · max ~8MB</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              camRef.current?.click();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Camera className="h-4 w-4" />
            Use camera
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-farm-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95"
          >
            Browse files
          </button>
        </div>
      </motion.div>

      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-farm-100/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
        >
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Preview</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{file?.name || 'Selected image'}</p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
              Clear image
            </button>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <img src={previewUrl} alt="Crop preview" className="mx-auto max-h-72 w-full max-w-2xl rounded-2xl object-contain" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
