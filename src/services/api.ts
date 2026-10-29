import axios from 'axios';

const API_URL = 'https://7.react.pages.academy/six-cities';
const REQUEST_TIMEOUT = 5000;

export const createAPI = () => axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
});

export const TOKEN_KEY = 'six-cities-token';

const api = createAPI();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.set('X-Token', token);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default api;
