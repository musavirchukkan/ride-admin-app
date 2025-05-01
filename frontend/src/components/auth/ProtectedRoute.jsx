// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ redirectPath = '/login' }) {
    const { isAuthenticated, loading } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Check authentication and redirect if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to={redirectPath} replace />;
    }

    // Render the child routes
    return <Outlet />;
}

ProtectedRoute.propTypes = {
    redirectPath: PropTypes.string,
};