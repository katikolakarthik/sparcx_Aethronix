/**
 * Not named `app.js` — Vercel’s Express preset treats `app.{js}` as the app entry
 * and expects `export default` of an Express instance there, which would crash.
 */
import express from 'express';
import cors from 'cors';
import { connectDb } from './db.js';
import { getUploadsRoot } from './paths.js';
import authRoutes from './routes/auth.js';
import simulationRoutes from './routes/simulations.js';
import diseaseRoutes from './routes/disease.js';
import storeRoutes from './routes/stores.js';
import marketRoutes from './routes/market.js';
import schemesRoutes from './routes/schemes.js';
import irrigationRoutes from './routes/irrigation.js';
import chatRoutes from './routes/chat.js';
import pestRoutes from './routes/pest.js';
import assistantRoutes from './routes/assistant.js';

function corsOriginOption() {
  const raw = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const list = raw
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  if (list.length === 0) return 'http://localhost:5173';
  return list.length === 1 ? list[0] : list;
}

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: corsOriginOption(),
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.redirect(302, '/api/health');
  });

  /** Liveness only — skips Mongo so deploy / routing can be verified quickly. */
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'smart-farm-simulator-api' });
  });

  app.use(async (_req, _res, next) => {
    try {
      await connectDb();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.use('/uploads', express.static(getUploadsRoot()));

  app.use('/api/auth', authRoutes);
  app.use('/api/simulations', simulationRoutes);
  app.use('/api/disease', diseaseRoutes);
  app.use('/api/stores', storeRoutes);
  app.use('/api/market', marketRoutes);
  app.use('/api/schemes', schemesRoutes);
  app.use('/api/irrigation', irrigationRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/pest', pestRoutes);
  app.use('/api/assistant', assistantRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
