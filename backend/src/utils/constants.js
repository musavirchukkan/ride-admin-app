/**
 * Application-wide constants
 */

// User roles
exports.ROLES = {
    ADMIN: 'admin',
    DRIVER: 'driver',
    USER: 'user',
};

// Authentication-related constants
exports.AUTH = {
    // OTP purpose types
    OTP_PURPOSE: {
        REGISTRATION: 'registration',
        PASSWORD_RESET: 'password_reset',
    },
    // OTP expiration time in minutes
    OTP_EXPIRATION_MINUTES: 15,
};

// Default pagination values
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

// Order status values
exports.ORDER_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// Car comfort levels
exports.CAR_COMFORT = {
    BASIC: 'basic',
    STANDARD: 'standard',
    PREMIUM: 'premium',
    LUXURY: 'luxury',
};

// List of restricted countries (ISO codes)
exports.RESTRICTED_COUNTRIES = process.env.RESTRICTED_COUNTRIES
    ? process.env.RESTRICTED_COUNTRIES.split(',')
    : ['SY', 'AF', 'IR', 'KP', 'CU'];