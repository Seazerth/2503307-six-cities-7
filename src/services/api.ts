import axios from 'axios';

const API_URL = 'https://7.react.pages.academy/six-cities';
const REQUEST_TIMEOUT = 5000;

export const createAPI = () => axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
});
