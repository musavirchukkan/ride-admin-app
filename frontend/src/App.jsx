// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import RidesPage from './pages/RidesPage';
import ClientsPage from './pages/ClientsPage';
import DriversPage from './pages/DriversPage';
import ShiftPage from './pages/ShiftPage';
import LiveMapPage from './pages/LiveMapPage';
import CarClassesPage from './pages/CarClassesPage';
import BranchesPage from './pages/BranchesPage';
import ModeratorsPage from './pages/ModeratorsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/rides" element={<RidesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/shift" element={<ShiftPage />} />
            <Route path="/live-map" element={<LiveMapPage />} />
            <Route path="/car-classes" element={<CarClassesPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/moderators" element={<ModeratorsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Page not found</p>
                <a
                  href="/dashboard"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;