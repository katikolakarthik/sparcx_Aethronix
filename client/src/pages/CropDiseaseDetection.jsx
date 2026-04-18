import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Activity,
  Brain,
  DollarSign,
  HeartPulse,
  Map as MapIcon,
  Mic,
  RefreshCw,
  Save,
  Scan,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import api, { publicAssetUrl } from '../api/client.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import ImageUploader from '../components/disease/ImageUploader.jsx';
import DetectionCard from '../components/disease/DetectionCard.jsx';
import MedicineCard from '../components/disease/MedicineCard.jsx';
import StoreCard from '../components/disease/StoreCard.jsx';
import SeverityBadge from '../components/disease/SeverityBadge.jsx';
import DetectionHistoryTable from '../components/disease/DetectionHistoryTable.jsx';
import Loader from '../components/Loader.jsx';
import { extractImageFeatures } from '../utils/imageFeatures.js';
import { exportDiseaseScanPdf } from '../utils/exportDiseasePdf.js';
import StoreMapView from '../components/disease/StoreMapView.jsx';

function speakReport(scan, langCode) {
  if (!window.speechSynthesis) {
    toast.error('Voice not supported in this browser');
    return;
  }
  const langMap = { en: 'en-US', es: 'es-ES', hi: 'hi-IN', te: 'te-IN' };
  const text = `Disease ${scan.diseaseName}. Confidence ${scan.confidence} percent. Severity ${scan.severity}. Recommended first medicine: ${
    scan.medicines?.[0]?.name || 'follow agronomist advice'
  }.`;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langMap[langCode] || 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export default function CropDiseaseDetection() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState('detect');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [cropType, setCropType] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState(null);
  const [history, setHistory] = useState(null);

  const loadHistory = useCallback(async () => {
    try {
      const { data } = await api.get('/disease/history');
      setHistory(data);
    } catch {
      toast.error('Could not load history');
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (tab === 'history') loadHistory();
  }, [tab, loadHistory]);

  useEffect(() => {
    const id = searchParams.get('scan');
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/disease/${id}`);
        if (!cancelled) {
          setScan(data);
          setTab('detect');
          toast.success('Loaded saved scan');
        }
      } catch {
        if (!cancelled) toast.error('Could not open scan');
      } finally {
        if (!cancelled) setSearchParams({}, { replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onFile = (f) => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setScan(null);
  };

  const resetAll = () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setScan(null);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Location captured for nearby stores');
      },
      () => toast.error('Location permission denied — enter city manually'),
    );
  };

  const runDetect = async () => {
    if (!file) {
      toast.error('Please upload a crop image first');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data: up } = await api.post('/disease/upload', fd);
      const features = await extractImageFeatures(file);
      const { data } = await api.post('/disease/detect', {
        imageUrl: up.imageUrl,
        features,
        cropType: cropType || undefined,
        latitude: coords?.lat,
        longitude: coords?.lng,
        city: city || undefined,
      });
      setScan(data);
      toast.success('Analysis complete');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-farm-700 dark:text-farm-300">{t('disease.kicker')}</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {t('disease.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{t('disease.subtitle')}</p>
        </div>
        <div className="flex rounded-2xl border border-slate-200 bg-white/80 p-1 dark:border-slate-800 dark:bg-slate-900/80">
          {[
            { id: 'detect', label: t('disease.tabDetect') },
            { id: 'history', label: t('disease.tabHistory') },
          ].map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setTab(x.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === x.id ? 'bg-gradient-to-r from-farm-600 to-teal-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'history' ? (
        <DetectionHistoryTable rows={history} onRefresh={loadHistory} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 rounded-3xl border border-farm-100/80 bg-white/90 p-5 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-card-dark md:grid-cols-3 md:p-6"
          >
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase text-slate-500">Affected / crop type</label>
              <input
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="e.g. Tomato, Rice, Cotton"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase text-slate-500">Village / city</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Nearest town for store routing"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={useMyLocation}
                className="w-full rounded-xl border border-farm-200 bg-farm-50 px-4 py-2.5 text-sm font-semibold text-farm-900 hover:bg-farm-100 dark:border-slate-700 dark:bg-slate-950 dark:text-farm-200 dark:hover:bg-slate-800"
              >
                Use my GPS for distances
              </button>
            </div>
          </motion.div>

          <div className="relative overflow-hidden rounded-3xl border border-farm-100/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark md:p-8">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 backdrop-blur-sm dark:bg-slate-950/80">
                <Loader label="Running AI vision scan…" />
              </div>
            )}
            <ImageUploader file={file} previewUrl={previewUrl} onFile={onFile} onReset={resetAll} disabled={loading} />
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={runDetect}
                className="inline-flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-farm-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95 disabled:opacity-60"
              >
                <Scan className="h-4 w-4" />
                Detect disease
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={resetAll}
                className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <AnimatePresence>
            {scan && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <SeverityBadge level={scan.severity} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Model confidence {scan.confidence}%</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => speakReport(scan, lang)}
                      className="inline-flex items-center gap-2 rounded-xl border border-farm-200 bg-farm-50 px-3 py-2 text-sm font-semibold text-farm-900 dark:border-slate-700 dark:bg-slate-950 dark:text-farm-200"
                    >
                      <Mic className="h-4 w-4" />
                      Voice summary
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toast.success('Report is saved in Disease History');
                        setTab('history');
                        loadHistory();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <Save className="h-4 w-4" />
                      Save report
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          exportDiseaseScanPdf(scan);
                          toast.success('PDF downloaded');
                        } catch {
                          toast.error('PDF failed');
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-farm-600"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <DetectionCard title="Disease detected" value={scan.diseaseName} icon={Brain} delay={0} />
                  <DetectionCard title="Confidence" value={`${scan.confidence}%`} hint="Heuristic vision score" icon={Sparkles} delay={0.04} />
                  <DetectionCard title="Severity" value={scan.severity} icon={Activity} delay={0.08} />
                  <DetectionCard title="Recovery chance" value={`${scan.recoveryChance}%`} icon={HeartPulse} delay={0.12} />
                  <DetectionCard
                    title="Est. treatment cost"
                    value={`₹${scan.estimatedTreatmentCost?.toLocaleString?.() ?? scan.estimatedTreatmentCost}`}
                    icon={DollarSign}
                    delay={0.16}
                  />
                </div>

                <div className="rounded-3xl border border-farm-100/80 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-card-dark">
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Field context</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-farm-800 dark:text-farm-300">Affected crop:</span> {scan.cropType}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-farm-800 dark:text-farm-300">Likely cause:</span> {scan.cause}
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Medicine recommendations</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {(scan.medicines || []).map((m, i) => (
                      <MedicineCard key={m.name} medicine={m} index={i} />
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-slate-900 dark:text-white">
                      <MapIcon className="h-5 w-5 text-farm-600" />
                      Nearby agricultural stores
                    </h2>
                    <div className="grid gap-4">
                      {(scan.stores || []).map((s, i) => (
                        <StoreCard key={s.name + i} store={s} index={i} />
                      ))}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-farm-100/80 bg-slate-900/5 shadow-inner dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="border-b border-slate-200/80 px-4 py-3 text-sm font-semibold text-slate-800 dark:border-slate-800 dark:text-slate-100">
                      Interactive map — pan, zoom, tap pins
                    </p>
                    <StoreMapView key={scan._id} user={coords} stores={scan.stores} />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-farm-100/80 bg-gradient-to-br from-farm-50 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                      <ShieldCheck className="h-5 w-5 text-farm-600" />
                      Prevention tips
                    </h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {(scan.preventionTips || []).map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  <details className="group rounded-3xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/90">
                    <summary className="cursor-pointer font-display text-lg font-semibold text-slate-900 dark:text-white">
                      Healthy vs diseased leaves — quick tips
                    </summary>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li>Healthy tissue shows uniform color and turgor under natural light.</li>
                      <li>Diseased patches often have sharp margins, sporulation, or water-soaked halos.</li>
                      <li>Photograph top and underside; keep camera parallel to the leaf plane.</li>
                      <li>Re-sample after 48h if symptoms evolve — timing improves model confidence.</li>
                    </ul>
                  </details>
                </div>

                {scan.imageUrl && (
                  <div className="overflow-hidden rounded-3xl border border-farm-100/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-bold uppercase text-slate-500">Uploaded evidence</p>
                    <img src={publicAssetUrl(scan.imageUrl)} alt="Stored scan" className="mt-2 max-h-64 w-full rounded-2xl object-contain" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
