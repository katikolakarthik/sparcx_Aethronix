import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { MarketPrediction } from '../models/MarketPrediction.js';
import { getCurrentMockPrice, predictMarketMock } from '../utils/marketLogic.js';

const router = Router();
router.use(requireAuth);

/** GET /api/market/prices?crop=&state=&district= */
router.get('/prices', (req, res) => {
  try {
    const { crop = 'Tomato', state = '', district = '' } = req.query;
    const { currentPrice, unit } = getCurrentMockPrice({ crop, state, district });
    const location = [district, state].filter(Boolean).join(', ') || 'India';
    return res.json({ crop, state, district, location, currentPrice, unit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not load prices' });
  }
});

/** POST /api/market/predict */
router.post('/predict', async (req, res) => {
  try {
    const { crop = 'Tomato', state = '', district = '' } = req.body;
    const pred = predictMarketMock({ crop, state, district });
    const doc = await MarketPrediction.create({
      userId: req.userId,
      crop: pred.crop,
      state,
      district,
      location: pred.location,
      currentPrice: pred.currentPrice,
      predictedPriceWeek: pred.predictedPriceWeek,
      predictedPriceMonth: pred.predictedPriceMonth,
      predictedPrice: pred.predictedPrice,
      recommendation: pred.recommendation,
      confidence: pred.confidence,
      trendSeries: pred.trendSeries,
      unit: pred.unit,
    });
    return res.status(201).json(doc.toObject());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Prediction failed' });
  }
});

export default router;
