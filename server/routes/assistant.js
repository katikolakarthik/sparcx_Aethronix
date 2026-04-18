import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Simulation } from '../models/Simulation.js';
import { DiseaseScan } from '../models/DiseaseScan.js';
import { MarketPrediction } from '../models/MarketPrediction.js';
import { IrrigationPlan } from '../models/IrrigationPlan.js';
import { PestAlert } from '../models/PestAlert.js';
import { SchemeHistory } from '../models/SchemeHistory.js';

const router = Router();
router.use(requireAuth);

/** GET /api/assistant/snapshot — dashboard assistant cards + chart seeds */
router.get('/snapshot', async (req, res) => {
  try {
    const uid = req.userId;

    const [sims, lastDisease, lastMarket, lastIrrigation, lastPest, lastSchemes] = await Promise.all([
      Simulation.find({ userId: uid }).sort({ createdAt: -1 }).limit(20).lean(),
      DiseaseScan.findOne({ userId: uid }).sort({ createdAt: -1 }).lean(),
      MarketPrediction.findOne({ userId: uid }).sort({ createdAt: -1 }).lean(),
      IrrigationPlan.findOne({ userId: uid }).sort({ createdAt: -1 }).lean(),
      PestAlert.findOne({ userId: uid }).sort({ createdAt: -1 }).lean(),
      SchemeHistory.findOne({ userId: uid }).sort({ createdAt: -1 }).lean(),
    ]);

    const bestCropToday =
      sims.length === 0
        ? '—'
        : [...sims].sort((a, b) => (b.profit || 0) - (a.profit || 0))[0]?.recommendedCrop || '—';

    const predictedProfit = sims.reduce((a, s) => a + (s.profit || 0), 0);

    const diseaseAlerts = lastDisease
      ? `${lastDisease.diseaseName} (${lastDisease.severity})`
      : 'No scans yet';

    const marketOpportunity = lastMarket
      ? `${lastMarket.recommendation} · ${lastMarket.crop}`
      : 'Run market predictor';

    const waterNeedToday = lastIrrigation?.waterNeededToday != null ? `${lastIrrigation.waterNeededToday} L` : '—';

    const schemeEligibilityCount = lastSchemes?.results?.length ?? 0;

    const priceTrend =
      lastMarket?.trendSeries?.map((p) => ({ name: p.label, price: p.price, projected: p.projected })) ?? [];

    const waterUsage =
      lastIrrigation?.schedule?.map((s) => ({ name: s.dayLabel, liters: s.liters })) ?? [];

    const pestRiskHistory = await PestAlert.find({ userId: uid }).sort({ createdAt: -1 }).limit(6).lean();
    const pestRiskChart = pestRiskHistory.length
      ? pestRiskHistory.reverse().map((p, i) => ({ name: `R${i + 1}`, risk: p.riskScore }))
      : lastPest
        ? [{ name: 'Now', risk: lastPest.riskScore }]
        : [];

    return res.json({
      bestCropToday,
      predictedProfit,
      diseaseAlerts,
      marketOpportunity,
      waterNeedToday,
      schemeEligibilityCount,
      charts: {
        priceTrend,
        waterUsage,
        pestRisk: pestRiskChart,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Snapshot failed' });
  }
});

export default router;
