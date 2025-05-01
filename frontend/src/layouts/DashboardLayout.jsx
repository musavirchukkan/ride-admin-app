// src/layouts/DashboardLayout.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Bell, Menu, X } from 'lucide-react';
import Icon from '../components/ui/Icon';
import Avatar from '../components/ui/Avatar';
import logoutIcon from '../assets/icons/logout.svg';
import authService from '../services/authService';

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    // Navigation items for the sidebar
    const navigationItems = [
        { name: 'Dashboard', href: '/dashboard', icon: 'chart' },
        { name: 'Orders', href: '/orders', icon: 'order' },
        { name: 'Rides', href: '/rides', icon: 'car' },
        { name: 'Clients', href: '/clients', icon: 'users' },
        { name: 'Drivers', href: '/drivers', icon: 'users' },
        { name: 'Shift', href: '/shift', icon: 'clock' },
        { name: 'Live map', href: '/live-map', icon: 'map' },
        { name: 'Car classes', href: '/car-classes', icon: 'car' },
        { name: 'Branches', href: '/branches', icon: 'branch' },
        { name: 'Moderators', href: '/moderators', icon: 'shield' },
        { name: 'Settings', href: '/settings', icon: 'settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-black transition-transform duration-300 ease-in-out 
                   lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
                    <div className="flex items-center">
                        <Avatar
                            src="/user-avatar.png"
                            alt="User avatar"
                            size="md"
                            status="online"
                        />
                        <div className="ml-3 text-white">
                            <p className="text-sm font-medium">Maharram</p>
                            <p className="text-xs text-gray-400">+998 (99) 436-46-15</p>
                        </div>
                    </div>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar navigation */}
                <div className="mt-2">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                        MAIN MENU
                    </p>
                    <nav className="mt-2">
                        {navigationItems.map((item) => {
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-3 text-sm font-medium relative
                                            ${isActive
                                            ? 'text-white bg-gray-900 before:absolute before:top-0 before:right-0 before:h-full before:w-1 before:bg-blue-500'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-900'}`
                                    }
                                >
                                    <Icon name={item.icon} className="mr-3 h-5 w-5" />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top navigation */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Header content */}
                        <div className="flex-1 flex items-center px-4">
                            <h1 className="text-xl font-semibold text-gray-900">Good morning, Maharram 👋</h1>
                            <div className="ml-4 text-sm text-blue-600">
                                you have 1 new message
                            </div>
                        </div>

                        {/* Right side actions - only logout button */}
                        <div className="flex items-center">
                            <button
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none"
                                onClick={handleLogout}
                            >
                                <img src={logoutIcon} alt="Logout" className="h-5 w-5 mr-2" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node.isRequired,
};