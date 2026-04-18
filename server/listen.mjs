/**
 * Local / VPS / Render / Railway only — `npm start` / `npm run dev`.
 * Vercel uses `api/main.js` + `vercel.json` rewrites (never name this file `index.js`).
 */
import 'dotenv/config';
import { connectDb } from './db.js';
import { createApp } from './httpApp.js';

const app = createApp();
const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
