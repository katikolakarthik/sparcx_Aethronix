import serverless from 'serverless-http';
import { createApp } from '../httpApp.js';

const app = createApp();
const handler = serverless(app);

export default function handlerVercel(req, res) {
  return handler(req, res);
}
