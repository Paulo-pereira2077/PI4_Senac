import axios from 'axios';

const baseURL = 'https://cranium-wrangle-slit.ngrok-free.dev';

export const api = axios.create({
  baseURL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api;