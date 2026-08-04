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

// Cache for portfolio endpoint to prevent multiple concurrent requests
let portfolioPromise = null;
const originalGet = api.get;

api.get = function (url, config) {
  if (url === '/portfolio') {
    if (!portfolioPromise) {
      portfolioPromise = originalGet.call(this, url, config)
        .catch((err) => {
          portfolioPromise = null; // Clear cache on error to allow retries
          throw err;
        });
    }
    return portfolioPromise;
  }
  return originalGet.call(this, url, config);
};

export default api;
