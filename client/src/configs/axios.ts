import axios from 'axios';

const api = axios.create({
    // In production (Render), use relative path
    // In development, use env variable or localhost
    baseURL: import.meta.env.VITE_BASEURL || (
        import.meta.env.PROD ? '' : 'http://localhost:3000'
    ),
    withCredentials: true
});

export default api;