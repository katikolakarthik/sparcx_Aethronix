import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  // Do not set Content-Type globally — it breaks multipart uploads (e.g. disease image).
  // Axios sets application/json for plain objects and multipart boundaries for FormData.
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
