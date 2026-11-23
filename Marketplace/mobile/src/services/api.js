import axios from 'axios'

const api = axios.create({
    baseURL: 'https://cranium-wrangle-slit.ngrok-free.dev',
    headers: {
        'ngrok-skip-browser-warning': 'true',
    },
});

export default api;