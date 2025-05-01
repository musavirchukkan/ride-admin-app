const jwt = require('jsonwebtoken');
const { AppError } = require('./appError');

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (usually contains user ID and role)
 * @returns {string} JWT token
 */
exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h',
    });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload (usually contains user ID)
 * @returns {string} JWT refresh token
 */
exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {AppError} If token is invalid or expired
 */
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Token has expired', 401);
        }
        throw new AppError('Invalid token', 401);
    }
};

/**
 * Generate token response containing access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Token response
 */
exports.generateTokenResponse = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({ id: user.id });

    return {
        access: {
            token: accessToken,
            expires: process.env.JWT_ACCESS_EXPIRATION || '1h',
        },
        refresh: {
            token: refreshToken,
            expires: process.env.JWT_REFRESH_EXPIRATION || '7d',
        },
    };
};