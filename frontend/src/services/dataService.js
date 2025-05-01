// src/services/dataService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';

// Reuse the same axios instance from authService
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const dataService = {
    // Dashboard statistics
    getDashboardStats: async () => {
        try {
            const response = await api.get('/dashboard/stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    },

    // Get top drivers
    getTopDrivers: async (limit = 5) => {
        try {
            const response = await api.get(`/drivers/top?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch top drivers');
        }
    },

    // Get orders with pagination
    getOrders: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/orders?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch orders');
        }
    },

    // Get statistics by month
    getStatsByMonth: async (month, year) => {
        try {
            const response = await api.get(`/stats/monthly?month=${month}&year=${year}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch monthly stats');
        }
    },

    // Drivers
    getAllDrivers: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/drivers?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch drivers');
        }
    },

    getDriverById: async (id) => {
        try {
            const response = await api.get(`/drivers/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch driver');
        }
    },

    createDriver: async (driverData) => {
        try {
            const response = await api.post('/drivers', driverData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create driver');
        }
    },

    updateDriver: async (id, driverData) => {
        try {
            const response = await api.put(`/drivers/${id}`, driverData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update driver');
        }
    },

    deleteDriver: async (id) => {
        try {
            const response = await api.delete(`/drivers/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete driver');
        }
    },

    // Clients
    getAllClients: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/clients?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch clients');
        }
    },

    getClientById: async (id) => {
        try {
            const response = await api.get(`/clients/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch client');
        }
    },

    // Rides/Orders
    getRideDetails: async (id) => {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch ride details');
        }
    },

    updateRideStatus: async (id, status) => {
        try {
            const response = await api.patch(`/orders/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update ride status');
        }
    },

    // Car Classes
    getCarClasses: async () => {
        try {
            const response = await api.get('/car-classes');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch car classes');
        }
    },

    createCarClass: async (carClassData) => {
        try {
            const response = await api.post('/car-classes', carClassData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create car class');
        }
    },

    updateCarClass: async (id, carClassData) => {
        try {
            const response = await api.put(`/car-classes/${id}`, carClassData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update car class');
        }
    },

    deleteCarClass: async (id) => {
        try {
            const response = await api.delete(`/car-classes/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete car class');
        }
    },

    // Branches
    getBranches: async () => {
        try {
            const response = await api.get('/branches');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch branches');
        }
    },

    // Moderators
    getModerators: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/moderators?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch moderators');
        }
    },

    createModerator: async (moderatorData) => {
        try {
            const response = await api.post('/moderators', moderatorData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create moderator');
        }
    },
};

export default dataService;