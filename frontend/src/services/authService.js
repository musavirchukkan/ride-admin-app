// src/services/authService.js
import api from './apiService';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const authService = {
    // Register a new user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Verify OTP for registration
    verifyOtp: async (email, otpCode, purpose = 'registration') => {
        try {
            const response = await api.post('/auth/verify-otp', {
                email,
                otpCode,
                purpose
            });

            if (response.data.status === 'success' && response.data.data.tokens) {
                // Save tokens if provided
                const { access, refresh } = response.data.data.tokens;
                localStorage.setItem(TOKEN_KEY, access.token);
                localStorage.setItem(REFRESH_TOKEN_KEY, refresh.token);
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'OTP verification failed' };
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);

            if (response.data.status === 'success') {
                // Save tokens
                const { access, refresh } = response.data.data.tokens;
                localStorage.setItem(TOKEN_KEY, access.token);
                localStorage.setItem(REFRESH_TOKEN_KEY, refresh.token);

                // Save user data if needed
                localStorage.setItem('userId', response.data.data.user.id);
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Forgot password
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Forgot password request failed' };
        }
    },

    // Reset password
    resetPassword: async (email, otpCode, newPassword, confirmPassword) => {
        try {
            const response = await api.post('/auth/reset-password', {
                email,
                otpCode,
                newPassword,
                confirmPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Password reset failed' };
        }
    },

    // Resend OTP
    resendOtp: async (email, purpose = 'registration') => {
        try {
            const response = await api.post('/auth/resend-otp', { email, purpose });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to resend OTP' };
        }
    },

    // Get current user data
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            // If unauthorized, clear tokens
            if (error.response && error.response.status === 401) {
                authService.logout();
            }
            throw error.response?.data || { message: 'Failed to get user data' };
        }
    },

    // Refresh token
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await api.post('/auth/refresh-token', { refreshToken });

            if (response.data.status === 'success') {
                // Save the new tokens
                const { access, refresh } = response.data.data.tokens;
                localStorage.setItem(TOKEN_KEY, access.token);
                localStorage.setItem(REFRESH_TOKEN_KEY, refresh.token);

                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to refresh token');
            }
        } catch (error) {
            // Clear tokens on refresh failure
            authService.logout();
            throw error.response?.data || { message: 'Failed to refresh token' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('userId');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // Get token
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Get refresh token
    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
};

export default authService;