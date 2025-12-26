import axios from 'axios';

export const axiosInstance = axios.create({
    // Ensure this matches your Express server port (default 5000 in server/src/index.js)
    baseURL:  'https://image-search-l8j6.onrender.com',
    withCredentials: true,
});