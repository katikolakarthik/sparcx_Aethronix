import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { SchemeHistory } from '../models/SchemeHistory.js';
import { recommendSchemesMock } from '../utils/schemesLogic.js';

const router = Router();
router.use(requireAuth);

/** POST /api/schemes/recommend */
router.post('/recommend', async (req, res) => {
  try {
    const { state, landSize, cropType, farmerCategory } = req.body;
    const results = recommendSchemesMock({ state, landSize, cropType, farmerCategory });
    const doc = await SchemeHistory.create({
      userId: req.userId,
      filters: { state, landSize: Number(landSize) || 0, cropType, farmerCategory },
      results,
    });
    return res.status(201).json(doc.toObject());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not recommend schemes' });
  }
});

export default router;
