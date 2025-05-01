// src/services/ordersService.js
import api from './apiService';

const ordersService = {
    // Get all orders with optional filters
    getAllOrders: async (params = {}) => {
        try {
            const { page = 1, limit = 10, status, startDate, endDate, driverId } = params;
            let url = `/orders?page=${page}&limit=${limit}`;

            if (status) url += `&status=${status}`;
            if (startDate) url += `&startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;
            if (driverId) url += `&driverId=${driverId}`;

            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch orders' };
        }
    },

    // Get order by ID
    getOrderById: async (id) => {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch order' };
        }
    },

    // Create order
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create order' };
        }
    },

    // Update order
    updateOrder: async (id, orderData) => {
        try {
            const response = await api.put(`/orders/${id}`, orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update order' };
        }
    },

    // Delete order
    deleteOrder: async (id) => {
        try {
            const response = await api.delete(`/orders/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete order' };
        }
    },

    // Get order statistics
    getOrderStatistics: async () => {
        try {
            const response = await api.get('/orders/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch order statistics' };
        }
    }
};

export default ordersService;