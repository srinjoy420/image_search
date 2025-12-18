import axios from 'axios';

export const axiosInstance = axios.create({
    // Ensure this matches your Express server port (default 5000 in server/src/index.js)
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
});