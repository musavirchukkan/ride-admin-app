const axios = require('axios');
const logger = require('../utils/logger');
const { AppError } = require('../utils/appError');
const { RESTRICTED_COUNTRIES } = require('../utils/constants');

/**
 * Get country from IP address using external geolocation API
 * @param {string} ip - IP address to check
 * @returns {Promise<Object>} Country information
 */
exports.getCountryFromIp = async (ip) => {
    try {
        // Use a free geolocation API (replace with your preferred provider)
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);

        if (response.data && response.data.country_code) {
            return {
                countryCode: response.data.country_code,
                country: response.data.country_name,
                isRestricted: RESTRICTED_COUNTRIES.includes(response.data.country_code),
            };
        }

        // Default to allowing access if country can't be determined
        logger.warn(`Could not determine country for IP: ${ip}`);
        return {
            countryCode: 'UNKNOWN',
            country: 'Unknown',
            isRestricted: false,
        };
    } catch (error) {
        logger.error('Error fetching geolocation data:', error);

        // Default to allowing access if API fails
        return {
            countryCode: 'UNKNOWN',
            country: 'Unknown',
            isRestricted: false,
        };
    }
};

/**
 * Check if an IP address is from a restricted country
 * @param {string} ip - IP address to check
 * @returns {Promise<boolean>} True if IP is from a restricted country
 * @throws {AppError} If the country is restricted
 */
exports.checkIfIpIsRestricted = async (ip) => {
    const { countryCode, country, isRestricted } = await this.getCountryFromIp(ip);

    if (isRestricted) {
        throw new AppError(`Access from ${country} (${countryCode}) is restricted`, 403);
    }

    return { countryCode, country };
};

/**
 * Extract IP address from request
 * @param {Object} req - Express request object
 * @returns {string} IP address
 */
exports.getIpFromRequest = (req) => {
    // Get IP from various headers or directly from request
    return (
        req.headers['cf-connecting-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        '127.0.0.1'
    );
};