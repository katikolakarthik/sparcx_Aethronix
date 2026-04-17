import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth.js';
import { DiseaseScan } from '../models/DiseaseScan.js';
import { predictDiseaseFromFeatures } from '../utils/diseasePredict.js';
import { findNearbyStores, MOCK_STORES } from '../utils/mockStores.js';

function enrichStores(stores = []) {
  return stores.map((s) => {
    const m = MOCK_STORES.find((x) => x.name === s.name);
    return { ...s, lat: m?.lat, lng: m?.lng };
  });
}

const uploadRoot = path.join(process.cwd(), 'uploads', 'disease');

fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|jpg)$/i.test(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, or WebP images are allowed'));
    }
    cb(null, true);
  },
});

const router = Router();
router.use(requireAuth);

/** POST /api/disease/upload */
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required (field name: image)' });
    }
    const imageUrl = `/uploads/disease/${req.file.filename}`;
    return res.status(201).json({ imageUrl });
  });
});

/** POST /api/disease/detect */
router.post('/detect', async (req, res) => {
  try {
    const { imageUrl, features, cropType, latitude, longitude, city } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }

    const prediction = predictDiseaseFromFeatures(features, cropType);
    const neededMedicines = prediction.medicines.map((m) => m.name);

    const storesRaw = findNearbyStores({
      lat: latitude,
      lng: longitude,
      city,
      neededMedicines,
    });

    const storesForClient = storesRaw.map((s) => ({
      name: s.name,
      distance: s.distance,
      address: s.address,
      availableMedicines: s.availableMedicines,
      isOpen: s.isOpen,
      contactNumber: s.contactNumber,
      lat: s.lat,
      lng: s.lng,
    }));

    const storesForDb = storesForClient.map(({ name, distance, address, availableMedicines, isOpen, contactNumber }) => ({
      name,
      distance,
      address,
      availableMedicines,
      isOpen,
      contactNumber,
    }));

    const doc = await DiseaseScan.create({
      userId: req.userId,
      imageUrl,
      cropType: prediction.cropType,
      diseaseName: prediction.diseaseName,
      confidence: prediction.confidence,
      severity: prediction.severity,
      medicines: prediction.medicines,
      stores: storesForDb,
      cause: prediction.cause,
      preventionTips: prediction.preventionTips,
      recoveryChance: prediction.recoveryChance,
      estimatedTreatmentCost: prediction.estimatedTreatmentCost,
    });

    const payload = doc.toObject();
    return res.status(201).json({
      ...payload,
      stores: storesForClient,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Disease detection failed' });
  }
});

/** GET /api/disease/history */
router.get('/history', async (req, res) => {
  try {
    const list = await DiseaseScan.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    return res.json(list.map((doc) => ({ ...doc, stores: enrichStores(doc.stores || []) })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not load disease history' });
  }
});

/** GET /api/disease/:id */
router.get('/:id', async (req, res) => {
  try {
    const doc = await DiseaseScan.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!doc) return res.status(404).json({ message: 'Scan not found' });
    return res.json({ ...doc, stores: enrichStores(doc.stores || []) });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: 'Scan not found' });
  }
});

export default router;
