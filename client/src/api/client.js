import axios from 'axios';

/** Public API host without trailing slash. Set in Vercel as VITE_API_ORIGIN (e.g. https://api.example.com). Empty in local dev — Vite proxy serves /api and /uploads. */
const apiOrigin = (import.meta.env.VITE_API_ORIGIN || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: apiOrigin ? `${apiOrigin}/api` : '/api',
  // Do not set Content-Type globally — it breaks multipart uploads (e.g. disease image).
  // Axios sets application/json for plain objects and multipart boundaries for FormData.
});

/**
 * Resolve paths like `/uploads/disease/...` to the deployed API origin in production.
 * @param {string} [path]
 */
export function publicAssetUrl(path) {
  if (!path || typeof path !== 'string') return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!apiOrigin) return path;
  return path.startsWith('/') ? `${apiOrigin}${path}` : `${apiOrigin}/${path}`;
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
