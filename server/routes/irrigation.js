import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { IrrigationPlan } from '../models/IrrigationPlan.js';
import { buildIrrigationPlanMock } from '../utils/irrigationLogic.js';

const router = Router();
router.use(requireAuth);

/** POST /api/irrigation/plan */
router.post('/plan', async (req, res) => {
  try {
    const plan = buildIrrigationPlanMock(req.body);
    const doc = await IrrigationPlan.create({
      userId: req.userId,
      crop: plan.crop,
      landSize: plan.landSize,
      soilType: plan.soilType,
      weather: plan.weather,
      waterSource: plan.waterSource,
      waterNeeded: plan.waterNeeded,
      waterNeededToday: plan.waterNeededToday,
      nextIrrigationDate: plan.nextIrrigationDate,
      schedule: plan.schedule,
      tips: plan.tips,
      droughtWarning: plan.droughtWarning,
      droughtMessage: plan.droughtMessage,
    });
    return res.status(201).json(doc.toObject());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not build irrigation plan' });
  }
});

export default router;
