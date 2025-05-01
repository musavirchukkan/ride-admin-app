// src/services/apiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/'; // Default to localhost if not set
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to handle token refresh
const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // Make request to refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
        });

        if (response.data.status === 'success') {
            // Save the new tokens
            const { access, refresh } = response.data.data.tokens;
            localStorage.setItem(TOKEN_KEY, access.token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refresh.token);

            return access.token;
        } else {
            throw new Error(response.data.message || 'Failed to refresh token');
        }
    } catch (error) {
        // Clear tokens on refresh failure
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('userId');

        // Redirect to login
        window.location.href = '/login';

        throw error;
    }
};

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
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
                const newToken = await refreshToken();

                // Update the Authorization header
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Token refresh failed, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;