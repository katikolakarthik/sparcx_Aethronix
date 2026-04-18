import serverless from 'serverless-http';
import { connectDb } from '../db.js';
import { createApp } from '../app.js';

const app = createApp();
const handler = serverless(app);

export default async function vercelHandler(req, res) {
  try {
    await connectDb();
  } catch (err) {
    const msg =
      err.code === 'CONFIG'
        ? 'Server misconfiguration: set MONGODB_URI and JWT_SECRET on Vercel.'
        : 'Database connection failed.';
    console.error(err);
    res.status(503).json({ ok: false, message: msg });
    return;
  }
  return handler(req, res);
}
