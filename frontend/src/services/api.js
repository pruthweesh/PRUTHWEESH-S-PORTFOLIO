import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Deduplicate in-flight concurrent requests to /portfolio
let inFlightPortfolio = null;
const originalGet = api.get;

api.get = function (url, config) {
  if (url === '/portfolio') {
    if (!inFlightPortfolio) {
      inFlightPortfolio = originalGet.call(this, url, config)
        .finally(() => {
          inFlightPortfolio = null; // Clear after completion so future requests get fresh data
        });
    }
    return inFlightPortfolio;
  }
  return originalGet.call(this, url, config);
};

export default api;
