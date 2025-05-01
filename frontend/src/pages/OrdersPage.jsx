// src/pages/OrdersPage.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Plus } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import dataService from '../services/dataService';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch orders when component mounts or when page changes
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // In a real app, you would pass the searchQuery as well
                const response = await dataService.getOrders(currentPage);
                setOrders(response.data);
                setTotalPages(Math.ceil(response.total / response.per_page));
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // Use mock data for now
        setTimeout(() => {
            setOrders([
                {
                    id: 1,
                    user: { name: 'Sierra Ferguson', phone: '+998 (99) 436-46-15', avatar: '/avatars/user-1.jpg' },
                    carComfort: 'simple',
                    orderedTime: '04.12.2021 20:30',
                    startLocation: "nn. Beau Araq, Furkat Street, Tashkent, O'zbekiston",
                    finishLocation: "'nn. Beau Araq, Furkat Street, Tashkent, O'zbekiston",
                    income: '50 300 000 SUM',
                    status: 'completed',
                },
                {
                    id: 2,
                    user: { name: 'Sierra Ferguson', phone: '+998 (99) 436-46-15', avatar: '/avatars/user-2.jpg' },
                    carComfort: 'otra',
                    orderedTime: '04.12.2021 20:34',
                    startLocation: "21 Hamidulla Oripov ko'chasi, Тошкент, O'zbekiston",
                    finishLocation: "21 Hamidulla Oripov ko'chasi, Тошкент, O'zbekiston",
                    income: '300 000 SUM',
                    status: 'in-progress',
                },
            ]);
            setTotalPages(5);
            setLoading(false);
        }, 1000);

        // Commented out for now, will be used with real API
        // fetchOrders();
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        // In a real app, this would trigger a new API call with the search term
        console.log('Searching for:', searchQuery);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Orders</h1>
                <button className="btn btn-primary flex items-center">
                    <Plus size={18} className="mr-2" />
                    New Order
                </button>
            </div>

            {/* Search and filter bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-grow">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="form-input pl-10 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </form>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary flex items-center">
                            <Filter size={18} className="mr-2" />
                            Filter
                        </button>
                        <select className="form-input bg-white cursor-pointer">
                            <option>Status: All</option>
                            <option>Status: Completed</option>
                            <option>Status: In Progress</option>
                            <option>Status: Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
                    {error}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Income
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                                                <img
                                                    src={order.user.avatar}
                                                    alt={order.user.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/32";
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                                                <p className="text-xs text-gray-500">{order.user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{order.carComfort}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{order.orderedTime}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{order.startLocation}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{order.finishLocation}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'in-progress'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {order.status === 'completed'
                                                ? 'Completed'
                                                : order.status === 'in-progress'
                                                    ? 'In Progress'
                                                    : 'Cancelled'
                                            }
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-green-600">{order.income}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{currentPage}</span> of{' '}
                            <span className="font-medium">{totalPages}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                                const pageNum = currentPage <= 2
                                    ? i + 1
                                    : currentPage >= totalPages - 1
                                        ? totalPages - 2 + i
                                        : currentPage - 1 + i;

                                return pageNum <= totalPages ? (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 rounded-md ${currentPage === pageNum
                                            ? 'bg-black text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ) : null;
                            })}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}