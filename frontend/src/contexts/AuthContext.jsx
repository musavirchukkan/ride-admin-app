// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const initAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const response = await authService.getCurrentUser();
                    if (response.status === 'success') {
                        setCurrentUser(response.data.user);
                    }
                } catch (err) {
                    console.error('Failed to fetch user data', err);
                    authService.logout(); // Clear invalid token
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register(userData);
            return response;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (email, otpCode, purpose = 'registration') => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.verifyOtp(email, otpCode, purpose);
            if (response.status === 'success' && response.data.user) {
                setCurrentUser(response.data.user);
            }
            return response;
        } catch (err) {
            setError(err.message || 'OTP verification failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            if (response.status === 'success') {
                setCurrentUser(response.data.user);
            }
            return response;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.forgotPassword(email);
            return response;
        } catch (err) {
            setError(err.message || 'Forgot password request failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email, otpCode, newPassword, confirmPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.resetPassword(email, otpCode, newPassword, confirmPassword);
            return response;
        } catch (err) {
            setError(err.message || 'Password reset failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async (email, purpose = 'registration') => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.resendOtp(email, purpose);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to resend OTP');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        error,
        register,
        verifyOtp,
        login,
        forgotPassword,
        resetPassword,
        resendOtp,
        logout,
        isAuthenticated: authService.isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};