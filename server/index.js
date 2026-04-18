import 'dotenv/config';
import { connectDb } from './db.js';
import { createApp } from './httpApp.js';

const app = createApp();

/** Vercel Express (Fluid) expects a default export of the app from `index.js`. */
export default app;

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
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
}
