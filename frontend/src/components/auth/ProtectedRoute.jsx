// src/components/auth/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

export default function ProtectedRoute() {
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            setIsValidating(true);

            try {
                // Check if token exists
                if (!authService.isAuthenticated()) {
                    setIsAuthenticated(false);
                    setIsValidating(false);
                    return;
                }

                // Verify token by making a request to /auth/me endpoint
                const response = await authService.getCurrentUser();

                if (response.status === 'success') {
                    setIsAuthenticated(true);
                } else {
                    // If verification fails, clear token and redirect to login
                    authService.logout();
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                // If any error occurs, assume token is invalid
                authService.logout();
                setIsAuthenticated(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [navigate]);

    // Show loading state while validating
    if (isValidating) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-medium text-gray-700">Authenticating...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render protected routes if authenticated
    return <Outlet />;
}