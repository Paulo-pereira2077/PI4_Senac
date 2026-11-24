import axios from 'axios';
import { Platform } from 'react-native';

const baseURL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'https://cranium-wrangle-slit.ngrok-free.dev';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api;