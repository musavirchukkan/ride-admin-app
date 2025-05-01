// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import Avatar from '../components/ui/Avatar';
import dashboardService from '../services/dashboardService';

export default function DashboardPage() {
    // State variables
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        totalEarnings: 0,
        totalProfit: 0,
        activeDrivers: 0,
        currentMonthStats: null
    });
    const [topDrivers, setTopDrivers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    // Calculate month name
    const getMonthName = (month) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1];
    };

    // Get current month and year
    const getCurrentMonthYear = () => {
        const monthStats = dashboardData.currentMonthStats;
        if (monthStats) {
            return `${getMonthName(monthStats.month)} ${monthStats.year}`;
        }

        const now = new Date();
        return `${getMonthName(now.getMonth() + 1)} ${now.getFullYear()}`;
    };

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch dashboard summary - this contains everything we need
                const response = await dashboardService.getDashboardSummary();

                if (response.status === 'success') {
                    // Set all dashboard data from the response
                    setDashboardData({
                        totalOrders: response.data.totalOrders || 0,
                        totalEarnings: response.data.totalEarnings || 0,
                        totalProfit: response.data.totalProfit || 0,
                        activeDrivers: response.data.activeDrivers || 0,
                        currentMonthStats: response.data.currentMonthStats || null
                    });

                    // Set top drivers
                    setTopDrivers(response.data.topDrivers || []);

                    // Set recent orders
                    setRecentOrders(response.data.recentOrders || []);

                    // Calculate total pages for pagination
                    setTotalPages(Math.ceil((response.data.recentOrders?.length || 0) / itemsPerPage));
                } else {
                    setError('Failed to load dashboard data. ' + (response.message || ''));
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Get current orders for pagination
    const getCurrentOrders = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return recentOrders.slice(startIndex, endIndex);
    };

    // Mock chart data - would ideally come from API
    const chartData = [
        { name: 'Jan', average: 40, exams: 24 },
        { name: 'Feb', average: 30, exams: 13 },
        { name: 'Mar', average: 20, exams: 38 },
        { name: 'Apr', average: 27, exams: 30 },
        { name: 'May', average: 18, exams: 35 },
        { name: 'Jun', average: 23, exams: 30 },
        { name: 'Jul', average: 34, exams: 45 },
        { name: 'Aug', average: 40, exams: 60 }, // Current month
    ];

    // Pagination handlers
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Show loading state
    if (loading && !dashboardData.totalOrders && !topDrivers.length) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Knowledge base section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">Knowledge base</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard
                            title="Total Orders"
                            icon="document"
                            iconBgColor="bg-blue-100"
                            iconColor="text-blue-500"
                            linkTo="/orders"
                            value={dashboardData?.totalOrders || 0}
                        />
                        <StatCard
                            title="Total Earnings"
                            icon="wallet"
                            iconBgColor="bg-red-100"
                            iconColor="text-red-500"
                            linkTo="/earnings"
                            value={`$${dashboardData?.totalEarnings?.toFixed(2) || '0.00'}`}
                        />
                        <StatCard
                            title="Profits"
                            icon="chart"
                            iconBgColor="bg-orange-100"
                            iconColor="text-orange-500"
                            linkTo="/profits"
                            value={`$${dashboardData?.totalProfit?.toFixed(2) || '0.00'}`}
                        />
                    </div>

                    {/* Statistics section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Statistic</h3>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="p-1 rounded-md hover:bg-gray-100"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm font-medium">
                                    {getCurrentMonthYear()}
                                </span>
                                <button
                                    className="p-1 rounded-md hover:bg-gray-100"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-base font-medium mb-3">Progress score</h4>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-xs text-gray-600">Average grade</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-gray-600">Exams</span>
                                </div>
                            </div>
                        </div>

                        {error ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
                                {error}
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="average"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ r: 0 }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="exams"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            dot={{ r: 0 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Drivers section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">Top Drivers</h2>
                        <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                            <ArrowRight size={16} className="ml-1" />
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {loading && !topDrivers.length ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        ) : topDrivers.length > 0 ? (
                            <ul>
                                {topDrivers.map((driver, index) => (
                                    <li key={driver.id} className={`px-6 py-4 ${index !== topDrivers.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Avatar
                                                    src={driver.user?.profileImage}
                                                    alt={driver.user?.fullName}
                                                    size="md"
                                                    status={driver.isActive ? "online" : "offline"}
                                                />
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{driver.user?.fullName}</p>
                                                    <p className="text-xs text-gray-500">{driver.user?.phoneNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Orders: <span className="font-medium">{driver.totalTrips || 0}</span></p>
                                                <p className="text-sm">Income: <span className="font-medium">${parseFloat(driver.totalEarnings || 0).toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex justify-center items-center h-64 text-gray-500">
                                No drivers available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Orders table */}
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Car Comfort
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ordered Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Start Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Finish Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Income
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading && !recentOrders.length ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : getCurrentOrders().length > 0 ? (
                                getCurrentOrders().map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Avatar
                                                    size="sm"
                                                />
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{order.client?.fullName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{order.carComfort}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {new Date(order.orderedTime).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-900 truncate block max-w-xs">{order.startLocation}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-900 truncate block max-w-xs">{order.finishLocation}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-green-600">${parseFloat(order.income).toFixed(2)}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No orders available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            {recentOrders.length > 0
                                ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, recentOrders.length)} of ${recentOrders.length} entries`
                                : 'No items to display'}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-md">{currentPage}</span>
                            {totalPages > 1 && currentPage < totalPages && (
                                <span className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                                    {currentPage + 1}
                                </span>
                            )}
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}