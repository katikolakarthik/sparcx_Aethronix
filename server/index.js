import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'smart-farm-simulator-api' });
});

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

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in environment');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET in environment');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
