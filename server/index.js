/**
 * Local / VPS / Render / Railway entry only.
 * Vercel runs `api/index.js` + rewrites in `vercel.json` (do not rely on root `export default` there).
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
