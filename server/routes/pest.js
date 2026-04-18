import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { PestAlert } from '../models/PestAlert.js';
import { predictPestMock } from '../utils/pestLogic.js';

const router = Router();
router.use(requireAuth);

/** POST /api/pest/predict */
router.post('/predict', async (req, res) => {
  try {
    const { crop, location, season, weather } = req.body;
    const pred = predictPestMock({ crop, location, season, weather });
    const doc = await PestAlert.create({
      userId: req.userId,
      crop: pred.crop,
      location: pred.location,
      season: pred.season,
      weather: pred.weather,
      riskScore: pred.riskScore,
      severity: pred.severity,
      pests: pred.pests,
      preventionTips: pred.preventionTips,
      treatmentNote: pred.treatmentNote,
    });
    return res.status(201).json(doc.toObject());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Pest prediction failed' });
  }
});

export default router;
