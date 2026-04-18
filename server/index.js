import 'dotenv/config';
import { connectDb } from './db.js';
import { createApp } from './app.js';

const app = createApp();
const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb();
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
