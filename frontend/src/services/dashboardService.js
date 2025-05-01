// src/services/dashboardService.js
import api from './apiService';

const dashboardService = {
    // Get dashboard summary
    getDashboardSummary: async () => {
        try {
            const response = await api.get('/dashboard/summary');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dashboard summary' };
        }
    },

    // Get monthly statistics
    getMonthlyStatistics: async (month, year) => {
        try {
            const response = await api.get(`/dashboard/statistics/${month}/${year}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch monthly statistics' };
        }
    },

    // Get yearly statistics
    getYearlyStatistics: async (year) => {
        try {
            const response = await api.get(`/dashboard/statistics/${year}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch yearly statistics' };
        }
    },

    // Get top drivers
    getTopDrivers: async (limit = 5) => {
        try {
            const response = await api.get(`/dashboard/drivers?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch top drivers' };
        }
    }
};

export default dashboardService;