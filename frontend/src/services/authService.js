// src/services/authService.js
import api from './apiService';

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
                localStorage.setItem('accessToken', access.token);
                localStorage.setItem('refreshToken', refresh.token);
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
                localStorage.setItem('accessToken', access.token);
                localStorage.setItem('refreshToken', refresh.token);

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
            throw error.response?.data || { message: 'Failed to get user data' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};

export default authService;