import axios from 'axios';

// Ajuste a URL base conforme o seu ambiente.
// Exemplo: se usar emulador de Android (10.0.2.2) ou o IP da sua máquina.
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default api;
