import serverless from 'serverless-http';
import { createApp } from '../httpApp.js';

const app = createApp();
const handler = serverless(app);

/** DB connects inside Express after `/` and `/api/health` (see `httpApp.js`). */
export default function handlerVercel(req, res) {
  return handler(req, res);
}
