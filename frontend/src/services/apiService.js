// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Replace with your API URL

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and not already retrying
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    // No refresh token, redirect to login
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                if (response.data.status === 'success') {
                    // Save the new tokens
                    const { access, refresh } = response.data.data.tokens;
                    localStorage.setItem('accessToken', access.token);
                    localStorage.setItem('refreshToken', refresh.token);

                    // Update the Authorization header
                    originalRequest.headers['Authorization'] = `Bearer ${access.token}`;

                    // Retry the original request
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // Token refresh failed, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;