import { createApp } from '../httpApp.js';

const app = createApp();

/**
 * Vercel Node function: call Express directly. `serverless-http` can hang here
 * (tab loads forever / black screen) on some Vercel + Express combinations.
 */
export default function handler(req, res) {
  app(req, res);
}
