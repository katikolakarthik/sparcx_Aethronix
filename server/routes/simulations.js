import { Router } from 'express';
import { Simulation } from '../models/Simulation.js';
import { requireAuth } from '../middleware/auth.js';
import { runPrediction } from '../utils/predict.js';

const router = Router();

router.use(requireAuth);

/** POST /api/simulations/create */
router.post('/create', async (req, res) => {
  try {
    const {
      farmerName,
      location,
      landSize,
      soilType,
      waterAvailability,
      budget,
      season,
      temperature,
      rainfall,
      cropPreference,
    } = req.body;

    if (!landSize || !soilType || !waterAvailability || budget == null) {
      return res.status(400).json({
        message: 'landSize, soilType, waterAvailability, and budget are required',
      });
    }

    const pred = runPrediction({
      landSize: Number(landSize),
      soilType,
      waterAvailability,
      budget: Number(budget),
      season,
      rainfall: Number(rainfall),
      temperature: Number(temperature),
      cropPreference: cropPreference || 'Auto',
    });

    const doc = await Simulation.create({
      userId: req.userId,
      farmerName: farmerName || '',
      location: location || '',
      landSize: Number(landSize),
      soilType,
      water: waterAvailability,
      budget: Number(budget),
      season: season || '',
      rainfall: Number(rainfall) || 0,
      temperature: Number(temperature) || 0,
      cropPreference: cropPreference || 'Auto',
      recommendedCrop: pred.recommendedCrop,
      yield: pred.yield,
      cost: pred.cost,
      revenue: pred.revenue,
      profit: pred.profit,
      risk: pred.risk,
      climateSuitability: pred.climateSuitability,
      soilCompatibility: pred.soilCompatibility,
      waterNeedStatus: pred.waterNeedStatus,
      recommendationReason: pred.recommendationReason,
      alternativeCrops: pred.alternativeCrops,
      suggestedFertilizers: pred.suggestedFertilizers,
      pestWarnings: pred.pestWarnings,
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not create simulation' });
  }
});

/** GET /api/simulations/all */
router.get('/all', async (req, res) => {
  try {
    const list = await Simulation.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not load simulations' });
  }
});

/** GET /api/simulations/:id */
router.get('/:id', async (req, res) => {
  try {
    const sim = await Simulation.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean();
    if (!sim) {
      return res.status(404).json({ message: 'Simulation not found' });
    }
    return res.json(sim);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: 'Simulation not found' });
  }
});

export default router;
