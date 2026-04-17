import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { findNearbyStores } from '../utils/mockStores.js';

const router = Router();
router.use(requireAuth);

/** GET /api/stores/nearby?lat=&lng=&city=&medicine= */
router.get('/nearby', (req, res) => {
  try {
    const { lat, lng, city, medicine } = req.query;
    const neededMedicines = medicine ? String(medicine).split(',').map((s) => s.trim()).filter(Boolean) : [];
    const stores = findNearbyStores({
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      city: city ? String(city) : undefined,
      neededMedicines,
    });
    return res.json({ stores });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not load nearby stores' });
  }
});

export default router;
