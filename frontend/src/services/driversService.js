// src/services/driversService.js
import api from './apiService';

const driversService = {
    // Get all drivers
    getAllDrivers: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/drivers?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch drivers' };
        }
    },

    // Get driver by ID
    getDriverById: async (id) => {
        try {
            const response = await api.get(`/drivers/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch driver' };
        }
    },

    // Create driver
    createDriver: async (driverData) => {
        try {
            const response = await api.post('/drivers', driverData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create driver' };
        }
    },

    // Update driver
    updateDriver: async (id, driverData) => {
        try {
            const response = await api.put(`/drivers/${id}`, driverData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update driver' };
        }
    },

    // Delete driver
    deleteDriver: async (id) => {
        try {
            const response = await api.delete(`/drivers/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete driver' };
        }
    },

    // Get driver orders
    getDriverOrders: async (id, page = 1, limit = 10) => {
        try {
            const response = await api.get(`/drivers/${id}/orders?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch driver orders' };
        }
    }
};

export default driversService;